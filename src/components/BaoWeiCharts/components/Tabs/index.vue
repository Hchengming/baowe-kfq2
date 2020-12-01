<template>
  <div>
  
    <article
      v-show="statisticsAll.isShow !== false"
      :ref="'statisticsWrap'"
      :id="settingForm.elementId ? settingForm.elementId : undefined"
      :style="{
        height: modelStyle.height + 'px',
        width: modelStyle.width + 'px',
        left: modelStyle.left + 'px',
        top: modelStyle.top + 'px',
        cursor: cursor,
        'z-index': settingForm.zindex,
      }"
    >
    <div class=""></div>
    </article>
  </div>
</template>
<script>
export default {
  data() {
    return {
        settingForm:{},
        modelStyle:{},
         cursor: 'defalut'
    };
  },
  mixins: [],
};
</script>