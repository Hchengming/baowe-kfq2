export default {
    data() {
        return {
            isShow: false,
            titleColums: [{
                    key: "name",
                    label: "name",
                    placeholder: "标题name",
                    width: 60,
                    formType: "input"
                        //   defaultValue:""
                },
                {
                    key: "label",
                    label: "标签",
                    placeholder: "标签名",
                    width: 60,
                    formType: "input"
                },
            ],
            tabsFormClone: {}
        };
    },
    watch: {
        isShow(val) {
            if (!val) {
                //tabsForm 数据重置
                for (let key in this.tabsFormClone) {
                    this.tabsForm[key] = this.tabsFormClone[key]
                }
            }
        }
    },
    methods: {
        //弹窗显示事件
        show() {
            this.tabsFormClone = JSON.parse(JSON.stringify(this.tabsForm))
            this.isShow = true
        },
        //弹窗关闭事件
        close() {
            this.isShow = false
        },
        //配置确认提交事件
        onSubmit() {
            this.$emit('tabsAdd', this.tabsForm)
            this.isShow = false
        }
    }
}