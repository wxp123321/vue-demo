<template>
  <div class="login" id="login">
    <a href="javascript:;" class="log-close"><i class="icons close"></i></a>
    <div class="log-bg">
      <div class="log-logo">Welcome!</div>
    </div>
    <div class="log-email">
      <input type="text" placeholder="Username" class="log-input" v-model="username">
      <input type="password" placeholder="Password" :class="'log-input' + (password==''?' log-input-empty':'')"  v-model="password">
      <a href="javascript:;" class="log-btn" @click="login">Login</a>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'

  export default{
    name:'login',
    methods:{
      login: function () {
        var that = this;
        if(this.username != ''&&this.password != ''){
          let config = {
            username:this.username,
            password:this.password
          }
          $.ajax({
            url:'/api/login',
            type:'post',
            data:config,
            success: function (res) {
              if(res.data.code === 1){
                if(window.localStorage){
                  localStorage.setItem('uid',res.data.uid);
                }
                let expireDays = 1000 * 60 * 60 * 24 * 15;
                that.setCookie('session',that.username, expireDays);
                that.$router.push('/home');
              }
            }
          });
        }
      }
    },
    data(){
      return{
        username:'',
        password:''
      }
    }
  }
</script>

<style>
  .login {
    position: fixed;
    overflow: hidden;
    left: 50%;
    margin-left: -250px;
    top: 50%;
    margin-top: -350px;
    width: 500px;
    min-height: 555px;
    z-index: 10;
    right: 140px;
    background: #fff;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 0px 3px 16px -5px #070707;
    box-shadow: 0px 3px 16px -5px #070707
  }

  .log-close {
    display: block;
    position: absolute;
    top: 12px;
    right: 12px;
    opacity: 1;
  }

  .log-close:hover .icons {
    transform: rotate(180deg);
  }

  .log-close .icons {
    opacity: 1;
    transition: all .3s
  }

  .log-cloud {
    background-image: url(login-cloud.png);
    width: 63px;
    height: 40px;
    position: absolute;
    z-index: 1
  }

  .login .cloud1 {
    top: 21px;
    left: -30px;
    transform: scale(.6);
    animation: cloud1 20s linear infinite;
  }

  .login .cloud2 {
    top: 87px;
    right: 20px;
    animation: cloud2 19s linear infinite;
  }

  .login .cloud3 {
    top: 160px;
    left: 5px;
    transform: scale(.8);
    animation: cloud3 21s linear infinite;
  }

  .login .cloud4 {
    top: 150px;
    left: -40px;
    transform: scale(.4);
    animation: cloud4 19s linear infinite;
  }

  .log-bg {
    background: url(login-bg.jpg);
    width: 100%;
    height: 312px;
    overflow: hidden;
  }

  .log-logo {
    height: 80px;
    margin: 120px auto 25px;
    text-align: center;
    color: #1fcab3;
    font-weight: bold;
    font-size: 40px;
  }

  .login-email {
    height: 17px;
    width: 29px;
    background-position: -117px 0;
  }

  .log-btns {
    padding: 15px 0;
    margin: 0 auto;
  }

  .log-btn {
    width: 402px;
    display: block;
    text-align: left;
    line-height: 50px;
    margin: 0 auto 15px;
    height: 50px;
    color: #fff;
    font-size: 13px;
    text-decoration: none;
    -webkit-border-radius: 5px;
    background-color: #3B5999;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
    border-radius: 5px;
    position: relative;
  }

  .log-btn:hover, .log-btn:focus {
    color: #fff;
    opacity: .8;
  }

  .log-email {
    text-align: center;
    margin-top: 20px;
  }

  .log-email .log-btn {
    background-color: #50E3CE;
    text-align: center;
  }

  .log-btn .icons {
    margin-left: 30px;
    vertical-align: middle;
  }

  .log-btn .text {
    left: 95px;
    line-height: 50px;
    text-align: left;
    position: absolute;
  }

  .log-input {
    width: 402px;
    overflow: hidden;
    padding: 0 15px;
    font-size: 13px;
    border: 1px solid #EBEBEB;
    margin: 0 auto 15px;
    height: 48px;
    line-height: 48px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
    border-radius: 5px;
  }

  .log-input.warn {
    border: 1px solid #f88787
  }

  @-webkit-keyframes cloud1 {
    0% {
      left: 200px
    }
    100% {
      left: -130px;
    }
  }

  @keyframes cloud1 {
    0% {
      left: 200px
    }
    100% {
      left: -130px;
    }
  }

  @-webkit-keyframes cloud2 {
    0% {
      left: 500px;
    }
    100% {
      left: -90px;
    }
  }

  @keyframes cloud2 {
    0% {
      left: 500px;
    }
    100% {
      left: -90px;
    }
  }

  @-webkit-keyframes cloud3 {
    0% {
      left: 620px;
    }
    100% {
      left: -70px;
    }
  }

  @keyframes cloud3 {
    0% {
      left: 620px;
    }
    100% {
      left: -70px;
    }
  }

  @-webkit-keyframes cloud4 {
    0% {
      left: 100px;
    }
    100% {
      left: -70px;
    }
  }

  @keyframes cloud4 {
    0% {
      left: 100px;
    }
    100% {
      left: -70px;
    }
  }
</style>
