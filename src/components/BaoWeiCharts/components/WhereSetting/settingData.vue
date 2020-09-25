<template>
  <!-- 表单项数据配置模块 -->
  <div>
    <el-dialog class="screenForm settingData dialog-common"
               ref="screenFormSettings"
               :append-to-body="true"
               :visible.sync="isShow">
             <div class="headerTitle" slot="title" @mousedown="dragElement">
                     表单项数据配置信息
               </div>   
      <el-form ref="form">
        <el-form-item label="数据源"
                      label-width="65px">
          <el-radio-group v-model="dataType">
            <el-radio :disabled="customDisabled"
                      label="custom">自定义配置</el-radio>
            <el-radio label="dataUrl">接口数据</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="dataType=='dataUrl'"
                      label="数据接口"
                      label-width="65px">
          <el-input v-model="dataUrl"
                    size="small"></el-input>
        </el-form-item>
        <div v-if="dataType=='custom'">
          <el-row type="flex"
                  class="row-bg"
                  v-for="(item,index) in settingData"
                  :key="index">
            <el-col :span="10">
              <el-form-item label="值"
                            label-width="55px">
                <el-input v-model="item.value"
                          size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="标签名"
                            label-width="55px">
                <el-input v-model="item.label"
                          size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <div class="rightIcon">
                <i @click="sortPrev(item,index,index==0)"
                   :class="['iconfont','iconshangyi',{'disabled':index==0}]"></i>
                <i @click="sortNext(item,index,settingData.length-1==index)"
                   :class="['iconfont','iconxiayi',{'disabled':settingData.length-1==index}]"></i>
                <i @click="screenDelete(item,index)"
                   class="el-icon-delete"></i>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <div>
          <el-button @click="addData"
                     size="small"
                     type="primary">新 增</el-button>
        </div>
        <div class="right">
          <el-button size="small"
                     @click="isShow=false">取 消</el-button>
          <el-button size="small"
                     type="primary"
                     @click="onSubmit">确 定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { dragDialog } from '../../utils/mixins.js'
export default {
   mixins: [dragDialog],
  data () {
    return {
      dialogRef:'screenFormSettings',
      isShow: false,
      dataType: 'custom',
      customDisabled: false,
      fatherIndex: null, // 当前数据配置项索引
      dataUrl: '',
      settingData: [
        {
          label: '',
          value: ''
        }
      ]
    }
  },
  methods: {
    // 表单确认事件
    onSubmit () {
      let obj = {
        index: this.fatherIndex
      }
      let offon = false
      let text = ''
      if (this.dataType === 'custom') {
        if (this.settingData.length === 0) {
          offon = true
          text = '自定义配置表单未填写完整'
        } else {
          this.settingData.forEach(item => {
            if (!item.label || !item.value) {
              offon = true
              text = '自定义配置表单未填写完整'
            }
          })
        }
        obj.arr = this.settingData
      } else {
        if (!this.dataUrl) offon = true
        text = '数据接口不能为空'
        obj.dataUrl = this.dataUrl
      }
      if (offon) {
        this.$message({
          type: 'error',
          message: text
        })
      } else {
        this.isShow = false
        this.$emit('itemDataConfig', obj)
      }
    },
    // 弹窗显示事件
    show (item, index) {
      this.isShow = true
      this.fatherIndex = index
      this.settingData = item.arr ? item.arr : [{ label: '', value: '' }]

      this.dataUrl = item.dataUrl ? item.dataUrl : ''
      this.dataType = item.dataUrl ? 'dataUrl' : 'custom'
      this.customDisabled = false
      if (item.type === 'tree') {
        this.dataType = 'dataUrl'
        this.customDisabled = true
      }
    },
    // 数据新增事件
    addData () {
      this.settingData.push({
        label: '',
        value: ''
      })
    },
    // 向上排序
    sortPrev (item, index, offon) {
      if (offon) return
      this.settingData.splice(index, 1)
      this.settingData.splice(index - 1, 0, item)
    },
    // 向下排序
    sortNext (item, index, offon) {
      if (offon) return
      this.settingData.splice(index, 1)
      this.settingData.splice(index + 1, 0, item)
    },
    // 删除项点击事件
    screenDelete (item, index) {
      this.settingData.splice(index, 1)
    }
  }
}
</script>
