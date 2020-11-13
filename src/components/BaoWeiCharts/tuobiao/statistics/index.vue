<template>
  <div>
    <div v-if="settingForm.mask && settingForm.mask == '1'"
         class="statisticsMask"
         :style="{ 'z-index': settingForm.zindex }"
         @click="statisticsClose" />
    <article v-show="statisticsAll.isShow!==false"
             :ref="'statisticsWrap'"
             :style="{
        height: modelStyle.height + 'px',
        width: modelStyle.width + 'px',
        left: modelStyle.left + 'px',
        top: modelStyle.top + 'px',
        cursor:cursor,
        'z-index': settingForm.zindex
      }"
             :class="['statisticsWrap', 'statisticsWrapCase2',{'statisticsWrapCase3':settingForm.moduleType==='3'},
             {'iframe-statistics-wrap':settingForm.moduleType==='1'}]">
      <div class="statisticsBox">
        <div v-if="isAdmin||settingForm.moduleType!=='1'"
             class="statistics_title theme-bg-color"
             @mousedown="mousedown_tz">
          <i v-if="statisticsAll.parentModuleId||(settingForm.blankTemplateConfig&&settingForm.blankTemplateConfig.isCloseBtn===true)"
             class="el-icon-close"
             @click="statisticsClose" />
          <div class="box">
            <div class="left">
              <span class="txt1">{{ settingForm.title }}</span>
              <span v-if="settingForm.subtitle1">---</span>
              <span class="txt2 theme-color">{{ settingForm.subtitle1 }}</span>
            </div>
            <div class="right">
              <span class="txt3">{{ settingForm.subtitle2 }}</span>

              <i v-if="statisticsAll.parentModuleId&&isAdmin"
                 title="同级新增"
                 class="iconzengjia iconfont"
                 @click="TJAdd" />
              <!-- 设置按钮 -->

              <i v-if="isAdmin&&settingForm.moduleType!=='1'"
                 title="筛选配置"
                 class="iconicon-system-fn-configure iconfont"
                 @click="screenSetting" />
              <i v-if="isAdmin&&settingForm.moduleType==='0'&&settingForm.isDestail==='1'"
                 title="详情配置"
                 class="iconxiangqingpeizhi iconfont"
                 @click="destailSettingShow" />
              <i v-if="isAdmin"
                 title="模块设置"
                 class="el-icon-setting"
                 @click="settingClick" />
              <el-popconfirm v-if="isAdmin&&settingForm.moduleType!=='1'"
                             icon="el-icon-info"
                             class="copy-template-popconfirm"
                             icon-color="#8E9298"
                             title="是否克隆当前模块"
                             @confirm="copyTemplate">
                <i slot="reference"
                   title="克隆"
                   class="iconfont iconkelong" />
              </el-popconfirm>
              <el-popconfirm v-if="isAdmin"
                             icon="el-icon-info"
                             class="delete-template-popconfirm"
                             icon-color="red"
                             :title="deleteTitle"
                             @confirm="deleteTemplate">
                <i slot="reference"
                   title="删除"
                   class="el-icon-delete" />
              </el-popconfirm>

              <div v-if="!settingForm.moduleType||settingForm.moduleType==='0'"
                   class="pic">
                <!-- isAdmin && typeData.length > 1 -->
                <i class="iconfont icondangan" />
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
                        @click="chooseType(item.type)">{{ item.title }}</li>
                  </ul>
                </div>
              </div>
              <span v-if="settingForm.isAddMoreIcon==='1'"
                    class="more"
                    @click="moduleMore">更多</span>
              <!-- iconfont icongengduo -->
            </div>
          </div>
        </div>
        <!-- <div class="statistics-Box"></div> -->

        <div v-loading="!statisticsAll.data&&(settingForm.moduleType==='0'||settingForm.moduleType==='2')"
             class="statistics-content"
             element-loading-text="数据加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.2)">
          <!-- 筛选模块 -->
          <where ref="where"
                 :condition-area-config="statisticsAll.conditionAreaConfig"
                 @whereOtherBtnClick="whereOtherBtnClick"
                 @whereSubmit="whereSubmit" />
          <!-- 空白模板嵌入 -->
          <div v-if="settingForm.moduleType==='3'"
               :style="{'width':'100%','height':boxHeight()+'px'}">
            <slot :name="settingForm.blankTemplateConfig.slot" />
          </div>
          <!-- 列表展示 -->
          <list v-if="settingForm.displayMode == 'list'&&isCharts()"
                :height="boxHeight()"
                :data="statisticsAll.data"
                :colums="nowClums()"
                :statistics-all="statisticsAll"
                :pagination-all="statisticsAll.paginationAll"
                :setting-form="settingForm"
                @rowClick="rowClick"
                @cellClick="cellClick"
                @operateButtonClick="operateButtonClick"
                @tablePageSort="tablePageSort" />
          <!-- 数据表格展示 -->
          <bw-table v-if="settingForm.displayMode == 'table'&&isCharts()"
                    :tabledata="statisticsAll.data"
                    :colums="nowClums()"
                    :height="boxHeight()"
                    :setting-form="settingForm"
                    :width="modelStyle.width - 40"
                    :statistics-all="statisticsAll"
                    :border="false"
                    :pagination-all="statisticsAll.paginationAll"
                    @operateButtonClick="operateButtonClick"
                    @cellClick="cellClick"
                    @rowClick="rowClick"
                    @tablePageSort="tablePageSort" />
          <!-- 折线图、条形图、柱状图、饼图、环图 -->
          <bw-line v-if="bwLineType.indexOf(settingForm.displayMode) > -1&&isCharts()"
                   :data="statisticsAll.data"
                   :chart-column="settingForm.keyArr"
                   :title-show="settingForm.titleShow==='1'?true:false"
                   :settingConfig="settingConfig"
                   :chart-type="settingForm.displayMode"
                   :settingForm="settingForm"
                   :height="boxHeight()"
                   @setOptions="setOptions"
                   @eventClick="eventClick" />
          <!-- <slot name="otherBox"></slot> -->
          <!-- 详情列表模块组件 -->
          <details-table v-if="settingForm.moduleType==='2'"
                         :label-width="settingForm.destailsTableLabelWidth"
                         :setting-form="settingForm"
                         :table-data="statisticsAll.data"
                         :height="boxHeight()" />
          <!-- iframe嵌入组件 -->
          <iframe-model v-if="settingForm.moduleType==='1'"
                        :height="boxHeight()+55"
                        :statistics-all="statisticsAll"
                        :iframe-position-all="statisticsAll.iframePositionAll"
                        :iframe-all="settingForm.iframeAll" />
        </div>
        <!-- 左侧缩放按钮控制 -->
        <div v-if="isAdmin"
             class="suofang suofang-left"
             @mousedown="mousedown_left_ls">
          <!-- <i
          class="iconfont iconkuozhan-copy theme-color"></i>-->
        </div>
        <!-- 右侧缩放按钮控制 -->
        <div v-if="isAdmin"
             class="suofang suofang-right"
             @mousedown="mousedown_right_ls">
          <!-- <i
          class="iconfont iconkuozhan theme-color"></i>-->
        </div>
        <!-- 模块修改表单 -->
        <settingForm ref="settingForm"
                     :form="settingForm"
                     :data-url="dataUrl"
                     :statistics-all="statisticsAll"
                     :item-api-data="itemApiData"
                     :data-view-list="dataViewList"
                     :where-form="whereForm"
                      :settingConfig="settingConfig"
                     @submit="settingKeep" />
        <!-- 子模块新增表单 -->
        <settingForm ref="childSettingForm"
                     :form="childSettingForm"
                     :data-url="dataUrl"
                      :settingConfig="settingConfig"
                     :item-api-data="itemApiData"
                     :data-view-list="dataViewList"
                     @submit="childSettingKeep" />
        <!-- 筛选配置弹出层 -->
        <where-setting ref="screenSetting"
                       @screenKeep="screenKeep" />
        <!-- 详情配置弹窗 -->
        <destail-setting ref="destailSetting"
                         @submit="destailSettingSubmit" />
        <!-- 详情弹窗 -->
        <destail ref="destail"
                 :statistics-all="statisticsAll" />
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
import {
  dataMixins,
  childMixins,
  screenMixins,
  destailMixins
} from './statisticsMixins'
import dataPresentation from '../../components/SettingForm/dataPresentation.json'
import DestailSetting from '../../components/DestailSetting'
import Destail from '../../components/Destail'
import DetailsTable from '../../components/DetailsTable/index.vue'
import IframeModel from '../../components/IframeModel/index.vue'
export default {
  components: {
    SettingForm,
    List,
    BwLine,
    BwTable,
    WhereSetting,
    Where,
    DestailSetting,
    Destail,
    DetailsTable,
    IframeModel
  },
  mixins: [dataMixins, childMixins, screenMixins, destailMixins],
  // props: ['statisticsAll', 'browserXY', 'systemPermissions', 'dataUrl'],
  props: {
    statisticsAll: {
      type: Object,
      default: null
    },
    browserXY: {
      type: Object,
      default: null
    },
    systemPermissions: {
      type: String,
      default: null
    },
    dataUrl: {
      type: String,
      default: null
    },
    addSettingForm: {
      type: Object,
      default: null
    },
    itemApiData: {
      type: Array,
      default: null
    },
    dataViewList: {
      type: Array,
      default: null
    },
    settingConfig: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      statisticsShow: true,
      bwLineType: ['pie', 'ring', 'histogram', 'bar', 'line', 'radar'],
      typeData: dataPresentation,
      chooseHover: null
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
      if (
        this.statisticsAll.isRowDrillDown === '1' ||
        this.statisticsAll.drillDownKeyAll
      ) {
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
    // 当前模块是否为图表组件判断
    isCharts () {
      const offon = !!(
        !this.settingForm.moduleType || this.settingForm.moduleType === '0'
      )
      return offon
    },
    // 表单内容区域高度
    boxHeight () {
      if (
        this.statisticsAll.conditionAreaConfig &&
        this.statisticsAll.conditionAreaConfig.screenData.length > 0
      ) {
        return this.modelStyle.height - 46 - 42 -10
      } else {
        return this.modelStyle.height - 46
      }
    },
    // 更多按钮点击事件
    moduleMore () {
      if (this.settingForm.moreUrl.replace(/\s*/g, '') !== '') {
        window.open(this.settingForm.moreUrl, '_blank')
      }
      this.$emit('statisticsMore', this.statisticsAll)
    },
    // 模板克隆事件
    copyTemplate () {
      // 克隆当前模块配置数据
      const contentAreaConfigCopy = JSON.parse(JSON.stringify(this.settingForm))
      contentAreaConfigCopy.title = contentAreaConfigCopy.title + '-copy'
      contentAreaConfigCopy.zindex = (
        parseFloat(contentAreaConfigCopy.zindex) + 1
      ).toString()
      // console.log(contentAreaConfigCopy)
      // 判断当前克隆模块为子级还是一级页面模块
      if (!this.statisticsAll.parentModuleId) {
        // 一级克隆 --调用一级新增方法
        this.$emit('firstAddKeep', contentAreaConfigCopy)
      } else {
        this.childAddType = '0'
        this.childSettingKeep(contentAreaConfigCopy)
      }
    },
    // 配置字段筛选
    nowClums () {
      const data = []
      this.settingForm.keyArr.forEach((item) => {
        if (item.isShow === true) {
          data.push(item)
        }
      })
      return data
    },
    // 弹窗关闭事件
    statisticsClose () {
      if (this.settingForm.moduleType === '3') {
        this.$emit(
          'blankTemplateClose',
          this.statisticsAll.moduleId

        )
      } else {
        this.$emit(
          'statisticsClose',
          this.statisticsAll.moduleId,
          this.statisticsAll.parentModuleId
        )
      }

    },
    // 模块删除按钮点击事件
    deleteTemplate () {
      this.$emit(
        'deleteMoule',
        this.statisticsAll.moduleId,
        this.statisticsAll.menuId,
        this.statisticsAll.parentModuleId
      )
    },
    // 模块设置表单保存事件
    settingKeep (contentAreaConfig) {
      this.setDemos()
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
      this.$emit('settingClick', this.statisticsAll, (keyArr) => {
        this.$refs['settingForm'].show({
          keyArr
        })
      })
    },
    // 展示方式选择点击事件
    chooseType (chartType) {
      this.settingForm.displayMode = chartType
      if (this.isAdmin) {
        this.$emit(
          'updateMoule',
          this.settingForm,
          this.statisticsAll.moduleId,
          () => { },
          this.whereForm
        )
      }
    },
    // 分页事件
    tablePageSort (pageAll) {
      this.$emit(
        'tablePageSort',
        this.statisticsAll.moduleId,
        pageAll,
        this.whereForm
      )
    },
    // 图表点击事件
    eventClick (e) {
      this.statisticsAll.data.forEach((items, index) => {
        let offon=false;
        if(this.settingForm.displayMode ==='bar'){
          offon=this.statisticsAll.data.length-1-e.dataIndex === index
        }else{
          offon=e.dataIndex === index
        }
        if (offon) {
          this.rowClick(items, index)
          this.settingForm.keyArr.forEach((item, num) => {
            if (num > 0 && items[item.key] === e.value) {
              this.cellClick(items, item.key)
            }
          })
        }
      })
    },
    //图表配置数据暴露，外层定制化
    setOptions(options,chartType,data){
           this.$emit('setOptions',options,chartType,data,this.statisticsAll.moduleId)
    }
  }
}
</script>
