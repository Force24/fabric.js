#!/usr/bin/env node
const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');
const cp = require('child_process');
const inquirer = require('inquirer');
const ansiEscapes = require('ansi-escapes');
const fuzzy = require('fuzzy');
const chalk = require('chalk');
const moment = require('moment');
const Checkbox = require('inquirer-checkbox-plus-prompt');

const CLI_CACHE = path.resolve(__dirname, 'cli_cache.json');
const wd = path.resolve(__dirname, '..');


const { fabric } = require(wd);

function readFile(file) {
    return fs.readFileSync(path.resolve(wd, file)).toString('utf-8');;
}

function transformFile(file) {
    const raw = fs.readFileSync(path.resolve(wd, file)).toString('utf-8');
    console.log(findMixinNS(raw))
    const { keys } = findClass(raw)||{};
    console.log(keys)
}

function getVariableNameOfKey(raw, key) {
    const regex = new RegExp(`(.+)=\\s*${key.replaceAll('.', '\\.')}`, 'm');
    const result = regex.exec(raw);
    return result && result[1].trim();
}

function getVariableNameOfNS(raw, namespace) {
    const regex = new RegExp(`(.+)=\\s*${namespace.replaceAll('.', '\\.')}\\.+$`, 'm');
    const result = regex.exec(raw);
    return result ? result[1].trim() : namespace;
}

function findMixinNS(raw) {
    const keyWord = getVariableNameOfNS(raw, 'fabric.util.object.extend');
    const regex = new RegExp(`${keyWord.replaceAll('.', '\\.')}\\((.+)\\.prototype,\.*\\{`, 'm');
    const result = regex.exec(raw);
    return result && result[1].trim();
}

function findObject(raw, charStart, charEnd, startFrom = 0) {
    const start = raw.indexOf(charStart, startFrom);
    let index = start;
    let counter = 0;
    while (index < raw.length) {
        if (raw[index] === charStart) {
            counter++;
        }
        else if (raw[index] === charEnd) {
            counter--;
            if (counter === 0) {
                break;
            }
        }
        index++;
    }
    return start > -1 ?
        {
            start,
            end: index,
            raw: raw.slice(start, index + charEnd.length)
        } :
        null;
}

function removeComments(raw) {
    const startChar = '/**', endChar = '*/';
    let start = raw.indexOf(), end;
    while (start > -1) {
        end = raw.indexOf(endChar, start);
        raw = raw.slice(0, start) + raw.slice(end + endChar.length + 1);
        start = raw.indexOf(startChar);
    }
    return raw;
}

function findClass(raw) {
    const keyWord = getVariableNameOfNS(raw, 'fabric.util.createClass');
    const regex = new RegExp(`(.+)=\\s*${keyWord.replaceAll('.', '\\.')}\\((\.*)\\{`, 'm');
    const result = regex.exec(raw);
    if (!result) throw new Error('NOT_FOUND');
    const [match, classNSRaw, superClassRaw] = result;
    const namespace = classNSRaw.trim();
    const name = namespace.slice(namespace.lastIndexOf('.') + 1);
    const superClasses = superClassRaw.trim().split(',').filter(raw => !raw.match(/\/\*+/));
    const rawObject = findObject(raw, '{', '}', result.index);
    const NS = namespace.slice(0, namespace.lastIndexOf('.'));
    const klass = fabric.util.resolveNamespace(NS === 'fabric' ? null : NS)[name];
    return {
        name,
        namespace,
        superClasses,
        superClass: superClasses.length > 0 ? superClasses[superClasses.length - 1] : undefined,
        requiresSuperClassResolution: superClasses.length > 0,
        match: {
            index: result.index,
            value: match
        },
        ...rawObject,
        klass,
        prototype: klass.prototype
    };
}

