import React, { useEffect, useState } from 'react';
import { useNavigation } from 'react-navi';
import { useSnackbar } from 'notistack';

import { Annotator, AnnotatorApi } from '@multi-annotator/video-annotator';

interface Props {
    id: number;
}

const VideoEditor: React.FC<Props> = ({ id }) => {
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
            key={id}
            imageId={id}
            navigate={navigate}
            showDialogMsg={(msg: string, isError?: boolean) => {
                enqueueSnackbar(msg, {
                    variant: isError ? 'error' : 'success',
                });
            }}
        />
    );
};

export default VideoEditor;
