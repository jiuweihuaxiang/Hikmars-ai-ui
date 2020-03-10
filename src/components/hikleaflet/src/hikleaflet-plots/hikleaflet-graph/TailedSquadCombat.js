/* =================================================
@功能: 实现带尾分队战斗行动的标绘类
@作者：李永强
@创建时间:2020-2-24
@修改记录：
================================================== */
import {PlotUtils} from '../hikleaflet-plotUtils.js'
import {PlotTypes, Constants, Inherits} from '../hikleaflet-plotPublic'
import {AttackArrow} from './AttackArrow'
export let TailedSquadCombat = function (points) {
  this.type = PlotTypes.TAILED_SQUAD_COMBAT
  this.headHeightFactor = 0.18
  this.headWidthFactor = 0.3
  this.neckHeightFactor = 0.85
  this.neckWidthFactor = 0.15
  this.tailWidthFactor = 0.1
  this.swallowTailFactor = 1
  this.swallowTailPnt = null
  this.setPoints(points)
}

Inherits(TailedSquadCombat, AttackArrow)

TailedSquadCombat.prototype.generate = function () {
  let count1 = this.getPointCount()
  if (count1 < 2) {
    return
  }
  let pnts = this.getPoints()
  let tailPnts = this.getTailPoints(pnts)
  let headPnts = this.getArrowHeadPoints(pnts, tailPnts[0], tailPnts[2])
  let neckLeft = headPnts[0]
  let neckRight = headPnts[4]
  let bodyPnts = this.getArrowBodyPoints(pnts, neckLeft, neckRight, this.tailWidthFactor)
  let count = bodyPnts.length
  let leftPnts = [tailPnts[0]].concat(bodyPnts.slice(0, count / 2))
  leftPnts.push(neckLeft)
  let rightPnts = [tailPnts[2]].concat(bodyPnts.slice(count / 2, count))
  rightPnts.push(neckRight)

  leftPnts = PlotUtils.getQBSplinePoints(leftPnts)
  rightPnts = PlotUtils.getQBSplinePoints(rightPnts)

  return [leftPnts.concat(headPnts, rightPnts.reverse(), [tailPnts[1], leftPnts[0]])]
}

TailedSquadCombat.prototype.getTailPoints = function (points) {
  let allLen = PlotUtils.getBaseLength(points)
  let tailWidth = allLen * this.tailWidthFactor
  let tailLeft = PlotUtils.getThirdPoint(points[1], points[0], Constants.HALF_PI, tailWidth, false)
  let tailRight = PlotUtils.getThirdPoint(points[1], points[0], Constants.HALF_PI, tailWidth, true)
  let len = tailWidth * this.swallowTailFactor
  let swallowTailPnt = PlotUtils.getThirdPoint(points[1], points[0], 0, len, true)
  return [tailLeft, swallowTailPnt, tailRight]
}
