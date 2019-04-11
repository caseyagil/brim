/* @flow */

export const itestLocator = "data-test-locator"

const dataAttrs = {
  // The purpose of this object is to have a single source of truth where tests
  // and code can identify and find specific elements that integration tests
  // are interested in. This is done by injecting custom data attributes [1]
  // into the DOM.
  // [1] https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*
  histogram: "histogram-chart",
  notification: "notification-header"
}

export const dataSets = {
  // The purpose of this object is to have a single source of truth about
  // bounds and metrics related to test data. These numbers are also dependent
  // on product behavior. For example, if the default time window changes from
  // last 30 minutes to last hour, some of these numbers may become invalid.
  corelight: {
    histogram: {
      defaultDistinctPaths: 12,
      defaultRectsPerClass: 49,
      defaultTotalRectCount: 588,
      rectAttrMin: 0,
      rectAttrMax: 1000
    }
  }
}

// The purpose of this section is to have a single source of truth for
// interesting selectors. Tests shouldn't hardcode these in multiple places but
// instead use what's defined here. Likewise if product moves stuff around,
// these can be updated in one place.
// The preferred convention is to use CSS selectors, not Xpaths.
const _histogramSelector = `[${itestLocator}='${dataAttrs.histogram}']`

const dataAttrSelector = (component: string) =>
  `[${itestLocator}='` + dataAttrs[component] + "']"

export const selectors = {
  histogram: {
    topLevel: dataAttrSelector("histogram"),
    gElem: dataAttrSelector("histogram") + " g",
    rectElem: dataAttrSelector("histogram") + " rect"
  },
  notification: dataAttrSelector("notification")
}

export const d3ElementAttr = (component: string) => dataAttrs[component]

export const reactElementProps = (component: string) => {
  return {
    [itestLocator]: dataAttrs[component]
  }
}