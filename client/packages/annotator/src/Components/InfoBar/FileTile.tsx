import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { Maybe } from '../../annotator.types';

interface Props {
    className: string;
    filename: string;
    prevImgId: Maybe<number>;
    nextImgId: Maybe<number>;
    changeImage: (imgId: number) => void;
}

const FileTile: React.FC<Props> = ({
    className,
    filename,
    prevImgId,
    nextImgId,
    changeImage,
}) => (
    <Grid container alignItems="center" wrap="nowrap" className={className}>
        <Grid item>
            {prevImgId != null && (
                <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => {
                        changeImage(prevImgId);
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>
            )}
        </Grid>

        <Grid item xs={9}>
            <Typography noWrap component="div">
                {filename}
            </Typography>
        </Grid>

        <Grid item>
            {nextImgId != null && (
                <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => {
                        changeImage(nextImgId);
                    }}
                >
                    <ArrowForwardIcon />
                </IconButton>
            )}
        </Grid>
    </Grid>
);
export default FileTile;
