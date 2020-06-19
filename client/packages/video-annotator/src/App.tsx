import React, { useMemo, useCallback } from 'react';
import {
    AnnotatorProps,
} from './app.types';

import * as CONFIG from './app.config';
import { useStyles } from './app.styles';

const App: React.FC<AnnotatorProps> = ({
    imageId,
    navigate,
    showDialogMsg,
    themeObj = CONFIG.DEFAULT_THEME,
}) => {
    const classes = useStyles(themeObj);

    return (
        <div className={classes.root}>
            VIDEO ANNOTATOR
        </div>
    );
};

export default App;
