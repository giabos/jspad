import {debounce} from "https://unpkg.com/throttle-debounce@2.1.0/dist/index.esm.js";

// return id from URL. id used to retrieve/store the jscode from/to keyvalue cloud storage.
const currentId = () => location.hash && location.hash.substr(1);

const setTitle = (str) => document.title = 'JSPad - ' + str;


// preview result of current jscode in iframe (right side).
function preview (cm) {
    const code = cm.getValue();
    const html = `<!doctype html><html><body><div id="root"></div><script type="module">${code}</${'script'}></body></html>`;
    const data_url = "data:text/html;charset=utf-8;base64," + btoa(html);
    document.getElementById("result").src = data_url;
    setTitle ("! unsaved !")
}

function showAbout () {
    document.getElementById("result").src = "about.html";
}

var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    lineNumbers: true,
    indentWithTabs: false,
    mode: "javascript",
    lint: {esversion: 9},
    theme: "monokai",
    gutters: ['CodeMirror-lint-markers'],
    extraKeys: {
        "Ctrl-S": save,
    },
});
editor.on('change', debounce(1000, preview));

if (currentId()) {
    // if id present in url fetch the code from keyvalue storage.
    fetch(`https://api.keyvalue.xyz/${currentId()}/v1`).then(a => a.text()).then(text => editor.setValue(text));
} else {
    showAbout();
}

window.onmessage = function (e) {
    const code = e.data;
    editor.setValue(code);
};

function save() {
    editor.save();
    const code = document.getElementById("editor").value;

    const id = currentId();
    let done = Promise.resolve(id);
    if (!id) { // if no key yet, create it
        done = fetch('https://api.keyvalue.xyz/new/v1', { method: 'POST' }).then(a => a.text()).then(url => {
            const m = /\/([^\/]+)\/v1/.exec(url);
            if (m) {
                const id = m[1];
                window.history.pushState('page2', "saved", '#' + id);
                return id;
            }
            return null;
        });
    }
    done.then(id => fetch(`https://api.keyvalue.xyz/${id}/v1`, { method: 'POST', body: code }).then(() => setTitle('saved')));
}


Split(['.CodeMirror', '#result'], {
    direction: 'horizontal',
    gutterSize: 10,
    sizes: [50, 50],
    elementStyle: (dimension, size, gutterSize) => ({
        'flex-basis': `calc(${size}% - ${gutterSize}px)`,
    }),
    gutterStyle: (dimension, gutterSize) => ({
        'flex-basis':  `${gutterSize}px`,
    }),
})