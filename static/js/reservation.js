const daysContainer = document.querySelector(".days");
const month = document.querySelector(".month");

// 현재 날짜
const date = new Date();
// 현재 월
let currentMonth = date.getMonth();
// 현재 년
let currentYear = date.getFullYear();

function renderCalendar() {
    // 이전 달, 현재 달, 다음 달의 날짜 가져오기
    date.setDate(1); // 1일로 설정
    const firstDay = new Date(currentYear, currentMonth, 1); // Fri Mar 01 2024 00:00:00 GMT+0900 (한국 표준시)
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const lastDayIndex = lastDay.getDay(); // 0
    // 현재 달 마지막 날짜
    const lastDayDate = lastDay.getDate(); //31
    // 이전 달 마지막 날
    const prevLastDay = new Date(currentYear, currentMonth, 0); //Thu Feb 29 2024 00:00:00 GMT+0900 (한국 표준시)
    // 이전 달 마지막 날짜
    const prevLastDayDate = prevLastDay.getDate(); // 29
    // 현재 캘린더에 보여줄 다음달 날짜 수 (1 ~ nextDays)
    const nextDays = 7 - lastDayIndex - 1; // 6

    // 캘린더 헤더에 현재 년도, 월 update
    month.innerHTML = `${currentYear} ${currentMonth + 1}월`;

    let days = "";

    // 남는 공간에 이전 달의 날짜 추가
    for (let i = firstDay.getDay(); i > 0; i--) {
        days += `<div class="day prev">${prevLastDayDate - i + 1}</div>`;
    }

    // 현재 달의 날짜 추가
    for (let i = 1; i <= lastDayDate; i++) {
        // 현재 날짜에는 "today" 클래스 추가된 날짜 추가
        if (
            i === new Date().getDate() &&
            currentMonth === new Date().getMonth() &&
            currentYear === new Date().getFullYear()
        ) {
            days += `<div class="day cur today">${i}</div>`;
        } else {
            // else "today" 클래스 추가 안함
            days += `<div class="day cur">${i}</div>`;
        }
    }

    // 남는 공간에 다음 달의 날짜 추가
    for (let i = 1; i <= nextDays; i++) {
        days += `<div class="day next">${i}</div>`;
    }

    daysContainer.innerHTML = days;
    selectDay(currentYear, currentMonth);
}

renderCalendar();

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function goToday() {
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();
    renderCalendar();
}

function selectDay(selectYear, selectMonth) {
    const allDays = document.querySelectorAll(".days .day.cur");
    const yearMonth = selectYear + "-" + (selectMonth + 1);
    allDays.forEach(function (day) {
        day.addEventListener("click", function () {
            allDays.forEach(function (day) {
                day.classList.remove("today");
            });
            this.classList.add("today");
            getValue(yearMonth, this);
        });
    });
}

function getValue(yearMonth, day) {
    const dayValue = yearMonth + "-" + day.textContent;
    console.log("getValue result : ", dayValue);
}
