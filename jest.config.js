/* cfr allow using "import" statements in jest. cfr https://github.com/kenotron/esm-jest */

module.exports = {
  transform: {
    '\\.m?jsx?$': 'esm'
  },
  transformIgnorePatterns: []
};