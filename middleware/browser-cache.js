/**
 *
 * @param {int} maxAge - maxAge header time
 * @param {string} filePattern - pattern for cached files by browser
 * @returns {function(*, *, *): void}
 */
module.exports = (filePattern, maxAge) => {
    return (req, res, next) => {
        if (req.url.indexOf(filePattern) === 0) {
            res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
        }

        // go to next
        next();
    }
}
