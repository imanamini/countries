<template>
  <div>
    <Header />
    <Nuxt />
  </div>
</template>

<script>
import Header from '../components/Header'
export default {
  components: { Header },
  layout: 'default',
  mounted() {
    this.$nuxt.$colorMode.preference = ''
  },
}
</script>

<style scoped></style>
