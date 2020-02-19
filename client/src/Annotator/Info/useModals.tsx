/**
 * Hook to control status of 3 available dialogs
 * (Settings, Category, Annotations)
 * Only one dialog might be available per time
 */

import { useState, useCallback, useMemo } from 'react';

import { Maybe } from '../annotator.types';

interface ModalOpenState {
    settings: boolean;
    category: boolean;
    annotation: boolean;
}
interface ModalState {
    categoryId: Maybe<number>;
    annotationId: Maybe<number>;
}

const useModals = () => {
    const [modalOpen, _setOpenState] = useState<ModalOpenState>({
        settings: false,
        category: false,
        annotation: false,
    });
    const [modalState, _setModalState] = useState<ModalState>({
        categoryId: null,
        annotationId: null,
    });

    // in case some dialog is open
    // inform custom keyhandlers (useKeyPress hook)
    // about this fact ( to prevent from triggering )
    const isModalOpen = useMemo(
        () =>
            modalOpen.settings === true ||
            modalOpen.category === true ||
            modalOpen.annotation === true,
        [modalOpen],
    );

    // callbacks
    const closeAllModals = useCallback(() => {
        _setOpenState({
            settings: false,
            category: false,
            annotation: false,
        });
        _setModalState({ categoryId: null, annotationId: null });
    }, []);

    const openSettingsModal = useCallback(() => {
        _setOpenState({
            settings: true,
            category: false,
            annotation: false,
        });
        _setModalState({ categoryId: null, annotationId: null });
    }, []);

    const openCategoryModal = useCallback((categoryId: number) => {
        _setOpenState({
            settings: false,
            category: true,
            annotation: false,
        });
        _setModalState({ categoryId, annotationId: null });
    }, []);

    const openAnnotationModal = useCallback(
        (categoryId: number, annotationId: number) => {
            _setOpenState({
                settings: false,
                category: false,
                annotation: true,
            });
            _setModalState({ categoryId, annotationId });
        },
        [],
    );

    return {
        modalOpen,
        modalState,
        isModalOpen,
        closeAllModals,
        openSettingsModal,
        openCategoryModal,
        openAnnotationModal,
    };
};
export default useModals;
