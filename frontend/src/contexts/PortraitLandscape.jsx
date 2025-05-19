import { createContext, useState, useEffect } from "react";

export const PortraitContext = createContext();

export const PortraitProvider = ({ children }) => {
    const [isPortrait, setIsPortrait] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerHeight > window.innerWidth;
        }
        return false; // Fallback for SSR
    });

    const updateOrientation = () => {
        setIsPortrait(window.innerHeight > window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', updateOrientation);
        return () => {
            window.removeEventListener('resize', updateOrientation);
        };
    }, []);

    useEffect(() => {
        const bodyElement = document.getElementById('body');
        if (bodyElement) {
            if (isPortrait) {
                bodyElement.classList.add('portrait');
            } else {
                bodyElement.classList.remove('portrait');
            }
        }
    }, [isPortrait]);

    return (
        <PortraitContext.Provider value={{ isPortrait }}>
            {children}
        </PortraitContext.Provider>
    );
};
