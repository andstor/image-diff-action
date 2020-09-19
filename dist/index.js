require('./sourcemap-register.js');module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 241:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__webpack_require__(87));
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
function escapeData(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 186:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __webpack_require__(241);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = command_1.toCommandValue(val);
    process.env[name] = convertedVal;
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 771:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Canvas = __webpack_require__(786)
const Image = __webpack_require__(767)
const CanvasRenderingContext2D = __webpack_require__(389)
const parseFont = __webpack_require__(18)
const packageJson = __webpack_require__(160)
const bindings = __webpack_require__(829)
const fs = __webpack_require__(747)
const PNGStream = __webpack_require__(734)
const PDFStream = __webpack_require__(977)
const JPEGStream = __webpack_require__(503)
const DOMMatrix = __webpack_require__(812).DOMMatrix
const DOMPoint = __webpack_require__(812).DOMPoint

function createCanvas (width, height, type) {
  return new Canvas(width, height, type)
}

function createImageData (array, width, height) {
  return new bindings.ImageData(array, width, height)
}

function loadImage (src) {
  return new Promise((resolve, reject) => {
    const image = new Image()

    function cleanup () {
      image.onload = null
      image.onerror = null
    }

    image.onload = () => { cleanup(); resolve(image) }
    image.onerror = (err) => { cleanup(); reject(err) }

    image.src = src
  })
}

/**
 * Resolve paths for registerFont. Must be called *before* creating a Canvas
 * instance.
 * @param src {string} Path to font file.
 * @param fontFace {{family: string, weight?: string, style?: string}} Object
 * specifying font information. `weight` and `style` default to `"normal"`.
 */
function registerFont (src, fontFace) {
  // TODO this doesn't need to be on Canvas; it should just be a static method
  // of `bindings`.
  return Canvas._registerFont(fs.realpathSync(src), fontFace)
}

module.exports = {
  Canvas,
  Context2d: CanvasRenderingContext2D, // Legacy/compat export
  CanvasRenderingContext2D,
  CanvasGradient: bindings.CanvasGradient,
  CanvasPattern: bindings.CanvasPattern,
  Image,
  ImageData: bindings.ImageData,
  PNGStream,
  PDFStream,
  JPEGStream,
  DOMMatrix,
  DOMPoint,

  registerFont,
  parseFont,

  createCanvas,
  createImageData,
  loadImage,

  backends: bindings.Backends,

  /** Library version. */
  version: packageJson.version,
  /** Cairo version. */
  cairoVersion: bindings.cairoVersion,
  /** jpeglib version. */
  jpegVersion: bindings.jpegVersion,
  /** gif_lib version. */
  gifVersion: bindings.gifVersion ? bindings.gifVersion.replace(/[^.\d]/g, '') : undefined,
  /** freetype version. */
  freetypeVersion: bindings.freetypeVersion
}


/***/ }),

/***/ 812:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const util = __webpack_require__(669)

// DOMMatrix per https://drafts.fxtf.org/geometry/#DOMMatrix

function DOMPoint(x, y, z, w) {
  if (!(this instanceof DOMPoint)) {
    throw new TypeError("Class constructors cannot be invoked without 'new'")
  }

  if (typeof x === 'object') {
    w = x.w
    z = x.z
    y = x.y
    x = x.x
  }
  this.x = typeof x === 'number' ? x : 0
  this.y = typeof y === 'number' ? y : 0
  this.z = typeof z === 'number' ? z : 0
  this.w = typeof w === 'number' ? w : 1
}

// Constants to index into _values (col-major)
const M11 = 0, M12 = 1, M13 = 2, M14 = 3
const M21 = 4, M22 = 5, M23 = 6, M24 = 7
const M31 = 8, M32 = 9, M33 = 10, M34 = 11
const M41 = 12, M42 = 13, M43 = 14, M44 = 15

const DEGREE_PER_RAD = 180 / Math.PI
const RAD_PER_DEGREE = Math.PI / 180

function parseMatrix(init) {
  var parsed = init.replace(/matrix\(/, '')
  parsed = parsed.split(/,/, 7) // 6 + 1 to handle too many params
  if (parsed.length !== 6) throw new Error(`Failed to parse ${init}`)
  parsed = parsed.map(parseFloat)
  return [
    parsed[0], parsed[1], 0, 0,
    parsed[2], parsed[3], 0, 0,
    0, 0, 1, 0,
    parsed[4], parsed[5], 0, 1
  ]
}

function parseMatrix3d(init) {
  var parsed = init.replace(/matrix3d\(/, '')
  parsed = parsed.split(/,/, 17) // 16 + 1 to handle too many params
  if (parsed.length !== 16) throw new Error(`Failed to parse ${init}`)
  return parsed.map(parseFloat)
}

function parseTransform(tform) {
  var type = tform.split(/\(/, 1)[0]
  switch (type) {
    case 'matrix':
      return parseMatrix(tform)
    case 'matrix3d':
      return parseMatrix3d(tform)
    // TODO This is supposed to support any CSS transform value.
    default:
      throw new Error(`${type} parsing not implemented`)
  }
}

function DOMMatrix (init) {
  if (!(this instanceof DOMMatrix)) {
    throw new TypeError("Class constructors cannot be invoked without 'new'")
  }

  this._is2D = true
  this._values = new Float64Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ])

  var i

  if (typeof init === 'string') { // parse CSS transformList
    if (init === '') return // default identity matrix
    var tforms = init.split(/\)\s+/, 20).map(parseTransform)
    if (tforms.length === 0) return
    init = tforms[0]
    for (i = 1; i < tforms.length; i++) init = multiply(tforms[i], init)
  }

  i = 0
  if (init && init.length === 6) {
    setNumber2D(this, M11, init[i++])
    setNumber2D(this, M12, init[i++])
    setNumber2D(this, M21, init[i++])
    setNumber2D(this, M22, init[i++])
    setNumber2D(this, M41, init[i++])
    setNumber2D(this, M42, init[i++])
  } else if (init && init.length === 16) {
    setNumber2D(this, M11, init[i++])
    setNumber2D(this, M12, init[i++])
    setNumber3D(this, M13, init[i++])
    setNumber3D(this, M14, init[i++])
    setNumber2D(this, M21, init[i++])
    setNumber2D(this, M22, init[i++])
    setNumber3D(this, M23, init[i++])
    setNumber3D(this, M24, init[i++])
    setNumber3D(this, M31, init[i++])
    setNumber3D(this, M32, init[i++])
    setNumber3D(this, M33, init[i++])
    setNumber3D(this, M34, init[i++])
    setNumber2D(this, M41, init[i++])
    setNumber2D(this, M42, init[i++])
    setNumber3D(this, M43, init[i++])
    setNumber3D(this, M44, init[i])
  } else if (init !== undefined) {
    throw new TypeError('Expected string or array.')
  }
}

DOMMatrix.fromMatrix = function (init) {
  if (!(init instanceof DOMMatrix)) throw new TypeError('Expected DOMMatrix')
  return new DOMMatrix(init._values)
}
DOMMatrix.fromFloat32Array = function (init) {
  if (!(init instanceof Float32Array)) throw new TypeError('Expected Float32Array')
  return new DOMMatrix(init)
}
DOMMatrix.fromFloat64Array = function (init) {
  if (!(init instanceof Float64Array)) throw new TypeError('Expected Float64Array')
  return new DOMMatrix(init)
}

// TODO || is for Node.js pre-v6.6.0
DOMMatrix.prototype[util.inspect.custom || 'inspect'] = function (depth, options) {
  if (depth < 0) return '[DOMMatrix]'

  return `DOMMatrix [
    a: ${this.a}
    b: ${this.b}
    c: ${this.c}
    d: ${this.d}
    e: ${this.e}
    f: ${this.f}
    m11: ${this.m11}
    m12: ${this.m12}
    m13: ${this.m13}
    m14: ${this.m14}
    m21: ${this.m21}
    m22: ${this.m22}
    m23: ${this.m23}
    m23: ${this.m23}
    m31: ${this.m31}
    m32: ${this.m32}
    m33: ${this.m33}
    m34: ${this.m34}
    m41: ${this.m41}
    m42: ${this.m42}
    m43: ${this.m43}
    m44: ${this.m44}
    is2D: ${this.is2D}
    isIdentity: ${this.isIdentity} ]`
}

DOMMatrix.prototype.toString = function () {
  return this.is2D ?
    `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})` :
    `matrix3d(${this._values.join(', ')})`
}

/**
 * Checks that `value` is a number and sets the value.
 */
function setNumber2D(receiver, index, value) {
  if (typeof value !== 'number') throw new TypeError('Expected number')
  return receiver._values[index] = value
}

/**
 * Checks that `value` is a number, sets `_is2D = false` if necessary and sets
 * the value.
 */
function setNumber3D(receiver, index, value) {
  if (typeof value !== 'number') throw new TypeError('Expected number')
  if (index === M33 || index === M44) {
    if (value !== 1) receiver._is2D = false
  } else if (value !== 0) receiver._is2D = false
  return receiver._values[index] = value
}

