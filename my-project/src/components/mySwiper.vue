<template>
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="list in listImg" >
          <img :data-src= "list.url" class="swiper-lazy swiper-lazy-load"  >
          <div class="swiper-lazy-preloader"></div>
          <div class="introduction">{{ list.introducton }}</div>
        </div>
      </div>
      <div class="swiper-button-next swiper-button-white"></div>
      <div class="swiper-button-prev swiper-button-white"></div>
      <div class="swiper-pagination swiper-pagination-white"></div>
    </div>
</template>

<script>
    import Swiper from 'swiper'
    import '../assets/swiper.min.css'
    // import b from '../assets/swiper-1.jpg'
    import a from '../assets/swiper-2.jpg'
    import c from '../assets/swiper-3.jpg'
    import d from '../assets/swiper-4.jpg'
    export default {
      name: 'mySwiper',
      data () {
        return {
          listImg: [{
            url: a,
            introducton: '来一场说走就走的旅行1'
          }, {
            url: c,
            introducton: '来一场说走就走的旅行3'
          }, {
            url: d,
            introducton: '来一场说走就走的旅行4'
          }]
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
      }
    }
</script>

<style scoped>
  *{
    border: none;
  }
  .swiper-container {
    min-width: 880px;
    max-height: 900px;
    overflow: hidden;
    background-color: #88d0af;
    z-index: 1;
  }
  .introduction{
    position: absolute;
    right: 18%;
    bottom: 20%;
    color: white;
    font-size: 30px;
    z-index: 9999;
  }
  img {
    width: 100%;
    min-height: 600px;
    max-height: 1100px;
  }
  .swiper-pagination-bullet {
    width:0.833rem;
    height: 0.833rem;
    display: inline-block;
    background: #7c5e53;
  }
</style>
