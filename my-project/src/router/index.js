import Vue from 'vue'
import Router from 'vue-router'
import travelNav from '../components/nav'
import travelFooter from '../components/footer'
import login from '../components/login'
import map from '../components/map'
import NotFound from '../components/NotFound'
import mySwiper from '../components/mySwiper'
import publicity from '../components/publicity'
Vue.use(Router)

export default new Router({

  routes: [
    {
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
    {
      path: '/map',
      name: 'Home',
      components: {
        default: travelNav,
        Map: map,
        foot: travelFooter,
        login: login
      }
    },
    {
      path: '/share',
      name: 'Home',
      components: {
        default: travelNav,
        foot: travelFooter,
        login: login
      }
    },
    {
      path: '/message',
      name: 'Home',
      components: {
        default: travelNav,
        foot: travelFooter,
        login: login
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
