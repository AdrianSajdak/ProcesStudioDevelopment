import { createTheme } from '@mui/material/styles';
import { light } from '@mui/material/styles/createPalette';

// COLORS
export const PurpleColor = '#7A0099';
export const DarkBlueColor = '#0A1931';
export const DarkPurpleColor = '#4E0062';
export const LightBlueColor = '#244b8a';
export const LightPurpleColor = '#a104c9';
export const LighterBlueColor = '#244b8a';

// LOGO COLORS
// 7A0099 - VIOLET
// 0A1931 - DARK BLUE

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        violet: {
            main: PurpleColor,
            dark: DarkPurpleColor,
            light: LightPurpleColor,
        },
        blue: {
            main: DarkBlueColor,
            light: LightBlueColor,
            lighter: LighterBlueColor,
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
        error: {
            main: '#f44336',
        },
        text: {
            primary: '#000000',
            secondary: '#333333',
        },
    },
    typography: {
        fontSize: 14,
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        violet: {
            main: PurpleColor,
            dark: DarkPurpleColor,
            light: LightPurpleColor,
        },
        blue: {
            main: DarkBlueColor,
            light: LightBlueColor,
            lighter: LighterBlueColor,
        },
        background: {
            default: '#303030',
            paper: '#424242',
        },
        error: {
            main: '#f44336',
        },
        text: {
            primary: '#ffffff',
            secondary: '#dddddd',
        },
    },
    typography: {
        fontSize: 14,
    },
});
