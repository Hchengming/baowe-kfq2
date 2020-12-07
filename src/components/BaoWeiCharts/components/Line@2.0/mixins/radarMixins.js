export default {
    methods: {
        //series图表显示配置  
        setRadarSeries(options) {
            options.series = [{
                type: 'radar',
                data: []
            }]
            this.chartColumns.forEach((items, indexs) => {
                let obj = {
                    name: items.title,
                    itemStyle: {
                        //柱体背景颜色
                        color: items.zBgColor ? items.zBgColor : this.colorArr[indexs]
                    },
                    value: []
                }

                this.data.forEach(item => {
                    obj.value.push(Number(item[items.key]))
                })
                options.series[0].data.push(obj)
            })
        },
        //雷达图雷达背景布局
        setRadar(options) {
            options.radar = {
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 3,
                        padding: [3, 5]
                    }
                },
                indicator: []
            }
            this.data.forEach(items => {
                let max = 0;
                this.chartColumns.forEach(item => {
                    max = items[item.key] > max ? items[item.key] : max
                })
                let length = Math.floor(max).toString().length - 2
                    // console.log(max, Math.pow(10, length))
                options.radar.indicator.push({
                    name: items[this.titleKey],
                    max: max + Math.pow(10, length) * 2
                })
            })
        },
        //悬浮框 tooltip 配置
        setRadarToopTip(options) {
            options.tooltip = {}
        }
    }
}