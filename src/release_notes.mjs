export function createReleaseNotes(history) {
  const notes = []
  const typeList = Object.keys(history)
  for (const type of typeList.sort()) {
    notes.push(`# ${type}\n`)
    const actions = history[type]
    const actionKeys = Object.keys(actions)
    for (const action of actionKeys.sort()) {
      notes.push(`## ${action}\n`)
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

  await octokit.rest.repos.createRelease({
    owner,
    repo,
    name: 'Automated Draft Release',
    tag_name: 'draft-release-tag',
    body: notes,
    draft: true,
  })
}
