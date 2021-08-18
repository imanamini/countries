<template>
<div>
  <nuxt-link to='/'>
    <button>
      back
    </button>
  </nuxt-link>
  <div class='d-flex'>
    <img width='200' :src='country.flag'/>
    <div>
      <div>{{country.name}}</div>
      <div class='d-flex'>
        <div>
          <div>
            <span>Native Name:</span> <span>{{country.nativeName}}</span>
          </div>
          <div>
            <span>Population:</span>
            <span>{{country.population}}</span>
          </div>
          <div>
            <span>Region:</span>
            <span>{{country.region}}</span>
          </div>
          <div>
            <span>Sub region:</span>
            <span>{{country.subregion}}</span>
          </div>
          <div>
            <span>Capital:</span>
            <span>{{country.capital}}</span>
          </div>
        </div>
        <div>
          <div>
            <span>Top level domain:</span>
            <span>{{country.topLevelDomain}}</span>
          </div>
          <div>
            <span>Currencies:</span>
            <span v-if='country.currencies'>{{country.currencies[0].name}}</span>
          </div>
          <div>
            <span>Languages:</span>
            <slot v-for='(language,index) in country.languages'>
              <span :key='index'>{{language.name}}</span>
            </slot>
          </div>
        </div>
      </div>
      <div>
        <span>Border country:</span>
        <slot v-for='(borderCountry,index) in getBordersCountry()'>
            <nuxt-link :key='index' :to='borderCountry'>
              {{borderCountry}}
            </nuxt-link>
        </slot>
      </div>

    </div>
  </div>

</div>
</template>

<script>
export default {
  name: 'Index',
  data(){
    return{
      country: {}
    }
  },
  fetch({ store, params }) {
    return store.dispatch('countries/fetchData', params)
  },
  computed: {
    allCountries() {
      return this.$store.state.countries.allCountries
    },
  },
  mounted() {
    const obj = this.allCountries.find(o => o.name === this.$route.params.slug);
    this.console(this.$route.params.slug,obj)
    this.country = obj
  },
  methods:{
    getBordersCountry(){
      const array = []
      this.console(this.country,this.country.borders,'3')
      if (this.country.borders){
        for (const code of this.country.borders){
          const obj = this.allCountries.find(o => o.alpha3Code === code);
          array.push(obj.name)
        }
      }

      this.console(array,2)

      return array
    }
  }
}
</script>

<style scoped>

</style>
