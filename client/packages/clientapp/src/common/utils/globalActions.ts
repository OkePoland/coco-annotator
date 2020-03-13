import { Dispatch } from 'react';

import { AppInfo, Dataset } from '../types';
import { Action, ActionType } from '../contexts/GlobalContext';

export const setAppInfo = (dispatch: Dispatch<Action>, info: AppInfo) => {
    dispatch({ type: ActionType.SET_SERVER_INFO, payload: info });
};
export const setDataset = (
    dispatch: Dispatch<Action>,
    dataset: Dataset | null,
) => {
    dispatch({ type: ActionType.SET_DATASET, payload: dataset });
};
export const addProcess = (dispatch: Dispatch<Action>, process: string) => {
    dispatch({ type: ActionType.ADD_PROCESS, payload: process });
};
export const removeProcess = (dispatch: Dispatch<Action>, process: string) => {
    dispatch({ type: ActionType.REMOVE_PROCESS, payload: process });
};
export const addUndo = (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.ADD_UNDO });
};
export const removeUndo = (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.REMOVE_UNDO });
};
export const resetUndo = (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.RESET_UNDO });
};
