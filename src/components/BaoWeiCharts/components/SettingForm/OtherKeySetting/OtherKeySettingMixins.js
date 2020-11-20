export default {
    data() {
        return {
            isShow: false,
            keyNowIndex: null, //当前配置字段索引
            nowKey: '', //当前选中key值
            otherKeySetting: {
                cellRenderer: null, //单元格数据自定义js脚本渲染
                tipRenderer: null, //单元格鼠标移入悬浮框内容自定义js脚本渲染
            }
        }
    },
    methods: {
        //弹窗显示事件
        show(item, index) {
            this.keyNowIndex = index
            for (let key in this.otherKeySetting) {
                if (item[key]) {
                    this.otherKeySetting[key] = item[key]
                }
            }
            this.isShow = true
        },
        //配置确认事件
        onSubmit() {
            Object.assign(this.form.keyArr[this.keyNowIndex], this.otherKeySetting)
            this.isShow = false
                // console.log(this.form.keyArr[this.keyNowIndex])
        },
        //textarea放大事件---js脚本
        enlarge(key) {
            this.nowKey = key
            this.otherKeySetting[key] = this.otherKeySetting[key] ? this.otherKeySetting[key] :
                `function(colums,rowData){
                return ''
             }`
            this.$refs.jsMethodsSetting.show({ jsMethods: this.otherKeySetting[key] })
        },
        //js脚本提交保存事件
        changeJsMethods(jsMethods) {
            this.otherKeySetting[this.nowKey] = jsMethods
        }
    }
}