<template>
  <div>
    <el-dialog class="settingForm dialog-common"
               :append-to-body="true"
               ref="settingFormDialog"
               :rules="rules"
               v-drag
               :visible.sync="dialogVisible">
      <div class="headerTitle"
           slot="title" >
        模块配置信息
      </div>
      <el-form ref="settingForm"
               :model="form"
               label-width="130px">
        <el-row type="flex"
                class="row-bg">
          <el-col :span="8">
            <el-form-item label="模块标题"
                          prop="title">
              <el-input size="small"
                        v-model="form.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="副标题1"
                          prop="subtitle1">
              <el-input size="small"
                        :disabled="!statisticsAll||statisticsAll.parentModuleId ? true : false"
                        v-model="form.subtitle1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="副标题2"
                          prop="subtitle2">
              <el-input size="small"
                        v-model="form.subtitle2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex"
                class="row-bg">
          <el-col :span="8">
            <el-form-item label="是否添加更多按钮"
                          prop="isAddMoreIcon">
              <el-radio-group v-model="form.isAddMoreIcon">
                <el-radio label="1">有</el-radio>
                <el-radio label="0">没有</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16"
                  v-if="form.isAddMoreIcon==='1'">
            <el-form-item label="按钮跳转路径"
                          prop="moreUrl">
              <el-input size="small"
                        v-model="form.moreUrl"
                        placeholder='按钮跳转路径为空则不跳转页面，自行进行二次开发'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="模块内容"
                          prop="moduleType">
              <el-radio-group v-model="form.moduleType">
                <el-radio label="0">图表</el-radio>
                <el-radio label="1">iframe嵌入</el-radio>
                <el-radio label="2">详情表格展示</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 图表配置 -->
        <div class="content-dy-box"
             v-if="!form.moduleType||form.moduleType==='0'">
          <el-row>
            <el-col :span="12">
              <el-form-item label="图表展现方式"
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
            <el-col :span="8">
              <el-form-item label="是否有子模块"
                            prop="submodule">
                <el-radio-group v-model="form.submodule"
                                @change="submoduleChange">
                  <el-radio label="1">有</el-radio>
                  <el-radio label="0">没有</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8"
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

            <el-col :span="8"
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
            <el-col :span="8">
              <el-form-item label="是否链接地图"
                            prop="isLinkMap">
                <el-radio-group v-model="form.isLinkMap">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>

                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="16"
                    v-if="form.isLinkMap === '1'">

              <el-form-item label="地图定位"
                            prop="mapPosition">
                <el-radio-group v-model="form.mapPosition">
                  <el-radio label="0">重庆</el-radio>
                  <el-radio label="1">区县</el-radio>
                  <el-radio label="2">开发区</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="数据是否添加分页"
                            prop="isPage">
                <el-radio-group v-model="form.isPage">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="16">
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
          <!-- <el-form-item label="接口默认参数"
                        prop="defaultParameters">
            <el-input size="small"
                      v-model="form.defaultParameters"
                      placeholder='例:{"num":9,"area":"44公顷"}'></el-input>
          </el-form-item> -->
          <!-- 数据接口处理部分 -->
          <api-choose :itemApiData="itemApiData"
                      :form="form"></api-choose>
          <!-- 接口参数、字段配置             -->
          <param-key-config :itemApiData="itemApiData"
                            :form="form"
                            :parentParamsAll="parentParamsAll"
                            :statisticsAll="statisticsAll"
                            :whereForm="whereForm">
            <div slot="keys">
              <el-button size="small"
                         @click="getKeysData">字段获取</el-button>
                         <el-button size="small"
                         v-if="['table','list'].indexOf(form.displayMode)>-1"
                         @click="operateButtonSetting">右侧操作按钮配置</el-button>
              <p class="tips"><span v-if="!isWidth">*第一个字段必须为图表标题字段</span></p>
              <ul class="zdpz_list keys-config-list">
                <li class="zdpz_list_header">
                  <span class="hTxt1 hTxt">字段名</span>
                  <span class="hTxt2 hTxt">含义</span>
                  <span class="hTxt3 hTxt"
                        v-if="isWidth">宽度</span>
                  <span class="hTxt4 hTxt">单位</span>
                  <span class="hTxt7 hTxt" v-if='form.submodule=="1"'>下级参数</span>
                  <span class="hTxt9 hTxt"
                        v-if="form.isLinkMap=='1'">地图使用字段</span>
                  <span class="hTxt8 hTxt">是否显示</span>
                  <!-- <span class="hTxt5 hTxt" v-if="form.clickToShow=='cell'">下钻关联字段</span> -->
                  <span class="hTxt6 hTxt icons">

                    <i @click="keyAdd(index)"
                       class="el-icon-circle-plus-outline  theme-color"></i>
                  </span>
                </li>
                <li v-for="(item, index) in form.keyArr"
                    :key="index"
                    class="zdpz_list_content">
                  <span class="hTxt1 hTxt">
                    <el-input size="mini"
                              placeholder="字段名"
                              :disabled="item.key==='operationButton'"
                              v-model="item.key"></el-input>
                  </span>
                  <span class="hTxt2 hTxt">
                    <el-input size="mini"
                              placeholder="含义"
                              :disabled="item.key==='operationButton'"
                              v-model="item.explain"></el-input>
                  </span>
                  <span class="hTxt3 hTxt"
                        v-if="isWidth">
                    <el-input size="mini"
                              placeholder="宽度"
                              v-model="item.width"></el-input>
                  </span>
                  <span class="hTxt4 hTxt">
                    <el-input size="mini"
                              placeholder="单位"
                              :disabled="item.key==='operationButton'"
                              v-model="item.dw"></el-input>
                  </span>
                  <span class="hTxt7 hTxt" v-if='form.submodule=="1"'>
                    <el-checkbox :disabled="item.key==='operationButton'" v-model="item.isCruxKey"></el-checkbox>
                  </span>
                  <span class="hTxt9 hTxt"
                        v-if="form.isLinkMap=='1'">
                    <el-checkbox @change="isMapKeyChange(item)"
                    :disabled="item.key==='operationButton'"
                                 v-model="item.isMapKey"></el-checkbox>
                  </span>
                 
                  <span class="hTxt8 hTxt">
                    <el-checkbox :disabled="item.key==='operationButton'" v-model="item.isShow"></el-checkbox>
                  </span>
                  <span class="icons hTxt6 hTxt">
                    <i @click="keyAdd(index)"
                       class="el-icon-circle-plus-outline  theme-color"></i>
                    <i v-show="form.keyArr.length > 1&&item.key!=='operationButton'"
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
                  </span>
                </li>
              </ul>
            </div>
          </param-key-config>
          <el-row class="el-row-menu-tap" v-if="form.menuTapAll"> 
             <el-col :span="8" >   
              <el-form-item label="是否绑定菜单页面跳转"
              label-width="140px"
                            >
                <el-radio-group v-model="form.menuTapAll.isMenuTap">
                   <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.menuTapAll.isMenuTap==='1'">   
              <el-form-item label="触发跳转字段"
                            >
                <el-select v-model="form.menuTapAll.menuTapKey"
                           size="small"
                           placeholder="触发跳转字段">
                  <el-option v-for="item in form.keyArr"
                             :key="item.key"
                             :label="item.key"
                             :value="item.key"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
             <el-col :span="8" v-if="form.menuTapAll.isMenuTap==='1'">   
              <el-form-item label="菜单编码字段"
                            >
                <el-select v-model="form.menuTapAll.menuCodeKey"
                           size="small"
                           placeholder="触发跳转字段">
                  <el-option v-for="item in form.keyArr"
                             :key="item.key"
                             :label="item.key"
                             :value="item.key"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

        </div>
        <!-- iframe嵌入 -->
        <div class="content-dy-box iframe-dy-box"
             v-if="form.moduleType==='1'">
          <el-row>
            <el-col :span="8">
              <el-form-item label="iframe类型"
                            prop="iframeType">
                <el-radio-group v-model="form.iframeAll.iframeType" @change="iframeTypeChange">
                  <el-radio label="0">地图</el-radio>
                  <el-radio label="1">其他</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="iframe路径"
                            prop="iframeUrl">
                <el-input size="small"
                          v-model="form.iframeAll.iframeUrl"
                          placeholder="iframe嵌入站点路径"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <param-key-config :itemApiData="itemApiData"
                            :form="form"
                            @useChange="iframeUseChange"
                            ref="paramKeyConfig"
                            v-if="form.iframeAll.iframeType==='1'"
                            componentType="iframe"
                            ></param-key-config>
        </div>
        <!-- 详情列表展示 -->
        <div class="content-dy-box"
             v-if="form.moduleType==='2'">
          <el-row type="flex"
                  class="row-bg">
            <el-col :span="8">
              <el-form-item label="左侧标题宽度"
                            prop="destailsTableLabelWidth">
                <el-input-number v-model="form.destailsTableLabelWidth"
                                 controls-position="right"
                                 size="small"
                                 :min="1"
                                 :max="300"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 数据接口处理部分 -->
          <api-choose :itemApiData="itemApiData"
                      :form="form"></api-choose>
          <!-- 接口参数、字段配置             -->
          <param-key-config :itemApiData="itemApiData"
                            :form="form"
                            :parentParamsAll="parentParamsAll"
                            :statisticsAll="statisticsAll"
                            :whereForm="whereForm">
            <div slot="keys">
               <el-button size="small"
                         @click="getKeysData">字段获取</el-button>
                         <p class="tips"></p>
              <ul class="details-table-list">
                <li>
                  <span class="hTxt01 hTxt">排序</span>
                  <span class="hTxt02 hTxt">字段名</span>
                  <span class="hTxt03 hTxt">标题</span>
                  <span class="hTxt04 hTxt">宽度占比(行)</span>
                  <span class="hTxt05 hTxt">是否显示</span>
                  <span class="hTxt06 hTxt icons">
                    <i @click="detailsTableKeyAdd"
                       class="el-icon-circle-plus-outline  theme-color"></i>
                  </span>
                </li>
                <li v-for="(item, index) in form.detailsTableAll"
                    :key="index"
                    :class="['zdpz',{'theme-box-shadow':chooseKey===item.key}]"
                    @click="chooseKey=item.key">
                  <span class="hTxt01 hTxt">
                    <el-input-number v-model="item.sort"
                                     placeholder="序号"
                                     controls-position="right"
                                     :precision="0"
                                     @change="detailsTableSortChange(item.sort,index)"
                                     size="small"
                                     :min="1"
                                     :max="50"></el-input-number>
                  </span>
                  <label class="hTxt02 hTxt">
                    <el-input size="mini"
                              placeholder="字段名"
                              v-model="item.key"></el-input>
                  </label>
                  <label class="hTxt03 hTxt">
                    <el-input size="mini"
                              placeholder="标题"
                              v-model="item.title"></el-input>
                  </label>
                  <label class="hTxt04 hTxt">
                    <el-select v-model="item.proportion"
                               size="small"
                               placeholder="请选择">
                      <el-option v-for="option in proportionAll"
                                 :key="option.value"
                                 :label="option.label"
                                 :value="option.value"></el-option>
                    </el-select>
                  </label>
                  <label class="hTxt05 hTxt">
                    <el-checkbox v-model="item.isShow"></el-checkbox>
                  </label>
                  <label class="hTxt06 hTxt icons">
                    <i @click="detailsTableKeyDelete(index)"
                       class="el-icon-remove-outline remove"></i>
                    <i @click="detailsTableSortChange(index, index)"
                       :class="['iconfont', 'iconshangyi', { disabled: index == 0 }]"></i>
                    <i @click="detailsTableSortChange(index+2, index)"
                       :class="[
                    'iconfont',
                    'iconxiayi',
                    { disabled:form.detailsTableAll.length - 1 == index }
                  ]"></i>
                  </label>
                </li>
              </ul>
            </div>

          </param-key-config>

        </div>

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
    <judge-pop ref="judgePop2"
               @handleClose="handleClose2"></judge-pop>
               <operate-button-setting ref="operateButtonSetting" @submit="operateButtonSubmit" :form='form'></operate-button-setting>
  </div>
