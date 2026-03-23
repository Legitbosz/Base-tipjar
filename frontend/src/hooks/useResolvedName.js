import { useState, useEffect } from "react";
import { resolveName } from "../utils/resolveName";

export function useResolvedName(address) {
  const short = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "???";

  const [name, setName] = useState(short);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;
    setName(short);
    setLoading(true);
    resolveName(address).then((resolved) => {
      setName(resolved);
      setLoading(false);
    });
  }, [address]);

  return { name, loading };
}