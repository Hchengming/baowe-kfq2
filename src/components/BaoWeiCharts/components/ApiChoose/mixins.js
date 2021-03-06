import serviceAxios from '@/utils/request.js'
export default {
    data() {
        return {
            // dataViewList: [], //视图列表
            // itemApiData: [], //应用接口列表
            viewId: ''
        }
    },
    mounted() {
        if (this.form.apiType === '0') {
            this.getDataIview()
        } else {
            this.getItemApi()
        }

    },
    methods: {
        // 项目所有接口获取--应用接口列表获取
        getItemApi() {
            // console.log('serviceId')
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
                    // this.itemApiData = res.data
                    this.$emit('update:itemApiData', res.data)
                }
            })
        },
        // 视图id变化事件
        viewIdChange() {



        },
        // 数据视图列表获取
        getDataIview() {
            let url = ""
                //判断当前后台环境是否为node测试环境
            if (this.settingConfig.isTestEnvironment) {
                url = this.settingConfig.commonUrl + '/dataView/viewList'
            } else {
                url = 'http://23.36.123.128/api/.DataView/view/v1/list?pageNumber=1&pageSize=10000&datasourceId=&viewType=&parentViewId=&viewCodeOrComment=&viewStatus='
            }
            serviceAxios
                .get(
                    url, {
                        params: {
                            appCode: this.settingConfig.answerId
                        }
                    }
                )
                .then(res => {
                    const code = res.code
                    const resData = res.data
                    if (code === 20000) {
                        // this.dataViewList = resData.records
                        this.$emit('update:dataViewList', resData.records)
                    }
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
        }


    }
}