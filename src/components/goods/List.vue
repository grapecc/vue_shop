<template>
    <div>
       <!-- 面包屑导航区 -->
       <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>


      <!-- 卡片区域 -->
      <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" 
                    v-model="queryInfo.query" 
                    class="input-with-select"
                    clearable
                    @clear="getGoodsList">
                       <el-button slot="append" 
                        icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>    
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 商品列表展示 -->
            <el-table :data="goodsList" border  stripe>
                <el-table-column label="#" type="index" ></el-table-column> 
                <el-table-column label="商品名称"  prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px">
                    <template slot-scope="scope">
                        {{scope.row.add_time| dateForam}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope" >
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" 
                        size="mini"  class="btn"></el-button>
                       <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                       class="btn" @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>


            <!-- 尾部底端展示 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo"
            :page-sizes="[5,10,15,20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total" background>
          </el-pagination>
      </el-card>
    </div>
</template>



<script>
export default{
    data() {
        return {
           queryInfo:{
               query: '',
               pagenum: 1,
               pagesize:10
           },
           goodsList:[],
           total: 0,
        }
    },
    created(){
       this.getGoodsList()
    },
    methods: {
      async getGoodsList(){
         const{data:res} =  await this.$http.get('goods',{ params: this.queryInfo})
            if(res.meta.status !== 200){
               return  this.$message.err('获取失败！')
            }
            this.$message.success('获取列表成功！')
            this.goodsList = res.data.goods
            this.total = res.data.total
            console.log(res.data)
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        async removeById(id){
            const confirmResult= await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                //type指定前面的小图标
                type: 'warning'
             }).catch(err => err)
             //如果用户确认删除，返回值为字符串 confirm
             //如果用户取消了删除，则返回值为字符串 cancel

             //  console.log(confirmResult)
             if(confirmResult !== 'confirm'){
                return this.$message.info('已取消删除')
              }
             // console.log('确认了删除')
             const{data :res } =await this.$http.delete('goods/'+id
             )

             if (res.meta.status !== 200) {
                return this.$message.error('删除分类失败')
                 }

              this.$message.success('删除分类成功')
            this.getGoodsList()
        },
        goAddpage(){
            this.$router.push(`/goods/add`)
        }
  }
}

</script>


<style lang="less" scoped>


</style>