import { IronOverlayBehavior } from '@polymer/iron-overlay-behavior';
import '@polymer/paper-button';
import '@polymer/paper-input/paper-input.js';
import { html, PolymerElement } from '@polymer/polymer';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { ReduxMixin } from '../../mixins/redux-mixin.js';
import { dialogsActions } from '../../redux/actions.js';
import { DIALOGS } from '../../redux/constants.js';
import '../hoverboard-icons.js';
import '../shared-styles.js';

class LottoDialog extends ReduxMixin(mixinBehaviors([IronOverlayBehavior], PolymerElement)) {
  static get template() {
    return html`
    <style include="shared-styles flex flex-alignment">
      :host {
        margin: 0;
        display: block;
        width: 85%;
        max-width: 420px;
        background: var(--primary-background-color);
        box-shadow: var(--box-shadow);

        --paper-input-container-focus-color: var(--default-primary-color);
        --paper-input-container-color: var(--secondary-text-color);
      }

      .dialog-header {
        margin-bottom: 24px;
        padding: 32px 32px 16px;
        background: var(--default-primary-color);
        color: #fff;
        font-size: 20px;
        line-height: 1.5;
      }

      paper-input {
        margin: 16px 32px 0;
      }

      paper-input:first-of-type {
        margin-top: 0;
      }

      .action-buttons {
        margin: 32px 24px 24px;
      }

      .close-button {
        color: var(--secondary-text-color);
      }

      .general-error {
        margin: 0 32px;
        color: var(--error-color);
      }

    </style>

    <div class="dialog-content" layout vertical>
      <div class="dialog-header">[[title]]</div>
      <div hidden$="[[!errorOccurred]]" class="general-error">{$ lottoBlock.generalError $}</div>
      <paper-input
        id="nameFieldInput"
        on-touchend="_focus"
        label="[[nameFieldLabel]]"
        value="{{nameFieldValue}}"
        autocomplete="off">
      </paper-input>
      <paper-input
        id="lastNameFieldInput"
        on-touchend="_focus"
        label="[[lastNameFieldLabel]]"
        value="{{lastNameFieldValue}}"
        autocomplete="off">
      </paper-input>
      <paper-input
        id="emailInput"
        on-touchend="_focus"
        label="{$ lottoBlock.emailAddress $} *"
        value="{{email}}"
        required
        auto-validate$="[[validate]]"
        error-message="{$ lottoBlock.emailRequired $}"
        autocomplete="off">
      </paper-input>
      <div class="action-buttons" layout horizontal justified>
        <paper-button class="close-button" on-tap="_closeDialog">{$ lottoBlock.close $}
        </paper-button>

        <paper-button
          on-tap="_subscribe"
          ga-on="click"
          ga-event-category="attendees"
          ga-event-action="lottoSubscribe"
          ga-event-label="lotto block"
          primary>
         [[submitLabel]]
        </paper-button>
      </div>

    </div>
`;
  }

  static get is() {
    return 'lotto-dialog';
  }

  static get properties() {
    return {
      ui: {
        type: Object,
      },
      subscribed: {
        type: Boolean,
      },
      validate: {
        type: Boolean,
        value: true,
      },
      errorOccurred: {
        type: Boolean,
        value: false,
      },
      keyboardOpened: {
        type: Boolean,
        value: false,
      },
      lastNameFieldValue: String,
      nameFieldValue: String,
      initialHeight: Number,
      title: String,
      submitLabel: String,
      nameFieldLabel: String,
      lastNameFieldLabel: String,
      emailFieldValue: String,
    };
  }

  static mapStateToProps(state, _element) {
    return {
      subscribed: state.subscribed,
      ui: state.ui,
    };
  }

  static get observers() {
    return [
      '_handleDialogToggled(opened, data)',
      '_handleSubscribed(subscribed)',
    ];
  }

  ready() {
    super.ready();
    this.initialHeight = window.innerHeight;
  }

  constructor() {
    super();
    this.addEventListener('iron-overlay-canceled', this._close);
    this.addEventListener('iron-resize', this._resize);
    window.addEventListener('resize', this._windowResize.bind(this));
  }

  _close() {
    dialogsActions.closeDialog(DIALOGS.SUBSCRIBE);
  }

  _handleSubscribed(subscribed) {
    if (subscribed) {
      this._closeDialog();
    }
  }

  _handleDialogToggled(opened, data) {
    if (data) {
      this.errorOccurred = data.errorOccurred;
    } else {
      data = {};
    }

    this.title = data.title || '{$ lottoBlock.formTitle $}';
    this.submitLabel = data.submitLabel || ' {$ lottoBlock.subscribe $}';
    this.nameFieldLabel = data.nameFieldLabel || '{$ lottoBlock.firstName $}';
    this.lastNameFieldLabel = data.lastNameFieldLabel || '{$ lottoBlock.lastName $}';
    this.nameFieldValue = data.nameFieldValue || '';
    this.lastNameFieldValue = data.lastNameFieldValue || '';
    this.emailFieldValue = data.emailFieldValue || '';
    console.log(data);
    this._prefillFields(data);
  }

  _subscribe() {
    const emailInput = this.shadowRoot.querySelector('#emailInput');

    if (!emailInput.validate() || !this._validateEmail(emailInput.value)) {
      emailInput.invalid = true;
      return;
    }

    this.data.submit({
      email: this.email,
      nameFieldValue: this.nameFieldValue,
      lastNameFieldValue: this.lastNameFieldValue,
    });
    this._close();
  }

  _validateEmail(email) {
    /* eslint-disable-next-line */
    const emailRegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegularExpression.test(email);
  }

  _closeDialog() {
    dialogsActions.closeDialog(DIALOGS.SUBSCRIBE);
  }

  _prefillFields(userData) {
    this.validate = false;
    const nameField = this.shadowRoot.querySelector('#nameFieldInput');
    const lastNameField = this.shadowRoot.querySelector('#lastNameFieldInput');
    const emailInput = this.shadowRoot.querySelector('#emailInput');
    nameField.value = userData ? userData.nameFieldValue : '';
    lastNameField.value = userData ? userData.lastNameFieldValue : '';
    emailInput.value = userData ? userData.emailFieldValue : '';
    nameField.focus();
    nameField.blur();
    lastNameField.focus();
    lastNameField.blur();
    emailInput.blur();
    emailInput.invalid = false;
    this.validate = true;
  }

  _focus(e) {
    e.target.focus();
  }

  _windowResize() {
    this.keyboardOpened = this.ui.viewport.isPhone &&
      window.innerHeight < this.initialHeight - 100;
  }

  _resize(e) {
    if (this.keyboardOpened) {
      const header = this.shadowRoot.querySelector('.dialog-header');
      const headerHeight = header.offsetHeight;

      setTimeout(() => {
        requestAnimationFrame(() => {
          this.style.maxHeight = `${this.initialHeight}px`;
          this.style.top = `-${headerHeight}px`;
        });
      }, 10);
    }
  }
}

window.customElements.define(LottoDialog.is, LottoDialog);
