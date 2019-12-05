import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Pagination from 'material-ui-flat-pagination';

import { Image } from '../../../common/types';
import ImageCard from './ImageCard';

interface Props {
    images: Image[];
    page: number;
    pagesCount: number;
    setPage(offset: number): void;
    deleteImageAction(id: number): void;
    annotateImageAction(id: number): void;
    downloadImageAction(id: number): void;
}

const Images: React.FC<Props> = ({
    images,
    page,
    pagesCount,
    setPage,
    deleteImageAction,
    annotateImageAction,
    downloadImageAction,
}) => {
    if (images.length === 0) {
        return <Box textAlign="center">No images found in directory.</Box>;
    }

    return (
        <Box>
            <Box textAlign="center" mb={1}>
                <Pagination
                    reduced
                    size="large"
                    limit={1}
                    offset={page}
                    total={pagesCount}
                    onClick={(_, offset) => setPage(offset)}
                />
            </Box>

            <Grid container justify="flex-start" spacing={4}>
                {images.map(o => (
                    <Grid key={o.id} item xs={12} sm={4} md={3}>
                        <ImageCard
                            item={o}
                            onClick={() => annotateImageAction(o.id)}
                            renderMenuItems={() => (
                                <Box component="span">
                                    <MenuItem
                                        onClick={() => deleteImageAction(o.id)}
                                    >
                                        Delete
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() =>
                                            annotateImageAction(o.id)
                                        }
                                    >
                                        Annotate
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() =>
                                            downloadImageAction(o.id)
                                        }
                                    >
                                        Download Image & COCO
                                    </MenuItem>
                                </Box>
                            )}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
export default Images;