Object.defineProperties(DOMMatrix.prototype, {
  m11: {get: function () { return this._values[M11] }, set: function (v) { return setNumber2D(this, M11, v) }},
  m12: {get: function () { return this._values[M12] }, set: function (v) { return setNumber2D(this, M12, v) }},
  m13: {get: function () { return this._values[M13] }, set: function (v) { return setNumber3D(this, M13, v) }},
  m14: {get: function () { return this._values[M14] }, set: function (v) { return setNumber3D(this, M14, v) }},
  m21: {get: function () { return this._values[M21] }, set: function (v) { return setNumber2D(this, M21, v) }},
  m22: {get: function () { return this._values[M22] }, set: function (v) { return setNumber2D(this, M22, v) }},
  m23: {get: function () { return this._values[M23] }, set: function (v) { return setNumber3D(this, M23, v) }},
  m24: {get: function () { return this._values[M24] }, set: function (v) { return setNumber3D(this, M24, v) }},
  m31: {get: function () { return this._values[M31] }, set: function (v) { return setNumber3D(this, M31, v) }},
  m32: {get: function () { return this._values[M32] }, set: function (v) { return setNumber3D(this, M32, v) }},
  m33: {get: function () { return this._values[M33] }, set: function (v) { return setNumber3D(this, M33, v) }},
  m34: {get: function () { return this._values[M34] }, set: function (v) { return setNumber3D(this, M34, v) }},
  m41: {get: function () { return this._values[M41] }, set: function (v) { return setNumber2D(this, M41, v) }},
  m42: {get: function () { return this._values[M42] }, set: function (v) { return setNumber2D(this, M42, v) }},
  m43: {get: function () { return this._values[M43] }, set: function (v) { return setNumber3D(this, M43, v) }},
  m44: {get: function () { return this._values[M44] }, set: function (v) { return setNumber3D(this, M44, v) }},

  a: {get: function () { return this.m11 }, set: function (v) { return this.m11 = v }},
  b: {get: function () { return this.m12 }, set: function (v) { return this.m12 = v }},
  c: {get: function () { return this.m21 }, set: function (v) { return this.m21 = v }},
  d: {get: function () { return this.m22 }, set: function (v) { return this.m22 = v }},
  e: {get: function () { return this.m41 }, set: function (v) { return this.m41 = v }},
  f: {get: function () { return this.m42 }, set: function (v) { return this.m42 = v }},

  is2D: {get: function () { return this._is2D }}, // read-only

  isIdentity: {
    get: function () {
      var values = this._values
      return values[M11] === 1 && values[M12] === 0 && values[M13] === 0 && values[M14] === 0 &&
             values[M21] === 0 && values[M22] === 1 && values[M23] === 0 && values[M24] === 0 &&
             values[M31] === 0 && values[M32] === 0 && values[M33] === 1 && values[M34] === 0 &&
             values[M41] === 0 && values[M42] === 0 && values[M43] === 0 && values[M44] === 1
    }
  }
})

/**
 * Instantiates a DOMMatrix, bypassing the constructor.
 * @param {Float64Array} values Value to assign to `_values`. This is assigned
 *   without copying (okay because all usages are followed by a  multiply).
 */
function newInstance(values) {
  var instance = Object.create(DOMMatrix.prototype)
  instance.constructor = DOMMatrix
  instance._is2D = true
  instance._values = values
  return instance
}

function multiply(A, B) {
  var dest = new Float64Array(16)
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var sum = 0
      for (var k = 0; k < 4; k++) {
        sum += A[i * 4 + k] * B[k * 4 + j]
      }
      dest[i * 4 + j] = sum
    }
  }
  return dest
}

DOMMatrix.prototype.multiply = function (other) {
  return newInstance(this._values).multiplySelf(other)
}
DOMMatrix.prototype.multiplySelf = function (other) {
  this._values = multiply(other._values, this._values)
  if (!other.is2D) this._is2D = false
  return this
}
DOMMatrix.prototype.preMultiplySelf = function (other) {
  this._values = multiply(this._values, other._values)
  if (!other.is2D) this._is2D = false
  return this
}

DOMMatrix.prototype.translate = function (tx, ty, tz) {
  return newInstance(this._values).translateSelf(tx, ty, tz)
}
DOMMatrix.prototype.translateSelf = function (tx, ty, tz) {
  if (typeof tx !== 'number') tx = 0
  if (typeof ty !== 'number') ty = 0
  if (typeof tz !== 'number') tz = 0
  this._values = multiply([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    tx, ty, tz, 1
  ], this._values)
  if (tz !== 0) this._is2D = false
  return this
}

DOMMatrix.prototype.scale = function (scaleX, scaleY, scaleZ, originX, originY, originZ) {
  return newInstance(this._values).scaleSelf(scaleX, scaleY, scaleZ, originX, originY, originZ)
}
DOMMatrix.prototype.scale3d = function (scale, originX, originY, originZ) {
  return newInstance(this._values).scale3dSelf(scale, originX, originY, originZ)
}
DOMMatrix.prototype.scale3dSelf = function (scale, originX, originY, originZ) {
  return this.scaleSelf(scale, scale, scale, originX, originY, originZ)
}
DOMMatrix.prototype.scaleSelf = function (scaleX, scaleY, scaleZ, originX, originY, originZ) {
  // Not redundant with translate's checks because we need to negate the values later.
  if (typeof originX !== 'number') originX = 0
  if (typeof originY !== 'number') originY = 0
  if (typeof originZ !== 'number') originZ = 0
  this.translateSelf(originX, originY, originZ)
  if (typeof scaleX !== 'number') scaleX = 1
  if (typeof scaleY !== 'number') scaleY = scaleX
  if (typeof scaleZ !== 'number') scaleZ = 1
  this._values = multiply([
    scaleX, 0, 0, 0,
    0, scaleY, 0, 0,
    0, 0, scaleZ, 0,
    0, 0, 0, 1
  ], this._values)
  this.translateSelf(-originX, -originY, -originZ)
  if (scaleZ !== 1 || originZ !== 0) this._is2D = false
  return this
}

DOMMatrix.prototype.rotateFromVector = function (x, y) {
  return newInstance(this._values).rotateFromVectorSelf(x, y)
}
DOMMatrix.prototype.rotateFromVectorSelf = function (x, y) {
  if (typeof x !== 'number') x = 0
  if (typeof y !== 'number') y = 0
  var theta = (x === 0 && y === 0) ? 0 : Math.atan2(y, x) * DEGREE_PER_RAD
  return this.rotateSelf(theta)
}
DOMMatrix.prototype.rotate = function (rotX, rotY, rotZ) {
  return newInstance(this._values).rotateSelf(rotX, rotY, rotZ)
}
DOMMatrix.prototype.rotateSelf = function (rotX, rotY, rotZ) {
  if (rotY === undefined && rotZ === undefined) {
    rotZ = rotX
    rotX = rotY = 0
  }
  if (typeof rotY !== 'number') rotY = 0
  if (typeof rotZ !== 'number') rotZ = 0
  if (rotX !== 0 || rotY !== 0) this._is2D = false
  rotX *= RAD_PER_DEGREE
  rotY *= RAD_PER_DEGREE
  rotZ *= RAD_PER_DEGREE
  var c, s
  c = Math.cos(rotZ)
  s = Math.sin(rotZ)
  this._values = multiply([
    c, s, 0, 0,
    -s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ], this._values)
  c = Math.cos(rotY)
  s = Math.sin(rotY)
  this._values = multiply([
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
  ], this._values)
  c = Math.cos(rotX)
  s = Math.sin(rotX)
  this._values = multiply([
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1
  ], this._values)
  return this
}

DOMMatrix.prototype.rotateAxisAngle = function (x, y, z, angle) {
  return newInstance(this._values).rotateAxisAngleSelf(x, y, z, angle)
}
DOMMatrix.prototype.rotateAxisAngleSelf = function (x, y, z, angle) {
  if (typeof x !== 'number') x = 0
  if (typeof y !== 'number') y = 0
  if (typeof z !== 'number') z = 0
  // Normalize axis
  var length = Math.sqrt(x * x + y * y + z * z)
  if (length === 0) return this
  if (length !== 1) {
    x /= length
    y /= length
    z /= length
  }
  angle *= RAD_PER_DEGREE
  var c = Math.cos(angle)
  var s = Math.sin(angle)
  var t = 1 - c
  var tx = t * x
  var ty = t * y
  // NB: This is the generic transform. If the axis is a major axis, there are
  // faster transforms.
  this._values = multiply([
    tx * x + c,      tx * y + s * z,  tx * z - s * y,  0,
    tx * y - s * z,  ty * y + c,      ty * z + s * x,  0,
    tx * z + s * y,  ty * z - s * x,  t * z * z + c,   0,
    0,               0,               0,               1
  ], this._values)
  if (x !== 0 || y !== 0) this._is2D = false
  return this
}

DOMMatrix.prototype.skewX = function (sx) {
  return newInstance(this._values).skewXSelf(sx)
}
DOMMatrix.prototype.skewXSelf = function (sx) {
  if (typeof sx !== 'number') return this
  var t = Math.tan(sx * RAD_PER_DEGREE)
  this._values = multiply([
    1, 0, 0, 0,
    t, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ], this._values)
  return this
}

DOMMatrix.prototype.skewY = function (sy) {
  return newInstance(this._values).skewYSelf(sy)
}
DOMMatrix.prototype.skewYSelf = function (sy) {
  if (typeof sy !== 'number') return this
  var t = Math.tan(sy * RAD_PER_DEGREE)
  this._values = multiply([
    1, t, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ], this._values)
  return this
}

DOMMatrix.prototype.flipX = function () { 
  return newInstance(multiply([
    -1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ], this._values))
}
DOMMatrix.prototype.flipY = function () {
  return newInstance(multiply([
    1, 0, 0, 0,
    0, -1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ], this._values))
}

