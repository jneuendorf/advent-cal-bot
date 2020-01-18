const {
    url,
    auth,
    clickCurrentWindow,
    Strategy,
} = require('./src/cal')


const exampleImageStrategy = new Strategy.Image('img')


module.exports = {
    example: {
        // List of [[strategy, ...flow]]
        setup: [
            // Single strategy setup: strategy instance followed by
            // steps to navigate to the calendar windows.
            [
                exampleImageStrategy,
                url('http://localhost:3000/'),
                auth('test', 'test'),
                url('http://localhost:3000/cal_imgs'),
            ],
        ],
        flow: [
            url('http://localhost:3000/'),
            auth('test', 'test'),
            url('http://localhost:3000/cal_imgs'),
            clickCurrentWindow(exampleImageStrategy),
            browser => {
                browser.url(({value}) => console.log(value))
                browser.expect.url().to.contain(`?day=${new Date().getDate()}`)
            }
        ]
    },
}
