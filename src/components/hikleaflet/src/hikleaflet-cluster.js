/* =================================================
@功能 : 聚类增删和聚类层的添加
@作者 ：李永强
@创建时间:2020-2-19
@修改记录:
================================================== */
import L from 'leaflet'
let __extends = (this && this.__extends) || (function () {
  let extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { Object.setPrototypeOf(d, b) }) ||
        function (d, b) { for (let p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p] }
  return function (d, b) {
    extendStatics(d, b)
    function __ () { this.constructor = d }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __())
  }
})()
let PruneCluster;
(function (PruneCluster1) {
  let Point = (function () {
    function Point () {
    }
    return Point
  }())
  PruneCluster1.Point = Point
  let ClusterObject = (function () {
    function ClusterObject () {
    }
    return ClusterObject
  }())
  PruneCluster1.ClusterObject = ClusterObject
  let hashCodeCounter = 1
  let maxHashCodeValue = Math.pow(2, 53) - 1
  let Marker = (function (_super) {
    __extends(Marker, _super)
    function Marker (lat, lng, data, category, weight, filtered) {
      if (data === void 0) { data = {} }
      if (weight === void 0) { weight = 1 }
      if (filtered === void 0) { filtered = false }
      let _this = _super.call(this) || this
      _this.data = data
      _this.position = { lat: +lat, lng: +lng }
      _this.weight = weight
      _this.category = category
      _this.filtered = filtered
      _this.hashCode = hashCodeCounter++
      return _this
    }
    Marker.prototype.Move = function (lat, lng) {
      this.position.lat = +lat
      this.position.lng = +lng
    }
    Marker.prototype.SetData = function (data) {
      for (let key in data) {
        this.data[key] = data[key]
      }
    }
    return Marker
  }(ClusterObject))
  PruneCluster1.Marker = Marker
  let Cluster = (function (_super) {
    __extends(Cluster, _super)
    function Cluster (marker) {
      let _this = _super.call(this) || this
      _this.stats = [0, 0, 0, 0, 0, 0, 0, 0]
      _this.data = {}
      if (!marker) {
        _this.hashCode = 1
        if (Cluster.ENABLE_MARKERS_LIST) {
          _this._clusterMarkers = []
        }
        return _this
      }
      if (Cluster.ENABLE_MARKERS_LIST) {
        _this._clusterMarkers = [marker]
      }
      _this.lastMarker = marker
      _this.hashCode = 31 + marker.hashCode
      _this.population = 1
      if (marker.category !== undefined) {
        _this.stats[marker.category] = 1
      }
      _this.totalWeight = marker.weight
      _this.position = {
        lat: marker.position.lat,
        lng: marker.position.lng
      }
      _this.averagePosition = {
        lat: marker.position.lat,
        lng: marker.position.lng
      }
      return _this
    }
    Cluster.prototype.AddMarker = function (marker) {
      if (Cluster.ENABLE_MARKERS_LIST) {
        this._clusterMarkers.push(marker)
      }
      let h = this.hashCode
      h = ((h << 5) - h) + marker.hashCode
      if (h >= maxHashCodeValue) {
        this.hashCode = h % maxHashCodeValue
      } else {
        this.hashCode = h
      }
      this.lastMarker = marker
      let weight = marker.weight
      let currentTotalWeight = this.totalWeight
      let newWeight = weight + currentTotalWeight
      this.averagePosition.lat =
                (this.averagePosition.lat * currentTotalWeight +
                    marker.position.lat * weight) / newWeight
      this.averagePosition.lng =
                (this.averagePosition.lng * currentTotalWeight +
                    marker.position.lng * weight) / newWeight
      ++this.population
      this.totalWeight = newWeight
      if (marker.category !== undefined) {
        this.stats[marker.category] = (this.stats[marker.category] + 1) || 1
      }
    }
    Cluster.prototype.Reset = function () {
      this.hashCode = 1
      this.lastMarker = undefined
      this.population = 0
      this.totalWeight = 0
      this.stats = [0, 0, 0, 0, 0, 0, 0, 0]
      if (Cluster.ENABLE_MARKERS_LIST) {
        this._clusterMarkers = []
      }
    }
    Cluster.prototype.ComputeBounds = function (cluster) {
      let proj = cluster.Project(this.position.lat, this.position.lng)
      let size = cluster.Size
      let nbX = Math.floor(proj.x / size)
      let nbY = Math.floor(proj.y / size)
      let startX = nbX * size
      let startY = nbY * size
      let a = cluster.UnProject(startX, startY)
      let b = cluster.UnProject(startX + size, startY + size)
      this.bounds = {
        minLat: b.lat,
        maxLat: a.lat,
        minLng: a.lng,
        maxLng: b.lng
      }
    }
    Cluster.prototype.GetClusterMarkers = function () {
      return this._clusterMarkers
    }
    Cluster.prototype.ApplyCluster = function (newCluster) {
      this.hashCode = this.hashCode * 41 + newCluster.hashCode * 43
      if (this.hashCode > maxHashCodeValue) {
        this.hashCode = this.hashCode = maxHashCodeValue
      }
      let weight = newCluster.totalWeight
      let currentTotalWeight = this.totalWeight
      let newWeight = weight + currentTotalWeight
      this.averagePosition.lat =
                (this.averagePosition.lat * currentTotalWeight +
                    newCluster.averagePosition.lat * weight) / newWeight
      this.averagePosition.lng =
                (this.averagePosition.lng * currentTotalWeight +
                    newCluster.averagePosition.lng * weight) / newWeight
      this.population += newCluster.population
      this.totalWeight = newWeight
      this.bounds.minLat = Math.min(this.bounds.minLat, newCluster.bounds.minLat)
      this.bounds.minLng = Math.min(this.bounds.minLng, newCluster.bounds.minLng)
      this.bounds.maxLat = Math.max(this.bounds.maxLat, newCluster.bounds.maxLat)
      this.bounds.maxLng = Math.max(this.bounds.maxLng, newCluster.bounds.maxLng)
      for (let category in newCluster.stats) {
        if (Object.prototype.hasOwnProperty.call(newCluster.stats, category)) {
          if (Object.prototype.hasOwnProperty.call(this.stats, category)) {
            this.stats[category] += newCluster.stats[category]
          } else {
            this.stats[category] = newCluster.stats[category]
          }
        }
      }
      if (Cluster.ENABLE_MARKERS_LIST) {
        this._clusterMarkers = this._clusterMarkers.concat(newCluster.GetClusterMarkers())
      }
    }
    Cluster.ENABLE_MARKERS_LIST = false
    return Cluster
  }(ClusterObject))
  PruneCluster1.Cluster = Cluster
  function checkPositionInsideBounds (a, b) {
    return (a.lat >= b.minLat && a.lat <= b.maxLat) &&
            a.lng >= b.minLng && a.lng <= b.maxLng
  }
  function insertionSort (list) {
    for (let i = 1, j, tmp, tmpLng, length = list.length; i < length; ++i) {
      tmp = list[i]
      tmpLng = tmp.position.lng
      for (j = i - 1; j >= 0 && list[j].position.lng > tmpLng; --j) {
        list[j + 1] = list[j]
      }
      list[j + 1] = tmp
    }
  }
  function shouldUseInsertionSort (total, nbChanges) {
    if (nbChanges > 300) {
      return false
    } else {
      return (nbChanges / total) < 0.2
    }
  }
  let PruneCluster = (function () {
    function PruneCluster () {
      this._markers = []
      this._nbChanges = 0
      this._clusters = []
      this.Size = 166
      this.ViewPadding = 0.2
    }
    PruneCluster.prototype.RegisterMarker = function (marker) {
      if (marker._removeFlag) {
        delete marker._removeFlag
      }
      this._markers.push(marker)
      this._nbChanges += 1
    }
    PruneCluster.prototype.RegisterMarkers = function (markers) {
      let _this = this
      markers.forEach(function (marker) {
        _this.RegisterMarker(marker)
      })
    }
    PruneCluster.prototype._sortMarkers = function () {
      let markers = this._markers
      let length = markers.length
      if (this._nbChanges && !shouldUseInsertionSort(length, this._nbChanges)) {
        this._markers.sort(function (a, b) { return a.position.lng - b.position.lng })
      } else {
        insertionSort(markers)
      }
      this._nbChanges = 0
    }
    PruneCluster.prototype._sortClusters = function () {
      insertionSort(this._clusters)
    }
    PruneCluster.prototype._indexLowerBoundLng = function (lng) {
      let markers = this._markers
      let it = 0
      let step = 0
      let first = 0
      let count = markers.length
      while (count > 0) {
        step = Math.floor(count / 2)
        it = first + step
        if (markers[it].position.lng < lng) {
          first = ++it
          count -= step + 1
        } else {
          count = step
        }
      }
      return first
    }
    PruneCluster.prototype._resetClusterViews = function () {
      for (let i = 0, l = this._clusters.length; i < l; ++i) {
        let cluster = this._clusters[i]
        cluster.Reset()
        cluster.ComputeBounds(this)
      }
    }
    PruneCluster.prototype.ProcessView = function (bounds) {
      let heightBuffer = Math.abs(bounds.maxLat - bounds.minLat) * this.ViewPadding
      let widthBuffer = Math.abs(bounds.maxLng - bounds.minLng) * this.ViewPadding
      let extendedBounds = {
        minLat: bounds.minLat - heightBuffer - heightBuffer,
        maxLat: bounds.maxLat + heightBuffer + heightBuffer,
        minLng: bounds.minLng - widthBuffer - widthBuffer,
        maxLng: bounds.maxLng + widthBuffer + widthBuffer
      }
      this._sortMarkers()
      this._resetClusterViews()
      let firstIndex = this._indexLowerBoundLng(extendedBounds.minLng)
      let markers = this._markers
      let clusters = this._clusters
      let workingClusterList = clusters.slice(0)
      for (let i = firstIndex, l = markers.length; i < l; ++i) {
        let marker = markers[i]
        let markerPosition = marker.position
        if (markerPosition.lng > extendedBounds.maxLng) {
          break
        }
        if (markerPosition.lat > extendedBounds.minLat &&
                    markerPosition.lat < extendedBounds.maxLat &&
                    !marker.filtered) {
          let clusterFound = false
          let cluster
          for (let j = 0, ll = workingClusterList.length; j < ll; ++j) {
            cluster = workingClusterList[j]
            if (cluster.bounds.maxLng < marker.position.lng) {
              workingClusterList.splice(j, 1)
              --j
              --ll
              continue
            }
            if (checkPositionInsideBounds(markerPosition, cluster.bounds)) {
              cluster.AddMarker(marker)
              clusterFound = true
              break
            }
          }
          if (!clusterFound) {
            cluster = new Cluster(marker)
            cluster.ComputeBounds(this)
            clusters.push(cluster)
            workingClusterList.push(cluster)
          }
        }
      }
      let newClustersList = []
      for (let i = 0, l = clusters.length; i < l; ++i) {
        let cluster = clusters[i]
        if (cluster.population > 0) {
          newClustersList.push(cluster)
        }
      }
      this._clusters = newClustersList
      this._sortClusters()
      return this._clusters
    }
    PruneCluster.prototype.RemoveMarkers = function (markers) {
      if (!markers) {
        this._markers = []
        return
      }
      for (let i = 0, l = markers.length; i < l; ++i) {
        markers[i]._removeFlag = true
      }
      let newMarkersList = []
      for (let i = 0, l = this._markers.length; i < l; ++i) {
        if (!this._markers[i]._removeFlag) {
          newMarkersList.push(this._markers[i])
        } else {
          delete this._markers[i]._removeFlag
        }
      }
      this._markers = newMarkersList
    }
    PruneCluster.prototype.FindMarkersInArea = function (area) {
      let aMinLat = area.minLat
      let aMaxLat = area.maxLat
      let aMinLng = area.minLng
      let aMaxLng = area.maxLng
      let markers = this._markers
      let result = []
      let firstIndex = this._indexLowerBoundLng(aMinLng)
      for (let i = firstIndex, l = markers.length; i < l; ++i) {
        let pos = markers[i].position
        if (pos.lng > aMaxLng) {
          break
        }
        if (pos.lat >= aMinLat && pos.lat <= aMaxLat &&
                    pos.lng >= aMinLng) {
          result.push(markers[i])
        }
      }
      return result
    }
    PruneCluster.prototype.ComputeBounds = function (markers, withFiltered) {
      if (withFiltered === void 0) { withFiltered = true }
      if (!markers || !markers.length) {
        return null
      }
      let rMinLat = Number.MAX_VALUE
      let rMaxLat = -Number.MAX_VALUE
      let rMinLng = Number.MAX_VALUE
      let rMaxLng = -Number.MAX_VALUE
      for (let i = 0, l = markers.length; i < l; ++i) {
        if (!withFiltered && markers[i].filtered) {
          continue
        }
        let pos = markers[i].position
        if (pos.lat < rMinLat) { rMinLat = pos.lat }
        if (pos.lat > rMaxLat) { rMaxLat = pos.lat }
        if (pos.lng < rMinLng) { rMinLng = pos.lng }
        if (pos.lng > rMaxLng) { rMaxLng = pos.lng }
      }
      return {
        minLat: rMinLat,
        maxLat: rMaxLat,
        minLng: rMinLng,
        maxLng: rMaxLng
      }
    }
    PruneCluster.prototype.FindMarkersBoundsInArea = function (area) {
      return this.ComputeBounds(this.FindMarkersInArea(area))
    }
    PruneCluster.prototype.ComputeGlobalBounds = function (withFiltered) {
      if (withFiltered === void 0) { withFiltered = true }
      return this.ComputeBounds(this._markers, withFiltered)
    }
    PruneCluster.prototype.GetMarkers = function () {
      return this._markers
    }
    PruneCluster.prototype.GetPopulation = function () {
      return this._markers.length
    }
    PruneCluster.prototype.ResetClusters = function () {
      this._clusters = []
    }
    return PruneCluster
  }())
  PruneCluster1.PruneCluster = PruneCluster
})(PruneCluster || (PruneCluster = {}))
// let PruneCluster
// (function (PruneCluster) {
// })(PruneCluster || (PruneCluster = {}));
let PruneClusterForLeaflet = (L.Layer ? L.Layer : L.Class).extend({
  initialize: function (size, clusterMargin) {
    let _this = this
    if (size === void 0) { size = 120 }
    if (clusterMargin === void 0) { clusterMargin = 20 }
    this.Cluster = new PruneCluster.PruneCluster()
    this.Cluster.Size = size
    this.clusterMargin = Math.min(clusterMargin, size / 4)
    this.Cluster.Project = function (lat, lng) {
      return _this._map.project(new L.LatLng(lat, lng), Math.floor(_this._map.getZoom()))
    }
    this.Cluster.UnProject = function (x, y) {
      return _this._map.unproject(new L.Point(x, y), Math.floor(_this._map.getZoom()))
    }
    this._objectsOnMap = []
    this.spiderfier = new PruneClusterLeafletSpiderfier(this)
    this._hardMove = false
    this._resetIcons = false
    this._removeTimeoutId = 0
    this._markersRemoveListTimeout = []
  },
  RegisterMarker: function (marker) {
    this.Cluster.RegisterMarker(marker)
  },
  RegisterMarkers: function (markers) {
    this.Cluster.RegisterMarkers(markers)
  },
  RemoveMarkers: function (markers) {
    this.Cluster.RemoveMarkers(markers)
  },
  BuildLeafletCluster: function (cluster, position) {
    let _this = this
    let m = new L.Marker(position, {
      icon: this.BuildLeafletClusterIcon(cluster)
    })
    m._leafletClusterBounds = cluster.bounds
    m.on('click', function () {
      let cbounds = m._leafletClusterBounds
      let markersArea = _this.Cluster.FindMarkersInArea(cbounds)
      let b = _this.Cluster.ComputeBounds(markersArea)
      if (b) {
        let bounds = new L.LatLngBounds(new L.LatLng(b.minLat, b.maxLng), new L.LatLng(b.maxLat, b.minLng))
        let zoomLevelBefore = _this._map.getZoom()
        let zoomLevelAfter = _this._map.getBoundsZoom(bounds, false, new L.Point(20, 20))
        if (zoomLevelAfter === zoomLevelBefore) {
          let filteredBounds = []
          for (let i = 0, l = _this._objectsOnMap.length; i < l; ++i) {
            let o = _this._objectsOnMap[i]
            if (o.data._leafletMarker !== m) {
              if (o.bounds.minLat >= cbounds.minLat &&
                                o.bounds.maxLat <= cbounds.maxLat &&
                                o.bounds.minLng >= cbounds.minLng &&
                                o.bounds.maxLng <= cbounds.maxLng) {
                filteredBounds.push(o.bounds)
              }
            }
          }
          if (filteredBounds.length > 0) {
            let newMarkersArea = []
            let ll = filteredBounds.length
            for (let i = 0, l = markersArea.length; i < l; ++i) {
              let markerPos = markersArea[i].position
              let isFiltered = false
              for (let j = 0; j < ll; ++j) {
                let currentFilteredBounds = filteredBounds[j]
                if (markerPos.lat >= currentFilteredBounds.minLat &&
                                    markerPos.lat <= currentFilteredBounds.maxLat &&
                                    markerPos.lng >= currentFilteredBounds.minLng &&
                                    markerPos.lng <= currentFilteredBounds.maxLng) {
                  isFiltered = true
                  break
                }
              }
              if (!isFiltered) {
                newMarkersArea.push(markersArea[i])
              }
            }
            markersArea = newMarkersArea
          }
          if (markersArea.length < 200 || zoomLevelAfter >= _this._map.getMaxZoom()) {
            _this._map.fire('overlappingmarkers', {
              cluster: _this,
              markers: markersArea,
              center: m.getLatLng(),
              marker: m
            })
          } else {
            zoomLevelAfter++
          }
          _this._map.setView(m.getLatLng(), zoomLevelAfter)
        } else {
          _this._map.fitBounds(bounds)
        }
      }
    })
    return m
  },
  BuildLeafletClusterIcon: function (cluster) {
    let c = 'prunecluster prunecluster-'
    let iconSize = 38
    let maxPopulation = this.Cluster.GetPopulation()
    if (cluster.population < Math.max(10, maxPopulation * 0.01)) {
      c += 'small'
    } else if (cluster.population < Math.max(100, maxPopulation * 0.05)) {
      c += 'medium'
      iconSize = 40
    } else {
      c += 'large'
      iconSize = 44
    }
    return new L.DivIcon({
      html: '<div><span>' + cluster.population + '</span></div>',
      className: c,
      iconSize: L.point(iconSize, iconSize)
    })
  },
  BuildLeafletMarker: function (marker, position) {
    let m = new L.Marker(position)
    this.PrepareLeafletMarker(m, marker.data, marker.category)
    return m
  },
  PrepareLeafletMarker: function (marker, data, category) {
    if (data.icon) {
      if (typeof data.icon === 'function') {
        marker.setIcon(data.icon(data, category))
      } else {
        marker.setIcon(data.icon)
      }
    }
    if (data.popup) {
      let content = typeof data.popup === 'function' ? data.popup(data, category) : data.popup
      if (marker.getPopup()) {
        marker.setPopupContent(content, data.popupOptions)
      } else {
        marker.bindPopup(content, data.popupOptions)
      }
    }
  },
  onAdd: function (map) {
    this._map = map
    map.on('movestart', this._moveStart, this)
    map.on('moveend', this._moveEnd, this)
    map.on('zoomend', this._zoomStart, this)
    map.on('zoomend', this._zoomEnd, this)
    this.ProcessView()
    map.addLayer(this.spiderfier)
  },
  onRemove: function (map) {
    map.off('movestart', this._moveStart, this)
    map.off('moveend', this._moveEnd, this)
    map.off('zoomend', this._zoomStart, this)
    map.off('zoomend', this._zoomEnd, this)
    for (let i = 0, l = this._objectsOnMap.length; i < l; ++i) {
      map.removeLayer(this._objectsOnMap[i].data._leafletMarker)
    }
    this._objectsOnMap = []
    this.Cluster.ResetClusters()
    map.removeLayer(this.spiderfier)
    this._map = null
  },
  _moveStart: function () {
    this._moveInProgress = true
  },
  _moveEnd: function (e) {
    this._moveInProgress = false
    this._hardMove = e.hard
    this.ProcessView()
  },
  _zoomStart: function () {
    this._zoomInProgress = true
  },
  _zoomEnd: function () {
    this._zoomInProgress = false
    this.ProcessView()
  },
  ProcessView: function () {
    let _this = this
    if (!this._map || this._zoomInProgress || this._moveInProgress) {
      return
    }
    let map = this._map
    let bounds = map.getBounds()
    let zoom = Math.floor(map.getZoom())
    let marginRatio = this.clusterMargin / this.Cluster.Size
    let resetIcons = this._resetIcons
    let southWest = bounds.getSouthWest()
    let northEast = bounds.getNorthEast()
    let clusters = this.Cluster.ProcessView({
      minLat: southWest.lat,
      minLng: southWest.lng,
      maxLat: northEast.lat,
      maxLng: northEast.lng
    })
    let objectsOnMap = this._objectsOnMap
    let newObjectsOnMap = []
    let markersOnMap = new Array(objectsOnMap.length)
    for (let i = 0, l = objectsOnMap.length; i < l; ++i) {
      let marker = objectsOnMap[i].data._leafletMarker
      markersOnMap[i] = marker
      marker._removeFromMap = true
    }
    let clusterCreationList = []
    let clusterCreationListPopOne = []
    let opacityUpdateList = []
    let workingList = []
    for (let i = 0, l = clusters.length; i < l; ++i) {
      let icluster = clusters[i]
      let iclusterData = icluster.data
      let latMargin = (icluster.bounds.maxLat - icluster.bounds.minLat) * marginRatio
      let lngMargin = (icluster.bounds.maxLng - icluster.bounds.minLng) * marginRatio
      for (let j = 0, ll = workingList.length; j < ll; ++j) {
        let c = workingList[j]
        if (c.bounds.maxLng < icluster.bounds.minLng) {
          workingList.splice(j, 1)
          --j
          --ll
          continue
        }
        let oldMaxLng = c.averagePosition.lng + lngMargin
        let oldMinLat = c.averagePosition.lat - latMargin
        let oldMaxLat = c.averagePosition.lat + latMargin
        let newMinLng = icluster.averagePosition.lng - lngMargin
        let newMinLat = icluster.averagePosition.lat - latMargin
        let newMaxLat = icluster.averagePosition.lat + latMargin
        if (oldMaxLng > newMinLng && oldMaxLat > newMinLat && oldMinLat < newMaxLat) {
          iclusterData._leafletCollision = true
          c.ApplyCluster(icluster)
          break
        }
      }
      if (!iclusterData._leafletCollision) {
        workingList.push(icluster)
      }
    }
    clusters.forEach(function (cluster) {
      let m
      let data = cluster.data
      if (data._leafletCollision) {
        data._leafletCollision = false
        data._leafletOldPopulation = 0
        data._leafletOldHashCode = 0
        return
      }
      let position = new L.LatLng(cluster.averagePosition.lat, cluster.averagePosition.lng)
      let oldMarker = data._leafletMarker
      if (oldMarker) {
        if (cluster.population === 1 && data._leafletOldPopulation === 1 && cluster.hashCode === oldMarker._hashCode) {
          if (resetIcons || oldMarker._zoomLevel !== zoom || cluster.lastMarker.data.forceIconRedraw) {
            _this.PrepareLeafletMarker(oldMarker, cluster.lastMarker.data, cluster.lastMarker.category)
            if (cluster.lastMarker.data.forceIconRedraw) {
              cluster.lastMarker.data.forceIconRedraw = false
            }
          }
          oldMarker.setLatLng(position)
          m = oldMarker
        } else if (cluster.population > 1 && data._leafletOldPopulation > 1 && (oldMarker._zoomLevel === zoom ||
                    data._leafletPosition.equals(position))) {
          oldMarker.setLatLng(position)
          if (resetIcons || cluster.population !== data._leafletOldPopulation ||
                        cluster.hashCode !== data._leafletOldHashCode) {
            let boundsCopy = {}
            L.Util.extend(boundsCopy, cluster.bounds)
            oldMarker._leafletClusterBounds = boundsCopy
            oldMarker.setIcon(_this.BuildLeafletClusterIcon(cluster))
          }
          data._leafletOldPopulation = cluster.population
          data._leafletOldHashCode = cluster.hashCode
          m = oldMarker
        }
      }
      if (!m) {
        if (cluster.population === 1) {
          clusterCreationListPopOne.push(cluster)
        } else {
          clusterCreationList.push(cluster)
        }
        data._leafletPosition = position
        data._leafletOldPopulation = cluster.population
        data._leafletOldHashCode = cluster.hashCode
      } else {
        m._removeFromMap = false
        newObjectsOnMap.push(cluster)
        m._zoomLevel = zoom
        m._hashCode = cluster.hashCode
        m._population = cluster.population
        data._leafletMarker = m
        data._leafletPosition = position
      }
    })
    clusterCreationList = clusterCreationListPopOne.concat(clusterCreationList)
    for (let i = 0, l = objectsOnMap.length; i < l; ++i) {
      let icluster = objectsOnMap[i]
      let idata = icluster.data
      let marker = idata._leafletMarker
      if (idata._leafletMarker._removeFromMap) {
        let remove = true
        if (marker._zoomLevel === zoom) {
          let pa = icluster.averagePosition
          let latMargin = (icluster.bounds.maxLat - icluster.bounds.minLat) * marginRatio
          let lngMargin = (icluster.bounds.maxLng - icluster.bounds.minLng) * marginRatio
          for (let j = 0, ll = clusterCreationList.length; j < ll; ++j) {
            let jcluster = clusterCreationList[j]
            let jdata = jcluster.data
            if (marker._population === 1 && jcluster.population === 1 &&
                            marker._hashCode === jcluster.hashCode) {
              if (resetIcons || jcluster.lastMarker.data.forceIconRedraw) {
                this.PrepareLeafletMarker(marker, jcluster.lastMarker.data, jcluster.lastMarker.category)
                if (jcluster.lastMarker.data.forceIconRedraw) {
                  jcluster.lastMarker.data.forceIconRedraw = false
                }
              }
              marker.setLatLng(jdata._leafletPosition)
              remove = false
            } else {
              let pb = jcluster.averagePosition
              let oldMinLng = pa.lng - lngMargin
              let newMaxLng = pb.lng + lngMargin
              let oldMaxLng = pa.lng + lngMargin
              let oldMinLat = pa.lat - latMargin
              let oldMaxLat = pa.lat + latMargin
              let newMinLng = pb.lng - lngMargin
              let newMinLat = pb.lat - latMargin
              let newMaxLat = pb.lat + latMargin
              if ((marker._population > 1 && jcluster.population > 1) &&
                                (oldMaxLng > newMinLng && oldMinLng < newMaxLng && oldMaxLat > newMinLat && oldMinLat < newMaxLat)) {
                marker.setLatLng(jdata._leafletPosition)
                marker.setIcon(this.BuildLeafletClusterIcon(jcluster))
                let poisson = {}
                L.Util.extend(poisson, jcluster.bounds)
                marker._leafletClusterBounds = poisson
                jdata._leafletOldPopulation = jcluster.population
                jdata._leafletOldHashCode = jcluster.hashCode
                marker._population = jcluster.population
                remove = false
              }
            }
            if (!remove) {
              jdata._leafletMarker = marker
              marker._removeFromMap = false
              newObjectsOnMap.push(jcluster)
              clusterCreationList.splice(j, 1)
              --j
              --ll
              break
            }
          }
        }
        if (remove) {
          if (!marker._removeFromMap) { console.error('wtf') }
        }
      }
    }
    for (let i = 0, l = clusterCreationList.length; i < l; ++i) {
      let icluster = clusterCreationList[i]
      let idata = icluster.data
      let iposition = idata._leafletPosition
      let creationMarker
      if (icluster.population === 1) {
        creationMarker = this.BuildLeafletMarker(icluster.lastMarker, iposition)
      } else {
        creationMarker = this.BuildLeafletCluster(icluster, iposition)
      }
      creationMarker.addTo(map)
      creationMarker.setOpacity(0)
      opacityUpdateList.push(creationMarker)
      idata._leafletMarker = creationMarker
      creationMarker._zoomLevel = zoom
      creationMarker._hashCode = icluster.hashCode
      creationMarker._population = icluster.population
      newObjectsOnMap.push(icluster)
    }
    window.setTimeout(function () {
      for (let i = 0, l = opacityUpdateList.length; i < l; ++i) {
        let m = opacityUpdateList[i]
        if (m._icon) { L.DomUtil.addClass(m._icon, 'prunecluster-anim') }
        if (m._shadow) { L.DomUtil.addClass(m._shadow, 'prunecluster-anim') }
        m.setOpacity(1)
      }
    }, 1)
    if (this._hardMove) {
      for (let i = 0, l = markersOnMap.length; i < l; ++i) {
        let marker = markersOnMap[i]
        if (marker._removeFromMap) {
          map.removeLayer(marker)
        }
      }
    } else {
      if (this._removeTimeoutId !== 0) {
        window.clearTimeout(this._removeTimeoutId)
        for (let i = 0, l = this._markersRemoveListTimeout.length; i < l; ++i) {
          map.removeLayer(this._markersRemoveListTimeout[i])
        }
      }
      let toRemove = []
      for (let i = 0, l = markersOnMap.length; i < l; ++i) {
        let marker = markersOnMap[i]
        if (marker._removeFromMap) {
          marker.setOpacity(0)
          toRemove.push(marker)
        }
      }
      if (toRemove.length > 0) {
        this._removeTimeoutId = window.setTimeout(function () {
          for (let i = 0, l = toRemove.length; i < l; ++i) {
            map.removeLayer(toRemove[i])
          }
          _this._removeTimeoutId = 0
        }, 300)
      }
      this._markersRemoveListTimeout = toRemove
    }
    this._objectsOnMap = newObjectsOnMap
    this._hardMove = false
    this._resetIcons = false
  },
  FitBounds: function (withFiltered) {
    if (withFiltered === void 0) { withFiltered = true }
    let bounds = this.Cluster.ComputeGlobalBounds(withFiltered)
    if (bounds) {
      this._map.fitBounds(new L.LatLngBounds(new L.LatLng(bounds.minLat, bounds.maxLng), new L.LatLng(bounds.maxLat, bounds.minLng)))
    }
  },
  GetMarkers: function () {
    return this.Cluster.GetMarkers()
  },
  RedrawIcons: function (processView) {
    if (processView === void 0) { processView = true }
    this._resetIcons = true
    if (processView) {
      this.ProcessView()
    }
  }
})
let PruneClusterLeafletSpiderfier = (L.Layer ? L.Layer : L.Class).extend({
  doublePI: Math.PI * 2,
  circleFootSeparation: 25,
  circleStartAngle: Math.PI / 6,
  spiralFootSeparation: 28,
  spiralLengthStart: 11,
  spiralLengthFactor: 5,
  spiralCountTrigger: 8,
  spiderfyDistanceMultiplier: 1,
  initialize: function (cluster) {
    this._cluster = cluster
    this._currentMarkers = []
    this._multiLines = !!L.multiPolyline
    this._lines = this._multiLines
      ? L.multiPolyline([], { weight: 1.5, color: '#222' })
      : L.polyline([], { weight: 1.5, color: '#222' })
  },
  onAdd: function (map) {
    this._map = map
    this._map.on('overlappingmarkers', this.Spiderfy, this)
    this._map.on('click', this.Unspiderfy, this)
    this._map.on('zoomend', this.Unspiderfy, this)
  },
  Spiderfy: function (data) {
    let _this = this
    if (data.cluster !== this._cluster) {
      return
    }
    this.Unspiderfy()
    let markers = data.markers.filter(function (marker) {
      return !marker.filtered
    })
    this._currentCenter = data.center
    let centerPoint = this._map.latLngToLayerPoint(data.center)
    let points
    if (markers.length >= this.spiralCountTrigger) {
      points = this._generatePointsSpiral(markers.length, centerPoint)
    } else {
      if (this._multiLines) {
        centerPoint.y += 10
      }
      points = this._generatePointsCircle(markers.length, centerPoint)
    }
    let polylines = []
    let leafletMarkers = []
    let projectedPoints = []
    for (let i = 0, l = points.length; i < l; ++i) {
      let pos = this._map.layerPointToLatLng(points[i])
      let m = this._cluster.BuildLeafletMarker(markers[i], data.center)
      m.setZIndexOffset(5000)
      m.setOpacity(0)
      this._currentMarkers.push(m)
      this._map.addLayer(m)
      leafletMarkers.push(m)
      projectedPoints.push(pos)
    }
    window.setTimeout(function () {
      for (let i = 0, l = points.length; i < l; ++i) {
        leafletMarkers[i].setLatLng(projectedPoints[i])
          .setOpacity(1)
      }
      let startTime = +new Date()
      let interval = 42
      let duration = 290
      let anim = window.setInterval(function () {
        polylines = []
        let now = +new Date()
        let d = now - startTime
        let stepRatio = 0
        if (d >= duration) {
          window.clearInterval(anim)
          stepRatio = 1.0
        } else {
          stepRatio = d / duration
        }
        let center = data.center
        for (let i = 0, l = points.length; i < l; ++i) {
          let p = projectedPoints[i]
          let diffLat = p.lat - center.lat
          let diffLng = p.lng - center.lng
          polylines.push([center, new L.LatLng(center.lat + diffLat * stepRatio, center.lng + diffLng * stepRatio)])
        }
        _this._lines.setLatLngs(polylines)
      }, interval)
    }, 1)
    this._lines.setLatLngs(polylines)
    this._map.addLayer(this._lines)
    if (data.marker) {
      this._clusterMarker = data.marker.setOpacity(0.3)
    }
  },
  _generatePointsCircle: function (count, centerPt) {
    var circumference = this.spiderfyDistanceMultiplier * this.circleFootSeparation * (2 + count)
    let legLength = circumference / this.doublePI
    let angleStep = this.doublePI / count
    let res = []
    let i = 0
    let angle = 0
    res.length = count
    for (i = count - 1; i >= 0; i--) {
      angle = this.circleStartAngle + i * angleStep
      res[i] = new L.Point(Math.round(centerPt.x + legLength * Math.cos(angle)), Math.round(centerPt.y + legLength * Math.sin(angle)))
    }
    return res
  },
  _generatePointsSpiral: function (count, centerPt) {
    let legLength = this.spiderfyDistanceMultiplier * this.spiralLengthStart
    let separation = this.spiderfyDistanceMultiplier * this.spiralFootSeparation
    let lengthFactor = this.spiderfyDistanceMultiplier * this.spiralLengthFactor
    let angle = 0
    let res = []
    let i = 0
    res.length = count
    for (i = count - 1; i >= 0; i--) {
      angle += separation / legLength + i * 0.0005
      res[i] = new L.Point(Math.round(centerPt.x + legLength * Math.cos(angle)), Math.round(centerPt.y + legLength * Math.sin(angle)))
      legLength += this.doublePI * lengthFactor / angle
    }
    return res
  },
  Unspiderfy: function () {
    let _this = this
    for (let i = 0, l = this._currentMarkers.length; i < l; ++i) {
      this._currentMarkers[i].setLatLng(this._currentCenter).setOpacity(0)
    }
    let markers = this._currentMarkers
    window.setTimeout(function () {
      for (let i = 0, l = markers.length; i < l; ++i) {
        _this._map.removeLayer(markers[i])
      }
    }, 300)
    this._currentMarkers = []
    this._map.removeLayer(this._lines)
    if (this._clusterMarker) {
      this._clusterMarker.setOpacity(1)
    }
  },
  onRemove: function (map) {
    this.Unspiderfy()
    map.off('overlappingmarkers', this.Spiderfy, this)
    map.off('click', this.Unspiderfy, this)
    map.off('zoomend', this.Unspiderfy, this)
  }
})

