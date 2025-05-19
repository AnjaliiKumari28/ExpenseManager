import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkTheme, setDarkTheme] = useState(true);

    const toggleTheme = () => setDarkTheme(prevTheme => !prevTheme);

    useEffect(() => {
        if(darkTheme) document.querySelector('body').classList.add('dark');
        else document.querySelector('body').classList.remove('dark');
    }, [darkTheme]);

    return (
        <ThemeContext.Provider value={{darkTheme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}