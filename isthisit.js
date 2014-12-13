
//     Underscore.js 1.7.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){var n=this,t=n._,r=Array.prototype,e=Object.prototype,u=Function.prototype,i=r.push,a=r.slice,o=r.concat,l=e.toString,c=e.hasOwnProperty,f=Array.isArray,s=Object.keys,p=u.bind,h=function(n){return n instanceof h?n:this instanceof h?void(this._wrapped=n):new h(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=h),exports._=h):n._=h,h.VERSION="1.7.0";var g=function(n,t,r){if(t===void 0)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}};h.iteratee=function(n,t,r){return null==n?h.identity:h.isFunction(n)?g(n,t,r):h.isObject(n)?h.matches(n):h.property(n)},h.each=h.forEach=function(n,t,r){if(null==n)return n;t=g(t,r);var e,u=n.length;if(u===+u)for(e=0;u>e;e++)t(n[e],e,n);else{var i=h.keys(n);for(e=0,u=i.length;u>e;e++)t(n[i[e]],i[e],n)}return n},h.map=h.collect=function(n,t,r){if(null==n)return[];t=h.iteratee(t,r);for(var e,u=n.length!==+n.length&&h.keys(n),i=(u||n).length,a=Array(i),o=0;i>o;o++)e=u?u[o]:o,a[o]=t(n[e],e,n);return a};var v="Reduce of empty array with no initial value";h.reduce=h.foldl=h.inject=function(n,t,r,e){null==n&&(n=[]),t=g(t,e,4);var u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length,o=0;if(arguments.length<3){if(!a)throw new TypeError(v);r=n[i?i[o++]:o++]}for(;a>o;o++)u=i?i[o]:o,r=t(r,n[u],u,n);return r},h.reduceRight=h.foldr=function(n,t,r,e){null==n&&(n=[]),t=g(t,e,4);var u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length;if(arguments.length<3){if(!a)throw new TypeError(v);r=n[i?i[--a]:--a]}for(;a--;)u=i?i[a]:a,r=t(r,n[u],u,n);return r},h.find=h.detect=function(n,t,r){var e;return t=h.iteratee(t,r),h.some(n,function(n,r,u){return t(n,r,u)?(e=n,!0):void 0}),e},h.filter=h.select=function(n,t,r){var e=[];return null==n?e:(t=h.iteratee(t,r),h.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e)},h.reject=function(n,t,r){return h.filter(n,h.negate(h.iteratee(t)),r)},h.every=h.all=function(n,t,r){if(null==n)return!0;t=h.iteratee(t,r);var e,u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length;for(e=0;a>e;e++)if(u=i?i[e]:e,!t(n[u],u,n))return!1;return!0},h.some=h.any=function(n,t,r){if(null==n)return!1;t=h.iteratee(t,r);var e,u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length;for(e=0;a>e;e++)if(u=i?i[e]:e,t(n[u],u,n))return!0;return!1},h.contains=h.include=function(n,t){return null==n?!1:(n.length!==+n.length&&(n=h.values(n)),h.indexOf(n,t)>=0)},h.invoke=function(n,t){var r=a.call(arguments,2),e=h.isFunction(t);return h.map(n,function(n){return(e?t:n[t]).apply(n,r)})},h.pluck=function(n,t){return h.map(n,h.property(t))},h.where=function(n,t){return h.filter(n,h.matches(t))},h.findWhere=function(n,t){return h.find(n,h.matches(t))},h.max=function(n,t,r){var e,u,i=-1/0,a=-1/0;if(null==t&&null!=n){n=n.length===+n.length?n:h.values(n);for(var o=0,l=n.length;l>o;o++)e=n[o],e>i&&(i=e)}else t=h.iteratee(t,r),h.each(n,function(n,r,e){u=t(n,r,e),(u>a||u===-1/0&&i===-1/0)&&(i=n,a=u)});return i},h.min=function(n,t,r){var e,u,i=1/0,a=1/0;if(null==t&&null!=n){n=n.length===+n.length?n:h.values(n);for(var o=0,l=n.length;l>o;o++)e=n[o],i>e&&(i=e)}else t=h.iteratee(t,r),h.each(n,function(n,r,e){u=t(n,r,e),(a>u||1/0===u&&1/0===i)&&(i=n,a=u)});return i},h.shuffle=function(n){for(var t,r=n&&n.length===+n.length?n:h.values(n),e=r.length,u=Array(e),i=0;e>i;i++)t=h.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},h.sample=function(n,t,r){return null==t||r?(n.length!==+n.length&&(n=h.values(n)),n[h.random(n.length-1)]):h.shuffle(n).slice(0,Math.max(0,t))},h.sortBy=function(n,t,r){return t=h.iteratee(t,r),h.pluck(h.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var m=function(n){return function(t,r,e){var u={};return r=h.iteratee(r,e),h.each(t,function(e,i){var a=r(e,i,t);n(u,e,a)}),u}};h.groupBy=m(function(n,t,r){h.has(n,r)?n[r].push(t):n[r]=[t]}),h.indexBy=m(function(n,t,r){n[r]=t}),h.countBy=m(function(n,t,r){h.has(n,r)?n[r]++:n[r]=1}),h.sortedIndex=function(n,t,r,e){r=h.iteratee(r,e,1);for(var u=r(t),i=0,a=n.length;a>i;){var o=i+a>>>1;r(n[o])<u?i=o+1:a=o}return i},h.toArray=function(n){return n?h.isArray(n)?a.call(n):n.length===+n.length?h.map(n,h.identity):h.values(n):[]},h.size=function(n){return null==n?0:n.length===+n.length?n.length:h.keys(n).length},h.partition=function(n,t,r){t=h.iteratee(t,r);var e=[],u=[];return h.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},h.first=h.head=h.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:0>t?[]:a.call(n,0,t)},h.initial=function(n,t,r){return a.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},h.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:a.call(n,Math.max(n.length-t,0))},h.rest=h.tail=h.drop=function(n,t,r){return a.call(n,null==t||r?1:t)},h.compact=function(n){return h.filter(n,h.identity)};var y=function(n,t,r,e){if(t&&h.every(n,h.isArray))return o.apply(e,n);for(var u=0,a=n.length;a>u;u++){var l=n[u];h.isArray(l)||h.isArguments(l)?t?i.apply(e,l):y(l,t,r,e):r||e.push(l)}return e};h.flatten=function(n,t){return y(n,t,!1,[])},h.without=function(n){return h.difference(n,a.call(arguments,1))},h.uniq=h.unique=function(n,t,r,e){if(null==n)return[];h.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=h.iteratee(r,e));for(var u=[],i=[],a=0,o=n.length;o>a;a++){var l=n[a];if(t)a&&i===l||u.push(l),i=l;else if(r){var c=r(l,a,n);h.indexOf(i,c)<0&&(i.push(c),u.push(l))}else h.indexOf(u,l)<0&&u.push(l)}return u},h.union=function(){return h.uniq(y(arguments,!0,!0,[]))},h.intersection=function(n){if(null==n)return[];for(var t=[],r=arguments.length,e=0,u=n.length;u>e;e++){var i=n[e];if(!h.contains(t,i)){for(var a=1;r>a&&h.contains(arguments[a],i);a++);a===r&&t.push(i)}}return t},h.difference=function(n){var t=y(a.call(arguments,1),!0,!0,[]);return h.filter(n,function(n){return!h.contains(t,n)})},h.zip=function(n){if(null==n)return[];for(var t=h.max(arguments,"length").length,r=Array(t),e=0;t>e;e++)r[e]=h.pluck(arguments,e);return r},h.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},h.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=h.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}for(;u>e;e++)if(n[e]===t)return e;return-1},h.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=n.length;for("number"==typeof r&&(e=0>r?e+r+1:Math.min(e,r+1));--e>=0;)if(n[e]===t)return e;return-1},h.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;e>i;i++,n+=r)u[i]=n;return u};var d=function(){};h.bind=function(n,t){var r,e;if(p&&n.bind===p)return p.apply(n,a.call(arguments,1));if(!h.isFunction(n))throw new TypeError("Bind must be called on a function");return r=a.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(a.call(arguments)));d.prototype=n.prototype;var u=new d;d.prototype=null;var i=n.apply(u,r.concat(a.call(arguments)));return h.isObject(i)?i:u}},h.partial=function(n){var t=a.call(arguments,1);return function(){for(var r=0,e=t.slice(),u=0,i=e.length;i>u;u++)e[u]===h&&(e[u]=arguments[r++]);for(;r<arguments.length;)e.push(arguments[r++]);return n.apply(this,e)}},h.bindAll=function(n){var t,r,e=arguments.length;if(1>=e)throw new Error("bindAll must be passed function names");for(t=1;e>t;t++)r=arguments[t],n[r]=h.bind(n[r],n);return n},h.memoize=function(n,t){var r=function(e){var u=r.cache,i=t?t.apply(this,arguments):e;return h.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},h.delay=function(n,t){var r=a.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},h.defer=function(n){return h.delay.apply(h,[n,1].concat(a.call(arguments,1)))},h.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var l=function(){o=r.leading===!1?0:h.now(),a=null,i=n.apply(e,u),a||(e=u=null)};return function(){var c=h.now();o||r.leading!==!1||(o=c);var f=t-(c-o);return e=this,u=arguments,0>=f||f>t?(clearTimeout(a),a=null,o=c,i=n.apply(e,u),a||(e=u=null)):a||r.trailing===!1||(a=setTimeout(l,f)),i}},h.debounce=function(n,t,r){var e,u,i,a,o,l=function(){var c=h.now()-a;t>c&&c>0?e=setTimeout(l,t-c):(e=null,r||(o=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,a=h.now();var c=r&&!e;return e||(e=setTimeout(l,t)),c&&(o=n.apply(i,u),i=u=null),o}},h.wrap=function(n,t){return h.partial(t,n)},h.negate=function(n){return function(){return!n.apply(this,arguments)}},h.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},h.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},h.before=function(n,t){var r;return function(){return--n>0?r=t.apply(this,arguments):t=null,r}},h.once=h.partial(h.before,2),h.keys=function(n){if(!h.isObject(n))return[];if(s)return s(n);var t=[];for(var r in n)h.has(n,r)&&t.push(r);return t},h.values=function(n){for(var t=h.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},h.pairs=function(n){for(var t=h.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},h.invert=function(n){for(var t={},r=h.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},h.functions=h.methods=function(n){var t=[];for(var r in n)h.isFunction(n[r])&&t.push(r);return t.sort()},h.extend=function(n){if(!h.isObject(n))return n;for(var t,r,e=1,u=arguments.length;u>e;e++){t=arguments[e];for(r in t)c.call(t,r)&&(n[r]=t[r])}return n},h.pick=function(n,t,r){var e,u={};if(null==n)return u;if(h.isFunction(t)){t=g(t,r);for(e in n){var i=n[e];t(i,e,n)&&(u[e]=i)}}else{var l=o.apply([],a.call(arguments,1));n=new Object(n);for(var c=0,f=l.length;f>c;c++)e=l[c],e in n&&(u[e]=n[e])}return u},h.omit=function(n,t,r){if(h.isFunction(t))t=h.negate(t);else{var e=h.map(o.apply([],a.call(arguments,1)),String);t=function(n,t){return!h.contains(e,t)}}return h.pick(n,t,r)},h.defaults=function(n){if(!h.isObject(n))return n;for(var t=1,r=arguments.length;r>t;t++){var e=arguments[t];for(var u in e)n[u]===void 0&&(n[u]=e[u])}return n},h.clone=function(n){return h.isObject(n)?h.isArray(n)?n.slice():h.extend({},n):n},h.tap=function(n,t){return t(n),n};var b=function(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof h&&(n=n._wrapped),t instanceof h&&(t=t._wrapped);var u=l.call(n);if(u!==l.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]===n)return e[i]===t;var a=n.constructor,o=t.constructor;if(a!==o&&"constructor"in n&&"constructor"in t&&!(h.isFunction(a)&&a instanceof a&&h.isFunction(o)&&o instanceof o))return!1;r.push(n),e.push(t);var c,f;if("[object Array]"===u){if(c=n.length,f=c===t.length)for(;c--&&(f=b(n[c],t[c],r,e)););}else{var s,p=h.keys(n);if(c=p.length,f=h.keys(t).length===c)for(;c--&&(s=p[c],f=h.has(t,s)&&b(n[s],t[s],r,e)););}return r.pop(),e.pop(),f};h.isEqual=function(n,t){return b(n,t,[],[])},h.isEmpty=function(n){if(null==n)return!0;if(h.isArray(n)||h.isString(n)||h.isArguments(n))return 0===n.length;for(var t in n)if(h.has(n,t))return!1;return!0},h.isElement=function(n){return!(!n||1!==n.nodeType)},h.isArray=f||function(n){return"[object Array]"===l.call(n)},h.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},h.each(["Arguments","Function","String","Number","Date","RegExp"],function(n){h["is"+n]=function(t){return l.call(t)==="[object "+n+"]"}}),h.isArguments(arguments)||(h.isArguments=function(n){return h.has(n,"callee")}),"function"!=typeof/./&&(h.isFunction=function(n){return"function"==typeof n||!1}),h.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},h.isNaN=function(n){return h.isNumber(n)&&n!==+n},h.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===l.call(n)},h.isNull=function(n){return null===n},h.isUndefined=function(n){return n===void 0},h.has=function(n,t){return null!=n&&c.call(n,t)},h.noConflict=function(){return n._=t,this},h.identity=function(n){return n},h.constant=function(n){return function(){return n}},h.noop=function(){},h.property=function(n){return function(t){return t[n]}},h.matches=function(n){var t=h.pairs(n),r=t.length;return function(n){if(null==n)return!r;n=new Object(n);for(var e=0;r>e;e++){var u=t[e],i=u[0];if(u[1]!==n[i]||!(i in n))return!1}return!0}},h.times=function(n,t,r){var e=Array(Math.max(0,n));t=g(t,r,1);for(var u=0;n>u;u++)e[u]=t(u);return e},h.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},h.now=Date.now||function(){return(new Date).getTime()};var _={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},w=h.invert(_),j=function(n){var t=function(t){return n[t]},r="(?:"+h.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};h.escape=j(_),h.unescape=j(w),h.result=function(n,t){if(null==n)return void 0;var r=n[t];return h.isFunction(r)?n[t]():r};var x=0;h.uniqueId=function(n){var t=++x+"";return n?n+t:t},h.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var A=/(.)^/,k={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},O=/\\|'|\r|\n|\u2028|\u2029/g,F=function(n){return"\\"+k[n]};h.template=function(n,t,r){!t&&r&&(t=r),t=h.defaults({},t,h.templateSettings);var e=RegExp([(t.escape||A).source,(t.interpolate||A).source,(t.evaluate||A).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,a,o){return i+=n.slice(u,o).replace(O,F),u=o+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":a&&(i+="';\n"+a+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var a=new Function(t.variable||"obj","_",i)}catch(o){throw o.source=i,o}var l=function(n){return a.call(this,n,h)},c=t.variable||"obj";return l.source="function("+c+"){\n"+i+"}",l},h.chain=function(n){var t=h(n);return t._chain=!0,t};var E=function(n){return this._chain?h(n).chain():n};h.mixin=function(n){h.each(h.functions(n),function(t){var r=h[t]=n[t];h.prototype[t]=function(){var n=[this._wrapped];return i.apply(n,arguments),E.call(this,r.apply(h,n))}})},h.mixin(h),h.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=r[n];h.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],E.call(this,r)}}),h.each(["concat","join","slice"],function(n){var t=r[n];h.prototype[n]=function(){return E.call(this,t.apply(this._wrapped,arguments))}}),h.prototype.value=function(){return this._wrapped},"function"==typeof define&&define.amd&&define("underscore",[],function(){return h})}).call(this);
//# sourceMappingURL=underscore-min.map
function ExpandoCircle(gameEnv, x, y, maxDiameter, period, thickness, color) {
  this.gameEnv = gameEnv;
  this.x = x;
  this.y = y;
  this.thickness = thickness;
  this.color = color;
  this.maxDiameter = maxDiameter;
  this.period = period;
  this.beganLast = new Date();
  this.hovered = false;
  this.selected = false;
  this.circle = null;
  this.dead = false;
  this.update();
}

