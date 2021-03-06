import serviceAxios from "@/utils/request.js";
export default {
    data() {
        return {
            isPageDisabled: false,
            listKeyAll: false, // 列表全选
            chartsKeyAll: false, // 图表全选
            rowKey: {
                key: '', // 字段名
                explain: '', // 含义
                dw: '', // 单位
                width: 120, // 列宽度
                isShow: true, // 表格列是否显示
                isCruxKey: false, // 是否作为下级查询参数
                isMapKey: false, // 是否为地图使用字段
                ischartsTitle: false, // 是否为图表标题字段
                ischartsShow: false, // 图表是否显示该字段
                zBgColor: '', // 图表当前字段柱状图，条形图柱背景颜色设置
                cellRenderer: null, // 单元格数据自定义js脚本渲染
                tipRenderer: null, // 单元格鼠标移入悬浮框内容自定义js脚本渲染
                colFixed: 'null', // 表格列固定配置 null/left/right
                colSort: '0', // 列排序功能 0：否 1：是
                proportion: 12 //详情表格类列宽
            },
            proportionAll: [{
                    label: '1',
                    value: 24
                },
                {
                    label: '2/3',
                    value: 16
                },
                {
                    label: '1/2',
                    value: 12
                },
                {
                    label: '1/3',
                    value: 8
                }
            ]
        }
    },
    computed: {
        // 字段配置宽度列是否显示
        isWidth() {
            if (
                this.form.displayMode === 'list' ||
                this.form.displayMode === 'table'
            ) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {

        // 图表标题选中切换事件
        chartsTitleChange(key) {
            this.$nextTick(() => {
                this.form.keyArr.forEach(item => {
                    this.$set(item, 'ischartsTitle', false)
                        // item.ischartsTitle = false
                    if (item.key === key) {
                        this.$set(item, 'ischartsTitle', true)
                            // item.ischartsTitle = offon
                    }
                })
            })
        },
        // 地图链接字段选择变化事件
        isMapKeyChange(item) {
            if (item.isMapKey) {
                this.form.keyArr.forEach(obj => {
                    if (obj.key !== item.key) {
                        obj.isMapKey = false
                    }
                })
            }
        },
        // 字段配置-参数获取
        getParamValue(val) {
            let paramValue = ''
            if (val && typeof val === 'string' && val.indexOf('${') === 0) {
                const num = val.length - 1
                const key = val.substring(2, num)
                paramValue = localStorage.getItem(key)
            } else {
                paramValue = val
            }
            return paramValue
        },
        // 数据视图配置字段获取事件
        getViewKeysData() {
            const queryParamList = []
                // console.log(this.form)
            this.form.filterConfig.screenData.forEach(item => {
                const paramValue = this.getParamValue(item.defaultValue)
                queryParamList.push({
                    [item.key]: paramValue
                })
            })
            if (!this.form.url) return false
            serviceAxios
                .post(this.form.url, {
                    viewId: this.form.viewId,
                    pageSize: 1,
                    pageNumber: 1,
                    queryParamList: queryParamList
                })
                .then(res => {
                    const code = res.code
                    const resData = res.data
                    if (code === 20000) {
                        this.form.keyArr = []
                        for (const key in resData.list[0]) {
                            const obj = {
                                key,
                                explain: key
                            }
                            this.setRowKey(obj)
                            this.form.keyArr.push(obj)
                        }
                    }
                })
        },
        // 字段新增数据格式化
        setRowKey(obj) {
            for (const key in this.rowKey) {
                if (!obj[key]) {
                    obj[key] = this.rowKey[key]
                }
            }
        },
        // 字段获取事件
        getKeysData() {
            if (this.form.apiType === "0") {
                this.getViewKeysData();
                return false;
            }

            // 没返回情况字段获取
            if (this.form.moduleType === "0") {
                // 图表字段获取
                this.form.keyArr = [];
                this.getKeys(resData => {
                    let keysItem = {};
                    //判断是否为分页数据
                    if (this.form.isPage === "1") {
                        if (!resData.list || resData.list.constructor !== Array) {
                            this.$message({
                                message: "返回数据格式错误，需标准带分页格式数据",
                                type: "error"
                            });
                            return false;
                        }
                        keysItem = resData.list[0];
                    } else {
                        if (!resData || resData.constructor !== Array) {
                            this.$message({
                                message: "返回数据格式错误，需返回标准数组",
                                type: "error"
                            });
                            return false;
                        }
                        keysItem = resData[0];
                    }
                    for (const key in keysItem) {
                        const obj = {
                            key: key
                        };
                        this.setRowKey(obj);
                        this.form.keyArr.push(obj);
                    }
                });
            }
        },
        // 字段列表数据获取事件
        getKeys(fn) {
            let params = {};
            // this.form.paramConfig.forEach(item => {
            //     const paramValue = this.getParamValue(item.paramValue);
            //     if (item.isUse) {
            //         switch (item.dataType) {
            //             case "number":
            //                 if (Number(paramValue)) {
            //                     this.$set(params, item.paramKey, Number(paramValue));
            //                 } else {
            //                     params[item.paramKey] = null;
            //                 }
            //                 break;
            //             case "object":
            //                 params[item.paramKey] = null;
            //                 if (JSON.parse(paramValue)) {
            //                     params[item.paramKey] = JSON.parse(paramValue);
            //                 }
            //                 break;
            //             default:
            //                 params[item.paramKey] = paramValue;
            //         }
            //     }
            // });
            this.form.filterConfig.screenData.forEach(item => {
                const paramValue = this.getParamValue(item.defaultValue)
                params[item.key] = paramValue
            })
            const options = this.form.options === "POST" ? "post" : "get";
            if (options === "get") {
                params = {
                    params: params
                };
            }
            const url =
                this.form.url.indexOf("http") > -1 ?
                this.form.url :
                this.settingConfig.dataUrl + this.form.url;

            serviceAxios[options](url.replace(/\s*/g, ""), params).then(res => {
                if (res.code === 20000 || res.code === 200) {
                    const resData = res.data;

                    fn(resData);
                }
            });
        },
        // 向上排序
        sortPrev(item, index, offon) {
            if (offon) return;
            this.form.keyArr.splice(index, 1);
            this.form.keyArr.splice(index - 1, 0, item);
        },
        // 向下排序
        sortNext(item, index, offon) {
            if (offon) return;
            this.form.keyArr.splice(index, 1);
            this.form.keyArr.splice(index + 1, 0, item);
        },
        // 字段新增事件
        keyAdd(index) {
            this.form.keyArr.splice(index + 1, 0, this.rowKey);
        },
        // 字段删除事件
        keyRemove(index) {
            // this.form.keyArr.splice(index, 1)
            const nowKey = this.form.keyArr[index].key;
            // 判断当前删除字段是否已经挂载子级，若挂载，则弹出提示信息
            if (
                this.form.submodule === "1" &&
                this.form.clickToShow === "cell" &&
                this.statisticsAll &&
                this.statisticsAll.drillDownKeyAll.indexOf(nowKey) > -1
            ) {
                const html =
                    '当前字段已配置子级模块，是否<span class="txt1">强制删除</span>？';
                this.$refs["judgePop"].show(html);
                this.deleteKeyIndex = index;
            } else {
                this.form.keyArr.splice(index, 1);
            }
        },
        // 操作按钮配置 按钮点击事件
        operateButtonSetting() {
            this.$refs['operateButtonSetting'].show(this.form.operateButton)
        },
        // 多表头配置按钮点击事件
        tableHeaderSetting() {
            this.$refs['tableHeaderSetting'].show()
        },
        // 图表字段其他配置按钮点击事件
        otherKeySetting(item, index) {
            this.$refs.otherKeySetting.show(item, index)
        },

        // 列表字段全选功能
        ListkeyChooseChange(offon) {
            this.keyChooseChange('list', offon)
        },
        // 图表字段全选功能
        ChartskeyChooseChange(offon) {
            this.keyChooseChange('charts', offon)
        },
        keyChooseChange(val, offon) {
            this.form.keyArr.forEach(item => {
                if (val === 'list') {
                    item.isShow = offon
                } else if (val === 'charts') {
                    item.ischartsShow = offon
                }
            })
        },
        // 操作按钮配置数据确认事件
        operateButtonSubmit(data) {
            this.form.operateButton = data
            let offon = false
            let num = null
            this.form.keyArr.forEach((item, index) => {
                if (item.key === 'operationButton') {
                    offon = true
                    num = index
                }
            })
            if (data.length > 0) {
                if (!offon) {
                    const objs = {
                        key: 'operationButton',
                        explain: '操作',
                        width: 100
                    }
                    this.setRowKey(objs)

                    this.form.keyArr.push(objs)
                }
            } else {
                if (num !== null) {
                    this.form.keyArr.splice(num, 1)
                }
            }
        },
    }
};