# WebRTC Video组件

## Attributes

| 参数      | 说明                                     | 类型   | 默认值 |
| --------- | ---------------------------------------- | ------ | ------ |
| options   | video.js的配置参数，可以参照video.js文档 | object | {}     |
| srcObject | 设定一个媒体源，开发WebRTC时需要用到     | object | {}     |

## Events

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

## Methods

以下列出几个常用的方法，详细方法请查看video.js的官方文档

| 方法名称    | 说明                 | 参数    |
| ----------- | -------------------- | ------- |
| play        | 播放视频             | -       |
| pause       | 停止播放视频         | -       |
| controls    | 是否显示控制栏       | boolean |
| currentTime | 获取或者设定当前时间 | number  |
| dispose     | 销毁播放器           | -       |