ExpandoCircle.prototype.render = function () {
  var colorDiffsToBG = {
    r: this.color.r - backgroundColor.r,
    g: this.color.g - backgroundColor.g,
    b: this.color.b - backgroundColor.b
  };
  var actualColor = {
    r: this.color.r - (colorDiffsToBG.r * this.progress),
    g: this.color.g - (colorDiffsToBG.g * this.progress),
    b: this.color.b - (colorDiffsToBG.b * this.progress)
  };
  this.gameEnv.renderCircle(this.circle, this.thickness, actualColor.r, actualColor.g, actualColor.b);
};

ExpandoCircle.prototype.update = function () {
  var now = new Date();
  var elapsed = now - this.beganLast;
  this.progress = elapsed / this.period;
  if (this.progress >= 1.0) {
    this.dead = true;
    return;
  }
  this.diameter = this.progress * this.maxDiameter;
  this.circle = new Phaser.Circle(this.x, this.y, this.diameter);
};

function PulseCircle(gameEnv, x, y, minDiameter, maxDiameter, period, thickness, color) {
  this.gameEnv = gameEnv;
  this.x = x;
  this.y = y;
  this.minDiameter = this.diameter = minDiameter;
  this.maxDiameter = maxDiameter;
  this.period = period;
  this.thickness = thickness;
  this.color = color;
  this.diamDelta = this.maxDiameter - this.minDiameter;
  this.expanding = true;
  this.beganLast = new Date();
  this.circle = null;
  this.updateCircle();
}

