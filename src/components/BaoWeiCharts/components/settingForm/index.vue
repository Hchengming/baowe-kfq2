<template>
  <div>
    <el-dialog class="settingForm dialog-common"
               title="模块配置信息"
               :append-to-body="true"
               ref="settingFormDialog"
               :rules="rules"
               @mousedown.native="dragElement"
               :visible.sync="dialogVisible">
      <el-form ref="settingForm"
               :model="form"
               label-width="130px">
        <el-row type="flex"
                class="row-bg">
          <el-col :span="12">
            <el-form-item label="模块标题"
                          prop="title">
              <el-input size="small"
                        v-model="form.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="副标题1"
                          prop="subtitle1">
              <el-input size="small"
                        :disabled="statisticsAll&&statisticsAll.parentModuleId ? true : false"
                        v-model="form.subtitle1"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex"
                class="row-bg">
          <el-col :span="12">
            <el-form-item label="副标题2"
                          prop="subtitle2">
              <el-input size="small"
                        v-model="form.subtitle2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据展现方式"
                          prop="displayMode">
              <el-select v-model="form.displayMode"
                         size="small"
                         placeholder="请选择">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex"
                class="row-bg">
          <el-col :span="12">
            <el-form-item label="是否有子模块"
                          prop="submodule">
              <el-radio-group v-model="form.submodule">
                <el-radio label="1">有</el-radio>
                <el-radio label="0">没有</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12"
                  v-if="form.submodule == '1'">
            <el-form-item label="子模块点击展现"
                          prop="clickToShow">
              <el-radio-group v-model="form.clickToShow"
                              @change="clickToShowChange">
                <el-radio label="row">行点击</el-radio>
                <el-radio label="cell">单元格点击</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12"
                  v-if="form.submodule == '0'">
            <el-form-item label="是否添加详情展示"
                          prop="isDestail">
              <el-radio-group v-model="form.isDestail">
                <el-radio label="0">否</el-radio>
                <el-radio label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数据是否添加分页"
                          prop="isPage">
              <el-radio-group v-model="form.isPage">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.isPage == '1'"
                          label="每页显示数据(条)"
                          prop="pageSize">
              <el-input-number size="small"
                               v-model="form.pageSize"
                               :min="0"
                               :max="1000"
                               :precision="0"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="接口默认参数"
                      prop="defaultParameters">
          <el-input size="small"
                    v-model="form.defaultParameters"
                    placeholder='例:{"num":9,"area":"44公顷"}'></el-input>
        </el-form-item>
        <el-row type="flex"
                class="row-bg">
          <el-col :span="18">
            <el-form-item label="接口"
                          prop="url">
              <el-input size="small"
                        v-model="form.url"
                        placeholder="接口路径(不含公共部分)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button size="small"
                       style="margin-top:2px"
                       @click="getKeysData">字段获取</el-button>
          </el-col>
        </el-row>

        <el-form-item label="字段配置"
                      prop="keyArr"
                      :class="['zdpz_box',{'mt':!isWidth}]">
          <p class="tips"
             v-if="!isWidth">*第一个字段必须为图表标题字段</p>
          <ul class="zdpz_list">
            <li class="zdpz_list_header">
              <span class="hTxt1 hTxt">字段名</span>
              <span class="hTxt2 hTxt">含义</span>
              <span class="hTxt3 hTxt"
                    v-if="isWidth">宽度</span>
              <span class="hTxt4 hTxt">单位</span>
              <span class="hTxt7 hTxt">关键字段</span>
              <span class="hTxt8 hTxt">是否显示</span>
              <!-- <span class="hTxt5 hTxt" v-if="form.clickToShow=='cell'">下钻关联字段</span> -->
              <span class="hTxt6 hTxt icons">操作</span>
            </li>
            <li v-for="(item, index) in form.keyArr"
                :key="index"
                class="zdpz">
              <label class="hTxt1 hTxt">
                <el-input size="mini"
                          placeholder="字段名"
                          v-model="item.key"></el-input>
              </label>
              <label class="hTxt2 hTxt">
                <el-input size="mini"
                          placeholder="含义"
                          v-model="item.explain"></el-input>
              </label>
              <label class="hTxt3 hTxt"
                     v-if="isWidth">
                <el-input size="mini"
                          placeholder="宽度"
                          v-model="item.width"></el-input>
              </label>
              <label class="hTxt4 hTxt">
                <el-input size="mini"
                          placeholder="单位"
                          v-model="item.dw"></el-input>
              </label>
              <!-- <label class="hTxt5 hTxt" v-if="form.clickToShow=='cell'">
                <el-input size="mini" placeholder="下拽关联字段" v-model="item.relationKey"></el-input>
              </label>-->
              <label class="hTxt7 hTxt">
                <el-checkbox v-model="item.isCruxKey"></el-checkbox>
              </label>
              <label class="hTxt8 hTxt">
                <el-checkbox v-model="item.isShow"></el-checkbox>
              </label>
              <div class="icons hTxt6 hTxt">
                <i @click="keyAdd(index)"
                   class="el-icon-circle-plus-outline  theme-color"></i>
                <i v-show="form.keyArr.length > 1"
                   @click="keyRemove(index)"
                   class="el-icon-remove-outline remove"></i>
                <i @click="sortPrev(item, index, index == 0)"
                   :class="['iconfont', 'iconshangyi', { disabled: index == 0 }]"></i>
                <i @click="
                    sortNext(item, index, form.keyArr.length - 1 == index)
                  "
                   :class="[
                    'iconfont',
                    'iconxiayi',
                    { disabled: form.keyArr.length - 1 == index }
                  ]"></i>
              </div>
            </li>
          </ul>
        </el-form-item>

        <el-row type="flex"
                class="row-bg">
          <el-col :span="12">
            <el-form-item label="宽度(页面占比)"
                          prop="width">
              <el-input-number size="small"
                               v-model="form.width"
                               :min="0"
                               :max="200"
                               :precision="2"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="高度(像素)"
                          prop="height">
              <el-input-number size="small"
                               v-model="form.height"
                               :min="0"
                               :precision="2"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex"
                class="row-bg">
          <el-col :span="12">
            <el-form-item label="位置X轴(页面占比)"
                          prop="left">
              <el-input-number size="small"
                               v-model="form.left"
                               :min="0"
                               :max="200"
                               :precision="2"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置Y轴(像素)"
                          prop="top">
              <el-input-number size="small"
                               v-model="form.top"
                               :min="0"
                               :precision="2"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex"
                class="row-bg">
          <el-col :span="12">
            <el-form-item label="视图层级"
                          prop="zindex">
              <el-input v-model="form.zindex"
                        size="small"
                        placeholder="若模块重叠,低层级模块会被高层级覆盖"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="mask"
                          label="是否添加遮罩层">
              <el-radio-group v-model="form.mask">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="close"
                   size="small">取 消</el-button>
        <el-button type="primary"
                   @click="onSubmit"
                   size="small">确 定</el-button>
      </span>

    </el-dialog>
    <judge-pop ref="judgePop"
               @handleClose="handleClose"
               @confirm="judgePopConfirm"></judge-pop>
  </div>
