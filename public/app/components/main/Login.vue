<template lang="html">
  <form class="login form" v-on:submit="onSubmit">
    <fieldset class="form__fieldset login__fieldset" v-bind:class="{'form__fieldset--not-empty': form.login}">
      <input class="form__input-text" type="text" v-on:input="inputField" v-model="form.login">
      <legend class="form__legend">Login</legend>
    </fieldset>
    <fieldset class="form__fieldset login__fieldset" v-bind:class="{'form__fieldset--not-empty': form.password}">
      <input class="form__input-text" type="password" v-on:input="inputField" v-model="form.password">
      <legend class="form__legend">Password</legend>
    </fieldset>
    <div>
      <button class="button button--default button--margin-top-10" type="submit" v-on:click="clickButton">Submit</button>
    </div>
  </form>
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
  name: 'Login',
  data: () => {
    return {
      form: {
        login: '',
        password: '',
      },
    };
  },
  methods: {
    onSubmit(e) {
      const self = this;
      e.preventDefault();
      this.sendLoginrequest(self.form);
    },
    sendLoginrequest(data) {
      axios.post('/api/users', data)
        .then((res) => {
          if (_.get(res, 'data.user.login', false)) {
            this.$emit('signin', res.data.user);
            this.$emit('systemMessage', {message: _.get(res, 'data.message')});
          } else if (_.get(res, 'data.error.message')) {
            this.$emit('systemMessage', {message: _.get(res, 'data.error.message')});
          }
        })
    },
    inputField(e) {
      e.target.value ?
      e.target.parentNode.classList.add('form__fieldset--not-empty') :
      e.target.parentNode.classList.remove('form__fieldset--not-empty');
    },
    clickButton(e) {
      const rippleBox = document.createElement('div');
      document.querySelectorAll('.ripple').forEach((r) => {
        r.remove();
      });
      const offset = e.target.getBoundingClientRect();
      rippleBox.style.top = (e.clientY - offset.top - 10) + 'px';
      rippleBox.style.left = (e.clientX - offset.left - 10) + 'px';
      rippleBox.classList.add('button--ripple');
      e.target.appendChild(rippleBox);
    }
  }
}
</script>
