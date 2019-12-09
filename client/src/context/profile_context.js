// @flow
import React from 'react';

type ProfileStateType        =  { theme: string };
type ProfileContextDataType  =  { state: ProfileStateType, didCreatePost: () => void };

const ProfileContext = React.createContext<ProfileContextDataType>({});

export default ProfileContext;
export type {ProfileStateType, ProfileContextDataType};