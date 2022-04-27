import getHistory from './history.mjs'
import getReleases from './releases.mjs'
import { createReleaseNotes, writeReleaseNotes } from './release_notes.mjs'

export default async function generateReleaseNotes(octokit, repo, owner = 'ExodusMovement') {
  const { latestRelease, draftRelease } = await getReleases(octokit, owner, repo)

  let since
  let id

  if (latestRelease) {
    since = latestRelease.tagCommit?.committedDate
  } else if (draftRelease) {
    id = draftRelease.id
  }

  const history = await getHistory(octokit, owner, repo, since)
  const notes = await createReleaseNotes(history)
  await writeReleaseNotes(octokit, owner, repo, id, notes)
}
