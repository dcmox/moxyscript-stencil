# stencil-js

stencil-js is a templating engine that is fast with low overhead. It is compatible with Mustache templates and includes a few core features that differ from it.

## Features
* Create or use filters on your template variables for simple string manipulation such as:
    * {{paragraph|excerpt}} - (excerpt) Trims down the paragraph to a max of 255 characters and adds ...
    * {{urls|linkify}} - (linkify) Converts URLs in plain text into clickable HTML links
    * {{name|ucwords}} - (ucwords) Uppercases the first letter of any word (delimited by a space).
    * {{key|lower}} - (lower) Converts key to lowercase.
    * {{highlight|upper}} - (upper) Converts the highlight variable to uppercase.
    * {{html|stripTags}} - (stripTags) Removes all HTML from the variable

* Automatic conversion of special characters to HTML entities to help prevent security vulnerabilities

* Fast and under 200 lines of code for the core module

* Supports partial templates using {{> partialTemplate}} syntax

* Should be fully compatible with Mustache templates. If you know Mustache, you already know 90% of stencil-js.

* Support for helpers with parameters. Great for conditional logic.

* Built from scratch with no dependencies

* We encourage contribution and suggestions to help improve the templating engine!

## Sample Usage 

### TypeScript

```typescript 
const options = {
    newLineToBr: true
}
const template = `Hello world, my name is {{name}}!`
const view = {
    firstName: 'John',
    lastName: 'Doe',
    name: function() { return `${this.firstName} ${this.lastName}` }
}
console.time('Render time')
const rendered = Stencil.render(template, view)
console.timeEnd('Render time')
console.log(rendered) // outputs Hello world, my name is John Doe!
```

```typescript 
const options = {
    newLineToBr: true
}
const template = `<a href="/home" {{{isActive home}}}>Home</a>`
const view = {
    firstName: 'John',
    lastName: 'Doe',
    path: 'home',
    isActive: function(path: string) { return path === this.path ? 'class="active"' : '' }
}
console.time('Render time')
const rendered = Stencil.render(template, view)
console.timeEnd('Render time')
console.log(rendered) // outputs class="active"
```

### HTML

```html
<script>var exports = {};</script>
<script src="stencil-browser.js"></script>
<script>
const template = `Hello world, my name is {{name}}!`
const view = {
    firstName: 'John',
    lastName: 'Doe',
    name: function() { return `${this.firstName} ${this.lastName}` }
}
document.getElementById('template').innerHTML = Stencil.render(template, view)
</script>
<div id="template"></div>
```

See [tests/usage.ts](tests/usage.ts) or [tests/stencil.test.ts](tests/stencil.test.ts) for an example on how to use stencil-js with NodeJS and Typescript.

## Available Scripts 

In the project directory, you can run:

### `npm run build`

Builds stencil.ts and tests/usage.ts into JS files for usage. usage.ts is a demo of the script being used in Typescript.

### `npm run test-usage`

Runs the sample usage.js file which should output a log in your console.

## Learn More

You can learn more about [the developer here](https://www.linkedin.com/in/daniel-moxon/).