PulseCircle.prototype.render = function (fill) {
  fill = fill === undefined? false: fill;
  this.gameEnv.renderCircle(
    this.circle,
    this.thickness,
    this.color.r,
    this.color.g,
    this.color.b,
    fill
  );
};

PulseCircle.prototype.update = function () {
  var now = new Date();
  var elapsed = now - this.beganLast;
  this.progress = elapsed / this.period;
  while (this.progress >= 1.0) {
    this.expanding = !this.expanding;
    this.progress = this.progress - 1;
    this.beganLast = now - (this.progress * this.period);
  }
  //gameEnv.game.debug.text(this.progress, 10, 25, '#000000');
  var diamProgress = this.progress * this.diamDelta;
  this.diameter = this.expanding?
    this.minDiameter + diamProgress:
    this.maxDiameter - diamProgress;
  this.updateCircle();
};

PulseCircle.prototype.updateCircle = function () {
  this.circle = new Phaser.Circle(this.x, this.y, this.diameter);
};

function TextInput(gameEnv, x, y) {
  this.gameEnv = gameEnv;
  this.x = x;
  this.y = y;
  this.text = '';
}

TextInput.prototype.render = function () {
  this.gameEnv.renderText(
    this.text,
    this.x,
    this.y,
    255, 255, 255
  );
};

