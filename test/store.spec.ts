import { strictEqual } from 'assert'

import { selectLastVersion } from '../src/store'

describe('store', () => {

  it('selectLastVersion()', async () => { // tslint:disable-line
    const rowMock = {}
    const dbMock = {
      query: (sql) => {
        strictEqual(sql, 'SELECT * FROM upv_versions WHERE platform = $1' +
          ' ORDER BY version[1] DESC, version[2] DESC, version[3] DESC' +
          ' LIMIT 1;')
        return Promise.resolve({ rowCount: 1, rows: [rowMock] })
      }
    }
    const result = await selectLastVersion(dbMock as any, 3, 1)

    strictEqual(result, rowMock)
  })

})
