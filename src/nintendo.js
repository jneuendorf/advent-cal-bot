// const searchCommands = {
//     submit() {
//         this.waitForElementVisible('@tiles', 1000)
//
//         return this // Return page object for chaining
//     }
// }

module.exports = {
    // url: 'https://www.nintendo.de/News/Adventskalender/Adventskalender-1686683.html',
    // commands: [searchCommands],
    // elements: {
    //     tiles: {
    //         selector: '.mosaic-item'
    //     }
    // }
    'Nintendo': function(browser) {
        browser
        .url('https://www.nintendo.de/News/Adventskalender/Adventskalender-1686683.html')
        .waitForElementVisible('.mosaic-item')

        browser.expect.elements('.mosaic-item').count.to.equal(24)

        browser.element('css selector', '.mosaic-item a[title$="24"]', result => {
            console.log('>>', result)
            browser.execute(
                'arguments[0].scrollIntoView({behavior: "instant", block: "center", inline: "center"})',
                [result.value],
            )
            browser.click(result.value.ELEMENT)
            browser.expect.url()
                .to.endWith('www.nintendo.de/News/Adventskalender/2019/Nintendo-Adventskalender-Tag-24-1691139.html')
        })

        // browser.click('.mosaic-item a[title$="24"]')
        //     .expect.url()
        //     .to.be('https://www.nintendo.de/News/Adventskalender/2019/Nintendo-Adventskalender-Tag-24-1691139.html')

        // const tiles = browser.elements('.mosaic-item')
        // const tile24 = tiles

        // .assert.titleContains('Ecosia')
        // .assert.visible('input[type=search]')
        // .setValue('input[type=search]', 'nightwatch')
        // .assert.visible('button[type=submit]')
        // .click('button[type=submit]')
        // .assert.containsText('.mainline-results', 'Nightwatch.js')

        // console.log(tiles)

        browser.end()
    }
};
