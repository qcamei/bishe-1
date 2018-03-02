<template>
  <div id="app">
    <router-view name="NotFound"></router-view>
    <router-view :username="username" @click-login="clickLogin" @outlog="outlog"></router-view>
    <router-view name="foot"></router-view>
    <router-view name="mySwiper"></router-view>
    <router-view name="publicity"></router-view>
    <keep-alive>
      <router-view name="Map"></router-view>
    </keep-alive>
    <router-view name="login" v-if="!showLogin" @have-login="login" ></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  props: '',
  data () {
    return {
      showLogin: true,
      username: sessionStorage.getItem('username')
    }
  },
  methods: {
    login: function (username) {
      this.showLogin = true
      if (username === undefined) {
        return
      }
      this.username = username
      console.log(username)
    },
    clickLogin: function () {
      this.showLogin = false
    },
    outlog: function () {
      this.username = ''
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', 微软雅黑, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin:0;
  background: #f3f3f3;
  min-height: 1020px;
}

</style>
