<template>
	<select name="branch" class="dashboard-controls__branch">
		<optgroup label="Popular">
			<option value="master">master</option>
		</optgroup>
		<optgroup label="Other">
			<option value="master">master</option>
		</optgroup>
	</select>
	<div class="dashboard-controls__branch">
		Branch unavailable
	</div>
	<fieldset class="form__fieldset form__fieldset--inline" v-bind:class="{'form__fieldset--not-empty': selected.stand.name}">
		<input class="form__input-text" type="text" v-on:input="inputField" v-model="selected.stand.name">
		<legend class="form__legend">Stand name</legend>
	</fieldset>
</template>