/**
 * 添加图标聚类
 * @param {array} markerLatLngs
 * @param {*} myMap
 */
function addMarkerCluster (markerLatLngs, myMap) {
  let markers = []
  let leafletView = new PruneClusterForLeaflet()
  for (let i = 0; i < markerLatLngs.length; i++) {
    var marker = new PruneCluster.Marker(markerLatLngs[i][0], markerLatLngs[i][1])
    markers.push(marker)
    leafletView.RegisterMarker(marker)
  }
  myMap.addLayer(leafletView)
  return leafletView
}
/**
 * 添加聚类分组组
 * @param {*} clusterGroups
 * @param {*} myMap
 */
function addClusterGroup (clusterGroups, myMap) {
  // clusterGroup = {
  //   markers: [],
  //   groupName: ''
  // }
  let overlays = {}
  for (let i = 0; i < clusterGroups.length; i++) {
    let leafletView = addMarkerCluster(clusterGroups[i].markerLatLngs, myMap)
    overlays[clusterGroups[i].groupName] = leafletView
  }
  L.control.layers(null, overlays).addTo(myMap)
}
/**
 * 设置聚类分组
 * @param {array} markerLatLngs
 * @param {string} groupName
 */
function setClusterGroup (markerLatLngs, groupName) {
  let clusterGroup = {
    markerLatLngs: markerLatLngs,
    groupName: groupName
  }
  return clusterGroup
}
/**
 * 移除聚类
 * @param {PruneClusterForLeaflet} leafletView
 * @param {object} myMap
 */
function removeMarkerCluster (leafletView, myMap) {
  myMap.removeLayer(leafletView)
}
// export default {PruneClusterForLeaflet, PruneCluster}
export default {addMarkerCluster, addClusterGroup, setClusterGroup, removeMarkerCluster}
