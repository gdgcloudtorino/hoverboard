import '@polymer/iron-icon';
import '@polymer/marked-element';
import '@polymer/paper-icon-button';
import '../elements/shared-styles';
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

      .description-wrapper {
        background-color: var(--secondary-background-color);
        width: 100%;
        overflow: hidden;
      }

      .games-title {
        font-size: 30px;
        line-height: 2.5;
      }

      .games-block {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 24px;
        margin-bottom: 32px;
      }

      .centered {
        margin: 0 auto;
        text-align: center;
      }

      table {
        margin: 0 0 40px 0;
        width: 100%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        display: table;
      }
      @media screen and (max-width: 580px) {
        .table {
          display: block;
        }
      }
      thead{
        background-color: #4285f4;
        color: white;
      }

      </style>

      <polymer-helmet
      title="{$ heroSettings.games.title $} | {$ title $}"
      description="{$ heroSettings.games.metaDescription $}"
      active="[[active]]"></polymer-helmet>


      <hero-block
      background-image=""
      style="   background-size: contain !important;
      height: 100%;
      text-align: center;
      color: white;

      "
      >

        <div class="hero-title highlight-font">Leaderboard</div>
        <p class="hero-description"></p>
      </hero-block>

      <div style="text-align: center;">
        <div style="float: left;padding-left: 25px; width: 50%;">
          <h1>Classifica partecipanti</h1>
          <marked-element class="description" markdown="{{leaderboard.md}}">
            <div slot="markdown-html"></div>
          </marked-element>
        </div>

        <div style= "float: right; padding-right: 25px; width: 48%;">
          <h1>Classifica GDG</h1>
          <marked-element class="description" markdown="{{leaderboard.md2}}">
            <div slot="markdown-html"></div>
          </marked-element>
        </div>
      </div>
      <div style="clear: both;"></div>

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
