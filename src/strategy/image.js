const assert = require('assert')
const path = require('path')

const bodyParser = require("body-parser")
const express = require('express')
const fs = require('fs-extra')

const {BaseStrategy} = require('./base')
const {randId} = require('../util')



const CACHE_DIR = path.posix.resolve(__dirname, '../../cache')
console.log(CACHE_DIR)

function defaultGetUrl(img) {
    return img.src
}


class ImageStrategy extends BaseStrategy {
    // {
    //     0: 22,
    //     1: 13,
    //     ......
    //     23: 2,
    // }
    cache = null
    _cacheFile = null
    _base64Images = null

    constructor(imagesSelector,
                cacheFilename=null,
                getUrl=defaultGetUrl) {
        super()
        this.setKwargs({imagesSelector, cacheFilename, getUrl})
    }

    // // This can't be set in the constructor because 'global.FLOW_NAME' is not
    // // set yet at this time. So we need to postpone getting the global until
    // // runtime.
    // get cacheFile() {
    //     if (!this._cacheFile) {
    //         this._cacheFile = path.join(
    //             CACHE_DIR,
    //             `${this.cacheFilename || global.FLOW_NAME}.json`
    //         )
    //     }
    //     return this._cacheFile
    // }

    async setup(browser, flowName) {
        // If this strategy instance is run multiple times in one flow
        // we don't need to do anything after the 1st run.
        if (this.cache) {
            console.log('cache exists')
            return
        }

        const cacheFile = path.join(
            CACHE_DIR,
            `${this.cacheFilename || flowName}.json`
        )
        console.log('cacheFile', cacheFile)

        // const cacheFile = path.join(
        //     CACHE_DIR,
        //     `${this.cacheFilename || global.FLOW_NAME}.json`
        // )
        // NOTE: 'undefined' works
        //       'true' results in a different error that 'false' oO
        // const cacheFileExists = await fs.pathExists(undefined)
        // const cacheFileExists = await fs.access(cacheFile).then(() => true).catch(() => false)
        // const cacheFileExists = await new Promise((resolve, reject) => {
        //     const fs = require('fs')
        //     fs.access(cacheFile, fs.constants.F_OK, (err) => {
        //         if (err) {
        //             reject(err)
        //             // resolve(false)
        //         }
        //         else {
        //             resolve(true)
        //         }
        //     })
        // })
        const cacheFileExists = fs.existsSync(cacheFile)
        // console.log('cacheFileExists', cacheFileExists, cacheFile)

        // Create a cache file because it does not already exist.
        if (!cacheFileExists) {
            const base64Images = await this._getBase64Images(browser)
            const originalUrl = await new Promise((resolve, reject) => {
                try {
                    browser.url(({value: url}) =>
                        resolve(url)
                    )
                }
                catch (error) {
                    reject(error)
                }
            })
            // console.log('originalUrl', originalUrl)

            const {app, server} = await this._startServer(base64Images)
            browser.url(`http://localhost:${server.address().port}/show`)
            const data = await this._showAndLabelImages(app, base64Images)
            console.log('writing data to', cacheFile)
            fs.writeJsonSync(cacheFile, data)
            console.log('wrote/updated cache file', cacheFile)
            await this._stopServer(server)

            // Return to the URL that show the calendar.
            browser.url(originalUrl)
        }
        else {
            console.log('using existing cache file')
        }

        // Load the cache file.
        this.cache = fs.readJsonSync(cacheFile)
    }

    find(day, browser) {
        assert.ok(this.cache, 'No cache found.')

        let imageIndex
        for (const [key, val] of Object.entries(this.cache)) {
            if (val === `${day}`) {
                imageIndex = parseInt(key, 10)
                break
            }
        }

        if (!imageIndex) {
            throw new Error('Invalid/incorrect cache file. Please regenerate!')
        }

        console.log('image index for day', day, ':', imageIndex)
        const uid = `id_${randId()}`
        return new Promise((resolve, reject) => {
            browser.execute(
                function(selector, index, id) {
                    try {
                        const elems = document.querySelectorAll(selector)
                        const elem = elems[index]
                        elem.id = id
                    }
                    catch (error) {
                        return [error.constructor, error.message]
                    }
                },
                [this.imagesSelector, imageIndex, uid],
                ({value}) => {
                    if (Array.isArray(value)) {
                        reject(`${value[0]}: ${value[1]}`)
                    }
                    else {
                        resolve(`#${uid}`)
                    }
                }
            )
        })
    }

    // @cached
    _getBase64Images(browser) {
        const {
            _base64Images,
            imagesSelector,
            getUrl,
        } = this

        if (_base64Images) {
            return Promise.resolve(_base64Images)
        }

        return new Promise((resolve, reject) => {
            browser.executeAsync(
                function(selector, getUrlString, done) {
                    const getUrl = eval(`(${getUrlString})`)
                    const toDataUrl = async url => {
                        const response = await fetch(url)
                        const blob = await response.blob()
                        return new Promise((resolve, reject) => {
                            try {
                                const reader = new FileReader()
                                reader.onload = function() {
                                    resolve(this.result)
                                }
                                reader.readAsDataURL(blob)
                            }
                            catch (error) {
                                reject(error)
                            }
                        })
                    }

                    const elems = document.querySelectorAll(selector)
                    Promise.all([...elems].map(elem => toDataUrl(getUrl(elem))))
                        .then(dataUrls => done(dataUrls))
                        .catch(error => done([error.constructor, error.message]))
                },
                [imagesSelector, getUrl.toString()],
                ({value}) => {
                    // console.log('value', value)
                    // resolve(value.length === 24)
                    if (Array.isArray(value) && value.length === 24) {
                        // console.log('resolve')
                        this._base64Images = value
                        resolve(value)
                    }
                    else {
                        // console.log('reject', Array.isArray(value))
                        reject(value)
                    }
                },
            )
        })
    }

    _startServer() {
        return new Promise((resolve, reject) => {
            const app = express()
            // app.use(bodyParser.json())
            app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))

            const server = app.listen(() => {
                console.log(`started server`)
                resolve({app, server})
            })
            // this.server = server
        })
    }

    _showAndLabelImages(app, base64Images) {
        return new Promise((resolve, reject) => {
            app.get('/show', (request, response) => {
                response.send(`<html>
                <head></head>
                <body><form action='/save' method='post'>
                    <table>${base64Images.map((img, idx) => `
                        <tr>
                            <td>
                                <!--
                                <input type='hidden' name='b${idx}' value='${img}' />
                                -->
                                <img src='${img}' style='max-width: 500px' />
                            </td>
                            <td style='vertical-align: bottom'>
                                <input type='number' name='${idx}' min='1' max='24' step='1' />
                            </td>
                        </tr>
                    `).join('')}</table>
                    <button type='submit'>OK</button>
                </form></body>
                </html>`)
            })

            app.post('/save', (request, response) => {
                try {
                    const data = request.body
                    // console.log(data)
                    response.send('true')
                    resolve(data)
                }
                catch (error) {
                    response.send('false')
                    reject(error)
                }
            })
        })

    }

    _stopServer(server) {
        return new Promise((resolve, reject) => {
            server.close(error => {
                if (error) {
                    console.error(error)
                    reject(error)
                }
                else {
                    console.log('stopped server')
                    resolve()
                }
            })
        })
    }
}


module.exports = {
    ImageStrategy,
}
