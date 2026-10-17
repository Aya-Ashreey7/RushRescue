import { createTheme, alpha } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";

const brand = {
  navy: "#0F3460",
  navyDeep: "#0B2748",
  teal: "#0D9488",
  amber: "#D4A017",
  slate50: "#F4F7FB",
  slate100: "#E8EEF6",
  slate200: "#D5DEEA",
  slate500: "#64748B",
  slate700: "#334155",
  slate900: "#0F172A",
  darkBg: "#121826",
  darkPaper: "#1B2233",
  darkElevated: "#232B3E",
};

export function createAppTheme(darkMode: boolean) {
  const mode = darkMode ? "dark" : "light";

  const options: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: brand.navy,
        dark: brand.navyDeep,
        light: "#3D5A80",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: brand.teal,
        dark: "#0F766E",
        light: "#2DD4BF",
        contrastText: "#FFFFFF",
      },
      warning: {
        main: brand.amber,
      },
      background: {
        default: darkMode ? brand.darkBg : brand.slate50,
        paper: darkMode ? brand.darkPaper : "#FFFFFF",
      },
      text: {
        primary: darkMode ? "#F1F5F9" : brand.slate900,
        secondary: darkMode ? "#94A3B8" : brand.slate500,
      },
      divider: darkMode ? alpha("#FFFFFF", 0.08) : alpha(brand.navy, 0.1),
      success: { main: "#059669" },
      error: { main: "#DC2626" },
      info: { main: "#0284C7" },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
      h3: { fontWeight: 700, letterSpacing: "-0.02em" },
      h4: { fontWeight: 700, letterSpacing: "-0.02em" },
      h5: { fontWeight: 650, letterSpacing: "-0.015em" },
      h6: { fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 600 },
      body1: { lineHeight: 1.6 },
      body2: { lineHeight: 1.55 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: darkMode
              ? `radial-gradient(1200px 600px at 10% -10%, ${alpha(brand.teal, 0.08)}, transparent 55%),
                 radial-gradient(900px 500px at 100% 0%, ${alpha(brand.navy, 0.35)}, transparent 50%)`
              : `radial-gradient(1200px 600px at 0% -10%, ${alpha(brand.navy, 0.07)}, transparent 55%),
                 radial-gradient(900px 480px at 100% 0%, ${alpha(brand.teal, 0.08)}, transparent 50%)`,
            backgroundAttachment: "fixed",
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${darkMode ? alpha("#fff", 0.08) : alpha(brand.navy, 0.08)}`,
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${darkMode ? alpha("#fff", 0.08) : alpha(brand.navy, 0.08)}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          },
          containedPrimary: {
            background: darkMode
              ? `linear-gradient(135deg, ${brand.navy} 0%, ${brand.navyDeep} 100%)`
              : `linear-gradient(135deg, ${brand.navy} 0%, #1B4F8A 100%)`,
          },
          outlined: {
            borderWidth: 1.5,
            "&:hover": { borderWidth: 1.5 },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            "& .MuiTableCell-head": {
              fontWeight: 700,
              fontSize: "0.8rem",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: darkMode ? "#CBD5E1" : brand.navy,
              backgroundColor: darkMode ? alpha("#fff", 0.03) : brand.slate100,
              borderBottom: `1px solid ${darkMode ? alpha("#fff", 0.08) : alpha(brand.navy, 0.1)}`,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: darkMode ? alpha("#fff", 0.06) : alpha(brand.navy, 0.08),
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: darkMode
                ? alpha("#fff", 0.03)
                : alpha(brand.navy, 0.03),
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: "none",
            borderRight: `1px solid ${darkMode ? alpha("#fff", 0.08) : alpha(brand.navy, 0.1)}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            boxShadow: darkMode
              ? `0 1px 0 ${alpha("#fff", 0.06)}`
              : `0 1px 0 ${alpha(brand.navy, 0.12)}`,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
          size: "small",
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
          },
        },
      },
    },
  };

  return createTheme(options);
}

export { brand };
