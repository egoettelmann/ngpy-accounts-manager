NgPy-Accounts-Manager
=====================

Small webapp to manage accounts with some statistics.


## Tech Stack

[![Build Status](https://travis-ci.org/egoettelmann/ngpy-accounts-manager.svg?branch=develop)](https://travis-ci.org/egoettelmann/ngpy-accounts-manager)

- Angular 8
- Flask / SQLAlchemy

## Installation, build and run

First, install and run the backend with python:

```
pip install -r requirements.txt
python ngpy-accounts-manager-api/web.py
```

Then, install and run the frontend through the Webpack dev server:

```
npm install
npm run start --prefix ngpy-accounts-manager-ui
```

To simply build the frontend:
```
npm run build
```

## Release Notes

### `0.6.0`

- Added budget section
- Fixed quarterly formula
- Added datepicker for forms
- Added Python unit tests
- Added Alembic for DB migrations
- Major rework of code structure 

### `0.5.0`

- Added native Python logging
- Switched to Python type-hinting
- Worked on CI: added frontend tests and set-version
- Added RQL support for better requests flexibility
- Improved PWA compliance and responsiveness
- Added alerts on dashboard
- Charts display more data
- Improved search form

### `0.4.1`

- Added scheduler for sending notifications
- Refactored frontend app structure
- Added analytics details charts
- Migrated to Angular 8 and Clarity 2
- Improved responsiveness

### `0.3.0`

- Created global search
- Improved transaction form
- Added alert message on dashboard for unassigned transactions

### `0.2.2`

- Responsiveness on mobile improved
- Added settings section for managing labels, categories and accounts

### `0.2.1`

- Separated app into multiple modules that are lazy-loaded
- Migrated to Angular 5.1.0
- Fixed design issues


## Roadmap

### Migration to AWS

- Database
  - best option seems to be Aurora Serverless
    - https://aws.amazon.com/fr/rds/aurora/serverless/
    - https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.how-it-works.html
- Frontend
  - push to public s3 bucket
- Deploy
  - Github Actions may be a solution
    - https://blog.jakoblind.no/aws-lambda-github-actions/
  - CircleCI
    - https://circleci.com/orbs/registry/orb/circleci/aws-sam-serverless
  - Otherwise Travis, AWS CodeBuild/CodeDeploy ?

### Tech

- Create a PWA with Angular ?

### Features

- Add possibility to close a period at a given date
  - Impossible to change amount or account of a transaction before this date
  - Period can only be closed at a date of 30 days before the current day
- Add sort and filters on transactions table
- Add document section for RIB
- Some machine learning on existing labels for auto-importing transactions
