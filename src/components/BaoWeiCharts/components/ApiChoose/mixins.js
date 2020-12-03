import serviceAxios from '@/utils/request.js'
export default {
    data() {
        return {
            apiList: [],
            viewId: ''
        }
    },
    methods: {
        // 项目所有接口获取--应用接口列表获取
        getItemApi() {
            console.log('serviceId')
            const method = this.settingConfig.isCustomMenu ? 'post' : 'get'
            let url = ''
            if (!this.settingConfig.isCustomMenu) {
                const serviceId = this.settingConfig.serviceId ? this.settingConfig.serviceId : this.settingConfig.answerId;
                url = `http://23.36.123.128/api/shareservice/app/authorizeListByApp?uuid=${serviceId}`
            } else {
                url = this.settingConfig.getInterfaceUrl
            }
            serviceAxios[method](url, {}).then(res => {
                if (res.code === 20000) {
                    res.data.forEach((item, index) => {
                        this.itemApiData[index] = item
                    })

                    // this.itemApiData = res.data
                }
            })
        },
        // 视图id变化事件
        viewIdChange() {
            this.form.url = 'http://23.36.123.128/api/.DataView/view/v1/sql/searchResult'
        },
        // 数据视图列表获取
        getDataIview() {
            // http://23.36.123.128/api/.DataView/view/v1/list?datasourceId=&parentViewId=&viewType=VIEW&viewCodeOrComment=&viewStatus=PUBLISHED&pageNumber=1&pageSize=100000
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
                        this.apiList = resData.records
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
        },
        // 接口路径变化事件
        urlChange(val) {
            this.itemApiData.forEach(item => {
                if (item.aaaRequestUrl === val) {
                    this.form.options = item.method
                    this.form.urlName = item.apeName
                }
            })
        },
        // 字段获取事件
        getKeysData() {
            if (this.form.apiType === '0') {
                this.getViewKeysData()
            } else {
                this.itemApiData.forEach(item => {
                    if (item.aaaRequestUrl === this.form.url && item.param) {
                        this.$emit('getKeysData', item.param)
                    }
                })
            }
        }

    }
}