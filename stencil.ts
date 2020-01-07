export interface IView { [key: string]: any }
export interface ICharMap { [key: string]: string }
export interface IFilterMap { [key: string]: (res: string) => string }
export interface ISubTemplates { [key: string]: string }
export interface ICacheMap { [key: string]: string }
export interface IStencilOptions {
    newLineToBr?: boolean,
    filters?: IFilterMap
}

export const REGEX_SECTIONS = /\{{2}(#|\^)([^}]+)\}{2}((.|\n)*?)\{{2}\/\2\}{2}(\n)?/gm
export const REGEX_INNER_SECTION = /\{{2}(#|\^)([^}]+)\}{2}/gm
export const REGEX_TEMPLATES = /\{{2}>([^}]+)\}{2}/g
export const REGEX_TAGS = /\{{2}([^}]+)\}{2,3}/gm
export const REGEX_HTML_CHARS = /[&<>"']/g
export const REGEX_LINK = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/gm
export const REGEX_VARS = /{|\$|}/gm
export const REGEX_HTML_TAGS = /<((\/|[a-zA-Z0-9="]){1})([^<>]*)>/gm
export const REGEX_UNICODE = /\\u[\dA-F]{4}/gi

export const HTML_CHAR_MAP: ICharMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#039;',
    '`': '&#x60;',
}
export const IGNORE_HTML_FILTERS = [ 'raw', 'linkify' ]

export const render = (template: string, view: IView, subTemplates?: ISubTemplates): string => {
    return compileBlocks(template, view, subTemplates)
        .split('\n')
        .map((line: string) => _compileTags(line, view))
        .join('\n')
}

export const _compileBlock = (section: any, view: IView, comparator?: any): string => {
    let [ , , mVar, inner ] = section
    let observe: any = comparator ? comparator : view[mVar]
    let innerResult: string = ''
    if (~inner.indexOf('{{.}}')) { // All items in array
        if (Array.isArray(observe)) {
            observe.forEach((item: string) => innerResult += inner.replace('{{.}}', item).trim() + '\n')
        } else if (typeof observe === 'object') { // Section within a section
            innerResult = compileBlocks(inner, Object.assign({}, view, observe))
        }
    } else { // Check if we have variables that are part of the section
        if (typeof observe[0] === "object") {
            observe.forEach((item: any) =>
                innerResult += _compileTags(inner, Object.assign({}, view, item)).trim() + '\n'
            )
        } else if (!Array.isArray(observe)) {
            innerResult += _compileTags(inner, Object.assign({}, view, observe))
        }
    }
    return innerResult
}

export const compileBlocks = (template: string, view: IView, subTemplates?: ISubTemplates): string => {
    let nTemplate: string = template, section: string[] | null
    if (subTemplates) {
        while((section = new RegExp(REGEX_TEMPLATES).exec(nTemplate)) !== null) {
            let [ match, mVar ] = section
            mVar = mVar.trim()
            nTemplate = subTemplates[mVar] ? nTemplate.replace(match, subTemplates[mVar]) : nTemplate.replace(match, '')
        }
    }

    let r: RegExp = new RegExp(REGEX_SECTIONS), idx: number = 0, nView: IView = Object.assign({}, view)
    while((section = r.exec(nTemplate)) !== null) {
        let [ match, operator, mVar, inner ] = section
        if(~mVar.indexOf('.')) {
            const node = accessNode(mVar, view)
            nTemplate = node ? nTemplate.replace(match, _compileBlock(section, view, node))
                : nTemplate.replace(match, '')
        } else if ((operator === '#' && view[mVar]) || (operator === '^' && !view[mVar])) {
            if (~inner.indexOf('{{#' + mVar + '}}')) { // Handles cases where we have nested nodes with the same name
               r.lastIndex = idx + 1
               nView = Object.assign(nView, view[mVar])
            } else {
                idx = r.lastIndex
                nTemplate = nTemplate.replace(match, _compileBlock(section, nView))
                r = new RegExp(REGEX_SECTIONS) // Reset RegExp
            }
        } else {
            nTemplate = nTemplate.replace(match, '')
        }
    }
    return nTemplate
}

export const accessNode = (mVar: string, view: IView): string => {
    const nodes = mVar.split('.')
    let vLevel: any = ''
    vLevel = view[nodes[0]]
    if (vLevel === undefined) { return '' }
    for (let i = 1; i < nodes.length; i++) {
        vLevel = vLevel[nodes[i]]
        if (typeof vLevel !== "object") { break }
    }
    return vLevel
}

export const _compileTags = (line: string, view: IView): string => {
    const tags = line.match(REGEX_TAGS)
    if (!tags) { return line }
    tags.forEach((match: string) => {
        let tag: string = match.replace(REGEX_VARS, '')
        let data: string, filter: string = ''
        if (~tag.indexOf('|')) { [ tag, filter ] = tag.split('|') }
        if (filter) {
            if(~tag.indexOf('.')) {
                const node = accessNode(tag, view)
                data = node ? filterVar(node, filter) : ''
            }
            else {
                data = view[tag] ? filterVar(view[tag], filter) : ''
            }
        } else {
            if(~tag.indexOf('.')) {
                const node = accessNode(tag, view)
                data = node ? node : ''
            }
            else {
                if(match.startsWith('{{{') && match.endsWith('}}}')) {
                    data = typeof view[tag] === 'function' ? view[tag]() : view[tag] ? view[tag] : ''
                } else {
                    data = typeof view[tag] === 'function' ? decodeHTML(view[tag]()) : view[tag] ? decodeHTML(view[tag]) : ''
                }
            }
        }
        line = line.replace(match, data)
    })
    return line
}

export const decodeHTML = (html: string): string =>
    html.toString().replace(REGEX_HTML_CHARS, (m: string) => HTML_CHAR_MAP[m])

export const defaultFilterMap: IFilterMap = {
    lower: (res: string): string => res.toLowerCase(),
    upper: (res: string): string => res.toUpperCase(),
    linkify: (res: string): string => res.replace(REGEX_LINK, (m: string) => `<a href="${m}" title="${m}">${m}</a>`),
    ucwords: (res: string): string => ~res.indexOf(' ')
        ? res.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : res.charAt(0).toUpperCase() + res.slice(1),
    excerpt: (res: string): string => (res.length <= 255 ? res : res.slice(0, res.substring(0, 255).lastIndexOf(' ')) + '...'),
    stripTags: (res: string): string => res.replace(REGEX_HTML_TAGS, '')
}

let filterMap: IFilterMap = Object.assign({}, defaultFilterMap)

export const filterVar = (str: string, filter: string): string => {
    let result: string = filterMap[filter] ? filterMap[filter](str) : str
    return ~IGNORE_HTML_FILTERS.indexOf(filter) ? result : decodeHTML(result) || result
}

export const Stencil = { 
    render: (template: string, view: IView, subTemplates?: ISubTemplates,
        options?: IStencilOptions): string => {
        if (options) {
            if (options.filters) {
                filterMap = Object.assign(filterMap, options.filters)
            }
            if (options.newLineToBr) {
                return render(template, view, subTemplates).replace(/\n/g, '<br />\n')
            }
        }
        return render(template, view, subTemplates)
    }
}