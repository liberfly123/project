<template>
  <div class="wirpper" style="width:80vw; height:70vh;display:block;padding:1vw; background-color: white;">
    <!-- 头部 -->
    <el-row>
      <el-col :span="7">
        <el-row class="nav" justify="space-around" style="flex-wrap: nowrap">
          <el-input v-model="search" placeholder="请输入查询内容" style="width: 60vw;" />
          <el-button icon="search" @click="query" type="primary" style="margin-left:1vw">查询</el-button>
          <el-button icon="FolderAdd" type="success" @click="addTabMenu">新增菜单</el-button>
        </el-row>
      </el-col>
    </el-row>

    <!-- 主体 -->
    <el-table :data="isSearch ? searchData : newList" style="margin-top: 1.5vh" row-key="id">
      <el-table-column label="日期" prop="time"></el-table-column>
      <el-table-column label="税前利润/元" prop="Profit_before_tax"></el-table-column>
      <el-table-column label="总利润/元" prop="Profit_from_operations" width="140"></el-table-column>
      <el-table-column label="下半年增长/%" prop="growth_rate01"></el-table-column>
      <el-table-column label="上半年增长/%" prop="growth_rate05"></el-table-column>
      <el-table-column label="当前资产/元" prop="Current_Assets" width="140"></el-table-column>
      <el-table-column label="未分配利润/元" prop="Undistributed_profits" width="140"></el-table-column>
      <el-table-column label="总资产/元" prop="Total_Equity_of_owners" width="140"></el-table-column>

      <el-table-column label="操纵">
        <template #default="scope">
          <el-button type="text" size="mini" style="font-size: 12px;margin:0;width:28%;"
            @click="setTabMenu(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <dialogPage>
    <!-- 头部区 -->
    <div style=" width: 40vw;
      height:50vh;
      background-color: #fff;
      padding:1vw;
      border-radius: 1vw;" @click.stop>
      <section style="display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3.5vh;">
        <span>{{ isSetMsg ? "修改菜单" : "新增菜单" }}</span>
        <el-icon color="#666" style="cursor: pointer;" @click="cancel2">
          <Close></Close>
        </el-icon>
      </section>

      <!-- 表单区 -->
      <el-form :model="addTab" :rules="rules" ref="ruleMenu">
        <el-form-item label="日期" prop="请输入日期">
          <el-date-picker v-model="addTab.time" type="date" placeholder="请输入日期" style="width: 100%" />
        </el-form-item>

        <div style="display: flex; justify-content: space-between">
          <el-form-item label="税前利润" prop="税前利润" style="flex: 3">
            <el-input v-model="addTab.Profit_before_tax" placeholder="税前利润"></el-input>
          </el-form-item>

          <div style="flex: 0.5"></div>
          <el-form-item label="总利润" prop="总利润" style="flex: 3">
            <el-input v-model="addTab.Profit_from_operations" placeholder="总利润"></el-input>
          </el-form-item>
        </div>

        <div style="display: flex; justify-content: space-between;">
          <el-form-item label="上半年增长" prop="上半年增长" style="flex: 2.5">
            <el-input v-model="addTab.growth_rate05" placeholder="上半年增长"></el-input>
          </el-form-item>

          <div style="flex: 0.7"></div>

          <el-form-item label="下半年增长" prop="下半年增长" style="flex: 3.25">
            <el-input v-model="addTab.growth_rate01" placeholder="下半年增长"></el-input>
          </el-form-item>
        </div>

        <div style="display: flex; justify-content: space-between">
          <el-form-item label="当前资产" prop="当前资产" style="flex: 2.5">
            <el-input v-model="addTab.Current_Assets" placeholder="当前资产"></el-input>
          </el-form-item>
          <div style="flex: 0.5"></div>
          <el-form-item label="未分配利润" prop="未分配利润" style="flex: 3.25">
            <el-input v-model="addTab.Undistributed_profits" placeholder="未分配利润"></el-input>
          </el-form-item>
        </div>

        <div>
          <el-form-item label="总资产" prop="总资产" style="flex: 3.25">
            <el-input v-model="addTab.Total_Equity_of_owners" placeholder="总资产"></el-input>
          </el-form-item>
        </div>


        <el-form-item>
          <div>
            <div style="flex: 1;"></div>
            <el-button style="width:60px" @click="cancel">取消</el-button>
            <el-button style="width:60px" @click="submitForm(ruleMenu)" type="primary">
              {{ isSetMsg ? "修改" : "新增" }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </dialogPage>
</template>
<script>
import { ref, provide, reactive } from 'vue';
import controlObj from '@/hooks/controlObj'
import menuPage from "@/public/database/menu/menuPage.scss";
import { addMenu, setMenu } from "@/api/arknight/database/department"
export default {
  name: "departmentPage",
  setup() {
    let search = ref("")
    let isSearch = ref(false)
    let searchData = ref("")
    /* 搜索 原数据 */
    let dataList = JSON.parse(sessionStorage.getItem("medical")).naweiCompany
    console.log(dataList);
    /* 日期数组 */
    let timeArr = [
      "2019年6月",
      "2019年12月",
      "2020年6月",
      "2020年12月",
      "2021年6月",
      "2021年6月",
      "2022年6月",
      "2022年12月",
    ]
    /* 新数据 */
    let newList = dataList.map((item, index) => ({
      time: timeArr[index],
      Profit_before_tax: item.Profit_before_tax,
      Profit_from_operations: item.Profit_from_operations,
      growth_rate01: item.growth_rate01,
      growth_rate05: item.growth_rate05,
      Current_Assets: item.Current_Assets,
      Undistributed_profits: item.Undistributed_profits,
      Total_Equity_of_owners: item.Total_Equity_of_owners,
    }))

    /* 搜索按钮事件 */
    function query() {
      isSearch.value = true;
      searchData.value = newList.filter((item) =>
        Object.values(item).includes(search.value)
      )
      if (search.value == '') {
        isSearch.value = false
      }
    }

    provide("controlDialog", "isAddMenu");

    /* 表单元素 */
    let ruleMenu = ref()
    /* 表单内容 */
    let addTab = reactive({
      time: '',
      Profit_before_tax: "",
      Profit_from_operations: "",
      growth_rate01: "",
      growth_rate05: "",
      Current_Assets: "",
      Undistributed_profits: "",
      Total_Equity_of_owners: "",
    })

    /* 添加新的菜单 */
    function addTabMenu() {
      controlObj.isDialog.isAddMenu = true;
      Reflect.ownKeys(addTab).forEach((key) => {
        Reflect.set(addTab, key, '')
      })
    }
    /* 修改按钮开关 */
    let isSetMsg = ref(false);
    /* 修改菜单 */
    function setTabMenu(item) {
      isSetMsg.value = true;
      console.log(item);
      Reflect.ownKeys(addTab).forEach((key) => {
        Reflect.set(addTab, key, item[key]);
      });
      console.log(addTab.time);
      controlObj.isDialog.isAddMenu = true;
    }

    const submitForm = async (formEl) => {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          console.log(valid);
          controlObj.isDialog.isAddMenu = false;
          // 根据修改的开关来决定是递交修改请求还是新增内容的请求
          isSetMsg.value ? setMenu(addTab) : addMenu(addTab);
          // 将修改的开关关闭
          isSetMsg.value = false;
        } else {
          console.log(fields);
          console.log("error submit!", fields);
        }
      });
    };





    function cancel() {
      controlObj.isDialog.isAddMenu = false;
      isSetMsg.value = false
    }
    function cancel2() {
      controlObj.isDialog.isAddMenu = false;
    }


    return {
      menuPage,
      search,
      isSearch,
      searchData,
      query,
      dataList,
      timeArr,
      newList,
      ruleMenu, addTab,
      addTabMenu,
      isSetMsg,
      setTabMenu,
      submitForm,
      cancel,
      cancel2,
    }
  }
}
</script>

<style lang="scss" scoped></style>
