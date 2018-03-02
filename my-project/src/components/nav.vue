<template>
  <nav>
    <div class="nav">
      <ul>
        <li><router-link to="/" tag="li">logo</router-link></li>
        <li><router-link to="/" tag="li" exact-active-class="nav-click">首页</router-link></li>
        <li><router-link to="/message" tag="li" exact-active-class="nav-click">攻略</router-link></li>
        <li><router-link to="/map" tag="li" exact-active-class="nav-click">景点</router-link></li>
        <li><router-link to="/share" tag="li" exact-active-class="nav-click">分享</router-link></li>
      </ul>
      <div class="box-login">
        <form name="search">
          <input type="text" :placeholder="holder" id="search" v-model="city"
                 autocomplete="off" @focus="searchFocus = true" @blur="sFocus">
          <button type="button" @click="search" >查找</button>
          <div class="search-city" v-show="searchFocus">
            <span v-for="list in cityList" @click="choiceCity(list)">{{list}}</span>
          </div>
        </form>
        <ul class="nav-login" v-if="username == null||username == ''">
          <li><a @click="click_login">登录</a></li>
          <li style="width: 50px;"><a href="register.html" target="_blank">注册</a></li>
        </ul>
        <ul class="nav-login welcome" v-else>
          <li style="width: 90px;" v-if="username.length>6"><span>欢迎</span>{{ username.substr(0,3) + '..' }}</li>
          <li style="width: 90px;" v-else><span>欢迎</span>{{ username }}</li>
          <li @click="outlog">退出</li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'travelNav',
  data () {
    return {
      holder: '搜索地区景点、用户',
      city: '',
      searchFocus: false,
      cityList: ['北京', '上海', '广州', '天津']
    }
  },
  props: ['username'],
  methods: {
    sFocus: function () {
      let _this = this
      setTimeout(function () {
        _this.searchFocus = false
      }, 100)
    },
    choiceCity: function (city) {
      this.city = city
      console.log('click')
    },
    search: function () {
      var city = this.city
      console.log(city)
      if (city === '') {
        console.log('city null')
        return
      }
      this.$http.get('/api/attraction/selectCity', {
        params: {
          city: city
        }
      }).then((res) => {
        console.log(res)
      }, (error) => {
        console.log(error)
      })
    },
    click_login: function () {
      this.$emit('click-login')
    },
    outlog: function () {
      var r = confirm('确认退出吗')
      if (r) {
        console.log('out ' + this.username)
        sessionStorage.removeItem('username')
        console.log('out ' + sessionStorage.getItem('username'))
        this.$emit('outlog', this.username)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
nav{
  font-size:18px;
  min-width: 930px;
  background: #fff;
  border-bottom:1px solid #bfbfbf ;
}
.nav-click{
  background: #71caa2;
  color: #fff;
}
.nav{
  width: 880px;
  margin: 0 auto;
}
.nav-login{
  font-size: 15px;
}
.box-login{
  float: right;
}
.welcome span{
  font-size: 13px;
  color: #42b983;
  margin-right: 7px;
}
ul {
  display: inline-block;
  list-style-type: none;
  padding: 0;
  margin: 0;
}
li {
  line-height: 54px;
  width: 75px;
  text-align: center;
  color: #000;
  display: inline-block;
}
form{
  display: inline-block;
  margin-right: 5px ;
  top: 1px;
}
input{
  height: 27px;
  width: 204px;
  padding-left: 4px;
  top: -2px;
  border: 1px solid #bfbfbf;
  outline: none;
  z-index: 10;
}
.search-city{
  z-index: 9;
  position: absolute;
  top: 26px;
  border: 1px solid #71caa2;
  border-top: none;
  width: 208px;
  background-color: white;
}
.search-city span{
  display: block;
  padding: 7px 10px;
  width: 90%;
  line-height: 15px;
  font-size: 15px;
  color: #71caa2;
}
button{
  border: 1px solid #bfbfbf;
  background: #fff;
  position: absolute;
  height: 29px;
  width: 40px;
  padding: 0 3px;
  right: 0;
  top: -2px;
  z-index: 11;
}

a {
  color: #42b983;
  text-decoration: none
}
</style>
