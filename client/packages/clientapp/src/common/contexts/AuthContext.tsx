import React, { createContext } from 'react';

import { authService } from '../../Auth/authService';

export const AuthContext = createContext(authService);

export const AuthProvider: React.FC = ({ children }) => (
    <AuthContext.Provider value={authService}>{children}</AuthContext.Provider>
);
