/* =================================================
@功能: 实现标绘父类
@作者：李永强
@创建时间:2020-2-23
@修改记录：
================================================== */
import L from 'leaflet'
export let Plot = function (points) {
  this.setPoints(points)
}

Plot.prototype = {

  isPlot: function () {
    return true
  },

  setPoints: function (value) {
    this.points = value || []
    if (this.points.length >= 1) { this.generate() }
  },

  getPoints: function () {
    return this.points.slice(0)
  },

  getPointCount: function () {
    return this.points.length
  },

  updatePoint: function (point, index) {
    if (index >= 0 && index < this.points.length) {
      this.points[index] = point
      this.generate()
    }
  },

  updateLastPoint: function (point) {
    this.updatePoint(point, this.points.length - 1)
  },

  generate: function () {
  },

  finishDrawing: function () {

  },
  setCoordinates: function (points) {
    let polygon = L.polygon(points, {color: 'red'})
    return polygon
  }

}
