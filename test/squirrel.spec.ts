import { deepStrictEqual } from 'assert'

import { getSquirrelResponse } from '../src/squirrel'

describe('squirrel', () => {
  const url = 'http://test.com'
  const date = new Date()

  it('getSquirrelResponse()', () => {
    const response = getSquirrelResponse(url, 'name', 'notes', date)

    deepStrictEqual(response, {
      url,
      name: 'name',
      notes: 'notes',
      pub_date: date.toISOString(),
    })
  })

  it('getSquirrelResponse() only url', () => {
    const response = getSquirrelResponse(url)

    deepStrictEqual(response, {
      url,
      name: undefined,
      notes: undefined,
      pub_date: undefined,
    })
  })

})
