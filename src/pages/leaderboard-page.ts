import { html, PolymerElement } from '@polymer/polymer';
import '../elements/footer-block';
import '../elements/md-content';
import '../elements/polymer-helmet';
import { ReduxMixin } from '../mixins/redux-mixin';
import { leadeboardActions } from '../redux/actions';
import { store } from '../redux/store';

class Leaderboardpage extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment">
      :host {
        display: block;
      }
      </style>

      <polymer-helmet
        title="{$ title $}"
        description=""
        active="[[active]]"
      ></polymer-helmet>

      <hero-block
        active="[[active]]"
      >
        <div class="hero-title highlight-font"></div>
        <p class="hero-description"></p>
      </hero-block>

      <md-content md-source="[[leaderboard.md]]"></md-content>

      <footer-block></footer-block>
    `;
  }

  private leaderboard = {};

  static get is() {
    return 'leaderboard-page';
  }

  static get properties() {
    return {
      active: Boolean,
      source: {
        type: String,
        value: '{$ leaderboard $}',
      },
      leaderboard: Object,
    };
  }

  stateChanged(state: import('../redux/store').State) {
    super.stateChanged(state);
    this.setProperties({
      leaderboard: state.leaderboard 
    });
  }

  static get observers() {
    return [
      '_leaderboardChanged()',
    ];
  }

  _leaderboardChanged() {
    store.dispatch(leadeboardActions.fetchLeaderboard());
  }

}

window.customElements.define(Leaderboardpage.is, Leaderboardpage);

