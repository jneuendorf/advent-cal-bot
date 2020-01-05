const F = require('./f')
const util = require('./util')
const strategy = require('./strategy')


const flow = util.flow([
    F.load('http://localhost:3000/'),
    // F.wait(2000),
    // F.generic(browser => browser.expect.elements('input').count.to.equal(2)),
    F.auth('test', 'test'),
    F.generic(browser => {
        browser.execute(function() {
            const elems = document.querySelectorAll('[data-day]')
            elems[5].id = 'crazytest'
            // https://gist.github.com/gordonbrander/2230317
            const uid = Math.round((Math.random() * 36**12)).toString(36)

            return elems[5].innerText
            // 'css selector', '[data-day]', result => {
            //     console.log(result)
            // })
        }, [], what => {
            console.log(what)
        })
        browser.expect.elements('#crazytest').count.to.equal(1)
    }),
    
])
console.log(flow)
module.exports = {
    main: flow,
}