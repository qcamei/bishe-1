<template>
  <div class="login-box">
    <div class="login-background"></div>
    <div class="login">
      <div class="login-title">
        <ul>
          <li>登录</li>
          <li><a style="color: #42b983;" href="register.html#/1" target="_blank">注册</a></li>
        </ul>
      </div>
      <form>
        <input type="text" name="username" :placeholder="userHolder" v-model="username"> <br>
        <input type="password" name="password" autocomplete="off" :placeholder="passwordHolder"
               v-model="password" style="margin-bottom: 5px;"> <br>
        <a class="modify" href="register.html#/0">修改密码</a><br/>
        <a class="submitUser" href="javascript:;" @click="submitUser(true)" style="margin-top: 10px;">提交</a>
        <a class="submitUser" href="javascript:;" style="background-color: #fa6060" @click="submitUser(false)">取消</a>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LogIn',
    data () {
      return {
        username: 'asd',
        password: '123qwe',
        userHolder: '请输入账户',
        passwordHolder: '请输入密码'
      }
    },
    methods: {
      submitUser: function (e) {
        if (e) {
          var username = this.username
          var password = this.password
          console.log(username, password)
          this.$http.post('/api/user/login', {
            username: username,
            password: password
          }, {}).then((res) => {
            console.log(res.data)
            if (res.data === 0) {
              alert('密码错误')
            } else if (res.data === -1) {
              alert('不存在该用户')
            } else {
              this.$emit('have-login', res.data)// res.data是用户名username
              sessionStorage.setItem('username', res.data)// 存到session
            }
          }, (error) => {
            console.log(error)
          })
        } else {
          this.$emit('have-login')
        }
      }
    },
    mounted () {
      console.log('login.vue')
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  ul {
    line-height: 100px;
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #fff;
    text-decoration: none;
  }
  .modify{
    line-height: 15px;
    color: #41b883;
    margin-left: 120px;
    font-size: 12px;
  }
  .submitUser{
    display: inline-block;
    line-height: 29px;
    width: 174px;
    height: 29px;
    background-color: #41b883;
    opacity: 0.8;
    border-radius: 3px;
    margin-bottom: 7px ;
  }
  .login{
    z-index: 9999;
    background: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -175px;
    margin-top: -200px;
    width: 350px;
    height: 400px;
    border-radius: 5px;
    text-align: center;
  }
  .login-box{
    z-index: 15;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
  }
  .login-background{
    position: absolute;
    background: #000;
    opacity:0.7;
    width: 100%;
    height: 100%;
    top: 0;
  }
  .login-title{
    height: 100px;
    font-size: 18px;
  }
  input{
    height: 27px;
    width: 169px;
    padding-left: 4px;
    left:2px;
    border: 1px solid #aaa;
    border-radius: 3px;
    outline: none;
    margin-bottom: 15px;
  }
</style>
