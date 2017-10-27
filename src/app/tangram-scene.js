/* global feature */
import config from '../config'
import { STOPS, OUTLINE_STOPS } from '../lib/route-segments'
import { getColorAtIndexInVec3 } from '../lib/color-ramps'

const scene = {
  import: [
    'https://mapzen.com/carto/refill-style/7/refill-style.zip',
    'https://mapzen.com/carto/refill-style/7/themes/gray.zip'
  ],
  global: {
    'sdk_mapzen_api_key': config.mapzen.apiKey,
    'refSpeedComparisonEnabled': false // this is set by the "compare" toggle in the UI
  },
  layers: {
    routes: {
      data: { source: 'routes' },
      nonzero: {
        // filter: function() {
        //   return feature.speed !== 0 && feature.speed !== null && typeof feature.speed !== 'undefined'
        // },
        draw: {
          otRoads: {
            interactive: true,
            order: 500,
            width: STOPS,
            color: function () {
              let colorIndex = 0
              if (global.refSpeedComparisonEnabled) {
                const percent = feature.percentDiff
                colorIndex = percent === null ? 0
                              : percent >= 40 ? 10 / 15
                              : percent >= 30 ? 9 / 15
                              : percent >= 20 ? 8 / 15
                              : percent >= 10 ? 7 / 15
                              : percent >= 0 ? 6 / 15
                              : percent >= -10 ? 5 / 15
                              : percent >= -20 ? 4 / 15
                              : percent >= -30 ? 3 / 15
                              : percent >= -40 ? 2 / 15
                              : percent >= -50 ? 1 / 15
                              : 0
              } else {
                const speed = feature.speed
                // divide by an even multiple of 255 for lossless conversion to 8 bits
                colorIndex = speed >= 100 ? 10 / 15
                             : speed >= 90 ? 9 / 15
                             : speed >= 80 ? 8 / 15
                             : speed >= 70 ? 7 / 15
                             : speed >= 60 ? 6 / 15
                             : speed >= 50 ? 5 / 15
                             : speed >= 40 ? 4 / 15
                             : speed >= 30 ? 3 / 15
                             : speed >= 20 ? 2 / 15
                             : speed > 0 ? 1 / 15
                             : 0
              }
              return [ colorIndex, feature.drive_on_right, feature.oneway ]
            },
            cap: 'round'
          }
        },
        otOutlines: {
          draw: {
            otOutlines: {
              order: 499,
              width: OUTLINE_STOPS,
              color: '#222'
            }
          }
        }
      // },
      // zeroSpeed: {
      //   filter: function () {
      //     return feature.speed === 0 || feature.speed === null || typeof feature.speed === 'undefined'
      //   },
      //   draw: {
      //     lines: {
      //       order: 400,
      //       width: STOPS,
      //       color: '#ccc',
      //       outline: {
      //         width: '.5px',
      //         color: '#222'
      //       },
      //       join: 'round'
      //     }
      //   }
      }
    }
  },
  styles: {
    otRoads: {
      base: 'lines',
      texcoords: true,
      lighting: false,
      blend: 'inlay',
      shaders: {
        blocks: {
          color: `
            // convert back to ints from 8-bit floats
            int i = int(floor(v_color.r * 15.));

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

            // draw each half-width if it's not a one-way street
            color.a = floor(v_texcoord.x*2.)+v_color.b;
          `
        }
      }
    },
    otOutlines: {
      base: 'lines',
      mix: 'otRoads',
      shaders: {
        blocks: {
          color: `color = v_color;`
        }
      }
    }
  }
}

export function getInitialTangramScene () {
  return scene
}
