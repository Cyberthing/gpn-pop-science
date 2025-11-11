import React, { useState } from "react";
import { useMemo, useCallback } from "use-memo-one";
import { nop } from "@ips/app/hidash";
import { requestUrl } from '@ips/app/resource'

// import viewportUnitsBuggyfill from 'viewport-units-buggyfill';
// viewportUnitsBuggyfill.init();

import "./main.styl";

import { preloader } from "./core/preloader";
import { withResourceProvider } from '@ips/react/components/utils/resource';

import {
  LoadingQueue,
  withLoadingQueue,
  useLoadingQueue,
  enueueWithPriority,
} from "@ips/react/components/utils/use-loading-queue";

import {
  createSceneLogic,
  StandaloneSceneLogic,
  RiaSceneLogic,
  useScene,
  withScene,
} from "@ips/react/components/utils/use-scene";

import App from "./views/App";

const DEBUGVIEW = false;
// import { Hex, grid, getPerimeter } from './utils/Perimeter';

const Main = (p) => {
  const { project } = p.mountData || {};

  return <App project={project} {...p} />;
};

const WrMain = (p) => {
  const lq = useLoadingQueue(LoadingQueue, {
    progress: (progress, total) => {
      preloader.setProgress(progress, total);
    },
    step: 0.05,
    log: DEBUGVIEW,
  });


  const { data = {} } = p;
  // trace('WrMain data', data)
  
  const { config = {} } = data;
  const { mode = 'local', resourceURI = '' } = config||'';
  const [scene, setScene] = useState();
  const [sceneLogic] = useState(() =>
    createSceneLogic(
      RiaSceneLogic,
      { mobileWidth: 650, tabletWidth: 1024 },
      setScene
    )
  );

  return withResourceProvider(
    {
      requestUrl:
        mode == 'local'
          ? requestUrl
          : (url, type, opts) => `${resourceURI}${url}`,
    },
    withLoadingQueue(lq, withScene(scene, <Main {...p} />))
  );
};

export default WrMain;