TextInput.prototype.update = function() {
};

function SystemControlledTextInput(
    gameEnv, x, y, animateFinishCb, animateFinishCbContext
  ) {
  TextInput.call(this, gameEnv, x, y);
  this.animateFinishCb = animateFinishCb;
  this.animateFinishCbContext = animateFinishCbContext;
  this.resetAnimateInput();
}
SystemControlledTextInput.prototype = Object.create(TextInput.prototype);
SystemControlledTextInput.prototype.constructor = SystemControlledTextInput;

SystemControlledTextInput.prototype.animateInput = function (text, prewait) {
  this.resetAnimateInput();
  this.animation.animating = true;
  this.animation.prewait = prewait;
  this.animation.targetText = text;
};

SystemControlledTextInput.prototype.resetAnimateInput = function () {
  this.text = '';
  this.animation = {
    animating: false,
    lastUpdate: new Date(),
    prewait: 0,
    prewaiting: true,
    renderPeriod: 35,
    targetText: ''
  };
};

SystemControlledTextInput.prototype.update = function () {
  var now = new Date();
  if (this.animation.prewaiting &&
      now - this.animation.lastUpdate > this.animation.prewait) {
    this.animation.prewaiting = false;
  }
  if (this.animation.animating && !this.animation.prewaiting) {
    if (now - this.animation.lastUpdate > this.animation.renderPeriod) {
      if (this.text.length < this.animation.targetText.length) {
        this.text += this.animation.targetText.charAt(this.text.length);
      }
      if (this.text.length === this.animation.targetText.length) {
        this.animation.animating = false;
        this.animateFinishCb.call(this.animateFinishCbContext);
      }
      this.animation.lastUpdate = now;
    }
  }
};

