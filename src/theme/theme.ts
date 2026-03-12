// ─── Design Tokens ────────────────────────────────────────────────────────────
// Centralized theme file. All components must import from here.
// Never hardcode colors, spacing, or radius values in component files.

export const Colors = {
  // ── Backgrounds (layered elevation) ──────────────────────────────────────
  bgPrimary:  '#0D0F14',  // deepest background
  bgSurface:  '#161920',  // card / surface
  bgElevated: '#1E2230',  // inputs, elevated elements
  bgBorder:      'rgba(255, 255, 255, 0.08)',
  bgBorderStrong:'rgba(255, 255, 255, 0.15)',

  // ── Brand ────────────────────────────────────────────────────────────────
  brandPrimary: '#F5C518',  // refined gold
  brandDark:    '#C9A114',  // pressed / hover state
  brandText:    '#0D0F14',  // text on brand-colored surfaces

  // ── Status ───────────────────────────────────────────────────────────────
  statusValid:        '#00C896',
  statusValidBg:      'rgba(0, 200, 150, 0.12)',
  statusValidBorder:  'rgba(0, 200, 150, 0.25)',

  statusError:        '#FF4757',
  statusErrorBg:      'rgba(255, 71, 87, 0.12)',
  statusErrorBorder:  'rgba(255, 71, 87, 0.25)',

  statusWarn:        '#FFB347',
  statusWarnBg:      'rgba(255, 179, 71, 0.12)',
  statusWarnBorder:  'rgba(255, 179, 71, 0.25)',

  // ── Text ─────────────────────────────────────────────────────────────────
  textPrimary:   '#F8F9FA',
  textSecondary: '#9BA3AF',
  textMuted:     '#555C66',

  // ── Misc ─────────────────────────────────────────────────────────────────
  overlay: 'rgba(0, 0, 0, 0.75)',
};

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const Radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  full: 999,
};

export const Typography = {
  h1:      { fontSize: 28, fontWeight: '700' as const, color: Colors.textPrimary },
  h2:      { fontSize: 22, fontWeight: '700' as const, color: Colors.textPrimary },
  h3:      { fontSize: 18, fontWeight: '600' as const, color: Colors.textPrimary },
  body:    { fontSize: 14, fontWeight: '400' as const, color: Colors.textPrimary },
  bodyLg:  { fontSize: 16, fontWeight: '400' as const, color: Colors.textPrimary },
  caption: { fontSize: 12, fontWeight: '400' as const, color: Colors.textSecondary },
  label:   { fontSize: 12, fontWeight: '500' as const, color: Colors.textSecondary },
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  brand: {
    shadowColor: '#F5C518',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};
