<template>
  <div>
    <div class="statisticsMask"
         :style="{ 'z-index': settingForm.zindex }"
         @click="statisticsClose"
         v-if="settingForm.mask && settingForm.mask == '1'"></div>
    <article ref="statisticsWrap"
             :style="{
        height: modelStyle.height - 16 + 'px',
        width: modelStyle.width - 40 + 'px',
        left: modelStyle.left + 'px',
        top: modelStyle.top + 'px',
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
                 v-if="this.statisticsAll.parentModuleId"
                 @click="TJAdd"></i>
              <!-- 设置按钮 -->
              <el-popconfirm icon="el-icon-info"
                             @onConfirm="deleteTemplate"
                             iconColor="red"
                             title="确定删除删除当前模块？"
                             v-if="isAdmin">
                <i title="删除"
                   slot="reference"
                   class="el-icon-delete"></i>
              </el-popconfirm>
              <i title="筛选配置"
                 v-if="isAdmin"
                 @click="screenSetting"
                 class="iconicon-system-fn-configure iconfont"></i>
              <i @mousedown="mousedown_tz"
                 v-if="isAdmin"
                 title="拖拽"
                 class="icontuozhuai iconfont"></i>
              <i @click="settingClick"
                 v-if="isAdmin"
                 title="设置"
                 class="el-icon-setting"></i>
              <i title="筛选"
                 v-if="
                  statisticsAll.conditionAreaConfig &&
                    statisticsAll.conditionAreaConfig.length > 0
                "
                 @click="filterShow"
                 class="iconshaixuan iconfont theme-color"></i>
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
        <!-- 筛选模块 -->
        <where ref="where"
               @whereSubmit="whereSubmit"></where>
        <div class="statistics-content"
             @click="statisticsContentClick"
             v-loading="!statisticsAll.data"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.2)">
          <!-- 列表展示 -->
          <list v-if="settingForm.displayMode == 'list'"
                :height="modelStyle.height - 46"
                :data="statisticsAll.data"
                :colums="nowClums()"
                :paginationAll="statisticsAll.paginationAll"
                @rowClick="rowClick"
                @cellClick="cellClick"
                @tablePageSort="tablePageSort"></list>
          <!-- 数据表格展示 -->
          <bw-table v-if="settingForm.displayMode == 'table'"
                    :tabledata="statisticsAll.data"
                    :colums="nowClums()"
                    :height="modelStyle.height - 46"
                    :width="modelStyle.width - 40"
                    :paginationAll="statisticsAll.paginationAll"
                    @cellClick="cellClick"
                    @rowClick="rowClick"
                    @tablePageSort="tablePageSort"></bw-table>
          <!-- 折线图、条形图、柱状图、饼图、环图 -->
          <bw-line v-if="bwLineType.indexOf(settingForm.displayMode) > -1"
                   :data="statisticsAll.data"
                   :chartColumns="nowClums()"
                   :chartType="settingForm.displayMode"
                   :height="modelStyle.height - 46"
                   @eventClick="eventClick"></bw-line>
          <!-- <slot name="otherBox"></slot> -->
          <div class="suofang"
               v-if="isAdmin">
            <i @mousedown="mousedown_ls"
               class="iconfont iconkuozhan theme-color"></i>
          </div>
        </div>

        <!-- 模块修改表单 -->
        <settingForm ref="settingForm"
                     :form="settingForm"
                     :dataUrl="dataUrl"
                     @submit="settingKeep"></settingForm>
        <!-- 子模块新增表单 -->
        <settingForm ref="childSettingForm"
                     :form="childSettingForm"
                     :dataUrl="dataUrl"
                     @submit="childSettingKeep"></settingForm>
        <!-- 筛选配置弹出层 -->
        <screen ref="screenSetting"
                @screenKeep="screenKeep"></screen>
      </div>
    </article>
  </div>
</template>
<script>
import Screen from '../../components/screen'
import Where from '../../components/where'
import List from '../../components/list'
import BwLine from '../../components/line'
import BwTable from '../../components/table2'
import SettingForm from '../../components/settingForm'
import { dataMixins, childMixins, screenMixins } from './mixins'
import dataPresentation from '../../components/settingForm/dataPresentation.json'

export default {
  props: ['statisticsAll', 'browserXY', 'systemPermissions', 'dataUrl'],
  mixins: [dataMixins, childMixins, screenMixins],
  components: { SettingForm, List, BwLine, BwTable, Screen, Where },
  data () {
    return {
      statisticsShow: true,
      bwLineType: ['pie', 'ring', 'histogram', 'bar', 'line'],
      typeData: dataPresentation,
      chooseHover: null
    }
  },
  computed: {
    isAdmin () {
      return this.systemPermissions === 'admin'
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
    this.settingForm = JSON.parse(
      JSON.stringify(this.statisticsAll.contentAreaConfig)
    )
    this.setDemos()
  },
  methods: {
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
    // 获取当前页面配置数据
    // paginationAll() {
    //   let paginationAll;
    //   if (this.settingForm.isPage) {
    //     paginationAll = {
    //       total: 30, //总数据量
    //       currentPage: 1, //当前显示页数
    //       pageSize: 10 //每页数据条数
    //     };
    //   }
    // },
    // 弹窗关闭事件
    statisticsClose () {
      this.$emit('statisticsClose', this.statisticsAll.moduleId)
    },

    // 模块删除按钮点击事件
    deleteTemplate () {
      this.$emit('deleteMoule', this.statisticsAll.moduleId)
    },
    // 模块设置表单保存事件
    settingKeep (contentAreaConfig) {
      this.$emit(
        'updateMoule',
        contentAreaConfig,
        this.statisticsAll.moduleId,
        () => {
          this.$refs['settingForm'].close()
        }
      )
    },
    // 设置按钮点击事件
    settingClick () {
      this.$refs['settingForm'].show()
    },
    // 展示方式选择点击事件
    chooseType (chartType) {
      this.settingForm.displayMode = chartType
      this.$emit('updateMoule', this.settingForm, this.statisticsAll.moduleId)
    },
    // 分页事件
    tablePageSort (pageAll) {
      this.$emit('tablePageSort', this.statisticsAll.moduleId, pageAll)
    },
    // 图表点击事件
    eventClick (e) {
      this.statisticsAll.data.forEach((items, index) => {
        if (e.dataIndex === index) {
          this.rowClick(items)
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
