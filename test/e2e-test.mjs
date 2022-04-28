import { Octokit } from 'octokit'
import generateReleaseNotes from '../src/generate-release-notes.mjs'

async function run() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
  await generateReleaseNotes(octokit, 'exodus-desktop')
}

run().catch(console.error)
