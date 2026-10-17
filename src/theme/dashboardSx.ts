import type { SxProps, Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

/** Shared page content panel — use inside DashboardLayout */
export const pagePanelSx: SxProps<Theme> = {
  p: { xs: 2.5, md: 3.5 },
  mb: 3,
  borderRadius: 3,
  bgcolor: "background.paper",
};

/** Compact filter / section label chip look */
export const sectionLabelSx = (theme: Theme): SxProps<Theme> => ({
  display: "inline-flex",
  alignItems: "center",
  px: 1.75,
  py: 0.85,
  borderRadius: 2,
  fontWeight: 650,
  fontSize: "0.875rem",
  bgcolor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.secondary.main, 0.15)
      : alpha(theme.palette.primary.main, 0.08),
  color:
    theme.palette.mode === "dark"
      ? theme.palette.secondary.light
      : theme.palette.primary.main,
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? alpha(theme.palette.secondary.main, 0.3)
      : alpha(theme.palette.primary.main, 0.15)
  }`,
});

export const tableWrapSx: SxProps<Theme> = {
  borderRadius: 2,
  overflow: "hidden",
  border: (theme) => `1px solid ${theme.palette.divider}`,
};
