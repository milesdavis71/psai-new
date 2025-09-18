/**
 * Handlebars eq helper Paninihez.
 * - Blokkszint:  {{#eq a b}} ... {{else}} ... {{/eq}}
 * - Inline:      {{#if (eq a b)}} ... {{/if}}
 */
module.exports = function eq(a, b, options) {
    const isBlock = options && typeof options.fn === 'function'
    const same = a === b || `${a}` === `${b}` // "42" == 42 tolerancia

    if (isBlock) return same ? options.fn(this) : options.inverse(this)
    return same // inline eset
}
