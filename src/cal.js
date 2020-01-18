// This should be the only file required to be imported.

const F = require('./f')
// const util = require('./util')
const strategy = require('./strategy')


module.exports = {
    ...F,
    Strategy: strategy,
}
