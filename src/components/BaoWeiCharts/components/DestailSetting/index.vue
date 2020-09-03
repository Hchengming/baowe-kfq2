<template>
  <!-- 详情配置组件 -->
  <el-dialog class="destail-setting dialog-common"
             title="模块配置信息"
             :append-to-body="true"
             ref="destailSettingDialog"
             :visible.sync="dialogVisible">
    <div>
      <fieldset>
        <legend class="theme-color">全局配置</legend>
        <el-row>
          <el-col :span="12">
            弹窗宽度：
            <el-input-number v-model="destailSetObj.width"
                             controls-position="right"
                             size="small"
                             :min="300"
                             :max="1920"></el-input-number>
          </el-col>
          <el-col :span="12">
            标题宽度：
            <el-input-number v-model="destailSetObj.titleWidth"
                             controls-position="right"
                             size="small"
                             :min="1"
                             :max="200"></el-input-number>
          </el-col>
        </el-row>
      </fieldset>
      <!-- {{settingData}} -->
      <fieldset class="zdpz-ul">
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
          <li v-for="(item, index) in settingData"
              :key="index"
              :class="['zdpz',{'theme-box-shadow':chooseKey===item.key},{'box-shadow-error':errorKey.indexOf(item.key)>-1}]"
              @click="chooseKey=item.key">

            <span class="hTxt1 hTxt">
              <el-input-number v-model="item.sort"
                               placeholder="序号"
                               controls-position="right"
                               :precision="0"
                               @change="sortChange(item.sort,index)"
                               size="small"
                               :min="1"
                               :max="50"></el-input-number>

            </span>
            <label class="hTxt2 hTxt">
              <el-input size="mini"
                        placeholder="字段名"
                        disabled="disabled"
                        v-model="item.key"></el-input>
            </label>
            <label class="hTxt3 hTxt">
              <el-input size="mini"
                        placeholder="标题"
                        v-model="item.title"></el-input>
            </label>
            <label class="hTxt4 hTxt">
              <el-select v-model="item.proportion"
                         size="small"
                         placeholder="请选择">
                <el-option v-for="option in proportionAll"
                           :key="option.value"
                           :label="option.label"
                           :value="option.value"></el-option>
              </el-select>
            </label>
            <label class="hTxt5 hTxt">
              <el-checkbox v-model="item.isShow"></el-checkbox>
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
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="close"
                 size="small">取 消</el-button>
      <el-button type="primary"
                 @click="onSubmit"
                 size="small">确 定</el-button>
    </span>
  </el-dialog>

</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      settingData: [], // 详情配置数据
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
        width: 600,
        titleWidth: 100
      }
    }
  },
  computed: {

  },
  methods: {
    // 序号变化事件
    sortChange (sort, index) {
      if (sort >= this.settingData.length) {
        sort = this.settingData.length
      }

      let settingDataClone = JSON.parse(JSON.stringify(this.settingData))
      let chooseItem = this.settingData[index]
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
    close () {
      this.dialogVisible = false
    },
    // 配置数据-筛选
    setSettingData (tableData, keyArr) {
      this.settingData = []

      if (tableData && tableData.length > 0) {
        let num = 1
        for (let key in tableData[0]) {
          let obj = {
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
      }
    },
    // 弹窗显示事件
    show (tableData, keyArr, detailsAreaConfig) {
      this.dialogVisible = true
      // console.log(tableData)
      if (detailsAreaConfig) {
        this.settingData = detailsAreaConfig.settingData
        this.destailSetObj.width = detailsAreaConfig.width
        this.destailSetObj.titleWidth = detailsAreaConfig.titleWidth
        if (tableData && tableData.length > 0) {
          for (let key in tableData[0]) {
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
    onSubmit () {
      let offon = false
      this.chooseKey = ''
      this.errorKey = []
      this.settingData.forEach(item => {
        if (!item.title.replace(/\s*/g, '') && item.isShow) {
          offon = true
          this.errorKey.push(item.key)
        }
      })
      if (offon) {
        this.$message({
          type: 'error',
          message: this.errorKey.toString() + '字段标题未填写'
        })
      } else {
        let detailsAreaConfig = {
          settingData: this.settingData

        }
        Object.assign(detailsAreaConfig, this.destailSetObj)
        this.$emit('submit', detailsAreaConfig, () => {
          this.close()
        })
      }
    }
    // sortPrev () {

    // },
    // sortNext () {

    // }
  }
}
</script>
<style scoped>
</style>
