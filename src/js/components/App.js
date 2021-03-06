/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import {ipcRenderer} from "electron"

import {XLatestError} from "./LatestError"
import AboutModal from "./AboutModal"
import ClusterGate from "./Login/ClusterGate"
import ErrorNotice from "./ErrorNotice"
import SettingsModal from "./SettingsModal"
import View from "../state/View"
import brim from "../brim"
import refreshSpaceNames from "../flows/refreshSpaceNames"

export default function App() {
  brim.time.setZone(useSelector(View.getTimeZone))
  let dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshSpaceNames())
    ipcRenderer.invoke("windows:ready")
  }, [])

  return (
    <div className="app-wrapper">
      <div className="title-bar-drag-area" />
      <XLatestError />
      <ClusterGate />

      {/* Global Modals */}
      <ErrorNotice />
      <SettingsModal />
      <AboutModal />
    </div>
  )
}