DOMMatrix.prototype.inverse = function () {
  return newInstance(this._values).invertSelf()
}
DOMMatrix.prototype.invertSelf = function () {
  // If not invertible, set all attributes to NaN and is2D to false
  throw new Error('Not implemented')
}

DOMMatrix.prototype.setMatrixValue = function (transformList) {
  var temp = new DOMMatrix(transformList)
  this._values = temp._values
  this._is2D = temp._is2D
  return this
}

DOMMatrix.prototype.transformPoint = function (point) {
  point = new DOMPoint(point)
  var x = point.x
  var y = point.y
  var z = point.z
  var w = point.w
  var values = this._values
  var nx = values[M11] * x + values[M21] * y + values[M31] * z + values[M41] * w
  var ny = values[M12] * x + values[M22] * y + values[M32] * z + values[M42] * w
  var nz = values[M13] * x + values[M23] * y + values[M33] * z + values[M43] * w
  var nw = values[M14] * x + values[M24] * y + values[M34] * z + values[M44] * w
  return new DOMPoint(nx, ny, nz, nw)
}

DOMMatrix.prototype.toFloat32Array = function () { 
  return Float32Array.from(this._values)
}

DOMMatrix.prototype.toFloat64Array = function () { 
  return this._values.slice(0)
}

module.exports = {DOMMatrix, DOMPoint}


/***/ }),

/***/ 829:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(756);


/***/ }),

/***/ 786:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/*!
 * Canvas
 * Copyright (c) 2010 LearnBoost <tj@learnboost.com>
 * MIT Licensed
 */

const bindings = __webpack_require__(829)
const Canvas = module.exports = bindings.Canvas
const Context2d = __webpack_require__(389)
const PNGStream = __webpack_require__(734)
const PDFStream = __webpack_require__(977)
const JPEGStream = __webpack_require__(503)
const FORMATS = ['image/png', 'image/jpeg']
const util = __webpack_require__(669)

// TODO || is for Node.js pre-v6.6.0
Canvas.prototype[util.inspect.custom || 'inspect'] = function () {
  return `[Canvas ${this.width}x${this.height}]`
}

Canvas.prototype.getContext = function (contextType, contextAttributes) {
  if ('2d' == contextType) {
    var ctx = this._context2d || (this._context2d = new Context2d(this, contextAttributes));
    this.context = ctx;
    ctx.canvas = this;
    return ctx;
  }
};

Canvas.prototype.pngStream =
Canvas.prototype.createPNGStream = function(options){
  return new PNGStream(this, options);
};

Canvas.prototype.pdfStream =
Canvas.prototype.createPDFStream = function(options){
  return new PDFStream(this, options);
};

Canvas.prototype.jpegStream =
Canvas.prototype.createJPEGStream = function(options){
  return new JPEGStream(this, options);
};

Canvas.prototype.toDataURL = function(a1, a2, a3){
  // valid arg patterns (args -> [type, opts, fn]):
  // [] -> ['image/png', null, null]
  // [qual] -> ['image/png', null, null]
  // [undefined] -> ['image/png', null, null]
  // ['image/png'] -> ['image/png', null, null]
  // ['image/png', qual] -> ['image/png', null, null]
  // [fn] -> ['image/png', null, fn]
  // [type, fn] -> [type, null, fn]
  // [undefined, fn] -> ['image/png', null, fn]
  // ['image/png', qual, fn] -> ['image/png', null, fn]
  // ['image/jpeg', fn] -> ['image/jpeg', null, fn]
  // ['image/jpeg', opts, fn] -> ['image/jpeg', opts, fn]
  // ['image/jpeg', qual, fn] -> ['image/jpeg', {quality: qual}, fn]
  // ['image/jpeg', undefined, fn] -> ['image/jpeg', null, fn]
  // ['image/jpeg'] -> ['image/jpeg', null, fn]
  // ['image/jpeg', opts] -> ['image/jpeg', opts, fn]
  // ['image/jpeg', qual] -> ['image/jpeg', {quality: qual}, fn]

  var type = 'image/png';
  var opts = {};
  var fn;

  if ('function' === typeof a1) {
    fn = a1;
  } else {
    if ('string' === typeof a1 && FORMATS.includes(a1.toLowerCase())) {
      type = a1.toLowerCase();
    }

    if ('function' === typeof a2) {
      fn = a2;
    } else {
      if ('object' === typeof a2) {
        opts = a2;
      } else if ('number' === typeof a2) {
        opts = {quality: Math.max(0, Math.min(1, a2))};
      }

      if ('function' === typeof a3) {
        fn = a3;
      } else if (undefined !== a3) {
        throw new TypeError(typeof a3 + ' is not a function');
      }
    }
  }

  if (this.width === 0 || this.height === 0) {
    // Per spec, if the bitmap has no pixels, return this string:
    var str = "data:,";
    if (fn) {
      setTimeout(() => fn(null, str));
      return;
    } else {
      return str;
    }
  }

  if (fn) {
    this.toBuffer((err, buf) => {
      if (err) return fn(err);
      fn(null, `data:${type};base64,${buf.toString('base64')}`);
    }, type, opts)
  } else {
    return `data:${type};base64,${this.toBuffer(type, opts).toString('base64')}`
  }
};


/***/ }),

/***/ 389:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/*!
 * Canvas - Context2d
 * Copyright (c) 2010 LearnBoost <tj@learnboost.com>
 * MIT Licensed
 */

const bindings = __webpack_require__(829)
const parseFont = __webpack_require__(18)
const { DOMMatrix } = __webpack_require__(812)

bindings.CanvasRenderingContext2dInit(DOMMatrix, parseFont)
module.exports = bindings.CanvasRenderingContext2d


/***/ }),

/***/ 767:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/*!
 * Canvas - Image
 * Copyright (c) 2010 LearnBoost <tj@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

const bindings = __webpack_require__(829)
const Image = module.exports = bindings.Image
const util = __webpack_require__(669)

// Lazily loaded simple-get
let get;

const {GetSource, SetSource} = bindings;

Object.defineProperty(Image.prototype, 'src', {
  /**
   * src setter. Valid values:
   *  * `data:` URI
   *  * Local file path
   *  * HTTP or HTTPS URL
   *  * Buffer containing image data (i.e. not a `data:` URI stored in a Buffer)
   *
   * @param {String|Buffer} val filename, buffer, data URI, URL
   * @api public
   */
  set(val) {
    if (typeof val === 'string') {
      if (/^\s*data:/.test(val)) { // data: URI
        const commaI = val.indexOf(',')
        // 'base64' must come before the comma
        const isBase64 = val.lastIndexOf('base64', commaI) !== -1
        const content = val.slice(commaI + 1)
        setSource(this, Buffer.from(content, isBase64 ? 'base64' : 'utf8'), val);
      } else if (/^\s*https?:\/\//.test(val)) { // remote URL
        const onerror = err => {
          if (typeof this.onerror === 'function') {
            this.onerror(err)
          } else {
            throw err
          }
        }

        if (!get) get = __webpack_require__(522);

        get.concat(val, (err, res, data) => {
          if (err) return onerror(err)

          if (res.statusCode < 200 || res.statusCode >= 300) {
            return onerror(new Error(`Server responded with ${res.statusCode}`))
          }

          setSource(this, data)
        })
      } else { // local file path assumed
        setSource(this, val);
      }
    } else if (Buffer.isBuffer(val)) {
      setSource(this, val);
    }
  },

  get() {
    // TODO https://github.com/Automattic/node-canvas/issues/118
    return getSource(this);
  },

  configurable: true
});

// TODO || is for Node.js pre-v6.6.0
Image.prototype[util.inspect.custom || 'inspect'] = function(){
  return '[Image'
    + (this.complete ? ':' + this.width + 'x' + this.height : '')
    + (this.src ? ' ' + this.src : '')
    + (this.complete ? ' complete' : '')
    + ']';
};

function getSource(img){
  return img._originalSource || GetSource.call(img);
}

function setSource(img, src, origSrc){
  SetSource.call(img, src);
  img._originalSource = origSrc;
}


/***/ }),

/***/ 503:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/*!
 * Canvas - JPEGStream
 * Copyright (c) 2010 LearnBoost <tj@learnboost.com>
 * MIT Licensed
 */

var Readable = __webpack_require__(413).Readable;
var util = __webpack_require__(669);

var JPEGStream = module.exports = function JPEGStream(canvas, options) {
  if (!(this instanceof JPEGStream)) {
    throw new TypeError("Class constructors cannot be invoked without 'new'");
  }

  if (canvas.streamJPEGSync === undefined) {
    throw new Error("node-canvas was built without JPEG support.");
  }

  Readable.call(this);

  this.options = options;
  this.canvas = canvas;
};

util.inherits(JPEGStream, Readable);

function noop() {}

JPEGStream.prototype._read = function _read() {
  // For now we're not controlling the c++ code's data emission, so we only
  // call canvas.streamJPEGSync once and let it emit data at will.
  this._read = noop;
  var self = this;
  self.canvas.streamJPEGSync(this.options, function(err, chunk){
    if (err) {
      self.emit('error', err);
    } else if (chunk) {
      self.push(chunk);
    } else {
      self.push(null);
    }
  });
};


/***/ }),

