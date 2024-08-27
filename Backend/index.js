const express = require('express');
const sql = require('mssql');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 1000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// SQL Server configuration
const config = {
    user: 'machine datas',
    password: 'das',
    server: 'MSI',
    database: 'Mach',
    dialect: "mssql",
    options: {
        encrypt: true,
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        instancename: 'SQL EXPRESS',
    }
};

// Connect to SQL Server
sql.connect(config)
    .then(pool => {
        if (pool.connecting) {
            console.log('Connecting to SQL Server...');
        } else {
            console.log('Connected to SQL Server!');
        }
    })
    .catch(err => {
        console.error('SQL Server connection error:', err);
    });

//  parse process_cycle_time
function parseTimeString(timeString) {
    const regex = /(?:(\d+)m)?(?:(\d+)s)?(?:(\d+)ms)?/;
    const matches = regex.exec(timeString);
    const minutes = matches[1] || '0';
    const seconds = matches[2] || '0';
    const milliseconds = matches[3] || '0';
    return { minutes, seconds, milliseconds };
}

//  fetch and calculate total time for a range
async function fetchRange(start, end, date) {
    let total = 0;
    for (let i = start; i <= end; i++) {
        const timeVariable = i.toString().padStart(2, '0');

        const result = await sql.query(`
            SELECT process_cycle_time 
            FROM axe 
            WHERE LEFT(Time, 2) = '${timeVariable}'
        `);

        const calculateTotalMilliseconds = (data) => {
            const convertToMilliseconds = (minutes, seconds, milliseconds) => {
                return (parseInt(minutes) * 60000) + (parseInt(seconds) * 1000) + parseInt(milliseconds);
            };
            return data.reduce((total, item) => {
                const { minutes, seconds, milliseconds } = parseTimeString(item.process_cycle_time);
                return total + convertToMilliseconds(minutes, seconds, milliseconds);
            }, 0);
        };

        total += calculateTotalMilliseconds(result.recordset);
    }
    return total;
}


// API route for performing calculations
app.get('/api/perform-calculation', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

        const post1Total = ((await fetchRange(6, 14, today) * 100) / 3600000) / 8;
        const post2Total = ((await fetchRange(15, 21, today) * 100) / 3600000) / 8;
        const post3Total = await fetchRange(22, 23, today);
        const post4Total = await fetchRange(0, 5, tomorrow);
        const combinedPost3And4Total = post3Total + post4Total;
        const post3And4Total = ((combinedPost3And4Total * 100) / 3600000) / 8;

        const total = post1Total + post2Total + post3And4Total;

        res.json({
            post1Total,
            post2Total,
            post3And4Total,
            totalMilliseconds: total
        });
    } catch (error) {
        console.error('Error in /api/perform-calculation:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});
// tableau du base 
app.get('/data', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM axe');
        
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL query error:', err);
        res.status(500).send('Server error');
    }
})
// nb flan par heure
app.get('/nb_flan_h', async (req, res) => {
    try {
        const result = await sql.query('SELECT Time, Date FROM axe');
        const data = result.recordset;

      
        const counts = [];

        
        data.forEach(item => {
            const time = item.Time;
            const date = item.Date;
            const hour = time.substring(0, 2); // Get the first two digits (HH)

            // Find if there's already an entry for this hour and date
            const existingEntry = counts.find(entry => entry.hour === hour && entry.date === date);

            if (existingEntry) {
                // Increment the count for this hour and date
                existingEntry.count += 1;
            } else {
                // Add a new entry for this hour and date
                counts.push({ hour, count: 1, date });
            }
        });

        res.json(counts);
    } catch (error) {
        console.error('Error in /api/count-by-hour:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});
let timeVariable = '06'; // Default value

//  set timeVariable
function setTimeVariable(newTime) {
    timeVariable = newTime;

}
app.get('/api/items', (req, res) => {
    res.json([{ /* your data here */ }]);
});
app.post('/set-time', express.json() ,  (req, res) => {
    const { time } = req.body; 
        setTimeVariable(time);
        res.send(`Time variable set to ${timeVariable}`);
        console.log(req.body)
        console.log(timeVariable) 
    
});
// trg par h 
app.get('/trg_h', async (req, res) => {
    try {
        const request = new sql.Request();
        request.input('timeVariable', sql.VarChar, timeVariable);
        
        const result = await request.query(`
            SELECT process_cycle_time 
            FROM axe 
            WHERE LEFT(Time, 2) = @timeVariable
        `);
        

        // Parse each process_cycle_time value
        const parsedData = result.recordset.map(row => ({
            process_cycle_time: row.process_cycle_time,
            ...parseTimeString(row.process_cycle_time)
        }));

        res.json(parsedData);
    } catch (err) {
        console.error('SQL query error for /trg_h:', err);
        res.status(500).send('Server error');
    }
});
app.get('/total-counts', async (req, res) => {
    try {
        
        const result = await sql.query('SELECT Time FROM axe');
        const data = result.recordset;
    
        // Initialize the totals for each post
        let post1Sum = 0;
        let post2Sum = 0;
        let post3Sum = 0;
    
        // Sum the values for each post range
        data.forEach((item) => {
          const hour = parseInt(item.Time.substring(0, 2)); // Extract the hour part
    
          // Post 1: Hours 6 to 13
          if (hour >= 6 && hour <= 13) {
            post1Sum += 1; // Assuming each occurrence counts as 1
          }
    
          // Post 2: Hours 14 to 21
          if (hour >= 14 && hour <= 21) {
            post2Sum += 1;
          }
    
          // Post 3: Hours 22 to 23 and 00 to 05
          if (hour >= 22 || hour <= 5) {
            post3Sum += 1;
          }
        });
    
        // Send the results as JSON
        res.json({
          post1Total: post1Sum,
          post2Total: post2Sum,
          post3Total: post3Sum,
        });
      } catch (error) {
        console.error('Error fetching hour counts:', error);
        res.status(500).send('Error fetching hour counts');
      }
  });
  




// Serve the React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
