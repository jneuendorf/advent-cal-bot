// const selector = (day, selector, browser) => (day, browser) => {
//     browser.elements(selector)
// }

const text = (windowsSelector, getText) => (day, browser) => {
    browser.expect.elements(windowsSelector).count.to.equal(24)

    // https://gist.github.com/gordonbrander/2230317
    const uid = Math.round((Math.random() * 36**12)).toString(36)
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
            result => {
                console.log('result', result)
                if (Array.isArray(result)) {
                    reject(`${result[0]}: ${result[1]}`)
                }
                else if (!result) {
                    reject(null)
                }
                else {
                    resolve(`#${uid}`)
                }
            },
        )
    })
}

const ocr = day => (day, browser) => {
    // TODO: magic
}

module.exports = {
    text,
    ocr,
}
