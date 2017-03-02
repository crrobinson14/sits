exports.action = {
  name: 'getVariants',
  description: 'My Action',
  blockedConnectionTypes: [],
  outputExample: {},
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: [],

  inputs: {},

  run: function (api, data, next) {
    let error = null
    // your logic here
    next(error)
  }
}
