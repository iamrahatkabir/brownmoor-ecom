import type { ReactNode } from 'react'

/**
 * Shared shell for the Bangla policy pages — shipping, privacy, and whatever
 * follows.
 *
 * The typography is the reason this is a component rather than copied markup.
 * Bengali sits taller than Latin and its conjuncts need vertical room, so the
 * measure is narrower and the leading looser than the rest of the site. Getting
 * that subtly different on each page would show.
 */

/** Page wrapper: reading column, and the language switch for the content. */
export function PolicyPage({
  children,
  lead,
  title,
}: {
  children: ReactNode
  lead?: ReactNode
  title: string
}) {
  return (
    // lang goes here rather than on the document: the header and footer around
    // this are still English, and a screen reader should change voice at the
    // boundary rather than read the whole page as Bangla.
    <div className="mx-auto max-w-[46rem] px-4 py-10 md:py-16" lang="bn">
      <header>
        <h1 className="text-2xl font-semibold leading-tight tracking-tight text-ink md:text-4xl">
          {title}
        </h1>
        {lead}
      </header>

      <div className="mt-10 space-y-8 md:mt-12 md:space-y-10">{children}</div>
    </div>
  )
}

/** Body copy, at the size and leading Bangla needs to stay readable. */
export function PolicyBody({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 text-[15px] leading-[1.9] text-muted md:text-base md:leading-[2]">
      {children}
    </div>
  )
}

/** One titled section, separated by a rule so the page can be scanned. */
export function PolicySection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="border-t border-line pt-8 md:pt-10">
      <h2 className="text-lg font-semibold leading-snug tracking-tight text-ink md:text-xl">
        {title}
      </h2>
      <div className="mt-4">
        <PolicyBody>{children}</PolicyBody>
      </div>
    </section>
  )
}

/**
 * A bulleted list.
 *
 * Markers sit outside the text so a wrapped Bangla line stays aligned under the
 * first word rather than tucking under the bullet.
 */
export function PolicyList({ items }: { items: string[] }) {
  return (
    <ul className="ms-5 list-outside list-disc space-y-2 marker:text-faint">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

/** Emphasis inside body copy — darker rather than merely bolder. */
export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>
}

/** A bordered aside for a phone number, address or support hours. */
export function PolicyCard({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="rounded-lg border border-line p-4 md:p-5">
      {title && <p className="text-sm font-semibold text-ink">{title}</p>}
      <div className={title ? 'mt-2' : undefined}>{children}</div>
    </div>
  )
}
