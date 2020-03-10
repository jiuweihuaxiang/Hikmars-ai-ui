/* =================================================
@功能: 实现标绘的绘制类PlotDarw
@作者：李永强
@创建时间:2020-2-23
@修改记录：
================================================== */
import {PlotFactory} from './hikleaflet-plotFactory'
import {PlotUtils} from './hikleaflet-plotUtils'
import {Constants} from './hikleaflet-plotPublic'
export let PlotDraw = function (map, type) {
  this.map = map
  this.points = []
  this.plotType = type
  this.polygon = null
  this.circles = []
}
let freehand = false
/**
 * 标绘绘制激活
 */
PlotDraw.prototype.activate = function () {
  // this.deactivate();
  // this.deactivateMapTools();
  this.map.on('click', this.pointClickHandler, this)
  this.map.on('click', this.mapFirstClickHandler, this)

//   this.plotParams = params
//   this.map.addLayer(this.drawOverlay)
}
/**
 * 第一次鼠标点击事件
 */
PlotDraw.prototype.mapFirstClickHandler = function (e) {
  console.log(this.plotType)
  this.points.push([e.latlng.lat, e.latlng.lng])
  this.plot = PlotFactory.createPlot(this.plotType, this.points, this.plotParams)
  this.map.off('click', this.mapFirstClickHandler, this)
  if (this.plot.hasOwnProperty('fixPointCount')) {
    if (this.plot.fixPointCount === this.plot.getPointCount()) {
      // this.mapDoubleClickHandler(e)
      return
    }
  }

  this.map.on('click', this.mapNextClickHandler, this)

  if (!freehand) {
    this.map.on('dblclick', this.mapDoubleClickHandler, this)
  }
  this.map.on('mousemove', this.mapMouseMoveHandler, this)
}
/**
 * 鼠标移动事件
 */
PlotDraw.prototype.mapMouseMoveHandler = function (e) {
  var coordinate = [e.latlng.lat, e.latlng.lng]
  if (PlotUtils.distance(coordinate, this.points[this.points.length - 1]) < Constants.ZERO_TOLERANCE) { return }
  if (this.polygon !== null) {
    this.polygon.remove()
  }
  if (!freehand) {
    var pnts = this.points.concat([coordinate])
    this.plot.setPoints(pnts)
    // let points = this.plot.getPoints()
    this.polygon = PlotFactory.drawPolygon(this.plot, this.map)
  } else {
    this.points.push(coordinate)
    this.plot.setPoints(this.points)
  }
}

PlotDraw.prototype.mapNextClickHandler = function (e) {
  let coord = [e.latlng.lat, e.latlng.lng]
  if (!freehand) {
    if (PlotUtils.distance(coord, this.points[this.points.length - 1]) < Constants.ZERO_TOLERANCE) { return }
  }
  this.points.push(coord)
  this.plot.setPoints(this.points)
  if (this.polygon != null) {
    this.polygon.remove()
  }
  this.polygon = PlotFactory.drawPolygon(this.plot, this.map)
}

PlotDraw.prototype.mapDoubleClickHandler = function (e) {
  this.disconnectEventHandlers()
  //   this.plot.finishDrawing()
  let point = this.plot.getPoints()
  console.log(point)
  // let map = this.map
  if (this.polygon != null) {
    this.polygon.remove()
  }
  this.polygon = PlotFactory.drawPolygon(this.plot, this.map)
  this.polygon.on('dblclick', function (e) {
    console.log(e)
    e.target.remove()
  })
}
/**
 * 释放鼠标点击事件
 */
PlotDraw.prototype.disconnectEventHandlers = function () {
  this.map.off('click', this.mapFirstClickHandler, this)
  this.map.off('click', this.pointClickHandler, this)
  this.map.off('click', this.mapNextClickHandler, this)
  this.map.off('dblclick', this.mapDoubleClickHandler, this)
  this.map.off('mousemove', this.mapMouseMoveHandler, this)

  for (let i = 0; i < this.circles.length; i++) {
    this.circles[i].remove()
  }
  this.circles = []
}
/**
 * 鼠标点击显示的点
 */
PlotDraw.prototype.pointClickHandler = function (e) {
  let point = [e.latlng.lat, e.latlng.lng]
  let circleMarker = PlotFactory.createPoint(point, this.map)
  this.circles.push(circleMarker)
}
