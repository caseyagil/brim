/* @flow */

import type {Dispatch} from "../../reducers/types"
import {Handler} from "../../BoomClient"
import type {Span} from "../../BoomClient/types"
import {setCorrelation} from "../../actions/correlations"
import BaseSearch from "./BaseSearch"
import Log from "../Log"
import accumAnalytics from "../../lib/accumAnalytics"

export default class HashSearch extends BaseSearch {
  log: Log

  constructor(program: string, span: Span, log: Log) {
    super(program, span)
    this.log = log
  }

  getProgram() {
    const procs = [
      "count() by md5 | sort -r | head 5",
      "count() by rx_hosts | sort -r | head 5",
      "count() by tx_hosts | sort -r | head 5"
    ]
    return this.program + " | " + procs.join("; ")
  }

  receiveData(handler: Handler, dispatch: Dispatch) {
    const key = this.log.id()
    const makeCallback = (name: string) =>
      accumAnalytics(data => dispatch(setCorrelation(key, name, data)))

    handler
      .channel(0, makeCallback("tx"))
      .channel(1, makeCallback("rx"))
      .channel(2, makeCallback("md5"))
  }
}