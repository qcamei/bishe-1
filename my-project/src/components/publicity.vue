<template>
  <div class="box">
    <div class="content1">
      <span :class="{ active: span1}">查阅旅游地点</span>
    </div>
    <div class="content2">
      <span :class="{ active: span2}">找寻攻略</span>
    </div>
    <div class="content3">
      <span :class="{ active: span3}">分享行程</span>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'publicty',
      data () {
        return {
          scroll: 0,
          span1: false,
          span2: false,
          span3: false,
          resizeTime: null
        }
      },
      methods: {
        scrollMove () {
          this.scroll = document.documentElement.scrollTop || document.body.scrollTop
          console.log(document.body.scrollTop, this.scroll, document.documentElement.scrollTop)
          if (this.scroll > 300 && this.scroll < 1300) {
            this.span1 = true
          }
          if (this.scroll > 1500 && this.scroll < 2200) {
            this.span2 = true
          }
          if (this.scroll > 2550){
            this.span3 = true
          }
        }
      },
      mounted () {
        // let _this = this
        // _this.sm = throttle (() => {
        //   _this.scrollMove()
        //   // console.log('scroll')
        // }, 200)
        window.addEventListener('scroll', this.scrollMove)
      },
      destroyed () {
        window.removeEventListener('scroll', this.scrollMove)
      }
    }
</script>

<style scoped>
  .box{
    width: 100%;
    text-align: center;
    color: #fff;
    font-size: 30px;
  }
  span{
    top: 30px;
    opacity: 0;
  }
  @keyframes spanMove {
    0%{
      opacity: 0;
      top: 30px;
    }
    100%{
      opacity: 1;
      top: 0px;
    }
  }
  .active{
    animation: spanMove 1.5s ease-out;
    animation-fill-mode: forwards;
    transform: translateY(100px);
  }
  .box>div{
    width: 100%;
    line-height: 950px;
    height: 950px;
  }
  .content1{
    background: #88d0af;
  }
  .content2{
    background: #f79a9a;
  }
  .content3{
    background: #499efb;
  }
</style>
