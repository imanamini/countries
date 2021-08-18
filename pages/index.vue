<template>
  <div>
    <div class="dropdown">
      <button id="dropdownMenuButton" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {{isFilter}}
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <div class="dropdown-item" @click='filterCountries("All")'>All</div>
        <div class="dropdown-item" @click='filterCountries("Africa")'>Africa</div>
        <div class="dropdown-item" @click='filterCountries("Americas")'>Americas</div>
        <div class="dropdown-item" @click='filterCountries("Asia")'>Asia</div>
        <div class="dropdown-item" @click='filterCountries("Europe")'>Europe</div>
        <div class="dropdown-item" @click='filterCountries("Oceania")'>Oceania</div>
      </div>
    </div>
    <input v-model='searchInput' @keyup='searchCountry()'/>
    <div class='row'>
      <slot v-for='(country,index) in countries'>
        <nuxt-link :to='country.name'>
          <div :key='index' style='border: 1px solid #9e9e9e; width: 200px'>
            <img width='100' :src='country.flag' />
            <div>
              {{country.name}}
            </div>
            <div>
          <span>
            population:
          </span>
              <span>
            {{ country.population }}
          </span>
            </div>
            <div>
          <span>
            region:
          </span>
              <span>
            {{ country.region }}
          </span>
            </div>
            <div>
          <span>
            capital:
          </span>
              <span>
            {{ country.capital }}
          </span>
            </div>
          </div>

        </nuxt-link>
      </slot>
    </div>
  </div>

</template>

<script>
import Fuse from 'fuse.js'
export default {
  data(){
    return {
      countriesTemp:[],
      // allCountries:[],
      countries:[],
      searchInput:'',
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
    },
  },
  mounted() {
    this.countries = this.deepCopy(this.allCountries)
    // this.getCountries()
  },
  methods:{
    filterCountries(data){
      this.isFilter = ''
      // this.countriesTemp = []
      this.countries = []
      if (data === "All"){
        this.countries = this.allCountries
      } else {
        for (const country of this.allCountries){
          if (country.region === data){
            this.countries.push(country)
          }
        }
        this.isFilter = data
      }
      // this.countries.data=this.countriesTemp
    },
    searchCountry(){
      const options = {
        // isCaseSensitive: true,
        // includeScore: true,
        // shouldSort: true,
        // includeMatches: true,
        // findAllMatches: true,
        // minMatchCharLength: 3,
        // location: 1,
        threshold: 0.2,
        // distance: 100,
        useExtendedSearch: true,
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
        keys: [
          "name"
        ]
      };
      let fuse
      if (this.isFilter){
         fuse = new Fuse(this.countries, options);
      } else {
        this.countries = []
        fuse = new Fuse(this.allCountries, options);
      }

      // this.categories.data = []
      this.countriesTemp = []
      for (const item of fuse.search(this.searchInput)){
        // this.console(item,'f')
        this.countriesTemp.push(item.item)
      }
      if (!this.searchInput && this.isFilter === 'All'){
        this.countries = this.allCountries
      } else if (!this.searchInput && this.isFilter !== 'All'){
        // this.countries.data=this.countriesTemp
        this.console('1')
      }else if (this.searchInput && this.isFilter !== 'All'){
        this.countries=this.countriesTemp
        this.console('1')
      } else if (this.searchInput && this.isFilter === 'All'){
        this.countries=this.countriesTemp
      }
      this.console(fuse.search(this.searchInput),this.allCountries.data,this.countriesTemp,this.countries.data)
      // this.countriesTemp = fuse.search(this.searchInput)
      // return fuse.search(this.searchInput)
    },
    getCountries() {
      this._axios()({
        url: '/api/all',
        method: 'get',
      })
        .then((response) => {
          if (response) {
            this.allCountries = response
            this.countries = this.deepCopy(this.allCountries)
          }
        })
        .catch((error) => {
          this.console(error)
        })
    },
  }
}
</script>
