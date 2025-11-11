import { isArray, isFunction, isObject } from '@ips/app/hidash';
import React, { Fragment } from 'react'

const nul = () => null;

export const createFactory = (dict)=>{
  const get = isFunction(dict) ? dict : isObject(dict) ? (typename) => dict[typename] : nul

  const renderOne = (p, i, Def) => {
    if (!p) return null;
    const C = get(p.layout || p.__typename) || Def;
    // trace('renderOne', p.__typename)
    // if('Block' == p.__typename)
    //  trace('gotsom', C)
    if (C) {
      return <C key={i} {...p} />;
    }
  };

  const renderSome = (some, Def) => {
    // if(!some || isArray(some)&&(!some.length))
    // return null
    // trace('renderSome', some)

    if (isArray(some)) return some.map((s, i) => renderOne(s, i, Def));

    return renderOne(some, 0, Def);
  };

  const Factory = ({ elements }) => {
    return <>{renderSome(elements, Typer)}</>;
  };

  const optionalFactory = (some) => {
    if (!some || (isArray(some) && !some.length)) return null;
    return <Factory elements={some} />;
  };

  const Block = (p) => {
    // trace('Block', p)
    const { __typename, layout, elements, ...pp } = p;
    const C = get(layout || __typename) || Fragment;
    return <C {...pp}>{optionalFactory(elements)}</C>;
  };

  return ({
    get,
    renderOne,
    renderSome,
    Factory,
    optionalFactory,
    Block,
  })
}

export const Typer = ({ __typename, layout }) => (
  <div>{`[ ${__typename}${layout ? ` (${layout})` : ''} ]`}</div>
);

export default createFactory;
