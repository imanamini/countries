<template>
<button @click='changeModeColor()'>
  dark mode
  <span class="material-icons-outlined">
dark_mode
</span>
</button>
</template>

<script>
export default {
  name: 'Header',
  data(){
    return{
      darkMode: false
    }
  },
  methods:{
    changeModeColor(){
      if (this.darkMode){
        this.$nuxt.$colorMode.preference = ''
        this.darkMode = false
      } else{
        this.$nuxt.$colorMode.preference = 'dark'
        this.darkMode = true
      }

    }
  }
}
</script>

<style scoped>

</style>