/***/ 18:
/***/ ((module) => {

"use strict";


/**
 * Font RegExp helpers.
 */

const weights = 'bold|bolder|lighter|[1-9]00'
  , styles = 'italic|oblique'
  , variants = 'small-caps'
  , stretches = 'ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded'
  , units = 'px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q'
  , string = '\'([^\']+)\'|"([^"]+)"|[\\w\\s-]+'

// [ [ <‘font-style’> || <font-variant-css21> || <‘font-weight’> || <‘font-stretch’> ]?
//    <‘font-size’> [ / <‘line-height’> ]? <‘font-family’> ]
// https://drafts.csswg.org/css-fonts-3/#font-prop
const weightRe = new RegExp('(' + weights + ') +', 'i')
const styleRe = new RegExp('(' + styles + ') +', 'i')
const variantRe = new RegExp('(' + variants + ') +', 'i')
const stretchRe = new RegExp('(' + stretches + ') +', 'i')
const sizeFamilyRe = new RegExp(
  '([\\d\\.]+)(' + units + ') *'
  + '((?:' + string + ')( *, *(?:' + string + '))*)')

/**
 * Cache font parsing.
 */

const cache = {}

const defaultHeight = 16 // pt, common browser default

/**
 * Parse font `str`.
 *
 * @param {String} str
 * @return {Object} Parsed font. `size` is in device units. `unit` is the unit
 *   appearing in the input string.
 * @api private
 */

module.exports = function (str) {
  // Cached
  if (cache[str]) return cache[str]

  // Try for required properties first.
  const sizeFamily = sizeFamilyRe.exec(str)
  if (!sizeFamily) return // invalid

  // Default values and required properties
  const font = {
    weight: 'normal',
    style: 'normal',
    stretch: 'normal',
    variant: 'normal',
    size: parseFloat(sizeFamily[1]),
    unit: sizeFamily[2],
    family: sizeFamily[3].replace(/["']/g, '').replace(/ *, */g, ',')
  }

  // Optional, unordered properties.
  let weight, style, variant, stretch
  // Stop search at `sizeFamily.index`
  let substr = str.substring(0, sizeFamily.index)
  if ((weight = weightRe.exec(substr))) font.weight = weight[1]
  if ((style = styleRe.exec(substr))) font.style = style[1]
  if ((variant = variantRe.exec(substr))) font.variant = variant[1]
  if ((stretch = stretchRe.exec(substr))) font.stretch = stretch[1]

  // Convert to device units. (`font.unit` is the original unit)
  // TODO: ch, ex
  switch (font.unit) {
    case 'pt':
      font.size /= 0.75
      break
    case 'pc':
      font.size *= 16
      break
    case 'in':
      font.size *= 96
      break
    case 'cm':
      font.size *= 96.0 / 2.54
      break
    case 'mm':
      font.size *= 96.0 / 25.4
      break
    case '%':
      // TODO disabled because existing unit tests assume 100
      // font.size *= defaultHeight / 100 / 0.75
      break
    case 'em':
    case 'rem':
      font.size *= defaultHeight / 0.75
      break
    case 'q':
      font.size *= 96 / 25.4 / 4
      break
  }

  return (cache[str] = font)
}


/***/ }),

/***/ 977:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/*!
 * Canvas - PDFStream
 */

var Readable = __webpack_require__(413).Readable;
var util = __webpack_require__(669);

var PDFStream = module.exports = function PDFStream(canvas, options) {
  if (!(this instanceof PDFStream)) {
    throw new TypeError("Class constructors cannot be invoked without 'new'");
  }

  Readable.call(this);

  this.canvas = canvas;
  this.options = options;
};

util.inherits(PDFStream, Readable);

function noop() {}

PDFStream.prototype._read = function _read() {
  // For now we're not controlling the c++ code's data emission, so we only
  // call canvas.streamPDFSync once and let it emit data at will.
  this._read = noop;
  var self = this;
  self.canvas.streamPDFSync(function(err, chunk, len){
    if (err) {
      self.emit('error', err);
    } else if (len) {
      self.push(chunk);
    } else {
      self.push(null);
    }
  }, this.options);
};


/***/ }),

/***/ 734:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/*!
 * Canvas - PNGStream
 * Copyright (c) 2010 LearnBoost <tj@learnboost.com>
 * MIT Licensed
 */

var Readable = __webpack_require__(413).Readable;
var util = __webpack_require__(669);

var PNGStream = module.exports = function PNGStream(canvas, options) {
  if (!(this instanceof PNGStream)) {
    throw new TypeError("Class constructors cannot be invoked without 'new'");
  }

  Readable.call(this);

  if (options &&
    options.palette instanceof Uint8ClampedArray &&
    options.palette.length % 4 !== 0) {
    throw new Error("Palette length must be a multiple of 4.");
  }
  this.canvas = canvas;
  this.options = options || {};
};

util.inherits(PNGStream, Readable);

function noop() {}

PNGStream.prototype._read = function _read() {
  // For now we're not controlling the c++ code's data emission, so we only
  // call canvas.streamPNGSync once and let it emit data at will.
  this._read = noop;
  var self = this;
  self.canvas.streamPNGSync(function(err, chunk, len){
    if (err) {
      self.emit('error', err);
    } else if (len) {
      self.push(chunk);
    } else {
      self.push(null);
    }
  }, self.options);
};


/***/ }),

/***/ 391:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const {PassThrough: PassThroughStream} = __webpack_require__(413);
const zlib = __webpack_require__(761);
const mimicResponse = __webpack_require__(610);

const decompressResponse = response => {
	const contentEncoding = (response.headers['content-encoding'] || '').toLowerCase();

	if (!['gzip', 'deflate', 'br'].includes(contentEncoding)) {
		return response;
	}

	const isBrotli = contentEncoding === 'br';
	if (isBrotli && typeof zlib.createBrotliDecompress !== 'function') {
		return response;
	}

	const decompress = isBrotli ? zlib.createBrotliDecompress() : zlib.createUnzip();
	const stream = new PassThroughStream();

	mimicResponse(response, stream);

	decompress.on('error', error => {
		// Ignore empty response
		if (error.code === 'Z_BUF_ERROR') {
			stream.end();
			return;
		}

		stream.emit('error', error);
	});

	response.pipe(decompress).pipe(stream);

	return stream;
};

module.exports = decompressResponse;
// TODO: remove this in the next major version
module.exports.default = decompressResponse;


/***/ }),

/***/ 610:
/***/ ((module) => {

"use strict";


// We define these manually to ensure they're always copied
// even if they would move up the prototype chain
// https://nodejs.org/api/http.html#http_class_http_incomingmessage
const knownProperties = [
	'aborted',
	'complete',
	'destroy',
	'headers',
	'httpVersion',
	'httpVersionMinor',
	'httpVersionMajor',
	'method',
	'rawHeaders',
	'rawTrailers',
	'setTimeout',
	'socket',
	'statusCode',
	'statusMessage',
	'trailers',
	'url'
];

module.exports = (fromStream, toStream) => {
	const fromProperties = new Set(Object.keys(fromStream).concat(knownProperties));

	for (const property of fromProperties) {
		// Don't overwrite existing properties.
		if (property in toStream) {
			continue;
		}

		toStream[property] = typeof fromStream[property] === 'function' ? fromStream[property].bind(fromStream) : fromStream[property];
	}

	return toStream;
};


/***/ }),

/***/ 223:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wrappy = __webpack_require__(940)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 963:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const resemble = __webpack_require__(558);

