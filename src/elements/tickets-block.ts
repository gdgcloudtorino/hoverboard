import '@polymer/iron-icon';
import '@polymer/paper-button';
import { html, PolymerElement } from '@polymer/polymer';
import { ReduxMixin } from '../mixins/redux-mixin';
import './content-loader';
import './hoverboard-icons';
import './shared-styles';

class TicketsBlock extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          display: block;
        }

        .tickets-wrapper {
          text-align: center;
        }

        .tickets {
          margin: 32px 0 24px;
        }

        .ticket-item {
          margin: 16px 8px;
          width: 100%;
          text-align: center;
          color: var(--primary-text-color);
          background-color: var(--default-background-color);
        }

        .ticket-item[in-demand] {
          transform: scale(1.05);
          box-shadow: var(--box-shadow-primary-color);
          border-top: 2px solid var(--default-primary-color);
          z-index: 1;
        }

        .ticket-item[in-demand]:hover {
          box-shadow: var(--box-shadow-primary-color-hover);
        }

        .ticket-item[sold-out] {
          opacity: 0.5;
          filter: grayscale(1);
          cursor: not-allowed;
        }

        .ticket-item[sold-out]:hover {
          box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.07), 0 2px 2px 0 rgba(0, 0, 0, 0.15);
        }

        .header {
          padding: 24px 0 0;
          font-size: 16px;
        }

        .content {
          padding: 0 24px;
        }

        .type-description {
          font-size: 12px;
          color: var(--secondary-text-color);
        }

        .ticket-price-wrapper {
          margin: 24px 0;
          white-space: nowrap;
        }

        .price {
          color: var(--default-primary-color);
          font-size: 40px;
        }

        .discount {
          font-size: 14px;
          color: var(--accent-color);
        }

        .sold-out {
          display: none;
          font-size: 14px;
          text-transform: uppercase;
          height: 32px;
          color: var(--secondary-text-color);
        }

        .additional-info {
          margin: 16px auto 0;
          max-width: 480px;
          font-size: 14px;
          color: var(--secondary-text-color);
        }

        .actions {
          padding: 24px;
          position: relative;
        }

        .tickets-placeholder {
          display: grid;
          width: 100%;
        }

        paper-button[disabled] {
          background-color: var(--primary-color-transparent);
          font-size: 12px;
        }

        paper-button[tertiary]{
          background-color: var(--default-primary-color);
          color: white;
        }

        @media (min-width: 640px) {
          .tickets-placeholder {
            grid-template-columns: repeat(auto-fill, 200px);
          }

          .ticket-item {
            max-width: 200px;
          }

          .ticket-item[in-demand] {
            transform: scale(1.15);
          }
        }
      </style>

      <div class="tickets-wrapper container">
        <h1 class="container-title">{$ ticketsBlock.title $}</h1>
        <content-loader
          class="tickets-placeholder"
          card-padding="24px"
          card-height="216px"
          border-radius="var(--border-radius)"
          title-top-position="32px"
          title-height="42px"
          title-width="70%"
          load-from="-70%"
          load-to="130%"
          animation-time="1s"
          items-count="{$ contentLoaders.tickets.itemsCount $}"
          hidden$="[[contentLoaderVisibility]]"
        >
        </content-loader>

        <div class="tickets" layout horizontal wrap center-justified>
          <template is="dom-repeat" items="[[tickets]]" as="ticket">
            <a
              class="ticket-item card"
              href$="[[ticket.url]]"
              target="_blank"
              rel="noopener noreferrer"
              sold-out$="[[ticket.soldOut]]"
              in-demand$="[[ticket.inDemand]]"
              on-click="_onTicketTap"
              ga-on="click"
              ga-event-category="ticket"
              ga-event-action="buy_click"
              ga-event-label$="[[ticket.name]]"
              layout
              vertical
            >
              <div class="header">
                <h4>[[ticket.name]]</h4>
              </div>
              <div class="content" layout vertical flex-auto>
                <div class="ticket-price-wrapper">
                  <div class="price">[[ticket.currency]][[ticket.price]]</div>
                  <div class="discount">[[_getDiscount(ticket)]]</div>
                </div>
                <div class="type-description" layout vertical flex-auto center-justified>
                  <div class="ticket-dates" hidden$="[[!ticket.starts]]">
                    [[ticket.starts]] - [[ticket.ends]]
                  </div>
                  <div class="ticket-info">[[ticket.info]]</div>
                </div>
              </div>
              <div class="actions">
                <div class="sold-out" block$="[[ticket.soldOut]]">{$ ticketsBlock.soldOut $}</div>
                <paper-button
                  tertiary
                  hidden$="[[ticket.soldOut]]"
                  disabled$="[[!ticket.available]]"
                >
                  [[_getButtonText(ticket.available)]]
                </paper-button>
              </div>
            </a>
          </template>
        </div>

        <div class="additional-info">*{$ ticketsBlock.ticketsDetails $}</div>
      </div>
    `;
  }

  static get is() {
    return 'tickets-block';
  }

  private tickets = [];
  private ticketsFetching = false;
  private ticketsFetchingError = {};
  private viewport = {};
  private contentLoaderVisibility = false;

  static get properties() {
    return {
      tickets: {
        type: Array,
        observer: '_ticketsChanged',
      },
      ticketsFetching: {
        type: Boolean,
      },
      ticketsFetchingError: {
        type: Object,
      },
      viewport: {
        type: Object,
      },
      contentLoaderVisibility: Boolean,
    };
  }

  stateChanged(state: import('../redux/store').State) {
    this.setProperties({
      viewport: state.ui.viewport,
      tickets: state.tickets.list,
      ticketsFetching: state.tickets.fetching,
      ticketsFetchingError: state.tickets.fetchingError,
    });
  }

  connectedCallback() {
    super.connectedCallback();
    // TODO: Remove any
    (window as any).HOVERBOARD.Elements.Tickets = this;
  }

  _ticketsChanged(tickets) {
    if (tickets && tickets.length) {
      this.set('contentLoaderVisibility', true);
    }
  }

  _getDiscount(ticket) {
    const primaryTicket = this.tickets.find((ticket) => ticket.primary);
    const maxPrice = primaryTicket && primaryTicket.price;
    if (!ticket.regular || ticket.primary || ticket.soldOut || !maxPrice) return;
    const discount = 100 - (parseInt(ticket.price) * 100) / parseInt(maxPrice);
    return ((discount) => `{$ ticketsBlock.save $}`)(Math.round(discount));
  }

  _onTicketTap(e) {
    if (e.model.ticket.soldOut || !e.model.ticket.available) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  _getButtonText(available) {
    return available ? '{$ buyTicket $}' : '{$ ticketsBlock.notAvailableYet $}';
  }
}

window.customElements.define(TicketsBlock.is, TicketsBlock);
