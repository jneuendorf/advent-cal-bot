const {calendarDefinitionsToFlows} = require('./util')
const calendars = require('../calendars.template')
// const calendars = require('../calendars')


const runSetupOnly = process.env.SETUP === '1'


module.exports = calendarDefinitionsToFlows(calendars, runSetupOnly)
