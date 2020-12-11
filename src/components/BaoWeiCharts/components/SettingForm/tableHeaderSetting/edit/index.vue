<template>
  <div>
    <el-dialog
      v-drag
      title="标题配置"
      class="table-header-setting-dialog"
      :append-to-body="true"
      :visible.sync="isShow"
    >
      <div v-if="type === '0'">
        <div class="header-name-setting">
          <span>配置方式：</span>
          <el-radio-group v-model="settingType">
            <el-radio label="0">自定义</el-radio>
            <el-radio label="1">配置字段选择</el-radio>
          </el-radio-group>
        </div>
        <div v-if="settingType === '0'" class="header-name-setting">
          <span>列标题：</span>
          <el-input
            v-model="headerName"
            size="small"
            placeholder="请输入列标题"
          />
        </div>
        <div v-if="settingType === '1'" class="header-name-setting">
          <span>列标题：</span>
          <el-radio-group v-model="radioChooseKey">
            <el-radio
              v-for="item in keyArr"
              :key="item.key"
              :disabled="item.disabled"
              :label="item.key"
            >{{ item.label }}<span>({{ item.key }})</span></el-radio>
          </el-radio-group>
        </div>
      </div>

      <div v-if="type === '1'" class="header-name-setting">
        <span>列标题： </span>
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="item in keyArr"
            :key="item.key"
            :disabled="item.disabled"
            :label="item.key"
          >{{ item.label }}<span>({{ item.key }})</span></el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="right">
          <el-button @click="isShow = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    form: {
      type: Object,
      default: null
    },
    tableHeaderConfig: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isShow: false,
      dialogType: '', // 弹窗操作类型  add/update
      type: '', // 表头标题类型 0：自定义写入 1：字段选择
      headerName: '',
      settingType: '0', // 配置方式
      radioChooseKey: '', // 单选配置 字段
      keyArr: [],
      checkList: [] // 多选框选中事件
    }
  },
  methods: {
    // 字段配置数据获取
    setKeySetting() {
      // 递归遍历树形数据
      const reduiction = (data, fn) => {
        data.forEach((item, index) => {
          fn(item, index)
          if (item.children && item.children.length > 0) {
            reduiction(item.children, fn)
          }
        })
      }
      this.keyArr = []
      const keyLastArr = []
      this.checkList = []
      this.radioChooseKey = ''
      this.settingType = '0'
      // 递归获取所有得字段名
      reduiction(this.tableHeaderConfig.headerSetting, (items) => {
        if (items.key) {
          keyLastArr.push(items.key)
        }
      })
      // 判断标题是否已使用
      this.form.keyArr.forEach((item) => {
        if (item.isShow) {
          this.keyArr.push({
            label: item.explain,
            disabled: keyLastArr.indexOf(item.key) > -1,
            key: item.key
          })
        }
      })
    },
    // 弹窗显示事件
    show(name, type) {
      this.isShow = true
      this.type = type
      this.dialogType = name ? 'update' : 'add'
      this.headerName = name || ''
      this.setKeySetting()
    },
    // 弹窗保存事件
    onSubmit() {
      // 判断当前是否为树得末级
      const dataArr = []
      if (this.type === '0') {
        if (this.settingType === '0') {
          dataArr.push({
            key: '',
            headerName: this.headerName
          })
        } else {
          this.keyArr.forEach((item) => {
            if (item.key === this.radioChooseKey) {
              dataArr.push({
                key: item.key,
                headerName: item.label
              })
            }
          })
        }
      } else {
        this.keyArr.forEach((item) => {
          if (this.checkList.indexOf(item.key) > -1 && !item.disabled) {
            dataArr.push({
              key: item.key,
              headerName: item.label
            })
          }
        })
      }
      this.$emit('submit', dataArr, this.dialogType)
      this.isShow = false
    }
  }
}
</script>
