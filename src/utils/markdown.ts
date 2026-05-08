
// // FILE: src/utils/markdown.ts
// export type Heading = {
//   depth: 1 | 2 | 3 | 4 | 5 | 6
//   text: string
//   line: number
// }

// /**
//  * Convert heading/phrase to a stable, URL-friendly id.
//  * Matches typical markdown heading slug behavior.
//  */
// export function slugify(input: string): string {
//   return input
//     .trim()
//     .toLowerCase()
//     .replace(/[^a-z0-9\\s-]/g, '')
//     .replace(/\\s+/g, '-')
//     .replace(/-+/g, '-')
// }

// /**
//  * Extracts markdown headings (#{1,6} Heading) while ignoring fenced code blocks.
//  * This allows a reliable TOC in the Sidebar and gives us deterministic logic to unit test.
//  */
// export function extractHeadings(markdown: string): Heading[] {
//   const lines = markdown.replace(/\\r\\n/g, '\\n').split('\\n')
//   let inFence = false
//   const headings: Heading[] = []

//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i]

//     // Toggle fenced blocks: ``` or ~~~
//     const fence = line.match(/^\\s*(```|~~~)/)
//     if (fence) {
//       inFence = !inFence
//       continue
//     }

//     if (inFence) continue

//     const match = line.match(/^\\s*(#{1,6})\\s+(.+?)\\s*#*\\s*$/)
//     if (!match) continue

//     const depth = match[1].length as Heading['depth']
//     const text = match[2].trim()
//     if (text.length === 0) continue

//     headings.push({ depth, text, line: i + 1 })
//   }

//   return headings
// }

export type Heading = {
  depth: 1 | 2 | 3 | 4 | 5 | 6
  text: string
  line: number
}

/**
 * Convert heading/phrase to a stable, URL-friendly id.
 */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // <-- \s (whitespace)
    .replace(/\s+/g, '-')         // <-- \s (whitespace)
    .replace(/-+/g, '-')
}

/**
 * Extract markdown headings (#..######) while ignoring fenced code blocks.
 */
export function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  let inFence = false
  const headings: Heading[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Toggle fenced blocks: ``` or ~~~
    const fence = line.match(/^\s*(```|~~~)/)
    if (fence) {
      inFence = !inFence
      continue
    }

    if (inFence) continue

    const match = line.match(/^\s*(#{1,6})\s+(.+?)\s*#*\s*$/)
    if (!match) continue

    const depth = match[1].length as Heading['depth']
    const text = match[2].trim()
    if (text.length === 0) continue

    headings.push({ depth, text, line: i + 1 })
  }

  return headings
}
``