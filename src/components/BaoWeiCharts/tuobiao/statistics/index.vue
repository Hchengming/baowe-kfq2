<template>
  <div>
    <div
      v-if="settingForm.mask && settingForm.mask == '1'"
      v-show="statisticsAll.isShow !== false"
      :style="{ 'z-index': settingForm.zindex }"
      class="statisticsMask"
      @click="statisticsClose"
    />
    <article
      v-show="componentsShow"
      :id="settingForm.elementId ? settingForm.elementId : undefined"
      :ref="'statisticsWrap'"
      :style="listWrapStyle"
      :class="[
        'statisticsWrap',
        'statisticsWrapCase2',
        { statisticsWrapCase3: settingForm.moduleType === '3' },
        { 'iframe-statistics-wrap': settingForm.moduleType === '1' },
        { 'title-hide': settingForm.isHeaderHide },
        {'admin':isAdmin},
        'statistics-'+settingForm.displayMode,
        settingForm.elementClass
      ]"
    >
      <div :class="['statisticsBox',{'choose':statisticsAll.choose}]">
        <!-- 拉伸组件 -->
        <stretch
          v-if="isScaleStretch()"
          :component-id="statisticsAll.moduleId"
          :setting-config="settingConfig"
          :setting-form="settingForm"
          :stretch-elelemt="stretchElelemt"
          :container-elelemt="containerElelemt"
          @stretchkeep="TZLSKeep"
          @boxOffon="setBoxOffon"
        />
        <i
          v-if="isModuleClose()"
          class="el-icon-close"
          @click="statisticsClose"
        />
        <div
          v-if="
            settingConfig.systemPermissions === 'admin' ||
              (settingForm.moduleType !== '1' && !settingForm.isHeaderHide)
          "
          :style="{ cursor: isAdmin ? 'move' : 'default' }"
          class="statistics_title theme-bg-color"
          @mousedown="mousedown_tz"
          @click="statisticsBoxClick"
        >
          <!-- <i v-if="isModuleClose()"
             class="el-icon-close"
             @click="statisticsClose" /> -->
          <div :class="['box']">
            <div class="left">
              <span class="txt1">{{ settingForm.title }}</span>
              <span v-if="statisticsAll.contentAreaConfig.subtitle1">---</span>
              <span
                class="txt2"
                v-text="statisticsAll.contentAreaConfig.subtitle1"
              />
            </div>
            <div
              :style="{ 'margin-right': isModuleClose() ? '20px' : 0 }"
              class="right"
            >
              <span class="txt3">{{ settingForm.subtitle2 }}</span>

              <i
                v-if="statisticsAll.parentModuleId && isAdmin"
                title="同级新增"
                class="iconzengjia iconfont"
                @click="TJAdd"
              />
              <!-- 设置按钮 -->

              <!-- <i v-if="isAdmin && settingForm.moduleType !== '1'"
                 title="筛选配置"
                 class="iconicon-system-fn-configure iconfont"
                 @click="screenSetting" /> -->
              <i
                v-if="
                  isAdmin &&
                    settingForm.moduleType === '0' &&
                    settingForm.isDestail === '1'
                "
                title="详情配置"
                class="iconxiangqingpeizhi iconfont"
                @click="destailSettingShow"
              />

              <i
                v-if="isAdmin"
                title="模块设置"
                class="el-icon-setting"
                @click="settingClick"
              />
              <i
                v-if="isAdmin"
                class="el-icon-set-up"
                title="模块数据交互"
                @click="Interactive()"
              />
              <el-popconfirm
                v-if="isAdmin && settingForm.moduleType !== '1'"
                icon="el-icon-info"
                class="copy-template-popconfirm"
                icon-color="#8E9298"
                title="是否克隆当前模块"
                @confirm="copyTemplate"
              >
                <i slot="reference" title="克隆" class="iconfont iconkelong" />
              </el-popconfirm>
              <el-popconfirm
                v-if="isAdmin"
                :title="deleteTitle"
                icon="el-icon-info"
                class="delete-template-popconfirm"
                icon-color="red"
                @confirm="deleteTemplate"
              >
                <i slot="reference" title="删除" class="el-icon-delete" />
              </el-popconfirm>

              <div
                v-if="!settingForm.moduleType || settingForm.moduleType === '0'"
                class="pic"
              >
                <!-- isAdmin && typeData.length > 1 -->
                <i v-if="!settingForm.isDisplayModeHide" class="iconfont icondangan" />
                <div class="t_list">
                  <ul>
                    <li
                      v-for="(item, index) in typeData"
                      :key="index"
                      :class="{
                        'active theme-bg-color':
                          item.type == settingForm.displayMode ||
                          chooseHover == index
                      }"
                      @mousemove="chooseHover = index"
                      @mouseout="chooseHover = null"
                      @click="chooseType(item.type)"
                    >
                      {{ item.title }}
                    </li>
                  </ul>
                </div>
              </div>
              <span
                v-if="settingForm.isAddMoreIcon === '1'"
                class="more"
                @click="moduleMore"
              >
                更多
              </span>
            </div>
          </div>
        </div>

        <div
          v-loading="statisticsAll.isLoading && settingForm.moduleType === '0'"
          :class="['statistics-content']"
          element-loading-text="数据加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.2)"
          @click="statisticsBoxClick"
        >
          <div v-show="boxOffon" class="boxShow" />
          <!-- 筛选模块 -->
          <where
            ref="where"
            :condition-area-config="statisticsAll.conditionAreaConfig"
            :where-height.sync="whereHeight"
            :setting-form="settingForm"
            @whereOtherBtnClick="whereOtherBtnClick"
            @whereFormKeep="whereFormKeep"
            @whereSubmit="whereSubmit"
          />
          <!-- {{ settingForm }} -->
          <!-- slot嵌入 -->
          <div
            v-if="
              settingForm.blankTemplateConfig &&
                settingForm.blankTemplateConfig.slot
            "
            :id="settingForm.blankTemplateConfig.slot"
            :style="{ width: '100%', height: boxHeight() + 'px' }"
          >
            <slot :name="settingForm.blankTemplateConfig.slot" />
          </div>
          <!-- 列表展示 -->
          <list
            v-if="settingForm.displayMode == 'list' && isCharts()"
            :height="boxHeight()"
            :data="statisticsAll.data"
            :colums="nowClums()"
            :statistics-all="statisticsAll"
            :pagination-all="statisticsAll.paginationAll"
            :setting-form="settingForm"
            @rowClick="rowClick"
            @cellClick="cellClick"
            @operateButtonClick="operateButtonClick"
            @tablePageSort="tablePageSort"
          />
          <!-- 数据表格展示 -->
          <bw-table
            v-if="settingForm.displayMode == 'table' && isCharts()&&isTable"
            ref="bwTable"
            :tabledata="statisticsAll.data"
            :colums="nowClums()"
            :height="boxHeight()"
            :setting-form="settingForm"
            :width="modelStyle.width"
            :statistics-all="statisticsAll"
            :border="false"
            :pagination-all="statisticsAll.paginationAll"
            @operateButtonClick="operateButtonClick"
            @cellClick="cellClick"
            @rowClick="rowClick"
            @tablePageSort="tablePageSort"
          />
          <!-- 折线图、条形图、柱状图、饼图、环图 -->
          <bw-line
            v-if="
              bwLineType.indexOf(settingForm.displayMode) > -1 && isCharts()
            "
            :data="statisticsAll.data"
            :chart-column="settingForm.keyArr"
            :title-show="settingForm.titleShow === '1' ? true : false"
            :setting-config="settingConfig"
            :chart-type="settingForm.displayMode"
            :setting-form="settingForm"
            :height="boxHeight()"
            @setOptions="setOptions"
            @eventClick="eventClick"
            @pieTabsClick="pieTabsClick"
          />
          <!-- 详情列表模块组件 -->
          <details-table
            v-if="settingForm.displayMode === 'destailTable'"
            :label-width="settingForm.destailsTableLabelWidth"
            :setting-form="settingForm"
            :table-data="detailsTableData()"
            :height="boxHeight()"
            @cellClick="destailTableCellClick"
          />
          <!-- iframe嵌入组件 -->
          <iframe-model
            v-if="settingForm.moduleType === '1'"
            ref="iframeModel"
            :height="boxHeight()"
            :statistics-all="statisticsAll"
            :setting-form="settingForm"
            :iframe-position-all="statisticsAll.iframePositionAll"
            :iframe-all="settingForm.iframeAll"
            :container-elelemt="containerElelemt"
            :setting-config="settingConfig"
            @componentFunc="componentFunc"
          />
        </div>

        <!-- 模块修改表单 -->
        <settingForm
          ref="settingForm"
          :form="settingForm"
          :data-url="settingConfig.dataUrl"
          :statistics-all="statisticsAll"
          :where-form="whereForm"
          :setting-config="settingConfig"
          @componentFunc="componentFunc"
        />
        <!-- 子模块新增表单 -->
        <settingForm
          ref="childSettingForm"
          :form="childSettingForm"
          :data-url="settingConfig.dataUrl"
          :setting-config="settingConfig"
          @submit="childSettingKeep"
        />
        <!-- 详情配置弹窗 -->
        <destail-setting ref="destailSetting" @submit="destailSettingSubmit" />
        <!-- 详情弹窗 -->
        <destail ref="destail" :statistics-all="statisticsAll" />
      </div>
    </article>
  </div>
