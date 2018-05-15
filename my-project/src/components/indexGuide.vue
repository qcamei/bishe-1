<template>
  <div>
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="list in indexList" >
          <img :src= "list.path" class="swiper-lazy swiper-lazy-load" >
          <div class="swiper-lazy-preloader"></div>
          <div class="introduction" >
            <span class="title" @click="toggleGuide(list.gnum)">{{list.title}}</span>
            <div style="margin:10px 30px 40px 30px;width: 93%;z-index: 10;">{{ list.introduce }}</div>
            <div class="back"></div>
          </div>
        </div>
      </div>
      <div class="swiper-button-next swiper-button-white"></div>
      <div class="swiper-button-prev swiper-button-white"></div>
      <div class="swiper-pagination swiper-pagination-white"></div>
    </div>
    <div class="guide">
      <span style="left: -5px;">热门攻略</span>
      <div class="hot-list" v-for="list in hotGuide">
        <span class="guide-title" @click="toggleGuide(list.gnum)">{{list.title}}</span>
        <span v-show="list.city != ''" style="font-size: 18px">↑ {{list.quantity}}</span><br/>
        <span class="guide-attraction">{{'by &nbsp'+list.author}}</span>
        <span class="guide-attraction">{{'from &nbsp'+list.attraction}}</span>
        <span class="guide-time">{{list.time}}</span><br/>
      </div>
    </div>
  </div>
</template>

<script>
    import Swiper from 'swiper'
    import '../assets/swiper.min.css'
    export default {
      name: 'index-guide',
      data () {
        return {
          indexList: [
            {introduce: '', gnum: '', path: ''},
            {introduce: '', gnum: '', path: ''},
            {introduce: '', gnum: '', path: ''},
            {introduce: '', gnum: '', path: ''},
            {introduce: '', gnum: '', path: ''}],
          hotGuide: []
        }
      },
      methods: {
        toggleGuide: function (gnum) {
          this.$router.push({path: '/guide/' + gnum})
        }
      },
      mounted () {
        var myswiper = new Swiper('.swiper-container', {
          pagination: {
            el: '.swiper-pagination'
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          // paginationClickable: true,
          loop: true,
          autoplay: {
            delay: 4000,
            stopOnLastSlide: false,
            disableOnInteraction: true
          },
          speed: 600,
          lazy: true
        })
        this.$http.get('/api/article/indexlist')
          .then(res => {
            console.log(res.data)
            this.indexList = res.data
          })
        this.$http.get('/api/article/hotguide')
          .then(res => {
            console.log(res.data)
            this.hotGuide = res.data
          })
      }
    }
</script>

<style scoped>
  .guide{
    display: block;
    position: relative;
    background: #fff;
    width: 880px;
    margin: 0 auto;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    font-size: 25px;
    line-height: 40px;
    color: #42b983;
  }
  .guide-title{
    line-height: 35px;
    font-size: 17px;
    color: black;
  }
  .guide-time{
    color: #999;
    font-size: 13px;
    margin: 5px 10px 5px 5px;
  }
  .guide-attraction{
    font-size: 15px;
    color: #71caa2;
    margin: 5px 10px 5px 5px;
  }
  /*.hot-list{*/
    /*font-size: 16px;*/
    /*text-align: center;*/
  /*}*/
  /*.hot-list li{*/
    /*display: inline-block;*/
  /*}*/
  /*.hot-list ul{*/
    /*font-size: 15px;*/
    /*color: #aaa;*/
  /*}*/
  /*.hot-list li{*/
    /*margin-right: 10px;*/
  /*}*/
  /*.hot-guide+span{*/
    /*display: inline-block;*/
    /*font-size: 13px;*/
    /*line-height: 13px;*/
    /*color: #88d0af;*/
    /*margin-left: 20px ;*/
  /*}*/
  *{
    border: none;
  }
  .swiper-slide{
    position: relative;
  }
  .swiper-container {
    width: 880px;
    height: 600px;
    overflow: hidden;
    z-index: 1;
  }
  .introduction{
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 100%;
    color: #fff;
    font-size: 20px;
  }
  .title{
    display: block;
    margin-left: 30px;
    margin-top: 10px;
    font-size: 25px;
    z-index: 10;
  }
  img {
    width: 100%;
    height: 600px;
  }
  .back{
    background: #000;
    opacity: 0.5;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .swiper-pagination-bullet {
    width:0.833rem;
    height: 0.833rem;
    display: inline-block;
    background: #7c5e53;
  }
</style>
