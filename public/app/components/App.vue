<template>
  <div id="app">
    <header class="header">
      <h1 class="header-title">Yigis</h1>
      <header-menu v-bind:signed="isAuth" v-bind:isTeam="isTeam" v-on:signout="onSignOut" v-on:addteam="onDialogTeam" v-on:opendashboard="onDialogDashboard"></header-menu>
    </header>
    <main>
      <div v-if="isCreated">
        <login v-on:signin="onSignIn" v-if="!isAuth" v-on:systemMessage="broadcastMessage"></login>
        <dashboard v-if="isAuth"></dashboard>
        <snackbar v-bind:message="systemMessage"></snackbar>
      </div>
    </main>
    <div v-if="isCreated">
      <team-dialog v-if="isTeamDialog" v-on:closedialog="closeDialog" v-on:systemMessage="broadcastMessage"></team-dialog>
      <dashboard-dialog v-if="isDashboardDialog" v-on:closedialog="closeDialog"></dashboard-dialog>
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
  import DashboardDialog from './dialogs/DashboardDialog.vue';

  axios.interceptors.response.use((res) => {
    return res;
  }, (err) => {
    console.log(err);
    return false;
  });

  export default {
    name: 'App',
    components: {HeaderMenu, HeaderFilters, Dashboard, Login, Snackbar, DashboardDialog, TeamDialog},
    data: () => {
      return {
        isAuth: false,
        isCreated: false,
        isTeam: false,
        isTeamDialog: false,
        isDashboardDialog: false,
        systemMessage: ''
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
      closeDialog() {
        this.isTeamDialog = false;
        this.isDashboardDialog = false;
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
