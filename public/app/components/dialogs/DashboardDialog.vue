<template lang="html">
<div>
<div class="dialog dialog--wide dashboard-dialog">
<h2>Teams list</h2>
  <form class="form"  v-for="(list, key) in form.users" v-on:submit="(e) => {onSubmit(e, key)}" key="{{key}}">
  <h3 class="form__legend">{{list.name}}</h3>
    <fieldset v-for="(user, k) in list.users" class="form__fieldset login__fieldset">
      <input class="form__input-text dashboard-dialog__input"
      type="text"
      v-bind:disabled="form.users[key].users[k] === list.user"
      v-model="form.users[key].users[k]"
      v-on:input="onFieldChanged(key)">
      <button class="button" v-if="form.users[key].users[k] !== list.user" v-on:click="removeUser(key, k)">-</button>
    </fieldset>
    <div>
        <button class="button button--margin-top-10" type="button" v-on:click="addUser(key)">Add user</button>
        <transition name="fade">
            <button v-if="form.changedFields.includes(key)" class="button button--margin-top-10 button--accent" type="submit">Save</button>
		</transition>
    </div>
  </form>

</div>
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
  name: 'DashboardDialog',
    methods: {
  	removeUser(i, id) {
  		this.form.users[i].users.splice(id, 1);
	    this.form.changedFields.push(i);
    },
  	addUser(i) {
        this.form.users[i].users.push('');
	    this.form.changedFields.push(i);
    },
  	onFieldChanged(i) {
        this.form.changedFields.push(i);
    },
    closeDialog() {
      this.$emit('closedialog', {});
    },
    inputField(e) {
      e.target.value ?
      e.target.parentNode.classList.add('form__fieldset--not-empty') :
      e.target.parentNode.classList.remove('form__fieldset--not-empty');
    },
        onSubmit(e, key) {
    	    e.preventDefault();
    	    this.updateTeam(this.form.users[key], key);
        },
        updateTeam(data, key) {
  		    axios.put('/api/team/', data)
                .then((res) => {
  			        const err = _.get(res, 'data.error.message');
  			        const msg = _.get(res, 'data.message');
                    console.log(res);
                    if (err) {
	                    this.$emit('systemMessage', {message: err});
                    } else {
	                    this.$emit('systemMessage', {message: msg});
                    }
                    return true;
                 })
            .then(() => {
	            this.form.changedFields = this.form.changedFields.filter(c => (c !== key));
            })
        },
      getUsers() {
          axios.get('/api/team/')
              .then((res) => {
                  console.log(res);
                  const err = _.get(res, 'error.message');
                  const data = _.get(res, 'data.response');
                  if (err) {
                      this.$emit('systemMessage', {message: err});
                  } else {
                    this.form.users = data;
                  }
              })
      }
  },
  data: () => {
    return {
      form: {
        users: [],
	      changedFields: []
      }
    }
  },
    created() {
        this.getUsers();
    }
}
</script>