module.exports = function compareImages(image1, image2, options) {
    return new Promise((resolve, reject) => {
        resemble.compare(image1, image2, options, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};


/***/ }),

/***/ 558:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*
James Cryer / Huddle
URL: https://github.com/Huddle/Resemble.js
*/

var naiveFallback = function () {
    // ISC (c) 2011-2019 https://github.com/medikoo/es5-ext/blob/master/global.js
    if (typeof self === "object" && self) {
        return self;
    }
    if (typeof window === "object" && window) {
        return window;
    }
    throw new Error("Unable to resolve global `this`");
};

var getGlobalThis = function () {
    // ISC (c) 2011-2019 https://github.com/medikoo/es5-ext/blob/master/global.js
    // Fallback to standard globalThis if available
    if (typeof globalThis === "object" && globalThis) {
        return globalThis;
    }

    try {
        Object.defineProperty(Object.prototype, "__global__", {
            get: function () {
                return this;
            },
            configurable: true
        });
    } catch (error) {
        return naiveFallback();
    }
    try {
        // eslint-disable-next-line no-undef
        if (!__global__) {
            return naiveFallback();
        }
        return __global__; // eslint-disable-line no-undef
    } finally {
        delete Object.prototype.__global__;
    }
};

var isNode = function () {
    const globalPolyfill = getGlobalThis();
    return typeof globalPolyfill.process !== "undefined" && globalPolyfill.process.versions && globalPolyfill.process.versions.node;
};

(function (root, factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if ( true && module.exports) {
        module.exports = factory();
    } else {
        root.resemble = factory();
    }
})(this /* eslint-disable-line no-invalid-this*/, function () {
    "use strict";

    var Img;
    var Canvas;
    var loadNodeCanvasImage;

    if (isNode()) {
        Canvas = __webpack_require__(771); // eslint-disable-line global-require
        Img = Canvas.Image;
        loadNodeCanvasImage = Canvas.loadImage;
    } else {
        Img = Image;
    }

    function createCanvas(width, height) {
        if (isNode()) {
            return Canvas.createCanvas(width, height);
        }

        var cnvs = document.createElement("canvas");
        cnvs.width = width;
        cnvs.height = height;
        return cnvs;
    }

    var oldGlobalSettings = {};
    var globalOutputSettings = oldGlobalSettings;

    var resemble = function (fileData) {
        var pixelTransparency = 1;

        var errorPixelColor = {
            // Color for Error Pixels. Between 0 and 255.
            red: 255,
            green: 0,
            blue: 255,
            alpha: 255
        };

        var targetPix = { r: 0, g: 0, b: 0, a: 0 }; // isAntialiased

        var errorPixelTransform = {
            flat: function (px, offset) {
                px[offset] = errorPixelColor.red;
                px[offset + 1] = errorPixelColor.green;
                px[offset + 2] = errorPixelColor.blue;
                px[offset + 3] = errorPixelColor.alpha;
            },
            movement: function (px, offset, d1, d2) {
                px[offset] = (d2.r * (errorPixelColor.red / 255) + errorPixelColor.red) / 2;
                px[offset + 1] = (d2.g * (errorPixelColor.green / 255) + errorPixelColor.green) / 2;
                px[offset + 2] = (d2.b * (errorPixelColor.blue / 255) + errorPixelColor.blue) / 2;
                px[offset + 3] = d2.a;
            },
            flatDifferenceIntensity: function (px, offset, d1, d2) {
                px[offset] = errorPixelColor.red;
                px[offset + 1] = errorPixelColor.green;
                px[offset + 2] = errorPixelColor.blue;
                px[offset + 3] = colorsDistance(d1, d2);
            },
            movementDifferenceIntensity: function (px, offset, d1, d2) {
                var ratio = (colorsDistance(d1, d2) / 255) * 0.8;

                px[offset] = (1 - ratio) * (d2.r * (errorPixelColor.red / 255)) + ratio * errorPixelColor.red;
                px[offset + 1] = (1 - ratio) * (d2.g * (errorPixelColor.green / 255)) + ratio * errorPixelColor.green;
                px[offset + 2] = (1 - ratio) * (d2.b * (errorPixelColor.blue / 255)) + ratio * errorPixelColor.blue;
                px[offset + 3] = d2.a;
            },
            diffOnly: function (px, offset, d1, d2) {
                px[offset] = d2.r;
                px[offset + 1] = d2.g;
                px[offset + 2] = d2.b;
                px[offset + 3] = d2.a;
            }
        };

        var errorPixel = errorPixelTransform.flat;
        var errorType;
        var boundingBoxes;
        var ignoredBoxes;
        var ignoreAreasColoredWith;
        var largeImageThreshold = 1200;
        var useCrossOrigin = true;
        var data = {};
        var images = [];
        var updateCallbackArray = [];

        var tolerance = {
            // between 0 and 255
            red: 16,
            green: 16,
            blue: 16,
            alpha: 16,
            minBrightness: 16,
            maxBrightness: 240
        };

        var ignoreAntialiasing = false;
        var ignoreColors = false;
        var scaleToSameSize = false;
        var compareOnly = false;
        var returnEarlyThreshold;

        function colorsDistance(c1, c2) {
            return (Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b)) / 3;
        }

        function withinBoundingBox(x, y, width, height, box) {
            return x > (box.left || 0) && x < (box.right || width) && y > (box.top || 0) && y < (box.bottom || height);
        }

        function withinComparedArea(x, y, width, height, pixel2) {
            var isIncluded = true;
            var i;
            var boundingBox;
            var ignoredBox;
            var selected;
            var ignored;

            if (boundingBoxes instanceof Array) {
                selected = false;
                for (i = 0; i < boundingBoxes.length; i++) {
                    boundingBox = boundingBoxes[i];
                    if (withinBoundingBox(x, y, width, height, boundingBox)) {
                        selected = true;
                        break;
                    }
                }
            }
            if (ignoredBoxes instanceof Array) {
                ignored = true;
                for (i = 0; i < ignoredBoxes.length; i++) {
                    ignoredBox = ignoredBoxes[i];
                    if (withinBoundingBox(x, y, width, height, ignoredBox)) {
                        ignored = false;
                        break;
                    }
                }
            }

            if (ignoreAreasColoredWith) {
                return colorsDistance(pixel2, ignoreAreasColoredWith) !== 0;
            }

            if (selected === undefined && ignored === undefined) {
                return true;
            }
            if (selected === false && ignored === true) {
                return false;
            }
            if (selected === true || ignored === true) {
                isIncluded = true;
            }
            if (selected === false || ignored === false) {
                isIncluded = false;
            }
            return isIncluded;
        }

        function triggerDataUpdate() {
            var len = updateCallbackArray.length;
            var i;
            for (i = 0; i < len; i++) {
                if (typeof updateCallbackArray[i] === "function") {
                    updateCallbackArray[i](data);
                }
            }
        }

        function loop(w, h, callback) {
            var x;
            var y;

            for (x = 0; x < w; x++) {
                for (y = 0; y < h; y++) {
                    callback(x, y);
                }
            }
        }

        function parseImage(sourceImageData, width, height) {
            var pixelCount = 0;
            var redTotal = 0;
            var greenTotal = 0;
            var blueTotal = 0;
            var alphaTotal = 0;
            var brightnessTotal = 0;
            var whiteTotal = 0;
            var blackTotal = 0;

            loop(width, height, function (horizontalPos, verticalPos) {
                var offset = (verticalPos * width + horizontalPos) * 4;
                var red = sourceImageData[offset];
                var green = sourceImageData[offset + 1];
                var blue = sourceImageData[offset + 2];
                var alpha = sourceImageData[offset + 3];
                var brightness = getBrightness(red, green, blue);

                if (red === green && red === blue && alpha) {
                    if (red === 0) {
                        blackTotal++;
                    } else if (red === 255) {
                        whiteTotal++;
                    }
                }

                pixelCount++;

                redTotal += (red / 255) * 100;
                greenTotal += (green / 255) * 100;
                blueTotal += (blue / 255) * 100;
                alphaTotal += ((255 - alpha) / 255) * 100;
                brightnessTotal += (brightness / 255) * 100;
            });

            data.red = Math.floor(redTotal / pixelCount);
            data.green = Math.floor(greenTotal / pixelCount);
            data.blue = Math.floor(blueTotal / pixelCount);
            data.alpha = Math.floor(alphaTotal / pixelCount);
            data.brightness = Math.floor(brightnessTotal / pixelCount);
            data.white = Math.floor((whiteTotal / pixelCount) * 100);
            data.black = Math.floor((blackTotal / pixelCount) * 100);

            triggerDataUpdate();
        }

        function onLoadImage(hiddenImage, callback) {
            // don't assign to hiddenImage, see https://github.com/Huddle/Resemble.js/pull/87/commits/300d43352a2845aad289b254bfbdc7cd6a37e2d7
            var width = hiddenImage.width;
            var height = hiddenImage.height;

            if (scaleToSameSize && images.length === 1) {
                width = images[0].width;
                height = images[0].height;
            }

            var hiddenCanvas = createCanvas(width, height);
            var imageData;

            hiddenCanvas.getContext("2d").drawImage(hiddenImage, 0, 0, width, height);
            imageData = hiddenCanvas.getContext("2d").getImageData(0, 0, width, height);

            images.push(imageData);

            callback(imageData, width, height);
        }

        function loadImageData(fileDataForImage, callback) {
            var fileReader;
            var hiddenImage = new Img();

            if (!hiddenImage.setAttribute) {
                hiddenImage.setAttribute = function setAttribute() {};
            }

            if (useCrossOrigin) {
                hiddenImage.setAttribute("crossorigin", "anonymous");
            }

            hiddenImage.onerror = function (err) {
                hiddenImage.onload = null;
                hiddenImage.onerror = null; // fixes pollution between calls
                images.push({ error: err ? err + "" : "Image load error." });
                callback();
            };

            hiddenImage.onload = function () {
                hiddenImage.onload = null; // fixes pollution between calls
                hiddenImage.onerror = null;
                onLoadImage(hiddenImage, callback);
            };

            if (typeof fileDataForImage === "string") {
                hiddenImage.src = fileDataForImage;
                if (!isNode() && hiddenImage.complete && hiddenImage.naturalWidth > 0) {
                    hiddenImage.onload();
                }
            } else if (
                typeof fileDataForImage.data !== "undefined" &&
                typeof fileDataForImage.width === "number" &&
                typeof fileDataForImage.height === "number"
            ) {
                images.push(fileDataForImage);

                callback(fileDataForImage, fileDataForImage.width, fileDataForImage.height);
            } else if (typeof Buffer !== "undefined" && fileDataForImage instanceof Buffer) {
                // If we have Buffer, assume we're on Node+Canvas and its supported
                // hiddenImage.src = fileDataForImage;

                loadNodeCanvasImage(fileDataForImage)
                    .then(function (image) {
                        hiddenImage.onload = null; // fixes pollution between calls
                        hiddenImage.onerror = null;
                        onLoadImage(image, callback);
                    })
                    .catch(function (err) {
                        images.push({
                            error: err ? err + "" : "Image load error."
                        });
                        callback();
                    });
            } else {
                fileReader = new FileReader();
                fileReader.onload = function (event) {
                    hiddenImage.src = event.target.result;
                };
                fileReader.readAsDataURL(fileDataForImage);
            }
        }

        function isColorSimilar(a, b, color) {
            var absDiff = Math.abs(a - b);

            if (typeof a === "undefined") {
                return false;
            }
            if (typeof b === "undefined") {
                return false;
            }

            if (a === b) {
                return true;
            } else if (absDiff < tolerance[color]) {
                return true;
            }
            return false;
        }

        function isPixelBrightnessSimilar(d1, d2) {
            var alpha = isColorSimilar(d1.a, d2.a, "alpha");
            var brightness = isColorSimilar(d1.brightness, d2.brightness, "minBrightness");
            return brightness && alpha;
        }

        function getBrightness(r, g, b) {
            return 0.3 * r + 0.59 * g + 0.11 * b;
        }

        function isRGBSame(d1, d2) {
            var red = d1.r === d2.r;
            var green = d1.g === d2.g;
            var blue = d1.b === d2.b;
            return red && green && blue;
        }

        function isRGBSimilar(d1, d2) {
            var red = isColorSimilar(d1.r, d2.r, "red");
            var green = isColorSimilar(d1.g, d2.g, "green");
            var blue = isColorSimilar(d1.b, d2.b, "blue");
            var alpha = isColorSimilar(d1.a, d2.a, "alpha");

            return red && green && blue && alpha;
        }

        function isContrasting(d1, d2) {
            return Math.abs(d1.brightness - d2.brightness) > tolerance.maxBrightness;
        }

        function getHue(red, green, blue) {
            var r = red / 255;
            var g = green / 255;
            var b = blue / 255;
            var max = Math.max(r, g, b);
            var min = Math.min(r, g, b);
            var h;
            var d;

            if (max === min) {
                h = 0; // achromatic
            } else {
                d = max - min;
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                    default:
                        h /= 6;
                }
            }

            return h;
        }

        function isAntialiased(sourcePix, pix, cacheSet, verticalPos, horizontalPos, width) {
            var offset;
            var distance = 1;
            var i;
            var j;
            var hasHighContrastSibling = 0;
            var hasSiblingWithDifferentHue = 0;
            var hasEquivalentSibling = 0;

            addHueInfo(sourcePix);

            for (i = distance * -1; i <= distance; i++) {
                for (j = distance * -1; j <= distance; j++) {
                    if (i === 0 && j === 0) {
                        // ignore source pixel
                    } else {
                        offset = ((verticalPos + j) * width + (horizontalPos + i)) * 4;

                        if (!getPixelInfo(targetPix, pix, offset, cacheSet)) {
                            continue;
                        }

                        addBrightnessInfo(targetPix);
                        addHueInfo(targetPix);

                        if (isContrasting(sourcePix, targetPix)) {
                            hasHighContrastSibling++;
                        }

                        if (isRGBSame(sourcePix, targetPix)) {
                            hasEquivalentSibling++;
                        }

                        if (Math.abs(targetPix.h - sourcePix.h) > 0.3) {
                            hasSiblingWithDifferentHue++;
                        }

                        if (hasSiblingWithDifferentHue > 1 || hasHighContrastSibling > 1) {
                            return true;
                        }
                    }
                }
            }

            if (hasEquivalentSibling < 2) {
                return true;
            }

            return false;
        }

        function copyPixel(px, offset, pix) {
            if (errorType === "diffOnly") {
                return;
            }

            px[offset] = pix.r; // r
            px[offset + 1] = pix.g; // g
            px[offset + 2] = pix.b; // b
            px[offset + 3] = pix.a * pixelTransparency; // a
        }

        function copyGrayScalePixel(px, offset, pix) {
            if (errorType === "diffOnly") {
                return;
            }

            px[offset] = pix.brightness; // r
            px[offset + 1] = pix.brightness; // g
            px[offset + 2] = pix.brightness; // b
            px[offset + 3] = pix.a * pixelTransparency; // a
        }

        function getPixelInfo(dst, pix, offset) {
            if (pix.length > offset) {
                dst.r = pix[offset];
                dst.g = pix[offset + 1];
                dst.b = pix[offset + 2];
                dst.a = pix[offset + 3];

                return true;
            }

            return false;
        }

        function addBrightnessInfo(pix) {
            pix.brightness = getBrightness(pix.r, pix.g, pix.b); // 'corrected' lightness
        }

        function addHueInfo(pix) {
            pix.h = getHue(pix.r, pix.g, pix.b);
        }

        function analyseImages(img1, img2, width, height) {
            var data1 = img1.data;
            var data2 = img2.data;
            var hiddenCanvas;
            var context;
            var imgd;
            var pix;

            if (!compareOnly) {
                hiddenCanvas = createCanvas(width, height);

                context = hiddenCanvas.getContext("2d");
                imgd = context.createImageData(width, height);
                pix = imgd.data;
            }

            var mismatchCount = 0;
            var diffBounds = {
                top: height,
                left: width,
                bottom: 0,
                right: 0
            };
            var updateBounds = function (x, y) {
                diffBounds.left = Math.min(x, diffBounds.left);
                diffBounds.right = Math.max(x, diffBounds.right);
                diffBounds.top = Math.min(y, diffBounds.top);
                diffBounds.bottom = Math.max(y, diffBounds.bottom);
            };

            var time = Date.now();

            var skip;

            if (!!largeImageThreshold && ignoreAntialiasing && (width > largeImageThreshold || height > largeImageThreshold)) {
                skip = 6;
            }

            var pixel1 = { r: 0, g: 0, b: 0, a: 0 };
            var pixel2 = { r: 0, g: 0, b: 0, a: 0 };

            var skipTheRest = false;

            loop(width, height, function (horizontalPos, verticalPos) {
                if (skipTheRest) {
                    return;
                }

                if (skip) {
                    // only skip if the image isn't small
                    if (verticalPos % skip === 0 || horizontalPos % skip === 0) {
                        return;
                    }
                }

                var offset = (verticalPos * width + horizontalPos) * 4;
                if (!getPixelInfo(pixel1, data1, offset, 1) || !getPixelInfo(pixel2, data2, offset, 2)) {
                    return;
                }

                var isWithinComparedArea = withinComparedArea(horizontalPos, verticalPos, width, height, pixel2);

                if (ignoreColors) {
                    addBrightnessInfo(pixel1);
                    addBrightnessInfo(pixel2);

                    if (isPixelBrightnessSimilar(pixel1, pixel2) || !isWithinComparedArea) {
                        if (!compareOnly) {
                            copyGrayScalePixel(pix, offset, pixel2);
                        }
                    } else {
                        if (!compareOnly) {
                            errorPixel(pix, offset, pixel1, pixel2);
                        }

                        mismatchCount++;
                        updateBounds(horizontalPos, verticalPos);
                    }
                    return;
                }

                if (isRGBSimilar(pixel1, pixel2) || !isWithinComparedArea) {
                    if (!compareOnly) {
                        copyPixel(pix, offset, pixel1);
                    }
                } else if (
                    ignoreAntialiasing &&
                    (addBrightnessInfo(pixel1), // jit pixel info augmentation looks a little weird, sorry.
                    addBrightnessInfo(pixel2),
                    isAntialiased(pixel1, data1, 1, verticalPos, horizontalPos, width) || isAntialiased(pixel2, data2, 2, verticalPos, horizontalPos, width))
                ) {
                    if (isPixelBrightnessSimilar(pixel1, pixel2) || !isWithinComparedArea) {
                        if (!compareOnly) {
                            copyGrayScalePixel(pix, offset, pixel2);
                        }
                    } else {
                        if (!compareOnly) {
                            errorPixel(pix, offset, pixel1, pixel2);
                        }

                        mismatchCount++;
                        updateBounds(horizontalPos, verticalPos);
                    }
                } else {
                    if (!compareOnly) {
                        errorPixel(pix, offset, pixel1, pixel2);
                    }

                    mismatchCount++;
                    updateBounds(horizontalPos, verticalPos);
                }

                if (compareOnly) {
                    var currentMisMatchPercent = (mismatchCount / (height * width)) * 100;

                    if (currentMisMatchPercent > returnEarlyThreshold) {
                        skipTheRest = true;
                    }
                }
            });

            data.rawMisMatchPercentage = (mismatchCount / (height * width)) * 100;
            data.misMatchPercentage = data.rawMisMatchPercentage.toFixed(2);
            data.diffBounds = diffBounds;
            data.analysisTime = Date.now() - time;

            data.getImageDataUrl = function (text) {
                if (compareOnly) {
                    throw Error("No diff image available - ran in compareOnly mode");
                }

                var barHeight = 0;

                if (text) {
                    barHeight = addLabel(text, context, hiddenCanvas);
                }

                context.putImageData(imgd, 0, barHeight);

                return hiddenCanvas.toDataURL("image/png");
            };

            if (!compareOnly && hiddenCanvas.toBuffer) {
                data.getBuffer = function (includeOriginal) {
                    if (includeOriginal) {
                        var imageWidth = hiddenCanvas.width + 2;
                        hiddenCanvas.width = imageWidth * 3;
                        context.putImageData(img1, 0, 0);
                        context.putImageData(img2, imageWidth, 0);
                        context.putImageData(imgd, imageWidth * 2, 0);
                    } else {
                        context.putImageData(imgd, 0, 0);
                    }
                    return hiddenCanvas.toBuffer();
                };
            }
        }

        function addLabel(text, context, hiddenCanvas) {
            var textPadding = 2;

            context.font = "12px sans-serif";

            var textWidth = context.measureText(text).width + textPadding * 2;
            var barHeight = 22;

            if (textWidth > hiddenCanvas.width) {
                hiddenCanvas.width = textWidth;
            }

            hiddenCanvas.height += barHeight;

            context.fillStyle = "#666";
            context.fillRect(0, 0, hiddenCanvas.width, barHeight - 4);
            context.fillStyle = "#fff";
            context.fillRect(0, barHeight - 4, hiddenCanvas.width, 4);

            context.fillStyle = "#fff";
            context.textBaseline = "top";
            context.font = "12px sans-serif";
            context.fillText(text, textPadding, 1);

            return barHeight;
        }

        function normalise(img, w, h) {
            var c;
            var context;

            if (img.height < h || img.width < w) {
                c = createCanvas(w, h);
                context = c.getContext("2d");
                context.putImageData(img, 0, 0);
                return context.getImageData(0, 0, w, h);
            }

            return img;
        }

        function outputSettings(options) {
            var key;

            if (options.errorColor) {
                for (key in options.errorColor) {
                    if (options.errorColor.hasOwnProperty(key)) {
                        errorPixelColor[key] = options.errorColor[key] === void 0 ? errorPixelColor[key] : options.errorColor[key];
                    }
                }
            }

            if (options.errorType && errorPixelTransform[options.errorType]) {
                errorPixel = errorPixelTransform[options.errorType];
                errorType = options.errorType;
            }

            if (options.errorPixel && typeof options.errorPixel === "function") {
                errorPixel = options.errorPixel;
            }

            pixelTransparency = isNaN(Number(options.transparency)) ? pixelTransparency : options.transparency;

            if (options.largeImageThreshold !== undefined) {
                largeImageThreshold = options.largeImageThreshold;
            }

            if (options.useCrossOrigin !== undefined) {
                useCrossOrigin = options.useCrossOrigin;
            }

            if (options.boundingBox !== undefined) {
                boundingBoxes = [options.boundingBox];
            }

            if (options.ignoredBox !== undefined) {
                ignoredBoxes = [options.ignoredBox];
            }

            if (options.boundingBoxes !== undefined) {
                boundingBoxes = options.boundingBoxes;
            }

            if (options.ignoredBoxes !== undefined) {
                ignoredBoxes = options.ignoredBoxes;
            }

            if (options.ignoreAreasColoredWith !== undefined) {
                ignoreAreasColoredWith = options.ignoreAreasColoredWith;
            }
        }

        function compare(one, two) {
            if (globalOutputSettings !== oldGlobalSettings) {
                outputSettings(globalOutputSettings);
            }

            function onceWeHaveBoth() {
                var width;
                var height;
                if (images.length === 2) {
                    if (images[0].error || images[1].error) {
                        data = {};
                        data.error = images[0].error ? images[0].error : images[1].error;
                        triggerDataUpdate();
                        return;
                    }
                    width = images[0].width > images[1].width ? images[0].width : images[1].width;
                    height = images[0].height > images[1].height ? images[0].height : images[1].height;

                    if (images[0].width === images[1].width && images[0].height === images[1].height) {
                        data.isSameDimensions = true;
                    } else {
                        data.isSameDimensions = false;
                    }

                    data.dimensionDifference = {
                        width: images[0].width - images[1].width,
                        height: images[0].height - images[1].height
                    };

                    analyseImages(normalise(images[0], width, height), normalise(images[1], width, height), width, height);

                    triggerDataUpdate();
                }
            }

            images = [];
            loadImageData(one, onceWeHaveBoth);
            loadImageData(two, onceWeHaveBoth);
        }

        function getCompareApi(param) {
            var secondFileData;
            var hasMethod = typeof param === "function";

            if (!hasMethod) {
                // assume it's file data
                secondFileData = param;
            }

            var self = {
                setReturnEarlyThreshold: function (threshold) {
                    if (threshold) {
                        compareOnly = true;
                        returnEarlyThreshold = threshold;
                    }
                    return self;
                },
                scaleToSameSize: function () {
                    scaleToSameSize = true;

                    if (hasMethod) {
                        param();
                    }
                    return self;
                },
                useOriginalSize: function () {
                    scaleToSameSize = false;

                    if (hasMethod) {
                        param();
                    }
                    return self;
                },
                ignoreNothing: function () {
                    tolerance.red = 0;
                    tolerance.green = 0;
                    tolerance.blue = 0;
                    tolerance.alpha = 0;
                    tolerance.minBrightness = 0;
                    tolerance.maxBrightness = 255;

                    ignoreAntialiasing = false;
                    ignoreColors = false;

                    if (hasMethod) {
                        param();
                    }
                    return self;
                },
                ignoreLess: function () {
                    tolerance.red = 16;
                    tolerance.green = 16;
                    tolerance.blue = 16;
                    tolerance.alpha = 16;
                    tolerance.minBrightness = 16;
                    tolerance.maxBrightness = 240;

                    ignoreAntialiasing = false;
                    ignoreColors = false;

                    if (hasMethod) {
                        param();
                    }
                    return self;
                },
                ignoreAntialiasing: function () {
                    tolerance.red = 32;
                    tolerance.green = 32;
                    tolerance.blue = 32;
                    tolerance.alpha = 32;
                    tolerance.minBrightness = 64;
                    tolerance.maxBrightness = 96;

                    ignoreAntialiasing = true;
                    ignoreColors = false;

                    if (hasMethod) {
                        param();
                    }
                    return self;
                },
                ignoreColors: function () {
                    tolerance.alpha = 16;
                    tolerance.minBrightness = 16;
                    tolerance.maxBrightness = 240;

                    ignoreAntialiasing = false;
                    ignoreColors = true;

                    if (hasMethod) {
                        param();
                    }
                    return self;
                },
                ignoreAlpha: function () {
                    tolerance.red = 16;
                    tolerance.green = 16;
                    tolerance.blue = 16;
                    tolerance.alpha = 255;
                    tolerance.minBrightness = 16;
                    tolerance.maxBrightness = 240;

                    ignoreAntialiasing = false;
                    ignoreColors = false;

                    if (hasMethod) {
                        param();
                    }
                    return self;
                },
                repaint: function () {
                    if (hasMethod) {
                        param();
                    }
                    return self;
                },
                outputSettings: function (options) {
                    outputSettings(options);
                    return self;
                },
                onComplete: function (callback) {
                    updateCallbackArray.push(callback);

                    var wrapper = function () {
                        compare(fileData, secondFileData);
                    };

                    wrapper();

                    return getCompareApi(wrapper);
                }
            };

            return self;
        }

        var rootSelf = {
            onComplete: function (callback) {
                updateCallbackArray.push(callback);
                loadImageData(fileData, function (imageData, width, height) {
                    parseImage(imageData.data, width, height);
                });
            },
            compareTo: function (secondFileData) {
                return getCompareApi(secondFileData);
            },
            outputSettings: function (options) {
                outputSettings(options);
                return rootSelf;
            }
        };

        return rootSelf;
    };

    function setGlobalOutputSettings(settings) {
        globalOutputSettings = settings;
        return resemble;
    }

    function applyIgnore(api, ignore) {
        switch (ignore) {
            case "nothing":
                api.ignoreNothing();
                break;
            case "less":
                api.ignoreLess();
                break;
            case "antialiasing":
                api.ignoreAntialiasing();
                break;
            case "colors":
                api.ignoreColors();
                break;
            case "alpha":
                api.ignoreAlpha();
                break;
            default:
                throw new Error("Invalid ignore: " + ignore);
        }
    }

    resemble.compare = function (image1, image2, options, cb) {
        var callback;
        var opt;

        if (typeof options === "function") {
            callback = options;
            opt = {};
        } else {
            callback = cb;
            opt = options || {};
        }

        var res = resemble(image1);
        var compare;

        if (opt.output) {
            res.outputSettings(opt.output);
        }

        compare = res.compareTo(image2);

        if (opt.returnEarlyThreshold) {
            compare.setReturnEarlyThreshold(opt.returnEarlyThreshold);
        }

        if (opt.scaleToSameSize) {
            compare.scaleToSameSize();
        }

        if (typeof opt.ignore === "string") {
            applyIgnore(compare, opt.ignore);
        } else if (opt.ignore && opt.ignore.forEach) {
            opt.ignore.forEach(function (v) {
                applyIgnore(compare, v);
            });
        }

        compare.onComplete(function (data) {
            if (data.error) {
                callback(data.error);
            } else {
                callback(null, data);
            }
        });
    };

    resemble.outputSettings = setGlobalOutputSettings;
    return resemble;
});


