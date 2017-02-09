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

Production
----------
* global NODE_ENV=production
* use [pm2](https://github.com/Unitech/pm2)
* `npm install -g pm2@latest`
* `cd /path-to-project`
* `npm view upvista dist.tarball | xargs curl | tar --strip-components=1 -zxv`
* `npm install --ignore-script`
* specify global env before next cmd
* `pm2 start ./ --name upvista -i max --merge-logs --log-date-format="YYYY-MM-DD HH:mm:ss.SSS Z"`
* `pm2 save`
* use `pm2 reload upvista` for [reloading](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/)
* use `pm2 flush` for [flush logs](http://pm2.keymetrics.io/docs/usage/log-management/#flushing-logs)
* use `pm2 startup` for generate [startup script](http://pm2.keymetrics.io/docs/usage/startup/)