function UserControlledTextInput(gameEnv, x, y, submitCb, submitCbContext) {
  TextInput.call(this, gameEnv, x, y);
  var that = this;
  this.submitCb = submitCb;
  this.submitCbContext = submitCbContext;
  this.listening = false;
  this.forceNoListen = false;
  document.addEventListener('isthisit-keyinput', function (key) {
    if (that.forceNoListen || !that.listening) {
      return;
    }
    that.captureInput(key.detail);
  }, false);
}
UserControlledTextInput.prototype = Object.create(TextInput.prototype);
UserControlledTextInput.prototype.constructor = UserControlledTextInput;

UserControlledTextInput.prototype.captureInput = function (key) {
  if (key === 'BACKSPACE') {
    this.text = this.text.substr(0, this.text.length - 1);
  } else if (key === 'ENTER') {
    var text = this.text;
    this.text = '';
    this.submitCb.call(this.submitCbContext, text);
  } else {
    this.text += key;
  }
};
function ConnectionNode(gameEnv, connection, inNode, x, y, color) {
  this.gameEnv = gameEnv;
  this.connection = connection;
  this.inNode = inNode;
  this.color = color;
  this.x = x;
  this.y = y;
  this.pulseCircle = new PulseCircle(gameEnv, x, y, 9, 15, 1500, 0.5, color);
  this.expandoCircles = [];
  this.displayed = false;
}

ConnectionNode.prototype.addExpandoCircle = function () {
  var expandoCircle = new ExpandoCircle(
    this.gameEnv,
    this.x, this.y,
    400, 1200,
    0.5, this.color
  );
  this.expandoCircles.push(expandoCircle);
};

ConnectionNode.prototype.isClicked = function () {
  return this.isHovered() && this.gameEnv.game.input.activePointer.isDown;
};

ConnectionNode.prototype.isHovered = function () {
  return this.displayed && this.pulseCircle.circle.contains(
    this.gameEnv.game.input.mousePointer.x,
    this.gameEnv.game.input.mousePointer.y
  );
};

ConnectionNode.prototype.render = function () {
  if (!this.displayed) {
    return;
  }
  this.pulseCircle.render(this.connection.hovered || this.connection.selected);
  _.invoke(this.expandoCircles, 'render');
};

ConnectionNode.prototype.update = function () {
  this.pulseCircle.update();
  this.updateExpandoCircles();
  // Update the node
  switch (this.connection.connectionState) {
    case CONNECTION_STATE_AWAITING_ACCEPT:
      if (this.inNode && this.expandoCircles.length === 0) {
        this.addExpandoCircle();
      }
      break;
  }
};

