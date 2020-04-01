import React, { createContext } from 'react';

import { socket } from '../sockets/sockets';

export const SocketContext = createContext(socket);

export const SocketProvider: React.FC = ({ children }) => (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
);
