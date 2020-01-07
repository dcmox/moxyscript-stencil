const assert = require('assert')
import * as testSuite from '../stencil'

describe('stencil test suite', () => {
    it('should render nodes with the same name correctly', () => {
        let actual = testSuite.Stencil.render("{{#test}}{{#test}}{{test}}{{/test}}{{/test}}", {test: {
            test: {
                test: 'Hello World'
            }
        }})
        let expected = `Hello World`
        assert.equal(actual, expected)

        actual = testSuite.Stencil.render("{{#test}}{{#test}}{{test.test}}{{/test}}{{/test}}", {test: {
            test: {
                test: { 
                    test: 'Hello World'
                }
            }
        }})
        assert.equal(actual, expected)

        actual = testSuite.Stencil.render("{{#test}}Test {{#test}}{{test.test}}{{/test}}{{/test}}", {test: {
            test: {
                test: { 
                    test: 'Hello World'
                }
            }
        }})
        expected = `Test Hello World`
        assert.equal(actual, expected)

        actual = testSuite.Stencil.render("{{#test}}Test {{#test}}{{test.test}}{{/test}}{{/test}}{{#rest}}{{best}}{{/rest}}", {
            test: {
                test: {
                    test: { 
                        test: 'Hello World'
                    }
                },
            }, 
            rest: {
                best: ' - Best'
            }
        })
        expected = `Test Hello World - Best`
        assert.equal(actual, expected)
    })
    it('should render a simple template', () => {
        const actual = testSuite.Stencil.render("My name is {{firstName}} {{lastName}}!", {firstName: 'John', lastName: 'Doe'})
        const expected = `My name is John Doe!`
        assert.equal(actual, expected)
    })
    it('should render a view function', () => {
        const view = {
            firstName: 'John', 
            lastName: 'Doe',
            fullName: function() { return `${this.firstName} ${this.lastName}` }
        }
        const actual = testSuite.Stencil.render("My name is {{fullName}}!", view)
        const expected = `My name is John Doe!`
        assert.equal(actual, expected)
    })
    it('should render a sub template within a variable', () => {
        const view = {
            logoText: `Logo`,
        }
        const templates = {
            header: '<header>{{> logo}}</header>',
            logo: '<span>{{logoText}}</span>',
            nav: '<nav>{{> links}}</nav>',
            links: '<ul><li>Link</li></ul>'
        }
        const template = `{{> header}}{{> nav}}`
        const actual = testSuite.Stencil.render(template, view, templates)
        const expected = `<header><span>Logo</span></header><nav><ul><li>Link</li></ul></nav>`
        assert.equal(actual, expected)
    })
    it('should render the filters correctly', () => {
        let actual = testSuite.Stencil.render(`{{name|ucwords}}`, {name: `john doe`})
        let expected = `John Doe`
        assert.equal(actual, expected)

        actual = testSuite.Stencil.render(`{{name|upper}}`, {name: `john doe`})
        expected = `JOHN DOE`
        assert.equal(actual, expected)

        actual = testSuite.Stencil.render(`{{name|lower}}`, {name: `John Doe`})
        expected = `john doe`
        assert.equal(actual, expected)

        actual = testSuite.Stencil.render(`{{link|linkify}}`, {link: `http://www.google.com`})
        expected = `<a href="http://www.google.com" title="http://www.google.com">http://www.google.com</a>`
        assert.equal(actual, expected)

        actual = testSuite.Stencil.render(`{{text|excerpt}}`, {text: `This is a story about a developer who coded for over 20 years. 
And despite the career, he worked under his peers, whom only had just a few years. 
No matter the work, no matter the time, this developer just couldn't get another dime. 
Was it his past, was it his pride, or was it the fact that he never lied?`})
        expected = `This is a story about a developer who coded for over 20 years. 
And despite the career, he worked under his peers, whom only had just a few years. 
No matter the work, no matter the time, this developer just couldn&#039;t get another dime. 
Was it his past,...`
        assert.equal(actual, expected)

        actual = testSuite.Stencil.render(`{{text|stripTags}}`, {text: `<a href=""></a><div><span><b>Tags are stripped</b></span></div>`})
        expected = `Tags are stripped`
        assert.equal(actual, expected)
    })
    it('should convert new lines into break tags', () => {
        let actual = testSuite.Stencil.render(`Test\nTest`, {}, undefined, {newLineToBr: true})
        let expected = `Test<br />\nTest`
        assert.equal(actual, expected)
    })
    it('should allow me to use a custom filter', () => {
        let stateAbbrev = (res: string): string => {
            if (res === 'United States of America') {
                return 'USA'
            }
            return ''
        }
        let actual = testSuite.Stencil.render(`{{state|stateAbbrev}}`, {state: 'United States of America'}, undefined, {filters: {stateAbbrev}})
        let expected = 'USA'
        assert.equal(actual, expected)
    })
})
