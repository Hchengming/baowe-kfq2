<template>
  <!-- 详情配置组件 -->
  <el-dialog
    ref="destailSettingDialog"
    class="destail-setting dialog-common"
    :append-to-body="true"
    :visible.sync="dialogVisible"
  >
    <div
      slot="title"
      class="headerTitle"
      @mousedown="dragElement"
    >
      详情配置信息
    </div>
    <div>
      <el-form
        ref="settingForm"
        :model="destailSetObj"
        label-width="130px"
      >

        <el-form-item
          label="详情内容展示"
          prop="detailType"
        >
          <el-radio-group v-model="destailSetObj.detailType">
            <el-radio label="0">自定义配置</el-radio>
            <el-radio label="1">跳转新页面</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="destailSetObj.detailType==='1'"
          label="跳转页公共API"
          prop="commonApi"
        >
          <el-input
            v-model="destailSetObj.commonApi"
            size="mini"
            placeholder="跳转页面公共API"
          />
        </el-form-item>
        <el-form-item
          v-if="destailSetObj.detailType==='1'"
          label="跳转页字段"
          prop="destailsUrlKey"
        >
          <el-select
            v-model="destailSetObj.destailsUrlKey"
            size="small"
            placeholder="触发跳转字段"
          >
            <el-option
              v-for="item in dataKeyArr"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <!-- <el-input size="mini"
                        placeholder="跳转页路径"
                        v-model="destailSetObj.detailsUrl"></el-input> -->
        </el-form-item>
      </el-form>
      <fieldset v-if="destailSetObj.detailType==='0'">
        <legend class="theme-color">全局配置</legend>
        <el-row>
          <el-col :span="12">
            弹窗宽度：
            <el-input-number
              v-model="destailSetObj.width"
              controls-position="right"
              size="small"
              :min="300"
              :max="1920"
            />
          </el-col>
          <el-col :span="12">
            标题宽度：
            <el-input-number
              v-model="destailSetObj.titleWidth"
              controls-position="right"
              size="small"
              :min="1"
              :max="300"
            />
          </el-col>
        </el-row>
      </fieldset>
      <fieldset
        v-if="destailSetObj.detailType==='0'"
        class="zdpz-ul"
      >
        <legend class="theme-color">显示内容配置</legend>
        <ul class="zdpz_list">
          <li class="zdpz_list_header">
            <span class="hTxt1 hTxt">排序</span>
            <span class="hTxt2 hTxt">字段名</span>
            <span class="hTxt3 hTxt">标题</span>
            <span class="hTxt4 hTxt">宽度占比(行)</span>
            <span class="hTxt5 hTxt">是否显示</span>
            <!-- <span class="hTxt6 hTxt icons">操作</span> -->
          </li>
          <li
            v-for="(item, index) in settingData"
            :key="index"
            :class="['zdpz',{'theme-box-shadow':chooseKey===item.key},{'box-shadow-error':errorKey.indexOf(item.key)>-1}]"
            @click="chooseKey=item.key"
          >

            <span class="hTxt1 hTxt">
              <el-input-number
                v-model="item.sort"
                placeholder="序号"
                controls-position="right"
                :precision="0"
                size="small"
                :min="1"
                :max="50"
                @change="sortChange(item.sort,index)"
              />

            </span>
            <label class="hTxt2 hTxt">
              <el-input
                v-model="item.key"
                size="mini"
                placeholder="字段名"
                disabled="disabled"
              />
            </label>
            <label class="hTxt3 hTxt">
              <el-input
                v-model="item.title"
                size="mini"
                placeholder="标题"
              />
            </label>
            <label class="hTxt4 hTxt">
              <el-select
                v-model="item.proportion"
                size="small"
                placeholder="请选择"
              >
                <el-option
                  v-for="option in proportionAll"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </label>
            <label class="hTxt5 hTxt">
              <el-checkbox v-model="item.isShow" />
            </label>
            <!-- <div class="icons hTxt6 hTxt">
            <i @click="sortPrev(item, index, index == 0)"
               :class="['iconfont', 'iconshangyi', { disabled: index == 0 }]"></i>
            <i @click="
                    sortNext(item, index, settingData.length - 1 == index)
                  "
               :class="[
                    'iconfont',
                    'iconxiayi',
                    { disabled: settingData.length - 1 == index }
                  ]"></i>
          </div> -->
          </li>
        </ul>
      </fieldset>

    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="small"
        @click="close"
      >取 消</el-button>
      <el-button
        type="primary"
        size="small"
        @click="onSubmit"
      >确 定</el-button>
    </span>
  </el-dialog>

