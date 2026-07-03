import { createTheme } from '@mui/material/styles'

/**
 * MUI theme for the public agency-site frontend.
 *
 * `palette.primary/secondary.main` below are just the *default*-theme
 * fallback colours — MUI's createTheme computes light/dark/contrastText
 * shades from `main` at theme-creation time, so it must be a real parseable
 * colour, not a CSS custom property. The actual per-site brand colour (set
 * in `(frontend)/layout.tsx` as `--color-primary/secondary/accent`, driven
 * by `Sites.theme`) is applied directly in each component's own `sx` as
 * `var(--color-primary, ...)`, bypassing the theme palette entirely — so
 * per-site theming keeps working unchanged under Material UI.
 */
export const muiTheme = createTheme({
  palette: {
    primary:   { main: '#CC0000' },
    secondary: { main: '#1a3a6b' },
    text: {
      primary:   '#000716',
      secondary: '#545B64',
    },
    background: {
      default: '#FFFFFF',
      paper:   '#FFFFFF',
    },
    divider: '#D5DBDB',
  },
  typography: {
    fontFamily: 'Roboto, system-ui, -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 2, fontWeight: 700 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
})
