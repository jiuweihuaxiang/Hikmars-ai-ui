<info>
  author: ZhaoHongChen
  createDate: 2020.02.17
  desc：目标识别组件vue文件
</info>

<template>
  <div class="hik-recvisual-face" ref="allBk" :style="this.activeIndex ? backgroundStyleWithOpacity : backgroundStyle">
    <!-- 遮罩 -->
    <div v-if="this.activeIndex && (this.mode===1 || this.mode==='face')" :style="compMaskStyle"></div>
    <!-- 识别截图 && 特征点 -->
    <div v-if="this.activeIndex && (this.mode===1 || this.mode==='face')"
      ref="recImg"
      class="hik-recvisual-face-recImg"
      :style="compRecImgStyle"
    >
      <div class="hik-recvisual-face-point-wrap">
        <div v-for="(item, index) in compFeaturePointDataList"
          class="hik-recvisual-face-point"
          :key="index"
          :style="{...featurePointStyle, ...compFeaturePointDataList[index]}">
        </div>
      </div>
    </div>
    <!-- 全局识别框 -->
    <template v-if="!this.activeIndex">
      <div v-for="(item, index) in compFramesDataList"
        class="hik-recvisual-face-frame"
        :key="index"
        :style="{...frameStyle, ...item}"
        >
      </div>
    </template>
    <!-- 目标模式 && 局部识别框 -->
    <div v-if="this.activeIndex && (this.mode===2 || this.mode==='target')"
      :style="{...this.frameStyle, ...compFramesDataList[this.activeIndex - 1]}"
      class="hik-recvisual-face-frame"
    >
    </div>
    <!-- 缩略图面板 -->
    <div class="hik-recvisual-thumbnail-list" :style="thumbnailPanelStyle">
      <template v-for="(item, index) in compThumbnailUrlList">
        <img
          :ref="'thumbnail'+index"
          :src="item"
          :key="index"
          alt="缩略图"
          :style="{...thumbnailStyle, ...compThumbnailStyle(index)}"
          @click="activateThumbnail(index)"
          >
      </template>
    </div>
    <!-- 文本面板 -->
    <div v-if="this.activeIndex" class="hik-recvisual-face-text-panel" :style="textPanelStyle">
      <el-row
        :gutter="5"
        v-for="(item, index) in textDataList[this.activeIndex - 1]"
        :key="index"
        class="hik-recvisual-text-row"
      >
        <el-col :span="12" style="textAlign:right;fontWeight:bold">{{item.key}} :</el-col>
        <el-col :span="12" style="textAlign:left">{{item.value}}</el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
// import { oneOf } from '@/utils/assist'

