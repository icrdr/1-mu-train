import { useEffect, useRef } from 'react';

export default function useInterval(callback:any, delay:any, tiggerOnStart=false) {
  const savedCallback:any = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      if(tiggerOnStart)tick()
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}