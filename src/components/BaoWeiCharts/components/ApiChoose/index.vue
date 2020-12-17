<template>
  <div>
    <el-row type="flex" class="row-bg">
      <el-col :span="6">
        <el-form-item label="请求方式">
          <el-select v-model="form.options" size="small" placeholder="接口名称">
            <el-option label="POST" value="POST" />
            <el-option label="GET" value="GET" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item v-if="form.apiType==='0'" label="视图名称" label-width="65px">
          <el-select v-model="form.viewId" size="small" filterable placeholder="视图名称" @change="viewIdChange">
            <el-option
              v-for="option in dataViewList"
              :key="option.id"
              :label="option.viewCode"
              :value="option.id"
            />
          </el-select>
        </el-form-item>
        <!-- {{form.viewId}} -->
        <el-form-item v-if="form.apiType!=='0'" label="服务名称" label-width="65px">
          <el-select
            v-model="form.urlName"
            size="small"
            filterable
            placeholder="服务名称"
            @change="urlNameChange"
          >
            <el-option
              v-for="option in itemApiData"
              :key="option.aaaRequestUrl"
              :label="option.apeName"
              :value="option.apeName"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="接口路径:" label-width="65px">
          <el-input v-model="form.url" size="small" placeholder="接口路径" />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import JSMixins from './mixins.js'
export default {
  mixins: [JSMixins],
  props: {
    dataViewList: {
      type: Array,
      default: null
    },
    itemApiData:{
      type: Array,
      default: null
    },
    form: {
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
