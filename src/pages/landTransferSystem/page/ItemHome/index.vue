<template>
  <!-- 项目首页 -->
  <div class="item-home">
    <div :style="searchStyle" class="search-query">
      <div class="year-choose">
        <div class="search-label">年度:</div>
        <el-date-picker
          v-model="year"
          :style="{ width: '120px' }"
          type="year"
          size="small"
          @change="yearChange"
        />
      </div>
      <div class="color-ico">
        <div class="txt1">
          <span>{{ rightTxt ? rightTxt + ':' : '' }}</span>
        </div>

        <div
          v-for="(item, index) in textArr"
          :key="index"
          class="color-ico-item"
        >
          <div
            :style="{ background: item.color }"
            class="color-ico-circle"
          />
          <div class="color-ico-text">{{ item.txt }}</div>
        </div>
        <!-- <div class="color-ico-item">
          <div class="color-ico-circle bg-2"></div>
          <div class="color-ico-text"></div>
        </div>
        <div class="color-ico-item">
          <div class="color-ico-circle bg-3"></div>
          <div class="color-ico-text"></div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { commonMixins, gqqkMixins } from './itemHomeMixins'
export default {
  mixins: [commonMixins, gqqkMixins],
  props: {
    settingConfig: {
      type: Object,
      default: null
    }
  }
}
</script>

