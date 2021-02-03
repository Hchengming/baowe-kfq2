<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    localStorage.setItem('country', '梁平区')
  }
}
</script>

<style>
#app {
  height: 100vh;
}
</style>
