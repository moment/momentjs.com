# This workflow compiles the site and runs markdown-doctest for PRs.
# On `master` branch, this also deploys the site (via the `gh-pages` branch).
name: Compile and test website

on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master
jobs:
  compile:
    name: Compile and test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: lts/*
          cache: npm

      - name: Compile
        run: ./compile.sh

      - name: Test docs examples
        run: npm run doctest

      - name: Deploy to GitHub Pages
        # Only run this step on the master branch
        if: github.event_name == 'push' && github.ref == 'refs/heads/master'
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: build
          branch: gh-pages
          git-config-name: 'github-actions[bot]'
          git-config-email: 'github-actions[bot]@users.noreply.github.com'
          single-commit: true
          commit-message: 'Deploy ${{ github.sha }} to GitHub Pages'
