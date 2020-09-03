<template>
  <div>
    <div class="statisticsMask"
         :style="{ 'z-index': settingForm.zindex }"
         @click="statisticsClose"
         v-if="settingForm.mask && settingForm.mask == '1'"></div>
    <article :ref="'statisticsWrap'"
             @mousedown="mousedown_tz"
             :style="{
        height: modelStyle.height - 16 + 'px',
        width: modelStyle.width - 40 + 'px',
        left: modelStyle.left + 'px',
        top: modelStyle.top + 'px',
cursor:cursor,
        'z-index': settingForm.zindex
      }"
             :class="['statisticsWrap', 'statisticsWrapCase2']">
      <div class="statisticsBox">
        <div class="statistics_title">
          <i v-if="statisticsAll.parentModuleId"
             @click="statisticsClose"
             class="el-icon-close"></i>
          <div class="box theme-border-color">
            <div class="left">
              <span class="txt1">{{ settingForm.title }}</span>
              <span v-if="settingForm.subtitle1">---</span>
              <span class="txt2 theme-color">{{ settingForm.subtitle1 }}</span>
            </div>
            <div class="right">
              <span class="txt3">{{ settingForm.subtitle2 }}</span>
              <i title="同级新增"
                 class="iconzengjia iconfont"
                 v-if="this.statisticsAll.parentModuleId&&isAdmin"
                 @click="TJAdd"></i>
              <!-- 设置按钮 -->
              <el-popconfirm icon="el-icon-info"
                             class="delete-template-popconfirm"
                             @onConfirm="deleteTemplate"
                             iconColor="red"
                             :title="deleteTitle"
                             v-if="isAdmin">
                <i title="删除"
                   slot="reference"
                   class="el-icon-delete"></i>
              </el-popconfirm>

              <i title="筛选配置"
                 v-if="isAdmin"
                 @click="screenSetting"
                 class="iconicon-system-fn-configure iconfont"></i>
              <i title="详情配置"
                 v-if="isAdmin"
                 @click="destailSettingShow"
                 class="iconxiangqingpeizhi iconfont"></i>
              <i @click="settingClick"
                 v-if="isAdmin"
                 title="模块设置"
                 class="el-icon-setting"></i>
              <!-- <i title="筛选"
                 v-if="
                  statisticsAll.conditionAreaConfig &&
                    statisticsAll.conditionAreaConfig.length > 0
                "
                 @click="filterShow"
                 class="iconshaixuan iconfont theme-color"></i> -->
              <el-popconfirm icon="el-icon-info"
                             class="copy-template-popconfirm"
                             @onConfirm="copyTemplate"
                             iconColor="#8E9298"
                             title="是否克隆当前模块"
                             v-if="isAdmin">
                <i title="克隆"
                   slot="reference"
                   class="iconfont iconkelong"></i>
              </el-popconfirm>
              <div class="pic"
                   v-if="isAdmin && typeData.length > 1">
                <i class="iconfont icondangan theme-color"></i>
                <div class="t_list">
                  <ul>
                    <li v-for="(item, index) in typeData"
                        :key="index"
                        :class="{
                        'active theme-bg-color':
                          item.type == settingForm.displayMode ||
                          chooseHover == index
                      }"
                        @mousemove="chooseHover = index"
                        @mouseout="chooseHover = null"
                        @click="chooseType(item.type)">
                      {{ item.title }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- {{statisticsAll.data}} -->
        <!-- 筛选模块 -->
        <where ref="where"
               :conditionAreaConfig="statisticsAll.conditionAreaConfig"
               @whereOtherBtnClick="whereOtherBtnClick"
               @whereSubmit="whereSubmit"></where>
        <div class="statistics-content"
             v-loading="!statisticsAll.data"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.2)">
          <!-- 列表展示 -->
          <list v-if="settingForm.displayMode == 'list'"
                :height="boxHeight()"
                :data="statisticsAll.data"
                :colums="nowClums()"
                :statisticsAll="statisticsAll"
                :paginationAll="statisticsAll.paginationAll"
                @rowClick="rowClick"
                @cellClick="cellClick"
                @tablePageSort="tablePageSort"></list>
          <!-- 数据表格展示 -->
          <bw-table v-if="settingForm.displayMode == 'table'"
                    :tabledata="statisticsAll.data"
                    :colums="nowClums()"
                    :height="boxHeight()"
                    :width="modelStyle.width - 40"
                    :statisticsAll="statisticsAll"
                    :border="false"
                    :paginationAll="statisticsAll.paginationAll"
                    @cellClick="cellClick"
                    @rowClick="rowClick"
                    @tablePageSort="tablePageSort"></bw-table>
          <!-- 折线图、条形图、柱状图、饼图、环图 -->
          <bw-line v-if="bwLineType.indexOf(settingForm.displayMode) > -1"
                   :data="statisticsAll.data"
                   :chartColumns="nowClums()"
                   :chartType="settingForm.displayMode"
                   :height="boxHeight()"
                   @eventClick="eventClick"></bw-line>
          <!-- <slot name="otherBox"></slot> -->

          <!-- 拖拽图标显示控制 -->
          <!-- <i v-if="isAdmin"
             title="拖拽"
             :style="TZStyle"
             class="icontuozhuai iconfont"></i> -->
        </div>
        <!-- 左侧缩放按钮控制 -->
        <div class="suofang suofang-left"
             v-if="isAdmin"
             @mousedown="mousedown_left_ls">
          <!-- <i
             class="iconfont iconkuozhan-copy theme-color"></i> -->
        </div>
        <!-- 右侧缩放按钮控制 -->
        <div class="suofang suofang-right"
             v-if="isAdmin"
             @mousedown='mousedown_right_ls'>
          <!-- <i
             class="iconfont iconkuozhan theme-color"></i> -->
        </div>
        <!-- 模块修改表单 -->
        <settingForm ref="settingForm"
                     :form="settingForm"
                     :dataUrl="dataUrl"
                     :statisticsAll="statisticsAll"
                     @submit="settingKeep"></settingForm>
        <!-- 子模块新增表单 -->
        <settingForm ref="childSettingForm"
                     :form="childSettingForm"
                     :dataUrl="dataUrl"
                     :statisticsAll="statisticsAll"
                     @submit="childSettingKeep"></settingForm>
        <!-- 筛选配置弹出层 -->
        <where-setting ref="screenSetting"
                       @screenKeep="screenKeep"></where-setting>
        <!-- 详情配置弹窗 -->
        <destail-setting ref="destailSetting"
                         @submit="destailSettingSubmit"></destail-setting>
        <!-- 详情弹窗 -->
        <destail ref="destail"
                 :statisticsAll="statisticsAll"></destail>
      </div>
    </article>
  </div>
