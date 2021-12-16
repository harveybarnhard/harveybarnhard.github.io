# [harveybarnhard.com](https://harveybarnhard.com)

[![Deploy Website to gh-pages branch](https://github.com/harveybarnhard/harveybarnhard.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/harveybarnhard/harveybarnhard.github.io/actions/workflows/deploy.yml)

# How the Website is Deployed
Here is the process of how my website is deployed:
1. I make some changes and push these changes to the `master` branch of the repository.
2. This push (or a pull-request) will rev up Github Actions, and the scripts contained
   in /src will be executed, outputting any results to /public. Note that /public also
   contains static html files I've already made "by hand" along with CSS style sheets,
   javascript, and everything else that is strictly necessary for the website to look real good.
3. The entire directory /public, and nothing else, is moved to the `gh-pages` branch using
   [this Action](https://github.com/peaceiris/actions-gh-pages).
4. The website is then deployed from the `gh-pages` branch.
