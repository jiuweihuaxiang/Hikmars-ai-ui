<template>
  <div id="app">
    <img src="./assets/logo.png">
    <!-- <HelloWorld/> -->
    <ai-button>hikmars按钮</ai-button>
    <br>
    <recognition></recognition>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld'
import Recognition from './examples/recognition-visualize/recognition.vue'
export default {

  name: 'App',
  components: {
    // HelloWorld
    Recognition
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
