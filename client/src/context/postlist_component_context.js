// @flow
import React from 'react';

type PostlistComponentStateType        =  { theme: string };
type PostlistComponentContextDataType  =  any;


const PostlistComponentContext = React.createContext<PostlistComponentContextDataType>({});

export default PostlistComponentContext;
export type {PostlistComponentStateType, PostlistComponentContextDataType};