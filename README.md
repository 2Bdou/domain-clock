# domain-clock

🌐 域名收藏夹落地页：超大时钟 + 访问域名 + IP 定位。纯静态零构建，即拉即用。

## 功能

- 🕐 **超大数字时钟**（时分秒每秒跳动，Orbitron 科技感字体）
- 📅 日期 + 星期
- 🌍 自动显示当前访问域名（`window.location.hostname`，换域名挂自动变）
- 📍 访问者 IP + 国家（Cloudflare Trace）
- 🖼️ **背景图**：必应每日壁纸（4K）+ Wallhaven 高清图库 + 自定义图片 + 定时自动换
- 🔗 社交图标（GitHub / X / 邮箱 / Telegram）
- 📱 手机自适应

## 部署

### Cloudflare Pages（白嫖优先）

1. Fork 本仓库
2. CF Pages → Create a project → 连 GitHub 选本仓库
3. 构建配置：**无需构建命令**（纯静态），输出目录留空或填 `/`
4. Deploy，完事

> 本项目含一个 CF Pages Function（`functions/api/wallhaven.js`），CF Pages 会自动识别部署，无需额外配置。

### 本地预览

```bash
python3 -m http.server 8080
# 打开 http://localhost:8080
```

> 本地预览没有 Function，Wallhaven 模式会静默回退到必应；其余模式正常。

### 任意 Web 服务器

把 `index.html` / `style.css` / `script.js` 三个文件丢进 nginx / 宝塔根目录即可（Wallhaven 模式需要 Function，纯静态服务器不可用）。

## 自定义

所有可改项都集中在 `index.html` 顶部的「配置区」，改完直接提交即可：

| 想改 | 改哪 |
|---|---|
| 名字 | `index.html` 顶部 `SITE_NAME` |
| 社交链接 | `index.html` 顶部 `SOCIAL_LINKS` 数组（图标名 + 链接） |
| 背景图 | `index.html` 顶部 `BG_MODE` / `BG_CUSTOM_URL` 配置块 |
| 配色 | `style.css` 里的色值（金色 `#d9b45c`、深青绿 `#0e2a30`） |

## 背景图

配置在 `index.html` 顶部的背景配置块：

```js
const BG_MODE = "bing";          // 背景模式
const BG_CUSTOM_URL = "";        // custom 模式填你自己的高清图直链
const BG_BING_SIZE = "UHD";      // bing 清晰度
const BG_REFRESH_MIN = 60;       // 自动换图间隔（分钟），0 = 不自动换
```

**五种模式（改 `BG_MODE`）：**

| 模式 | 效果 | 说明 |
|---|---|---|
| `bing` | 必应每日壁纸 | 每天更新、4K 超清，**大陆可访问**，默认值。走第三方代理拿 URL（必应官方接口无 CORS 头），代理挂了自动兜底直链 |
| `wallhaven` | Wallhaven 高清壁纸 | 图库质量最高（二次元/风景/壁纸海量），随机高清图。key 存 CF 后台，走 `/api/wallhaven` 代理，失败自动回退必应 |
| `picsum` | Lorem Picsum 随机图库 | 随机风景/静物，想看变化就把 `BG_REFRESH_MIN` 设 10~30 |
| `custom` | 你自己的图 | `BG_CUSTOM_URL` 填直链（jpg/png/webp），适合固定某张高清大图 |
| `none` | 默认深青绿渐变 | 不加载图片 |

**清晰度（`BG_BING_SIZE`，仅 bing 模式）：**

- `UHD` — 4K 超清（默认，加载失败自动回退 1080p）
- `1920x1080` — 加载更快

**定时换图（`BG_REFRESH_MIN`）：**

- 单位是分钟，`0` 表示只在打开页面时加载一张、不自动换
- bing 每天只更新一张，设 `60` 即可
- picsum / wallhaven 想多看变化设 `10`~`30`

> 背景图上叠了一层半透明深色遮罩，保证金色时钟文字清晰。想调暗/调亮，改 `style.css` 里 `.bg-layer::after` 的 `background` 透明度（`0.5`，越小越亮）。

## 启用 Wallhaven（可选）

Wallhaven 的 API key 不能放前端（会被看源码拿到），所以走 CF Pages Function 代理，key 存 CF 后台环境变量。

**1. 生成 API key**

登录 [wallhaven.cc](https://wallhaven.cc) → [Settings → Account](https://wallhaven.cc/settings/account) → API Key 区域生成一个。

**2. 配置 CF 环境变量**

CF Pages 后台 → 你的项目 → **Settings → Environment variables** → 添加：

| 变量名 | 值 |
|---|---|
| `WALLHAVEN_API_KEY` | 你的 wallhaven key |

**3. 重新部署**

环境变量改完不会自动生效，需要回到项目页 **Deployments → 最近的部署 → ⋯ → Retry deployment**（或随便 push 一次触发重建）。

**4. 切换模式**

把 `index.html` 里 `BG_MODE` 改成 `"wallhaven"`，提交即可。

> 图片本身仍由 `w.wallhaven.cc` 直连加载，大陆需梯子；Function 只负责安全地拿图 URL，不代理图片字节（那样流量太重）。

## 结构

```
.
├── index.html                  # 页面结构 + 顶部配置区
├── style.css                   # 样式（含配色/背景遮罩/响应式）
├── script.js                   # 时钟 + 域名 + IP + 背景图逻辑
└── functions/
    └── api/
        └── wallhaven.js        # CF Pages Function：代理 wallhaven，key 读后台环境变量
```

## 灵感

复刻自 [iu.cn.mt](https://iu.cn.mt/)（Bree² 域名收藏夹），加了大时钟作为主视觉。
