import { html, PolymerElement } from '@polymer/polymer';
import '@polymer/paper-button';
import '@polymer/iron-icon';
import '@polymer/paper-button';
import '../elements/footer-block';
import '../elements/polymer-helmet';
import '../elements/hoverboard-icons';
import '../elements/shared-styles';
import { dialogsActions, lottoActions, toastActions } from '../redux/actions';
import { DIALOGS } from '../redux/constants';
import { store } from '../redux/store';
import { ReduxMixin } from '../mixins/redux-mixin';

class GamePage extends ReduxMixin(PolymerElement) {
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
        <p class="hero-description" style="max-width: 100%">{$ heroSettings.games.metaDescription $}</p>
      </hero-block>
      

      <div class"container">
        <div class="container" layout  justified>
          <h1 class="centered" style="ont-size: 2.1em;"></h1>
        </div>
        <div class="container" style="padding-top: 0;text-align: center;" layout horizontal centered>
          <a href="https://drive.google.com/file/d/1heRt-T20Z9SyHnU7Uriuo4vr_FOwkPf-/view?usp=sharing" target="_blank" rel="noopener noreferrer" style="text-decoration: none">
            <paper-button primary class="cta-button animated icon-right centered">
              <span>I giochi</span>
            </paper-button>
          </a>
          <paper-button primary 
              hidden="[[!lottoRequestVisible]]"
              class="cta-button animated icon-right centered" 
              on-tap="_addCardRequest">
            <span>Richiedi una cartella</span>
          </paper-button>
          <a href="https://forms.gle/bgNEosdXq5AXfqyCA" target="_blank" rel="noopener noreferrer" style="text-decoration: none">
            <paper-button primary class="cta-button animated icon-right centered">
              <span>Iscriviti ai giochi</span>
            </paper-button>
          </a>
        </div>
      </div>

      <div class"container" hidden="[[lottoRequestVisible]]">
        <div class="container" layout >
          <h2 class="centered" style="font-size: 1.5em; text-align: center;">Ecco le tue card per il lotto</h2>
        </div>
        <div class="container" style="padding-top: 0;text-align: center;" layout horizontal centered>
          <div>
            <h3 class="centered" style="font-size: 1.1em;">Card per Sabato 17/10</h3>
            <img src="[[saturdayMediaLink]]" style="max-width: 350px;" />
          </div>
          <div>
            <h3 class="centered" style="font-size: 1.1em;">Card per Domenica 18/10</h3>
            <img src="[[sundayMediaLink]]" style="max-width: 350px;" />
          </div>
        </div>
      </div>

    <footer-block></footer-block>
    `;
  }

  private active = false;
  private user = {};
  private cardRequestAdding = false;
  private cardRequestAddingError = {};
  private cards = [];
  private lottoRequestVisible = true;
  private saturdayMediaLink = "";
  private sundayMediaLink = "";

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
      user: Object,
      cardRequestAdding: {
        type: Boolean,
        observer: '_cardRequestAddingChanged',
      },
      cardRequestAddingError: Object,
      cards: Object,
      lotto: Object,
      lottoRequestVisible: Boolean,
    };
  }

  stateChanged(state: import('../redux/store').State) {
    // console.log("state changed", state);
    super.stateChanged(state);
    this.setProperties({
      user: state.user,
      cardRequestAdding: state.lotto.adding,
      cardRequestAddingError: state.lotto.addingError,
      cards: state.lotto.cards,
      lotto:state.lotto
    });
  }

  static get observers() {
    return [
      '_userChanged(user)',
      '_cardsChanged(lotto)'
    ];
  }
  _cardsChanged(lotto){
    console.log("cards changed" ,lotto);
    if(lotto && lotto.cards && lotto.cards.saturdayMediaLink){
      this.cards = lotto.cards;
      this.lottoRequestVisible = false;
      this.saturdayMediaLink = lotto.cards.saturdayMediaLink;
      this.sundayMediaLink = lotto.cards.sundayMediaLink;
    }
  }
  _userChanged(user) {
    console.log('changed');
    console.log(user);
    if (this.user !== null && (this.user as any).email !== undefined) {
      console.log('changed 2');
      store.dispatch(lottoActions.fetchCards((this.user as any).email));
      console.log(this.cards);
    }
  }

  _addCardRequest() {
    if (!(this.user as any).signedIn) {
      toastActions.showToast({ message: '{$ lottoBlock.mustBeSigned $}' });
      return;
    }
    dialogsActions.openDialog(DIALOGS.SUBSCRIBE, {
      title: '{$ lottoBlock.form.title $}',
      submitLabel: '{$ lottoBlock.form.submitLabel $}',
      nameFieldLabel: '{$ lottoBlock.form.name $}',
      lastNameFieldLabel: '{$ lottoBlock.form.lastName $}',
      emailFieldValue: (this.user as any).email,
      submit: (data) => {
        store.dispatch(lottoActions.addCardRequest(data));
      },
    });
  }

  _cardRequestAddingChanged(newCardRequestAdding, oldCardRequestAdding) {
    if (oldCardRequestAdding && !newCardRequestAdding) {
      if (this.cardRequestAddingError) {
        store.dispatch(dialogsActions.setDialogError(DIALOGS.SUBSCRIBE));
      } else {
        dialogsActions.closeDialog(DIALOGS.SUBSCRIBE);
        toastActions.showToast({ message: '{$ lottoBlock.toast $}' });
      }
    }
  }
}

window.customElements.define(GamePage.is, GamePage);
