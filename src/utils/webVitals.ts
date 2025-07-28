import React from 'react';

// Core Web Vitals monitoring and reporting
interface WebVitalsMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType: string;
}

export class WebVitalsTracker {
  private static instance: WebVitalsTracker;
  private metrics: Map<string, WebVitalsMetric> = new Map();

  static getInstance(): WebVitalsTracker {
    if (!WebVitalsTracker.instance) {
      WebVitalsTracker.instance = new WebVitalsTracker();
    }
    return WebVitalsTracker.instance;
  }

  init() {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.observePerformance();
    this.monitorLCP();
    this.monitorFID();
    this.monitorCLS();
    this.monitorFCP();
    this.monitorTTFB();
  }

  private observePerformance() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.handlePerformanceEntry(entry);
          }
        });

        observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }
  }

  private handlePerformanceEntry(entry: PerformanceEntry) {
    const metric: Partial<WebVitalsMetric> = {
      name: entry.entryType,
      value: entry.startTime,
      id: entry.name,
      navigationType: 'navigate'
    };

    switch (entry.entryType) {
      case 'largest-contentful-paint':
        this.reportMetric('LCP', entry.startTime);
        break;
      case 'first-contentful-paint':
        this.reportMetric('FCP', entry.startTime);
        break;
      case 'navigation':
        const navEntry = entry as PerformanceNavigationTiming;
        this.reportMetric('TTFB', navEntry.responseStart - navEntry.requestStart);
        break;
    }
  }

  private monitorLCP() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.reportMetric('LCP', lastEntry.startTime);
        });
        
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (error) {
        console.warn('LCP monitoring failed:', error);
      }
    }
  }

  private monitorFID() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fidEntry = entry as any;
            this.reportMetric('FID', fidEntry.processingStart - fidEntry.startTime);
          }
        });
        
        observer.observe({ type: 'first-input', buffered: true });
      } catch (error) {
        console.warn('FID monitoring failed:', error);
      }
    }
  }

  private monitorCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              this.reportMetric('CLS', clsValue);
            }
          }
        });
        
        observer.observe({ type: 'layout-shift', buffered: true });
      } catch (error) {
        console.warn('CLS monitoring failed:', error);
      }
    }
  }

  private monitorFCP() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.reportMetric('FCP', entry.startTime);
            }
          }
        });
        
        observer.observe({ type: 'paint', buffered: true });
      } catch (error) {
        console.warn('FCP monitoring failed:', error);
      }
    }
  }

  private monitorTTFB() {
    if ('performance' in window && 'timing' in performance) {
      const navTiming = performance.timing;
      const ttfb = navTiming.responseStart - navTiming.requestStart;
      this.reportMetric('TTFB', ttfb);
    }
  }

  private reportMetric(name: string, value: number) {
    const metric: WebVitalsMetric = {
      name,
      value,
      delta: value,
      id: `${name}-${Date.now()}`,
      navigationType: 'navigate'
    };

    this.metrics.set(name, metric);

    // Report to analytics
    this.sendToAnalytics(metric);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Web Vital ${name}:`, value);
    }
  }

  private sendToAnalytics(metric: WebVitalsMetric) {
    // Send to Google Analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.value),
        non_interaction: true,
      });
    }

    // Send to custom analytics endpoint
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric: metric.name,
          value: metric.value,
          url: window.location.href,
          timestamp: Date.now(),
        }),
      }).catch(error => {
        console.warn('Failed to send web vitals:', error);
      });
    }
  }

  getMetrics(): Map<string, WebVitalsMetric> {
    return this.metrics;
  }

  getMetric(name: string): WebVitalsMetric | undefined {
    return this.metrics.get(name);
  }

  // Performance scoring based on Google's thresholds
  getPerformanceScore(): { score: number; metrics: Record<string, { value: number; rating: string }> } {
    const metrics = {
      LCP: this.getMetric('LCP'),
      FID: this.getMetric('FID'),
      CLS: this.getMetric('CLS'),
      FCP: this.getMetric('FCP'),
      TTFB: this.getMetric('TTFB'),
    };

    const ratings = {
      LCP: this.rateLCP(metrics.LCP?.value || 0),
      FID: this.rateFID(metrics.FID?.value || 0),
      CLS: this.rateCLS(metrics.CLS?.value || 0),
      FCP: this.rateFCP(metrics.FCP?.value || 0),
      TTFB: this.rateTTFB(metrics.TTFB?.value || 0),
    };

    const scores = Object.values(ratings).map(rating => {
      switch (rating) {
        case 'good': return 100;
        case 'needs-improvement': return 50;
        case 'poor': return 0;
        default: return 0;
      }
    });

    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    return {
      score: Math.round(averageScore),
      metrics: {
        LCP: { value: metrics.LCP?.value || 0, rating: ratings.LCP },
        FID: { value: metrics.FID?.value || 0, rating: ratings.FID },
        CLS: { value: metrics.CLS?.value || 0, rating: ratings.CLS },
        FCP: { value: metrics.FCP?.value || 0, rating: ratings.FCP },
        TTFB: { value: metrics.TTFB?.value || 0, rating: ratings.TTFB },
      }
    };
  }

  private rateLCP(value: number): string {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private rateFID(value: number): string {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  private rateCLS(value: number): string {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  private rateFCP(value: number): string {
    if (value <= 1800) return 'good';
    if (value <= 3000) return 'needs-improvement';
    return 'poor';
  }

  private rateTTFB(value: number): string {
    if (value <= 800) return 'good';
    if (value <= 1800) return 'needs-improvement';
    return 'poor';
  }
}

// Initialize Web Vitals tracking
export const initWebVitals = () => {
  const tracker = WebVitalsTracker.getInstance();
  tracker.init();
  return tracker;
};

// Hook for React components
export const useWebVitals = () => {
  const [metrics, setMetrics] = React.useState<Map<string, WebVitalsMetric>>(new Map());
  
  React.useEffect(() => {
    const tracker = WebVitalsTracker.getInstance();
    tracker.init();
    
    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics(new Map(tracker.getMetrics()));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return metrics;
};