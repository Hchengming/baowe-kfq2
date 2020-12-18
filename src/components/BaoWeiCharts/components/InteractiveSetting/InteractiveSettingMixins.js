export default {
    props: {
        beforeParamsData: {
            type: Array,
            default: null
        }
    },
    data() {
        let _this = this;
        return {
            dialogVisible: false,
            nowIndex: null,
            triggerEventAll: [{
                lab: "点击触发",
                val: "click"
            }],
            tableCloums: [{
                key: "moduleId",
                label: "模块名称(id)",
                width: 100,
                formType: "select",
                selectArr: [{ lab: '模块1', val: '0001' }]
            }, {
                key: "moduleType",
                label: "模块类型",
                width: 100,
                formType: "select",

                selectArr: [{ lab: '图表', val: 'charts' }, { lab: 'iframe框', val: 'iframe' }, { lab: '顶部栏', val: 'topList' }]
            }, {
                key: "jsMethods",
                label: "js脚本",
                width: 100,
                formType: "input",
                inputType: 'textarea',
                rows: 1,
                click(items, index) {
                    console.log('00000')
                    _this.nowIndex = index

                    _this.$refs['jsMethodsSetting'].show(items)
                }
            }],
            interactiveData: [{
                paramsChoose: [], //已选择参数
                triggerEvent: "click", //触发事件
                otherModuleConfig: [] //其他模板交互数据
            }]
        };
    },
    methods: {
        //取消
        close() {},
        //确 定
        onSubmit() {},
        //js脚本配置后返回数据
        changeJsMethods(data) {
            // console.log(this.interactiveData)
            this.interactiveData[0].otherModuleConfig[this.nowIndex].jsMethods = data
                // console.log(data)
        },

    }
};