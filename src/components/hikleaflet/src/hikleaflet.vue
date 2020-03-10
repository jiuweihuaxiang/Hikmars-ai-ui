/*=================================================
@功能 :
@作者 ：李永强
@创建时间:2020-2-6
@修改记录：
==================================================*/
<template>
  <div>
      <div id ='map' class="map">
      </div>
      <button style="position:absolute;right:20px;width:100px;height:40px;top:100px;z-index:1000" @click="click_button">
      标绘1</button>
      <button style="position:absolute;right:20px;width:100px;height:40px;top:150px;z-index:1000" @click="click_button2">
      标绘2</button>
  </div>
</template>
<script>
import L from 'leaflet'
import hikCluster from './hikleaflet-cluster.js'
import hikMarker from './hikleaflet-marker.js'
import {PlotDraw} from './hikleaflet-plots/hikleaflet-plotDraw.js'
import {PlotTypes} from './hikleaflet-plots/hikleaflet-plotPublic.js'

export default {
  name: 'hikleaflet',
  props: {
    // mapUrl: {type: String}
  },
  data () {
    return {
      mapUrl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      center: [30.518762, 114.398902],
      zoomLeve: 10,
      myMap: null,
      markerList: {},
      leafletView: null,
      num: 0,
      latlngs: []
    }
  },
  mounted () {
    let that = this
    this.myMap = L.map('map').setView(that.center, that.zoomLeve)
    L.tileLayer(that.mapUrl, {
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'your.mapbox.access.token'
    }).addTo(this.myMap)
    var latlngs = [
      [30.518762, 114.398902],
      [30.528762, 114.498902],
      [30.548762, 114.428902]
    ]
    this.latlngs = latlngs
    var size = 100
    // var markers = []
    let markerLonLngs1 = []
    let markerLonLngs2 = []
    for (var i = 0; i < size; ++i) {
      let lonlng = [29.91111 + (Math.random() - 0.5) * 0.002 * size, 114.352778 + (Math.random() - 0.5) * 0.003 * size]
      if (i < size / 2) {
        markerLonLngs1.push(lonlng)
      } else {
        markerLonLngs2.push(lonlng)
      }
    }
    let g1 = hikCluster.setClusterGroup(markerLonLngs1, '飞机')
    let g2 = hikCluster.setClusterGroup(markerLonLngs2, '坦克')
    let clusterGroups = [g1, g2]
    hikCluster.addClusterGroup(clusterGroups, this.myMap)
    // leafletView
    // this.leafletView = hikCluster.addMarkerCluster(markerLonLngs1, this.myMap)
    let entityInfo = {
      id: 'm1',
      pos: [30.558762, 114.598902],
      iconUrl: 'static/planeIcon2_active.png',
      iconSize: [40, 40],
      rotationAngle: 120,
      popupContent: 'llll'
    }
    let entityInfo2 = {
      id: 'm2',
      pos: [30.538762, 114.398902],
      iconUrl: 'static/position-plane-blue.png',
      iconSize: [40, 40]
    }
    this.markerList['m1'] = hikMarker.addMarker(entityInfo, this.myMap)
    this.markerList['m2'] = hikMarker.addMarker(entityInfo2, this.myMap)
    this.markerList['m1'].isPath = true
    // hikMarker.moveMarker(this.markerList['m1'], latlngs[1], this)
    // this.addPopup([30.558762, 114.398902], '这是一个气泡')
    // let pt1 = [30.518762, 114.398902]
    // let pt2 = [30.568762, 114.398902]
    // let pt3 = [30.698762, 114.7198902]
    // // // let pt4 = [30.658762, 114.7198902]
    // // // let pt = [pt1, pt2, pt3, pt4]
    // let ptn = [pt1, pt2, pt3]
    // PlotFactory.drawPlot('sector', ptn, this.myMap)
    // let map = this.myMap
    // var points = []
    // // eslint-disable-next-line new-cap
    // var lines = new L.polyline([])
    // // eslint-disable-next-line new-cap
    // var tempLines = new L.polyline([], {dashArray: 5})
    // var tempLines = null
    // var plot = null
    // let plotdraw = new PlotDraw(map, 'sector')
    // plotdraw.activate()

    // plotdraw.add('wuliw')
    // console.log(plotdraw)
    // let map = this.myMap
    // this.myMap.on('click', onClick)
    // map.on('mousemove', onMove)// 双击地图

    // map.off(....) 关闭该事件
  },
  methods: {
    addPath (pathArray) {
      // let latLngs = [currentPos, nextPos]
      let len = pathArray.length
      if (len > 1) {
        let latlngs = []
        latlngs.push(pathArray[len - 2])
        latlngs.push(pathArray[len - 1])
        L.polyline(latlngs, {color: 'red'}).addTo(this.myMap)
      }
    },
    click_button () {
      // this.getMarker('m1').move([30.608762, 114.398902])
      // let markerObj = hikMarker.getMarker('m1')
      // markerObj.isPath = false
      // let myMap = this.myMap
      // let latlngs = [
      //   [30.518762, 114.358902],
      //   [30.528762, 114.498902],
      //   [30.588762, 114.528902]
      // ]
      // let i = this.num
      // hikMarker.moveMarker(markerObj, latlngs[i], myMap)
      // this.num++
      // hikMarker.getMarker('m1').setRotationAngle(120)
      // hikMarker.removeAllMarker(this.myMap)
      let plotdraw = new PlotDraw(this.myMap, PlotTypes.GATHERING_PLACE)
      plotdraw.activate()
    },
    click_button2 () {
      // this.getMarker('m1').move([30.608762, 114.398902])
      // this.getMarker('m1').setRotationAngle(120)
      let plotdraw = new PlotDraw(this.myMap, PlotTypes.TAILED_SQUAD_COMBAT)
      plotdraw.activate()
    },
    errorMessage (error) {
      alert(error)
    }
  }
}
</script>
<style >
/* @import '../../../assets/LeafletStyleSheet.css'; */
.map {
  width: 100%;
  height: calc(100vh);
};
</style>
