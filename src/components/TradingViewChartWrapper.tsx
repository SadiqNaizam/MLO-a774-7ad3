import React, { useEffect, useRef, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card'; // Optional: wrap in a card

interface TradingViewChartWrapperProps {
  symbol: string; // e.g., "BINANCE:BTCUSDT"
  theme?: 'light' | 'dark';
  // Add other TradingView widget options as props if needed
  // e.g., interval, studies, etc.
}

const TradingViewChartWrapper: React.FC<TradingViewChartWrapperProps> = memo(({
  symbol = "BINANCE:BTCUSDT",
  theme = "light",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptAppended = useRef(false); // Prevent multiple script appends

  console.log("Rendering TradingViewChartWrapper for symbol:", symbol);

  useEffect(() => {
    if (!containerRef.current || scriptAppended.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: 'D', // Default interval
          timezone: 'Etc/UTC',
          theme: theme,
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6', // Example, customize as needed
          enable_publishing: false,
          // allow_symbol_change: true, // Allow user to change symbol in chart
          container_id: containerRef.current.id,
        });
      }
    };
    document.body.appendChild(script);
    scriptAppended.current = true;

    return () => {
      // Clean up script if component unmounts, though TradingView widget might persist
      // Consider more robust cleanup if needed
      // document.body.removeChild(script);
      // scriptAppended.current = false;
      if (containerRef.current) {
        // TradingView widget doesn't have a simple destroy method.
        // Clearing innerHTML is a basic way to remove it visually.
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, theme]);

  const uniqueId = `tradingview_${symbol.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}`;

  return (
    <Card className="h-[500px] w-full"> {/* Adjust height as needed */}
      <CardContent className="p-0 h-full">
        <div ref={containerRef} id={uniqueId} className="tradingview-widget-container h-full">
          <div className="tradingview-widget-container__widget h-full"></div>
          {/* Optional: Add a TradingView attribution link if required by their terms */}
          {/* <div className="tradingview-widget-copyright">
            <a href={`https://www.tradingview.com/symbols/${symbol}`} rel="noopener" target="_blank">
              <span className="blue-text">{symbol} Chart</span>
            </a> by TradingView
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
});

declare global {
  interface Window {
    TradingView?: any;
  }
}

export default TradingViewChartWrapper;