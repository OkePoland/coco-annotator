import { useEffect, useCallback } from 'react';

const useKeyPress = (
    keyName: string,
    isDisabled: boolean,
    action: () => void,
) => {
    const onDown = useCallback(
        (event: any) => {
            if (isDisabled) return; // eg in case if dialog is open
            if (event.key === keyName) action();
        },
        [keyName, action, isDisabled],
    );

    useEffect(() => {
        window.addEventListener('keydown', onDown);
        return () => {
            window.removeEventListener('keydown', onDown);
        };
    }, [onDown]);
};
export default useKeyPress;
