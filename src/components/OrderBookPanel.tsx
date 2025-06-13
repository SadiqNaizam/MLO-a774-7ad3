import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface OrderBookEntry {
  price: number;
  size: number;
  total?: number; // Cumulative size
}

interface OrderBookPanelProps {
  symbol: string;
  bids: OrderBookEntry[]; // Sorted highest price first
  asks: OrderBookEntry[]; // Sorted lowest price first
  // Potentially add callbacks for clicking on a price/size
  onPriceClick?: (price: number) => void;
}

// Helper to format numbers, e.g., for crypto precision
const formatNumber = (num: number, precision: number = 2) => num.toLocaleString(undefined, {minimumFractionDigits: precision, maximumFractionDigits: precision});

const OrderBookPanel: React.FC<OrderBookPanelProps> = ({
  symbol,
  bids = [],
  asks = [],
  onPriceClick,
}) => {
  console.log("Rendering OrderBookPanel for:", symbol, "Bids:", bids.length, "Asks:", asks.length);

  // Calculate max total for bar width percentage (simplified)
  const maxBidTotal = bids.reduce((max, bid) => Math.max(max, bid.total || bid.size), 0);
  const maxAskTotal = asks.reduce((max, ask) => Math.max(max, ask.total || ask.size), 0);
  const overallMaxTotal = Math.max(maxBidTotal, maxAskTotal, 1); // Avoid division by zero

  const renderOrderRow = (order: OrderBookEntry, type: 'bid' | 'ask') => {
    const barWidth = ((order.total || order.size) / overallMaxTotal) * 100;
    const barColorClass = type === 'bid' ? 'bg-green-500/20' : 'bg-red-500/20';
    const textColorClass = type === 'bid' ? 'text-green-600' : 'text-red-600';

    return (
      <TableRow
        key={order.price}
        className="relative hover:bg-muted/50 cursor-pointer text-xs"
        onClick={() => onPriceClick && onPriceClick(order.price)}
      >
        <TableCell className={cn("p-1 font-mono", textColorClass)}>{formatNumber(order.price, 2)}</TableCell>
        <TableCell className="p-1 font-mono text-right">{formatNumber(order.size, 4)}</TableCell>
        <TableCell className="p-1 font-mono text-right hidden sm:table-cell">{formatNumber(order.total || order.size, 4)}</TableCell>
        {/* Background bar for visualization */}
        <td className="absolute top-0 bottom-0 right-0 h-full opacity-50 pointer-events-none" style={{ width: `${barWidth}%`, background: type === 'bid' ? 'linear-gradient(to left, var(--tw-color-green-500-20), transparent)' : 'linear-gradient(to left, var(--tw-color-red-500-20), transparent)' }}></td>
      </TableRow>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-base">Order Book: {symbol.toUpperCase()}</CardTitle>
        {/* Optional: Add spread display here */}
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
          {/* Asks */}
          <div className="flex flex-col h-full">
            <TableHeader className="sticky top-0 bg-background z-10 px-1 py-1 border-b">
              <TableRow className="text-xs">
                <TableHead className="p-1 text-red-600">Price (USD)</TableHead>
                <TableHead className="p-1 text-right">Size</TableHead>
                <TableHead className="p-1 text-right hidden sm:table-cell">Total</TableHead>
              </TableRow>
            </TableHeader>
            <ScrollArea className="flex-grow pr-1">
              <Table className="table-fixed">
                <TableBody>
                  {/* Display asks in ascending order of price (lowest first) */}
                  {asks.slice().reverse().map(order => renderOrderRow(order, 'ask'))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* Bids */}
          <div className="flex flex-col h-full border-t md:border-t-0 md:border-l">
             <TableHeader className="sticky top-0 bg-background z-10 px-1 py-1 border-b">
                <TableRow className="text-xs">
                    <TableHead className="p-1 text-green-600">Price (USD)</TableHead>
                    <TableHead className="p-1 text-right">Size</TableHead>
                    <TableHead className="p-1 text-right hidden sm:table-cell">Total</TableHead>
                </TableRow>
             </TableHeader>
            <ScrollArea className="flex-grow pr-1">
              <Table className="table-fixed">
                <TableBody>
                  {bids.map(order => renderOrderRow(order, 'bid'))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBookPanel;