module.exports = {
    'no_auth': function(browser) {
        browser
        .url('http://localhost:3000/')
        .waitForElementVisible('body')
        
        browser.setValue('input[name="username"]', 'test')
        browser.setValue('input[name="password"]', 'test')
        browser.expect.elements('input').count.to.equal(2)
        
        browser.click('button')
        
        browser.waitForElementVisible('body')
        browser.expect.elements('[data-day]').count.to.equal(24)
        browser.click('[data-day="1"]')
        browser.waitForElementVisible('h1')
        browser.expect.element('h1').text.to.equal('Day 1')

        browser.end()
    }
};
