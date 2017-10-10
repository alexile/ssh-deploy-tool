<template lang="html">
    <ul class="header-menu hidden--xm">
      <li class="header-menu__li" v-if="signed"><a href="/exit" v-on:click="onSignOut">Exit</a></li>
      <li class="header-menu__li"><a href="/" v-if="signed" v-on:click="openDashboard">Dashboard</a></li>
      <li class="header-menu__li header-menu__li--bordered" v-bind:class="{'header-menu__li--hightlighted': !isTeam}" v-if="signed"><a href="/add" v-on:click="addTeam">Add team</a></li>
    </ul>
</template>
<script>
export default {
  name: 'HeaderMenu',
  props: ['signed', 'isTeam'],
  methods: {
    onSignOut(e) {
      e.preventDefault();
      this.$emit('signout', {});
    },
    addTeam(e) {
      e.preventDefault();
      this.$emit('addteam', {});
    },
    openDashboard(e) {
      e.preventDefault();
      this.$emit('opendashboard', {});
    }
  }
}
</script>
