<template>
  <div>
    <el-row type="flex"
            class="row-bg">
      <el-col :span="6">
        <el-form-item label="请求方式">
          <el-select v-model="form.options"
                     size="small"
                     
                     placeholder="接口名称">
            <el-option label="POST"
                       value="POST"></el-option>
            <el-option label="GET"
                       value="GET"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="接口名称:"
                      label-width="65px">
          <el-select v-model="form.urlName"
                     size="small"
                     filterable
                     @change="urlNameChange"
                     placeholder="接口名称">
            <el-option v-for="option in  itemApiData"
                       :key="option.aaaRequestUrl"
                       :label="option.apeName"
                       :value="option.apeName"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="接口路径:"
                      label-width="65px">
          <!-- <el-select v-model="form.url"
                     size="small"
                     filterable
                     @change="urlChange"
                     placeholder="接口路径">
            <el-option v-for="option in  itemApiData"
                       :key="option.aaaRequestUrl"
                       :label="option.aaaRequestUrl"
                       :value="option.aaaRequestUrl"></el-option>
          </el-select> -->
           <el-input v-model="form.url"
                    size="small"
                    @change="urlChange"
                    placeholder="接口路径"></el-input>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="3" v-if="!form.submodule">
        <el-button size="small"
                   style="margin-top:2px"
                   @click="getKeysData">字段获取</el-button>
      </el-col> -->
    </el-row>
  </div>

</template>
<script>
import JSMixins from './mixins.js'
export default {
  mixins: [JSMixins],
  props: {
    itemApiData: {
      type: Array
    },
    form: {
      type: Object
    }
  }
}
</script>
