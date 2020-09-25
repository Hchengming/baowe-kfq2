<template>
  <div>
    <div class="statisticsMask"
         :style="{ 'z-index': settingForm.zindex }"
         @click="statisticsClose"
         v-if="settingForm.mask && settingForm.mask == '1'"></div>
    <article :ref="'statisticsWrap'"
             :style="{
        height: modelStyle.height + 'px',
        width: modelStyle.width + 'px',
        left: modelStyle.left + 'px',
        top: modelStyle.top + 'px',
        cursor:cursor,
        'z-index': settingForm.zindex
      }"
             :class="['statisticsWrap', 'statisticsWrapCase2',{'iframe-statistics-wrap':settingForm.moduleType==='1'}]">
      <div class="statisticsBox">
        <div class="statistics_title"
             v-if="isAdmin||settingForm.moduleType!=='1'"
             @mousedown="mousedown_tz">
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

              <i title="筛选配置"
                 v-if="isAdmin&&settingForm.moduleType!=='1'"
                 @click="screenSetting"
                 class="iconicon-system-fn-configure iconfont"></i>
              <i title="详情配置"
                 v-if="isAdmin&&settingForm.moduleType==='0'&&settingForm.isDestail==='1'"
                 @click="destailSettingShow"
                 class="iconxiangqingpeizhi iconfont"></i>
              <i @click="settingClick"
                 v-if="isAdmin"
                 title="模块设置"
                 class="el-icon-setting"></i>
              <el-popconfirm icon="el-icon-info"
                             class="copy-template-popconfirm"
                             @onConfirm="copyTemplate"
                             iconColor="#8E9298"
                             title="是否克隆当前模块"
                             v-if="isAdmin&&settingForm.moduleType!=='1'">
                <i title="克隆"
                   slot="reference"
                   class="iconfont iconkelong"></i>
              </el-popconfirm>
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

              <div class="pic"
                   v-if="!settingForm.moduleType||settingForm.moduleType==='0'">
                <!-- isAdmin && typeData.length > 1 -->
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
               <span 
                 @click="moduleMore"
                 v-if="settingForm.isAddMoreIcon==='1'"
                 class="more">更多</span>
                 <!-- iconfont icongengduo -->
            </div>
          </div>
        </div>
        <!-- <div class="statistics-Box"></div> -->

        <div class="statistics-content"
             v-loading="!statisticsAll.data&&settingForm.moduleType!=='1'"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.2)">
          <!-- 筛选模块 -->
          <where ref="where"
                 :conditionAreaConfig="statisticsAll.conditionAreaConfig"
                 @whereOtherBtnClick="whereOtherBtnClick"
                 @whereSubmit="whereSubmit"></where>
          <!-- 列表展示 -->
          <list v-if="settingForm.displayMode == 'list'&&isCharts()"
                :height="boxHeight()"
                :data="statisticsAll.data"
                :colums="nowClums()"
                :statisticsAll="statisticsAll"
                :paginationAll="statisticsAll.paginationAll"
                @rowClick="rowClick"
                @cellClick="cellClick"
                @tablePageSort="tablePageSort"></list>
          <!-- 数据表格展示 -->
          <bw-table v-if="settingForm.displayMode == 'table'&&isCharts()"
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
          <bw-line v-if="bwLineType.indexOf(settingForm.displayMode) > -1&&isCharts()"
                   :data="statisticsAll.data"
                   :chartColumns="nowClums()"
                   :titleShow="false"
                   :chartType="settingForm.displayMode"
                   :height="boxHeight()"
                   @eventClick="eventClick"></bw-line>
          <!-- <slot name="otherBox"></slot> -->
          <!-- 详情列表模块组件 -->
          <details-table v-if="settingForm.moduleType==='2'"
                         :labelWidth="settingForm.destailsTableLabelWidth"
                         :detailsTableAll="settingForm.detailsTableAll"
                         :tableData="statisticsAll.data"
                         :height="boxHeight()"></details-table>
          <!-- iframe嵌入组件 -->
          <iframe-model v-if="settingForm.moduleType==='1'"
                        :height="boxHeight()+42"
                        :statisticsAll="statisticsAll"
                        :iframePositionAll="statisticsAll.iframePositionAll"
                        :iframeAll="settingForm.iframeAll">
          </iframe-model>
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
                     :itemApiData="itemApiData"
                     :whereForm="whereForm"
                     @submit="settingKeep"></settingForm>
        <!-- 子模块新增表单 -->
        <settingForm ref="childSettingForm"
                     :form="childSettingForm"
                     :dataUrl="dataUrl"
                     :itemApiData="itemApiData"
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
import List from '../../components/List'
import BwLine from '../../components/Line/index.vue'
import BwTable from '../../components/Table2/index.vue'
import SettingForm from '../../components/SettingForm'
import { dataMixins, childMixins, screenMixins, destailMixins } from './mixins'
import dataPresentation from '../../components/SettingForm/dataPresentation.json'
import DestailSetting from '../../components/DestailSetting'
import Destail from '../../components/Destail'
import DetailsTable from '../../components/DetailsTable/index.vue'
import IframeModel from '../../components/IframeModel/index.vue'
export default {
  // props: ['statisticsAll', 'browserXY', 'systemPermissions', 'dataUrl'],
  props: {
    statisticsAll: {
      type: Object
    },
    browserXY: {
      type: Object
    },
    systemPermissions: {
      type: String
    },
    dataUrl: {
      type: String
    },
    addSettingForm: {
      type: Object
    },
    itemApiData: {
      type: Array
    }
  },
  mixins: [dataMixins, childMixins, screenMixins, destailMixins],
  components: { SettingForm, List, BwLine, BwTable, WhereSetting, Where, DestailSetting, Destail, DetailsTable, IframeModel },
  data () {
    return {
      statisticsShow: true,
      bwLineType: ['pie', 'ring', 'histogram', 'bar', 'line'],
      typeData: dataPresentation,
      chooseHover: null,
      // parentWhereFormUse:{}//父级筛选条件可传入子级条件筛选
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

    //当前模块是否为图表组件判断
    isCharts () {
      let offon = !this.settingForm.moduleType || this.settingForm.moduleType === '0' ? true : false
      return offon
    },
    // 表单内容区域高度
    boxHeight () {
      if (this.statisticsAll.conditionAreaConfig && this.statisticsAll.conditionAreaConfig.screenData.length > 0) {
        return this.modelStyle.height - 46 - 42
      } else {
        return this.modelStyle.height - 46
      }
    },
    //更多按钮点击事件
    moduleMore () {
      if (this.settingForm.moreUrl.replace(/\s*/g, '') !== '') {
        window.open(this.settingForm.moreUrl, '_blank')
      }
      this.$emit('statisticsMore', this.statisticsAll)
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
      this.$emit('statisticsClose', this.statisticsAll.moduleId, this.statisticsAll.parentModuleId)
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
      this.$emit('settingClick', this.statisticsAll, ((keyArr) => {
        this.$refs['settingForm'].show({
          keyArr
        })
      }))

    },
    // 展示方式选择点击事件
    chooseType (chartType) {
      this.settingForm.displayMode = chartType
      if(this.isAdmin){
        this.$emit('updateMoule', this.settingForm, this.statisticsAll.moduleId, () => { }, this.whereForm)
      }
      
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
