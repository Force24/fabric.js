//@ts-nocheck

import { scalingEqually } from "../controls.actions";
import { degreesToRadians, radiansToDegrees } from "../util";


/**
 * Adds support for multi-touch gestures using the Event.js library.
 * Fires the following custom events:
 * - touch:gesture
 * - touch:drag
 * - touch:orientation
 * - touch:shake
 * - touch:longpress
 */

export function CanvasGesturesMixinGenerator<T extends new (...args: unknown[]) => unknown>(Klass: T) {
  return class CanvasGesturesMixin extends Klass {
    /**
     * Method that defines actions when an Event.js gesture is detected on an object. Currently only supports
     * 2 finger gestures.
     * @param {Event} e Event object by Event.js
     * @param {Event} self Event proxy object by Event.js
     */
    __onTransformGesture(e, self) {

      if (this.isDrawingMode || !e.touches || e.touches.length !== 2 || 'gesture' !== self.gesture) {
        return;
      }

      var target = this.findTarget(e);
      if ('undefined' !== typeof target) {
        this.__gesturesParams = {
          e: e,
          self: self,
          target: target
        };

        this.__gesturesRenderer();
      }

      this.fire('touch:gesture', {
        target: target, e: e, self: self
      });
    }
    __gesturesParams = null
    __gesturesRenderer() {

      if (this.__gesturesParams === null || this._currentTransform === null) {
        return;
      }

      var self = this.__gesturesParams.self,
        t = this._currentTransform,
        e = this.__gesturesParams.e;

      t.action = 'scale';
      t.originX = t.originY = 'center';

      this._scaleObjectBy(self.scale, e);

      if (self.rotation !== 0) {
        t.action = 'rotate';
        this._rotateObjectByAngle(self.rotation, e);
      }

      this.requestRenderAll();

      t.action = 'drag';
    }

    /**
     * Method that defines actions when an Event.js drag is detected.
     *
     * @param {Event} e Event object by Event.js
     * @param {Event} self Event proxy object by Event.js
     */
    __onDrag(e, self) {
      this.fire('touch:drag', {
        e: e, self: self
      });
    }

    /**
     * Method that defines actions when an Event.js orientation event is detected.
     *
     * @param {Event} e Event object by Event.js
     * @param {Event} self Event proxy object by Event.js
     */
    __onOrientationChange(e, self) {
      this.fire('touch:orientation', {
        e: e, self: self
      });
    }

    /**
     * Method that defines actions when an Event.js shake event is detected.
     *
     * @param {Event} e Event object by Event.js
     * @param {Event} self Event proxy object by Event.js
     */
    __onShake(e, self) {
      this.fire('touch:shake', {
        e: e, self: self
      });
    }

    /**
     * Method that defines actions when an Event.js longpress event is detected.
     *
     * @param {Event} e Event object by Event.js
     * @param {Event} self Event proxy object by Event.js
     */
    __onLongPress(e, self) {
      this.fire('touch:longpress', {
        e: e, self: self
      });
    }

    /**
     * Scales an object by a factor
     * @param {Number} s The scale factor to apply to the current scale level
     * @param {Event} e Event object by Event.js
     */
    _scaleObjectBy(s, e) {
      var t = this._currentTransform,
        target = t.target;
      t.gestureScale = s;
      target._scaling = true;
      return scalingEqually(e, t, 0, 0);
    }

    /**
     * Rotates object by an angle
     * @param {Number} curAngle The angle of rotation in degrees
     * @param {Event} e Event object by Event.js
     */
    _rotateObjectByAngle(curAngle, e) {
      var t = this._currentTransform;

      if (t.target.get('lockRotation')) {
        return;
      }
      t.target.rotate(radiansToDegrees(degreesToRadians(curAngle) + t.theta));
      this._fire('rotating', {
        target: t.target,
        e: e,
        transform: t,
      });
    }
  }
}

