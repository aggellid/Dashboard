import React from 'react';
import MiniTable from './datatab'; // import your table component
import FancyButtons from './fancybuttons';

import Header from '../components/header';
import Box from './box';


const OuterComponent = () => {
    return (
        <Box m="10px">
    
    <Box display="flex" flexDirection="column" gap="20px">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
            <Box> 
                <MiniTable/>
            </Box>
        </Box>
        <FancyButtons />
    </Box>
);
};
export default OuterComponent;
