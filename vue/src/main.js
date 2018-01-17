// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'

Vue.use(Vuex)

Vue.config.productionTip = false

const store = new Vuex.Store({
  state:{
    userInfo:{

    }
  },
  mutations:{
    updateUserInfo(state,newUserInfo){
      state.userInfo = newUserInfo;
    }
  }
});

//设置cookie
Vue.prototype.setCookie = (c_name, value, expiredays) => {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

//获取cookie、
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}
Vue.prototype.getCookie = getCookie;

//删除cookie
Vue.prototype.delCookie =(name) => {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  watch:{
    "$route" : 'checkLogin'
  },
  created() {
    this.checkLogin();
  },
  methods:{
    checkLogin(){
      //检查是否存在session
      if(!this.getCookie('session')){
        this.$router.push('/login');
      }else{
        this.$router.push('/home');
      }
    }
  },
  template: '<App/>',
  components: { App }
})




