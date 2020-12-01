export default {
    data() {
        return {
            //tabs配置数据
            tabsConfig: {
                componentType: "tabs", //组件类型   
                title: "", //标题
                width: 30,
                height: 30,
                left: 1,
                top: 1,
                zindex: '8', //视图层级
                isDrafting: false, //是否启用拖拽功能
                mask: false, //是否添加遮罩层
                titleData: [{
                    label: "用户管理",
                    name: "user"
                }, {
                    label: "配置管理",
                    name: "second"
                }]
            }
        }
    },
    methods: {
        //tabs切换一级页面模块新增事件
        tabsAdd(config) {
            // console.log(config)
            this.$refs['middleware'].addKeep(config)
        }
    }
}