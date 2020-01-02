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
const auth = (username, password, {
                     selectors=defaultSelectors, 
                     submit=true,
                     waitForElement='body',
                    }={}) => {
    return browser => {
        if (waitForElement) {
            browser.waitForElementVisible(waitForElement)
        }
        
        browser.setValue(selectors.username, username)
        browser.setValue(selectors.password, password)
        if (submit) {
            browser.click(selectors.submitButton)
        }
    }
}

const findElementForDay = (day=(new Date()).getDate(), strategy) => {
    
}

// const oauth = () => {
// 
// }

// e

module.exports = {
    generic,
    load,
    awaitElement,
    wait,
    done,
    auth,
    findElementForDay,
}