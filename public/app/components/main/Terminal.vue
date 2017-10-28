<template>
	<div class="dashboard-terminal">
		<div class="dashboard-terminal__log">
			<div v-for="msg in data" class="dashboard-terminal__msg" v-bind:class="{'dashboard-terminal__msg--error': msg.error}">
				{{msg.text}}
			</div>
		</div>
		<input type="text" class="dashboard-terminal__input" placeholder="Start typing"/>
	</div>
</template>
<script>
	export default {
		name: 'Terminal',
		props: ['data']
	};
</script>