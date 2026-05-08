

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
    const md = [
      '```ts',
      'const x: number = 1',
      '```'
    ].join('\n')

    render(<MarkdownPreview markdown={md} />)

    // language badge
    expect(screen.getByText('ts')).toBeInTheDocument()
    // code text appears
    expect(screen.getByText(/const x/)).toBeInTheDocument()
  })
})

