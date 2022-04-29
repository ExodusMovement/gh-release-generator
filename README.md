# GH Release Generator Github Action

This archive provides a Github Action which will iterate commits from the last
release until the present, and create a set of release notes based on each
commit message.

## Expected structure of the commit message

At Exodus, we use conventional commits, so the description is expected to have a
preamble keyword, followed by a colon ":", then followed by a commit message.
Also, following the commit description will be a single keyword which will allow
us to group the commits into releases.

The release keywords are:

1. `prod`
1. `genesis`
1. `eden`
1. `dev`

Typically these come after the description with two blank lines before it. The
conventional commit will then allow us to further break these down into
sub-categories. Some examples follow:

### Merged PR Commit Examples

```
feat(nfts): adding infinite scroll pagination on NFTs collection (#12833)

prod
```

```
feat: Use constant DEV_START_ROUTE to configure a route to redirect to in DEV (#12886)

dev
```

```
docs: mention components demo in guide (#12884)

dev
```

```
fix: include multi-network-assets (#12878)

prod
```

## Collated Release Body

The merged commits are collated and ordered by release keyword, by commit
keyword preamble, then by order encountered in the commit list.

### Release Body Example

```
# dev

## feat

- Use constant DEV_START_ROUTE to configure a route to redirect to in DEV (#12886)
- log binded action (#12883)

# eden

## feat

- add KIN, POLIS, stSol, XCOPE, DFL, FTT, GENE, stETH to Eden (#12866)

# prod

## chore

- eslint-plugin-simple-import-sort (#12264)
- bump node-fetch 2.6.1 to 2.6.7 (#12490)

## feat

- remove dependence on backup key in info.seco (#12841)
- hide network badge from portfolio donut (#12857)
- add new currencies (#12829)
- shorten assets name (#12766)
```

## How to setup up

Create a workflow file in your project under `.github/workflows/gh-release-generator.yml`. The file should look
like this:

```yaml
name: GH Release Generator Action
on:
  push:
    branches:
      - master
concurrency: ci-${{ github.repository }}
jobs:
  release_generator:
    runs-on: ubuntu-latest
    steps:
      - name: GH Release Generator
        uses: ExodusMovement/gh-release-generator@v1.0.1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

Make sure you use the latest version of the release generator.
