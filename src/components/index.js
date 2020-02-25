import Button from './button'
import './index.css'
import RecognitonVisualize from './recognition-visualize'

const components = {
  Button,
  RecognitonVisualize
}

const install = function (Vue) {
  if (install.installed) return
  Object.keys(components).forEach(key => {
    Vue.component(components[key].name, components[key])
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  Button,
  RecognitonVisualize
}
