/* =================================================
@功能: 标绘的公共方法和变量
@作者：李永强
@创建时间:2020-2-22
@修改记录：
================================================== */
/**
 * 定义标绘的类型
 */
export let PlotTypes = {
  CURVE: 'curve',
  CLOSED_CURVE: 'closedcurve',
  SECTOR: 'sector',
  GATHERING_PLACE: 'gatheringplace',
  STRAIGHT_ARROW: 'straightarrow',
  ATTACK_ARROW: 'attackarrow',
  TAILED_ATTACK_ARROW: 'tailedattackarrow',
  SQUAD_COMBAT: 'squadcombat',
  TAILED_SQUAD_COMBAT: 'tailedsquadcombat',
  FINE_ARROW: 'finearrow',
  DOUBLE_ARROW: 'doublearrow'
}
/**
 * 定义常量
 */
export let Constants = {
  TWO_PI: Math.PI * 2,
  HALF_PI: Math.PI / 2,
  FITTING_COUNT: 100,
  ZERO_TOLERANCE: 0.0001
}
/**
 * 实现类的混入
 * @param {class} target
 * @param {class} source
 */
export let Mixin = function (target, source) {
  for (let x in source) {
    target[x] = source[x]
  }
}
/**
 * 实现类的继承
 * @param {class} childCtor
 * @param {class} parentCtor
 */
export let Inherits = function (childCtor, parentCtor) {
  /** @constructor */
  // function tempCtor () {}
  let tempCtor = function () {}
  tempCtor.prototype = parentCtor.prototype
  childCtor.superClass_ = parentCtor.prototype
  // eslint-disable-next-line new-cap
  childCtor.prototype = new tempCtor()
  /** @override */
  childCtor.prototype.constructor = childCtor
  childCtor.base = function (me, methodName) {
    let args = Array.prototype.slice.call(arguments, 2)
    return parentCtor.prototype[methodName].apply(me, args)
  }
}
