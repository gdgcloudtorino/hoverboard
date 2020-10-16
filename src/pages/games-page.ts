import '@polymer/iron-icon';
import '@polymer/marked-element';
import '@polymer/paper-icon-button';
import { html, PolymerElement } from '@polymer/polymer';
import 'plastic-image';
import '../elements/shared-styles';
import { ReduxMixin } from '../mixins/redux-mixin';
import { dialogsActions, lottoActions, toastActions } from '../redux/actions';
import { DIALOGS } from '../redux/constants';
import { store } from '../redux/store';

class GamesPage extends ReduxMixin(PolymerElement) {
    static get template() {
        return html `
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

    </style>

    <polymer-helmet
      title="{$ heroSettings.games.title $} | {$ title $}"
      description="{$ heroSettings.games.metaDescription $}"
      active="[[active]]"></polymer-helmet>

    <hero-block
      background-image="{$ heroSettings.games.background.image $}"
      background-color="{$ heroSettings.games.background.color $}"
      font-color="{$ heroSettings.games.fontColor $}"
      active="[[active]]">
      <div class="hero-title">{$ heroSettings.games.title $}</div>
      <p class="hero-description">{$ heroSettings.games.description $}</p>
    </hero-block>

    <div class="description-wrapper">
      <div class="container" layout horizontal justified>
        <marked-element class="description" markdown="{$ games.description $}">
          <div slot="markdown-html"></div>
        </marked-element>
      </div>
    </div>

    <div>
      <div class="container" layout horizontal justified>
        <h1 class="centered" style="ont-size: 2.1em;">{$ games.lotto $}</h1>
      </div>
      <div class="container" style="padding-top: 0;" layout horizontal justified>
        <paper-button primary class="cta-button animated icon-right centered" on-tap="_addCardRequest">
          <span>{$ games.button $}</span>
        </paper-button>
      </div>
    </div>
    

    <footer-block></footer-block>
`;
  }

  private active = false;
  private user = {};
  private cardRequestAdding = false;
  private cardRequestAddingError = {};

  static get is() {return 'games-page';}

  static get properties() {
    return {
      active: Boolean,
      user: Object,
      cardRequestAdding: {
        type: Boolean,
        observer: '_cardRequestAddingChanged',
      },
      cardRequestAddingError: Object,
    };
  }

  stateChanged(state: import('../redux/store').State) {
    super.stateChanged(state);
    this.setProperties({
      user: state.user,
      cardRequestAdding: state.lotto.adding,
      cardRequestAddingError: state.lotto.addingError,
    });
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
window.customElements.define(GamesPage.is, GamesPage);