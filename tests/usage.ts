import { Stencil } from '../stencil'
import { template, subTemplate, anotherSubTemplate, subSubTemplate, view } from './templates'

const subTemplates = {
    subTemplate,
    anotherSubTemplate,
    subSubTemplate
}

const options = {
    newLineToBr: true
}

console.time('Render time')
const rendered = Stencil.render(template, view, subTemplates)
console.timeEnd('Render time')
console.log(rendered)