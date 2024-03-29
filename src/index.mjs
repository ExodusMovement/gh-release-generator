import * as core from '@actions/core'
import * as github from '@actions/github'
import generateReleaseNotes from './generate-release-notes.mjs'

async function run() {
  try {
    const token = core.getInput('github_token') || process.env.GITHUB_TOKEN
    const octokit = new github.getOctokit(token)
    console.log('github.context.repo=', github.context.repo)

    const id = await generateReleaseNotes(octokit, github.context.repo)

    core.setOutput('releaseId', id)
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
