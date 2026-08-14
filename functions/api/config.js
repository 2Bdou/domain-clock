// CF Pages Function：/api/config
// 返回背景图相关配置。这些值从 CF 后台环境变量读取，
// 让"改配置"不用动代码、不用暴露在前端。
export async function onRequestGet(context) {
    const env = context.env;
    return new Response(JSON.stringify({
        BG_MODE: env.BG_MODE || "bing",
        BG_CUSTOM_URL: env.BG_CUSTOM_URL || "",
        BG_BING_SIZE: env.BG_BING_SIZE || "UHD",
        BG_REFRESH_MIN: env.BG_REFRESH_MIN || "60",
    }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
        },
    });
}
