<template>
  <div class="wirpper" style="width:83vw; height:86vh;display:block;padding:1vw; background-color: white;">
    <!-- 添加查询按钮 -->
    <el-row>
      <el-col :span="7">
        <el-row class="nav" justify="space-around" style="flex-wrap: nowrap">
          <el-input v-model="search" placeholder="请输入查询内容" style="width: 60vw;" />
          <el-button icon="search" @click="query" type="primary" style="margin-left:1vw">查询</el-button>
          <el-button icon="FolderAdd" type="success" @click="addTable">新增菜单</el-button>
        </el-row>
      </el-col>
    </el-row>

    <!-- 通过搜索控制展示的数据是搜索内容还是初始数据 -->
    <el-table :data="pageArr" style="margin-top: 1vh; height: 71vh" row-key="id">
      <el-table-column :label="nameArr[0]" :prop="propArr[0]"></el-table-column>
      <el-table-column :label="nameArr[1]">
        <template #default="scope">
          <el-progress :text-inside="true" :stroke-width="30" :percentage="scope.row[propArr[1]]" />
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in propArr.slice(2)" :key="index" :label="nameArr.slice(2)[index]"
        :prop="item" width="140"></el-table-column>
      <el-table-column label="操纵">
        <template #default="scope">
          <el-button link size="small" style="font-size: 12px;margin:0;width:28%;color:#409eff;"
            @click="setMsg(scope.row)">修改</el-button>
          <el-button link size="small" style="font-size: 12px;margin:0;width:28%;color:#409eff;"
            @click="delMsg(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="demo-pagination-block" style="display: flex; justify-content: center;height:5.5vh;">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
        :small="false" layout="sizes, prev, pager,next,jumper,total"
        :total="isSearch ? searchData.length : dataList.length" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
  <!-- 吐丝 -->
  <messagePage v-if="controlObj.isTusi"></messagePage>
  <!-- 新增/修改菜单的遮罩层 -->
  <dialogPage>
    <div class="addMenu" @click.stop>
      <section style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 3.5vh;">
        <span>{{ isSetMsg ? "修改菜单" : "新增菜单" }}</span>
        <el-icon color="#aaa" style="cursor: pointer" @click="cancel">
          <Close />
        </el-icon>
      </section>
      <!-- 表单 -->
      <el-form :model="addMsg" :rules="rules" ref="ruleMenu"
        style="width: 45vw;display: grid;grid-template-columns: 1fr 1fr;column-gap: 2vw;" status-icon>
        <el-form-item :label="nameArr[1]" style="grid-column: span 2;">
          <el-select style="width:41vw;" v-model="addMsg[propArr[1]]" :placeholder="`请选择对应的${nameArr[1]}`">
            <el-option v-for="(item, index) in process" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <div v-for="(item, index) in newArr" :key="index">
          <el-form-item :label="newName[index]" :prop="item">
            <el-input style="width:16vw;" v-model="addMsg[item]" :placeholder="`请填写${newName[index]}`"></el-input>
          </el-form-item>
        </div>
        <div v-for="(item, index) in propArr.slice(4, 6)" :key="index">
          <el-form-item :label="nameArr.slice(4, 6)[index]" :prop="item">
            <el-date-picker style="width:16vw;" v-model="addMsg[item]" type="date"
              :placeholder="`请填写${nameArr.slice(4, 6)[index]}`" />
          </el-form-item>
        </div>
        <div></div>
        <el-form-item style="padding: 0 3vw">
          <el-button type="primary" @click="submitForm(ruleMenu)" style="margin: 0; width: 45%">
            {{ isSetMsg ? "修改" : "新增" }}</el-button>
          <div style="flex: 1"></div>
          <el-button @click="cancel" style="margin: 0; width: 45%">
            取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </dialogPage>
</template>

