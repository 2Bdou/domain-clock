# domain-clock

🌐 域名收藏夹落地页：超大时钟 + 访问域名 + IP 定位。纯静态零构建，即拉即用。

## 功能

- 🕐 **超大数字时钟**（时分秒每秒跳动，Orbitron 科技感字体）
- 📅 日期 + 星期
- 🌍 自动显示当前访问域名（`window.location.hostname`，换域名挂自动变）
- 📍 访问者 IP + 国家（Cloudflare Trace）
- 🖼️ **背景图**：必应每日壁纸（4K 超清）+ 自定义图片 + 定时自动换
- 🔗 社交图标（GitHub / X / 邮箱 / Telegram）
- 📱 手机自适应

## 部署

纯静态页，任何静态托管都能跑：

### Cloudflare Pages（白嫖优先）

1. Fork 本仓库
2. CF Pages → Create a project → 连 GitHub 选本仓库
3. 构建配置：**无需构建命令**（纯静态），输出目录留空或填 `/`
4. Deploy，完事

### 本地预览

```bash
python3 -m http.server 8080
# 打开 http://localhost:8080
```

### 任意 Web 服务器

把 `index.html` / `style.css` / `script.js` 三个文件丢进 nginx / 宝塔根目录即可。

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

**四种模式（改 `BG_MODE`）：**

| 模式 | 效果 | 说明 |
|---|---|---|
| `bing` | 必应每日壁纸 | 每天更新、4K 超清，默认值。走第三方代理拿 URL（必应官方接口无 CORS 头，前端不能直接 fetch），代理挂了会自动兜底直链 |
| `picsum` | Lorem Picsum 随机图库 | 随机风景/静物，想看变化就把 `BG_REFRESH_MIN` 设 10~30 |
| `custom` | 你自己的图 | `BG_CUSTOM_URL` 填直链（jpg/png/webp），适合固定某张高清大图 |
| `none` | 默认深青绿渐变 | 不加载图片 |

**清晰度（`BG_BING_SIZE`，仅 bing 模式）：**

- `UHD` — 4K 超清（默认，加载失败自动回退 1080p）
- `1920x1080` — 加载更快

**定时换图（`BG_REFRESH_MIN`）：**

- 单位是分钟，`0` 表示只在打开页面时加载一张、不自动换
- bing 每天只更新一张，设 `60` 即可
- picsum 想多看变化设 `10`~`30`

> 背景图上叠了一层半透明深色遮罩，保证金色时钟文字清晰。想调暗/调亮，改 `style.css` 里 `.bg-layer::after` 的 `background` 透明度（`0.5`，越小越亮）。

## 结构

```
.
├── index.html    # 页面结构 + 顶部配置区
├── style.css     # 样式（含配色/背景遮罩/响应式）
└── script.js     # 时钟 + 域名 + IP + 背景图逻辑
```

## 灵感

复刻自 [iu.cn.mt](https://iu.cn.mt/)（Bree² 域名收藏夹），加了大时钟作为主视觉。
