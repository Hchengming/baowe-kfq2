<template>
  <!-- 表单项数据配置模块 -->
  <div>
    <el-dialog
      ref="screenFormSettings"
      :append-to-body="true"
      :visible.sync="isShow"
      class="screenForm settingData dialog-common"
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
            <el-radio label="dataView">数据视图</el-radio>
            <el-radio disabled label="dataUrl">应用接口</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="dataType == 'dataUrl'"
          label="数据接口"
          label-width="65px"
        >
          <el-input v-model="dataUrl" size="small" />
        </el-form-item>
        <el-form-item
          v-if="dataType == 'dataView'"
          label="视图名称"
          label-width="75px"
        >
          <el-select
            v-model="nowViewId"
            size="small"
            filterable
            placeholder="视图名称"
            @change="viewIdChange"
          >
            <el-option
              v-for="option in dataViewList"
              :key="option.id"
              :label="option.viewCode"
              :value="option.viewCode + '(' + option.id + ')'"
            />
          </el-select>
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
            新增
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
import serviceAxios from '@/utils/request.js'
export default {
  mixins: [dragDialog],
  props: {
    form: {
      type: Object,
      default: null
    },
    settingConfig: {
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
      ],
      nowViewId: '', // 当前选中视图
      dataViewList: []
    }
  },
  methods: {
    // 数据视图列表获取
    getDataIview() {
      let url = ''
      // 判断当前后台环境是否为node测试环境
      const isTestEnvironment = this.settingConfig.isTestEnvironment
      if (isTestEnvironment) {
        if (isTestEnvironment === 'java') {
          url = this.settingConfig.commonUrl + '/dataView/selectViewAllData'
        } else {
          url = this.settingConfig.commonUrl + '/dataView/viewList'
        }
      } else {
        url =
          window.BaseApi +
          '/.DataView/view/v1/list?pageNumber=1&pageSize=10000&datasourceId=&viewType=&parentViewId=&viewCodeOrComment=&viewStatus='
      }
      serviceAxios
        .get(url, {
          params: {
            appCode: this.settingConfig.answerId
          }
        })
        .then(res => {
          const code = res.code
          const resData = res.data
          if (code === 20000) {
            this.dataViewList = resData.records
          }
        })
    },
    // 表单确认事件
    onSubmit() {
      let data = ''
      switch (this.dataType) {
        case 'custom':
          if (this.settingData) {
            data = JSON.stringify(this.settingData)
          }
          break
        case 'dataView':
          data = this.nowViewId
          break
      }
      this.isShow = false
      this.$emit('itemDataConfig', data)
    },
    // 弹窗显示事件
    show(val) {
      this.isShow = true
      switch (this.dataType) {
        case 'custom':
          if (val) {
            if (typeof val === 'string') {
              this.settingData = JSON.parse(val)
            } else {
              this.settingData = JSON.parse(JSON.stringify(val))
            }
          } else {
            this.settingData = [{ label: '', value: '' }]
          }
          break
        case 'dataView':
          break
      }

      this.getDataIview()
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
