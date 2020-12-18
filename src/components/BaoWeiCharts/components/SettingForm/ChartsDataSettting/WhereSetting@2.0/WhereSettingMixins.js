import filterDataDefault from './commonWhere.json'

export default {
    data() {
        let _this = this;
        return {
            dialogRef: 'screenFormDialog',
            tableCloums: [{
                    label: '表单类型',
                    key: 'type',
                    width: 120,
                    formType: "select",
                    change(items) {
                        _this.typeChange(items)
                    },
                    selectArr: [{
                            val: 'input',
                            lab: '输入框'
                        },
                        {
                            val: 'select',
                            lab: '下拉框'
                        },
                        {
                            val: 'radio',
                            lab: '单选框'
                        },
                        {
                            val: 'checkbox',
                            lab: '多选框'
                        },
                        {
                            val: 'number',
                            lab: '数字输入框'
                        },
                        {
                            val: 'date',
                            lab: '日期选择框'
                        },
                        {
                            val: 'dateTime',
                            lab: '时间日期选择框'
                        },
                        {
                            val: 'country-radio',
                            lab: '区县-单选'
                        }
                    ]
                },
                {
                    label: '参数名称',
                    key: 'key',
                    formType: "input",
                    width: 80
                },
                {
                    label: '标签',
                    key: 'label',
                    formType: "input",
                    width: 100,
                    click(items, index, item) {
                        _this.labelChange(items, index, item)
                    }
                },
                {
                    label: '左侧标签宽度',
                    key: 'labelWidth',
                    formType: "number",
                    width: 100
                },
                {
                    label: '右侧宽度',
                    key: 'rightWidth',
                    formType: "number",
                    width: 100
                },

                {
                    label: '默认值',
                    key: 'defaultValue',
                    formType: "input",
                    width: 100
                },
                {
                    key: 'isInsert',
                    label: '是否直接查询',
                    formType: "select",
                    selectArr: [{ lab: "是", val: "1" }, { lab: "否", val: "0" }],
                    defaultValue: "0",
                    width: 100
                },
                {
                    key: 'isLineFeed',
                    label: '是否换行',
                    formType: "select",
                    selectArr: [{ lab: "是", val: "1" }, { lab: "否", val: "0" }],
                    defaultValue: "0",
                    width: 80
                }, {
                    key: 'isShow',
                    label: '是否显示',
                    formType: "select",
                    selectArr: [{ lab: "是", val: "1" }, { lab: "否", val: "0" }],
                    defaultValue: "1",
                    width: 80
                },
                // {
                //     formType: "color",
                //     label: '颜色选择',
                //     key: 'color'
                // },
                {
                    label: '其他配置',
                    formType: "other",
                    children: [{
                            label: '配置数据/接口',
                            key: 'changeData',
                            formType: "inputButton",
                            isHide: false,
                            click(form, fatherIndex, item) {
                                _this.itemDataChange(form, fatherIndex, item)
                                    // console.log('配置数据/接口')
                            }
                        }, {
                            label: '显示样式',
                            key: 'styleType',
                            formType: "select",
                            selectArr: [{ lab: "默认样式", val: "0" }, { lab: "带有边框", val: "1" }, { lab: "按钮组", val: "2" }],
                            isHide: false
                        },
                        {
                            label: '是否结束时间',
                            key: 'sfjssj',
                            formType: "select",
                            selectArr: [{ lab: "是", val: "1" }, { lab: "否", val: "0" }],
                            defaultValue: "0",
                            isHide: false
                        }
                    ],
                    width: 80
                }
            ],
            btnSettingData: [], // 其他按钮配置数据
            isShowInsertButton: '1', // 是否显示查询按钮  1:是 0：否
            // form.filterConfig.screenData: [],
            otherNowIndex: null
        }
    },
    mounted() {

    },
    methods: {
        //默认参数传递
        setScreenDefaultData() {
            let screenData = this.form.filterConfig.screenData;
            let paramConfig = this.form.paramConfig
            paramConfig.forEach(item => {
                let offon = true
                if (item.isUse) {
                    screenData.forEach(x => {
                        if (x.key === item.paramKey) {
                            x.label = item.description
                            x.defaultValue = item.paramValue
                            offon = false
                        }
                    })
                    if (offon) {
                        screenData.push({
                            label: item.description,
                            key: item.paramKey,
                            defaultValue: item.paramValue,
                            isInsert: "0",
                            isLineFeed: '0',
                            type: 'input'
                        })
                    }
                }


            })
        },
        // 是否结束时间变化事件
        isOverTimeChange(items, item) {
            if (items[item.key] === '1') {
                items.label = ''
            }
        },

        // 标签名变化事件--获取自适应右侧标签宽度
        labelChange(items, index, item) {
            // let length=items[item.key]
            if (item.key === 'label') {
                const length = items.label.length
                this.$set(items, 'labelWidth', length * 16 + 1)
            }
        },
        // 表单类型变化事件
        typeChange(item) {
            if (['date', 'dateTime'].indexOf(item.type) === -1) {
                item.sfjssj = ''
            }
            console.log(item)
            switch (item.type) {
                case 'input':
                    delete item.dataUrl
                    delete item.arr
                    break
                case 'number':
                    delete item.dataUrl
                    delete item.arr
                    break
                case 'date':
                    item.styleType = 'date'
                    delete item.dataUrl
                    delete item.arr
                    break
                case 'dateTime':
                    delete item.dataUrl
                    delete item.arr
                    break
                case 'radio':
                    item.rightWidth = null
                    break
                case 'checkbox':
                    item.rightWidth = null
                    break
                case 'country-radio':
                    this.checkCountryRadio(item)
                    break
            }
        },
        // 区县，单选项选中事件
        checkCountryRadio(item) {
            filterDataDefault.forEach((obj) => {
                if (obj.type === item.type) {
                    for (const key in obj) {
                        item[key] = obj[key]
                    }
                }
            })
        },
        // 表单确认事件
        onSubmit(fn) {
            let offon = false
                // 筛选表单配置数据校验
                // console.log(this.form.filterConfig.screenData)
                // if (!offon) return
            let conditionAreaConfig = JSON.parse(JSON.stringify(this.form.filterConfig.screenData))
            conditionAreaConfig.forEach((item) => {

                    if (!item.key || !item.type) {
                        offon = true
                    }
                    if (['radio', 'checkbox', 'select'].indexOf(item.type) > -1) {
                        if (item.changeData) {
                            item.changeData = JSON.parse(item.changeData)
                        }
                    }
                })
                // 其他按钮配置数据校验
            let offon2 = false
            this.btnSettingData.forEach((item) => {
                if (!item.name || !item.methodsName || !item.type) {
                    offon2 = true
                }
            })
            if (offon || offon2) {
                let err1 = ''
                let err2 = ''
                if (offon) {
                    err1 =
                        '表单配置写完整(字段名不能为空，单选、多选、下拉框配置数据不能为空);'
                }
                if (offon2) err2 = '其他按钮配置数据未填写完整'
                this.$message({
                    type: 'error',
                    message: err1 + err2
                })
            } else {
                // const datas = JSON.parse(
                //     JSON.stringify({
                //         screenData: conditionAreaConfig,
                //         btnSettingData: this.btnSettingData,
                //         // commonFilterData: this.commonFilterData,
                //         isShowInsertButton: this.isShowInsertButton
                //     })
                // )
                fn()
                    // this.$emit('screenKeep', datas)
            }
        },
        screenSubmit(fn) {
            this.onSubmit(fn)
        },
        //表单提交事件
        // 数据配置框获取焦点事件
        itemDataChange(form, fatherIndex, item) {
            this.otherNowIndex = fatherIndex
            this.$refs.settingData.show(form[item.key])
        },
        // 数据配置确认事件
        itemDataConfig(val) {
            // console.log(val)
            this.form.filterConfig.screenData[this.otherNowIndex]['changeData'] = val
        }
    }
}