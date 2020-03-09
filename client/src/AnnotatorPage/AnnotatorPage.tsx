import React, { useState, useEffect } from 'react';
import { useNavigation } from 'react-navi';
import { useSnackbar } from 'notistack';

import Annotator from '../Annotator/Annotator';
import { Api } from '../Annotator/annotator.api';

interface Props {
    imageId: number;
}

const AnnotatorPage: React.FC<Props> = ({ imageId }) => {
    const { navigate } = useNavigation();
    const { enqueueSnackbar } = useSnackbar();

    const [apiReady, setApiReady] = useState<boolean>(false);
    useEffect(() => {
        const initApi = async () => {
            await Api.init();
            setApiReady(true);
        };
        initApi();
    }, []);

    if (!apiReady) return null;

    return (
        <Annotator
            key={imageId}
            imageId={imageId}
            navigate={navigate}
            showDialogMsg={(msg: string, isError?: boolean) => {
                enqueueSnackbar(msg, {
                    variant: isError ? 'error' : 'success',
                });
            }}
        />
    );
};
export default AnnotatorPage;
