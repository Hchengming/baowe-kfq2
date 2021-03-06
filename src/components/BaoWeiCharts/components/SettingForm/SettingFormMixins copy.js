import serviceAxios from '@/utils/request.js'

// 图表组件配置
export const ChartsMixins = {
    data() {
        return {
            isPageDisabled: false,
            listKeyAll: false, // 列表全选
            chartsKeyAll: false, // 图表全选
            rowKey: {
                key: '', // 字段名
                explain: '', // 含义
                dw: '', // 单位
                width: 120, // 列宽度
                isShow: true, // 表格列是否显示
                isCruxKey: false, // 是否作为下级查询参数
                isMapKey: false, // 是否为地图使用字段
                ischartsTitle: false, // 是否为图表标题字段
                ischartsShow: false, // 图表是否显示该字段
                zBgColor: '', // 图表当前字段柱状图，条形图柱背景颜色设置
                cellRenderer: null, // 单元格数据自定义js脚本渲染
                tipRenderer: null, // 单元格鼠标移入悬浮框内容自定义js脚本渲染
                colFixed: 'null', // 表格列固定配置 null/left/right
                colSort: '0', // 列排序功能 0：否 1：是
                proportion: 12 //详情表格类列宽
            },
            proportionAll: [{
                    label: '1',
                    value: 24
                },
                {
                    label: '2/3',
                    value: 16
                },
                {
                    label: '1/2',
                    value: 12
                },
                {
                    label: '1/3',
                    value: 8
                }
            ]
        }
    },
    methods: {
        // 图表字段其他配置按钮点击事件
        otherKeySetting(item, index) {
            this.$refs.otherKeySetting.show(item, index)
        },
        // 多表头配置按钮点击事件
        tableHeaderSetting() {
            this.$refs['tableHeaderSetting'].show()
        },
        // 图表、列表全选按钮控制
        keyChooseAllShow() {
            this.listKeyAll = true
            this.chartsKeyAll = true
            if (this.form.moduleType === '0') {
                this.form.keyArr.forEach(item => {
                    if (item.isShow === false) {
                        this.listKeyAll = false
                    }
                    if (item.ischartsShow === false) {
                        this.chartsKeyAll = false
                    }
                })
            }
        },
        // 列表字段全选功能
        ListkeyChooseChange(offon) {
            this.keyChooseChange('list', offon)
        },
        // 图表字段全选功能
        ChartskeyChooseChange(offon) {
            this.keyChooseChange('charts', offon)
        },
        keyChooseChange(val, offon) {
            this.form.keyArr.forEach(item => {
                if (val === 'list') {
                    item.isShow = offon
                } else if (val === 'charts') {
                    item.ischartsShow = offon
                }
            })
        },
        // 图表标题选中切换事件
        chartsTitleChange(key) {
            this.$nextTick(() => {
                this.form.keyArr.forEach(item => {
                    this.$set(item, 'ischartsTitle', false)
                        // item.ischartsTitle = false
                    if (item.key === key) {
                        this.$set(item, 'ischartsTitle', true)
                            // item.ischartsTitle = offon
                    }
                })
            })
        },
        // 接口类型切换事件
        apiTypeChange(val) {
            this.isPageDisabled = false
            if (val === '0') {
                this.form.isPage = '1'
                this.isPageDisabled = true
                this.form.options = 'POST'
                this.$refs['apiChoose'].getDataIview()
            } else {
                this.form.options = 'GET'
                this.$refs['apiChoose'].getItemApi()
            }
        },
        // 操作按钮配置 按钮点击事件
        operateButtonSetting() {
            this.$refs['operateButtonSetting'].show(this.form.operateButton)
        },
        // 操作按钮配置数据确认事件
        operateButtonSubmit(data) {
            this.form.operateButton = data
            let offon = false
            let num = null
            this.form.keyArr.forEach((item, index) => {
                if (item.key === 'operationButton') {
                    offon = true
                    num = index
                }
            })
            if (data.length > 0) {
                if (!offon) {
                    const objs = {
                        key: 'operationButton',
                        explain: '操作',
                        width: 100
                    }
                    this.setRowKey(objs)

                    this.form.keyArr.push(objs)
                }
            } else {
                if (num !== null) {
                    this.form.keyArr.splice(num, 1)
                }
            }
        },
        // 是否下钻切换事件
        submoduleChange(val) {
            if (val === '1') return false
            let html = ''
            if (this.statisticsAll) {
                if (
                    this.form.clickToShow === 'row' &&
                    this.statisticsAll.isRowDrillDown === '1'
                ) {
                    html =
                        '当前单元格点击下钻已配置子级模块，是否<span class="txt1">强制切换</span>？'
                    this.$refs['judgePop2'].show(html)
                } else if (
                    this.form.clickToShow === 'cell' &&
                    this.statisticsAll.drillDownKeyAll
                ) {
                    html =
                        '当前行点击下钻已配置子级模块，是否<span class="txt1">强制切换</span>？'
                    this.$refs['judgePop2'].show(html)
                }
            }
        },
        // 行点击、单元格点击切换事件
        clickToShowChange(val) {
            let html = ''
            if (this.statisticsAll) {
                if (val === 'row' && this.statisticsAll.drillDownKeyAll) {
                    html =
                        '当前单元格点击已配置子级模块，是否<span class="txt1">强制切换</span>？'
                    this.$refs['judgePop'].show(html, 'cell')
                } else if (
                    val === 'cell' &&
                    this.statisticsAll.isRowDrillDown === '1'
                ) {
                    html =
                        '当前行点击已配置子级模块，是否<span class="txt1">强制切换</span>？'
                    this.$refs['judgePop'].show(html, 'row')
                }
            }
        },
        // 行点击、单元格点击--切换取消事件
        handleClose(clickToShow) {
            this.form.clickToShow = clickToShow
        },
        // 是否下钻切换事件
        handleClose2() {
            this.form.submodule = '1'
        },
        // 字段列表数据获取事件
        getKeys(fn) {
            let params = {}
            this.form.paramConfig.forEach(item => {
                const paramValue = this.getParamValue(item.paramValue)
                if (item.isUse) {
                    switch (item.dataType) {
                        case 'number':
                            if (Number(paramValue)) {
                                this.$set(params, item.paramKey, Number(paramValue))
                            } else {
                                params[item.paramKey] = null
                            }
                            break
                        case 'object':
                            params[item.paramKey] = null
                            if (JSON.parse(paramValue)) {
                                params[item.paramKey] = JSON.parse(paramValue)
                            }
                            break
                        default:
                            params[item.paramKey] = paramValue
                    }
                }
            })

            const options = this.form.options === 'POST' ? 'post' : 'get'
            if (options === 'get') {
                params = {
                    params: params
                }
            }
            const url =
                this.form.url.indexOf('http') > -1 ?
                this.form.url :
                this.dataUrl + this.form.url

            serviceAxios[options](url.replace(/\s*/g, ''), params).then(res => {
                if (res.code === 20000 || res.code === 200) {
                    const resData = res.data

                    fn(resData)
                }
            })
        },
        // 自定义参数-值获取
        getParamValue(val) {
            let paramValue = ''
            if (val && typeof val === 'string' && val.indexOf('${') === 0) {
                const num = val.length - 1
                const key = val.substring(2, num)
                paramValue = localStorage.getItem(key)
            } else {
                paramValue = val
            }
            return paramValue
        },
        // 数据视图配置字段获取事件
        getViewKeysData() {
            const queryParamList = []
            this.form.paramConfig.forEach(item => {
                const paramValue = this.getParamValue(item.paramValue)
                const params = {
                    [item.paramKey]: paramValue
                }
                if (item.isUse) {
                    switch (item.dataType) {
                        case 'number':
                            if (Number(paramValue)) {
                                params[item.paramKey] = Number(paramValue)
                            } else {
                                params[item.paramKey] = null
                            }
                            break
                        case 'object':
                            params[item.paramKey] = JSON.parse(paramValue)
                            break
                        default:
                            params[item.paramKey] = paramValue
                    }
                    queryParamList.push(params)
                }
            })
            if (!this.form.url) return false
            serviceAxios
                .post(this.form.url, {
                    viewId: this.form.viewId,
                    pageSize: 1,
                    pageNumber: 1,
                    queryParamList: queryParamList
                })
                .then(res => {
                    const code = res.code
                    const resData = res.data
                    if (code === 20000) {
                        this.form.keyArr = []
                        for (const key in resData.list[0]) {
                            const obj = {
                                key,
                                explain: key
                            }
                            this.setRowKey(obj)
                            this.form.keyArr.push(obj)
                        }
                    }
                })
        },
        // 字段新增数据格式化
        setRowKey(obj) {
            for (const key in this.rowKey) {
                if (!obj[key]) {
                    obj[key] = this.rowKey[key]
                }
            }
        },
        // 字段获取事件
        getKeysData() {
            if (this.form.apiType === '0') {
                this.getViewKeysData()
                return false
            }
            // 判断应用接口是否已经返回字段信息
            let offon = false
            this.itemApiData.forEach(items => {
                if (items.aaaRequestUrl === this.form.url && items.returnField) {
                    this.form.keyArr = []
                    this.form.detailsTableAll = []
                    items.returnField.forEach(item => {
                        if (this.form.moduleType === '0') {
                            const obj = {
                                key: item.key,
                                explain: item.label
                            }
                            this.setRowKey(obj)
                            this.form.keyArr.push(obj)
                        }
                    })
                    offon = true
                }
            })
            if (offon) return false

            // 没返回情况字段获取
            if (this.form.moduleType === '0') {
                // 图表字段获取
                this.form.keyArr = []
                this.getKeys(resData => {
                    let keysItem = {}
                    if (this.form.isPage === '1') {
                        if (resData.list && resData.list.constructor !== Array) {
                            this.$message({
                                message: '返回数据格式错误，需标准带分页格式数据',
                                type: 'error'
                            })
                            return false
                        }
                        keysItem = resData.list[0]
                    } else {
                        if (resData && resData.constructor !== Array) {
                            this.$message({
                                message: '返回数据格式错误，需返回标准数组',
                                type: 'error'
                            })
                            return false
                        }
                        keysItem = resData[0]
                    }

                    for (const key in keysItem) {
                        const obj = {
                            key: key
                        }
                        this.setRowKey(obj)
                        this.form.keyArr.push(obj)
                    }
                    this.setDefaultKey(this.form.keyArr, '0')
                })
            }
        },
        // 字段配置数据初始化--参数含有字段直接配置label
        setDefaultKey(data, moduleType) {
            data.forEach(items => {
                this.form.paramConfig.forEach(item => {
                    if (items.key === item.paramKey) {
                        if (moduleType === '0') {
                            items.explain = item.description
                        } else {
                            items.title = item.description
                        }
                    }
                })
            })
        },
        // 向上排序
        sortPrev(item, index, offon) {
            if (offon) return
            this.form.keyArr.splice(index, 1)
            this.form.keyArr.splice(index - 1, 0, item)
        },
        // 向下排序
        sortNext(item, index, offon) {
            if (offon) return
            this.form.keyArr.splice(index, 1)
            this.form.keyArr.splice(index + 1, 0, item)
        },
        // 字段新增事件
        keyAdd(index) {
            this.form.keyArr.splice(index + 1, 0, this.rowKey)
        },
        // 字段删除事件
        keyRemove(index) {
            // this.form.keyArr.splice(index, 1)
            const nowKey = this.form.keyArr[index].key
                // 判断当前删除字段是否已经挂载子级，若挂载，则弹出提示信息
            if (
                this.form.submodule === '1' &&
                this.form.clickToShow === 'cell' &&
                this.statisticsAll &&
                this.statisticsAll.drillDownKeyAll.indexOf(nowKey) > -1
            ) {
                const html =
                    '当前字段已配置子级模块，是否<span class="txt1">强制删除</span>？'
                this.$refs['judgePop'].show(html)
                this.deleteKeyIndex = index
            } else {
                this.form.keyArr.splice(index, 1)
            }
        },
        // 强制删除字段确认事件
        judgePopConfirm() {
            this.form.keyArr.splice(this.deleteKeyIndex, 1)
        },
        // 地图链接字段选择变化事件
        isMapKeyChange(item) {
            if (item.isMapKey) {
                this.form.keyArr.forEach(obj => {
                    if (obj.key !== item.key) {
                        obj.isMapKey = false
                    }
                })
            }
        }
    }
}

