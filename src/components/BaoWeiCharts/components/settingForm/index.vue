<template>
  <div>
    <el-dialog
      :id="settingFormId()"
      v-drag
      :append-to-body="true"
      :rules="rules"
      :modal="settingConfig.isBigData ? false : true"
      :visible.sync="dialogVisible"
      class="settingForm dialog-common"
    >
      <div slot="title" class="headerTitle">模块配置信息</div>
      <div class="setting-form-box">
        <el-form ref="settingForm" :model="form" label-width="140px">
          <el-row type="flex" class="row-bg">
            <el-col :span="8">
              <el-form-item label="模块标题" prop="title">
                <el-input v-model="form.title" size="small" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="副标题1" prop="subtitle1">
                <el-input
                  v-model="form.subtitle1"
                  :disabled="
                    !statisticsAll || statisticsAll.parentModuleId
                      ? true
                      : false
                  "
                  size="small"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="副标题2" prop="subtitle2">
                <el-input v-model="form.subtitle2" size="small" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col :span="8">
              <el-form-item label="显示/隐藏" prop="isShow">
                <el-radio-group v-model="form.isShow">
                  <el-radio label="1">显示</el-radio>
                  <el-radio label="0">隐藏</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="模块ID" prop="moreUrl">
                <el-input
                  v-model="form.elementId"
                  size="small"
                  placeholder="当前模块元素外层id"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否添加更多按钮" prop="isAddMoreIcon">
                <el-radio-group v-model="form.isAddMoreIcon">
                  <el-radio label="1">有</el-radio>
                  <el-radio label="0">没有</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-if="form.isAddMoreIcon === '1'" :span="8">
              <el-form-item label="按钮跳转路径" prop="moreUrl">
                <el-input
                  v-model="form.moreUrl"
                  size="small"
                  placeholder="按钮跳转路径为空则不跳转页面，自行进行二次开发"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="标题栏是否隐藏" prop="isHeaderHide">
                <el-switch v-model="form.isHeaderHide" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="模块是否可关闭" prop="isModuleClose">
                <el-switch v-model="form.isModuleClose" />
              </el-form-item>
            </el-col>
            <el-col v-if="form.blankTemplateConfig" :span="8">
              <el-form-item label="slot嵌入字段" prop="title">
                <el-input
                  v-model="form.blankTemplateConfig.slot"
                  placeholder="slot嵌入字段"
                  size="small"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="模块内容" prop="moduleType">
                <el-radio-group
                  v-model="form.moduleType"
                  @change="moduleTypeChange"
                >
                  <el-radio label="0">图表</el-radio>
                  <el-radio label="1">iframe嵌入</el-radio>
                  <el-radio label="3">空白模板</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 图表配置 -->
          <div
            v-if="!form.moduleType || form.moduleType === '0'"
            class="content-dy-box"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="图表展现方式" prop="displayMode">
                  <el-select
                    v-model="form.displayMode"
                    size="small"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col
                v-if="['histogram', 'bar'].indexOf(form.displayMode) > -1"
                :span="8"
              >
                <el-form-item label="图形显示" prop="titleShow">
                  <el-radio-group v-model="form.barHisShowType">
                    <el-radio label="0">默认</el-radio>
                    <el-radio label="1">堆叠图</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col v-if="form.displayMode === 'destailTable'" :span="8">
                <el-form-item label="详情表格主题" prop="destailTypeTheme">
                  <el-radio-group v-model="form.destailTypeTheme">
                    <el-radio label="0">默认</el-radio>
                    <el-radio label="1">主题一</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col v-if="form.displayMode === 'destailTable'" :span="8">
                <el-form-item
                  label="左侧标题宽度"
                  prop="destailsTableLabelWidth"
                >
                  <el-input-number
                    v-model="form.destailsTableLabelWidth"
                    :min="1"
                    :max="300"
                    controls-position="right"
                    size="small"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              v-if="
                ['histogram', 'bar', 'line', 'radar'].indexOf(
                  form.displayMode
                ) > -1
              "
            >
              <el-col :span="8">
                <el-form-item label="图列是否显示" prop="titleShow">
                  <el-radio-group v-model="form.titleShow">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="图例显示位置" prop="legendLocation">
                  <el-select
                    v-model="form.legendLocation"
                    size="small"
                    placeholder="请选择"
                  >
                    <el-option label="左侧" value="left" />
                    <el-option label="居中" value="center" />
                    <el-option label="右侧" value="right" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="图例布局" prop="legendOrient">
                  <el-select
                    v-model="form.legendOrient"
                    size="small"
                    placeholder="请选择"
                  >
                    <el-option label="水平" value="horizontal" />
                    <el-option label="垂直" value="vertical" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              v-if="
                ['histogram', 'bar', 'line', 'radar', 'ring', 'pie'].indexOf(
                  form.displayMode
                ) > -1
              "
            >
              <el-col :span="12">
                <el-form-item label="图表上边距" prop="barGroup">
                  <el-input-number
                    v-model="form.gridTop"
                    :min="0"
                    :max="1000"
                    :precision="0"
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="图表下边距" prop="barGroup">
                  <el-input-number
                    v-model="form.gridBottom"
                    :min="0"
                    :max="1000"
                    :precision="0"
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="图表左边距" prop="barGroup">
                  <el-input-number
                    v-model="form.gridLeft"
                    :min="0"
                    :max="1000"
                    :precision="0"
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="图表右边距" prop="barGroup">
                  <el-input-number
                    v-model="form.gridRight"
                    :min="0"
                    :max="1000"
                    :precision="0"
                    size="small"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="['histogram', 'bar'].indexOf(form.displayMode) > -1">
              <el-col :span="8">
                <el-form-item label="柱体间距(%)" prop="barGroup">
                  <el-slider v-model="form.barGroup" :max="100" :min="0" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="柱体最大宽度(px)" prop="barMaxWidth">
                  <el-slider v-model="form.barMaxWidth" :max="100" :min="0" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              v-if="['histogram', 'bar', 'line'].indexOf(form.displayMode) > -1"
            >
              <el-col :span="8">
                <el-form-item label="x轴标题" prop="xName">
                  <el-input
                    v-model="form.xName"
                    placeholder="图表x轴标题名称"
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="x轴标签倾斜角度" prop="xRotate">
                  <el-slider v-model="form.xRotate" :max="90" :min="0" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="y轴标题" prop="yName">
                  <el-input
                    v-model="form.yName"
                    placeholder="图表x轴标题名称"
                    size="small"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="展现方式切换图标隐藏"
                  prop="isDisplayModeHide"
                >
                  <el-switch v-model="form.isDisplayModeHide" />
                </el-form-item>
              </el-col>
              <el-col v-if="form.displayMode === 'table'" :span="8">
                <el-form-item label="表格是否添加合计行" prop="showSummary">
                  <el-switch v-model="form.showSummary" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="接口类型" prop="apiType">
                  <el-radio-group
                    v-model="form.apiType"
                    @change="apiTypeChange"
                  >
                    <el-radio label="0">数据视图</el-radio>
                    <el-radio
                      :disabled="settingConfig.isBigData"
                      label="1"
                    >服务接口</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col v-if="!settingConfig.isBigData" :span="8">
                <el-form-item label="数据是否添加分页" prop="isPage">
                  <el-radio-group v-model="form.isPage">
                    <el-radio label="1">是</el-radio>
                    <el-radio :disabled="isPageDisabled" label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col v-if="!settingConfig.isBigData" :span="8">
                <el-form-item
                  v-if="form.isPage == '1'"
                  label="每页显示数据(条)"
                  prop="pageSize"
                >
                  <el-input-number
                    v-model="form.pageSize"
                    :min="0"
                    :max="1000"
                    :precision="0"
                    size="small"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 数据接口处理部分 -->
            <api-choose
              v-if="!settingConfig.isBigData"
              ref="apiChoose"
              :setting-config="settingConfig"
              :item-api-data.sync="itemApiData"
              :data-view-list.sync="dataViewList"
              :form="form"
            />
            <el-row>
              <el-col v-if="form.apiType==='0'" :span="12">
                <el-form-item label="视图参数传递方式" prop="viewParamType">
                  <el-radio-group
                    v-model="form.viewParamType"
                  >
                    <el-radio label="0">queryParamList</el-radio>
                    <el-radio label="1">where语句</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <charts-data-settting
              ref="chartsDataSettting"
              :setting-config="settingConfig"
              :item-api-data="itemApiData"
              :data-view-list="dataViewList"
              :statistics-all="statisticsAll"
              :form="form"
              :where-form="whereForm"
            />
            <!-- 接口参数、字段配置             -->

            <el-row v-if="form.menuTapAll" class="el-row-menu-tap">
              <el-col :span="8">
                <el-form-item label="是否绑定菜单页面跳转" label-width="140px">
                  <el-radio-group v-model="form.menuTapAll.isMenuTap">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col v-if="form.menuTapAll.isMenuTap === '1'" :span="8">
                <el-form-item label="触发跳转字段">
                  <el-select
                    v-model="form.menuTapAll.menuTapKey"
                    size="small"
                    placeholder="触发跳转字段"
                  >
                    <el-option
                      v-for="item in form.keyArr"
                      :key="item.key"
                      :label="item.key"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.menuTapAll.isMenuTap === '1'" :span="8">
                <el-form-item label="菜单编码字段">
                  <el-select
                    v-model="form.menuTapAll.menuCodeKey"
                    size="small"
                    placeholder="触发跳转字段"
                  >
                    <el-option
                      v-for="item in form.keyArr"
                      :key="item.key"
                      :label="item.key"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 表格类型选择 -->
            <el-row v-if="form.displayMode === 'table'">
              <el-col :span="8">
                <el-form-item label="表格类型" label-width="140px">
                  <el-radio-group v-model="form.tableOtherConfig.tableType">
                    <el-radio label="0">普通表格</el-radio>
                    <el-radio label="1">树形表格</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col v-if="form.tableOtherConfig.tableType === '1'" :span="8">
                <el-form-item label="唯一值字段">
                  <el-select
                    v-model="form.tableOtherConfig.onlyKey"
                    size="small"
                    placeholder="行数据唯一值字段"
                  >
                    <el-option
                      v-for="item in form.keyArr"
                      :key="item.key"
                      :label="item.key"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.tableOtherConfig.tableType === '1'" :span="8">
                <el-form-item label="子级字段名">
                  <el-input
                    v-model="form.tableOtherConfig.childKey"
                    size="small"
                    placeholder="树形表格子级字段名"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.displayMode === 'table'">
              <el-col :span="24">
                <el-form-item label="表格功能组件" label-width="140px">
                  <el-checkbox-group
                    v-model="form.tablefunctionalComponents"
                    size="small"
                  >
                    <el-checkbox label="colFilter">列筛选</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!-- iframe嵌入 -->
          <div
            v-if="form.moduleType === '1'"
            class="content-dy-box iframe-dy-box"
          >
            <el-row>
              <!-- <el-col :span="8">
                <el-form-item label="iframe类型" prop="iframeType">
                  <el-radio-group
                    v-model="form.iframeAll.iframeType"
                    @change="iframeTypeChange"
                  >
                    <el-radio label="0">地图</el-radio>
                    <el-radio label="1">其他</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col> -->
              <el-col :span="8">
                <el-form-item label="iframe框id" prop="iframeId">
                  <el-input
                    v-model="form.iframeAll.iframeId"
                    size="small"
                    placeholder="自定义iframe框id名"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="iframe路径" prop="iframeUrl">
                  <el-input
                    v-model="form.iframeAll.iframeUrl"
                    size="small"
                    placeholder="iframe嵌入站点路径"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- <el-row>

            </el-row> -->
            <!-- 地图iframe参数配置 -->
            <colums-setting
              v-if="form.iframeAll.mapPramConfig"
              :table-data="form.iframeAll.mapPramConfig"
              :table-cloums="mapPramCloums"
            />
            <!-- 其他iframe参数配置 -->
            <param-key-config
              v-if="form.iframeAll.iframeType === '1'"
              ref="paramKeyConfig"
              :item-api-data="itemApiData"
              :form="form"
              component-type="iframe"
              @useChange="iframeUseChange"
            />
          </div>
          <!-- 空白模板 -->
          <!-- <div
            v-if="form.moduleType === '3'"
            class="content-dy-box blank-template-box"
          >
            <el-row type="flex" class="row-bg">
              <el-col :span="12">
                <el-form-item label="slot" prop="title">
                  <el-input
                    v-model="form.blankTemplateConfig.slot"
                    placeholder="slot嵌入字段"
                    size="small"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div> -->

          <el-row type="flex" class="row-bg">
            <el-col :span="12">
              <el-form-item label="宽度(页面占比)" prop="width">
                <el-input-number
                  v-model="form.width"
                  :min="0"
                  :max="100"
                  :precision="2"
                  size="small"
                />
                <el-button size="small" @click="widthMax">一键100%</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="高度(页面占比)" prop="height">
                <el-input-number
                  v-model="form.height"
                  :min="0"
                  :max="100"
                  :precision="2"
                  size="small"
                />
                <el-button size="small" @click="heightMax">一键100%</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col :span="12">
              <el-form-item label="位置X轴(页面占比)" prop="left">
                <el-input-number
                  v-model="form.left"
                  :min="0"
                  :max="100"
                  :precision="2"
                  size="small"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="位置Y轴(页面占比)" prop="top">
                <el-input-number
                  v-model="form.top"
                  :min="0"
                  :max="100"
                  :precision="2"
                  size="small"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col :span="4">
              <el-form-item label="视图层级" prop="zindex">
                <el-input
                  v-model="form.zindex"
                  size="small"
                  placeholder="若模块重叠,低层级模块会被高层级覆盖"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="是否启用拖拽功能" prop="isDrafting">
                <el-switch v-model="form.isDrafting" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="mask" label="是否添加遮罩层">
                <el-radio-group v-model="form.mask">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <setting-json
          ref="settingJson"
          :scroll-top="scrollTop"
          :form="form"
          @setForm="setForm"
        />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button type="primary" size="small" @click="onSubmit">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <judge-pop
      ref="judgePop"
      @handleClose="handleClose"
      @confirm="judgePopConfirm"
    />
    <judge-pop ref="judgePop2" @handleClose="handleClose2" />
  </div>
</template>
<script>
import settingJson from './settingJson'
import JudgePop from '../JudgePop/index.vue'
import { dragDialog } from '../../utils/mixins.js'
import ColumsSetting from '../ColumsSetting'
import ApiChoose from '../ApiChoose/index.vue'
import ParamKeyConfig from './ParamKeyConfig/index'
import ChartsDataSettting from './ChartsDataSettting'
import mapMixins from './mixins/mapMixins'
import {
  ChartsMixins,
  iframeMixins,
  otherMixins
} from './mixins/settingFormMixins'
export default {
  components: {
    settingJson,
    JudgePop,
    ApiChoose,
    ParamKeyConfig,
    ChartsDataSettting,
    ColumsSetting
  },
  mixins: [dragDialog, otherMixins, ChartsMixins, iframeMixins, mapMixins],
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
    whereForm: {
      type: Object,
      default: null
    },
    settingConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  }
}
</script>
