import React from 'react';

const Box = ({ m, display, flexDirection, gap, justifyContent, alignItems, children, style }) => {
    const boxStyle = {
        margin: m || '0',
        display: display || 'block',
        flexDirection: flexDirection || 'row',
        gap: gap || '0',
        justifyContent: justifyContent || 'flex-start',
        alignItems: alignItems || 'stretch',
        ...style,
    };

    return <div style={boxStyle}>{children}</div>;
};

export default Box;
