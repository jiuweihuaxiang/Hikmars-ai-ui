# WebRTC Video组件

## 依赖

- video.js: 7.6.6

## 用法

~~~js
<template>
  <HikWebRtcVideo  class="video-player-box"
                 ref="videoPlayer"
                 :options="playerOptions"
                 :playsinline="true"
                 customEventName="customstatechangedeventname"

                 @play="onPlayerPlay($event)"
                 @pause="onPlayerPause($event)"
                 @ended="onPlayerEnded($event)"
                 @waiting="onPlayerWaiting($event)"
                 @playing="onPlayerPlaying($event)"
                 @loadeddata="onPlayerLoadeddata($event)"
                 @timeupdate="onPlayerTimeupdate($event)"
                 @canplay="onPlayerCanplay($event)"
                 @canplaythrough="onPlayerCanplaythrough($event)"

                 @statechanged="playerStateChanged($event)"
                 @ready="playerReadied">
  </HikWebRtcVideo>
</template>

<script>
  export default {
    data() {
      return {
        playerOptions: {
          height: '360',
          autoplay: false,
          language: 'en',
          muted: true,
          controls: true,
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [
            {
              type: 'video/mp4',
              // mp4
              // src: 'http://vjs.zencdn.net/v/oceans.mp4'
              // webm
              src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
            }
          ]
      	}
      }
    },
    mounted() {
      console.log('this is current player instance object', this.player)
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    methods: {
      // listen event
      onPlayerPlay(player) {
        // console.log('player play!', player)
      },
      onPlayerPause(player) {
        // console.log('player pause!', player)
      },
      // ...player event

      // or listen state event
      playerStateChanged(playerCurrentState) {
        // console.log('player current update state', playerCurrentState)
      },

      // player is ready
      playerReadied(player) {
        console.log('the player is readied', player)
        // you can use it to do something...
        // player.[methods]
      }
    }
  }
</script>
~~~

## 属性

| 参数      | 说明                                     | 类型   | 默认值 |
| --------- | ---------------------------------------- | ------ | ------ |
| options   | video.js的配置参数，可以参照video.js文档 | object | {}     |
| srcObject | 设定一个媒体源，开发WebRTC时需要用到     | object | {}     |

## 事件

| 事件名称       | 说明                                 | 回调参数 |
| -------------- | ------------------------------------ | -------- |
| loadeddata     | 当播放器在当前播放位置下载数据时触发 | player   |
| canplay        | 当播放器可以播放媒体文件时触发       | player   |
| canplaythrough | 当播放器可以播放媒体文件时触发       | player   |
| play           | 当播放器开始播放媒体文件时触发       | player   |
| pause          | 当播放器暂停媒体文件时触发           | player   |
| waiting        | 当播放器因为没有数据而停止时触发     | player   |
| playing        | 当播放器播放媒体文件时触发           | player   |
| ended          | 当播放器结束播放媒体文件时触发       | player   |
| error          | 当播放器播放媒体文件出错时触发       | player   |
| timeupdate     | 当播放器播放媒体文件时间更新时触发   | time     |

## 方法

以下列出几个常用的方法，详细方法请查看video.js的官方文档

| 方法名称    | 说明                 | 参数    |
| ----------- | -------------------- | ------- |
| play        | 播放视频             | -       |
| pause       | 停止播放视频         | -       |
| controls    | 是否显示控制栏       | boolean |
| currentTime | 获取或者设定当前时间 | number  |
| dispose     | 销毁播放器           | -       |

## 描述

基本思路来自于`vue-video-player`，video.js的基础封装，通过`this.$ref.videoPlayer.player`可以直接使用video.js的API

此外增加了`getVideoElement`，用以获取组件video元素，可以直接使用原生API完成一些video.js没有覆盖的video属性或者方法

## 灵感来源

- [vue-video-player](https://github.com/surmon-china/vue-video-player)

