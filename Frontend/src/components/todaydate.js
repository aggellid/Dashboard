// todaydate.js

function getTodayDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); //two digits
    const month = String(today.getMonth() + 1).padStart(2, '0'); // two digits
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
}

function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // next day
    const day = String(tomorrow.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0'); // Ensure two digits
    const year = tomorrow.getFullYear();

    return `${day}/${month}/${year}`;
}

module.exports = { getTodayDate, getTomorrowDate };


