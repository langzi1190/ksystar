<template>
    <div class="user_dialog">
        <el-dialog
                title="用户设置"
                :visible="showDialog=='user'"
                width="800px"
                @close="op('cancel')"
                center
        >
            <div class="user_body">
                <fieldset>
                    <legend>用户列表</legend>
                    <div class="user_left" style="overflow:auto;">
                        <!--<div class="top_menu">-->
                            <!--<div>用户名称</div>-->
                            <!--<div>类型</div>-->
                            <!--<div>屏幕墙号</div>-->
                        <!--</div>-->
                        <table>
                            <thead>
                            <tr>
                                <th>用户名称</th>
                                <th>类型</th>
                                <th>屏幕墙号</th>
                            </tr>
                            </thead>
                         <tbody>
                         <tr :class="{selected:selectedIndex==index}"
                             @click="selectUser(index)"
                             v-for="(item,index) in userList">
                             <td>{{item.name}}</td>
                             <td>{{userTypeList[item.type]}}</td>
                             <td>{{item.type==0?'所有':item.screenArr.map((v,k)=>"#"+(v+1)).join(',')}}</td>
                         </tr>
                         </tbody>

                        </table>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>用户管理</legend>
                    <div  class="user_right">
                        <div class="item">
                            <span>用户名：</span>
                            <el-input v-model="selectedUser.name" size="mini"></el-input>
                        </div>
                        <div class="item">
                            <span>密码：</span>
                            <el-input show-password v-model="selectedUser.pass" size="mini"></el-input>
                        </div>
                        <div class="item">
                            <span>重复密码：</span>
                            <el-input show-password v-model="repeatPass" size="mini"></el-input>
                        </div>
                        <div class="item">
                            <span>类型：</span>
                            <el-select v-model="selectedUser.type" size="mini" placeholder="无">
                                <el-option
                                        v-for="(item,index) in userTypeList"
                                        :key="index"
                                        :label="item"
                                        :value="index">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="item">
                            <span></span>
                            <el-select v-model="selectedUser.screenArr" placeholder="选择屏幕号" size="mini" multiple :disabled="selectedUser.type==0">
                                <el-option
                                        v-for="item in screenList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="item" style="text-align:center;">
                            <el-button size="mini" @click="op('add')">增加</el-button>
                            <el-button size="mini" @click="op('edit')">编辑</el-button>
                            <el-button size="mini" @click="op('delete')">删除</el-button>
                        </div>
                    </div>
                </fieldset>
            </div>
            <div style="text-align:center;margin-top:20px;">
                <el-button size="mini" style="margin-right:50px;" @click="op('sure')">确定</el-button>
                <el-button size="mini" @click="op('cancel')">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['showDialog'],
        data(){
            return {
                // userType:0,
                selectedIndex:-1,
                userTypeList:['管理员','普通用户'],

                userList:[
                    {
                        name:'Administrator',
                        type:0,//0 管理员
                        pass:'',
                        screenArr:[]
                    }
                ],
                selectedUser:{
                    name:'',
                    type:0,//0 管理员
                    pass:'',
                    screenArr:[0,1]
                },
                repeatPass:'',
                selectedScreen:'',
                screenList:[]
            };
        },
        mounted(){
            let total=this.globalEvent.screenInfo.scrGroupArr.length;
            for(let i =0 ;i<total;i++){
                this.screenList.push({
                    label:'屏幕#'+(i+1),
                    value:i
                });
            }
        },
        methods:{
            selectUser(index){
                if(this.selectedIndex==index){
                    return ;
                }
                this.selectedIndex=index;
                this.selectedUser=JSON.parse(JSON.stringify(this.userList[index]));
            },
            op(act){
                console.log(act);
                if(act=='add'){
                    if(this.selectedUser.pass!=this.repeatPass){
                        alert("两次密码不一致");
                        return ;
                    }
                    for(let i in this.userList){
                        if(this.userList[i].name==this.selectedUser.name){
                            alert("用户名已存在");
                            return ;
                        }
                    }

                    this.userList.push({
                        name:this.selectedUser.name,
                        type:this.selectedUser.type,
                        pass:this.selectedUser.pass,
                        screenArr:this.selectedUser.screenArr,
                    });
                }
                else if(act=='delete'){
                    this.userList.splice(this.selectedIndex,1);
                    this.selectedIndex=-1;
                    //置空
                    this.selectedUser={
                        name:'',
                        type:1,
                        pass:'',
                        screenArr:[]
                    };
                }
                else if(act=='edit'){
                    if(this.selectedUser.pass!=this.repeatPass){
                        alert("两次密码不一致");
                        return ;
                    }
                    this.userList[this.selectedIndex].name=this.selectedUser.name;
                    this.userList[this.selectedIndex].type=this.selectedUser.type;
                    this.userList[this.selectedIndex].pass=this.selectedUser.pass;
                    alert("以保存");
                }
                else if(act=='cancel'){
                    this.$emit('sub_event',{'act':'close_kfs'});
                }
                else if(act=='sure'){
                    //todo 保存用户信息
                    this.$emit('sub_event',{'act':'close_kfs'});
                }
            }
        }
    }
</script>

<style>
    .user_dialog{width:720px;}
    .user_dialog .user_body{display:flex;}
    .user_dialog fieldset{width:380px;margin-right:20px;border:1px solid #f3f2f0;}
    .user_dialog legend{margin-left:10px;}
    .user_dialog fieldset:last-child{margin-right:0;}
    .user_dialog .user_left,.user_dialog .user_right{    margin: 10px;
        border: 1px solid #dcdcdc;
        padding: 10px;
        height: 300px;}
    .user_body table{width:100%;text-align:center;}
    .user_body td,.user_body th{height:25px;line-height:25px;cursor:pointer;}
    .user_body .item{margin-bottom:15px;}
    .user_body .item .el-input--mini{width:180px;}
    .user_body .item  > span{display:inline-block;width:90px;}
    .user_body tr:hover,.user_body tr.selected{background-color:#f3f2f0;}
</style>