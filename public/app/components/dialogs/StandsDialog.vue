<template lang="html">
<div>
<div class="dialog dialog--wide dashboard-dialog">

  <form class="form" v-on:submit="(e) => {onSubmit(e, key)}">
    <h2>Add stand</h2>
    <fieldset class="form__fieldset">
      <select class="form__input-text" type="text"  v-model="form.team" v-bind:class="{'form__fieldset--not-empty': form.team}" v-on:change="inputField">
		<option v-for="team in teams" v-bind:value="team.name">{{team.name}}</option>
      </select>
      <legend class="form__legend">Team</legend>
    </fieldset>
	<fieldset class="form__fieldset " v-bind:class="{'form__fieldset--not-empty': form.name}">
      <input class="form__input-text" type="text" v-on:input="inputField" v-model="form.name">
      <legend class="form__legend">Name</legend>
    </fieldset>
    <fieldset class="form__fieldset " v-bind:class="{'form__fieldset--not-empty': form.description}">
      <input class="form__input-text" type="text" v-on:input="inputField" v-model="form.description">
      <legend class="form__legend">Description</legend>
    </fieldset>
    <div>
        <h3>Variables</h3>
    <div v-for="(variable, i) in form.variables">
        <fieldset class="form__fieldset form__fieldset--inline " v-bind:class="{'form__fieldset--not-empty': form.variables[i].key}">
            <input class="form__input-text" type="text" v-on:input="inputField" v-model="form.variables[i].key">
            <legend class="form__legend">Name of variable</legend>
        </fieldset>
        <fieldset class="form__fieldset form__fieldset--inline " v-bind:class="{'form__fieldset--not-empty': form.variables[i].value}">
            <input class="form__input-text" type="text" v-on:input="inputField" v-model="form.variables[i].value">
            <legend class="form__legend">Value of {{form.variables[i].key ? form.variables[i].key : 'variable'}}</legend>
            <button class="button" v-on:click="removeRow('variables', i)">-</button>
        </fieldset>
	</div>
	<button class="button button--margin-top-10" type="button" v-on:click="addRow('variables')">Add variable</button>

	</div>
	<div>
        <h3>Commands</h3>
    <div v-for="(variable, i) in form.commands">
        <fieldset class="form__fieldset form__fieldset--inline " v-bind:class="{'form__fieldset--not-empty': form.commands[i].key}">
            <input class="form__input-text" type="text" v-on:input="inputField" v-model="form.commands[i].key">
            <legend class="form__legend">Name of command</legend>
        </fieldset>
        <fieldset class="form__fieldset form__fieldset--inline " v-bind:class="{'form__fieldset--not-empty': form.commands[i].value}">
            <input class="form__input-text" type="text" v-on:input="inputField" v-model="form.commands[i].value">
            <legend class="form__legend">Content of {{form.commands[i].key ? form.commands[i].key : 'command'}}</legend>
            <button class="button" v-on:click="removeRow('commands', i)">-</button>
        </fieldset>
	</div>
	<button class="button button--margin-top-10" type="button" v-on:click="addRow('commands')">Add command</button>
	</div>
	<transition name="fade">
            <button  class="button button--margin-top-10 button--accent" type="submit">Save</button>
		</transition>
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
  name: 'StandDialog',
	methods: {
	closeDialog() {
	  this.$emit('closedialog', {});
	},
		addRow(name) {
			this.form[name].push({key: '', value: ''});
		},
		removeRow(name, i) {
			this.form[name].splice(i, 1);
		},
		onSubmit(e) {
			e.preventDefault();
			this.saveStand();
		},
		inputField(e) {
			e.target.value ?
				e.target.parentNode.classList.add('form__fieldset--not-empty') :
				e.target.parentNode.classList.remove('form__fieldset--not-empty');
		},
//	  getStands() {
//		  axios.get('/api/stand/')
//			  .then((res) => {
//				  console.log(res);
//				  const err = _.get(res, 'data.error.message');
//				   const data = _.get(res, 'data.response');
//				  if (err) {
//					  this.$emit('systemMessage', {message: err});
//				  } else {
////					this.form.stands = data;
//				  }
//			  })
//	  },
		saveStand() {
			axios.post('/api/stand/', this.form)
				.then((res) => {
					const err = _.get(res, 'data.error.message');
					const data = _.get(res, 'data');
					if (err) {
						this.$emit('systemMessage', {message: err});
					} else {
					    this.$emit('systemMessage', {message: data.message});
					    this.$emit('updateDashboardData', {});
					    this.closeDialog();
					}
				})
		},
		getTeams() {
			axios.get('/api/team/')
				.then((res) => {
					const err = _.get(res, 'data.error.message');
					const data = _.get(res, 'data.response', []);
					if (err) {
						this.$emit('systemMessage', {message: err});
					} else {
						if (!data.length) {
							this.$emit('systemMessage', {message: 'Wow! You have not team. Create it and stands will be active'});
							this.closeDialog();
						}
						this.teams = data;
					}
				})
		}
  },
  data: () => {
	return {
	  form: {
		name: '',
		  description: '',
		  variables: [{key: '', value: ''}],
		  commands: [{key: '', value: ''}]
	  },
		changedFields: [],
		teams: []
	}
  },
	created() {
		this.getTeams();
	}
}
</script>
