import React, { Fragment, useRef, useState, useEffect, useContext } from 'react'
import { useMemo, useCallback } from 'use-memo-one'

import viewportUnitsBuggyfill from 'viewport-units-buggyfill'
viewportUnitsBuggyfill.init();

import './main.styl'
import { nop } from '@ips/app/hidash'

import {
  LoadingQueue,
  withLoadingQueue,
  useLoadingQueue,
  enueueWithPriority,
} from '@ips/react/components/utils/use-loading-queue';

import {
  createSceneLogic,
  StandaloneSceneLogic,
  RiaSceneLogic,
  useScene,
  withScene,
} from '@ips/react/components/utils/use-scene';

const DEBUGVIEW = false

const Main = p=>{

    const ref = useRef()
    const { mode, project } = p.mountData || {}

    trace('main.render', project, mode)

    return  <div ref={ref} className={ `app ${project||''} mode-${ mode }` }>
                { project }
           </div>
}

const WrMain = (p) => {
  const lq = useLoadingQueue(LoadingQueue, { progress: nop, step: 0.05, log: DEBUGVIEW });

  const [scene, setScene] = useState();
  const [sceneLogic] = useState(() =>
    createSceneLogic(RiaSceneLogic, { mobileWidth: 400, tabletWidth: 768 }, setScene),
  );

  // trace('scene', scene);

  return withLoadingQueue(lq, withScene(scene, <Main {...p} />));

  // return (
  //   <RouterProvider router={AppRouter}>
  //     {withLoadingQueue(lq, withScene(scene, <Main {...p} />))}
  //   </RouterProvider>
  // );
}

export default WrMain;
