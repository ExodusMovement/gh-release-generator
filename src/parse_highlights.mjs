import { HIGHLIGHT_END, HIGHLIGHT_START } from './constants.mjs'

export function parseHighlights(description) {
  if (!description) {
    return []
  }

  const lines = description.split('\n').map((line) => line.trim())
  const comments = []

  let grabEm

  for (const line of lines) {
    if (line === HIGHLIGHT_START) {
      grabEm = true
      continue
    } else if (line === HIGHLIGHT_END) {
      grabEm = false
    }

    if (grabEm) {
      comments.push(line)
    }
  }

  return comments
}
