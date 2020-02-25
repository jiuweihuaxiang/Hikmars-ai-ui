<template>
  <div class="hik-recvisual-target">

  </div>
</template>
<script>
export default {
  name: 'recognition-visualize-target',
  props: [
    'textDataList',
    'thumbnailPanelStyle',
    'activeColor',
    'noActiveColor',
    'frameStyle',
    'textPanelStyle',
    'sourceUrl',
    'thumbnailUrlList',
    'framesDataList'
  ],
  // props: {
  //   thumbnailStyle: {
  //     type: Object,
  //     default: function () {
  //       return {
  //         // 待定
  //         border: '1px solid white'
  //       }
  //     }
  //   },
  //   activeColor: {
  //     type: String,
  //     default: 'red'
  //   },
  //   noActiveColor: {
  //     type: String,
  //     default: 'white'
  //   },
  //   frameStyle: {
  //     type: Object,
  //     default: function () {
  //       return {
  //         border: '1px solid red',
  //         borderRadius: 'none'
  //       }
  //     }
  //   },
  //   textPanelStyle: {
  //     type: Object,
  //     default: function () {
  //       return {
  //         color: 'white',
  //         fontSize: '16px'
  //       }
  //     }
  //   },
  //   sourceUrl: {
  //     type: String,
  //     required: true
  //   },
  //   thumbnailUrlList: {
  //     type: Array,
  //     required: true
  //   },
  //   framesDataList: {
  //     type: Array,
  //     required: true
  //   }
  // },
  methods: {
    // 点击激活缩略图
    activateThumbnail () {
      const oldIndex = null
      const newIndex = null
      this.$emit('on-active', oldIndex, newIndex)
    }
  }
}
</script>
