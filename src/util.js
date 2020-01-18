
function flow(flowName, tasks) {
    return async browser => {
        for (const func of tasks) {
            await func(browser, flowName)
        }
        browser.end()
    }
}

function calendarDefinitionsToFlows(calendars, runSetupOnly) {
    const result = {}
    const setupFlow = []
    for (const [name, config] of Object.entries(calendars)) {
        const {setup: setupConfigs, flow: tasks} = config
        if (runSetupOnly) {
            if (setupConfigs) {
                for (const setupConfig of setupConfigs) {
                    const [strategy, ...tasks] = setupConfig
                    setupFlow.push(
                        ...tasks,
                        browser => {
                            // console.log(strategy, strategy.constructor.name)
                            strategy.setup(browser, name)
                        },
                    )
                }
            }
        }
        else {
            result[name] = flow(name, tasks)
        }
    }

    if (runSetupOnly) {
        result.SETUP = flow('SETUP', setupFlow)
    }
    console.log(result)
    return result
}

function randId() {
    // https://gist.github.com/gordonbrander/2230317
    return Math.round((Math.random() * 36**12)).toString(36)
}


module.exports = {
    flow,
    calendarDefinitionsToFlows,
    randId,
}
