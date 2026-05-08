
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

// ✅ IMPORTANT: Use CJS styles so Jest can parse it (avoids ESM export syntax error)
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import { slugify } from '../utils/markdown'
import styles from '../styles/markdown.module.css'

type Props = {
  markdown: string
}

export function MarkdownPreview({ markdown }: Props) {
  return (
    <article className={styles.md} aria-label="Markdown preview">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
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
          // - Uses `inline` to correctly distinguish fenced blocks vs inline code
          // - Extracts language from both `className` and `node.properties.className`
          code({ node, inline, className, children, ...props }) {
            const codeString = String(children).replace(/\n$/, '')

            // `className` sometimes doesn't include language-* in Jest/JSdom,
            // so also check `node.properties.className` (often an array).
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

            // ✅ Fenced code block (always render SyntaxHighlighter, badge only if lang exists)
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
          }
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  )
}
