<template>
  <div>
    <el-dialog ref="settingFormDialog"
               v-drag
               class="settingForm dialog-common"
               :append-to-body="true"
               :rules="rules"
               :visible.sync="dialogVisible">
      <div slot="title"
           class="headerTitle">模块配置信息</div>
      <el-form ref="settingForm"
               :model="form"
               label-width="130px">
        <el-row type="flex"
                class="row-bg">
          <el-col :span="8">
            <el-form-item label="模块标题"
                          prop="title">
              <el-input v-model="form.title"
                        size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="副标题1"
                          prop="subtitle1">
              <el-input v-model="form.subtitle1"
                        size="small"
                        :disabled="!statisticsAll||statisticsAll.parentModuleId ? true : false" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="副标题2"
                          prop="subtitle2">
              <el-input v-model="form.subtitle2"
                        size="small" />
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
          <el-col v-if="form.isAddMoreIcon==='1'"
                  :span="16">
            <el-form-item label="按钮跳转路径"
                          prop="moreUrl">
              <el-input v-model="form.moreUrl"
                        size="small"
                        placeholder="按钮跳转路径为空则不跳转页面，自行进行二次开发" />
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
        <div v-if="!form.moduleType||form.moduleType==='0'"
             class="content-dy-box">
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
                             :value="item.value" />
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
            <el-col v-if="form.submodule == '1'"
                    :span="8">
              <el-form-item label="子模块点击展现"
                            prop="clickToShow">
                <el-radio-group v-model="form.clickToShow"
                                @change="clickToShowChange">
                  <el-radio label="row">行点击</el-radio>
                  <el-radio label="cell">单元格点击</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col v-if="form.submodule == '0'"
                    :span="8">
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
            <el-col v-if="form.isLinkMap === '1'"
                    :span="16">
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
                            prop="apiType">
                <el-radio-group v-model="form.apiType"
                                @change="apiTypeChange">
                  <el-radio label="0">数据视图</el-radio>
                  <el-radio label="1">服务接口</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据是否添加分页"
                            prop="isPage">
                <el-radio-group v-model="form.isPage">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0"
                            :disabled="isPageDisabled">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item v-if="form.isPage == '1'"
                            label="每页显示数据(条)"
                            prop="pageSize">
                <el-input-number v-model="form.pageSize"
                                 size="small"
                                 :min="0"
                                 :max="1000"
                                 :precision="0" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- <el-form-item label="接口默认参数"
                        prop="defaultParameters">
            <el-input size="small"
                      v-model="form.defaultParameters"
                      placeholder='例:{"num":9,"area":"44公顷"}'></el-input>
          </el-form-item>-->
          <!-- 数据接口处理部分 -->
          <api-choose ref="apiChoose"
                      :item-api-data="itemApiData"
                      :data-view-list="dataViewList"
                      :form="form" />
          <!-- 接口参数、字段配置             -->
          <param-key-config :item-api-data="itemApiData"
                            :form="form"
                            :parent-params-all="parentParamsAll"
                            :statistics-all="statisticsAll"
                            :where-form="whereForm">
            <div slot="keys">
              <el-button size="small"
                         @click="getKeysData">字段获取</el-button>
              <el-button v-if="['table','list'].indexOf(form.displayMode)>-1"
                         size="small"
                         @click="operateButtonSetting">右侧操作按钮配置</el-button>
              <p class="tips">
                <span v-if="!isWidth">*第一个字段必须为图表标题字段</span>
              </p>
              <ul class="zdpz_list keys-config-list">
                <li class="zdpz_list_header">
                  <span class="hTxt1 hTxt">字段名</span>
                  <span class="hTxt2 hTxt">含义</span>
                  <span v-if="isWidth"
                        class="hTxt3 hTxt">宽度</span>
                  <span class="hTxt4 hTxt">单位</span>
                  <span v-if="form.submodule==&quot;1&quot;"
                        class="hTxt7 hTxt">下级参数</span>
                  <span v-if="form.isLinkMap=='1'"
                        class="hTxt9 hTxt">地图使用字段</span>
                  <span class="hTxt8 hTxt">
                    列表显示
                    <el-checkbox v-model="listKeyAll"
                                 @change="ListkeyChooseChange" />
                  </span>
                  <span class="hTxt81 hTxt">
                    图表显示
                    <el-checkbox v-model="chartsKeyAll"
                                 @change="ChartskeyChooseChange" />
                  </span>
                  <span class="hTxt82 hTxt">图表标题字段</span>
                  <!-- <span class="hTxt5 hTxt" v-if="form.clickToShow=='cell'">下钻关联字段</span> -->
                  <span class="hTxt6 hTxt icons">
                    <i class="el-icon-circle-plus-outline theme-color"
                       @click="keyAdd(index)" />
                  </span>
                </li>
                <li v-for="(item, index) in form.keyArr"
                    :key="index"
                    class="zdpz_list_content">
                  <span class="hTxt1 hTxt">
                    <el-input v-model="item.key"
                              size="mini"
                              placeholder="字段名"
                              :disabled="item.key==='operationButton'" />
                  </span>
                  <span class="hTxt2 hTxt">
                    <el-input v-model="item.explain"
                              size="mini"
                              :title="item.explain"
                              placeholder="含义"
                              :disabled="item.key==='operationButton'" />
                  </span>
                  <span v-if="isWidth"
                        class="hTxt3 hTxt">
                    <el-input v-model="item.width"
                              size="mini"
                              placeholder="宽度" />
                  </span>
                  <span class="hTxt4 hTxt">
                    <el-input v-model="item.dw"
                              size="mini"
                              placeholder="单位"
                              :disabled="item.key==='operationButton'" />
                  </span>
                  <!-- 下级参数 -->
                  <span v-if="form.submodule==&quot;1&quot;"
                        class="hTxt7 hTxt">
                    <el-checkbox v-model="item.isCruxKey"
                                 :disabled="item.key==='operationButton'" />
                  </span>
                  <!-- 地图使用字段 -->
                  <span v-if="form.isLinkMap=='1'"
                        class="hTxt9 hTxt">
                    <el-checkbox v-model="item.isMapKey"
                                 :disabled="item.key==='operationButton'"
                                 @change="isMapKeyChange(item)" />
                  </span>
                  <!-- 列表显示 -->
                  <span class="hTxt8 hTxt">
                    <el-checkbox v-model="item.isShow"
                                 :disabled="item.key==='operationButton'" />
                  </span>
                  <!-- 图表显示 -->
                  <span class="hTxt81 hTxt">
                    <el-checkbox v-model="item.ischartsShow"
                                 :disabled="item.key==='operationButton'" />
                  </span>
                  <!-- 图表标题字段 -->
                  <span class="hTxt82 hTxt">
                    <el-checkbox v-model="item.ischartsTitle"
                                 :disabled="item.key==='operationButton'"
                                 @change="chartsTitleChange(item.key)" />
                  </span>
                  <span class="icons hTxt6 hTxt">
                    <i class="el-icon-circle-plus-outline theme-color"
                       @click="keyAdd(index)" />
                    <i v-show="form.keyArr.length > 1&&item.key!=='operationButton'"
                       class="el-icon-remove-outline remove"
                       @click="keyRemove(index)" />
                    <i :class="['iconfont', 'iconshangyi', { disabled: index == 0 }]"
                       @click="sortPrev(item, index, index == 0)" />
                    <i :class="[
                        'iconfont',
                        'iconxiayi',
                        { disabled: form.keyArr.length - 1 == index }
                      ]"
                       @click="
                        sortNext(item, index, form.keyArr.length - 1 == index)
                      " />
                  </span>
                </li>
              </ul>
            </div>
          </param-key-config>
          <el-row v-if="form.menuTapAll"
                  class="el-row-menu-tap">
            <el-col :span="8">
              <el-form-item label="是否绑定菜单页面跳转"
                            label-width="140px">
                <el-radio-group v-model="form.menuTapAll.isMenuTap">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuTapAll.isMenuTap==='1'"
                    :span="8">
              <el-form-item label="触发跳转字段">
                <el-select v-model="form.menuTapAll.menuTapKey"
                           size="small"
                           placeholder="触发跳转字段">
                  <el-option v-for="item in form.keyArr"
                             :key="item.key"
                             :label="item.key"
                             :value="item.key" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuTapAll.isMenuTap==='1'"
                    :span="8">
              <el-form-item label="菜单编码字段">
                <el-select v-model="form.menuTapAll.menuCodeKey"
                           size="small"
                           placeholder="触发跳转字段">
                  <el-option v-for="item in form.keyArr"
                             :key="item.key"
                             :label="item.key"
                             :value="item.key" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- iframe嵌入 -->
        <div v-if="form.moduleType==='1'"
             class="content-dy-box iframe-dy-box">
          <el-row>
            <el-col :span="8">
              <el-form-item label="iframe类型"
                            prop="iframeType">
                <el-radio-group v-model="form.iframeAll.iframeType"
                                @change="iframeTypeChange">
                  <el-radio label="0">地图</el-radio>
                  <el-radio label="1">其他</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="iframe框id"
                            prop="iframeId">
                <el-input v-model="form.iframeAll.iframeId"
                          size="small"
                          placeholder="自定义iframe框id名" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="iframe路径"
                            prop="iframeUrl">
                <el-input v-model="form.iframeAll.iframeUrl"
                          size="small"
                          placeholder="iframe嵌入站点路径" />
              </el-form-item>
            </el-col>
          </el-row>
          <param-key-config v-if="form.iframeAll.iframeType==='1'"
                            ref="paramKeyConfig"
                            :item-api-data="itemApiData"
                            :form="form"
                            component-type="iframe"
                            @useChange="iframeUseChange" />
        </div>
        <!-- 详情列表展示 -->
        <div v-if="form.moduleType==='2'"
             class="content-dy-box">
          <el-row type="flex"
                  class="row-bg">
            <el-col :span="8">
              <el-form-item label="左侧标题宽度"
                            prop="destailsTableLabelWidth">
                <el-input-number v-model="form.destailsTableLabelWidth"
                                 controls-position="right"
                                 size="small"
                                 :min="1"
                                 :max="300" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 数据接口处理部分 -->
          <api-choose :item-api-data="itemApiData"
                      :data-view-list="dataViewList"
                      :form="form" />
          <!-- 接口参数、字段配置             -->
          <param-key-config :item-api-data="itemApiData"
                            :form="form"
                            :parent-params-all="parentParamsAll"
                            :statistics-all="statisticsAll"
                            :where-form="whereForm">
            <div slot="keys">
              <el-button size="small"
                         @click="getKeysData">字段获取</el-button>
              <p class="tips" />
              <ul class="details-table-list">
                <li>
                  <span class="hTxt01 hTxt">排序</span>
                  <span class="hTxt02 hTxt">字段名</span>
                  <span class="hTxt03 hTxt">标题</span>
                  <span class="hTxt04 hTxt">宽度占比(行)</span>
                  <span class="hTxt05 hTxt">是否显示</span>
                  <span class="hTxt06 hTxt icons">
                    <i class="el-icon-circle-plus-outline theme-color"
                       @click="detailsTableKeyAdd" />
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
                                     size="small"
                                     :min="1"
                                     :max="50"
                                     @change="detailsTableSortChange(item.sort,index)" />
                  </span>
                  <label class="hTxt02 hTxt">
                    <el-input v-model="item.key"
                              size="mini"
                              placeholder="字段名" />
                  </label>
                  <label class="hTxt03 hTxt">
                    <el-input v-model="item.title"
                              size="mini"
                              placeholder="标题" />
                  </label>
                  <label class="hTxt04 hTxt">
                    <el-select v-model="item.proportion"
                               size="small"
                               placeholder="请选择">
                      <el-option v-for="option in proportionAll"
                                 :key="option.value"
                                 :label="option.label"
                                 :value="option.value" />
                    </el-select>
                  </label>
                  <label class="hTxt05 hTxt">
                    <el-checkbox v-model="item.isShow" />
                  </label>
                  <label class="hTxt06 hTxt icons">
                    <i class="el-icon-remove-outline remove"
                       @click="detailsTableKeyDelete(index)" />
                    <i :class="['iconfont', 'iconshangyi', { disabled: index == 0 }]"
                       @click="detailsTableSortChange(index, index)" />
                    <i :class="[
                        'iconfont',
                        'iconxiayi',
                        { disabled:form.detailsTableAll.length - 1 == index }
                      ]"
                       @click="detailsTableSortChange(index+2, index)" />
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
              <el-input-number v-model="form.width"
                               size="small"
                               :min="0"
                               :max="100"
                               :precision="2" />
              <el-button @click="widthMax"
                         size="small">一键100%</el-button>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="高度(页面占比)"
                          prop="height">
              <el-input-number v-model="form.height"
                               size="small"
                               :min="0"
                               :max="100"
                               :precision="2" />
              <el-button @click="heightMax"
                         size="small">一键100%</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex"
                class="row-bg">
          <el-col :span="12">
            <el-form-item label="位置X轴(页面占比)"
                          prop="left">
              <el-input-number v-model="form.left"
                               size="small"
                               :min="0"
                               :max="100"
                               :precision="2" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置Y轴(页面占比)"
                          prop="top">
              <el-input-number v-model="form.top"
                               size="small"
                               :min="0"
                               :max="100"
                               :precision="2" />
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
                        placeholder="若模块重叠,低层级模块会被高层级覆盖" />
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
        <el-button size="small"
                   @click="close">取 消</el-button>
        <el-button type="primary"
                   size="small"
                   @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <judge-pop ref="judgePop"
               @handleClose="handleClose"
               @confirm="judgePopConfirm" />
    <judge-pop ref="judgePop2"
               @handleClose="handleClose2" />
    <operate-button-setting ref="operateButtonSetting"
                            :form="form"
                            @submit="operateButtonSubmit" />
  </div>
