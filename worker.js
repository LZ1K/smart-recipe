// Cloudflare Worker — 反向代理到 Vercel
// 部署：复制到 Cloudflare Workers 在线编辑器 → 部署
// 免费额度：10万次/天

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    // 转发到 Vercel 的域名
    const targetUrl = "https://smart-recipe-pi.vercel.app" + url.pathname + url.search

    const modifiedHeaders = new Headers(request.headers)
    modifiedHeaders.set("Host", "smart-recipe-pi.vercel.app")
    // 透传用户真实 IP
    modifiedHeaders.set("X-Forwarded-For", request.headers.get("cf-connecting-ip") || "")
    modifiedHeaders.set("X-Forwarded-Proto", "https")

    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: modifiedHeaders,
      body: request.method !== "GET" && request.method !== "HEAD" ? await request.clone().arrayBuffer() : null,
      redirect: "manual",
    })

    const response = await fetch(proxyRequest)

    // 处理重定向：把 Vercel 域名替换为 Worker 域名
    const location = response.headers.get("Location")
    const newHeaders = new Headers(response.headers)
    if (location) {
      const newLocation = location.replace("smart-recipe-pi.vercel.app", url.hostname)
      newHeaders.set("Location", newLocation)
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    })
  },
}
