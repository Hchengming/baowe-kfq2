// 详情表格配置
export const DetailsTable = {
  data() {
    return {
      chooseKey: '', // 当前选中key
      proportionAll: [
        {
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
    //字段新增事件
    detailsTableKeyAdd() {
      // console.log(this.form.detailsTableAll)
      if (!this.form.detailsTableAll) {
        // this.form.detailsTableAll = []
        this.$set(this.form, 'detailsTableAll', [])
        // this.form
      }
      this.form.detailsTableAll.push({
        sort: this.form.detailsTableAll.length + 1,
        key: '',
        title: '',
        proportion: 12,
        isShow: true
      })
    },
    //字段删除功能
    detailsTableKeyDelete(index) {
      this.form.detailsTableAll.splice(index, 1)
      this.form.detailsTableAll.forEach((item, index) => {
        item.sort = index + 1
      })
    },
    // 序号变化事件
    detailsTableSortChange(sort, index) {
      if (sort <= 1) {
        sort = 1
      } else if (sort >= this.form.detailsTableAll.length) {
        sort = this.form.detailsTableAll.length
      }
      // console.log(sort, index)
      if (sort >= this.form.detailsTableAll.length) {
        sort = this.form.detailsTableAll.length
      }

      let settingDataClone = JSON.parse(
        JSON.stringify(this.form.detailsTableAll)
      )
      let chooseItem = this.form.detailsTableAll[index]
      settingDataClone.splice(index, 1)
      settingDataClone.splice(sort - 1, 0, chooseItem)
      settingDataClone.forEach((item, index) => {
        item.sort = index + 1
      })
      this.form.detailsTableAll = []
      this.$nextTick(() => {
        this.form.detailsTableAll = settingDataClone
      })
    }
  }
}
import serviceAxios from '@/utils/request.js'

// 图表组件配置
export const ChartsMixins = {
  data() {
    return {}
  },
  methods: {
    //多表头配置按钮点击事件
    tableHeaderSetting(){
      
    },
    //操作按钮配置 按钮点击事件
    operateButtonSetting() {
      this.$refs['operateButtonSetting'].show(this.form.operateButton)
    },
    //操作按钮配置数据确认事件
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
          this.form.keyArr.push({
            key: 'operationButton',
            explain: '操作',
            dw: '',
            width: 100,
            isShow: true,
            isCruxKey: false,
            isMapKey: false
          })
        }
      } else {
        if (num !== null) {
          this.form.keyArr.splice(num, 1)
        }
      }
    },
    //是否下钻切换事件
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
    //字段列表数据获取事件
    getKeys(fn) {
      let params = {}
      this.form.paramConfig.forEach(item => {
        if (item.isUse) {
          switch (item.dataType) {
            case 'number':
              if (Number(item.paramValue)) {
                this.$set(params, item.paramKey, Number(item.paramValue))
                // params[item.paramKey] = Number(item.paramValue)
                // console.log(params[item.paramKey])
              } else {
                params[item.paramKey] = null
              }
              break
            case 'object':
              params[item.paramKey] = null
              if (JSON.parse(item.paramValue)) {
                params[item.paramKey] = JSON.parse(item.paramValue)
              }
              break
            default:
              params[item.paramKey] = item.paramValue
          }
        }
      })
      // console.log(params)
      let options = this.form.options === 'POST' ? 'post' : 'get'
      if (options === 'get') {
        params = {
          params: params
        }
      }
      let url =
        this.form.url.indexOf('http') > -1
          ? this.form.url
          : this.dataUrl + this.form.url
      // console.log(url.replace(/\s*/g, ''))
      serviceAxios[options](url.replace(/\s*/g, ''), params).then(res => {
        if (res.code === 20000 || res.code === 200) {
          let resData = res.data
          // console.log(resData)
          fn(resData)
        }
      })
    },
    //字段获取事件
    getKeysData() {
      //判断应用接口是否已经返回字段信息
      let offon = false
      this.itemApiData.forEach(items => {
        if (items.aaaRequestUrl === this.form.url && items.returnField) {
          this.form.keyArr = []
          this.form.detailsTableAll=[]
          items.returnField.forEach(item=>{
            if (this.form.moduleType === '0') {
              this.form.keyArr.push({
                key: item.key,
                explain: item.label,
                dw: '',
                width: 120,
                isShow: true,
                isCruxKey: false,
                isMapKey: false
              })
            }else if (this.form.moduleType === '2'){
              this.form.detailsTableAll.push({
                key:item.key,
                title:item.label,
                sort: this.form.detailsTableAll.length + 1,
                proportion: 12,
                isShow: true
              })
            }
           
          })
          offon = true
        }
      })
      if (offon) return false

      //没返回情况字段获取
      if (this.form.moduleType === '0') {
        //图表字段获取
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

          for (let key in keysItem) {
            this.form.keyArr.push({
              key: key,
              explain: '',
              dw: '',
              width: 100,
              isShow: true,
              isCruxKey: false,
              isMapKey: false
            })
          }
          this.setDefaultKey(this.form.keyArr, '0')
        })
      } else if (this.form.moduleType === '2') {
        //详情列表字段获取
        this.form.detailsTableAll = []
        this.getKeys(resData => {
          for (let key in resData) {
            this.form.detailsTableAll.push({
              key: key,
              title: '',
              sort: this.form.detailsTableAll.length + 1,
              proportion: 12,
              isShow: true
            })
          }
          this.setDefaultKey(this.form.detailsTableAll, '2')
        })
      }
    },
    //字段配置数据初始化--参数含有字段直接配置label
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
      this.form.keyArr.splice(index + 1, 0, {
        key: '',
        explain: '',
        width: 120,
        dw: '',
        isCruxKey: false,
        isShow: true
      })
    },
    // 字段删除事件
    keyRemove(index) {
      // this.form.keyArr.splice(index, 1)
      let nowKey = this.form.keyArr[index].key
      // 判断当前删除字段是否已经挂载子级，若挂载，则弹出提示信息
      if (
        this.form.submodule === '1' &&
        this.form.clickToShow === 'cell' &&
        this.statisticsAll &&
        this.statisticsAll.drillDownKeyAll.indexOf(nowKey) > -1
      ) {
        let html =
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
    //地图链接字段选择变化事件
    isMapKeyChange(item) {
      if (item.isMapKey) {
        this.form.keyArr.forEach(obj => {
          if (obj.key != item.key) {
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
        let menuItem = JSON.parse(sessionStorage.getItem('menuItem'))
        this.form.paramConfig = []
        for (let key in menuItem) {
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
    //iframe参数选择变化事件
    iframeUseChange() {
      let obj = {}
      this.form.paramConfig.forEach(item => {
        if (item.isUse) {
          obj[item.paramKey] = item.paramValue
        }
      })
      let paramsStr = this.setParamsUrl(obj)
      let num = this.form.iframeAll.iframeUrl.indexOf('html')
      if (num > -1) {
        this.form.iframeAll.iframeUrl =
          this.form.iframeAll.iframeUrl.substring(0, num + 4) + paramsStr
      } else {
        this.form.iframeAll.iframeUrl = paramsStr
      }
    },
    //参数配置事件
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
