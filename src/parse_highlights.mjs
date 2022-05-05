import { HIGHLIGHT_END, HIGHLIGHT_START } from './constants.mjs'

export function parseHighlights(description) {
  const lines = description.split('\n')
  const comments = []
  for (const line of lines) {
    let grabEm
    if (line === HIGHLIGHT_START) {
      grabEm = true
      continue
    } else if (line === HIGHLIGHT_END) {
      grabEm = false
    }
    if (grabEm) comments.push(line)
  }

  return comments
}
