/* =================================================
@功能: 实现细直箭头的标绘类
@作者：李永强
@创建时间:2020-2-24
@修改记录：
================================================== */
import {PlotUtils} from '../hikleaflet-plotUtils.js'
import {Constants, PlotTypes, Mixin} from '../hikleaflet-plotPublic'
import {Plot} from './Plot.js'
export let FineArrow = function (points) {
  this.type = PlotTypes.FINE_ARROW
  this.tailWidthFactor = 0.15
  this.neckWidthFactor = 0.2
  this.headWidthFactor = 0.25
  this.headAngle = Math.PI / 8.5
  this.neckAngle = Math.PI / 13
  this.fixPointCount = 2
  this.setPoints(points)
}
// Inherits(FineArrow, L.polygon)
Mixin(FineArrow.prototype, Plot.prototype)

FineArrow.prototype.generate = function () {
  let count = this.getPointCount()
  if (count < 2) {
    return
  }
  let pnts = this.getPoints()
  let pnt1 = pnts[0]
  let pnt2 = pnts[1]
  let len = PlotUtils.getBaseLength(pnts)
  let tailWidth = len * this.tailWidthFactor
  let neckWidth = len * this.neckWidthFactor
  let headWidth = len * this.headWidthFactor
  let tailLeft = PlotUtils.getThirdPoint(pnt2, pnt1, Constants.HALF_PI, tailWidth, true)
  let tailRight = PlotUtils.getThirdPoint(pnt2, pnt1, Constants.HALF_PI, tailWidth, false)
  let headLeft = PlotUtils.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, false)
  let headRight = PlotUtils.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, true)
  let neckLeft = PlotUtils.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, false)
  let neckRight = PlotUtils.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, true)
  let pList = [tailLeft, neckLeft, headLeft, pnt2, headRight, neckRight, tailRight]
  // let poly = this.setCoordinates([pList]);
  // // this.setLatLngs([pList])
  // // L.polygon().setLatLngs([pList])
  return [pList]
}
