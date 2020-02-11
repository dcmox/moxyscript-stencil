"use strict";
exports.__esModule = true;
exports.template = "\n<html>\n    <head>\n        <title>stencil-js template engine demo</title>\n        {{> styleSheet}}\n    </head>\n    <body>\n        <main>\n            {{> header}}\n            {{> article}}\n        </main>\n    </body>\n</html>\n";
exports.styleSheet = "\n<style>\nbody{\n    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n    margin: 0;\n}\nbody a {\n    text-decoration: none;\n    color: #888;\n}\nbody a:hover {\n    text-decoration: underline;\n}\n#logo {\n    font-size: 32px;\n}\n#logo span{\n    color: #aaa;\n}\nheader nav ul, header nav li{\n    list-style: none;\n    display: inline;\n    margin: 0;\n    padding-left: 0;\n}\nheader nav {\n    margin: 10px 0 20px 0;\n}\nheader nav li{\n    color: #888;\n    border: 1px solid #eee;\n    border-radius: 3px;\n    padding: 4px 8px;\n}\nmain {\n    padding: 10px;\n    width: 1000px;\n    margin: 0 auto;\n    background-color: #fafafa;\n    height: 100%;\n}\narticle {\n    border-top: 1px dashed #ddd;\n}\n</style>\n";
exports.header = "\n<header>\n    <div id=\"logo\">\n        Stencil-JS <span>templating engine</span>\n    </div>\n    {{> nav}}\n</header>\n";
exports.nav = "\n<nav>\n    <ul>\n        <li><a href=\"#\">Nav</a></li>\n        <li><a href=\"#\">Links</a></li>\n        <li><a href=\"#\">Go</a></li>\n        <li><a href=\"#\">Here</a></li>\n    </ul>\n</nav>\n";
exports.article = "\n<article>\n    <p>\n        Welcome to Stencil JS! My name is {{firstName}} {{lastName|ucwords}}. If you discover any bugs, \n        please feel free to report them to {{email}} or via the Stencil-JS GitHub page: \n        {{gitHubPage|linkify}}\n    </p>\n    <p>\n        If you find this script useful, please make sure to like the project and share it with \n        other developers who may find it interesting as well!\n    </p>\n    <p>\n        This demo was created to show off the capabilities of the template engine. If you have any\n        feature requests or would like to contribute, feel free to share!\n    </p>\n</article>\n";
exports.view = {
    gitHubPage: 'https://github.com/dcmox/stencil-js',
    firstName: 'Daniel',
    lastName: 'moxon',
    email: 'dancmox@comcast.net'
};
