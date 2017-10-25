import { CLEAR_BARCHART, ADD_SEGMENTS_TO_BARCHART } from '../actions'

export function clearBarchart () {
  return {
    type: CLEAR_BARCHART
  }
}

export function setBarchartSpeeds (speedsArray, countArray) {
  let meanSpeedArray
  if (countArray) {
    meanSpeedArray = speedsArray.map((value, index, matrix) => {
      let count = countArray.get(index)
      if (count && count > 0) {
        return (value / count)
      } else {
        return 0
      }
    })
  } else {
    meanSpeedArray = speedsArray
  }
  let hoursForCrossFilter = []
  meanSpeedArray.forEach((speed, index) => {
    hoursForCrossFilter.push({
      'dayOfWeek': index[0] + 1,
      'hourOfDay': index[1] + 1,
      'meanSpeedThisHour': speed
    })
  })
  return {
    type: ADD_SEGMENTS_TO_BARCHART,
    speedsBinnedByHour: hoursForCrossFilter
  }
}

export function setBarchartPercentDiffs (diffsArray, diffCountArray) {
  let percentDiffArray
  if (diffCountArray) {
    percentDiffArray = diffsArray.map((value, index, matrix) => {
      let count = diffCountArray.get(index)
      if (count && count > 0) {
        return (value / count)
      } else {
        return 0
      }
    })
  } else {
    percentDiffArray = diffsArray
  }
  let hoursForCrossFilter = []
  percentDiffArray.forEach((percentDiff, index) => {
    hoursForCrossFilter.push({
      'dayOfWeek': index[0] + 1,
      'hourOfDay': index[1] + 1,
      'percentDiffThisHour': percentDiff
    })
  })
  return {
    type: ADD_SEGMENTS_TO_BARCHART,
    percentDiffsBinnedByHour: hoursForCrossFilter
  }
}
