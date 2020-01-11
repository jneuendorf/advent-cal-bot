const {BaseStrategy} = require('./base')
const {randId} = require('../util')


// Finds a window by matching the given text
// with each calendar door's '.innerText' attribute.
class TextStrategy extends BaseStrategy {
    constructor(windowsSelector, getText) {
        super()
        this.setKwargs({windowsSelector, getText})
    }

    find(day, browser) {
        const {windowsSelector, getText} = this

        browser.expect.elements(windowsSelector).count.to.equal(24)

        const uid = `id_${randId()}`
        const expectedText = getText(day)

        return new Promise((resolve, reject) => {
            browser.execute(
                function(selector, expectedText, id) {
                    try {
                        const elems = document.querySelectorAll(selector)
                        const windowElement = [...elems].find(elem =>
                            elem.innerText === expectedText
                        )
                        if (windowElement) {
                            windowElement.id = id
                            return true
                        }
                        return false
                    }
                    catch (error) {
                        return [error.constructor, error.message]
                    }
                },
                [windowsSelector, expectedText, uid],
                ({value}) => {
                    // console.log('value', value)
                    if (Array.isArray(value)) {
                        reject(`${value[0]}: ${value[1]}`)
                    }
                    else if (!value) {
                        reject(null)
                    }
                    else {
                        resolve(`#${uid}`)
                    }
                },
            )
        })
    }
}


module.exports = {
    TextStrategy,
}
