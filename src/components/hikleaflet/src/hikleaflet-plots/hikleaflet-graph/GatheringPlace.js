/* =================================================
@功能: 实现聚集地的标绘类
@作者：李永强
@创建时间:2020-2-24
@修改记录：
================================================== */
import {PlotUtils} from '../hikleaflet-plotUtils.js'
import {Constants, PlotTypes, Mixin} from '../hikleaflet-plotPublic'
import {Plot} from './Plot.js'
export let GatheringPlace = function (points) {
  this.type = PlotTypes.GATHERING_PLACE
  this.t = 0.4
  this.fixPointCount = 3
  this.setPoints(points)
}
// goog.inherits(P.Plot.GatheringPlace, ol.geom.Polygon);
// Inherits(GatheringPlace, L.Polyline)
Mixin(GatheringPlace.prototype, Plot.prototype)

GatheringPlace.prototype.generate = function () {
  let pnts = this.getPoints()
  if (pnts.length < 2) {
    return
  }
  if (this.getPointCount() === 2) {
    let mid = PlotUtils.mid(pnts[0], pnts[1])
    let d = PlotUtils.distance(pnts[0], mid) / 0.9
    let pnt = PlotUtils.getThirdPoint(pnts[0], mid, Constants.HALF_PI, d, true)
    pnts = [pnts[0], pnt, pnts[1]]
  }
  let mid = PlotUtils.mid(pnts[0], pnts[2])
  pnts.push(mid, pnts[0], pnts[1])

  let normals = []
  let pnt1 = []
  let pnt2 = []
  let pnt3 = []
  for (let i = 0; i < pnts.length - 2; i++) {
    pnt1 = pnts[i]
    pnt2 = pnts[i + 1]
    pnt3 = pnts[i + 2]
    let normalPoints = PlotUtils.getBisectorNormals(this.t, pnt1, pnt2, pnt3)
    normals = normals.concat(normalPoints)
  }
  let count = normals.length
  normals = [normals[count - 1]].concat(normals.slice(0, count - 1))
  let pList = []
  for (let i = 0; i < pnts.length - 2; i++) {
    pnt1 = pnts[i]
    pnt2 = pnts[i + 1]
    pList.push(pnt1)
    for (let t = 0; t <= Constants.FITTING_COUNT; t++) {
      let pnt = PlotUtils.getCubicValue(t / Constants.FITTING_COUNT, pnt1, normals[i * 2], normals[i * 2 + 1], pnt2)
      pList.push(pnt)
    }
    pList.push(pnt2)
  }
  // this.setCoordinates([pList]);
  return [pList]
}
