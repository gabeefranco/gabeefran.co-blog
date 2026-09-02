import type { ReactNode } from 'react';

interface ObservationCardProps {
  /** Defaults to "Observation" — pass a translated title in localized posts. */
  title?: string;
  children: ReactNode;
}

/**
 * A callout for a side note or personal observation inside a post.
 * Colors come from Tailwind's amber scale with dark: variants, so it
 * follows whatever theme (light/dark) the site is currently in.
 */
export default function ObservationCard({ title = 'Observation', children }: ObservationCardProps) {
  return (
    <div className="not-prose my-6 flex gap-3 rounded-xl border border-amber-300/50 bg-amber-50 p-4 dark:border-amber-400/25 dark:bg-amber-400/10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400"
        aria-hidden="true"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <div className="min-w-0">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
          {title}
        </p>
        <div className="text-sm leading-relaxed text-stone-700 [&_a]:text-primary [&_a]:underline [&_p+p]:mt-2 dark:text-stone-200">
          {children}
        </div>
      </div>
    </div>
  );
}
