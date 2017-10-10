<template lang="html">
    <div>
      <form class="dialog">
        dasdasd
      </form>
      <div class="wrapper" v-on:click="closeDialog"></div>
    </div>
</template>
<script>
export default {
  name: 'DashboardDialog',
  methods: {
    closeDialog() {
      this.$emit('closedialog', {});
    },
    inputField(e) {
      e.target.value ?
      e.target.parentNode.classList.add('form__fieldset--not-empty') :
      e.target.parentNode.classList.remove('form__fieldset--not-empty');
    },
  },
  data: () => {
    return {
      form: {}
    }
  }
}
</script>
