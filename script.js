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

async function loadBingBackground() {
    // 必应官方接口不带 CORS 头，前端 fetch 会被拦，改用支持 CORS 的代理拿 URL
    try {
        const idx = Math.floor(Math.random() * 8); // 近 8 天随机一张
        const res = await fetch(`https://bing.biturl.top/?resolution=1920&format=json&index=${idx}&mkt=zh-CN`);
        const data = await res.json();
        if (data && data.url) {
            let url = data.url;
            if (BG_BING_SIZE === "UHD") {
                applyBackground(url.replace("_1920x1080", "_UHD"), url); // 4K 失败回退 1080p
            } else {
                applyBackground(url, "");
            }
            return;
        }
    } catch (e) { /* 代理挂了走下面直链兜底 */ }

    // 兜底：直链图片（<img> 加载，天然无 CORS 限制）
    applyBackground("https://api.dujin.org/bing/1920.php", "");
}

async function loadBackground() {
    if (BG_MODE === "custom" && BG_CUSTOM_URL) {
        applyBackground(BG_CUSTOM_URL, "");
        return;
    }

    if (BG_MODE === "wallhaven") {
        // Wallhaven 高清壁纸；走同域 /api/wallhaven 代理（key 在 CF 后台环境变量，不泄露）
        // Function 挂了或本地预览（无 Function）时，回退必应
        try {
            const res = await fetch("/api/wallhaven");
            const data = await res.json();
            if (data && data.url) {
                applyBackground(data.url, "");
                return;
            }
        } catch (e) { /* Function 挂了，回退必应 */ }
        await loadBingBackground();
        return;
    }

    if (BG_MODE === "bing") {
        await loadBingBackground();
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
