export declare const preloaderBarClassNamesSputnik: {
    "progress-bar": string;
    "progress-bar-inner": string;
};
export declare class PreloaderProgressBar {
    currentPalette?: {
        "progress-bar": string;
        "progress-bar-inner": string;
    };
    constructor(palette?: {
        "progress-bar": string;
        "progress-bar-inner": string;
    });
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    setProgress: (progress: number, total: number) => void;
}
declare type PreloaderSpinnerClassnames = {
    "outer-circle": string;
    "middle-circle": string;
    "inner-circle": string;
};
export declare class PreloaderSpinner {
    currentPalette?: PreloaderSpinnerClassnames;
    constructor(palette?: PreloaderSpinnerClassnames);
    show: () => void;
    hide: () => void;
}
export {};
