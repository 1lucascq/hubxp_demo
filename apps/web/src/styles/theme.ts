import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
    palette: {
        primary: {
            main: '#2d47ce',
        },
        secondary: {
            main: '#f50057',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    '&.cta': {
                        background: 'linear-gradient(45deg,rgb(91, 143, 240) 30%,rgb(21, 9, 255) 90%)',
                        border: 0,
                        borderRadius: 3,
                        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                        color: 'white',
                        height: 48,
                        padding: '0 10px',
                    },
                },
            },
        },
    },
};

const theme = createTheme(themeOptions);
export default theme;