function transformClass(file) {
    let raw = readFile(file);
    let { prototype, match, name, namespace, superClass, raw: rawClass, end } = findClass(raw);
    const getPropStart = (key) => {
        const searchPhrase = `${key}\\s*:\\s*`;
        const regex = new RegExp(searchPhrase);
        return { start: regex.exec(rawClass)?.index || -1, regex };
    }
    const staticCandidantes = [];
    Object.keys(prototype).forEach((key) => {
        const object = prototype[key];
        if (typeof object === 'function') {
            const searchPhrase = `${key}\\s*:\\s*function\\s*\\(`;
            const regex = new RegExp(searchPhrase);
            const start = regex.exec(rawClass)?.index;
            const func = findObject(rawClass, '{', '}', start);
            start && func.raw.indexOf('this') === -1 && staticCandidantes.push(key);
            const indexOfComma = rawClass.indexOf(',', func.end);
            if (indexOfComma > -1) {
                rawClass = rawClass.slice(0, indexOfComma) + rawClass.slice(indexOfComma + 1);
            }
            rawClass = rawClass.replace(regex, `${key}(`);
            if (regex.exec(rawClass)) {
                throw new Error(`dupliate method found ${name}#${key}`)
            }
        }
        else {
           // if (key !=='selectionColor')return
            const start = getPropStart(key);
            switch (typeof prototype[key]) {
                case 'function':
                    throw new Error(`WTF? ${key}\n${prototype[key].toString()}`);
                case 'object':
                    const a = findObject('[', ']', start.start);
                    const b = findObject('(', ')', start.start);
                    const c = findObject('{', '}', start.start);
                    if (a || b || c) {
                        console.log({a,b,c})
                        break;
                    }
                default:
                    const indexOfLineBreak = rawClass.indexOf('\n', start.start);
                    const indexOfComma = rawClass.lastIndexOf(',', indexOfLineBreak);
                    if (indexOfComma > -1) {
                        rawClass = rawClass.slice(0, indexOfComma) /*+'\n\n\n\nDEBUG\n\n\n\n'*/+ rawClass.slice(indexOfComma + 1);
                    }
                    break;
            }

            rawClass = rawClass.replace(start.regex, `${key} = `);
        }
    });

    const classDirective = `export class ${name}${superClass ? ` extends ${superClass}` : ''} ${rawClass}`;
    raw = `${raw.slice(0, match.index)}${classDirective}${raw.slice(end+1).replace(/\s*\)\s*;?/,'')}`;
    if (raw.startsWith('(function')) {
        const wrapper = findObject(raw, '{', '}');
        raw = wrapper.raw.slice(1, wrapper.raw.length - 1);
    }
    raw = `${raw}\n/** @todo TODO_JS_MIGRATION remove next line after refactoring build */\n${namespace} = ${name};\n`;
    return { name, raw, staticCandidantes };
}

//transformFile('src/parser.js')
const shapes = fs.readdirSync(path.resolve(wd, './src/shapes'));
shapes.forEach(file => {
    if (path.parse(file).ext !== '.js') return;
    try {
        const { name, raw, staticCandidantes } = transformClass(path.join('src', 'shapes', file));
        if (staticCandidantes.length > 0) {
            console.log({
                class: name,
                origin: file,
                file: `${name}.ts`,
                staticCandidantes
            })
        }
        fs.writeFileSync(path.resolve(wd, './src/shapes', `${name}.ts`), raw);
    } catch (e) {
        console.error(file, e)
    }

})
fs.writeFileSync(path.resolve(wd, './src/Canvas.js'), transformClass('src/canvas.class.js').raw);
fs.writeFileSync(path.resolve(wd, './src/Canvas.js'), transformClass('src/canvas.class.js').raw);
//transformFile('src/mixins/canvas_events.mixin.js')

/**
 * 
 * @param {string} text 
 */
function findStartPoint(text) {
    const findMixin = /fabric\.util\.object\.extend\((.+)\.prototype,.+\{/m;
    const what = 'fabric.util.object.extend';
    const findExtend = new RegExp(`(.+)=\s?${what.replaceAll('.', '\\.')}`, 'm');
    const phrases = ['fabric.util.createClass(', 'fabric.util.object.extend('];
text.indexOf()
}