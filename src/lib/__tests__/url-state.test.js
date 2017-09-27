/* eslint-env jest */
import 'url-search-params-polyfill'
import {
  getQueryStringObject,
  parseQueryString,
  addNewParam
} from '../url-state'

describe('returns an object of query parameters/values', () => {
  it('returns an empty object when page has no search params', () => {
    const result = getQueryStringObject('')
    const expected = ({})

    expect(result).toEqual(expected)
  })

  it('does not add to object if key is a blank string or value is undefined', () => {
    const result1 = getQueryStringObject('a=3&b=4&=2')
    const result2 = getQueryStringObject('a=3&b=4&c')

    const expected = { a: '3', b: '4' }
    expect(result1).toEqual(expected)
    expect(result2).toEqual(expected)
  })
})

describe('parses query string and returns the requested param', () => {
  it('returns a string value when a requested param is present', () => {
    const result = parseQueryString('a', 'a=2&b=4&c=6')
    expect(result).toEqual('2')
  })

  it('returns null if empty string or param does not exist', () => {
    const result1 = parseQueryString('', 'a=2&b=4&c=6')
    const result2 = parseQueryString('d', 'a=2&b=4&c=6')

    expect(result1).toEqual(null)
    expect(result2).toEqual(null)
  })
})

describe('adds params to query string', () => {
  it('merges object to existing query string', () => {
    const result = addNewParam({a: 2, b: 4, c: 3}, 'a=3&b=5')
    const expected = '?a=2&b=4&c=3'

    expect(result).toEqual(expected)
  })
  it('deletes key from query string if no value', () => {
    const result = addNewParam({a: 2, b: 4, c: null}, 'a=3&b=5')
    const expected = '?a=2&b=4'

    expect(result).toEqual(expected)
  })
})
