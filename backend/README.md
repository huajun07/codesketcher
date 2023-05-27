# Backend

## Installing Dependencies

```bash
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

| Name            | Description                               | Default        |
| --------------- | ----------------------------------------- | -------------- |
| PORT            | Port the server listens on                | 8000           |
| EXECUTOR_REGION | AWS Region that the executor lambda is in | ap-southeast-1 |
| EXECUTOR_NAME   | Name of the executor lambda               | executor       |

## Running Tests

```bash
npm run test
```
