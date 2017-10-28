<template>
	<div class="dashboard-navigator">
		<div class="dashboard-route">/<div class="dashboard-route__element">root</div>/</div>
		<ul class="dashboard-files">
			<li class="dashboard-files__element">
				<i class="material-icons">&#xE2C7;</i> <span>...</span>
			</li>
			<!-- <li class="dashboard-files__element">
			  <i class="material-icons">&#xE2C7;</i> <span>home</span>
			</li>
			<li class="dashboard-files__element">
			  <i class="material-icons">&#xE24D;</i> <span>app.js</span>
			</li> -->
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'FileNavigator'
	};
</script>