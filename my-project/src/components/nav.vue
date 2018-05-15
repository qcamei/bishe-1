<template>
  <nav>
    <div class="nav">
      <ul>
        <router-link to="/" tag="li">logo</router-link></li>
        <router-link to="/" tag="li" exact-active-class="nav-click">首页</router-link></li>
        <router-link to="/article" tag="li" exact-active-class="nav-click">攻略</router-link></li>
        <router-link to="/attraction" tag="li" exact-active-class="nav-click">景点</router-link></li>
        <router-link to="/user" tag="li" exact-active-class="nav-click">分享</router-link></li>
      </ul>
      <div class="box-login">
        <div class="search" >
          <input type="text" :placeholder="holder" id="search" v-model="city" autocomplete="off"
                 @focus="cityListFocus = true"  @blur="sFocus" @keydown="keyspan" v-focus="cityStatus == -1">
          <button type="button" @click="searchClick" >查找</button>
          <div class="search-city" v-show="cityListFocus">
            <span v-for="(list,index) in cityList" @click="choiceCity(list)" v-focus="cityStatus == index"
                  :class="{'search-focus': cityStatus == index}">{{list.attraction + ' ' + list.city}}</span>
          </div>
        </div>
        <ul class="nav-login" v-if="username == null||username == ''">
          <li><a @click="click_login">登录</a></li>
          <li style="width: 50px;"><a href="register.html#/1" target="_blank">注册</a></li>
        </ul>
        <ul class="nav-login welcome" v-else>
          <router-link style="width: 90px;" v-show="username.length>6" to="/user" ><span>欢迎</span>{{ username.substr(0,3) + '..' }}</router-link>
          <router-link style="width: 90px;" v-show="username.length<=6" to="/user"><span>欢迎</span>{{ username }}</router-link>
          <li @click="outlog">退出</li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import _ from 'lodash.debounce'
export default {
  name: 'travelNav',
  props: ['username', 'searchType'],
  data () {
    return {
      holder: '搜索地区景点、攻略',
      city: '',
      cityListFocus: false,
      cityStatus: -1,
      cityList: [],
      searchTypeList: true
    }
  },
  watch: {
    city: function () {
      this.getCityList()
      this.cityListFocus = true
    }
  },
  methods: {
    getCityList: _(
      function () {
        var city = this.city
        if (city === '') {
          return
        }
        this.$http.get('/api/attraction/selectCity', {
          params: {
            city: city
          }
        }).then((res) => {
          if (res.data === -1) {
            this.cityList = []
          } else {
            this.cityList = res.data
            this.cityListFocus = true
            console.log(this.cityList)
          }
        })
      }, 500, {'MAXWAIT': 1000}),
    keyspan: function (e) {
      var length = this.cityList.length
      if (e.keyCode === 38) { // up
        if (this.cityStatus === 0) {
          this.cityStatus = -1
        } else if (this.cityStatus === -1) {
          this.cityStatus = length - 1
        } else {
          this.cityStatus = (this.cityStatus + length - 1) % length
        }
      } else if (e.keyCode === 40) { // down
        this.cityStatus = (this.cityStatus + 1) % length
      } else if (e.keyCode === 13) { // enter
        if (this.cityStatus === -1) {
          console.log('search')
          if (this.city === '') {
            this.toAttraction({attraction: '', city: ''})
          } else {
            console.log('enter' + this.city)
            this.$router.push({path: '/city/' + this.city})
          }

        } else {
          this.toAttraction(this.cityList[this.cityStatus])
        }
        // this.cityStatus = -1
      }
      // this.city = this.cityList[this.cityStatus].attraction
      // console.log(this.cityList[this.cityStatus])
    },
    toAttraction: function (value) {
      this.$router.push({path: '/attraction/' + value.attraction})
      this.$emit('send-city', value)
    },
    sFocus: function () {
      let _this = this
      setTimeout(function () {
        _this.cityListFocus = false
        _this.cityStatus = -2
      }, 100)
    },
    choiceCity: function (city) {
      console.log(city)
      this.toAttraction(city)
    },
    searchClick: function () {
      var city = this.city
      if (city === '') {
        alert('请输入查找内容')
      } else {
        this.$router.push({path: '/city/' + city})
      }
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
  },
  directives: {
    focus: {
      update: function (el, {value}) {
        if (value) {
          el.focus()
        }
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
  border-bottom: #d6d6d6 1px solid;
  box-shadow: 0 2px 5px rgba(0,0,0,0.12)
}
.search-focus{
  background-color: #71caa2;
  color: #fff;
}
.nav-click{
  background: #71caa2;
  box-shadow: 0 2px 5px #88d0af;
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
  z-index: 10;
}
li {
  line-height: 54px;
  width: 75px;
  text-align: center;
  color: #000;
  display: inline-block;
}
.search{
  display: inline-block;
  margin-right: 5px ;
  top: 1px;
}
.search-type{
  position: absolute;
  font-size: 15px;
}
.search-type span{
  position: absolute;
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
  color: #71caa2;
}
.search-city span{
  display: block;
  padding: 7px 10px;
  line-height: 15px;
  font-size: 15px;
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
