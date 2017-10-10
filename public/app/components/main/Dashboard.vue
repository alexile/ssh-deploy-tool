<template lang="html">
    <div class="dashboard">
      <div class="dashboard__cell">
        <div class="dashboard__card">
          <div class="dashboard-route">/<div class="dashboard-route__element">root</div>/</div>
          <ul class="dashboard-files">
            <li class="dashboard-files__element">
              <i class="material-icons">&#xE2C7;</i> <span>...</span>
            </li>
            <li class="dashboard-files__element">
              <i class="material-icons">&#xE2C7;</i> <span>home</span>
            </li>
            <li class="dashboard-files__element">
              <i class="material-icons">&#xE24D;</i> <span>app.js</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="dashboard__cell">
        <div class="dashboard__card">
          <div class="dashboard-terminal">
            <div class="dashboard-terminal__log">

            </div>
            <input type="text" class="dashboard-terminal__input" placeholder="Start typing">
          </div>
        </div>
      </div>
      <div class="dashboard__cell">
        <div class="dashboard-stands">
          <div class="dashboard-stands__element dashboard-stands__element--loading">
            Stand3
            <div class="dashboard-stands__loading"></div>
          </div>
          <div class="dashboard-stands__element dashboard-stands__element--loading dashboard-stands__element--active">
            Stand3
            <div class="dashboard-stands__loading"></div>
          </div>
          <div class="dashboard-stands__element dashboard-stands__element--active">
            Stand1
            <div class="dashboard-stands__loading"></div>
          </div>
          <div class="dashboard-stands__element">
            Stand2
            <div class="dashboard-stands__loading"></div>
          </div>
        </div>
      </div>
      <div class="dashboard__cell">
        <div class="dashboard-controls">
          <div class="dashboard-controls__details">
            <div class="clearfix">
              <div class="dashboard-controls__title">Stand 1</div>
              <select name="branch" class="dashboard-controls__branch">
                <optgroup label="Popular">
                  <option value="master">master</option>
                  <option value="master">master</option>
                  <option value="master">master</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="master">master</option>
                  <option value="master">master</option>
                  <option value="master">master</option>
                  <option value="master">master</option>
                </optgroup>
              </select>
              <div class="dashboard-controls__branch">
                Branch unavailable
              </div>
            </div>
            <ul class="dashboard-controls__info">
              <li><span>Status</span><span>Active</span></li>
              <li><span>Last activity</span><span>22.02.2014</span></li>
            </ul>
          </div>
          <div>
            <div>Controls:</div>
            <div>
              <button class="dashboard-controls__element button button--default button--margin-top-10 button--rounded">Test SSH 1</button>
              <button class="dashboard-controls__element button button--default button--margin-top-10 button--rounded">Test SSH 2</button>
              <button class="dashboard-controls__element button button--default button--margin-top-10 dashboard-controls__element--loading button--rounded">Test SSH 2</button>
              <button class="dashboard-controls__element button button--default button--margin-top-10 button--rounded">Test SSH 2</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import Blockchart from './Blockchart.vue';

export default {
  name: 'Dashboard',
  components: {Blockchart},
}
</script>
