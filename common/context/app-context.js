import React, { createContext, } from 'react';

export const AppContext = createContext({ user: null, isLoggedIn: false, });
