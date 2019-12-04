import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import { useExportsPage } from './exports.hooks';

interface Props {
    id: number;
}

const Exports: React.FC<Props> = ({ id }) => {
    const { exports } = useExportsPage(id);
    return (
        <Box>
            {exports.map(o => (
                <Box key={o.id}>
                    <Box>
                        {`${o.id}. Exported ${
                            o.ago.length > 0 ? o.ago : 0 + ' seconds'
                        } ago`}
                    </Box>
                    <Box>
                        {o.tags.map(t => (
                            <span key={t}>{t}</span>
                        ))}
                    </Box>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            //
                        }}
                    >
                        Download
                    </Button>
                </Box>
            ))}
        </Box>
    );
};
export default Exports;
