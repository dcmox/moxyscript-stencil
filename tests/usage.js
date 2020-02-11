"use strict";
exports.__esModule = true;
var stencil_1 = require("../stencil");
var templates_1 = require("./templates");
var subTemplates = {
    styleSheet: templates_1.styleSheet,
    article: templates_1.article,
    header: templates_1.header,
    nav: templates_1.nav
};
var options = {};
console.time('Render time');
var rendered = stencil_1.Stencil.render(templates_1.template, templates_1.view, subTemplates);
console.timeEnd('Render time');
console.log(rendered);