</template>
<script>
import WhereSetting from '../../components/WhereSetting'
import Where from '../../components/Where2.0'
import List from '../../components/list'
import BwLine from '../../components/line'
import BwTable from '../../components/table2'
import SettingForm from '../../components/settingForm'
import { dataMixins, childMixins, screenMixins, destailMixins } from './mixins'
import dataPresentation from '../../components/settingForm/dataPresentation.json'
import DestailSetting from '../../components/DestailSetting'
import Destail from '../../components/Destail'
export default {
  props: ['statisticsAll', 'browserXY', 'systemPermissions', 'dataUrl'],
  mixins: [dataMixins, childMixins, screenMixins, destailMixins],
  components: { SettingForm, List, BwLine, BwTable, WhereSetting, Where, DestailSetting, Destail },
  data () {
    return {
      statisticsShow: true,
      bwLineType: ['pie', 'ring', 'histogram', 'bar', 'line'],
      typeData: dataPresentation,
      chooseHover: null
      // deleteTitle: '确定删除删除当前模块？'
    }
  },
  computed: {
    isAdmin () {
      return this.systemPermissions === 'admin'
    },
    // 删除判断弹出文字
    deleteTitle () {
      let title = ''
      if (this.statisticsAll.isRowDrillDown === '1' || this.statisticsAll.drillDownKeyAll) {
        title = '当前模块已配置有子级，是否强制删除当前模块和所有子级模块？'
      } else {
        title = '确定删除删除当前模块？'
      }
      return title
    }
  },
  watch: {
    'statisticsAll.contentAreaConfig' () {
      this.settingForm = JSON.parse(
        JSON.stringify(this.statisticsAll.contentAreaConfig)
      )
      this.getMainStyle()
      this.setDemos()
    },
    browserXY: {
      handler () {
        this.getMainStyle()
        this.setDemos()
      },
      deep: true
    }
  },
  mounted () {
    // console.log(this.statisticsAll)
    this.settingForm = JSON.parse(
      JSON.stringify(this.statisticsAll.contentAreaConfig)
    )
    this.setDemos()
  },
  methods: {
    // 表单内容区域高度
    boxHeight () {
      if (this.statisticsAll.conditionAreaConfig && this.statisticsAll.conditionAreaConfig.screenData.length > 0) {
        return this.modelStyle.height - 46 - 42
      } else {
        return this.modelStyle.height - 46
      }
    },
    // 模板克隆事件
    copyTemplate () {
      // 克隆当前模块配置数据
      let contentAreaConfigCopy = JSON.parse(JSON.stringify(this.settingForm))
      contentAreaConfigCopy.title = contentAreaConfigCopy.title + '-copy'
      contentAreaConfigCopy.zindex = (parseFloat(contentAreaConfigCopy.zindex) + 1).toString()
      // console.log(contentAreaConfigCopy)
      // 判断当前克隆模块为子级还是一级页面模块
      if (this.statisticsAll.menuId) {
        // 一级克隆 --调用一级新增方法
        this.$emit('firstAddKeep', contentAreaConfigCopy)
      } else {
        this.childAddType = '0'
        this.childSettingKeep(contentAreaConfigCopy)
      }
    },
    // 配置字段筛选
    nowClums () {
      let data = []
      this.settingForm.keyArr.forEach(item => {
        if (item.isShow === true) {
          data.push(item)
        }
      })
      return data
    },
    // 弹窗关闭事件
    statisticsClose () {
      this.$emit('statisticsClose', this.statisticsAll.moduleId)
    },

    // 模块删除按钮点击事件
    deleteTemplate () {
      this.$emit('deleteMoule', this.statisticsAll.moduleId, this.statisticsAll.menuId)
    },
    // 模块设置表单保存事件
    settingKeep (contentAreaConfig) {
      this.$emit(
        'updateMoule',
        contentAreaConfig,
        this.statisticsAll.moduleId,
        () => {
          this.$refs['settingForm'].close()
        },
        this.whereForm
      )
    },
    // 设置按钮点击事件
    settingClick () {
      this.$refs['settingForm'].show()
    },
    // 展示方式选择点击事件
    chooseType (chartType) {
      this.settingForm.displayMode = chartType
      this.$emit('updateMoule', this.settingForm, this.statisticsAll.moduleId, () => { }, this.whereForm)
    },
    // 分页事件
    tablePageSort (pageAll) {
      this.$emit('tablePageSort', this.statisticsAll.moduleId, pageAll, this.whereForm)
    },
    // 图表点击事件
    eventClick (e) {
      this.statisticsAll.data.forEach((items, index) => {
        if (e.dataIndex === index) {
          this.rowClick(items, index)
          this.settingForm.keyArr.forEach((item, num) => {
            if (num > 0 && items[item.key] === e.value) {
              this.cellClick(items, item.key)
            }
          })
        }
      })
    }
  }
}
</script>
