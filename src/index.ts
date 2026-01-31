export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		let prompt = "cyberpunk cat"; // 默认提示词

		// 方式1: URL 查询参数 ?prompt=xxx
		if (url.searchParams.has("prompt")) {
			prompt = url.searchParams.get("prompt") || prompt;
		}
		// 方式2: POST 请求体 {"prompt": "xxx"}
		else if (request.method === "POST") {
			try {
				const body = await request.json() as { prompt?: string };
				if (body.prompt) {
					prompt = body.prompt;
				}
			} catch (e) {
				// JSON 解析失败，使用默认值
			}
		}

		const inputs = { prompt };

		const response = await env.AI.run(
			"@cf/stabilityai/stable-diffusion-xl-base-1.0",
			inputs,
		);

		return new Response(response, {
			headers: {
				"content-type": "image/png",
			},
		});
	},
} satisfies ExportedHandler<Env>;
