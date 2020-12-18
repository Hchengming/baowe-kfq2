export default {
    props: {
        beforeParamsData: {
            type: Array,
            default: null
        },
        interactiveModuleAll: {
            type: Array,
            default: null
        },
        interactiveData: {
            type: Array,
            default: null
        }
    },
    data() {
        let _this = this;
        return {
            dialogVisible: false,
            fatherIndex: null, //配置行索引
            nowIndex: null, //被交互选中模块索引
            triggerEventAll: [{
                lab: "点击触发",
                val: "click"
            }],
            tableCloums: [{
                    key: "moduleId",
                    label: "模块名称",
                    width: 180,
                    formType: "select",
                    selectArr: [],
                    change(items) {
                        _this.moduleNameChange(items)
                    }
                },
                {
                    key: "moduleType",
                    label: "模块类型",
                    width: 100,
                    formType: "input",
                    disabled: true
                        // selectArr: [{ lab: '图表', val: 'charts' }, { lab: 'iframe框', val: 'iframe' }, { lab: '顶部栏', val: 'topList' }]
                }, {
                    key: "corParams",
                    label: "交互对应参数",
                    width: 180,
                    formType: "select",
                    disabled: false,
                    selectArr: []
                }, {
                    key: "jsMethods",
                    label: "js脚本",
                    width: 200,
                    formType: "input",
                    inputType: 'textarea',
                    rows: 1,
                    disabled: true,
                    click(items, index, item) {
                        if (!item.disabled) {
                            _this.nowIndex = index
                            _this.$refs['jsMethodsSetting'].show(items)
                        }

                    }
                }
            ],
            interactiveObj: {
                paramsChoose: "", //已选择参数
                triggerEvent: "click", //触发事件
                otherModuleConfig: [] //其他模板交互数据
            }
        };
    },
    methods: {
        //取消
        close() {
            this.dialogVisible = false
        },
        //确 定
        onSubmit() {
            this.dialogVisible = false
            this.$emit('interactiveSubmit')
        },
        //当前模块显示事件
        show() {
            this.$nextTick(() => {
                this.dialogVisible = true
                    //获取所有可交互模块
                let arr = [];
                this.interactiveModuleAll.forEach(item => {
                    arr.push({
                        lab: item.moduleName,
                        val: item.moduleId
                    })
                })
                console.log(this.interactiveModuleAll)
                this.tableCloums[0].selectArr = arr
            })

        },
        //js脚本配置后返回数据
        changeJsMethods(data) {
            this.interactiveData[this.fatherIndex].otherModuleConfig[this.nowIndex].jsMethods = data
        },
        //模块类型选择变化事件
        moduleNameChange(items) {
            this.tableCloums[3].disabled = true
            this.tableCloums[2].disabled = false
            items.corParams = ''
            this.interactiveModuleAll.forEach(obj => {
                if (items.moduleId === obj.moduleId) {
                    items.moduleType = obj.type
                    this.tableCloums[2].selectArr = obj.interactiveParams
                    if (obj.type === 'iframe') {
                        this.tableCloums[3].disabled = false
                        this.tableCloums[2].disabled = true
                    }
                }
            })
        },
        //交互配置删除事件
        addInteractive() {
            this.interactiveData.push(this.interactiveObj)
        },
        //配置删除事件
        removeInteractive(index) {
            this.interactiveData.splice(index, 1)
        }
    }
};