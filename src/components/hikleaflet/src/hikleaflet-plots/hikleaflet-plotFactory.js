/* =================================================
@功能: 实现标绘的工厂类
@作者：李永强
@创建时间:2020-2-23
@修改记录：
================================================== */
import L from 'leaflet'
import {PlotTypes} from './hikleaflet-plotPublic'
import {AttackArrow} from './hikleaflet-graph/AttackArrow'
import {ClosedCurve} from './hikleaflet-graph/ClosedCurve'
import {Curve} from './hikleaflet-graph/Curve'
import {DoubleArrow} from './hikleaflet-graph/DoubleArrow'
import {FineArrow} from './hikleaflet-graph/FineArrow'
import {GatheringPlace} from './hikleaflet-graph/GatheringPlace'
import {Sector} from './hikleaflet-graph/Sector'
import {SquadCombat} from './hikleaflet-graph/SquadCombat'
import {StraightArrow} from './hikleaflet-graph/StraightArrow'
import {TailedAttackArrow} from './hikleaflet-graph/TailedAttackArrow'
import {TailedSquadCombat} from './hikleaflet-graph/TailedSquadCombat'
export let PlotFactory = {}

PlotFactory.createPoint = function (point, map) {
  let circle = L.circleMarker(point, {radius: 5}).addTo(map)
  return circle
}

/**
 * 绘制标绘的方法
 * @param {Plot} plotObj
 * @param {Object} map
 * @returns {polygon}
 */
PlotFactory.drawPolygon = function (plotObj, map) {
  let points = plotObj.generate()
  let polygon = L.polygon(points, {color: 'red'}).addTo(map)
  return polygon
}
/**
 * 创建标绘的对象
 * @param {PlotType} type标绘的类型
 * @param {Object} map
 * @returns {Plot}  Plot对象
 */
PlotFactory.createPlot = function (type, points) {
  switch (type) {
    case PlotTypes.CURVE:
      return new Curve(points)
    case PlotTypes.CLOSED_CURVE:
      return new ClosedCurve(points)
    case PlotTypes.SECTOR:
      return new Sector(points)
    case PlotTypes.GATHERING_PLACE:
      return new GatheringPlace(points)
    case PlotTypes.STRAIGHT_ARROW:
      return new StraightArrow(points)
    case PlotTypes.ATTACK_ARROW:
      return new AttackArrow(points)
    case PlotTypes.FINE_ARROW:
      return new FineArrow(points)
    case PlotTypes.DOUBLE_ARROW:
      return new DoubleArrow(points)
    case PlotTypes.TAILED_ATTACK_ARROW:
      return new TailedAttackArrow(points)
    case PlotTypes.SQUAD_COMBAT:
      return new SquadCombat(points)
    case PlotTypes.TAILED_SQUAD_COMBAT:
      return new TailedSquadCombat(points)
  }
  return null
}
