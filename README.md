NgPy-Accounts-Manager
=====================

Small webapp to manage accounts with some statistics.


## Tech Stack

- Angular 4
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

### `0.2.1`

- Separated app into multiple modules that are lazy-loaded
- Migrated to Angular 5.1.0
- Fixed design issues


## Roadmap

### Tech

- Review the lifecycle of the db's session
- Review backend logging
- Enhance app responsiveness
- Create a native app with Angular ?

### Features

- Automatically create label if it does not exist
- Create settings view for managing labels, categories and accounts
- Add todo list on dashboard or alert bubbles on menu for inconsistent data
- Add comment field to transactions
- Improve transaction form
- Add sort and filters on transactions table
- Create global search
- Add document section for RIB
- Some machine learning on existing labels for auto-importing transactions
