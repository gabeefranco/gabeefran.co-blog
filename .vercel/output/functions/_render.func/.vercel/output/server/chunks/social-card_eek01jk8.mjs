import { n as __exportAll, t as createComponent } from "./compiler_DiXpMM4i.mjs";
import { g as renderHead, m as renderTemplate, w as createAstro } from "./jsx-runtime_DseUv9uh.mjs";
//#region src/pages/social-card.astro
var social_card_exports = /* @__PURE__ */ __exportAll({
	default: () => $$SocialCard,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://gabeefran.co");
var $$SocialCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SocialCard;
	const title = Astro.url.searchParams.get("title") || "Untitled";
	const description = Astro.url.searchParams.get("description");
	const author = Astro.url.searchParams.get("author");
	return renderTemplate`<html data-astro-cid-3fpsgztt><head><meta charset="utf-8"><meta name="robots" content="noindex"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=JetBrains+Mono:wght@600&display=swap" rel="stylesheet">${renderHead($$result)}</head><body data-astro-cid-3fpsgztt><div class="brand" data-astro-cid-3fpsgztt><img src="/logo.png" alt="" data-astro-cid-3fpsgztt><span data-astro-cid-3fpsgztt>gabeefranco</span></div><h1 class="title" data-astro-cid-3fpsgztt>${title}</h1>${description && renderTemplate`<p class="description" data-astro-cid-3fpsgztt>${description}</p>`}${author && renderTemplate`<p class="author" data-astro-cid-3fpsgztt>${author}</p>`}</body></html>`;
}, "/home/gabe/src/gabeefran.co-blog/src/pages/social-card.astro", void 0);
var $$file = "/home/gabe/src/gabeefran.co-blog/src/pages/social-card.astro";
var $$url = "/social-card";
//#endregion
//#region \0virtual:astro:page:src/pages/social-card@_@astro
var page = () => social_card_exports;
//#endregion
export { page };
