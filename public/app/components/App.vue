<template>
	<div id="app">
		<header class="header">
			<h1 class="header-title">Yigis</h1>
			<header-menu v-bind:signed="isAuth" v-bind:isTeam="isTeam" v-on:signout="onSignOut" v-on:addteam="onDialogTeam" v-on:opendashboard="onDialogDashboard"></header-menu>
		</header>
		<main>
			<div v-if="isCreated">
				<login v-on:signin="onSignIn" v-if="!isAuth" v-on:systemMessage="broadcastMessage"></login>
				<dashboard v-if="isAuth" v-on:openstanddialog="onDialogStand" v-on:systemMessage="broadcastMessage"></dashboard>
				<snackbar v-bind:message="systemMessage"></snackbar>
			</div>
		</main>
		<div v-if="isCreated">
			<team-dialog v-if="isTeamDialog" v-on:closedialog="closeDialog" v-on:systemMessage="broadcastMessage" v-on:updateDashboardData="updateDashboardData"></team-dialog>
			<dashboard-dialog v-on:systemMessage="broadcastMessage" v-if="isDashboardDialog" v-on:closedialog="closeDialog" v-on:updateDashboardData="updateDashboardData"></dashboard-dialog>
			<stand-dialog v-bind:standDialogData="standDialogData" v-on:systemMessage="broadcastMessage" v-if="isStandDialog" v-on:closedialog="closeDialog" v-on:updateDashboardData="updateDashboardData"></stand-dialog>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	import HeaderMenu from './header/Menu.vue';
	import HeaderFilters from './header/HeaderFilters.vue';
	import Dashboard from './main/Dashboard.vue';
	import Login from './main/Login.vue';
	import Snackbar from './main/Snackbar.vue';
	import TeamDialog from './dialogs/TeamDialog.vue';
	import StandDialog from './dialogs/StandsDialog.vue';
	import DashboardDialog from './dialogs/DashboardDialog.vue';

	axios.interceptors.response.use((res) => {
		return res;
	}, (err) => {
		console.log(err);
		return false;
	});

	export default {
		name: 'App',
		components: {HeaderMenu, HeaderFilters, Dashboard, Login, Snackbar, DashboardDialog, TeamDialog, StandDialog},
		data: () => {
			return {
				isAuth: false,
				isCreated: false,
				isTeam: false,
				isTeamDialog: false,
				isDashboardDialog: false,
				isStandDialog: false,
				systemMessage: '',
				standDialogData: null
			}
		},
		methods: {
			broadcastMessage(msg) {
				const self = this;

				self.systemMessage = msg.message;
				setTimeout(() => {
					self.systemMessage = '';
				}, 5000);
			},
			onSignIn() {
				this.isAuth = true;
			},
			updateDashboardData() {
				this.$emit('dataUpdateInParent', {});
			},
			closeDialog() {
				this.isTeamDialog = false;
				this.isDashboardDialog = false;
				this.isStandDialog = false;
			},
			onSignOut() {
				axios.delete('/api/session/')
					.then((res) => {
						this.isAuth = false;
					})
			},
			onDialogTeam() {
				this.isTeamDialog = true;
				this.isDashboardDialog = false;
			},
			onDialogDashboard() {
				this.isDashboardDialog = true;
				this.isTeamDialog = false;
			},
			onDialogStand(data) {
				this.isDashboardDialog = false;
				this.isTeamDialog = false;
				this.isStandDialog = true;
				this.standDialogData = data || null;
			}
		},
		created() {
			axios.get('/api/session/')
				.then((res) => {
					this.isCreated = true;
					this.isAuth = !!res.data;
					this.isTeam = !!res.data.team;
				})
		}
	}
</script>
