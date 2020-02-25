<info>
  author: ZhaoHongChen
  createDate: 2020.02.17
  desc：目标识别组件vue文件
</info>

<template>
  <div class="hik-recvisual" :style="compContainerStyle">
    <template v-if="mode==='general'||mode===0">
      <recognition-visualize-general
        :width="width"
        :height="height"
        :textDataList="textDataList"
        :resultImgUrl="resultImgUrl"
        :alignment="alignment"
        :imgSizeRatio="imgSizeRatio"
        :resultHeaderStyle="resultHeaderStyle"
        :resultHeaderText="resultHeaderText"
        :resultContentStyle="resultContentStyle"
      >
        <slot></slot>
      </recognition-visualize-general>
    </template>
    <template v-if="mode==='face'||mode===1">
      <recognition-visualize-face-target
        :mode="mode"
        :textDataList="textDataList"
        :thumbnailPanelStyle="thumbnailPanelStyle"
        :activeColor="activeColor"
        :noActiveColor="noActiveColor"
        :frameStyle="frameStyle"
        :recImgStyle="recImgStyle"
        :featurePointColor="featurePointColor"
        :featurePointSize="featurePointSize"
        :maskColor="maskColor"
        :maskOpacity="maskOpacity"
        :textPanelStyle="textPanelStyle"
        :sourceUrl="sourceUrl"
        :thumbnailUrlList="thumbnailUrlList"
        :framesDataList="framesDataList"
        :featurePointDataList="featurePointDataList"
         @on-active='activateThumbnail'
      >
      </recognition-visualize-face-target>
    </template>
    <template v-if="mode==='target'||mode===2">
      <recognition-visualize-face-target
        :mode="mode"
        :textDataList="textDataList"
        :thumbnailPanelStyle="thumbnailPanelStyle"
        :activeColor="activeColor"
        :noActiveColor="noActiveColor"
        :frameStyle="frameStyle"
        :textPanelStyle="textPanelStyle"
        :sourceUrl="sourceUrl"
        :thumbnailUrlList="thumbnailUrlList"
        :framesDataList="framesDataList"
         @on-active='activateThumbnail'
      >
      </recognition-visualize-face-target>
    </template>
  </div>
</template>
<script>
import { oneOf } from '@/utils/assist'
import RecognitionVisualizeFaceTarget from './recognition-visualize-face-target'
// import RecognitionVisualizeTarget from './recognition-visualize-target'
import RecognitionVisualizeGeneral from './recognition-visualize-general'

export default {
  name: 'recognition-visualize',
  components: {
    RecognitionVisualizeGeneral,
    RecognitionVisualizeFaceTarget
    // RecognitionVisualizeTarget
  },
  props: {
    // ==============全局=================
    mode: {
      type: [String, Number],
      default: 0,
      validator (value) {
        return oneOf(value, ['general', 'face', 'target', 0, 1, 2])
      }
    },
    width: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    },
    // background: String,
    textDataList: {
      type: Array,
      required: true
    },
    // ==============mode: face && target=================
    thumbnailPanelStyle: {
      type: Object,
      default: function () {
        return {
          top: '10px',
          right: '10px',
          width: '15%'
        }
      }
    },
    activeColor: {
      type: String,
      default: 'red'
    },
    noActiveColor: {
      type: String,
      default: 'white'
    },
    frameStyle: {
      type: Object,
      default: function () {
        return {
          border: '3px solid red',
          borderRadius: 'none'
        }
      }
    },
    recImgStyle: {
      type: Object,
      default: function () {
        return {
          width: 60,
          height: 60,
          left: '5%',
          top: '10%'
        }
      }
    },
    featurePointColor: {
      type: String,
      default: 'red'
    },
    featurePointSize: {
      type: Number,
      default: 3
    },
    maskColor: {
      type: String,
      default: 'black'
    },
    maskOpacity: {
      type: Number,
      default: 80
    },
    textPanelStyle: {
      type: Object,
      default: function () {
        return {
          color: 'white',
          fontFamily: '微软雅黑',
          fontSize: '14px',
          width: '30%',
          right: '10%',
          bottom: '10%',
          background: 'rgba(145, 150, 105, 0.5)',
          padding: '5px',
          lineHeight: '25px',
          borderRadius: '10px'
        }
      }
    },
    sourceUrl: {
      type: String,
      default: null
    },
    thumbnailUrlList: {
      type: Array,
      default: null
    },
    framesDataList: {
      type: Array,
      default: function () {
        return []
      }
    },
    featurePointDataList: {
      type: Array,
      default: function () {
        return []
      }
    },
    // ==============mode: general=================
    resultImgUrl: {
      type: String
    },
    alignment: {
      type: [Number, String],
      default: 0,
      validator (value) {
        return oneOf(value, [0, 1, 'horizontal', 'vertical'])
      }
    },
    imgSizeRatio: {
      type: Number,
      default: 50
    },
    resultHeaderStyle: {
      type: Object,
      default: function () {
        return {
          fontSize: '16px',
          color: 'white',
          background: 'green',
          width: '100%',
          height: '20%',
          display: 'flex',
          flexFlow: 'row wrap',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }
    },
    resultHeaderText: {
      type: String,
      default: '识别结果'
    },
    resultContentStyle: {
      type: Object,
      default: function () {
        return {
          fontSize: '14px',
          color: 'black',
          background: 'silver',
          width: '100%',
          height: '80%',
          overflow: 'auto'
        }
      }
    }
  },
  computed: {
    compContainerStyle () {
      return {
        width: this.width,
        height: this.height
      }
    }
  },
  methods: {
    activateThumbnail (oldIndex, newIndex) {
      this.$emit('on-active', oldIndex, newIndex)
    }
  }
}
</script>
