<info>
  author: ZhaoHongChen
  createDate: 2020.02.17
  desc：目标识别组件vue文件
</info>

<template>
  <div class="hik-recvisual-general" ref="generalWrap" :style="compPanelStyle">
    <!-- 图像展示面板 -->
    <div class="hik-recvisual-general-img" :style="!alignment || alignment === 'horizontal' ? compImgStyleH : compImgStyleV"></div>
    <!-- 文本展示面板 -->
    <div class="hik-recvisual-general-text" :style="!alignment || alignment === 'horizontal' ? compTextPanelStyleH : compTextPanelStyleV">
      <slot>
        <div class="hik-recvisual-general-text-header" :style="this.resultHeaderStyle">
          {{this.resultHeaderText}}
        </div>
        <div class="hik-recvisual-general-text-content" :style="this.resultContentStyle">
          <el-row :gutter="0" v-for="(item, index) in textDataList" :key="index" class="hik-recvisual-text-row">
            <el-col :span="12">{{item.key}}：</el-col>
            <el-col :span="12">{{item.value}}</el-col>
          </el-row>
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
// import { oneOf } from '../../utils/assist'

export default {
  name: 'recognition-visualize-general',
  data () {
    return {
      gutter: 5,
      compImgStyleH: null,
      compImgStyleV: null,
      compTextPanelStyleH: null,
      compTextPanelStyleV: null
    }
  },
  props: [
    'width',
    'height',
    'textDataList',
    'resultImgUrl',
    'alignment',
    'imgSizeRatio',
    'resultHeaderStyle',
    'resultHeaderText',
    'resultContentStyle'
  ],
  computed: {
    compPanelStyle () {
      return {
        width: this.width,
        height: this.height,
        fontSize: '0'
      }
    }
    // compImgStyleH () {
    //   const generalWrap = this.$refs['generalWrap']
    //   console.log(generalWrap)
    //   const width = window.getComputedStyle(generalWrap).width
    //   return {
    //     width: parseFloat(width) * this.imgSizeRatio / 100,
    //     height: '100%',
    //     marginRight: `${this.gutter} px`,
    //     background: `url(${this.resultImgUrl})`
    //   }
    // },
    // compImgStyleV () {
    //   const generalWrap = this.$refs['generalWrap']
    //   const height = window.getComputedStyle(generalWrap).height
    //   return {
    //     width: '100%',
    //     height: parseFloat(height) * this.imgSizeRatio / 100,
    //     marginBottom: `${this.gutter} px`,
    //     background: `url(${this.resultImgUrl})`
    //   }
    // },
    // compTextPanelStyleH () {
    //   console.log('computed')
    //   const generalWrap = this.$refs['generalWrap']
    //   const width = window.getComputedStyle(generalWrap).width
    //   return {
    //     width: parseFloat(width) - this.gutter - parseFloat(width) * this.imgSizeRatio / 100,
    //     height: '100%'
    //   }
    // },
    // compTextPanelStyleV () {
    //   const generalWrap = this.$refs['generalWrap']
    //   const height = window.getComputedStyle(generalWrap).height
    //   return {
    //     height: parseFloat(height) - this.gutter - parseFloat(height) * this.imgSizeRatio / 100,
    //     width: '100%'
    //   }
    // }
  },
  methods: {
    getCompImgStyleH () {
      const generalWrap = this.$refs['generalWrap']
      const width = window.getComputedStyle(generalWrap).width
      return {
        width: parseFloat(width) * this.imgSizeRatio / 100 + 'px',
        height: '100%',
        marginRight: `${this.gutter}px`,
        backgroundImage: `url(${this.resultImgUrl})`,
        display: 'inline-block'
      }
    },
    getCompImgStyleV () {
      const generalWrap = this.$refs['generalWrap']
      const height = window.getComputedStyle(generalWrap).height
      return {
        width: '100%',
        height: parseFloat(height) * this.imgSizeRatio / 100 + 'px',
        marginBottom: `${this.gutter}px`,
        backgroundImage: `url(${this.resultImgUrl})`
      }
    },
    getCompTextPanelStyleH () {
      const generalWrap = this.$refs['generalWrap']
      const width = window.getComputedStyle(generalWrap).width
      return {
        width: parseFloat(width) - this.gutter - parseFloat(width) * this.imgSizeRatio / 100 + 'px',
        height: '100%',
        display: 'inline-block',
        verticalAlign: 'top',
        fontSize: '14px'
      }
    },
    getCompTextPanelStyleV () {
      const generalWrap = this.$refs['generalWrap']
      const height = window.getComputedStyle(generalWrap).height
      return {
        height: parseFloat(height) - this.gutter - parseFloat(height) * this.imgSizeRatio / 100 + 'px',
        width: '100%',
        fontSize: '14px'
      }
    }
  },
  beforeMount () {
    console.log('=========beforemount===========')
    // const generalWrap = this.$refs['generalWrap']
    // console.log(generalWrap)
    // console.log(document.getElementsByClassName('hik-recvisual-general'))
  },
  mounted () {
    console.log('========mounted========')
    this.compImgStyleH = this.getCompImgStyleH()
    this.compImgStyleV = this.getCompImgStyleV()
    this.compTextPanelStyleH = this.getCompTextPanelStyleH()
    this.compTextPanelStyleV = this.getCompTextPanelStyleV()
    console.log(typeof this.alignment)
  }

}
</script>
