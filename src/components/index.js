import Button from './button'
import RecognizeShow from './recognizeshow'
import Hikleaflet from './hikleaflet'
import './index.css'
const components = {
  Button,
  RecognizeShow,
  Hikleaflet
}

const install = function (Vue) {
  if (install.installed) return
  Object.keys(components).forEach(key => {
    console.log(components[key].name, components[key])
    Vue.component(components[key].name, components[key])
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  Button,
  RecognizeShow,
  Hikleaflet
}
