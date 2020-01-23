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
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '@material-ui/core/Chip';

import { useStyles } from './listCard.styles';
import { DatasetWithCategories } from './list.hooks';

interface Props {
    item: DatasetWithCategories;
    onClick(): void;
    renderMenuItems(closeMenu: () => void): JSX.Element;
}

const DatasetCard: React.FC<Props> = ({ item, onClick, renderMenuItems }) => {
    const classes = useStyles();
    const [anchorEl, setAnchor] = useState<null | HTMLElement>(null);

    const closeMenu = () => {
        setAnchor(null);
    };

    return (
        <Card>
            <CardActionArea onClick={onClick}>
                <CardMedia
                    className={classes.image}
                    image={
                        item.first_image_id != null
                            ? `/api/image/${item.first_image_id}?width=250`
                            : 'img/no-image.png'
                    }
                />
            </CardActionArea>

            <Box pt={1} pb={1} pl={2} pr={2}>
                <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                        <Typography component="div">
                            <Box fontWeight="fontWeightBold">{item.name}</Box>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton
                            size="small"
                            onClick={event => {
                                setAnchor(event.currentTarget);
                            }}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    </Grid>
                </Grid>

                <Box mb={1}>
                    {item.numberImages > 0 ? (
                        <Box textAlign="center">
                            <Typography>
                                {`${item.numberAnnotated} of ${item.numberImages} images annotated.`}
                            </Typography>

                            <LinearProgress
                                variant="determinate"
                                value={
                                    (item.numberAnnotated / item.numberImages) *
                                    100
                                }
                            />
                        </Box>
                    ) : (
                        <Box>No images in dataset.</Box>
                    )}
                </Box>

                <Box textAlign="left">
                    {item.categories.map(o => {
                        return (
                            <Chip
                                size="small"
                                key={o.id}
                                label={o.name}
                                style={{ backgroundColor: o.color }}
                                className={classes.categoryChip}
                            />
                        );
                    })}
                </Box>
            </Box>

            <Box textAlign="center" boxShadow={3}>
                Created by {item.owner}
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
                {renderMenuItems(closeMenu)}
            </Menu>
        </Card>
    );
};
export default DatasetCard;
