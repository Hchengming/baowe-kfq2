<template>
  <!-- 表单项数据配置模块 -->
  <div>
    <el-dialog
      ref="screenFormSettings"
      class="screenForm settingData dialog-common"
      :append-to-body="true"
      :visible.sync="isShow"
    >
      <div slot="title" class="headerTitle" @mousedown="dragElement">
        表单项数据配置信息
      </div>
      <el-form ref="form">
        <el-form-item label="数据源" label-width="65px">
          <el-radio-group v-model="dataType">
            <el-radio :disabled="customDisabled" label="custom">
              自定义配置
            </el-radio>
            <el-radio disabled label="dataUrl">接口数据</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="dataType == 'dataUrl'"
          label="数据接口"
          label-width="65px"
        >
          <el-input v-model="dataUrl" size="small" />
        </el-form-item>
        <div v-if="dataType == 'custom'">
          <el-row
            v-for="(item, index) in settingData"
            :key="index"
            type="flex"
            class="row-bg"
          >
            <el-col :span="10">
              <el-form-item label="值" label-width="55px">
                <el-input v-model="item.value" size="small" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="标签名" label-width="55px">
                <el-input v-model="item.label" size="small" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <div class="rightIcon">
                <i
                  :class="['iconfont', 'iconshangyi', { disabled: index == 0 }]"
                  @click="sortPrev(item, index, index == 0)"
                />
                <i
                  :class="[
                    'iconfont',
                    'iconxiayi',
                    { disabled: settingData.length - 1 == index }
                  ]"
                  @click="
                    sortNext(item, index, settingData.length - 1 == index)
                  "
                />
                <i class="el-icon-delete" @click="screenDelete(item, index)" />
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div>
          <el-button size="small" type="primary" @click="addData">
            >
          </el-button>
        </div>
        <div class="right">
          <el-button size="small" @click="isShow = false">取 消</el-button>
          <el-button size="small" type="primary" @click="onSubmit">
            确 定
          </el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { dragDialog } from '../../../../utils/mixins.js'
export default {
  mixins: [dragDialog],
  props: {
    form: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogRef: 'screenFormSettings',
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
    onSubmit() {
      let data = ''
      if (this.settingData) {
        data = JSON.stringify(this.settingData)
      }
      this.$emit('itemDataConfig', data)
    },
    // 弹窗显示事件
    show(val) {
      this.isShow = true
      if (val) {
        this.settingData = JSON.parse(val)
      } else {
        this.settingData = [{ label: '', value: '' }]
      }
    },
    // 数据新增事件
    addData() {
      this.settingData.push({
        label: '',
        value: ''
      })
    },
    // 向上排序
    sortPrev(item, index, offon) {
      if (offon) return
      this.settingData.splice(index, 1)
      this.settingData.splice(index - 1, 0, item)
    },
    // 向下排序
    sortNext(item, index, offon) {
      if (offon) return
      this.settingData.splice(index, 1)
      this.settingData.splice(index + 1, 0, item)
    },
    // 删除项点击事件
    screenDelete(item, index) {
      this.settingData.splice(index, 1)
    }
  }
}
</script>
