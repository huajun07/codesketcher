# Executor Service

## Installing Dependencies

```bash
pip install -r requirements.txt
npm install
```

## Getting Started

To deploy to the dev/prod environments (NOTE: **Prod deployment should not be run locally**):

- Set the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables for the correct IAM user
- Run `npm run deploy:dev` or `npm run deploy:prod` to deploy

## Running Tests

```bash
pytest
```
