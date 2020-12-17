export default {
    data() {
        return {
            isShow: false,
            keyNowIndex: null, // 当前配置字段索引
            nowKey: "", // 当前选中key值
            otherKeySetting: {
                cellRenderer: null, // 单元格数据自定义js脚本渲染
                tipRenderer: null, // 单元格鼠标移入悬浮框内容自定义js脚本渲染
                colDataformat: null //表格数据格式化
            },
            form: {}, //表单数据
            otherFormConfig: {}, //表单配置数据
        };
    },
    watch: {
        isShow: {
            handler(val) {
                if (!val) {
                    this.otherKeySetting = {
                        cellRenderer: null,
                        tipRenderer: null,
                        colDataformat: null
                    };
                }
            }
        }
    },
    methods: {
        //带右侧按钮模块点击事件
        inputClick(form, item, index) {
            this.$emit("inputClick", form, item, index)

        },
        //placeholder设置
        placeholder(item) {
            return item.placeholder ? item.placeholder : item.label;
        },
        // 弹窗显示事件
        show(form, otherFormConfig) {
            this.isShow = true;
            this.form = form;
            this.otherFormConfig = otherFormConfig
        },
        // 配置确认事件
        onSubmit() {
            this.isShow = false;
        },
        // textarea放大事件---js脚本
        enlarge(key) {
            this.nowKey = key;
            this.otherKeySetting[key] = this.otherKeySetting[key] ?
                this.otherKeySetting[key] :
                `function(colums,rowData){
                return ''
             }`;
            this.$refs.jsMethodsSetting.show({
                jsMethods: this.otherKeySetting[key]
            });
        },
        // js脚本提交保存事件
        changeJsMethods(jsMethods) {
            this.otherKeySetting[this.nowKey] = jsMethods;
        }
    }
};