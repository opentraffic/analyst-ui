/* global feature */
import config from '../config'
import { STOPS, ZERO_SPEED_STOPS } from '../lib/route-segments'
import { getColorAtIndexInVec3 } from '../lib/color-ramps'

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
            const speed = feature.speed
            const colorIndex = speed >= 100 ? 10 / 10
                        : speed >= 90 ? 9 / 10
                        : speed >= 80 ? 8 / 10
                        : speed >= 70 ? 7 / 10
                        : speed >= 60 ? 6 / 10
                        : speed >= 50 ? 5 / 10
                        : speed >= 40 ? 4 / 10
                        : speed >= 30 ? 3 / 10
                        : speed >= 20 ? 2 / 10
                        : speed > 0 ? 1 / 10
                        : 0
            return [ colorIndex, feature.drive_on_right, feature.oneway ]
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
            int i = int(floor(v_color.r * 10.));
            if (i == 0) color.rgb = vec3(${getColorAtIndexInVec3(0)});
            if (i == 1) color.rgb = vec3(${getColorAtIndexInVec3(1)});
            if (i == 2) color.rgb = vec3(${getColorAtIndexInVec3(2)});
            if (i == 3) color.rgb = vec3(${getColorAtIndexInVec3(3)});
            if (i == 4) color.rgb = vec3(${getColorAtIndexInVec3(4)});
            if (i == 5) color.rgb = vec3(${getColorAtIndexInVec3(5)});
            if (i == 6) color.rgb = vec3(${getColorAtIndexInVec3(6)});
            if (i == 7) color.rgb = vec3(${getColorAtIndexInVec3(7)});
            if (i == 8) color.rgb = vec3(${getColorAtIndexInVec3(8)});
            if (i == 9) color.rgb = vec3(${getColorAtIndexInVec3(9)});
            if (i == 10) color.rgb = vec3(${getColorAtIndexInVec3(10)});

            // Scale down the road x2
            vec2 st = fract(v_texcoord.xy*2.)+vec2(.5,0.);
            // Flip direction if the the drive is not on the right.
            st.y = mix(st.y,1.-fract(st.y),v_color.g);
            // Adjust the speed to the speed
            // st.y -= u_time*5.*v_color.r;
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
