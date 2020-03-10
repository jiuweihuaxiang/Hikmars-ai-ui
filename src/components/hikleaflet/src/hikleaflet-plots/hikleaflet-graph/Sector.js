/* =================================================
@功能: 实现扇形的标绘类
@作者：李永强
@创建时间:2020-2-24
@修改记录：
================================================== */
import {PlotUtils} from '../hikleaflet-plotUtils'
import {PlotTypes, Mixin} from '../hikleaflet-plotPublic'
import {Plot} from './Plot.js'
export let Sector = function (points) {
  this.type = PlotTypes.SECTOR
  this.fixPointCount = 3
  this.setPoints(points)
}

Mixin(Sector.prototype, Plot.prototype)
Sector.prototype.generate = function () {
  if (this.getPointCount() < 2) { return }
  if (this.getPointCount() === 2) {
    return [this.points]
    // this.setCoordinates([this.points])
  } else {
    let pnts = this.getPoints()
    let center = pnts[0]
    let pnt2 = pnts[1]
    let pnt3 = pnts[2]
    let radius = PlotUtils.distance(pnt2, center)
    let startAngle = PlotUtils.getAzimuth(pnt2, center)
    let endAngle = PlotUtils.getAzimuth(pnt3, center)
    let pList = PlotUtils.getArcPoints(center, radius, startAngle, endAngle)
    pList.push(center, pList[0])
    return [pList]
    // this.setCoordinates([pList])
  }
}
