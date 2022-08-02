//@ts-nocheck
import { BaseFilter } from "./base_filter.class";
/**
 * Invert filter class
 * @class Invert
 * @memberOf fabric.Image.filters
 * @extends BaseFilter
 * @see {@link http://fabricjs.com/image-filters|ImageFilters demo}
 * @example
 * var filter = new Invert();
 * object.filters.push(filter);
 * object.applyFilters(canvas.renderAll.bind(canvas));
 */
export class Invert extends BaseFilter {

  /**
   * Filter type
   * @param {String} type
   * @default
   */
  type = 'Invert'

  /**
   * Invert also alpha.
   * @param {Boolean} alpha
   * @default
   **/
  alpha = false

  fragmentSource = 'precision highp float;\n' +
    'uniform sampler2D uTexture;\n' +
    'uniform int uInvert;\n' +
    'uniform int uAlpha;\n' +
    'varying vec2 vTexCoord;\n' +
    'void main() {\n' +
    'vec4 color = texture2D(uTexture, vTexCoord);\n' +
    'if (uInvert == 1) {\n' +
    'if (uAlpha == 1) {\n' +
    'gl_FragColor = vec4(1.0 - color.r,1.0 -color.g,1.0 -color.b,1.0 -color.a);\n' +
    '} else {\n' +
    'gl_FragColor = vec4(1.0 - color.r,1.0 -color.g,1.0 -color.b,color.a);\n' +
    '}\n' +
    '} else {\n' +
    'gl_FragColor = color;\n' +
    '}\n' +
    '}'

  /**
   * Filter invert. if false, does nothing
   * @param {Boolean} invert
   * @default
   */
  invert = true

  mainParameter = 'invert'

  /**
   * Apply the Invert operation to a Uint8Array representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8Array to be filtered.
   */
  applyTo2d(options) {
    var imageData = options.imageData,
      data = imageData.data, i,
      len = data.length;
    for (i = 0; i < len; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];

      if (this.alpha) {
        data[i + 3] = 255 - data[i + 3];
      }
    }
  }

  /**
   * Invert filter isNeutralState implementation
   * Used only in image applyFilters to discard filters that will not have an effect
   * on the image
   * @param {Object} options
   **/
  isNeutralState() {
    return !this.invert;
  }

  /**
   * Return WebGL uniform locations for this filter's shader.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {WebGLShaderProgram} program This filter's compiled shader program.
   */
  getUniformLocations(gl, program) {
    return {
      uInvert: gl.getUniformLocation(program, 'uInvert'),
      uAlpha: gl.getUniformLocation(program, 'uAlpha'),
    };
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform1i(uniformLocations.uInvert, this.invert);
    gl.uniform1i(uniformLocations.uAlpha, this.alpha);
  }
}