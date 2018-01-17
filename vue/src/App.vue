<template>
  <div id="app" class="container">
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
     name: 'app'
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

  body{
    background: #f1f1f1;
  }
</style>
