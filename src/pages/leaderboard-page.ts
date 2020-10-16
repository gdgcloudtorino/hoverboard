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
        title="Leaderboard"
        description=""
        active="[[active]]"
      ></polymer-helmet>

      <hero-block
        active="[[active]]"
      >
        <div class="hero-title highlight-font"></div>
        <p class="hero-description">Leaderboard</p>
      </hero-block>

      <div>
        <h1>Classifica personale</h1>
        <marked-element class="description" markdown="{{leaderboard.md}}">
          <div slot="markdown-html"></div>
        </marked-element>
      </div>

      <div>
        <h1>Classifica per GDG</h1>
        <marked-element class="description" markdown="{{leaderboard.md2}}">
          <div slot="markdown-html"></div>
        </marked-element>
      </div>

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

