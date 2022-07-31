//@ts-nocheck
import { parseUnit } from '../util';
import { reFontDeclaration } from './constants';


export function parseFontDeclaration(value, oStyle) {
    var match = value.match(reFontDeclaration);

    if (!match) {
        return;
    }
    var fontStyle = match[1],
        // font variant is not used
        // fontVariant = match[2],
        fontWeight = match[3], fontSize = match[4], lineHeight = match[5], fontFamily = match[6];

    if (fontStyle) {
        oStyle.fontStyle = fontStyle;
    }
    if (fontWeight) {
        oStyle.fontWeight = isNaN(parseFloat(fontWeight)) ? fontWeight : parseFloat(fontWeight);
    }
    if (fontSize) {
        oStyle.fontSize = parseUnit(fontSize);
    }
    if (fontFamily) {
        oStyle.fontFamily = fontFamily;
    }
    if (lineHeight) {
        oStyle.lineHeight = lineHeight === 'normal' ? 1 : lineHeight;
    }
}
