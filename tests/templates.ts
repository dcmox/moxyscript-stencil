export const template = `
<h1>Hello world!</h1>
<p>
    Hello, my name is {{firstName}} {{lastName}}! Are you ready to build your own templating engine? I know I am!
</p>
<p>
    Some information about me:
    {{person.details.bio}}
</p>
<p>
    {{{paragraph|excerpt}}}
</p>
<p>
    This is a {{customFilter|lower}}. This is sanitized html: {{html|lower}}
    This is unfiltered html: {{html|raw}}
    This is also unfiltered html {{{html}}}
</p>
<p>
    Links:
    {{htmlLinks|linkify}}
</p>

{{#condition}}
Hello world! - This will display if condition evaluates to true!
{{/condition}}

{{#anotherCondition}}
This will not display if anotherCondition evaluates to false.
{{/anotherCondition}}

People:
<ul>
{{#people}}
    <li>{{.}}</li>
{{/people}}
</ul>

Beatles:
<ul>
{{#beatles}}
    <ul>{{name}} - {{details.bio}}</ul>
{{/beatles}}
</ul>

{{#nested}}{{#a}}{{.}}, {{/a}}{{/nested}}

{{^anotherCondition}}
This should display!
{{/anotherCondition}}
{{! This is a comment. Any tags that are not valid will just be omitted}}

{{arr}}

Nested tag:
<ul>
{{#nested.a}}
<li>{{.}}</li>
{{/nested.a}}
</ul>

Even more nested tag:
{{#nestedC.a}}{{b}}{{/nestedC.a}}

{{lotsOfHtml|stripTags}}

{{> subTemplate}}

Have a nice day!
`

export const subTemplate = `
<h1>This is a subtemplate</h1>
<p>
My name is {{name}}
{{> anotherSubTemplate}}
</p>
`

export const anotherSubTemplate = `
===Another Sub Template===
{{beans}}
{{> subSubTemplate}}
`
export const subSubTemplate = `
Hoorah!
`

export const view = {
    firstName: 'Daniel',
    lastName: 'Moxon',
    customFilter: 'CUSTOM FILTER',
    html: '<b>bold html</b>',
    htmlLinks: `http://www.google.com
    http://www.yahoo.com`,
    person: {
        name: 'Daniel Moxon',
        age: '31',
        details: {
            bio: 'I grew up in Washington State and was born on Valentine\'s day.'
        }
    },
    condition: true,
    anotherCondition: false,
    people: ['john', 'sally', 'sue'],
    beatles: [
        { "firstName": "John", "lastName": "Lennon", details: { bio: 'I am a dude.' } },
        { "firstName": "Paul", "lastName": "McCartney", details: { bio: 'I am also a dude.' } },
        { "firstName": "George", "lastName": "Harrison" },
        { "firstName": "Ringo", "lastName": "Starr" }
    ],
    nested: {a: [1, 2, 3], b: [4, 5, 6]},
    nestedB: [
        {a: [1, 2, 3]},
        {a: [4, 5, 6]},
    ],
    nestedC: {
        a: {b: 'One more time!!'}
    },
    arr: [1, 2, 3],
    "name": function () {
        return this.firstName + " " + this.lastName;
    },
    beans: 'Beans are good',
    paragraph: `This is a story about a developer who coded for over 20 years. 
And despite the career, he worked under his peers, whom only had just a few years. 
No matter the work, no matter the time, this developer just couldn't get another dime. 
Was it his past, was it his pride, or was it the fact that he never lied?`,
    lotsOfHtml: `<h1>Strip Tags</h1>
<p>
    Will strip a lot of HTML including [<p><br><i><br /><a href="http://www.test.com" alt="test">Link removed</a>] (should be empty) tags among many others.
</p>
` 
}