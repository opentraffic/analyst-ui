/* eslint-env jest */
import * as updateUrl from '../update-url'

describe('url updating', () => {
  describe('getTimeFilters()', () => {
    it('returns formatted params for both the day and hour filters if present in state', () => {
      const state = {
        dayFilter: [0, 4],
        hourFilter: [3, 8]
      }

      const result = updateUrl.getTimeFilters(state)
      expect(result.df).toEqual('0/4')
      expect(result.hf).toEqual('3/8')
    })

    it('returns formatted params for only the day filter in state', () => {
      const state = {
        dayFilter: [0, 4]
      }

      const result = updateUrl.getTimeFilters(state)
      expect(result.df).toEqual('0/4')
      expect(result.hf).toEqual(null)
    })

    it('returns formatted params for only the hour filter in state', () => {
      const state = {
        hourFilter: [3, 8]
      }

      const result = updateUrl.getTimeFilters(state)
      expect(result.hf).toEqual('3/8')
      expect(result.df).toEqual(null)
    })
  })
})
