/* =================================================
@功能: 实现直箭头的标绘类
@作者：李永强
@创建时间:2020-2-24
@修改记录：
================================================== */
import {PlotUtils} from '../hikleaflet-plotUtils'
import {PlotTypes, Mixin} from '../hikleaflet-plotPublic'
import {Plot} from './Plot.js'
export let StraightArrow = function (points) {
  this.type = PlotTypes.STRAIGHT_ARROW
  this.fixPointCount = 2
  this.maxArrowLength = 3000000
  this.arrowLengthScale = 5
  this.setPoints(points)
}

// goog.inherits(Plot.StraightArrow, ol.geom.LineString);
Mixin(StraightArrow.prototype, Plot.prototype)
StraightArrow.prototype.generate = function () {
  if (this.getPointCount() < 2) {
    return
  }
  let pnts = this.getPoints()
  let pnt1 = pnts[0]
  let pnt2 = pnts[1]
  let distance = PlotUtils.distance(pnt1, pnt2)
  let len = distance / this.arrowLengthScale
  len = len > this.maxArrowLength ? this.maxArrowLength : len
  let leftPnt = PlotUtils.getThirdPoint(pnt1, pnt2, Math.PI / 6, len, false)
  let rightPnt = PlotUtils.getThirdPoint(pnt1, pnt2, Math.PI / 6, len, true)
  this.setCoordinates([pnt1, pnt2, leftPnt, pnt2, rightPnt])
}
