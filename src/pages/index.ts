import type { APIRoute } from "astro";
import { pickLocale, SUPPORTED } from "../lib/i18n";

export const prerender = false;

export const GET: APIRoute = ({ request, cookies, redirect }) => {
  const saved = cookies.get("lang")?.value;
  const lang =
    saved && (SUPPORTED as readonly string[]).includes(saved)
      ? saved
      : pickLocale(request.headers.get("accept-language"));

  const res = redirect(`/${lang}/`, 302);
  res.headers.set("Vary", "Accept-Language, Cookie");
  return res;
};
