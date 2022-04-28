import getHistory from './get_history.mjs'
import getReleases from './get_releases.mjs'
import { createReleaseNotes, writeReleaseNotes } from './release_notes.mjs'

export default async function generateReleaseNotes(octokit, repo, owner = 'ExodusMovement') {
  const { latestRelease, release: draftRelease } = await getReleases(octokit, owner, repo)

  const since = latestRelease?.tagCommit?.committedDate
  const id = draftRelease?.databaseId

  const history = await getHistory(octokit, owner, repo, since)
  const notes = await createReleaseNotes(history)
  await writeReleaseNotes(octokit, owner, repo, id, notes)
}
