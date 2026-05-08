import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

// ✅ IMPORTANT: Use CJS styles so Jest can parse it (avoids ESM export syntax error)
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import { slugify } from '../utils/markdown'
import styles from '../styles/markdown.module.css'

// Minimal prop shape we need. `inline` exists at runtime in react-markdown,
// but may not be present in the inferred TS type depending on versions/types.
type CodeRendererProps = React.HTMLAttributes<HTMLElement> & {
  inline?: boolean
  className?: string
  children?: React.ReactNode
  node?: unknown
}

type Props = {
  markdown: string
}

export function MarkdownPreview({ markdown }: Props) {
  const components: Components = {
    // Headings get predictable ids so the Sidebar TOC can jump to them.
    h1: ({ children, ...props }) => (
      <h1 id={slugify(String(children))} {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 id={slugify(String(children))} {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 id={slugify(String(children))} {...props}>
        {children}
      </h3>
    ),

    // ✅ Robust code renderer:
    // - Uses `inline` to distinguish fenced blocks vs inline code
    // - Extracts language from className + node.properties.className
    // NOTE: Cast to Components['code'] to satisfy react-markdown's typing.
    code: (({ node, inline, className, children, ...props }: CodeRendererProps) => {
      const codeString = String(children ?? '').replace(/\n$/, '')

      const nodeClass = (node as any)?.properties?.className
      const allClasses = [
        typeof className === 'string' ? className : '',
        Array.isArray(nodeClass) ? nodeClass.join(' ') : typeof nodeClass === 'string' ? nodeClass : ''
      ]
        .filter(Boolean)
        .join(' ')

      const match = /language-([a-z0-9-]+)/i.exec(allClasses)
      const lang = match?.[1]

      // ✅ Inline code
      if (inline) {
        return (
          <code className={styles.inlineCode} {...props}>
            {children}
          </code>
        )
      }

      // ✅ Fenced code block
      return (
        <div className={styles.codeBlock}>
          <div className={styles.codeHeader}>
            {lang ? <span className={styles.codeLang}>{lang}</span> : null}
          </div>

          <SyntaxHighlighter
            style={oneDark}
            language={lang}
            PreTag="div"
            customStyle={{ margin: 0, borderRadius: 12, padding: 16 }}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      )
    }) as Components['code']
  }

  return (
    <article className={styles.md} aria-label="Markdown preview">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </article>
  )
}
