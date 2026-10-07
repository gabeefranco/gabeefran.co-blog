import type { APIRoute } from "astro";
import { pickLocale, SUPPORTED } from "../lib/i18n";

export const prerender = false;

export const GET: APIRoute = ({ request, cookies, redirect, url }) => {
  const saved = cookies.get("lang")?.value;
  const lang =
    saved && (SUPPORTED as readonly string[]).includes(saved)
      ? saved
      : pickLocale(request.headers.get("accept-language"));

  // Keep the query string (e.g. utm_* tags) through the redirect.
  const res = redirect(`/${lang}/${url.search}`, 302);
  res.headers.set("Vary", "Accept-Language, Cookie");
  return res;
};
