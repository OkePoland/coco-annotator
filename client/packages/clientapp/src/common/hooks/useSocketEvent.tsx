import { useContext, useEffect, useRef } from 'react';

import { SocketContext } from '../contexts/SocketContext';
import { SocketEvent } from '../sockets/events';

interface IUseSocketEvent {
    (
        eventKey: SocketEvent,
        callback: (...args: [any]) => void,
    ): SocketIOClient.Socket;
}

const useSocketEvent: IUseSocketEvent = (eventKey, callback) => {
    const socket = useContext(SocketContext);
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    function socketHandler(...args: [any]) {
        if (callbackRef.current) {
            callbackRef.current(...args);
        }
    }

    useEffect(() => {
        if (eventKey) {
            console.log(`Socket: register event: '${eventKey}'`);
            socket.on(eventKey, socketHandler);

            return () => {
                console.log(`Socket: unregister event: '${eventKey}'`);
                socket.removeListener(eventKey, socketHandler);
            };
        }
    }, [eventKey, socket]);

    return socket;
};

export default useSocketEvent;
