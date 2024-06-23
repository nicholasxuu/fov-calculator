import React from "react";

function useStickyState(defaultValue: any, key: string) {
  const [value, setValue] = React.useState(() => {
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
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export { useStickyState };
