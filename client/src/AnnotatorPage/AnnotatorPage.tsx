import React, { useState, useEffect } from 'react';
import { useNavigation } from 'react-navi';
import { useSnackbar } from 'notistack';

import AxiosHandler from '../common/AxiosHandler';
import Annotator from '../Annotator/Annotator';

interface Props {
    imageId: number;
}

const AnnotatorPage: React.FC<Props> = ({ imageId }) => {
    const { navigate } = useNavigation();
    const { enqueueSnackbar } = useSnackbar();

    const [api, setApi] = useState<AxiosHandler | null>(null);
    useEffect(() => {
        const init = async () => {
            const api = new AxiosHandler();
            await api.init({
                baseURL: process.env.REACT_APP_API_BASE_URL,
                withCredentials: true,
            });
            setApi(api);
        };
        init();
    }, []);

    if (!api) return null;

    return (
        <Annotator
            key={imageId}
            imageId={imageId}
            api={api}
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
