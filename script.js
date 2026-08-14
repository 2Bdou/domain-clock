// ===============================
// 应用顶部配置：名字 + 社交链接
// ===============================

document.getElementById("site-name").innerText = SITE_NAME;
document.getElementById("power-text").innerText = `©2026 Power by ${SITE_NAME}`;

const socialBox = document.getElementById("social");
SOCIAL_LINKS.forEach(link => {
    if (!link.url || link.url === "#") return;   // url 为空则不渲染
    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";
    a.title = link.label || "";
    const i = document.createElement("i");
    i.className = link.icon;
    a.appendChild(i);
    socialBox.appendChild(a);
});


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


// ===============================
// 背景图（顶部 BG_MODE / BG_CUSTOM_URL 配置）
// ===============================

const bgLayer = document.getElementById("bg-layer");

function applyBackground(url, fallbackUrl) {
    const img = new Image();
    img.onload = () => {
        bgLayer.style.backgroundImage = `url("${url}")`;
    };
    img.onerror = () => {
        if (fallbackUrl) applyBackground(fallbackUrl, "");
        // 都失败则保持默认渐变
    };
    img.src = url;
}

async function loadBackground() {
    if (BG_MODE === "custom" && BG_CUSTOM_URL) {
        applyBackground(BG_CUSTOM_URL, "");
        return;
    }

    if (BG_MODE === "bing") {
        try {
            const res = await fetch("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=zh-CN");
            const data = await res.json();
            const img = data.images[Math.floor(Math.random() * data.images.length)];
            let url = "https://www.bing.com" + img.url;
            if (BG_BING_SIZE === "UHD") {
                applyBackground(url.replace("_1920x1080", "_UHD"), url); // 4K 失败回退 1080p
                return;
            }
            applyBackground(url, "");
        } catch (e) { /* 网络失败保持渐变 */ }
        return;
    }

    if (BG_MODE === "picsum") {
        applyBackground(`https://picsum.photos/1920/1080?random=${Date.now()}`);
        return;
    }

    // "none"：保持默认渐变
}

loadBackground();
if (BG_REFRESH_MIN > 0) {
    setInterval(loadBackground, BG_REFRESH_MIN * 60 * 1000);
}
