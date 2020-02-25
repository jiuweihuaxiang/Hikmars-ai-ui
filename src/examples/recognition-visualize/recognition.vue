<template>
  <recognition-visualize
    :mode="mode"
    :width="width"
    :height="height"
    :textDataList="textDataList"
    :sourceUrl="sourceUrl"
    :thumbnailUrlList="thumbnailUrlList"
    :framesDataList="framesDataList"
    :activeColor="activeColor"
    :noActiveColor="noActiveColor"
    :frameStyle="frameStyle"
    :featurePointDataList="featurePointDataList"
    :featurePointColor="featurePointColor"
    :featurePointSize="featurePointSize"
    :textPanelStyle="textPanelStyle"
    @on-active="handleActive"
  >
    <!-- <table border="1" style="width: 100%; height: 100%">
      <thead>
        <th>属性</th>
        <th>值</th>
      </thead>
      <tr v-for="(item, index) in textDataList" :key="index">
        <td>{{item.key}}</td>
        <td>{{item.value}}</td>
      </tr>
    </table> -->
  </recognition-visualize>
</template>

<script>
export default {
  data () {
    return {
      mode: 2,
      width: '400px',
      height: '400px',
      textDataList: [
        [
          {
            key: '姓名',
            value: '张三'
          },
          {
            key: '性别',
            value: '男'
          },
          {
            key: '职务',
            value: '经理'
          }
        ],
        [
          {
            key: '姓名',
            value: '李四'
          },
          {
            key: '性别',
            value: '男'
          },
          {
            key: '职务',
            value: '工程师'
          }
        ]
      ],
      sourceUrl: 'static/face.jpg',
      thumbnailUrlList: [
        'static/face1.jpg',
        'static/face2.jpg'
      ],
      framesDataList: [
        {
          left: 20,
          top: 20,
          width: 100,
          height: 100
        },
        {
          left: 40,
          top: 30,
          width: 100,
          height: 100
        }
      ],
      activeColor: 'yellow',
      noActiveColor: 'black',
      frameStyle: {
        border: '2px solid green'
      },
      featurePointDataList: [
        [
          {
            left: 50,
            top: 70
          },
          {
            left: 58,
            top: 80
          }
        ],
        [
          {
            left: 30,
            top: 70
          },
          {
            left: 58,
            top: 50
          }
        ]
      ],
      featurePointColor: 'red',
      featurePointSize: 3,
      textPanelStyle: {
        right: '1%',
        top: '60%',
        width: '30%',
        background: 'rgba(145, 150, 105, 0.5)',
        padding: '8px',
        lineHeight: '28px',
        borderRadius: '10px',
        color: 'white'
      }
    }
  },
  methods: {
    handleActive (oldIndex, newIndex) {
      console.log('我的钩子函数', newIndex, oldIndex)
    }
  }
}
</script>
