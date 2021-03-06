export default {
    data() {
        return {
            chartColumns: [], // 图表配置数据
            titleKey: [], // 图表标题字段
            offon: true, //图标刷新开关
            fontColor: '#333333',
            xAxisLabel: {
                // x轴label公共配置
                interval: 0,
                rotate: 25,
                fontSize: 12,
                textStyle: {}
            },
            yAxisLabel: {
                fontSize: 12,
                interval: 0,
                textStyle: {}
            },
            colorArr: [
                    '#19D4AE',
                    '#5AB1EF',
                    '#FF7993',
                    '#FFB980',
                    '#0071B6',
                    '#C4B4E4',
                    '#D87A80',
                    '#9CBBFF',
                    '#D9D0C7',
                    '#D49EA2',
                    '#439586',
                    '#63C2FF',
                    '#FA7189',
                    '#486F86',
                    '#D7C6FA',
                    '#39767E',
                    '#7BA3A8',
                    '#E8A51A',
                    '#8BFFFC',
                    '#172421'
                ] // 默认背景颜色集合
        }
    },
    watch: {
        settingConfig: {
            handler() {
                const myChart = this.$echarts.init(this.$refs['myCharts'])
                myChart.resize()
                this.echartsInit()
            },
            deep: true
        },
        // 显示类型变化监听
        chartType: {
            handler() {
                if (this.offon) {
                    this.offon = false
                    setTimeout(() => {
                        console.log()
                        this.offon = true
                    }, 100)
                    const myChart = this.$echarts.init(this.$refs['myCharts'])
                    myChart.resize()
                    this.echartsInit()
                }
            },
            deep: true
        },
        // 数据变化监听
        data: {
            handler() {
                if (this.offon) {
                    this.offon = false
                    setTimeout(() => {
                        this.offon = true
                    }, 100)
                    const myChart = this.$echarts.init(this.$refs['myCharts'])
                    myChart.resize()
                    this.echartsInit()
                }
            },
            deep: true
        },
        // 模块高度变化监听
        settingForm: {
            handler(news, olds) {
                if (news.height !== olds.height || news.width !== olds.width) {
                    const myChart = this.$echarts.init(this.$refs['myCharts'])
                    myChart.resize()
                }
            },
            deep: true
        }
    },
    mounted() {
        this.echartsInit()
    },
    methods: {
        //主题切换
        themeConfjg() {
            switch (this.settingConfig.theme) {
                case 1:
                    this.xAxisLabel.textStyle.color = 'white'
                    this.yAxisLabel.textStyle.color = 'white'
                    break
                case 2:
                    this.xAxisLabel.textStyle.color = '#333333'
                    this.yAxisLabel.textStyle.color = '#333333'
                    break
            }
        },
        // echart初始化
        echartsInit() {


            if (!this.data || this.data.length === 0) return
                // e-charts图表清空，然后重新加载
            if (this.$refs['myCharts'].innerHTML) {
                this.$refs['myCharts'].innerHTML = ''
                this.$refs['myCharts'].removeAttribute('_echarts_instance_')
            }

            // 基于准备好的dom，初始化echarts实例

            const myChart = this.$echarts.init(this.$refs['myCharts'])
            if (!myChart) return
            const options = {}
                // 主题切换照成字体颜色修改
            this.themeConfjg()
                // 1、图表字段配置数据获取
            this.setChartColumns()

            // 2、图表边距位置设定
            this.setGridsetGrid(options)

            // 3、柱状图/条形图/折线图/雷达图 x轴、y轴公共配置
            if (['histogram', 'bar', 'line', 'radar'].indexOf(this.chartType) > -1) {
                this.setAxis(options)
            }

            // 4、图例显示隐藏控制栏内容
            this.setLegend(options)
                // 5、series图表显示配置
            this.setSeries(options)
                // 6、悬浮框 tooltip 配置
            this.setTooltip(options)
                // 7、图表其他设置
            this.otherSetting(options)
                // 8、图形背景颜色设置
            this.setColor(options)
                // 9、鼠标事件
            const _this = this
            myChart.on('click', function(params) {
                _this.chartClick(params, options, myChart)
                _this.$emit('eventClick', params)
            })

            // 绘制图表
            // console.log(this.chartType)
            // console.log(options)
            myChart.setOption(options)
        },
        // 7、图表其他设置
        otherSetting(options) {
            // 01、饼图、环图显示数据设置
            this.pieLabelSetting(options)
        },
        // 图表点击事件
        chartClick(params, options, myChart) {
            // 柱状图、条形图点击状态事件
            if (this.chartType === 'histogram' || this.chartType === 'bar') {
                this.barClick(params, options, myChart)
            }
        },
        // 后台返回字段配置数据筛选---删除未勾选字段，查找标题字段
        setChartColumns() {
            this.chartColumns = []
            this.titleKey = ''
            this.chartColumn.forEach(item => {
                    // 01 判断是否图表显示
                    if (item.ischartsShow && !item.ischartsTitle) {
                        // 01-1 标题、单位字段整合
                        const dw = item.dw ? `(${item.dw})` : ''
                        item.title = item.explain + dw
                            // item.title = item.explain
                        this.chartColumns.push(item)
                    }
                    // 02 查找标题字段
                    if (item.ischartsTitle) {
                        this.titleKey = item.key
                    }
                })
                // 03 判断是否设置标题字段，若未设置则默认第一条配置字段
            if (!this.titleKey) {
                this.titleKey = this.chartColumn[0].key
            }
        },
        // 图例显示隐藏控制栏内容
        setLegend(options) {
            if (!this.titleShow) {
                return
            }
            if (['pie', 'ring'].indexOf(this.chartType) === -1) {
                options.legend = {
                    top: 5,
                    left: 'center',
                    data: [],
                    textStyle: {
                        color: "white"
                    }

                }
                switch (this.settingConfig.theme) {
                    case 1:
                        options.legend.textStyle.color = 'white'
                        break
                    case 2:
                        options.legend.textStyle.color = '#333333'
                        break
                }
                this.chartColumns.forEach(item => {
                    options.legend.data.push(item.title)
                })
            }


        },
        // 柱状图/条形图/折线图 x轴、y轴公共配置
        setAxis(options) {
            // options.xAxis = undefined
            // options.yAxis = undefined
            switch (this.chartType) {
                case 'histogram':
                    this.setBarAxis(options)
                    break
                case 'bar':
                    this.setBarAxis(options)
                    break
                case 'line':
                    this.setLineAxis(options)
                    break
            }
        },
        // 图表边距位置设置
        setGridsetGrid(options) {
            let gridLeft = 10
                // 柱状图/条形图/折线图/雷达图 配置
            if (['histogram', 'bar', 'line', 'radar'].indexOf(this.chartType) > -1) {
                let titleMaxlength = 0
                let vauleMaxlength = 0
                    // 获取y轴为标题轴，数值轴宽度
                this.data.forEach(items => {
                    if (
                        items[this.titleKey] &&
                        items[this.titleKey].length > titleMaxlength
                    ) {
                        titleMaxlength = items[this.titleKey].length
                    }
                    this.chartColumns.forEach(item => {
                        if (
                            item.key !== this.titleKey &&
                            items[item.key] &&
                            items[item.key].toString().length > vauleMaxlength
                        ) {
                            vauleMaxlength = items[item.key].toString().length
                        }
                    })
                })
                if (['histogram', 'line', 'radar'].indexOf(this.chartType) > -1) {
                    const num = Math.floor(vauleMaxlength / 3)
                    gridLeft = vauleMaxlength * 5 + num * 5 + 15
                        // console.log(vauleMaxlength, num, 'bar')
                } else if (['bar'].indexOf(this.chartType) > -1) {
                    gridLeft = titleMaxlength * 11 + 20
                        // console.log(titleMaxlength, 'histogram', gridLeft)
                }
            }
            if (!this.titleShow) {
                this.$set(options, 'grid', {
                    top: 15,
                    left: gridLeft,
                    bottom: 40,
                    right: 5
                })
            } else {
                this.$set(options, 'grid', {
                    top: 35,
                    left: gridLeft,
                    bottom: 40,
                    right: 5
                })
            }
        },
        // 6、悬浮框 tooltip 配置
        setTooltip(options) {
            if (['histogram', 'bar', 'line'].indexOf(this.chartType) > -1) {
                // 柱状图/条形图/折线图/雷达图 配置
                this.setBarToopTip(options)
            } else if (['pie', 'ring'].indexOf(this.chartType) > -1) {
                // 饼图环图配置
                this.setPieToopTip(options)
            } else if (this.chartType === 'radar') {
                // 雷达图
                this.setRadarToopTip(options)
            }
        },
        // 5、series图表显示配置
        setSeries(options) {
            options.series = []
            switch (this.chartType) {
                case 'pie':
                    this.setPieSeries(options)
                    break
                case 'ring':
                    this.setPieSeries(options)
                    break
                case 'histogram':
                    this.setBarSeries(options)
                    break
                case 'bar':
                    this.setBarSeries(options)
                    break
                case 'line':
                    this.setLineSeries(options)
                    break
                case 'radar':
                    this.setRadarSeries(options)
                        // 雷达图雷达背景布局
                    this.setRadar(options)
                    break
            }
        },
        // 8、图形背景颜色设置
        setColor(options) {
            if (['pie', 'ring'].indexOf(this.chartType) > -1) {
                this.setPieColor(options)
            }
        },
        // 图表高度配置
        chartsHeight() {
            let chartsHeight = this.height
                // console.log(['pie', 'ring'].indexOf(this.chartType))
            if (
                this.chartColumns.length > 1 && ['pie', 'ring'].indexOf(this.chartType) > -1
            ) {
                chartsHeight -= 25
            }
            return chartsHeight
        }
    }
}