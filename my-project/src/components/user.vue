<template>
  <div class="user-box" v-if="username != null &&username != ''">
    <div class="left">
      <span class="username">个人信息<br/>{{username}}</span>
      <div>
        <span class="message oneline">性别: {{info.gender}}</span>
        <span class="message oneline">现居: {{info.live}}</span>
        <span class="message oneline">生日: {{info.birth}}</span>
      </div>
      <div class="showFormModel" v-show="userInfoForm">
        <form class="form-box">
          <label>居住地: </label><input type="text" name="live" :value="info.live"><br/>
          <label>生 日： </label><input type="date" name="birth"><br/>
          <label>性 别： </label>
          <select>
            <option>男</option>
            <option>女</option>
          </select><br/>
          <label>介 绍 : </label><textarea :value="info.introduce"></textarea><br/>
          <button type="button" @click="modifyUserInfo" class="green">提 交</button>
          <button type="button" @click="userInfoForm = false;submitForm = false" class="red">取 消</button>
        </form>
      </div>
      <div class="introduce">
        <p>{{info.introduce}}</p>
      </div>
      <button @click="userInfoForm = true" class="green">修改信息</button>
    </div>
    <div class="right">
      <div>
        <ul>
          <li @click="articleNav = 'my'">我的攻略</li>
          <li @click="articleNav = 'write';mindex=-1">写攻略</li>
        </ul>
      </div>
      <div v-show="guideList.length == 0 && articleNav == 'my'" style="margin: 10px 0px;padding: 10px 5px;">
        尚无攻略
      </div>
      <div v-show="articleNav == 'my'">
        <div v-if="guideList.length != 0" v-for="(list, index) in guideList" class="guide-box">
          <span class="guide-title" @click="jumpGuide(list.gnum)">{{list.title}}</span><br/>
          <span class="guide-attraction">{{list.attraction}}</span>
          <span class="guide-time">{{list.time}}</span>
          <p class="guide-introduce">{{list.introduce}}</p>
          <button class="guide-delete" @click="del(index)">删除</button>
          <button class="guide-button" @click="modify(index)">修改</button>
        </div>
      </div>
      <div v-show="articleNav == 'write'">
        <write :username="username" :guideList="guideList" :mindex="mindex" @write="haveModify"></write>
      </div>
    </div>
  </div>
  <div v-else class="nologin">登录后分享所见所得</div>
</template>

<script>
    import write from '../components/write'
    export default {
      name: 'user',
      components: {
        write: write
      },
      data () {
        return {
          info: {
            introduce: '介绍',
            age: '',
            live: '',
            birth: '',
            gender: ''
          },
          articleNav: 'write',
          guideList: [{
            title: '',
            attraction: '',
            time: '',
            introduce: ''
          }],
          userInfoForm: false,
          modifyGuide: '',
          mindex: -1
        }
      },
      props: ['username'],
      methods: {
        del: function (index) {
          var queren = confirm('是否删除攻略： ' + this.guideList[index].title)
          if (queren === false) {
            return
          }
          this.$http.delete('/api/article/userdelete', {
            params: {
              title: this.guideList[index].title,
              author: this.username,
              gnum: this.guideList[index].gnum
            }
          }).then(res => {
            console.log(res.data)
            if (res.data === 1) {
              alert('成功删除')
              this.guideList.splice(index, 1)
            } else {
              console.log('删除失败')
            }
          })
        },
        modify: function (index) {
          this.mindex = index
          this.articleNav = 'write'
          scrollTo(0, 0)
        },
        jumpGuide: function (gnum) {
          this.$router.push({path: '/guide/' + gnum})
        },
        haveModify: function (data) {
          if (this.mindex === -1) {
            this.guideList.unshift(data)
          } else {
            this.guideList[this.mindex] = data
          }
        },
        getUserInfo: function () {
          this.$http.get('/api/user/userInfo', {
            params: {
              username: this.username
            }
          }).then((res) => {
            console.log(res.data)
            if (res.data === -2) {
              console.log('查询用户信息错误')
            } else if (res.data === -1) {
              console.log('无此用户')
            } else {
              this.info = res.data[0]
            }
          })
        },
        modifyUserInfo: function () {
          var mdata = new Array(document.forms[0].length - 2)
          for (let i = 0; i < mdata.length; i++) {
            mdata[i] = document.forms[0][i].value
            if (mdata[i] === '') {
              alert('内容不能为空')
              return 0
            }
          }
          console.log(mdata)
          if (this.username === '' || this.username === undefined) {
            alert('请登录帐号')
          } else {
            this.$http.patch('/api/user/updateInfo', {
              mdata: mdata
            }).then((res) => {
              if (res.data === -1) {
                alert('修改失败')
              } else {
                this.info.age = mdata[0]
                this.info.live = mdata[1]
                this.info.birth = mdata[2]
                this.info.gender = mdata[3]
                this.info.introduce = mdata[4]
                alert('修改成功')
              }
            })
            this.userInfoForm = false
          }
        }
      },
      mounted () {
        if (this.username === '' || this.username === null){
          this.$emit('cilck-login')
        } else {
          this.getUserInfo()
          this.$http.get('/api/article/userguide', {
            params: {
              username: this.username
            }
          }).then(res => {
            console.log(res.data)
            if (res.data === -1) {
              this.guideList = []
            } else {
              this.guideList = res.data
            }
          })
        }
      },
      watch: {
        username () {
          if (this.username === '' || this.username === null) {
            this.$emit('cilck-login')
          } else {
            this.getUserInfo()
            this.$http.get('/api/article/userguide', {
              params: {
                username: this.username
              }
            }).then(res => {
              if (res.data === -1) {
                this.guideList = []
              } else {
                this.guideList = res.data
              }
            })
          }

        }
      }
    }
