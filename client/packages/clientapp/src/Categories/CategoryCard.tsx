import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import Brightness1Icon from '@material-ui/icons/Brightness1';

import { useStyles } from './categoryCard.styles';
import { Category } from '../common/types';

interface Props {
    item: Category;
    renderMenuItems: (closeMenu: () => void) => JSX.Element;
}

const CategoryCard: React.FC<Props> = ({ item, renderMenuItems }) => {
    const classes = useStyles({ color: item.color });
    const [anchorEl, setAnchor] = useState<null | HTMLElement>(null);

    const closeMenu = () => {
        setAnchor(null);
    };

    return (
        <Card>
            <Grid
                container
                justify="space-between"
                alignItems="center"
                className={classes.container}
            >
                <Grid item>
                    <Typography component="div" className={classes.title}>
                        <Brightness1Icon className={classes.colorIcon} />
                        {item.name}
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
            {item.numberAnnotations > 0 ? (
                <Typography align="center">
                    {`${item.numberAnnotations} objects have been made with this
                    category.`}
                </Typography>
            ) : (
                <Typography align="center">
                    No annotations use this category
                </Typography>
            )}
            <Box textAlign="center" boxShadow={3} mt={2}>
                Created by {item.creator}
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

export default CategoryCard;