</template>
<script>
// import WhereSetting from '../../components/WhereSetting'
import Where from '../../components/Where2.0'
import List from '../../components/List'
import BwLine from '../../components/Line@2.0/index.vue'
import BwTable from '../../components/Table2/index.vue'
import SettingForm from '../../components/SettingForm'
import otherMixins from './mixins/otherMixins'
import { childMixins, screenMixins, destailMixins } from './statisticsMixins'
import dataPresentation from '../../components/SettingForm/dataPresentation.json'
import DestailSetting from '../../components/DestailSetting'
import Destail from '../../components/Destail'
import DetailsTable from '../../components/DetailsTable/index.vue'
import IframeModel from '../../components/IframeModel/index.vue'
import Stretch from '../../components/Stretch'
export default {
  components: {
    SettingForm,
    List,
    BwLine,
    BwTable,
    Stretch,
    Where,
    DestailSetting,
    Destail,
    DetailsTable,
    IframeModel
  },
  mixins: [childMixins, screenMixins, destailMixins, otherMixins],
  props: {
    statisticsAll: {
      type: Object,
      default: null
    },
    browserXY: {
      type: Object,
      default: null
    },
    addSettingForm: {
      type: Object,
      default: null
    },
    settingConfig: {
      type: Object,
      default: null
    },
    containerElelemt: { type: HTMLElement, default: null }
  },
  data() {
    return {
      statisticsShow: true,
      bwLineType: ['pie', 'ring', 'histogram', 'bar', 'line', 'radar'],
      typeData: dataPresentation,
      chooseHover: null,
      cursor: 'defalut',
      isTable: true,
      whereHeight: 40 // 搜索模块高度
      // parentWhereFormUse:{}//父级筛选条件可传入子级条件筛选
      // deleteTitle: '确定删除删除当前模块？'
    }
  },

  methods: {
    // 容器组件内事件传递
    componentFunc(obj) {
      if (this[obj.method]) {
        this[obj.method](obj.param)
      } else {
        this.$emit('componentFunc', obj)
      }
      // else {
      //   this.$emit('componentFunc', obj)
      // }
    },
    // 饼图顶部切换栏点击事件
    pieTabsClick(item) {
      this.$emit('componentFunc', {
        method: 'pieTabsClick',
        name: '饼图顶部切换栏点击事件',
        param: {
          moduleId: this.statisticsAll.moduleId,
          statisticsAll: this.statisticsAll,
          nowItem: item
        }
      })
      // this.$emit('chartsMethods', {
      //   moduleId: this.statisticsAll.moduleId,
      //   statisticsAll: this.statisticsAll,
      //   nowItem: item,
      //   name: '饼图顶部切换栏点击事件',
      //   methodsName: 'pieTabsClick'
      // })
    },
    // 模块数据变化事件
    statisticsAllChange(moduleId, viewchange, wh) {
      if (this.statisticsAll.moduleId === moduleId) {
        viewchange(this.statisticsAll)
        this.settingForm = this.statisticsAll.contentAreaConfig
        this.whereHeight = wh
      }
    },
    // 交互按钮点击事件
    Interactive() {
      // console.log(this.statisticsAll)
      this.$emit('componentFunc', {
        method: 'interactive',
        name: '交互按钮点击事件',
        param: {
          statisticsAll: this.statisticsAll
        }
      })
    },
    // 详情列表模块数据
    detailsTableData() {
      let data = this.statisticsAll.data
      if (!data) return
      const contentAreaConfig = this.statisticsAll.contentAreaConfig
      if (contentAreaConfig.apiType === '1') {
        if (data.constructor === Array) {
          data = data[0]
        }
      } else if (contentAreaConfig.apiType === '0') {
        data = data[0]
      }
      return data
    },
    // 模块是否可关闭
    isModuleClose() {
      return this.statisticsAll.parentModuleId || this.settingForm.isModuleClose
    },
    // 当前模块是否为图表组件判断
    isCharts() {
      const offon = !!(
        !this.settingForm.moduleType || this.settingForm.moduleType === '0'
      )
      return offon
    },

    // 更多按钮点击事件
    moduleMore() {
      if (this.settingForm.moreUrl.replace(/\s*/g, '') !== '') {
        window.open(this.settingForm.moreUrl, '_blank')
      }
      this.$emit('componentFunc', {
        method: 'statisticsMore',
        name: '更多按钮点击事件',
        param: {
          statisticsAll: this.statisticsAll
        }
      })
    },
    // 模板克隆事件
    copyTemplate() {
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
        this.$emit('componentFunc', {
          method: 'addKeep',
          name: '一级克隆',
          param: {
            contentAreaConfig: contentAreaConfigCopy
          }
        })
      } else {
        this.childAddType = '0'
        this.childSettingKeep(contentAreaConfigCopy)
      }
    },
    // 配置字段筛选
    nowClums() {
      const data = []
      this.settingForm.keyArr.forEach(item => {
        if (item.isShow === true) {
          data.push(item)
        }
      })

      return data
    },
    // 弹窗关闭事件
    statisticsClose() {
      this.statisticsAll.isShow = false
      this.$emit('componentFunc', {
        method: 'blankTemplateClose',
        name: '弹窗关闭事件',
        param: {
          moduleId: this.statisticsAll.moduleId
        }
      })
      // this.$emit('blankTemplateClose', this.statisticsAll.moduleId)
    },
    // 模块删除按钮点击事件
    deleteTemplate() {
      this.$emit('componentFunc', {
        method: 'deleteMoule',
        name: '模块删除按钮点击事件',
        param: {
          menuId: this.statisticsAll.menuId,
          parentModuleId: this.statisticsAll.parentModuleId,
          moduleId: this.statisticsAll.moduleId
        }
      })
    },
    // 配置表单确认事件
    addKeep(param) {
      this.isTable = false
      this.$nextTick(() => {
        this.isTable = true
      })
      this.setDemos()
      this.$emit('componentFunc', {
        method: 'updateMoule',
        name: '模块修改确认事件',
        param: {
          moduleId: this.statisticsAll.moduleId,
          projectId: this.settingConfig.answerId,
          contentAreaConfig: param.contentAreaConfig,
          fn: () => {
            this.$refs['settingForm'].close()
          },
          whereForm: this.whereForm
        }
      })
      // 筛选数据旧版本兼容
      this.compatible1(this.statisticsAll, param.contentAreaConfig)
    },
    // 模块设置表单保存事件
    // settingKeep(contentAreaConfig) {

    // },
    // 配置数据修改后更新-兼容旧版
    compatible1(item, contentAreaConfig) {
      const filterConfig = item.contentAreaConfig.filterConfig
      const conditionAreaConfig = item.conditionAreaConfig
      const arr = []
      if (conditionAreaConfig.screenData.length > 0 && filterConfig) {
        conditionAreaConfig.screenData.forEach(items => {
          let offon = true
          filterConfig.screenData.forEach(item => {
            if (item.key === items.key) {
              offon = false
            }
          })
          if (offon) {
            arr.push(items)
          }
        })

        conditionAreaConfig.screenData = arr.concat(
          contentAreaConfig.filterConfig.screenData
        )
        conditionAreaConfig.btnSettingData = filterConfig.btnSettingData
        conditionAreaConfig.isShowInsertButton = filterConfig.isShowInsertButton
        // console.log(conditionAreaConfig.screenData[1])
      }
    },
    // 设置按钮点击事件
    settingClick() {
      this.$emit('componentFunc', {
        method: 'settingClick',
        name: '设置按钮点击事件',
        param: {
          statisticsAll: this.statisticsAll.moduleId,
          fn: (keyArr) => {
            this.$refs['settingForm'].show({
              keyArr
            })
          }
        }
      })
      // this.$emit('settingClick', this.statisticsAll, keyArr => {

      // })
    },
    // 展示方式选择点击事件
    chooseType(chartType) {
      this.settingForm.displayMode = chartType
      if (this.isAdmin) {
        this.$emit('componentFunc', {
          method: 'updateMoule',
          name: '模块删除按钮点击事件',
          param: {
            moduleId: this.statisticsAll.moduleId,
            contentAreaConfig: this.settingForm,
            whereForm: this.whereForm
          }
        })
      }
    },
    // 分页事件
    tablePageSort(pageAll) {
      this.$emit('componentFunc', {
        method: 'tablePageSort',
        name: '分页事件',
        param: {
          moduleId: this.statisticsAll.moduleId,
          paginationAll: pageAll,
          whereForm: this.whereForm
        }
      })
    },
    // 图表点击事件
    eventClick(e) {
      this.statisticsAll.data.forEach((items, index) => {
        let offon = false
        if (this.settingForm.displayMode === 'bar') {
          offon = this.statisticsAll.data.length - 1 - e.dataIndex === index
        } else {
          offon = e.dataIndex === index
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
    // 图表配置数据暴露，外层定制化
    setOptions(options, chartType, data) {
      this.$emit('componentFunc', {
        method: 'setOptions',
        name: '图表配置数据暴露，外层定制化',
        param: {
          options,
          chartType,
          data,
          moduleId: this.statisticsAll.moduleId
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
   .boxShow{
     width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1111;
        filter: alpha(opacity=0);
        opacity: 0;
        background: red;
        // margin-top: 30px;
   }
</style>
