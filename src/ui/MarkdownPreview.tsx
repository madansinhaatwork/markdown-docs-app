
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
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
          h1: ({ children, ...props }) => <h1 id={slugify(String(children))} {...props}>{children}</h1>,
          h2: ({ children, ...props }) => <h2 id={slugify(String(children))} {...props}>{children}</h2>,
          h3: ({ children, ...props }) => <h3 id={slugify(String(children))} {...props}>{children}</h3>,
          code({ className, children, ...props }) {
            const match = /language-(\\w+)/.exec(className || '')
            const codeString = String(children).replace(/\\n$/, '')
            const lang = match?.[1]

            // Inline code
            if (!lang) {
              return (
                <code className={styles.inlineCode} {...props}>
                  {children}
                </code>
              )
            }

            return (
              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeLang}>{lang}</span>
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

