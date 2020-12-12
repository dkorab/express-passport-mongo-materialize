// From Andy E, thanks! https://stackoverflow.com/questions/1397329/how-to-remove-the-hash-from-window-location-url-with-javascript-without-page-r/5298684#5298684

function removeHash (hash = '') {
    if (window.location.hash && hash !== '' && window.location.hash !== hash) {
        return;
    }

    let scrollV, scrollH, loc = window.location;
    if ("pushState" in history)
        history.replaceState("", document.title, loc.pathname + loc.search); // or pushState
    else {
        // Prevent scrolling by storing the page's current scroll offset
        scrollV = document.body.scrollTop;
        scrollH = document.body.scrollLeft;

        loc.hash = "";

        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scrollV;
        document.body.scrollLeft = scrollH;
    }
}

removeHash('#_=_');