/***/ }),

/***/ 854:
/***/ ((module) => {

/*! simple-concat. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
module.exports = function (stream, cb) {
  var chunks = []
  stream.on('data', function (chunk) {
    chunks.push(chunk)
  })
  stream.once('end', function () {
    if (cb) cb(null, Buffer.concat(chunks))
    cb = null
  })
  stream.once('error', function (err) {
    if (cb) cb(err)
    cb = null
  })
}


/***/ }),

/***/ 522:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = simpleGet

const concat = __webpack_require__(854)
const decompressResponse = __webpack_require__(391) // excluded from browser build
const http = __webpack_require__(605)
const https = __webpack_require__(211)
const once = __webpack_require__(223)
const querystring = __webpack_require__(191)
const url = __webpack_require__(835)

const isStream = o => o !== null && typeof o === 'object' && typeof o.pipe === 'function'

function simpleGet (opts, cb) {
  opts = Object.assign({ maxRedirects: 10 }, typeof opts === 'string' ? { url: opts } : opts)
  cb = once(cb)

  if (opts.url) {
    const { hostname, port, protocol, auth, path } = url.parse(opts.url) // eslint-disable-line node/no-deprecated-api
    delete opts.url
    if (!hostname && !port && !protocol && !auth) opts.path = path // Relative redirect
    else Object.assign(opts, { hostname, port, protocol, auth, path }) // Absolute redirect
  }

  const headers = { 'accept-encoding': 'gzip, deflate' }
  if (opts.headers) Object.keys(opts.headers).forEach(k => (headers[k.toLowerCase()] = opts.headers[k]))
  opts.headers = headers

  let body
  if (opts.body) {
    body = opts.json && !isStream(opts.body) ? JSON.stringify(opts.body) : opts.body
  } else if (opts.form) {
    body = typeof opts.form === 'string' ? opts.form : querystring.stringify(opts.form)
    opts.headers['content-type'] = 'application/x-www-form-urlencoded'
  }

  if (body) {
    if (!opts.method) opts.method = 'POST'
    if (!isStream(body)) opts.headers['content-length'] = Buffer.byteLength(body)
    if (opts.json && !opts.form) opts.headers['content-type'] = 'application/json'
  }
  delete opts.body; delete opts.form

  if (opts.json) opts.headers.accept = 'application/json'
  if (opts.method) opts.method = opts.method.toUpperCase()

  const protocol = opts.protocol === 'https:' ? https : http // Support http/https urls
  const req = protocol.request(opts, res => {
    if (opts.followRedirects !== false && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      opts.url = res.headers.location // Follow 3xx redirects
      delete opts.headers.host // Discard `host` header on redirect (see #32)
      res.resume() // Discard response

      if (opts.method === 'POST' && [301, 302].includes(res.statusCode)) {
        opts.method = 'GET' // On 301/302 redirect, change POST to GET (see #35)
        delete opts.headers['content-length']; delete opts.headers['content-type']
      }

      if (opts.maxRedirects-- === 0) return cb(new Error('too many redirects'))
      else return simpleGet(opts, cb)
    }

    const tryUnzip = typeof decompressResponse === 'function' && opts.method !== 'HEAD'
    cb(null, tryUnzip ? decompressResponse(res) : res)
  })
  req.on('timeout', () => {
    req.abort()
    cb(new Error('Request timed out'))
  })
  req.on('error', cb)

  if (isStream(body)) body.on('error', cb).pipe(req)
  else req.end(body)

  return req
}

