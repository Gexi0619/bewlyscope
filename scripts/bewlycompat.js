// BewlyCat renders its UI inside the open shadow root of #bewly, so the labeling
// in sitescripts/labelid.js can't reach its links, and mouse events moving within
// that shadow tree never reach the listener on document. Listen on the shadow root
// directly and label the hovered link on demand instead of scanning the whole tree.

function labelBewlyAnchor(anchor) {
    if (anchor.hasAttribute("biliscope-userid") || anchor.hasAttribute("biliscope-videoid")) {
        return;
    }

    if (anchor.hostname == "space.bilibili.com") {
        const userId = anchor.pathname.match(/^\/(\d+)/)?.[1];
        if (userId) {
            anchor.setAttribute("biliscope-userid", userId);
        }
    } else if (anchor.hostname == "www.bilibili.com") {
        const videoId = anchor.href.match(/BV[1-9a-zA-Z]{10}/)?.[0];
        if (videoId && anchor.querySelector("img, picture")) {
            anchor.setAttribute("biliscope-videoid", videoId);
        }
    }
}

function onBewlyMouseOver(event) {
    const anchor = event.target.closest?.("a[href]");
    if (anchor) {
        labelBewlyAnchor(anchor);
        showProfileDebounce(event, anchor);
    }
}

function hookBewlyRoot() {
    const root = document.getElementById("bewly")?.shadowRoot;
    if (root && root !== hookBewlyRoot.root) {
        hookBewlyRoot.root = root;
        root.addEventListener("mouseover", onBewlyMouseOver);
    }
}
