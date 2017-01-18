import { deepStrictEqual, strictEqual } from 'assert'

import { createValidator } from '../src/validation'

describe('validation', () => {
  const validate = createValidator(2)

  it('createValidator() with capacity=2 errors', () => {
    strictEqual(validate({}), null)
    strictEqual(validate({ platform: 'xxx' }), null, 'unknown platform')
    strictEqual(validate({ platform: 'mac' }), null, 'without version')
    strictEqual(validate({ platform: 'mac', version: '1' }), null, 'mismatch version capacity <')
    strictEqual(validate({ platform: 'mac', version: '1.2.3' }), null, 'mismatch version capacity >')
    strictEqual(validate({ platform: 'mac', version: '1.X' }), null, 'non numeric')
  })

  it('createValidator() with capacity=2', () => {
    deepStrictEqual(
      validate({
        platform: 'mac',
        version: '1.2',
      }),
      {
        platformId: 1,
        version: [1, 2],
      }
    )
  })
})
