const daysContainer = document.querySelector(".days");
const month = document.querySelector(".month");

// 현재 날짜
const date = new Date();
// 현재 월
let currentMonth = date.getMonth();
// 현재 년
let currentYear = date.getFullYear();
let selected = ["", "", "", ""];

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

/* --------------------------------------- 이벤트 --------------------------------------- */

// 날짜 선택 이벤트
function getCalendarValue(yearMonth, day) {
    const dayValue = yearMonth + "-" + day.textContent;
    selected[0] = dayValue;
    selected[1] = "";
    selected[2] = "";
    selected[3] = "";
    document.querySelectorAll("input[type=radio]").forEach((radio) => {
        radio.checked = false;
    });
}

// 공간 선택 이벤트
function getRoomValue() {
    const roomInputs = document.querySelectorAll("input[type=radio]");
    const timeDivs = document.querySelectorAll(".time-wrapper div");

    roomInputs.forEach((input) => {
        input.addEventListener("change", function () {
            if (this.checked) {
                selected[1] = this.value;
            }
            // 공간 선택 시 시간 div의 스타일 초기화
            timeDivs.forEach((div) => {
                div.classList.remove("selected-time");
                selected[2] = "";
            });
        });
    });
}

getRoomValue();

// 시간 선택 이벤트
function getTimeValue() {
    const timeDivs = document.querySelectorAll(".time-wrapper div");

    timeDivs.forEach((div) => {
        div.addEventListener("click", function () {
            // 모든 div의 선택 스타일을 초기화
            timeDivs.forEach((div) => {
                div.classList.remove("selected-time");
            });
            // 클릭된 div에 선택 스타일 적용
            this.classList.add("selected-time");

            const timeText = this.textContent; // 클릭한 div의 텍스트를 가져옵니다.
            const startTime = String(parseInt(timeText)); // 텍스트에서 시작 시간을 추출하고 정수로 변환합니다.
            selected[2] = startTime;
            selected[3] = "";
            let select = document.getElementById("count-person");
            select.value = "1";
        });
    });
}
getTimeValue();

// 인원 선택 이벤트
window.onload = function () {
    let roomInputs = document.querySelectorAll("input[type=radio]");
    let selectElement = document.getElementById("count-person");
    let timeElements = document.querySelectorAll(".time-wrapper div");

    // 처음 로드될 때 선택 옵션이 없다면 '공간 선택을 해주세요.' 옵션 추가
    if (!selectElement.options.length) {
        let option = document.createElement("option");
        option.value = "none";
        option.text = "공간 선택을 해주세요.";
        selectElement.appendChild(option);
    }

    roomInputs.forEach((input) => {
        input.addEventListener("change", function () {
            let roomValue = this.value;

            // 기존 옵션 제거
            while (selectElement.firstChild) {
                selectElement.removeChild(selectElement.firstChild);
            }

            // '인원을 선택해주세요.' 옵션 추가
            let defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.text = "인원을 선택해주세요.";
            defaultOption.selected = true;
            defaultOption.disabled = true;
            defaultOption.hidden = true;
            selectElement.appendChild(defaultOption);

            // 공간에 따른 인원 선택 옵션 추가
            let options;
            switch (roomValue) {
                case "소회의실":
                    options = [1, 2, 3, 4];
                    break;
                case "대회의실":
                    options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                    break;
                case "잡코디룸1":
                case "잡코디룸2":
                    options = [1, 2, 3, 4, 5];
                    break;
                case "상담부스1":
                case "상담부스2":
                    options = [1, 2, 3, 4];
                    break;
                default:
                    options = ["공간 선택을 해 주세요."];
            }

            options.forEach(function (optionValue) {
                let option = document.createElement("option");
                option.value = optionValue;
                option.text = optionValue;
                selectElement.appendChild(option);
            });
        });
    });
    // 시간 선택 이벤트 추가
    timeElements.forEach((time) => {
        time.addEventListener("click", function () {
            selectElement.value = ""; // '인원을 선택해주세요.' 옵션 다시 선택
        });
    });
    selectElement.addEventListener("change", function () {
        selected[3] = this.value;
        console.log(selected);
    });
};

// TODO: 예약 확인 <div>에 selected 배열의 값 넣기

/* --------------------------------------- axios --------------------------------------- */

// 예약하기 버튼 클릭 시 post 요청
function reservation() {
    // selected가 다 채워저야 예약 가능
    if (selected.includes("")) alert("날짜, 공간, 시간, 인원을 모두 선택해주세요");
    axios({
        method: "post",
        url: "/reservation",
        data: {
            day: selected[0],
            st_room: selected[1],
            time: selected[2],
            count: selected[3],
        },
    }).then((res) => {
        const { status, msg } = res.data;
        switch (status) {
            case "expired":
            case "noPermission":
            case "booked":
            case "success":
                alert(msg);
                break;
        }
    });
}
