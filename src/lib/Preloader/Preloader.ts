
import "./Preloader.css";
export const preloaderBarClassNamesSputnik = {
    "progress-bar": "preloader-progress-bar-sputnik",
    "progress-bar-inner": "preloader-progress-bar-inner-sputnik",
  };
export const preloaderSpinnerClassNamesSputnik = {
    "middle-circle" : "preloader-middle-circle-sputnik",
    "inner-circle": "preloader-inner-circle-sputnik"
}
export class PreloaderProgressBar {
   
    currentPalette?: {"progress-bar": string, "progress-bar-inner":string} ;

    constructor(palette?: {"progress-bar": string, "progress-bar-inner":string}) {
        this.currentPalette = palette
    }
    isVisible = false;


    show = (container?: HTMLDivElement) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("preloader-main-screen");  
        if (!container) {
            document.body.append(wrapper);
        } else {
            container.append(wrapper)
        }

        const inner = document.createElement("div");
        inner.classList.add(`preloader-progress-bar`);
        if (this.currentPalette?.["progress-bar"]) {
            inner.classList.add(this.currentPalette["progress-bar"])
        }
        wrapper.append(inner);

        const progressBar = document.createElement("div");
        progressBar.classList.add(`preloader-progress-bar-inner`);
        if (this.currentPalette?.["progress-bar-inner"]) {
            progressBar.classList.add(this.currentPalette["progress-bar-inner"])
        }
        inner.append(progressBar);
    };
    hide = () => {
        const preloader = document.querySelector(".preloader-main-screen");
        preloader?.remove()
    };

    setProgress = (progress: number, total: number) => {
        const progressBar = document.querySelector<HTMLDivElement>(".preloader-progress-bar-inner")
        if (!progressBar) {
            return
        } 
        progressBar.style.width = `${progress / total * 100 | 0}%`;
        if (progress === total && total) {
            this.hide()
        }
    }
 }


type PreloaderSpinnerClassnames = {"outer-circle": string, "middle-circle":string, "inner-circle":string}
export class PreloaderSpinner {

    currentPalette?: PreloaderSpinnerClassnames ;

    constructor(palette?: PreloaderSpinnerClassnames) {
        this.currentPalette = palette
    }
    show = (container?: HTMLDivElement) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("preloader-main-screen");  

        if (!container) {
            document.body.append(wrapper);
        } else {
            container.append(wrapper)
        }

        const outerCircle = document.createElement("div");
        outerCircle.classList.add(`preloader-spinner-outer-circle`)
        if (this.currentPalette?.["outer-circle"]) {
            outerCircle.classList.add(this.currentPalette["outer-circle"])
        } 
        wrapper.append(outerCircle);

        const middleCircle = document.createElement("div");
        middleCircle.classList.add(`preloader-spinner-middle-circle`);
        if (this.currentPalette?.["middle-circle"]) {
            middleCircle.classList.add(this.currentPalette["middle-circle"])
        }
        outerCircle.append(middleCircle);

        const innerCircle = document.createElement("div");
        innerCircle.classList.add(`preloader-spinner-inner-circle`)
        if (this.currentPalette?.["inner-circle"]) {
            innerCircle.classList.add(this.currentPalette["inner-circle"])
        }
        outerCircle.append(innerCircle)
    };
    hide = () => {
        const preloader = document.querySelector(".preloader-main-screen");
        preloader?.remove()
    };

}

