<template>
  <div class='container' style='padding-top: 67px'>
    <nuxt-link to='/'>
      <button
        class='

          btn
          fw-600
          fs-14
          d-flex
          align-items-center
          justify-content-center
        '
        style='
          box-shadow: 0px 1px 8px 4px rgba(33, 33, 33, 0.16);
          border-radius: 4px;
          width: 118px;
          height: 39px;
          margin-top: 52px;
          margin-bottom: 64px;
          background-color: var(--bg-secondary);
          color: var(--color-secondary);
        '
      >
        <span class='material-icons-outlined me-1'> keyboard_backspace </span
        >Back
      </button>
    </nuxt-link>
    <div class='d-flex justify-content-between'>
      <img
        :src='country.flag'
        style='max-width: 581px; max-height: 373px; object-fit: cover'
      />
      <div>
        <div class='country__name'>{{ country.name }}</div>
        <div class='d-flex' style='width: 572px'>
          <div class='col-md-6'>
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
          <div class='col-md-6'>
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
        <div class='mt-5'>
          <div class='row m-0 d-flex align-items-center'>
            <span class='country__borderCountry--title w-auto ps-0'>Border country:</span>
            <slot v-for='(borderCountry, index) in getBordersCountry()'>
              <nuxt-link :key='index' :to='borderCountry' class='w-auto px-1'>
                <button class=' btn me-2 mb-2' style='box-shadow: 0px 1px 8px 4px rgba(33, 33, 33, 0.16);
border-radius: 4px;min-width: 99px;min-height:39px;background-color: var(--bg-secondary);
          color: var(--color-secondary);'>
                  {{ borderCountry }}
                </button>
              </nuxt-link>
            </slot>
          </div>

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
    const obj = this.allCountries.find(
      (o) => o.name === this.$route.params.slug
    )
    this.console(this.$route.params.slug, obj)
    this.country = obj
  },
  methods: {
    getBordersCountry() {
      const array = []
      this.console(this.country, this.country.borders, '3')
      if (this.country.borders) {
        for (const code of this.country.borders) {
          const obj = this.allCountries.find((o) => o.alpha3Code === code)
          array.push(obj.name)
        }
      }

      this.console(array, 2)

      return array
    }
  }
}
</script>

<style scoped>
a {
  color: unset;
  text-decoration: none;
}

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
</style>
