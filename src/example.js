const F = require('./f')
const util = require('./util')
// const strategy = require('./strategy2')
const strategy = require('./strategy')


// const image_strategy =

const flow = util.flow('example', [
    F.load('http://localhost:3000/'),
    // F.wait(2000),
    // F.generic(browser => browser.expect.elements('input').count.to.equal(2)),
    F.auth('test', 'test'),
    // F.generic(browser => {
    //     browser.expect.elements('[data-day]').count.to.equal(24)
    // }),

    // F.clickCurrentWindow(strategy.text('[data-day]', day => `Day ${day}`)),
    // F.clickCurrentWindow(new strategy.Text('[data-day]', day => `Day ${day}`)),
    F.load('http://localhost:3000/cal_imgs'),
    // // F.init_strategy(strategy.image),
    F.clickCurrentWindow(new strategy.Image('img')),
    F.generic(browser => {
        browser.url(({value}) => console.log(value))
         browser.expect.url().to.contain(`?day=${new Date().getDate()}`)
    }),
])
// console.log(flow)
module.exports = {
    main: flow,
}
