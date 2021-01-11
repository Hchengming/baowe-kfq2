<template>
  <!-- <div> -->
  <el-dialog
    v-drag
    :append-to-body="true"
    :visible.sync="isShow"
    class="dialog-common tabs-setting-form-dialog"
  >
    <div slot="title" class="headerTitle">时间配置信息</div>
    <el-form ref="timeConfig" :model="timeConfig" label-width="130px">
      <el-row type="flex" class="row-bg">
        <el-col :span="12">
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="timeConfig.title"
              size="small"
              style="width: 200px"
              placeholder="时间轴标题"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标签名" prop="label">
            <el-input
              v-model="timeConfig.label"
              size="small"
              style="width: 200px"
              placeholder="时间轴左侧标签名"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="视图层级" prop="zindex">
            <el-input
              v-model="timeConfig.zindex"
              size="small"
              style="width: 120px"
              placeholder="若模块重叠,低层级模块会被高层级覆盖"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="默认时间" prop="defaultTime">
            <el-input
              v-model="timeConfig.defaultTime"
              size="small"
              style="width: 120px"
              placeholder="若不填写则默认则初始选中为今年"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <el-form-item label="位置X轴(页面占比)" prop="left">
            <el-input-number
              v-model="timeConfig.left"
              :min="0"
              :max="100"
              :precision="2"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="位置Y轴(页面占比)" prop="top">
            <el-input-number
              v-model="timeConfig.top"
              :min="0"
              :max="100"
              :precision="2"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="宽度(页面占比)" prop="width">
            <el-input-number
              v-model="timeConfig.width"
              :min="0"
              :max="100"
              :precision="2"
              size="small"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="数据获取" prop="dataAcquisitionMethod">
            <el-radio-group v-model="timeConfig.dataAcquisitionMethod">
              <el-radio label="0">自定义</el-radio>
              <el-radio label="1">接口获取</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row
        v-if="timeConfig.dataAcquisitionMethod === '0'"
        type="flex"
        class="row-bg"
      >
        <el-col :span="8">
          <el-form-item label="开始年度" prop="start">
            <el-date-picker
              v-model="timeConfig.start"
              :style="{ width: '130px' }"
              value-format="yyyy"
              type="year"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结束年度" prop="end">
            <el-date-picker
              v-model="timeConfig.end"
              :style="{ width: '130px' }"
              value-format="yyyy"
              type="year"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="缺失年度" prop="missingTimeStr">
            <el-input
              v-model="timeConfig.missingTimeStr"
              :title="timeConfig.missingTimeStr"
              style="margin-top:4px"
              size="small"
              disabled
              placeholder="事件段缺失年度选择"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click.native="missingTimeBtnClick"
              />
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="timeConfig.dataAcquisitionMethod === '1'">
        <el-col :span="8">
          <el-form-item label="接口类型" prop="apiType">
            <el-radio-group
              v-model="timeConfig.apiType"
              @change="apiTypeChange"
            >
              <el-radio label="0">数据视图</el-radio>
              <el-radio label="1">服务接口</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 数据接口处理部分 -->
      <api-choose
        v-if="timeConfig.dataAcquisitionMethod === '1'"
        ref="apiChoose"
        :item-api-data.sync="itemApiData"
        :data-view-list.sync="dataViewList"
        :setting-config="settingConfig"
        :form="timeConfig"
      />
      <!-- 接口参数 -->
      <param-key-config
        v-if="timeConfig.dataAcquisitionMethod === '1'"
        ref="paramKeyConfig"
        :item-api-data="itemApiData"
        :form="timeConfig"
        :setting-config="settingConfig"
      />
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="onSubmit">确 定</el-button>
    </span>
    <!-- 缺失时间配置事件 -->
    <missing-time ref="missingTime" :form="timeConfig" />
  </el-dialog>

  <!-- </div> -->
</template>
<script>
import ListsSettingMixins from './TimeAxisSettingMixins'
import ApiChoose from '../ApiChoose/index.vue'
import ParamKeyConfig from '../SettingForm/ChartsDataSettting/ParamKeyConfig@2.0'
import MissingTime from './MissingTime'
export default {
  components: { ApiChoose, ParamKeyConfig, MissingTime },
  mixins: [ListsSettingMixins],
  props: {
    timeConfig: {
      type: Object,
      default: null
    },
    settingConfig: {
      type: Object,
      default: null
    }
  }
}
</script>
