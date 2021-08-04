import filterDataDefault from './commonWhere.json'

export default {
  data() {
    const _this = this
    return {
      dialogRef: 'screenFormDialog',
      treeData: [],
      nowForm: {}, // 当前选中行数据设置
      tableCloums: [
        {
          label: '表单类型',
          key: 'type',
          width: 120,
          formType: 'select',
          change(items, index, item) {
            _this.typeChange(items, index, item)
          },
          selectArr: [
            {
              val: 'input',
              lab: '输入框'
            },
            {
              val: 'select',
              lab: '下拉框'
            },
            {
              val: 'radio',
              lab: '单选框'
            },
            {
              val: 'checkbox',
              lab: '多选框'
            },
            {
              val: 'number',
              lab: '数字输入框'
            },
            {
              val: 'date',
              lab: '日期选择框'
            },
            {
              val: 'dateTime',
              lab: '时间日期选择框'
            },
            {
              val: 'country-radio',
              lab: '区县-单选'
            },
            {
              val: 'country-select',
              lab: '区县-下拉'
            }, {
              val: 'key-select',
              lab: '字段-下拉'
            }
          ]
        },
        {
          label: '参数名称',
          key: 'key',
          formType: 'input',
          width: 200
        },
        {
          label: '标签',
          key: 'label',
          formType: 'input',
          width: 100,
          change(items, index, item) {
            _this.labelChange(items, index, item)
          },
          click(items, index, item) {
            _this.labelChange(items, index, item)
          }
        },
        {
          label: '左侧标签宽度',
          key: 'labelWidth',
          formType: 'number',
          width: 100
        },
        {
          label: '右侧宽度',
          key: 'rightWidth',
          formType: 'number',
          width: 100,
          defaultValue: 100
        },

        {
          label: '默认值',
          key: 'defaultValue',
          formType: 'inputButton',
          width: 150,
          click(items, index) {
            _this.treeShow(items, index)
          }
        },
        {
          key: 'isInsert',
          label: '是否直接查询',
          formType: 'select',
          selectArr: [
            { lab: '是', val: '1' },
            { lab: '否', val: '0' }
          ],
          defaultValue: '0',
          width: 100
        },
        {
          key: 'isLineFeed',
          label: '是否换行',
          formType: 'select',
          selectArr: [
            { lab: '是', val: '1' },
            { lab: '否', val: '0' }
          ],
          defaultValue: '0',
          width: 80
        },
        {
          key: 'isShow',
          label: '是否显示',
          formType: 'select',
          selectArr: [
            { lab: '是', val: '1' },
            { lab: '否', val: '0' }
          ],
          defaultValue: '1',
          width: 80
        },
        // {
        //     formType: "color",
        //     label: '颜色选择',
        //     key: 'color'
        // },
        {
          label: '其他配置',
          formType: 'other',
          children: [
            {
              label: '配置数据/接口',
              key: 'changeData',
              formType: 'inputButton',
              isHide(form) {
                return ['radio', 'checkbox', 'select'].indexOf(form.type) === -1
              },
              click(form, fatherIndex, item) {
                _this.itemDataChange(form, fatherIndex, item)
              }
            },
            {
              label: '数值变化监听',
              key: 'ChangeJs',
              formType: 'input',
              inputType: 'textarea',
              placeholder: 'function(obj){}',
              rows: 3
            },
            {
              label: '显示样式',
              key: 'styleType',
              formType: 'select',
              isHide(form) {
                return ['checkbox', 'radio'].indexOf(form.type) === -1
              },
              selectArr: [
                { lab: '默认样式', val: '0' },
                { lab: '带有边框', val: '1' },
                { lab: '按钮组', val: '2' }
              ]
            },
            {
              label: '是否结束时间',
              key: 'sfjssj',
              formType: 'select',
              isHide(form) {
                return ['date', 'dateTime'].indexOf(form.type) === -1
              },
              selectArr: [
                { lab: '是', val: '1' },
                { lab: '否', val: '0' }
              ],
              defaultValue: '0'
            },
            {
              label: '是否设置默认值为当前时间',
              key: 'isNewDate',
              formType: 'switch',
              isHide(form) {
                return ['date', 'dateTime'].indexOf(form.type) === -1
              },
              defaultValue: false
            },
            {
              label: '日期类型',
              key: 'dateType',
              formType: 'select',
              isHide(form) {
                return ['date'].indexOf(form.type) === -1
              },
              selectArr: [
                { lab: '年', val: 'year' },
                { lab: '年-月', val: 'month' },
                { lab: '年-月-日', val: 'date' }
              ],
              defaultValue: 'date'
            },
            {
              label: '是否添加时间段选择器',
              key: 'iSaddTimeSlot',
              formType: 'switch',
              // 显示条件1、type类型为'date', 'dateTime' 2、前面一个筛选项类型也必须为'date', 'dateTime'
              isHide(form, index) {
                let offon = true
                if (['date'].indexOf(form.type) > -1) {
                  const kvp = _this.form.filterConfig.screenData[index - 1]
                  if (kvp && ['date'].indexOf(kvp.type) > -1) {
                    offon = false
                  }
                }
                return offon
              },
              defaultValue: false
            },
            {
              label: '是否添加权限管理',
              key: 'isAddPower',
              formType: 'switch',
              isHide(form, index) {
                return ['country-radio'].indexOf(form.type) === -1
              },
              defaultValue: false
            },
            {
              label: '区县划分',
              key: 'countryDivide',
              formType: 'select',
              isHide(form, index) {
                return ['country-radio'].indexOf(form.type) === -1
              },
              selectArr: [
                { lab: '三大片区', val: '0' },
                { lab: '四大片区', val: '1' }
              ],
              defaultValue: '0'
            }
            // , {
            //   label: '选择框显示类型',
            //   key: 'styleType',
            //   formType: 'select',
            //   isHide(form) {
            //     return ['checkbox', 'radio'].indexOf(form.type) === -1
            //   },
            //   selectArr: [
            //     { lab: '默认显示', val: '1' },
            //     { lab: '按钮组显示', val: '2' }
            //   ],
            //   defaultValue: '1'
            // }
          ],
          width: 80
        }
      ],
      btnSettingData: [], // 其他按钮配置数据
      isShowInsertButton: '1', // 是否显示查询按钮  1:是 0：否
      // form.filterConfig.screenData: [],
      otherNowIndex: null,
      nowItem: {} // 当前配置行数据
    }
  },
  mounted() {},
  methods: {
    // 参数值点击弹出树形弹窗选择事件
    treeShow(datas, index) {
      this.getCommonParams()
      this.nowItem = datas
      this.$refs.treeModel.show(datas, 'defaultValue')
    },
    // 项目常用公共参数-值获取
    getCommonParams() {
      this.treeData = []
      // localStorage 存储数据解析
      const len = localStorage.length
      for (let i = 0; i < len; i++) {
        // 获取key 索引从0开始
        var getKey = localStorage.key(i)
        // 获取key对应的值
        var getVal = localStorage.getItem(getKey)
        let nowDataType = typeof getVal
        if (this.isObject(getVal) === 'true') {
          nowDataType = 'object'
        }

        this.treeData.push({
          id: this.treeData.length,
          paramKey: getKey,
          dataType: nowDataType,
          paramValue: getVal
        })
      }
    },
    // 判断字符串是否可转换为对象
    isObject(str) {
      try {
        if (JSON.parse(str) !== undefined) {
          return 'true'
        }
      } catch (e) {
        return e
      }
    },
    // 树形弹窗确认事件
    elTreeSubmit(data) {
      // const item = this.form.paramConfig[this.nowIndex]
      this.nowItem.defaultValue = '${' + data.paramKey + '}'
      // item.dataType = data.dataType
    },
    // 默认参数传递
    getmrParams() {
      const screenData = this.form.filterConfig.screenData
      const paramConfig = this.form.paramConfig
      if (!this.form.paramConfig || this.form.paramConfig.length === 0) return
      paramConfig.forEach(item => {
        let offon = true
        if (item.isUse) {
          screenData.forEach(x => {
            if (x.key === item.paramKey) {
              x.label = item.description
              x.defaultValue = item.paramValue
              offon = false
            }
          })
          if (offon) {
            const obj = {}
            this.tableCloums.forEach(xx => {
              if (xx.children) {
                xx.children.forEach(yy => {
                  obj[yy.key] = null
                })
              } else {
                obj[xx.key] = null
              }
            })
            const obj2 = {
              label: item.description,
              key: item.paramKey,
              defaultValue: item.paramValue,
              isInsert: '0',
              isLineFeed: '0',
              type: 'input',
              rightWidth: 120,
              labelWidth: item.description
                ? item.description.length * 16 + 1
                : 0
            }
            screenData.push(Object.assign(obj, obj2))
          }
        }
      })
    },
    // 是否结束时间变化事件
    isOverTimeChange(items, item) {
      if (items[item.key] === '1') {
        items.label = ''
      }
    },

    // 标签名变化事件--获取自适应右侧标签宽度
    labelChange(items, index, item) {
      // let length=items[item.key]
      if (item.key === 'label' && items.label) {
        const length = items.label.length
        this.$set(items, 'labelWidth', length * 16 + 1)
      }
    },
    // 表单类型变化事件
    typeChange(item, index, config) {
      if (['date', 'dateTime'].indexOf(item.type) === -1) {
        item.sfjssj = '0'
      }
      switch (item.type) {
        case 'input':
          // delete item.dataUrl
          // delete item.arr
          break
        case 'number':
          // delete item.dataUrl
          // delete item.arr
          break
        case 'date':
          // item.styleType = 'date'
          // delete item.dataUrl
          // delete item.arr
          break
        case 'dateTime':
          // delete item.dataUrl
          // delete item.arr
          break
        case 'radio':
          item.rightWidth = null
          break
        case 'checkbox':
          item.rightWidth = null
          break
        case 'country-radio':
          this.checkCountryRadio(item)
          break
      }
    },
    // 区县，单选项选中事件
    checkCountryRadio(item) {
      filterDataDefault.forEach(obj => {
        if (obj.type === item.type) {
          for (const key in obj) {
            item[key] = obj[key]
          }
        }
      })
    },
    // 表单确认事件
    onSubmit(fn) {
      let offon = false
      // 筛选表单配置数据校验
      const conditionAreaConfig = this.form.filterConfig.screenData
      conditionAreaConfig.forEach(item => {
        if (!item.key || !item.type) {
          offon = true
        }
        // if (['radio', 'checkbox', 'select'].indexOf(item.type) > -1) {
        //   if (item.changeData && typeof item.changeData === 'string') {
        //     console.log(typeof item.changeData === 'string', item.changeData)
        //     item.changeData = JSON.parse(item.changeData)
        //     console.log('11')
        //   } else {
        //     console.log(typeof item.changeData === 'string')
        //   }
        // }
      })
      // 其他按钮配置数据校验
      let offon2 = false
      this.btnSettingData.forEach(item => {
        if (!item.name || !item.methodsName || !item.type) {
          offon2 = true
        }
      })
      if (offon || offon2) {
        let err1 = ''
        let err2 = ''
        if (offon) {
          err1 =
            '表单配置写完整(字段名不能为空，单选、多选、下拉框配置数据不能为空);'
        }
        if (offon2) err2 = '其他按钮配置数据未填写完整'
        this.$message({
          type: 'error',
          message: err1 + err2
        })
      } else {
        fn()
      }
    },
    screenSubmit(fn) {
      this.onSubmit(fn)
    },
    // 表单提交事件
    // 数据配置框获取焦点事件
    itemDataChange(form, fatherIndex, item) {
      this.nowForm = form // 当前选中行数据设置
      this.otherNowIndex = fatherIndex
      this.$refs.settingData.show(form[item.key])
    },
    // 数据配置确认事件
    itemDataConfig(val) {
      // this.$set(this.form.filterConfig.screenData[this.otherNowIndex], 'changeData', val)
      // console.log(this.form.filterConfig.screenData[this.otherNowIndex])
      // console.log(typeof val)

      this.nowForm.changeData = val
      // this.form.filterConfig.screenData[this.otherNowIndex]['changeData'] = val
    }
  }
}
