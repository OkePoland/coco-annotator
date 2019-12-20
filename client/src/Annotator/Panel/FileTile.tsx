import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

interface Props {
    filename: string;
    prevImgId: number | null;
    nextImgId: number | null;
    changeImage: (imgId: number) => void;
}

const FileTile: React.FC<Props> = ({
    filename,
    prevImgId,
    nextImgId,
    changeImage,
}) => (
    <Grid container alignItems="center" wrap="nowrap">
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
