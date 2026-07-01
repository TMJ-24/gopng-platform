import React from 'react'

type LexicalNode = {
  type: string
  tag?: string
  text?: string
  format?: number
  url?: string
  children?: LexicalNode[]
  listType?: 'bullet' | 'number'
  indent?: number
  direction?: string
}

type LexicalContent = {
  root: LexicalNode
}

function renderNode(node: LexicalNode, index: number): React.ReactNode {
  if (!node) return null

  switch (node.type) {
    case 'root':
      return (
        <React.Fragment key={index}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </React.Fragment>
      )

    case 'paragraph':
      return (
        <p key={index} style={{ margin: '1em 0', lineHeight: 1.75, color: '#000716', fontSize: 15 }}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </p>
      )

    case 'heading': {
      const tag = (node.tag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      const styles: Record<string, React.CSSProperties> = {
        h1: { fontSize: 30, fontWeight: 700, color: '#000716', margin: '1.5em 0 0.5em', letterSpacing: '-0.01em' },
        h2: { fontSize: 22, fontWeight: 700, color: '#000716', margin: '1.4em 0 0.4em', letterSpacing: '-0.01em' },
        h3: { fontSize: 18, fontWeight: 700, color: '#000716', margin: '1.25em 0 0.35em' },
        h4: { fontSize: 16, fontWeight: 700, color: '#000716', margin: '1em 0 0.3em' },
        h5: { fontSize: 14, fontWeight: 700, color: '#000716', margin: '0.9em 0 0.25em' },
        h6: { fontSize: 13, fontWeight: 700, color: '#545B64', margin: '0.8em 0 0.2em' },
      }
      return React.createElement(
        tag,
        { key: index, style: styles[tag] ?? styles.h2 },
        node.children?.map((child, i) => renderNode(child, i)),
      )
    }

    case 'list':
      if (node.listType === 'number') {
        return (
          <ol key={index} style={{ margin: '1em 0', paddingLeft: '1.5em', color: '#000716', lineHeight: 1.75 }}>
            {node.children?.map((child, i) => renderNode(child, i))}
          </ol>
        )
      }
      return (
        <ul key={index} style={{ margin: '1em 0', paddingLeft: '1.5em', color: '#000716', lineHeight: 1.75 }}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </ul>
      )

    case 'listitem':
      return (
        <li key={index} style={{ fontSize: 15 }}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </li>
      )

    case 'quote':
      return (
        <blockquote key={index} style={{ margin: '1em 0', borderLeft: '3px solid #D5DBDB', paddingLeft: 16, color: '#545B64', fontStyle: 'italic' }}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </blockquote>
      )

    case 'link':
      return (
        <a
          key={index}
          href={node.url}
          style={{ color: '#0972D3', textDecoration: 'underline' }}
          target={node.url?.startsWith('http') ? '_blank' : undefined}
          rel={node.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {node.children?.map((child, i) => renderNode(child, i))}
        </a>
      )

    case 'text': {
      let content: React.ReactNode = node.text
      if (node.format) {
        if (node.format & 1) content = <strong>{content}</strong>
        if (node.format & 2) content = <em>{content}</em>
        if (node.format & 4) content = <s>{content}</s>
        if (node.format & 8) content = <u>{content}</u>
        if (node.format & 16) content = <code style={{ background: '#F2F3F3', border: '1px solid #D5DBDB', padding: '1px 5px', borderRadius: 4, fontSize: '0.875em', fontFamily: 'monospace' }}>{content}</code>
      }
      return <React.Fragment key={index}>{content}</React.Fragment>
    }

    case 'linebreak':
      return <br key={index} />

    default:
      if (node.children) {
        return (
          <React.Fragment key={index}>
            {node.children.map((child, i) => renderNode(child, i))}
          </React.Fragment>
        )
      }
      return null
  }
}

export function RichText({ content }: { content: LexicalContent | null | undefined }) {
  if (!content?.root) return null
  return (
    <div className="rich-text">
      {renderNode(content.root, 0)}
    </div>
  )
}