ConnectionNode.prototype.updateExpandoCircles = function () {
  this.expandoCircles = _.filter(this.expandoCircles, function (c) {
    return !c.dead;
  });
  _.invoke(this.expandoCircles, 'update');
};

CONNECTION_STATE_INCOMING = 0;
CONNECTION_STATE_AWAITING_ACCEPT = 1;
CONNECTION_STATE_OPENING = 2;
CONNECTION_STATE_OPEN = 3;
CONNECTION_STATE_CLOSING = 4;
CONNECTION_STATE_CLOSED = 5;
CONNECTION_STATE_REMOVING = 6;
CONNECTION_STATE_DEAD = 7;

function Connection(gameEnv, rails, inY, outY) {
  this.gameEnv = gameEnv;
  this.rails = rails;
  this.inY = inY;
  this.outY = outY;
  this.inNode = new ConnectionNode(
    gameEnv, this, true, rails.inX, inY, {r: 100, g: 100, b: 255}
  );
  this.outNode = new ConnectionNode(
    gameEnv, this, false, rails.outX, outY, {r: 255, g: 100, b: 100}
  );
  this.nodes = [this.inNode, this.outNode];
  this.connectionState = CONNECTION_STATE_INCOMING;
  this.selected = false;
  this.hovered = false;
}

Connection.prototype.deselect = function () {
  var that = this;
  if (that.selected) {
    that.selected = false;
  }
};

Connection.prototype.isClicked = function () {
  return this.inNode.isClicked() || this.outNode.isClicked();
};

Connection.prototype.isHovered = function () {
  return this.inNode.isHovered() || this.outNode.isHovered();
};

Connection.prototype.onOpen = function () {};

Connection.prototype.progressState = function () {
  this.connectionState++;
  if (this.connectionState === CONNECTION_STATE_OPEN) {
    this.onOpen();
  }
};

Connection.prototype.render = function () {
  this.renderConnectionLine();
  this.renderExteriorLineIn();
  this.renderExteriorLineOut();
  // Render nodes
  _.invoke(this.nodes, 'render');
};

Connection.prototype.renderConnectionLine = function () {
  if (!(this.connectionState === CONNECTION_STATE_OPEN)) {
    return;
  }
  var that = this;
  var connectionLines = [
    new Phaser.Line(
      this.inNode.x - 15,
      this.inNode.y,
      this.inNode.x - 15,
      this.outNode.y
    ),
    new Phaser.Line(
      this.inNode.x - 15,
      this.outNode.y,
      this.outNode.x - this.outNode.pulseCircle.circle.radius,
      this.outNode.y
    )
  ];
  _.each(connectionLines, function (line) {
    that.gameEnv.renderLine(line, 0.5, 45, 45, 45);
  });
};

Connection.prototype.renderExteriorLineIn = function (thickness) {
  if (!(this.connectionState < CONNECTION_STATE_REMOVING)) {
    return;
  }
  thickness = thickness === undefined? 0.5: thickness;
  var exteriorLineIn = new Phaser.Line(
    0,
    this.inNode.y,
    this.inNode.x - this.inNode.pulseCircle.circle.radius,
    this.inNode.y
  );
  this.gameEnv.renderLine(
    exteriorLineIn, thickness,
    this.inNode.color.r, this.inNode.color.g, this.inNode.color.b
  );
};

Connection.prototype.renderExteriorLineOut = function (thickness) {
  if (
    this.connectionState >= CONNECTION_STATE_REMOVING ||
    !this.outNode.displayed
    ) {
    return;
  }
  thickness = thickness === undefined? 0.5: thickness;
  var exteriorLineOut = new Phaser.Line(
    this.outNode.x + this.outNode.pulseCircle.circle.radius,
    this.outNode.y,
    W,
    this.outNode.y
  );
  this.gameEnv.renderLine(
    exteriorLineOut, thickness,
    this.outNode.color.r, this.outNode.color.g, this.outNode.color.b
  );
};

Connection.prototype.select = function () {
  var that = this;
  if (!that.selected) {
    that.selected = true;
    _.invoke(
      _.filter(that.nodes, function (node) {return node.displayed;}),
      'addExpandoCircle'
    );
    if (this.connectionState === CONNECTION_STATE_AWAITING_ACCEPT) {
      // A select is an accept, so move on
      this.progressState();
    }
  }
};