simpleGet.concat = (opts, cb) => {
  return simpleGet(opts, (err, res) => {
    if (err) return cb(err)
    concat(res, (err, data) => {
      if (err) return cb(err)
      if (opts.json) {
        try {
          data = JSON.parse(data.toString())
        } catch (err) {
          return cb(err, res, data)
        }
      }
      cb(null, res, data)
    })
  })
}

;['get', 'post', 'put', 'patch', 'head', 'delete'].forEach(method => {
  simpleGet[method] = (opts, cb) => {
    if (typeof opts === 'string') opts = { url: opts }
    return simpleGet(Object.assign({ method: method.toUpperCase() }, opts), cb)
  }
})


/***/ }),

/***/ 940:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 351:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

const core = __webpack_require__(186);
const path = __webpack_require__(622);
const utils = __webpack_require__(608);

async function run() {
  try {
    const imgPath1 = core.getInput('img_1');
    const imgPath2 = core.getInput('img_2');
    const errorColorString = core.getInput('error_color');
    const maskPath = core.getInput('mask');
    const boxSting = core.getInput('box');
    
    // TODO: Produce boxes based on mask....

    const errorColorObj = utils.parseColorOption(errorColorString);
    const boxObj = utils.parseBoxOption(boxSting);

    let options = {
      output: {
          errorColor: errorColorObj,
          ignoredBox: boxObj,
          errorType: "flat",
          //transparency: 0.3,
          largeImageThreshold: 0,
          useCrossOrigin: false,
          outputDiff: true,
      },
      scaleToSameSize: true,
      ignore: "antialiasing"
  };
    
    let data = utils.getDiff(imgPath1, imgPath2, options);

    const img1Name = path.basename(imgPath1, path.extname(imgPath1));
    const img2Name = path.basename(imgPath2, path.extname(imgPath2));
    core.info(`The second image "${img2Name}" is ${data.misMatchPercentage}% different compared to the first image "${img1Name}".`);
    
    core.setOutput('img-diff', data.getBuffer());
    core.setOutput('mismatch', data.misMatchPercentage);

  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()


/***/ }),

