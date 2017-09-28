/* eslint-env jest */
import {
  getTilesForBbox,
  getTilesForBufferedBbox,
  getTileUrlSuffix,
  parseSegmentId
} from '../tiles'

it('returns a set of Valhalla tiles given a bounding box', () => {
  // Switzerland
  const result = getTilesForBbox(7.946610, 46.489815, 9.996990, 47.589906)
  const expected = [[2, 785551], [2, 786991], [2, 788431], [2, 789871], [2, 791311], [2, 792751], [2, 785552], [2, 786992], [2, 788432], [2, 789872], [2, 791312], [2, 792752], [2, 785553], [2, 786993], [2, 788433], [2, 789873], [2, 791313], [2, 792753], [2, 785554], [2, 786994], [2, 788434], [2, 789874], [2, 791314], [2, 792754], [2, 785555], [2, 786995], [2, 788435], [2, 789875], [2, 791315], [2, 792755], [2, 785556], [2, 786996], [2, 788436], [2, 789876], [2, 791316], [2, 792756], [2, 785557], [2, 786997], [2, 788437], [2, 789877], [2, 791317], [2, 792757], [2, 785558], [2, 786998], [2, 788438], [2, 789878], [2, 791318], [2, 792758], [2, 785559], [2, 786999], [2, 788439], [2, 789879], [2, 791319], [2, 792759], [1, 49147], [1, 49507], [1, 49148], [1, 49508], [1, 49149], [1, 49509], [0, 3106], [0, 3107]]

  expect(result).toEqual(expected)
})

it('returns a set of Valhalla tiles given a bounding box that crosses the antimeridian', () => {
  // Fiji
  const result = getTilesForBbox(177.345441, -18.185201, -179.723954, -16.116797)
  const expected = [[2, 414709], [2, 416149], [2, 417589], [2, 419029], [2, 420469], [2, 421909], [2, 423349], [2, 424789], [2, 426229], [2, 414710], [2, 416150], [2, 417590], [2, 419030], [2, 420470], [2, 421910], [2, 423350], [2, 424790], [2, 426230], [2, 414711], [2, 416151], [2, 417591], [2, 419031], [2, 420471], [2, 421911], [2, 423351], [2, 424791], [2, 426231], [2, 414712], [2, 416152], [2, 417592], [2, 419032], [2, 420472], [2, 421912], [2, 423352], [2, 424792], [2, 426232], [2, 414713], [2, 416153], [2, 417593], [2, 419033], [2, 420473], [2, 421913], [2, 423353], [2, 424793], [2, 426233], [2, 414714], [2, 416154], [2, 417594], [2, 419034], [2, 420474], [2, 421914], [2, 423354], [2, 424794], [2, 426234], [2, 414715], [2, 416155], [2, 417595], [2, 419035], [2, 420475], [2, 421915], [2, 423355], [2, 424795], [2, 426235], [2, 414716], [2, 416156], [2, 417596], [2, 419036], [2, 420476], [2, 421916], [2, 423356], [2, 424796], [2, 426236], [2, 414717], [2, 416157], [2, 417597], [2, 419037], [2, 420477], [2, 421917], [2, 423357], [2, 424797], [2, 426237], [2, 414718], [2, 416158], [2, 417598], [2, 419038], [2, 420478], [2, 421918], [2, 423358], [2, 424798], [2, 426238], [2, 414719], [2, 416159], [2, 417599], [2, 419039], [2, 420479], [2, 421919], [2, 423359], [2, 424799], [2, 426239], [2, 414720], [2, 416160], [2, 417600], [2, 419040], [2, 420480], [2, 421920], [2, 423360], [2, 424800], [2, 426240], [1, 25917], [1, 26277], [1, 26637], [1, 25918], [1, 26278], [1, 26638], [1, 25919], [1, 26279], [1, 26639], [1, 25920], [1, 26280], [1, 26640], [0, 1619], [0, 1709], [0, 1620], [0, 1710], [2, 413280], [2, 414720], [2, 416160], [2, 417600], [2, 419040], [2, 420480], [2, 421920], [2, 423360], [2, 424800], [2, 413281], [2, 414721], [2, 416161], [2, 417601], [2, 419041], [2, 420481], [2, 421921], [2, 423361], [2, 424801], [1, 25560], [1, 25920], [1, 26280], [0, 1530], [0, 1620]]

  expect(result).toEqual(expected)
})

