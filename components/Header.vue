<template>
  <div class='w-100 position-fixed'
       style='box-shadow: 0 2px 4px rgba(33, 33, 33, 0.16);z-index: 100; height: 67px; top: 0;background-color: var(--bg-secondary)'>

    <div
      class=' d-flex  align-items-center h-100 container pt-0'

    >
      <div class='fw-800 fs-14' style='color: var(--color)'>Where in the world?</div>
      <button
        class='ml-auto fs-12 fw-600 btn align-items-center d-flex'
        style='color: var(--color)'
        @click='changeModeColor()'
      >
        <span class='material-icons-outlined fs-14 me-1'> dark_mode </span>
        Dark mode
      </button>
    </div>
  </div>

</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      darkMode: false
    }
  },
  methods: {
    changeModeColor() {
      if (this.darkMode) {
        this.$nuxt.$colorMode.preference = ''
        this.darkMode = false
      } else {
        this.$nuxt.$colorMode.preference = 'dark'
        this.darkMode = true
      }
    }
  }
}
</script>

<style scoped></style>
