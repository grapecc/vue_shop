<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-ccl>
                    <el-button type ="primary">添加角色</el-button>
                </el-ccl>
            </el-row>
            <el-table :data="roleList" border stripe >
                <el-table-column label="#" type="index" ></el-table-column>
                <el-table-column label="编号" prop="id"></el-table-column>
                <el-table-column label="职位" prop="roleDesc"></el-table-column> 
                <el-table-column label="名字" prop="authName"></el-table-column>   
           </el-table>    
        </el-card>
    </div>
</template>

<style>

</style>

<script>
   export default{
       data(){
           return{
            roleList:[]
           }
           
       },
       created() {
           this.getRolesList()
       },
       methods: {
           //获取所有角色的列表
         async  getRolesList(){
         const {deta:res} = await  this.$http.get('roles')
            if(res.meta.status !==200){
                return this.$message.error('获取角色列表失败！')
            }
            this.roleList = res.data
        }
       },
   }

</script>

