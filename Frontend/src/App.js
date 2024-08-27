import {useState} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Topbar from "./scenes/global/appbar";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {ColorModeContext, useMode} from "./theme";
import Sideebar from "./scenes/global/sideebar";
import MyComponent from "./data/data";
import TimeSelector from "./components/TRG_h";
import TimeAggregator from "./components/trg_hcal";
import Trgpost from "./components/trg_p";
import BarChartComponent from "./components/barchart" ; 
import CountByHour from "./components/nb_flan_h";
import LineChartComponent from "./components/linechartflan";
import Barflan from "./components/barchartflan";
import Menutable from "./data/data";
import OuterComponent from "./dashboardmenu/outercomp";






function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <div className="app">
          <Sideebar isSidebar={isSidebar} />
            <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            
            <Routes>
            <Route path="/" element={<OuterComponent/>} />
            <Route path="/data" element={<MyComponent />} />
            <Route path="/pie" element={<TimeSelector />} />
            <Route path="/bar" element={<BarChartComponent/>} />
            <Route path="/calc" element={<Trgpost/>} />
            <Route path="/lineflan_h" element={<CountByHour/>} />
            <Route path="/form" element={<Barflan/>} />
            </Routes>
           
              
              

              

            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
  );
}

export default App;

