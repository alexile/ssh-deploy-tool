<template lang="html">
    <form class="header-filters hidden--md">
      <div>
        <fieldset class="form__fieldset login__fieldset" v-bind:class="{'form__fieldset--not-empty': form.type}">
          <input class="form__input-text" type="text" v-on:input="inputField" v-model="form.type">
          <legend class="form__legend">Price min</legend>
        </fieldset>
        <fieldset class="form__fieldset login__fieldset" v-bind:class="{'form__fieldset--not-empty': form.type}">
          <input class="form__input-text" type="text" v-on:input="inputField" v-model="form.type">
          <legend class="form__legend">Price max</legend>
        </fieldset>
      </div>
    </form>
</template>
<script>
export default {
  name: 'HeaderFilters',
  methods: {
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
