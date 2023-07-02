# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# Environment Variables

Configuration is obtained from SSM, but can be overwritten in a local `.env` file. Ensure that the following SSM parameters have been setup and your IAM user has access to them:

- `/codesketcher-$stage/api/endpoint`
- `/codesketcher-$stage/google/client-id`

| Name                        | Description            | Default                                 | Required |
| --------------------------- | ---------------------- | --------------------------------------- | -------- |
| REACT_APP_EXECUTOR_ENDPOINT | Backend Endpoint       | `ssm:/codesketcher-$stage/api/endpoint` | Yes      |
| REACT_APP_GOOGLE_CLIENT_ID  | Google oAuth Client ID | `/codesketcher-$stage/google/client-id` | Yes      |

Or if you would like to use your own values:

```sh
cp .env.example .env
# Then modify the values
```

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
