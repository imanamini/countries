/* eslint-disable no-unused-vars */
/* eslint-disable nuxt/no-globals-in-created */
import Vue from 'vue'
import vuex from 'vuex'
import VueRouter from 'vue-router'
import consola from 'consola'

// import Moment from 'moment'
import axios from 'axios'
import atob from 'atob'
import $ from 'jquery'
const Cookie = process.client ? require('js-cookie') : undefined
// if (process.client) require('jq-ajax-progress')
class MyUploadAdapter {
  constructor(loader) {
    // The file loader instance to use during the upload.
    this.loader = loader
  }

  /**
   * Starts the upload process.
   */
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this._initRequest()
          this._initListeners(resolve, reject, file)
          this._sendRequest(file)
        })
    )
  }

  /**
   * Aborts the upload process.
   */
  abort() {
    if (this.xhr) {
      this.xhr.abort()
    }
  }

  /**
   * Initializes the XMLHttpRequest object using the URL passed to the constructor.
   */
  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest())

    // Note that your request may look different. It is up to you and your editor
    // integration to choose the right communication channel. This example uses
    // a POST request with JSON as a data structure but your configuration
    // could be different.
    xhr.open('POST', process.env.base_url + 'ck', true)
    xhr.responseType = 'json'
  }

  /**
   * Initializes XMLHttpRequest listeners.
   *
   * @param function $resolve When the upload succeed.
   * @param function $reject When the upload fails.
   * @param array $file The uploaded file.
   */
  _initListeners(resolve, reject, file) {
    const xhr = this.xhr
    const loader = this.loader
    const genericErrorText = ''

    xhr.addEventListener('error', () => reject(genericErrorText))
    xhr.addEventListener('abort', () => reject())
    xhr.addEventListener('load', () => {
      // console.log(xhr)
      const response = xhr.response

      // This example assumes the XHR server's "response" object will come with
      // an "error" which has its own "message" that can be passed to reject()
      // in the upload promise.
      //
      // Your integration may handle upload errors in a different way so make sure
      // it is done properly. The reject() function must be called when the upload fails.
      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        )
      }

      // If the upload is successful, resolve the upload promise with an object containing
      // at least the "default" URL, pointing to the image on the server.
      // This URL will be used to display the image in the content. Learn more in the
      // UploadAdapter#upload documentation.
      resolve({
        default: response.url,
      })
    })

    // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
    // properties which are used e.g. to display the upload progress bar in the editor
    // user interface.
    if (xhr.upload) {
      xhr.upload.addEventListener('progress', (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total
          loader.uploaded = evt.loaded
        }
      })
    }
  }

  /**
   * Prepares the data and sends the request.
   *
   * @param array $file The uploaded file.
   */
  _sendRequest(file) {
    // Prepare the form data.
    const data = new FormData()
    data.append('upload', file)

    // Important note: This is the right place to implement security mechanisms
    // like authentication and CSRF protection. For instance, you can use
    // XMLHttpRequest.setRequestHeader() to set the request headers containing
    // the CSRF token generated earlier by your application.

    // Send the request.
    this.xhr.send(data)
  }
}
const sels = {}
const data = {
  notfound: false,
  adminSidebar: { key: '' },
  visibleTimeLine: { type: ['all'], person: [] },
  visibleComments: { id: [] },
  adminsidebarCourse: {},
  // videojs,
  adminCourse: { data: {} },
  PDFObject: process.client ? window.PDFObject : $,
  // CKEDITOR: process.client ? window.CKEDITOR : $,
  headers: {},
  _announcements: [],
  _jwt: '',
  time: null,
  component: null,
  _panel: 'gfdgfd',
  _sectionSelected: '',
  framework: 'Desktop',
  col: [
    { name: 'آموزش', path: '/categories', class: '' },
    // ,
    // { name: 'فرم ها', path: '/form/list', class: '' }
  ],
}
const tools = {
  // TODO
  crumbs(index, d, del) {
    for (const i in data.col) if (!data.col[i]) data.col.splice(i, 1)
    if (index !== undefined) {
      if (del) {
        data.col.splice(index, 1)
      } else data.col[index] = d

      tools.forceUpdate()
    } else return data.col
  },
  /**
   * gotopage
   *
   * @param {string} url - url which redirect to
   * @param {string} name - name if section to use in breadcrumb
   *
   */
  gotopage(url, name, index) {
    if (index === 0) {
      this.crumbs(2, {}, true)
      this.crumbs(1, {}, true)
      this.$router.push({ path: url })
    } else {
      this.crumbs(2, {}, true)
      this.crumbs(1, { path: url, name, class: '' })
      this.$router.push({ path: url })
    }
  },
  // TODO
  checkURL(page) {
    const url = this.$route.fullPath
    let flag = false
    if (url.includes(page)) {
      flag = true
    }
    return flag
  },
  // TODO
  secToHms(d) {
    d = Number(d)
    const h = Math.floor(d / 3600)
    const m = Math.floor((d % 3600) / 60)
    // var s = Math.floor(d % 3600 % 60);

    const hDisplay = h > 0 ? h + ' ساعت' : ''
    const mDisplay = m > 0 ? m + ' دقیقه' : ''
    // var sDisplay = s > 0 ? s +  : "";
    if (hDisplay) return hDisplay + ' و ' + mDisplay
    else return mDisplay
  },
  /**
   * Specifies whether an element is inside a div.
   *
   * @param string $el The element.
   *
   * @return $boolean True or false.
   */
  elementInViewport2(el) {
    el = $(el)[0]
    if (!el) return
    let top = el.offsetTop
    let left = el.offsetLeft
    const width = el.offsetWidth
    const height = el.offsetHeight

    while (el.offsetParent) {
      el = el.offsetParent
      top += el.offsetTop
      left += el.offsetLeft
    }

    return (
      top < window.pageYOffset + window.innerHeight &&
      left < window.pageXOffset + window.innerWidth &&
      top + height > window.pageYOffset &&
      left + width > window.pageXOffset
    )
  },
  /**
   * Sets announcements.
   *
   * @param array $a Announcements.
   */
  setAnnouncements(a) {
    data._announcements = a
  },
  /**
   * Gets announcements.
   *
   * @return $array Announcements.
   */
  getAnnouncements() {
    return data._announcements
  },
  /**
   * Deletes selected items in a list .
   * Loads the data accordingly.
   *
   * @param string $url Data deletion request URL.
   * @param array $items Items to be deleted.
   * @param object $extraData Additional information sent to the server.
   */
  _trash(url, items, extraData) {
    const ids = []
    const objects = tools.selected(items)
    for (const i in objects) ids.push(objects[i].id)
    this._axios()({
      url,
      method: 'delete',
      data: {
        ids,
        ...extraData,
      },
    })
      .then((response) => {
        if (response.data.status === 'ok') this.loadData(1)
      })
      .catch((error) => {
        this.console(error)
      })
  },
  /**
   * Loads the data according to the input value.
   *
   * @param number $page The page number.
   * @param string $searchInput The input to be searched.
   */
  __loadData(page, searchInput) {
    this.$parent.searchInput = searchInput
    this.$parent.loadData(page)
  },
  /**
   * Loads the data according to the parameters sent to the server.
   *
   * @param number $page The page number.
   * @param string $url Data download request URL.
   * @param array $key ُSpecify where to save the data we got from the server.
   * @param function $responseCallback For successful HTTP response.
   * @param function $errorCallback For failed HTTP response.
   * @param object $vm Refers to our Vue instance.
   * @param object $extraData Additional information sent to the server.
   */
  _loadData(page, url, key, responseCallback, errorCallback, vm, extra) {
    if (!vm) vm = this
    if (page) vm.pagination.page = page
    this._axios()({
      url,
      method: 'post',
      data: {
        sorts: vm.sorts,
        search: vm.searchInput,
        page: vm.pagination.page,
        perPage: vm.pagination.perPage,
        filters: vm.filters,
        ...extra,
      },
    })
      .then((response) => {
        if (response.data.status === 'ok') {
          vm.heads = response.data.res.heads
          vm.filtersList = response.data.res.filters
          for (const i in vm.filtersList) vm.filtersList[i].visible = true
          vm[key] = response.data.res[key]
          vm.companyParameters = response.data.res.companyParameters
          for (const i in vm.companyParameters) {
            vm.companyParameters[i].visible = true
          }
          vm.pagination.total = response.data.res.total
          vm.pagination.page = page
          vm.pagination.key = tools.random()
          responseCallback && responseCallback(response)
        }
      })
      .catch((error) => {
        errorCallback && errorCallback(error)
        tools.console(error)
      })
  },
  // TODO
  /**
   * find if string strat with efont or not
   * @param str
   * @returns {boolean}
   */
  reg(str) {
    if (str !== '' && str !== null && str !== undefined) {
      const fstr = str.charAt(0).toLowerCase()
      const patt1 = /[A-Za-z0-9_.]/g
      const result = fstr.match(patt1)
      if (result) return true
    } else {
      return false
    }
  },
  // TODO
  highlight(text, needle, color, end) {
    if (!color || color === undefined) {
      color = '50'
    }
    if (!needle) {
      return text
    }
    if (text && text.replace) {
      if (!end) {
        text += ' ...'
      }
      return text.replace(new RegExp(needle, 'gi'), (match) => {
        if (color === '50') {
          return '<span class="highlightText color-50">' + match + '</span>'
        } else if (color === '12') {
          return (
            '<span class="highlightText color-12 text-bold">' +
            match +
            '</span>'
          )
        } else if (color === 'ff') {
          return (
            '<span class="highlightText color-ff text-bold">' +
            match +
            '</span>'
          )
        }
      })
    }
  },
  // TODO
  highlight2(text, needle, color, length) {
    if (!color || color === undefined) {
      color = '50'
    }
    if (!needle || text.search(needle) === -1) {
      if (text.length > length) {
        return text.substring(0, length) + '...'
      } else return text
    } else if (
      text.search(needle) < length &&
      length < text.search(needle) + needle.length
    ) {
      return tools
        .shortener(text, length)
        .replace(
          new RegExp(text.substring(text.search(needle), length), 'gi'),
          (match) => {
            if (color === '50') {
              return '<span class="highlightText color-50">' + match + '</span>'
            } else if (color === '12') {
              return (
                '<span class="highlightText color-12 text-bold">' +
                match +
                '</span>'
              )
            }
          }
        )
    } else {
      return tools
        .shortener(text, length)
        .replace(new RegExp(needle, 'gi'), (match) => {
          if (color === '50') {
            return '<span class="highlightText color-50">' + match + '</span>'
          } else if (color === '12') {
            return (
              '<span class="highlightText color-12 text-bold">' +
              match +
              '</span>'
            )
          }
        })
    }
  },
  /**
   * Searches according to the input value.
   *
   * @param string $text The search input value.
   * @param function $success For successful HTTP response.
   * @param function $error For failed HTTP response.
   */
  search(text, success, error) {
    tools
      ._axios()({
        url: '/search',
        method: 'post',
        data: {
          search: text,
          // panel: tools.panel()
        },
      })
      .then((response) => {
        success(response)
      })
      .catch((error) => {
        error(error)
      })
  },
  $,
  /**
   * Specifies being an array.
   *
   * @param array $a The array.
   *
   * @return $boolean True if it is an array otherwise false.
   */
  isArray(a) {
    return $.isArray(a)
  },
  /**
   * Parses cookies attached to the client request object.
   *
   * @param string $cookie Cookie header.
   *
   * @return $object Object keyed by the cookie names.
   */
  cookieParser(cookie) {
    const cookies = {}
    if (!cookie) return cookies
    cookie = cookie.split(';')
    for (const c of cookie) {
      const part = c.split('=')
      cookies[part[0].trim()] = part[1].trim()
    }
    return cookies
  },
  // open: process.client ? window.open : $,
  axios,
  /**
   * Custom axios to request information from the API.
   *
   * @return $object axios.
   */
  _axios() {
    if (tools.jwt()) axios.defaults.headers.common.jwt = tools.jwt()
    else axios.defaults.headers.common.jwt = ''
    axios.defaults.baseURL = process.env.base_url
    axios.interceptors.request.use(
      function (config) {
        $('#loading').show()
        return config
      },
      function (error) {
        $('#loading').show()
        return Promise.reject(error)
      }
    )
    // Create interceptors to set token in header in every request to server
    axios.interceptors.response.use(
      function (response) {
        $('#loading').hide()
        if (response.headers.jwt) {
          tools.jwt(response.headers.jwt)
          axios.defaults.headers.common.jwt = response.headers.jwt
        }
        if (response.data.version) {
          // window.version = response.data.version
          tools.callifx2('getVersion', null, null, response.data.version)
          // localStorage.setItem('version', response.data.version)
        }
        if (response.data.jwt) {
          tools.jwt(response.data.jwt)
          axios.defaults.headers.common.jwt = response.headers.jwt
        }
        if (response.data.status === 'error' && response.data.code === 3) {
          tools.jwt('')
          axios.defaults.headers.common.jwt = ''
        } else if (
          response.data.status === 'error' &&
          response.data.code === 1 &&
          window.location.pathname !== '/login'
        ) {
          tools.jwt('')
          axios.defaults.headers.common.jwt = ''
          window.location = '/login'
        } else if (
          response.data.status === 'error' &&
          response.data.code === 24
        ) {
          window.getSel().$router.push({ path: '/403' })
        } else if (
          response.data.status === 'error' &&
          response.data.code === 404
        ) {
          // alert('i')
          window.location.pathname = '/not-found'
          // window.getSel().$router.push({ path: '/categories' })
        }

        return response
      },
      function (error) {
        $('#loading').hide()
        if (
          window.location.pathname !== '/not-found' &&
          error.response &&
          (error.response.status === 503 || error.response.status === 504)
        ) {
          // window.location.href = '/features'
          window.getSel().$router.push({ path: '/not-found' })
          return
        }
        return Promise.reject(error)
      }
    )
    return axios
  },
  /**
   * Specifies being a number.
   *
   * @param number $num The number.
   *
   * @return $boolean True or false.
   */
  isNumeric(num) {
    if (process.client) return $.isNumeric
    else return num * 1 == num // eslint-disable-line
  },
  /**
   * Logs in console.
   *
   * @param array $...arg  Indefinite number of arguments.
   */
  console(...arg) {
    if (process.client) {
      window.console.log(arg)
    } else consola.log(arg)
  },
  /**
   * Re-renders all component.
   */
  forceUpdate() {
    for (const i in sels) {
      if (sels[i] && sels[i].$forceUpdate) sels[i].$forceUpdate()
    }
  },
  /**
   * Converts first letter of each word  to uppercase.
   *
   * @param string $text The text.
   *
   * @return $string Capitalized text.
   */
  capSentence(text) {
    const wordsArray = text.toLowerCase().split(' ')
    const capsArray = []

    wordsArray.forEach((word) => {
      capsArray.push(word[0].toUpperCase() + word.slice(1))
    })

    return capsArray.join(' ')
  },
  /**
   * Converts milliseconds to hh:mm:ss format.
   *
   * @param number $duration Milliseconds.
   *
   * @return $string Formatted output.
   */
  humanReadableLength(duration) {
    duration = Math.round(duration)
    const sec = duration % 60
    let min = duration % 3600
    min = Math.floor(min / 60)
    let hour = Math.floor(min / 3600)
    min = min + ':'
    if (hour) hour = hour + ':'
    return hour + min + sec
  },
  humanTime(time) {
    const datetime = time.split('-')
    let diff = 0
    const date = new Date()
    const year = datetime[0]
    const month = datetime[1]
    const day = datetime[2].split(' ')[0]
    let emsal = false

    if (Number.isInteger(time)) {
      diff = Date.now() / 1000 - time / 1000
    } else {
      diff = (Date.now() - new Date(time).getTime()) / 1000
    }
    diff = Math.floor(diff / 60)
    let str = ''
    const date1 = new Date(month + '/' + day + '/' + year)
    const date2 = new Date()
    const DifferenceInTime = date2.getTime() - date1.getTime()
    const DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24)
    const dateNow =
      date2.getUTCFullYear() +
      '-' +
      (date2.getMonth() + 1) +
      '-' +
      date2.getDate()

    let checkEmsal2 = tools.convertG2JCalendar2(
      dateNow,
      true,
      false,
      true,
      'formatted'
    ).date
    let checkEmsal = tools.convertG2JCalendar2(
      time,
      true,
      false,
      true,
      'formatted'
    ).date
    checkEmsal = checkEmsal.split('/')
    checkEmsal2 = checkEmsal2.split('/')
    if (checkEmsal[0] === checkEmsal2[0]) {
      emsal = true
    }
    let diffTime = 0
    if (diff > 0) {
      diffTime = Math.abs(date2 - date1)
    } else {
      diffTime = -Math.abs(date2 - date1)
    }
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1
    if (diffDays === 0 || diff === 0) {
      str = 'امروز'
    } else if (diffDays === 1) {
      str = 'دیروز'
    } else if (emsal && diffDays > 1) {
      str = tools.convertG2JCalendar2(time, true, false, false).date
    } else if (!emsal) {
      str = tools.convertG2JCalendar2(time, true, false, true, 'formatted').date
    } else if (diff < 0) {
      diff = Math.abs(diff)
      if (diffDays === 0 || diff === 0) {
        str = 'امروز'
      } else if (diffDays === -1) {
        str = 'فردا'
      } else if (diff >= -(24 * 60) && diff < -(24 * 60 * 2)) {
        str = 'فردا'
      } else if (diff >= -(24 * 60 * 2) && diff < -(24 * 60 * 7 * 4 * 12)) {
        str = tools.convertG2JCalendar2(time, true, false, false).date
      } else if (diff >= -(24 * 60 * 7 * 4 * 12)) {
        str = tools.convertG2JCalendar2(time, true, false, true, 'formatted')
          .date
      }
    } else {
      // str = tools.convertG2JCalendar2(time, true, false, false).date
      return DifferenceInDays
    }
    // else if (diff >= 24 * 60 * 7 && diff < 24 * 60 * 7 * 4) {
    //   // week
    //   str = Math.floor(diff / (60 * 24 * 7)) + ' هفته پیش'
    // }
    // else if (diff >= 24 * 60 * 7 * 4 && diff < 24 * 60 * 7 * 4 * 12) {
    //   // month
    //   str = Math.floor(diff / (60 * 24 * 7 * 4)) + ' ماه پیش'
    // }
    // else if (diff >= 24 * 60 * 7 * 4 * 12) {
    //   // year
    //   str = Math.floor(diff / (60 * 24 * 7 * 4 * 12)) + ' سال پیش'
    // }

    return tools.translate2persian(str)
  },
  relativeTime(time) {
    let diff = 0
    if (Number.isInteger(time)) {
      diff = Date.now() / 1000 - time / 1000
    } else {
      diff = (Date.now() - new Date(time).getTime()) / 1000
    }
    diff = Math.floor(diff / 60)
    let str = ''
    if (diff <= 0) {
      // now
      str = 'همین حالا'
    } else if (diff >= 1 && diff < 60) {
      // minute
      str = diff + ' دقیقه پیش'
    } else if (diff >= 60 && diff < 24 * 60) {
      // hour
      str = Math.floor(diff / 60) + ' ساعت پیش'
    } else if (diff >= 24 * 60 && diff < 24 * 60 * 7) {
      // day
      str = Math.floor(diff / (60 * 24)) + ' روز پیش'
    } else if (diff >= 24 * 60 * 7 && diff < 24 * 60 * 7 * 4) {
      // week
      str = Math.floor(diff / (60 * 24 * 7)) + ' هفته پیش'
    } else if (diff >= 24 * 60 * 7 * 4 && diff < 24 * 60 * 7 * 4 * 12) {
      // month
      str = Math.floor(diff / (60 * 24 * 7 * 4)) + ' ماه پیش'
    } else if (diff >= 24 * 60 * 7 * 4 * 12) {
      // year
      str = Math.floor(diff / (60 * 24 * 7 * 4 * 12)) + ' سال پیش'
    } else return diff
    return tools.translate2persian(str)
  },
  /**
   * convert file size to human readable.
   *
   * @param number $size Size of the file.
   *
   * @return $number The file size.
   */
  fileSize(size) {
    let p = 'B'
    if (size > 1024 * 1024 * 1024) {
      size = (size / 1024) * 1024 * 1024
      p = 'GB'
    } else if (size > 1024 * 1024) {
      size = (size / 1024) * 1024
      p = 'MB'
    } else if (size > 1024) {
      size = size / 1024
      p = 'KB'
    }
    return Math.round(size * 100) / 100 + ' ' + p
  },
  /**
   * extract number from an string
   *
   * @param number $num The number.
   *
   * @return $number The number without any other characters.
   */
  extractNumber(num) {
    if (num && num.replace) return num.replace(/[^0-9]/g, '')
  },
  /**
   * Makes a deep copy of an array or object.
   *
   * @param {array, object} $data Array or object.
   *
   * @return $object Cloned object.
   */
  deepCopy(data) {
    if ($.isArray(data)) return JSON.parse(JSON.stringify(data))
    // Merge the contents of two or more objects together into the first object.
    return $.extend(true, {}, data)
  },
  /**
   * upload progress.
   *
   * @param array $files Uploaded file.
   * @param function $_success Specifies successful upload.
   * @param function $_error Specifies failed upload.
   * @param string $url Upload URL.
   * @param function  $progress callback.
   * @param number $lecture extra data pass.
   * @param number $_course extra data pass.
   * @param number $i extra data pass.
   *
   * @return $object AJAX response.
   */
  _upload(
    files,
    _success,
    _error,
    url,
    progress,
    item,
    value,
    i,
    image,
    name,
    section,
    format
  ) {
    // if (url === null) url = 'https://api.adowing.com/api/upload-media'
    // const ajax = $.post('https://api.adowing.com/api/upload-media', {
    //   format: 'Donald Duck',
    //   city: 'Duckburg'
    // },
    //
    // )
    const ajax = $.ajax({
      type: 'post',
      url: 'https://api.adowing.com/api/upload-media',
      processData: false,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      // data: files,
      data: JSON.stringify({
        file: image,
        section,
        format,
        name,
      }),
      headers: { jwt: tools.jwt() },
      progress(e) {
        // consola.log('progress', e)
      },
      uploadProgress(e) {
        // consola.log(e, 'uploadProgress')
        if (e.lengthComputable) {
          const completedPercentage = Math.round((e.loaded * 100) / e.total)
          if (progress) progress(completedPercentage, item, value, i)
        }
      },
      success: (response) => {
        tools.console(response)
        // response = JSON.parse(response)
        if (_success) _success(response, item, value, i)
      },
      error: (err) => {
        if (_error) _error(err, item, value, i)
        consola.log('error', err)
      },
    })
    return ajax
  },

  /**
   * logout , remove jwt and Redirects to the homepage.
   */
  logout() {
    tools
      ._axios()({
        url: '/logout',
        method: 'get',
      })
      .then((response) => {
        tools.console(response)
      })
      .catch((error) => {
        tools.console(error)
      })
    tools.jwt('')
    if (process.client) window.location.href = '/'
  },
  /**
   * generate a random color base on an input.
   *
   * @param number $seed Which when passed will cause randomColor.
   *
   * @return $number A hex code.
   */
  randomColor(seed) {
    if (!seed) return 0
    seed = tools.hash(seed)
    return Math.floor(Math.abs(Math.sin(seed) * 16777215) % 16777215).toString(
      16
    )
  },
  /**
   * generate hash from string.
   *
   * @param string $string The string.
   *
   * @return $number 32bit integer.
   */
  hash(string) {
    let hash = 0
    if (string.length === 0) {
      return hash
    }
    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash
  },
  /**
   * return selected items from an array.
   *
   * @param array $posts The items to search.
   *
   * @return $array selected items.
   */
  selected(posts) {
    const selected = []
    if (!$.isArray(posts)) {
      for (const i in posts) {
        for (const j in posts[i]) {
          if (posts[i][j].selected) selected.push(posts[i][j])
        }
      }
    } else {
      for (const i in posts) {
        if (posts[i].selected) selected.push(posts[i])
      }
    }
    return selected
  },
  /**
   * select an item or an array of items.
   * set selected paramter to true.
   *
   * @param object $record The item.
   */
  select(record) {
    if (!record.selected) record.selected = true
    else record.selected = false
    if ($.isArray(record)) {
      for (const i in record) {
        record[i].selected = record.selected
      }
    }
    this.forceUpdate()
  },
  /**
   * Specifies all the items has been selected or not.
   *
   * @param array $posts The items.
   *
   * @return $boolean True or false.
   */
  isSelectedAll(posts) {
    if (!$.isArray(posts)) {
      let flag = true
      if (posts.length === 0) flag = false

      for (const i in posts) {
        for (const j in posts[i]) {
          if (!posts[i][j].selected) {
            flag = false
            break
          }
        }
      }
      return flag
    } else {
      let selectedAll = true
      if (posts.length === 0) selectedAll = false
      for (const i in posts) {
        if (!posts[i].selected) {
          selectedAll = false
          break
        }
      }
      return selectedAll
    }
  },
  /**
   * Specifies the name of column.
   *
   * @param string $col The column.
   * @param object $heads The items.
   *
   * @return $string The column name.
   */
  columnName(col, heads) {
    for (const i in heads) {
      if (heads[i] === col) {
        return i
      }
    }
  },
  /**
   * Changes table columns order.
   *
   * @param string $col The column.
   * @param object $heads The items.
   * @param object $sorts The column that is sorted.
   */
  changeOrder(col, heads, sorts, set) {
    col = tools.columnName(col, heads)
    if (set === 'up') {
      if (sorts[col] === 'up') {
        delete sorts[col]
        // sorts[col] = ''
      } else {
        sorts[col] = 'up'
      }
    } else if (set === 'down') {
      if (sorts[col] === 'down') {
        delete sorts[col]
        // sorts[col] = ''
      } else {
        sorts[col] = 'down'
      }
    }
    // sorts[col] =
    //   sorts[col] === 'up' ? 'down' : sorts[col] === 'down' ? '' : 'up'
    this.loadData(this.page)
    this.$forceUpdate()
  },
  /**
   * convert the input to jalali date if its format is in dateetime
   *
   * @param string $datetime input value.
   * @return converted date or the input itself.
   */
  ceonvertIfDate(datetime) {
    datetime = datetime + ''
    if (
      datetime &&
      datetime.split(' ').length === 2 &&
      datetime.split('-').length === 3
    ) {
      return tools.translate2persian(
        tools.convertG2JConcatinate(datetime, false, false, true)
      )
    } else return datetime
  },
  /**
   * Concatinates Jalali date with Jalali time.
   *
   * @param string $datetime The date.
   * @param boolean $show just hour True or flase.
   * @param boolean $showDayWeek Jalali Days of the week.
   * @param boolean $showYear The year.
   *
   * @return $string Concatinated date and time.
   */
  convertG2JConcatinate(datetime, showJustHour, showDayWeek, showYear) {
    const a = tools.convertG2JCalendar(
      datetime,
      showJustHour,
      showDayWeek,
      showYear
    )
    return a.date + ' ' + a.time
  },
  /**
   * Converts Gregorian date to Jalali only return year and month.
   *
   * @param string $date The date.
   *
   * @return $string Concatinated year and month.
   */
  convertG2JOnlyYearMonth(date) {
    let a = tools.convertG2JCalendar(date + '-01 00:00:00', true, false, true)
      .date
    a = a.split(' ')
    return a[1] + ' ' + a[2]
  },
  /**
   * Converts Gregorian date to Jalali only return month and day.
   *
   * @param string $date The date.
   *
   * @return $string Concatinated month and day.
   */
  convertG2JOnlyMonthDay(date) {
    if (!date) return ''
    let a = tools.convertG2JCalendar(date + '-01 00:00:00', true, false, true)
      .date
    a = a.split(' ')
    return a[0] + ' ' + a[1]
  },
  /**
   * Removes timeline's item  in marketing panel.
   *
   * @param number $id The item id.
   * @param string $type Type of the removable item.
   */
  _removeTimelineItem(id, type) {
    if (type !== 'timeline') return
    tools
      ._axios()({
        url: 'timeline/' + id,
        method: 'delete',
      })
      .then((resp) => {
        if (resp.data.status === 'ok') {
          tools.callifx('loadTimeLine')
        }
      })
      .catch((err) => {
        tools.console(err)
      })
  },
  /**
   * set the item of item to be deleted and show the approve modal
   *
   * @param number $id The item id.
   */
  removeTimelineItem(id) {
    tools.callifx('setId', 'k', 'Timeline', id)
    this.$('#DeleteModalTimeline').modal('show')
  },
  /**
   * if image is telegram file id , request server to get actual file address
   * @param string $fileid of image
   * @param object $adv Advertisement data.
   * @param number $_course the _course of image in adv medias array
   *
   * @return $string url of image
   */
  async resolveFileId(fileid, adv, index) {
    if (fileid && fileid.includes('/') && fileid.includes('.')) {
      adv.resolved[index] = tools.imgurl(fileid)
      tools.forceUpdate()
      return tools.imgurl(fileid)
    } else {
      const resp = await tools._axios()({
        url: '/file/' + fileid,
        method: 'get',
      })
      adv.resolved[index] = tools.imgurl(resp.data)
      tools.forceUpdate()
      return tools.imgurl(resp.data)
    }
  },
  /**
   * evaluate the image address . if start with `s ` prepand the backend address to it .
   *
   * @param string $name The image name.
   * @param number $dimn request image in this size.
   * @param string $format The image format to select from an array of images.
   * @param string $type type of image to generate default image .
   *
   * @return $string Image url path.
   */
  imgurl(name, dimn, format, type) {
    const basePath = process.env.base_url.replace('/api/', '')
    if (!name || typeof name !== 'string') {
      if (type === 'course') name = '/default_course.jpg'
      else name = '/Placeholder1.svg'
    }
    if (name.indexOf(';')) {
      if (format) {
        const images = name.split(';')
        for (const i of images) {
          if (i.indexOf(format)) {
            name = i
            break
          }
        }
      } else {
        name = name.split(';')[0]
      }
    }
    if (dimn) {
      if (basePath.includes('localhost')) {
        name = '/_course.php' + name.replace('.', '_' + dimn + '.')
      } else name = name.replace('.', '_' + dimn + '.')
    }
    if (name.startsWith('http')) return name
    else if (name.startsWith('s ')) return basePath + name.replace(/^s /, '')
    else return name
  },
  /**
   * Gets current page address (URL).
   *
   * @return $string The path and filename of the current page.
   */
  pathname() {
    if (process.client) return window.location.pathname
  },
  /**
   * Opens a new browser window, or a new tab.
   *
   * @param string $url The URL of the page to open.
   */
  openurl(url) {
    if (process.client) window.open(url)
  },
  /**
   * Opens an element in fullscreen.
   *
   * @param object $elem The element you want displayed in fullscreen mode.
   */
  openFullscreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen()
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen()
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen()
    }
  },
  /** Closes fullscreen */
  closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      /* Firefox */
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      /* IE/Edge */
      document.msExitFullscreen()
    }
  },
  /**
   * Translates English string or number to Persian.
   *
   * @param string $str The string that wants to be translated.
   *
   * @return $string Translated string.
   */
  translate2persian(str) {
    if (str === 0) return '۰'
    if (!str) return str
    if (str !== undefined) {
      if (typeof str === 'number') str = '' + str
      if (str.replace) {
        str = str.replace(/1/g, '۱')
        str = str.replace(/2/g, '۲')
        str = str.replace(/3/g, '۳')
        str = str.replace(/4/g, '۴')
        str = str.replace(/5/g, '۵')
        str = str.replace(/6/g, '۶')
        str = str.replace(/7/g, '۷')
        str = str.replace(/8/g, '۸')
        str = str.replace(/9/g, '۹')
        str = str.replace(/0/g, '۰')
      }
    }
    return str
  },
  /**
   * Translates Persian string or number to English.
   *
   * @param string $str The string that wants to be translated.
   *
   * @return $string Translated string.
   */
  translate2english(str) {
    if (str === 0) return '۰'
    if (!str) return str
    if (str !== undefined) {
      if (typeof str === 'number') str = '' + str
      str = str.replace(/۱/g, '1')
      str = str.replace(/۲/g, '2')
      str = str.replace(/۳/g, '3')
      str = str.replace(/۴/g, '4')
      str = str.replace(/۵/g, '5')
      str = str.replace(/۶/g, '6')
      str = str.replace(/۷/g, '7')
      str = str.replace(/۸/g, '8')
      str = str.replace(/۹/g, '9')
      str = str.replace(/۰/g, '0')
    }
    return str
  },
  /**
   * Indicates whether the current user is authenticated (logged in).
   *
   * @return $boolean True if the current user is authenticated, otherwise false.
   */
  isAuthenticated() {
    if (tools.userid()) {
      return true
    }
    return false
  },
  userid() {
    return tools.parseJwt().sub
  },
  /**
   * getter and setter for jwt.
   *
   *
   * @return $string JWT token.
   * @param jwt
   */
  jwt(jwt) {
    if (jwt !== undefined) {
      if (process.server) {
        tools.getStore() && tools.getStore().$store.commit('jwt', jwt)
      } else {
        tools.getStore() && tools.getStore().$store.commit('jwt', jwt)
        // Cookie.set('jwt', jwt)
        localStorage.setItem('jwt', jwt)
      }
      axios.defaults.headers.common.jwt = jwt
    } else if (process.server) {
      return tools.getStore() && tools.getStore().$store.state.jwt
    } else {
      return localStorage.getItem('jwt') || Cookie.get('jwt')
    }
  },
  /**
   * Parses (decodes) JWT token.
   *
   * @return object Decoded JWT token.
   */
  parseJwt() {
    const token = tools.jwt()
    if (!token || !token.includes('.')) return {}
    const base64Url = token.split('.')[1]
    if (!base64Url) {
      return ''
    }
    const base64 = base64Url.replace('-', '+').replace('_', '/')
    return JSON.parse(atob(base64))
  },
  /**
   * Searches for a specified item.
   *
   * @param array $fields The Items that are searched.
   * @param string $field The item that wants to be searched.
   * @param string $key The key _course of the field that is checked again needle.
   * @param string $value The value of the field which is returned.
   *
   * @return $string The item.
   */
  _search(fields, field, key, value) {
    if (!fields) {
      return
    }
    for (const i of fields) {
      if (i[key] === field) return i[value]
    }
    return field
  },
  /**
   * Gets current user data.
   *
   * @return $string User data.
   */
  getUser() {
    if (tools.isObjectEmpty(tools.parseJwt())) return {}
    return tools.parseJwt().res
  },
  /**
   * Gets random item from lists.
   *
   * @param array $items The items.
   *
   * @return $string Random item.
   */
  randomItem(items) {
    return items[tools.rand(0, items.length - 1)]
  },
  /**
   * Creates a random number between two number .
   *
   * @param number $min Minimum number.
   * @param number $max Maximum number.
   *
   * @return $number Random number.
   */
  rand(min, max) {
    return Math.round(Math.random() * (max - min)) + min
  },
  /**
   * Generates a random string.
   *
   * @return $number Random string.
   */
  random() {
    return Math.random().toString(36).substring(7)
  },
  /**
   * Truncates long strings.
   *
   * @param string $string The given string.
   * @param number $length The specific number.
   *
   * @return $string Clipped string.
   */
  shortener(string, length) {
    let size = 0
    if (string) {
      size = string.length
    } else return ''

    if (!length) length = 30
    if (!string) return string
    if (size > length) {
      return string.substring(0, length) + '...'
    } else return string
  },
  /**
   * find an property or function between all vue component
   * @param $key name of property or function
   * @param $set if you want to set that property
   */
  _sel(key, set) {
    for (const i in sels) {
      if (sels[i][key] !== undefined) {
        if (set !== undefined) {
          sels[i][key] = set
          return sels[i]
        } else return sels[i][key]
      }
    }
    return null
  },
  /**
   * Divides the number by three digits and sets the comma between them.
   *
   * @param number $x The specific number.
   *
   * @return $string Clipped string.
   */
  numberWithCommas(x) {
    if (typeof x === 'string' || x instanceof String) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    } else return x
  },
  /**
   * Translates given English word to Farsi.
   *
   * @param string $key word to translate
   * @param string $section the context of word
   *
   * @return $string Translated word.
   */
  dic(key, section) {
    if (!section) section = ''
    const dic = {
      deleted: 'حذف شده',
      rejected: 'تایید نشده',
      scheduled: 'در انتظار انتشار',
      published: 'منتشر شده',
      checking: 'در انتظار بازبینی',
      intermediate: 'متوسطه',
      Company: 'شرکت ها',
      User: 'مخاطب',
      send: 'ارسال شده',
      draft: 'پیش نویس',
      Companysearch: 'شرکت ها',
      raw: 'خام',
      cummulative: 'تجمعی',
      tarrif: 'تعرفه ای',
      Contactsearch: 'مخاطبین',
      publish: 'ارسال شده',
      today: 'امروز',
      tomorrow: 'فردا',
      nextday: 'پس فردا',
      weeklater: 'یک هفته بعد',
      other: 'سایر',
      check: 'پیگیری',
      list: 'آماده سازی لیست',
      noanswer: 'بدون جواب',
      busy: 'اشغال',
      wrongnumber: 'شماره اشتباهی',
      notwilling: 'عدم متمایل به همکاری',
      willing: 'متمایل به همکاری',
      telegrammethod: 'ارسال پیشنهاد در تلگرام',
      whatsappmethod: 'ارسال پیشنهاد در واتس اپ',
      linkedinmethod: 'ارسال پیشنهاد در لینکدین',
      hozurimethod: 'ویزیت حضوری',
      phonemethod: 'بازاریابی تلفنی',
      emailmethod: 'بازاریابی ایمیلی',
      second_identitymethod: 'ترغیب افراد با هویت ثانویه',
      introducemethod: 'معرفی توسط مشتری',
      brandmethod: 'اثر موفقیت برند',
      contentmethod: 'تولید محتوا و دانش رایگان',
      instagrammethod: 'ارسال پیشنهاد در اینستاگرام',
      telegram: 'تلگرام',
      instagram: 'اینستاگرام',
      linkedin: 'لینکدین',
      hozuri: 'حضوری',
      website: 'وب سایت',
      both: 'هر دو',
      none: 'هیچکدام',
      standard: 'استاندارد',
      special: 'تعرفه شخصی',
      personal: 'تعرفه شخصی',
      successful: 'موفق',
      success: 'موفق',
      unsuccessful: 'ناموفق',
      unsuccess: 'ناموفق',
      inProgress: 'در حال مذاکره',
      notwork: 'غیرهمکار',
      work: 'درحال همکاری',
      break: 'قطع همکاری',
      direct: 'مستقیم',
      indirect: 'غیر مستقیم',
      email: 'ایمیل',
      whatsapp: 'واتس اپ',
      phone: 'تلفن',
      face: 'حضوری',
      negotiationCardTimeLine: 'مذاکره',
      noteCardTimeLine: 'یادداشت',
      taskCardTimeLine: 'وظیفه',
      meetingCardTimeLine: 'ملاقات',
      emailCardTimeLine: 'ایمیل',
      callCardTimeLine: 'تماس',
      attachmentCardTimeLine: 'فایل ضمیمه',
      relatedtoCardMode: 'مرتبط با',
      textCardMode: 'متن',
      titleCardMode: 'عنوان',
      reminderCardMode: 'یادآوری',
      reminder_dateCardMode: 'تاریخ یادآوری',
      rminder_timeCardMode: 'ساعت یادآوری',
      ownerCardMode: 'مسئول',
      dueCardMode: 'مهلت انجام',
      due_timeCardMode: 'ساعت انجام',
      due_dateCardMode: 'تاریخ انجام',
      tariffCardMode: 'تعرفه داده شده',
      platforms_ordersCardMode: 'پلتفرم درخواستی',
      methodCardMode: 'متد بازاریابی',
      approachCardMode: 'رویکرد بازاریابی',
      first_associationCardMode: 'پیدا شده از',
      resultCardMode: 'نتیجه',
      platforms_orderCardMode: 'ترتیب پلتفرم های ارتباطی',
      task_typeCardMode: 'نوع وظیفه',
      _60Time: 'یک ساعت',
      _30Time: 'نیم ساعت',
      _90Time: 'یک ساعت و نیم',
      _120Time: 'دو ساعت',
      _150Time: 'دو ساعت و نیم',
      nocheckout: 'تسویه نشده',
      yescheckout: 'تسویه شده',
      created_ad: 'در انتظار اجرا',
      creating_ad: 'در انتظار اجرا',
      paused_ad: ' در حال اجرا',
      finished_ad: 'پایان یافته',
      inProgress_ad: 'در حال اجرا',
      tarrif_rate: 'تعرفه ای',
      view_rate: 'بازدیدی',
      impression_rate: 'ایمپرشن',
      reach_rate: 'ریچ',
      yes_checkout_status: 'انجام شده',
      no_checkout_status: 'انجام نشده',
      cancel_checkout_status: 'کنسل شده',
      true_screenshot: 'نمایش',
      Post: 'نوشته ها',
      post: 'نوشته',
      tag: 'برچسب',
      media: 'رسانه',
      category: 'دسته بندی',
      Postsearch: 'نوشته ها',
      Category: 'دسته بندی ها',
      Categorysearch: 'دسته بندی ها',
      Media: 'رسانه ها',
      Mediasearch: 'رسانه ها',
      Comment: 'دیدگاه ها',
      Commentsearch: 'دیدگاه ها',
      Tag: 'برچسب ها',
      Tagsearch: 'برچسب ها',
      main: 'شاخص',
      thumbnail: 'بندانگشتی',
      content: 'محتوا',
      photo: 'عکس',
      video: 'ویدیو',
      pdf: 'پی دی اف',
      voice: 'صدا',
      pendingcomment: 'در انتظار تایید',
      verifiedcomment: 'تایید شده',
      rejectedcomment: 'رد شده',
      recievedcomment: 'ارسال گردیده است',
      editcomment: 'ویرایش گردیده است',
      verified_with_answercomment: ' پاسخ به آن ارسال شده است',
      answerercomment: 'نام پاسخ دهنده',
      answercomment: 'متن پاسخ',
      restoredcomment: 'بازیابی شد',
      commenter_namecomment: 'نام نظر دهنده',
      contentcomment: 'متن نظر',
      submit_atcomment: 'تاریخ ارسال نظر',
      video_editor: 'تدوینگر',
      consultants: 'مشاور',
      Illustrators: 'طراح',
      editors: 'ویراستار',
      translators: 'مترجم',
      motions: 'موشن',
      programming: 'برنامه نویسی',
      marketing: 'بازاریابی',
      design: 'طراحی',
      human_resource: 'منابع انسانی',
      management: 'مدیریت',
      product_management: 'مدیریت محصول',
      game: 'بازی سازی',
      soft_skills: 'مهارت های نرم',
      motion: 'موشن',
    }
    if (dic[key + section]) return dic[key + section]
    else return key
  },
  /**
   * search in dic and return the match value
   *
   * @param string $dic dctionary to search.
   * @param string $key the key of item to check can be null.
   * @param string $value the value return of matched element .
   * @param string $search the needle to search.
   *
   * @return $string Translated word.
   */
  translate(dic, key, value, search) {
    if (!search) {
      return ''
    }
    if (!key && !value && dic[search] !== undefined) return dic[search]
    else if ($.isArray(dic)) {
      for (const i of dic) {
        if (i[key] === search) {
          if (value) return i[value]
          else return i
        }
      }
    } else if (dic instanceof Object) {
      for (const i in dic) {
        if (i === search) {
          if (value) return dic[i][value]
          else {
            return dic[i]
          }
        }
      }
    }

    return search
  },
  /**
   * call if exists , call a function from another vue component
   * parames name of function , a key to check and a value of target component
   * when there are multiple instance of that component , pass other parameters to target function
   * @return $any result of function
   */
  callifx() {
    const arg = Array.prototype.slice.call(arguments)
    const name = arg[0]
    const key = arg[1]
    const value = arg[2]
    arg.splice(0, 3)
    for (const i in sels) {
      const j = sels[i]
      if (j && j[name] !== undefined) {
        if (key !== null && value !== null) {
          if (j[key] === value) return j[name](...arg)
        } else {
          return j[name](...arg)
        }
      }
    }
  },
  /**
   * like callifx but store result of multiple instance and return them
   *
   * @return $array of results.
   */
  callifx2() {
    const arg = Array.prototype.slice.call(arguments)
    const name = arg[0]
    const key = arg[1]
    const value = arg[2]
    const results = []
    arg.splice(0, 3)
    for (const i in sels) {
      const j = sels[i]
      if (j && j[name] !== undefined) {
        if (key !== null && value !== null) {
          if (j[key] === value) {
            const a = j[name](...arg)
            if (a) results.push(a)
          }
        } else {
          const a = j[name](...arg)
          if (a) results.push(a)
        }
      }
    }
    return results
  },
  /**
   * Displays an alert box.
   *
   * @param string $data Specified message.
   */
  alert(data) {
    alert(data)
  },
  /**
   * Formats js date object  to date and time string .
   *
   * @param string $date Given date.
   *
   * @return $string Formated date.
   */
  formattedTime(date) {
    const month = date.getMonth() + 1
    const day = date.getDate()
    return (
      date.getFullYear() +
      '-' +
      (month < 10 ? '0' + month : month) +
      '-' +
      (day < 10 ? '0' + day : day) +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes() +
      ':' +
      date.getSeconds()
    )
  },
  /**
   * return base name of a url.
   *
   * @param string $str Given string.
   *
   * @return $string name of a file in url.
   */
  baseName(str) {
    let base = str.substring(str.lastIndexOf('/') + 1)
    if (base.lastIndexOf('.') !== -1) {
      base = base.substring(0, base.lastIndexOf('.'))
    }
    return base
  },
  /**
   * Determining if an object is empty.
   *
   * @param object $obj Given object.
   *
   * @return $boolean True if the object is empty otherwise false.
   */
  isObjectEmpty(obj) {
    let flag = true
    flag = true

    for (const i in obj) {
      flag = false
    }
    return flag
  },
  /**
   * add the current vue instance to vue instance pool.
   *
   * @param object $sel vue instance.
   */
  setSel(sel) {
    for (const i in sels) {
      const j = sels[i]
      if (!j || j._isDestroyed) {
        delete sels[i]
      }
    }
    sels[sel._uid] = sel
  },
  /**
   * Capitalizes the first letter of the given string.
   *
   * @param string $str The given string.
   *
   * @return $string Capitalized string.
   */
  capitalize(str) {
    if (!str) return str
    return str.substr(0, 1).toUpperCase() + str.substr(1)
  },
  /**
   * Hides the loading.
   */
  hideLoading() {
    $('#loadingDiv').hide()
  },
  /**
   * Gets an instance of vue from vue pool instance
   *
   * @return a vue instance
   */
  getSel() {
    try {
      if (!tools.isObjectEmpty(sels)) {
        for (const i in sels) if (sels[i]) return sels[i]
      }
    } catch (c) {}
  },
  /**
   * Get a vue object with store object.
   *
   * @return $object vue instance.
   */
  getStore() {
    try {
      if (!tools.isObjectEmpty(sels)) {
        for (const i in sels) if (sels[i] && sels[i].$store) return sels[i]
      }
    } catch (c) {}
  },
  /**
   * Gets the type of media.
   *
   * @return $string media type.
   */
  getMediaType() {
    return tools.getStore().$route.params.media
  },
  /** header: function(h) {
    if (h) {
      data.headers = h
      try {
        for (const i of sels) {
          if (i && i.updateHeader) {
            i.updateHeader()
          }
        }
      } catch (c) {}
    } else return data.headers
  } */
}
/** Apply a mixin globally. */
Vue.mixin({
  data() {
    return data
  },
  computed: {
    __width() {
      return this.$store.state.width
    },
    __height() {
      return this.$store.state.height
    },
  },
  created() {
    axios.defaults.baseURL = process.env.base_url
    tools.setSel(this)
    if (process.client) {
      Cookie.set('width', window.innerWidth)
      Cookie.set('height', window.innerHeight)
    }
  },
  methods: {
    companyId() {
      return 'Company' + this.$route.params.id * 1
    },
    ...tools,
  },
})
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
Vue.use(vuex)
/** Logs app version in the console */
tools.console('version', process.env.version)
/** Sets client config */
if (process.client) {
  window.tools = tools
  window.data = data
  window.sels = sels
  // $.getScript('/jquery-ui.min.js', () => {
  //   tools.$ = window.$
  // })
  $(document).ready(() => {
    $('.container').click((event) => {
      if ($(event.target).is('.notifications') || $(event.target).is('.edit')) {
        return
      }
      if ($(event.target).closest('.notifications').is('.companypopup')) {
        return 1
      }
    })
  })
}
/* eslint-disable no-unused-vars */

// if localStorage have any jwt(token) we set in headers this jwt and in every request we sent to server this jwt append
// axios.defaults.headers.common.jwt = tools.jwt()

/** Creates interceptors to set token in header in every request to server */
axios.interceptors.request.use(
  function (config) {
    if (process.client) $('#loadingDiv').show()
    return config
  },
  function (error) {
    if (process.client) $('#loadingDiv').hide()
    return Promise.reject(error)
  }
)
// export const vue = Vue
export { tools, data, $ }
