import serviceAxios from '@/utils/request.js'
export default {
    data() {
        return {
            itemApiData: [], // 项目所有接口数据
            dataViewList: [], // 数据视图列表获取
            topListShow: false,
            // Authorization:
            //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc1NhZG1pbiI6MCwiaXNBZG1pbiI6MSwiZXhwIjoxNjAwMzIyMTMxLCJ1c2VyIjoie1wiYWNjb3VudFwiOlwiY2hlbmN1aVwiLFwiZW1haWxcIjpcIlwiLFwiaWRcIjo0MTMsXCJvZmZpY2VQaG9uZU51bWJlclwiOlwiNTMxNTg5NDBcIixcIm9yZ0Z1bGxOYW1lXCI6XCLnu4Tnu4fmnLrmnoQt5biC6KeE5YiS6Ieq54S26LWE5rqQ5L-h5oGv5Lit5b-DLeeglOWPkee7hC3nu4TlkZhcIixcIm9yZ0Z1bGxOYW1lSURcIjpcIi0xLTI4LTQ1LTEwMjUwXCIsXCJwYXNzd29yZFwiOlwiXCIsXCJwaG9uZVwiOlwiMTM3NTI5MzYxNTZcIixcInFRTnVtYmVyXCI6XCJcIixcInJlbWFya1wiOlwi5bmz5Y-w57u05oqkXCIsXCJzZXhcIjpcIueUt1wiLFwic3RhdGVcIjoxLFwidGlja2V0XCI6XCIyMzZiYWRkNC1lYTk4LTQ3ZWUtYmY5OS1lNWZiMWEzNGZiYzNcIixcInVzZXJOYW1lXCI6XCLpmYjokINcIixcInVzZXJrZXlcIjpcIkE5MUE2NzJBLTY0NEUtNDZFRi05RkRFLUU4QUZGMEUyODA5NFwifSIsImlhdCI6MTU5OTcxNzMzMX0.u17BKpJ8XP_d3yaJ0Ld0-dO0wavfq3tHUlQAB9z4rQdaC5XBLjJ_rzkuyTsdMeX-vXnt2hESEmyQa4pMJQTkAA',
            nowElementId: '', // 当前组件id
            topBarAll: {
                form: {},
                moduleId: '',
                data: [], // 当前顶部数据内容
                configData: [] // 配置数据
            }
        }
    },
    methods: {
        // 项目所有接口获取--应用接口列表获取
        getItemApi() {
            // Authorization: this.Authorization
            const method = this.settingConfig.isCustomMenu ? 'post' : 'get'
            let url = ''
            if (!this.settingConfig.isCustomMenu) {
                const serviceId = this.settingConfig.serviceId ? this.settingConfig.serviceId : this.settingConfig.answerId
                url = `http://23.36.123.128/api/shareservice/app/authorizeListByApp?uuid=${serviceId}`
            } else {
                url = this.settingConfig.getInterfaceUrl
            }
            serviceAxios[method](url, {}).then(res => {
                if (res.code === 20000) {
                    this.itemApiData = res.data
                }
            })
        },
        // 数据视图列表获取
        getDataIview() {
            serviceAxios
                .get(
                    'http://23.36.123.128/api/.DataView/view/v1/list?pageNumber=1&pageSize=10000&datasourceId=&viewType=&parentViewId=&viewCodeOrComment=&viewStatus=', {
                        params: {
                            appCode: this.settingConfig.answerId
                        }
                    }
                )
                .then(res => {
                    const code = res.code
                    const resData = res.data
                    if (code === 20000) {
                        this.dataViewList = resData.records
                    }
                })
        },
        // 顶部栏查询事件
        getTopBarConfig() {
            this.topListShow = false
            serviceAxios
                .post(
                    this.settingConfig.commonUrl +
                    '/busElementConfig/getElementDataByModuleId', { moduleId: this.nowMenuItem.menuId }
                )
                .then(res => {
                    const code = res.code
                    const resData = res.data
                    if (code === 20000) {
                        this.topBarAll.data = []
                        if (resData.length > 0) {
                            this.topListShow = true
                            this.nowElementId = resData[0].elementId
                            const elementConfig = JSON.parse(resData[0].elementConfigs)
                            this.topBarAll.bgColorSettingData = elementConfig.bgColorSettingData
                            this.topBarAll.configData = elementConfig.topBarSettingData
                            this.topBarAll.moduleId = resData[0].moduleId
                            this.topBarAll.form = elementConfig.form
                            this.getTopBarData(elementConfig.form)
                        }
                    }
                })
        },
        // 顶部栏渲染是数据变化事件
        changTopAll(viewcChange) {
            viewcChange(this.topBarAll)
        },
        // 具体数据获取
        getTopBarData(form) {
            // 特殊情况处理 (获取数据格式特殊，默认情况无法处理)
            let sftsqk = false // 当前是否未特殊情况
            this.elementMethods({
                name: '顶部栏数据查询事件',
                methodsName: 'getTopBarData',
                menuId: this.nowMenuItem.menuId,
                config: form,
                sftsqk: offon => {
                    // 是否未特殊情况返回
                    sftsqk = !!offon
                },
                tsqkData: data => {
                    // console.log('resData:', data)
                    // 特殊情况数据处理后返回
                    this.topBarAll.data = data
                }
            })
            if (!sftsqk) {
                const options = form.options === 'GET' ? 'get' : 'post'
                    // form.url = '/kfqcxtj/getKfqmjqkData'
                    // 判断当前接口是完全接口还是测试接口
                let nowUrl = ''
                if (form.url.indexOf('http') > -1) {
                    nowUrl = form.url
                } else {
                    nowUrl = this.settingConfig.dataUrl + form.url
                }
                let reqData = {}
                if (form.paramConfig && form.paramConfig.length > 0) {
                    form.paramConfig.forEach(item => {
                        if (item.isUse) {
                            reqData[item.paramKey] = item.paramValue
                        }
                    })
                }
                reqData = options === 'get' ? { params: reqData } : reqData
                serviceAxios[options](nowUrl, reqData).then(res => {
                    const code = res.code
                    const resData = res.data
                    if (code === 20000) {
                        this.topBarAll.data = resData
                    }
                })
            }
        },
        // 顶部栏新增事件
        topBarAdd(elementConfig, fn) {
            // this.topBarAll = elementConfig.topBarSettingData
            fn()
            const reqObj = {
                moduleId: this.nowMenuItem.menuId,
                elementConfig: elementConfig
            }

            this.topBarEmit(reqObj, '/busElementConfig/insertElementData', '新增', fn)
        },
        // 顶部栏修改事件
        topBarUpdate(elementConfig, fn) {
            const reqObj = {
                moduleId: this.nowMenuItem.menuId,
                elementId: this.nowElementId,
                elementConfig: elementConfig
            }
            this.topBarEmit(reqObj, '/busElementConfig/updateElementData', '修改', fn)
        },
        // 新增、修改提交公共事件
        topBarEmit(reqObj, url, txt, fn) {
            serviceAxios
                .post(this.settingConfig.commonUrl + url, reqObj)
                .then(res => {
                    const code = res.code
                    if (code === 20000) {
                        this.$message({
                            message: txt + '成功',
                            type: 'success'
                        })
                        fn()
                        this.getTopBarConfig()
                    } else {
                        this.$message({
                            message: code + '报错',
                            type: 'error'
                        })
                    }
                })
        },
        // 顶部栏删除事件
        topBarDelete() {
            serviceAxios
                .post(
                    this.settingConfig.commonUrl + '/busElementConfig/deleteElemeteById', { elementId: this.nowElementId, moduleId: this.nowMenuItem.menuId }
                )
                .then(res => {
                    const code = res.code
                    if (code === 20000) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.getTopBarConfig()
                    } else {
                        this.$message({
                            message: code + '报错',
                            type: 'error'
                        })
                    }
                })
        },
        // 顶部菜单点击事件
        topBarClick(item) {
            this.elementMethods({
                name: '顶部菜单点击事件',
                methodsName: 'topBarClick',
                item
            })
            this.topBarInteractive(item)
        }
    }
}