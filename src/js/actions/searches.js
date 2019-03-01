/* @flow */
import {PER_PAGE} from "../reducers/logViewer"
import type {Thunk} from "../reducers/types"
import {addHeadProc} from "../lib/Program"
import {addNotification} from "./notifications"
import {completeMainSearch, requestMainSearch} from "./mainSearch"
import {getCountByTimeProc} from "../reducers/mainSearch"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getInnerTimeWindow, getTimeWindow} from "../reducers/timeWindow"
import {getSearchProgram} from "../selectors/searchBar"
import ErrorFactory from "../models/ErrorFactory"
import analyticsReceiver from "../receivers/analyticsReceiver"
import countByTimeReceiver from "../receivers/countByTimeReceiver"
import logsReceiver from "../receivers/logsReceiver"
import pageReceiver from "../receivers/pageReceiver"
import statsReceiver from "../receivers/statsReceiver"

export const searchSubset = (): Thunk => (dispatch, getState, boom) => {
  const state = getState()
  const program = addHeadProc(getSearchProgram(state), PER_PAGE)
  const space = getCurrentSpaceName(state)
  const timeWindow = getInnerTimeWindow(state)

  return boom
    .search(program, {
      searchSpan: timeWindow,
      searchSpace: space
    })
    .channel(0, pageReceiver(dispatch, PER_PAGE))
    .channel(0, logsReceiver(dispatch))
    .error(error => {
      dispatch(
        addNotification(
          ErrorFactory.create(error, {space, program, timeWindow})
        )
      )
    })
}
export const searchPaged = (): Thunk => (dispatch, getState, boom) => {
  const state = getState()
  const program = addHeadProc(getSearchProgram(state), PER_PAGE)
  const space = getCurrentSpaceName(state)
  const timeWindow = getTimeWindow(state)

  dispatch(requestMainSearch())
  return boom
    .search(program, {
      searchSpan: timeWindow,
      searchSpace: space
    })
    .channel(0, pageReceiver(dispatch, PER_PAGE))
    .channel(0, logsReceiver(dispatch))
    .error(error => {
      dispatch(
        addNotification(
          ErrorFactory.create(error, {space, program, timeWindow})
        )
      )
    })
}

export const searchHistogram = (): Thunk => (dispatch, getState, boom) => {
  const state = getState()
  const program = getSearchProgram(state) + "|" + getCountByTimeProc(state)
  const space = getCurrentSpaceName(state)
  const timeWindow = getTimeWindow(state)

  dispatch(requestMainSearch())
  return boom
    .search(program, {
      searchSpan: timeWindow,
      searchSpace: space
    })
    .channel(0, countByTimeReceiver(dispatch))
    .each(statsReceiver(dispatch))
    .done(() => dispatch(completeMainSearch()))
    .error(error => {
      dispatch(completeMainSearch())
      dispatch(
        addNotification(
          ErrorFactory.create(error, {space, program, timeWindow})
        )
      )
    })
}

export const searchHead = (): Thunk => (dispatch, getState, boom) => {
  const state = getState()
  const program = getSearchProgram(state)
  const space = getCurrentSpaceName(state)
  const timeWindow = getTimeWindow(state)

  dispatch(requestMainSearch())
  return boom
    .search(program, {
      searchSpan: timeWindow,
      searchSpace: space
    })
    .channel(0, logsReceiver(dispatch))
    .error(error => {
      dispatch(
        addNotification(
          ErrorFactory.create(error, {space, program, timeWindow})
        )
      )
    })
}

export const searchAnalytics = (): Thunk => (dispatch, getState, boom) => {
  const state = getState()
  const space = getCurrentSpaceName(state)
  const program = getSearchProgram(state)
  const timeWindow = getTimeWindow(state)

  dispatch(requestMainSearch())

  return boom
    .search(program, {
      searchSpan: timeWindow,
      searchSpace: space
    })
    .channel(0, analyticsReceiver(dispatch, 0))
    .each(statsReceiver(dispatch))
    .done(() => dispatch(completeMainSearch()))
    .error(error => {
      dispatch(completeMainSearch())
      dispatch(
        addNotification(
          ErrorFactory.create(error, {space, program, timeWindow})
        )
      )
    })
}
