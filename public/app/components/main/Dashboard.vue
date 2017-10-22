<template lang="html">
    <div class="dashboard">
      <div class="dashboard__cell">
        <div class="dashboard__card">
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
      </div>
      <div class="dashboard__cell">
        <div class="dashboard__card">
          <div class="dashboard-terminal">
            <div class="dashboard-terminal__log">
				<div v-for="msg in terminalRaw" class="dashboard-terminal__msg" v-bind:class="{'dashboard-terminal__msg--error': msg.error}">
					{{msg.text}}
				</div>
            </div>
            <input type="text" class="dashboard-terminal__input" placeholder="Start typing">
          </div>
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
          <!--<div class="dashboard-stands__element dashboard-stands__element&#45;&#45;loading">-->
            <!--Stand3-->
            <!--<div class="dashboard-stands__loading"></div>-->
          <!--</div>-->
          <!--<div class="dashboard-stands__element dashboard-stands__element&#45;&#45;loading dashboard-stands__element&#45;&#45;active">-->
            <!--Stand3-->
            <!--<div class="dashboard-stands__loading"></div>-->
          <!--</div>-->
          <!--<div class="dashboard-stands__element dashboard-stands__element&#45;&#45;active">-->
            <!--Stand1-->
            <!--<div class="dashboard-stands__loading"></div>-->
          <!--</div>-->
          <!--<div class="dashboard-stands__element">-->
            <!--Stand2-->
            <!--<div class="dashboard-stands__loading"></div>-->
          <!--</div>-->
        </div>
      </div>
      <div class="dashboard__cell">
        <div class="dashboard-controls" v-if="selected.stand">
          <div class="dashboard-controls__details">
            <div class="clearfix">
              <!--<div class="dashboard-controls__title">{{selected.stand.name}}</div>-->
              <!--<select name="branch" class="dashboard-controls__branch">-->
                <!--<optgroup label="Popular">-->
                  <!--<option value="master">master</option>-->
                <!--</optgroup>-->
                <!--<optgroup label="Other">-->
                  <!--<option value="master">master</option>-->
                <!--</optgroup>-->
              <!--</select>-->
              <!--<div class="dashboard-controls__branch">-->
                <!--Branch unavailable-->
              <!--</div>-->
              <fieldset class="form__fieldset form__fieldset--inline" v-bind:class="{'form__fieldset--not-empty': selected.stand.name}">
			      <input class="form__input-text" type="text" v-on:input="inputField" v-model="selected.stand.name">
			      <legend class="form__legend">Stand name</legend>
			    </fieldset>
              <button class="button">Rename</button>
              <button class="button">Copy</button>
            </div>
            <ul class="dashboard-controls__info">
              <li><span>Status</span><span>{{selected.stand.status ? 'Active' : 'Out of service'}}</span></li>
              <li><span>Last activity</span><span>{{ new Date()}}</span></li>
            </ul>
          </div>
          <div>
            <div>Controls:</div>
            <div>
              <button v-for="(command, i) in selected.stand.commands"
              v-on:click="(e) => {sendSshRequest(e, i)}"
              v-bind:class="{'dashboard-controls__element--loading': isLoading}"
              class="dashboard-controls__element button button--default button--margin-top-10 button--rounded">{{command.key}}</button>
              <!--<button class="dashboard-controls__element button button&#45;&#45;default button&#45;&#45;margin-top-10 button&#45;&#45;rounded">Test SSH 2</button>-->
              <!--<button class="dashboard-controls__element button button&#45;&#45;default button&#45;&#45;margin-top-10 dashboard-controls__element&#45;&#45;loading button&#45;&#45;rounded">Test SSH 2</button>-->
              <!--<button class="dashboard-controls__element button button&#45;&#45;default button&#45;&#45;margin-top-10 button&#45;&#45;rounded">Test SSH 2</button>-->
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import Blockchart from './Blockchart.vue';
import axios from 'axios';
import _ from 'lodash';

axios.interceptors.response.use((res) => {
	return res;
}, (err) => {
	console.log(err);
	return false;
});

export default {
  name: 'Dashboard',
  components: {Blockchart},
    methods: {
	    openStandDialog(e) {
		    e.preventDefault();
		    this.$emit('openstanddialog', {});
	    },
	    selectStand(objName, arrName) {
	        this.selected.obj = objName;
	        this.selected.arr = arrName;
	        console.log(this.selected);
	    },
	    sendSshRequest(e, i) {
	    	e.preventDefault();
	    	this.isLoading = true;
	        axios.post('/api/stand/command', {team: this.selected.obj, standId: this.selected.stand._id, commandId: i})
		        .then(res => {
			        const data = _.get(res, 'data.response', '');
			        const err = _.get(res, 'data.error.message');
			        if (err) {

			        } else {
						console.log(data);
				        const arr = this.terminalRaw.reverse();
						if (data.code) {
							arr.push({text: data.stderr, error: true});
						} else {
							arr.push({text: data.stdout, error: false});
						}
						this.terminalRaw = arr.reverse();
						console.log(this.terminalRaw);
			        }
			        this.isLoading = false;
		        })
	    },
	    inputField(e) {
		    e.target.value ?
			    e.target.parentNode.classList.add('form__fieldset--not-empty') :
			    e.target.parentNode.classList.remove('form__fieldset--not-empty');
	    },
	    getReversedMessages(arr) {
	        return arr.reverse();
	    },
	    getStands() {
	    	axios.get('/api/stand/')
			    .then((res) => {
	    		    const data = _.get(res, 'data.response', {});
	    		    const err = _.get(res, 'data.error.message');
					console.log(data);
	    		    if (err) {

			        } else {
	    		    	this.stands = data;
	    		    	this.selected = {
					        get stand() {
						        return data[this.obj][this.arr];
					        },
	    		    		obj: Object.keys(data)[0],
					        arr: 0
	    		    	};
	    		    	console.log(this.selected);
			        }
			    })
	    }
    },
	created() {
  	   this.getStands();
  	   this.$parent.$on('updateDashboardData', this.getStands);
	},
	data: () => {
  	    return {
  	    	stands: {},
	        selected: {},
	        isLoading: false,
	        terminalRaw: []
        }
	}
}
</script>
