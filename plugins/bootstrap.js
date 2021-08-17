import jQuery from 'jquery'
if (process.client) {
  window.jQuery = jQuery
  window.$ = jQuery
  require('bootstrap')
  // require('@/node_modules/video.js/dist/video.js')
  require('owl.carousel')
  require('jquery-ui')
}
// require('@/plugins/pdf.js')
