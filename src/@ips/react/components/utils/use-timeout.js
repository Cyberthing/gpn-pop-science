import { useRef, useEffect } from 'react';

/**
 * useTimeout is a React.js custom hook that sets a leak-safe timeout and returns
 * a function to cancel it before the timeout expires.
 * It's composed of two other native hooks, useRef and useEffect.
 * It requires a custom way of setting a timeout and clearing it, expressed as an implementation
 * of the generic TimeoutHandler<T> interface.
 * The timer is restarted every time an item in `deps` changes.
 * If a new callback is given to the hook before the previous timeout expires,
 * only the new callback will be executed at the moment the timeout expires.
 * When the hook receives a new callback, the timeout isn't reset.
 *
 * @param callback the function to be executed after the timeout expires
 * @param timeout the number of milliseconds after which the callback should be triggered
 * @param timeHandler TimeoutHandler instance that's used to set and clear the timeout
 * @param deps useEffect dependencies that should cause the timeout to be reset
 * @return function to cancel the timer before the timeout expires
 */
var useTimeout = function (callback, timeout, timeHandler, deps) {
    if (deps === void 0) { deps = []; }
    var refCallback = useRef();
    var refTimer = useRef();
    useEffect(function () {
        refCallback.current = callback;
    }, [callback]);
    /**
     * The timer is restarted every time an item in `deps` changes.
     *
     * TODO: The `react-hooks/exhaustive-deps` ESLint warning is disabled due to the fact that
     * the linter isn't able to detect misused `useEffect` dependencies when given a computed
     * array (such as `deps`). If possible, another solution that doesn't block the linter
     * should be used.
     */
    useEffect(function () {
        var timerID = timeHandler.setTimeout(refCallback.current, timeout);
        refTimer.current = timerID;
        // cleans the timer identified by timerID when the effect is unmounted.
        return function () { return timeHandler.clearTimeout(timerID); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    /**
     * Returns a function that can be used to cancel the current timeout.
     * It does so using `timeHandler.clearTimeout` without exposing the last
     * reference to the timer to the user.
     */
    function cancelTimer() {
        return timeHandler.clearTimeout(refTimer.current);
    }
    return cancelTimer;
};

/**
 * defaultTimeoutHandler implements the TimeoutHandler interface with the usual timer
 * functions available in browsers and in React Native, i.e. `setTimeout` and `clearTimeout`.
 */
var defaultTimeoutHandler = {
    setTimeout: function (fn, timeout) { return window.setTimeout(fn, timeout); },
    clearTimeout: function (timeout) { window.clearTimeout(timeout); },
};

/**
 * useTimeoutDefault is a React.js custom hook that sets a leak-safe timeout and returns
 * a function to cancel it before the timeout expires.
 * It uses the default timeout handlers, i.e. window.setTimeout and window.clearTimeout.
 * It's composed of two other native hooks, useRef and useEffect.
 * If a new callback is given to the hook before the previous timeout expires,
 * only the new callback will be executed at the moment the timeout expires.
 * When the hook receives a new callback, the timeout isn't reset.
 *
 * @param callback the function to be executed after the timeout expires
 * @param timeout the number of milliseconds after which the callback should be triggered
 * @param deps useEffect dependencies that should cause the timeout to be reset
 * @return function to cancel the timer before the timeout expires
 */
var useTimeoutDefault = function (callback, timeout, deps) {
    if (deps === void 0) { deps = []; }
    return (useTimeout(callback, timeout, defaultTimeoutHandler, deps));
};

export default useTimeoutDefault;
export { defaultTimeoutHandler, useTimeout };
//# sourceMappingURL=index.es.js.map
