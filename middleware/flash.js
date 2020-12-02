/**
 * Class to handle flash messages.
 *
 * @module flash
 * @class
 */
class Flash {
    /**
     * Create a flash.
     *
     * @constructor
     * @param {object} session - the session object from request.
     */
    constructor(session) {
        // Store reference to session
        this.session = session;

        // Read old flash
        this.msgs = this.session.flash || {};
    }

    /**
     * Get value stored in last flash
     *
     * @param {string} name - flash name
     * @returns {*[]} - array of values stored in flash
     */
    get(name) {
        const msg = this.msgs[name] || [];
        delete this.msgs[name];
        return msg;
    }

    /**
     * Save new flash message
     *
     * @param {string} name - name for new flash value
     * @param {*} value - flash value
     */
    add(name, value) {
        // add new value
        if (!this.msgs.hasOwnProperty(name)) {
            this.msgs[name] = [value];
        } else {
            this.msgs[name].push(value);
        }

        this.session.flash = this.msgs;
    }

    /**
     * Clean flash data
     */
    clean() {
        this.session.flash = {};
    }
}

/**
 * Export module as middleware
 *
 * @param req
 * @param res
 * @param next
 * @throws Error - if no session
 */
module.exports = (req, res, next) => {
    if (req.session === undefined) throw Error('req.flash() requires sessions');

    const flash = new Flash(req.session);

    /**
     *
     * @param {string|null} name - flash name
     * @param {*|null} value - [optional] flash value for add action
     * @returns {*[]} - if no value in arguments: array of values stored in flash
     */
    req.flash = (name = null, value = null) => {
        // clean
        if(name === null) {
            flash.clean();
        // get
        } else if(value === null) {
            return flash.get(name);
        // add
        } else {
            flash.add(name, value);
        }
    }

    // go to next
    next();
}
