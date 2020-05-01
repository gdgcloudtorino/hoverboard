import '@polymer/iron-icon';
import '@polymer/paper-button';
import { html, PolymerElement } from '@polymer/polymer';
import { ReduxMixin } from '../mixins/redux-mixin.js';
import './content-loader.js';
import './hoverboard-icons.js';
import './shared-styles.js';

class TracksLinksBlock extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
    <style include="shared-styles flex flex-alignment positioning">
      :host {
        display: block;
      }

      .tracks-links-wrapper {
        text-align: center;
      }

      .tracks-links {
        margin: 32px 0 24px;
      }

      .tracks-links-item {
        margin: 16px 8px;
        width: 100%;
        text-align: center;
        color: var(--primary-text-color);
        background-color: var(--default-background-color);
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

      .tracks-links-img-wrapper {
        margin: 12px 0;
        white-space: nowrap;
      }

      .tracks-links-img-wrapper img {
        width: 100%;
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

      .ticktracks-linksets-placeholder {
        display: grid;
        width: 100%;
      }

      paper-button[disabled] {
        background-color: var(--primary-color-transparent);
        font-size: 12px;
      }

      @media (min-width: 640px) {
        .tracks-links-placeholder {
          grid-template-columns: repeat(auto-fill, 200px);
        }

        .tracks-links-item {
          max-width: 200px;
        }

        .tracks-links-item[in-demand] {
          transform: scale(1.15);
        }
      }
    </style>

    <div class="tracks-links-wrapper container">
      <h1 class="container-title">{$ tracksLinksBlock.title $}</h1>
      <content-loader
        class="tracks-links-placeholder"
        card-padding="24px"
        card-height="216px"
        border-radius="var(--border-radius)"
        title-top-position="32px"
        title-height="42px"
        title-width="70%"
        load-from="-70%"
        load-to="130%"
        animation-time="1s"
        items-count="{$ contentLoaders.tracksLinks.itemsCount $}"
        hidden$="[[contentLoaderVisibility]]">
      </content-loader>

      <div class="tracks-links" layout horizontal wrap center-justified>
        <template is="dom-repeat" items="[[tracksLinks]]" as="tracksLink">
          <a
            class="tracks-links-item card"
            href$="[[tracksLink.url]]"
            target="_blank"
            rel="noopener noreferrer"
            ga-on="click"
            ga-event-category="tracksLink"
            ga-event-action="tracks_link_click"
            ga-event-label$="[[tracksLink.name]]"
            layout
            vertical>
            <div class="header">
              <h4>[[tracksLink.name]]</h4>
            </div>
            <div class="content" layout vertical flex-auto>
              <div class="tracks-links-img-wrapper">
                <img src="[[tracksLink.imageUrl]]"/>
              </div>
              <div>[[tracksLink.description]]</div>
            </div>
            <div class="actions">
              <paper-button primary>
                Vai al live
              </paper-button>
            </div>
          </a>
        </template>
      </div>

    </div>
`;
  }

  static get is() {
    return 'tracks-links-block';
  }

  static get properties() {
    return {
      tracksLinks: {
        type: Array,
        observer: '_tracksLinksChanged',
      },
      tracksLinksFetching: {
        type: Boolean,
      },
      tracksLinksFetchingError: {
        type: Object,
      },
      viewport: {
        type: Object,
      },
      contentLoaderVisibility: Boolean,
    };
  }

  static mapStateToProps(state, _element) {
    return {
      viewport: state.ui.viewport,
      tracksLinks: state.tracksLinks.list,
      tracksLinksFetching: state.tracksLinks.fetching,
      tracksLinksFetchingError: state.tracksLinks.fetchingError,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    HOVERBOARD.Elements.TrackLinks = this;
  }

  _tracksLinksChanged(tracksLinks) {
    if (tracksLinks && tracksLinks.length) {
      this.set('contentLoaderVisibility', true);
    }
  }

  _onTrackLinksTap(e) {
    if (e.model.tracksLink.soldOut || !e.model.tracksLink.available) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}

window.customElements.define(TracksLinksBlock.is, TracksLinksBlock);
