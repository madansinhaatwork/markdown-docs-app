import { render, screen } from '@testing-library/react'
import { MarkdownPreview } from '../ui/MarkdownPreview'

describe('MarkdownPreview', () => {
  it('renders basic markdown elements', () => {
    const md = '# Title\n\nThis is **bold** and *italic*.'
    render(<MarkdownPreview markdown={md} />)

    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument()
    expect(screen.getByText('bold')).toBeInTheDocument()
  })

  it('adds ids to headings using slugify', () => {
    const md = '## Hello World'
    const { container } = render(<MarkdownPreview markdown={md} />)

    const h2 = container.querySelector('h2')
    expect(h2).toBeTruthy()
    expect(h2?.getAttribute('id')).toBe('hello-world')
  })

  it('renders fenced code blocks with language label', () => {
    const md = ['```ts', 'const x: number = 1', '```'].join('\n')
    const { container } = render(<MarkdownPreview markdown={md} />)

    // ✅ language badge is rendered
    expect(screen.getByText('ts')).toBeInTheDocument()

    // ✅ Prism splits tokens across spans; assert using the <code> element textContent
    const codeEl = container.querySelector('code.language-ts')
    expect(codeEl).toBeTruthy()
    expect(codeEl?.textContent).toMatch(/const\s+x/i)
  })
})