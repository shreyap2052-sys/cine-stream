import { useEffect } from "react";

function useInfiniteScroll({
  target,
  onIntersect,
  enabled = true,
  rootMargin = "300px",
}) {
  useEffect(() => {
    if (!target?.current || !enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting) {
          onIntersect();
        }
      },
      {
        rootMargin,
      }
    );

    observer.observe(target.current);

    return () => {
      observer.disconnect();
    };
  }, [target, onIntersect, enabled, rootMargin]);
}

export default useInfiniteScroll;