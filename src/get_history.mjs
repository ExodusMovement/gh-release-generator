const query = `#graphql
  query GetHistory($owner: String!, $name: String!, $first: Int!,
    $since: GitTimestamp, $after: String) {
    repository(owner: $owner, name: $name) {
      object(expression: "master") {
        ... on Commit {
          history(first: $first, since: $since, after: $after) {
            nodes {
              oid
              message
              author {
                user {
                  login
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    }
  }`

const ACTIONS = ['feat', 'fix', 'chore']
const TYPES = ['prod', 'dev', 'eden', 'genesis']

export default async function getHistory(octokit, owner, name, since) {
  let hasNextPage
  let after
  let messages = {}

  do {
    console.log(`getHistory() owner=${owner}, name=${name}, since=${since}`)
    const result = await octokit.graphql(query, { owner, name, since, first: 100, after })
    const pageInfo = result.repository.object?.history?.pageInfo

    hasNextPage = pageInfo.hasNextPage
    after = pageInfo.endCursor

    const theseNodes = result.repository.object?.history?.nodes

    for (const node of theseNodes) {
      const lines = node.message.split('\n').map((line) => line.trim())

      // Find the type line
      let typeIndex = lines.findIndex(
        (line) => TYPES.findIndex((type) => line.startsWith(type)) !== -1
      )

      // If no such line, let's just skip this one since it's not interesting
      if (typeIndex === -1) continue

      const typeName = lines[typeIndex]
      const typeMessages = messages[typeName] || []

      // Back up to last non-empty line
      while (lines[typeIndex--] === '');

      const description = lines.slice(0, typeIndex).join('\n')

      // Grab the action prefix, and get the full prefix up to the colon. This
      // handles instances like `feat(assets):`.
      const actionPrefix = ACTIONS.findIndex((action) => description.startsWith(action))
      if (actionPrefix === -1) {
        typeMessages['none'] = typeMessages['none'] || []
        typeMessages['none'].push(description)
      } else {
        const colon = description.indexOf(':')
        const fullPrefix = description.slice(0, colon).trim()
        const restOfLine = description.slice(colon + 1).trim()
        typeMessages[fullPrefix] = typeMessages[fullPrefix] || []
        typeMessages[fullPrefix].push(restOfLine)
      }

      messages[typeName] = typeMessages
    }
  } while (hasNextPage)

  return messages
}
