/**
 * Hook to control status of 3 available dialogs
 * (Settings, Category, Annotations)
 * Only one dialog might be available per time
 */

import { useState, useCallback, useMemo } from 'react';

import { Maybe } from '../app.types';

interface ModalOpenState {
    settings: boolean;
    category: boolean;
    annotation: boolean;
    copy: boolean;
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
        copy: false,
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
            modalOpen.annotation === true ||
            modalOpen.copy === true,
        [modalOpen],
    );

    // callbacks
    const closeAllModals = useCallback(() => {
        _setOpenState({
            settings: false,
            category: false,
            annotation: false,
            copy: false,
        });
        _setModalState({ categoryId: null, annotationId: null });
    }, []);

    const openSettingsModal = useCallback(() => {
        _setOpenState({
            settings: true,
            category: false,
            annotation: false,
            copy: false,
        });
        _setModalState({ categoryId: null, annotationId: null });
    }, []);

    const openCategoryModal = useCallback((categoryId: number) => {
        _setOpenState({
            settings: false,
            category: true,
            annotation: false,
            copy: false,
        });
        _setModalState({ categoryId, annotationId: null });
    }, []);

    const openAnnotationModal = useCallback(
        (categoryId: number, annotationId: number) => {
            _setOpenState({
                settings: false,
                category: false,
                annotation: true,
                copy: false,
            });
            _setModalState({ categoryId, annotationId });
        },
        [],
    );

    const openCopyModal = useCallback(() => {
        _setOpenState({
            settings: false,
            category: false,
            annotation: false,
            copy: true,
        });
        _setModalState({ categoryId: null, annotationId: null });
    }, []);

    return {
        modalOpen,
        modalState,
        isModalOpen,
        closeAllModals,
        openSettingsModal,
        openCategoryModal,
        openAnnotationModal,
        openCopyModal,
    };
};
export default useModals;
