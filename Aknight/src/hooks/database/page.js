import { reactive, watch, h, ref } from 'vue'
import controlObj from "@/hooks/controlObj";
// 导入弹框，删除时使用
import { ElMessage, ElMessageBox } from "element-plus";
import { addMenu, setMenu, delMenu } from "@/api/arknight/database/menu";
import url from "@/api/url"


// 页面渲染
export function getPage(addMsg, nameArr, pageArr, currentPage, pageSize, isSearch, searchData, dataList) {
    // 表单验证规则
    let rules = reactive({})
    Reflect.ownKeys(addMsg).forEach((item, index) => {
        Reflect.set(rules, item, {
            required: true,
            message: `请输入${nameArr[index]}`,
            trigger: "blur"
        });
    });
    // 修改分页数量
    const handleSizeChange = () => {
        pageArr.value.splice(0, pageArr.value.length);
    };
    //修改当前页数
    const handleCurrentChange = () => {
        pageArr.value.splice(0, pageArr.value.length);
    };
    if (pageArr) {
        // 监视 currentPage(当前页) 和 pageSize(当前页所展示的数量)
        // 去截取对应位置的数组
        // 去渲染该数组
        watch(
            [currentPage, pageSize, isSearch],
            (newValue) => {
                pageArr.value.splice(0, pageArr.value.length)
                // 是否搜索？// 如果搜索的话，就分页搜索的结果
                newValue[2]
                    ? pageArr.value.push(
                        ...searchData.value.slice(
                            (newValue[0] - 1) * newValue[1],
                            newValue[0] * newValue[1]
                        )) // 如果没有搜索，就分页元数据
                    : pageArr.value.push(
                        ...dataList.value.slice(
                            (newValue[0] - 1) * newValue[1],
                            newValue[0] * newValue[1]
                        ));
            },
            { immediate: true }
        );
    }

    return {
        rules,
        handleSizeChange,
        handleCurrentChange
    }
}

// 修改内容
//userPageu页面需要转义传个标识escape用于区分
export function changePage(addMsg, isSetMsg, name, escape) {
    //通用的清空表单事件
    function clearForm() {
        Reflect.ownKeys(addMsg).forEach((key) => {
            Reflect.set(addMsg, key, "");
        });
    }
    //转义process
    function convertProcessValue(value) {
        const processDeal = {
            20: "Ia",
            40: "Ib_II",
            60: "III",
            80: "NDA",
            100: "market"
        };

        return processDeal[value] || "";
    }
    // 新增菜单按钮
    function addTable() {
        controlObj.isDialog.isAddMenu = true;
        // 打开新增的表单时，清空所有遮罩层的内容
        clearForm()
    }
    // 修改按钮
    function setMsg(item) {
        // 将遮罩层变成修改内容，开启修改开关
        isSetMsg.value = true;
        // 开启遮罩层
        controlObj.isDialog.isAddMenu = true;
        // 将修改内容渲染到修改表格中
        Reflect.ownKeys(addMsg).forEach((key) => {
            Reflect.set(addMsg, key, item[key]);
        });
        if (escape) {
            //进度百分比转义成研发名称
            addMsg.process = convertProcessValue(addMsg.process);
        }

    }
    // 删除按钮
    function delMsg(item) {
        // 这个函数本质上返回的是promise函数
        ElMessageBox({
            // 提示框标题
            title: "删除信息",
            // 提示框渲染的信息，用h函数渲染
            // h(HTMLCollaption:string,CSS:object,html内容:array | string):htmlTag
            message: h("p", { style: "font-size:19px;font-weight:bold;" }, "你确认删除这项信息吗？"),
            // 显示取消按钮
            showCancelButton: true,
            // 确认按钮的文本
            confirmButtonText: "确认",
            // 取消按钮的文本
            cancelButtonText: "取消",
            customClass: "MSGBOX",
            confirmButtonClass: "OKCSS",
            cancelButtonClass: "OKCSS",
            // 在关闭之前的钩子函数
            // action是指用户的行为：用户点击了哪一个按钮
            // instance 点击确认按钮后，提示框结束之前的加载动画
            // done() 确认提示框的行为有无完成的标志
            beforeClose: (action, instance, done) => {
                if (action === "confirm") {
                    // 开启提示框确认按钮的加载动画
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = "Loading...";
                    // 在结束提示框之前去进行请求
                    delMenu(url.database[name].delMenu, item.id)
                    setTimeout(() => {
                        // 结束提示框的行为并关闭提示框
                        done();
                        setTimeout(() => {
                            // 结束提示框确认按钮的加载动画
                            instance.confirmButtonLoading = false;
                        }, 300);
                    }, 3000);
                } else {
                    done();
                }
            }
        })
            .then(() => {
                ElMessage({
                    type: "info",
                    message: `删除成功`
                });
            })
            .catch((err) => console.log(err));
    }

    return {
        addTable,
        setMsg,
        delMsg
    }
}

//遮罩层事件
//userPage页面需要转义用到process, addMsg,别的页面不用传
export function diaPage(isSetMsg, name, addMsg, process = []) {
    // 遮罩层确定按钮  -- 新增或修改
    // 提交表单
    const submitForm = async (formEl) => {
        if (!formEl) return;
        await formEl.validate((valid, fields) => {
            if (valid) {
                controlObj.isDialog.isAddMenu = false;
                if (process.length > 0) {
                    //研发名称转义成研发百分比
                    process.forEach((item, index) => {
                        switch (addMsg.process) {
                            case item:
                                //根据顺序 阶段*20累加
                                addMsg.process = ref((index + 1) * 20)
                                break
                        }
                    })
                }
                // 根据修改的开关来决定是递交修改请求还是新增内容的请求
                isSetMsg.value ? setMenu(url.database[name].setMenu, addMsg) : addMenu(url.database[name].addMenu, addMsg)
                // 将修改的开关关闭
                isSetMsg.value = false;
            } else {
                console.log("error submit!", fields);
            }
        });
    };
    // 取消遮罩层
    function cancel() {
        controlObj.isDialog.isAddMenu = false;
        isSetMsg.value = false;
    }
    return {
        submitForm,
        cancel
    }
}