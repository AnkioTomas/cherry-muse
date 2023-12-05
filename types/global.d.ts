import Mermaid from 'mermaid';

// for IE
export {};

declare global {
  const BUILD_ENV: string;
  interface Window {
    // for IE
    clipboardData: ClipboardEvent['clipboardData'];
    mermaid?: typeof Mermaid;
    echarts?: echarts.ECharts;
    MathJax?: any;
  }
}
