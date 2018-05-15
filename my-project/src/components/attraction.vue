<template>
  <div id="attraction">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="list in indexList" >
          <img :src= "'/static/att/'+ list.anum +'att1.jpg'" >
          <div class="introduction" >
            <span class="title" @click="toggleAttraction(list.anum)">{{list.attraction}}</span>
            <div style="margin:10px 30px 40px 30px;width: 93%;z-index: 10;">{{ list.introduce.slice(0,200) }}</div>
            <div class="back"></div>
          </div>
        </div>
      </div>
      <div class="swiper-button-next swiper-button-white"></div>
      <div class="swiper-button-prev swiper-button-white"></div>
      <div class="swiper-pagination swiper-pagination-white"></div>
    </div>
    <div class="sort-box">
      <span class="sort-title">热门城市</span>
      <div class="hot-list" v-for="list in hotcity">
        <a class="hot-city" @click="toggleCity(list.city)">{{list.city}}</a><span v-show="list.city != ''">↑ {{list.quantity}}</span>
        <ul>
          <li v-for="alist in list.attraction"
              @click="toggleAttraction(alist.attraction)">{{alist.attraction}}
            </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
    // import MP from '../map.js'
    import Swiper from 'swiper'
    import '../assets/swiper.min.css'
    export default {
      name: 'Map',
      props: ['citySearch', 'searchType'],
      data () {
        return {
          cityInfo: {
            introduce: '',
            city: ''
          },
          hotcity: [],
          indexList: [{attraction: '', introduce: '', anum: ''}, {attraction: '', introduce: '', anum: ''}, {attraction: '', introduce: '', anum: ''}, {attraction: '', introduce: '', anum: ''}, {attraction: '', introduce: '', anum: ''}]
        }
      },
      methods: {
        getInfo: function () {
          this.$http.get('/api/attraction/hotcity').then(res => {
            console.log(res.data.list)
            this.hotcity = res.data.list
          })
        },
        toggleTab: function (tab) {
          this.tab = tab
        },
        toggleCity: function (city) {
          this.$router.push({path: '/city/' + city})
        },
        toggleAttraction: function (attraction) {
          // 跳转景点页面
          this.$router.push({path: '/attraction/' + attraction})
        }
      },
      mounted () {
        console.log('attraction.vue')
        var myswiper = new Swiper('.swiper-container', {
          pagination: {
            el: '.swiper-pagination'
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          // paginationClickable: true,
          // loop: true,
          autoplay: {
            delay: 4000,
            stopOnLastSlide: false,
            disableOnInteraction: true,
          },
          speed: 600
        })
        this.$http.get('/api/attraction/indexlist')
          .then(res => {
            console.log(res.data)
            this.indexList = res.data
          })
        this.getInfo()
        console.log(this.hotcity)
      }
    }
</script>

<style scoped>
  .swiper-slide{
    position: relative;
  }
  .swiper-container {
    width: 880px;
    height: 600px;
    overflow: hidden;
  }
  .introduction{
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 100%;
    color: #fff;
    font-size: 20px;
  }
  ul{
    list-style-type: none;
  }
  #attraction{
    min-width: 880px;
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
  }
  .attraction1{
    width: 100%;
    z-index: 1;
    top: -54px;
    margin-bottom: -54px;
  }
  .sort-box{
    width: 880px;
    margin: 0 auto;
    border: none;
    line-height: 30px;
    background: #fff;
    padding: 20px 0;
  }
  .sort-title{
    display: block;
    text-align: center;
    font-size: 20px;
    line-height: 40px;
    color: #42b983;
  }
  .area{
    text-align: center;
  }
  .area li{
    display: inline-block;
    padding: 0 10px;
    margin-bottom: 20px;
    color: #70c9a2;
  }
  .area span{
    display: block;
    width: 100%;
    margin-top: 2px;

  }
  .now-area{
    border-bottom: 2px solid #88d0af;
  }
  .hot-list{
    font-size: 15px;
    text-align: center;
  }
  .hot-list li{
    display: inline-block;
  }
  .hot-list ul{
    font-size: 14px;
    color: #aaa;
  }
  .hot-list li{
    margin-right: 10px;
  }
  .hot-city+span{
    display: inline-block;
    font-size: 13px;
    line-height: 13px;
    color: #88d0af;
    margin-left: 20px ;
  }

</style>
