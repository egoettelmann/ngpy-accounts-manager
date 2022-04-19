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

- [x] Setup with Cloudformation template
  - [x] database: best option seems to be Aurora Serverless
  - [x] backend: lambda (with Docker image)
  - [x] API Gateway
  - [X] UI: push to public s3 bucket
- [ ] Continuous deployment through CircleCI
  - [x] setup build/test pipeline
  - [x] setup release step:
    - [x] push API Docker image to ECR
      - [circleci/aws-ecr](https://circleci.com/developer/orbs/orb/circleci/aws-ecr)
    - [x] push UI as Zip to artifacts bucket
      - [circleci/aws-s3](https://circleci.com/developer/orbs/orb/circleci/aws-s3)
  - [ ] setup deploy step 
    - [x] add an approval step (to trigger deployment)
    - [x] refresh API with `deploy` of Cloudformation template ?
    - [ ] missing 'envsubst' for PROD_BACKEND_URI
    - [ ] write app version (with git hash) to API (`version.txt`)
      - <https://github.com/CircleCI-Public/aws-ecr-orb/issues/182>
    - [x] sync UI artifacts with S3 Web bucket
    - [ ] clear Cloudfront cache
    - [ ] push to master with tag
- [x] Add script for managing admin AWS tasks
  - [x] update IAM policies for CI job
  - [x] update CloudFormation stack
- [ ] Open issues
  - [ ] trigger DB migrations on deploy
    - one option could be to use a dedicated Lambda function
  - [ ] start RDS cluster on page load
    - use an API call to start/get status ?
    - improve UI to display loader
  - [ ] store and load ML pipeline
    - use S3 bucket ?
    - use database (and store also current precision) ?

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
