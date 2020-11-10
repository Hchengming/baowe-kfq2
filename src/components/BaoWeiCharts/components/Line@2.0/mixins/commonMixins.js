export default {
    data() {
        return {

        }
    },
    watch: {
        chartType: {
            handler(val) {

            },
            deep: true
        }
    },
    mounted() {

    },
    methods: {
        //echart初始化
        echartsInit() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            let options = {}

            //1、图表边距位置设定
            this.setGridsetGrid(options)

            //2、柱状图/条形图/折线图/雷达图 x轴、y轴公共配置
            if (['histogram', 'bar', 'line', 'radar'].indexOf(chartType) > -1) {
                this.setAxis(options)
            }

            //3、图例显示隐藏控制栏内容
            this.setLegend(options)

            // 绘制图表
            myChart.setOption(options)
                // myChart.setOption({
                //     // title: { text: '在Vue中使用echarts' },
                //     tooltip: {},
                //     xAxis: {
                //         data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                //     },
                //     yAxis: {},
                //     series: [{
                //         name: '销量',
                //         type: 'bar',
                //         data: [5, 20, 36, 10, 10, 20]
                //     }]
                // });
        },
        // 图例显示隐藏控制栏内容
        setLegend(options) {
            this.chartColumn.forEach(item => {
                if (offon && item.ischartsShow) {
                    arr.push(item)
                } else if (!offon && item.isShow) {
                    arr.push(item)
                }
            })
            options.legend = {
                top: 5,
                left: 'center',
                data: ['西凉', '益州', '兖州', '荆州', '幽州']
            },
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
    }
}