const F = require('./f')


module.exports = {
    // flow(flow) {
    //     return browser => {
    //         for (const func of flow) {
    //             func(browser)
    //         }
    //         F.done()
    //     }
    // },
    // flowAsync(flow) {
    //     return async browser => {
    //         for (const func of flow) {
    //             await func(browser)
    //         }
    //         F.done()
    //     }
    // },
    flow(flow) {
        return async browser => {
            for (const func of flow) {
                await func(browser)
            }
            F.done()
        }
    },
}