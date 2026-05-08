
import { useMemo, useState } from 'react'
import type { Doc } from '../models/doc'
import { extractHeadings, slugify } from '../utils/markdown'
import styles from '../styles/sidebar.module.css'

type Props = {
  docs: Doc[]
  selectedId: string
  onSelect: (id: string) => void
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
}

export function Sidebar({ docs, selectedId, onSelect, onRename, onDelete }: Props) {
  const [open, setOpen] = useState(true)
  const selectedDoc = docs.find(d => d.id === selectedId)

  const headings = useMemo(() => {
    if (!selectedDoc) return []
    return extractHeadings(selectedDoc.content).slice(0, 12)
  }, [selectedDoc])

  return (
    <aside className={styles.sidebar} data-open={open} aria-label="Document navigation">
      <div className={styles.sidebarHeader}>
        <button
          className={styles.iconBtn}
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
          title={open ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          ☰
        </button>
        <div className={styles.sidebarTitle}>Documents</div>
      </div>

      <div className={styles.section}>
        <ul className={styles.docList}>
          {docs.map(doc => (
            <li key={doc.id} className={styles.docItem}>
              <button
                className={styles.docBtn}
                data-selected={doc.id === selectedId}
                onClick={() => onSelect(doc.id)}
              >
                <span className={styles.docName}>{doc.title}</span>
                <span className={styles.docMeta}>
                  {new Date(doc.updatedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit'
                  })}
                </span>
              </button>
              <div className={styles.docActions} aria-label="Document actions">
                <button
                  className={styles.smallBtn}
                  onClick={() => {
                    const next = prompt('Rename document', doc.title)
                    if (next && next.trim()) onRename(doc.id, next.trim())
                  }}
                  aria-label={`Rename ${doc.title}`}
                  title="Rename"
                >
                  ✎
                </button>
                <button
                  className={styles.smallBtnDanger}
                  onClick={() => {
                    const ok = confirm(`Delete “${doc.title}”?`)
                    if (ok) onDelete(doc.id)
                  }}
                  aria-label={`Delete ${doc.title}`}
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedDoc && headings.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>On this page</div>
          <ul className={styles.toc}>
            {headings.map(h => (
              <li key={`${h.depth}-${h.text}-${h.line}`} className={styles.tocItem} data-depth={h.depth}>
                <a
                  className={styles.tocLink}
                  href={`#${slugify(h.text)}`}
                  onClick={(e) => {
                    // We don’t control the preview scroll container; this is best-effort.
                    // Browsers will jump if there is a matching id in the preview.
                    e.preventDefault()
                    const el = document.getElementById(slugify(h.text))
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}

