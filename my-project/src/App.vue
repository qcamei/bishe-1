<template>
  <div id="app">
    <router-view name="NotFound"></router-view>
    <router-view :username="username" @click-login="clickLogin"
                 @outlog="outlog" @send-city="resolveCity"></router-view>
    <router-view name="mySwiper"></router-view>
    <router-view name="publicity"></router-view>
    <router-view name="attraction" :citysearch="citysearch"></router-view>
    <router-view name="attraction1" :citysearch="citysearch"></router-view>
    <keep-alive><router-view name="city1"></router-view></keep-alive>
    <router-view name="indexguide"></router-view>
    <router-view name="attraction2" :username="username"></router-view>
    <router-view name="guide" :username="username"></router-view>
    <keep-alive><router-view name="user" :username="username" @click-login="clickLogin"></router-view></keep-alive>
    <router-view name="foot"></router-view>
    <router-view name="login" v-if="!showLogin" @have-login="login"></router-view>
    <a class="to-top" @click="totop"><img src="/static/img/top.png"></a>
    <a class="to-top flipy" href="#foot"><img src="/static/img/top.png"></a>
  </div>
</template>

<script>
export default {
  name: 'app',
  props: '',
  data () {
    return {
      showLogin: true,
      username: sessionStorage.getItem('username'),
      citysearch: '',
      searchType: 'city'
    }
  },
  methods: {
    resolveCity: function (value) {
      console.log(value.anum, 'asdasd')
      this.citysearch = value
    },
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
    },
    totop: function () {
      scroll(0, 0)
    }
  },
  mounted () {
    console.log('App.vue')
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
ul {
  list-style-type: none;
}
.to-top{
  border: 1px solid #5a5757;
  border-radius: 2px;
  outline: none;
  color: #42b983;
  position: fixed;
  width: 43px;
  height: 43px;
  bottom: 120px;
  right: 20px;
  z-index: 10;
}
.to-top>img,.to-down>img{
  width: 100%;
  height: 100%;
}

.flipy {
  -moz-transform:scaleY(-1);
  -webkit-transform:scaleY(-1);
  -o-transform:scaleY(-1);
  transform:scaleY(-1);
  /*IE*/
  filter:FlipV;
  bottom: 70px;
}
</style>
