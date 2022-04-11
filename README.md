NgPy-Accounts-Manager
=====================

Small webapp to manage accounts, define budgets and get some statistics.

## Usage instructions

The simplest way to run the app is through [Docker](https://www.docker.com/products/docker-desktop/).

1. Rename the `sample.env` file into `.env`
2. Run the `docker-compose.yml` file at the root of the project:
   ```sh
   docker-compose up
   ```
3. Open a browser on:
   - <http://localhost:4200>
4. Login in with following credentials:
   - user: `user`
   - password: `password`
5. Some sample data has been provided to explore the app


## Technical details [![CircleCI](https://circleci.com/gh/egoettelmann/ngpy-accounts-manager/tree/develop.svg?style=svg)](https://circleci.com/gh/egoettelmann/ngpy-accounts-manager/tree/develop)

The app is split in following components:
- a UI, written in Angular and relying on Clarity
- an API, written in Python and relying on Flask with SQLAlchemy
- a relational database (PostreSQL by default)

### Local development

First, install and run the API with Python:
```
cd ngpy-accounts-manager-api
pip install -r requirements.txt -t ./src/site-packages
python src/webserver.py
```
This will start the REST API on <http://localhost:5050>.

Then, install and run the UI through the Angular CLI:
```
cd ngpy-accounts-manager-ui
npm install
npm run start
```
This will start the frontend on <http://localhost:4210>.


## Roadmap

### Migration to AWS

- Database
  - best option seems to be Aurora Serverless
    - https://aws.amazon.com/fr/rds/aurora/serverless/
    - https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.how-it-works.html
- Backend
  - AWS lambda (with Docker image)
- Frontend
  - push to public s3 bucket
- Deploy
  - CircleCI:
    - API: <https://circleci.com/developer/orbs/orb/circleci/aws-ecr>
      - push to ECR as 'release' step
      - how to redeploy lambda ?
    - UI: <https://circleci.com/developer/orbs/orb/circleci/aws-s3>
      - use 'copy' to store artefact in s3
      - use 'sync' to update s3 web bucket
  - AWS CodeBuild/CodeDeploy ?
  - Github Actions ?
    - <https://blog.jakoblind.no/aws-lambda-github-actions/>

### Tech

- Separate Python test dependencies into a separate `requirements` file
  - build would be cleaner (there should be 2 install folders)
  - no need to bundle test dependencies
- Add <https://snyk.io/> ?
- Create a PWA with Angular ?

### Features

- Add possibility to close a period at a given date
  - Impossible to change amount or account of a transaction before this date
  - Period can only be closed at a date of 30 days before the current day
- Add sort and filters on transactions table
- Add document section for RIB
