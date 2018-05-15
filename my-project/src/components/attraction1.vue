<template>
    <div class="box">
      <div class="info" v-if="cityList.length>0">
        <span class="info-title">城市</span>
        <div v-for="(list, index) in cityList" v-if="index < 5">
          <span class="city-title" @click="jump(list,0)">{{list.city}}</span>
          <div class="overflow">
            <!--<img :src="'/static/img/'+ list.cnum +'city'+ (index+1)+ '.jpg'" @click="jump(list,0)">-->
            <div class="city-introduce"><p>{{list.introduce.slice(0,100)}}</p></div>
          </div>
        </div>
      </div>
      <div class="info" v-if="attList.length>0">
        <span class="info-title">景点</span>
        <div v-for="(list, index) in attList">
          <span class="city-title">{{list.attraction}}</span>
          <img :src="'/static/att/'+ list.anum +'att'+ (index+1)+ '.jpg'" @click="jump(list,1)">
          <p class="att-introduce">{{list.introduce.slice(0,100)}}</p>
        </div>
      </div>
      <div class="info" v-if="guideList.length>0">
        <span class="info-title">攻略</span>
        <div v-for="(list, index) in guideList">
          <span class="guide-title" @click="jump(list,2)">{{list.title}}</span>
          <span class="guide-time">{{list.time}}</span>
          <span class="guide-attraction">{{'from &nbsp'+list.attraction}}</span>
          <span class="guide-attraction">{{'by &nbsp'+list.author}}</span>
          <p class="guide-introduce">{{list.introduce}}</p>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      name: 'attraction1',
      data () {
        return {
          cityType: null,
          cityList: [],
          attList: [],
          guideList: []
        }
      },
      methods: {
        getInfo: function () {
          this.$http.get('/api/attraction/att1list', {
            params: {
              city: this.$route.params.city
            }
          }).then((res) => {
            console.log(res.data)
            this.cityList = res.data.cityList
            this.attList = res.data.attList
            this.guideList = res.data.guideList
            console.log(this.cityList)
          })
        },
        jump: function (list, type) {
          if (type === 0) {
            // 城市
            this.$router.push({path: '/city1/' + list.city})
          } else if (type === 1) {
            this.$router.push({path: '/attraction/' + list.attraction})
          } else {
            this.$router.push({path: '/guide/' + list.gnum})
          }
        }
      },
      mounted () {
        this.getInfo()
      },
      watch: {
        $route () {
          console.log('router', this.$route)
          // if (this.$route.path === '/attraction/') {
          this.getInfo()
          // }
        }
      }
    }
</script>

<style scoped>
  .box{
    width: 880px;
    margin: 0 auto;
    border: none;
    line-height: 30px;
    padding: 20px 0;
  }
  .city-title{
    display: block;
    line-height: 40px;
  }
  .info{
    background: #fff;
    padding: 10px 0 10px 15px;
    margin-bottom: 12px ;
    box-shadow: 0 2px 5px rgba(0,0,0,0.12)
  }
  .info-title{
    display: block;
    font-size: 20px;
    line-height: 30px;
  }
  .info>div{
    height: 130px;
  }
  .info img{
    display: inline-block;
    float: left;
    width: 100px;
    height: 80px;
  }
  .city-introduce{
    height: 80px;
    font-size: 14px;
    margin: 0 5px 0 10px;
    color: #5a5757;
  }
  .att-introduce{
    height: 80px;
    font-size: 14px;
    margin-left: 115px ;
    margin-right: 10px ;
    color: #5a5757;
  }
  .overflow{
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
    float: right;
    font-size: 14px;
    color: #71caa2;
    margin: 5px 10px 5px 5px;
  }
  .guide-button{
    float: right;
    margin-right: 5px ;
    background: #fff;
    border: 1px solid #71caa2;
    padding:1px 8px;
    color: #42b983;
  }
</style>
