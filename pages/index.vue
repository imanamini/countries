<template>
  <div class='container'>
    <div class='w-100 d-flex'>
      <div>
        <span class="material-icons-outlined">
search
</span>
        <input v-model='searchInput' style='border: unset' placeholder='search' @keyup='searchCountry()'/>
      </div>
      <div class="dropdown ml-auto">
        <button id="dropdownMenuButton" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{isFilter === 'All' ? 'Filter by Region' : isFilter}}
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


    </div>

    <div class='row m-0'>
      <slot v-for='(country,index) in allCountries'>
        <nuxt-link v-show='country.show' class='mr-4' :to='country.name'>
          <div :key='index' style='border: 1px solid #9e9e9e; width: 200px'>
            <img width='100' :src='country.flag' />
            <div class='fs-20'>
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
    for (const country of this.allCountries){
      country.show = true
    }
    this.$forceUpdate()
    // this.countries = this.deepCopy(this.allCountries)
    // this.getCountries()
  },
  methods:{
    filterCountries(data){
      this.isFilter = ''
      // this.countries = []
      // if (data === "All"){
        for (const country of this.allCountries){
          if (data === "All"){
            country.show = true
          } else if (country.region === data){
            country.show = true
          } else country.show = false
        }
      // } else {
        this.isFilter = data
      // }
    },
    searchCountry(){
      const options = {
        threshold: 0.3,
        useExtendedSearch: true,
        keys: [
          "name"
        ]
      };
      // let fuse
      // if (this.isFilter){
         // fuse = new Fuse(this.countries, options);
      // } else {
        // this.countries = []
        const fuse = new Fuse(this.allCountries, options);
      // }
      // this.countriesTemp = []
      if (!this.searchInput){
        for (const country of this.allCountries){
          country.show = true
        }
      } else {
        for ( const item of fuse.search(this.searchInput)){
          for (const country of this.allCountries){
            if (item.item.name === country.name){
              country.show = true
            } else country.show = false
          }
        }
      }
      this.console(fuse.search(this.searchInput),0)
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
    },
  }
}
</script>