</template>
<script>
import dataPresentation from './dataPresentation.json'
import JudgePop from '../JudgePop/index.vue'
import { dragDialog } from '../../utils/mixins.js'
import { DetailsTable, ChartsMixins,iframeMixins } from './mixins.js'
import ApiChoose from '../ApiChoose/index.vue'
import ParamKeyConfig from './ParamKeyConfig/index.vue'
import OperateButtonSetting from './OperateButtonSetting/index.vue'
export default {
  mixins: [DetailsTable, dragDialog, ChartsMixins,iframeMixins],
  // props: ['form', 'dataUrl', 'statisticsAll'],
  props: {
    form: {
      type: Object
    },
    dataUrl: {
      type: String
    },
    statisticsAll: {
      type: Object
    },
    itemApiData: {
      type: Array
    },
    whereForm: {
      type: Object
    }
  },
  components: { JudgePop, ApiChoose, ParamKeyConfig,OperateButtonSetting},
  data () {
    return {
      dialogRef: 'settingFormDialog', // 弹出框refs名
      dialogVisible: false,
      options: [],
      rules: [],
      csData: [],
      deleteKeyIndex: null,
      parentParamsAll: {},//父级下钻参数
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
    // 弹窗关闭事件
    close () {
      this.dialogVisible = false
      // this.$refs['settingForm'].resetFields()
    },
    // 弹窗显示事件
    show (obj) {
      this.dialogVisible = true
      
      if (obj) {
        this.parentParamsAll = obj
      }
    },
    // 表单确认事件
    onSubmit () {
      this.$emit('submit', this.form)
    },
    //接口名称变化事件
    urlNameChange (val) {
      //  console.log(val)
      this.itemApiData.forEach(item => {
        if (item.apeName === val) {
          this.form.url = item.aaaRequestUrl
          this.form.options = item.method
        }
      })
    },
    //接口路径变化事件
    urlChange (val) {
      this.itemApiData.forEach(item => {
        if (item.aaaRequestUrl === val) {
          this.form.options = item.method
          this.form.urlName = item.apeName
        }
      })
    }
  }
}
</script>
