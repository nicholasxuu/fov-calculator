import React from "react";

// When true, useStickyState becomes read-from-localStorage-only;
// state changes are kept in memory but never persisted. Used in "shared link"
// mode so opening a share URL does not overwrite the visitor's saved config.
let freezeStickyWrites = false;
export const setFreezeStickyWrites = (frozen: boolean) => {
  freezeStickyWrites = frozen;
};

function useStickyState(defaultValue: any, key: string, initialOverride?: any) {
  const [value, setValue] = React.useState(() => {
    if (initialOverride !== undefined) {
      return initialOverride;
    }
    const stickyValue = window.localStorage.getItem(key);
    if (stickyValue === null) {
      return defaultValue;
    }
    try {
      const res = JSON.parse(stickyValue);
      return res;
    } catch (e) {
      return defaultValue;
    }
  });
  React.useEffect(() => {
    if (freezeStickyWrites) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export { useStickyState };
