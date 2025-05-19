import React, { useContext } from 'react';
import { Tooltip } from 'flowbite-react';
import { ThemeContext } from '../contexts/Theme';

const ToolTip = ({ children, content, placement }) => {
    const { darkTheme } = useContext(ThemeContext);

    return (
        <Tooltip content={content} style={darkTheme ? 'dark' : 'light'} placement={placement}>
            {children}
        </Tooltip>
    );
};

export default ToolTip;
