import serviceAxios from '@/utils/request.js'
export default {
    data() {
        return {
            apiList: [],
            viewId: ''
        }
    },
    methods: {
        // 视图id变化事件
        viewIdChange() {
            this.form.url = 'http://23.36.123.128/api/.DataView/view/v1/sql/searchResult'
        },
        // 数据视图列表获取
        getDataIview() {

            serviceAxios
                .get(
                    'http://23.36.123.128/api/.DataView/view/v1/list?datasourceId=&parentViewId=&viewType=VIEW&viewCodeOrComment=&viewStatus=PUBLISHED&pageNumber=1&pageSize=100000', {
                        params: {
                            appCode: this.settingConfig.dataIviewCode
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