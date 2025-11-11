import React, { useRef, useState, useContext, createContext } from 'react';

const ConfigContext = createContext(false);

export const withConfig = (value, children) => {
  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  return context;
};
