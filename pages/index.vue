<template>
  <div class='container mt-4'>
    <div class='w-100 row m-0 searchFilter'>
      <div
        class='d-flex align-items-center me-auto mb-5 mb-md-0 searchFilter__search px-0'
      >
        <span
          class='material-icons-outlined searchFilter__search__icon'
        >
          search
        </span>
        <input
          v-model='searchInput'
          class='ml-4 h-100 w-100 searchFilter__search__input'
          placeholder='Search for a country...'
        />
      </div>
      <div class='dropdown px-0 searchFilter__filter__dropdown'>
        <button
          id='dropdownMenuButton'
          aria-expanded='false'
          aria-haspopup='true'
          class='searchFilter__filter__dropdown__button fs-12 align-items-center d-flex ps-4 pe-3 w-100'
          data-bs-toggle='dropdown'
          data-toggle='dropdown'
          type='button'
        >
          {{ isFilter === 'All' ? 'Filter by Region' : isFilter }}
          <span class='material-icons-outlined ms-auto'> expand_more </span>
        </button>
        <ul aria-labelledby='dropdownMenuButton' class='searchFilter__filter__dropdown__menu dropdown-menu py-0 mt-1'>
          <li class='dropdown-item' @click="filterCountries('All')">All</li>
          <li class='dropdown-item' @click="filterCountries('Africa')">
            Africa
          </li>
          <li class='dropdown-item' @click="filterCountries('Americas')">
            Americas
          </li>
          <li class='dropdown-item' @click="filterCountries('Asia')">Asia</li>
          <li class='dropdown-item' @click="filterCountries('Europe')">
            Europe
          </li>
          <li class='dropdown-item' @click="filterCountries('Oceania')">
            Oceania
          </li>
        </ul>
      </div>
    </div>
    <div class='countries row m-0 mt-4 pt-2 justify-content-between'>
      <slot v-for='(country, index) in allCountries'>
        <div
          v-if='country.show'
          :key='index'
          class='col-md-3 col-12 country__card'
        >
          <nuxt-link
            :to='country.name'
            class='p-0 w-100'
          >
            <div
              class='country__card__content'
            >
              <img
                :alt='country.name'
                :src='country.flag'
                class='w-100 country__card__content__flag'
              />
              <div
                class='country__card__content__attributes'
              >
                <div class='country__name mb-2'>
                  {{ country.name }}
                </div>
                <div>
                  <span class='country__population--title'> Population: </span>
                  <span class='country__population--content'>
                    {{ country.population }}
                  </span>
                </div>
                <div>
                  <span class='country__region--title'> Region: </span>
                  <span class='country__region--content'>
                    {{ country.region }}
                  </span>
                </div>
                <div>
                  <span class='country__capital--title'> Capital: </span>
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
    }
  },
  watch: {
    /**
     * Search between countries
     *
     * After each change in {searchInput}, call this function to search in countries
     *
     **/
    searchInput() {
      const options = {
        threshold: 0.2,
        useExtendedSearch: true,
        keys: ['name']
      }
      const fuse = new Fuse(this.allCountries, options)
      this.countriesTemp = []
      let countriesTempIndex = []
      if (!this.searchInput) {
        if (this.isFilter !== 'All') {
          this.filterCountries(this.isFilter)
        } else {
          for (const country of this.allCountries) {
            country.show = true
          }
        }
      } else {
        for (const item of fuse.search(this.searchInput)) {
          this.countriesTemp.push(item)
        }
        countriesTempIndex = this.countriesTemp.map((obj) => obj.refIndex)
        if (this.countriesTemp) {
          for (let i = 0; i < this.allCountries.length; i++) {
            if (countriesTempIndex.includes(i) && this.allCountries[i].show) {
              this.allCountries[i].show = true
            } else if (!countriesTempIndex.includes(i)) {
              this.allCountries[i].show = false
            }
          }
        }
      }
      this.$forceUpdate()
    }
  },
  mounted() {
    for (const country of this.allCountries) {
      country.show = true
    }
    this.$forceUpdate()
  },
  methods: {
    /**
     * Filter countries by region
     *
     * @param region {String}
     */
    filterCountries(region) {
      this.isFilter = ''
      for (const country of this.allCountries) {
        if (region === 'All') {
          country.show = true
        } else country.show = country.region === region
      }
      this.isFilter = region
    }
  }
}
</script>
<style scoped>
@media screen and (max-width: 414px) {
  .countries {
    justify-content: center !important;
  }
}

::placeholder {
  font-size: 12px;
  color: var(--color);
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

.searchFilter {
  padding-left: 12px;
  padding-right: 12px;
}

.searchFilter__search {
  background-color: var(--bg-secondary);
  height: 48px;
  width: 335px;
  box-shadow: 0 2px 4px rgba(33, 33, 33, 0.16);
  border-radius: 4px;
}

.searchFilter__search__icon {
  margin-left: 32px;
  color: #9e9e9e;
}

.searchFilter__search__input {
  border: unset;
  outline: none;
  background-color: var(--bg-secondary);
}

.searchFilter__filter__dropdown {
  width: 188px;
}

.searchFilter__filter__dropdown__button {
  border: unset;
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(33, 33, 33, 0.16);
  height: 48px;
  color: var(--color);
  background-color: var(--bg-secondary);
}

.searchFilter__filter__dropdown__menu {
  min-width: 188px;
  box-shadow: 0px 2px 4px rgba(33, 33, 33, 0.16);
  border: unset;
}

.dropdown-item {
  font-size: 12px;
  cursor: pointer;
}

.country__card {
  max-width: 303px;
  min-width: 303px;
  margin-bottom: 32px;
}

.country__card__content {
  background-color: var(--bg-secondary);
  max-width: 279px;
  min-width: 279px;
  box-shadow: 0 2px 4px rgba(33, 33, 33, 0.16);
  border-radius: 4px;
}

.country__card__content__flag {
  max-height: 160px;
  min-height: 160px;
  border-radius: 4px 4px 0 0;
  object-fit: cover;
}

.country__card__content__attributes {
  padding-left: 28px;
  padding-top: 22px;
  padding-bottom: 32px;
}
</style>
