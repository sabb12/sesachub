const daysContainer = document.querySelector(".days");
const month = document.querySelector(".month");

// 현재 날짜
const date = new Date();
// 현재 월
let currentMonth = date.getMonth();
// 현재 년
let currentYear = date.getFullYear();
let selected = ["", ""];

const kstToday = new Date(date.getTime() + 9 * 60 * 60 * 1000); // 한국 표준시 기준
selected[0] = kstToday.toISOString().slice(0, 10);

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
            getCalendarValue(yearMonth, this);
        });
    });
}
function dayReset() {
    let selectElement = document.getElementById("count_person");
    document.querySelectorAll("input[type=radio]").forEach((radio) => {
        radio.checked = false;
    });
}

// 날짜 선택 이벤트
function getCalendarValue(yearMonth, day) {
    let dayValue;
    let year = yearMonth.split("-")[0];
    let month = yearMonth.split("-")[1];
    let newDay;
    if (day.textContent < 10 || month < 10) {
        if (day.textContent < 10) {
            newDay = 0 + day.textContent;
        } else {
            newDay = day.textContent;
        }
        if (month < 10) {
            month = 0 + month;
        }
        dayValue = year + "-" + month + "-" + newDay;
    } else {
        dayValue = year + "-" + month + "-" + newDay;
    }

    selected[0] = dayValue;
    selected[1] = "";
    selected[2] = "";
    selected[3] = "";
    dayReset();

    if (selected[1]) dayRoomChoice(selected[0], selected[1]);
}

// 공간 선택 이벤트
function getRoomValue() {
    const roomInputs = document.querySelectorAll("input[type=radio]");
    const timeDivs = document.querySelectorAll(".time_wrapper div");

    roomInputs.forEach((input) => {
        input.addEventListener("change", function () {
            if (this.checked) {
                selected[1] = this.value;
            }
            // 공간 선택 시 시간 div의 스타일 초기화
            timeDivs.forEach((div) => {
                div.classList.remove("selected_time");
                selected[2] = "";
                dayRoomChoice(selected[0], selected[1]);
            });
            reserveList(selected[0], selected[1]);
        });
    });
}
getRoomValue();
async function reserveList(day, st_room) {
    const res = await axios({
        method: "get",
        url: "/admin/reserve",
        params: { day: day, st_room: st_room },
    });
    const reserveListDiv = document.querySelector(".reserve_body");
    let html = "";

    // 받아온 JSON 데이터를 반복하여 HTML 생성
    if(res.data.length===0){
        html +=` <div class="noData"><h1>😫해당 날짜에는 예약이 없습니다.</h1></div>`
    }
    res.data.forEach((item) => {
        html += `
                <tr class="reserve_item">
                <td class="user_id">${item.u_id}</td>
                    <td class="user_id">${item.user.name}</td>
                    <td class="reserve_date"> ${item.day}</td>
                    <td class="room">${item.st_room}</td>
                    <td class="time">${item.time}</td>
                    <td><button onclick="reserve(${item.r_id})">예약취소</button></td>
                </tr>

`;
    });

    // 생성된 HTML을 reserveListDiv에 추가
    reserveListDiv.innerHTML = html;
}
async function reserve(r_id) {
    const deleteConfirm = confirm("정말삭제하시겠습니까?");
    if (deleteConfirm) {
        const res = await axios({
            method: "delete",
            url: "/admin/reserve",
            params: { r_id: r_id },
        });
        console.log(res.data.result);
        if (res.data.result === true) {
            alert("삭제 되었습니다.");
            location.reload();
        } else {
            alert("삭제하는 과정에서 문제가 발생하였습니다.");
        }
    } else {
        alert("예약취소를 실패 하였습니다.");
    }
}
