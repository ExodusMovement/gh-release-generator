import * as core from '@actions/core'
import * as github from '@actions/github'
import generateReleaseNotes from './generate-release-notes.mjs'

async function run() {
  try {
    const token = core.getInput('github_token') || process.env.GITHUB_TOKEN
    const octokit = new github.getOctokit(token)

    const id = await generateReleaseNotes(octokit, github.context.repo)

    core.setOutput(id)
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
