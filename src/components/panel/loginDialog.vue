<template>
    <div>
        <div style="display: flex;justify-content: center;margin-top: 150px">
            <div style="width: 300px">
                <div style="text-align:center;margin-bottom:20px;font-size:20px;" slot="header" class="clearfix">
                    <span>登录</span>
                </div>
                <table>
                    <tr>
                        <td>用户名</td>
                        <td>
                            <el-input v-model="user.username" placeholder="请输入用户名"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>密码</td>
                        <td>
                            <el-input type="password" v-model="user.password" placeholder="请输入密码" @keydown.enter.native="doLogin"></el-input>
                            <!-- @keydown.enter.native="doLogin"当按下enter键的时候也会执行doLogin方法-->
                        </td>
                    </tr>
                    <tr>
                        <!-- 占两行-->
                        <td colspan="2">
                            <!-- 点击事件的两种不同的写法v-on:click和 @click-->
                            <!--<el-button style="width: 300px" type="primary" v-on:click="doLogin">登录</el-button>-->
                            <el-button style="width: 300px" type="primary" @click="doLogin">登录</el-button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return{
                user:{
                    username:'Administrator',
                    password:'',
                }
            }
        },
        methods:{
            doLogin(){
                this.$http.post("login.cgi",{username:this.user.username,password:this.user.password},(ret)=>{
                    // if(ret.data.result==1){
                    //     this.globalEvent.userInfo.password=this.user.password;
                    //     this.globalEvent.userInfo.username=this.user.username;
                    //     this.globalEvent.userInfo.type=1;
                    //     this.$emit("sub_event",{act:'login'});
                    // }
                    // else{
                    //     alert("登录失败");
                    // }

                    this.globalEvent.userInfo.password=this.user.password;
                    this.globalEvent.userInfo.username=this.user.username;
                    this.globalEvent.userInfo.type=0;
                    this.$emit("sub_event",{act:'login'});
                });

                // alert(JSON.stringify(this.user))//可以直接把this.user对象传给后端进行校验用户名和密码
            }
        }
    }
</script>
<style scoped>
    table td{height:50px;}
</style>