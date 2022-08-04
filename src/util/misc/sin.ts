import type { TRadian } from '../../typedefs';
import { halfPI } from '../../constants';

/**
 * Calculate the cos of an angle, avoiding returning floats for known results
 * This function is here just to avoid getting 0.999999999999999 when dealing
 * with numbers that are really 1 or 0.
 * @static
 * @memberOf fabric.util
 * @param {TRadian} angle the angle
 * @return {Number} the sin value for angle.
 */
export const sin = (angle: TRadian): number => {
  if (angle === 0) { return 0; }
  const angleSlice = angle / halfPI;
  let value = 1;
  if (angle < 0) {
    // sin(-a) = -sin(a)
    value = -1;
  }
  switch (angleSlice) {
    case 1: return value;
    case 2: return 0;
    case 3: return -value;
  }
  return Math.sin(angle);
};