<script>
import { provide, ref, reactive, toRefs } from "vue";
import { dealUser } from '@/hooks/database/userPage.js'
import menuPage from "@/public/database/menu/menuPage.scss";
import controlObj from "@/hooks/controlObj";
import { getPage, changePage, diaPage } from '@/hooks/database/page'
export default {
  name: "userPage",
  setup() {
    let { dataList, processList } = toRefs(dealUser())
    provide("controlDialog", "isAddMenu");
    // 用户搜索的内容
    let search = ref("");
    // 是否开启了搜索
    let isSearch = ref(false);
    // 搜索内容展示
    let searchData = ref("");
    // 查询
    //考虑到响应式问题,放在vue文件比较好
    function query() {
      // 开启搜索
      isSearch.value = true;
      // 过滤符合条件的搜索内容
      searchData.value = dataList.value.filter((item) =>
        Object.values(item).includes(search.value)
      );
      // 如果用户未输入搜索内容，内容展示为初始树数据
      if (search.value == "") {
        isSearch.value = false;
      }
    }
    // 验证表单
    let ruleMenu = ref();
    // 表单的内容
    let addMsg = reactive({});
    let propArr = Reflect.ownKeys(dataList.value[0]).slice(0, 7)
    propArr.forEach((item) => {
      if (item != "id") {
        Reflect.set(addMsg, item, "");
      }
    });
    //标头(汉字)
    let nameArr = ["药物名称", "研发进度", "中国入组人数", "国际入组人数", "首次公开日期", "中国FPI注册", "美国CTR认证"]
    let number = [0, 2, 3, 6]
    //文字输入框
    let newArr = propArr.filter((_, index) => number.includes(index));
    let newName = nameArr.filter((_, index) => number.includes(index))
    //进度名称 最开始下拉框选择第一个
    let process = reactive(processList.value[0])
    // 当前页
    let currentPage = ref(2);
    // 单页数量
    let pageSize = ref(10);
    // 分页数组
    let pageArr = ref([]);
    //表单验证规则 rules
    //修改分页数量 handleSizeChange
    //修改当前页数 handleCurrentChange
    const { rules, handleSizeChange, handleCurrentChange } = getPage(addMsg, nameArr, pageArr, currentPage, pageSize, isSearch, searchData, dataList)

    // 声明一个修改的开关
    let isSetMsg = ref(false);
    //新增菜单按钮 addTable
    //修改按钮 setMsg
    //删除按钮 delMsg
    const { addTable, setMsg, delMsg } = changePage(addMsg, isSetMsg, "user", escape)
    // 遮罩层按钮事件
    //提交表单 submitForm
    //取消遮罩层 cancel
    const { submitForm, cancel } = diaPage(isSetMsg, "user", addMsg, process)


    return {
      /* 样式 */
      menuPage,
      /* 搜索框内容 */
      search,
      /* 判断是否开始搜索 */
      isSearch,
      /* 修改的开关 */
      isSetMsg,
      /* 搜索框输入时筛选的数据内容 */
      searchData,
      /* 元数据 */
      dataList,
      /* 中文 */
      nameArr,
      newName,
      /* 英文 */
      propArr,
      newArr,
      /* 验证表单 */
      ruleMenu,
      /* 表单的内容 */
      addMsg,
      //研发进度
      process,
      /* 表单验证规则 */
      rules,
      /* 当前页 */
      currentPage,
      /* 当前页所展示的数量 */
      pageSize,
      /* 分页数组 */
      pageArr,
      /* 按钮集合 */
      controlObj,
      /* 查询 */
      query,
      /* 修改分页数量 */
      handleSizeChange,
      /* 修改当前页数 */
      handleCurrentChange,
      /* 新增按钮 */
      addTable,
      /* 修改按钮 */
      setMsg,
      /* 删除按钮 */
      delMsg,
      /* 提交表单 */
      submitForm,
      /* 取消按钮 */
      cancel
    }
  }
}
</script>

<style lang="scss" scoped></style>
