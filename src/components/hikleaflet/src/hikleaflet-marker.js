/* =================================================
@功能: 实体图标的增删查，以及动态运动的接口
@作者：李永强
@创建时间:2020-2-10
@修改记录：
================================================== */
import L from 'leaflet'
import 'leaflet-rotatedmarker'
/**
 * @param {objdect} entityInfo
 * @param {objdect} that
 * @returns {object} marker
 */
let markerGroup = []
let markerList = {}
function addMarker (entityInfo, myMap) {
  let icon = L.icon({
    iconUrl: entityInfo.iconUrl,
    iconSize: entityInfo.iconSize,
    popupAnchor: [0, 0]
  })
  let angle = 0
  if (entityInfo.rotationAngle) {
    angle = entityInfo.rotationAngle
  }
  let marker = L.marker(entityInfo.pos, {icon: icon, rotationAngle: angle, draggable: false}).addTo(myMap)
  if (entityInfo.hasOwnProperty('popupContent')) {
    marker.bindPopup(entityInfo.popupContent).openPopup()
  }
  markerGroup.push(marker)
  markerList[entityInfo.id] = marker
  marker.pathArray = [entityInfo.pos]
  marker.isPath = false
  return marker
}
/**
 *  移除marker
 * @param {string} id
 * @param {object} myMap
 */
function removeMarker (id, myMap) {
  if (markerList[id]) {
    myMap.removeLayer(markerList[id])
    delete markerList[id]
  } else {
    alert('id 没有找到')
  }
}
/**
 * 删除所用图标
 * @param {object} myMap
 */
function removeAllMarker (myMap) {
  let myGroup = L.layerGroup(markerGroup)
  myMap.addLayer(myGroup)
  myGroup.clearLayers()
}

/*
 * 获取图标对象
 * @param {*} id
 * @returns marker
 */
function getMarker (id) {
  return markerList[id]
}
/**
 *设置实体朝向角度
 * @param {*} markerObj
 * @param {*} angle
 * @param {*} that
 */
function setMarkerAngle (markerObj, angle) {
  if (markerObj) {
    // 设置绕icon哪个位置旋转，本例设‘center’，以icon 的中心为旋转。
    markerObj.setRotationOrigin('center')
    markerObj.setRotationAngle(angle)
  } else {
    alert('marker 为 null')
  }
}

/**
 * 添加路径
 * @param {object} pathArray
 * @param {objict} myMap
 */
function addPath (pathArray, myMap) {
  // let latLngs = [currentPos, nextPos]
  let len = pathArray.length
  if (len > 1) {
    let latlngs = []
    latlngs.push(pathArray[len - 2])
    latlngs.push(pathArray[len - 1])
    L.polyline(latlngs, {color: 'red'}).addTo(myMap)
  }
}
/**
 * 实体图标动态运动接口
 * @param {*} markerObj
 * @param {*} destPos
 * @param {*} myMap
 */
function moveMarker (markerObj, destPos, myMap) {
  let currentPos = markerObj.pathArray[markerObj.pathArray.length - 1]
  // 计算移动的下一点和当前点连线的夹角
  let angle = (Math.atan2(destPos[1] - currentPos[1], destPos[0] - currentPos[0])) * 180 / 3.1415926
  // debugger
  setMarkerAngle(markerObj, angle)
  markerObj.setLatLng(destPos)
  markerObj.pathArray.push(destPos)
  if (markerObj.isPath) {
    addPath(markerObj.pathArray, myMap)
  }
}
/**
 * 添加气泡
 * @param {array} pos
 * @param {string} content
 */
function addPopup (pos, content) {
  let popup = L.popup().setLatLng(pos).setContent(content).openOn(this.myMap)
  return popup
}
// function addPath () {
// }
export default {addMarker, removeMarker, removeAllMarker, getMarker, moveMarker, addPopup}
