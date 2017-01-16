Upvista (work in progress)
=================================
[![Build Status](https://travis-ci.org/arusakov/upvista.svg?branch=master)](https://travis-ci.org/arusakov/upvista)
[![codecov](https://codecov.io/gh/arusakov/upvista/branch/master/graph/badge.svg)](https://codecov.io/gh/arusakov/upvista)
[![Known Vulnerabilities](https://snyk.io/test/github/arusakov/upvista/badge.svg)](https://snyk.io/test/github/arusakov/upvista)

Dependencies
------------
* Node.js (v7.2.1+) and npm (v3+)
* PostgreSQL (v9.5+)

ENV variables
------------
see [env.ts](src/env.ts)

Development
-----------
**First steps**
* run `npm install` in project root
* see `scripts` in `package.json`
* start PG and `createdb upvista`

**Main commands**
* `npm run dev` - run server via nodemon (auto relaunch)
* `npm run test-ci` - run unit tests in watch mode
* `npm run coverage` - code coverage in text format in terminal
* `npm run coverage-html` - code coverage in html format in `coverage` folder
