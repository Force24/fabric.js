//@ts-nocheck

import { Image } from "../shapes";
import { BaseFilter } from "./base_filter.class";


/**
 * A container class that knows how to apply a sequence of filters to an input image.
 */
export class Composed extends BaseFilter {

  type = 'Composed'

  /**
   * A non sparse array of filters to apply
   */
  subFilters = []

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(options) {
    super(options);
    // create a new array instead mutating the prototype with push
    this.subFilters = this.subFilters.slice(0);
  }

  /**
   * Apply this container's filters to the input image provided.
   *
   * @param {Object} options
   * @param {Number} options.passes The number of filters remaining to be applied.
   */
  applyTo(options) {
    options.passes += this.subFilters.length - 1;
    this.subFilters.forEach(function (filter) {
      filter.applyTo(options);
    });
  }

  /**
   * Serialize this filter into JSON.
   *
   * @returns {Object} A JSON representation of this filter.
   */
  toObject() {
    return {
      ...super.toObject(),
      subFilters: this.subFilters.map(function (filter) { return filter.toObject(); }),
    };
  }

  isNeutralState() {
    return !this.subFilters.some(function (filter) { return !filter.isNeutralState(); });
  }

  /**
   * Deserialize a JSON definition of a ComposedFilter into a concrete instance.
   * @static
   * @param {oject} object Object to create an instance from
   * @param {object} [options]
   * @param {AbortSignal} [options.signal] handle aborting `BlendImage` filter loading, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<fabric.Image.filters.Composed>}
   */
  static fromObject(object, options) {
    var filters = object.subFilters || [];
    return Promise.all(filters.map(function (filter) {
      return Image.filters[filter.type].fromObject(filter, options);
    })).then(function (enlivedFilters) {
      return new Composed({ subFilters: enlivedFilters });
    });
  }
}