</template>
<script>
import dataPresentation from './dataPresentation.json'
import JudgePop from '../JudgePop/index.vue'
import { dragDialog } from '../../utils/mixins.js'
import {
  DetailsTable,
  ChartsMixins,
  iframeMixins
} from './SettingFormMixins.js'
import ApiChoose from '../ApiChoose/index.vue'
import ParamKeyConfig from './ParamKeyConfig/index'
import OperateButtonSetting from './OperateButtonSetting/index.vue'
export default {
  components: { JudgePop, ApiChoose, ParamKeyConfig, OperateButtonSetting },
  mixins: [DetailsTable, dragDialog, ChartsMixins, iframeMixins],
  // props: ['form', 'dataUrl', 'statisticsAll'],
  props: {
    form: {
      type: Object,
      default: null
    },
    dataUrl: {
      type: String,
      default: null
    },
    statisticsAll: {
      type: Object,
      default: null
    },
    itemApiData: {
      type: Array,
      default: null
    },
    whereForm: {
      type: Object,
      default: null
    },
    dataViewList: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      dialogRef: 'settingFormDialog', // 弹出框refs名
      dialogVisible: false,
      options: [],
      rules: [],
      csData: [],
      deleteKeyIndex: null,
      parentParamsAll: {}, // 父级下钻参数
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
  computed: {
    // 字段配置宽度列是否显示
    isWidth () {
      if (
        this.form.displayMode === 'list' ||
        this.form.displayMode === 'table'
      ) {
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    this.options = []
    dataPresentation.forEach((item) => {
      this.options.push({
        value: item.type,
        label: item.title
      })
    })
  },
  methods: {
    //高度一键铺满
    heightMax () {
      this.form.height = 100
      this.form.top = 0
    },
    //宽度一键铺满
    widthMax () {
      this.form.width = 100
      this.form.left = 0
    },
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
      // 图表、列表全选按钮控制
      this.keyChooseAllShow()
    },
    // 表单确认事件
    onSubmit () {
      this.$emit('submit', this.form)
    },
    // 接口名称变化事件
    urlNameChange (val) {
      //  console.log(val)
      this.itemApiData.forEach((item) => {
        if (item.apeName === val) {
          this.form.url = item.aaaRequestUrl
          this.form.options = item.method
        }
      })
    },
    // 接口路径变化事件
    urlChange (val) {
      this.itemApiData.forEach((item) => {
        if (item.aaaRequestUrl === val) {
          this.form.options = item.method
          this.form.urlName = item.apeName
        }
      })
    }
  }
}
</script>
