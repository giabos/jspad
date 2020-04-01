import {debounce} from "https://unpkg.com/throttle-debounce@2.1.0/dist/index.esm.js";
import unjsx from './jsx.js';


const setTitle = (str) => document.title = 'JSPad - ' + str;

//const storeUrl = 'https://kvdb.io/MNUDuMSNBp9ab5f9mbQKTT/';
const storeUrl = 'https://jspad.azurewebsites.net/'; // azure storage.


//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
const newStoreKey = () => Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);


// preview result of current jscode in iframe (right side).
function preview (cm) {
    const code = unjsx(cm.getValue());
    //console.log(code);
    //const code = cm.getValue();
    const html = `<!doctype html><html><body><div id="root"></div><script type="module">${code}</${'script'}><custom-root></custom-root></body></html>`;
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


// return id from URL. id used to retrieve/store the jscode from/to keyvalue cloud storage.
const currentId = () => location.hash && location.hash.substr(1);

if (currentId()) {
    // if id present in url fetch the code from keyvalue storage.
    fetch(storeUrl + currentId()).then(a => a.text()).then(text => editor.setValue(text));
} else {
    showAbout();
}

// handle code snippets sent by the "about.html" page in iframe.
window.onmessage = function (e) {
    const code = e.data;
    editor.setValue(code);
};

function save() {
    editor.save();
    const code = document.getElementById("editor").value;
    let id = currentId();
    if (!id) {
        //id = newStoreKey();
        fetch(storeUrl, { method: 'POST', body: code }).then(a => a.json()).then(resp => {
            setTitle('saved');
            window.history.pushState('page2', "saved", '#' + resp.id);
        });    
    } else {
        fetch(storeUrl + id, { method: 'PUT', body: code }).then(() => setTitle('saved'));
    }
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
