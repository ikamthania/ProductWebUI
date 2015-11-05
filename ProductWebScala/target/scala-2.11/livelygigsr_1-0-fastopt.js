(function(){
'use strict';
/* Scala.js runtime support
 * Copyright 2013 LAMP/EPFL
 * Author: Sébastien Doeraene
 */

/* ---------------------------------- *
 * The top-level Scala.js environment *
 * ---------------------------------- */





// Get the environment info
var $env = (typeof __ScalaJSEnv === "object" && __ScalaJSEnv) ? __ScalaJSEnv : {};

// Global scope
var $g =
  (typeof $env["global"] === "object" && $env["global"])
    ? $env["global"]
    : ((typeof global === "object" && global && global["Object"] === Object) ? global : this);
$env["global"] = $g;

// Where to send exports
var $e =
  (typeof $env["exportsNamespace"] === "object" && $env["exportsNamespace"])
    ? $env["exportsNamespace"] : $g;
$env["exportsNamespace"] = $e;

// Freeze the environment info
$g["Object"]["freeze"]($env);

// Linking info - must be in sync with scala.scalajs.runtime.LinkingInfo
var $linkingInfo = {
  "semantics": {




    "asInstanceOfs": 1,










    "moduleInit": 2,





    "strictFloats": false

  },



  "assumingES6": false

};
$g["Object"]["freeze"]($linkingInfo);
$g["Object"]["freeze"]($linkingInfo["semantics"]);

// Snapshots of builtins and polyfills





var $imul = $g["Math"]["imul"] || (function(a, b) {
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
  var ah = (a >>> 16) & 0xffff;
  var al = a & 0xffff;
  var bh = (b >>> 16) & 0xffff;
  var bl = b & 0xffff;
  // the shift by 0 fixes the sign on the high part
  // the final |0 converts the unsigned value into a signed value
  return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0);
});

var $fround = $g["Math"]["fround"] ||









  (function(v) {
    return +v;
  });



// Other fields
















var $lastIDHash = 0; // last value attributed to an id hash code



var $idHashCodeMap = $g["WeakMap"] ? new $g["WeakMap"]() : null;



// Core mechanism

var $makeIsArrayOfPrimitive = function(primitiveData) {
  return function(obj, depth) {
    return !!(obj && obj.$classData &&
      (obj.$classData.arrayDepth === depth) &&
      (obj.$classData.arrayBase === primitiveData));
  }
};


var $makeAsArrayOfPrimitive = function(isInstanceOfFunction, arrayEncodedName) {
  return function(obj, depth) {
    if (isInstanceOfFunction(obj, depth) || (obj === null))
      return obj;
    else
      $throwArrayCastException(obj, arrayEncodedName, depth);
  }
};


/** Encode a property name for runtime manipulation
  *  Usage:
  *    env.propertyName({someProp:0})
  *  Returns:
  *    "someProp"
  *  Useful when the property is renamed by a global optimizer (like Closure)
  *  but we must still get hold of a string of that name for runtime
  * reflection.
  */
var $propertyName = function(obj) {
  for (var prop in obj)
    return prop;
};

// Runtime functions

var $isScalaJSObject = function(obj) {
  return !!(obj && obj.$classData);
};


var $throwClassCastException = function(instance, classFullName) {




  throw new $c_sjsr_UndefinedBehaviorError().init___jl_Throwable(
    new $c_jl_ClassCastException().init___T(
      instance + " is not an instance of " + classFullName));

};

var $throwArrayCastException = function(instance, classArrayEncodedName, depth) {
  for (; depth; --depth)
    classArrayEncodedName = "[" + classArrayEncodedName;
  $throwClassCastException(instance, classArrayEncodedName);
};


var $noIsInstance = function(instance) {
  throw new $g["TypeError"](
    "Cannot call isInstance() on a Class representing a raw JS trait/object");
};

var $makeNativeArrayWrapper = function(arrayClassData, nativeArray) {
  return new arrayClassData.constr(nativeArray);
};

var $newArrayObject = function(arrayClassData, lengths) {
  return $newArrayObjectInternal(arrayClassData, lengths, 0);
};

var $newArrayObjectInternal = function(arrayClassData, lengths, lengthIndex) {
  var result = new arrayClassData.constr(lengths[lengthIndex]);

  if (lengthIndex < lengths.length-1) {
    var subArrayClassData = arrayClassData.componentData;
    var subLengthIndex = lengthIndex+1;
    var underlying = result.u;
    for (var i = 0; i < underlying.length; i++) {
      underlying[i] = $newArrayObjectInternal(
        subArrayClassData, lengths, subLengthIndex);
    }
  }

  return result;
};

var $checkNonNull = function(obj) {
  return obj !== null ? obj : $throwNullPointerException();
};

var $throwNullPointerException = function() {
  throw new $c_jl_NullPointerException().init___();
};

var $objectToString = function(instance) {
  if (instance === void 0)
    return "undefined";
  else
    return instance.toString();
};

var $objectGetClass = function(instance) {
  switch (typeof instance) {
    case "string":
      return $d_T.getClassOf();
    case "number": {
      var v = instance | 0;
      if (v === instance) { // is the value integral?
        if ($isByte(v))
          return $d_jl_Byte.getClassOf();
        else if ($isShort(v))
          return $d_jl_Short.getClassOf();
        else
          return $d_jl_Integer.getClassOf();
      } else {
        if ($isFloat(instance))
          return $d_jl_Float.getClassOf();
        else
          return $d_jl_Double.getClassOf();
      }
    }
    case "boolean":
      return $d_jl_Boolean.getClassOf();
    case "undefined":
      return $d_sr_BoxedUnit.getClassOf();
    default:
      if (instance === null)
        $throwNullPointerException();
      else if ($is_sjsr_RuntimeLong(instance))
        return $d_jl_Long.getClassOf();
      else if ($isScalaJSObject(instance))
        return instance.$classData.getClassOf();
      else
        return null; // Exception?
  }
};

var $objectClone = function(instance) {
  if ($isScalaJSObject(instance) || (instance === null))
    return instance.clone__O();
  else
    throw new $c_jl_CloneNotSupportedException().init___();
};

var $objectNotify = function(instance) {
  // final and no-op in java.lang.Object
  if (instance === null)
    instance.notify__V();
};

var $objectNotifyAll = function(instance) {
  // final and no-op in java.lang.Object
  if (instance === null)
    instance.notifyAll__V();
};

var $objectFinalize = function(instance) {
  if ($isScalaJSObject(instance) || (instance === null))
    instance.finalize__V();
  // else no-op
};

var $objectEquals = function(instance, rhs) {
  if ($isScalaJSObject(instance) || (instance === null))
    return instance.equals__O__Z(rhs);
  else if (typeof instance === "number")
    return typeof rhs === "number" && $numberEquals(instance, rhs);
  else
    return instance === rhs;
};

var $numberEquals = function(lhs, rhs) {
  return (lhs === rhs) ? (
    // 0.0.equals(-0.0) must be false
    lhs !== 0 || 1/lhs === 1/rhs
  ) : (
    // are they both NaN?
    (lhs !== lhs) && (rhs !== rhs)
  );
};

var $objectHashCode = function(instance) {
  switch (typeof instance) {
    case "string":
      return $m_sjsr_RuntimeString$().hashCode__T__I(instance);
    case "number":
      return $m_sjsr_Bits$().numberHashCode__D__I(instance);
    case "boolean":
      return instance ? 1231 : 1237;
    case "undefined":
      return 0;
    default:
      if ($isScalaJSObject(instance) || instance === null)
        return instance.hashCode__I();

      else if ($idHashCodeMap === null)
        return 42;

      else
        return $systemIdentityHashCode(instance);
  }
};

var $comparableCompareTo = function(instance, rhs) {
  switch (typeof instance) {
    case "string":

      $as_T(rhs);

      return instance === rhs ? 0 : (instance < rhs ? -1 : 1);
    case "number":

      $as_jl_Number(rhs);

      return $m_jl_Double$().compare__D__D__I(instance, rhs);
    case "boolean":

      $asBoolean(rhs);

      return instance - rhs; // yes, this gives the right result
    default:
      return instance.compareTo__O__I(rhs);
  }
};

var $charSequenceLength = function(instance) {
  if (typeof(instance) === "string")

    return $uI(instance["length"]);



  else
    return instance.length__I();
};

var $charSequenceCharAt = function(instance, index) {
  if (typeof(instance) === "string")

    return $uI(instance["charCodeAt"](index)) & 0xffff;



  else
    return instance.charAt__I__C(index);
};

var $charSequenceSubSequence = function(instance, start, end) {
  if (typeof(instance) === "string")

    return $as_T(instance["substring"](start, end));



  else
    return instance.subSequence__I__I__jl_CharSequence(start, end);
};

var $booleanBooleanValue = function(instance) {
  if (typeof instance === "boolean") return instance;
  else                               return instance.booleanValue__Z();
};

var $numberByteValue = function(instance) {
  if (typeof instance === "number") return (instance << 24) >> 24;
  else                              return instance.byteValue__B();
};
var $numberShortValue = function(instance) {
  if (typeof instance === "number") return (instance << 16) >> 16;
  else                              return instance.shortValue__S();
};
var $numberIntValue = function(instance) {
  if (typeof instance === "number") return instance | 0;
  else                              return instance.intValue__I();
};
var $numberLongValue = function(instance) {
  if (typeof instance === "number")
    return $m_sjsr_RuntimeLong$().fromDouble__D__sjsr_RuntimeLong(instance);
  else
    return instance.longValue__J();
};
var $numberFloatValue = function(instance) {
  if (typeof instance === "number") return $fround(instance);
  else                              return instance.floatValue__F();
};
var $numberDoubleValue = function(instance) {
  if (typeof instance === "number") return instance;
  else                              return instance.doubleValue__D();
};

var $isNaN = function(instance) {
  return instance !== instance;
};

var $isInfinite = function(instance) {
  return !$g["isFinite"](instance) && !$isNaN(instance);
};

var $doubleToInt = function(x) {
  return (x > 2147483647) ? (2147483647) : ((x < -2147483648) ? -2147483648 : (x | 0));
};

/** Instantiates a JS object with variadic arguments to the constructor. */
var $newJSObjectWithVarargs = function(ctor, args) {
  // This basically emulates the ECMAScript specification for 'new'.
  var instance = $g["Object"]["create"](ctor.prototype);
  var result = ctor["apply"](instance, args);
  switch (typeof result) {
    case "string": case "number": case "boolean": case "undefined": case "symbol":
      return instance;
    default:
      return result === null ? instance : result;
  }
};

var $resolveSuperRef = function(initialProto, propName) {
  var getPrototypeOf = $g["Object"]["getPrototypeOf"];
  var getOwnPropertyDescriptor = $g["Object"]["getOwnPropertyDescriptor"];

  var superProto = getPrototypeOf(initialProto);
  while (superProto !== null) {
    var desc = getOwnPropertyDescriptor(superProto, propName);
    if (desc !== void 0)
      return desc;
    superProto = getPrototypeOf(superProto);
  }

  return void 0;
};

var $superGet = function(initialProto, self, propName) {
  var desc = $resolveSuperRef(initialProto, propName);
  if (desc !== void 0) {
    var getter = desc["get"];
    if (getter !== void 0)
      return getter["call"](self);
    else
      return desc["value"];
  }
  return void 0;
};

var $superSet = function(initialProto, self, propName, value) {
  var desc = $resolveSuperRef(initialProto, propName);
  if (desc !== void 0) {
    var setter = desc["set"];
    if (setter !== void 0) {
      setter["call"](self, value);
      return void 0;
    }
  }
  throw new $g["TypeError"]("super has no setter '" + propName + "'.");
};

var $propertiesOf = function(obj) {
  var result = [];
  for (var prop in obj)
    result["push"](prop);
  return result;
};

var $systemArraycopy = function(src, srcPos, dest, destPos, length) {
  var srcu = src.u;
  var destu = dest.u;
  if (srcu !== destu || destPos < srcPos || srcPos + length < destPos) {
    for (var i = 0; i < length; i++)
      destu[destPos+i] = srcu[srcPos+i];
  } else {
    for (var i = length-1; i >= 0; i--)
      destu[destPos+i] = srcu[srcPos+i];
  }
};

var $systemIdentityHashCode =

  ($idHashCodeMap !== null) ?

  (function(obj) {
    switch (typeof obj) {
      case "string": case "number": case "boolean": case "undefined":
        return $objectHashCode(obj);
      default:
        if (obj === null) {
          return 0;
        } else {
          var hash = $idHashCodeMap["get"](obj);
          if (hash === void 0) {
            hash = ($lastIDHash + 1) | 0;
            $lastIDHash = hash;
            $idHashCodeMap["set"](obj, hash);
          }
          return hash;
        }
    }

  }) :
  (function(obj) {
    if ($isScalaJSObject(obj)) {
      var hash = obj["$idHashCode$0"];
      if (hash !== void 0) {
        return hash;
      } else if (!$g["Object"]["isSealed"](obj)) {
        hash = ($lastIDHash + 1) | 0;
        $lastIDHash = hash;
        obj["$idHashCode$0"] = hash;
        return hash;
      } else {
        return 42;
      }
    } else if (obj === null) {
      return 0;
    } else {
      return $objectHashCode(obj);
    }

  });

// is/as for hijacked boxed classes (the non-trivial ones)

var $isByte = function(v) {
  return (v << 24 >> 24) === v && 1/v !== 1/-0;
};

var $isShort = function(v) {
  return (v << 16 >> 16) === v && 1/v !== 1/-0;
};

var $isInt = function(v) {
  return (v | 0) === v && 1/v !== 1/-0;
};

var $isFloat = function(v) {



  return typeof v === "number";

};


var $asUnit = function(v) {
  if (v === void 0 || v === null)
    return v;
  else
    $throwClassCastException(v, "scala.runtime.BoxedUnit");
};

var $asBoolean = function(v) {
  if (typeof v === "boolean" || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Boolean");
};

var $asByte = function(v) {
  if ($isByte(v) || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Byte");
};

var $asShort = function(v) {
  if ($isShort(v) || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Short");
};

var $asInt = function(v) {
  if ($isInt(v) || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Integer");
};

var $asFloat = function(v) {
  if ($isFloat(v) || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Float");
};

var $asDouble = function(v) {
  if (typeof v === "number" || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Double");
};


// Unboxes


var $uZ = function(value) {
  return !!$asBoolean(value);
};
var $uB = function(value) {
  return $asByte(value) | 0;
};
var $uS = function(value) {
  return $asShort(value) | 0;
};
var $uI = function(value) {
  return $asInt(value) | 0;
};
var $uJ = function(value) {
  return null === value ? $m_sjsr_RuntimeLong$().Zero$1
                        : $as_sjsr_RuntimeLong(value);
};
var $uF = function(value) {
  /* Here, it is fine to use + instead of fround, because asFloat already
   * ensures that the result is either null or a float.
   */
  return +$asFloat(value);
};
var $uD = function(value) {
  return +$asDouble(value);
};






// TypeArray conversions

var $byteArray2TypedArray = function(value) { return new $g["Int8Array"](value.u); };
var $shortArray2TypedArray = function(value) { return new $g["Int16Array"](value.u); };
var $charArray2TypedArray = function(value) { return new $g["Uint16Array"](value.u); };
var $intArray2TypedArray = function(value) { return new $g["Int32Array"](value.u); };
var $floatArray2TypedArray = function(value) { return new $g["Float32Array"](value.u); };
var $doubleArray2TypedArray = function(value) { return new $g["Float64Array"](value.u); };

var $typedArray2ByteArray = function(value) {
  var arrayClassData = $d_B.getArrayOf();
  return new arrayClassData.constr(new $g["Int8Array"](value));
};
var $typedArray2ShortArray = function(value) {
  var arrayClassData = $d_S.getArrayOf();
  return new arrayClassData.constr(new $g["Int16Array"](value));
};
var $typedArray2CharArray = function(value) {
  var arrayClassData = $d_C.getArrayOf();
  return new arrayClassData.constr(new $g["Uint16Array"](value));
};
var $typedArray2IntArray = function(value) {
  var arrayClassData = $d_I.getArrayOf();
  return new arrayClassData.constr(new $g["Int32Array"](value));
};
var $typedArray2FloatArray = function(value) {
  var arrayClassData = $d_F.getArrayOf();
  return new arrayClassData.constr(new $g["Float32Array"](value));
};
var $typedArray2DoubleArray = function(value) {
  var arrayClassData = $d_D.getArrayOf();
  return new arrayClassData.constr(new $g["Float64Array"](value));
};

/* We have to force a non-elidable *read* of $e, otherwise Closure will
 * eliminate it altogether, along with all the exports, which is ... er ...
 * plain wrong.
 */
this["__ScalaJSExportsNamespace"] = $e;

// TypeData class


/** @constructor */
var $TypeData = function() {




  // Runtime support
  this.constr = void 0;
  this.parentData = void 0;
  this.ancestors = null;
  this.componentData = null;
  this.arrayBase = null;
  this.arrayDepth = 0;
  this.zero = null;
  this.arrayEncodedName = "";
  this._classOf = void 0;
  this._arrayOf = void 0;
  this.isArrayOf = void 0;

  // java.lang.Class support
  this["name"] = "";
  this["isPrimitive"] = false;
  this["isInterface"] = false;
  this["isArrayClass"] = false;
  this["isRawJSType"] = false;
  this["isInstance"] = void 0;
};


$TypeData.prototype.initPrim = function(



    zero, arrayEncodedName, displayName) {
  // Runtime support
  this.ancestors = {};
  this.componentData = null;
  this.zero = zero;
  this.arrayEncodedName = arrayEncodedName;
  this.isArrayOf = function(obj, depth) { return false; };

  // java.lang.Class support
  this["name"] = displayName;
  this["isPrimitive"] = true;
  this["isInstance"] = function(obj) { return false; };

  return this;
};


$TypeData.prototype.initClass = function(



    internalNameObj, isInterface, fullName,
    ancestors, isRawJSType, parentData, isInstance, isArrayOf) {
  var internalName = $propertyName(internalNameObj);

  isInstance = isInstance || function(obj) {
    return !!(obj && obj.$classData && obj.$classData.ancestors[internalName]);
  };

  isArrayOf = isArrayOf || function(obj, depth) {
    return !!(obj && obj.$classData && (obj.$classData.arrayDepth === depth)
      && obj.$classData.arrayBase.ancestors[internalName])
  };

  // Runtime support
  this.parentData = parentData;
  this.ancestors = ancestors;
  this.arrayEncodedName = "L"+fullName+";";
  this.isArrayOf = isArrayOf;

  // java.lang.Class support
  this["name"] = fullName;
  this["isInterface"] = isInterface;
  this["isRawJSType"] = !!isRawJSType;
  this["isInstance"] = isInstance;

  return this;
};


$TypeData.prototype.initArray = function(



    componentData) {
  // The constructor

  var componentZero0 = componentData.zero;

  // The zero for the Long runtime representation
  // is a special case here, since the class has not
  // been defined yet, when this file is read
  var componentZero = (componentZero0 == "longZero")
    ? $m_sjsr_RuntimeLong$().Zero$1
    : componentZero0;


  /** @constructor */
  var ArrayClass = function(arg) {
    if (typeof(arg) === "number") {
      // arg is the length of the array
      this.u = new Array(arg);
      for (var i = 0; i < arg; i++)
        this.u[i] = componentZero;
    } else {
      // arg is a native array that we wrap
      this.u = arg;
    }
  }
  ArrayClass.prototype = new $h_O;
  ArrayClass.prototype.constructor = ArrayClass;

  ArrayClass.prototype.clone__O = function() {
    if (this.u instanceof Array)
      return new ArrayClass(this.u["slice"](0));
    else
      // The underlying Array is a TypedArray
      return new ArrayClass(new this.u.constructor(this.u));
  };

























  ArrayClass.prototype.$classData = this;

  // Don't generate reflective call proxies. The compiler special cases
  // reflective calls to methods on scala.Array

  // The data

  var encodedName = "[" + componentData.arrayEncodedName;
  var componentBase = componentData.arrayBase || componentData;
  var arrayDepth = componentData.arrayDepth + 1;

  var isInstance = function(obj) {
    return componentBase.isArrayOf(obj, arrayDepth);
  }

  // Runtime support
  this.constr = ArrayClass;
  this.parentData = $d_O;
  this.ancestors = {O: 1};
  this.componentData = componentData;
  this.arrayBase = componentBase;
  this.arrayDepth = arrayDepth;
  this.zero = null;
  this.arrayEncodedName = encodedName;
  this._classOf = undefined;
  this._arrayOf = undefined;
  this.isArrayOf = undefined;

  // java.lang.Class support
  this["name"] = encodedName;
  this["isPrimitive"] = false;
  this["isInterface"] = false;
  this["isArrayClass"] = true;
  this["isInstance"] = isInstance;

  return this;
};


$TypeData.prototype.getClassOf = function() {



  if (!this._classOf)
    this._classOf = new $c_jl_Class().init___jl_ScalaJSClassData(this);
  return this._classOf;
};


$TypeData.prototype.getArrayOf = function() {



  if (!this._arrayOf)
    this._arrayOf = new $TypeData().initArray(this);
  return this._arrayOf;
};

// java.lang.Class support


$TypeData.prototype["getFakeInstance"] = function() {



  if (this === $d_T)
    return "some string";
  else if (this === $d_jl_Boolean)
    return false;
  else if (this === $d_jl_Byte ||
           this === $d_jl_Short ||
           this === $d_jl_Integer ||
           this === $d_jl_Float ||
           this === $d_jl_Double)
    return 0;
  else if (this === $d_jl_Long)
    return $m_sjsr_RuntimeLong$().Zero$1;
  else if (this === $d_sr_BoxedUnit)
    return void 0;
  else
    return {$classData: this};
};


$TypeData.prototype["getSuperclass"] = function() {



  return this.parentData ? this.parentData.getClassOf() : null;
};


$TypeData.prototype["getComponentType"] = function() {



  return this.componentData ? this.componentData.getClassOf() : null;
};


$TypeData.prototype["newArrayOfThisClass"] = function(lengths) {



  var arrayClassData = this;
  for (var i = 0; i < lengths.length; i++)
    arrayClassData = arrayClassData.getArrayOf();
  return $newArrayObject(arrayClassData, lengths);
};




// Create primitive types

var $d_V = new $TypeData().initPrim(undefined, "V", "void");
var $d_Z = new $TypeData().initPrim(false, "Z", "boolean");
var $d_C = new $TypeData().initPrim(0, "C", "char");
var $d_B = new $TypeData().initPrim(0, "B", "byte");
var $d_S = new $TypeData().initPrim(0, "S", "short");
var $d_I = new $TypeData().initPrim(0, "I", "int");
var $d_J = new $TypeData().initPrim("longZero", "J", "long");
var $d_F = new $TypeData().initPrim(0.0, "F", "float");
var $d_D = new $TypeData().initPrim(0.0, "D", "double");

// Instance tests for array of primitives

var $isArrayOf_Z = $makeIsArrayOfPrimitive($d_Z);
$d_Z.isArrayOf = $isArrayOf_Z;

var $isArrayOf_C = $makeIsArrayOfPrimitive($d_C);
$d_C.isArrayOf = $isArrayOf_C;

var $isArrayOf_B = $makeIsArrayOfPrimitive($d_B);
$d_B.isArrayOf = $isArrayOf_B;

var $isArrayOf_S = $makeIsArrayOfPrimitive($d_S);
$d_S.isArrayOf = $isArrayOf_S;

var $isArrayOf_I = $makeIsArrayOfPrimitive($d_I);
$d_I.isArrayOf = $isArrayOf_I;

var $isArrayOf_J = $makeIsArrayOfPrimitive($d_J);
$d_J.isArrayOf = $isArrayOf_J;

var $isArrayOf_F = $makeIsArrayOfPrimitive($d_F);
$d_F.isArrayOf = $isArrayOf_F;

var $isArrayOf_D = $makeIsArrayOfPrimitive($d_D);
$d_D.isArrayOf = $isArrayOf_D;


// asInstanceOfs for array of primitives
var $asArrayOf_Z = $makeAsArrayOfPrimitive($isArrayOf_Z, "Z");
var $asArrayOf_C = $makeAsArrayOfPrimitive($isArrayOf_C, "C");
var $asArrayOf_B = $makeAsArrayOfPrimitive($isArrayOf_B, "B");
var $asArrayOf_S = $makeAsArrayOfPrimitive($isArrayOf_S, "S");
var $asArrayOf_I = $makeAsArrayOfPrimitive($isArrayOf_I, "I");
var $asArrayOf_J = $makeAsArrayOfPrimitive($isArrayOf_J, "J");
var $asArrayOf_F = $makeAsArrayOfPrimitive($isArrayOf_F, "F");
var $asArrayOf_D = $makeAsArrayOfPrimitive($isArrayOf_D, "D");

function $is_F0(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.F0)))
}
function $as_F0(obj) {
  return (($is_F0(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Function0"))
}
function $isArrayOf_F0(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.F0)))
}
function $asArrayOf_F0(obj, depth) {
  return (($isArrayOf_F0(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Function0;", depth))
}
function $is_F1(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.F1)))
}
function $as_F1(obj) {
  return (($is_F1(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Function1"))
}
function $isArrayOf_F1(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.F1)))
}
function $asArrayOf_F1(obj, depth) {
  return (($isArrayOf_F1(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Function1;", depth))
}
function $is_Ljapgolly_scalajs_react_extra_Listenable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_Listenable)))
}
function $as_Ljapgolly_scalajs_react_extra_Listenable(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_Listenable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.Listenable"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_Listenable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_Listenable)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_Listenable(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_Listenable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.Listenable;", depth))
}
function $is_Ljapgolly_scalajs_react_extra_OnUnmount(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_OnUnmount)))
}
function $as_Ljapgolly_scalajs_react_extra_OnUnmount(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_OnUnmount(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.OnUnmount"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_OnUnmount(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_OnUnmount)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_OnUnmount(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_OnUnmount(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.OnUnmount;", depth))
}
function $is_Ljapgolly_scalajs_react_vdom_TagMod(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_vdom_TagMod)))
}
function $as_Ljapgolly_scalajs_react_vdom_TagMod(obj) {
  return (($is_Ljapgolly_scalajs_react_vdom_TagMod(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.vdom.TagMod"))
}
function $isArrayOf_Ljapgolly_scalajs_react_vdom_TagMod(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_vdom_TagMod)))
}
function $asArrayOf_Ljapgolly_scalajs_react_vdom_TagMod(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_vdom_TagMod(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.vdom.TagMod;", depth))
}
/** @constructor */
function $c_O() {
  /*<skip>*/
}
/** @constructor */
function $h_O() {
  /*<skip>*/
}
$h_O.prototype = $c_O.prototype;
$c_O.prototype.init___ = (function() {
  return this
});
$c_O.prototype.equals__O__Z = (function(that) {
  return (this === that)
});
$c_O.prototype.toString__T = (function() {
  var jsx$2 = $objectGetClass(this).getName__T();
  var i = this.hashCode__I();
  var x = $uD((i >>> 0));
  var jsx$1 = x["toString"](16);
  return ((jsx$2 + "@") + $as_T(jsx$1))
});
$c_O.prototype.hashCode__I = (function() {
  return $systemIdentityHashCode(this)
});
$c_O.prototype["toString"] = (function() {
  return this.toString__T()
});
function $is_O(obj) {
  return (obj !== null)
}
function $as_O(obj) {
  return obj
}
function $isArrayOf_O(obj, depth) {
  var data = (obj && obj.$classData);
  if ((!data)) {
    return false
  } else {
    var arrayDepth = (data.arrayDepth || 0);
    return ((!(arrayDepth < depth)) && ((arrayDepth > depth) || (!data.arrayBase["isPrimitive"])))
  }
}
function $asArrayOf_O(obj, depth) {
  return (($isArrayOf_O(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Object;", depth))
}
var $d_O = new $TypeData().initClass({
  O: 0
}, false, "java.lang.Object", {
  O: 1
}, (void 0), (void 0), $is_O, $isArrayOf_O);
$c_O.prototype.$classData = $d_O;
function $is_sc_GenTraversableOnce(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenTraversableOnce)))
}
function $as_sc_GenTraversableOnce(obj) {
  return (($is_sc_GenTraversableOnce(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenTraversableOnce"))
}
function $isArrayOf_sc_GenTraversableOnce(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenTraversableOnce)))
}
function $asArrayOf_sc_GenTraversableOnce(obj, depth) {
  return (($isArrayOf_sc_GenTraversableOnce(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenTraversableOnce;", depth))
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_Callback$() {
  $c_O.call(this);
  this.empty$1 = null
}
$c_Ljapgolly_scalajs_react_Callback$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_Callback$.prototype.constructor = $c_Ljapgolly_scalajs_react_Callback$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_Callback$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_Callback$.prototype = $c_Ljapgolly_scalajs_react_Callback$.prototype;
$c_Ljapgolly_scalajs_react_Callback$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_Callback$ = this;
  this.empty$1 = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(a$1) {
    return (function() {
      return a$1
    })
  })((void 0)));
  return this
});
var $d_Ljapgolly_scalajs_react_Callback$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_Callback$: 0
}, false, "japgolly.scalajs.react.Callback$", {
  Ljapgolly_scalajs_react_Callback$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_Callback$.prototype.$classData = $d_Ljapgolly_scalajs_react_Callback$;
var $n_Ljapgolly_scalajs_react_Callback$ = (void 0);
function $m_Ljapgolly_scalajs_react_Callback$() {
  if ((!$n_Ljapgolly_scalajs_react_Callback$)) {
    $n_Ljapgolly_scalajs_react_Callback$ = new $c_Ljapgolly_scalajs_react_Callback$().init___()
  };
  return $n_Ljapgolly_scalajs_react_Callback$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_CallbackTo() {
  $c_O.call(this);
  this.japgolly$scalajs$react$CallbackTo$$f$1 = null
}
$c_Ljapgolly_scalajs_react_CallbackTo.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_CallbackTo.prototype.constructor = $c_Ljapgolly_scalajs_react_CallbackTo;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CallbackTo() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CallbackTo.prototype = $c_Ljapgolly_scalajs_react_CallbackTo.prototype;
$c_Ljapgolly_scalajs_react_CallbackTo.prototype.init___F0 = (function(f) {
  this.japgolly$scalajs$react$CallbackTo$$f$1 = f;
  return this
});
$c_Ljapgolly_scalajs_react_CallbackTo.prototype.equals__O__Z = (function(x$1) {
  return $m_Ljapgolly_scalajs_react_CallbackTo$().equals$extension__F0__O__Z(this.japgolly$scalajs$react$CallbackTo$$f$1, x$1)
});
$c_Ljapgolly_scalajs_react_CallbackTo.prototype.hashCode__I = (function() {
  var $$this = this.japgolly$scalajs$react$CallbackTo$$f$1;
  return $systemIdentityHashCode($$this)
});
function $is_Ljapgolly_scalajs_react_CallbackTo(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_CallbackTo)))
}
function $as_Ljapgolly_scalajs_react_CallbackTo(obj) {
  return (($is_Ljapgolly_scalajs_react_CallbackTo(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.CallbackTo"))
}
function $isArrayOf_Ljapgolly_scalajs_react_CallbackTo(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_CallbackTo)))
}
function $asArrayOf_Ljapgolly_scalajs_react_CallbackTo(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_CallbackTo(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.CallbackTo;", depth))
}
var $d_Ljapgolly_scalajs_react_CallbackTo = new $TypeData().initClass({
  Ljapgolly_scalajs_react_CallbackTo: 0
}, false, "japgolly.scalajs.react.CallbackTo", {
  Ljapgolly_scalajs_react_CallbackTo: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_CallbackTo.prototype.$classData = $d_Ljapgolly_scalajs_react_CallbackTo;
/** @constructor */
function $c_Ljapgolly_scalajs_react_CallbackTo$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.constructor = $c_Ljapgolly_scalajs_react_CallbackTo$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CallbackTo$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CallbackTo$.prototype = $c_Ljapgolly_scalajs_react_CallbackTo$.prototype;
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.equals$extension__F0__O__Z = (function($$this, x$1) {
  if ($is_Ljapgolly_scalajs_react_CallbackTo(x$1)) {
    var CallbackTo$1 = ((x$1 === null) ? null : $as_Ljapgolly_scalajs_react_CallbackTo(x$1).japgolly$scalajs$react$CallbackTo$$f$1);
    return ($$this === CallbackTo$1)
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.map$extension__F0__F1__F0 = (function($$this, g) {
  return new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($$this$1, g$3) {
    return (function() {
      return g$3.apply__O__O($$this$1.apply__O())
    })
  })($$this, g))
});
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.toJsCallback$extension__F0__sjs_js_UndefOr = (function($$this) {
  if (this.isEmpty$und$qmark$extension__F0__Z($$this)) {
    return (void 0)
  } else {
    var value = this.toJsFn$extension__F0__sjs_js_Function0($$this);
    return value
  }
});
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.isEmpty$und$qmark$extension__F0__Z = (function($$this) {
  return ($$this === $m_Ljapgolly_scalajs_react_Callback$().empty$1)
});
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.toJsFn$extension__F0__sjs_js_Function0 = (function($$this) {
  return (function(f) {
    return (function() {
      return f.apply__O()
    })
  })($$this)
});
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.$$greater$greater$extension__F0__F0__F0 = (function($$this, runNext) {
  return new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(runNext$1, $$this$3) {
    return (function() {
      $$this$3.apply__O();
      return runNext$1.apply__O()
    })
  })(runNext, $$this))
});
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.flatMap$extension__F0__F1__F0 = (function($$this, g) {
  return new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($$this$2, g$4) {
    return (function() {
      return $as_Ljapgolly_scalajs_react_CallbackTo(g$4.apply__O__O($$this$2.apply__O())).japgolly$scalajs$react$CallbackTo$$f$1.apply__O()
    })
  })($$this, g))
});
var $d_Ljapgolly_scalajs_react_CallbackTo$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_CallbackTo$: 0
}, false, "japgolly.scalajs.react.CallbackTo$", {
  Ljapgolly_scalajs_react_CallbackTo$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.$classData = $d_Ljapgolly_scalajs_react_CallbackTo$;
var $n_Ljapgolly_scalajs_react_CallbackTo$ = (void 0);
function $m_Ljapgolly_scalajs_react_CallbackTo$() {
  if ((!$n_Ljapgolly_scalajs_react_CallbackTo$)) {
    $n_Ljapgolly_scalajs_react_CallbackTo$ = new $c_Ljapgolly_scalajs_react_CallbackTo$().init___()
  };
  return $n_Ljapgolly_scalajs_react_CallbackTo$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_CompState$Accessor() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_CompState$Accessor.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_CompState$Accessor.prototype.constructor = $c_Ljapgolly_scalajs_react_CompState$Accessor;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CompState$Accessor() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CompState$Accessor.prototype = $c_Ljapgolly_scalajs_react_CompState$Accessor.prototype;
/** @constructor */
function $c_Ljapgolly_scalajs_react_CompState$RootAccessor$() {
  $c_O.call(this);
  this.instance$1 = null
}
$c_Ljapgolly_scalajs_react_CompState$RootAccessor$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_CompState$RootAccessor$.prototype.constructor = $c_Ljapgolly_scalajs_react_CompState$RootAccessor$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CompState$RootAccessor$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CompState$RootAccessor$.prototype = $c_Ljapgolly_scalajs_react_CompState$RootAccessor$.prototype;
$c_Ljapgolly_scalajs_react_CompState$RootAccessor$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_CompState$RootAccessor$ = this;
  this.instance$1 = new $c_Ljapgolly_scalajs_react_CompState$RootAccessor().init___();
  return this
});
var $d_Ljapgolly_scalajs_react_CompState$RootAccessor$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_CompState$RootAccessor$: 0
}, false, "japgolly.scalajs.react.CompState$RootAccessor$", {
  Ljapgolly_scalajs_react_CompState$RootAccessor$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_CompState$RootAccessor$.prototype.$classData = $d_Ljapgolly_scalajs_react_CompState$RootAccessor$;
var $n_Ljapgolly_scalajs_react_CompState$RootAccessor$ = (void 0);
function $m_Ljapgolly_scalajs_react_CompState$RootAccessor$() {
  if ((!$n_Ljapgolly_scalajs_react_CompState$RootAccessor$)) {
    $n_Ljapgolly_scalajs_react_CompState$RootAccessor$ = new $c_Ljapgolly_scalajs_react_CompState$RootAccessor$().init___()
  };
  return $n_Ljapgolly_scalajs_react_CompState$RootAccessor$
}
function $s_Ljapgolly_scalajs_react_CompState$WriteCallbackOps$class__setStateCB__Ljapgolly_scalajs_react_CompState$WriteCallbackOps__F0__F0__F0($$this, s, cb) {
  var this$1 = $m_Ljapgolly_scalajs_react_CallbackTo$();
  var g = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer, cb$7) {
    return (function(x$2$2) {
      return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($s_Ljapgolly_scalajs_react_CompState$WriteCallbackOps$class__setState__Ljapgolly_scalajs_react_CompState$WriteCallbackOps__O__F0__F0(arg$outer, x$2$2, cb$7))
    })
  })($$this, cb));
  return this$1.flatMap$extension__F0__F1__F0(s, g)
}
function $s_Ljapgolly_scalajs_react_CompState$WriteCallbackOps$class__setState__Ljapgolly_scalajs_react_CompState$WriteCallbackOps__O__F0__F0($$this, s, cb) {
  var f = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(arg$outer, s$1, cb$5) {
    return (function() {
      var this$1 = arg$outer.a$1;
      var $$ = arg$outer.$$$1;
      this$1.setState__Ljapgolly_scalajs_react_CompScope$CanSetState__O__F0__V($$, s$1, cb$5)
    })
  })($$this, s, cb));
  return f
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_Internal$() {
  $c_O.call(this);
  this.fcUnit$1 = null;
  this.fcEither$1 = null
}
$c_Ljapgolly_scalajs_react_Internal$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_Internal$.prototype.constructor = $c_Ljapgolly_scalajs_react_Internal$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_Internal$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_Internal$.prototype = $c_Ljapgolly_scalajs_react_Internal$.prototype;
$c_Ljapgolly_scalajs_react_Internal$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_Internal$ = this;
  this.fcUnit$1 = new $c_Ljapgolly_scalajs_react_Internal$FnComposer().init___F2(new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function(x$1$2, x$2$2) {
    var x$1 = $as_F0(x$1$2);
    var x$2 = $as_F0(x$2$2);
    return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($m_Ljapgolly_scalajs_react_CallbackTo$().$$greater$greater$extension__F0__F0__F0($as_Ljapgolly_scalajs_react_CallbackTo(x$1.apply__O()).japgolly$scalajs$react$CallbackTo$$f$1, $as_Ljapgolly_scalajs_react_CallbackTo(x$2.apply__O()).japgolly$scalajs$react$CallbackTo$$f$1))
  })));
  this.fcEither$1 = new $c_Ljapgolly_scalajs_react_Internal$FnComposer().init___F2(new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function(x$3$2, x$4$2) {
    var x$3 = $as_F0(x$3$2);
    var x$4 = $as_F0(x$4$2);
    var $$this = $as_Ljapgolly_scalajs_react_CallbackTo(x$3.apply__O()).japgolly$scalajs$react$CallbackTo$$f$1;
    var b = $as_Ljapgolly_scalajs_react_CallbackTo(x$4.apply__O()).japgolly$scalajs$react$CallbackTo$$f$1;
    var op = new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function(x$10$2, x$11$2) {
      var x$10 = $as_F0(x$10$2);
      var x$11 = $as_F0(x$11$2);
      return ($uZ(x$10.apply__O()) || $uZ(x$11.apply__O()))
    }));
    var x$5 = new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($$this).japgolly$scalajs$react$CallbackTo$$f$1;
    var f = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(x$13, y$1, op$1) {
      return (function() {
        return $uZ(op$1.apply__O__O__O(x$13, y$1))
      })
    })(x$5, b, op));
    return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(f)
  })));
  return this
});
var $d_Ljapgolly_scalajs_react_Internal$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_Internal$: 0
}, false, "japgolly.scalajs.react.Internal$", {
  Ljapgolly_scalajs_react_Internal$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_Internal$.prototype.$classData = $d_Ljapgolly_scalajs_react_Internal$;
var $n_Ljapgolly_scalajs_react_Internal$ = (void 0);
function $m_Ljapgolly_scalajs_react_Internal$() {
  if ((!$n_Ljapgolly_scalajs_react_Internal$)) {
    $n_Ljapgolly_scalajs_react_Internal$ = new $c_Ljapgolly_scalajs_react_Internal$().init___()
  };
  return $n_Ljapgolly_scalajs_react_Internal$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_Internal$FnComposer() {
  $c_O.call(this);
  this.japgolly$scalajs$react$Internal$FnComposer$$compose$f = null
}
$c_Ljapgolly_scalajs_react_Internal$FnComposer.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_Internal$FnComposer.prototype.constructor = $c_Ljapgolly_scalajs_react_Internal$FnComposer;
/** @constructor */
function $h_Ljapgolly_scalajs_react_Internal$FnComposer() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_Internal$FnComposer.prototype = $c_Ljapgolly_scalajs_react_Internal$FnComposer.prototype;
$c_Ljapgolly_scalajs_react_Internal$FnComposer.prototype.init___F2 = (function(compose) {
  this.japgolly$scalajs$react$Internal$FnComposer$$compose$f = compose;
  return this
});
$c_Ljapgolly_scalajs_react_Internal$FnComposer.prototype.apply__sjs_js_UndefOr__F1__F1 = (function(uf, g) {
  var f = new $c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2().init___Ljapgolly_scalajs_react_Internal$FnComposer__F1(this, g);
  if ((uf === (void 0))) {
    var jsx$1 = g
  } else {
    var f$1 = $as_F1(uf);
    var jsx$1 = new $c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2$$anonfun$apply$3().init___Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2__F1(f, f$1)
  };
  return $as_F1(jsx$1)
});
var $d_Ljapgolly_scalajs_react_Internal$FnComposer = new $TypeData().initClass({
  Ljapgolly_scalajs_react_Internal$FnComposer: 0
}, false, "japgolly.scalajs.react.Internal$FnComposer", {
  Ljapgolly_scalajs_react_Internal$FnComposer: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_Internal$FnComposer.prototype.$classData = $d_Ljapgolly_scalajs_react_Internal$FnComposer;
/** @constructor */
function $c_Ljapgolly_scalajs_react_LifecycleInput() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_LifecycleInput.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_LifecycleInput.prototype.constructor = $c_Ljapgolly_scalajs_react_LifecycleInput;
/** @constructor */
function $h_Ljapgolly_scalajs_react_LifecycleInput() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_LifecycleInput.prototype = $c_Ljapgolly_scalajs_react_LifecycleInput.prototype;
/** @constructor */
function $c_Ljapgolly_scalajs_react_ReactComponentB() {
  $c_O.call(this);
  this.name$1 = null;
  this.japgolly$scalajs$react$ReactComponentB$$isf$f = null;
  this.japgolly$scalajs$react$ReactComponentB$$ibf$f = null;
  this.japgolly$scalajs$react$ReactComponentB$$rf$f = null;
  this.japgolly$scalajs$react$ReactComponentB$$lc$f = null;
  this.japgolly$scalajs$react$ReactComponentB$$jsMixins$f = null
}
$c_Ljapgolly_scalajs_react_ReactComponentB.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_ReactComponentB.prototype.constructor = $c_Ljapgolly_scalajs_react_ReactComponentB;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ReactComponentB() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ReactComponentB.prototype = $c_Ljapgolly_scalajs_react_ReactComponentB.prototype;
$c_Ljapgolly_scalajs_react_ReactComponentB.prototype.componentWillUnmount__F1__Ljapgolly_scalajs_react_ReactComponentB = (function(f) {
  var x$50 = $m_Ljapgolly_scalajs_react_Internal$().fcUnit$1.apply__sjs_js_UndefOr__F1__F1(this.japgolly$scalajs$react$ReactComponentB$$lc$f.componentWillUnmount$1, f);
  var this$2 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$51 = this$2.configureSpec$1;
  var this$3 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$52 = this$3.getDefaultProps$1;
  var this$4 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$53 = this$4.componentWillMount$1;
  var this$5 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$54 = this$5.componentDidMount$1;
  var this$6 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$55 = this$6.componentWillUpdate$1;
  var this$7 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$56 = this$7.componentDidUpdate$1;
  var this$8 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$57 = this$8.componentWillReceiveProps$1;
  var this$9 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$58 = this$9.shouldComponentUpdate$1;
  var a = new $c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle().init___sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr(x$51, x$52, x$53, x$54, x$50, x$55, x$56, x$57, x$58);
  var x$18 = this.name$1;
  var x$19 = this.japgolly$scalajs$react$ReactComponentB$$isf$f;
  var x$20 = this.japgolly$scalajs$react$ReactComponentB$$ibf$f;
  var x$21 = this.japgolly$scalajs$react$ReactComponentB$$rf$f;
  var x$22 = this.japgolly$scalajs$react$ReactComponentB$$jsMixins$f;
  return new $c_Ljapgolly_scalajs_react_ReactComponentB().init___T__F1__s_Option__F1__Ljapgolly_scalajs_react_ReactComponentB$LifeCycle__sci_Vector(x$18, x$19, x$20, x$21, a, x$22)
});
$c_Ljapgolly_scalajs_react_ReactComponentB.prototype.componentDidUpdate__F1__Ljapgolly_scalajs_react_ReactComponentB = (function(f) {
  var x$68 = $m_Ljapgolly_scalajs_react_Internal$().fcUnit$1.apply__sjs_js_UndefOr__F1__F1(this.japgolly$scalajs$react$ReactComponentB$$lc$f.componentDidUpdate$1, f);
  var this$2 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$69 = this$2.configureSpec$1;
  var this$3 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$70 = this$3.getDefaultProps$1;
  var this$4 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$71 = this$4.componentWillMount$1;
  var this$5 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$72 = this$5.componentDidMount$1;
  var this$6 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$73 = this$6.componentWillUnmount$1;
  var this$7 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$74 = this$7.componentWillUpdate$1;
  var this$8 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$75 = this$8.componentWillReceiveProps$1;
  var this$9 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$76 = this$9.shouldComponentUpdate$1;
  var a = new $c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle().init___sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr(x$69, x$70, x$71, x$72, x$73, x$74, x$68, x$75, x$76);
  var x$18 = this.name$1;
  var x$19 = this.japgolly$scalajs$react$ReactComponentB$$isf$f;
  var x$20 = this.japgolly$scalajs$react$ReactComponentB$$ibf$f;
  var x$21 = this.japgolly$scalajs$react$ReactComponentB$$rf$f;
  var x$22 = this.japgolly$scalajs$react$ReactComponentB$$jsMixins$f;
  return new $c_Ljapgolly_scalajs_react_ReactComponentB().init___T__F1__s_Option__F1__Ljapgolly_scalajs_react_ReactComponentB$LifeCycle__sci_Vector(x$18, x$19, x$20, x$21, a, x$22)
});
$c_Ljapgolly_scalajs_react_ReactComponentB.prototype.componentDidMount__F1__Ljapgolly_scalajs_react_ReactComponentB = (function(f) {
  var x$41 = $m_Ljapgolly_scalajs_react_Internal$().fcUnit$1.apply__sjs_js_UndefOr__F1__F1(this.japgolly$scalajs$react$ReactComponentB$$lc$f.componentDidMount$1, f);
  var this$2 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$42 = this$2.configureSpec$1;
  var this$3 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$43 = this$3.getDefaultProps$1;
  var this$4 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$44 = this$4.componentWillMount$1;
  var this$5 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$45 = this$5.componentWillUnmount$1;
  var this$6 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$46 = this$6.componentWillUpdate$1;
  var this$7 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$47 = this$7.componentDidUpdate$1;
  var this$8 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$48 = this$8.componentWillReceiveProps$1;
  var this$9 = this.japgolly$scalajs$react$ReactComponentB$$lc$f;
  var x$49 = this$9.shouldComponentUpdate$1;
  var a = new $c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle().init___sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr(x$42, x$43, x$44, x$41, x$45, x$46, x$47, x$48, x$49);
  var x$18 = this.name$1;
  var x$19 = this.japgolly$scalajs$react$ReactComponentB$$isf$f;
  var x$20 = this.japgolly$scalajs$react$ReactComponentB$$ibf$f;
  var x$21 = this.japgolly$scalajs$react$ReactComponentB$$rf$f;
  var x$22 = this.japgolly$scalajs$react$ReactComponentB$$jsMixins$f;
  return new $c_Ljapgolly_scalajs_react_ReactComponentB().init___T__F1__s_Option__F1__Ljapgolly_scalajs_react_ReactComponentB$LifeCycle__sci_Vector(x$18, x$19, x$20, x$21, a, x$22)
});
$c_Ljapgolly_scalajs_react_ReactComponentB.prototype.init___T__F1__s_Option__F1__Ljapgolly_scalajs_react_ReactComponentB$LifeCycle__sci_Vector = (function(name, isf, ibf, rf, lc, jsMixins) {
  this.name$1 = name;
  this.japgolly$scalajs$react$ReactComponentB$$isf$f = isf;
  this.japgolly$scalajs$react$ReactComponentB$$ibf$f = ibf;
  this.japgolly$scalajs$react$ReactComponentB$$rf$f = rf;
  this.japgolly$scalajs$react$ReactComponentB$$lc$f = lc;
  this.japgolly$scalajs$react$ReactComponentB$$jsMixins$f = jsMixins;
  return this
});
function $is_Ljapgolly_scalajs_react_ReactComponentB(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_ReactComponentB)))
}
function $as_Ljapgolly_scalajs_react_ReactComponentB(obj) {
  return (($is_Ljapgolly_scalajs_react_ReactComponentB(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.ReactComponentB"))
}
function $isArrayOf_Ljapgolly_scalajs_react_ReactComponentB(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_ReactComponentB)))
}
function $asArrayOf_Ljapgolly_scalajs_react_ReactComponentB(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_ReactComponentB(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.ReactComponentB;", depth))
}
var $d_Ljapgolly_scalajs_react_ReactComponentB = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ReactComponentB: 0
}, false, "japgolly.scalajs.react.ReactComponentB", {
  Ljapgolly_scalajs_react_ReactComponentB: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_ReactComponentB.prototype.$classData = $d_Ljapgolly_scalajs_react_ReactComponentB;
/** @constructor */
function $c_Ljapgolly_scalajs_react_ReactComponentB$() {
  $c_O.call(this);
  this.japgolly$scalajs$react$ReactComponentB$$alwaysFalse$1 = null
}
$c_Ljapgolly_scalajs_react_ReactComponentB$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_ReactComponentB$.prototype.constructor = $c_Ljapgolly_scalajs_react_ReactComponentB$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ReactComponentB$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ReactComponentB$.prototype = $c_Ljapgolly_scalajs_react_ReactComponentB$.prototype;
$c_Ljapgolly_scalajs_react_ReactComponentB$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_ReactComponentB$ = this;
  this.japgolly$scalajs$react$ReactComponentB$$alwaysFalse$1 = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(a$1) {
    return (function() {
      return a$1
    })
  })(false));
  return this
});
var $d_Ljapgolly_scalajs_react_ReactComponentB$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ReactComponentB$: 0
}, false, "japgolly.scalajs.react.ReactComponentB$", {
  Ljapgolly_scalajs_react_ReactComponentB$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_ReactComponentB$.prototype.$classData = $d_Ljapgolly_scalajs_react_ReactComponentB$;
var $n_Ljapgolly_scalajs_react_ReactComponentB$ = (void 0);
function $m_Ljapgolly_scalajs_react_ReactComponentB$() {
  if ((!$n_Ljapgolly_scalajs_react_ReactComponentB$)) {
    $n_Ljapgolly_scalajs_react_ReactComponentB$ = new $c_Ljapgolly_scalajs_react_ReactComponentB$().init___()
  };
  return $n_Ljapgolly_scalajs_react_ReactComponentB$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_ReactComponentB$Builder() {
  $c_O.call(this);
  this.buildFn$1 = null;
  this.$$outer$1 = null
}
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder.prototype.constructor = $c_Ljapgolly_scalajs_react_ReactComponentB$Builder;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ReactComponentB$Builder() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ReactComponentB$Builder.prototype = $c_Ljapgolly_scalajs_react_ReactComponentB$Builder.prototype;
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder.prototype.init___Ljapgolly_scalajs_react_ReactComponentB__F1 = (function($$outer, buildFn) {
  this.buildFn$1 = buildFn;
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$1 = $$outer
  };
  return this
});
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder.prototype.buildSpec__Ljapgolly_scalajs_react_ReactComponentSpec = (function() {
  var spec = $m_sjs_js_Dictionary$().empty__sjs_js_Dictionary();
  var this$1 = $m_s_Option$().apply__O__s_Option(this.$$outer$1.name$1);
  if ((!this$1.isEmpty__Z())) {
    var arg1 = this$1.get__O();
    var n = $as_T(arg1);
    spec["displayName"] = n
  };
  if (this.$$outer$1.japgolly$scalajs$react$ReactComponentB$$ibf$f.isDefined__Z()) {
    spec["backend"] = null
  };
  spec["render"] = (function(f) {
    return (function() {
      return f.apply__O__O(this)
    })
  })(this.$$outer$1.japgolly$scalajs$react$ReactComponentB$$rf$f);
  var elem = $m_s_None$();
  var elem$1 = null;
  elem$1 = elem;
  var this$4 = this.$$outer$1.japgolly$scalajs$react$ReactComponentB$$ibf$f;
  if ((!this$4.isEmpty__Z())) {
    var v1 = this$4.get__O();
    var initBackend = $as_F1(v1);
    var f$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(initBackend$1) {
      return (function($$$) {
        var backend = initBackend$1.apply__O__O($$$);
        $$$["backend"] = backend
      })
    })(initBackend));
    var this$5 = $as_s_Option(elem$1);
    var f$2 = new $c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2().init___Ljapgolly_scalajs_react_ReactComponentB$Builder__F1(this, f$1);
    if (this$5.isEmpty__Z()) {
      var jsx$1 = f$1
    } else {
      var v1$1 = this$5.get__O();
      var jsx$1 = f$2.apply__F1__F1($as_F1(v1$1))
    };
    elem$1 = new $c_s_Some().init___O(jsx$1)
  };
  var $$this = this.$$outer$1.japgolly$scalajs$react$ReactComponentB$$lc$f.componentWillMount$1;
  if (($$this !== (void 0))) {
    var f$3 = $as_F1($$this);
    var f$4 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(f$18) {
      return (function(x$13$2) {
        var $$this$1 = $as_Ljapgolly_scalajs_react_CallbackTo(f$18.apply__O__O(x$13$2)).japgolly$scalajs$react$CallbackTo$$f$1;
        $$this$1.apply__O()
      })
    })(f$3));
    var this$10 = $as_s_Option(elem$1);
    var f$5 = new $c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2().init___Ljapgolly_scalajs_react_ReactComponentB$Builder__F1(this, f$4);
    if (this$10.isEmpty__Z()) {
      var jsx$2 = f$4
    } else {
      var v1$2 = this$10.get__O();
      var jsx$2 = f$5.apply__F1__F1($as_F1(v1$2))
    };
    elem$1 = new $c_s_Some().init___O(jsx$2)
  };
  var this$11 = $as_s_Option(elem$1);
  if ((!this$11.isEmpty__Z())) {
    var arg1$1 = this$11.get__O();
    var f$6 = $as_F1(arg1$1);
    spec["componentWillMount"] = (function(f$7) {
      return (function() {
        return f$7.apply__O__O(this)
      })
    })(f$6)
  };
  var initStateFn = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer) {
    return (function($$$$1) {
      var jsx$3 = $m_Ljapgolly_scalajs_react_package$();
      var $$this$2 = $as_Ljapgolly_scalajs_react_CallbackTo(arg$outer.$$outer$1.japgolly$scalajs$react$ReactComponentB$$isf$f.apply__O__O($$$$1)).japgolly$scalajs$react$CallbackTo$$f$1;
      return jsx$3.WrapObj__O__Ljapgolly_scalajs_react_package$WrapObj($$this$2.apply__O())
    })
  })(this));
  spec["getInitialState"] = (function(f$8) {
    return (function() {
      return f$8.apply__O__O(this)
    })
  })(initStateFn);
  var $$this$3 = this.$$outer$1.japgolly$scalajs$react$ReactComponentB$$lc$f.getDefaultProps$1;
  if (($$this$3 === (void 0))) {
    var $$this$4 = (void 0)
  } else {
    var x$14 = $as_Ljapgolly_scalajs_react_CallbackTo($$this$3).japgolly$scalajs$react$CallbackTo$$f$1;
    var $$this$4 = $m_Ljapgolly_scalajs_react_CallbackTo$().toJsCallback$extension__F0__sjs_js_UndefOr(x$14)
  };
  if (($$this$4 !== (void 0))) {
    spec["getDefaultProps"] = $$this$4
  };
  var fn = this.$$outer$1.japgolly$scalajs$react$ReactComponentB$$lc$f.componentWillUnmount$1;
  if ((fn !== (void 0))) {
    var f$9 = $as_F1(fn);
    var g = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(f$17) {
      return (function(a$2) {
        var $$this$5 = $as_Ljapgolly_scalajs_react_CallbackTo(f$17.apply__O__O(a$2)).japgolly$scalajs$react$CallbackTo$$f$1;
        $$this$5.apply__O()
      })
    })(f$9));
    spec["componentWillUnmount"] = (function(f$10) {
      return (function() {
        return f$10.apply__O__O(this)
      })
    })(g)
  };
  var fn$1 = this.$$outer$1.japgolly$scalajs$react$ReactComponentB$$lc$f.componentDidMount$1;
  if ((fn$1 !== (void 0))) {
    var f$11 = $as_F1(fn$1);
    var g$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(f$17$1) {
      return (function(a$2$1) {
        var $$this$6 = $as_Ljapgolly_scalajs_react_CallbackTo(f$17$1.apply__O__O(a$2$1)).japgolly$scalajs$react$CallbackTo$$f$1;
        $$this$6.apply__O()
      })
    })(f$11));
    spec["componentDidMount"] = (function(f$12) {
      return (function() {
        return f$12.apply__O__O(this)
      })
    })(g$1)
  };
  var a = new $c_sjsr_AnonFunction3().init___sjs_js_Function3((function($$$$2, nextProps$2, nextState$2) {
    return new $c_Ljapgolly_scalajs_react_ComponentWillUpdate().init___Ljapgolly_scalajs_react_CompScope$WillUpdate__O__O($$$$2, nextProps$2, nextState$2)
  }));
  var fn$2 = this.$$outer$1.japgolly$scalajs$react$ReactComponentB$$lc$f.componentWillUpdate$1;
  var f$13 = new $c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1().init___Ljapgolly_scalajs_react_ReactComponentB$Builder__sjs_js_Dictionary__F3__T(this, spec, a, "componentWillUpdate");
  if ((fn$2 !== (void 0))) {
    f$13.apply__F1__V($as_F1(fn$2))
  };
  var a$1 = new $c_sjsr_AnonFunction3().init___sjs_js_Function3((function($$$$3, prevProps$2, prevState$2) {
    return new $c_Ljapgolly_scalajs_react_ComponentDidUpdate().init___Ljapgolly_scalajs_react_CompScope$DuringCallbackM__O__O($$$$3, prevProps$2, prevState$2)
  }));
  var fn$3 = this.$$outer$1.japgolly$scalajs$react$ReactComponentB$$lc$f.componentDidUpdate$1;
  var f$14 = new $c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1().init___Ljapgolly_scalajs_react_ReactComponentB$Builder__sjs_js_Dictionary__F3__T(this, spec, a$1, "componentDidUpdate");
  if ((fn$3 !== (void 0))) {
    f$14.apply__F1__V($as_F1(fn$3))
  };
  var a$3 = new $c_sjsr_AnonFunction3().init___sjs_js_Function3((function($$$$4, nextProps$2$1, nextState$2$1) {
    return new $c_Ljapgolly_scalajs_react_ShouldComponentUpdate().init___Ljapgolly_scalajs_react_CompScope$DuringCallbackM__O__O($$$$4, nextProps$2$1, nextState$2$1)
  }));
  var fn$4 = this.$$outer$1.japgolly$scalajs$react$ReactComponentB$$lc$f.shouldComponentUpdate$1;
  var f$15 = new $c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1().init___Ljapgolly_scalajs_react_ReactComponentB$Builder__sjs_js_Dictionary__F3__T(this, spec, a$3, "shouldComponentUpdate");
  if ((fn$4 !== (void 0))) {
    f$15.apply__F1__V($as_F1(fn$4))
  };
  var a$4 = new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function($$$$5, nextProps$2$2) {
    return new $c_Ljapgolly_scalajs_react_ComponentWillReceiveProps().init___Ljapgolly_scalajs_react_CompScope$DuringCallbackM__O($$$$5, nextProps$2$2)
  }));
  var fn$5 = this.$$outer$1.japgolly$scalajs$react$ReactComponentB$$lc$f.componentWillReceiveProps$1;
  var f$16 = new $c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnP$1$1().init___Ljapgolly_scalajs_react_ReactComponentB$Builder__sjs_js_Dictionary__F2__T(this, spec, a$4, "componentWillReceiveProps");
  if ((fn$5 !== (void 0))) {
    f$16.apply__F1__V($as_F1(fn$5))
  };
  var this$39 = this.$$outer$1.japgolly$scalajs$react$ReactComponentB$$jsMixins$f;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$39)) {
    var col = this.$$outer$1.japgolly$scalajs$react$ReactComponentB$$jsMixins$f;
    if ($is_sjs_js_ArrayOps(col)) {
      var x2 = $as_sjs_js_ArrayOps(col);
      var jsx$4 = x2.result__sjs_js_Array()
    } else if ($is_sjs_js_WrappedArray(col)) {
      var x3 = $as_sjs_js_WrappedArray(col);
      var jsx$4 = x3.array$6
    } else {
      var result = [];
      var this$41 = col.iterator__sci_VectorIterator();
      while (this$41.$$undhasNext$2) {
        var arg1$2 = this$41.next__O();
        $uI(result["push"](arg1$2))
      };
      var jsx$4 = result
    };
    spec["mixins"] = jsx$4
  };
  var $$this$7 = this.$$outer$1.japgolly$scalajs$react$ReactComponentB$$lc$f.configureSpec$1;
  if (($$this$7 !== (void 0))) {
    var x$16 = $as_F1($$this$7);
    var $$this$8 = $as_Ljapgolly_scalajs_react_CallbackTo(x$16.apply__O__O(spec)).japgolly$scalajs$react$CallbackTo$$f$1;
    $$this$8.apply__O()
  };
  return spec
});
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder.prototype.build__O = (function() {
  var c = $g["React"]["createClass"](this.buildSpec__Ljapgolly_scalajs_react_ReactComponentSpec());
  var f = $g["React"]["createFactory"](c);
  var r = new $c_Ljapgolly_scalajs_react_ReactComponentC$ReqProps().init___Ljapgolly_scalajs_react_ReactComponentCU__Ljapgolly_scalajs_react_ReactClass__sjs_js_UndefOr__sjs_js_UndefOr(f, c, (void 0), (void 0));
  return this.buildFn$1.apply__O__O(r)
});
var $d_Ljapgolly_scalajs_react_ReactComponentB$Builder = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ReactComponentB$Builder: 0
}, false, "japgolly.scalajs.react.ReactComponentB$Builder", {
  Ljapgolly_scalajs_react_ReactComponentB$Builder: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder.prototype.$classData = $d_Ljapgolly_scalajs_react_ReactComponentB$Builder;
/** @constructor */
function $c_Ljapgolly_scalajs_react_ReactComponentB$P() {
  $c_O.call(this);
  this.name$1 = null
}
$c_Ljapgolly_scalajs_react_ReactComponentB$P.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_ReactComponentB$P.prototype.constructor = $c_Ljapgolly_scalajs_react_ReactComponentB$P;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ReactComponentB$P() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ReactComponentB$P.prototype = $c_Ljapgolly_scalajs_react_ReactComponentB$P.prototype;
$c_Ljapgolly_scalajs_react_ReactComponentB$P.prototype.initialStateCB__F0__Ljapgolly_scalajs_react_ReactComponentB$PS = (function(s) {
  return this.getInitialStateCB__F1__Ljapgolly_scalajs_react_ReactComponentB$PS(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(s$1) {
    return (function(x$3$2) {
      return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(s$1)
    })
  })(s)))
});
$c_Ljapgolly_scalajs_react_ReactComponentB$P.prototype.getInitialStateCB__F1__Ljapgolly_scalajs_react_ReactComponentB$PS = (function(f) {
  return new $c_Ljapgolly_scalajs_react_ReactComponentB$PS().init___T__F1(this.name$1, f)
});
$c_Ljapgolly_scalajs_react_ReactComponentB$P.prototype.init___T = (function(name) {
  this.name$1 = name;
  return this
});
var $d_Ljapgolly_scalajs_react_ReactComponentB$P = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ReactComponentB$P: 0
}, false, "japgolly.scalajs.react.ReactComponentB$P", {
  Ljapgolly_scalajs_react_ReactComponentB$P: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_ReactComponentB$P.prototype.$classData = $d_Ljapgolly_scalajs_react_ReactComponentB$P;
/** @constructor */
function $c_Ljapgolly_scalajs_react_ReactComponentB$PS() {
  $c_O.call(this);
  this.name$1 = null;
  this.isf$1 = null
}
$c_Ljapgolly_scalajs_react_ReactComponentB$PS.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_ReactComponentB$PS.prototype.constructor = $c_Ljapgolly_scalajs_react_ReactComponentB$PS;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ReactComponentB$PS() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ReactComponentB$PS.prototype = $c_Ljapgolly_scalajs_react_ReactComponentB$PS.prototype;
$c_Ljapgolly_scalajs_react_ReactComponentB$PS.prototype.backend__F1__Ljapgolly_scalajs_react_ReactComponentB$PSB = (function(initBackend) {
  return new $c_Ljapgolly_scalajs_react_ReactComponentB$PSB().init___T__F1__s_Option(this.name$1, this.isf$1, new $c_s_Some().init___O(initBackend))
});
$c_Ljapgolly_scalajs_react_ReactComponentB$PS.prototype.init___T__F1 = (function(name, isf) {
  this.name$1 = name;
  this.isf$1 = isf;
  return this
});
var $d_Ljapgolly_scalajs_react_ReactComponentB$PS = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ReactComponentB$PS: 0
}, false, "japgolly.scalajs.react.ReactComponentB$PS", {
  Ljapgolly_scalajs_react_ReactComponentB$PS: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_ReactComponentB$PS.prototype.$classData = $d_Ljapgolly_scalajs_react_ReactComponentB$PS;
/** @constructor */
function $c_Ljapgolly_scalajs_react_ReactComponentB$PSB() {
  $c_O.call(this);
  this.name$1 = null;
  this.isf$1 = null;
  this.ibf$1 = null
}
$c_Ljapgolly_scalajs_react_ReactComponentB$PSB.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_ReactComponentB$PSB.prototype.constructor = $c_Ljapgolly_scalajs_react_ReactComponentB$PSB;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ReactComponentB$PSB() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ReactComponentB$PSB.prototype = $c_Ljapgolly_scalajs_react_ReactComponentB$PSB.prototype;
$c_Ljapgolly_scalajs_react_ReactComponentB$PSB.prototype.render$undS__F1__Ljapgolly_scalajs_react_ReactComponentB$PSBR = (function(f) {
  return this.render__F1__Ljapgolly_scalajs_react_ReactComponentB$PSBR(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(f$13) {
    return (function($$$) {
      var this$2 = new $c_Ljapgolly_scalajs_react_CompState$ReadDirectWriteCallback().init___O__Ljapgolly_scalajs_react_CompState$Accessor($$$, $m_Ljapgolly_scalajs_react_CompState$RootAccessor$().instance$1);
      var this$3 = this$2.a$1;
      var $$ = this$2.$$$1;
      return f$13.apply__O__O(this$3.state__Ljapgolly_scalajs_react_CompScope$CanSetState__O($$))
    })
  })(f)))
});
$c_Ljapgolly_scalajs_react_ReactComponentB$PSB.prototype.init___T__F1__s_Option = (function(name, isf, ibf) {
  this.name$1 = name;
  this.isf$1 = isf;
  this.ibf$1 = ibf;
  return this
});
$c_Ljapgolly_scalajs_react_ReactComponentB$PSB.prototype.render__F1__Ljapgolly_scalajs_react_ReactComponentB$PSBR = (function(f) {
  return new $c_Ljapgolly_scalajs_react_ReactComponentB$PSBR().init___T__F1__s_Option__F1(this.name$1, this.isf$1, this.ibf$1, f)
});
var $d_Ljapgolly_scalajs_react_ReactComponentB$PSB = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ReactComponentB$PSB: 0
}, false, "japgolly.scalajs.react.ReactComponentB$PSB", {
  Ljapgolly_scalajs_react_ReactComponentB$PSB: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_ReactComponentB$PSB.prototype.$classData = $d_Ljapgolly_scalajs_react_ReactComponentB$PSB;
/** @constructor */
function $c_Ljapgolly_scalajs_react_ReactComponentB$PSBR() {
  $c_O.call(this);
  this.name$1 = null;
  this.isf$1 = null;
  this.ibf$1 = null;
  this.rf$1 = null
}
$c_Ljapgolly_scalajs_react_ReactComponentB$PSBR.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_ReactComponentB$PSBR.prototype.constructor = $c_Ljapgolly_scalajs_react_ReactComponentB$PSBR;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ReactComponentB$PSBR() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ReactComponentB$PSBR.prototype = $c_Ljapgolly_scalajs_react_ReactComponentB$PSBR.prototype;
$c_Ljapgolly_scalajs_react_ReactComponentB$PSBR.prototype.init___T__F1__s_Option__F1 = (function(name, isf, ibf, rf) {
  this.name$1 = name;
  this.isf$1 = isf;
  this.ibf$1 = ibf;
  this.rf$1 = rf;
  return this
});
$c_Ljapgolly_scalajs_react_ReactComponentB$PSBR.prototype.domType__Ljapgolly_scalajs_react_ReactComponentB = (function() {
  var jsx$5 = this.name$1;
  var jsx$4 = this.isf$1;
  var jsx$3 = this.ibf$1;
  var jsx$2 = this.rf$1;
  $m_Ljapgolly_scalajs_react_ReactComponentB$();
  var jsx$1 = new $c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle().init___sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr((void 0), (void 0), (void 0), (void 0), (void 0), (void 0), (void 0), (void 0), (void 0));
  var this$2 = $m_s_package$().Vector$1;
  return new $c_Ljapgolly_scalajs_react_ReactComponentB().init___T__F1__s_Option__F1__Ljapgolly_scalajs_react_ReactComponentB$LifeCycle__sci_Vector(jsx$5, jsx$4, jsx$3, jsx$2, jsx$1, this$2.NIL$6)
});
var $d_Ljapgolly_scalajs_react_ReactComponentB$PSBR = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ReactComponentB$PSBR: 0
}, false, "japgolly.scalajs.react.ReactComponentB$PSBR", {
  Ljapgolly_scalajs_react_ReactComponentB$PSBR: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_ReactComponentB$PSBR.prototype.$classData = $d_Ljapgolly_scalajs_react_ReactComponentB$PSBR;
/** @constructor */
function $c_Ljapgolly_scalajs_react_ReactComponentC$() {
  $c_O.call(this);
  this.japgolly$scalajs$react$ReactComponentC$$fnUnit0$f = null
}
$c_Ljapgolly_scalajs_react_ReactComponentC$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_ReactComponentC$.prototype.constructor = $c_Ljapgolly_scalajs_react_ReactComponentC$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ReactComponentC$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ReactComponentC$.prototype = $c_Ljapgolly_scalajs_react_ReactComponentC$.prototype;
$c_Ljapgolly_scalajs_react_ReactComponentC$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_ReactComponentC$ = this;
  this.japgolly$scalajs$react$ReactComponentC$$fnUnit0$f = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function() {
    return (void 0)
  }));
  return this
});
var $d_Ljapgolly_scalajs_react_ReactComponentC$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ReactComponentC$: 0
}, false, "japgolly.scalajs.react.ReactComponentC$", {
  Ljapgolly_scalajs_react_ReactComponentC$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_ReactComponentC$.prototype.$classData = $d_Ljapgolly_scalajs_react_ReactComponentC$;
var $n_Ljapgolly_scalajs_react_ReactComponentC$ = (void 0);
function $m_Ljapgolly_scalajs_react_ReactComponentC$() {
  if ((!$n_Ljapgolly_scalajs_react_ReactComponentC$)) {
    $n_Ljapgolly_scalajs_react_ReactComponentC$ = new $c_Ljapgolly_scalajs_react_ReactComponentC$().init___()
  };
  return $n_Ljapgolly_scalajs_react_ReactComponentC$
}
function $s_Ljapgolly_scalajs_react_extra_Broadcaster$class__register__Ljapgolly_scalajs_react_extra_Broadcaster__F1__F0($$this, f) {
  var f$1 = new $c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1().init___Ljapgolly_scalajs_react_extra_Broadcaster__F1($$this, f);
  return f$1
}
function $s_Ljapgolly_scalajs_react_extra_Broadcaster$class__broadcast__Ljapgolly_scalajs_react_extra_Broadcaster__O__F0($$this, a) {
  $m_Ljapgolly_scalajs_react_Callback$();
  var f = new $c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$broadcast$1().init___Ljapgolly_scalajs_react_extra_Broadcaster__O($$this, a);
  var f$2 = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(f$1) {
    return (function() {
      f$1.apply__O()
    })
  })(f));
  return f$2
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_EventListener$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_extra_EventListener$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_EventListener$.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_EventListener$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_EventListener$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_EventListener$.prototype = $c_Ljapgolly_scalajs_react_extra_EventListener$.prototype;
$c_Ljapgolly_scalajs_react_extra_EventListener$.prototype.install__T__F1__F1__Z__F1 = (function(eventType, listener, target, useCapture) {
  return $m_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$().install$extension__Z__T__F1__F1__Z__F1(true, eventType, new $c_Ljapgolly_scalajs_react_extra_EventListener$$anonfun$install$1().init___F1(listener), target, useCapture)
});
var $d_Ljapgolly_scalajs_react_extra_EventListener$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_EventListener$: 0
}, false, "japgolly.scalajs.react.extra.EventListener$", {
  Ljapgolly_scalajs_react_extra_EventListener$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_extra_EventListener$.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_EventListener$;
var $n_Ljapgolly_scalajs_react_extra_EventListener$ = (void 0);
function $m_Ljapgolly_scalajs_react_extra_EventListener$() {
  if ((!$n_Ljapgolly_scalajs_react_extra_EventListener$)) {
    $n_Ljapgolly_scalajs_react_extra_EventListener$ = new $c_Ljapgolly_scalajs_react_extra_EventListener$().init___()
  };
  return $n_Ljapgolly_scalajs_react_extra_EventListener$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$.prototype = $c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$.prototype;
$c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$.prototype.install$extension__Z__T__F1__F1__Z__F1 = (function($$this, eventType, listener, target, useCapture) {
  var this$2 = new $c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$install$1().init___();
  var g = new $c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1().init___T__F1__F1__Z(eventType, listener, target, useCapture);
  return $s_s_Function1$class__andThen__F1__F1__F1(this$2, g)
});
var $d_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_EventListener$OfEventType$: 0
}, false, "japgolly.scalajs.react.extra.EventListener$OfEventType$", {
  Ljapgolly_scalajs_react_extra_EventListener$OfEventType$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$;
var $n_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$ = (void 0);
function $m_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$() {
  if ((!$n_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$)) {
    $n_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$ = new $c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$().init___()
  };
  return $n_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_Listenable$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_extra_Listenable$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_Listenable$.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_Listenable$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_Listenable$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_Listenable$.prototype = $c_Ljapgolly_scalajs_react_extra_Listenable$.prototype;
$c_Ljapgolly_scalajs_react_extra_Listenable$.prototype.install__F1__F1__F1 = (function(f, g) {
  var this$2 = new $c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$install$1().init___();
  var g$1 = new $c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1().init___F1__F1(f, g);
  return $s_s_Function1$class__andThen__F1__F1__F1(this$2, g$1)
});
$c_Ljapgolly_scalajs_react_extra_Listenable$.prototype.installU__F1__F1__F1 = (function(f, g) {
  return this.install__F1__F1__F1(f, new $c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$installU$1().init___F1(g))
});
var $d_Ljapgolly_scalajs_react_extra_Listenable$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_Listenable$: 0
}, false, "japgolly.scalajs.react.extra.Listenable$", {
  Ljapgolly_scalajs_react_extra_Listenable$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_extra_Listenable$.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_Listenable$;
var $n_Ljapgolly_scalajs_react_extra_Listenable$ = (void 0);
function $m_Ljapgolly_scalajs_react_extra_Listenable$() {
  if ((!$n_Ljapgolly_scalajs_react_extra_Listenable$)) {
    $n_Ljapgolly_scalajs_react_extra_Listenable$ = new $c_Ljapgolly_scalajs_react_extra_Listenable$().init___()
  };
  return $n_Ljapgolly_scalajs_react_extra_Listenable$
}
function $s_Ljapgolly_scalajs_react_extra_OnUnmount$class__onUnmount__Ljapgolly_scalajs_react_extra_OnUnmount__F0__F0($$this, f) {
  $m_Ljapgolly_scalajs_react_Callback$();
  var f$2 = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(arg$outer, f$1) {
    return (function() {
      var this$1 = arg$outer.japgolly$scalajs$react$extra$OnUnmount$$unmountProcs$1;
      var x = new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(f$1);
      arg$outer.japgolly$scalajs$react$extra$OnUnmount$$unmountProcs$1 = new $c_sci_$colon$colon().init___O__sci_List(x, this$1)
    })
  })($$this, f));
  var f$3 = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(f$1$1) {
    return (function() {
      f$1$1.apply__O()
    })
  })(f$2));
  return f$3
}
function $s_Ljapgolly_scalajs_react_extra_OnUnmount$class__unmount__Ljapgolly_scalajs_react_extra_OnUnmount__F0($$this) {
  $m_Ljapgolly_scalajs_react_Callback$();
  var f = new $c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$unmount$1().init___Ljapgolly_scalajs_react_extra_OnUnmount($$this);
  var f$2 = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(f$1) {
    return (function() {
      f$1.apply__O()
    })
  })(f));
  return f$2
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_PathLike() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_extra_router_PathLike.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_PathLike.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_PathLike;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_PathLike() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_PathLike.prototype = $c_Ljapgolly_scalajs_react_extra_router_PathLike.prototype;
$c_Ljapgolly_scalajs_react_extra_router_PathLike.prototype.endWith$und$div__Ljapgolly_scalajs_react_extra_router_PathLike = (function() {
  var arg1 = this.str__Ljapgolly_scalajs_react_extra_router_PathLike__T(this);
  return this.make__T__Ljapgolly_scalajs_react_extra_router_PathLike($m_sjsr_RuntimeString$().replaceFirst__T__T__T__T(arg1, "/*$", "/"))
});
$c_Ljapgolly_scalajs_react_extra_router_PathLike.prototype.$$plus__T__Ljapgolly_scalajs_react_extra_router_PathLike = (function(p) {
  var arg1 = this.str__Ljapgolly_scalajs_react_extra_router_PathLike__T(this);
  return this.make__T__Ljapgolly_scalajs_react_extra_router_PathLike((("" + arg1) + p))
});
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouteCmd() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouteCmd;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouteCmd() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouteCmd.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouteCmd.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd.prototype.$$greater$greater__Ljapgolly_scalajs_react_extra_router_RouteCmd__Ljapgolly_scalajs_react_extra_router_RouteCmd = (function(next) {
  if ($is_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence(this)) {
    var x2 = $as_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence(this);
    var x = x2.init$2;
    var y = x2.last$2;
    var init = $as_sci_Vector(x.$$colon$plus__O__scg_CanBuildFrom__O(y, ($m_sci_Vector$(), $m_sc_IndexedSeq$().ReusableCBF$6)))
  } else {
    var this$2 = $m_s_package$().Vector$1;
    var init = $as_sci_Vector(this$2.NIL$6.$$colon$plus__O__scg_CanBuildFrom__O(this, ($m_sci_Vector$(), $m_sc_IndexedSeq$().ReusableCBF$6)))
  };
  return new $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence().init___sci_Vector__Ljapgolly_scalajs_react_extra_router_RouteCmd(init, next)
});
function $is_Ljapgolly_scalajs_react_extra_router_RouteCmd(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_RouteCmd)))
}
function $as_Ljapgolly_scalajs_react_extra_router_RouteCmd(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_RouteCmd(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.RouteCmd"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_RouteCmd)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.RouteCmd;", depth))
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_Router$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_extra_router_Router$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_Router$.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_Router$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_Router$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_Router$.prototype = $c_Ljapgolly_scalajs_react_extra_router_Router$.prototype;
$c_Ljapgolly_scalajs_react_extra_router_Router$.prototype.componentUnbuilt__Ljapgolly_scalajs_react_extra_router_BaseUrl__Ljapgolly_scalajs_react_extra_router_RouterConfig__Ljapgolly_scalajs_react_ReactComponentB = (function(baseUrl, cfg) {
  return this.componentUnbuiltC__Ljapgolly_scalajs_react_extra_router_BaseUrl__Ljapgolly_scalajs_react_extra_router_RouterConfig__Ljapgolly_scalajs_react_extra_router_RouterLogic__Ljapgolly_scalajs_react_ReactComponentB(baseUrl, cfg, new $c_Ljapgolly_scalajs_react_extra_router_RouterLogic().init___Ljapgolly_scalajs_react_extra_router_BaseUrl__Ljapgolly_scalajs_react_extra_router_RouterConfig(baseUrl, cfg))
});
$c_Ljapgolly_scalajs_react_extra_router_Router$.prototype.apply__Ljapgolly_scalajs_react_extra_router_BaseUrl__Ljapgolly_scalajs_react_extra_router_RouterConfig__Ljapgolly_scalajs_react_ReactComponentC$ConstProps = (function(baseUrl, cfg) {
  var this$2 = this.componentUnbuilt__Ljapgolly_scalajs_react_extra_router_BaseUrl__Ljapgolly_scalajs_react_extra_router_RouterConfig__Ljapgolly_scalajs_react_ReactComponentB(baseUrl, cfg);
  var ev = $m_s_Predef$().scala$Predef$$singleton$und$eq$colon$eq$f;
  var buildFn = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(ev$1) {
    return (function(x$12$2) {
      var x$12 = $as_Ljapgolly_scalajs_react_ReactComponentC$ReqProps(x$12$2);
      return new $c_Ljapgolly_scalajs_react_ReactComponentC$ConstProps().init___Ljapgolly_scalajs_react_ReactComponentCU__Ljapgolly_scalajs_react_ReactClass__sjs_js_UndefOr__sjs_js_UndefOr__F0(x$12.factory$2, x$12.reactClass$2, x$12.key$2, x$12.ref$2, $m_Ljapgolly_scalajs_react_ReactComponentC$().japgolly$scalajs$react$ReactComponentC$$fnUnit0$f)
    })
  })(ev));
  return $as_Ljapgolly_scalajs_react_ReactComponentC$ConstProps(new $c_Ljapgolly_scalajs_react_ReactComponentB$Builder().init___Ljapgolly_scalajs_react_ReactComponentB__F1(this$2, buildFn).build__O())
});
$c_Ljapgolly_scalajs_react_extra_router_Router$.prototype.componentUnbuiltC__Ljapgolly_scalajs_react_extra_router_BaseUrl__Ljapgolly_scalajs_react_extra_router_RouterConfig__Ljapgolly_scalajs_react_extra_router_RouterLogic__Ljapgolly_scalajs_react_ReactComponentB = (function(baseUrl, cfg, lgc) {
  $m_Ljapgolly_scalajs_react_ReactComponentB$();
  var x = ($m_Ljapgolly_scalajs_react_ReactComponentB$(), new $c_Ljapgolly_scalajs_react_ReactComponentB$P().init___T("Router")).initialStateCB__F0__Ljapgolly_scalajs_react_ReactComponentB$PS(lgc.syncToWindowUrl$1).backend__F1__Ljapgolly_scalajs_react_ReactComponentB$PSB(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$1$2) {
    return new $c_Ljapgolly_scalajs_react_extra_OnUnmount$Backend().init___()
  }))).render$undS__F1__Ljapgolly_scalajs_react_ReactComponentB$PSBR(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(lgc$1) {
    return (function(r$2) {
      var r = $as_Ljapgolly_scalajs_react_extra_router_Resolution(r$2);
      return lgc$1.render__Ljapgolly_scalajs_react_extra_router_Resolution__Ljapgolly_scalajs_react_ReactElement(r)
    })
  })(lgc)));
  var this$7 = x.domType__Ljapgolly_scalajs_react_ReactComponentB().componentDidMount__F1__Ljapgolly_scalajs_react_ReactComponentB(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(cfg$1) {
    return (function($$$) {
      var jsx$2 = cfg$1.postRenderFn$1;
      var jsx$1 = $m_s_None$();
      var this$4 = new $c_Ljapgolly_scalajs_react_CompState$ReadDirectWriteCallback().init___O__Ljapgolly_scalajs_react_CompState$Accessor($$$, $m_Ljapgolly_scalajs_react_CompState$RootAccessor$().instance$1);
      var this$5 = this$4.a$1;
      var $$ = this$4.$$$1;
      return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($as_Ljapgolly_scalajs_react_CallbackTo(jsx$2.apply__O__O__O(jsx$1, $as_Ljapgolly_scalajs_react_extra_router_Resolution(this$5.state__Ljapgolly_scalajs_react_CompScope$CanSetState__O($$)).page$1)).japgolly$scalajs$react$CallbackTo$$f$1)
    })
  })(cfg))).componentDidUpdate__F1__Ljapgolly_scalajs_react_ReactComponentB(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(cfg$1$1) {
    return (function(i$2) {
      var i = $as_Ljapgolly_scalajs_react_ComponentDidUpdate(i$2);
      return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($as_Ljapgolly_scalajs_react_CallbackTo(cfg$1$1.postRenderFn$1.apply__O__O__O(new $c_s_Some().init___O($as_Ljapgolly_scalajs_react_extra_router_Resolution(i.prevState$2).page$1), $as_Ljapgolly_scalajs_react_extra_router_Resolution(i.$$$2["state"]["v"]).page$1)).japgolly$scalajs$react$CallbackTo$$f$1)
    })
  })(cfg)));
  var array = [$m_Ljapgolly_scalajs_react_extra_EventListener$().install__T__F1__F1__Z__F1("popstate", new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(lgc$1$1) {
    return (function(x$2$2) {
      return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(lgc$1$1.ctl$1.refresh__F0())
    })
  })(lgc)), new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$3$2) {
    return $g["window"]
  })), false), $m_Ljapgolly_scalajs_react_extra_Listenable$().installU__F1__F1__F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(lgc$1$2) {
    return (function(x$4$2) {
      $asUnit(x$4$2);
      return lgc$1$2
    })
  })(lgc)), new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(lgc$1$3) {
    return (function($$$$1) {
      var qual$1 = new $c_Ljapgolly_scalajs_react_CompState$ReadDirectWriteCallback().init___O__Ljapgolly_scalajs_react_CompState$Accessor($$$$1, $m_Ljapgolly_scalajs_react_CompState$RootAccessor$().instance$1);
      var x$9 = lgc$1$3.syncToWindowUrl$1;
      var x$10 = $m_Ljapgolly_scalajs_react_Callback$().empty$1;
      return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($s_Ljapgolly_scalajs_react_CompState$WriteCallbackOps$class__setStateCB__Ljapgolly_scalajs_react_CompState$WriteCallbackOps__F0__F0__F0(qual$1, x$9, x$10))
    })
  })(lgc)))];
  var start = 0;
  var end = $uI(array["length"]);
  var z = this$7;
  x: {
    var jsx$3;
    _foldl: while (true) {
      if ((start === end)) {
        var jsx$3 = z;
        break x
      } else {
        var temp$start = ((1 + start) | 0);
        var arg1 = z;
        var index = start;
        var arg2 = array[index];
        var a = $as_Ljapgolly_scalajs_react_ReactComponentB(arg1);
        var f = $as_F1(arg2);
        var temp$z = $as_Ljapgolly_scalajs_react_ReactComponentB(f.apply__O__O(a));
        start = temp$start;
        z = temp$z;
        continue _foldl
      }
    }
  };
  return $as_Ljapgolly_scalajs_react_ReactComponentB(jsx$3)
});
var $d_Ljapgolly_scalajs_react_extra_router_Router$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_Router$: 0
}, false, "japgolly.scalajs.react.extra.router.Router$", {
  Ljapgolly_scalajs_react_extra_router_Router$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_extra_router_Router$.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_Router$;
var $n_Ljapgolly_scalajs_react_extra_router_Router$ = (void 0);
function $m_Ljapgolly_scalajs_react_extra_router_Router$() {
  if ((!$n_Ljapgolly_scalajs_react_extra_router_Router$)) {
    $n_Ljapgolly_scalajs_react_extra_router_Router$ = new $c_Ljapgolly_scalajs_react_extra_router_Router$().init___()
  };
  return $n_Ljapgolly_scalajs_react_extra_router_Router$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl() {
  $c_O.call(this);
  this.int$1 = null;
  this.long$1 = null;
  this.uuid$1 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl.prototype.init___ = (function() {
  this.int$1 = new $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB().init___T__I__F1__F1("(-?\\d+)", 1, new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(g$2) {
    var g = $as_F1(g$2);
    var this$2 = new $c_sci_StringOps().init___T($as_T(g.apply__O__O(0)));
    var this$4 = $m_jl_Integer$();
    var s = this$2.repr$1;
    return new $c_s_Some().init___O(this$4.parseInt__T__I__I(s, 10))
  })), new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$50$2) {
    var x$50 = $uI(x$50$2);
    return ("" + x$50)
  })));
  this.long$1 = new $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB().init___T__I__F1__F1("(-?\\d+)", 1, new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(g$2$1) {
    var g$1 = $as_F1(g$2$1);
    var this$7 = new $c_sci_StringOps().init___T($as_T(g$1.apply__O__O(0)));
    var this$9 = $m_jl_Long$();
    var s$1 = this$7.repr$1;
    return new $c_s_Some().init___O(this$9.parseLong__T__I__J(s$1, 10))
  })), new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$51$2) {
    var x$51 = $uJ(x$51$2);
    return $as_sjsr_RuntimeLong(x$51).toString__T()
  })));
  this.uuid$1 = new $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB().init___T__I__F1__F1("([A-Fa-f0-9]{8}(?:-[A-Fa-f0-9]{4}){3}-[A-Fa-f0-9]{12})", 1, new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(g$2$2) {
    var g$3 = $as_F1(g$2$2);
    return new $c_s_Some().init___O($m_ju_UUID$().fromString__T__ju_UUID($as_T(g$3.apply__O__O(0))))
  })), new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$52$2) {
    var x$52 = $as_ju_UUID(x$52$2);
    return x$52.toString__T()
  })));
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl.prototype.rewritePathR__ju_regex_Pattern__F1__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule = (function(r, f) {
  return this.rewritePathF__F1__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(r$4, f$8) {
    return (function(p$2) {
      var p = $as_Ljapgolly_scalajs_react_extra_router_Path(p$2);
      var input = p.value$2;
      var m = new $c_ju_regex_Matcher().init___ju_regex_Pattern__jl_CharSequence__I__I(r$4, input, 0, $uI(input["length"]));
      return (m.matches__Z() ? $as_s_Option(f$8.apply__O__O(m)) : $m_s_None$())
    })
  })(r, f)))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl.prototype.$$undauto$undnotFound$undfrom$undparsed__O__F1__F1 = (function(a, evidence$8) {
  return new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(a$2, evidence$8$1) {
    return (function(x$56$2) {
      $as_Ljapgolly_scalajs_react_extra_router_Path(x$56$2);
      return $as_s_util_Either(evidence$8$1.apply__O__O(a$2))
    })
  })(a, evidence$8))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl.prototype.removeLeadingSlashes__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule = (function() {
  var this$2 = new $c_sci_StringOps().init___T("^/+(.*)$");
  var groupNames = $m_sci_Nil$();
  var r = new $c_s_util_matching_Regex().init___T__sc_Seq(this$2.repr$1, groupNames);
  return this.rewritePathR__ju_regex_Pattern__F1__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule(r.pattern$1, new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer) {
    return (function(m$2) {
      var m = $as_ju_regex_Matcher(m$2);
      var a = arg$outer.redirectToPath__T__Ljapgolly_scalajs_react_extra_router_Redirect$Method__Ljapgolly_scalajs_react_extra_router_RedirectToPath(m.group__I__T(1), $m_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$());
      return new $c_s_Some().init___O(a)
    })
  })(this)))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl.prototype.trimSlashes__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule = (function() {
  var this$2 = new $c_sci_StringOps().init___T("^/*(.*?)/+$");
  var groupNames = $m_sci_Nil$();
  var r = new $c_s_util_matching_Regex().init___T__sc_Seq(this$2.repr$1, groupNames);
  return this.rewritePathR__ju_regex_Pattern__F1__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule(r.pattern$1, new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer) {
    return (function(m$2) {
      var m = $as_ju_regex_Matcher(m$2);
      var a = arg$outer.redirectToPath__T__Ljapgolly_scalajs_react_extra_router_Redirect$Method__Ljapgolly_scalajs_react_extra_router_RedirectToPath(m.group__I__T(1), $m_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$());
      return new $c_s_Some().init___O(a)
    })
  })(this))).$$bar__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule(this.removeLeadingSlashes__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule())
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl.prototype.$$undauto$undpToAction$undfrom$undaction__F0__F1 = (function(a) {
  return new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(a$4) {
    return (function(x$61$2) {
      return $as_Ljapgolly_scalajs_react_extra_router_Action(a$4.apply__O())
    })
  })(a))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl.prototype.render__F0__F1__Ljapgolly_scalajs_react_extra_router_Renderer = (function(a, evidence$2) {
  return new $c_Ljapgolly_scalajs_react_extra_router_Renderer().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(a$5, evidence$2$1) {
    return (function(x$53$2) {
      $as_Ljapgolly_scalajs_react_extra_router_RouterCtl(x$53$2);
      return evidence$2$1.apply__O__O(a$5.apply__O())
    })
  })(a, evidence$2)))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl.prototype.rewritePathF__F1__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule = (function(f) {
  var jsx$1 = $m_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$();
  var evidence$13 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer) {
    return (function(r$2) {
      var r = $as_Ljapgolly_scalajs_react_extra_router_Redirect(r$2);
      $m_s_package$();
      return new $c_s_util_Left().init___O(r)
    })
  })(this));
  return jsx$1.parseOnly__F1__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule(new $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$$undauto$undrouteParser$undfrom$undparsedFO$1().init___Ljapgolly_scalajs_react_extra_router_RouterConfigDsl__F1__F1(this, f, evidence$13))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl.prototype.redirectToPath__T__Ljapgolly_scalajs_react_extra_router_Redirect$Method__Ljapgolly_scalajs_react_extra_router_RedirectToPath = (function(path, method) {
  var path$1 = new $c_Ljapgolly_scalajs_react_extra_router_Path().init___T(path);
  return new $c_Ljapgolly_scalajs_react_extra_router_RedirectToPath().init___Ljapgolly_scalajs_react_extra_router_Path__Ljapgolly_scalajs_react_extra_router_Redirect$Method(path$1, method)
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl.prototype.japgolly$scalajs$react$extra$router$RouterConfigDsl$$onPage$1__F1__F1__F1 = (function(f, op$1) {
  return new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(op$1$1, f$7) {
    return (function(x$62$2) {
      var this$1 = $as_s_Option(op$1$1.apply__O__O(x$62$2));
      return (this$1.isEmpty__Z() ? $m_s_None$() : new $c_s_Some().init___O(f$7.apply__O__O(this$1.get__O())))
    })
  })(op$1, f))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl.prototype.staticRoute__Ljapgolly_scalajs_react_extra_router_StaticDsl$Route__O__F1 = (function(r, page) {
  var ev2 = $m_s_Predef$().scala$Predef$$singleton$und$eq$colon$eq$f;
  var b = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(b$3) {
    return (function(x$27$2) {
      return b$3
    })
  })(page));
  var a = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(ev2$1) {
    return (function(x$28$2) {
      return (void 0)
    })
  })(ev2));
  var r$1 = r.xmap__F1__F1__Ljapgolly_scalajs_react_extra_router_StaticDsl$Route(b, a);
  var pf = new $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$1().init___Ljapgolly_scalajs_react_extra_router_RouterConfigDsl__O(this, page);
  var op = new $c_s_PartialFunction$Lifted().init___s_PartialFunction(pf);
  var dyn = new $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1().init___Ljapgolly_scalajs_react_extra_router_RouterConfigDsl__Ljapgolly_scalajs_react_extra_router_StaticDsl$Route__F1(this, r$1, op);
  return new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer, dyn$1) {
    return (function(a$2) {
      var a$1 = $as_F0(a$2);
      var g = arg$outer.$$undauto$undpToAction$undfrom$undaction__F0__F1(a$1);
      return $as_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule(dyn$1.apply__O__O(g))
    })
  })(this, dyn))
});
function $is_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_RouterConfigDsl)))
}
function $as_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.RouterConfigDsl"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_RouterConfigDsl)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.RouterConfigDsl;", depth))
}
var $d_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouterConfigDsl: 0
}, false, "japgolly.scalajs.react.extra.router.RouterConfigDsl", {
  Ljapgolly_scalajs_react_extra_router_RouterConfigDsl: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$BuildInterface() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$BuildInterface.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$BuildInterface.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$BuildInterface;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$BuildInterface() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$BuildInterface.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$BuildInterface.prototype;
var $d_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$BuildInterface = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$BuildInterface: 0
}, false, "japgolly.scalajs.react.extra.router.RouterConfigDsl$BuildInterface", {
  Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$BuildInterface: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$BuildInterface.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$BuildInterface;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouterCtl() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_extra_router_RouterCtl.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_RouterCtl.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouterCtl;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouterCtl() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouterCtl.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouterCtl.prototype;
function $is_Ljapgolly_scalajs_react_extra_router_RouterCtl(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_RouterCtl)))
}
function $as_Ljapgolly_scalajs_react_extra_router_RouterCtl(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_RouterCtl(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.RouterCtl"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_RouterCtl(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_RouterCtl)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_RouterCtl(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_RouterCtl(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.RouterCtl;", depth))
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$() {
  $c_O.call(this);
  this.regexEscape1$1 = null;
  this.regexEscape2$1 = null
}
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_StaticDsl$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_StaticDsl$.prototype = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$.prototype;
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_extra_router_StaticDsl$ = this;
  var this$2 = new $c_sci_StringOps().init___T("([-()\\[\\]{}+?*.$\\^|,:#<!\\\\])");
  var groupNames = $m_sci_Nil$();
  var $$this = this$2.repr$1;
  this.regexEscape1$1 = new $c_s_util_matching_Regex().init___T__sc_Seq($$this, groupNames);
  var this$5 = new $c_sci_StringOps().init___T("\\x08");
  var groupNames$1 = $m_sci_Nil$();
  var $$this$1 = this$5.repr$1;
  this.regexEscape2$1 = new $c_s_util_matching_Regex().init___T__sc_Seq($$this$1, groupNames$1);
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$.prototype.regexEscape__T__T = (function(s) {
  var r = s;
  r = this.regexEscape1$1.replaceAllIn__jl_CharSequence__T__T(r, "\\\\$1");
  r = this.regexEscape2$1.replaceAllIn__jl_CharSequence__T__T(r, "\\\\x08");
  return r
});
var $d_Ljapgolly_scalajs_react_extra_router_StaticDsl$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_StaticDsl$: 0
}, false, "japgolly.scalajs.react.extra.router.StaticDsl$", {
  Ljapgolly_scalajs_react_extra_router_StaticDsl$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_StaticDsl$;
var $n_Ljapgolly_scalajs_react_extra_router_StaticDsl$ = (void 0);
function $m_Ljapgolly_scalajs_react_extra_router_StaticDsl$() {
  if ((!$n_Ljapgolly_scalajs_react_extra_router_StaticDsl$)) {
    $n_Ljapgolly_scalajs_react_extra_router_StaticDsl$ = new $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$().init___()
  };
  return $n_Ljapgolly_scalajs_react_extra_router_StaticDsl$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$() {
  $c_O.call(this);
  this.japgolly$scalajs$react$extra$router$StaticDsl$RouteB$$someUnit$1 = null;
  this.$$div$1 = null
}
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$.prototype = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$.prototype;
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$ = this;
  this.japgolly$scalajs$react$extra$router$StaticDsl$RouteB$$someUnit$1 = new $c_s_Some().init___O((void 0));
  this.$$div$1 = this.literal__T__Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB("/");
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$.prototype.literal__T__Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB = (function(s) {
  return new $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB().init___T__I__F1__F1($m_Ljapgolly_scalajs_react_extra_router_StaticDsl$().regexEscape__T__T(s), 0, new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$19$2) {
    $as_F1(x$19$2);
    return $m_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$().japgolly$scalajs$react$extra$router$StaticDsl$RouteB$$someUnit$1
  })), new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(s$1) {
    return (function(x$20$2) {
      $asUnit(x$20$2);
      return s$1
    })
  })(s)))
});
var $d_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$: 0
}, false, "japgolly.scalajs.react.extra.router.StaticDsl$RouteB$", {
  Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$;
var $n_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$ = (void 0);
function $m_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$() {
  if ((!$n_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$)) {
    $n_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$ = new $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$().init___()
  };
  return $n_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteCommon() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteCommon.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteCommon.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteCommon;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteCommon() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteCommon.prototype = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteCommon.prototype;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$.prototype = $c_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$.prototype;
$c_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$.prototype.map$extension__s_util_Either__F1__s_util_Either = (function($$this, f) {
  if ($is_s_util_Right($$this)) {
    var x2 = $as_s_util_Right($$this);
    var b = x2.b$2;
    $m_s_package$();
    var b$1 = f.apply__O__O(b);
    return new $c_s_util_Right().init___O(b$1)
  } else if ($is_s_util_Left($$this)) {
    var x3 = $as_s_util_Left($$this);
    return x3
  } else {
    throw new $c_s_MatchError().init___O($$this)
  }
});
var $d_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$: 0
}, false, "japgolly.scalajs.react.extra.router.package$SaneEitherMethods$", {
  Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$;
var $n_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$ = (void 0);
function $m_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$() {
  if ((!$n_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$)) {
    $n_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$ = new $c_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$().init___()
  };
  return $n_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Builder() {
  $c_O.call(this);
  this.className$1 = null;
  this.japgolly$scalajs$react$vdom$Builder$$props$f = null;
  this.japgolly$scalajs$react$vdom$Builder$$style$f = null;
  this.children$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_Builder.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_Builder.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Builder;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Builder() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Builder.prototype = $c_Ljapgolly_scalajs_react_vdom_Builder.prototype;
$c_Ljapgolly_scalajs_react_vdom_Builder.prototype.init___ = (function() {
  this.className$1 = (void 0);
  this.japgolly$scalajs$react$vdom$Builder$$props$f = {};
  this.japgolly$scalajs$react$vdom$Builder$$style$f = {};
  this.children$1 = [];
  return this
});
$c_Ljapgolly_scalajs_react_vdom_Builder.prototype.render__T__Ljapgolly_scalajs_react_ReactElement = (function(tag) {
  var $$this = this.className$1;
  if (($$this !== (void 0))) {
    var o = this.japgolly$scalajs$react$vdom$Builder$$props$f;
    o["className"] = $$this
  };
  if (($uI($g["Object"]["keys"](this.japgolly$scalajs$react$vdom$Builder$$style$f)["length"]) !== 0)) {
    var o$1 = this.japgolly$scalajs$react$vdom$Builder$$props$f;
    var v = this.japgolly$scalajs$react$vdom$Builder$$style$f;
    o$1["style"] = v
  };
  var jsx$1 = $g["React"];
  var jsx$4 = jsx$1["createElement"];
  var jsx$3 = this.japgolly$scalajs$react$vdom$Builder$$props$f;
  var array = this.children$1;
  var jsx$2 = [tag, jsx$3]["concat"](array);
  return jsx$4["apply"](jsx$1, jsx$2)
});
$c_Ljapgolly_scalajs_react_vdom_Builder.prototype.appendChild__Ljapgolly_scalajs_react_ReactNode__V = (function(c) {
  this.children$1["push"](c)
});
var $d_Ljapgolly_scalajs_react_vdom_Builder = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Builder: 0
}, false, "japgolly.scalajs.react.vdom.Builder", {
  Ljapgolly_scalajs_react_vdom_Builder: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_Builder.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Builder;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Escaping$() {
  $c_O.call(this);
  this.tagRegex$1 = null;
  this.attrNameRegex$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_Escaping$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_Escaping$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Escaping$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Escaping$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Escaping$.prototype = $c_Ljapgolly_scalajs_react_vdom_Escaping$.prototype;
$c_Ljapgolly_scalajs_react_vdom_Escaping$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_vdom_Escaping$ = this;
  var this$2 = new $c_sci_StringOps().init___T("^[a-z][\\w0-9-]*$");
  var groupNames = $m_sci_Nil$();
  this.tagRegex$1 = new $c_s_util_matching_Regex().init___T__sc_Seq(this$2.repr$1, groupNames).pattern$1;
  var this$5 = new $c_sci_StringOps().init___T("^[a-zA-Z_:][-a-zA-Z0-9_:.]*$");
  var groupNames$1 = $m_sci_Nil$();
  this.attrNameRegex$1 = new $c_s_util_matching_Regex().init___T__sc_Seq(this$5.repr$1, groupNames$1).pattern$1;
  return this
});
$c_Ljapgolly_scalajs_react_vdom_Escaping$.prototype.assertValidTag__T__V = (function(s) {
  if ((!this.validTag__T__Z(s))) {
    throw new $c_jl_IllegalArgumentException().init___T(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Illegal tag name: ", " is not a valid XML tag name"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([s])))
  }
});
$c_Ljapgolly_scalajs_react_vdom_Escaping$.prototype.validTag__T__Z = (function(s) {
  var this$1 = this.tagRegex$1;
  return new $c_ju_regex_Matcher().init___ju_regex_Pattern__jl_CharSequence__I__I(this$1, s, 0, $uI(s["length"])).matches__Z()
});
var $d_Ljapgolly_scalajs_react_vdom_Escaping$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Escaping$: 0
}, false, "japgolly.scalajs.react.vdom.Escaping$", {
  Ljapgolly_scalajs_react_vdom_Escaping$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_Escaping$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Escaping$;
var $n_Ljapgolly_scalajs_react_vdom_Escaping$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_Escaping$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_Escaping$)) {
    $n_Ljapgolly_scalajs_react_vdom_Escaping$ = new $c_Ljapgolly_scalajs_react_vdom_Escaping$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_Escaping$
}
function $s_Ljapgolly_scalajs_react_vdom_Extra$Tags$class__$$init$__Ljapgolly_scalajs_react_vdom_Extra$Tags__V($$this) {
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("big");
  $$this.big$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("big", $m_sci_Nil$(), namespaceConfig);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$1 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("dialog");
  $$this.dialog$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("dialog", $m_sci_Nil$(), namespaceConfig$1);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$2 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("menuitem");
  $$this.menuitem$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("menuitem", $m_sci_Nil$(), namespaceConfig$2)
}
function $s_Ljapgolly_scalajs_react_vdom_HtmlTags$class__$$init$__Ljapgolly_scalajs_react_vdom_HtmlTags__V($$this) {
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("html");
  $$this.html$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("html", $m_sci_Nil$(), namespaceConfig);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$1 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("head");
  $$this.head$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("head", $m_sci_Nil$(), namespaceConfig$1);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$2 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("base");
  $$this.base$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("base", $m_sci_Nil$(), namespaceConfig$2);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$3 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("link");
  $$this.link$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("link", $m_sci_Nil$(), namespaceConfig$3);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$4 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("meta");
  $$this.meta$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("meta", $m_sci_Nil$(), namespaceConfig$4);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$5 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("script");
  $$this.script$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("script", $m_sci_Nil$(), namespaceConfig$5);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$6 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("body");
  $$this.body$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("body", $m_sci_Nil$(), namespaceConfig$6);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$7 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("h1");
  $$this.h1$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("h1", $m_sci_Nil$(), namespaceConfig$7);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$8 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("h2");
  $$this.h2$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("h2", $m_sci_Nil$(), namespaceConfig$8);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$9 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("h3");
  $$this.h3$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("h3", $m_sci_Nil$(), namespaceConfig$9);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$10 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("h4");
  $$this.h4$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("h4", $m_sci_Nil$(), namespaceConfig$10);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$11 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("h5");
  $$this.h5$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("h5", $m_sci_Nil$(), namespaceConfig$11);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$12 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("h6");
  $$this.h6$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("h6", $m_sci_Nil$(), namespaceConfig$12);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$13 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("header");
  $$this.header$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("header", $m_sci_Nil$(), namespaceConfig$13);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$14 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("footer");
  $$this.footer$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("footer", $m_sci_Nil$(), namespaceConfig$14);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$15 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("p");
  $$this.p$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("p", $m_sci_Nil$(), namespaceConfig$15);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$16 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("hr");
  $$this.hr$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("hr", $m_sci_Nil$(), namespaceConfig$16);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$17 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("pre");
  $$this.pre$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("pre", $m_sci_Nil$(), namespaceConfig$17);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$18 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("blockquote");
  $$this.blockquote$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("blockquote", $m_sci_Nil$(), namespaceConfig$18);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$19 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("ol");
  $$this.ol$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("ol", $m_sci_Nil$(), namespaceConfig$19);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$20 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("ul");
  $$this.ul$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("ul", $m_sci_Nil$(), namespaceConfig$20);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$21 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("li");
  $$this.li$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("li", $m_sci_Nil$(), namespaceConfig$21);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$22 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("dl");
  $$this.dl$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("dl", $m_sci_Nil$(), namespaceConfig$22);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$23 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("dt");
  $$this.dt$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("dt", $m_sci_Nil$(), namespaceConfig$23);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$24 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("dd");
  $$this.dd$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("dd", $m_sci_Nil$(), namespaceConfig$24);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$25 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("figure");
  $$this.figure$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("figure", $m_sci_Nil$(), namespaceConfig$25);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$26 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("figcaption");
  $$this.figcaption$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("figcaption", $m_sci_Nil$(), namespaceConfig$26);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$27 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("div");
  $$this.div$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("div", $m_sci_Nil$(), namespaceConfig$27);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$28 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("a");
  $$this.a$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("a", $m_sci_Nil$(), namespaceConfig$28);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$29 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("em");
  $$this.em$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("em", $m_sci_Nil$(), namespaceConfig$29);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$30 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("strong");
  $$this.strong$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("strong", $m_sci_Nil$(), namespaceConfig$30);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$31 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("small");
  $$this.small$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("small", $m_sci_Nil$(), namespaceConfig$31);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$32 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("s");
  $$this.s$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("s", $m_sci_Nil$(), namespaceConfig$32);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$33 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("cite");
  $$this.cite$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("cite", $m_sci_Nil$(), namespaceConfig$33);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$34 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("code");
  $$this.code$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("code", $m_sci_Nil$(), namespaceConfig$34);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$35 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("sub");
  $$this.sub$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("sub", $m_sci_Nil$(), namespaceConfig$35);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$36 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("sup");
  $$this.sup$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("sup", $m_sci_Nil$(), namespaceConfig$36);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$37 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("i");
  $$this.i$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("i", $m_sci_Nil$(), namespaceConfig$37);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$38 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("b");
  $$this.b$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("b", $m_sci_Nil$(), namespaceConfig$38);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$39 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("u");
  $$this.u$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("u", $m_sci_Nil$(), namespaceConfig$39);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$40 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("span");
  $$this.span$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("span", $m_sci_Nil$(), namespaceConfig$40);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$41 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("br");
  $$this.br$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("br", $m_sci_Nil$(), namespaceConfig$41);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$42 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("wbr");
  $$this.wbr$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("wbr", $m_sci_Nil$(), namespaceConfig$42);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$43 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("ins");
  $$this.ins$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("ins", $m_sci_Nil$(), namespaceConfig$43);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$44 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("del");
  $$this.del$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("del", $m_sci_Nil$(), namespaceConfig$44);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$45 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("img");
  $$this.img$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("img", $m_sci_Nil$(), namespaceConfig$45);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$46 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("iframe");
  $$this.iframe$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("iframe", $m_sci_Nil$(), namespaceConfig$46);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$47 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("embed");
  $$this.embed$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("embed", $m_sci_Nil$(), namespaceConfig$47);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$48 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("object");
  $$this.object$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("object", $m_sci_Nil$(), namespaceConfig$48);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$49 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("param");
  $$this.param$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("param", $m_sci_Nil$(), namespaceConfig$49);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$50 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("video");
  $$this.video$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("video", $m_sci_Nil$(), namespaceConfig$50);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$51 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("audio");
  $$this.audio$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("audio", $m_sci_Nil$(), namespaceConfig$51);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$52 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("source");
  $$this.source$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("source", $m_sci_Nil$(), namespaceConfig$52);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$53 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("track");
  $$this.track$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("track", $m_sci_Nil$(), namespaceConfig$53);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$54 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("canvas");
  $$this.canvas$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("canvas", $m_sci_Nil$(), namespaceConfig$54);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$55 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("map");
  $$this.map$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("map", $m_sci_Nil$(), namespaceConfig$55);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$56 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("area");
  $$this.area$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("area", $m_sci_Nil$(), namespaceConfig$56);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$57 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("table");
  $$this.table$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("table", $m_sci_Nil$(), namespaceConfig$57);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$58 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("caption");
  $$this.caption$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("caption", $m_sci_Nil$(), namespaceConfig$58);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$59 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("colgroup");
  $$this.colgroup$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("colgroup", $m_sci_Nil$(), namespaceConfig$59);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$60 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("col");
  $$this.col$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("col", $m_sci_Nil$(), namespaceConfig$60);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$61 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("tbody");
  $$this.tbody$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("tbody", $m_sci_Nil$(), namespaceConfig$61);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$62 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("thead");
  $$this.thead$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("thead", $m_sci_Nil$(), namespaceConfig$62);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$63 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("tfoot");
  $$this.tfoot$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("tfoot", $m_sci_Nil$(), namespaceConfig$63);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$64 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("tr");
  $$this.tr$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("tr", $m_sci_Nil$(), namespaceConfig$64);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$65 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("td");
  $$this.td$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("td", $m_sci_Nil$(), namespaceConfig$65);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$66 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("th");
  $$this.th$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("th", $m_sci_Nil$(), namespaceConfig$66);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$67 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("form");
  $$this.form$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("form", $m_sci_Nil$(), namespaceConfig$67);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$68 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("fieldset");
  $$this.fieldset$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("fieldset", $m_sci_Nil$(), namespaceConfig$68);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$69 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("legend");
  $$this.legend$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("legend", $m_sci_Nil$(), namespaceConfig$69);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$70 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("label");
  $$this.label$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("label", $m_sci_Nil$(), namespaceConfig$70);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$71 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("input");
  $$this.input$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("input", $m_sci_Nil$(), namespaceConfig$71);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$72 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("button");
  $$this.button$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("button", $m_sci_Nil$(), namespaceConfig$72);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$73 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("select");
  $$this.select$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("select", $m_sci_Nil$(), namespaceConfig$73);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$74 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("datalist");
  $$this.datalist$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("datalist", $m_sci_Nil$(), namespaceConfig$74);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$75 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("optgroup");
  $$this.optgroup$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("optgroup", $m_sci_Nil$(), namespaceConfig$75);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$76 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("option");
  $$this.option$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("option", $m_sci_Nil$(), namespaceConfig$76);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$77 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("textarea");
  $$this.textarea$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("textarea", $m_sci_Nil$(), namespaceConfig$77);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$78 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("title");
  $$this.titleTag$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("title", $m_sci_Nil$(), namespaceConfig$78);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$79 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("style");
  $$this.styleTag$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("style", $m_sci_Nil$(), namespaceConfig$79);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$80 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("noscript");
  $$this.noscript$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("noscript", $m_sci_Nil$(), namespaceConfig$80);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$81 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("section");
  $$this.section$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("section", $m_sci_Nil$(), namespaceConfig$81);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$82 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("nav");
  $$this.nav$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("nav", $m_sci_Nil$(), namespaceConfig$82);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$83 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("article");
  $$this.article$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("article", $m_sci_Nil$(), namespaceConfig$83);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$84 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("aside");
  $$this.aside$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("aside", $m_sci_Nil$(), namespaceConfig$84);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$85 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("address");
  $$this.address$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("address", $m_sci_Nil$(), namespaceConfig$85);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$86 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("main");
  $$this.main$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("main", $m_sci_Nil$(), namespaceConfig$86);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$87 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("q");
  $$this.q$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("q", $m_sci_Nil$(), namespaceConfig$87);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$88 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("dfn");
  $$this.dfn$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("dfn", $m_sci_Nil$(), namespaceConfig$88);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$89 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("abbr");
  $$this.abbr$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("abbr", $m_sci_Nil$(), namespaceConfig$89);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$90 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("data");
  $$this.data$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("data", $m_sci_Nil$(), namespaceConfig$90);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$91 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("time");
  $$this.time$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("time", $m_sci_Nil$(), namespaceConfig$91);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$92 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("var");
  $$this.var$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("var", $m_sci_Nil$(), namespaceConfig$92);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$93 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("samp");
  $$this.samp$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("samp", $m_sci_Nil$(), namespaceConfig$93);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$94 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("kbd");
  $$this.kbd$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("kbd", $m_sci_Nil$(), namespaceConfig$94);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$95 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("math");
  $$this.math$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("math", $m_sci_Nil$(), namespaceConfig$95);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$96 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("mark");
  $$this.mark$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("mark", $m_sci_Nil$(), namespaceConfig$96);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$97 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("ruby");
  $$this.ruby$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("ruby", $m_sci_Nil$(), namespaceConfig$97);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$98 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("rt");
  $$this.rt$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("rt", $m_sci_Nil$(), namespaceConfig$98);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$99 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("rp");
  $$this.rp$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("rp", $m_sci_Nil$(), namespaceConfig$99);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$100 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("bdi");
  $$this.bdi$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("bdi", $m_sci_Nil$(), namespaceConfig$100);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$101 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("bdo");
  $$this.bdo$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("bdo", $m_sci_Nil$(), namespaceConfig$101);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$102 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("keygen");
  $$this.keygen$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("keygen", $m_sci_Nil$(), namespaceConfig$102);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$103 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("output");
  $$this.output$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("output", $m_sci_Nil$(), namespaceConfig$103);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$104 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("progress");
  $$this.progress$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("progress", $m_sci_Nil$(), namespaceConfig$104);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$105 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("meter");
  $$this.meter$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("meter", $m_sci_Nil$(), namespaceConfig$105);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$106 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("details");
  $$this.details$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("details", $m_sci_Nil$(), namespaceConfig$106);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$107 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("summary");
  $$this.summary$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("summary", $m_sci_Nil$(), namespaceConfig$107);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$108 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("command");
  $$this.command$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("command", $m_sci_Nil$(), namespaceConfig$108);
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  var namespaceConfig$109 = $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().implicitNamespace$1;
  $m_Ljapgolly_scalajs_react_vdom_Scalatags$();
  $m_Ljapgolly_scalajs_react_vdom_Escaping$().assertValidTag__T__V("menu");
  $$this.menu$1 = new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace("menu", $m_sci_Nil$(), namespaceConfig$109)
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_LowPri() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_LowPri.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_LowPri.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_LowPri;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_LowPri() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_LowPri.prototype = $c_Ljapgolly_scalajs_react_vdom_LowPri.prototype;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Scalatags$() {
  $c_O.call(this);
  this.stringAttrX$1 = null;
  this.stringStyleX$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_Scalatags$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_Scalatags$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Scalatags$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Scalatags$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Scalatags$.prototype = $c_Ljapgolly_scalajs_react_vdom_Scalatags$.prototype;
$c_Ljapgolly_scalajs_react_vdom_Scalatags$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_vdom_Scalatags$ = this;
  var evidence$2 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(v$2) {
    var v = $as_T(v$2);
    return v
  }));
  this.stringAttrX$1 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(evidence$2$1) {
    return (function(a$2) {
      return evidence$2$1.apply__O__O(a$2)
    })
  })(evidence$2)));
  this.stringStyleX$1 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$9$2) {
    return $objectToString(x$9$2)
  })));
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_Scalatags$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Scalatags$: 0
}, false, "japgolly.scalajs.react.vdom.Scalatags$", {
  Ljapgolly_scalajs_react_vdom_Scalatags$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_Scalatags$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Scalatags$;
var $n_Ljapgolly_scalajs_react_vdom_Scalatags$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_Scalatags$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_Scalatags$)) {
    $n_Ljapgolly_scalajs_react_vdom_Scalatags$ = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_Scalatags$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$() {
  $c_O.call(this);
  this.implicitNamespace$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$.prototype = $c_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$.prototype;
$c_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$ = this;
  this.implicitNamespace$1 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$$anon$1().init___();
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$: 0
}, false, "japgolly.scalajs.react.vdom.Scalatags$NamespaceHtml$", {
  Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$;
var $n_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$)) {
    $n_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$ = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$
}
/** @constructor */
function $c_Lscalajsreact_template_routes_AppRouter$() {
  $c_O.call(this);
  this.config$1 = null;
  this.mainMenu$1 = null;
  this.baseUrl$1 = null;
  this.router$1 = null
}
$c_Lscalajsreact_template_routes_AppRouter$.prototype = new $h_O();
$c_Lscalajsreact_template_routes_AppRouter$.prototype.constructor = $c_Lscalajsreact_template_routes_AppRouter$;
/** @constructor */
function $h_Lscalajsreact_template_routes_AppRouter$() {
  /*<skip>*/
}
$h_Lscalajsreact_template_routes_AppRouter$.prototype = $c_Lscalajsreact_template_routes_AppRouter$.prototype;
$c_Lscalajsreact_template_routes_AppRouter$.prototype.init___ = (function() {
  $n_Lscalajsreact_template_routes_AppRouter$ = this;
  new $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$BuildInterface().init___();
  var f = new $c_Lscalajsreact_template_routes_AppRouter$$anonfun$1().init___();
  var v1 = new $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl().init___();
  this.config$1 = f.apply__Ljapgolly_scalajs_react_extra_router_RouterConfigDsl__Ljapgolly_scalajs_react_extra_router_RouterConfig(v1);
  var this$3 = $m_s_package$().Vector$1;
  var array = [new $c_Lscalajsreact_template_models_Menu().init___T__Lscalajsreact_template_routes_AppRouter$AppPage("Home", $m_Lscalajsreact_template_routes_AppRouter$Home$())];
  if (($uI(array["length"]) === 0)) {
    var jsx$1 = this$3.NIL$6
  } else {
    var b = new $c_sci_VectorBuilder().init___();
    var i = 0;
    var len = $uI(array["length"]);
    while ((i < len)) {
      var index = i;
      var arg1 = array[index];
      b.$$plus$eq__O__sci_VectorBuilder(arg1);
      i = ((1 + i) | 0)
    };
    var jsx$1 = b.result__sci_Vector()
  };
  this.mainMenu$1 = jsx$1;
  var this$4 = $m_Ljapgolly_scalajs_react_extra_router_BaseUrl$().fromWindowOrigin__Ljapgolly_scalajs_react_extra_router_BaseUrl();
  this.baseUrl$1 = $as_Ljapgolly_scalajs_react_extra_router_BaseUrl(this$4.endWith$und$div__Ljapgolly_scalajs_react_extra_router_PathLike().$$plus__T__Ljapgolly_scalajs_react_extra_router_PathLike("hello/"));
  this.router$1 = $m_Ljapgolly_scalajs_react_extra_router_Router$().apply__Ljapgolly_scalajs_react_extra_router_BaseUrl__Ljapgolly_scalajs_react_extra_router_RouterConfig__Ljapgolly_scalajs_react_ReactComponentC$ConstProps(this.baseUrl$1, this.config$1);
  return this
});
var $d_Lscalajsreact_template_routes_AppRouter$ = new $TypeData().initClass({
  Lscalajsreact_template_routes_AppRouter$: 0
}, false, "scalajsreact.template.routes.AppRouter$", {
  Lscalajsreact_template_routes_AppRouter$: 1,
  O: 1
});
$c_Lscalajsreact_template_routes_AppRouter$.prototype.$classData = $d_Lscalajsreact_template_routes_AppRouter$;
var $n_Lscalajsreact_template_routes_AppRouter$ = (void 0);
function $m_Lscalajsreact_template_routes_AppRouter$() {
  if ((!$n_Lscalajsreact_template_routes_AppRouter$)) {
    $n_Lscalajsreact_template_routes_AppRouter$ = new $c_Lscalajsreact_template_routes_AppRouter$().init___()
  };
  return $n_Lscalajsreact_template_routes_AppRouter$
}
/** @constructor */
function $c_jl_Character$() {
  $c_O.call(this);
  this.TYPE$1 = null;
  this.MIN$undVALUE$1 = 0;
  this.MAX$undVALUE$1 = 0;
  this.SIZE$1 = 0;
  this.MIN$undRADIX$1 = 0;
  this.MAX$undRADIX$1 = 0;
  this.MIN$undHIGH$undSURROGATE$1 = 0;
  this.MAX$undHIGH$undSURROGATE$1 = 0;
  this.MIN$undLOW$undSURROGATE$1 = 0;
  this.MAX$undLOW$undSURROGATE$1 = 0;
  this.MIN$undSURROGATE$1 = 0;
  this.MAX$undSURROGATE$1 = 0;
  this.MIN$undCODE$undPOINT$1 = 0;
  this.MAX$undCODE$undPOINT$1 = 0;
  this.MIN$undSUPPLEMENTARY$undCODE$undPOINT$1 = 0;
  this.HighSurrogateMask$1 = 0;
  this.HighSurrogateID$1 = 0;
  this.LowSurrogateMask$1 = 0;
  this.LowSurrogateID$1 = 0;
  this.SurrogateUsefulPartMask$1 = 0;
  this.java$lang$Character$$charTypesFirst256$1 = null;
  this.charTypeIndices$1 = null;
  this.charTypes$1 = null;
  this.isMirroredIndices$1 = null;
  this.bitmap$0$1 = 0
}
$c_jl_Character$.prototype = new $h_O();
$c_jl_Character$.prototype.constructor = $c_jl_Character$;
/** @constructor */
function $h_jl_Character$() {
  /*<skip>*/
}
$h_jl_Character$.prototype = $c_jl_Character$.prototype;
$c_jl_Character$.prototype.digit__C__I__I = (function(c, radix) {
  return (((radix > 36) || (radix < 2)) ? (-1) : ((((c >= 48) && (c <= 57)) && ((((-48) + c) | 0) < radix)) ? (((-48) + c) | 0) : ((((c >= 65) && (c <= 90)) && ((((-65) + c) | 0) < (((-10) + radix) | 0))) ? (((-55) + c) | 0) : ((((c >= 97) && (c <= 122)) && ((((-97) + c) | 0) < (((-10) + radix) | 0))) ? (((-87) + c) | 0) : ((((c >= 65313) && (c <= 65338)) && ((((-65313) + c) | 0) < (((-10) + radix) | 0))) ? (((-65303) + c) | 0) : ((((c >= 65345) && (c <= 65370)) && ((((-65345) + c) | 0) < (((-10) + radix) | 0))) ? (((-65303) + c) | 0) : (-1)))))))
});
var $d_jl_Character$ = new $TypeData().initClass({
  jl_Character$: 0
}, false, "java.lang.Character$", {
  jl_Character$: 1,
  O: 1
});
$c_jl_Character$.prototype.$classData = $d_jl_Character$;
var $n_jl_Character$ = (void 0);
function $m_jl_Character$() {
  if ((!$n_jl_Character$)) {
    $n_jl_Character$ = new $c_jl_Character$().init___()
  };
  return $n_jl_Character$
}
/** @constructor */
function $c_jl_Class() {
  $c_O.call(this);
  this.data$1 = null
}
$c_jl_Class.prototype = new $h_O();
$c_jl_Class.prototype.constructor = $c_jl_Class;
/** @constructor */
function $h_jl_Class() {
  /*<skip>*/
}
$h_jl_Class.prototype = $c_jl_Class.prototype;
$c_jl_Class.prototype.getName__T = (function() {
  return $as_T(this.data$1["name"])
});
$c_jl_Class.prototype.isPrimitive__Z = (function() {
  return $uZ(this.data$1["isPrimitive"])
});
$c_jl_Class.prototype.toString__T = (function() {
  return ((this.isInterface__Z() ? "interface " : (this.isPrimitive__Z() ? "" : "class ")) + this.getName__T())
});
$c_jl_Class.prototype.isAssignableFrom__jl_Class__Z = (function(that) {
  return ((this.isPrimitive__Z() || that.isPrimitive__Z()) ? ((this === that) || ((this === $d_S.getClassOf()) ? (that === $d_B.getClassOf()) : ((this === $d_I.getClassOf()) ? ((that === $d_B.getClassOf()) || (that === $d_S.getClassOf())) : ((this === $d_F.getClassOf()) ? (((that === $d_B.getClassOf()) || (that === $d_S.getClassOf())) || (that === $d_I.getClassOf())) : ((this === $d_D.getClassOf()) && ((((that === $d_B.getClassOf()) || (that === $d_S.getClassOf())) || (that === $d_I.getClassOf())) || (that === $d_F.getClassOf()))))))) : this.isInstance__O__Z(that.getFakeInstance__p1__O()))
});
$c_jl_Class.prototype.isInstance__O__Z = (function(obj) {
  return $uZ(this.data$1["isInstance"](obj))
});
$c_jl_Class.prototype.init___jl_ScalaJSClassData = (function(data) {
  this.data$1 = data;
  return this
});
$c_jl_Class.prototype.getFakeInstance__p1__O = (function() {
  return this.data$1["getFakeInstance"]()
});
$c_jl_Class.prototype.isArray__Z = (function() {
  return $uZ(this.data$1["isArrayClass"])
});
$c_jl_Class.prototype.isInterface__Z = (function() {
  return $uZ(this.data$1["isInterface"])
});
var $d_jl_Class = new $TypeData().initClass({
  jl_Class: 0
}, false, "java.lang.Class", {
  jl_Class: 1,
  O: 1
});
$c_jl_Class.prototype.$classData = $d_jl_Class;
/** @constructor */
function $c_jl_Double$() {
  $c_O.call(this);
  this.TYPE$1 = null;
  this.POSITIVE$undINFINITY$1 = 0.0;
  this.NEGATIVE$undINFINITY$1 = 0.0;
  this.NaN$1 = 0.0;
  this.MAX$undVALUE$1 = 0.0;
  this.MIN$undVALUE$1 = 0.0;
  this.MAX$undEXPONENT$1 = 0;
  this.MIN$undEXPONENT$1 = 0;
  this.SIZE$1 = 0;
  this.doubleStrPat$1 = null;
  this.bitmap$0$1 = false
}
$c_jl_Double$.prototype = new $h_O();
$c_jl_Double$.prototype.constructor = $c_jl_Double$;
/** @constructor */
function $h_jl_Double$() {
  /*<skip>*/
}
$h_jl_Double$.prototype = $c_jl_Double$.prototype;
$c_jl_Double$.prototype.compare__D__D__I = (function(a, b) {
  if ((a !== a)) {
    return ((b !== b) ? 0 : 1)
  } else if ((b !== b)) {
    return (-1)
  } else if ((a === b)) {
    if ((a === 0.0)) {
      var ainf = (1.0 / a);
      return ((ainf === (1.0 / b)) ? 0 : ((ainf < 0) ? (-1) : 1))
    } else {
      return 0
    }
  } else {
    return ((a < b) ? (-1) : 1)
  }
});
var $d_jl_Double$ = new $TypeData().initClass({
  jl_Double$: 0
}, false, "java.lang.Double$", {
  jl_Double$: 1,
  O: 1
});
$c_jl_Double$.prototype.$classData = $d_jl_Double$;
var $n_jl_Double$ = (void 0);
function $m_jl_Double$() {
  if ((!$n_jl_Double$)) {
    $n_jl_Double$ = new $c_jl_Double$().init___()
  };
  return $n_jl_Double$
}
/** @constructor */
function $c_jl_Integer$() {
  $c_O.call(this);
  this.TYPE$1 = null;
  this.MIN$undVALUE$1 = 0;
  this.MAX$undVALUE$1 = 0;
  this.SIZE$1 = 0;
  this.BYTES$1 = 0
}
$c_jl_Integer$.prototype = new $h_O();
$c_jl_Integer$.prototype.constructor = $c_jl_Integer$;
/** @constructor */
function $h_jl_Integer$() {
  /*<skip>*/
}
$h_jl_Integer$.prototype = $c_jl_Integer$.prototype;
$c_jl_Integer$.prototype.fail$1__p1__T__sr_Nothing$ = (function(s$1) {
  throw new $c_jl_NumberFormatException().init___T(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["For input string: \"", "\""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([s$1])))
});
$c_jl_Integer$.prototype.parseInt__T__I__I = (function(s, radix) {
  if ((s === null)) {
    var jsx$1 = true
  } else {
    var this$2 = new $c_sci_StringOps().init___T(s);
    var $$this = this$2.repr$1;
    var jsx$1 = ($uI($$this["length"]) === 0)
  };
  if (((jsx$1 || (radix < 2)) || (radix > 36))) {
    this.fail$1__p1__T__sr_Nothing$(s)
  } else {
    var i = ((((65535 & $uI(s["charCodeAt"](0))) === 45) || ((65535 & $uI(s["charCodeAt"](0))) === 43)) ? 1 : 0);
    var this$12 = new $c_sci_StringOps().init___T(s);
    var $$this$1 = this$12.repr$1;
    if (($uI($$this$1["length"]) <= i)) {
      this.fail$1__p1__T__sr_Nothing$(s)
    } else {
      while (true) {
        var jsx$2 = i;
        var this$16 = new $c_sci_StringOps().init___T(s);
        var $$this$2 = this$16.repr$1;
        if ((jsx$2 < $uI($$this$2["length"]))) {
          var jsx$3 = $m_jl_Character$();
          var index = i;
          if ((jsx$3.digit__C__I__I((65535 & $uI(s["charCodeAt"](index))), radix) < 0)) {
            this.fail$1__p1__T__sr_Nothing$(s)
          };
          i = ((1 + i) | 0)
        } else {
          break
        }
      };
      var res = $uD($g["parseInt"](s, radix));
      return (((res !== res) || ((res > 2147483647) || (res < (-2147483648)))) ? this.fail$1__p1__T__sr_Nothing$(s) : $doubleToInt(res))
    }
  }
});
$c_jl_Integer$.prototype.rotateLeft__I__I__I = (function(i, distance) {
  return ((i << distance) | ((i >>> ((-distance) | 0)) | 0))
});
$c_jl_Integer$.prototype.bitCount__I__I = (function(i) {
  var t1 = ((i - (1431655765 & (i >> 1))) | 0);
  var t2 = (((858993459 & t1) + (858993459 & (t1 >> 2))) | 0);
  return ($imul(16843009, (252645135 & ((t2 + (t2 >> 4)) | 0))) >> 24)
});
$c_jl_Integer$.prototype.reverseBytes__I__I = (function(i) {
  var byte3 = ((i >>> 24) | 0);
  var byte2 = (65280 & ((i >>> 8) | 0));
  var byte1 = (16711680 & (i << 8));
  var byte0 = (i << 24);
  return (((byte0 | byte1) | byte2) | byte3)
});
$c_jl_Integer$.prototype.numberOfLeadingZeros__I__I = (function(i) {
  var x = i;
  x = (x | ((x >>> 1) | 0));
  x = (x | ((x >>> 2) | 0));
  x = (x | ((x >>> 4) | 0));
  x = (x | ((x >>> 8) | 0));
  x = (x | ((x >>> 16) | 0));
  return ((32 - this.bitCount__I__I(x)) | 0)
});
$c_jl_Integer$.prototype.numberOfTrailingZeros__I__I = (function(i) {
  return this.bitCount__I__I((((-1) + (i & ((-i) | 0))) | 0))
});
var $d_jl_Integer$ = new $TypeData().initClass({
  jl_Integer$: 0
}, false, "java.lang.Integer$", {
  jl_Integer$: 1,
  O: 1
});
$c_jl_Integer$.prototype.$classData = $d_jl_Integer$;
var $n_jl_Integer$ = (void 0);
function $m_jl_Integer$() {
  if ((!$n_jl_Integer$)) {
    $n_jl_Integer$ = new $c_jl_Integer$().init___()
  };
  return $n_jl_Integer$
}
/** @constructor */
function $c_jl_Long$() {
  $c_O.call(this);
  this.TYPE$1 = null;
  this.MIN$undVALUE$1 = $m_sjsr_RuntimeLong$().Zero__sjsr_RuntimeLong();
  this.MAX$undVALUE$1 = $m_sjsr_RuntimeLong$().Zero__sjsr_RuntimeLong();
  this.SIZE$1 = 0;
  this.DigitFitInInt$1 = null;
  this.bitmap$0$1 = false
}
$c_jl_Long$.prototype = new $h_O();
$c_jl_Long$.prototype.constructor = $c_jl_Long$;
/** @constructor */
function $h_jl_Long$() {
  /*<skip>*/
}
$h_jl_Long$.prototype = $c_jl_Long$.prototype;
$c_jl_Long$.prototype.parseLong__T__I__J = (function(s, radix) {
  if ((s === null)) {
    var jsx$1;
    throw new $c_jl_NullPointerException().init___()
  } else {
    var jsx$1 = s
  };
  if ((((jsx$1 === "") || (radix < 2)) || (radix > 36))) {
    this.fail$1__p1__T__sr_Nothing$(s)
  } else if (((65535 & $uI(s["charCodeAt"](0))) === 45)) {
    return this.parseLong__T__I__J($as_T(s["substring"](1)), radix).unary$und$minus__sjsr_RuntimeLong()
  } else {
    var MaxLen = this.DigitFitInInt__p1__AI().u[radix];
    try {
      var str0 = s;
      var acc = $m_sjsr_RuntimeLong$().Zero__sjsr_RuntimeLong();
      _loop: while (true) {
        var thiz = str0;
        if (($uI(thiz["length"]) > 0)) {
          var x = str0;
          var jsx$2 = x["substring"](0, MaxLen);
          var cur = $as_T(jsx$2);
          var jsx$4 = acc;
          var base = radix;
          var exp = $uI(cur["length"]);
          var acc$1 = 1;
          x$1: {
            var jsx$3;
            _fastPow: while (true) {
              if ((exp === 0)) {
                var jsx$3 = acc$1;
                break x$1
              } else if (((exp % 2) === 0)) {
                var temp$base = $imul(base, base);
                var temp$exp = ((exp / 2) | 0);
                base = temp$base;
                exp = temp$exp;
                continue _fastPow
              } else {
                var temp$exp$2 = (((-1) + exp) | 0);
                var temp$acc = $imul(acc$1, base);
                exp = temp$exp$2;
                acc$1 = temp$acc;
                continue _fastPow
              }
            }
          };
          var macc = jsx$4.$$times__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(jsx$3));
          var x$1 = $m_jl_Integer$().parseInt__T__I__I(cur, radix);
          var cval = new $c_sjsr_RuntimeLong().init___I(x$1);
          var x$2 = str0;
          var jsx$5 = x$2["substring"](MaxLen);
          var temp$str0 = $as_T(jsx$5);
          var temp$acc$1 = macc.$$plus__sjsr_RuntimeLong__sjsr_RuntimeLong(cval);
          str0 = temp$str0;
          acc = temp$acc$1;
          continue _loop
        } else {
          return acc
        }
      }
    } catch (e) {
      if ($is_jl_NumberFormatException(e)) {
        this.fail$1__p1__T__sr_Nothing$(s)
      } else {
        throw e
      }
    }
  }
});
$c_jl_Long$.prototype.fail$1__p1__T__sr_Nothing$ = (function(s$1) {
  throw new $c_jl_NumberFormatException().init___T(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["For input string: \"", "\""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([s$1])))
});
$c_jl_Long$.prototype.DigitFitInInt$lzycompute__p1__AI = (function() {
  if ((!this.bitmap$0$1)) {
    this.DigitFitInInt$1 = $m_s_Array$().apply__I__sc_Seq__AI((-1), new $c_sjs_js_WrappedArray().init___sjs_js_Array([(-1), 30, 19, 15, 13, 11, 11, 10, 9, 9, 8, 8, 8, 8, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5]));
    this.bitmap$0$1 = true
  };
  return this.DigitFitInInt$1
});
$c_jl_Long$.prototype.DigitFitInInt__p1__AI = (function() {
  return ((!this.bitmap$0$1) ? this.DigitFitInInt$lzycompute__p1__AI() : this.DigitFitInInt$1)
});
var $d_jl_Long$ = new $TypeData().initClass({
  jl_Long$: 0
}, false, "java.lang.Long$", {
  jl_Long$: 1,
  O: 1
});
$c_jl_Long$.prototype.$classData = $d_jl_Long$;
var $n_jl_Long$ = (void 0);
function $m_jl_Long$() {
  if ((!$n_jl_Long$)) {
    $n_jl_Long$ = new $c_jl_Long$().init___()
  };
  return $n_jl_Long$
}
/** @constructor */
function $c_jl_Number() {
  $c_O.call(this)
}
$c_jl_Number.prototype = new $h_O();
$c_jl_Number.prototype.constructor = $c_jl_Number;
/** @constructor */
function $h_jl_Number() {
  /*<skip>*/
}
$h_jl_Number.prototype = $c_jl_Number.prototype;
function $is_jl_Number(obj) {
  return (!(!(((obj && obj.$classData) && obj.$classData.ancestors.jl_Number) || ((typeof obj) === "number"))))
}
function $as_jl_Number(obj) {
  return (($is_jl_Number(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.Number"))
}
function $isArrayOf_jl_Number(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Number)))
}
function $asArrayOf_jl_Number(obj, depth) {
  return (($isArrayOf_jl_Number(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Number;", depth))
}
/** @constructor */
function $c_jl_System$() {
  $c_O.call(this);
  this.out$1 = null;
  this.err$1 = null;
  this.in$1 = null;
  this.getHighPrecisionTime$1 = null
}
$c_jl_System$.prototype = new $h_O();
$c_jl_System$.prototype.constructor = $c_jl_System$;
/** @constructor */
function $h_jl_System$() {
  /*<skip>*/
}
$h_jl_System$.prototype = $c_jl_System$.prototype;
$c_jl_System$.prototype.init___ = (function() {
  $n_jl_System$ = this;
  this.out$1 = new $c_jl_JSConsoleBasedPrintStream().init___jl_Boolean(false);
  this.err$1 = new $c_jl_JSConsoleBasedPrintStream().init___jl_Boolean(true);
  this.in$1 = null;
  var x = $g["performance"];
  if ($uZ((!(!x)))) {
    var x$1 = $g["performance"]["now"];
    if ($uZ((!(!x$1)))) {
      var jsx$1 = (function() {
        return $uD($g["performance"]["now"]())
      })
    } else {
      var x$2 = $g["performance"]["webkitNow"];
      if ($uZ((!(!x$2)))) {
        var jsx$1 = (function() {
          return $uD($g["performance"]["webkitNow"]())
        })
      } else {
        var jsx$1 = (function() {
          return $uD(new $g["Date"]()["getTime"]())
        })
      }
    }
  } else {
    var jsx$1 = (function() {
      return $uD(new $g["Date"]()["getTime"]())
    })
  };
  this.getHighPrecisionTime$1 = jsx$1;
  return this
});
var $d_jl_System$ = new $TypeData().initClass({
  jl_System$: 0
}, false, "java.lang.System$", {
  jl_System$: 1,
  O: 1
});
$c_jl_System$.prototype.$classData = $d_jl_System$;
var $n_jl_System$ = (void 0);
function $m_jl_System$() {
  if ((!$n_jl_System$)) {
    $n_jl_System$ = new $c_jl_System$().init___()
  };
  return $n_jl_System$
}
/** @constructor */
function $c_jl_ThreadLocal() {
  $c_O.call(this);
  this.hasValue$1 = null;
  this.v$1 = null
}
$c_jl_ThreadLocal.prototype = new $h_O();
$c_jl_ThreadLocal.prototype.constructor = $c_jl_ThreadLocal;
/** @constructor */
function $h_jl_ThreadLocal() {
  /*<skip>*/
}
$h_jl_ThreadLocal.prototype = $c_jl_ThreadLocal.prototype;
$c_jl_ThreadLocal.prototype.init___ = (function() {
  this.hasValue$1 = false;
  return this
});
$c_jl_ThreadLocal.prototype.get__O = (function() {
  var x = this.hasValue$1;
  if ((!$uZ(x))) {
    this.set__O__V(this.initialValue__O())
  };
  return this.v$1
});
$c_jl_ThreadLocal.prototype.set__O__V = (function(o) {
  this.v$1 = o;
  this.hasValue$1 = true
});
/** @constructor */
function $c_ju_Arrays$() {
  $c_O.call(this);
  this.qSortThreshold$1 = 0
}
$c_ju_Arrays$.prototype = new $h_O();
$c_ju_Arrays$.prototype.constructor = $c_ju_Arrays$;
/** @constructor */
function $h_ju_Arrays$() {
  /*<skip>*/
}
$h_ju_Arrays$.prototype = $c_ju_Arrays$.prototype;
$c_ju_Arrays$.prototype.fill__AI__I__V = (function(a, value) {
  var toIndex = a.u["length"];
  var i = 0;
  while ((i !== toIndex)) {
    a.u[i] = value;
    i = ((1 + i) | 0)
  }
});
var $d_ju_Arrays$ = new $TypeData().initClass({
  ju_Arrays$: 0
}, false, "java.util.Arrays$", {
  ju_Arrays$: 1,
  O: 1
});
$c_ju_Arrays$.prototype.$classData = $d_ju_Arrays$;
var $n_ju_Arrays$ = (void 0);
function $m_ju_Arrays$() {
  if ((!$n_ju_Arrays$)) {
    $n_ju_Arrays$ = new $c_ju_Arrays$().init___()
  };
  return $n_ju_Arrays$
}
/** @constructor */
function $c_s_DeprecatedConsole() {
  $c_O.call(this)
}
$c_s_DeprecatedConsole.prototype = new $h_O();
$c_s_DeprecatedConsole.prototype.constructor = $c_s_DeprecatedConsole;
/** @constructor */
function $h_s_DeprecatedConsole() {
  /*<skip>*/
}
$h_s_DeprecatedConsole.prototype = $c_s_DeprecatedConsole.prototype;
/** @constructor */
function $c_s_FallbackArrayBuilding() {
  $c_O.call(this)
}
$c_s_FallbackArrayBuilding.prototype = new $h_O();
$c_s_FallbackArrayBuilding.prototype.constructor = $c_s_FallbackArrayBuilding;
/** @constructor */
function $h_s_FallbackArrayBuilding() {
  /*<skip>*/
}
$h_s_FallbackArrayBuilding.prototype = $c_s_FallbackArrayBuilding.prototype;
function $s_s_Function1$class__andThen__F1__F1__F1($$this, g) {
  return new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1, g$1) {
    return (function(x$2) {
      return g$1.apply__O__O($$this$1.apply__O__O(x$2))
    })
  })($$this, g))
}
function $s_s_Function1$class__compose__F1__F1__F1($$this, g) {
  return new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1, g$1) {
    return (function(x$2) {
      return $$this$1.apply__O__O(g$1.apply__O__O(x$2))
    })
  })($$this, g))
}
/** @constructor */
function $c_s_LowPriorityImplicits() {
  $c_O.call(this)
}
$c_s_LowPriorityImplicits.prototype = new $h_O();
$c_s_LowPriorityImplicits.prototype.constructor = $c_s_LowPriorityImplicits;
/** @constructor */
function $h_s_LowPriorityImplicits() {
  /*<skip>*/
}
$h_s_LowPriorityImplicits.prototype = $c_s_LowPriorityImplicits.prototype;
/** @constructor */
function $c_s_PartialFunction$() {
  $c_O.call(this);
  this.scala$PartialFunction$$fallback$undpf$f = null;
  this.scala$PartialFunction$$constFalse$f = null;
  this.empty$undpf$1 = null
}
$c_s_PartialFunction$.prototype = new $h_O();
$c_s_PartialFunction$.prototype.constructor = $c_s_PartialFunction$;
/** @constructor */
function $h_s_PartialFunction$() {
  /*<skip>*/
}
$h_s_PartialFunction$.prototype = $c_s_PartialFunction$.prototype;
$c_s_PartialFunction$.prototype.init___ = (function() {
  $n_s_PartialFunction$ = this;
  this.scala$PartialFunction$$fallback$undpf$f = new $c_s_PartialFunction$$anonfun$4().init___();
  this.scala$PartialFunction$$constFalse$f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(x$1$2) {
      return false
    })
  })(this));
  this.empty$undpf$1 = new $c_s_PartialFunction$$anon$1().init___();
  return this
});
$c_s_PartialFunction$.prototype.scala$PartialFunction$$fallbackOccurred__O__Z = (function(x) {
  return (this.scala$PartialFunction$$fallback$undpf$f === x)
});
var $d_s_PartialFunction$ = new $TypeData().initClass({
  s_PartialFunction$: 0
}, false, "scala.PartialFunction$", {
  s_PartialFunction$: 1,
  O: 1
});
$c_s_PartialFunction$.prototype.$classData = $d_s_PartialFunction$;
var $n_s_PartialFunction$ = (void 0);
function $m_s_PartialFunction$() {
  if ((!$n_s_PartialFunction$)) {
    $n_s_PartialFunction$ = new $c_s_PartialFunction$().init___()
  };
  return $n_s_PartialFunction$
}
function $s_s_PartialFunction$class__applyOrElse__s_PartialFunction__O__F1__O($$this, x, $default) {
  return ($$this.isDefinedAt__O__Z(x) ? $$this.apply__O__O(x) : $default.apply__O__O(x))
}
function $s_s_Product2$class__productElement__s_Product2__I__O($$this, n) {
  switch (n) {
    case 0: {
      return $$this.$$und1$f;
      break
    }
    case 1: {
      return $$this.$$und2$f;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
    }
  }
}
function $s_s_Proxy$class__toString__s_Proxy__T($$this) {
  return ("" + $$this.self$1)
}
function $s_s_Proxy$class__equals__s_Proxy__O__Z($$this, that) {
  return ((that !== null) && (((that === $$this) || (that === $$this.self$1)) || $objectEquals(that, $$this.self$1)))
}
/** @constructor */
function $c_s_math_Ordered$() {
  $c_O.call(this)
}
$c_s_math_Ordered$.prototype = new $h_O();
$c_s_math_Ordered$.prototype.constructor = $c_s_math_Ordered$;
/** @constructor */
function $h_s_math_Ordered$() {
  /*<skip>*/
}
$h_s_math_Ordered$.prototype = $c_s_math_Ordered$.prototype;
var $d_s_math_Ordered$ = new $TypeData().initClass({
  s_math_Ordered$: 0
}, false, "scala.math.Ordered$", {
  s_math_Ordered$: 1,
  O: 1
});
$c_s_math_Ordered$.prototype.$classData = $d_s_math_Ordered$;
var $n_s_math_Ordered$ = (void 0);
function $m_s_math_Ordered$() {
  if ((!$n_s_math_Ordered$)) {
    $n_s_math_Ordered$ = new $c_s_math_Ordered$().init___()
  };
  return $n_s_math_Ordered$
}
/** @constructor */
function $c_s_package$() {
  $c_O.call(this);
  this.AnyRef$1 = null;
  this.Traversable$1 = null;
  this.Iterable$1 = null;
  this.Seq$1 = null;
  this.IndexedSeq$1 = null;
  this.Iterator$1 = null;
  this.List$1 = null;
  this.Nil$1 = null;
  this.$$colon$colon$1 = null;
  this.$$plus$colon$1 = null;
  this.$$colon$plus$1 = null;
  this.Stream$1 = null;
  this.$$hash$colon$colon$1 = null;
  this.Vector$1 = null;
  this.StringBuilder$1 = null;
  this.Range$1 = null;
  this.BigDecimal$1 = null;
  this.BigInt$1 = null;
  this.Equiv$1 = null;
  this.Fractional$1 = null;
  this.Integral$1 = null;
  this.Numeric$1 = null;
  this.Ordered$1 = null;
  this.Ordering$1 = null;
  this.Either$1 = null;
  this.Left$1 = null;
  this.Right$1 = null;
  this.bitmap$0$1 = 0
}
$c_s_package$.prototype = new $h_O();
$c_s_package$.prototype.constructor = $c_s_package$;
/** @constructor */
function $h_s_package$() {
  /*<skip>*/
}
$h_s_package$.prototype = $c_s_package$.prototype;
$c_s_package$.prototype.init___ = (function() {
  $n_s_package$ = this;
  this.AnyRef$1 = new $c_s_package$$anon$1().init___();
  this.Traversable$1 = $m_sc_Traversable$();
  this.Iterable$1 = $m_sc_Iterable$();
  this.Seq$1 = $m_sc_Seq$();
  this.IndexedSeq$1 = $m_sc_IndexedSeq$();
  this.Iterator$1 = $m_sc_Iterator$();
  this.List$1 = $m_sci_List$();
  this.Nil$1 = $m_sci_Nil$();
  this.$$colon$colon$1 = $m_sci_$colon$colon$();
  this.$$plus$colon$1 = $m_sc_$plus$colon$();
  this.$$colon$plus$1 = $m_sc_$colon$plus$();
  this.Stream$1 = $m_sci_Stream$();
  this.$$hash$colon$colon$1 = $m_sci_Stream$$hash$colon$colon$();
  this.Vector$1 = $m_sci_Vector$();
  this.StringBuilder$1 = $m_scm_StringBuilder$();
  this.Range$1 = $m_sci_Range$();
  this.Equiv$1 = $m_s_math_Equiv$();
  this.Fractional$1 = $m_s_math_Fractional$();
  this.Integral$1 = $m_s_math_Integral$();
  this.Numeric$1 = $m_s_math_Numeric$();
  this.Ordered$1 = $m_s_math_Ordered$();
  this.Ordering$1 = $m_s_math_Ordering$();
  this.Either$1 = $m_s_util_Either$();
  this.Left$1 = $m_s_util_Left$();
  this.Right$1 = $m_s_util_Right$();
  return this
});
var $d_s_package$ = new $TypeData().initClass({
  s_package$: 0
}, false, "scala.package$", {
  s_package$: 1,
  O: 1
});
$c_s_package$.prototype.$classData = $d_s_package$;
var $n_s_package$ = (void 0);
function $m_s_package$() {
  if ((!$n_s_package$)) {
    $n_s_package$ = new $c_s_package$().init___()
  };
  return $n_s_package$
}
/** @constructor */
function $c_s_reflect_ClassManifestFactory$() {
  $c_O.call(this);
  this.Byte$1 = null;
  this.Short$1 = null;
  this.Char$1 = null;
  this.Int$1 = null;
  this.Long$1 = null;
  this.Float$1 = null;
  this.Double$1 = null;
  this.Boolean$1 = null;
  this.Unit$1 = null;
  this.Any$1 = null;
  this.Object$1 = null;
  this.AnyVal$1 = null;
  this.Nothing$1 = null;
  this.Null$1 = null
}
$c_s_reflect_ClassManifestFactory$.prototype = new $h_O();
$c_s_reflect_ClassManifestFactory$.prototype.constructor = $c_s_reflect_ClassManifestFactory$;
/** @constructor */
function $h_s_reflect_ClassManifestFactory$() {
  /*<skip>*/
}
$h_s_reflect_ClassManifestFactory$.prototype = $c_s_reflect_ClassManifestFactory$.prototype;
$c_s_reflect_ClassManifestFactory$.prototype.init___ = (function() {
  $n_s_reflect_ClassManifestFactory$ = this;
  this.Byte$1 = $m_s_reflect_ManifestFactory$ByteManifest$();
  this.Short$1 = $m_s_reflect_ManifestFactory$ShortManifest$();
  this.Char$1 = $m_s_reflect_ManifestFactory$CharManifest$();
  this.Int$1 = $m_s_reflect_ManifestFactory$IntManifest$();
  this.Long$1 = $m_s_reflect_ManifestFactory$LongManifest$();
  this.Float$1 = $m_s_reflect_ManifestFactory$FloatManifest$();
  this.Double$1 = $m_s_reflect_ManifestFactory$DoubleManifest$();
  this.Boolean$1 = $m_s_reflect_ManifestFactory$BooleanManifest$();
  this.Unit$1 = $m_s_reflect_ManifestFactory$UnitManifest$();
  this.Any$1 = $m_s_reflect_ManifestFactory$AnyManifest$();
  this.Object$1 = $m_s_reflect_ManifestFactory$ObjectManifest$();
  this.AnyVal$1 = $m_s_reflect_ManifestFactory$AnyValManifest$();
  this.Nothing$1 = $m_s_reflect_ManifestFactory$NothingManifest$();
  this.Null$1 = $m_s_reflect_ManifestFactory$NullManifest$();
  return this
});
var $d_s_reflect_ClassManifestFactory$ = new $TypeData().initClass({
  s_reflect_ClassManifestFactory$: 0
}, false, "scala.reflect.ClassManifestFactory$", {
  s_reflect_ClassManifestFactory$: 1,
  O: 1
});
$c_s_reflect_ClassManifestFactory$.prototype.$classData = $d_s_reflect_ClassManifestFactory$;
var $n_s_reflect_ClassManifestFactory$ = (void 0);
function $m_s_reflect_ClassManifestFactory$() {
  if ((!$n_s_reflect_ClassManifestFactory$)) {
    $n_s_reflect_ClassManifestFactory$ = new $c_s_reflect_ClassManifestFactory$().init___()
  };
  return $n_s_reflect_ClassManifestFactory$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$() {
  $c_O.call(this)
}
$c_s_reflect_ManifestFactory$.prototype = new $h_O();
$c_s_reflect_ManifestFactory$.prototype.constructor = $c_s_reflect_ManifestFactory$;
/** @constructor */
function $h_s_reflect_ManifestFactory$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$.prototype = $c_s_reflect_ManifestFactory$.prototype;
var $d_s_reflect_ManifestFactory$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$: 0
}, false, "scala.reflect.ManifestFactory$", {
  s_reflect_ManifestFactory$: 1,
  O: 1
});
$c_s_reflect_ManifestFactory$.prototype.$classData = $d_s_reflect_ManifestFactory$;
var $n_s_reflect_ManifestFactory$ = (void 0);
function $m_s_reflect_ManifestFactory$() {
  if ((!$n_s_reflect_ManifestFactory$)) {
    $n_s_reflect_ManifestFactory$ = new $c_s_reflect_ManifestFactory$().init___()
  };
  return $n_s_reflect_ManifestFactory$
}
/** @constructor */
function $c_s_reflect_package$() {
  $c_O.call(this);
  this.ClassManifest$1 = null;
  this.Manifest$1 = null
}
$c_s_reflect_package$.prototype = new $h_O();
$c_s_reflect_package$.prototype.constructor = $c_s_reflect_package$;
/** @constructor */
function $h_s_reflect_package$() {
  /*<skip>*/
}
$h_s_reflect_package$.prototype = $c_s_reflect_package$.prototype;
$c_s_reflect_package$.prototype.init___ = (function() {
  $n_s_reflect_package$ = this;
  this.ClassManifest$1 = $m_s_reflect_ClassManifestFactory$();
  this.Manifest$1 = $m_s_reflect_ManifestFactory$();
  return this
});
var $d_s_reflect_package$ = new $TypeData().initClass({
  s_reflect_package$: 0
}, false, "scala.reflect.package$", {
  s_reflect_package$: 1,
  O: 1
});
$c_s_reflect_package$.prototype.$classData = $d_s_reflect_package$;
var $n_s_reflect_package$ = (void 0);
function $m_s_reflect_package$() {
  if ((!$n_s_reflect_package$)) {
    $n_s_reflect_package$ = new $c_s_reflect_package$().init___()
  };
  return $n_s_reflect_package$
}
/** @constructor */
function $c_s_sys_package$() {
  $c_O.call(this)
}
$c_s_sys_package$.prototype = new $h_O();
$c_s_sys_package$.prototype.constructor = $c_s_sys_package$;
/** @constructor */
function $h_s_sys_package$() {
  /*<skip>*/
}
$h_s_sys_package$.prototype = $c_s_sys_package$.prototype;
$c_s_sys_package$.prototype.error__T__sr_Nothing$ = (function(message) {
  throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(new $c_jl_RuntimeException().init___T(message))
});
var $d_s_sys_package$ = new $TypeData().initClass({
  s_sys_package$: 0
}, false, "scala.sys.package$", {
  s_sys_package$: 1,
  O: 1
});
$c_s_sys_package$.prototype.$classData = $d_s_sys_package$;
var $n_s_sys_package$ = (void 0);
function $m_s_sys_package$() {
  if ((!$n_s_sys_package$)) {
    $n_s_sys_package$ = new $c_s_sys_package$().init___()
  };
  return $n_s_sys_package$
}
/** @constructor */
function $c_s_util_DynamicVariable() {
  $c_O.call(this);
  this.scala$util$DynamicVariable$$init$f = null;
  this.tl$1 = null
}
$c_s_util_DynamicVariable.prototype = new $h_O();
$c_s_util_DynamicVariable.prototype.constructor = $c_s_util_DynamicVariable;
/** @constructor */
function $h_s_util_DynamicVariable() {
  /*<skip>*/
}
$h_s_util_DynamicVariable.prototype = $c_s_util_DynamicVariable.prototype;
$c_s_util_DynamicVariable.prototype.toString__T = (function() {
  return (("DynamicVariable(" + this.tl$1.get__O()) + ")")
});
$c_s_util_DynamicVariable.prototype.init___O = (function(init) {
  this.scala$util$DynamicVariable$$init$f = init;
  this.tl$1 = new $c_s_util_DynamicVariable$$anon$1().init___s_util_DynamicVariable(this);
  return this
});
var $d_s_util_DynamicVariable = new $TypeData().initClass({
  s_util_DynamicVariable: 0
}, false, "scala.util.DynamicVariable", {
  s_util_DynamicVariable: 1,
  O: 1
});
$c_s_util_DynamicVariable.prototype.$classData = $d_s_util_DynamicVariable;
/** @constructor */
function $c_s_util_Either() {
  $c_O.call(this)
}
$c_s_util_Either.prototype = new $h_O();
$c_s_util_Either.prototype.constructor = $c_s_util_Either;
/** @constructor */
function $h_s_util_Either() {
  /*<skip>*/
}
$h_s_util_Either.prototype = $c_s_util_Either.prototype;
function $is_s_util_Either(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_util_Either)))
}
function $as_s_util_Either(obj) {
  return (($is_s_util_Either(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.util.Either"))
}
function $isArrayOf_s_util_Either(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_util_Either)))
}
function $asArrayOf_s_util_Either(obj, depth) {
  return (($isArrayOf_s_util_Either(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.util.Either;", depth))
}
/** @constructor */
function $c_s_util_Either$() {
  $c_O.call(this)
}
$c_s_util_Either$.prototype = new $h_O();
$c_s_util_Either$.prototype.constructor = $c_s_util_Either$;
/** @constructor */
function $h_s_util_Either$() {
  /*<skip>*/
}
$h_s_util_Either$.prototype = $c_s_util_Either$.prototype;
var $d_s_util_Either$ = new $TypeData().initClass({
  s_util_Either$: 0
}, false, "scala.util.Either$", {
  s_util_Either$: 1,
  O: 1
});
$c_s_util_Either$.prototype.$classData = $d_s_util_Either$;
var $n_s_util_Either$ = (void 0);
function $m_s_util_Either$() {
  if ((!$n_s_util_Either$)) {
    $n_s_util_Either$ = new $c_s_util_Either$().init___()
  };
  return $n_s_util_Either$
}
/** @constructor */
function $c_s_util_control_Breaks() {
  $c_O.call(this);
  this.scala$util$control$Breaks$$breakException$1 = null
}
$c_s_util_control_Breaks.prototype = new $h_O();
$c_s_util_control_Breaks.prototype.constructor = $c_s_util_control_Breaks;
/** @constructor */
function $h_s_util_control_Breaks() {
  /*<skip>*/
}
$h_s_util_control_Breaks.prototype = $c_s_util_control_Breaks.prototype;
$c_s_util_control_Breaks.prototype.init___ = (function() {
  this.scala$util$control$Breaks$$breakException$1 = new $c_s_util_control_BreakControl().init___();
  return this
});
var $d_s_util_control_Breaks = new $TypeData().initClass({
  s_util_control_Breaks: 0
}, false, "scala.util.control.Breaks", {
  s_util_control_Breaks: 1,
  O: 1
});
$c_s_util_control_Breaks.prototype.$classData = $d_s_util_control_Breaks;
function $s_s_util_control_NoStackTrace$class__fillInStackTrace__s_util_control_NoStackTrace__jl_Throwable($$this) {
  var this$1 = $m_s_util_control_NoStackTrace$();
  if (this$1.$$undnoSuppression$1) {
    return $$this.scala$util$control$NoStackTrace$$super$fillInStackTrace__jl_Throwable()
  } else {
    return $as_jl_Throwable($$this)
  }
}
/** @constructor */
function $c_s_util_hashing_MurmurHash3() {
  $c_O.call(this)
}
$c_s_util_hashing_MurmurHash3.prototype = new $h_O();
$c_s_util_hashing_MurmurHash3.prototype.constructor = $c_s_util_hashing_MurmurHash3;
/** @constructor */
function $h_s_util_hashing_MurmurHash3() {
  /*<skip>*/
}
$h_s_util_hashing_MurmurHash3.prototype = $c_s_util_hashing_MurmurHash3.prototype;
$c_s_util_hashing_MurmurHash3.prototype.mixLast__I__I__I = (function(hash, data) {
  var k = data;
  k = $imul((-862048943), k);
  k = $m_jl_Integer$().rotateLeft__I__I__I(k, 15);
  k = $imul(461845907, k);
  return (hash ^ k)
});
$c_s_util_hashing_MurmurHash3.prototype.mix__I__I__I = (function(hash, data) {
  var h = this.mixLast__I__I__I(hash, data);
  h = $m_jl_Integer$().rotateLeft__I__I__I(h, 13);
  return (((-430675100) + $imul(5, h)) | 0)
});
$c_s_util_hashing_MurmurHash3.prototype.avalanche__p1__I__I = (function(hash) {
  var h = hash;
  h = (h ^ ((h >>> 16) | 0));
  h = $imul((-2048144789), h);
  h = (h ^ ((h >>> 13) | 0));
  h = $imul((-1028477387), h);
  h = (h ^ ((h >>> 16) | 0));
  return h
});
$c_s_util_hashing_MurmurHash3.prototype.unorderedHash__sc_TraversableOnce__I__I = (function(xs, seed) {
  var a = new $c_sr_IntRef().init___I(0);
  var b = new $c_sr_IntRef().init___I(0);
  var n = new $c_sr_IntRef().init___I(0);
  var c = new $c_sr_IntRef().init___I(1);
  xs.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, a$1, b$1, n$1, c$1) {
    return (function(x$2) {
      var h = $m_sr_ScalaRunTime$().hash__O__I(x$2);
      a$1.elem$1 = ((a$1.elem$1 + h) | 0);
      b$1.elem$1 = (b$1.elem$1 ^ h);
      if ((h !== 0)) {
        c$1.elem$1 = $imul(c$1.elem$1, h)
      };
      n$1.elem$1 = ((1 + n$1.elem$1) | 0)
    })
  })(this, a, b, n, c)));
  var h$1 = seed;
  h$1 = this.mix__I__I__I(h$1, a.elem$1);
  h$1 = this.mix__I__I__I(h$1, b.elem$1);
  h$1 = this.mixLast__I__I__I(h$1, c.elem$1);
  return this.finalizeHash__I__I__I(h$1, n.elem$1)
});
$c_s_util_hashing_MurmurHash3.prototype.productHash__s_Product__I__I = (function(x, seed) {
  var arr = x.productArity__I();
  if ((arr === 0)) {
    var this$1 = x.productPrefix__T();
    return $m_sjsr_RuntimeString$().hashCode__T__I(this$1)
  } else {
    var h = seed;
    var i = 0;
    while ((i < arr)) {
      h = this.mix__I__I__I(h, $m_sr_ScalaRunTime$().hash__O__I(x.productElement__I__O(i)));
      i = ((1 + i) | 0)
    };
    return this.finalizeHash__I__I__I(h, arr)
  }
});
$c_s_util_hashing_MurmurHash3.prototype.finalizeHash__I__I__I = (function(hash, length) {
  return this.avalanche__p1__I__I((hash ^ length))
});
$c_s_util_hashing_MurmurHash3.prototype.orderedHash__sc_TraversableOnce__I__I = (function(xs, seed) {
  var n = new $c_sr_IntRef().init___I(0);
  var h = new $c_sr_IntRef().init___I(seed);
  xs.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, n$1, h$1) {
    return (function(x$2) {
      h$1.elem$1 = $this.mix__I__I__I(h$1.elem$1, $m_sr_ScalaRunTime$().hash__O__I(x$2));
      n$1.elem$1 = ((1 + n$1.elem$1) | 0)
    })
  })(this, n, h)));
  return this.finalizeHash__I__I__I(h.elem$1, n.elem$1)
});
$c_s_util_hashing_MurmurHash3.prototype.listHash__sci_List__I__I = (function(xs, seed) {
  var n = 0;
  var h = seed;
  var elems = xs;
  while ((!elems.isEmpty__Z())) {
    var head = elems.head__O();
    var this$1 = elems;
    var tail = this$1.tail__sci_List();
    h = this.mix__I__I__I(h, $m_sr_ScalaRunTime$().hash__O__I(head));
    n = ((1 + n) | 0);
    elems = tail
  };
  return this.finalizeHash__I__I__I(h, n)
});
/** @constructor */
function $c_s_util_hashing_package$() {
  $c_O.call(this)
}
$c_s_util_hashing_package$.prototype = new $h_O();
$c_s_util_hashing_package$.prototype.constructor = $c_s_util_hashing_package$;
/** @constructor */
function $h_s_util_hashing_package$() {
  /*<skip>*/
}
$h_s_util_hashing_package$.prototype = $c_s_util_hashing_package$.prototype;
$c_s_util_hashing_package$.prototype.byteswap32__I__I = (function(v) {
  var hc = $imul((-1640532531), v);
  hc = $m_jl_Integer$().reverseBytes__I__I(hc);
  return $imul((-1640532531), hc)
});
var $d_s_util_hashing_package$ = new $TypeData().initClass({
  s_util_hashing_package$: 0
}, false, "scala.util.hashing.package$", {
  s_util_hashing_package$: 1,
  O: 1
});
$c_s_util_hashing_package$.prototype.$classData = $d_s_util_hashing_package$;
var $n_s_util_hashing_package$ = (void 0);
function $m_s_util_hashing_package$() {
  if ((!$n_s_util_hashing_package$)) {
    $n_s_util_hashing_package$ = new $c_s_util_hashing_package$().init___()
  };
  return $n_s_util_hashing_package$
}
/** @constructor */
function $c_sc_$colon$plus$() {
  $c_O.call(this)
}
$c_sc_$colon$plus$.prototype = new $h_O();
$c_sc_$colon$plus$.prototype.constructor = $c_sc_$colon$plus$;
/** @constructor */
function $h_sc_$colon$plus$() {
  /*<skip>*/
}
$h_sc_$colon$plus$.prototype = $c_sc_$colon$plus$.prototype;
var $d_sc_$colon$plus$ = new $TypeData().initClass({
  sc_$colon$plus$: 0
}, false, "scala.collection.$colon$plus$", {
  sc_$colon$plus$: 1,
  O: 1
});
$c_sc_$colon$plus$.prototype.$classData = $d_sc_$colon$plus$;
var $n_sc_$colon$plus$ = (void 0);
function $m_sc_$colon$plus$() {
  if ((!$n_sc_$colon$plus$)) {
    $n_sc_$colon$plus$ = new $c_sc_$colon$plus$().init___()
  };
  return $n_sc_$colon$plus$
}
/** @constructor */
function $c_sc_$plus$colon$() {
  $c_O.call(this)
}
$c_sc_$plus$colon$.prototype = new $h_O();
$c_sc_$plus$colon$.prototype.constructor = $c_sc_$plus$colon$;
/** @constructor */
function $h_sc_$plus$colon$() {
  /*<skip>*/
}
$h_sc_$plus$colon$.prototype = $c_sc_$plus$colon$.prototype;
var $d_sc_$plus$colon$ = new $TypeData().initClass({
  sc_$plus$colon$: 0
}, false, "scala.collection.$plus$colon$", {
  sc_$plus$colon$: 1,
  O: 1
});
$c_sc_$plus$colon$.prototype.$classData = $d_sc_$plus$colon$;
var $n_sc_$plus$colon$ = (void 0);
function $m_sc_$plus$colon$() {
  if ((!$n_sc_$plus$colon$)) {
    $n_sc_$plus$colon$ = new $c_sc_$plus$colon$().init___()
  };
  return $n_sc_$plus$colon$
}
function $s_sc_GenSeqLike$class__equals__sc_GenSeqLike__O__Z($$this, that) {
  if ($is_sc_GenSeq(that)) {
    var x2 = $as_sc_GenSeq(that);
    return $$this.sameElements__sc_GenIterable__Z(x2)
  } else {
    return false
  }
}
function $s_sc_GenSeqLike$class__isDefinedAt__sc_GenSeqLike__I__Z($$this, idx) {
  return ((idx >= 0) && (idx < $$this.length__I()))
}
function $s_sc_GenSetLike$class__liftedTree1$1__p0__sc_GenSetLike__sc_GenSet__Z($$this, x2$1) {
  try {
    return $$this.subsetOf__sc_GenSet__Z(x2$1)
  } catch (e) {
    if ($is_jl_ClassCastException(e)) {
      $as_jl_ClassCastException(e);
      return false
    } else {
      throw e
    }
  }
}
function $s_sc_GenSetLike$class__equals__sc_GenSetLike__O__Z($$this, that) {
  if ($is_sc_GenSet(that)) {
    var x2 = $as_sc_GenSet(that);
    return (($$this === x2) || (($$this.size__I() === x2.size__I()) && $s_sc_GenSetLike$class__liftedTree1$1__p0__sc_GenSetLike__sc_GenSet__Z($$this, x2)))
  } else {
    return false
  }
}
function $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I($$this, len) {
  return (($$this.length__I() - len) | 0)
}
function $s_sc_IndexedSeqOptimized$class__copyToArray__sc_IndexedSeqOptimized__O__I__I__V($$this, xs, start, len) {
  var i = 0;
  var j = start;
  var $$this$1 = $$this.length__I();
  var $$this$2 = (($$this$1 < len) ? $$this$1 : len);
  var that = (($m_sr_ScalaRunTime$().array$undlength__O__I(xs) - start) | 0);
  var end = (($$this$2 < that) ? $$this$2 : that);
  while ((i < end)) {
    $m_sr_ScalaRunTime$().array$undupdate__O__I__O__V(xs, j, $$this.apply__I__O(i));
    i = ((1 + i) | 0);
    j = ((1 + j) | 0)
  }
}
function $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z($$this, that) {
  if ($is_sc_IndexedSeq(that)) {
    var x2 = $as_sc_IndexedSeq(that);
    var len = $$this.length__I();
    if ((len === x2.length__I())) {
      var i = 0;
      while (((i < len) && $m_sr_BoxesRunTime$().equals__O__O__Z($$this.apply__I__O(i), x2.apply__I__O(i)))) {
        i = ((1 + i) | 0)
      };
      return (i === len)
    } else {
      return false
    }
  } else {
    return $s_sc_IterableLike$class__sameElements__sc_IterableLike__sc_GenIterable__Z($$this, that)
  }
}
function $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V($$this, f) {
  var i = 0;
  var len = $$this.length__I();
  while ((i < len)) {
    f.apply__O__O($$this.apply__I__O(i));
    i = ((1 + i) | 0)
  }
}
function $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z($$this) {
  return ($$this.length__I() === 0)
}
function $s_sc_IterableLike$class__copyToArray__sc_IterableLike__O__I__I__V($$this, xs, start, len) {
  var i = start;
  var $$this$1 = ((start + len) | 0);
  var that = $m_sr_ScalaRunTime$().array$undlength__O__I(xs);
  var end = (($$this$1 < that) ? $$this$1 : that);
  var it = $$this.iterator__sc_Iterator();
  while (((i < end) && it.hasNext__Z())) {
    $m_sr_ScalaRunTime$().array$undupdate__O__I__O__V(xs, i, it.next__O());
    i = ((1 + i) | 0)
  }
}
function $s_sc_IterableLike$class__take__sc_IterableLike__I__O($$this, n) {
  var b = $$this.newBuilder__scm_Builder();
  if ((n <= 0)) {
    return b.result__O()
  } else {
    b.sizeHintBounded__I__sc_TraversableLike__V(n, $$this);
    var i = 0;
    var it = $$this.iterator__sc_Iterator();
    while (((i < n) && it.hasNext__Z())) {
      b.$$plus$eq__O__scm_Builder(it.next__O());
      i = ((1 + i) | 0)
    };
    return b.result__O()
  }
}
function $s_sc_IterableLike$class__sameElements__sc_IterableLike__sc_GenIterable__Z($$this, that) {
  var these = $$this.iterator__sc_Iterator();
  var those = that.iterator__sc_Iterator();
  while ((these.hasNext__Z() && those.hasNext__Z())) {
    if ((!$m_sr_BoxesRunTime$().equals__O__O__Z(these.next__O(), those.next__O()))) {
      return false
    }
  };
  return ((!these.hasNext__Z()) && (!those.hasNext__Z()))
}
/** @constructor */
function $c_sc_Iterator$() {
  $c_O.call(this);
  this.empty$1 = null
}
$c_sc_Iterator$.prototype = new $h_O();
$c_sc_Iterator$.prototype.constructor = $c_sc_Iterator$;
/** @constructor */
function $h_sc_Iterator$() {
  /*<skip>*/
}
$h_sc_Iterator$.prototype = $c_sc_Iterator$.prototype;
$c_sc_Iterator$.prototype.init___ = (function() {
  $n_sc_Iterator$ = this;
  this.empty$1 = new $c_sc_Iterator$$anon$2().init___();
  return this
});
var $d_sc_Iterator$ = new $TypeData().initClass({
  sc_Iterator$: 0
}, false, "scala.collection.Iterator$", {
  sc_Iterator$: 1,
  O: 1
});
$c_sc_Iterator$.prototype.$classData = $d_sc_Iterator$;
var $n_sc_Iterator$ = (void 0);
function $m_sc_Iterator$() {
  if ((!$n_sc_Iterator$)) {
    $n_sc_Iterator$ = new $c_sc_Iterator$().init___()
  };
  return $n_sc_Iterator$
}
function $s_sc_Iterator$class__toStream__sc_Iterator__sci_Stream($$this) {
  if ($$this.hasNext__Z()) {
    var hd = $$this.next__O();
    var tl = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($$this$1) {
      return (function() {
        return $$this$1.toStream__sci_Stream()
      })
    })($$this));
    return new $c_sci_Stream$Cons().init___O__F0(hd, tl)
  } else {
    $m_sci_Stream$();
    return $m_sci_Stream$Empty$()
  }
}
function $s_sc_Iterator$class__isEmpty__sc_Iterator__Z($$this) {
  return (!$$this.hasNext__Z())
}
function $s_sc_Iterator$class__toString__sc_Iterator__T($$this) {
  return (($$this.hasNext__Z() ? "non-empty" : "empty") + " iterator")
}
function $s_sc_Iterator$class__foreach__sc_Iterator__F1__V($$this, f) {
  while ($$this.hasNext__Z()) {
    f.apply__O__O($$this.next__O())
  }
}
function $s_sc_Iterator$class__forall__sc_Iterator__F1__Z($$this, p) {
  var res = true;
  while ((res && $$this.hasNext__Z())) {
    res = $uZ(p.apply__O__O($$this.next__O()))
  };
  return res
}
function $s_sc_LinearSeqOptimized$class__isDefinedAt__sc_LinearSeqOptimized__I__Z($$this, x) {
  return ((x >= 0) && ($s_sc_LinearSeqOptimized$class__lengthCompare__sc_LinearSeqOptimized__I__I($$this, x) > 0))
}
function $s_sc_LinearSeqOptimized$class__lengthCompare__sc_LinearSeqOptimized__I__I($$this, len) {
  return ((len < 0) ? 1 : $s_sc_LinearSeqOptimized$class__loop$1__p0__sc_LinearSeqOptimized__I__sc_LinearSeqOptimized__I__I($$this, 0, $$this, len))
}
function $s_sc_LinearSeqOptimized$class__apply__sc_LinearSeqOptimized__I__O($$this, n) {
  var rest = $$this.drop__I__sc_LinearSeqOptimized(n);
  if (((n < 0) || rest.isEmpty__Z())) {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
  };
  return rest.head__O()
}
function $s_sc_LinearSeqOptimized$class__loop$1__p0__sc_LinearSeqOptimized__I__sc_LinearSeqOptimized__I__I($$this, i, xs, len$1) {
  _loop: while (true) {
    if ((i === len$1)) {
      return (xs.isEmpty__Z() ? 0 : 1)
    } else if (xs.isEmpty__Z()) {
      return (-1)
    } else {
      var temp$i = ((1 + i) | 0);
      var temp$xs = $as_sc_LinearSeqOptimized(xs.tail__O());
      i = temp$i;
      xs = temp$xs;
      continue _loop
    }
  }
}
function $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I($$this) {
  var these = $$this;
  var len = 0;
  while ((!these.isEmpty__Z())) {
    len = ((1 + len) | 0);
    these = $as_sc_LinearSeqOptimized(these.tail__O())
  };
  return len
}
function $s_sc_LinearSeqOptimized$class__sameElements__sc_LinearSeqOptimized__sc_GenIterable__Z($$this, that) {
  if ($is_sc_LinearSeq(that)) {
    var x2 = $as_sc_LinearSeq(that);
    if (($$this === x2)) {
      return true
    } else {
      var these = $$this;
      var those = x2;
      while ((((!these.isEmpty__Z()) && (!those.isEmpty__Z())) && $m_sr_BoxesRunTime$().equals__O__O__Z(these.head__O(), those.head__O()))) {
        these = $as_sc_LinearSeqOptimized(these.tail__O());
        those = $as_sc_LinearSeq(those.tail__O())
      };
      return (these.isEmpty__Z() && those.isEmpty__Z())
    }
  } else {
    return $s_sc_IterableLike$class__sameElements__sc_IterableLike__sc_GenIterable__Z($$this, that)
  }
}
function $s_sc_SeqLike$class__isEmpty__sc_SeqLike__Z($$this) {
  return ($$this.lengthCompare__I__I(0) === 0)
}
function $s_sc_SeqLike$class__reverse__sc_SeqLike__O($$this) {
  var elem = $m_sci_Nil$();
  var xs = new $c_sr_ObjectRef().init___O(elem);
  $$this.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1, xs$1) {
    return (function(x$2) {
      var this$2 = $as_sci_List(xs$1.elem$1);
      xs$1.elem$1 = new $c_sci_$colon$colon().init___O__sci_List(x$2, this$2)
    })
  })($$this, xs)));
  var b = $$this.newBuilder__scm_Builder();
  $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__V(b, $$this);
  var this$3 = $as_sci_List(xs.elem$1);
  var these = this$3;
  while ((!these.isEmpty__Z())) {
    var arg1 = these.head__O();
    b.$$plus$eq__O__scm_Builder(arg1);
    var this$4 = these;
    these = this$4.tail__sci_List()
  };
  return b.result__O()
}
function $s_sc_SeqLike$class__$$colon$plus__sc_SeqLike__O__scg_CanBuildFrom__O($$this, elem, bf) {
  var b = bf.apply__O__scm_Builder($$this.repr__O());
  b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable($$this.thisCollection__sc_Seq());
  b.$$plus$eq__O__scm_Builder(elem);
  return b.result__O()
}
function $s_sc_SetLike$class__isEmpty__sc_SetLike__Z($$this) {
  return ($$this.size__I() === 0)
}
function $s_sc_TraversableLike$class__to__sc_TraversableLike__scg_CanBuildFrom__O($$this, cbf) {
  var b = cbf.apply__scm_Builder();
  $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__V(b, $$this);
  b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable($$this.thisCollection__sc_Traversable());
  return b.result__O()
}
function $s_sc_TraversableLike$class__toString__sc_TraversableLike__T($$this) {
  return $$this.mkString__T__T__T__T(($$this.stringPrefix__T() + "("), ", ", ")")
}
function $s_sc_TraversableLike$class__flatMap__sc_TraversableLike__F1__scg_CanBuildFrom__O($$this, f, bf) {
  var b = bf.apply__O__scm_Builder($$this.repr__O());
  $$this.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1, b$1, f$1) {
    return (function(x$2) {
      return $as_scm_Builder(b$1.$$plus$plus$eq__sc_TraversableOnce__scg_Growable($as_sc_GenTraversableOnce(f$1.apply__O__O(x$2)).seq__sc_TraversableOnce()))
    })
  })($$this, b, f)));
  return b.result__O()
}
function $s_sc_TraversableLike$class__stringPrefix__sc_TraversableLike__T($$this) {
  var string = $objectGetClass($$this.repr__O()).getName__T();
  var idx1 = $m_sjsr_RuntimeString$().lastIndexOf__T__I__I(string, 46);
  if ((idx1 !== (-1))) {
    var thiz = string;
    var beginIndex = ((1 + idx1) | 0);
    string = $as_T(thiz["substring"](beginIndex))
  };
  var idx2 = $m_sjsr_RuntimeString$().indexOf__T__I__I(string, 36);
  if ((idx2 !== (-1))) {
    var thiz$1 = string;
    string = $as_T(thiz$1["substring"](0, idx2))
  };
  return string
}
function $is_sc_TraversableOnce(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_TraversableOnce)))
}
function $as_sc_TraversableOnce(obj) {
  return (($is_sc_TraversableOnce(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.TraversableOnce"))
}
function $isArrayOf_sc_TraversableOnce(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_TraversableOnce)))
}
function $asArrayOf_sc_TraversableOnce(obj, depth) {
  return (($isArrayOf_sc_TraversableOnce(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.TraversableOnce;", depth))
}
function $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder($$this, b, start, sep, end) {
  var first = new $c_sr_BooleanRef().init___Z(true);
  b.append__T__scm_StringBuilder(start);
  $$this.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1, first$1, b$1, sep$1) {
    return (function(x$2) {
      if (first$1.elem$1) {
        b$1.append__O__scm_StringBuilder(x$2);
        first$1.elem$1 = false;
        return (void 0)
      } else {
        b$1.append__T__scm_StringBuilder(sep$1);
        return b$1.append__O__scm_StringBuilder(x$2)
      }
    })
  })($$this, first, b, sep)));
  b.append__T__scm_StringBuilder(end);
  return b
}
function $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T($$this, start, sep, end) {
  var this$1 = $$this.addString__scm_StringBuilder__T__T__T__scm_StringBuilder(new $c_scm_StringBuilder().init___(), start, sep, end);
  var this$2 = this$1.underlying$5;
  return this$2.content$1
}
function $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z($$this) {
  return (!$$this.isEmpty__Z())
}
/** @constructor */
function $c_scg_GenMapFactory() {
  $c_O.call(this)
}
$c_scg_GenMapFactory.prototype = new $h_O();
$c_scg_GenMapFactory.prototype.constructor = $c_scg_GenMapFactory;
/** @constructor */
function $h_scg_GenMapFactory() {
  /*<skip>*/
}
$h_scg_GenMapFactory.prototype = $c_scg_GenMapFactory.prototype;
/** @constructor */
function $c_scg_GenericCompanion() {
  $c_O.call(this)
}
$c_scg_GenericCompanion.prototype = new $h_O();
$c_scg_GenericCompanion.prototype.constructor = $c_scg_GenericCompanion;
/** @constructor */
function $h_scg_GenericCompanion() {
  /*<skip>*/
}
$h_scg_GenericCompanion.prototype = $c_scg_GenericCompanion.prototype;
function $is_scg_Growable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scg_Growable)))
}
function $as_scg_Growable(obj) {
  return (($is_scg_Growable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.generic.Growable"))
}
function $isArrayOf_scg_Growable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scg_Growable)))
}
function $asArrayOf_scg_Growable(obj, depth) {
  return (($isArrayOf_scg_Growable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.generic.Growable;", depth))
}
function $s_scg_Growable$class__loop$1__p0__scg_Growable__sc_LinearSeq__V($$this, xs) {
  x: {
    _loop: while (true) {
      var this$1 = xs;
      if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)) {
        $$this.$$plus$eq__O__scg_Growable(xs.head__O());
        xs = $as_sc_LinearSeq(xs.tail__O());
        continue _loop
      };
      break x
    }
  }
}
function $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable($$this, xs) {
  if ($is_sc_LinearSeq(xs)) {
    var x2 = $as_sc_LinearSeq(xs);
    $s_scg_Growable$class__loop$1__p0__scg_Growable__sc_LinearSeq__V($$this, x2)
  } else {
    xs.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1) {
      return (function(elem$2) {
        return $$this$1.$$plus$eq__O__scg_Growable(elem$2)
      })
    })($$this)))
  };
  return $$this
}
/** @constructor */
function $c_sci_Stream$$hash$colon$colon$() {
  $c_O.call(this)
}
$c_sci_Stream$$hash$colon$colon$.prototype = new $h_O();
$c_sci_Stream$$hash$colon$colon$.prototype.constructor = $c_sci_Stream$$hash$colon$colon$;
/** @constructor */
function $h_sci_Stream$$hash$colon$colon$() {
  /*<skip>*/
}
$h_sci_Stream$$hash$colon$colon$.prototype = $c_sci_Stream$$hash$colon$colon$.prototype;
var $d_sci_Stream$$hash$colon$colon$ = new $TypeData().initClass({
  sci_Stream$$hash$colon$colon$: 0
}, false, "scala.collection.immutable.Stream$$hash$colon$colon$", {
  sci_Stream$$hash$colon$colon$: 1,
  O: 1
});
$c_sci_Stream$$hash$colon$colon$.prototype.$classData = $d_sci_Stream$$hash$colon$colon$;
var $n_sci_Stream$$hash$colon$colon$ = (void 0);
function $m_sci_Stream$$hash$colon$colon$() {
  if ((!$n_sci_Stream$$hash$colon$colon$)) {
    $n_sci_Stream$$hash$colon$colon$ = new $c_sci_Stream$$hash$colon$colon$().init___()
  };
  return $n_sci_Stream$$hash$colon$colon$
}
/** @constructor */
function $c_sci_StreamIterator$LazyCell() {
  $c_O.call(this);
  this.st$1 = null;
  this.v$1 = null;
  this.$$outer$f = null;
  this.bitmap$0$1 = false
}
$c_sci_StreamIterator$LazyCell.prototype = new $h_O();
$c_sci_StreamIterator$LazyCell.prototype.constructor = $c_sci_StreamIterator$LazyCell;
/** @constructor */
function $h_sci_StreamIterator$LazyCell() {
  /*<skip>*/
}
$h_sci_StreamIterator$LazyCell.prototype = $c_sci_StreamIterator$LazyCell.prototype;
$c_sci_StreamIterator$LazyCell.prototype.init___sci_StreamIterator__F0 = (function($$outer, st) {
  this.st$1 = st;
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  return this
});
$c_sci_StreamIterator$LazyCell.prototype.v$lzycompute__p1__sci_Stream = (function() {
  if ((!this.bitmap$0$1)) {
    this.v$1 = $as_sci_Stream(this.st$1.apply__O());
    this.bitmap$0$1 = true
  };
  this.st$1 = null;
  return this.v$1
});
$c_sci_StreamIterator$LazyCell.prototype.v__sci_Stream = (function() {
  return ((!this.bitmap$0$1) ? this.v$lzycompute__p1__sci_Stream() : this.v$1)
});
var $d_sci_StreamIterator$LazyCell = new $TypeData().initClass({
  sci_StreamIterator$LazyCell: 0
}, false, "scala.collection.immutable.StreamIterator$LazyCell", {
  sci_StreamIterator$LazyCell: 1,
  O: 1
});
$c_sci_StreamIterator$LazyCell.prototype.$classData = $d_sci_StreamIterator$LazyCell;
/** @constructor */
function $c_sci_StringOps$() {
  $c_O.call(this)
}
$c_sci_StringOps$.prototype = new $h_O();
$c_sci_StringOps$.prototype.constructor = $c_sci_StringOps$;
/** @constructor */
function $h_sci_StringOps$() {
  /*<skip>*/
}
$h_sci_StringOps$.prototype = $c_sci_StringOps$.prototype;
$c_sci_StringOps$.prototype.equals$extension__T__O__Z = (function($$this, x$1) {
  if ($is_sci_StringOps(x$1)) {
    var StringOps$1 = ((x$1 === null) ? null : $as_sci_StringOps(x$1).repr$1);
    return ($$this === StringOps$1)
  } else {
    return false
  }
});
var $d_sci_StringOps$ = new $TypeData().initClass({
  sci_StringOps$: 0
}, false, "scala.collection.immutable.StringOps$", {
  sci_StringOps$: 1,
  O: 1
});
$c_sci_StringOps$.prototype.$classData = $d_sci_StringOps$;
var $n_sci_StringOps$ = (void 0);
function $m_sci_StringOps$() {
  if ((!$n_sci_StringOps$)) {
    $n_sci_StringOps$ = new $c_sci_StringOps$().init___()
  };
  return $n_sci_StringOps$
}
function $s_sci_VectorPointer$class__gotoFreshPosWritable1__sci_VectorPointer__I__I__I__V($$this, oldIndex, newIndex, xor) {
  $s_sci_VectorPointer$class__stabilize__sci_VectorPointer__I__V($$this, oldIndex);
  $s_sci_VectorPointer$class__gotoFreshPosWritable0__sci_VectorPointer__I__I__I__V($$this, oldIndex, newIndex, xor)
}
function $s_sci_VectorPointer$class__getElem__sci_VectorPointer__I__I__O($$this, index, xor) {
  if ((xor < 32)) {
    return $$this.display0__AO().u[(31 & index)]
  } else if ((xor < 1024)) {
    return $asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1).u[(31 & index)]
  } else if ((xor < 32768)) {
    return $asArrayOf_O($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1).u[(31 & (index >> 5))], 1).u[(31 & index)]
  } else if ((xor < 1048576)) {
    return $asArrayOf_O($asArrayOf_O($asArrayOf_O($$this.display3__AO().u[(31 & (index >> 15))], 1).u[(31 & (index >> 10))], 1).u[(31 & (index >> 5))], 1).u[(31 & index)]
  } else if ((xor < 33554432)) {
    return $asArrayOf_O($asArrayOf_O($asArrayOf_O($asArrayOf_O($$this.display4__AO().u[(31 & (index >> 20))], 1).u[(31 & (index >> 15))], 1).u[(31 & (index >> 10))], 1).u[(31 & (index >> 5))], 1).u[(31 & index)]
  } else if ((xor < 1073741824)) {
    return $asArrayOf_O($asArrayOf_O($asArrayOf_O($asArrayOf_O($asArrayOf_O($$this.display5__AO().u[(31 & (index >> 25))], 1).u[(31 & (index >> 20))], 1).u[(31 & (index >> 15))], 1).u[(31 & (index >> 10))], 1).u[(31 & (index >> 5))], 1).u[(31 & index)]
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
}
function $s_sci_VectorPointer$class__gotoNextBlockStartWritable__sci_VectorPointer__I__I__V($$this, index, xor) {
  if ((xor < 1024)) {
    if (($$this.depth__I() === 1)) {
      $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $$this.display1__AO().u[0] = $$this.display0__AO();
      $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
    };
    $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO()
  } else if ((xor < 32768)) {
    if (($$this.depth__I() === 2)) {
      $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $$this.display2__AO().u[0] = $$this.display1__AO();
      $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
    };
    $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO()
  } else if ((xor < 1048576)) {
    if (($$this.depth__I() === 3)) {
      $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $$this.display3__AO().u[0] = $$this.display2__AO();
      $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
    };
    $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO()
  } else if ((xor < 33554432)) {
    if (($$this.depth__I() === 4)) {
      $$this.display4$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $$this.display4__AO().u[0] = $$this.display3__AO();
      $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
    };
    $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO();
    $$this.display4__AO().u[(31 & (index >> 20))] = $$this.display3__AO()
  } else if ((xor < 1073741824)) {
    if (($$this.depth__I() === 5)) {
      $$this.display5$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $$this.display5__AO().u[0] = $$this.display4__AO();
      $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
    };
    $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display4$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO();
    $$this.display4__AO().u[(31 & (index >> 20))] = $$this.display3__AO();
    $$this.display5__AO().u[(31 & (index >> 25))] = $$this.display4__AO()
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
}
function $s_sci_VectorPointer$class__gotoPosWritable0__sci_VectorPointer__I__I__V($$this, newIndex, xor) {
  var x1 = (((-1) + $$this.depth__I()) | 0);
  switch (x1) {
    case 5: {
      var a = $$this.display5__AO();
      $$this.display5$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a));
      var array = $$this.display5__AO();
      var index = (31 & (newIndex >> 25));
      $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array, index));
      var array$1 = $$this.display4__AO();
      var index$1 = (31 & (newIndex >> 20));
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$1, index$1));
      var array$2 = $$this.display3__AO();
      var index$2 = (31 & (newIndex >> 15));
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$2, index$2));
      var array$3 = $$this.display2__AO();
      var index$3 = (31 & (newIndex >> 10));
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$3, index$3));
      var array$4 = $$this.display1__AO();
      var index$4 = (31 & (newIndex >> 5));
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$4, index$4));
      break
    }
    case 4: {
      var a$1 = $$this.display4__AO();
      $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$1));
      var array$5 = $$this.display4__AO();
      var index$5 = (31 & (newIndex >> 20));
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$5, index$5));
      var array$6 = $$this.display3__AO();
      var index$6 = (31 & (newIndex >> 15));
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$6, index$6));
      var array$7 = $$this.display2__AO();
      var index$7 = (31 & (newIndex >> 10));
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$7, index$7));
      var array$8 = $$this.display1__AO();
      var index$8 = (31 & (newIndex >> 5));
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$8, index$8));
      break
    }
    case 3: {
      var a$2 = $$this.display3__AO();
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$2));
      var array$9 = $$this.display3__AO();
      var index$9 = (31 & (newIndex >> 15));
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$9, index$9));
      var array$10 = $$this.display2__AO();
      var index$10 = (31 & (newIndex >> 10));
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$10, index$10));
      var array$11 = $$this.display1__AO();
      var index$11 = (31 & (newIndex >> 5));
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$11, index$11));
      break
    }
    case 2: {
      var a$3 = $$this.display2__AO();
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$3));
      var array$12 = $$this.display2__AO();
      var index$12 = (31 & (newIndex >> 10));
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$12, index$12));
      var array$13 = $$this.display1__AO();
      var index$13 = (31 & (newIndex >> 5));
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$13, index$13));
      break
    }
    case 1: {
      var a$4 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$4));
      var array$14 = $$this.display1__AO();
      var index$14 = (31 & (newIndex >> 5));
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$14, index$14));
      break
    }
    case 0: {
      var a$5 = $$this.display0__AO();
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$5));
      break
    }
    default: {
      throw new $c_s_MatchError().init___O(x1)
    }
  }
}
function $s_sci_VectorPointer$class__debug__sci_VectorPointer__V($$this) {
  return (void 0)
}
function $s_sci_VectorPointer$class__stabilize__sci_VectorPointer__I__V($$this, index) {
  var x1 = (((-1) + $$this.depth__I()) | 0);
  switch (x1) {
    case 5: {
      var a = $$this.display5__AO();
      $$this.display5$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a));
      var a$1 = $$this.display4__AO();
      $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$1));
      var a$2 = $$this.display3__AO();
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$2));
      var a$3 = $$this.display2__AO();
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$3));
      var a$4 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$4));
      $$this.display5__AO().u[(31 & (index >> 25))] = $$this.display4__AO();
      $$this.display4__AO().u[(31 & (index >> 20))] = $$this.display3__AO();
      $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO();
      $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
      $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
      break
    }
    case 4: {
      var a$5 = $$this.display4__AO();
      $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$5));
      var a$6 = $$this.display3__AO();
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$6));
      var a$7 = $$this.display2__AO();
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$7));
      var a$8 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$8));
      $$this.display4__AO().u[(31 & (index >> 20))] = $$this.display3__AO();
      $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO();
      $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
      $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
      break
    }
    case 3: {
      var a$9 = $$this.display3__AO();
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$9));
      var a$10 = $$this.display2__AO();
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$10));
      var a$11 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$11));
      $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO();
      $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
      $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
      break
    }
    case 2: {
      var a$12 = $$this.display2__AO();
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$12));
      var a$13 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$13));
      $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
      $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
      break
    }
    case 1: {
      var a$14 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$14));
      $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
      break
    }
    case 0: {
      break
    }
    default: {
      throw new $c_s_MatchError().init___O(x1)
    }
  }
}
function $s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array, index) {
  var x = array.u[index];
  array.u[index] = null;
  var a = $asArrayOf_O(x, 1);
  return $s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a)
}
function $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V($$this, that, depth) {
  $$this.depth$und$eq__I__V(depth);
  var x1 = (((-1) + depth) | 0);
  switch (x1) {
    case (-1): {
      break
    }
    case 0: {
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 1: {
      $$this.display1$und$eq__AO__V(that.display1__AO());
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 2: {
      $$this.display2$und$eq__AO__V(that.display2__AO());
      $$this.display1$und$eq__AO__V(that.display1__AO());
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 3: {
      $$this.display3$und$eq__AO__V(that.display3__AO());
      $$this.display2$und$eq__AO__V(that.display2__AO());
      $$this.display1$und$eq__AO__V(that.display1__AO());
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 4: {
      $$this.display4$und$eq__AO__V(that.display4__AO());
      $$this.display3$und$eq__AO__V(that.display3__AO());
      $$this.display2$und$eq__AO__V(that.display2__AO());
      $$this.display1$und$eq__AO__V(that.display1__AO());
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 5: {
      $$this.display5$und$eq__AO__V(that.display5__AO());
      $$this.display4$und$eq__AO__V(that.display4__AO());
      $$this.display3$und$eq__AO__V(that.display3__AO());
      $$this.display2$und$eq__AO__V(that.display2__AO());
      $$this.display1$und$eq__AO__V(that.display1__AO());
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    default: {
      throw new $c_s_MatchError().init___O(x1)
    }
  }
}
function $s_sci_VectorPointer$class__gotoNextBlockStart__sci_VectorPointer__I__I__V($$this, index, xor) {
  if ((xor < 1024)) {
    $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
  } else if ((xor < 32768)) {
    $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1));
    $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[0], 1))
  } else if ((xor < 1048576)) {
    $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (index >> 15))], 1));
    $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[0], 1));
    $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[0], 1))
  } else if ((xor < 33554432)) {
    $$this.display3$und$eq__AO__V($asArrayOf_O($$this.display4__AO().u[(31 & (index >> 20))], 1));
    $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[0], 1));
    $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[0], 1));
    $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[0], 1))
  } else if ((xor < 1073741824)) {
    $$this.display4$und$eq__AO__V($asArrayOf_O($$this.display5__AO().u[(31 & (index >> 25))], 1));
    $$this.display3$und$eq__AO__V($asArrayOf_O($$this.display4__AO().u[0], 1));
    $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[0], 1));
    $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[0], 1));
    $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[0], 1))
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
}
function $s_sci_VectorPointer$class__gotoPos__sci_VectorPointer__I__I__V($$this, index, xor) {
  if ((xor >= 32)) {
    if ((xor < 1024)) {
      $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
    } else if ((xor < 32768)) {
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1));
      $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
    } else if ((xor < 1048576)) {
      $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (index >> 15))], 1));
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1));
      $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
    } else if ((xor < 33554432)) {
      $$this.display3$und$eq__AO__V($asArrayOf_O($$this.display4__AO().u[(31 & (index >> 20))], 1));
      $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (index >> 15))], 1));
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1));
      $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
    } else if ((xor < 1073741824)) {
      $$this.display4$und$eq__AO__V($asArrayOf_O($$this.display5__AO().u[(31 & (index >> 25))], 1));
      $$this.display3$und$eq__AO__V($asArrayOf_O($$this.display4__AO().u[(31 & (index >> 20))], 1));
      $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (index >> 15))], 1));
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1));
      $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
    } else {
      throw new $c_jl_IllegalArgumentException().init___()
    }
  }
}
function $s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a) {
  if ((a === null)) {
    var this$2 = $m_s_Console$();
    var this$3 = this$2.outVar$2;
    $as_Ljava_io_PrintStream(this$3.tl$1.get__O()).println__O__V("NULL")
  };
  var b = $newArrayObject($d_O.getArrayOf(), [a.u["length"]]);
  var length = a.u["length"];
  $systemArraycopy(a, 0, b, 0, length);
  return b
}
function $s_sci_VectorPointer$class__gotoPosWritable1__sci_VectorPointer__I__I__I__V($$this, oldIndex, newIndex, xor) {
  if ((xor < 32)) {
    var a = $$this.display0__AO();
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a))
  } else if ((xor < 1024)) {
    var a$1 = $$this.display1__AO();
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$1));
    $$this.display1__AO().u[(31 & (oldIndex >> 5))] = $$this.display0__AO();
    var array = $$this.display1__AO();
    var index = (31 & (newIndex >> 5));
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array, index))
  } else if ((xor < 32768)) {
    var a$2 = $$this.display1__AO();
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$2));
    var a$3 = $$this.display2__AO();
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$3));
    $$this.display1__AO().u[(31 & (oldIndex >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (oldIndex >> 10))] = $$this.display1__AO();
    var array$1 = $$this.display2__AO();
    var index$1 = (31 & (newIndex >> 10));
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$1, index$1));
    var array$2 = $$this.display1__AO();
    var index$2 = (31 & (newIndex >> 5));
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$2, index$2))
  } else if ((xor < 1048576)) {
    var a$4 = $$this.display1__AO();
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$4));
    var a$5 = $$this.display2__AO();
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$5));
    var a$6 = $$this.display3__AO();
    $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$6));
    $$this.display1__AO().u[(31 & (oldIndex >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (oldIndex >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (oldIndex >> 15))] = $$this.display2__AO();
    var array$3 = $$this.display3__AO();
    var index$3 = (31 & (newIndex >> 15));
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$3, index$3));
    var array$4 = $$this.display2__AO();
    var index$4 = (31 & (newIndex >> 10));
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$4, index$4));
    var array$5 = $$this.display1__AO();
    var index$5 = (31 & (newIndex >> 5));
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$5, index$5))
  } else if ((xor < 33554432)) {
    var a$7 = $$this.display1__AO();
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$7));
    var a$8 = $$this.display2__AO();
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$8));
    var a$9 = $$this.display3__AO();
    $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$9));
    var a$10 = $$this.display4__AO();
    $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$10));
    $$this.display1__AO().u[(31 & (oldIndex >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (oldIndex >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (oldIndex >> 15))] = $$this.display2__AO();
    $$this.display4__AO().u[(31 & (oldIndex >> 20))] = $$this.display3__AO();
    var array$6 = $$this.display4__AO();
    var index$6 = (31 & (newIndex >> 20));
    $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$6, index$6));
    var array$7 = $$this.display3__AO();
    var index$7 = (31 & (newIndex >> 15));
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$7, index$7));
    var array$8 = $$this.display2__AO();
    var index$8 = (31 & (newIndex >> 10));
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$8, index$8));
    var array$9 = $$this.display1__AO();
    var index$9 = (31 & (newIndex >> 5));
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$9, index$9))
  } else if ((xor < 1073741824)) {
    var a$11 = $$this.display1__AO();
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$11));
    var a$12 = $$this.display2__AO();
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$12));
    var a$13 = $$this.display3__AO();
    $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$13));
    var a$14 = $$this.display4__AO();
    $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$14));
    var a$15 = $$this.display5__AO();
    $$this.display5$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$15));
    $$this.display1__AO().u[(31 & (oldIndex >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (oldIndex >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (oldIndex >> 15))] = $$this.display2__AO();
    $$this.display4__AO().u[(31 & (oldIndex >> 20))] = $$this.display3__AO();
    $$this.display5__AO().u[(31 & (oldIndex >> 25))] = $$this.display4__AO();
    var array$10 = $$this.display5__AO();
    var index$10 = (31 & (newIndex >> 25));
    $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$10, index$10));
    var array$11 = $$this.display4__AO();
    var index$11 = (31 & (newIndex >> 20));
    $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$11, index$11));
    var array$12 = $$this.display3__AO();
    var index$12 = (31 & (newIndex >> 15));
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$12, index$12));
    var array$13 = $$this.display2__AO();
    var index$13 = (31 & (newIndex >> 10));
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$13, index$13));
    var array$14 = $$this.display1__AO();
    var index$14 = (31 & (newIndex >> 5));
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$14, index$14))
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
}
function $s_sci_VectorPointer$class__copyRange__sci_VectorPointer__AO__I__I__AO($$this, array, oldLeft, newLeft) {
  var elems = $newArrayObject($d_O.getArrayOf(), [32]);
  var length = ((32 - ((newLeft > oldLeft) ? newLeft : oldLeft)) | 0);
  $systemArraycopy(array, oldLeft, elems, newLeft, length);
  return elems
}
function $s_sci_VectorPointer$class__gotoFreshPosWritable0__sci_VectorPointer__I__I__I__V($$this, oldIndex, newIndex, xor) {
  if ((xor >= 32)) {
    if ((xor < 1024)) {
      if (($$this.depth__I() === 1)) {
        $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display1__AO().u[(31 & (oldIndex >> 5))] = $$this.display0__AO();
        $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
      };
      $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
    } else if ((xor < 32768)) {
      if (($$this.depth__I() === 2)) {
        $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display2__AO().u[(31 & (oldIndex >> 10))] = $$this.display1__AO();
        $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
      };
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (newIndex >> 10))], 1));
      if (($$this.display1__AO() === null)) {
        $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
    } else if ((xor < 1048576)) {
      if (($$this.depth__I() === 3)) {
        $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display3__AO().u[(31 & (oldIndex >> 15))] = $$this.display2__AO();
        $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
      };
      $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (newIndex >> 15))], 1));
      if (($$this.display2__AO() === null)) {
        $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (newIndex >> 10))], 1));
      if (($$this.display1__AO() === null)) {
        $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
    } else if ((xor < 33554432)) {
      if (($$this.depth__I() === 4)) {
        $$this.display4$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display4__AO().u[(31 & (oldIndex >> 20))] = $$this.display3__AO();
        $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
      };
      $$this.display3$und$eq__AO__V($asArrayOf_O($$this.display4__AO().u[(31 & (newIndex >> 20))], 1));
      if (($$this.display3__AO() === null)) {
        $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (newIndex >> 15))], 1));
      if (($$this.display2__AO() === null)) {
        $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (newIndex >> 10))], 1));
      if (($$this.display1__AO() === null)) {
        $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
    } else if ((xor < 1073741824)) {
      if (($$this.depth__I() === 5)) {
        $$this.display5$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display5__AO().u[(31 & (oldIndex >> 25))] = $$this.display4__AO();
        $$this.display4$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
      };
      $$this.display4$und$eq__AO__V($asArrayOf_O($$this.display5__AO().u[(31 & (newIndex >> 20))], 1));
      if (($$this.display4__AO() === null)) {
        $$this.display4$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display3$und$eq__AO__V($asArrayOf_O($$this.display4__AO().u[(31 & (newIndex >> 20))], 1));
      if (($$this.display3__AO() === null)) {
        $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (newIndex >> 15))], 1));
      if (($$this.display2__AO() === null)) {
        $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (newIndex >> 10))], 1));
      if (($$this.display1__AO() === null)) {
        $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
    } else {
      throw new $c_jl_IllegalArgumentException().init___()
    }
  }
}
/** @constructor */
function $c_sci_WrappedString$() {
  $c_O.call(this)
}
$c_sci_WrappedString$.prototype = new $h_O();
$c_sci_WrappedString$.prototype.constructor = $c_sci_WrappedString$;
/** @constructor */
function $h_sci_WrappedString$() {
  /*<skip>*/
}
$h_sci_WrappedString$.prototype = $c_sci_WrappedString$.prototype;
$c_sci_WrappedString$.prototype.newBuilder__scm_Builder = (function() {
  var this$2 = new $c_scm_StringBuilder().init___();
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(x$2) {
      var x = $as_T(x$2);
      return new $c_sci_WrappedString().init___T(x)
    })
  })(this));
  return new $c_scm_Builder$$anon$1().init___scm_Builder__F1(this$2, f)
});
var $d_sci_WrappedString$ = new $TypeData().initClass({
  sci_WrappedString$: 0
}, false, "scala.collection.immutable.WrappedString$", {
  sci_WrappedString$: 1,
  O: 1
});
$c_sci_WrappedString$.prototype.$classData = $d_sci_WrappedString$;
var $n_sci_WrappedString$ = (void 0);
function $m_sci_WrappedString$() {
  if ((!$n_sci_WrappedString$)) {
    $n_sci_WrappedString$ = new $c_sci_WrappedString$().init___()
  };
  return $n_sci_WrappedString$
}
function $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__V($$this, coll) {
  if ($is_sc_IndexedSeqLike(coll)) {
    $$this.sizeHint__I__V(coll.size__I())
  }
}
function $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V($$this, size, boundingColl) {
  if ($is_sc_IndexedSeqLike(boundingColl)) {
    var that = boundingColl.size__I();
    $$this.sizeHint__I__V(((size < that) ? size : that))
  }
}
/** @constructor */
function $c_scm_FlatHashTable$() {
  $c_O.call(this)
}
$c_scm_FlatHashTable$.prototype = new $h_O();
$c_scm_FlatHashTable$.prototype.constructor = $c_scm_FlatHashTable$;
/** @constructor */
function $h_scm_FlatHashTable$() {
  /*<skip>*/
}
$h_scm_FlatHashTable$.prototype = $c_scm_FlatHashTable$.prototype;
$c_scm_FlatHashTable$.prototype.newThreshold__I__I__I = (function(_loadFactor, size) {
  var assertion = (_loadFactor < 500);
  if ((!assertion)) {
    throw new $c_jl_AssertionError().init___O(("assertion failed: " + "loadFactor too large; must be < 0.5"))
  };
  return new $c_sjsr_RuntimeLong().init___I(size).$$times__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(_loadFactor)).$$div__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I__I__I(1000, 0, 0)).toInt__I()
});
var $d_scm_FlatHashTable$ = new $TypeData().initClass({
  scm_FlatHashTable$: 0
}, false, "scala.collection.mutable.FlatHashTable$", {
  scm_FlatHashTable$: 1,
  O: 1
});
$c_scm_FlatHashTable$.prototype.$classData = $d_scm_FlatHashTable$;
var $n_scm_FlatHashTable$ = (void 0);
function $m_scm_FlatHashTable$() {
  if ((!$n_scm_FlatHashTable$)) {
    $n_scm_FlatHashTable$ = new $c_scm_FlatHashTable$().init___()
  };
  return $n_scm_FlatHashTable$
}
function $s_scm_FlatHashTable$HashUtils$class__improve__scm_FlatHashTable$HashUtils__I__I__I($$this, hcode, seed) {
  var improved = $m_s_util_hashing_package$().byteswap32__I__I(hcode);
  var rotation = (seed % 32);
  var rotated = (((improved >>> rotation) | 0) | (improved << ((32 - rotation) | 0)));
  return rotated
}
function $s_scm_FlatHashTable$HashUtils$class__entryToElem__scm_FlatHashTable$HashUtils__O__O($$this, entry) {
  return ((entry === $m_scm_FlatHashTable$NullSentinel$()) ? null : entry)
}
function $s_scm_FlatHashTable$HashUtils$class__elemToEntry__scm_FlatHashTable$HashUtils__O__O($$this, elem) {
  return ((elem === null) ? $m_scm_FlatHashTable$NullSentinel$() : elem)
}
/** @constructor */
function $c_scm_FlatHashTable$NullSentinel$() {
  $c_O.call(this)
}
$c_scm_FlatHashTable$NullSentinel$.prototype = new $h_O();
$c_scm_FlatHashTable$NullSentinel$.prototype.constructor = $c_scm_FlatHashTable$NullSentinel$;
/** @constructor */
function $h_scm_FlatHashTable$NullSentinel$() {
  /*<skip>*/
}
$h_scm_FlatHashTable$NullSentinel$.prototype = $c_scm_FlatHashTable$NullSentinel$.prototype;
$c_scm_FlatHashTable$NullSentinel$.prototype.toString__T = (function() {
  return "NullSentinel"
});
$c_scm_FlatHashTable$NullSentinel$.prototype.hashCode__I = (function() {
  return 0
});
var $d_scm_FlatHashTable$NullSentinel$ = new $TypeData().initClass({
  scm_FlatHashTable$NullSentinel$: 0
}, false, "scala.collection.mutable.FlatHashTable$NullSentinel$", {
  scm_FlatHashTable$NullSentinel$: 1,
  O: 1
});
$c_scm_FlatHashTable$NullSentinel$.prototype.$classData = $d_scm_FlatHashTable$NullSentinel$;
var $n_scm_FlatHashTable$NullSentinel$ = (void 0);
function $m_scm_FlatHashTable$NullSentinel$() {
  if ((!$n_scm_FlatHashTable$NullSentinel$)) {
    $n_scm_FlatHashTable$NullSentinel$ = new $c_scm_FlatHashTable$NullSentinel$().init___()
  };
  return $n_scm_FlatHashTable$NullSentinel$
}
function $s_scm_FlatHashTable$class__growTable__p0__scm_FlatHashTable__V($$this) {
  var oldtable = $$this.table$5;
  $$this.table$5 = $newArrayObject($d_O.getArrayOf(), [$imul(2, $$this.table$5.u["length"])]);
  $$this.tableSize$5 = 0;
  var tableLength = $$this.table$5.u["length"];
  $s_scm_FlatHashTable$class__nnSizeMapReset__scm_FlatHashTable__I__V($$this, tableLength);
  $$this.seedvalue$5 = $s_scm_FlatHashTable$class__tableSizeSeed__scm_FlatHashTable__I($$this);
  $$this.threshold$5 = $m_scm_FlatHashTable$().newThreshold__I__I__I($$this.$$undloadFactor$5, $$this.table$5.u["length"]);
  var i = 0;
  while ((i < oldtable.u["length"])) {
    var entry = oldtable.u[i];
    if ((entry !== null)) {
      $s_scm_FlatHashTable$class__addEntry__scm_FlatHashTable__O__Z($$this, entry)
    };
    i = ((1 + i) | 0)
  }
}
function $s_scm_FlatHashTable$class__calcSizeMapSize__scm_FlatHashTable__I__I($$this, tableLength) {
  return ((1 + (tableLength >> 5)) | 0)
}
function $s_scm_FlatHashTable$class__nnSizeMapAdd__scm_FlatHashTable__I__V($$this, h) {
  if (($$this.sizemap$5 !== null)) {
    var p = (h >> 5);
    var ev$1 = $$this.sizemap$5;
    ev$1.u[p] = ((1 + ev$1.u[p]) | 0)
  }
}
function $s_scm_FlatHashTable$class__$$init$__scm_FlatHashTable__V($$this) {
  $$this.$$undloadFactor$5 = 450;
  $$this.table$5 = $newArrayObject($d_O.getArrayOf(), [$s_scm_FlatHashTable$class__capacity__scm_FlatHashTable__I__I($$this, 32)]);
  $$this.tableSize$5 = 0;
  $$this.threshold$5 = $m_scm_FlatHashTable$().newThreshold__I__I__I($$this.$$undloadFactor$5, $s_scm_FlatHashTable$class__capacity__scm_FlatHashTable__I__I($$this, 32));
  $$this.sizemap$5 = null;
  $$this.seedvalue$5 = $s_scm_FlatHashTable$class__tableSizeSeed__scm_FlatHashTable__I($$this)
}
function $s_scm_FlatHashTable$class__findElemImpl__p0__scm_FlatHashTable__O__O($$this, elem) {
  var searchEntry = $s_scm_FlatHashTable$HashUtils$class__elemToEntry__scm_FlatHashTable$HashUtils__O__O($$this, elem);
  var hcode = $objectHashCode(searchEntry);
  var h = $s_scm_FlatHashTable$class__index__scm_FlatHashTable__I__I($$this, hcode);
  var curEntry = $$this.table$5.u[h];
  while (((curEntry !== null) && (!$m_sr_BoxesRunTime$().equals__O__O__Z(curEntry, searchEntry)))) {
    h = (((1 + h) | 0) % $$this.table$5.u["length"]);
    curEntry = $$this.table$5.u[h]
  };
  return curEntry
}
function $s_scm_FlatHashTable$class__addEntry__scm_FlatHashTable__O__Z($$this, newEntry) {
  var hcode = $objectHashCode(newEntry);
  var h = $s_scm_FlatHashTable$class__index__scm_FlatHashTable__I__I($$this, hcode);
  var curEntry = $$this.table$5.u[h];
  while ((curEntry !== null)) {
    if ($m_sr_BoxesRunTime$().equals__O__O__Z(curEntry, newEntry)) {
      return false
    };
    h = (((1 + h) | 0) % $$this.table$5.u["length"]);
    curEntry = $$this.table$5.u[h]
  };
  $$this.table$5.u[h] = newEntry;
  $$this.tableSize$5 = ((1 + $$this.tableSize$5) | 0);
  var h$1 = h;
  $s_scm_FlatHashTable$class__nnSizeMapAdd__scm_FlatHashTable__I__V($$this, h$1);
  if (($$this.tableSize$5 >= $$this.threshold$5)) {
    $s_scm_FlatHashTable$class__growTable__p0__scm_FlatHashTable__V($$this)
  };
  return true
}
function $s_scm_FlatHashTable$class__addElem__scm_FlatHashTable__O__Z($$this, elem) {
  var newEntry = $s_scm_FlatHashTable$HashUtils$class__elemToEntry__scm_FlatHashTable$HashUtils__O__O($$this, elem);
  return $s_scm_FlatHashTable$class__addEntry__scm_FlatHashTable__O__Z($$this, newEntry)
}
function $s_scm_FlatHashTable$class__index__scm_FlatHashTable__I__I($$this, hcode) {
  var seed = $$this.seedvalue$5;
  var improved = $s_scm_FlatHashTable$HashUtils$class__improve__scm_FlatHashTable$HashUtils__I__I__I($$this, hcode, seed);
  var ones = (((-1) + $$this.table$5.u["length"]) | 0);
  return (((improved >>> ((32 - $m_jl_Integer$().bitCount__I__I(ones)) | 0)) | 0) & ones)
}
function $s_scm_FlatHashTable$class__capacity__scm_FlatHashTable__I__I($$this, expectedSize) {
  return ((expectedSize === 0) ? 1 : $m_scm_HashTable$().powerOfTwo__I__I(expectedSize))
}
function $s_scm_FlatHashTable$class__tableSizeSeed__scm_FlatHashTable__I($$this) {
  return $m_jl_Integer$().bitCount__I__I((((-1) + $$this.table$5.u["length"]) | 0))
}
function $s_scm_FlatHashTable$class__nnSizeMapReset__scm_FlatHashTable__I__V($$this, tableLength) {
  if (($$this.sizemap$5 !== null)) {
    var nsize = $s_scm_FlatHashTable$class__calcSizeMapSize__scm_FlatHashTable__I__I($$this, tableLength);
    if (($$this.sizemap$5.u["length"] !== nsize)) {
      $$this.sizemap$5 = $newArrayObject($d_I.getArrayOf(), [nsize])
    } else {
      $m_ju_Arrays$().fill__AI__I__V($$this.sizemap$5, 0)
    }
  }
}
function $s_scm_FlatHashTable$class__initWithContents__scm_FlatHashTable__scm_FlatHashTable$Contents__V($$this, c) {
  if ((c !== null)) {
    $$this.$$undloadFactor$5 = c.loadFactor__I();
    $$this.table$5 = c.table__AO();
    $$this.tableSize$5 = c.tableSize__I();
    $$this.threshold$5 = c.threshold__I();
    $$this.seedvalue$5 = c.seedvalue__I();
    $$this.sizemap$5 = c.sizemap__AI()
  }
}
function $s_scm_FlatHashTable$class__containsElem__scm_FlatHashTable__O__Z($$this, elem) {
  return ($s_scm_FlatHashTable$class__findElemImpl__p0__scm_FlatHashTable__O__O($$this, elem) !== null)
}
/** @constructor */
function $c_scm_HashTable$() {
  $c_O.call(this)
}
$c_scm_HashTable$.prototype = new $h_O();
$c_scm_HashTable$.prototype.constructor = $c_scm_HashTable$;
/** @constructor */
function $h_scm_HashTable$() {
  /*<skip>*/
}
$h_scm_HashTable$.prototype = $c_scm_HashTable$.prototype;
$c_scm_HashTable$.prototype.powerOfTwo__I__I = (function(target) {
  var c = (((-1) + target) | 0);
  c = (c | ((c >>> 1) | 0));
  c = (c | ((c >>> 2) | 0));
  c = (c | ((c >>> 4) | 0));
  c = (c | ((c >>> 8) | 0));
  c = (c | ((c >>> 16) | 0));
  return ((1 + c) | 0)
});
var $d_scm_HashTable$ = new $TypeData().initClass({
  scm_HashTable$: 0
}, false, "scala.collection.mutable.HashTable$", {
  scm_HashTable$: 1,
  O: 1
});
$c_scm_HashTable$.prototype.$classData = $d_scm_HashTable$;
var $n_scm_HashTable$ = (void 0);
function $m_scm_HashTable$() {
  if ((!$n_scm_HashTable$)) {
    $n_scm_HashTable$ = new $c_scm_HashTable$().init___()
  };
  return $n_scm_HashTable$
}
function $s_scm_ResizableArray$class__copyToArray__scm_ResizableArray__O__I__I__V($$this, xs, start, len) {
  var that = (($m_sr_ScalaRunTime$().array$undlength__O__I(xs) - start) | 0);
  var $$this$1 = ((len < that) ? len : that);
  var that$1 = $$this.size0$6;
  var len1 = (($$this$1 < that$1) ? $$this$1 : that$1);
  $m_s_Array$().copy__O__I__O__I__I__V($$this.array$6, 0, xs, start, len1)
}
function $s_scm_ResizableArray$class__ensureSize__scm_ResizableArray__I__V($$this, n) {
  var x = $$this.array$6.u["length"];
  var arrayLength = new $c_sjsr_RuntimeLong().init___I(x);
  if (new $c_sjsr_RuntimeLong().init___I(n).$$greater__sjsr_RuntimeLong__Z(arrayLength)) {
    var newSize = new $c_sjsr_RuntimeLong().init___I__I__I(2, 0, 0).$$times__sjsr_RuntimeLong__sjsr_RuntimeLong(arrayLength);
    while (new $c_sjsr_RuntimeLong().init___I(n).$$greater__sjsr_RuntimeLong__Z(newSize)) {
      newSize = new $c_sjsr_RuntimeLong().init___I__I__I(2, 0, 0).$$times__sjsr_RuntimeLong__sjsr_RuntimeLong(newSize)
    };
    if (newSize.$$greater__sjsr_RuntimeLong__Z(new $c_sjsr_RuntimeLong().init___I__I__I(4194303, 511, 0))) {
      newSize = new $c_sjsr_RuntimeLong().init___I__I__I(4194303, 511, 0)
    };
    var newArray = $newArrayObject($d_O.getArrayOf(), [newSize.toInt__I()]);
    var src = $$this.array$6;
    var length = $$this.size0$6;
    $systemArraycopy(src, 0, newArray, 0, length);
    $$this.array$6 = newArray
  }
}
function $s_scm_ResizableArray$class__foreach__scm_ResizableArray__F1__V($$this, f) {
  var i = 0;
  var top = $$this.size0$6;
  while ((i < top)) {
    f.apply__O__O($$this.array$6.u[i]);
    i = ((1 + i) | 0)
  }
}
function $s_scm_ResizableArray$class__apply__scm_ResizableArray__I__O($$this, idx) {
  if ((idx >= $$this.size0$6)) {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + idx))
  };
  return $$this.array$6.u[idx]
}
function $s_scm_ResizableArray$class__$$init$__scm_ResizableArray__V($$this) {
  var x = $$this.initialSize$6;
  $$this.array$6 = $newArrayObject($d_O.getArrayOf(), [((x > 1) ? x : 1)]);
  $$this.size0$6 = 0
}
/** @constructor */
function $c_sjs_js_Dictionary$() {
  $c_O.call(this)
}
$c_sjs_js_Dictionary$.prototype = new $h_O();
$c_sjs_js_Dictionary$.prototype.constructor = $c_sjs_js_Dictionary$;
/** @constructor */
function $h_sjs_js_Dictionary$() {
  /*<skip>*/
}
$h_sjs_js_Dictionary$.prototype = $c_sjs_js_Dictionary$.prototype;
$c_sjs_js_Dictionary$.prototype.empty__sjs_js_Dictionary = (function() {
  return {}
});
var $d_sjs_js_Dictionary$ = new $TypeData().initClass({
  sjs_js_Dictionary$: 0
}, false, "scala.scalajs.js.Dictionary$", {
  sjs_js_Dictionary$: 1,
  O: 1
});
$c_sjs_js_Dictionary$.prototype.$classData = $d_sjs_js_Dictionary$;
var $n_sjs_js_Dictionary$ = (void 0);
function $m_sjs_js_Dictionary$() {
  if ((!$n_sjs_js_Dictionary$)) {
    $n_sjs_js_Dictionary$ = new $c_sjs_js_Dictionary$().init___()
  };
  return $n_sjs_js_Dictionary$
}
/** @constructor */
function $c_sjsr_Bits$() {
  $c_O.call(this);
  this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f = false;
  this.arrayBuffer$1 = null;
  this.int32Array$1 = null;
  this.float32Array$1 = null;
  this.float64Array$1 = null;
  this.areTypedArraysBigEndian$1 = false;
  this.highOffset$1 = 0;
  this.lowOffset$1 = 0
}
$c_sjsr_Bits$.prototype = new $h_O();
$c_sjsr_Bits$.prototype.constructor = $c_sjsr_Bits$;
/** @constructor */
function $h_sjsr_Bits$() {
  /*<skip>*/
}
$h_sjsr_Bits$.prototype = $c_sjsr_Bits$.prototype;
$c_sjsr_Bits$.prototype.init___ = (function() {
  $n_sjsr_Bits$ = this;
  var x = ((($g["ArrayBuffer"] && $g["Int32Array"]) && $g["Float32Array"]) && $g["Float64Array"]);
  this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f = $uZ((!(!x)));
  this.arrayBuffer$1 = (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f ? new $g["ArrayBuffer"](8) : null);
  this.int32Array$1 = (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f ? new $g["Int32Array"](this.arrayBuffer$1, 0, 2) : null);
  this.float32Array$1 = (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f ? new $g["Float32Array"](this.arrayBuffer$1, 0, 2) : null);
  this.float64Array$1 = (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f ? new $g["Float64Array"](this.arrayBuffer$1, 0, 1) : null);
  if ((!this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f)) {
    var jsx$1 = true
  } else {
    this.int32Array$1[0] = 16909060;
    var jsx$1 = ($uB(new $g["Int8Array"](this.arrayBuffer$1, 0, 8)[0]) === 1)
  };
  this.areTypedArraysBigEndian$1 = jsx$1;
  this.highOffset$1 = (this.areTypedArraysBigEndian$1 ? 0 : 1);
  this.lowOffset$1 = (this.areTypedArraysBigEndian$1 ? 1 : 0);
  return this
});
$c_sjsr_Bits$.prototype.numberHashCode__D__I = (function(value) {
  var iv = $uI((value | 0));
  if (((iv === value) && ((1.0 / value) !== (-Infinity)))) {
    return iv
  } else {
    var this$1 = this.doubleToLongBits__D__J(value);
    return this$1.$$up__sjsr_RuntimeLong__sjsr_RuntimeLong(this$1.$$greater$greater$greater__I__sjsr_RuntimeLong(32)).toInt__I()
  }
});
$c_sjsr_Bits$.prototype.doubleToLongBitsPolyfill__p1__D__J = (function(value) {
  if ((value !== value)) {
    var _3 = $uD($g["Math"]["pow"](2.0, 51));
    var x1_$_$$und1$1 = false;
    var x1_$_$$und2$1 = 2047;
    var x1_$_$$und3$1 = _3
  } else if (((value === Infinity) || (value === (-Infinity)))) {
    var _1 = (value < 0);
    var x1_$_$$und1$1 = _1;
    var x1_$_$$und2$1 = 2047;
    var x1_$_$$und3$1 = 0.0
  } else if ((value === 0.0)) {
    var _1$1 = ((1 / value) === (-Infinity));
    var x1_$_$$und1$1 = _1$1;
    var x1_$_$$und2$1 = 0;
    var x1_$_$$und3$1 = 0.0
  } else {
    var s = (value < 0);
    var av = (s ? (-value) : value);
    if ((av >= $uD($g["Math"]["pow"](2.0, (-1022))))) {
      var twoPowFbits = $uD($g["Math"]["pow"](2.0, 52));
      var a = ($uD($g["Math"]["log"](av)) / 0.6931471805599453);
      var x = $uD($g["Math"]["floor"](a));
      var a$1 = $uI((x | 0));
      var e = ((a$1 < 1023) ? a$1 : 1023);
      var b = e;
      var n = ((av / $uD($g["Math"]["pow"](2.0, b))) * twoPowFbits);
      var w = $uD($g["Math"]["floor"](n));
      var f = (n - w);
      var f$1 = ((f < 0.5) ? w : ((f > 0.5) ? (1 + w) : (((w % 2) !== 0) ? (1 + w) : w)));
      if (((f$1 / twoPowFbits) >= 2)) {
        e = ((1 + e) | 0);
        f$1 = 1.0
      };
      if ((e > 1023)) {
        e = 2047;
        f$1 = 0.0
      } else {
        e = ((1023 + e) | 0);
        f$1 = (f$1 - twoPowFbits)
      };
      var _2 = e;
      var _3$1 = f$1;
      var x1_$_$$und1$1 = s;
      var x1_$_$$und2$1 = _2;
      var x1_$_$$und3$1 = _3$1
    } else {
      var n$1 = (av / $uD($g["Math"]["pow"](2.0, (-1074))));
      var w$1 = $uD($g["Math"]["floor"](n$1));
      var f$2 = (n$1 - w$1);
      var _3$2 = ((f$2 < 0.5) ? w$1 : ((f$2 > 0.5) ? (1 + w$1) : (((w$1 % 2) !== 0) ? (1 + w$1) : w$1)));
      var x1_$_$$und1$1 = s;
      var x1_$_$$und2$1 = 0;
      var x1_$_$$und3$1 = _3$2
    }
  };
  var s$1 = $uZ(x1_$_$$und1$1);
  var e$1 = $uI(x1_$_$$und2$1);
  var f$3 = $uD(x1_$_$$und3$1);
  var x$1 = (f$3 / 4.294967296E9);
  var hif = $uI((x$1 | 0));
  var hi = (((s$1 ? (-2147483648) : 0) | (e$1 << 20)) | hif);
  var lo = $uI((f$3 | 0));
  return new $c_sjsr_RuntimeLong().init___I(hi).$$less$less__I__sjsr_RuntimeLong(32).$$bar__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I__I__I(4194303, 1023, 0).$$amp__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(lo)))
});
$c_sjsr_Bits$.prototype.doubleToLongBits__D__J = (function(value) {
  if (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f) {
    this.float64Array$1[0] = value;
    return new $c_sjsr_RuntimeLong().init___I($uI(this.int32Array$1[this.highOffset$1])).$$less$less__I__sjsr_RuntimeLong(32).$$bar__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I__I__I(4194303, 1023, 0).$$amp__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I($uI(this.int32Array$1[this.lowOffset$1]))))
  } else {
    return this.doubleToLongBitsPolyfill__p1__D__J(value)
  }
});
var $d_sjsr_Bits$ = new $TypeData().initClass({
  sjsr_Bits$: 0
}, false, "scala.scalajs.runtime.Bits$", {
  sjsr_Bits$: 1,
  O: 1
});
$c_sjsr_Bits$.prototype.$classData = $d_sjsr_Bits$;
var $n_sjsr_Bits$ = (void 0);
function $m_sjsr_Bits$() {
  if ((!$n_sjsr_Bits$)) {
    $n_sjsr_Bits$ = new $c_sjsr_Bits$().init___()
  };
  return $n_sjsr_Bits$
}
/** @constructor */
function $c_sjsr_RuntimeString$() {
  $c_O.call(this);
  this.CASE$undINSENSITIVE$undORDER$1 = null;
  this.bitmap$0$1 = false
}
$c_sjsr_RuntimeString$.prototype = new $h_O();
$c_sjsr_RuntimeString$.prototype.constructor = $c_sjsr_RuntimeString$;
/** @constructor */
function $h_sjsr_RuntimeString$() {
  /*<skip>*/
}
$h_sjsr_RuntimeString$.prototype = $c_sjsr_RuntimeString$.prototype;
$c_sjsr_RuntimeString$.prototype.indexOf__T__I__I__I = (function(thiz, ch, fromIndex) {
  var str = this.fromCodePoint__p1__I__T(ch);
  return $uI(thiz["indexOf"](str, fromIndex))
});
$c_sjsr_RuntimeString$.prototype.valueOf__O__T = (function(value) {
  return ((value === null) ? "null" : $objectToString(value))
});
$c_sjsr_RuntimeString$.prototype.replaceFirst__T__T__T__T = (function(thiz, regex, replacement) {
  if ((thiz === null)) {
    throw new $c_jl_NullPointerException().init___()
  };
  var this$1 = $m_ju_regex_Pattern$();
  var this$2 = this$1.compile__T__I__ju_regex_Pattern(regex, 0);
  return new $c_ju_regex_Matcher().init___ju_regex_Pattern__jl_CharSequence__I__I(this$2, thiz, 0, $uI(thiz["length"])).replaceFirst__T__T(replacement)
});
$c_sjsr_RuntimeString$.prototype.lastIndexOf__T__I__I = (function(thiz, ch) {
  var str = this.fromCodePoint__p1__I__T(ch);
  return $uI(thiz["lastIndexOf"](str))
});
$c_sjsr_RuntimeString$.prototype.indexOf__T__I__I = (function(thiz, ch) {
  var str = this.fromCodePoint__p1__I__T(ch);
  return $uI(thiz["indexOf"](str))
});
$c_sjsr_RuntimeString$.prototype.fromCodePoint__p1__I__T = (function(codePoint) {
  if ((((-65536) & codePoint) === 0)) {
    var array = [codePoint];
    var jsx$2 = $g["String"];
    var jsx$1 = jsx$2["fromCharCode"]["apply"](jsx$2, array);
    return $as_T(jsx$1)
  } else if (((codePoint < 0) || (codePoint > 1114111))) {
    throw new $c_jl_IllegalArgumentException().init___()
  } else {
    var offsetCp = (((-65536) + codePoint) | 0);
    var array$1 = [(55296 | (offsetCp >> 10)), (56320 | (1023 & offsetCp))];
    var jsx$4 = $g["String"];
    var jsx$3 = jsx$4["fromCharCode"]["apply"](jsx$4, array$1);
    return $as_T(jsx$3)
  }
});
$c_sjsr_RuntimeString$.prototype.hashCode__T__I = (function(thiz) {
  var res = 0;
  var mul = 1;
  var i = (((-1) + $uI(thiz["length"])) | 0);
  while ((i >= 0)) {
    var jsx$1 = res;
    var index = i;
    res = ((jsx$1 + $imul((65535 & $uI(thiz["charCodeAt"](index))), mul)) | 0);
    mul = $imul(31, mul);
    i = (((-1) + i) | 0)
  };
  return res
});
var $d_sjsr_RuntimeString$ = new $TypeData().initClass({
  sjsr_RuntimeString$: 0
}, false, "scala.scalajs.runtime.RuntimeString$", {
  sjsr_RuntimeString$: 1,
  O: 1
});
$c_sjsr_RuntimeString$.prototype.$classData = $d_sjsr_RuntimeString$;
var $n_sjsr_RuntimeString$ = (void 0);
function $m_sjsr_RuntimeString$() {
  if ((!$n_sjsr_RuntimeString$)) {
    $n_sjsr_RuntimeString$ = new $c_sjsr_RuntimeString$().init___()
  };
  return $n_sjsr_RuntimeString$
}
/** @constructor */
function $c_sjsr_StackTrace$() {
  $c_O.call(this);
  this.isRhino$1 = false;
  this.decompressedClasses$1 = null;
  this.decompressedPrefixes$1 = null;
  this.compressedPrefixes$1 = null;
  this.bitmap$0$1 = false
}
$c_sjsr_StackTrace$.prototype = new $h_O();
$c_sjsr_StackTrace$.prototype.constructor = $c_sjsr_StackTrace$;
/** @constructor */
function $h_sjsr_StackTrace$() {
  /*<skip>*/
}
$h_sjsr_StackTrace$.prototype = $c_sjsr_StackTrace$.prototype;
$c_sjsr_StackTrace$.prototype.init___ = (function() {
  $n_sjsr_StackTrace$ = this;
  var dict = {
    "O": "java_lang_Object",
    "T": "java_lang_String",
    "V": "scala_Unit",
    "Z": "scala_Boolean",
    "C": "scala_Char",
    "B": "scala_Byte",
    "S": "scala_Short",
    "I": "scala_Int",
    "J": "scala_Long",
    "F": "scala_Float",
    "D": "scala_Double"
  };
  var index = 0;
  while ((index <= 22)) {
    if ((index >= 2)) {
      dict[("T" + index)] = ("scala_Tuple" + index)
    };
    dict[("F" + index)] = ("scala_Function" + index);
    index = ((1 + index) | 0)
  };
  this.decompressedClasses$1 = dict;
  this.decompressedPrefixes$1 = {
    "sjsr_": "scala_scalajs_runtime_",
    "sjs_": "scala_scalajs_",
    "sci_": "scala_collection_immutable_",
    "scm_": "scala_collection_mutable_",
    "scg_": "scala_collection_generic_",
    "sc_": "scala_collection_",
    "sr_": "scala_runtime_",
    "s_": "scala_",
    "jl_": "java_lang_",
    "ju_": "java_util_"
  };
  this.compressedPrefixes$1 = $g["Object"]["keys"](this.decompressedPrefixes$1);
  return this
});
$c_sjsr_StackTrace$.prototype.createException__p1__O = (function() {
  try {
    return this["undef"]()
  } catch (e) {
    var e$2 = $m_sjsr_package$().wrapJavaScriptException__O__jl_Throwable(e);
    if ((e$2 !== null)) {
      if ($is_sjs_js_JavaScriptException(e$2)) {
        var x5 = $as_sjs_js_JavaScriptException(e$2);
        var e$3 = x5.exception$4;
        return e$3
      } else {
        throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(e$2)
      }
    } else {
      throw e
    }
  }
});
$c_sjsr_StackTrace$.prototype.captureState__jl_Throwable__O__V = (function(throwable, e) {
  throwable["stackdata"] = e
});
var $d_sjsr_StackTrace$ = new $TypeData().initClass({
  sjsr_StackTrace$: 0
}, false, "scala.scalajs.runtime.StackTrace$", {
  sjsr_StackTrace$: 1,
  O: 1
});
$c_sjsr_StackTrace$.prototype.$classData = $d_sjsr_StackTrace$;
var $n_sjsr_StackTrace$ = (void 0);
function $m_sjsr_StackTrace$() {
  if ((!$n_sjsr_StackTrace$)) {
    $n_sjsr_StackTrace$ = new $c_sjsr_StackTrace$().init___()
  };
  return $n_sjsr_StackTrace$
}
/** @constructor */
function $c_sjsr_package$() {
  $c_O.call(this)
}
$c_sjsr_package$.prototype = new $h_O();
$c_sjsr_package$.prototype.constructor = $c_sjsr_package$;
/** @constructor */
function $h_sjsr_package$() {
  /*<skip>*/
}
$h_sjsr_package$.prototype = $c_sjsr_package$.prototype;
$c_sjsr_package$.prototype.unwrapJavaScriptException__jl_Throwable__O = (function(th) {
  if ($is_sjs_js_JavaScriptException(th)) {
    var x2 = $as_sjs_js_JavaScriptException(th);
    var e = x2.exception$4;
    return e
  } else {
    return th
  }
});
$c_sjsr_package$.prototype.wrapJavaScriptException__O__jl_Throwable = (function(e) {
  if ($is_jl_Throwable(e)) {
    var x2 = $as_jl_Throwable(e);
    return x2
  } else {
    return new $c_sjs_js_JavaScriptException().init___O(e)
  }
});
var $d_sjsr_package$ = new $TypeData().initClass({
  sjsr_package$: 0
}, false, "scala.scalajs.runtime.package$", {
  sjsr_package$: 1,
  O: 1
});
$c_sjsr_package$.prototype.$classData = $d_sjsr_package$;
var $n_sjsr_package$ = (void 0);
function $m_sjsr_package$() {
  if ((!$n_sjsr_package$)) {
    $n_sjsr_package$ = new $c_sjsr_package$().init___()
  };
  return $n_sjsr_package$
}
function $isArrayOf_sr_BoxedUnit(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sr_BoxedUnit)))
}
function $asArrayOf_sr_BoxedUnit(obj, depth) {
  return (($isArrayOf_sr_BoxedUnit(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.runtime.BoxedUnit;", depth))
}
var $d_sr_BoxedUnit = new $TypeData().initClass({
  sr_BoxedUnit: 0
}, false, "scala.runtime.BoxedUnit", {
  sr_BoxedUnit: 1,
  O: 1
}, (void 0), (void 0), (function(x) {
  return (x === (void 0))
}));
/** @constructor */
function $c_sr_BoxesRunTime$() {
  $c_O.call(this)
}
$c_sr_BoxesRunTime$.prototype = new $h_O();
$c_sr_BoxesRunTime$.prototype.constructor = $c_sr_BoxesRunTime$;
/** @constructor */
function $h_sr_BoxesRunTime$() {
  /*<skip>*/
}
$h_sr_BoxesRunTime$.prototype = $c_sr_BoxesRunTime$.prototype;
$c_sr_BoxesRunTime$.prototype.equalsCharObject__jl_Character__O__Z = (function(xc, y) {
  if ($is_jl_Character(y)) {
    var x2 = $as_jl_Character(y);
    return (xc.value$1 === x2.value$1)
  } else if ($is_jl_Number(y)) {
    var x3 = $as_jl_Number(y);
    if (((typeof x3) === "number")) {
      var x2$1 = $uD(x3);
      return (x2$1 === xc.value$1)
    } else if ($is_sjsr_RuntimeLong(x3)) {
      var x3$1 = $uJ(x3);
      return x3$1.equals__sjsr_RuntimeLong__Z(new $c_sjsr_RuntimeLong().init___I(xc.value$1))
    } else {
      return ((x3 === null) ? (xc === null) : $objectEquals(x3, xc))
    }
  } else {
    return ((xc === null) && (y === null))
  }
});
$c_sr_BoxesRunTime$.prototype.equalsNumObject__jl_Number__O__Z = (function(xn, y) {
  if ($is_jl_Number(y)) {
    var x2 = $as_jl_Number(y);
    return this.equalsNumNum__jl_Number__jl_Number__Z(xn, x2)
  } else if ($is_jl_Character(y)) {
    var x3 = $as_jl_Character(y);
    if (((typeof xn) === "number")) {
      var x2$1 = $uD(xn);
      return (x2$1 === x3.value$1)
    } else if ($is_sjsr_RuntimeLong(xn)) {
      var x3$1 = $uJ(xn);
      return x3$1.equals__sjsr_RuntimeLong__Z(new $c_sjsr_RuntimeLong().init___I(x3.value$1))
    } else {
      return ((xn === null) ? (x3 === null) : $objectEquals(xn, x3))
    }
  } else {
    return ((xn === null) ? (y === null) : $objectEquals(xn, y))
  }
});
$c_sr_BoxesRunTime$.prototype.equals__O__O__Z = (function(x, y) {
  if ((x === y)) {
    return true
  } else if ($is_jl_Number(x)) {
    var x2 = $as_jl_Number(x);
    return this.equalsNumObject__jl_Number__O__Z(x2, y)
  } else if ($is_jl_Character(x)) {
    var x3 = $as_jl_Character(x);
    return this.equalsCharObject__jl_Character__O__Z(x3, y)
  } else {
    return ((x === null) ? (y === null) : $objectEquals(x, y))
  }
});
$c_sr_BoxesRunTime$.prototype.hashFromLong__jl_Long__I = (function(n) {
  var iv = $uJ(n).toInt__I();
  return (new $c_sjsr_RuntimeLong().init___I(iv).equals__sjsr_RuntimeLong__Z($uJ(n)) ? iv : $uJ(n).$$up__sjsr_RuntimeLong__sjsr_RuntimeLong($uJ(n).$$greater$greater$greater__I__sjsr_RuntimeLong(32)).toInt__I())
});
$c_sr_BoxesRunTime$.prototype.hashFromNumber__jl_Number__I = (function(n) {
  if ($isInt(n)) {
    var x2 = $uI(n);
    return x2
  } else if ($is_sjsr_RuntimeLong(n)) {
    var x3 = $as_sjsr_RuntimeLong(n);
    return this.hashFromLong__jl_Long__I(x3)
  } else if (((typeof n) === "number")) {
    var x4 = $asDouble(n);
    return this.hashFromDouble__jl_Double__I(x4)
  } else {
    return $objectHashCode(n)
  }
});
$c_sr_BoxesRunTime$.prototype.equalsNumNum__jl_Number__jl_Number__Z = (function(xn, yn) {
  if (((typeof xn) === "number")) {
    var x2 = $uD(xn);
    if (((typeof yn) === "number")) {
      var x2$2 = $uD(yn);
      return (x2 === x2$2)
    } else if ($is_sjsr_RuntimeLong(yn)) {
      var x3 = $uJ(yn);
      return (x2 === x3.toDouble__D())
    } else if ($is_s_math_ScalaNumber(yn)) {
      var x4 = $as_s_math_ScalaNumber(yn);
      return x4.equals__O__Z(x2)
    } else {
      return false
    }
  } else if ($is_sjsr_RuntimeLong(xn)) {
    var x3$2 = $uJ(xn);
    if ($is_sjsr_RuntimeLong(yn)) {
      var x2$3 = $uJ(yn);
      return x3$2.equals__sjsr_RuntimeLong__Z(x2$3)
    } else if (((typeof yn) === "number")) {
      var x3$3 = $uD(yn);
      return (x3$2.toDouble__D() === x3$3)
    } else if ($is_s_math_ScalaNumber(yn)) {
      var x4$2 = $as_s_math_ScalaNumber(yn);
      return x4$2.equals__O__Z(x3$2)
    } else {
      return false
    }
  } else {
    return ((xn === null) ? (yn === null) : $objectEquals(xn, yn))
  }
});
$c_sr_BoxesRunTime$.prototype.hashFromDouble__jl_Double__I = (function(n) {
  var iv = $doubleToInt($uD(n));
  var dv = $uD(n);
  if ((iv === dv)) {
    return iv
  } else {
    var lv = $m_sjsr_RuntimeLong$().fromDouble__D__sjsr_RuntimeLong($uD(n));
    return ((lv.toDouble__D() === dv) ? lv.$$up__sjsr_RuntimeLong__sjsr_RuntimeLong(lv.$$greater$greater$greater__I__sjsr_RuntimeLong(32)).toInt__I() : $m_sjsr_Bits$().numberHashCode__D__I($uD(n)))
  }
});
var $d_sr_BoxesRunTime$ = new $TypeData().initClass({
  sr_BoxesRunTime$: 0
}, false, "scala.runtime.BoxesRunTime$", {
  sr_BoxesRunTime$: 1,
  O: 1
});
$c_sr_BoxesRunTime$.prototype.$classData = $d_sr_BoxesRunTime$;
var $n_sr_BoxesRunTime$ = (void 0);
function $m_sr_BoxesRunTime$() {
  if ((!$n_sr_BoxesRunTime$)) {
    $n_sr_BoxesRunTime$ = new $c_sr_BoxesRunTime$().init___()
  };
  return $n_sr_BoxesRunTime$
}
var $d_sr_Null$ = new $TypeData().initClass({
  sr_Null$: 0
}, false, "scala.runtime.Null$", {
  sr_Null$: 1,
  O: 1
});
/** @constructor */
function $c_sr_ScalaRunTime$() {
  $c_O.call(this)
}
$c_sr_ScalaRunTime$.prototype = new $h_O();
$c_sr_ScalaRunTime$.prototype.constructor = $c_sr_ScalaRunTime$;
/** @constructor */
function $h_sr_ScalaRunTime$() {
  /*<skip>*/
}
$h_sr_ScalaRunTime$.prototype = $c_sr_ScalaRunTime$.prototype;
$c_sr_ScalaRunTime$.prototype.array$undlength__O__I = (function(xs) {
  if ($isArrayOf_O(xs, 1)) {
    var x2 = $asArrayOf_O(xs, 1);
    return x2.u["length"]
  } else if ($isArrayOf_I(xs, 1)) {
    var x3 = $asArrayOf_I(xs, 1);
    return x3.u["length"]
  } else if ($isArrayOf_D(xs, 1)) {
    var x4 = $asArrayOf_D(xs, 1);
    return x4.u["length"]
  } else if ($isArrayOf_J(xs, 1)) {
    var x5 = $asArrayOf_J(xs, 1);
    return x5.u["length"]
  } else if ($isArrayOf_F(xs, 1)) {
    var x6 = $asArrayOf_F(xs, 1);
    return x6.u["length"]
  } else if ($isArrayOf_C(xs, 1)) {
    var x7 = $asArrayOf_C(xs, 1);
    return x7.u["length"]
  } else if ($isArrayOf_B(xs, 1)) {
    var x8 = $asArrayOf_B(xs, 1);
    return x8.u["length"]
  } else if ($isArrayOf_S(xs, 1)) {
    var x9 = $asArrayOf_S(xs, 1);
    return x9.u["length"]
  } else if ($isArrayOf_Z(xs, 1)) {
    var x10 = $asArrayOf_Z(xs, 1);
    return x10.u["length"]
  } else if ($isArrayOf_sr_BoxedUnit(xs, 1)) {
    var x11 = $asArrayOf_sr_BoxedUnit(xs, 1);
    return x11.u["length"]
  } else if ((xs === null)) {
    throw new $c_jl_NullPointerException().init___()
  } else {
    throw new $c_s_MatchError().init___O(xs)
  }
});
$c_sr_ScalaRunTime$.prototype.hash__O__I = (function(x) {
  return ((x === null) ? 0 : ($is_jl_Number(x) ? $m_sr_BoxesRunTime$().hashFromNumber__jl_Number__I($as_jl_Number(x)) : $objectHashCode(x)))
});
$c_sr_ScalaRunTime$.prototype.array$undupdate__O__I__O__V = (function(xs, idx, value) {
  if ($isArrayOf_O(xs, 1)) {
    var x2 = $asArrayOf_O(xs, 1);
    x2.u[idx] = value
  } else if ($isArrayOf_I(xs, 1)) {
    var x3 = $asArrayOf_I(xs, 1);
    x3.u[idx] = $uI(value)
  } else if ($isArrayOf_D(xs, 1)) {
    var x4 = $asArrayOf_D(xs, 1);
    x4.u[idx] = $uD(value)
  } else if ($isArrayOf_J(xs, 1)) {
    var x5 = $asArrayOf_J(xs, 1);
    x5.u[idx] = $uJ(value)
  } else if ($isArrayOf_F(xs, 1)) {
    var x6 = $asArrayOf_F(xs, 1);
    x6.u[idx] = $uF(value)
  } else if ($isArrayOf_C(xs, 1)) {
    var x7 = $asArrayOf_C(xs, 1);
    if ((value === null)) {
      var jsx$1 = 0
    } else {
      var this$2 = $as_jl_Character(value);
      var jsx$1 = this$2.value$1
    };
    x7.u[idx] = jsx$1
  } else if ($isArrayOf_B(xs, 1)) {
    var x8 = $asArrayOf_B(xs, 1);
    x8.u[idx] = $uB(value)
  } else if ($isArrayOf_S(xs, 1)) {
    var x9 = $asArrayOf_S(xs, 1);
    x9.u[idx] = $uS(value)
  } else if ($isArrayOf_Z(xs, 1)) {
    var x10 = $asArrayOf_Z(xs, 1);
    x10.u[idx] = $uZ(value)
  } else if ($isArrayOf_sr_BoxedUnit(xs, 1)) {
    var x11 = $asArrayOf_sr_BoxedUnit(xs, 1);
    x11.u[idx] = $asUnit(value)
  } else if ((xs === null)) {
    throw new $c_jl_NullPointerException().init___()
  } else {
    throw new $c_s_MatchError().init___O(xs)
  }
});
$c_sr_ScalaRunTime$.prototype.$$undtoString__s_Product__T = (function(x) {
  var this$1 = x.productIterator__sc_Iterator();
  var start = (x.productPrefix__T() + "(");
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this$1, start, ",", ")")
});
$c_sr_ScalaRunTime$.prototype.array$undapply__O__I__O = (function(xs, idx) {
  if ($isArrayOf_O(xs, 1)) {
    var x2 = $asArrayOf_O(xs, 1);
    return x2.u[idx]
  } else if ($isArrayOf_I(xs, 1)) {
    var x3 = $asArrayOf_I(xs, 1);
    return x3.u[idx]
  } else if ($isArrayOf_D(xs, 1)) {
    var x4 = $asArrayOf_D(xs, 1);
    return x4.u[idx]
  } else if ($isArrayOf_J(xs, 1)) {
    var x5 = $asArrayOf_J(xs, 1);
    return x5.u[idx]
  } else if ($isArrayOf_F(xs, 1)) {
    var x6 = $asArrayOf_F(xs, 1);
    return x6.u[idx]
  } else if ($isArrayOf_C(xs, 1)) {
    var x7 = $asArrayOf_C(xs, 1);
    var c = x7.u[idx];
    return new $c_jl_Character().init___C(c)
  } else if ($isArrayOf_B(xs, 1)) {
    var x8 = $asArrayOf_B(xs, 1);
    return x8.u[idx]
  } else if ($isArrayOf_S(xs, 1)) {
    var x9 = $asArrayOf_S(xs, 1);
    return x9.u[idx]
  } else if ($isArrayOf_Z(xs, 1)) {
    var x10 = $asArrayOf_Z(xs, 1);
    return x10.u[idx]
  } else if ($isArrayOf_sr_BoxedUnit(xs, 1)) {
    var x11 = $asArrayOf_sr_BoxedUnit(xs, 1);
    return x11.u[idx]
  } else if ((xs === null)) {
    throw new $c_jl_NullPointerException().init___()
  } else {
    throw new $c_s_MatchError().init___O(xs)
  }
});
var $d_sr_ScalaRunTime$ = new $TypeData().initClass({
  sr_ScalaRunTime$: 0
}, false, "scala.runtime.ScalaRunTime$", {
  sr_ScalaRunTime$: 1,
  O: 1
});
$c_sr_ScalaRunTime$.prototype.$classData = $d_sr_ScalaRunTime$;
var $n_sr_ScalaRunTime$ = (void 0);
function $m_sr_ScalaRunTime$() {
  if ((!$n_sr_ScalaRunTime$)) {
    $n_sr_ScalaRunTime$ = new $c_sr_ScalaRunTime$().init___()
  };
  return $n_sr_ScalaRunTime$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_CompState$RootAccessor() {
  $c_Ljapgolly_scalajs_react_CompState$Accessor.call(this)
}
$c_Ljapgolly_scalajs_react_CompState$RootAccessor.prototype = new $h_Ljapgolly_scalajs_react_CompState$Accessor();
$c_Ljapgolly_scalajs_react_CompState$RootAccessor.prototype.constructor = $c_Ljapgolly_scalajs_react_CompState$RootAccessor;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CompState$RootAccessor() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CompState$RootAccessor.prototype = $c_Ljapgolly_scalajs_react_CompState$RootAccessor.prototype;
$c_Ljapgolly_scalajs_react_CompState$RootAccessor.prototype.state__Ljapgolly_scalajs_react_CompScope$CanSetState__O = (function($$) {
  return $$["state"]["v"]
});
$c_Ljapgolly_scalajs_react_CompState$RootAccessor.prototype.setState__Ljapgolly_scalajs_react_CompScope$CanSetState__O__F0__V = (function($$, s, cb) {
  $$["setState"]($m_Ljapgolly_scalajs_react_package$().WrapObj__O__Ljapgolly_scalajs_react_package$WrapObj(s), $m_Ljapgolly_scalajs_react_CallbackTo$().toJsCallback$extension__F0__sjs_js_UndefOr(cb))
});
var $d_Ljapgolly_scalajs_react_CompState$RootAccessor = new $TypeData().initClass({
  Ljapgolly_scalajs_react_CompState$RootAccessor: 0
}, false, "japgolly.scalajs.react.CompState$RootAccessor", {
  Ljapgolly_scalajs_react_CompState$RootAccessor: 1,
  Ljapgolly_scalajs_react_CompState$Accessor: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_CompState$RootAccessor.prototype.$classData = $d_Ljapgolly_scalajs_react_CompState$RootAccessor;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_OnUnmount$Backend() {
  $c_O.call(this);
  this.japgolly$scalajs$react$extra$OnUnmount$$unmountProcs$1 = null
}
$c_Ljapgolly_scalajs_react_extra_OnUnmount$Backend.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_OnUnmount$Backend.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_OnUnmount$Backend;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_OnUnmount$Backend() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_OnUnmount$Backend.prototype = $c_Ljapgolly_scalajs_react_extra_OnUnmount$Backend.prototype;
$c_Ljapgolly_scalajs_react_extra_OnUnmount$Backend.prototype.init___ = (function() {
  this.japgolly$scalajs$react$extra$OnUnmount$$unmountProcs$1 = $m_sci_Nil$();
  return this
});
var $d_Ljapgolly_scalajs_react_extra_OnUnmount$Backend = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_OnUnmount$Backend: 0
}, false, "japgolly.scalajs.react.extra.OnUnmount$Backend", {
  Ljapgolly_scalajs_react_extra_OnUnmount$Backend: 1,
  O: 1,
  Ljapgolly_scalajs_react_extra_OnUnmount: 1
});
$c_Ljapgolly_scalajs_react_extra_OnUnmount$Backend.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_OnUnmount$Backend;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anon$1() {
  $c_Ljapgolly_scalajs_react_extra_router_RouterCtl.call(this);
  this.refresh$2 = null;
  this.$$outer$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anon$1.prototype = new $h_Ljapgolly_scalajs_react_extra_router_RouterCtl();
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anon$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anon$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anon$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anon$1.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anon$1.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anon$1.prototype.init___Ljapgolly_scalajs_react_extra_router_RouterLogic = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.refresh$2 = $$outer.interpret__Ljapgolly_scalajs_react_extra_router_RouteCmd__F0($m_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$());
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anon$1.prototype.refresh__F0 = (function() {
  return this.refresh$2
});
var $d_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anon$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouterLogic$$anon$1: 0
}, false, "japgolly.scalajs.react.extra.router.RouterLogic$$anon$1", {
  Ljapgolly_scalajs_react_extra_router_RouterLogic$$anon$1: 1,
  Ljapgolly_scalajs_react_extra_router_RouterCtl: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anon$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anon$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Route() {
  $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteCommon.call(this);
  this.pattern$2 = null;
  this.japgolly$scalajs$react$extra$router$StaticDsl$Route$$parseFn$f = null;
  this.buildFn$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Route.prototype = new $h_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteCommon();
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Route.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Route;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_StaticDsl$Route() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_StaticDsl$Route.prototype = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Route.prototype;
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Route.prototype.xmap__F1__F1__Ljapgolly_scalajs_react_extra_router_StaticDsl$Route = (function(b, a) {
  var jsx$2 = this.pattern$2;
  var jsx$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer, b$4) {
    return (function(x$29$2) {
      var x$29 = $as_ju_regex_Matcher(x$29$2);
      var this$1 = $as_s_Option(arg$outer.japgolly$scalajs$react$extra$router$StaticDsl$Route$$parseFn$f.apply__O__O(x$29));
      return (this$1.isEmpty__Z() ? $m_s_None$() : new $c_s_Some().init___O(b$4.apply__O__O(this$1.get__O())))
    })
  })(this, b));
  var this$2 = this.buildFn$2;
  return new $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Route().init___ju_regex_Pattern__F1__F1(jsx$2, jsx$1, $s_s_Function1$class__compose__F1__F1__F1(this$2, a))
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Route.prototype.toString__T = (function() {
  return new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Route(", ")"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.pattern$2]))
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Route.prototype.init___ju_regex_Pattern__F1__F1 = (function(pattern, parseFn, buildFn) {
  this.pattern$2 = pattern;
  this.japgolly$scalajs$react$extra$router$StaticDsl$Route$$parseFn$f = parseFn;
  this.buildFn$2 = buildFn;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Route.prototype.pathFor__O__Ljapgolly_scalajs_react_extra_router_Path = (function(a) {
  return $as_Ljapgolly_scalajs_react_extra_router_Path(this.buildFn$2.apply__O__O(a))
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Route.prototype.parse__Ljapgolly_scalajs_react_extra_router_Path__s_Option = (function(path) {
  var this$1 = this.pattern$2;
  var input = path.value$2;
  var m = new $c_ju_regex_Matcher().init___ju_regex_Pattern__jl_CharSequence__I__I(this$1, input, 0, $uI(input["length"]));
  return (m.matches__Z() ? $as_s_Option(this.japgolly$scalajs$react$extra$router$StaticDsl$Route$$parseFn$f.apply__O__O(m)) : $m_s_None$())
});
var $d_Ljapgolly_scalajs_react_extra_router_StaticDsl$Route = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_StaticDsl$Route: 0
}, false, "japgolly.scalajs.react.extra.router.StaticDsl$Route", {
  Ljapgolly_scalajs_react_extra_router_StaticDsl$Route: 1,
  Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteCommon: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Route.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_StaticDsl$Route;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB() {
  $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteCommon.call(this);
  this.regex$2 = null;
  this.matchGroups$2 = 0;
  this.parse$2 = null;
  this.build$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB.prototype = new $h_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteCommon();
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB.prototype = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB.prototype;
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB.prototype.toString__T = (function() {
  return new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["RouteB(", ")"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.regex$2]))
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB.prototype.route__Ljapgolly_scalajs_react_extra_router_StaticDsl$Route = (function() {
  var this$1 = $m_ju_regex_Pattern$();
  var regex = (("^" + this.regex$2) + "$");
  var p = this$1.compile__T__I__ju_regex_Pattern(regex, 0);
  return new $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Route().init___ju_regex_Pattern__F1__F1(p, new $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$$anonfun$route$1().init___Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB(this), new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer) {
    return (function(a$2) {
      return new $c_Ljapgolly_scalajs_react_extra_router_Path().init___T($as_T(arg$outer.build$2.apply__O__O(a$2)))
    })
  })(this)))
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB.prototype.init___T__I__F1__F1 = (function(regex, matchGroups, parse, build) {
  this.regex$2 = regex;
  this.matchGroups$2 = matchGroups;
  this.parse$2 = parse;
  this.build$2 = build;
  return this
});
var $d_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB: 0
}, false, "japgolly.scalajs.react.extra.router.StaticDsl$RouteB", {
  Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB: 1,
  Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteCommon: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB;
/** @constructor */
function $c_Ljapgolly_scalajs_react_package$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_package$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_package$.prototype.constructor = $c_Ljapgolly_scalajs_react_package$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_package$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_package$.prototype = $c_Ljapgolly_scalajs_react_package$.prototype;
$c_Ljapgolly_scalajs_react_package$.prototype.WrapObj__O__Ljapgolly_scalajs_react_package$WrapObj = (function(v) {
  return {
    "v": v
  }
});
var $d_Ljapgolly_scalajs_react_package$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_package$: 0
}, false, "japgolly.scalajs.react.package$", {
  Ljapgolly_scalajs_react_package$: 1,
  O: 1,
  Ljapgolly_scalajs_react_ReactEventAliases: 1
});
$c_Ljapgolly_scalajs_react_package$.prototype.$classData = $d_Ljapgolly_scalajs_react_package$;
var $n_Ljapgolly_scalajs_react_package$ = (void 0);
function $m_Ljapgolly_scalajs_react_package$() {
  if ((!$n_Ljapgolly_scalajs_react_package$)) {
    $n_Ljapgolly_scalajs_react_package$ = new $c_Ljapgolly_scalajs_react_package$().init___()
  };
  return $n_Ljapgolly_scalajs_react_package$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Implicits() {
  $c_Ljapgolly_scalajs_react_vdom_LowPri.call(this);
  this.$$undreact$undattrBoolean$2 = null;
  this.$$undreact$undattrByte$2 = null;
  this.$$undreact$undattrShort$2 = null;
  this.$$undreact$undattrInt$2 = null;
  this.$$undreact$undattrLong$2 = null;
  this.$$undreact$undattrFloat$2 = null;
  this.$$undreact$undattrDouble$2 = null;
  this.$$undreact$undattrJsThisFn$2 = null;
  this.$$undreact$undattrJsFn$2 = null;
  this.$$undreact$undattrJsObj$2 = null;
  this.$$undreact$undstyleBoolean$2 = null;
  this.$$undreact$undstyleByte$2 = null;
  this.$$undreact$undstyleShort$2 = null;
  this.$$undreact$undstyleInt$2 = null;
  this.$$undreact$undstyleLong$2 = null;
  this.$$undreact$undstyleFloat$2 = null;
  this.$$undreact$undstyleDouble$2 = null
}
$c_Ljapgolly_scalajs_react_vdom_Implicits.prototype = new $h_Ljapgolly_scalajs_react_vdom_LowPri();
$c_Ljapgolly_scalajs_react_vdom_Implicits.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Implicits;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Implicits() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Implicits.prototype = $c_Ljapgolly_scalajs_react_vdom_Implicits.prototype;
$c_Ljapgolly_scalajs_react_vdom_Implicits.prototype.init___ = (function() {
  var evidence$2 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(value$2) {
    var value = $uZ(value$2);
    return value
  }));
  this.$$undreact$undattrBoolean$2 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(evidence$2$1) {
    return (function(a$2) {
      return evidence$2$1.apply__O__O(a$2)
    })
  })(evidence$2)));
  var evidence$2$2 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(v$2) {
    var v = $uB(v$2);
    return v
  }));
  this.$$undreact$undattrByte$2 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(evidence$2$1$1) {
    return (function(a$2$1) {
      return evidence$2$1$1.apply__O__O(a$2$1)
    })
  })(evidence$2$2)));
  var evidence$2$3 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(v$2$1) {
    var v$1 = $uS(v$2$1);
    return v$1
  }));
  this.$$undreact$undattrShort$2 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(evidence$2$1$2) {
    return (function(a$2$2) {
      return evidence$2$1$2.apply__O__O(a$2$2)
    })
  })(evidence$2$3)));
  var evidence$2$4 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(v$2$2) {
    var v$3 = $uI(v$2$2);
    return v$3
  }));
  this.$$undreact$undattrInt$2 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(evidence$2$1$3) {
    return (function(a$2$3) {
      return evidence$2$1$3.apply__O__O(a$2$3)
    })
  })(evidence$2$4)));
  var evidence$2$5 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(v$2$3) {
    var v$4 = $uJ(v$2$3);
    return $as_sjsr_RuntimeLong(v$4).toString__T()
  }));
  this.$$undreact$undattrLong$2 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(evidence$2$1$4) {
    return (function(a$2$4) {
      return evidence$2$1$4.apply__O__O(a$2$4)
    })
  })(evidence$2$5)));
  var evidence$2$6 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(v$2$4) {
    var v$5 = $uF(v$2$4);
    return v$5
  }));
  this.$$undreact$undattrFloat$2 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(evidence$2$1$5) {
    return (function(a$2$5) {
      return evidence$2$1$5.apply__O__O(a$2$5)
    })
  })(evidence$2$6)));
  var evidence$2$7 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(v$2$5) {
    var v$6 = $uD(v$2$5);
    return v$6
  }));
  this.$$undreact$undattrDouble$2 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(evidence$2$1$6) {
    return (function(a$2$6) {
      return evidence$2$1$6.apply__O__O(a$2$6)
    })
  })(evidence$2$7)));
  var evidence$2$8 = $m_s_Predef$().singleton$und$less$colon$less$2;
  this.$$undreact$undattrJsThisFn$2 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(evidence$2$1$7) {
    return (function(a$2$7) {
      return evidence$2$1$7.apply__O__O(a$2$7)
    })
  })(evidence$2$8)));
  var evidence$2$9 = $m_s_Predef$().singleton$und$less$colon$less$2;
  this.$$undreact$undattrJsFn$2 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(evidence$2$1$8) {
    return (function(a$2$8) {
      return evidence$2$1$8.apply__O__O(a$2$8)
    })
  })(evidence$2$9)));
  var evidence$2$10 = $m_s_Predef$().singleton$und$less$colon$less$2;
  this.$$undreact$undattrJsObj$2 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(evidence$2$1$9) {
    return (function(a$2$9) {
      return evidence$2$1$9.apply__O__O(a$2$9)
    })
  })(evidence$2$10)));
  this.$$undreact$undstyleBoolean$2 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$9$2) {
    return $objectToString(x$9$2)
  })));
  this.$$undreact$undstyleByte$2 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$9$2$1) {
    return $objectToString(x$9$2$1)
  })));
  this.$$undreact$undstyleShort$2 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$9$2$2) {
    return $objectToString(x$9$2$2)
  })));
  this.$$undreact$undstyleInt$2 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$9$2$3) {
    return $objectToString(x$9$2$3)
  })));
  this.$$undreact$undstyleLong$2 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$9$2$4) {
    return $objectToString(x$9$2$4)
  })));
  this.$$undreact$undstyleFloat$2 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$9$2$5) {
    return $objectToString(x$9$2$5)
  })));
  this.$$undreact$undstyleDouble$2 = new $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle().init___F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$9$2$6) {
    return $objectToString(x$9$2$6)
  })));
  return this
});
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr() {
  $c_O.call(this);
  this.f$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr.prototype = $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr.prototype;
$c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr.prototype.init___F1 = (function(f) {
  this.f$1 = f;
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr: 0
}, false, "japgolly.scalajs.react.vdom.Scalatags$GenericAttr", {
  Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_AttrValue: 1
});
$c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Scalatags$GenericAttr;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle() {
  $c_O.call(this);
  this.f$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle.prototype = $c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle.prototype;
$c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle.prototype.init___F1 = (function(f) {
  this.f$1 = f;
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle: 0
}, false, "japgolly.scalajs.react.vdom.Scalatags$GenericStyle", {
  Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_StyleValue: 1
});
$c_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Scalatags$GenericStyle;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$$anon$1() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$$anon$1.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$$anon$1.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$$anon$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$$anon$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$$anon$1.prototype = $c_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$$anon$1.prototype;
var $d_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$$anon$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$$anon$1: 0
}, false, "japgolly.scalajs.react.vdom.Scalatags$NamespaceHtml$$anon$1", {
  Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$$anon$1: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_Scalatags$Namespace: 1
});
$c_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$$anon$1.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Scalatags$NamespaceHtml$$anon$1;
/** @constructor */
function $c_Lscalajsreact_template_ReactApp$() {
  $c_O.call(this)
}
$c_Lscalajsreact_template_ReactApp$.prototype = new $h_O();
$c_Lscalajsreact_template_ReactApp$.prototype.constructor = $c_Lscalajsreact_template_ReactApp$;
/** @constructor */
function $h_Lscalajsreact_template_ReactApp$() {
  /*<skip>*/
}
$h_Lscalajsreact_template_ReactApp$.prototype = $c_Lscalajsreact_template_ReactApp$.prototype;
$c_Lscalajsreact_template_ReactApp$.prototype.init___ = (function() {
  $n_Lscalajsreact_template_ReactApp$ = this;
  return this
});
$c_Lscalajsreact_template_ReactApp$.prototype.main__V = (function() {
  var this$2 = $m_s_Console$();
  var this$3 = this$2.outVar$2;
  $as_Ljava_io_PrintStream(this$3.tl$1.get__O()).println__O__V("Hello world!");
  var $$this = $m_Lscalajsreact_template_routes_AppRouter$().router$1.apply__sc_Seq__Ljapgolly_scalajs_react_ReactComponentU($m_sci_Nil$());
  var container = $g["document"]["body"];
  $g["ReactDOM"]["render"]($$this, container)
});
$c_Lscalajsreact_template_ReactApp$.prototype.$$js$exported$meth$main__O = (function() {
  this.main__V()
});
$c_Lscalajsreact_template_ReactApp$.prototype["main"] = (function() {
  return this.$$js$exported$meth$main__O()
});
var $d_Lscalajsreact_template_ReactApp$ = new $TypeData().initClass({
  Lscalajsreact_template_ReactApp$: 0
}, false, "scalajsreact.template.ReactApp$", {
  Lscalajsreact_template_ReactApp$: 1,
  O: 1,
  sjs_js_JSApp: 1
});
$c_Lscalajsreact_template_ReactApp$.prototype.$classData = $d_Lscalajsreact_template_ReactApp$;
var $n_Lscalajsreact_template_ReactApp$ = (void 0);
function $m_Lscalajsreact_template_ReactApp$() {
  if ((!$n_Lscalajsreact_template_ReactApp$)) {
    $n_Lscalajsreact_template_ReactApp$ = new $c_Lscalajsreact_template_ReactApp$().init___()
  };
  return $n_Lscalajsreact_template_ReactApp$
}
$e["scalajsreact"] = ($e["scalajsreact"] || {});
$e["scalajsreact"]["template"] = ($e["scalajsreact"]["template"] || {});
$e["scalajsreact"]["template"]["ReactApp"] = $m_Lscalajsreact_template_ReactApp$;
var $d_jl_Boolean = new $TypeData().initClass({
  jl_Boolean: 0
}, false, "java.lang.Boolean", {
  jl_Boolean: 1,
  O: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return ((typeof x) === "boolean")
}));
/** @constructor */
function $c_jl_Character() {
  $c_O.call(this);
  this.value$1 = 0
}
$c_jl_Character.prototype = new $h_O();
$c_jl_Character.prototype.constructor = $c_jl_Character;
/** @constructor */
function $h_jl_Character() {
  /*<skip>*/
}
$h_jl_Character.prototype = $c_jl_Character.prototype;
$c_jl_Character.prototype.equals__O__Z = (function(that) {
  if ($is_jl_Character(that)) {
    var jsx$1 = this.value$1;
    var this$1 = $as_jl_Character(that);
    return (jsx$1 === this$1.value$1)
  } else {
    return false
  }
});
$c_jl_Character.prototype.toString__T = (function() {
  var c = this.value$1;
  return $as_T($g["String"]["fromCharCode"](c))
});
$c_jl_Character.prototype.init___C = (function(value) {
  this.value$1 = value;
  return this
});
$c_jl_Character.prototype.hashCode__I = (function() {
  return this.value$1
});
function $is_jl_Character(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_Character)))
}
function $as_jl_Character(obj) {
  return (($is_jl_Character(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.Character"))
}
function $isArrayOf_jl_Character(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Character)))
}
function $asArrayOf_jl_Character(obj, depth) {
  return (($isArrayOf_jl_Character(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Character;", depth))
}
var $d_jl_Character = new $TypeData().initClass({
  jl_Character: 0
}, false, "java.lang.Character", {
  jl_Character: 1,
  O: 1,
  jl_Comparable: 1
});
$c_jl_Character.prototype.$classData = $d_jl_Character;
/** @constructor */
function $c_jl_InheritableThreadLocal() {
  $c_jl_ThreadLocal.call(this)
}
$c_jl_InheritableThreadLocal.prototype = new $h_jl_ThreadLocal();
$c_jl_InheritableThreadLocal.prototype.constructor = $c_jl_InheritableThreadLocal;
/** @constructor */
function $h_jl_InheritableThreadLocal() {
  /*<skip>*/
}
$h_jl_InheritableThreadLocal.prototype = $c_jl_InheritableThreadLocal.prototype;
/** @constructor */
function $c_jl_Throwable() {
  $c_O.call(this);
  this.s$1 = null;
  this.e$1 = null;
  this.stackTrace$1 = null
}
$c_jl_Throwable.prototype = new $h_O();
$c_jl_Throwable.prototype.constructor = $c_jl_Throwable;
/** @constructor */
function $h_jl_Throwable() {
  /*<skip>*/
}
$h_jl_Throwable.prototype = $c_jl_Throwable.prototype;
$c_jl_Throwable.prototype.init___ = (function() {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
$c_jl_Throwable.prototype.fillInStackTrace__jl_Throwable = (function() {
  var this$1 = $m_sjsr_StackTrace$();
  this$1.captureState__jl_Throwable__O__V(this, this$1.createException__p1__O());
  return this
});
$c_jl_Throwable.prototype.getMessage__T = (function() {
  return this.s$1
});
$c_jl_Throwable.prototype.toString__T = (function() {
  var className = $objectGetClass(this).getName__T();
  var message = this.getMessage__T();
  return ((message === null) ? className : ((className + ": ") + message))
});
$c_jl_Throwable.prototype.init___T__jl_Throwable = (function(s, e) {
  this.s$1 = s;
  this.e$1 = e;
  this.fillInStackTrace__jl_Throwable();
  return this
});
function $is_jl_Throwable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_Throwable)))
}
function $as_jl_Throwable(obj) {
  return (($is_jl_Throwable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.Throwable"))
}
function $isArrayOf_jl_Throwable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Throwable)))
}
function $asArrayOf_jl_Throwable(obj, depth) {
  return (($isArrayOf_jl_Throwable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Throwable;", depth))
}
/** @constructor */
function $c_ju_regex_Matcher() {
  $c_O.call(this);
  this.pattern0$1 = null;
  this.input0$1 = null;
  this.regionStart0$1 = 0;
  this.regionEnd0$1 = 0;
  this.regexp$1 = null;
  this.inputstr$1 = null;
  this.lastMatch$1 = null;
  this.lastMatchIsValid$1 = false;
  this.canStillFind$1 = false;
  this.appendPos$1 = 0
}
$c_ju_regex_Matcher.prototype = new $h_O();
$c_ju_regex_Matcher.prototype.constructor = $c_ju_regex_Matcher;
/** @constructor */
function $h_ju_regex_Matcher() {
  /*<skip>*/
}
$h_ju_regex_Matcher.prototype = $c_ju_regex_Matcher.prototype;
$c_ju_regex_Matcher.prototype.find__Z = (function() {
  if (this.canStillFind$1) {
    this.lastMatchIsValid$1 = true;
    this.lastMatch$1 = this.regexp$1["exec"](this.inputstr$1);
    if ((this.lastMatch$1 !== null)) {
      var $$this = this.lastMatch$1[0];
      if (($$this === (void 0))) {
        var jsx$1;
        throw new $c_ju_NoSuchElementException().init___T("undefined.get")
      } else {
        var jsx$1 = $$this
      };
      var thiz = $as_T(jsx$1);
      if ((thiz === null)) {
        var jsx$2;
        throw new $c_jl_NullPointerException().init___()
      } else {
        var jsx$2 = thiz
      };
      if ((jsx$2 === "")) {
        var ev$1 = this.regexp$1;
        ev$1["lastIndex"] = ((1 + $uI(ev$1["lastIndex"])) | 0)
      }
    } else {
      this.canStillFind$1 = false
    };
    return (this.lastMatch$1 !== null)
  } else {
    return false
  }
});
$c_ju_regex_Matcher.prototype.ensureLastMatch__p1__sjs_js_RegExp$ExecResult = (function() {
  if ((this.lastMatch$1 === null)) {
    throw new $c_jl_IllegalStateException().init___T("No match available")
  };
  return this.lastMatch$1
});
$c_ju_regex_Matcher.prototype.group__I__T = (function(group) {
  var $$this = this.ensureLastMatch__p1__sjs_js_RegExp$ExecResult()[group];
  return $as_T((($$this === (void 0)) ? null : $$this))
});
$c_ju_regex_Matcher.prototype.matches__Z = (function() {
  this.reset__ju_regex_Matcher();
  this.find__Z();
  if ((this.lastMatch$1 !== null)) {
    if ((this.start__I() !== 0)) {
      var jsx$1 = true
    } else {
      var jsx$2 = this.end__I();
      var thiz = this.inputstr$1;
      var jsx$1 = (jsx$2 !== $uI(thiz["length"]))
    }
  } else {
    var jsx$1 = false
  };
  if (jsx$1) {
    this.reset__ju_regex_Matcher()
  };
  return (this.lastMatch$1 !== null)
});
$c_ju_regex_Matcher.prototype.appendTail__jl_StringBuffer__jl_StringBuffer = (function(sb) {
  var thiz = this.inputstr$1;
  var beginIndex = this.appendPos$1;
  sb.append__T__jl_StringBuffer($as_T(thiz["substring"](beginIndex)));
  var thiz$1 = this.inputstr$1;
  this.appendPos$1 = $uI(thiz$1["length"]);
  return sb
});
$c_ju_regex_Matcher.prototype.end__I = (function() {
  var jsx$1 = this.start__I();
  var thiz = this.group__T();
  return ((jsx$1 + $uI(thiz["length"])) | 0)
});
$c_ju_regex_Matcher.prototype.init___ju_regex_Pattern__jl_CharSequence__I__I = (function(pattern0, input0, regionStart0, regionEnd0) {
  this.pattern0$1 = pattern0;
  this.input0$1 = input0;
  this.regionStart0$1 = regionStart0;
  this.regionEnd0$1 = regionEnd0;
  this.regexp$1 = this.pattern0$1.newJSRegExp__sjs_js_RegExp();
  this.inputstr$1 = $objectToString($charSequenceSubSequence(this.input0$1, this.regionStart0$1, this.regionEnd0$1));
  this.lastMatch$1 = null;
  this.lastMatchIsValid$1 = false;
  this.canStillFind$1 = true;
  this.appendPos$1 = 0;
  return this
});
$c_ju_regex_Matcher.prototype.appendReplacement__jl_StringBuffer__T__ju_regex_Matcher = (function(sb, replacement) {
  var thiz = this.inputstr$1;
  var beginIndex = this.appendPos$1;
  var endIndex = this.start__I();
  sb.append__T__jl_StringBuffer($as_T(thiz["substring"](beginIndex, endIndex)));
  var len = $uI(replacement["length"]);
  var i = 0;
  while ((i < len)) {
    var index = i;
    var x1 = (65535 & $uI(replacement["charCodeAt"](index)));
    switch (x1) {
      case 36: {
        i = ((1 + i) | 0);
        var j = i;
        while (true) {
          if ((i < len)) {
            var index$1 = i;
            var c = (65535 & $uI(replacement["charCodeAt"](index$1)));
            var jsx$1 = ((c >= 48) && (c <= 57))
          } else {
            var jsx$1 = false
          };
          if (jsx$1) {
            i = ((1 + i) | 0)
          } else {
            break
          }
        };
        var this$8 = $m_jl_Integer$();
        var endIndex$1 = i;
        var s = $as_T(replacement["substring"](j, endIndex$1));
        var group = this$8.parseInt__T__I__I(s, 10);
        sb.append__T__jl_StringBuffer(this.group__I__T(group));
        break
      }
      case 92: {
        i = ((1 + i) | 0);
        if ((i < len)) {
          var index$2 = i;
          sb.append__C__jl_StringBuffer((65535 & $uI(replacement["charCodeAt"](index$2))))
        };
        i = ((1 + i) | 0);
        break
      }
      default: {
        sb.append__C__jl_StringBuffer(x1);
        i = ((1 + i) | 0)
      }
    }
  };
  this.appendPos$1 = this.end__I();
  return this
});
$c_ju_regex_Matcher.prototype.replaceFirst__T__T = (function(replacement) {
  this.reset__ju_regex_Matcher();
  if (this.find__Z()) {
    var sb = new $c_jl_StringBuffer().init___();
    this.appendReplacement__jl_StringBuffer__T__ju_regex_Matcher(sb, replacement);
    this.appendTail__jl_StringBuffer__jl_StringBuffer(sb);
    return sb.content$1
  } else {
    return this.inputstr$1
  }
});
$c_ju_regex_Matcher.prototype.replaceAll__T__T = (function(replacement) {
  this.reset__ju_regex_Matcher();
  var sb = new $c_jl_StringBuffer().init___();
  while (this.find__Z()) {
    this.appendReplacement__jl_StringBuffer__T__ju_regex_Matcher(sb, replacement)
  };
  this.appendTail__jl_StringBuffer__jl_StringBuffer(sb);
  return sb.content$1
});
$c_ju_regex_Matcher.prototype.group__T = (function() {
  var $$this = this.ensureLastMatch__p1__sjs_js_RegExp$ExecResult()[0];
  if (($$this === (void 0))) {
    var jsx$1;
    throw new $c_ju_NoSuchElementException().init___T("undefined.get")
  } else {
    var jsx$1 = $$this
  };
  return $as_T(jsx$1)
});
$c_ju_regex_Matcher.prototype.start__I = (function() {
  return $uI(this.ensureLastMatch__p1__sjs_js_RegExp$ExecResult()["index"])
});
$c_ju_regex_Matcher.prototype.reset__ju_regex_Matcher = (function() {
  this.regexp$1["lastIndex"] = 0;
  this.lastMatch$1 = null;
  this.lastMatchIsValid$1 = false;
  this.canStillFind$1 = true;
  this.appendPos$1 = 0;
  return this
});
function $is_ju_regex_Matcher(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.ju_regex_Matcher)))
}
function $as_ju_regex_Matcher(obj) {
  return (($is_ju_regex_Matcher(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.util.regex.Matcher"))
}
function $isArrayOf_ju_regex_Matcher(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.ju_regex_Matcher)))
}
function $asArrayOf_ju_regex_Matcher(obj, depth) {
  return (($isArrayOf_ju_regex_Matcher(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.util.regex.Matcher;", depth))
}
var $d_ju_regex_Matcher = new $TypeData().initClass({
  ju_regex_Matcher: 0
}, false, "java.util.regex.Matcher", {
  ju_regex_Matcher: 1,
  O: 1,
  ju_regex_MatchResult: 1
});
$c_ju_regex_Matcher.prototype.$classData = $d_ju_regex_Matcher;
/** @constructor */
function $c_s_Predef$$anon$3() {
  $c_O.call(this)
}
$c_s_Predef$$anon$3.prototype = new $h_O();
$c_s_Predef$$anon$3.prototype.constructor = $c_s_Predef$$anon$3;
/** @constructor */
function $h_s_Predef$$anon$3() {
  /*<skip>*/
}
$h_s_Predef$$anon$3.prototype = $c_s_Predef$$anon$3.prototype;
$c_s_Predef$$anon$3.prototype.apply__scm_Builder = (function() {
  return new $c_scm_StringBuilder().init___()
});
$c_s_Predef$$anon$3.prototype.apply__O__scm_Builder = (function(from) {
  $as_T(from);
  return new $c_scm_StringBuilder().init___()
});
var $d_s_Predef$$anon$3 = new $TypeData().initClass({
  s_Predef$$anon$3: 0
}, false, "scala.Predef$$anon$3", {
  s_Predef$$anon$3: 1,
  O: 1,
  scg_CanBuildFrom: 1
});
$c_s_Predef$$anon$3.prototype.$classData = $d_s_Predef$$anon$3;
function $is_s_math_ScalaNumber(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_math_ScalaNumber)))
}
function $as_s_math_ScalaNumber(obj) {
  return (($is_s_math_ScalaNumber(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.math.ScalaNumber"))
}
function $isArrayOf_s_math_ScalaNumber(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_math_ScalaNumber)))
}
function $asArrayOf_s_math_ScalaNumber(obj, depth) {
  return (($isArrayOf_s_math_ScalaNumber(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.math.ScalaNumber;", depth))
}
/** @constructor */
function $c_s_package$$anon$1() {
  $c_O.call(this)
}
$c_s_package$$anon$1.prototype = new $h_O();
$c_s_package$$anon$1.prototype.constructor = $c_s_package$$anon$1;
/** @constructor */
function $h_s_package$$anon$1() {
  /*<skip>*/
}
$h_s_package$$anon$1.prototype = $c_s_package$$anon$1.prototype;
$c_s_package$$anon$1.prototype.toString__T = (function() {
  return "object AnyRef"
});
var $d_s_package$$anon$1 = new $TypeData().initClass({
  s_package$$anon$1: 0
}, false, "scala.package$$anon$1", {
  s_package$$anon$1: 1,
  O: 1,
  s_Specializable: 1
});
$c_s_package$$anon$1.prototype.$classData = $d_s_package$$anon$1;
/** @constructor */
function $c_s_util_hashing_MurmurHash3$() {
  $c_s_util_hashing_MurmurHash3.call(this);
  this.arraySeed$2 = 0;
  this.stringSeed$2 = 0;
  this.productSeed$2 = 0;
  this.symmetricSeed$2 = 0;
  this.traversableSeed$2 = 0;
  this.seqSeed$2 = 0;
  this.mapSeed$2 = 0;
  this.setSeed$2 = 0
}
$c_s_util_hashing_MurmurHash3$.prototype = new $h_s_util_hashing_MurmurHash3();
$c_s_util_hashing_MurmurHash3$.prototype.constructor = $c_s_util_hashing_MurmurHash3$;
/** @constructor */
function $h_s_util_hashing_MurmurHash3$() {
  /*<skip>*/
}
$h_s_util_hashing_MurmurHash3$.prototype = $c_s_util_hashing_MurmurHash3$.prototype;
$c_s_util_hashing_MurmurHash3$.prototype.init___ = (function() {
  $n_s_util_hashing_MurmurHash3$ = this;
  this.seqSeed$2 = $m_sjsr_RuntimeString$().hashCode__T__I("Seq");
  this.mapSeed$2 = $m_sjsr_RuntimeString$().hashCode__T__I("Map");
  this.setSeed$2 = $m_sjsr_RuntimeString$().hashCode__T__I("Set");
  return this
});
$c_s_util_hashing_MurmurHash3$.prototype.seqHash__sc_Seq__I = (function(xs) {
  if ($is_sci_List(xs)) {
    var x2 = $as_sci_List(xs);
    return this.listHash__sci_List__I__I(x2, this.seqSeed$2)
  } else {
    return this.orderedHash__sc_TraversableOnce__I__I(xs, this.seqSeed$2)
  }
});
var $d_s_util_hashing_MurmurHash3$ = new $TypeData().initClass({
  s_util_hashing_MurmurHash3$: 0
}, false, "scala.util.hashing.MurmurHash3$", {
  s_util_hashing_MurmurHash3$: 1,
  s_util_hashing_MurmurHash3: 1,
  O: 1
});
$c_s_util_hashing_MurmurHash3$.prototype.$classData = $d_s_util_hashing_MurmurHash3$;
var $n_s_util_hashing_MurmurHash3$ = (void 0);
function $m_s_util_hashing_MurmurHash3$() {
  if ((!$n_s_util_hashing_MurmurHash3$)) {
    $n_s_util_hashing_MurmurHash3$ = new $c_s_util_hashing_MurmurHash3$().init___()
  };
  return $n_s_util_hashing_MurmurHash3$
}
/** @constructor */
function $c_scg_GenSetFactory() {
  $c_scg_GenericCompanion.call(this)
}
$c_scg_GenSetFactory.prototype = new $h_scg_GenericCompanion();
$c_scg_GenSetFactory.prototype.constructor = $c_scg_GenSetFactory;
/** @constructor */
function $h_scg_GenSetFactory() {
  /*<skip>*/
}
$h_scg_GenSetFactory.prototype = $c_scg_GenSetFactory.prototype;
/** @constructor */
function $c_scg_GenTraversableFactory() {
  $c_scg_GenericCompanion.call(this);
  this.ReusableCBFInstance$2 = null
}
$c_scg_GenTraversableFactory.prototype = new $h_scg_GenericCompanion();
$c_scg_GenTraversableFactory.prototype.constructor = $c_scg_GenTraversableFactory;
/** @constructor */
function $h_scg_GenTraversableFactory() {
  /*<skip>*/
}
$h_scg_GenTraversableFactory.prototype = $c_scg_GenTraversableFactory.prototype;
$c_scg_GenTraversableFactory.prototype.init___ = (function() {
  this.ReusableCBFInstance$2 = new $c_scg_GenTraversableFactory$$anon$1().init___scg_GenTraversableFactory(this);
  return this
});
/** @constructor */
function $c_scg_GenTraversableFactory$GenericCanBuildFrom() {
  $c_O.call(this);
  this.$$outer$f = null
}
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype = new $h_O();
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.constructor = $c_scg_GenTraversableFactory$GenericCanBuildFrom;
/** @constructor */
function $h_scg_GenTraversableFactory$GenericCanBuildFrom() {
  /*<skip>*/
}
$h_scg_GenTraversableFactory$GenericCanBuildFrom.prototype = $c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype;
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.apply__scm_Builder = (function() {
  return this.$$outer$f.newBuilder__scm_Builder()
});
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.apply__O__scm_Builder = (function(from) {
  var from$1 = $as_sc_GenTraversable(from);
  return from$1.companion__scg_GenericCompanion().newBuilder__scm_Builder()
});
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.init___scg_GenTraversableFactory = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  return this
});
/** @constructor */
function $c_scg_MapFactory() {
  $c_scg_GenMapFactory.call(this)
}
$c_scg_MapFactory.prototype = new $h_scg_GenMapFactory();
$c_scg_MapFactory.prototype.constructor = $c_scg_MapFactory;
/** @constructor */
function $h_scg_MapFactory() {
  /*<skip>*/
}
$h_scg_MapFactory.prototype = $c_scg_MapFactory.prototype;
/** @constructor */
function $c_sci_List$$anon$1() {
  $c_O.call(this)
}
$c_sci_List$$anon$1.prototype = new $h_O();
$c_sci_List$$anon$1.prototype.constructor = $c_sci_List$$anon$1;
/** @constructor */
function $h_sci_List$$anon$1() {
  /*<skip>*/
}
$h_sci_List$$anon$1.prototype = $c_sci_List$$anon$1.prototype;
$c_sci_List$$anon$1.prototype.init___ = (function() {
  return this
});
$c_sci_List$$anon$1.prototype.apply__O__O = (function(x) {
  return this
});
$c_sci_List$$anon$1.prototype.toString__T = (function() {
  return "<function1>"
});
var $d_sci_List$$anon$1 = new $TypeData().initClass({
  sci_List$$anon$1: 0
}, false, "scala.collection.immutable.List$$anon$1", {
  sci_List$$anon$1: 1,
  O: 1,
  F1: 1
});
$c_sci_List$$anon$1.prototype.$classData = $d_sci_List$$anon$1;
function $is_scm_Builder(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_Builder)))
}
function $as_scm_Builder(obj) {
  return (($is_scm_Builder(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.Builder"))
}
function $isArrayOf_scm_Builder(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_Builder)))
}
function $asArrayOf_scm_Builder(obj, depth) {
  return (($isArrayOf_scm_Builder(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.Builder;", depth))
}
/** @constructor */
function $c_sr_AbstractFunction0() {
  $c_O.call(this)
}
$c_sr_AbstractFunction0.prototype = new $h_O();
$c_sr_AbstractFunction0.prototype.constructor = $c_sr_AbstractFunction0;
/** @constructor */
function $h_sr_AbstractFunction0() {
  /*<skip>*/
}
$h_sr_AbstractFunction0.prototype = $c_sr_AbstractFunction0.prototype;
$c_sr_AbstractFunction0.prototype.toString__T = (function() {
  return "<function0>"
});
/** @constructor */
function $c_sr_AbstractFunction1() {
  $c_O.call(this)
}
$c_sr_AbstractFunction1.prototype = new $h_O();
$c_sr_AbstractFunction1.prototype.constructor = $c_sr_AbstractFunction1;
/** @constructor */
function $h_sr_AbstractFunction1() {
  /*<skip>*/
}
$h_sr_AbstractFunction1.prototype = $c_sr_AbstractFunction1.prototype;
$c_sr_AbstractFunction1.prototype.init___ = (function() {
  return this
});
$c_sr_AbstractFunction1.prototype.toString__T = (function() {
  return "<function1>"
});
/** @constructor */
function $c_sr_AbstractFunction2() {
  $c_O.call(this)
}
$c_sr_AbstractFunction2.prototype = new $h_O();
$c_sr_AbstractFunction2.prototype.constructor = $c_sr_AbstractFunction2;
/** @constructor */
function $h_sr_AbstractFunction2() {
  /*<skip>*/
}
$h_sr_AbstractFunction2.prototype = $c_sr_AbstractFunction2.prototype;
$c_sr_AbstractFunction2.prototype.toString__T = (function() {
  return "<function2>"
});
/** @constructor */
function $c_sr_AbstractFunction3() {
  $c_O.call(this)
}
$c_sr_AbstractFunction3.prototype = new $h_O();
$c_sr_AbstractFunction3.prototype.constructor = $c_sr_AbstractFunction3;
/** @constructor */
function $h_sr_AbstractFunction3() {
  /*<skip>*/
}
$h_sr_AbstractFunction3.prototype = $c_sr_AbstractFunction3.prototype;
$c_sr_AbstractFunction3.prototype.toString__T = (function() {
  return "<function3>"
});
/** @constructor */
function $c_sr_BooleanRef() {
  $c_O.call(this);
  this.elem$1 = false
}
$c_sr_BooleanRef.prototype = new $h_O();
$c_sr_BooleanRef.prototype.constructor = $c_sr_BooleanRef;
/** @constructor */
function $h_sr_BooleanRef() {
  /*<skip>*/
}
$h_sr_BooleanRef.prototype = $c_sr_BooleanRef.prototype;
$c_sr_BooleanRef.prototype.toString__T = (function() {
  var value = this.elem$1;
  return ("" + value)
});
$c_sr_BooleanRef.prototype.init___Z = (function(elem) {
  this.elem$1 = elem;
  return this
});
var $d_sr_BooleanRef = new $TypeData().initClass({
  sr_BooleanRef: 0
}, false, "scala.runtime.BooleanRef", {
  sr_BooleanRef: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_sr_BooleanRef.prototype.$classData = $d_sr_BooleanRef;
/** @constructor */
function $c_sr_IntRef() {
  $c_O.call(this);
  this.elem$1 = 0
}
$c_sr_IntRef.prototype = new $h_O();
$c_sr_IntRef.prototype.constructor = $c_sr_IntRef;
/** @constructor */
function $h_sr_IntRef() {
  /*<skip>*/
}
$h_sr_IntRef.prototype = $c_sr_IntRef.prototype;
$c_sr_IntRef.prototype.toString__T = (function() {
  var value = this.elem$1;
  return ("" + value)
});
$c_sr_IntRef.prototype.init___I = (function(elem) {
  this.elem$1 = elem;
  return this
});
var $d_sr_IntRef = new $TypeData().initClass({
  sr_IntRef: 0
}, false, "scala.runtime.IntRef", {
  sr_IntRef: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_sr_IntRef.prototype.$classData = $d_sr_IntRef;
/** @constructor */
function $c_sr_ObjectRef() {
  $c_O.call(this);
  this.elem$1 = null
}
$c_sr_ObjectRef.prototype = new $h_O();
$c_sr_ObjectRef.prototype.constructor = $c_sr_ObjectRef;
/** @constructor */
function $h_sr_ObjectRef() {
  /*<skip>*/
}
$h_sr_ObjectRef.prototype = $c_sr_ObjectRef.prototype;
$c_sr_ObjectRef.prototype.toString__T = (function() {
  return $m_sjsr_RuntimeString$().valueOf__O__T(this.elem$1)
});
$c_sr_ObjectRef.prototype.init___O = (function(elem) {
  this.elem$1 = elem;
  return this
});
var $d_sr_ObjectRef = new $TypeData().initClass({
  sr_ObjectRef: 0
}, false, "scala.runtime.ObjectRef", {
  sr_ObjectRef: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_sr_ObjectRef.prototype.$classData = $d_sr_ObjectRef;
/** @constructor */
function $c_Ljapgolly_scalajs_react_ReactComponentC$BaseCtor() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_ReactComponentC$BaseCtor.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_ReactComponentC$BaseCtor.prototype.constructor = $c_Ljapgolly_scalajs_react_ReactComponentC$BaseCtor;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ReactComponentC$BaseCtor() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ReactComponentC$BaseCtor.prototype = $c_Ljapgolly_scalajs_react_ReactComponentC$BaseCtor.prototype;
$c_Ljapgolly_scalajs_react_ReactComponentC$BaseCtor.prototype.mkProps__O__Ljapgolly_scalajs_react_package$WrapObj = (function(props) {
  var j = $m_Ljapgolly_scalajs_react_package$().WrapObj__O__Ljapgolly_scalajs_react_package$WrapObj(props);
  var $$this = this.key__sjs_js_UndefOr();
  if (($$this !== (void 0))) {
    j["key"] = $$this
  };
  var $$this$1 = this.ref__sjs_js_UndefOr();
  if (($$this$1 !== (void 0))) {
    var r = $as_T($$this$1);
    j["ref"] = r
  };
  return j
});
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_AbsUrl$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_extra_router_AbsUrl$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_AbsUrl$.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_AbsUrl$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_AbsUrl$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_AbsUrl$.prototype = $c_Ljapgolly_scalajs_react_extra_router_AbsUrl$.prototype;
$c_Ljapgolly_scalajs_react_extra_router_AbsUrl$.prototype.fromWindow__Ljapgolly_scalajs_react_extra_router_AbsUrl = (function() {
  return new $c_Ljapgolly_scalajs_react_extra_router_AbsUrl().init___T($as_T($g["window"]["location"]["href"]))
});
var $d_Ljapgolly_scalajs_react_extra_router_AbsUrl$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_AbsUrl$: 0
}, false, "japgolly.scalajs.react.extra.router.AbsUrl$", {
  Ljapgolly_scalajs_react_extra_router_AbsUrl$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_AbsUrl$.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_AbsUrl$;
var $n_Ljapgolly_scalajs_react_extra_router_AbsUrl$ = (void 0);
function $m_Ljapgolly_scalajs_react_extra_router_AbsUrl$() {
  if ((!$n_Ljapgolly_scalajs_react_extra_router_AbsUrl$)) {
    $n_Ljapgolly_scalajs_react_extra_router_AbsUrl$ = new $c_Ljapgolly_scalajs_react_extra_router_AbsUrl$().init___()
  };
  return $n_Ljapgolly_scalajs_react_extra_router_AbsUrl$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_BaseUrl$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl$.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_BaseUrl$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_BaseUrl$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_BaseUrl$.prototype = $c_Ljapgolly_scalajs_react_extra_router_BaseUrl$.prototype;
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl$.prototype.fromWindowOrigin__Ljapgolly_scalajs_react_extra_router_BaseUrl = (function() {
  return new $c_Ljapgolly_scalajs_react_extra_router_BaseUrl().init___T($as_T($g["window"]["location"]["origin"]))
});
var $d_Ljapgolly_scalajs_react_extra_router_BaseUrl$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_BaseUrl$: 0
}, false, "japgolly.scalajs.react.extra.router.BaseUrl$", {
  Ljapgolly_scalajs_react_extra_router_BaseUrl$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl$.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_BaseUrl$;
var $n_Ljapgolly_scalajs_react_extra_router_BaseUrl$ = (void 0);
function $m_Ljapgolly_scalajs_react_extra_router_BaseUrl$() {
  if ((!$n_Ljapgolly_scalajs_react_extra_router_BaseUrl$)) {
    $n_Ljapgolly_scalajs_react_extra_router_BaseUrl$ = new $c_Ljapgolly_scalajs_react_extra_router_BaseUrl$().init___()
  };
  return $n_Ljapgolly_scalajs_react_extra_router_BaseUrl$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouterConfig$() {
  $c_O.call(this);
  this.nopLogger$1 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouterConfig$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_RouterConfig$.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouterConfig$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouterConfig$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouterConfig$.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouterConfig$.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouterConfig$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_extra_router_RouterConfig$ = this;
  this.nopLogger$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(y$2) {
    $as_F0(y$2);
    return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($m_Ljapgolly_scalajs_react_Callback$().empty$1).japgolly$scalajs$react$CallbackTo$$f$1)
  }));
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfig$.prototype.defaultPostRenderFn__F2 = (function() {
  $m_Ljapgolly_scalajs_react_Callback$();
  var f = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function() {
    $g["window"]["scrollTo"](0, 0)
  }));
  var cb = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(f$1) {
    return (function() {
      f$1.apply__O()
    })
  })(f));
  return new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function(cb$1) {
    return (function(x$7$2, x$8$2) {
      $as_s_Option(x$7$2);
      return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(cb$1)
    })
  })(cb))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfig$.prototype.defaultRenderFn__F2 = (function() {
  return new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function(x$6$2, r$2) {
    $as_Ljapgolly_scalajs_react_extra_router_RouterCtl(x$6$2);
    var r = $as_Ljapgolly_scalajs_react_extra_router_Resolution(r$2);
    return r.render$1.apply__O()
  }))
});
var $d_Ljapgolly_scalajs_react_extra_router_RouterConfig$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouterConfig$: 0
}, false, "japgolly.scalajs.react.extra.router.RouterConfig$", {
  Ljapgolly_scalajs_react_extra_router_RouterConfig$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfig$.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouterConfig$;
var $n_Ljapgolly_scalajs_react_extra_router_RouterConfig$ = (void 0);
function $m_Ljapgolly_scalajs_react_extra_router_RouterConfig$() {
  if ((!$n_Ljapgolly_scalajs_react_extra_router_RouterConfig$)) {
    $n_Ljapgolly_scalajs_react_extra_router_RouterConfig$ = new $c_Ljapgolly_scalajs_react_extra_router_RouterConfig$().init___()
  };
  return $n_Ljapgolly_scalajs_react_extra_router_RouterConfig$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouterLogic() {
  $c_O.call(this);
  this.baseUrl$1 = null;
  this.japgolly$scalajs$react$extra$router$RouterLogic$$cfg$f = null;
  this.syncToWindowUrl$1 = null;
  this.ctlByPath$1 = null;
  this.ctl$1 = null;
  this.japgolly$scalajs$react$extra$Broadcaster$$$undlisteners$1 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouterLogic;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouterLogic() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype.init___Ljapgolly_scalajs_react_extra_router_BaseUrl__Ljapgolly_scalajs_react_extra_router_RouterConfig = (function(baseUrl, cfg) {
  this.baseUrl$1 = baseUrl;
  this.japgolly$scalajs$react$extra$router$RouterLogic$$cfg$f = cfg;
  this.japgolly$scalajs$react$extra$Broadcaster$$$undlisteners$1 = ($m_sci_List$(), $m_sci_Nil$());
  this.syncToWindowUrl$1 = $m_Ljapgolly_scalajs_react_CallbackTo$().flatMap$extension__F0__F1__F0(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function() {
    return $m_Ljapgolly_scalajs_react_extra_router_AbsUrl$().fromWindow__Ljapgolly_scalajs_react_extra_router_AbsUrl()
  })), new $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2().init___Ljapgolly_scalajs_react_extra_router_RouterLogic(this));
  this.ctlByPath$1 = new $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anon$1().init___Ljapgolly_scalajs_react_extra_router_RouterLogic(this);
  var this$3 = this.ctlByPath$1;
  var f$1 = cfg.path$1;
  this.ctl$1 = new $c_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap().init___Ljapgolly_scalajs_react_extra_router_RouterCtl__F1(this$3, f$1);
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype.redirectToPath__Ljapgolly_scalajs_react_extra_router_Path__Ljapgolly_scalajs_react_extra_router_Redirect$Method__Ljapgolly_scalajs_react_extra_router_RouteCmd = (function(path, method) {
  var jsx$1 = this.redirectCmd__Ljapgolly_scalajs_react_extra_router_Path__Ljapgolly_scalajs_react_extra_router_Redirect$Method__Ljapgolly_scalajs_react_extra_router_RouteCmd(path, method);
  var base = this.baseUrl$1;
  return jsx$1.$$greater$greater__Ljapgolly_scalajs_react_extra_router_RouteCmd__Ljapgolly_scalajs_react_extra_router_RouteCmd(this.syncToUrl__Ljapgolly_scalajs_react_extra_router_AbsUrl__Ljapgolly_scalajs_react_extra_router_RouteCmd(base.apply__Ljapgolly_scalajs_react_extra_router_Path__Ljapgolly_scalajs_react_extra_router_AbsUrl(path)))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype.syncToUrl__Ljapgolly_scalajs_react_extra_router_AbsUrl__Ljapgolly_scalajs_react_extra_router_RouteCmd = (function(url) {
  var x1 = this.parseUrl__Ljapgolly_scalajs_react_extra_router_AbsUrl__s_Option(url);
  if ($is_s_Some(x1)) {
    var x2 = $as_s_Some(x1);
    var path = $as_Ljapgolly_scalajs_react_extra_router_Path(x2.x$2);
    return this.syncToPath__Ljapgolly_scalajs_react_extra_router_Path__Ljapgolly_scalajs_react_extra_router_RouteCmd(path)
  } else {
    var x = $m_s_None$();
    if ((x === x1)) {
      return this.wrongBase__Ljapgolly_scalajs_react_extra_router_AbsUrl__Ljapgolly_scalajs_react_extra_router_RouteCmd(url)
    } else {
      throw new $c_s_MatchError().init___O(x1)
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype.parseUrl__Ljapgolly_scalajs_react_extra_router_AbsUrl__s_Option = (function(url) {
  var thiz = url.value$2;
  var prefix = this.baseUrl$1.value$2;
  if ((($uI(thiz["length"]) >= 0) && ($as_T(thiz["substring"](0, $uI(prefix["length"]))) === prefix))) {
    var thiz$2 = url.value$2;
    var thiz$1 = this.baseUrl$1.value$2;
    var beginIndex = $uI(thiz$1["length"]);
    return new $c_s_Some().init___O(new $c_Ljapgolly_scalajs_react_extra_router_Path().init___T($as_T(thiz$2["substring"](beginIndex))))
  } else {
    return $m_s_None$()
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype.interpret__Ljapgolly_scalajs_react_extra_router_RouteCmd__F0 = (function(r) {
  if ($is_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState(r)) {
    var x2 = $as_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState(r);
    var url = x2.url$2;
    var this$2 = $m_Ljapgolly_scalajs_react_CallbackTo$();
    var $$this = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(arg$outer, url$1) {
      return (function() {
        $g["window"]["history"]["pushState"]({}, "", url$1.value$2)
      })
    })(this, url));
    var runBefore = $as_Ljapgolly_scalajs_react_CallbackTo(this.japgolly$scalajs$react$extra$router$RouterLogic$$cfg$f.logger$1.apply__O__O(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(url$1$1) {
      return (function() {
        return new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["PushState: [", "]"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([url$1$1.value$2]))
      })
    })(url)))).japgolly$scalajs$react$CallbackTo$$f$1;
    var ev$1 = new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(this$2.$$greater$greater$extension__F0__F0__F0(runBefore, $$this));
    return ev$1.japgolly$scalajs$react$CallbackTo$$f$1
  } else if ($is_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState(r)) {
    var x3 = $as_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState(r);
    var url$2 = x3.url$2;
    var this$4 = $m_Ljapgolly_scalajs_react_CallbackTo$();
    var $$this$1 = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(arg$outer$1, url$2$1) {
      return (function() {
        $g["window"]["history"]["replaceState"]({}, "", url$2$1.value$2)
      })
    })(this, url$2));
    var runBefore$1 = $as_Ljapgolly_scalajs_react_CallbackTo(this.japgolly$scalajs$react$extra$router$RouterLogic$$cfg$f.logger$1.apply__O__O(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(url$2$2) {
      return (function() {
        return new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["ReplaceState: [", "]"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([url$2$2.value$2]))
      })
    })(url$2)))).japgolly$scalajs$react$CallbackTo$$f$1;
    var ev$2 = new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(this$4.$$greater$greater$extension__F0__F0__F0(runBefore$1, $$this$1));
    return ev$2.japgolly$scalajs$react$CallbackTo$$f$1
  } else {
    var x = $m_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$();
    if ((x === r)) {
      var this$5 = $m_Ljapgolly_scalajs_react_CallbackTo$();
      var $$this$2 = $s_Ljapgolly_scalajs_react_extra_Broadcaster$class__broadcast__Ljapgolly_scalajs_react_extra_Broadcaster__O__F0(this, (void 0));
      var runBefore$2 = $as_Ljapgolly_scalajs_react_CallbackTo(this.japgolly$scalajs$react$extra$router$RouterLogic$$cfg$f.logger$1.apply__O__O(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function() {
        return "Broadcasting sync request."
      })))).japgolly$scalajs$react$CallbackTo$$f$1;
      var ev$3 = new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(this$5.$$greater$greater$extension__F0__F0__F0(runBefore$2, $$this$2));
      return ev$3.japgolly$scalajs$react$CallbackTo$$f$1
    } else if ($is_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return(r)) {
      var x4 = $as_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return(r);
      var a = x4.a$2;
      return new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(a$1) {
        return (function() {
          return a$1
        })
      })(a))
    } else if ($is_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log(r)) {
      var x5 = $as_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log(r);
      var msg = x5.msg$2;
      var ev$4 = this.japgolly$scalajs$react$extra$router$RouterLogic$$cfg$f.logger$1.apply__O__O(msg);
      return ((ev$4 === null) ? null : $as_Ljapgolly_scalajs_react_CallbackTo(ev$4).japgolly$scalajs$react$CallbackTo$$f$1)
    } else if ($is_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence(r)) {
      var x6 = $as_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence(r);
      var a$2 = x6.init$2;
      var b = x6.last$2;
      var jsx$1 = $m_Ljapgolly_scalajs_react_CallbackTo$();
      var z = new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($m_Ljapgolly_scalajs_react_Callback$().empty$1);
      var elem$1 = null;
      elem$1 = z;
      var this$8 = a$2.iterator__sci_VectorIterator();
      while (this$8.$$undhasNext$2) {
        var arg1 = this$8.next__O();
        var arg1$1 = elem$1;
        var x$7 = $as_Ljapgolly_scalajs_react_CallbackTo(arg1$1).japgolly$scalajs$react$CallbackTo$$f$1;
        var x$8 = $as_Ljapgolly_scalajs_react_extra_router_RouteCmd(arg1);
        elem$1 = new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($m_Ljapgolly_scalajs_react_CallbackTo$().$$greater$greater$extension__F0__F0__F0(x$7, this.interpret__Ljapgolly_scalajs_react_extra_router_RouteCmd__F0(x$8)))
      };
      return jsx$1.$$greater$greater$extension__F0__F0__F0($as_Ljapgolly_scalajs_react_CallbackTo(elem$1).japgolly$scalajs$react$CallbackTo$$f$1, this.interpret__Ljapgolly_scalajs_react_extra_router_RouteCmd__F0(b))
    } else {
      throw new $c_s_MatchError().init___O(r)
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype.wrongBase__Ljapgolly_scalajs_react_extra_router_AbsUrl__Ljapgolly_scalajs_react_extra_router_RouteCmd = (function(wrongUrl) {
  var root = new $c_Ljapgolly_scalajs_react_extra_router_Path().init___T("");
  var msg = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(arg$outer, wrongUrl$1, root$1) {
    return (function() {
      var jsx$2 = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Wrong base: [", "] is outside of [", "]."]));
      var jsx$1 = wrongUrl$1.value$2;
      var base = arg$outer.baseUrl$1;
      return jsx$2.s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([jsx$1, base.apply__Ljapgolly_scalajs_react_extra_router_Path__Ljapgolly_scalajs_react_extra_router_AbsUrl(root$1)]))
    })
  })(this, wrongUrl, root));
  return new $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log().init___F0(msg).$$greater$greater__Ljapgolly_scalajs_react_extra_router_RouteCmd__Ljapgolly_scalajs_react_extra_router_RouteCmd(this.redirectToPath__Ljapgolly_scalajs_react_extra_router_Path__Ljapgolly_scalajs_react_extra_router_Redirect$Method__Ljapgolly_scalajs_react_extra_router_RouteCmd(root, $m_Ljapgolly_scalajs_react_extra_router_Redirect$Push$()))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype.render__Ljapgolly_scalajs_react_extra_router_Resolution__Ljapgolly_scalajs_react_ReactElement = (function(r) {
  return this.japgolly$scalajs$react$extra$router$RouterLogic$$cfg$f.renderFn$1.apply__O__O__O(this.ctl$1, r)
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype.redirectCmd__Ljapgolly_scalajs_react_extra_router_Path__Ljapgolly_scalajs_react_extra_router_Redirect$Method__Ljapgolly_scalajs_react_extra_router_RouteCmd = (function(p, m) {
  var x = $m_Ljapgolly_scalajs_react_extra_router_Redirect$Push$();
  if ((x === m)) {
    var base = this.baseUrl$1;
    return new $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState().init___Ljapgolly_scalajs_react_extra_router_AbsUrl(base.apply__Ljapgolly_scalajs_react_extra_router_Path__Ljapgolly_scalajs_react_extra_router_AbsUrl(p))
  } else {
    var x$3 = $m_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$();
    if ((x$3 === m)) {
      var base$1 = this.baseUrl$1;
      return new $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState().init___Ljapgolly_scalajs_react_extra_router_AbsUrl(base$1.apply__Ljapgolly_scalajs_react_extra_router_Path__Ljapgolly_scalajs_react_extra_router_AbsUrl(p))
    } else {
      throw new $c_s_MatchError().init___O(m)
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype.cmdOrPure__p1__s_util_Either__Ljapgolly_scalajs_react_extra_router_RouteCmd = (function(e) {
  if ($is_s_util_Left(e)) {
    var x2 = $as_s_util_Left(e);
    var a = x2.a$2;
    var jsx$1 = $as_Ljapgolly_scalajs_react_extra_router_RouteCmd(a)
  } else if ($is_s_util_Right(e)) {
    var x3 = $as_s_util_Right(e);
    var b = x3.b$2;
    var jsx$1 = new $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return().init___O(b)
  } else {
    var jsx$1;
    throw new $c_s_MatchError().init___O(e)
  };
  return $as_Ljapgolly_scalajs_react_extra_router_RouteCmd(jsx$1)
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype.syncToPath__Ljapgolly_scalajs_react_extra_router_Path__Ljapgolly_scalajs_react_extra_router_RouteCmd = (function(path) {
  var x1 = $as_s_util_Either(this.japgolly$scalajs$react$extra$router$RouterLogic$$cfg$f.parse$1.apply__O__O(path));
  if ($is_s_util_Right(x1)) {
    var x2 = $as_s_util_Right(x1);
    var page = x2.b$2;
    return this.resolve__O__Ljapgolly_scalajs_react_extra_router_Action__Ljapgolly_scalajs_react_extra_router_RouteCmd(page, $as_Ljapgolly_scalajs_react_extra_router_Action(this.japgolly$scalajs$react$extra$router$RouterLogic$$cfg$f.action$1.apply__O__O(page)))
  } else if ($is_s_util_Left(x1)) {
    var x3 = $as_s_util_Left(x1);
    var r = $as_Ljapgolly_scalajs_react_extra_router_Redirect(x3.a$2);
    return this.redirect__Ljapgolly_scalajs_react_extra_router_Redirect__Ljapgolly_scalajs_react_extra_router_RouteCmd(r)
  } else {
    throw new $c_s_MatchError().init___O(x1)
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype.redirect__Ljapgolly_scalajs_react_extra_router_Redirect__Ljapgolly_scalajs_react_extra_router_RouteCmd = (function(r) {
  if ($is_Ljapgolly_scalajs_react_extra_router_RedirectToPage(r)) {
    var x2 = $as_Ljapgolly_scalajs_react_extra_router_RedirectToPage(r);
    var page = x2.page$1;
    var m = x2.method$1;
    return this.redirectToPath__Ljapgolly_scalajs_react_extra_router_Path__Ljapgolly_scalajs_react_extra_router_Redirect$Method__Ljapgolly_scalajs_react_extra_router_RouteCmd($as_Ljapgolly_scalajs_react_extra_router_Path(this.japgolly$scalajs$react$extra$router$RouterLogic$$cfg$f.path$1.apply__O__O(page)), m)
  } else if ($is_Ljapgolly_scalajs_react_extra_router_RedirectToPath(r)) {
    var x3 = $as_Ljapgolly_scalajs_react_extra_router_RedirectToPath(r);
    var path = x3.path$1;
    var m$2 = x3.method$1;
    return this.redirectToPath__Ljapgolly_scalajs_react_extra_router_Path__Ljapgolly_scalajs_react_extra_router_Redirect$Method__Ljapgolly_scalajs_react_extra_router_RouteCmd(path, m$2)
  } else {
    throw new $c_s_MatchError().init___O(r)
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype.resolveAction__Ljapgolly_scalajs_react_extra_router_Action__s_util_Either = (function(a) {
  if ($is_Ljapgolly_scalajs_react_extra_router_Renderer(a)) {
    var x2 = $as_Ljapgolly_scalajs_react_extra_router_Renderer(a);
    $m_s_package$();
    return new $c_s_util_Right().init___O(x2)
  } else if ($is_Ljapgolly_scalajs_react_extra_router_Redirect(a)) {
    var x3 = $as_Ljapgolly_scalajs_react_extra_router_Redirect(a);
    $m_s_package$();
    var a$1 = this.redirect__Ljapgolly_scalajs_react_extra_router_Redirect__Ljapgolly_scalajs_react_extra_router_RouteCmd(x3);
    return new $c_s_util_Left().init___O(a$1)
  } else {
    throw new $c_s_MatchError().init___O(a)
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype.resolve__O__Ljapgolly_scalajs_react_extra_router_Action__Ljapgolly_scalajs_react_extra_router_RouteCmd = (function(page, action) {
  return this.cmdOrPure__p1__s_util_Either__Ljapgolly_scalajs_react_extra_router_RouteCmd($m_Ljapgolly_scalajs_react_extra_router_package$SaneEitherMethods$().map$extension__s_util_Either__F1__s_util_Either(this.resolveAction__Ljapgolly_scalajs_react_extra_router_Action__s_util_Either(action), new $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$resolve$1().init___Ljapgolly_scalajs_react_extra_router_RouterLogic__O(this, page)))
});
var $d_Ljapgolly_scalajs_react_extra_router_RouterLogic = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouterLogic: 0
}, false, "japgolly.scalajs.react.extra.router.RouterLogic", {
  Ljapgolly_scalajs_react_extra_router_RouterLogic: 1,
  O: 1,
  Ljapgolly_scalajs_react_extra_Broadcaster: 1,
  Ljapgolly_scalajs_react_extra_Listenable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouterLogic;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$.prototype = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$.prototype;
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$.prototype.parseOnly__F1__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule = (function(parse) {
  return new $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule().init___F1__F1__F1(parse, new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$30$2) {
    return $m_s_None$()
  })), new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$31$2) {
    return $m_s_None$()
  })))
});
var $d_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$: 0
}, false, "japgolly.scalajs.react.extra.router.StaticDsl$Rule$", {
  Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$;
var $n_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$ = (void 0);
function $m_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$() {
  if ((!$n_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$)) {
    $n_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$ = new $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$().init___()
  };
  return $n_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_package$Base() {
  $c_Ljapgolly_scalajs_react_vdom_Implicits.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_package$Base.prototype = new $h_Ljapgolly_scalajs_react_vdom_Implicits();
$c_Ljapgolly_scalajs_react_vdom_package$Base.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_package$Base;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_package$Base() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_package$Base.prototype = $c_Ljapgolly_scalajs_react_vdom_package$Base.prototype;
/** @constructor */
function $c_Ljava_io_OutputStream() {
  $c_O.call(this)
}
$c_Ljava_io_OutputStream.prototype = new $h_O();
$c_Ljava_io_OutputStream.prototype.constructor = $c_Ljava_io_OutputStream;
/** @constructor */
function $h_Ljava_io_OutputStream() {
  /*<skip>*/
}
$h_Ljava_io_OutputStream.prototype = $c_Ljava_io_OutputStream.prototype;
var $d_jl_Byte = new $TypeData().initClass({
  jl_Byte: 0
}, false, "java.lang.Byte", {
  jl_Byte: 1,
  jl_Number: 1,
  O: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $isByte(x)
}));
function $isArrayOf_jl_Double(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Double)))
}
function $asArrayOf_jl_Double(obj, depth) {
  return (($isArrayOf_jl_Double(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Double;", depth))
}
var $d_jl_Double = new $TypeData().initClass({
  jl_Double: 0
}, false, "java.lang.Double", {
  jl_Double: 1,
  jl_Number: 1,
  O: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return ((typeof x) === "number")
}));
/** @constructor */
function $c_jl_Error() {
  $c_jl_Throwable.call(this)
}
$c_jl_Error.prototype = new $h_jl_Throwable();
$c_jl_Error.prototype.constructor = $c_jl_Error;
/** @constructor */
function $h_jl_Error() {
  /*<skip>*/
}
$h_jl_Error.prototype = $c_jl_Error.prototype;
$c_jl_Error.prototype.init___T = (function(s) {
  $c_jl_Error.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
/** @constructor */
function $c_jl_Exception() {
  $c_jl_Throwable.call(this)
}
$c_jl_Exception.prototype = new $h_jl_Throwable();
$c_jl_Exception.prototype.constructor = $c_jl_Exception;
/** @constructor */
function $h_jl_Exception() {
  /*<skip>*/
}
$h_jl_Exception.prototype = $c_jl_Exception.prototype;
$c_jl_Exception.prototype.init___T = (function(s) {
  $c_jl_Exception.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_Float = new $TypeData().initClass({
  jl_Float: 0
}, false, "java.lang.Float", {
  jl_Float: 1,
  jl_Number: 1,
  O: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $isFloat(x)
}));
function $isArrayOf_jl_Integer(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Integer)))
}
function $asArrayOf_jl_Integer(obj, depth) {
  return (($isArrayOf_jl_Integer(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Integer;", depth))
}
var $d_jl_Integer = new $TypeData().initClass({
  jl_Integer: 0
}, false, "java.lang.Integer", {
  jl_Integer: 1,
  jl_Number: 1,
  O: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $isInt(x)
}));
function $isArrayOf_jl_Long(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Long)))
}
function $asArrayOf_jl_Long(obj, depth) {
  return (($isArrayOf_jl_Long(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Long;", depth))
}
var $d_jl_Long = new $TypeData().initClass({
  jl_Long: 0
}, false, "java.lang.Long", {
  jl_Long: 1,
  jl_Number: 1,
  O: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $is_sjsr_RuntimeLong(x)
}));
var $d_jl_Short = new $TypeData().initClass({
  jl_Short: 0
}, false, "java.lang.Short", {
  jl_Short: 1,
  jl_Number: 1,
  O: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $isShort(x)
}));
/** @constructor */
function $c_ju_UUID() {
  $c_O.call(this);
  this.i1$1 = 0;
  this.i2$1 = 0;
  this.i3$1 = 0;
  this.i4$1 = 0;
  this.l1$1 = null;
  this.l2$1 = null
}
$c_ju_UUID.prototype = new $h_O();
$c_ju_UUID.prototype.constructor = $c_ju_UUID;
/** @constructor */
function $h_ju_UUID() {
  /*<skip>*/
}
$h_ju_UUID.prototype = $c_ju_UUID.prototype;
$c_ju_UUID.prototype.equals__O__Z = (function(that) {
  if ($is_ju_UUID(that)) {
    var x2 = $as_ju_UUID(that);
    return ((((this.i1$1 === x2.i1$1) && (this.i2$1 === x2.i2$1)) && (this.i3$1 === x2.i3$1)) && (this.i4$1 === x2.i4$1))
  } else {
    return false
  }
});
$c_ju_UUID.prototype.toString__T = (function() {
  var i = this.i1$1;
  var x = $uD((i >>> 0));
  var jsx$10 = x["toString"](16);
  var s = $as_T(jsx$10);
  var beginIndex = $uI(s["length"]);
  var jsx$11 = $as_T("00000000"["substring"](beginIndex));
  var i$1 = ((this.i2$1 >>> 16) | 0);
  var x$1 = $uD((i$1 >>> 0));
  var jsx$8 = x$1["toString"](16);
  var s$1 = $as_T(jsx$8);
  var beginIndex$1 = $uI(s$1["length"]);
  var jsx$9 = $as_T("0000"["substring"](beginIndex$1));
  var i$2 = (65535 & this.i2$1);
  var x$2 = $uD((i$2 >>> 0));
  var jsx$6 = x$2["toString"](16);
  var s$2 = $as_T(jsx$6);
  var beginIndex$2 = $uI(s$2["length"]);
  var jsx$7 = $as_T("0000"["substring"](beginIndex$2));
  var i$3 = ((this.i3$1 >>> 16) | 0);
  var x$3 = $uD((i$3 >>> 0));
  var jsx$4 = x$3["toString"](16);
  var s$3 = $as_T(jsx$4);
  var beginIndex$3 = $uI(s$3["length"]);
  var jsx$5 = $as_T("0000"["substring"](beginIndex$3));
  var i$4 = (65535 & this.i3$1);
  var x$4 = $uD((i$4 >>> 0));
  var jsx$2 = x$4["toString"](16);
  var s$4 = $as_T(jsx$2);
  var beginIndex$4 = $uI(s$4["length"]);
  var jsx$3 = $as_T("0000"["substring"](beginIndex$4));
  var i$5 = this.i4$1;
  var x$5 = $uD((i$5 >>> 0));
  var jsx$1 = x$5["toString"](16);
  var s$5 = $as_T(jsx$1);
  var beginIndex$5 = $uI(s$5["length"]);
  return ((((((((((("" + jsx$11) + s) + "-") + (("" + jsx$9) + s$1)) + "-") + (("" + jsx$7) + s$2)) + "-") + (("" + jsx$5) + s$3)) + "-") + (("" + jsx$3) + s$4)) + (("" + $as_T("00000000"["substring"](beginIndex$5))) + s$5))
});
$c_ju_UUID.prototype.init___I__I__I__I__jl_Long__jl_Long = (function(i1, i2, i3, i4, l1, l2) {
  this.i1$1 = i1;
  this.i2$1 = i2;
  this.i3$1 = i3;
  this.i4$1 = i4;
  this.l1$1 = l1;
  this.l2$1 = l2;
  return this
});
$c_ju_UUID.prototype.hashCode__I = (function() {
  return (((this.i1$1 ^ this.i2$1) ^ this.i3$1) ^ this.i4$1)
});
function $is_ju_UUID(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.ju_UUID)))
}
function $as_ju_UUID(obj) {
  return (($is_ju_UUID(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.util.UUID"))
}
function $isArrayOf_ju_UUID(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.ju_UUID)))
}
function $asArrayOf_ju_UUID(obj, depth) {
  return (($isArrayOf_ju_UUID(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.util.UUID;", depth))
}
var $d_ju_UUID = new $TypeData().initClass({
  ju_UUID: 0
}, false, "java.util.UUID", {
  ju_UUID: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
});
$c_ju_UUID.prototype.$classData = $d_ju_UUID;
/** @constructor */
function $c_ju_UUID$() {
  $c_O.call(this);
  this.TimeBased$1 = 0;
  this.DCESecurity$1 = 0;
  this.NameBased$1 = 0;
  this.Random$1 = 0;
  this.rng$1 = null;
  this.bitmap$0$1 = false
}
$c_ju_UUID$.prototype = new $h_O();
$c_ju_UUID$.prototype.constructor = $c_ju_UUID$;
/** @constructor */
function $h_ju_UUID$() {
  /*<skip>*/
}
$h_ju_UUID$.prototype = $c_ju_UUID$.prototype;
$c_ju_UUID$.prototype.fail$1__p1__T__sr_Nothing$ = (function(name$1) {
  throw new $c_jl_IllegalArgumentException().init___T(("Invalid UUID string: " + name$1))
});
$c_ju_UUID$.prototype.fromString__T__ju_UUID = (function(name) {
  if (((((($uI(name["length"]) !== 36) || ((65535 & $uI(name["charCodeAt"](8))) !== 45)) || ((65535 & $uI(name["charCodeAt"](13))) !== 45)) || ((65535 & $uI(name["charCodeAt"](18))) !== 45)) || ((65535 & $uI(name["charCodeAt"](23))) !== 45))) {
    this.fail$1__p1__T__sr_Nothing$(name)
  };
  try {
    var his = $as_T(name["substring"](0, 4));
    var los = $as_T(name["substring"](4, 8));
    var i1 = (($m_jl_Integer$().parseInt__T__I__I(his, 16) << 16) | $m_jl_Integer$().parseInt__T__I__I(los, 16));
    var his$1 = $as_T(name["substring"](9, 13));
    var los$1 = $as_T(name["substring"](14, 18));
    var i2 = (($m_jl_Integer$().parseInt__T__I__I(his$1, 16) << 16) | $m_jl_Integer$().parseInt__T__I__I(los$1, 16));
    var his$2 = $as_T(name["substring"](19, 23));
    var los$2 = $as_T(name["substring"](24, 28));
    var i3 = (($m_jl_Integer$().parseInt__T__I__I(his$2, 16) << 16) | $m_jl_Integer$().parseInt__T__I__I(los$2, 16));
    var his$3 = $as_T(name["substring"](28, 32));
    var los$3 = $as_T(name["substring"](32, 36));
    var i4 = (($m_jl_Integer$().parseInt__T__I__I(his$3, 16) << 16) | $m_jl_Integer$().parseInt__T__I__I(los$3, 16));
    return new $c_ju_UUID().init___I__I__I__I__jl_Long__jl_Long(i1, i2, i3, i4, null, null)
  } catch (e) {
    if ($is_jl_NumberFormatException(e)) {
      this.fail$1__p1__T__sr_Nothing$(name)
    } else {
      throw e
    }
  }
});
var $d_ju_UUID$ = new $TypeData().initClass({
  ju_UUID$: 0
}, false, "java.util.UUID$", {
  ju_UUID$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_ju_UUID$.prototype.$classData = $d_ju_UUID$;
var $n_ju_UUID$ = (void 0);
function $m_ju_UUID$() {
  if ((!$n_ju_UUID$)) {
    $n_ju_UUID$ = new $c_ju_UUID$().init___()
  };
  return $n_ju_UUID$
}
/** @constructor */
function $c_ju_regex_Pattern() {
  $c_O.call(this);
  this.jsRegExp$1 = null;
  this.$$undpattern$1 = null;
  this.$$undflags$1 = 0
}
$c_ju_regex_Pattern.prototype = new $h_O();
$c_ju_regex_Pattern.prototype.constructor = $c_ju_regex_Pattern;
/** @constructor */
function $h_ju_regex_Pattern() {
  /*<skip>*/
}
$h_ju_regex_Pattern.prototype = $c_ju_regex_Pattern.prototype;
$c_ju_regex_Pattern.prototype.init___sjs_js_RegExp__T__I = (function(jsRegExp, _pattern, _flags) {
  this.jsRegExp$1 = jsRegExp;
  this.$$undpattern$1 = _pattern;
  this.$$undflags$1 = _flags;
  return this
});
$c_ju_regex_Pattern.prototype.toString__T = (function() {
  return this.$$undpattern$1
});
$c_ju_regex_Pattern.prototype.newJSRegExp__sjs_js_RegExp = (function() {
  var r = new $g["RegExp"](this.jsRegExp$1);
  if ((r !== this.jsRegExp$1)) {
    return r
  } else {
    var jsFlags = ((($uZ(this.jsRegExp$1["global"]) ? "g" : "") + ($uZ(this.jsRegExp$1["ignoreCase"]) ? "i" : "")) + ($uZ(this.jsRegExp$1["multiline"]) ? "m" : ""));
    return new $g["RegExp"]($as_T(this.jsRegExp$1["source"]), jsFlags)
  }
});
var $d_ju_regex_Pattern = new $TypeData().initClass({
  ju_regex_Pattern: 0
}, false, "java.util.regex.Pattern", {
  ju_regex_Pattern: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_ju_regex_Pattern.prototype.$classData = $d_ju_regex_Pattern;
/** @constructor */
function $c_ju_regex_Pattern$() {
  $c_O.call(this);
  this.UNIX$undLINES$1 = 0;
  this.CASE$undINSENSITIVE$1 = 0;
  this.COMMENTS$1 = 0;
  this.MULTILINE$1 = 0;
  this.LITERAL$1 = 0;
  this.DOTALL$1 = 0;
  this.UNICODE$undCASE$1 = 0;
  this.CANON$undEQ$1 = 0;
  this.UNICODE$undCHARACTER$undCLASS$1 = 0;
  this.java$util$regex$Pattern$$splitHackPat$1 = null;
  this.java$util$regex$Pattern$$flagHackPat$1 = null
}
$c_ju_regex_Pattern$.prototype = new $h_O();
$c_ju_regex_Pattern$.prototype.constructor = $c_ju_regex_Pattern$;
/** @constructor */
function $h_ju_regex_Pattern$() {
  /*<skip>*/
}
$h_ju_regex_Pattern$.prototype = $c_ju_regex_Pattern$.prototype;
$c_ju_regex_Pattern$.prototype.init___ = (function() {
  $n_ju_regex_Pattern$ = this;
  this.java$util$regex$Pattern$$splitHackPat$1 = new $g["RegExp"]("^\\\\Q(.|\\n|\\r)\\\\E$");
  this.java$util$regex$Pattern$$flagHackPat$1 = new $g["RegExp"]("^\\(\\?([idmsuxU]*)(?:-([idmsuxU]*))?\\)");
  return this
});
$c_ju_regex_Pattern$.prototype.compile__T__I__ju_regex_Pattern = (function(regex, flags) {
  if (((16 & flags) !== 0)) {
    var x1 = new $c_T2().init___O__O(this.quote__T__T(regex), flags)
  } else {
    var m = this.java$util$regex$Pattern$$splitHackPat$1["exec"](regex);
    if ((m !== null)) {
      var $$this = m[1];
      if (($$this === (void 0))) {
        var jsx$1;
        throw new $c_ju_NoSuchElementException().init___T("undefined.get")
      } else {
        var jsx$1 = $$this
      };
      var this$4 = new $c_s_Some().init___O(new $c_T2().init___O__O(this.quote__T__T($as_T(jsx$1)), flags))
    } else {
      var this$4 = $m_s_None$()
    };
    if (this$4.isEmpty__Z()) {
      var m$1 = this.java$util$regex$Pattern$$flagHackPat$1["exec"](regex);
      if ((m$1 !== null)) {
        var $$this$1 = m$1[0];
        if (($$this$1 === (void 0))) {
          var jsx$2;
          throw new $c_ju_NoSuchElementException().init___T("undefined.get")
        } else {
          var jsx$2 = $$this$1
        };
        var thiz = $as_T(jsx$2);
        var beginIndex = $uI(thiz["length"]);
        var newPat = $as_T(regex["substring"](beginIndex));
        var $$this$2 = m$1[1];
        if (($$this$2 === (void 0))) {
          var flags1 = flags
        } else {
          var chars = $as_T($$this$2);
          var this$15 = new $c_sci_StringOps().init___T(chars);
          var start = 0;
          var $$this$3 = this$15.repr$1;
          var end = $uI($$this$3["length"]);
          var z = flags;
          x: {
            var jsx$3;
            _foldl: while (true) {
              if ((start === end)) {
                var jsx$3 = z;
                break x
              } else {
                var temp$start = ((1 + start) | 0);
                var arg1 = z;
                var arg2 = this$15.apply__I__O(start);
                var f = $uI(arg1);
                if ((arg2 === null)) {
                  var c = 0
                } else {
                  var this$19 = $as_jl_Character(arg2);
                  var c = this$19.value$1
                };
                var temp$z = (f | this.java$util$regex$Pattern$$charToFlag__C__I(c));
                start = temp$start;
                z = temp$z;
                continue _foldl
              }
            }
          };
          var flags1 = $uI(jsx$3)
        };
        var $$this$4 = m$1[2];
        if (($$this$4 === (void 0))) {
          var flags2 = flags1
        } else {
          var chars$3 = $as_T($$this$4);
          var this$24 = new $c_sci_StringOps().init___T(chars$3);
          var start$1 = 0;
          var $$this$5 = this$24.repr$1;
          var end$1 = $uI($$this$5["length"]);
          var z$1 = flags1;
          x$1: {
            var jsx$4;
            _foldl$1: while (true) {
              if ((start$1 === end$1)) {
                var jsx$4 = z$1;
                break x$1
              } else {
                var temp$start$1 = ((1 + start$1) | 0);
                var arg1$1 = z$1;
                var arg2$1 = this$24.apply__I__O(start$1);
                var f$1 = $uI(arg1$1);
                if ((arg2$1 === null)) {
                  var c$1 = 0
                } else {
                  var this$28 = $as_jl_Character(arg2$1);
                  var c$1 = this$28.value$1
                };
                var temp$z$1 = (f$1 & (~this.java$util$regex$Pattern$$charToFlag__C__I(c$1)));
                start$1 = temp$start$1;
                z$1 = temp$z$1;
                continue _foldl$1
              }
            }
          };
          var flags2 = $uI(jsx$4)
        };
        var this$29 = new $c_s_Some().init___O(new $c_T2().init___O__O(newPat, flags2))
      } else {
        var this$29 = $m_s_None$()
      }
    } else {
      var this$29 = this$4
    };
    var x1 = $as_T2((this$29.isEmpty__Z() ? new $c_T2().init___O__O(regex, flags) : this$29.get__O()))
  };
  if ((x1 !== null)) {
    var jsPattern = $as_T(x1.$$und1$f);
    var flags1$1 = $uI(x1.$$und2$f);
    var x$1_$_$$und1$f = jsPattern;
    var x$1_$_$$und2$f = flags1$1
  } else {
    var x$1_$_$$und1$f;
    var x$1_$_$$und2$f;
    throw new $c_s_MatchError().init___O(x1)
  };
  var jsPattern$2 = $as_T(x$1_$_$$und1$f);
  var flags1$2 = $uI(x$1_$_$$und2$f);
  var jsFlags = (("g" + (((2 & flags1$2) !== 0) ? "i" : "")) + (((8 & flags1$2) !== 0) ? "m" : ""));
  var jsRegExp = new $g["RegExp"](jsPattern$2, jsFlags);
  return new $c_ju_regex_Pattern().init___sjs_js_RegExp__T__I(jsRegExp, regex, flags1$2)
});
$c_ju_regex_Pattern$.prototype.quote__T__T = (function(s) {
  var result = "";
  var i = 0;
  while ((i < $uI(s["length"]))) {
    var index = i;
    var c = (65535 & $uI(s["charCodeAt"](index)));
    var jsx$2 = result;
    switch (c) {
      case 92:
      case 46:
      case 40:
      case 41:
      case 91:
      case 93:
      case 123:
      case 125:
      case 124:
      case 63:
      case 42:
      case 43:
      case 94:
      case 36: {
        var jsx$1 = ("\\" + new $c_jl_Character().init___C(c));
        break
      }
      default: {
        var jsx$1 = new $c_jl_Character().init___C(c)
      }
    };
    result = (("" + jsx$2) + jsx$1);
    i = ((1 + i) | 0)
  };
  return result
});
$c_ju_regex_Pattern$.prototype.java$util$regex$Pattern$$charToFlag__C__I = (function(c) {
  switch (c) {
    case 105: {
      return 2;
      break
    }
    case 100: {
      return 1;
      break
    }
    case 109: {
      return 8;
      break
    }
    case 115: {
      return 32;
      break
    }
    case 117: {
      return 64;
      break
    }
    case 120: {
      return 4;
      break
    }
    case 85: {
      return 256;
      break
    }
    default: {
      $m_s_sys_package$().error__T__sr_Nothing$("bad in-pattern flag")
    }
  }
});
var $d_ju_regex_Pattern$ = new $TypeData().initClass({
  ju_regex_Pattern$: 0
}, false, "java.util.regex.Pattern$", {
  ju_regex_Pattern$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_ju_regex_Pattern$.prototype.$classData = $d_ju_regex_Pattern$;
var $n_ju_regex_Pattern$ = (void 0);
function $m_ju_regex_Pattern$() {
  if ((!$n_ju_regex_Pattern$)) {
    $n_ju_regex_Pattern$ = new $c_ju_regex_Pattern$().init___()
  };
  return $n_ju_regex_Pattern$
}
/** @constructor */
function $c_s_Console$() {
  $c_s_DeprecatedConsole.call(this);
  this.outVar$2 = null;
  this.errVar$2 = null;
  this.inVar$2 = null
}
$c_s_Console$.prototype = new $h_s_DeprecatedConsole();
$c_s_Console$.prototype.constructor = $c_s_Console$;
/** @constructor */
function $h_s_Console$() {
  /*<skip>*/
}
$h_s_Console$.prototype = $c_s_Console$.prototype;
$c_s_Console$.prototype.init___ = (function() {
  $n_s_Console$ = this;
  this.outVar$2 = new $c_s_util_DynamicVariable().init___O($m_jl_System$().out$1);
  this.errVar$2 = new $c_s_util_DynamicVariable().init___O($m_jl_System$().err$1);
  this.inVar$2 = new $c_s_util_DynamicVariable().init___O(null);
  return this
});
var $d_s_Console$ = new $TypeData().initClass({
  s_Console$: 0
}, false, "scala.Console$", {
  s_Console$: 1,
  s_DeprecatedConsole: 1,
  O: 1,
  s_io_AnsiColor: 1
});
$c_s_Console$.prototype.$classData = $d_s_Console$;
var $n_s_Console$ = (void 0);
function $m_s_Console$() {
  if ((!$n_s_Console$)) {
    $n_s_Console$ = new $c_s_Console$().init___()
  };
  return $n_s_Console$
}
/** @constructor */
function $c_s_Option$() {
  $c_O.call(this)
}
$c_s_Option$.prototype = new $h_O();
$c_s_Option$.prototype.constructor = $c_s_Option$;
/** @constructor */
function $h_s_Option$() {
  /*<skip>*/
}
$h_s_Option$.prototype = $c_s_Option$.prototype;
$c_s_Option$.prototype.apply__O__s_Option = (function(x) {
  return ((x === null) ? $m_s_None$() : new $c_s_Some().init___O(x))
});
var $d_s_Option$ = new $TypeData().initClass({
  s_Option$: 0
}, false, "scala.Option$", {
  s_Option$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Option$.prototype.$classData = $d_s_Option$;
var $n_s_Option$ = (void 0);
function $m_s_Option$() {
  if ((!$n_s_Option$)) {
    $n_s_Option$ = new $c_s_Option$().init___()
  };
  return $n_s_Option$
}
/** @constructor */
function $c_s_PartialFunction$$anon$1() {
  $c_O.call(this);
  this.lift$1 = null
}
$c_s_PartialFunction$$anon$1.prototype = new $h_O();
$c_s_PartialFunction$$anon$1.prototype.constructor = $c_s_PartialFunction$$anon$1;
/** @constructor */
function $h_s_PartialFunction$$anon$1() {
  /*<skip>*/
}
$h_s_PartialFunction$$anon$1.prototype = $c_s_PartialFunction$$anon$1.prototype;
$c_s_PartialFunction$$anon$1.prototype.init___ = (function() {
  this.lift$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(x$2) {
      return $m_s_None$()
    })
  })(this));
  return this
});
$c_s_PartialFunction$$anon$1.prototype.apply__O__O = (function(v1) {
  this.apply__O__sr_Nothing$(v1)
});
$c_s_PartialFunction$$anon$1.prototype.toString__T = (function() {
  return "<function1>"
});
$c_s_PartialFunction$$anon$1.prototype.isDefinedAt__O__Z = (function(x) {
  return false
});
$c_s_PartialFunction$$anon$1.prototype.applyOrElse__O__F1__O = (function(x, $default) {
  return $s_s_PartialFunction$class__applyOrElse__s_PartialFunction__O__F1__O(this, x, $default)
});
$c_s_PartialFunction$$anon$1.prototype.apply__O__sr_Nothing$ = (function(x) {
  throw new $c_s_MatchError().init___O(x)
});
var $d_s_PartialFunction$$anon$1 = new $TypeData().initClass({
  s_PartialFunction$$anon$1: 0
}, false, "scala.PartialFunction$$anon$1", {
  s_PartialFunction$$anon$1: 1,
  O: 1,
  s_PartialFunction: 1,
  F1: 1
});
$c_s_PartialFunction$$anon$1.prototype.$classData = $d_s_PartialFunction$$anon$1;
/** @constructor */
function $c_s_PartialFunction$Lifted() {
  $c_sr_AbstractFunction1.call(this);
  this.pf$2 = null
}
$c_s_PartialFunction$Lifted.prototype = new $h_sr_AbstractFunction1();
$c_s_PartialFunction$Lifted.prototype.constructor = $c_s_PartialFunction$Lifted;
/** @constructor */
function $h_s_PartialFunction$Lifted() {
  /*<skip>*/
}
$h_s_PartialFunction$Lifted.prototype = $c_s_PartialFunction$Lifted.prototype;
$c_s_PartialFunction$Lifted.prototype.apply__O__O = (function(v1) {
  return this.apply__O__s_Option(v1)
});
$c_s_PartialFunction$Lifted.prototype.init___s_PartialFunction = (function(pf) {
  this.pf$2 = pf;
  return this
});
$c_s_PartialFunction$Lifted.prototype.apply__O__s_Option = (function(x) {
  var z = this.pf$2.applyOrElse__O__F1__O(x, $m_s_PartialFunction$().scala$PartialFunction$$fallback$undpf$f);
  return ((!$m_s_PartialFunction$().scala$PartialFunction$$fallbackOccurred__O__Z(z)) ? new $c_s_Some().init___O(z) : $m_s_None$())
});
var $d_s_PartialFunction$Lifted = new $TypeData().initClass({
  s_PartialFunction$Lifted: 0
}, false, "scala.PartialFunction$Lifted", {
  s_PartialFunction$Lifted: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1
});
$c_s_PartialFunction$Lifted.prototype.$classData = $d_s_PartialFunction$Lifted;
/** @constructor */
function $c_s_Predef$() {
  $c_s_LowPriorityImplicits.call(this);
  this.Map$2 = null;
  this.Set$2 = null;
  this.ClassManifest$2 = null;
  this.Manifest$2 = null;
  this.NoManifest$2 = null;
  this.StringCanBuildFrom$2 = null;
  this.singleton$und$less$colon$less$2 = null;
  this.scala$Predef$$singleton$und$eq$colon$eq$f = null
}
$c_s_Predef$.prototype = new $h_s_LowPriorityImplicits();
$c_s_Predef$.prototype.constructor = $c_s_Predef$;
/** @constructor */
function $h_s_Predef$() {
  /*<skip>*/
}
$h_s_Predef$.prototype = $c_s_Predef$.prototype;
$c_s_Predef$.prototype.init___ = (function() {
  $n_s_Predef$ = this;
  $m_s_package$();
  $m_sci_List$();
  this.Map$2 = $m_sci_Map$();
  this.Set$2 = $m_sci_Set$();
  this.ClassManifest$2 = $m_s_reflect_package$().ClassManifest$1;
  this.Manifest$2 = $m_s_reflect_package$().Manifest$1;
  this.NoManifest$2 = $m_s_reflect_NoManifest$();
  this.StringCanBuildFrom$2 = new $c_s_Predef$$anon$3().init___();
  this.singleton$und$less$colon$less$2 = new $c_s_Predef$$anon$1().init___();
  this.scala$Predef$$singleton$und$eq$colon$eq$f = new $c_s_Predef$$anon$2().init___();
  return this
});
$c_s_Predef$.prototype.assert__Z__V = (function(assertion) {
  if ((!assertion)) {
    throw new $c_jl_AssertionError().init___O("assertion failed")
  }
});
$c_s_Predef$.prototype.require__Z__V = (function(requirement) {
  if ((!requirement)) {
    throw new $c_jl_IllegalArgumentException().init___T("requirement failed")
  }
});
var $d_s_Predef$ = new $TypeData().initClass({
  s_Predef$: 0
}, false, "scala.Predef$", {
  s_Predef$: 1,
  s_LowPriorityImplicits: 1,
  O: 1,
  s_DeprecatedPredef: 1
});
$c_s_Predef$.prototype.$classData = $d_s_Predef$;
var $n_s_Predef$ = (void 0);
function $m_s_Predef$() {
  if ((!$n_s_Predef$)) {
    $n_s_Predef$ = new $c_s_Predef$().init___()
  };
  return $n_s_Predef$
}
/** @constructor */
function $c_s_StringContext$() {
  $c_O.call(this)
}
$c_s_StringContext$.prototype = new $h_O();
$c_s_StringContext$.prototype.constructor = $c_s_StringContext$;
/** @constructor */
function $h_s_StringContext$() {
  /*<skip>*/
}
$h_s_StringContext$.prototype = $c_s_StringContext$.prototype;
$c_s_StringContext$.prototype.treatEscapes0__p1__T__Z__T = (function(str, strict) {
  var len = $uI(str["length"]);
  var x1 = $m_sjsr_RuntimeString$().indexOf__T__I__I(str, 92);
  switch (x1) {
    case (-1): {
      return str;
      break
    }
    default: {
      return this.replace$1__p1__I__T__Z__I__T(x1, str, strict, len)
    }
  }
});
$c_s_StringContext$.prototype.loop$1__p1__I__I__T__Z__I__jl_StringBuilder__T = (function(i, next, str$1, strict$1, len$1, b$1) {
  _loop: while (true) {
    if ((next >= 0)) {
      if ((next > i)) {
        b$1.append__jl_CharSequence__I__I__jl_StringBuilder(str$1, i, next)
      };
      var idx = ((1 + next) | 0);
      if ((idx >= len$1)) {
        throw new $c_s_StringContext$InvalidEscapeException().init___T__I(str$1, next)
      };
      var index = idx;
      var x1 = (65535 & $uI(str$1["charCodeAt"](index)));
      switch (x1) {
        case 98: {
          var c = 8;
          break
        }
        case 116: {
          var c = 9;
          break
        }
        case 110: {
          var c = 10;
          break
        }
        case 102: {
          var c = 12;
          break
        }
        case 114: {
          var c = 13;
          break
        }
        case 34: {
          var c = 34;
          break
        }
        case 39: {
          var c = 39;
          break
        }
        case 92: {
          var c = 92;
          break
        }
        default: {
          if (((x1 >= 48) && (x1 <= 55))) {
            if (strict$1) {
              throw new $c_s_StringContext$InvalidEscapeException().init___T__I(str$1, next)
            };
            var index$1 = idx;
            var leadch = (65535 & $uI(str$1["charCodeAt"](index$1)));
            var oct = (((-48) + leadch) | 0);
            idx = ((1 + idx) | 0);
            if ((idx < len$1)) {
              var index$2 = idx;
              var jsx$2 = ((65535 & $uI(str$1["charCodeAt"](index$2))) >= 48)
            } else {
              var jsx$2 = false
            };
            if (jsx$2) {
              var index$3 = idx;
              var jsx$1 = ((65535 & $uI(str$1["charCodeAt"](index$3))) <= 55)
            } else {
              var jsx$1 = false
            };
            if (jsx$1) {
              var jsx$3 = oct;
              var index$4 = idx;
              oct = (((-48) + (($imul(8, jsx$3) + (65535 & $uI(str$1["charCodeAt"](index$4)))) | 0)) | 0);
              idx = ((1 + idx) | 0);
              if (((idx < len$1) && (leadch <= 51))) {
                var index$5 = idx;
                var jsx$5 = ((65535 & $uI(str$1["charCodeAt"](index$5))) >= 48)
              } else {
                var jsx$5 = false
              };
              if (jsx$5) {
                var index$6 = idx;
                var jsx$4 = ((65535 & $uI(str$1["charCodeAt"](index$6))) <= 55)
              } else {
                var jsx$4 = false
              };
              if (jsx$4) {
                var jsx$6 = oct;
                var index$7 = idx;
                oct = (((-48) + (($imul(8, jsx$6) + (65535 & $uI(str$1["charCodeAt"](index$7)))) | 0)) | 0);
                idx = ((1 + idx) | 0)
              }
            };
            idx = (((-1) + idx) | 0);
            var c = (65535 & oct)
          } else {
            var c;
            throw new $c_s_StringContext$InvalidEscapeException().init___T__I(str$1, next)
          }
        }
      };
      idx = ((1 + idx) | 0);
      b$1.append__C__jl_StringBuilder(c);
      var temp$i = idx;
      var temp$next = $m_sjsr_RuntimeString$().indexOf__T__I__I__I(str$1, 92, idx);
      i = temp$i;
      next = temp$next;
      continue _loop
    } else {
      if ((i < len$1)) {
        b$1.append__jl_CharSequence__I__I__jl_StringBuilder(str$1, i, len$1)
      };
      return b$1.content$1
    }
  }
});
$c_s_StringContext$.prototype.replace$1__p1__I__T__Z__I__T = (function(first, str$1, strict$1, len$1) {
  var b = new $c_jl_StringBuilder().init___();
  return this.loop$1__p1__I__I__T__Z__I__jl_StringBuilder__T(0, first, str$1, strict$1, len$1, b)
});
var $d_s_StringContext$ = new $TypeData().initClass({
  s_StringContext$: 0
}, false, "scala.StringContext$", {
  s_StringContext$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_StringContext$.prototype.$classData = $d_s_StringContext$;
var $n_s_StringContext$ = (void 0);
function $m_s_StringContext$() {
  if ((!$n_s_StringContext$)) {
    $n_s_StringContext$ = new $c_s_StringContext$().init___()
  };
  return $n_s_StringContext$
}
/** @constructor */
function $c_s_math_Fractional$() {
  $c_O.call(this)
}
$c_s_math_Fractional$.prototype = new $h_O();
$c_s_math_Fractional$.prototype.constructor = $c_s_math_Fractional$;
/** @constructor */
function $h_s_math_Fractional$() {
  /*<skip>*/
}
$h_s_math_Fractional$.prototype = $c_s_math_Fractional$.prototype;
var $d_s_math_Fractional$ = new $TypeData().initClass({
  s_math_Fractional$: 0
}, false, "scala.math.Fractional$", {
  s_math_Fractional$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Fractional$.prototype.$classData = $d_s_math_Fractional$;
var $n_s_math_Fractional$ = (void 0);
function $m_s_math_Fractional$() {
  if ((!$n_s_math_Fractional$)) {
    $n_s_math_Fractional$ = new $c_s_math_Fractional$().init___()
  };
  return $n_s_math_Fractional$
}
/** @constructor */
function $c_s_math_Integral$() {
  $c_O.call(this)
}
$c_s_math_Integral$.prototype = new $h_O();
$c_s_math_Integral$.prototype.constructor = $c_s_math_Integral$;
/** @constructor */
function $h_s_math_Integral$() {
  /*<skip>*/
}
$h_s_math_Integral$.prototype = $c_s_math_Integral$.prototype;
var $d_s_math_Integral$ = new $TypeData().initClass({
  s_math_Integral$: 0
}, false, "scala.math.Integral$", {
  s_math_Integral$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Integral$.prototype.$classData = $d_s_math_Integral$;
var $n_s_math_Integral$ = (void 0);
function $m_s_math_Integral$() {
  if ((!$n_s_math_Integral$)) {
    $n_s_math_Integral$ = new $c_s_math_Integral$().init___()
  };
  return $n_s_math_Integral$
}
/** @constructor */
function $c_s_math_Numeric$() {
  $c_O.call(this)
}
$c_s_math_Numeric$.prototype = new $h_O();
$c_s_math_Numeric$.prototype.constructor = $c_s_math_Numeric$;
/** @constructor */
function $h_s_math_Numeric$() {
  /*<skip>*/
}
$h_s_math_Numeric$.prototype = $c_s_math_Numeric$.prototype;
var $d_s_math_Numeric$ = new $TypeData().initClass({
  s_math_Numeric$: 0
}, false, "scala.math.Numeric$", {
  s_math_Numeric$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Numeric$.prototype.$classData = $d_s_math_Numeric$;
var $n_s_math_Numeric$ = (void 0);
function $m_s_math_Numeric$() {
  if ((!$n_s_math_Numeric$)) {
    $n_s_math_Numeric$ = new $c_s_math_Numeric$().init___()
  };
  return $n_s_math_Numeric$
}
/** @constructor */
function $c_s_util_DynamicVariable$$anon$1() {
  $c_jl_InheritableThreadLocal.call(this);
  this.$$outer$3 = null
}
$c_s_util_DynamicVariable$$anon$1.prototype = new $h_jl_InheritableThreadLocal();
$c_s_util_DynamicVariable$$anon$1.prototype.constructor = $c_s_util_DynamicVariable$$anon$1;
/** @constructor */
function $h_s_util_DynamicVariable$$anon$1() {
  /*<skip>*/
}
$h_s_util_DynamicVariable$$anon$1.prototype = $c_s_util_DynamicVariable$$anon$1.prototype;
$c_s_util_DynamicVariable$$anon$1.prototype.init___s_util_DynamicVariable = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$3 = $$outer
  };
  $c_jl_InheritableThreadLocal.prototype.init___.call(this);
  return this
});
$c_s_util_DynamicVariable$$anon$1.prototype.initialValue__O = (function() {
  return this.$$outer$3.scala$util$DynamicVariable$$init$f
});
var $d_s_util_DynamicVariable$$anon$1 = new $TypeData().initClass({
  s_util_DynamicVariable$$anon$1: 0
}, false, "scala.util.DynamicVariable$$anon$1", {
  s_util_DynamicVariable$$anon$1: 1,
  jl_InheritableThreadLocal: 1,
  jl_ThreadLocal: 1,
  O: 1
});
$c_s_util_DynamicVariable$$anon$1.prototype.$classData = $d_s_util_DynamicVariable$$anon$1;
/** @constructor */
function $c_s_util_Left$() {
  $c_O.call(this)
}
$c_s_util_Left$.prototype = new $h_O();
$c_s_util_Left$.prototype.constructor = $c_s_util_Left$;
/** @constructor */
function $h_s_util_Left$() {
  /*<skip>*/
}
$h_s_util_Left$.prototype = $c_s_util_Left$.prototype;
$c_s_util_Left$.prototype.toString__T = (function() {
  return "Left"
});
var $d_s_util_Left$ = new $TypeData().initClass({
  s_util_Left$: 0
}, false, "scala.util.Left$", {
  s_util_Left$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_Left$.prototype.$classData = $d_s_util_Left$;
var $n_s_util_Left$ = (void 0);
function $m_s_util_Left$() {
  if ((!$n_s_util_Left$)) {
    $n_s_util_Left$ = new $c_s_util_Left$().init___()
  };
  return $n_s_util_Left$
}
/** @constructor */
function $c_s_util_Right$() {
  $c_O.call(this)
}
$c_s_util_Right$.prototype = new $h_O();
$c_s_util_Right$.prototype.constructor = $c_s_util_Right$;
/** @constructor */
function $h_s_util_Right$() {
  /*<skip>*/
}
$h_s_util_Right$.prototype = $c_s_util_Right$.prototype;
$c_s_util_Right$.prototype.toString__T = (function() {
  return "Right"
});
var $d_s_util_Right$ = new $TypeData().initClass({
  s_util_Right$: 0
}, false, "scala.util.Right$", {
  s_util_Right$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_Right$.prototype.$classData = $d_s_util_Right$;
var $n_s_util_Right$ = (void 0);
function $m_s_util_Right$() {
  if ((!$n_s_util_Right$)) {
    $n_s_util_Right$ = new $c_s_util_Right$().init___()
  };
  return $n_s_util_Right$
}
/** @constructor */
function $c_s_util_control_NoStackTrace$() {
  $c_O.call(this);
  this.$$undnoSuppression$1 = false
}
$c_s_util_control_NoStackTrace$.prototype = new $h_O();
$c_s_util_control_NoStackTrace$.prototype.constructor = $c_s_util_control_NoStackTrace$;
/** @constructor */
function $h_s_util_control_NoStackTrace$() {
  /*<skip>*/
}
$h_s_util_control_NoStackTrace$.prototype = $c_s_util_control_NoStackTrace$.prototype;
$c_s_util_control_NoStackTrace$.prototype.init___ = (function() {
  $n_s_util_control_NoStackTrace$ = this;
  this.$$undnoSuppression$1 = false;
  return this
});
var $d_s_util_control_NoStackTrace$ = new $TypeData().initClass({
  s_util_control_NoStackTrace$: 0
}, false, "scala.util.control.NoStackTrace$", {
  s_util_control_NoStackTrace$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_control_NoStackTrace$.prototype.$classData = $d_s_util_control_NoStackTrace$;
var $n_s_util_control_NoStackTrace$ = (void 0);
function $m_s_util_control_NoStackTrace$() {
  if ((!$n_s_util_control_NoStackTrace$)) {
    $n_s_util_control_NoStackTrace$ = new $c_s_util_control_NoStackTrace$().init___()
  };
  return $n_s_util_control_NoStackTrace$
}
/** @constructor */
function $c_s_util_matching_Regex() {
  $c_O.call(this);
  this.pattern$1 = null;
  this.scala$util$matching$Regex$$groupNames$f = null
}
$c_s_util_matching_Regex.prototype = new $h_O();
$c_s_util_matching_Regex.prototype.constructor = $c_s_util_matching_Regex;
/** @constructor */
function $h_s_util_matching_Regex() {
  /*<skip>*/
}
$h_s_util_matching_Regex.prototype = $c_s_util_matching_Regex.prototype;
$c_s_util_matching_Regex.prototype.init___T__sc_Seq = (function(regex, groupNames) {
  var this$1 = $m_ju_regex_Pattern$();
  $c_s_util_matching_Regex.prototype.init___ju_regex_Pattern__sc_Seq.call(this, this$1.compile__T__I__ju_regex_Pattern(regex, 0), groupNames);
  return this
});
$c_s_util_matching_Regex.prototype.init___ju_regex_Pattern__sc_Seq = (function(pattern, groupNames) {
  this.pattern$1 = pattern;
  this.scala$util$matching$Regex$$groupNames$f = groupNames;
  return this
});
$c_s_util_matching_Regex.prototype.toString__T = (function() {
  return this.pattern$1.$$undpattern$1
});
$c_s_util_matching_Regex.prototype.replaceAllIn__jl_CharSequence__T__T = (function(target, replacement) {
  var this$1 = this.pattern$1;
  var m = new $c_ju_regex_Matcher().init___ju_regex_Pattern__jl_CharSequence__I__I(this$1, target, 0, $charSequenceLength(target));
  return m.replaceAll__T__T(replacement)
});
var $d_s_util_matching_Regex = new $TypeData().initClass({
  s_util_matching_Regex: 0
}, false, "scala.util.matching.Regex", {
  s_util_matching_Regex: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_matching_Regex.prototype.$classData = $d_s_util_matching_Regex;
/** @constructor */
function $c_sc_IndexedSeq$$anon$1() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.call(this)
}
$c_sc_IndexedSeq$$anon$1.prototype = new $h_scg_GenTraversableFactory$GenericCanBuildFrom();
$c_sc_IndexedSeq$$anon$1.prototype.constructor = $c_sc_IndexedSeq$$anon$1;
/** @constructor */
function $h_sc_IndexedSeq$$anon$1() {
  /*<skip>*/
}
$h_sc_IndexedSeq$$anon$1.prototype = $c_sc_IndexedSeq$$anon$1.prototype;
$c_sc_IndexedSeq$$anon$1.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.init___scg_GenTraversableFactory.call(this, $m_sc_IndexedSeq$());
  return this
});
$c_sc_IndexedSeq$$anon$1.prototype.apply__scm_Builder = (function() {
  $m_sc_IndexedSeq$();
  $m_sci_IndexedSeq$();
  $m_sci_Vector$();
  return new $c_sci_VectorBuilder().init___()
});
var $d_sc_IndexedSeq$$anon$1 = new $TypeData().initClass({
  sc_IndexedSeq$$anon$1: 0
}, false, "scala.collection.IndexedSeq$$anon$1", {
  sc_IndexedSeq$$anon$1: 1,
  scg_GenTraversableFactory$GenericCanBuildFrom: 1,
  O: 1,
  scg_CanBuildFrom: 1
});
$c_sc_IndexedSeq$$anon$1.prototype.$classData = $d_sc_IndexedSeq$$anon$1;
/** @constructor */
function $c_scg_GenSeqFactory() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_scg_GenSeqFactory.prototype = new $h_scg_GenTraversableFactory();
$c_scg_GenSeqFactory.prototype.constructor = $c_scg_GenSeqFactory;
/** @constructor */
function $h_scg_GenSeqFactory() {
  /*<skip>*/
}
$h_scg_GenSeqFactory.prototype = $c_scg_GenSeqFactory.prototype;
/** @constructor */
function $c_scg_GenTraversableFactory$$anon$1() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.call(this);
  this.$$outer$2 = null
}
$c_scg_GenTraversableFactory$$anon$1.prototype = new $h_scg_GenTraversableFactory$GenericCanBuildFrom();
$c_scg_GenTraversableFactory$$anon$1.prototype.constructor = $c_scg_GenTraversableFactory$$anon$1;
/** @constructor */
function $h_scg_GenTraversableFactory$$anon$1() {
  /*<skip>*/
}
$h_scg_GenTraversableFactory$$anon$1.prototype = $c_scg_GenTraversableFactory$$anon$1.prototype;
$c_scg_GenTraversableFactory$$anon$1.prototype.apply__scm_Builder = (function() {
  return this.$$outer$2.newBuilder__scm_Builder()
});
$c_scg_GenTraversableFactory$$anon$1.prototype.init___scg_GenTraversableFactory = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.init___scg_GenTraversableFactory.call(this, $$outer);
  return this
});
var $d_scg_GenTraversableFactory$$anon$1 = new $TypeData().initClass({
  scg_GenTraversableFactory$$anon$1: 0
}, false, "scala.collection.generic.GenTraversableFactory$$anon$1", {
  scg_GenTraversableFactory$$anon$1: 1,
  scg_GenTraversableFactory$GenericCanBuildFrom: 1,
  O: 1,
  scg_CanBuildFrom: 1
});
$c_scg_GenTraversableFactory$$anon$1.prototype.$classData = $d_scg_GenTraversableFactory$$anon$1;
/** @constructor */
function $c_scg_ImmutableMapFactory() {
  $c_scg_MapFactory.call(this)
}
$c_scg_ImmutableMapFactory.prototype = new $h_scg_MapFactory();
$c_scg_ImmutableMapFactory.prototype.constructor = $c_scg_ImmutableMapFactory;
/** @constructor */
function $h_scg_ImmutableMapFactory() {
  /*<skip>*/
}
$h_scg_ImmutableMapFactory.prototype = $c_scg_ImmutableMapFactory.prototype;
/** @constructor */
function $c_sci_$colon$colon$() {
  $c_O.call(this)
}
$c_sci_$colon$colon$.prototype = new $h_O();
$c_sci_$colon$colon$.prototype.constructor = $c_sci_$colon$colon$;
/** @constructor */
function $h_sci_$colon$colon$() {
  /*<skip>*/
}
$h_sci_$colon$colon$.prototype = $c_sci_$colon$colon$.prototype;
$c_sci_$colon$colon$.prototype.toString__T = (function() {
  return "::"
});
var $d_sci_$colon$colon$ = new $TypeData().initClass({
  sci_$colon$colon$: 0
}, false, "scala.collection.immutable.$colon$colon$", {
  sci_$colon$colon$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_$colon$colon$.prototype.$classData = $d_sci_$colon$colon$;
var $n_sci_$colon$colon$ = (void 0);
function $m_sci_$colon$colon$() {
  if ((!$n_sci_$colon$colon$)) {
    $n_sci_$colon$colon$ = new $c_sci_$colon$colon$().init___()
  };
  return $n_sci_$colon$colon$
}
/** @constructor */
function $c_sci_Range$() {
  $c_O.call(this);
  this.MAX$undPRINT$1 = 0
}
$c_sci_Range$.prototype = new $h_O();
$c_sci_Range$.prototype.constructor = $c_sci_Range$;
/** @constructor */
function $h_sci_Range$() {
  /*<skip>*/
}
$h_sci_Range$.prototype = $c_sci_Range$.prototype;
$c_sci_Range$.prototype.init___ = (function() {
  $n_sci_Range$ = this;
  this.MAX$undPRINT$1 = 512;
  return this
});
var $d_sci_Range$ = new $TypeData().initClass({
  sci_Range$: 0
}, false, "scala.collection.immutable.Range$", {
  sci_Range$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Range$.prototype.$classData = $d_sci_Range$;
var $n_sci_Range$ = (void 0);
function $m_sci_Range$() {
  if ((!$n_sci_Range$)) {
    $n_sci_Range$ = new $c_sci_Range$().init___()
  };
  return $n_sci_Range$
}
/** @constructor */
function $c_sci_Stream$StreamCanBuildFrom() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.call(this)
}
$c_sci_Stream$StreamCanBuildFrom.prototype = new $h_scg_GenTraversableFactory$GenericCanBuildFrom();
$c_sci_Stream$StreamCanBuildFrom.prototype.constructor = $c_sci_Stream$StreamCanBuildFrom;
/** @constructor */
function $h_sci_Stream$StreamCanBuildFrom() {
  /*<skip>*/
}
$h_sci_Stream$StreamCanBuildFrom.prototype = $c_sci_Stream$StreamCanBuildFrom.prototype;
$c_sci_Stream$StreamCanBuildFrom.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.init___scg_GenTraversableFactory.call(this, $m_sci_Stream$());
  return this
});
var $d_sci_Stream$StreamCanBuildFrom = new $TypeData().initClass({
  sci_Stream$StreamCanBuildFrom: 0
}, false, "scala.collection.immutable.Stream$StreamCanBuildFrom", {
  sci_Stream$StreamCanBuildFrom: 1,
  scg_GenTraversableFactory$GenericCanBuildFrom: 1,
  O: 1,
  scg_CanBuildFrom: 1
});
$c_sci_Stream$StreamCanBuildFrom.prototype.$classData = $d_sci_Stream$StreamCanBuildFrom;
/** @constructor */
function $c_scm_StringBuilder$() {
  $c_O.call(this)
}
$c_scm_StringBuilder$.prototype = new $h_O();
$c_scm_StringBuilder$.prototype.constructor = $c_scm_StringBuilder$;
/** @constructor */
function $h_scm_StringBuilder$() {
  /*<skip>*/
}
$h_scm_StringBuilder$.prototype = $c_scm_StringBuilder$.prototype;
var $d_scm_StringBuilder$ = new $TypeData().initClass({
  scm_StringBuilder$: 0
}, false, "scala.collection.mutable.StringBuilder$", {
  scm_StringBuilder$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_StringBuilder$.prototype.$classData = $d_scm_StringBuilder$;
var $n_scm_StringBuilder$ = (void 0);
function $m_scm_StringBuilder$() {
  if ((!$n_scm_StringBuilder$)) {
    $n_scm_StringBuilder$ = new $c_scm_StringBuilder$().init___()
  };
  return $n_scm_StringBuilder$
}
/** @constructor */
function $c_sjsr_AnonFunction0() {
  $c_sr_AbstractFunction0.call(this);
  this.f$2 = null
}
$c_sjsr_AnonFunction0.prototype = new $h_sr_AbstractFunction0();
$c_sjsr_AnonFunction0.prototype.constructor = $c_sjsr_AnonFunction0;
/** @constructor */
function $h_sjsr_AnonFunction0() {
  /*<skip>*/
}
$h_sjsr_AnonFunction0.prototype = $c_sjsr_AnonFunction0.prototype;
$c_sjsr_AnonFunction0.prototype.apply__O = (function() {
  return (0, this.f$2)()
});
$c_sjsr_AnonFunction0.prototype.init___sjs_js_Function0 = (function(f) {
  this.f$2 = f;
  return this
});
var $d_sjsr_AnonFunction0 = new $TypeData().initClass({
  sjsr_AnonFunction0: 0
}, false, "scala.scalajs.runtime.AnonFunction0", {
  sjsr_AnonFunction0: 1,
  sr_AbstractFunction0: 1,
  O: 1,
  F0: 1
});
$c_sjsr_AnonFunction0.prototype.$classData = $d_sjsr_AnonFunction0;
/** @constructor */
function $c_sjsr_AnonFunction1() {
  $c_sr_AbstractFunction1.call(this);
  this.f$2 = null
}
$c_sjsr_AnonFunction1.prototype = new $h_sr_AbstractFunction1();
$c_sjsr_AnonFunction1.prototype.constructor = $c_sjsr_AnonFunction1;
/** @constructor */
function $h_sjsr_AnonFunction1() {
  /*<skip>*/
}
$h_sjsr_AnonFunction1.prototype = $c_sjsr_AnonFunction1.prototype;
$c_sjsr_AnonFunction1.prototype.apply__O__O = (function(arg1) {
  return (0, this.f$2)(arg1)
});
$c_sjsr_AnonFunction1.prototype.init___sjs_js_Function1 = (function(f) {
  this.f$2 = f;
  return this
});
var $d_sjsr_AnonFunction1 = new $TypeData().initClass({
  sjsr_AnonFunction1: 0
}, false, "scala.scalajs.runtime.AnonFunction1", {
  sjsr_AnonFunction1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1
});
$c_sjsr_AnonFunction1.prototype.$classData = $d_sjsr_AnonFunction1;
/** @constructor */
function $c_sjsr_AnonFunction2() {
  $c_sr_AbstractFunction2.call(this);
  this.f$2 = null
}
$c_sjsr_AnonFunction2.prototype = new $h_sr_AbstractFunction2();
$c_sjsr_AnonFunction2.prototype.constructor = $c_sjsr_AnonFunction2;
/** @constructor */
function $h_sjsr_AnonFunction2() {
  /*<skip>*/
}
$h_sjsr_AnonFunction2.prototype = $c_sjsr_AnonFunction2.prototype;
$c_sjsr_AnonFunction2.prototype.init___sjs_js_Function2 = (function(f) {
  this.f$2 = f;
  return this
});
$c_sjsr_AnonFunction2.prototype.apply__O__O__O = (function(arg1, arg2) {
  return (0, this.f$2)(arg1, arg2)
});
var $d_sjsr_AnonFunction2 = new $TypeData().initClass({
  sjsr_AnonFunction2: 0
}, false, "scala.scalajs.runtime.AnonFunction2", {
  sjsr_AnonFunction2: 1,
  sr_AbstractFunction2: 1,
  O: 1,
  F2: 1
});
$c_sjsr_AnonFunction2.prototype.$classData = $d_sjsr_AnonFunction2;
/** @constructor */
function $c_sjsr_AnonFunction3() {
  $c_sr_AbstractFunction3.call(this);
  this.f$2 = null
}
$c_sjsr_AnonFunction3.prototype = new $h_sr_AbstractFunction3();
$c_sjsr_AnonFunction3.prototype.constructor = $c_sjsr_AnonFunction3;
/** @constructor */
function $h_sjsr_AnonFunction3() {
  /*<skip>*/
}
$h_sjsr_AnonFunction3.prototype = $c_sjsr_AnonFunction3.prototype;
$c_sjsr_AnonFunction3.prototype.init___sjs_js_Function3 = (function(f) {
  this.f$2 = f;
  return this
});
$c_sjsr_AnonFunction3.prototype.apply__O__O__O__O = (function(arg1, arg2, arg3) {
  return (0, this.f$2)(arg1, arg2, arg3)
});
var $d_sjsr_AnonFunction3 = new $TypeData().initClass({
  sjsr_AnonFunction3: 0
}, false, "scala.scalajs.runtime.AnonFunction3", {
  sjsr_AnonFunction3: 1,
  sr_AbstractFunction3: 1,
  O: 1,
  F3: 1
});
$c_sjsr_AnonFunction3.prototype.$classData = $d_sjsr_AnonFunction3;
/** @constructor */
function $c_sjsr_RuntimeLong() {
  $c_jl_Number.call(this);
  this.l$2 = 0;
  this.m$2 = 0;
  this.h$2 = 0
}
$c_sjsr_RuntimeLong.prototype = new $h_jl_Number();
$c_sjsr_RuntimeLong.prototype.constructor = $c_sjsr_RuntimeLong;
/** @constructor */
function $h_sjsr_RuntimeLong() {
  /*<skip>*/
}
$h_sjsr_RuntimeLong.prototype = $c_sjsr_RuntimeLong.prototype;
$c_sjsr_RuntimeLong.prototype.longValue__J = (function() {
  return $uJ(this)
});
$c_sjsr_RuntimeLong.prototype.powerOfTwo__p2__I = (function() {
  return (((((this.h$2 === 0) && (this.m$2 === 0)) && (this.l$2 !== 0)) && ((this.l$2 & (((-1) + this.l$2) | 0)) === 0)) ? $m_jl_Integer$().numberOfTrailingZeros__I__I(this.l$2) : (((((this.h$2 === 0) && (this.m$2 !== 0)) && (this.l$2 === 0)) && ((this.m$2 & (((-1) + this.m$2) | 0)) === 0)) ? ((22 + $m_jl_Integer$().numberOfTrailingZeros__I__I(this.m$2)) | 0) : (((((this.h$2 !== 0) && (this.m$2 === 0)) && (this.l$2 === 0)) && ((this.h$2 & (((-1) + this.h$2) | 0)) === 0)) ? ((44 + $m_jl_Integer$().numberOfTrailingZeros__I__I(this.h$2)) | 0) : (-1))))
});
$c_sjsr_RuntimeLong.prototype.$$bar__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(y) {
  return new $c_sjsr_RuntimeLong().init___I__I__I((this.l$2 | y.l$2), (this.m$2 | y.m$2), (this.h$2 | y.h$2))
});
$c_sjsr_RuntimeLong.prototype.$$greater$eq__sjsr_RuntimeLong__Z = (function(y) {
  return (((524288 & this.h$2) === 0) ? (((((524288 & y.h$2) !== 0) || (this.h$2 > y.h$2)) || ((this.h$2 === y.h$2) && (this.m$2 > y.m$2))) || (((this.h$2 === y.h$2) && (this.m$2 === y.m$2)) && (this.l$2 >= y.l$2))) : (!(((((524288 & y.h$2) === 0) || (this.h$2 < y.h$2)) || ((this.h$2 === y.h$2) && (this.m$2 < y.m$2))) || (((this.h$2 === y.h$2) && (this.m$2 === y.m$2)) && (this.l$2 < y.l$2)))))
});
$c_sjsr_RuntimeLong.prototype.byteValue__B = (function() {
  return this.toByte__B()
});
$c_sjsr_RuntimeLong.prototype.toShort__S = (function() {
  return ((this.toInt__I() << 16) >> 16)
});
$c_sjsr_RuntimeLong.prototype.equals__O__Z = (function(that) {
  if ($is_sjsr_RuntimeLong(that)) {
    var x2 = $as_sjsr_RuntimeLong(that);
    return this.equals__sjsr_RuntimeLong__Z(x2)
  } else {
    return false
  }
});
$c_sjsr_RuntimeLong.prototype.$$less__sjsr_RuntimeLong__Z = (function(y) {
  return y.$$greater__sjsr_RuntimeLong__Z(this)
});
$c_sjsr_RuntimeLong.prototype.$$times__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(y) {
  var _1 = (8191 & this.l$2);
  var _2 = ((this.l$2 >> 13) | ((15 & this.m$2) << 9));
  var _3 = (8191 & (this.m$2 >> 4));
  var _4 = ((this.m$2 >> 17) | ((255 & this.h$2) << 5));
  var _5 = ((1048320 & this.h$2) >> 8);
  var _1$1 = (8191 & y.l$2);
  var _2$1 = ((y.l$2 >> 13) | ((15 & y.m$2) << 9));
  var _3$1 = (8191 & (y.m$2 >> 4));
  var _4$1 = ((y.m$2 >> 17) | ((255 & y.h$2) << 5));
  var _5$1 = ((1048320 & y.h$2) >> 8);
  var p0 = $imul(_1, _1$1);
  var p1 = $imul(_2, _1$1);
  var p2 = $imul(_3, _1$1);
  var p3 = $imul(_4, _1$1);
  var p4 = $imul(_5, _1$1);
  if ((_2$1 !== 0)) {
    p1 = ((p1 + $imul(_1, _2$1)) | 0);
    p2 = ((p2 + $imul(_2, _2$1)) | 0);
    p3 = ((p3 + $imul(_3, _2$1)) | 0);
    p4 = ((p4 + $imul(_4, _2$1)) | 0)
  };
  if ((_3$1 !== 0)) {
    p2 = ((p2 + $imul(_1, _3$1)) | 0);
    p3 = ((p3 + $imul(_2, _3$1)) | 0);
    p4 = ((p4 + $imul(_3, _3$1)) | 0)
  };
  if ((_4$1 !== 0)) {
    p3 = ((p3 + $imul(_1, _4$1)) | 0);
    p4 = ((p4 + $imul(_2, _4$1)) | 0)
  };
  if ((_5$1 !== 0)) {
    p4 = ((p4 + $imul(_1, _5$1)) | 0)
  };
  var c00 = (4194303 & p0);
  var c01 = ((511 & p1) << 13);
  var c0 = ((c00 + c01) | 0);
  var c10 = (p0 >> 22);
  var c11 = (p1 >> 9);
  var c12 = ((262143 & p2) << 4);
  var c13 = ((31 & p3) << 17);
  var c1 = ((((((c10 + c11) | 0) + c12) | 0) + c13) | 0);
  var c22 = (p2 >> 18);
  var c23 = (p3 >> 5);
  var c24 = ((4095 & p4) << 8);
  var c2 = ((((c22 + c23) | 0) + c24) | 0);
  var c1n = ((c1 + (c0 >> 22)) | 0);
  var h = ((c2 + (c1n >> 22)) | 0);
  return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & c0), (4194303 & c1n), (1048575 & h))
});
$c_sjsr_RuntimeLong.prototype.init___I__I__I = (function(l, m, h) {
  this.l$2 = l;
  this.m$2 = m;
  this.h$2 = h;
  return this
});
$c_sjsr_RuntimeLong.prototype.$$percent__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(y) {
  return $as_sjsr_RuntimeLong(this.scala$scalajs$runtime$RuntimeLong$$divMod__sjsr_RuntimeLong__sjs_js_Array(y)[1])
});
$c_sjsr_RuntimeLong.prototype.toString__T = (function() {
  if ((((this.l$2 === 0) && (this.m$2 === 0)) && (this.h$2 === 0))) {
    return "0"
  } else if (this.equals__sjsr_RuntimeLong__Z($m_sjsr_RuntimeLong$().MinValue$1)) {
    return "-9223372036854775808"
  } else if (((524288 & this.h$2) !== 0)) {
    return ("-" + this.unary$und$minus__sjsr_RuntimeLong().toString__T())
  } else {
    var tenPow9 = $m_sjsr_RuntimeLong$().TenPow9$1;
    var v = this;
    var acc = "";
    _toString0: while (true) {
      var this$1 = v;
      if ((((this$1.l$2 === 0) && (this$1.m$2 === 0)) && (this$1.h$2 === 0))) {
        return acc
      } else {
        var quotRem = v.scala$scalajs$runtime$RuntimeLong$$divMod__sjsr_RuntimeLong__sjs_js_Array(tenPow9);
        var quot = $as_sjsr_RuntimeLong(quotRem[0]);
        var rem = $as_sjsr_RuntimeLong(quotRem[1]);
        var this$2 = rem.toInt__I();
        var digits = ("" + this$2);
        if ((((quot.l$2 === 0) && (quot.m$2 === 0)) && (quot.h$2 === 0))) {
          var zeroPrefix = ""
        } else {
          var beginIndex = $uI(digits["length"]);
          var zeroPrefix = $as_T("000000000"["substring"](beginIndex))
        };
        var temp$acc = ((zeroPrefix + digits) + acc);
        v = quot;
        acc = temp$acc;
        continue _toString0
      }
    }
  }
});
$c_sjsr_RuntimeLong.prototype.$$less$eq__sjsr_RuntimeLong__Z = (function(y) {
  return y.$$greater$eq__sjsr_RuntimeLong__Z(this)
});
$c_sjsr_RuntimeLong.prototype.compareTo__O__I = (function(x$1) {
  var that = $as_sjsr_RuntimeLong(x$1);
  return this.compareTo__sjsr_RuntimeLong__I($as_sjsr_RuntimeLong(that))
});
$c_sjsr_RuntimeLong.prototype.scala$scalajs$runtime$RuntimeLong$$setBit__I__sjsr_RuntimeLong = (function(bit) {
  return ((bit < 22) ? new $c_sjsr_RuntimeLong().init___I__I__I((this.l$2 | (1 << bit)), this.m$2, this.h$2) : ((bit < 44) ? new $c_sjsr_RuntimeLong().init___I__I__I(this.l$2, (this.m$2 | (1 << (((-22) + bit) | 0))), this.h$2) : new $c_sjsr_RuntimeLong().init___I__I__I(this.l$2, this.m$2, (this.h$2 | (1 << (((-44) + bit) | 0))))))
});
$c_sjsr_RuntimeLong.prototype.scala$scalajs$runtime$RuntimeLong$$divMod__sjsr_RuntimeLong__sjs_js_Array = (function(y) {
  if ((((y.l$2 === 0) && (y.m$2 === 0)) && (y.h$2 === 0))) {
    throw new $c_jl_ArithmeticException().init___T("/ by zero")
  } else if ((((this.l$2 === 0) && (this.m$2 === 0)) && (this.h$2 === 0))) {
    return [$m_sjsr_RuntimeLong$().Zero$1, $m_sjsr_RuntimeLong$().Zero$1]
  } else if (y.equals__sjsr_RuntimeLong__Z($m_sjsr_RuntimeLong$().MinValue$1)) {
    return (this.equals__sjsr_RuntimeLong__Z($m_sjsr_RuntimeLong$().MinValue$1) ? [$m_sjsr_RuntimeLong$().One$1, $m_sjsr_RuntimeLong$().Zero$1] : [$m_sjsr_RuntimeLong$().Zero$1, this])
  } else {
    var xNegative = ((524288 & this.h$2) !== 0);
    var yNegative = ((524288 & y.h$2) !== 0);
    var xMinValue = this.equals__sjsr_RuntimeLong__Z($m_sjsr_RuntimeLong$().MinValue$1);
    var pow = y.powerOfTwo__p2__I();
    if ((pow >= 0)) {
      if (xMinValue) {
        var z = this.$$greater$greater__I__sjsr_RuntimeLong(pow);
        return [(yNegative ? z.unary$und$minus__sjsr_RuntimeLong() : z), $m_sjsr_RuntimeLong$().Zero$1]
      } else {
        var absX = (((524288 & this.h$2) !== 0) ? this.unary$und$minus__sjsr_RuntimeLong() : this);
        var absZ = absX.$$greater$greater__I__sjsr_RuntimeLong(pow);
        var z$2 = ((xNegative !== yNegative) ? absZ.unary$und$minus__sjsr_RuntimeLong() : absZ);
        var remAbs = ((pow <= 22) ? new $c_sjsr_RuntimeLong().init___I__I__I((absX.l$2 & (((-1) + (1 << pow)) | 0)), 0, 0) : ((pow <= 44) ? new $c_sjsr_RuntimeLong().init___I__I__I(absX.l$2, (absX.m$2 & (((-1) + (1 << (((-22) + pow) | 0))) | 0)), 0) : new $c_sjsr_RuntimeLong().init___I__I__I(absX.l$2, absX.m$2, (absX.h$2 & (((-1) + (1 << (((-44) + pow) | 0))) | 0)))));
        var rem = (xNegative ? remAbs.unary$und$minus__sjsr_RuntimeLong() : remAbs);
        return [z$2, rem]
      }
    } else {
      var absY = (((524288 & y.h$2) !== 0) ? y.unary$und$minus__sjsr_RuntimeLong() : y);
      if (xMinValue) {
        var newX = $m_sjsr_RuntimeLong$().MaxValue$1
      } else {
        var absX$2 = (((524288 & this.h$2) !== 0) ? this.unary$und$minus__sjsr_RuntimeLong() : this);
        if (absY.$$greater__sjsr_RuntimeLong__Z(absX$2)) {
          var newX;
          return [$m_sjsr_RuntimeLong$().Zero$1, this]
        } else {
          var newX = absX$2
        }
      };
      var shift = ((absY.numberOfLeadingZeros__I() - newX.numberOfLeadingZeros__I()) | 0);
      var yShift = absY.$$less$less__I__sjsr_RuntimeLong(shift);
      var shift$1 = shift;
      var yShift$1 = yShift;
      var curX = newX;
      var quot = $m_sjsr_RuntimeLong$().Zero$1;
      x: {
        var x1_$_$$und1$f;
        var x1_$_$$und2$f;
        _divide0: while (true) {
          if ((shift$1 < 0)) {
            var jsx$1 = true
          } else {
            var this$1 = curX;
            var jsx$1 = (((this$1.l$2 === 0) && (this$1.m$2 === 0)) && (this$1.h$2 === 0))
          };
          if (jsx$1) {
            var _1 = quot;
            var _2 = curX;
            var x1_$_$$und1$f = _1;
            var x1_$_$$und2$f = _2;
            break x
          } else {
            var this$2 = curX;
            var y$1 = yShift$1;
            var newX$1 = this$2.$$plus__sjsr_RuntimeLong__sjsr_RuntimeLong(y$1.unary$und$minus__sjsr_RuntimeLong());
            if (((524288 & newX$1.h$2) === 0)) {
              var temp$shift = (((-1) + shift$1) | 0);
              var temp$yShift = yShift$1.$$greater$greater__I__sjsr_RuntimeLong(1);
              var temp$quot = quot.scala$scalajs$runtime$RuntimeLong$$setBit__I__sjsr_RuntimeLong(shift$1);
              shift$1 = temp$shift;
              yShift$1 = temp$yShift;
              curX = newX$1;
              quot = temp$quot;
              continue _divide0
            } else {
              var temp$shift$2 = (((-1) + shift$1) | 0);
              var temp$yShift$2 = yShift$1.$$greater$greater__I__sjsr_RuntimeLong(1);
              shift$1 = temp$shift$2;
              yShift$1 = temp$yShift$2;
              continue _divide0
            }
          }
        }
      };
      var absQuot = $as_sjsr_RuntimeLong(x1_$_$$und1$f);
      var absRem = $as_sjsr_RuntimeLong(x1_$_$$und2$f);
      var quot$1 = ((xNegative !== yNegative) ? absQuot.unary$und$minus__sjsr_RuntimeLong() : absQuot);
      if ((xNegative && xMinValue)) {
        var this$3 = absRem.unary$und$minus__sjsr_RuntimeLong();
        var y$2 = $m_sjsr_RuntimeLong$().One$1;
        var rem$1 = this$3.$$plus__sjsr_RuntimeLong__sjsr_RuntimeLong(y$2.unary$und$minus__sjsr_RuntimeLong())
      } else {
        var rem$1 = (xNegative ? absRem.unary$und$minus__sjsr_RuntimeLong() : absRem)
      };
      return [quot$1, rem$1]
    }
  }
});
$c_sjsr_RuntimeLong.prototype.$$amp__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(y) {
  return new $c_sjsr_RuntimeLong().init___I__I__I((this.l$2 & y.l$2), (this.m$2 & y.m$2), (this.h$2 & y.h$2))
});
$c_sjsr_RuntimeLong.prototype.$$greater$greater$greater__I__sjsr_RuntimeLong = (function(n_in) {
  var n = (63 & n_in);
  if ((n < 22)) {
    var remBits = ((22 - n) | 0);
    var l = ((this.l$2 >> n) | (this.m$2 << remBits));
    var m = ((this.m$2 >> n) | (this.h$2 << remBits));
    var h = ((this.h$2 >>> n) | 0);
    return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & l), (4194303 & m), (1048575 & h))
  } else if ((n < 44)) {
    var shfBits = (((-22) + n) | 0);
    var remBits$2 = ((44 - n) | 0);
    var l$1 = ((this.m$2 >> shfBits) | (this.h$2 << remBits$2));
    var m$1 = ((this.h$2 >>> shfBits) | 0);
    return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & l$1), (4194303 & m$1), 0)
  } else {
    var l$2 = ((this.h$2 >>> (((-44) + n) | 0)) | 0);
    return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & l$2), 0, 0)
  }
});
$c_sjsr_RuntimeLong.prototype.compareTo__sjsr_RuntimeLong__I = (function(that) {
  return (this.equals__sjsr_RuntimeLong__Z(that) ? 0 : (this.$$greater__sjsr_RuntimeLong__Z(that) ? 1 : (-1)))
});
$c_sjsr_RuntimeLong.prototype.$$greater__sjsr_RuntimeLong__Z = (function(y) {
  return (((524288 & this.h$2) === 0) ? (((((524288 & y.h$2) !== 0) || (this.h$2 > y.h$2)) || ((this.h$2 === y.h$2) && (this.m$2 > y.m$2))) || (((this.h$2 === y.h$2) && (this.m$2 === y.m$2)) && (this.l$2 > y.l$2))) : (!(((((524288 & y.h$2) === 0) || (this.h$2 < y.h$2)) || ((this.h$2 === y.h$2) && (this.m$2 < y.m$2))) || (((this.h$2 === y.h$2) && (this.m$2 === y.m$2)) && (this.l$2 <= y.l$2)))))
});
$c_sjsr_RuntimeLong.prototype.$$less$less__I__sjsr_RuntimeLong = (function(n_in) {
  var n = (63 & n_in);
  if ((n < 22)) {
    var remBits = ((22 - n) | 0);
    var l = (this.l$2 << n);
    var m = ((this.m$2 << n) | (this.l$2 >> remBits));
    var h = ((this.h$2 << n) | (this.m$2 >> remBits));
    return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & l), (4194303 & m), (1048575 & h))
  } else if ((n < 44)) {
    var shfBits = (((-22) + n) | 0);
    var remBits$2 = ((44 - n) | 0);
    var m$1 = (this.l$2 << shfBits);
    var h$1 = ((this.m$2 << shfBits) | (this.l$2 >> remBits$2));
    return new $c_sjsr_RuntimeLong().init___I__I__I(0, (4194303 & m$1), (1048575 & h$1))
  } else {
    var h$2 = (this.l$2 << (((-44) + n) | 0));
    return new $c_sjsr_RuntimeLong().init___I__I__I(0, 0, (1048575 & h$2))
  }
});
$c_sjsr_RuntimeLong.prototype.toInt__I = (function() {
  return (this.l$2 | (this.m$2 << 22))
});
$c_sjsr_RuntimeLong.prototype.init___I = (function(value) {
  $c_sjsr_RuntimeLong.prototype.init___I__I__I.call(this, (4194303 & value), (4194303 & (value >> 22)), ((value < 0) ? 1048575 : 0));
  return this
});
$c_sjsr_RuntimeLong.prototype.notEquals__sjsr_RuntimeLong__Z = (function(that) {
  return (!this.equals__sjsr_RuntimeLong__Z(that))
});
$c_sjsr_RuntimeLong.prototype.unary$und$minus__sjsr_RuntimeLong = (function() {
  var neg0 = (4194303 & ((1 + (~this.l$2)) | 0));
  var neg1 = (4194303 & (((~this.m$2) + ((neg0 === 0) ? 1 : 0)) | 0));
  var neg2 = (1048575 & (((~this.h$2) + (((neg0 === 0) && (neg1 === 0)) ? 1 : 0)) | 0));
  return new $c_sjsr_RuntimeLong().init___I__I__I(neg0, neg1, neg2)
});
$c_sjsr_RuntimeLong.prototype.shortValue__S = (function() {
  return this.toShort__S()
});
$c_sjsr_RuntimeLong.prototype.$$plus__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(y) {
  var sum0 = ((this.l$2 + y.l$2) | 0);
  var sum1 = ((((this.m$2 + y.m$2) | 0) + (sum0 >> 22)) | 0);
  var sum2 = ((((this.h$2 + y.h$2) | 0) + (sum1 >> 22)) | 0);
  return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & sum0), (4194303 & sum1), (1048575 & sum2))
});
$c_sjsr_RuntimeLong.prototype.$$greater$greater__I__sjsr_RuntimeLong = (function(n_in) {
  var n = (63 & n_in);
  var negative = ((524288 & this.h$2) !== 0);
  var xh = (negative ? ((-1048576) | this.h$2) : this.h$2);
  if ((n < 22)) {
    var remBits = ((22 - n) | 0);
    var l = ((this.l$2 >> n) | (this.m$2 << remBits));
    var m = ((this.m$2 >> n) | (xh << remBits));
    var h = (xh >> n);
    return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & l), (4194303 & m), (1048575 & h))
  } else if ((n < 44)) {
    var shfBits = (((-22) + n) | 0);
    var remBits$2 = ((44 - n) | 0);
    var l$1 = ((this.m$2 >> shfBits) | (xh << remBits$2));
    var m$1 = (xh >> shfBits);
    var h$1 = (negative ? 1048575 : 0);
    return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & l$1), (4194303 & m$1), (1048575 & h$1))
  } else {
    var l$2 = (xh >> (((-44) + n) | 0));
    var m$2 = (negative ? 4194303 : 0);
    var h$2 = (negative ? 1048575 : 0);
    return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & l$2), (4194303 & m$2), (1048575 & h$2))
  }
});
$c_sjsr_RuntimeLong.prototype.toDouble__D = (function() {
  return (this.equals__sjsr_RuntimeLong__Z($m_sjsr_RuntimeLong$().MinValue$1) ? (-9.223372036854776E18) : (((524288 & this.h$2) !== 0) ? (-this.unary$und$minus__sjsr_RuntimeLong().toDouble__D()) : ((this.l$2 + (4194304.0 * this.m$2)) + (1.7592186044416E13 * this.h$2))))
});
$c_sjsr_RuntimeLong.prototype.$$div__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(y) {
  return $as_sjsr_RuntimeLong(this.scala$scalajs$runtime$RuntimeLong$$divMod__sjsr_RuntimeLong__sjs_js_Array(y)[0])
});
$c_sjsr_RuntimeLong.prototype.numberOfLeadingZeros__I = (function() {
  return ((this.h$2 !== 0) ? (((-12) + $m_jl_Integer$().numberOfLeadingZeros__I__I(this.h$2)) | 0) : ((this.m$2 !== 0) ? ((10 + $m_jl_Integer$().numberOfLeadingZeros__I__I(this.m$2)) | 0) : ((32 + $m_jl_Integer$().numberOfLeadingZeros__I__I(this.l$2)) | 0)))
});
$c_sjsr_RuntimeLong.prototype.toByte__B = (function() {
  return ((this.toInt__I() << 24) >> 24)
});
$c_sjsr_RuntimeLong.prototype.doubleValue__D = (function() {
  return this.toDouble__D()
});
$c_sjsr_RuntimeLong.prototype.hashCode__I = (function() {
  return this.$$up__sjsr_RuntimeLong__sjsr_RuntimeLong(this.$$greater$greater$greater__I__sjsr_RuntimeLong(32)).toInt__I()
});
$c_sjsr_RuntimeLong.prototype.intValue__I = (function() {
  return this.toInt__I()
});
$c_sjsr_RuntimeLong.prototype.unary$und$tilde__sjsr_RuntimeLong = (function() {
  var l = (~this.l$2);
  var m = (~this.m$2);
  var h = (~this.h$2);
  return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & l), (4194303 & m), (1048575 & h))
});
$c_sjsr_RuntimeLong.prototype.compareTo__jl_Long__I = (function(that) {
  return this.compareTo__sjsr_RuntimeLong__I($as_sjsr_RuntimeLong(that))
});
$c_sjsr_RuntimeLong.prototype.floatValue__F = (function() {
  return this.toFloat__F()
});
$c_sjsr_RuntimeLong.prototype.$$minus__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(y) {
  return this.$$plus__sjsr_RuntimeLong__sjsr_RuntimeLong(y.unary$und$minus__sjsr_RuntimeLong())
});
$c_sjsr_RuntimeLong.prototype.toFloat__F = (function() {
  return $fround(this.toDouble__D())
});
$c_sjsr_RuntimeLong.prototype.$$up__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(y) {
  return new $c_sjsr_RuntimeLong().init___I__I__I((this.l$2 ^ y.l$2), (this.m$2 ^ y.m$2), (this.h$2 ^ y.h$2))
});
$c_sjsr_RuntimeLong.prototype.equals__sjsr_RuntimeLong__Z = (function(y) {
  return (((this.l$2 === y.l$2) && (this.m$2 === y.m$2)) && (this.h$2 === y.h$2))
});
function $is_sjsr_RuntimeLong(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sjsr_RuntimeLong)))
}
function $as_sjsr_RuntimeLong(obj) {
  return (($is_sjsr_RuntimeLong(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.scalajs.runtime.RuntimeLong"))
}
function $isArrayOf_sjsr_RuntimeLong(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sjsr_RuntimeLong)))
}
function $asArrayOf_sjsr_RuntimeLong(obj, depth) {
  return (($isArrayOf_sjsr_RuntimeLong(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.scalajs.runtime.RuntimeLong;", depth))
}
var $d_sjsr_RuntimeLong = new $TypeData().initClass({
  sjsr_RuntimeLong: 0
}, false, "scala.scalajs.runtime.RuntimeLong", {
  sjsr_RuntimeLong: 1,
  jl_Number: 1,
  O: 1,
  jl_Comparable: 1
});
$c_sjsr_RuntimeLong.prototype.$classData = $d_sjsr_RuntimeLong;
/** @constructor */
function $c_sjsr_RuntimeLong$() {
  $c_O.call(this);
  this.BITS$1 = 0;
  this.BITS01$1 = 0;
  this.BITS2$1 = 0;
  this.MASK$1 = 0;
  this.MASK$und2$1 = 0;
  this.SIGN$undBIT$1 = 0;
  this.SIGN$undBIT$undVALUE$1 = 0;
  this.TWO$undPWR$und15$undDBL$1 = 0.0;
  this.TWO$undPWR$und16$undDBL$1 = 0.0;
  this.TWO$undPWR$und22$undDBL$1 = 0.0;
  this.TWO$undPWR$und31$undDBL$1 = 0.0;
  this.TWO$undPWR$und32$undDBL$1 = 0.0;
  this.TWO$undPWR$und44$undDBL$1 = 0.0;
  this.TWO$undPWR$und63$undDBL$1 = 0.0;
  this.Zero$1 = null;
  this.One$1 = null;
  this.MinusOne$1 = null;
  this.MinValue$1 = null;
  this.MaxValue$1 = null;
  this.TenPow9$1 = null
}
$c_sjsr_RuntimeLong$.prototype = new $h_O();
$c_sjsr_RuntimeLong$.prototype.constructor = $c_sjsr_RuntimeLong$;
/** @constructor */
function $h_sjsr_RuntimeLong$() {
  /*<skip>*/
}
$h_sjsr_RuntimeLong$.prototype = $c_sjsr_RuntimeLong$.prototype;
$c_sjsr_RuntimeLong$.prototype.init___ = (function() {
  $n_sjsr_RuntimeLong$ = this;
  this.Zero$1 = new $c_sjsr_RuntimeLong().init___I__I__I(0, 0, 0);
  this.One$1 = new $c_sjsr_RuntimeLong().init___I__I__I(1, 0, 0);
  this.MinusOne$1 = new $c_sjsr_RuntimeLong().init___I__I__I(4194303, 4194303, 1048575);
  this.MinValue$1 = new $c_sjsr_RuntimeLong().init___I__I__I(0, 0, 524288);
  this.MaxValue$1 = new $c_sjsr_RuntimeLong().init___I__I__I(4194303, 4194303, 524287);
  this.TenPow9$1 = new $c_sjsr_RuntimeLong().init___I__I__I(1755648, 238, 0);
  return this
});
$c_sjsr_RuntimeLong$.prototype.Zero__sjsr_RuntimeLong = (function() {
  return this.Zero$1
});
$c_sjsr_RuntimeLong$.prototype.fromDouble__D__sjsr_RuntimeLong = (function(value) {
  if ((value !== value)) {
    return this.Zero$1
  } else if ((value < (-9.223372036854776E18))) {
    return this.MinValue$1
  } else if ((value >= 9.223372036854776E18)) {
    return this.MaxValue$1
  } else if ((value < 0)) {
    return this.fromDouble__D__sjsr_RuntimeLong((-value)).unary$und$minus__sjsr_RuntimeLong()
  } else {
    var acc = value;
    var a2 = ((acc >= 1.7592186044416E13) ? $doubleToInt((acc / 1.7592186044416E13)) : 0);
    acc = (acc - (1.7592186044416E13 * a2));
    var a1 = ((acc >= 4194304.0) ? $doubleToInt((acc / 4194304.0)) : 0);
    acc = (acc - (4194304.0 * a1));
    var a0 = $doubleToInt(acc);
    return new $c_sjsr_RuntimeLong().init___I__I__I(a0, a1, a2)
  }
});
var $d_sjsr_RuntimeLong$ = new $TypeData().initClass({
  sjsr_RuntimeLong$: 0
}, false, "scala.scalajs.runtime.RuntimeLong$", {
  sjsr_RuntimeLong$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sjsr_RuntimeLong$.prototype.$classData = $d_sjsr_RuntimeLong$;
var $n_sjsr_RuntimeLong$ = (void 0);
function $m_sjsr_RuntimeLong$() {
  if ((!$n_sjsr_RuntimeLong$)) {
    $n_sjsr_RuntimeLong$ = new $c_sjsr_RuntimeLong$().init___()
  };
  return $n_sjsr_RuntimeLong$
}
/** @constructor */
function $c_sr_AbstractPartialFunction() {
  $c_O.call(this)
}
$c_sr_AbstractPartialFunction.prototype = new $h_O();
$c_sr_AbstractPartialFunction.prototype.constructor = $c_sr_AbstractPartialFunction;
/** @constructor */
function $h_sr_AbstractPartialFunction() {
  /*<skip>*/
}
$h_sr_AbstractPartialFunction.prototype = $c_sr_AbstractPartialFunction.prototype;
$c_sr_AbstractPartialFunction.prototype.init___ = (function() {
  return this
});
$c_sr_AbstractPartialFunction.prototype.apply__O__O = (function(x) {
  return this.applyOrElse__O__F1__O(x, $m_s_PartialFunction$().empty$undpf$1)
});
$c_sr_AbstractPartialFunction.prototype.toString__T = (function() {
  return "<function1>"
});
var $d_sr_Nothing$ = new $TypeData().initClass({
  sr_Nothing$: 0
}, false, "scala.runtime.Nothing$", {
  sr_Nothing$: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
/** @constructor */
function $c_Ljapgolly_scalajs_react_ReactComponentC$ConstProps() {
  $c_Ljapgolly_scalajs_react_ReactComponentC$BaseCtor.call(this);
  this.factory$2 = null;
  this.reactClass$2 = null;
  this.key$2 = null;
  this.ref$2 = null;
  this.props$2 = null
}
$c_Ljapgolly_scalajs_react_ReactComponentC$ConstProps.prototype = new $h_Ljapgolly_scalajs_react_ReactComponentC$BaseCtor();
$c_Ljapgolly_scalajs_react_ReactComponentC$ConstProps.prototype.constructor = $c_Ljapgolly_scalajs_react_ReactComponentC$ConstProps;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ReactComponentC$ConstProps() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ReactComponentC$ConstProps.prototype = $c_Ljapgolly_scalajs_react_ReactComponentC$ConstProps.prototype;
$c_Ljapgolly_scalajs_react_ReactComponentC$ConstProps.prototype.apply__sc_Seq__Ljapgolly_scalajs_react_ReactComponentU = (function(children) {
  var jsx$4 = this.factory$2;
  var jsx$3 = this.mkProps__O__Ljapgolly_scalajs_react_package$WrapObj(this.props$2.apply__O());
  var this$1 = $m_sjsr_package$();
  if ($is_sjs_js_ArrayOps(children)) {
    var x2 = $as_sjs_js_ArrayOps(children);
    var jsx$2 = x2.result__sjs_js_Array()
  } else if ($is_sjs_js_WrappedArray(children)) {
    var x3 = $as_sjs_js_WrappedArray(children);
    var jsx$2 = x3.array$6
  } else {
    var result = [];
    children.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, result$1) {
      return (function(x$2) {
        return $uI(result$1["push"](x$2))
      })
    })(this$1, result)));
    var jsx$2 = result
  };
  var jsx$1 = [jsx$3]["concat"](jsx$2);
  return jsx$4["apply"]((void 0), jsx$1)
});
$c_Ljapgolly_scalajs_react_ReactComponentC$ConstProps.prototype.init___Ljapgolly_scalajs_react_ReactComponentCU__Ljapgolly_scalajs_react_ReactClass__sjs_js_UndefOr__sjs_js_UndefOr__F0 = (function(factory, reactClass, key, ref, props) {
  this.factory$2 = factory;
  this.reactClass$2 = reactClass;
  this.key$2 = key;
  this.ref$2 = ref;
  this.props$2 = props;
  return this
});
$c_Ljapgolly_scalajs_react_ReactComponentC$ConstProps.prototype.ref__sjs_js_UndefOr = (function() {
  return this.ref$2
});
$c_Ljapgolly_scalajs_react_ReactComponentC$ConstProps.prototype.key__sjs_js_UndefOr = (function() {
  return this.key$2
});
function $is_Ljapgolly_scalajs_react_ReactComponentC$ConstProps(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_ReactComponentC$ConstProps)))
}
function $as_Ljapgolly_scalajs_react_ReactComponentC$ConstProps(obj) {
  return (($is_Ljapgolly_scalajs_react_ReactComponentC$ConstProps(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.ReactComponentC$ConstProps"))
}
function $isArrayOf_Ljapgolly_scalajs_react_ReactComponentC$ConstProps(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_ReactComponentC$ConstProps)))
}
function $asArrayOf_Ljapgolly_scalajs_react_ReactComponentC$ConstProps(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_ReactComponentC$ConstProps(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.ReactComponentC$ConstProps;", depth))
}
var $d_Ljapgolly_scalajs_react_ReactComponentC$ConstProps = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ReactComponentC$ConstProps: 0
}, false, "japgolly.scalajs.react.ReactComponentC$ConstProps", {
  Ljapgolly_scalajs_react_ReactComponentC$ConstProps: 1,
  Ljapgolly_scalajs_react_ReactComponentC$BaseCtor: 1,
  O: 1,
  Ljapgolly_scalajs_react_ReactComponentC: 1,
  Ljapgolly_scalajs_react_package$ReactComponentTypeAux: 1
});
$c_Ljapgolly_scalajs_react_ReactComponentC$ConstProps.prototype.$classData = $d_Ljapgolly_scalajs_react_ReactComponentC$ConstProps;
/** @constructor */
function $c_Ljapgolly_scalajs_react_ReactComponentC$ReqProps() {
  $c_Ljapgolly_scalajs_react_ReactComponentC$BaseCtor.call(this);
  this.factory$2 = null;
  this.reactClass$2 = null;
  this.key$2 = null;
  this.ref$2 = null
}
$c_Ljapgolly_scalajs_react_ReactComponentC$ReqProps.prototype = new $h_Ljapgolly_scalajs_react_ReactComponentC$BaseCtor();
$c_Ljapgolly_scalajs_react_ReactComponentC$ReqProps.prototype.constructor = $c_Ljapgolly_scalajs_react_ReactComponentC$ReqProps;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ReactComponentC$ReqProps() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ReactComponentC$ReqProps.prototype = $c_Ljapgolly_scalajs_react_ReactComponentC$ReqProps.prototype;
$c_Ljapgolly_scalajs_react_ReactComponentC$ReqProps.prototype.ref__sjs_js_UndefOr = (function() {
  return this.ref$2
});
$c_Ljapgolly_scalajs_react_ReactComponentC$ReqProps.prototype.key__sjs_js_UndefOr = (function() {
  return this.key$2
});
$c_Ljapgolly_scalajs_react_ReactComponentC$ReqProps.prototype.init___Ljapgolly_scalajs_react_ReactComponentCU__Ljapgolly_scalajs_react_ReactClass__sjs_js_UndefOr__sjs_js_UndefOr = (function(factory, reactClass, key, ref) {
  this.factory$2 = factory;
  this.reactClass$2 = reactClass;
  this.key$2 = key;
  this.ref$2 = ref;
  return this
});
function $is_Ljapgolly_scalajs_react_ReactComponentC$ReqProps(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_ReactComponentC$ReqProps)))
}
function $as_Ljapgolly_scalajs_react_ReactComponentC$ReqProps(obj) {
  return (($is_Ljapgolly_scalajs_react_ReactComponentC$ReqProps(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.ReactComponentC$ReqProps"))
}
function $isArrayOf_Ljapgolly_scalajs_react_ReactComponentC$ReqProps(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_ReactComponentC$ReqProps)))
}
function $asArrayOf_Ljapgolly_scalajs_react_ReactComponentC$ReqProps(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_ReactComponentC$ReqProps(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.ReactComponentC$ReqProps;", depth))
}
var $d_Ljapgolly_scalajs_react_ReactComponentC$ReqProps = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ReactComponentC$ReqProps: 0
}, false, "japgolly.scalajs.react.ReactComponentC$ReqProps", {
  Ljapgolly_scalajs_react_ReactComponentC$ReqProps: 1,
  Ljapgolly_scalajs_react_ReactComponentC$BaseCtor: 1,
  O: 1,
  Ljapgolly_scalajs_react_ReactComponentC: 1,
  Ljapgolly_scalajs_react_package$ReactComponentTypeAux: 1
});
$c_Ljapgolly_scalajs_react_ReactComponentC$ReqProps.prototype.$classData = $d_Ljapgolly_scalajs_react_ReactComponentC$ReqProps;
function $is_Ljapgolly_scalajs_react_extra_router_Action(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_Action)))
}
function $as_Ljapgolly_scalajs_react_extra_router_Action(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_Action(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.Action"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_Action(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_Action)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_Action(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_Action(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.Action;", depth))
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$() {
  $c_Ljapgolly_scalajs_react_vdom_package$Base.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$.prototype = new $h_Ljapgolly_scalajs_react_vdom_package$Base();
$c_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$.prototype = $c_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$.prototype;
var $d_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$: 0
}, false, "japgolly.scalajs.react.vdom.package$prefix_$less$up$", {
  Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$: 1,
  Ljapgolly_scalajs_react_vdom_package$Base: 1,
  Ljapgolly_scalajs_react_vdom_Implicits: 1,
  Ljapgolly_scalajs_react_vdom_LowPri: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$;
var $n_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$)) {
    $n_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$ = new $c_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$
}
/** @constructor */
function $c_Ljava_io_FilterOutputStream() {
  $c_Ljava_io_OutputStream.call(this);
  this.out$2 = null
}
$c_Ljava_io_FilterOutputStream.prototype = new $h_Ljava_io_OutputStream();
$c_Ljava_io_FilterOutputStream.prototype.constructor = $c_Ljava_io_FilterOutputStream;
/** @constructor */
function $h_Ljava_io_FilterOutputStream() {
  /*<skip>*/
}
$h_Ljava_io_FilterOutputStream.prototype = $c_Ljava_io_FilterOutputStream.prototype;
$c_Ljava_io_FilterOutputStream.prototype.init___Ljava_io_OutputStream = (function(out) {
  this.out$2 = out;
  return this
});
function $is_T(obj) {
  return ((typeof obj) === "string")
}
function $as_T(obj) {
  return (($is_T(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.String"))
}
function $isArrayOf_T(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.T)))
}
function $asArrayOf_T(obj, depth) {
  return (($isArrayOf_T(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.String;", depth))
}
var $d_T = new $TypeData().initClass({
  T: 0
}, false, "java.lang.String", {
  T: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_CharSequence: 1,
  jl_Comparable: 1
}, (void 0), (void 0), $is_T);
/** @constructor */
function $c_jl_AssertionError() {
  $c_jl_Error.call(this)
}
$c_jl_AssertionError.prototype = new $h_jl_Error();
$c_jl_AssertionError.prototype.constructor = $c_jl_AssertionError;
/** @constructor */
function $h_jl_AssertionError() {
  /*<skip>*/
}
$h_jl_AssertionError.prototype = $c_jl_AssertionError.prototype;
$c_jl_AssertionError.prototype.init___O = (function(o) {
  $c_jl_AssertionError.prototype.init___T.call(this, $objectToString(o));
  return this
});
var $d_jl_AssertionError = new $TypeData().initClass({
  jl_AssertionError: 0
}, false, "java.lang.AssertionError", {
  jl_AssertionError: 1,
  jl_Error: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_AssertionError.prototype.$classData = $d_jl_AssertionError;
/** @constructor */
function $c_jl_CloneNotSupportedException() {
  $c_jl_Exception.call(this)
}
$c_jl_CloneNotSupportedException.prototype = new $h_jl_Exception();
$c_jl_CloneNotSupportedException.prototype.constructor = $c_jl_CloneNotSupportedException;
/** @constructor */
function $h_jl_CloneNotSupportedException() {
  /*<skip>*/
}
$h_jl_CloneNotSupportedException.prototype = $c_jl_CloneNotSupportedException.prototype;
$c_jl_CloneNotSupportedException.prototype.init___ = (function() {
  $c_jl_CloneNotSupportedException.prototype.init___T.call(this, null);
  return this
});
var $d_jl_CloneNotSupportedException = new $TypeData().initClass({
  jl_CloneNotSupportedException: 0
}, false, "java.lang.CloneNotSupportedException", {
  jl_CloneNotSupportedException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_CloneNotSupportedException.prototype.$classData = $d_jl_CloneNotSupportedException;
/** @constructor */
function $c_jl_JSConsoleBasedPrintStream$DummyOutputStream() {
  $c_Ljava_io_OutputStream.call(this)
}
$c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype = new $h_Ljava_io_OutputStream();
$c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype.constructor = $c_jl_JSConsoleBasedPrintStream$DummyOutputStream;
/** @constructor */
function $h_jl_JSConsoleBasedPrintStream$DummyOutputStream() {
  /*<skip>*/
}
$h_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype = $c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype;
var $d_jl_JSConsoleBasedPrintStream$DummyOutputStream = new $TypeData().initClass({
  jl_JSConsoleBasedPrintStream$DummyOutputStream: 0
}, false, "java.lang.JSConsoleBasedPrintStream$DummyOutputStream", {
  jl_JSConsoleBasedPrintStream$DummyOutputStream: 1,
  Ljava_io_OutputStream: 1,
  O: 1,
  Ljava_io_Closeable: 1,
  Ljava_io_Flushable: 1
});
$c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype.$classData = $d_jl_JSConsoleBasedPrintStream$DummyOutputStream;
/** @constructor */
function $c_jl_RuntimeException() {
  $c_jl_Exception.call(this)
}
$c_jl_RuntimeException.prototype = new $h_jl_Exception();
$c_jl_RuntimeException.prototype.constructor = $c_jl_RuntimeException;
/** @constructor */
function $h_jl_RuntimeException() {
  /*<skip>*/
}
$h_jl_RuntimeException.prototype = $c_jl_RuntimeException.prototype;
$c_jl_RuntimeException.prototype.init___ = (function() {
  $c_jl_RuntimeException.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
$c_jl_RuntimeException.prototype.init___T = (function(s) {
  $c_jl_RuntimeException.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_RuntimeException = new $TypeData().initClass({
  jl_RuntimeException: 0
}, false, "java.lang.RuntimeException", {
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_RuntimeException.prototype.$classData = $d_jl_RuntimeException;
/** @constructor */
function $c_jl_StringBuffer() {
  $c_O.call(this);
  this.content$1 = null
}
$c_jl_StringBuffer.prototype = new $h_O();
$c_jl_StringBuffer.prototype.constructor = $c_jl_StringBuffer;
/** @constructor */
function $h_jl_StringBuffer() {
  /*<skip>*/
}
$h_jl_StringBuffer.prototype = $c_jl_StringBuffer.prototype;
$c_jl_StringBuffer.prototype.init___ = (function() {
  $c_jl_StringBuffer.prototype.init___T.call(this, "");
  return this
});
$c_jl_StringBuffer.prototype.subSequence__I__I__jl_CharSequence = (function(start, end) {
  var thiz = this.content$1;
  return $as_T(thiz["substring"](start, end))
});
$c_jl_StringBuffer.prototype.toString__T = (function() {
  return this.content$1
});
$c_jl_StringBuffer.prototype.length__I = (function() {
  var thiz = this.content$1;
  return $uI(thiz["length"])
});
$c_jl_StringBuffer.prototype.append__T__jl_StringBuffer = (function(s) {
  this.content$1 = (("" + this.content$1) + ((s === null) ? "null" : s));
  return this
});
$c_jl_StringBuffer.prototype.init___T = (function(content) {
  this.content$1 = content;
  return this
});
$c_jl_StringBuffer.prototype.append__C__jl_StringBuffer = (function(c) {
  return this.append__T__jl_StringBuffer($as_T($g["String"]["fromCharCode"](c)))
});
var $d_jl_StringBuffer = new $TypeData().initClass({
  jl_StringBuffer: 0
}, false, "java.lang.StringBuffer", {
  jl_StringBuffer: 1,
  O: 1,
  jl_CharSequence: 1,
  jl_Appendable: 1,
  Ljava_io_Serializable: 1
});
$c_jl_StringBuffer.prototype.$classData = $d_jl_StringBuffer;
/** @constructor */
function $c_jl_StringBuilder() {
  $c_O.call(this);
  this.content$1 = null
}
$c_jl_StringBuilder.prototype = new $h_O();
$c_jl_StringBuilder.prototype.constructor = $c_jl_StringBuilder;
/** @constructor */
function $h_jl_StringBuilder() {
  /*<skip>*/
}
$h_jl_StringBuilder.prototype = $c_jl_StringBuilder.prototype;
$c_jl_StringBuilder.prototype.init___ = (function() {
  $c_jl_StringBuilder.prototype.init___T.call(this, "");
  return this
});
$c_jl_StringBuilder.prototype.append__T__jl_StringBuilder = (function(s) {
  this.content$1 = (("" + this.content$1) + ((s === null) ? "null" : s));
  return this
});
$c_jl_StringBuilder.prototype.subSequence__I__I__jl_CharSequence = (function(start, end) {
  var thiz = this.content$1;
  return $as_T(thiz["substring"](start, end))
});
$c_jl_StringBuilder.prototype.toString__T = (function() {
  return this.content$1
});
$c_jl_StringBuilder.prototype.append__O__jl_StringBuilder = (function(obj) {
  return ((obj === null) ? this.append__T__jl_StringBuilder(null) : this.append__T__jl_StringBuilder($objectToString(obj)))
});
$c_jl_StringBuilder.prototype.init___I = (function(initialCapacity) {
  $c_jl_StringBuilder.prototype.init___T.call(this, "");
  return this
});
$c_jl_StringBuilder.prototype.append__jl_CharSequence__I__I__jl_StringBuilder = (function(csq, start, end) {
  return ((csq === null) ? this.append__jl_CharSequence__I__I__jl_StringBuilder("null", start, end) : this.append__T__jl_StringBuilder($objectToString($charSequenceSubSequence(csq, start, end))))
});
$c_jl_StringBuilder.prototype.length__I = (function() {
  var thiz = this.content$1;
  return $uI(thiz["length"])
});
$c_jl_StringBuilder.prototype.append__C__jl_StringBuilder = (function(c) {
  return this.append__T__jl_StringBuilder($as_T($g["String"]["fromCharCode"](c)))
});
$c_jl_StringBuilder.prototype.init___T = (function(content) {
  this.content$1 = content;
  return this
});
var $d_jl_StringBuilder = new $TypeData().initClass({
  jl_StringBuilder: 0
}, false, "java.lang.StringBuilder", {
  jl_StringBuilder: 1,
  O: 1,
  jl_CharSequence: 1,
  jl_Appendable: 1,
  Ljava_io_Serializable: 1
});
$c_jl_StringBuilder.prototype.$classData = $d_jl_StringBuilder;
/** @constructor */
function $c_s_Array$() {
  $c_s_FallbackArrayBuilding.call(this)
}
$c_s_Array$.prototype = new $h_s_FallbackArrayBuilding();
$c_s_Array$.prototype.constructor = $c_s_Array$;
/** @constructor */
function $h_s_Array$() {
  /*<skip>*/
}
$h_s_Array$.prototype = $c_s_Array$.prototype;
$c_s_Array$.prototype.slowcopy__p2__O__I__O__I__I__V = (function(src, srcPos, dest, destPos, length) {
  var i = srcPos;
  var j = destPos;
  var srcUntil = ((srcPos + length) | 0);
  while ((i < srcUntil)) {
    $m_sr_ScalaRunTime$().array$undupdate__O__I__O__V(dest, j, $m_sr_ScalaRunTime$().array$undapply__O__I__O(src, i));
    i = ((1 + i) | 0);
    j = ((1 + j) | 0)
  }
});
$c_s_Array$.prototype.apply__I__sc_Seq__AI = (function(x, xs) {
  var array = $newArrayObject($d_I.getArrayOf(), [((1 + xs.length__I()) | 0)]);
  array.u[0] = x;
  var elem$1 = 0;
  elem$1 = 1;
  var this$2 = xs.iterator__sc_Iterator();
  while (this$2.hasNext__Z()) {
    var arg1 = this$2.next__O();
    var x$1 = $uI(arg1);
    array.u[elem$1] = x$1;
    elem$1 = ((1 + elem$1) | 0)
  };
  return array
});
$c_s_Array$.prototype.copy__O__I__O__I__I__V = (function(src, srcPos, dest, destPos, length) {
  var srcClass = $objectGetClass(src);
  if ((srcClass.isArray__Z() && $objectGetClass(dest).isAssignableFrom__jl_Class__Z(srcClass))) {
    $systemArraycopy(src, srcPos, dest, destPos, length)
  } else {
    this.slowcopy__p2__O__I__O__I__I__V(src, srcPos, dest, destPos, length)
  }
});
var $d_s_Array$ = new $TypeData().initClass({
  s_Array$: 0
}, false, "scala.Array$", {
  s_Array$: 1,
  s_FallbackArrayBuilding: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Array$.prototype.$classData = $d_s_Array$;
var $n_s_Array$ = (void 0);
function $m_s_Array$() {
  if ((!$n_s_Array$)) {
    $n_s_Array$ = new $c_s_Array$().init___()
  };
  return $n_s_Array$
}
/** @constructor */
function $c_s_Predef$$eq$colon$eq() {
  $c_O.call(this)
}
$c_s_Predef$$eq$colon$eq.prototype = new $h_O();
$c_s_Predef$$eq$colon$eq.prototype.constructor = $c_s_Predef$$eq$colon$eq;
/** @constructor */
function $h_s_Predef$$eq$colon$eq() {
  /*<skip>*/
}
$h_s_Predef$$eq$colon$eq.prototype = $c_s_Predef$$eq$colon$eq.prototype;
$c_s_Predef$$eq$colon$eq.prototype.init___ = (function() {
  return this
});
$c_s_Predef$$eq$colon$eq.prototype.toString__T = (function() {
  return "<function1>"
});
/** @constructor */
function $c_s_Predef$$less$colon$less() {
  $c_O.call(this)
}
$c_s_Predef$$less$colon$less.prototype = new $h_O();
$c_s_Predef$$less$colon$less.prototype.constructor = $c_s_Predef$$less$colon$less;
/** @constructor */
function $h_s_Predef$$less$colon$less() {
  /*<skip>*/
}
$h_s_Predef$$less$colon$less.prototype = $c_s_Predef$$less$colon$less.prototype;
$c_s_Predef$$less$colon$less.prototype.init___ = (function() {
  return this
});
$c_s_Predef$$less$colon$less.prototype.toString__T = (function() {
  return "<function1>"
});
/** @constructor */
function $c_s_math_Equiv$() {
  $c_O.call(this)
}
$c_s_math_Equiv$.prototype = new $h_O();
$c_s_math_Equiv$.prototype.constructor = $c_s_math_Equiv$;
/** @constructor */
function $h_s_math_Equiv$() {
  /*<skip>*/
}
$h_s_math_Equiv$.prototype = $c_s_math_Equiv$.prototype;
$c_s_math_Equiv$.prototype.init___ = (function() {
  $n_s_math_Equiv$ = this;
  return this
});
var $d_s_math_Equiv$ = new $TypeData().initClass({
  s_math_Equiv$: 0
}, false, "scala.math.Equiv$", {
  s_math_Equiv$: 1,
  O: 1,
  s_math_LowPriorityEquiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Equiv$.prototype.$classData = $d_s_math_Equiv$;
var $n_s_math_Equiv$ = (void 0);
function $m_s_math_Equiv$() {
  if ((!$n_s_math_Equiv$)) {
    $n_s_math_Equiv$ = new $c_s_math_Equiv$().init___()
  };
  return $n_s_math_Equiv$
}
/** @constructor */
function $c_s_math_Ordering$() {
  $c_O.call(this)
}
$c_s_math_Ordering$.prototype = new $h_O();
$c_s_math_Ordering$.prototype.constructor = $c_s_math_Ordering$;
/** @constructor */
function $h_s_math_Ordering$() {
  /*<skip>*/
}
$h_s_math_Ordering$.prototype = $c_s_math_Ordering$.prototype;
$c_s_math_Ordering$.prototype.init___ = (function() {
  $n_s_math_Ordering$ = this;
  return this
});
var $d_s_math_Ordering$ = new $TypeData().initClass({
  s_math_Ordering$: 0
}, false, "scala.math.Ordering$", {
  s_math_Ordering$: 1,
  O: 1,
  s_math_LowPriorityOrderingImplicits: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Ordering$.prototype.$classData = $d_s_math_Ordering$;
var $n_s_math_Ordering$ = (void 0);
function $m_s_math_Ordering$() {
  if ((!$n_s_math_Ordering$)) {
    $n_s_math_Ordering$ = new $c_s_math_Ordering$().init___()
  };
  return $n_s_math_Ordering$
}
/** @constructor */
function $c_s_reflect_NoManifest$() {
  $c_O.call(this)
}
$c_s_reflect_NoManifest$.prototype = new $h_O();
$c_s_reflect_NoManifest$.prototype.constructor = $c_s_reflect_NoManifest$;
/** @constructor */
function $h_s_reflect_NoManifest$() {
  /*<skip>*/
}
$h_s_reflect_NoManifest$.prototype = $c_s_reflect_NoManifest$.prototype;
$c_s_reflect_NoManifest$.prototype.toString__T = (function() {
  return "<?>"
});
var $d_s_reflect_NoManifest$ = new $TypeData().initClass({
  s_reflect_NoManifest$: 0
}, false, "scala.reflect.NoManifest$", {
  s_reflect_NoManifest$: 1,
  O: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_reflect_NoManifest$.prototype.$classData = $d_s_reflect_NoManifest$;
var $n_s_reflect_NoManifest$ = (void 0);
function $m_s_reflect_NoManifest$() {
  if ((!$n_s_reflect_NoManifest$)) {
    $n_s_reflect_NoManifest$ = new $c_s_reflect_NoManifest$().init___()
  };
  return $n_s_reflect_NoManifest$
}
/** @constructor */
function $c_sc_AbstractIterator() {
  $c_O.call(this)
}
$c_sc_AbstractIterator.prototype = new $h_O();
$c_sc_AbstractIterator.prototype.constructor = $c_sc_AbstractIterator;
/** @constructor */
function $h_sc_AbstractIterator() {
  /*<skip>*/
}
$h_sc_AbstractIterator.prototype = $c_sc_AbstractIterator.prototype;
$c_sc_AbstractIterator.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sc_AbstractIterator.prototype.init___ = (function() {
  return this
});
$c_sc_AbstractIterator.prototype.isEmpty__Z = (function() {
  return $s_sc_Iterator$class__isEmpty__sc_Iterator__Z(this)
});
$c_sc_AbstractIterator.prototype.toString__T = (function() {
  return $s_sc_Iterator$class__toString__sc_Iterator__T(this)
});
$c_sc_AbstractIterator.prototype.foreach__F1__V = (function(f) {
  $s_sc_Iterator$class__foreach__sc_Iterator__F1__V(this, f)
});
$c_sc_AbstractIterator.prototype.toStream__sci_Stream = (function() {
  return $s_sc_Iterator$class__toStream__sc_Iterator__sci_Stream(this)
});
$c_sc_AbstractIterator.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
/** @constructor */
function $c_scg_SetFactory() {
  $c_scg_GenSetFactory.call(this)
}
$c_scg_SetFactory.prototype = new $h_scg_GenSetFactory();
$c_scg_SetFactory.prototype.constructor = $c_scg_SetFactory;
/** @constructor */
function $h_scg_SetFactory() {
  /*<skip>*/
}
$h_scg_SetFactory.prototype = $c_scg_SetFactory.prototype;
/** @constructor */
function $c_sci_ListSet$ListSetBuilder() {
  $c_O.call(this);
  this.elems$1 = null;
  this.seen$1 = null
}
$c_sci_ListSet$ListSetBuilder.prototype = new $h_O();
$c_sci_ListSet$ListSetBuilder.prototype.constructor = $c_sci_ListSet$ListSetBuilder;
/** @constructor */
function $h_sci_ListSet$ListSetBuilder() {
  /*<skip>*/
}
$h_sci_ListSet$ListSetBuilder.prototype = $c_sci_ListSet$ListSetBuilder.prototype;
$c_sci_ListSet$ListSetBuilder.prototype.result__sci_ListSet = (function() {
  var this$2 = this.elems$1;
  var z = $m_sci_ListSet$EmptyListSet$();
  var this$3 = this$2.scala$collection$mutable$ListBuffer$$start$6;
  var acc = z;
  var these = this$3;
  while ((!these.isEmpty__Z())) {
    var arg1 = acc;
    var arg2 = these.head__O();
    var x$1 = $as_sci_ListSet(arg1);
    acc = new $c_sci_ListSet$Node().init___sci_ListSet__O(x$1, arg2);
    these = $as_sc_LinearSeqOptimized(these.tail__O())
  };
  return $as_sci_ListSet(acc)
});
$c_sci_ListSet$ListSetBuilder.prototype.init___ = (function() {
  $c_sci_ListSet$ListSetBuilder.prototype.init___sci_ListSet.call(this, $m_sci_ListSet$EmptyListSet$());
  return this
});
$c_sci_ListSet$ListSetBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__sci_ListSet$ListSetBuilder(elem)
});
$c_sci_ListSet$ListSetBuilder.prototype.init___sci_ListSet = (function(initial) {
  var this$1 = new $c_scm_ListBuffer().init___().$$plus$plus$eq__sc_TraversableOnce__scm_ListBuffer(initial);
  this.elems$1 = $as_scm_ListBuffer($s_sc_SeqLike$class__reverse__sc_SeqLike__O(this$1));
  var this$2 = new $c_scm_HashSet().init___();
  this.seen$1 = $as_scm_HashSet($s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this$2, initial));
  return this
});
$c_sci_ListSet$ListSetBuilder.prototype.result__O = (function() {
  return this.result__sci_ListSet()
});
$c_sci_ListSet$ListSetBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_sci_ListSet$ListSetBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__sci_ListSet$ListSetBuilder(elem)
});
$c_sci_ListSet$ListSetBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_sci_ListSet$ListSetBuilder.prototype.$$plus$eq__O__sci_ListSet$ListSetBuilder = (function(x) {
  var this$1 = this.seen$1;
  if ((!$s_scm_FlatHashTable$class__containsElem__scm_FlatHashTable__O__Z(this$1, x))) {
    this.elems$1.$$plus$eq__O__scm_ListBuffer(x);
    this.seen$1.$$plus$eq__O__scm_HashSet(x)
  };
  return this
});
$c_sci_ListSet$ListSetBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
var $d_sci_ListSet$ListSetBuilder = new $TypeData().initClass({
  sci_ListSet$ListSetBuilder: 0
}, false, "scala.collection.immutable.ListSet$ListSetBuilder", {
  sci_ListSet$ListSetBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1
});
$c_sci_ListSet$ListSetBuilder.prototype.$classData = $d_sci_ListSet$ListSetBuilder;
/** @constructor */
function $c_sci_Map$() {
  $c_scg_ImmutableMapFactory.call(this)
}
$c_sci_Map$.prototype = new $h_scg_ImmutableMapFactory();
$c_sci_Map$.prototype.constructor = $c_sci_Map$;
/** @constructor */
function $h_sci_Map$() {
  /*<skip>*/
}
$h_sci_Map$.prototype = $c_sci_Map$.prototype;
var $d_sci_Map$ = new $TypeData().initClass({
  sci_Map$: 0
}, false, "scala.collection.immutable.Map$", {
  sci_Map$: 1,
  scg_ImmutableMapFactory: 1,
  scg_MapFactory: 1,
  scg_GenMapFactory: 1,
  O: 1
});
$c_sci_Map$.prototype.$classData = $d_sci_Map$;
var $n_sci_Map$ = (void 0);
function $m_sci_Map$() {
  if ((!$n_sci_Map$)) {
    $n_sci_Map$ = new $c_sci_Map$().init___()
  };
  return $n_sci_Map$
}
/** @constructor */
function $c_scm_GrowingBuilder() {
  $c_O.call(this);
  this.empty$1 = null;
  this.elems$1 = null
}
$c_scm_GrowingBuilder.prototype = new $h_O();
$c_scm_GrowingBuilder.prototype.constructor = $c_scm_GrowingBuilder;
/** @constructor */
function $h_scm_GrowingBuilder() {
  /*<skip>*/
}
$h_scm_GrowingBuilder.prototype = $c_scm_GrowingBuilder.prototype;
$c_scm_GrowingBuilder.prototype.init___scg_Growable = (function(empty) {
  this.empty$1 = empty;
  this.elems$1 = empty;
  return this
});
$c_scm_GrowingBuilder.prototype.$$plus$eq__O__scm_GrowingBuilder = (function(x) {
  this.elems$1.$$plus$eq__O__scg_Growable(x);
  return this
});
$c_scm_GrowingBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_GrowingBuilder(elem)
});
$c_scm_GrowingBuilder.prototype.result__O = (function() {
  return this.elems$1
});
$c_scm_GrowingBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_GrowingBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_GrowingBuilder(elem)
});
$c_scm_GrowingBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_GrowingBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
var $d_scm_GrowingBuilder = new $TypeData().initClass({
  scm_GrowingBuilder: 0
}, false, "scala.collection.mutable.GrowingBuilder", {
  scm_GrowingBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1
});
$c_scm_GrowingBuilder.prototype.$classData = $d_scm_GrowingBuilder;
/** @constructor */
function $c_scm_LazyBuilder() {
  $c_O.call(this);
  this.parts$1 = null
}
$c_scm_LazyBuilder.prototype = new $h_O();
$c_scm_LazyBuilder.prototype.constructor = $c_scm_LazyBuilder;
/** @constructor */
function $h_scm_LazyBuilder() {
  /*<skip>*/
}
$h_scm_LazyBuilder.prototype = $c_scm_LazyBuilder.prototype;
$c_scm_LazyBuilder.prototype.init___ = (function() {
  this.parts$1 = new $c_scm_ListBuffer().init___();
  return this
});
$c_scm_LazyBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_LazyBuilder = (function(xs) {
  this.parts$1.$$plus$eq__O__scm_ListBuffer(xs);
  return this
});
$c_scm_LazyBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_LazyBuilder(elem)
});
$c_scm_LazyBuilder.prototype.$$plus$eq__O__scm_LazyBuilder = (function(x) {
  var jsx$1 = this.parts$1;
  $m_sci_List$();
  var xs = new $c_sjs_js_WrappedArray().init___sjs_js_Array([x]);
  var this$2 = $m_sci_List$();
  var cbf = this$2.ReusableCBFInstance$2;
  jsx$1.$$plus$eq__O__scm_ListBuffer($as_sci_List($s_sc_TraversableLike$class__to__sc_TraversableLike__scg_CanBuildFrom__O(xs, cbf)));
  return this
});
$c_scm_LazyBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_LazyBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_LazyBuilder(elem)
});
$c_scm_LazyBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_LazyBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_LazyBuilder(xs)
});
/** @constructor */
function $c_scm_SetBuilder() {
  $c_O.call(this);
  this.empty$1 = null;
  this.elems$1 = null
}
$c_scm_SetBuilder.prototype = new $h_O();
$c_scm_SetBuilder.prototype.constructor = $c_scm_SetBuilder;
/** @constructor */
function $h_scm_SetBuilder() {
  /*<skip>*/
}
$h_scm_SetBuilder.prototype = $c_scm_SetBuilder.prototype;
$c_scm_SetBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_SetBuilder(elem)
});
$c_scm_SetBuilder.prototype.result__O = (function() {
  return this.elems$1
});
$c_scm_SetBuilder.prototype.$$plus$eq__O__scm_SetBuilder = (function(x) {
  this.elems$1 = this.elems$1.$$plus__O__sc_Set(x);
  return this
});
$c_scm_SetBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_SetBuilder.prototype.init___sc_Set = (function(empty) {
  this.empty$1 = empty;
  this.elems$1 = empty;
  return this
});
$c_scm_SetBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_SetBuilder(elem)
});
$c_scm_SetBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_SetBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
var $d_scm_SetBuilder = new $TypeData().initClass({
  scm_SetBuilder: 0
}, false, "scala.collection.mutable.SetBuilder", {
  scm_SetBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1
});
$c_scm_SetBuilder.prototype.$classData = $d_scm_SetBuilder;
/** @constructor */
function $c_sr_AbstractFunction0$mcV$sp() {
  $c_sr_AbstractFunction0.call(this)
}
$c_sr_AbstractFunction0$mcV$sp.prototype = new $h_sr_AbstractFunction0();
$c_sr_AbstractFunction0$mcV$sp.prototype.constructor = $c_sr_AbstractFunction0$mcV$sp;
/** @constructor */
function $h_sr_AbstractFunction0$mcV$sp() {
  /*<skip>*/
}
$h_sr_AbstractFunction0$mcV$sp.prototype = $c_sr_AbstractFunction0$mcV$sp.prototype;
/** @constructor */
function $c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2() {
  $c_sr_AbstractFunction1.call(this);
  this.$$outer$2 = null;
  this.g$1$f = null
}
$c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2.prototype.constructor = $c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2;
/** @constructor */
function $h_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2.prototype = $c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2.prototype;
$c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2.prototype.apply__O__O = (function(v1) {
  var f = $as_F1(v1);
  return new $c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2$$anonfun$apply$3().init___Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2__F1(this, f)
});
$c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2.prototype.init___Ljapgolly_scalajs_react_Internal$FnComposer__F1 = (function($$outer, g$1) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.g$1$f = g$1;
  return this
});
var $d_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2: 0
}, false, "japgolly.scalajs.react.Internal$FnComposer$$anonfun$apply$2", {
  Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2.prototype.$classData = $d_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2;
/** @constructor */
function $c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2$$anonfun$apply$3() {
  $c_sr_AbstractFunction1.call(this);
  this.$$outer$2 = null;
  this.f$1$f = null
}
$c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2$$anonfun$apply$3.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2$$anonfun$apply$3.prototype.constructor = $c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2$$anonfun$apply$3;
/** @constructor */
function $h_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2$$anonfun$apply$3() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2$$anonfun$apply$3.prototype = $c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2$$anonfun$apply$3.prototype;
$c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2$$anonfun$apply$3.prototype.apply__O__O = (function(a) {
  return this.$$outer$2.$$outer$2.japgolly$scalajs$react$Internal$FnComposer$$compose$f.apply__O__O__O(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(arg$outer, a$1) {
    return (function() {
      return arg$outer.f$1$f.apply__O__O(a$1)
    })
  })(this, a)), new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(arg$outer$1, a$1$1) {
    return (function() {
      return arg$outer$1.$$outer$2.g$1$f.apply__O__O(a$1$1)
    })
  })(this, a)))
});
$c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2$$anonfun$apply$3.prototype.init___Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2__F1 = (function($$outer, f$1) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.f$1$f = f$1;
  return this
});
var $d_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2$$anonfun$apply$3 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2$$anonfun$apply$3: 0
}, false, "japgolly.scalajs.react.Internal$FnComposer$$anonfun$apply$2$$anonfun$apply$3", {
  Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2$$anonfun$apply$3: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2$$anonfun$apply$3.prototype.$classData = $d_Ljapgolly_scalajs_react_Internal$FnComposer$$anonfun$apply$2$$anonfun$apply$3;
/** @constructor */
function $c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2() {
  $c_sr_AbstractFunction1.call(this);
  this.f$14$f = null
}
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2.prototype.constructor = $c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2.prototype = $c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2.prototype;
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2.prototype.apply__O__O = (function(v1) {
  return this.apply__F1__F1($as_F1(v1))
});
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2.prototype.apply__F1__F1 = (function(g) {
  return new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer, g$1) {
    return (function($$$) {
      g$1.apply__O__O($$$);
      arg$outer.f$14$f.apply__O__O($$$)
    })
  })(this, g))
});
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2.prototype.init___Ljapgolly_scalajs_react_ReactComponentB$Builder__F1 = (function($$outer, f$14) {
  this.f$14$f = f$14;
  return this
});
var $d_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2: 0
}, false, "japgolly.scalajs.react.ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2", {
  Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2.prototype.$classData = $d_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$japgolly$scalajs$react$ReactComponentB$Builder$$onWillMountFn$1$2;
/** @constructor */
function $c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnP$1$1() {
  $c_sr_AbstractFunction1.call(this);
  this.spec$1$2 = null;
  this.a$2$f = null;
  this.name$2$2 = null
}
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnP$1$1.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnP$1$1.prototype.constructor = $c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnP$1$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnP$1$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnP$1$1.prototype = $c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnP$1$1.prototype;
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnP$1$1.prototype.apply__O__O = (function(v1) {
  this.apply__F1__V($as_F1(v1))
});
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnP$1$1.prototype.apply__F1__V = (function(f) {
  var g = new $c_sjsr_AnonFunction3().init___sjs_js_Function3((function(arg$outer, f$16) {
    return (function($$$, p$2, s$2) {
      var $$this = $as_Ljapgolly_scalajs_react_CallbackTo(f$16.apply__O__O(arg$outer.a$2$f.apply__O__O__O($$$, p$2["v"]))).japgolly$scalajs$react$CallbackTo$$f$1;
      return $$this.apply__O()
    })
  })(this, f));
  this.spec$1$2[this.name$2$2] = (function(f$1) {
    return (function(arg1, arg2) {
      return f$1.apply__O__O__O__O(this, arg1, arg2)
    })
  })(g)
});
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnP$1$1.prototype.init___Ljapgolly_scalajs_react_ReactComponentB$Builder__sjs_js_Dictionary__F2__T = (function($$outer, spec$1, a$2, name$2) {
  this.spec$1$2 = spec$1;
  this.a$2$f = a$2;
  this.name$2$2 = name$2;
  return this
});
var $d_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnP$1$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnP$1$1: 0
}, false, "japgolly.scalajs.react.ReactComponentB$Builder$$anonfun$setFnP$1$1", {
  Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnP$1$1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnP$1$1.prototype.$classData = $d_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnP$1$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1() {
  $c_sr_AbstractFunction1.call(this);
  this.spec$1$2 = null;
  this.a$1$f = null;
  this.name$1$2 = null
}
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1.prototype.constructor = $c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1.prototype = $c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1.prototype;
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1.prototype.apply__O__O = (function(v1) {
  this.apply__F1__V($as_F1(v1))
});
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1.prototype.apply__F1__V = (function(f) {
  var g = new $c_sjsr_AnonFunction3().init___sjs_js_Function3((function(arg$outer, f$15) {
    return (function($$$, p$2, s$2) {
      var $$this = $as_Ljapgolly_scalajs_react_CallbackTo(f$15.apply__O__O(arg$outer.a$1$f.apply__O__O__O__O($$$, p$2["v"], s$2["v"]))).japgolly$scalajs$react$CallbackTo$$f$1;
      return $$this.apply__O()
    })
  })(this, f));
  this.spec$1$2[this.name$1$2] = (function(f$1) {
    return (function(arg1, arg2) {
      return f$1.apply__O__O__O__O(this, arg1, arg2)
    })
  })(g)
});
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1.prototype.init___Ljapgolly_scalajs_react_ReactComponentB$Builder__sjs_js_Dictionary__F3__T = (function($$outer, spec$1, a$1, name$1) {
  this.spec$1$2 = spec$1;
  this.a$1$f = a$1;
  this.name$1$2 = name$1;
  return this
});
var $d_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1: 0
}, false, "japgolly.scalajs.react.ReactComponentB$Builder$$anonfun$setFnPS$1$1", {
  Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1.prototype.$classData = $d_Ljapgolly_scalajs_react_ReactComponentB$Builder$$anonfun$setFnPS$1$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle() {
  $c_O.call(this);
  this.configureSpec$1 = null;
  this.getDefaultProps$1 = null;
  this.componentWillMount$1 = null;
  this.componentDidMount$1 = null;
  this.componentWillUnmount$1 = null;
  this.componentWillUpdate$1 = null;
  this.componentDidUpdate$1 = null;
  this.componentWillReceiveProps$1 = null;
  this.shouldComponentUpdate$1 = null
}
$c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle.prototype.constructor = $c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle.prototype = $c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle.prototype;
$c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle.prototype.productPrefix__T = (function() {
  return "LifeCycle"
});
$c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle.prototype.init___sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr = (function(configureSpec, getDefaultProps, componentWillMount, componentDidMount, componentWillUnmount, componentWillUpdate, componentDidUpdate, componentWillReceiveProps, shouldComponentUpdate) {
  this.configureSpec$1 = configureSpec;
  this.getDefaultProps$1 = getDefaultProps;
  this.componentWillMount$1 = componentWillMount;
  this.componentDidMount$1 = componentDidMount;
  this.componentWillUnmount$1 = componentWillUnmount;
  this.componentWillUpdate$1 = componentWillUpdate;
  this.componentDidUpdate$1 = componentDidUpdate;
  this.componentWillReceiveProps$1 = componentWillReceiveProps;
  this.shouldComponentUpdate$1 = shouldComponentUpdate;
  return this
});
$c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle.prototype.productArity__I = (function() {
  return 9
});
$c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle(x$1)) {
    var LifeCycle$1 = $as_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle(x$1);
    return (((((((($m_sr_BoxesRunTime$().equals__O__O__Z(this.configureSpec$1, LifeCycle$1.configureSpec$1) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.getDefaultProps$1, LifeCycle$1.getDefaultProps$1)) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.componentWillMount$1, LifeCycle$1.componentWillMount$1)) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.componentDidMount$1, LifeCycle$1.componentDidMount$1)) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.componentWillUnmount$1, LifeCycle$1.componentWillUnmount$1)) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.componentWillUpdate$1, LifeCycle$1.componentWillUpdate$1)) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.componentDidUpdate$1, LifeCycle$1.componentDidUpdate$1)) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.componentWillReceiveProps$1, LifeCycle$1.componentWillReceiveProps$1)) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.shouldComponentUpdate$1, LifeCycle$1.shouldComponentUpdate$1))
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.configureSpec$1;
      break
    }
    case 1: {
      return this.getDefaultProps$1;
      break
    }
    case 2: {
      return this.componentWillMount$1;
      break
    }
    case 3: {
      return this.componentDidMount$1;
      break
    }
    case 4: {
      return this.componentWillUnmount$1;
      break
    }
    case 5: {
      return this.componentWillUpdate$1;
      break
    }
    case 6: {
      return this.componentDidUpdate$1;
      break
    }
    case 7: {
      return this.componentWillReceiveProps$1;
      break
    }
    case 8: {
      return this.shouldComponentUpdate$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_ReactComponentB$LifeCycle)))
}
function $as_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle(obj) {
  return (($is_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.ReactComponentB$LifeCycle"))
}
function $isArrayOf_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_ReactComponentB$LifeCycle)))
}
function $asArrayOf_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.ReactComponentB$LifeCycle;", depth))
}
var $d_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ReactComponentB$LifeCycle: 0
}, false, "japgolly.scalajs.react.ReactComponentB$LifeCycle", {
  Ljapgolly_scalajs_react_ReactComponentB$LifeCycle: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle.prototype.$classData = $d_Ljapgolly_scalajs_react_ReactComponentB$LifeCycle;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1() {
  $c_sr_AbstractFunction0.call(this);
  this.$$outer$2 = null;
  this.f$1$f = null
}
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1.prototype = new $h_sr_AbstractFunction0();
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1.prototype = $c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1.prototype;
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1.prototype.init___Ljapgolly_scalajs_react_extra_Broadcaster__F1 = (function($$outer, f$1) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.f$1$f = f$1;
  return this
});
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1.prototype.apply__O = (function() {
  return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(this.apply__F0())
});
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1.prototype.apply__F0 = (function() {
  var jsx$1 = this.$$outer$2;
  var this$1 = this.$$outer$2.japgolly$scalajs$react$extra$Broadcaster$$$undlisteners$1;
  var x = this.f$1$f;
  jsx$1.japgolly$scalajs$react$extra$Broadcaster$$$undlisteners$1 = new $c_sci_$colon$colon().init___O__sci_List(x, this$1);
  $m_Ljapgolly_scalajs_react_Callback$();
  var f = new $c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1$$anonfun$apply$1().init___Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1(this);
  var f$2 = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(f$1) {
    return (function() {
      f$1.apply__O()
    })
  })(f));
  return f$2
});
var $d_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1: 0
}, false, "japgolly.scalajs.react.extra.Broadcaster$$anonfun$register$1", {
  Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1: 1,
  sr_AbstractFunction0: 1,
  O: 1,
  F0: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_EventListener$$anonfun$install$1() {
  $c_sr_AbstractFunction1.call(this);
  this.listener$1$2 = null
}
$c_Ljapgolly_scalajs_react_extra_EventListener$$anonfun$install$1.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_EventListener$$anonfun$install$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_EventListener$$anonfun$install$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_EventListener$$anonfun$install$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_EventListener$$anonfun$install$1.prototype = $c_Ljapgolly_scalajs_react_extra_EventListener$$anonfun$install$1.prototype;
$c_Ljapgolly_scalajs_react_extra_EventListener$$anonfun$install$1.prototype.apply__O__O = (function(v1) {
  return this.apply__Ljapgolly_scalajs_react_CompScope$DuringCallbackM__F1(v1)
});
$c_Ljapgolly_scalajs_react_extra_EventListener$$anonfun$install$1.prototype.apply__Ljapgolly_scalajs_react_CompScope$DuringCallbackM__F1 = (function($$) {
  var cb = $as_Ljapgolly_scalajs_react_CallbackTo(this.listener$1$2.apply__O__O($$)).japgolly$scalajs$react$CallbackTo$$f$1;
  return new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(cb$1) {
    return (function(x$3$2) {
      return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(cb$1)
    })
  })(cb))
});
$c_Ljapgolly_scalajs_react_extra_EventListener$$anonfun$install$1.prototype.init___F1 = (function(listener$1) {
  this.listener$1$2 = listener$1;
  return this
});
var $d_Ljapgolly_scalajs_react_extra_EventListener$$anonfun$install$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_EventListener$$anonfun$install$1: 0
}, false, "japgolly.scalajs.react.extra.EventListener$$anonfun$install$1", {
  Ljapgolly_scalajs_react_extra_EventListener$$anonfun$install$1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_EventListener$$anonfun$install$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_EventListener$$anonfun$install$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1() {
  $c_sr_AbstractFunction1.call(this);
  this.eventType$1$f = null;
  this.listener$2$f = null;
  this.target$1$f = null;
  this.useCapture$1$f = false
}
$c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1.prototype = $c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1.prototype;
$c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1.prototype.apply__O__O = (function(v1) {
  return this.apply__Ljapgolly_scalajs_react_ReactComponentB__Ljapgolly_scalajs_react_ReactComponentB($as_Ljapgolly_scalajs_react_ReactComponentB(v1))
});
$c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1.prototype.init___T__F1__F1__Z = (function(eventType$1, listener$2, target$1, useCapture$1) {
  this.eventType$1$f = eventType$1;
  this.listener$2$f = listener$2;
  this.target$1$f = target$1;
  this.useCapture$1$f = useCapture$1;
  return this
});
$c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1.prototype.apply__Ljapgolly_scalajs_react_ReactComponentB__Ljapgolly_scalajs_react_ReactComponentB = (function(x$2) {
  return x$2.componentDidMount__F1__Ljapgolly_scalajs_react_ReactComponentB(new $c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1$$anonfun$apply$1().init___Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1(this))
});
var $d_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1: 0
}, false, "japgolly.scalajs.react.extra.EventListener$OfEventType$$anonfun$install$extension$1", {
  Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1$$anonfun$apply$1() {
  $c_sr_AbstractFunction1.call(this);
  this.$$outer$2 = null
}
$c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1$$anonfun$apply$1.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1$$anonfun$apply$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1$$anonfun$apply$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1$$anonfun$apply$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1$$anonfun$apply$1.prototype = $c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1$$anonfun$apply$1.prototype;
$c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1$$anonfun$apply$1.prototype.apply__O__O = (function(v1) {
  return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(this.apply__Ljapgolly_scalajs_react_CompScope$DuringCallbackM__F0(v1))
});
$c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1$$anonfun$apply$1.prototype.init___Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1 = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  return this
});
$c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1$$anonfun$apply$1.prototype.apply__Ljapgolly_scalajs_react_CompScope$DuringCallbackM__F0 = (function($$) {
  var et = this.$$outer$2.target$1$f.apply__O__O($$);
  var fe = $as_F1(this.$$outer$2.listener$2$f.apply__O__O($$));
  var f = (function(fe$1) {
    return (function(e$2) {
      var $$this = $as_Ljapgolly_scalajs_react_CallbackTo(fe$1.apply__O__O(e$2)).japgolly$scalajs$react$CallbackTo$$f$1;
      $$this.apply__O()
    })
  })(fe);
  $m_Ljapgolly_scalajs_react_Callback$();
  var f$2 = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(arg$outer, et$1, f$1) {
    return (function() {
      et$1["addEventListener"](arg$outer.$$outer$2.eventType$1$f, f$1, arg$outer.$$outer$2.useCapture$1$f)
    })
  })(this, et, f));
  var add = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(f$1$1) {
    return (function() {
      f$1$1.apply__O()
    })
  })(f$2));
  $m_Ljapgolly_scalajs_react_Callback$();
  var f$4 = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(arg$outer$1, et$1$1, f$1$2) {
    return (function() {
      et$1$1["removeEventListener"](arg$outer$1.$$outer$2.eventType$1$f, f$1$2, arg$outer$1.$$outer$2.useCapture$1$f)
    })
  })(this, et, f));
  var del = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(f$1$3) {
    return (function() {
      f$1$3.apply__O()
    })
  })(f$4));
  var jsx$1 = $m_Ljapgolly_scalajs_react_CallbackTo$();
  var this$6 = $as_Ljapgolly_scalajs_react_extra_OnUnmount($$["backend"]);
  return jsx$1.$$greater$greater$extension__F0__F0__F0(add, $s_Ljapgolly_scalajs_react_extra_OnUnmount$class__onUnmount__Ljapgolly_scalajs_react_extra_OnUnmount__F0__F0(this$6, del))
});
var $d_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1$$anonfun$apply$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1$$anonfun$apply$1: 0
}, false, "japgolly.scalajs.react.extra.EventListener$OfEventType$$anonfun$install$extension$1$$anonfun$apply$1", {
  Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1$$anonfun$apply$1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1$$anonfun$apply$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_EventListener$OfEventType$$anonfun$install$extension$1$$anonfun$apply$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1() {
  $c_sr_AbstractFunction1.call(this);
  this.f$1$f = null;
  this.g$1$f = null
}
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1.prototype = $c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1.prototype;
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1.prototype.apply__O__O = (function(v1) {
  return this.apply__Ljapgolly_scalajs_react_ReactComponentB__Ljapgolly_scalajs_react_ReactComponentB($as_Ljapgolly_scalajs_react_ReactComponentB(v1))
});
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1.prototype.apply__Ljapgolly_scalajs_react_ReactComponentB__Ljapgolly_scalajs_react_ReactComponentB = (function(x$1) {
  return x$1.componentDidMount__F1__Ljapgolly_scalajs_react_ReactComponentB(new $c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1$$anonfun$apply$1().init___Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1(this))
});
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1.prototype.init___F1__F1 = (function(f$1, g$1) {
  this.f$1$f = f$1;
  this.g$1$f = g$1;
  return this
});
var $d_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1: 0
}, false, "japgolly.scalajs.react.extra.Listenable$$anonfun$install$1", {
  Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1$$anonfun$apply$1() {
  $c_sr_AbstractFunction1.call(this);
  this.$$outer$2 = null
}
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1$$anonfun$apply$1.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1$$anonfun$apply$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1$$anonfun$apply$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1$$anonfun$apply$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1$$anonfun$apply$1.prototype = $c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1$$anonfun$apply$1.prototype;
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1$$anonfun$apply$1.prototype.apply__O__O = (function(v1) {
  return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(this.apply__Ljapgolly_scalajs_react_CompScope$DuringCallbackM__F0(v1))
});
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1$$anonfun$apply$1.prototype.init___Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1 = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  return this
});
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1$$anonfun$apply$1.prototype.apply__Ljapgolly_scalajs_react_CompScope$DuringCallbackM__F0 = (function($$) {
  var this$4 = $m_Ljapgolly_scalajs_react_CallbackTo$();
  var this$3 = $as_Ljapgolly_scalajs_react_extra_Listenable(this.$$outer$2.f$1$f.apply__O__O($$["props"]["v"]));
  var f = $as_F1(this.$$outer$2.g$1$f.apply__O__O($$));
  var $$this = $s_Ljapgolly_scalajs_react_extra_Broadcaster$class__register__Ljapgolly_scalajs_react_extra_Broadcaster__F1__F0(this$3, f);
  var eta$0$1 = $as_Ljapgolly_scalajs_react_extra_OnUnmount($$["backend"]);
  var g = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(eta$0$1$1) {
    return (function(f$2) {
      var f$1 = $as_Ljapgolly_scalajs_react_CallbackTo(f$2).japgolly$scalajs$react$CallbackTo$$f$1;
      return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($s_Ljapgolly_scalajs_react_extra_OnUnmount$class__onUnmount__Ljapgolly_scalajs_react_extra_OnUnmount__F0__F0(eta$0$1$1, f$1))
    })
  })(eta$0$1));
  return this$4.flatMap$extension__F0__F1__F0($$this, g)
});
var $d_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1$$anonfun$apply$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1$$anonfun$apply$1: 0
}, false, "japgolly.scalajs.react.extra.Listenable$$anonfun$install$1$$anonfun$apply$1", {
  Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1$$anonfun$apply$1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1$$anonfun$apply$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$install$1$$anonfun$apply$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$installU$1() {
  $c_sr_AbstractFunction1.call(this);
  this.g$2$f = null
}
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$installU$1.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$installU$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$installU$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$installU$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$installU$1.prototype = $c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$installU$1.prototype;
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$installU$1.prototype.apply__O__O = (function(v1) {
  return this.apply__Ljapgolly_scalajs_react_CompScope$DuringCallbackM__F1(v1)
});
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$installU$1.prototype.apply__Ljapgolly_scalajs_react_CompScope$DuringCallbackM__F1 = (function($$) {
  return new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer, $$$1) {
    return (function(x$2$2) {
      $asUnit(x$2$2);
      return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($as_Ljapgolly_scalajs_react_CallbackTo(arg$outer.g$2$f.apply__O__O($$$1)).japgolly$scalajs$react$CallbackTo$$f$1)
    })
  })(this, $$))
});
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$installU$1.prototype.init___F1 = (function(g$2) {
  this.g$2$f = g$2;
  return this
});
var $d_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$installU$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_Listenable$$anonfun$installU$1: 0
}, false, "japgolly.scalajs.react.extra.Listenable$$anonfun$installU$1", {
  Ljapgolly_scalajs_react_extra_Listenable$$anonfun$installU$1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$installU$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_Listenable$$anonfun$installU$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$install$1() {
  $c_sr_AbstractFunction1.call(this)
}
$c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$install$1.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$install$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$install$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$install$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$install$1.prototype = $c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$install$1.prototype;
$c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$install$1.prototype.apply__O__O = (function(v1) {
  return this.apply__Ljapgolly_scalajs_react_ReactComponentB__Ljapgolly_scalajs_react_ReactComponentB($as_Ljapgolly_scalajs_react_ReactComponentB(v1))
});
$c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$install$1.prototype.apply__Ljapgolly_scalajs_react_ReactComponentB__Ljapgolly_scalajs_react_ReactComponentB = (function(x$2) {
  return x$2.componentWillUnmount__F1__Ljapgolly_scalajs_react_ReactComponentB(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$3$2) {
    var this$1 = $as_Ljapgolly_scalajs_react_extra_OnUnmount(x$3$2["backend"]);
    return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($s_Ljapgolly_scalajs_react_extra_OnUnmount$class__unmount__Ljapgolly_scalajs_react_extra_OnUnmount__F0(this$1))
  })))
});
var $d_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$install$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$install$1: 0
}, false, "japgolly.scalajs.react.extra.OnUnmount$$anonfun$install$1", {
  Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$install$1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$install$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$install$1;
function $is_Ljapgolly_scalajs_react_extra_router_Redirect(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_Redirect)))
}
function $as_Ljapgolly_scalajs_react_extra_router_Redirect(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_Redirect(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.Redirect"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_Redirect(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_Redirect)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_Redirect(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_Redirect(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.Redirect;", depth))
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_Resolution() {
  $c_O.call(this);
  this.page$1 = null;
  this.render$1 = null
}
$c_Ljapgolly_scalajs_react_extra_router_Resolution.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_Resolution.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_Resolution;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_Resolution() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_Resolution.prototype = $c_Ljapgolly_scalajs_react_extra_router_Resolution.prototype;
$c_Ljapgolly_scalajs_react_extra_router_Resolution.prototype.productPrefix__T = (function() {
  return "Resolution"
});
$c_Ljapgolly_scalajs_react_extra_router_Resolution.prototype.productArity__I = (function() {
  return 2
});
$c_Ljapgolly_scalajs_react_extra_router_Resolution.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_extra_router_Resolution(x$1)) {
    var Resolution$1 = $as_Ljapgolly_scalajs_react_extra_router_Resolution(x$1);
    if ($m_sr_BoxesRunTime$().equals__O__O__Z(this.page$1, Resolution$1.page$1)) {
      var x = this.render$1;
      var x$2 = Resolution$1.render$1;
      return (x === x$2)
    } else {
      return false
    }
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_extra_router_Resolution.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.page$1;
      break
    }
    case 1: {
      return this.render$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_Resolution.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_extra_router_Resolution.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_extra_router_Resolution.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Ljapgolly_scalajs_react_extra_router_Resolution.prototype.init___O__F0 = (function(page, render) {
  this.page$1 = page;
  this.render$1 = render;
  return this
});
function $is_Ljapgolly_scalajs_react_extra_router_Resolution(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_Resolution)))
}
function $as_Ljapgolly_scalajs_react_extra_router_Resolution(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_Resolution(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.Resolution"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_Resolution(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_Resolution)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_Resolution(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_Resolution(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.Resolution;", depth))
}
var $d_Ljapgolly_scalajs_react_extra_router_Resolution = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_Resolution: 0
}, false, "japgolly.scalajs.react.extra.router.Resolution", {
  Ljapgolly_scalajs_react_extra_router_Resolution: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_Resolution.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_Resolution;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouterConfig() {
  $c_O.call(this);
  this.parse$1 = null;
  this.path$1 = null;
  this.action$1 = null;
  this.renderFn$1 = null;
  this.postRenderFn$1 = null;
  this.logger$1 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouterConfig.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_RouterConfig.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouterConfig;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouterConfig() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouterConfig.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouterConfig.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouterConfig.prototype.productPrefix__T = (function() {
  return "RouterConfig"
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfig.prototype.productArity__I = (function() {
  return 6
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfig.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_extra_router_RouterConfig(x$1)) {
    var RouterConfig$1 = $as_Ljapgolly_scalajs_react_extra_router_RouterConfig(x$1);
    var x = this.parse$1;
    var x$2 = RouterConfig$1.parse$1;
    if (((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))) {
      var x$3 = this.path$1;
      var x$4 = RouterConfig$1.path$1;
      var jsx$4 = ((x$3 === null) ? (x$4 === null) : x$3.equals__O__Z(x$4))
    } else {
      var jsx$4 = false
    };
    if (jsx$4) {
      var x$5 = this.action$1;
      var x$6 = RouterConfig$1.action$1;
      var jsx$3 = ((x$5 === null) ? (x$6 === null) : x$5.equals__O__Z(x$6))
    } else {
      var jsx$3 = false
    };
    if (jsx$3) {
      var x$7 = this.renderFn$1;
      var x$8 = RouterConfig$1.renderFn$1;
      var jsx$2 = (x$7 === x$8)
    } else {
      var jsx$2 = false
    };
    if (jsx$2) {
      var x$9 = this.postRenderFn$1;
      var x$10 = RouterConfig$1.postRenderFn$1;
      var jsx$1 = (x$9 === x$10)
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      var x$11 = this.logger$1;
      var x$12 = RouterConfig$1.logger$1;
      return ((x$11 === null) ? (x$12 === null) : x$11.equals__O__Z(x$12))
    } else {
      return false
    }
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfig.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.parse$1;
      break
    }
    case 1: {
      return this.path$1;
      break
    }
    case 2: {
      return this.action$1;
      break
    }
    case 3: {
      return this.renderFn$1;
      break
    }
    case 4: {
      return this.postRenderFn$1;
      break
    }
    case 5: {
      return this.logger$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfig.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfig.prototype.init___F1__F1__F1__F2__F2__F1 = (function(parse, path, action, renderFn, postRenderFn, logger) {
  this.parse$1 = parse;
  this.path$1 = path;
  this.action$1 = action;
  this.renderFn$1 = renderFn;
  this.postRenderFn$1 = postRenderFn;
  this.logger$1 = logger;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfig.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfig.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Ljapgolly_scalajs_react_extra_router_RouterConfig(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_RouterConfig)))
}
function $as_Ljapgolly_scalajs_react_extra_router_RouterConfig(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_RouterConfig(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.RouterConfig"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_RouterConfig(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_RouterConfig)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_RouterConfig(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_RouterConfig(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.RouterConfig;", depth))
}
var $d_Ljapgolly_scalajs_react_extra_router_RouterConfig = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouterConfig: 0
}, false, "japgolly.scalajs.react.extra.router.RouterConfig", {
  Ljapgolly_scalajs_react_extra_router_RouterConfig: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfig.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouterConfig;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$$undauto$undrouteParser$undfrom$undparsedFO$1() {
  $c_sr_AbstractFunction1.call(this);
  this.f$6$2 = null;
  this.evidence$13$1$f = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$$undauto$undrouteParser$undfrom$undparsedFO$1.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$$undauto$undrouteParser$undfrom$undparsedFO$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$$undauto$undrouteParser$undfrom$undparsedFO$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$$undauto$undrouteParser$undfrom$undparsedFO$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$$undauto$undrouteParser$undfrom$undparsedFO$1.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$$undauto$undrouteParser$undfrom$undparsedFO$1.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$$undauto$undrouteParser$undfrom$undparsedFO$1.prototype.apply__O__O = (function(v1) {
  return this.apply__Ljapgolly_scalajs_react_extra_router_Path__s_Option($as_Ljapgolly_scalajs_react_extra_router_Path(v1))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$$undauto$undrouteParser$undfrom$undparsedFO$1.prototype.init___Ljapgolly_scalajs_react_extra_router_RouterConfigDsl__F1__F1 = (function($$outer, f$6, evidence$13$1) {
  this.f$6$2 = f$6;
  this.evidence$13$1$f = evidence$13$1;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$$undauto$undrouteParser$undfrom$undparsedFO$1.prototype.apply__Ljapgolly_scalajs_react_extra_router_Path__s_Option = (function(x$60) {
  var this$1 = $as_s_Option(this.f$6$2.apply__O__O(x$60));
  if (this$1.isEmpty__Z()) {
    return $m_s_None$()
  } else {
    var arg1 = this$1.get__O();
    return new $c_s_Some().init___O($as_s_util_Either(this.evidence$13$1$f.apply__O__O(arg1)))
  }
});
var $d_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$$undauto$undrouteParser$undfrom$undparsedFO$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$$undauto$undrouteParser$undfrom$undparsedFO$1: 0
}, false, "japgolly.scalajs.react.extra.router.RouterConfigDsl$$anonfun$_auto_routeParser_from_parsedFO$1", {
  Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$$undauto$undrouteParser$undfrom$undparsedFO$1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$$undauto$undrouteParser$undfrom$undparsedFO$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$$undauto$undrouteParser$undfrom$undparsedFO$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1() {
  $c_sr_AbstractFunction1.call(this);
  this.$$outer$2 = null;
  this.r$1$f = null;
  this.op$1$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1.prototype.apply__O__O = (function(v1) {
  return this.apply__F1__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule($as_F1(v1))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1.prototype.apply__F1__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule = (function(a) {
  var parse = new $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1$$anonfun$apply$21().init___Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1(this);
  var path = this.$$outer$2.japgolly$scalajs$react$extra$router$RouterConfigDsl$$onPage$1__F1__F1__F1(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer) {
    return (function(a$2) {
      return arg$outer.r$1$f.pathFor__O__Ljapgolly_scalajs_react_extra_router_Path(a$2)
    })
  })(this)), this.op$1$2);
  var action = this.$$outer$2.japgolly$scalajs$react$extra$router$RouterConfigDsl$$onPage$1__F1__F1__F1(a, this.op$1$2);
  return new $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule().init___F1__F1__F1(parse, path, action)
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1.prototype.init___Ljapgolly_scalajs_react_extra_router_RouterConfigDsl__Ljapgolly_scalajs_react_extra_router_StaticDsl$Route__F1 = (function($$outer, r$1, op$1) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.r$1$f = r$1;
  this.op$1$2 = op$1;
  return this
});
var $d_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1: 0
}, false, "japgolly.scalajs.react.extra.router.RouterConfigDsl$$anonfun$dynamicRouteF$1", {
  Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1$$anonfun$apply$21() {
  $c_sr_AbstractFunction1.call(this);
  this.$$outer$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1$$anonfun$apply$21.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1$$anonfun$apply$21.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1$$anonfun$apply$21;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1$$anonfun$apply$21() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1$$anonfun$apply$21.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1$$anonfun$apply$21.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1$$anonfun$apply$21.prototype.apply__O__O = (function(v1) {
  return this.apply__Ljapgolly_scalajs_react_extra_router_Path__s_Option($as_Ljapgolly_scalajs_react_extra_router_Path(v1))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1$$anonfun$apply$21.prototype.apply__Ljapgolly_scalajs_react_extra_router_Path__s_Option = (function(path) {
  var o = this.$$outer$2.r$1$f.parse__Ljapgolly_scalajs_react_extra_router_Path__s_Option(path);
  if (o.isEmpty__Z()) {
    return $m_s_None$()
  } else {
    var arg1 = o.get__O();
    $m_s_package$();
    return new $c_s_Some().init___O(new $c_s_util_Right().init___O(arg1))
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1$$anonfun$apply$21.prototype.init___Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1 = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  return this
});
var $d_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1$$anonfun$apply$21 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1$$anonfun$apply$21: 0
}, false, "japgolly.scalajs.react.extra.router.RouterConfigDsl$$anonfun$dynamicRouteF$1$$anonfun$apply$21", {
  Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1$$anonfun$apply$21: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1$$anonfun$apply$21.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$dynamicRouteF$1$$anonfun$apply$21;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2() {
  $c_sr_AbstractFunction1.call(this);
  this.$$outer$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2.prototype.apply__O__O = (function(v1) {
  return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(this.apply__Ljapgolly_scalajs_react_extra_router_AbsUrl__F0($as_Ljapgolly_scalajs_react_extra_router_AbsUrl(v1)))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2.prototype.init___Ljapgolly_scalajs_react_extra_router_RouterLogic = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2.prototype.apply__Ljapgolly_scalajs_react_extra_router_AbsUrl__F0 = (function(url) {
  return $m_Ljapgolly_scalajs_react_CallbackTo$().flatMap$extension__F0__F1__F0($as_Ljapgolly_scalajs_react_CallbackTo(this.$$outer$2.japgolly$scalajs$react$extra$router$RouterLogic$$cfg$f.logger$1.apply__O__O(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(url$3) {
    return (function() {
      return new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Syncing to [", "]."])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([url$3.value$2]))
    })
  })(url)))).japgolly$scalajs$react$CallbackTo$$f$1, new $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2().init___Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2__Ljapgolly_scalajs_react_extra_router_AbsUrl(this, url))
});
var $d_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2: 0
}, false, "japgolly.scalajs.react.extra.router.RouterLogic$$anonfun$2", {
  Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2() {
  $c_sr_AbstractFunction1.call(this);
  this.$$outer$2 = null;
  this.url$3$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2.prototype.apply__O__O = (function(v1) {
  return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(this.apply__sr_BoxedUnit__F0($asUnit(v1)))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2.prototype.apply__sr_BoxedUnit__F0 = (function(_) {
  return $m_Ljapgolly_scalajs_react_CallbackTo$().flatMap$extension__F0__F1__F0(this.$$outer$2.$$outer$2.interpret__Ljapgolly_scalajs_react_extra_router_RouteCmd__F0(this.$$outer$2.$$outer$2.syncToUrl__Ljapgolly_scalajs_react_extra_router_AbsUrl__Ljapgolly_scalajs_react_extra_router_RouteCmd(this.url$3$2)), new $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3().init___Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2(this))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2.prototype.init___Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2__Ljapgolly_scalajs_react_extra_router_AbsUrl = (function($$outer, url$3) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.url$3$2 = url$3;
  return this
});
var $d_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2: 0
}, false, "japgolly.scalajs.react.extra.router.RouterLogic$$anonfun$2$$anonfun$apply$2", {
  Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3() {
  $c_sr_AbstractFunction1.call(this);
  this.$$outer$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3.prototype.apply__Ljapgolly_scalajs_react_extra_router_Resolution__F0 = (function(res) {
  return $m_Ljapgolly_scalajs_react_CallbackTo$().flatMap$extension__F0__F1__F0($as_Ljapgolly_scalajs_react_CallbackTo(this.$$outer$2.$$outer$2.$$outer$2.japgolly$scalajs$react$extra$router$RouterLogic$$cfg$f.logger$1.apply__O__O(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(res$1) {
    return (function() {
      return new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Resolved to page: [", "]."])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([res$1.page$1]))
    })
  })(res)))).japgolly$scalajs$react$CallbackTo$$f$1, new $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3$$anonfun$apply$5().init___Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3__Ljapgolly_scalajs_react_extra_router_Resolution(this, res))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3.prototype.apply__O__O = (function(v1) {
  return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(this.apply__Ljapgolly_scalajs_react_extra_router_Resolution__F0($as_Ljapgolly_scalajs_react_extra_router_Resolution(v1)))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3.prototype.init___Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2 = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  return this
});
var $d_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3: 0
}, false, "japgolly.scalajs.react.extra.router.RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3", {
  Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3$$anonfun$apply$5() {
  $c_sr_AbstractFunction1.call(this);
  this.$$outer$2 = null;
  this.res$1$f = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3$$anonfun$apply$5.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3$$anonfun$apply$5.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3$$anonfun$apply$5;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3$$anonfun$apply$5() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3$$anonfun$apply$5.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3$$anonfun$apply$5.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3$$anonfun$apply$5.prototype.apply__O__O = (function(v1) {
  return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(this.apply__sr_BoxedUnit__F0($asUnit(v1)))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3$$anonfun$apply$5.prototype.apply__sr_BoxedUnit__F0 = (function(_) {
  return $m_Ljapgolly_scalajs_react_CallbackTo$().map$extension__F0__F1__F0($as_Ljapgolly_scalajs_react_CallbackTo(this.$$outer$2.$$outer$2.$$outer$2.$$outer$2.japgolly$scalajs$react$extra$router$RouterLogic$$cfg$f.logger$1.apply__O__O(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function() {
    return ""
  })))).japgolly$scalajs$react$CallbackTo$$f$1, new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer) {
    return (function(_$2) {
      $asUnit(_$2);
      return arg$outer.res$1$f
    })
  })(this)))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3$$anonfun$apply$5.prototype.init___Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3__Ljapgolly_scalajs_react_extra_router_Resolution = (function($$outer, res$1) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.res$1$f = res$1;
  return this
});
var $d_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3$$anonfun$apply$5 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3$$anonfun$apply$5: 0
}, false, "japgolly.scalajs.react.extra.router.RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3$$anonfun$apply$5", {
  Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3$$anonfun$apply$5: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3$$anonfun$apply$5.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$2$$anonfun$apply$2$$anonfun$apply$3$$anonfun$apply$5;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$resolve$1() {
  $c_sr_AbstractFunction1.call(this);
  this.$$outer$2 = null;
  this.page$1$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$resolve$1.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$resolve$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$resolve$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$resolve$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$resolve$1.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$resolve$1.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$resolve$1.prototype.apply__O__O = (function(v1) {
  return this.apply__Ljapgolly_scalajs_react_extra_router_Renderer__Ljapgolly_scalajs_react_extra_router_Resolution($as_Ljapgolly_scalajs_react_extra_router_Renderer(v1))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$resolve$1.prototype.apply__Ljapgolly_scalajs_react_extra_router_Renderer__Ljapgolly_scalajs_react_extra_router_Resolution = (function(r) {
  return new $c_Ljapgolly_scalajs_react_extra_router_Resolution().init___O__F0(this.page$1$2, new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(arg$outer, r$1) {
    return (function() {
      var ctl = arg$outer.$$outer$2.ctl$1;
      return r$1.f$1.apply__O__O(ctl)
    })
  })(this, r)))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$resolve$1.prototype.init___Ljapgolly_scalajs_react_extra_router_RouterLogic__O = (function($$outer, page$1) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.page$1$2 = page$1;
  return this
});
var $d_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$resolve$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$resolve$1: 0
}, false, "japgolly.scalajs.react.extra.router.RouterLogic$$anonfun$resolve$1", {
  Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$resolve$1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$resolve$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouterLogic$$anonfun$resolve$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$$anonfun$route$1() {
  $c_sr_AbstractFunction1.call(this);
  this.$$outer$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$$anonfun$route$1.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$$anonfun$route$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$$anonfun$route$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$$anonfun$route$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$$anonfun$route$1.prototype = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$$anonfun$route$1.prototype;
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$$anonfun$route$1.prototype.apply__O__O = (function(v1) {
  return this.apply__ju_regex_Matcher__s_Option($as_ju_regex_Matcher(v1))
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$$anonfun$route$1.prototype.apply__ju_regex_Matcher__s_Option = (function(m) {
  return $as_s_Option(this.$$outer$2.parse$2.apply__O__O(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(m$1) {
    return (function(i$2) {
      var i = $uI(i$2);
      return m$1.group__I__T(((1 + i) | 0))
    })
  })(m))))
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$$anonfun$route$1.prototype.init___Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  return this
});
var $d_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$$anonfun$route$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$$anonfun$route$1: 0
}, false, "japgolly.scalajs.react.extra.router.StaticDsl$RouteB$$anonfun$route$1", {
  Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$$anonfun$route$1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$$anonfun$route$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$$anonfun$route$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule() {
  $c_O.call(this);
  this.parse$1 = null;
  this.path$1 = null;
  this.action$1 = null
}
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule.prototype = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule.prototype;
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule.prototype.productPrefix__T = (function() {
  return "Rule"
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule.prototype.productArity__I = (function() {
  return 3
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule(x$1)) {
    var Rule$1 = $as_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule(x$1);
    var x = this.parse$1;
    var x$2 = Rule$1.parse$1;
    if (((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))) {
      var x$3 = this.path$1;
      var x$4 = Rule$1.path$1;
      var jsx$1 = ((x$3 === null) ? (x$4 === null) : x$3.equals__O__Z(x$4))
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      var x$5 = this.action$1;
      var x$6 = Rule$1.action$1;
      return ((x$5 === null) ? (x$6 === null) : x$5.equals__O__Z(x$6))
    } else {
      return false
    }
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule.prototype.init___F1__F1__F1 = (function(parse, path, action) {
  this.parse$1 = parse;
  this.path$1 = path;
  this.action$1 = action;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.parse$1;
      break
    }
    case 1: {
      return this.path$1;
      break
    }
    case 2: {
      return this.action$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule.prototype.noFallback__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules = (function() {
  return this.fallback__F1__F1__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules(this.force$1__p1__T__F1("path"), this.force$1__p1__T__F1("action"))
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule.prototype.force$1__p1__T__F1 = (function(desc) {
  return new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(desc$1) {
    return (function(p$2) {
      $m_s_sys_package$().error__T__sr_Nothing$(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Unspecified ", " for page [", "]."])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([desc$1, p$2])))
    })
  })(desc))
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule.prototype.$$bar__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule = (function(that) {
  var $$this = this.parse$1;
  var g = that.parse$1;
  var jsx$2 = new $c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1().init___F1__F1($$this, g);
  var $$this$1 = this.path$1;
  var g$1 = that.path$1;
  var jsx$1 = new $c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1().init___F1__F1($$this$1, g$1);
  var $$this$2 = this.action$1;
  var g$2 = that.action$1;
  return new $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule().init___F1__F1__F1(jsx$2, jsx$1, new $c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1().init___F1__F1($$this$2, g$2))
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule.prototype.fallback__F1__F1__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules = (function(fp, fa) {
  var jsx$2 = this.parse$1;
  var $$this = this.path$1;
  var jsx$1 = new $c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$extension$1().init___F1__F1($$this, fp);
  var $$this$1 = this.action$1;
  return new $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules().init___F1__F1__F1(jsx$2, jsx$1, new $c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$extension$1().init___F1__F1($$this$1, fa))
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule)))
}
function $as_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.StaticDsl$Rule"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.StaticDsl$Rule;", depth))
}
var $d_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule: 0
}, false, "japgolly.scalajs.react.extra.router.StaticDsl$Rule", {
  Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules() {
  $c_O.call(this);
  this.parse$1 = null;
  this.path$1 = null;
  this.action$1 = null
}
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules.prototype = $c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules.prototype;
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules.prototype.productPrefix__T = (function() {
  return "Rules"
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules.prototype.productArity__I = (function() {
  return 3
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules(x$1)) {
    var Rules$1 = $as_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules(x$1);
    var x = this.parse$1;
    var x$2 = Rules$1.parse$1;
    if (((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))) {
      var x$3 = this.path$1;
      var x$4 = Rules$1.path$1;
      var jsx$1 = ((x$3 === null) ? (x$4 === null) : x$3.equals__O__Z(x$4))
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      var x$5 = this.action$1;
      var x$6 = Rules$1.action$1;
      return ((x$5 === null) ? (x$6 === null) : x$5.equals__O__Z(x$6))
    } else {
      return false
    }
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules.prototype.init___F1__F1__F1 = (function(parse, path, action) {
  this.parse$1 = parse;
  this.path$1 = path;
  this.action$1 = action;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.parse$1;
      break
    }
    case 1: {
      return this.path$1;
      break
    }
    case 2: {
      return this.action$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules.prototype.notFound__F1__Ljapgolly_scalajs_react_extra_router_RouterConfig = (function(f) {
  var this$3 = $m_Ljapgolly_scalajs_react_extra_router_RouterConfig$();
  var $$this = this.parse$1;
  var parse = new $c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$extension$1().init___F1__F1($$this, f);
  var path = this.path$1;
  var action = this.action$1;
  return new $c_Ljapgolly_scalajs_react_extra_router_RouterConfig().init___F1__F1__F1__F2__F2__F1(parse, path, action, this$3.defaultRenderFn__F2(), this$3.defaultPostRenderFn__F2(), this$3.nopLogger$1)
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules)))
}
function $as_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.StaticDsl$Rules"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.StaticDsl$Rules;", depth))
}
var $d_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules: 0
}, false, "japgolly.scalajs.react.extra.router.StaticDsl$Rules", {
  Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1() {
  $c_sr_AbstractFunction1.call(this);
  this.$$this$1$2 = null;
  this.g$1$f = null
}
$c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1.prototype = $c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1.prototype;
$c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1.prototype.apply__O__O = (function(v1) {
  return this.apply__O__s_Option(v1)
});
$c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1.prototype.apply__O__s_Option = (function(a) {
  var this$1 = $as_s_Option(this.$$this$1$2.apply__O__O(a));
  return (this$1.isEmpty__Z() ? $as_s_Option(this.g$1$f.apply__O__O(a)) : this$1)
});
$c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1.prototype.init___F1__F1 = (function($$this$1, g$1) {
  this.$$this$1$2 = $$this$1;
  this.g$1$f = g$1;
  return this
});
var $d_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1: 0
}, false, "japgolly.scalajs.react.extra.router.package$OptionFnExt$$anonfun$$bar$bar$extension$1", {
  Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$bar$extension$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$extension$1() {
  $c_sr_AbstractFunction1.call(this);
  this.$$this$2$2 = null;
  this.g$2$f = null
}
$c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$extension$1.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$extension$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$extension$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$extension$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$extension$1.prototype = $c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$extension$1.prototype;
$c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$extension$1.prototype.apply__O__O = (function(a) {
  var this$1 = $as_s_Option(this.$$this$2$2.apply__O__O(a));
  return (this$1.isEmpty__Z() ? this.g$2$f.apply__O__O(a) : this$1.get__O())
});
$c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$extension$1.prototype.init___F1__F1 = (function($$this$2, g$2) {
  this.$$this$2$2 = $$this$2;
  this.g$2$f = g$2;
  return this
});
var $d_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$extension$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$extension$1: 0
}, false, "japgolly.scalajs.react.extra.router.package$OptionFnExt$$anonfun$$bar$extension$1", {
  Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$extension$1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$extension$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_package$OptionFnExt$$anonfun$$bar$extension$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_package$Tags$() {
  $c_O.call(this);
  this.big$1 = null;
  this.dialog$1 = null;
  this.menuitem$1 = null;
  this.html$1 = null;
  this.head$1 = null;
  this.base$1 = null;
  this.link$1 = null;
  this.meta$1 = null;
  this.script$1 = null;
  this.body$1 = null;
  this.h1$1 = null;
  this.h2$1 = null;
  this.h3$1 = null;
  this.h4$1 = null;
  this.h5$1 = null;
  this.h6$1 = null;
  this.header$1 = null;
  this.footer$1 = null;
  this.p$1 = null;
  this.hr$1 = null;
  this.pre$1 = null;
  this.blockquote$1 = null;
  this.ol$1 = null;
  this.ul$1 = null;
  this.li$1 = null;
  this.dl$1 = null;
  this.dt$1 = null;
  this.dd$1 = null;
  this.figure$1 = null;
  this.figcaption$1 = null;
  this.div$1 = null;
  this.a$1 = null;
  this.em$1 = null;
  this.strong$1 = null;
  this.small$1 = null;
  this.s$1 = null;
  this.cite$1 = null;
  this.code$1 = null;
  this.sub$1 = null;
  this.sup$1 = null;
  this.i$1 = null;
  this.b$1 = null;
  this.u$1 = null;
  this.span$1 = null;
  this.br$1 = null;
  this.wbr$1 = null;
  this.ins$1 = null;
  this.del$1 = null;
  this.img$1 = null;
  this.iframe$1 = null;
  this.embed$1 = null;
  this.object$1 = null;
  this.param$1 = null;
  this.video$1 = null;
  this.audio$1 = null;
  this.source$1 = null;
  this.track$1 = null;
  this.canvas$1 = null;
  this.map$1 = null;
  this.area$1 = null;
  this.table$1 = null;
  this.caption$1 = null;
  this.colgroup$1 = null;
  this.col$1 = null;
  this.tbody$1 = null;
  this.thead$1 = null;
  this.tfoot$1 = null;
  this.tr$1 = null;
  this.td$1 = null;
  this.th$1 = null;
  this.form$1 = null;
  this.fieldset$1 = null;
  this.legend$1 = null;
  this.label$1 = null;
  this.input$1 = null;
  this.button$1 = null;
  this.select$1 = null;
  this.datalist$1 = null;
  this.optgroup$1 = null;
  this.option$1 = null;
  this.textarea$1 = null;
  this.titleTag$1 = null;
  this.styleTag$1 = null;
  this.noscript$1 = null;
  this.section$1 = null;
  this.nav$1 = null;
  this.article$1 = null;
  this.aside$1 = null;
  this.address$1 = null;
  this.main$1 = null;
  this.q$1 = null;
  this.dfn$1 = null;
  this.abbr$1 = null;
  this.data$1 = null;
  this.time$1 = null;
  this.var$1 = null;
  this.samp$1 = null;
  this.kbd$1 = null;
  this.math$1 = null;
  this.mark$1 = null;
  this.ruby$1 = null;
  this.rt$1 = null;
  this.rp$1 = null;
  this.bdi$1 = null;
  this.bdo$1 = null;
  this.keygen$1 = null;
  this.output$1 = null;
  this.progress$1 = null;
  this.meter$1 = null;
  this.details$1 = null;
  this.summary$1 = null;
  this.command$1 = null;
  this.menu$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_package$Tags$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_package$Tags$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_package$Tags$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_package$Tags$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_package$Tags$.prototype = $c_Ljapgolly_scalajs_react_vdom_package$Tags$.prototype;
$c_Ljapgolly_scalajs_react_vdom_package$Tags$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_vdom_package$Tags$ = this;
  $s_Ljapgolly_scalajs_react_vdom_HtmlTags$class__$$init$__Ljapgolly_scalajs_react_vdom_HtmlTags__V(this);
  $s_Ljapgolly_scalajs_react_vdom_Extra$Tags$class__$$init$__Ljapgolly_scalajs_react_vdom_Extra$Tags__V(this);
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_package$Tags$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_package$Tags$: 0
}, false, "japgolly.scalajs.react.vdom.package$Tags$", {
  Ljapgolly_scalajs_react_vdom_package$Tags$: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_package$JustTags: 1,
  Ljapgolly_scalajs_react_vdom_package$Tags: 1,
  Ljapgolly_scalajs_react_vdom_HtmlTags: 1,
  Ljapgolly_scalajs_react_vdom_Extra$Tags: 1
});
$c_Ljapgolly_scalajs_react_vdom_package$Tags$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_package$Tags$;
var $n_Ljapgolly_scalajs_react_vdom_package$Tags$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_package$Tags$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_package$Tags$)) {
    $n_Ljapgolly_scalajs_react_vdom_package$Tags$ = new $c_Ljapgolly_scalajs_react_vdom_package$Tags$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_package$Tags$
}
/** @constructor */
function $c_Lscalajsreact_template_models_Menu() {
  $c_O.call(this);
  this.name$1 = null;
  this.route$1 = null
}
$c_Lscalajsreact_template_models_Menu.prototype = new $h_O();
$c_Lscalajsreact_template_models_Menu.prototype.constructor = $c_Lscalajsreact_template_models_Menu;
/** @constructor */
function $h_Lscalajsreact_template_models_Menu() {
  /*<skip>*/
}
$h_Lscalajsreact_template_models_Menu.prototype = $c_Lscalajsreact_template_models_Menu.prototype;
$c_Lscalajsreact_template_models_Menu.prototype.productPrefix__T = (function() {
  return "Menu"
});
$c_Lscalajsreact_template_models_Menu.prototype.productArity__I = (function() {
  return 2
});
$c_Lscalajsreact_template_models_Menu.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lscalajsreact_template_models_Menu(x$1)) {
    var Menu$1 = $as_Lscalajsreact_template_models_Menu(x$1);
    if ((this.name$1 === Menu$1.name$1)) {
      var x = this.route$1;
      var x$2 = Menu$1.route$1;
      return (x === x$2)
    } else {
      return false
    }
  } else {
    return false
  }
});
$c_Lscalajsreact_template_models_Menu.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.name$1;
      break
    }
    case 1: {
      return this.route$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lscalajsreact_template_models_Menu.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lscalajsreact_template_models_Menu.prototype.init___T__Lscalajsreact_template_routes_AppRouter$AppPage = (function(name, route) {
  this.name$1 = name;
  this.route$1 = route;
  return this
});
$c_Lscalajsreact_template_models_Menu.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Lscalajsreact_template_models_Menu.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lscalajsreact_template_models_Menu(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lscalajsreact_template_models_Menu)))
}
function $as_Lscalajsreact_template_models_Menu(obj) {
  return (($is_Lscalajsreact_template_models_Menu(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scalajsreact.template.models.Menu"))
}
function $isArrayOf_Lscalajsreact_template_models_Menu(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lscalajsreact_template_models_Menu)))
}
function $asArrayOf_Lscalajsreact_template_models_Menu(obj, depth) {
  return (($isArrayOf_Lscalajsreact_template_models_Menu(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscalajsreact.template.models.Menu;", depth))
}
var $d_Lscalajsreact_template_models_Menu = new $TypeData().initClass({
  Lscalajsreact_template_models_Menu: 0
}, false, "scalajsreact.template.models.Menu", {
  Lscalajsreact_template_models_Menu: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lscalajsreact_template_models_Menu.prototype.$classData = $d_Lscalajsreact_template_models_Menu;
/** @constructor */
function $c_Lscalajsreact_template_routes_AppRouter$$anonfun$1() {
  $c_sr_AbstractFunction1.call(this)
}
$c_Lscalajsreact_template_routes_AppRouter$$anonfun$1.prototype = new $h_sr_AbstractFunction1();
$c_Lscalajsreact_template_routes_AppRouter$$anonfun$1.prototype.constructor = $c_Lscalajsreact_template_routes_AppRouter$$anonfun$1;
/** @constructor */
function $h_Lscalajsreact_template_routes_AppRouter$$anonfun$1() {
  /*<skip>*/
}
$h_Lscalajsreact_template_routes_AppRouter$$anonfun$1.prototype = $c_Lscalajsreact_template_routes_AppRouter$$anonfun$1.prototype;
$c_Lscalajsreact_template_routes_AppRouter$$anonfun$1.prototype.apply__O__O = (function(v1) {
  return this.apply__Ljapgolly_scalajs_react_extra_router_RouterConfigDsl__Ljapgolly_scalajs_react_extra_router_RouterConfig($as_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl(v1))
});
$c_Lscalajsreact_template_routes_AppRouter$$anonfun$1.prototype.apply__Ljapgolly_scalajs_react_extra_router_RouterConfigDsl__Ljapgolly_scalajs_react_extra_router_RouterConfig = (function(dsl) {
  var jsx$1 = dsl.trimSlashes__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule();
  var r = new $c_Ljapgolly_scalajs_react_extra_router_Path().init___T("");
  var $$this = dsl.staticRoute__Ljapgolly_scalajs_react_extra_router_StaticDsl$Route__O__F1($m_Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB$().literal__T__Ljapgolly_scalajs_react_extra_router_StaticDsl$RouteB(r.value$2).route__Ljapgolly_scalajs_react_extra_router_StaticDsl$Route(), $m_Lscalajsreact_template_routes_AppRouter$Home$());
  var a = new $c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2().init___Lscalajsreact_template_routes_AppRouter$$anonfun$1__Ljapgolly_scalajs_react_extra_router_RouterConfigDsl(this, dsl);
  var r$1 = jsx$1.$$bar__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule($as_Ljapgolly_scalajs_react_extra_router_StaticDsl$Rule($$this.apply__O__O(a)));
  var jsx$2 = r$1.noFallback__Ljapgolly_scalajs_react_extra_router_StaticDsl$Rules();
  var page = $m_Lscalajsreact_template_routes_AppRouter$Home$();
  var method = $m_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$();
  return jsx$2.notFound__F1__Ljapgolly_scalajs_react_extra_router_RouterConfig(dsl.$$undauto$undnotFound$undfrom$undparsed__O__F1__F1(new $c_Ljapgolly_scalajs_react_extra_router_RedirectToPage().init___O__Ljapgolly_scalajs_react_extra_router_Redirect$Method(page, method), new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(dsl$1) {
    return (function(r$2) {
      var r$3 = $as_Ljapgolly_scalajs_react_extra_router_Redirect(r$2);
      $m_s_package$();
      return new $c_s_util_Left().init___O(r$3)
    })
  })(dsl))))
});
var $d_Lscalajsreact_template_routes_AppRouter$$anonfun$1 = new $TypeData().initClass({
  Lscalajsreact_template_routes_AppRouter$$anonfun$1: 0
}, false, "scalajsreact.template.routes.AppRouter$$anonfun$1", {
  Lscalajsreact_template_routes_AppRouter$$anonfun$1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lscalajsreact_template_routes_AppRouter$$anonfun$1.prototype.$classData = $d_Lscalajsreact_template_routes_AppRouter$$anonfun$1;
/** @constructor */
function $c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2() {
  $c_sr_AbstractFunction0.call(this);
  this.dsl$1$2 = null
}
$c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2.prototype = new $h_sr_AbstractFunction0();
$c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2.prototype.constructor = $c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2;
/** @constructor */
function $h_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2() {
  /*<skip>*/
}
$h_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2.prototype = $c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2.prototype;
$c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2.prototype.init___Lscalajsreact_template_routes_AppRouter$$anonfun$1__Ljapgolly_scalajs_react_extra_router_RouterConfigDsl = (function($$outer, dsl$1) {
  this.dsl$1$2 = dsl$1;
  return this
});
$c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2.prototype.apply__Ljapgolly_scalajs_react_extra_router_Renderer = (function() {
  return this.dsl$1$2.render__F0__F1__Ljapgolly_scalajs_react_extra_router_Renderer(new $c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2$$anonfun$apply$3().init___Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2(this), new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(t$2) {
    var t = $as_Ljapgolly_scalajs_react_vdom_ReactTagOf(t$2);
    $m_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$();
    return t.render__Ljapgolly_scalajs_react_ReactElement()
  })))
});
$c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2.prototype.apply__O = (function() {
  return this.apply__Ljapgolly_scalajs_react_extra_router_Renderer()
});
var $d_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2 = new $TypeData().initClass({
  Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2: 0
}, false, "scalajsreact.template.routes.AppRouter$$anonfun$1$$anonfun$apply$2", {
  Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2: 1,
  sr_AbstractFunction0: 1,
  O: 1,
  F0: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2.prototype.$classData = $d_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2;
/** @constructor */
function $c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2$$anonfun$apply$3() {
  $c_sr_AbstractFunction0.call(this)
}
$c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2$$anonfun$apply$3.prototype = new $h_sr_AbstractFunction0();
$c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2$$anonfun$apply$3.prototype.constructor = $c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2$$anonfun$apply$3;
/** @constructor */
function $h_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2$$anonfun$apply$3() {
  /*<skip>*/
}
$h_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2$$anonfun$apply$3.prototype = $c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2$$anonfun$apply$3.prototype;
$c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2$$anonfun$apply$3.prototype.apply__Ljapgolly_scalajs_react_vdom_ReactTagOf = (function() {
  return ($m_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$(), $m_Ljapgolly_scalajs_react_vdom_package$Tags$()).div$1.apply__sc_Seq__Ljapgolly_scalajs_react_vdom_ReactTagOf(new $c_sjs_js_WrappedArray().init___sjs_js_Array([($m_Ljapgolly_scalajs_react_vdom_package$prefix$und$less$up$(), new $c_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag().init___Ljapgolly_scalajs_react_ReactNode("TODO"))]))
});
$c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2$$anonfun$apply$3.prototype.init___Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2 = (function($$outer) {
  return this
});
$c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2$$anonfun$apply$3.prototype.apply__O = (function() {
  return this.apply__Ljapgolly_scalajs_react_vdom_ReactTagOf()
});
var $d_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2$$anonfun$apply$3 = new $TypeData().initClass({
  Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2$$anonfun$apply$3: 0
}, false, "scalajsreact.template.routes.AppRouter$$anonfun$1$$anonfun$apply$2$$anonfun$apply$3", {
  Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2$$anonfun$apply$3: 1,
  sr_AbstractFunction0: 1,
  O: 1,
  F0: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2$$anonfun$apply$3.prototype.$classData = $d_Lscalajsreact_template_routes_AppRouter$$anonfun$1$$anonfun$apply$2$$anonfun$apply$3;
/** @constructor */
function $c_jl_ArithmeticException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_ArithmeticException.prototype = new $h_jl_RuntimeException();
$c_jl_ArithmeticException.prototype.constructor = $c_jl_ArithmeticException;
/** @constructor */
function $h_jl_ArithmeticException() {
  /*<skip>*/
}
$h_jl_ArithmeticException.prototype = $c_jl_ArithmeticException.prototype;
var $d_jl_ArithmeticException = new $TypeData().initClass({
  jl_ArithmeticException: 0
}, false, "java.lang.ArithmeticException", {
  jl_ArithmeticException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_ArithmeticException.prototype.$classData = $d_jl_ArithmeticException;
/** @constructor */
function $c_jl_ClassCastException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_ClassCastException.prototype = new $h_jl_RuntimeException();
$c_jl_ClassCastException.prototype.constructor = $c_jl_ClassCastException;
/** @constructor */
function $h_jl_ClassCastException() {
  /*<skip>*/
}
$h_jl_ClassCastException.prototype = $c_jl_ClassCastException.prototype;
function $is_jl_ClassCastException(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_ClassCastException)))
}
function $as_jl_ClassCastException(obj) {
  return (($is_jl_ClassCastException(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.ClassCastException"))
}
function $isArrayOf_jl_ClassCastException(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_ClassCastException)))
}
function $asArrayOf_jl_ClassCastException(obj, depth) {
  return (($isArrayOf_jl_ClassCastException(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.ClassCastException;", depth))
}
var $d_jl_ClassCastException = new $TypeData().initClass({
  jl_ClassCastException: 0
}, false, "java.lang.ClassCastException", {
  jl_ClassCastException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_ClassCastException.prototype.$classData = $d_jl_ClassCastException;
/** @constructor */
function $c_jl_IllegalArgumentException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_IllegalArgumentException.prototype = new $h_jl_RuntimeException();
$c_jl_IllegalArgumentException.prototype.constructor = $c_jl_IllegalArgumentException;
/** @constructor */
function $h_jl_IllegalArgumentException() {
  /*<skip>*/
}
$h_jl_IllegalArgumentException.prototype = $c_jl_IllegalArgumentException.prototype;
$c_jl_IllegalArgumentException.prototype.init___ = (function() {
  $c_jl_IllegalArgumentException.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
$c_jl_IllegalArgumentException.prototype.init___T = (function(s) {
  $c_jl_IllegalArgumentException.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_IllegalArgumentException = new $TypeData().initClass({
  jl_IllegalArgumentException: 0
}, false, "java.lang.IllegalArgumentException", {
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_IllegalArgumentException.prototype.$classData = $d_jl_IllegalArgumentException;
/** @constructor */
function $c_jl_IllegalStateException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_IllegalStateException.prototype = new $h_jl_RuntimeException();
$c_jl_IllegalStateException.prototype.constructor = $c_jl_IllegalStateException;
/** @constructor */
function $h_jl_IllegalStateException() {
  /*<skip>*/
}
$h_jl_IllegalStateException.prototype = $c_jl_IllegalStateException.prototype;
$c_jl_IllegalStateException.prototype.init___T = (function(s) {
  $c_jl_IllegalStateException.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_IllegalStateException = new $TypeData().initClass({
  jl_IllegalStateException: 0
}, false, "java.lang.IllegalStateException", {
  jl_IllegalStateException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_IllegalStateException.prototype.$classData = $d_jl_IllegalStateException;
/** @constructor */
function $c_jl_IndexOutOfBoundsException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_IndexOutOfBoundsException.prototype = new $h_jl_RuntimeException();
$c_jl_IndexOutOfBoundsException.prototype.constructor = $c_jl_IndexOutOfBoundsException;
/** @constructor */
function $h_jl_IndexOutOfBoundsException() {
  /*<skip>*/
}
$h_jl_IndexOutOfBoundsException.prototype = $c_jl_IndexOutOfBoundsException.prototype;
var $d_jl_IndexOutOfBoundsException = new $TypeData().initClass({
  jl_IndexOutOfBoundsException: 0
}, false, "java.lang.IndexOutOfBoundsException", {
  jl_IndexOutOfBoundsException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_IndexOutOfBoundsException.prototype.$classData = $d_jl_IndexOutOfBoundsException;
/** @constructor */
function $c_jl_NullPointerException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_NullPointerException.prototype = new $h_jl_RuntimeException();
$c_jl_NullPointerException.prototype.constructor = $c_jl_NullPointerException;
/** @constructor */
function $h_jl_NullPointerException() {
  /*<skip>*/
}
$h_jl_NullPointerException.prototype = $c_jl_NullPointerException.prototype;
$c_jl_NullPointerException.prototype.init___ = (function() {
  $c_jl_NullPointerException.prototype.init___T.call(this, null);
  return this
});
var $d_jl_NullPointerException = new $TypeData().initClass({
  jl_NullPointerException: 0
}, false, "java.lang.NullPointerException", {
  jl_NullPointerException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_NullPointerException.prototype.$classData = $d_jl_NullPointerException;
/** @constructor */
function $c_jl_UnsupportedOperationException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_UnsupportedOperationException.prototype = new $h_jl_RuntimeException();
$c_jl_UnsupportedOperationException.prototype.constructor = $c_jl_UnsupportedOperationException;
/** @constructor */
function $h_jl_UnsupportedOperationException() {
  /*<skip>*/
}
$h_jl_UnsupportedOperationException.prototype = $c_jl_UnsupportedOperationException.prototype;
$c_jl_UnsupportedOperationException.prototype.init___T = (function(s) {
  $c_jl_UnsupportedOperationException.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_UnsupportedOperationException = new $TypeData().initClass({
  jl_UnsupportedOperationException: 0
}, false, "java.lang.UnsupportedOperationException", {
  jl_UnsupportedOperationException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_UnsupportedOperationException.prototype.$classData = $d_jl_UnsupportedOperationException;
/** @constructor */
function $c_ju_NoSuchElementException() {
  $c_jl_RuntimeException.call(this)
}
$c_ju_NoSuchElementException.prototype = new $h_jl_RuntimeException();
$c_ju_NoSuchElementException.prototype.constructor = $c_ju_NoSuchElementException;
/** @constructor */
function $h_ju_NoSuchElementException() {
  /*<skip>*/
}
$h_ju_NoSuchElementException.prototype = $c_ju_NoSuchElementException.prototype;
var $d_ju_NoSuchElementException = new $TypeData().initClass({
  ju_NoSuchElementException: 0
}, false, "java.util.NoSuchElementException", {
  ju_NoSuchElementException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_NoSuchElementException.prototype.$classData = $d_ju_NoSuchElementException;
/** @constructor */
function $c_s_MatchError() {
  $c_jl_RuntimeException.call(this);
  this.obj$4 = null;
  this.objString$4 = null;
  this.bitmap$0$4 = false
}
$c_s_MatchError.prototype = new $h_jl_RuntimeException();
$c_s_MatchError.prototype.constructor = $c_s_MatchError;
/** @constructor */
function $h_s_MatchError() {
  /*<skip>*/
}
$h_s_MatchError.prototype = $c_s_MatchError.prototype;
$c_s_MatchError.prototype.objString$lzycompute__p4__T = (function() {
  if ((!this.bitmap$0$4)) {
    this.objString$4 = ((this.obj$4 === null) ? "null" : this.liftedTree1$1__p4__T());
    this.bitmap$0$4 = true
  };
  return this.objString$4
});
$c_s_MatchError.prototype.ofClass$1__p4__T = (function() {
  return ("of class " + $objectGetClass(this.obj$4).getName__T())
});
$c_s_MatchError.prototype.liftedTree1$1__p4__T = (function() {
  try {
    return ((($objectToString(this.obj$4) + " (") + this.ofClass$1__p4__T()) + ")")
  } catch (e) {
    var e$2 = $m_sjsr_package$().wrapJavaScriptException__O__jl_Throwable(e);
    if ((e$2 !== null)) {
      return ("an instance " + this.ofClass$1__p4__T())
    } else {
      throw e
    }
  }
});
$c_s_MatchError.prototype.getMessage__T = (function() {
  return this.objString__p4__T()
});
$c_s_MatchError.prototype.objString__p4__T = (function() {
  return ((!this.bitmap$0$4) ? this.objString$lzycompute__p4__T() : this.objString$4)
});
$c_s_MatchError.prototype.init___O = (function(obj) {
  this.obj$4 = obj;
  $c_jl_RuntimeException.prototype.init___.call(this);
  return this
});
var $d_s_MatchError = new $TypeData().initClass({
  s_MatchError: 0
}, false, "scala.MatchError", {
  s_MatchError: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_s_MatchError.prototype.$classData = $d_s_MatchError;
/** @constructor */
function $c_s_Option() {
  $c_O.call(this)
}
$c_s_Option.prototype = new $h_O();
$c_s_Option.prototype.constructor = $c_s_Option;
/** @constructor */
function $h_s_Option() {
  /*<skip>*/
}
$h_s_Option.prototype = $c_s_Option.prototype;
$c_s_Option.prototype.init___ = (function() {
  return this
});
$c_s_Option.prototype.isDefined__Z = (function() {
  return (!this.isEmpty__Z())
});
function $is_s_Option(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_Option)))
}
function $as_s_Option(obj) {
  return (($is_s_Option(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Option"))
}
function $isArrayOf_s_Option(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_Option)))
}
function $asArrayOf_s_Option(obj, depth) {
  return (($isArrayOf_s_Option(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Option;", depth))
}
/** @constructor */
function $c_s_Predef$$anon$1() {
  $c_s_Predef$$less$colon$less.call(this)
}
$c_s_Predef$$anon$1.prototype = new $h_s_Predef$$less$colon$less();
$c_s_Predef$$anon$1.prototype.constructor = $c_s_Predef$$anon$1;
/** @constructor */
function $h_s_Predef$$anon$1() {
  /*<skip>*/
}
$h_s_Predef$$anon$1.prototype = $c_s_Predef$$anon$1.prototype;
$c_s_Predef$$anon$1.prototype.apply__O__O = (function(x) {
  return x
});
var $d_s_Predef$$anon$1 = new $TypeData().initClass({
  s_Predef$$anon$1: 0
}, false, "scala.Predef$$anon$1", {
  s_Predef$$anon$1: 1,
  s_Predef$$less$colon$less: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Predef$$anon$1.prototype.$classData = $d_s_Predef$$anon$1;
/** @constructor */
function $c_s_Predef$$anon$2() {
  $c_s_Predef$$eq$colon$eq.call(this)
}
$c_s_Predef$$anon$2.prototype = new $h_s_Predef$$eq$colon$eq();
$c_s_Predef$$anon$2.prototype.constructor = $c_s_Predef$$anon$2;
/** @constructor */
function $h_s_Predef$$anon$2() {
  /*<skip>*/
}
$h_s_Predef$$anon$2.prototype = $c_s_Predef$$anon$2.prototype;
$c_s_Predef$$anon$2.prototype.apply__O__O = (function(x) {
  return x
});
var $d_s_Predef$$anon$2 = new $TypeData().initClass({
  s_Predef$$anon$2: 0
}, false, "scala.Predef$$anon$2", {
  s_Predef$$anon$2: 1,
  s_Predef$$eq$colon$eq: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Predef$$anon$2.prototype.$classData = $d_s_Predef$$anon$2;
/** @constructor */
function $c_s_StringContext() {
  $c_O.call(this);
  this.parts$1 = null
}
$c_s_StringContext.prototype = new $h_O();
$c_s_StringContext.prototype.constructor = $c_s_StringContext;
/** @constructor */
function $h_s_StringContext() {
  /*<skip>*/
}
$h_s_StringContext.prototype = $c_s_StringContext.prototype;
$c_s_StringContext.prototype.productPrefix__T = (function() {
  return "StringContext"
});
$c_s_StringContext.prototype.productArity__I = (function() {
  return 1
});
$c_s_StringContext.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_s_StringContext(x$1)) {
    var StringContext$1 = $as_s_StringContext(x$1);
    var x = this.parts$1;
    var x$2 = StringContext$1.parts$1;
    return ((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))
  } else {
    return false
  }
});
$c_s_StringContext.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.parts$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_s_StringContext.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_s_StringContext.prototype.checkLengths__sc_Seq__V = (function(args) {
  if ((this.parts$1.length__I() !== ((1 + args.length__I()) | 0))) {
    throw new $c_jl_IllegalArgumentException().init___T((((("wrong number of arguments (" + args.length__I()) + ") for interpolated string with ") + this.parts$1.length__I()) + " parts"))
  }
});
$c_s_StringContext.prototype.s__sc_Seq__T = (function(args) {
  var f = (function($this) {
    return (function(str$2) {
      var str = $as_T(str$2);
      var this$1 = $m_s_StringContext$();
      return this$1.treatEscapes0__p1__T__Z__T(str, false)
    })
  })(this);
  this.checkLengths__sc_Seq__V(args);
  var pi = this.parts$1.iterator__sc_Iterator();
  var ai = args.iterator__sc_Iterator();
  var arg1 = pi.next__O();
  var bldr = new $c_jl_StringBuilder().init___T($as_T(f(arg1)));
  while (ai.hasNext__Z()) {
    bldr.append__O__jl_StringBuilder(ai.next__O());
    var arg1$1 = pi.next__O();
    bldr.append__T__jl_StringBuilder($as_T(f(arg1$1)))
  };
  return bldr.content$1
});
$c_s_StringContext.prototype.init___sc_Seq = (function(parts) {
  this.parts$1 = parts;
  return this
});
$c_s_StringContext.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_s_StringContext.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_s_StringContext(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_StringContext)))
}
function $as_s_StringContext(obj) {
  return (($is_s_StringContext(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.StringContext"))
}
function $isArrayOf_s_StringContext(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_StringContext)))
}
function $asArrayOf_s_StringContext(obj, depth) {
  return (($isArrayOf_s_StringContext(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.StringContext;", depth))
}
var $d_s_StringContext = new $TypeData().initClass({
  s_StringContext: 0
}, false, "scala.StringContext", {
  s_StringContext: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_StringContext.prototype.$classData = $d_s_StringContext;
/** @constructor */
function $c_s_util_control_BreakControl() {
  $c_jl_Throwable.call(this)
}
$c_s_util_control_BreakControl.prototype = new $h_jl_Throwable();
$c_s_util_control_BreakControl.prototype.constructor = $c_s_util_control_BreakControl;
/** @constructor */
function $h_s_util_control_BreakControl() {
  /*<skip>*/
}
$h_s_util_control_BreakControl.prototype = $c_s_util_control_BreakControl.prototype;
$c_s_util_control_BreakControl.prototype.init___ = (function() {
  $c_jl_Throwable.prototype.init___.call(this);
  return this
});
$c_s_util_control_BreakControl.prototype.fillInStackTrace__jl_Throwable = (function() {
  return $s_s_util_control_NoStackTrace$class__fillInStackTrace__s_util_control_NoStackTrace__jl_Throwable(this)
});
$c_s_util_control_BreakControl.prototype.scala$util$control$NoStackTrace$$super$fillInStackTrace__jl_Throwable = (function() {
  return $c_jl_Throwable.prototype.fillInStackTrace__jl_Throwable.call(this)
});
var $d_s_util_control_BreakControl = new $TypeData().initClass({
  s_util_control_BreakControl: 0
}, false, "scala.util.control.BreakControl", {
  s_util_control_BreakControl: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  s_util_control_ControlThrowable: 1,
  s_util_control_NoStackTrace: 1
});
$c_s_util_control_BreakControl.prototype.$classData = $d_s_util_control_BreakControl;
function $is_sc_GenTraversable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenTraversable)))
}
function $as_sc_GenTraversable(obj) {
  return (($is_sc_GenTraversable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenTraversable"))
}
function $isArrayOf_sc_GenTraversable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenTraversable)))
}
function $asArrayOf_sc_GenTraversable(obj, depth) {
  return (($isArrayOf_sc_GenTraversable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenTraversable;", depth))
}
/** @constructor */
function $c_sc_Iterable$() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_sc_Iterable$.prototype = new $h_scg_GenTraversableFactory();
$c_sc_Iterable$.prototype.constructor = $c_sc_Iterable$;
/** @constructor */
function $h_sc_Iterable$() {
  /*<skip>*/
}
$h_sc_Iterable$.prototype = $c_sc_Iterable$.prototype;
$c_sc_Iterable$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_Iterable$();
  return new $c_scm_ListBuffer().init___()
});
var $d_sc_Iterable$ = new $TypeData().initClass({
  sc_Iterable$: 0
}, false, "scala.collection.Iterable$", {
  sc_Iterable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sc_Iterable$.prototype.$classData = $d_sc_Iterable$;
var $n_sc_Iterable$ = (void 0);
function $m_sc_Iterable$() {
  if ((!$n_sc_Iterable$)) {
    $n_sc_Iterable$ = new $c_sc_Iterable$().init___()
  };
  return $n_sc_Iterable$
}
/** @constructor */
function $c_sc_Iterator$$anon$2() {
  $c_sc_AbstractIterator.call(this)
}
$c_sc_Iterator$$anon$2.prototype = new $h_sc_AbstractIterator();
$c_sc_Iterator$$anon$2.prototype.constructor = $c_sc_Iterator$$anon$2;
/** @constructor */
function $h_sc_Iterator$$anon$2() {
  /*<skip>*/
}
$h_sc_Iterator$$anon$2.prototype = $c_sc_Iterator$$anon$2.prototype;
$c_sc_Iterator$$anon$2.prototype.next__O = (function() {
  this.next__sr_Nothing$()
});
$c_sc_Iterator$$anon$2.prototype.next__sr_Nothing$ = (function() {
  throw new $c_ju_NoSuchElementException().init___T("next on empty iterator")
});
$c_sc_Iterator$$anon$2.prototype.hasNext__Z = (function() {
  return false
});
var $d_sc_Iterator$$anon$2 = new $TypeData().initClass({
  sc_Iterator$$anon$2: 0
}, false, "scala.collection.Iterator$$anon$2", {
  sc_Iterator$$anon$2: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_Iterator$$anon$2.prototype.$classData = $d_sc_Iterator$$anon$2;
/** @constructor */
function $c_sc_LinearSeqLike$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.these$2 = null
}
$c_sc_LinearSeqLike$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_sc_LinearSeqLike$$anon$1.prototype.constructor = $c_sc_LinearSeqLike$$anon$1;
/** @constructor */
function $h_sc_LinearSeqLike$$anon$1() {
  /*<skip>*/
}
$h_sc_LinearSeqLike$$anon$1.prototype = $c_sc_LinearSeqLike$$anon$1.prototype;
$c_sc_LinearSeqLike$$anon$1.prototype.init___sc_LinearSeqLike = (function($$outer) {
  this.these$2 = $$outer;
  return this
});
$c_sc_LinearSeqLike$$anon$1.prototype.next__O = (function() {
  if (this.hasNext__Z()) {
    var result = this.these$2.head__O();
    this.these$2 = $as_sc_LinearSeqLike(this.these$2.tail__O());
    return result
  } else {
    return $m_sc_Iterator$().empty$1.next__O()
  }
});
$c_sc_LinearSeqLike$$anon$1.prototype.hasNext__Z = (function() {
  return (!this.these$2.isEmpty__Z())
});
var $d_sc_LinearSeqLike$$anon$1 = new $TypeData().initClass({
  sc_LinearSeqLike$$anon$1: 0
}, false, "scala.collection.LinearSeqLike$$anon$1", {
  sc_LinearSeqLike$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_LinearSeqLike$$anon$1.prototype.$classData = $d_sc_LinearSeqLike$$anon$1;
/** @constructor */
function $c_sc_Traversable$() {
  $c_scg_GenTraversableFactory.call(this);
  this.breaks$3 = null
}
$c_sc_Traversable$.prototype = new $h_scg_GenTraversableFactory();
$c_sc_Traversable$.prototype.constructor = $c_sc_Traversable$;
/** @constructor */
function $h_sc_Traversable$() {
  /*<skip>*/
}
$h_sc_Traversable$.prototype = $c_sc_Traversable$.prototype;
$c_sc_Traversable$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  $n_sc_Traversable$ = this;
  this.breaks$3 = new $c_s_util_control_Breaks().init___();
  return this
});
$c_sc_Traversable$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_Traversable$();
  return new $c_scm_ListBuffer().init___()
});
var $d_sc_Traversable$ = new $TypeData().initClass({
  sc_Traversable$: 0
}, false, "scala.collection.Traversable$", {
  sc_Traversable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sc_Traversable$.prototype.$classData = $d_sc_Traversable$;
var $n_sc_Traversable$ = (void 0);
function $m_sc_Traversable$() {
  if ((!$n_sc_Traversable$)) {
    $n_sc_Traversable$ = new $c_sc_Traversable$().init___()
  };
  return $n_sc_Traversable$
}
/** @constructor */
function $c_scg_ImmutableSetFactory() {
  $c_scg_SetFactory.call(this)
}
$c_scg_ImmutableSetFactory.prototype = new $h_scg_SetFactory();
$c_scg_ImmutableSetFactory.prototype.constructor = $c_scg_ImmutableSetFactory;
/** @constructor */
function $h_scg_ImmutableSetFactory() {
  /*<skip>*/
}
$h_scg_ImmutableSetFactory.prototype = $c_scg_ImmutableSetFactory.prototype;
$c_scg_ImmutableSetFactory.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_SetBuilder().init___sc_Set(this.emptyInstance__sci_Set())
});
/** @constructor */
function $c_scg_MutableSetFactory() {
  $c_scg_SetFactory.call(this)
}
$c_scg_MutableSetFactory.prototype = new $h_scg_SetFactory();
$c_scg_MutableSetFactory.prototype.constructor = $c_scg_MutableSetFactory;
/** @constructor */
function $h_scg_MutableSetFactory() {
  /*<skip>*/
}
$h_scg_MutableSetFactory.prototype = $c_scg_MutableSetFactory.prototype;
$c_scg_MutableSetFactory.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_GrowingBuilder().init___scg_Growable($as_scg_Growable(this.empty__sc_GenTraversable()))
});
/** @constructor */
function $c_sci_Iterable$() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_sci_Iterable$.prototype = new $h_scg_GenTraversableFactory();
$c_sci_Iterable$.prototype.constructor = $c_sci_Iterable$;
/** @constructor */
function $h_sci_Iterable$() {
  /*<skip>*/
}
$h_sci_Iterable$.prototype = $c_sci_Iterable$.prototype;
$c_sci_Iterable$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ListBuffer().init___()
});
var $d_sci_Iterable$ = new $TypeData().initClass({
  sci_Iterable$: 0
}, false, "scala.collection.immutable.Iterable$", {
  sci_Iterable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_Iterable$.prototype.$classData = $d_sci_Iterable$;
var $n_sci_Iterable$ = (void 0);
function $m_sci_Iterable$() {
  if ((!$n_sci_Iterable$)) {
    $n_sci_Iterable$ = new $c_sci_Iterable$().init___()
  };
  return $n_sci_Iterable$
}
/** @constructor */
function $c_sci_ListSet$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.that$2 = null
}
$c_sci_ListSet$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_sci_ListSet$$anon$1.prototype.constructor = $c_sci_ListSet$$anon$1;
/** @constructor */
function $h_sci_ListSet$$anon$1() {
  /*<skip>*/
}
$h_sci_ListSet$$anon$1.prototype = $c_sci_ListSet$$anon$1.prototype;
$c_sci_ListSet$$anon$1.prototype.next__O = (function() {
  var this$1 = this.that$2;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)) {
    var res = this.that$2.head__O();
    this.that$2 = this.that$2.tail__sci_ListSet();
    return res
  } else {
    return $m_sc_Iterator$().empty$1.next__O()
  }
});
$c_sci_ListSet$$anon$1.prototype.init___sci_ListSet = (function($$outer) {
  this.that$2 = $$outer;
  return this
});
$c_sci_ListSet$$anon$1.prototype.hasNext__Z = (function() {
  var this$1 = this.that$2;
  return $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)
});
var $d_sci_ListSet$$anon$1 = new $TypeData().initClass({
  sci_ListSet$$anon$1: 0
}, false, "scala.collection.immutable.ListSet$$anon$1", {
  sci_ListSet$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sci_ListSet$$anon$1.prototype.$classData = $d_sci_ListSet$$anon$1;
/** @constructor */
function $c_sci_Stream$StreamBuilder() {
  $c_scm_LazyBuilder.call(this)
}
$c_sci_Stream$StreamBuilder.prototype = new $h_scm_LazyBuilder();
$c_sci_Stream$StreamBuilder.prototype.constructor = $c_sci_Stream$StreamBuilder;
/** @constructor */
function $h_sci_Stream$StreamBuilder() {
  /*<skip>*/
}
$h_sci_Stream$StreamBuilder.prototype = $c_sci_Stream$StreamBuilder.prototype;
$c_sci_Stream$StreamBuilder.prototype.result__O = (function() {
  return this.result__sci_Stream()
});
$c_sci_Stream$StreamBuilder.prototype.result__sci_Stream = (function() {
  var this$1 = this.parts$1;
  return $as_sci_Stream(this$1.scala$collection$mutable$ListBuffer$$start$6.toStream__sci_Stream().flatMap__F1__scg_CanBuildFrom__O(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(x$5$2) {
      var x$5 = $as_sc_TraversableOnce(x$5$2);
      return x$5.toStream__sci_Stream()
    })
  })(this)), ($m_sci_Stream$(), new $c_sci_Stream$StreamCanBuildFrom().init___())))
});
function $is_sci_Stream$StreamBuilder(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Stream$StreamBuilder)))
}
function $as_sci_Stream$StreamBuilder(obj) {
  return (($is_sci_Stream$StreamBuilder(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Stream$StreamBuilder"))
}
function $isArrayOf_sci_Stream$StreamBuilder(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Stream$StreamBuilder)))
}
function $asArrayOf_sci_Stream$StreamBuilder(obj, depth) {
  return (($isArrayOf_sci_Stream$StreamBuilder(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Stream$StreamBuilder;", depth))
}
var $d_sci_Stream$StreamBuilder = new $TypeData().initClass({
  sci_Stream$StreamBuilder: 0
}, false, "scala.collection.immutable.Stream$StreamBuilder", {
  sci_Stream$StreamBuilder: 1,
  scm_LazyBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1
});
$c_sci_Stream$StreamBuilder.prototype.$classData = $d_sci_Stream$StreamBuilder;
/** @constructor */
function $c_sci_StreamIterator() {
  $c_sc_AbstractIterator.call(this);
  this.these$2 = null
}
$c_sci_StreamIterator.prototype = new $h_sc_AbstractIterator();
$c_sci_StreamIterator.prototype.constructor = $c_sci_StreamIterator;
/** @constructor */
function $h_sci_StreamIterator() {
  /*<skip>*/
}
$h_sci_StreamIterator.prototype = $c_sci_StreamIterator.prototype;
$c_sci_StreamIterator.prototype.next__O = (function() {
  if ($s_sc_Iterator$class__isEmpty__sc_Iterator__Z(this)) {
    return $m_sc_Iterator$().empty$1.next__O()
  } else {
    var cur = this.these$2.v__sci_Stream();
    var result = cur.head__O();
    this.these$2 = new $c_sci_StreamIterator$LazyCell().init___sci_StreamIterator__F0(this, new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, cur$1) {
      return (function() {
        return $as_sci_Stream(cur$1.tail__O())
      })
    })(this, cur)));
    return result
  }
});
$c_sci_StreamIterator.prototype.init___sci_Stream = (function(self) {
  this.these$2 = new $c_sci_StreamIterator$LazyCell().init___sci_StreamIterator__F0(this, new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, self$1) {
    return (function() {
      return self$1
    })
  })(this, self)));
  return this
});
$c_sci_StreamIterator.prototype.hasNext__Z = (function() {
  var this$1 = this.these$2.v__sci_Stream();
  return $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)
});
$c_sci_StreamIterator.prototype.toStream__sci_Stream = (function() {
  var result = this.these$2.v__sci_Stream();
  this.these$2 = new $c_sci_StreamIterator$LazyCell().init___sci_StreamIterator__F0(this, new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this) {
    return (function() {
      $m_sci_Stream$();
      return $m_sci_Stream$Empty$()
    })
  })(this)));
  return result
});
var $d_sci_StreamIterator = new $TypeData().initClass({
  sci_StreamIterator: 0
}, false, "scala.collection.immutable.StreamIterator", {
  sci_StreamIterator: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sci_StreamIterator.prototype.$classData = $d_sci_StreamIterator;
/** @constructor */
function $c_sci_Traversable$() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_sci_Traversable$.prototype = new $h_scg_GenTraversableFactory();
$c_sci_Traversable$.prototype.constructor = $c_sci_Traversable$;
/** @constructor */
function $h_sci_Traversable$() {
  /*<skip>*/
}
$h_sci_Traversable$.prototype = $c_sci_Traversable$.prototype;
$c_sci_Traversable$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ListBuffer().init___()
});
var $d_sci_Traversable$ = new $TypeData().initClass({
  sci_Traversable$: 0
}, false, "scala.collection.immutable.Traversable$", {
  sci_Traversable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_Traversable$.prototype.$classData = $d_sci_Traversable$;
var $n_sci_Traversable$ = (void 0);
function $m_sci_Traversable$() {
  if ((!$n_sci_Traversable$)) {
    $n_sci_Traversable$ = new $c_sci_Traversable$().init___()
  };
  return $n_sci_Traversable$
}
/** @constructor */
function $c_sci_TrieIterator() {
  $c_sc_AbstractIterator.call(this);
  this.elems$2 = null;
  this.scala$collection$immutable$TrieIterator$$depth$f = 0;
  this.scala$collection$immutable$TrieIterator$$arrayStack$f = null;
  this.scala$collection$immutable$TrieIterator$$posStack$f = null;
  this.scala$collection$immutable$TrieIterator$$arrayD$f = null;
  this.scala$collection$immutable$TrieIterator$$posD$f = 0;
  this.scala$collection$immutable$TrieIterator$$subIter$f = null
}
$c_sci_TrieIterator.prototype = new $h_sc_AbstractIterator();
$c_sci_TrieIterator.prototype.constructor = $c_sci_TrieIterator;
/** @constructor */
function $h_sci_TrieIterator() {
  /*<skip>*/
}
$h_sci_TrieIterator.prototype = $c_sci_TrieIterator.prototype;
$c_sci_TrieIterator.prototype.isContainer__p2__O__Z = (function(x) {
  return ($is_sci_HashMap$HashMap1(x) || $is_sci_HashSet$HashSet1(x))
});
$c_sci_TrieIterator.prototype.next__O = (function() {
  if ((this.scala$collection$immutable$TrieIterator$$subIter$f !== null)) {
    var el = this.scala$collection$immutable$TrieIterator$$subIter$f.next__O();
    if ((!this.scala$collection$immutable$TrieIterator$$subIter$f.hasNext__Z())) {
      this.scala$collection$immutable$TrieIterator$$subIter$f = null
    };
    return el
  } else {
    return this.next0__p2__Asci_Iterable__I__O(this.scala$collection$immutable$TrieIterator$$arrayD$f, this.scala$collection$immutable$TrieIterator$$posD$f)
  }
});
$c_sci_TrieIterator.prototype.initPosStack__AI = (function() {
  return $newArrayObject($d_I.getArrayOf(), [6])
});
$c_sci_TrieIterator.prototype.hasNext__Z = (function() {
  return ((this.scala$collection$immutable$TrieIterator$$subIter$f !== null) || (this.scala$collection$immutable$TrieIterator$$depth$f >= 0))
});
$c_sci_TrieIterator.prototype.next0__p2__Asci_Iterable__I__O = (function(elems, i) {
  _next0: while (true) {
    if ((i === (((-1) + elems.u["length"]) | 0))) {
      this.scala$collection$immutable$TrieIterator$$depth$f = (((-1) + this.scala$collection$immutable$TrieIterator$$depth$f) | 0);
      if ((this.scala$collection$immutable$TrieIterator$$depth$f >= 0)) {
        this.scala$collection$immutable$TrieIterator$$arrayD$f = this.scala$collection$immutable$TrieIterator$$arrayStack$f.u[this.scala$collection$immutable$TrieIterator$$depth$f];
        this.scala$collection$immutable$TrieIterator$$posD$f = this.scala$collection$immutable$TrieIterator$$posStack$f.u[this.scala$collection$immutable$TrieIterator$$depth$f];
        this.scala$collection$immutable$TrieIterator$$arrayStack$f.u[this.scala$collection$immutable$TrieIterator$$depth$f] = null
      } else {
        this.scala$collection$immutable$TrieIterator$$arrayD$f = null;
        this.scala$collection$immutable$TrieIterator$$posD$f = 0
      }
    } else {
      this.scala$collection$immutable$TrieIterator$$posD$f = ((1 + this.scala$collection$immutable$TrieIterator$$posD$f) | 0)
    };
    var m = elems.u[i];
    if (this.isContainer__p2__O__Z(m)) {
      return $as_sci_HashSet$HashSet1(m).key$6
    } else if (this.isTrie__p2__O__Z(m)) {
      if ((this.scala$collection$immutable$TrieIterator$$depth$f >= 0)) {
        this.scala$collection$immutable$TrieIterator$$arrayStack$f.u[this.scala$collection$immutable$TrieIterator$$depth$f] = this.scala$collection$immutable$TrieIterator$$arrayD$f;
        this.scala$collection$immutable$TrieIterator$$posStack$f.u[this.scala$collection$immutable$TrieIterator$$depth$f] = this.scala$collection$immutable$TrieIterator$$posD$f
      };
      this.scala$collection$immutable$TrieIterator$$depth$f = ((1 + this.scala$collection$immutable$TrieIterator$$depth$f) | 0);
      this.scala$collection$immutable$TrieIterator$$arrayD$f = this.getElems__p2__sci_Iterable__Asci_Iterable(m);
      this.scala$collection$immutable$TrieIterator$$posD$f = 0;
      var temp$elems = this.getElems__p2__sci_Iterable__Asci_Iterable(m);
      elems = temp$elems;
      i = 0;
      continue _next0
    } else {
      this.scala$collection$immutable$TrieIterator$$subIter$f = m.iterator__sc_Iterator();
      return this.next__O()
    }
  }
});
$c_sci_TrieIterator.prototype.getElems__p2__sci_Iterable__Asci_Iterable = (function(x) {
  if ($is_sci_HashMap$HashTrieMap(x)) {
    var x2 = $as_sci_HashMap$HashTrieMap(x);
    var jsx$1 = $asArrayOf_sc_AbstractIterable(x2.elems__Asci_HashMap(), 1)
  } else if ($is_sci_HashSet$HashTrieSet(x)) {
    var x3 = $as_sci_HashSet$HashTrieSet(x);
    var jsx$1 = x3.elems$5
  } else {
    var jsx$1;
    throw new $c_s_MatchError().init___O(x)
  };
  return $asArrayOf_sci_Iterable(jsx$1, 1)
});
$c_sci_TrieIterator.prototype.init___Asci_Iterable = (function(elems) {
  this.elems$2 = elems;
  this.scala$collection$immutable$TrieIterator$$depth$f = 0;
  this.scala$collection$immutable$TrieIterator$$arrayStack$f = this.initArrayStack__AAsci_Iterable();
  this.scala$collection$immutable$TrieIterator$$posStack$f = this.initPosStack__AI();
  this.scala$collection$immutable$TrieIterator$$arrayD$f = this.elems$2;
  this.scala$collection$immutable$TrieIterator$$posD$f = 0;
  this.scala$collection$immutable$TrieIterator$$subIter$f = null;
  return this
});
$c_sci_TrieIterator.prototype.isTrie__p2__O__Z = (function(x) {
  return ($is_sci_HashMap$HashTrieMap(x) || $is_sci_HashSet$HashTrieSet(x))
});
$c_sci_TrieIterator.prototype.initArrayStack__AAsci_Iterable = (function() {
  return $newArrayObject($d_sci_Iterable.getArrayOf().getArrayOf(), [6])
});
/** @constructor */
function $c_sci_VectorBuilder() {
  $c_O.call(this);
  this.blockIndex$1 = 0;
  this.lo$1 = 0;
  this.depth$1 = 0;
  this.display0$1 = null;
  this.display1$1 = null;
  this.display2$1 = null;
  this.display3$1 = null;
  this.display4$1 = null;
  this.display5$1 = null
}
$c_sci_VectorBuilder.prototype = new $h_O();
$c_sci_VectorBuilder.prototype.constructor = $c_sci_VectorBuilder;
/** @constructor */
function $h_sci_VectorBuilder() {
  /*<skip>*/
}
$h_sci_VectorBuilder.prototype = $c_sci_VectorBuilder.prototype;
$c_sci_VectorBuilder.prototype.display3__AO = (function() {
  return this.display3$1
});
$c_sci_VectorBuilder.prototype.init___ = (function() {
  this.display0$1 = $newArrayObject($d_O.getArrayOf(), [32]);
  this.depth$1 = 1;
  this.blockIndex$1 = 0;
  this.lo$1 = 0;
  return this
});
$c_sci_VectorBuilder.prototype.depth__I = (function() {
  return this.depth$1
});
$c_sci_VectorBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__sci_VectorBuilder(elem)
});
$c_sci_VectorBuilder.prototype.display5$und$eq__AO__V = (function(x$1) {
  this.display5$1 = x$1
});
$c_sci_VectorBuilder.prototype.display0__AO = (function() {
  return this.display0$1
});
$c_sci_VectorBuilder.prototype.display4__AO = (function() {
  return this.display4$1
});
$c_sci_VectorBuilder.prototype.display2$und$eq__AO__V = (function(x$1) {
  this.display2$1 = x$1
});
$c_sci_VectorBuilder.prototype.$$plus$eq__O__sci_VectorBuilder = (function(elem) {
  if ((this.lo$1 >= this.display0$1.u["length"])) {
    var newBlockIndex = ((32 + this.blockIndex$1) | 0);
    var xor = (this.blockIndex$1 ^ newBlockIndex);
    $s_sci_VectorPointer$class__gotoNextBlockStartWritable__sci_VectorPointer__I__I__V(this, newBlockIndex, xor);
    this.blockIndex$1 = newBlockIndex;
    this.lo$1 = 0
  };
  this.display0$1.u[this.lo$1] = elem;
  this.lo$1 = ((1 + this.lo$1) | 0);
  return this
});
$c_sci_VectorBuilder.prototype.result__O = (function() {
  return this.result__sci_Vector()
});
$c_sci_VectorBuilder.prototype.display1$und$eq__AO__V = (function(x$1) {
  this.display1$1 = x$1
});
$c_sci_VectorBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_sci_VectorBuilder.prototype.display4$und$eq__AO__V = (function(x$1) {
  this.display4$1 = x$1
});
$c_sci_VectorBuilder.prototype.display1__AO = (function() {
  return this.display1$1
});
$c_sci_VectorBuilder.prototype.display5__AO = (function() {
  return this.display5$1
});
$c_sci_VectorBuilder.prototype.result__sci_Vector = (function() {
  var size = ((this.blockIndex$1 + this.lo$1) | 0);
  if ((size === 0)) {
    var this$1 = $m_sci_Vector$();
    return this$1.NIL$6
  };
  var s = new $c_sci_Vector().init___I__I__I(0, size, 0);
  var depth = this.depth$1;
  $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s, this, depth);
  if ((this.depth$1 > 1)) {
    var xor = (((-1) + size) | 0);
    $s_sci_VectorPointer$class__gotoPos__sci_VectorPointer__I__I__V(s, 0, xor)
  };
  return s
});
$c_sci_VectorBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__sci_VectorBuilder(elem)
});
$c_sci_VectorBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_sci_VectorBuilder.prototype.depth$und$eq__I__V = (function(x$1) {
  this.depth$1 = x$1
});
$c_sci_VectorBuilder.prototype.display2__AO = (function() {
  return this.display2$1
});
$c_sci_VectorBuilder.prototype.display0$und$eq__AO__V = (function(x$1) {
  this.display0$1 = x$1
});
$c_sci_VectorBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $as_sci_VectorBuilder($s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs))
});
$c_sci_VectorBuilder.prototype.display3$und$eq__AO__V = (function(x$1) {
  this.display3$1 = x$1
});
function $is_sci_VectorBuilder(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_VectorBuilder)))
}
function $as_sci_VectorBuilder(obj) {
  return (($is_sci_VectorBuilder(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.VectorBuilder"))
}
function $isArrayOf_sci_VectorBuilder(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_VectorBuilder)))
}
function $asArrayOf_sci_VectorBuilder(obj, depth) {
  return (($isArrayOf_sci_VectorBuilder(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.VectorBuilder;", depth))
}
var $d_sci_VectorBuilder = new $TypeData().initClass({
  sci_VectorBuilder: 0
}, false, "scala.collection.immutable.VectorBuilder", {
  sci_VectorBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  sci_VectorPointer: 1
});
$c_sci_VectorBuilder.prototype.$classData = $d_sci_VectorBuilder;
/** @constructor */
function $c_scm_Builder$$anon$1() {
  $c_O.call(this);
  this.self$1 = null;
  this.f$1$1 = null
}
$c_scm_Builder$$anon$1.prototype = new $h_O();
$c_scm_Builder$$anon$1.prototype.constructor = $c_scm_Builder$$anon$1;
/** @constructor */
function $h_scm_Builder$$anon$1() {
  /*<skip>*/
}
$h_scm_Builder$$anon$1.prototype = $c_scm_Builder$$anon$1.prototype;
$c_scm_Builder$$anon$1.prototype.init___scm_Builder__F1 = (function($$outer, f$1) {
  this.f$1$1 = f$1;
  this.self$1 = $$outer;
  return this
});
$c_scm_Builder$$anon$1.prototype.equals__O__Z = (function(that) {
  return $s_s_Proxy$class__equals__s_Proxy__O__Z(this, that)
});
$c_scm_Builder$$anon$1.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_Builder$$anon$1(elem)
});
$c_scm_Builder$$anon$1.prototype.toString__T = (function() {
  return $s_s_Proxy$class__toString__s_Proxy__T(this)
});
$c_scm_Builder$$anon$1.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_Builder$$anon$1 = (function(xs) {
  this.self$1.$$plus$plus$eq__sc_TraversableOnce__scg_Growable(xs);
  return this
});
$c_scm_Builder$$anon$1.prototype.result__O = (function() {
  return this.f$1$1.apply__O__O(this.self$1.result__O())
});
$c_scm_Builder$$anon$1.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundColl) {
  this.self$1.sizeHintBounded__I__sc_TraversableLike__V(size, boundColl)
});
$c_scm_Builder$$anon$1.prototype.$$plus$eq__O__scm_Builder$$anon$1 = (function(x) {
  this.self$1.$$plus$eq__O__scm_Builder(x);
  return this
});
$c_scm_Builder$$anon$1.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_Builder$$anon$1(elem)
});
$c_scm_Builder$$anon$1.prototype.hashCode__I = (function() {
  return this.self$1.hashCode__I()
});
$c_scm_Builder$$anon$1.prototype.sizeHint__I__V = (function(size) {
  this.self$1.sizeHint__I__V(size)
});
$c_scm_Builder$$anon$1.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_Builder$$anon$1(xs)
});
var $d_scm_Builder$$anon$1 = new $TypeData().initClass({
  scm_Builder$$anon$1: 0
}, false, "scala.collection.mutable.Builder$$anon$1", {
  scm_Builder$$anon$1: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  s_Proxy: 1
});
$c_scm_Builder$$anon$1.prototype.$classData = $d_scm_Builder$$anon$1;
/** @constructor */
function $c_scm_FlatHashTable$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.i$2 = 0;
  this.$$outer$2 = null
}
$c_scm_FlatHashTable$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_scm_FlatHashTable$$anon$1.prototype.constructor = $c_scm_FlatHashTable$$anon$1;
/** @constructor */
function $h_scm_FlatHashTable$$anon$1() {
  /*<skip>*/
}
$h_scm_FlatHashTable$$anon$1.prototype = $c_scm_FlatHashTable$$anon$1.prototype;
$c_scm_FlatHashTable$$anon$1.prototype.next__O = (function() {
  if (this.hasNext__Z()) {
    this.i$2 = ((1 + this.i$2) | 0);
    var this$1 = this.$$outer$2;
    var entry = this.$$outer$2.table$5.u[(((-1) + this.i$2) | 0)];
    return $s_scm_FlatHashTable$HashUtils$class__entryToElem__scm_FlatHashTable$HashUtils__O__O(this$1, entry)
  } else {
    return $m_sc_Iterator$().empty$1.next__O()
  }
});
$c_scm_FlatHashTable$$anon$1.prototype.init___scm_FlatHashTable = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.i$2 = 0;
  return this
});
$c_scm_FlatHashTable$$anon$1.prototype.hasNext__Z = (function() {
  while (((this.i$2 < this.$$outer$2.table$5.u["length"]) && (this.$$outer$2.table$5.u[this.i$2] === null))) {
    this.i$2 = ((1 + this.i$2) | 0)
  };
  return (this.i$2 < this.$$outer$2.table$5.u["length"])
});
var $d_scm_FlatHashTable$$anon$1 = new $TypeData().initClass({
  scm_FlatHashTable$$anon$1: 0
}, false, "scala.collection.mutable.FlatHashTable$$anon$1", {
  scm_FlatHashTable$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_scm_FlatHashTable$$anon$1.prototype.$classData = $d_scm_FlatHashTable$$anon$1;
/** @constructor */
function $c_scm_ListBuffer$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.cursor$2 = null
}
$c_scm_ListBuffer$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_scm_ListBuffer$$anon$1.prototype.constructor = $c_scm_ListBuffer$$anon$1;
/** @constructor */
function $h_scm_ListBuffer$$anon$1() {
  /*<skip>*/
}
$h_scm_ListBuffer$$anon$1.prototype = $c_scm_ListBuffer$$anon$1.prototype;
$c_scm_ListBuffer$$anon$1.prototype.init___scm_ListBuffer = (function($$outer) {
  this.cursor$2 = ($$outer.scala$collection$mutable$ListBuffer$$start$6.isEmpty__Z() ? $m_sci_Nil$() : $$outer.scala$collection$mutable$ListBuffer$$start$6);
  return this
});
$c_scm_ListBuffer$$anon$1.prototype.next__O = (function() {
  if ((!this.hasNext__Z())) {
    throw new $c_ju_NoSuchElementException().init___T("next on empty Iterator")
  } else {
    var ans = this.cursor$2.head__O();
    var this$1 = this.cursor$2;
    this.cursor$2 = this$1.tail__sci_List();
    return ans
  }
});
$c_scm_ListBuffer$$anon$1.prototype.hasNext__Z = (function() {
  return (this.cursor$2 !== $m_sci_Nil$())
});
var $d_scm_ListBuffer$$anon$1 = new $TypeData().initClass({
  scm_ListBuffer$$anon$1: 0
}, false, "scala.collection.mutable.ListBuffer$$anon$1", {
  scm_ListBuffer$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_scm_ListBuffer$$anon$1.prototype.$classData = $d_scm_ListBuffer$$anon$1;
/** @constructor */
function $c_sr_ScalaRunTime$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.c$2 = 0;
  this.cmax$2 = 0;
  this.x$2$2 = null
}
$c_sr_ScalaRunTime$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_sr_ScalaRunTime$$anon$1.prototype.constructor = $c_sr_ScalaRunTime$$anon$1;
/** @constructor */
function $h_sr_ScalaRunTime$$anon$1() {
  /*<skip>*/
}
$h_sr_ScalaRunTime$$anon$1.prototype = $c_sr_ScalaRunTime$$anon$1.prototype;
$c_sr_ScalaRunTime$$anon$1.prototype.next__O = (function() {
  var result = this.x$2$2.productElement__I__O(this.c$2);
  this.c$2 = ((1 + this.c$2) | 0);
  return result
});
$c_sr_ScalaRunTime$$anon$1.prototype.init___s_Product = (function(x$2) {
  this.x$2$2 = x$2;
  this.c$2 = 0;
  this.cmax$2 = x$2.productArity__I();
  return this
});
$c_sr_ScalaRunTime$$anon$1.prototype.hasNext__Z = (function() {
  return (this.c$2 < this.cmax$2)
});
var $d_sr_ScalaRunTime$$anon$1 = new $TypeData().initClass({
  sr_ScalaRunTime$$anon$1: 0
}, false, "scala.runtime.ScalaRunTime$$anon$1", {
  sr_ScalaRunTime$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sr_ScalaRunTime$$anon$1.prototype.$classData = $d_sr_ScalaRunTime$$anon$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_CompState$ReadDirectWriteCallback() {
  $c_O.call(this);
  this.$$$1 = null;
  this.a$1 = null
}
$c_Ljapgolly_scalajs_react_CompState$ReadDirectWriteCallback.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_CompState$ReadDirectWriteCallback.prototype.constructor = $c_Ljapgolly_scalajs_react_CompState$ReadDirectWriteCallback;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CompState$ReadDirectWriteCallback() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CompState$ReadDirectWriteCallback.prototype = $c_Ljapgolly_scalajs_react_CompState$ReadDirectWriteCallback.prototype;
$c_Ljapgolly_scalajs_react_CompState$ReadDirectWriteCallback.prototype.init___O__Ljapgolly_scalajs_react_CompState$Accessor = (function($$, a) {
  this.$$$1 = $$;
  this.a$1 = a;
  return this
});
var $d_Ljapgolly_scalajs_react_CompState$ReadDirectWriteCallback = new $TypeData().initClass({
  Ljapgolly_scalajs_react_CompState$ReadDirectWriteCallback: 0
}, false, "japgolly.scalajs.react.CompState$ReadDirectWriteCallback", {
  Ljapgolly_scalajs_react_CompState$ReadDirectWriteCallback: 1,
  O: 1,
  Ljapgolly_scalajs_react_CompState$ReadDirectWriteCallbackOps: 1,
  Ljapgolly_scalajs_react_CompState$ReadDirectOps: 1,
  Ljapgolly_scalajs_react_CompState$BaseOps: 1,
  Ljapgolly_scalajs_react_CompState$WriteCallbackOps: 1,
  Ljapgolly_scalajs_react_CompState$WriteOps: 1
});
$c_Ljapgolly_scalajs_react_CompState$ReadDirectWriteCallback.prototype.$classData = $d_Ljapgolly_scalajs_react_CompState$ReadDirectWriteCallback;
/** @constructor */
function $c_Ljapgolly_scalajs_react_ComponentDidUpdate() {
  $c_Ljapgolly_scalajs_react_LifecycleInput.call(this);
  this.$$$2 = null;
  this.prevProps$2 = null;
  this.prevState$2 = null
}
$c_Ljapgolly_scalajs_react_ComponentDidUpdate.prototype = new $h_Ljapgolly_scalajs_react_LifecycleInput();
$c_Ljapgolly_scalajs_react_ComponentDidUpdate.prototype.constructor = $c_Ljapgolly_scalajs_react_ComponentDidUpdate;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ComponentDidUpdate() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ComponentDidUpdate.prototype = $c_Ljapgolly_scalajs_react_ComponentDidUpdate.prototype;
$c_Ljapgolly_scalajs_react_ComponentDidUpdate.prototype.productPrefix__T = (function() {
  return "ComponentDidUpdate"
});
$c_Ljapgolly_scalajs_react_ComponentDidUpdate.prototype.productArity__I = (function() {
  return 3
});
$c_Ljapgolly_scalajs_react_ComponentDidUpdate.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_ComponentDidUpdate(x$1)) {
    var ComponentDidUpdate$1 = $as_Ljapgolly_scalajs_react_ComponentDidUpdate(x$1);
    return (($m_sr_BoxesRunTime$().equals__O__O__Z(this.$$$2, ComponentDidUpdate$1.$$$2) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.prevProps$2, ComponentDidUpdate$1.prevProps$2)) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.prevState$2, ComponentDidUpdate$1.prevState$2))
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_ComponentDidUpdate.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.$$$2;
      break
    }
    case 1: {
      return this.prevProps$2;
      break
    }
    case 2: {
      return this.prevState$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_ComponentDidUpdate.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_ComponentDidUpdate.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_ComponentDidUpdate.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Ljapgolly_scalajs_react_ComponentDidUpdate.prototype.init___Ljapgolly_scalajs_react_CompScope$DuringCallbackM__O__O = (function($$, prevProps, prevState) {
  this.$$$2 = $$;
  this.prevProps$2 = prevProps;
  this.prevState$2 = prevState;
  return this
});
function $is_Ljapgolly_scalajs_react_ComponentDidUpdate(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_ComponentDidUpdate)))
}
function $as_Ljapgolly_scalajs_react_ComponentDidUpdate(obj) {
  return (($is_Ljapgolly_scalajs_react_ComponentDidUpdate(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.ComponentDidUpdate"))
}
function $isArrayOf_Ljapgolly_scalajs_react_ComponentDidUpdate(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_ComponentDidUpdate)))
}
function $asArrayOf_Ljapgolly_scalajs_react_ComponentDidUpdate(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_ComponentDidUpdate(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.ComponentDidUpdate;", depth))
}
var $d_Ljapgolly_scalajs_react_ComponentDidUpdate = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ComponentDidUpdate: 0
}, false, "japgolly.scalajs.react.ComponentDidUpdate", {
  Ljapgolly_scalajs_react_ComponentDidUpdate: 1,
  Ljapgolly_scalajs_react_LifecycleInput: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_ComponentDidUpdate.prototype.$classData = $d_Ljapgolly_scalajs_react_ComponentDidUpdate;
/** @constructor */
function $c_Ljapgolly_scalajs_react_ComponentWillReceiveProps() {
  $c_Ljapgolly_scalajs_react_LifecycleInput.call(this);
  this.$$$2 = null;
  this.nextProps$2 = null
}
$c_Ljapgolly_scalajs_react_ComponentWillReceiveProps.prototype = new $h_Ljapgolly_scalajs_react_LifecycleInput();
$c_Ljapgolly_scalajs_react_ComponentWillReceiveProps.prototype.constructor = $c_Ljapgolly_scalajs_react_ComponentWillReceiveProps;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ComponentWillReceiveProps() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ComponentWillReceiveProps.prototype = $c_Ljapgolly_scalajs_react_ComponentWillReceiveProps.prototype;
$c_Ljapgolly_scalajs_react_ComponentWillReceiveProps.prototype.productPrefix__T = (function() {
  return "ComponentWillReceiveProps"
});
$c_Ljapgolly_scalajs_react_ComponentWillReceiveProps.prototype.productArity__I = (function() {
  return 2
});
$c_Ljapgolly_scalajs_react_ComponentWillReceiveProps.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_ComponentWillReceiveProps(x$1)) {
    var ComponentWillReceiveProps$1 = $as_Ljapgolly_scalajs_react_ComponentWillReceiveProps(x$1);
    return ($m_sr_BoxesRunTime$().equals__O__O__Z(this.$$$2, ComponentWillReceiveProps$1.$$$2) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.nextProps$2, ComponentWillReceiveProps$1.nextProps$2))
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_ComponentWillReceiveProps.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.$$$2;
      break
    }
    case 1: {
      return this.nextProps$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_ComponentWillReceiveProps.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_ComponentWillReceiveProps.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_ComponentWillReceiveProps.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Ljapgolly_scalajs_react_ComponentWillReceiveProps.prototype.init___Ljapgolly_scalajs_react_CompScope$DuringCallbackM__O = (function($$, nextProps) {
  this.$$$2 = $$;
  this.nextProps$2 = nextProps;
  return this
});
function $is_Ljapgolly_scalajs_react_ComponentWillReceiveProps(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_ComponentWillReceiveProps)))
}
function $as_Ljapgolly_scalajs_react_ComponentWillReceiveProps(obj) {
  return (($is_Ljapgolly_scalajs_react_ComponentWillReceiveProps(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.ComponentWillReceiveProps"))
}
function $isArrayOf_Ljapgolly_scalajs_react_ComponentWillReceiveProps(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_ComponentWillReceiveProps)))
}
function $asArrayOf_Ljapgolly_scalajs_react_ComponentWillReceiveProps(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_ComponentWillReceiveProps(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.ComponentWillReceiveProps;", depth))
}
var $d_Ljapgolly_scalajs_react_ComponentWillReceiveProps = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ComponentWillReceiveProps: 0
}, false, "japgolly.scalajs.react.ComponentWillReceiveProps", {
  Ljapgolly_scalajs_react_ComponentWillReceiveProps: 1,
  Ljapgolly_scalajs_react_LifecycleInput: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_ComponentWillReceiveProps.prototype.$classData = $d_Ljapgolly_scalajs_react_ComponentWillReceiveProps;
/** @constructor */
function $c_Ljapgolly_scalajs_react_ComponentWillUpdate() {
  $c_Ljapgolly_scalajs_react_LifecycleInput.call(this);
  this.$$$2 = null;
  this.nextProps$2 = null;
  this.nextState$2 = null
}
$c_Ljapgolly_scalajs_react_ComponentWillUpdate.prototype = new $h_Ljapgolly_scalajs_react_LifecycleInput();
$c_Ljapgolly_scalajs_react_ComponentWillUpdate.prototype.constructor = $c_Ljapgolly_scalajs_react_ComponentWillUpdate;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ComponentWillUpdate() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ComponentWillUpdate.prototype = $c_Ljapgolly_scalajs_react_ComponentWillUpdate.prototype;
$c_Ljapgolly_scalajs_react_ComponentWillUpdate.prototype.productPrefix__T = (function() {
  return "ComponentWillUpdate"
});
$c_Ljapgolly_scalajs_react_ComponentWillUpdate.prototype.init___Ljapgolly_scalajs_react_CompScope$WillUpdate__O__O = (function($$, nextProps, nextState) {
  this.$$$2 = $$;
  this.nextProps$2 = nextProps;
  this.nextState$2 = nextState;
  return this
});
$c_Ljapgolly_scalajs_react_ComponentWillUpdate.prototype.productArity__I = (function() {
  return 3
});
$c_Ljapgolly_scalajs_react_ComponentWillUpdate.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_ComponentWillUpdate(x$1)) {
    var ComponentWillUpdate$1 = $as_Ljapgolly_scalajs_react_ComponentWillUpdate(x$1);
    return (($m_sr_BoxesRunTime$().equals__O__O__Z(this.$$$2, ComponentWillUpdate$1.$$$2) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.nextProps$2, ComponentWillUpdate$1.nextProps$2)) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.nextState$2, ComponentWillUpdate$1.nextState$2))
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_ComponentWillUpdate.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.$$$2;
      break
    }
    case 1: {
      return this.nextProps$2;
      break
    }
    case 2: {
      return this.nextState$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_ComponentWillUpdate.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_ComponentWillUpdate.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_ComponentWillUpdate.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Ljapgolly_scalajs_react_ComponentWillUpdate(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_ComponentWillUpdate)))
}
function $as_Ljapgolly_scalajs_react_ComponentWillUpdate(obj) {
  return (($is_Ljapgolly_scalajs_react_ComponentWillUpdate(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.ComponentWillUpdate"))
}
function $isArrayOf_Ljapgolly_scalajs_react_ComponentWillUpdate(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_ComponentWillUpdate)))
}
function $asArrayOf_Ljapgolly_scalajs_react_ComponentWillUpdate(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_ComponentWillUpdate(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.ComponentWillUpdate;", depth))
}
var $d_Ljapgolly_scalajs_react_ComponentWillUpdate = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ComponentWillUpdate: 0
}, false, "japgolly.scalajs.react.ComponentWillUpdate", {
  Ljapgolly_scalajs_react_ComponentWillUpdate: 1,
  Ljapgolly_scalajs_react_LifecycleInput: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_ComponentWillUpdate.prototype.$classData = $d_Ljapgolly_scalajs_react_ComponentWillUpdate;
/** @constructor */
function $c_Ljapgolly_scalajs_react_ShouldComponentUpdate() {
  $c_Ljapgolly_scalajs_react_LifecycleInput.call(this);
  this.$$$2 = null;
  this.nextProps$2 = null;
  this.nextState$2 = null
}
$c_Ljapgolly_scalajs_react_ShouldComponentUpdate.prototype = new $h_Ljapgolly_scalajs_react_LifecycleInput();
$c_Ljapgolly_scalajs_react_ShouldComponentUpdate.prototype.constructor = $c_Ljapgolly_scalajs_react_ShouldComponentUpdate;
/** @constructor */
function $h_Ljapgolly_scalajs_react_ShouldComponentUpdate() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_ShouldComponentUpdate.prototype = $c_Ljapgolly_scalajs_react_ShouldComponentUpdate.prototype;
$c_Ljapgolly_scalajs_react_ShouldComponentUpdate.prototype.productPrefix__T = (function() {
  return "ShouldComponentUpdate"
});
$c_Ljapgolly_scalajs_react_ShouldComponentUpdate.prototype.productArity__I = (function() {
  return 3
});
$c_Ljapgolly_scalajs_react_ShouldComponentUpdate.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_ShouldComponentUpdate(x$1)) {
    var ShouldComponentUpdate$1 = $as_Ljapgolly_scalajs_react_ShouldComponentUpdate(x$1);
    return (($m_sr_BoxesRunTime$().equals__O__O__Z(this.$$$2, ShouldComponentUpdate$1.$$$2) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.nextProps$2, ShouldComponentUpdate$1.nextProps$2)) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.nextState$2, ShouldComponentUpdate$1.nextState$2))
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_ShouldComponentUpdate.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.$$$2;
      break
    }
    case 1: {
      return this.nextProps$2;
      break
    }
    case 2: {
      return this.nextState$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_ShouldComponentUpdate.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_ShouldComponentUpdate.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_ShouldComponentUpdate.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Ljapgolly_scalajs_react_ShouldComponentUpdate.prototype.init___Ljapgolly_scalajs_react_CompScope$DuringCallbackM__O__O = (function($$, nextProps, nextState) {
  this.$$$2 = $$;
  this.nextProps$2 = nextProps;
  this.nextState$2 = nextState;
  return this
});
function $is_Ljapgolly_scalajs_react_ShouldComponentUpdate(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_ShouldComponentUpdate)))
}
function $as_Ljapgolly_scalajs_react_ShouldComponentUpdate(obj) {
  return (($is_Ljapgolly_scalajs_react_ShouldComponentUpdate(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.ShouldComponentUpdate"))
}
function $isArrayOf_Ljapgolly_scalajs_react_ShouldComponentUpdate(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_ShouldComponentUpdate)))
}
function $asArrayOf_Ljapgolly_scalajs_react_ShouldComponentUpdate(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_ShouldComponentUpdate(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.ShouldComponentUpdate;", depth))
}
var $d_Ljapgolly_scalajs_react_ShouldComponentUpdate = new $TypeData().initClass({
  Ljapgolly_scalajs_react_ShouldComponentUpdate: 0
}, false, "japgolly.scalajs.react.ShouldComponentUpdate", {
  Ljapgolly_scalajs_react_ShouldComponentUpdate: 1,
  Ljapgolly_scalajs_react_LifecycleInput: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_ShouldComponentUpdate.prototype.$classData = $d_Ljapgolly_scalajs_react_ShouldComponentUpdate;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_AbsUrl() {
  $c_Ljapgolly_scalajs_react_extra_router_PathLike.call(this);
  this.value$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_AbsUrl.prototype = new $h_Ljapgolly_scalajs_react_extra_router_PathLike();
$c_Ljapgolly_scalajs_react_extra_router_AbsUrl.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_AbsUrl;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_AbsUrl() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_AbsUrl.prototype = $c_Ljapgolly_scalajs_react_extra_router_AbsUrl.prototype;
$c_Ljapgolly_scalajs_react_extra_router_AbsUrl.prototype.productPrefix__T = (function() {
  return "AbsUrl"
});
$c_Ljapgolly_scalajs_react_extra_router_AbsUrl.prototype.productArity__I = (function() {
  return 1
});
$c_Ljapgolly_scalajs_react_extra_router_AbsUrl.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_extra_router_AbsUrl(x$1)) {
    var AbsUrl$1 = $as_Ljapgolly_scalajs_react_extra_router_AbsUrl(x$1);
    return (this.value$2 === AbsUrl$1.value$2)
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_extra_router_AbsUrl.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.value$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_AbsUrl.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_extra_router_AbsUrl.prototype.str__Ljapgolly_scalajs_react_extra_router_PathLike__T = (function(s) {
  var s$1 = $as_Ljapgolly_scalajs_react_extra_router_AbsUrl(s);
  return s$1.value$2
});
$c_Ljapgolly_scalajs_react_extra_router_AbsUrl.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_extra_router_AbsUrl.prototype.init___T = (function(value) {
  this.value$2 = value;
  var thiz = this.value$2;
  if ((!($uI(thiz["indexOf"]("://")) !== (-1)))) {
    var jsx$1 = $g["console"];
    var v = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["", " doesn't seem to be a valid URL. It's missing '://'. Consider using AbsUrl.fromWindow."])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([this]));
    jsx$1["warn"](v)
  };
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_AbsUrl.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Ljapgolly_scalajs_react_extra_router_AbsUrl.prototype.make__T__Ljapgolly_scalajs_react_extra_router_PathLike = (function(s) {
  return new $c_Ljapgolly_scalajs_react_extra_router_AbsUrl().init___T(s)
});
function $is_Ljapgolly_scalajs_react_extra_router_AbsUrl(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_AbsUrl)))
}
function $as_Ljapgolly_scalajs_react_extra_router_AbsUrl(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_AbsUrl(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.AbsUrl"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_AbsUrl(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_AbsUrl)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_AbsUrl(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_AbsUrl(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.AbsUrl;", depth))
}
var $d_Ljapgolly_scalajs_react_extra_router_AbsUrl = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_AbsUrl: 0
}, false, "japgolly.scalajs.react.extra.router.AbsUrl", {
  Ljapgolly_scalajs_react_extra_router_AbsUrl: 1,
  Ljapgolly_scalajs_react_extra_router_PathLike: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_AbsUrl.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_AbsUrl;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_BaseUrl() {
  $c_Ljapgolly_scalajs_react_extra_router_PathLike.call(this);
  this.value$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl.prototype = new $h_Ljapgolly_scalajs_react_extra_router_PathLike();
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_BaseUrl;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_BaseUrl() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_BaseUrl.prototype = $c_Ljapgolly_scalajs_react_extra_router_BaseUrl.prototype;
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl.prototype.productPrefix__T = (function() {
  return "BaseUrl"
});
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl.prototype.productArity__I = (function() {
  return 1
});
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_extra_router_BaseUrl(x$1)) {
    var BaseUrl$1 = $as_Ljapgolly_scalajs_react_extra_router_BaseUrl(x$1);
    return (this.value$2 === BaseUrl$1.value$2)
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.value$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl.prototype.str__Ljapgolly_scalajs_react_extra_router_PathLike__T = (function(s) {
  var s$1 = $as_Ljapgolly_scalajs_react_extra_router_BaseUrl(s);
  return s$1.value$2
});
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl.prototype.init___T = (function(value) {
  this.value$2 = value;
  var thiz = this.value$2;
  if ((!($uI(thiz["indexOf"]("://")) !== (-1)))) {
    var jsx$1 = $g["console"];
    var v = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["", " doesn't seem to be a valid URL. It's missing '://'. Consider using BaseUrl.fromWindowOrigin."])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([this]));
    jsx$1["warn"](v)
  };
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl.prototype.apply__Ljapgolly_scalajs_react_extra_router_Path__Ljapgolly_scalajs_react_extra_router_AbsUrl = (function(p) {
  return new $c_Ljapgolly_scalajs_react_extra_router_AbsUrl().init___T((("" + this.value$2) + p.value$2))
});
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl.prototype.make__T__Ljapgolly_scalajs_react_extra_router_PathLike = (function(s) {
  return new $c_Ljapgolly_scalajs_react_extra_router_BaseUrl().init___T(s)
});
function $is_Ljapgolly_scalajs_react_extra_router_BaseUrl(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_BaseUrl)))
}
function $as_Ljapgolly_scalajs_react_extra_router_BaseUrl(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_BaseUrl(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.BaseUrl"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_BaseUrl(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_BaseUrl)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_BaseUrl(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_BaseUrl(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.BaseUrl;", depth))
}
var $d_Ljapgolly_scalajs_react_extra_router_BaseUrl = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_BaseUrl: 0
}, false, "japgolly.scalajs.react.extra.router.BaseUrl", {
  Ljapgolly_scalajs_react_extra_router_BaseUrl: 1,
  Ljapgolly_scalajs_react_extra_router_PathLike: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_BaseUrl.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_BaseUrl;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_Path() {
  $c_Ljapgolly_scalajs_react_extra_router_PathLike.call(this);
  this.value$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_Path.prototype = new $h_Ljapgolly_scalajs_react_extra_router_PathLike();
$c_Ljapgolly_scalajs_react_extra_router_Path.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_Path;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_Path() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_Path.prototype = $c_Ljapgolly_scalajs_react_extra_router_Path.prototype;
$c_Ljapgolly_scalajs_react_extra_router_Path.prototype.productPrefix__T = (function() {
  return "Path"
});
$c_Ljapgolly_scalajs_react_extra_router_Path.prototype.productArity__I = (function() {
  return 1
});
$c_Ljapgolly_scalajs_react_extra_router_Path.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_extra_router_Path(x$1)) {
    var Path$1 = $as_Ljapgolly_scalajs_react_extra_router_Path(x$1);
    return (this.value$2 === Path$1.value$2)
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_extra_router_Path.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.value$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_Path.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_extra_router_Path.prototype.str__Ljapgolly_scalajs_react_extra_router_PathLike__T = (function(s) {
  var s$1 = $as_Ljapgolly_scalajs_react_extra_router_Path(s);
  return s$1.value$2
});
$c_Ljapgolly_scalajs_react_extra_router_Path.prototype.init___T = (function(value) {
  this.value$2 = value;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_Path.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_extra_router_Path.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Ljapgolly_scalajs_react_extra_router_Path.prototype.make__T__Ljapgolly_scalajs_react_extra_router_PathLike = (function(s) {
  return new $c_Ljapgolly_scalajs_react_extra_router_Path().init___T(s)
});
function $is_Ljapgolly_scalajs_react_extra_router_Path(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_Path)))
}
function $as_Ljapgolly_scalajs_react_extra_router_Path(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_Path(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.Path"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_Path(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_Path)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_Path(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_Path(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.Path;", depth))
}
var $d_Ljapgolly_scalajs_react_extra_router_Path = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_Path: 0
}, false, "japgolly.scalajs.react.extra.router.Path", {
  Ljapgolly_scalajs_react_extra_router_Path: 1,
  Ljapgolly_scalajs_react_extra_router_PathLike: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_Path.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_Path;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_Redirect$Push$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Push$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Push$.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_Redirect$Push$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_Redirect$Push$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_Redirect$Push$.prototype = $c_Ljapgolly_scalajs_react_extra_router_Redirect$Push$.prototype;
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Push$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_extra_router_Redirect$Push$ = this;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Push$.prototype.productPrefix__T = (function() {
  return "Push"
});
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Push$.prototype.productArity__I = (function() {
  return 0
});
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Push$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Push$.prototype.toString__T = (function() {
  return "Push"
});
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Push$.prototype.hashCode__I = (function() {
  return 2499386
});
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Push$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_Ljapgolly_scalajs_react_extra_router_Redirect$Push$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_Redirect$Push$: 0
}, false, "japgolly.scalajs.react.extra.router.Redirect$Push$", {
  Ljapgolly_scalajs_react_extra_router_Redirect$Push$: 1,
  O: 1,
  Ljapgolly_scalajs_react_extra_router_Redirect$Method: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Push$.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_Redirect$Push$;
var $n_Ljapgolly_scalajs_react_extra_router_Redirect$Push$ = (void 0);
function $m_Ljapgolly_scalajs_react_extra_router_Redirect$Push$() {
  if ((!$n_Ljapgolly_scalajs_react_extra_router_Redirect$Push$)) {
    $n_Ljapgolly_scalajs_react_extra_router_Redirect$Push$ = new $c_Ljapgolly_scalajs_react_extra_router_Redirect$Push$().init___()
  };
  return $n_Ljapgolly_scalajs_react_extra_router_Redirect$Push$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$.prototype = $c_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$.prototype;
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$ = this;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$.prototype.productPrefix__T = (function() {
  return "Replace"
});
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$.prototype.productArity__I = (function() {
  return 0
});
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$.prototype.toString__T = (function() {
  return "Replace"
});
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$.prototype.hashCode__I = (function() {
  return (-1535817068)
});
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_Redirect$Replace$: 0
}, false, "japgolly.scalajs.react.extra.router.Redirect$Replace$", {
  Ljapgolly_scalajs_react_extra_router_Redirect$Replace$: 1,
  O: 1,
  Ljapgolly_scalajs_react_extra_router_Redirect$Method: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$;
var $n_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$ = (void 0);
function $m_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$() {
  if ((!$n_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$)) {
    $n_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$ = new $c_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$().init___()
  };
  return $n_Ljapgolly_scalajs_react_extra_router_Redirect$Replace$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_Renderer() {
  $c_O.call(this);
  this.f$1 = null
}
$c_Ljapgolly_scalajs_react_extra_router_Renderer.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_Renderer.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_Renderer;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_Renderer() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_Renderer.prototype = $c_Ljapgolly_scalajs_react_extra_router_Renderer.prototype;
$c_Ljapgolly_scalajs_react_extra_router_Renderer.prototype.productPrefix__T = (function() {
  return "Renderer"
});
$c_Ljapgolly_scalajs_react_extra_router_Renderer.prototype.productArity__I = (function() {
  return 1
});
$c_Ljapgolly_scalajs_react_extra_router_Renderer.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_extra_router_Renderer(x$1)) {
    var Renderer$1 = $as_Ljapgolly_scalajs_react_extra_router_Renderer(x$1);
    var x = this.f$1;
    var x$2 = Renderer$1.f$1;
    return ((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_extra_router_Renderer.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.f$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_Renderer.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_extra_router_Renderer.prototype.init___F1 = (function(f) {
  this.f$1 = f;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_Renderer.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_extra_router_Renderer.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Ljapgolly_scalajs_react_extra_router_Renderer(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_Renderer)))
}
function $as_Ljapgolly_scalajs_react_extra_router_Renderer(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_Renderer(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.Renderer"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_Renderer(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_Renderer)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_Renderer(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_Renderer(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.Renderer;", depth))
}
var $d_Ljapgolly_scalajs_react_extra_router_Renderer = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_Renderer: 0
}, false, "japgolly.scalajs.react.extra.router.Renderer", {
  Ljapgolly_scalajs_react_extra_router_Renderer: 1,
  O: 1,
  Ljapgolly_scalajs_react_extra_router_Action: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_Renderer.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_Renderer;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$() {
  $c_Ljapgolly_scalajs_react_extra_router_RouteCmd.call(this)
}
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$.prototype = new $h_Ljapgolly_scalajs_react_extra_router_RouteCmd();
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$ = this;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$.prototype.productPrefix__T = (function() {
  return "BroadcastSync"
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$.prototype.productArity__I = (function() {
  return 0
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$.prototype.toString__T = (function() {
  return "BroadcastSync"
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$.prototype.hashCode__I = (function() {
  return (-155951396)
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$: 0
}, false, "japgolly.scalajs.react.extra.router.RouteCmd$BroadcastSync$", {
  Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$: 1,
  Ljapgolly_scalajs_react_extra_router_RouteCmd: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$;
var $n_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$ = (void 0);
function $m_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$() {
  if ((!$n_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$)) {
    $n_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$ = new $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$().init___()
  };
  return $n_Ljapgolly_scalajs_react_extra_router_RouteCmd$BroadcastSync$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log() {
  $c_Ljapgolly_scalajs_react_extra_router_RouteCmd.call(this);
  this.msg$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log.prototype = new $h_Ljapgolly_scalajs_react_extra_router_RouteCmd();
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log.prototype.init___F0 = (function(msg) {
  this.msg$2 = msg;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log.prototype.productPrefix__T = (function() {
  return "Log"
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log.prototype.productArity__I = (function() {
  return 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log(x$1)) {
    var Log$1 = $as_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log(x$1);
    var x = this.msg$2;
    var x$2 = Log$1.msg$2;
    return (x === x$2)
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.msg$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_RouteCmd$Log)))
}
function $as_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.RouteCmd$Log"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_RouteCmd$Log)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.RouteCmd$Log;", depth))
}
var $d_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouteCmd$Log: 0
}, false, "japgolly.scalajs.react.extra.router.RouteCmd$Log", {
  Ljapgolly_scalajs_react_extra_router_RouteCmd$Log: 1,
  Ljapgolly_scalajs_react_extra_router_RouteCmd: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouteCmd$Log;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState() {
  $c_Ljapgolly_scalajs_react_extra_router_RouteCmd.call(this);
  this.url$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState.prototype = new $h_Ljapgolly_scalajs_react_extra_router_RouteCmd();
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState.prototype.productPrefix__T = (function() {
  return "PushState"
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState.prototype.productArity__I = (function() {
  return 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState(x$1)) {
    var PushState$1 = $as_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState(x$1);
    var x = this.url$2;
    var x$2 = PushState$1.url$2;
    return ((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.url$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState.prototype.init___Ljapgolly_scalajs_react_extra_router_AbsUrl = (function(url) {
  this.url$2 = url;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState)))
}
function $as_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.RouteCmd$PushState"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.RouteCmd$PushState;", depth))
}
var $d_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState: 0
}, false, "japgolly.scalajs.react.extra.router.RouteCmd$PushState", {
  Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState: 1,
  Ljapgolly_scalajs_react_extra_router_RouteCmd: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouteCmd$PushState;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState() {
  $c_Ljapgolly_scalajs_react_extra_router_RouteCmd.call(this);
  this.url$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState.prototype = new $h_Ljapgolly_scalajs_react_extra_router_RouteCmd();
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState.prototype.productPrefix__T = (function() {
  return "ReplaceState"
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState.prototype.productArity__I = (function() {
  return 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState(x$1)) {
    var ReplaceState$1 = $as_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState(x$1);
    var x = this.url$2;
    var x$2 = ReplaceState$1.url$2;
    return ((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.url$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState.prototype.init___Ljapgolly_scalajs_react_extra_router_AbsUrl = (function(url) {
  this.url$2 = url;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState)))
}
function $as_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.RouteCmd$ReplaceState"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.RouteCmd$ReplaceState;", depth))
}
var $d_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState: 0
}, false, "japgolly.scalajs.react.extra.router.RouteCmd$ReplaceState", {
  Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState: 1,
  Ljapgolly_scalajs_react_extra_router_RouteCmd: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouteCmd$ReplaceState;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return() {
  $c_Ljapgolly_scalajs_react_extra_router_RouteCmd.call(this);
  this.a$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return.prototype = new $h_Ljapgolly_scalajs_react_extra_router_RouteCmd();
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return.prototype.productPrefix__T = (function() {
  return "Return"
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return.prototype.productArity__I = (function() {
  return 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return(x$1)) {
    var Return$1 = $as_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return(x$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z(this.a$2, Return$1.a$2)
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.a$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return.prototype.init___O = (function(a) {
  this.a$2 = a;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_RouteCmd$Return)))
}
function $as_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.RouteCmd$Return"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_RouteCmd$Return)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.RouteCmd$Return;", depth))
}
var $d_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouteCmd$Return: 0
}, false, "japgolly.scalajs.react.extra.router.RouteCmd$Return", {
  Ljapgolly_scalajs_react_extra_router_RouteCmd$Return: 1,
  Ljapgolly_scalajs_react_extra_router_RouteCmd: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouteCmd$Return;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence() {
  $c_Ljapgolly_scalajs_react_extra_router_RouteCmd.call(this);
  this.init$2 = null;
  this.last$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence.prototype = new $h_Ljapgolly_scalajs_react_extra_router_RouteCmd();
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence.prototype.productPrefix__T = (function() {
  return "Sequence"
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence.prototype.productArity__I = (function() {
  return 2
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence(x$1)) {
    var Sequence$1 = $as_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence(x$1);
    var x = this.init$2;
    var x$2 = Sequence$1.init$2;
    if (((x === null) ? (x$2 === null) : $s_sc_GenSeqLike$class__equals__sc_GenSeqLike__O__Z(x, x$2))) {
      var x$3 = this.last$2;
      var x$4 = Sequence$1.last$2;
      return ((x$3 === null) ? (x$4 === null) : x$3.equals__O__Z(x$4))
    } else {
      return false
    }
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.init$2;
      break
    }
    case 1: {
      return this.last$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence.prototype.init___sci_Vector__Ljapgolly_scalajs_react_extra_router_RouteCmd = (function(init, last) {
  this.init$2 = init;
  this.last$2 = last;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence)))
}
function $as_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.RouteCmd$Sequence"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.RouteCmd$Sequence;", depth))
}
var $d_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence: 0
}, false, "japgolly.scalajs.react.extra.router.RouteCmd$Sequence", {
  Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence: 1,
  Ljapgolly_scalajs_react_extra_router_RouteCmd: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouteCmd$Sequence;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$1() {
  $c_sr_AbstractPartialFunction.call(this);
  this.page$1$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$1.prototype = new $h_sr_AbstractPartialFunction();
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$1.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$1.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$1.prototype.init___Ljapgolly_scalajs_react_extra_router_RouterConfigDsl__O = (function($$outer, page$1) {
  this.page$1$2 = page$1;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$1.prototype.isDefinedAt__O__Z = (function(x1) {
  return $m_sr_BoxesRunTime$().equals__O__O__Z(this.page$1$2, x1)
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$1.prototype.applyOrElse__O__F1__O = (function(x1, $default) {
  return ($m_sr_BoxesRunTime$().equals__O__O__Z(this.page$1$2, x1) ? x1 : $default.apply__O__O(x1))
});
var $d_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$1: 0
}, false, "japgolly.scalajs.react.extra.router.RouterConfigDsl$$anonfun$1", {
  Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$1: 1,
  sr_AbstractPartialFunction: 1,
  O: 1,
  F1: 1,
  s_PartialFunction: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouterConfigDsl$$anonfun$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap() {
  $c_Ljapgolly_scalajs_react_extra_router_RouterCtl.call(this);
  this.u$2 = null;
  this.f$2 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap.prototype = new $h_Ljapgolly_scalajs_react_extra_router_RouterCtl();
$c_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap.prototype = $c_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap.prototype.productPrefix__T = (function() {
  return "Contramap"
});
$c_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap.prototype.init___Ljapgolly_scalajs_react_extra_router_RouterCtl__F1 = (function(u, f) {
  this.u$2 = u;
  this.f$2 = f;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap.prototype.productArity__I = (function() {
  return 2
});
$c_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap(x$1)) {
    var Contramap$1 = $as_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap(x$1);
    var x = this.u$2;
    var x$2 = Contramap$1.u$2;
    if (((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))) {
      var x$3 = this.f$2;
      var x$4 = Contramap$1.f$2;
      return ((x$3 === null) ? (x$4 === null) : x$3.equals__O__Z(x$4))
    } else {
      return false
    }
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.u$2;
      break
    }
    case 1: {
      return this.f$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap.prototype.refresh__F0 = (function() {
  return this.u$2.refresh__F0()
});
$c_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap)))
}
function $as_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.RouterCtl$Contramap"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.RouterCtl$Contramap;", depth))
}
var $d_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap: 0
}, false, "japgolly.scalajs.react.extra.router.RouterCtl$Contramap", {
  Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap: 1,
  Ljapgolly_scalajs_react_extra_router_RouterCtl: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RouterCtl$Contramap;
/** @constructor */
function $c_Ljava_io_PrintStream() {
  $c_Ljava_io_FilterOutputStream.call(this);
  this.java$io$PrintStream$$autoFlush$f = false;
  this.charset$3 = null;
  this.java$io$PrintStream$$encoder$3 = null;
  this.java$io$PrintStream$$closing$3 = false;
  this.java$io$PrintStream$$closed$3 = false;
  this.errorFlag$3 = false;
  this.bitmap$0$3 = false
}
$c_Ljava_io_PrintStream.prototype = new $h_Ljava_io_FilterOutputStream();
$c_Ljava_io_PrintStream.prototype.constructor = $c_Ljava_io_PrintStream;
/** @constructor */
function $h_Ljava_io_PrintStream() {
  /*<skip>*/
}
$h_Ljava_io_PrintStream.prototype = $c_Ljava_io_PrintStream.prototype;
$c_Ljava_io_PrintStream.prototype.println__O__V = (function(obj) {
  this.print__O__V(obj);
  this.printString__p4__T__V("\n")
});
$c_Ljava_io_PrintStream.prototype.init___Ljava_io_OutputStream__Z__Ljava_nio_charset_Charset = (function(_out, autoFlush, charset) {
  this.java$io$PrintStream$$autoFlush$f = autoFlush;
  this.charset$3 = charset;
  $c_Ljava_io_FilterOutputStream.prototype.init___Ljava_io_OutputStream.call(this, _out);
  this.java$io$PrintStream$$closing$3 = false;
  this.java$io$PrintStream$$closed$3 = false;
  this.errorFlag$3 = false;
  return this
});
$c_Ljava_io_PrintStream.prototype.init___Ljava_io_OutputStream = (function(out) {
  $c_Ljava_io_PrintStream.prototype.init___Ljava_io_OutputStream__Z__Ljava_nio_charset_Charset.call(this, out, false, null);
  return this
});
function $is_Ljava_io_PrintStream(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljava_io_PrintStream)))
}
function $as_Ljava_io_PrintStream(obj) {
  return (($is_Ljava_io_PrintStream(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.io.PrintStream"))
}
function $isArrayOf_Ljava_io_PrintStream(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljava_io_PrintStream)))
}
function $asArrayOf_Ljava_io_PrintStream(obj, depth) {
  return (($isArrayOf_Ljava_io_PrintStream(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.io.PrintStream;", depth))
}
/** @constructor */
function $c_Lscalajsreact_template_routes_AppRouter$Home$() {
  $c_O.call(this)
}
$c_Lscalajsreact_template_routes_AppRouter$Home$.prototype = new $h_O();
$c_Lscalajsreact_template_routes_AppRouter$Home$.prototype.constructor = $c_Lscalajsreact_template_routes_AppRouter$Home$;
/** @constructor */
function $h_Lscalajsreact_template_routes_AppRouter$Home$() {
  /*<skip>*/
}
$h_Lscalajsreact_template_routes_AppRouter$Home$.prototype = $c_Lscalajsreact_template_routes_AppRouter$Home$.prototype;
$c_Lscalajsreact_template_routes_AppRouter$Home$.prototype.init___ = (function() {
  $n_Lscalajsreact_template_routes_AppRouter$Home$ = this;
  return this
});
$c_Lscalajsreact_template_routes_AppRouter$Home$.prototype.productPrefix__T = (function() {
  return "Home"
});
$c_Lscalajsreact_template_routes_AppRouter$Home$.prototype.productArity__I = (function() {
  return 0
});
$c_Lscalajsreact_template_routes_AppRouter$Home$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_Lscalajsreact_template_routes_AppRouter$Home$.prototype.toString__T = (function() {
  return "Home"
});
$c_Lscalajsreact_template_routes_AppRouter$Home$.prototype.hashCode__I = (function() {
  return 2255103
});
$c_Lscalajsreact_template_routes_AppRouter$Home$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_Lscalajsreact_template_routes_AppRouter$Home$ = new $TypeData().initClass({
  Lscalajsreact_template_routes_AppRouter$Home$: 0
}, false, "scalajsreact.template.routes.AppRouter$Home$", {
  Lscalajsreact_template_routes_AppRouter$Home$: 1,
  O: 1,
  Lscalajsreact_template_routes_AppRouter$AppPage: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lscalajsreact_template_routes_AppRouter$Home$.prototype.$classData = $d_Lscalajsreact_template_routes_AppRouter$Home$;
var $n_Lscalajsreact_template_routes_AppRouter$Home$ = (void 0);
function $m_Lscalajsreact_template_routes_AppRouter$Home$() {
  if ((!$n_Lscalajsreact_template_routes_AppRouter$Home$)) {
    $n_Lscalajsreact_template_routes_AppRouter$Home$ = new $c_Lscalajsreact_template_routes_AppRouter$Home$().init___()
  };
  return $n_Lscalajsreact_template_routes_AppRouter$Home$
}
/** @constructor */
function $c_T2() {
  $c_O.call(this);
  this.$$und1$f = null;
  this.$$und2$f = null
}
$c_T2.prototype = new $h_O();
$c_T2.prototype.constructor = $c_T2;
/** @constructor */
function $h_T2() {
  /*<skip>*/
}
$h_T2.prototype = $c_T2.prototype;
$c_T2.prototype.productPrefix__T = (function() {
  return "Tuple2"
});
$c_T2.prototype.productArity__I = (function() {
  return 2
});
$c_T2.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_T2(x$1)) {
    var Tuple2$1 = $as_T2(x$1);
    return ($m_sr_BoxesRunTime$().equals__O__O__Z(this.$$und1$f, Tuple2$1.$$und1$f) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.$$und2$f, Tuple2$1.$$und2$f))
  } else {
    return false
  }
});
$c_T2.prototype.init___O__O = (function(_1, _2) {
  this.$$und1$f = _1;
  this.$$und2$f = _2;
  return this
});
$c_T2.prototype.productElement__I__O = (function(n) {
  return $s_s_Product2$class__productElement__s_Product2__I__O(this, n)
});
$c_T2.prototype.toString__T = (function() {
  return (((("(" + this.$$und1$f) + ",") + this.$$und2$f) + ")")
});
$c_T2.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_T2.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_T2(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.T2)))
}
function $as_T2(obj) {
  return (($is_T2(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Tuple2"))
}
function $isArrayOf_T2(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.T2)))
}
function $asArrayOf_T2(obj, depth) {
  return (($isArrayOf_T2(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Tuple2;", depth))
}
var $d_T2 = new $TypeData().initClass({
  T2: 0
}, false, "scala.Tuple2", {
  T2: 1,
  O: 1,
  s_Product2: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_T2.prototype.$classData = $d_T2;
/** @constructor */
function $c_jl_NumberFormatException() {
  $c_jl_IllegalArgumentException.call(this)
}
$c_jl_NumberFormatException.prototype = new $h_jl_IllegalArgumentException();
$c_jl_NumberFormatException.prototype.constructor = $c_jl_NumberFormatException;
/** @constructor */
function $h_jl_NumberFormatException() {
  /*<skip>*/
}
$h_jl_NumberFormatException.prototype = $c_jl_NumberFormatException.prototype;
function $is_jl_NumberFormatException(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_NumberFormatException)))
}
function $as_jl_NumberFormatException(obj) {
  return (($is_jl_NumberFormatException(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.NumberFormatException"))
}
function $isArrayOf_jl_NumberFormatException(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_NumberFormatException)))
}
function $asArrayOf_jl_NumberFormatException(obj, depth) {
  return (($isArrayOf_jl_NumberFormatException(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.NumberFormatException;", depth))
}
var $d_jl_NumberFormatException = new $TypeData().initClass({
  jl_NumberFormatException: 0
}, false, "java.lang.NumberFormatException", {
  jl_NumberFormatException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_NumberFormatException.prototype.$classData = $d_jl_NumberFormatException;
/** @constructor */
function $c_s_None$() {
  $c_s_Option.call(this)
}
$c_s_None$.prototype = new $h_s_Option();
$c_s_None$.prototype.constructor = $c_s_None$;
/** @constructor */
function $h_s_None$() {
  /*<skip>*/
}
$h_s_None$.prototype = $c_s_None$.prototype;
$c_s_None$.prototype.productPrefix__T = (function() {
  return "None"
});
$c_s_None$.prototype.productArity__I = (function() {
  return 0
});
$c_s_None$.prototype.isEmpty__Z = (function() {
  return true
});
$c_s_None$.prototype.get__O = (function() {
  this.get__sr_Nothing$()
});
$c_s_None$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_s_None$.prototype.toString__T = (function() {
  return "None"
});
$c_s_None$.prototype.get__sr_Nothing$ = (function() {
  throw new $c_ju_NoSuchElementException().init___T("None.get")
});
$c_s_None$.prototype.hashCode__I = (function() {
  return 2433880
});
$c_s_None$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_s_None$ = new $TypeData().initClass({
  s_None$: 0
}, false, "scala.None$", {
  s_None$: 1,
  s_Option: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_None$.prototype.$classData = $d_s_None$;
var $n_s_None$ = (void 0);
function $m_s_None$() {
  if ((!$n_s_None$)) {
    $n_s_None$ = new $c_s_None$().init___()
  };
  return $n_s_None$
}
/** @constructor */
function $c_s_PartialFunction$$anonfun$4() {
  $c_sr_AbstractPartialFunction.call(this)
}
$c_s_PartialFunction$$anonfun$4.prototype = new $h_sr_AbstractPartialFunction();
$c_s_PartialFunction$$anonfun$4.prototype.constructor = $c_s_PartialFunction$$anonfun$4;
/** @constructor */
function $h_s_PartialFunction$$anonfun$4() {
  /*<skip>*/
}
$h_s_PartialFunction$$anonfun$4.prototype = $c_s_PartialFunction$$anonfun$4.prototype;
$c_s_PartialFunction$$anonfun$4.prototype.isDefinedAt__O__Z = (function(x1) {
  return true
});
$c_s_PartialFunction$$anonfun$4.prototype.applyOrElse__O__F1__O = (function(x1, $default) {
  return $m_s_PartialFunction$().scala$PartialFunction$$fallback$undpf$f
});
var $d_s_PartialFunction$$anonfun$4 = new $TypeData().initClass({
  s_PartialFunction$$anonfun$4: 0
}, false, "scala.PartialFunction$$anonfun$4", {
  s_PartialFunction$$anonfun$4: 1,
  sr_AbstractPartialFunction: 1,
  O: 1,
  F1: 1,
  s_PartialFunction: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_PartialFunction$$anonfun$4.prototype.$classData = $d_s_PartialFunction$$anonfun$4;
/** @constructor */
function $c_s_Some() {
  $c_s_Option.call(this);
  this.x$2 = null
}
$c_s_Some.prototype = new $h_s_Option();
$c_s_Some.prototype.constructor = $c_s_Some;
/** @constructor */
function $h_s_Some() {
  /*<skip>*/
}
$h_s_Some.prototype = $c_s_Some.prototype;
$c_s_Some.prototype.productPrefix__T = (function() {
  return "Some"
});
$c_s_Some.prototype.productArity__I = (function() {
  return 1
});
$c_s_Some.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_s_Some(x$1)) {
    var Some$1 = $as_s_Some(x$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z(this.x$2, Some$1.x$2)
  } else {
    return false
  }
});
$c_s_Some.prototype.isEmpty__Z = (function() {
  return false
});
$c_s_Some.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.x$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_s_Some.prototype.get__O = (function() {
  return this.x$2
});
$c_s_Some.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_s_Some.prototype.init___O = (function(x) {
  this.x$2 = x;
  return this
});
$c_s_Some.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_s_Some.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_s_Some(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_Some)))
}
function $as_s_Some(obj) {
  return (($is_s_Some(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Some"))
}
function $isArrayOf_s_Some(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_Some)))
}
function $asArrayOf_s_Some(obj, depth) {
  return (($isArrayOf_s_Some(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Some;", depth))
}
var $d_s_Some = new $TypeData().initClass({
  s_Some: 0
}, false, "scala.Some", {
  s_Some: 1,
  s_Option: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Some.prototype.$classData = $d_s_Some;
/** @constructor */
function $c_s_StringContext$InvalidEscapeException() {
  $c_jl_IllegalArgumentException.call(this);
  this.index$5 = 0
}
$c_s_StringContext$InvalidEscapeException.prototype = new $h_jl_IllegalArgumentException();
$c_s_StringContext$InvalidEscapeException.prototype.constructor = $c_s_StringContext$InvalidEscapeException;
/** @constructor */
function $h_s_StringContext$InvalidEscapeException() {
  /*<skip>*/
}
$h_s_StringContext$InvalidEscapeException.prototype = $c_s_StringContext$InvalidEscapeException.prototype;
$c_s_StringContext$InvalidEscapeException.prototype.init___T__I = (function(str, index) {
  this.index$5 = index;
  var jsx$3 = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["invalid escape ", " index ", " in \"", "\". Use \\\\\\\\ for literal \\\\."]));
  $m_s_Predef$().require__Z__V(((index >= 0) && (index < $uI(str["length"]))));
  if ((index === (((-1) + $uI(str["length"])) | 0))) {
    var jsx$1 = "at terminal"
  } else {
    var jsx$2 = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["'\\\\", "' not one of ", " at"]));
    var index$1 = ((1 + index) | 0);
    var c = (65535 & $uI(str["charCodeAt"](index$1)));
    var jsx$1 = jsx$2.s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([new $c_jl_Character().init___C(c), "[\\b, \\t, \\n, \\f, \\r, \\\\, \\\", \\']"]))
  };
  $c_jl_IllegalArgumentException.prototype.init___T.call(this, jsx$3.s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([jsx$1, index, str])));
  return this
});
var $d_s_StringContext$InvalidEscapeException = new $TypeData().initClass({
  s_StringContext$InvalidEscapeException: 0
}, false, "scala.StringContext$InvalidEscapeException", {
  s_StringContext$InvalidEscapeException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_s_StringContext$InvalidEscapeException.prototype.$classData = $d_s_StringContext$InvalidEscapeException;
/** @constructor */
function $c_s_util_Left() {
  $c_s_util_Either.call(this);
  this.a$2 = null
}
$c_s_util_Left.prototype = new $h_s_util_Either();
$c_s_util_Left.prototype.constructor = $c_s_util_Left;
/** @constructor */
function $h_s_util_Left() {
  /*<skip>*/
}
$h_s_util_Left.prototype = $c_s_util_Left.prototype;
$c_s_util_Left.prototype.productPrefix__T = (function() {
  return "Left"
});
$c_s_util_Left.prototype.productArity__I = (function() {
  return 1
});
$c_s_util_Left.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_s_util_Left(x$1)) {
    var Left$1 = $as_s_util_Left(x$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z(this.a$2, Left$1.a$2)
  } else {
    return false
  }
});
$c_s_util_Left.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.a$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_s_util_Left.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_s_util_Left.prototype.init___O = (function(a) {
  this.a$2 = a;
  return this
});
$c_s_util_Left.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_s_util_Left.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_s_util_Left(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_util_Left)))
}
function $as_s_util_Left(obj) {
  return (($is_s_util_Left(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.util.Left"))
}
function $isArrayOf_s_util_Left(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_util_Left)))
}
function $asArrayOf_s_util_Left(obj, depth) {
  return (($isArrayOf_s_util_Left(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.util.Left;", depth))
}
var $d_s_util_Left = new $TypeData().initClass({
  s_util_Left: 0
}, false, "scala.util.Left", {
  s_util_Left: 1,
  s_util_Either: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_Left.prototype.$classData = $d_s_util_Left;
/** @constructor */
function $c_s_util_Right() {
  $c_s_util_Either.call(this);
  this.b$2 = null
}
$c_s_util_Right.prototype = new $h_s_util_Either();
$c_s_util_Right.prototype.constructor = $c_s_util_Right;
/** @constructor */
function $h_s_util_Right() {
  /*<skip>*/
}
$h_s_util_Right.prototype = $c_s_util_Right.prototype;
$c_s_util_Right.prototype.productPrefix__T = (function() {
  return "Right"
});
$c_s_util_Right.prototype.productArity__I = (function() {
  return 1
});
$c_s_util_Right.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_s_util_Right(x$1)) {
    var Right$1 = $as_s_util_Right(x$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z(this.b$2, Right$1.b$2)
  } else {
    return false
  }
});
$c_s_util_Right.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.b$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_s_util_Right.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_s_util_Right.prototype.init___O = (function(b) {
  this.b$2 = b;
  return this
});
$c_s_util_Right.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_s_util_Right.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_s_util_Right(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_util_Right)))
}
function $as_s_util_Right(obj) {
  return (($is_s_util_Right(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.util.Right"))
}
function $isArrayOf_s_util_Right(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_util_Right)))
}
function $asArrayOf_s_util_Right(obj, depth) {
  return (($isArrayOf_s_util_Right(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.util.Right;", depth))
}
var $d_s_util_Right = new $TypeData().initClass({
  s_util_Right: 0
}, false, "scala.util.Right", {
  s_util_Right: 1,
  s_util_Either: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_Right.prototype.$classData = $d_s_util_Right;
/** @constructor */
function $c_scg_SeqFactory() {
  $c_scg_GenSeqFactory.call(this)
}
$c_scg_SeqFactory.prototype = new $h_scg_GenSeqFactory();
$c_scg_SeqFactory.prototype.constructor = $c_scg_SeqFactory;
/** @constructor */
function $h_scg_SeqFactory() {
  /*<skip>*/
}
$h_scg_SeqFactory.prototype = $c_scg_SeqFactory.prototype;
/** @constructor */
function $c_sci_HashSet$HashTrieSet$$anon$1() {
  $c_sci_TrieIterator.call(this)
}
$c_sci_HashSet$HashTrieSet$$anon$1.prototype = new $h_sci_TrieIterator();
$c_sci_HashSet$HashTrieSet$$anon$1.prototype.constructor = $c_sci_HashSet$HashTrieSet$$anon$1;
/** @constructor */
function $h_sci_HashSet$HashTrieSet$$anon$1() {
  /*<skip>*/
}
$h_sci_HashSet$HashTrieSet$$anon$1.prototype = $c_sci_HashSet$HashTrieSet$$anon$1.prototype;
$c_sci_HashSet$HashTrieSet$$anon$1.prototype.init___sci_HashSet$HashTrieSet = (function($$outer) {
  $c_sci_TrieIterator.prototype.init___Asci_Iterable.call(this, $$outer.elems$5);
  return this
});
var $d_sci_HashSet$HashTrieSet$$anon$1 = new $TypeData().initClass({
  sci_HashSet$HashTrieSet$$anon$1: 0
}, false, "scala.collection.immutable.HashSet$HashTrieSet$$anon$1", {
  sci_HashSet$HashTrieSet$$anon$1: 1,
  sci_TrieIterator: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sci_HashSet$HashTrieSet$$anon$1.prototype.$classData = $d_sci_HashSet$HashTrieSet$$anon$1;
/** @constructor */
function $c_sci_Set$() {
  $c_scg_ImmutableSetFactory.call(this)
}
$c_sci_Set$.prototype = new $h_scg_ImmutableSetFactory();
$c_sci_Set$.prototype.constructor = $c_sci_Set$;
/** @constructor */
function $h_sci_Set$() {
  /*<skip>*/
}
$h_sci_Set$.prototype = $c_sci_Set$.prototype;
$c_sci_Set$.prototype.emptyInstance__sci_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
var $d_sci_Set$ = new $TypeData().initClass({
  sci_Set$: 0
}, false, "scala.collection.immutable.Set$", {
  sci_Set$: 1,
  scg_ImmutableSetFactory: 1,
  scg_SetFactory: 1,
  scg_GenSetFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_Set$.prototype.$classData = $d_sci_Set$;
var $n_sci_Set$ = (void 0);
function $m_sci_Set$() {
  if ((!$n_sci_Set$)) {
    $n_sci_Set$ = new $c_sci_Set$().init___()
  };
  return $n_sci_Set$
}
/** @constructor */
function $c_sci_VectorIterator() {
  $c_sc_AbstractIterator.call(this);
  this.endIndex$2 = 0;
  this.blockIndex$2 = 0;
  this.lo$2 = 0;
  this.endLo$2 = 0;
  this.$$undhasNext$2 = false;
  this.depth$2 = 0;
  this.display0$2 = null;
  this.display1$2 = null;
  this.display2$2 = null;
  this.display3$2 = null;
  this.display4$2 = null;
  this.display5$2 = null
}
$c_sci_VectorIterator.prototype = new $h_sc_AbstractIterator();
$c_sci_VectorIterator.prototype.constructor = $c_sci_VectorIterator;
/** @constructor */
function $h_sci_VectorIterator() {
  /*<skip>*/
}
$h_sci_VectorIterator.prototype = $c_sci_VectorIterator.prototype;
$c_sci_VectorIterator.prototype.next__O = (function() {
  if ((!this.$$undhasNext$2)) {
    throw new $c_ju_NoSuchElementException().init___T("reached iterator end")
  };
  var res = this.display0$2.u[this.lo$2];
  this.lo$2 = ((1 + this.lo$2) | 0);
  if ((this.lo$2 === this.endLo$2)) {
    if ((((this.blockIndex$2 + this.lo$2) | 0) < this.endIndex$2)) {
      var newBlockIndex = ((32 + this.blockIndex$2) | 0);
      var xor = (this.blockIndex$2 ^ newBlockIndex);
      $s_sci_VectorPointer$class__gotoNextBlockStart__sci_VectorPointer__I__I__V(this, newBlockIndex, xor);
      this.blockIndex$2 = newBlockIndex;
      var x = ((this.endIndex$2 - this.blockIndex$2) | 0);
      this.endLo$2 = ((x < 32) ? x : 32);
      this.lo$2 = 0
    } else {
      this.$$undhasNext$2 = false
    }
  };
  return res
});
$c_sci_VectorIterator.prototype.display3__AO = (function() {
  return this.display3$2
});
$c_sci_VectorIterator.prototype.depth__I = (function() {
  return this.depth$2
});
$c_sci_VectorIterator.prototype.display5$und$eq__AO__V = (function(x$1) {
  this.display5$2 = x$1
});
$c_sci_VectorIterator.prototype.init___I__I = (function(_startIndex, endIndex) {
  this.endIndex$2 = endIndex;
  this.blockIndex$2 = ((-32) & _startIndex);
  this.lo$2 = (31 & _startIndex);
  var x = ((endIndex - this.blockIndex$2) | 0);
  this.endLo$2 = ((x < 32) ? x : 32);
  this.$$undhasNext$2 = (((this.blockIndex$2 + this.lo$2) | 0) < endIndex);
  return this
});
$c_sci_VectorIterator.prototype.display0__AO = (function() {
  return this.display0$2
});
$c_sci_VectorIterator.prototype.display4__AO = (function() {
  return this.display4$2
});
$c_sci_VectorIterator.prototype.display2$und$eq__AO__V = (function(x$1) {
  this.display2$2 = x$1
});
$c_sci_VectorIterator.prototype.display1$und$eq__AO__V = (function(x$1) {
  this.display1$2 = x$1
});
$c_sci_VectorIterator.prototype.hasNext__Z = (function() {
  return this.$$undhasNext$2
});
$c_sci_VectorIterator.prototype.display4$und$eq__AO__V = (function(x$1) {
  this.display4$2 = x$1
});
$c_sci_VectorIterator.prototype.display1__AO = (function() {
  return this.display1$2
});
$c_sci_VectorIterator.prototype.display5__AO = (function() {
  return this.display5$2
});
$c_sci_VectorIterator.prototype.depth$und$eq__I__V = (function(x$1) {
  this.depth$2 = x$1
});
$c_sci_VectorIterator.prototype.display2__AO = (function() {
  return this.display2$2
});
$c_sci_VectorIterator.prototype.display0$und$eq__AO__V = (function(x$1) {
  this.display0$2 = x$1
});
$c_sci_VectorIterator.prototype.display3$und$eq__AO__V = (function(x$1) {
  this.display3$2 = x$1
});
var $d_sci_VectorIterator = new $TypeData().initClass({
  sci_VectorIterator: 0
}, false, "scala.collection.immutable.VectorIterator", {
  sci_VectorIterator: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sci_VectorPointer: 1
});
$c_sci_VectorIterator.prototype.$classData = $d_sci_VectorIterator;
/** @constructor */
function $c_sjsr_UndefinedBehaviorError() {
  $c_jl_Error.call(this)
}
$c_sjsr_UndefinedBehaviorError.prototype = new $h_jl_Error();
$c_sjsr_UndefinedBehaviorError.prototype.constructor = $c_sjsr_UndefinedBehaviorError;
/** @constructor */
function $h_sjsr_UndefinedBehaviorError() {
  /*<skip>*/
}
$h_sjsr_UndefinedBehaviorError.prototype = $c_sjsr_UndefinedBehaviorError.prototype;
$c_sjsr_UndefinedBehaviorError.prototype.fillInStackTrace__jl_Throwable = (function() {
  return $c_jl_Throwable.prototype.fillInStackTrace__jl_Throwable.call(this)
});
$c_sjsr_UndefinedBehaviorError.prototype.scala$util$control$NoStackTrace$$super$fillInStackTrace__jl_Throwable = (function() {
  return $c_jl_Throwable.prototype.fillInStackTrace__jl_Throwable.call(this)
});
$c_sjsr_UndefinedBehaviorError.prototype.init___jl_Throwable = (function(cause) {
  $c_sjsr_UndefinedBehaviorError.prototype.init___T__jl_Throwable.call(this, ("An undefined behavior was detected" + ((cause === null) ? "" : (": " + cause.getMessage__T()))), cause);
  return this
});
$c_sjsr_UndefinedBehaviorError.prototype.init___T__jl_Throwable = (function(message, cause) {
  $c_jl_Error.prototype.init___T__jl_Throwable.call(this, message, cause);
  return this
});
var $d_sjsr_UndefinedBehaviorError = new $TypeData().initClass({
  sjsr_UndefinedBehaviorError: 0
}, false, "scala.scalajs.runtime.UndefinedBehaviorError", {
  sjsr_UndefinedBehaviorError: 1,
  jl_Error: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  s_util_control_ControlThrowable: 1,
  s_util_control_NoStackTrace: 1
});
$c_sjsr_UndefinedBehaviorError.prototype.$classData = $d_sjsr_UndefinedBehaviorError;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$broadcast$1() {
  $c_sr_AbstractFunction0$mcV$sp.call(this);
  this.$$outer$3 = null;
  this.a$1$f = null
}
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$broadcast$1.prototype = new $h_sr_AbstractFunction0$mcV$sp();
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$broadcast$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$broadcast$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$broadcast$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$broadcast$1.prototype = $c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$broadcast$1.prototype;
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$broadcast$1.prototype.init___Ljapgolly_scalajs_react_extra_Broadcaster__O = (function($$outer, a$1) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$3 = $$outer
  };
  this.a$1$f = a$1;
  return this
});
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$broadcast$1.prototype.apply$mcV$sp__V = (function() {
  var this$1 = this.$$outer$3;
  var this$2 = this$1.japgolly$scalajs$react$extra$Broadcaster$$$undlisteners$1;
  var these = this$2;
  while ((!these.isEmpty__Z())) {
    var arg1 = these.head__O();
    var x$2 = $as_F1(arg1);
    var $$this = $as_Ljapgolly_scalajs_react_CallbackTo(x$2.apply__O__O(this.a$1$f)).japgolly$scalajs$react$CallbackTo$$f$1;
    $$this.apply__O();
    var this$4 = these;
    these = this$4.tail__sci_List()
  }
});
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$broadcast$1.prototype.apply__O = (function() {
  this.apply$mcV$sp__V()
});
var $d_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$broadcast$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$broadcast$1: 0
}, false, "japgolly.scalajs.react.extra.Broadcaster$$anonfun$broadcast$1", {
  Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$broadcast$1: 1,
  sr_AbstractFunction0$mcV$sp: 1,
  sr_AbstractFunction0: 1,
  O: 1,
  F0: 1,
  s_Function0$mcV$sp: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$broadcast$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$broadcast$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1$$anonfun$apply$1() {
  $c_sr_AbstractFunction0$mcV$sp.call(this);
  this.$$outer$3 = null
}
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1$$anonfun$apply$1.prototype = new $h_sr_AbstractFunction0$mcV$sp();
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1$$anonfun$apply$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1$$anonfun$apply$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1$$anonfun$apply$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1$$anonfun$apply$1.prototype = $c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1$$anonfun$apply$1.prototype;
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1$$anonfun$apply$1.prototype.init___Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1 = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$3 = $$outer
  };
  return this
});
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1$$anonfun$apply$1.prototype.apply$mcV$sp__V = (function() {
  var jsx$1 = this.$$outer$3.$$outer$2;
  var this$1 = this.$$outer$3.$$outer$2.japgolly$scalajs$react$extra$Broadcaster$$$undlisteners$1;
  $m_sci_List$();
  var b = new $c_scm_ListBuffer().init___();
  var these = this$1;
  while ((!these.isEmpty__Z())) {
    var arg1 = these.head__O();
    var x$1 = $as_F1(arg1);
    if ((x$1 !== this.$$outer$3.f$1$f)) {
      b.$$plus$eq__O__scm_ListBuffer(arg1)
    };
    var this$3 = these;
    these = this$3.tail__sci_List()
  };
  jsx$1.japgolly$scalajs$react$extra$Broadcaster$$$undlisteners$1 = b.toList__sci_List()
});
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1$$anonfun$apply$1.prototype.apply__O = (function() {
  this.apply$mcV$sp__V()
});
var $d_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1$$anonfun$apply$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1$$anonfun$apply$1: 0
}, false, "japgolly.scalajs.react.extra.Broadcaster$$anonfun$register$1$$anonfun$apply$1", {
  Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1$$anonfun$apply$1: 1,
  sr_AbstractFunction0$mcV$sp: 1,
  sr_AbstractFunction0: 1,
  O: 1,
  F0: 1,
  s_Function0$mcV$sp: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1$$anonfun$apply$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_Broadcaster$$anonfun$register$1$$anonfun$apply$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$unmount$1() {
  $c_sr_AbstractFunction0$mcV$sp.call(this);
  this.$$outer$3 = null
}
$c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$unmount$1.prototype = new $h_sr_AbstractFunction0$mcV$sp();
$c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$unmount$1.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$unmount$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$unmount$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$unmount$1.prototype = $c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$unmount$1.prototype;
$c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$unmount$1.prototype.init___Ljapgolly_scalajs_react_extra_OnUnmount = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$3 = $$outer
  };
  return this
});
$c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$unmount$1.prototype.apply$mcV$sp__V = (function() {
  var this$1 = this.$$outer$3.japgolly$scalajs$react$extra$OnUnmount$$unmountProcs$1;
  var these = this$1;
  while ((!these.isEmpty__Z())) {
    var arg1 = these.head__O();
    var x$1 = $as_Ljapgolly_scalajs_react_CallbackTo(arg1).japgolly$scalajs$react$CallbackTo$$f$1;
    x$1.apply__O();
    var this$3 = these;
    these = this$3.tail__sci_List()
  };
  this.$$outer$3.japgolly$scalajs$react$extra$OnUnmount$$unmountProcs$1 = $m_sci_Nil$()
});
$c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$unmount$1.prototype.apply__O = (function() {
  this.apply$mcV$sp__V()
});
var $d_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$unmount$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$unmount$1: 0
}, false, "japgolly.scalajs.react.extra.OnUnmount$$anonfun$unmount$1", {
  Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$unmount$1: 1,
  sr_AbstractFunction0$mcV$sp: 1,
  sr_AbstractFunction0: 1,
  O: 1,
  F0: 1,
  s_Function0$mcV$sp: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$unmount$1.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_OnUnmount$$anonfun$unmount$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RedirectToPage() {
  $c_O.call(this);
  this.page$1 = null;
  this.method$1 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPage.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPage.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RedirectToPage;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RedirectToPage() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RedirectToPage.prototype = $c_Ljapgolly_scalajs_react_extra_router_RedirectToPage.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPage.prototype.productPrefix__T = (function() {
  return "RedirectToPage"
});
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPage.prototype.productArity__I = (function() {
  return 2
});
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPage.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_extra_router_RedirectToPage(x$1)) {
    var RedirectToPage$1 = $as_Ljapgolly_scalajs_react_extra_router_RedirectToPage(x$1);
    if ($m_sr_BoxesRunTime$().equals__O__O__Z(this.page$1, RedirectToPage$1.page$1)) {
      var x = this.method$1;
      var x$2 = RedirectToPage$1.method$1;
      return (x === x$2)
    } else {
      return false
    }
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPage.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.page$1;
      break
    }
    case 1: {
      return this.method$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPage.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPage.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPage.prototype.init___O__Ljapgolly_scalajs_react_extra_router_Redirect$Method = (function(page, method) {
  this.page$1 = page;
  this.method$1 = method;
  return this
});
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPage.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Ljapgolly_scalajs_react_extra_router_RedirectToPage(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_RedirectToPage)))
}
function $as_Ljapgolly_scalajs_react_extra_router_RedirectToPage(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_RedirectToPage(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.RedirectToPage"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_RedirectToPage(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_RedirectToPage)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_RedirectToPage(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_RedirectToPage(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.RedirectToPage;", depth))
}
var $d_Ljapgolly_scalajs_react_extra_router_RedirectToPage = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RedirectToPage: 0
}, false, "japgolly.scalajs.react.extra.router.RedirectToPage", {
  Ljapgolly_scalajs_react_extra_router_RedirectToPage: 1,
  O: 1,
  Ljapgolly_scalajs_react_extra_router_Redirect: 1,
  Ljapgolly_scalajs_react_extra_router_Action: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPage.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RedirectToPage;
/** @constructor */
function $c_Ljapgolly_scalajs_react_extra_router_RedirectToPath() {
  $c_O.call(this);
  this.path$1 = null;
  this.method$1 = null
}
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPath.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPath.prototype.constructor = $c_Ljapgolly_scalajs_react_extra_router_RedirectToPath;
/** @constructor */
function $h_Ljapgolly_scalajs_react_extra_router_RedirectToPath() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_extra_router_RedirectToPath.prototype = $c_Ljapgolly_scalajs_react_extra_router_RedirectToPath.prototype;
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPath.prototype.productPrefix__T = (function() {
  return "RedirectToPath"
});
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPath.prototype.productArity__I = (function() {
  return 2
});
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPath.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_extra_router_RedirectToPath(x$1)) {
    var RedirectToPath$1 = $as_Ljapgolly_scalajs_react_extra_router_RedirectToPath(x$1);
    var x = this.path$1;
    var x$2 = RedirectToPath$1.path$1;
    if (((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))) {
      var x$3 = this.method$1;
      var x$4 = RedirectToPath$1.method$1;
      return (x$3 === x$4)
    } else {
      return false
    }
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPath.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.path$1;
      break
    }
    case 1: {
      return this.method$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPath.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPath.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPath.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPath.prototype.init___Ljapgolly_scalajs_react_extra_router_Path__Ljapgolly_scalajs_react_extra_router_Redirect$Method = (function(path, method) {
  this.path$1 = path;
  this.method$1 = method;
  return this
});
function $is_Ljapgolly_scalajs_react_extra_router_RedirectToPath(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_extra_router_RedirectToPath)))
}
function $as_Ljapgolly_scalajs_react_extra_router_RedirectToPath(obj) {
  return (($is_Ljapgolly_scalajs_react_extra_router_RedirectToPath(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.extra.router.RedirectToPath"))
}
function $isArrayOf_Ljapgolly_scalajs_react_extra_router_RedirectToPath(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_extra_router_RedirectToPath)))
}
function $asArrayOf_Ljapgolly_scalajs_react_extra_router_RedirectToPath(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_extra_router_RedirectToPath(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.extra.router.RedirectToPath;", depth))
}
var $d_Ljapgolly_scalajs_react_extra_router_RedirectToPath = new $TypeData().initClass({
  Ljapgolly_scalajs_react_extra_router_RedirectToPath: 0
}, false, "japgolly.scalajs.react.extra.router.RedirectToPath", {
  Ljapgolly_scalajs_react_extra_router_RedirectToPath: 1,
  O: 1,
  Ljapgolly_scalajs_react_extra_router_Redirect: 1,
  Ljapgolly_scalajs_react_extra_router_Action: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_extra_router_RedirectToPath.prototype.$classData = $d_Ljapgolly_scalajs_react_extra_router_RedirectToPath;
/** @constructor */
function $c_jl_JSConsoleBasedPrintStream() {
  $c_Ljava_io_PrintStream.call(this);
  this.isErr$4 = null;
  this.flushed$4 = false;
  this.buffer$4 = null
}
$c_jl_JSConsoleBasedPrintStream.prototype = new $h_Ljava_io_PrintStream();
$c_jl_JSConsoleBasedPrintStream.prototype.constructor = $c_jl_JSConsoleBasedPrintStream;
/** @constructor */
function $h_jl_JSConsoleBasedPrintStream() {
  /*<skip>*/
}
$h_jl_JSConsoleBasedPrintStream.prototype = $c_jl_JSConsoleBasedPrintStream.prototype;
$c_jl_JSConsoleBasedPrintStream.prototype.init___jl_Boolean = (function(isErr) {
  this.isErr$4 = isErr;
  $c_Ljava_io_PrintStream.prototype.init___Ljava_io_OutputStream.call(this, new $c_jl_JSConsoleBasedPrintStream$DummyOutputStream().init___());
  this.flushed$4 = true;
  this.buffer$4 = "";
  return this
});
$c_jl_JSConsoleBasedPrintStream.prototype.doWriteLine__p4__T__V = (function(line) {
  var x = $g["console"];
  if ($uZ((!(!x)))) {
    var x$1 = this.isErr$4;
    if ($uZ(x$1)) {
      var x$2 = $g["console"]["error"];
      var jsx$1 = $uZ((!(!x$2)))
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      $g["console"]["error"](line)
    } else {
      $g["console"]["log"](line)
    }
  }
});
$c_jl_JSConsoleBasedPrintStream.prototype.print__O__V = (function(obj) {
  this.printString__p4__T__V($m_sjsr_RuntimeString$().valueOf__O__T(obj))
});
$c_jl_JSConsoleBasedPrintStream.prototype.printString__p4__T__V = (function(s) {
  var rest = s;
  while ((rest !== "")) {
    var thiz = rest;
    var nlPos = $uI(thiz["indexOf"]("\n"));
    if ((nlPos < 0)) {
      this.buffer$4 = (("" + this.buffer$4) + rest);
      this.flushed$4 = false;
      rest = ""
    } else {
      var jsx$1 = this.buffer$4;
      var thiz$1 = rest;
      this.doWriteLine__p4__T__V((("" + jsx$1) + $as_T(thiz$1["substring"](0, nlPos))));
      this.buffer$4 = "";
      this.flushed$4 = true;
      var thiz$2 = rest;
      var beginIndex = ((1 + nlPos) | 0);
      rest = $as_T(thiz$2["substring"](beginIndex))
    }
  }
});
var $d_jl_JSConsoleBasedPrintStream = new $TypeData().initClass({
  jl_JSConsoleBasedPrintStream: 0
}, false, "java.lang.JSConsoleBasedPrintStream", {
  jl_JSConsoleBasedPrintStream: 1,
  Ljava_io_PrintStream: 1,
  Ljava_io_FilterOutputStream: 1,
  Ljava_io_OutputStream: 1,
  O: 1,
  Ljava_io_Closeable: 1,
  Ljava_io_Flushable: 1,
  jl_Appendable: 1
});
$c_jl_JSConsoleBasedPrintStream.prototype.$classData = $d_jl_JSConsoleBasedPrintStream;
/** @constructor */
function $c_sc_Seq$() {
  $c_scg_SeqFactory.call(this)
}
$c_sc_Seq$.prototype = new $h_scg_SeqFactory();
$c_sc_Seq$.prototype.constructor = $c_sc_Seq$;
/** @constructor */
function $h_sc_Seq$() {
  /*<skip>*/
}
$h_sc_Seq$.prototype = $c_sc_Seq$.prototype;
$c_sc_Seq$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_Seq$();
  return new $c_scm_ListBuffer().init___()
});
var $d_sc_Seq$ = new $TypeData().initClass({
  sc_Seq$: 0
}, false, "scala.collection.Seq$", {
  sc_Seq$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sc_Seq$.prototype.$classData = $d_sc_Seq$;
var $n_sc_Seq$ = (void 0);
function $m_sc_Seq$() {
  if ((!$n_sc_Seq$)) {
    $n_sc_Seq$ = new $c_sc_Seq$().init___()
  };
  return $n_sc_Seq$
}
/** @constructor */
function $c_scg_IndexedSeqFactory() {
  $c_scg_SeqFactory.call(this)
}
$c_scg_IndexedSeqFactory.prototype = new $h_scg_SeqFactory();
$c_scg_IndexedSeqFactory.prototype.constructor = $c_scg_IndexedSeqFactory;
/** @constructor */
function $h_scg_IndexedSeqFactory() {
  /*<skip>*/
}
$h_scg_IndexedSeqFactory.prototype = $c_scg_IndexedSeqFactory.prototype;
/** @constructor */
function $c_sci_Seq$() {
  $c_scg_SeqFactory.call(this)
}
$c_sci_Seq$.prototype = new $h_scg_SeqFactory();
$c_sci_Seq$.prototype.constructor = $c_sci_Seq$;
/** @constructor */
function $h_sci_Seq$() {
  /*<skip>*/
}
$h_sci_Seq$.prototype = $c_sci_Seq$.prototype;
$c_sci_Seq$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ListBuffer().init___()
});
var $d_sci_Seq$ = new $TypeData().initClass({
  sci_Seq$: 0
}, false, "scala.collection.immutable.Seq$", {
  sci_Seq$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_Seq$.prototype.$classData = $d_sci_Seq$;
var $n_sci_Seq$ = (void 0);
function $m_sci_Seq$() {
  if ((!$n_sci_Seq$)) {
    $n_sci_Seq$ = new $c_sci_Seq$().init___()
  };
  return $n_sci_Seq$
}
/** @constructor */
function $c_scm_IndexedSeq$() {
  $c_scg_SeqFactory.call(this)
}
$c_scm_IndexedSeq$.prototype = new $h_scg_SeqFactory();
$c_scm_IndexedSeq$.prototype.constructor = $c_scm_IndexedSeq$;
/** @constructor */
function $h_scm_IndexedSeq$() {
  /*<skip>*/
}
$h_scm_IndexedSeq$.prototype = $c_scm_IndexedSeq$.prototype;
$c_scm_IndexedSeq$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ArrayBuffer().init___()
});
var $d_scm_IndexedSeq$ = new $TypeData().initClass({
  scm_IndexedSeq$: 0
}, false, "scala.collection.mutable.IndexedSeq$", {
  scm_IndexedSeq$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_scm_IndexedSeq$.prototype.$classData = $d_scm_IndexedSeq$;
var $n_scm_IndexedSeq$ = (void 0);
function $m_scm_IndexedSeq$() {
  if ((!$n_scm_IndexedSeq$)) {
    $n_scm_IndexedSeq$ = new $c_scm_IndexedSeq$().init___()
  };
  return $n_scm_IndexedSeq$
}
/** @constructor */
function $c_sjs_js_WrappedArray$() {
  $c_scg_SeqFactory.call(this)
}
$c_sjs_js_WrappedArray$.prototype = new $h_scg_SeqFactory();
$c_sjs_js_WrappedArray$.prototype.constructor = $c_sjs_js_WrappedArray$;
/** @constructor */
function $h_sjs_js_WrappedArray$() {
  /*<skip>*/
}
$h_sjs_js_WrappedArray$.prototype = $c_sjs_js_WrappedArray$.prototype;
$c_sjs_js_WrappedArray$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_sjs_js_WrappedArray().init___()
});
var $d_sjs_js_WrappedArray$ = new $TypeData().initClass({
  sjs_js_WrappedArray$: 0
}, false, "scala.scalajs.js.WrappedArray$", {
  sjs_js_WrappedArray$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sjs_js_WrappedArray$.prototype.$classData = $d_sjs_js_WrappedArray$;
var $n_sjs_js_WrappedArray$ = (void 0);
function $m_sjs_js_WrappedArray$() {
  if ((!$n_sjs_js_WrappedArray$)) {
    $n_sjs_js_WrappedArray$ = new $c_sjs_js_WrappedArray$().init___()
  };
  return $n_sjs_js_WrappedArray$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_ReactTagOf() {
  $c_O.call(this);
  this.tag$1 = null;
  this.modifiers$1 = null;
  this.namespace$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_ReactTagOf.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_ReactTagOf.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_ReactTagOf;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_ReactTagOf() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_ReactTagOf.prototype = $c_Ljapgolly_scalajs_react_vdom_ReactTagOf.prototype;
$c_Ljapgolly_scalajs_react_vdom_ReactTagOf.prototype.apply__sc_Seq__Ljapgolly_scalajs_react_vdom_ReactTagOf = (function(xs) {
  var tag = this.tag$1;
  var this$1 = this.modifiers$1;
  var modifiers = new $c_sci_$colon$colon().init___O__sci_List(xs, this$1);
  var namespace = this.namespace$1;
  return new $c_Ljapgolly_scalajs_react_vdom_ReactTagOf().init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace(tag, modifiers, namespace)
});
$c_Ljapgolly_scalajs_react_vdom_ReactTagOf.prototype.productPrefix__T = (function() {
  return "ReactTagOf"
});
$c_Ljapgolly_scalajs_react_vdom_ReactTagOf.prototype.init___T__sci_List__Ljapgolly_scalajs_react_vdom_Scalatags$Namespace = (function(tag, modifiers, namespace) {
  this.tag$1 = tag;
  this.modifiers$1 = modifiers;
  this.namespace$1 = namespace;
  return this
});
$c_Ljapgolly_scalajs_react_vdom_ReactTagOf.prototype.productArity__I = (function() {
  return 3
});
$c_Ljapgolly_scalajs_react_vdom_ReactTagOf.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_vdom_ReactTagOf(x$1)) {
    var ReactTagOf$1 = $as_Ljapgolly_scalajs_react_vdom_ReactTagOf(x$1);
    if ((this.tag$1 === ReactTagOf$1.tag$1)) {
      var x = this.modifiers$1;
      var x$2 = ReactTagOf$1.modifiers$1;
      var jsx$1 = ((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      var x$3 = this.namespace$1;
      var x$4 = ReactTagOf$1.namespace$1;
      return (x$3 === x$4)
    } else {
      return false
    }
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_vdom_ReactTagOf.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.tag$1;
      break
    }
    case 1: {
      return this.modifiers$1;
      break
    }
    case 2: {
      return this.namespace$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_vdom_ReactTagOf.prototype.toString__T = (function() {
  return $objectToString(this.render__Ljapgolly_scalajs_react_ReactElement())
});
$c_Ljapgolly_scalajs_react_vdom_ReactTagOf.prototype.render__Ljapgolly_scalajs_react_ReactElement = (function() {
  var b = new $c_Ljapgolly_scalajs_react_vdom_Builder().init___();
  this.build__p1__Ljapgolly_scalajs_react_vdom_Builder__V(b);
  return b.render__T__Ljapgolly_scalajs_react_ReactElement(this.tag$1)
});
$c_Ljapgolly_scalajs_react_vdom_ReactTagOf.prototype.build__p1__Ljapgolly_scalajs_react_vdom_Builder__V = (function(b) {
  var current = this.modifiers$1;
  var this$1 = this.modifiers$1;
  var arr = $newArrayObject($d_sc_Seq.getArrayOf(), [$s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(this$1)]);
  var i = 0;
  while (true) {
    var x = current;
    var x$2 = $m_sci_Nil$();
    if ((!((x !== null) && x.equals__O__Z(x$2)))) {
      arr.u[i] = $as_sc_Seq(current.head__O());
      var this$2 = current;
      current = this$2.tail__sci_List();
      i = ((1 + i) | 0)
    } else {
      break
    }
  };
  var j = arr.u["length"];
  while ((j > 0)) {
    j = (((-1) + j) | 0);
    var frag = arr.u[j];
    var i$2 = 0;
    while ((i$2 < frag.length__I())) {
      var this$3 = $as_Ljapgolly_scalajs_react_vdom_TagMod(frag.apply__I__O(i$2));
      b.appendChild__Ljapgolly_scalajs_react_ReactNode__V(this$3.render__Ljapgolly_scalajs_react_ReactNode());
      i$2 = ((1 + i$2) | 0)
    }
  }
});
$c_Ljapgolly_scalajs_react_vdom_ReactTagOf.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_vdom_ReactTagOf.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Ljapgolly_scalajs_react_vdom_ReactTagOf.prototype.render__Ljapgolly_scalajs_react_ReactNode = (function() {
  return this.render__Ljapgolly_scalajs_react_ReactElement()
});
function $is_Ljapgolly_scalajs_react_vdom_ReactTagOf(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_vdom_ReactTagOf)))
}
function $as_Ljapgolly_scalajs_react_vdom_ReactTagOf(obj) {
  return (($is_Ljapgolly_scalajs_react_vdom_ReactTagOf(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.vdom.ReactTagOf"))
}
function $isArrayOf_Ljapgolly_scalajs_react_vdom_ReactTagOf(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_vdom_ReactTagOf)))
}
function $asArrayOf_Ljapgolly_scalajs_react_vdom_ReactTagOf(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_vdom_ReactTagOf(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.vdom.ReactTagOf;", depth))
}
var $d_Ljapgolly_scalajs_react_vdom_ReactTagOf = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_ReactTagOf: 0
}, false, "japgolly.scalajs.react.vdom.ReactTagOf", {
  Ljapgolly_scalajs_react_vdom_ReactTagOf: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_Scalatags$DomFrag: 1,
  Ljapgolly_scalajs_react_vdom_Scalatags$Frag: 1,
  Ljapgolly_scalajs_react_vdom_TagMod: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_vdom_ReactTagOf.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_ReactTagOf;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag() {
  $c_O.call(this);
  this.v$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag.prototype = $c_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag.prototype;
$c_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag.prototype.productPrefix__T = (function() {
  return "ReactNodeFrag"
});
$c_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag.prototype.productArity__I = (function() {
  return 1
});
$c_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag(x$1)) {
    var ReactNodeFrag$1 = $as_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag(x$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z(this.v$1, ReactNodeFrag$1.v$1)
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.v$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag.prototype.init___Ljapgolly_scalajs_react_ReactNode = (function(v) {
  this.v$1 = v;
  return this
});
$c_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag.prototype.render__Ljapgolly_scalajs_react_ReactNode = (function() {
  return this.v$1
});
function $is_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag)))
}
function $as_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag(obj) {
  return (($is_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.vdom.Scalatags$ReactNodeFrag"))
}
function $isArrayOf_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag)))
}
function $asArrayOf_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.vdom.Scalatags$ReactNodeFrag;", depth))
}
var $d_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag: 0
}, false, "japgolly.scalajs.react.vdom.Scalatags$ReactNodeFrag", {
  Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_Scalatags$DomFrag: 1,
  Ljapgolly_scalajs_react_vdom_Scalatags$Frag: 1,
  Ljapgolly_scalajs_react_vdom_TagMod: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Scalatags$ReactNodeFrag;
/** @constructor */
function $c_s_reflect_AnyValManifest() {
  $c_O.call(this);
  this.toString$1 = null
}
$c_s_reflect_AnyValManifest.prototype = new $h_O();
$c_s_reflect_AnyValManifest.prototype.constructor = $c_s_reflect_AnyValManifest;
/** @constructor */
function $h_s_reflect_AnyValManifest() {
  /*<skip>*/
}
$h_s_reflect_AnyValManifest.prototype = $c_s_reflect_AnyValManifest.prototype;
$c_s_reflect_AnyValManifest.prototype.equals__O__Z = (function(that) {
  return (this === that)
});
$c_s_reflect_AnyValManifest.prototype.toString__T = (function() {
  return this.toString$1
});
$c_s_reflect_AnyValManifest.prototype.hashCode__I = (function() {
  return $systemIdentityHashCode(this)
});
/** @constructor */
function $c_s_reflect_ManifestFactory$ClassTypeManifest() {
  $c_O.call(this);
  this.prefix$1 = null;
  this.runtimeClass1$1 = null;
  this.typeArguments$1 = null
}
$c_s_reflect_ManifestFactory$ClassTypeManifest.prototype = new $h_O();
$c_s_reflect_ManifestFactory$ClassTypeManifest.prototype.constructor = $c_s_reflect_ManifestFactory$ClassTypeManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$ClassTypeManifest() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$ClassTypeManifest.prototype = $c_s_reflect_ManifestFactory$ClassTypeManifest.prototype;
/** @constructor */
function $c_sc_IndexedSeq$() {
  $c_scg_IndexedSeqFactory.call(this);
  this.ReusableCBF$6 = null
}
$c_sc_IndexedSeq$.prototype = new $h_scg_IndexedSeqFactory();
$c_sc_IndexedSeq$.prototype.constructor = $c_sc_IndexedSeq$;
/** @constructor */
function $h_sc_IndexedSeq$() {
  /*<skip>*/
}
$h_sc_IndexedSeq$.prototype = $c_sc_IndexedSeq$.prototype;
$c_sc_IndexedSeq$.prototype.init___ = (function() {
  $c_scg_IndexedSeqFactory.prototype.init___.call(this);
  $n_sc_IndexedSeq$ = this;
  this.ReusableCBF$6 = new $c_sc_IndexedSeq$$anon$1().init___();
  return this
});
$c_sc_IndexedSeq$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_IndexedSeq$();
  $m_sci_Vector$();
  return new $c_sci_VectorBuilder().init___()
});
var $d_sc_IndexedSeq$ = new $TypeData().initClass({
  sc_IndexedSeq$: 0
}, false, "scala.collection.IndexedSeq$", {
  sc_IndexedSeq$: 1,
  scg_IndexedSeqFactory: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sc_IndexedSeq$.prototype.$classData = $d_sc_IndexedSeq$;
var $n_sc_IndexedSeq$ = (void 0);
function $m_sc_IndexedSeq$() {
  if ((!$n_sc_IndexedSeq$)) {
    $n_sc_IndexedSeq$ = new $c_sc_IndexedSeq$().init___()
  };
  return $n_sc_IndexedSeq$
}
/** @constructor */
function $c_sc_IndexedSeqLike$Elements() {
  $c_sc_AbstractIterator.call(this);
  this.end$2 = 0;
  this.index$2 = 0;
  this.$$outer$f = null
}
$c_sc_IndexedSeqLike$Elements.prototype = new $h_sc_AbstractIterator();
$c_sc_IndexedSeqLike$Elements.prototype.constructor = $c_sc_IndexedSeqLike$Elements;
/** @constructor */
function $h_sc_IndexedSeqLike$Elements() {
  /*<skip>*/
}
$h_sc_IndexedSeqLike$Elements.prototype = $c_sc_IndexedSeqLike$Elements.prototype;
$c_sc_IndexedSeqLike$Elements.prototype.next__O = (function() {
  if ((this.index$2 >= this.end$2)) {
    $m_sc_Iterator$().empty$1.next__O()
  };
  var x = this.$$outer$f.apply__I__O(this.index$2);
  this.index$2 = ((1 + this.index$2) | 0);
  return x
});
$c_sc_IndexedSeqLike$Elements.prototype.init___sc_IndexedSeqLike__I__I = (function($$outer, start, end) {
  this.end$2 = end;
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  this.index$2 = start;
  return this
});
$c_sc_IndexedSeqLike$Elements.prototype.hasNext__Z = (function() {
  return (this.index$2 < this.end$2)
});
var $d_sc_IndexedSeqLike$Elements = new $TypeData().initClass({
  sc_IndexedSeqLike$Elements: 0
}, false, "scala.collection.IndexedSeqLike$Elements", {
  sc_IndexedSeqLike$Elements: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_BufferedIterator: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sc_IndexedSeqLike$Elements.prototype.$classData = $d_sc_IndexedSeqLike$Elements;
/** @constructor */
function $c_sci_HashSet$() {
  $c_scg_ImmutableSetFactory.call(this)
}
$c_sci_HashSet$.prototype = new $h_scg_ImmutableSetFactory();
$c_sci_HashSet$.prototype.constructor = $c_sci_HashSet$;
/** @constructor */
function $h_sci_HashSet$() {
  /*<skip>*/
}
$h_sci_HashSet$.prototype = $c_sci_HashSet$.prototype;
$c_sci_HashSet$.prototype.scala$collection$immutable$HashSet$$makeHashTrieSet__I__sci_HashSet__I__sci_HashSet__I__sci_HashSet$HashTrieSet = (function(hash0, elem0, hash1, elem1, level) {
  var index0 = (31 & ((hash0 >>> level) | 0));
  var index1 = (31 & ((hash1 >>> level) | 0));
  if ((index0 !== index1)) {
    var bitmap = ((1 << index0) | (1 << index1));
    var elems = $newArrayObject($d_sci_HashSet.getArrayOf(), [2]);
    if ((index0 < index1)) {
      elems.u[0] = elem0;
      elems.u[1] = elem1
    } else {
      elems.u[0] = elem1;
      elems.u[1] = elem0
    };
    return new $c_sci_HashSet$HashTrieSet().init___I__Asci_HashSet__I(bitmap, elems, ((elem0.size__I() + elem1.size__I()) | 0))
  } else {
    var elems$2 = $newArrayObject($d_sci_HashSet.getArrayOf(), [1]);
    var bitmap$2 = (1 << index0);
    var child = this.scala$collection$immutable$HashSet$$makeHashTrieSet__I__sci_HashSet__I__sci_HashSet__I__sci_HashSet$HashTrieSet(hash0, elem0, hash1, elem1, ((5 + level) | 0));
    elems$2.u[0] = child;
    return new $c_sci_HashSet$HashTrieSet().init___I__Asci_HashSet__I(bitmap$2, elems$2, child.size0$5)
  }
});
$c_sci_HashSet$.prototype.emptyInstance__sci_Set = (function() {
  return $m_sci_HashSet$EmptyHashSet$()
});
var $d_sci_HashSet$ = new $TypeData().initClass({
  sci_HashSet$: 0
}, false, "scala.collection.immutable.HashSet$", {
  sci_HashSet$: 1,
  scg_ImmutableSetFactory: 1,
  scg_SetFactory: 1,
  scg_GenSetFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet$.prototype.$classData = $d_sci_HashSet$;
var $n_sci_HashSet$ = (void 0);
function $m_sci_HashSet$() {
  if ((!$n_sci_HashSet$)) {
    $n_sci_HashSet$ = new $c_sci_HashSet$().init___()
  };
  return $n_sci_HashSet$
}
/** @constructor */
function $c_sci_IndexedSeq$() {
  $c_scg_IndexedSeqFactory.call(this)
}
$c_sci_IndexedSeq$.prototype = new $h_scg_IndexedSeqFactory();
$c_sci_IndexedSeq$.prototype.constructor = $c_sci_IndexedSeq$;
/** @constructor */
function $h_sci_IndexedSeq$() {
  /*<skip>*/
}
$h_sci_IndexedSeq$.prototype = $c_sci_IndexedSeq$.prototype;
$c_sci_IndexedSeq$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_Vector$();
  return new $c_sci_VectorBuilder().init___()
});
var $d_sci_IndexedSeq$ = new $TypeData().initClass({
  sci_IndexedSeq$: 0
}, false, "scala.collection.immutable.IndexedSeq$", {
  sci_IndexedSeq$: 1,
  scg_IndexedSeqFactory: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_IndexedSeq$.prototype.$classData = $d_sci_IndexedSeq$;
var $n_sci_IndexedSeq$ = (void 0);
function $m_sci_IndexedSeq$() {
  if ((!$n_sci_IndexedSeq$)) {
    $n_sci_IndexedSeq$ = new $c_sci_IndexedSeq$().init___()
  };
  return $n_sci_IndexedSeq$
}
/** @constructor */
function $c_sci_ListSet$() {
  $c_scg_ImmutableSetFactory.call(this)
}
$c_sci_ListSet$.prototype = new $h_scg_ImmutableSetFactory();
$c_sci_ListSet$.prototype.constructor = $c_sci_ListSet$;
/** @constructor */
function $h_sci_ListSet$() {
  /*<skip>*/
}
$h_sci_ListSet$.prototype = $c_sci_ListSet$.prototype;
$c_sci_ListSet$.prototype.emptyInstance__sci_Set = (function() {
  return $m_sci_ListSet$EmptyListSet$()
});
$c_sci_ListSet$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_sci_ListSet$ListSetBuilder().init___()
});
var $d_sci_ListSet$ = new $TypeData().initClass({
  sci_ListSet$: 0
}, false, "scala.collection.immutable.ListSet$", {
  sci_ListSet$: 1,
  scg_ImmutableSetFactory: 1,
  scg_SetFactory: 1,
  scg_GenSetFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_ListSet$.prototype.$classData = $d_sci_ListSet$;
var $n_sci_ListSet$ = (void 0);
function $m_sci_ListSet$() {
  if ((!$n_sci_ListSet$)) {
    $n_sci_ListSet$ = new $c_sci_ListSet$().init___()
  };
  return $n_sci_ListSet$
}
/** @constructor */
function $c_scm_HashSet$() {
  $c_scg_MutableSetFactory.call(this)
}
$c_scm_HashSet$.prototype = new $h_scg_MutableSetFactory();
$c_scm_HashSet$.prototype.constructor = $c_scm_HashSet$;
/** @constructor */
function $h_scm_HashSet$() {
  /*<skip>*/
}
$h_scm_HashSet$.prototype = $c_scm_HashSet$.prototype;
$c_scm_HashSet$.prototype.empty__sc_GenTraversable = (function() {
  return new $c_scm_HashSet().init___()
});
var $d_scm_HashSet$ = new $TypeData().initClass({
  scm_HashSet$: 0
}, false, "scala.collection.mutable.HashSet$", {
  scm_HashSet$: 1,
  scg_MutableSetFactory: 1,
  scg_SetFactory: 1,
  scg_GenSetFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_HashSet$.prototype.$classData = $d_scm_HashSet$;
var $n_scm_HashSet$ = (void 0);
function $m_scm_HashSet$() {
  if ((!$n_scm_HashSet$)) {
    $n_scm_HashSet$ = new $c_scm_HashSet$().init___()
  };
  return $n_scm_HashSet$
}
/** @constructor */
function $c_sjs_js_JavaScriptException() {
  $c_jl_RuntimeException.call(this);
  this.exception$4 = null
}
$c_sjs_js_JavaScriptException.prototype = new $h_jl_RuntimeException();
$c_sjs_js_JavaScriptException.prototype.constructor = $c_sjs_js_JavaScriptException;
/** @constructor */
function $h_sjs_js_JavaScriptException() {
  /*<skip>*/
}
$h_sjs_js_JavaScriptException.prototype = $c_sjs_js_JavaScriptException.prototype;
$c_sjs_js_JavaScriptException.prototype.productPrefix__T = (function() {
  return "JavaScriptException"
});
$c_sjs_js_JavaScriptException.prototype.productArity__I = (function() {
  return 1
});
$c_sjs_js_JavaScriptException.prototype.fillInStackTrace__jl_Throwable = (function() {
  $m_sjsr_StackTrace$().captureState__jl_Throwable__O__V(this, this.exception$4);
  return this
});
$c_sjs_js_JavaScriptException.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_sjs_js_JavaScriptException(x$1)) {
    var JavaScriptException$1 = $as_sjs_js_JavaScriptException(x$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z(this.exception$4, JavaScriptException$1.exception$4)
  } else {
    return false
  }
});
$c_sjs_js_JavaScriptException.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.exception$4;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_sjs_js_JavaScriptException.prototype.toString__T = (function() {
  return $objectToString(this.exception$4)
});
$c_sjs_js_JavaScriptException.prototype.init___O = (function(exception) {
  this.exception$4 = exception;
  $c_jl_RuntimeException.prototype.init___.call(this);
  return this
});
$c_sjs_js_JavaScriptException.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_sjs_js_JavaScriptException.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_sjs_js_JavaScriptException(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sjs_js_JavaScriptException)))
}
function $as_sjs_js_JavaScriptException(obj) {
  return (($is_sjs_js_JavaScriptException(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.scalajs.js.JavaScriptException"))
}
function $isArrayOf_sjs_js_JavaScriptException(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sjs_js_JavaScriptException)))
}
function $asArrayOf_sjs_js_JavaScriptException(obj, depth) {
  return (($isArrayOf_sjs_js_JavaScriptException(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.scalajs.js.JavaScriptException;", depth))
}
var $d_sjs_js_JavaScriptException = new $TypeData().initClass({
  sjs_js_JavaScriptException: 0
}, false, "scala.scalajs.js.JavaScriptException", {
  sjs_js_JavaScriptException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1
});
$c_sjs_js_JavaScriptException.prototype.$classData = $d_sjs_js_JavaScriptException;
/** @constructor */
function $c_s_reflect_ManifestFactory$BooleanManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$BooleanManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$BooleanManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$BooleanManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$BooleanManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$BooleanManifest$.prototype = $c_s_reflect_ManifestFactory$BooleanManifest$.prototype;
$c_s_reflect_ManifestFactory$BooleanManifest$.prototype.init___ = (function() {
  this.toString$1 = "Boolean";
  $n_s_reflect_ManifestFactory$BooleanManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$BooleanManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$BooleanManifest$: 0
}, false, "scala.reflect.ManifestFactory$BooleanManifest$", {
  s_reflect_ManifestFactory$BooleanManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$BooleanManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$BooleanManifest$;
var $n_s_reflect_ManifestFactory$BooleanManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$BooleanManifest$() {
  if ((!$n_s_reflect_ManifestFactory$BooleanManifest$)) {
    $n_s_reflect_ManifestFactory$BooleanManifest$ = new $c_s_reflect_ManifestFactory$BooleanManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$BooleanManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$ByteManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$ByteManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$ByteManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$ByteManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$ByteManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$ByteManifest$.prototype = $c_s_reflect_ManifestFactory$ByteManifest$.prototype;
$c_s_reflect_ManifestFactory$ByteManifest$.prototype.init___ = (function() {
  this.toString$1 = "Byte";
  $n_s_reflect_ManifestFactory$ByteManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$ByteManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$ByteManifest$: 0
}, false, "scala.reflect.ManifestFactory$ByteManifest$", {
  s_reflect_ManifestFactory$ByteManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$ByteManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$ByteManifest$;
var $n_s_reflect_ManifestFactory$ByteManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$ByteManifest$() {
  if ((!$n_s_reflect_ManifestFactory$ByteManifest$)) {
    $n_s_reflect_ManifestFactory$ByteManifest$ = new $c_s_reflect_ManifestFactory$ByteManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$ByteManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$CharManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$CharManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$CharManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$CharManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$CharManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$CharManifest$.prototype = $c_s_reflect_ManifestFactory$CharManifest$.prototype;
$c_s_reflect_ManifestFactory$CharManifest$.prototype.init___ = (function() {
  this.toString$1 = "Char";
  $n_s_reflect_ManifestFactory$CharManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$CharManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$CharManifest$: 0
}, false, "scala.reflect.ManifestFactory$CharManifest$", {
  s_reflect_ManifestFactory$CharManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$CharManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$CharManifest$;
var $n_s_reflect_ManifestFactory$CharManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$CharManifest$() {
  if ((!$n_s_reflect_ManifestFactory$CharManifest$)) {
    $n_s_reflect_ManifestFactory$CharManifest$ = new $c_s_reflect_ManifestFactory$CharManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$CharManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$DoubleManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$DoubleManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$DoubleManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$DoubleManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$DoubleManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$DoubleManifest$.prototype = $c_s_reflect_ManifestFactory$DoubleManifest$.prototype;
$c_s_reflect_ManifestFactory$DoubleManifest$.prototype.init___ = (function() {
  this.toString$1 = "Double";
  $n_s_reflect_ManifestFactory$DoubleManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$DoubleManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$DoubleManifest$: 0
}, false, "scala.reflect.ManifestFactory$DoubleManifest$", {
  s_reflect_ManifestFactory$DoubleManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$DoubleManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$DoubleManifest$;
var $n_s_reflect_ManifestFactory$DoubleManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$DoubleManifest$() {
  if ((!$n_s_reflect_ManifestFactory$DoubleManifest$)) {
    $n_s_reflect_ManifestFactory$DoubleManifest$ = new $c_s_reflect_ManifestFactory$DoubleManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$DoubleManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$FloatManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$FloatManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$FloatManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$FloatManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$FloatManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$FloatManifest$.prototype = $c_s_reflect_ManifestFactory$FloatManifest$.prototype;
$c_s_reflect_ManifestFactory$FloatManifest$.prototype.init___ = (function() {
  this.toString$1 = "Float";
  $n_s_reflect_ManifestFactory$FloatManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$FloatManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$FloatManifest$: 0
}, false, "scala.reflect.ManifestFactory$FloatManifest$", {
  s_reflect_ManifestFactory$FloatManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$FloatManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$FloatManifest$;
var $n_s_reflect_ManifestFactory$FloatManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$FloatManifest$() {
  if ((!$n_s_reflect_ManifestFactory$FloatManifest$)) {
    $n_s_reflect_ManifestFactory$FloatManifest$ = new $c_s_reflect_ManifestFactory$FloatManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$FloatManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$IntManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$IntManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$IntManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$IntManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$IntManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$IntManifest$.prototype = $c_s_reflect_ManifestFactory$IntManifest$.prototype;
$c_s_reflect_ManifestFactory$IntManifest$.prototype.init___ = (function() {
  this.toString$1 = "Int";
  $n_s_reflect_ManifestFactory$IntManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$IntManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$IntManifest$: 0
}, false, "scala.reflect.ManifestFactory$IntManifest$", {
  s_reflect_ManifestFactory$IntManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$IntManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$IntManifest$;
var $n_s_reflect_ManifestFactory$IntManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$IntManifest$() {
  if ((!$n_s_reflect_ManifestFactory$IntManifest$)) {
    $n_s_reflect_ManifestFactory$IntManifest$ = new $c_s_reflect_ManifestFactory$IntManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$IntManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$LongManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$LongManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$LongManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$LongManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$LongManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$LongManifest$.prototype = $c_s_reflect_ManifestFactory$LongManifest$.prototype;
$c_s_reflect_ManifestFactory$LongManifest$.prototype.init___ = (function() {
  this.toString$1 = "Long";
  $n_s_reflect_ManifestFactory$LongManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$LongManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$LongManifest$: 0
}, false, "scala.reflect.ManifestFactory$LongManifest$", {
  s_reflect_ManifestFactory$LongManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$LongManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$LongManifest$;
var $n_s_reflect_ManifestFactory$LongManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$LongManifest$() {
  if ((!$n_s_reflect_ManifestFactory$LongManifest$)) {
    $n_s_reflect_ManifestFactory$LongManifest$ = new $c_s_reflect_ManifestFactory$LongManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$LongManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$PhantomManifest() {
  $c_s_reflect_ManifestFactory$ClassTypeManifest.call(this);
  this.toString$2 = null
}
$c_s_reflect_ManifestFactory$PhantomManifest.prototype = new $h_s_reflect_ManifestFactory$ClassTypeManifest();
$c_s_reflect_ManifestFactory$PhantomManifest.prototype.constructor = $c_s_reflect_ManifestFactory$PhantomManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$PhantomManifest() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$PhantomManifest.prototype = $c_s_reflect_ManifestFactory$PhantomManifest.prototype;
$c_s_reflect_ManifestFactory$PhantomManifest.prototype.equals__O__Z = (function(that) {
  return (this === that)
});
$c_s_reflect_ManifestFactory$PhantomManifest.prototype.toString__T = (function() {
  return this.toString$2
});
$c_s_reflect_ManifestFactory$PhantomManifest.prototype.hashCode__I = (function() {
  return $systemIdentityHashCode(this)
});
/** @constructor */
function $c_s_reflect_ManifestFactory$ShortManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$ShortManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$ShortManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$ShortManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$ShortManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$ShortManifest$.prototype = $c_s_reflect_ManifestFactory$ShortManifest$.prototype;
$c_s_reflect_ManifestFactory$ShortManifest$.prototype.init___ = (function() {
  this.toString$1 = "Short";
  $n_s_reflect_ManifestFactory$ShortManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$ShortManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$ShortManifest$: 0
}, false, "scala.reflect.ManifestFactory$ShortManifest$", {
  s_reflect_ManifestFactory$ShortManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$ShortManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$ShortManifest$;
var $n_s_reflect_ManifestFactory$ShortManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$ShortManifest$() {
  if ((!$n_s_reflect_ManifestFactory$ShortManifest$)) {
    $n_s_reflect_ManifestFactory$ShortManifest$ = new $c_s_reflect_ManifestFactory$ShortManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$ShortManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$UnitManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$UnitManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$UnitManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$UnitManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$UnitManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$UnitManifest$.prototype = $c_s_reflect_ManifestFactory$UnitManifest$.prototype;
$c_s_reflect_ManifestFactory$UnitManifest$.prototype.init___ = (function() {
  this.toString$1 = "Unit";
  $n_s_reflect_ManifestFactory$UnitManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$UnitManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$UnitManifest$: 0
}, false, "scala.reflect.ManifestFactory$UnitManifest$", {
  s_reflect_ManifestFactory$UnitManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$UnitManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$UnitManifest$;
var $n_s_reflect_ManifestFactory$UnitManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$UnitManifest$() {
  if ((!$n_s_reflect_ManifestFactory$UnitManifest$)) {
    $n_s_reflect_ManifestFactory$UnitManifest$ = new $c_s_reflect_ManifestFactory$UnitManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$UnitManifest$
}
/** @constructor */
function $c_sci_List$() {
  $c_scg_SeqFactory.call(this);
  this.partialNotApplied$5 = null
}
$c_sci_List$.prototype = new $h_scg_SeqFactory();
$c_sci_List$.prototype.constructor = $c_sci_List$;
/** @constructor */
function $h_sci_List$() {
  /*<skip>*/
}
$h_sci_List$.prototype = $c_sci_List$.prototype;
$c_sci_List$.prototype.init___ = (function() {
  $c_scg_SeqFactory.prototype.init___.call(this);
  $n_sci_List$ = this;
  this.partialNotApplied$5 = new $c_sci_List$$anon$1().init___();
  return this
});
$c_sci_List$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ListBuffer().init___()
});
var $d_sci_List$ = new $TypeData().initClass({
  sci_List$: 0
}, false, "scala.collection.immutable.List$", {
  sci_List$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_List$.prototype.$classData = $d_sci_List$;
var $n_sci_List$ = (void 0);
function $m_sci_List$() {
  if ((!$n_sci_List$)) {
    $n_sci_List$ = new $c_sci_List$().init___()
  };
  return $n_sci_List$
}
/** @constructor */
function $c_sci_Stream$() {
  $c_scg_SeqFactory.call(this)
}
$c_sci_Stream$.prototype = new $h_scg_SeqFactory();
$c_sci_Stream$.prototype.constructor = $c_sci_Stream$;
/** @constructor */
function $h_sci_Stream$() {
  /*<skip>*/
}
$h_sci_Stream$.prototype = $c_sci_Stream$.prototype;
$c_sci_Stream$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_sci_Stream$StreamBuilder().init___()
});
var $d_sci_Stream$ = new $TypeData().initClass({
  sci_Stream$: 0
}, false, "scala.collection.immutable.Stream$", {
  sci_Stream$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Stream$.prototype.$classData = $d_sci_Stream$;
var $n_sci_Stream$ = (void 0);
function $m_sci_Stream$() {
  if ((!$n_sci_Stream$)) {
    $n_sci_Stream$ = new $c_sci_Stream$().init___()
  };
  return $n_sci_Stream$
}
/** @constructor */
function $c_scm_ArrayBuffer$() {
  $c_scg_SeqFactory.call(this)
}
$c_scm_ArrayBuffer$.prototype = new $h_scg_SeqFactory();
$c_scm_ArrayBuffer$.prototype.constructor = $c_scm_ArrayBuffer$;
/** @constructor */
function $h_scm_ArrayBuffer$() {
  /*<skip>*/
}
$h_scm_ArrayBuffer$.prototype = $c_scm_ArrayBuffer$.prototype;
$c_scm_ArrayBuffer$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ArrayBuffer().init___()
});
var $d_scm_ArrayBuffer$ = new $TypeData().initClass({
  scm_ArrayBuffer$: 0
}, false, "scala.collection.mutable.ArrayBuffer$", {
  scm_ArrayBuffer$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ArrayBuffer$.prototype.$classData = $d_scm_ArrayBuffer$;
var $n_scm_ArrayBuffer$ = (void 0);
function $m_scm_ArrayBuffer$() {
  if ((!$n_scm_ArrayBuffer$)) {
    $n_scm_ArrayBuffer$ = new $c_scm_ArrayBuffer$().init___()
  };
  return $n_scm_ArrayBuffer$
}
/** @constructor */
function $c_scm_ListBuffer$() {
  $c_scg_SeqFactory.call(this)
}
$c_scm_ListBuffer$.prototype = new $h_scg_SeqFactory();
$c_scm_ListBuffer$.prototype.constructor = $c_scm_ListBuffer$;
/** @constructor */
function $h_scm_ListBuffer$() {
  /*<skip>*/
}
$h_scm_ListBuffer$.prototype = $c_scm_ListBuffer$.prototype;
$c_scm_ListBuffer$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_GrowingBuilder().init___scg_Growable(new $c_scm_ListBuffer().init___())
});
var $d_scm_ListBuffer$ = new $TypeData().initClass({
  scm_ListBuffer$: 0
}, false, "scala.collection.mutable.ListBuffer$", {
  scm_ListBuffer$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ListBuffer$.prototype.$classData = $d_scm_ListBuffer$;
var $n_scm_ListBuffer$ = (void 0);
function $m_scm_ListBuffer$() {
  if ((!$n_scm_ListBuffer$)) {
    $n_scm_ListBuffer$ = new $c_scm_ListBuffer$().init___()
  };
  return $n_scm_ListBuffer$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$AnyManifest$() {
  $c_s_reflect_ManifestFactory$PhantomManifest.call(this)
}
$c_s_reflect_ManifestFactory$AnyManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$c_s_reflect_ManifestFactory$AnyManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$AnyManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$AnyManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$AnyManifest$.prototype = $c_s_reflect_ManifestFactory$AnyManifest$.prototype;
$c_s_reflect_ManifestFactory$AnyManifest$.prototype.init___ = (function() {
  this.toString$2 = "Any";
  var prefix = $m_s_None$();
  var typeArguments = $m_sci_Nil$();
  this.prefix$1 = prefix;
  this.runtimeClass1$1 = $d_O.getClassOf();
  this.typeArguments$1 = typeArguments;
  $n_s_reflect_ManifestFactory$AnyManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$AnyManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$AnyManifest$: 0
}, false, "scala.reflect.ManifestFactory$AnyManifest$", {
  s_reflect_ManifestFactory$AnyManifest$: 1,
  s_reflect_ManifestFactory$PhantomManifest: 1,
  s_reflect_ManifestFactory$ClassTypeManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$AnyManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$AnyManifest$;
var $n_s_reflect_ManifestFactory$AnyManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$AnyManifest$() {
  if ((!$n_s_reflect_ManifestFactory$AnyManifest$)) {
    $n_s_reflect_ManifestFactory$AnyManifest$ = new $c_s_reflect_ManifestFactory$AnyManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$AnyManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$AnyValManifest$() {
  $c_s_reflect_ManifestFactory$PhantomManifest.call(this)
}
$c_s_reflect_ManifestFactory$AnyValManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$c_s_reflect_ManifestFactory$AnyValManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$AnyValManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$AnyValManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$AnyValManifest$.prototype = $c_s_reflect_ManifestFactory$AnyValManifest$.prototype;
$c_s_reflect_ManifestFactory$AnyValManifest$.prototype.init___ = (function() {
  this.toString$2 = "AnyVal";
  var prefix = $m_s_None$();
  var typeArguments = $m_sci_Nil$();
  this.prefix$1 = prefix;
  this.runtimeClass1$1 = $d_O.getClassOf();
  this.typeArguments$1 = typeArguments;
  $n_s_reflect_ManifestFactory$AnyValManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$AnyValManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$AnyValManifest$: 0
}, false, "scala.reflect.ManifestFactory$AnyValManifest$", {
  s_reflect_ManifestFactory$AnyValManifest$: 1,
  s_reflect_ManifestFactory$PhantomManifest: 1,
  s_reflect_ManifestFactory$ClassTypeManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$AnyValManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$AnyValManifest$;
var $n_s_reflect_ManifestFactory$AnyValManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$AnyValManifest$() {
  if ((!$n_s_reflect_ManifestFactory$AnyValManifest$)) {
    $n_s_reflect_ManifestFactory$AnyValManifest$ = new $c_s_reflect_ManifestFactory$AnyValManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$AnyValManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$NothingManifest$() {
  $c_s_reflect_ManifestFactory$PhantomManifest.call(this)
}
$c_s_reflect_ManifestFactory$NothingManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$c_s_reflect_ManifestFactory$NothingManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$NothingManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$NothingManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$NothingManifest$.prototype = $c_s_reflect_ManifestFactory$NothingManifest$.prototype;
$c_s_reflect_ManifestFactory$NothingManifest$.prototype.init___ = (function() {
  this.toString$2 = "Nothing";
  var prefix = $m_s_None$();
  var typeArguments = $m_sci_Nil$();
  this.prefix$1 = prefix;
  this.runtimeClass1$1 = $d_sr_Nothing$.getClassOf();
  this.typeArguments$1 = typeArguments;
  $n_s_reflect_ManifestFactory$NothingManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$NothingManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$NothingManifest$: 0
}, false, "scala.reflect.ManifestFactory$NothingManifest$", {
  s_reflect_ManifestFactory$NothingManifest$: 1,
  s_reflect_ManifestFactory$PhantomManifest: 1,
  s_reflect_ManifestFactory$ClassTypeManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$NothingManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$NothingManifest$;
var $n_s_reflect_ManifestFactory$NothingManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$NothingManifest$() {
  if ((!$n_s_reflect_ManifestFactory$NothingManifest$)) {
    $n_s_reflect_ManifestFactory$NothingManifest$ = new $c_s_reflect_ManifestFactory$NothingManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$NothingManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$NullManifest$() {
  $c_s_reflect_ManifestFactory$PhantomManifest.call(this)
}
$c_s_reflect_ManifestFactory$NullManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$c_s_reflect_ManifestFactory$NullManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$NullManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$NullManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$NullManifest$.prototype = $c_s_reflect_ManifestFactory$NullManifest$.prototype;
$c_s_reflect_ManifestFactory$NullManifest$.prototype.init___ = (function() {
  this.toString$2 = "Null";
  var prefix = $m_s_None$();
  var typeArguments = $m_sci_Nil$();
  this.prefix$1 = prefix;
  this.runtimeClass1$1 = $d_sr_Null$.getClassOf();
  this.typeArguments$1 = typeArguments;
  $n_s_reflect_ManifestFactory$NullManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$NullManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$NullManifest$: 0
}, false, "scala.reflect.ManifestFactory$NullManifest$", {
  s_reflect_ManifestFactory$NullManifest$: 1,
  s_reflect_ManifestFactory$PhantomManifest: 1,
  s_reflect_ManifestFactory$ClassTypeManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$NullManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$NullManifest$;
var $n_s_reflect_ManifestFactory$NullManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$NullManifest$() {
  if ((!$n_s_reflect_ManifestFactory$NullManifest$)) {
    $n_s_reflect_ManifestFactory$NullManifest$ = new $c_s_reflect_ManifestFactory$NullManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$NullManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$ObjectManifest$() {
  $c_s_reflect_ManifestFactory$PhantomManifest.call(this)
}
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$ObjectManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$ObjectManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$ObjectManifest$.prototype = $c_s_reflect_ManifestFactory$ObjectManifest$.prototype;
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype.init___ = (function() {
  this.toString$2 = "Object";
  var prefix = $m_s_None$();
  var typeArguments = $m_sci_Nil$();
  this.prefix$1 = prefix;
  this.runtimeClass1$1 = $d_O.getClassOf();
  this.typeArguments$1 = typeArguments;
  $n_s_reflect_ManifestFactory$ObjectManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$ObjectManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$ObjectManifest$: 0
}, false, "scala.reflect.ManifestFactory$ObjectManifest$", {
  s_reflect_ManifestFactory$ObjectManifest$: 1,
  s_reflect_ManifestFactory$PhantomManifest: 1,
  s_reflect_ManifestFactory$ClassTypeManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$ObjectManifest$;
var $n_s_reflect_ManifestFactory$ObjectManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$ObjectManifest$() {
  if ((!$n_s_reflect_ManifestFactory$ObjectManifest$)) {
    $n_s_reflect_ManifestFactory$ObjectManifest$ = new $c_s_reflect_ManifestFactory$ObjectManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$ObjectManifest$
}
function $is_sc_GenSeq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenSeq)))
}
function $as_sc_GenSeq(obj) {
  return (($is_sc_GenSeq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenSeq"))
}
function $isArrayOf_sc_GenSeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenSeq)))
}
function $asArrayOf_sc_GenSeq(obj, depth) {
  return (($isArrayOf_sc_GenSeq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenSeq;", depth))
}
/** @constructor */
function $c_sci_Vector$() {
  $c_scg_IndexedSeqFactory.call(this);
  this.NIL$6 = null;
  this.Log2ConcatFaster$6 = 0;
  this.TinyAppendFaster$6 = 0
}
$c_sci_Vector$.prototype = new $h_scg_IndexedSeqFactory();
$c_sci_Vector$.prototype.constructor = $c_sci_Vector$;
/** @constructor */
function $h_sci_Vector$() {
  /*<skip>*/
}
$h_sci_Vector$.prototype = $c_sci_Vector$.prototype;
$c_sci_Vector$.prototype.init___ = (function() {
  $c_scg_IndexedSeqFactory.prototype.init___.call(this);
  $n_sci_Vector$ = this;
  this.NIL$6 = new $c_sci_Vector().init___I__I__I(0, 0, 0);
  return this
});
$c_sci_Vector$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_sci_VectorBuilder().init___()
});
var $d_sci_Vector$ = new $TypeData().initClass({
  sci_Vector$: 0
}, false, "scala.collection.immutable.Vector$", {
  sci_Vector$: 1,
  scg_IndexedSeqFactory: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Vector$.prototype.$classData = $d_sci_Vector$;
var $n_sci_Vector$ = (void 0);
function $m_sci_Vector$() {
  if ((!$n_sci_Vector$)) {
    $n_sci_Vector$ = new $c_sci_Vector$().init___()
  };
  return $n_sci_Vector$
}
/** @constructor */
function $c_sc_AbstractTraversable() {
  $c_O.call(this)
}
$c_sc_AbstractTraversable.prototype = new $h_O();
$c_sc_AbstractTraversable.prototype.constructor = $c_sc_AbstractTraversable;
/** @constructor */
function $h_sc_AbstractTraversable() {
  /*<skip>*/
}
$h_sc_AbstractTraversable.prototype = $c_sc_AbstractTraversable.prototype;
$c_sc_AbstractTraversable.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, start, sep, end)
});
$c_sc_AbstractTraversable.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sc_AbstractTraversable.prototype.repr__O = (function() {
  return this
});
$c_sc_AbstractTraversable.prototype.newBuilder__scm_Builder = (function() {
  return this.companion__scg_GenericCompanion().newBuilder__scm_Builder()
});
$c_sc_AbstractTraversable.prototype.stringPrefix__T = (function() {
  return $s_sc_TraversableLike$class__stringPrefix__sc_TraversableLike__T(this)
});
function $is_sc_GenSet(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenSet)))
}
function $as_sc_GenSet(obj) {
  return (($is_sc_GenSet(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenSet"))
}
function $isArrayOf_sc_GenSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenSet)))
}
function $asArrayOf_sc_GenSet(obj, depth) {
  return (($isArrayOf_sc_GenSet(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenSet;", depth))
}
function $is_sc_IndexedSeqLike(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_IndexedSeqLike)))
}
function $as_sc_IndexedSeqLike(obj) {
  return (($is_sc_IndexedSeqLike(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.IndexedSeqLike"))
}
function $isArrayOf_sc_IndexedSeqLike(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_IndexedSeqLike)))
}
function $asArrayOf_sc_IndexedSeqLike(obj, depth) {
  return (($isArrayOf_sc_IndexedSeqLike(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.IndexedSeqLike;", depth))
}
function $is_sc_LinearSeqLike(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_LinearSeqLike)))
}
function $as_sc_LinearSeqLike(obj) {
  return (($is_sc_LinearSeqLike(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.LinearSeqLike"))
}
function $isArrayOf_sc_LinearSeqLike(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_LinearSeqLike)))
}
function $asArrayOf_sc_LinearSeqLike(obj, depth) {
  return (($isArrayOf_sc_LinearSeqLike(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.LinearSeqLike;", depth))
}
function $is_sc_LinearSeqOptimized(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_LinearSeqOptimized)))
}
function $as_sc_LinearSeqOptimized(obj) {
  return (($is_sc_LinearSeqOptimized(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.LinearSeqOptimized"))
}
function $isArrayOf_sc_LinearSeqOptimized(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_LinearSeqOptimized)))
}
function $asArrayOf_sc_LinearSeqOptimized(obj, depth) {
  return (($isArrayOf_sc_LinearSeqOptimized(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.LinearSeqOptimized;", depth))
}
/** @constructor */
function $c_sc_AbstractIterable() {
  $c_sc_AbstractTraversable.call(this)
}
$c_sc_AbstractIterable.prototype = new $h_sc_AbstractTraversable();
$c_sc_AbstractIterable.prototype.constructor = $c_sc_AbstractIterable;
/** @constructor */
function $h_sc_AbstractIterable() {
  /*<skip>*/
}
$h_sc_AbstractIterable.prototype = $c_sc_AbstractIterable.prototype;
$c_sc_AbstractIterable.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IterableLike$class__sameElements__sc_IterableLike__sc_GenIterable__Z(this, that)
});
$c_sc_AbstractIterable.prototype.forall__F1__Z = (function(p) {
  var this$1 = this.iterator__sc_Iterator();
  return $s_sc_Iterator$class__forall__sc_Iterator__F1__Z(this$1, p)
});
$c_sc_AbstractIterable.prototype.foreach__F1__V = (function(f) {
  var this$1 = this.iterator__sc_Iterator();
  $s_sc_Iterator$class__foreach__sc_Iterator__F1__V(this$1, f)
});
$c_sc_AbstractIterable.prototype.toStream__sci_Stream = (function() {
  return this.iterator__sc_Iterator().toStream__sci_Stream()
});
$c_sc_AbstractIterable.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_sc_IterableLike$class__copyToArray__sc_IterableLike__O__I__I__V(this, xs, start, len)
});
function $is_sc_AbstractIterable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_AbstractIterable)))
}
function $as_sc_AbstractIterable(obj) {
  return (($is_sc_AbstractIterable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.AbstractIterable"))
}
function $isArrayOf_sc_AbstractIterable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_AbstractIterable)))
}
function $asArrayOf_sc_AbstractIterable(obj, depth) {
  return (($isArrayOf_sc_AbstractIterable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.AbstractIterable;", depth))
}
function $is_sci_Iterable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Iterable)))
}
function $as_sci_Iterable(obj) {
  return (($is_sci_Iterable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Iterable"))
}
function $isArrayOf_sci_Iterable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Iterable)))
}
function $asArrayOf_sci_Iterable(obj, depth) {
  return (($isArrayOf_sci_Iterable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Iterable;", depth))
}
var $d_sci_Iterable = new $TypeData().initClass({
  sci_Iterable: 0
}, true, "scala.collection.immutable.Iterable", {
  sci_Iterable: 1,
  sci_Traversable: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  s_Immutable: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1
});
/** @constructor */
function $c_sci_StringOps() {
  $c_O.call(this);
  this.repr$1 = null
}
$c_sci_StringOps.prototype = new $h_O();
$c_sci_StringOps.prototype.constructor = $c_sci_StringOps;
/** @constructor */
function $h_sci_StringOps() {
  /*<skip>*/
}
$h_sci_StringOps.prototype = $c_sci_StringOps.prototype;
$c_sci_StringOps.prototype.seq__sc_TraversableOnce = (function() {
  var $$this = this.repr$1;
  return new $c_sci_WrappedString().init___T($$this)
});
$c_sci_StringOps.prototype.apply__I__O = (function(idx) {
  var $$this = this.repr$1;
  var c = (65535 & $uI($$this["charCodeAt"](idx)));
  return new $c_jl_Character().init___C(c)
});
$c_sci_StringOps.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_sci_StringOps.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_sci_StringOps.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_sci_StringOps.prototype.thisCollection__sc_Traversable = (function() {
  var $$this = this.repr$1;
  return new $c_sci_WrappedString().init___T($$this)
});
$c_sci_StringOps.prototype.equals__O__Z = (function(x$1) {
  return $m_sci_StringOps$().equals$extension__T__O__Z(this.repr$1, x$1)
});
$c_sci_StringOps.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, start, sep, end)
});
$c_sci_StringOps.prototype.toString__T = (function() {
  var $$this = this.repr$1;
  return $$this
});
$c_sci_StringOps.prototype.foreach__F1__V = (function(f) {
  $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V(this, f)
});
$c_sci_StringOps.prototype.size__I = (function() {
  var $$this = this.repr$1;
  return $uI($$this["length"])
});
$c_sci_StringOps.prototype.iterator__sc_Iterator = (function() {
  var $$this = this.repr$1;
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI($$this["length"]))
});
$c_sci_StringOps.prototype.length__I = (function() {
  var $$this = this.repr$1;
  return $uI($$this["length"])
});
$c_sci_StringOps.prototype.toStream__sci_Stream = (function() {
  var $$this = this.repr$1;
  var this$3 = new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI($$this["length"]));
  return $s_sc_Iterator$class__toStream__sc_Iterator__sci_Stream(this$3)
});
$c_sci_StringOps.prototype.thisCollection__sc_Seq = (function() {
  var $$this = this.repr$1;
  return new $c_sci_WrappedString().init___T($$this)
});
$c_sci_StringOps.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sci_StringOps.prototype.repr__O = (function() {
  return this.repr$1
});
$c_sci_StringOps.prototype.hashCode__I = (function() {
  var $$this = this.repr$1;
  return $m_sjsr_RuntimeString$().hashCode__T__I($$this)
});
$c_sci_StringOps.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_sc_IndexedSeqOptimized$class__copyToArray__sc_IndexedSeqOptimized__O__I__I__V(this, xs, start, len)
});
$c_sci_StringOps.prototype.init___T = (function(repr) {
  this.repr$1 = repr;
  return this
});
$c_sci_StringOps.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_StringBuilder().init___()
});
$c_sci_StringOps.prototype.stringPrefix__T = (function() {
  return $s_sc_TraversableLike$class__stringPrefix__sc_TraversableLike__T(this)
});
function $is_sci_StringOps(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_StringOps)))
}
function $as_sci_StringOps(obj) {
  return (($is_sci_StringOps(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.StringOps"))
}
function $isArrayOf_sci_StringOps(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_StringOps)))
}
function $asArrayOf_sci_StringOps(obj, depth) {
  return (($isArrayOf_sci_StringOps(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.StringOps;", depth))
}
var $d_sci_StringOps = new $TypeData().initClass({
  sci_StringOps: 0
}, false, "scala.collection.immutable.StringOps", {
  sci_StringOps: 1,
  O: 1,
  sci_StringLike: 1,
  sc_IndexedSeqOptimized: 1,
  sc_IndexedSeqLike: 1,
  sc_SeqLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenIterableLike: 1,
  sc_GenSeqLike: 1,
  s_math_Ordered: 1,
  jl_Comparable: 1
});
$c_sci_StringOps.prototype.$classData = $d_sci_StringOps;
function $is_sc_Seq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_Seq)))
}
function $as_sc_Seq(obj) {
  return (($is_sc_Seq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.Seq"))
}
function $isArrayOf_sc_Seq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_Seq)))
}
function $asArrayOf_sc_Seq(obj, depth) {
  return (($isArrayOf_sc_Seq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.Seq;", depth))
}
var $d_sc_Seq = new $TypeData().initClass({
  sc_Seq: 0
}, true, "scala.collection.Seq", {
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_Iterable: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1
});
function $is_sc_Set(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_Set)))
}
function $as_sc_Set(obj) {
  return (($is_sc_Set(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.Set"))
}
function $isArrayOf_sc_Set(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_Set)))
}
function $asArrayOf_sc_Set(obj, depth) {
  return (($isArrayOf_sc_Set(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.Set;", depth))
}
/** @constructor */
function $c_scm_AbstractIterable() {
  $c_sc_AbstractIterable.call(this)
}
$c_scm_AbstractIterable.prototype = new $h_sc_AbstractIterable();
$c_scm_AbstractIterable.prototype.constructor = $c_scm_AbstractIterable;
/** @constructor */
function $h_scm_AbstractIterable() {
  /*<skip>*/
}
$h_scm_AbstractIterable.prototype = $c_scm_AbstractIterable.prototype;
function $is_sjs_js_ArrayOps(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sjs_js_ArrayOps)))
}
function $as_sjs_js_ArrayOps(obj) {
  return (($is_sjs_js_ArrayOps(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.scalajs.js.ArrayOps"))
}
function $isArrayOf_sjs_js_ArrayOps(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sjs_js_ArrayOps)))
}
function $asArrayOf_sjs_js_ArrayOps(obj, depth) {
  return (($isArrayOf_sjs_js_ArrayOps(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.scalajs.js.ArrayOps;", depth))
}
function $is_sc_IndexedSeq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_IndexedSeq)))
}
function $as_sc_IndexedSeq(obj) {
  return (($is_sc_IndexedSeq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.IndexedSeq"))
}
function $isArrayOf_sc_IndexedSeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_IndexedSeq)))
}
function $asArrayOf_sc_IndexedSeq(obj, depth) {
  return (($isArrayOf_sc_IndexedSeq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.IndexedSeq;", depth))
}
function $is_sc_LinearSeq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_LinearSeq)))
}
function $as_sc_LinearSeq(obj) {
  return (($is_sc_LinearSeq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.LinearSeq"))
}
function $isArrayOf_sc_LinearSeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_LinearSeq)))
}
function $asArrayOf_sc_LinearSeq(obj, depth) {
  return (($isArrayOf_sc_LinearSeq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.LinearSeq;", depth))
}
/** @constructor */
function $c_sc_AbstractSeq() {
  $c_sc_AbstractIterable.call(this)
}
$c_sc_AbstractSeq.prototype = new $h_sc_AbstractIterable();
$c_sc_AbstractSeq.prototype.constructor = $c_sc_AbstractSeq;
/** @constructor */
function $h_sc_AbstractSeq() {
  /*<skip>*/
}
$h_sc_AbstractSeq.prototype = $c_sc_AbstractSeq.prototype;
$c_sc_AbstractSeq.prototype.isEmpty__Z = (function() {
  return $s_sc_SeqLike$class__isEmpty__sc_SeqLike__Z(this)
});
$c_sc_AbstractSeq.prototype.equals__O__Z = (function(that) {
  return $s_sc_GenSeqLike$class__equals__sc_GenSeqLike__O__Z(this, that)
});
$c_sc_AbstractSeq.prototype.toString__T = (function() {
  return $s_sc_TraversableLike$class__toString__sc_TraversableLike__T(this)
});
$c_sc_AbstractSeq.prototype.size__I = (function() {
  return this.length__I()
});
$c_sc_AbstractSeq.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sc_AbstractSeq.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this.seq__sc_Seq())
});
$c_sc_AbstractSeq.prototype.applyOrElse__O__F1__O = (function(x, $default) {
  return $s_s_PartialFunction$class__applyOrElse__s_PartialFunction__O__F1__O(this, x, $default)
});
/** @constructor */
function $c_sc_AbstractSet() {
  $c_sc_AbstractIterable.call(this)
}
$c_sc_AbstractSet.prototype = new $h_sc_AbstractIterable();
$c_sc_AbstractSet.prototype.constructor = $c_sc_AbstractSet;
/** @constructor */
function $h_sc_AbstractSet() {
  /*<skip>*/
}
$h_sc_AbstractSet.prototype = $c_sc_AbstractSet.prototype;
$c_sc_AbstractSet.prototype.isEmpty__Z = (function() {
  return $s_sc_SetLike$class__isEmpty__sc_SetLike__Z(this)
});
$c_sc_AbstractSet.prototype.equals__O__Z = (function(that) {
  return $s_sc_GenSetLike$class__equals__sc_GenSetLike__O__Z(this, that)
});
$c_sc_AbstractSet.prototype.toString__T = (function() {
  return $s_sc_TraversableLike$class__toString__sc_TraversableLike__T(this)
});
$c_sc_AbstractSet.prototype.subsetOf__sc_GenSet__Z = (function(that) {
  return this.forall__F1__Z(that)
});
$c_sc_AbstractSet.prototype.hashCode__I = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.unorderedHash__sc_TraversableOnce__I__I(this, this$1.setSeed$2)
});
$c_sc_AbstractSet.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_SetBuilder().init___sc_Set(this.empty__sc_Set())
});
$c_sc_AbstractSet.prototype.stringPrefix__T = (function() {
  return "Set"
});
/** @constructor */
function $c_sci_ListSet() {
  $c_sc_AbstractSet.call(this)
}
$c_sci_ListSet.prototype = new $h_sc_AbstractSet();
$c_sci_ListSet.prototype.constructor = $c_sci_ListSet;
/** @constructor */
function $h_sci_ListSet() {
  /*<skip>*/
}
$h_sci_ListSet.prototype = $c_sci_ListSet.prototype;
$c_sci_ListSet.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_ListSet.prototype.init___ = (function() {
  return this
});
$c_sci_ListSet.prototype.head__O = (function() {
  throw new $c_ju_NoSuchElementException().init___T("Set has no elements")
});
$c_sci_ListSet.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_ListSet.prototype.isEmpty__Z = (function() {
  return true
});
$c_sci_ListSet.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_ListSet.prototype.scala$collection$immutable$ListSet$$unchecked$undouter__sci_ListSet = (function() {
  throw new $c_ju_NoSuchElementException().init___T("Empty ListSet has no outer pointer")
});
$c_sci_ListSet.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_ListSet$()
});
$c_sci_ListSet.prototype.$$plus__O__sci_ListSet = (function(elem) {
  return new $c_sci_ListSet$Node().init___sci_ListSet__O(this, elem)
});
$c_sci_ListSet.prototype.size__I = (function() {
  return 0
});
$c_sci_ListSet.prototype.iterator__sc_Iterator = (function() {
  return new $c_sci_ListSet$$anon$1().init___sci_ListSet(this)
});
$c_sci_ListSet.prototype.empty__sc_Set = (function() {
  return $m_sci_ListSet$EmptyListSet$()
});
$c_sci_ListSet.prototype.contains__O__Z = (function(elem) {
  return false
});
$c_sci_ListSet.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_ListSet(elem)
});
$c_sci_ListSet.prototype.tail__sci_ListSet = (function() {
  throw new $c_ju_NoSuchElementException().init___T("Next of an empty set")
});
$c_sci_ListSet.prototype.stringPrefix__T = (function() {
  return "ListSet"
});
function $is_sci_ListSet(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_ListSet)))
}
function $as_sci_ListSet(obj) {
  return (($is_sci_ListSet(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.ListSet"))
}
function $isArrayOf_sci_ListSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_ListSet)))
}
function $asArrayOf_sci_ListSet(obj, depth) {
  return (($isArrayOf_sci_ListSet(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.ListSet;", depth))
}
/** @constructor */
function $c_sci_Set$EmptySet$() {
  $c_sc_AbstractSet.call(this)
}
$c_sci_Set$EmptySet$.prototype = new $h_sc_AbstractSet();
$c_sci_Set$EmptySet$.prototype.constructor = $c_sci_Set$EmptySet$;
/** @constructor */
function $h_sci_Set$EmptySet$() {
  /*<skip>*/
}
$h_sci_Set$EmptySet$.prototype = $c_sci_Set$EmptySet$.prototype;
$c_sci_Set$EmptySet$.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Set$EmptySet$.prototype.init___ = (function() {
  $n_sci_Set$EmptySet$ = this;
  return this
});
$c_sci_Set$EmptySet$.prototype.apply__O__O = (function(v1) {
  return false
});
$c_sci_Set$EmptySet$.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Set$EmptySet$.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Set$()
});
$c_sci_Set$EmptySet$.prototype.foreach__F1__V = (function(f) {
  /*<skip>*/
});
$c_sci_Set$EmptySet$.prototype.size__I = (function() {
  return 0
});
$c_sci_Set$EmptySet$.prototype.iterator__sc_Iterator = (function() {
  return $m_sc_Iterator$().empty$1
});
$c_sci_Set$EmptySet$.prototype.empty__sc_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
$c_sci_Set$EmptySet$.prototype.$$plus__O__sc_Set = (function(elem) {
  return new $c_sci_Set$Set1().init___O(elem)
});
var $d_sci_Set$EmptySet$ = new $TypeData().initClass({
  sci_Set$EmptySet$: 0
}, false, "scala.collection.immutable.Set$EmptySet$", {
  sci_Set$EmptySet$: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Set$EmptySet$.prototype.$classData = $d_sci_Set$EmptySet$;
var $n_sci_Set$EmptySet$ = (void 0);
function $m_sci_Set$EmptySet$() {
  if ((!$n_sci_Set$EmptySet$)) {
    $n_sci_Set$EmptySet$ = new $c_sci_Set$EmptySet$().init___()
  };
  return $n_sci_Set$EmptySet$
}
/** @constructor */
function $c_sci_Set$Set1() {
  $c_sc_AbstractSet.call(this);
  this.elem1$4 = null
}
$c_sci_Set$Set1.prototype = new $h_sc_AbstractSet();
$c_sci_Set$Set1.prototype.constructor = $c_sci_Set$Set1;
/** @constructor */
function $h_sci_Set$Set1() {
  /*<skip>*/
}
$h_sci_Set$Set1.prototype = $c_sci_Set$Set1.prototype;
$c_sci_Set$Set1.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Set$Set1.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_Set$Set1.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Set$Set1.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Set$()
});
$c_sci_Set$Set1.prototype.forall__F1__Z = (function(f) {
  return $uZ(f.apply__O__O(this.elem1$4))
});
$c_sci_Set$Set1.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(this.elem1$4)
});
$c_sci_Set$Set1.prototype.size__I = (function() {
  return 1
});
$c_sci_Set$Set1.prototype.init___O = (function(elem1) {
  this.elem1$4 = elem1;
  return this
});
$c_sci_Set$Set1.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.elem1$4]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6["length"]))
});
$c_sci_Set$Set1.prototype.empty__sc_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
$c_sci_Set$Set1.prototype.$$plus__O__sci_Set = (function(elem) {
  return (this.contains__O__Z(elem) ? this : new $c_sci_Set$Set2().init___O__O(this.elem1$4, elem))
});
$c_sci_Set$Set1.prototype.contains__O__Z = (function(elem) {
  return $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem1$4)
});
$c_sci_Set$Set1.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_Set(elem)
});
var $d_sci_Set$Set1 = new $TypeData().initClass({
  sci_Set$Set1: 0
}, false, "scala.collection.immutable.Set$Set1", {
  sci_Set$Set1: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Set$Set1.prototype.$classData = $d_sci_Set$Set1;
/** @constructor */
function $c_sci_Set$Set2() {
  $c_sc_AbstractSet.call(this);
  this.elem1$4 = null;
  this.elem2$4 = null
}
$c_sci_Set$Set2.prototype = new $h_sc_AbstractSet();
$c_sci_Set$Set2.prototype.constructor = $c_sci_Set$Set2;
/** @constructor */
function $h_sci_Set$Set2() {
  /*<skip>*/
}
$h_sci_Set$Set2.prototype = $c_sci_Set$Set2.prototype;
$c_sci_Set$Set2.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Set$Set2.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_Set$Set2.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Set$Set2.prototype.init___O__O = (function(elem1, elem2) {
  this.elem1$4 = elem1;
  this.elem2$4 = elem2;
  return this
});
$c_sci_Set$Set2.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Set$()
});
$c_sci_Set$Set2.prototype.forall__F1__Z = (function(f) {
  return ($uZ(f.apply__O__O(this.elem1$4)) && $uZ(f.apply__O__O(this.elem2$4)))
});
$c_sci_Set$Set2.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(this.elem1$4);
  f.apply__O__O(this.elem2$4)
});
$c_sci_Set$Set2.prototype.size__I = (function() {
  return 2
});
$c_sci_Set$Set2.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.elem1$4, this.elem2$4]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6["length"]))
});
$c_sci_Set$Set2.prototype.empty__sc_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
$c_sci_Set$Set2.prototype.$$plus__O__sci_Set = (function(elem) {
  return (this.contains__O__Z(elem) ? this : new $c_sci_Set$Set3().init___O__O__O(this.elem1$4, this.elem2$4, elem))
});
$c_sci_Set$Set2.prototype.contains__O__Z = (function(elem) {
  return ($m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem1$4) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem2$4))
});
$c_sci_Set$Set2.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_Set(elem)
});
var $d_sci_Set$Set2 = new $TypeData().initClass({
  sci_Set$Set2: 0
}, false, "scala.collection.immutable.Set$Set2", {
  sci_Set$Set2: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Set$Set2.prototype.$classData = $d_sci_Set$Set2;
/** @constructor */
function $c_sci_Set$Set3() {
  $c_sc_AbstractSet.call(this);
  this.elem1$4 = null;
  this.elem2$4 = null;
  this.elem3$4 = null
}
$c_sci_Set$Set3.prototype = new $h_sc_AbstractSet();
$c_sci_Set$Set3.prototype.constructor = $c_sci_Set$Set3;
/** @constructor */
function $h_sci_Set$Set3() {
  /*<skip>*/
}
$h_sci_Set$Set3.prototype = $c_sci_Set$Set3.prototype;
$c_sci_Set$Set3.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Set$Set3.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_Set$Set3.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Set$Set3.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Set$()
});
$c_sci_Set$Set3.prototype.forall__F1__Z = (function(f) {
  return (($uZ(f.apply__O__O(this.elem1$4)) && $uZ(f.apply__O__O(this.elem2$4))) && $uZ(f.apply__O__O(this.elem3$4)))
});
$c_sci_Set$Set3.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(this.elem1$4);
  f.apply__O__O(this.elem2$4);
  f.apply__O__O(this.elem3$4)
});
$c_sci_Set$Set3.prototype.init___O__O__O = (function(elem1, elem2, elem3) {
  this.elem1$4 = elem1;
  this.elem2$4 = elem2;
  this.elem3$4 = elem3;
  return this
});
$c_sci_Set$Set3.prototype.size__I = (function() {
  return 3
});
$c_sci_Set$Set3.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.elem1$4, this.elem2$4, this.elem3$4]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6["length"]))
});
$c_sci_Set$Set3.prototype.empty__sc_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
$c_sci_Set$Set3.prototype.$$plus__O__sci_Set = (function(elem) {
  return (this.contains__O__Z(elem) ? this : new $c_sci_Set$Set4().init___O__O__O__O(this.elem1$4, this.elem2$4, this.elem3$4, elem))
});
$c_sci_Set$Set3.prototype.contains__O__Z = (function(elem) {
  return (($m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem1$4) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem2$4)) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem3$4))
});
$c_sci_Set$Set3.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_Set(elem)
});
var $d_sci_Set$Set3 = new $TypeData().initClass({
  sci_Set$Set3: 0
}, false, "scala.collection.immutable.Set$Set3", {
  sci_Set$Set3: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Set$Set3.prototype.$classData = $d_sci_Set$Set3;
/** @constructor */
function $c_sci_Set$Set4() {
  $c_sc_AbstractSet.call(this);
  this.elem1$4 = null;
  this.elem2$4 = null;
  this.elem3$4 = null;
  this.elem4$4 = null
}
$c_sci_Set$Set4.prototype = new $h_sc_AbstractSet();
$c_sci_Set$Set4.prototype.constructor = $c_sci_Set$Set4;
/** @constructor */
function $h_sci_Set$Set4() {
  /*<skip>*/
}
$h_sci_Set$Set4.prototype = $c_sci_Set$Set4.prototype;
$c_sci_Set$Set4.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Set$Set4.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_Set$Set4.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Set$Set4.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Set$()
});
$c_sci_Set$Set4.prototype.forall__F1__Z = (function(f) {
  return ((($uZ(f.apply__O__O(this.elem1$4)) && $uZ(f.apply__O__O(this.elem2$4))) && $uZ(f.apply__O__O(this.elem3$4))) && $uZ(f.apply__O__O(this.elem4$4)))
});
$c_sci_Set$Set4.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(this.elem1$4);
  f.apply__O__O(this.elem2$4);
  f.apply__O__O(this.elem3$4);
  f.apply__O__O(this.elem4$4)
});
$c_sci_Set$Set4.prototype.size__I = (function() {
  return 4
});
$c_sci_Set$Set4.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.elem1$4, this.elem2$4, this.elem3$4, this.elem4$4]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6["length"]))
});
$c_sci_Set$Set4.prototype.empty__sc_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
$c_sci_Set$Set4.prototype.$$plus__O__sci_Set = (function(elem) {
  if (this.contains__O__Z(elem)) {
    return this
  } else {
    var this$1 = new $c_sci_HashSet().init___();
    var elem1 = this.elem1$4;
    var elem2 = this.elem2$4;
    var array = [this.elem3$4, this.elem4$4, elem];
    var this$2 = this$1.$$plus__O__sci_HashSet(elem1).$$plus__O__sci_HashSet(elem2);
    var start = 0;
    var end = $uI(array["length"]);
    var z = this$2;
    x: {
      var jsx$1;
      _foldl: while (true) {
        if ((start === end)) {
          var jsx$1 = z;
          break x
        } else {
          var temp$start = ((1 + start) | 0);
          var arg1 = z;
          var index = start;
          var arg2 = array[index];
          var x$2 = $as_sc_Set(arg1);
          var temp$z = x$2.$$plus__O__sc_Set(arg2);
          start = temp$start;
          z = temp$z;
          continue _foldl
        }
      }
    };
    return $as_sci_HashSet($as_sc_Set(jsx$1))
  }
});
$c_sci_Set$Set4.prototype.contains__O__Z = (function(elem) {
  return ((($m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem1$4) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem2$4)) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem3$4)) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem4$4))
});
$c_sci_Set$Set4.prototype.init___O__O__O__O = (function(elem1, elem2, elem3, elem4) {
  this.elem1$4 = elem1;
  this.elem2$4 = elem2;
  this.elem3$4 = elem3;
  this.elem4$4 = elem4;
  return this
});
$c_sci_Set$Set4.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_Set(elem)
});
var $d_sci_Set$Set4 = new $TypeData().initClass({
  sci_Set$Set4: 0
}, false, "scala.collection.immutable.Set$Set4", {
  sci_Set$Set4: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Set$Set4.prototype.$classData = $d_sci_Set$Set4;
/** @constructor */
function $c_sci_HashSet() {
  $c_sc_AbstractSet.call(this)
}
$c_sci_HashSet.prototype = new $h_sc_AbstractSet();
$c_sci_HashSet.prototype.constructor = $c_sci_HashSet;
/** @constructor */
function $h_sci_HashSet() {
  /*<skip>*/
}
$h_sci_HashSet.prototype = $c_sci_HashSet.prototype;
$c_sci_HashSet.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_HashSet.prototype.updated0__O__I__I__sci_HashSet = (function(key, hash, level) {
  return new $c_sci_HashSet$HashSet1().init___O__I(key, hash)
});
$c_sci_HashSet.prototype.computeHash__O__I = (function(key) {
  return this.improve__I__I($m_sr_ScalaRunTime$().hash__O__I(key))
});
$c_sci_HashSet.prototype.init___ = (function() {
  return this
});
$c_sci_HashSet.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_HashSet.prototype.$$plus__O__sci_HashSet = (function(e) {
  return this.updated0__O__I__I__sci_HashSet(e, this.computeHash__O__I(e), 0)
});
$c_sci_HashSet.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_HashSet.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_HashSet$()
});
$c_sci_HashSet.prototype.foreach__F1__V = (function(f) {
  /*<skip>*/
});
$c_sci_HashSet.prototype.subsetOf__sc_GenSet__Z = (function(that) {
  if ($is_sci_HashSet(that)) {
    var x2 = $as_sci_HashSet(that);
    return this.subsetOf0__sci_HashSet__I__Z(x2, 0)
  } else {
    var this$1 = this.iterator__sc_Iterator();
    return $s_sc_Iterator$class__forall__sc_Iterator__F1__Z(this$1, that)
  }
});
$c_sci_HashSet.prototype.size__I = (function() {
  return 0
});
$c_sci_HashSet.prototype.iterator__sc_Iterator = (function() {
  return $m_sc_Iterator$().empty$1
});
$c_sci_HashSet.prototype.empty__sc_Set = (function() {
  return $m_sci_HashSet$EmptyHashSet$()
});
$c_sci_HashSet.prototype.improve__I__I = (function(hcode) {
  var h = ((hcode + (~(hcode << 9))) | 0);
  h = (h ^ ((h >>> 14) | 0));
  h = ((h + (h << 4)) | 0);
  return (h ^ ((h >>> 10) | 0))
});
$c_sci_HashSet.prototype.contains__O__Z = (function(e) {
  return this.get0__O__I__I__Z(e, this.computeHash__O__I(e), 0)
});
$c_sci_HashSet.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_HashSet(elem)
});
$c_sci_HashSet.prototype.get0__O__I__I__Z = (function(key, hash, level) {
  return false
});
$c_sci_HashSet.prototype.subsetOf0__sci_HashSet__I__Z = (function(that, level) {
  return true
});
function $is_sci_HashSet(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_HashSet)))
}
function $as_sci_HashSet(obj) {
  return (($is_sci_HashSet(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.HashSet"))
}
function $isArrayOf_sci_HashSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_HashSet)))
}
function $asArrayOf_sci_HashSet(obj, depth) {
  return (($isArrayOf_sci_HashSet(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.HashSet;", depth))
}
var $d_sci_HashSet = new $TypeData().initClass({
  sci_HashSet: 0
}, false, "scala.collection.immutable.HashSet", {
  sci_HashSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet.prototype.$classData = $d_sci_HashSet;
/** @constructor */
function $c_sci_ListSet$EmptyListSet$() {
  $c_sci_ListSet.call(this)
}
$c_sci_ListSet$EmptyListSet$.prototype = new $h_sci_ListSet();
$c_sci_ListSet$EmptyListSet$.prototype.constructor = $c_sci_ListSet$EmptyListSet$;
/** @constructor */
function $h_sci_ListSet$EmptyListSet$() {
  /*<skip>*/
}
$h_sci_ListSet$EmptyListSet$.prototype = $c_sci_ListSet$EmptyListSet$.prototype;
var $d_sci_ListSet$EmptyListSet$ = new $TypeData().initClass({
  sci_ListSet$EmptyListSet$: 0
}, false, "scala.collection.immutable.ListSet$EmptyListSet$", {
  sci_ListSet$EmptyListSet$: 1,
  sci_ListSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_ListSet$EmptyListSet$.prototype.$classData = $d_sci_ListSet$EmptyListSet$;
var $n_sci_ListSet$EmptyListSet$ = (void 0);
function $m_sci_ListSet$EmptyListSet$() {
  if ((!$n_sci_ListSet$EmptyListSet$)) {
    $n_sci_ListSet$EmptyListSet$ = new $c_sci_ListSet$EmptyListSet$().init___()
  };
  return $n_sci_ListSet$EmptyListSet$
}
/** @constructor */
function $c_sci_ListSet$Node() {
  $c_sci_ListSet.call(this);
  this.head$5 = null;
  this.$$outer$f = null
}
$c_sci_ListSet$Node.prototype = new $h_sci_ListSet();
$c_sci_ListSet$Node.prototype.constructor = $c_sci_ListSet$Node;
/** @constructor */
function $h_sci_ListSet$Node() {
  /*<skip>*/
}
$h_sci_ListSet$Node.prototype = $c_sci_ListSet$Node.prototype;
$c_sci_ListSet$Node.prototype.head__O = (function() {
  return this.head$5
});
$c_sci_ListSet$Node.prototype.isEmpty__Z = (function() {
  return false
});
$c_sci_ListSet$Node.prototype.scala$collection$immutable$ListSet$$unchecked$undouter__sci_ListSet = (function() {
  return this.$$outer$f
});
$c_sci_ListSet$Node.prototype.$$plus__O__sci_ListSet = (function(e) {
  return (this.containsInternal__p5__sci_ListSet__O__Z(this, e) ? this : new $c_sci_ListSet$Node().init___sci_ListSet__O(this, e))
});
$c_sci_ListSet$Node.prototype.sizeInternal__p5__sci_ListSet__I__I = (function(n, acc) {
  _sizeInternal: while (true) {
    if (n.isEmpty__Z()) {
      return acc
    } else {
      var temp$n = n.scala$collection$immutable$ListSet$$unchecked$undouter__sci_ListSet();
      var temp$acc = ((1 + acc) | 0);
      n = temp$n;
      acc = temp$acc;
      continue _sizeInternal
    }
  }
});
$c_sci_ListSet$Node.prototype.size__I = (function() {
  return this.sizeInternal__p5__sci_ListSet__I__I(this, 0)
});
$c_sci_ListSet$Node.prototype.init___sci_ListSet__O = (function($$outer, head) {
  this.head$5 = head;
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  return this
});
$c_sci_ListSet$Node.prototype.contains__O__Z = (function(e) {
  return this.containsInternal__p5__sci_ListSet__O__Z(this, e)
});
$c_sci_ListSet$Node.prototype.containsInternal__p5__sci_ListSet__O__Z = (function(n, e) {
  _containsInternal: while (true) {
    if ((!n.isEmpty__Z())) {
      if ($m_sr_BoxesRunTime$().equals__O__O__Z(n.head__O(), e)) {
        return true
      } else {
        n = n.scala$collection$immutable$ListSet$$unchecked$undouter__sci_ListSet();
        continue _containsInternal
      }
    } else {
      return false
    }
  }
});
$c_sci_ListSet$Node.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_ListSet(elem)
});
$c_sci_ListSet$Node.prototype.tail__sci_ListSet = (function() {
  return this.$$outer$f
});
var $d_sci_ListSet$Node = new $TypeData().initClass({
  sci_ListSet$Node: 0
}, false, "scala.collection.immutable.ListSet$Node", {
  sci_ListSet$Node: 1,
  sci_ListSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_ListSet$Node.prototype.$classData = $d_sci_ListSet$Node;
/** @constructor */
function $c_scm_AbstractSeq() {
  $c_sc_AbstractSeq.call(this)
}
$c_scm_AbstractSeq.prototype = new $h_sc_AbstractSeq();
$c_scm_AbstractSeq.prototype.constructor = $c_scm_AbstractSeq;
/** @constructor */
function $h_scm_AbstractSeq() {
  /*<skip>*/
}
$h_scm_AbstractSeq.prototype = $c_scm_AbstractSeq.prototype;
$c_scm_AbstractSeq.prototype.seq__sc_TraversableOnce = (function() {
  return this.seq__scm_Seq()
});
$c_scm_AbstractSeq.prototype.seq__scm_Seq = (function() {
  return this
});
/** @constructor */
function $c_sci_HashSet$EmptyHashSet$() {
  $c_sci_HashSet.call(this)
}
$c_sci_HashSet$EmptyHashSet$.prototype = new $h_sci_HashSet();
$c_sci_HashSet$EmptyHashSet$.prototype.constructor = $c_sci_HashSet$EmptyHashSet$;
/** @constructor */
function $h_sci_HashSet$EmptyHashSet$() {
  /*<skip>*/
}
$h_sci_HashSet$EmptyHashSet$.prototype = $c_sci_HashSet$EmptyHashSet$.prototype;
var $d_sci_HashSet$EmptyHashSet$ = new $TypeData().initClass({
  sci_HashSet$EmptyHashSet$: 0
}, false, "scala.collection.immutable.HashSet$EmptyHashSet$", {
  sci_HashSet$EmptyHashSet$: 1,
  sci_HashSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet$EmptyHashSet$.prototype.$classData = $d_sci_HashSet$EmptyHashSet$;
var $n_sci_HashSet$EmptyHashSet$ = (void 0);
function $m_sci_HashSet$EmptyHashSet$() {
  if ((!$n_sci_HashSet$EmptyHashSet$)) {
    $n_sci_HashSet$EmptyHashSet$ = new $c_sci_HashSet$EmptyHashSet$().init___()
  };
  return $n_sci_HashSet$EmptyHashSet$
}
/** @constructor */
function $c_sci_HashSet$HashTrieSet() {
  $c_sci_HashSet.call(this);
  this.bitmap$5 = 0;
  this.elems$5 = null;
  this.size0$5 = 0
}
$c_sci_HashSet$HashTrieSet.prototype = new $h_sci_HashSet();
$c_sci_HashSet$HashTrieSet.prototype.constructor = $c_sci_HashSet$HashTrieSet;
/** @constructor */
function $h_sci_HashSet$HashTrieSet() {
  /*<skip>*/
}
$h_sci_HashSet$HashTrieSet.prototype = $c_sci_HashSet$HashTrieSet.prototype;
$c_sci_HashSet$HashTrieSet.prototype.updated0__O__I__I__sci_HashSet = (function(key, hash, level) {
  var index = (31 & ((hash >>> level) | 0));
  var mask = (1 << index);
  var offset = $m_jl_Integer$().bitCount__I__I((this.bitmap$5 & (((-1) + mask) | 0)));
  if (((this.bitmap$5 & mask) !== 0)) {
    var sub = this.elems$5.u[offset];
    var subNew = sub.updated0__O__I__I__sci_HashSet(key, hash, ((5 + level) | 0));
    if ((sub === subNew)) {
      return this
    } else {
      var elemsNew = $newArrayObject($d_sci_HashSet.getArrayOf(), [this.elems$5.u["length"]]);
      $m_s_Array$().copy__O__I__O__I__I__V(this.elems$5, 0, elemsNew, 0, this.elems$5.u["length"]);
      elemsNew.u[offset] = subNew;
      return new $c_sci_HashSet$HashTrieSet().init___I__Asci_HashSet__I(this.bitmap$5, elemsNew, ((this.size0$5 + ((subNew.size__I() - sub.size__I()) | 0)) | 0))
    }
  } else {
    var elemsNew$2 = $newArrayObject($d_sci_HashSet.getArrayOf(), [((1 + this.elems$5.u["length"]) | 0)]);
    $m_s_Array$().copy__O__I__O__I__I__V(this.elems$5, 0, elemsNew$2, 0, offset);
    elemsNew$2.u[offset] = new $c_sci_HashSet$HashSet1().init___O__I(key, hash);
    $m_s_Array$().copy__O__I__O__I__I__V(this.elems$5, offset, elemsNew$2, ((1 + offset) | 0), ((this.elems$5.u["length"] - offset) | 0));
    var bitmapNew = (this.bitmap$5 | mask);
    return new $c_sci_HashSet$HashTrieSet().init___I__Asci_HashSet__I(bitmapNew, elemsNew$2, ((1 + this.size0$5) | 0))
  }
});
$c_sci_HashSet$HashTrieSet.prototype.foreach__F1__V = (function(f) {
  var i = 0;
  while ((i < this.elems$5.u["length"])) {
    this.elems$5.u[i].foreach__F1__V(f);
    i = ((1 + i) | 0)
  }
});
$c_sci_HashSet$HashTrieSet.prototype.iterator__sc_Iterator = (function() {
  return new $c_sci_HashSet$HashTrieSet$$anon$1().init___sci_HashSet$HashTrieSet(this)
});
$c_sci_HashSet$HashTrieSet.prototype.size__I = (function() {
  return this.size0$5
});
$c_sci_HashSet$HashTrieSet.prototype.init___I__Asci_HashSet__I = (function(bitmap, elems, size0) {
  this.bitmap$5 = bitmap;
  this.elems$5 = elems;
  this.size0$5 = size0;
  $m_s_Predef$().assert__Z__V(($m_jl_Integer$().bitCount__I__I(bitmap) === elems.u["length"]));
  return this
});
$c_sci_HashSet$HashTrieSet.prototype.get0__O__I__I__Z = (function(key, hash, level) {
  var index = (31 & ((hash >>> level) | 0));
  var mask = (1 << index);
  if ((this.bitmap$5 === (-1))) {
    return this.elems$5.u[(31 & index)].get0__O__I__I__Z(key, hash, ((5 + level) | 0))
  } else if (((this.bitmap$5 & mask) !== 0)) {
    var offset = $m_jl_Integer$().bitCount__I__I((this.bitmap$5 & (((-1) + mask) | 0)));
    return this.elems$5.u[offset].get0__O__I__I__Z(key, hash, ((5 + level) | 0))
  } else {
    return false
  }
});
$c_sci_HashSet$HashTrieSet.prototype.subsetOf0__sci_HashSet__I__Z = (function(that, level) {
  if ((that === this)) {
    return true
  } else {
    if ($is_sci_HashSet$HashTrieSet(that)) {
      var x2 = $as_sci_HashSet$HashTrieSet(that);
      if ((this.size0$5 <= x2.size0$5)) {
        var abm = this.bitmap$5;
        var a = this.elems$5;
        var ai = 0;
        var b = x2.elems$5;
        var bbm = x2.bitmap$5;
        var bi = 0;
        if (((abm & bbm) === abm)) {
          while ((abm !== 0)) {
            var alsb = (abm ^ (abm & (((-1) + abm) | 0)));
            var blsb = (bbm ^ (bbm & (((-1) + bbm) | 0)));
            if ((alsb === blsb)) {
              if ((!a.u[ai].subsetOf0__sci_HashSet__I__Z(b.u[bi], ((5 + level) | 0)))) {
                return false
              };
              abm = (abm & (~alsb));
              ai = ((1 + ai) | 0)
            };
            bbm = (bbm & (~blsb));
            bi = ((1 + bi) | 0)
          };
          return true
        } else {
          return false
        }
      }
    };
    return false
  }
});
function $is_sci_HashSet$HashTrieSet(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_HashSet$HashTrieSet)))
}
function $as_sci_HashSet$HashTrieSet(obj) {
  return (($is_sci_HashSet$HashTrieSet(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.HashSet$HashTrieSet"))
}
function $isArrayOf_sci_HashSet$HashTrieSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_HashSet$HashTrieSet)))
}
function $asArrayOf_sci_HashSet$HashTrieSet(obj, depth) {
  return (($isArrayOf_sci_HashSet$HashTrieSet(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.HashSet$HashTrieSet;", depth))
}
var $d_sci_HashSet$HashTrieSet = new $TypeData().initClass({
  sci_HashSet$HashTrieSet: 0
}, false, "scala.collection.immutable.HashSet$HashTrieSet", {
  sci_HashSet$HashTrieSet: 1,
  sci_HashSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet$HashTrieSet.prototype.$classData = $d_sci_HashSet$HashTrieSet;
/** @constructor */
function $c_sci_HashSet$LeafHashSet() {
  $c_sci_HashSet.call(this)
}
$c_sci_HashSet$LeafHashSet.prototype = new $h_sci_HashSet();
$c_sci_HashSet$LeafHashSet.prototype.constructor = $c_sci_HashSet$LeafHashSet;
/** @constructor */
function $h_sci_HashSet$LeafHashSet() {
  /*<skip>*/
}
$h_sci_HashSet$LeafHashSet.prototype = $c_sci_HashSet$LeafHashSet.prototype;
/** @constructor */
function $c_sci_HashSet$HashSet1() {
  $c_sci_HashSet$LeafHashSet.call(this);
  this.key$6 = null;
  this.hash$6 = 0
}
$c_sci_HashSet$HashSet1.prototype = new $h_sci_HashSet$LeafHashSet();
$c_sci_HashSet$HashSet1.prototype.constructor = $c_sci_HashSet$HashSet1;
/** @constructor */
function $h_sci_HashSet$HashSet1() {
  /*<skip>*/
}
$h_sci_HashSet$HashSet1.prototype = $c_sci_HashSet$HashSet1.prototype;
$c_sci_HashSet$HashSet1.prototype.updated0__O__I__I__sci_HashSet = (function(key, hash, level) {
  if (((hash === this.hash$6) && $m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key$6))) {
    return this
  } else if ((hash !== this.hash$6)) {
    return $m_sci_HashSet$().scala$collection$immutable$HashSet$$makeHashTrieSet__I__sci_HashSet__I__sci_HashSet__I__sci_HashSet$HashTrieSet(this.hash$6, this, hash, new $c_sci_HashSet$HashSet1().init___O__I(key, hash), level)
  } else {
    var this$2 = $m_sci_ListSet$EmptyListSet$();
    var elem = this.key$6;
    return new $c_sci_HashSet$HashSetCollision1().init___I__sci_ListSet(hash, new $c_sci_ListSet$Node().init___sci_ListSet__O(this$2, elem).$$plus__O__sci_ListSet(key))
  }
});
$c_sci_HashSet$HashSet1.prototype.init___O__I = (function(key, hash) {
  this.key$6 = key;
  this.hash$6 = hash;
  return this
});
$c_sci_HashSet$HashSet1.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(this.key$6)
});
$c_sci_HashSet$HashSet1.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.key$6]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6["length"]))
});
$c_sci_HashSet$HashSet1.prototype.size__I = (function() {
  return 1
});
$c_sci_HashSet$HashSet1.prototype.get0__O__I__I__Z = (function(key, hash, level) {
  return ((hash === this.hash$6) && $m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key$6))
});
$c_sci_HashSet$HashSet1.prototype.subsetOf0__sci_HashSet__I__Z = (function(that, level) {
  return that.get0__O__I__I__Z(this.key$6, this.hash$6, level)
});
function $is_sci_HashSet$HashSet1(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_HashSet$HashSet1)))
}
function $as_sci_HashSet$HashSet1(obj) {
  return (($is_sci_HashSet$HashSet1(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.HashSet$HashSet1"))
}
function $isArrayOf_sci_HashSet$HashSet1(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_HashSet$HashSet1)))
}
function $asArrayOf_sci_HashSet$HashSet1(obj, depth) {
  return (($isArrayOf_sci_HashSet$HashSet1(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.HashSet$HashSet1;", depth))
}
var $d_sci_HashSet$HashSet1 = new $TypeData().initClass({
  sci_HashSet$HashSet1: 0
}, false, "scala.collection.immutable.HashSet$HashSet1", {
  sci_HashSet$HashSet1: 1,
  sci_HashSet$LeafHashSet: 1,
  sci_HashSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet$HashSet1.prototype.$classData = $d_sci_HashSet$HashSet1;
/** @constructor */
function $c_sci_HashSet$HashSetCollision1() {
  $c_sci_HashSet$LeafHashSet.call(this);
  this.hash$6 = 0;
  this.ks$6 = null
}
$c_sci_HashSet$HashSetCollision1.prototype = new $h_sci_HashSet$LeafHashSet();
$c_sci_HashSet$HashSetCollision1.prototype.constructor = $c_sci_HashSet$HashSetCollision1;
/** @constructor */
function $h_sci_HashSet$HashSetCollision1() {
  /*<skip>*/
}
$h_sci_HashSet$HashSetCollision1.prototype = $c_sci_HashSet$HashSetCollision1.prototype;
$c_sci_HashSet$HashSetCollision1.prototype.updated0__O__I__I__sci_HashSet = (function(key, hash, level) {
  return ((hash === this.hash$6) ? new $c_sci_HashSet$HashSetCollision1().init___I__sci_ListSet(hash, this.ks$6.$$plus__O__sci_ListSet(key)) : $m_sci_HashSet$().scala$collection$immutable$HashSet$$makeHashTrieSet__I__sci_HashSet__I__sci_HashSet__I__sci_HashSet$HashTrieSet(this.hash$6, this, hash, new $c_sci_HashSet$HashSet1().init___O__I(key, hash), level))
});
$c_sci_HashSet$HashSetCollision1.prototype.foreach__F1__V = (function(f) {
  var this$1 = this.ks$6;
  var this$2 = new $c_sci_ListSet$$anon$1().init___sci_ListSet(this$1);
  $s_sc_Iterator$class__foreach__sc_Iterator__F1__V(this$2, f)
});
$c_sci_HashSet$HashSetCollision1.prototype.iterator__sc_Iterator = (function() {
  var this$1 = this.ks$6;
  return new $c_sci_ListSet$$anon$1().init___sci_ListSet(this$1)
});
$c_sci_HashSet$HashSetCollision1.prototype.size__I = (function() {
  return this.ks$6.size__I()
});
$c_sci_HashSet$HashSetCollision1.prototype.init___I__sci_ListSet = (function(hash, ks) {
  this.hash$6 = hash;
  this.ks$6 = ks;
  return this
});
$c_sci_HashSet$HashSetCollision1.prototype.get0__O__I__I__Z = (function(key, hash, level) {
  return ((hash === this.hash$6) && this.ks$6.contains__O__Z(key))
});
$c_sci_HashSet$HashSetCollision1.prototype.subsetOf0__sci_HashSet__I__Z = (function(that, level) {
  var this$1 = this.ks$6;
  var this$2 = new $c_sci_ListSet$$anon$1().init___sci_ListSet(this$1);
  var res = true;
  while (true) {
    if (res) {
      var this$3 = this$2.that$2;
      var jsx$1 = $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$3)
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      var arg1 = this$2.next__O();
      res = that.get0__O__I__I__Z(arg1, this.hash$6, level)
    } else {
      break
    }
  };
  return res
});
var $d_sci_HashSet$HashSetCollision1 = new $TypeData().initClass({
  sci_HashSet$HashSetCollision1: 0
}, false, "scala.collection.immutable.HashSet$HashSetCollision1", {
  sci_HashSet$HashSetCollision1: 1,
  sci_HashSet$LeafHashSet: 1,
  sci_HashSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet$HashSetCollision1.prototype.$classData = $d_sci_HashSet$HashSetCollision1;
/** @constructor */
function $c_sci_List() {
  $c_sc_AbstractSeq.call(this)
}
$c_sci_List.prototype = new $h_sc_AbstractSeq();
$c_sci_List.prototype.constructor = $c_sci_List;
/** @constructor */
function $h_sci_List() {
  /*<skip>*/
}
$h_sci_List.prototype = $c_sci_List.prototype;
$c_sci_List.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_List.prototype.init___ = (function() {
  return this
});
$c_sci_List.prototype.apply__I__O = (function(n) {
  return $s_sc_LinearSeqOptimized$class__apply__sc_LinearSeqOptimized__I__O(this, n)
});
$c_sci_List.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_LinearSeqOptimized$class__lengthCompare__sc_LinearSeqOptimized__I__I(this, len)
});
$c_sci_List.prototype.apply__O__O = (function(v1) {
  var n = $uI(v1);
  return $s_sc_LinearSeqOptimized$class__apply__sc_LinearSeqOptimized__I__O(this, n)
});
$c_sci_List.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_LinearSeqOptimized$class__sameElements__sc_LinearSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_sci_List.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_List.prototype.drop__I__sc_LinearSeqOptimized = (function(n) {
  return this.drop__I__sci_List(n)
});
$c_sci_List.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_List$()
});
$c_sci_List.prototype.foreach__F1__V = (function(f) {
  var these = this;
  while ((!these.isEmpty__Z())) {
    f.apply__O__O(these.head__O());
    var this$1 = these;
    these = this$1.tail__sci_List()
  }
});
$c_sci_List.prototype.iterator__sc_Iterator = (function() {
  return new $c_sc_LinearSeqLike$$anon$1().init___sc_LinearSeqLike(this)
});
$c_sci_List.prototype.drop__I__sci_List = (function(n) {
  var these = this;
  var count = n;
  while (((!these.isEmpty__Z()) && (count > 0))) {
    var this$1 = these;
    these = this$1.tail__sci_List();
    count = (((-1) + count) | 0)
  };
  return these
});
$c_sci_List.prototype.length__I = (function() {
  return $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(this)
});
$c_sci_List.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sci_List.prototype.toStream__sci_Stream = (function() {
  return (this.isEmpty__Z() ? $m_sci_Stream$Empty$() : new $c_sci_Stream$Cons().init___O__F0(this.head__O(), new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this) {
    return (function() {
      return $this.tail__sci_List().toStream__sci_Stream()
    })
  })(this))))
});
$c_sci_List.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sci_List.prototype.isDefinedAt__O__Z = (function(x) {
  var x$1 = $uI(x);
  return $s_sc_LinearSeqOptimized$class__isDefinedAt__sc_LinearSeqOptimized__I__Z(this, x$1)
});
$c_sci_List.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sci_List.prototype.stringPrefix__T = (function() {
  return "List"
});
function $is_sci_List(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_List)))
}
function $as_sci_List(obj) {
  return (($is_sci_List(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.List"))
}
function $isArrayOf_sci_List(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_List)))
}
function $asArrayOf_sci_List(obj, depth) {
  return (($isArrayOf_sci_List(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.List;", depth))
}
/** @constructor */
function $c_sci_Stream() {
  $c_sc_AbstractSeq.call(this)
}
$c_sci_Stream.prototype = new $h_sc_AbstractSeq();
$c_sci_Stream.prototype.constructor = $c_sci_Stream;
/** @constructor */
function $h_sci_Stream() {
  /*<skip>*/
}
$h_sci_Stream.prototype = $c_sci_Stream.prototype;
$c_sci_Stream.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Stream.prototype.init___ = (function() {
  return this
});
$c_sci_Stream.prototype.apply__I__O = (function(n) {
  return $s_sc_LinearSeqOptimized$class__apply__sc_LinearSeqOptimized__I__O(this, n)
});
$c_sci_Stream.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_LinearSeqOptimized$class__lengthCompare__sc_LinearSeqOptimized__I__I(this, len)
});
$c_sci_Stream.prototype.apply__O__O = (function(v1) {
  var n = $uI(v1);
  return $s_sc_LinearSeqOptimized$class__apply__sc_LinearSeqOptimized__I__O(this, n)
});
$c_sci_Stream.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_LinearSeqOptimized$class__sameElements__sc_LinearSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_sci_Stream.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Stream.prototype.flatMap__F1__scg_CanBuildFrom__O = (function(f, bf) {
  if ($is_sci_Stream$StreamBuilder(bf.apply__O__scm_Builder(this))) {
    if (this.isEmpty__Z()) {
      var x$1 = $m_sci_Stream$Empty$()
    } else {
      var nonEmptyPrefix = new $c_sr_ObjectRef().init___O(this);
      var prefix = $as_sc_GenTraversableOnce(f.apply__O__O($as_sci_Stream(nonEmptyPrefix.elem$1).head__O())).toStream__sci_Stream();
      while (((!$as_sci_Stream(nonEmptyPrefix.elem$1).isEmpty__Z()) && prefix.isEmpty__Z())) {
        nonEmptyPrefix.elem$1 = $as_sci_Stream($as_sci_Stream(nonEmptyPrefix.elem$1).tail__O());
        if ((!$as_sci_Stream(nonEmptyPrefix.elem$1).isEmpty__Z())) {
          prefix = $as_sc_GenTraversableOnce(f.apply__O__O($as_sci_Stream(nonEmptyPrefix.elem$1).head__O())).toStream__sci_Stream()
        }
      };
      var x$1 = ($as_sci_Stream(nonEmptyPrefix.elem$1).isEmpty__Z() ? ($m_sci_Stream$(), $m_sci_Stream$Empty$()) : prefix.append__F0__sci_Stream(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, f$1, nonEmptyPrefix$1) {
        return (function() {
          var x = $as_sci_Stream($as_sci_Stream(nonEmptyPrefix$1.elem$1).tail__O()).flatMap__F1__scg_CanBuildFrom__O(f$1, ($m_sci_Stream$(), new $c_sci_Stream$StreamCanBuildFrom().init___()));
          return $as_sci_Stream(x)
        })
      })(this, f, nonEmptyPrefix))))
    };
    return x$1
  } else {
    return $s_sc_TraversableLike$class__flatMap__sc_TraversableLike__F1__scg_CanBuildFrom__O(this, f, bf)
  }
});
$c_sci_Stream.prototype.drop__I__sc_LinearSeqOptimized = (function(n) {
  return this.drop__I__sci_Stream(n)
});
$c_sci_Stream.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  this.force__sci_Stream();
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, start, sep, end)
});
$c_sci_Stream.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Stream$()
});
$c_sci_Stream.prototype.toString__T = (function() {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, ("Stream" + "("), ", ", ")")
});
$c_sci_Stream.prototype.foreach__F1__V = (function(f) {
  var _$this = this;
  x: {
    _foreach: while (true) {
      if ((!_$this.isEmpty__Z())) {
        f.apply__O__O(_$this.head__O());
        _$this = $as_sci_Stream(_$this.tail__O());
        continue _foreach
      };
      break x
    }
  }
});
$c_sci_Stream.prototype.iterator__sc_Iterator = (function() {
  return new $c_sci_StreamIterator().init___sci_Stream(this)
});
$c_sci_Stream.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sci_Stream.prototype.length__I = (function() {
  var len = 0;
  var left = this;
  while ((!left.isEmpty__Z())) {
    len = ((1 + len) | 0);
    left = $as_sci_Stream(left.tail__O())
  };
  return len
});
$c_sci_Stream.prototype.toStream__sci_Stream = (function() {
  return this
});
$c_sci_Stream.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sci_Stream.prototype.drop__I__sci_Stream = (function(n) {
  var _$this = this;
  _drop: while (true) {
    if (((n <= 0) || _$this.isEmpty__Z())) {
      return _$this
    } else {
      var temp$_$this = $as_sci_Stream(_$this.tail__O());
      var temp$n = (((-1) + n) | 0);
      _$this = temp$_$this;
      n = temp$n;
      continue _drop
    }
  }
});
$c_sci_Stream.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  b.append__T__scm_StringBuilder(start);
  if ((!this.isEmpty__Z())) {
    b.append__O__scm_StringBuilder(this.head__O());
    var cursor = this;
    var n = 1;
    if (cursor.tailDefined__Z()) {
      var scout = $as_sci_Stream(this.tail__O());
      if (scout.isEmpty__Z()) {
        b.append__T__scm_StringBuilder(end);
        return b
      };
      if ((cursor !== scout)) {
        cursor = scout;
        if (scout.tailDefined__Z()) {
          scout = $as_sci_Stream(scout.tail__O());
          while (((cursor !== scout) && scout.tailDefined__Z())) {
            b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O());
            n = ((1 + n) | 0);
            cursor = $as_sci_Stream(cursor.tail__O());
            scout = $as_sci_Stream(scout.tail__O());
            if (scout.tailDefined__Z()) {
              scout = $as_sci_Stream(scout.tail__O())
            }
          }
        }
      };
      if ((!scout.tailDefined__Z())) {
        while ((cursor !== scout)) {
          b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O());
          n = ((1 + n) | 0);
          cursor = $as_sci_Stream(cursor.tail__O())
        };
        var this$1 = cursor;
        if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)) {
          b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O())
        }
      } else {
        var runner = this;
        var k = 0;
        while ((runner !== scout)) {
          runner = $as_sci_Stream(runner.tail__O());
          scout = $as_sci_Stream(scout.tail__O());
          k = ((1 + k) | 0)
        };
        if (((cursor === scout) && (k > 0))) {
          b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O());
          n = ((1 + n) | 0);
          cursor = $as_sci_Stream(cursor.tail__O())
        };
        while ((cursor !== scout)) {
          b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O());
          n = ((1 + n) | 0);
          cursor = $as_sci_Stream(cursor.tail__O())
        };
        n = ((n - k) | 0)
      }
    };
    if ((!cursor.isEmpty__Z())) {
      if ((!cursor.tailDefined__Z())) {
        b.append__T__scm_StringBuilder(sep).append__T__scm_StringBuilder("?")
      } else {
        b.append__T__scm_StringBuilder(sep).append__T__scm_StringBuilder("...")
      }
    }
  };
  b.append__T__scm_StringBuilder(end);
  return b
});
$c_sci_Stream.prototype.force__sci_Stream = (function() {
  var these = this;
  var those = this;
  if ((!these.isEmpty__Z())) {
    these = $as_sci_Stream(these.tail__O())
  };
  while ((those !== these)) {
    if (these.isEmpty__Z()) {
      return this
    };
    these = $as_sci_Stream(these.tail__O());
    if (these.isEmpty__Z()) {
      return this
    };
    these = $as_sci_Stream(these.tail__O());
    if ((these === those)) {
      return this
    };
    those = $as_sci_Stream(those.tail__O())
  };
  return this
});
$c_sci_Stream.prototype.isDefinedAt__O__Z = (function(x) {
  var x$1 = $uI(x);
  return $s_sc_LinearSeqOptimized$class__isDefinedAt__sc_LinearSeqOptimized__I__Z(this, x$1)
});
$c_sci_Stream.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sci_Stream.prototype.append__F0__sci_Stream = (function(rest) {
  if (this.isEmpty__Z()) {
    return $as_sc_GenTraversableOnce(rest.apply__O()).toStream__sci_Stream()
  } else {
    var hd = this.head__O();
    var tl = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, rest$1) {
      return (function() {
        return $as_sci_Stream($this.tail__O()).append__F0__sci_Stream(rest$1)
      })
    })(this, rest));
    return new $c_sci_Stream$Cons().init___O__F0(hd, tl)
  }
});
$c_sci_Stream.prototype.stringPrefix__T = (function() {
  return "Stream"
});
function $is_sci_Stream(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Stream)))
}
function $as_sci_Stream(obj) {
  return (($is_sci_Stream(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Stream"))
}
function $isArrayOf_sci_Stream(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Stream)))
}
function $asArrayOf_sci_Stream(obj, depth) {
  return (($isArrayOf_sci_Stream(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Stream;", depth))
}
function $is_sci_HashMap$HashMap1(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_HashMap$HashMap1)))
}
function $as_sci_HashMap$HashMap1(obj) {
  return (($is_sci_HashMap$HashMap1(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.HashMap$HashMap1"))
}
function $isArrayOf_sci_HashMap$HashMap1(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_HashMap$HashMap1)))
}
function $asArrayOf_sci_HashMap$HashMap1(obj, depth) {
  return (($isArrayOf_sci_HashMap$HashMap1(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.HashMap$HashMap1;", depth))
}
function $is_sci_HashMap$HashTrieMap(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_HashMap$HashTrieMap)))
}
function $as_sci_HashMap$HashTrieMap(obj) {
  return (($is_sci_HashMap$HashTrieMap(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.HashMap$HashTrieMap"))
}
function $isArrayOf_sci_HashMap$HashTrieMap(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_HashMap$HashTrieMap)))
}
function $asArrayOf_sci_HashMap$HashTrieMap(obj, depth) {
  return (($isArrayOf_sci_HashMap$HashTrieMap(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.HashMap$HashTrieMap;", depth))
}
/** @constructor */
function $c_sci_Stream$Cons() {
  $c_sci_Stream.call(this);
  this.hd$5 = null;
  this.tlVal$5 = null;
  this.tlGen$5 = null
}
$c_sci_Stream$Cons.prototype = new $h_sci_Stream();
$c_sci_Stream$Cons.prototype.constructor = $c_sci_Stream$Cons;
/** @constructor */
function $h_sci_Stream$Cons() {
  /*<skip>*/
}
$h_sci_Stream$Cons.prototype = $c_sci_Stream$Cons.prototype;
$c_sci_Stream$Cons.prototype.head__O = (function() {
  return this.hd$5
});
$c_sci_Stream$Cons.prototype.tail__sci_Stream = (function() {
  if ((!this.tailDefined__Z())) {
    if ((!this.tailDefined__Z())) {
      this.tlVal$5 = $as_sci_Stream(this.tlGen$5.apply__O());
      this.tlGen$5 = null
    }
  };
  return this.tlVal$5
});
$c_sci_Stream$Cons.prototype.tailDefined__Z = (function() {
  return (this.tlGen$5 === null)
});
$c_sci_Stream$Cons.prototype.isEmpty__Z = (function() {
  return false
});
$c_sci_Stream$Cons.prototype.tail__O = (function() {
  return this.tail__sci_Stream()
});
$c_sci_Stream$Cons.prototype.init___O__F0 = (function(hd, tl) {
  this.hd$5 = hd;
  this.tlGen$5 = tl;
  return this
});
var $d_sci_Stream$Cons = new $TypeData().initClass({
  sci_Stream$Cons: 0
}, false, "scala.collection.immutable.Stream$Cons", {
  sci_Stream$Cons: 1,
  sci_Stream: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_LinearSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  sc_LinearSeqOptimized: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Stream$Cons.prototype.$classData = $d_sci_Stream$Cons;
/** @constructor */
function $c_sci_Stream$Empty$() {
  $c_sci_Stream.call(this)
}
$c_sci_Stream$Empty$.prototype = new $h_sci_Stream();
$c_sci_Stream$Empty$.prototype.constructor = $c_sci_Stream$Empty$;
/** @constructor */
function $h_sci_Stream$Empty$() {
  /*<skip>*/
}
$h_sci_Stream$Empty$.prototype = $c_sci_Stream$Empty$.prototype;
$c_sci_Stream$Empty$.prototype.head__O = (function() {
  this.head__sr_Nothing$()
});
$c_sci_Stream$Empty$.prototype.tailDefined__Z = (function() {
  return false
});
$c_sci_Stream$Empty$.prototype.isEmpty__Z = (function() {
  return true
});
$c_sci_Stream$Empty$.prototype.tail__sr_Nothing$ = (function() {
  throw new $c_jl_UnsupportedOperationException().init___T("tail of empty stream")
});
$c_sci_Stream$Empty$.prototype.head__sr_Nothing$ = (function() {
  throw new $c_ju_NoSuchElementException().init___T("head of empty stream")
});
$c_sci_Stream$Empty$.prototype.tail__O = (function() {
  this.tail__sr_Nothing$()
});
var $d_sci_Stream$Empty$ = new $TypeData().initClass({
  sci_Stream$Empty$: 0
}, false, "scala.collection.immutable.Stream$Empty$", {
  sci_Stream$Empty$: 1,
  sci_Stream: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_LinearSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  sc_LinearSeqOptimized: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Stream$Empty$.prototype.$classData = $d_sci_Stream$Empty$;
var $n_sci_Stream$Empty$ = (void 0);
function $m_sci_Stream$Empty$() {
  if ((!$n_sci_Stream$Empty$)) {
    $n_sci_Stream$Empty$ = new $c_sci_Stream$Empty$().init___()
  };
  return $n_sci_Stream$Empty$
}
/** @constructor */
function $c_sci_Vector() {
  $c_sc_AbstractSeq.call(this);
  this.startIndex$4 = 0;
  this.endIndex$4 = 0;
  this.focus$4 = 0;
  this.dirty$4 = false;
  this.depth$4 = 0;
  this.display0$4 = null;
  this.display1$4 = null;
  this.display2$4 = null;
  this.display3$4 = null;
  this.display4$4 = null;
  this.display5$4 = null
}
$c_sci_Vector.prototype = new $h_sc_AbstractSeq();
$c_sci_Vector.prototype.constructor = $c_sci_Vector;
/** @constructor */
function $h_sci_Vector() {
  /*<skip>*/
}
$h_sci_Vector.prototype = $c_sci_Vector.prototype;
$c_sci_Vector.prototype.checkRangeConvert__p4__I__I = (function(index) {
  var idx = ((index + this.startIndex$4) | 0);
  if (((index >= 0) && (idx < this.endIndex$4))) {
    return idx
  } else {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + index))
  }
});
$c_sci_Vector.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Vector.prototype.display3__AO = (function() {
  return this.display3$4
});
$c_sci_Vector.prototype.gotoPosWritable__p4__I__I__I__V = (function(oldIndex, newIndex, xor) {
  if (this.dirty$4) {
    $s_sci_VectorPointer$class__gotoPosWritable1__sci_VectorPointer__I__I__I__V(this, oldIndex, newIndex, xor)
  } else {
    $s_sci_VectorPointer$class__gotoPosWritable0__sci_VectorPointer__I__I__V(this, newIndex, xor);
    this.dirty$4 = true
  }
});
$c_sci_Vector.prototype.apply__I__O = (function(index) {
  var idx = this.checkRangeConvert__p4__I__I(index);
  var xor = (idx ^ this.focus$4);
  return $s_sci_VectorPointer$class__getElem__sci_VectorPointer__I__I__O(this, idx, xor)
});
$c_sci_Vector.prototype.depth__I = (function() {
  return this.depth$4
});
$c_sci_Vector.prototype.lengthCompare__I__I = (function(len) {
  return ((this.length__I() - len) | 0)
});
$c_sci_Vector.prototype.apply__O__O = (function(v1) {
  return this.apply__I__O($uI(v1))
});
$c_sci_Vector.prototype.initIterator__sci_VectorIterator__V = (function(s) {
  var depth = this.depth$4;
  $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s, this, depth);
  if (this.dirty$4) {
    var index = this.focus$4;
    $s_sci_VectorPointer$class__stabilize__sci_VectorPointer__I__V(s, index)
  };
  if ((s.depth$2 > 1)) {
    var index$1 = this.startIndex$4;
    var xor = (this.startIndex$4 ^ this.focus$4);
    $s_sci_VectorPointer$class__gotoPos__sci_VectorPointer__I__I__V(s, index$1, xor)
  }
});
$c_sci_Vector.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Vector.prototype.init___I__I__I = (function(startIndex, endIndex, focus) {
  this.startIndex$4 = startIndex;
  this.endIndex$4 = endIndex;
  this.focus$4 = focus;
  this.dirty$4 = false;
  return this
});
$c_sci_Vector.prototype.display5$und$eq__AO__V = (function(x$1) {
  this.display5$4 = x$1
});
$c_sci_Vector.prototype.$$colon$plus__O__scg_CanBuildFrom__O = (function(elem, bf) {
  return ((((bf === ($m_sci_IndexedSeq$(), $m_sc_IndexedSeq$().ReusableCBF$6)) || (bf === $m_sci_Seq$().ReusableCBFInstance$2)) || (bf === $m_sc_Seq$().ReusableCBFInstance$2)) ? this.appendBack__O__sci_Vector(elem) : $s_sc_SeqLike$class__$$colon$plus__sc_SeqLike__O__scg_CanBuildFrom__O(this, elem, bf))
});
$c_sci_Vector.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Vector$()
});
$c_sci_Vector.prototype.display0__AO = (function() {
  return this.display0$4
});
$c_sci_Vector.prototype.display2$und$eq__AO__V = (function(x$1) {
  this.display2$4 = x$1
});
$c_sci_Vector.prototype.display4__AO = (function() {
  return this.display4$4
});
$c_sci_Vector.prototype.shiftTopLevel__p4__I__I__V = (function(oldLeft, newLeft) {
  var x1 = (((-1) + this.depth$4) | 0);
  switch (x1) {
    case 0: {
      var array = this.display0$4;
      this.display0$4 = $s_sci_VectorPointer$class__copyRange__sci_VectorPointer__AO__I__I__AO(this, array, oldLeft, newLeft);
      break
    }
    case 1: {
      var array$1 = this.display1$4;
      this.display1$4 = $s_sci_VectorPointer$class__copyRange__sci_VectorPointer__AO__I__I__AO(this, array$1, oldLeft, newLeft);
      break
    }
    case 2: {
      var array$2 = this.display2$4;
      this.display2$4 = $s_sci_VectorPointer$class__copyRange__sci_VectorPointer__AO__I__I__AO(this, array$2, oldLeft, newLeft);
      break
    }
    case 3: {
      var array$3 = this.display3$4;
      this.display3$4 = $s_sci_VectorPointer$class__copyRange__sci_VectorPointer__AO__I__I__AO(this, array$3, oldLeft, newLeft);
      break
    }
    case 4: {
      var array$4 = this.display4$4;
      this.display4$4 = $s_sci_VectorPointer$class__copyRange__sci_VectorPointer__AO__I__I__AO(this, array$4, oldLeft, newLeft);
      break
    }
    case 5: {
      var array$5 = this.display5$4;
      this.display5$4 = $s_sci_VectorPointer$class__copyRange__sci_VectorPointer__AO__I__I__AO(this, array$5, oldLeft, newLeft);
      break
    }
    default: {
      throw new $c_s_MatchError().init___O(x1)
    }
  }
});
$c_sci_Vector.prototype.appendBack__O__sci_Vector = (function(value) {
  if ((this.endIndex$4 !== this.startIndex$4)) {
    var blockIndex = ((-32) & this.endIndex$4);
    var lo = (31 & this.endIndex$4);
    if ((this.endIndex$4 !== blockIndex)) {
      var s = new $c_sci_Vector().init___I__I__I(this.startIndex$4, ((1 + this.endIndex$4) | 0), blockIndex);
      var depth = this.depth$4;
      $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s, this, depth);
      s.dirty$4 = this.dirty$4;
      s.gotoPosWritable__p4__I__I__I__V(this.focus$4, blockIndex, (this.focus$4 ^ blockIndex));
      s.display0$4.u[lo] = value;
      return s
    } else {
      var shift = (this.startIndex$4 & (~(((-1) + (1 << $imul(5, (((-1) + this.depth$4) | 0)))) | 0)));
      var shiftBlocks = ((this.startIndex$4 >>> $imul(5, (((-1) + this.depth$4) | 0))) | 0);
      if ((shift !== 0)) {
        $s_sci_VectorPointer$class__debug__sci_VectorPointer__V(this);
        if ((this.depth$4 > 1)) {
          var newBlockIndex = ((blockIndex - shift) | 0);
          var newFocus = ((this.focus$4 - shift) | 0);
          var s$2 = new $c_sci_Vector().init___I__I__I(((this.startIndex$4 - shift) | 0), ((((1 + this.endIndex$4) | 0) - shift) | 0), newBlockIndex);
          var depth$1 = this.depth$4;
          $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s$2, this, depth$1);
          s$2.dirty$4 = this.dirty$4;
          s$2.shiftTopLevel__p4__I__I__V(shiftBlocks, 0);
          $s_sci_VectorPointer$class__debug__sci_VectorPointer__V(s$2);
          s$2.gotoFreshPosWritable__p4__I__I__I__V(newFocus, newBlockIndex, (newFocus ^ newBlockIndex));
          s$2.display0$4.u[lo] = value;
          $s_sci_VectorPointer$class__debug__sci_VectorPointer__V(s$2);
          return s$2
        } else {
          var newBlockIndex$2 = (((-32) + blockIndex) | 0);
          var newFocus$2 = this.focus$4;
          var s$3 = new $c_sci_Vector().init___I__I__I(((this.startIndex$4 - shift) | 0), ((((1 + this.endIndex$4) | 0) - shift) | 0), newBlockIndex$2);
          var depth$2 = this.depth$4;
          $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s$3, this, depth$2);
          s$3.dirty$4 = this.dirty$4;
          s$3.shiftTopLevel__p4__I__I__V(shiftBlocks, 0);
          s$3.gotoPosWritable__p4__I__I__I__V(newFocus$2, newBlockIndex$2, (newFocus$2 ^ newBlockIndex$2));
          s$3.display0$4.u[((32 - shift) | 0)] = value;
          $s_sci_VectorPointer$class__debug__sci_VectorPointer__V(s$3);
          return s$3
        }
      } else {
        var newFocus$3 = this.focus$4;
        var s$4 = new $c_sci_Vector().init___I__I__I(this.startIndex$4, ((1 + this.endIndex$4) | 0), blockIndex);
        var depth$3 = this.depth$4;
        $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s$4, this, depth$3);
        s$4.dirty$4 = this.dirty$4;
        s$4.gotoFreshPosWritable__p4__I__I__I__V(newFocus$3, blockIndex, (newFocus$3 ^ blockIndex));
        s$4.display0$4.u[lo] = value;
        if ((s$4.depth$4 === ((1 + this.depth$4) | 0))) {
          $s_sci_VectorPointer$class__debug__sci_VectorPointer__V(s$4)
        };
        return s$4
      }
    }
  } else {
    var elems = $newArrayObject($d_O.getArrayOf(), [32]);
    elems.u[0] = value;
    var s$5 = new $c_sci_Vector().init___I__I__I(0, 1, 0);
    s$5.depth$4 = 1;
    s$5.display0$4 = elems;
    return s$5
  }
});
$c_sci_Vector.prototype.iterator__sc_Iterator = (function() {
  return this.iterator__sci_VectorIterator()
});
$c_sci_Vector.prototype.display1$und$eq__AO__V = (function(x$1) {
  this.display1$4 = x$1
});
$c_sci_Vector.prototype.length__I = (function() {
  return ((this.endIndex$4 - this.startIndex$4) | 0)
});
$c_sci_Vector.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sci_Vector.prototype.display4$und$eq__AO__V = (function(x$1) {
  this.display4$4 = x$1
});
$c_sci_Vector.prototype.gotoFreshPosWritable__p4__I__I__I__V = (function(oldIndex, newIndex, xor) {
  if (this.dirty$4) {
    $s_sci_VectorPointer$class__gotoFreshPosWritable1__sci_VectorPointer__I__I__I__V(this, oldIndex, newIndex, xor)
  } else {
    $s_sci_VectorPointer$class__gotoFreshPosWritable0__sci_VectorPointer__I__I__I__V(this, oldIndex, newIndex, xor);
    this.dirty$4 = true
  }
});
$c_sci_Vector.prototype.display1__AO = (function() {
  return this.display1$4
});
$c_sci_Vector.prototype.display5__AO = (function() {
  return this.display5$4
});
$c_sci_Vector.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sci_Vector.prototype.iterator__sci_VectorIterator = (function() {
  var s = new $c_sci_VectorIterator().init___I__I(this.startIndex$4, this.endIndex$4);
  this.initIterator__sci_VectorIterator__V(s);
  return s
});
$c_sci_Vector.prototype.isDefinedAt__O__Z = (function(x) {
  var idx = $uI(x);
  return $s_sc_GenSeqLike$class__isDefinedAt__sc_GenSeqLike__I__Z(this, idx)
});
$c_sci_Vector.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sci_Vector.prototype.depth$und$eq__I__V = (function(x$1) {
  this.depth$4 = x$1
});
$c_sci_Vector.prototype.display2__AO = (function() {
  return this.display2$4
});
$c_sci_Vector.prototype.display0$und$eq__AO__V = (function(x$1) {
  this.display0$4 = x$1
});
$c_sci_Vector.prototype.display3$und$eq__AO__V = (function(x$1) {
  this.display3$4 = x$1
});
function $is_sci_Vector(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Vector)))
}
function $as_sci_Vector(obj) {
  return (($is_sci_Vector(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Vector"))
}
function $isArrayOf_sci_Vector(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Vector)))
}
function $asArrayOf_sci_Vector(obj, depth) {
  return (($isArrayOf_sci_Vector(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Vector;", depth))
}
var $d_sci_Vector = new $TypeData().initClass({
  sci_Vector: 0
}, false, "scala.collection.immutable.Vector", {
  sci_Vector: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_IndexedSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  sci_VectorPointer: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  sc_CustomParallelizable: 1
});
$c_sci_Vector.prototype.$classData = $d_sci_Vector;
/** @constructor */
function $c_sci_WrappedString() {
  $c_sc_AbstractSeq.call(this);
  this.self$4 = null
}
$c_sci_WrappedString.prototype = new $h_sc_AbstractSeq();
$c_sci_WrappedString.prototype.constructor = $c_sci_WrappedString;
/** @constructor */
function $h_sci_WrappedString() {
  /*<skip>*/
}
$h_sci_WrappedString.prototype = $c_sci_WrappedString.prototype;
$c_sci_WrappedString.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_WrappedString.prototype.apply__I__O = (function(idx) {
  var thiz = this.self$4;
  var c = (65535 & $uI(thiz["charCodeAt"](idx)));
  return new $c_jl_Character().init___C(c)
});
$c_sci_WrappedString.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_sci_WrappedString.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_sci_WrappedString.prototype.apply__O__O = (function(v1) {
  var n = $uI(v1);
  var thiz = this.self$4;
  var c = (65535 & $uI(thiz["charCodeAt"](n)));
  return new $c_jl_Character().init___C(c)
});
$c_sci_WrappedString.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_sci_WrappedString.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_WrappedString.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_IndexedSeq$()
});
$c_sci_WrappedString.prototype.toString__T = (function() {
  return this.self$4
});
$c_sci_WrappedString.prototype.foreach__F1__V = (function(f) {
  $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V(this, f)
});
$c_sci_WrappedString.prototype.iterator__sc_Iterator = (function() {
  var thiz = this.self$4;
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI(thiz["length"]))
});
$c_sci_WrappedString.prototype.length__I = (function() {
  var thiz = this.self$4;
  return $uI(thiz["length"])
});
$c_sci_WrappedString.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sci_WrappedString.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sci_WrappedString.prototype.isDefinedAt__O__Z = (function(x) {
  var idx = $uI(x);
  return $s_sc_GenSeqLike$class__isDefinedAt__sc_GenSeqLike__I__Z(this, idx)
});
$c_sci_WrappedString.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sci_WrappedString.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_sc_IndexedSeqOptimized$class__copyToArray__sc_IndexedSeqOptimized__O__I__I__V(this, xs, start, len)
});
$c_sci_WrappedString.prototype.init___T = (function(self) {
  this.self$4 = self;
  return this
});
$c_sci_WrappedString.prototype.newBuilder__scm_Builder = (function() {
  return $m_sci_WrappedString$().newBuilder__scm_Builder()
});
var $d_sci_WrappedString = new $TypeData().initClass({
  sci_WrappedString: 0
}, false, "scala.collection.immutable.WrappedString", {
  sci_WrappedString: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_IndexedSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  sci_StringLike: 1,
  sc_IndexedSeqOptimized: 1,
  s_math_Ordered: 1,
  jl_Comparable: 1
});
$c_sci_WrappedString.prototype.$classData = $d_sci_WrappedString;
/** @constructor */
function $c_sci_$colon$colon() {
  $c_sci_List.call(this);
  this.head$5 = null;
  this.tl$5 = null
}
$c_sci_$colon$colon.prototype = new $h_sci_List();
$c_sci_$colon$colon.prototype.constructor = $c_sci_$colon$colon;
/** @constructor */
function $h_sci_$colon$colon() {
  /*<skip>*/
}
$h_sci_$colon$colon.prototype = $c_sci_$colon$colon.prototype;
$c_sci_$colon$colon.prototype.productPrefix__T = (function() {
  return "::"
});
$c_sci_$colon$colon.prototype.head__O = (function() {
  return this.head$5
});
$c_sci_$colon$colon.prototype.productArity__I = (function() {
  return 2
});
$c_sci_$colon$colon.prototype.isEmpty__Z = (function() {
  return false
});
$c_sci_$colon$colon.prototype.tail__sci_List = (function() {
  return this.tl$5
});
$c_sci_$colon$colon.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.head$5;
      break
    }
    case 1: {
      return this.tl$5;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_sci_$colon$colon.prototype.tail__O = (function() {
  return this.tl$5
});
$c_sci_$colon$colon.prototype.init___O__sci_List = (function(head, tl) {
  this.head$5 = head;
  this.tl$5 = tl;
  return this
});
$c_sci_$colon$colon.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_sci_$colon$colon = new $TypeData().initClass({
  sci_$colon$colon: 0
}, false, "scala.collection.immutable.$colon$colon", {
  sci_$colon$colon: 1,
  sci_List: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_LinearSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  s_Product: 1,
  sc_LinearSeqOptimized: 1,
  Ljava_io_Serializable: 1,
  s_Serializable: 1
});
$c_sci_$colon$colon.prototype.$classData = $d_sci_$colon$colon;
/** @constructor */
function $c_sci_Nil$() {
  $c_sci_List.call(this)
}
$c_sci_Nil$.prototype = new $h_sci_List();
$c_sci_Nil$.prototype.constructor = $c_sci_Nil$;
/** @constructor */
function $h_sci_Nil$() {
  /*<skip>*/
}
$h_sci_Nil$.prototype = $c_sci_Nil$.prototype;
$c_sci_Nil$.prototype.head__O = (function() {
  this.head__sr_Nothing$()
});
$c_sci_Nil$.prototype.productPrefix__T = (function() {
  return "Nil"
});
$c_sci_Nil$.prototype.productArity__I = (function() {
  return 0
});
$c_sci_Nil$.prototype.equals__O__Z = (function(that) {
  if ($is_sc_GenSeq(that)) {
    var x2 = $as_sc_GenSeq(that);
    return x2.isEmpty__Z()
  } else {
    return false
  }
});
$c_sci_Nil$.prototype.tail__sci_List = (function() {
  throw new $c_jl_UnsupportedOperationException().init___T("tail of empty list")
});
$c_sci_Nil$.prototype.isEmpty__Z = (function() {
  return true
});
$c_sci_Nil$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_sci_Nil$.prototype.head__sr_Nothing$ = (function() {
  throw new $c_ju_NoSuchElementException().init___T("head of empty list")
});
$c_sci_Nil$.prototype.tail__O = (function() {
  return this.tail__sci_List()
});
$c_sci_Nil$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_sci_Nil$ = new $TypeData().initClass({
  sci_Nil$: 0
}, false, "scala.collection.immutable.Nil$", {
  sci_Nil$: 1,
  sci_List: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_LinearSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  s_Product: 1,
  sc_LinearSeqOptimized: 1,
  Ljava_io_Serializable: 1,
  s_Serializable: 1
});
$c_sci_Nil$.prototype.$classData = $d_sci_Nil$;
var $n_sci_Nil$ = (void 0);
function $m_sci_Nil$() {
  if ((!$n_sci_Nil$)) {
    $n_sci_Nil$ = new $c_sci_Nil$().init___()
  };
  return $n_sci_Nil$
}
/** @constructor */
function $c_scm_AbstractSet() {
  $c_scm_AbstractIterable.call(this)
}
$c_scm_AbstractSet.prototype = new $h_scm_AbstractIterable();
$c_scm_AbstractSet.prototype.constructor = $c_scm_AbstractSet;
/** @constructor */
function $h_scm_AbstractSet() {
  /*<skip>*/
}
$h_scm_AbstractSet.prototype = $c_scm_AbstractSet.prototype;
$c_scm_AbstractSet.prototype.isEmpty__Z = (function() {
  return $s_sc_SetLike$class__isEmpty__sc_SetLike__Z(this)
});
$c_scm_AbstractSet.prototype.equals__O__Z = (function(that) {
  return $s_sc_GenSetLike$class__equals__sc_GenSetLike__O__Z(this, that)
});
$c_scm_AbstractSet.prototype.toString__T = (function() {
  return $s_sc_TraversableLike$class__toString__sc_TraversableLike__T(this)
});
$c_scm_AbstractSet.prototype.subsetOf__sc_GenSet__Z = (function(that) {
  var this$1 = new $c_scm_FlatHashTable$$anon$1().init___scm_FlatHashTable(this);
  return $s_sc_Iterator$class__forall__sc_Iterator__F1__Z(this$1, that)
});
$c_scm_AbstractSet.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_AbstractSet.prototype.hashCode__I = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.unorderedHash__sc_TraversableOnce__I__I(this, this$1.setSeed$2)
});
$c_scm_AbstractSet.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_AbstractSet.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_HashSet().init___()
});
$c_scm_AbstractSet.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
$c_scm_AbstractSet.prototype.stringPrefix__T = (function() {
  return "Set"
});
/** @constructor */
function $c_scm_AbstractBuffer() {
  $c_scm_AbstractSeq.call(this)
}
$c_scm_AbstractBuffer.prototype = new $h_scm_AbstractSeq();
$c_scm_AbstractBuffer.prototype.constructor = $c_scm_AbstractBuffer;
/** @constructor */
function $h_scm_AbstractBuffer() {
  /*<skip>*/
}
$h_scm_AbstractBuffer.prototype = $c_scm_AbstractBuffer.prototype;
$c_scm_AbstractBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
/** @constructor */
function $c_scm_HashSet() {
  $c_scm_AbstractSet.call(this);
  this.$$undloadFactor$5 = 0;
  this.table$5 = null;
  this.tableSize$5 = 0;
  this.threshold$5 = 0;
  this.sizemap$5 = null;
  this.seedvalue$5 = 0
}
$c_scm_HashSet.prototype = new $h_scm_AbstractSet();
$c_scm_HashSet.prototype.constructor = $c_scm_HashSet;
/** @constructor */
function $h_scm_HashSet() {
  /*<skip>*/
}
$h_scm_HashSet.prototype = $c_scm_HashSet.prototype;
$c_scm_HashSet.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_scm_HashSet.prototype.init___ = (function() {
  $c_scm_HashSet.prototype.init___scm_FlatHashTable$Contents.call(this, null);
  return this
});
$c_scm_HashSet.prototype.apply__O__O = (function(v1) {
  return $s_scm_FlatHashTable$class__containsElem__scm_FlatHashTable__O__Z(this, v1)
});
$c_scm_HashSet.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_HashSet.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_HashSet(elem)
});
$c_scm_HashSet.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_HashSet$()
});
$c_scm_HashSet.prototype.foreach__F1__V = (function(f) {
  var i = 0;
  var len = this.table$5.u["length"];
  while ((i < len)) {
    var curEntry = this.table$5.u[i];
    if ((curEntry !== null)) {
      f.apply__O__O($s_scm_FlatHashTable$HashUtils$class__entryToElem__scm_FlatHashTable$HashUtils__O__O(this, curEntry))
    };
    i = ((1 + i) | 0)
  }
});
$c_scm_HashSet.prototype.size__I = (function() {
  return this.tableSize$5
});
$c_scm_HashSet.prototype.result__O = (function() {
  return this
});
$c_scm_HashSet.prototype.iterator__sc_Iterator = (function() {
  return new $c_scm_FlatHashTable$$anon$1().init___scm_FlatHashTable(this)
});
$c_scm_HashSet.prototype.init___scm_FlatHashTable$Contents = (function(contents) {
  $s_scm_FlatHashTable$class__$$init$__scm_FlatHashTable__V(this);
  $s_scm_FlatHashTable$class__initWithContents__scm_FlatHashTable__scm_FlatHashTable$Contents__V(this, contents);
  return this
});
$c_scm_HashSet.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_HashSet(elem)
});
$c_scm_HashSet.prototype.$$plus__O__sc_Set = (function(elem) {
  var this$1 = new $c_scm_HashSet().init___();
  var this$2 = $as_scm_HashSet($s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this$1, this));
  return this$2.$$plus$eq__O__scm_HashSet(elem)
});
$c_scm_HashSet.prototype.$$plus$eq__O__scm_HashSet = (function(elem) {
  $s_scm_FlatHashTable$class__addElem__scm_FlatHashTable__O__Z(this, elem);
  return this
});
function $is_scm_HashSet(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_HashSet)))
}
function $as_scm_HashSet(obj) {
  return (($is_scm_HashSet(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.HashSet"))
}
function $isArrayOf_scm_HashSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_HashSet)))
}
function $asArrayOf_scm_HashSet(obj, depth) {
  return (($isArrayOf_scm_HashSet(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.HashSet;", depth))
}
var $d_scm_HashSet = new $TypeData().initClass({
  scm_HashSet: 0
}, false, "scala.collection.mutable.HashSet", {
  scm_HashSet: 1,
  scm_AbstractSet: 1,
  scm_AbstractIterable: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_Set: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  scm_SetLike: 1,
  sc_script_Scriptable: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  scg_Shrinkable: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_FlatHashTable: 1,
  scm_FlatHashTable$HashUtils: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_HashSet.prototype.$classData = $d_scm_HashSet;
/** @constructor */
function $c_scm_ListBuffer() {
  $c_scm_AbstractBuffer.call(this);
  this.scala$collection$mutable$ListBuffer$$start$6 = null;
  this.last0$6 = null;
  this.exported$6 = false;
  this.len$6 = 0
}
$c_scm_ListBuffer.prototype = new $h_scm_AbstractBuffer();
$c_scm_ListBuffer.prototype.constructor = $c_scm_ListBuffer;
/** @constructor */
function $h_scm_ListBuffer() {
  /*<skip>*/
}
$h_scm_ListBuffer.prototype = $c_scm_ListBuffer.prototype;
$c_scm_ListBuffer.prototype.copy__p6__V = (function() {
  if (this.scala$collection$mutable$ListBuffer$$start$6.isEmpty__Z()) {
    return (void 0)
  };
  var cursor = this.scala$collection$mutable$ListBuffer$$start$6;
  var this$1 = this.last0$6;
  var limit = this$1.tl$5;
  this.clear__V();
  while ((cursor !== limit)) {
    this.$$plus$eq__O__scm_ListBuffer(cursor.head__O());
    var this$2 = cursor;
    cursor = this$2.tail__sci_List()
  }
});
$c_scm_ListBuffer.prototype.init___ = (function() {
  this.scala$collection$mutable$ListBuffer$$start$6 = $m_sci_Nil$();
  this.exported$6 = false;
  this.len$6 = 0;
  return this
});
$c_scm_ListBuffer.prototype.apply__I__O = (function(n) {
  if (((n < 0) || (n >= this.len$6))) {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
  } else {
    var this$2 = this.scala$collection$mutable$ListBuffer$$start$6;
    return $s_sc_LinearSeqOptimized$class__apply__sc_LinearSeqOptimized__I__O(this$2, n)
  }
});
$c_scm_ListBuffer.prototype.lengthCompare__I__I = (function(len) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_LinearSeqOptimized$class__lengthCompare__sc_LinearSeqOptimized__I__I(this$1, len)
});
$c_scm_ListBuffer.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_LinearSeqOptimized$class__sameElements__sc_LinearSeqOptimized__sc_GenIterable__Z(this$1, that)
});
$c_scm_ListBuffer.prototype.apply__O__O = (function(v1) {
  return this.apply__I__O($uI(v1))
});
$c_scm_ListBuffer.prototype.isEmpty__Z = (function() {
  return this.scala$collection$mutable$ListBuffer$$start$6.isEmpty__Z()
});
$c_scm_ListBuffer.prototype.toList__sci_List = (function() {
  this.exported$6 = (!this.scala$collection$mutable$ListBuffer$$start$6.isEmpty__Z());
  return this.scala$collection$mutable$ListBuffer$$start$6
});
$c_scm_ListBuffer.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_ListBuffer.prototype.equals__O__Z = (function(that) {
  if ($is_scm_ListBuffer(that)) {
    var x2 = $as_scm_ListBuffer(that);
    return this.scala$collection$mutable$ListBuffer$$start$6.equals__O__Z(x2.scala$collection$mutable$ListBuffer$$start$6)
  } else {
    return $s_sc_GenSeqLike$class__equals__sc_GenSeqLike__O__Z(this, that)
  }
});
$c_scm_ListBuffer.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this$1, start, sep, end)
});
$c_scm_ListBuffer.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_ListBuffer(elem)
});
$c_scm_ListBuffer.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_ListBuffer$()
});
$c_scm_ListBuffer.prototype.foreach__F1__V = (function(f) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  var these = this$1;
  while ((!these.isEmpty__Z())) {
    f.apply__O__O(these.head__O());
    var this$2 = these;
    these = this$2.tail__sci_List()
  }
});
$c_scm_ListBuffer.prototype.size__I = (function() {
  return this.len$6
});
$c_scm_ListBuffer.prototype.result__O = (function() {
  return this.toList__sci_List()
});
$c_scm_ListBuffer.prototype.iterator__sc_Iterator = (function() {
  return new $c_scm_ListBuffer$$anon$1().init___scm_ListBuffer(this)
});
$c_scm_ListBuffer.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_ListBuffer.prototype.length__I = (function() {
  return this.len$6
});
$c_scm_ListBuffer.prototype.seq__sc_Seq = (function() {
  return this
});
$c_scm_ListBuffer.prototype.toStream__sci_Stream = (function() {
  return this.scala$collection$mutable$ListBuffer$$start$6.toStream__sci_Stream()
});
$c_scm_ListBuffer.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this$1, b, start, sep, end)
});
$c_scm_ListBuffer.prototype.$$plus$eq__O__scm_ListBuffer = (function(x) {
  if (this.exported$6) {
    this.copy__p6__V()
  };
  if (this.scala$collection$mutable$ListBuffer$$start$6.isEmpty__Z()) {
    this.last0$6 = new $c_sci_$colon$colon().init___O__sci_List(x, $m_sci_Nil$());
    this.scala$collection$mutable$ListBuffer$$start$6 = this.last0$6
  } else {
    var last1 = this.last0$6;
    this.last0$6 = new $c_sci_$colon$colon().init___O__sci_List(x, $m_sci_Nil$());
    last1.tl$5 = this.last0$6
  };
  this.len$6 = ((1 + this.len$6) | 0);
  return this
});
$c_scm_ListBuffer.prototype.isDefinedAt__O__Z = (function(x) {
  var x$1 = $uI(x);
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_LinearSeqOptimized$class__isDefinedAt__sc_LinearSeqOptimized__I__Z(this$1, x$1)
});
$c_scm_ListBuffer.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_ListBuffer(elem)
});
$c_scm_ListBuffer.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_ListBuffer.prototype.clear__V = (function() {
  this.scala$collection$mutable$ListBuffer$$start$6 = $m_sci_Nil$();
  this.last0$6 = null;
  this.exported$6 = false;
  this.len$6 = 0
});
$c_scm_ListBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_ListBuffer = (function(xs) {
  _$plus$plus$eq: while (true) {
    var x1 = xs;
    if ((x1 !== null)) {
      if ((x1 === this)) {
        var n = this.len$6;
        xs = $as_sc_TraversableOnce($s_sc_IterableLike$class__take__sc_IterableLike__I__O(this, n));
        continue _$plus$plus$eq
      }
    };
    return $as_scm_ListBuffer($s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs))
  }
});
$c_scm_ListBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_ListBuffer(xs)
});
$c_scm_ListBuffer.prototype.stringPrefix__T = (function() {
  return "ListBuffer"
});
function $is_scm_ListBuffer(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_ListBuffer)))
}
function $as_scm_ListBuffer(obj) {
  return (($is_scm_ListBuffer(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.ListBuffer"))
}
function $isArrayOf_scm_ListBuffer(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_ListBuffer)))
}
function $asArrayOf_scm_ListBuffer(obj, depth) {
  return (($isArrayOf_scm_ListBuffer(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.ListBuffer;", depth))
}
var $d_scm_ListBuffer = new $TypeData().initClass({
  scm_ListBuffer: 0
}, false, "scala.collection.mutable.ListBuffer", {
  scm_ListBuffer: 1,
  scm_AbstractBuffer: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_Buffer: 1,
  scm_BufferLike: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  scg_Shrinkable: 1,
  sc_script_Scriptable: 1,
  scg_Subtractable: 1,
  scm_Builder: 1,
  scg_SeqForwarder: 1,
  scg_IterableForwarder: 1,
  scg_TraversableForwarder: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ListBuffer.prototype.$classData = $d_scm_ListBuffer;
/** @constructor */
function $c_scm_StringBuilder() {
  $c_scm_AbstractSeq.call(this);
  this.underlying$5 = null
}
$c_scm_StringBuilder.prototype = new $h_scm_AbstractSeq();
$c_scm_StringBuilder.prototype.constructor = $c_scm_StringBuilder;
/** @constructor */
function $h_scm_StringBuilder() {
  /*<skip>*/
}
$h_scm_StringBuilder.prototype = $c_scm_StringBuilder.prototype;
$c_scm_StringBuilder.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_scm_StringBuilder.prototype.init___ = (function() {
  $c_scm_StringBuilder.prototype.init___I__T.call(this, 16, "");
  return this
});
$c_scm_StringBuilder.prototype.$$plus$eq__C__scm_StringBuilder = (function(x) {
  this.append__C__scm_StringBuilder(x);
  return this
});
$c_scm_StringBuilder.prototype.apply__I__O = (function(idx) {
  var this$1 = this.underlying$5;
  var thiz = this$1.content$1;
  var c = (65535 & $uI(thiz["charCodeAt"](idx)));
  return new $c_jl_Character().init___C(c)
});
$c_scm_StringBuilder.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_scm_StringBuilder.prototype.apply__O__O = (function(v1) {
  var index = $uI(v1);
  var this$1 = this.underlying$5;
  var thiz = this$1.content$1;
  var c = (65535 & $uI(thiz["charCodeAt"](index)));
  return new $c_jl_Character().init___C(c)
});
$c_scm_StringBuilder.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_scm_StringBuilder.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_scm_StringBuilder.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_StringBuilder.prototype.subSequence__I__I__jl_CharSequence = (function(start, end) {
  var this$1 = this.underlying$5;
  var thiz = this$1.content$1;
  return $as_T(thiz["substring"](start, end))
});
$c_scm_StringBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  if ((elem === null)) {
    var jsx$1 = 0
  } else {
    var this$2 = $as_jl_Character(elem);
    var jsx$1 = this$2.value$1
  };
  return this.$$plus$eq__C__scm_StringBuilder(jsx$1)
});
$c_scm_StringBuilder.prototype.toString__T = (function() {
  var this$1 = this.underlying$5;
  return this$1.content$1
});
$c_scm_StringBuilder.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_IndexedSeq$()
});
$c_scm_StringBuilder.prototype.foreach__F1__V = (function(f) {
  $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V(this, f)
});
$c_scm_StringBuilder.prototype.result__O = (function() {
  var this$1 = this.underlying$5;
  return this$1.content$1
});
$c_scm_StringBuilder.prototype.append__T__scm_StringBuilder = (function(s) {
  this.underlying$5.append__T__jl_StringBuilder(s);
  return this
});
$c_scm_StringBuilder.prototype.seq__scm_Seq = (function() {
  return this
});
$c_scm_StringBuilder.prototype.iterator__sc_Iterator = (function() {
  var this$1 = this.underlying$5;
  var thiz = this$1.content$1;
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI(thiz["length"]))
});
$c_scm_StringBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_StringBuilder.prototype.init___I__T = (function(initCapacity, initValue) {
  $c_scm_StringBuilder.prototype.init___jl_StringBuilder.call(this, new $c_jl_StringBuilder().init___I((($uI(initValue["length"]) + initCapacity) | 0)).append__T__jl_StringBuilder(initValue));
  return this
});
$c_scm_StringBuilder.prototype.seq__sc_Seq = (function() {
  return this
});
$c_scm_StringBuilder.prototype.length__I = (function() {
  var this$1 = this.underlying$5;
  var thiz = this$1.content$1;
  return $uI(thiz["length"])
});
$c_scm_StringBuilder.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_scm_StringBuilder.prototype.init___jl_StringBuilder = (function(underlying) {
  this.underlying$5 = underlying;
  return this
});
$c_scm_StringBuilder.prototype.append__O__scm_StringBuilder = (function(x) {
  this.underlying$5.append__T__jl_StringBuilder($m_sjsr_RuntimeString$().valueOf__O__T(x));
  return this
});
$c_scm_StringBuilder.prototype.isDefinedAt__O__Z = (function(x) {
  var idx = $uI(x);
  return $s_sc_GenSeqLike$class__isDefinedAt__sc_GenSeqLike__I__Z(this, idx)
});
$c_scm_StringBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  if ((elem === null)) {
    var jsx$1 = 0
  } else {
    var this$2 = $as_jl_Character(elem);
    var jsx$1 = this$2.value$1
  };
  return this.$$plus$eq__C__scm_StringBuilder(jsx$1)
});
$c_scm_StringBuilder.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_sc_IndexedSeqOptimized$class__copyToArray__sc_IndexedSeqOptimized__O__I__I__V(this, xs, start, len)
});
$c_scm_StringBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_StringBuilder.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_scm_StringBuilder.prototype.append__C__scm_StringBuilder = (function(x) {
  this.underlying$5.append__C__jl_StringBuilder(x);
  return this
});
$c_scm_StringBuilder.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_GrowingBuilder().init___scg_Growable(new $c_scm_StringBuilder().init___())
});
$c_scm_StringBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
var $d_scm_StringBuilder = new $TypeData().initClass({
  scm_StringBuilder: 0
}, false, "scala.collection.mutable.StringBuilder", {
  scm_StringBuilder: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  jl_CharSequence: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  sci_StringLike: 1,
  sc_IndexedSeqOptimized: 1,
  s_math_Ordered: 1,
  jl_Comparable: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_StringBuilder.prototype.$classData = $d_scm_StringBuilder;
/** @constructor */
function $c_sjs_js_WrappedArray() {
  $c_scm_AbstractBuffer.call(this);
  this.array$6 = null
}
$c_sjs_js_WrappedArray.prototype = new $h_scm_AbstractBuffer();
$c_sjs_js_WrappedArray.prototype.constructor = $c_sjs_js_WrappedArray;
/** @constructor */
function $h_sjs_js_WrappedArray() {
  /*<skip>*/
}
$h_sjs_js_WrappedArray.prototype = $c_sjs_js_WrappedArray.prototype;
$c_sjs_js_WrappedArray.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.init___ = (function() {
  $c_sjs_js_WrappedArray.prototype.init___sjs_js_Array.call(this, []);
  return this
});
$c_sjs_js_WrappedArray.prototype.apply__I__O = (function(index) {
  return this.array$6[index]
});
$c_sjs_js_WrappedArray.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_sjs_js_WrappedArray.prototype.apply__O__O = (function(v1) {
  var index = $uI(v1);
  return this.array$6[index]
});
$c_sjs_js_WrappedArray.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_sjs_js_WrappedArray.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_sjs_js_WrappedArray.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  this.array$6["push"](elem);
  return this
});
$c_sjs_js_WrappedArray.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sjs_js_WrappedArray$()
});
$c_sjs_js_WrappedArray.prototype.foreach__F1__V = (function(f) {
  $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V(this, f)
});
$c_sjs_js_WrappedArray.prototype.result__O = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.seq__scm_Seq = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.iterator__sc_Iterator = (function() {
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI(this.array$6["length"]))
});
$c_sjs_js_WrappedArray.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_sjs_js_WrappedArray.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.length__I = (function() {
  return $uI(this.array$6["length"])
});
$c_sjs_js_WrappedArray.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.isDefinedAt__O__Z = (function(x) {
  var idx = $uI(x);
  return $s_sc_GenSeqLike$class__isDefinedAt__sc_GenSeqLike__I__Z(this, idx)
});
$c_sjs_js_WrappedArray.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  this.array$6["push"](elem);
  return this
});
$c_sjs_js_WrappedArray.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sjs_js_WrappedArray.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_sc_IndexedSeqOptimized$class__copyToArray__sc_IndexedSeqOptimized__O__I__I__V(this, xs, start, len)
});
$c_sjs_js_WrappedArray.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_sjs_js_WrappedArray.prototype.init___sjs_js_Array = (function(array) {
  this.array$6 = array;
  return this
});
$c_sjs_js_WrappedArray.prototype.stringPrefix__T = (function() {
  return "WrappedArray"
});
function $is_sjs_js_WrappedArray(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sjs_js_WrappedArray)))
}
function $as_sjs_js_WrappedArray(obj) {
  return (($is_sjs_js_WrappedArray(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.scalajs.js.WrappedArray"))
}
function $isArrayOf_sjs_js_WrappedArray(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sjs_js_WrappedArray)))
}
function $asArrayOf_sjs_js_WrappedArray(obj, depth) {
  return (($isArrayOf_sjs_js_WrappedArray(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.scalajs.js.WrappedArray;", depth))
}
var $d_sjs_js_WrappedArray = new $TypeData().initClass({
  sjs_js_WrappedArray: 0
}, false, "scala.scalajs.js.WrappedArray", {
  sjs_js_WrappedArray: 1,
  scm_AbstractBuffer: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_Buffer: 1,
  scm_BufferLike: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  scg_Shrinkable: 1,
  sc_script_Scriptable: 1,
  scg_Subtractable: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  scm_ArrayLike: 1,
  scm_IndexedSeqOptimized: 1,
  sc_IndexedSeqOptimized: 1,
  scm_Builder: 1
});
$c_sjs_js_WrappedArray.prototype.$classData = $d_sjs_js_WrappedArray;
/** @constructor */
function $c_scm_ArrayBuffer() {
  $c_scm_AbstractBuffer.call(this);
  this.initialSize$6 = 0;
  this.array$6 = null;
  this.size0$6 = 0
}
$c_scm_ArrayBuffer.prototype = new $h_scm_AbstractBuffer();
$c_scm_ArrayBuffer.prototype.constructor = $c_scm_ArrayBuffer;
/** @constructor */
function $h_scm_ArrayBuffer() {
  /*<skip>*/
}
$h_scm_ArrayBuffer.prototype = $c_scm_ArrayBuffer.prototype;
$c_scm_ArrayBuffer.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.init___ = (function() {
  $c_scm_ArrayBuffer.prototype.init___I.call(this, 16);
  return this
});
$c_scm_ArrayBuffer.prototype.$$plus$eq__O__scm_ArrayBuffer = (function(elem) {
  var n = ((1 + this.size0$6) | 0);
  $s_scm_ResizableArray$class__ensureSize__scm_ResizableArray__I__V(this, n);
  this.array$6.u[this.size0$6] = elem;
  this.size0$6 = ((1 + this.size0$6) | 0);
  return this
});
$c_scm_ArrayBuffer.prototype.apply__I__O = (function(idx) {
  return $s_scm_ResizableArray$class__apply__scm_ResizableArray__I__O(this, idx)
});
$c_scm_ArrayBuffer.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_scm_ArrayBuffer.prototype.apply__O__O = (function(v1) {
  var idx = $uI(v1);
  return $s_scm_ResizableArray$class__apply__scm_ResizableArray__I__O(this, idx)
});
$c_scm_ArrayBuffer.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_scm_ArrayBuffer.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_scm_ArrayBuffer.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_ArrayBuffer(elem)
});
$c_scm_ArrayBuffer.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_ArrayBuffer$()
});
$c_scm_ArrayBuffer.prototype.foreach__F1__V = (function(f) {
  $s_scm_ResizableArray$class__foreach__scm_ResizableArray__F1__V(this, f)
});
$c_scm_ArrayBuffer.prototype.result__O = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.seq__scm_Seq = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.iterator__sc_Iterator = (function() {
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, this.size0$6)
});
$c_scm_ArrayBuffer.prototype.init___I = (function(initialSize) {
  this.initialSize$6 = initialSize;
  $s_scm_ResizableArray$class__$$init$__scm_ResizableArray__V(this);
  return this
});
$c_scm_ArrayBuffer.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_ArrayBuffer.prototype.seq__sc_Seq = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.length__I = (function() {
  return this.size0$6
});
$c_scm_ArrayBuffer.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_ArrayBuffer = (function(xs) {
  if ($is_sc_IndexedSeqLike(xs)) {
    var x2 = $as_sc_IndexedSeqLike(xs);
    var n = x2.length__I();
    var n$1 = ((this.size0$6 + n) | 0);
    $s_scm_ResizableArray$class__ensureSize__scm_ResizableArray__I__V(this, n$1);
    x2.copyToArray__O__I__I__V(this.array$6, this.size0$6, n);
    this.size0$6 = ((this.size0$6 + n) | 0);
    return this
  } else {
    return $as_scm_ArrayBuffer($s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs))
  }
});
$c_scm_ArrayBuffer.prototype.isDefinedAt__O__Z = (function(x) {
  var idx = $uI(x);
  return $s_sc_GenSeqLike$class__isDefinedAt__sc_GenSeqLike__I__Z(this, idx)
});
$c_scm_ArrayBuffer.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_ArrayBuffer(elem)
});
$c_scm_ArrayBuffer.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_scm_ResizableArray$class__copyToArray__scm_ResizableArray__O__I__I__V(this, xs, start, len)
});
$c_scm_ArrayBuffer.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_scm_ArrayBuffer.prototype.sizeHint__I__V = (function(len) {
  if (((len > this.size0$6) && (len >= 1))) {
    var newarray = $newArrayObject($d_O.getArrayOf(), [len]);
    var src = this.array$6;
    var length = this.size0$6;
    $systemArraycopy(src, 0, newarray, 0, length);
    this.array$6 = newarray
  }
});
$c_scm_ArrayBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_ArrayBuffer(xs)
});
$c_scm_ArrayBuffer.prototype.stringPrefix__T = (function() {
  return "ArrayBuffer"
});
function $is_scm_ArrayBuffer(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_ArrayBuffer)))
}
function $as_scm_ArrayBuffer(obj) {
  return (($is_scm_ArrayBuffer(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.ArrayBuffer"))
}
function $isArrayOf_scm_ArrayBuffer(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_ArrayBuffer)))
}
function $asArrayOf_scm_ArrayBuffer(obj, depth) {
  return (($isArrayOf_scm_ArrayBuffer(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.ArrayBuffer;", depth))
}
var $d_scm_ArrayBuffer = new $TypeData().initClass({
  scm_ArrayBuffer: 0
}, false, "scala.collection.mutable.ArrayBuffer", {
  scm_ArrayBuffer: 1,
  scm_AbstractBuffer: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_Buffer: 1,
  scm_BufferLike: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  scg_Shrinkable: 1,
  sc_script_Scriptable: 1,
  scg_Subtractable: 1,
  scm_IndexedSeqOptimized: 1,
  scm_IndexedSeqLike: 1,
  sc_IndexedSeqLike: 1,
  sc_IndexedSeqOptimized: 1,
  scm_Builder: 1,
  scm_ResizableArray: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ArrayBuffer.prototype.$classData = $d_scm_ArrayBuffer;
}).call(this);
//# sourceMappingURL=livelygigsr_1-0-fastopt.js.map
