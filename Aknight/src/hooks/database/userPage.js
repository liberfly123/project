import { reactive, ref } from "vue"

export function dealUser() {
    //元数据
    let data = JSON.parse(sessionStorage.getItem("medical")).expMedical
    //研发各阶段名称(5个阶段)为了添加/修改表单时需要
    let processList = data.map(item => Reflect.ownKeys(item).slice(2, 7))
    //顺序
    let keys = [
        "medical_name",
        "process",
        "medical_enrollees_population_china",
        "medical_enrollees_population_internal",
        "medical_first_publication",
        "FPIchina",
        "medical_CTR",
        "id"
    ]
    let dataList = []
    let obj = {}
    //研发进度
    let process = ref(0)
    processList.forEach((item, index) => {
        //每次循环前先重置进度
        process = ref(0)
        item.forEach(item1 => {
            Reflect.get(data[index], item1) == 100 ? process.value += 20 : ''
            //添加研发进度
            data[index].process = process.value
            //删除研发阶段
            Reflect.deleteProperty(data[index], item1)
        })
    })
    data.forEach(item1 => {
        keys.forEach(item => {
            Reflect.set(obj, item, item1[item])
        })
        let newObj = { ...obj }
        dataList.push(newObj)
    })
    return reactive({ dataList, processList })
}