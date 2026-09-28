import { n as __exportAll, t as createComponent } from "./compiler_DiXpMM4i.mjs";
import { g as renderHead, m as renderTemplate, w as createAstro } from "./jsx-runtime_DseUv9uh.mjs";
//#region src/pages/page-card.astro
var page_card_exports = /* @__PURE__ */ __exportAll({
	default: () => $$PageCard,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://gabeefran.co");
var $$PageCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PageCard;
	const title = Astro.url.searchParams.get("title") || "gabeefranco";
	const description = Astro.url.searchParams.get("description");
	return renderTemplate`<html data-astro-cid-jwkqgd2l><head><meta charset="utf-8"><meta name="robots" content="noindex"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=JetBrains+Mono:wght@600&display=swap" rel="stylesheet">${renderHead($$result)}</head><body data-astro-cid-jwkqgd2l><div class="brand" data-astro-cid-jwkqgd2l><img src="/logo.png" alt="" data-astro-cid-jwkqgd2l><span data-astro-cid-jwkqgd2l>gabeefranco</span></div><h1 class="title" data-astro-cid-jwkqgd2l>${title}</h1>${description && renderTemplate`<p class="description" data-astro-cid-jwkqgd2l>${description}</p>`}</body></html>`;
}, "/home/gabe/src/gabeefran.co-blog/src/pages/page-card.astro", void 0);
var $$file = "/home/gabe/src/gabeefran.co-blog/src/pages/page-card.astro";
var $$url = "/page-card";
//#endregion
//#region \0virtual:astro:page:src/pages/page-card@_@astro
var page = () => page_card_exports;
//#endregion
export { page };
