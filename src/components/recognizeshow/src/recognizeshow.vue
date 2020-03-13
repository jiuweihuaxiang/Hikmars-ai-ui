<template>
  <div>
    aaaa
    <div>
      {{ this.custProp }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'recognizeshow',
  props: {
    custProp: {
      type: String,
      required: true,
      validator: function (value) {
        return ['aa', 'bb', 'dd', 'cc'].indexOf(value) !== -1
      }
    }
  }
}
</script>
