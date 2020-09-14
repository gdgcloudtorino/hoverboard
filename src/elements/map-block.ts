import '@polymer/google-map';
import '@polymer/paper-icon-button';
import { html, PolymerElement } from '@polymer/polymer';
import { ReduxMixin } from '../mixins/redux-mixin';
import './hoverboard-icons';
import './shared-styles';

class MapBlock extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          margin: 32px auto;
          display: block;
          position: relative;
        }

        .description-card {
          margin: 0 -16px;
          padding: 16px;
          background-color: var(--default-primary-color);
          color: var(--text-primary-color);
        }

        .bottom-info {
          margin-top: 24px;
        }

        .directions {
          --paper-icon-button: {
            width: 48px;
            height: 48px;
            color: var(--text-primary-color);
          }
        }

        @media (min-width: 640px) {
          :host {
            margin: 64px auto 72px;
          }

          google-map {
            display: block;
            height: 640px;
          }

          .description-card {
            margin: 0;
            padding: 24px;
            max-width: 320px;
            transform: translateY(80px);
            border-radius: var(--border-radius);
          }

          .address {
            font-size: 12px;
          }
        }
      </style>

      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3170167.1807741406!2d11.078739812249946!3d42.554517675191704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d4fe82448dd203%3A0xe22cf55c24635e6f!2sItalia!5e0!3m2!1sit!2sit!4v1600094444897!5m2!1sit!2sit" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>

      <!--
      <template is="dom-if" if="[[viewport.isTabletPlus]]">
        <google-map
          id="map"
          latitude="{$ location.mapCenter.latitude $}"
          longitude="{$ location.mapCenter.longitude $}"
          api-key="{$ googleMapApiKey $}"
          zoom="{$ location.pointer.zoom $}"
          disable-default-ui
          draggable="false"
          additional-map-options="[[options]]"
        >
          <google-map-marker
            latitude="{$ location.pointer.latitude $}"
            longitude="{$ location.pointer.longitude $}"
            title="{$ location.name $}"
            icon="images/map-marker.svg"
          ></google-map-marker>
        </google-map>
      </template> -->

      <div class="container" layout vertical end-justified fit$="[[viewport.isTabletPlus]]">
        <div class="description-card" layout vertical justified>
          <div>
            <h2>{$ mapBlock.title $}</h2>
            <p>{$ location.description $}</p>
          </div>
          <div class="bottom-info" layout horizontal justified center>
            <span class="address">{$ location.address $}</span>
            <a
              href="https://www.google.com/maps/dir/?api=1&amp;destination={$ location.address $}"
              target="_blank"
              rel="noopener noreferrer"
            >
              <paper-icon-button
                class="directions"
                icon="hoverboard:directions"
              ></paper-icon-button>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  static get is() {
    return 'map-block';
  }

  static get properties() {
    return {
      viewport: {
        type: Object,
      },
      options: {
        type: Object,
        value: {
          disableDefaultUI: true,
          disableDoubleClickZoom: true,
          scrollwheel: false,
          draggable: false,
          styles: [
            {
              stylers: [{ lightness: 40 }, { visibility: 'on' }, { gamma: 0.9 }, { weight: 0.4 }],
            },
            {
              elementType: 'labels',
              stylers: [{ visibility: 'on' }],
            },
            {
              featureType: 'water',
              stylers: [{ color: '#5dc7ff' }],
            },
            {
              featureType: 'road',
              stylers: [{ visibility: 'off' }],
            },
          ],
        },
      },
    };
  }

  stateChanged(state: import('../redux/store').State) {
    return this.setProperties({
      viewport: state.ui.viewport,
    });
  }
}

window.customElements.define(MapBlock.is, MapBlock);