</script>

<style scoped>
  input,select{
    height: 27px;
    width: 169px;
    padding-left: 4px;
    left:2px;
    border: 1px solid #aaa;
    border-radius: 3px;
    outline: none;
    margin-bottom: 15px;
  }
  li{
    display: inline-block;
    background: #fff;
    margin: 0 1px;
    padding: 10px 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.12)
  }
  button{
    background: #3fb783;
    line-height: 27px;
    border: none;
    border-radius: 3px;
    margin-top: 10px;
    padding: 2px 4px;
    outline: none;
    color: #fff;
  }
  textarea{
    width: 169px;
    height: 70px;
    padding-left: 4px;
    left: 2px;
    border-radius: 2px;
  }
  .user-box{
    width: 880px;
    margin: 5px auto 0 auto;
    padding: 20px 0;
    overflow: hidden;
  }
  .left{
    width: 300px;
    padding-bottom: 10px;
    font-size: 15px;
    float: left;
    color: #000;
    background: #fff;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.12)
  }
  .guide-box{
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.12);
    margin:10px 0 10px 0;
    padding: 5px 0 10px 10px;
    overflow: hidden;
  }
  .guide-title{
    line-height: 35px;
    font-size: 18px;
  }
  .guide-time{
    float: right;
    color: #999;
    font-size: 13px;
    margin: 5px 10px 5px 5px;
  }
  .guide-introduce{
    margin:6px;
    font-size: 14px;
    color: #5a5757;
  }
  .guide-attraction{
    margin-left: 5px;
    color: #71caa2;
  }
  .guide-button{
    float: right;
    margin-right: 5px ;
    background: #fff;
    border: 1px solid #71caa2;
    padding:1px 8px;
    color: #42b983;
  }
  .guide-delete{
    float: right;
    margin-right: 5px ;
    background: #fff;
    border: 1px solid #f79a9a;
    padding:1px 8px;
    color: #f79a9a;
  }
  .username{
    display: block;
    margin: 0 auto;
    width: 100%;
    line-height:40px;
  }
  .message{
    font-size: 14px;
    line-height: 30px;
  }
  .oneline{
    display: block;
  }
  .introduce{
    width: 70%;
    word-wrap:break-word;
    word-break:break-all;
    text-align: center;
    margin: 0 auto;
    color: #777777;
  }
  .right{
    display: inline-block;
    width: 550px;
    float: right;
  }
  .green{
    background: #fff;
    border: 1px solid #71caa2;
    padding:1px 8px;
    color: #42b983;
  }
  .red{
    background: #fff;
    border: 1px solid #f79a9a;
    padding:1px 8px;
    color: #f79a9a;
  }
  .form-box{
    width: 400px;
    background: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -175px;
    margin-top: -200px;
    padding: 25px 0 20px 21px;
    border-radius: 3px;
    border: 1px solid #bfbfbf;
    box-shadow: 0 2px 5px rgba(0,0,0,0.12)
  }
  .showFormModel{
    position: fixed;
    top:0;
    width: 100%;
    height: 100%;
    z-index: 9999;
  }
  .nologin{
    border: 1px solid #88d0af;
    color: #70c9a2;
    width: 350px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    background: #fff;
    top: 50px;
    left: 50%;
    margin-left: -175px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.12)
  }
</style>
