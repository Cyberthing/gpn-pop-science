"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreloaderSpinner = exports.PreloaderProgressBar = exports.preloaderSpinnerClassNamesSputnik = exports.preloaderBarClassNamesSputnik = void 0;
require("./Preloader.css");
exports.preloaderBarClassNamesSputnik = {
    "progress-bar": "preloader-progress-bar-sputnik",
    "progress-bar-inner": "preloader-progress-bar-inner-sputnik",
};
exports.preloaderSpinnerClassNamesSputnik = {
    "middle-circle": "preloader-middle-circle-sputnik",
    "inner-circle": "preloader-inner-circle-sputnik"
};
class PreloaderProgressBar {
    constructor(palette) {
        this.isVisible = false;
        this.show = (container) => {
            if(this.wrapper){
                return
            }

            if(container)
                this.container = container

            container = container??this.container

            var _a, _b;
            const wrapper = document.createElement("div");
            this.wrapper = wrapper
            wrapper.classList.add("preloader-main-screen");
            if (!container) {
                document.body.append(wrapper);
            }
            else {
                container.append(wrapper);
            }
            const inner = document.createElement("div");
            inner.classList.add(`preloader-progress-bar`);
            if ((_a = this.currentPalette) === null || _a === void 0 ? void 0 : _a["progress-bar"]) {
                inner.classList.add(this.currentPalette["progress-bar"]);
            }
            wrapper.append(inner);
            const progressBar = document.createElement("div");
            progressBar.classList.add(`preloader-progress-bar-inner`);
            if ((_b = this.currentPalette) === null || _b === void 0 ? void 0 : _b["progress-bar-inner"]) {
                progressBar.classList.add(this.currentPalette["progress-bar-inner"]);
            }
            inner.append(progressBar);
        };
        this.hide = () => {
            if(this.wrapper){
                this.wrapper.remove();
                this.wrapper = null
            }
        };
        this.setProgress = (progress, total) => {
            // trace('setProgress', progress, total)
            // if (progress === total) {
            //     this.hide();
            // }
            //    else{
            //     this.show();
            // }

            const progressBar = document.querySelector(".preloader-progress-bar-inner");
            if (progressBar) {
                progressBar.style.width = `${progress / total * 100 | 0}%`;
            }
        };
        this.currentPalette = palette;
    }
}
exports.PreloaderProgressBar = PreloaderProgressBar;
class PreloaderSpinner {
    constructor(palette) {
        this.show = (container) => {
            var _a, _b, _c;
            const wrapper = document.createElement("div");
            wrapper.classList.add("preloader-main-screen");
            if (!container) {
                document.body.append(wrapper);
            }
            else {
                container.append(wrapper);
            }
            const outerCircle = document.createElement("div");
            outerCircle.classList.add(`preloader-spinner-outer-circle`);
            if ((_a = this.currentPalette) === null || _a === void 0 ? void 0 : _a["outer-circle"]) {
                outerCircle.classList.add(this.currentPalette["outer-circle"]);
            }
            wrapper.append(outerCircle);
            const middleCircle = document.createElement("div");
            middleCircle.classList.add(`preloader-spinner-middle-circle`);
            if ((_b = this.currentPalette) === null || _b === void 0 ? void 0 : _b["middle-circle"]) {
                middleCircle.classList.add(this.currentPalette["middle-circle"]);
            }
            outerCircle.append(middleCircle);
            const innerCircle = document.createElement("div");
            innerCircle.classList.add(`preloader-spinner-inner-circle`);
            if ((_c = this.currentPalette) === null || _c === void 0 ? void 0 : _c["inner-circle"]) {
                innerCircle.classList.add(this.currentPalette["inner-circle"]);
            }
            outerCircle.append(innerCircle);
        };
        this.hide = () => {
            const preloader = document.querySelector(".preloader-main-screen");
            preloader === null || preloader === void 0 ? void 0 : preloader.remove();
        };
        this.currentPalette = palette;
    }
}
exports.PreloaderSpinner = PreloaderSpinner;
