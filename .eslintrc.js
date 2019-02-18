module.exports = {
  extends: "airbnb",
  rules: {
    "react/prefer-stateless-function": [0],
    "react/jsx-filename-extension": [0],
    "import/prefer-default-export": [0],
    "react/destructuring-assignment": [0],
    "no-underscore-dangle": [0],
    "react/forbid-prop-types": [0],
    "no-console": [0],
    "jsx-a11y/anchor-is-valid": [0],
    "no-param-reassign": [0],
    "no-script-url": [0]
  },
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true
  }
};