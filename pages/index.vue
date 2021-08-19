<template>
  <div class='container mt-4 px-0' style='padding-top: 67px'>
    <div class='w-100 row' style='padding-left: 12px;padding-right: 12px'>
      <div
        class='d-flex align-items-center'
        style='
        background-color: var(--bg-secondary);
          height: 48px;
          width: 335px;
          box-shadow: 0px 2px 4px rgba(33, 33, 33, 0.16);
          border-radius: 4px;
        '
      >
        <span
          class='material-icons-outlined'
          style='margin-left: 32px; color: #9e9e9e'
        >
          search
        </span>
        <input
          v-model='searchInput'
          class='ml-4 h-100'

          placeholder='Search for a country...'
          style='border: unset; outline: none;background-color: var(--bg-secondary);'
          @keyup='searchCountry()'
        />
      </div>
      <div class='dropdown ml-auto pl-4'>
        <button
          id='dropdownMenuButton'
          aria-expanded='false'
          aria-haspopup='true'
          class='fs-12 align-items-center d-flex ps-4 pe-3'
          data-toggle='dropdown'
          style='border:unset;border-radius: 4px;box-shadow: 0px 2px 4px rgba(33, 33, 33, 0.16);height: 48px; width: 188px; color: var(--color);background-color: var(--bg-secondary)'
          type='button'
        >
          {{ isFilter === 'All' ? 'Filter by Region' : isFilter }}
          <span class='material-icons-outlined ml-auto'> expand_more </span>
        </button>
        <div aria-labelledby='dropdownMenuButton' class='dropdown-menu'>
          <div class='dropdown-item' @click="filterCountries('All')">All</div>
          <div class='dropdown-item' @click="filterCountries('Africa')">
            Africa
          </div>
          <div class='dropdown-item' @click="filterCountries('Americas')">
            Americas
          </div>
          <div class='dropdown-item' @click="filterCountries('Asia')">Asia</div>
          <div class='dropdown-item' @click="filterCountries('Europe')">
            Europe
          </div>
          <div class='dropdown-item' @click="filterCountries('Oceania')">
            Oceania
          </div>
        </div>
      </div>
    </div>

    <div class='row m-0 mt-4 pt-2 justify-content-between'>
      <slot v-for='(country, index) in allCountries'>
        <div
          :key='index'
          class='col-md-3'
          style='max-width: 303px;min-width: 303px; margin-bottom: 32px'
        >
          <nuxt-link
            v-show='country.show'
            :to='country.name'
            class='p-0'
            style='max-width: 303px;min-width: 303px;'
          >
            <div
              style='
              background-color: var(--bg-secondary);
                max-width: 279px;
                min-width: 279px;
                border: 1px solid #9e9e9e;
                box-shadow: 0px 2px 4px rgba(33, 33, 33, 0.16);
                border-radius: 4px;
              '
            >
              <img
                :src='country.flag'
                class='w-100'
                style='max-height: 160px; min-height: 160px; object-fit: cover'
              />
              <div
                style='
                  padding-left: 28px;
                  padding-top: 22px;
                  padding-bottom: 32px;
                '
              >
                <div class='country__name mb-2'>
                  {{ country.name }}
                </div>
                <div class=''>
                  <span class='country__population--title'> population: </span>
                  <span class='country__population--content'>
                    {{ country.population }}
                  </span>
                </div>
                <div class=''>
                  <span class='country__region--title'> region: </span>
                  <span class='country__region--content'>
                    {{ country.region }}
                  </span>
                </div>
                <div class=''>
                  <span class='country__capital--title'> capital: </span>
                  <span class='country__capital--content'>
                    {{ country.capital }}
                  </span>
                </div>
              </div>
            </div>
          </nuxt-link>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import Fuse from 'fuse.js'

export default {
  data() {
    return {
      countriesTemp: [],
      // allCountries:[],
      countries: [],
      searchInput: '',
      isFilter: 'All'
    }
  },
  fetch({ store, params }) {
    return store.dispatch('countries/fetchData', params)
  },
  computed: {
    allCountries() {
      return this.$store.state.countries.allCountries
      // return this.courseProp
    }
  },
  mounted() {
    for (const country of this.allCountries) {
      country.show = true
    }
    this.$forceUpdate()
    // this.countries = this.deepCopy(this.allCountries)
    // this.getCountries()
  },
  methods: {
    filterCountries(data) {
      this.isFilter = ''
      // this.countries = []
      // if (data === "All"){
      for (const country of this.allCountries) {
        if (data === 'All') {
          country.show = true
        } else if (country.region === data) {
          country.show = true
        } else country.show = false
      }
      // } else {
      this.isFilter = data
      // }
    },
    searchCountry() {
      const options = {
        threshold: 0.3,
        useExtendedSearch: true,
        keys: ['name']
      }
      // let fuse
      // if (this.isFilter){
      // fuse = new Fuse(this.countries, options);
      // } else {
      // this.countries = []
      const fuse = new Fuse(this.allCountries, options)
      // }
      // this.countriesTemp = []
      if (!this.searchInput) {
        for (const country of this.allCountries) {
          country.show = true
        }
      } else {
        for (const item of fuse.search(this.searchInput)) {
          for (const country of this.allCountries) {
            if (item.item.name === country.name) {
              country.show = true
            } else country.show = false
          }
        }
      }
      this.console(fuse.search(this.searchInput), 0)
      // for (const country of this.allCountries){
      //   if (!this.searchInput){
      //     country.show = true
      //   } else{
      //     for (const item of fuse.search(this.searchInput)){
      //       if (item.item.name === country.name){
      //         country.show = true
      //       } else country.show = false
      //     }
      //   }
      // }
      this.$forceUpdate()
      //
      // if (!this.searchInput && this.isFilter === 'All'){
      //   this.countries = this.allCountries
      // } else if (this.searchInput && this.isFilter !== 'All'){
      //   this.countries=this.countriesTemp
      // } else if (this.searchInput && this.isFilter === 'All'){
      //   this.countries=this.countriesTemp
      // }
    }
  }
}
</script>
<style scoped>
::placeholder {
  font-size: 12px;
  color: var(--color);
}

a {
  color: unset;
  text-decoration: none;
}

.country__name {
  font-style: normal;
  font-weight: 800;
  font-size: 14px;
  color: var(--color);
}

.country__population--title,
.country__region--title,
.country__capital--title {
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: var(--color);
}

.country__population--content,
.country__region--content,
.country__capital--content {
  font-weight: 300;
  font-size: 12px;
  line-height: 16px;
  margin-left: 4px;
  color: var(--color-secondary);
}
</style>
