const generic = callback => callback

const load = (url) => browser => browser.url(url)

const wait = time => browser => browser.pause(time)

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
) => async browser => {
    try {
        const elementSelector = await strategy(day, browser)
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
    load,
    wait,
    done,
    auth,
    clickCurrentWindow,
}
