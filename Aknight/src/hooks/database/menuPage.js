import { reactive } from 'vue'
export function dealTree() {
    let datalist = JSON.parse(sessionStorage.getItem('medical')).basicMedical
    /* 所有公司名字 */
    let companys
    if (datalist != null) {
        companys = [...new Set(datalist.map((item) => item.medical_company))]
    } else {
        return
    }
    let newData = []
    /*遍历 筛选 */
    datalist.forEach((item) => {
        companys.forEach((item2, index2) => {
            switch (item.medical_company) {
                case item2:
                    cases(index2, item)
            }
        })
    })
    /* 处理的数据结构*/
    function cases(index, item) {
        if (newData[index] == undefined) {
            newData.push({
                id: item.id,
                medical_name: item.medical_name,
                medical_company: item.medical_company,
                medical_target: item.medical_target,
                medical_indications: item.medical_indications,
                medical_treatment: item.medical_treatment,
                medical_area: item.medical_area,
                children: [],
            })
        } else {
            newData[index].children.push({
                id: item.id,
                medical_name: item.medical_name,
                medical_company: item.medical_company,
                medical_target: item.medical_target,
                medical_indications: item.medical_indications,
                medical_treatment: item.medical_treatment,
                medical_area: item.medical_area,
            })
        }
    }
    return reactive({ newData, companys })

}

