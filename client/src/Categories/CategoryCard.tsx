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
import { Category } from './categories.api';

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
            <Box pt={1} pb={1} pl={2} pr={2}>
                <Grid container justify="space-between" alignItems="center">
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
                <Box mb={1}>
                    {item.numberAnnotations > 0 ? (
                        <Box textAlign="center">
                            <Typography>
                                {`${item.numberAnnotations} objects have been made with this
                                category.`}
                            </Typography>
                        </Box>
                    ) : (
                        <Box>No annotations use this category</Box>
                    )}
                </Box>
            </Box>
            <Box textAlign="center" boxShadow={3}>
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
