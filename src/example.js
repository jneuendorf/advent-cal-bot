const F = require('./f')
const util = require('./util')


const flow = util.flow([
    F.load('http://localhost:3000/'),
    // F.wait(2000),
    F.generic(browser => browser.expect.elements('input').count.to.equal(2)),
    F.auth('test', 'test'),
    F.generic(browser => {
        browser.expect.elements('[data-day]').count.to.equal(24)
    }),
])
console.log(flow)
module.exports = {
    main: flow,
}