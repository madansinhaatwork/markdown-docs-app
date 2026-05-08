
import { useEffect, useRef, useState } from 'react'
import type { Doc } from '../models/doc'
import { MarkdownPreview } from './MarkdownPreview'
import styles from '../styles/splitpane.module.css'

type Props = {
  doc: Doc
  onChange: (next: string) => void
}

export function SplitPane({ doc, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [ratio, setRatio] = useState(0.5) // editor width ratio
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.min(Math.max(e.clientX - rect.left, 240), rect.width - 240)
      setRatio(x / rect.width)
    }
    const onUp = () => setDragging(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging])

  return (
    <div className={styles.paneContainer} ref={containerRef} aria-label="Editor and preview">
      <section className={styles.editorPane} style={{ width: `${ratio * 100}%` }}>
        <div className={styles.paneHeader}>
          <div className={styles.paneTitle}>Markdown</div>
          <div className={styles.paneHint}>Live preview • GFM supported</div>
        </div>
        <textarea
          className={styles.textarea}
          value={doc.content}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          aria-label="Markdown editor"
        />
      </section>

      <div
        className={styles.resizer}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panes"
        onMouseDown={() => setDragging(true)}
      />

      <section className={styles.previewPane} style={{ width: `${(1 - ratio) * 100}%` }}>
        <div className={styles.paneHeader}>
          <div className={styles.paneTitle}>Preview</div>
          <div className={styles.paneHint}>Rendered HTML</div>
        </div>
        <div className={styles.previewScroll}>
          <MarkdownPreview markdown={doc.content} />
        </div>
      </section>
    </div>
  )
}

