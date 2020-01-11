class NotImplementedError extends Error {}


const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor

// https://stackoverflow.com/a/40878674/6928824
class BaseFunction extends AsyncFunction {
    constructor() {
        super('...args', 'return await this.__self__.__call__(...args)')
        const self = this.bind(this)
        this.__self__ = self
        return self
    }

    async __call__(...args) {
        throw new NotImplementedError(
            `'__call__' needs to be implemented in '${this.constructor.name}'`
            + `(number of passed arguments: ${args.length}).`
        )
    }
}


class BaseStrategy extends BaseFunction {
    async __call__(day, browser) {
        await this.setup(browser)
        return await this.find(day, browser)
    }

    setKwargs(kwargs) {
        for (const [key, val] of Object.entries(kwargs)) {
            if (Object.hasOwnProperty(this, key)) {
                throw new Error(`Invalid kwarg. ${key} is already taken.`)
            }
            this[key] = val
        }
    }

    // Sets up any meta data necessary to correctly 'find' the wanted calendar
    // window. This method must be idempotent because it is always called
    // before 'find'.
    async setup(browser) {
        return
    }

    // This method may be asynchronous and is always awaited.
    find(day, browser) {
        throw new NotImplementedError(
            `Implement 'find' in subclass of BaseStrategy!`
        )
    }
}


module.exports = {
    BaseStrategy
}
