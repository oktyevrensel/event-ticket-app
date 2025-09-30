import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  networkRequests: number;
}

export const usePerformance = (componentName: string) => {
  const startTime = performance.now();
  let renderTime = 0;

  const measureRenderTime = useCallback(() => {
    renderTime = performance.now() - startTime;
    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
  }, [componentName, startTime]);

  const measureMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log(`${componentName} memory usage:`, {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      });
    }
  }, [componentName]);

  const measureNetworkRequests = useCallback(() => {
    const requests = performance.getEntriesByType('resource');
    const networkRequests = requests.length;
    console.log(`${componentName} network requests: ${networkRequests}`);
    return networkRequests;
  }, [componentName]);

  const logPerformanceMetrics = useCallback(() => {
    const metrics: PerformanceMetrics = {
      loadTime: performance.now() - startTime,
      renderTime,
      memoryUsage: (performance as any).memory?.usedJSHeapSize,
      networkRequests: measureNetworkRequests()
    };

    console.log(`${componentName} performance metrics:`, metrics);
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // Send metrics to your analytics service
      // analytics.track('performance_metrics', metrics);
    }
  }, [componentName, startTime, renderTime, measureNetworkRequests]);

  useEffect(() => {
    measureRenderTime();
    measureMemoryUsage();
    
    // Log metrics after component is fully loaded
    const timer = setTimeout(logPerformanceMetrics, 1000);
    
    return () => clearTimeout(timer);
  }, [measureRenderTime, measureMemoryUsage, logPerformanceMetrics]);

  return {
    measureRenderTime,
    measureMemoryUsage,
    measureNetworkRequests,
    logPerformanceMetrics
  };
};

// Web Vitals measurement
export const useWebVitals = () => {
  useEffect(() => {
    const measureWebVitals = () => {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        console.log('CLS:', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });
    };

    measureWebVitals();
  }, []);
};
