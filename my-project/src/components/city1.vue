<template>
    <div class="box">
      <div class="info">
        <span class="title" >{{info.country + '>>' +info.city}}</span>
        <div class="city-introduce">
          <p>{{info.introduce}}</p>
          <br/>
          <span>路线推荐</span>
          <pre style="font-size: 15px">{{info.line}}</pre>
        </div>
      </div>
      <hr style="border: 1px solid #88d0af;margin-top: 5px;">
      <div class="att-list">
        <span class="title">景点</span>
        <div v-for="(list,index) in attList">
          <span class="att-round">{{index+1+ '. '}}</span>
          <span class="att-title">{{list.attraction}}</span>
          <span class="quantity">{{'↑ '+ list.quantity}}</span><br/>
          <img :src="'/static/att/'+ list.anum +'att1' + '.jpg'" @click="jump(list.attraction,1)">
          <p class="att-introduce">{{list.introduce.slice(0,130)+ '...'}}</p>
        </div>
      </div>
      <hr style="border: 1px solid #88d0af;margin-top: 5px;">
      <div style="margin-top: 15px;padding:0 10px;">
        <span class="title">攻略推荐</span>
        <div v-for="list in guideList">
          <span class="guide-title" @click="jump(list.gnum,2)">{{list.title}}</span>
          <span class="guide-time">{{list.time}}</span>
          <span class="guide-attraction">{{'from &nbsp'+list.attraction}}</span>
          <span class="guide-attraction">{{'by &nbsp'+list.author}}</span>
          <p class="guide-introduce">{{list.introduce}}</p>
        </div>
        <span v-if="guideList.length == 0">尚无攻略</span>
      </div>
    </div>
</template>

<script>
    export default {
      name: 'city1',
      props: [],
      data () {
        return {
          city: '',
          attList: '',
          guideList: [],
          info: ''
        }
      },
      methods: {
        jump: function (value, type) {
          if (type === 1) {
            this.$router.push({path: '/attraction/' + value})
          } else if (type === 2) {
            this.$router.push({path: '/guide/' + value})
          }
        },
        getInfo: function () {
          this.city = this.$route.params.city
          this.$http.get('/api/attraction/city1', {
            params: {
              city: this.city
            }
          }).then(res => {
            if (res.data === -1) {
              console.log('/city1 无城市信息')
            } else {
              console.log(res.data)
              this.guideList = res.data.guideList
              this.attList = res.data.attList
              this.info = res.data.info[0]
            }
          })
        }
      },
      mounted () {
        this.getInfo()
      },
      watch: {
        $route () {
          console.log(this.$router)
          this.city = this.$route.params.city
        }
      }
    }
</script>

<style scoped>
  pre {
    white-space: pre-wrap; /*css-3*/
    white-space: -moz-pre-wrap; /*Mozilla,since1999*/
    white-space: -o-pre-wrap;
    word-wrap: break-word; /*InternetExplorer5.5+*/
    font-size: 13px!important;
  }
  .box{
    width: 880px;
    margin: 0 auto;
    border: none;
    line-height: 30px;
    padding: 20px 0;
    background: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.12)
  }
  .title{
    display: block;
    line-height: 40px;
    font-size: 20px;
  }
  .info{
    background: #fff;
    padding: 10px 0 10px 15px;
  }
  .att-list{
    background: #fff;
    padding: 10px 0 10px 15px;
    margin-bottom: 12px ;
  }
  .att-list>div{
    margin-bottom: 15px;
    margin-left: 10px;
  }
  .att-list img{
    display: inline-block;
    float: left;
    width: 100px;
    height: 80px;
  }
  .att-round,.att-title{
    display: inline-block;
    line-height: 40px;
  }
  .info-title{
    display: block;
    font-size: 20px;
    line-height: 30px;
  }
  .city-introduce{
    font-size: 14px;
    margin:15px;
    color: #5a5757;
  }
  .att-introduce{
    height: 80px;
    font-size: 14px;
    margin-left: 115px ;
    margin-right: 10px ;
    color: #5a5757;
  }
  .quantity{
    margin-left: 10px;
    color: #41b883;
  }
  .guide-title{
    line-height: 40px;
    font-size: 18px;
    margin-left: 15px;
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
    float: right;
    font-size: 14px;
    color: #71caa2;
    margin: 5px 10px 5px 5px;
  }
</style>
