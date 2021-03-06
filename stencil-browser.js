(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.REGEX_SECTIONS = /\{{2}(#|\^)([^}]+)\}{2}((.|\n)*?)\{{2}\/\2\}{2}(\n)?/gm;
exports.REGEX_TEMPLATES = /\{{2}>([^}]+)\}{2}/g;
exports.REGEX_TAGS = /\{{2}([^}]+)\}{2,3}/gm;
exports.REGEX_HTML_CHARS = /[&<>"']/g;
exports.REGEX_LINK = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/gm;
exports.REGEX_VARS = /{|\$|}/gm;
exports.REGEX_HTML_TAGS = /<((\/|[a-zA-Z0-9="]){1})([^<>]*)>/gm;
exports.REGEX_UNICODE = /\\u[\dA-F]{4}/gi;
exports.HTML_CHAR_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#039;',
    '`': '&#x60;'
};
exports.IGNORE_HTML_FILTERS = ['raw', 'linkify'];
exports.render = function (template, view, subTemplates) {
    return exports.compileBlocks(template, view, subTemplates)
        .split('\n')
        .map(function (line) { return exports._compileTags(line, view); })
        .join('\n');
};
exports._compileBlock = function (section, view, comparator) {
    var mVar = section[2], inner = section[3];
    var observe = comparator ? comparator : view[mVar];
    var innerResult = '';
    if (~inner.indexOf('{{.}}')) { // All items in array
        if (Array.isArray(observe)) {
            observe.forEach(function (item) { return innerResult += inner.replace('{{.}}', item).trim() + '\n'; });
        }
        else if (typeof observe === 'object') { // Section within a section
            innerResult = exports.compileBlocks(inner, Object.assign({}, view, observe));
        }
    }
    else { // Check if we have variables that are part of the section
        if (typeof observe[0] === "object") {
            observe.forEach(function (item) {
                return innerResult += exports._compileTags(inner, Object.assign({}, view, item)).trim() + '\n';
            });
        }
        else if (!Array.isArray(observe)) {
            innerResult += exports._compileTags(inner, Object.assign({}, view, observe)).trim() + '\n';
        }
    }
    return innerResult;
};
exports.compileBlocks = function (template, view, subTemplates) {
    var nTemplate = template, section;
    if (subTemplates) {
        while ((section = new RegExp(exports.REGEX_TEMPLATES).exec(nTemplate)) !== null) {
            var match = section[0], mVar = section[1];
            mVar = mVar.trim();
            nTemplate = subTemplates[mVar] ? nTemplate.replace(match, subTemplates[mVar]) : nTemplate.replace(match, '');
        }
    }
    while ((section = new RegExp(exports.REGEX_SECTIONS).exec(nTemplate)) !== null) {
        var match = section[0], operator = section[1], mVar = section[2];
        if (~mVar.indexOf('.')) {
            var node = exports.accessNode(mVar, view);
            nTemplate = node ? nTemplate.replace(match, exports._compileBlock(section, view, node))
                : nTemplate.replace(match, '');
        }
        else if ((operator === '#' && view[mVar]) || (operator === '^' && !view[mVar])) {
            nTemplate = nTemplate.replace(match, exports._compileBlock(section, view));
        }
        else {
            nTemplate = nTemplate.replace(match, '');
        }
    }
    return nTemplate;
};
exports.accessNode = function (mVar, view) {
    var nodes = mVar.split('.');
    var vLevel = '';
    vLevel = view[nodes[0]];
    if (vLevel === undefined) {
        return '';
    }
    for (var i = 1; i < nodes.length; i++) {
        vLevel = vLevel[nodes[i]];
        if (typeof vLevel !== "object") {
            break;
        }
    }
    return vLevel;
};
exports._compileTags = function (line, view) {
    var tags = line.match(exports.REGEX_TAGS);
    if (!tags) {
        return line;
    }
    tags.forEach(function (match) {
        var _a;
        var tag = match.replace(exports.REGEX_VARS, '');
        var data, filter = '';
        if (~tag.indexOf('|')) {
            _a = tag.split('|'), tag = _a[0], filter = _a[1];
        }
        if (filter) {
            if (~tag.indexOf('.')) {
                var node = exports.accessNode(tag, view);
                data = node ? exports.filterVar(node, filter) : '';
            }
            else {
                data = view[tag] ? exports.filterVar(view[tag], filter) : '';
            }
        }
        else {
            if (~tag.indexOf('.')) {
                var node = exports.accessNode(tag, view);
                data = node ? node : '';
            }
            else {
                if (match.startsWith('{{{') && match.endsWith('}}}')) {
                    data = typeof view[tag] === 'function' ? view[tag]() : view[tag] ? view[tag] : '';
                }
                else {
                    data = typeof view[tag] === 'function' ? exports.decodeHTML(view[tag]()) : view[tag] ? exports.decodeHTML(view[tag]) : '';
                }
            }
        }
        line = line.replace(match, data);
    });
    return line;
};
exports.decodeHTML = function (html) {
    return html.toString().replace(exports.REGEX_HTML_CHARS, function (m) { return exports.HTML_CHAR_MAP[m]; });
};
exports.defaultFilterMap = {
    lower: function (res) { return res.toLowerCase(); },
    upper: function (res) { return res.toUpperCase(); },
    linkify: function (res) { return res.replace(exports.REGEX_LINK, function (m) { return "<a href=\"" + m + "\" title=\"" + m + "\">" + m + "</a>"; }); },
    ucwords: function (res) { return ~res.indexOf(' ')
        ? res.split(' ').map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1); }).join(' ')
        : res.charAt(0).toUpperCase() + res.slice(1); },
    excerpt: function (res) { return (res.length <= 255 ? res : res.slice(0, res.substring(0, 255).lastIndexOf(' ')) + '...'); },
    stripTags: function (res) { return res.replace(exports.REGEX_HTML_TAGS, ''); }
};
var filterMap = Object.assign({}, exports.defaultFilterMap);
exports.filterVar = function (str, filter) {
    var result = filterMap[filter] ? filterMap[filter](str) : str;
    return ~exports.IGNORE_HTML_FILTERS.indexOf(filter) ? result : exports.decodeHTML(result) || result;
};
exports.Stencil = {
    render: function (template, view, subTemplates, options) {
        if (options) {
            if (options.filters) {
                filterMap = Object.assign(filterMap, options.filters);
            }
            if (options.newLineToBr) {
                return exports.render(template, view, subTemplates).replace(/\n/g, '<br />\n');
            }
        }
        return exports.render(template, view, subTemplates);
    }
};

},{}]},{},[1]);
