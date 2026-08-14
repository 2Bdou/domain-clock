# domain-clock

🌐 域名收藏夹落地页：超大时钟 + 访问域名 + IP 定位。纯静态零构建，即拉即用。

## 功能

- 🕐 **超大数字时钟**（时分秒每秒跳动，Orbitron 科技感字体）
- 📅 日期 + 星期
- 🌍 自动显示当前访问域名（`window.location.hostname`，换域名挂自动变）
- 📍 访问者 IP + 国家（Cloudflare Trace）
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

| 想改 | 改哪 |
|---|---|
| 名字 | `index.html` 里 `<h1 class="name">` |
| 社交链接 | `index.html` 里 `.social` 的 `<a href>` |
| 背景（换图片） | `style.css` 里 `body` 的 `background`，改成 `url("bg.jpg") center/cover no-repeat fixed` |
| 配色 | `style.css` 里的色值（金色 `#d9b45c`、深青绿 `#0e2a30`） |

## 结构

```
.
├── index.html    # 页面结构
├── style.css     # 样式（含配色/响应式）
└── script.js     # 时钟 + 域名 + IP 逻辑
```

## 灵感

复刻自 [iu.cn.mt](https://iu.cn.mt/)（Bree² 域名收藏夹），加了大时钟作为主视觉。
