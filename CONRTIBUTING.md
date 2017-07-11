## Local installation

```
git clone <this repo>
cd analyst-ui
npm install
npm run build
npm start
```

## Testing locally

```
npm test
```

## Linting

```
npm run lint
```

The JavaScript style used is based on [Standard](https://standardjs.com/).
We make one override to prefer double-quotes in JSX, which is much
more common in the React ecosystem and in HTML code in general.

Under the hood, we must also use the `babel-eslint` parser so that static
properties on classes (a very cutting-edge JavaScript syntax feature) is not
marked as errors.

Because `create-react-app` has its own linting system, this is not tied into
the `npm run build` script. Our test script has been augmented to run this
separately.

## Testing publicly

- Make all changes in a different branch, then make a pull request.
- All commits are tested by CircleCI.
- Pull requests will deploy an instance to Netlify. See the pull request details for the link.
