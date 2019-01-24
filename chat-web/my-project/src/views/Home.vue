<template>
  <div class="home">
    <!-- <Header></Header> -->
    <div class="layout-container">
      <el-container>
        <el-col :span="24">
          <div class="chat">
            <div class="c-head"></div>
            <div class="c-content">
              <div class="left">
                <div class="content" id="content">
                  <ul v-for="(item,key) in record" :key="key">
                    <li v-if="item.name==username">
                      <div class="message">
                        <!-- 头像 -->
                        <div class="headimg">
                          <img :src="item.headimg">
                        </div>
                        <div class="name">{{item.name}}</div>
                        <!-- 消息 -->
                        <span class="body">{{item.value}}</span>
                      </div>
                    </li>
                    <li class="left" v-if="item.name!=username">
                      <div class="message">
                        <!-- 头像 -->
                        <div class="headimg">
                          <img :src="item.headimg">
                        </div>
                        <div class="name">{{item.name}}</div>
                        <!-- 消息 -->
                        <span class="body">{{item.value}}</span>
                      </div>
                    </li>
                    <!-- <li></li> -->
                  </ul>
                </div>
                <div class="tool">
                  <div class="t-list">
                    <ul>
                      <!-- <li>
                        <img src="./img/icon_expression.png">
                      </li>
                      <li>
                        <img src="./img/icon_file.png">
                      </li> -->
                    </ul>
                  </div>
                </div>
                <div class="output">
                  <textarea @keyup.enter="submit"></textarea>
                </div>
              </div>
              <div class="right">
                <div class="number-of" >成员 {{userlist.length}}/{{userlist.length}}</div>
                <!-- 成员列表 -->
                <div class="member-list">
                  <ul>
                    <li  v-for='(item,key) in userlist' :key='key'>
                      <img
                        :src="item.headimg"
                      >
                      <span>{{item.email}}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-container>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
var socket = io("ws://82297834.800.si/");

import HelloWorld from "@/components/HelloWorld.vue";
import axios from "axios";

