import jsx from './jsx.js';


function test (input, expected) {
    expect(jsx(input)).toBe(expected);
}

it("should not translate without /** jsx tag", () => {
    const text = "blabla";
    test(text, text);
}); 



it("should translate simple div", () => {
    const input = ` 
        /** @jsx h */

        <div>blabla</div>
    `;
    const expected = ` 
        /** @jsx h */

        h("div", {}, ["blabla"])
    `;

    test(input, expected);
}); 


it("should translate div with props", () => {
    const input = ` 
        /** @jsx h */

        <div class="blabla" onClick={() => callthis()}>blabla</div>
    `;
    const expected = ` 
        /** @jsx h */

        h("div", {class: "blabla", onClick: () => callthis()}, ["blabla"])
    `;

    test(input, expected);
}); 


it("should translate div with children", () => {
    const input = ` 
        /** @jsx h */

        <div><h1>blabla</h1><h2>{titi}</h2></div>
    `;
    const expected = ` 
        /** @jsx h */

        h("div", {}, [h("h1", {}, ["blabla"]), h("h2", {}, [titi])])
    `;

    test(input, expected);
}); 


it("should translate div with Component as child", () => {
    const input = ` 
        /** @jsx React.createElement */

        <div><Component id="3"/></div>
    `;
    const expected = ` 
        /** @jsx React.createElement */

        React.createElement("div", {}, [React.createElement(Component, {id: "3"}, [])])
    `;

    test(input, expected);
}); 
