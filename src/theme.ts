import { createTheme } from '@mui/material/styles';

const palette = {
    belDarkBeige: '#f1b28e',
    belLightBeige: '#f9e0c1',
    belPink: '#f29796',
    belBlue: '#aad4d4',
    belDarkCyan: '#445c64',
    belOrange: '#c85d41',
    belWhite: '#f9f9f9',
  };

const theme = createTheme({
    palette: {
        primary: {
            main: palette.belLightBeige,
        },
        secondary: {
            main: palette.belBlue,
        },
        background: {
            default: palette.belLightBeige,
        },
        error: {
            main: palette.belOrange,
        },
        success: {
            main: palette.belDarkCyan,
        },
        info: {
            main: palette.belPink,
        },
    },
    typography: {
        fontFamily: 'CaviarDreams, sans-serif',
    },
});

export default theme;
export { palette };