export default {
  name: "home",
  data() {
    return {
      // socket:'',
      say: "",
      token: "",
      record: [],
      username: "",
      userlist:'',
    };
  },
  components: {
    HelloWorld
  },
  methods: {
    // 回车事件
    submit(event) {
      // 拿到用户信息
      let username = this.token.username;
      let token = this.token.token;
      let data = {
        value: event.target.value,
        name: username,
        token: token,
        headimg: this.token.headimg
      };

      socket.emit("my other event", { data: data });
      event.target.value = "";
    },
    // 获取用户数据
    getUserData(){
      axios.get('http://82297834.800.si/users').then(response=>{
        // console.log(response);
        //绑定用户列表
        this.userlist=response.data.data.result;
      })

    }
  },
  mounted() {
    var getviewid = document.getElementById("content");

    //监听滚动条
    setInterval(() => {
      let viewheight = getviewid.scrollHeight;
      // console.log(viewheight);
      getviewid.scrollTop = viewheight;
    }, 500);
  },
  created() {
    let user = localStorage.getItem("user");
    if (user == null) {
      this.$router.push("/login");
    }
    let userdata = JSON.parse(user);
    this.token = userdata;
    this.username = userdata.username;
    let that = this;
    // 验证用户信息
    axios
      .post("http://82297834.800.si/users", { token: this.token.token })
      .then(response => {
        // console.log(response);
        if (response.data.code !== 0) {
          this.$router.push("/login");
        } else {
          if (user === null) {
            this.$router.push("/login");
          }
          // 判断是否链接成功
          socket.on("news", function(data) {
            // console.log(data);
          });
          //  链接广播数据
          socket.on("my other event", function(data) {
            // console.log(data.data);
            that.record.push(data.data);
          });
        }
      });


    //获取用户数据
    this.getUserData();

    var myDate = new Date();
    let hours = myDate.getHours();
    let m = myDate.getMinutes();
    // console.log(hours + ":" + m);
  },
  watch: {
    record(val) {
      this.record = val;
      this.getUserData();
    }
  }
};
</script>
<style lang='scss' scoped>
.home {
  .layout-container {
    max-width: 1056px;
    padding-left: 16px;
    padding-right: 16px;
    margin-left: auto;
    margin-top: 60px;
    margin-right: auto;
    height: 100%;
    .chat {
      width: 700px;
      overflow: hidden;
      height: 550px;
      position: relative;
      margin: 0 auto;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      .c-content {
        width: 100%;
        display: flex;
        height: calc(100% - 60px);
        .left {
          width: 100%;

          .content::-webkit-scrollbar {
            display: none;
          }

          .content {
            // width: 100%;
            padding: 10px;

            overflow: hidden;
            overflow-y: scroll;
            height: 300px;
            border-bottom: 1px solid #ccc;
            ul {
              height: auto;
              min-height: 80px;

              overflow: hidden;
              li {
                min-height: 80px;
                padding-bottom: 10px;
                // border: 1px solid red;
                line-height: 80px;
                margin-top: 10px;
                .message {
                  height: auto;
                  overflow: hidden;
                  margin-top: 10px;
                  margin-left: 10px;
                  position: relative;
                  .headimg {
                    height: 30px;
                    float: right;
                    width: 30px;
                    line-height: 30px;
                    margin-right: 10px;
                    overflow: hidden;
                    // border-radius: 50%;
                    img {
                      border-radius: 50%;
                      width: 100%;
                    }
                  }
                  .name {
                    position: absolute;
                    top: -30px;
                    color: #9ea8c7;
                    font-size: 12px;
                    right: 50px;
                    display: inline-block;
                  }
                  .body {
                    font-size: 12px;
                    margin-top: 25px;
                    float: right;
                    text-align: left;
                    line-height: 20px;
                    border-radius: 5px;
                    padding: 3px 10px;
                    background-color: #daf4fd;
                  }
                }
              }
              .left {
                float: left !important;
                .headimg {
                  float: left !important;
                }
                .name {
                  left: 40px;
                  font-weight: 600;
                  top: -30px !important;
                  right: auto !important;
                }
                .body {
                  margin-top: 25px !important;
                  float: left !important;
                  background-color: #f3f3f3 !important;
                }
              }
            }
          }
          .tool {
            overflow: hidden;
            height: 40px;
            border-bottom: 1px solid #ccc;
            .t-list {
              ul {
                display: flex;
                li:first-child {
                  margin-top: -0.1rem;
                }
                li {
                  cursor: pointer;
                  height: 40px;
                  line-height: 40px;
                  img {
                    height: 100%;
                  }
                }
              }
            }
          }
          .output {
            width: 100%;
            overflow: hidden;
            height: 100%;
            textarea {
              padding: 10px;
              outline: none;
              overflow: hidden;
              border: none;
              resize: none;
              width: 100%;
              height: 140px;
            }
          }
        }
        
        .right {
          height: 100%;
                      overflow-y: scroll;

          width: 200px;
          float: right;
          background-color: #f6f7f9;
          border-left: 1px solid #ccc;
          .number-of {
            height: 40px;
            color: #777;
            width: 100%;
            font-weight: bold;
            line-height: 40px;
            font-size: 14px;
          }
          .member-list {
            ul {
              li {
                overflow: hidden;
                display: flex;
                height: 30px;
                line-height: 30px;
                text-align: center;
                overflow: hidden;
                padding: 5px 10px;
                white-space: nowrap;
                text-overflow: ellipsis;
                // border: 1px solid red;
                img {
                  height: 30px;
                  width: 30px;
                  float: left;
                  padding: 0 5px;
                  border-radius: 50%;
                }
                span {
                  color: #777;
                  font-weight: bold;
                  display: inline-block;
                  font-size: 12px;
                  float: left;
                }
              }
            }
          }
        }
      }
      .c-head {
        height: 60px;
        width: 100%;
        border-bottom: 0.5px solid #ccc;
      }
    }
  }
}
</style>
