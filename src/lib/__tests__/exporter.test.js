/* eslint-env jest */
import { convertArrayOfObjectsToCsv } from '../exporter'

it('converts an array of objects to CSV', () => {
  const objects = [
    {
      one: 'hi',
      two: 'yes'
    },
    {
      one: 'there'
    }
  ]
  const result = convertArrayOfObjectsToCsv(objects)

  expect(result).toEqual('one,two\nhi,yes\nthere,\n')
})
