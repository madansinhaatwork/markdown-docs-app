
// FILE: README.md
# Markdown Docs App (React + TypeScript)

A minimalist, responsive documentation editor featuring a **split-pane Markdown editor + live HTML preview**, a **sidebar for document navigation**, and a **robust unit testing suite** (Jest + React Testing Library).

## ✨ Features

- **Split pane editor** with draggable resizer
- **Real-time preview** using `react-markdown` + `remark-gfm`
- **Syntax highlighting** for fenced code blocks using `react-syntax-highlighter` (Prism)
- **Sidebar navigation**: browse docs, rename, delete, and a small **“On this page”** TOC derived from markdown headings
- **Responsive UI**: sidebar collapses on smaller screens; editor/preview stack vertically on mobile
- **Unit tests** for:
  - Component rendering and user interactions (App, Preview)
  - Markdown parsing logic (`extractHeadings`, `slugify`)

---

## ✅ Prerequisites

- Node.js **18+** (recommended)
- npm (or pnpm/yarn)

---

## 🚀 Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run the dev server

```bash
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

### 3) Build for production

```bash
npm run build
npm run preview
```

---

## 🧪 Running Tests (Jest + React Testing Library)

### Run all tests once

```bash
npm test
```

### Watch mode during development

```bash
npm run test:watch
```

### CI mode (useful in pipelines)

```bash
npm run test:ci
```

### What’s covered?

- `src/__tests__/App.test.tsx`
  - Renders the main shell
  - Switches documents from the sidebar
  - Creates a new document

- `src/__tests__/MarkdownPreview.test.tsx`
  - Verifies basic markdown rendering
  - Ensures predictable heading IDs for TOC navigation
  - Checks fenced code blocks render with language label

- `src/__tests__/markdown-utils.test.ts`
  - Tests parsing helpers used to build TOC (`extractHeadings`) and stable slugs (`slugify`)

---

## 📁 Project Structure

```
markdown-docs-app/
  src/
    data/seedDocs.ts
    models/doc.ts
    ui/
      App.tsx
      Sidebar.tsx
      SplitPane.tsx
      MarkdownPreview.tsx
    utils/
      markdown.ts
      useLocalStorageState.ts
    __tests__/
      App.test.tsx
      MarkdownPreview.test.tsx
      markdown-utils.test.ts
    styles/
      global.css
      app.module.css
      sidebar.module.css
      splitpane.module.css
      markdown.module.css
```

---

## 🔧 Notes / Extension Ideas

- Add **search** for documents
- Add **export** (download markdown) and **import**
- Persist docs to a backend (e.g., Graph/SharePoint, or your own API)
- Add **keyboard shortcuts** (Cmd/Ctrl+K, Cmd/Ctrl+S)
- Add **MDX** support if needed

---

## License

MIT (add/change as needed)
