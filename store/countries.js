import vue from 'vue'
import Vuex from 'vuex'
import { tools } from '~/plugins/index'

vue.use(Vuex)

export const state = () => ({
  allCountries: {},
})

export const mutations = {
  set(state, data) {
    if (data) {
      state.allCountries = data
    }
  },
}
export const actions = {
  async fetchData({ commit }, params) {
    const { data } = await tools._axios().get('/all')
    if (data.status === 'error') {
      return false
    } else if (data) {
      commit('set', data)
      return true
    }
  },
}

export const getters = {
  allCountries: (state) => {
    return state.allCountries
  },
}
export default {
  state,
  mutations,
  getters,
  actions,
}
