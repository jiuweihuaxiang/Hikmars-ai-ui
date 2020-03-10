/* =================================================
@功能  坐标转换和距离计算接口
@作者 ：李永强
@创建时间:2020-2-16
@修改记录：
================================================== */
let VincentyConstants = {
  a: 6378137,
  b: 6356752.3142,
  f: 1 / 298.257223563,
  EARTH_RADIUS: 6371,
  PI: 3.1415926
}
function rad (d) {
  return d * Math.PI / 180.0
}
function deg (x) {
  return x * 180 / Math.PI
}
/**
 * 从一点出发，根据距离和方向计算终点的经纬度坐标
 * @param {Array} srcLatLng 源经纬度坐标
 * @param {float} dist 距离
 * @param {float} brng 角度
 * @returns {Array}
 */
function distanceAngleToLatLng (srcLatLng, dist, brng) {
  let latCoord = srcLatLng[0]
  let lonCoord = srcLatLng[1]
  let ct = VincentyConstants
  let a = ct.a
  let b = ct.b
  let f = ct.f
  let lon1 = lonCoord
  let lat1 = latCoord
  let s = dist
  let alpha1 = rad(brng)
  let sinAlpha1 = Math.sin(alpha1)
  let cosAlpha1 = Math.cos(alpha1)
  let tanU1 = (1 - f) * Math.tan(rad(lat1))
  let cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1))
  let sinU1 = tanU1 * cosU1
  let sigma1 = Math.atan2(tanU1, cosAlpha1)
  let sinAlpha = cosU1 * sinAlpha1
  let cosSqAlpha = 1 - sinAlpha * sinAlpha
  let uSq = cosSqAlpha * (a * a - b * b) / (b * b)
  let A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)))
  let B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)))

  let sigma = s / (b * A)
  let sigmaP = 2 * Math.PI
  while (Math.abs(sigma - sigmaP) > 1e-12) {
    var cos2SigmaM = Math.cos(2 * sigma1 + sigma)
    var sinSigma = Math.sin(sigma)
    var cosSigma = Math.cos(sigma)
    let deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
          B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)))
    sigmaP = sigma
    sigma = s / (b * A) + deltaSigma
  }

  let tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1
  let lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
    (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp))
  let lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1)
  let C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha))
  let L = lambda - (1 - C) * f * sinAlpha *
      (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)))

  // let revAz = Math.atan2(sinAlpha, -tmp) // final bearing
  let loncoord = parseFloat((lon1 + deg(L)).toFixed(6))
  let latcoord = parseFloat((deg(lat2)).toFixed(6))
  return [loncoord, latcoord]
}

/**
 *将二维坐标的x值映射到经度值
 * @param {float} lng
 * @param {float} xValue
 * @returns 经度值
 */
function getLon (lng, xValue) {
  let x = xValue / 1000
  // let x=x;
  let theta = 180 * x / Math.PI / VincentyConstants.EARTH_RADIUS
  let lon1 = lng + theta
  lon1 = (parseFloat(lon1).toFixed(5)) - 0
  return lon1
}
/**
 *将二维坐标的y值映射到纬度值
 * @param {float} lat
 * @param {float} y
 * @returns 
 */
function getLat (lat, yValue) {
  let y = yValue / 1000
  let theta = 180 * y / Math.PI / VincentyConstants.EARTH_RADIUS
  let lat1 = lat + theta
  lat1 = (parseFloat(lat1).toFixed(5)) - 0
  return lat1
}

/**
 *直角坐标转经纬度坐标
 * @param {Array} srcLatLng [lat,lng]
 * @param {Array} cartesianCoord [x,y]
 * @returns {Array}
 */
function cartesianToLonLat (srcLatLng, cartesianCoord) {
  let lon = getLon(srcLatLng[1], cartesianCoord[0])
  let lat = getLat(srcLatLng[0], cartesianCoord[1])
  return [lat, lon]
}
/**
 *计算经纬度间的距离
 * @param {Array} srcLatLng [lat,lon]
 * @param {Array} destLatLng
 * @param {number} s 
 */
function getCoordDIstance (srcLatLng, destLatLng) {
  let lng1 = srcLatLng[1]
  let lat1 = srcLatLng[0]
  let lng2 = destLatLng[1]
  let lat2 = destLatLng[0]
  var radLat1 = lat1 * Math.PI / 180.0
  var radLat2 = lat2 * Math.PI / 180.0
  var a = radLat1 - radLat2
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
  s = s * 6378.137 // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000
  return s
}

export default {distanceAngleToLatLng, cartesianToLonLat, getCoordDIstance}
