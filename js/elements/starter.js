// remove blur from page when all js files are loaded
module.exports = (css) => {
    const starter = document.querySelector('.page-starter');

    if (starter) {

        // add css for page
        const head = document.getElementsByTagName('head')[0];
        const link = document.createElement('link');

        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = window.location.href.split('/').slice(0, 3).join('/') + css;

        head.appendChild(link);

        link.onload = function () {
            // remove blur
            starter.classList.add('cover-full-image');
            starter.classList.remove('page-starter');

            // remove first visible icon (necessary for loading icons faster)
            const releaseIcons = document.querySelector('.release-icons');
            if (releaseIcons) releaseIcons.remove();
        };
    }
}
