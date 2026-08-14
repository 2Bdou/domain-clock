// CF Pages Function：/api/wallhaven
// 代理 wallhaven 搜索。API key 从 CF 后台环境变量 WALLHAVEN_API_KEY 读取，
// 永远不出后端，不会泄露到前端。
export async function onRequestGet(context) {
    const key = context.env.WALLHAVEN_API_KEY || "";

    // 只返回 SFW（purity=100）、≥1920x1080 的随机高清图
    const keyParam = key ? `&apikey=${key}` : "";
    const apiUrl = `https://wallhaven.cc/api/v1/search?sorting=random&categories=111&purity=100&atleast=1920x1080${keyParam}`;

    try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        const url = data && data.data && data.data.length ? data.data[0].path : "";

        return new Response(JSON.stringify({ url }), {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
            },
        });
    } catch (e) {
        // 返回空 url，前端会自动回退到必应
        return new Response(JSON.stringify({ url: "" }), {
            headers: { "Content-Type": "application/json" },
        });
    }
}
