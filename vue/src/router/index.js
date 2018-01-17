import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home/Home'
import Login from '../components/Login/Login'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/login',
      name:'login',
      component:Login
    },
    {
      path:'/home',
      name:'home',
      component: Home
    }
  ]
})

