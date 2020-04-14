/* cfr allow using "import" statements in jest. cfr https://github.com/ActuallyACat/jest-esm-transformer */

module.exports = {
  transform: {
    '\\.jsx?$': 'jest-esm-transformer'
  },
  transformIgnorePatterns: []
};
