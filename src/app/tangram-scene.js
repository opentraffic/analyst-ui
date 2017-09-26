/* global feature */
import config from '../config'
import { STOPS, ZERO_SPEED_STOPS } from '../lib/route-segments'

const scene = {
  import: [
    'https://mapzen.com/carto/refill-style/7/refill-style.zip',
    'https://mapzen.com/carto/refill-style/7/themes/gray.zip',
    // 'https://mapzen.com/carto/refill-style/7/themes/gray-gold.zip'
    'https://tangrams.github.io/blocks/functions/zoom.yaml',
    'https://tangrams.github.io/blocks/functions/aastep.yaml',
    'https://tangrams.github.io/blocks/generative/random.yaml'
  ],
  global: {
    'sdk_mapzen_api_key': config.mapzen.apiKey
  },
  layers: {
    routes: {
      data: { source: 'routes' },
      draw: {
        otRoads: {
          interactive: true,
          order: 500,
          width: STOPS,
          color: function () {
            return [ feature.speed, feature.drive_on_right, feature.oneway ]
            // const speed = feature.speed
            // const color = speed >= 100 ? '#313695'
            //             : speed >= 90 ? '#4575b4'
            //             : speed >= 80 ? '#74add1'
            //             : speed >= 70 ? '#abd9e9'
            //             : speed >= 60 ? '#e0f3f8'
            //             : speed >= 50 ? '#fee090'
            //             : speed >= 40 ? '#fdae61'
            //             : speed >= 30 ? '#f46d43'
            //             : speed >= 20 ? '#d73027'
            //             : speed > 0 ? '#a50026'
            //             : '#ccc'
            // return color
          },
          outline: {
            width: '1px',
            color: '#222'
          },
          join: 'round'
        }
      },
      zeroSpeed: {
        filter: function () {
          return feature.speed === 0 || feature.speed === null || typeof feature.speed === 'undefined'
        },
        draw: {
          lines: {
            order: 400,
            width: ZERO_SPEED_STOPS
          }
        }
      }
    }
  },
  styles: {
    otRoads: {
      base: 'lines',
      mix: ['functions-zoom', 'functions-aastep', 'generative-random'],
      texcoords: true,
      lighting: false,
      blend: 'inlay',
      shaders: {
        defines: {
          ZOOM_START: 18,
          ZOOM_END: 20,
          ZOOM_IN: 0,
          ZOOM_OUT: 0.5
        },
        uniforms: {
          u_palette: 'palette'
        },
        blocks: {
          // One or two lanes
          width: 'width *= v_texcoord.x;',
          color: `
            // Speed to color from palette LUT
            // color = texture2D(u_palette, vec2(clamp(v_color.r,0.,1.),.5));
            // Scale down the road x2
            vec2 st = fract(v_texcoord.xy*2.)+vec2(.5,0.);
            // Flip direction if the the drive is not on the right.
            st.y = mix(st.y,1.-fract(st.y),v_color.g);
            // Adjust the speed to the speed
            st.y -= u_time*5.*v_color.r;
            // Make chrevone arrow just in the second line
            // color.a *= min(floor(v_texcoord.x*2.),
            //                 aastep(zoom(),fract(st.y+abs(st.x*.5-.5))));`
        }
      }
    }
  }
}

export function getInitialTangramScene () {
  return scene
}
