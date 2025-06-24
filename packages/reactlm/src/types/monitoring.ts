// Re-export all monitoring types for easy access
export type { ConsoleEntry } from '../monitoring/console-monitor';
export type { NetworkRequest, NetworkResponse } from '../monitoring/network-monitor';
export type { PerformanceMetric } from '../monitoring/performance-monitor';
export type { DOMChange } from '../monitoring/dom-monitor';

export interface ContextOption {
  id: string;
  type: 'console' | 'network' | 'performance' | 'dom' | 'components';
  label: string;
  icon: string;
  description: string;
  filter?: Record<string, any>;
}

export interface MonitoringData {
  console: ConsoleEntry[];
  network: NetworkRequest[];
  performance: PerformanceMetric[];
  dom: DOMChange[];
}