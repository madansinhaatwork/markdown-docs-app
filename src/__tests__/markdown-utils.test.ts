
import { extractHeadings, slugify } from '../utils/markdown'

describe('markdown utils', () => {
  it('slugify creates stable ids', () => {
    expect(slugify('Hello, World!')).toBe('hello-world')
    expect(slugify('  Multiple   spaces  ')).toBe('multiple-spaces')
    expect(slugify('A---B')).toBe('a-b')
  })

  it('extractHeadings finds headings and their depth', () => {
    const md = [
      '# H1',
      'text',
      '## H2',
      '### H3',
      '#### H4',
      '',
      'Not a heading',
      '#Another (invalid)',
    ].join('\n')

    const headings = extractHeadings(md)
    expect(headings.map(h => [h.depth, h.text])).toEqual([
      [1, 'H1'],
      [2, 'H2'],
      [3, 'H3'],
      [4, 'H4']
    ])
  })

  it('extractHeadings ignores code fences', () => {
    const md = [
      '# Real',
      '```',
      '# Not real',
      '```',
      '## Also real'
    ].join('\n')

    const headings = extractHeadings(md)
    expect(headings.map(h => h.text)).toEqual(['Real', 'Also real'])
  })
})

