export default {
    data() {
        return {
            activeName: "first"
        }
    },
    methods: {
        //tabs切换点击事件
        handleClick() {
            // if (this.activeName === 'first') {
            //     this.$refs['paramKeyConfig'].paramKeyConfigHenx()
            // }
        },
        //筛选项配置数据保存事件
        screenSubmit(fn) {
            this.$refs['screenSetting'].screenSubmit(fn)
        }
    }
}