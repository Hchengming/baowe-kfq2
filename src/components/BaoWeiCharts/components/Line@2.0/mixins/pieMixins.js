export default {
    data() {
        return {
            chooseItem: null //饼图切换选中数据
        }
    },
    methods: {
        //饼图顶部选择按钮点击事件
        pieChange(item) {
            this.chooseItem = item
            this.echartsInit()
        },
        //饼图、环图 series图表显示配置 
        setPieSeries(options) {
            //01 当前数据类选择
            if (!this.chooseItem) {
                this.chooseItem = this.chartColumns[0]
            }
            console.log(this.chooseItem)
                //02 series配置
            let seriesData = [];

            this.data.forEach(item => {
                seriesData.push({
                    value: item[this.chooseItem.key],
                    name: item[this.titleKey]
                })
            })
            options.series = [{
                    name: this.chooseItem.explain,
                    type: 'pie',
                    data: seriesData
                }]
                //03 饼图、环图区分配置
            if (this.chartType === 'ring') {
                options.series[0].radius = ['50%', '70%']
            } else if (this.chartType === 'pie') {
                options.series[0].radius = '55%'
                options.series[0].center = ['50%', '50%']
            }
        }
    }
}