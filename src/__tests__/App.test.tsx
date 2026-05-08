
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../ui/App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the app shell', () => {
    render(<App />)
    expect(screen.getByText('Markdown Docs')).toBeInTheDocument()
    expect(screen.getByLabelText('Document navigation')).toBeInTheDocument()
    expect(screen.getByLabelText('Markdown editor')).toBeInTheDocument()
    expect(screen.getByLabelText('Markdown preview')).toBeInTheDocument()
  })

  it('switches documents from the sidebar', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Click the second seeded document
    // await user.click(screen.getByRole('button', { name: /Markdown Formatting/i }))
    await user.click(screen.getByRole('button', { name: 'Markdown Formatting' }))

    // Editor should update to selected doc content
    const editor = screen.getByLabelText('Markdown editor') as HTMLTextAreaElement
    expect(editor.value).toMatch('# Markdown Formatting')
  })

  it('creates a new document and selects it', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'New' }))

    const editor = screen.getByLabelText('Markdown editor') as HTMLTextAreaElement
    expect(editor.value).toMatch('# New Document')
  })
})