export const iframeMixins = {
    methods: {
        // iframe选择类型变化事件
        iframeTypeChange(type) {
            if (type === '1') {
                const menuItem = JSON.parse(sessionStorage.getItem('menuItem'))
                this.form.paramConfig = []
                for (const key in menuItem) {
                    if (key !== 'children') {
                        this.form.paramConfig.push({
                            paramKey: key,
                            description: '',
                            paramValue: menuItem[key],
                            dataType: typeof menuItem[key],
                            isUse: false
                        })
                    }
                }
            }
            this.$refs.paramKeyConfig.getCommonParams()
        },
        // iframe参数选择变化事件
        iframeUseChange() {
            const obj = {}
            this.form.paramConfig.forEach(item => {
                if (item.isUse) {
                    obj[item.paramKey] = item.paramValue
                }
            })
            const paramsStr = this.setParamsUrl(obj)
            const num = this.form.iframeAll.iframeUrl.indexOf('html')
            if (num > -1) {
                this.form.iframeAll.iframeUrl =
                    this.form.iframeAll.iframeUrl.substring(0, num + 4) + paramsStr
            } else {
                this.form.iframeAll.iframeUrl = paramsStr
            }
        },
        // 参数配置事件
        setParamsUrl(obj) {
            let result = ''
            let item
            for (item in obj) {
                if (obj[item] && String(obj[item])) {
                    result += `&${item}=${obj[item]}`
                }
            }
            if (result) {
                result = '?' + result.slice(1)
            }
            return result
        }
    }
}
import dataPresentation from './dataPresentation.json'
export const otherMixins = {
    data() {
        return {
            dialogRef: 'settingFormDialog', // 弹出框refs名
            dialogVisible: false,
            options: [],
            rules: [],
            csData: [],
            scrollTop: 0,
            deleteKeyIndex: null,
            settingJsonIsShow: false,
            parentParamsAll: {}, // 父级下钻参数
            defaultData: [{
                title: '',
                num: '',
                area: '',
                rowid: '001'
            }]
        }
    },
    computed: {
        // 字段配置宽度列是否显示
        isWidth() {
            if (
                this.form.displayMode === 'list' ||
                this.form.displayMode === 'table'
            ) {
                return true
            } else {
                return false
            }
        }
    },
    watch: {
        form: {
            handler() {
                this.formInit()
            }
        },
        deep: true

    },
    mounted() {
        this.options = []
        this.formInit()
        dataPresentation.forEach(item => {
            this.options.push({
                value: item.type,
                label: item.title
            })
        })
    },
    methods: {
        // form数据初始化
        formInit() {
            if (!this.form.blankTemplateConfig) {
                this.form.blankTemplateConfig = {}
            }
            // 其他表格配置字段初始化 tableOtherConfig
            if (!this.form.tableOtherConfig) {
                this.$set(this.form, 'tableOtherConfig', {
                        tableType: '0',
                        onlyKey: '',
                        childKey: 'children'
                    })
                    // this.form.tableOtherConfig = {

                // }
            }
        },
        // 内容部分下拉事件
        elDialogBodyScroll() {
            const _this = this
            this.$nextTick(() => {
                const dom = document.querySelector(
                    '#' + this.settingFormId() + ' .el-dialog__body'
                )
                dom.onscroll = function(e) {
                    _this.scrollTop = e.target.scrollTop
                        // console.log(this.scrollTop)
                }
            })
        },
        // 模块id设置
        settingFormId() {
            return this.statisticsAll ?
                'settingForm' + this.statisticsAll.moduleId :
                'settingForm'
        },

        // 通过配置json数据 修改配置数据事件
        setForm(settingForm) {
            for (const key in settingForm) {
                this.form[key] = settingForm[key]
            }
        },
        // 模板类型选择变化事件
        moduleTypeChange() {
            this.form.keyArr = []
            this.form.operateButton = []
            this.form.paramConfig = []
            this.form.detailsTableAll = []
            this.form.tableHeaderConfig = {}
        },
        // 高度一键铺满
        heightMax() {
            this.form.height = 100
            this.form.top = 0
        },
        // 宽度一键铺满
        widthMax() {
            this.form.width = 100
            this.form.left = 0
        },
        // 弹窗关闭事件
        close() {
            this.dialogVisible = false
                // this.$refs['settingForm'].resetFields()
        },
        // 弹窗显示事件
        show(obj) {
            this.dialogVisible = true
            if (obj) {
                this.parentParamsAll = obj
            }

            this.form.isDrafting = !!this.form.isDrafting
                // 内容部分下拉事件
            this.elDialogBodyScroll()
                // 图表、列表全选按钮控制
            this.keyChooseAllShow()
        },
        // 表单确认事件
        onSubmit() {
            this.$refs['chartsDataSettting'].screenSubmit((conditionAreaConfig) => {
                this.form.conditionAreaConfig = conditionAreaConfig
                this.$emit('submit', this.form)
            })
        },
        // 接口名称变化事件
        urlNameChange(val) {
            //  console.log(val)
            this.itemApiData.forEach(item => {
                if (item.apeName === val) {
                    this.form.url = item.aaaRequestUrl
                    this.form.options = item.method
                }
            })
        },
        // 接口路径变化事件
        urlChange(val) {
            this.itemApiData.forEach(item => {
                if (item.aaaRequestUrl === val) {
                    this.form.options = item.method
                    this.form.urlName = item.apeName
                }
            })
        }
    }
}