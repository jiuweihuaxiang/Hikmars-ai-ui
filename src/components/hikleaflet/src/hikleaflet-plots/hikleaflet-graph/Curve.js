/* =================================================
@功能: 实现曲线标绘
@作者：李永强
@创建时间:2020-2-23
@修改记录：
================================================== */
import {PlotUtils} from '../hikleaflet-plotUtils.js'
import {PlotTypes, Mixin} from '../hikleaflet-plotPublic'
import {Plot} from './Plot.js'
export let Curve = function (points) {
  this.type = PlotTypes.CURVE
  this.t = 0.3
  this.setPoints(points)
}

Mixin(Curve.prototype, Plot.prototype)

Curve.prototype.generate = function () {
  let count = this.getPointCount()
  if (count < 2) {
    return
  }
  if (count === 2) {
    return this.points
  } else {
    return PlotUtils.getCurvePoints(this.t, this.points)
  }
}
