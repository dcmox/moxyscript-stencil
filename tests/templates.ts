export const template = `
<html>
    <head>
        <title>stencil-js template engine demo</title>
        {{> styleSheet}}
    </head>
    <body>
        <main>
            {{> header}}
            {{> article}}
        </main>
    </body>
</html>
`

export const styleSheet = `
<style>
body{
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
}
body a {
    text-decoration: none;
    color: #888;
}
body a:hover {
    text-decoration: underline;
}
#logo {
    font-size: 32px;
}
#logo span{
    color: #aaa;
}
header nav ul, header nav li{
    list-style: none;
    display: inline;
    margin: 0;
    padding-left: 0;
}
header nav {
    margin: 10px 0 20px 0;
}
header nav li{
    color: #888;
    border: 1px solid #eee;
    border-radius: 3px;
    padding: 4px 8px;
}
main {
    padding: 10px;
    width: 1000px;
    margin: 0 auto;
    background-color: #fafafa;
    height: 100%;
}
article {
    border-top: 1px dashed #ddd;
}
</style>
`
export const header = `
<header>
    <div id="logo">
        Stencil-JS <span>templating engine</span>
    </div>
    {{> nav}}
</header>
`

export const nav = `
<nav>
    <ul>
        <li><a href="#">Nav</a></li>
        <li><a href="#">Links</a></li>
        <li><a href="#">Go</a></li>
        <li><a href="#">Here</a></li>
    </ul>
</nav>
`

export const article = `
<article>
    <p>
        Welcome to Stencil JS! My name is {{firstName}} {{lastName|ucwords}}. If you discover any bugs, 
        please feel free to report them to {{email}} or via the Stencil-JS GitHub page: 
        {{gitHubPage|linkify}}
    </p>
    <p>
        If you find this script useful, please make sure to like the project and share it with 
        other developers who may find it interesting as well!
    </p>
    <p>
        This demo was created to show off the capabilities of the template engine. If you have any
        feature requests or would like to contribute, feel free to share!
    </p>
</article>
`

export const view = {
    gitHubPage: 'https://github.com/dcmox/stencil-js',
    firstName: 'Daniel',
    lastName: 'moxon',
    email: 'dancmox@comcast.net'
}