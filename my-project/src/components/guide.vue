<template>
  <div style="width: 100%;overflow: hidden">
    <img class="fengmian" :src="guideInfo.path"/>
    <div class="guide1-box">
      <div class="guide1-info">
        <span class="guide1-title">{{guideInfo.title}}</span>
        <span class="guide1-time">{{guideInfo.time}}</span>
        <span class="guide1-attraction">{{'from &nbsp'+guideInfo.attraction}}</span>
        <span class="guide1-attraction">{{'by &nbsp'+guideInfo.author}}</span><br/><br/>
        <p class="guide1-introduce"><span style="border: 2px solid #88d0af"></span>{{'“'+ guideInfo.introduce}}</p>
        <div class="guide1-content" v-html="guideInfo.content">{{guideInfo.content}}</div>
      </div>
      <pinlun :addressGet="addressGet" :addressPost="addressPost" :id="id" :username = 'username'></pinlun>
    </div>
  </div>
</template>

<script>
    import pinlun from '../components/pinlun'
    export default {
      name: 'guide',
      components: {
        pinlun: pinlun
      },
      data () {
        return {
          guideInfo: '',
          addressGet: '/api/article/pinlun/getlist',
          addressPost: '/api/article/pinlun/add', // 评论获取的url
          id: '' // 获取谁的评论
        }
      },
      props: ['username'],
      methods: {
        getInfo () {
          this.$http.get('api/article/oneguide', {
            params: {
              gnum: this.$route.params.gnum
            }
          }).then(res => {
            console.log(res.data)
            if (res.data === -1) {
              console.log('guide信息获取失败')
            } else {
              this.guideInfo = res.data[0]
              this.id = this.guideInfo.gnum
            }
          })
        }
      },
      mounted () {
        this.getInfo()
      }
    }
</script>

<style>
  .fengmian{
    position: fixed;
    width: 100%;
    top: -55px;
    opacity: 0.8;
  }
  .guide1-info{
    background: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.12);
    padding: 20px 10px;
  }
  .guide1-content{
    padding: 10px 20px;
    margin: 10px 0 0 0;
  }
  .guide1-box{
    width: 880px;
    margin: 0 auto;

    border: none;
    line-height: 30px;
    padding: 20px 0;
    opacity: 0.9;
  }
  .guide1-title{
    line-height: 35px;
    font-size: 30px;
    font-weight: bold;
    padding-left: 10px;
  }
  .guide1-time{
    float: right;
    color: #999;
    font-size: 13px;
    margin: 5px 10px 5px 5px;
  }
  .guide1-introduce{
    margin:6px;
    font-size: 14px;
    color: #5a5757;
  }
  .guide1-attraction{
    float: right;
    font-size: 14px;
    color: #71caa2;
    margin: 5px 10px 5px 5px;
  }
  h2 {
    display: block;
    font-size: 1.5em;
    line-height: 40px;
    font-weight: bold;
  }
  p {
    display: block;
    padding-left: 10px;
  }
  figure{
    clear: both;
    text-align: center;
  }
  figure>img{
    width: 100%;
  }
  figure .image {
    position: relative;
    overflow: hidden;
  }
  figcaption {
    display: block;
    color: #333;
    background-color: #f7f7f7;
    padding: .6em;
    font-size: .75em;
    margin-top: -7px;
    outline-offset: -1px;
  }
  .image-style-side{
    float: right;
    max-width: 50%;
    margin-left: 10px;
  }
  .image-style-side img{
    max-width: 100%;
  }
</style>
