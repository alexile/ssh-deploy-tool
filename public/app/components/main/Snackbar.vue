<template lang="html">
    <div class="snackbar" v-bind:class="{'snackbar--visible': !!message}">{{message}}</div>
</template>
<script>

export default {
  name: 'Snackbar',
  props: ['message']
}
</script>
