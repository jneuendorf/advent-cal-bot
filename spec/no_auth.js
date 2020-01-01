module.exports = {
    'no_auth': function(browser) {
        browser
        .url('http://localhost:3000/')
        .waitForElementVisible('body')

        browser.expect.elements('[data-day]').count.to.equal(24)
        browser.click('[data-day="1"]')
        browser.waitForElementVisible('h1')
        browser.expect.element('h1').text.to.equal('Day 1')

        browser.end()
    }
};
