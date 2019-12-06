import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';

import { Image } from '../../../common/types';
import { useStyles } from './imageCard.styles';

interface Props {
    item: Image;
    onClick(): void;
    renderMenuItems(): JSX.Element;
}

const ImageCard: React.FC<Props> = ({ item, onClick, renderMenuItems }) => {
    const classes = useStyles();
    const [anchorEl, setAnchor] = useState<null | HTMLElement>(null);

    return (
        <Card>
            <CardActionArea onClick={onClick}>
                <CardMedia
                    className={classes.image}
                    style={{ height: 150 }}
                    image={
                        item.annotated
                            ? `/api/image/${item.id}?width=250&thumbnail=true`
                            : `/api/image/${item.id}?width=250`
                    }
                />
            </CardActionArea>

            <Box pt={1} pb={1} pl={2} pr={2}>
                <Grid container justify="space-between" alignItems="center">
                    <Grid item xs={10}>
                        <Typography noWrap component="div">
                            <Box
                                fontWeight="fontWeightBold"
                                textOverflow="ellipsis"
                            >
                                {item.file_name}
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton
                            size="small"
                            onClick={e => setAnchor(e.currentTarget)}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    </Grid>
                </Grid>

                {item.num_annotations > 0 && (
                    <Box mb={1}>{`${item.num_annotations} annotation`}</Box>
                )}

                <Box mb={1}>
                    {item.annotated ? 'Annotated' : 'No annotations'}
                </Box>
            </Box>

            <Menu
                keepMounted
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={() => {
                    setAnchor(null);
                }}
            >
                {renderMenuItems()}
            </Menu>
        </Card>
    );
};
export default ImageCard;
