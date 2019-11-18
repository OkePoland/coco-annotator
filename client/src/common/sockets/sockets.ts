import io from 'socket.io-client';

const url = 'http://localhost:8080'; // TODO relace with valid url

export const socket = io(url);
