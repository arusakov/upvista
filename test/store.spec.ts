import { equal } from 'assert'

import { selectLastVersion } from '../src/store'

describe('store', () => {

  it('selectLastVersion()', async () => { // tslint:disable-line
    const rowMock = {}
    const dbMock = {
      query: (sql) => {
        equal(sql, 'SELECT * FROM versions' +
          ' ORDER BY version[1] DESC, version[2] DESC, version[3] DESC' +
          ' LIMIT 1;')
        return Promise.resolve({ rowCount: 1, rows: [rowMock] })
      }
    }
    const result = await selectLastVersion(dbMock as any, 3)

    equal(result, rowMock)
  })

})
