const monthYear = document.querySelector(".month-year");
const todayDate = new Date();
const date = new Date();
const day = document.querySelector('.day:nth-child(' + date.getDate() + ')');

const getMonthName = (month) => {
    switch (month) {
        case 0 | 'Jan':
          return "January";
        case 1 | 'Feb':
          return "February";
        case 2 | 'Mar':
          return "March";
        case 3 | 'Apr':
          return "April";
        case 4 | 'May':
          return "May";
        case 5 | 'Jun':
          return "June";
        case 6 | 'Jul':
          return "July";
        case 7 | 'Aug':
          return "August";
        case 8 | 'Sep':
          return "September";
        case 9 | 'Oct':
          return "October";
        case 10 | 'Nov':
          return "November";
        case 11 | 'Dec':
          return "December";
      }
};



const renderCalander = () => {
    const today = date.getDate();
    const month = getMonthName(date.getMonth());
    const year = date.getFullYear();

    // console.log(today, month, year);
    
    monthYear.innerText = `${month} ${year}`;

    let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    
    console.log(firstDayOfMonth);
    /*
        @dateOfMonth: Variable to keep track of the date of the month
    */
    let dateOfMonth = 1; 
    let daysBeforeStartOfMonth = 1;
    
    while (daysBeforeStartOfMonth < firstDayOfMonth) {
        const updateday = document.querySelector('.day:nth-child(' + daysBeforeStartOfMonth + ')');
        updateday.innerText = '';
        daysBeforeStartOfMonth++;
    }

    while (dateOfMonth <= new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) {
            if (firstDayOfMonth === 0) {
                firstDayOfMonth = 7;
            }
            const updateday = document.querySelector('.day:nth-child(' + firstDayOfMonth + ')');
            // console.log(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());
            if (updateday) {
                updateday.innerText = dateOfMonth;
            }
            // updateday.innerText = dateOfMonth;
            dateOfMonth++;
            firstDayOfMonth++;
    }
    console.log(firstDayOfMonth)

    let daysAfterEndOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    console.log(daysAfterEndOfMonth)
    while (daysAfterEndOfMonth <= 42) {
        const updateday = document.querySelector('.day:nth-child(' + daysAfterEndOfMonth + ')');
        updateday.innerText = '';
        daysAfterEndOfMonth++;
    }
    // console.log(new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0).getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1);
};


function prev() {
    new Date(date.setMonth(date.getMonth() - 1));

    renderCalander();
}

function next() {
    new Date(date.setMonth(date.getMonth() + 1));
    renderCalander();
}

function currentDate() {
    new Date(date.setDate(todayDate.getDate()), date.setMonth(todayDate.getMonth()), date.setFullYear(todayDate.getFullYear()));
    renderCalander();
}

function highlightTodaysDate(){
    day.classList.add('today');
}

function updateHighlight(){
    const time = todayDate.getHours() + ":" + todayDate.getMinutes() + ":" + todayDate.getSeconds();
    if (time === '00:00:00') {
        day.classList.remove('today');
        highlightTodaysDate();
    }
}


renderCalander();
highlightTodaysDate();
setInterval(updateHighlight, 1000);