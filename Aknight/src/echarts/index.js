import * as echarts from "echarts"
import { reactive } from 'vue'

let medical = JSON.parse(sessionStorage.getItem("medical"))
//靶向药实验数据的复合折线统计图
export function expMedicals(dom) {
    let source1
    //获取本地存的expMedicals数据
    if (medical != 0) {
        source1 = medical.expMedicals
        if (source1 != null) {
            //处理数据
            source1 = source1.map(item => ({
                medical_name: item.medical_name,//药名
                //id是1-9的是鳞癌药物,其余是非鳞癌药物
                鳞癌ORR: item.id < 10 ? item.medical_ORR.slice(0, item.medical_ORR.indexOf("%")) : "",
                鳞癌OS: item.id < 10 ? (item.medical_OS == "/" ? "" : item.medical_OS) : "",
                非鳞癌ORR: item.id < 10 ? "" : item.medical_ORR.slice(0, item.medical_ORR.indexOf("%")),
                非鳞癌OS: item.id < 10 ? "" : (item.medical_OS == "/" ? "" : item.medical_OS.includes("%") ? item.medical_OS.slice(0, item.medical_OS.indexOf("%")) : item.medical_OS),
                company: item.company,//公司
                medical_Tree: item.medical_TREE,
                id: item.id,
            }))

        } else {
            return
        }
    }
    // console.log(source1);
    let exp = echarts.init(dom)

    let option = {
        title: {
            // 标题
            text: "各公司鳞癌非鳞癌使用情况",
            //位置
            padding: [20, 0, 0, 20],
            textStyle: {
                fontSize: "15px"
            }
        },
        // 数据集
        dataset: {
            //维度
            dimensions: [
                "medical_name",
                "鳞癌ORR",
                "鳞癌OS",
                "非鳞癌ORR",
                "非鳞癌OS",
                "company",
                "medical_Tree",
                "id",
            ],
            // 数据源
            source: source1
        },
        //提示
        tooltip: {
            //跟踪鼠标
            trigger: "axis",
            //提示显示格式和数据
            formatter: function (parmas) {
                // console.log(parmas);
                return `
                <section>
                <span>${parmas[0].dimensionNames[5]}:</span>
                <span style="margin-left:2vw;font-weight:bold">${parmas[0].data.company}</span>
              </section>
              <section>
                <span>${parmas[0].dimensionNames[6]}:</span>
                <span style="margin-left:2vw;font-weight:bold">${parmas[0].data.medical_Tree}</span>
              </section>
              <section>
                <span>${parmas[0].dimensionNames[1]}:</span>
                <span style="margin-left:2vw;font-weight:bold">${parmas[0].data["鳞癌ORR"]}%</span>
              </section>
              <section>
                <span>${parmas[0].dimensionNames[2]}:</span>
                <span style="margin-left:2vw;font-weight:bold">${parmas[0].data["鳞癌OS"]}%</span>
              </section>
              <section>
                <span>${parmas[0].dimensionNames[3]}:</span>
                <span style="margin-left:2vw;font-weight:bold">${parmas[0].data["非鳞癌ORR"]}%</span>
              </section>
              <section>
                <span>${parmas[0].dimensionNames[4]}:</span>
                <span style="margin-left:2vw;font-weight:bold">${parmas[0].data["非鳞癌OS"]}%</span>
              </section>
              `
            }
        },
        xAxis: {
            // x轴
            type: "category",
        },
        yAxis: [
            //y轴 两端
            {
                type: "value",
                min: 0,
                max: 100,
            },
            {
                type: "value",
                min: 0,
                max: 100,
            }
        ],
        // 图例
        legend: {
            orient: "horizontal",
            right: 20,
            top: 20
        },
        // 系列
        series: [
            {
                name: "鳞癌ORR",
                type: 'line',
                label: {
                    show: true,
                    formatter: "{@company}",
                }
            },
            {
                name: "鳞癌OS",
                type: 'line',
                label: {
                    show: true,
                    formatter: "{@company}",
                }
            },
            {
                name: "非鳞癌ORR",
                type: 'line',
                label: {
                    show: true,
                    formatter: "{@company}",
                }
            },
            {
                name: "非鳞癌OS",
                type: 'line',
                label: {
                    show: true,
                    formatter: "{@company}",
                }
            }
        ]


    }
    exp.setOption(option)
}

