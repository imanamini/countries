<template>
  <div class='container'>
    <nuxt-link to='/'>
      <button
        class='
          btn
          fw-600
          fs-14
          d-flex
          align-items-center
          justify-content-center
          btnReturn
        '
      >
        <span class='material-icons-outlined me-1'> keyboard_backspace </span
        >Back
      </button>
    </nuxt-link>
    <div class='row m-0 justify-content-between'>
      <div class=' col-lg-6 col-12 pe-lg-5 px-0 mb-5 mb-lg-0'>
        <img
          :alt='country.name'
          :src='country.flag'
          class='country__flag shadow'
        />
      </div>

      <div class='col-lg-6 col-12 px-0 px-lg-5'>
        <div class='country__name'>{{ country.name }}</div>
        <div class='row m-0'>
          <div class='col-md-6 px-0'>
            <div>
              <span class='country__nativeName--title'>Native Name:</span>
              <span class='country__nativeName--content'>{{ country.nativeName }}</span>
            </div>
            <div>
              <span class='country__population--title'>Population:</span>
              <span class='country__population--content'>{{ country.population }}</span>
            </div>
            <div>
              <span class='country__region--title'>Region:</span>
              <span class='country__region--content'>{{ country.region }}</span>
            </div>
            <div>
              <span class='country__subRegion--title'>Sub region:</span>
              <span class='country__subRegion--content'>{{ country.subregion }}</span>
            </div>
            <div>
              <span class='country__capital--title'>Capital:</span>
              <span class='country__capital--content'>{{ country.capital }}</span>
            </div>
          </div>
          <div class='col-md-6 px-0'>
            <div>
              <span class='country__topLevelDomain--title'>Top level domain:</span>
              <slot v-for='(topLevelDomain,index) in country.topLevelDomain'>
                <span :key='index' class='country__topLevelDomain--content'>{{ topLevelDomain }}</span>
              </slot>
            </div>
            <div>
              <span class='country__currencies--title'>Currencies:</span>
              <span v-if='country.currencies' class='country__currencies--content'>{{
                  country.currencies[0].name
                }}</span>
            </div>
            <div>
              <span class='country__languages--title'>Languages:</span>
              <slot v-for='(language, index) in country.languages'>
                <span :key='index' class='country__languages--content'>{{ language.name }}</span>
              </slot>
            </div>
          </div>
        </div>
        <div class='row m-0 mt-5 d-flex align-items-center'>
          <span class='country__borderCountry--title w-auto ps-0'>Border country:</span>
          <slot v-for='(borderCountry, index) in getBordersCountry()'>
            <nuxt-link :key='index' :to='borderCountry' class='w-auto px-1'>
              <button class='btnBorderCountry btn me-2 mb-2'>
                {{ borderCountry }}
              </button>
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
  data() {
    return {
      country: {}
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
  mounted() {
    this.country = this.allCountries.find(
      (o) => o.name === this.$route.params.slug
    )
  },
  methods: {
    /**
     * Show country name in border country
     *
     * @return {Array} for show border country button
     */
    getBordersCountry() {
      const borderCountry = []
      if (this.country.borders) {
        for (const code of this.country.borders) {
          const obj = this.allCountries.find((o) => o.alpha3Code === code)
          borderCountry.push(obj.name)
        }
      }
      return borderCountry
    }
  }
}
</script>

<style scoped>
.country__capital--title, .country__currencies--title, .country__languages--title, .country__region--title, .country__subRegion--title, .country__topLevelDomain--title, .country__nativeName--title, .country__population--title, .country__borderCountry--title {
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 8px;
  color: var(--color);
}

.country__population--content, .country__topLevelDomain--content, .country__capital--content, .country__currencies--content, .country__languages--content, .country__nativeName--content, .country__region--content, .country__subRegion--content {
  font-weight: 300;
  font-size: 16px;
  line-height: 22px;
  color: var(--color-secondary);
}

.country__name {
  font-weight: 800;
  font-size: 24px;
  line-height: 33px;
  margin-bottom: 28px;
  color: var(--color);
}

.btnReturn {
  box-shadow: 0 1px 8px 4px rgba(33, 33, 33, 0.16);
  border-radius: 4px;
  width: 118px;
  height: 39px;
  margin-top: 52px;
  margin-bottom: 64px;
  background-color: var(--bg-secondary);
  color: var(--color-secondary);
}

.country__flag {
  /*border: 1px solid var(--border-color);*/
  max-width: 100%;
  object-fit: contain;
}

.row > .col-md-6 > div {
  margin-bottom: 8px;
}

.btnBorderCountry {
  box-shadow: 0 1px 8px 4px rgba(33, 33, 33, 0.16);
  border-radius: 4px;
  min-width: 99px;
  min-height: 39px;
  background-color: var(--bg-secondary);
  color: var(--color-secondary);
}
</style>
