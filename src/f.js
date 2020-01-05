const generic = callback => callback

const awaitElement = (selector, timeout=5000, kind='visible') => {
    return browser => {
        if (kind === 'visible') {
            browser.waitForElementVisible(selector, timeout)
        }
        else if (kind === 'present') {
            browser.waitForElementPresent(selector, timeout)
        }
        else {
            throw new Error('Invalid argument for "kind".')
        }
    }
}

const load = (url, {waitForBody=true}={}) => browser => {
    browser.url(url)
    if (waitForBody) {
        awaitElement('body')(browser)
    }
}

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
        waitForElementBefore='',
        waitForElementAfter='body',
    }={}
) => browser => {
    if (waitForElementBefore) {
        awaitElement(waitForElementBefore)(browser)
    }

    browser.setValue(selectors.username, username)
    browser.setValue(selectors.password, password)
    if (submit) {
        browser.click(selectors.submitButton)
        if (waitForElementAfter) {
            awaitElement(waitForElementAfter)(browser)
        }
    }
}

const clickCurrentWindow = (
    strategy=null,
    day=new Date().getDate(),
) => async browser => {
    try {
        const elementSelector = await strategy(day, browser)
        console.log(elementSelector)
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
    // browser.useXpath().click("//*[contains(text(), 'Something')]")
}

// const oauth = () => {
//
// }


module.exports = {
    generic,
    awaitElement,
    load,
    wait,
    done,
    auth,
    clickCurrentWindow,
}
