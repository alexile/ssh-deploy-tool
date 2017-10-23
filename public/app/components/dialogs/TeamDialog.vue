<template lang="html">
  <div>
    <form class="dialog" v-on:submit="onSubmit">
      <h3>Add new team</h3>
      <div>
        <p class="dialog__subtitle">Team details:</p>
        <div>
          <fieldset class="form__fieldset login__fieldset" v-bind:class="{'form__fieldset--not-empty': form.name}">
            <input class="form__input-text" type="text" v-on:input="inputField" v-model="form.name">
            <legend class="form__legend">Team name</legend>
          </fieldset>
          <fieldset class="form__fieldset login__fieldset" v-bind:class="{'form__fieldset--not-empty': form.description}">
            <input class="form__input-text" type="text" v-on:input="inputField" v-model="form.description">
            <legend class="form__legend">Description</legend>
          </fieldset>
        </div>
        <div class="form__divider"></div>
        <p class="dialog__subtitle">SSH settings:</p>
        <fieldset class="form__fieldset login__fieldset" v-bind:class="{'form__fieldset--not-empty': form.ssh_user}">
          <input class="form__input-text" type="text" v-on:input="inputField" v-model="form.ssh_user">
          <legend class="form__legend">SSH user</legend>
        </fieldset>
        <fieldset class="form__fieldset login__fieldset" v-bind:class="{'form__fieldset--not-empty': form.ssh_password}">
          <input class="form__input-text" type="text" v-on:input="inputField" v-model="form.ssh_password">
          <legend class="form__legend">SSH password</legend>
        </fieldset>
        <fieldset class="form__fieldset login__fieldset" v-bind:class="{'form__fieldset--not-empty': form.ssh_host}">
          <input class="form__input-text" type="text" v-on:input="inputField" v-model="form.ssh_host">
          <legend class="form__legend">SSH host</legend>
        </fieldset>
        <fieldset class="form__fieldset login__fieldset" v-bind:class="{'form__fieldset--not-empty': form.ssh_port}">
          <input class="form__input-text" type="text" v-on:input="inputField" v-model="form.ssh_port">
          <legend class="form__legend">SSH port</legend>
        </fieldset>
        <p class="dialog__subtitle">Github settings:</p>
        <fieldset class="form__fieldset login__fieldset" v-bind:class="{'form__fieldset--not-empty': form.git_login}">
          <input class="form__input-text" type="text" v-on:input="inputField" v-model="form.git_login">
          <legend class="form__legend">Login</legend>
        </fieldset>
        <fieldset class="form__fieldset login__fieldset" v-bind:class="{'form__fieldset--not-empty': form.git_token}">
          <input class="form__input-text" type="text" v-on:input="inputField" v-model="form.git_token">
          <legend class="form__legend">Token</legend>
        </fieldset>
      </div>
      <div class="form__divider"></div>
      <div>
        <button class="button button--default button--rounded" type="submit">Submit</button>
      </div>
    </form>
    <div class="wrapper" v-on:click="closeDialog"></div>
  </div>
</template>
<script>
import axios from 'axios';
import _ from 'lodash';

axios.interceptors.response.use((res) => {
  return res;
}, (err) => {
  console.log(err);
  return false;
});

export default {
  name: 'TeamDialog',
  methods: {
    closeDialog() {
      this.$emit('closedialog', {});
    },
    onSubmit(e) {
      const self = this;

      e.preventDefault();
      self.sendSaveTeamRequest(self.form);
    },
    sendSaveTeamRequest(data) {
      const self = this;
      axios.post('/api/team/', data)
        .then((res) => {
      	console.log(res);
          const err = _.get(res, 'data.error.message', false);
          if (err) {
            self.$emit('systemMessage', {message: err});
          } else {
	          self.$emit('systemMessage', {message: _.get(res, 'data.message')});
             this.closeDialog();
	          this.$emit('updateDashboardData', {});
          }

        })
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
