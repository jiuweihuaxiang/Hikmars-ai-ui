/* =================================================
@功能: 实现进攻方向带尾的标绘类
@作者：李永强
@创建时间:2020-2-24
@修改记录：
================================================== */
import {PlotUtils} from '../hikleaflet-plotUtils.js'
import {PlotTypes, Inherits} from '../hikleaflet-plotPublic'
import {AttackArrow} from './AttackArrow'
export let TailedAttackArrow = function (points) {
  this.type = PlotTypes.TAILED_ATTACK_ARROW
  this.headHeightFactor = 0.18
  this.headWidthFactor = 0.3
  this.neckHeightFactor = 0.85
  this.neckWidthFactor = 0.15
  this.tailWidthFactor = 0.1
  this.headTailFactor = 0.8
  this.swallowTailFactor = 1
  this.swallowTailPnt = null
  this.setPoints(points)
}

Inherits(TailedAttackArrow, AttackArrow)

TailedAttackArrow.prototype.generate = function () {
  let count1 = this.getPointCount()
  if (count1 < 2) {
    return
  }
  if (this.getPointCount() === 2) {
    return [this.points]
  }
  let pnts = this.getPoints()
  let tailLeft = pnts[0]
  let tailRight = pnts[1]
  if (PlotUtils.isClockWise(pnts[0], pnts[1], pnts[2])) {
    tailLeft = pnts[1]
    tailRight = pnts[0]
  }
  let midTail = PlotUtils.mid(tailLeft, tailRight)
  let bonePnts = [midTail].concat(pnts.slice(2))
  let headPnts = this.getArrowHeadPoints(bonePnts, tailLeft, tailRight)
  let neckLeft = headPnts[0]
  let neckRight = headPnts[4]
  let tailWidth = PlotUtils.distance(tailLeft, tailRight)
  let allLen = PlotUtils.getBaseLength(bonePnts)
  let len = allLen * this.tailWidthFactor * this.swallowTailFactor
  this.swallowTailPnt = PlotUtils.getThirdPoint(bonePnts[1], bonePnts[0], 0, len, true)
  let factor = tailWidth / allLen
  let bodyPnts = this.getArrowBodyPoints(bonePnts, neckLeft, neckRight, factor)
  let count = bodyPnts.length
  let leftPnts = [tailLeft].concat(bodyPnts.slice(0, count / 2))
  leftPnts.push(neckLeft)
  let rightPnts = [tailRight].concat(bodyPnts.slice(count / 2, count))
  rightPnts.push(neckRight)

  leftPnts = PlotUtils.getQBSplinePoints(leftPnts)
  rightPnts = PlotUtils.getQBSplinePoints(rightPnts)
  return [leftPnts.concat(headPnts, rightPnts.reverse(), [this.swallowTailPnt, leftPnts[0]])]
}
