import Button from './src/button.vue'
Button.install = function (Vue) {
  console.log(Button)
  Vue.component(Button.name, Button)
}
export default Button
