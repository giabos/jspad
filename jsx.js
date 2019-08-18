// cfr https://github.com/RubyLouvre/jsx-parser
//import jsxparser from 'https://unpkg.com/jsx-parser@1.0.8/index.js';
import jsxparser from './jsx-parser.js'; // url above not working with jest/esm, do downloaded library locally (cfr https://github.com/kenotron/esm-jest) only v3.1.0 of esm works!

function isCapitalized(str) {
    const char = str[0]; 
    return char.toUpperCase() == char;
}


function propsToStr (props) {
    return Object.keys(props).map(k => {
        const node = props[k];
        switch (typeof node) {
            case "string": return `${k}: "${node}"`;
            case "object":
                switch (node.type) {
                    case "#text": return `${k}: "${node.nodeValue}"`;
                    case "#jsx": return `${k}: ${node.nodeValue}`;
                }
                break;
        }
    }).join(', ');
}

const quotable = (s) => isCapitalized(s) ? s : `"${s}"`

function toStr(node, factory) {
    switch(node.type) {
        case "#text": return `"${node.nodeValue}"`
        case "#jsx":  return typeof node.nodeValue === 'string' ? node.nodeValue : "Not implemented!!";
        default: return `${factory}(${quotable(node.type)}, {${propsToStr(node.props)}}, [${node.children.map(c => toStr(c, factory)).join(", ")}])`;
    }
}


const unjsx = (str) => {
    const match = /\/\*\*\s*@jsx\s+([\w\.]+)\s*\*\//.exec(str);
    if (match) {
        const factoryFunctionName = match[1];
        return str.replace(/<([a-z\d]+)\b[^>]*>[^;]+<\/\1>/g, (s) => {
            console.log(s);
            const parsedTree = jsxparser(s);
            return toStr(parsedTree, factoryFunctionName);
        });

    } else {
        return str;
    }
};


export default unjsx;


/*

    Alternative: https://medium.com/the-guild/implementing-a-runtime-version-of-jsx-78e004bf432e



    Other alternative: using babel-standalone parser.

        <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js"></script>

        const babelify = (str) => Babel.transform(str, { presets: ['es2015', 'react'] }).code;
        const unjsx = (str) =>  str.replace(/<([a-z\d]+)\b[^>]*>[^;]+<\/\1>/g, (a) => babelify(a).replace('"use strict";', "").replace(/;$/, ""));


*/