import getHistory from './get_history.mjs'
import getReleases from './get_releases.mjs'
import { parseHighlights } from './parse_highlights.mjs'
import { createReleaseNotes, writeReleaseNotes } from './release_notes.mjs'

export default async function generateReleaseNotes(octokit, { owner, repo }) {
  const { latestRelease, release: draftRelease } = await getReleases(octokit, owner, repo)

  const since = latestRelease?.tagCommit?.committedDate
  const id = draftRelease?.databaseId
  const highlights = parseHighlights(draftRelease?.description)

  const history = await getHistory(octokit, owner, repo, since)
  const notes = await createReleaseNotes(history, highlights)
  const release_id = await writeReleaseNotes(octokit, owner, repo, id, notes)
  return release_id
}
