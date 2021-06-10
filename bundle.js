/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/rxjs/dist/esm5/internal/BehaviorSubject.js":
/*!*****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/BehaviorSubject.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BehaviorSubject": () => (/* binding */ BehaviorSubject)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Subject */ "./node_modules/rxjs/dist/esm5/internal/Subject.js");


var BehaviorSubject = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(BehaviorSubject, _super);
    function BehaviorSubject(_value) {
        var _this = _super.call(this) || this;
        _this._value = _value;
        return _this;
    }
    Object.defineProperty(BehaviorSubject.prototype, "value", {
        get: function () {
            return this.getValue();
        },
        enumerable: false,
        configurable: true
    });
    BehaviorSubject.prototype._subscribe = function (subscriber) {
        var subscription = _super.prototype._subscribe.call(this, subscriber);
        !subscription.closed && subscriber.next(this._value);
        return subscription;
    };
    BehaviorSubject.prototype.getValue = function () {
        var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, _value = _a._value;
        if (hasError) {
            throw thrownError;
        }
        this._throwIfClosed();
        return _value;
    };
    BehaviorSubject.prototype.next = function (value) {
        _super.prototype.next.call(this, (this._value = value));
    };
    return BehaviorSubject;
}(_Subject__WEBPACK_IMPORTED_MODULE_1__.Subject));

//# sourceMappingURL=BehaviorSubject.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/NotificationFactories.js":
/*!***********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/NotificationFactories.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "COMPLETE_NOTIFICATION": () => (/* binding */ COMPLETE_NOTIFICATION),
/* harmony export */   "errorNotification": () => (/* binding */ errorNotification),
/* harmony export */   "nextNotification": () => (/* binding */ nextNotification),
/* harmony export */   "createNotification": () => (/* binding */ createNotification)
/* harmony export */ });
var COMPLETE_NOTIFICATION = (function () { return createNotification('C', undefined, undefined); })();
function errorNotification(error) {
    return createNotification('E', undefined, error);
}
function nextNotification(value) {
    return createNotification('N', value, undefined);
}
function createNotification(kind, value, error) {
    return {
        kind: kind,
        value: value,
        error: error,
    };
}
//# sourceMappingURL=NotificationFactories.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/Observable.js":
/*!************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/Observable.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Observable": () => (/* binding */ Observable)
/* harmony export */ });
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Subscriber */ "./node_modules/rxjs/dist/esm5/internal/Subscriber.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Subscription */ "./node_modules/rxjs/dist/esm5/internal/Subscription.js");
/* harmony import */ var _symbol_observable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./symbol/observable */ "./node_modules/rxjs/dist/esm5/internal/symbol/observable.js");
/* harmony import */ var _util_pipe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/pipe */ "./node_modules/rxjs/dist/esm5/internal/util/pipe.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config */ "./node_modules/rxjs/dist/esm5/internal/config.js");
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util/isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");






var Observable = (function () {
    function Observable(subscribe) {
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new _Subscriber__WEBPACK_IMPORTED_MODULE_0__.SafeSubscriber(observerOrNext, error, complete);
        if (_config__WEBPACK_IMPORTED_MODULE_1__.config.useDeprecatedSynchronousErrorHandling) {
            this._deprecatedSyncErrorSubscribe(subscriber);
        }
        else {
            var _a = this, operator = _a.operator, source = _a.source;
            subscriber.add(operator
                ?
                    operator.call(subscriber, source)
                : source
                    ?
                        this._subscribe(subscriber)
                    :
                        this._trySubscribe(subscriber));
        }
        return subscriber;
    };
    Observable.prototype._deprecatedSyncErrorSubscribe = function (subscriber) {
        var localSubscriber = subscriber;
        localSubscriber._syncErrorHack_isSubscribing = true;
        var operator = this.operator;
        if (operator) {
            subscriber.add(operator.call(subscriber, this.source));
        }
        else {
            try {
                subscriber.add(this._subscribe(subscriber));
            }
            catch (err) {
                localSubscriber.__syncError = err;
            }
        }
        var dest = localSubscriber;
        while (dest) {
            if ('__syncError' in dest) {
                try {
                    throw dest.__syncError;
                }
                finally {
                    subscriber.unsubscribe();
                }
            }
            dest = dest.destination;
        }
        localSubscriber._syncErrorHack_isSubscribing = false;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            sink.error(err);
        }
    };
    Observable.prototype.forEach = function (next, promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var subscription;
            subscription = _this.subscribe(function (value) {
                try {
                    next(value);
                }
                catch (err) {
                    reject(err);
                    subscription === null || subscription === void 0 ? void 0 : subscription.unsubscribe();
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        var _a;
        return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
    };
    Observable.prototype[_symbol_observable__WEBPACK_IMPORTED_MODULE_2__.observable] = function () {
        return this;
    };
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        return operations.length ? (0,_util_pipe__WEBPACK_IMPORTED_MODULE_3__.pipeFromArray)(operations)(this) : this;
    };
    Observable.prototype.toPromise = function (promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return (value = x); }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());

function getPromiseCtor(promiseCtor) {
    var _a;
    return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : _config__WEBPACK_IMPORTED_MODULE_1__.config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
    return value && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_4__.isFunction)(value.next) && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_4__.isFunction)(value.error) && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_4__.isFunction)(value.complete);
}
function isSubscriber(value) {
    return (value && value instanceof _Subscriber__WEBPACK_IMPORTED_MODULE_0__.Subscriber) || (isObserver(value) && (0,_Subscription__WEBPACK_IMPORTED_MODULE_5__.isSubscription)(value));
}
//# sourceMappingURL=Observable.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/Scheduler.js":
/*!***********************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/Scheduler.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Scheduler": () => (/* binding */ Scheduler)
/* harmony export */ });
/* harmony import */ var _scheduler_dateTimestampProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scheduler/dateTimestampProvider */ "./node_modules/rxjs/dist/esm5/internal/scheduler/dateTimestampProvider.js");

var Scheduler = (function () {
    function Scheduler(schedulerActionCtor, now) {
        if (now === void 0) { now = Scheduler.now; }
        this.schedulerActionCtor = schedulerActionCtor;
        this.now = now;
    }
    Scheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) { delay = 0; }
        return new this.schedulerActionCtor(this, work).schedule(state, delay);
    };
    Scheduler.now = _scheduler_dateTimestampProvider__WEBPACK_IMPORTED_MODULE_0__.dateTimestampProvider.now;
    return Scheduler;
}());

//# sourceMappingURL=Scheduler.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/Subject.js":
/*!*********************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/Subject.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Subject": () => (/* binding */ Subject),
/* harmony export */   "AnonymousSubject": () => (/* binding */ AnonymousSubject)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Observable */ "./node_modules/rxjs/dist/esm5/internal/Observable.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Subscription */ "./node_modules/rxjs/dist/esm5/internal/Subscription.js");
/* harmony import */ var _util_ObjectUnsubscribedError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/ObjectUnsubscribedError */ "./node_modules/rxjs/dist/esm5/internal/util/ObjectUnsubscribedError.js");
/* harmony import */ var _util_arrRemove__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/arrRemove */ "./node_modules/rxjs/dist/esm5/internal/util/arrRemove.js");





var Subject = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(Subject, _super);
    function Subject() {
        var _this = _super.call(this) || this;
        _this.closed = false;
        _this.observers = [];
        _this.isStopped = false;
        _this.hasError = false;
        _this.thrownError = null;
        return _this;
    }
    Subject.prototype.lift = function (operator) {
        var subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype._throwIfClosed = function () {
        if (this.closed) {
            throw new _util_ObjectUnsubscribedError__WEBPACK_IMPORTED_MODULE_1__.ObjectUnsubscribedError();
        }
    };
    Subject.prototype.next = function (value) {
        var e_1, _a;
        this._throwIfClosed();
        if (!this.isStopped) {
            var copy = this.observers.slice();
            try {
                for (var copy_1 = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__values)(copy), copy_1_1 = copy_1.next(); !copy_1_1.done; copy_1_1 = copy_1.next()) {
                    var observer = copy_1_1.value;
                    observer.next(value);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (copy_1_1 && !copy_1_1.done && (_a = copy_1.return)) _a.call(copy_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    Subject.prototype.error = function (err) {
        this._throwIfClosed();
        if (!this.isStopped) {
            this.hasError = this.isStopped = true;
            this.thrownError = err;
            var observers = this.observers;
            while (observers.length) {
                observers.shift().error(err);
            }
        }
    };
    Subject.prototype.complete = function () {
        this._throwIfClosed();
        if (!this.isStopped) {
            this.isStopped = true;
            var observers = this.observers;
            while (observers.length) {
                observers.shift().complete();
            }
        }
    };
    Subject.prototype.unsubscribe = function () {
        this.isStopped = this.closed = true;
        this.observers = null;
    };
    Object.defineProperty(Subject.prototype, "observed", {
        get: function () {
            var _a;
            return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
        },
        enumerable: false,
        configurable: true
    });
    Subject.prototype._trySubscribe = function (subscriber) {
        this._throwIfClosed();
        return _super.prototype._trySubscribe.call(this, subscriber);
    };
    Subject.prototype._subscribe = function (subscriber) {
        this._throwIfClosed();
        this._checkFinalizedStatuses(subscriber);
        return this._innerSubscribe(subscriber);
    };
    Subject.prototype._innerSubscribe = function (subscriber) {
        var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
        return hasError || isStopped
            ? _Subscription__WEBPACK_IMPORTED_MODULE_2__.EMPTY_SUBSCRIPTION
            : (observers.push(subscriber), new _Subscription__WEBPACK_IMPORTED_MODULE_2__.Subscription(function () { return (0,_util_arrRemove__WEBPACK_IMPORTED_MODULE_3__.arrRemove)(observers, subscriber); }));
    };
    Subject.prototype._checkFinalizedStatuses = function (subscriber) {
        var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
        if (hasError) {
            subscriber.error(thrownError);
        }
        else if (isStopped) {
            subscriber.complete();
        }
    };
    Subject.prototype.asObservable = function () {
        var observable = new _Observable__WEBPACK_IMPORTED_MODULE_4__.Observable();
        observable.source = this;
        return observable;
    };
    Subject.create = function (destination, source) {
        return new AnonymousSubject(destination, source);
    };
    return Subject;
}(_Observable__WEBPACK_IMPORTED_MODULE_4__.Observable));

var AnonymousSubject = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
        var _this = _super.call(this) || this;
        _this.destination = destination;
        _this.source = source;
        return _this;
    }
    AnonymousSubject.prototype.next = function (value) {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
    };
    AnonymousSubject.prototype.error = function (err) {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
    };
    AnonymousSubject.prototype.complete = function () {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    AnonymousSubject.prototype._subscribe = function (subscriber) {
        var _a, _b;
        return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : _Subscription__WEBPACK_IMPORTED_MODULE_2__.EMPTY_SUBSCRIPTION;
    };
    return AnonymousSubject;
}(Subject));

//# sourceMappingURL=Subject.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/Subscriber.js":
/*!************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/Subscriber.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Subscriber": () => (/* binding */ Subscriber),
/* harmony export */   "SafeSubscriber": () => (/* binding */ SafeSubscriber),
/* harmony export */   "EMPTY_OBSERVER": () => (/* binding */ EMPTY_OBSERVER)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Subscription */ "./node_modules/rxjs/dist/esm5/internal/Subscription.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./config */ "./node_modules/rxjs/dist/esm5/internal/config.js");
/* harmony import */ var _util_reportUnhandledError__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./util/reportUnhandledError */ "./node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js");
/* harmony import */ var _util_noop__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util/noop */ "./node_modules/rxjs/dist/esm5/internal/util/noop.js");
/* harmony import */ var _NotificationFactories__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NotificationFactories */ "./node_modules/rxjs/dist/esm5/internal/NotificationFactories.js");
/* harmony import */ var _scheduler_timeoutProvider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./scheduler/timeoutProvider */ "./node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js");








var Subscriber = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(Subscriber, _super);
    function Subscriber(destination) {
        var _this = _super.call(this) || this;
        _this.isStopped = false;
        if (destination) {
            _this.destination = destination;
            if ((0,_Subscription__WEBPACK_IMPORTED_MODULE_1__.isSubscription)(destination)) {
                destination.add(_this);
            }
        }
        else {
            _this.destination = EMPTY_OBSERVER;
        }
        return _this;
    }
    Subscriber.create = function (next, error, complete) {
        return new SafeSubscriber(next, error, complete);
    };
    Subscriber.prototype.next = function (value) {
        if (this.isStopped) {
            handleStoppedNotification((0,_NotificationFactories__WEBPACK_IMPORTED_MODULE_2__.nextNotification)(value), this);
        }
        else {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (this.isStopped) {
            handleStoppedNotification((0,_NotificationFactories__WEBPACK_IMPORTED_MODULE_2__.errorNotification)(err), this);
        }
        else {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (this.isStopped) {
            handleStoppedNotification(_NotificationFactories__WEBPACK_IMPORTED_MODULE_2__.COMPLETE_NOTIFICATION, this);
        }
        else {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (!this.closed) {
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
            this.destination = null;
        }
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        try {
            this.destination.error(err);
        }
        finally {
            this.unsubscribe();
        }
    };
    Subscriber.prototype._complete = function () {
        try {
            this.destination.complete();
        }
        finally {
            this.unsubscribe();
        }
    };
    return Subscriber;
}(_Subscription__WEBPACK_IMPORTED_MODULE_1__.Subscription));

var SafeSubscriber = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(SafeSubscriber, _super);
    function SafeSubscriber(observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        var next;
        if ((0,_util_isFunction__WEBPACK_IMPORTED_MODULE_3__.isFunction)(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            (next = observerOrNext.next, error = observerOrNext.error, complete = observerOrNext.complete);
            var context_1;
            if (_this && _config__WEBPACK_IMPORTED_MODULE_4__.config.useDeprecatedNextContext) {
                context_1 = Object.create(observerOrNext);
                context_1.unsubscribe = function () { return _this.unsubscribe(); };
            }
            else {
                context_1 = observerOrNext;
            }
            next = next === null || next === void 0 ? void 0 : next.bind(context_1);
            error = error === null || error === void 0 ? void 0 : error.bind(context_1);
            complete = complete === null || complete === void 0 ? void 0 : complete.bind(context_1);
        }
        _this.destination = {
            next: next ? wrapForErrorHandling(next, _this) : _util_noop__WEBPACK_IMPORTED_MODULE_5__.noop,
            error: wrapForErrorHandling(error !== null && error !== void 0 ? error : defaultErrorHandler, _this),
            complete: complete ? wrapForErrorHandling(complete, _this) : _util_noop__WEBPACK_IMPORTED_MODULE_5__.noop,
        };
        return _this;
    }
    return SafeSubscriber;
}(Subscriber));

function wrapForErrorHandling(handler, instance) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        try {
            handler.apply(void 0, (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__read)(args)));
        }
        catch (err) {
            if (_config__WEBPACK_IMPORTED_MODULE_4__.config.useDeprecatedSynchronousErrorHandling) {
                if (instance._syncErrorHack_isSubscribing) {
                    instance.__syncError = err;
                }
                else {
                    throw err;
                }
            }
            else {
                (0,_util_reportUnhandledError__WEBPACK_IMPORTED_MODULE_6__.reportUnhandledError)(err);
            }
        }
    };
}
function defaultErrorHandler(err) {
    throw err;
}
function handleStoppedNotification(notification, subscriber) {
    var onStoppedNotification = _config__WEBPACK_IMPORTED_MODULE_4__.config.onStoppedNotification;
    onStoppedNotification && _scheduler_timeoutProvider__WEBPACK_IMPORTED_MODULE_7__.timeoutProvider.setTimeout(function () { return onStoppedNotification(notification, subscriber); });
}
var EMPTY_OBSERVER = {
    closed: true,
    next: _util_noop__WEBPACK_IMPORTED_MODULE_5__.noop,
    error: defaultErrorHandler,
    complete: _util_noop__WEBPACK_IMPORTED_MODULE_5__.noop,
};
//# sourceMappingURL=Subscriber.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/Subscription.js":
/*!**************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/Subscription.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Subscription": () => (/* binding */ Subscription),
/* harmony export */   "EMPTY_SUBSCRIPTION": () => (/* binding */ EMPTY_SUBSCRIPTION),
/* harmony export */   "isSubscription": () => (/* binding */ isSubscription)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");
/* harmony import */ var _util_UnsubscriptionError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util/UnsubscriptionError */ "./node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js");
/* harmony import */ var _util_arrRemove__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/arrRemove */ "./node_modules/rxjs/dist/esm5/internal/util/arrRemove.js");




var Subscription = (function () {
    function Subscription(initialTeardown) {
        this.initialTeardown = initialTeardown;
        this.closed = false;
        this._parentage = null;
        this._teardowns = null;
    }
    Subscription.prototype.unsubscribe = function () {
        var e_1, _a, e_2, _b;
        var errors;
        if (!this.closed) {
            this.closed = true;
            var _parentage = this._parentage;
            if (_parentage) {
                this._parentage = null;
                if (Array.isArray(_parentage)) {
                    try {
                        for (var _parentage_1 = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__values)(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                            var parent_1 = _parentage_1_1.value;
                            parent_1.remove(this);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                else {
                    _parentage.remove(this);
                }
            }
            var initialTeardown = this.initialTeardown;
            if ((0,_util_isFunction__WEBPACK_IMPORTED_MODULE_1__.isFunction)(initialTeardown)) {
                try {
                    initialTeardown();
                }
                catch (e) {
                    errors = e instanceof _util_UnsubscriptionError__WEBPACK_IMPORTED_MODULE_2__.UnsubscriptionError ? e.errors : [e];
                }
            }
            var _teardowns = this._teardowns;
            if (_teardowns) {
                this._teardowns = null;
                try {
                    for (var _teardowns_1 = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__values)(_teardowns), _teardowns_1_1 = _teardowns_1.next(); !_teardowns_1_1.done; _teardowns_1_1 = _teardowns_1.next()) {
                        var teardown_1 = _teardowns_1_1.value;
                        try {
                            execTeardown(teardown_1);
                        }
                        catch (err) {
                            errors = errors !== null && errors !== void 0 ? errors : [];
                            if (err instanceof _util_UnsubscriptionError__WEBPACK_IMPORTED_MODULE_2__.UnsubscriptionError) {
                                errors = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__read)(errors)), (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__read)(err.errors));
                            }
                            else {
                                errors.push(err);
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_teardowns_1_1 && !_teardowns_1_1.done && (_b = _teardowns_1.return)) _b.call(_teardowns_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            if (errors) {
                throw new _util_UnsubscriptionError__WEBPACK_IMPORTED_MODULE_2__.UnsubscriptionError(errors);
            }
        }
    };
    Subscription.prototype.add = function (teardown) {
        var _a;
        if (teardown && teardown !== this) {
            if (this.closed) {
                execTeardown(teardown);
            }
            else {
                if (teardown instanceof Subscription) {
                    if (teardown.closed || teardown._hasParent(this)) {
                        return;
                    }
                    teardown._addParent(this);
                }
                (this._teardowns = (_a = this._teardowns) !== null && _a !== void 0 ? _a : []).push(teardown);
            }
        }
    };
    Subscription.prototype._hasParent = function (parent) {
        var _parentage = this._parentage;
        return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
    };
    Subscription.prototype._addParent = function (parent) {
        var _parentage = this._parentage;
        this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
    };
    Subscription.prototype._removeParent = function (parent) {
        var _parentage = this._parentage;
        if (_parentage === parent) {
            this._parentage = null;
        }
        else if (Array.isArray(_parentage)) {
            (0,_util_arrRemove__WEBPACK_IMPORTED_MODULE_3__.arrRemove)(_parentage, parent);
        }
    };
    Subscription.prototype.remove = function (teardown) {
        var _teardowns = this._teardowns;
        _teardowns && (0,_util_arrRemove__WEBPACK_IMPORTED_MODULE_3__.arrRemove)(_teardowns, teardown);
        if (teardown instanceof Subscription) {
            teardown._removeParent(this);
        }
    };
    Subscription.EMPTY = (function () {
        var empty = new Subscription();
        empty.closed = true;
        return empty;
    })();
    return Subscription;
}());

var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
    return (value instanceof Subscription ||
        (value && 'closed' in value && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value.remove) && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value.add) && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value.unsubscribe)));
}
function execTeardown(teardown) {
    if ((0,_util_isFunction__WEBPACK_IMPORTED_MODULE_1__.isFunction)(teardown)) {
        teardown();
    }
    else {
        teardown.unsubscribe();
    }
}
//# sourceMappingURL=Subscription.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/config.js":
/*!********************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/config.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "config": () => (/* binding */ config)
/* harmony export */ });
var config = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: undefined,
    useDeprecatedSynchronousErrorHandling: false,
    useDeprecatedNextContext: false,
};
//# sourceMappingURL=config.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/observable/combineLatest.js":
/*!**************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/observable/combineLatest.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "combineLatest": () => (/* binding */ combineLatest),
/* harmony export */   "combineLatestInit": () => (/* binding */ combineLatestInit)
/* harmony export */ });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Observable */ "./node_modules/rxjs/dist/esm5/internal/Observable.js");
/* harmony import */ var _util_argsArgArrayOrObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/argsArgArrayOrObject */ "./node_modules/rxjs/dist/esm5/internal/util/argsArgArrayOrObject.js");
/* harmony import */ var _from__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./from */ "./node_modules/rxjs/dist/esm5/internal/observable/from.js");
/* harmony import */ var _util_identity__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../util/identity */ "./node_modules/rxjs/dist/esm5/internal/util/identity.js");
/* harmony import */ var _util_mapOneOrManyArgs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../util/mapOneOrManyArgs */ "./node_modules/rxjs/dist/esm5/internal/util/mapOneOrManyArgs.js");
/* harmony import */ var _util_args__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/args */ "./node_modules/rxjs/dist/esm5/internal/util/args.js");
/* harmony import */ var _util_createObject__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/createObject */ "./node_modules/rxjs/dist/esm5/internal/util/createObject.js");
/* harmony import */ var _operators_OperatorSubscriber__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../operators/OperatorSubscriber */ "./node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js");








function combineLatest() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var scheduler = (0,_util_args__WEBPACK_IMPORTED_MODULE_0__.popScheduler)(args);
    var resultSelector = (0,_util_args__WEBPACK_IMPORTED_MODULE_0__.popResultSelector)(args);
    var _a = (0,_util_argsArgArrayOrObject__WEBPACK_IMPORTED_MODULE_1__.argsArgArrayOrObject)(args), observables = _a.args, keys = _a.keys;
    if (observables.length === 0) {
        return (0,_from__WEBPACK_IMPORTED_MODULE_2__.from)([], scheduler);
    }
    var result = new _Observable__WEBPACK_IMPORTED_MODULE_3__.Observable(combineLatestInit(observables, scheduler, keys
        ?
            function (values) { return (0,_util_createObject__WEBPACK_IMPORTED_MODULE_4__.createObject)(keys, values); }
        :
            _util_identity__WEBPACK_IMPORTED_MODULE_5__.identity));
    return resultSelector ? result.pipe((0,_util_mapOneOrManyArgs__WEBPACK_IMPORTED_MODULE_6__.mapOneOrManyArgs)(resultSelector)) : result;
}
function combineLatestInit(observables, scheduler, valueTransform) {
    if (valueTransform === void 0) { valueTransform = _util_identity__WEBPACK_IMPORTED_MODULE_5__.identity; }
    return function (subscriber) {
        maybeSchedule(scheduler, function () {
            var length = observables.length;
            var values = new Array(length);
            var active = length;
            var remainingFirstValues = length;
            var _loop_1 = function (i) {
                maybeSchedule(scheduler, function () {
                    var source = (0,_from__WEBPACK_IMPORTED_MODULE_2__.from)(observables[i], scheduler);
                    var hasFirstValue = false;
                    source.subscribe(new _operators_OperatorSubscriber__WEBPACK_IMPORTED_MODULE_7__.OperatorSubscriber(subscriber, function (value) {
                        values[i] = value;
                        if (!hasFirstValue) {
                            hasFirstValue = true;
                            remainingFirstValues--;
                        }
                        if (!remainingFirstValues) {
                            subscriber.next(valueTransform(values.slice()));
                        }
                    }, function () {
                        if (!--active) {
                            subscriber.complete();
                        }
                    }));
                }, subscriber);
            };
            for (var i = 0; i < length; i++) {
                _loop_1(i);
            }
        }, subscriber);
    };
}
function maybeSchedule(scheduler, execute, subscription) {
    if (scheduler) {
        subscription.add(scheduler.schedule(execute));
    }
    else {
        execute();
    }
}
//# sourceMappingURL=combineLatest.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/observable/defer.js":
/*!******************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/observable/defer.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defer": () => (/* binding */ defer)
/* harmony export */ });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "./node_modules/rxjs/dist/esm5/internal/Observable.js");
/* harmony import */ var _from__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./from */ "./node_modules/rxjs/dist/esm5/internal/observable/from.js");


function defer(observableFactory) {
    return new _Observable__WEBPACK_IMPORTED_MODULE_0__.Observable(function (subscriber) {
        (0,_from__WEBPACK_IMPORTED_MODULE_1__.innerFrom)(observableFactory()).subscribe(subscriber);
    });
}
//# sourceMappingURL=defer.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/observable/empty.js":
/*!******************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/observable/empty.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EMPTY": () => (/* binding */ EMPTY),
/* harmony export */   "empty": () => (/* binding */ empty)
/* harmony export */ });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "./node_modules/rxjs/dist/esm5/internal/Observable.js");

var EMPTY = new _Observable__WEBPACK_IMPORTED_MODULE_0__.Observable(function (subscriber) { return subscriber.complete(); });
function empty(scheduler) {
    return scheduler ? emptyScheduled(scheduler) : EMPTY;
}
function emptyScheduled(scheduler) {
    return new _Observable__WEBPACK_IMPORTED_MODULE_0__.Observable(function (subscriber) { return scheduler.schedule(function () { return subscriber.complete(); }); });
}
//# sourceMappingURL=empty.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/observable/from.js":
/*!*****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/observable/from.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "from": () => (/* binding */ from),
/* harmony export */   "innerFrom": () => (/* binding */ innerFrom),
/* harmony export */   "fromArrayLike": () => (/* binding */ fromArrayLike)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _util_isArrayLike__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/isArrayLike */ "./node_modules/rxjs/dist/esm5/internal/util/isArrayLike.js");
/* harmony import */ var _util_isPromise__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/isPromise */ "./node_modules/rxjs/dist/esm5/internal/util/isPromise.js");
/* harmony import */ var _symbol_observable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../symbol/observable */ "./node_modules/rxjs/dist/esm5/internal/symbol/observable.js");
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Observable */ "./node_modules/rxjs/dist/esm5/internal/Observable.js");
/* harmony import */ var _scheduled_scheduled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scheduled/scheduled */ "./node_modules/rxjs/dist/esm5/internal/scheduled/scheduled.js");
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../util/isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");
/* harmony import */ var _util_reportUnhandledError__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../util/reportUnhandledError */ "./node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js");
/* harmony import */ var _util_isInteropObservable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/isInteropObservable */ "./node_modules/rxjs/dist/esm5/internal/util/isInteropObservable.js");
/* harmony import */ var _util_isAsyncIterable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../util/isAsyncIterable */ "./node_modules/rxjs/dist/esm5/internal/util/isAsyncIterable.js");
/* harmony import */ var _util_throwUnobservableError__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../util/throwUnobservableError */ "./node_modules/rxjs/dist/esm5/internal/util/throwUnobservableError.js");
/* harmony import */ var _util_isIterable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../util/isIterable */ "./node_modules/rxjs/dist/esm5/internal/util/isIterable.js");
/* harmony import */ var _util_isReadableStreamLike__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../util/isReadableStreamLike */ "./node_modules/rxjs/dist/esm5/internal/util/isReadableStreamLike.js");













function from(input, scheduler) {
    return scheduler ? (0,_scheduled_scheduled__WEBPACK_IMPORTED_MODULE_0__.scheduled)(input, scheduler) : innerFrom(input);
}
function innerFrom(input) {
    if (input instanceof _Observable__WEBPACK_IMPORTED_MODULE_1__.Observable) {
        return input;
    }
    if (input != null) {
        if ((0,_util_isInteropObservable__WEBPACK_IMPORTED_MODULE_2__.isInteropObservable)(input)) {
            return fromInteropObservable(input);
        }
        if ((0,_util_isArrayLike__WEBPACK_IMPORTED_MODULE_3__.isArrayLike)(input)) {
            return fromArrayLike(input);
        }
        if ((0,_util_isPromise__WEBPACK_IMPORTED_MODULE_4__.isPromise)(input)) {
            return fromPromise(input);
        }
        if ((0,_util_isAsyncIterable__WEBPACK_IMPORTED_MODULE_5__.isAsyncIterable)(input)) {
            return fromAsyncIterable(input);
        }
        if ((0,_util_isIterable__WEBPACK_IMPORTED_MODULE_6__.isIterable)(input)) {
            return fromIterable(input);
        }
        if ((0,_util_isReadableStreamLike__WEBPACK_IMPORTED_MODULE_7__.isReadableStreamLike)(input)) {
            return fromReadableStreamLike(input);
        }
    }
    throw (0,_util_throwUnobservableError__WEBPACK_IMPORTED_MODULE_8__.createInvalidObservableTypeError)(input);
}
function fromInteropObservable(obj) {
    return new _Observable__WEBPACK_IMPORTED_MODULE_1__.Observable(function (subscriber) {
        var obs = obj[_symbol_observable__WEBPACK_IMPORTED_MODULE_9__.observable]();
        if ((0,_util_isFunction__WEBPACK_IMPORTED_MODULE_10__.isFunction)(obs.subscribe)) {
            return obs.subscribe(subscriber);
        }
        throw new TypeError('Provided object does not correctly implement Symbol.observable');
    });
}
function fromArrayLike(array) {
    return new _Observable__WEBPACK_IMPORTED_MODULE_1__.Observable(function (subscriber) {
        for (var i = 0; i < array.length && !subscriber.closed; i++) {
            subscriber.next(array[i]);
        }
        subscriber.complete();
    });
}
function fromPromise(promise) {
    return new _Observable__WEBPACK_IMPORTED_MODULE_1__.Observable(function (subscriber) {
        promise
            .then(function (value) {
            if (!subscriber.closed) {
                subscriber.next(value);
                subscriber.complete();
            }
        }, function (err) { return subscriber.error(err); })
            .then(null, _util_reportUnhandledError__WEBPACK_IMPORTED_MODULE_11__.reportUnhandledError);
    });
}
function fromIterable(iterable) {
    return new _Observable__WEBPACK_IMPORTED_MODULE_1__.Observable(function (subscriber) {
        var e_1, _a;
        try {
            for (var iterable_1 = (0,tslib__WEBPACK_IMPORTED_MODULE_12__.__values)(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                var value = iterable_1_1.value;
                subscriber.next(value);
                if (subscriber.closed) {
                    return;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        subscriber.complete();
    });
}
function fromAsyncIterable(asyncIterable) {
    return new _Observable__WEBPACK_IMPORTED_MODULE_1__.Observable(function (subscriber) {
        process(asyncIterable, subscriber).catch(function (err) { return subscriber.error(err); });
    });
}
function fromReadableStreamLike(readableStream) {
    return fromAsyncIterable((0,_util_isReadableStreamLike__WEBPACK_IMPORTED_MODULE_7__.readableStreamLikeToAsyncGenerator)(readableStream));
}
function process(asyncIterable, subscriber) {
    var asyncIterable_1, asyncIterable_1_1;
    var e_2, _a;
    return (0,tslib__WEBPACK_IMPORTED_MODULE_12__.__awaiter)(this, void 0, void 0, function () {
        var value, e_2_1;
        return (0,tslib__WEBPACK_IMPORTED_MODULE_12__.__generator)(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, 6, 11]);
                    asyncIterable_1 = (0,tslib__WEBPACK_IMPORTED_MODULE_12__.__asyncValues)(asyncIterable);
                    _b.label = 1;
                case 1: return [4, asyncIterable_1.next()];
                case 2:
                    if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [3, 4];
                    value = asyncIterable_1_1.value;
                    subscriber.next(value);
                    if (subscriber.closed) {
                        return [2];
                    }
                    _b.label = 3;
                case 3: return [3, 1];
                case 4: return [3, 11];
                case 5:
                    e_2_1 = _b.sent();
                    e_2 = { error: e_2_1 };
                    return [3, 11];
                case 6:
                    _b.trys.push([6, , 9, 10]);
                    if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return))) return [3, 8];
                    return [4, _a.call(asyncIterable_1)];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8: return [3, 10];
                case 9:
                    if (e_2) throw e_2.error;
                    return [7];
                case 10: return [7];
                case 11:
                    subscriber.complete();
                    return [2];
            }
        });
    });
}
//# sourceMappingURL=from.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/observable/fromArray.js":
/*!**********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/observable/fromArray.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "internalFromArray": () => (/* binding */ internalFromArray)
/* harmony export */ });
/* harmony import */ var _scheduled_scheduleArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scheduled/scheduleArray */ "./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleArray.js");
/* harmony import */ var _from__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./from */ "./node_modules/rxjs/dist/esm5/internal/observable/from.js");


function internalFromArray(input, scheduler) {
    return scheduler ? (0,_scheduled_scheduleArray__WEBPACK_IMPORTED_MODULE_0__.scheduleArray)(input, scheduler) : (0,_from__WEBPACK_IMPORTED_MODULE_1__.fromArrayLike)(input);
}
//# sourceMappingURL=fromArray.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/observable/fromEvent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/observable/fromEvent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fromEvent": () => (/* binding */ fromEvent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Observable */ "./node_modules/rxjs/dist/esm5/internal/Observable.js");
/* harmony import */ var _operators_mergeMap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../operators/mergeMap */ "./node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js");
/* harmony import */ var _util_isArrayLike__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/isArrayLike */ "./node_modules/rxjs/dist/esm5/internal/util/isArrayLike.js");
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");
/* harmony import */ var _util_mapOneOrManyArgs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/mapOneOrManyArgs */ "./node_modules/rxjs/dist/esm5/internal/util/mapOneOrManyArgs.js");
/* harmony import */ var _fromArray__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./fromArray */ "./node_modules/rxjs/dist/esm5/internal/observable/fromArray.js");







var nodeEventEmitterMethods = ['addListener', 'removeListener'];
var eventTargetMethods = ['addEventListener', 'removeEventListener'];
var jqueryMethods = ['on', 'off'];
function fromEvent(target, eventName, options, resultSelector) {
    if ((0,_util_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(options)) {
        resultSelector = options;
        options = undefined;
    }
    if (resultSelector) {
        return fromEvent(target, eventName, options).pipe((0,_util_mapOneOrManyArgs__WEBPACK_IMPORTED_MODULE_1__.mapOneOrManyArgs)(resultSelector));
    }
    var _a = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__read)(isEventTarget(target)
        ? eventTargetMethods.map(function (methodName) { return function (handler) { return target[methodName](eventName, handler, options); }; })
        :
            isNodeStyleEventEmitter(target)
                ? nodeEventEmitterMethods.map(toCommonHandlerRegistry(target, eventName))
                : isJQueryStyleEventEmitter(target)
                    ? jqueryMethods.map(toCommonHandlerRegistry(target, eventName))
                    : [], 2), add = _a[0], remove = _a[1];
    if (!add) {
        if ((0,_util_isArrayLike__WEBPACK_IMPORTED_MODULE_3__.isArrayLike)(target)) {
            return (0,_operators_mergeMap__WEBPACK_IMPORTED_MODULE_4__.mergeMap)(function (subTarget) { return fromEvent(subTarget, eventName, options); })((0,_fromArray__WEBPACK_IMPORTED_MODULE_5__.internalFromArray)(target));
        }
    }
    if (!add) {
        throw new TypeError('Invalid event target');
    }
    return new _Observable__WEBPACK_IMPORTED_MODULE_6__.Observable(function (subscriber) {
        var handler = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return subscriber.next(1 < args.length ? args : args[0]);
        };
        add(handler);
        return function () { return remove(handler); };
    });
}
function toCommonHandlerRegistry(target, eventName) {
    return function (methodName) { return function (handler) { return target[methodName](eventName, handler); }; };
}
function isNodeStyleEventEmitter(target) {
    return (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(target.addListener) && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(target.removeListener);
}
function isJQueryStyleEventEmitter(target) {
    return (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(target.on) && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(target.off);
}
function isEventTarget(target) {
    return (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(target.addEventListener) && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(target.removeEventListener);
}
//# sourceMappingURL=fromEvent.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/observable/of.js":
/*!***************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/observable/of.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "of": () => (/* binding */ of)
/* harmony export */ });
/* harmony import */ var _fromArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fromArray */ "./node_modules/rxjs/dist/esm5/internal/observable/fromArray.js");
/* harmony import */ var _scheduled_scheduleArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scheduled/scheduleArray */ "./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleArray.js");
/* harmony import */ var _util_args__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/args */ "./node_modules/rxjs/dist/esm5/internal/util/args.js");



function of() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var scheduler = (0,_util_args__WEBPACK_IMPORTED_MODULE_0__.popScheduler)(args);
    return scheduler ? (0,_scheduled_scheduleArray__WEBPACK_IMPORTED_MODULE_1__.scheduleArray)(args, scheduler) : (0,_fromArray__WEBPACK_IMPORTED_MODULE_2__.internalFromArray)(args);
}
//# sourceMappingURL=of.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/observable/timer.js":
/*!******************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/observable/timer.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "timer": () => (/* binding */ timer)
/* harmony export */ });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Observable */ "./node_modules/rxjs/dist/esm5/internal/Observable.js");
/* harmony import */ var _scheduler_async__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scheduler/async */ "./node_modules/rxjs/dist/esm5/internal/scheduler/async.js");
/* harmony import */ var _util_isScheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/isScheduler */ "./node_modules/rxjs/dist/esm5/internal/util/isScheduler.js");
/* harmony import */ var _util_isDate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/isDate */ "./node_modules/rxjs/dist/esm5/internal/util/isDate.js");




function timer(dueTime, intervalOrScheduler, scheduler) {
    if (dueTime === void 0) { dueTime = 0; }
    if (scheduler === void 0) { scheduler = _scheduler_async__WEBPACK_IMPORTED_MODULE_0__.async; }
    var intervalDuration = -1;
    if (intervalOrScheduler != null) {
        if ((0,_util_isScheduler__WEBPACK_IMPORTED_MODULE_1__.isScheduler)(intervalOrScheduler)) {
            scheduler = intervalOrScheduler;
        }
        else {
            intervalDuration = intervalOrScheduler;
        }
    }
    return new _Observable__WEBPACK_IMPORTED_MODULE_2__.Observable(function (subscriber) {
        var due = (0,_util_isDate__WEBPACK_IMPORTED_MODULE_3__.isValidDate)(dueTime) ? +dueTime - scheduler.now() : dueTime;
        if (due < 0) {
            due = 0;
        }
        var n = 0;
        return scheduler.schedule(function () {
            if (!subscriber.closed) {
                subscriber.next(n++);
                if (0 <= intervalDuration) {
                    this.schedule(undefined, intervalDuration);
                }
                else {
                    subscriber.complete();
                }
            }
        }, due);
    });
}
//# sourceMappingURL=timer.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js":
/*!******************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OperatorSubscriber": () => (/* binding */ OperatorSubscriber)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscriber */ "./node_modules/rxjs/dist/esm5/internal/Subscriber.js");


var OperatorSubscriber = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(OperatorSubscriber, _super);
    function OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
        var _this = _super.call(this, destination) || this;
        _this.onFinalize = onFinalize;
        _this._next = onNext
            ? function (value) {
                try {
                    onNext(value);
                }
                catch (err) {
                    destination.error(err);
                }
            }
            : _super.prototype._next;
        _this._error = onError
            ? function (err) {
                try {
                    onError(err);
                }
                catch (err) {
                    destination.error(err);
                }
                finally {
                    this.unsubscribe();
                }
            }
            : _super.prototype._error;
        _this._complete = onComplete
            ? function () {
                try {
                    onComplete();
                }
                catch (err) {
                    destination.error(err);
                }
                finally {
                    this.unsubscribe();
                }
            }
            : _super.prototype._complete;
        return _this;
    }
    OperatorSubscriber.prototype.unsubscribe = function () {
        var _a;
        var closed = this.closed;
        _super.prototype.unsubscribe.call(this);
        !closed && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
    };
    return OperatorSubscriber;
}(_Subscriber__WEBPACK_IMPORTED_MODULE_1__.Subscriber));

//# sourceMappingURL=OperatorSubscriber.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/combineLatest.js":
/*!*************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/combineLatest.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "combineLatest": () => (/* binding */ combineLatest)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _observable_combineLatest__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../observable/combineLatest */ "./node_modules/rxjs/dist/esm5/internal/observable/combineLatest.js");
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/lift */ "./node_modules/rxjs/dist/esm5/internal/util/lift.js");
/* harmony import */ var _util_argsOrArgArray__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../util/argsOrArgArray */ "./node_modules/rxjs/dist/esm5/internal/util/argsOrArgArray.js");
/* harmony import */ var _util_mapOneOrManyArgs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/mapOneOrManyArgs */ "./node_modules/rxjs/dist/esm5/internal/util/mapOneOrManyArgs.js");
/* harmony import */ var _util_pipe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/pipe */ "./node_modules/rxjs/dist/esm5/internal/util/pipe.js");
/* harmony import */ var _util_args__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/args */ "./node_modules/rxjs/dist/esm5/internal/util/args.js");







function combineLatest() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var resultSelector = (0,_util_args__WEBPACK_IMPORTED_MODULE_0__.popResultSelector)(args);
    return resultSelector
        ? (0,_util_pipe__WEBPACK_IMPORTED_MODULE_1__.pipe)(combineLatest.apply(void 0, (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__read)(args))), (0,_util_mapOneOrManyArgs__WEBPACK_IMPORTED_MODULE_3__.mapOneOrManyArgs)(resultSelector))
        : (0,_util_lift__WEBPACK_IMPORTED_MODULE_4__.operate)(function (source, subscriber) {
            (0,_observable_combineLatest__WEBPACK_IMPORTED_MODULE_5__.combineLatestInit)((0,tslib__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([source], (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__read)((0,_util_argsOrArgArray__WEBPACK_IMPORTED_MODULE_6__.argsOrArgArray)(args))))(subscriber);
        });
}
//# sourceMappingURL=combineLatest.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/combineLatestWith.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/combineLatestWith.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "combineLatestWith": () => (/* binding */ combineLatestWith)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _combineLatest__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./combineLatest */ "./node_modules/rxjs/dist/esm5/internal/operators/combineLatest.js");


function combineLatestWith() {
    var otherSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        otherSources[_i] = arguments[_i];
    }
    return _combineLatest__WEBPACK_IMPORTED_MODULE_0__.combineLatest.apply(void 0, (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)([], (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__read)(otherSources)));
}
//# sourceMappingURL=combineLatestWith.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/expand.js":
/*!******************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/expand.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "expand": () => (/* binding */ expand)
/* harmony export */ });
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/lift */ "./node_modules/rxjs/dist/esm5/internal/util/lift.js");
/* harmony import */ var _mergeInternals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mergeInternals */ "./node_modules/rxjs/dist/esm5/internal/operators/mergeInternals.js");


function expand(project, concurrent, scheduler) {
    if (concurrent === void 0) { concurrent = Infinity; }
    concurrent = (concurrent || 0) < 1 ? Infinity : concurrent;
    return (0,_util_lift__WEBPACK_IMPORTED_MODULE_0__.operate)(function (source, subscriber) {
        return (0,_mergeInternals__WEBPACK_IMPORTED_MODULE_1__.mergeInternals)(source, subscriber, project, concurrent, undefined, true, scheduler);
    });
}
//# sourceMappingURL=expand.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/filter.js":
/*!******************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/filter.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "filter": () => (/* binding */ filter)
/* harmony export */ });
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/lift */ "./node_modules/rxjs/dist/esm5/internal/util/lift.js");
/* harmony import */ var _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OperatorSubscriber */ "./node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js");


function filter(predicate, thisArg) {
    return (0,_util_lift__WEBPACK_IMPORTED_MODULE_0__.operate)(function (source, subscriber) {
        var index = 0;
        source.subscribe(new _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__.OperatorSubscriber(subscriber, function (value) { return predicate.call(thisArg, value, index++) && subscriber.next(value); }));
    });
}
//# sourceMappingURL=filter.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/finalize.js":
/*!********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/finalize.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "finalize": () => (/* binding */ finalize)
/* harmony export */ });
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/lift */ "./node_modules/rxjs/dist/esm5/internal/util/lift.js");

function finalize(callback) {
    return (0,_util_lift__WEBPACK_IMPORTED_MODULE_0__.operate)(function (source, subscriber) {
        try {
            source.subscribe(subscriber);
        }
        finally {
            subscriber.add(callback);
        }
    });
}
//# sourceMappingURL=finalize.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/map.js":
/*!***************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/map.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "map": () => (/* binding */ map)
/* harmony export */ });
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/lift */ "./node_modules/rxjs/dist/esm5/internal/util/lift.js");
/* harmony import */ var _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OperatorSubscriber */ "./node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js");


function map(project, thisArg) {
    return (0,_util_lift__WEBPACK_IMPORTED_MODULE_0__.operate)(function (source, subscriber) {
        var index = 0;
        source.subscribe(new _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__.OperatorSubscriber(subscriber, function (value) {
            subscriber.next(project.call(thisArg, value, index++));
        }));
    });
}
//# sourceMappingURL=map.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/merge.js":
/*!*****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/merge.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "merge": () => (/* binding */ merge)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/lift */ "./node_modules/rxjs/dist/esm5/internal/util/lift.js");
/* harmony import */ var _util_argsOrArgArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/argsOrArgArray */ "./node_modules/rxjs/dist/esm5/internal/util/argsOrArgArray.js");
/* harmony import */ var _observable_fromArray__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../observable/fromArray */ "./node_modules/rxjs/dist/esm5/internal/observable/fromArray.js");
/* harmony import */ var _mergeAll__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mergeAll */ "./node_modules/rxjs/dist/esm5/internal/operators/mergeAll.js");
/* harmony import */ var _util_args__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/args */ "./node_modules/rxjs/dist/esm5/internal/util/args.js");






function merge() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var scheduler = (0,_util_args__WEBPACK_IMPORTED_MODULE_0__.popScheduler)(args);
    var concurrent = (0,_util_args__WEBPACK_IMPORTED_MODULE_0__.popNumber)(args, Infinity);
    args = (0,_util_argsOrArgArray__WEBPACK_IMPORTED_MODULE_1__.argsOrArgArray)(args);
    return (0,_util_lift__WEBPACK_IMPORTED_MODULE_2__.operate)(function (source, subscriber) {
        (0,_mergeAll__WEBPACK_IMPORTED_MODULE_3__.mergeAll)(concurrent)((0,_observable_fromArray__WEBPACK_IMPORTED_MODULE_4__.internalFromArray)((0,tslib__WEBPACK_IMPORTED_MODULE_5__.__spreadArray)([source], (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__read)(args)), scheduler)).subscribe(subscriber);
    });
}
//# sourceMappingURL=merge.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/mergeAll.js":
/*!********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/mergeAll.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mergeAll": () => (/* binding */ mergeAll)
/* harmony export */ });
/* harmony import */ var _mergeMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mergeMap */ "./node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js");
/* harmony import */ var _util_identity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/identity */ "./node_modules/rxjs/dist/esm5/internal/util/identity.js");


function mergeAll(concurrent) {
    if (concurrent === void 0) { concurrent = Infinity; }
    return (0,_mergeMap__WEBPACK_IMPORTED_MODULE_0__.mergeMap)(_util_identity__WEBPACK_IMPORTED_MODULE_1__.identity, concurrent);
}
//# sourceMappingURL=mergeAll.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/mergeInternals.js":
/*!**************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/mergeInternals.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mergeInternals": () => (/* binding */ mergeInternals)
/* harmony export */ });
/* harmony import */ var _observable_from__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../observable/from */ "./node_modules/rxjs/dist/esm5/internal/observable/from.js");
/* harmony import */ var _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OperatorSubscriber */ "./node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js");


function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalTeardown) {
    var buffer = [];
    var active = 0;
    var index = 0;
    var isComplete = false;
    var checkComplete = function () {
        if (isComplete && !buffer.length && !active) {
            subscriber.complete();
        }
    };
    var outerNext = function (value) { return (active < concurrent ? doInnerSub(value) : buffer.push(value)); };
    var doInnerSub = function (value) {
        expand && subscriber.next(value);
        active++;
        var innerComplete = false;
        (0,_observable_from__WEBPACK_IMPORTED_MODULE_0__.innerFrom)(project(value, index++)).subscribe(new _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__.OperatorSubscriber(subscriber, function (innerValue) {
            onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
            if (expand) {
                outerNext(innerValue);
            }
            else {
                subscriber.next(innerValue);
            }
        }, function () {
            innerComplete = true;
        }, undefined, function () {
            if (innerComplete) {
                try {
                    active--;
                    var _loop_1 = function () {
                        var bufferedValue = buffer.shift();
                        innerSubScheduler ? subscriber.add(innerSubScheduler.schedule(function () { return doInnerSub(bufferedValue); })) : doInnerSub(bufferedValue);
                    };
                    while (buffer.length && active < concurrent) {
                        _loop_1();
                    }
                    checkComplete();
                }
                catch (err) {
                    subscriber.error(err);
                }
            }
        }));
    };
    source.subscribe(new _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__.OperatorSubscriber(subscriber, outerNext, function () {
        isComplete = true;
        checkComplete();
    }));
    return function () {
        additionalTeardown === null || additionalTeardown === void 0 ? void 0 : additionalTeardown();
    };
}
//# sourceMappingURL=mergeInternals.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js":
/*!********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mergeMap": () => (/* binding */ mergeMap)
/* harmony export */ });
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./map */ "./node_modules/rxjs/dist/esm5/internal/operators/map.js");
/* harmony import */ var _observable_from__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../observable/from */ "./node_modules/rxjs/dist/esm5/internal/observable/from.js");
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/lift */ "./node_modules/rxjs/dist/esm5/internal/util/lift.js");
/* harmony import */ var _mergeInternals__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mergeInternals */ "./node_modules/rxjs/dist/esm5/internal/operators/mergeInternals.js");
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");





function mergeMap(project, resultSelector, concurrent) {
    if (concurrent === void 0) { concurrent = Infinity; }
    if ((0,_util_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(resultSelector)) {
        return mergeMap(function (a, i) { return (0,_map__WEBPACK_IMPORTED_MODULE_1__.map)(function (b, ii) { return resultSelector(a, b, i, ii); })((0,_observable_from__WEBPACK_IMPORTED_MODULE_2__.innerFrom)(project(a, i))); }, concurrent);
    }
    else if (typeof resultSelector === 'number') {
        concurrent = resultSelector;
    }
    return (0,_util_lift__WEBPACK_IMPORTED_MODULE_3__.operate)(function (source, subscriber) { return (0,_mergeInternals__WEBPACK_IMPORTED_MODULE_4__.mergeInternals)(source, subscriber, project, concurrent); });
}
//# sourceMappingURL=mergeMap.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/mergeWith.js":
/*!*********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/mergeWith.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mergeWith": () => (/* binding */ mergeWith)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _merge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./merge */ "./node_modules/rxjs/dist/esm5/internal/operators/merge.js");


function mergeWith() {
    var otherSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        otherSources[_i] = arguments[_i];
    }
    return _merge__WEBPACK_IMPORTED_MODULE_0__.merge.apply(void 0, (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)([], (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__read)(otherSources)));
}
//# sourceMappingURL=mergeWith.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/observeOn.js":
/*!*********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/observeOn.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "observeOn": () => (/* binding */ observeOn)
/* harmony export */ });
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/lift */ "./node_modules/rxjs/dist/esm5/internal/util/lift.js");
/* harmony import */ var _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OperatorSubscriber */ "./node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js");


function observeOn(scheduler, delay) {
    if (delay === void 0) { delay = 0; }
    return (0,_util_lift__WEBPACK_IMPORTED_MODULE_0__.operate)(function (source, subscriber) {
        source.subscribe(new _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__.OperatorSubscriber(subscriber, function (value) { return subscriber.add(scheduler.schedule(function () { return subscriber.next(value); }, delay)); }, function () { return subscriber.add(scheduler.schedule(function () { return subscriber.complete(); }, delay)); }, function (err) { return subscriber.add(scheduler.schedule(function () { return subscriber.error(err); }, delay)); }));
    });
}
//# sourceMappingURL=observeOn.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/pairwise.js":
/*!********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/pairwise.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pairwise": () => (/* binding */ pairwise)
/* harmony export */ });
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/lift */ "./node_modules/rxjs/dist/esm5/internal/util/lift.js");
/* harmony import */ var _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OperatorSubscriber */ "./node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js");


function pairwise() {
    return (0,_util_lift__WEBPACK_IMPORTED_MODULE_0__.operate)(function (source, subscriber) {
        var prev;
        var hasPrev = false;
        source.subscribe(new _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__.OperatorSubscriber(subscriber, function (value) {
            var p = prev;
            prev = value;
            hasPrev && subscriber.next([p, value]);
            hasPrev = true;
        }));
    });
}
//# sourceMappingURL=pairwise.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/share.js":
/*!*****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/share.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "share": () => (/* binding */ share)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _observable_from__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../observable/from */ "./node_modules/rxjs/dist/esm5/internal/observable/from.js");
/* harmony import */ var _operators_take__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../operators/take */ "./node_modules/rxjs/dist/esm5/internal/operators/take.js");
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Subject */ "./node_modules/rxjs/dist/esm5/internal/Subject.js");
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Subscriber */ "./node_modules/rxjs/dist/esm5/internal/Subscriber.js");
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/lift */ "./node_modules/rxjs/dist/esm5/internal/util/lift.js");






function share(options) {
    if (options === void 0) { options = {}; }
    var _a = options.connector, connector = _a === void 0 ? function () { return new _Subject__WEBPACK_IMPORTED_MODULE_0__.Subject(); } : _a, _b = options.resetOnError, resetOnError = _b === void 0 ? true : _b, _c = options.resetOnComplete, resetOnComplete = _c === void 0 ? true : _c, _d = options.resetOnRefCountZero, resetOnRefCountZero = _d === void 0 ? true : _d;
    return function (wrapperSource) {
        var connection = null;
        var resetConnection = null;
        var subject = null;
        var refCount = 0;
        var hasCompleted = false;
        var hasErrored = false;
        var cancelReset = function () {
            resetConnection === null || resetConnection === void 0 ? void 0 : resetConnection.unsubscribe();
            resetConnection = null;
        };
        var reset = function () {
            cancelReset();
            connection = subject = null;
            hasCompleted = hasErrored = false;
        };
        var resetAndUnsubscribe = function () {
            var conn = connection;
            reset();
            conn === null || conn === void 0 ? void 0 : conn.unsubscribe();
        };
        return (0,_util_lift__WEBPACK_IMPORTED_MODULE_1__.operate)(function (source, subscriber) {
            refCount++;
            if (!hasErrored && !hasCompleted) {
                cancelReset();
            }
            var dest = (subject = subject !== null && subject !== void 0 ? subject : connector());
            subscriber.add(function () {
                refCount--;
                if (refCount === 0 && !hasErrored && !hasCompleted) {
                    resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
                }
            });
            dest.subscribe(subscriber);
            if (!connection) {
                connection = new _Subscriber__WEBPACK_IMPORTED_MODULE_2__.SafeSubscriber({
                    next: function (value) { return dest.next(value); },
                    error: function (err) {
                        hasErrored = true;
                        cancelReset();
                        resetConnection = handleReset(reset, resetOnError, err);
                        dest.error(err);
                    },
                    complete: function () {
                        hasCompleted = true;
                        cancelReset();
                        resetConnection = handleReset(reset, resetOnComplete);
                        dest.complete();
                    },
                });
                (0,_observable_from__WEBPACK_IMPORTED_MODULE_3__.from)(source).subscribe(connection);
            }
        })(wrapperSource);
    };
}
function handleReset(reset, on) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (on === true) {
        reset();
        return null;
    }
    if (on === false) {
        return null;
    }
    return on.apply(void 0, (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__spreadArray)([], (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__read)(args))).pipe((0,_operators_take__WEBPACK_IMPORTED_MODULE_5__.take)(1))
        .subscribe(function () { return reset(); });
}
//# sourceMappingURL=share.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/switchMap.js":
/*!*********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/switchMap.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "switchMap": () => (/* binding */ switchMap)
/* harmony export */ });
/* harmony import */ var _observable_from__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../observable/from */ "./node_modules/rxjs/dist/esm5/internal/observable/from.js");
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/lift */ "./node_modules/rxjs/dist/esm5/internal/util/lift.js");
/* harmony import */ var _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OperatorSubscriber */ "./node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js");



function switchMap(project, resultSelector) {
    return (0,_util_lift__WEBPACK_IMPORTED_MODULE_0__.operate)(function (source, subscriber) {
        var innerSubscriber = null;
        var index = 0;
        var isComplete = false;
        var checkComplete = function () { return isComplete && !innerSubscriber && subscriber.complete(); };
        source.subscribe(new _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__.OperatorSubscriber(subscriber, function (value) {
            innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
            var innerIndex = 0;
            var outerIndex = index++;
            (0,_observable_from__WEBPACK_IMPORTED_MODULE_2__.innerFrom)(project(value, outerIndex)).subscribe((innerSubscriber = new _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__.OperatorSubscriber(subscriber, function (innerValue) { return subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue); }, function () {
                innerSubscriber = null;
                checkComplete();
            })));
        }, function () {
            isComplete = true;
            checkComplete();
        }));
    });
}
//# sourceMappingURL=switchMap.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/take.js":
/*!****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/take.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "take": () => (/* binding */ take)
/* harmony export */ });
/* harmony import */ var _observable_empty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../observable/empty */ "./node_modules/rxjs/dist/esm5/internal/observable/empty.js");
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/lift */ "./node_modules/rxjs/dist/esm5/internal/util/lift.js");
/* harmony import */ var _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./OperatorSubscriber */ "./node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js");



function take(count) {
    return count <= 0
        ?
            function () { return _observable_empty__WEBPACK_IMPORTED_MODULE_0__.EMPTY; }
        : (0,_util_lift__WEBPACK_IMPORTED_MODULE_1__.operate)(function (source, subscriber) {
            var seen = 0;
            source.subscribe(new _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_2__.OperatorSubscriber(subscriber, function (value) {
                if (++seen <= count) {
                    subscriber.next(value);
                    if (count <= seen) {
                        subscriber.complete();
                    }
                }
            }));
        });
}
//# sourceMappingURL=take.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/takeWhile.js":
/*!*********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/takeWhile.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "takeWhile": () => (/* binding */ takeWhile)
/* harmony export */ });
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/lift */ "./node_modules/rxjs/dist/esm5/internal/util/lift.js");
/* harmony import */ var _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OperatorSubscriber */ "./node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js");


function takeWhile(predicate, inclusive) {
    if (inclusive === void 0) { inclusive = false; }
    return (0,_util_lift__WEBPACK_IMPORTED_MODULE_0__.operate)(function (source, subscriber) {
        var index = 0;
        source.subscribe(new _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_1__.OperatorSubscriber(subscriber, function (value) {
            var result = predicate(value, index++);
            (result || inclusive) && subscriber.next(value);
            !result && subscriber.complete();
        }));
    });
}
//# sourceMappingURL=takeWhile.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/tap.js":
/*!***************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/tap.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tap": () => (/* binding */ tap)
/* harmony export */ });
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/lift */ "./node_modules/rxjs/dist/esm5/internal/util/lift.js");
/* harmony import */ var _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./OperatorSubscriber */ "./node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js");
/* harmony import */ var _util_identity__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/identity */ "./node_modules/rxjs/dist/esm5/internal/util/identity.js");




function tap(observerOrNext, error, complete) {
    var tapObserver = (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(observerOrNext) || error || complete ? { next: observerOrNext, error: error, complete: complete } : observerOrNext;
    return tapObserver
        ? (0,_util_lift__WEBPACK_IMPORTED_MODULE_1__.operate)(function (source, subscriber) {
            source.subscribe(new _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_2__.OperatorSubscriber(subscriber, function (value) {
                var _a;
                (_a = tapObserver.next) === null || _a === void 0 ? void 0 : _a.call(tapObserver, value);
                subscriber.next(value);
            }, function () {
                var _a;
                (_a = tapObserver.complete) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                subscriber.complete();
            }, function (err) {
                var _a;
                (_a = tapObserver.error) === null || _a === void 0 ? void 0 : _a.call(tapObserver, err);
                subscriber.error(err);
            }));
        })
        :
            _util_identity__WEBPACK_IMPORTED_MODULE_3__.identity;
}
//# sourceMappingURL=tap.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/operators/withLatestFrom.js":
/*!**************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/operators/withLatestFrom.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "withLatestFrom": () => (/* binding */ withLatestFrom)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/lift */ "./node_modules/rxjs/dist/esm5/internal/util/lift.js");
/* harmony import */ var _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./OperatorSubscriber */ "./node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js");
/* harmony import */ var _observable_from__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../observable/from */ "./node_modules/rxjs/dist/esm5/internal/observable/from.js");
/* harmony import */ var _util_identity__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/identity */ "./node_modules/rxjs/dist/esm5/internal/util/identity.js");
/* harmony import */ var _util_noop__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../util/noop */ "./node_modules/rxjs/dist/esm5/internal/util/noop.js");
/* harmony import */ var _util_args__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/args */ "./node_modules/rxjs/dist/esm5/internal/util/args.js");







function withLatestFrom() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    var project = (0,_util_args__WEBPACK_IMPORTED_MODULE_0__.popResultSelector)(inputs);
    return (0,_util_lift__WEBPACK_IMPORTED_MODULE_1__.operate)(function (source, subscriber) {
        var len = inputs.length;
        var otherValues = new Array(len);
        var hasValue = inputs.map(function () { return false; });
        var ready = false;
        var _loop_1 = function (i) {
            (0,_observable_from__WEBPACK_IMPORTED_MODULE_2__.innerFrom)(inputs[i]).subscribe(new _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_3__.OperatorSubscriber(subscriber, function (value) {
                otherValues[i] = value;
                if (!ready && !hasValue[i]) {
                    hasValue[i] = true;
                    (ready = hasValue.every(_util_identity__WEBPACK_IMPORTED_MODULE_4__.identity)) && (hasValue = null);
                }
            }, _util_noop__WEBPACK_IMPORTED_MODULE_5__.noop));
        };
        for (var i = 0; i < len; i++) {
            _loop_1(i);
        }
        source.subscribe(new _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_3__.OperatorSubscriber(subscriber, function (value) {
            if (ready) {
                var values = (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__spreadArray)([value], (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__read)(otherValues));
                subscriber.next(project ? project.apply(void 0, (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__spreadArray)([], (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__read)(values))) : values);
            }
        }));
    });
}
//# sourceMappingURL=withLatestFrom.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleArray.js":
/*!*************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleArray.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "scheduleArray": () => (/* binding */ scheduleArray)
/* harmony export */ });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "./node_modules/rxjs/dist/esm5/internal/Observable.js");

function scheduleArray(input, scheduler) {
    return new _Observable__WEBPACK_IMPORTED_MODULE_0__.Observable(function (subscriber) {
        var i = 0;
        return scheduler.schedule(function () {
            if (i === input.length) {
                subscriber.complete();
            }
            else {
                subscriber.next(input[i++]);
                if (!subscriber.closed) {
                    this.schedule();
                }
            }
        });
    });
}
//# sourceMappingURL=scheduleArray.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleAsyncIterable.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleAsyncIterable.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "scheduleAsyncIterable": () => (/* binding */ scheduleAsyncIterable)
/* harmony export */ });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "./node_modules/rxjs/dist/esm5/internal/Observable.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscription */ "./node_modules/rxjs/dist/esm5/internal/Subscription.js");


function scheduleAsyncIterable(input, scheduler) {
    if (!input) {
        throw new Error('Iterable cannot be null');
    }
    return new _Observable__WEBPACK_IMPORTED_MODULE_0__.Observable(function (subscriber) {
        var sub = new _Subscription__WEBPACK_IMPORTED_MODULE_1__.Subscription();
        sub.add(scheduler.schedule(function () {
            var iterator = input[Symbol.asyncIterator]();
            sub.add(scheduler.schedule(function () {
                var _this = this;
                iterator.next().then(function (result) {
                    if (result.done) {
                        subscriber.complete();
                    }
                    else {
                        subscriber.next(result.value);
                        _this.schedule();
                    }
                });
            }));
        }));
        return sub;
    });
}
//# sourceMappingURL=scheduleAsyncIterable.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleIterable.js":
/*!****************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleIterable.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "scheduleIterable": () => (/* binding */ scheduleIterable)
/* harmony export */ });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "./node_modules/rxjs/dist/esm5/internal/Observable.js");
/* harmony import */ var _symbol_iterator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../symbol/iterator */ "./node_modules/rxjs/dist/esm5/internal/symbol/iterator.js");
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");
/* harmony import */ var _util_caughtSchedule__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/caughtSchedule */ "./node_modules/rxjs/dist/esm5/internal/util/caughtSchedule.js");




function scheduleIterable(input, scheduler) {
    return new _Observable__WEBPACK_IMPORTED_MODULE_0__.Observable(function (subscriber) {
        var iterator;
        subscriber.add(scheduler.schedule(function () {
            iterator = input[_symbol_iterator__WEBPACK_IMPORTED_MODULE_1__.iterator]();
            (0,_util_caughtSchedule__WEBPACK_IMPORTED_MODULE_2__.caughtSchedule)(subscriber, scheduler, function () {
                var _a = iterator.next(), value = _a.value, done = _a.done;
                if (done) {
                    subscriber.complete();
                }
                else {
                    subscriber.next(value);
                    this.schedule();
                }
            });
        }));
        return function () { return (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_3__.isFunction)(iterator === null || iterator === void 0 ? void 0 : iterator.return) && iterator.return(); };
    });
}
//# sourceMappingURL=scheduleIterable.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleObservable.js":
/*!******************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleObservable.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "scheduleObservable": () => (/* binding */ scheduleObservable)
/* harmony export */ });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "./node_modules/rxjs/dist/esm5/internal/Observable.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscription */ "./node_modules/rxjs/dist/esm5/internal/Subscription.js");
/* harmony import */ var _symbol_observable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../symbol/observable */ "./node_modules/rxjs/dist/esm5/internal/symbol/observable.js");



function scheduleObservable(input, scheduler) {
    return new _Observable__WEBPACK_IMPORTED_MODULE_0__.Observable(function (subscriber) {
        var sub = new _Subscription__WEBPACK_IMPORTED_MODULE_1__.Subscription();
        sub.add(scheduler.schedule(function () {
            var observable = input[_symbol_observable__WEBPACK_IMPORTED_MODULE_2__.observable]();
            sub.add(observable.subscribe({
                next: function (value) { sub.add(scheduler.schedule(function () { return subscriber.next(value); })); },
                error: function (err) { sub.add(scheduler.schedule(function () { return subscriber.error(err); })); },
                complete: function () { sub.add(scheduler.schedule(function () { return subscriber.complete(); })); },
            }));
        }));
        return sub;
    });
}
//# sourceMappingURL=scheduleObservable.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduled/schedulePromise.js":
/*!***************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduled/schedulePromise.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "schedulePromise": () => (/* binding */ schedulePromise)
/* harmony export */ });
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Observable */ "./node_modules/rxjs/dist/esm5/internal/Observable.js");

function schedulePromise(input, scheduler) {
    return new _Observable__WEBPACK_IMPORTED_MODULE_0__.Observable(function (subscriber) {
        return scheduler.schedule(function () {
            return input.then(function (value) {
                subscriber.add(scheduler.schedule(function () {
                    subscriber.next(value);
                    subscriber.add(scheduler.schedule(function () { return subscriber.complete(); }));
                }));
            }, function (err) {
                subscriber.add(scheduler.schedule(function () { return subscriber.error(err); }));
            });
        });
    });
}
//# sourceMappingURL=schedulePromise.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleReadableStreamLike.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleReadableStreamLike.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "scheduleReadableStreamLike": () => (/* binding */ scheduleReadableStreamLike)
/* harmony export */ });
/* harmony import */ var _scheduleAsyncIterable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scheduleAsyncIterable */ "./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleAsyncIterable.js");
/* harmony import */ var _util_isReadableStreamLike__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/isReadableStreamLike */ "./node_modules/rxjs/dist/esm5/internal/util/isReadableStreamLike.js");


function scheduleReadableStreamLike(input, scheduler) {
    return (0,_scheduleAsyncIterable__WEBPACK_IMPORTED_MODULE_0__.scheduleAsyncIterable)((0,_util_isReadableStreamLike__WEBPACK_IMPORTED_MODULE_1__.readableStreamLikeToAsyncGenerator)(input), scheduler);
}
//# sourceMappingURL=scheduleReadableStreamLike.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduled/scheduled.js":
/*!*********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduled/scheduled.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "scheduled": () => (/* binding */ scheduled)
/* harmony export */ });
/* harmony import */ var _scheduleObservable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scheduleObservable */ "./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleObservable.js");
/* harmony import */ var _schedulePromise__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./schedulePromise */ "./node_modules/rxjs/dist/esm5/internal/scheduled/schedulePromise.js");
/* harmony import */ var _scheduleArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scheduleArray */ "./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleArray.js");
/* harmony import */ var _scheduleIterable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./scheduleIterable */ "./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleIterable.js");
/* harmony import */ var _scheduleAsyncIterable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./scheduleAsyncIterable */ "./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleAsyncIterable.js");
/* harmony import */ var _util_isInteropObservable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/isInteropObservable */ "./node_modules/rxjs/dist/esm5/internal/util/isInteropObservable.js");
/* harmony import */ var _util_isPromise__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/isPromise */ "./node_modules/rxjs/dist/esm5/internal/util/isPromise.js");
/* harmony import */ var _util_isArrayLike__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/isArrayLike */ "./node_modules/rxjs/dist/esm5/internal/util/isArrayLike.js");
/* harmony import */ var _util_isIterable__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../util/isIterable */ "./node_modules/rxjs/dist/esm5/internal/util/isIterable.js");
/* harmony import */ var _util_isAsyncIterable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../util/isAsyncIterable */ "./node_modules/rxjs/dist/esm5/internal/util/isAsyncIterable.js");
/* harmony import */ var _util_throwUnobservableError__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../util/throwUnobservableError */ "./node_modules/rxjs/dist/esm5/internal/util/throwUnobservableError.js");
/* harmony import */ var _util_isReadableStreamLike__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../util/isReadableStreamLike */ "./node_modules/rxjs/dist/esm5/internal/util/isReadableStreamLike.js");
/* harmony import */ var _scheduleReadableStreamLike__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./scheduleReadableStreamLike */ "./node_modules/rxjs/dist/esm5/internal/scheduled/scheduleReadableStreamLike.js");













function scheduled(input, scheduler) {
    if (input != null) {
        if ((0,_util_isInteropObservable__WEBPACK_IMPORTED_MODULE_0__.isInteropObservable)(input)) {
            return (0,_scheduleObservable__WEBPACK_IMPORTED_MODULE_1__.scheduleObservable)(input, scheduler);
        }
        if ((0,_util_isArrayLike__WEBPACK_IMPORTED_MODULE_2__.isArrayLike)(input)) {
            return (0,_scheduleArray__WEBPACK_IMPORTED_MODULE_3__.scheduleArray)(input, scheduler);
        }
        if ((0,_util_isPromise__WEBPACK_IMPORTED_MODULE_4__.isPromise)(input)) {
            return (0,_schedulePromise__WEBPACK_IMPORTED_MODULE_5__.schedulePromise)(input, scheduler);
        }
        if ((0,_util_isAsyncIterable__WEBPACK_IMPORTED_MODULE_6__.isAsyncIterable)(input)) {
            return (0,_scheduleAsyncIterable__WEBPACK_IMPORTED_MODULE_7__.scheduleAsyncIterable)(input, scheduler);
        }
        if ((0,_util_isIterable__WEBPACK_IMPORTED_MODULE_8__.isIterable)(input)) {
            return (0,_scheduleIterable__WEBPACK_IMPORTED_MODULE_9__.scheduleIterable)(input, scheduler);
        }
        if ((0,_util_isReadableStreamLike__WEBPACK_IMPORTED_MODULE_10__.isReadableStreamLike)(input)) {
            return (0,_scheduleReadableStreamLike__WEBPACK_IMPORTED_MODULE_11__.scheduleReadableStreamLike)(input, scheduler);
        }
    }
    throw (0,_util_throwUnobservableError__WEBPACK_IMPORTED_MODULE_12__.createInvalidObservableTypeError)(input);
}
//# sourceMappingURL=scheduled.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduler/Action.js":
/*!******************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduler/Action.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Action": () => (/* binding */ Action)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Subscription */ "./node_modules/rxjs/dist/esm5/internal/Subscription.js");


var Action = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(Action, _super);
    function Action(scheduler, work) {
        return _super.call(this) || this;
    }
    Action.prototype.schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        return this;
    };
    return Action;
}(_Subscription__WEBPACK_IMPORTED_MODULE_1__.Subscription));

//# sourceMappingURL=Action.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduler/AnimationFrameAction.js":
/*!********************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduler/AnimationFrameAction.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnimationFrameAction": () => (/* binding */ AnimationFrameAction)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _AsyncAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AsyncAction */ "./node_modules/rxjs/dist/esm5/internal/scheduler/AsyncAction.js");
/* harmony import */ var _animationFrameProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./animationFrameProvider */ "./node_modules/rxjs/dist/esm5/internal/scheduler/animationFrameProvider.js");



var AnimationFrameAction = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(AnimationFrameAction, _super);
    function AnimationFrameAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        return _this;
    }
    AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        if (delay !== null && delay > 0) {
            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        }
        scheduler.actions.push(this);
        return scheduler._scheduled || (scheduler._scheduled = _animationFrameProvider__WEBPACK_IMPORTED_MODULE_1__.animationFrameProvider.requestAnimationFrame(function () { return scheduler.flush(undefined); }));
    };
    AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        if ((delay != null && delay > 0) || (delay == null && this.delay > 0)) {
            return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
        }
        if (scheduler.actions.length === 0) {
            _animationFrameProvider__WEBPACK_IMPORTED_MODULE_1__.animationFrameProvider.cancelAnimationFrame(id);
            scheduler._scheduled = undefined;
        }
        return undefined;
    };
    return AnimationFrameAction;
}(_AsyncAction__WEBPACK_IMPORTED_MODULE_2__.AsyncAction));

//# sourceMappingURL=AnimationFrameAction.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduler/AnimationFrameScheduler.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduler/AnimationFrameScheduler.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnimationFrameScheduler": () => (/* binding */ AnimationFrameScheduler)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _AsyncScheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AsyncScheduler */ "./node_modules/rxjs/dist/esm5/internal/scheduler/AsyncScheduler.js");


var AnimationFrameScheduler = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(AnimationFrameScheduler, _super);
    function AnimationFrameScheduler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimationFrameScheduler.prototype.flush = function (action) {
        this._active = true;
        this._scheduled = undefined;
        var actions = this.actions;
        var error;
        var index = -1;
        action = action || actions.shift();
        var count = actions.length;
        do {
            if ((error = action.execute(action.state, action.delay))) {
                break;
            }
        } while (++index < count && (action = actions.shift()));
        this._active = false;
        if (error) {
            while (++index < count && (action = actions.shift())) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AnimationFrameScheduler;
}(_AsyncScheduler__WEBPACK_IMPORTED_MODULE_1__.AsyncScheduler));

//# sourceMappingURL=AnimationFrameScheduler.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduler/AsyncAction.js":
/*!***********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduler/AsyncAction.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AsyncAction": () => (/* binding */ AsyncAction)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Action__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Action */ "./node_modules/rxjs/dist/esm5/internal/scheduler/Action.js");
/* harmony import */ var _intervalProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./intervalProvider */ "./node_modules/rxjs/dist/esm5/internal/scheduler/intervalProvider.js");
/* harmony import */ var _util_arrRemove__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/arrRemove */ "./node_modules/rxjs/dist/esm5/internal/util/arrRemove.js");




var AsyncAction = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(AsyncAction, _super);
    function AsyncAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        _this.pending = false;
        return _this;
    }
    AsyncAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        if (this.closed) {
            return this;
        }
        this.state = state;
        var id = this.id;
        var scheduler = this.scheduler;
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, delay);
        }
        this.pending = true;
        this.delay = delay;
        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
        return this;
    };
    AsyncAction.prototype.requestAsyncId = function (scheduler, _id, delay) {
        if (delay === void 0) { delay = 0; }
        return _intervalProvider__WEBPACK_IMPORTED_MODULE_1__.intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay);
    };
    AsyncAction.prototype.recycleAsyncId = function (_scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        if (delay != null && this.delay === delay && this.pending === false) {
            return id;
        }
        _intervalProvider__WEBPACK_IMPORTED_MODULE_1__.intervalProvider.clearInterval(id);
        return undefined;
    };
    AsyncAction.prototype.execute = function (state, delay) {
        if (this.closed) {
            return new Error('executing a cancelled action');
        }
        this.pending = false;
        var error = this._execute(state, delay);
        if (error) {
            return error;
        }
        else if (this.pending === false && this.id != null) {
            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
        }
    };
    AsyncAction.prototype._execute = function (state, _delay) {
        var errored = false;
        var errorValue;
        try {
            this.work(state);
        }
        catch (e) {
            errored = true;
            errorValue = (!!e && e) || new Error(e);
        }
        if (errored) {
            this.unsubscribe();
            return errorValue;
        }
    };
    AsyncAction.prototype.unsubscribe = function () {
        if (!this.closed) {
            var _a = this, id = _a.id, scheduler = _a.scheduler;
            var actions = scheduler.actions;
            this.work = this.state = this.scheduler = null;
            this.pending = false;
            (0,_util_arrRemove__WEBPACK_IMPORTED_MODULE_2__.arrRemove)(actions, this);
            if (id != null) {
                this.id = this.recycleAsyncId(scheduler, id, null);
            }
            this.delay = null;
            _super.prototype.unsubscribe.call(this);
        }
    };
    return AsyncAction;
}(_Action__WEBPACK_IMPORTED_MODULE_3__.Action));

//# sourceMappingURL=AsyncAction.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduler/AsyncScheduler.js":
/*!**************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduler/AsyncScheduler.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AsyncScheduler": () => (/* binding */ AsyncScheduler)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Scheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Scheduler */ "./node_modules/rxjs/dist/esm5/internal/Scheduler.js");


var AsyncScheduler = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(AsyncScheduler, _super);
    function AsyncScheduler(SchedulerAction, now) {
        if (now === void 0) { now = _Scheduler__WEBPACK_IMPORTED_MODULE_1__.Scheduler.now; }
        var _this = _super.call(this, SchedulerAction, now) || this;
        _this.actions = [];
        _this._active = false;
        _this._scheduled = undefined;
        return _this;
    }
    AsyncScheduler.prototype.flush = function (action) {
        var actions = this.actions;
        if (this._active) {
            actions.push(action);
            return;
        }
        var error;
        this._active = true;
        do {
            if ((error = action.execute(action.state, action.delay))) {
                break;
            }
        } while ((action = actions.shift()));
        this._active = false;
        if (error) {
            while ((action = actions.shift())) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AsyncScheduler;
}(_Scheduler__WEBPACK_IMPORTED_MODULE_1__.Scheduler));

//# sourceMappingURL=AsyncScheduler.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduler/animationFrame.js":
/*!**************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduler/animationFrame.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "animationFrameScheduler": () => (/* binding */ animationFrameScheduler),
/* harmony export */   "animationFrame": () => (/* binding */ animationFrame)
/* harmony export */ });
/* harmony import */ var _AnimationFrameAction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AnimationFrameAction */ "./node_modules/rxjs/dist/esm5/internal/scheduler/AnimationFrameAction.js");
/* harmony import */ var _AnimationFrameScheduler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AnimationFrameScheduler */ "./node_modules/rxjs/dist/esm5/internal/scheduler/AnimationFrameScheduler.js");


var animationFrameScheduler = new _AnimationFrameScheduler__WEBPACK_IMPORTED_MODULE_0__.AnimationFrameScheduler(_AnimationFrameAction__WEBPACK_IMPORTED_MODULE_1__.AnimationFrameAction);
var animationFrame = animationFrameScheduler;
//# sourceMappingURL=animationFrame.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduler/animationFrameProvider.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduler/animationFrameProvider.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "animationFrameProvider": () => (/* binding */ animationFrameProvider)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Subscription */ "./node_modules/rxjs/dist/esm5/internal/Subscription.js");


var animationFrameProvider = {
    schedule: function (callback) {
        var request = requestAnimationFrame;
        var cancel = cancelAnimationFrame;
        var delegate = animationFrameProvider.delegate;
        if (delegate) {
            request = delegate.requestAnimationFrame;
            cancel = delegate.cancelAnimationFrame;
        }
        var handle = request(function (timestamp) {
            cancel = undefined;
            callback(timestamp);
        });
        return new _Subscription__WEBPACK_IMPORTED_MODULE_0__.Subscription(function () { return cancel === null || cancel === void 0 ? void 0 : cancel(handle); });
    },
    requestAnimationFrame: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var delegate = animationFrameProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.requestAnimationFrame) || requestAnimationFrame).apply(void 0, (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)([], (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__read)(args)));
    },
    cancelAnimationFrame: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var delegate = animationFrameProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.cancelAnimationFrame) || cancelAnimationFrame).apply(void 0, (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)([], (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__read)(args)));
    },
    delegate: undefined,
};
//# sourceMappingURL=animationFrameProvider.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduler/async.js":
/*!*****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduler/async.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "asyncScheduler": () => (/* binding */ asyncScheduler),
/* harmony export */   "async": () => (/* binding */ async)
/* harmony export */ });
/* harmony import */ var _AsyncAction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AsyncAction */ "./node_modules/rxjs/dist/esm5/internal/scheduler/AsyncAction.js");
/* harmony import */ var _AsyncScheduler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AsyncScheduler */ "./node_modules/rxjs/dist/esm5/internal/scheduler/AsyncScheduler.js");


var asyncScheduler = new _AsyncScheduler__WEBPACK_IMPORTED_MODULE_0__.AsyncScheduler(_AsyncAction__WEBPACK_IMPORTED_MODULE_1__.AsyncAction);
var async = asyncScheduler;
//# sourceMappingURL=async.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduler/dateTimestampProvider.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduler/dateTimestampProvider.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dateTimestampProvider": () => (/* binding */ dateTimestampProvider)
/* harmony export */ });
var dateTimestampProvider = {
    now: function () {
        return (dateTimestampProvider.delegate || Date).now();
    },
    delegate: undefined,
};
//# sourceMappingURL=dateTimestampProvider.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduler/intervalProvider.js":
/*!****************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduler/intervalProvider.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "intervalProvider": () => (/* binding */ intervalProvider)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var intervalProvider = {
    setInterval: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var delegate = intervalProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.setInterval) || setInterval).apply(void 0, (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__read)(args)));
    },
    clearInterval: function (handle) {
        var delegate = intervalProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle);
    },
    delegate: undefined,
};
//# sourceMappingURL=intervalProvider.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js":
/*!***************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "timeoutProvider": () => (/* binding */ timeoutProvider)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var timeoutProvider = {
    setTimeout: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var delegate = timeoutProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) || setTimeout).apply(void 0, (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__read)(args)));
    },
    clearTimeout: function (handle) {
        var delegate = timeoutProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
    },
    delegate: undefined,
};
//# sourceMappingURL=timeoutProvider.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/symbol/iterator.js":
/*!*****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/symbol/iterator.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getSymbolIterator": () => (/* binding */ getSymbolIterator),
/* harmony export */   "iterator": () => (/* binding */ iterator)
/* harmony export */ });
function getSymbolIterator() {
    if (typeof Symbol !== 'function' || !Symbol.iterator) {
        return '@@iterator';
    }
    return Symbol.iterator;
}
var iterator = getSymbolIterator();
//# sourceMappingURL=iterator.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/symbol/observable.js":
/*!*******************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/symbol/observable.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "observable": () => (/* binding */ observable)
/* harmony export */ });
var observable = (function () { return (typeof Symbol === 'function' && Symbol.observable) || '@@observable'; })();
//# sourceMappingURL=observable.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/ObjectUnsubscribedError.js":
/*!******************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/ObjectUnsubscribedError.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ObjectUnsubscribedError": () => (/* binding */ ObjectUnsubscribedError)
/* harmony export */ });
/* harmony import */ var _createErrorClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createErrorClass */ "./node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js");

var ObjectUnsubscribedError = (0,_createErrorClass__WEBPACK_IMPORTED_MODULE_0__.createErrorClass)(function (_super) {
    return function ObjectUnsubscribedErrorImpl() {
        _super(this);
        this.name = 'ObjectUnsubscribedError';
        this.message = 'object unsubscribed';
    };
});
//# sourceMappingURL=ObjectUnsubscribedError.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js":
/*!**************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UnsubscriptionError": () => (/* binding */ UnsubscriptionError)
/* harmony export */ });
/* harmony import */ var _createErrorClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createErrorClass */ "./node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js");

var UnsubscriptionError = (0,_createErrorClass__WEBPACK_IMPORTED_MODULE_0__.createErrorClass)(function (_super) {
    return function UnsubscriptionErrorImpl(errors) {
        _super(this);
        this.message = errors
            ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ')
            : '';
        this.name = 'UnsubscriptionError';
        this.errors = errors;
    };
});
//# sourceMappingURL=UnsubscriptionError.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/args.js":
/*!***********************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/args.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "popResultSelector": () => (/* binding */ popResultSelector),
/* harmony export */   "popScheduler": () => (/* binding */ popScheduler),
/* harmony export */   "popNumber": () => (/* binding */ popNumber)
/* harmony export */ });
/* harmony import */ var _isFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");
/* harmony import */ var _isScheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isScheduler */ "./node_modules/rxjs/dist/esm5/internal/util/isScheduler.js");


function last(arr) {
    return arr[arr.length - 1];
}
function popResultSelector(args) {
    return (0,_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(last(args)) ? args.pop() : undefined;
}
function popScheduler(args) {
    return (0,_isScheduler__WEBPACK_IMPORTED_MODULE_1__.isScheduler)(last(args)) ? args.pop() : undefined;
}
function popNumber(args, defaultValue) {
    return typeof last(args) === 'number' ? args.pop() : defaultValue;
}
//# sourceMappingURL=args.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/argsArgArrayOrObject.js":
/*!***************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/argsArgArrayOrObject.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "argsArgArrayOrObject": () => (/* binding */ argsArgArrayOrObject)
/* harmony export */ });
var isArray = Array.isArray;
var getPrototypeOf = Object.getPrototypeOf, objectProto = Object.prototype, getKeys = Object.keys;
function argsArgArrayOrObject(args) {
    if (args.length === 1) {
        var first_1 = args[0];
        if (isArray(first_1)) {
            return { args: first_1, keys: null };
        }
        if (isPOJO(first_1)) {
            var keys = getKeys(first_1);
            return {
                args: keys.map(function (key) { return first_1[key]; }),
                keys: keys,
            };
        }
    }
    return { args: args, keys: null };
}
function isPOJO(obj) {
    return obj && typeof obj === 'object' && getPrototypeOf(obj) === objectProto;
}
//# sourceMappingURL=argsArgArrayOrObject.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/argsOrArgArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/argsOrArgArray.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "argsOrArgArray": () => (/* binding */ argsOrArgArray)
/* harmony export */ });
var isArray = Array.isArray;
function argsOrArgArray(args) {
    return args.length === 1 && isArray(args[0]) ? args[0] : args;
}
//# sourceMappingURL=argsOrArgArray.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/arrRemove.js":
/*!****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/arrRemove.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "arrRemove": () => (/* binding */ arrRemove)
/* harmony export */ });
function arrRemove(arr, item) {
    if (arr) {
        var index = arr.indexOf(item);
        0 <= index && arr.splice(index, 1);
    }
}
//# sourceMappingURL=arrRemove.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/caughtSchedule.js":
/*!*********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/caughtSchedule.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "caughtSchedule": () => (/* binding */ caughtSchedule)
/* harmony export */ });
function caughtSchedule(subscriber, scheduler, execute, delay) {
    if (delay === void 0) { delay = 0; }
    var subscription = scheduler.schedule(function () {
        try {
            execute.call(this);
        }
        catch (err) {
            subscriber.error(err);
        }
    }, delay);
    subscriber.add(subscription);
    return subscription;
}
//# sourceMappingURL=caughtSchedule.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js":
/*!***********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createErrorClass": () => (/* binding */ createErrorClass)
/* harmony export */ });
function createErrorClass(createImpl) {
    var _super = function (instance) {
        Error.call(instance);
        instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
}
//# sourceMappingURL=createErrorClass.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/createObject.js":
/*!*******************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/createObject.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createObject": () => (/* binding */ createObject)
/* harmony export */ });
function createObject(keys, values) {
    return keys.reduce(function (result, key, i) { return ((result[key] = values[i]), result); }, {});
}
//# sourceMappingURL=createObject.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/identity.js":
/*!***************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/identity.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "identity": () => (/* binding */ identity)
/* harmony export */ });
function identity(x) {
    return x;
}
//# sourceMappingURL=identity.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/isArrayLike.js":
/*!******************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/isArrayLike.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isArrayLike": () => (/* binding */ isArrayLike)
/* harmony export */ });
var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });
//# sourceMappingURL=isArrayLike.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/isAsyncIterable.js":
/*!**********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/isAsyncIterable.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isAsyncIterable": () => (/* binding */ isAsyncIterable)
/* harmony export */ });
/* harmony import */ var _isFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");

function isAsyncIterable(obj) {
    return Symbol.asyncIterator && (0,_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
}
//# sourceMappingURL=isAsyncIterable.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/isDate.js":
/*!*************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/isDate.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isValidDate": () => (/* binding */ isValidDate)
/* harmony export */ });
function isValidDate(value) {
    return value instanceof Date && !isNaN(value);
}
//# sourceMappingURL=isDate.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js":
/*!*****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/isFunction.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isFunction": () => (/* binding */ isFunction)
/* harmony export */ });
function isFunction(value) {
    return typeof value === 'function';
}
//# sourceMappingURL=isFunction.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/isInteropObservable.js":
/*!**************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/isInteropObservable.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isInteropObservable": () => (/* binding */ isInteropObservable)
/* harmony export */ });
/* harmony import */ var _symbol_observable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../symbol/observable */ "./node_modules/rxjs/dist/esm5/internal/symbol/observable.js");
/* harmony import */ var _isFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");


function isInteropObservable(input) {
    return (0,_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(input[_symbol_observable__WEBPACK_IMPORTED_MODULE_1__.observable]);
}
//# sourceMappingURL=isInteropObservable.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/isIterable.js":
/*!*****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/isIterable.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isIterable": () => (/* binding */ isIterable)
/* harmony export */ });
/* harmony import */ var _symbol_iterator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../symbol/iterator */ "./node_modules/rxjs/dist/esm5/internal/symbol/iterator.js");
/* harmony import */ var _isFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");


function isIterable(input) {
    return (0,_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(input === null || input === void 0 ? void 0 : input[_symbol_iterator__WEBPACK_IMPORTED_MODULE_1__.iterator]);
}
//# sourceMappingURL=isIterable.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/isPromise.js":
/*!****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/isPromise.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isPromise": () => (/* binding */ isPromise)
/* harmony export */ });
/* harmony import */ var _isFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");

function isPromise(value) {
    return (0,_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(value === null || value === void 0 ? void 0 : value.then);
}
//# sourceMappingURL=isPromise.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/isReadableStreamLike.js":
/*!***************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/isReadableStreamLike.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "readableStreamLikeToAsyncGenerator": () => (/* binding */ readableStreamLikeToAsyncGenerator),
/* harmony export */   "isReadableStreamLike": () => (/* binding */ isReadableStreamLike)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _isFunction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");


function readableStreamLikeToAsyncGenerator(readableStream) {
    return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__asyncGenerator)(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
        var reader, _a, value, done;
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_b) {
            switch (_b.label) {
                case 0:
                    reader = readableStream.getReader();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 9, 10]);
                    _b.label = 2;
                case 2:
                    if (false) {}
                    return [4, (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__await)(reader.read())];
                case 3:
                    _a = _b.sent(), value = _a.value, done = _a.done;
                    if (!done) return [3, 5];
                    return [4, (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__await)(void 0)];
                case 4: return [2, _b.sent()];
                case 5: return [4, (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__await)(value)];
                case 6: return [4, _b.sent()];
                case 7:
                    _b.sent();
                    return [3, 2];
                case 8: return [3, 10];
                case 9:
                    reader.releaseLock();
                    return [7];
                case 10: return [2];
            }
        });
    });
}
function isReadableStreamLike(obj) {
    return (0,_isFunction__WEBPACK_IMPORTED_MODULE_1__.isFunction)(obj === null || obj === void 0 ? void 0 : obj.getReader);
}
//# sourceMappingURL=isReadableStreamLike.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/isScheduler.js":
/*!******************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/isScheduler.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isScheduler": () => (/* binding */ isScheduler)
/* harmony export */ });
/* harmony import */ var _isFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");

function isScheduler(value) {
    return value && (0,_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(value.schedule);
}
//# sourceMappingURL=isScheduler.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/lift.js":
/*!***********************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/lift.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hasLift": () => (/* binding */ hasLift),
/* harmony export */   "operate": () => (/* binding */ operate)
/* harmony export */ });
/* harmony import */ var _isFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");

function hasLift(source) {
    return (0,_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(source === null || source === void 0 ? void 0 : source.lift);
}
function operate(init) {
    return function (source) {
        if (hasLift(source)) {
            return source.lift(function (liftedSource) {
                try {
                    return init(liftedSource, this);
                }
                catch (err) {
                    this.error(err);
                }
            });
        }
        throw new TypeError('Unable to lift unknown Observable type');
    };
}
//# sourceMappingURL=lift.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/mapOneOrManyArgs.js":
/*!***********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/mapOneOrManyArgs.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mapOneOrManyArgs": () => (/* binding */ mapOneOrManyArgs)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _operators_map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../operators/map */ "./node_modules/rxjs/dist/esm5/internal/operators/map.js");


var isArray = Array.isArray;
function callOrApply(fn, args) {
    return isArray(args) ? fn.apply(void 0, (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__read)(args))) : fn(args);
}
function mapOneOrManyArgs(fn) {
    return (0,_operators_map__WEBPACK_IMPORTED_MODULE_1__.map)(function (args) { return callOrApply(fn, args); });
}
//# sourceMappingURL=mapOneOrManyArgs.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/noop.js":
/*!***********************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/noop.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "noop": () => (/* binding */ noop)
/* harmony export */ });
function noop() { }
//# sourceMappingURL=noop.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/pipe.js":
/*!***********************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/pipe.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pipe": () => (/* binding */ pipe),
/* harmony export */   "pipeFromArray": () => (/* binding */ pipeFromArray)
/* harmony export */ });
/* harmony import */ var _identity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./identity */ "./node_modules/rxjs/dist/esm5/internal/util/identity.js");

function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return pipeFromArray(fns);
}
function pipeFromArray(fns) {
    if (fns.length === 0) {
        return _identity__WEBPACK_IMPORTED_MODULE_0__.identity;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}
//# sourceMappingURL=pipe.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js":
/*!***************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "reportUnhandledError": () => (/* binding */ reportUnhandledError)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config */ "./node_modules/rxjs/dist/esm5/internal/config.js");
/* harmony import */ var _scheduler_timeoutProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scheduler/timeoutProvider */ "./node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js");


function reportUnhandledError(err) {
    _scheduler_timeoutProvider__WEBPACK_IMPORTED_MODULE_0__.timeoutProvider.setTimeout(function () {
        var onUnhandledError = _config__WEBPACK_IMPORTED_MODULE_1__.config.onUnhandledError;
        if (onUnhandledError) {
            onUnhandledError(err);
        }
        else {
            throw err;
        }
    });
}
//# sourceMappingURL=reportUnhandledError.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/throwUnobservableError.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/throwUnobservableError.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createInvalidObservableTypeError": () => (/* binding */ createInvalidObservableTypeError)
/* harmony export */ });
function createInvalidObservableTypeError(input) {
    return new TypeError("You provided " + (input !== null && typeof input === 'object' ? 'an invalid object' : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
//# sourceMappingURL=throwUnobservableError.js.map

/***/ }),

/***/ "./src/entities/Enemy.ts":
/*!*******************************!*\
  !*** ./src/entities/Enemy.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Enemy)
/* harmony export */ });
/* harmony import */ var twojs_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! twojs-ts */ "./node_modules/twojs-ts/two.js");
/* harmony import */ var twojs_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(twojs_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./src/util.ts");


class Enemy {
    constructor(two, goal, layer) {
        this.pawnRadius = 20;
        this.maxOutOfBoundsSpawnOffset = 100;
        this.two = two;
        this.createPawn();
        layer.add(this.pawn);
        this.setMovementDirection(goal);
        this.spawnTime = new Date().getTime();
    }
    createPawn() {
        const startingPosition = this.getOutOfBoundsPosition();
        const pawn = this.two.makeCircle(startingPosition.x, startingPosition.y, this.pawnRadius);
        pawn.fill = '#34b4eb';
        pawn.linewidth = 0;
        this.pawn = pawn;
    }
    getOutOfBoundsPosition() {
        // const x = getRandomIntInRange(0, this.two.width)
        // const y = getRandomIntInRange(0, this.two.height)
        // return new Two.Vector(x, y)
        if (Math.random() < this.two.width / (this.two.width + this.two.height)) {
            // Enemy spawns top or bottom of the screen
            const x = (0,_util__WEBPACK_IMPORTED_MODULE_1__.getRandomIntInRange)(0, this.two.width);
            const y = Math.random() > 0.5
                ? (0,_util__WEBPACK_IMPORTED_MODULE_1__.getRandomIntInRange)(-this.maxOutOfBoundsSpawnOffset, 0)
                : (0,_util__WEBPACK_IMPORTED_MODULE_1__.getRandomIntInRange)(this.two.height, this.two.height + this.maxOutOfBoundsSpawnOffset);
            return new twojs_ts__WEBPACK_IMPORTED_MODULE_0__.Vector(x, y);
        }
        else {
            // Enemy spwans left or right of the screen
            const x = Math.random() > 0.5
                ? (0,_util__WEBPACK_IMPORTED_MODULE_1__.getRandomIntInRange)(-this.maxOutOfBoundsSpawnOffset, 0)
                : (0,_util__WEBPACK_IMPORTED_MODULE_1__.getRandomIntInRange)(this.two.width, this.two.width + this.maxOutOfBoundsSpawnOffset);
            const y = (0,_util__WEBPACK_IMPORTED_MODULE_1__.getRandomIntInRange)(0, this.two.height);
            return new twojs_ts__WEBPACK_IMPORTED_MODULE_0__.Vector(x, y);
        }
    }
    isInBounds() {
        if (new Date().getTime() < this.spawnTime + 5000) {
            return true;
        }
        const { x, y } = this.pawn.translation;
        const { width, height } = this.two;
        return (x > -this.maxOutOfBoundsSpawnOffset &&
            x < width + this.maxOutOfBoundsSpawnOffset &&
            y > -this.maxOutOfBoundsSpawnOffset &&
            y < height + this.maxOutOfBoundsSpawnOffset);
    }
    destroyPawn() {
        this.pawn.remove();
    }
    setMovementDirection(goal) {
        this.direction = goal.clone().subSelf(this.pawn.translation).normalize();
    }
    update(deltaTime) {
        this.pawn.translation.lerp(this.pawn.translation.clone().addSelf(this.direction), 220 * deltaTime);
    }
}


/***/ }),

/***/ "./src/entities/Player.ts":
/*!********************************!*\
  !*** ./src/entities/Player.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var twojs_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! twojs-ts */ "./node_modules/twojs-ts/two.js");
/* harmony import */ var twojs_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(twojs_ts__WEBPACK_IMPORTED_MODULE_0__);

class Player {
    constructor(two, layer) {
        this.pawnRadius = 30;
        this.moveSpeed = 300;
        this.two = two;
        this.pawn = this.createPawn();
        layer.add(this.pawn);
    }
    moveToGoal(deltaTime) {
        const pawnToGoalDistance = this.getDistanceToGoal();
        const t = (this.moveSpeed / pawnToGoalDistance) * deltaTime;
        this.pawn.translation.lerp(this.goal, t);
    }
    getDistanceToGoal() {
        return this.pawn.translation.distanceTo(this.goal);
    }
    hasReachedGoal() {
        const pawnToGoalDistance = this.getDistanceToGoal();
        return pawnToGoalDistance < 10;
    }
    createPawn() {
        const pawn = this.two.makeCircle(this.two.width / 2, this.two.height / 2, this.pawnRadius);
        pawn.fill = '#FF8000';
        pawn.linewidth = 0;
        return pawn;
    }
    setGoal(newGoal) {
        this.goal = newGoal;
    }
    update(deltaTime) {
        if (this.goal) {
            this.moveToGoal(deltaTime);
            if (this.hasReachedGoal()) {
                this.goal = null;
            }
        }
    }
    getPosition() {
        return this.pawn.translation;
    }
    isCollidingWithEnemy(enemy) {
        const playerToEnemyDistance = this.pawn.translation.distanceTo(enemy.pawn.translation);
        return playerToEnemyDistance + 5 < this.pawnRadius + enemy.pawnRadius;
    }
    reset() {
        const middleOfScreen = new twojs_ts__WEBPACK_IMPORTED_MODULE_0__.Vector(this.two.width / 2, this.two.height / 2);
        this.pawn.translation = middleOfScreen;
        this.goal = null;
    }
}


/***/ }),

/***/ "./src/entities/Score.ts":
/*!*******************************!*\
  !*** ./src/entities/Score.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Score": () => (/* binding */ Score)
/* harmony export */ });
/* harmony import */ var twojs_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! twojs-ts */ "./node_modules/twojs-ts/two.js");
/* harmony import */ var twojs_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(twojs_ts__WEBPACK_IMPORTED_MODULE_0__);

class Score {
    constructor(two, layer) {
        this.score = 0;
        this.two = two;
        this.scoreText = new twojs_ts__WEBPACK_IMPORTED_MODULE_0__.Text(`Score: ${this.score}`, 60, 70, {
            size: 32,
            alignment: 'left',
            fill: '#fff',
            visible: false,
        });
        layer.add(this.scoreText);
        // @ts-ignore
        two.add(this.scoreText);
    }
    update() {
        this.scoreText.value = `Score: ${this.score}`;
    }
    increment() {
        this.score++;
    }
}


/***/ }),

/***/ "./src/entities/Title.ts":
/*!*******************************!*\
  !*** ./src/entities/Title.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Title": () => (/* binding */ Title)
/* harmony export */ });
/* harmony import */ var twojs_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! twojs-ts */ "./node_modules/twojs-ts/two.js");
/* harmony import */ var twojs_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(twojs_ts__WEBPACK_IMPORTED_MODULE_0__);

class Title {
    constructor(two, offset, size, layer) {
        this.offset = offset;
        this.two = two;
        this.text = new twojs_ts__WEBPACK_IMPORTED_MODULE_0__.Text('', two.width / 2, two.height / 2 + offset, {
            size: size,
            style: 'bold',
            fill: '#fff',
            visible: false,
        });
        layer.add(this.text);
        // @ts-ignore
        two.add(this.text);
    }
    center() {
        this.text.translation = new twojs_ts__WEBPACK_IMPORTED_MODULE_0__.Vector(this.two.width / 2, this.two.height / 2 + this.offset);
    }
}


/***/ }),

/***/ "./src/observables/deltaTime.ts":
/*!**************************************!*\
  !*** ./src/observables/deltaTime.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deltaTime$": () => (/* binding */ deltaTime$)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/Observable.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/scheduler/animationFrame.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/observeOn.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/expand.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/pairwise.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/map.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/share.js");


const framePaintTime$ = new rxjs__WEBPACK_IMPORTED_MODULE_0__.Observable((subscriber) => {
    requestAnimationFrame((time) => {
        subscriber.next(time);
    });
});
const deltaTime$ = framePaintTime$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.observeOn)(rxjs__WEBPACK_IMPORTED_MODULE_2__.animationFrameScheduler), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.expand)(() => framePaintTime$), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.pairwise)(), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.map)(([previous, current]) => (current - previous) / 1000), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.share)());


/***/ }),

/***/ "./src/observables/enemies.ts":
/*!************************************!*\
  !*** ./src/observables/enemies.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "spawnEnemies": () => (/* binding */ spawnEnemies)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/observable/timer.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/observable/of.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/map.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/combineLatestWith.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/withLatestFrom.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/takeWhile.js");
/* harmony import */ var _deltaTime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./deltaTime */ "./src/observables/deltaTime.ts");
/* harmony import */ var _entities_Enemy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../entities/Enemy */ "./src/entities/Enemy.ts");
/* harmony import */ var _gameState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gameState */ "./src/observables/gameState.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util */ "./src/util.ts");






function spawnEnemies(two, player, score, layer) {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.timer)(0, 300).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.map)(() => spawnEnemy(two, player, score, layer)));
}
function spawnEnemy(two, player, score, layer) {
    (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.of)(new _entities_Enemy__WEBPACK_IMPORTED_MODULE_1__.default(two, player.getPosition(), layer))
        .pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.combineLatestWith)(_deltaTime__WEBPACK_IMPORTED_MODULE_0__.deltaTime$), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.withLatestFrom)(_gameState__WEBPACK_IMPORTED_MODULE_2__.gameState$), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.takeWhile)(([[enemy], gameState]) => enemy.isInBounds() && ['play', 'end'].includes(gameState)), (0,_util__WEBPACK_IMPORTED_MODULE_3__.finalizeWithValue)(([[enemy]]) => enemy.destroyPawn()))
        .subscribe(([[enemy, deltaTime], gameState]) => {
        if (gameState === 'play') {
            enemy.update(deltaTime);
        }
        if (player.isCollidingWithEnemy(enemy) && gameState !== 'end') {
            _gameState__WEBPACK_IMPORTED_MODULE_2__.gameState$.next('end');
        }
        if (!enemy.isInBounds()) {
            score.increment();
            score.update();
        }
    });
}


/***/ }),

/***/ "./src/observables/gameState.ts":
/*!**************************************!*\
  !*** ./src/observables/gameState.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "gameState$": () => (/* binding */ gameState$),
/* harmony export */   "gameStateSwitch": () => (/* binding */ gameStateSwitch)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/BehaviorSubject.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/observable/empty.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/switchMap.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/mergeWith.js");


const gameState$ = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject('start');
function gameStateSwitch({ onStart = [rxjs__WEBPACK_IMPORTED_MODULE_1__.EMPTY], onPlay = [rxjs__WEBPACK_IMPORTED_MODULE_1__.EMPTY], onEnd = [rxjs__WEBPACK_IMPORTED_MODULE_1__.EMPTY], }) {
    return gameState$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.switchMap)((gameState) => {
        if (gameState === 'start')
            return mergeFromArray(onStart);
        else if (gameState === 'play')
            return mergeFromArray(onPlay);
        else if (gameState === 'end')
            return mergeFromArray(onEnd);
        else
            rxjs__WEBPACK_IMPORTED_MODULE_1__.EMPTY;
    }));
}
function mergeFromArray(observables) {
    if (observables.length < 2) {
        return observables;
    }
    else {
        return observables[0].pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.mergeWith)(...observables.filter((_, i) => i > 0)));
    }
}


/***/ }),

/***/ "./src/observables/player.ts":
/*!***********************************!*\
  !*** ./src/observables/player.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "playerUpdate": () => (/* binding */ playerUpdate)
/* harmony export */ });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/tap.js");
/* harmony import */ var _deltaTime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./deltaTime */ "./src/observables/deltaTime.ts");


const playerUpdate = (player) => _deltaTime__WEBPACK_IMPORTED_MODULE_0__.deltaTime$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.tap)((deltaTime) => player.update(deltaTime)));


/***/ }),

/***/ "./src/observables/userInput.ts":
/*!**************************************!*\
  !*** ./src/observables/userInput.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "playerMovement": () => (/* binding */ playerMovement),
/* harmony export */   "onStart": () => (/* binding */ onStart),
/* harmony export */   "startGame": () => (/* binding */ startGame)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/observable/fromEvent.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/observable/of.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/tap.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/filter.js");
/* harmony import */ var twojs_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! twojs-ts */ "./node_modules/twojs-ts/two.js");
/* harmony import */ var twojs_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(twojs_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _gameState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameState */ "./src/observables/gameState.ts");




const playerMovement = (player) => {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.fromEvent)(document, 'click').pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.mergeMap)((event) => {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.of)(event).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.tap)((event) => {
            const newGoal = new twojs_ts__WEBPACK_IMPORTED_MODULE_0__.Vector(event.clientX, event.clientY);
            player.setGoal(newGoal);
        }));
    }));
};
const onStart = (player) => {
    return playerMovement(player).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.tap)(() => _gameState__WEBPACK_IMPORTED_MODULE_1__.gameState$.next('play')));
};
const startGame = (player) => {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.fromEvent)(document, 'keydown').pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.filter)((event) => event.key === ' '), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.tap)(() => {
        _gameState__WEBPACK_IMPORTED_MODULE_1__.gameState$.next('start');
        player.reset();
    }));
};


/***/ }),

/***/ "./src/observables/userInterface.ts":
/*!******************************************!*\
  !*** ./src/observables/userInterface.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Interface": () => (/* binding */ Interface)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/observable/of.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/withLatestFrom.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/tap.js");


const Interface = (score, title, subtitle) => {
    const interface$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.of)(score).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.withLatestFrom)((0,rxjs__WEBPACK_IMPORTED_MODULE_0__.of)(title), (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.of)(subtitle)), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.tap)(([score, title, subtitle]) => {
        score.update();
        title.center();
        subtitle.center();
    }));
    return {
        onStart$: interface$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.tap)(([score, title, subtitle]) => {
            score.score = 0;
            score.scoreText.visible = false;
            score.update();
            title.text.visible = true;
            title.text.value = 'Click anywhere to start';
            subtitle.text.visible = true;
            subtitle.text.value = 'Avoid azure balls';
        })),
        onPlay$: interface$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.tap)(([score, title, subtitle]) => {
            score.scoreText.visible = true;
            title.text.visible = false;
            subtitle.text.visible = false;
        })),
        onEnd$: interface$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.tap)(([score, title, subtitle]) => {
            score.scoreText.visible = false;
            title.text.visible = true;
            title.text.value = `You manged to outlive ${score.score} menacing azure balls`;
            subtitle.text.visible = true;
            subtitle.text.value = 'Press space to play again';
        })),
    };
};


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getRandomIntInRange": () => (/* binding */ getRandomIntInRange),
/* harmony export */   "finalizeWithValue": () => (/* binding */ finalizeWithValue)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/observable/defer.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/tap.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/finalize.js");


function getRandomIntInRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
// https://github.com/ReactiveX/rxjs/issues/4803#issuecomment-496711335
function finalizeWithValue(callback) {
    return (source) => (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.defer)(() => {
        let lastValue;
        return source.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.tap)((value) => (lastValue = value)), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.finalize)(() => callback(lastValue)));
    });
}


/***/ }),

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__extends": () => (/* binding */ __extends),
/* harmony export */   "__assign": () => (/* binding */ __assign),
/* harmony export */   "__rest": () => (/* binding */ __rest),
/* harmony export */   "__decorate": () => (/* binding */ __decorate),
/* harmony export */   "__param": () => (/* binding */ __param),
/* harmony export */   "__metadata": () => (/* binding */ __metadata),
/* harmony export */   "__awaiter": () => (/* binding */ __awaiter),
/* harmony export */   "__generator": () => (/* binding */ __generator),
/* harmony export */   "__createBinding": () => (/* binding */ __createBinding),
/* harmony export */   "__exportStar": () => (/* binding */ __exportStar),
/* harmony export */   "__values": () => (/* binding */ __values),
/* harmony export */   "__read": () => (/* binding */ __read),
/* harmony export */   "__spread": () => (/* binding */ __spread),
/* harmony export */   "__spreadArrays": () => (/* binding */ __spreadArrays),
/* harmony export */   "__spreadArray": () => (/* binding */ __spreadArray),
/* harmony export */   "__await": () => (/* binding */ __await),
/* harmony export */   "__asyncGenerator": () => (/* binding */ __asyncGenerator),
/* harmony export */   "__asyncDelegator": () => (/* binding */ __asyncDelegator),
/* harmony export */   "__asyncValues": () => (/* binding */ __asyncValues),
/* harmony export */   "__makeTemplateObject": () => (/* binding */ __makeTemplateObject),
/* harmony export */   "__importStar": () => (/* binding */ __importStar),
/* harmony export */   "__importDefault": () => (/* binding */ __importDefault),
/* harmony export */   "__classPrivateFieldGet": () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   "__classPrivateFieldSet": () => (/* binding */ __classPrivateFieldSet)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ "./node_modules/twojs-ts/two.js":
/*!**************************************!*\
  !*** ./node_modules/twojs-ts/two.js ***!
  \**************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(c,k,m){c!=Array.prototype&&c!=Object.prototype&&(c[k]=m.value)};$jscomp.getGlobal=function(c){return"undefined"!=typeof window&&window===c?c:"undefined"!=typeof __webpack_require__.g&&null!=__webpack_require__.g?__webpack_require__.g:c};$jscomp.global=$jscomp.getGlobal(this);$jscomp.SYMBOL_PREFIX="jscomp_symbol_";
$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};$jscomp.symbolCounter_=0;$jscomp.Symbol=function(c){return $jscomp.SYMBOL_PREFIX+(c||"")+$jscomp.symbolCounter_++};
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var c=$jscomp.global.Symbol.iterator;c||(c=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[c]&&$jscomp.defineProperty(Array.prototype,c,{configurable:!0,writable:!0,value:function(){return $jscomp.arrayIterator(this)}});$jscomp.initSymbolIterator=function(){}};$jscomp.arrayIterator=function(c){var k=0;return $jscomp.iteratorPrototype(function(){return k<c.length?{done:!1,value:c[k++]}:{done:!0}})};
$jscomp.iteratorPrototype=function(c){$jscomp.initSymbolIterator();c={next:c};c[$jscomp.global.Symbol.iterator]=function(){return this};return c};$jscomp.iteratorFromArray=function(c,k){$jscomp.initSymbolIterator();c instanceof String&&(c+="");var m=0,l={next:function(){if(m<c.length){var h=m++;return{value:k(h,c[h]),done:!1}}l.next=function(){return{done:!0,value:void 0}};return l.next()}};l[Symbol.iterator]=function(){return l};return l};
$jscomp.polyfill=function(c,k,m,l){if(k){m=$jscomp.global;c=c.split(".");for(l=0;l<c.length-1;l++){var h=c[l];h in m||(m[h]={});m=m[h]}c=c[c.length-1];l=m[c];k=k(l);k!=l&&null!=k&&$jscomp.defineProperty(m,c,{configurable:!0,writable:!0,value:k})}};$jscomp.polyfill("Array.prototype.keys",function(c){return c?c:function(){return $jscomp.iteratorFromArray(this,function(c){return c})}},"es6-impl","es3");
$jscomp.polyfill("Array.prototype.values",function(c){return c?c:function(){return $jscomp.iteratorFromArray(this,function(c,m){return m})}},"es6","es3");$jscomp.polyfill("Array.prototype.fill",function(c){return c?c:function(c,m,l){var h=this.length||0;0>m&&(m=Math.max(0,h+m));if(null==l||l>h)l=h;l=Number(l);0>l&&(l=Math.max(0,h+l));for(m=Number(m||0);m<l;m++)this[m]=c;return this}},"es6-impl","es3");
this.Two=function(c){function k(){var a=document.body.getBoundingClientRect(),c=this.width=a.width,a=this.height=a.height;this.renderer.setSize(c,a,this.ratio);this.trigger(p.Events.resize,c,a)}function m(){L(m);for(var a=0;a<p.Instances.length;a++){var c=p.Instances[a];c.playing&&c.update()}}var l="undefined"!=typeof window?window:"undefined"!=typeof __webpack_require__.g?__webpack_require__.g:null,h=Object.prototype.toString,d={_indexAmount:0,natural:{slice:Array.prototype.slice,indexOf:Array.prototype.indexOf,keys:Object.keys,
bind:Function.prototype.bind,create:Object.create},identity:function(a){return a},isArguments:function(a){return"[object Arguments]"===h.call(a)},isFunction:function(a){return"[object Function]"===h.call(a)},isString:function(a){return"[object String]"===h.call(a)},isNumber:function(a){return"[object Number]"===h.call(a)},isDate:function(a){return"[object Date]"===h.call(a)},isRegExp:function(a){return"[object RegExp]"===h.call(a)},isError:function(a){return"[object Error]"===h.call(a)},isFinite:function(a){return isFinite(a)&&
!isNaN(parseFloat(a))},isNaN:function(a){return d.isNumber(a)&&a!==+a},isBoolean:function(a){return!0===a||!1===a||"[object Boolean]"===h.call(a)},isNull:function(a){return null===a},isUndefined:function(a){return void 0===a},isEmpty:function(a){return null==a?!0:q&&(d.isArray(a)||d.isString(a)||d.isArguments(a))?0===a.length:0===d.keys(a).length},isElement:function(a){return!(!a||1!==a.nodeType)},isArray:Array.isArray||function(a){return"[object Array]"===h.call(a)},isObject:function(a){var c=typeof a;
return"function"===c||"object"===c&&!!a},toArray:function(a){return a?d.isArray(a)?x.call(a):q(a)?d.map(a,d.identity):d.values(a):[]},range:function(a,c,f){null==c&&(c=a||0,a=0);f=f||1;c=Math.max(Math.ceil((c-a)/f),0);for(var e=Array(c),d=0;d<c;d++,a+=f)e[d]=a;return e},indexOf:function(a,c){if(d.natural.indexOf)return d.natural.indexOf.call(a,c);for(var f=0;f<a.length;f++)if(a[f]===c)return f;return-1},has:function(a,c){return null!=a&&hasOwnProperty.call(a,c)},bind:function(a,c){var f=d.natural.bind;
if(f&&a.bind===f)return f.apply(a,x.call(arguments,1));var e=x.call(arguments,2);return function(){a.apply(c,e)}},extend:function(a){for(var c=x.call(arguments,1),f=0;f<c.length;f++){var e=c[f],d;for(d in e)a[d]=e[d]}return a},defaults:function(a){for(var c=x.call(arguments,1),f=0;f<c.length;f++){var e=c[f],d;for(d in e)void 0===a[d]&&(a[d]=e[d])}return a},keys:function(a){if(!d.isObject(a))return[];if(d.natural.keys)return d.natural.keys(a);var c=[],f;for(f in a)d.has(a,f)&&c.push(f);return c},values:function(a){for(var c=
d.keys(a),f=[],e=0;e<c.length;e++)f.push(a[c[e]]);return f},each:function(a,c,f){f=f||this;for(var e=!q(a)&&d.keys(a),g=(e||a).length,y=0;y<g;y++){var n=e?e[y]:y;c.call(f,a[n],n,a)}return a},map:function(a,c,f){f=f||this;for(var e=!q(a)&&d.keys(a),g=(e||a).length,n=[],y=0;y<g;y++){var t=e?e[y]:y;n[y]=c.call(f,a[t],t,a)}return n},once:function(a){var c=!1;return function(){if(c)return a;c=!0;return a.apply(this,arguments)}},after:function(a,c){return function(){for(;1>--a;)return c.apply(this,arguments)}},
uniqueId:function(a){var c=++d._indexAmount+"";return a?a+c:c}},e=Math.sin,a=Math.cos,g=Math.atan2,n=Math.sqrt,f=Math.PI,t=f/2,v=Math.pow,B=Math.min,z=Math.max,A=0,x=d.natural.slice,u=l.performance&&l.performance.now?l.performance:Date,r=Math.pow(2,53)-1,q=function(a){a=null==a?void 0:a.length;return"number"==typeof a&&0<=a&&a<=r},w={temp:l.document?l.document.createElement("div"):{},hasEventListeners:d.isFunction(l.addEventListener),bind:function(a,c,f,e){this.hasEventListeners?a.addEventListener(c,
f,!!e):a.attachEvent("on"+c,f);return w},unbind:function(a,c,f,e){w.hasEventListeners?a.removeEventListeners(c,f,!!e):a.detachEvent("on"+c,f);return w},getRequestAnimationFrame:function(){var a=0,c=["ms","moz","webkit","o"],f=l.requestAnimationFrame;if(!f){for(var e=0;e<c.length;e++)f=l[c[e]+"RequestAnimationFrame"]||f;f=f||function(c,f){var e=(new Date).getTime(),d=Math.max(0,16-(e-a));f=l.setTimeout(function(){c(e+d)},d);a=e+d;return f}}f.init=d.once(m);return f}},p=l.Two=function(a){a=d.defaults(a||
{},{fullscreen:!1,width:640,height:480,type:p.Types.svg,autostart:!1});d.each(a,function(a,c){"fullscreen"!==c&&"autostart"!==c&&(this[c]=a)},this);if(d.isElement(a.domElement)){var c=a.domElement.tagName.toLowerCase();/^(CanvasRenderer-canvas|WebGLRenderer-canvas|SVGRenderer-svg)$/.test(this.type+"-"+c)||(this.type=p.Types[c])}this.renderer=new p[this.type](this);p.Utils.setPlaying.call(this,a.autostart);this.frameCount=0;a.fullscreen?(a=d.bind(k,this),d.extend(document.body.style,{overflow:"hidden",
margin:0,padding:0,top:0,left:0,right:0,bottom:0,position:"fixed"}),d.extend(this.renderer.domElement.style,{display:"block",top:0,left:0,right:0,bottom:0,position:"fixed"}),w.bind(l,"resize",a),a()):d.isElement(a.domElement)||(this.renderer.setSize(a.width,a.height,this.ratio),this.width=a.width,this.height=a.height);this.scene=this.renderer.scene;p.Instances.push(this);L.init()};d.extend(p,{root:l,Array:l.Float32Array||Array,Types:{webgl:"WebGLRenderer",svg:"SVGRenderer",canvas:"CanvasRenderer"},
Version:"v0.7.0",Identifier:"two_",Properties:{hierarchy:"hierarchy",demotion:"demotion"},Events:{play:"play",pause:"pause",update:"update",render:"render",resize:"resize",change:"change",remove:"remove",insert:"insert",order:"order",load:"load"},Commands:{move:"M",line:"L",curve:"C",close:"Z"},Resolution:8,Instances:[],noConflict:function(){l.Two=c;return this},uniqueId:function(){var a=A;A++;return a},Utils:d.extend(d,{performance:u,defineProperty:function(a){var c="_"+a,f="_flag"+a.charAt(0).toUpperCase()+
a.slice(1);Object.defineProperty(this,a,{enumerable:!0,get:function(){return this[c]},set:function(a){this[c]=a;this[f]=!0}})},release:function(a){d.isObject(a)&&(d.isFunction(a.unbind)&&a.unbind(),a.vertices&&(d.isFunction(a.vertices.unbind)&&a.vertices.unbind(),d.each(a.vertices,function(a){d.isFunction(a.unbind)&&a.unbind()})),a.children&&d.each(a.children,function(a){p.Utils.release(a)}))},xhr:function(a,c){var f=new XMLHttpRequest;f.open("GET",a);f.onreadystatechange=function(){4===f.readyState&&
200===f.status&&c(f.responseText)};f.send();return f},Curve:{CollinearityEpsilon:v(10,-30),RecursionLimit:16,CuspLimit:0,Tolerance:{distance:.25,angle:0,epsilon:.01},abscissas:[[.5773502691896257],[0,.7745966692414834],[.33998104358485626,.8611363115940526],[0,.5384693101056831,.906179845938664],[.2386191860831969,.6612093864662645,.932469514203152],[0,.4058451513773972,.7415311855993945,.9491079123427585],[.1834346424956498,.525532409916329,.7966664774136267,.9602898564975363],[0,.3242534234038089,
.6133714327005904,.8360311073266358,.9681602395076261],[.14887433898163122,.4333953941292472,.6794095682990244,.8650633666889845,.9739065285171717],[0,.26954315595234496,.5190961292068118,.7301520055740494,.8870625997680953,.978228658146057],[.1252334085114689,.3678314989981802,.5873179542866175,.7699026741943047,.9041172563704749,.9815606342467192],[0,.2304583159551348,.44849275103644687,.6423493394403402,.8015780907333099,.9175983992229779,.9841830547185881],[.10805494870734367,.31911236892788974,
.5152486363581541,.6872929048116855,.827201315069765,.9284348836635735,.9862838086968123],[0,.20119409399743451,.3941513470775634,.5709721726085388,.7244177313601701,.8482065834104272,.937273392400706,.9879925180204854],[.09501250983763744,.2816035507792589,.45801677765722737,.6178762444026438,.755404408355003,.8656312023878318,.9445750230732326,.9894009349916499]],weights:[[1],[.8888888888888888,.5555555555555556],[.6521451548625461,.34785484513745385],[.5688888888888889,.47862867049936647,.23692688505618908],
[.46791393457269104,.3607615730481386,.17132449237917036],[.4179591836734694,.3818300505051189,.27970539148927664,.1294849661688697],[.362683783378362,.31370664587788727,.22238103445337448,.10122853629037626],[.3302393550012598,.31234707704000286,.26061069640293544,.1806481606948574,.08127438836157441],[.29552422471475287,.26926671930999635,.21908636251598204,.1494513491505806,.06667134430868814],[.2729250867779006,.26280454451024665,.23319376459199048,.18629021092773426,.1255803694649046,.05566856711617366],
[.24914704581340277,.2334925365383548,.20316742672306592,.16007832854334622,.10693932599531843,.04717533638651183],[.2325515532308739,.22628318026289723,.2078160475368885,.17814598076194574,.13887351021978725,.09212149983772845,.04048400476531588],[.2152638534631578,.2051984637212956,.18553839747793782,.15720316715819355,.12151857068790319,.08015808715976021,.03511946033175186],[.2025782419255613,.19843148532711158,.1861610000155622,.16626920581699392,.13957067792615432,.10715922046717194,.07036604748810812,
.03075324199611727],[.1894506104550685,.18260341504492358,.16915651939500254,.14959598881657674,.12462897125553388,.09515851168249279,.062253523938647894,.027152459411754096]]},devicePixelRatio:l.devicePixelRatio||1,getBackingStoreRatio:function(a){return a.webkitBackingStorePixelRatio||a.mozBackingStorePixelRatio||a.msBackingStorePixelRatio||a.oBackingStorePixelRatio||a.backingStorePixelRatio||1},getRatio:function(a){return p.Utils.devicePixelRatio/O(a)},setPlaying:function(a){this.playing=!!a;return this},
getComputedMatrix:function(a,c){c=c&&c.identity()||new p.Matrix;for(var f=[];a&&a._matrix;)f.push(a._matrix),a=a.parent;f.reverse();d.each(f,function(a){a=a.elements;c.multiply(a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9])});return c},deltaTransformPoint:function(a,c,f){return new p.Vector(c*a.a+f*a.c+0,c*a.b+f*a.d+0)},decomposeMatrix:function(a){var c=p.Utils.deltaTransformPoint(a,0,1),f=p.Utils.deltaTransformPoint(a,1,0),c=180/Math.PI*Math.atan2(c.y,c.x)-90;return{translateX:a.e,translateY:a.f,
scaleX:Math.sqrt(a.a*a.a+a.b*a.b),scaleY:Math.sqrt(a.c*a.c+a.d*a.d),skewX:c,skewY:180/Math.PI*Math.atan2(f.y,f.x),rotation:c}},applySvgAttributes:function(a,c){var f={},e={},g;if(getComputedStyle){var n=getComputedStyle(a);for(g=n.length;g--;){var t=n[g];var y=n[t];void 0!==y&&(e[t]=y)}}for(g=a.attributes.length;g--;)y=a.attributes[g],f[y.nodeName]=y.value;d.isUndefined(e.opacity)||(e["stroke-opacity"]=e.opacity,e["fill-opacity"]=e.opacity);d.extend(e,f);e.visible=!(d.isUndefined(e.display)&&"none"===
e.display)||d.isUndefined(e.visibility)&&"hidden"===e.visibility;for(t in e)switch(y=e[t],t){case "transform":if("none"===y)break;if(null===(a.getCTM?a.getCTM():null))break;f=p.Utils.decomposeMatrix(a.getCTM());c.translation.set(f.translateX,f.translateY);c.rotation=f.rotation;c.scale=f.scaleX;f=parseFloat((e.x+"").replace("px"));g=parseFloat((e.y+"").replace("px"));f&&(c.translation.x=f);g&&(c.translation.y=g);break;case "visible":c.visible=y;break;case "stroke-linecap":c.cap=y;break;case "stroke-linejoin":c.join=
y;break;case "stroke-miterlimit":c.miter=y;break;case "stroke-width":c.linewidth=parseFloat(y);break;case "stroke-opacity":case "fill-opacity":case "opacity":c.opacity=parseFloat(y);break;case "fill":case "stroke":/url\(\#.*\)/i.test(y)?c[t]=this.getById(y.replace(/url\(\#(.*)\)/i,"$1")):c[t]="none"===y?"transparent":y;break;case "id":c.id=y;break;case "class":c.classList=y.split(" ")}return c},read:{svg:function(){return p.Utils.read.g.apply(this,arguments)},g:function(a){var c=new p.Group;p.Utils.applySvgAttributes.call(this,
a,c);for(var f=0,e=a.childNodes.length;f<e;f++){var d=a.childNodes[f],g=d.nodeName;if(!g)return;g=g.replace(/svg\:/ig,"").toLowerCase();g in p.Utils.read&&(d=p.Utils.read[g].call(c,d),c.add(d))}return c},polygon:function(a,c){var f=[];a.getAttribute("points").replace(/(-?[\d\.?]+)[,|\s](-?[\d\.?]+)/g,function(a,c,e){f.push(new p.Anchor(parseFloat(c),parseFloat(e)))});c=(new p.Path(f,!c)).noStroke();c.fill="black";return p.Utils.applySvgAttributes.call(this,a,c)},polyline:function(a){return p.Utils.read.polygon.call(this,
a,!0)},path:function(a){var c=a.getAttribute("d"),f=new p.Anchor,e,g,n=!1,t=!1,y=c.match(/[a-df-z][^a-df-z]*/ig),h=y.length-1;d.each(y.slice(0),function(a,c){var f=a[0],e=f.toLowerCase(),g=a.slice(1).trim().split(/[\s,]+|(?=\s?[+\-])/),d=[],n;0>=c&&(y=[]);switch(e){case "h":case "v":1<g.length&&(n=1);break;case "m":case "l":case "t":2<g.length&&(n=2);break;case "s":case "q":4<g.length&&(n=4);break;case "c":6<g.length&&(n=6)}if(n){a=0;c=g.length;for(e=0;a<c;a+=n){var t=f;if(0<e)switch(f){case "m":t=
"l";break;case "M":t="L"}d.push([t].concat(g.slice(a,a+n)).join(" "));e++}y=Array.prototype.concat.apply(y,d)}else y.push(a)});var m=[];d.each(y,function(a,c){var y=a[0],D=y.toLowerCase();g=a.slice(1).trim();g=g.replace(/(-?\d+(?:\.\d*)?)[eE]([+\-]?\d+)/g,function(a,c,f){return parseFloat(c)*v(10,f)});g=g.split(/[\s,]+|(?=\s?[+\-])/);t=y===D;switch(D){case "z":if(c>=h)n=!0;else{a=f.x;c=f.y;var k=new p.Anchor(a,c,void 0,void 0,void 0,void 0,p.Commands.close)}break;case "m":case "l":a=parseFloat(g[0]);
c=parseFloat(g[1]);k=new p.Anchor(a,c,void 0,void 0,void 0,void 0,"m"===D?p.Commands.move:p.Commands.line);t&&k.addSelf(f);f=k;break;case "h":case "v":c="h"===D?"x":"y";D="x"===c?"y":"x";k=new p.Anchor(void 0,void 0,void 0,void 0,void 0,void 0,p.Commands.line);k[c]=parseFloat(g[0]);k[D]=f[D];t&&(k[c]+=f[c]);f=k;break;case "c":case "s":k=f.x;c=f.y;e||(e=new p.Vector);if("c"===D){y=parseFloat(g[0]);var B=parseFloat(g[1]);var l=parseFloat(g[2]);var z=parseFloat(g[3]);D=parseFloat(g[4]);a=parseFloat(g[5])}else D=
M(f,e,t),y=D.x,B=D.y,l=parseFloat(g[0]),z=parseFloat(g[1]),D=parseFloat(g[2]),a=parseFloat(g[3]);t&&(y+=k,B+=c,l+=k,z+=c,D+=k,a+=c);d.isObject(f.controls)||p.Anchor.AppendCurveProperties(f);f.controls.right.set(y-f.x,B-f.y);f=k=new p.Anchor(D,a,l-D,z-a,void 0,void 0,p.Commands.curve);e=k.controls.left;break;case "t":case "q":k=f.x;c=f.y;e||(e=new p.Vector);e.isZero()?(y=k,B=c):(y=e.x,c=e.y);"q"===D?(l=parseFloat(g[0]),z=parseFloat(g[1]),D=parseFloat(g[1]),a=parseFloat(g[2])):(D=M(f,e,t),l=D.x,z=D.y,
D=parseFloat(g[0]),a=parseFloat(g[1]));t&&(y+=k,B+=c,l+=k,z+=c,D+=k,a+=c);d.isObject(f.controls)||p.Anchor.AppendCurveProperties(f);f.controls.right.set(y-f.x,B-f.y);f=k=new p.Anchor(D,a,l-D,z-a,void 0,void 0,p.Commands.curve);e=k.controls.left;break;case "a":k=f.x;c=f.y;var J=parseFloat(g[0]),x=parseFloat(g[1]);B=parseFloat(g[2])*Math.PI/180;y=parseFloat(g[3]);l=parseFloat(g[4]);D=parseFloat(g[5]);a=parseFloat(g[6]);t&&(D+=k,a+=c);var u=(D-k)/2,A=(a-c)/2;z=u*Math.cos(B)+A*Math.sin(B);var u=-u*Math.sin(B)+
A*Math.cos(B),A=J*J,q=x*x,r=z*z,K=u*u,Q=r/A+K/q;1<Q&&(J*=Math.sqrt(Q),x*=Math.sqrt(Q));q=Math.sqrt((A*q-A*K-q*r)/(A*K+q*r));d.isNaN(q)?q=0:y!=l&&0<q&&(q*=-1);A=q*J*u/x;q=-q*x*z/J;k=A*Math.cos(B)-q*Math.sin(B)+(k+D)/2;var r=A*Math.sin(B)+q*Math.cos(B)+(c+a)/2,w=function(a,c){return(a[0]*c[0]+a[1]*c[1])/(Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2))*Math.sqrt(Math.pow(c[0],2)+Math.pow(c[1],2)))};c=function(a,c){return(a[0]*c[1]<a[1]*c[0]?-1:1)*Math.acos(w(a,c))};var S=c([1,0],[(z-A)/J,(u-q)/x]),K=[(z-
A)/J,(u-q)/x];z=[(-z-A)/J,(-u-q)/x];var C=c(K,z);-1>=w(K,z)&&(C=Math.PI);1<=w(K,z)&&(C=0);y&&(C=I(C,2*Math.PI));l&&0<C&&(C-=2*Math.PI);var R=p.Resolution,T=(new p.Matrix).translate(k,r).rotate(B);k=d.map(d.range(R),function(a){a=(1-a/(R-1))*C+S;a=T.multiply(J*Math.cos(a),x*Math.sin(a),1);return new p.Anchor(a.x,a.y,!1,!1,!1,!1,p.Commands.line)});k.push(new p.Anchor(D,a,!1,!1,!1,!1,p.Commands.line));f=k[k.length-1];e=f.controls.left}k&&(d.isArray(k)?m=m.concat(k):m.push(k))});if(!(1>=m.length)){c=
(new p.Path(m,n,void 0,!0)).noStroke();c.fill="black";var k=c.getBoundingClientRect(!0);k.centroid={x:k.left+k.width/2,y:k.top+k.height/2};d.each(c.vertices,function(a){a.subSelf(k.centroid)});c.translation.addSelf(k.centroid);return p.Utils.applySvgAttributes.call(this,a,c)}},circle:function(a){var c=parseFloat(a.getAttribute("cx")),f=parseFloat(a.getAttribute("cy")),e=parseFloat(a.getAttribute("r")),c=(new p.Circle(c,f,e)).noStroke();c.fill="black";return p.Utils.applySvgAttributes.call(this,a,
c)},ellipse:function(a){var c=parseFloat(a.getAttribute("cx")),f=parseFloat(a.getAttribute("cy")),e=parseFloat(a.getAttribute("rx")),g=parseFloat(a.getAttribute("ry")),c=(new p.Ellipse(c,f,e,g)).noStroke();c.fill="black";return p.Utils.applySvgAttributes.call(this,a,c)},rect:function(a){var c=parseFloat(a.getAttribute("x"))||0,f=parseFloat(a.getAttribute("y"))||0,e=parseFloat(a.getAttribute("width")),g=parseFloat(a.getAttribute("height")),c=(new p.Rectangle(c+e/2,f+g/2,e,g)).noStroke();c.fill="black";
return p.Utils.applySvgAttributes.call(this,a,c)},line:function(a){var c=parseFloat(a.getAttribute("x1")),f=parseFloat(a.getAttribute("y1")),e=parseFloat(a.getAttribute("x2")),g=parseFloat(a.getAttribute("y2")),c=(new p.Line(c,f,e,g)).noFill();return p.Utils.applySvgAttributes.call(this,a,c)},lineargradient:function(a){for(var c,f=parseFloat(a.getAttribute("x1")),e=parseFloat(a.getAttribute("y1")),g=parseFloat(a.getAttribute("x2")),n=parseFloat(a.getAttribute("y2")),t=(g+f)/2,h=(n+e)/2,y=[],v=0;v<
a.children.length;v++){c=a.children[v];var k=parseFloat(c.getAttribute("offset")),m=c.getAttribute("stop-color"),B=c.getAttribute("stop-opacity"),l=c.getAttribute("style");d.isNull(m)&&(m=(c=l?l.match(/stop\-color\:\s?([\#a-fA-F0-9]*)/):!1)&&1<c.length?c[1]:void 0);d.isNull(B)&&(B=(c=l?l.match(/stop\-opacity\:\s?([0-9\.\-]*)/):!1)&&1<c.length?parseFloat(c[1]):1);y.push(new p.Gradient.Stop(k,m,B))}f=new p.LinearGradient(f-t,e-h,g-t,n-h,y);return p.Utils.applySvgAttributes.call(this,a,f)},radialgradient:function(a){var c=
parseFloat(a.getAttribute("cx"))||0,f=parseFloat(a.getAttribute("cy"))||0,e=parseFloat(a.getAttribute("r")),g=parseFloat(a.getAttribute("fx")),n=parseFloat(a.getAttribute("fy"));d.isNaN(g)&&(g=c);d.isNaN(n)&&(n=f);for(var t=Math.abs(c+g)/2,h=Math.abs(f+n)/2,v=[],y=0;y<a.children.length;y++){var k=a.children[y];var m=parseFloat(k.getAttribute("offset")),B=k.getAttribute("stop-color"),l=k.getAttribute("stop-opacity"),z=k.getAttribute("style");d.isNull(B)&&(B=(k=z?z.match(/stop\-color\:\s?([\#a-fA-F0-9]*)/):
!1)&&1<k.length?k[1]:void 0);d.isNull(l)&&(l=(k=z?z.match(/stop\-opacity\:\s?([0-9\.\-]*)/):!1)&&1<k.length?parseFloat(k[1]):1);v.push(new p.Gradient.Stop(m,B,l))}c=new p.RadialGradient(c-t,f-h,e,v,g-t,n-h);return p.Utils.applySvgAttributes.call(this,a,c)}},subdivide:function(a,c,f,e,g,n,t,h,v){v=v||p.Utils.Curve.RecursionLimit;var y=v+1;return a===t&&c===h?[new p.Anchor(t,h)]:d.map(d.range(0,y),function(d){var v=d/y;d=N(v,a,f,g,t);v=N(v,c,e,n,h);return new p.Anchor(d,v)})},getPointOnCubicBezier:function(a,
c,f,e,g){var d=1-a;return d*d*d*c+3*d*d*a*f+3*d*a*a*e+a*a*a*g},getCurveLength:function(a,c,f,e,g,d,t,v,h){if(a===f&&c===e&&g===t&&d===v)return a=t-a,c=v-c,n(a*a+c*c);var y=9*(f-g)+3*(t-a),k=6*(a+g)-12*f,B=3*(f-a),m=9*(e-d)+3*(v-c),l=6*(c+d)-12*e,D=3*(e-c);return P(function(a){var c=(y*a+k)*a+B;a=(m*a+l)*a+D;return n(c*c+a*a)},0,1,h||p.Utils.Curve.RecursionLimit)},integrate:function(a,c,f,e){var g=p.Utils.Curve.abscissas[e-2],d=p.Utils.Curve.weights[e-2];f=.5*(f-c);c=f+c;var n=0,t=e+1>>1;for(e=e&1?
d[n++]*a(c):0;n<t;){var v=f*g[n];e+=d[n++]*(a(c+v)+a(c-v))}return f*e},getCurveFromPoints:function(a,c){for(var f=a.length,e=f-1,g=0;g<f;g++){var n=a[g];d.isObject(n.controls)||p.Anchor.AppendCurveProperties(n);var t=c?I(g-1,f):z(g-1,0),v=c?I(g+1,f):B(g+1,e);F(a[t],n,a[v]);n._command=0===g?p.Commands.move:p.Commands.curve;n.controls.left.x=d.isNumber(n.controls.left.x)?n.controls.left.x:n.x;n.controls.left.y=d.isNumber(n.controls.left.y)?n.controls.left.y:n.y;n.controls.right.x=d.isNumber(n.controls.right.x)?
n.controls.right.x:n.x;n.controls.right.y=d.isNumber(n.controls.right.y)?n.controls.right.y:n.y}},getControlPoints:function(c,g,n){var v=G(c,g),h=G(n,g);c=E(c,g);n=E(n,g);var k=(v+h)/2;g.u=d.isObject(g.controls.left)?g.controls.left:new p.Vector(0,0);g.v=d.isObject(g.controls.right)?g.controls.right:new p.Vector(0,0);if(.0001>c||.0001>n)return g._relative||(g.controls.left.copy(g),g.controls.right.copy(g)),g;c*=.33;n*=.33;k=h<v?k+t:k-t;g.controls.left.x=a(k)*c;g.controls.left.y=e(k)*c;k-=f;g.controls.right.x=
a(k)*n;g.controls.right.y=e(k)*n;g._relative||(g.controls.left.x+=g.x,g.controls.left.y+=g.y,g.controls.right.x+=g.x,g.controls.right.y+=g.y);return g},getReflection:function(a,c,f){return new p.Vector(2*a.x-(c.x+a.x)-(f?a.x:0),2*a.y-(c.y+a.y)-(f?a.y:0))},getAnchorsFromArcData:function(a,c,f,e,g,n,t){(new p.Matrix).translate(a.x,a.y).rotate(c);var v=p.Resolution;return d.map(d.range(v),function(a){a=(a+1)/v;t&&(a=1-a);a=a*n+g;a=new p.Anchor(f*Math.cos(a),e*Math.sin(a));p.Anchor.AppendCurveProperties(a);
a.command=p.Commands.line;return a})},ratioBetween:function(a,c){return(a.x*c.x+a.y*c.y)/(a.length()*c.length())},angleBetween:function(a,c){if(4<=arguments.length){var f=arguments[0]-arguments[2];var e=arguments[1]-arguments[3];return g(e,f)}f=a.x-c.x;e=a.y-c.y;return g(e,f)},distanceBetweenSquared:function(a,c){var f=a.x-c.x;a=a.y-c.y;return f*f+a*a},distanceBetween:function(a,c){return n(H(a,c))},lerp:function(a,c,f){return f*(c-a)+a},toFixed:function(a){return Math.floor(1E3*a)/1E3},mod:function(a,
c){for(;0>a;)a+=c;return a%c},Collection:function(){Array.call(this);1<arguments.length?Array.prototype.push.apply(this,arguments):arguments[0]&&Array.isArray(arguments[0])&&Array.prototype.push.apply(this,arguments[0])},Error:function(a){this.name="two.js";this.message=a},Events:{on:function(a,c){this._events||(this._events={});(this._events[a]||(this._events[a]=[])).push(c);return this},off:function(a,c){if(!this._events)return this;if(!a&&!c)return this._events={},this;for(var f=a?[a]:d.keys(this._events),
e=0,g=f.length;e<g;e++){a=f[e];var n=this._events[a];if(n){var t=[];if(c)for(var v=0,h=n.length;v<h;v++){var k=n[v],k=k.callback?k.callback:k;c&&c!==k&&t.push(k)}this._events[a]=t}}return this},trigger:function(a){if(!this._events)return this;var c=x.call(arguments,1),f=this._events[a];f&&C(this,f,c);return this},listen:function(a,c,f){var e=this;if(a){var g=function(){f.apply(e,arguments)};g.obj=a;g.name=c;g.callback=f;a.on(c,g)}return this},ignore:function(a,c,f){a.off(c,f);return this}}})});p.Utils.Events.bind=
p.Utils.Events.on;p.Utils.Events.unbind=p.Utils.Events.off;var C=function(a,c,f){switch(f.length){case 0:var e=function(e){c[e].call(a,f[0])};break;case 1:e=function(e){c[e].call(a,f[0],f[1])};break;case 2:e=function(e){c[e].call(a,f[0],f[1],f[2])};break;case 3:e=function(e){c[e].call(a,f[0],f[1],f[2],f[3])};break;default:e=function(e){c[e].apply(a,f)}}for(var g=0;g<c.length;g++)e(g)};p.Utils.Error.prototype=Error();p.Utils.Error.prototype.constructor=p.Utils.Error;p.Utils.Collection.prototype=[];
p.Utils.Collection.prototype.constructor=p.Utils.Collection;d.extend(p.Utils.Collection.prototype,p.Utils.Events,{pop:function(){var a=Array.prototype.pop.apply(this,arguments);this.trigger(p.Events.remove,[a]);return a},shift:function(){var a=Array.prototype.shift.apply(this,arguments);this.trigger(p.Events.remove,[a]);return a},push:function(){var a=Array.prototype.push.apply(this,arguments);this.trigger(p.Events.insert,arguments);return a},unshift:function(){var a=Array.prototype.unshift.apply(this,
arguments);this.trigger(p.Events.insert,arguments);return a},splice:function(){var a=Array.prototype.splice.apply(this,arguments);this.trigger(p.Events.remove,a);if(2<arguments.length){var c=this.slice(arguments[0],arguments[0]+arguments.length-2);this.trigger(p.Events.insert,c);this.trigger(p.Events.order)}return a},sort:function(){Array.prototype.sort.apply(this,arguments);this.trigger(p.Events.order);return this},reverse:function(){Array.prototype.reverse.apply(this,arguments);this.trigger(p.Events.order);
return this}});var E=p.Utils.distanceBetween,H=p.Utils.distanceBetweenSquared,G=p.Utils.angleBetween,F=p.Utils.getControlPoints,I=p.Utils.mod,O=p.Utils.getBackingStoreRatio,N=p.Utils.getPointOnCubicBezier,P=p.Utils.integrate,M=p.Utils.getReflection;d.extend(p.prototype,p.Utils.Events,{appendTo:function(a){a.appendChild(this.renderer.domElement);return this},play:function(){p.Utils.setPlaying.call(this,!0);return this.trigger(p.Events.play)},pause:function(){this.playing=!1;return this.trigger(p.Events.pause)},
update:function(){var a=!!this._lastFrame,c=u.now();this.frameCount++;a&&(this.timeDelta=parseFloat((c-this._lastFrame).toFixed(3)));this._lastFrame=c;var a=this.width,c=this.height,f=this.renderer;a===f.width&&c===f.height||f.setSize(a,c,this.ratio);this.trigger(p.Events.update,this.frameCount,this.timeDelta);return this.render()},render:function(){this.renderer.render();return this.trigger(p.Events.render,this.frameCount)},add:function(a){var c=a;c instanceof Array||(c=d.toArray(arguments));this.scene.add(c);
return this},remove:function(a){var c=a;c instanceof Array||(c=d.toArray(arguments));this.scene.remove(c);return this},clear:function(){this.scene.remove(d.toArray(this.scene.children));return this},makeLine:function(a,c,f,e){a=new p.Line(a,c,f,e);this.scene.add(a);return a},makeRectangle:function(a,c,f,e){a=new p.Rectangle(a,c,f,e);this.scene.add(a);return a},makeRoundedRectangle:function(a,c,f,e,g){a=new p.RoundedRectangle(a,c,f,e,g);this.scene.add(a);return a},makeCircle:function(a,c,f){a=new p.Circle(a,
c,f);this.scene.add(a);return a},makeEllipse:function(a,c,f,e){a=new p.Ellipse(a,c,f,e);this.scene.add(a);return a},makeStar:function(a,c,f,e,g){a=new p.Star(a,c,f,e,g);this.scene.add(a);return a},makeCurve:function(a){var c=arguments.length,f=a;if(!d.isArray(a))for(var f=[],e=0;e<c;e+=2){var g=arguments[e];if(!d.isNumber(g))break;f.push(new p.Anchor(g,arguments[e+1]))}c=arguments[c-1];f=new p.Path(f,!(d.isBoolean(c)&&c),!0);c=f.getBoundingClientRect();f.center().translation.set(c.left+c.width/2,
c.top+c.height/2);this.scene.add(f);return f},makePolygon:function(a,c,f,e){a=new p.Polygon(a,c,f,e);this.scene.add(a);return a},makeArcSegment:function(a,c,f,e,g,d,n){a=new p.ArcSegment(a,c,f,e,g,d,n);this.scene.add(a);return a},makePath:function(a){var c=arguments.length,f=a;if(!d.isArray(a))for(var f=[],e=0;e<c;e+=2){var g=arguments[e];if(!d.isNumber(g))break;f.push(new p.Anchor(g,arguments[e+1]))}c=arguments[c-1];f=new p.Path(f,!(d.isBoolean(c)&&c));c=f.getBoundingClientRect();f.center().translation.set(c.left+
c.width/2,c.top+c.height/2);this.scene.add(f);return f},makeText:function(a,c,f,e){a=new p.Text(a,c,f,e);this.add(a);return a},makeLinearGradient:function(a,c,f,e){var g=x.call(arguments,4),g=new p.LinearGradient(a,c,f,e,g);this.add(g);return g},makeRadialGradient:function(a,c,f){var e=x.call(arguments,3),e=new p.RadialGradient(a,c,f,e);this.add(e);return e},makeSprite:function(a,c,f,e,g,d,n){a=new p.Sprite(a,c,f,e,g,d);n&&a.play();this.add(a);return a},makeImageSequence:function(a,c,f,e,g){a=new p.ImageSequence(a,
c,f,e);g&&a.play();this.add(a);return a},makeTexture:function(a,c){return new p.Texture(a,c)},makeGroup:function(a){var c=a;c instanceof Array||(c=d.toArray(arguments));var f=new p.Group;this.scene.add(f);f.add(c);return f},interpret:function(a,c){var f=a.tagName.toLowerCase();if(!(f in p.Utils.read))return null;a=p.Utils.read[f].call(this,a);c&&a instanceof p.Group?this.add(a.children):this.add(a);return a},load:function(a,c){var f=[],e;if(/.*\.svg/ig.test(a))return p.Utils.xhr(a,d.bind(function(a){w.temp.innerHTML=
a;for(e=0;e<w.temp.children.length;e++)g=w.temp.children[e],f.push(this.interpret(g));c(1>=f.length?f[0]:f,1>=w.temp.children.length?w.temp.children[0]:w.temp.children)},this)),this;w.temp.innerHTML=a;for(e=0;e<w.temp.children.length;e++){var g=w.temp.children[e];f.push(this.interpret(g))}c(1>=f.length?f[0]:f,1>=w.temp.children.length?w.temp.children[0]:w.temp.children);return this}});var L=w.getRequestAnimationFrame(); true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function(){return p}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):0;return p}(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);(function(c){var k=c.Utils;c=c.Registry=function(){this.map={}};k.extend(c,{});k.extend(c.prototype,{add:function(c,k){this.map[c]=k;return this},remove:function(c){delete this.map[c];return this},get:function(c){return this.map[c]},contains:function(c){return c in this.map}})})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.Utils,m=c.Vector=function(c,a){this.x=c||0;this.y=a||0};k.extend(m,{zero:new c.Vector});k.extend(m.prototype,c.Utils.Events,{set:function(c,a){this.x=c;this.y=a;return this},copy:function(c){this.x=c.x;this.y=c.y;return this},clear:function(){this.y=this.x=0;return this},clone:function(){return new m(this.x,this.y)},add:function(c,a){this.x=c.x+a.x;this.y=c.y+a.y;return this},addSelf:function(c){this.x+=c.x;this.y+=c.y;return this},sub:function(c,a){this.x=c.x-a.x;this.y=c.y-
a.y;return this},subSelf:function(c){this.x-=c.x;this.y-=c.y;return this},multiplySelf:function(c){this.x*=c.x;this.y*=c.y;return this},multiplyScalar:function(c){this.x*=c;this.y*=c;return this},divideScalar:function(c){c?(this.x/=c,this.y/=c):this.set(0,0);return this},negate:function(){return this.multiplyScalar(-1)},dot:function(c){return this.x*c.x+this.y*c.y},lengthSquared:function(){return this.x*this.x+this.y*this.y},length:function(){return Math.sqrt(this.lengthSquared())},normalize:function(){return this.divideScalar(this.length())},
distanceTo:function(c){return Math.sqrt(this.distanceToSquared(c))},distanceToSquared:function(c){var a=this.x-c.x;c=this.y-c.y;return a*a+c*c},setLength:function(c){return this.normalize().multiplyScalar(c)},equals:function(c,a){a="undefined"===typeof a?.0001:a;return this.distanceTo(c)<a},lerp:function(c,a){return this.set((c.x-this.x)*a+this.x,(c.y-this.y)*a+this.y)},isZero:function(c){c="undefined"===typeof c?.0001:c;return this.length()<c},toString:function(){return this.x+", "+this.y},toObject:function(){return{x:this.x,
y:this.y}},rotate:function(c){var a=Math.cos(c);c=Math.sin(c);this.x=this.x*a-this.y*c;this.y=this.x*c+this.y*a;return this}});var l={set:function(e,a){this._x=e;this._y=a;return this.trigger(c.Events.change)},copy:function(e){this._x=e.x;this._y=e.y;return this.trigger(c.Events.change)},clear:function(){this._y=this._x=0;return this.trigger(c.Events.change)},clone:function(){return new m(this._x,this._y)},add:function(e,a){this._x=e.x+a.x;this._y=e.y+a.y;return this.trigger(c.Events.change)},addSelf:function(e){this._x+=
e.x;this._y+=e.y;return this.trigger(c.Events.change)},sub:function(e,a){this._x=e.x-a.x;this._y=e.y-a.y;return this.trigger(c.Events.change)},subSelf:function(e){this._x-=e.x;this._y-=e.y;return this.trigger(c.Events.change)},multiplySelf:function(e){this._x*=e.x;this._y*=e.y;return this.trigger(c.Events.change)},multiplyScalar:function(e){this._x*=e;this._y*=e;return this.trigger(c.Events.change)},divideScalar:function(e){return e?(this._x/=e,this._y/=e,this.trigger(c.Events.change)):this.clear()},
negate:function(){return this.multiplyScalar(-1)},dot:function(c){return this._x*c.x+this._y*c.y},lengthSquared:function(){return this._x*this._x+this._y*this._y},length:function(){return Math.sqrt(this.lengthSquared())},normalize:function(){return this.divideScalar(this.length())},distanceTo:function(c){return Math.sqrt(this.distanceToSquared(c))},distanceToSquared:function(c){var a=this._x-c.x;c=this._y-c.y;return a*a+c*c},setLength:function(c){return this.normalize().multiplyScalar(c)},equals:function(c,
a){a="undefined"===typeof a?.0001:a;return this.distanceTo(c)<a},lerp:function(c,a){return this.set((c.x-this._x)*a+this._x,(c.y-this._y)*a+this._y)},isZero:function(c){c="undefined"===typeof c?.0001:c;return this.length()<c},toString:function(){return this._x+", "+this._y},toObject:function(){return{x:this._x,y:this._y}},rotate:function(c){var a=Math.cos(c);c=Math.sin(c);this._x=this._x*a-this._y*c;this._y=this._x*c+this._y*a;return this}},h={enumerable:!0,get:function(){return this._x},set:function(e){this._x=
e;this.trigger(c.Events.change,"x")}},d={enumerable:!0,get:function(){return this._y},set:function(e){this._y=e;this.trigger(c.Events.change,"y")}};c.Vector.prototype.bind=c.Vector.prototype.on=function(){this._bound||(this._x=this.x,this._y=this.y,Object.defineProperty(this,"x",h),Object.defineProperty(this,"y",d),k.extend(this,l),this._bound=!0);c.Utils.Events.bind.apply(this,arguments);return this}})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.Commands,m=c.Utils,l=c.Anchor=function(d,e,a,g,n,f,t){c.Vector.call(this,d,e);this._broadcast=m.bind(function(){this.trigger(c.Events.change)},this);this._command=t||k.move;this._relative=!0;if(!t)return this;l.AppendCurveProperties(this);m.isNumber(a)&&(this.controls.left.x=a);m.isNumber(g)&&(this.controls.left.y=g);m.isNumber(n)&&(this.controls.right.x=n);m.isNumber(f)&&(this.controls.right.y=f)};m.extend(l,{AppendCurveProperties:function(d){d.controls={left:new c.Vector(0,
0),right:new c.Vector(0,0)}}});var h={listen:function(){m.isObject(this.controls)||l.AppendCurveProperties(this);this.controls.left.bind(c.Events.change,this._broadcast);this.controls.right.bind(c.Events.change,this._broadcast);return this},ignore:function(){this.controls.left.unbind(c.Events.change,this._broadcast);this.controls.right.unbind(c.Events.change,this._broadcast);return this},clone:function(){var d=this.controls,d=new c.Anchor(this.x,this.y,d&&d.left.x,d&&d.left.y,d&&d.right.x,d&&d.right.y,
this.command);d.relative=this._relative;return d},toObject:function(){var c={x:this.x,y:this.y};this._command&&(c.command=this._command);this._relative&&(c.relative=this._relative);this.controls&&(c.controls={left:this.controls.left.toObject(),right:this.controls.right.toObject()});return c},toString:function(){return this.controls?[this._x,this._y,this.controls.left.x,this.controls.left.y,this.controls.right.x,this.controls.right.y].join(", "):[this._x,this._y].join(", ")}};Object.defineProperty(l.prototype,
"command",{enumerable:!0,get:function(){return this._command},set:function(d){this._command=d;this._command!==k.curve||m.isObject(this.controls)||l.AppendCurveProperties(this);return this.trigger(c.Events.change)}});Object.defineProperty(l.prototype,"relative",{enumerable:!0,get:function(){return this._relative},set:function(d){if(this._relative==d)return this;this._relative=!!d;return this.trigger(c.Events.change)}});m.extend(l.prototype,c.Vector.prototype,h);c.Anchor.prototype.bind=c.Anchor.prototype.on=
function(){c.Vector.prototype.bind.apply(this,arguments);m.extend(this,h)};c.Anchor.prototype.unbind=c.Anchor.prototype.off=function(){c.Vector.prototype.unbind.apply(this,arguments);m.extend(this,h)}})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=Math.cos,m=Math.sin,l=Math.tan,h=c.Utils,d=c.Matrix=function(e,a,g,d,f,t){this.elements=new c.Array(9);var n=e;h.isArray(n)||(n=h.toArray(arguments));this.identity().set(n)};h.extend(d,{Identity:[1,0,0,0,1,0,0,0,1],Multiply:function(e,a,g){if(3>=a.length){g=a[0]||0;var d=a[1]||0;a=a[2]||0;return{x:e[0]*g+e[1]*d+e[2]*a,y:e[3]*g+e[4]*d+e[5]*a,z:e[6]*g+e[7]*d+e[8]*a}}var d=e[0],f=e[1],t=e[2],v=e[3],h=e[4],k=e[5],m=e[6],l=e[7];e=e[8];var u=a[0],r=a[1],q=a[2],w=a[3],p=a[4],C=a[5],E=
a[6],H=a[7];a=a[8];g=g||new c.Array(9);g[0]=d*u+f*w+t*E;g[1]=d*r+f*p+t*H;g[2]=d*q+f*C+t*a;g[3]=v*u+h*w+k*E;g[4]=v*r+h*p+k*H;g[5]=v*q+h*C+k*a;g[6]=m*u+l*w+e*E;g[7]=m*r+l*p+e*H;g[8]=m*q+l*C+e*a;return g}});h.extend(d.prototype,c.Utils.Events,{set:function(e){var a=e;h.isArray(a)||(a=h.toArray(arguments));h.extend(this.elements,a);return this.trigger(c.Events.change)},identity:function(){this.set(d.Identity);return this},multiply:function(e,a,g,d,f,t,v,k,m){var n=arguments,B=n.length;if(1>=B)return h.each(this.elements,
function(a,c){this.elements[c]=a*e},this),this.trigger(c.Events.change);if(3>=B)return e=e||0,a=a||0,g=g||0,f=this.elements,{x:f[0]*e+f[1]*a+f[2]*g,y:f[3]*e+f[4]*a+f[5]*g,z:f[6]*e+f[7]*a+f[8]*g};var l=this.elements,B=l[0],z=l[1],q=l[2],w=l[3],p=l[4],C=l[5],E=l[6],H=l[7],l=l[8],G=n[0],F=n[1],I=n[2],O=n[3],N=n[4],P=n[5],M=n[6],L=n[7],n=n[8];this.elements[0]=B*G+z*O+q*M;this.elements[1]=B*F+z*N+q*L;this.elements[2]=B*I+z*P+q*n;this.elements[3]=w*G+p*O+C*M;this.elements[4]=w*F+p*N+C*L;this.elements[5]=
w*I+p*P+C*n;this.elements[6]=E*G+H*O+l*M;this.elements[7]=E*F+H*N+l*L;this.elements[8]=E*I+H*P+l*n;return this.trigger(c.Events.change)},inverse:function(e){var a=this.elements;e=e||new c.Matrix;var g=a[0],d=a[1],f=a[2],t=a[3],v=a[4],h=a[5],k=a[6],l=a[7],a=a[8],m=a*v-h*l,u=-a*t+h*k,r=l*t-v*k,q=g*m+d*u+f*r;if(!q)return null;q=1/q;e.elements[0]=m*q;e.elements[1]=(-a*d+f*l)*q;e.elements[2]=(h*d-f*v)*q;e.elements[3]=u*q;e.elements[4]=(a*g-f*k)*q;e.elements[5]=(-h*g+f*t)*q;e.elements[6]=r*q;e.elements[7]=
(-l*g+d*k)*q;e.elements[8]=(v*g-d*t)*q;return e},scale:function(c,a){1>=arguments.length&&(a=c);return this.multiply(c,0,0,0,a,0,0,0,1)},rotate:function(c){var a=k(c);c=m(c);return this.multiply(a,-c,0,c,a,0,0,0,1)},translate:function(c,a){return this.multiply(1,0,c,0,1,a,0,0,1)},skewX:function(c){c=l(c);return this.multiply(1,c,0,0,1,0,0,0,1)},skewY:function(c){c=l(c);return this.multiply(1,0,0,c,1,0,0,0,1)},toString:function(c){var a=[];this.toArray(c,a);return a.join(" ")},toArray:function(c,a){var g=
this.elements,e=!!a,f=parseFloat(g[0].toFixed(3)),d=parseFloat(g[1].toFixed(3)),v=parseFloat(g[2].toFixed(3)),h=parseFloat(g[3].toFixed(3)),k=parseFloat(g[4].toFixed(3)),l=parseFloat(g[5].toFixed(3));if(c){c=parseFloat(g[6].toFixed(3));var m=parseFloat(g[7].toFixed(3)),g=parseFloat(g[8].toFixed(3));if(e){a[0]=f;a[1]=h;a[2]=c;a[3]=d;a[4]=k;a[5]=m;a[6]=v;a[7]=l;a[8]=g;return}return[f,h,c,d,k,m,v,l,g]}if(e)a[0]=f,a[1]=h,a[2]=d,a[3]=k,a[4]=v,a[5]=l;else return[f,h,d,k,v,l]},clone:function(){var e=this.elements[0];
var a=this.elements[1];var g=this.elements[2];var d=this.elements[3];var f=this.elements[4];return new c.Matrix(e,a,g,d,f,this.elements[5],this.elements[6],this.elements[7],this.elements[8])}})})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.Utils.mod,m=c.Utils.toFixed,l=c.Utils,h={version:1.1,ns:"http://www.w3.org/2000/svg",xlink:"http://www.w3.org/1999/xlink",alignments:{left:"start",center:"middle",right:"end"},createElement:function(c,a){var g=document.createElementNS(h.ns,c);"svg"===c&&(a=l.defaults(a||{},{version:h.version}));l.isEmpty(a)||h.setAttributes(g,a);return g},setAttributes:function(c,a){for(var g=Object.keys(a),e=0;e<g.length;e++)/href/.test(g[e])?c.setAttributeNS(h.xlink,g[e],a[g[e]]):c.setAttribute(g[e],
a[g[e]]);return this},removeAttributes:function(c,a){for(var g in a)c.removeAttribute(g);return this},toString:function(e,a){for(var g=e.length,d=g-1,f,t="",h=0;h<g;h++){var l=e[h],z=a?k(h-1,g):Math.max(h-1,0);a&&k(h+1,g);var A=e[z];var x=m(l._x);var u=m(l._y);switch(l._command){case c.Commands.close:var r=c.Commands.close;break;case c.Commands.curve:var q=A.controls&&A.controls.right||c.Vector.zero;r=l.controls&&l.controls.left||c.Vector.zero;A._relative?(z=m(q.x+A.x),A=m(q.y+A.y)):(z=m(q.x),A=m(q.y));
if(l._relative){q=m(r.x+l.x);var w=m(r.y+l.y)}else q=m(r.x),w=m(r.y);r=(0===h?c.Commands.move:c.Commands.curve)+" "+z+" "+A+" "+q+" "+w+" "+x+" "+u;break;case c.Commands.move:f=l;r=c.Commands.move+" "+x+" "+u;break;default:r=l._command+" "+x+" "+u}h>=d&&a&&(l._command===c.Commands.curve&&(u=f,A=l.controls&&l.controls.right||l,x=u.controls&&u.controls.left||u,l._relative?(z=m(A.x+l.x),A=m(A.y+l.y)):(z=m(A.x),A=m(A.y)),u._relative?(q=m(x.x+u.x),w=m(x.y+u.y)):(q=m(x.x),w=m(x.y)),x=m(u.x),u=m(u.y),r+=
" C "+z+" "+A+" "+q+" "+w+" "+x+" "+u),r+=" Z");t+=r+" "}return t},getClip:function(c){var a=c._renderer.clip;if(!a){for(var g=c;g.parent;)g=g.parent;a=c._renderer.clip=h.createElement("clipPath");g.defs.appendChild(a)}return a},group:{appendChild:function(c){var a=c._renderer.elem;if(a){var g=a.nodeName;!g||/(radial|linear)gradient/i.test(g)||c._clip||this.elem.appendChild(a)}},removeChild:function(c){var a=c._renderer.elem;a&&a.parentNode==this.elem&&a.nodeName&&(c._clip||this.elem.removeChild(a))},
orderChild:function(c){this.elem.appendChild(c._renderer.elem)},renderChild:function(c){h[c._renderer.type].render.call(c,this)},render:function(c){this._update();if(0===this._opacity&&!this._flagOpacity)return this;this._renderer.elem||(this._renderer.elem=h.createElement("g",{id:this.id}),c.appendChild(this._renderer.elem));var a={domElement:c,elem:this._renderer.elem};(this._matrix.manual||this._flagMatrix)&&this._renderer.elem.setAttribute("transform","matrix("+this._matrix.toString()+")");for(var g=
0;g<this.children.length;g++){var e=this.children[g];h[e._renderer.type].render.call(e,c)}this._flagOpacity&&this._renderer.elem.setAttribute("opacity",this._opacity);this._flagAdditions&&this.additions.forEach(h.group.appendChild,a);this._flagSubtractions&&this.subtractions.forEach(h.group.removeChild,a);this._flagOrder&&this.children.forEach(h.group.orderChild,a);this._flagMask&&(this._mask?this._renderer.elem.setAttribute("clip-path","url(#"+this._mask.id+")"):this._renderer.elem.removeAttribute("clip-path"));
return this.flagReset()}},path:{render:function(c){this._update();if(0===this._opacity&&!this._flagOpacity)return this;var a={};if(this._matrix.manual||this._flagMatrix)a.transform="matrix("+this._matrix.toString()+")";if(this._flagVertices){var g=h.toString(this._vertices,this._closed);a.d=g}this._fill&&this._fill._renderer&&(this._fill._update(),h[this._fill._renderer.type].render.call(this._fill,c,!0));this._flagFill&&(a.fill=this._fill&&this._fill.id?"url(#"+this._fill.id+")":this._fill);this._stroke&&
this._stroke._renderer&&(this._stroke._update(),h[this._stroke._renderer.type].render.call(this._stroke,c,!0));this._flagStroke&&(a.stroke=this._stroke&&this._stroke.id?"url(#"+this._stroke.id+")":this._stroke);this._flagLinewidth&&(a["stroke-width"]=this._linewidth);this._flagOpacity&&(a["stroke-opacity"]=this._opacity,a["fill-opacity"]=this._opacity);this._flagVisible&&(a.visibility=this._visible?"visible":"hidden");this._flagCap&&(a["stroke-linecap"]=this._cap);this._flagJoin&&(a["stroke-linejoin"]=
this._join);this._flagMiter&&(a["stroke-miterlimit"]=this._miter);this._renderer.elem?h.setAttributes(this._renderer.elem,a):(a.id=this.id,this._renderer.elem=h.createElement("path",a),c.appendChild(this._renderer.elem));this._flagClip&&(c=h.getClip(this),a=this._renderer.elem,this._clip?(a.removeAttribute("id"),c.setAttribute("id",this.id),c.appendChild(a)):(c.removeAttribute("id"),a.setAttribute("id",this.id),this.parent._renderer.elem.appendChild(a)));return this.flagReset()}},text:{render:function(c){this._update();
var a={};if(this._matrix.manual||this._flagMatrix)a.transform="matrix("+this._matrix.toString()+")";this._flagFamily&&(a["font-family"]=this._family);this._flagSize&&(a["font-size"]=this._size);this._flagLeading&&(a["line-height"]=this._leading);this._flagAlignment&&(a["text-anchor"]=h.alignments[this._alignment]||this._alignment);this._flagBaseline&&(a["alignment-baseline"]=a["dominant-baseline"]=this._baseline);this._flagStyle&&(a["font-style"]=this._style);this._flagWeight&&(a["font-weight"]=this._weight);
this._flagDecoration&&(a["text-decoration"]=this._decoration);this._fill&&this._fill._renderer&&(this._fill._update(),h[this._fill._renderer.type].render.call(this._fill,c,!0));this._flagFill&&(a.fill=this._fill&&this._fill.id?"url(#"+this._fill.id+")":this._fill);this._stroke&&this._stroke._renderer&&(this._stroke._update(),h[this._stroke._renderer.type].render.call(this._stroke,c,!0));this._flagStroke&&(a.stroke=this._stroke&&this._stroke.id?"url(#"+this._stroke.id+")":this._stroke);this._flagLinewidth&&
(a["stroke-width"]=this._linewidth);this._flagOpacity&&(a.opacity=this._opacity);this._flagVisible&&(a.visibility=this._visible?"visible":"hidden");this._renderer.elem?h.setAttributes(this._renderer.elem,a):(a.id=this.id,this._renderer.elem=h.createElement("text",a),c.defs.appendChild(this._renderer.elem));this._flagClip&&(c=h.getClip(this),a=this._renderer.elem,this._clip?(a.removeAttribute("id"),c.setAttribute("id",this.id),c.appendChild(a)):(c.removeAttribute("id"),a.setAttribute("id",this.id),
this.parent._renderer.elem.appendChild(a)));this._flagValue&&(this._renderer.elem.textContent=this._value);return this.flagReset()}},"linear-gradient":{render:function(c,a){a||this._update();a={};this._flagEndPoints&&(a.x1=this.left._x,a.y1=this.left._y,a.x2=this.right._x,a.y2=this.right._y);this._flagSpread&&(a.spreadMethod=this._spread);this._renderer.elem?h.setAttributes(this._renderer.elem,a):(a.id=this.id,a.gradientUnits="userSpaceOnUse",this._renderer.elem=h.createElement("linearGradient",a),
c.defs.appendChild(this._renderer.elem));if(this._flagStops){if(c=this._renderer.elem.childNodes.length!==this.stops.length)this._renderer.elem.childNodes.length=0;for(a=0;a<this.stops.length;a++){var g=this.stops[a],d={};g._flagOffset&&(d.offset=100*g._offset+"%");g._flagColor&&(d["stop-color"]=g._color);g._flagOpacity&&(d["stop-opacity"]=g._opacity);g._renderer.elem?h.setAttributes(g._renderer.elem,d):g._renderer.elem=h.createElement("stop",d);c&&this._renderer.elem.appendChild(g._renderer.elem);
g.flagReset()}}return this.flagReset()}},"radial-gradient":{render:function(c,a){a||this._update();a={};this._flagCenter&&(a.cx=this.center._x,a.cy=this.center._y);this._flagFocal&&(a.fx=this.focal._x,a.fy=this.focal._y);this._flagRadius&&(a.r=this._radius);this._flagSpread&&(a.spreadMethod=this._spread);this._renderer.elem?h.setAttributes(this._renderer.elem,a):(a.id=this.id,a.gradientUnits="userSpaceOnUse",this._renderer.elem=h.createElement("radialGradient",a),c.defs.appendChild(this._renderer.elem));
if(this._flagStops){if(c=this._renderer.elem.childNodes.length!==this.stops.length)this._renderer.elem.childNodes.length=0;for(a=0;a<this.stops.length;a++){var g=this.stops[a],d={};g._flagOffset&&(d.offset=100*g._offset+"%");g._flagColor&&(d["stop-color"]=g._color);g._flagOpacity&&(d["stop-opacity"]=g._opacity);g._renderer.elem?h.setAttributes(g._renderer.elem,d):g._renderer.elem=h.createElement("stop",d);c&&this._renderer.elem.appendChild(g._renderer.elem);g.flagReset()}}return this.flagReset()}},
texture:{render:function(d,a){a||this._update();a={};var g={x:0,y:0},e=this.image;if(this._flagLoaded&&this.loaded)switch(e.nodeName.toLowerCase()){case "canvas":g.href=g["xlink:href"]=e.toDataURL("image/png");break;case "img":case "image":g.href=g["xlink:href"]=this.src}if(this._flagOffset||this._flagLoaded||this._flagScale)a.x=this._offset.x,a.y=this._offset.y,e&&(a.x-=e.width/2,a.y-=e.height/2,this._scale instanceof c.Vector?(a.x*=this._scale.x,a.y*=this._scale.y):(a.x*=this._scale,a.y*=this._scale)),
0<a.x&&(a.x*=-1),0<a.y&&(a.y*=-1);if(this._flagScale||this._flagLoaded||this._flagRepeat)if(a.width=0,a.height=0,e){g.width=a.width=e.width;g.height=a.height=e.height;switch(this._repeat){case "no-repeat":a.width+=1,a.height+=1}this._scale instanceof c.Vector?(a.width*=this._scale.x,a.height*=this._scale.y):(a.width*=this._scale,a.height*=this._scale)}if(this._flagScale||this._flagLoaded)this._renderer.image?l.isEmpty(g)||h.setAttributes(this._renderer.image,g):this._renderer.image=h.createElement("image",
g);this._renderer.elem?l.isEmpty(a)||h.setAttributes(this._renderer.elem,a):(a.id=this.id,a.patternUnits="userSpaceOnUse",this._renderer.elem=h.createElement("pattern",a),d.defs.appendChild(this._renderer.elem));this._renderer.elem&&this._renderer.image&&!this._renderer.appended&&(this._renderer.elem.appendChild(this._renderer.image),this._renderer.appended=!0);return this.flagReset()}}},d=c[c.Types.svg]=function(d){this.domElement=d.domElement||h.createElement("svg");this.scene=new c.Group;this.scene.parent=
this;this.defs=h.createElement("defs");this.domElement.appendChild(this.defs);this.domElement.defs=this.defs;this.domElement.style.overflow="hidden"};l.extend(d,{Utils:h});l.extend(d.prototype,c.Utils.Events,{setSize:function(c,a){this.width=c;this.height=a;h.setAttributes(this.domElement,{width:c,height:a});return this},render:function(){h.group.render.call(this.scene,this.domElement);return this}})})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.Utils.mod,m=c.Utils.toFixed,l=c.Utils.getRatio,h=c.Utils,d=function(a){return 1==a[0]&&0==a[3]&&0==a[1]&&1==a[4]&&0==a[2]&&0==a[5]},e={isHidden:/(none|transparent)/i,alignments:{left:"start",middle:"center",right:"end"},shim:function(a){a.tagName="canvas";a.nodeType=1;return a},group:{renderChild:function(a){e[a._renderer.type].render.call(a,this.ctx,!0,this.clip)},render:function(a){this._update();var c=this._matrix.elements,f=this.parent;this._renderer.opacity=this._opacity*
(f&&f._renderer?f._renderer.opacity:1);var f=d(c),g=this._mask;this._renderer.context||(this._renderer.context={});this._renderer.context.ctx=a;f||(a.save(),a.transform(c[0],c[3],c[1],c[4],c[2],c[5]));g&&e[g._renderer.type].render.call(g,a,!0);if(0<this.opacity&&0!==this.scale)for(c=0;c<this.children.length;c++)g=this.children[c],e[g._renderer.type].render.call(g,a);f||a.restore();return this.flagReset()}},path:{render:function(a,n,f){this._update();var g=this._matrix.elements;var v=this._stroke;
var l=this._linewidth;var z=this._fill;var A=this._opacity*this.parent._renderer.opacity;var x=this._visible;var u=this._cap;var r=this._join;var q=this._miter;var w=this._closed;var p=this._vertices;var C=p.length;var E=C-1;var H=d(g);var G=this._clip;if(!n&&(!x||G))return this;H||(a.save(),a.transform(g[0],g[3],g[1],g[4],g[2],g[5]));z&&(h.isString(z)?a.fillStyle=z:(e[z._renderer.type].render.call(z,a),a.fillStyle=z._renderer.effect));v&&(h.isString(v)?a.strokeStyle=v:(e[v._renderer.type].render.call(v,
a),a.strokeStyle=v._renderer.effect));l&&(a.lineWidth=l);q&&(a.miterLimit=q);r&&(a.lineJoin=r);u&&(a.lineCap=u);h.isNumber(A)&&(a.globalAlpha=A);a.beginPath();for(g=0;g<p.length;g++)switch(n=p[g],x=m(n._x),u=m(n._y),n._command){case c.Commands.close:a.closePath();break;case c.Commands.curve:A=w?k(g-1,C):Math.max(g-1,0);w&&k(g+1,C);r=p[A];q=r.controls&&r.controls.right||c.Vector.zero;var F=n.controls&&n.controls.left||c.Vector.zero;r._relative?(A=q.x+m(r._x),q=q.y+m(r._y)):(A=m(q.x),q=m(q.y));n._relative?
(r=F.x+m(n._x),F=F.y+m(n._y)):(r=m(F.x),F=m(F.y));a.bezierCurveTo(A,q,r,F,x,u);g>=E&&w&&(u=I,r=n.controls&&n.controls.right||c.Vector.zero,x=u.controls&&u.controls.left||c.Vector.zero,n._relative?(A=r.x+m(n._x),q=r.y+m(n._y)):(A=m(r.x),q=m(r.y)),u._relative?(r=x.x+m(u._x),F=x.y+m(u._y)):(r=m(x.x),F=m(x.y)),x=m(u._x),u=m(u._y),a.bezierCurveTo(A,q,r,F,x,u));break;case c.Commands.line:a.lineTo(x,u);break;case c.Commands.move:var I=n;a.moveTo(x,u)}w&&a.closePath();if(!G&&!f){if(!e.isHidden.test(z)){if(w=
z._renderer&&z._renderer.offset)a.save(),a.translate(-z._renderer.offset.x,-z._renderer.offset.y),a.scale(z._renderer.scale.x,z._renderer.scale.y);a.fill();w&&a.restore()}if(!e.isHidden.test(v)){if(w=v._renderer&&v._renderer.offset)a.save(),a.translate(-v._renderer.offset.x,-v._renderer.offset.y),a.scale(v._renderer.scale.x,v._renderer.scale.y),a.lineWidth=l/v._renderer.scale.x;a.stroke();w&&a.restore()}}H||a.restore();G&&!f&&a.clip();return this.flagReset()}},text:{render:function(a,c,f){this._update();
var g=this._matrix.elements,n=this._stroke,k=this._linewidth,l=this._fill,A=this._opacity*this.parent._renderer.opacity,x=this._visible,u=d(g),r=l._renderer&&l._renderer.offset&&n._renderer&&n._renderer.offset,q=this._clip;if(!c&&(!x||q))return this;u||(a.save(),a.transform(g[0],g[3],g[1],g[4],g[2],g[5]));r||(a.font=[this._style,this._weight,this._size+"px/"+this._leading+"px",this._family].join(" "));a.textAlign=e.alignments[this._alignment]||this._alignment;a.textBaseline=this._baseline;l&&(h.isString(l)?
a.fillStyle=l:(e[l._renderer.type].render.call(l,a),a.fillStyle=l._renderer.effect));n&&(h.isString(n)?a.strokeStyle=n:(e[n._renderer.type].render.call(n,a),a.strokeStyle=n._renderer.effect));k&&(a.lineWidth=k);h.isNumber(A)&&(a.globalAlpha=A);q||f||(e.isHidden.test(l)||(l._renderer&&l._renderer.offset?(c=m(l._renderer.scale.x),g=m(l._renderer.scale.y),a.save(),a.translate(-m(l._renderer.offset.x),-m(l._renderer.offset.y)),a.scale(c,g),c=this._size/l._renderer.scale.y,g=this._leading/l._renderer.scale.y,
a.font=[this._style,this._weight,m(c)+"px/",m(g)+"px",this._family].join(" "),c=l._renderer.offset.x/l._renderer.scale.x,l=l._renderer.offset.y/l._renderer.scale.y,a.fillText(this.value,m(c),m(l)),a.restore()):a.fillText(this.value,0,0)),e.isHidden.test(n)||(n._renderer&&n._renderer.offset?(c=m(n._renderer.scale.x),g=m(n._renderer.scale.y),a.save(),a.translate(-m(n._renderer.offset.x),-m(n._renderer.offset.y)),a.scale(c,g),c=this._size/n._renderer.scale.y,g=this._leading/n._renderer.scale.y,a.font=
[this._style,this._weight,m(c)+"px/",m(g)+"px",this._family].join(" "),c=n._renderer.offset.x/n._renderer.scale.x,l=n._renderer.offset.y/n._renderer.scale.y,n=k/n._renderer.scale.x,a.lineWidth=m(n),a.strokeText(this.value,m(c),m(l)),a.restore()):a.strokeText(this.value,0,0)));u||a.restore();q&&!f&&a.clip();return this.flagReset()}},"linear-gradient":{render:function(a){this._update();if(!this._renderer.effect||this._flagEndPoints||this._flagStops)for(this._renderer.effect=a.createLinearGradient(this.left._x,
this.left._y,this.right._x,this.right._y),a=0;a<this.stops.length;a++){var c=this.stops[a];this._renderer.effect.addColorStop(c._offset,c._color)}return this.flagReset()}},"radial-gradient":{render:function(a){this._update();if(!this._renderer.effect||this._flagCenter||this._flagFocal||this._flagRadius||this._flagStops)for(this._renderer.effect=a.createRadialGradient(this.center._x,this.center._y,0,this.focal._x,this.focal._y,this._radius),a=0;a<this.stops.length;a++){var c=this.stops[a];this._renderer.effect.addColorStop(c._offset,
c._color)}return this.flagReset()}},texture:{render:function(a){this._update();var d=this.image;if(!this._renderer.effect||(this._flagLoaded||this._flagImage||this._flagVideo||this._flagRepeat)&&this.loaded)this._renderer.effect=a.createPattern(this.image,this._repeat);if(this._flagOffset||this._flagLoaded||this._flagScale)this._renderer.offset instanceof c.Vector||(this._renderer.offset=new c.Vector),this._renderer.offset.x=-this._offset.x,this._renderer.offset.y=-this._offset.y,d&&(this._renderer.offset.x+=
d.width/2,this._renderer.offset.y+=d.height/2,this._scale instanceof c.Vector?(this._renderer.offset.x*=this._scale.x,this._renderer.offset.y*=this._scale.y):(this._renderer.offset.x*=this._scale,this._renderer.offset.y*=this._scale));if(this._flagScale||this._flagLoaded)this._renderer.scale instanceof c.Vector||(this._renderer.scale=new c.Vector),this._scale instanceof c.Vector?this._renderer.scale.copy(this._scale):this._renderer.scale.set(this._scale,this._scale);return this.flagReset()}}},a=c[c.Types.canvas]=
function(a){var d=!1!==a.smoothing;this.domElement=a.domElement||document.createElement("canvas");this.ctx=this.domElement.getContext("2d");this.overdraw=a.overdraw||!1;h.isUndefined(this.ctx.imageSmoothingEnabled)||(this.ctx.imageSmoothingEnabled=d);this.scene=new c.Group;this.scene.parent=this};h.extend(a,{Utils:e});h.extend(a.prototype,c.Utils.Events,{setSize:function(a,c,f){this.width=a;this.height=c;this.ratio=h.isUndefined(f)?l(this.ctx):f;this.domElement.width=a*this.ratio;this.domElement.height=
c*this.ratio;this.domElement.style&&h.extend(this.domElement.style,{width:a+"px",height:c+"px"});return this},render:function(){var a=1===this.ratio;a||(this.ctx.save(),this.ctx.scale(this.ratio,this.ratio));this.overdraw||this.ctx.clearRect(0,0,this.width,this.height);e.group.render.call(this.scene,this.ctx);a||this.ctx.restore();return this}})})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.root,m=c.Matrix.Multiply,l=c.Utils.mod,h=[1,0,0,0,1,0,0,0,1],d=new c.Array(9),e=c.Utils.getRatio,a=c.Utils.toFixed,g=c.Utils,n={isHidden:/(none|transparent)/i,canvas:k.document?k.document.createElement("canvas"):{getContext:g.identity},alignments:{left:"start",middle:"center",right:"end"},matrix:new c.Matrix,uv:new c.Array([0,0,1,0,0,1,0,1,1,0,1,1]),group:{removeChild:function(a,c){if(a.children)for(var f=0;f<a.children.length;f++)n.group.removeChild(a.children[f],c);else c.deleteTexture(a._renderer.texture),
delete a._renderer.texture},renderChild:function(a){n[a._renderer.type].render.call(a,this.gl,this.program)},render:function(a,g){this._update();var f=this.parent,e=f._matrix&&f._matrix.manual||f._flagMatrix,h=this._matrix.manual||this._flagMatrix;if(e||h)this._renderer.matrix||(this._renderer.matrix=new c.Array(9)),this._matrix.toArray(!0,d),m(d,f._renderer.matrix,this._renderer.matrix),this._renderer.scale=this._scale*f._renderer.scale,e&&(this._flagMatrix=!0);this._mask&&(a.enable(a.STENCIL_TEST),
a.stencilFunc(a.ALWAYS,1,1),a.colorMask(!1,!1,!1,!0),a.stencilOp(a.KEEP,a.KEEP,a.INCR),n[this._mask._renderer.type].render.call(this._mask,a,g,this),a.colorMask(!0,!0,!0,!0),a.stencilFunc(a.NOTEQUAL,0,1),a.stencilOp(a.KEEP,a.KEEP,a.KEEP));this._flagOpacity=f._flagOpacity||this._flagOpacity;this._renderer.opacity=this._opacity*(f&&f._renderer?f._renderer.opacity:1);if(this._flagSubtractions)for(f=0;f<this.subtractions.length;f++)n.group.removeChild(this.subtractions[f],a);this.children.forEach(n.group.renderChild,
{gl:a,program:g});this._mask&&(a.colorMask(!1,!1,!1,!1),a.stencilOp(a.KEEP,a.KEEP,a.DECR),n[this._mask._renderer.type].render.call(this._mask,a,g,this),a.colorMask(!0,!0,!0,!0),a.stencilFunc(a.NOTEQUAL,0,1),a.stencilOp(a.KEEP,a.KEEP,a.KEEP),a.disable(a.STENCIL_TEST));return this.flagReset()}},path:{updateCanvas:function(f){var d=f._vertices;var e=this.canvas;var h=this.ctx;var k=f._renderer.scale;var m=f._stroke,x=f._linewidth,u=f._fill;var r=f._renderer.opacity||f._opacity;var q=f._cap;var w=f._join;
var p=f._miter;var C=f._closed,E=d.length,H=E-1;e.width=Math.max(Math.ceil(f._renderer.rect.width*k),1);e.height=Math.max(Math.ceil(f._renderer.rect.height*k),1);var G=f._renderer.rect.centroid,F=G.x,G=G.y;h.clearRect(0,0,e.width,e.height);u&&(g.isString(u)?h.fillStyle=u:(n[u._renderer.type].render.call(u,h,f),h.fillStyle=u._renderer.effect));m&&(g.isString(m)?h.strokeStyle=m:(n[m._renderer.type].render.call(m,h,f),h.strokeStyle=m._renderer.effect));x&&(h.lineWidth=x);p&&(h.miterLimit=p);w&&(h.lineJoin=
w);q&&(h.lineCap=q);g.isNumber(r)&&(h.globalAlpha=r);h.save();h.scale(k,k);h.translate(F,G);h.beginPath();for(f=0;f<d.length;f++)switch(b=d[f],k=a(b._x),r=a(b._y),b._command){case c.Commands.close:h.closePath();break;case c.Commands.curve:e=C?l(f-1,E):Math.max(f-1,0);C&&l(f+1,E);q=d[e];w=q.controls&&q.controls.right||c.Vector.zero;p=b.controls&&b.controls.left||c.Vector.zero;q._relative?(e=a(w.x+q._x),w=a(w.y+q._y)):(e=a(w.x),w=a(w.y));b._relative?(q=a(p.x+b._x),p=a(p.y+b._y)):(q=a(p.x),p=a(p.y));
h.bezierCurveTo(e,w,q,p,k,r);f>=H&&C&&(r=I,q=b.controls&&b.controls.right||c.Vector.zero,k=r.controls&&r.controls.left||c.Vector.zero,b._relative?(e=a(q.x+b._x),w=a(q.y+b._y)):(e=a(q.x),w=a(q.y)),r._relative?(q=a(k.x+r._x),p=a(k.y+r._y)):(q=a(k.x),p=a(k.y)),k=a(r._x),r=a(r._y),h.bezierCurveTo(e,w,q,p,k,r));break;case c.Commands.line:h.lineTo(k,r);break;case c.Commands.move:var I=b;h.moveTo(k,r)}C&&h.closePath();if(!n.isHidden.test(u)){if(d=u._renderer&&u._renderer.offset)h.save(),h.translate(-u._renderer.offset.x,
-u._renderer.offset.y),h.scale(u._renderer.scale.x,u._renderer.scale.y);h.fill();d&&h.restore()}if(!n.isHidden.test(m)){if(d=m._renderer&&m._renderer.offset)h.save(),h.translate(-m._renderer.offset.x,-m._renderer.offset.y),h.scale(m._renderer.scale.x,m._renderer.scale.y),h.lineWidth=x/m._renderer.scale.x;h.stroke();d&&h.restore()}h.restore()},getBoundingClientRect:function(a,c,d){var f=Infinity,e=-Infinity,n=Infinity,h=-Infinity;a.forEach(function(a){var c=a.x,d=a.y,g=a.controls;n=Math.min(d,n);f=
Math.min(c,f);e=Math.max(c,e);h=Math.max(d,h);if(a.controls){var k=g.left;var t=g.right;k&&t&&(g=a._relative?k.x+c:k.x,k=a._relative?k.y+d:k.y,c=a._relative?t.x+c:t.x,a=a._relative?t.y+d:t.y,g&&k&&c&&a&&(n=Math.min(k,a,n),f=Math.min(g,c,f),e=Math.max(g,c,e),h=Math.max(k,a,h)))}});g.isNumber(c)&&(n-=c,f-=c,e+=c,h+=c);d.top=n;d.left=f;d.right=e;d.bottom=h;d.width=e-f;d.height=h-n;d.centroid||(d.centroid={});d.centroid.x=-f;d.centroid.y=-n},render:function(a,g,e){if(!this._visible||!this._opacity)return this;
this._update();var f=this.parent,h=this._matrix.manual||this._flagMatrix,k=this._flagVertices||this._flagFill||this._fill instanceof c.LinearGradient&&(this._fill._flagSpread||this._fill._flagStops||this._fill._flagEndPoints)||this._fill instanceof c.RadialGradient&&(this._fill._flagSpread||this._fill._flagStops||this._fill._flagRadius||this._fill._flagCenter||this._fill._flagFocal)||this._fill instanceof c.Texture&&(this._fill._flagLoaded&&this._fill.loaded||this._fill._flagOffset||this._fill._flagScale)||
this._stroke instanceof c.LinearGradient&&(this._stroke._flagSpread||this._stroke._flagStops||this._stroke._flagEndPoints)||this._stroke instanceof c.RadialGradient&&(this._stroke._flagSpread||this._stroke._flagStops||this._stroke._flagRadius||this._stroke._flagCenter||this._stroke._flagFocal)||this._stroke instanceof c.Texture&&(this._stroke._flagLoaded&&this._stroke.loaded||this._stroke._flagOffset||this._fill._flagScale)||this._flagStroke||this._flagLinewidth||this._flagOpacity||f._flagOpacity||
this._flagVisible||this._flagCap||this._flagJoin||this._flagMiter||this._flagScale||!this._renderer.texture;if(f._matrix.manual||f._flagMatrix||h)this._renderer.matrix||(this._renderer.matrix=new c.Array(9)),this._matrix.toArray(!0,d),m(d,f._renderer.matrix,this._renderer.matrix),this._renderer.scale=this._scale*f._renderer.scale;k&&(this._renderer.rect||(this._renderer.rect={}),this._renderer.triangles||(this._renderer.triangles=new c.Array(12)),this._renderer.opacity=this._opacity*f._renderer.opacity,
n.path.getBoundingClientRect(this._vertices,this._linewidth,this._renderer.rect),n.getTriangles(this._renderer.rect,this._renderer.triangles),n.updateBuffer.call(n,a,this,g),n.updateTexture.call(n,a,this));if(!this._clip||e)return a.bindBuffer(a.ARRAY_BUFFER,this._renderer.textureCoordsBuffer),a.vertexAttribPointer(g.textureCoords,2,a.FLOAT,!1,0,0),a.bindTexture(a.TEXTURE_2D,this._renderer.texture),a.uniformMatrix3fv(g.matrix,!1,this._renderer.matrix),a.bindBuffer(a.ARRAY_BUFFER,this._renderer.buffer),
a.vertexAttribPointer(g.position,2,a.FLOAT,!1,0,0),a.drawArrays(a.TRIANGLES,0,6),this.flagReset()}},text:{updateCanvas:function(c){var f=this.canvas,d=this.ctx,e=c._renderer.scale,h=c._stroke,k=c._linewidth*e,l=c._fill,m=c._renderer.opacity||c._opacity;f.width=Math.max(Math.ceil(c._renderer.rect.width*e),1);f.height=Math.max(Math.ceil(c._renderer.rect.height*e),1);var r=c._renderer.rect.centroid,q=r.x,r=r.y,w=l._renderer&&l._renderer.offset&&h._renderer&&h._renderer.offset;d.clearRect(0,0,f.width,
f.height);w||(d.font=[c._style,c._weight,c._size+"px/"+c._leading+"px",c._family].join(" "));d.textAlign="center";d.textBaseline="middle";l&&(g.isString(l)?d.fillStyle=l:(n[l._renderer.type].render.call(l,d,c),d.fillStyle=l._renderer.effect));h&&(g.isString(h)?d.strokeStyle=h:(n[h._renderer.type].render.call(h,d,c),d.strokeStyle=h._renderer.effect));k&&(d.lineWidth=k);g.isNumber(m)&&(d.globalAlpha=m);d.save();d.scale(e,e);d.translate(q,r);n.isHidden.test(l)||(l._renderer&&l._renderer.offset?(f=a(l._renderer.scale.x),
e=a(l._renderer.scale.y),d.save(),d.translate(-a(l._renderer.offset.x),-a(l._renderer.offset.y)),d.scale(f,e),f=c._size/l._renderer.scale.y,e=c._leading/l._renderer.scale.y,d.font=[c._style,c._weight,a(f)+"px/",a(e)+"px",c._family].join(" "),f=l._renderer.offset.x/l._renderer.scale.x,l=l._renderer.offset.y/l._renderer.scale.y,d.fillText(c.value,a(f),a(l)),d.restore()):d.fillText(c.value,0,0));n.isHidden.test(h)||(h._renderer&&h._renderer.offset?(f=a(h._renderer.scale.x),e=a(h._renderer.scale.y),d.save(),
d.translate(-a(h._renderer.offset.x),-a(h._renderer.offset.y)),d.scale(f,e),f=c._size/h._renderer.scale.y,e=c._leading/h._renderer.scale.y,d.font=[c._style,c._weight,a(f)+"px/",a(e)+"px",c._family].join(" "),f=h._renderer.offset.x/h._renderer.scale.x,l=h._renderer.offset.y/h._renderer.scale.y,h=k/h._renderer.scale.x,d.lineWidth=a(h),d.strokeText(c.value,a(f),a(l)),d.restore()):d.strokeText(c.value,0,0));d.restore()},getBoundingClientRect:function(a,c){var f=n.ctx;f.font=[a._style,a._weight,a._size+
"px/"+a._leading+"px",a._family].join(" ");f.textAlign="center";f.textBaseline=a._baseline;var f=f.measureText(a._value).width,d=Math.max(a._size||a._leading);this._linewidth&&!n.isHidden.test(this._stroke)&&(d+=this._linewidth);var e=f/2,g=d/2;switch(n.alignments[a._alignment]||a._alignment){case n.alignments.left:c.left=0;c.right=f;break;case n.alignments.right:c.left=-f;c.right=0;break;default:c.left=-e,c.right=e}switch(a._baseline){case "bottom":c.top=-d;c.bottom=0;break;case "top":c.top=0;c.bottom=
d;break;default:c.top=-g,c.bottom=g}c.width=f;c.height=d;c.centroid||(c.centroid={});c.centroid.x=e;c.centroid.y=g},render:function(a,e,g){if(!this._visible||!this._opacity)return this;this._update();var f=this.parent,h=this._matrix.manual||this._flagMatrix,k=this._flagVertices||this._flagFill||this._fill instanceof c.LinearGradient&&(this._fill._flagSpread||this._fill._flagStops||this._fill._flagEndPoints)||this._fill instanceof c.RadialGradient&&(this._fill._flagSpread||this._fill._flagStops||this._fill._flagRadius||
this._fill._flagCenter||this._fill._flagFocal)||this._fill instanceof c.Texture&&this._fill._flagLoaded&&this._fill.loaded||this._stroke instanceof c.LinearGradient&&(this._stroke._flagSpread||this._stroke._flagStops||this._stroke._flagEndPoints)||this._stroke instanceof c.RadialGradient&&(this._stroke._flagSpread||this._stroke._flagStops||this._stroke._flagRadius||this._stroke._flagCenter||this._stroke._flagFocal)||this._texture instanceof c.Texture&&this._texture._flagLoaded&&this._texture.loaded||
this._flagStroke||this._flagLinewidth||this._flagOpacity||f._flagOpacity||this._flagVisible||this._flagScale||this._flagValue||this._flagFamily||this._flagSize||this._flagLeading||this._flagAlignment||this._flagBaseline||this._flagStyle||this._flagWeight||this._flagDecoration||!this._renderer.texture;if(f._matrix.manual||f._flagMatrix||h)this._renderer.matrix||(this._renderer.matrix=new c.Array(9)),this._matrix.toArray(!0,d),m(d,f._renderer.matrix,this._renderer.matrix),this._renderer.scale=this._scale*
f._renderer.scale;k&&(this._renderer.rect||(this._renderer.rect={}),this._renderer.triangles||(this._renderer.triangles=new c.Array(12)),this._renderer.opacity=this._opacity*f._renderer.opacity,n.text.getBoundingClientRect(this,this._renderer.rect),n.getTriangles(this._renderer.rect,this._renderer.triangles),n.updateBuffer.call(n,a,this,e),n.updateTexture.call(n,a,this));if(!this._clip||g)return a.bindBuffer(a.ARRAY_BUFFER,this._renderer.textureCoordsBuffer),a.vertexAttribPointer(e.textureCoords,
2,a.FLOAT,!1,0,0),a.bindTexture(a.TEXTURE_2D,this._renderer.texture),a.uniformMatrix3fv(e.matrix,!1,this._renderer.matrix),a.bindBuffer(a.ARRAY_BUFFER,this._renderer.buffer),a.vertexAttribPointer(e.position,2,a.FLOAT,!1,0,0),a.drawArrays(a.TRIANGLES,0,6),this.flagReset()}},"linear-gradient":{render:function(a,c){if(a.canvas.getContext("2d")){this._update();if(!this._renderer.effect||this._flagEndPoints||this._flagStops)for(this._renderer.effect=a.createLinearGradient(this.left._x,this.left._y,this.right._x,
this.right._y),a=0;a<this.stops.length;a++)c=this.stops[a],this._renderer.effect.addColorStop(c._offset,c._color);return this.flagReset()}}},"radial-gradient":{render:function(a,c){if(a.canvas.getContext("2d")){this._update();if(!this._renderer.effect||this._flagCenter||this._flagFocal||this._flagRadius||this._flagStops)for(this._renderer.effect=a.createRadialGradient(this.center._x,this.center._y,0,this.focal._x,this.focal._y,this._radius),a=0;a<this.stops.length;a++)c=this.stops[a],this._renderer.effect.addColorStop(c._offset,
c._color);return this.flagReset()}}},texture:{render:function(a,d){if(a.canvas.getContext("2d")){this._update();d=this.image;if(!this._renderer.effect||(this._flagLoaded||this._flagRepeat)&&this.loaded)this._renderer.effect=a.createPattern(d,this._repeat);if(this._flagOffset||this._flagLoaded||this._flagScale)this._renderer.offset instanceof c.Vector||(this._renderer.offset=new c.Vector),this._renderer.offset.x=this._offset.x,this._renderer.offset.y=this._offset.y,d&&(this._renderer.offset.x-=d.width/
2,this._renderer.offset.y+=d.height/2,this._scale instanceof c.Vector?(this._renderer.offset.x*=this._scale.x,this._renderer.offset.y*=this._scale.y):(this._renderer.offset.x*=this._scale,this._renderer.offset.y*=this._scale));if(this._flagScale||this._flagLoaded)this._renderer.scale instanceof c.Vector||(this._renderer.scale=new c.Vector),this._scale instanceof c.Vector?this._renderer.scale.copy(this._scale):this._renderer.scale.set(this._scale,this._scale);return this.flagReset()}}},getTriangles:function(a,
c){var f=a.top,d=a.left,e=a.right;a=a.bottom;c[0]=d;c[1]=f;c[2]=e;c[3]=f;c[4]=d;c[5]=a;c[6]=d;c[7]=a;c[8]=e;c[9]=f;c[10]=e;c[11]=a},updateTexture:function(a,c){this[c._renderer.type].updateCanvas.call(n,c);c._renderer.texture&&a.deleteTexture(c._renderer.texture);a.bindBuffer(a.ARRAY_BUFFER,c._renderer.textureCoordsBuffer);c._renderer.texture=a.createTexture();a.bindTexture(a.TEXTURE_2D,c._renderer.texture);a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE);a.texParameteri(a.TEXTURE_2D,
a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE);a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR);0>=this.canvas.width||0>=this.canvas.height||a.texImage2D(a.TEXTURE_2D,0,a.RGBA,a.RGBA,a.UNSIGNED_BYTE,this.canvas)},updateBuffer:function(a,c,d){g.isObject(c._renderer.buffer)&&a.deleteBuffer(c._renderer.buffer);c._renderer.buffer=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,c._renderer.buffer);a.enableVertexAttribArray(d.position);a.bufferData(a.ARRAY_BUFFER,c._renderer.triangles,a.STATIC_DRAW);g.isObject(c._renderer.textureCoordsBuffer)&&
a.deleteBuffer(c._renderer.textureCoordsBuffer);c._renderer.textureCoordsBuffer=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,c._renderer.textureCoordsBuffer);a.enableVertexAttribArray(d.textureCoords);a.bufferData(a.ARRAY_BUFFER,this.uv,a.STATIC_DRAW)},program:{create:function(a,d){var f=a.createProgram();g.each(d,function(c){a.attachShader(f,c)});a.linkProgram(f);if(!a.getProgramParameter(f,a.LINK_STATUS))throw d=a.getProgramInfoLog(f),a.deleteProgram(f),new c.Utils.Error("unable to link program: "+
d);return f}},shaders:{create:function(a,d,e){e=a.createShader(a[e]);a.shaderSource(e,d);a.compileShader(e);if(!a.getShaderParameter(e,a.COMPILE_STATUS))throw d=a.getShaderInfoLog(e),a.deleteShader(e),new c.Utils.Error("unable to compile shader "+e+": "+d);return e},types:{vertex:"VERTEX_SHADER",fragment:"FRAGMENT_SHADER"},vertex:"attribute vec2 a_position;\nattribute vec2 a_textureCoords;\n\nuniform mat3 u_matrix;\nuniform vec2 u_resolution;\n\nvarying vec2 v_textureCoords;\n\nvoid main() {\n   vec2 projected \x3d (u_matrix * vec3(a_position, 1.0)).xy;\n   vec2 normal \x3d projected / u_resolution;\n   vec2 clipspace \x3d (normal * 2.0) - 1.0;\n\n   gl_Position \x3d vec4(clipspace * vec2(1.0, -1.0), 0.0, 1.0);\n   v_textureCoords \x3d a_textureCoords;\n}",
fragment:"precision mediump float;\n\nuniform sampler2D u_image;\nvarying vec2 v_textureCoords;\n\nvoid main() {\n  gl_FragColor \x3d texture2D(u_image, v_textureCoords);\n}"},TextureRegistry:new c.Registry};n.ctx=n.canvas.getContext("2d");k=c[c.Types.webgl]=function(a){this.domElement=a.domElement||document.createElement("canvas");this.scene=new c.Group;this.scene.parent=this;this._renderer={matrix:new c.Array(h),scale:1,opacity:1};this._flagMatrix=!0;a=g.defaults(a||{},{antialias:!1,alpha:!0,premultipliedAlpha:!0,
stencil:!0,preserveDrawingBuffer:!0,overdraw:!1});this.overdraw=a.overdraw;a=this.ctx=this.domElement.getContext("webgl",a)||this.domElement.getContext("experimental-webgl",a);if(!this.ctx)throw new c.Utils.Error("unable to create a webgl context. Try using another renderer.");var d=n.shaders.create(a,n.shaders.vertex,n.shaders.types.vertex);var f=n.shaders.create(a,n.shaders.fragment,n.shaders.types.fragment);this.program=n.program.create(a,[d,f]);a.useProgram(this.program);this.program.position=
a.getAttribLocation(this.program,"a_position");this.program.matrix=a.getUniformLocation(this.program,"u_matrix");this.program.textureCoords=a.getAttribLocation(this.program,"a_textureCoords");a.disable(a.DEPTH_TEST);a.enable(a.BLEND);a.blendEquationSeparate(a.FUNC_ADD,a.FUNC_ADD);a.blendFuncSeparate(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA)};g.extend(k,{Utils:n});g.extend(k.prototype,c.Utils.Events,{setSize:function(a,c,d){this.width=a;this.height=c;this.ratio=g.isUndefined(d)?
e(this.ctx):d;this.domElement.width=a*this.ratio;this.domElement.height=c*this.ratio;g.extend(this.domElement.style,{width:a+"px",height:c+"px"});a*=this.ratio;c*=this.ratio;this._renderer.matrix[0]=this._renderer.matrix[4]=this._renderer.scale=this.ratio;this._flagMatrix=!0;this.ctx.viewport(0,0,a,c);d=this.ctx.getUniformLocation(this.program,"u_resolution");this.ctx.uniform2f(d,a,c);return this},render:function(){var a=this.ctx;this.overdraw||a.clear(a.COLOR_BUFFER_BIT|a.DEPTH_BUFFER_BIT);n.group.render.call(this.scene,
a,this.program);this._flagMatrix=!1;return this}})})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.Utils,m=c.Shape=function(){this._renderer={};this._renderer.flagMatrix=k.bind(m.FlagMatrix,this);this.isShape=!0;this.id=c.Identifier+c.uniqueId();this.classList=[];this._matrix=new c.Matrix;this.translation=new c.Vector;this.rotation=0;this.scale=1};k.extend(m,{FlagMatrix:function(){this._flagMatrix=!0},MakeObservable:function(k){Object.defineProperty(k,"translation",{enumerable:!0,get:function(){return this._translation},set:function(h){this._translation&&this._translation.unbind(c.Events.change,
this._renderer.flagMatrix);this._translation=h;this._translation.bind(c.Events.change,this._renderer.flagMatrix);m.FlagMatrix.call(this)}});Object.defineProperty(k,"rotation",{enumerable:!0,get:function(){return this._rotation},set:function(c){this._rotation=c;this._flagMatrix=!0}});Object.defineProperty(k,"scale",{enumerable:!0,get:function(){return this._scale},set:function(h){this._scale instanceof c.Vector&&this._scale.unbind(c.Events.change,this._renderer.flagMatrix);this._scale=h;this._scale instanceof
c.Vector&&this._scale.bind(c.Events.change,this._renderer.flagMatrix);this._flagScale=this._flagMatrix=!0}})}});k.extend(m.prototype,c.Utils.Events,{_flagMatrix:!0,_flagScale:!1,_rotation:0,_scale:1,_translation:null,addTo:function(c){c.add(this);return this},clone:function(){var c=new m;c.translation.copy(this.translation);c.rotation=this.rotation;c.scale=this.scale;k.each(m.Properties,function(h){c[h]=this[h]},this);return c._update()},_update:function(k){!this._matrix.manual&&this._flagMatrix&&
(this._matrix.identity().translate(this.translation.x,this.translation.y),this._scale instanceof c.Vector?this._matrix.scale(this._scale.x,this._scale.y):this._matrix.scale(this._scale),this._matrix.rotate(this.rotation));k&&this.parent&&this.parent._update&&this.parent._update();return this},flagReset:function(){this._flagMatrix=this._flagScale=!1;return this}});m.MakeObservable(m.prototype)})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){function k(a,d,e){var f=d.controls&&d.controls.right,g=a.controls&&a.controls.left;var n=d.x;var h=d.y;var k=(f||d).x;var l=(f||d).y;var m=(g||a).x;var t=(g||a).y;var w=a.x;var p=a.y;f&&d._relative&&(k+=d.x,l+=d.y);g&&a._relative&&(m+=a.x,t+=a.y);return c.Utils.getCurveLength(n,h,k,l,m,t,w,p,e)}function m(a,d,e){var f=d.controls&&d.controls.right,g=a.controls&&a.controls.left;var h=d.x;var n=d.y;var k=(f||d).x;var l=(f||d).y;var m=(g||a).x;var t=(g||a).y;var w=a.x;var p=a.y;f&&d._relative&&
(k+=d.x,l+=d.y);g&&a._relative&&(m+=a.x,t+=a.y);return c.Utils.subdivide(h,n,k,l,m,t,w,p,e)}var l=Math.min,h=Math.max,d=Math.round,e=c.Utils.getComputedMatrix,a=c.Utils;a.each(c.Commands,function(a,c){});var g=c.Path=function(d,f,e,h){c.Shape.call(this);this._renderer.type="path";this._renderer.flagVertices=a.bind(g.FlagVertices,this);this._renderer.bindVertices=a.bind(g.BindVertices,this);this._renderer.unbindVertices=a.bind(g.UnbindVertices,this);this._renderer.flagFill=a.bind(g.FlagFill,this);
this._renderer.flagStroke=a.bind(g.FlagStroke,this);this._closed=!!f;this._curved=!!e;this.beginning=0;this.ending=1;this.fill="#fff";this.stroke="#000";this.opacity=this.linewidth=1;this.visible=!0;this.cap="butt";this.join="miter";this.miter=4;this._vertices=[];this.vertices=d;this.automatic=!h};a.extend(g,{Properties:"fill stroke linewidth opacity visible cap join miter closed curved automatic beginning ending".split(" "),FlagVertices:function(){this._flagLength=this._flagVertices=!0},BindVertices:function(a){for(var d=
a.length;d--;)a[d].bind(c.Events.change,this._renderer.flagVertices);this._renderer.flagVertices()},UnbindVertices:function(a){for(var d=a.length;d--;)a[d].unbind(c.Events.change,this._renderer.flagVertices);this._renderer.flagVertices()},FlagFill:function(){this._flagFill=!0},FlagStroke:function(){this._flagStroke=!0},MakeObservable:function(d){c.Shape.MakeObservable(d);a.each(g.Properties.slice(2,8),c.Utils.defineProperty,d);Object.defineProperty(d,"fill",{enumerable:!0,get:function(){return this._fill},
set:function(a){(this._fill instanceof c.Gradient||this._fill instanceof c.LinearGradient||this._fill instanceof c.RadialGradient||this._fill instanceof c.Texture)&&this._fill.unbind(c.Events.change,this._renderer.flagFill);this._fill=a;this._flagFill=!0;(this._fill instanceof c.Gradient||this._fill instanceof c.LinearGradient||this._fill instanceof c.RadialGradient||this._fill instanceof c.Texture)&&this._fill.bind(c.Events.change,this._renderer.flagFill)}});Object.defineProperty(d,"stroke",{enumerable:!0,
get:function(){return this._stroke},set:function(a){(this._stroke instanceof c.Gradient||this._stroke instanceof c.LinearGradient||this._stroke instanceof c.RadialGradient||this._stroke instanceof c.Texture)&&this._stroke.unbind(c.Events.change,this._renderer.flagStroke);this._stroke=a;this._flagStroke=!0;(this._stroke instanceof c.Gradient||this._stroke instanceof c.LinearGradient||this._stroke instanceof c.RadialGradient||this._stroke instanceof c.Texture)&&this._stroke.bind(c.Events.change,this._renderer.flagStroke)}});
Object.defineProperty(d,"length",{get:function(){this._flagLength&&this._updateLength();return this._length}});Object.defineProperty(d,"closed",{enumerable:!0,get:function(){return this._closed},set:function(a){this._closed=!!a;this._flagVertices=!0}});Object.defineProperty(d,"curved",{enumerable:!0,get:function(){return this._curved},set:function(a){this._curved=!!a;this._flagVertices=!0}});Object.defineProperty(d,"automatic",{enumerable:!0,get:function(){return this._automatic},set:function(c){if(c!==
this._automatic){var d=(this._automatic=!!c)?"ignore":"listen";a.each(this.vertices,function(a){a[d]()})}}});Object.defineProperty(d,"beginning",{enumerable:!0,get:function(){return this._beginning},set:function(a){this._beginning=a;this._flagVertices=!0}});Object.defineProperty(d,"ending",{enumerable:!0,get:function(){return this._ending},set:function(a){this._ending=a;this._flagVertices=!0}});Object.defineProperty(d,"vertices",{enumerable:!0,get:function(){return this._collection},set:function(a){var d=
this._renderer.bindVertices,e=this._renderer.unbindVertices;this._collection&&this._collection.unbind(c.Events.insert,d).unbind(c.Events.remove,e);this._collection=new c.Utils.Collection((a||[]).slice(0));this._collection.bind(c.Events.insert,d).bind(c.Events.remove,e);d(this._collection)}});Object.defineProperty(d,"clip",{enumerable:!0,get:function(){return this._clip},set:function(a){this._clip=a;this._flagClip=!0}})}});a.extend(g.prototype,c.Shape.prototype,{_flagVertices:!0,_flagLength:!0,_flagFill:!0,
_flagStroke:!0,_flagLinewidth:!0,_flagOpacity:!0,_flagVisible:!0,_flagCap:!0,_flagJoin:!0,_flagMiter:!0,_flagClip:!1,_length:0,_fill:"#fff",_stroke:"#000",_linewidth:1,_opacity:1,_visible:!0,_cap:"round",_join:"round",_miter:4,_closed:!0,_curved:!1,_automatic:!0,_beginning:0,_ending:1,_clip:!1,clone:function(d){d=d||this.parent;var e=a.map(this.vertices,function(a){return a.clone()}),h=new g(e,this.closed,this.curved,!this.automatic);a.each(c.Path.Properties,function(a){h[a]=this[a]},this);h.translation.copy(this.translation);
h.rotation=this.rotation;h.scale=this.scale;d&&d.add(h);return h},toObject:function(){var d={vertices:a.map(this.vertices,function(a){return a.toObject()})};a.each(c.Shape.Properties,function(a){d[a]=this[a]},this);d.translation=this.translation.toObject;d.rotation=this.rotation;d.scale=this.scale;return d},noFill:function(){this.fill="transparent";return this},noStroke:function(){this.stroke="transparent";return this},corner:function(){var c=this.getBoundingClientRect(!0);c.centroid={x:c.left+c.width/
2,y:c.top+c.height/2};a.each(this.vertices,function(a){a.addSelf(c.centroid)});return this},center:function(){var c=this.getBoundingClientRect(!0);c.centroid={x:c.left+c.width/2,y:c.top+c.height/2};a.each(this.vertices,function(a){a.subSelf(c.centroid)});return this},remove:function(){if(!this.parent)return this;this.parent.remove(this);return this},getBoundingClientRect:function(a){var c,d=Infinity,g=-Infinity,k=Infinity,n=-Infinity;this._update(!0);a=a?this._matrix:e(this);var m=this.linewidth/
2;var x=this._vertices.length;if(0>=x){var u=a.multiply(0,0,1);return{top:u.y,left:u.x,right:u.x,bottom:u.y,width:0,height:0}}for(c=0;c<x;c++){u=this._vertices[c];var r=u.x;u=u.y;u=a.multiply(r,u,1);k=l(u.y-m,k);d=l(u.x-m,d);g=h(u.x+m,g);n=h(u.y+m,n)}return{top:k,left:d,right:g,bottom:n,width:g-d,height:n-k}},getPointAt:function(d,e){var g,f;var h=this.length*Math.min(Math.max(d,0),1);var k=this.vertices.length;var n=k-1;var l=g=null;var m=0;var r=this._lengths.length;for(f=0;m<r;m++){if(f+this._lengths[m]>=
h){this._closed?(g=c.Utils.mod(m,k),l=c.Utils.mod(m-1,k),0===m&&(g=l,l=m)):(g=m,l=Math.min(Math.max(m-1,0),n));g=this.vertices[g];l=this.vertices[l];h-=f;0!==this._lengths[m]&&(d=h/this._lengths[m]);break}f+=this._lengths[m]}if(a.isNull(g)||a.isNull(l))return null;var q=l.controls&&l.controls.right;var w=g.controls&&g.controls.left;n=l.x;h=l.y;r=(q||l).x;m=(q||l).y;var p=(w||g).x;f=(w||g).y;var C=g.x;k=g.y;q&&l._relative&&(r+=l.x,m+=l.y);w&&g._relative&&(p+=g.x,f+=g.y);g=c.Utils.getPointOnCubicBezier(d,
n,r,p,C);d=c.Utils.getPointOnCubicBezier(d,h,m,f,k);return a.isObject(e)?(e.x=g,e.y=d,e):new c.Vector(g,d)},plot:function(){if(this.curved)return c.Utils.getCurveFromPoints(this._vertices,this.closed),this;for(var a=0;a<this._vertices.length;a++)this._vertices[a]._command=0===a?c.Commands.move:c.Commands.line;return this},subdivide:function(d){this._update();var e=this.vertices.length-1,g=this.vertices[e],h=this._closed||this.vertices[e]._command===c.Commands.close,k=[];a.each(this.vertices,function(f,
n){if(!(0>=n)||h)if(f.command===c.Commands.move)k.push(new c.Anchor(g.x,g.y)),0<n&&(k[k.length-1].command=c.Commands.line);else{var l=m(f,g,d);k=k.concat(l);a.each(l,function(a,d){a.command=0>=d&&g.command===c.Commands.move?c.Commands.move:c.Commands.line});n>=e&&(this._closed&&this._automatic?(g=f,l=m(f,g,d),k=k.concat(l),a.each(l,function(a,d){a.command=0>=d&&g.command===c.Commands.move?c.Commands.move:c.Commands.line})):h&&k.push(new c.Anchor(f.x,f.y)),k[k.length-1].command=h?c.Commands.close:
c.Commands.line)}g=f},this);this._curved=this._automatic=!1;this.vertices=k;return this},_updateLength:function(d){this._update();var e=this.vertices.length,g=e-1,h=this.vertices[g],n=this._closed||this.vertices[g]._command===c.Commands.close,l=0;a.isUndefined(this._lengths)&&(this._lengths=[]);a.each(this.vertices,function(a,f){0>=f&&!n||a.command===c.Commands.move?(h=a,this._lengths[f]=0):(this._lengths[f]=k(a,h,d),l+=this._lengths[f],f>=g&&n&&(h=this.vertices[(f+1)%e],this._lengths[f+1]=k(a,h,
d),l+=this._lengths[f+1]),h=a)},this);this._length=l;return this},_update:function(){if(this._flagVertices){var a=this.vertices.length-1;var e=d(this._beginning*a);a=d(this._ending*a);this._vertices.length=0;for(var g=e;g<a+1;g++)e=this.vertices[g],this._vertices.push(e);this._automatic&&this.plot()}c.Shape.prototype._update.apply(this,arguments);return this},flagReset:function(){this._flagVertices=this._flagFill=this._flagStroke=this._flagLinewidth=this._flagOpacity=this._flagVisible=this._flagCap=
this._flagJoin=this._flagMiter=this._flagClip=!1;c.Shape.prototype.flagReset.call(this);return this}});g.MakeObservable(g.prototype)})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);(function(c){var k=c.Path,m=c.Utils,l=c.Line=function(h,d,e,a){e=(e-h)/2;a=(a-d)/2;k.call(this,[new c.Anchor(-e,-a),new c.Anchor(e,a)]);this.translation.set(h+e,d+a)};m.extend(l.prototype,k.prototype);k.MakeObservable(l.prototype)})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.Path,m=c.Utils,l=c.Rectangle=function(h,d,e,a){k.call(this,[new c.Anchor,new c.Anchor,new c.Anchor,new c.Anchor],!0);this.width=e;this.height=a;this._update();this.translation.set(h,d)};m.extend(l,{Properties:["width","height"],MakeObservable:function(h){k.MakeObservable(h);m.each(l.Properties,c.Utils.defineProperty,h)}});m.extend(l.prototype,k.prototype,{_width:0,_height:0,_flagWidth:0,_flagHeight:0,_update:function(){if(this._flagWidth||this._flagHeight){var c=this._width/2,
d=this._height/2;this.vertices[0].set(-c,-d);this.vertices[1].set(c,-d);this.vertices[2].set(c,d);this.vertices[3].set(-c,d)}k.prototype._update.call(this);return this},flagReset:function(){this._flagWidth=this._flagHeight=!1;k.prototype.flagReset.call(this);return this}});l.MakeObservable(l.prototype)})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.Path,m=2*Math.PI,l=Math.cos,h=Math.sin,d=c.Utils,e=c.Ellipse=function(a,e,h,f){d.isNumber(f)||(f=h);var g=d.map(d.range(c.Resolution),function(a){return new c.Anchor},this);k.call(this,g,!0,!0);this.width=2*h;this.height=2*f;this._update();this.translation.set(a,e)};d.extend(e,{Properties:["width","height"],MakeObservable:function(a){k.MakeObservable(a);d.each(e.Properties,c.Utils.defineProperty,a)}});d.extend(e.prototype,k.prototype,{_width:0,_height:0,_flagWidth:!1,_flagHeight:!1,
_update:function(){if(this._flagWidth||this._flagHeight)for(var a=0,c=this.vertices.length;a<c;a++){var d=a/c*m,e=this._width*l(d)/2,d=this._height*h(d)/2;this.vertices[a].set(e,d)}k.prototype._update.call(this);return this},flagReset:function(){this._flagWidth=this._flagHeight=!1;k.prototype.flagReset.call(this);return this}});e.MakeObservable(e.prototype)})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.Path,m=2*Math.PI,l=Math.cos,h=Math.sin,d=c.Utils,e=c.Circle=function(a,e,h){var g=d.map(d.range(c.Resolution),function(a){return new c.Anchor},this);k.call(this,g,!0,!0);this.radius=h;this._update();this.translation.set(a,e)};d.extend(e,{Properties:["radius"],MakeObservable:function(a){k.MakeObservable(a);d.each(e.Properties,c.Utils.defineProperty,a)}});d.extend(e.prototype,k.prototype,{_radius:0,_flagRadius:!1,_update:function(){if(this._flagRadius)for(var a=0,c=this.vertices.length;a<
c;a++){var d=a/c*m,e=this._radius*l(d),d=this._radius*h(d);this.vertices[a].set(e,d)}k.prototype._update.call(this);return this},flagReset:function(){this._flagRadius=!1;k.prototype.flagReset.call(this);return this}});e.MakeObservable(e.prototype)})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.Path,m=2*Math.PI,l=Math.cos,h=Math.sin,d=c.Utils,e=c.Polygon=function(a,e,h,f){f=Math.max(f||0,3);var g=d.map(d.range(f),function(a){return new c.Anchor});k.call(this,g,!0);this.width=2*h;this.height=2*h;this.sides=f;this._update();this.translation.set(a,e)};d.extend(e,{Properties:["width","height","sides"],MakeObservable:function(a){k.MakeObservable(a);d.each(e.Properties,c.Utils.defineProperty,a)}});d.extend(e.prototype,k.prototype,{_width:0,_height:0,_sides:0,_flagWidth:!1,
_flagHeight:!1,_flagSides:!1,_update:function(){if(this._flagWidth||this._flagHeight||this._flagSides){var a=this._sides,d=this.vertices.length;d>a&&this.vertices.splice(a-1,d-a);for(var e=0;e<a;e++){var f=(e+.5)/a*m+Math.PI/2,t=this._width*l(f),f=this._height*h(f);e>=d?this.vertices.push(new c.Anchor(t,f)):this.vertices[e].set(t,f)}}k.prototype._update.call(this);return this},flagReset:function(){this._flagWidth=this._flagHeight=this._flagSides=!1;k.prototype.flagReset.call(this);return this}});
e.MakeObservable(e.prototype)})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){function k(a,c){for(;0>a;)a+=c;return a%c}var m=c.Path,l=2*Math.PI,h=Math.PI/2,d=c.Utils,e=c.ArcSegment=function(a,e,h,f,k,l,B){B=d.map(d.range(B||3*c.Resolution),function(){return new c.Anchor});m.call(this,B,!1,!1,!0);this.innerRadius=h;this.outerRadius=f;this.startAngle=k;this.endAngle=l;this._update();this.translation.set(a,e)};d.extend(e,{Properties:["startAngle","endAngle","innerRadius","outerRadius"],MakeObservable:function(a){m.MakeObservable(a);d.each(e.Properties,c.Utils.defineProperty,
a)}});d.extend(e.prototype,m.prototype,{_flagStartAngle:!1,_flagEndAngle:!1,_flagInnerRadius:!1,_flagOuterRadius:!1,_startAngle:0,_endAngle:l,_innerRadius:0,_outerRadius:0,_update:function(){if(this._flagStartAngle||this._flagEndAngle||this._flagInnerRadius||this._flagOuterRadius){var a=this._startAngle,d=this._endAngle,e=this._innerRadius,f=this._outerRadius,t=k(a,l)===k(d,l),v=0<e,B=this.vertices,z=v?B.length/2:B.length,A=0;t?z--:v||(z-=2);for(var x=0,u=z-1;x<z;x++){var r=x/u;var q=B[A];r=r*(d-
a)+a;var w=(d-a)/z;var p=f*Math.cos(r);var C=f*Math.sin(r);switch(x){case 0:var E=c.Commands.move;break;default:E=c.Commands.curve}q.command=E;q.x=p;q.y=C;q.controls.left.clear();q.controls.right.clear();q.command===c.Commands.curve&&(C=f*w/Math.PI,q.controls.left.x=C*Math.cos(r-h),q.controls.left.y=C*Math.sin(r-h),q.controls.right.x=C*Math.cos(r+h),q.controls.right.y=C*Math.sin(r+h),1===x&&q.controls.left.multiplyScalar(2),x===u&&q.controls.right.multiplyScalar(2));A++}if(v)for(t?(B[A].command=c.Commands.close,
A++):(z--,u=z-1),x=0;x<z;x++)r=x/u,q=B[A],r=(1-r)*(d-a)+a,w=(d-a)/z,p=e*Math.cos(r),C=e*Math.sin(r),E=c.Commands.curve,0>=x&&(E=t?c.Commands.move:c.Commands.line),q.command=E,q.x=p,q.y=C,q.controls.left.clear(),q.controls.right.clear(),q.command===c.Commands.curve&&(C=e*w/Math.PI,q.controls.left.x=C*Math.cos(r+h),q.controls.left.y=C*Math.sin(r+h),q.controls.right.x=C*Math.cos(r-h),q.controls.right.y=C*Math.sin(r-h),1===x&&q.controls.left.multiplyScalar(2),x===u&&q.controls.right.multiplyScalar(2)),
A++;else t||(B[A].command=c.Commands.line,B[A].x=0,B[A].y=0,A++);B[A].command=c.Commands.close}m.prototype._update.call(this);return this},flagReset:function(){m.prototype.flagReset.call(this);this._flagStartAngle=this._flagEndAngle=this._flagInnerRadius=this._flagOuterRadius=!1;return this}});e.MakeObservable(e.prototype)})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.Path,m=2*Math.PI,l=Math.cos,h=Math.sin,d=c.Utils,e=c.Star=function(a,e,h,f,l){d.isNumber(f)||(f=h/2);if(!d.isNumber(l)||0>=l)l=5;var g=d.map(d.range(2*l),function(a){return new c.Anchor});k.call(this,g,!0);this.innerRadius=f;this.outerRadius=h;this.sides=l;this._update();this.translation.set(a,e)};d.extend(e,{Properties:["innerRadius","outerRadius","sides"],MakeObservable:function(a){k.MakeObservable(a);d.each(e.Properties,c.Utils.defineProperty,a)}});d.extend(e.prototype,k.prototype,
{_innerRadius:0,_outerRadius:0,_sides:0,_flagInnerRadius:!1,_flagOuterRadius:!1,_flagSides:!1,_update:function(){if(this._flagInnerRadius||this._flagOuterRadius||this._flagSides){var a=2*this._sides,d=this.vertices.length;d>a&&this.vertices.splice(a-1,d-a);for(var e=0;e<a;e++){var f=(e+.5)/a*m,t=e%2?this._innerRadius:this._outerRadius,v=t*l(f),f=t*h(f);e>=d?this.vertices.push(new c.Anchor(v,f)):this.vertices[e].set(v,f)}}k.prototype._update.call(this);return this},flagReset:function(){this._flagInnerRadius=
this._flagOuterRadius=this._flagSides=!1;k.prototype.flagReset.call(this);return this}});e.MakeObservable(e.prototype)})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.Path,m=c.Utils,l=c.RoundedRectangle=function(h,d,e,a,g){m.isNumber(g)||(g=Math.floor(Math.min(e,a)/12));var l=m.map(m.range(10),function(a){return new c.Anchor(0,0,0,0,0,0,0===a?c.Commands.move:c.Commands.curve)});l[l.length-1].command=c.Commands.close;k.call(this,l,!1,!1,!0);this.width=e;this.height=a;this.radius=g;this._update();this.translation.set(h,d)};m.extend(l,{Properties:["width","height","radius"],MakeObservable:function(h){k.MakeObservable(h);m.each(l.Properties,c.Utils.defineProperty,
h)}});m.extend(l.prototype,k.prototype,{_width:0,_height:0,_radius:0,_flagWidth:!1,_flagHeight:!1,_flagRadius:!1,_update:function(){if(this._flagWidth||this._flagHeight||this._flagRadius){var c=this._width,d=this._height,e=Math.min(Math.max(this._radius,0),Math.min(c,d)),c=c/2,a=d/2,d=this.vertices[0];d.x=-(c-e);d.y=-a;d=this.vertices[1];d.x=c-e;d.y=-a;d.controls.left.clear();d.controls.right.x=e;d.controls.right.y=0;d=this.vertices[2];d.x=c;d.y=-(a-e);d.controls.right.clear();d.controls.left.clear();
d=this.vertices[3];d.x=c;d.y=a-e;d.controls.left.clear();d.controls.right.x=0;d.controls.right.y=e;d=this.vertices[4];d.x=c-e;d.y=a;d.controls.right.clear();d.controls.left.clear();d=this.vertices[5];d.x=-(c-e);d.y=a;d.controls.left.clear();d.controls.right.x=-e;d.controls.right.y=0;d=this.vertices[6];d.x=-c;d.y=a-e;d.controls.left.clear();d.controls.right.clear();d=this.vertices[7];d.x=-c;d.y=-(a-e);d.controls.left.clear();d.controls.right.x=0;d.controls.right.y=-e;d=this.vertices[8];d.x=-(c-e);
d.y=-a;d.controls.left.clear();d.controls.right.clear();d=this.vertices[9];d.copy(this.vertices[8])}k.prototype._update.call(this);return this},flagReset:function(){this._flagWidth=this._flagHeight=this._flagRadius=!1;k.prototype.flagReset.call(this);return this}});l.MakeObservable(l.prototype)})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.root,m=c.Utils.getComputedMatrix,l=c.Utils;(k.document?k.document.createElement("canvas"):{getContext:l.identity}).getContext("2d");var h=c.Text=function(d,e,a,g){c.Shape.call(this);this._renderer.type="text";this._renderer.flagFill=l.bind(h.FlagFill,this);this._renderer.flagStroke=l.bind(h.FlagStroke,this);this.value=d;l.isNumber(e)&&(this.translation.x=e);l.isNumber(a)&&(this.translation.y=a);if(!l.isObject(g))return this;l.each(c.Text.Properties,function(a){a in g&&(this[a]=
g[a])},this)};l.extend(c.Text,{Properties:"value family size leading alignment linewidth style weight decoration baseline opacity visible fill stroke".split(" "),FlagFill:function(){this._flagFill=!0},FlagStroke:function(){this._flagStroke=!0},MakeObservable:function(d){c.Shape.MakeObservable(d);l.each(c.Text.Properties.slice(0,12),c.Utils.defineProperty,d);Object.defineProperty(d,"fill",{enumerable:!0,get:function(){return this._fill},set:function(d){(this._fill instanceof c.Gradient||this._fill instanceof
c.LinearGradient||this._fill instanceof c.RadialGradient||this._fill instanceof c.Texture)&&this._fill.unbind(c.Events.change,this._renderer.flagFill);this._fill=d;this._flagFill=!0;(this._fill instanceof c.Gradient||this._fill instanceof c.LinearGradient||this._fill instanceof c.RadialGradient||this._fill instanceof c.Texture)&&this._fill.bind(c.Events.change,this._renderer.flagFill)}});Object.defineProperty(d,"stroke",{enumerable:!0,get:function(){return this._stroke},set:function(d){(this._stroke instanceof
c.Gradient||this._stroke instanceof c.LinearGradient||this._stroke instanceof c.RadialGradient||this._stroke instanceof c.Texture)&&this._stroke.unbind(c.Events.change,this._renderer.flagStroke);this._stroke=d;this._flagStroke=!0;(this._stroke instanceof c.Gradient||this._stroke instanceof c.LinearGradient||this._stroke instanceof c.RadialGradient||this._stroke instanceof c.Texture)&&this._stroke.bind(c.Events.change,this._renderer.flagStroke)}});Object.defineProperty(d,"clip",{enumerable:!0,get:function(){return this._clip},
set:function(c){this._clip=c;this._flagClip=!0}})}});l.extend(c.Text.prototype,c.Shape.prototype,{_flagValue:!0,_flagFamily:!0,_flagSize:!0,_flagLeading:!0,_flagAlignment:!0,_flagBaseline:!0,_flagStyle:!0,_flagWeight:!0,_flagDecoration:!0,_flagFill:!0,_flagStroke:!0,_flagLinewidth:!0,_flagOpacity:!0,_flagVisible:!0,_flagClip:!1,_value:"",_family:"sans-serif",_size:13,_leading:17,_alignment:"center",_baseline:"middle",_style:"normal",_weight:500,_decoration:"none",_fill:"#000",_stroke:"transparent",
_linewidth:1,_opacity:1,_visible:!0,_clip:!1,remove:function(){if(!this.parent)return this;this.parent.remove(this);return this},clone:function(d){d=d||this.parent;var e=new c.Text(this.value);e.translation.copy(this.translation);e.rotation=this.rotation;e.scale=this.scale;l.each(c.Text.Properties,function(a){e[a]=this[a]},this);d&&d.add(e);return e},toObject:function(){var d={translation:this.translation.toObject(),rotation:this.rotation,scale:this.scale};l.each(c.Text.Properties,function(c){d[c]=
this[c]},this);return d},noStroke:function(){this.stroke="transparent";return this},noFill:function(){this.fill="transparent";return this},getBoundingClientRect:function(c){this._update(!0);c=(c?this._matrix:m(this)).multiply(0,0,1);return{top:c.x,left:c.y,right:c.x,bottom:c.y,width:0,height:0}},flagReset:function(){this._flagValue=this._flagFamily=this._flagSize=this._flagLeading=this._flagAlignment=this._flagFill=this._flagStroke=this._flagLinewidth=this._flagOpaicty=this._flagVisible=this._flagClip=
this._flagDecoration=this._flagBaseline=!1;c.Shape.prototype.flagReset.call(this);return this}});c.Text.MakeObservable(c.Text.prototype)})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.Utils,m=c.Stop=function(c,d,e){this._renderer={};this._renderer.type="stop";this.offset=k.isNumber(c)?c:0>=m.Index?0:1;this.opacity=k.isNumber(e)?e:1;this.color=k.isString(d)?d:0>=m.Index?"#fff":"#000";m.Index=(m.Index+1)%2};k.extend(m,{Index:0,Properties:["offset","opacity","color"],MakeObservable:function(c){k.each(m.Properties,function(c){var d="_"+c,a="_flag"+c.charAt(0).toUpperCase()+c.slice(1);Object.defineProperty(this,c,{enumerable:!0,get:function(){return this[d]},set:function(c){this[d]=
c;this[a]=!0;this.parent&&(this.parent._flagStops=!0)}})},c)}});k.extend(m.prototype,c.Utils.Events,{clone:function(){var c=new m;k.each(m.Properties,function(d){c[d]=this[d]},this);return c},toObject:function(){var c={};k.each(m.Properties,function(d){c[d]=this[d]},this);return c},flagReset:function(){this._flagOffset=this._flagColor=this._flagOpacity=!1;return this}});m.MakeObservable(m.prototype);var l=c.Gradient=function(h){this._renderer={};this._renderer.type="gradient";this.id=c.Identifier+
c.uniqueId();this.classList=[];this._renderer.flagStops=k.bind(l.FlagStops,this);this._renderer.bindStops=k.bind(l.BindStops,this);this._renderer.unbindStops=k.bind(l.UnbindStops,this);this.spread="pad";this.stops=h};k.extend(l,{Stop:m,Properties:["spread"],MakeObservable:function(h){k.each(l.Properties,c.Utils.defineProperty,h);Object.defineProperty(h,"stops",{enumerable:!0,get:function(){return this._stops},set:function(d){var e=this._renderer.bindStops,a=this._renderer.unbindStops;this._stops&&
this._stops.unbind(c.Events.insert,e).unbind(c.Events.remove,a);this._stops=new c.Utils.Collection((d||[]).slice(0));this._stops.bind(c.Events.insert,e).bind(c.Events.remove,a);e(this._stops)}})},FlagStops:function(){this._flagStops=!0},BindStops:function(h){for(var d=h.length;d--;)h[d].bind(c.Events.change,this._renderer.flagStops),h[d].parent=this;this._renderer.flagStops()},UnbindStops:function(h){for(var d=h.length;d--;)h[d].unbind(c.Events.change,this._renderer.flagStops),delete h[d].parent;
this._renderer.flagStops()}});k.extend(l.prototype,c.Utils.Events,{_flagStops:!1,_flagSpread:!1,clone:function(h){h=h||this.parent;var d=k.map(this.stops,function(a){return a.clone()}),e=new l(d);k.each(c.Gradient.Properties,function(a){e[a]=this[a]},this);h&&h.add(e);return e},toObject:function(){var c={stops:k.map(this.stops,function(c){return c.toObject()})};k.each(l.Properties,function(d){c[d]=this[d]},this);return c},_update:function(){(this._flagSpread||this._flagStops)&&this.trigger(c.Events.change);
return this},flagReset:function(){this._flagSpread=this._flagStops=!1;return this}});l.MakeObservable(l.prototype)})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.Utils,m=c.LinearGradient=function(l,h,d,e,a){c.Gradient.call(this,a);this._renderer.type="linear-gradient";a=k.bind(m.FlagEndPoints,this);this.left=(new c.Vector).bind(c.Events.change,a);this.right=(new c.Vector).bind(c.Events.change,a);k.isNumber(l)&&(this.left.x=l);k.isNumber(h)&&(this.left.y=h);k.isNumber(d)&&(this.right.x=d);k.isNumber(e)&&(this.right.y=e)};k.extend(m,{Stop:c.Gradient.Stop,MakeObservable:function(k){c.Gradient.MakeObservable(k)},FlagEndPoints:function(){this._flagEndPoints=
!0}});k.extend(m.prototype,c.Gradient.prototype,{_flagEndPoints:!1,clone:function(l){l=l||this.parent;var h=k.map(this.stops,function(c){return c.clone()}),d=new m(this.left._x,this.left._y,this.right._x,this.right._y,h);k.each(c.Gradient.Properties,function(c){d[c]=this[c]},this);l&&l.add(d);return d},toObject:function(){var k=c.Gradient.prototype.toObject.call(this);k.left=this.left.toObject();k.right=this.right.toObject();return k},_update:function(){(this._flagEndPoints||this._flagSpread||this._flagStops)&&
this.trigger(c.Events.change);return this},flagReset:function(){this._flagEndPoints=!1;c.Gradient.prototype.flagReset.call(this);return this}});m.MakeObservable(m.prototype)})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.Utils,m=c.RadialGradient=function(l,h,d,e,a,g){c.Gradient.call(this,e);this._renderer.type="radial-gradient";this.center=(new c.Vector).bind(c.Events.change,k.bind(function(){this._flagCenter=!0},this));this.radius=k.isNumber(d)?d:20;this.focal=(new c.Vector).bind(c.Events.change,k.bind(function(){this._flagFocal=!0},this));k.isNumber(l)&&(this.center.x=l);k.isNumber(h)&&(this.center.y=h);this.focal.copy(this.center);k.isNumber(a)&&(this.focal.x=a);k.isNumber(g)&&(this.focal.y=
g)};k.extend(m,{Stop:c.Gradient.Stop,Properties:["radius"],MakeObservable:function(l){c.Gradient.MakeObservable(l);k.each(m.Properties,c.Utils.defineProperty,l)}});k.extend(m.prototype,c.Gradient.prototype,{_flagRadius:!1,_flagCenter:!1,_flagFocal:!1,clone:function(l){l=l||this.parent;var h=k.map(this.stops,function(c){return c.clone()}),d=new m(this.center._x,this.center._y,this._radius,h,this.focal._x,this.focal._y);k.each(c.Gradient.Properties.concat(m.Properties),function(c){d[c]=this[c]},this);
l&&l.add(d);return d},toObject:function(){var l=c.Gradient.prototype.toObject.call(this);k.each(m.Properties,function(c){l[c]=this[c]},this);l.center=this.center.toObject();l.focal=this.focal.toObject();return l},_update:function(){(this._flagRadius||this._flatCenter||this._flagFocal||this._flagSpread||this._flagStops)&&this.trigger(c.Events.change);return this},flagReset:function(){this._flagRadius=this._flagCenter=this._flagFocal=!1;c.Gradient.prototype.flagReset.call(this);return this}});m.MakeObservable(m.prototype)})(("undefined"!==
typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.Utils,m,l=/\.(mp4|webm)$/i;this.document&&(m=document.createElement("a"));var h=c.Texture=function(d,e){this._renderer={};this._renderer.type="texture";this._renderer.flagOffset=k.bind(h.FlagOffset,this);this._renderer.flagScale=k.bind(h.FlagScale,this);this.id=c.Identifier+c.uniqueId();this.classList=[];this.offset=new c.Vector;if(k.isFunction(e)){var a=k.bind(function(){this.unbind(c.Events.load,a);k.isFunction(e)&&e()},this);this.bind(c.Events.load,a)}k.isString(d)?this.src=
d:k.isElement(d)&&(this.image=d);this._update()};k.extend(h,{Properties:["src","loaded","repeat"],ImageRegistry:new c.Registry,getAbsoluteURL:function(c){if(!m)return c;m.href=c;return m.href},getImage:function(c){c=h.getAbsoluteURL(c);if(h.ImageRegistry.contains(c))return h.ImageRegistry.get(c);c=l.test(c)?document.createElement("video"):document.createElement("img");c.crossOrigin="anonymous";return c},Register:{canvas:function(c,e){c._src="#"+c.id;h.ImageRegistry.add(c.src,c.image);k.isFunction(e)&&
e()},img:function(d,e){var a=function(c){d.image.removeEventListener("load",a,!1);d.image.removeEventListener("error",g,!1);k.isFunction(e)&&e()},g=function(e){d.image.removeEventListener("load",a,!1);d.image.removeEventListener("error",g,!1);throw new c.Utils.Error("unable to load "+d.src);};k.isNumber(d.image.width)&&0<d.image.width&&k.isNumber(d.image.height)&&0<d.image.height?a():(d.image.addEventListener("load",a,!1),d.image.addEventListener("error",g,!1));d._src=h.getAbsoluteURL(d._src);d.image&&
d.image.getAttribute("two-src")||(d.image.setAttribute("two-src",d.src),h.ImageRegistry.add(d.src,d.image),d.image.src=d.src)},video:function(d,e){var a=function(c){d.image.removeEventListener("load",a,!1);d.image.removeEventListener("error",g,!1);d.image.width=d.image.videoWidth;d.image.height=d.image.videoHeight;d.image.play();k.isFunction(e)&&e()},g=function(e){d.image.removeEventListener("load",a,!1);d.image.removeEventListener("error",g,!1);throw new c.Utils.Error("unable to load "+d.src);};
d._src=h.getAbsoluteURL(d._src);d.image.addEventListener("canplaythrough",a,!1);d.image.addEventListener("error",g,!1);d.image&&d.image.getAttribute("two-src")||(d.image.setAttribute("two-src",d.src),h.ImageRegistry.add(d.src,d.image),d.image.src=d.src,d.image.loop=!0,d.image.load())}},load:function(c,e){var a=c.image,d=a&&a.nodeName.toLowerCase();c._flagImage&&(/canvas/i.test(d)?h.Register.canvas(c,e):(c._src=a.getAttribute("two-src")||a.src,h.Register[d](c,e)));c._flagSrc&&(a||(c.image=h.getImage(c.src)),
d=c.image.nodeName.toLowerCase(),h.Register[d](c,e))},FlagOffset:function(){this._flagOffset=!0},FlagScale:function(){this._flagScale=!0},MakeObservable:function(d){k.each(h.Properties,c.Utils.defineProperty,d);Object.defineProperty(d,"image",{enumerable:!0,get:function(){return this._image},set:function(c){switch(c&&c.nodeName.toLowerCase()){case "canvas":var a="#"+c.id;break;default:a=c.src}h.ImageRegistry.contains(a)?this._image=h.ImageRegistry.get(c.src):this._image=c;this._flagImage=!0}});Object.defineProperty(d,
"offset",{enumerable:!0,get:function(){return this._offset},set:function(d){this._offset&&this._offset.unbind(c.Events.change,this._renderer.flagOffset);this._offset=d;this._offset.bind(c.Events.change,this._renderer.flagOffset);this._flagOffset=!0}});Object.defineProperty(d,"scale",{enumerable:!0,get:function(){return this._scale},set:function(d){this._scale instanceof c.Vector&&this._scale.unbind(c.Events.change,this._renderer.flagScale);this._scale=d;this._scale instanceof c.Vector&&this._scale.bind(c.Events.change,
this._renderer.flagScale);this._flagScale=!0}})}});k.extend(h.prototype,c.Utils.Events,c.Shape.prototype,{_flagSrc:!1,_flagImage:!1,_flagVideo:!1,_flagLoaded:!1,_flagRepeat:!1,_flagOffset:!1,_flagScale:!1,_src:"",_image:null,_loaded:!1,_repeat:"no-repeat",_scale:1,_offset:null,clone:function(){return new h(this.src)},toObject:function(){return{src:this.src,image:this.image}},_update:function(){if(this._flagSrc||this._flagImage||this._flagVideo)if(this.trigger(c.Events.change),this._flagSrc||this._flagImage)this.loaded=
!1,h.load(this,k.bind(function(){this.loaded=!0;this.trigger(c.Events.change).trigger(c.Events.load)},this));this._image&&4<=this._image.readyState&&(this._flagVideo=!0);return this},flagReset:function(){this._flagSrc=this._flagImage=this._flagLoaded=this._flagVideo=this._flagScale=this._flagOffset=!1;return this}});h.MakeObservable(h.prototype)})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.Utils,m=c.Path,l=c.Rectangle,h=c.Sprite=function(d,e,a,g,h,f){m.call(this,[new c.Anchor,new c.Anchor,new c.Anchor,new c.Anchor],!0);this.noStroke();this.noFill();d instanceof c.Texture?this.texture=d:k.isString(d)&&(this.texture=new c.Texture(d));this._update();this.translation.set(e||0,a||0);k.isNumber(g)&&(this.columns=g);k.isNumber(h)&&(this.rows=h);k.isNumber(f)&&(this.frameRate=f)};k.extend(h,{Properties:["texture","columns","rows","frameRate","index"],MakeObservable:function(d){l.MakeObservable(d);
k.each(h.Properties,c.Utils.defineProperty,d)}});k.extend(h.prototype,l.prototype,{_flagTexture:!1,_flagColumns:!1,_flagRows:!1,_flagFrameRate:!1,flagIndex:!1,_amount:1,_duration:0,_startTime:0,_playing:!1,_firstFrame:0,_lastFrame:0,_loop:!0,_texture:null,_columns:1,_rows:1,_frameRate:0,_index:0,play:function(c,e,a){this._playing=!0;this._firstFrame=0;this._lastFrame=this.amount-1;this._startTime=k.performance.now();k.isNumber(c)&&(this._firstFrame=c);k.isNumber(e)&&(this._lastFrame=e);k.isFunction(a)?
this._onLastFrame=a:delete this._onLastFrame;this._index!==this._firstFrame&&(this._startTime-=1E3*Math.abs(this._index-this._firstFrame)/this._frameRate);return this},pause:function(){this._playing=!1;return this},stop:function(){this._playing=!1;this._index=0;return this},clone:function(c){c=c||this.parent;var d=new h(this.texture,this.translation.x,this.translation.y,this.columns,this.rows,this.frameRate);this.playing&&(d.play(this._firstFrame,this._lastFrame),d._loop=this._loop);c&&c.add(d);return d},
_update:function(){var c=this._texture,e=this._columns,a=this._rows;if(this._flagColumns||this._flagRows)this._amount=this._columns*this._rows;this._flagFrameRate&&(this._duration=1E3*this._amount/this._frameRate);this._flagTexture&&(this.fill=this._texture);if(this._texture.loaded){var g=c.image.width;var h=c.image.height;var f=g/e;a=h/a;var m=this._amount;this.width!==f&&(this.width=f);this.height!==a&&(this.height=a);if(this._playing&&0<this._frameRate){k.isNaN(this._lastFrame)&&(this._lastFrame=
m-1);m=k.performance.now()-this._startTime;var v=this._lastFrame+1;var B=1E3*(v-this._firstFrame)/this._frameRate;m=this._loop?m%B:Math.min(m,B);m=k.lerp(this._firstFrame,v,m/B);m=Math.floor(m);m!==this._index&&(this._index=m,m>=this._lastFrame-1&&this._onLastFrame&&this._onLastFrame())}f=this._index%e*-f+(g-f)/2;e=-a*Math.floor(this._index/e)+(h-a)/2;f!==c.offset.x&&(c.offset.x=f);e!==c.offset.y&&(c.offset.y=e)}l.prototype._update.call(this);return this},flagReset:function(){this._flagTexture=this._flagColumns=
this._flagRows=this._flagFrameRate=!1;l.prototype.flagReset.call(this);return this}});h.MakeObservable(h.prototype)})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){var k=c.Utils,m=c.Path,l=c.Rectangle,h=c.ImageSequence=function(d,e,a,g){m.call(this,[new c.Anchor,new c.Anchor,new c.Anchor,new c.Anchor],!0);this._renderer.flagTextures=k.bind(h.FlagTextures,this);this._renderer.bindTextures=k.bind(h.BindTextures,this);this._renderer.unbindTextures=k.bind(h.UnbindTextures,this);this.noStroke();this.noFill();this.textures=k.map(d,h.GenerateTexture,this);this._update();this.translation.set(e||0,a||0);k.isNumber(g)?this.frameRate=g:this.frameRate=h.DefaultFrameRate};
k.extend(h,{Properties:["frameRate","index"],DefaultFrameRate:30,FlagTextures:function(){this._flagTextures=!0},BindTextures:function(d){for(var e=d.length;e--;)d[e].bind(c.Events.change,this._renderer.flagTextures);this._renderer.flagTextures()},UnbindTextures:function(d){for(var e=d.length;e--;)d[e].unbind(c.Events.change,this._renderer.flagTextures);this._renderer.flagTextures()},MakeObservable:function(d){l.MakeObservable(d);k.each(h.Properties,c.Utils.defineProperty,d);Object.defineProperty(d,
"textures",{enumerable:!0,get:function(){return this._textures},set:function(d){var a=this._renderer.bindTextures,e=this._renderer.unbindTextures;this._textures&&this._textures.unbind(c.Events.insert,a).unbind(c.Events.remove,e);this._textures=new c.Utils.Collection((d||[]).slice(0));this._textures.bind(c.Events.insert,a).bind(c.Events.remove,e);a(this._textures)}})},GenerateTexture:function(d){if(d instanceof c.Texture)return d;if(k.isString(d))return new c.Texture(d)}});k.extend(h.prototype,l.prototype,
{_flagTextures:!1,_flagFrameRate:!1,_flagIndex:!1,_amount:1,_duration:0,_index:0,_startTime:0,_playing:!1,_firstFrame:0,_lastFrame:0,_loop:!0,_textures:null,_frameRate:0,play:function(c,e,a){this._playing=!0;this._firstFrame=0;this._lastFrame=this.amount-1;this._startTime=k.performance.now();k.isNumber(c)&&(this._firstFrame=c);k.isNumber(e)&&(this._lastFrame=e);k.isFunction(a)?this._onLastFrame=a:delete this._onLastFrame;this._index!==this._firstFrame&&(this._startTime-=1E3*Math.abs(this._index-this._firstFrame)/
this._frameRate);return this},pause:function(){this._playing=!1;return this},stop:function(){this._playing=!1;this._index=0;return this},clone:function(c){c=c||this.parent;var d=new h(this.textures,this.translation.x,this.translation.y,this.frameRate);d._loop=this._loop;this._playing&&d.play();c&&c.add(d);return d},_update:function(){var d=this._textures;this._flagTextures&&(this._amount=d.length);this._flagFrameRate&&(this._duration=1E3*this._amount/this._frameRate);if(this._playing&&0<this._frameRate){var e=
this._amount;k.isNaN(this._lastFrame)&&(this._lastFrame=e-1);e=k.performance.now()-this._startTime;var a=this._lastFrame+1;var g=1E3*(a-this._firstFrame)/this._frameRate;e=this._loop?e%g:Math.min(e,g);e=k.lerp(this._firstFrame,a,e/g);e=Math.floor(e);e!==this._index&&(this._index=e,a=d[this._index],a.loaded&&(d=a.image.width,g=a.image.height,this.width!==d&&(this.width=d),this.height!==g&&(this.height=g),this.fill=a,e>=this._lastFrame-1&&this._onLastFrame&&this._onLastFrame()))}else!this._flagIndex&&
this.fill instanceof c.Texture||(a=d[this._index],a.loaded&&(d=a.image.width,g=a.image.height,this.width!==d&&(this.width=d),this.height!==g&&(this.height=g)),this.fill=a);l.prototype._update.call(this);return this},flagReset:function(){this._flagTextures=this._flagFrameRate=!1;l.prototype.flagReset.call(this);return this}});h.MakeObservable(h.prototype)})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);
(function(c){function k(a,c){var d=a.parent;if(d===c)this.additions.push(a),this._flagAdditions=!0;else{if(d&&d.children.ids[a.id]){var e=h.indexOf(d.children,a);d.children.splice(e,1);e=h.indexOf(d.additions,a);0<=e?d.additions.splice(e,1):(d.subtractions.push(a),d._flagSubtractions=!0)}c?(a.parent=c,this.additions.push(a),this._flagAdditions=!0):(e=h.indexOf(this.additions,a),0<=e?this.additions.splice(e,1):(this.subtractions.push(a),this._flagSubtractions=!0),delete a.parent)}}var m=Math.min,l=
Math.max,h=c.Utils,d=function(){c.Utils.Collection.apply(this,arguments);Object.defineProperty(this,"_events",{value:{},enumerable:!1});this.ids={};this.on(c.Events.insert,this.attach);this.on(c.Events.remove,this.detach);d.prototype.attach.apply(this,arguments)};d.prototype=new c.Utils.Collection;d.prototype.constructor=d;h.extend(d.prototype,{attach:function(a){for(var c=0;c<a.length;c++)this.ids[a[c].id]=a[c];return this},detach:function(a){for(var c=0;c<a.length;c++)delete this.ids[a[c].id];return this}});
var e=c.Group=function(){c.Shape.call(this,!0);this._renderer.type="group";this.additions=[];this.subtractions=[];this.children=arguments};h.extend(e,{Children:d,InsertChildren:function(a){for(var c=0;c<a.length;c++)k.call(this,a[c],this)},RemoveChildren:function(a){for(var c=0;c<a.length;c++)k.call(this,a[c])},OrderChildren:function(a){this._flagOrder=!0},MakeObservable:function(a){var g=c.Path.Properties.slice(0),k=h.indexOf(g,"opacity");0<=k&&(g.splice(k,1),Object.defineProperty(a,"opacity",{enumerable:!0,
get:function(){return this._opacity},set:function(a){this._flagOpacity=this._opacity!=a;this._opacity=a}}));c.Shape.MakeObservable(a);e.MakeGetterSetters(a,g);Object.defineProperty(a,"children",{enumerable:!0,get:function(){return this._children},set:function(a){var g=h.bind(e.InsertChildren,this),f=h.bind(e.RemoveChildren,this),k=h.bind(e.OrderChildren,this);this._children&&this._children.unbind();this._children=new d(a);this._children.bind(c.Events.insert,g);this._children.bind(c.Events.remove,
f);this._children.bind(c.Events.order,k)}});Object.defineProperty(a,"mask",{enumerable:!0,get:function(){return this._mask},set:function(a){this._mask=a;this._flagMask=!0;a.clip||(a.clip=!0)}})},MakeGetterSetters:function(a,c){h.isArray(c)||(c=[c]);h.each(c,function(c){e.MakeGetterSetter(a,c)})},MakeGetterSetter:function(a,c){var d="_"+c;Object.defineProperty(a,c,{enumerable:!0,get:function(){return this[d]},set:function(a){this[d]=a;h.each(this.children,function(d){d[c]=a})}})}});h.extend(e.prototype,
c.Shape.prototype,{_flagAdditions:!1,_flagSubtractions:!1,_flagOrder:!1,_flagOpacity:!0,_flagMask:!1,_fill:"#fff",_stroke:"#000",_linewidth:1,_opacity:1,_visible:!0,_cap:"round",_join:"round",_miter:4,_closed:!0,_curved:!1,_automatic:!0,_beginning:0,_ending:1,_mask:null,clone:function(a){a=a||this.parent;var c=new e,d=h.map(this.children,function(a){return a.clone(c)});c.add(d);c.opacity=this.opacity;this.mask&&(c.mask=this.mask);c.translation.copy(this.translation);c.rotation=this.rotation;c.scale=
this.scale;a&&a.add(c);return c},toObject:function(){var a={children:[],translation:this.translation.toObject(),rotation:this.rotation,scale:this.scale,opacity:this.opacity,mask:this.mask?this.mask.toObject():null};h.each(this.children,function(c,d){a.children[d]=c.toObject()},this);return a},corner:function(){var a=this.getBoundingClientRect(!0),c={x:a.left,y:a.top};this.children.forEach(function(a){a.translation.subSelf(c)});return this},center:function(){var a=this.getBoundingClientRect(!0);a.centroid=
{x:a.left+a.width/2,y:a.top+a.height/2};this.children.forEach(function(c){c.isShape&&c.translation.subSelf(a.centroid)});return this},getById:function(a){var c=function(a,d){if(a.id===d)return a;if(a.children)for(var e=a.children.length;e--;){var f=c(a.children[e],d);if(f)return f}};return c(this,a)||null},getByClassName:function(a){var c=[],d=function(a,e){-1!=a.classList.indexOf(e)?c.push(a):a.children&&a.children.forEach(function(a){d(a,e)});return c};return d(this,a)},getByType:function(a){var d=
[],e=function(a,g){for(var f in a.children)a.children[f]instanceof g?d.push(a.children[f]):a.children[f]instanceof c.Group&&e(a.children[f],g);return d};return e(this,a)},add:function(a){a=a instanceof Array?a.slice():h.toArray(arguments);for(var c=0;c<a.length;c++)a[c]&&a[c].id&&this.children.push(a[c]);return this},remove:function(a){var c=this.parent;if(0>=arguments.length&&c)return c.remove(this),this;a=a instanceof Array?a.slice():h.toArray(arguments);for(c=0;c<a.length;c++)a[c]&&this.children.ids[a[c].id]&&
this.children.splice(h.indexOf(this.children,a[c]),1);return this},getBoundingClientRect:function(a){var c;this._update(!0);var d=Infinity,e=-Infinity,k=Infinity,v=-Infinity;this.children.forEach(function(f){/(linear-gradient|radial-gradient|gradient)/.test(f._renderer.type)||(c=f.getBoundingClientRect(a),h.isNumber(c.top)&&h.isNumber(c.left)&&h.isNumber(c.right)&&h.isNumber(c.bottom)&&(k=m(c.top,k),d=m(c.left,d),e=l(c.right,e),v=l(c.bottom,v)))},this);return{top:k,left:d,right:e,bottom:v,width:e-
d,height:v-k}},noFill:function(){this.children.forEach(function(a){a.noFill()});return this},noStroke:function(){this.children.forEach(function(a){a.noStroke()});return this},subdivide:function(){var a=arguments;this.children.forEach(function(c){c.subdivide.apply(c,a)});return this},flagReset:function(){this._flagAdditions&&(this.additions.length=0,this._flagAdditions=!1);this._flagSubtractions&&(this.subtractions.length=0,this._flagSubtractions=!1);this._flagOrder=this._flagMask=this._flagOpacity=
!1;c.Shape.prototype.flagReset.call(this);return this}});e.MakeObservable(e.prototype)})(("undefined"!==typeof __webpack_require__.g?__webpack_require__.g:this).Two);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var twojs_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! twojs-ts */ "./node_modules/twojs-ts/two.js");
/* harmony import */ var twojs_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(twojs_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _entities_Player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entities/Player */ "./src/entities/Player.ts");
/* harmony import */ var _entities_Score__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./entities/Score */ "./src/entities/Score.ts");
/* harmony import */ var _entities_Title__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./entities/Title */ "./src/entities/Title.ts");
/* harmony import */ var _observables_deltaTime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./observables/deltaTime */ "./src/observables/deltaTime.ts");
/* harmony import */ var _observables_gameState__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./observables/gameState */ "./src/observables/gameState.ts");
/* harmony import */ var _observables_enemies__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./observables/enemies */ "./src/observables/enemies.ts");
/* harmony import */ var _observables_userInput__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./observables/userInput */ "./src/observables/userInput.ts");
/* harmony import */ var _observables_userInterface__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./observables/userInterface */ "./src/observables/userInterface.ts");
/* harmony import */ var _observables_player__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./observables/player */ "./src/observables/player.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/observable/fromEvent.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/dist/esm5/internal/operators/tap.js");












const root = document.getElementById('root');
const two = new twojs_ts__WEBPACK_IMPORTED_MODULE_0__({ fullscreen: true }).appendTo(root);
const uiLayer = new twojs_ts__WEBPACK_IMPORTED_MODULE_0__.Group();
const gameLayer = new twojs_ts__WEBPACK_IMPORTED_MODULE_0__.Group();
//  @ts-ignore
two.add(gameLayer, uiLayer);
const player = new _entities_Player__WEBPACK_IMPORTED_MODULE_1__.default(two, gameLayer);
const score = new _entities_Score__WEBPACK_IMPORTED_MODULE_2__.Score(two, uiLayer);
const title = new _entities_Title__WEBPACK_IMPORTED_MODULE_3__.Title(two, 0, 48, uiLayer);
const subtitle = new _entities_Title__WEBPACK_IMPORTED_MODULE_3__.Title(two, 56, 32, uiLayer);
const UI = (0,_observables_userInterface__WEBPACK_IMPORTED_MODULE_8__.Interface)(score, title, subtitle);
(0,rxjs__WEBPACK_IMPORTED_MODULE_10__.fromEvent)(window, 'resize').subscribe(() => {
    title.center();
    subtitle.center();
});
const centerPlayerPawn$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.fromEvent)(window, 'resize').pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.tap)(() => player.reset()));
(0,_observables_gameState__WEBPACK_IMPORTED_MODULE_5__.gameStateSwitch)({
    onStart: [(0,_observables_userInput__WEBPACK_IMPORTED_MODULE_7__.onStart)(player), UI.onStart$, centerPlayerPawn$],
    onPlay: [
        (0,_observables_userInput__WEBPACK_IMPORTED_MODULE_7__.playerMovement)(player),
        (0,_observables_enemies__WEBPACK_IMPORTED_MODULE_6__.spawnEnemies)(two, player, score, gameLayer),
        (0,_observables_player__WEBPACK_IMPORTED_MODULE_9__.playerUpdate)(player),
        UI.onPlay$,
    ],
    onEnd: [(0,_observables_userInput__WEBPACK_IMPORTED_MODULE_7__.startGame)(player), UI.onEnd$],
}).subscribe();
_observables_deltaTime__WEBPACK_IMPORTED_MODULE_4__.deltaTime$.subscribe(() => {
    two.update();
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL0JlaGF2aW9yU3ViamVjdC5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL05vdGlmaWNhdGlvbkZhY3Rvcmllcy5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL09ic2VydmFibGUuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9TY2hlZHVsZXIuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9TdWJqZWN0LmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvU3Vic2NyaWJlci5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL1N1YnNjcmlwdGlvbi5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL29ic2VydmFibGUvY29tYmluZUxhdGVzdC5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL29ic2VydmFibGUvZGVmZXIuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9vYnNlcnZhYmxlL2VtcHR5LmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvb2JzZXJ2YWJsZS9mcm9tLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvb2JzZXJ2YWJsZS9mcm9tQXJyYXkuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9vYnNlcnZhYmxlL2Zyb21FdmVudC5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL29ic2VydmFibGUvb2YuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9vYnNlcnZhYmxlL3RpbWVyLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvb3BlcmF0b3JzL09wZXJhdG9yU3Vic2NyaWJlci5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL29wZXJhdG9ycy9jb21iaW5lTGF0ZXN0LmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvb3BlcmF0b3JzL2NvbWJpbmVMYXRlc3RXaXRoLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvb3BlcmF0b3JzL2V4cGFuZC5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL29wZXJhdG9ycy9maWx0ZXIuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9vcGVyYXRvcnMvZmluYWxpemUuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9vcGVyYXRvcnMvbWFwLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlQWxsLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlSW50ZXJuYWxzLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlTWFwLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlV2l0aC5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL29wZXJhdG9ycy9vYnNlcnZlT24uanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9vcGVyYXRvcnMvcGFpcndpc2UuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9vcGVyYXRvcnMvc2hhcmUuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9vcGVyYXRvcnMvc3dpdGNoTWFwLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvb3BlcmF0b3JzL3Rha2UuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9vcGVyYXRvcnMvdGFrZVdoaWxlLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvb3BlcmF0b3JzL3RhcC5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL29wZXJhdG9ycy93aXRoTGF0ZXN0RnJvbS5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3NjaGVkdWxlZC9zY2hlZHVsZUFycmF5LmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvc2NoZWR1bGVkL3NjaGVkdWxlQXN5bmNJdGVyYWJsZS5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3NjaGVkdWxlZC9zY2hlZHVsZUl0ZXJhYmxlLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvc2NoZWR1bGVkL3NjaGVkdWxlT2JzZXJ2YWJsZS5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3NjaGVkdWxlZC9zY2hlZHVsZVByb21pc2UuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9zY2hlZHVsZWQvc2NoZWR1bGVSZWFkYWJsZVN0cmVhbUxpa2UuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC9zY2hlZHVsZWQvc2NoZWR1bGVkLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvc2NoZWR1bGVyL0FjdGlvbi5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3NjaGVkdWxlci9BbmltYXRpb25GcmFtZUFjdGlvbi5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3NjaGVkdWxlci9BbmltYXRpb25GcmFtZVNjaGVkdWxlci5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3NjaGVkdWxlci9Bc3luY0FjdGlvbi5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3NjaGVkdWxlci9Bc3luY1NjaGVkdWxlci5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3NjaGVkdWxlci9hbmltYXRpb25GcmFtZS5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3NjaGVkdWxlci9hbmltYXRpb25GcmFtZVByb3ZpZGVyLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvc2NoZWR1bGVyL2FzeW5jLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvc2NoZWR1bGVyL2RhdGVUaW1lc3RhbXBQcm92aWRlci5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3NjaGVkdWxlci9pbnRlcnZhbFByb3ZpZGVyLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvc2NoZWR1bGVyL3RpbWVvdXRQcm92aWRlci5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3N5bWJvbC9pdGVyYXRvci5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3N5bWJvbC9vYnNlcnZhYmxlLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvdXRpbC9PYmplY3RVbnN1YnNjcmliZWRFcnJvci5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3V0aWwvVW5zdWJzY3JpcHRpb25FcnJvci5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3V0aWwvYXJncy5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3V0aWwvYXJnc0FyZ0FycmF5T3JPYmplY3QuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL2FyZ3NPckFyZ0FycmF5LmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvdXRpbC9hcnJSZW1vdmUuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL2NhdWdodFNjaGVkdWxlLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvdXRpbC9jcmVhdGVFcnJvckNsYXNzLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvdXRpbC9jcmVhdGVPYmplY3QuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL2lkZW50aXR5LmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvdXRpbC9pc0FycmF5TGlrZS5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3V0aWwvaXNBc3luY0l0ZXJhYmxlLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvdXRpbC9pc0RhdGUuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL2lzRnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL2lzSW50ZXJvcE9ic2VydmFibGUuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL2lzSXRlcmFibGUuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL2lzUHJvbWlzZS5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3V0aWwvaXNSZWFkYWJsZVN0cmVhbUxpa2UuanMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtNS9pbnRlcm5hbC91dGlsL2lzU2NoZWR1bGVyLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvdXRpbC9saWZ0LmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvdXRpbC9tYXBPbmVPck1hbnlBcmdzLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvdXRpbC9ub29wLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvdXRpbC9waXBlLmpzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbTUvaW50ZXJuYWwvdXRpbC9yZXBvcnRVbmhhbmRsZWRFcnJvci5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc201L2ludGVybmFsL3V0aWwvdGhyb3dVbm9ic2VydmFibGVFcnJvci5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vc3JjL2VudGl0aWVzL0VuZW15LnRzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9zcmMvZW50aXRpZXMvUGxheWVyLnRzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9zcmMvZW50aXRpZXMvU2NvcmUudHMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL3NyYy9lbnRpdGllcy9UaXRsZS50cyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vc3JjL29ic2VydmFibGVzL2RlbHRhVGltZS50cyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vc3JjL29ic2VydmFibGVzL2VuZW1pZXMudHMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL3NyYy9vYnNlcnZhYmxlcy9nYW1lU3RhdGUudHMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL3NyYy9vYnNlcnZhYmxlcy9wbGF5ZXIudHMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL3NyYy9vYnNlcnZhYmxlcy91c2VySW5wdXQudHMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL3NyYy9vYnNlcnZhYmxlcy91c2VySW50ZXJmYWNlLnRzIiwid2VicGFjazovL2RvZGdlLWdhbWUvLi9zcmMvdXRpbC50cyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lLy4vbm9kZV9tb2R1bGVzL3R3b2pzLXRzL3R3by5qcyIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2RvZGdlLWdhbWUvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2RvZGdlLWdhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9kb2RnZS1nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZG9kZ2UtZ2FtZS8uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQWtDO0FBQ0U7QUFDcEM7QUFDQSxJQUFJLGdEQUFTO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztB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QUNYO0lBQ0QsS0FBSyxFQUFFLENBQUMsaUVBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDO0NBQ3RDLENBQUMsQ0FBQyxTQUFTLEVBQUU7QUFFZCx3RUFBb0IsQ0FBQyxHQUFHLEVBQUU7SUFDeEIsR0FBRyxDQUFDLE1BQU0sRUFBRTtBQUNkLENBQUMsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBfX2V4dGVuZHMgfSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuL1N1YmplY3QnO1xudmFyIEJlaGF2aW9yU3ViamVjdCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEJlaGF2aW9yU3ViamVjdCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBCZWhhdmlvclN1YmplY3QoX3ZhbHVlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLl92YWx1ZSA9IF92YWx1ZTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQmVoYXZpb3JTdWJqZWN0LnByb3RvdHlwZSwgXCJ2YWx1ZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIEJlaGF2aW9yU3ViamVjdC5wcm90b3R5cGUuX3N1YnNjcmliZSA9IGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgIHZhciBzdWJzY3JpcHRpb24gPSBfc3VwZXIucHJvdG90eXBlLl9zdWJzY3JpYmUuY2FsbCh0aGlzLCBzdWJzY3JpYmVyKTtcbiAgICAgICAgIXN1YnNjcmlwdGlvbi5jbG9zZWQgJiYgc3Vic2NyaWJlci5uZXh0KHRoaXMuX3ZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICB9O1xuICAgIEJlaGF2aW9yU3ViamVjdC5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMsIGhhc0Vycm9yID0gX2EuaGFzRXJyb3IsIHRocm93bkVycm9yID0gX2EudGhyb3duRXJyb3IsIF92YWx1ZSA9IF9hLl92YWx1ZTtcbiAgICAgICAgaWYgKGhhc0Vycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyB0aHJvd25FcnJvcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90aHJvd0lmQ2xvc2VkKCk7XG4gICAgICAgIHJldHVybiBfdmFsdWU7XG4gICAgfTtcbiAgICBCZWhhdmlvclN1YmplY3QucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcywgKHRoaXMuX3ZhbHVlID0gdmFsdWUpKTtcbiAgICB9O1xuICAgIHJldHVybiBCZWhhdmlvclN1YmplY3Q7XG59KFN1YmplY3QpKTtcbmV4cG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QmVoYXZpb3JTdWJqZWN0LmpzLm1hcCIsImV4cG9ydCB2YXIgQ09NUExFVEVfTk9USUZJQ0FUSU9OID0gKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNyZWF0ZU5vdGlmaWNhdGlvbignQycsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTsgfSkoKTtcbmV4cG9ydCBmdW5jdGlvbiBlcnJvck5vdGlmaWNhdGlvbihlcnJvcikge1xuICAgIHJldHVybiBjcmVhdGVOb3RpZmljYXRpb24oJ0UnLCB1bmRlZmluZWQsIGVycm9yKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBuZXh0Tm90aWZpY2F0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGNyZWF0ZU5vdGlmaWNhdGlvbignTicsIHZhbHVlLCB1bmRlZmluZWQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vdGlmaWNhdGlvbihraW5kLCB2YWx1ZSwgZXJyb3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBraW5kOiBraW5kLFxuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGVycm9yOiBlcnJvcixcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Tm90aWZpY2F0aW9uRmFjdG9yaWVzLmpzLm1hcCIsImltcG9ydCB7IFNhZmVTdWJzY3JpYmVyLCBTdWJzY3JpYmVyIH0gZnJvbSAnLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IGlzU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgb2JzZXJ2YWJsZSBhcyBTeW1ib2xfb2JzZXJ2YWJsZSB9IGZyb20gJy4vc3ltYm9sL29ic2VydmFibGUnO1xuaW1wb3J0IHsgcGlwZUZyb21BcnJheSB9IGZyb20gJy4vdXRpbC9waXBlJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL3V0aWwvaXNGdW5jdGlvbic7XG52YXIgT2JzZXJ2YWJsZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gT2JzZXJ2YWJsZShzdWJzY3JpYmUpIHtcbiAgICAgICAgaWYgKHN1YnNjcmliZSkge1xuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlID0gc3Vic2NyaWJlO1xuICAgICAgICB9XG4gICAgfVxuICAgIE9ic2VydmFibGUucHJvdG90eXBlLmxpZnQgPSBmdW5jdGlvbiAob3BlcmF0b3IpIHtcbiAgICAgICAgdmFyIG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgICAgICBvYnNlcnZhYmxlLnNvdXJjZSA9IHRoaXM7XG4gICAgICAgIG9ic2VydmFibGUub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGU7XG4gICAgfTtcbiAgICBPYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiAob2JzZXJ2ZXJPck5leHQsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICB2YXIgc3Vic2NyaWJlciA9IGlzU3Vic2NyaWJlcihvYnNlcnZlck9yTmV4dCkgPyBvYnNlcnZlck9yTmV4dCA6IG5ldyBTYWZlU3Vic2NyaWJlcihvYnNlcnZlck9yTmV4dCwgZXJyb3IsIGNvbXBsZXRlKTtcbiAgICAgICAgaWYgKGNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9kZXByZWNhdGVkU3luY0Vycm9yU3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIF9hID0gdGhpcywgb3BlcmF0b3IgPSBfYS5vcGVyYXRvciwgc291cmNlID0gX2Euc291cmNlO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5hZGQob3BlcmF0b3JcbiAgICAgICAgICAgICAgICA/XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yLmNhbGwoc3Vic2NyaWJlciwgc291cmNlKVxuICAgICAgICAgICAgICAgIDogc291cmNlXG4gICAgICAgICAgICAgICAgICAgID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZShzdWJzY3JpYmVyKVxuICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90cnlTdWJzY3JpYmUoc3Vic2NyaWJlcikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdWJzY3JpYmVyO1xuICAgIH07XG4gICAgT2JzZXJ2YWJsZS5wcm90b3R5cGUuX2RlcHJlY2F0ZWRTeW5jRXJyb3JTdWJzY3JpYmUgPSBmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgbG9jYWxTdWJzY3JpYmVyID0gc3Vic2NyaWJlcjtcbiAgICAgICAgbG9jYWxTdWJzY3JpYmVyLl9zeW5jRXJyb3JIYWNrX2lzU3Vic2NyaWJpbmcgPSB0cnVlO1xuICAgICAgICB2YXIgb3BlcmF0b3IgPSB0aGlzLm9wZXJhdG9yO1xuICAgICAgICBpZiAob3BlcmF0b3IpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuYWRkKG9wZXJhdG9yLmNhbGwoc3Vic2NyaWJlciwgdGhpcy5zb3VyY2UpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5hZGQodGhpcy5fc3Vic2NyaWJlKHN1YnNjcmliZXIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN1YnNjcmliZXIuX19zeW5jRXJyb3IgPSBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlc3QgPSBsb2NhbFN1YnNjcmliZXI7XG4gICAgICAgIHdoaWxlIChkZXN0KSB7XG4gICAgICAgICAgICBpZiAoJ19fc3luY0Vycm9yJyBpbiBkZXN0KSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZGVzdC5fX3N5bmNFcnJvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZXN0ID0gZGVzdC5kZXN0aW5hdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBsb2NhbFN1YnNjcmliZXIuX3N5bmNFcnJvckhhY2tfaXNTdWJzY3JpYmluZyA9IGZhbHNlO1xuICAgIH07XG4gICAgT2JzZXJ2YWJsZS5wcm90b3R5cGUuX3RyeVN1YnNjcmliZSA9IGZ1bmN0aW9uIChzaW5rKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3Vic2NyaWJlKHNpbmspO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHNpbmsuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgT2JzZXJ2YWJsZS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChuZXh0LCBwcm9taXNlQ3Rvcikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBwcm9taXNlQ3RvciA9IGdldFByb21pc2VDdG9yKHByb21pc2VDdG9yKTtcbiAgICAgICAgcmV0dXJuIG5ldyBwcm9taXNlQ3RvcihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICB2YXIgc3Vic2NyaXB0aW9uO1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uID0gX3RoaXMuc3Vic2NyaWJlKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24gPT09IG51bGwgfHwgc3Vic2NyaXB0aW9uID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCByZWplY3QsIHJlc29sdmUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE9ic2VydmFibGUucHJvdG90eXBlLl9zdWJzY3JpYmUgPSBmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoX2EgPSB0aGlzLnNvdXJjZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9O1xuICAgIE9ic2VydmFibGUucHJvdG90eXBlW1N5bWJvbF9vYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBPYnNlcnZhYmxlLnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgb3BlcmF0aW9ucyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgb3BlcmF0aW9uc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcGVyYXRpb25zLmxlbmd0aCA/IHBpcGVGcm9tQXJyYXkob3BlcmF0aW9ucykodGhpcykgOiB0aGlzO1xuICAgIH07XG4gICAgT2JzZXJ2YWJsZS5wcm90b3R5cGUudG9Qcm9taXNlID0gZnVuY3Rpb24gKHByb21pc2VDdG9yKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHByb21pc2VDdG9yID0gZ2V0UHJvbWlzZUN0b3IocHJvbWlzZUN0b3IpO1xuICAgICAgICByZXR1cm4gbmV3IHByb21pc2VDdG9yKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgICAgIF90aGlzLnN1YnNjcmliZShmdW5jdGlvbiAoeCkgeyByZXR1cm4gKHZhbHVlID0geCk7IH0sIGZ1bmN0aW9uIChlcnIpIHsgcmV0dXJuIHJlamVjdChlcnIpOyB9LCBmdW5jdGlvbiAoKSB7IHJldHVybiByZXNvbHZlKHZhbHVlKTsgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgT2JzZXJ2YWJsZS5jcmVhdGUgPSBmdW5jdGlvbiAoc3Vic2NyaWJlKSB7XG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmUpO1xuICAgIH07XG4gICAgcmV0dXJuIE9ic2VydmFibGU7XG59KCkpO1xuZXhwb3J0IHsgT2JzZXJ2YWJsZSB9O1xuZnVuY3Rpb24gZ2V0UHJvbWlzZUN0b3IocHJvbWlzZUN0b3IpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIChfYSA9IHByb21pc2VDdG9yICE9PSBudWxsICYmIHByb21pc2VDdG9yICE9PSB2b2lkIDAgPyBwcm9taXNlQ3RvciA6IGNvbmZpZy5Qcm9taXNlKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBQcm9taXNlO1xufVxuZnVuY3Rpb24gaXNPYnNlcnZlcih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiBpc0Z1bmN0aW9uKHZhbHVlLm5leHQpICYmIGlzRnVuY3Rpb24odmFsdWUuZXJyb3IpICYmIGlzRnVuY3Rpb24odmFsdWUuY29tcGxldGUpO1xufVxuZnVuY3Rpb24gaXNTdWJzY3JpYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuICh2YWx1ZSAmJiB2YWx1ZSBpbnN0YW5jZW9mIFN1YnNjcmliZXIpIHx8IChpc09ic2VydmVyKHZhbHVlKSAmJiBpc1N1YnNjcmlwdGlvbih2YWx1ZSkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9T2JzZXJ2YWJsZS5qcy5tYXAiLCJpbXBvcnQgeyBkYXRlVGltZXN0YW1wUHJvdmlkZXIgfSBmcm9tICcuL3NjaGVkdWxlci9kYXRlVGltZXN0YW1wUHJvdmlkZXInO1xudmFyIFNjaGVkdWxlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2NoZWR1bGVyKHNjaGVkdWxlckFjdGlvbkN0b3IsIG5vdykge1xuICAgICAgICBpZiAobm93ID09PSB2b2lkIDApIHsgbm93ID0gU2NoZWR1bGVyLm5vdzsgfVxuICAgICAgICB0aGlzLnNjaGVkdWxlckFjdGlvbkN0b3IgPSBzY2hlZHVsZXJBY3Rpb25DdG9yO1xuICAgICAgICB0aGlzLm5vdyA9IG5vdztcbiAgICB9XG4gICAgU2NoZWR1bGVyLnByb3RvdHlwZS5zY2hlZHVsZSA9IGZ1bmN0aW9uICh3b3JrLCBkZWxheSwgc3RhdGUpIHtcbiAgICAgICAgaWYgKGRlbGF5ID09PSB2b2lkIDApIHsgZGVsYXkgPSAwOyB9XG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5zY2hlZHVsZXJBY3Rpb25DdG9yKHRoaXMsIHdvcmspLnNjaGVkdWxlKHN0YXRlLCBkZWxheSk7XG4gICAgfTtcbiAgICBTY2hlZHVsZXIubm93ID0gZGF0ZVRpbWVzdGFtcFByb3ZpZGVyLm5vdztcbiAgICByZXR1cm4gU2NoZWR1bGVyO1xufSgpKTtcbmV4cG9ydCB7IFNjaGVkdWxlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U2NoZWR1bGVyLmpzLm1hcCIsImltcG9ydCB7IF9fZXh0ZW5kcywgX192YWx1ZXMgfSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uLCBFTVBUWV9TVUJTQ1JJUFRJT04gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBPYmplY3RVbnN1YnNjcmliZWRFcnJvciB9IGZyb20gJy4vdXRpbC9PYmplY3RVbnN1YnNjcmliZWRFcnJvcic7XG5pbXBvcnQgeyBhcnJSZW1vdmUgfSBmcm9tICcuL3V0aWwvYXJyUmVtb3ZlJztcbnZhciBTdWJqZWN0ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU3ViamVjdCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTdWJqZWN0KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5jbG9zZWQgPSBmYWxzZTtcbiAgICAgICAgX3RoaXMub2JzZXJ2ZXJzID0gW107XG4gICAgICAgIF90aGlzLmlzU3RvcHBlZCA9IGZhbHNlO1xuICAgICAgICBfdGhpcy5oYXNFcnJvciA9IGZhbHNlO1xuICAgICAgICBfdGhpcy50aHJvd25FcnJvciA9IG51bGw7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgU3ViamVjdC5wcm90b3R5cGUubGlmdCA9IGZ1bmN0aW9uIChvcGVyYXRvcikge1xuICAgICAgICB2YXIgc3ViamVjdCA9IG5ldyBBbm9ueW1vdXNTdWJqZWN0KHRoaXMsIHRoaXMpO1xuICAgICAgICBzdWJqZWN0Lm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHJldHVybiBzdWJqZWN0O1xuICAgIH07XG4gICAgU3ViamVjdC5wcm90b3R5cGUuX3Rocm93SWZDbG9zZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YmplY3QucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIGVfMSwgX2E7XG4gICAgICAgIHRoaXMuX3Rocm93SWZDbG9zZWQoKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgdmFyIGNvcHkgPSB0aGlzLm9ic2VydmVycy5zbGljZSgpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBjb3B5XzEgPSBfX3ZhbHVlcyhjb3B5KSwgY29weV8xXzEgPSBjb3B5XzEubmV4dCgpOyAhY29weV8xXzEuZG9uZTsgY29weV8xXzEgPSBjb3B5XzEubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvYnNlcnZlciA9IGNvcHlfMV8xLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxuICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvcHlfMV8xICYmICFjb3B5XzFfMS5kb25lICYmIChfYSA9IGNvcHlfMS5yZXR1cm4pKSBfYS5jYWxsKGNvcHlfMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgU3ViamVjdC5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIHRoaXMuX3Rocm93SWZDbG9zZWQoKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgdGhpcy5oYXNFcnJvciA9IHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMudGhyb3duRXJyb3IgPSBlcnI7XG4gICAgICAgICAgICB2YXIgb2JzZXJ2ZXJzID0gdGhpcy5vYnNlcnZlcnM7XG4gICAgICAgICAgICB3aGlsZSAob2JzZXJ2ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIG9ic2VydmVycy5zaGlmdCgpLmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YmplY3QucHJvdG90eXBlLmNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl90aHJvd0lmQ2xvc2VkKCk7XG4gICAgICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBvYnNlcnZlcnMgPSB0aGlzLm9ic2VydmVycztcbiAgICAgICAgICAgIHdoaWxlIChvYnNlcnZlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXJzLnNoaWZ0KCkuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgU3ViamVjdC5wcm90b3R5cGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdGhpcy5jbG9zZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm9ic2VydmVycyA9IG51bGw7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3ViamVjdC5wcm90b3R5cGUsIFwib2JzZXJ2ZWRcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIHJldHVybiAoKF9hID0gdGhpcy5vYnNlcnZlcnMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZW5ndGgpID4gMDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIFN1YmplY3QucHJvdG90eXBlLl90cnlTdWJzY3JpYmUgPSBmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgICAgICB0aGlzLl90aHJvd0lmQ2xvc2VkKCk7XG4gICAgICAgIHJldHVybiBfc3VwZXIucHJvdG90eXBlLl90cnlTdWJzY3JpYmUuY2FsbCh0aGlzLCBzdWJzY3JpYmVyKTtcbiAgICB9O1xuICAgIFN1YmplY3QucHJvdG90eXBlLl9zdWJzY3JpYmUgPSBmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgICAgICB0aGlzLl90aHJvd0lmQ2xvc2VkKCk7XG4gICAgICAgIHRoaXMuX2NoZWNrRmluYWxpemVkU3RhdHVzZXMoc3Vic2NyaWJlcik7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbm5lclN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9O1xuICAgIFN1YmplY3QucHJvdG90eXBlLl9pbm5lclN1YnNjcmliZSA9IGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMsIGhhc0Vycm9yID0gX2EuaGFzRXJyb3IsIGlzU3RvcHBlZCA9IF9hLmlzU3RvcHBlZCwgb2JzZXJ2ZXJzID0gX2Eub2JzZXJ2ZXJzO1xuICAgICAgICByZXR1cm4gaGFzRXJyb3IgfHwgaXNTdG9wcGVkXG4gICAgICAgICAgICA/IEVNUFRZX1NVQlNDUklQVElPTlxuICAgICAgICAgICAgOiAob2JzZXJ2ZXJzLnB1c2goc3Vic2NyaWJlciksIG5ldyBTdWJzY3JpcHRpb24oZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJyUmVtb3ZlKG9ic2VydmVycywgc3Vic2NyaWJlcik7IH0pKTtcbiAgICB9O1xuICAgIFN1YmplY3QucHJvdG90eXBlLl9jaGVja0ZpbmFsaXplZFN0YXR1c2VzID0gZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICAgICAgdmFyIF9hID0gdGhpcywgaGFzRXJyb3IgPSBfYS5oYXNFcnJvciwgdGhyb3duRXJyb3IgPSBfYS50aHJvd25FcnJvciwgaXNTdG9wcGVkID0gX2EuaXNTdG9wcGVkO1xuICAgICAgICBpZiAoaGFzRXJyb3IpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3IodGhyb3duRXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzU3RvcHBlZCkge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTdWJqZWN0LnByb3RvdHlwZS5hc09ic2VydmFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUoKTtcbiAgICAgICAgb2JzZXJ2YWJsZS5zb3VyY2UgPSB0aGlzO1xuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgICB9O1xuICAgIFN1YmplY3QuY3JlYXRlID0gZnVuY3Rpb24gKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbm9ueW1vdXNTdWJqZWN0KGRlc3RpbmF0aW9uLCBzb3VyY2UpO1xuICAgIH07XG4gICAgcmV0dXJuIFN1YmplY3Q7XG59KE9ic2VydmFibGUpKTtcbmV4cG9ydCB7IFN1YmplY3QgfTtcbnZhciBBbm9ueW1vdXNTdWJqZWN0ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQW5vbnltb3VzU3ViamVjdCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBBbm9ueW1vdXNTdWJqZWN0KGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICAgICAgX3RoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIEFub255bW91c1N1YmplY3QucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgKF9iID0gKF9hID0gdGhpcy5kZXN0aW5hdGlvbikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5leHQpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jYWxsKF9hLCB2YWx1ZSk7XG4gICAgfTtcbiAgICBBbm9ueW1vdXNTdWJqZWN0LnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgKF9iID0gKF9hID0gdGhpcy5kZXN0aW5hdGlvbikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmVycm9yKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChfYSwgZXJyKTtcbiAgICB9O1xuICAgIEFub255bW91c1N1YmplY3QucHJvdG90eXBlLmNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAoX2IgPSAoX2EgPSB0aGlzLmRlc3RpbmF0aW9uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY29tcGxldGUpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jYWxsKF9hKTtcbiAgICB9O1xuICAgIEFub255bW91c1N1YmplY3QucHJvdG90eXBlLl9zdWJzY3JpYmUgPSBmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICByZXR1cm4gKF9iID0gKF9hID0gdGhpcy5zb3VyY2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zdWJzY3JpYmUoc3Vic2NyaWJlcikpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IEVNUFRZX1NVQlNDUklQVElPTjtcbiAgICB9O1xuICAgIHJldHVybiBBbm9ueW1vdXNTdWJqZWN0O1xufShTdWJqZWN0KSk7XG5leHBvcnQgeyBBbm9ueW1vdXNTdWJqZWN0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1TdWJqZWN0LmpzLm1hcCIsImltcG9ydCB7IF9fZXh0ZW5kcywgX19yZWFkLCBfX3NwcmVhZEFycmF5IH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgaXNTdWJzY3JpcHRpb24sIFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IHJlcG9ydFVuaGFuZGxlZEVycm9yIH0gZnJvbSAnLi91dGlsL3JlcG9ydFVuaGFuZGxlZEVycm9yJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuL3V0aWwvbm9vcCc7XG5pbXBvcnQgeyBuZXh0Tm90aWZpY2F0aW9uLCBlcnJvck5vdGlmaWNhdGlvbiwgQ09NUExFVEVfTk9USUZJQ0FUSU9OIH0gZnJvbSAnLi9Ob3RpZmljYXRpb25GYWN0b3JpZXMnO1xuaW1wb3J0IHsgdGltZW91dFByb3ZpZGVyIH0gZnJvbSAnLi9zY2hlZHVsZXIvdGltZW91dFByb3ZpZGVyJztcbnZhciBTdWJzY3JpYmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU3Vic2NyaWJlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTdWJzY3JpYmVyKGRlc3RpbmF0aW9uKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmlzU3RvcHBlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoZGVzdGluYXRpb24pIHtcbiAgICAgICAgICAgIF90aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XG4gICAgICAgICAgICBpZiAoaXNTdWJzY3JpcHRpb24oZGVzdGluYXRpb24pKSB7XG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb24uYWRkKF90aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIF90aGlzLmRlc3RpbmF0aW9uID0gRU1QVFlfT0JTRVJWRVI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBTdWJzY3JpYmVyLmNyZWF0ZSA9IGZ1bmN0aW9uIChuZXh0LCBlcnJvciwgY29tcGxldGUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTYWZlU3Vic2NyaWJlcihuZXh0LCBlcnJvciwgY29tcGxldGUpO1xuICAgIH07XG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgICAgICAgIGhhbmRsZVN0b3BwZWROb3RpZmljYXRpb24obmV4dE5vdGlmaWNhdGlvbih2YWx1ZSksIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbmV4dCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAodGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgICAgICAgIGhhbmRsZVN0b3BwZWROb3RpZmljYXRpb24oZXJyb3JOb3RpZmljYXRpb24oZXJyKSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTdWJzY3JpYmVyLnByb3RvdHlwZS5jb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICAgICAgICBoYW5kbGVTdG9wcGVkTm90aWZpY2F0aW9uKENPTVBMRVRFX05PVElGSUNBVElPTiwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTdWJzY3JpYmVyLnByb3RvdHlwZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNsb3NlZCkge1xuICAgICAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS51bnN1YnNjcmliZS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLl9uZXh0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dCh2YWx1ZSk7XG4gICAgfTtcbiAgICBTdWJzY3JpYmVyLnByb3RvdHlwZS5fZXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLl9jb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIFN1YnNjcmliZXI7XG59KFN1YnNjcmlwdGlvbikpO1xuZXhwb3J0IHsgU3Vic2NyaWJlciB9O1xudmFyIFNhZmVTdWJzY3JpYmVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU2FmZVN1YnNjcmliZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU2FmZVN1YnNjcmliZXIob2JzZXJ2ZXJPck5leHQsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICB2YXIgbmV4dDtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24ob2JzZXJ2ZXJPck5leHQpKSB7XG4gICAgICAgICAgICBuZXh0ID0gb2JzZXJ2ZXJPck5leHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob2JzZXJ2ZXJPck5leHQpIHtcbiAgICAgICAgICAgIChuZXh0ID0gb2JzZXJ2ZXJPck5leHQubmV4dCwgZXJyb3IgPSBvYnNlcnZlck9yTmV4dC5lcnJvciwgY29tcGxldGUgPSBvYnNlcnZlck9yTmV4dC5jb21wbGV0ZSk7XG4gICAgICAgICAgICB2YXIgY29udGV4dF8xO1xuICAgICAgICAgICAgaWYgKF90aGlzICYmIGNvbmZpZy51c2VEZXByZWNhdGVkTmV4dENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0XzEgPSBPYmplY3QuY3JlYXRlKG9ic2VydmVyT3JOZXh0KTtcbiAgICAgICAgICAgICAgICBjb250ZXh0XzEudW5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy51bnN1YnNjcmliZSgpOyB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF8xID0gb2JzZXJ2ZXJPck5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXh0ID0gbmV4dCA9PT0gbnVsbCB8fCBuZXh0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBuZXh0LmJpbmQoY29udGV4dF8xKTtcbiAgICAgICAgICAgIGVycm9yID0gZXJyb3IgPT09IG51bGwgfHwgZXJyb3IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVycm9yLmJpbmQoY29udGV4dF8xKTtcbiAgICAgICAgICAgIGNvbXBsZXRlID0gY29tcGxldGUgPT09IG51bGwgfHwgY29tcGxldGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNvbXBsZXRlLmJpbmQoY29udGV4dF8xKTtcbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5kZXN0aW5hdGlvbiA9IHtcbiAgICAgICAgICAgIG5leHQ6IG5leHQgPyB3cmFwRm9yRXJyb3JIYW5kbGluZyhuZXh0LCBfdGhpcykgOiBub29wLFxuICAgICAgICAgICAgZXJyb3I6IHdyYXBGb3JFcnJvckhhbmRsaW5nKGVycm9yICE9PSBudWxsICYmIGVycm9yICE9PSB2b2lkIDAgPyBlcnJvciA6IGRlZmF1bHRFcnJvckhhbmRsZXIsIF90aGlzKSxcbiAgICAgICAgICAgIGNvbXBsZXRlOiBjb21wbGV0ZSA/IHdyYXBGb3JFcnJvckhhbmRsaW5nKGNvbXBsZXRlLCBfdGhpcykgOiBub29wLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBTYWZlU3Vic2NyaWJlcjtcbn0oU3Vic2NyaWJlcikpO1xuZXhwb3J0IHsgU2FmZVN1YnNjcmliZXIgfTtcbmZ1bmN0aW9uIHdyYXBGb3JFcnJvckhhbmRsaW5nKGhhbmRsZXIsIGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaGFuZGxlci5hcHBseSh2b2lkIDAsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChhcmdzKSkpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZS5fc3luY0Vycm9ySGFja19pc1N1YnNjcmliaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLl9fc3luY0Vycm9yID0gZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlcG9ydFVuaGFuZGxlZEVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gZGVmYXVsdEVycm9ySGFuZGxlcihlcnIpIHtcbiAgICB0aHJvdyBlcnI7XG59XG5mdW5jdGlvbiBoYW5kbGVTdG9wcGVkTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvbiwgc3Vic2NyaWJlcikge1xuICAgIHZhciBvblN0b3BwZWROb3RpZmljYXRpb24gPSBjb25maWcub25TdG9wcGVkTm90aWZpY2F0aW9uO1xuICAgIG9uU3RvcHBlZE5vdGlmaWNhdGlvbiAmJiB0aW1lb3V0UHJvdmlkZXIuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHJldHVybiBvblN0b3BwZWROb3RpZmljYXRpb24obm90aWZpY2F0aW9uLCBzdWJzY3JpYmVyKTsgfSk7XG59XG5leHBvcnQgdmFyIEVNUFRZX09CU0VSVkVSID0ge1xuICAgIGNsb3NlZDogdHJ1ZSxcbiAgICBuZXh0OiBub29wLFxuICAgIGVycm9yOiBkZWZhdWx0RXJyb3JIYW5kbGVyLFxuICAgIGNvbXBsZXRlOiBub29wLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVN1YnNjcmliZXIuanMubWFwIiwiaW1wb3J0IHsgX19yZWFkLCBfX3NwcmVhZEFycmF5LCBfX3ZhbHVlcyB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IFVuc3Vic2NyaXB0aW9uRXJyb3IgfSBmcm9tICcuL3V0aWwvVW5zdWJzY3JpcHRpb25FcnJvcic7XG5pbXBvcnQgeyBhcnJSZW1vdmUgfSBmcm9tICcuL3V0aWwvYXJyUmVtb3ZlJztcbnZhciBTdWJzY3JpcHRpb24gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFN1YnNjcmlwdGlvbihpbml0aWFsVGVhcmRvd24pIHtcbiAgICAgICAgdGhpcy5pbml0aWFsVGVhcmRvd24gPSBpbml0aWFsVGVhcmRvd247XG4gICAgICAgIHRoaXMuY2xvc2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3BhcmVudGFnZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3RlYXJkb3ducyA9IG51bGw7XG4gICAgfVxuICAgIFN1YnNjcmlwdGlvbi5wcm90b3R5cGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlXzEsIF9hLCBlXzIsIF9iO1xuICAgICAgICB2YXIgZXJyb3JzO1xuICAgICAgICBpZiAoIXRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgICAgICAgICB2YXIgX3BhcmVudGFnZSA9IHRoaXMuX3BhcmVudGFnZTtcbiAgICAgICAgICAgIGlmIChfcGFyZW50YWdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGFyZW50YWdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShfcGFyZW50YWdlKSkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX3BhcmVudGFnZV8xID0gX192YWx1ZXMoX3BhcmVudGFnZSksIF9wYXJlbnRhZ2VfMV8xID0gX3BhcmVudGFnZV8xLm5leHQoKTsgIV9wYXJlbnRhZ2VfMV8xLmRvbmU7IF9wYXJlbnRhZ2VfMV8xID0gX3BhcmVudGFnZV8xLm5leHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJlbnRfMSA9IF9wYXJlbnRhZ2VfMV8xLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudF8xLnJlbW92ZSh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxuICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9wYXJlbnRhZ2VfMV8xICYmICFfcGFyZW50YWdlXzFfMS5kb25lICYmIChfYSA9IF9wYXJlbnRhZ2VfMS5yZXR1cm4pKSBfYS5jYWxsKF9wYXJlbnRhZ2VfMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF9wYXJlbnRhZ2UucmVtb3ZlKHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBpbml0aWFsVGVhcmRvd24gPSB0aGlzLmluaXRpYWxUZWFyZG93bjtcbiAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKGluaXRpYWxUZWFyZG93bikpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpbml0aWFsVGVhcmRvd24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gZSBpbnN0YW5jZW9mIFVuc3Vic2NyaXB0aW9uRXJyb3IgPyBlLmVycm9ycyA6IFtlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgX3RlYXJkb3ducyA9IHRoaXMuX3RlYXJkb3ducztcbiAgICAgICAgICAgIGlmIChfdGVhcmRvd25zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGVhcmRvd25zID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfdGVhcmRvd25zXzEgPSBfX3ZhbHVlcyhfdGVhcmRvd25zKSwgX3RlYXJkb3duc18xXzEgPSBfdGVhcmRvd25zXzEubmV4dCgpOyAhX3RlYXJkb3duc18xXzEuZG9uZTsgX3RlYXJkb3duc18xXzEgPSBfdGVhcmRvd25zXzEubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVhcmRvd25fMSA9IF90ZWFyZG93bnNfMV8xLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGVjVGVhcmRvd24odGVhcmRvd25fMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gZXJyb3JzICE9PSBudWxsICYmIGVycm9ycyAhPT0gdm9pZCAwID8gZXJyb3JzIDogW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIFVuc3Vic2NyaXB0aW9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoZXJyb3JzKSksIF9fcmVhZChlcnIuZXJyb3JzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZV8yXzEpIHsgZV8yID0geyBlcnJvcjogZV8yXzEgfTsgfVxuICAgICAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF90ZWFyZG93bnNfMV8xICYmICFfdGVhcmRvd25zXzFfMS5kb25lICYmIChfYiA9IF90ZWFyZG93bnNfMS5yZXR1cm4pKSBfYi5jYWxsKF90ZWFyZG93bnNfMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjsgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlcnJvcnMpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVW5zdWJzY3JpcHRpb25FcnJvcihlcnJvcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBTdWJzY3JpcHRpb24ucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh0ZWFyZG93bikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICh0ZWFyZG93biAmJiB0ZWFyZG93biAhPT0gdGhpcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgZXhlY1RlYXJkb3duKHRlYXJkb3duKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0ZWFyZG93biBpbnN0YW5jZW9mIFN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGVhcmRvd24uY2xvc2VkIHx8IHRlYXJkb3duLl9oYXNQYXJlbnQodGhpcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0ZWFyZG93bi5fYWRkUGFyZW50KHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAodGhpcy5fdGVhcmRvd25zID0gKF9hID0gdGhpcy5fdGVhcmRvd25zKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXSkucHVzaCh0ZWFyZG93bik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YnNjcmlwdGlvbi5wcm90b3R5cGUuX2hhc1BhcmVudCA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgdmFyIF9wYXJlbnRhZ2UgPSB0aGlzLl9wYXJlbnRhZ2U7XG4gICAgICAgIHJldHVybiBfcGFyZW50YWdlID09PSBwYXJlbnQgfHwgKEFycmF5LmlzQXJyYXkoX3BhcmVudGFnZSkgJiYgX3BhcmVudGFnZS5pbmNsdWRlcyhwYXJlbnQpKTtcbiAgICB9O1xuICAgIFN1YnNjcmlwdGlvbi5wcm90b3R5cGUuX2FkZFBhcmVudCA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgdmFyIF9wYXJlbnRhZ2UgPSB0aGlzLl9wYXJlbnRhZ2U7XG4gICAgICAgIHRoaXMuX3BhcmVudGFnZSA9IEFycmF5LmlzQXJyYXkoX3BhcmVudGFnZSkgPyAoX3BhcmVudGFnZS5wdXNoKHBhcmVudCksIF9wYXJlbnRhZ2UpIDogX3BhcmVudGFnZSA/IFtfcGFyZW50YWdlLCBwYXJlbnRdIDogcGFyZW50O1xuICAgIH07XG4gICAgU3Vic2NyaXB0aW9uLnByb3RvdHlwZS5fcmVtb3ZlUGFyZW50ID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICB2YXIgX3BhcmVudGFnZSA9IHRoaXMuX3BhcmVudGFnZTtcbiAgICAgICAgaWYgKF9wYXJlbnRhZ2UgPT09IHBhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50YWdlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KF9wYXJlbnRhZ2UpKSB7XG4gICAgICAgICAgICBhcnJSZW1vdmUoX3BhcmVudGFnZSwgcGFyZW50KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3Vic2NyaXB0aW9uLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAodGVhcmRvd24pIHtcbiAgICAgICAgdmFyIF90ZWFyZG93bnMgPSB0aGlzLl90ZWFyZG93bnM7XG4gICAgICAgIF90ZWFyZG93bnMgJiYgYXJyUmVtb3ZlKF90ZWFyZG93bnMsIHRlYXJkb3duKTtcbiAgICAgICAgaWYgKHRlYXJkb3duIGluc3RhbmNlb2YgU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0ZWFyZG93bi5fcmVtb3ZlUGFyZW50KHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTdWJzY3JpcHRpb24uRU1QVFkgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZW1wdHkgPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICAgIGVtcHR5LmNsb3NlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiBlbXB0eTtcbiAgICB9KSgpO1xuICAgIHJldHVybiBTdWJzY3JpcHRpb247XG59KCkpO1xuZXhwb3J0IHsgU3Vic2NyaXB0aW9uIH07XG5leHBvcnQgdmFyIEVNUFRZX1NVQlNDUklQVElPTiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbmV4cG9ydCBmdW5jdGlvbiBpc1N1YnNjcmlwdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiAodmFsdWUgaW5zdGFuY2VvZiBTdWJzY3JpcHRpb24gfHxcbiAgICAgICAgKHZhbHVlICYmICdjbG9zZWQnIGluIHZhbHVlICYmIGlzRnVuY3Rpb24odmFsdWUucmVtb3ZlKSAmJiBpc0Z1bmN0aW9uKHZhbHVlLmFkZCkgJiYgaXNGdW5jdGlvbih2YWx1ZS51bnN1YnNjcmliZSkpKTtcbn1cbmZ1bmN0aW9uIGV4ZWNUZWFyZG93bih0ZWFyZG93bikge1xuICAgIGlmIChpc0Z1bmN0aW9uKHRlYXJkb3duKSkge1xuICAgICAgICB0ZWFyZG93bigpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGVhcmRvd24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1TdWJzY3JpcHRpb24uanMubWFwIiwiZXhwb3J0IHZhciBjb25maWcgPSB7XG4gICAgb25VbmhhbmRsZWRFcnJvcjogbnVsbCxcbiAgICBvblN0b3BwZWROb3RpZmljYXRpb246IG51bGwsXG4gICAgUHJvbWlzZTogdW5kZWZpbmVkLFxuICAgIHVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmc6IGZhbHNlLFxuICAgIHVzZURlcHJlY2F0ZWROZXh0Q29udGV4dDogZmFsc2UsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29uZmlnLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGFyZ3NBcmdBcnJheU9yT2JqZWN0IH0gZnJvbSAnLi4vdXRpbC9hcmdzQXJnQXJyYXlPck9iamVjdCc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi9mcm9tJztcbmltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi4vdXRpbC9pZGVudGl0eSc7XG5pbXBvcnQgeyBtYXBPbmVPck1hbnlBcmdzIH0gZnJvbSAnLi4vdXRpbC9tYXBPbmVPck1hbnlBcmdzJztcbmltcG9ydCB7IHBvcFJlc3VsdFNlbGVjdG9yLCBwb3BTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2FyZ3MnO1xuaW1wb3J0IHsgY3JlYXRlT2JqZWN0IH0gZnJvbSAnLi4vdXRpbC9jcmVhdGVPYmplY3QnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi4vb3BlcmF0b3JzL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdCgpIHtcbiAgICB2YXIgYXJncyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgdmFyIHNjaGVkdWxlciA9IHBvcFNjaGVkdWxlcihhcmdzKTtcbiAgICB2YXIgcmVzdWx0U2VsZWN0b3IgPSBwb3BSZXN1bHRTZWxlY3RvcihhcmdzKTtcbiAgICB2YXIgX2EgPSBhcmdzQXJnQXJyYXlPck9iamVjdChhcmdzKSwgb2JzZXJ2YWJsZXMgPSBfYS5hcmdzLCBrZXlzID0gX2Eua2V5cztcbiAgICBpZiAob2JzZXJ2YWJsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmcm9tKFtdLCBzY2hlZHVsZXIpO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gbmV3IE9ic2VydmFibGUoY29tYmluZUxhdGVzdEluaXQob2JzZXJ2YWJsZXMsIHNjaGVkdWxlciwga2V5c1xuICAgICAgICA/XG4gICAgICAgICAgICBmdW5jdGlvbiAodmFsdWVzKSB7IHJldHVybiBjcmVhdGVPYmplY3Qoa2V5cywgdmFsdWVzKTsgfVxuICAgICAgICA6XG4gICAgICAgICAgICBpZGVudGl0eSkpO1xuICAgIHJldHVybiByZXN1bHRTZWxlY3RvciA/IHJlc3VsdC5waXBlKG1hcE9uZU9yTWFueUFyZ3MocmVzdWx0U2VsZWN0b3IpKSA6IHJlc3VsdDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0SW5pdChvYnNlcnZhYmxlcywgc2NoZWR1bGVyLCB2YWx1ZVRyYW5zZm9ybSkge1xuICAgIGlmICh2YWx1ZVRyYW5zZm9ybSA9PT0gdm9pZCAwKSB7IHZhbHVlVHJhbnNmb3JtID0gaWRlbnRpdHk7IH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICAgICAgbWF5YmVTY2hlZHVsZShzY2hlZHVsZXIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBvYnNlcnZhYmxlcy5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgdmFsdWVzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgICAgICAgICB2YXIgYWN0aXZlID0gbGVuZ3RoO1xuICAgICAgICAgICAgdmFyIHJlbWFpbmluZ0ZpcnN0VmFsdWVzID0gbGVuZ3RoO1xuICAgICAgICAgICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIG1heWJlU2NoZWR1bGUoc2NoZWR1bGVyLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBmcm9tKG9ic2VydmFibGVzW2ldLCBzY2hlZHVsZXIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGFzRmlyc3RWYWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbaV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaGFzRmlyc3RWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc0ZpcnN0VmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbWFpbmluZ0ZpcnN0VmFsdWVzLS07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlbWFpbmluZ0ZpcnN0VmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlVHJhbnNmb3JtKHZhbHVlcy5zbGljZSgpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghLS1hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9LCBzdWJzY3JpYmVyKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgX2xvb3BfMShpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgc3Vic2NyaWJlcik7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIG1heWJlU2NoZWR1bGUoc2NoZWR1bGVyLCBleGVjdXRlLCBzdWJzY3JpcHRpb24pIHtcbiAgICBpZiAoc2NoZWR1bGVyKSB7XG4gICAgICAgIHN1YnNjcmlwdGlvbi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGV4ZWN1dGUpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGV4ZWN1dGUoKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21iaW5lTGF0ZXN0LmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4vZnJvbSc7XG5leHBvcnQgZnVuY3Rpb24gZGVmZXIob2JzZXJ2YWJsZUZhY3RvcnkpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICAgICAgaW5uZXJGcm9tKG9ic2VydmFibGVGYWN0b3J5KCkpLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlZmVyLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmV4cG9ydCB2YXIgRU1QVFkgPSBuZXcgT2JzZXJ2YWJsZShmdW5jdGlvbiAoc3Vic2NyaWJlcikgeyByZXR1cm4gc3Vic2NyaWJlci5jb21wbGV0ZSgpOyB9KTtcbmV4cG9ydCBmdW5jdGlvbiBlbXB0eShzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gc2NoZWR1bGVyID8gZW1wdHlTY2hlZHVsZWQoc2NoZWR1bGVyKSA6IEVNUFRZO1xufVxuZnVuY3Rpb24gZW1wdHlTY2hlZHVsZWQoc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7IHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkgeyByZXR1cm4gc3Vic2NyaWJlci5jb21wbGV0ZSgpOyB9KTsgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lbXB0eS5qcy5tYXAiLCJpbXBvcnQgeyBfX2FzeW5jVmFsdWVzLCBfX2F3YWl0ZXIsIF9fZ2VuZXJhdG9yLCBfX3ZhbHVlcyB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgaXNBcnJheUxpa2UgfSBmcm9tICcuLi91dGlsL2lzQXJyYXlMaWtlJztcbmltcG9ydCB7IGlzUHJvbWlzZSB9IGZyb20gJy4uL3V0aWwvaXNQcm9taXNlJztcbmltcG9ydCB7IG9ic2VydmFibGUgYXMgU3ltYm9sX29ic2VydmFibGUgfSBmcm9tICcuLi9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBzY2hlZHVsZWQgfSBmcm9tICcuLi9zY2hlZHVsZWQvc2NoZWR1bGVkJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgcmVwb3J0VW5oYW5kbGVkRXJyb3IgfSBmcm9tICcuLi91dGlsL3JlcG9ydFVuaGFuZGxlZEVycm9yJztcbmltcG9ydCB7IGlzSW50ZXJvcE9ic2VydmFibGUgfSBmcm9tICcuLi91dGlsL2lzSW50ZXJvcE9ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNBc3luY0l0ZXJhYmxlIH0gZnJvbSAnLi4vdXRpbC9pc0FzeW5jSXRlcmFibGUnO1xuaW1wb3J0IHsgY3JlYXRlSW52YWxpZE9ic2VydmFibGVUeXBlRXJyb3IgfSBmcm9tICcuLi91dGlsL3Rocm93VW5vYnNlcnZhYmxlRXJyb3InO1xuaW1wb3J0IHsgaXNJdGVyYWJsZSB9IGZyb20gJy4uL3V0aWwvaXNJdGVyYWJsZSc7XG5pbXBvcnQgeyBpc1JlYWRhYmxlU3RyZWFtTGlrZSwgcmVhZGFibGVTdHJlYW1MaWtlVG9Bc3luY0dlbmVyYXRvciB9IGZyb20gJy4uL3V0aWwvaXNSZWFkYWJsZVN0cmVhbUxpa2UnO1xuZXhwb3J0IGZ1bmN0aW9uIGZyb20oaW5wdXQsIHNjaGVkdWxlcikge1xuICAgIHJldHVybiBzY2hlZHVsZXIgPyBzY2hlZHVsZWQoaW5wdXQsIHNjaGVkdWxlcikgOiBpbm5lckZyb20oaW5wdXQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlubmVyRnJvbShpbnB1dCkge1xuICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIE9ic2VydmFibGUpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH1cbiAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICBpZiAoaXNJbnRlcm9wT2JzZXJ2YWJsZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmcm9tSW50ZXJvcE9ic2VydmFibGUoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0FycmF5TGlrZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNQcm9taXNlKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZyb21Qcm9taXNlKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNBc3luY0l0ZXJhYmxlKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZyb21Bc3luY0l0ZXJhYmxlKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNJdGVyYWJsZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmcm9tSXRlcmFibGUoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1JlYWRhYmxlU3RyZWFtTGlrZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmcm9tUmVhZGFibGVTdHJlYW1MaWtlKGlucHV0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBjcmVhdGVJbnZhbGlkT2JzZXJ2YWJsZVR5cGVFcnJvcihpbnB1dCk7XG59XG5mdW5jdGlvbiBmcm9tSW50ZXJvcE9ic2VydmFibGUob2JqKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgIHZhciBvYnMgPSBvYmpbU3ltYm9sX29ic2VydmFibGVdKCk7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKG9icy5zdWJzY3JpYmUpKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JzLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm92aWRlZCBvYmplY3QgZG9lcyBub3QgY29ycmVjdGx5IGltcGxlbWVudCBTeW1ib2wub2JzZXJ2YWJsZScpO1xuICAgIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZyb21BcnJheUxpa2UoYXJyYXkpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGggJiYgIXN1YnNjcmliZXIuY2xvc2VkOyBpKyspIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChhcnJheVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZnJvbVByb21pc2UocHJvbWlzZSkge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgICAgICBwcm9taXNlXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikgeyByZXR1cm4gc3Vic2NyaWJlci5lcnJvcihlcnIpOyB9KVxuICAgICAgICAgICAgLnRoZW4obnVsbCwgcmVwb3J0VW5oYW5kbGVkRXJyb3IpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZnJvbUl0ZXJhYmxlKGl0ZXJhYmxlKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgIHZhciBlXzEsIF9hO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgaXRlcmFibGVfMSA9IF9fdmFsdWVzKGl0ZXJhYmxlKSwgaXRlcmFibGVfMV8xID0gaXRlcmFibGVfMS5uZXh0KCk7ICFpdGVyYWJsZV8xXzEuZG9uZTsgaXRlcmFibGVfMV8xID0gaXRlcmFibGVfMS5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBpdGVyYWJsZV8xXzEudmFsdWU7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZXJhYmxlXzFfMSAmJiAhaXRlcmFibGVfMV8xLmRvbmUgJiYgKF9hID0gaXRlcmFibGVfMS5yZXR1cm4pKSBfYS5jYWxsKGl0ZXJhYmxlXzEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxuICAgICAgICB9XG4gICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGZyb21Bc3luY0l0ZXJhYmxlKGFzeW5jSXRlcmFibGUpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICAgICAgcHJvY2Vzcyhhc3luY0l0ZXJhYmxlLCBzdWJzY3JpYmVyKS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7IHJldHVybiBzdWJzY3JpYmVyLmVycm9yKGVycik7IH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZnJvbVJlYWRhYmxlU3RyZWFtTGlrZShyZWFkYWJsZVN0cmVhbSkge1xuICAgIHJldHVybiBmcm9tQXN5bmNJdGVyYWJsZShyZWFkYWJsZVN0cmVhbUxpa2VUb0FzeW5jR2VuZXJhdG9yKHJlYWRhYmxlU3RyZWFtKSk7XG59XG5mdW5jdGlvbiBwcm9jZXNzKGFzeW5jSXRlcmFibGUsIHN1YnNjcmliZXIpIHtcbiAgICB2YXIgYXN5bmNJdGVyYWJsZV8xLCBhc3luY0l0ZXJhYmxlXzFfMTtcbiAgICB2YXIgZV8yLCBfYTtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2YWx1ZSwgZV8yXzE7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2IubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIF9iLnRyeXMucHVzaChbMCwgNSwgNiwgMTFdKTtcbiAgICAgICAgICAgICAgICAgICAgYXN5bmNJdGVyYWJsZV8xID0gX19hc3luY1ZhbHVlcyhhc3luY0l0ZXJhYmxlKTtcbiAgICAgICAgICAgICAgICAgICAgX2IubGFiZWwgPSAxO1xuICAgICAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFs0LCBhc3luY0l0ZXJhYmxlXzEubmV4dCgpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKGFzeW5jSXRlcmFibGVfMV8xID0gX2Iuc2VudCgpLCAhYXN5bmNJdGVyYWJsZV8xXzEuZG9uZSkpIHJldHVybiBbMywgNF07XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gYXN5bmNJdGVyYWJsZV8xXzEudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDM7XG4gICAgICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzMsIDFdO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFszLCAxMV07XG4gICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICBlXzJfMSA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZV8yID0geyBlcnJvcjogZV8yXzEgfTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszLCAxMV07XG4gICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgICBfYi50cnlzLnB1c2goWzYsICwgOSwgMTBdKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoYXN5bmNJdGVyYWJsZV8xXzEgJiYgIWFzeW5jSXRlcmFibGVfMV8xLmRvbmUgJiYgKF9hID0gYXN5bmNJdGVyYWJsZV8xLnJldHVybikpKSByZXR1cm4gWzMsIDhdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQsIF9hLmNhbGwoYXN5bmNJdGVyYWJsZV8xKV07XG4gICAgICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgICAgICBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIF9iLmxhYmVsID0gODtcbiAgICAgICAgICAgICAgICBjYXNlIDg6IHJldHVybiBbMywgMTBdO1xuICAgICAgICAgICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVfMikgdGhyb3cgZV8yLmVycm9yO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzddO1xuICAgICAgICAgICAgICAgIGNhc2UgMTA6IHJldHVybiBbN107XG4gICAgICAgICAgICAgICAgY2FzZSAxMTpcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZyb20uanMubWFwIiwiaW1wb3J0IHsgc2NoZWR1bGVBcnJheSB9IGZyb20gJy4uL3NjaGVkdWxlZC9zY2hlZHVsZUFycmF5JztcbmltcG9ydCB7IGZyb21BcnJheUxpa2UgfSBmcm9tICcuL2Zyb20nO1xuZXhwb3J0IGZ1bmN0aW9uIGludGVybmFsRnJvbUFycmF5KGlucHV0LCBzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gc2NoZWR1bGVyID8gc2NoZWR1bGVBcnJheShpbnB1dCwgc2NoZWR1bGVyKSA6IGZyb21BcnJheUxpa2UoaW5wdXQpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZnJvbUFycmF5LmpzLm1hcCIsImltcG9ydCB7IF9fcmVhZCB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgbWVyZ2VNYXAgfSBmcm9tICcuLi9vcGVyYXRvcnMvbWVyZ2VNYXAnO1xuaW1wb3J0IHsgaXNBcnJheUxpa2UgfSBmcm9tICcuLi91dGlsL2lzQXJyYXlMaWtlJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgbWFwT25lT3JNYW55QXJncyB9IGZyb20gJy4uL3V0aWwvbWFwT25lT3JNYW55QXJncyc7XG5pbXBvcnQgeyBpbnRlcm5hbEZyb21BcnJheSB9IGZyb20gJy4vZnJvbUFycmF5JztcbnZhciBub2RlRXZlbnRFbWl0dGVyTWV0aG9kcyA9IFsnYWRkTGlzdGVuZXInLCAncmVtb3ZlTGlzdGVuZXInXTtcbnZhciBldmVudFRhcmdldE1ldGhvZHMgPSBbJ2FkZEV2ZW50TGlzdGVuZXInLCAncmVtb3ZlRXZlbnRMaXN0ZW5lciddO1xudmFyIGpxdWVyeU1ldGhvZHMgPSBbJ29uJywgJ29mZiddO1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21FdmVudCh0YXJnZXQsIGV2ZW50TmFtZSwgb3B0aW9ucywgcmVzdWx0U2VsZWN0b3IpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihvcHRpb25zKSkge1xuICAgICAgICByZXN1bHRTZWxlY3RvciA9IG9wdGlvbnM7XG4gICAgICAgIG9wdGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmIChyZXN1bHRTZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gZnJvbUV2ZW50KHRhcmdldCwgZXZlbnROYW1lLCBvcHRpb25zKS5waXBlKG1hcE9uZU9yTWFueUFyZ3MocmVzdWx0U2VsZWN0b3IpKTtcbiAgICB9XG4gICAgdmFyIF9hID0gX19yZWFkKGlzRXZlbnRUYXJnZXQodGFyZ2V0KVxuICAgICAgICA/IGV2ZW50VGFyZ2V0TWV0aG9kcy5tYXAoZnVuY3Rpb24gKG1ldGhvZE5hbWUpIHsgcmV0dXJuIGZ1bmN0aW9uIChoYW5kbGVyKSB7IHJldHVybiB0YXJnZXRbbWV0aG9kTmFtZV0oZXZlbnROYW1lLCBoYW5kbGVyLCBvcHRpb25zKTsgfTsgfSlcbiAgICAgICAgOlxuICAgICAgICAgICAgaXNOb2RlU3R5bGVFdmVudEVtaXR0ZXIodGFyZ2V0KVxuICAgICAgICAgICAgICAgID8gbm9kZUV2ZW50RW1pdHRlck1ldGhvZHMubWFwKHRvQ29tbW9uSGFuZGxlclJlZ2lzdHJ5KHRhcmdldCwgZXZlbnROYW1lKSlcbiAgICAgICAgICAgICAgICA6IGlzSlF1ZXJ5U3R5bGVFdmVudEVtaXR0ZXIodGFyZ2V0KVxuICAgICAgICAgICAgICAgICAgICA/IGpxdWVyeU1ldGhvZHMubWFwKHRvQ29tbW9uSGFuZGxlclJlZ2lzdHJ5KHRhcmdldCwgZXZlbnROYW1lKSlcbiAgICAgICAgICAgICAgICAgICAgOiBbXSwgMiksIGFkZCA9IF9hWzBdLCByZW1vdmUgPSBfYVsxXTtcbiAgICBpZiAoIWFkZCkge1xuICAgICAgICBpZiAoaXNBcnJheUxpa2UodGFyZ2V0KSkge1xuICAgICAgICAgICAgcmV0dXJuIG1lcmdlTWFwKGZ1bmN0aW9uIChzdWJUYXJnZXQpIHsgcmV0dXJuIGZyb21FdmVudChzdWJUYXJnZXQsIGV2ZW50TmFtZSwgb3B0aW9ucyk7IH0pKGludGVybmFsRnJvbUFycmF5KHRhcmdldCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghYWRkKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgZXZlbnQgdGFyZ2V0Jyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdWJzY3JpYmVyLm5leHQoMSA8IGFyZ3MubGVuZ3RoID8gYXJncyA6IGFyZ3NbMF0pO1xuICAgICAgICB9O1xuICAgICAgICBhZGQoaGFuZGxlcik7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiByZW1vdmUoaGFuZGxlcik7IH07XG4gICAgfSk7XG59XG5mdW5jdGlvbiB0b0NvbW1vbkhhbmRsZXJSZWdpc3RyeSh0YXJnZXQsIGV2ZW50TmFtZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobWV0aG9kTmFtZSkgeyByZXR1cm4gZnVuY3Rpb24gKGhhbmRsZXIpIHsgcmV0dXJuIHRhcmdldFttZXRob2ROYW1lXShldmVudE5hbWUsIGhhbmRsZXIpOyB9OyB9O1xufVxuZnVuY3Rpb24gaXNOb2RlU3R5bGVFdmVudEVtaXR0ZXIodGFyZ2V0KSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24odGFyZ2V0LmFkZExpc3RlbmVyKSAmJiBpc0Z1bmN0aW9uKHRhcmdldC5yZW1vdmVMaXN0ZW5lcik7XG59XG5mdW5jdGlvbiBpc0pRdWVyeVN0eWxlRXZlbnRFbWl0dGVyKHRhcmdldCkge1xuICAgIHJldHVybiBpc0Z1bmN0aW9uKHRhcmdldC5vbikgJiYgaXNGdW5jdGlvbih0YXJnZXQub2ZmKTtcbn1cbmZ1bmN0aW9uIGlzRXZlbnRUYXJnZXQodGFyZ2V0KSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24odGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIpICYmIGlzRnVuY3Rpb24odGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZnJvbUV2ZW50LmpzLm1hcCIsImltcG9ydCB7IGludGVybmFsRnJvbUFycmF5IH0gZnJvbSAnLi9mcm9tQXJyYXknO1xuaW1wb3J0IHsgc2NoZWR1bGVBcnJheSB9IGZyb20gJy4uL3NjaGVkdWxlZC9zY2hlZHVsZUFycmF5JztcbmltcG9ydCB7IHBvcFNjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvYXJncyc7XG5leHBvcnQgZnVuY3Rpb24gb2YoKSB7XG4gICAgdmFyIGFyZ3MgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHZhciBzY2hlZHVsZXIgPSBwb3BTY2hlZHVsZXIoYXJncyk7XG4gICAgcmV0dXJuIHNjaGVkdWxlciA/IHNjaGVkdWxlQXJyYXkoYXJncywgc2NoZWR1bGVyKSA6IGludGVybmFsRnJvbUFycmF5KGFyZ3MpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b2YuanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgYXN5bmMgYXMgYXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcbmltcG9ydCB7IGlzVmFsaWREYXRlIH0gZnJvbSAnLi4vdXRpbC9pc0RhdGUnO1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVyKGR1ZVRpbWUsIGludGVydmFsT3JTY2hlZHVsZXIsIHNjaGVkdWxlcikge1xuICAgIGlmIChkdWVUaW1lID09PSB2b2lkIDApIHsgZHVlVGltZSA9IDA7IH1cbiAgICBpZiAoc2NoZWR1bGVyID09PSB2b2lkIDApIHsgc2NoZWR1bGVyID0gYXN5bmNTY2hlZHVsZXI7IH1cbiAgICB2YXIgaW50ZXJ2YWxEdXJhdGlvbiA9IC0xO1xuICAgIGlmIChpbnRlcnZhbE9yU2NoZWR1bGVyICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGlzU2NoZWR1bGVyKGludGVydmFsT3JTY2hlZHVsZXIpKSB7XG4gICAgICAgICAgICBzY2hlZHVsZXIgPSBpbnRlcnZhbE9yU2NoZWR1bGVyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaW50ZXJ2YWxEdXJhdGlvbiA9IGludGVydmFsT3JTY2hlZHVsZXI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgIHZhciBkdWUgPSBpc1ZhbGlkRGF0ZShkdWVUaW1lKSA/ICtkdWVUaW1lIC0gc2NoZWR1bGVyLm5vdygpIDogZHVlVGltZTtcbiAgICAgICAgaWYgKGR1ZSA8IDApIHtcbiAgICAgICAgICAgIGR1ZSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG4gPSAwO1xuICAgICAgICByZXR1cm4gc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQobisrKTtcbiAgICAgICAgICAgICAgICBpZiAoMCA8PSBpbnRlcnZhbER1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGUodW5kZWZpbmVkLCBpbnRlcnZhbER1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGR1ZSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aW1lci5qcy5tYXAiLCJpbXBvcnQgeyBfX2V4dGVuZHMgfSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbnZhciBPcGVyYXRvclN1YnNjcmliZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhPcGVyYXRvclN1YnNjcmliZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gT3BlcmF0b3JTdWJzY3JpYmVyKGRlc3RpbmF0aW9uLCBvbk5leHQsIG9uQ29tcGxldGUsIG9uRXJyb3IsIG9uRmluYWxpemUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgZGVzdGluYXRpb24pIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLm9uRmluYWxpemUgPSBvbkZpbmFsaXplO1xuICAgICAgICBfdGhpcy5fbmV4dCA9IG9uTmV4dFxuICAgICAgICAgICAgPyBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBvbk5leHQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiBfc3VwZXIucHJvdG90eXBlLl9uZXh0O1xuICAgICAgICBfdGhpcy5fZXJyb3IgPSBvbkVycm9yXG4gICAgICAgICAgICA/IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA6IF9zdXBlci5wcm90b3R5cGUuX2Vycm9yO1xuICAgICAgICBfdGhpcy5fY29tcGxldGUgPSBvbkNvbXBsZXRlXG4gICAgICAgICAgICA/IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA6IF9zdXBlci5wcm90b3R5cGUuX2NvbXBsZXRlO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIE9wZXJhdG9yU3Vic2NyaWJlci5wcm90b3R5cGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgdmFyIGNsb3NlZCA9IHRoaXMuY2xvc2VkO1xuICAgICAgICBfc3VwZXIucHJvdG90eXBlLnVuc3Vic2NyaWJlLmNhbGwodGhpcyk7XG4gICAgICAgICFjbG9zZWQgJiYgKChfYSA9IHRoaXMub25GaW5hbGl6ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwodGhpcykpO1xuICAgIH07XG4gICAgcmV0dXJuIE9wZXJhdG9yU3Vic2NyaWJlcjtcbn0oU3Vic2NyaWJlcikpO1xuZXhwb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1PcGVyYXRvclN1YnNjcmliZXIuanMubWFwIiwiaW1wb3J0IHsgX19yZWFkLCBfX3NwcmVhZEFycmF5IH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBjb21iaW5lTGF0ZXN0SW5pdCB9IGZyb20gJy4uL29ic2VydmFibGUvY29tYmluZUxhdGVzdCc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IGFyZ3NPckFyZ0FycmF5IH0gZnJvbSAnLi4vdXRpbC9hcmdzT3JBcmdBcnJheSc7XG5pbXBvcnQgeyBtYXBPbmVPck1hbnlBcmdzIH0gZnJvbSAnLi4vdXRpbC9tYXBPbmVPck1hbnlBcmdzJztcbmltcG9ydCB7IHBpcGUgfSBmcm9tICcuLi91dGlsL3BpcGUnO1xuaW1wb3J0IHsgcG9wUmVzdWx0U2VsZWN0b3IgfSBmcm9tICcuLi91dGlsL2FyZ3MnO1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3QoKSB7XG4gICAgdmFyIGFyZ3MgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHZhciByZXN1bHRTZWxlY3RvciA9IHBvcFJlc3VsdFNlbGVjdG9yKGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHRTZWxlY3RvclxuICAgICAgICA/IHBpcGUoY29tYmluZUxhdGVzdC5hcHBseSh2b2lkIDAsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChhcmdzKSkpLCBtYXBPbmVPck1hbnlBcmdzKHJlc3VsdFNlbGVjdG9yKSlcbiAgICAgICAgOiBvcGVyYXRlKGZ1bmN0aW9uIChzb3VyY2UsIHN1YnNjcmliZXIpIHtcbiAgICAgICAgICAgIGNvbWJpbmVMYXRlc3RJbml0KF9fc3ByZWFkQXJyYXkoW3NvdXJjZV0sIF9fcmVhZChhcmdzT3JBcmdBcnJheShhcmdzKSkpKShzdWJzY3JpYmVyKTtcbiAgICAgICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21iaW5lTGF0ZXN0LmpzLm1hcCIsImltcG9ydCB7IF9fcmVhZCwgX19zcHJlYWRBcnJheSB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgY29tYmluZUxhdGVzdCB9IGZyb20gJy4vY29tYmluZUxhdGVzdCc7XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdFdpdGgoKSB7XG4gICAgdmFyIG90aGVyU291cmNlcyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIG90aGVyU291cmNlc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgIH1cbiAgICByZXR1cm4gY29tYmluZUxhdGVzdC5hcHBseSh2b2lkIDAsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChvdGhlclNvdXJjZXMpKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21iaW5lTGF0ZXN0V2l0aC5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IG1lcmdlSW50ZXJuYWxzIH0gZnJvbSAnLi9tZXJnZUludGVybmFscyc7XG5leHBvcnQgZnVuY3Rpb24gZXhwYW5kKHByb2plY3QsIGNvbmN1cnJlbnQsIHNjaGVkdWxlcikge1xuICAgIGlmIChjb25jdXJyZW50ID09PSB2b2lkIDApIHsgY29uY3VycmVudCA9IEluZmluaXR5OyB9XG4gICAgY29uY3VycmVudCA9IChjb25jdXJyZW50IHx8IDApIDwgMSA/IEluZmluaXR5IDogY29uY3VycmVudDtcbiAgICByZXR1cm4gb3BlcmF0ZShmdW5jdGlvbiAoc291cmNlLCBzdWJzY3JpYmVyKSB7XG4gICAgICAgIHJldHVybiBtZXJnZUludGVybmFscyhzb3VyY2UsIHN1YnNjcmliZXIsIHByb2plY3QsIGNvbmN1cnJlbnQsIHVuZGVmaW5lZCwgdHJ1ZSwgc2NoZWR1bGVyKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV4cGFuZC5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXIocHJlZGljYXRlLCB0aGlzQXJnKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoZnVuY3Rpb24gKHNvdXJjZSwgc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBwcmVkaWNhdGUuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaW5kZXgrKykgJiYgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTsgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmFsaXplKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoZnVuY3Rpb24gKHNvdXJjZSwgc3Vic2NyaWJlcikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmluYWxpemUuanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gbWFwKHByb2plY3QsIHRoaXNBcmcpIHtcbiAgICByZXR1cm4gb3BlcmF0ZShmdW5jdGlvbiAoc291cmNlLCBzdWJzY3JpYmVyKSB7XG4gICAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChwcm9qZWN0LmNhbGwodGhpc0FyZywgdmFsdWUsIGluZGV4KyspKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFwLmpzLm1hcCIsImltcG9ydCB7IF9fcmVhZCwgX19zcHJlYWRBcnJheSB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBhcmdzT3JBcmdBcnJheSB9IGZyb20gJy4uL3V0aWwvYXJnc09yQXJnQXJyYXknO1xuaW1wb3J0IHsgaW50ZXJuYWxGcm9tQXJyYXkgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2Zyb21BcnJheSc7XG5pbXBvcnQgeyBtZXJnZUFsbCB9IGZyb20gJy4vbWVyZ2VBbGwnO1xuaW1wb3J0IHsgcG9wTnVtYmVyLCBwb3BTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2FyZ3MnO1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlKCkge1xuICAgIHZhciBhcmdzID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgIH1cbiAgICB2YXIgc2NoZWR1bGVyID0gcG9wU2NoZWR1bGVyKGFyZ3MpO1xuICAgIHZhciBjb25jdXJyZW50ID0gcG9wTnVtYmVyKGFyZ3MsIEluZmluaXR5KTtcbiAgICBhcmdzID0gYXJnc09yQXJnQXJyYXkoYXJncyk7XG4gICAgcmV0dXJuIG9wZXJhdGUoZnVuY3Rpb24gKHNvdXJjZSwgc3Vic2NyaWJlcikge1xuICAgICAgICBtZXJnZUFsbChjb25jdXJyZW50KShpbnRlcm5hbEZyb21BcnJheShfX3NwcmVhZEFycmF5KFtzb3VyY2VdLCBfX3JlYWQoYXJncykpLCBzY2hlZHVsZXIpKS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tZXJnZS5qcy5tYXAiLCJpbXBvcnQgeyBtZXJnZU1hcCB9IGZyb20gJy4vbWVyZ2VNYXAnO1xuaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuLi91dGlsL2lkZW50aXR5JztcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUFsbChjb25jdXJyZW50KSB7XG4gICAgaWYgKGNvbmN1cnJlbnQgPT09IHZvaWQgMCkgeyBjb25jdXJyZW50ID0gSW5maW5pdHk7IH1cbiAgICByZXR1cm4gbWVyZ2VNYXAoaWRlbnRpdHksIGNvbmN1cnJlbnQpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVyZ2VBbGwuanMubWFwIiwiaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9mcm9tJztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUludGVybmFscyhzb3VyY2UsIHN1YnNjcmliZXIsIHByb2plY3QsIGNvbmN1cnJlbnQsIG9uQmVmb3JlTmV4dCwgZXhwYW5kLCBpbm5lclN1YlNjaGVkdWxlciwgYWRkaXRpb25hbFRlYXJkb3duKSB7XG4gICAgdmFyIGJ1ZmZlciA9IFtdO1xuICAgIHZhciBhY3RpdmUgPSAwO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGlzQ29tcGxldGUgPSBmYWxzZTtcbiAgICB2YXIgY2hlY2tDb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGlzQ29tcGxldGUgJiYgIWJ1ZmZlci5sZW5ndGggJiYgIWFjdGl2ZSkge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB2YXIgb3V0ZXJOZXh0ID0gZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiAoYWN0aXZlIDwgY29uY3VycmVudCA/IGRvSW5uZXJTdWIodmFsdWUpIDogYnVmZmVyLnB1c2godmFsdWUpKTsgfTtcbiAgICB2YXIgZG9Jbm5lclN1YiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBleHBhbmQgJiYgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgYWN0aXZlKys7XG4gICAgICAgIHZhciBpbm5lckNvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIGlubmVyRnJvbShwcm9qZWN0KHZhbHVlLCBpbmRleCsrKSkuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgZnVuY3Rpb24gKGlubmVyVmFsdWUpIHtcbiAgICAgICAgICAgIG9uQmVmb3JlTmV4dCA9PT0gbnVsbCB8fCBvbkJlZm9yZU5leHQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uQmVmb3JlTmV4dChpbm5lclZhbHVlKTtcbiAgICAgICAgICAgIGlmIChleHBhbmQpIHtcbiAgICAgICAgICAgICAgICBvdXRlck5leHQoaW5uZXJWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoaW5uZXJWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlubmVyQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICB9LCB1bmRlZmluZWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChpbm5lckNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlLS07XG4gICAgICAgICAgICAgICAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJ1ZmZlcmVkVmFsdWUgPSBidWZmZXIuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyU3ViU2NoZWR1bGVyID8gc3Vic2NyaWJlci5hZGQoaW5uZXJTdWJTY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkgeyByZXR1cm4gZG9Jbm5lclN1YihidWZmZXJlZFZhbHVlKTsgfSkpIDogZG9Jbm5lclN1YihidWZmZXJlZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGJ1ZmZlci5sZW5ndGggJiYgYWN0aXZlIDwgY29uY3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2xvb3BfMSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrQ29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfTtcbiAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgb3V0ZXJOZXh0LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlzQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICBjaGVja0NvbXBsZXRlKCk7XG4gICAgfSkpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFkZGl0aW9uYWxUZWFyZG93biA9PT0gbnVsbCB8fCBhZGRpdGlvbmFsVGVhcmRvd24gPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFkZGl0aW9uYWxUZWFyZG93bigpO1xuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tZXJnZUludGVybmFscy5qcy5tYXAiLCJpbXBvcnQgeyBtYXAgfSBmcm9tICcuL21hcCc7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2Zyb20nO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBtZXJnZUludGVybmFscyB9IGZyb20gJy4vbWVyZ2VJbnRlcm5hbHMnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VNYXAocHJvamVjdCwgcmVzdWx0U2VsZWN0b3IsIGNvbmN1cnJlbnQpIHtcbiAgICBpZiAoY29uY3VycmVudCA9PT0gdm9pZCAwKSB7IGNvbmN1cnJlbnQgPSBJbmZpbml0eTsgfVxuICAgIGlmIChpc0Z1bmN0aW9uKHJlc3VsdFNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gbWVyZ2VNYXAoZnVuY3Rpb24gKGEsIGkpIHsgcmV0dXJuIG1hcChmdW5jdGlvbiAoYiwgaWkpIHsgcmV0dXJuIHJlc3VsdFNlbGVjdG9yKGEsIGIsIGksIGlpKTsgfSkoaW5uZXJGcm9tKHByb2plY3QoYSwgaSkpKTsgfSwgY29uY3VycmVudCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiByZXN1bHRTZWxlY3RvciA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgY29uY3VycmVudCA9IHJlc3VsdFNlbGVjdG9yO1xuICAgIH1cbiAgICByZXR1cm4gb3BlcmF0ZShmdW5jdGlvbiAoc291cmNlLCBzdWJzY3JpYmVyKSB7IHJldHVybiBtZXJnZUludGVybmFscyhzb3VyY2UsIHN1YnNjcmliZXIsIHByb2plY3QsIGNvbmN1cnJlbnQpOyB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lcmdlTWFwLmpzLm1hcCIsImltcG9ydCB7IF9fcmVhZCwgX19zcHJlYWRBcnJheSB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICcuL21lcmdlJztcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVdpdGgoKSB7XG4gICAgdmFyIG90aGVyU291cmNlcyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIG90aGVyU291cmNlc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgIH1cbiAgICByZXR1cm4gbWVyZ2UuYXBwbHkodm9pZCAwLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQob3RoZXJTb3VyY2VzKSkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVyZ2VXaXRoLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmVPbihzY2hlZHVsZXIsIGRlbGF5KSB7XG4gICAgaWYgKGRlbGF5ID09PSB2b2lkIDApIHsgZGVsYXkgPSAwOyB9XG4gICAgcmV0dXJuIG9wZXJhdGUoZnVuY3Rpb24gKHNvdXJjZSwgc3Vic2NyaWJlcikge1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBzdWJzY3JpYmVyLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkgeyByZXR1cm4gc3Vic2NyaWJlci5uZXh0KHZhbHVlKTsgfSwgZGVsYXkpKTsgfSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gc3Vic2NyaWJlci5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN1YnNjcmliZXIuY29tcGxldGUoKTsgfSwgZGVsYXkpKTsgfSwgZnVuY3Rpb24gKGVycikgeyByZXR1cm4gc3Vic2NyaWJlci5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN1YnNjcmliZXIuZXJyb3IoZXJyKTsgfSwgZGVsYXkpKTsgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b2JzZXJ2ZU9uLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIHBhaXJ3aXNlKCkge1xuICAgIHJldHVybiBvcGVyYXRlKGZ1bmN0aW9uIChzb3VyY2UsIHN1YnNjcmliZXIpIHtcbiAgICAgICAgdmFyIHByZXY7XG4gICAgICAgIHZhciBoYXNQcmV2ID0gZmFsc2U7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBwID0gcHJldjtcbiAgICAgICAgICAgIHByZXYgPSB2YWx1ZTtcbiAgICAgICAgICAgIGhhc1ByZXYgJiYgc3Vic2NyaWJlci5uZXh0KFtwLCB2YWx1ZV0pO1xuICAgICAgICAgICAgaGFzUHJldiA9IHRydWU7XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhaXJ3aXNlLmpzLm1hcCIsImltcG9ydCB7IF9fcmVhZCwgX19zcHJlYWRBcnJheSB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvZnJvbSc7XG5pbXBvcnQgeyB0YWtlIH0gZnJvbSAnLi4vb3BlcmF0b3JzL3Rha2UnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgU2FmZVN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuZXhwb3J0IGZ1bmN0aW9uIHNoYXJlKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgIHZhciBfYSA9IG9wdGlvbnMuY29ubmVjdG9yLCBjb25uZWN0b3IgPSBfYSA9PT0gdm9pZCAwID8gZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFN1YmplY3QoKTsgfSA6IF9hLCBfYiA9IG9wdGlvbnMucmVzZXRPbkVycm9yLCByZXNldE9uRXJyb3IgPSBfYiA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9iLCBfYyA9IG9wdGlvbnMucmVzZXRPbkNvbXBsZXRlLCByZXNldE9uQ29tcGxldGUgPSBfYyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9jLCBfZCA9IG9wdGlvbnMucmVzZXRPblJlZkNvdW50WmVybywgcmVzZXRPblJlZkNvdW50WmVybyA9IF9kID09PSB2b2lkIDAgPyB0cnVlIDogX2Q7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh3cmFwcGVyU291cmNlKSB7XG4gICAgICAgIHZhciBjb25uZWN0aW9uID0gbnVsbDtcbiAgICAgICAgdmFyIHJlc2V0Q29ubmVjdGlvbiA9IG51bGw7XG4gICAgICAgIHZhciBzdWJqZWN0ID0gbnVsbDtcbiAgICAgICAgdmFyIHJlZkNvdW50ID0gMDtcbiAgICAgICAgdmFyIGhhc0NvbXBsZXRlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgaGFzRXJyb3JlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgY2FuY2VsUmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXNldENvbm5lY3Rpb24gPT09IG51bGwgfHwgcmVzZXRDb25uZWN0aW9uID09PSB2b2lkIDAgPyB2b2lkIDAgOiByZXNldENvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHJlc2V0Q29ubmVjdGlvbiA9IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIHZhciByZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNhbmNlbFJlc2V0KCk7XG4gICAgICAgICAgICBjb25uZWN0aW9uID0gc3ViamVjdCA9IG51bGw7XG4gICAgICAgICAgICBoYXNDb21wbGV0ZWQgPSBoYXNFcnJvcmVkID0gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHZhciByZXNldEFuZFVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNvbm4gPSBjb25uZWN0aW9uO1xuICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgIGNvbm4gPT09IG51bGwgfHwgY29ubiA9PT0gdm9pZCAwID8gdm9pZCAwIDogY29ubi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gb3BlcmF0ZShmdW5jdGlvbiAoc291cmNlLCBzdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICByZWZDb3VudCsrO1xuICAgICAgICAgICAgaWYgKCFoYXNFcnJvcmVkICYmICFoYXNDb21wbGV0ZWQpIHtcbiAgICAgICAgICAgICAgICBjYW5jZWxSZXNldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGRlc3QgPSAoc3ViamVjdCA9IHN1YmplY3QgIT09IG51bGwgJiYgc3ViamVjdCAhPT0gdm9pZCAwID8gc3ViamVjdCA6IGNvbm5lY3RvcigpKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuYWRkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZWZDb3VudC0tO1xuICAgICAgICAgICAgICAgIGlmIChyZWZDb3VudCA9PT0gMCAmJiAhaGFzRXJyb3JlZCAmJiAhaGFzQ29tcGxldGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc2V0Q29ubmVjdGlvbiA9IGhhbmRsZVJlc2V0KHJlc2V0QW5kVW5zdWJzY3JpYmUsIHJlc2V0T25SZWZDb3VudFplcm8pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGVzdC5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICAgICAgICBpZiAoIWNvbm5lY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uID0gbmV3IFNhZmVTdWJzY3JpYmVyKHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBkZXN0Lm5leHQodmFsdWUpOyB9LFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzRXJyb3JlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxSZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzZXRDb25uZWN0aW9uID0gaGFuZGxlUmVzZXQocmVzZXQsIHJlc2V0T25FcnJvciwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3QuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0NvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxSZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzZXRDb25uZWN0aW9uID0gaGFuZGxlUmVzZXQocmVzZXQsIHJlc2V0T25Db21wbGV0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0LmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZnJvbShzb3VyY2UpLnN1YnNjcmliZShjb25uZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkod3JhcHBlclNvdXJjZSk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGhhbmRsZVJlc2V0KHJlc2V0LCBvbikge1xuICAgIHZhciBhcmdzID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgYXJnc1tfaSAtIDJdID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgaWYgKG9uID09PSB0cnVlKSB7XG4gICAgICAgIHJlc2V0KCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAob24gPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gb24uYXBwbHkodm9pZCAwLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoYXJncykpKS5waXBlKHRha2UoMSkpXG4gICAgICAgIC5zdWJzY3JpYmUoZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVzZXQoKTsgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaGFyZS5qcy5tYXAiLCJpbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2Zyb20nO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoTWFwKHByb2plY3QsIHJlc3VsdFNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoZnVuY3Rpb24gKHNvdXJjZSwgc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgaW5uZXJTdWJzY3JpYmVyID0gbnVsbDtcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgICAgdmFyIGlzQ29tcGxldGUgPSBmYWxzZTtcbiAgICAgICAgdmFyIGNoZWNrQ29tcGxldGUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBpc0NvbXBsZXRlICYmICFpbm5lclN1YnNjcmliZXIgJiYgc3Vic2NyaWJlci5jb21wbGV0ZSgpOyB9O1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpbm5lclN1YnNjcmliZXIgPT09IG51bGwgfHwgaW5uZXJTdWJzY3JpYmVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBpbm5lclN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHZhciBpbm5lckluZGV4ID0gMDtcbiAgICAgICAgICAgIHZhciBvdXRlckluZGV4ID0gaW5kZXgrKztcbiAgICAgICAgICAgIGlubmVyRnJvbShwcm9qZWN0KHZhbHVlLCBvdXRlckluZGV4KSkuc3Vic2NyaWJlKChpbm5lclN1YnNjcmliZXIgPSBuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIGZ1bmN0aW9uIChpbm5lclZhbHVlKSB7IHJldHVybiBzdWJzY3JpYmVyLm5leHQocmVzdWx0U2VsZWN0b3IgPyByZXN1bHRTZWxlY3Rvcih2YWx1ZSwgaW5uZXJWYWx1ZSwgb3V0ZXJJbmRleCwgaW5uZXJJbmRleCsrKSA6IGlubmVyVmFsdWUpOyB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaW5uZXJTdWJzY3JpYmVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICBjaGVja0NvbXBsZXRlKCk7XG4gICAgICAgICAgICB9KSkpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpc0NvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIGNoZWNrQ29tcGxldGUoKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3dpdGNoTWFwLmpzLm1hcCIsImltcG9ydCB7IEVNUFRZIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9lbXB0eSc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiB0YWtlKGNvdW50KSB7XG4gICAgcmV0dXJuIGNvdW50IDw9IDBcbiAgICAgICAgP1xuICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyByZXR1cm4gRU1QVFk7IH1cbiAgICAgICAgOiBvcGVyYXRlKGZ1bmN0aW9uIChzb3VyY2UsIHN1YnNjcmliZXIpIHtcbiAgICAgICAgICAgIHZhciBzZWVuID0gMDtcbiAgICAgICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoKytzZWVuIDw9IGNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb3VudCA8PSBzZWVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFrZS5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiB0YWtlV2hpbGUocHJlZGljYXRlLCBpbmNsdXNpdmUpIHtcbiAgICBpZiAoaW5jbHVzaXZlID09PSB2b2lkIDApIHsgaW5jbHVzaXZlID0gZmFsc2U7IH1cbiAgICByZXR1cm4gb3BlcmF0ZShmdW5jdGlvbiAoc291cmNlLCBzdWJzY3JpYmVyKSB7XG4gICAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBwcmVkaWNhdGUodmFsdWUsIGluZGV4KyspO1xuICAgICAgICAgICAgKHJlc3VsdCB8fCBpbmNsdXNpdmUpICYmIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICAhcmVzdWx0ICYmIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFrZVdoaWxlLmpzLm1hcCIsImltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBpZGVudGl0eSB9IGZyb20gJy4uL3V0aWwvaWRlbnRpdHknO1xuZXhwb3J0IGZ1bmN0aW9uIHRhcChvYnNlcnZlck9yTmV4dCwgZXJyb3IsIGNvbXBsZXRlKSB7XG4gICAgdmFyIHRhcE9ic2VydmVyID0gaXNGdW5jdGlvbihvYnNlcnZlck9yTmV4dCkgfHwgZXJyb3IgfHwgY29tcGxldGUgPyB7IG5leHQ6IG9ic2VydmVyT3JOZXh0LCBlcnJvcjogZXJyb3IsIGNvbXBsZXRlOiBjb21wbGV0ZSB9IDogb2JzZXJ2ZXJPck5leHQ7XG4gICAgcmV0dXJuIHRhcE9ic2VydmVyXG4gICAgICAgID8gb3BlcmF0ZShmdW5jdGlvbiAoc291cmNlLCBzdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIChfYSA9IHRhcE9ic2VydmVyLm5leHQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKHRhcE9ic2VydmVyLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgKF9hID0gdGFwT2JzZXJ2ZXIuY29tcGxldGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKHRhcE9ic2VydmVyKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIChfYSA9IHRhcE9ic2VydmVyLmVycm9yKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbCh0YXBPYnNlcnZlciwgZXJyKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pXG4gICAgICAgIDpcbiAgICAgICAgICAgIGlkZW50aXR5O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFwLmpzLm1hcCIsImltcG9ydCB7IF9fcmVhZCwgX19zcHJlYWRBcnJheSB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2Zyb20nO1xuaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuLi91dGlsL2lkZW50aXR5JztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi91dGlsL25vb3AnO1xuaW1wb3J0IHsgcG9wUmVzdWx0U2VsZWN0b3IgfSBmcm9tICcuLi91dGlsL2FyZ3MnO1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhMYXRlc3RGcm9tKCkge1xuICAgIHZhciBpbnB1dHMgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBpbnB1dHNbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgdmFyIHByb2plY3QgPSBwb3BSZXN1bHRTZWxlY3RvcihpbnB1dHMpO1xuICAgIHJldHVybiBvcGVyYXRlKGZ1bmN0aW9uIChzb3VyY2UsIHN1YnNjcmliZXIpIHtcbiAgICAgICAgdmFyIGxlbiA9IGlucHV0cy5sZW5ndGg7XG4gICAgICAgIHZhciBvdGhlclZhbHVlcyA9IG5ldyBBcnJheShsZW4pO1xuICAgICAgICB2YXIgaGFzVmFsdWUgPSBpbnB1dHMubWFwKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZhbHNlOyB9KTtcbiAgICAgICAgdmFyIHJlYWR5ID0gZmFsc2U7XG4gICAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIGlubmVyRnJvbShpbnB1dHNbaV0pLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIG90aGVyVmFsdWVzW2ldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKCFyZWFkeSAmJiAhaGFzVmFsdWVbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzVmFsdWVbaV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAocmVhZHkgPSBoYXNWYWx1ZS5ldmVyeShpZGVudGl0eSkpICYmIChoYXNWYWx1ZSA9IG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIG5vb3ApKTtcbiAgICAgICAgfTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgX2xvb3BfMShpKTtcbiAgICAgICAgfVxuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAocmVhZHkpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gX19zcHJlYWRBcnJheShbdmFsdWVdLCBfX3JlYWQob3RoZXJWYWx1ZXMpKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQocHJvamVjdCA/IHByb2plY3QuYXBwbHkodm9pZCAwLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQodmFsdWVzKSkpIDogdmFsdWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2l0aExhdGVzdEZyb20uanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuZXhwb3J0IGZ1bmN0aW9uIHNjaGVkdWxlQXJyYXkoaW5wdXQsIHNjaGVkdWxlcikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGkgPT09IGlucHV0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChpbnB1dFtpKytdKTtcbiAgICAgICAgICAgICAgICBpZiAoIXN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NoZWR1bGVBcnJheS5qcy5tYXAiLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuZXhwb3J0IGZ1bmN0aW9uIHNjaGVkdWxlQXN5bmNJdGVyYWJsZShpbnB1dCwgc2NoZWR1bGVyKSB7XG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0l0ZXJhYmxlIGNhbm5vdCBiZSBudWxsJyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgc3ViID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgICBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpbnB1dFtTeW1ib2wuYXN5bmNJdGVyYXRvcl0oKTtcbiAgICAgICAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGl0ZXJhdG9yLm5leHQoKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5kb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQocmVzdWx0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnNjaGVkdWxlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSkpO1xuICAgICAgICByZXR1cm4gc3ViO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NoZWR1bGVBc3luY0l0ZXJhYmxlLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGl0ZXJhdG9yIGFzIFN5bWJvbF9pdGVyYXRvciB9IGZyb20gJy4uL3N5bWJvbC9pdGVyYXRvcic7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IGNhdWdodFNjaGVkdWxlIH0gZnJvbSAnLi4vdXRpbC9jYXVnaHRTY2hlZHVsZSc7XG5leHBvcnQgZnVuY3Rpb24gc2NoZWR1bGVJdGVyYWJsZShpbnB1dCwgc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgIHZhciBpdGVyYXRvcjtcbiAgICAgICAgc3Vic2NyaWJlci5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yID0gaW5wdXRbU3ltYm9sX2l0ZXJhdG9yXSgpO1xuICAgICAgICAgICAgY2F1Z2h0U2NoZWR1bGUoc3Vic2NyaWJlciwgc2NoZWR1bGVyLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hID0gaXRlcmF0b3IubmV4dCgpLCB2YWx1ZSA9IF9hLnZhbHVlLCBkb25lID0gX2EuZG9uZTtcbiAgICAgICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlzRnVuY3Rpb24oaXRlcmF0b3IgPT09IG51bGwgfHwgaXRlcmF0b3IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGl0ZXJhdG9yLnJldHVybikgJiYgaXRlcmF0b3IucmV0dXJuKCk7IH07XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2hlZHVsZUl0ZXJhYmxlLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBvYnNlcnZhYmxlIGFzIFN5bWJvbF9vYnNlcnZhYmxlIH0gZnJvbSAnLi4vc3ltYm9sL29ic2VydmFibGUnO1xuZXhwb3J0IGZ1bmN0aW9uIHNjaGVkdWxlT2JzZXJ2YWJsZShpbnB1dCwgc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgIHZhciBzdWIgPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvYnNlcnZhYmxlID0gaW5wdXRbU3ltYm9sX29ic2VydmFibGVdKCk7XG4gICAgICAgICAgICBzdWIuYWRkKG9ic2VydmFibGUuc3Vic2NyaWJlKHtcbiAgICAgICAgICAgICAgICBuZXh0OiBmdW5jdGlvbiAodmFsdWUpIHsgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkgeyByZXR1cm4gc3Vic2NyaWJlci5uZXh0KHZhbHVlKTsgfSkpOyB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyKSB7IHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN1YnNjcmliZXIuZXJyb3IoZXJyKTsgfSkpOyB9LFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7IHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN1YnNjcmliZXIuY29tcGxldGUoKTsgfSkpOyB9LFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KSk7XG4gICAgICAgIHJldHVybiBzdWI7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2hlZHVsZU9ic2VydmFibGUuanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuZXhwb3J0IGZ1bmN0aW9uIHNjaGVkdWxlUHJvbWlzZShpbnB1dCwgc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN1YnNjcmliZXIuY29tcGxldGUoKTsgfSkpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkgeyByZXR1cm4gc3Vic2NyaWJlci5lcnJvcihlcnIpOyB9KSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2hlZHVsZVByb21pc2UuanMubWFwIiwiaW1wb3J0IHsgc2NoZWR1bGVBc3luY0l0ZXJhYmxlIH0gZnJvbSAnLi9zY2hlZHVsZUFzeW5jSXRlcmFibGUnO1xuaW1wb3J0IHsgcmVhZGFibGVTdHJlYW1MaWtlVG9Bc3luY0dlbmVyYXRvciB9IGZyb20gJy4uL3V0aWwvaXNSZWFkYWJsZVN0cmVhbUxpa2UnO1xuZXhwb3J0IGZ1bmN0aW9uIHNjaGVkdWxlUmVhZGFibGVTdHJlYW1MaWtlKGlucHV0LCBzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gc2NoZWR1bGVBc3luY0l0ZXJhYmxlKHJlYWRhYmxlU3RyZWFtTGlrZVRvQXN5bmNHZW5lcmF0b3IoaW5wdXQpLCBzY2hlZHVsZXIpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NoZWR1bGVSZWFkYWJsZVN0cmVhbUxpa2UuanMubWFwIiwiaW1wb3J0IHsgc2NoZWR1bGVPYnNlcnZhYmxlIH0gZnJvbSAnLi9zY2hlZHVsZU9ic2VydmFibGUnO1xuaW1wb3J0IHsgc2NoZWR1bGVQcm9taXNlIH0gZnJvbSAnLi9zY2hlZHVsZVByb21pc2UnO1xuaW1wb3J0IHsgc2NoZWR1bGVBcnJheSB9IGZyb20gJy4vc2NoZWR1bGVBcnJheSc7XG5pbXBvcnQgeyBzY2hlZHVsZUl0ZXJhYmxlIH0gZnJvbSAnLi9zY2hlZHVsZUl0ZXJhYmxlJztcbmltcG9ydCB7IHNjaGVkdWxlQXN5bmNJdGVyYWJsZSB9IGZyb20gJy4vc2NoZWR1bGVBc3luY0l0ZXJhYmxlJztcbmltcG9ydCB7IGlzSW50ZXJvcE9ic2VydmFibGUgfSBmcm9tICcuLi91dGlsL2lzSW50ZXJvcE9ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNQcm9taXNlIH0gZnJvbSAnLi4vdXRpbC9pc1Byb21pc2UnO1xuaW1wb3J0IHsgaXNBcnJheUxpa2UgfSBmcm9tICcuLi91dGlsL2lzQXJyYXlMaWtlJztcbmltcG9ydCB7IGlzSXRlcmFibGUgfSBmcm9tICcuLi91dGlsL2lzSXRlcmFibGUnO1xuaW1wb3J0IHsgaXNBc3luY0l0ZXJhYmxlIH0gZnJvbSAnLi4vdXRpbC9pc0FzeW5jSXRlcmFibGUnO1xuaW1wb3J0IHsgY3JlYXRlSW52YWxpZE9ic2VydmFibGVUeXBlRXJyb3IgfSBmcm9tICcuLi91dGlsL3Rocm93VW5vYnNlcnZhYmxlRXJyb3InO1xuaW1wb3J0IHsgaXNSZWFkYWJsZVN0cmVhbUxpa2UgfSBmcm9tICcuLi91dGlsL2lzUmVhZGFibGVTdHJlYW1MaWtlJztcbmltcG9ydCB7IHNjaGVkdWxlUmVhZGFibGVTdHJlYW1MaWtlIH0gZnJvbSAnLi9zY2hlZHVsZVJlYWRhYmxlU3RyZWFtTGlrZSc7XG5leHBvcnQgZnVuY3Rpb24gc2NoZWR1bGVkKGlucHV0LCBzY2hlZHVsZXIpIHtcbiAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICBpZiAoaXNJbnRlcm9wT2JzZXJ2YWJsZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzY2hlZHVsZU9ic2VydmFibGUoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQXJyYXlMaWtlKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHNjaGVkdWxlQXJyYXkoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzUHJvbWlzZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzY2hlZHVsZVByb21pc2UoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQXN5bmNJdGVyYWJsZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzY2hlZHVsZUFzeW5jSXRlcmFibGUoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzSXRlcmFibGUoaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NoZWR1bGVJdGVyYWJsZShpbnB1dCwgc2NoZWR1bGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNSZWFkYWJsZVN0cmVhbUxpa2UoaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NoZWR1bGVSZWFkYWJsZVN0cmVhbUxpa2UoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgY3JlYXRlSW52YWxpZE9ic2VydmFibGVUeXBlRXJyb3IoaW5wdXQpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NoZWR1bGVkLmpzLm1hcCIsImltcG9ydCB7IF9fZXh0ZW5kcyB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbnZhciBBY3Rpb24gPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBY3Rpb24sIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQWN0aW9uKHNjaGVkdWxlciwgd29yaykge1xuICAgICAgICByZXR1cm4gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICB9XG4gICAgQWN0aW9uLnByb3RvdHlwZS5zY2hlZHVsZSA9IGZ1bmN0aW9uIChzdGF0ZSwgZGVsYXkpIHtcbiAgICAgICAgaWYgKGRlbGF5ID09PSB2b2lkIDApIHsgZGVsYXkgPSAwOyB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgcmV0dXJuIEFjdGlvbjtcbn0oU3Vic2NyaXB0aW9uKSk7XG5leHBvcnQgeyBBY3Rpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUFjdGlvbi5qcy5tYXAiLCJpbXBvcnQgeyBfX2V4dGVuZHMgfSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBhbmltYXRpb25GcmFtZVByb3ZpZGVyIH0gZnJvbSAnLi9hbmltYXRpb25GcmFtZVByb3ZpZGVyJztcbnZhciBBbmltYXRpb25GcmFtZUFjdGlvbiA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEFuaW1hdGlvbkZyYW1lQWN0aW9uLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEFuaW1hdGlvbkZyYW1lQWN0aW9uKHNjaGVkdWxlciwgd29yaykge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBzY2hlZHVsZXIsIHdvcmspIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgICAgICAgX3RoaXMud29yayA9IHdvcms7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgQW5pbWF0aW9uRnJhbWVBY3Rpb24ucHJvdG90eXBlLnJlcXVlc3RBc3luY0lkID0gZnVuY3Rpb24gKHNjaGVkdWxlciwgaWQsIGRlbGF5KSB7XG4gICAgICAgIGlmIChkZWxheSA9PT0gdm9pZCAwKSB7IGRlbGF5ID0gMDsgfVxuICAgICAgICBpZiAoZGVsYXkgIT09IG51bGwgJiYgZGVsYXkgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gX3N1cGVyLnByb3RvdHlwZS5yZXF1ZXN0QXN5bmNJZC5jYWxsKHRoaXMsIHNjaGVkdWxlciwgaWQsIGRlbGF5KTtcbiAgICAgICAgfVxuICAgICAgICBzY2hlZHVsZXIuYWN0aW9ucy5wdXNoKHRoaXMpO1xuICAgICAgICByZXR1cm4gc2NoZWR1bGVyLl9zY2hlZHVsZWQgfHwgKHNjaGVkdWxlci5fc2NoZWR1bGVkID0gYW5pbWF0aW9uRnJhbWVQcm92aWRlci5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkgeyByZXR1cm4gc2NoZWR1bGVyLmZsdXNoKHVuZGVmaW5lZCk7IH0pKTtcbiAgICB9O1xuICAgIEFuaW1hdGlvbkZyYW1lQWN0aW9uLnByb3RvdHlwZS5yZWN5Y2xlQXN5bmNJZCA9IGZ1bmN0aW9uIChzY2hlZHVsZXIsIGlkLCBkZWxheSkge1xuICAgICAgICBpZiAoZGVsYXkgPT09IHZvaWQgMCkgeyBkZWxheSA9IDA7IH1cbiAgICAgICAgaWYgKChkZWxheSAhPSBudWxsICYmIGRlbGF5ID4gMCkgfHwgKGRlbGF5ID09IG51bGwgJiYgdGhpcy5kZWxheSA+IDApKSB7XG4gICAgICAgICAgICByZXR1cm4gX3N1cGVyLnByb3RvdHlwZS5yZWN5Y2xlQXN5bmNJZC5jYWxsKHRoaXMsIHNjaGVkdWxlciwgaWQsIGRlbGF5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2NoZWR1bGVyLmFjdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBhbmltYXRpb25GcmFtZVByb3ZpZGVyLmNhbmNlbEFuaW1hdGlvbkZyYW1lKGlkKTtcbiAgICAgICAgICAgIHNjaGVkdWxlci5fc2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfTtcbiAgICByZXR1cm4gQW5pbWF0aW9uRnJhbWVBY3Rpb247XG59KEFzeW5jQWN0aW9uKSk7XG5leHBvcnQgeyBBbmltYXRpb25GcmFtZUFjdGlvbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QW5pbWF0aW9uRnJhbWVBY3Rpb24uanMubWFwIiwiaW1wb3J0IHsgX19leHRlbmRzIH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBBc3luY1NjaGVkdWxlciB9IGZyb20gJy4vQXN5bmNTY2hlZHVsZXInO1xudmFyIEFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIoKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIucHJvdG90eXBlLmZsdXNoID0gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICB0aGlzLl9hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLl9zY2hlZHVsZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBhY3Rpb25zID0gdGhpcy5hY3Rpb25zO1xuICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgIHZhciBpbmRleCA9IC0xO1xuICAgICAgICBhY3Rpb24gPSBhY3Rpb24gfHwgYWN0aW9ucy5zaGlmdCgpO1xuICAgICAgICB2YXIgY291bnQgPSBhY3Rpb25zLmxlbmd0aDtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgaWYgKChlcnJvciA9IGFjdGlvbi5leGVjdXRlKGFjdGlvbi5zdGF0ZSwgYWN0aW9uLmRlbGF5KSkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAoKytpbmRleCA8IGNvdW50ICYmIChhY3Rpb24gPSBhY3Rpb25zLnNoaWZ0KCkpKTtcbiAgICAgICAgdGhpcy5fYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgd2hpbGUgKCsraW5kZXggPCBjb3VudCAmJiAoYWN0aW9uID0gYWN0aW9ucy5zaGlmdCgpKSkge1xuICAgICAgICAgICAgICAgIGFjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBBbmltYXRpb25GcmFtZVNjaGVkdWxlcjtcbn0oQXN5bmNTY2hlZHVsZXIpKTtcbmV4cG9ydCB7IEFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1BbmltYXRpb25GcmFtZVNjaGVkdWxlci5qcy5tYXAiLCJpbXBvcnQgeyBfX2V4dGVuZHMgfSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4vQWN0aW9uJztcbmltcG9ydCB7IGludGVydmFsUHJvdmlkZXIgfSBmcm9tICcuL2ludGVydmFsUHJvdmlkZXInO1xuaW1wb3J0IHsgYXJyUmVtb3ZlIH0gZnJvbSAnLi4vdXRpbC9hcnJSZW1vdmUnO1xudmFyIEFzeW5jQWN0aW9uID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQXN5bmNBY3Rpb24sIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQXN5bmNBY3Rpb24oc2NoZWR1bGVyLCB3b3JrKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNjaGVkdWxlciwgd29yaykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgICAgICBfdGhpcy53b3JrID0gd29yaztcbiAgICAgICAgX3RoaXMucGVuZGluZyA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIEFzeW5jQWN0aW9uLnByb3RvdHlwZS5zY2hlZHVsZSA9IGZ1bmN0aW9uIChzdGF0ZSwgZGVsYXkpIHtcbiAgICAgICAgaWYgKGRlbGF5ID09PSB2b2lkIDApIHsgZGVsYXkgPSAwOyB9XG4gICAgICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICB2YXIgaWQgPSB0aGlzLmlkO1xuICAgICAgICB2YXIgc2NoZWR1bGVyID0gdGhpcy5zY2hlZHVsZXI7XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gdGhpcy5yZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wZW5kaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kZWxheSA9IGRlbGF5O1xuICAgICAgICB0aGlzLmlkID0gdGhpcy5pZCB8fCB0aGlzLnJlcXVlc3RBc3luY0lkKHNjaGVkdWxlciwgdGhpcy5pZCwgZGVsYXkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIEFzeW5jQWN0aW9uLnByb3RvdHlwZS5yZXF1ZXN0QXN5bmNJZCA9IGZ1bmN0aW9uIChzY2hlZHVsZXIsIF9pZCwgZGVsYXkpIHtcbiAgICAgICAgaWYgKGRlbGF5ID09PSB2b2lkIDApIHsgZGVsYXkgPSAwOyB9XG4gICAgICAgIHJldHVybiBpbnRlcnZhbFByb3ZpZGVyLnNldEludGVydmFsKHNjaGVkdWxlci5mbHVzaC5iaW5kKHNjaGVkdWxlciwgdGhpcyksIGRlbGF5KTtcbiAgICB9O1xuICAgIEFzeW5jQWN0aW9uLnByb3RvdHlwZS5yZWN5Y2xlQXN5bmNJZCA9IGZ1bmN0aW9uIChfc2NoZWR1bGVyLCBpZCwgZGVsYXkpIHtcbiAgICAgICAgaWYgKGRlbGF5ID09PSB2b2lkIDApIHsgZGVsYXkgPSAwOyB9XG4gICAgICAgIGlmIChkZWxheSAhPSBudWxsICYmIHRoaXMuZGVsYXkgPT09IGRlbGF5ICYmIHRoaXMucGVuZGluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfVxuICAgICAgICBpbnRlcnZhbFByb3ZpZGVyLmNsZWFySW50ZXJ2YWwoaWQpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgQXN5bmNBY3Rpb24ucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoc3RhdGUsIGRlbGF5KSB7XG4gICAgICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignZXhlY3V0aW5nIGEgY2FuY2VsbGVkIGFjdGlvbicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGVuZGluZyA9IGZhbHNlO1xuICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLl9leGVjdXRlKHN0YXRlLCBkZWxheSk7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMucGVuZGluZyA9PT0gZmFsc2UgJiYgdGhpcy5pZCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gdGhpcy5yZWN5Y2xlQXN5bmNJZCh0aGlzLnNjaGVkdWxlciwgdGhpcy5pZCwgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEFzeW5jQWN0aW9uLnByb3RvdHlwZS5fZXhlY3V0ZSA9IGZ1bmN0aW9uIChzdGF0ZSwgX2RlbGF5KSB7XG4gICAgICAgIHZhciBlcnJvcmVkID0gZmFsc2U7XG4gICAgICAgIHZhciBlcnJvclZhbHVlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy53b3JrKHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgZXJyb3JlZCA9IHRydWU7XG4gICAgICAgICAgICBlcnJvclZhbHVlID0gKCEhZSAmJiBlKSB8fCBuZXcgRXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yZWQpIHtcbiAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHJldHVybiBlcnJvclZhbHVlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBBc3luY0FjdGlvbi5wcm90b3R5cGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5jbG9zZWQpIHtcbiAgICAgICAgICAgIHZhciBfYSA9IHRoaXMsIGlkID0gX2EuaWQsIHNjaGVkdWxlciA9IF9hLnNjaGVkdWxlcjtcbiAgICAgICAgICAgIHZhciBhY3Rpb25zID0gc2NoZWR1bGVyLmFjdGlvbnM7XG4gICAgICAgICAgICB0aGlzLndvcmsgPSB0aGlzLnN0YXRlID0gdGhpcy5zY2hlZHVsZXIgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5wZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgICBhcnJSZW1vdmUoYWN0aW9ucywgdGhpcyk7XG4gICAgICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaWQgPSB0aGlzLnJlY3ljbGVBc3luY0lkKHNjaGVkdWxlciwgaWQsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kZWxheSA9IG51bGw7XG4gICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLnVuc3Vic2NyaWJlLmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBBc3luY0FjdGlvbjtcbn0oQWN0aW9uKSk7XG5leHBvcnQgeyBBc3luY0FjdGlvbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QXN5bmNBY3Rpb24uanMubWFwIiwiaW1wb3J0IHsgX19leHRlbmRzIH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBTY2hlZHVsZXIgfSBmcm9tICcuLi9TY2hlZHVsZXInO1xudmFyIEFzeW5jU2NoZWR1bGVyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQXN5bmNTY2hlZHVsZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQXN5bmNTY2hlZHVsZXIoU2NoZWR1bGVyQWN0aW9uLCBub3cpIHtcbiAgICAgICAgaWYgKG5vdyA9PT0gdm9pZCAwKSB7IG5vdyA9IFNjaGVkdWxlci5ub3c7IH1cbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgU2NoZWR1bGVyQWN0aW9uLCBub3cpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmFjdGlvbnMgPSBbXTtcbiAgICAgICAgX3RoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICBfdGhpcy5fc2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIEFzeW5jU2NoZWR1bGVyLnByb3RvdHlwZS5mbHVzaCA9IGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgdmFyIGFjdGlvbnMgPSB0aGlzLmFjdGlvbnM7XG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmUpIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaChhY3Rpb24pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgdGhpcy5fYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgaWYgKChlcnJvciA9IGFjdGlvbi5leGVjdXRlKGFjdGlvbi5zdGF0ZSwgYWN0aW9uLmRlbGF5KSkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAoKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkpO1xuICAgICAgICB0aGlzLl9hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB3aGlsZSAoKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gQXN5bmNTY2hlZHVsZXI7XG59KFNjaGVkdWxlcikpO1xuZXhwb3J0IHsgQXN5bmNTY2hlZHVsZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUFzeW5jU2NoZWR1bGVyLmpzLm1hcCIsImltcG9ydCB7IEFuaW1hdGlvbkZyYW1lQWN0aW9uIH0gZnJvbSAnLi9BbmltYXRpb25GcmFtZUFjdGlvbic7XG5pbXBvcnQgeyBBbmltYXRpb25GcmFtZVNjaGVkdWxlciB9IGZyb20gJy4vQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXInO1xuZXhwb3J0IHZhciBhbmltYXRpb25GcmFtZVNjaGVkdWxlciA9IG5ldyBBbmltYXRpb25GcmFtZVNjaGVkdWxlcihBbmltYXRpb25GcmFtZUFjdGlvbik7XG5leHBvcnQgdmFyIGFuaW1hdGlvbkZyYW1lID0gYW5pbWF0aW9uRnJhbWVTY2hlZHVsZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbmltYXRpb25GcmFtZS5qcy5tYXAiLCJpbXBvcnQgeyBfX3JlYWQsIF9fc3ByZWFkQXJyYXkgfSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5leHBvcnQgdmFyIGFuaW1hdGlvbkZyYW1lUHJvdmlkZXIgPSB7XG4gICAgc2NoZWR1bGU6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICB2YXIgcmVxdWVzdCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICAgICAgdmFyIGNhbmNlbCA9IGNhbmNlbEFuaW1hdGlvbkZyYW1lO1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBhbmltYXRpb25GcmFtZVByb3ZpZGVyLmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICAgIHJlcXVlc3QgPSBkZWxlZ2F0ZS5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gICAgICAgICAgICBjYW5jZWwgPSBkZWxlZ2F0ZS5jYW5jZWxBbmltYXRpb25GcmFtZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaGFuZGxlID0gcmVxdWVzdChmdW5jdGlvbiAodGltZXN0YW1wKSB7XG4gICAgICAgICAgICBjYW5jZWwgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjYWxsYmFjayh0aW1lc3RhbXApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdWJzY3JpcHRpb24oZnVuY3Rpb24gKCkgeyByZXR1cm4gY2FuY2VsID09PSBudWxsIHx8IGNhbmNlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2FuY2VsKGhhbmRsZSk7IH0pO1xuICAgIH0sXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlbGVnYXRlID0gYW5pbWF0aW9uRnJhbWVQcm92aWRlci5kZWxlZ2F0ZTtcbiAgICAgICAgcmV0dXJuICgoZGVsZWdhdGUgPT09IG51bGwgfHwgZGVsZWdhdGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRlbGVnYXRlLnJlcXVlc3RBbmltYXRpb25GcmFtZSkgfHwgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKS5hcHBseSh2b2lkIDAsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChhcmdzKSkpO1xuICAgIH0sXG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGVsZWdhdGUgPSBhbmltYXRpb25GcmFtZVByb3ZpZGVyLmRlbGVnYXRlO1xuICAgICAgICByZXR1cm4gKChkZWxlZ2F0ZSA9PT0gbnVsbCB8fCBkZWxlZ2F0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGVsZWdhdGUuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHx8IGNhbmNlbEFuaW1hdGlvbkZyYW1lKS5hcHBseSh2b2lkIDAsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChhcmdzKSkpO1xuICAgIH0sXG4gICAgZGVsZWdhdGU6IHVuZGVmaW5lZCxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbmltYXRpb25GcmFtZVByb3ZpZGVyLmpzLm1hcCIsImltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBBc3luY1NjaGVkdWxlciB9IGZyb20gJy4vQXN5bmNTY2hlZHVsZXInO1xuZXhwb3J0IHZhciBhc3luY1NjaGVkdWxlciA9IG5ldyBBc3luY1NjaGVkdWxlcihBc3luY0FjdGlvbik7XG5leHBvcnQgdmFyIGFzeW5jID0gYXN5bmNTY2hlZHVsZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hc3luYy5qcy5tYXAiLCJleHBvcnQgdmFyIGRhdGVUaW1lc3RhbXBQcm92aWRlciA9IHtcbiAgICBub3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChkYXRlVGltZXN0YW1wUHJvdmlkZXIuZGVsZWdhdGUgfHwgRGF0ZSkubm93KCk7XG4gICAgfSxcbiAgICBkZWxlZ2F0ZTogdW5kZWZpbmVkLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGVUaW1lc3RhbXBQcm92aWRlci5qcy5tYXAiLCJpbXBvcnQgeyBfX3JlYWQsIF9fc3ByZWFkQXJyYXkgfSBmcm9tIFwidHNsaWJcIjtcbmV4cG9ydCB2YXIgaW50ZXJ2YWxQcm92aWRlciA9IHtcbiAgICBzZXRJbnRlcnZhbDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGludGVydmFsUHJvdmlkZXIuZGVsZWdhdGU7XG4gICAgICAgIHJldHVybiAoKGRlbGVnYXRlID09PSBudWxsIHx8IGRlbGVnYXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkZWxlZ2F0ZS5zZXRJbnRlcnZhbCkgfHwgc2V0SW50ZXJ2YWwpLmFwcGx5KHZvaWQgMCwgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGFyZ3MpKSk7XG4gICAgfSxcbiAgICBjbGVhckludGVydmFsOiBmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGludGVydmFsUHJvdmlkZXIuZGVsZWdhdGU7XG4gICAgICAgIHJldHVybiAoKGRlbGVnYXRlID09PSBudWxsIHx8IGRlbGVnYXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkZWxlZ2F0ZS5jbGVhckludGVydmFsKSB8fCBjbGVhckludGVydmFsKShoYW5kbGUpO1xuICAgIH0sXG4gICAgZGVsZWdhdGU6IHVuZGVmaW5lZCxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbnRlcnZhbFByb3ZpZGVyLmpzLm1hcCIsImltcG9ydCB7IF9fcmVhZCwgX19zcHJlYWRBcnJheSB9IGZyb20gXCJ0c2xpYlwiO1xuZXhwb3J0IHZhciB0aW1lb3V0UHJvdmlkZXIgPSB7XG4gICAgc2V0VGltZW91dDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IHRpbWVvdXRQcm92aWRlci5kZWxlZ2F0ZTtcbiAgICAgICAgcmV0dXJuICgoZGVsZWdhdGUgPT09IG51bGwgfHwgZGVsZWdhdGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRlbGVnYXRlLnNldFRpbWVvdXQpIHx8IHNldFRpbWVvdXQpLmFwcGx5KHZvaWQgMCwgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGFyZ3MpKSk7XG4gICAgfSxcbiAgICBjbGVhclRpbWVvdXQ6IGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gdGltZW91dFByb3ZpZGVyLmRlbGVnYXRlO1xuICAgICAgICByZXR1cm4gKChkZWxlZ2F0ZSA9PT0gbnVsbCB8fCBkZWxlZ2F0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGVsZWdhdGUuY2xlYXJUaW1lb3V0KSB8fCBjbGVhclRpbWVvdXQpKGhhbmRsZSk7XG4gICAgfSxcbiAgICBkZWxlZ2F0ZTogdW5kZWZpbmVkLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRpbWVvdXRQcm92aWRlci5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gZ2V0U3ltYm9sSXRlcmF0b3IoKSB7XG4gICAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICdmdW5jdGlvbicgfHwgIVN5bWJvbC5pdGVyYXRvcikge1xuICAgICAgICByZXR1cm4gJ0BAaXRlcmF0b3InO1xuICAgIH1cbiAgICByZXR1cm4gU3ltYm9sLml0ZXJhdG9yO1xufVxuZXhwb3J0IHZhciBpdGVyYXRvciA9IGdldFN5bWJvbEl0ZXJhdG9yKCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pdGVyYXRvci5qcy5tYXAiLCJleHBvcnQgdmFyIG9ic2VydmFibGUgPSAoZnVuY3Rpb24gKCkgeyByZXR1cm4gKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLm9ic2VydmFibGUpIHx8ICdAQG9ic2VydmFibGUnOyB9KSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b2JzZXJ2YWJsZS5qcy5tYXAiLCJpbXBvcnQgeyBjcmVhdGVFcnJvckNsYXNzIH0gZnJvbSAnLi9jcmVhdGVFcnJvckNsYXNzJztcbmV4cG9ydCB2YXIgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IgPSBjcmVhdGVFcnJvckNsYXNzKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3JJbXBsKCkge1xuICAgICAgICBfc3VwZXIodGhpcyk7XG4gICAgICAgIHRoaXMubmFtZSA9ICdPYmplY3RVbnN1YnNjcmliZWRFcnJvcic7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9ICdvYmplY3QgdW5zdWJzY3JpYmVkJztcbiAgICB9O1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1PYmplY3RVbnN1YnNjcmliZWRFcnJvci5qcy5tYXAiLCJpbXBvcnQgeyBjcmVhdGVFcnJvckNsYXNzIH0gZnJvbSAnLi9jcmVhdGVFcnJvckNsYXNzJztcbmV4cG9ydCB2YXIgVW5zdWJzY3JpcHRpb25FcnJvciA9IGNyZWF0ZUVycm9yQ2xhc3MoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIHJldHVybiBmdW5jdGlvbiBVbnN1YnNjcmlwdGlvbkVycm9ySW1wbChlcnJvcnMpIHtcbiAgICAgICAgX3N1cGVyKHRoaXMpO1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBlcnJvcnNcbiAgICAgICAgICAgID8gZXJyb3JzLmxlbmd0aCArIFwiIGVycm9ycyBvY2N1cnJlZCBkdXJpbmcgdW5zdWJzY3JpcHRpb246XFxuXCIgKyBlcnJvcnMubWFwKGZ1bmN0aW9uIChlcnIsIGkpIHsgcmV0dXJuIGkgKyAxICsgXCIpIFwiICsgZXJyLnRvU3RyaW5nKCk7IH0pLmpvaW4oJ1xcbiAgJylcbiAgICAgICAgICAgIDogJyc7XG4gICAgICAgIHRoaXMubmFtZSA9ICdVbnN1YnNjcmlwdGlvbkVycm9yJztcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBlcnJvcnM7XG4gICAgfTtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VW5zdWJzY3JpcHRpb25FcnJvci5qcy5tYXAiLCJpbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IGlzU2NoZWR1bGVyIH0gZnJvbSAnLi9pc1NjaGVkdWxlcic7XG5mdW5jdGlvbiBsYXN0KGFycikge1xuICAgIHJldHVybiBhcnJbYXJyLmxlbmd0aCAtIDFdO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBvcFJlc3VsdFNlbGVjdG9yKGFyZ3MpIHtcbiAgICByZXR1cm4gaXNGdW5jdGlvbihsYXN0KGFyZ3MpKSA/IGFyZ3MucG9wKCkgOiB1bmRlZmluZWQ7XG59XG5leHBvcnQgZnVuY3Rpb24gcG9wU2NoZWR1bGVyKGFyZ3MpIHtcbiAgICByZXR1cm4gaXNTY2hlZHVsZXIobGFzdChhcmdzKSkgPyBhcmdzLnBvcCgpIDogdW5kZWZpbmVkO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBvcE51bWJlcihhcmdzLCBkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIGxhc3QoYXJncykgPT09ICdudW1iZXInID8gYXJncy5wb3AoKSA6IGRlZmF1bHRWYWx1ZTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFyZ3MuanMubWFwIiwidmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xudmFyIGdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mLCBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGUsIGdldEtleXMgPSBPYmplY3Qua2V5cztcbmV4cG9ydCBmdW5jdGlvbiBhcmdzQXJnQXJyYXlPck9iamVjdChhcmdzKSB7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHZhciBmaXJzdF8xID0gYXJnc1swXTtcbiAgICAgICAgaWYgKGlzQXJyYXkoZmlyc3RfMSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGFyZ3M6IGZpcnN0XzEsIGtleXM6IG51bGwgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNQT0pPKGZpcnN0XzEpKSB7XG4gICAgICAgICAgICB2YXIga2V5cyA9IGdldEtleXMoZmlyc3RfMSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGFyZ3M6IGtleXMubWFwKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIGZpcnN0XzFba2V5XTsgfSksXG4gICAgICAgICAgICAgICAga2V5czoga2V5cyxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgYXJnczogYXJncywga2V5czogbnVsbCB9O1xufVxuZnVuY3Rpb24gaXNQT0pPKG9iaikge1xuICAgIHJldHVybiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgZ2V0UHJvdG90eXBlT2Yob2JqKSA9PT0gb2JqZWN0UHJvdG87XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcmdzQXJnQXJyYXlPck9iamVjdC5qcy5tYXAiLCJ2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5leHBvcnQgZnVuY3Rpb24gYXJnc09yQXJnQXJyYXkoYXJncykge1xuICAgIHJldHVybiBhcmdzLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KGFyZ3NbMF0pID8gYXJnc1swXSA6IGFyZ3M7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcmdzT3JBcmdBcnJheS5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gYXJyUmVtb3ZlKGFyciwgaXRlbSkge1xuICAgIGlmIChhcnIpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gYXJyLmluZGV4T2YoaXRlbSk7XG4gICAgICAgIDAgPD0gaW5kZXggJiYgYXJyLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXJyUmVtb3ZlLmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBjYXVnaHRTY2hlZHVsZShzdWJzY3JpYmVyLCBzY2hlZHVsZXIsIGV4ZWN1dGUsIGRlbGF5KSB7XG4gICAgaWYgKGRlbGF5ID09PSB2b2lkIDApIHsgZGVsYXkgPSAwOyB9XG4gICAgdmFyIHN1YnNjcmlwdGlvbiA9IHNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBleGVjdXRlLmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgfSwgZGVsYXkpO1xuICAgIHN1YnNjcmliZXIuYWRkKHN1YnNjcmlwdGlvbik7XG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNhdWdodFNjaGVkdWxlLmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFcnJvckNsYXNzKGNyZWF0ZUltcGwpIHtcbiAgICB2YXIgX3N1cGVyID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgIEVycm9yLmNhbGwoaW5zdGFuY2UpO1xuICAgICAgICBpbnN0YW5jZS5zdGFjayA9IG5ldyBFcnJvcigpLnN0YWNrO1xuICAgIH07XG4gICAgdmFyIGN0b3JGdW5jID0gY3JlYXRlSW1wbChfc3VwZXIpO1xuICAgIGN0b3JGdW5jLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbiAgICBjdG9yRnVuYy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yRnVuYztcbiAgICByZXR1cm4gY3RvckZ1bmM7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jcmVhdGVFcnJvckNsYXNzLmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVPYmplY3Qoa2V5cywgdmFsdWVzKSB7XG4gICAgcmV0dXJuIGtleXMucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIGtleSwgaSkgeyByZXR1cm4gKChyZXN1bHRba2V5XSA9IHZhbHVlc1tpXSksIHJlc3VsdCk7IH0sIHt9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNyZWF0ZU9iamVjdC5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gaWRlbnRpdHkoeCkge1xuICAgIHJldHVybiB4O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aWRlbnRpdHkuanMubWFwIiwiZXhwb3J0IHZhciBpc0FycmF5TGlrZSA9IChmdW5jdGlvbiAoeCkgeyByZXR1cm4geCAmJiB0eXBlb2YgeC5sZW5ndGggPT09ICdudW1iZXInICYmIHR5cGVvZiB4ICE9PSAnZnVuY3Rpb24nOyB9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzQXJyYXlMaWtlLmpzLm1hcCIsImltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL2lzRnVuY3Rpb24nO1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXN5bmNJdGVyYWJsZShvYmopIHtcbiAgICByZXR1cm4gU3ltYm9sLmFzeW5jSXRlcmF0b3IgJiYgaXNGdW5jdGlvbihvYmogPT09IG51bGwgfHwgb2JqID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvYmpbU3ltYm9sLmFzeW5jSXRlcmF0b3JdKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzQXN5bmNJdGVyYWJsZS5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gaXNWYWxpZERhdGUodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlICYmICFpc05hTih2YWx1ZSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc0RhdGUuanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNGdW5jdGlvbi5qcy5tYXAiLCJpbXBvcnQgeyBvYnNlcnZhYmxlIGFzIFN5bWJvbF9vYnNlcnZhYmxlIH0gZnJvbSAnLi4vc3ltYm9sL29ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gaXNJbnRlcm9wT2JzZXJ2YWJsZShpbnB1dCkge1xuICAgIHJldHVybiBpc0Z1bmN0aW9uKGlucHV0W1N5bWJvbF9vYnNlcnZhYmxlXSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc0ludGVyb3BPYnNlcnZhYmxlLmpzLm1hcCIsImltcG9ydCB7IGl0ZXJhdG9yIGFzIFN5bWJvbF9pdGVyYXRvciB9IGZyb20gJy4uL3N5bWJvbC9pdGVyYXRvcic7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi9pc0Z1bmN0aW9uJztcbmV4cG9ydCBmdW5jdGlvbiBpc0l0ZXJhYmxlKGlucHV0KSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24oaW5wdXQgPT09IG51bGwgfHwgaW5wdXQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGlucHV0W1N5bWJvbF9pdGVyYXRvcl0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNJdGVyYWJsZS5qcy5tYXAiLCJpbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSBcIi4vaXNGdW5jdGlvblwiO1xuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvbWlzZSh2YWx1ZSkge1xuICAgIHJldHVybiBpc0Z1bmN0aW9uKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB2b2lkIDAgPyB2b2lkIDAgOiB2YWx1ZS50aGVuKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzUHJvbWlzZS5qcy5tYXAiLCJpbXBvcnQgeyBfX2FzeW5jR2VuZXJhdG9yLCBfX2F3YWl0LCBfX2dlbmVyYXRvciB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gcmVhZGFibGVTdHJlYW1MaWtlVG9Bc3luY0dlbmVyYXRvcihyZWFkYWJsZVN0cmVhbSkge1xuICAgIHJldHVybiBfX2FzeW5jR2VuZXJhdG9yKHRoaXMsIGFyZ3VtZW50cywgZnVuY3Rpb24gcmVhZGFibGVTdHJlYW1MaWtlVG9Bc3luY0dlbmVyYXRvcl8xKCkge1xuICAgICAgICB2YXIgcmVhZGVyLCBfYSwgdmFsdWUsIGRvbmU7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2IubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIHJlYWRlciA9IHJlYWRhYmxlU3RyZWFtLmdldFJlYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDE7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBfYi50cnlzLnB1c2goWzEsICwgOSwgMTBdKTtcbiAgICAgICAgICAgICAgICAgICAgX2IubGFiZWwgPSAyO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0cnVlKSByZXR1cm4gWzMsIDhdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQsIF9fYXdhaXQocmVhZGVyLnJlYWQoKSldO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgX2EgPSBfYi5zZW50KCksIHZhbHVlID0gX2EudmFsdWUsIGRvbmUgPSBfYS5kb25lO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWRvbmUpIHJldHVybiBbMywgNV07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCwgX19hd2FpdCh2b2lkIDApXTtcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiwgX2Iuc2VudCgpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IHJldHVybiBbNCwgX19hd2FpdCh2YWx1ZSldO1xuICAgICAgICAgICAgICAgIGNhc2UgNjogcmV0dXJuIFs0LCBfYi5zZW50KCldO1xuICAgICAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgICAgICAgX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDJdO1xuICAgICAgICAgICAgICAgIGNhc2UgODogcmV0dXJuIFszLCAxMF07XG4gICAgICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAgICAgICByZWFkZXIucmVsZWFzZUxvY2soKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs3XTtcbiAgICAgICAgICAgICAgICBjYXNlIDEwOiByZXR1cm4gWzJdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1JlYWRhYmxlU3RyZWFtTGlrZShvYmopIHtcbiAgICByZXR1cm4gaXNGdW5jdGlvbihvYmogPT09IG51bGwgfHwgb2JqID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvYmouZ2V0UmVhZGVyKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzUmVhZGFibGVTdHJlYW1MaWtlLmpzLm1hcCIsImltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL2lzRnVuY3Rpb24nO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2NoZWR1bGVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIGlzRnVuY3Rpb24odmFsdWUuc2NoZWR1bGUpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNTY2hlZHVsZXIuanMubWFwIiwiaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gaGFzTGlmdChzb3VyY2UpIHtcbiAgICByZXR1cm4gaXNGdW5jdGlvbihzb3VyY2UgPT09IG51bGwgfHwgc291cmNlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzb3VyY2UubGlmdCk7XG59XG5leHBvcnQgZnVuY3Rpb24gb3BlcmF0ZShpbml0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgICAgaWYgKGhhc0xpZnQoc291cmNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5saWZ0KGZ1bmN0aW9uIChsaWZ0ZWRTb3VyY2UpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5pdChsaWZ0ZWRTb3VyY2UsIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmFibGUgdG8gbGlmdCB1bmtub3duIE9ic2VydmFibGUgdHlwZScpO1xuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1saWZ0LmpzLm1hcCIsImltcG9ydCB7IF9fcmVhZCwgX19zcHJlYWRBcnJheSB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSBcIi4uL29wZXJhdG9ycy9tYXBcIjtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbmZ1bmN0aW9uIGNhbGxPckFwcGx5KGZuLCBhcmdzKSB7XG4gICAgcmV0dXJuIGlzQXJyYXkoYXJncykgPyBmbi5hcHBseSh2b2lkIDAsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChhcmdzKSkpIDogZm4oYXJncyk7XG59XG5leHBvcnQgZnVuY3Rpb24gbWFwT25lT3JNYW55QXJncyhmbikge1xuICAgIHJldHVybiBtYXAoZnVuY3Rpb24gKGFyZ3MpIHsgcmV0dXJuIGNhbGxPckFwcGx5KGZuLCBhcmdzKTsgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXBPbmVPck1hbnlBcmdzLmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBub29wKCkgeyB9XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ub29wLmpzLm1hcCIsImltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi9pZGVudGl0eSc7XG5leHBvcnQgZnVuY3Rpb24gcGlwZSgpIHtcbiAgICB2YXIgZm5zID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgZm5zW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHJldHVybiBwaXBlRnJvbUFycmF5KGZucyk7XG59XG5leHBvcnQgZnVuY3Rpb24gcGlwZUZyb21BcnJheShmbnMpIHtcbiAgICBpZiAoZm5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gaWRlbnRpdHk7XG4gICAgfVxuICAgIGlmIChmbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiBmbnNbMF07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiBwaXBlZChpbnB1dCkge1xuICAgICAgICByZXR1cm4gZm5zLnJlZHVjZShmdW5jdGlvbiAocHJldiwgZm4pIHsgcmV0dXJuIGZuKHByZXYpOyB9LCBpbnB1dCk7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpcGUuanMubWFwIiwiaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7IHRpbWVvdXRQcm92aWRlciB9IGZyb20gJy4uL3NjaGVkdWxlci90aW1lb3V0UHJvdmlkZXInO1xuZXhwb3J0IGZ1bmN0aW9uIHJlcG9ydFVuaGFuZGxlZEVycm9yKGVycikge1xuICAgIHRpbWVvdXRQcm92aWRlci5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9uVW5oYW5kbGVkRXJyb3IgPSBjb25maWcub25VbmhhbmRsZWRFcnJvcjtcbiAgICAgICAgaWYgKG9uVW5oYW5kbGVkRXJyb3IpIHtcbiAgICAgICAgICAgIG9uVW5oYW5kbGVkRXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVwb3J0VW5oYW5kbGVkRXJyb3IuanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUludmFsaWRPYnNlcnZhYmxlVHlwZUVycm9yKGlucHV0KSB7XG4gICAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXCJZb3UgcHJvdmlkZWQgXCIgKyAoaW5wdXQgIT09IG51bGwgJiYgdHlwZW9mIGlucHV0ID09PSAnb2JqZWN0JyA/ICdhbiBpbnZhbGlkIG9iamVjdCcgOiBcIidcIiArIGlucHV0ICsgXCInXCIpICsgXCIgd2hlcmUgYSBzdHJlYW0gd2FzIGV4cGVjdGVkLiBZb3UgY2FuIHByb3ZpZGUgYW4gT2JzZXJ2YWJsZSwgUHJvbWlzZSwgUmVhZGFibGVTdHJlYW0sIEFycmF5LCBBc3luY0l0ZXJhYmxlLCBvciBJdGVyYWJsZS5cIik7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHJvd1Vub2JzZXJ2YWJsZUVycm9yLmpzLm1hcCIsImltcG9ydCAqIGFzIFR3byBmcm9tICd0d29qcy10cydcclxuaW1wb3J0IHsgZ2V0UmFuZG9tSW50SW5SYW5nZSB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbmVteSB7XHJcbiAgdHdvOiBUd29cclxuICBwYXduOiBUd28uUGF0aFxyXG4gIHBhd25SYWRpdXM6IG51bWJlciA9IDIwXHJcbiAgZGlyZWN0aW9uOiBUd28uVmVjdG9yXHJcbiAgc3Bhd25UaW1lOiBudW1iZXJcclxuXHJcbiAgbWF4T3V0T2ZCb3VuZHNTcGF3bk9mZnNldCA9IDEwMFxyXG5cclxuICBjb25zdHJ1Y3Rvcih0d286IFR3bywgZ29hbDogVHdvLlZlY3RvciwgbGF5ZXI6IFR3by5Hcm91cCkge1xyXG4gICAgdGhpcy50d28gPSB0d29cclxuICAgIHRoaXMuY3JlYXRlUGF3bigpXHJcbiAgICBsYXllci5hZGQodGhpcy5wYXduKVxyXG4gICAgdGhpcy5zZXRNb3ZlbWVudERpcmVjdGlvbihnb2FsKVxyXG4gICAgdGhpcy5zcGF3blRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxyXG4gIH1cclxuXHJcbiAgY3JlYXRlUGF3bigpIHtcclxuICAgIGNvbnN0IHN0YXJ0aW5nUG9zaXRpb24gPSB0aGlzLmdldE91dE9mQm91bmRzUG9zaXRpb24oKVxyXG4gICAgY29uc3QgcGF3biA9IHRoaXMudHdvLm1ha2VDaXJjbGUoc3RhcnRpbmdQb3NpdGlvbi54LCBzdGFydGluZ1Bvc2l0aW9uLnksIHRoaXMucGF3blJhZGl1cylcclxuXHJcbiAgICBwYXduLmZpbGwgPSAnIzM0YjRlYidcclxuICAgIHBhd24ubGluZXdpZHRoID0gMFxyXG5cclxuICAgIHRoaXMucGF3biA9IHBhd25cclxuICB9XHJcblxyXG4gIGdldE91dE9mQm91bmRzUG9zaXRpb24oKTogVHdvLlZlY3RvciB7XHJcbiAgICAvLyBjb25zdCB4ID0gZ2V0UmFuZG9tSW50SW5SYW5nZSgwLCB0aGlzLnR3by53aWR0aClcclxuICAgIC8vIGNvbnN0IHkgPSBnZXRSYW5kb21JbnRJblJhbmdlKDAsIHRoaXMudHdvLmhlaWdodClcclxuICAgIC8vIHJldHVybiBuZXcgVHdvLlZlY3Rvcih4LCB5KVxyXG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPCB0aGlzLnR3by53aWR0aCAvICh0aGlzLnR3by53aWR0aCArIHRoaXMudHdvLmhlaWdodCkpIHtcclxuICAgICAgLy8gRW5lbXkgc3Bhd25zIHRvcCBvciBib3R0b20gb2YgdGhlIHNjcmVlblxyXG4gICAgICBjb25zdCB4ID0gZ2V0UmFuZG9tSW50SW5SYW5nZSgwLCB0aGlzLnR3by53aWR0aClcclxuICAgICAgY29uc3QgeSA9XHJcbiAgICAgICAgTWF0aC5yYW5kb20oKSA+IDAuNVxyXG4gICAgICAgICAgPyBnZXRSYW5kb21JbnRJblJhbmdlKC10aGlzLm1heE91dE9mQm91bmRzU3Bhd25PZmZzZXQsIDApXHJcbiAgICAgICAgICA6IGdldFJhbmRvbUludEluUmFuZ2UodGhpcy50d28uaGVpZ2h0LCB0aGlzLnR3by5oZWlnaHQgKyB0aGlzLm1heE91dE9mQm91bmRzU3Bhd25PZmZzZXQpXHJcbiAgICAgIHJldHVybiBuZXcgVHdvLlZlY3Rvcih4LCB5KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gRW5lbXkgc3B3YW5zIGxlZnQgb3IgcmlnaHQgb2YgdGhlIHNjcmVlblxyXG4gICAgICBjb25zdCB4ID1cclxuICAgICAgICBNYXRoLnJhbmRvbSgpID4gMC41XHJcbiAgICAgICAgICA/IGdldFJhbmRvbUludEluUmFuZ2UoLXRoaXMubWF4T3V0T2ZCb3VuZHNTcGF3bk9mZnNldCwgMClcclxuICAgICAgICAgIDogZ2V0UmFuZG9tSW50SW5SYW5nZSh0aGlzLnR3by53aWR0aCwgdGhpcy50d28ud2lkdGggKyB0aGlzLm1heE91dE9mQm91bmRzU3Bhd25PZmZzZXQpXHJcbiAgICAgIGNvbnN0IHkgPSBnZXRSYW5kb21JbnRJblJhbmdlKDAsIHRoaXMudHdvLmhlaWdodClcclxuICAgICAgcmV0dXJuIG5ldyBUd28uVmVjdG9yKHgsIHkpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpc0luQm91bmRzKCkge1xyXG4gICAgaWYgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIDwgdGhpcy5zcGF3blRpbWUgKyA1MDAwKSB7XHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgeyB4LCB5IH0gPSB0aGlzLnBhd24udHJhbnNsYXRpb25cclxuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy50d29cclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICB4ID4gLXRoaXMubWF4T3V0T2ZCb3VuZHNTcGF3bk9mZnNldCAmJlxyXG4gICAgICB4IDwgd2lkdGggKyB0aGlzLm1heE91dE9mQm91bmRzU3Bhd25PZmZzZXQgJiZcclxuICAgICAgeSA+IC10aGlzLm1heE91dE9mQm91bmRzU3Bhd25PZmZzZXQgJiZcclxuICAgICAgeSA8IGhlaWdodCArIHRoaXMubWF4T3V0T2ZCb3VuZHNTcGF3bk9mZnNldFxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgZGVzdHJveVBhd24oKSB7XHJcbiAgICB0aGlzLnBhd24ucmVtb3ZlKClcclxuICB9XHJcblxyXG4gIHNldE1vdmVtZW50RGlyZWN0aW9uKGdvYWw6IFR3by5WZWN0b3IpIHtcclxuICAgIHRoaXMuZGlyZWN0aW9uID0gZ29hbC5jbG9uZSgpLnN1YlNlbGYodGhpcy5wYXduLnRyYW5zbGF0aW9uKS5ub3JtYWxpemUoKVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlKGRlbHRhVGltZTogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnBhd24udHJhbnNsYXRpb24ubGVycChcclxuICAgICAgdGhpcy5wYXduLnRyYW5zbGF0aW9uLmNsb25lKCkuYWRkU2VsZih0aGlzLmRpcmVjdGlvbiksXHJcbiAgICAgIDIyMCAqIGRlbHRhVGltZVxyXG4gICAgKVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBUd28gZnJvbSAndHdvanMtdHMnXHJcbmltcG9ydCBFbmVteSBmcm9tICcuL0VuZW15J1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcclxuICB0d286IFR3b1xyXG4gIHBhd246IFR3by5DaXJjbGVcclxuICBwYXduUmFkaXVzOiBudW1iZXIgPSAzMFxyXG4gIG1vdmVTcGVlZDogbnVtYmVyID0gMzAwXHJcbiAgZ29hbDogVHdvLlZlY3RvclxyXG5cclxuICBjb25zdHJ1Y3Rvcih0d286IFR3bywgbGF5ZXI6IFR3by5Hcm91cCkge1xyXG4gICAgdGhpcy50d28gPSB0d29cclxuICAgIHRoaXMucGF3biA9IHRoaXMuY3JlYXRlUGF3bigpXHJcbiAgICBsYXllci5hZGQodGhpcy5wYXduKVxyXG4gIH1cclxuXHJcbiAgbW92ZVRvR29hbChkZWx0YVRpbWU6IG51bWJlcikge1xyXG4gICAgY29uc3QgcGF3blRvR29hbERpc3RhbmNlID0gdGhpcy5nZXREaXN0YW5jZVRvR29hbCgpXHJcbiAgICBjb25zdCB0ID0gKHRoaXMubW92ZVNwZWVkIC8gcGF3blRvR29hbERpc3RhbmNlKSAqIGRlbHRhVGltZVxyXG4gICAgdGhpcy5wYXduLnRyYW5zbGF0aW9uLmxlcnAodGhpcy5nb2FsLCB0KVxyXG4gIH1cclxuXHJcbiAgZ2V0RGlzdGFuY2VUb0dvYWwoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wYXduLnRyYW5zbGF0aW9uLmRpc3RhbmNlVG8odGhpcy5nb2FsKVxyXG4gIH1cclxuXHJcbiAgaGFzUmVhY2hlZEdvYWwoKSB7XHJcbiAgICBjb25zdCBwYXduVG9Hb2FsRGlzdGFuY2UgPSB0aGlzLmdldERpc3RhbmNlVG9Hb2FsKClcclxuICAgIHJldHVybiBwYXduVG9Hb2FsRGlzdGFuY2UgPCAxMFxyXG4gIH1cclxuXHJcbiAgY3JlYXRlUGF3bigpOiBUd28uUGF0aCB7XHJcbiAgICBjb25zdCBwYXduID0gdGhpcy50d28ubWFrZUNpcmNsZSh0aGlzLnR3by53aWR0aCAvIDIsIHRoaXMudHdvLmhlaWdodCAvIDIsIHRoaXMucGF3blJhZGl1cylcclxuICAgIHBhd24uZmlsbCA9ICcjRkY4MDAwJ1xyXG4gICAgcGF3bi5saW5ld2lkdGggPSAwXHJcbiAgICByZXR1cm4gcGF3blxyXG4gIH1cclxuXHJcbiAgc2V0R29hbChuZXdHb2FsOiBUd28uVmVjdG9yKSB7XHJcbiAgICB0aGlzLmdvYWwgPSBuZXdHb2FsXHJcbiAgfVxyXG5cclxuICB1cGRhdGUoZGVsdGFUaW1lOiBudW1iZXIpIHtcclxuICAgIGlmICh0aGlzLmdvYWwpIHtcclxuICAgICAgdGhpcy5tb3ZlVG9Hb2FsKGRlbHRhVGltZSlcclxuICAgICAgaWYgKHRoaXMuaGFzUmVhY2hlZEdvYWwoKSkge1xyXG4gICAgICAgIHRoaXMuZ29hbCA9IG51bGxcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0UG9zaXRpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wYXduLnRyYW5zbGF0aW9uXHJcbiAgfVxyXG5cclxuICBpc0NvbGxpZGluZ1dpdGhFbmVteShlbmVteTogRW5lbXkpIHtcclxuICAgIGNvbnN0IHBsYXllclRvRW5lbXlEaXN0YW5jZSA9IHRoaXMucGF3bi50cmFuc2xhdGlvbi5kaXN0YW5jZVRvKGVuZW15LnBhd24udHJhbnNsYXRpb24pXHJcbiAgICByZXR1cm4gcGxheWVyVG9FbmVteURpc3RhbmNlICsgNSA8IHRoaXMucGF3blJhZGl1cyArIGVuZW15LnBhd25SYWRpdXNcclxuICB9XHJcblxyXG4gIHJlc2V0KCkge1xyXG4gICAgY29uc3QgbWlkZGxlT2ZTY3JlZW4gPSBuZXcgVHdvLlZlY3Rvcih0aGlzLnR3by53aWR0aCAvIDIsIHRoaXMudHdvLmhlaWdodCAvIDIpXHJcbiAgICB0aGlzLnBhd24udHJhbnNsYXRpb24gPSBtaWRkbGVPZlNjcmVlblxyXG4gICAgdGhpcy5nb2FsID0gbnVsbFxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBUd28gZnJvbSAndHdvanMtdHMnXHJcblxyXG5leHBvcnQgY2xhc3MgU2NvcmUge1xyXG4gIHR3bzogVHdvXHJcbiAgc2NvcmUgPSAwXHJcbiAgc2NvcmVUZXh0OiBUd28uVGV4dFxyXG5cclxuICBjb25zdHJ1Y3Rvcih0d286IFR3bywgbGF5ZXI6IFR3by5Hcm91cCkge1xyXG4gICAgdGhpcy50d28gPSB0d29cclxuICAgIHRoaXMuc2NvcmVUZXh0ID0gbmV3IFR3by5UZXh0KGBTY29yZTogJHt0aGlzLnNjb3JlfWAsIDYwLCA3MCwge1xyXG4gICAgICBzaXplOiAzMixcclxuICAgICAgYWxpZ25tZW50OiAnbGVmdCcsXHJcbiAgICAgIGZpbGw6ICcjZmZmJyxcclxuICAgICAgdmlzaWJsZTogZmFsc2UsXHJcbiAgICB9KVxyXG4gICAgbGF5ZXIuYWRkKHRoaXMuc2NvcmVUZXh0KVxyXG5cclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHR3by5hZGQodGhpcy5zY29yZVRleHQpXHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKSB7XHJcbiAgICB0aGlzLnNjb3JlVGV4dC52YWx1ZSA9IGBTY29yZTogJHt0aGlzLnNjb3JlfWBcclxuICB9XHJcblxyXG4gIGluY3JlbWVudCgpIHtcclxuICAgIHRoaXMuc2NvcmUrK1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBUd28gZnJvbSAndHdvanMtdHMnXHJcblxyXG5leHBvcnQgY2xhc3MgVGl0bGUge1xyXG4gIHR3bzogVHdvXHJcbiAgdGV4dDogVHdvLlRleHRcclxuICBvZmZzZXQ6IG51bWJlclxyXG5cclxuICBjb25zdHJ1Y3Rvcih0d286IFR3bywgb2Zmc2V0OiBudW1iZXIsIHNpemU6IG51bWJlciwgbGF5ZXI6IFR3by5Hcm91cCkge1xyXG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXRcclxuICAgIHRoaXMudHdvID0gdHdvXHJcbiAgICB0aGlzLnRleHQgPSBuZXcgVHdvLlRleHQoJycsIHR3by53aWR0aCAvIDIsIHR3by5oZWlnaHQgLyAyICsgb2Zmc2V0LCB7XHJcbiAgICAgIHNpemU6IHNpemUsXHJcbiAgICAgIHN0eWxlOiAnYm9sZCcsXHJcbiAgICAgIGZpbGw6ICcjZmZmJyxcclxuICAgICAgdmlzaWJsZTogZmFsc2UsXHJcbiAgICB9KVxyXG4gICAgbGF5ZXIuYWRkKHRoaXMudGV4dClcclxuXHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICB0d28uYWRkKHRoaXMudGV4dClcclxuICB9XHJcblxyXG4gIGNlbnRlcigpIHtcclxuICAgIHRoaXMudGV4dC50cmFuc2xhdGlvbiA9IG5ldyBUd28uVmVjdG9yKHRoaXMudHdvLndpZHRoIC8gMiwgdGhpcy50d28uaGVpZ2h0IC8gMiArIHRoaXMub2Zmc2V0KVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBhbmltYXRpb25GcmFtZVNjaGVkdWxlciwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnXHJcbmltcG9ydCB7IGV4cGFuZCwgbWFwLCBvYnNlcnZlT24sIHBhaXJ3aXNlLCBzaGFyZSwgd2l0aExhdGVzdEZyb20gfSBmcm9tICdyeGpzL29wZXJhdG9ycydcclxuXHJcbmNvbnN0IGZyYW1lUGFpbnRUaW1lJCA9IG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiB7XHJcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0aW1lKSA9PiB7XHJcbiAgICBzdWJzY3JpYmVyLm5leHQodGltZSlcclxuICB9KVxyXG59KVxyXG5cclxuZXhwb3J0IGNvbnN0IGRlbHRhVGltZSQgPSBmcmFtZVBhaW50VGltZSQucGlwZShcclxuICBvYnNlcnZlT24oYW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIpLFxyXG4gIGV4cGFuZCgoKSA9PiBmcmFtZVBhaW50VGltZSQpLFxyXG4gIHBhaXJ3aXNlKCksXHJcbiAgbWFwKChbcHJldmlvdXMsIGN1cnJlbnRdOiBbbnVtYmVyLCBudW1iZXJdKSA9PiAoY3VycmVudCAtIHByZXZpb3VzKSAvIDEwMDApLFxyXG4gIHNoYXJlKClcclxuKVxyXG4iLCJpbXBvcnQgeyBvZiwgdGltZXIgfSBmcm9tICdyeGpzJ1xyXG5pbXBvcnQgeyBjb21iaW5lTGF0ZXN0V2l0aCwgbWFwLCB0YWtlV2hpbGUsIHdpdGhMYXRlc3RGcm9tIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnXHJcbmltcG9ydCAqIGFzIFR3byBmcm9tICd0d29qcy10cydcclxuaW1wb3J0IHsgZGVsdGFUaW1lJCB9IGZyb20gJy4vZGVsdGFUaW1lJ1xyXG5pbXBvcnQgRW5lbXkgZnJvbSAnLi4vZW50aXRpZXMvRW5lbXknXHJcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi4vZW50aXRpZXMvUGxheWVyJ1xyXG5pbXBvcnQgeyBTY29yZSB9IGZyb20gJy4uL2VudGl0aWVzL1Njb3JlJ1xyXG5pbXBvcnQgeyBnYW1lU3RhdGUkIH0gZnJvbSAnLi9nYW1lU3RhdGUnXHJcbmltcG9ydCB7IGZpbmFsaXplV2l0aFZhbHVlIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzcGF3bkVuZW1pZXModHdvOiBUd28sIHBsYXllcjogUGxheWVyLCBzY29yZTogU2NvcmUsIGxheWVyOiBUd28uR3JvdXApIHtcclxuICByZXR1cm4gdGltZXIoMCwgMzAwKS5waXBlKG1hcCgoKSA9PiBzcGF3bkVuZW15KHR3bywgcGxheWVyLCBzY29yZSwgbGF5ZXIpKSlcclxufVxyXG5cclxuZnVuY3Rpb24gc3Bhd25FbmVteSh0d286IFR3bywgcGxheWVyOiBQbGF5ZXIsIHNjb3JlOiBTY29yZSwgbGF5ZXI6IFR3by5Hcm91cCkge1xyXG4gIG9mKG5ldyBFbmVteSh0d28sIHBsYXllci5nZXRQb3NpdGlvbigpLCBsYXllcikpXHJcbiAgICAucGlwZShcclxuICAgICAgY29tYmluZUxhdGVzdFdpdGgoZGVsdGFUaW1lJCksXHJcbiAgICAgIHdpdGhMYXRlc3RGcm9tKGdhbWVTdGF0ZSQpLFxyXG4gICAgICB0YWtlV2hpbGUoXHJcbiAgICAgICAgKFtbZW5lbXldLCBnYW1lU3RhdGVdKSA9PiBlbmVteS5pc0luQm91bmRzKCkgJiYgWydwbGF5JywgJ2VuZCddLmluY2x1ZGVzKGdhbWVTdGF0ZSlcclxuICAgICAgKSxcclxuICAgICAgZmluYWxpemVXaXRoVmFsdWUoKFtbZW5lbXldXSkgPT4gZW5lbXkuZGVzdHJveVBhd24oKSlcclxuICAgIClcclxuICAgIC5zdWJzY3JpYmUoKFtbZW5lbXksIGRlbHRhVGltZV0sIGdhbWVTdGF0ZV0pID0+IHtcclxuICAgICAgaWYgKGdhbWVTdGF0ZSA9PT0gJ3BsYXknKSB7XHJcbiAgICAgICAgZW5lbXkudXBkYXRlKGRlbHRhVGltZSlcclxuICAgICAgfVxyXG4gICAgICBpZiAocGxheWVyLmlzQ29sbGlkaW5nV2l0aEVuZW15KGVuZW15KSAmJiBnYW1lU3RhdGUgIT09ICdlbmQnKSB7XHJcbiAgICAgICAgZ2FtZVN0YXRlJC5uZXh0KCdlbmQnKVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghZW5lbXkuaXNJbkJvdW5kcygpKSB7XHJcbiAgICAgICAgc2NvcmUuaW5jcmVtZW50KClcclxuICAgICAgICBzY29yZS51cGRhdGUoKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG59XHJcbiIsImltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgRU1QVFksIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJ1xyXG5pbXBvcnQgeyBtZXJnZVdpdGgsIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJ1xyXG5cclxuZXhwb3J0IHR5cGUgR2FtZVN0YXRlID0gJ3N0YXJ0JyB8ICdwbGF5JyB8ICdlbmQnXHJcbmV4cG9ydCBjb25zdCBnYW1lU3RhdGUkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxHYW1lU3RhdGU+KCdzdGFydCcpXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2FtZVN0YXRlU3dpdGNoKHtcclxuICBvblN0YXJ0ID0gW0VNUFRZXSxcclxuICBvblBsYXkgPSBbRU1QVFldLFxyXG4gIG9uRW5kID0gW0VNUFRZXSxcclxufToge1xyXG4gIG9uU3RhcnQ/OiBhbnlbXVxyXG4gIG9uUGxheT86IGFueVtdXHJcbiAgb25FbmQ/OiBhbnlbXVxyXG59KSB7XHJcbiAgcmV0dXJuIGdhbWVTdGF0ZSQucGlwZShcclxuICAgIHN3aXRjaE1hcCgoZ2FtZVN0YXRlKSA9PiB7XHJcbiAgICAgIGlmIChnYW1lU3RhdGUgPT09ICdzdGFydCcpIHJldHVybiBtZXJnZUZyb21BcnJheShvblN0YXJ0KVxyXG4gICAgICBlbHNlIGlmIChnYW1lU3RhdGUgPT09ICdwbGF5JykgcmV0dXJuIG1lcmdlRnJvbUFycmF5KG9uUGxheSlcclxuICAgICAgZWxzZSBpZiAoZ2FtZVN0YXRlID09PSAnZW5kJykgcmV0dXJuIG1lcmdlRnJvbUFycmF5KG9uRW5kKVxyXG4gICAgICBlbHNlIEVNUFRZXHJcbiAgICB9KVxyXG4gIClcclxufVxyXG5cclxuZnVuY3Rpb24gbWVyZ2VGcm9tQXJyYXkob2JzZXJ2YWJsZXM6IGFueVtdKSB7XHJcbiAgaWYgKG9ic2VydmFibGVzLmxlbmd0aCA8IDIpIHtcclxuICAgIHJldHVybiBvYnNlcnZhYmxlc1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gb2JzZXJ2YWJsZXNbMF0ucGlwZShtZXJnZVdpdGgoLi4ub2JzZXJ2YWJsZXMuZmlsdGVyKChfLCBpKSA9PiBpID4gMCkpKVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycydcclxuaW1wb3J0IFBsYXllciBmcm9tICcuLi9lbnRpdGllcy9QbGF5ZXInXHJcbmltcG9ydCB7IGRlbHRhVGltZSQgfSBmcm9tICcuL2RlbHRhVGltZSdcclxuXHJcbmV4cG9ydCBjb25zdCBwbGF5ZXJVcGRhdGUgPSAocGxheWVyOiBQbGF5ZXIpID0+XHJcbiAgZGVsdGFUaW1lJC5waXBlKHRhcCgoZGVsdGFUaW1lKSA9PiBwbGF5ZXIudXBkYXRlKGRlbHRhVGltZSkpKVxyXG4iLCJpbXBvcnQgeyBFTVBUWSwgZnJvbUV2ZW50LCBvZiB9IGZyb20gJ3J4anMnXHJcbmltcG9ydCB7IGZpbHRlciwgbWVyZ2VNYXAsIHN3aXRjaE1hcCwgdGFwLCB3aXRoTGF0ZXN0RnJvbSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJ1xyXG5pbXBvcnQgKiBhcyBUd28gZnJvbSAndHdvanMtdHMnXHJcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi4vZW50aXRpZXMvUGxheWVyJ1xyXG5pbXBvcnQgeyBHYW1lU3RhdGUsIGdhbWVTdGF0ZSQgfSBmcm9tICcuL2dhbWVTdGF0ZSdcclxuXHJcbmV4cG9ydCBjb25zdCBwbGF5ZXJNb3ZlbWVudCA9IChwbGF5ZXI6IFBsYXllcikgPT4ge1xyXG4gIHJldHVybiBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpLnBpcGUoXHJcbiAgICBtZXJnZU1hcCgoZXZlbnQpID0+IHtcclxuICAgICAgcmV0dXJuIG9mKGV2ZW50KS5waXBlKFxyXG4gICAgICAgIHRhcCgoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgIGNvbnN0IG5ld0dvYWwgPSBuZXcgVHdvLlZlY3RvcihldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKVxyXG4gICAgICAgICAgcGxheWVyLnNldEdvYWwobmV3R29hbClcclxuICAgICAgICB9KVxyXG4gICAgICApXHJcbiAgICB9KVxyXG4gIClcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG9uU3RhcnQgPSAocGxheWVyOiBQbGF5ZXIpID0+IHtcclxuICByZXR1cm4gcGxheWVyTW92ZW1lbnQocGxheWVyKS5waXBlKHRhcCgoKSA9PiBnYW1lU3RhdGUkLm5leHQoJ3BsYXknKSkpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzdGFydEdhbWUgPSAocGxheWVyOiBQbGF5ZXIpID0+IHtcclxuICByZXR1cm4gZnJvbUV2ZW50KGRvY3VtZW50LCAna2V5ZG93bicpLnBpcGUoXHJcbiAgICBmaWx0ZXIoKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiBldmVudC5rZXkgPT09ICcgJyksXHJcbiAgICB0YXAoKCkgPT4ge1xyXG4gICAgICBnYW1lU3RhdGUkLm5leHQoJ3N0YXJ0JylcclxuICAgICAgcGxheWVyLnJlc2V0KClcclxuICAgIH0pXHJcbiAgKVxyXG59XHJcbiIsImltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgRU1QVFksIGZyb21FdmVudCwgb2YgfSBmcm9tICdyeGpzJ1xyXG5pbXBvcnQgeyBzd2l0Y2hNYXAsIG1lcmdlV2l0aCwgd2l0aExhdGVzdEZyb20sIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJ1xyXG5pbXBvcnQgeyBTY29yZSB9IGZyb20gJy4uL2VudGl0aWVzL1Njb3JlJ1xyXG5pbXBvcnQgeyBHYW1lU3RhdGUsIGdhbWVTdGF0ZSQgfSBmcm9tICcuL2dhbWVTdGF0ZSdcclxuaW1wb3J0IHsgVGl0bGUgfSBmcm9tICcuLi9lbnRpdGllcy9UaXRsZSdcclxuXHJcbmV4cG9ydCBjb25zdCBJbnRlcmZhY2UgPSAoc2NvcmU6IFNjb3JlLCB0aXRsZTogVGl0bGUsIHN1YnRpdGxlOiBUaXRsZSkgPT4ge1xyXG4gIGNvbnN0IGludGVyZmFjZSQgPSBvZihzY29yZSkucGlwZShcclxuICAgIHdpdGhMYXRlc3RGcm9tKG9mKHRpdGxlKSwgb2Yoc3VidGl0bGUpKSxcclxuICAgIHRhcCgoW3Njb3JlLCB0aXRsZSwgc3VidGl0bGVdKSA9PiB7XHJcbiAgICAgIHNjb3JlLnVwZGF0ZSgpXHJcbiAgICAgIHRpdGxlLmNlbnRlcigpXHJcbiAgICAgIHN1YnRpdGxlLmNlbnRlcigpXHJcbiAgICB9KVxyXG4gIClcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG9uU3RhcnQkOiBpbnRlcmZhY2UkLnBpcGUoXHJcbiAgICAgIHRhcCgoW3Njb3JlLCB0aXRsZSwgc3VidGl0bGVdKSA9PiB7XHJcbiAgICAgICAgc2NvcmUuc2NvcmUgPSAwXHJcbiAgICAgICAgc2NvcmUuc2NvcmVUZXh0LnZpc2libGUgPSBmYWxzZVxyXG4gICAgICAgIHNjb3JlLnVwZGF0ZSgpXHJcblxyXG4gICAgICAgIHRpdGxlLnRleHQudmlzaWJsZSA9IHRydWVcclxuICAgICAgICB0aXRsZS50ZXh0LnZhbHVlID0gJ0NsaWNrIGFueXdoZXJlIHRvIHN0YXJ0J1xyXG5cclxuICAgICAgICBzdWJ0aXRsZS50ZXh0LnZpc2libGUgPSB0cnVlXHJcbiAgICAgICAgc3VidGl0bGUudGV4dC52YWx1ZSA9ICdBdm9pZCBhenVyZSBiYWxscydcclxuICAgICAgfSlcclxuICAgICksXHJcbiAgICBvblBsYXkkOiBpbnRlcmZhY2UkLnBpcGUoXHJcbiAgICAgIHRhcCgoW3Njb3JlLCB0aXRsZSwgc3VidGl0bGVdKSA9PiB7XHJcbiAgICAgICAgc2NvcmUuc2NvcmVUZXh0LnZpc2libGUgPSB0cnVlXHJcblxyXG4gICAgICAgIHRpdGxlLnRleHQudmlzaWJsZSA9IGZhbHNlXHJcbiAgICAgICAgc3VidGl0bGUudGV4dC52aXNpYmxlID0gZmFsc2VcclxuICAgICAgfSlcclxuICAgICksXHJcbiAgICBvbkVuZCQ6IGludGVyZmFjZSQucGlwZShcclxuICAgICAgdGFwKChbc2NvcmUsIHRpdGxlLCBzdWJ0aXRsZV0pID0+IHtcclxuICAgICAgICBzY29yZS5zY29yZVRleHQudmlzaWJsZSA9IGZhbHNlXHJcblxyXG4gICAgICAgIHRpdGxlLnRleHQudmlzaWJsZSA9IHRydWVcclxuICAgICAgICB0aXRsZS50ZXh0LnZhbHVlID0gYFlvdSBtYW5nZWQgdG8gb3V0bGl2ZSAke3Njb3JlLnNjb3JlfSBtZW5hY2luZyBhenVyZSBiYWxsc2BcclxuXHJcbiAgICAgICAgc3VidGl0bGUudGV4dC52aXNpYmxlID0gdHJ1ZVxyXG4gICAgICAgIHN1YnRpdGxlLnRleHQudmFsdWUgPSAnUHJlc3Mgc3BhY2UgdG8gcGxheSBhZ2FpbidcclxuICAgICAgfSlcclxuICAgICksXHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGRlZmVyLCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcydcclxuaW1wb3J0IHsgZmluYWxpemUsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJhbmRvbUludEluUmFuZ2UobWluOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgbWluID0gTWF0aC5jZWlsKG1pbilcclxuICBtYXggPSBNYXRoLmZsb29yKG1heClcclxuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pXHJcbn1cclxuXHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9SZWFjdGl2ZVgvcnhqcy9pc3N1ZXMvNDgwMyNpc3N1ZWNvbW1lbnQtNDk2NzExMzM1XHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5hbGl6ZVdpdGhWYWx1ZTxUPihjYWxsYmFjazogKHZhbHVlOiBUKSA9PiB2b2lkKSB7XHJcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+XHJcbiAgICBkZWZlcigoKSA9PiB7XHJcbiAgICAgIGxldCBsYXN0VmFsdWU6IFRcclxuICAgICAgcmV0dXJuIHNvdXJjZS5waXBlKFxyXG4gICAgICAgIHRhcCgodmFsdWUpID0+IChsYXN0VmFsdWUgPSB2YWx1ZSkpLFxyXG4gICAgICAgIGZpbmFsaXplKCgpID0+IGNhbGxiYWNrKGxhc3RWYWx1ZSkpXHJcbiAgICAgIClcclxuICAgIH0pXHJcbn1cclxuIiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20pIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGZyb20ubGVuZ3RoLCBqID0gdG8ubGVuZ3RoOyBpIDwgaWw7IGkrKywgaisrKVxyXG4gICAgICAgIHRvW2pdID0gZnJvbVtpXTtcclxuICAgIHJldHVybiB0bztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwidmFyICRqc2NvbXA9JGpzY29tcHx8e307JGpzY29tcC5zY29wZT17fTskanNjb21wLkFTU1VNRV9FUzU9ITE7JGpzY29tcC5BU1NVTUVfTk9fTkFUSVZFX01BUD0hMTskanNjb21wLkFTU1VNRV9OT19OQVRJVkVfU0VUPSExOyRqc2NvbXAuZGVmaW5lUHJvcGVydHk9JGpzY29tcC5BU1NVTUVfRVM1fHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBPYmplY3QuZGVmaW5lUHJvcGVydGllcz9PYmplY3QuZGVmaW5lUHJvcGVydHk6ZnVuY3Rpb24oYyxrLG0pe2MhPUFycmF5LnByb3RvdHlwZSYmYyE9T2JqZWN0LnByb3RvdHlwZSYmKGNba109bS52YWx1ZSl9OyRqc2NvbXAuZ2V0R2xvYmFsPWZ1bmN0aW9uKGMpe3JldHVyblwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJndpbmRvdz09PWM/YzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsJiZudWxsIT1nbG9iYWw/Z2xvYmFsOmN9OyRqc2NvbXAuZ2xvYmFsPSRqc2NvbXAuZ2V0R2xvYmFsKHRoaXMpOyRqc2NvbXAuU1lNQk9MX1BSRUZJWD1cImpzY29tcF9zeW1ib2xfXCI7XG4kanNjb21wLmluaXRTeW1ib2w9ZnVuY3Rpb24oKXskanNjb21wLmluaXRTeW1ib2w9ZnVuY3Rpb24oKXt9OyRqc2NvbXAuZ2xvYmFsLlN5bWJvbHx8KCRqc2NvbXAuZ2xvYmFsLlN5bWJvbD0kanNjb21wLlN5bWJvbCl9OyRqc2NvbXAuc3ltYm9sQ291bnRlcl89MDskanNjb21wLlN5bWJvbD1mdW5jdGlvbihjKXtyZXR1cm4gJGpzY29tcC5TWU1CT0xfUFJFRklYKyhjfHxcIlwiKSskanNjb21wLnN5bWJvbENvdW50ZXJfKyt9O1xuJGpzY29tcC5pbml0U3ltYm9sSXRlcmF0b3I9ZnVuY3Rpb24oKXskanNjb21wLmluaXRTeW1ib2woKTt2YXIgYz0kanNjb21wLmdsb2JhbC5TeW1ib2wuaXRlcmF0b3I7Y3x8KGM9JGpzY29tcC5nbG9iYWwuU3ltYm9sLml0ZXJhdG9yPSRqc2NvbXAuZ2xvYmFsLlN5bWJvbChcIml0ZXJhdG9yXCIpKTtcImZ1bmN0aW9uXCIhPXR5cGVvZiBBcnJheS5wcm90b3R5cGVbY10mJiRqc2NvbXAuZGVmaW5lUHJvcGVydHkoQXJyYXkucHJvdG90eXBlLGMse2NvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpmdW5jdGlvbigpe3JldHVybiAkanNjb21wLmFycmF5SXRlcmF0b3IodGhpcyl9fSk7JGpzY29tcC5pbml0U3ltYm9sSXRlcmF0b3I9ZnVuY3Rpb24oKXt9fTskanNjb21wLmFycmF5SXRlcmF0b3I9ZnVuY3Rpb24oYyl7dmFyIGs9MDtyZXR1cm4gJGpzY29tcC5pdGVyYXRvclByb3RvdHlwZShmdW5jdGlvbigpe3JldHVybiBrPGMubGVuZ3RoP3tkb25lOiExLHZhbHVlOmNbaysrXX06e2RvbmU6ITB9fSl9O1xuJGpzY29tcC5pdGVyYXRvclByb3RvdHlwZT1mdW5jdGlvbihjKXskanNjb21wLmluaXRTeW1ib2xJdGVyYXRvcigpO2M9e25leHQ6Y307Y1skanNjb21wLmdsb2JhbC5TeW1ib2wuaXRlcmF0b3JdPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9O3JldHVybiBjfTskanNjb21wLml0ZXJhdG9yRnJvbUFycmF5PWZ1bmN0aW9uKGMsayl7JGpzY29tcC5pbml0U3ltYm9sSXRlcmF0b3IoKTtjIGluc3RhbmNlb2YgU3RyaW5nJiYoYys9XCJcIik7dmFyIG09MCxsPXtuZXh0OmZ1bmN0aW9uKCl7aWYobTxjLmxlbmd0aCl7dmFyIGg9bSsrO3JldHVybnt2YWx1ZTprKGgsY1toXSksZG9uZTohMX19bC5uZXh0PWZ1bmN0aW9uKCl7cmV0dXJue2RvbmU6ITAsdmFsdWU6dm9pZCAwfX07cmV0dXJuIGwubmV4dCgpfX07bFtTeW1ib2wuaXRlcmF0b3JdPWZ1bmN0aW9uKCl7cmV0dXJuIGx9O3JldHVybiBsfTtcbiRqc2NvbXAucG9seWZpbGw9ZnVuY3Rpb24oYyxrLG0sbCl7aWYoayl7bT0kanNjb21wLmdsb2JhbDtjPWMuc3BsaXQoXCIuXCIpO2ZvcihsPTA7bDxjLmxlbmd0aC0xO2wrKyl7dmFyIGg9Y1tsXTtoIGluIG18fChtW2hdPXt9KTttPW1baF19Yz1jW2MubGVuZ3RoLTFdO2w9bVtjXTtrPWsobCk7ayE9bCYmbnVsbCE9ayYmJGpzY29tcC5kZWZpbmVQcm9wZXJ0eShtLGMse2NvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTprfSl9fTskanNjb21wLnBvbHlmaWxsKFwiQXJyYXkucHJvdG90eXBlLmtleXNcIixmdW5jdGlvbihjKXtyZXR1cm4gYz9jOmZ1bmN0aW9uKCl7cmV0dXJuICRqc2NvbXAuaXRlcmF0b3JGcm9tQXJyYXkodGhpcyxmdW5jdGlvbihjKXtyZXR1cm4gY30pfX0sXCJlczYtaW1wbFwiLFwiZXMzXCIpO1xuJGpzY29tcC5wb2x5ZmlsbChcIkFycmF5LnByb3RvdHlwZS52YWx1ZXNcIixmdW5jdGlvbihjKXtyZXR1cm4gYz9jOmZ1bmN0aW9uKCl7cmV0dXJuICRqc2NvbXAuaXRlcmF0b3JGcm9tQXJyYXkodGhpcyxmdW5jdGlvbihjLG0pe3JldHVybiBtfSl9fSxcImVzNlwiLFwiZXMzXCIpOyRqc2NvbXAucG9seWZpbGwoXCJBcnJheS5wcm90b3R5cGUuZmlsbFwiLGZ1bmN0aW9uKGMpe3JldHVybiBjP2M6ZnVuY3Rpb24oYyxtLGwpe3ZhciBoPXRoaXMubGVuZ3RofHwwOzA+bSYmKG09TWF0aC5tYXgoMCxoK20pKTtpZihudWxsPT1sfHxsPmgpbD1oO2w9TnVtYmVyKGwpOzA+bCYmKGw9TWF0aC5tYXgoMCxoK2wpKTtmb3IobT1OdW1iZXIobXx8MCk7bTxsO20rKyl0aGlzW21dPWM7cmV0dXJuIHRoaXN9fSxcImVzNi1pbXBsXCIsXCJlczNcIik7XG50aGlzLlR3bz1mdW5jdGlvbihjKXtmdW5jdGlvbiBrKCl7dmFyIGE9ZG9jdW1lbnQuYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxjPXRoaXMud2lkdGg9YS53aWR0aCxhPXRoaXMuaGVpZ2h0PWEuaGVpZ2h0O3RoaXMucmVuZGVyZXIuc2V0U2l6ZShjLGEsdGhpcy5yYXRpbyk7dGhpcy50cmlnZ2VyKHAuRXZlbnRzLnJlc2l6ZSxjLGEpfWZ1bmN0aW9uIG0oKXtMKG0pO2Zvcih2YXIgYT0wO2E8cC5JbnN0YW5jZXMubGVuZ3RoO2ErKyl7dmFyIGM9cC5JbnN0YW5jZXNbYV07Yy5wbGF5aW5nJiZjLnVwZGF0ZSgpfX12YXIgbD1cInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P3dpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDpudWxsLGg9T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxkPXtfaW5kZXhBbW91bnQ6MCxuYXR1cmFsOntzbGljZTpBcnJheS5wcm90b3R5cGUuc2xpY2UsaW5kZXhPZjpBcnJheS5wcm90b3R5cGUuaW5kZXhPZixrZXlzOk9iamVjdC5rZXlzLFxuYmluZDpGdW5jdGlvbi5wcm90b3R5cGUuYmluZCxjcmVhdGU6T2JqZWN0LmNyZWF0ZX0saWRlbnRpdHk6ZnVuY3Rpb24oYSl7cmV0dXJuIGF9LGlzQXJndW1lbnRzOmZ1bmN0aW9uKGEpe3JldHVyblwiW29iamVjdCBBcmd1bWVudHNdXCI9PT1oLmNhbGwoYSl9LGlzRnVuY3Rpb246ZnVuY3Rpb24oYSl7cmV0dXJuXCJbb2JqZWN0IEZ1bmN0aW9uXVwiPT09aC5jYWxsKGEpfSxpc1N0cmluZzpmdW5jdGlvbihhKXtyZXR1cm5cIltvYmplY3QgU3RyaW5nXVwiPT09aC5jYWxsKGEpfSxpc051bWJlcjpmdW5jdGlvbihhKXtyZXR1cm5cIltvYmplY3QgTnVtYmVyXVwiPT09aC5jYWxsKGEpfSxpc0RhdGU6ZnVuY3Rpb24oYSl7cmV0dXJuXCJbb2JqZWN0IERhdGVdXCI9PT1oLmNhbGwoYSl9LGlzUmVnRXhwOmZ1bmN0aW9uKGEpe3JldHVyblwiW29iamVjdCBSZWdFeHBdXCI9PT1oLmNhbGwoYSl9LGlzRXJyb3I6ZnVuY3Rpb24oYSl7cmV0dXJuXCJbb2JqZWN0IEVycm9yXVwiPT09aC5jYWxsKGEpfSxpc0Zpbml0ZTpmdW5jdGlvbihhKXtyZXR1cm4gaXNGaW5pdGUoYSkmJlxuIWlzTmFOKHBhcnNlRmxvYXQoYSkpfSxpc05hTjpmdW5jdGlvbihhKXtyZXR1cm4gZC5pc051bWJlcihhKSYmYSE9PSthfSxpc0Jvb2xlYW46ZnVuY3Rpb24oYSl7cmV0dXJuITA9PT1hfHwhMT09PWF8fFwiW29iamVjdCBCb29sZWFuXVwiPT09aC5jYWxsKGEpfSxpc051bGw6ZnVuY3Rpb24oYSl7cmV0dXJuIG51bGw9PT1hfSxpc1VuZGVmaW5lZDpmdW5jdGlvbihhKXtyZXR1cm4gdm9pZCAwPT09YX0saXNFbXB0eTpmdW5jdGlvbihhKXtyZXR1cm4gbnVsbD09YT8hMDpxJiYoZC5pc0FycmF5KGEpfHxkLmlzU3RyaW5nKGEpfHxkLmlzQXJndW1lbnRzKGEpKT8wPT09YS5sZW5ndGg6MD09PWQua2V5cyhhKS5sZW5ndGh9LGlzRWxlbWVudDpmdW5jdGlvbihhKXtyZXR1cm4hKCFhfHwxIT09YS5ub2RlVHlwZSl9LGlzQXJyYXk6QXJyYXkuaXNBcnJheXx8ZnVuY3Rpb24oYSl7cmV0dXJuXCJbb2JqZWN0IEFycmF5XVwiPT09aC5jYWxsKGEpfSxpc09iamVjdDpmdW5jdGlvbihhKXt2YXIgYz10eXBlb2YgYTtcbnJldHVyblwiZnVuY3Rpb25cIj09PWN8fFwib2JqZWN0XCI9PT1jJiYhIWF9LHRvQXJyYXk6ZnVuY3Rpb24oYSl7cmV0dXJuIGE/ZC5pc0FycmF5KGEpP3guY2FsbChhKTpxKGEpP2QubWFwKGEsZC5pZGVudGl0eSk6ZC52YWx1ZXMoYSk6W119LHJhbmdlOmZ1bmN0aW9uKGEsYyxmKXtudWxsPT1jJiYoYz1hfHwwLGE9MCk7Zj1mfHwxO2M9TWF0aC5tYXgoTWF0aC5jZWlsKChjLWEpL2YpLDApO2Zvcih2YXIgZT1BcnJheShjKSxkPTA7ZDxjO2QrKyxhKz1mKWVbZF09YTtyZXR1cm4gZX0saW5kZXhPZjpmdW5jdGlvbihhLGMpe2lmKGQubmF0dXJhbC5pbmRleE9mKXJldHVybiBkLm5hdHVyYWwuaW5kZXhPZi5jYWxsKGEsYyk7Zm9yKHZhciBmPTA7ZjxhLmxlbmd0aDtmKyspaWYoYVtmXT09PWMpcmV0dXJuIGY7cmV0dXJuLTF9LGhhczpmdW5jdGlvbihhLGMpe3JldHVybiBudWxsIT1hJiZoYXNPd25Qcm9wZXJ0eS5jYWxsKGEsYyl9LGJpbmQ6ZnVuY3Rpb24oYSxjKXt2YXIgZj1kLm5hdHVyYWwuYmluZDtcbmlmKGYmJmEuYmluZD09PWYpcmV0dXJuIGYuYXBwbHkoYSx4LmNhbGwoYXJndW1lbnRzLDEpKTt2YXIgZT14LmNhbGwoYXJndW1lbnRzLDIpO3JldHVybiBmdW5jdGlvbigpe2EuYXBwbHkoYyxlKX19LGV4dGVuZDpmdW5jdGlvbihhKXtmb3IodmFyIGM9eC5jYWxsKGFyZ3VtZW50cywxKSxmPTA7ZjxjLmxlbmd0aDtmKyspe3ZhciBlPWNbZl0sZDtmb3IoZCBpbiBlKWFbZF09ZVtkXX1yZXR1cm4gYX0sZGVmYXVsdHM6ZnVuY3Rpb24oYSl7Zm9yKHZhciBjPXguY2FsbChhcmd1bWVudHMsMSksZj0wO2Y8Yy5sZW5ndGg7ZisrKXt2YXIgZT1jW2ZdLGQ7Zm9yKGQgaW4gZSl2b2lkIDA9PT1hW2RdJiYoYVtkXT1lW2RdKX1yZXR1cm4gYX0sa2V5czpmdW5jdGlvbihhKXtpZighZC5pc09iamVjdChhKSlyZXR1cm5bXTtpZihkLm5hdHVyYWwua2V5cylyZXR1cm4gZC5uYXR1cmFsLmtleXMoYSk7dmFyIGM9W10sZjtmb3IoZiBpbiBhKWQuaGFzKGEsZikmJmMucHVzaChmKTtyZXR1cm4gY30sdmFsdWVzOmZ1bmN0aW9uKGEpe2Zvcih2YXIgYz1cbmQua2V5cyhhKSxmPVtdLGU9MDtlPGMubGVuZ3RoO2UrKylmLnB1c2goYVtjW2VdXSk7cmV0dXJuIGZ9LGVhY2g6ZnVuY3Rpb24oYSxjLGYpe2Y9Znx8dGhpcztmb3IodmFyIGU9IXEoYSkmJmQua2V5cyhhKSxnPShlfHxhKS5sZW5ndGgseT0wO3k8Zzt5Kyspe3ZhciBuPWU/ZVt5XTp5O2MuY2FsbChmLGFbbl0sbixhKX1yZXR1cm4gYX0sbWFwOmZ1bmN0aW9uKGEsYyxmKXtmPWZ8fHRoaXM7Zm9yKHZhciBlPSFxKGEpJiZkLmtleXMoYSksZz0oZXx8YSkubGVuZ3RoLG49W10seT0wO3k8Zzt5Kyspe3ZhciB0PWU/ZVt5XTp5O25beV09Yy5jYWxsKGYsYVt0XSx0LGEpfXJldHVybiBufSxvbmNlOmZ1bmN0aW9uKGEpe3ZhciBjPSExO3JldHVybiBmdW5jdGlvbigpe2lmKGMpcmV0dXJuIGE7Yz0hMDtyZXR1cm4gYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fSxhZnRlcjpmdW5jdGlvbihhLGMpe3JldHVybiBmdW5jdGlvbigpe2Zvcig7MT4tLWE7KXJldHVybiBjLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19LFxudW5pcXVlSWQ6ZnVuY3Rpb24oYSl7dmFyIGM9KytkLl9pbmRleEFtb3VudCtcIlwiO3JldHVybiBhP2ErYzpjfX0sZT1NYXRoLnNpbixhPU1hdGguY29zLGc9TWF0aC5hdGFuMixuPU1hdGguc3FydCxmPU1hdGguUEksdD1mLzIsdj1NYXRoLnBvdyxCPU1hdGgubWluLHo9TWF0aC5tYXgsQT0wLHg9ZC5uYXR1cmFsLnNsaWNlLHU9bC5wZXJmb3JtYW5jZSYmbC5wZXJmb3JtYW5jZS5ub3c/bC5wZXJmb3JtYW5jZTpEYXRlLHI9TWF0aC5wb3coMiw1MyktMSxxPWZ1bmN0aW9uKGEpe2E9bnVsbD09YT92b2lkIDA6YS5sZW5ndGg7cmV0dXJuXCJudW1iZXJcIj09dHlwZW9mIGEmJjA8PWEmJmE8PXJ9LHc9e3RlbXA6bC5kb2N1bWVudD9sLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik6e30saGFzRXZlbnRMaXN0ZW5lcnM6ZC5pc0Z1bmN0aW9uKGwuYWRkRXZlbnRMaXN0ZW5lciksYmluZDpmdW5jdGlvbihhLGMsZixlKXt0aGlzLmhhc0V2ZW50TGlzdGVuZXJzP2EuYWRkRXZlbnRMaXN0ZW5lcihjLFxuZiwhIWUpOmEuYXR0YWNoRXZlbnQoXCJvblwiK2MsZik7cmV0dXJuIHd9LHVuYmluZDpmdW5jdGlvbihhLGMsZixlKXt3Lmhhc0V2ZW50TGlzdGVuZXJzP2EucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoYyxmLCEhZSk6YS5kZXRhY2hFdmVudChcIm9uXCIrYyxmKTtyZXR1cm4gd30sZ2V0UmVxdWVzdEFuaW1hdGlvbkZyYW1lOmZ1bmN0aW9uKCl7dmFyIGE9MCxjPVtcIm1zXCIsXCJtb3pcIixcIndlYmtpdFwiLFwib1wiXSxmPWwucmVxdWVzdEFuaW1hdGlvbkZyYW1lO2lmKCFmKXtmb3IodmFyIGU9MDtlPGMubGVuZ3RoO2UrKylmPWxbY1tlXStcIlJlcXVlc3RBbmltYXRpb25GcmFtZVwiXXx8ZjtmPWZ8fGZ1bmN0aW9uKGMsZil7dmFyIGU9KG5ldyBEYXRlKS5nZXRUaW1lKCksZD1NYXRoLm1heCgwLDE2LShlLWEpKTtmPWwuc2V0VGltZW91dChmdW5jdGlvbigpe2MoZStkKX0sZCk7YT1lK2Q7cmV0dXJuIGZ9fWYuaW5pdD1kLm9uY2UobSk7cmV0dXJuIGZ9fSxwPWwuVHdvPWZ1bmN0aW9uKGEpe2E9ZC5kZWZhdWx0cyhhfHxcbnt9LHtmdWxsc2NyZWVuOiExLHdpZHRoOjY0MCxoZWlnaHQ6NDgwLHR5cGU6cC5UeXBlcy5zdmcsYXV0b3N0YXJ0OiExfSk7ZC5lYWNoKGEsZnVuY3Rpb24oYSxjKXtcImZ1bGxzY3JlZW5cIiE9PWMmJlwiYXV0b3N0YXJ0XCIhPT1jJiYodGhpc1tjXT1hKX0sdGhpcyk7aWYoZC5pc0VsZW1lbnQoYS5kb21FbGVtZW50KSl7dmFyIGM9YS5kb21FbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTsvXihDYW52YXNSZW5kZXJlci1jYW52YXN8V2ViR0xSZW5kZXJlci1jYW52YXN8U1ZHUmVuZGVyZXItc3ZnKSQvLnRlc3QodGhpcy50eXBlK1wiLVwiK2MpfHwodGhpcy50eXBlPXAuVHlwZXNbY10pfXRoaXMucmVuZGVyZXI9bmV3IHBbdGhpcy50eXBlXSh0aGlzKTtwLlV0aWxzLnNldFBsYXlpbmcuY2FsbCh0aGlzLGEuYXV0b3N0YXJ0KTt0aGlzLmZyYW1lQ291bnQ9MDthLmZ1bGxzY3JlZW4/KGE9ZC5iaW5kKGssdGhpcyksZC5leHRlbmQoZG9jdW1lbnQuYm9keS5zdHlsZSx7b3ZlcmZsb3c6XCJoaWRkZW5cIixcbm1hcmdpbjowLHBhZGRpbmc6MCx0b3A6MCxsZWZ0OjAscmlnaHQ6MCxib3R0b206MCxwb3NpdGlvbjpcImZpeGVkXCJ9KSxkLmV4dGVuZCh0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUse2Rpc3BsYXk6XCJibG9ja1wiLHRvcDowLGxlZnQ6MCxyaWdodDowLGJvdHRvbTowLHBvc2l0aW9uOlwiZml4ZWRcIn0pLHcuYmluZChsLFwicmVzaXplXCIsYSksYSgpKTpkLmlzRWxlbWVudChhLmRvbUVsZW1lbnQpfHwodGhpcy5yZW5kZXJlci5zZXRTaXplKGEud2lkdGgsYS5oZWlnaHQsdGhpcy5yYXRpbyksdGhpcy53aWR0aD1hLndpZHRoLHRoaXMuaGVpZ2h0PWEuaGVpZ2h0KTt0aGlzLnNjZW5lPXRoaXMucmVuZGVyZXIuc2NlbmU7cC5JbnN0YW5jZXMucHVzaCh0aGlzKTtMLmluaXQoKX07ZC5leHRlbmQocCx7cm9vdDpsLEFycmF5OmwuRmxvYXQzMkFycmF5fHxBcnJheSxUeXBlczp7d2ViZ2w6XCJXZWJHTFJlbmRlcmVyXCIsc3ZnOlwiU1ZHUmVuZGVyZXJcIixjYW52YXM6XCJDYW52YXNSZW5kZXJlclwifSxcblZlcnNpb246XCJ2MC43LjBcIixJZGVudGlmaWVyOlwidHdvX1wiLFByb3BlcnRpZXM6e2hpZXJhcmNoeTpcImhpZXJhcmNoeVwiLGRlbW90aW9uOlwiZGVtb3Rpb25cIn0sRXZlbnRzOntwbGF5OlwicGxheVwiLHBhdXNlOlwicGF1c2VcIix1cGRhdGU6XCJ1cGRhdGVcIixyZW5kZXI6XCJyZW5kZXJcIixyZXNpemU6XCJyZXNpemVcIixjaGFuZ2U6XCJjaGFuZ2VcIixyZW1vdmU6XCJyZW1vdmVcIixpbnNlcnQ6XCJpbnNlcnRcIixvcmRlcjpcIm9yZGVyXCIsbG9hZDpcImxvYWRcIn0sQ29tbWFuZHM6e21vdmU6XCJNXCIsbGluZTpcIkxcIixjdXJ2ZTpcIkNcIixjbG9zZTpcIlpcIn0sUmVzb2x1dGlvbjo4LEluc3RhbmNlczpbXSxub0NvbmZsaWN0OmZ1bmN0aW9uKCl7bC5Ud289YztyZXR1cm4gdGhpc30sdW5pcXVlSWQ6ZnVuY3Rpb24oKXt2YXIgYT1BO0ErKztyZXR1cm4gYX0sVXRpbHM6ZC5leHRlbmQoZCx7cGVyZm9ybWFuY2U6dSxkZWZpbmVQcm9wZXJ0eTpmdW5jdGlvbihhKXt2YXIgYz1cIl9cIithLGY9XCJfZmxhZ1wiK2EuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrXG5hLnNsaWNlKDEpO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLGEse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXNbY119LHNldDpmdW5jdGlvbihhKXt0aGlzW2NdPWE7dGhpc1tmXT0hMH19KX0scmVsZWFzZTpmdW5jdGlvbihhKXtkLmlzT2JqZWN0KGEpJiYoZC5pc0Z1bmN0aW9uKGEudW5iaW5kKSYmYS51bmJpbmQoKSxhLnZlcnRpY2VzJiYoZC5pc0Z1bmN0aW9uKGEudmVydGljZXMudW5iaW5kKSYmYS52ZXJ0aWNlcy51bmJpbmQoKSxkLmVhY2goYS52ZXJ0aWNlcyxmdW5jdGlvbihhKXtkLmlzRnVuY3Rpb24oYS51bmJpbmQpJiZhLnVuYmluZCgpfSkpLGEuY2hpbGRyZW4mJmQuZWFjaChhLmNoaWxkcmVuLGZ1bmN0aW9uKGEpe3AuVXRpbHMucmVsZWFzZShhKX0pKX0seGhyOmZ1bmN0aW9uKGEsYyl7dmFyIGY9bmV3IFhNTEh0dHBSZXF1ZXN0O2Yub3BlbihcIkdFVFwiLGEpO2Yub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7ND09PWYucmVhZHlTdGF0ZSYmXG4yMDA9PT1mLnN0YXR1cyYmYyhmLnJlc3BvbnNlVGV4dCl9O2Yuc2VuZCgpO3JldHVybiBmfSxDdXJ2ZTp7Q29sbGluZWFyaXR5RXBzaWxvbjp2KDEwLC0zMCksUmVjdXJzaW9uTGltaXQ6MTYsQ3VzcExpbWl0OjAsVG9sZXJhbmNlOntkaXN0YW5jZTouMjUsYW5nbGU6MCxlcHNpbG9uOi4wMX0sYWJzY2lzc2FzOltbLjU3NzM1MDI2OTE4OTYyNTddLFswLC43NzQ1OTY2NjkyNDE0ODM0XSxbLjMzOTk4MTA0MzU4NDg1NjI2LC44NjExMzYzMTE1OTQwNTI2XSxbMCwuNTM4NDY5MzEwMTA1NjgzMSwuOTA2MTc5ODQ1OTM4NjY0XSxbLjIzODYxOTE4NjA4MzE5NjksLjY2MTIwOTM4NjQ2NjI2NDUsLjkzMjQ2OTUxNDIwMzE1Ml0sWzAsLjQwNTg0NTE1MTM3NzM5NzIsLjc0MTUzMTE4NTU5OTM5NDUsLjk0OTEwNzkxMjM0Mjc1ODVdLFsuMTgzNDM0NjQyNDk1NjQ5OCwuNTI1NTMyNDA5OTE2MzI5LC43OTY2NjY0Nzc0MTM2MjY3LC45NjAyODk4NTY0OTc1MzYzXSxbMCwuMzI0MjUzNDIzNDAzODA4OSxcbi42MTMzNzE0MzI3MDA1OTA0LC44MzYwMzExMDczMjY2MzU4LC45NjgxNjAyMzk1MDc2MjYxXSxbLjE0ODg3NDMzODk4MTYzMTIyLC40MzMzOTUzOTQxMjkyNDcyLC42Nzk0MDk1NjgyOTkwMjQ0LC44NjUwNjMzNjY2ODg5ODQ1LC45NzM5MDY1Mjg1MTcxNzE3XSxbMCwuMjY5NTQzMTU1OTUyMzQ0OTYsLjUxOTA5NjEyOTIwNjgxMTgsLjczMDE1MjAwNTU3NDA0OTQsLjg4NzA2MjU5OTc2ODA5NTMsLjk3ODIyODY1ODE0NjA1N10sWy4xMjUyMzM0MDg1MTE0Njg5LC4zNjc4MzE0OTg5OTgxODAyLC41ODczMTc5NTQyODY2MTc1LC43Njk5MDI2NzQxOTQzMDQ3LC45MDQxMTcyNTYzNzA0NzQ5LC45ODE1NjA2MzQyNDY3MTkyXSxbMCwuMjMwNDU4MzE1OTU1MTM0OCwuNDQ4NDkyNzUxMDM2NDQ2ODcsLjY0MjM0OTMzOTQ0MDM0MDIsLjgwMTU3ODA5MDczMzMwOTksLjkxNzU5ODM5OTIyMjk3NzksLjk4NDE4MzA1NDcxODU4ODFdLFsuMTA4MDU0OTQ4NzA3MzQzNjcsLjMxOTExMjM2ODkyNzg4OTc0LFxuLjUxNTI0ODYzNjM1ODE1NDEsLjY4NzI5MjkwNDgxMTY4NTUsLjgyNzIwMTMxNTA2OTc2NSwuOTI4NDM0ODgzNjYzNTczNSwuOTg2MjgzODA4Njk2ODEyM10sWzAsLjIwMTE5NDA5Mzk5NzQzNDUxLC4zOTQxNTEzNDcwNzc1NjM0LC41NzA5NzIxNzI2MDg1Mzg4LC43MjQ0MTc3MzEzNjAxNzAxLC44NDgyMDY1ODM0MTA0MjcyLC45MzcyNzMzOTI0MDA3MDYsLjk4Nzk5MjUxODAyMDQ4NTRdLFsuMDk1MDEyNTA5ODM3NjM3NDQsLjI4MTYwMzU1MDc3OTI1ODksLjQ1ODAxNjc3NzY1NzIyNzM3LC42MTc4NzYyNDQ0MDI2NDM4LC43NTU0MDQ0MDgzNTUwMDMsLjg2NTYzMTIwMjM4NzgzMTgsLjk0NDU3NTAyMzA3MzIzMjYsLjk4OTQwMDkzNDk5MTY0OTldXSx3ZWlnaHRzOltbMV0sWy44ODg4ODg4ODg4ODg4ODg4LC41NTU1NTU1NTU1NTU1NTU2XSxbLjY1MjE0NTE1NDg2MjU0NjEsLjM0Nzg1NDg0NTEzNzQ1Mzg1XSxbLjU2ODg4ODg4ODg4ODg4ODksLjQ3ODYyODY3MDQ5OTM2NjQ3LC4yMzY5MjY4ODUwNTYxODkwOF0sXG5bLjQ2NzkxMzkzNDU3MjY5MTA0LC4zNjA3NjE1NzMwNDgxMzg2LC4xNzEzMjQ0OTIzNzkxNzAzNl0sWy40MTc5NTkxODM2NzM0Njk0LC4zODE4MzAwNTA1MDUxMTg5LC4yNzk3MDUzOTE0ODkyNzY2NCwuMTI5NDg0OTY2MTY4ODY5N10sWy4zNjI2ODM3ODMzNzgzNjIsLjMxMzcwNjY0NTg3Nzg4NzI3LC4yMjIzODEwMzQ0NTMzNzQ0OCwuMTAxMjI4NTM2MjkwMzc2MjZdLFsuMzMwMjM5MzU1MDAxMjU5OCwuMzEyMzQ3MDc3MDQwMDAyODYsLjI2MDYxMDY5NjQwMjkzNTQ0LC4xODA2NDgxNjA2OTQ4NTc0LC4wODEyNzQzODgzNjE1NzQ0MV0sWy4yOTU1MjQyMjQ3MTQ3NTI4NywuMjY5MjY2NzE5MzA5OTk2MzUsLjIxOTA4NjM2MjUxNTk4MjA0LC4xNDk0NTEzNDkxNTA1ODA2LC4wNjY2NzEzNDQzMDg2ODgxNF0sWy4yNzI5MjUwODY3Nzc5MDA2LC4yNjI4MDQ1NDQ1MTAyNDY2NSwuMjMzMTkzNzY0NTkxOTkwNDgsLjE4NjI5MDIxMDkyNzczNDI2LC4xMjU1ODAzNjk0NjQ5MDQ2LC4wNTU2Njg1NjcxMTYxNzM2Nl0sXG5bLjI0OTE0NzA0NTgxMzQwMjc3LC4yMzM0OTI1MzY1MzgzNTQ4LC4yMDMxNjc0MjY3MjMwNjU5MiwuMTYwMDc4MzI4NTQzMzQ2MjIsLjEwNjkzOTMyNTk5NTMxODQzLC4wNDcxNzUzMzYzODY1MTE4M10sWy4yMzI1NTE1NTMyMzA4NzM5LC4yMjYyODMxODAyNjI4OTcyMywuMjA3ODE2MDQ3NTM2ODg4NSwuMTc4MTQ1OTgwNzYxOTQ1NzQsLjEzODg3MzUxMDIxOTc4NzI1LC4wOTIxMjE0OTk4Mzc3Mjg0NSwuMDQwNDg0MDA0NzY1MzE1ODhdLFsuMjE1MjYzODUzNDYzMTU3OCwuMjA1MTk4NDYzNzIxMjk1NiwuMTg1NTM4Mzk3NDc3OTM3ODIsLjE1NzIwMzE2NzE1ODE5MzU1LC4xMjE1MTg1NzA2ODc5MDMxOSwuMDgwMTU4MDg3MTU5NzYwMjEsLjAzNTExOTQ2MDMzMTc1MTg2XSxbLjIwMjU3ODI0MTkyNTU2MTMsLjE5ODQzMTQ4NTMyNzExMTU4LC4xODYxNjEwMDAwMTU1NjIyLC4xNjYyNjkyMDU4MTY5OTM5MiwuMTM5NTcwNjc3OTI2MTU0MzIsLjEwNzE1OTIyMDQ2NzE3MTk0LC4wNzAzNjYwNDc0ODgxMDgxMixcbi4wMzA3NTMyNDE5OTYxMTcyN10sWy4xODk0NTA2MTA0NTUwNjg1LC4xODI2MDM0MTUwNDQ5MjM1OCwuMTY5MTU2NTE5Mzk1MDAyNTQsLjE0OTU5NTk4ODgxNjU3Njc0LC4xMjQ2Mjg5NzEyNTU1MzM4OCwuMDk1MTU4NTExNjgyNDkyNzksLjA2MjI1MzUyMzkzODY0Nzg5NCwuMDI3MTUyNDU5NDExNzU0MDk2XV19LGRldmljZVBpeGVsUmF0aW86bC5kZXZpY2VQaXhlbFJhdGlvfHwxLGdldEJhY2tpbmdTdG9yZVJhdGlvOmZ1bmN0aW9uKGEpe3JldHVybiBhLndlYmtpdEJhY2tpbmdTdG9yZVBpeGVsUmF0aW98fGEubW96QmFja2luZ1N0b3JlUGl4ZWxSYXRpb3x8YS5tc0JhY2tpbmdTdG9yZVBpeGVsUmF0aW98fGEub0JhY2tpbmdTdG9yZVBpeGVsUmF0aW98fGEuYmFja2luZ1N0b3JlUGl4ZWxSYXRpb3x8MX0sZ2V0UmF0aW86ZnVuY3Rpb24oYSl7cmV0dXJuIHAuVXRpbHMuZGV2aWNlUGl4ZWxSYXRpby9PKGEpfSxzZXRQbGF5aW5nOmZ1bmN0aW9uKGEpe3RoaXMucGxheWluZz0hIWE7cmV0dXJuIHRoaXN9LFxuZ2V0Q29tcHV0ZWRNYXRyaXg6ZnVuY3Rpb24oYSxjKXtjPWMmJmMuaWRlbnRpdHkoKXx8bmV3IHAuTWF0cml4O2Zvcih2YXIgZj1bXTthJiZhLl9tYXRyaXg7KWYucHVzaChhLl9tYXRyaXgpLGE9YS5wYXJlbnQ7Zi5yZXZlcnNlKCk7ZC5lYWNoKGYsZnVuY3Rpb24oYSl7YT1hLmVsZW1lbnRzO2MubXVsdGlwbHkoYVswXSxhWzFdLGFbMl0sYVszXSxhWzRdLGFbNV0sYVs2XSxhWzddLGFbOF0sYVs5XSl9KTtyZXR1cm4gY30sZGVsdGFUcmFuc2Zvcm1Qb2ludDpmdW5jdGlvbihhLGMsZil7cmV0dXJuIG5ldyBwLlZlY3RvcihjKmEuYStmKmEuYyswLGMqYS5iK2YqYS5kKzApfSxkZWNvbXBvc2VNYXRyaXg6ZnVuY3Rpb24oYSl7dmFyIGM9cC5VdGlscy5kZWx0YVRyYW5zZm9ybVBvaW50KGEsMCwxKSxmPXAuVXRpbHMuZGVsdGFUcmFuc2Zvcm1Qb2ludChhLDEsMCksYz0xODAvTWF0aC5QSSpNYXRoLmF0YW4yKGMueSxjLngpLTkwO3JldHVybnt0cmFuc2xhdGVYOmEuZSx0cmFuc2xhdGVZOmEuZixcbnNjYWxlWDpNYXRoLnNxcnQoYS5hKmEuYSthLmIqYS5iKSxzY2FsZVk6TWF0aC5zcXJ0KGEuYyphLmMrYS5kKmEuZCksc2tld1g6Yyxza2V3WToxODAvTWF0aC5QSSpNYXRoLmF0YW4yKGYueSxmLngpLHJvdGF0aW9uOmN9fSxhcHBseVN2Z0F0dHJpYnV0ZXM6ZnVuY3Rpb24oYSxjKXt2YXIgZj17fSxlPXt9LGc7aWYoZ2V0Q29tcHV0ZWRTdHlsZSl7dmFyIG49Z2V0Q29tcHV0ZWRTdHlsZShhKTtmb3IoZz1uLmxlbmd0aDtnLS07KXt2YXIgdD1uW2ddO3ZhciB5PW5bdF07dm9pZCAwIT09eSYmKGVbdF09eSl9fWZvcihnPWEuYXR0cmlidXRlcy5sZW5ndGg7Zy0tOyl5PWEuYXR0cmlidXRlc1tnXSxmW3kubm9kZU5hbWVdPXkudmFsdWU7ZC5pc1VuZGVmaW5lZChlLm9wYWNpdHkpfHwoZVtcInN0cm9rZS1vcGFjaXR5XCJdPWUub3BhY2l0eSxlW1wiZmlsbC1vcGFjaXR5XCJdPWUub3BhY2l0eSk7ZC5leHRlbmQoZSxmKTtlLnZpc2libGU9IShkLmlzVW5kZWZpbmVkKGUuZGlzcGxheSkmJlwibm9uZVwiPT09XG5lLmRpc3BsYXkpfHxkLmlzVW5kZWZpbmVkKGUudmlzaWJpbGl0eSkmJlwiaGlkZGVuXCI9PT1lLnZpc2liaWxpdHk7Zm9yKHQgaW4gZSlzd2l0Y2goeT1lW3RdLHQpe2Nhc2UgXCJ0cmFuc2Zvcm1cIjppZihcIm5vbmVcIj09PXkpYnJlYWs7aWYobnVsbD09PShhLmdldENUTT9hLmdldENUTSgpOm51bGwpKWJyZWFrO2Y9cC5VdGlscy5kZWNvbXBvc2VNYXRyaXgoYS5nZXRDVE0oKSk7Yy50cmFuc2xhdGlvbi5zZXQoZi50cmFuc2xhdGVYLGYudHJhbnNsYXRlWSk7Yy5yb3RhdGlvbj1mLnJvdGF0aW9uO2Muc2NhbGU9Zi5zY2FsZVg7Zj1wYXJzZUZsb2F0KChlLngrXCJcIikucmVwbGFjZShcInB4XCIpKTtnPXBhcnNlRmxvYXQoKGUueStcIlwiKS5yZXBsYWNlKFwicHhcIikpO2YmJihjLnRyYW5zbGF0aW9uLng9Zik7ZyYmKGMudHJhbnNsYXRpb24ueT1nKTticmVhaztjYXNlIFwidmlzaWJsZVwiOmMudmlzaWJsZT15O2JyZWFrO2Nhc2UgXCJzdHJva2UtbGluZWNhcFwiOmMuY2FwPXk7YnJlYWs7Y2FzZSBcInN0cm9rZS1saW5lam9pblwiOmMuam9pbj1cbnk7YnJlYWs7Y2FzZSBcInN0cm9rZS1taXRlcmxpbWl0XCI6Yy5taXRlcj15O2JyZWFrO2Nhc2UgXCJzdHJva2Utd2lkdGhcIjpjLmxpbmV3aWR0aD1wYXJzZUZsb2F0KHkpO2JyZWFrO2Nhc2UgXCJzdHJva2Utb3BhY2l0eVwiOmNhc2UgXCJmaWxsLW9wYWNpdHlcIjpjYXNlIFwib3BhY2l0eVwiOmMub3BhY2l0eT1wYXJzZUZsb2F0KHkpO2JyZWFrO2Nhc2UgXCJmaWxsXCI6Y2FzZSBcInN0cm9rZVwiOi91cmxcXChcXCMuKlxcKS9pLnRlc3QoeSk/Y1t0XT10aGlzLmdldEJ5SWQoeS5yZXBsYWNlKC91cmxcXChcXCMoLiopXFwpL2ksXCIkMVwiKSk6Y1t0XT1cIm5vbmVcIj09PXk/XCJ0cmFuc3BhcmVudFwiOnk7YnJlYWs7Y2FzZSBcImlkXCI6Yy5pZD15O2JyZWFrO2Nhc2UgXCJjbGFzc1wiOmMuY2xhc3NMaXN0PXkuc3BsaXQoXCIgXCIpfXJldHVybiBjfSxyZWFkOntzdmc6ZnVuY3Rpb24oKXtyZXR1cm4gcC5VdGlscy5yZWFkLmcuYXBwbHkodGhpcyxhcmd1bWVudHMpfSxnOmZ1bmN0aW9uKGEpe3ZhciBjPW5ldyBwLkdyb3VwO3AuVXRpbHMuYXBwbHlTdmdBdHRyaWJ1dGVzLmNhbGwodGhpcyxcbmEsYyk7Zm9yKHZhciBmPTAsZT1hLmNoaWxkTm9kZXMubGVuZ3RoO2Y8ZTtmKyspe3ZhciBkPWEuY2hpbGROb2Rlc1tmXSxnPWQubm9kZU5hbWU7aWYoIWcpcmV0dXJuO2c9Zy5yZXBsYWNlKC9zdmdcXDovaWcsXCJcIikudG9Mb3dlckNhc2UoKTtnIGluIHAuVXRpbHMucmVhZCYmKGQ9cC5VdGlscy5yZWFkW2ddLmNhbGwoYyxkKSxjLmFkZChkKSl9cmV0dXJuIGN9LHBvbHlnb246ZnVuY3Rpb24oYSxjKXt2YXIgZj1bXTthLmdldEF0dHJpYnV0ZShcInBvaW50c1wiKS5yZXBsYWNlKC8oLT9bXFxkXFwuP10rKVssfFxcc10oLT9bXFxkXFwuP10rKS9nLGZ1bmN0aW9uKGEsYyxlKXtmLnB1c2gobmV3IHAuQW5jaG9yKHBhcnNlRmxvYXQoYykscGFyc2VGbG9hdChlKSkpfSk7Yz0obmV3IHAuUGF0aChmLCFjKSkubm9TdHJva2UoKTtjLmZpbGw9XCJibGFja1wiO3JldHVybiBwLlV0aWxzLmFwcGx5U3ZnQXR0cmlidXRlcy5jYWxsKHRoaXMsYSxjKX0scG9seWxpbmU6ZnVuY3Rpb24oYSl7cmV0dXJuIHAuVXRpbHMucmVhZC5wb2x5Z29uLmNhbGwodGhpcyxcbmEsITApfSxwYXRoOmZ1bmN0aW9uKGEpe3ZhciBjPWEuZ2V0QXR0cmlidXRlKFwiZFwiKSxmPW5ldyBwLkFuY2hvcixlLGcsbj0hMSx0PSExLHk9Yy5tYXRjaCgvW2EtZGYtel1bXmEtZGYtel0qL2lnKSxoPXkubGVuZ3RoLTE7ZC5lYWNoKHkuc2xpY2UoMCksZnVuY3Rpb24oYSxjKXt2YXIgZj1hWzBdLGU9Zi50b0xvd2VyQ2FzZSgpLGc9YS5zbGljZSgxKS50cmltKCkuc3BsaXQoL1tcXHMsXSt8KD89XFxzP1srXFwtXSkvKSxkPVtdLG47MD49YyYmKHk9W10pO3N3aXRjaChlKXtjYXNlIFwiaFwiOmNhc2UgXCJ2XCI6MTxnLmxlbmd0aCYmKG49MSk7YnJlYWs7Y2FzZSBcIm1cIjpjYXNlIFwibFwiOmNhc2UgXCJ0XCI6MjxnLmxlbmd0aCYmKG49Mik7YnJlYWs7Y2FzZSBcInNcIjpjYXNlIFwicVwiOjQ8Zy5sZW5ndGgmJihuPTQpO2JyZWFrO2Nhc2UgXCJjXCI6NjxnLmxlbmd0aCYmKG49Nil9aWYobil7YT0wO2M9Zy5sZW5ndGg7Zm9yKGU9MDthPGM7YSs9bil7dmFyIHQ9ZjtpZigwPGUpc3dpdGNoKGYpe2Nhc2UgXCJtXCI6dD1cblwibFwiO2JyZWFrO2Nhc2UgXCJNXCI6dD1cIkxcIn1kLnB1c2goW3RdLmNvbmNhdChnLnNsaWNlKGEsYStuKSkuam9pbihcIiBcIikpO2UrK315PUFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoeSxkKX1lbHNlIHkucHVzaChhKX0pO3ZhciBtPVtdO2QuZWFjaCh5LGZ1bmN0aW9uKGEsYyl7dmFyIHk9YVswXSxEPXkudG9Mb3dlckNhc2UoKTtnPWEuc2xpY2UoMSkudHJpbSgpO2c9Zy5yZXBsYWNlKC8oLT9cXGQrKD86XFwuXFxkKik/KVtlRV0oWytcXC1dP1xcZCspL2csZnVuY3Rpb24oYSxjLGYpe3JldHVybiBwYXJzZUZsb2F0KGMpKnYoMTAsZil9KTtnPWcuc3BsaXQoL1tcXHMsXSt8KD89XFxzP1srXFwtXSkvKTt0PXk9PT1EO3N3aXRjaChEKXtjYXNlIFwielwiOmlmKGM+PWgpbj0hMDtlbHNle2E9Zi54O2M9Zi55O3ZhciBrPW5ldyBwLkFuY2hvcihhLGMsdm9pZCAwLHZvaWQgMCx2b2lkIDAsdm9pZCAwLHAuQ29tbWFuZHMuY2xvc2UpfWJyZWFrO2Nhc2UgXCJtXCI6Y2FzZSBcImxcIjphPXBhcnNlRmxvYXQoZ1swXSk7XG5jPXBhcnNlRmxvYXQoZ1sxXSk7az1uZXcgcC5BbmNob3IoYSxjLHZvaWQgMCx2b2lkIDAsdm9pZCAwLHZvaWQgMCxcIm1cIj09PUQ/cC5Db21tYW5kcy5tb3ZlOnAuQ29tbWFuZHMubGluZSk7dCYmay5hZGRTZWxmKGYpO2Y9azticmVhaztjYXNlIFwiaFwiOmNhc2UgXCJ2XCI6Yz1cImhcIj09PUQ/XCJ4XCI6XCJ5XCI7RD1cInhcIj09PWM/XCJ5XCI6XCJ4XCI7az1uZXcgcC5BbmNob3Iodm9pZCAwLHZvaWQgMCx2b2lkIDAsdm9pZCAwLHZvaWQgMCx2b2lkIDAscC5Db21tYW5kcy5saW5lKTtrW2NdPXBhcnNlRmxvYXQoZ1swXSk7a1tEXT1mW0RdO3QmJihrW2NdKz1mW2NdKTtmPWs7YnJlYWs7Y2FzZSBcImNcIjpjYXNlIFwic1wiOms9Zi54O2M9Zi55O2V8fChlPW5ldyBwLlZlY3Rvcik7aWYoXCJjXCI9PT1EKXt5PXBhcnNlRmxvYXQoZ1swXSk7dmFyIEI9cGFyc2VGbG9hdChnWzFdKTt2YXIgbD1wYXJzZUZsb2F0KGdbMl0pO3ZhciB6PXBhcnNlRmxvYXQoZ1szXSk7RD1wYXJzZUZsb2F0KGdbNF0pO2E9cGFyc2VGbG9hdChnWzVdKX1lbHNlIEQ9XG5NKGYsZSx0KSx5PUQueCxCPUQueSxsPXBhcnNlRmxvYXQoZ1swXSksej1wYXJzZUZsb2F0KGdbMV0pLEQ9cGFyc2VGbG9hdChnWzJdKSxhPXBhcnNlRmxvYXQoZ1szXSk7dCYmKHkrPWssQis9YyxsKz1rLHorPWMsRCs9ayxhKz1jKTtkLmlzT2JqZWN0KGYuY29udHJvbHMpfHxwLkFuY2hvci5BcHBlbmRDdXJ2ZVByb3BlcnRpZXMoZik7Zi5jb250cm9scy5yaWdodC5zZXQoeS1mLngsQi1mLnkpO2Y9az1uZXcgcC5BbmNob3IoRCxhLGwtRCx6LWEsdm9pZCAwLHZvaWQgMCxwLkNvbW1hbmRzLmN1cnZlKTtlPWsuY29udHJvbHMubGVmdDticmVhaztjYXNlIFwidFwiOmNhc2UgXCJxXCI6az1mLng7Yz1mLnk7ZXx8KGU9bmV3IHAuVmVjdG9yKTtlLmlzWmVybygpPyh5PWssQj1jKTooeT1lLngsYz1lLnkpO1wicVwiPT09RD8obD1wYXJzZUZsb2F0KGdbMF0pLHo9cGFyc2VGbG9hdChnWzFdKSxEPXBhcnNlRmxvYXQoZ1sxXSksYT1wYXJzZUZsb2F0KGdbMl0pKTooRD1NKGYsZSx0KSxsPUQueCx6PUQueSxcbkQ9cGFyc2VGbG9hdChnWzBdKSxhPXBhcnNlRmxvYXQoZ1sxXSkpO3QmJih5Kz1rLEIrPWMsbCs9ayx6Kz1jLEQrPWssYSs9Yyk7ZC5pc09iamVjdChmLmNvbnRyb2xzKXx8cC5BbmNob3IuQXBwZW5kQ3VydmVQcm9wZXJ0aWVzKGYpO2YuY29udHJvbHMucmlnaHQuc2V0KHktZi54LEItZi55KTtmPWs9bmV3IHAuQW5jaG9yKEQsYSxsLUQsei1hLHZvaWQgMCx2b2lkIDAscC5Db21tYW5kcy5jdXJ2ZSk7ZT1rLmNvbnRyb2xzLmxlZnQ7YnJlYWs7Y2FzZSBcImFcIjprPWYueDtjPWYueTt2YXIgSj1wYXJzZUZsb2F0KGdbMF0pLHg9cGFyc2VGbG9hdChnWzFdKTtCPXBhcnNlRmxvYXQoZ1syXSkqTWF0aC5QSS8xODA7eT1wYXJzZUZsb2F0KGdbM10pO2w9cGFyc2VGbG9hdChnWzRdKTtEPXBhcnNlRmxvYXQoZ1s1XSk7YT1wYXJzZUZsb2F0KGdbNl0pO3QmJihEKz1rLGErPWMpO3ZhciB1PShELWspLzIsQT0oYS1jKS8yO3o9dSpNYXRoLmNvcyhCKStBKk1hdGguc2luKEIpO3ZhciB1PS11Kk1hdGguc2luKEIpK1xuQSpNYXRoLmNvcyhCKSxBPUoqSixxPXgqeCxyPXoqeixLPXUqdSxRPXIvQStLL3E7MTxRJiYoSio9TWF0aC5zcXJ0KFEpLHgqPU1hdGguc3FydChRKSk7cT1NYXRoLnNxcnQoKEEqcS1BKkstcSpyKS8oQSpLK3EqcikpO2QuaXNOYU4ocSk/cT0wOnkhPWwmJjA8cSYmKHEqPS0xKTtBPXEqSip1L3g7cT0tcSp4KnovSjtrPUEqTWF0aC5jb3MoQiktcSpNYXRoLnNpbihCKSsoaytEKS8yO3ZhciByPUEqTWF0aC5zaW4oQikrcSpNYXRoLmNvcyhCKSsoYythKS8yLHc9ZnVuY3Rpb24oYSxjKXtyZXR1cm4oYVswXSpjWzBdK2FbMV0qY1sxXSkvKE1hdGguc3FydChNYXRoLnBvdyhhWzBdLDIpK01hdGgucG93KGFbMV0sMikpKk1hdGguc3FydChNYXRoLnBvdyhjWzBdLDIpK01hdGgucG93KGNbMV0sMikpKX07Yz1mdW5jdGlvbihhLGMpe3JldHVybihhWzBdKmNbMV08YVsxXSpjWzBdPy0xOjEpKk1hdGguYWNvcyh3KGEsYykpfTt2YXIgUz1jKFsxLDBdLFsoei1BKS9KLCh1LXEpL3hdKSxLPVsoei1cbkEpL0osKHUtcSkveF07ej1bKC16LUEpL0osKC11LXEpL3hdO3ZhciBDPWMoSyx6KTstMT49dyhLLHopJiYoQz1NYXRoLlBJKTsxPD13KEsseikmJihDPTApO3kmJihDPUkoQywyKk1hdGguUEkpKTtsJiYwPEMmJihDLT0yKk1hdGguUEkpO3ZhciBSPXAuUmVzb2x1dGlvbixUPShuZXcgcC5NYXRyaXgpLnRyYW5zbGF0ZShrLHIpLnJvdGF0ZShCKTtrPWQubWFwKGQucmFuZ2UoUiksZnVuY3Rpb24oYSl7YT0oMS1hLyhSLTEpKSpDK1M7YT1ULm11bHRpcGx5KEoqTWF0aC5jb3MoYSkseCpNYXRoLnNpbihhKSwxKTtyZXR1cm4gbmV3IHAuQW5jaG9yKGEueCxhLnksITEsITEsITEsITEscC5Db21tYW5kcy5saW5lKX0pO2sucHVzaChuZXcgcC5BbmNob3IoRCxhLCExLCExLCExLCExLHAuQ29tbWFuZHMubGluZSkpO2Y9a1trLmxlbmd0aC0xXTtlPWYuY29udHJvbHMubGVmdH1rJiYoZC5pc0FycmF5KGspP209bS5jb25jYXQoayk6bS5wdXNoKGspKX0pO2lmKCEoMT49bS5sZW5ndGgpKXtjPVxuKG5ldyBwLlBhdGgobSxuLHZvaWQgMCwhMCkpLm5vU3Ryb2tlKCk7Yy5maWxsPVwiYmxhY2tcIjt2YXIgaz1jLmdldEJvdW5kaW5nQ2xpZW50UmVjdCghMCk7ay5jZW50cm9pZD17eDprLmxlZnQray53aWR0aC8yLHk6ay50b3Aray5oZWlnaHQvMn07ZC5lYWNoKGMudmVydGljZXMsZnVuY3Rpb24oYSl7YS5zdWJTZWxmKGsuY2VudHJvaWQpfSk7Yy50cmFuc2xhdGlvbi5hZGRTZWxmKGsuY2VudHJvaWQpO3JldHVybiBwLlV0aWxzLmFwcGx5U3ZnQXR0cmlidXRlcy5jYWxsKHRoaXMsYSxjKX19LGNpcmNsZTpmdW5jdGlvbihhKXt2YXIgYz1wYXJzZUZsb2F0KGEuZ2V0QXR0cmlidXRlKFwiY3hcIikpLGY9cGFyc2VGbG9hdChhLmdldEF0dHJpYnV0ZShcImN5XCIpKSxlPXBhcnNlRmxvYXQoYS5nZXRBdHRyaWJ1dGUoXCJyXCIpKSxjPShuZXcgcC5DaXJjbGUoYyxmLGUpKS5ub1N0cm9rZSgpO2MuZmlsbD1cImJsYWNrXCI7cmV0dXJuIHAuVXRpbHMuYXBwbHlTdmdBdHRyaWJ1dGVzLmNhbGwodGhpcyxhLFxuYyl9LGVsbGlwc2U6ZnVuY3Rpb24oYSl7dmFyIGM9cGFyc2VGbG9hdChhLmdldEF0dHJpYnV0ZShcImN4XCIpKSxmPXBhcnNlRmxvYXQoYS5nZXRBdHRyaWJ1dGUoXCJjeVwiKSksZT1wYXJzZUZsb2F0KGEuZ2V0QXR0cmlidXRlKFwicnhcIikpLGc9cGFyc2VGbG9hdChhLmdldEF0dHJpYnV0ZShcInJ5XCIpKSxjPShuZXcgcC5FbGxpcHNlKGMsZixlLGcpKS5ub1N0cm9rZSgpO2MuZmlsbD1cImJsYWNrXCI7cmV0dXJuIHAuVXRpbHMuYXBwbHlTdmdBdHRyaWJ1dGVzLmNhbGwodGhpcyxhLGMpfSxyZWN0OmZ1bmN0aW9uKGEpe3ZhciBjPXBhcnNlRmxvYXQoYS5nZXRBdHRyaWJ1dGUoXCJ4XCIpKXx8MCxmPXBhcnNlRmxvYXQoYS5nZXRBdHRyaWJ1dGUoXCJ5XCIpKXx8MCxlPXBhcnNlRmxvYXQoYS5nZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiKSksZz1wYXJzZUZsb2F0KGEuZ2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIpKSxjPShuZXcgcC5SZWN0YW5nbGUoYytlLzIsZitnLzIsZSxnKSkubm9TdHJva2UoKTtjLmZpbGw9XCJibGFja1wiO1xucmV0dXJuIHAuVXRpbHMuYXBwbHlTdmdBdHRyaWJ1dGVzLmNhbGwodGhpcyxhLGMpfSxsaW5lOmZ1bmN0aW9uKGEpe3ZhciBjPXBhcnNlRmxvYXQoYS5nZXRBdHRyaWJ1dGUoXCJ4MVwiKSksZj1wYXJzZUZsb2F0KGEuZ2V0QXR0cmlidXRlKFwieTFcIikpLGU9cGFyc2VGbG9hdChhLmdldEF0dHJpYnV0ZShcIngyXCIpKSxnPXBhcnNlRmxvYXQoYS5nZXRBdHRyaWJ1dGUoXCJ5MlwiKSksYz0obmV3IHAuTGluZShjLGYsZSxnKSkubm9GaWxsKCk7cmV0dXJuIHAuVXRpbHMuYXBwbHlTdmdBdHRyaWJ1dGVzLmNhbGwodGhpcyxhLGMpfSxsaW5lYXJncmFkaWVudDpmdW5jdGlvbihhKXtmb3IodmFyIGMsZj1wYXJzZUZsb2F0KGEuZ2V0QXR0cmlidXRlKFwieDFcIikpLGU9cGFyc2VGbG9hdChhLmdldEF0dHJpYnV0ZShcInkxXCIpKSxnPXBhcnNlRmxvYXQoYS5nZXRBdHRyaWJ1dGUoXCJ4MlwiKSksbj1wYXJzZUZsb2F0KGEuZ2V0QXR0cmlidXRlKFwieTJcIikpLHQ9KGcrZikvMixoPShuK2UpLzIseT1bXSx2PTA7djxcbmEuY2hpbGRyZW4ubGVuZ3RoO3YrKyl7Yz1hLmNoaWxkcmVuW3ZdO3ZhciBrPXBhcnNlRmxvYXQoYy5nZXRBdHRyaWJ1dGUoXCJvZmZzZXRcIikpLG09Yy5nZXRBdHRyaWJ1dGUoXCJzdG9wLWNvbG9yXCIpLEI9Yy5nZXRBdHRyaWJ1dGUoXCJzdG9wLW9wYWNpdHlcIiksbD1jLmdldEF0dHJpYnV0ZShcInN0eWxlXCIpO2QuaXNOdWxsKG0pJiYobT0oYz1sP2wubWF0Y2goL3N0b3BcXC1jb2xvclxcOlxccz8oW1xcI2EtZkEtRjAtOV0qKS8pOiExKSYmMTxjLmxlbmd0aD9jWzFdOnZvaWQgMCk7ZC5pc051bGwoQikmJihCPShjPWw/bC5tYXRjaCgvc3RvcFxcLW9wYWNpdHlcXDpcXHM/KFswLTlcXC5cXC1dKikvKTohMSkmJjE8Yy5sZW5ndGg/cGFyc2VGbG9hdChjWzFdKToxKTt5LnB1c2gobmV3IHAuR3JhZGllbnQuU3RvcChrLG0sQikpfWY9bmV3IHAuTGluZWFyR3JhZGllbnQoZi10LGUtaCxnLXQsbi1oLHkpO3JldHVybiBwLlV0aWxzLmFwcGx5U3ZnQXR0cmlidXRlcy5jYWxsKHRoaXMsYSxmKX0scmFkaWFsZ3JhZGllbnQ6ZnVuY3Rpb24oYSl7dmFyIGM9XG5wYXJzZUZsb2F0KGEuZ2V0QXR0cmlidXRlKFwiY3hcIikpfHwwLGY9cGFyc2VGbG9hdChhLmdldEF0dHJpYnV0ZShcImN5XCIpKXx8MCxlPXBhcnNlRmxvYXQoYS5nZXRBdHRyaWJ1dGUoXCJyXCIpKSxnPXBhcnNlRmxvYXQoYS5nZXRBdHRyaWJ1dGUoXCJmeFwiKSksbj1wYXJzZUZsb2F0KGEuZ2V0QXR0cmlidXRlKFwiZnlcIikpO2QuaXNOYU4oZykmJihnPWMpO2QuaXNOYU4obikmJihuPWYpO2Zvcih2YXIgdD1NYXRoLmFicyhjK2cpLzIsaD1NYXRoLmFicyhmK24pLzIsdj1bXSx5PTA7eTxhLmNoaWxkcmVuLmxlbmd0aDt5Kyspe3ZhciBrPWEuY2hpbGRyZW5beV07dmFyIG09cGFyc2VGbG9hdChrLmdldEF0dHJpYnV0ZShcIm9mZnNldFwiKSksQj1rLmdldEF0dHJpYnV0ZShcInN0b3AtY29sb3JcIiksbD1rLmdldEF0dHJpYnV0ZShcInN0b3Atb3BhY2l0eVwiKSx6PWsuZ2V0QXR0cmlidXRlKFwic3R5bGVcIik7ZC5pc051bGwoQikmJihCPShrPXo/ei5tYXRjaCgvc3RvcFxcLWNvbG9yXFw6XFxzPyhbXFwjYS1mQS1GMC05XSopLyk6XG4hMSkmJjE8ay5sZW5ndGg/a1sxXTp2b2lkIDApO2QuaXNOdWxsKGwpJiYobD0oaz16P3oubWF0Y2goL3N0b3BcXC1vcGFjaXR5XFw6XFxzPyhbMC05XFwuXFwtXSopLyk6ITEpJiYxPGsubGVuZ3RoP3BhcnNlRmxvYXQoa1sxXSk6MSk7di5wdXNoKG5ldyBwLkdyYWRpZW50LlN0b3AobSxCLGwpKX1jPW5ldyBwLlJhZGlhbEdyYWRpZW50KGMtdCxmLWgsZSx2LGctdCxuLWgpO3JldHVybiBwLlV0aWxzLmFwcGx5U3ZnQXR0cmlidXRlcy5jYWxsKHRoaXMsYSxjKX19LHN1YmRpdmlkZTpmdW5jdGlvbihhLGMsZixlLGcsbix0LGgsdil7dj12fHxwLlV0aWxzLkN1cnZlLlJlY3Vyc2lvbkxpbWl0O3ZhciB5PXYrMTtyZXR1cm4gYT09PXQmJmM9PT1oP1tuZXcgcC5BbmNob3IodCxoKV06ZC5tYXAoZC5yYW5nZSgwLHkpLGZ1bmN0aW9uKGQpe3ZhciB2PWQveTtkPU4odixhLGYsZyx0KTt2PU4odixjLGUsbixoKTtyZXR1cm4gbmV3IHAuQW5jaG9yKGQsdil9KX0sZ2V0UG9pbnRPbkN1YmljQmV6aWVyOmZ1bmN0aW9uKGEsXG5jLGYsZSxnKXt2YXIgZD0xLWE7cmV0dXJuIGQqZCpkKmMrMypkKmQqYSpmKzMqZCphKmEqZSthKmEqYSpnfSxnZXRDdXJ2ZUxlbmd0aDpmdW5jdGlvbihhLGMsZixlLGcsZCx0LHYsaCl7aWYoYT09PWYmJmM9PT1lJiZnPT09dCYmZD09PXYpcmV0dXJuIGE9dC1hLGM9di1jLG4oYSphK2MqYyk7dmFyIHk9OSooZi1nKSszKih0LWEpLGs9NiooYStnKS0xMipmLEI9MyooZi1hKSxtPTkqKGUtZCkrMyoodi1jKSxsPTYqKGMrZCktMTIqZSxEPTMqKGUtYyk7cmV0dXJuIFAoZnVuY3Rpb24oYSl7dmFyIGM9KHkqYStrKSphK0I7YT0obSphK2wpKmErRDtyZXR1cm4gbihjKmMrYSphKX0sMCwxLGh8fHAuVXRpbHMuQ3VydmUuUmVjdXJzaW9uTGltaXQpfSxpbnRlZ3JhdGU6ZnVuY3Rpb24oYSxjLGYsZSl7dmFyIGc9cC5VdGlscy5DdXJ2ZS5hYnNjaXNzYXNbZS0yXSxkPXAuVXRpbHMuQ3VydmUud2VpZ2h0c1tlLTJdO2Y9LjUqKGYtYyk7Yz1mK2M7dmFyIG49MCx0PWUrMT4+MTtmb3IoZT1lJjE/XG5kW24rK10qYShjKTowO248dDspe3ZhciB2PWYqZ1tuXTtlKz1kW24rK10qKGEoYyt2KSthKGMtdikpfXJldHVybiBmKmV9LGdldEN1cnZlRnJvbVBvaW50czpmdW5jdGlvbihhLGMpe2Zvcih2YXIgZj1hLmxlbmd0aCxlPWYtMSxnPTA7ZzxmO2crKyl7dmFyIG49YVtnXTtkLmlzT2JqZWN0KG4uY29udHJvbHMpfHxwLkFuY2hvci5BcHBlbmRDdXJ2ZVByb3BlcnRpZXMobik7dmFyIHQ9Yz9JKGctMSxmKTp6KGctMSwwKSx2PWM/SShnKzEsZik6QihnKzEsZSk7RihhW3RdLG4sYVt2XSk7bi5fY29tbWFuZD0wPT09Zz9wLkNvbW1hbmRzLm1vdmU6cC5Db21tYW5kcy5jdXJ2ZTtuLmNvbnRyb2xzLmxlZnQueD1kLmlzTnVtYmVyKG4uY29udHJvbHMubGVmdC54KT9uLmNvbnRyb2xzLmxlZnQueDpuLng7bi5jb250cm9scy5sZWZ0Lnk9ZC5pc051bWJlcihuLmNvbnRyb2xzLmxlZnQueSk/bi5jb250cm9scy5sZWZ0Lnk6bi55O24uY29udHJvbHMucmlnaHQueD1kLmlzTnVtYmVyKG4uY29udHJvbHMucmlnaHQueCk/XG5uLmNvbnRyb2xzLnJpZ2h0Lng6bi54O24uY29udHJvbHMucmlnaHQueT1kLmlzTnVtYmVyKG4uY29udHJvbHMucmlnaHQueSk/bi5jb250cm9scy5yaWdodC55Om4ueX19LGdldENvbnRyb2xQb2ludHM6ZnVuY3Rpb24oYyxnLG4pe3ZhciB2PUcoYyxnKSxoPUcobixnKTtjPUUoYyxnKTtuPUUobixnKTt2YXIgaz0oditoKS8yO2cudT1kLmlzT2JqZWN0KGcuY29udHJvbHMubGVmdCk/Zy5jb250cm9scy5sZWZ0Om5ldyBwLlZlY3RvcigwLDApO2cudj1kLmlzT2JqZWN0KGcuY29udHJvbHMucmlnaHQpP2cuY29udHJvbHMucmlnaHQ6bmV3IHAuVmVjdG9yKDAsMCk7aWYoLjAwMDE+Y3x8LjAwMDE+bilyZXR1cm4gZy5fcmVsYXRpdmV8fChnLmNvbnRyb2xzLmxlZnQuY29weShnKSxnLmNvbnRyb2xzLnJpZ2h0LmNvcHkoZykpLGc7Yyo9LjMzO24qPS4zMztrPWg8dj9rK3Q6ay10O2cuY29udHJvbHMubGVmdC54PWEoaykqYztnLmNvbnRyb2xzLmxlZnQueT1lKGspKmM7ay09ZjtnLmNvbnRyb2xzLnJpZ2h0Lng9XG5hKGspKm47Zy5jb250cm9scy5yaWdodC55PWUoaykqbjtnLl9yZWxhdGl2ZXx8KGcuY29udHJvbHMubGVmdC54Kz1nLngsZy5jb250cm9scy5sZWZ0LnkrPWcueSxnLmNvbnRyb2xzLnJpZ2h0LngrPWcueCxnLmNvbnRyb2xzLnJpZ2h0LnkrPWcueSk7cmV0dXJuIGd9LGdldFJlZmxlY3Rpb246ZnVuY3Rpb24oYSxjLGYpe3JldHVybiBuZXcgcC5WZWN0b3IoMiphLngtKGMueCthLngpLShmP2EueDowKSwyKmEueS0oYy55K2EueSktKGY/YS55OjApKX0sZ2V0QW5jaG9yc0Zyb21BcmNEYXRhOmZ1bmN0aW9uKGEsYyxmLGUsZyxuLHQpeyhuZXcgcC5NYXRyaXgpLnRyYW5zbGF0ZShhLngsYS55KS5yb3RhdGUoYyk7dmFyIHY9cC5SZXNvbHV0aW9uO3JldHVybiBkLm1hcChkLnJhbmdlKHYpLGZ1bmN0aW9uKGEpe2E9KGErMSkvdjt0JiYoYT0xLWEpO2E9YSpuK2c7YT1uZXcgcC5BbmNob3IoZipNYXRoLmNvcyhhKSxlKk1hdGguc2luKGEpKTtwLkFuY2hvci5BcHBlbmRDdXJ2ZVByb3BlcnRpZXMoYSk7XG5hLmNvbW1hbmQ9cC5Db21tYW5kcy5saW5lO3JldHVybiBhfSl9LHJhdGlvQmV0d2VlbjpmdW5jdGlvbihhLGMpe3JldHVybihhLngqYy54K2EueSpjLnkpLyhhLmxlbmd0aCgpKmMubGVuZ3RoKCkpfSxhbmdsZUJldHdlZW46ZnVuY3Rpb24oYSxjKXtpZig0PD1hcmd1bWVudHMubGVuZ3RoKXt2YXIgZj1hcmd1bWVudHNbMF0tYXJndW1lbnRzWzJdO3ZhciBlPWFyZ3VtZW50c1sxXS1hcmd1bWVudHNbM107cmV0dXJuIGcoZSxmKX1mPWEueC1jLng7ZT1hLnktYy55O3JldHVybiBnKGUsZil9LGRpc3RhbmNlQmV0d2VlblNxdWFyZWQ6ZnVuY3Rpb24oYSxjKXt2YXIgZj1hLngtYy54O2E9YS55LWMueTtyZXR1cm4gZipmK2EqYX0sZGlzdGFuY2VCZXR3ZWVuOmZ1bmN0aW9uKGEsYyl7cmV0dXJuIG4oSChhLGMpKX0sbGVycDpmdW5jdGlvbihhLGMsZil7cmV0dXJuIGYqKGMtYSkrYX0sdG9GaXhlZDpmdW5jdGlvbihhKXtyZXR1cm4gTWF0aC5mbG9vcigxRTMqYSkvMUUzfSxtb2Q6ZnVuY3Rpb24oYSxcbmMpe2Zvcig7MD5hOylhKz1jO3JldHVybiBhJWN9LENvbGxlY3Rpb246ZnVuY3Rpb24oKXtBcnJheS5jYWxsKHRoaXMpOzE8YXJndW1lbnRzLmxlbmd0aD9BcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0aGlzLGFyZ3VtZW50cyk6YXJndW1lbnRzWzBdJiZBcnJheS5pc0FycmF5KGFyZ3VtZW50c1swXSkmJkFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMsYXJndW1lbnRzWzBdKX0sRXJyb3I6ZnVuY3Rpb24oYSl7dGhpcy5uYW1lPVwidHdvLmpzXCI7dGhpcy5tZXNzYWdlPWF9LEV2ZW50czp7b246ZnVuY3Rpb24oYSxjKXt0aGlzLl9ldmVudHN8fCh0aGlzLl9ldmVudHM9e30pOyh0aGlzLl9ldmVudHNbYV18fCh0aGlzLl9ldmVudHNbYV09W10pKS5wdXNoKGMpO3JldHVybiB0aGlzfSxvZmY6ZnVuY3Rpb24oYSxjKXtpZighdGhpcy5fZXZlbnRzKXJldHVybiB0aGlzO2lmKCFhJiYhYylyZXR1cm4gdGhpcy5fZXZlbnRzPXt9LHRoaXM7Zm9yKHZhciBmPWE/W2FdOmQua2V5cyh0aGlzLl9ldmVudHMpLFxuZT0wLGc9Zi5sZW5ndGg7ZTxnO2UrKyl7YT1mW2VdO3ZhciBuPXRoaXMuX2V2ZW50c1thXTtpZihuKXt2YXIgdD1bXTtpZihjKWZvcih2YXIgdj0wLGg9bi5sZW5ndGg7djxoO3YrKyl7dmFyIGs9blt2XSxrPWsuY2FsbGJhY2s/ay5jYWxsYmFjazprO2MmJmMhPT1rJiZ0LnB1c2goayl9dGhpcy5fZXZlbnRzW2FdPXR9fXJldHVybiB0aGlzfSx0cmlnZ2VyOmZ1bmN0aW9uKGEpe2lmKCF0aGlzLl9ldmVudHMpcmV0dXJuIHRoaXM7dmFyIGM9eC5jYWxsKGFyZ3VtZW50cywxKSxmPXRoaXMuX2V2ZW50c1thXTtmJiZDKHRoaXMsZixjKTtyZXR1cm4gdGhpc30sbGlzdGVuOmZ1bmN0aW9uKGEsYyxmKXt2YXIgZT10aGlzO2lmKGEpe3ZhciBnPWZ1bmN0aW9uKCl7Zi5hcHBseShlLGFyZ3VtZW50cyl9O2cub2JqPWE7Zy5uYW1lPWM7Zy5jYWxsYmFjaz1mO2Eub24oYyxnKX1yZXR1cm4gdGhpc30saWdub3JlOmZ1bmN0aW9uKGEsYyxmKXthLm9mZihjLGYpO3JldHVybiB0aGlzfX19KX0pO3AuVXRpbHMuRXZlbnRzLmJpbmQ9XG5wLlV0aWxzLkV2ZW50cy5vbjtwLlV0aWxzLkV2ZW50cy51bmJpbmQ9cC5VdGlscy5FdmVudHMub2ZmO3ZhciBDPWZ1bmN0aW9uKGEsYyxmKXtzd2l0Y2goZi5sZW5ndGgpe2Nhc2UgMDp2YXIgZT1mdW5jdGlvbihlKXtjW2VdLmNhbGwoYSxmWzBdKX07YnJlYWs7Y2FzZSAxOmU9ZnVuY3Rpb24oZSl7Y1tlXS5jYWxsKGEsZlswXSxmWzFdKX07YnJlYWs7Y2FzZSAyOmU9ZnVuY3Rpb24oZSl7Y1tlXS5jYWxsKGEsZlswXSxmWzFdLGZbMl0pfTticmVhaztjYXNlIDM6ZT1mdW5jdGlvbihlKXtjW2VdLmNhbGwoYSxmWzBdLGZbMV0sZlsyXSxmWzNdKX07YnJlYWs7ZGVmYXVsdDplPWZ1bmN0aW9uKGUpe2NbZV0uYXBwbHkoYSxmKX19Zm9yKHZhciBnPTA7ZzxjLmxlbmd0aDtnKyspZShnKX07cC5VdGlscy5FcnJvci5wcm90b3R5cGU9RXJyb3IoKTtwLlV0aWxzLkVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1wLlV0aWxzLkVycm9yO3AuVXRpbHMuQ29sbGVjdGlvbi5wcm90b3R5cGU9W107XG5wLlV0aWxzLkNvbGxlY3Rpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yPXAuVXRpbHMuQ29sbGVjdGlvbjtkLmV4dGVuZChwLlV0aWxzLkNvbGxlY3Rpb24ucHJvdG90eXBlLHAuVXRpbHMuRXZlbnRzLHtwb3A6ZnVuY3Rpb24oKXt2YXIgYT1BcnJheS5wcm90b3R5cGUucG9wLmFwcGx5KHRoaXMsYXJndW1lbnRzKTt0aGlzLnRyaWdnZXIocC5FdmVudHMucmVtb3ZlLFthXSk7cmV0dXJuIGF9LHNoaWZ0OmZ1bmN0aW9uKCl7dmFyIGE9QXJyYXkucHJvdG90eXBlLnNoaWZ0LmFwcGx5KHRoaXMsYXJndW1lbnRzKTt0aGlzLnRyaWdnZXIocC5FdmVudHMucmVtb3ZlLFthXSk7cmV0dXJuIGF9LHB1c2g6ZnVuY3Rpb24oKXt2YXIgYT1BcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7dGhpcy50cmlnZ2VyKHAuRXZlbnRzLmluc2VydCxhcmd1bWVudHMpO3JldHVybiBhfSx1bnNoaWZ0OmZ1bmN0aW9uKCl7dmFyIGE9QXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkodGhpcyxcbmFyZ3VtZW50cyk7dGhpcy50cmlnZ2VyKHAuRXZlbnRzLmluc2VydCxhcmd1bWVudHMpO3JldHVybiBhfSxzcGxpY2U6ZnVuY3Rpb24oKXt2YXIgYT1BcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KHRoaXMsYXJndW1lbnRzKTt0aGlzLnRyaWdnZXIocC5FdmVudHMucmVtb3ZlLGEpO2lmKDI8YXJndW1lbnRzLmxlbmd0aCl7dmFyIGM9dGhpcy5zbGljZShhcmd1bWVudHNbMF0sYXJndW1lbnRzWzBdK2FyZ3VtZW50cy5sZW5ndGgtMik7dGhpcy50cmlnZ2VyKHAuRXZlbnRzLmluc2VydCxjKTt0aGlzLnRyaWdnZXIocC5FdmVudHMub3JkZXIpfXJldHVybiBhfSxzb3J0OmZ1bmN0aW9uKCl7QXJyYXkucHJvdG90eXBlLnNvcnQuYXBwbHkodGhpcyxhcmd1bWVudHMpO3RoaXMudHJpZ2dlcihwLkV2ZW50cy5vcmRlcik7cmV0dXJuIHRoaXN9LHJldmVyc2U6ZnVuY3Rpb24oKXtBcnJheS5wcm90b3R5cGUucmV2ZXJzZS5hcHBseSh0aGlzLGFyZ3VtZW50cyk7dGhpcy50cmlnZ2VyKHAuRXZlbnRzLm9yZGVyKTtcbnJldHVybiB0aGlzfX0pO3ZhciBFPXAuVXRpbHMuZGlzdGFuY2VCZXR3ZWVuLEg9cC5VdGlscy5kaXN0YW5jZUJldHdlZW5TcXVhcmVkLEc9cC5VdGlscy5hbmdsZUJldHdlZW4sRj1wLlV0aWxzLmdldENvbnRyb2xQb2ludHMsST1wLlV0aWxzLm1vZCxPPXAuVXRpbHMuZ2V0QmFja2luZ1N0b3JlUmF0aW8sTj1wLlV0aWxzLmdldFBvaW50T25DdWJpY0JlemllcixQPXAuVXRpbHMuaW50ZWdyYXRlLE09cC5VdGlscy5nZXRSZWZsZWN0aW9uO2QuZXh0ZW5kKHAucHJvdG90eXBlLHAuVXRpbHMuRXZlbnRzLHthcHBlbmRUbzpmdW5jdGlvbihhKXthLmFwcGVuZENoaWxkKHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCk7cmV0dXJuIHRoaXN9LHBsYXk6ZnVuY3Rpb24oKXtwLlV0aWxzLnNldFBsYXlpbmcuY2FsbCh0aGlzLCEwKTtyZXR1cm4gdGhpcy50cmlnZ2VyKHAuRXZlbnRzLnBsYXkpfSxwYXVzZTpmdW5jdGlvbigpe3RoaXMucGxheWluZz0hMTtyZXR1cm4gdGhpcy50cmlnZ2VyKHAuRXZlbnRzLnBhdXNlKX0sXG51cGRhdGU6ZnVuY3Rpb24oKXt2YXIgYT0hIXRoaXMuX2xhc3RGcmFtZSxjPXUubm93KCk7dGhpcy5mcmFtZUNvdW50Kys7YSYmKHRoaXMudGltZURlbHRhPXBhcnNlRmxvYXQoKGMtdGhpcy5fbGFzdEZyYW1lKS50b0ZpeGVkKDMpKSk7dGhpcy5fbGFzdEZyYW1lPWM7dmFyIGE9dGhpcy53aWR0aCxjPXRoaXMuaGVpZ2h0LGY9dGhpcy5yZW5kZXJlcjthPT09Zi53aWR0aCYmYz09PWYuaGVpZ2h0fHxmLnNldFNpemUoYSxjLHRoaXMucmF0aW8pO3RoaXMudHJpZ2dlcihwLkV2ZW50cy51cGRhdGUsdGhpcy5mcmFtZUNvdW50LHRoaXMudGltZURlbHRhKTtyZXR1cm4gdGhpcy5yZW5kZXIoKX0scmVuZGVyOmZ1bmN0aW9uKCl7dGhpcy5yZW5kZXJlci5yZW5kZXIoKTtyZXR1cm4gdGhpcy50cmlnZ2VyKHAuRXZlbnRzLnJlbmRlcix0aGlzLmZyYW1lQ291bnQpfSxhZGQ6ZnVuY3Rpb24oYSl7dmFyIGM9YTtjIGluc3RhbmNlb2YgQXJyYXl8fChjPWQudG9BcnJheShhcmd1bWVudHMpKTt0aGlzLnNjZW5lLmFkZChjKTtcbnJldHVybiB0aGlzfSxyZW1vdmU6ZnVuY3Rpb24oYSl7dmFyIGM9YTtjIGluc3RhbmNlb2YgQXJyYXl8fChjPWQudG9BcnJheShhcmd1bWVudHMpKTt0aGlzLnNjZW5lLnJlbW92ZShjKTtyZXR1cm4gdGhpc30sY2xlYXI6ZnVuY3Rpb24oKXt0aGlzLnNjZW5lLnJlbW92ZShkLnRvQXJyYXkodGhpcy5zY2VuZS5jaGlsZHJlbikpO3JldHVybiB0aGlzfSxtYWtlTGluZTpmdW5jdGlvbihhLGMsZixlKXthPW5ldyBwLkxpbmUoYSxjLGYsZSk7dGhpcy5zY2VuZS5hZGQoYSk7cmV0dXJuIGF9LG1ha2VSZWN0YW5nbGU6ZnVuY3Rpb24oYSxjLGYsZSl7YT1uZXcgcC5SZWN0YW5nbGUoYSxjLGYsZSk7dGhpcy5zY2VuZS5hZGQoYSk7cmV0dXJuIGF9LG1ha2VSb3VuZGVkUmVjdGFuZ2xlOmZ1bmN0aW9uKGEsYyxmLGUsZyl7YT1uZXcgcC5Sb3VuZGVkUmVjdGFuZ2xlKGEsYyxmLGUsZyk7dGhpcy5zY2VuZS5hZGQoYSk7cmV0dXJuIGF9LG1ha2VDaXJjbGU6ZnVuY3Rpb24oYSxjLGYpe2E9bmV3IHAuQ2lyY2xlKGEsXG5jLGYpO3RoaXMuc2NlbmUuYWRkKGEpO3JldHVybiBhfSxtYWtlRWxsaXBzZTpmdW5jdGlvbihhLGMsZixlKXthPW5ldyBwLkVsbGlwc2UoYSxjLGYsZSk7dGhpcy5zY2VuZS5hZGQoYSk7cmV0dXJuIGF9LG1ha2VTdGFyOmZ1bmN0aW9uKGEsYyxmLGUsZyl7YT1uZXcgcC5TdGFyKGEsYyxmLGUsZyk7dGhpcy5zY2VuZS5hZGQoYSk7cmV0dXJuIGF9LG1ha2VDdXJ2ZTpmdW5jdGlvbihhKXt2YXIgYz1hcmd1bWVudHMubGVuZ3RoLGY9YTtpZighZC5pc0FycmF5KGEpKWZvcih2YXIgZj1bXSxlPTA7ZTxjO2UrPTIpe3ZhciBnPWFyZ3VtZW50c1tlXTtpZighZC5pc051bWJlcihnKSlicmVhaztmLnB1c2gobmV3IHAuQW5jaG9yKGcsYXJndW1lbnRzW2UrMV0pKX1jPWFyZ3VtZW50c1tjLTFdO2Y9bmV3IHAuUGF0aChmLCEoZC5pc0Jvb2xlYW4oYykmJmMpLCEwKTtjPWYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7Zi5jZW50ZXIoKS50cmFuc2xhdGlvbi5zZXQoYy5sZWZ0K2Mud2lkdGgvMixcbmMudG9wK2MuaGVpZ2h0LzIpO3RoaXMuc2NlbmUuYWRkKGYpO3JldHVybiBmfSxtYWtlUG9seWdvbjpmdW5jdGlvbihhLGMsZixlKXthPW5ldyBwLlBvbHlnb24oYSxjLGYsZSk7dGhpcy5zY2VuZS5hZGQoYSk7cmV0dXJuIGF9LG1ha2VBcmNTZWdtZW50OmZ1bmN0aW9uKGEsYyxmLGUsZyxkLG4pe2E9bmV3IHAuQXJjU2VnbWVudChhLGMsZixlLGcsZCxuKTt0aGlzLnNjZW5lLmFkZChhKTtyZXR1cm4gYX0sbWFrZVBhdGg6ZnVuY3Rpb24oYSl7dmFyIGM9YXJndW1lbnRzLmxlbmd0aCxmPWE7aWYoIWQuaXNBcnJheShhKSlmb3IodmFyIGY9W10sZT0wO2U8YztlKz0yKXt2YXIgZz1hcmd1bWVudHNbZV07aWYoIWQuaXNOdW1iZXIoZykpYnJlYWs7Zi5wdXNoKG5ldyBwLkFuY2hvcihnLGFyZ3VtZW50c1tlKzFdKSl9Yz1hcmd1bWVudHNbYy0xXTtmPW5ldyBwLlBhdGgoZiwhKGQuaXNCb29sZWFuKGMpJiZjKSk7Yz1mLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO2YuY2VudGVyKCkudHJhbnNsYXRpb24uc2V0KGMubGVmdCtcbmMud2lkdGgvMixjLnRvcCtjLmhlaWdodC8yKTt0aGlzLnNjZW5lLmFkZChmKTtyZXR1cm4gZn0sbWFrZVRleHQ6ZnVuY3Rpb24oYSxjLGYsZSl7YT1uZXcgcC5UZXh0KGEsYyxmLGUpO3RoaXMuYWRkKGEpO3JldHVybiBhfSxtYWtlTGluZWFyR3JhZGllbnQ6ZnVuY3Rpb24oYSxjLGYsZSl7dmFyIGc9eC5jYWxsKGFyZ3VtZW50cyw0KSxnPW5ldyBwLkxpbmVhckdyYWRpZW50KGEsYyxmLGUsZyk7dGhpcy5hZGQoZyk7cmV0dXJuIGd9LG1ha2VSYWRpYWxHcmFkaWVudDpmdW5jdGlvbihhLGMsZil7dmFyIGU9eC5jYWxsKGFyZ3VtZW50cywzKSxlPW5ldyBwLlJhZGlhbEdyYWRpZW50KGEsYyxmLGUpO3RoaXMuYWRkKGUpO3JldHVybiBlfSxtYWtlU3ByaXRlOmZ1bmN0aW9uKGEsYyxmLGUsZyxkLG4pe2E9bmV3IHAuU3ByaXRlKGEsYyxmLGUsZyxkKTtuJiZhLnBsYXkoKTt0aGlzLmFkZChhKTtyZXR1cm4gYX0sbWFrZUltYWdlU2VxdWVuY2U6ZnVuY3Rpb24oYSxjLGYsZSxnKXthPW5ldyBwLkltYWdlU2VxdWVuY2UoYSxcbmMsZixlKTtnJiZhLnBsYXkoKTt0aGlzLmFkZChhKTtyZXR1cm4gYX0sbWFrZVRleHR1cmU6ZnVuY3Rpb24oYSxjKXtyZXR1cm4gbmV3IHAuVGV4dHVyZShhLGMpfSxtYWtlR3JvdXA6ZnVuY3Rpb24oYSl7dmFyIGM9YTtjIGluc3RhbmNlb2YgQXJyYXl8fChjPWQudG9BcnJheShhcmd1bWVudHMpKTt2YXIgZj1uZXcgcC5Hcm91cDt0aGlzLnNjZW5lLmFkZChmKTtmLmFkZChjKTtyZXR1cm4gZn0saW50ZXJwcmV0OmZ1bmN0aW9uKGEsYyl7dmFyIGY9YS50YWdOYW1lLnRvTG93ZXJDYXNlKCk7aWYoIShmIGluIHAuVXRpbHMucmVhZCkpcmV0dXJuIG51bGw7YT1wLlV0aWxzLnJlYWRbZl0uY2FsbCh0aGlzLGEpO2MmJmEgaW5zdGFuY2VvZiBwLkdyb3VwP3RoaXMuYWRkKGEuY2hpbGRyZW4pOnRoaXMuYWRkKGEpO3JldHVybiBhfSxsb2FkOmZ1bmN0aW9uKGEsYyl7dmFyIGY9W10sZTtpZigvLipcXC5zdmcvaWcudGVzdChhKSlyZXR1cm4gcC5VdGlscy54aHIoYSxkLmJpbmQoZnVuY3Rpb24oYSl7dy50ZW1wLmlubmVySFRNTD1cbmE7Zm9yKGU9MDtlPHcudGVtcC5jaGlsZHJlbi5sZW5ndGg7ZSsrKWc9dy50ZW1wLmNoaWxkcmVuW2VdLGYucHVzaCh0aGlzLmludGVycHJldChnKSk7YygxPj1mLmxlbmd0aD9mWzBdOmYsMT49dy50ZW1wLmNoaWxkcmVuLmxlbmd0aD93LnRlbXAuY2hpbGRyZW5bMF06dy50ZW1wLmNoaWxkcmVuKX0sdGhpcykpLHRoaXM7dy50ZW1wLmlubmVySFRNTD1hO2ZvcihlPTA7ZTx3LnRlbXAuY2hpbGRyZW4ubGVuZ3RoO2UrKyl7dmFyIGc9dy50ZW1wLmNoaWxkcmVuW2VdO2YucHVzaCh0aGlzLmludGVycHJldChnKSl9YygxPj1mLmxlbmd0aD9mWzBdOmYsMT49dy50ZW1wLmNoaWxkcmVuLmxlbmd0aD93LnRlbXAuY2hpbGRyZW5bMF06dy50ZW1wLmNoaWxkcmVuKTtyZXR1cm4gdGhpc319KTt2YXIgTD13LmdldFJlcXVlc3RBbmltYXRpb25GcmFtZSgpO1wiZnVuY3Rpb25cIj09PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFwidHdvXCIsW10sZnVuY3Rpb24oKXtyZXR1cm4gcH0pOlwidW5kZWZpbmVkXCIhPVxudHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJihtb2R1bGUuZXhwb3J0cz1wKTtyZXR1cm4gcH0oKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgZ2xvYmFsP2dsb2JhbDp0aGlzKS5Ud28pOyhmdW5jdGlvbihjKXt2YXIgaz1jLlV0aWxzO2M9Yy5SZWdpc3RyeT1mdW5jdGlvbigpe3RoaXMubWFwPXt9fTtrLmV4dGVuZChjLHt9KTtrLmV4dGVuZChjLnByb3RvdHlwZSx7YWRkOmZ1bmN0aW9uKGMsayl7dGhpcy5tYXBbY109aztyZXR1cm4gdGhpc30scmVtb3ZlOmZ1bmN0aW9uKGMpe2RlbGV0ZSB0aGlzLm1hcFtjXTtyZXR1cm4gdGhpc30sZ2V0OmZ1bmN0aW9uKGMpe3JldHVybiB0aGlzLm1hcFtjXX0sY29udGFpbnM6ZnVuY3Rpb24oYyl7cmV0dXJuIGMgaW4gdGhpcy5tYXB9fSl9KSgoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBnbG9iYWw/Z2xvYmFsOnRoaXMpLlR3byk7XG4oZnVuY3Rpb24oYyl7dmFyIGs9Yy5VdGlscyxtPWMuVmVjdG9yPWZ1bmN0aW9uKGMsYSl7dGhpcy54PWN8fDA7dGhpcy55PWF8fDB9O2suZXh0ZW5kKG0se3plcm86bmV3IGMuVmVjdG9yfSk7ay5leHRlbmQobS5wcm90b3R5cGUsYy5VdGlscy5FdmVudHMse3NldDpmdW5jdGlvbihjLGEpe3RoaXMueD1jO3RoaXMueT1hO3JldHVybiB0aGlzfSxjb3B5OmZ1bmN0aW9uKGMpe3RoaXMueD1jLng7dGhpcy55PWMueTtyZXR1cm4gdGhpc30sY2xlYXI6ZnVuY3Rpb24oKXt0aGlzLnk9dGhpcy54PTA7cmV0dXJuIHRoaXN9LGNsb25lOmZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBtKHRoaXMueCx0aGlzLnkpfSxhZGQ6ZnVuY3Rpb24oYyxhKXt0aGlzLng9Yy54K2EueDt0aGlzLnk9Yy55K2EueTtyZXR1cm4gdGhpc30sYWRkU2VsZjpmdW5jdGlvbihjKXt0aGlzLngrPWMueDt0aGlzLnkrPWMueTtyZXR1cm4gdGhpc30sc3ViOmZ1bmN0aW9uKGMsYSl7dGhpcy54PWMueC1hLng7dGhpcy55PWMueS1cbmEueTtyZXR1cm4gdGhpc30sc3ViU2VsZjpmdW5jdGlvbihjKXt0aGlzLngtPWMueDt0aGlzLnktPWMueTtyZXR1cm4gdGhpc30sbXVsdGlwbHlTZWxmOmZ1bmN0aW9uKGMpe3RoaXMueCo9Yy54O3RoaXMueSo9Yy55O3JldHVybiB0aGlzfSxtdWx0aXBseVNjYWxhcjpmdW5jdGlvbihjKXt0aGlzLngqPWM7dGhpcy55Kj1jO3JldHVybiB0aGlzfSxkaXZpZGVTY2FsYXI6ZnVuY3Rpb24oYyl7Yz8odGhpcy54Lz1jLHRoaXMueS89Yyk6dGhpcy5zZXQoMCwwKTtyZXR1cm4gdGhpc30sbmVnYXRlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubXVsdGlwbHlTY2FsYXIoLTEpfSxkb3Q6ZnVuY3Rpb24oYyl7cmV0dXJuIHRoaXMueCpjLngrdGhpcy55KmMueX0sbGVuZ3RoU3F1YXJlZDpmdW5jdGlvbigpe3JldHVybiB0aGlzLngqdGhpcy54K3RoaXMueSp0aGlzLnl9LGxlbmd0aDpmdW5jdGlvbigpe3JldHVybiBNYXRoLnNxcnQodGhpcy5sZW5ndGhTcXVhcmVkKCkpfSxub3JtYWxpemU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kaXZpZGVTY2FsYXIodGhpcy5sZW5ndGgoKSl9LFxuZGlzdGFuY2VUbzpmdW5jdGlvbihjKXtyZXR1cm4gTWF0aC5zcXJ0KHRoaXMuZGlzdGFuY2VUb1NxdWFyZWQoYykpfSxkaXN0YW5jZVRvU3F1YXJlZDpmdW5jdGlvbihjKXt2YXIgYT10aGlzLngtYy54O2M9dGhpcy55LWMueTtyZXR1cm4gYSphK2MqY30sc2V0TGVuZ3RoOmZ1bmN0aW9uKGMpe3JldHVybiB0aGlzLm5vcm1hbGl6ZSgpLm11bHRpcGx5U2NhbGFyKGMpfSxlcXVhbHM6ZnVuY3Rpb24oYyxhKXthPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYT8uMDAwMTphO3JldHVybiB0aGlzLmRpc3RhbmNlVG8oYyk8YX0sbGVycDpmdW5jdGlvbihjLGEpe3JldHVybiB0aGlzLnNldCgoYy54LXRoaXMueCkqYSt0aGlzLngsKGMueS10aGlzLnkpKmErdGhpcy55KX0saXNaZXJvOmZ1bmN0aW9uKGMpe2M9XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBjPy4wMDAxOmM7cmV0dXJuIHRoaXMubGVuZ3RoKCk8Y30sdG9TdHJpbmc6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy54K1wiLCBcIit0aGlzLnl9LHRvT2JqZWN0OmZ1bmN0aW9uKCl7cmV0dXJue3g6dGhpcy54LFxueTp0aGlzLnl9fSxyb3RhdGU6ZnVuY3Rpb24oYyl7dmFyIGE9TWF0aC5jb3MoYyk7Yz1NYXRoLnNpbihjKTt0aGlzLng9dGhpcy54KmEtdGhpcy55KmM7dGhpcy55PXRoaXMueCpjK3RoaXMueSphO3JldHVybiB0aGlzfX0pO3ZhciBsPXtzZXQ6ZnVuY3Rpb24oZSxhKXt0aGlzLl94PWU7dGhpcy5feT1hO3JldHVybiB0aGlzLnRyaWdnZXIoYy5FdmVudHMuY2hhbmdlKX0sY29weTpmdW5jdGlvbihlKXt0aGlzLl94PWUueDt0aGlzLl95PWUueTtyZXR1cm4gdGhpcy50cmlnZ2VyKGMuRXZlbnRzLmNoYW5nZSl9LGNsZWFyOmZ1bmN0aW9uKCl7dGhpcy5feT10aGlzLl94PTA7cmV0dXJuIHRoaXMudHJpZ2dlcihjLkV2ZW50cy5jaGFuZ2UpfSxjbG9uZTpmdW5jdGlvbigpe3JldHVybiBuZXcgbSh0aGlzLl94LHRoaXMuX3kpfSxhZGQ6ZnVuY3Rpb24oZSxhKXt0aGlzLl94PWUueCthLng7dGhpcy5feT1lLnkrYS55O3JldHVybiB0aGlzLnRyaWdnZXIoYy5FdmVudHMuY2hhbmdlKX0sYWRkU2VsZjpmdW5jdGlvbihlKXt0aGlzLl94Kz1cbmUueDt0aGlzLl95Kz1lLnk7cmV0dXJuIHRoaXMudHJpZ2dlcihjLkV2ZW50cy5jaGFuZ2UpfSxzdWI6ZnVuY3Rpb24oZSxhKXt0aGlzLl94PWUueC1hLng7dGhpcy5feT1lLnktYS55O3JldHVybiB0aGlzLnRyaWdnZXIoYy5FdmVudHMuY2hhbmdlKX0sc3ViU2VsZjpmdW5jdGlvbihlKXt0aGlzLl94LT1lLng7dGhpcy5feS09ZS55O3JldHVybiB0aGlzLnRyaWdnZXIoYy5FdmVudHMuY2hhbmdlKX0sbXVsdGlwbHlTZWxmOmZ1bmN0aW9uKGUpe3RoaXMuX3gqPWUueDt0aGlzLl95Kj1lLnk7cmV0dXJuIHRoaXMudHJpZ2dlcihjLkV2ZW50cy5jaGFuZ2UpfSxtdWx0aXBseVNjYWxhcjpmdW5jdGlvbihlKXt0aGlzLl94Kj1lO3RoaXMuX3kqPWU7cmV0dXJuIHRoaXMudHJpZ2dlcihjLkV2ZW50cy5jaGFuZ2UpfSxkaXZpZGVTY2FsYXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGU/KHRoaXMuX3gvPWUsdGhpcy5feS89ZSx0aGlzLnRyaWdnZXIoYy5FdmVudHMuY2hhbmdlKSk6dGhpcy5jbGVhcigpfSxcbm5lZ2F0ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLm11bHRpcGx5U2NhbGFyKC0xKX0sZG90OmZ1bmN0aW9uKGMpe3JldHVybiB0aGlzLl94KmMueCt0aGlzLl95KmMueX0sbGVuZ3RoU3F1YXJlZDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl94KnRoaXMuX3grdGhpcy5feSp0aGlzLl95fSxsZW5ndGg6ZnVuY3Rpb24oKXtyZXR1cm4gTWF0aC5zcXJ0KHRoaXMubGVuZ3RoU3F1YXJlZCgpKX0sbm9ybWFsaXplOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZGl2aWRlU2NhbGFyKHRoaXMubGVuZ3RoKCkpfSxkaXN0YW5jZVRvOmZ1bmN0aW9uKGMpe3JldHVybiBNYXRoLnNxcnQodGhpcy5kaXN0YW5jZVRvU3F1YXJlZChjKSl9LGRpc3RhbmNlVG9TcXVhcmVkOmZ1bmN0aW9uKGMpe3ZhciBhPXRoaXMuX3gtYy54O2M9dGhpcy5feS1jLnk7cmV0dXJuIGEqYStjKmN9LHNldExlbmd0aDpmdW5jdGlvbihjKXtyZXR1cm4gdGhpcy5ub3JtYWxpemUoKS5tdWx0aXBseVNjYWxhcihjKX0sZXF1YWxzOmZ1bmN0aW9uKGMsXG5hKXthPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYT8uMDAwMTphO3JldHVybiB0aGlzLmRpc3RhbmNlVG8oYyk8YX0sbGVycDpmdW5jdGlvbihjLGEpe3JldHVybiB0aGlzLnNldCgoYy54LXRoaXMuX3gpKmErdGhpcy5feCwoYy55LXRoaXMuX3kpKmErdGhpcy5feSl9LGlzWmVybzpmdW5jdGlvbihjKXtjPVwidW5kZWZpbmVkXCI9PT10eXBlb2YgYz8uMDAwMTpjO3JldHVybiB0aGlzLmxlbmd0aCgpPGN9LHRvU3RyaW5nOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3grXCIsIFwiK3RoaXMuX3l9LHRvT2JqZWN0OmZ1bmN0aW9uKCl7cmV0dXJue3g6dGhpcy5feCx5OnRoaXMuX3l9fSxyb3RhdGU6ZnVuY3Rpb24oYyl7dmFyIGE9TWF0aC5jb3MoYyk7Yz1NYXRoLnNpbihjKTt0aGlzLl94PXRoaXMuX3gqYS10aGlzLl95KmM7dGhpcy5feT10aGlzLl94KmMrdGhpcy5feSphO3JldHVybiB0aGlzfX0saD17ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5feH0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3g9XG5lO3RoaXMudHJpZ2dlcihjLkV2ZW50cy5jaGFuZ2UsXCJ4XCIpfX0sZD17ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5feX0sc2V0OmZ1bmN0aW9uKGUpe3RoaXMuX3k9ZTt0aGlzLnRyaWdnZXIoYy5FdmVudHMuY2hhbmdlLFwieVwiKX19O2MuVmVjdG9yLnByb3RvdHlwZS5iaW5kPWMuVmVjdG9yLnByb3RvdHlwZS5vbj1mdW5jdGlvbigpe3RoaXMuX2JvdW5kfHwodGhpcy5feD10aGlzLngsdGhpcy5feT10aGlzLnksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJ4XCIsaCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJ5XCIsZCksay5leHRlbmQodGhpcyxsKSx0aGlzLl9ib3VuZD0hMCk7Yy5VdGlscy5FdmVudHMuYmluZC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7cmV0dXJuIHRoaXN9fSkoKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgZ2xvYmFsP2dsb2JhbDp0aGlzKS5Ud28pO1xuKGZ1bmN0aW9uKGMpe3ZhciBrPWMuQ29tbWFuZHMsbT1jLlV0aWxzLGw9Yy5BbmNob3I9ZnVuY3Rpb24oZCxlLGEsZyxuLGYsdCl7Yy5WZWN0b3IuY2FsbCh0aGlzLGQsZSk7dGhpcy5fYnJvYWRjYXN0PW0uYmluZChmdW5jdGlvbigpe3RoaXMudHJpZ2dlcihjLkV2ZW50cy5jaGFuZ2UpfSx0aGlzKTt0aGlzLl9jb21tYW5kPXR8fGsubW92ZTt0aGlzLl9yZWxhdGl2ZT0hMDtpZighdClyZXR1cm4gdGhpcztsLkFwcGVuZEN1cnZlUHJvcGVydGllcyh0aGlzKTttLmlzTnVtYmVyKGEpJiYodGhpcy5jb250cm9scy5sZWZ0Lng9YSk7bS5pc051bWJlcihnKSYmKHRoaXMuY29udHJvbHMubGVmdC55PWcpO20uaXNOdW1iZXIobikmJih0aGlzLmNvbnRyb2xzLnJpZ2h0Lng9bik7bS5pc051bWJlcihmKSYmKHRoaXMuY29udHJvbHMucmlnaHQueT1mKX07bS5leHRlbmQobCx7QXBwZW5kQ3VydmVQcm9wZXJ0aWVzOmZ1bmN0aW9uKGQpe2QuY29udHJvbHM9e2xlZnQ6bmV3IGMuVmVjdG9yKDAsXG4wKSxyaWdodDpuZXcgYy5WZWN0b3IoMCwwKX19fSk7dmFyIGg9e2xpc3RlbjpmdW5jdGlvbigpe20uaXNPYmplY3QodGhpcy5jb250cm9scyl8fGwuQXBwZW5kQ3VydmVQcm9wZXJ0aWVzKHRoaXMpO3RoaXMuY29udHJvbHMubGVmdC5iaW5kKGMuRXZlbnRzLmNoYW5nZSx0aGlzLl9icm9hZGNhc3QpO3RoaXMuY29udHJvbHMucmlnaHQuYmluZChjLkV2ZW50cy5jaGFuZ2UsdGhpcy5fYnJvYWRjYXN0KTtyZXR1cm4gdGhpc30saWdub3JlOmZ1bmN0aW9uKCl7dGhpcy5jb250cm9scy5sZWZ0LnVuYmluZChjLkV2ZW50cy5jaGFuZ2UsdGhpcy5fYnJvYWRjYXN0KTt0aGlzLmNvbnRyb2xzLnJpZ2h0LnVuYmluZChjLkV2ZW50cy5jaGFuZ2UsdGhpcy5fYnJvYWRjYXN0KTtyZXR1cm4gdGhpc30sY2xvbmU6ZnVuY3Rpb24oKXt2YXIgZD10aGlzLmNvbnRyb2xzLGQ9bmV3IGMuQW5jaG9yKHRoaXMueCx0aGlzLnksZCYmZC5sZWZ0LngsZCYmZC5sZWZ0LnksZCYmZC5yaWdodC54LGQmJmQucmlnaHQueSxcbnRoaXMuY29tbWFuZCk7ZC5yZWxhdGl2ZT10aGlzLl9yZWxhdGl2ZTtyZXR1cm4gZH0sdG9PYmplY3Q6ZnVuY3Rpb24oKXt2YXIgYz17eDp0aGlzLngseTp0aGlzLnl9O3RoaXMuX2NvbW1hbmQmJihjLmNvbW1hbmQ9dGhpcy5fY29tbWFuZCk7dGhpcy5fcmVsYXRpdmUmJihjLnJlbGF0aXZlPXRoaXMuX3JlbGF0aXZlKTt0aGlzLmNvbnRyb2xzJiYoYy5jb250cm9scz17bGVmdDp0aGlzLmNvbnRyb2xzLmxlZnQudG9PYmplY3QoKSxyaWdodDp0aGlzLmNvbnRyb2xzLnJpZ2h0LnRvT2JqZWN0KCl9KTtyZXR1cm4gY30sdG9TdHJpbmc6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb250cm9scz9bdGhpcy5feCx0aGlzLl95LHRoaXMuY29udHJvbHMubGVmdC54LHRoaXMuY29udHJvbHMubGVmdC55LHRoaXMuY29udHJvbHMucmlnaHQueCx0aGlzLmNvbnRyb2xzLnJpZ2h0LnldLmpvaW4oXCIsIFwiKTpbdGhpcy5feCx0aGlzLl95XS5qb2luKFwiLCBcIil9fTtPYmplY3QuZGVmaW5lUHJvcGVydHkobC5wcm90b3R5cGUsXG5cImNvbW1hbmRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29tbWFuZH0sc2V0OmZ1bmN0aW9uKGQpe3RoaXMuX2NvbW1hbmQ9ZDt0aGlzLl9jb21tYW5kIT09ay5jdXJ2ZXx8bS5pc09iamVjdCh0aGlzLmNvbnRyb2xzKXx8bC5BcHBlbmRDdXJ2ZVByb3BlcnRpZXModGhpcyk7cmV0dXJuIHRoaXMudHJpZ2dlcihjLkV2ZW50cy5jaGFuZ2UpfX0pO09iamVjdC5kZWZpbmVQcm9wZXJ0eShsLnByb3RvdHlwZSxcInJlbGF0aXZlXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3JlbGF0aXZlfSxzZXQ6ZnVuY3Rpb24oZCl7aWYodGhpcy5fcmVsYXRpdmU9PWQpcmV0dXJuIHRoaXM7dGhpcy5fcmVsYXRpdmU9ISFkO3JldHVybiB0aGlzLnRyaWdnZXIoYy5FdmVudHMuY2hhbmdlKX19KTttLmV4dGVuZChsLnByb3RvdHlwZSxjLlZlY3Rvci5wcm90b3R5cGUsaCk7Yy5BbmNob3IucHJvdG90eXBlLmJpbmQ9Yy5BbmNob3IucHJvdG90eXBlLm9uPVxuZnVuY3Rpb24oKXtjLlZlY3Rvci5wcm90b3R5cGUuYmluZC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7bS5leHRlbmQodGhpcyxoKX07Yy5BbmNob3IucHJvdG90eXBlLnVuYmluZD1jLkFuY2hvci5wcm90b3R5cGUub2ZmPWZ1bmN0aW9uKCl7Yy5WZWN0b3IucHJvdG90eXBlLnVuYmluZC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7bS5leHRlbmQodGhpcyxoKX19KSgoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBnbG9iYWw/Z2xvYmFsOnRoaXMpLlR3byk7XG4oZnVuY3Rpb24oYyl7dmFyIGs9TWF0aC5jb3MsbT1NYXRoLnNpbixsPU1hdGgudGFuLGg9Yy5VdGlscyxkPWMuTWF0cml4PWZ1bmN0aW9uKGUsYSxnLGQsZix0KXt0aGlzLmVsZW1lbnRzPW5ldyBjLkFycmF5KDkpO3ZhciBuPWU7aC5pc0FycmF5KG4pfHwobj1oLnRvQXJyYXkoYXJndW1lbnRzKSk7dGhpcy5pZGVudGl0eSgpLnNldChuKX07aC5leHRlbmQoZCx7SWRlbnRpdHk6WzEsMCwwLDAsMSwwLDAsMCwxXSxNdWx0aXBseTpmdW5jdGlvbihlLGEsZyl7aWYoMz49YS5sZW5ndGgpe2c9YVswXXx8MDt2YXIgZD1hWzFdfHwwO2E9YVsyXXx8MDtyZXR1cm57eDplWzBdKmcrZVsxXSpkK2VbMl0qYSx5OmVbM10qZytlWzRdKmQrZVs1XSphLHo6ZVs2XSpnK2VbN10qZCtlWzhdKmF9fXZhciBkPWVbMF0sZj1lWzFdLHQ9ZVsyXSx2PWVbM10saD1lWzRdLGs9ZVs1XSxtPWVbNl0sbD1lWzddO2U9ZVs4XTt2YXIgdT1hWzBdLHI9YVsxXSxxPWFbMl0sdz1hWzNdLHA9YVs0XSxDPWFbNV0sRT1cbmFbNl0sSD1hWzddO2E9YVs4XTtnPWd8fG5ldyBjLkFycmF5KDkpO2dbMF09ZCp1K2Yqdyt0KkU7Z1sxXT1kKnIrZipwK3QqSDtnWzJdPWQqcStmKkMrdCphO2dbM109dip1K2gqdytrKkU7Z1s0XT12KnIraCpwK2sqSDtnWzVdPXYqcStoKkMrayphO2dbNl09bSp1K2wqdytlKkU7Z1s3XT1tKnIrbCpwK2UqSDtnWzhdPW0qcStsKkMrZSphO3JldHVybiBnfX0pO2guZXh0ZW5kKGQucHJvdG90eXBlLGMuVXRpbHMuRXZlbnRzLHtzZXQ6ZnVuY3Rpb24oZSl7dmFyIGE9ZTtoLmlzQXJyYXkoYSl8fChhPWgudG9BcnJheShhcmd1bWVudHMpKTtoLmV4dGVuZCh0aGlzLmVsZW1lbnRzLGEpO3JldHVybiB0aGlzLnRyaWdnZXIoYy5FdmVudHMuY2hhbmdlKX0saWRlbnRpdHk6ZnVuY3Rpb24oKXt0aGlzLnNldChkLklkZW50aXR5KTtyZXR1cm4gdGhpc30sbXVsdGlwbHk6ZnVuY3Rpb24oZSxhLGcsZCxmLHQsdixrLG0pe3ZhciBuPWFyZ3VtZW50cyxCPW4ubGVuZ3RoO2lmKDE+PUIpcmV0dXJuIGguZWFjaCh0aGlzLmVsZW1lbnRzLFxuZnVuY3Rpb24oYSxjKXt0aGlzLmVsZW1lbnRzW2NdPWEqZX0sdGhpcyksdGhpcy50cmlnZ2VyKGMuRXZlbnRzLmNoYW5nZSk7aWYoMz49QilyZXR1cm4gZT1lfHwwLGE9YXx8MCxnPWd8fDAsZj10aGlzLmVsZW1lbnRzLHt4OmZbMF0qZStmWzFdKmErZlsyXSpnLHk6ZlszXSplK2ZbNF0qYStmWzVdKmcsejpmWzZdKmUrZls3XSphK2ZbOF0qZ307dmFyIGw9dGhpcy5lbGVtZW50cyxCPWxbMF0sej1sWzFdLHE9bFsyXSx3PWxbM10scD1sWzRdLEM9bFs1XSxFPWxbNl0sSD1sWzddLGw9bFs4XSxHPW5bMF0sRj1uWzFdLEk9blsyXSxPPW5bM10sTj1uWzRdLFA9bls1XSxNPW5bNl0sTD1uWzddLG49bls4XTt0aGlzLmVsZW1lbnRzWzBdPUIqRyt6Kk8rcSpNO3RoaXMuZWxlbWVudHNbMV09QipGK3oqTitxKkw7dGhpcy5lbGVtZW50c1syXT1CKkkreipQK3Eqbjt0aGlzLmVsZW1lbnRzWzNdPXcqRytwKk8rQypNO3RoaXMuZWxlbWVudHNbNF09dypGK3AqTitDKkw7dGhpcy5lbGVtZW50c1s1XT1cbncqSStwKlArQypuO3RoaXMuZWxlbWVudHNbNl09RSpHK0gqTytsKk07dGhpcy5lbGVtZW50c1s3XT1FKkYrSCpOK2wqTDt0aGlzLmVsZW1lbnRzWzhdPUUqSStIKlArbCpuO3JldHVybiB0aGlzLnRyaWdnZXIoYy5FdmVudHMuY2hhbmdlKX0saW52ZXJzZTpmdW5jdGlvbihlKXt2YXIgYT10aGlzLmVsZW1lbnRzO2U9ZXx8bmV3IGMuTWF0cml4O3ZhciBnPWFbMF0sZD1hWzFdLGY9YVsyXSx0PWFbM10sdj1hWzRdLGg9YVs1XSxrPWFbNl0sbD1hWzddLGE9YVs4XSxtPWEqdi1oKmwsdT0tYSp0K2gqayxyPWwqdC12KmsscT1nKm0rZCp1K2YqcjtpZighcSlyZXR1cm4gbnVsbDtxPTEvcTtlLmVsZW1lbnRzWzBdPW0qcTtlLmVsZW1lbnRzWzFdPSgtYSpkK2YqbCkqcTtlLmVsZW1lbnRzWzJdPShoKmQtZip2KSpxO2UuZWxlbWVudHNbM109dSpxO2UuZWxlbWVudHNbNF09KGEqZy1mKmspKnE7ZS5lbGVtZW50c1s1XT0oLWgqZytmKnQpKnE7ZS5lbGVtZW50c1s2XT1yKnE7ZS5lbGVtZW50c1s3XT1cbigtbCpnK2QqaykqcTtlLmVsZW1lbnRzWzhdPSh2KmctZCp0KSpxO3JldHVybiBlfSxzY2FsZTpmdW5jdGlvbihjLGEpezE+PWFyZ3VtZW50cy5sZW5ndGgmJihhPWMpO3JldHVybiB0aGlzLm11bHRpcGx5KGMsMCwwLDAsYSwwLDAsMCwxKX0scm90YXRlOmZ1bmN0aW9uKGMpe3ZhciBhPWsoYyk7Yz1tKGMpO3JldHVybiB0aGlzLm11bHRpcGx5KGEsLWMsMCxjLGEsMCwwLDAsMSl9LHRyYW5zbGF0ZTpmdW5jdGlvbihjLGEpe3JldHVybiB0aGlzLm11bHRpcGx5KDEsMCxjLDAsMSxhLDAsMCwxKX0sc2tld1g6ZnVuY3Rpb24oYyl7Yz1sKGMpO3JldHVybiB0aGlzLm11bHRpcGx5KDEsYywwLDAsMSwwLDAsMCwxKX0sc2tld1k6ZnVuY3Rpb24oYyl7Yz1sKGMpO3JldHVybiB0aGlzLm11bHRpcGx5KDEsMCwwLGMsMSwwLDAsMCwxKX0sdG9TdHJpbmc6ZnVuY3Rpb24oYyl7dmFyIGE9W107dGhpcy50b0FycmF5KGMsYSk7cmV0dXJuIGEuam9pbihcIiBcIil9LHRvQXJyYXk6ZnVuY3Rpb24oYyxhKXt2YXIgZz1cbnRoaXMuZWxlbWVudHMsZT0hIWEsZj1wYXJzZUZsb2F0KGdbMF0udG9GaXhlZCgzKSksZD1wYXJzZUZsb2F0KGdbMV0udG9GaXhlZCgzKSksdj1wYXJzZUZsb2F0KGdbMl0udG9GaXhlZCgzKSksaD1wYXJzZUZsb2F0KGdbM10udG9GaXhlZCgzKSksaz1wYXJzZUZsb2F0KGdbNF0udG9GaXhlZCgzKSksbD1wYXJzZUZsb2F0KGdbNV0udG9GaXhlZCgzKSk7aWYoYyl7Yz1wYXJzZUZsb2F0KGdbNl0udG9GaXhlZCgzKSk7dmFyIG09cGFyc2VGbG9hdChnWzddLnRvRml4ZWQoMykpLGc9cGFyc2VGbG9hdChnWzhdLnRvRml4ZWQoMykpO2lmKGUpe2FbMF09ZjthWzFdPWg7YVsyXT1jO2FbM109ZDthWzRdPWs7YVs1XT1tO2FbNl09djthWzddPWw7YVs4XT1nO3JldHVybn1yZXR1cm5bZixoLGMsZCxrLG0sdixsLGddfWlmKGUpYVswXT1mLGFbMV09aCxhWzJdPWQsYVszXT1rLGFbNF09dixhWzVdPWw7ZWxzZSByZXR1cm5bZixoLGQsayx2LGxdfSxjbG9uZTpmdW5jdGlvbigpe3ZhciBlPXRoaXMuZWxlbWVudHNbMF07XG52YXIgYT10aGlzLmVsZW1lbnRzWzFdO3ZhciBnPXRoaXMuZWxlbWVudHNbMl07dmFyIGQ9dGhpcy5lbGVtZW50c1szXTt2YXIgZj10aGlzLmVsZW1lbnRzWzRdO3JldHVybiBuZXcgYy5NYXRyaXgoZSxhLGcsZCxmLHRoaXMuZWxlbWVudHNbNV0sdGhpcy5lbGVtZW50c1s2XSx0aGlzLmVsZW1lbnRzWzddLHRoaXMuZWxlbWVudHNbOF0pfX0pfSkoKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgZ2xvYmFsP2dsb2JhbDp0aGlzKS5Ud28pO1xuKGZ1bmN0aW9uKGMpe3ZhciBrPWMuVXRpbHMubW9kLG09Yy5VdGlscy50b0ZpeGVkLGw9Yy5VdGlscyxoPXt2ZXJzaW9uOjEuMSxuczpcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIseGxpbms6XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsYWxpZ25tZW50czp7bGVmdDpcInN0YXJ0XCIsY2VudGVyOlwibWlkZGxlXCIscmlnaHQ6XCJlbmRcIn0sY3JlYXRlRWxlbWVudDpmdW5jdGlvbihjLGEpe3ZhciBnPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhoLm5zLGMpO1wic3ZnXCI9PT1jJiYoYT1sLmRlZmF1bHRzKGF8fHt9LHt2ZXJzaW9uOmgudmVyc2lvbn0pKTtsLmlzRW1wdHkoYSl8fGguc2V0QXR0cmlidXRlcyhnLGEpO3JldHVybiBnfSxzZXRBdHRyaWJ1dGVzOmZ1bmN0aW9uKGMsYSl7Zm9yKHZhciBnPU9iamVjdC5rZXlzKGEpLGU9MDtlPGcubGVuZ3RoO2UrKykvaHJlZi8udGVzdChnW2VdKT9jLnNldEF0dHJpYnV0ZU5TKGgueGxpbmssZ1tlXSxhW2dbZV1dKTpjLnNldEF0dHJpYnV0ZShnW2VdLFxuYVtnW2VdXSk7cmV0dXJuIHRoaXN9LHJlbW92ZUF0dHJpYnV0ZXM6ZnVuY3Rpb24oYyxhKXtmb3IodmFyIGcgaW4gYSljLnJlbW92ZUF0dHJpYnV0ZShnKTtyZXR1cm4gdGhpc30sdG9TdHJpbmc6ZnVuY3Rpb24oZSxhKXtmb3IodmFyIGc9ZS5sZW5ndGgsZD1nLTEsZix0PVwiXCIsaD0wO2g8ZztoKyspe3ZhciBsPWVbaF0sej1hP2soaC0xLGcpOk1hdGgubWF4KGgtMSwwKTthJiZrKGgrMSxnKTt2YXIgQT1lW3pdO3ZhciB4PW0obC5feCk7dmFyIHU9bShsLl95KTtzd2l0Y2gobC5fY29tbWFuZCl7Y2FzZSBjLkNvbW1hbmRzLmNsb3NlOnZhciByPWMuQ29tbWFuZHMuY2xvc2U7YnJlYWs7Y2FzZSBjLkNvbW1hbmRzLmN1cnZlOnZhciBxPUEuY29udHJvbHMmJkEuY29udHJvbHMucmlnaHR8fGMuVmVjdG9yLnplcm87cj1sLmNvbnRyb2xzJiZsLmNvbnRyb2xzLmxlZnR8fGMuVmVjdG9yLnplcm87QS5fcmVsYXRpdmU/KHo9bShxLngrQS54KSxBPW0ocS55K0EueSkpOih6PW0ocS54KSxBPW0ocS55KSk7XG5pZihsLl9yZWxhdGl2ZSl7cT1tKHIueCtsLngpO3ZhciB3PW0oci55K2wueSl9ZWxzZSBxPW0oci54KSx3PW0oci55KTtyPSgwPT09aD9jLkNvbW1hbmRzLm1vdmU6Yy5Db21tYW5kcy5jdXJ2ZSkrXCIgXCIreitcIiBcIitBK1wiIFwiK3ErXCIgXCIrdytcIiBcIit4K1wiIFwiK3U7YnJlYWs7Y2FzZSBjLkNvbW1hbmRzLm1vdmU6Zj1sO3I9Yy5Db21tYW5kcy5tb3ZlK1wiIFwiK3grXCIgXCIrdTticmVhaztkZWZhdWx0OnI9bC5fY29tbWFuZCtcIiBcIit4K1wiIFwiK3V9aD49ZCYmYSYmKGwuX2NvbW1hbmQ9PT1jLkNvbW1hbmRzLmN1cnZlJiYodT1mLEE9bC5jb250cm9scyYmbC5jb250cm9scy5yaWdodHx8bCx4PXUuY29udHJvbHMmJnUuY29udHJvbHMubGVmdHx8dSxsLl9yZWxhdGl2ZT8oej1tKEEueCtsLngpLEE9bShBLnkrbC55KSk6KHo9bShBLngpLEE9bShBLnkpKSx1Ll9yZWxhdGl2ZT8ocT1tKHgueCt1LngpLHc9bSh4LnkrdS55KSk6KHE9bSh4LngpLHc9bSh4LnkpKSx4PW0odS54KSx1PW0odS55KSxyKz1cblwiIEMgXCIreitcIiBcIitBK1wiIFwiK3ErXCIgXCIrdytcIiBcIit4K1wiIFwiK3UpLHIrPVwiIFpcIik7dCs9citcIiBcIn1yZXR1cm4gdH0sZ2V0Q2xpcDpmdW5jdGlvbihjKXt2YXIgYT1jLl9yZW5kZXJlci5jbGlwO2lmKCFhKXtmb3IodmFyIGc9YztnLnBhcmVudDspZz1nLnBhcmVudDthPWMuX3JlbmRlcmVyLmNsaXA9aC5jcmVhdGVFbGVtZW50KFwiY2xpcFBhdGhcIik7Zy5kZWZzLmFwcGVuZENoaWxkKGEpfXJldHVybiBhfSxncm91cDp7YXBwZW5kQ2hpbGQ6ZnVuY3Rpb24oYyl7dmFyIGE9Yy5fcmVuZGVyZXIuZWxlbTtpZihhKXt2YXIgZz1hLm5vZGVOYW1lOyFnfHwvKHJhZGlhbHxsaW5lYXIpZ3JhZGllbnQvaS50ZXN0KGcpfHxjLl9jbGlwfHx0aGlzLmVsZW0uYXBwZW5kQ2hpbGQoYSl9fSxyZW1vdmVDaGlsZDpmdW5jdGlvbihjKXt2YXIgYT1jLl9yZW5kZXJlci5lbGVtO2EmJmEucGFyZW50Tm9kZT09dGhpcy5lbGVtJiZhLm5vZGVOYW1lJiYoYy5fY2xpcHx8dGhpcy5lbGVtLnJlbW92ZUNoaWxkKGEpKX0sXG5vcmRlckNoaWxkOmZ1bmN0aW9uKGMpe3RoaXMuZWxlbS5hcHBlbmRDaGlsZChjLl9yZW5kZXJlci5lbGVtKX0scmVuZGVyQ2hpbGQ6ZnVuY3Rpb24oYyl7aFtjLl9yZW5kZXJlci50eXBlXS5yZW5kZXIuY2FsbChjLHRoaXMpfSxyZW5kZXI6ZnVuY3Rpb24oYyl7dGhpcy5fdXBkYXRlKCk7aWYoMD09PXRoaXMuX29wYWNpdHkmJiF0aGlzLl9mbGFnT3BhY2l0eSlyZXR1cm4gdGhpczt0aGlzLl9yZW5kZXJlci5lbGVtfHwodGhpcy5fcmVuZGVyZXIuZWxlbT1oLmNyZWF0ZUVsZW1lbnQoXCJnXCIse2lkOnRoaXMuaWR9KSxjLmFwcGVuZENoaWxkKHRoaXMuX3JlbmRlcmVyLmVsZW0pKTt2YXIgYT17ZG9tRWxlbWVudDpjLGVsZW06dGhpcy5fcmVuZGVyZXIuZWxlbX07KHRoaXMuX21hdHJpeC5tYW51YWx8fHRoaXMuX2ZsYWdNYXRyaXgpJiZ0aGlzLl9yZW5kZXJlci5lbGVtLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLFwibWF0cml4KFwiK3RoaXMuX21hdHJpeC50b1N0cmluZygpK1wiKVwiKTtmb3IodmFyIGc9XG4wO2c8dGhpcy5jaGlsZHJlbi5sZW5ndGg7ZysrKXt2YXIgZT10aGlzLmNoaWxkcmVuW2ddO2hbZS5fcmVuZGVyZXIudHlwZV0ucmVuZGVyLmNhbGwoZSxjKX10aGlzLl9mbGFnT3BhY2l0eSYmdGhpcy5fcmVuZGVyZXIuZWxlbS5zZXRBdHRyaWJ1dGUoXCJvcGFjaXR5XCIsdGhpcy5fb3BhY2l0eSk7dGhpcy5fZmxhZ0FkZGl0aW9ucyYmdGhpcy5hZGRpdGlvbnMuZm9yRWFjaChoLmdyb3VwLmFwcGVuZENoaWxkLGEpO3RoaXMuX2ZsYWdTdWJ0cmFjdGlvbnMmJnRoaXMuc3VidHJhY3Rpb25zLmZvckVhY2goaC5ncm91cC5yZW1vdmVDaGlsZCxhKTt0aGlzLl9mbGFnT3JkZXImJnRoaXMuY2hpbGRyZW4uZm9yRWFjaChoLmdyb3VwLm9yZGVyQ2hpbGQsYSk7dGhpcy5fZmxhZ01hc2smJih0aGlzLl9tYXNrP3RoaXMuX3JlbmRlcmVyLmVsZW0uc2V0QXR0cmlidXRlKFwiY2xpcC1wYXRoXCIsXCJ1cmwoI1wiK3RoaXMuX21hc2suaWQrXCIpXCIpOnRoaXMuX3JlbmRlcmVyLmVsZW0ucmVtb3ZlQXR0cmlidXRlKFwiY2xpcC1wYXRoXCIpKTtcbnJldHVybiB0aGlzLmZsYWdSZXNldCgpfX0scGF0aDp7cmVuZGVyOmZ1bmN0aW9uKGMpe3RoaXMuX3VwZGF0ZSgpO2lmKDA9PT10aGlzLl9vcGFjaXR5JiYhdGhpcy5fZmxhZ09wYWNpdHkpcmV0dXJuIHRoaXM7dmFyIGE9e307aWYodGhpcy5fbWF0cml4Lm1hbnVhbHx8dGhpcy5fZmxhZ01hdHJpeClhLnRyYW5zZm9ybT1cIm1hdHJpeChcIit0aGlzLl9tYXRyaXgudG9TdHJpbmcoKStcIilcIjtpZih0aGlzLl9mbGFnVmVydGljZXMpe3ZhciBnPWgudG9TdHJpbmcodGhpcy5fdmVydGljZXMsdGhpcy5fY2xvc2VkKTthLmQ9Z310aGlzLl9maWxsJiZ0aGlzLl9maWxsLl9yZW5kZXJlciYmKHRoaXMuX2ZpbGwuX3VwZGF0ZSgpLGhbdGhpcy5fZmlsbC5fcmVuZGVyZXIudHlwZV0ucmVuZGVyLmNhbGwodGhpcy5fZmlsbCxjLCEwKSk7dGhpcy5fZmxhZ0ZpbGwmJihhLmZpbGw9dGhpcy5fZmlsbCYmdGhpcy5fZmlsbC5pZD9cInVybCgjXCIrdGhpcy5fZmlsbC5pZCtcIilcIjp0aGlzLl9maWxsKTt0aGlzLl9zdHJva2UmJlxudGhpcy5fc3Ryb2tlLl9yZW5kZXJlciYmKHRoaXMuX3N0cm9rZS5fdXBkYXRlKCksaFt0aGlzLl9zdHJva2UuX3JlbmRlcmVyLnR5cGVdLnJlbmRlci5jYWxsKHRoaXMuX3N0cm9rZSxjLCEwKSk7dGhpcy5fZmxhZ1N0cm9rZSYmKGEuc3Ryb2tlPXRoaXMuX3N0cm9rZSYmdGhpcy5fc3Ryb2tlLmlkP1widXJsKCNcIit0aGlzLl9zdHJva2UuaWQrXCIpXCI6dGhpcy5fc3Ryb2tlKTt0aGlzLl9mbGFnTGluZXdpZHRoJiYoYVtcInN0cm9rZS13aWR0aFwiXT10aGlzLl9saW5ld2lkdGgpO3RoaXMuX2ZsYWdPcGFjaXR5JiYoYVtcInN0cm9rZS1vcGFjaXR5XCJdPXRoaXMuX29wYWNpdHksYVtcImZpbGwtb3BhY2l0eVwiXT10aGlzLl9vcGFjaXR5KTt0aGlzLl9mbGFnVmlzaWJsZSYmKGEudmlzaWJpbGl0eT10aGlzLl92aXNpYmxlP1widmlzaWJsZVwiOlwiaGlkZGVuXCIpO3RoaXMuX2ZsYWdDYXAmJihhW1wic3Ryb2tlLWxpbmVjYXBcIl09dGhpcy5fY2FwKTt0aGlzLl9mbGFnSm9pbiYmKGFbXCJzdHJva2UtbGluZWpvaW5cIl09XG50aGlzLl9qb2luKTt0aGlzLl9mbGFnTWl0ZXImJihhW1wic3Ryb2tlLW1pdGVybGltaXRcIl09dGhpcy5fbWl0ZXIpO3RoaXMuX3JlbmRlcmVyLmVsZW0/aC5zZXRBdHRyaWJ1dGVzKHRoaXMuX3JlbmRlcmVyLmVsZW0sYSk6KGEuaWQ9dGhpcy5pZCx0aGlzLl9yZW5kZXJlci5lbGVtPWguY3JlYXRlRWxlbWVudChcInBhdGhcIixhKSxjLmFwcGVuZENoaWxkKHRoaXMuX3JlbmRlcmVyLmVsZW0pKTt0aGlzLl9mbGFnQ2xpcCYmKGM9aC5nZXRDbGlwKHRoaXMpLGE9dGhpcy5fcmVuZGVyZXIuZWxlbSx0aGlzLl9jbGlwPyhhLnJlbW92ZUF0dHJpYnV0ZShcImlkXCIpLGMuc2V0QXR0cmlidXRlKFwiaWRcIix0aGlzLmlkKSxjLmFwcGVuZENoaWxkKGEpKTooYy5yZW1vdmVBdHRyaWJ1dGUoXCJpZFwiKSxhLnNldEF0dHJpYnV0ZShcImlkXCIsdGhpcy5pZCksdGhpcy5wYXJlbnQuX3JlbmRlcmVyLmVsZW0uYXBwZW5kQ2hpbGQoYSkpKTtyZXR1cm4gdGhpcy5mbGFnUmVzZXQoKX19LHRleHQ6e3JlbmRlcjpmdW5jdGlvbihjKXt0aGlzLl91cGRhdGUoKTtcbnZhciBhPXt9O2lmKHRoaXMuX21hdHJpeC5tYW51YWx8fHRoaXMuX2ZsYWdNYXRyaXgpYS50cmFuc2Zvcm09XCJtYXRyaXgoXCIrdGhpcy5fbWF0cml4LnRvU3RyaW5nKCkrXCIpXCI7dGhpcy5fZmxhZ0ZhbWlseSYmKGFbXCJmb250LWZhbWlseVwiXT10aGlzLl9mYW1pbHkpO3RoaXMuX2ZsYWdTaXplJiYoYVtcImZvbnQtc2l6ZVwiXT10aGlzLl9zaXplKTt0aGlzLl9mbGFnTGVhZGluZyYmKGFbXCJsaW5lLWhlaWdodFwiXT10aGlzLl9sZWFkaW5nKTt0aGlzLl9mbGFnQWxpZ25tZW50JiYoYVtcInRleHQtYW5jaG9yXCJdPWguYWxpZ25tZW50c1t0aGlzLl9hbGlnbm1lbnRdfHx0aGlzLl9hbGlnbm1lbnQpO3RoaXMuX2ZsYWdCYXNlbGluZSYmKGFbXCJhbGlnbm1lbnQtYmFzZWxpbmVcIl09YVtcImRvbWluYW50LWJhc2VsaW5lXCJdPXRoaXMuX2Jhc2VsaW5lKTt0aGlzLl9mbGFnU3R5bGUmJihhW1wiZm9udC1zdHlsZVwiXT10aGlzLl9zdHlsZSk7dGhpcy5fZmxhZ1dlaWdodCYmKGFbXCJmb250LXdlaWdodFwiXT10aGlzLl93ZWlnaHQpO1xudGhpcy5fZmxhZ0RlY29yYXRpb24mJihhW1widGV4dC1kZWNvcmF0aW9uXCJdPXRoaXMuX2RlY29yYXRpb24pO3RoaXMuX2ZpbGwmJnRoaXMuX2ZpbGwuX3JlbmRlcmVyJiYodGhpcy5fZmlsbC5fdXBkYXRlKCksaFt0aGlzLl9maWxsLl9yZW5kZXJlci50eXBlXS5yZW5kZXIuY2FsbCh0aGlzLl9maWxsLGMsITApKTt0aGlzLl9mbGFnRmlsbCYmKGEuZmlsbD10aGlzLl9maWxsJiZ0aGlzLl9maWxsLmlkP1widXJsKCNcIit0aGlzLl9maWxsLmlkK1wiKVwiOnRoaXMuX2ZpbGwpO3RoaXMuX3N0cm9rZSYmdGhpcy5fc3Ryb2tlLl9yZW5kZXJlciYmKHRoaXMuX3N0cm9rZS5fdXBkYXRlKCksaFt0aGlzLl9zdHJva2UuX3JlbmRlcmVyLnR5cGVdLnJlbmRlci5jYWxsKHRoaXMuX3N0cm9rZSxjLCEwKSk7dGhpcy5fZmxhZ1N0cm9rZSYmKGEuc3Ryb2tlPXRoaXMuX3N0cm9rZSYmdGhpcy5fc3Ryb2tlLmlkP1widXJsKCNcIit0aGlzLl9zdHJva2UuaWQrXCIpXCI6dGhpcy5fc3Ryb2tlKTt0aGlzLl9mbGFnTGluZXdpZHRoJiZcbihhW1wic3Ryb2tlLXdpZHRoXCJdPXRoaXMuX2xpbmV3aWR0aCk7dGhpcy5fZmxhZ09wYWNpdHkmJihhLm9wYWNpdHk9dGhpcy5fb3BhY2l0eSk7dGhpcy5fZmxhZ1Zpc2libGUmJihhLnZpc2liaWxpdHk9dGhpcy5fdmlzaWJsZT9cInZpc2libGVcIjpcImhpZGRlblwiKTt0aGlzLl9yZW5kZXJlci5lbGVtP2guc2V0QXR0cmlidXRlcyh0aGlzLl9yZW5kZXJlci5lbGVtLGEpOihhLmlkPXRoaXMuaWQsdGhpcy5fcmVuZGVyZXIuZWxlbT1oLmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0XCIsYSksYy5kZWZzLmFwcGVuZENoaWxkKHRoaXMuX3JlbmRlcmVyLmVsZW0pKTt0aGlzLl9mbGFnQ2xpcCYmKGM9aC5nZXRDbGlwKHRoaXMpLGE9dGhpcy5fcmVuZGVyZXIuZWxlbSx0aGlzLl9jbGlwPyhhLnJlbW92ZUF0dHJpYnV0ZShcImlkXCIpLGMuc2V0QXR0cmlidXRlKFwiaWRcIix0aGlzLmlkKSxjLmFwcGVuZENoaWxkKGEpKTooYy5yZW1vdmVBdHRyaWJ1dGUoXCJpZFwiKSxhLnNldEF0dHJpYnV0ZShcImlkXCIsdGhpcy5pZCksXG50aGlzLnBhcmVudC5fcmVuZGVyZXIuZWxlbS5hcHBlbmRDaGlsZChhKSkpO3RoaXMuX2ZsYWdWYWx1ZSYmKHRoaXMuX3JlbmRlcmVyLmVsZW0udGV4dENvbnRlbnQ9dGhpcy5fdmFsdWUpO3JldHVybiB0aGlzLmZsYWdSZXNldCgpfX0sXCJsaW5lYXItZ3JhZGllbnRcIjp7cmVuZGVyOmZ1bmN0aW9uKGMsYSl7YXx8dGhpcy5fdXBkYXRlKCk7YT17fTt0aGlzLl9mbGFnRW5kUG9pbnRzJiYoYS54MT10aGlzLmxlZnQuX3gsYS55MT10aGlzLmxlZnQuX3ksYS54Mj10aGlzLnJpZ2h0Ll94LGEueTI9dGhpcy5yaWdodC5feSk7dGhpcy5fZmxhZ1NwcmVhZCYmKGEuc3ByZWFkTWV0aG9kPXRoaXMuX3NwcmVhZCk7dGhpcy5fcmVuZGVyZXIuZWxlbT9oLnNldEF0dHJpYnV0ZXModGhpcy5fcmVuZGVyZXIuZWxlbSxhKTooYS5pZD10aGlzLmlkLGEuZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCIsdGhpcy5fcmVuZGVyZXIuZWxlbT1oLmNyZWF0ZUVsZW1lbnQoXCJsaW5lYXJHcmFkaWVudFwiLGEpLFxuYy5kZWZzLmFwcGVuZENoaWxkKHRoaXMuX3JlbmRlcmVyLmVsZW0pKTtpZih0aGlzLl9mbGFnU3RvcHMpe2lmKGM9dGhpcy5fcmVuZGVyZXIuZWxlbS5jaGlsZE5vZGVzLmxlbmd0aCE9PXRoaXMuc3RvcHMubGVuZ3RoKXRoaXMuX3JlbmRlcmVyLmVsZW0uY2hpbGROb2Rlcy5sZW5ndGg9MDtmb3IoYT0wO2E8dGhpcy5zdG9wcy5sZW5ndGg7YSsrKXt2YXIgZz10aGlzLnN0b3BzW2FdLGQ9e307Zy5fZmxhZ09mZnNldCYmKGQub2Zmc2V0PTEwMCpnLl9vZmZzZXQrXCIlXCIpO2cuX2ZsYWdDb2xvciYmKGRbXCJzdG9wLWNvbG9yXCJdPWcuX2NvbG9yKTtnLl9mbGFnT3BhY2l0eSYmKGRbXCJzdG9wLW9wYWNpdHlcIl09Zy5fb3BhY2l0eSk7Zy5fcmVuZGVyZXIuZWxlbT9oLnNldEF0dHJpYnV0ZXMoZy5fcmVuZGVyZXIuZWxlbSxkKTpnLl9yZW5kZXJlci5lbGVtPWguY3JlYXRlRWxlbWVudChcInN0b3BcIixkKTtjJiZ0aGlzLl9yZW5kZXJlci5lbGVtLmFwcGVuZENoaWxkKGcuX3JlbmRlcmVyLmVsZW0pO1xuZy5mbGFnUmVzZXQoKX19cmV0dXJuIHRoaXMuZmxhZ1Jlc2V0KCl9fSxcInJhZGlhbC1ncmFkaWVudFwiOntyZW5kZXI6ZnVuY3Rpb24oYyxhKXthfHx0aGlzLl91cGRhdGUoKTthPXt9O3RoaXMuX2ZsYWdDZW50ZXImJihhLmN4PXRoaXMuY2VudGVyLl94LGEuY3k9dGhpcy5jZW50ZXIuX3kpO3RoaXMuX2ZsYWdGb2NhbCYmKGEuZng9dGhpcy5mb2NhbC5feCxhLmZ5PXRoaXMuZm9jYWwuX3kpO3RoaXMuX2ZsYWdSYWRpdXMmJihhLnI9dGhpcy5fcmFkaXVzKTt0aGlzLl9mbGFnU3ByZWFkJiYoYS5zcHJlYWRNZXRob2Q9dGhpcy5fc3ByZWFkKTt0aGlzLl9yZW5kZXJlci5lbGVtP2guc2V0QXR0cmlidXRlcyh0aGlzLl9yZW5kZXJlci5lbGVtLGEpOihhLmlkPXRoaXMuaWQsYS5ncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIix0aGlzLl9yZW5kZXJlci5lbGVtPWguY3JlYXRlRWxlbWVudChcInJhZGlhbEdyYWRpZW50XCIsYSksYy5kZWZzLmFwcGVuZENoaWxkKHRoaXMuX3JlbmRlcmVyLmVsZW0pKTtcbmlmKHRoaXMuX2ZsYWdTdG9wcyl7aWYoYz10aGlzLl9yZW5kZXJlci5lbGVtLmNoaWxkTm9kZXMubGVuZ3RoIT09dGhpcy5zdG9wcy5sZW5ndGgpdGhpcy5fcmVuZGVyZXIuZWxlbS5jaGlsZE5vZGVzLmxlbmd0aD0wO2ZvcihhPTA7YTx0aGlzLnN0b3BzLmxlbmd0aDthKyspe3ZhciBnPXRoaXMuc3RvcHNbYV0sZD17fTtnLl9mbGFnT2Zmc2V0JiYoZC5vZmZzZXQ9MTAwKmcuX29mZnNldCtcIiVcIik7Zy5fZmxhZ0NvbG9yJiYoZFtcInN0b3AtY29sb3JcIl09Zy5fY29sb3IpO2cuX2ZsYWdPcGFjaXR5JiYoZFtcInN0b3Atb3BhY2l0eVwiXT1nLl9vcGFjaXR5KTtnLl9yZW5kZXJlci5lbGVtP2guc2V0QXR0cmlidXRlcyhnLl9yZW5kZXJlci5lbGVtLGQpOmcuX3JlbmRlcmVyLmVsZW09aC5jcmVhdGVFbGVtZW50KFwic3RvcFwiLGQpO2MmJnRoaXMuX3JlbmRlcmVyLmVsZW0uYXBwZW5kQ2hpbGQoZy5fcmVuZGVyZXIuZWxlbSk7Zy5mbGFnUmVzZXQoKX19cmV0dXJuIHRoaXMuZmxhZ1Jlc2V0KCl9fSxcbnRleHR1cmU6e3JlbmRlcjpmdW5jdGlvbihkLGEpe2F8fHRoaXMuX3VwZGF0ZSgpO2E9e307dmFyIGc9e3g6MCx5OjB9LGU9dGhpcy5pbWFnZTtpZih0aGlzLl9mbGFnTG9hZGVkJiZ0aGlzLmxvYWRlZClzd2l0Y2goZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKXtjYXNlIFwiY2FudmFzXCI6Zy5ocmVmPWdbXCJ4bGluazpocmVmXCJdPWUudG9EYXRhVVJMKFwiaW1hZ2UvcG5nXCIpO2JyZWFrO2Nhc2UgXCJpbWdcIjpjYXNlIFwiaW1hZ2VcIjpnLmhyZWY9Z1tcInhsaW5rOmhyZWZcIl09dGhpcy5zcmN9aWYodGhpcy5fZmxhZ09mZnNldHx8dGhpcy5fZmxhZ0xvYWRlZHx8dGhpcy5fZmxhZ1NjYWxlKWEueD10aGlzLl9vZmZzZXQueCxhLnk9dGhpcy5fb2Zmc2V0LnksZSYmKGEueC09ZS53aWR0aC8yLGEueS09ZS5oZWlnaHQvMix0aGlzLl9zY2FsZSBpbnN0YW5jZW9mIGMuVmVjdG9yPyhhLngqPXRoaXMuX3NjYWxlLngsYS55Kj10aGlzLl9zY2FsZS55KTooYS54Kj10aGlzLl9zY2FsZSxhLnkqPXRoaXMuX3NjYWxlKSksXG4wPGEueCYmKGEueCo9LTEpLDA8YS55JiYoYS55Kj0tMSk7aWYodGhpcy5fZmxhZ1NjYWxlfHx0aGlzLl9mbGFnTG9hZGVkfHx0aGlzLl9mbGFnUmVwZWF0KWlmKGEud2lkdGg9MCxhLmhlaWdodD0wLGUpe2cud2lkdGg9YS53aWR0aD1lLndpZHRoO2cuaGVpZ2h0PWEuaGVpZ2h0PWUuaGVpZ2h0O3N3aXRjaCh0aGlzLl9yZXBlYXQpe2Nhc2UgXCJuby1yZXBlYXRcIjphLndpZHRoKz0xLGEuaGVpZ2h0Kz0xfXRoaXMuX3NjYWxlIGluc3RhbmNlb2YgYy5WZWN0b3I/KGEud2lkdGgqPXRoaXMuX3NjYWxlLngsYS5oZWlnaHQqPXRoaXMuX3NjYWxlLnkpOihhLndpZHRoKj10aGlzLl9zY2FsZSxhLmhlaWdodCo9dGhpcy5fc2NhbGUpfWlmKHRoaXMuX2ZsYWdTY2FsZXx8dGhpcy5fZmxhZ0xvYWRlZCl0aGlzLl9yZW5kZXJlci5pbWFnZT9sLmlzRW1wdHkoZyl8fGguc2V0QXR0cmlidXRlcyh0aGlzLl9yZW5kZXJlci5pbWFnZSxnKTp0aGlzLl9yZW5kZXJlci5pbWFnZT1oLmNyZWF0ZUVsZW1lbnQoXCJpbWFnZVwiLFxuZyk7dGhpcy5fcmVuZGVyZXIuZWxlbT9sLmlzRW1wdHkoYSl8fGguc2V0QXR0cmlidXRlcyh0aGlzLl9yZW5kZXJlci5lbGVtLGEpOihhLmlkPXRoaXMuaWQsYS5wYXR0ZXJuVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiLHRoaXMuX3JlbmRlcmVyLmVsZW09aC5jcmVhdGVFbGVtZW50KFwicGF0dGVyblwiLGEpLGQuZGVmcy5hcHBlbmRDaGlsZCh0aGlzLl9yZW5kZXJlci5lbGVtKSk7dGhpcy5fcmVuZGVyZXIuZWxlbSYmdGhpcy5fcmVuZGVyZXIuaW1hZ2UmJiF0aGlzLl9yZW5kZXJlci5hcHBlbmRlZCYmKHRoaXMuX3JlbmRlcmVyLmVsZW0uYXBwZW5kQ2hpbGQodGhpcy5fcmVuZGVyZXIuaW1hZ2UpLHRoaXMuX3JlbmRlcmVyLmFwcGVuZGVkPSEwKTtyZXR1cm4gdGhpcy5mbGFnUmVzZXQoKX19fSxkPWNbYy5UeXBlcy5zdmddPWZ1bmN0aW9uKGQpe3RoaXMuZG9tRWxlbWVudD1kLmRvbUVsZW1lbnR8fGguY3JlYXRlRWxlbWVudChcInN2Z1wiKTt0aGlzLnNjZW5lPW5ldyBjLkdyb3VwO3RoaXMuc2NlbmUucGFyZW50PVxudGhpczt0aGlzLmRlZnM9aC5jcmVhdGVFbGVtZW50KFwiZGVmc1wiKTt0aGlzLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5kZWZzKTt0aGlzLmRvbUVsZW1lbnQuZGVmcz10aGlzLmRlZnM7dGhpcy5kb21FbGVtZW50LnN0eWxlLm92ZXJmbG93PVwiaGlkZGVuXCJ9O2wuZXh0ZW5kKGQse1V0aWxzOmh9KTtsLmV4dGVuZChkLnByb3RvdHlwZSxjLlV0aWxzLkV2ZW50cyx7c2V0U2l6ZTpmdW5jdGlvbihjLGEpe3RoaXMud2lkdGg9Yzt0aGlzLmhlaWdodD1hO2guc2V0QXR0cmlidXRlcyh0aGlzLmRvbUVsZW1lbnQse3dpZHRoOmMsaGVpZ2h0OmF9KTtyZXR1cm4gdGhpc30scmVuZGVyOmZ1bmN0aW9uKCl7aC5ncm91cC5yZW5kZXIuY2FsbCh0aGlzLnNjZW5lLHRoaXMuZG9tRWxlbWVudCk7cmV0dXJuIHRoaXN9fSl9KSgoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBnbG9iYWw/Z2xvYmFsOnRoaXMpLlR3byk7XG4oZnVuY3Rpb24oYyl7dmFyIGs9Yy5VdGlscy5tb2QsbT1jLlV0aWxzLnRvRml4ZWQsbD1jLlV0aWxzLmdldFJhdGlvLGg9Yy5VdGlscyxkPWZ1bmN0aW9uKGEpe3JldHVybiAxPT1hWzBdJiYwPT1hWzNdJiYwPT1hWzFdJiYxPT1hWzRdJiYwPT1hWzJdJiYwPT1hWzVdfSxlPXtpc0hpZGRlbjovKG5vbmV8dHJhbnNwYXJlbnQpL2ksYWxpZ25tZW50czp7bGVmdDpcInN0YXJ0XCIsbWlkZGxlOlwiY2VudGVyXCIscmlnaHQ6XCJlbmRcIn0sc2hpbTpmdW5jdGlvbihhKXthLnRhZ05hbWU9XCJjYW52YXNcIjthLm5vZGVUeXBlPTE7cmV0dXJuIGF9LGdyb3VwOntyZW5kZXJDaGlsZDpmdW5jdGlvbihhKXtlW2EuX3JlbmRlcmVyLnR5cGVdLnJlbmRlci5jYWxsKGEsdGhpcy5jdHgsITAsdGhpcy5jbGlwKX0scmVuZGVyOmZ1bmN0aW9uKGEpe3RoaXMuX3VwZGF0ZSgpO3ZhciBjPXRoaXMuX21hdHJpeC5lbGVtZW50cyxmPXRoaXMucGFyZW50O3RoaXMuX3JlbmRlcmVyLm9wYWNpdHk9dGhpcy5fb3BhY2l0eSpcbihmJiZmLl9yZW5kZXJlcj9mLl9yZW5kZXJlci5vcGFjaXR5OjEpO3ZhciBmPWQoYyksZz10aGlzLl9tYXNrO3RoaXMuX3JlbmRlcmVyLmNvbnRleHR8fCh0aGlzLl9yZW5kZXJlci5jb250ZXh0PXt9KTt0aGlzLl9yZW5kZXJlci5jb250ZXh0LmN0eD1hO2Z8fChhLnNhdmUoKSxhLnRyYW5zZm9ybShjWzBdLGNbM10sY1sxXSxjWzRdLGNbMl0sY1s1XSkpO2cmJmVbZy5fcmVuZGVyZXIudHlwZV0ucmVuZGVyLmNhbGwoZyxhLCEwKTtpZigwPHRoaXMub3BhY2l0eSYmMCE9PXRoaXMuc2NhbGUpZm9yKGM9MDtjPHRoaXMuY2hpbGRyZW4ubGVuZ3RoO2MrKylnPXRoaXMuY2hpbGRyZW5bY10sZVtnLl9yZW5kZXJlci50eXBlXS5yZW5kZXIuY2FsbChnLGEpO2Z8fGEucmVzdG9yZSgpO3JldHVybiB0aGlzLmZsYWdSZXNldCgpfX0scGF0aDp7cmVuZGVyOmZ1bmN0aW9uKGEsbixmKXt0aGlzLl91cGRhdGUoKTt2YXIgZz10aGlzLl9tYXRyaXguZWxlbWVudHM7dmFyIHY9dGhpcy5fc3Ryb2tlO1xudmFyIGw9dGhpcy5fbGluZXdpZHRoO3ZhciB6PXRoaXMuX2ZpbGw7dmFyIEE9dGhpcy5fb3BhY2l0eSp0aGlzLnBhcmVudC5fcmVuZGVyZXIub3BhY2l0eTt2YXIgeD10aGlzLl92aXNpYmxlO3ZhciB1PXRoaXMuX2NhcDt2YXIgcj10aGlzLl9qb2luO3ZhciBxPXRoaXMuX21pdGVyO3ZhciB3PXRoaXMuX2Nsb3NlZDt2YXIgcD10aGlzLl92ZXJ0aWNlczt2YXIgQz1wLmxlbmd0aDt2YXIgRT1DLTE7dmFyIEg9ZChnKTt2YXIgRz10aGlzLl9jbGlwO2lmKCFuJiYoIXh8fEcpKXJldHVybiB0aGlzO0h8fChhLnNhdmUoKSxhLnRyYW5zZm9ybShnWzBdLGdbM10sZ1sxXSxnWzRdLGdbMl0sZ1s1XSkpO3omJihoLmlzU3RyaW5nKHopP2EuZmlsbFN0eWxlPXo6KGVbei5fcmVuZGVyZXIudHlwZV0ucmVuZGVyLmNhbGwoeixhKSxhLmZpbGxTdHlsZT16Ll9yZW5kZXJlci5lZmZlY3QpKTt2JiYoaC5pc1N0cmluZyh2KT9hLnN0cm9rZVN0eWxlPXY6KGVbdi5fcmVuZGVyZXIudHlwZV0ucmVuZGVyLmNhbGwodixcbmEpLGEuc3Ryb2tlU3R5bGU9di5fcmVuZGVyZXIuZWZmZWN0KSk7bCYmKGEubGluZVdpZHRoPWwpO3EmJihhLm1pdGVyTGltaXQ9cSk7ciYmKGEubGluZUpvaW49cik7dSYmKGEubGluZUNhcD11KTtoLmlzTnVtYmVyKEEpJiYoYS5nbG9iYWxBbHBoYT1BKTthLmJlZ2luUGF0aCgpO2ZvcihnPTA7ZzxwLmxlbmd0aDtnKyspc3dpdGNoKG49cFtnXSx4PW0obi5feCksdT1tKG4uX3kpLG4uX2NvbW1hbmQpe2Nhc2UgYy5Db21tYW5kcy5jbG9zZTphLmNsb3NlUGF0aCgpO2JyZWFrO2Nhc2UgYy5Db21tYW5kcy5jdXJ2ZTpBPXc/ayhnLTEsQyk6TWF0aC5tYXgoZy0xLDApO3cmJmsoZysxLEMpO3I9cFtBXTtxPXIuY29udHJvbHMmJnIuY29udHJvbHMucmlnaHR8fGMuVmVjdG9yLnplcm87dmFyIEY9bi5jb250cm9scyYmbi5jb250cm9scy5sZWZ0fHxjLlZlY3Rvci56ZXJvO3IuX3JlbGF0aXZlPyhBPXEueCttKHIuX3gpLHE9cS55K20oci5feSkpOihBPW0ocS54KSxxPW0ocS55KSk7bi5fcmVsYXRpdmU/XG4ocj1GLngrbShuLl94KSxGPUYueSttKG4uX3kpKToocj1tKEYueCksRj1tKEYueSkpO2EuYmV6aWVyQ3VydmVUbyhBLHEscixGLHgsdSk7Zz49RSYmdyYmKHU9SSxyPW4uY29udHJvbHMmJm4uY29udHJvbHMucmlnaHR8fGMuVmVjdG9yLnplcm8seD11LmNvbnRyb2xzJiZ1LmNvbnRyb2xzLmxlZnR8fGMuVmVjdG9yLnplcm8sbi5fcmVsYXRpdmU/KEE9ci54K20obi5feCkscT1yLnkrbShuLl95KSk6KEE9bShyLngpLHE9bShyLnkpKSx1Ll9yZWxhdGl2ZT8ocj14LngrbSh1Ll94KSxGPXgueSttKHUuX3kpKToocj1tKHgueCksRj1tKHgueSkpLHg9bSh1Ll94KSx1PW0odS5feSksYS5iZXppZXJDdXJ2ZVRvKEEscSxyLEYseCx1KSk7YnJlYWs7Y2FzZSBjLkNvbW1hbmRzLmxpbmU6YS5saW5lVG8oeCx1KTticmVhaztjYXNlIGMuQ29tbWFuZHMubW92ZTp2YXIgST1uO2EubW92ZVRvKHgsdSl9dyYmYS5jbG9zZVBhdGgoKTtpZighRyYmIWYpe2lmKCFlLmlzSGlkZGVuLnRlc3Qoeikpe2lmKHc9XG56Ll9yZW5kZXJlciYmei5fcmVuZGVyZXIub2Zmc2V0KWEuc2F2ZSgpLGEudHJhbnNsYXRlKC16Ll9yZW5kZXJlci5vZmZzZXQueCwtei5fcmVuZGVyZXIub2Zmc2V0LnkpLGEuc2NhbGUoei5fcmVuZGVyZXIuc2NhbGUueCx6Ll9yZW5kZXJlci5zY2FsZS55KTthLmZpbGwoKTt3JiZhLnJlc3RvcmUoKX1pZighZS5pc0hpZGRlbi50ZXN0KHYpKXtpZih3PXYuX3JlbmRlcmVyJiZ2Ll9yZW5kZXJlci5vZmZzZXQpYS5zYXZlKCksYS50cmFuc2xhdGUoLXYuX3JlbmRlcmVyLm9mZnNldC54LC12Ll9yZW5kZXJlci5vZmZzZXQueSksYS5zY2FsZSh2Ll9yZW5kZXJlci5zY2FsZS54LHYuX3JlbmRlcmVyLnNjYWxlLnkpLGEubGluZVdpZHRoPWwvdi5fcmVuZGVyZXIuc2NhbGUueDthLnN0cm9rZSgpO3cmJmEucmVzdG9yZSgpfX1IfHxhLnJlc3RvcmUoKTtHJiYhZiYmYS5jbGlwKCk7cmV0dXJuIHRoaXMuZmxhZ1Jlc2V0KCl9fSx0ZXh0OntyZW5kZXI6ZnVuY3Rpb24oYSxjLGYpe3RoaXMuX3VwZGF0ZSgpO1xudmFyIGc9dGhpcy5fbWF0cml4LmVsZW1lbnRzLG49dGhpcy5fc3Ryb2tlLGs9dGhpcy5fbGluZXdpZHRoLGw9dGhpcy5fZmlsbCxBPXRoaXMuX29wYWNpdHkqdGhpcy5wYXJlbnQuX3JlbmRlcmVyLm9wYWNpdHkseD10aGlzLl92aXNpYmxlLHU9ZChnKSxyPWwuX3JlbmRlcmVyJiZsLl9yZW5kZXJlci5vZmZzZXQmJm4uX3JlbmRlcmVyJiZuLl9yZW5kZXJlci5vZmZzZXQscT10aGlzLl9jbGlwO2lmKCFjJiYoIXh8fHEpKXJldHVybiB0aGlzO3V8fChhLnNhdmUoKSxhLnRyYW5zZm9ybShnWzBdLGdbM10sZ1sxXSxnWzRdLGdbMl0sZ1s1XSkpO3J8fChhLmZvbnQ9W3RoaXMuX3N0eWxlLHRoaXMuX3dlaWdodCx0aGlzLl9zaXplK1wicHgvXCIrdGhpcy5fbGVhZGluZytcInB4XCIsdGhpcy5fZmFtaWx5XS5qb2luKFwiIFwiKSk7YS50ZXh0QWxpZ249ZS5hbGlnbm1lbnRzW3RoaXMuX2FsaWdubWVudF18fHRoaXMuX2FsaWdubWVudDthLnRleHRCYXNlbGluZT10aGlzLl9iYXNlbGluZTtsJiYoaC5pc1N0cmluZyhsKT9cbmEuZmlsbFN0eWxlPWw6KGVbbC5fcmVuZGVyZXIudHlwZV0ucmVuZGVyLmNhbGwobCxhKSxhLmZpbGxTdHlsZT1sLl9yZW5kZXJlci5lZmZlY3QpKTtuJiYoaC5pc1N0cmluZyhuKT9hLnN0cm9rZVN0eWxlPW46KGVbbi5fcmVuZGVyZXIudHlwZV0ucmVuZGVyLmNhbGwobixhKSxhLnN0cm9rZVN0eWxlPW4uX3JlbmRlcmVyLmVmZmVjdCkpO2smJihhLmxpbmVXaWR0aD1rKTtoLmlzTnVtYmVyKEEpJiYoYS5nbG9iYWxBbHBoYT1BKTtxfHxmfHwoZS5pc0hpZGRlbi50ZXN0KGwpfHwobC5fcmVuZGVyZXImJmwuX3JlbmRlcmVyLm9mZnNldD8oYz1tKGwuX3JlbmRlcmVyLnNjYWxlLngpLGc9bShsLl9yZW5kZXJlci5zY2FsZS55KSxhLnNhdmUoKSxhLnRyYW5zbGF0ZSgtbShsLl9yZW5kZXJlci5vZmZzZXQueCksLW0obC5fcmVuZGVyZXIub2Zmc2V0LnkpKSxhLnNjYWxlKGMsZyksYz10aGlzLl9zaXplL2wuX3JlbmRlcmVyLnNjYWxlLnksZz10aGlzLl9sZWFkaW5nL2wuX3JlbmRlcmVyLnNjYWxlLnksXG5hLmZvbnQ9W3RoaXMuX3N0eWxlLHRoaXMuX3dlaWdodCxtKGMpK1wicHgvXCIsbShnKStcInB4XCIsdGhpcy5fZmFtaWx5XS5qb2luKFwiIFwiKSxjPWwuX3JlbmRlcmVyLm9mZnNldC54L2wuX3JlbmRlcmVyLnNjYWxlLngsbD1sLl9yZW5kZXJlci5vZmZzZXQueS9sLl9yZW5kZXJlci5zY2FsZS55LGEuZmlsbFRleHQodGhpcy52YWx1ZSxtKGMpLG0obCkpLGEucmVzdG9yZSgpKTphLmZpbGxUZXh0KHRoaXMudmFsdWUsMCwwKSksZS5pc0hpZGRlbi50ZXN0KG4pfHwobi5fcmVuZGVyZXImJm4uX3JlbmRlcmVyLm9mZnNldD8oYz1tKG4uX3JlbmRlcmVyLnNjYWxlLngpLGc9bShuLl9yZW5kZXJlci5zY2FsZS55KSxhLnNhdmUoKSxhLnRyYW5zbGF0ZSgtbShuLl9yZW5kZXJlci5vZmZzZXQueCksLW0obi5fcmVuZGVyZXIub2Zmc2V0LnkpKSxhLnNjYWxlKGMsZyksYz10aGlzLl9zaXplL24uX3JlbmRlcmVyLnNjYWxlLnksZz10aGlzLl9sZWFkaW5nL24uX3JlbmRlcmVyLnNjYWxlLnksYS5mb250PVxuW3RoaXMuX3N0eWxlLHRoaXMuX3dlaWdodCxtKGMpK1wicHgvXCIsbShnKStcInB4XCIsdGhpcy5fZmFtaWx5XS5qb2luKFwiIFwiKSxjPW4uX3JlbmRlcmVyLm9mZnNldC54L24uX3JlbmRlcmVyLnNjYWxlLngsbD1uLl9yZW5kZXJlci5vZmZzZXQueS9uLl9yZW5kZXJlci5zY2FsZS55LG49ay9uLl9yZW5kZXJlci5zY2FsZS54LGEubGluZVdpZHRoPW0obiksYS5zdHJva2VUZXh0KHRoaXMudmFsdWUsbShjKSxtKGwpKSxhLnJlc3RvcmUoKSk6YS5zdHJva2VUZXh0KHRoaXMudmFsdWUsMCwwKSkpO3V8fGEucmVzdG9yZSgpO3EmJiFmJiZhLmNsaXAoKTtyZXR1cm4gdGhpcy5mbGFnUmVzZXQoKX19LFwibGluZWFyLWdyYWRpZW50XCI6e3JlbmRlcjpmdW5jdGlvbihhKXt0aGlzLl91cGRhdGUoKTtpZighdGhpcy5fcmVuZGVyZXIuZWZmZWN0fHx0aGlzLl9mbGFnRW5kUG9pbnRzfHx0aGlzLl9mbGFnU3RvcHMpZm9yKHRoaXMuX3JlbmRlcmVyLmVmZmVjdD1hLmNyZWF0ZUxpbmVhckdyYWRpZW50KHRoaXMubGVmdC5feCxcbnRoaXMubGVmdC5feSx0aGlzLnJpZ2h0Ll94LHRoaXMucmlnaHQuX3kpLGE9MDthPHRoaXMuc3RvcHMubGVuZ3RoO2ErKyl7dmFyIGM9dGhpcy5zdG9wc1thXTt0aGlzLl9yZW5kZXJlci5lZmZlY3QuYWRkQ29sb3JTdG9wKGMuX29mZnNldCxjLl9jb2xvcil9cmV0dXJuIHRoaXMuZmxhZ1Jlc2V0KCl9fSxcInJhZGlhbC1ncmFkaWVudFwiOntyZW5kZXI6ZnVuY3Rpb24oYSl7dGhpcy5fdXBkYXRlKCk7aWYoIXRoaXMuX3JlbmRlcmVyLmVmZmVjdHx8dGhpcy5fZmxhZ0NlbnRlcnx8dGhpcy5fZmxhZ0ZvY2FsfHx0aGlzLl9mbGFnUmFkaXVzfHx0aGlzLl9mbGFnU3RvcHMpZm9yKHRoaXMuX3JlbmRlcmVyLmVmZmVjdD1hLmNyZWF0ZVJhZGlhbEdyYWRpZW50KHRoaXMuY2VudGVyLl94LHRoaXMuY2VudGVyLl95LDAsdGhpcy5mb2NhbC5feCx0aGlzLmZvY2FsLl95LHRoaXMuX3JhZGl1cyksYT0wO2E8dGhpcy5zdG9wcy5sZW5ndGg7YSsrKXt2YXIgYz10aGlzLnN0b3BzW2FdO3RoaXMuX3JlbmRlcmVyLmVmZmVjdC5hZGRDb2xvclN0b3AoYy5fb2Zmc2V0LFxuYy5fY29sb3IpfXJldHVybiB0aGlzLmZsYWdSZXNldCgpfX0sdGV4dHVyZTp7cmVuZGVyOmZ1bmN0aW9uKGEpe3RoaXMuX3VwZGF0ZSgpO3ZhciBkPXRoaXMuaW1hZ2U7aWYoIXRoaXMuX3JlbmRlcmVyLmVmZmVjdHx8KHRoaXMuX2ZsYWdMb2FkZWR8fHRoaXMuX2ZsYWdJbWFnZXx8dGhpcy5fZmxhZ1ZpZGVvfHx0aGlzLl9mbGFnUmVwZWF0KSYmdGhpcy5sb2FkZWQpdGhpcy5fcmVuZGVyZXIuZWZmZWN0PWEuY3JlYXRlUGF0dGVybih0aGlzLmltYWdlLHRoaXMuX3JlcGVhdCk7aWYodGhpcy5fZmxhZ09mZnNldHx8dGhpcy5fZmxhZ0xvYWRlZHx8dGhpcy5fZmxhZ1NjYWxlKXRoaXMuX3JlbmRlcmVyLm9mZnNldCBpbnN0YW5jZW9mIGMuVmVjdG9yfHwodGhpcy5fcmVuZGVyZXIub2Zmc2V0PW5ldyBjLlZlY3RvciksdGhpcy5fcmVuZGVyZXIub2Zmc2V0Lng9LXRoaXMuX29mZnNldC54LHRoaXMuX3JlbmRlcmVyLm9mZnNldC55PS10aGlzLl9vZmZzZXQueSxkJiYodGhpcy5fcmVuZGVyZXIub2Zmc2V0LngrPVxuZC53aWR0aC8yLHRoaXMuX3JlbmRlcmVyLm9mZnNldC55Kz1kLmhlaWdodC8yLHRoaXMuX3NjYWxlIGluc3RhbmNlb2YgYy5WZWN0b3I/KHRoaXMuX3JlbmRlcmVyLm9mZnNldC54Kj10aGlzLl9zY2FsZS54LHRoaXMuX3JlbmRlcmVyLm9mZnNldC55Kj10aGlzLl9zY2FsZS55KToodGhpcy5fcmVuZGVyZXIub2Zmc2V0LngqPXRoaXMuX3NjYWxlLHRoaXMuX3JlbmRlcmVyLm9mZnNldC55Kj10aGlzLl9zY2FsZSkpO2lmKHRoaXMuX2ZsYWdTY2FsZXx8dGhpcy5fZmxhZ0xvYWRlZCl0aGlzLl9yZW5kZXJlci5zY2FsZSBpbnN0YW5jZW9mIGMuVmVjdG9yfHwodGhpcy5fcmVuZGVyZXIuc2NhbGU9bmV3IGMuVmVjdG9yKSx0aGlzLl9zY2FsZSBpbnN0YW5jZW9mIGMuVmVjdG9yP3RoaXMuX3JlbmRlcmVyLnNjYWxlLmNvcHkodGhpcy5fc2NhbGUpOnRoaXMuX3JlbmRlcmVyLnNjYWxlLnNldCh0aGlzLl9zY2FsZSx0aGlzLl9zY2FsZSk7cmV0dXJuIHRoaXMuZmxhZ1Jlc2V0KCl9fX0sYT1jW2MuVHlwZXMuY2FudmFzXT1cbmZ1bmN0aW9uKGEpe3ZhciBkPSExIT09YS5zbW9vdGhpbmc7dGhpcy5kb21FbGVtZW50PWEuZG9tRWxlbWVudHx8ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTt0aGlzLmN0eD10aGlzLmRvbUVsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpO3RoaXMub3ZlcmRyYXc9YS5vdmVyZHJhd3x8ITE7aC5pc1VuZGVmaW5lZCh0aGlzLmN0eC5pbWFnZVNtb290aGluZ0VuYWJsZWQpfHwodGhpcy5jdHguaW1hZ2VTbW9vdGhpbmdFbmFibGVkPWQpO3RoaXMuc2NlbmU9bmV3IGMuR3JvdXA7dGhpcy5zY2VuZS5wYXJlbnQ9dGhpc307aC5leHRlbmQoYSx7VXRpbHM6ZX0pO2guZXh0ZW5kKGEucHJvdG90eXBlLGMuVXRpbHMuRXZlbnRzLHtzZXRTaXplOmZ1bmN0aW9uKGEsYyxmKXt0aGlzLndpZHRoPWE7dGhpcy5oZWlnaHQ9Yzt0aGlzLnJhdGlvPWguaXNVbmRlZmluZWQoZik/bCh0aGlzLmN0eCk6Zjt0aGlzLmRvbUVsZW1lbnQud2lkdGg9YSp0aGlzLnJhdGlvO3RoaXMuZG9tRWxlbWVudC5oZWlnaHQ9XG5jKnRoaXMucmF0aW87dGhpcy5kb21FbGVtZW50LnN0eWxlJiZoLmV4dGVuZCh0aGlzLmRvbUVsZW1lbnQuc3R5bGUse3dpZHRoOmErXCJweFwiLGhlaWdodDpjK1wicHhcIn0pO3JldHVybiB0aGlzfSxyZW5kZXI6ZnVuY3Rpb24oKXt2YXIgYT0xPT09dGhpcy5yYXRpbzthfHwodGhpcy5jdHguc2F2ZSgpLHRoaXMuY3R4LnNjYWxlKHRoaXMucmF0aW8sdGhpcy5yYXRpbykpO3RoaXMub3ZlcmRyYXd8fHRoaXMuY3R4LmNsZWFyUmVjdCgwLDAsdGhpcy53aWR0aCx0aGlzLmhlaWdodCk7ZS5ncm91cC5yZW5kZXIuY2FsbCh0aGlzLnNjZW5lLHRoaXMuY3R4KTthfHx0aGlzLmN0eC5yZXN0b3JlKCk7cmV0dXJuIHRoaXN9fSl9KSgoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBnbG9iYWw/Z2xvYmFsOnRoaXMpLlR3byk7XG4oZnVuY3Rpb24oYyl7dmFyIGs9Yy5yb290LG09Yy5NYXRyaXguTXVsdGlwbHksbD1jLlV0aWxzLm1vZCxoPVsxLDAsMCwwLDEsMCwwLDAsMV0sZD1uZXcgYy5BcnJheSg5KSxlPWMuVXRpbHMuZ2V0UmF0aW8sYT1jLlV0aWxzLnRvRml4ZWQsZz1jLlV0aWxzLG49e2lzSGlkZGVuOi8obm9uZXx0cmFuc3BhcmVudCkvaSxjYW52YXM6ay5kb2N1bWVudD9rLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik6e2dldENvbnRleHQ6Zy5pZGVudGl0eX0sYWxpZ25tZW50czp7bGVmdDpcInN0YXJ0XCIsbWlkZGxlOlwiY2VudGVyXCIscmlnaHQ6XCJlbmRcIn0sbWF0cml4Om5ldyBjLk1hdHJpeCx1djpuZXcgYy5BcnJheShbMCwwLDEsMCwwLDEsMCwxLDEsMCwxLDFdKSxncm91cDp7cmVtb3ZlQ2hpbGQ6ZnVuY3Rpb24oYSxjKXtpZihhLmNoaWxkcmVuKWZvcih2YXIgZj0wO2Y8YS5jaGlsZHJlbi5sZW5ndGg7ZisrKW4uZ3JvdXAucmVtb3ZlQ2hpbGQoYS5jaGlsZHJlbltmXSxjKTtlbHNlIGMuZGVsZXRlVGV4dHVyZShhLl9yZW5kZXJlci50ZXh0dXJlKSxcbmRlbGV0ZSBhLl9yZW5kZXJlci50ZXh0dXJlfSxyZW5kZXJDaGlsZDpmdW5jdGlvbihhKXtuW2EuX3JlbmRlcmVyLnR5cGVdLnJlbmRlci5jYWxsKGEsdGhpcy5nbCx0aGlzLnByb2dyYW0pfSxyZW5kZXI6ZnVuY3Rpb24oYSxnKXt0aGlzLl91cGRhdGUoKTt2YXIgZj10aGlzLnBhcmVudCxlPWYuX21hdHJpeCYmZi5fbWF0cml4Lm1hbnVhbHx8Zi5fZmxhZ01hdHJpeCxoPXRoaXMuX21hdHJpeC5tYW51YWx8fHRoaXMuX2ZsYWdNYXRyaXg7aWYoZXx8aCl0aGlzLl9yZW5kZXJlci5tYXRyaXh8fCh0aGlzLl9yZW5kZXJlci5tYXRyaXg9bmV3IGMuQXJyYXkoOSkpLHRoaXMuX21hdHJpeC50b0FycmF5KCEwLGQpLG0oZCxmLl9yZW5kZXJlci5tYXRyaXgsdGhpcy5fcmVuZGVyZXIubWF0cml4KSx0aGlzLl9yZW5kZXJlci5zY2FsZT10aGlzLl9zY2FsZSpmLl9yZW5kZXJlci5zY2FsZSxlJiYodGhpcy5fZmxhZ01hdHJpeD0hMCk7dGhpcy5fbWFzayYmKGEuZW5hYmxlKGEuU1RFTkNJTF9URVNUKSxcbmEuc3RlbmNpbEZ1bmMoYS5BTFdBWVMsMSwxKSxhLmNvbG9yTWFzayghMSwhMSwhMSwhMCksYS5zdGVuY2lsT3AoYS5LRUVQLGEuS0VFUCxhLklOQ1IpLG5bdGhpcy5fbWFzay5fcmVuZGVyZXIudHlwZV0ucmVuZGVyLmNhbGwodGhpcy5fbWFzayxhLGcsdGhpcyksYS5jb2xvck1hc2soITAsITAsITAsITApLGEuc3RlbmNpbEZ1bmMoYS5OT1RFUVVBTCwwLDEpLGEuc3RlbmNpbE9wKGEuS0VFUCxhLktFRVAsYS5LRUVQKSk7dGhpcy5fZmxhZ09wYWNpdHk9Zi5fZmxhZ09wYWNpdHl8fHRoaXMuX2ZsYWdPcGFjaXR5O3RoaXMuX3JlbmRlcmVyLm9wYWNpdHk9dGhpcy5fb3BhY2l0eSooZiYmZi5fcmVuZGVyZXI/Zi5fcmVuZGVyZXIub3BhY2l0eToxKTtpZih0aGlzLl9mbGFnU3VidHJhY3Rpb25zKWZvcihmPTA7Zjx0aGlzLnN1YnRyYWN0aW9ucy5sZW5ndGg7ZisrKW4uZ3JvdXAucmVtb3ZlQ2hpbGQodGhpcy5zdWJ0cmFjdGlvbnNbZl0sYSk7dGhpcy5jaGlsZHJlbi5mb3JFYWNoKG4uZ3JvdXAucmVuZGVyQ2hpbGQsXG57Z2w6YSxwcm9ncmFtOmd9KTt0aGlzLl9tYXNrJiYoYS5jb2xvck1hc2soITEsITEsITEsITEpLGEuc3RlbmNpbE9wKGEuS0VFUCxhLktFRVAsYS5ERUNSKSxuW3RoaXMuX21hc2suX3JlbmRlcmVyLnR5cGVdLnJlbmRlci5jYWxsKHRoaXMuX21hc2ssYSxnLHRoaXMpLGEuY29sb3JNYXNrKCEwLCEwLCEwLCEwKSxhLnN0ZW5jaWxGdW5jKGEuTk9URVFVQUwsMCwxKSxhLnN0ZW5jaWxPcChhLktFRVAsYS5LRUVQLGEuS0VFUCksYS5kaXNhYmxlKGEuU1RFTkNJTF9URVNUKSk7cmV0dXJuIHRoaXMuZmxhZ1Jlc2V0KCl9fSxwYXRoOnt1cGRhdGVDYW52YXM6ZnVuY3Rpb24oZil7dmFyIGQ9Zi5fdmVydGljZXM7dmFyIGU9dGhpcy5jYW52YXM7dmFyIGg9dGhpcy5jdHg7dmFyIGs9Zi5fcmVuZGVyZXIuc2NhbGU7dmFyIG09Zi5fc3Ryb2tlLHg9Zi5fbGluZXdpZHRoLHU9Zi5fZmlsbDt2YXIgcj1mLl9yZW5kZXJlci5vcGFjaXR5fHxmLl9vcGFjaXR5O3ZhciBxPWYuX2NhcDt2YXIgdz1mLl9qb2luO1xudmFyIHA9Zi5fbWl0ZXI7dmFyIEM9Zi5fY2xvc2VkLEU9ZC5sZW5ndGgsSD1FLTE7ZS53aWR0aD1NYXRoLm1heChNYXRoLmNlaWwoZi5fcmVuZGVyZXIucmVjdC53aWR0aCprKSwxKTtlLmhlaWdodD1NYXRoLm1heChNYXRoLmNlaWwoZi5fcmVuZGVyZXIucmVjdC5oZWlnaHQqayksMSk7dmFyIEc9Zi5fcmVuZGVyZXIucmVjdC5jZW50cm9pZCxGPUcueCxHPUcueTtoLmNsZWFyUmVjdCgwLDAsZS53aWR0aCxlLmhlaWdodCk7dSYmKGcuaXNTdHJpbmcodSk/aC5maWxsU3R5bGU9dTooblt1Ll9yZW5kZXJlci50eXBlXS5yZW5kZXIuY2FsbCh1LGgsZiksaC5maWxsU3R5bGU9dS5fcmVuZGVyZXIuZWZmZWN0KSk7bSYmKGcuaXNTdHJpbmcobSk/aC5zdHJva2VTdHlsZT1tOihuW20uX3JlbmRlcmVyLnR5cGVdLnJlbmRlci5jYWxsKG0saCxmKSxoLnN0cm9rZVN0eWxlPW0uX3JlbmRlcmVyLmVmZmVjdCkpO3gmJihoLmxpbmVXaWR0aD14KTtwJiYoaC5taXRlckxpbWl0PXApO3cmJihoLmxpbmVKb2luPVxudyk7cSYmKGgubGluZUNhcD1xKTtnLmlzTnVtYmVyKHIpJiYoaC5nbG9iYWxBbHBoYT1yKTtoLnNhdmUoKTtoLnNjYWxlKGssayk7aC50cmFuc2xhdGUoRixHKTtoLmJlZ2luUGF0aCgpO2ZvcihmPTA7ZjxkLmxlbmd0aDtmKyspc3dpdGNoKGI9ZFtmXSxrPWEoYi5feCkscj1hKGIuX3kpLGIuX2NvbW1hbmQpe2Nhc2UgYy5Db21tYW5kcy5jbG9zZTpoLmNsb3NlUGF0aCgpO2JyZWFrO2Nhc2UgYy5Db21tYW5kcy5jdXJ2ZTplPUM/bChmLTEsRSk6TWF0aC5tYXgoZi0xLDApO0MmJmwoZisxLEUpO3E9ZFtlXTt3PXEuY29udHJvbHMmJnEuY29udHJvbHMucmlnaHR8fGMuVmVjdG9yLnplcm87cD1iLmNvbnRyb2xzJiZiLmNvbnRyb2xzLmxlZnR8fGMuVmVjdG9yLnplcm87cS5fcmVsYXRpdmU/KGU9YSh3LngrcS5feCksdz1hKHcueStxLl95KSk6KGU9YSh3LngpLHc9YSh3LnkpKTtiLl9yZWxhdGl2ZT8ocT1hKHAueCtiLl94KSxwPWEocC55K2IuX3kpKToocT1hKHAueCkscD1hKHAueSkpO1xuaC5iZXppZXJDdXJ2ZVRvKGUsdyxxLHAsayxyKTtmPj1IJiZDJiYocj1JLHE9Yi5jb250cm9scyYmYi5jb250cm9scy5yaWdodHx8Yy5WZWN0b3IuemVybyxrPXIuY29udHJvbHMmJnIuY29udHJvbHMubGVmdHx8Yy5WZWN0b3IuemVybyxiLl9yZWxhdGl2ZT8oZT1hKHEueCtiLl94KSx3PWEocS55K2IuX3kpKTooZT1hKHEueCksdz1hKHEueSkpLHIuX3JlbGF0aXZlPyhxPWEoay54K3IuX3gpLHA9YShrLnkrci5feSkpOihxPWEoay54KSxwPWEoay55KSksaz1hKHIuX3gpLHI9YShyLl95KSxoLmJlemllckN1cnZlVG8oZSx3LHEscCxrLHIpKTticmVhaztjYXNlIGMuQ29tbWFuZHMubGluZTpoLmxpbmVUbyhrLHIpO2JyZWFrO2Nhc2UgYy5Db21tYW5kcy5tb3ZlOnZhciBJPWI7aC5tb3ZlVG8oayxyKX1DJiZoLmNsb3NlUGF0aCgpO2lmKCFuLmlzSGlkZGVuLnRlc3QodSkpe2lmKGQ9dS5fcmVuZGVyZXImJnUuX3JlbmRlcmVyLm9mZnNldCloLnNhdmUoKSxoLnRyYW5zbGF0ZSgtdS5fcmVuZGVyZXIub2Zmc2V0LngsXG4tdS5fcmVuZGVyZXIub2Zmc2V0LnkpLGguc2NhbGUodS5fcmVuZGVyZXIuc2NhbGUueCx1Ll9yZW5kZXJlci5zY2FsZS55KTtoLmZpbGwoKTtkJiZoLnJlc3RvcmUoKX1pZighbi5pc0hpZGRlbi50ZXN0KG0pKXtpZihkPW0uX3JlbmRlcmVyJiZtLl9yZW5kZXJlci5vZmZzZXQpaC5zYXZlKCksaC50cmFuc2xhdGUoLW0uX3JlbmRlcmVyLm9mZnNldC54LC1tLl9yZW5kZXJlci5vZmZzZXQueSksaC5zY2FsZShtLl9yZW5kZXJlci5zY2FsZS54LG0uX3JlbmRlcmVyLnNjYWxlLnkpLGgubGluZVdpZHRoPXgvbS5fcmVuZGVyZXIuc2NhbGUueDtoLnN0cm9rZSgpO2QmJmgucmVzdG9yZSgpfWgucmVzdG9yZSgpfSxnZXRCb3VuZGluZ0NsaWVudFJlY3Q6ZnVuY3Rpb24oYSxjLGQpe3ZhciBmPUluZmluaXR5LGU9LUluZmluaXR5LG49SW5maW5pdHksaD0tSW5maW5pdHk7YS5mb3JFYWNoKGZ1bmN0aW9uKGEpe3ZhciBjPWEueCxkPWEueSxnPWEuY29udHJvbHM7bj1NYXRoLm1pbihkLG4pO2Y9XG5NYXRoLm1pbihjLGYpO2U9TWF0aC5tYXgoYyxlKTtoPU1hdGgubWF4KGQsaCk7aWYoYS5jb250cm9scyl7dmFyIGs9Zy5sZWZ0O3ZhciB0PWcucmlnaHQ7ayYmdCYmKGc9YS5fcmVsYXRpdmU/ay54K2M6ay54LGs9YS5fcmVsYXRpdmU/ay55K2Q6ay55LGM9YS5fcmVsYXRpdmU/dC54K2M6dC54LGE9YS5fcmVsYXRpdmU/dC55K2Q6dC55LGcmJmsmJmMmJmEmJihuPU1hdGgubWluKGssYSxuKSxmPU1hdGgubWluKGcsYyxmKSxlPU1hdGgubWF4KGcsYyxlKSxoPU1hdGgubWF4KGssYSxoKSkpfX0pO2cuaXNOdW1iZXIoYykmJihuLT1jLGYtPWMsZSs9YyxoKz1jKTtkLnRvcD1uO2QubGVmdD1mO2QucmlnaHQ9ZTtkLmJvdHRvbT1oO2Qud2lkdGg9ZS1mO2QuaGVpZ2h0PWgtbjtkLmNlbnRyb2lkfHwoZC5jZW50cm9pZD17fSk7ZC5jZW50cm9pZC54PS1mO2QuY2VudHJvaWQueT0tbn0scmVuZGVyOmZ1bmN0aW9uKGEsZyxlKXtpZighdGhpcy5fdmlzaWJsZXx8IXRoaXMuX29wYWNpdHkpcmV0dXJuIHRoaXM7XG50aGlzLl91cGRhdGUoKTt2YXIgZj10aGlzLnBhcmVudCxoPXRoaXMuX21hdHJpeC5tYW51YWx8fHRoaXMuX2ZsYWdNYXRyaXgsaz10aGlzLl9mbGFnVmVydGljZXN8fHRoaXMuX2ZsYWdGaWxsfHx0aGlzLl9maWxsIGluc3RhbmNlb2YgYy5MaW5lYXJHcmFkaWVudCYmKHRoaXMuX2ZpbGwuX2ZsYWdTcHJlYWR8fHRoaXMuX2ZpbGwuX2ZsYWdTdG9wc3x8dGhpcy5fZmlsbC5fZmxhZ0VuZFBvaW50cyl8fHRoaXMuX2ZpbGwgaW5zdGFuY2VvZiBjLlJhZGlhbEdyYWRpZW50JiYodGhpcy5fZmlsbC5fZmxhZ1NwcmVhZHx8dGhpcy5fZmlsbC5fZmxhZ1N0b3BzfHx0aGlzLl9maWxsLl9mbGFnUmFkaXVzfHx0aGlzLl9maWxsLl9mbGFnQ2VudGVyfHx0aGlzLl9maWxsLl9mbGFnRm9jYWwpfHx0aGlzLl9maWxsIGluc3RhbmNlb2YgYy5UZXh0dXJlJiYodGhpcy5fZmlsbC5fZmxhZ0xvYWRlZCYmdGhpcy5fZmlsbC5sb2FkZWR8fHRoaXMuX2ZpbGwuX2ZsYWdPZmZzZXR8fHRoaXMuX2ZpbGwuX2ZsYWdTY2FsZSl8fFxudGhpcy5fc3Ryb2tlIGluc3RhbmNlb2YgYy5MaW5lYXJHcmFkaWVudCYmKHRoaXMuX3N0cm9rZS5fZmxhZ1NwcmVhZHx8dGhpcy5fc3Ryb2tlLl9mbGFnU3RvcHN8fHRoaXMuX3N0cm9rZS5fZmxhZ0VuZFBvaW50cyl8fHRoaXMuX3N0cm9rZSBpbnN0YW5jZW9mIGMuUmFkaWFsR3JhZGllbnQmJih0aGlzLl9zdHJva2UuX2ZsYWdTcHJlYWR8fHRoaXMuX3N0cm9rZS5fZmxhZ1N0b3BzfHx0aGlzLl9zdHJva2UuX2ZsYWdSYWRpdXN8fHRoaXMuX3N0cm9rZS5fZmxhZ0NlbnRlcnx8dGhpcy5fc3Ryb2tlLl9mbGFnRm9jYWwpfHx0aGlzLl9zdHJva2UgaW5zdGFuY2VvZiBjLlRleHR1cmUmJih0aGlzLl9zdHJva2UuX2ZsYWdMb2FkZWQmJnRoaXMuX3N0cm9rZS5sb2FkZWR8fHRoaXMuX3N0cm9rZS5fZmxhZ09mZnNldHx8dGhpcy5fZmlsbC5fZmxhZ1NjYWxlKXx8dGhpcy5fZmxhZ1N0cm9rZXx8dGhpcy5fZmxhZ0xpbmV3aWR0aHx8dGhpcy5fZmxhZ09wYWNpdHl8fGYuX2ZsYWdPcGFjaXR5fHxcbnRoaXMuX2ZsYWdWaXNpYmxlfHx0aGlzLl9mbGFnQ2FwfHx0aGlzLl9mbGFnSm9pbnx8dGhpcy5fZmxhZ01pdGVyfHx0aGlzLl9mbGFnU2NhbGV8fCF0aGlzLl9yZW5kZXJlci50ZXh0dXJlO2lmKGYuX21hdHJpeC5tYW51YWx8fGYuX2ZsYWdNYXRyaXh8fGgpdGhpcy5fcmVuZGVyZXIubWF0cml4fHwodGhpcy5fcmVuZGVyZXIubWF0cml4PW5ldyBjLkFycmF5KDkpKSx0aGlzLl9tYXRyaXgudG9BcnJheSghMCxkKSxtKGQsZi5fcmVuZGVyZXIubWF0cml4LHRoaXMuX3JlbmRlcmVyLm1hdHJpeCksdGhpcy5fcmVuZGVyZXIuc2NhbGU9dGhpcy5fc2NhbGUqZi5fcmVuZGVyZXIuc2NhbGU7ayYmKHRoaXMuX3JlbmRlcmVyLnJlY3R8fCh0aGlzLl9yZW5kZXJlci5yZWN0PXt9KSx0aGlzLl9yZW5kZXJlci50cmlhbmdsZXN8fCh0aGlzLl9yZW5kZXJlci50cmlhbmdsZXM9bmV3IGMuQXJyYXkoMTIpKSx0aGlzLl9yZW5kZXJlci5vcGFjaXR5PXRoaXMuX29wYWNpdHkqZi5fcmVuZGVyZXIub3BhY2l0eSxcbm4ucGF0aC5nZXRCb3VuZGluZ0NsaWVudFJlY3QodGhpcy5fdmVydGljZXMsdGhpcy5fbGluZXdpZHRoLHRoaXMuX3JlbmRlcmVyLnJlY3QpLG4uZ2V0VHJpYW5nbGVzKHRoaXMuX3JlbmRlcmVyLnJlY3QsdGhpcy5fcmVuZGVyZXIudHJpYW5nbGVzKSxuLnVwZGF0ZUJ1ZmZlci5jYWxsKG4sYSx0aGlzLGcpLG4udXBkYXRlVGV4dHVyZS5jYWxsKG4sYSx0aGlzKSk7aWYoIXRoaXMuX2NsaXB8fGUpcmV0dXJuIGEuYmluZEJ1ZmZlcihhLkFSUkFZX0JVRkZFUix0aGlzLl9yZW5kZXJlci50ZXh0dXJlQ29vcmRzQnVmZmVyKSxhLnZlcnRleEF0dHJpYlBvaW50ZXIoZy50ZXh0dXJlQ29vcmRzLDIsYS5GTE9BVCwhMSwwLDApLGEuYmluZFRleHR1cmUoYS5URVhUVVJFXzJELHRoaXMuX3JlbmRlcmVyLnRleHR1cmUpLGEudW5pZm9ybU1hdHJpeDNmdihnLm1hdHJpeCwhMSx0aGlzLl9yZW5kZXJlci5tYXRyaXgpLGEuYmluZEJ1ZmZlcihhLkFSUkFZX0JVRkZFUix0aGlzLl9yZW5kZXJlci5idWZmZXIpLFxuYS52ZXJ0ZXhBdHRyaWJQb2ludGVyKGcucG9zaXRpb24sMixhLkZMT0FULCExLDAsMCksYS5kcmF3QXJyYXlzKGEuVFJJQU5HTEVTLDAsNiksdGhpcy5mbGFnUmVzZXQoKX19LHRleHQ6e3VwZGF0ZUNhbnZhczpmdW5jdGlvbihjKXt2YXIgZj10aGlzLmNhbnZhcyxkPXRoaXMuY3R4LGU9Yy5fcmVuZGVyZXIuc2NhbGUsaD1jLl9zdHJva2Usaz1jLl9saW5ld2lkdGgqZSxsPWMuX2ZpbGwsbT1jLl9yZW5kZXJlci5vcGFjaXR5fHxjLl9vcGFjaXR5O2Yud2lkdGg9TWF0aC5tYXgoTWF0aC5jZWlsKGMuX3JlbmRlcmVyLnJlY3Qud2lkdGgqZSksMSk7Zi5oZWlnaHQ9TWF0aC5tYXgoTWF0aC5jZWlsKGMuX3JlbmRlcmVyLnJlY3QuaGVpZ2h0KmUpLDEpO3ZhciByPWMuX3JlbmRlcmVyLnJlY3QuY2VudHJvaWQscT1yLngscj1yLnksdz1sLl9yZW5kZXJlciYmbC5fcmVuZGVyZXIub2Zmc2V0JiZoLl9yZW5kZXJlciYmaC5fcmVuZGVyZXIub2Zmc2V0O2QuY2xlYXJSZWN0KDAsMCxmLndpZHRoLFxuZi5oZWlnaHQpO3d8fChkLmZvbnQ9W2MuX3N0eWxlLGMuX3dlaWdodCxjLl9zaXplK1wicHgvXCIrYy5fbGVhZGluZytcInB4XCIsYy5fZmFtaWx5XS5qb2luKFwiIFwiKSk7ZC50ZXh0QWxpZ249XCJjZW50ZXJcIjtkLnRleHRCYXNlbGluZT1cIm1pZGRsZVwiO2wmJihnLmlzU3RyaW5nKGwpP2QuZmlsbFN0eWxlPWw6KG5bbC5fcmVuZGVyZXIudHlwZV0ucmVuZGVyLmNhbGwobCxkLGMpLGQuZmlsbFN0eWxlPWwuX3JlbmRlcmVyLmVmZmVjdCkpO2gmJihnLmlzU3RyaW5nKGgpP2Quc3Ryb2tlU3R5bGU9aDoobltoLl9yZW5kZXJlci50eXBlXS5yZW5kZXIuY2FsbChoLGQsYyksZC5zdHJva2VTdHlsZT1oLl9yZW5kZXJlci5lZmZlY3QpKTtrJiYoZC5saW5lV2lkdGg9ayk7Zy5pc051bWJlcihtKSYmKGQuZ2xvYmFsQWxwaGE9bSk7ZC5zYXZlKCk7ZC5zY2FsZShlLGUpO2QudHJhbnNsYXRlKHEscik7bi5pc0hpZGRlbi50ZXN0KGwpfHwobC5fcmVuZGVyZXImJmwuX3JlbmRlcmVyLm9mZnNldD8oZj1hKGwuX3JlbmRlcmVyLnNjYWxlLngpLFxuZT1hKGwuX3JlbmRlcmVyLnNjYWxlLnkpLGQuc2F2ZSgpLGQudHJhbnNsYXRlKC1hKGwuX3JlbmRlcmVyLm9mZnNldC54KSwtYShsLl9yZW5kZXJlci5vZmZzZXQueSkpLGQuc2NhbGUoZixlKSxmPWMuX3NpemUvbC5fcmVuZGVyZXIuc2NhbGUueSxlPWMuX2xlYWRpbmcvbC5fcmVuZGVyZXIuc2NhbGUueSxkLmZvbnQ9W2MuX3N0eWxlLGMuX3dlaWdodCxhKGYpK1wicHgvXCIsYShlKStcInB4XCIsYy5fZmFtaWx5XS5qb2luKFwiIFwiKSxmPWwuX3JlbmRlcmVyLm9mZnNldC54L2wuX3JlbmRlcmVyLnNjYWxlLngsbD1sLl9yZW5kZXJlci5vZmZzZXQueS9sLl9yZW5kZXJlci5zY2FsZS55LGQuZmlsbFRleHQoYy52YWx1ZSxhKGYpLGEobCkpLGQucmVzdG9yZSgpKTpkLmZpbGxUZXh0KGMudmFsdWUsMCwwKSk7bi5pc0hpZGRlbi50ZXN0KGgpfHwoaC5fcmVuZGVyZXImJmguX3JlbmRlcmVyLm9mZnNldD8oZj1hKGguX3JlbmRlcmVyLnNjYWxlLngpLGU9YShoLl9yZW5kZXJlci5zY2FsZS55KSxkLnNhdmUoKSxcbmQudHJhbnNsYXRlKC1hKGguX3JlbmRlcmVyLm9mZnNldC54KSwtYShoLl9yZW5kZXJlci5vZmZzZXQueSkpLGQuc2NhbGUoZixlKSxmPWMuX3NpemUvaC5fcmVuZGVyZXIuc2NhbGUueSxlPWMuX2xlYWRpbmcvaC5fcmVuZGVyZXIuc2NhbGUueSxkLmZvbnQ9W2MuX3N0eWxlLGMuX3dlaWdodCxhKGYpK1wicHgvXCIsYShlKStcInB4XCIsYy5fZmFtaWx5XS5qb2luKFwiIFwiKSxmPWguX3JlbmRlcmVyLm9mZnNldC54L2guX3JlbmRlcmVyLnNjYWxlLngsbD1oLl9yZW5kZXJlci5vZmZzZXQueS9oLl9yZW5kZXJlci5zY2FsZS55LGg9ay9oLl9yZW5kZXJlci5zY2FsZS54LGQubGluZVdpZHRoPWEoaCksZC5zdHJva2VUZXh0KGMudmFsdWUsYShmKSxhKGwpKSxkLnJlc3RvcmUoKSk6ZC5zdHJva2VUZXh0KGMudmFsdWUsMCwwKSk7ZC5yZXN0b3JlKCl9LGdldEJvdW5kaW5nQ2xpZW50UmVjdDpmdW5jdGlvbihhLGMpe3ZhciBmPW4uY3R4O2YuZm9udD1bYS5fc3R5bGUsYS5fd2VpZ2h0LGEuX3NpemUrXG5cInB4L1wiK2EuX2xlYWRpbmcrXCJweFwiLGEuX2ZhbWlseV0uam9pbihcIiBcIik7Zi50ZXh0QWxpZ249XCJjZW50ZXJcIjtmLnRleHRCYXNlbGluZT1hLl9iYXNlbGluZTt2YXIgZj1mLm1lYXN1cmVUZXh0KGEuX3ZhbHVlKS53aWR0aCxkPU1hdGgubWF4KGEuX3NpemV8fGEuX2xlYWRpbmcpO3RoaXMuX2xpbmV3aWR0aCYmIW4uaXNIaWRkZW4udGVzdCh0aGlzLl9zdHJva2UpJiYoZCs9dGhpcy5fbGluZXdpZHRoKTt2YXIgZT1mLzIsZz1kLzI7c3dpdGNoKG4uYWxpZ25tZW50c1thLl9hbGlnbm1lbnRdfHxhLl9hbGlnbm1lbnQpe2Nhc2Ugbi5hbGlnbm1lbnRzLmxlZnQ6Yy5sZWZ0PTA7Yy5yaWdodD1mO2JyZWFrO2Nhc2Ugbi5hbGlnbm1lbnRzLnJpZ2h0OmMubGVmdD0tZjtjLnJpZ2h0PTA7YnJlYWs7ZGVmYXVsdDpjLmxlZnQ9LWUsYy5yaWdodD1lfXN3aXRjaChhLl9iYXNlbGluZSl7Y2FzZSBcImJvdHRvbVwiOmMudG9wPS1kO2MuYm90dG9tPTA7YnJlYWs7Y2FzZSBcInRvcFwiOmMudG9wPTA7Yy5ib3R0b209XG5kO2JyZWFrO2RlZmF1bHQ6Yy50b3A9LWcsYy5ib3R0b209Z31jLndpZHRoPWY7Yy5oZWlnaHQ9ZDtjLmNlbnRyb2lkfHwoYy5jZW50cm9pZD17fSk7Yy5jZW50cm9pZC54PWU7Yy5jZW50cm9pZC55PWd9LHJlbmRlcjpmdW5jdGlvbihhLGUsZyl7aWYoIXRoaXMuX3Zpc2libGV8fCF0aGlzLl9vcGFjaXR5KXJldHVybiB0aGlzO3RoaXMuX3VwZGF0ZSgpO3ZhciBmPXRoaXMucGFyZW50LGg9dGhpcy5fbWF0cml4Lm1hbnVhbHx8dGhpcy5fZmxhZ01hdHJpeCxrPXRoaXMuX2ZsYWdWZXJ0aWNlc3x8dGhpcy5fZmxhZ0ZpbGx8fHRoaXMuX2ZpbGwgaW5zdGFuY2VvZiBjLkxpbmVhckdyYWRpZW50JiYodGhpcy5fZmlsbC5fZmxhZ1NwcmVhZHx8dGhpcy5fZmlsbC5fZmxhZ1N0b3BzfHx0aGlzLl9maWxsLl9mbGFnRW5kUG9pbnRzKXx8dGhpcy5fZmlsbCBpbnN0YW5jZW9mIGMuUmFkaWFsR3JhZGllbnQmJih0aGlzLl9maWxsLl9mbGFnU3ByZWFkfHx0aGlzLl9maWxsLl9mbGFnU3RvcHN8fHRoaXMuX2ZpbGwuX2ZsYWdSYWRpdXN8fFxudGhpcy5fZmlsbC5fZmxhZ0NlbnRlcnx8dGhpcy5fZmlsbC5fZmxhZ0ZvY2FsKXx8dGhpcy5fZmlsbCBpbnN0YW5jZW9mIGMuVGV4dHVyZSYmdGhpcy5fZmlsbC5fZmxhZ0xvYWRlZCYmdGhpcy5fZmlsbC5sb2FkZWR8fHRoaXMuX3N0cm9rZSBpbnN0YW5jZW9mIGMuTGluZWFyR3JhZGllbnQmJih0aGlzLl9zdHJva2UuX2ZsYWdTcHJlYWR8fHRoaXMuX3N0cm9rZS5fZmxhZ1N0b3BzfHx0aGlzLl9zdHJva2UuX2ZsYWdFbmRQb2ludHMpfHx0aGlzLl9zdHJva2UgaW5zdGFuY2VvZiBjLlJhZGlhbEdyYWRpZW50JiYodGhpcy5fc3Ryb2tlLl9mbGFnU3ByZWFkfHx0aGlzLl9zdHJva2UuX2ZsYWdTdG9wc3x8dGhpcy5fc3Ryb2tlLl9mbGFnUmFkaXVzfHx0aGlzLl9zdHJva2UuX2ZsYWdDZW50ZXJ8fHRoaXMuX3N0cm9rZS5fZmxhZ0ZvY2FsKXx8dGhpcy5fdGV4dHVyZSBpbnN0YW5jZW9mIGMuVGV4dHVyZSYmdGhpcy5fdGV4dHVyZS5fZmxhZ0xvYWRlZCYmdGhpcy5fdGV4dHVyZS5sb2FkZWR8fFxudGhpcy5fZmxhZ1N0cm9rZXx8dGhpcy5fZmxhZ0xpbmV3aWR0aHx8dGhpcy5fZmxhZ09wYWNpdHl8fGYuX2ZsYWdPcGFjaXR5fHx0aGlzLl9mbGFnVmlzaWJsZXx8dGhpcy5fZmxhZ1NjYWxlfHx0aGlzLl9mbGFnVmFsdWV8fHRoaXMuX2ZsYWdGYW1pbHl8fHRoaXMuX2ZsYWdTaXplfHx0aGlzLl9mbGFnTGVhZGluZ3x8dGhpcy5fZmxhZ0FsaWdubWVudHx8dGhpcy5fZmxhZ0Jhc2VsaW5lfHx0aGlzLl9mbGFnU3R5bGV8fHRoaXMuX2ZsYWdXZWlnaHR8fHRoaXMuX2ZsYWdEZWNvcmF0aW9ufHwhdGhpcy5fcmVuZGVyZXIudGV4dHVyZTtpZihmLl9tYXRyaXgubWFudWFsfHxmLl9mbGFnTWF0cml4fHxoKXRoaXMuX3JlbmRlcmVyLm1hdHJpeHx8KHRoaXMuX3JlbmRlcmVyLm1hdHJpeD1uZXcgYy5BcnJheSg5KSksdGhpcy5fbWF0cml4LnRvQXJyYXkoITAsZCksbShkLGYuX3JlbmRlcmVyLm1hdHJpeCx0aGlzLl9yZW5kZXJlci5tYXRyaXgpLHRoaXMuX3JlbmRlcmVyLnNjYWxlPXRoaXMuX3NjYWxlKlxuZi5fcmVuZGVyZXIuc2NhbGU7ayYmKHRoaXMuX3JlbmRlcmVyLnJlY3R8fCh0aGlzLl9yZW5kZXJlci5yZWN0PXt9KSx0aGlzLl9yZW5kZXJlci50cmlhbmdsZXN8fCh0aGlzLl9yZW5kZXJlci50cmlhbmdsZXM9bmV3IGMuQXJyYXkoMTIpKSx0aGlzLl9yZW5kZXJlci5vcGFjaXR5PXRoaXMuX29wYWNpdHkqZi5fcmVuZGVyZXIub3BhY2l0eSxuLnRleHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KHRoaXMsdGhpcy5fcmVuZGVyZXIucmVjdCksbi5nZXRUcmlhbmdsZXModGhpcy5fcmVuZGVyZXIucmVjdCx0aGlzLl9yZW5kZXJlci50cmlhbmdsZXMpLG4udXBkYXRlQnVmZmVyLmNhbGwobixhLHRoaXMsZSksbi51cGRhdGVUZXh0dXJlLmNhbGwobixhLHRoaXMpKTtpZighdGhpcy5fY2xpcHx8ZylyZXR1cm4gYS5iaW5kQnVmZmVyKGEuQVJSQVlfQlVGRkVSLHRoaXMuX3JlbmRlcmVyLnRleHR1cmVDb29yZHNCdWZmZXIpLGEudmVydGV4QXR0cmliUG9pbnRlcihlLnRleHR1cmVDb29yZHMsXG4yLGEuRkxPQVQsITEsMCwwKSxhLmJpbmRUZXh0dXJlKGEuVEVYVFVSRV8yRCx0aGlzLl9yZW5kZXJlci50ZXh0dXJlKSxhLnVuaWZvcm1NYXRyaXgzZnYoZS5tYXRyaXgsITEsdGhpcy5fcmVuZGVyZXIubWF0cml4KSxhLmJpbmRCdWZmZXIoYS5BUlJBWV9CVUZGRVIsdGhpcy5fcmVuZGVyZXIuYnVmZmVyKSxhLnZlcnRleEF0dHJpYlBvaW50ZXIoZS5wb3NpdGlvbiwyLGEuRkxPQVQsITEsMCwwKSxhLmRyYXdBcnJheXMoYS5UUklBTkdMRVMsMCw2KSx0aGlzLmZsYWdSZXNldCgpfX0sXCJsaW5lYXItZ3JhZGllbnRcIjp7cmVuZGVyOmZ1bmN0aW9uKGEsYyl7aWYoYS5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpKXt0aGlzLl91cGRhdGUoKTtpZighdGhpcy5fcmVuZGVyZXIuZWZmZWN0fHx0aGlzLl9mbGFnRW5kUG9pbnRzfHx0aGlzLl9mbGFnU3RvcHMpZm9yKHRoaXMuX3JlbmRlcmVyLmVmZmVjdD1hLmNyZWF0ZUxpbmVhckdyYWRpZW50KHRoaXMubGVmdC5feCx0aGlzLmxlZnQuX3ksdGhpcy5yaWdodC5feCxcbnRoaXMucmlnaHQuX3kpLGE9MDthPHRoaXMuc3RvcHMubGVuZ3RoO2ErKyljPXRoaXMuc3RvcHNbYV0sdGhpcy5fcmVuZGVyZXIuZWZmZWN0LmFkZENvbG9yU3RvcChjLl9vZmZzZXQsYy5fY29sb3IpO3JldHVybiB0aGlzLmZsYWdSZXNldCgpfX19LFwicmFkaWFsLWdyYWRpZW50XCI6e3JlbmRlcjpmdW5jdGlvbihhLGMpe2lmKGEuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKSl7dGhpcy5fdXBkYXRlKCk7aWYoIXRoaXMuX3JlbmRlcmVyLmVmZmVjdHx8dGhpcy5fZmxhZ0NlbnRlcnx8dGhpcy5fZmxhZ0ZvY2FsfHx0aGlzLl9mbGFnUmFkaXVzfHx0aGlzLl9mbGFnU3RvcHMpZm9yKHRoaXMuX3JlbmRlcmVyLmVmZmVjdD1hLmNyZWF0ZVJhZGlhbEdyYWRpZW50KHRoaXMuY2VudGVyLl94LHRoaXMuY2VudGVyLl95LDAsdGhpcy5mb2NhbC5feCx0aGlzLmZvY2FsLl95LHRoaXMuX3JhZGl1cyksYT0wO2E8dGhpcy5zdG9wcy5sZW5ndGg7YSsrKWM9dGhpcy5zdG9wc1thXSx0aGlzLl9yZW5kZXJlci5lZmZlY3QuYWRkQ29sb3JTdG9wKGMuX29mZnNldCxcbmMuX2NvbG9yKTtyZXR1cm4gdGhpcy5mbGFnUmVzZXQoKX19fSx0ZXh0dXJlOntyZW5kZXI6ZnVuY3Rpb24oYSxkKXtpZihhLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIikpe3RoaXMuX3VwZGF0ZSgpO2Q9dGhpcy5pbWFnZTtpZighdGhpcy5fcmVuZGVyZXIuZWZmZWN0fHwodGhpcy5fZmxhZ0xvYWRlZHx8dGhpcy5fZmxhZ1JlcGVhdCkmJnRoaXMubG9hZGVkKXRoaXMuX3JlbmRlcmVyLmVmZmVjdD1hLmNyZWF0ZVBhdHRlcm4oZCx0aGlzLl9yZXBlYXQpO2lmKHRoaXMuX2ZsYWdPZmZzZXR8fHRoaXMuX2ZsYWdMb2FkZWR8fHRoaXMuX2ZsYWdTY2FsZSl0aGlzLl9yZW5kZXJlci5vZmZzZXQgaW5zdGFuY2VvZiBjLlZlY3Rvcnx8KHRoaXMuX3JlbmRlcmVyLm9mZnNldD1uZXcgYy5WZWN0b3IpLHRoaXMuX3JlbmRlcmVyLm9mZnNldC54PXRoaXMuX29mZnNldC54LHRoaXMuX3JlbmRlcmVyLm9mZnNldC55PXRoaXMuX29mZnNldC55LGQmJih0aGlzLl9yZW5kZXJlci5vZmZzZXQueC09ZC53aWR0aC9cbjIsdGhpcy5fcmVuZGVyZXIub2Zmc2V0LnkrPWQuaGVpZ2h0LzIsdGhpcy5fc2NhbGUgaW5zdGFuY2VvZiBjLlZlY3Rvcj8odGhpcy5fcmVuZGVyZXIub2Zmc2V0LngqPXRoaXMuX3NjYWxlLngsdGhpcy5fcmVuZGVyZXIub2Zmc2V0LnkqPXRoaXMuX3NjYWxlLnkpOih0aGlzLl9yZW5kZXJlci5vZmZzZXQueCo9dGhpcy5fc2NhbGUsdGhpcy5fcmVuZGVyZXIub2Zmc2V0LnkqPXRoaXMuX3NjYWxlKSk7aWYodGhpcy5fZmxhZ1NjYWxlfHx0aGlzLl9mbGFnTG9hZGVkKXRoaXMuX3JlbmRlcmVyLnNjYWxlIGluc3RhbmNlb2YgYy5WZWN0b3J8fCh0aGlzLl9yZW5kZXJlci5zY2FsZT1uZXcgYy5WZWN0b3IpLHRoaXMuX3NjYWxlIGluc3RhbmNlb2YgYy5WZWN0b3I/dGhpcy5fcmVuZGVyZXIuc2NhbGUuY29weSh0aGlzLl9zY2FsZSk6dGhpcy5fcmVuZGVyZXIuc2NhbGUuc2V0KHRoaXMuX3NjYWxlLHRoaXMuX3NjYWxlKTtyZXR1cm4gdGhpcy5mbGFnUmVzZXQoKX19fSxnZXRUcmlhbmdsZXM6ZnVuY3Rpb24oYSxcbmMpe3ZhciBmPWEudG9wLGQ9YS5sZWZ0LGU9YS5yaWdodDthPWEuYm90dG9tO2NbMF09ZDtjWzFdPWY7Y1syXT1lO2NbM109ZjtjWzRdPWQ7Y1s1XT1hO2NbNl09ZDtjWzddPWE7Y1s4XT1lO2NbOV09ZjtjWzEwXT1lO2NbMTFdPWF9LHVwZGF0ZVRleHR1cmU6ZnVuY3Rpb24oYSxjKXt0aGlzW2MuX3JlbmRlcmVyLnR5cGVdLnVwZGF0ZUNhbnZhcy5jYWxsKG4sYyk7Yy5fcmVuZGVyZXIudGV4dHVyZSYmYS5kZWxldGVUZXh0dXJlKGMuX3JlbmRlcmVyLnRleHR1cmUpO2EuYmluZEJ1ZmZlcihhLkFSUkFZX0JVRkZFUixjLl9yZW5kZXJlci50ZXh0dXJlQ29vcmRzQnVmZmVyKTtjLl9yZW5kZXJlci50ZXh0dXJlPWEuY3JlYXRlVGV4dHVyZSgpO2EuYmluZFRleHR1cmUoYS5URVhUVVJFXzJELGMuX3JlbmRlcmVyLnRleHR1cmUpO2EudGV4UGFyYW1ldGVyaShhLlRFWFRVUkVfMkQsYS5URVhUVVJFX1dSQVBfUyxhLkNMQU1QX1RPX0VER0UpO2EudGV4UGFyYW1ldGVyaShhLlRFWFRVUkVfMkQsXG5hLlRFWFRVUkVfV1JBUF9ULGEuQ0xBTVBfVE9fRURHRSk7YS50ZXhQYXJhbWV0ZXJpKGEuVEVYVFVSRV8yRCxhLlRFWFRVUkVfTUlOX0ZJTFRFUixhLkxJTkVBUik7MD49dGhpcy5jYW52YXMud2lkdGh8fDA+PXRoaXMuY2FudmFzLmhlaWdodHx8YS50ZXhJbWFnZTJEKGEuVEVYVFVSRV8yRCwwLGEuUkdCQSxhLlJHQkEsYS5VTlNJR05FRF9CWVRFLHRoaXMuY2FudmFzKX0sdXBkYXRlQnVmZmVyOmZ1bmN0aW9uKGEsYyxkKXtnLmlzT2JqZWN0KGMuX3JlbmRlcmVyLmJ1ZmZlcikmJmEuZGVsZXRlQnVmZmVyKGMuX3JlbmRlcmVyLmJ1ZmZlcik7Yy5fcmVuZGVyZXIuYnVmZmVyPWEuY3JlYXRlQnVmZmVyKCk7YS5iaW5kQnVmZmVyKGEuQVJSQVlfQlVGRkVSLGMuX3JlbmRlcmVyLmJ1ZmZlcik7YS5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShkLnBvc2l0aW9uKTthLmJ1ZmZlckRhdGEoYS5BUlJBWV9CVUZGRVIsYy5fcmVuZGVyZXIudHJpYW5nbGVzLGEuU1RBVElDX0RSQVcpO2cuaXNPYmplY3QoYy5fcmVuZGVyZXIudGV4dHVyZUNvb3Jkc0J1ZmZlcikmJlxuYS5kZWxldGVCdWZmZXIoYy5fcmVuZGVyZXIudGV4dHVyZUNvb3Jkc0J1ZmZlcik7Yy5fcmVuZGVyZXIudGV4dHVyZUNvb3Jkc0J1ZmZlcj1hLmNyZWF0ZUJ1ZmZlcigpO2EuYmluZEJ1ZmZlcihhLkFSUkFZX0JVRkZFUixjLl9yZW5kZXJlci50ZXh0dXJlQ29vcmRzQnVmZmVyKTthLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGQudGV4dHVyZUNvb3Jkcyk7YS5idWZmZXJEYXRhKGEuQVJSQVlfQlVGRkVSLHRoaXMudXYsYS5TVEFUSUNfRFJBVyl9LHByb2dyYW06e2NyZWF0ZTpmdW5jdGlvbihhLGQpe3ZhciBmPWEuY3JlYXRlUHJvZ3JhbSgpO2cuZWFjaChkLGZ1bmN0aW9uKGMpe2EuYXR0YWNoU2hhZGVyKGYsYyl9KTthLmxpbmtQcm9ncmFtKGYpO2lmKCFhLmdldFByb2dyYW1QYXJhbWV0ZXIoZixhLkxJTktfU1RBVFVTKSl0aHJvdyBkPWEuZ2V0UHJvZ3JhbUluZm9Mb2coZiksYS5kZWxldGVQcm9ncmFtKGYpLG5ldyBjLlV0aWxzLkVycm9yKFwidW5hYmxlIHRvIGxpbmsgcHJvZ3JhbTogXCIrXG5kKTtyZXR1cm4gZn19LHNoYWRlcnM6e2NyZWF0ZTpmdW5jdGlvbihhLGQsZSl7ZT1hLmNyZWF0ZVNoYWRlcihhW2VdKTthLnNoYWRlclNvdXJjZShlLGQpO2EuY29tcGlsZVNoYWRlcihlKTtpZighYS5nZXRTaGFkZXJQYXJhbWV0ZXIoZSxhLkNPTVBJTEVfU1RBVFVTKSl0aHJvdyBkPWEuZ2V0U2hhZGVySW5mb0xvZyhlKSxhLmRlbGV0ZVNoYWRlcihlKSxuZXcgYy5VdGlscy5FcnJvcihcInVuYWJsZSB0byBjb21waWxlIHNoYWRlciBcIitlK1wiOiBcIitkKTtyZXR1cm4gZX0sdHlwZXM6e3ZlcnRleDpcIlZFUlRFWF9TSEFERVJcIixmcmFnbWVudDpcIkZSQUdNRU5UX1NIQURFUlwifSx2ZXJ0ZXg6XCJhdHRyaWJ1dGUgdmVjMiBhX3Bvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFfdGV4dHVyZUNvb3JkcztcXG5cXG51bmlmb3JtIG1hdDMgdV9tYXRyaXg7XFxudW5pZm9ybSB2ZWMyIHVfcmVzb2x1dGlvbjtcXG5cXG52YXJ5aW5nIHZlYzIgdl90ZXh0dXJlQ29vcmRzO1xcblxcbnZvaWQgbWFpbigpIHtcXG4gICB2ZWMyIHByb2plY3RlZCBcXHgzZCAodV9tYXRyaXggKiB2ZWMzKGFfcG9zaXRpb24sIDEuMCkpLnh5O1xcbiAgIHZlYzIgbm9ybWFsIFxceDNkIHByb2plY3RlZCAvIHVfcmVzb2x1dGlvbjtcXG4gICB2ZWMyIGNsaXBzcGFjZSBcXHgzZCAobm9ybWFsICogMi4wKSAtIDEuMDtcXG5cXG4gICBnbF9Qb3NpdGlvbiBcXHgzZCB2ZWM0KGNsaXBzcGFjZSAqIHZlYzIoMS4wLCAtMS4wKSwgMC4wLCAxLjApO1xcbiAgIHZfdGV4dHVyZUNvb3JkcyBcXHgzZCBhX3RleHR1cmVDb29yZHM7XFxufVwiLFxuZnJhZ21lbnQ6XCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB1X2ltYWdlO1xcbnZhcnlpbmcgdmVjMiB2X3RleHR1cmVDb29yZHM7XFxuXFxudm9pZCBtYWluKCkge1xcbiAgZ2xfRnJhZ0NvbG9yIFxceDNkIHRleHR1cmUyRCh1X2ltYWdlLCB2X3RleHR1cmVDb29yZHMpO1xcbn1cIn0sVGV4dHVyZVJlZ2lzdHJ5Om5ldyBjLlJlZ2lzdHJ5fTtuLmN0eD1uLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7az1jW2MuVHlwZXMud2ViZ2xdPWZ1bmN0aW9uKGEpe3RoaXMuZG9tRWxlbWVudD1hLmRvbUVsZW1lbnR8fGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7dGhpcy5zY2VuZT1uZXcgYy5Hcm91cDt0aGlzLnNjZW5lLnBhcmVudD10aGlzO3RoaXMuX3JlbmRlcmVyPXttYXRyaXg6bmV3IGMuQXJyYXkoaCksc2NhbGU6MSxvcGFjaXR5OjF9O3RoaXMuX2ZsYWdNYXRyaXg9ITA7YT1nLmRlZmF1bHRzKGF8fHt9LHthbnRpYWxpYXM6ITEsYWxwaGE6ITAscHJlbXVsdGlwbGllZEFscGhhOiEwLFxuc3RlbmNpbDohMCxwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6ITAsb3ZlcmRyYXc6ITF9KTt0aGlzLm92ZXJkcmF3PWEub3ZlcmRyYXc7YT10aGlzLmN0eD10aGlzLmRvbUVsZW1lbnQuZ2V0Q29udGV4dChcIndlYmdsXCIsYSl8fHRoaXMuZG9tRWxlbWVudC5nZXRDb250ZXh0KFwiZXhwZXJpbWVudGFsLXdlYmdsXCIsYSk7aWYoIXRoaXMuY3R4KXRocm93IG5ldyBjLlV0aWxzLkVycm9yKFwidW5hYmxlIHRvIGNyZWF0ZSBhIHdlYmdsIGNvbnRleHQuIFRyeSB1c2luZyBhbm90aGVyIHJlbmRlcmVyLlwiKTt2YXIgZD1uLnNoYWRlcnMuY3JlYXRlKGEsbi5zaGFkZXJzLnZlcnRleCxuLnNoYWRlcnMudHlwZXMudmVydGV4KTt2YXIgZj1uLnNoYWRlcnMuY3JlYXRlKGEsbi5zaGFkZXJzLmZyYWdtZW50LG4uc2hhZGVycy50eXBlcy5mcmFnbWVudCk7dGhpcy5wcm9ncmFtPW4ucHJvZ3JhbS5jcmVhdGUoYSxbZCxmXSk7YS51c2VQcm9ncmFtKHRoaXMucHJvZ3JhbSk7dGhpcy5wcm9ncmFtLnBvc2l0aW9uPVxuYS5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLnByb2dyYW0sXCJhX3Bvc2l0aW9uXCIpO3RoaXMucHJvZ3JhbS5tYXRyaXg9YS5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtLFwidV9tYXRyaXhcIik7dGhpcy5wcm9ncmFtLnRleHR1cmVDb29yZHM9YS5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLnByb2dyYW0sXCJhX3RleHR1cmVDb29yZHNcIik7YS5kaXNhYmxlKGEuREVQVEhfVEVTVCk7YS5lbmFibGUoYS5CTEVORCk7YS5ibGVuZEVxdWF0aW9uU2VwYXJhdGUoYS5GVU5DX0FERCxhLkZVTkNfQUREKTthLmJsZW5kRnVuY1NlcGFyYXRlKGEuU1JDX0FMUEhBLGEuT05FX01JTlVTX1NSQ19BTFBIQSxhLk9ORSxhLk9ORV9NSU5VU19TUkNfQUxQSEEpfTtnLmV4dGVuZChrLHtVdGlsczpufSk7Zy5leHRlbmQoay5wcm90b3R5cGUsYy5VdGlscy5FdmVudHMse3NldFNpemU6ZnVuY3Rpb24oYSxjLGQpe3RoaXMud2lkdGg9YTt0aGlzLmhlaWdodD1jO3RoaXMucmF0aW89Zy5pc1VuZGVmaW5lZChkKT9cbmUodGhpcy5jdHgpOmQ7dGhpcy5kb21FbGVtZW50LndpZHRoPWEqdGhpcy5yYXRpbzt0aGlzLmRvbUVsZW1lbnQuaGVpZ2h0PWMqdGhpcy5yYXRpbztnLmV4dGVuZCh0aGlzLmRvbUVsZW1lbnQuc3R5bGUse3dpZHRoOmErXCJweFwiLGhlaWdodDpjK1wicHhcIn0pO2EqPXRoaXMucmF0aW87Yyo9dGhpcy5yYXRpbzt0aGlzLl9yZW5kZXJlci5tYXRyaXhbMF09dGhpcy5fcmVuZGVyZXIubWF0cml4WzRdPXRoaXMuX3JlbmRlcmVyLnNjYWxlPXRoaXMucmF0aW87dGhpcy5fZmxhZ01hdHJpeD0hMDt0aGlzLmN0eC52aWV3cG9ydCgwLDAsYSxjKTtkPXRoaXMuY3R4LmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW0sXCJ1X3Jlc29sdXRpb25cIik7dGhpcy5jdHgudW5pZm9ybTJmKGQsYSxjKTtyZXR1cm4gdGhpc30scmVuZGVyOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5jdHg7dGhpcy5vdmVyZHJhd3x8YS5jbGVhcihhLkNPTE9SX0JVRkZFUl9CSVR8YS5ERVBUSF9CVUZGRVJfQklUKTtuLmdyb3VwLnJlbmRlci5jYWxsKHRoaXMuc2NlbmUsXG5hLHRoaXMucHJvZ3JhbSk7dGhpcy5fZmxhZ01hdHJpeD0hMTtyZXR1cm4gdGhpc319KX0pKChcInVuZGVmaW5lZFwiIT09dHlwZW9mIGdsb2JhbD9nbG9iYWw6dGhpcykuVHdvKTtcbihmdW5jdGlvbihjKXt2YXIgaz1jLlV0aWxzLG09Yy5TaGFwZT1mdW5jdGlvbigpe3RoaXMuX3JlbmRlcmVyPXt9O3RoaXMuX3JlbmRlcmVyLmZsYWdNYXRyaXg9ay5iaW5kKG0uRmxhZ01hdHJpeCx0aGlzKTt0aGlzLmlzU2hhcGU9ITA7dGhpcy5pZD1jLklkZW50aWZpZXIrYy51bmlxdWVJZCgpO3RoaXMuY2xhc3NMaXN0PVtdO3RoaXMuX21hdHJpeD1uZXcgYy5NYXRyaXg7dGhpcy50cmFuc2xhdGlvbj1uZXcgYy5WZWN0b3I7dGhpcy5yb3RhdGlvbj0wO3RoaXMuc2NhbGU9MX07ay5leHRlbmQobSx7RmxhZ01hdHJpeDpmdW5jdGlvbigpe3RoaXMuX2ZsYWdNYXRyaXg9ITB9LE1ha2VPYnNlcnZhYmxlOmZ1bmN0aW9uKGspe09iamVjdC5kZWZpbmVQcm9wZXJ0eShrLFwidHJhbnNsYXRpb25cIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdHJhbnNsYXRpb259LHNldDpmdW5jdGlvbihoKXt0aGlzLl90cmFuc2xhdGlvbiYmdGhpcy5fdHJhbnNsYXRpb24udW5iaW5kKGMuRXZlbnRzLmNoYW5nZSxcbnRoaXMuX3JlbmRlcmVyLmZsYWdNYXRyaXgpO3RoaXMuX3RyYW5zbGF0aW9uPWg7dGhpcy5fdHJhbnNsYXRpb24uYmluZChjLkV2ZW50cy5jaGFuZ2UsdGhpcy5fcmVuZGVyZXIuZmxhZ01hdHJpeCk7bS5GbGFnTWF0cml4LmNhbGwodGhpcyl9fSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGssXCJyb3RhdGlvblwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9yb3RhdGlvbn0sc2V0OmZ1bmN0aW9uKGMpe3RoaXMuX3JvdGF0aW9uPWM7dGhpcy5fZmxhZ01hdHJpeD0hMH19KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoayxcInNjYWxlXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NjYWxlfSxzZXQ6ZnVuY3Rpb24oaCl7dGhpcy5fc2NhbGUgaW5zdGFuY2VvZiBjLlZlY3RvciYmdGhpcy5fc2NhbGUudW5iaW5kKGMuRXZlbnRzLmNoYW5nZSx0aGlzLl9yZW5kZXJlci5mbGFnTWF0cml4KTt0aGlzLl9zY2FsZT1oO3RoaXMuX3NjYWxlIGluc3RhbmNlb2ZcbmMuVmVjdG9yJiZ0aGlzLl9zY2FsZS5iaW5kKGMuRXZlbnRzLmNoYW5nZSx0aGlzLl9yZW5kZXJlci5mbGFnTWF0cml4KTt0aGlzLl9mbGFnU2NhbGU9dGhpcy5fZmxhZ01hdHJpeD0hMH19KX19KTtrLmV4dGVuZChtLnByb3RvdHlwZSxjLlV0aWxzLkV2ZW50cyx7X2ZsYWdNYXRyaXg6ITAsX2ZsYWdTY2FsZTohMSxfcm90YXRpb246MCxfc2NhbGU6MSxfdHJhbnNsYXRpb246bnVsbCxhZGRUbzpmdW5jdGlvbihjKXtjLmFkZCh0aGlzKTtyZXR1cm4gdGhpc30sY2xvbmU6ZnVuY3Rpb24oKXt2YXIgYz1uZXcgbTtjLnRyYW5zbGF0aW9uLmNvcHkodGhpcy50cmFuc2xhdGlvbik7Yy5yb3RhdGlvbj10aGlzLnJvdGF0aW9uO2Muc2NhbGU9dGhpcy5zY2FsZTtrLmVhY2gobS5Qcm9wZXJ0aWVzLGZ1bmN0aW9uKGgpe2NbaF09dGhpc1toXX0sdGhpcyk7cmV0dXJuIGMuX3VwZGF0ZSgpfSxfdXBkYXRlOmZ1bmN0aW9uKGspeyF0aGlzLl9tYXRyaXgubWFudWFsJiZ0aGlzLl9mbGFnTWF0cml4JiZcbih0aGlzLl9tYXRyaXguaWRlbnRpdHkoKS50cmFuc2xhdGUodGhpcy50cmFuc2xhdGlvbi54LHRoaXMudHJhbnNsYXRpb24ueSksdGhpcy5fc2NhbGUgaW5zdGFuY2VvZiBjLlZlY3Rvcj90aGlzLl9tYXRyaXguc2NhbGUodGhpcy5fc2NhbGUueCx0aGlzLl9zY2FsZS55KTp0aGlzLl9tYXRyaXguc2NhbGUodGhpcy5fc2NhbGUpLHRoaXMuX21hdHJpeC5yb3RhdGUodGhpcy5yb3RhdGlvbikpO2smJnRoaXMucGFyZW50JiZ0aGlzLnBhcmVudC5fdXBkYXRlJiZ0aGlzLnBhcmVudC5fdXBkYXRlKCk7cmV0dXJuIHRoaXN9LGZsYWdSZXNldDpmdW5jdGlvbigpe3RoaXMuX2ZsYWdNYXRyaXg9dGhpcy5fZmxhZ1NjYWxlPSExO3JldHVybiB0aGlzfX0pO20uTWFrZU9ic2VydmFibGUobS5wcm90b3R5cGUpfSkoKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgZ2xvYmFsP2dsb2JhbDp0aGlzKS5Ud28pO1xuKGZ1bmN0aW9uKGMpe2Z1bmN0aW9uIGsoYSxkLGUpe3ZhciBmPWQuY29udHJvbHMmJmQuY29udHJvbHMucmlnaHQsZz1hLmNvbnRyb2xzJiZhLmNvbnRyb2xzLmxlZnQ7dmFyIG49ZC54O3ZhciBoPWQueTt2YXIgaz0oZnx8ZCkueDt2YXIgbD0oZnx8ZCkueTt2YXIgbT0oZ3x8YSkueDt2YXIgdD0oZ3x8YSkueTt2YXIgdz1hLng7dmFyIHA9YS55O2YmJmQuX3JlbGF0aXZlJiYoays9ZC54LGwrPWQueSk7ZyYmYS5fcmVsYXRpdmUmJihtKz1hLngsdCs9YS55KTtyZXR1cm4gYy5VdGlscy5nZXRDdXJ2ZUxlbmd0aChuLGgsayxsLG0sdCx3LHAsZSl9ZnVuY3Rpb24gbShhLGQsZSl7dmFyIGY9ZC5jb250cm9scyYmZC5jb250cm9scy5yaWdodCxnPWEuY29udHJvbHMmJmEuY29udHJvbHMubGVmdDt2YXIgaD1kLng7dmFyIG49ZC55O3ZhciBrPShmfHxkKS54O3ZhciBsPShmfHxkKS55O3ZhciBtPShnfHxhKS54O3ZhciB0PShnfHxhKS55O3ZhciB3PWEueDt2YXIgcD1hLnk7ZiYmZC5fcmVsYXRpdmUmJlxuKGsrPWQueCxsKz1kLnkpO2cmJmEuX3JlbGF0aXZlJiYobSs9YS54LHQrPWEueSk7cmV0dXJuIGMuVXRpbHMuc3ViZGl2aWRlKGgsbixrLGwsbSx0LHcscCxlKX12YXIgbD1NYXRoLm1pbixoPU1hdGgubWF4LGQ9TWF0aC5yb3VuZCxlPWMuVXRpbHMuZ2V0Q29tcHV0ZWRNYXRyaXgsYT1jLlV0aWxzO2EuZWFjaChjLkNvbW1hbmRzLGZ1bmN0aW9uKGEsYyl7fSk7dmFyIGc9Yy5QYXRoPWZ1bmN0aW9uKGQsZixlLGgpe2MuU2hhcGUuY2FsbCh0aGlzKTt0aGlzLl9yZW5kZXJlci50eXBlPVwicGF0aFwiO3RoaXMuX3JlbmRlcmVyLmZsYWdWZXJ0aWNlcz1hLmJpbmQoZy5GbGFnVmVydGljZXMsdGhpcyk7dGhpcy5fcmVuZGVyZXIuYmluZFZlcnRpY2VzPWEuYmluZChnLkJpbmRWZXJ0aWNlcyx0aGlzKTt0aGlzLl9yZW5kZXJlci51bmJpbmRWZXJ0aWNlcz1hLmJpbmQoZy5VbmJpbmRWZXJ0aWNlcyx0aGlzKTt0aGlzLl9yZW5kZXJlci5mbGFnRmlsbD1hLmJpbmQoZy5GbGFnRmlsbCx0aGlzKTtcbnRoaXMuX3JlbmRlcmVyLmZsYWdTdHJva2U9YS5iaW5kKGcuRmxhZ1N0cm9rZSx0aGlzKTt0aGlzLl9jbG9zZWQ9ISFmO3RoaXMuX2N1cnZlZD0hIWU7dGhpcy5iZWdpbm5pbmc9MDt0aGlzLmVuZGluZz0xO3RoaXMuZmlsbD1cIiNmZmZcIjt0aGlzLnN0cm9rZT1cIiMwMDBcIjt0aGlzLm9wYWNpdHk9dGhpcy5saW5ld2lkdGg9MTt0aGlzLnZpc2libGU9ITA7dGhpcy5jYXA9XCJidXR0XCI7dGhpcy5qb2luPVwibWl0ZXJcIjt0aGlzLm1pdGVyPTQ7dGhpcy5fdmVydGljZXM9W107dGhpcy52ZXJ0aWNlcz1kO3RoaXMuYXV0b21hdGljPSFofTthLmV4dGVuZChnLHtQcm9wZXJ0aWVzOlwiZmlsbCBzdHJva2UgbGluZXdpZHRoIG9wYWNpdHkgdmlzaWJsZSBjYXAgam9pbiBtaXRlciBjbG9zZWQgY3VydmVkIGF1dG9tYXRpYyBiZWdpbm5pbmcgZW5kaW5nXCIuc3BsaXQoXCIgXCIpLEZsYWdWZXJ0aWNlczpmdW5jdGlvbigpe3RoaXMuX2ZsYWdMZW5ndGg9dGhpcy5fZmxhZ1ZlcnRpY2VzPSEwfSxCaW5kVmVydGljZXM6ZnVuY3Rpb24oYSl7Zm9yKHZhciBkPVxuYS5sZW5ndGg7ZC0tOylhW2RdLmJpbmQoYy5FdmVudHMuY2hhbmdlLHRoaXMuX3JlbmRlcmVyLmZsYWdWZXJ0aWNlcyk7dGhpcy5fcmVuZGVyZXIuZmxhZ1ZlcnRpY2VzKCl9LFVuYmluZFZlcnRpY2VzOmZ1bmN0aW9uKGEpe2Zvcih2YXIgZD1hLmxlbmd0aDtkLS07KWFbZF0udW5iaW5kKGMuRXZlbnRzLmNoYW5nZSx0aGlzLl9yZW5kZXJlci5mbGFnVmVydGljZXMpO3RoaXMuX3JlbmRlcmVyLmZsYWdWZXJ0aWNlcygpfSxGbGFnRmlsbDpmdW5jdGlvbigpe3RoaXMuX2ZsYWdGaWxsPSEwfSxGbGFnU3Ryb2tlOmZ1bmN0aW9uKCl7dGhpcy5fZmxhZ1N0cm9rZT0hMH0sTWFrZU9ic2VydmFibGU6ZnVuY3Rpb24oZCl7Yy5TaGFwZS5NYWtlT2JzZXJ2YWJsZShkKTthLmVhY2goZy5Qcm9wZXJ0aWVzLnNsaWNlKDIsOCksYy5VdGlscy5kZWZpbmVQcm9wZXJ0eSxkKTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZCxcImZpbGxcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZmlsbH0sXG5zZXQ6ZnVuY3Rpb24oYSl7KHRoaXMuX2ZpbGwgaW5zdGFuY2VvZiBjLkdyYWRpZW50fHx0aGlzLl9maWxsIGluc3RhbmNlb2YgYy5MaW5lYXJHcmFkaWVudHx8dGhpcy5fZmlsbCBpbnN0YW5jZW9mIGMuUmFkaWFsR3JhZGllbnR8fHRoaXMuX2ZpbGwgaW5zdGFuY2VvZiBjLlRleHR1cmUpJiZ0aGlzLl9maWxsLnVuYmluZChjLkV2ZW50cy5jaGFuZ2UsdGhpcy5fcmVuZGVyZXIuZmxhZ0ZpbGwpO3RoaXMuX2ZpbGw9YTt0aGlzLl9mbGFnRmlsbD0hMDsodGhpcy5fZmlsbCBpbnN0YW5jZW9mIGMuR3JhZGllbnR8fHRoaXMuX2ZpbGwgaW5zdGFuY2VvZiBjLkxpbmVhckdyYWRpZW50fHx0aGlzLl9maWxsIGluc3RhbmNlb2YgYy5SYWRpYWxHcmFkaWVudHx8dGhpcy5fZmlsbCBpbnN0YW5jZW9mIGMuVGV4dHVyZSkmJnRoaXMuX2ZpbGwuYmluZChjLkV2ZW50cy5jaGFuZ2UsdGhpcy5fcmVuZGVyZXIuZmxhZ0ZpbGwpfX0pO09iamVjdC5kZWZpbmVQcm9wZXJ0eShkLFwic3Ryb2tlXCIse2VudW1lcmFibGU6ITAsXG5nZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc3Ryb2tlfSxzZXQ6ZnVuY3Rpb24oYSl7KHRoaXMuX3N0cm9rZSBpbnN0YW5jZW9mIGMuR3JhZGllbnR8fHRoaXMuX3N0cm9rZSBpbnN0YW5jZW9mIGMuTGluZWFyR3JhZGllbnR8fHRoaXMuX3N0cm9rZSBpbnN0YW5jZW9mIGMuUmFkaWFsR3JhZGllbnR8fHRoaXMuX3N0cm9rZSBpbnN0YW5jZW9mIGMuVGV4dHVyZSkmJnRoaXMuX3N0cm9rZS51bmJpbmQoYy5FdmVudHMuY2hhbmdlLHRoaXMuX3JlbmRlcmVyLmZsYWdTdHJva2UpO3RoaXMuX3N0cm9rZT1hO3RoaXMuX2ZsYWdTdHJva2U9ITA7KHRoaXMuX3N0cm9rZSBpbnN0YW5jZW9mIGMuR3JhZGllbnR8fHRoaXMuX3N0cm9rZSBpbnN0YW5jZW9mIGMuTGluZWFyR3JhZGllbnR8fHRoaXMuX3N0cm9rZSBpbnN0YW5jZW9mIGMuUmFkaWFsR3JhZGllbnR8fHRoaXMuX3N0cm9rZSBpbnN0YW5jZW9mIGMuVGV4dHVyZSkmJnRoaXMuX3N0cm9rZS5iaW5kKGMuRXZlbnRzLmNoYW5nZSx0aGlzLl9yZW5kZXJlci5mbGFnU3Ryb2tlKX19KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShkLFwibGVuZ3RoXCIse2dldDpmdW5jdGlvbigpe3RoaXMuX2ZsYWdMZW5ndGgmJnRoaXMuX3VwZGF0ZUxlbmd0aCgpO3JldHVybiB0aGlzLl9sZW5ndGh9fSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGQsXCJjbG9zZWRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY2xvc2VkfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy5fY2xvc2VkPSEhYTt0aGlzLl9mbGFnVmVydGljZXM9ITB9fSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGQsXCJjdXJ2ZWRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY3VydmVkfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy5fY3VydmVkPSEhYTt0aGlzLl9mbGFnVmVydGljZXM9ITB9fSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGQsXCJhdXRvbWF0aWNcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXV0b21hdGljfSxzZXQ6ZnVuY3Rpb24oYyl7aWYoYyE9PVxudGhpcy5fYXV0b21hdGljKXt2YXIgZD0odGhpcy5fYXV0b21hdGljPSEhYyk/XCJpZ25vcmVcIjpcImxpc3RlblwiO2EuZWFjaCh0aGlzLnZlcnRpY2VzLGZ1bmN0aW9uKGEpe2FbZF0oKX0pfX19KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZCxcImJlZ2lubmluZ1wiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9iZWdpbm5pbmd9LHNldDpmdW5jdGlvbihhKXt0aGlzLl9iZWdpbm5pbmc9YTt0aGlzLl9mbGFnVmVydGljZXM9ITB9fSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGQsXCJlbmRpbmdcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZW5kaW5nfSxzZXQ6ZnVuY3Rpb24oYSl7dGhpcy5fZW5kaW5nPWE7dGhpcy5fZmxhZ1ZlcnRpY2VzPSEwfX0pO09iamVjdC5kZWZpbmVQcm9wZXJ0eShkLFwidmVydGljZXNcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29sbGVjdGlvbn0sc2V0OmZ1bmN0aW9uKGEpe3ZhciBkPVxudGhpcy5fcmVuZGVyZXIuYmluZFZlcnRpY2VzLGU9dGhpcy5fcmVuZGVyZXIudW5iaW5kVmVydGljZXM7dGhpcy5fY29sbGVjdGlvbiYmdGhpcy5fY29sbGVjdGlvbi51bmJpbmQoYy5FdmVudHMuaW5zZXJ0LGQpLnVuYmluZChjLkV2ZW50cy5yZW1vdmUsZSk7dGhpcy5fY29sbGVjdGlvbj1uZXcgYy5VdGlscy5Db2xsZWN0aW9uKChhfHxbXSkuc2xpY2UoMCkpO3RoaXMuX2NvbGxlY3Rpb24uYmluZChjLkV2ZW50cy5pbnNlcnQsZCkuYmluZChjLkV2ZW50cy5yZW1vdmUsZSk7ZCh0aGlzLl9jb2xsZWN0aW9uKX19KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZCxcImNsaXBcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY2xpcH0sc2V0OmZ1bmN0aW9uKGEpe3RoaXMuX2NsaXA9YTt0aGlzLl9mbGFnQ2xpcD0hMH19KX19KTthLmV4dGVuZChnLnByb3RvdHlwZSxjLlNoYXBlLnByb3RvdHlwZSx7X2ZsYWdWZXJ0aWNlczohMCxfZmxhZ0xlbmd0aDohMCxfZmxhZ0ZpbGw6ITAsXG5fZmxhZ1N0cm9rZTohMCxfZmxhZ0xpbmV3aWR0aDohMCxfZmxhZ09wYWNpdHk6ITAsX2ZsYWdWaXNpYmxlOiEwLF9mbGFnQ2FwOiEwLF9mbGFnSm9pbjohMCxfZmxhZ01pdGVyOiEwLF9mbGFnQ2xpcDohMSxfbGVuZ3RoOjAsX2ZpbGw6XCIjZmZmXCIsX3N0cm9rZTpcIiMwMDBcIixfbGluZXdpZHRoOjEsX29wYWNpdHk6MSxfdmlzaWJsZTohMCxfY2FwOlwicm91bmRcIixfam9pbjpcInJvdW5kXCIsX21pdGVyOjQsX2Nsb3NlZDohMCxfY3VydmVkOiExLF9hdXRvbWF0aWM6ITAsX2JlZ2lubmluZzowLF9lbmRpbmc6MSxfY2xpcDohMSxjbG9uZTpmdW5jdGlvbihkKXtkPWR8fHRoaXMucGFyZW50O3ZhciBlPWEubWFwKHRoaXMudmVydGljZXMsZnVuY3Rpb24oYSl7cmV0dXJuIGEuY2xvbmUoKX0pLGg9bmV3IGcoZSx0aGlzLmNsb3NlZCx0aGlzLmN1cnZlZCwhdGhpcy5hdXRvbWF0aWMpO2EuZWFjaChjLlBhdGguUHJvcGVydGllcyxmdW5jdGlvbihhKXtoW2FdPXRoaXNbYV19LHRoaXMpO2gudHJhbnNsYXRpb24uY29weSh0aGlzLnRyYW5zbGF0aW9uKTtcbmgucm90YXRpb249dGhpcy5yb3RhdGlvbjtoLnNjYWxlPXRoaXMuc2NhbGU7ZCYmZC5hZGQoaCk7cmV0dXJuIGh9LHRvT2JqZWN0OmZ1bmN0aW9uKCl7dmFyIGQ9e3ZlcnRpY2VzOmEubWFwKHRoaXMudmVydGljZXMsZnVuY3Rpb24oYSl7cmV0dXJuIGEudG9PYmplY3QoKX0pfTthLmVhY2goYy5TaGFwZS5Qcm9wZXJ0aWVzLGZ1bmN0aW9uKGEpe2RbYV09dGhpc1thXX0sdGhpcyk7ZC50cmFuc2xhdGlvbj10aGlzLnRyYW5zbGF0aW9uLnRvT2JqZWN0O2Qucm90YXRpb249dGhpcy5yb3RhdGlvbjtkLnNjYWxlPXRoaXMuc2NhbGU7cmV0dXJuIGR9LG5vRmlsbDpmdW5jdGlvbigpe3RoaXMuZmlsbD1cInRyYW5zcGFyZW50XCI7cmV0dXJuIHRoaXN9LG5vU3Ryb2tlOmZ1bmN0aW9uKCl7dGhpcy5zdHJva2U9XCJ0cmFuc3BhcmVudFwiO3JldHVybiB0aGlzfSxjb3JuZXI6ZnVuY3Rpb24oKXt2YXIgYz10aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCghMCk7Yy5jZW50cm9pZD17eDpjLmxlZnQrYy53aWR0aC9cbjIseTpjLnRvcCtjLmhlaWdodC8yfTthLmVhY2godGhpcy52ZXJ0aWNlcyxmdW5jdGlvbihhKXthLmFkZFNlbGYoYy5jZW50cm9pZCl9KTtyZXR1cm4gdGhpc30sY2VudGVyOmZ1bmN0aW9uKCl7dmFyIGM9dGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoITApO2MuY2VudHJvaWQ9e3g6Yy5sZWZ0K2Mud2lkdGgvMix5OmMudG9wK2MuaGVpZ2h0LzJ9O2EuZWFjaCh0aGlzLnZlcnRpY2VzLGZ1bmN0aW9uKGEpe2Euc3ViU2VsZihjLmNlbnRyb2lkKX0pO3JldHVybiB0aGlzfSxyZW1vdmU6ZnVuY3Rpb24oKXtpZighdGhpcy5wYXJlbnQpcmV0dXJuIHRoaXM7dGhpcy5wYXJlbnQucmVtb3ZlKHRoaXMpO3JldHVybiB0aGlzfSxnZXRCb3VuZGluZ0NsaWVudFJlY3Q6ZnVuY3Rpb24oYSl7dmFyIGMsZD1JbmZpbml0eSxnPS1JbmZpbml0eSxrPUluZmluaXR5LG49LUluZmluaXR5O3RoaXMuX3VwZGF0ZSghMCk7YT1hP3RoaXMuX21hdHJpeDplKHRoaXMpO3ZhciBtPXRoaXMubGluZXdpZHRoL1xuMjt2YXIgeD10aGlzLl92ZXJ0aWNlcy5sZW5ndGg7aWYoMD49eCl7dmFyIHU9YS5tdWx0aXBseSgwLDAsMSk7cmV0dXJue3RvcDp1LnksbGVmdDp1LngscmlnaHQ6dS54LGJvdHRvbTp1Lnksd2lkdGg6MCxoZWlnaHQ6MH19Zm9yKGM9MDtjPHg7YysrKXt1PXRoaXMuX3ZlcnRpY2VzW2NdO3ZhciByPXUueDt1PXUueTt1PWEubXVsdGlwbHkocix1LDEpO2s9bCh1LnktbSxrKTtkPWwodS54LW0sZCk7Zz1oKHUueCttLGcpO249aCh1LnkrbSxuKX1yZXR1cm57dG9wOmssbGVmdDpkLHJpZ2h0OmcsYm90dG9tOm4sd2lkdGg6Zy1kLGhlaWdodDpuLWt9fSxnZXRQb2ludEF0OmZ1bmN0aW9uKGQsZSl7dmFyIGcsZjt2YXIgaD10aGlzLmxlbmd0aCpNYXRoLm1pbihNYXRoLm1heChkLDApLDEpO3ZhciBrPXRoaXMudmVydGljZXMubGVuZ3RoO3ZhciBuPWstMTt2YXIgbD1nPW51bGw7dmFyIG09MDt2YXIgcj10aGlzLl9sZW5ndGhzLmxlbmd0aDtmb3IoZj0wO208cjttKyspe2lmKGYrdGhpcy5fbGVuZ3Roc1ttXT49XG5oKXt0aGlzLl9jbG9zZWQ/KGc9Yy5VdGlscy5tb2QobSxrKSxsPWMuVXRpbHMubW9kKG0tMSxrKSwwPT09bSYmKGc9bCxsPW0pKTooZz1tLGw9TWF0aC5taW4oTWF0aC5tYXgobS0xLDApLG4pKTtnPXRoaXMudmVydGljZXNbZ107bD10aGlzLnZlcnRpY2VzW2xdO2gtPWY7MCE9PXRoaXMuX2xlbmd0aHNbbV0mJihkPWgvdGhpcy5fbGVuZ3Roc1ttXSk7YnJlYWt9Zis9dGhpcy5fbGVuZ3Roc1ttXX1pZihhLmlzTnVsbChnKXx8YS5pc051bGwobCkpcmV0dXJuIG51bGw7dmFyIHE9bC5jb250cm9scyYmbC5jb250cm9scy5yaWdodDt2YXIgdz1nLmNvbnRyb2xzJiZnLmNvbnRyb2xzLmxlZnQ7bj1sLng7aD1sLnk7cj0ocXx8bCkueDttPShxfHxsKS55O3ZhciBwPSh3fHxnKS54O2Y9KHd8fGcpLnk7dmFyIEM9Zy54O2s9Zy55O3EmJmwuX3JlbGF0aXZlJiYocis9bC54LG0rPWwueSk7dyYmZy5fcmVsYXRpdmUmJihwKz1nLngsZis9Zy55KTtnPWMuVXRpbHMuZ2V0UG9pbnRPbkN1YmljQmV6aWVyKGQsXG5uLHIscCxDKTtkPWMuVXRpbHMuZ2V0UG9pbnRPbkN1YmljQmV6aWVyKGQsaCxtLGYsayk7cmV0dXJuIGEuaXNPYmplY3QoZSk/KGUueD1nLGUueT1kLGUpOm5ldyBjLlZlY3RvcihnLGQpfSxwbG90OmZ1bmN0aW9uKCl7aWYodGhpcy5jdXJ2ZWQpcmV0dXJuIGMuVXRpbHMuZ2V0Q3VydmVGcm9tUG9pbnRzKHRoaXMuX3ZlcnRpY2VzLHRoaXMuY2xvc2VkKSx0aGlzO2Zvcih2YXIgYT0wO2E8dGhpcy5fdmVydGljZXMubGVuZ3RoO2ErKyl0aGlzLl92ZXJ0aWNlc1thXS5fY29tbWFuZD0wPT09YT9jLkNvbW1hbmRzLm1vdmU6Yy5Db21tYW5kcy5saW5lO3JldHVybiB0aGlzfSxzdWJkaXZpZGU6ZnVuY3Rpb24oZCl7dGhpcy5fdXBkYXRlKCk7dmFyIGU9dGhpcy52ZXJ0aWNlcy5sZW5ndGgtMSxnPXRoaXMudmVydGljZXNbZV0saD10aGlzLl9jbG9zZWR8fHRoaXMudmVydGljZXNbZV0uX2NvbW1hbmQ9PT1jLkNvbW1hbmRzLmNsb3NlLGs9W107YS5lYWNoKHRoaXMudmVydGljZXMsZnVuY3Rpb24oZixcbm4pe2lmKCEoMD49bil8fGgpaWYoZi5jb21tYW5kPT09Yy5Db21tYW5kcy5tb3ZlKWsucHVzaChuZXcgYy5BbmNob3IoZy54LGcueSkpLDA8biYmKGtbay5sZW5ndGgtMV0uY29tbWFuZD1jLkNvbW1hbmRzLmxpbmUpO2Vsc2V7dmFyIGw9bShmLGcsZCk7az1rLmNvbmNhdChsKTthLmVhY2gobCxmdW5jdGlvbihhLGQpe2EuY29tbWFuZD0wPj1kJiZnLmNvbW1hbmQ9PT1jLkNvbW1hbmRzLm1vdmU/Yy5Db21tYW5kcy5tb3ZlOmMuQ29tbWFuZHMubGluZX0pO24+PWUmJih0aGlzLl9jbG9zZWQmJnRoaXMuX2F1dG9tYXRpYz8oZz1mLGw9bShmLGcsZCksaz1rLmNvbmNhdChsKSxhLmVhY2gobCxmdW5jdGlvbihhLGQpe2EuY29tbWFuZD0wPj1kJiZnLmNvbW1hbmQ9PT1jLkNvbW1hbmRzLm1vdmU/Yy5Db21tYW5kcy5tb3ZlOmMuQ29tbWFuZHMubGluZX0pKTpoJiZrLnB1c2gobmV3IGMuQW5jaG9yKGYueCxmLnkpKSxrW2subGVuZ3RoLTFdLmNvbW1hbmQ9aD9jLkNvbW1hbmRzLmNsb3NlOlxuYy5Db21tYW5kcy5saW5lKX1nPWZ9LHRoaXMpO3RoaXMuX2N1cnZlZD10aGlzLl9hdXRvbWF0aWM9ITE7dGhpcy52ZXJ0aWNlcz1rO3JldHVybiB0aGlzfSxfdXBkYXRlTGVuZ3RoOmZ1bmN0aW9uKGQpe3RoaXMuX3VwZGF0ZSgpO3ZhciBlPXRoaXMudmVydGljZXMubGVuZ3RoLGc9ZS0xLGg9dGhpcy52ZXJ0aWNlc1tnXSxuPXRoaXMuX2Nsb3NlZHx8dGhpcy52ZXJ0aWNlc1tnXS5fY29tbWFuZD09PWMuQ29tbWFuZHMuY2xvc2UsbD0wO2EuaXNVbmRlZmluZWQodGhpcy5fbGVuZ3RocykmJih0aGlzLl9sZW5ndGhzPVtdKTthLmVhY2godGhpcy52ZXJ0aWNlcyxmdW5jdGlvbihhLGYpezA+PWYmJiFufHxhLmNvbW1hbmQ9PT1jLkNvbW1hbmRzLm1vdmU/KGg9YSx0aGlzLl9sZW5ndGhzW2ZdPTApOih0aGlzLl9sZW5ndGhzW2ZdPWsoYSxoLGQpLGwrPXRoaXMuX2xlbmd0aHNbZl0sZj49ZyYmbiYmKGg9dGhpcy52ZXJ0aWNlc1soZisxKSVlXSx0aGlzLl9sZW5ndGhzW2YrMV09ayhhLGgsXG5kKSxsKz10aGlzLl9sZW5ndGhzW2YrMV0pLGg9YSl9LHRoaXMpO3RoaXMuX2xlbmd0aD1sO3JldHVybiB0aGlzfSxfdXBkYXRlOmZ1bmN0aW9uKCl7aWYodGhpcy5fZmxhZ1ZlcnRpY2VzKXt2YXIgYT10aGlzLnZlcnRpY2VzLmxlbmd0aC0xO3ZhciBlPWQodGhpcy5fYmVnaW5uaW5nKmEpO2E9ZCh0aGlzLl9lbmRpbmcqYSk7dGhpcy5fdmVydGljZXMubGVuZ3RoPTA7Zm9yKHZhciBnPWU7ZzxhKzE7ZysrKWU9dGhpcy52ZXJ0aWNlc1tnXSx0aGlzLl92ZXJ0aWNlcy5wdXNoKGUpO3RoaXMuX2F1dG9tYXRpYyYmdGhpcy5wbG90KCl9Yy5TaGFwZS5wcm90b3R5cGUuX3VwZGF0ZS5hcHBseSh0aGlzLGFyZ3VtZW50cyk7cmV0dXJuIHRoaXN9LGZsYWdSZXNldDpmdW5jdGlvbigpe3RoaXMuX2ZsYWdWZXJ0aWNlcz10aGlzLl9mbGFnRmlsbD10aGlzLl9mbGFnU3Ryb2tlPXRoaXMuX2ZsYWdMaW5ld2lkdGg9dGhpcy5fZmxhZ09wYWNpdHk9dGhpcy5fZmxhZ1Zpc2libGU9dGhpcy5fZmxhZ0NhcD1cbnRoaXMuX2ZsYWdKb2luPXRoaXMuX2ZsYWdNaXRlcj10aGlzLl9mbGFnQ2xpcD0hMTtjLlNoYXBlLnByb3RvdHlwZS5mbGFnUmVzZXQuY2FsbCh0aGlzKTtyZXR1cm4gdGhpc319KTtnLk1ha2VPYnNlcnZhYmxlKGcucHJvdG90eXBlKX0pKChcInVuZGVmaW5lZFwiIT09dHlwZW9mIGdsb2JhbD9nbG9iYWw6dGhpcykuVHdvKTsoZnVuY3Rpb24oYyl7dmFyIGs9Yy5QYXRoLG09Yy5VdGlscyxsPWMuTGluZT1mdW5jdGlvbihoLGQsZSxhKXtlPShlLWgpLzI7YT0oYS1kKS8yO2suY2FsbCh0aGlzLFtuZXcgYy5BbmNob3IoLWUsLWEpLG5ldyBjLkFuY2hvcihlLGEpXSk7dGhpcy50cmFuc2xhdGlvbi5zZXQoaCtlLGQrYSl9O20uZXh0ZW5kKGwucHJvdG90eXBlLGsucHJvdG90eXBlKTtrLk1ha2VPYnNlcnZhYmxlKGwucHJvdG90eXBlKX0pKChcInVuZGVmaW5lZFwiIT09dHlwZW9mIGdsb2JhbD9nbG9iYWw6dGhpcykuVHdvKTtcbihmdW5jdGlvbihjKXt2YXIgaz1jLlBhdGgsbT1jLlV0aWxzLGw9Yy5SZWN0YW5nbGU9ZnVuY3Rpb24oaCxkLGUsYSl7ay5jYWxsKHRoaXMsW25ldyBjLkFuY2hvcixuZXcgYy5BbmNob3IsbmV3IGMuQW5jaG9yLG5ldyBjLkFuY2hvcl0sITApO3RoaXMud2lkdGg9ZTt0aGlzLmhlaWdodD1hO3RoaXMuX3VwZGF0ZSgpO3RoaXMudHJhbnNsYXRpb24uc2V0KGgsZCl9O20uZXh0ZW5kKGwse1Byb3BlcnRpZXM6W1wid2lkdGhcIixcImhlaWdodFwiXSxNYWtlT2JzZXJ2YWJsZTpmdW5jdGlvbihoKXtrLk1ha2VPYnNlcnZhYmxlKGgpO20uZWFjaChsLlByb3BlcnRpZXMsYy5VdGlscy5kZWZpbmVQcm9wZXJ0eSxoKX19KTttLmV4dGVuZChsLnByb3RvdHlwZSxrLnByb3RvdHlwZSx7X3dpZHRoOjAsX2hlaWdodDowLF9mbGFnV2lkdGg6MCxfZmxhZ0hlaWdodDowLF91cGRhdGU6ZnVuY3Rpb24oKXtpZih0aGlzLl9mbGFnV2lkdGh8fHRoaXMuX2ZsYWdIZWlnaHQpe3ZhciBjPXRoaXMuX3dpZHRoLzIsXG5kPXRoaXMuX2hlaWdodC8yO3RoaXMudmVydGljZXNbMF0uc2V0KC1jLC1kKTt0aGlzLnZlcnRpY2VzWzFdLnNldChjLC1kKTt0aGlzLnZlcnRpY2VzWzJdLnNldChjLGQpO3RoaXMudmVydGljZXNbM10uc2V0KC1jLGQpfWsucHJvdG90eXBlLl91cGRhdGUuY2FsbCh0aGlzKTtyZXR1cm4gdGhpc30sZmxhZ1Jlc2V0OmZ1bmN0aW9uKCl7dGhpcy5fZmxhZ1dpZHRoPXRoaXMuX2ZsYWdIZWlnaHQ9ITE7ay5wcm90b3R5cGUuZmxhZ1Jlc2V0LmNhbGwodGhpcyk7cmV0dXJuIHRoaXN9fSk7bC5NYWtlT2JzZXJ2YWJsZShsLnByb3RvdHlwZSl9KSgoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBnbG9iYWw/Z2xvYmFsOnRoaXMpLlR3byk7XG4oZnVuY3Rpb24oYyl7dmFyIGs9Yy5QYXRoLG09MipNYXRoLlBJLGw9TWF0aC5jb3MsaD1NYXRoLnNpbixkPWMuVXRpbHMsZT1jLkVsbGlwc2U9ZnVuY3Rpb24oYSxlLGgsZil7ZC5pc051bWJlcihmKXx8KGY9aCk7dmFyIGc9ZC5tYXAoZC5yYW5nZShjLlJlc29sdXRpb24pLGZ1bmN0aW9uKGEpe3JldHVybiBuZXcgYy5BbmNob3J9LHRoaXMpO2suY2FsbCh0aGlzLGcsITAsITApO3RoaXMud2lkdGg9MipoO3RoaXMuaGVpZ2h0PTIqZjt0aGlzLl91cGRhdGUoKTt0aGlzLnRyYW5zbGF0aW9uLnNldChhLGUpfTtkLmV4dGVuZChlLHtQcm9wZXJ0aWVzOltcIndpZHRoXCIsXCJoZWlnaHRcIl0sTWFrZU9ic2VydmFibGU6ZnVuY3Rpb24oYSl7ay5NYWtlT2JzZXJ2YWJsZShhKTtkLmVhY2goZS5Qcm9wZXJ0aWVzLGMuVXRpbHMuZGVmaW5lUHJvcGVydHksYSl9fSk7ZC5leHRlbmQoZS5wcm90b3R5cGUsay5wcm90b3R5cGUse193aWR0aDowLF9oZWlnaHQ6MCxfZmxhZ1dpZHRoOiExLF9mbGFnSGVpZ2h0OiExLFxuX3VwZGF0ZTpmdW5jdGlvbigpe2lmKHRoaXMuX2ZsYWdXaWR0aHx8dGhpcy5fZmxhZ0hlaWdodClmb3IodmFyIGE9MCxjPXRoaXMudmVydGljZXMubGVuZ3RoO2E8YzthKyspe3ZhciBkPWEvYyptLGU9dGhpcy5fd2lkdGgqbChkKS8yLGQ9dGhpcy5faGVpZ2h0KmgoZCkvMjt0aGlzLnZlcnRpY2VzW2FdLnNldChlLGQpfWsucHJvdG90eXBlLl91cGRhdGUuY2FsbCh0aGlzKTtyZXR1cm4gdGhpc30sZmxhZ1Jlc2V0OmZ1bmN0aW9uKCl7dGhpcy5fZmxhZ1dpZHRoPXRoaXMuX2ZsYWdIZWlnaHQ9ITE7ay5wcm90b3R5cGUuZmxhZ1Jlc2V0LmNhbGwodGhpcyk7cmV0dXJuIHRoaXN9fSk7ZS5NYWtlT2JzZXJ2YWJsZShlLnByb3RvdHlwZSl9KSgoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBnbG9iYWw/Z2xvYmFsOnRoaXMpLlR3byk7XG4oZnVuY3Rpb24oYyl7dmFyIGs9Yy5QYXRoLG09MipNYXRoLlBJLGw9TWF0aC5jb3MsaD1NYXRoLnNpbixkPWMuVXRpbHMsZT1jLkNpcmNsZT1mdW5jdGlvbihhLGUsaCl7dmFyIGc9ZC5tYXAoZC5yYW5nZShjLlJlc29sdXRpb24pLGZ1bmN0aW9uKGEpe3JldHVybiBuZXcgYy5BbmNob3J9LHRoaXMpO2suY2FsbCh0aGlzLGcsITAsITApO3RoaXMucmFkaXVzPWg7dGhpcy5fdXBkYXRlKCk7dGhpcy50cmFuc2xhdGlvbi5zZXQoYSxlKX07ZC5leHRlbmQoZSx7UHJvcGVydGllczpbXCJyYWRpdXNcIl0sTWFrZU9ic2VydmFibGU6ZnVuY3Rpb24oYSl7ay5NYWtlT2JzZXJ2YWJsZShhKTtkLmVhY2goZS5Qcm9wZXJ0aWVzLGMuVXRpbHMuZGVmaW5lUHJvcGVydHksYSl9fSk7ZC5leHRlbmQoZS5wcm90b3R5cGUsay5wcm90b3R5cGUse19yYWRpdXM6MCxfZmxhZ1JhZGl1czohMSxfdXBkYXRlOmZ1bmN0aW9uKCl7aWYodGhpcy5fZmxhZ1JhZGl1cylmb3IodmFyIGE9MCxjPXRoaXMudmVydGljZXMubGVuZ3RoO2E8XG5jO2ErKyl7dmFyIGQ9YS9jKm0sZT10aGlzLl9yYWRpdXMqbChkKSxkPXRoaXMuX3JhZGl1cypoKGQpO3RoaXMudmVydGljZXNbYV0uc2V0KGUsZCl9ay5wcm90b3R5cGUuX3VwZGF0ZS5jYWxsKHRoaXMpO3JldHVybiB0aGlzfSxmbGFnUmVzZXQ6ZnVuY3Rpb24oKXt0aGlzLl9mbGFnUmFkaXVzPSExO2sucHJvdG90eXBlLmZsYWdSZXNldC5jYWxsKHRoaXMpO3JldHVybiB0aGlzfX0pO2UuTWFrZU9ic2VydmFibGUoZS5wcm90b3R5cGUpfSkoKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgZ2xvYmFsP2dsb2JhbDp0aGlzKS5Ud28pO1xuKGZ1bmN0aW9uKGMpe3ZhciBrPWMuUGF0aCxtPTIqTWF0aC5QSSxsPU1hdGguY29zLGg9TWF0aC5zaW4sZD1jLlV0aWxzLGU9Yy5Qb2x5Z29uPWZ1bmN0aW9uKGEsZSxoLGYpe2Y9TWF0aC5tYXgoZnx8MCwzKTt2YXIgZz1kLm1hcChkLnJhbmdlKGYpLGZ1bmN0aW9uKGEpe3JldHVybiBuZXcgYy5BbmNob3J9KTtrLmNhbGwodGhpcyxnLCEwKTt0aGlzLndpZHRoPTIqaDt0aGlzLmhlaWdodD0yKmg7dGhpcy5zaWRlcz1mO3RoaXMuX3VwZGF0ZSgpO3RoaXMudHJhbnNsYXRpb24uc2V0KGEsZSl9O2QuZXh0ZW5kKGUse1Byb3BlcnRpZXM6W1wid2lkdGhcIixcImhlaWdodFwiLFwic2lkZXNcIl0sTWFrZU9ic2VydmFibGU6ZnVuY3Rpb24oYSl7ay5NYWtlT2JzZXJ2YWJsZShhKTtkLmVhY2goZS5Qcm9wZXJ0aWVzLGMuVXRpbHMuZGVmaW5lUHJvcGVydHksYSl9fSk7ZC5leHRlbmQoZS5wcm90b3R5cGUsay5wcm90b3R5cGUse193aWR0aDowLF9oZWlnaHQ6MCxfc2lkZXM6MCxfZmxhZ1dpZHRoOiExLFxuX2ZsYWdIZWlnaHQ6ITEsX2ZsYWdTaWRlczohMSxfdXBkYXRlOmZ1bmN0aW9uKCl7aWYodGhpcy5fZmxhZ1dpZHRofHx0aGlzLl9mbGFnSGVpZ2h0fHx0aGlzLl9mbGFnU2lkZXMpe3ZhciBhPXRoaXMuX3NpZGVzLGQ9dGhpcy52ZXJ0aWNlcy5sZW5ndGg7ZD5hJiZ0aGlzLnZlcnRpY2VzLnNwbGljZShhLTEsZC1hKTtmb3IodmFyIGU9MDtlPGE7ZSsrKXt2YXIgZj0oZSsuNSkvYSptK01hdGguUEkvMix0PXRoaXMuX3dpZHRoKmwoZiksZj10aGlzLl9oZWlnaHQqaChmKTtlPj1kP3RoaXMudmVydGljZXMucHVzaChuZXcgYy5BbmNob3IodCxmKSk6dGhpcy52ZXJ0aWNlc1tlXS5zZXQodCxmKX19ay5wcm90b3R5cGUuX3VwZGF0ZS5jYWxsKHRoaXMpO3JldHVybiB0aGlzfSxmbGFnUmVzZXQ6ZnVuY3Rpb24oKXt0aGlzLl9mbGFnV2lkdGg9dGhpcy5fZmxhZ0hlaWdodD10aGlzLl9mbGFnU2lkZXM9ITE7ay5wcm90b3R5cGUuZmxhZ1Jlc2V0LmNhbGwodGhpcyk7cmV0dXJuIHRoaXN9fSk7XG5lLk1ha2VPYnNlcnZhYmxlKGUucHJvdG90eXBlKX0pKChcInVuZGVmaW5lZFwiIT09dHlwZW9mIGdsb2JhbD9nbG9iYWw6dGhpcykuVHdvKTtcbihmdW5jdGlvbihjKXtmdW5jdGlvbiBrKGEsYyl7Zm9yKDswPmE7KWErPWM7cmV0dXJuIGElY312YXIgbT1jLlBhdGgsbD0yKk1hdGguUEksaD1NYXRoLlBJLzIsZD1jLlV0aWxzLGU9Yy5BcmNTZWdtZW50PWZ1bmN0aW9uKGEsZSxoLGYsayxsLEIpe0I9ZC5tYXAoZC5yYW5nZShCfHwzKmMuUmVzb2x1dGlvbiksZnVuY3Rpb24oKXtyZXR1cm4gbmV3IGMuQW5jaG9yfSk7bS5jYWxsKHRoaXMsQiwhMSwhMSwhMCk7dGhpcy5pbm5lclJhZGl1cz1oO3RoaXMub3V0ZXJSYWRpdXM9Zjt0aGlzLnN0YXJ0QW5nbGU9azt0aGlzLmVuZEFuZ2xlPWw7dGhpcy5fdXBkYXRlKCk7dGhpcy50cmFuc2xhdGlvbi5zZXQoYSxlKX07ZC5leHRlbmQoZSx7UHJvcGVydGllczpbXCJzdGFydEFuZ2xlXCIsXCJlbmRBbmdsZVwiLFwiaW5uZXJSYWRpdXNcIixcIm91dGVyUmFkaXVzXCJdLE1ha2VPYnNlcnZhYmxlOmZ1bmN0aW9uKGEpe20uTWFrZU9ic2VydmFibGUoYSk7ZC5lYWNoKGUuUHJvcGVydGllcyxjLlV0aWxzLmRlZmluZVByb3BlcnR5LFxuYSl9fSk7ZC5leHRlbmQoZS5wcm90b3R5cGUsbS5wcm90b3R5cGUse19mbGFnU3RhcnRBbmdsZTohMSxfZmxhZ0VuZEFuZ2xlOiExLF9mbGFnSW5uZXJSYWRpdXM6ITEsX2ZsYWdPdXRlclJhZGl1czohMSxfc3RhcnRBbmdsZTowLF9lbmRBbmdsZTpsLF9pbm5lclJhZGl1czowLF9vdXRlclJhZGl1czowLF91cGRhdGU6ZnVuY3Rpb24oKXtpZih0aGlzLl9mbGFnU3RhcnRBbmdsZXx8dGhpcy5fZmxhZ0VuZEFuZ2xlfHx0aGlzLl9mbGFnSW5uZXJSYWRpdXN8fHRoaXMuX2ZsYWdPdXRlclJhZGl1cyl7dmFyIGE9dGhpcy5fc3RhcnRBbmdsZSxkPXRoaXMuX2VuZEFuZ2xlLGU9dGhpcy5faW5uZXJSYWRpdXMsZj10aGlzLl9vdXRlclJhZGl1cyx0PWsoYSxsKT09PWsoZCxsKSx2PTA8ZSxCPXRoaXMudmVydGljZXMsej12P0IubGVuZ3RoLzI6Qi5sZW5ndGgsQT0wO3Q/ei0tOnZ8fCh6LT0yKTtmb3IodmFyIHg9MCx1PXotMTt4PHo7eCsrKXt2YXIgcj14L3U7dmFyIHE9QltBXTtyPXIqKGQtXG5hKSthO3ZhciB3PShkLWEpL3o7dmFyIHA9ZipNYXRoLmNvcyhyKTt2YXIgQz1mKk1hdGguc2luKHIpO3N3aXRjaCh4KXtjYXNlIDA6dmFyIEU9Yy5Db21tYW5kcy5tb3ZlO2JyZWFrO2RlZmF1bHQ6RT1jLkNvbW1hbmRzLmN1cnZlfXEuY29tbWFuZD1FO3EueD1wO3EueT1DO3EuY29udHJvbHMubGVmdC5jbGVhcigpO3EuY29udHJvbHMucmlnaHQuY2xlYXIoKTtxLmNvbW1hbmQ9PT1jLkNvbW1hbmRzLmN1cnZlJiYoQz1mKncvTWF0aC5QSSxxLmNvbnRyb2xzLmxlZnQueD1DKk1hdGguY29zKHItaCkscS5jb250cm9scy5sZWZ0Lnk9QypNYXRoLnNpbihyLWgpLHEuY29udHJvbHMucmlnaHQueD1DKk1hdGguY29zKHIraCkscS5jb250cm9scy5yaWdodC55PUMqTWF0aC5zaW4ocitoKSwxPT09eCYmcS5jb250cm9scy5sZWZ0Lm11bHRpcGx5U2NhbGFyKDIpLHg9PT11JiZxLmNvbnRyb2xzLnJpZ2h0Lm11bHRpcGx5U2NhbGFyKDIpKTtBKyt9aWYodilmb3IodD8oQltBXS5jb21tYW5kPWMuQ29tbWFuZHMuY2xvc2UsXG5BKyspOih6LS0sdT16LTEpLHg9MDt4PHo7eCsrKXI9eC91LHE9QltBXSxyPSgxLXIpKihkLWEpK2Esdz0oZC1hKS96LHA9ZSpNYXRoLmNvcyhyKSxDPWUqTWF0aC5zaW4ociksRT1jLkNvbW1hbmRzLmN1cnZlLDA+PXgmJihFPXQ/Yy5Db21tYW5kcy5tb3ZlOmMuQ29tbWFuZHMubGluZSkscS5jb21tYW5kPUUscS54PXAscS55PUMscS5jb250cm9scy5sZWZ0LmNsZWFyKCkscS5jb250cm9scy5yaWdodC5jbGVhcigpLHEuY29tbWFuZD09PWMuQ29tbWFuZHMuY3VydmUmJihDPWUqdy9NYXRoLlBJLHEuY29udHJvbHMubGVmdC54PUMqTWF0aC5jb3MocitoKSxxLmNvbnRyb2xzLmxlZnQueT1DKk1hdGguc2luKHIraCkscS5jb250cm9scy5yaWdodC54PUMqTWF0aC5jb3Moci1oKSxxLmNvbnRyb2xzLnJpZ2h0Lnk9QypNYXRoLnNpbihyLWgpLDE9PT14JiZxLmNvbnRyb2xzLmxlZnQubXVsdGlwbHlTY2FsYXIoMikseD09PXUmJnEuY29udHJvbHMucmlnaHQubXVsdGlwbHlTY2FsYXIoMikpLFxuQSsrO2Vsc2UgdHx8KEJbQV0uY29tbWFuZD1jLkNvbW1hbmRzLmxpbmUsQltBXS54PTAsQltBXS55PTAsQSsrKTtCW0FdLmNvbW1hbmQ9Yy5Db21tYW5kcy5jbG9zZX1tLnByb3RvdHlwZS5fdXBkYXRlLmNhbGwodGhpcyk7cmV0dXJuIHRoaXN9LGZsYWdSZXNldDpmdW5jdGlvbigpe20ucHJvdG90eXBlLmZsYWdSZXNldC5jYWxsKHRoaXMpO3RoaXMuX2ZsYWdTdGFydEFuZ2xlPXRoaXMuX2ZsYWdFbmRBbmdsZT10aGlzLl9mbGFnSW5uZXJSYWRpdXM9dGhpcy5fZmxhZ091dGVyUmFkaXVzPSExO3JldHVybiB0aGlzfX0pO2UuTWFrZU9ic2VydmFibGUoZS5wcm90b3R5cGUpfSkoKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgZ2xvYmFsP2dsb2JhbDp0aGlzKS5Ud28pO1xuKGZ1bmN0aW9uKGMpe3ZhciBrPWMuUGF0aCxtPTIqTWF0aC5QSSxsPU1hdGguY29zLGg9TWF0aC5zaW4sZD1jLlV0aWxzLGU9Yy5TdGFyPWZ1bmN0aW9uKGEsZSxoLGYsbCl7ZC5pc051bWJlcihmKXx8KGY9aC8yKTtpZighZC5pc051bWJlcihsKXx8MD49bClsPTU7dmFyIGc9ZC5tYXAoZC5yYW5nZSgyKmwpLGZ1bmN0aW9uKGEpe3JldHVybiBuZXcgYy5BbmNob3J9KTtrLmNhbGwodGhpcyxnLCEwKTt0aGlzLmlubmVyUmFkaXVzPWY7dGhpcy5vdXRlclJhZGl1cz1oO3RoaXMuc2lkZXM9bDt0aGlzLl91cGRhdGUoKTt0aGlzLnRyYW5zbGF0aW9uLnNldChhLGUpfTtkLmV4dGVuZChlLHtQcm9wZXJ0aWVzOltcImlubmVyUmFkaXVzXCIsXCJvdXRlclJhZGl1c1wiLFwic2lkZXNcIl0sTWFrZU9ic2VydmFibGU6ZnVuY3Rpb24oYSl7ay5NYWtlT2JzZXJ2YWJsZShhKTtkLmVhY2goZS5Qcm9wZXJ0aWVzLGMuVXRpbHMuZGVmaW5lUHJvcGVydHksYSl9fSk7ZC5leHRlbmQoZS5wcm90b3R5cGUsay5wcm90b3R5cGUsXG57X2lubmVyUmFkaXVzOjAsX291dGVyUmFkaXVzOjAsX3NpZGVzOjAsX2ZsYWdJbm5lclJhZGl1czohMSxfZmxhZ091dGVyUmFkaXVzOiExLF9mbGFnU2lkZXM6ITEsX3VwZGF0ZTpmdW5jdGlvbigpe2lmKHRoaXMuX2ZsYWdJbm5lclJhZGl1c3x8dGhpcy5fZmxhZ091dGVyUmFkaXVzfHx0aGlzLl9mbGFnU2lkZXMpe3ZhciBhPTIqdGhpcy5fc2lkZXMsZD10aGlzLnZlcnRpY2VzLmxlbmd0aDtkPmEmJnRoaXMudmVydGljZXMuc3BsaWNlKGEtMSxkLWEpO2Zvcih2YXIgZT0wO2U8YTtlKyspe3ZhciBmPShlKy41KS9hKm0sdD1lJTI/dGhpcy5faW5uZXJSYWRpdXM6dGhpcy5fb3V0ZXJSYWRpdXMsdj10KmwoZiksZj10KmgoZik7ZT49ZD90aGlzLnZlcnRpY2VzLnB1c2gobmV3IGMuQW5jaG9yKHYsZikpOnRoaXMudmVydGljZXNbZV0uc2V0KHYsZil9fWsucHJvdG90eXBlLl91cGRhdGUuY2FsbCh0aGlzKTtyZXR1cm4gdGhpc30sZmxhZ1Jlc2V0OmZ1bmN0aW9uKCl7dGhpcy5fZmxhZ0lubmVyUmFkaXVzPVxudGhpcy5fZmxhZ091dGVyUmFkaXVzPXRoaXMuX2ZsYWdTaWRlcz0hMTtrLnByb3RvdHlwZS5mbGFnUmVzZXQuY2FsbCh0aGlzKTtyZXR1cm4gdGhpc319KTtlLk1ha2VPYnNlcnZhYmxlKGUucHJvdG90eXBlKX0pKChcInVuZGVmaW5lZFwiIT09dHlwZW9mIGdsb2JhbD9nbG9iYWw6dGhpcykuVHdvKTtcbihmdW5jdGlvbihjKXt2YXIgaz1jLlBhdGgsbT1jLlV0aWxzLGw9Yy5Sb3VuZGVkUmVjdGFuZ2xlPWZ1bmN0aW9uKGgsZCxlLGEsZyl7bS5pc051bWJlcihnKXx8KGc9TWF0aC5mbG9vcihNYXRoLm1pbihlLGEpLzEyKSk7dmFyIGw9bS5tYXAobS5yYW5nZSgxMCksZnVuY3Rpb24oYSl7cmV0dXJuIG5ldyBjLkFuY2hvcigwLDAsMCwwLDAsMCwwPT09YT9jLkNvbW1hbmRzLm1vdmU6Yy5Db21tYW5kcy5jdXJ2ZSl9KTtsW2wubGVuZ3RoLTFdLmNvbW1hbmQ9Yy5Db21tYW5kcy5jbG9zZTtrLmNhbGwodGhpcyxsLCExLCExLCEwKTt0aGlzLndpZHRoPWU7dGhpcy5oZWlnaHQ9YTt0aGlzLnJhZGl1cz1nO3RoaXMuX3VwZGF0ZSgpO3RoaXMudHJhbnNsYXRpb24uc2V0KGgsZCl9O20uZXh0ZW5kKGwse1Byb3BlcnRpZXM6W1wid2lkdGhcIixcImhlaWdodFwiLFwicmFkaXVzXCJdLE1ha2VPYnNlcnZhYmxlOmZ1bmN0aW9uKGgpe2suTWFrZU9ic2VydmFibGUoaCk7bS5lYWNoKGwuUHJvcGVydGllcyxjLlV0aWxzLmRlZmluZVByb3BlcnR5LFxuaCl9fSk7bS5leHRlbmQobC5wcm90b3R5cGUsay5wcm90b3R5cGUse193aWR0aDowLF9oZWlnaHQ6MCxfcmFkaXVzOjAsX2ZsYWdXaWR0aDohMSxfZmxhZ0hlaWdodDohMSxfZmxhZ1JhZGl1czohMSxfdXBkYXRlOmZ1bmN0aW9uKCl7aWYodGhpcy5fZmxhZ1dpZHRofHx0aGlzLl9mbGFnSGVpZ2h0fHx0aGlzLl9mbGFnUmFkaXVzKXt2YXIgYz10aGlzLl93aWR0aCxkPXRoaXMuX2hlaWdodCxlPU1hdGgubWluKE1hdGgubWF4KHRoaXMuX3JhZGl1cywwKSxNYXRoLm1pbihjLGQpKSxjPWMvMixhPWQvMixkPXRoaXMudmVydGljZXNbMF07ZC54PS0oYy1lKTtkLnk9LWE7ZD10aGlzLnZlcnRpY2VzWzFdO2QueD1jLWU7ZC55PS1hO2QuY29udHJvbHMubGVmdC5jbGVhcigpO2QuY29udHJvbHMucmlnaHQueD1lO2QuY29udHJvbHMucmlnaHQueT0wO2Q9dGhpcy52ZXJ0aWNlc1syXTtkLng9YztkLnk9LShhLWUpO2QuY29udHJvbHMucmlnaHQuY2xlYXIoKTtkLmNvbnRyb2xzLmxlZnQuY2xlYXIoKTtcbmQ9dGhpcy52ZXJ0aWNlc1szXTtkLng9YztkLnk9YS1lO2QuY29udHJvbHMubGVmdC5jbGVhcigpO2QuY29udHJvbHMucmlnaHQueD0wO2QuY29udHJvbHMucmlnaHQueT1lO2Q9dGhpcy52ZXJ0aWNlc1s0XTtkLng9Yy1lO2QueT1hO2QuY29udHJvbHMucmlnaHQuY2xlYXIoKTtkLmNvbnRyb2xzLmxlZnQuY2xlYXIoKTtkPXRoaXMudmVydGljZXNbNV07ZC54PS0oYy1lKTtkLnk9YTtkLmNvbnRyb2xzLmxlZnQuY2xlYXIoKTtkLmNvbnRyb2xzLnJpZ2h0Lng9LWU7ZC5jb250cm9scy5yaWdodC55PTA7ZD10aGlzLnZlcnRpY2VzWzZdO2QueD0tYztkLnk9YS1lO2QuY29udHJvbHMubGVmdC5jbGVhcigpO2QuY29udHJvbHMucmlnaHQuY2xlYXIoKTtkPXRoaXMudmVydGljZXNbN107ZC54PS1jO2QueT0tKGEtZSk7ZC5jb250cm9scy5sZWZ0LmNsZWFyKCk7ZC5jb250cm9scy5yaWdodC54PTA7ZC5jb250cm9scy5yaWdodC55PS1lO2Q9dGhpcy52ZXJ0aWNlc1s4XTtkLng9LShjLWUpO1xuZC55PS1hO2QuY29udHJvbHMubGVmdC5jbGVhcigpO2QuY29udHJvbHMucmlnaHQuY2xlYXIoKTtkPXRoaXMudmVydGljZXNbOV07ZC5jb3B5KHRoaXMudmVydGljZXNbOF0pfWsucHJvdG90eXBlLl91cGRhdGUuY2FsbCh0aGlzKTtyZXR1cm4gdGhpc30sZmxhZ1Jlc2V0OmZ1bmN0aW9uKCl7dGhpcy5fZmxhZ1dpZHRoPXRoaXMuX2ZsYWdIZWlnaHQ9dGhpcy5fZmxhZ1JhZGl1cz0hMTtrLnByb3RvdHlwZS5mbGFnUmVzZXQuY2FsbCh0aGlzKTtyZXR1cm4gdGhpc319KTtsLk1ha2VPYnNlcnZhYmxlKGwucHJvdG90eXBlKX0pKChcInVuZGVmaW5lZFwiIT09dHlwZW9mIGdsb2JhbD9nbG9iYWw6dGhpcykuVHdvKTtcbihmdW5jdGlvbihjKXt2YXIgaz1jLnJvb3QsbT1jLlV0aWxzLmdldENvbXB1dGVkTWF0cml4LGw9Yy5VdGlsczsoay5kb2N1bWVudD9rLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik6e2dldENvbnRleHQ6bC5pZGVudGl0eX0pLmdldENvbnRleHQoXCIyZFwiKTt2YXIgaD1jLlRleHQ9ZnVuY3Rpb24oZCxlLGEsZyl7Yy5TaGFwZS5jYWxsKHRoaXMpO3RoaXMuX3JlbmRlcmVyLnR5cGU9XCJ0ZXh0XCI7dGhpcy5fcmVuZGVyZXIuZmxhZ0ZpbGw9bC5iaW5kKGguRmxhZ0ZpbGwsdGhpcyk7dGhpcy5fcmVuZGVyZXIuZmxhZ1N0cm9rZT1sLmJpbmQoaC5GbGFnU3Ryb2tlLHRoaXMpO3RoaXMudmFsdWU9ZDtsLmlzTnVtYmVyKGUpJiYodGhpcy50cmFuc2xhdGlvbi54PWUpO2wuaXNOdW1iZXIoYSkmJih0aGlzLnRyYW5zbGF0aW9uLnk9YSk7aWYoIWwuaXNPYmplY3QoZykpcmV0dXJuIHRoaXM7bC5lYWNoKGMuVGV4dC5Qcm9wZXJ0aWVzLGZ1bmN0aW9uKGEpe2EgaW4gZyYmKHRoaXNbYV09XG5nW2FdKX0sdGhpcyl9O2wuZXh0ZW5kKGMuVGV4dCx7UHJvcGVydGllczpcInZhbHVlIGZhbWlseSBzaXplIGxlYWRpbmcgYWxpZ25tZW50IGxpbmV3aWR0aCBzdHlsZSB3ZWlnaHQgZGVjb3JhdGlvbiBiYXNlbGluZSBvcGFjaXR5IHZpc2libGUgZmlsbCBzdHJva2VcIi5zcGxpdChcIiBcIiksRmxhZ0ZpbGw6ZnVuY3Rpb24oKXt0aGlzLl9mbGFnRmlsbD0hMH0sRmxhZ1N0cm9rZTpmdW5jdGlvbigpe3RoaXMuX2ZsYWdTdHJva2U9ITB9LE1ha2VPYnNlcnZhYmxlOmZ1bmN0aW9uKGQpe2MuU2hhcGUuTWFrZU9ic2VydmFibGUoZCk7bC5lYWNoKGMuVGV4dC5Qcm9wZXJ0aWVzLnNsaWNlKDAsMTIpLGMuVXRpbHMuZGVmaW5lUHJvcGVydHksZCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGQsXCJmaWxsXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2ZpbGx9LHNldDpmdW5jdGlvbihkKXsodGhpcy5fZmlsbCBpbnN0YW5jZW9mIGMuR3JhZGllbnR8fHRoaXMuX2ZpbGwgaW5zdGFuY2VvZlxuYy5MaW5lYXJHcmFkaWVudHx8dGhpcy5fZmlsbCBpbnN0YW5jZW9mIGMuUmFkaWFsR3JhZGllbnR8fHRoaXMuX2ZpbGwgaW5zdGFuY2VvZiBjLlRleHR1cmUpJiZ0aGlzLl9maWxsLnVuYmluZChjLkV2ZW50cy5jaGFuZ2UsdGhpcy5fcmVuZGVyZXIuZmxhZ0ZpbGwpO3RoaXMuX2ZpbGw9ZDt0aGlzLl9mbGFnRmlsbD0hMDsodGhpcy5fZmlsbCBpbnN0YW5jZW9mIGMuR3JhZGllbnR8fHRoaXMuX2ZpbGwgaW5zdGFuY2VvZiBjLkxpbmVhckdyYWRpZW50fHx0aGlzLl9maWxsIGluc3RhbmNlb2YgYy5SYWRpYWxHcmFkaWVudHx8dGhpcy5fZmlsbCBpbnN0YW5jZW9mIGMuVGV4dHVyZSkmJnRoaXMuX2ZpbGwuYmluZChjLkV2ZW50cy5jaGFuZ2UsdGhpcy5fcmVuZGVyZXIuZmxhZ0ZpbGwpfX0pO09iamVjdC5kZWZpbmVQcm9wZXJ0eShkLFwic3Ryb2tlXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3N0cm9rZX0sc2V0OmZ1bmN0aW9uKGQpeyh0aGlzLl9zdHJva2UgaW5zdGFuY2VvZlxuYy5HcmFkaWVudHx8dGhpcy5fc3Ryb2tlIGluc3RhbmNlb2YgYy5MaW5lYXJHcmFkaWVudHx8dGhpcy5fc3Ryb2tlIGluc3RhbmNlb2YgYy5SYWRpYWxHcmFkaWVudHx8dGhpcy5fc3Ryb2tlIGluc3RhbmNlb2YgYy5UZXh0dXJlKSYmdGhpcy5fc3Ryb2tlLnVuYmluZChjLkV2ZW50cy5jaGFuZ2UsdGhpcy5fcmVuZGVyZXIuZmxhZ1N0cm9rZSk7dGhpcy5fc3Ryb2tlPWQ7dGhpcy5fZmxhZ1N0cm9rZT0hMDsodGhpcy5fc3Ryb2tlIGluc3RhbmNlb2YgYy5HcmFkaWVudHx8dGhpcy5fc3Ryb2tlIGluc3RhbmNlb2YgYy5MaW5lYXJHcmFkaWVudHx8dGhpcy5fc3Ryb2tlIGluc3RhbmNlb2YgYy5SYWRpYWxHcmFkaWVudHx8dGhpcy5fc3Ryb2tlIGluc3RhbmNlb2YgYy5UZXh0dXJlKSYmdGhpcy5fc3Ryb2tlLmJpbmQoYy5FdmVudHMuY2hhbmdlLHRoaXMuX3JlbmRlcmVyLmZsYWdTdHJva2UpfX0pO09iamVjdC5kZWZpbmVQcm9wZXJ0eShkLFwiY2xpcFwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jbGlwfSxcbnNldDpmdW5jdGlvbihjKXt0aGlzLl9jbGlwPWM7dGhpcy5fZmxhZ0NsaXA9ITB9fSl9fSk7bC5leHRlbmQoYy5UZXh0LnByb3RvdHlwZSxjLlNoYXBlLnByb3RvdHlwZSx7X2ZsYWdWYWx1ZTohMCxfZmxhZ0ZhbWlseTohMCxfZmxhZ1NpemU6ITAsX2ZsYWdMZWFkaW5nOiEwLF9mbGFnQWxpZ25tZW50OiEwLF9mbGFnQmFzZWxpbmU6ITAsX2ZsYWdTdHlsZTohMCxfZmxhZ1dlaWdodDohMCxfZmxhZ0RlY29yYXRpb246ITAsX2ZsYWdGaWxsOiEwLF9mbGFnU3Ryb2tlOiEwLF9mbGFnTGluZXdpZHRoOiEwLF9mbGFnT3BhY2l0eTohMCxfZmxhZ1Zpc2libGU6ITAsX2ZsYWdDbGlwOiExLF92YWx1ZTpcIlwiLF9mYW1pbHk6XCJzYW5zLXNlcmlmXCIsX3NpemU6MTMsX2xlYWRpbmc6MTcsX2FsaWdubWVudDpcImNlbnRlclwiLF9iYXNlbGluZTpcIm1pZGRsZVwiLF9zdHlsZTpcIm5vcm1hbFwiLF93ZWlnaHQ6NTAwLF9kZWNvcmF0aW9uOlwibm9uZVwiLF9maWxsOlwiIzAwMFwiLF9zdHJva2U6XCJ0cmFuc3BhcmVudFwiLFxuX2xpbmV3aWR0aDoxLF9vcGFjaXR5OjEsX3Zpc2libGU6ITAsX2NsaXA6ITEscmVtb3ZlOmZ1bmN0aW9uKCl7aWYoIXRoaXMucGFyZW50KXJldHVybiB0aGlzO3RoaXMucGFyZW50LnJlbW92ZSh0aGlzKTtyZXR1cm4gdGhpc30sY2xvbmU6ZnVuY3Rpb24oZCl7ZD1kfHx0aGlzLnBhcmVudDt2YXIgZT1uZXcgYy5UZXh0KHRoaXMudmFsdWUpO2UudHJhbnNsYXRpb24uY29weSh0aGlzLnRyYW5zbGF0aW9uKTtlLnJvdGF0aW9uPXRoaXMucm90YXRpb247ZS5zY2FsZT10aGlzLnNjYWxlO2wuZWFjaChjLlRleHQuUHJvcGVydGllcyxmdW5jdGlvbihhKXtlW2FdPXRoaXNbYV19LHRoaXMpO2QmJmQuYWRkKGUpO3JldHVybiBlfSx0b09iamVjdDpmdW5jdGlvbigpe3ZhciBkPXt0cmFuc2xhdGlvbjp0aGlzLnRyYW5zbGF0aW9uLnRvT2JqZWN0KCkscm90YXRpb246dGhpcy5yb3RhdGlvbixzY2FsZTp0aGlzLnNjYWxlfTtsLmVhY2goYy5UZXh0LlByb3BlcnRpZXMsZnVuY3Rpb24oYyl7ZFtjXT1cbnRoaXNbY119LHRoaXMpO3JldHVybiBkfSxub1N0cm9rZTpmdW5jdGlvbigpe3RoaXMuc3Ryb2tlPVwidHJhbnNwYXJlbnRcIjtyZXR1cm4gdGhpc30sbm9GaWxsOmZ1bmN0aW9uKCl7dGhpcy5maWxsPVwidHJhbnNwYXJlbnRcIjtyZXR1cm4gdGhpc30sZ2V0Qm91bmRpbmdDbGllbnRSZWN0OmZ1bmN0aW9uKGMpe3RoaXMuX3VwZGF0ZSghMCk7Yz0oYz90aGlzLl9tYXRyaXg6bSh0aGlzKSkubXVsdGlwbHkoMCwwLDEpO3JldHVybnt0b3A6Yy54LGxlZnQ6Yy55LHJpZ2h0OmMueCxib3R0b206Yy55LHdpZHRoOjAsaGVpZ2h0OjB9fSxmbGFnUmVzZXQ6ZnVuY3Rpb24oKXt0aGlzLl9mbGFnVmFsdWU9dGhpcy5fZmxhZ0ZhbWlseT10aGlzLl9mbGFnU2l6ZT10aGlzLl9mbGFnTGVhZGluZz10aGlzLl9mbGFnQWxpZ25tZW50PXRoaXMuX2ZsYWdGaWxsPXRoaXMuX2ZsYWdTdHJva2U9dGhpcy5fZmxhZ0xpbmV3aWR0aD10aGlzLl9mbGFnT3BhaWN0eT10aGlzLl9mbGFnVmlzaWJsZT10aGlzLl9mbGFnQ2xpcD1cbnRoaXMuX2ZsYWdEZWNvcmF0aW9uPXRoaXMuX2ZsYWdCYXNlbGluZT0hMTtjLlNoYXBlLnByb3RvdHlwZS5mbGFnUmVzZXQuY2FsbCh0aGlzKTtyZXR1cm4gdGhpc319KTtjLlRleHQuTWFrZU9ic2VydmFibGUoYy5UZXh0LnByb3RvdHlwZSl9KSgoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBnbG9iYWw/Z2xvYmFsOnRoaXMpLlR3byk7XG4oZnVuY3Rpb24oYyl7dmFyIGs9Yy5VdGlscyxtPWMuU3RvcD1mdW5jdGlvbihjLGQsZSl7dGhpcy5fcmVuZGVyZXI9e307dGhpcy5fcmVuZGVyZXIudHlwZT1cInN0b3BcIjt0aGlzLm9mZnNldD1rLmlzTnVtYmVyKGMpP2M6MD49bS5JbmRleD8wOjE7dGhpcy5vcGFjaXR5PWsuaXNOdW1iZXIoZSk/ZToxO3RoaXMuY29sb3I9ay5pc1N0cmluZyhkKT9kOjA+PW0uSW5kZXg/XCIjZmZmXCI6XCIjMDAwXCI7bS5JbmRleD0obS5JbmRleCsxKSUyfTtrLmV4dGVuZChtLHtJbmRleDowLFByb3BlcnRpZXM6W1wib2Zmc2V0XCIsXCJvcGFjaXR5XCIsXCJjb2xvclwiXSxNYWtlT2JzZXJ2YWJsZTpmdW5jdGlvbihjKXtrLmVhY2gobS5Qcm9wZXJ0aWVzLGZ1bmN0aW9uKGMpe3ZhciBkPVwiX1wiK2MsYT1cIl9mbGFnXCIrYy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKStjLnNsaWNlKDEpO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLGMse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXNbZF19LHNldDpmdW5jdGlvbihjKXt0aGlzW2RdPVxuYzt0aGlzW2FdPSEwO3RoaXMucGFyZW50JiYodGhpcy5wYXJlbnQuX2ZsYWdTdG9wcz0hMCl9fSl9LGMpfX0pO2suZXh0ZW5kKG0ucHJvdG90eXBlLGMuVXRpbHMuRXZlbnRzLHtjbG9uZTpmdW5jdGlvbigpe3ZhciBjPW5ldyBtO2suZWFjaChtLlByb3BlcnRpZXMsZnVuY3Rpb24oZCl7Y1tkXT10aGlzW2RdfSx0aGlzKTtyZXR1cm4gY30sdG9PYmplY3Q6ZnVuY3Rpb24oKXt2YXIgYz17fTtrLmVhY2gobS5Qcm9wZXJ0aWVzLGZ1bmN0aW9uKGQpe2NbZF09dGhpc1tkXX0sdGhpcyk7cmV0dXJuIGN9LGZsYWdSZXNldDpmdW5jdGlvbigpe3RoaXMuX2ZsYWdPZmZzZXQ9dGhpcy5fZmxhZ0NvbG9yPXRoaXMuX2ZsYWdPcGFjaXR5PSExO3JldHVybiB0aGlzfX0pO20uTWFrZU9ic2VydmFibGUobS5wcm90b3R5cGUpO3ZhciBsPWMuR3JhZGllbnQ9ZnVuY3Rpb24oaCl7dGhpcy5fcmVuZGVyZXI9e307dGhpcy5fcmVuZGVyZXIudHlwZT1cImdyYWRpZW50XCI7dGhpcy5pZD1jLklkZW50aWZpZXIrXG5jLnVuaXF1ZUlkKCk7dGhpcy5jbGFzc0xpc3Q9W107dGhpcy5fcmVuZGVyZXIuZmxhZ1N0b3BzPWsuYmluZChsLkZsYWdTdG9wcyx0aGlzKTt0aGlzLl9yZW5kZXJlci5iaW5kU3RvcHM9ay5iaW5kKGwuQmluZFN0b3BzLHRoaXMpO3RoaXMuX3JlbmRlcmVyLnVuYmluZFN0b3BzPWsuYmluZChsLlVuYmluZFN0b3BzLHRoaXMpO3RoaXMuc3ByZWFkPVwicGFkXCI7dGhpcy5zdG9wcz1ofTtrLmV4dGVuZChsLHtTdG9wOm0sUHJvcGVydGllczpbXCJzcHJlYWRcIl0sTWFrZU9ic2VydmFibGU6ZnVuY3Rpb24oaCl7ay5lYWNoKGwuUHJvcGVydGllcyxjLlV0aWxzLmRlZmluZVByb3BlcnR5LGgpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShoLFwic3RvcHNcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc3RvcHN9LHNldDpmdW5jdGlvbihkKXt2YXIgZT10aGlzLl9yZW5kZXJlci5iaW5kU3RvcHMsYT10aGlzLl9yZW5kZXJlci51bmJpbmRTdG9wczt0aGlzLl9zdG9wcyYmXG50aGlzLl9zdG9wcy51bmJpbmQoYy5FdmVudHMuaW5zZXJ0LGUpLnVuYmluZChjLkV2ZW50cy5yZW1vdmUsYSk7dGhpcy5fc3RvcHM9bmV3IGMuVXRpbHMuQ29sbGVjdGlvbigoZHx8W10pLnNsaWNlKDApKTt0aGlzLl9zdG9wcy5iaW5kKGMuRXZlbnRzLmluc2VydCxlKS5iaW5kKGMuRXZlbnRzLnJlbW92ZSxhKTtlKHRoaXMuX3N0b3BzKX19KX0sRmxhZ1N0b3BzOmZ1bmN0aW9uKCl7dGhpcy5fZmxhZ1N0b3BzPSEwfSxCaW5kU3RvcHM6ZnVuY3Rpb24oaCl7Zm9yKHZhciBkPWgubGVuZ3RoO2QtLTspaFtkXS5iaW5kKGMuRXZlbnRzLmNoYW5nZSx0aGlzLl9yZW5kZXJlci5mbGFnU3RvcHMpLGhbZF0ucGFyZW50PXRoaXM7dGhpcy5fcmVuZGVyZXIuZmxhZ1N0b3BzKCl9LFVuYmluZFN0b3BzOmZ1bmN0aW9uKGgpe2Zvcih2YXIgZD1oLmxlbmd0aDtkLS07KWhbZF0udW5iaW5kKGMuRXZlbnRzLmNoYW5nZSx0aGlzLl9yZW5kZXJlci5mbGFnU3RvcHMpLGRlbGV0ZSBoW2RdLnBhcmVudDtcbnRoaXMuX3JlbmRlcmVyLmZsYWdTdG9wcygpfX0pO2suZXh0ZW5kKGwucHJvdG90eXBlLGMuVXRpbHMuRXZlbnRzLHtfZmxhZ1N0b3BzOiExLF9mbGFnU3ByZWFkOiExLGNsb25lOmZ1bmN0aW9uKGgpe2g9aHx8dGhpcy5wYXJlbnQ7dmFyIGQ9ay5tYXAodGhpcy5zdG9wcyxmdW5jdGlvbihhKXtyZXR1cm4gYS5jbG9uZSgpfSksZT1uZXcgbChkKTtrLmVhY2goYy5HcmFkaWVudC5Qcm9wZXJ0aWVzLGZ1bmN0aW9uKGEpe2VbYV09dGhpc1thXX0sdGhpcyk7aCYmaC5hZGQoZSk7cmV0dXJuIGV9LHRvT2JqZWN0OmZ1bmN0aW9uKCl7dmFyIGM9e3N0b3BzOmsubWFwKHRoaXMuc3RvcHMsZnVuY3Rpb24oYyl7cmV0dXJuIGMudG9PYmplY3QoKX0pfTtrLmVhY2gobC5Qcm9wZXJ0aWVzLGZ1bmN0aW9uKGQpe2NbZF09dGhpc1tkXX0sdGhpcyk7cmV0dXJuIGN9LF91cGRhdGU6ZnVuY3Rpb24oKXsodGhpcy5fZmxhZ1NwcmVhZHx8dGhpcy5fZmxhZ1N0b3BzKSYmdGhpcy50cmlnZ2VyKGMuRXZlbnRzLmNoYW5nZSk7XG5yZXR1cm4gdGhpc30sZmxhZ1Jlc2V0OmZ1bmN0aW9uKCl7dGhpcy5fZmxhZ1NwcmVhZD10aGlzLl9mbGFnU3RvcHM9ITE7cmV0dXJuIHRoaXN9fSk7bC5NYWtlT2JzZXJ2YWJsZShsLnByb3RvdHlwZSl9KSgoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBnbG9iYWw/Z2xvYmFsOnRoaXMpLlR3byk7XG4oZnVuY3Rpb24oYyl7dmFyIGs9Yy5VdGlscyxtPWMuTGluZWFyR3JhZGllbnQ9ZnVuY3Rpb24obCxoLGQsZSxhKXtjLkdyYWRpZW50LmNhbGwodGhpcyxhKTt0aGlzLl9yZW5kZXJlci50eXBlPVwibGluZWFyLWdyYWRpZW50XCI7YT1rLmJpbmQobS5GbGFnRW5kUG9pbnRzLHRoaXMpO3RoaXMubGVmdD0obmV3IGMuVmVjdG9yKS5iaW5kKGMuRXZlbnRzLmNoYW5nZSxhKTt0aGlzLnJpZ2h0PShuZXcgYy5WZWN0b3IpLmJpbmQoYy5FdmVudHMuY2hhbmdlLGEpO2suaXNOdW1iZXIobCkmJih0aGlzLmxlZnQueD1sKTtrLmlzTnVtYmVyKGgpJiYodGhpcy5sZWZ0Lnk9aCk7ay5pc051bWJlcihkKSYmKHRoaXMucmlnaHQueD1kKTtrLmlzTnVtYmVyKGUpJiYodGhpcy5yaWdodC55PWUpfTtrLmV4dGVuZChtLHtTdG9wOmMuR3JhZGllbnQuU3RvcCxNYWtlT2JzZXJ2YWJsZTpmdW5jdGlvbihrKXtjLkdyYWRpZW50Lk1ha2VPYnNlcnZhYmxlKGspfSxGbGFnRW5kUG9pbnRzOmZ1bmN0aW9uKCl7dGhpcy5fZmxhZ0VuZFBvaW50cz1cbiEwfX0pO2suZXh0ZW5kKG0ucHJvdG90eXBlLGMuR3JhZGllbnQucHJvdG90eXBlLHtfZmxhZ0VuZFBvaW50czohMSxjbG9uZTpmdW5jdGlvbihsKXtsPWx8fHRoaXMucGFyZW50O3ZhciBoPWsubWFwKHRoaXMuc3RvcHMsZnVuY3Rpb24oYyl7cmV0dXJuIGMuY2xvbmUoKX0pLGQ9bmV3IG0odGhpcy5sZWZ0Ll94LHRoaXMubGVmdC5feSx0aGlzLnJpZ2h0Ll94LHRoaXMucmlnaHQuX3ksaCk7ay5lYWNoKGMuR3JhZGllbnQuUHJvcGVydGllcyxmdW5jdGlvbihjKXtkW2NdPXRoaXNbY119LHRoaXMpO2wmJmwuYWRkKGQpO3JldHVybiBkfSx0b09iamVjdDpmdW5jdGlvbigpe3ZhciBrPWMuR3JhZGllbnQucHJvdG90eXBlLnRvT2JqZWN0LmNhbGwodGhpcyk7ay5sZWZ0PXRoaXMubGVmdC50b09iamVjdCgpO2sucmlnaHQ9dGhpcy5yaWdodC50b09iamVjdCgpO3JldHVybiBrfSxfdXBkYXRlOmZ1bmN0aW9uKCl7KHRoaXMuX2ZsYWdFbmRQb2ludHN8fHRoaXMuX2ZsYWdTcHJlYWR8fHRoaXMuX2ZsYWdTdG9wcykmJlxudGhpcy50cmlnZ2VyKGMuRXZlbnRzLmNoYW5nZSk7cmV0dXJuIHRoaXN9LGZsYWdSZXNldDpmdW5jdGlvbigpe3RoaXMuX2ZsYWdFbmRQb2ludHM9ITE7Yy5HcmFkaWVudC5wcm90b3R5cGUuZmxhZ1Jlc2V0LmNhbGwodGhpcyk7cmV0dXJuIHRoaXN9fSk7bS5NYWtlT2JzZXJ2YWJsZShtLnByb3RvdHlwZSl9KSgoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBnbG9iYWw/Z2xvYmFsOnRoaXMpLlR3byk7XG4oZnVuY3Rpb24oYyl7dmFyIGs9Yy5VdGlscyxtPWMuUmFkaWFsR3JhZGllbnQ9ZnVuY3Rpb24obCxoLGQsZSxhLGcpe2MuR3JhZGllbnQuY2FsbCh0aGlzLGUpO3RoaXMuX3JlbmRlcmVyLnR5cGU9XCJyYWRpYWwtZ3JhZGllbnRcIjt0aGlzLmNlbnRlcj0obmV3IGMuVmVjdG9yKS5iaW5kKGMuRXZlbnRzLmNoYW5nZSxrLmJpbmQoZnVuY3Rpb24oKXt0aGlzLl9mbGFnQ2VudGVyPSEwfSx0aGlzKSk7dGhpcy5yYWRpdXM9ay5pc051bWJlcihkKT9kOjIwO3RoaXMuZm9jYWw9KG5ldyBjLlZlY3RvcikuYmluZChjLkV2ZW50cy5jaGFuZ2Usay5iaW5kKGZ1bmN0aW9uKCl7dGhpcy5fZmxhZ0ZvY2FsPSEwfSx0aGlzKSk7ay5pc051bWJlcihsKSYmKHRoaXMuY2VudGVyLng9bCk7ay5pc051bWJlcihoKSYmKHRoaXMuY2VudGVyLnk9aCk7dGhpcy5mb2NhbC5jb3B5KHRoaXMuY2VudGVyKTtrLmlzTnVtYmVyKGEpJiYodGhpcy5mb2NhbC54PWEpO2suaXNOdW1iZXIoZykmJih0aGlzLmZvY2FsLnk9XG5nKX07ay5leHRlbmQobSx7U3RvcDpjLkdyYWRpZW50LlN0b3AsUHJvcGVydGllczpbXCJyYWRpdXNcIl0sTWFrZU9ic2VydmFibGU6ZnVuY3Rpb24obCl7Yy5HcmFkaWVudC5NYWtlT2JzZXJ2YWJsZShsKTtrLmVhY2gobS5Qcm9wZXJ0aWVzLGMuVXRpbHMuZGVmaW5lUHJvcGVydHksbCl9fSk7ay5leHRlbmQobS5wcm90b3R5cGUsYy5HcmFkaWVudC5wcm90b3R5cGUse19mbGFnUmFkaXVzOiExLF9mbGFnQ2VudGVyOiExLF9mbGFnRm9jYWw6ITEsY2xvbmU6ZnVuY3Rpb24obCl7bD1sfHx0aGlzLnBhcmVudDt2YXIgaD1rLm1hcCh0aGlzLnN0b3BzLGZ1bmN0aW9uKGMpe3JldHVybiBjLmNsb25lKCl9KSxkPW5ldyBtKHRoaXMuY2VudGVyLl94LHRoaXMuY2VudGVyLl95LHRoaXMuX3JhZGl1cyxoLHRoaXMuZm9jYWwuX3gsdGhpcy5mb2NhbC5feSk7ay5lYWNoKGMuR3JhZGllbnQuUHJvcGVydGllcy5jb25jYXQobS5Qcm9wZXJ0aWVzKSxmdW5jdGlvbihjKXtkW2NdPXRoaXNbY119LHRoaXMpO1xubCYmbC5hZGQoZCk7cmV0dXJuIGR9LHRvT2JqZWN0OmZ1bmN0aW9uKCl7dmFyIGw9Yy5HcmFkaWVudC5wcm90b3R5cGUudG9PYmplY3QuY2FsbCh0aGlzKTtrLmVhY2gobS5Qcm9wZXJ0aWVzLGZ1bmN0aW9uKGMpe2xbY109dGhpc1tjXX0sdGhpcyk7bC5jZW50ZXI9dGhpcy5jZW50ZXIudG9PYmplY3QoKTtsLmZvY2FsPXRoaXMuZm9jYWwudG9PYmplY3QoKTtyZXR1cm4gbH0sX3VwZGF0ZTpmdW5jdGlvbigpeyh0aGlzLl9mbGFnUmFkaXVzfHx0aGlzLl9mbGF0Q2VudGVyfHx0aGlzLl9mbGFnRm9jYWx8fHRoaXMuX2ZsYWdTcHJlYWR8fHRoaXMuX2ZsYWdTdG9wcykmJnRoaXMudHJpZ2dlcihjLkV2ZW50cy5jaGFuZ2UpO3JldHVybiB0aGlzfSxmbGFnUmVzZXQ6ZnVuY3Rpb24oKXt0aGlzLl9mbGFnUmFkaXVzPXRoaXMuX2ZsYWdDZW50ZXI9dGhpcy5fZmxhZ0ZvY2FsPSExO2MuR3JhZGllbnQucHJvdG90eXBlLmZsYWdSZXNldC5jYWxsKHRoaXMpO3JldHVybiB0aGlzfX0pO20uTWFrZU9ic2VydmFibGUobS5wcm90b3R5cGUpfSkoKFwidW5kZWZpbmVkXCIhPT1cbnR5cGVvZiBnbG9iYWw/Z2xvYmFsOnRoaXMpLlR3byk7XG4oZnVuY3Rpb24oYyl7dmFyIGs9Yy5VdGlscyxtLGw9L1xcLihtcDR8d2VibSkkL2k7dGhpcy5kb2N1bWVudCYmKG09ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIikpO3ZhciBoPWMuVGV4dHVyZT1mdW5jdGlvbihkLGUpe3RoaXMuX3JlbmRlcmVyPXt9O3RoaXMuX3JlbmRlcmVyLnR5cGU9XCJ0ZXh0dXJlXCI7dGhpcy5fcmVuZGVyZXIuZmxhZ09mZnNldD1rLmJpbmQoaC5GbGFnT2Zmc2V0LHRoaXMpO3RoaXMuX3JlbmRlcmVyLmZsYWdTY2FsZT1rLmJpbmQoaC5GbGFnU2NhbGUsdGhpcyk7dGhpcy5pZD1jLklkZW50aWZpZXIrYy51bmlxdWVJZCgpO3RoaXMuY2xhc3NMaXN0PVtdO3RoaXMub2Zmc2V0PW5ldyBjLlZlY3RvcjtpZihrLmlzRnVuY3Rpb24oZSkpe3ZhciBhPWsuYmluZChmdW5jdGlvbigpe3RoaXMudW5iaW5kKGMuRXZlbnRzLmxvYWQsYSk7ay5pc0Z1bmN0aW9uKGUpJiZlKCl9LHRoaXMpO3RoaXMuYmluZChjLkV2ZW50cy5sb2FkLGEpfWsuaXNTdHJpbmcoZCk/dGhpcy5zcmM9XG5kOmsuaXNFbGVtZW50KGQpJiYodGhpcy5pbWFnZT1kKTt0aGlzLl91cGRhdGUoKX07ay5leHRlbmQoaCx7UHJvcGVydGllczpbXCJzcmNcIixcImxvYWRlZFwiLFwicmVwZWF0XCJdLEltYWdlUmVnaXN0cnk6bmV3IGMuUmVnaXN0cnksZ2V0QWJzb2x1dGVVUkw6ZnVuY3Rpb24oYyl7aWYoIW0pcmV0dXJuIGM7bS5ocmVmPWM7cmV0dXJuIG0uaHJlZn0sZ2V0SW1hZ2U6ZnVuY3Rpb24oYyl7Yz1oLmdldEFic29sdXRlVVJMKGMpO2lmKGguSW1hZ2VSZWdpc3RyeS5jb250YWlucyhjKSlyZXR1cm4gaC5JbWFnZVJlZ2lzdHJ5LmdldChjKTtjPWwudGVzdChjKT9kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidmlkZW9cIik6ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtjLmNyb3NzT3JpZ2luPVwiYW5vbnltb3VzXCI7cmV0dXJuIGN9LFJlZ2lzdGVyOntjYW52YXM6ZnVuY3Rpb24oYyxlKXtjLl9zcmM9XCIjXCIrYy5pZDtoLkltYWdlUmVnaXN0cnkuYWRkKGMuc3JjLGMuaW1hZ2UpO2suaXNGdW5jdGlvbihlKSYmXG5lKCl9LGltZzpmdW5jdGlvbihkLGUpe3ZhciBhPWZ1bmN0aW9uKGMpe2QuaW1hZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIixhLCExKTtkLmltYWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLGcsITEpO2suaXNGdW5jdGlvbihlKSYmZSgpfSxnPWZ1bmN0aW9uKGUpe2QuaW1hZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIixhLCExKTtkLmltYWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLGcsITEpO3Rocm93IG5ldyBjLlV0aWxzLkVycm9yKFwidW5hYmxlIHRvIGxvYWQgXCIrZC5zcmMpO307ay5pc051bWJlcihkLmltYWdlLndpZHRoKSYmMDxkLmltYWdlLndpZHRoJiZrLmlzTnVtYmVyKGQuaW1hZ2UuaGVpZ2h0KSYmMDxkLmltYWdlLmhlaWdodD9hKCk6KGQuaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixhLCExKSxkLmltYWdlLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLGcsITEpKTtkLl9zcmM9aC5nZXRBYnNvbHV0ZVVSTChkLl9zcmMpO2QuaW1hZ2UmJlxuZC5pbWFnZS5nZXRBdHRyaWJ1dGUoXCJ0d28tc3JjXCIpfHwoZC5pbWFnZS5zZXRBdHRyaWJ1dGUoXCJ0d28tc3JjXCIsZC5zcmMpLGguSW1hZ2VSZWdpc3RyeS5hZGQoZC5zcmMsZC5pbWFnZSksZC5pbWFnZS5zcmM9ZC5zcmMpfSx2aWRlbzpmdW5jdGlvbihkLGUpe3ZhciBhPWZ1bmN0aW9uKGMpe2QuaW1hZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIixhLCExKTtkLmltYWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLGcsITEpO2QuaW1hZ2Uud2lkdGg9ZC5pbWFnZS52aWRlb1dpZHRoO2QuaW1hZ2UuaGVpZ2h0PWQuaW1hZ2UudmlkZW9IZWlnaHQ7ZC5pbWFnZS5wbGF5KCk7ay5pc0Z1bmN0aW9uKGUpJiZlKCl9LGc9ZnVuY3Rpb24oZSl7ZC5pbWFnZS5yZW1vdmVFdmVudExpc3RlbmVyKFwibG9hZFwiLGEsITEpO2QuaW1hZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsZywhMSk7dGhyb3cgbmV3IGMuVXRpbHMuRXJyb3IoXCJ1bmFibGUgdG8gbG9hZCBcIitkLnNyYyk7fTtcbmQuX3NyYz1oLmdldEFic29sdXRlVVJMKGQuX3NyYyk7ZC5pbWFnZS5hZGRFdmVudExpc3RlbmVyKFwiY2FucGxheXRocm91Z2hcIixhLCExKTtkLmltYWdlLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLGcsITEpO2QuaW1hZ2UmJmQuaW1hZ2UuZ2V0QXR0cmlidXRlKFwidHdvLXNyY1wiKXx8KGQuaW1hZ2Uuc2V0QXR0cmlidXRlKFwidHdvLXNyY1wiLGQuc3JjKSxoLkltYWdlUmVnaXN0cnkuYWRkKGQuc3JjLGQuaW1hZ2UpLGQuaW1hZ2Uuc3JjPWQuc3JjLGQuaW1hZ2UubG9vcD0hMCxkLmltYWdlLmxvYWQoKSl9fSxsb2FkOmZ1bmN0aW9uKGMsZSl7dmFyIGE9Yy5pbWFnZSxkPWEmJmEubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtjLl9mbGFnSW1hZ2UmJigvY2FudmFzL2kudGVzdChkKT9oLlJlZ2lzdGVyLmNhbnZhcyhjLGUpOihjLl9zcmM9YS5nZXRBdHRyaWJ1dGUoXCJ0d28tc3JjXCIpfHxhLnNyYyxoLlJlZ2lzdGVyW2RdKGMsZSkpKTtjLl9mbGFnU3JjJiYoYXx8KGMuaW1hZ2U9aC5nZXRJbWFnZShjLnNyYykpLFxuZD1jLmltYWdlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksaC5SZWdpc3RlcltkXShjLGUpKX0sRmxhZ09mZnNldDpmdW5jdGlvbigpe3RoaXMuX2ZsYWdPZmZzZXQ9ITB9LEZsYWdTY2FsZTpmdW5jdGlvbigpe3RoaXMuX2ZsYWdTY2FsZT0hMH0sTWFrZU9ic2VydmFibGU6ZnVuY3Rpb24oZCl7ay5lYWNoKGguUHJvcGVydGllcyxjLlV0aWxzLmRlZmluZVByb3BlcnR5LGQpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShkLFwiaW1hZ2VcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faW1hZ2V9LHNldDpmdW5jdGlvbihjKXtzd2l0Y2goYyYmYy5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKXtjYXNlIFwiY2FudmFzXCI6dmFyIGE9XCIjXCIrYy5pZDticmVhaztkZWZhdWx0OmE9Yy5zcmN9aC5JbWFnZVJlZ2lzdHJ5LmNvbnRhaW5zKGEpP3RoaXMuX2ltYWdlPWguSW1hZ2VSZWdpc3RyeS5nZXQoYy5zcmMpOnRoaXMuX2ltYWdlPWM7dGhpcy5fZmxhZ0ltYWdlPSEwfX0pO09iamVjdC5kZWZpbmVQcm9wZXJ0eShkLFxuXCJvZmZzZXRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fb2Zmc2V0fSxzZXQ6ZnVuY3Rpb24oZCl7dGhpcy5fb2Zmc2V0JiZ0aGlzLl9vZmZzZXQudW5iaW5kKGMuRXZlbnRzLmNoYW5nZSx0aGlzLl9yZW5kZXJlci5mbGFnT2Zmc2V0KTt0aGlzLl9vZmZzZXQ9ZDt0aGlzLl9vZmZzZXQuYmluZChjLkV2ZW50cy5jaGFuZ2UsdGhpcy5fcmVuZGVyZXIuZmxhZ09mZnNldCk7dGhpcy5fZmxhZ09mZnNldD0hMH19KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZCxcInNjYWxlXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3NjYWxlfSxzZXQ6ZnVuY3Rpb24oZCl7dGhpcy5fc2NhbGUgaW5zdGFuY2VvZiBjLlZlY3RvciYmdGhpcy5fc2NhbGUudW5iaW5kKGMuRXZlbnRzLmNoYW5nZSx0aGlzLl9yZW5kZXJlci5mbGFnU2NhbGUpO3RoaXMuX3NjYWxlPWQ7dGhpcy5fc2NhbGUgaW5zdGFuY2VvZiBjLlZlY3RvciYmdGhpcy5fc2NhbGUuYmluZChjLkV2ZW50cy5jaGFuZ2UsXG50aGlzLl9yZW5kZXJlci5mbGFnU2NhbGUpO3RoaXMuX2ZsYWdTY2FsZT0hMH19KX19KTtrLmV4dGVuZChoLnByb3RvdHlwZSxjLlV0aWxzLkV2ZW50cyxjLlNoYXBlLnByb3RvdHlwZSx7X2ZsYWdTcmM6ITEsX2ZsYWdJbWFnZTohMSxfZmxhZ1ZpZGVvOiExLF9mbGFnTG9hZGVkOiExLF9mbGFnUmVwZWF0OiExLF9mbGFnT2Zmc2V0OiExLF9mbGFnU2NhbGU6ITEsX3NyYzpcIlwiLF9pbWFnZTpudWxsLF9sb2FkZWQ6ITEsX3JlcGVhdDpcIm5vLXJlcGVhdFwiLF9zY2FsZToxLF9vZmZzZXQ6bnVsbCxjbG9uZTpmdW5jdGlvbigpe3JldHVybiBuZXcgaCh0aGlzLnNyYyl9LHRvT2JqZWN0OmZ1bmN0aW9uKCl7cmV0dXJue3NyYzp0aGlzLnNyYyxpbWFnZTp0aGlzLmltYWdlfX0sX3VwZGF0ZTpmdW5jdGlvbigpe2lmKHRoaXMuX2ZsYWdTcmN8fHRoaXMuX2ZsYWdJbWFnZXx8dGhpcy5fZmxhZ1ZpZGVvKWlmKHRoaXMudHJpZ2dlcihjLkV2ZW50cy5jaGFuZ2UpLHRoaXMuX2ZsYWdTcmN8fHRoaXMuX2ZsYWdJbWFnZSl0aGlzLmxvYWRlZD1cbiExLGgubG9hZCh0aGlzLGsuYmluZChmdW5jdGlvbigpe3RoaXMubG9hZGVkPSEwO3RoaXMudHJpZ2dlcihjLkV2ZW50cy5jaGFuZ2UpLnRyaWdnZXIoYy5FdmVudHMubG9hZCl9LHRoaXMpKTt0aGlzLl9pbWFnZSYmNDw9dGhpcy5faW1hZ2UucmVhZHlTdGF0ZSYmKHRoaXMuX2ZsYWdWaWRlbz0hMCk7cmV0dXJuIHRoaXN9LGZsYWdSZXNldDpmdW5jdGlvbigpe3RoaXMuX2ZsYWdTcmM9dGhpcy5fZmxhZ0ltYWdlPXRoaXMuX2ZsYWdMb2FkZWQ9dGhpcy5fZmxhZ1ZpZGVvPXRoaXMuX2ZsYWdTY2FsZT10aGlzLl9mbGFnT2Zmc2V0PSExO3JldHVybiB0aGlzfX0pO2guTWFrZU9ic2VydmFibGUoaC5wcm90b3R5cGUpfSkoKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgZ2xvYmFsP2dsb2JhbDp0aGlzKS5Ud28pO1xuKGZ1bmN0aW9uKGMpe3ZhciBrPWMuVXRpbHMsbT1jLlBhdGgsbD1jLlJlY3RhbmdsZSxoPWMuU3ByaXRlPWZ1bmN0aW9uKGQsZSxhLGcsaCxmKXttLmNhbGwodGhpcyxbbmV3IGMuQW5jaG9yLG5ldyBjLkFuY2hvcixuZXcgYy5BbmNob3IsbmV3IGMuQW5jaG9yXSwhMCk7dGhpcy5ub1N0cm9rZSgpO3RoaXMubm9GaWxsKCk7ZCBpbnN0YW5jZW9mIGMuVGV4dHVyZT90aGlzLnRleHR1cmU9ZDprLmlzU3RyaW5nKGQpJiYodGhpcy50ZXh0dXJlPW5ldyBjLlRleHR1cmUoZCkpO3RoaXMuX3VwZGF0ZSgpO3RoaXMudHJhbnNsYXRpb24uc2V0KGV8fDAsYXx8MCk7ay5pc051bWJlcihnKSYmKHRoaXMuY29sdW1ucz1nKTtrLmlzTnVtYmVyKGgpJiYodGhpcy5yb3dzPWgpO2suaXNOdW1iZXIoZikmJih0aGlzLmZyYW1lUmF0ZT1mKX07ay5leHRlbmQoaCx7UHJvcGVydGllczpbXCJ0ZXh0dXJlXCIsXCJjb2x1bW5zXCIsXCJyb3dzXCIsXCJmcmFtZVJhdGVcIixcImluZGV4XCJdLE1ha2VPYnNlcnZhYmxlOmZ1bmN0aW9uKGQpe2wuTWFrZU9ic2VydmFibGUoZCk7XG5rLmVhY2goaC5Qcm9wZXJ0aWVzLGMuVXRpbHMuZGVmaW5lUHJvcGVydHksZCl9fSk7ay5leHRlbmQoaC5wcm90b3R5cGUsbC5wcm90b3R5cGUse19mbGFnVGV4dHVyZTohMSxfZmxhZ0NvbHVtbnM6ITEsX2ZsYWdSb3dzOiExLF9mbGFnRnJhbWVSYXRlOiExLGZsYWdJbmRleDohMSxfYW1vdW50OjEsX2R1cmF0aW9uOjAsX3N0YXJ0VGltZTowLF9wbGF5aW5nOiExLF9maXJzdEZyYW1lOjAsX2xhc3RGcmFtZTowLF9sb29wOiEwLF90ZXh0dXJlOm51bGwsX2NvbHVtbnM6MSxfcm93czoxLF9mcmFtZVJhdGU6MCxfaW5kZXg6MCxwbGF5OmZ1bmN0aW9uKGMsZSxhKXt0aGlzLl9wbGF5aW5nPSEwO3RoaXMuX2ZpcnN0RnJhbWU9MDt0aGlzLl9sYXN0RnJhbWU9dGhpcy5hbW91bnQtMTt0aGlzLl9zdGFydFRpbWU9ay5wZXJmb3JtYW5jZS5ub3coKTtrLmlzTnVtYmVyKGMpJiYodGhpcy5fZmlyc3RGcmFtZT1jKTtrLmlzTnVtYmVyKGUpJiYodGhpcy5fbGFzdEZyYW1lPWUpO2suaXNGdW5jdGlvbihhKT9cbnRoaXMuX29uTGFzdEZyYW1lPWE6ZGVsZXRlIHRoaXMuX29uTGFzdEZyYW1lO3RoaXMuX2luZGV4IT09dGhpcy5fZmlyc3RGcmFtZSYmKHRoaXMuX3N0YXJ0VGltZS09MUUzKk1hdGguYWJzKHRoaXMuX2luZGV4LXRoaXMuX2ZpcnN0RnJhbWUpL3RoaXMuX2ZyYW1lUmF0ZSk7cmV0dXJuIHRoaXN9LHBhdXNlOmZ1bmN0aW9uKCl7dGhpcy5fcGxheWluZz0hMTtyZXR1cm4gdGhpc30sc3RvcDpmdW5jdGlvbigpe3RoaXMuX3BsYXlpbmc9ITE7dGhpcy5faW5kZXg9MDtyZXR1cm4gdGhpc30sY2xvbmU6ZnVuY3Rpb24oYyl7Yz1jfHx0aGlzLnBhcmVudDt2YXIgZD1uZXcgaCh0aGlzLnRleHR1cmUsdGhpcy50cmFuc2xhdGlvbi54LHRoaXMudHJhbnNsYXRpb24ueSx0aGlzLmNvbHVtbnMsdGhpcy5yb3dzLHRoaXMuZnJhbWVSYXRlKTt0aGlzLnBsYXlpbmcmJihkLnBsYXkodGhpcy5fZmlyc3RGcmFtZSx0aGlzLl9sYXN0RnJhbWUpLGQuX2xvb3A9dGhpcy5fbG9vcCk7YyYmYy5hZGQoZCk7cmV0dXJuIGR9LFxuX3VwZGF0ZTpmdW5jdGlvbigpe3ZhciBjPXRoaXMuX3RleHR1cmUsZT10aGlzLl9jb2x1bW5zLGE9dGhpcy5fcm93cztpZih0aGlzLl9mbGFnQ29sdW1uc3x8dGhpcy5fZmxhZ1Jvd3MpdGhpcy5fYW1vdW50PXRoaXMuX2NvbHVtbnMqdGhpcy5fcm93czt0aGlzLl9mbGFnRnJhbWVSYXRlJiYodGhpcy5fZHVyYXRpb249MUUzKnRoaXMuX2Ftb3VudC90aGlzLl9mcmFtZVJhdGUpO3RoaXMuX2ZsYWdUZXh0dXJlJiYodGhpcy5maWxsPXRoaXMuX3RleHR1cmUpO2lmKHRoaXMuX3RleHR1cmUubG9hZGVkKXt2YXIgZz1jLmltYWdlLndpZHRoO3ZhciBoPWMuaW1hZ2UuaGVpZ2h0O3ZhciBmPWcvZTthPWgvYTt2YXIgbT10aGlzLl9hbW91bnQ7dGhpcy53aWR0aCE9PWYmJih0aGlzLndpZHRoPWYpO3RoaXMuaGVpZ2h0IT09YSYmKHRoaXMuaGVpZ2h0PWEpO2lmKHRoaXMuX3BsYXlpbmcmJjA8dGhpcy5fZnJhbWVSYXRlKXtrLmlzTmFOKHRoaXMuX2xhc3RGcmFtZSkmJih0aGlzLl9sYXN0RnJhbWU9XG5tLTEpO209ay5wZXJmb3JtYW5jZS5ub3coKS10aGlzLl9zdGFydFRpbWU7dmFyIHY9dGhpcy5fbGFzdEZyYW1lKzE7dmFyIEI9MUUzKih2LXRoaXMuX2ZpcnN0RnJhbWUpL3RoaXMuX2ZyYW1lUmF0ZTttPXRoaXMuX2xvb3A/bSVCOk1hdGgubWluKG0sQik7bT1rLmxlcnAodGhpcy5fZmlyc3RGcmFtZSx2LG0vQik7bT1NYXRoLmZsb29yKG0pO20hPT10aGlzLl9pbmRleCYmKHRoaXMuX2luZGV4PW0sbT49dGhpcy5fbGFzdEZyYW1lLTEmJnRoaXMuX29uTGFzdEZyYW1lJiZ0aGlzLl9vbkxhc3RGcmFtZSgpKX1mPXRoaXMuX2luZGV4JWUqLWYrKGctZikvMjtlPS1hKk1hdGguZmxvb3IodGhpcy5faW5kZXgvZSkrKGgtYSkvMjtmIT09Yy5vZmZzZXQueCYmKGMub2Zmc2V0Lng9Zik7ZSE9PWMub2Zmc2V0LnkmJihjLm9mZnNldC55PWUpfWwucHJvdG90eXBlLl91cGRhdGUuY2FsbCh0aGlzKTtyZXR1cm4gdGhpc30sZmxhZ1Jlc2V0OmZ1bmN0aW9uKCl7dGhpcy5fZmxhZ1RleHR1cmU9dGhpcy5fZmxhZ0NvbHVtbnM9XG50aGlzLl9mbGFnUm93cz10aGlzLl9mbGFnRnJhbWVSYXRlPSExO2wucHJvdG90eXBlLmZsYWdSZXNldC5jYWxsKHRoaXMpO3JldHVybiB0aGlzfX0pO2guTWFrZU9ic2VydmFibGUoaC5wcm90b3R5cGUpfSkoKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgZ2xvYmFsP2dsb2JhbDp0aGlzKS5Ud28pO1xuKGZ1bmN0aW9uKGMpe3ZhciBrPWMuVXRpbHMsbT1jLlBhdGgsbD1jLlJlY3RhbmdsZSxoPWMuSW1hZ2VTZXF1ZW5jZT1mdW5jdGlvbihkLGUsYSxnKXttLmNhbGwodGhpcyxbbmV3IGMuQW5jaG9yLG5ldyBjLkFuY2hvcixuZXcgYy5BbmNob3IsbmV3IGMuQW5jaG9yXSwhMCk7dGhpcy5fcmVuZGVyZXIuZmxhZ1RleHR1cmVzPWsuYmluZChoLkZsYWdUZXh0dXJlcyx0aGlzKTt0aGlzLl9yZW5kZXJlci5iaW5kVGV4dHVyZXM9ay5iaW5kKGguQmluZFRleHR1cmVzLHRoaXMpO3RoaXMuX3JlbmRlcmVyLnVuYmluZFRleHR1cmVzPWsuYmluZChoLlVuYmluZFRleHR1cmVzLHRoaXMpO3RoaXMubm9TdHJva2UoKTt0aGlzLm5vRmlsbCgpO3RoaXMudGV4dHVyZXM9ay5tYXAoZCxoLkdlbmVyYXRlVGV4dHVyZSx0aGlzKTt0aGlzLl91cGRhdGUoKTt0aGlzLnRyYW5zbGF0aW9uLnNldChlfHwwLGF8fDApO2suaXNOdW1iZXIoZyk/dGhpcy5mcmFtZVJhdGU9Zzp0aGlzLmZyYW1lUmF0ZT1oLkRlZmF1bHRGcmFtZVJhdGV9O1xuay5leHRlbmQoaCx7UHJvcGVydGllczpbXCJmcmFtZVJhdGVcIixcImluZGV4XCJdLERlZmF1bHRGcmFtZVJhdGU6MzAsRmxhZ1RleHR1cmVzOmZ1bmN0aW9uKCl7dGhpcy5fZmxhZ1RleHR1cmVzPSEwfSxCaW5kVGV4dHVyZXM6ZnVuY3Rpb24oZCl7Zm9yKHZhciBlPWQubGVuZ3RoO2UtLTspZFtlXS5iaW5kKGMuRXZlbnRzLmNoYW5nZSx0aGlzLl9yZW5kZXJlci5mbGFnVGV4dHVyZXMpO3RoaXMuX3JlbmRlcmVyLmZsYWdUZXh0dXJlcygpfSxVbmJpbmRUZXh0dXJlczpmdW5jdGlvbihkKXtmb3IodmFyIGU9ZC5sZW5ndGg7ZS0tOylkW2VdLnVuYmluZChjLkV2ZW50cy5jaGFuZ2UsdGhpcy5fcmVuZGVyZXIuZmxhZ1RleHR1cmVzKTt0aGlzLl9yZW5kZXJlci5mbGFnVGV4dHVyZXMoKX0sTWFrZU9ic2VydmFibGU6ZnVuY3Rpb24oZCl7bC5NYWtlT2JzZXJ2YWJsZShkKTtrLmVhY2goaC5Qcm9wZXJ0aWVzLGMuVXRpbHMuZGVmaW5lUHJvcGVydHksZCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGQsXG5cInRleHR1cmVzXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3RleHR1cmVzfSxzZXQ6ZnVuY3Rpb24oZCl7dmFyIGE9dGhpcy5fcmVuZGVyZXIuYmluZFRleHR1cmVzLGU9dGhpcy5fcmVuZGVyZXIudW5iaW5kVGV4dHVyZXM7dGhpcy5fdGV4dHVyZXMmJnRoaXMuX3RleHR1cmVzLnVuYmluZChjLkV2ZW50cy5pbnNlcnQsYSkudW5iaW5kKGMuRXZlbnRzLnJlbW92ZSxlKTt0aGlzLl90ZXh0dXJlcz1uZXcgYy5VdGlscy5Db2xsZWN0aW9uKChkfHxbXSkuc2xpY2UoMCkpO3RoaXMuX3RleHR1cmVzLmJpbmQoYy5FdmVudHMuaW5zZXJ0LGEpLmJpbmQoYy5FdmVudHMucmVtb3ZlLGUpO2EodGhpcy5fdGV4dHVyZXMpfX0pfSxHZW5lcmF0ZVRleHR1cmU6ZnVuY3Rpb24oZCl7aWYoZCBpbnN0YW5jZW9mIGMuVGV4dHVyZSlyZXR1cm4gZDtpZihrLmlzU3RyaW5nKGQpKXJldHVybiBuZXcgYy5UZXh0dXJlKGQpfX0pO2suZXh0ZW5kKGgucHJvdG90eXBlLGwucHJvdG90eXBlLFxue19mbGFnVGV4dHVyZXM6ITEsX2ZsYWdGcmFtZVJhdGU6ITEsX2ZsYWdJbmRleDohMSxfYW1vdW50OjEsX2R1cmF0aW9uOjAsX2luZGV4OjAsX3N0YXJ0VGltZTowLF9wbGF5aW5nOiExLF9maXJzdEZyYW1lOjAsX2xhc3RGcmFtZTowLF9sb29wOiEwLF90ZXh0dXJlczpudWxsLF9mcmFtZVJhdGU6MCxwbGF5OmZ1bmN0aW9uKGMsZSxhKXt0aGlzLl9wbGF5aW5nPSEwO3RoaXMuX2ZpcnN0RnJhbWU9MDt0aGlzLl9sYXN0RnJhbWU9dGhpcy5hbW91bnQtMTt0aGlzLl9zdGFydFRpbWU9ay5wZXJmb3JtYW5jZS5ub3coKTtrLmlzTnVtYmVyKGMpJiYodGhpcy5fZmlyc3RGcmFtZT1jKTtrLmlzTnVtYmVyKGUpJiYodGhpcy5fbGFzdEZyYW1lPWUpO2suaXNGdW5jdGlvbihhKT90aGlzLl9vbkxhc3RGcmFtZT1hOmRlbGV0ZSB0aGlzLl9vbkxhc3RGcmFtZTt0aGlzLl9pbmRleCE9PXRoaXMuX2ZpcnN0RnJhbWUmJih0aGlzLl9zdGFydFRpbWUtPTFFMypNYXRoLmFicyh0aGlzLl9pbmRleC10aGlzLl9maXJzdEZyYW1lKS9cbnRoaXMuX2ZyYW1lUmF0ZSk7cmV0dXJuIHRoaXN9LHBhdXNlOmZ1bmN0aW9uKCl7dGhpcy5fcGxheWluZz0hMTtyZXR1cm4gdGhpc30sc3RvcDpmdW5jdGlvbigpe3RoaXMuX3BsYXlpbmc9ITE7dGhpcy5faW5kZXg9MDtyZXR1cm4gdGhpc30sY2xvbmU6ZnVuY3Rpb24oYyl7Yz1jfHx0aGlzLnBhcmVudDt2YXIgZD1uZXcgaCh0aGlzLnRleHR1cmVzLHRoaXMudHJhbnNsYXRpb24ueCx0aGlzLnRyYW5zbGF0aW9uLnksdGhpcy5mcmFtZVJhdGUpO2QuX2xvb3A9dGhpcy5fbG9vcDt0aGlzLl9wbGF5aW5nJiZkLnBsYXkoKTtjJiZjLmFkZChkKTtyZXR1cm4gZH0sX3VwZGF0ZTpmdW5jdGlvbigpe3ZhciBkPXRoaXMuX3RleHR1cmVzO3RoaXMuX2ZsYWdUZXh0dXJlcyYmKHRoaXMuX2Ftb3VudD1kLmxlbmd0aCk7dGhpcy5fZmxhZ0ZyYW1lUmF0ZSYmKHRoaXMuX2R1cmF0aW9uPTFFMyp0aGlzLl9hbW91bnQvdGhpcy5fZnJhbWVSYXRlKTtpZih0aGlzLl9wbGF5aW5nJiYwPHRoaXMuX2ZyYW1lUmF0ZSl7dmFyIGU9XG50aGlzLl9hbW91bnQ7ay5pc05hTih0aGlzLl9sYXN0RnJhbWUpJiYodGhpcy5fbGFzdEZyYW1lPWUtMSk7ZT1rLnBlcmZvcm1hbmNlLm5vdygpLXRoaXMuX3N0YXJ0VGltZTt2YXIgYT10aGlzLl9sYXN0RnJhbWUrMTt2YXIgZz0xRTMqKGEtdGhpcy5fZmlyc3RGcmFtZSkvdGhpcy5fZnJhbWVSYXRlO2U9dGhpcy5fbG9vcD9lJWc6TWF0aC5taW4oZSxnKTtlPWsubGVycCh0aGlzLl9maXJzdEZyYW1lLGEsZS9nKTtlPU1hdGguZmxvb3IoZSk7ZSE9PXRoaXMuX2luZGV4JiYodGhpcy5faW5kZXg9ZSxhPWRbdGhpcy5faW5kZXhdLGEubG9hZGVkJiYoZD1hLmltYWdlLndpZHRoLGc9YS5pbWFnZS5oZWlnaHQsdGhpcy53aWR0aCE9PWQmJih0aGlzLndpZHRoPWQpLHRoaXMuaGVpZ2h0IT09ZyYmKHRoaXMuaGVpZ2h0PWcpLHRoaXMuZmlsbD1hLGU+PXRoaXMuX2xhc3RGcmFtZS0xJiZ0aGlzLl9vbkxhc3RGcmFtZSYmdGhpcy5fb25MYXN0RnJhbWUoKSkpfWVsc2UhdGhpcy5fZmxhZ0luZGV4JiZcbnRoaXMuZmlsbCBpbnN0YW5jZW9mIGMuVGV4dHVyZXx8KGE9ZFt0aGlzLl9pbmRleF0sYS5sb2FkZWQmJihkPWEuaW1hZ2Uud2lkdGgsZz1hLmltYWdlLmhlaWdodCx0aGlzLndpZHRoIT09ZCYmKHRoaXMud2lkdGg9ZCksdGhpcy5oZWlnaHQhPT1nJiYodGhpcy5oZWlnaHQ9ZykpLHRoaXMuZmlsbD1hKTtsLnByb3RvdHlwZS5fdXBkYXRlLmNhbGwodGhpcyk7cmV0dXJuIHRoaXN9LGZsYWdSZXNldDpmdW5jdGlvbigpe3RoaXMuX2ZsYWdUZXh0dXJlcz10aGlzLl9mbGFnRnJhbWVSYXRlPSExO2wucHJvdG90eXBlLmZsYWdSZXNldC5jYWxsKHRoaXMpO3JldHVybiB0aGlzfX0pO2guTWFrZU9ic2VydmFibGUoaC5wcm90b3R5cGUpfSkoKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgZ2xvYmFsP2dsb2JhbDp0aGlzKS5Ud28pO1xuKGZ1bmN0aW9uKGMpe2Z1bmN0aW9uIGsoYSxjKXt2YXIgZD1hLnBhcmVudDtpZihkPT09Yyl0aGlzLmFkZGl0aW9ucy5wdXNoKGEpLHRoaXMuX2ZsYWdBZGRpdGlvbnM9ITA7ZWxzZXtpZihkJiZkLmNoaWxkcmVuLmlkc1thLmlkXSl7dmFyIGU9aC5pbmRleE9mKGQuY2hpbGRyZW4sYSk7ZC5jaGlsZHJlbi5zcGxpY2UoZSwxKTtlPWguaW5kZXhPZihkLmFkZGl0aW9ucyxhKTswPD1lP2QuYWRkaXRpb25zLnNwbGljZShlLDEpOihkLnN1YnRyYWN0aW9ucy5wdXNoKGEpLGQuX2ZsYWdTdWJ0cmFjdGlvbnM9ITApfWM/KGEucGFyZW50PWMsdGhpcy5hZGRpdGlvbnMucHVzaChhKSx0aGlzLl9mbGFnQWRkaXRpb25zPSEwKTooZT1oLmluZGV4T2YodGhpcy5hZGRpdGlvbnMsYSksMDw9ZT90aGlzLmFkZGl0aW9ucy5zcGxpY2UoZSwxKToodGhpcy5zdWJ0cmFjdGlvbnMucHVzaChhKSx0aGlzLl9mbGFnU3VidHJhY3Rpb25zPSEwKSxkZWxldGUgYS5wYXJlbnQpfX12YXIgbT1NYXRoLm1pbixsPVxuTWF0aC5tYXgsaD1jLlV0aWxzLGQ9ZnVuY3Rpb24oKXtjLlV0aWxzLkNvbGxlY3Rpb24uYXBwbHkodGhpcyxhcmd1bWVudHMpO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwiX2V2ZW50c1wiLHt2YWx1ZTp7fSxlbnVtZXJhYmxlOiExfSk7dGhpcy5pZHM9e307dGhpcy5vbihjLkV2ZW50cy5pbnNlcnQsdGhpcy5hdHRhY2gpO3RoaXMub24oYy5FdmVudHMucmVtb3ZlLHRoaXMuZGV0YWNoKTtkLnByb3RvdHlwZS5hdHRhY2guYXBwbHkodGhpcyxhcmd1bWVudHMpfTtkLnByb3RvdHlwZT1uZXcgYy5VdGlscy5Db2xsZWN0aW9uO2QucHJvdG90eXBlLmNvbnN0cnVjdG9yPWQ7aC5leHRlbmQoZC5wcm90b3R5cGUse2F0dGFjaDpmdW5jdGlvbihhKXtmb3IodmFyIGM9MDtjPGEubGVuZ3RoO2MrKyl0aGlzLmlkc1thW2NdLmlkXT1hW2NdO3JldHVybiB0aGlzfSxkZXRhY2g6ZnVuY3Rpb24oYSl7Zm9yKHZhciBjPTA7YzxhLmxlbmd0aDtjKyspZGVsZXRlIHRoaXMuaWRzW2FbY10uaWRdO3JldHVybiB0aGlzfX0pO1xudmFyIGU9Yy5Hcm91cD1mdW5jdGlvbigpe2MuU2hhcGUuY2FsbCh0aGlzLCEwKTt0aGlzLl9yZW5kZXJlci50eXBlPVwiZ3JvdXBcIjt0aGlzLmFkZGl0aW9ucz1bXTt0aGlzLnN1YnRyYWN0aW9ucz1bXTt0aGlzLmNoaWxkcmVuPWFyZ3VtZW50c307aC5leHRlbmQoZSx7Q2hpbGRyZW46ZCxJbnNlcnRDaGlsZHJlbjpmdW5jdGlvbihhKXtmb3IodmFyIGM9MDtjPGEubGVuZ3RoO2MrKylrLmNhbGwodGhpcyxhW2NdLHRoaXMpfSxSZW1vdmVDaGlsZHJlbjpmdW5jdGlvbihhKXtmb3IodmFyIGM9MDtjPGEubGVuZ3RoO2MrKylrLmNhbGwodGhpcyxhW2NdKX0sT3JkZXJDaGlsZHJlbjpmdW5jdGlvbihhKXt0aGlzLl9mbGFnT3JkZXI9ITB9LE1ha2VPYnNlcnZhYmxlOmZ1bmN0aW9uKGEpe3ZhciBnPWMuUGF0aC5Qcm9wZXJ0aWVzLnNsaWNlKDApLGs9aC5pbmRleE9mKGcsXCJvcGFjaXR5XCIpOzA8PWsmJihnLnNwbGljZShrLDEpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhLFwib3BhY2l0eVwiLHtlbnVtZXJhYmxlOiEwLFxuZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX29wYWNpdHl9LHNldDpmdW5jdGlvbihhKXt0aGlzLl9mbGFnT3BhY2l0eT10aGlzLl9vcGFjaXR5IT1hO3RoaXMuX29wYWNpdHk9YX19KSk7Yy5TaGFwZS5NYWtlT2JzZXJ2YWJsZShhKTtlLk1ha2VHZXR0ZXJTZXR0ZXJzKGEsZyk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsXCJjaGlsZHJlblwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jaGlsZHJlbn0sc2V0OmZ1bmN0aW9uKGEpe3ZhciBnPWguYmluZChlLkluc2VydENoaWxkcmVuLHRoaXMpLGY9aC5iaW5kKGUuUmVtb3ZlQ2hpbGRyZW4sdGhpcyksaz1oLmJpbmQoZS5PcmRlckNoaWxkcmVuLHRoaXMpO3RoaXMuX2NoaWxkcmVuJiZ0aGlzLl9jaGlsZHJlbi51bmJpbmQoKTt0aGlzLl9jaGlsZHJlbj1uZXcgZChhKTt0aGlzLl9jaGlsZHJlbi5iaW5kKGMuRXZlbnRzLmluc2VydCxnKTt0aGlzLl9jaGlsZHJlbi5iaW5kKGMuRXZlbnRzLnJlbW92ZSxcbmYpO3RoaXMuX2NoaWxkcmVuLmJpbmQoYy5FdmVudHMub3JkZXIsayl9fSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsXCJtYXNrXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX21hc2t9LHNldDpmdW5jdGlvbihhKXt0aGlzLl9tYXNrPWE7dGhpcy5fZmxhZ01hc2s9ITA7YS5jbGlwfHwoYS5jbGlwPSEwKX19KX0sTWFrZUdldHRlclNldHRlcnM6ZnVuY3Rpb24oYSxjKXtoLmlzQXJyYXkoYyl8fChjPVtjXSk7aC5lYWNoKGMsZnVuY3Rpb24oYyl7ZS5NYWtlR2V0dGVyU2V0dGVyKGEsYyl9KX0sTWFrZUdldHRlclNldHRlcjpmdW5jdGlvbihhLGMpe3ZhciBkPVwiX1wiK2M7T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsYyx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc1tkXX0sc2V0OmZ1bmN0aW9uKGEpe3RoaXNbZF09YTtoLmVhY2godGhpcy5jaGlsZHJlbixmdW5jdGlvbihkKXtkW2NdPWF9KX19KX19KTtoLmV4dGVuZChlLnByb3RvdHlwZSxcbmMuU2hhcGUucHJvdG90eXBlLHtfZmxhZ0FkZGl0aW9uczohMSxfZmxhZ1N1YnRyYWN0aW9uczohMSxfZmxhZ09yZGVyOiExLF9mbGFnT3BhY2l0eTohMCxfZmxhZ01hc2s6ITEsX2ZpbGw6XCIjZmZmXCIsX3N0cm9rZTpcIiMwMDBcIixfbGluZXdpZHRoOjEsX29wYWNpdHk6MSxfdmlzaWJsZTohMCxfY2FwOlwicm91bmRcIixfam9pbjpcInJvdW5kXCIsX21pdGVyOjQsX2Nsb3NlZDohMCxfY3VydmVkOiExLF9hdXRvbWF0aWM6ITAsX2JlZ2lubmluZzowLF9lbmRpbmc6MSxfbWFzazpudWxsLGNsb25lOmZ1bmN0aW9uKGEpe2E9YXx8dGhpcy5wYXJlbnQ7dmFyIGM9bmV3IGUsZD1oLm1hcCh0aGlzLmNoaWxkcmVuLGZ1bmN0aW9uKGEpe3JldHVybiBhLmNsb25lKGMpfSk7Yy5hZGQoZCk7Yy5vcGFjaXR5PXRoaXMub3BhY2l0eTt0aGlzLm1hc2smJihjLm1hc2s9dGhpcy5tYXNrKTtjLnRyYW5zbGF0aW9uLmNvcHkodGhpcy50cmFuc2xhdGlvbik7Yy5yb3RhdGlvbj10aGlzLnJvdGF0aW9uO2Muc2NhbGU9XG50aGlzLnNjYWxlO2EmJmEuYWRkKGMpO3JldHVybiBjfSx0b09iamVjdDpmdW5jdGlvbigpe3ZhciBhPXtjaGlsZHJlbjpbXSx0cmFuc2xhdGlvbjp0aGlzLnRyYW5zbGF0aW9uLnRvT2JqZWN0KCkscm90YXRpb246dGhpcy5yb3RhdGlvbixzY2FsZTp0aGlzLnNjYWxlLG9wYWNpdHk6dGhpcy5vcGFjaXR5LG1hc2s6dGhpcy5tYXNrP3RoaXMubWFzay50b09iamVjdCgpOm51bGx9O2guZWFjaCh0aGlzLmNoaWxkcmVuLGZ1bmN0aW9uKGMsZCl7YS5jaGlsZHJlbltkXT1jLnRvT2JqZWN0KCl9LHRoaXMpO3JldHVybiBhfSxjb3JuZXI6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCghMCksYz17eDphLmxlZnQseTphLnRvcH07dGhpcy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGEpe2EudHJhbnNsYXRpb24uc3ViU2VsZihjKX0pO3JldHVybiB0aGlzfSxjZW50ZXI6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCghMCk7YS5jZW50cm9pZD1cbnt4OmEubGVmdCthLndpZHRoLzIseTphLnRvcCthLmhlaWdodC8yfTt0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oYyl7Yy5pc1NoYXBlJiZjLnRyYW5zbGF0aW9uLnN1YlNlbGYoYS5jZW50cm9pZCl9KTtyZXR1cm4gdGhpc30sZ2V0QnlJZDpmdW5jdGlvbihhKXt2YXIgYz1mdW5jdGlvbihhLGQpe2lmKGEuaWQ9PT1kKXJldHVybiBhO2lmKGEuY2hpbGRyZW4pZm9yKHZhciBlPWEuY2hpbGRyZW4ubGVuZ3RoO2UtLTspe3ZhciBmPWMoYS5jaGlsZHJlbltlXSxkKTtpZihmKXJldHVybiBmfX07cmV0dXJuIGModGhpcyxhKXx8bnVsbH0sZ2V0QnlDbGFzc05hbWU6ZnVuY3Rpb24oYSl7dmFyIGM9W10sZD1mdW5jdGlvbihhLGUpey0xIT1hLmNsYXNzTGlzdC5pbmRleE9mKGUpP2MucHVzaChhKTphLmNoaWxkcmVuJiZhLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oYSl7ZChhLGUpfSk7cmV0dXJuIGN9O3JldHVybiBkKHRoaXMsYSl9LGdldEJ5VHlwZTpmdW5jdGlvbihhKXt2YXIgZD1cbltdLGU9ZnVuY3Rpb24oYSxnKXtmb3IodmFyIGYgaW4gYS5jaGlsZHJlbilhLmNoaWxkcmVuW2ZdaW5zdGFuY2VvZiBnP2QucHVzaChhLmNoaWxkcmVuW2ZdKTphLmNoaWxkcmVuW2ZdaW5zdGFuY2VvZiBjLkdyb3VwJiZlKGEuY2hpbGRyZW5bZl0sZyk7cmV0dXJuIGR9O3JldHVybiBlKHRoaXMsYSl9LGFkZDpmdW5jdGlvbihhKXthPWEgaW5zdGFuY2VvZiBBcnJheT9hLnNsaWNlKCk6aC50b0FycmF5KGFyZ3VtZW50cyk7Zm9yKHZhciBjPTA7YzxhLmxlbmd0aDtjKyspYVtjXSYmYVtjXS5pZCYmdGhpcy5jaGlsZHJlbi5wdXNoKGFbY10pO3JldHVybiB0aGlzfSxyZW1vdmU6ZnVuY3Rpb24oYSl7dmFyIGM9dGhpcy5wYXJlbnQ7aWYoMD49YXJndW1lbnRzLmxlbmd0aCYmYylyZXR1cm4gYy5yZW1vdmUodGhpcyksdGhpczthPWEgaW5zdGFuY2VvZiBBcnJheT9hLnNsaWNlKCk6aC50b0FycmF5KGFyZ3VtZW50cyk7Zm9yKGM9MDtjPGEubGVuZ3RoO2MrKylhW2NdJiZ0aGlzLmNoaWxkcmVuLmlkc1thW2NdLmlkXSYmXG50aGlzLmNoaWxkcmVuLnNwbGljZShoLmluZGV4T2YodGhpcy5jaGlsZHJlbixhW2NdKSwxKTtyZXR1cm4gdGhpc30sZ2V0Qm91bmRpbmdDbGllbnRSZWN0OmZ1bmN0aW9uKGEpe3ZhciBjO3RoaXMuX3VwZGF0ZSghMCk7dmFyIGQ9SW5maW5pdHksZT0tSW5maW5pdHksaz1JbmZpbml0eSx2PS1JbmZpbml0eTt0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oZil7LyhsaW5lYXItZ3JhZGllbnR8cmFkaWFsLWdyYWRpZW50fGdyYWRpZW50KS8udGVzdChmLl9yZW5kZXJlci50eXBlKXx8KGM9Zi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoYSksaC5pc051bWJlcihjLnRvcCkmJmguaXNOdW1iZXIoYy5sZWZ0KSYmaC5pc051bWJlcihjLnJpZ2h0KSYmaC5pc051bWJlcihjLmJvdHRvbSkmJihrPW0oYy50b3AsayksZD1tKGMubGVmdCxkKSxlPWwoYy5yaWdodCxlKSx2PWwoYy5ib3R0b20sdikpKX0sdGhpcyk7cmV0dXJue3RvcDprLGxlZnQ6ZCxyaWdodDplLGJvdHRvbTp2LHdpZHRoOmUtXG5kLGhlaWdodDp2LWt9fSxub0ZpbGw6ZnVuY3Rpb24oKXt0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oYSl7YS5ub0ZpbGwoKX0pO3JldHVybiB0aGlzfSxub1N0cm9rZTpmdW5jdGlvbigpe3RoaXMuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihhKXthLm5vU3Ryb2tlKCl9KTtyZXR1cm4gdGhpc30sc3ViZGl2aWRlOmZ1bmN0aW9uKCl7dmFyIGE9YXJndW1lbnRzO3RoaXMuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjKXtjLnN1YmRpdmlkZS5hcHBseShjLGEpfSk7cmV0dXJuIHRoaXN9LGZsYWdSZXNldDpmdW5jdGlvbigpe3RoaXMuX2ZsYWdBZGRpdGlvbnMmJih0aGlzLmFkZGl0aW9ucy5sZW5ndGg9MCx0aGlzLl9mbGFnQWRkaXRpb25zPSExKTt0aGlzLl9mbGFnU3VidHJhY3Rpb25zJiYodGhpcy5zdWJ0cmFjdGlvbnMubGVuZ3RoPTAsdGhpcy5fZmxhZ1N1YnRyYWN0aW9ucz0hMSk7dGhpcy5fZmxhZ09yZGVyPXRoaXMuX2ZsYWdNYXNrPXRoaXMuX2ZsYWdPcGFjaXR5PVxuITE7Yy5TaGFwZS5wcm90b3R5cGUuZmxhZ1Jlc2V0LmNhbGwodGhpcyk7cmV0dXJuIHRoaXN9fSk7ZS5NYWtlT2JzZXJ2YWJsZShlLnByb3RvdHlwZSl9KSgoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBnbG9iYWw/Z2xvYmFsOnRoaXMpLlR3byk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgKiBhcyBUd28gZnJvbSAndHdvanMtdHMnXHJcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9lbnRpdGllcy9QbGF5ZXInXHJcbmltcG9ydCB7IFNjb3JlIH0gZnJvbSAnLi9lbnRpdGllcy9TY29yZSdcclxuaW1wb3J0IHsgVGl0bGUgfSBmcm9tICcuL2VudGl0aWVzL1RpdGxlJ1xyXG5pbXBvcnQgeyBkZWx0YVRpbWUkIH0gZnJvbSAnLi9vYnNlcnZhYmxlcy9kZWx0YVRpbWUnXHJcbmltcG9ydCB7IGdhbWVTdGF0ZVN3aXRjaCB9IGZyb20gJy4vb2JzZXJ2YWJsZXMvZ2FtZVN0YXRlJ1xyXG5pbXBvcnQgeyBzcGF3bkVuZW1pZXMgfSBmcm9tICcuL29ic2VydmFibGVzL2VuZW1pZXMnXHJcbmltcG9ydCB7IG9uU3RhcnQsIHBsYXllck1vdmVtZW50LCBzdGFydEdhbWUgfSBmcm9tICcuL29ic2VydmFibGVzL3VzZXJJbnB1dCdcclxuaW1wb3J0IHsgSW50ZXJmYWNlIH0gZnJvbSAnLi9vYnNlcnZhYmxlcy91c2VySW50ZXJmYWNlJ1xyXG5pbXBvcnQgeyBwbGF5ZXJVcGRhdGUgfSBmcm9tICcuL29ic2VydmFibGVzL3BsYXllcidcclxuaW1wb3J0IHsgZnJvbUV2ZW50IH0gZnJvbSAncnhqcydcclxuaW1wb3J0IHsgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnXHJcblxyXG5jb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKVxyXG5jb25zdCB0d28gPSBuZXcgVHdvKHsgZnVsbHNjcmVlbjogdHJ1ZSB9KS5hcHBlbmRUbyhyb290KVxyXG5jb25zdCB1aUxheWVyID0gbmV3IFR3by5Hcm91cCgpXHJcbmNvbnN0IGdhbWVMYXllciA9IG5ldyBUd28uR3JvdXAoKVxyXG4vLyAgQHRzLWlnbm9yZVxyXG50d28uYWRkKGdhbWVMYXllciwgdWlMYXllcilcclxuXHJcbmNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIodHdvLCBnYW1lTGF5ZXIpXHJcbmNvbnN0IHNjb3JlID0gbmV3IFNjb3JlKHR3bywgdWlMYXllcilcclxuY29uc3QgdGl0bGUgPSBuZXcgVGl0bGUodHdvLCAwLCA0OCwgdWlMYXllcilcclxuY29uc3Qgc3VidGl0bGUgPSBuZXcgVGl0bGUodHdvLCA1NiwgMzIsIHVpTGF5ZXIpXHJcblxyXG5jb25zdCBVSSA9IEludGVyZmFjZShzY29yZSwgdGl0bGUsIHN1YnRpdGxlKVxyXG5cclxuZnJvbUV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScpLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgdGl0bGUuY2VudGVyKClcclxuICBzdWJ0aXRsZS5jZW50ZXIoKVxyXG59KVxyXG5cclxuY29uc3QgY2VudGVyUGxheWVyUGF3biQgPSBmcm9tRXZlbnQod2luZG93LCAncmVzaXplJykucGlwZSh0YXAoKCkgPT4gcGxheWVyLnJlc2V0KCkpKVxyXG5cclxuZ2FtZVN0YXRlU3dpdGNoKHtcclxuICBvblN0YXJ0OiBbb25TdGFydChwbGF5ZXIpLCBVSS5vblN0YXJ0JCwgY2VudGVyUGxheWVyUGF3biRdLFxyXG4gIG9uUGxheTogW1xyXG4gICAgcGxheWVyTW92ZW1lbnQocGxheWVyKSxcclxuICAgIHNwYXduRW5lbWllcyh0d28sIHBsYXllciwgc2NvcmUsIGdhbWVMYXllciksXHJcbiAgICBwbGF5ZXJVcGRhdGUocGxheWVyKSxcclxuICAgIFVJLm9uUGxheSQsXHJcbiAgXSxcclxuICBvbkVuZDogW3N0YXJ0R2FtZShwbGF5ZXIpLCBVSS5vbkVuZCRdLFxyXG59KS5zdWJzY3JpYmUoKVxyXG5cclxuZGVsdGFUaW1lJC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gIHR3by51cGRhdGUoKVxyXG59KVxyXG4iXSwic291cmNlUm9vdCI6IiJ9