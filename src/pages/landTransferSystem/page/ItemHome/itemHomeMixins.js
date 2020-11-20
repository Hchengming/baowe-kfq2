// import wkglData from './json/wkgl.json'
import serviceAxios from '@/utils/request.js'
export const commonMixins = {
    data() {
        return {
            year: "2020", //当前选择年份
            searchStyle: {},
            rightTxt: '',
            textArr: [],
            topUrl: "", //顶部栏路径
            nowMapObj: {
                name: "",
                obj: {

                }
            },
            gqqkTextArr: [{
                txt: "已开工,已缴纳",
                color: "#006FFF"
            }, {
                txt: "未开工,未缴纳",
                color: "#FF74E0"
            }, {
                txt: "逾期开工,已缴纳",
                color: "#A86F00"
            }, {
                txt: "逾期开工,未缴纳",
                color: "#FF0000"
            }, ]
        }
    },

    mounted() {
        let _this = this
        window.addEventListener('message', function(event) {

            if (!(typeof event.data === 'string')) return
            let str = event.data.split('|')[1]
            let datas = JSON.parse(str);
            datas.ring = '';
            let event_data = datas.attributes
            var event_new_data = {
                应缴总价款: {
                    总价款: '-',
                    滞纳金: 0,
                    违约金: 0
                },
                实缴总价款: {
                    总价款: '-',
                    滞纳金: 0,
                    违约金: 0,
                    未缴占比: 0
                },
                缴纳详情: []
            }
            if (event_data.报建编号 === '建201920000066') {
                event_new_data = {
                    应缴总价款: {
                        总价款: '48500万',
                        滞纳金: 0,
                        违约金: 0
                    },
                    实缴总价款: {
                        总价款: '48500万',
                        滞纳金: 0,
                        违约金: 0,
                        未缴占比: 0
                    },
                    缴纳详情: [{
                        序号: 1,
                        缴纳金额: '2940.5万',
                        缴纳时间: '2019年4月11日',
                        缴纳书号: '16901301234022',
                        备注: '-',
                    }, {
                        序号: 2,
                        缴纳金额: '2940.5万',
                        缴纳时间: '2019年4月11日',
                        缴纳书号: '16901301234029',
                        备注: '-',
                    }, {
                        序号: 3,
                        缴纳金额: '21309.5万',
                        缴纳时间: '2019年4月11日',
                        缴纳书号: '16901301234025',
                        备注: '-',
                    }, {
                        序号: 4,
                        缴纳金额: '21309.5万',
                        缴纳时间: '2019年4月11日',
                        缴纳书号: '16901301234027',
                        备注: '-',
                    }]
                }
            }
            event_data = Object.assign(event_data, event_new_data)

            _this.$emit('eventData', event_data)
            _this.modeuleShow()
        }, false);
    },
    methods: {
        //触发右侧地图联动事件
        mapChange(name, obj) {
            this.nowMapObj = {
                name,
                obj
            }
            let str = JSON.stringify(obj)
            document.getElementById('mapFrame')
                .contentWindow.postMessage(`${name}|${str}`, '*')

        },
        //顶部栏单元格点击事件
        topBarClick(obj) {
            this.textArr = []
            this.rightTxt = ''
            let nowObj = {
                type: obj.item.code,
                year: this.year
            }

            if (obj.item.code === 'ysxztdxm') return
            this.mapChange('tdgyspjg_top', nowObj)
            this.rightTxt = obj.item.title
            let colorArr = ['#ED8BD7', '#A86F00', '#2C7FEE']



            if (obj.item.code === 'wlyxm') {
                this.textArr = this.gqqkTextArr
            } else {
                obj.item.data.forEach((item, index) => {
                    this.textArr.push({
                        txt: item.label,
                        color: colorArr[index]
                    })
                })
            }
        },


        //图表行点击事件
        rowClick(obj) {
            this.rightTxt = ''
            let title = obj.statisticsAll.contentAreaConfig.title;

            this.textArr = []
                // obj.statisticsAll.contentAreaConfig.keyArr.forEach(item => {
                //     if (item.ischartsShow && !item.ischartsTitle) {
                //         this.textArr.push({
                //             txt: item.explain,
                //             color: item.zBgColor
                //         })
                //     }
                // })
            let nowObj = {
                year: this.year,
                qx: obj.rowItem.qx
            }
            switch (title) {
                case "各区情况":
                    this.mapChange('tdgyspjg_gqqk', nowObj);
                    this.rightTxt = title
                    this.textArr = this.gqqkTextArr
                    break;
                    // case "到期未开工率":
                    //     this.mapChange('tdgyspjg_dqwkgl', nowObj);
                    //     break;
                    // case "闲置土地处置率":
                    //     this.mapChange('tdgyspjg_xztdczl', nowObj);
                    //     break;
            }
        },
        //图表配置数据自定义事件
        setOptions(obj) {
            if (obj.moduleId === '70539b578ea64b5eb91034324bd5c1ad') {
                if (obj.chartType === 'bar') {
                    obj.options.tooltip = {
                        formatter: function(params) {
                            let res = ''
                            let ncmj = null,
                                yczmj = null;
                            params.forEach(item => {
                                if (item.seriesName.indexOf('年初面积') > -1) {
                                    ncmj = item.data
                                } else {
                                    yczmj = item.data
                                }
                            })
                            let bfb =
                                Math.round(yczmj / ncmj * 10000) / 100
                            params.forEach(item => {
                                if (item.seriesName.indexOf('年初面积') > -1) {
                                    res = `${item.seriesName}:${item.data}`
                                } else {
                                    res += `<br/>${item.seriesName}:${item.data}</br><span style="color:#F4B183;padding-left:20px">(处置率:${bfb}%)</span>`
                                }
                            })
                            return res
                        }
                    }
                }
            } else if (obj.moduleId === '247fa24eee50490998e00e1c8aa82242') {
                if (obj.chartType === 'bar') {

                    obj.options.tooltip = {
                        formatter: function(params) {
                            let res = ''
                            let ykgzs = null,
                                wkgzs = null;

                            params.forEach(item => {

                                if (item.seriesName.indexOf('未开工') > -1) {
                                    wkgzs = item.data
                                    res += `<br/>${item.seriesName}:${item.data}</br><span style="color:#F4B183;padding-left:20px">(未开工率:/bfb/%)</span>`
                                } else {
                                    ykgzs = item.data
                                    res = `${item.seriesName}:${item.data}`
                                }
                            })
                            const bfb = Math.round(wkgzs / ykgzs * 10000) / 100
                            res = res.replace('/bfb/', bfb)

                            return res
                        }
                    }
                }
            }
        },
        //图表模块显示隐藏控制事件
        modeuleShow() {
            this.$emit('modeuleShow', {
                moduleId: '2bad2eb0bc024f2fae31a2e20bfe18e6',
                isShow: true
            })
        },
        //页面配置数据加载完成事件
        getPageData(obj) {
            obj.data.forEach(item => {
                if (item.moduleId === '4ca2246f7b994298afe6f08f4e674166') {
                    // 事件查询模块位置调整
                    this.searchStyle = {
                        top: `calc(${item.contentAreaConfig.top-5}% - 3px)`,
                        left: `${item.contentAreaConfig.left}%`,
                        width: `${item.contentAreaConfig.width}%`
                    }
                } else if (item.moduleId === '2bad2eb0bc024f2fae31a2e20bfe18e6') {
                    item.isShow = false

                    // setTimeout(() => {
                    //     this.modeuleShow()
                    // }, 2000)
                }
            })
        },
        //年份选择变化事件
        yearChange(year) {
            this.year = new Date(year).getFullYear().toString()

            this.nowMapObj.obj.year = this.year
            this.mapChange(this.nowMapObj.name, this.nowMapObj.obj)
                //  年份变化照成数据变化事件
            this.yearChangeData()
                //
        },
        //  年份变化照成数据变化事件
        yearChangeData() {
            this.$emit('changTopAll', (obj) => {
                this.topUrl = obj.form.url;
                this.getTopList((data) => {
                    obj.data = data
                })
            })
            this.$emit('changePageData', '748a43ca251444868f23353aa449b482', (item) => {

                this.getGqqkList(item.contentAreaConfig.url, (data) => {
                    item.data = data
                })
            })
        },
        //顶部栏数据请求事件
        getTopList(fn) {
            if (this.topUrl.indexOf('http') === -1) {
                this.topUrl = this.settingConfig.dataUrl + this.topUrl
            }
            serviceAxios.post(this.topUrl, {
                nd: this.year.toString()
            }).then(res => {
                let data = [{
                        title: '合同个数',
                        labelTitle: '项目个数',
                        code: "xmgs",
                        bgColor: '#4472C4',
                        dw: '个',
                        data: []
                    },
                    {
                        title: '总出让用地面积',
                        labelTitle: '出让面积',
                        bgColor: '#4472C4',
                        code: "zcrydmj",
                        dw: "平方米",
                        data: []
                    },
                    {
                        title: '总合同金额',
                        labelTitle: '出让总价',
                        bgColor: '#4472C4',
                        code: "zhtje",
                        dw: "万元",
                        data: []
                    },
                    {
                        title: '正常履约项目',
                        labelTitle: '正常履约项目',
                        bgColor: '#4472C4',
                        code: "zclyxm",
                        dw: "个",
                        data: []
                    },
                    {
                        title: '未履约项目',
                        labelTitle: "",
                        code: "wlyxm",
                        bgColor: '#F4B183',
                        dw: '个',
                        data: []
                    },
                    {
                        title: '疑似土地闲置项目',
                        labelTitle: '疑似闲置项目',
                        bgColor: '#7C7C7C',
                        code: "ysxztdxm",
                        dw: "个",
                        data: [{
                            label: '房地产',
                            dw: "",
                            value: 'XX'
                        }, {
                            label: '产业',
                            dw: "",
                            value: 'XX'
                        }, {
                            label: '其他',
                            dw: "",
                            value: 'XX'
                        }]
                    }
                ]
                data.forEach((items, index) => {
                    if (index === 5) return;
                    for (let key in res.data[0]) {
                        if (items.labelTitle === key) {
                            let obj = {
                                label: '房地产',
                                dw: items.dw,
                                value: res.data[0][key]
                            }
                            if (key.indexOf('出让') === 0) {
                                obj.value = Number(Number(obj.value).toFixed(2))

                            }
                            items.data.push(obj)

                        }
                    }

                    if (items.labelTitle && res.data.length > 0) {
                        items.data.push({
                            label: '产业',
                            dw: items.dw,
                            value: "0"
                        })
                    }
                    for (let key in res.data[1]) {
                        if (items.labelTitle === key) {
                            let obj = {
                                label: '其他',
                                dw: items.dw,
                                value: res.data[1][key]
                            }
                            if (key.indexOf('出让') === 0) {
                                obj.value = Number(Number(obj.value).toFixed(2))

                            }
                            items.data.push(obj)

                        }
                    }


                })
                this.gerWkyData((wkfData) => {
                    data[4].data = wkfData
                    if (fn) {
                        fn(data)
                    }
                })
            })
        },
        // 顶部栏数据查询事件格式化处理
        getTopBarData(obj) {
            if (obj.menuId === '12a2dfa2-e317-4335-9309-4cd8580bfc65') {
                obj.sftsqk(true)
                this.topUrl = obj.config.url
                this.getTopList((data) => {

                    this.textArr = []
                    let colorArr = ['#ED8BD7', '#A86F00', '#2C7FEE']
                    data[0].data.forEach((item, index) => {
                        this.textArr.push({
                            txt: item.label,
                            color: colorArr[index]
                        })
                    })
                    this.rightTxt = data[0].title
                    this.nowMapObj = {
                        name: "tdgyspjg_top",
                        obj: {
                            year: this.year,
                            type: "xmgs"
                        }
                    }
                    obj.tsqkData(data)
                })
            }
        },
        // 未履约数据请求
        gerWkyData(fn) {
            serviceAxios.post(this.settingConfig.dataUrl + '/landTransferSystem/selectWeiLvYueData', {
                nd: this.year.toString()
            }).then(res => {
                // console.log(res)
                const datas = [{
                        label: '未按时缴款',
                        dw: '个',
                        value: res.data['未按时缴款']
                    }, {
                        label: '未按时开工',
                        dw: '个',
                        value: res.data['未按时开工']
                    }, {
                        label: '未按时竣工',
                        dw: '个',
                        value: res.data['未按时竣工']
                    }
                    // , {
                    //     label: '逾期开工,未缴纳',
                    //     dw: '个',
                    //     value: res.data['逾期开工未缴纳']
                    // }
                ]
                fn(datas)

            })
        },
        //各区情况数据请求
        getGqqkList(url, fn) {

            if (url.indexOf('http') === -1) {
                url = this.settingConfig.dataUrl + url
            }
            serviceAxios.post(url, {
                nd: this.year.toString()
            }).then(res => {
                const datas = [{
                        qx: '渝中区'
                    },
                    {
                        qx: "南岸区"
                    },
                    {
                        qx: "沙坪坝区"
                    },
                    {
                        qx: "江北区"
                    },
                    {
                        qx: "九龙坡区"
                    },
                    {
                        qx: "大渡口区"
                    },
                    {
                        qx: "渝北区"
                    },
                    {
                        qx: "巴南区"
                    },
                    {
                        qx: "北碚区"
                    },
                    {
                        qx: "两江新区"
                    },
                    {
                        qx: "高新区"
                    }
                ]
                datas.forEach(items => {
                    res.data.forEach(item => {
                        if (items.qx === item['行政区域']) {
                            for (let key in item) {
                                if (key !== '行政区域') {
                                    item[key] = Number(item[key])
                                    if (item[key] === 0) {
                                        item[key] = '0'
                                    }
                                }
                                items[key] = item[key]
                            }
                            //  = 
                        }

                    })
                })

                if (fn) {

                    fn(datas)
                }
            })

        },
        // 特殊图表数据处理
        getchartsList(obj) {
            let moduleId = obj.config.moduleId
            if (moduleId === '748a43ca251444868f23353aa449b482') {
                // 项目首页--各区情况
                obj.sftsqk(true) // 确认未特殊情况，拦截默认数据请求处理

                this.getGqqkList(obj.config.contentAreaConfig.url, (data) => {
                    obj.tsqkData(data)
                })
            } else if (moduleId === '70539b578ea64b5eb91034324bd5c1ad') {
                // 项目首页--闲置土地处置率
                obj.sftsqk(true) // 确认未特殊情况，拦截默认数据请求处理
                const data = [{
                        qx: '渝中区',
                        ncmj: 3,
                        yczmj: 1
                    },
                    {
                        qx: "南岸区",
                        ncmj: 31,
                        yczmj: 12
                    },
                    {
                        qx: "沙坪坝区",
                        ncmj: 23,
                        yczmj: 18
                    },
                    {
                        qx: "江北区",
                        ncmj: 53,
                        yczmj: 48
                    },
                    {
                        qx: "九龙坡区",
                        ncmj: 43,
                        yczmj: 21
                    },
                    {
                        qx: "大渡口区",
                        ncmj: 35,
                        yczmj: 17
                    },
                    {
                        qx: "渝北区",
                        ncmj: 151,
                        yczmj: 85
                    },
                    {
                        qx: "巴南区",
                        ncmj: 59,
                        yczmj: 4
                    },
                    {
                        qx: "北碚区",
                        ncmj: 56,
                        yczmj: 0
                    },
                    {
                        qx: "两江新区",
                        ncmj: 147,
                        yczmj: 38
                    },
                    {
                        qx: "高新区",
                        ncmj: 585,
                        yczmj: 82
                    },
                ]
                obj.tsqkData(data)
            } else if (moduleId === '247fa24eee50490998e00e1c8aa82242') {
                // 项目首页--未开工率

                obj.sftsqk(true) // 确认未特殊情况，拦截默认数据请求处理
                const data = [{
                        qx: '渝中区',
                        ykgzs: 1,
                        wkgzs: 1
                    },
                    {
                        qx: "南岸区",
                        ykgzs: 48,
                        wkgzs: 31
                    },
                    {
                        qx: "沙坪坝区",
                        ykgzs: 90,
                        wkgzs: 17
                    },
                    {
                        qx: "江北区",
                        ykgzs: 15,
                        wkgzs: 12
                    },
                    {
                        qx: "九龙坡区",
                        ykgzs: 46,
                        wkgzs: 27
                    },
                    {
                        qx: "大渡口区",
                        ykgzs: 30,
                        wkgzs: 3
                    },
                    {
                        qx: "渝北区",
                        ykgzs: 55,
                        wkgzs: 35
                    },
                    {
                        qx: "巴南区",
                        ykgzs: 120,
                        wkgzs: 9
                    },
                    {
                        qx: "北碚区",
                        ykgzs: 83,
                        wkgzs: 51
                    },
                    {
                        qx: "两江新区",
                        ykgzs: 205,
                        wkgzs: 53
                    },
                    {
                        qx: "高新区",
                        ykgzs: 0,
                        wkgzs: 0
                    },
                ]

                // wkglData.forEach(items => {
                //     data.forEach(item => {
                //         if (items['区域'] === item.qx) {
                //             item.ykgzs = items['宗数_1']
                //             item.wkgzs = items['宗数_2']
                //             item.ykgmj = Number(items['总面积_1'].toFixed(2))
                //             item.wkgmj = Number(items['总面积_2'].toFixed(2))
                //         }
                //     })

                // })


                obj.tsqkData(data)
            }

        }
    }
}


export const gqqkMixins = {
    methods: {
        //顶部栏点击触发各区情况点击事件
        changeGqqk(obj) {

            switch (obj.item.title) {
                case "合同个数":
                    break;
            }
        },
        //合同个数数据渲染、变化事件
        changePageData() {

        }
    }
}