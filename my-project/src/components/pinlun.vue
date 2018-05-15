<template>
    <div class="box">
      <span>评论</span>
      <div class="write">
        <textarea class="pinlun" v-model="pinlun" placeholder="说点什么吧...........(<=160字)"></textarea>
        <span v-show="pinlunSpan" style="color: #f79a9a;font-size: 15px">评论过长或不能为空</span>
        <button class="submit" @click="submitPinlun">提交</button>
      </div>
      <span v-if="pinlunList.length == 0 || pinlunList.length == []">暂无评论</span>
      <span v-else>评论</span>
      <hr style="border: 1px solid #88d0af;margin-top: 15px;">
      <div v-for="list in pinlunList" class="pinlunList">
        <span class="author">{{list.author}}</span>
        <div>{{list.pinlun}}</div>
        <span class="t">{{list.time}}</span>
      </div>
    </div>
</template>

<script>
  /* eslint-disable indent */

  export default {
      name: 'pinlun',
      props: ['addressGet', 'addressPost', 'username', 'id'],
      data () {
        return {
          pinlunList: [],
          pinlun: '',
          pinlunSpan: false
        }
      },
      methods: {
        submitPinlun: function () {
          if (this.username === '' || this.username === null) {
            alert('登录后评论')
            return
          }
          if (this.pinlun.length > 160 || this.pinlun === ''){
            this.pinlunSpan = true
            return
          } else {
            this.pinlunSpan = false
          }
          console.log(this.id)
          if (this.id === '') {
            console.log(this.id)
            return
          }
          console.log('提交评论')
          var date = new Date()
          var d = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
          console.log({
            author: this.username,
            time: d,
            pinlun: this.pinlun,
            id: this.id
          })
          this.$http.post(this.addressPost, {
            mdata: [this.username, d, this.pinlun, this.id]
          }).then(res => {
            console.log(res.data)
            if (res.data === -1) {
              console.log('提交评论失败')
            } else {
              this.pinlunList.unshift({
                author: this.username,
                pinlun: this.pinlun,
                time: d
              })
              this.pinlun = ''
              alert('提交成功')
            }
          })
        }
      },
      mounted () {
        console.log('id:' + this.id + ' ' + this.addressGet)
        if (this.id !== null) {
          this.$http.get(this.addressGet, {
            params: {
              id: this.id
            }
          }).then(res => {
            console.log(res.data)
            console.log('id:' + this.id)
            if (res.data === -1) {
              console.log('获取评论失败')
            } else {
              this.pinlunList = res.data
            }
          })
        }
      },
      watch: {
        id: function () {
          console.log('id:' + this.id)
          if (this.id !== 0) {
            this.$http.get(this.addressGet, {
              params: {
                id: this.id
              }
            }).then(res => {
              console.log(res.data)
              console.log('id:' + this.id)
              if (res.data === -1) {
                console.log('获取评论失败')
              } else {
                this.pinlunList = res.data
              }
            })
          }
        }
      }
    }
</script>

<style scoped>
  .write{
    margin-top: 10px;
    overflow: hidden;
  }
  .pinlun{
    width: 97%;
    height: 80px;
    padding: 10px;
    outline: none;
  }
  .submit{
    float: right;
    margin-right: 5px ;
    background: #42b983;
    border: 1px solid #71caa2;
    font-size: 15px;
    border-radius: 3px;
    padding:3px 10px;
    color: #fff;
  }
  .box{
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .pinlunList{
    width: 100%;
    margin: 10px 0;
    box-shadow: 0 2px 5px rgba(0,0,0,0.12);
    background: #ffffff;
    overflow: hidden;
  }
  .pinlunList>.author{
    float: left;
    font-size: 18px;
    line-height: 18px;
    margin:15px 10px 5px 20px;
    padding-right: 10px;
    color: #41b883;
    border-right: 2px solid #41b883;
  }
  .pinlunList>.t{
    float: right;
    color: #999;
    font-size: 13px;
    margin: 0px 10px 5px 5px;
  }
  .pinlunList>div{
    margin-left: 90px;
    margin-top: 13px;
    font-size: 16px;
    width: 780px;
    color: #5a5757;
  }
</style>
