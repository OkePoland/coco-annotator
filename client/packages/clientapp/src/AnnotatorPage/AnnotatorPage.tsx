import React, { useEffect, useState } from 'react';
import { useNavigation } from 'react-navi';
import { useSnackbar } from 'notistack';

// import { SharedComponent1 } from '@multi-annotator/core';
import {
    // AnnotatorTheme,
    Annotator,
    AnnotatorApi,
} from '@multi-annotator/annotator';

interface Props {
    imageId: number;
}

// const overrideTheme: AnnotatorTheme = {
//     leftPanel: '#4b5162',
//     middlePanel: '#7c818c',
//     rightPanel: '#4b5162',
//     text: '#ff0000',
// };

const AnnotatorPage: React.FC<Props> = ({ imageId }) => {
    const { navigate } = useNavigation();
    const { enqueueSnackbar } = useSnackbar();

    const [apiReady, setApiReady] = useState<boolean>(false);
    useEffect(() => {
        const initApi = async () => {
            await AnnotatorApi.init(process.env.REACT_APP_API_BASE_URL || '');
            setApiReady(true);
        };
        initApi();
    }, []);

    if (!apiReady) return null;

    return (
        <Annotator
            key={imageId}
            imageId={imageId}
            // themeObj={overrideTheme}
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
