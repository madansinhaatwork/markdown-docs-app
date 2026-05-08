import { useMemo } from 'react'
import { Sidebar } from './Sidebar'
import { SplitPane } from './SplitPane'
import { useLocalStorageState } from '../utils/useLocalStorageState'
import type { Doc } from '../models/doc'
import { seedDocs } from '../data/seedDocs'
import styles from '../styles/app.module.css'

const STORAGE_KEY = 'markdown-docs-app:v1'

type PersistedState = {
  docs: Doc[]
  selectedId: string
}

export function App() {
  const [state, setState] = useLocalStorageState<PersistedState>(STORAGE_KEY, {
    docs: seedDocs,
    selectedId: seedDocs[0]?.id ?? 'doc-1'
  })

  const selectedDoc = useMemo(
    () => state.docs.find(d => d.id === state.selectedId) ?? state.docs[0],
    [state.docs, state.selectedId]
  )

  const updateDocContent = (id: string, content: string) => {
    setState(prev => ({
      ...prev,
      docs: prev.docs.map(d => (d.id === id ? { ...d, content, updatedAt: Date.now() } : d))
    }))
  }

  const selectDoc = (id: string) => {
    setState(prev => ({ ...prev, selectedId: id }))
  }

  const addDoc = () => {
    const timestamp = Date.now()
    const next: Doc = {
      id: `doc-${timestamp}`,
      title: 'New Document',
      content: '# New Document\n\nStart writing…',
      createdAt: timestamp,
      updatedAt: timestamp
    }
    setState(prev => ({
      docs: [next, ...prev.docs],
      selectedId: next.id
    }))
  }

  const renameDoc = (id: string, title: string) => {
    setState(prev => ({
      ...prev,
      docs: prev.docs.map(d => (d.id === id ? { ...d, title, updatedAt: Date.now() } : d))
    }))
  }

  const deleteDoc = (id: string) => {
    setState(prev => {
      const docs = prev.docs.filter(d => d.id !== id)
      const selectedId = prev.selectedId === id ? (docs[0]?.id ?? '') : prev.selectedId
      return { docs, selectedId }
    })
  }

  if (!selectedDoc) {
    return (
      <div className={styles.empty}>
        <h1>Markdown Docs</h1>
        <p>No documents found.</p>
        <button className={styles.primaryBtn} onClick={addDoc}>
          Create your first document
        </button>
      </div>
    )
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.title}>Markdown Docs</span>
        </div>
        <div className={styles.headerActions}>
          {/* <button className={styles.primaryBtn} onClick={addDoc} aria-label="Add document">
            New
          </button> */}
          
<button className={styles.primaryBtn} onClick={addDoc}>
  New
</button>

        </div>
      </header>

      <div className={styles.main}>
        <Sidebar
          docs={state.docs}
          selectedId={state.selectedId}
          onSelect={selectDoc}
          onRename={renameDoc}
          onDelete={deleteDoc}
        />

        <SplitPane
          doc={selectedDoc}
          onChange={(next) => updateDocContent(selectedDoc.id, next)}
        />
      </div>
    </div>
  )
}

