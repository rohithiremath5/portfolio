// ============================================================
// CUSTOM HOOKS — Demonstrates advanced React hook patterns
// ============================================================

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * useScrollSpy — tracks which section is currently in viewport
 * Concept: useEffect + IntersectionObserver + cleanup
 */
export function useScrollSpy(sectionIds, options = {}) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', ...options }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Cleanup on unmount — critical React pattern
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}

/**
 * useMousePosition — tracks cursor position
 * Concept: useEffect + event listeners + cleanup
 */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}

/**
 * useMediaQuery — responsive breakpoint detection
 * Concept: useState + useEffect + matchMedia API
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * useLocalStorage — persisted state
 * Concept: useState with initializer fn + custom setter
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * useDebounce — debounces a value (useful for search inputs)
 * Concept: useEffect + setTimeout + cleanup
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // cleanup cancels the timer
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useIntersectionObserver — observe when element enters viewport
 * Concept: useRef + useEffect + IntersectionObserver
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting) {
        setHasIntersected(true);
      }
    }, { threshold: 0.1, ...options });

    const el = ref.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return { ref, isIntersecting, hasIntersected };
}

/**
 * usePrevious — tracks previous value of any state/prop
 * Concept: useRef persists across renders without causing re-renders
 */
export function usePrevious(value) {
  const ref = useRef(undefined);
  useEffect(() => { ref.current = value; });
  return ref.current;
}

/**
 * useScrollProgress — tracks page scroll progress (0 to 1)
 * Concept: useEffect + scroll event + Math utilities
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const currentProgress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      setProgress(Math.min(1, Math.max(0, currentProgress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

/**
 * useCounter — animated counter with useMemo optimization
 * Concept: useMemo, useCallback, encapsulated logic
 */
export function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const frameRef = useRef(null);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
        setIsRunning(false);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
  }, [target, duration, isRunning]);

  useEffect(() => {
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, []);

  return { count, start };
}
