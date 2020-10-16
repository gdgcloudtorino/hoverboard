import { html, PolymerElement } from '@polymer/polymer';
import '@polymer/paper-button';
import '@polymer/iron-icon';
import '@polymer/paper-button';
import '../elements/footer-block';
import '../elements/polymer-helmet';
import '../elements/hoverboard-icons';
import '../elements/shared-styles';
class GamePage extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        paper-button[primary]{
          background-color: var(--default-primary-color);
          color: white;
        }
      </style>

      <polymer-helmet
        title="{$ heroSettings.games.title $} | {$ title $}"
        description="{$ heroSettings.games.metaDescription $}"
        active="[[active]]"
      ></polymer-helmet>

      <hero-block
        background-image="{$ heroSettings.games.background.image $}"
        background-color="{$ heroSettings.games.background.color $}"
        font-color="{$ heroSettings.coc.fontColor $}"
        active="[[active]]"
      >
      <div class="hero-title highlight-font">{$ heroSettings.games.title $}</div>
      <p class="hero-description">{$ heroSettings.games.metaDescription $}</p>
      </hero-block>
      

      <div class"container">
        <div class="container" layout  justified>
          <h1 class="centered" style="ont-size: 2.1em;"></h1>
        </div>
        <div class="container" style="padding-top: 0;" layout horizontal justified>
          <paper-button primary class="cta-button animated icon-right centered" on-tap="_addCardRequest">
            <span>I giochi</span>
          </paper-button>
        </div>
      </div>

      <div>
      <div class="container" layout  justified>
        <h1 class="centered" style="ont-size: 2.1em;"></h1>
      </div>
      <div class="container" style="padding-top: 0;" layout horizontal justified>
        <paper-button primary class="cta-button animated icon-right centered" on-tap="_addCardRequest">
          <span>Richiedi una cartella</span>
        </paper-button>
      </div>
    </div>

    <div>
    <div class="container" layout  justified>
      <h1 class="centered" style="ont-size: 2.1em;"></h1>
    </div>
    <div class="container" style="padding-top: 0;" layout horizontal justified>
      <paper-button primary class="cta-button animated icon-right centered" on-tap="_addCardRequest">
        <span>Iscriviti ai giochi</span>
      </paper-button>
    </div>
    </div>

    <div>
    <div class="container" layout  justified>
      <h1 class="centered" style="ont-size: 2.1em;"></h1>
    </div>
    <div class="container" style="padding-top: 0;" layout horizontal justified>
      <paper-button primary class="cta-button animated icon-right centered" on-tap="_addCardRequest">
        <span>Leaderboard</span>
      </paper-button>
    </div>
    </div>
    <footer-block></footer-block>
    `;
  }

  static get is() {
    return 'game-page';
  }

  static get properties() {
    return {
      active: Boolean,
      source: {
        type: String,
        value: 'GAME',
      },
    };
  }
}

window.customElements.define(GamePage.is, GamePage);
