<template lang="html">
	<div class="dashboard">
		<div class="dashboard__cell">
			<div class="dashboard__card">
				<FileNavigator :data="selected"/>
			</div>
		</div>
		<div class="dashboard__cell">
			<div class="dashboard__card">
				<Terminal :data="terminalRaw"/>
			</div>
		</div>
		<div class="dashboard__cell">
			<div class="dashboard-stands">
				<div v-for="(standByTeam, objectName) in stands" class="clear">
					<h3>{{objectName}}</h3>
					<div v-for="(stand, standId) in standByTeam"
						class="dashboard-stands__element"
						v-bind:class="{'dashboard-stands__element--active': (objectName == selected.obj && standId == selected.arr), 'dashboard-stands__element--loading': isLoading}"
						v-on:click="selectStand(objectName, standId)">
						{{stand.name}}
						<div class="dashboard-stands__loading"></div>
					</div>
					<div class="dashboard-stands__element dashboard-stands__element--add" v-on:click="openStandDialog">
						&nbsp;
					</div>
				</div>
				<div v-if="!Object.keys(stands).length">
					<div class="dashboard-stands__element dashboard-stands__element--add" v-on:click="openStandDialog">
						&nbsp;
					</div>
				</div>
            </div>
		</div>
		<div class="dashboard__cell">
			<div class="dashboard-controls" v-if="selected.stand">
				<div class="dashboard-controls__details">
					<div class="clearfix">
						<div class="dashboard-controls__title">{{selected.stand.name}}</div>
						<button class="button" v-on:click="(e) => {openStandDialog(e, selected)}">Edit</button>
						<button class="button" v-on:click="copyStand">Copy</button>
						<button class="button" v-on:click="removeStand">Remove stand</button>
					</div>
					<ul class="dashboard-controls__info">
						<li><span>Status</span><span>{{selected.stand.status ? 'Active' : 'Out of service'}}</span></li>
						<li><span>Last activity</span><span>{{ currentTime }}</span></li>
					</ul>
				</div>
				<div>
					<div>Controls:</div>
					<div>
						<button v-for="(command, i) in selected.stand.commands"
							v-on:click="(e) => {sendSshRequest(e, i)}"
							v-bind:class="{'dashboard-controls__element--loading': isLoading}"
							class="dashboard-controls__element button button--default button--margin-top-10 button--rounded">
							{{command.key}}
						</button>
					</div>
				</div>
            </div>
		</div>
    </div>
</template>

<script>
import Terminal from './Terminal.vue';
import FileNavigator from './FileNavigator.vue';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

axios.interceptors.response.use((res) => {
	return res;
}, (err) => {
	console.log(err);
	return false;
});

export default {
	name: 'Dashboard',
	components: {Terminal, FileNavigator},
		methods: {
			openStandDialog(e, data) {
				e.preventDefault();
				data = _.get(data, 'stand', null);
				this.$emit('openstanddialog', data);
			},
			selectStand(objName, arrName) {
				this.selected.obj = objName;
				this.selected.arr = arrName;
			},
			sendSshRequest(e, i) {
				e.preventDefault();
				this.isLoading = true;
				axios.post('/api/stand/command', {team: this.selected.obj, standId: this.selected.stand._id, commandId: i})
					.then(res => {
						const data = _.get(res, 'data.response', '');
						const err = _.get(res, 'data.error.message');

						if (err) {
							this.$emit('systemMessage', {message: err});
						} else {
							const arr = this.terminalRaw.reverse();
							if (data.code) {
								arr.push({text: data.stderr, error: true});
							} else {
								arr.push({text: data.stdout, error: false});
							}
							this.terminalRaw = arr.reverse();
						}
						this.isLoading = false;
					});
			},
			inputField(e) {
				e.target.value ?
					e.target.parentNode.classList.add('form__fieldset--not-empty') :
					e.target.parentNode.classList.remove('form__fieldset--not-empty');
			},
			getReversedMessages(arr) {
				return arr.reverse();
			},
			copyStand() {
				axios.post('/api/stand/copy', this.selected.stand)
					.then(res => {
						const err = _.get(res, 'data.error.message');
						const msg = _.get(res, 'data.message');

						if (err) {
							this.$emit('systemMessage', {message: err});
						} else {
							this.$emit('systemMessage', {message: msg});
							this.getStands();
						}
						this.isLoading = false;
					});
			},
			removeStand() {
				const currentId = _.get(this, 'selected.stand._id', false);

				if (currentId) {
					this.isLoading = true;
					axios.delete(`/api/stand/${currentId}`)
						.then(res => {
							const err = _.get(res, 'data.error.message');
							const msg = _.get(res, 'data.response.message');

							if (err) {
								this.$emit('systemMessage', {message: err});
							} else {
								this.$emit('systemMessage', {message: msg});
								this.getStands();
							}
						})
						.then(() => {
							this.isLoading = false;
						});
				}
			},
			getStands() {
				axios.get('/api/stand/')
					.then((res) => {
						const data = _.get(res, 'data.response', {});
						const err = _.get(res, 'data.error.message');

						if (err) {
							this.$emit('systemMessage', {message: err});
						} else {
							this.stands = data;
							this.selected = {
								get stand() {
									return _.get(data, `${this.obj}.${this.arr}`, {});
								},
								obj: Object.keys(data)[0],
								arr: 0
							};
						}
					});
			}
		},
	created() {
		this.getStands();
		this.$parent.$on('dataUpdateInParent', () => {
			this.getStands();
		});
	},
	data: () => {
		return {
			stands: {},
			selected: {},
			isLoading: false,
			terminalRaw: [],
			currentTime: moment().format('MMMM Do YYYY, h:mm:ss a')
		};
	}
};
</script>
