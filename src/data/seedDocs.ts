
import type { Doc } from '../models/doc'

export const seedDocs: Doc[] = [
  {
    id: 'doc-welcome',
    title: 'Welcome',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    updatedAt: Date.now() - 1000 * 60 * 60 * 5,
    content: `# Welcome\n\nThis is a **professional-grade** Markdown documentation app.\n\n## Features\n\n- Split-pane editor (Markdown + Preview)\n- Sidebar document navigation\n- GFM tables, tasks, strikethrough (via remark-gfm)\n- Syntax highlighting for fenced code blocks\n\n## Code Example\n\n\`\`\`ts\nexport function sum(a: number, b: number) {\n  return a + b\n}\n\`\`\`\n\n---\n\n> Tip: Drag the divider to resize the editor and preview panes.\n`
  },
  {
    id: 'doc-formatting',
    title: 'Markdown Formatting',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    updatedAt: Date.now() - 1000 * 60 * 60 * 7,
    content: `# Markdown Formatting\n\n## Basics\n\n- *Italic* and **bold**\n- Inline code: \`const x = 1\`\n\n## Lists\n\n1. Ordered\n2. Lists\n\n- Unordered\n- Lists\n\n## Tasks\n\n- [x] Write docs\n- [ ] Add diagrams\n\n## Table (GFM)\n\n| Column | Value |\n|---|---|\n| A | 1 |\n| B | 2 |\n`
  }
]
