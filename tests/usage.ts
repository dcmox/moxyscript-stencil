import { Stencil } from '../stencil'
import { template, article, header, nav, view, styleSheet } from './templates'

const subTemplates = {
    styleSheet,
    article,
    header,
    nav
}

const options = {}

console.time('Render time')
const rendered = Stencil.render(template, view, subTemplates)
console.timeEnd('Render time')
console.log(rendered)