export default {
  name: 'recognition-visualize-face',
  data () {
    return {
      activeIndex: 0,
      originWidth: null, // 识别截图原始宽度
      originHeight: null,
      originAllWidth: null, // 原始识别图像的宽度
      originAllHeight: null,
      curAllWidth: null,
      curAllHeight: null,
      thumbnailStyle: null,
      compFramesDataList: null,
      compFeaturePointDataList: null
    }
  },
  props: [
    'mode',
    'textDataList',
    'thumbnailPanelStyle',
    'activeColor',
    'noActiveColor',
    'frameStyle',
    'recImgStyle',
    'featurePointColor',
    'featurePointSize',
    'maskColor',
    'maskOpacity',
    'textPanelStyle',
    'sourceUrl',
    'thumbnailUrlList',
    'framesDataList',
    'featurePointDataList'
  ],
  computed: {
    backgroundStyle () {
      return {
        background: `url(${this.sourceUrl}) no-repeat`,
        backgroundSize: '100% 100%'
      }
    },
    backgroundStyleWithOpacity () {
      return {
        background: `url(${this.sourceUrl}) no-repeat`,
        backgroundSize: '100% 100%',
        opacity: this.maskOpacity
      }
    },
    compMaskStyle () {
      return {
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: this.maskColor,
        opacity: this.maskOpacity / 100
      }
    },
    compRecImgStyle () {
      const comRecStyle = {
        width: `${parseFloat(this.recImgStyle.width)}%`,
        height: `${parseFloat(this.recImgStyle.height)}%`,
        left: this.recImgStyle.left,
        top: this.recImgStyle.top,
        right: this.recImgStyle.right,
        bottom: this.recImgStyle.bottom
      }
      return {
        ...comRecStyle,
        backgroundImage: `url(${this.thumbnailUrlList[this.activeIndex - 1]})`
      }
    },
    featurePointStyle () {
      return {
        borderRadius: `${this.featurePointSize}px`,
        border: `${this.featurePointSize}px solid ${this.featurePointColor}`
      }
    },
    compThumbnailUrlList () {
      return [this.sourceUrl, ...this.thumbnailUrlList]
    },
    compThumbnailStyle () {
      return function (index) {
        return {
          border: `1px solid ${index === this.activeIndex ? this.activeColor : this.noActiveColor}`
        }
      }
    }
  },
  methods: {
    // 点击激活缩略图
    async activateThumbnail (index) {
      const oldIndex = this.activeIndex
      const newIndex = index
      this.activeIndex = newIndex
      // 对外事件触发
      this.$emit('on-active', oldIndex, newIndex)
      // 辅助类处理
      const size = await this.getImgSize([this.sourceUrl, ...this.thumbnailUrlList][index])
      this.originWidth = size.width
      this.originHeight = size.height
      // 特征点处理
      if (this.mode === 1) {
        this.compFeaturePointDataList = this.getCompFeaturePointDataList()
      }
    },
    async getImgSize (url) {
      let size = {
        width: null,
        height: null
      }
      let img = new Image()
      img.src = url
      const target = await this.imgload(img)
      if (target && target.height && target.width) {
        size.height = target.height
        size.width = target.width
      }
      return size
    },
    imgload (img) {
      return new Promise((resolve, reject) => {
        img.onload = function () {
          resolve(this)
        }
        img.onerror = function (err) {
          reject(err)
        }
      })
    },
    getThumbnailStyle () {
      // 是否可行，不行的话用watch
      const dom = document.querySelector('.hik-recvisual-thumbnail-list')
      const compHeight = window.getComputedStyle(dom).width
      return {
        width: compHeight,
        height: compHeight,
        display: 'block'
      }
    },
    getCompFeaturePointDataList () {
      if (!this.activeIndex) {
        return
      }
      const compList = this.featurePointDataList[this.activeIndex - 1].map(element => {
        const cssWidth = parseFloat(this.recImgStyle.width)
        const cssHeight = parseFloat(this.recImgStyle.height)
        const curWidth = this.curAllWidth * cssWidth / 100
        const curHeight = this.curAllHeight * cssHeight / 100
        const rw = curWidth / this.originWidth
        const rh = curHeight / this.originHeight
        return {
          left: `${element.left * rw}px`,
          top: `${element.top * rh}px`
        }
      })
      return compList
    },
    getCompFramesDataList () {
      const compFrames = this.framesDataList.map(element => {
        const rw = this.curAllWidth / this.originAllWidth
        const rh = this.curAllHeight / this.originAllHeight
        return {
          left: element.left * rw + 'px',
          top: element.top * rh + 'px',
          width: element.width * rw + 'px',
          height: element.height * rh + 'px'
        }
      })
      return compFrames
    },
    async getOriginSize () {
      const size = await this.getImgSize(this.sourceUrl)
      this.originAllHeight = size.height
      this.originAllWidth = size.width
    }
  },
  async mounted () {
    this.thumbnailStyle = this.getThumbnailStyle()
    await this.getOriginSize()
    this.curAllWidth = parseFloat(window.getComputedStyle(this.$refs['allBk']).width)
    this.curAllHeight = parseFloat(window.getComputedStyle(this.$refs['allBk']).height)
    this.compFramesDataList = this.getCompFramesDataList()
    // this.compFeaturePointDataList = this.getCompFeaturePointDataList()
  }
}
</script>