/***/ 608:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const fs = __webpack_require__(747);
const compareImages = __webpack_require__(963);

async function getDiff(imgPath1, imgPath2, options) {
    
    // The parameters can be Node Buffers
    // data is the same as usual with an additional getBuffer() function
    const data = await compareImages(
        await fs.promises.readFile(imgPath1),
        await fs.promises.readFile(imgPath2),
        options
    );

    //await fs.promises.writeFile("./output.png", data.getBuffer());
    return data;
}

function parseColorOption(colorString) {
    let rgbArray = colorString.split(',').map((item) => item.trim());
    let color = {
        red: rgbArray[0],
        green: rgbArray[1],
        blue: rgbArray[2]
    }
    return color;
}

function parseBoxOption(boxString) {
    let boxList = boxString.split(',').map((item) => item.trim());
    const box = {
        top: boxList[0],
        right: boxList[1],
        bottom: boxList[2],
        left: boxList[3]
      };
    return box;
}

module.exports = {
    parseColorOption,
    parseBoxOption,
    getDiff,
};

/***/ }),

/***/ 756:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = require(__webpack_require__.ab + "build/Release/canvas.node")

/***/ }),

/***/ 160:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse("{\"_from\":\"canvas@2.6.1\",\"_id\":\"canvas@2.6.1\",\"_inBundle\":false,\"_integrity\":\"sha512-S98rKsPcuhfTcYbtF53UIJhcbgIAK533d1kJKMwsMwAIFgfd58MOyxRud3kktlzWiEkFliaJtvyZCBtud/XVEA==\",\"_location\":\"/canvas\",\"_phantomChildren\":{},\"_requested\":{\"type\":\"version\",\"registry\":true,\"raw\":\"canvas@2.6.1\",\"name\":\"canvas\",\"escapedName\":\"canvas\",\"rawSpec\":\"2.6.1\",\"saveSpec\":null,\"fetchSpec\":\"2.6.1\"},\"_requiredBy\":[\"/resemblejs\"],\"_resolved\":\"https://registry.npmjs.org/canvas/-/canvas-2.6.1.tgz\",\"_shasum\":\"0d087dd4d60f5a5a9efa202757270abea8bef89e\",\"_spec\":\"canvas@2.6.1\",\"_where\":\"/Users/andrestorhaug/Programming/Projects/image-diff-action/node_modules/resemblejs\",\"author\":{\"name\":\"TJ Holowaychuk\",\"email\":\"tj@learnboost.com\"},\"binary\":{\"module_name\":\"canvas\",\"module_path\":\"build/Release\",\"host\":\"https://github.com/node-gfx/node-canvas-prebuilt/releases/download/\",\"remote_path\":\"v{version}\",\"package_name\":\"{module_name}-v{version}-{node_abi}-{platform}-{libc}-{arch}.tar.gz\"},\"browser\":\"browser.js\",\"bugs\":{\"url\":\"https://github.com/Automattic/node-canvas/issues\"},\"bundleDependencies\":false,\"contributors\":[{\"name\":\"Nathan Rajlich\",\"email\":\"nathan@tootallnate.net\"},{\"name\":\"Rod Vagg\",\"email\":\"r@va.gg\"},{\"name\":\"Juriy Zaytsev\",\"email\":\"kangax@gmail.com\"}],\"dependencies\":{\"nan\":\"^2.14.0\",\"node-pre-gyp\":\"^0.11.0\",\"simple-get\":\"^3.0.3\"},\"deprecated\":false,\"description\":\"Canvas graphics API backed by Cairo\",\"devDependencies\":{\"@types/node\":\"^10.12.18\",\"assert-rejects\":\"^1.0.0\",\"dtslint\":\"^0.5.3\",\"express\":\"^4.16.3\",\"mocha\":\"^5.2.0\",\"pixelmatch\":\"^4.0.2\",\"standard\":\"^12.0.1\"},\"engines\":{\"node\":\">=6\"},\"files\":[\"binding.gyp\",\"lib/\",\"src/\",\"util/\",\"types/index.d.ts\"],\"homepage\":\"https://github.com/Automattic/node-canvas\",\"keywords\":[\"canvas\",\"graphic\",\"graphics\",\"pixman\",\"cairo\",\"image\",\"images\",\"pdf\"],\"license\":\"MIT\",\"main\":\"index.js\",\"name\":\"canvas\",\"repository\":{\"type\":\"git\",\"url\":\"git://github.com/Automattic/node-canvas.git\"},\"scripts\":{\"benchmark\":\"node benchmarks/run.js\",\"dtslint\":\"dtslint types\",\"install\":\"node-pre-gyp install --fallback-to-build\",\"prebenchmark\":\"node-gyp build\",\"pretest\":\"standard examples/*.js test/server.js test/public/*.js benchmarks/run.js lib/context2d.js util/has_lib.js browser.js index.js && node-gyp build\",\"pretest-server\":\"node-gyp build\",\"test\":\"mocha test/*.test.js\",\"test-server\":\"node test/server.js\"},\"types\":\"types/index.d.ts\",\"version\":\"2.6.1\"}");

/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 605:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 211:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 191:
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ 413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 835:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 669:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(351);
/******/ })()
;
//# sourceMappingURL=index.js.map