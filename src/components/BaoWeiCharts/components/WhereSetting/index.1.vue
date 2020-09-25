<template>
  <!-- 筛选 -->
  <div>
    <el-dialog class="screenForm"
               title="筛选项配置信息"
               :append-to-body="true"
               :visible.sync="isShow">
      <div class="screenBox">
        <el-form ref="form">

          <el-row type="flex"
                  class="row-bg theme-border-color"
                  v-for="(item,index) in screenData"
                  :key="index">
            <el-col :span="5">
              <el-form-item label="表单类型"
                            label-width="65px">
                <el-select @change="typeChange(item)"
                           v-model="item.type"
                           size="small"
                           placeholder="请选择">
                  <el-option v-for="option in typeData"
                             :key="option.value"
                             :label="option.label"
                             :value="option.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-row type="flex">
                <el-col :span="12">
                  <el-form-item label="字段名"
                                label-width="55px">
                    <el-input v-model="item.key"
                              size="small"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label-width="45px"
                                label="标签">
                    <el-input v-model="item.label"
                              size="small"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <!-- <el-col :span="5">
              <el-form-item label="默认值"
                            label-width="90px">
                <el-select v-model="item.sfxjcx"
                           size="small"
                           placeholder="请选择">
                  <el-option label="是"
                             value="1"></el-option>
                  <el-option label="否"
                             value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="5">
              <el-form-item label="下级筛选引用"
                            label-width="90px">
                <el-select v-model="item.sfxjcx"
                           size="small"
                           placeholder="请选择">
                  <el-option label="是"
                             value="1"></el-option>
                  <el-option label="否"
                             value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item v-if="!item.dataUrl&&!item.arr"
                            label-width="70px"
                            label="数据配置">
                <el-input :disabled="['input','number','textarea'].indexOf(item.type)>-1"
                          readonly
                          @click.native="itemDataChange(item,index)"
                          size="small"></el-input>
              </el-form-item>
              <el-form-item v-if="item.dataUrl"
                            label-width="70px"
                            label="数据接口">
                <el-input readonly
                          v-model="item.dataUrl"
                          @click.native="itemDataChange(item,index)"
                          size="small"></el-input>
              </el-form-item>
              <el-form-item v-if="item.arr"
                            label-width="70px"
                            label="选择数据">
                <section :title="JSON.stringify(item.arr)">
                  <el-input readonly
                            v-model="item.arrStr"
                            @click.native="itemDataChange(item,index)"
                            size="small"></el-input>
                </section>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <div class="rightIcon">
                <i @click="sortPrev(item,index,index==0)"
                   :class="['iconfont','iconshangyi','theme-color',{'disabled':index==0}]"></i>
                <i @click="sortNext(item,index,screenData.length-1==index)"
                   :class="['iconfont','iconxiayi','theme-color',{'disabled':screenData.length-1==index}]"></i>
                <i @click="screenDelete(item,index)"
                   class="el-icon-delete"></i>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <div>
          <el-button @click="addScreen"
                     type="primary">新 增</el-button>
        </div>
        <div class="right">
          <el-button @click="isShow=false">取 消</el-button>
          <el-button type="primary"
                     @click="onSubmit">确 定</el-button>
        </div>
      </span>
    </el-dialog>
    <settingData ref="settingData"
                 @itemDataConfig="itemDataConfig"></settingData>
  </div>
</template>
<script>
import settingData from './settingData'
export default {
  components: { settingData },
  props: ['screenAll'],
  data () {
    return {
      isShow: false,
      tableClums: [{
        title: '表单类型',
        key: 'value',
        width: 100
      }, {
        title: '字段名',
        key: 'key',
        width: 100
      }, {
        title: '标签',
        key: 'label',
        width: 100
      }, {
        title: '配置数据/接口',
        key: 'value',
        width: 200
      }, {
        title: '默认值',
        key: 'defaultValue',
        width: 100
      }, {
        title: '操作',
        width: 70
      }],
      // 表单类型
      typeData: [
        {
          value: 'input',
          label: '输入框'
        },
        {
          value: 'select',
          label: '下拉框'
        },
        {
          value: 'radio',
          label: '单选框'
        },
        {
          value: 'checkbox',
          label: '多选框'
        },
        {
          value: 'number',
          label: '数字输入框'
        },
        {
          value: 'tree',
          label: '树形选择框'
        },
        {
          value: 'textarea',
          label: '多行文本框'
        }
      ],
      screenData: [
        {
          type: 'input',
          key: '',
          label: '',
          sfxjcx: '0' // 是否作为下级查询条件 0:否 1：是
        }
      ]
    }
  },
  methods: {
    // 弹窗显示事件
    show (screenData) {
      this.isShow = true
      if (screenData) {
        this.screenData = screenData
        this.screenData.forEach(item => {
          if (item.arr) {
            item.arrStr = JSON.stringify(item.arr)
          }
        })
      }
    },
    // 表单类型变化事件
    typeChange (item) {
      switch (item.type) {
        case 'input':
          delete item.dataUrl
          delete item.arr
          break
        case 'number':
          delete item.dataUrl
          delete item.arr
          break
        case 'tree':
          delete item.arr
          break
      }
    },
    // 表单确认事件
    onSubmit () {
      let offon = false
      this.screenData.forEach(item => {
        delete item.arrStr
        if (!item.key || !item.label || !item.type) {
          offon = true
        }
        if (['radio', 'checkbox', 'select', 'tree'].indexOf(item.type) > -1) {
          if (!item.dataUrl && !item.arr) {
            offon = true
          }
        }
      })
      if (offon) {
        this.$message({
          type: 'error',
          message: '表单未填写完整，请填写完再提交'
        })
      } else {
        let datas = JSON.parse(JSON.stringify(this.screenData))
        // console.log(datas);
        this.$emit('screenKeep', datas)
        this.isShow = false
      }
    },
    // 新增按钮点击事件
    addScreen () {
      this.screenData.push({
        type: 'input',
        key: '',
        label: '',
        sfxjcx: '0' // 是否作为下级查询条件
        // dataUrl: "" //数据接口
      })
    },
    // 向上排序
    sortPrev (item, index, offon) {
      if (offon) return
      this.screenData.splice(index, 1)
      this.screenData.splice(index - 1, 0, item)
    },
    // 向下排序
    sortNext (item, index, offon) {
      if (offon) return
      this.screenData.splice(index, 1)
      this.screenData.splice(index + 1, 0, item)
    },
    // 删除项点击事件
    screenDelete (item, index) {
      this.screenData.splice(index, 1)
    },
    // 数据配置框获取焦点事件
    itemDataChange (item, index) {
      if (['input', 'number', 'textarea'].indexOf(item.type) > -1) return
      this.$refs.settingData.show(item, index)
    },
    // 数据配置确认事件
    itemDataConfig (obj) {
      if (obj.dataUrl) {
        this.$set(this.screenData[obj.index], 'arr', undefined)
        this.$set(this.screenData[obj.index], 'dataUrl', obj.dataUrl)
      } else {
        this.$set(this.screenData[obj.index], 'dataUrl', undefined)
        this.$set(this.screenData[obj.index], 'arr', obj.arr)
        this.$set(
          this.screenData[obj.index],
          'arrStr',
          JSON.stringify(obj.arr)
        )
      }
    }
  }
}
</script>
