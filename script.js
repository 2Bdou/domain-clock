// ===============================
// 当前访问域名
// ===============================

const domain = document.getElementById("domain");
domain.innerText = window.location.hostname;


// ===============================
// 大时钟（时间 + 日期 + 星期）
// ===============================

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function updateClock() {
    const timeEl = document.getElementById("clock-time");
    const dateEl = document.getElementById("clock-date");

    const now = new Date();

    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");

    const y = now.getFullYear();
    const mo = now.getMonth() + 1;
    const d = now.getDate();
    const w = WEEKDAYS[now.getDay()];

    timeEl.innerText = `${hh}:${mm}:${ss}`;
    dateEl.innerText = `${y}年${mo}月${d}日 星期${w}`;
}

updateClock();
setInterval(updateClock, 1000);


// ===============================
// IP + 国家（Cloudflare Trace）
// ===============================

async function getIP() {
    const ipBox = document.getElementById("ip");

    try {
        const response = await fetch("https://www.cloudflare.com/cdn-cgi/trace");
        const text = await response.text();

        const data = {};
        text.split("\n").forEach(item => {
            const parts = item.split("=");
            if (parts[0]) data[parts[0]] = parts[1];
        });

        ipBox.innerText = `IP: ${data.ip} · Country: ${data.loc}`;
    } catch (error) {
        ipBox.innerText = "IP unavailable";
    }
}

getIP();
