document.addEventListener("DOMContentLoaded", initializeCard);
document.addEventListener("pjax:complete", initializeCard);

let year, month, week, date, dates, weekStr, monthStr, asideTime;

function initializeCard() {
    cardTimes();
    cardRefreshTimes();
}

function getNextFestivalDate() {
    const now = new Date();
    const currentYear = now.getFullYear();

    // 阳历节日
    const solarFestivals = [
        { name: "元旦", month: 1, day: 1 },
        { name: "清明节", month: 4, day: 4 },
        { name: "国庆节", month: 10, day: 1 },
    ];

    // 农历节日
    const lunarFestivals = [
        { name: "春节", month: 1, day: 1 },
        { name: "端午节", month: 5, day: 5 },
        { name: "中秋节", month: 8, day: 15 },
    ];

    const upcoming = [];

    // 处理阳历节日（今年 + 明年）
    [currentYear, currentYear + 1].forEach((y) => {
        solarFestivals.forEach(({ name, month, day }) => {
            const festDate = new Date(y, month - 1, day);
            if (festDate >= now) upcoming.push({ name, date: festDate });
        });
    });

    // 处理农历节日（今年 + 明年）
    [currentYear, currentYear + 1].forEach((y) => {
        lunarFestivals.forEach(({ name, month, day }) => {
            const solarDate = chineseLunar.lunarToSolar(y, month, day);
            const festDate = new Date(
                solarDate.getFullYear(),
                solarDate.getMonth(),
                solarDate.getDate()
            );
            if (festDate >= now) upcoming.push({ name, date: festDate });
        });
    });

    // 排序并返回最近节日
    if (upcoming.length === 0) return null;
    return upcoming.sort((a, b) => a.date - b.date)[0];
}

function cardRefreshTimes() {
    const e = document.getElementById("card-schedule");
    if (!e) return;

    const now = new Date();
    const asideDay = (now - asideTime) / 86400000;

    e.querySelector("#pBar_year").value = asideDay;
    e.querySelector("#p_span_year").innerText = ((asideDay / 365) * 100).toFixed(1) + "%";
    e.querySelector(".schedule-r0 .aside-span2 a").innerText = (365 - asideDay).toFixed(0);

    e.querySelector("#pBar_month").value = date;
    e.querySelector("#pBar_month").max = dates;
    e.querySelector("#p_span_month").innerText = ((date / dates) * 100).toFixed(1) + "%";
    e.querySelector(".schedule-r1 .aside-span2 a").innerText = (dates - date);

    const wd = week === 0 ? 7 : week;
    e.querySelector("#pBar_week").value = wd;
    e.querySelector("#pBar_week").max = 7;
    e.querySelector("#p_span_week").innerText = ((wd / 7) * 100).toFixed(1) + "%";
    e.querySelector(".schedule-r2 .aside-span2 a").innerText = (7 - wd);
}

function cardTimes() {
    const getShanghaiMidnight = (date = new Date()) => {
        const shanghaiStr = date.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
        return new Date(shanghaiStr.split(" ")[0] + " 00:00:00");
    };

    const shanghaiNow = getShanghaiMidnight();
    year = shanghaiNow.getFullYear();
    month = shanghaiNow.getMonth();
    week = shanghaiNow.getDay();
    date = shanghaiNow.getDate();

    monthStr = `${month + 1}月`;
    weekStr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][week];
    dates = [
        31,
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ][month];

    asideTime = new Date(`${year}/01/01 00:00:00`);

    // 1月1日为第1天
    const asideDayNum = Math.ceil((shanghaiNow - asideTime) / 86400000) + 1;

    const weekNum = week - asideDayNum % 7 >= 0 ? Math.ceil(asideDayNum / 7) : Math.ceil(asideDayNum / 7) + 1;

    const nextFestival = getNextFestivalDate();
    const diffDays = Math.ceil((nextFestival.date - shanghaiNow) / 86400000);
    const festDateStr = formatDateYMD(nextFestival.date);

    const schedule = document.getElementById("card-schedule");
    if (schedule) {
        schedule.querySelector("#schedule-title").innerText = `距离${nextFestival.name}`;
        schedule.querySelector("#schedule-date").innerText = festDateStr;
        schedule.querySelector("#schedule-days").innerText = diffDays;
    }

    const calendar = document.getElementById("card-calendar");
    if (calendar) {
        calendar.querySelector("#calendar-week").innerHTML = `${year.toString().slice(-2)}年${monthStr}&nbsp;${weekStr}`;
        calendar.querySelector("#calendar-date").innerHTML = String(date).padStart(2, "0");
        calendar.querySelector("#calendar-solar").innerHTML = `第${weekNum}周 第${asideDayNum}天`;

        const lunarDate = chineseLunar.solarToLunar(shanghaiNow);
        const ganzhiYear = chineseLunar.format(lunarDate, "T");
        const animalYear = chineseLunar.format(lunarDate, "A");
        const lunarMonthStr = chineseLunar.format(lunarDate, "M");
        const lunarDayStr = chineseLunar.format(lunarDate, "d");

        calendar.querySelector(
            "#calendar-lunar"
        ).innerHTML = `${ganzhiYear}${animalYear}年 ${lunarMonthStr}${lunarDayStr}`;
    }

    renderCalendarGrid();
}

function formatDateYMD(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function renderCalendarGrid() {
    const container = document.querySelector("#calendar-main");
    if (!container) return;

    container.innerHTML = "";

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const totalCells = firstDayOfMonth + dates;
    const totalRows = Math.ceil(totalCells / 7);

    let currentDay = 1;

    for (let i = 0; i < totalRows; i++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = `calendar-r${i}`;

        for (let j = 0; j < 7; j++) {
            const cellIndex = i * 7 + j;
            const cellDiv = document.createElement("div");
            cellDiv.className = `calendar-d${j}`;
            const a = document.createElement("a");

            if (cellIndex >= firstDayOfMonth && currentDay <= dates) {
                a.textContent = currentDay;
                if (currentDay === date) a.classList.add("now");
                currentDay++;
            } else {
                a.innerHTML = "&nbsp;";
            }

            cellDiv.appendChild(a);
            rowDiv.appendChild(cellDiv);
        }

        container.appendChild(rowDiv);
    }
}