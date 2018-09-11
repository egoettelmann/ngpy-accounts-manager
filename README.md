NgPy-Accounts-Manager
=====================

Small webapp to manage accounts with some statistics.


## Tech Stack

- Angular 5
- Flask / SQLAlchemy

## Installation and run

First, install and build the frontend:

```
npm install --prefix frontend
npm run build --prefix frontend
```

Then, simply run the backend with python:

```
python index.py
```

## Release Notes

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

### Tech

- Review the lifecycle of the db's session
- Review backend logging
- Create a native app with Angular ?

### Features

- Automatically create label if it does not exist on transaction table
- Improve alerts on dashboard:
  - labels without category
  - labels without transactions
  - last account update that is too old
- Add possibility to close a period at a given date
  - Impossible to change amount or account of a transaction before this date
  - Period can only be closed at a date of 30 days before the current day
- Add comment field to transactions
- Add sort and filters on transactions table
- Add document section for RIB
- Some machine learning on existing labels for auto-importing transactions
