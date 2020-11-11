export default {
    data() {
        return {
            chartColumns: [], //图表配置数据
            titleKey: [], //图表标题字段
        }
    },
    watch: {
        chartType: {
            handler() {
                this.echartsInit()
            },
            deep: true
        }
    },
    mounted() {
        this.echartsInit()
    },
    methods: {

        //echart初始化
        echartsInit() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            let options = {}
                //1、图表字段配置数据获取
            this.setChartColumns()

            //2、图表边距位置设定
            this.setGridsetGrid(options)

            //3、柱状图/条形图/折线图/雷达图 x轴、y轴公共配置
            if (['histogram', 'bar', 'line', 'radar'].indexOf(this.chartType) > -1) {
                this.setAxis(options)
            }

            //4、图例显示隐藏控制栏内容
            this.setLegend(options)

            //5、条形图/柱状图/折线图 x轴，y轴配置
            this.setAxis(options)

            //6、series图表显示配置
            this.setSeries(options)

            // 绘制图表
            myChart.setOption(options)
        },
        //后台返回字段配置数据筛选---删除未勾选字段，查找标题字段
        setChartColumns() {
            this.chartColumns = []
            this.titleKey = ''
            this.chartColumn.forEach(item => {
                    //01 判断是否图表显示
                    if (item.ischartsShow && !item.ischartsTitle) {
                        //01-1 标题、单位字段整合
                        const dw = item.dw ? `(${item.dw})` : ''
                        item.title = item.explain + dw

                        this.chartColumns.push(item)
                    }
                    //02 查找标题字段
                    if (item.ischartsTitle) {
                        this.titleKey = item.key
                    }
                })
                //03 判断是否设置标题字段，若未设置则默认第一条配置字段
            if (!this.titleKey) {
                this.titleKey = this.chartColumn[0].key
            }
        },
        // 图例显示隐藏控制栏内容
        setLegend(options) {
            options.legend = {
                top: 5,
                left: 'center',
                data: []
            }
            this.chartColumns.forEach(item => {
                options.legend.data.push(item.title)
            })
        },
        // 柱状图/条形图/折线图/雷达图 x轴、y轴公共配置
        setAxis(options) {
            options.xAxis.axisLabel = {
                interval: 0,
                rotate: 25,
                fontSize: 10,
                color: '#333333'
            }
            options.yAxis[0].axisLabel = {
                fontSize: 10,
                interval: 0
            }
        },
        //图表边距位置设置
        setGridsetGrid(options) {
            if (!this.titleShow) {
                this.$set(options, 'grid', {
                    top: 15,
                    left: 5,
                    bottom: 0,
                    right: 5
                })
            } else {
                this.$set(options, 'grid', {
                    top: 35,
                    left: 5,
                    bottom: 0,
                    right: 5
                })
            }
        },
        // series图表显示配置  
        setSeries(options) {
            options.series = {

            }
        }
    }
}