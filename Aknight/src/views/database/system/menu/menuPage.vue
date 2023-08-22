<template>
  <div class="wirpper" style="display:block;padding:1vw; background-color: white;">
    <!-- 添加查询按钮 -->
    <el-row>
      <el-col :span="7">
        <el-row class="nav" justify="space-around" style="flex-wrap: nowrap;">
          <el-input v-model="search" placeholder="请输入查询内容" style="width: 60vw;" />
          <el-button icon="search" @click="query" type="primary" style="margin-left:1vw">查询</el-button>
          <el-button icon="FolderAdd" type="success" @click="addTable">新增菜单</el-button>
        </el-row>
      </el-col>
    </el-row>
    <!-- 通过搜索控制展示的数据是搜索内容还是初始数据 -->
    <el-table :data="isSearch ? searchData : newData" height="530" style="margin-top: 3vh" row-key="id">
      <el-table-column :fixed="index == 1" v-for="(item, index) in propArr.slice(1)" :key="index" :label="nameArr[index]"
        :prop="item"></el-table-column>
      <el-table-column label="操纵">
        <template #default="scope">
          <el-button link size="small" style="font-size: 12px;margin:0; width:28%;color:#409eff;"
            @click="addTable">新增</el-button>
          <el-button link size="small" style="font-size: 12px;margin:0;width:28%;color:#409eff;"
            @click="setMsg(scope.row)">修改</el-button>
          <el-button link size="small" style="font-size: 12px;margin:0;width:28%;color:#409eff;"
            @click="delMsg(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 吐丝 -->
  <messagePage v-if="controlObj.isTusi"></messagePage>
  <!-- 新增/修改菜单的遮罩层 -->
  <dialogPage>
    <div style=" width: 47vw;
      height:45vh;
      background-color: #fff;
      padding:1vw;
      border-radius: 1vw;" @click.stop>
      <section style="display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3.5vh;">
        <span>{{ isSetMsg ? "修改菜单" : "新增菜单" }}</span>
        <el-icon color="#666" style="cursor: pointer;" @click="cancel">
          <Close></Close>
        </el-icon>
      </section>
      <!-- 表单区 -->
      <el-form :model="addMsg" :rules="rules" ref="ruleMenu"
        style="width: 45vw;display: grid;grid-template-columns: 1fr 1fr;column-gap: 2vw;" status-icon>
        <el-form-item :label="nameArr[1]" style="grid-column: span 2;">
          <el-select style="width:41vw;" v-model="addMsg[propArr[1]]" :placeholder="`请选择对应的${nameArr[1]}`">
            <el-option v-for="(item, index) in companys" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <div v-for="(item, index) in newArr" :key="index">
          <el-form-item :label="newName[index]" :prop="item">
            <el-input style="width:16vw;" v-model="addMsg[item]" :placeholder="`请填写${newName[index]}`"></el-input>
          </el-form-item>
        </div>
        <el-form-item :label="nameArr[5]" style="grid-column: span 2;">
          <el-radio-group v-model="addMsg[propArr[5]]">
            <el-radio label="中国" />
            <el-radio label="国际" />
          </el-radio-group>
        </el-form-item>
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
import { provide, reactive, ref, toRefs } from "vue"
import menuPage from "@/public/database/menu/menuPage.scss"
import { dealTree } from "@/hooks/database/menuPage"
import controlObj from '@/hooks/controlObj'
import { getPage, changePage, diaPage } from '@/hooks/database/page'
export default {
  name: "menuPage",
  setup() {
    /* 菜单数据原始数据 */
    let Datalist = ref(JSON.parse(sessionStorage.getItem("medical")).basicMedical)
    let { newData } = toRefs(dealTree())
    /* 遮罩层所需参数 */
    provide("controlDialog", "isAddMenu")
    /* 搜索框内容 */
    let search = ref('')
    /* 判断是否开始搜索 */
    let isSearch = ref(false)
    /* 搜索框输入时筛选的数据内容 */
    let searchData = ref('')

    /* 点击查询按钮 */
    function query() {
      isSearch.value = true;
      searchData.value = Datalist.value.filter((item) =>
        Object.values(item).includes(search.value)
      )
      if (search.value == '') {
        isSearch.value = false
      }
    }
    /* 验证表单 */
    let ruleMenu = ref("")
    /* 表单输入内容 */
    let addMsg = reactive({})
    let propArr = Reflect.ownKeys(newData.value[0]).slice(0, 7)
    propArr.forEach((item) => {
      if (item != "id") {
        Reflect.set(addMsg, item, "");
      }
    })
    //标头(汉字)
    let nameArr = ["药物名称", "所属公司", "靶向", "线数", "治疗方式", "区域"]
    let number = [0, 2, 3, 4]
    //文字输入框
    let newArr = propArr.filter((_, index) => number.includes(index));
    let newName = nameArr.filter((_, index) => number.includes(index))
    /* 表单规则 */
    const { rules } = getPage(addMsg, nameArr)

    /* 是否是修改内容的按钮 */
    let isSetMsg = ref(false)
    //新增菜单按钮 addTable
    //修改按钮 setMsg
    //删除按钮 delMsg
    const { addTable, setMsg, delMsg } = changePage(addMsg, isSetMsg, "menu")
    // 遮罩层按钮事件
    //提交表单 submitForm
    //取消遮罩层 cancel
    const { submitForm, cancel } = diaPage(isSetMsg, "menu", addMsg)


    return {
      /* 样式 */
      menuPage,
      /* 处理菜单数据结构 */
      ...toRefs(dealTree()),
      /* 搜索框内容 */
      search,
      /* 判断是否开始搜索 */
      isSearch,
      /* 搜索框输入时筛选的数据内容 */
      searchData,
      /* 点击查询按钮 */
      query,
      /* 中文 */
      nameArr,
      newName,
      /* 英文 */
      propArr,
      newArr,
      /* 按钮集合 */
      controlObj,
      /* 新增按钮的事件 */
      addTable,
      /* 表单输入内容 */
      addMsg,
      /* 表单规则 */
      rules,
      /* 表单内提交按钮 */
      submitForm,
      /* 表单内按钮取消 撤销遮罩层 */
      cancel,
      /* 验证表单 */
      ruleMenu,
      /* 是否是修改内容的按钮 */
      isSetMsg,
      /* 修改按钮事件 */
      setMsg,
      /* 删除按钮事件 */
      delMsg,
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 3vh;

  .el-form-item__content {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-end;
  }
}
</style>
