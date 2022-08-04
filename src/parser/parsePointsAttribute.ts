//@ts-nocheck

export function parsePointsAttribute(points) {

    // points attribute is required and must not be empty
    if (!points) {
        return null;
    }

    // replace commas with whitespace and remove bookending whitespace
    points = points.replace(/,/g, ' ').trim();

    points = points.split(/\s+/);
    var parsedPoints = [], i, len;

    for (i = 0, len = points.length; i < len; i += 2) {
        parsedPoints.push({
            x: parseFloat(points[i]),
            y: parseFloat(points[i + 1])
        });
    }

    // odd number of points is an error
    // if (parsedPoints.length % 2 !== 0) {
    //   return null;
    // }
    return parsedPoints;
}