</template>
<script>
import { dragDialog } from '../../utils/mixins.js'
export default {
  mixins: [dragDialog],
  data() {
    return {
      dialogVisible: false,
      dialogRef: 'destailSettingDialog',
      settingData: [], // 详情配置数据
      dataKeyArr: [], // 当前数据字段合集
      proportionAll: [{
        label: '1',
        value: 24
      }, {
        label: '2/3',
        value: 16
      }, {
        label: '1/2',
        value: 12
      }, {
        label: '1/3',
        value: 8
      }],
      chooseKey: '', // 当前选中key
      errorKey: [], // 为填写完整字段
      destailSetObj: {
        detailType: '0', // 详情内容展示 0:自定义配置  1：跳转新页面
        commonApi: '', // 页面跳转公共API
        destailsUrlKey: '', // 跳转新页面路径字段
        width: 600,
        titleWidth: 100
      }
    }
  },
  computed: {

  },
  methods: {
    // 序号变化事件
    sortChange(sort, index) {
      if (sort >= this.settingData.length) {
        sort = this.settingData.length
      }

      const settingDataClone = JSON.parse(JSON.stringify(this.settingData))
      const chooseItem = this.settingData[index]
      settingDataClone.splice(index, 1)
      settingDataClone.splice(sort - 1, 0, chooseItem)
      settingDataClone.forEach((item, index) => {
        item.sort = index + 1
      })
      this.settingData = []
      this.$nextTick(() => {
        this.settingData = settingDataClone
      })
    },

    // 取消关闭事件
    close() {
      this.dialogVisible = false
    },
    // 配置数据-筛选
    setSettingData(tableData, keyArr) {
      this.settingData = []

      if (tableData && tableData.length > 0) {
        let num = 1
        for (const key in tableData[0]) {
          this.dataKeyArr.push(key)
          const obj = {
            sort: num,
            key: key,
            title: '',
            proportion: 12,
            isShow: true
          }
          if (keyArr && keyArr.length > 0) {
            keyArr.forEach(item => {
              if (item.key === key) {
                obj.title = item.explain
                if (item.dw) {
                  obj.title = item.explain + `(${item.dw})`
                }
              }
            })
          }
          num++
          this.settingData.push(obj)
        }
        // 判断字段集中是否存在特殊字段detailsUrl
        if (this.dataKeyArr.indexOf('detailsUrl') > -1) {
          this.destailSetObj.destailsUrlKey = 'detailsUrl'
        }
      }
    },
    // 弹窗显示事件
    show(tableData, keyArr, detailsAreaConfig) {
      this.dialogVisible = true
      this.dataKeyArr = []
      if (detailsAreaConfig) {
        this.settingData = detailsAreaConfig.settingData
        // this.destailSetObj.width = detailsAreaConfig.width
        // this.destailSetObj.titleWidth = detailsAreaConfig.titleWidth
        // this.destailSetObj.detailType = detailsAreaConfig.detailType
        // this.destailSetObj.destailsUrlKey = detailsAreaConfig.destailsUrlKey
        for (const key in detailsAreaConfig) {
          if (key !== 'settingData') {
            this.destailSetObj[key] = detailsAreaConfig[key] ? detailsAreaConfig[key] : ''
          }
        }
        if (tableData && tableData.length > 0) {
          for (const key in tableData[0]) {
            this.dataKeyArr.push(key)

            let offon = false
            this.settingData.forEach(item => {
              if (key === item.key) {
                offon = true
              }
            })
            if (!offon) {
              this.settingData.push({
                sort: this.settingData.length + 1,
                key: key,
                title: '',
                proportion: 12,
                isShow: true
              })
            }
          }
        }
      } else {
        this.setSettingData(tableData, keyArr)
      }
    },
    // 配置确认事件
    onSubmit() {
      let offons = true// 报错开关
      this.chooseKey = ''
      if (this.destailSetObj.detailType === '0') {
        let offon = false
        this.errorKey = []
        this.settingData.forEach(item => {
          if (!item.title.replace(/\s*/g, '') && item.isShow) {
            offon = true
            this.errorKey.push(item.key)
          }
        })
        if (offon) {
          offons = false
          this.$message({
            type: 'error',
            message: this.errorKey.toString() + '字段标题未填写'
          })
        }
      } else {
        if (!this.destailSetObj.destailsUrlKey || !this.destailSetObj.commonApi) {
          offons = false
          this.$message({
            type: 'error',
            message: '请选择详情跳转字段'
          })
        }
      }

      if (offons) {
        const detailsAreaConfig = {
          settingData: this.settingData
        }
        Object.assign(detailsAreaConfig, this.destailSetObj)
        this.$emit('submit', detailsAreaConfig, () => {
          this.close()
        })
      }
    }
  }
}
</script>
<style scoped>
</style>
