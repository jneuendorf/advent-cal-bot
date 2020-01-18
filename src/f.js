const generic = callback => callback

const url = url => browser => browser.url(url)

const pause = time => browser => browser.pause(time)

const done = () => browser => browser.end()


const defaultSelectors = {
    username: 'input[type="text"]',
    password: 'input[type="password"]',
    submitButton: 'button[type="submit"]',
}
const auth = (
    username,
    password,
    {
        selectors=defaultSelectors,
        submit=true,
    }={}
) => browser => {
    browser.setValue(selectors.username, username)
    browser.setValue(selectors.password, password)
    if (submit) {
        browser.click(selectors.submitButton)
    }
}


const clickCurrentWindow = (
    strategy=null,
    day=new Date().getDate(),
) => async (browser, flowName) => {
    try {
        const elementSelector = await strategy(day, browser, flowName)
        // console.log(elementSelector)
        browser.click(elementSelector)
    }
    catch (error) {
        if (error === false) {
            console.error('No elements found by strategy.')
        }
        else {
            console.error(error)
        }
    }
}

// const oauth = () => {
//
// }


module.exports = {
    generic,
    url,
    pause,
    done,
    auth,
    clickCurrentWindow,
}
