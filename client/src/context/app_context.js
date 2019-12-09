// @flow
import React from 'react';

type increamentCounterFuncType = (input: number) => void;
type AppStateType              = { a: number, theme: string };
type AppContextDataType       =  { state: AppStateType, increase: increamentCounterFuncType };


const AppContext = React.createContext<AppContextDataType>({});

export default AppContext;
export type {AppStateType, AppContextDataType};