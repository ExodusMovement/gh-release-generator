import { HIGHLIGHT_END, HIGHLIGHT_START, ACTIONS, TYPES } from './constants.mjs'

export function createReleaseNotes(history, highlights) {
  const notes = []

  // Preserve any comments at the top
  if (highlights.length > 0) {
    notes.push(HIGHLIGHT_START)
    notes.push(...highlights)
    notes.push(HIGHLIGHT_END)
    notes.push('')
  }

  const typeList = Object.keys(history)

  // Go though all types first, drilling down into
  // the actions. This sorts all of the entries alphabetically
  // as well.
  for (const type of typeList.sort()) {
    notes.push(`# ${TYPES[type]}\n`)
    const actions = history[type]
    const actionKeys = Object.keys(actions)
    for (const action of actionKeys.sort()) {
      notes.push(`## ${ACTIONS[action]}\n`)
      const descriptions = actions[action]
      for (const desc of descriptions) {
        notes.push(`- ${desc}`)
      }
      notes.push('')
    }
  }

  return notes.join('\n')
}

// Why use the REST API?! Because for some reason, they never added any mutations
// create and update releases for a repo. There has been an open request for this
// in the GH community since 2018:
// https://github.community/t/creating-a-github-release-using-github-api-v4/13633
//
export async function writeReleaseNotes(octokit, owner, repo, id, notes) {
  if (id) {
    await octokit.rest.repos.deleteRelease({
      owner,
      repo,
      release_id: id,
    })
  }

  const result = await octokit.rest.repos.createRelease({
    owner,
    repo,
    name: 'Automated Draft Release',
    tag_name: 'draft-release-tag',
    body: notes,
    draft: true,
  })
  console.log('release url: ', result.data.html_url)
  return result.data.id
}
