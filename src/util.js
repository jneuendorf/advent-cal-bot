module.exports = {
    flow(...args) {
        let flowName, flow
        if (args.length === 2) {
            ([flowName, flow] = args)
        }
        else {
            flow = args
        }

        global.FLOW_NAME = flowName

        return async browser => {
            for (const func of flow) {
                await func(browser)
            }
            browser.end()
        }
    },
    // promisify(func) {
    //     return function(...args) {
    //         return new Promise((resolve, reject) => {
    //             try {
    //                 const result = await func(...args)
    //                 resolve(result)
    //             }
    //             catch (error) {
    //                 reject(error)
    //             }
    //         })
    //     }
    // },
    randId() {
        // https://gist.github.com/gordonbrander/2230317
        return Math.round((Math.random() * 36**12)).toString(36)
    },
}
