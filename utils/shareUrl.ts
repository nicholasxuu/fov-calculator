export type ShareConfig = {
  distanceToScreen?: number;
  screenSize?: number;
  aspectRatioA?: number;
  aspectRatioB?: number;
  curvature?: number;
  isTripleMonitor?: boolean;
  tripleMonitorAngle?: number;
  gt7Mode?: boolean;
  language?: string;
};

// Defaults used to skip fields when encoding a share URL (keeps it short).
// Recipients with missing fields will fall back to these on decode → app default → localStorage chain.
const SHARE_DEFAULTS: Required<ShareConfig> = {
  distanceToScreen: 70,
  screenSize: 32,
  aspectRatioA: 16,
  aspectRatioB: 9,
  curvature: 0,
  isTripleMonitor: true,
  tripleMonitorAngle: 60,
  gt7Mode: false,
  language: 'en',
};

const finiteNumber = (raw: string | null): number | undefined => {
  if (raw === null) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
};

const flag = (raw: string | null): boolean | undefined => {
  if (raw === null) return undefined;
  return raw === '1' || raw === 'true';
};

// Returns the serialized query-style string (no leading "?" / "#") suitable
// to use as a URL hash. Empty string means "no non-default fields".
export const encodeShareParams = (config: Required<ShareConfig>): string => {
  const params = new URLSearchParams();

  if (config.distanceToScreen !== SHARE_DEFAULTS.distanceToScreen) {
    params.set('d', String(config.distanceToScreen));
  }
  if (config.screenSize !== SHARE_DEFAULTS.screenSize) {
    params.set('s', String(config.screenSize));
  }
  if (
    config.aspectRatioA !== SHARE_DEFAULTS.aspectRatioA ||
    config.aspectRatioB !== SHARE_DEFAULTS.aspectRatioB
  ) {
    params.set('a', `${config.aspectRatioA}:${config.aspectRatioB}`);
  }
  if (config.curvature !== SHARE_DEFAULTS.curvature) {
    params.set('c', String(config.curvature));
  }
  if (config.isTripleMonitor !== SHARE_DEFAULTS.isTripleMonitor) {
    params.set('t', config.isTripleMonitor ? '1' : '0');
  }
  if (config.tripleMonitorAngle !== SHARE_DEFAULTS.tripleMonitorAngle) {
    params.set('ta', String(config.tripleMonitorAngle));
  }
  if (config.gt7Mode !== SHARE_DEFAULTS.gt7Mode) {
    params.set('g', config.gt7Mode ? '1' : '0');
  }
  if (config.language !== SHARE_DEFAULTS.language) {
    params.set('l', config.language);
  }

  return params.toString();
};

// Accepts either a query string ("?d=70") or hash string ("#d=70") or bare ("d=70").
export const parseShareUrl = (raw: string): ShareConfig => {
  const stripped = raw.replace(/^[?#]/, '');
  const params = new URLSearchParams(stripped);
  const out: ShareConfig = {};

  const d = finiteNumber(params.get('d'));
  if (d !== undefined) out.distanceToScreen = d;

  const s = finiteNumber(params.get('s'));
  if (s !== undefined) out.screenSize = s;

  const a = params.get('a');
  if (a) {
    const [aA, aB] = a.split(':').map(Number);
    if (Number.isFinite(aA) && Number.isFinite(aB)) {
      out.aspectRatioA = aA;
      out.aspectRatioB = aB;
    }
  }

  const c = finiteNumber(params.get('c'));
  if (c !== undefined) out.curvature = c;

  const t = flag(params.get('t'));
  if (t !== undefined) out.isTripleMonitor = t;

  const ta = finiteNumber(params.get('ta'));
  if (ta !== undefined) out.tripleMonitorAngle = ta;

  const g = flag(params.get('g'));
  if (g !== undefined) out.gt7Mode = g;

  const l = params.get('l');
  if (l) out.language = l;

  return out;
};

export const hasShareParams = (search: string): boolean => {
  return Object.keys(parseShareUrl(search)).length > 0;
};

// Mutates the current URL's query string to reflect the given config, using
// replaceState so the browser history is not polluted. When the config matches
// all defaults, the query string is removed entirely. The existing hash (if any)
// is preserved.
export const syncQueryToConfig = (config: Required<ShareConfig>) => {
  const qs = encodeShareParams(config);
  const newUrl = qs
    ? `${window.location.pathname}?${qs}${window.location.hash}`
    : `${window.location.pathname}${window.location.hash}`;
  window.history.replaceState(null, '', newUrl);
};