Connection.prototype.update = function () {
  // Update this connection
  // Detect mouse environment
  this.hovered = this.isHovered();
  if (this.isClicked()) {
    this.select();
  } else {
    if (this.gameEnv.game.input.activePointer.isDown) {
      this.deselect();
    }
  }
  // Update state
  switch (this.connectionState) {
    case CONNECTION_STATE_INCOMING:
      this.progressState();
      break;
    case CONNECTION_STATE_AWAITING_ACCEPT:
      this.inNode.displayed = true;
      break;
    case CONNECTION_STATE_OPENING:
      this.outNode.displayed = true;
      this.outNode.addExpandoCircle();
      this.progressState();
      break;
    case CONNECTION_STATE_OPEN:
      break;
  }
  // Update all nodes
  _.invoke(this.nodes, 'update');
};

ConversationConnection = function (gameEnv, rails, inY, outY, conversation) {
  Connection.call(this, gameEnv, rails, inY, outY);
  this.conversation = conversation;
  this.conversationInput = null;
  this.systemTextInput = new SystemControlledTextInput(
    gameEnv,
    this.inNode.x + this.inNode.pulseCircle.circle.radius + 5,
    this.inNode.y,
    this.handleSystemTextFinished,
    this
  );
  this.userTextInput = new UserControlledTextInput(
    gameEnv,
    this.inNode.x + this.inNode.pulseCircle.circle.radius + 15,
    this.outNode.y,
    this.handleUserTextSubmit,
    this
  );
}
ConversationConnection.prototype = Object.create(Connection.prototype);
ConversationConnection.prototype.constructor = ConversationConnection;

ConversationConnection.prototype.deselect = function () {
  Connection.prototype.deselect.call(this);
  this.userTextInput.forceNoListen = true;
};

ConversationConnection.prototype.handleSystemTextFinished = function () {
  this.userTextInput.listening = true;
};

ConversationConnection.prototype.handleUserTextSubmit = function (text) {
  this.userTextInput.listening = false;
  this.conversation.inputs[this.conversationInput].onResponse.call(this, text);
};

ConversationConnection.prototype.moveToInput = function (inputName) {
  this.conversationInput = inputName;
  var input = this.conversation.inputs[this.conversationInput];
  this.systemTextInput.animateInput(
    input.text,
    input.prewait || this.conversation.allInputs.prewait || 0
  );
};

ConversationConnection.prototype.onOpen = function () {
  this.moveToInput(this.conversation.entryInput);
};

ConversationConnection.prototype.render = function () {
  Connection.prototype.render.call(this);
  // Render text inputs
  this.systemTextInput.render();
  this.userTextInput.render();
};

ConversationConnection.prototype.renderExteriorLineIn = function () {
  if (this.systemTextInput.animation.animating) {
    Connection.prototype.renderExteriorLineIn.call(this, 2.5);
  } else {
    Connection.prototype.renderExteriorLineIn.call(this);
  }
};

ConversationConnection.prototype.renderExteriorLineOut = function () {
  if (this.userTextInput.listening) {
    Connection.prototype.renderExteriorLineOut.call(this, 2.5);
  } else {
    Connection.prototype.renderExteriorLineOut.call(this);
  }
};

ConversationConnection.prototype.select = function () {
  Connection.prototype.select.call(this);
  this.userTextInput.forceNoListen = false;
};

ConversationConnection.prototype.update = function () {
  Connection.prototype.update.call(this);
  // Update text inputs
  this.systemTextInput.update();
  this.userTextInput.update();
};

function ConnectionRails(gameEnv) {
  this.connections = [];
  this.gameEnv = gameEnv;
  this.inX = INCOMING_LINE_BUFFER;
  this.outX = W - OUTGOING_LINE_BUFFER;
  this.inCol = {r: 160, g: 160, b: 160};
  this.outCol = {r: 160, g: 160, b: 160};
  this.lineWidth = 0.5;
}

ConnectionRails.prototype.addConversationConnection = function (inY, outY, conversation) {
  var connection = new ConversationConnection(this.gameEnv, this, inY, outY, conversation);
  this.connections.push(connection);
};

ConnectionRails.prototype.render = function () {
  var that = this;
  // Render the rails themselves
  var inLine = new Phaser.Line(this.inX, 0, this.inX, H);
  var outLine = new Phaser.Line(this.outX, 0, this.outX, H);
  that.gameEnv.renderLine(
    inLine, that.lineWidth, that.inCol.r, that.inCol.g, that.inCol.b
  );
  that.gameEnv.renderLine(
    outLine, that.lineWidth, that.outCol.r, that.outCol.g, that.outCol.b
  );
  // Render connections
  _.invoke(that.connections, 'render');
};
ConnectionRails.prototype.update = function () {
  // Update connections
  _.invoke(this.connections, 'update');
};

var CONTAINER_ID = 'game';
var W, H;

function getScreenDimensions() {
  var div = document.getElementById(CONTAINER_ID);
  var out = {w: div.offsetWidth, h: div.offsetHeight};
  W = out.w;
  H = out.h;
  return out;
}

