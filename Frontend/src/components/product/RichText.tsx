import type { JSX } from 'react'

/**
 * Minimal renderer for Payload's Lexical output.
 *
 * Deliberately not a full serialiser — it covers the node types the product
 * description editor can actually produce (paragraphs, headings, lists, links,
 * bold/italic) and ignores anything else rather than rendering raw JSON at a
 * customer.
 */

type LexicalNode = {
  children?: LexicalNode[]
  fields?: { url?: string; newTab?: boolean }
  format?: number | string
  listType?: string
  tag?: string
  text?: string
  type: string
}

// Lexical encodes inline styles as a bitmask on each text node.
const BOLD = 1
const ITALIC = 2

function renderText(node: LexicalNode, key: number) {
  let content: React.ReactNode = node.text ?? ''
  const format = typeof node.format === 'number' ? node.format : 0

  if (format & BOLD) {
    content = <strong key={key}>{content}</strong>
  }

  if (format & ITALIC) {
    content = <em key={key}>{content}</em>
  }

  return <span key={key}>{content}</span>
}

function renderNodes(nodes: LexicalNode[] | undefined): React.ReactNode {
  if (!nodes) {
    return null
  }

  return nodes.map((node, index) => {
    switch (node.type) {
      case 'text':
        return renderText(node, index)

      case 'linebreak':
        return <br key={index} />

      case 'link':
        return (
          <a
            className="underline hover:text-muted"
            href={node.fields?.url ?? '#'}
            key={index}
            {...(node.fields?.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
          >
            {renderNodes(node.children)}
          </a>
        )

      case 'heading': {
        const Tag = (node.tag ?? 'h3') as keyof JSX.IntrinsicElements

        return (
          <Tag className="mt-8 text-base font-semibold text-ink first:mt-0" key={index}>
            {renderNodes(node.children)}
          </Tag>
        )
      }

      case 'list': {
        const Tag = node.listType === 'number' ? 'ol' : 'ul'

        return (
          <Tag
            className={`mt-4 space-y-1.5 pl-5 ${Tag === 'ol' ? 'list-decimal' : 'list-disc'}`}
            key={index}
          >
            {renderNodes(node.children)}
          </Tag>
        )
      }

      case 'listitem':
        return <li key={index}>{renderNodes(node.children)}</li>

      case 'quote':
        return (
          <blockquote className="mt-4 border-l-2 border-line pl-4 italic" key={index}>
            {renderNodes(node.children)}
          </blockquote>
        )

      case 'paragraph':
      default: {
        const children = renderNodes(node.children)

        // Lexical emits an empty paragraph for a blank line; rendering it
        // would add stray vertical gaps.
        if (!node.children?.length) {
          return null
        }

        return (
          <p className="mt-4 leading-relaxed first:mt-0" key={index}>
            {children}
          </p>
        )
      }
    }
  })
}

export function RichText({ content }: { content: unknown }) {
  const root = (content as { root?: LexicalNode })?.root

  if (!root?.children?.length) {
    return null
  }

  return <div className="text-sm text-muted">{renderNodes(root.children)}</div>
}