</template>
<script>
import dataPresentation from './dataPresentation.json'
import axios from 'axios'
import JudgePop from '../JudgePop/index.vue'
import { dragDialog } from '../../utils/mixins.js'
export default {
  props: ['form', 'dataUrl', 'statisticsAll'],
  mixins: [dragDialog],
  components: { JudgePop },
  data () {
    return {
      dialogRef: 'settingFormDialog', // 弹出框refs名
      dialogVisible: false,
      options: [],
      rules: [],
      csData: [],
      deleteKeyIndex: null,
      defaultData: [
        {
          title: '',
          num: '',
          area: '',
          rowid: '001'
        }
      ]
    }
  },
  mounted () {
    this.options = []
    dataPresentation.forEach(item => {
      this.options.push({
        value: item.type,
        label: item.title
      })
    })
  },
  computed: {
    // 字段配置宽度列是否显示
    isWidth () {
      if (this.form.displayMode === 'list' || this.form.displayMode === 'table') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    // 行点击、单元格点击切换事件
    clickToShowChange (val) {
      let html = ''
      // console.log(val)
      if (this.statisticsAll) {
        if (val === 'row' && this.statisticsAll.drillDownKeyAll) {
          html = '当前单元格点击已配置子级模块，是否<span class="txt1">强制切换</span>？'
          this.$refs['judgePop'].show(html, 'cell')
        } else if (val === 'cell' && this.statisticsAll.isRowDrillDown === '1') {
          html = '当前行点击已配置子级模块，是否<span class="txt1">强制切换</span>？'
          this.$refs['judgePop'].show(html, 'row')
        }
      }
    },
    // 行点击、单元格点击--切换取消事件
    handleClose (clickToShow) {
      this.form.clickToShow = clickToShow
    },
    // 弹窗关闭事件
    close () {
      this.dialogVisible = false
      // this.$refs['settingForm'].resetFields()
    },
    // 通过接口获取当前字段配置初始数据
    getKeysData () {
      const reqData = {}
      // 判断是否有默认参数
      let defaultParameters = this.form.defaultParameters.replace(/\s*/g, '')
      if (defaultParameters) {
        try {
          var defaultParametersObj = JSON.parse(defaultParameters)
          if (typeof defaultParametersObj === 'object' && defaultParametersObj) {
            for (let key in defaultParametersObj) {
              reqData[key] = defaultParametersObj[key]
            }
          } else {
            return false
          }
        } catch (e) {
          this.$message({
            message: '默认参数请输入正确的JSON格式',
            type: 'error'
          })
          return false
        }
      }
      // 判断是否分页
      if (this.form.isPage === '1') {
        reqData.pageSize = this.form.pageSize
        reqData.currentPage = 1
      }
      // console.log(reqData)
      axios.post(this.dataUrl + this.form.url, reqData).then(res => {
        if (res.data.code === 20000) {
          let resData = this.form.isPage === '1' ? res.data.data.list : res.data.data
          if (resData.length === 0) {
            this.$message({
              message: '接口返回数据为空，无法生成字段',
              type: 'error'
            })
            return false
          }
          // this.csData = res.data.data
          for (let key in resData[0]) {
            if (this.form.keyArr.length === 0) {
              this.form.keyArr.push({
                key: key,
                explain: '',
                dw: '',
                width: ''
              })
            } else {
              let offon = true
              this.form.keyArr.forEach(item => {
                if (item.key === key) {
                  offon = false
                }
              })
              if (offon) {
                this.form.keyArr.push({
                  key: key,
                  explain: '',
                  dw: '',
                  width: ''
                })
              }
            }
          }
        }
        // console.log(res)
      })
    },
    // 弹窗显示事件
    show () {
      this.dialogVisible = true
    },
    // 向上排序
    sortPrev (item, index, offon) {
      if (offon) return
      this.form.keyArr.splice(index, 1)
      this.form.keyArr.splice(index - 1, 0, item)
    },
    // 向下排序
    sortNext (item, index, offon) {
      if (offon) return
      this.form.keyArr.splice(index, 1)
      this.form.keyArr.splice(index + 1, 0, item)
    },
    // 字段新增事件
    keyAdd (index) {
      this.form.keyArr.splice(index + 1, 0, { key: '', text: '' })
      //   this.form.keyArr = Object.assign({}, this.form.keyArr);
    },
    // 字段删除事件
    keyRemove (index) {
      // this.form.keyArr.splice(index, 1)
      let nowKey = this.form.keyArr[index].key
      // 判断当前删除字段是否已经挂载子级，若挂载，则弹出提示信息
      if (this.form.submodule === '1' && this.form.clickToShow === 'cell' && this.statisticsAll && this.statisticsAll.drillDownKeyAll.indexOf(nowKey) > -1) {
        let html = '当前字段已配置子级模块，是否<span class="txt1">强制删除</span>？'
        this.$refs['judgePop'].show(html)
        this.deleteKeyIndex = index
      } else {
        this.form.keyArr.splice(index, 1)
      }
    },
    // 强制删除字段确认事件
    judgePopConfirm () {
      console.log('judgePopConfirm')
      this.form.keyArr.splice(this.deleteKeyIndex, 1)
    },
    // 表单确认事件
    onSubmit () {
      this.$emit('submit', this.form)
    }
  }
}
</script>
