import Vue from 'vue'
import Router from 'vue-router'
import travelNav from '../components/nav'
import travelFooter from '../components/footer'
// import login from '../components/login'
// import attraction from '../components/attraction'
// import attraction2 from '../components/attraction2'
// import NotFound from '../components/NotFound'
import mySwiper from '../components/mySwiper'
import publicity from '../components/publicity'
// import user from '../components/user'
// import attraction1 from '../components/attraction1'
// import guide from '../components/guide'
// import city1 from '../components/city1'
const login = () => import('../components/login')
const attraction = () => import('../components/attraction')
const attraction2 = () => import('../components/attraction2')
const NotFound = () => import('../components/NotFound')
const user = () => import('../components/user')
const attraction1 = () => import('../components/attraction1')
const guide = () => import('../components/guide')
const city1 = () => import('../components/city1')
const indexguide = () => import('../components/indexGuide')
Vue.use(Router)

export default new Router({

  routes: [
    {// 首页
      path: '/',
      name: 'Home',
      components: {
        default: travelNav,
        mySwiper: mySwiper,
        publicity: publicity,
        foot: travelFooter,
        login: login
      }
    },
    {// 景点介绍
      path: '/attraction',
      name: 'attraction',
      components: {
        default: travelNav,
        attraction: attraction,
        foot: travelFooter,
        login: login
      }
    },
    {// 城市与景点与攻略
      path: '/city/:city',
      name: 'attraction1',
      components: {
        default: travelNav,
        attraction1: attraction1,
        foot: travelFooter,
        login: login
      }
    },
    {// 城市与景点与攻略
      path: '/city1/:city',
      name: 'city1',
      components: {
        default: travelNav,
        city1: city1,
        foot: travelFooter,
        login: login
      }
    },
    {// 查询景点
      path: '/attraction/:attraction',
      name: 'attraction2',
      components: {
        default: travelNav,
        attraction2: attraction2,
        foot: travelFooter,
        login: login
      }
      // props: {
      //   default: true,
      //   attraction: true,
      //   foot: false,
      //   login: false
      // }
    },
    {// 分享
      path: '/share',
      name: 'share',
      components: {
        default: travelNav,
        foot: travelFooter,
        login: login
      }
    },
    {// 攻略
      path: '/article',
      name: 'indexguide',
      components: {
        default: travelNav,
        indexguide: indexguide,
        foot: travelFooter,
        login: login
      }
    },
    {// 特定攻略
      path: '/guide/:gnum',
      name: 'guide',
      components: {
        default: travelNav,
        foot: travelFooter,
        guide: guide,
        login: login
      }
    },
    {// 用户信息
      path: '/user',
      name: 'user',
      components: {
        default: travelNav,
        foot: travelFooter,
        login: login,
        user: user
      }
    },
    {
      path: '*',
      components: {
        NotFound: NotFound
      }
    }
    // {
    //   path: '/:username',
    //   name: 'home',
    //   components: {
    //     default: travelNav,
    //     foot: travelFooter,
    //     login: login
    //   },
    //   props: {default: true, foot: false, login: false}
    // }
  ]
})
