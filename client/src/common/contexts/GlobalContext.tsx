import React, { Dispatch, createContext, useReducer } from 'react';

import { AppInfo, Dataset } from '../types';

type IGlobalContext = [IGlobalContextState, Dispatch<Action>];

interface IGlobalContextState {
    appInfo: AppInfo;
    dataset: Dataset | null;
    processList: Array<string>;
    undoList: Array<null>; // TODO add Type
}

export enum ActionType {
    SET_SERVER_INFO,
    SET_DATASET,
    ADD_PROCESS,
    REMOVE_PROCESS,
    ADD_UNDO,
    REMOVE_UNDO,
    RESET_UNDO,
}

export type Action =
    | { type: ActionType.SET_SERVER_INFO; payload: AppInfo }
    | { type: ActionType.SET_DATASET; payload: Dataset | null }
    | { type: ActionType.ADD_PROCESS; payload: string }
    | { type: ActionType.REMOVE_PROCESS; payload: string }
    | { type: ActionType.ADD_UNDO }
    | { type: ActionType.REMOVE_UNDO }
    | { type: ActionType.RESET_UNDO };

const apiReducer = (
    state: IGlobalContextState,
    action: Action,
): IGlobalContextState => {
    switch (action.type) {
        case ActionType.SET_SERVER_INFO:
            return {
                ...state,
                appInfo: action.payload,
            };
        case ActionType.SET_DATASET:
            return {
                ...state,
                dataset: action.payload,
            };
        case ActionType.ADD_PROCESS:
            return {
                ...state,
                processList: [...state.processList, action.payload],
            };
        case ActionType.REMOVE_PROCESS:
            let idx = state.processList.indexOf(action.payload);
            if (idx > -1) {
                let newList = [...state.processList];
                newList.splice(idx, 1);
                return {
                    ...state,
                    processList: newList,
                };
            } else {
                return state;
            }
        case ActionType.ADD_UNDO:
        case ActionType.REMOVE_UNDO:
        case ActionType.RESET_UNDO:
        default:
            // TODO handle ADD_UNDO
            // TODO handle REMOVE_UNDO
            // TODO handle RESET_UNDO
            return state;
    }
};

const createInitContextValue: () => IGlobalContext = () => [
    createInitContextState(),
    () => {},
];

const createInitContextState: () => IGlobalContextState = () => ({
    appInfo: {
        name: '',
        author: '',
        demo: '',
        repo: '',
        git: { tag: '' },
        login_enabled: true,
        total_users: 1,
        allow_registration: true,
    },
    dataset: null,
    processList: [],
    undoList: [],
});

export const GlobalContext = createContext<IGlobalContext>(
    createInitContextValue(),
);

export const GlobalProvider: React.FC = ({ children }) => {
    const reducerTuple = useReducer(apiReducer, createInitContextState());
    return (
        <GlobalContext.Provider value={reducerTuple}>
            {children}
        </GlobalContext.Provider>
    );
};
