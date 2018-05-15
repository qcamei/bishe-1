<template>
  <div class="show-attraction">
    <div class="title">
      <span>{{attsearch.city+' > '+attraction}}</span>
    </div>
    <div class="pic-box">
      <div class="pic-big"><img :src="'/static/att/'+attsearch.anum +type +'1.jpg'" style="width: 530px;height: 300px;"></div>
      <div class="pic-small"><img :src="'/static/att/'+attsearch.anum +type +'2.jpg'"></div>
      <div class="pic-small"><img :src="'/static/att/'+attsearch.anum +type +'3.jpg'"></div>
    </div>
    <div class="introduce">
      <h1>景点信息</h1>
      <p>{{attsearch.introduce}}</p>
    </div>
    <div>
      <h1>攻略推荐</h1>
      <div v-for="list in guideList">
        <span class="guide-title" @click="jumpGuide(list.gnum)">{{list.title}}</span>
        <span class="guide-time">{{list.time}}</span>
        <span class="guide-attraction">{{'from &nbsp'+list.attraction}}</span>
        <span class="guide-attraction">{{'by &nbsp'+list.author}}</span>
        <p class="guide-introduce">{{list.introduce}}</p>
      </div>
    </div>
    <pinlun :addressGet="addressGet" :addressPost="addressPost" :id="attraction" :username = "username"></pinlun>
  </div>
</template>

<script>
    import pinlun from '../components/pinlun'
    export default {
      name: 'attraction2',
      components: {
        pinlun: pinlun,
        pinlunUrl: '/api/article/',
        id: ''
      },
      props: ['username'],
      data () {
        return {
          attraction: this.$route.params.attraction,
          // introduce: '',
          guideList: [],
          attsearch: '',
          type: 'att',
          addressGet: '/api/attraction/pinlun/getlist',
          addressPost: '/api/attraction/pinlun/add'
        }
      },
      methods: {
        jumpGuide: function (gnum) {
          this.$router.push({path: '/guide/' + gnum})
        },
        getInfo: function () {
          this.attraction = this.$route.params.attraction
          console.log(this.$route.params.attraction)
          this.$http.get('/api/attraction/introduce', {
            params: {
              attraction: this.attraction
            }
          }).then((res) => {
            console.log(res.data, 'introduce')
            this.attsearch = res.data[0]
          })
          this.$http.get('/api/article/att2/guidelist', {
            params: {
              attraction: this.attraction,
              cityquantity: this.attsearch.city
            }
          }).then((res) => {
            console.log('att2/guidelist', res.data)
            if (res.data === -1) {
              this.guideList = []
              console.log('无攻略')
            } else {
              this.guideList = res.data
            }
          })
        }
      },
      mounted () {
        this.getInfo()
      },
      watch: {
        $route () {
          this.getInfo()
        }
      }
    }
</script>

<style scoped>
  .show-attraction{
    width: 840px;
    margin: 0 auto;
    padding: 10px 20px 20px 20px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.12)
  }
  h1{
    font-weight: normal;
    font-size: 21px;
    line-height: 50px;
  }
  .title{
    padding: 10px 0;
  }
  .title span{
    font-size: 20px;
    line-height: 35px;
  }
  .pic-box{
    overflow: hidden;
    margin-top: 10px;
  }
  .pic-big{
    float: left;
  }
  .pic-small{
    float: left;
    margin-left: 10px;
    margin-bottom:10px;
    height: 145px;
  }
  .pic-small img{
    width: 300px;
    height: 100%;
  }
  .introduce{
    width: 100%;
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
</style>
