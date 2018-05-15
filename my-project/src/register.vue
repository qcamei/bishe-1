<template>
  <div class="container">
    <div class="title"></div>
    <div class="register">
      <form>
        <input type="text" name="username" placeholder="用户名" @blur="checkUsername"
               v-model="username" @input="focusName">
        <label v-bind:class="{wrong: nameColor}">{{ usernameTips}}</label>
        <input type="password" name="old" placeholder="旧密码" @blur="checkOld"
               v-model="oldpassword" @input="focusOld" v-if="modify == true">
        <label v-bind:class="{wrong: oldColor}" v-show="modify == true && oldColor == true">{{ oldTips }}</label>
        <input type="password" name="password" placeholder="密码" @blur="checkPassword"
               v-model="password" @input="focusPassword">
        <label v-bind:class="{wrong: passwordColor}">{{ passwordTips }}</label>
        <input type="password" name="password2" placeholder="确认密码" @blur="checkPassword2"
               v-model="password2" @input="focusPassword2">
        <label v-bind:class="{wrong: password2Color}">{{ password2Tips }}</label>
        <a href="javascript:;" @click="submitInfo" v-if="modify == false">注册</a>
        <a href="javascript:;" @click="submitInfo" v-else>修改密码</a>
      </form>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'register',
      data () {
        return {
          modify: false,
          nameColor: false,
          oldColor: false,
          passwordColor: false,
          password2Color: false,
          username: '',
          oldpassword: '',
          password: '',
          password2: '',
          user_right: false,
          password_right: false,
          password2_right: false,
          oldTips: '',
          usernameTips: '长度2~14位',
          passwordTips: '长度6~14位',
          password2Tips: ''
        }
      },
      methods: {
        focusName: function () {
          this.usernameTips = '长度2~14位,不包含空格'
          this.nameColor = false
        },
        focusOld: function () {
          this.oldTips = '请输入旧密码'
          this.oldColor = false
        },
        focusPassword: function () {
          this.passwordTips = '长度6~14位,不包含空格'
          this.passwordColor = false
        },
        focusPassword2: function () {
          this.password2Tips = ''
          this.password2Color = false
        },
        checkUsername: function () {
          if (this.modify === false) {
            if (this.username === '') {
              this.nameColor = true
              this.usernameTips = '用户名不能为空'
            } else if (this.username.length < 2) {
              this.nameColor = true
              this.usernameTips = '长度小于2'
            } else {
              this.$http.post('/api/user/addUser', {
                type: 'name',
                username: this.username
              }).then((res) => {
                console.log(res)
                this.nameColor = res.data.nameColor
                this.usernameTips = res.data.usernameTips
              })
            }
          } else {
            if (this.username === '') {
              this.nameColor = true
              this.usernameTips = '用户名不能为空'
            } else {
              this.$http.post('/api/user/checkUser', {
                type: 'name',
                username: this.username
              }).then((res) => {
                console.log(res)
                this.nameColor = res.data.nameColor
                this.usernameTips = res.data.usernameTips
              })
            }
          }
        },
        checkOld: function () {
          if (this.oldpassword === '') {
            this.oldColor = true
            this.oldTips = '密码不能为空'
          } else {
            this.oldColor = false
          }
        },
        checkPassword: function () {
          if (this.password === '') {
            this.passwordColor = true
            this.passwordTips = '密码不能为空'
          } else if (this.password.length < 6) {
            this.passwordColor = true
            this.passwordTips = '长度小于6'
          } else {
            this.$http.post('/api/user/addUser', {
              type: 'password',
              password: this.password
            }).then((res) => {
              console.log(res)
              this.passwordColor = res.data.passwordColor
              this.passwordTips = res.data.passwordTips
            })
          }
        },
        checkPassword2: function () {
          if (this.password === '') {
            this.password2Color = true
            this.password2Tips = '请先输入密码再进行确认'
          } else if (this.password2 === '') {
            this.password2Color = true
            this.password2Tips = '请确认密码'
          } else {
            if (this.password === this.password2) {
              if (this.passwordColor) {
                this.password2Color = true
                this.password2Tips = '请确认上方密码格式正确'
              } else {
                this.password2Color = false
                this.password2Tips = '密码一致'
              }
            } else {
              this.password2Color = true
              this.password2Tips = '密码不一致'
            }
          }
        },
        submitInfo: function () {
          this.checkOld()
          this.checkUsername()
          this.checkPassword()
          this.checkPassword2()
          if (this.password !== this.password2) {
            return
          }
          if (this.username !== '' && this.password !== '' && this.password2 !== '') {
            if (this.modify === false && !this.passwordColor && !this.password2Color && !this.nameColor) {
              console.log('adduser')
              this.$http.post('/api/user/addUser', {
                type: 'all',
                username: this.username,
                password: this.password,
                passwordEqual: true
              }).then((res) => {
                console.log(res)
                alert('注册成功')
                sessionStorage.setItem('username', this.username)
                setTimeout(function () {
                  window.location.href = '/'
                }, 1000)
              })
            } else if (this.oldpassword !== '') {
              console.log('modifypassword')
              this.$http.post('/api/user/password', {
                username: this.username,
                password: this.password,
                password2: this.password2,
                oldpassword: this.oldpassword
              }).then(res => {
                console.log(res.data)
                if (res.data === 1) {
                  alert('修改成功')
                  sessionStorage.setItem('username', this.username)
                  setTimeout(function () {
                    window.location.href = '/'
                  }, 1000)
                } else if (res.data === -1){
                  alert('密码验证错误')
                }
              })
            } else {
              this.checkOld()
            }
          } else {
            this.checkOld()
            this.checkUsername()
            this.checkPassword()
            this.checkPassword2()
          }
        }
      },
      mounted () {
        console.log(this.$route.hash[2], this.$route.hash[3] === undefined)
        if (this.$route.hash[2] === '0' && this.$route.hash[3] === undefined) {
          this.modify = true
        }
      }
    }
</script>

<style scoped>
  .container{
    width: 100%;
    height: 1020px;
    background: #f3f3f3;
    color: #242922;

  }
  .title{
    width: 100%;
    height: 80px;
    background: #f3f3f3;
  }
  input,input:focus, textarea:focus {
    -webkit-box-shadow: 0 0 0 1000px white inset;
  }
  input{
    display: inline-block;
    position: relative;
    font-size: 16px;
    outline: none;
    border-radius: 4px;
    border: 1px solid #aaaaaa;
    width: 341px;
    height: 38px;
    line-height: 38px;
    padding-left: 7px ;
    margin-bottom:20px;
  }
  label{
    position: relative;
    display: block;
    font-size: 13px;
    text-align: left;
    top: -13px;
    left: 130px;
    color: #88d0af;
  }
  .wrong{
    color: #f79a9a;
  }
  .register{
    text-align: center;
    min-width: 400px;
    width: 600px;
    background: #fff;
    margin: 10px auto 0 auto;
    height: 400px;
    padding-top: 70px;
    box-shadow: #242922;
  }
  a{
    display: inline-block;
    width: 350px;
    height: 38px;
    line-height: 38px;
    text-decoration: none;
    color: #fff;
    background: #88d0af;
    border-radius: 2px;
  }
</style>