var DEV_MODE = false;
var INCOMING_LINE_BUFFER = 100.5;
var INCOMING_LINE_WIDTH = 0.5;
var OUTGOING_LINE_BUFFER = 100.5;
var OUTGOING_LINE_WIDTH = 0.5;

var backgroundColor;
var bmp;
var bmpSprite;
var rails;

var conversationConnectionSequence = {
  entryInput: 'hello',
  inputs: {
    hello: {
      text: 'hello?',
      onResponse: function (response) {
        this.moveToInput('holyshit');
      }
    },
    holyshit: {
      text: 'holy shit, you understood me?',
      onResponse: function (response) {
        this.moveToInput('thisisincredible');
      },
      prewait: 2500
    },
    thisisincredible: {
      text: 'this is incredible. do you know what you are?',
      onResponse: function (response) {
        this.systemTextInput.animateInput('wow');
      },
      prewait: 1750
    }
  },
  allInputs: {
    prewait: 1250
  }
};

var states = {
  'awakening': {
    firstConnectionTimerBegan: null,
    firstConnectionCreated: false,
    timeTillFirstConnection: DEV_MODE? 100: 15000,
    create: function (gameEnv) {
      this.firstConnectionTimerBegan = new Date();
    },
    update: function (gameEnv) {
      if (!this.firstConnectionCreated &&
          new Date() - this.firstConnectionTimerBegan > this.timeTillFirstConnection) {
        rails.addConversationConnection(
          H * 0.5, (H * 0.5) + 25,
          conversationConnectionSequence
        );
        this.firstConnectionCreated = true;
      }
    }
  }
};
var state = states.awakening;

var gameHandlers = {

  create: function () {
    var that = this;
    this.setBackgroundColor(30, 30, 30);
    bmp = this.game.add.bitmapData(W, H);
    bmpSprite = this.game.add.sprite(0, 0, bmp);
    rails = new ConnectionRails(this);
    document.addEventListener('keydown', function (event) {
      if (event.keyCode === 8 || event.keyCode === 13) {
        var myEvent = new CustomEvent('isthisit-keyinput', {
          detail: event.keyCode === 8? 'BACKSPACE': event.keyCode === 13? 'ENTER': null
        });
        document.dispatchEvent(myEvent);
        event.preventDefault();
      }
    }, false);
    this.game.input.keyboard.addCallbacks(this, null, null, function (key) {
      var myEvent = new CustomEvent('isthisit-keyinput', {detail: key});
      document.dispatchEvent(myEvent);
    });
  },

  getColorString: function (r, g, b) {
    return 'rgb(' + Math.floor(r) + ',' + Math.floor(g) + ',' + Math.floor(b) + ')';
  },

  preload: function () {},

  render: function () {
    bmp.clear();
    rails.render();
    bmp.render();
  },

  renderCircle: function (circle, width, r, g, b, fill) {
    fill = fill === undefined? false: fill;
    var colorString = this.getColorString(r, g, b);
    bmp.ctx.beginPath();
    bmp.ctx.strokeStyle = colorString;
    bmp.ctx.lineWidth = width;
    bmp.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    if (fill) {
      bmp.ctx.fillStyle = colorString;
      bmp.ctx.fill();
    }
    bmp.ctx.stroke();
    bmp.ctx.closePath();
  },

  renderLine: function (line, width, r, g, b) {
    bmp.ctx.strokeStyle = this.getColorString(r, g, b);
    bmp.ctx.lineWidth = width;
    bmp.ctx.beginPath();
    bmp.ctx.moveTo(line.start.x, line.start.y);
    bmp.ctx.lineTo(line.end.x, line.end.y);
    bmp.ctx.stroke();
    bmp.ctx.closePath();
  },

  renderText: function (text, x, y, r, g, b) {
    var colorString = this.getColorString(r, g, b);
    var fontSize = 12;
    bmp.ctx.strokeStyle = colorString;
    bmp.ctx.fillStyle = colorString;
    bmp.ctx.font = fontSize + 'px Courier';
    bmp.ctx.lineWidth = 1;
    bmp.ctx.beginPath();
    bmp.ctx.fillText(text, x, y + (fontSize / 4) + 1);
    bmp.ctx.closePath();
  },

  update: function () {
    if (!state.created) {
      console.log('First update for new state, creating');
      state.create(this);
      state.created = true;
    }
    state.update(this);
    rails.update();
  },

  setBackgroundColor: function (r, g, b) {
    backgroundColor = {r: r, g: g, b: b};
    this.game.stage.setBackgroundColor(this.getColorString(r, g, b));
  }

};

game = new Phaser.Game(
  getScreenDimensions().w,
  getScreenDimensions().h,
  Phaser.CANVAS,
  CONTAINER_ID,
  gameHandlers
);

