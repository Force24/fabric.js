//@ts-nocheck
import { BaseFilter } from "./base_filter.class";
/**
 * Noise filter class
 * @class Noise
 * @memberOf fabric.Image.filters
 * @extends BaseFilter
 * @see {@link http://fabricjs.com/image-filters|ImageFilters demo}
 * @example
 * var filter = new Noise({
 *   noise: 700
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
export class Noise extends BaseFilter {

  /**
   * Filter type
   * @param {String} type
   * @default
   */
  type = 'Noise'

  /**
   * Fragment source for the noise program
   */
  fragmentSource = 'precision highp float;\n' +
    'uniform sampler2D uTexture;\n' +
    'uniform float uStepH;\n' +
    'uniform float uNoise;\n' +
    'uniform float uSeed;\n' +
    'varying vec2 vTexCoord;\n' +
    'float rand(vec2 co, float seed, float vScale) {\n' +
    'return fract(sin(dot(co.xy * vScale ,vec2(12.9898 , 78.233))) * 43758.5453 * (seed + 0.01) / 2.0);\n' +
    '}\n' +
    'void main() {\n' +
    'vec4 color = texture2D(uTexture, vTexCoord);\n' +
    'color.rgb += (0.5 - rand(vTexCoord, uSeed, 0.1 / uStepH)) * uNoise;\n' +
    'gl_FragColor = color;\n' +
    '}'

  /**
   * Describe the property that is the filter parameter
   * @param {String} m
   * @default
   */
  mainParameter = 'noise'

  /**
   * Noise value, from
   * @param {Number} noise
   * @default
   */
  noise = 0

  /**
   * Apply the Brightness operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d(options) {
    if (this.noise === 0) {
      return;
    }
    var imageData = options.imageData,
      data = imageData.data, i, len = data.length,
      noise = this.noise, rand;

    for (i = 0, len = data.length; i < len; i += 4) {

      rand = (0.5 - Math.random()) * noise;

      data[i] += rand;
      data[i + 1] += rand;
      data[i + 2] += rand;
    }
  }

  /**
   * Return WebGL uniform locations for this filter's shader.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {WebGLShaderProgram} program This filter's compiled shader program.
   */
  getUniformLocations(gl, program) {
    return {
      uNoise: gl.getUniformLocation(program, 'uNoise'),
      uSeed: gl.getUniformLocation(program, 'uSeed'),
    };
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform1f(uniformLocations.uNoise, this.noise / 255);
    gl.uniform1f(uniformLocations.uSeed, Math.random());
  }

  /**
   * Returns object representation of an instance
   * @return {Object} Object representation of an instance
   */
  toObject() {
    return {
      ...super.toObject(),
      noise: this.noise
    };
  }
}