it('returns a set of Valhalla tiles given a bounding box, with a buffer', () => {
  // Switzerland
  const result = getTilesForBufferedBbox(7.946610, 46.489815, 9.996990, 47.589906)
  const expected = [[2, 785551], [2, 786991], [2, 788431], [2, 789871], [2, 791311], [2, 792751], [2, 785552], [2, 786992], [2, 788432], [2, 789872], [2, 791312], [2, 792752], [2, 785553], [2, 786993], [2, 788433], [2, 789873], [2, 791313], [2, 792753], [2, 785554], [2, 786994], [2, 788434], [2, 789874], [2, 791314], [2, 792754], [2, 785555], [2, 786995], [2, 788435], [2, 789875], [2, 791315], [2, 792755], [2, 785556], [2, 786996], [2, 788436], [2, 789876], [2, 791316], [2, 792756], [2, 785557], [2, 786997], [2, 788437], [2, 789877], [2, 791317], [2, 792757], [2, 785558], [2, 786998], [2, 788438], [2, 789878], [2, 791318], [2, 792758], [2, 785559], [2, 786999], [2, 788439], [2, 789879], [2, 791319], [2, 792759], [2, 785560], [2, 787000], [2, 788440], [2, 789880], [2, 791320], [2, 792760], [1, 49147], [1, 49507], [1, 49148], [1, 49508], [1, 49149], [1, 49509], [1, 49150], [1, 49510], [0, 3106], [0, 3107]]

  expect(result).toEqual(expected)
})

describe('getTileUrlSuffix', () => {
  it('creates a directory/file path from a tile level and id', () => {
    const result1 = getTileUrlSuffix(2, 1036752)
    const result2 = getTileUrlSuffix(2, 42)
    const result3 = getTileUrlSuffix(1, 54)
    const result4 = getTileUrlSuffix(1, 64001)
    const result5 = getTileUrlSuffix(0, 79)
    const result6 = getTileUrlSuffix(0, 4001)

    expect(result1).toEqual('2/001/036/752')
    expect(result2).toEqual('2/000/000/042')
    expect(result3).toEqual('1/000/054')
    expect(result4).toEqual('1/064/001')
    expect(result5).toEqual('0/000/079')
    expect(result6).toEqual('0/004/001')
  })

  it('creates a directory/file path from a tile level and id tuple', () => {
    const result1 = getTileUrlSuffix([2, 1036752])
    const result2 = getTileUrlSuffix([2, 42])
    const result3 = getTileUrlSuffix([1, 54])
    const result4 = getTileUrlSuffix([1, 64001])
    const result5 = getTileUrlSuffix([0, 79])
    const result6 = getTileUrlSuffix([0, 4001])

    expect(result1).toEqual('2/001/036/752')
    expect(result2).toEqual('2/000/000/042')
    expect(result3).toEqual('1/000/054')
    expect(result4).toEqual('1/064/001')
    expect(result5).toEqual('0/000/079')
    expect(result6).toEqual('0/004/001')
  })

  it('creates a directory/file path from a tile level and id objects', () => {
    const result1 = getTileUrlSuffix({ level: 2, tile: 1036752 })
    const result2 = getTileUrlSuffix({ level: 2, tile: 42 })
    const result3 = getTileUrlSuffix({ level: 1, tile: 54 })
    const result4 = getTileUrlSuffix({ level: 1, tile: 64001 })
    const result5 = getTileUrlSuffix({ level: 0, tile: 79 })
    const result6 = getTileUrlSuffix({ level: 0, tile: 4001 })

    expect(result1).toEqual('2/001/036/752')
    expect(result2).toEqual('2/000/000/042')
    expect(result3).toEqual('1/000/054')
    expect(result4).toEqual('1/064/001')
    expect(result5).toEqual('0/000/079')
    expect(result6).toEqual('0/004/001')
  })

  it('works with Array.map', () => {
    const suffixes = [
      { level: 2, tile: 1036752 },
      { level: 2, tile: 42 },
      { level: 1, tile: 54 },
      { level: 1, tile: 64001 },
      { level: 0, tile: 79 },
      { level: 0, tile: 4001 }
    ]
    const expected = [
      '2/001/036/752',
      '2/000/000/042',
      '1/000/054',
      '1/064/001',
      '0/000/079',
      '0/004/001'
    ]

    const results = suffixes.map(getTileUrlSuffix)
    expect(results).toEqual(expected)
  })
})

it('parses a segment id from trace_attributes', () => {
  const id = 983044211424
  const result = parseSegmentId(id)

  expect(result.id).toEqual(id)
  expect(result.level).toEqual(0)
  expect(result.tileIdx).toEqual(2140)
  expect(result.segmentIdx).toEqual(29297)
})
