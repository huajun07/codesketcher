# Backend

## Installing Dependencies

```bash
nvm install
npm install
```

## Getting Started

To run the server locally:

- Ensure that you have permissions to invoke the executor lambda. For example, set your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables to an IAM user with the correct permissions.
- Run `npm run dev`

To deploy to the dev/prod environments (NOTE: **Prod deployment should not be run locally**):

- Set the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables for the correct IAM user
- Run `npm run deploy:dev` or `npm run deploy:prod` to deploy

## Configuration

Configuration is done through the `.env` file. Default configuration is available in `./env/.env.{stage}`

| Name              | Description                               | Default        |
| ----------------- | ----------------------------------------- | -------------- |
| PORT              | Port the server listens on                | 8000           |
| EXECUTOR_REGION   | AWS Region that the executor lambda is in | ap-southeast-1 |
| EXECUTOR_NAME     | Name of the executor lambda               | executor       |
| DB_HOST           | Host Address of DB                        | 127.0.0.1      |
| DB_USERNAME       | DB Username                               |                |
| DB_PASSWORD       | DB User password                          |                |
| DB_NAME           | Database name                             |                |
| DB_PORT           | DB Port                                   | 5432           |
| DB_MIN_POOL_SIZE  | DB pool min no. of connections            | 50             |
| DB_MAX_POOL_SIZE  | DB pool max no. of connections            | 200            |
| DB_ENABLE_LOGGING | Toggles logging of DB queries             | false          |

## Postgresql Setup (macOS)

Install and start the postgresql service.

```sh
brew install postgresql
brew services start postgresql
```

Create a table and user according to the environment variables `DB_NAME`

```sh
# Create table in default host, port and user with default table name
$ createdb -h localhost -p 5432 -U postgres codesketcher
```

### Migrations

```sh
npm run build
# Make sure that the .env file has the correct values
npm run db:migrate
```

## Running Tests

```bash
npm run test
```
