/* eslint-disable no-unused-vars */
/* eslint-disable nuxt/no-globals-in-created */
import Vue from 'vue'
import vuex from 'vuex'
import VueRouter from 'vue-router'
import consola from 'consola'
import axios from 'axios'
import $ from 'jquery'
const data = {
  headers: {},
}
const tools = {
  $,
  axios,
  /**
   * Custom axios to request information from the API.
   *
   * @return $object axios.
   */
  _axios() {
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
        return response
      },
      function (error) {
        $('#loading').hide()
        if (
          window.location.pathname !== '/not-found' &&
          error.response &&
          (error.response.status === 503 || error.response.status === 504)
        ) {
          return
        }
        return Promise.reject(error)
      }
    )
    return axios
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
  deepCopy(data) {
    if ($.isArray(data)) return JSON.parse(JSON.stringify(data))
    // Merge the contents of two or more objects together into the first object.
    return $.extend(true, {}, data)
  },
  /**
   * Hides the loading.
   */
  hideLoading() {
    $('#loadingDiv').hide()
  },
}
/** Apply a mixin globally. */
Vue.mixin({
  data() {
    return data
  },
  created() {
    axios.defaults.baseURL = process.env.base_url
  },
  methods: {
    ...tools,
  },
})
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
Vue.use(vuex)
/** Sets client config */
if (process.client) {
  window.tools = tools
  window.data = data
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
