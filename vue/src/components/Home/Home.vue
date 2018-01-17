<template>
  <div class="home">
    <div class="title">师生交流平台</div>
    <div class="content">
      <div class="speakBox">
        <div class="main">
          <div class="select pre-scrollable" id="scroll">

          </div>
        </div>
        <div class="inputBox" ref="select_frame">
          <textarea autofocus maxlength="50" v-model="utterance" id="text" @keydown="key($event)"></textarea>
          <button @click="key(13)">发送</button>
        </div>
      </div>
      <div class="filesBox pre-scrollable">

      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'

  export default{
    name:'home',
    data(){
      return{
        userInfo:{

        },
        utterance:'',
        socket:null,
        number:1,
        fileList:[]
      }
    },
    mounted(){
      this.getUserInfo();
      this.startSocket();
      this.getFiles();
      this.$refs.select_frame.ondragleave = (e) => {
        //阻止离开时的浏览器默认行为
        e.preventDefault();
      };
      this.$refs.select_frame.ondrop = (e) => {
        //阻止拖放后的浏览器默认行为
        e.preventDefault();
        const data = e.dataTransfer.files;
        if(data.length < 1){
          return;
        }
        var formData = new FormData();
        for(let i = 0; i < e.dataTransfer.files.length; i++){
          console.log(e.dataTransfer.files[i]);
          if(e.dataTransfer.files[i].name.indexOf('.') === -1){
            alert('不允许提交文件夹');
          }
          formData.append('uploadfile', e.dataTransfer.files[i], e.dataTransfer.files[i].name);
        }
        this.upload(formData);
//        this.fileList = this.fileList.concat(e.dataTransfer.files[0]);
      };
      this.$refs.select_frame.ondragenter = (e) => {
        //阻止拖入时的浏览器默认行为
        e.preventDefault();
      };
      this.$refs.select_frame.ondragover = (e) => {
        //阻止拖来拖去的浏览器默认行为
        e.preventDefault();
      };
    },
    methods:{
      getUserInfo(){
        var that = this;
        let config = {
          uid:localStorage.getItem('uid')
        }
        $.ajax({
          url:'/api/getUserInfo',
          method:'post',
          data:config,
          success: function (res) {
            if(res.code === 1){
              that.userInfo = res.data;
            }
          }
        });
      },
      key(event){
        if(event.keyCode === 13){
          event.returnValue = false;
          if(this.utterance !== ''){
            this.createRecord(this.utterance);
            this.send(this.utterance);
            this.utterance = '';
            document.getElementById('text').value = '';
          }
        }else if(event === 13){
          this.createRecord(this.utterance);
          this.send(this.utterance);
          this.utterance = '';
          document.getElementById('text').value = '';
        }
      },
      createRecord(value){
        var str = `
        <div class="myrecord">
          <p class="header-portrait"></p>
          <p class="mysay">${value}</p>
        </div>`;
        $('.select').append(str);
        if($('.myrecord').height()*$('.myrecord').length+$('.record').height()*$('.record').length > 320){
          this.scroll(75*this.number++);
        }
      },
      createOtherRecord(value,name){
        var str = `
        <div class="record">
          <p class="header-portrait"></p>
          <span class="name">${name}</span>
          <p class="say">${value}</p>
        </div>`;
        $('.select').append(str);
        if($('.myrecord').height()*$('.myrecord').length+$('.record').height()*$('.record').length > 320){
          this.scroll(75*this.number++);
        }
      },
      createFiles(){
        var data = this.fileList;
        $('.oneFile').remove();
        for(var i = 0;i<data.length;i++){
          var str = `
            <div class="oneFile">
              <a href="/api/download?filename=${data[i]}">${data[i]}</a>
            </div>
          `;
          $('.filesBox').append(str);
        }
      },
      scroll(number){
        document.getElementById('scroll').scrollTop = number;
      },
      startSocket(){
        var that = this;
        this.socket = io.connect('http://localhost:3000');
        this.socket.on('message',function(obj){
          console.log(obj);
          if(obj.uid !== localStorage.getItem('uid')){
            that.createOtherRecord(obj.message,obj.name);
          }
        });
      },
      send(value){
        this.socket.emit('message',{
          uid:localStorage.getItem('uid'),
          message:value
        });
      },
      getFiles(){
        var that = this;
        $.ajax({
          url:'/api/getFiles',
          type:'post',
          success: function (res) {
            that.fileList = res.data.files;
            that.createFiles();
          }
        });
      },
      upload(formData){
        var that = this;
        $.ajax({
          url:'/api/uploading',
          type:'post',
          contentType: false,
          processData: false,
          cache: false,
          data:formData,
          success: function (res) {
            console.log(res);
            if(res.data.code === 1){
              alert('上传成功！');
              that.getFiles();
            }else{
              alert('不允许上传相同名字的文件！');
            }
          }
        });
      }
    }
  }
</script>

<style>
  .home{
    width: 800px;
    height: 700px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -400px;
    margin-top: -350px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background: white;
  }

  .title{
    font-size: 22px;
    height: 50px;
    line-height: 50px;
    margin-left: 20px;
  }

  .content{
    border-top: 1px solid #ddd;
    display: flex;
    flex-direction: row;
  }

  .speakBox{
    width: 557px;
    height: 647px;
    border-right: 1px solid #ddd;
    position: relative;
  }

  .inputBox{
    width: 100%;
    height: 100px;
    border-top: 1px solid #ddd;
    position: absolute;
    bottom: 0;
  }

  .inputBox textarea{
    width: 100%;
    height: 69px;
    background: white;
    border: none;
    outline: none;
    resize:none
  }

  .inputBox button{
    background: #d3d3d2;
    border: none;
    float: right;
    margin: -4px 5px 0 0;
    padding: 2px 15px;
  }

  .record{
    display: flex;
    flex-direction: row;
    padding: 10px 0 10px 10px;
    position: relative;
  }

  .myrecord{
    display: flex;
    flex-direction: row-reverse;
    padding: 10px 10px 10px 0;
  }

  .header-portrait{
    width: 35px;
    height: 35px;
    background: url(mine.png);
    border-radius: 50%;
  }

  .mysay{
    vertical-align: middle;
    background: #9dc3bf;
    padding: 10px;
    border-radius: 10px 10px 10px 10px;
    max-width: 490px;
    text-align: left;
  }

  .say{
    vertical-align: middle;
    background: #9dc3bf;
    padding: 10px;
    border-radius: 0 10px 10px 10px;
    max-width: 490px;
    margin-top: 15px;
    text-align: left;
  }

  .select{
    max-height: 546px;
  }

  .name{
    font-size: 12px;
    position: absolute;
    top: 10px;
    left: 50px;
  }

  .filesBox{
    width: 240px;
    height: 647px;
    display: flex;
    flex-direction: column;
  }

  .oneFile{
    width: 100%;
    height: 40px;
  }

  .oneFile p{
    display: inline-block;
    line-height: 40px;
  }

  .oneFile a{
    cursor: pointer;
    line-height: 40px;
  }
</style>