//各公司所持有的靶向药数据，环状图
export function basicMedical(dom) {
    let newData = reactive([])
    let source2
    let company
    //获取本地存的basicMedical数据
    if (medical != 0) {
        source2 = medical.basicMedical
        if (source2 != null) {
            company = new Set(medical.basicMedical.map(item => item.medical_company))
        } else {
            return
        }
    }
    //给newData添加数据
    function add(item) {
        if (newData.length >= company.size) {
            return
        } else {
            newData.push({
                name: item,
                value: 0,
                label: {
                    formatter:
                        `{b}:{c}款,\n占市场的{d}%`,
                }
            })
        }
    }
    //处理数据,给value计数
    source2.forEach((item) => {
        company.forEach((item1) => {
            add(item1)
            if (item.medical_company == item1) {
                let index = newData.findIndex(item => item.name == item1)
                newData[index].value++
            }
        });
    })

    let bas = echarts.init(dom)

    // console.log(newData);
    let option = {
        title: {
            // 标题
            text: "各公司药物种类数量占比",
            //位置
            padding: [20, 0, 0, 20],
            textStyle: {
                fontSize: "15px"
            }
        },
        tooltip: {},
        // 图例
        legend: {
            orient: "vertical",
            right: 20,
            top: "center",
        },
        // 系列
        series: {
            type: "pie",
            left: -100,
            //饼图半径
            radius: ["50%", "60%"],
            // 避免文字超出圆环范围
            avoidLabelOverlap: false,
            label: {
                position: "center",
                show: false,
            },
            //高亮
            emphasis: {
                label: {
                    show: true,
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#ff0000",
                },
            },
            //数据
            data: newData
        }
    }
    bas.setOption(option)
}

//纳微公司的营销利润与增长率，折柱复合统计图
export function naweiCompany(dom) {
    let sources
    let source3
    let source4
    //获取本地存的naweiCompany数据
    if (medical != 0) {
        sources = medical.naweiCompany
        if (sources != null) {
            //处理数据
            source3 = sources.map(item => item.Profit_from_operations.replace(",", "") * 1)
            source4 = sources.map(item => item.growth_rate01 * 1)
        } else {
            return
        }
    }
    console.log(source3);
    console.log(source4);
    let naw = echarts.init(dom)

    let option = {
        title: {
            // 标题
            text: "2019年12月至2023年6月,纳微公司的营销利润与增长率半年财务报表",
            //位置
            padding: [20, 0, 0, 20],
            textStyle: {
                fontSize: "15px"
            }
        },
        //提示
        tooltip: {
            // 指针轴
            axisPointer: {
                //穿过
                type: "cross"
            }
        },
        xAxis: {
            // x轴
            type: "category",
            data: [
                "2019年12月",
                "2020年06月",
                "2020年12月",
                "2021年06月",
                "2021年12月",
                "2022年06月",
                "2022年12月",
                "2023年06月",
            ]
        },
        yAxis: [
            //y轴 两端
            {
                type: "value",
                min: 1000,
                max: 50000,
            },
            {
                type: "value",
                min: 0,
                max: 150,
            }
        ],
        // 系列
        series: [
            {
                //柱状
                type: "bar",
                name: "营销利润",
                yAxisIndex: 0,
                data: source3
            },
            {
                //折线
                type: "line",
                name: "营销利润增长率",
                yAxisIndex: 1,
                data: source4
            }
        ]


    }
    naw.setOption(option)
}