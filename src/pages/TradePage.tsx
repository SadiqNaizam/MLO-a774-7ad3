import React, { useState } from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TradingViewChartWrapper from '@/components/TradingViewChartWrapper';
import OrderBookPanel, { OrderBookEntry } from '@/components/OrderBookPanel';
import ComplexOrderForm from '@/components/ComplexOrderForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const tradingPairs = [
  { value: 'BTC/USDT', label: 'BTC/USDT' },
  { value: 'ETH/USDT', label: 'ETH/USDT' },
  { value: 'SOL/USDT', label: 'SOL/USDT' },
  { value: 'ADA/USDT', label: 'ADA/USDT' },
];

const placeholderBids: OrderBookEntry[] = Array.from({ length: 10 }, (_, i) => ({ price: 39990 - i * 10, size: Math.random() * 2, total: Math.random() * 50 })).sort((a,b) => b.price - a.price);
const placeholderAsks: OrderBookEntry[] = Array.from({ length: 10 }, (_, i) => ({ price: 40010 + i * 10, size: Math.random() * 2, total: Math.random() * 50 })).sort((a,b) => a.price - b.price);

const placeholderOpenOrders = [
  { id: '1', pair: 'BTC/USDT', type: 'Limit', side: 'Buy', price: '39,500', amount: '0.1', filled: '0%', total: '3,950 USDT', status: 'Open' },
  { id: '2', pair: 'ETH/USDT', type: 'Limit', side: 'Sell', price: '2,300', amount: '2', filled: '50%', total: '4,600 USDT', status: 'Partial Fill' },
];
const placeholderTradeHistory = [
  { id: 'th1', pair: 'BTC/USDT', type: 'Market', side: 'Buy', price: '40,050', amount: '0.05', total: '2,002.50 USDT', date: '2023-10-26 10:30:00' },
];

const TradePage = () => {
  console.log('TradePage loaded');
  const [selectedPair, setSelectedPair] = useState(tradingPairs[0].value);
  const [tvWidgetSymbol, setTvWidgetSymbol] = useState('BINANCE:BTCUSDT'); // TradingView expects specific format

  const handlePairChange = (pair: string) => {
    setSelectedPair(pair);
    // Assuming pair format is "BASE/QUOTE", convert to "EXCHANGE:BASEQUOTE" for TradingView
    const [base, quote] = pair.split('/');
    setTvWidgetSymbol(`BINANCE:${base}${quote}`); // Example, might need mapping for different exchanges
  };
  
  const handleSubmitOrder = async (data: any) => {
    console.log('Submitting order data:', data);
    // Mock API call
    return new Promise<void>((resolve) => setTimeout(() => {
        console.log('Order submitted successfully (mock)');
        resolve();
    }, 1000));
  };
  
  const handleToggleMobileNav = () => {
    console.log("Toggle mobile navigation");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <NavigationMenu />
      <div className="flex flex-col flex-1 overflow-x-hidden">
        <Header onToggleMobileNav={handleToggleMobileNav} />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Trade</h1>
            <Select value={selectedPair} onValueChange={handlePairChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select pair" />
              </SelectTrigger>
              <SelectContent>
                {tradingPairs.map(pair => (
                  <SelectItem key={pair.value} value={pair.value}>{pair.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]"> {/* Adjusted height */}
            {/* Left Side: Chart and Order Form */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="flex-grow min-h-[300px] md:min-h-[400px]">
                    <TradingViewChartWrapper symbol={tvWidgetSymbol} theme="light" />
                </div>
            </div>

            {/* Right Side: Order Book & Form */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="flex-grow min-h-[300px] md:min-h-[400px]">
                    <OrderBookPanel symbol={selectedPair} bids={placeholderBids} asks={placeholderAsks} onPriceClick={(price) => console.log('Price clicked:', price)} />
                </div>
            </div>

             {/* Order Form below chart on smaller screens, or in a dedicated column */}
            <div className="lg:col-span-8 xl:col-span-3 lg:row-start-1 lg:col-start-10 xl:col-start-10"> {/* This is tricky, adjust grid for form placement */}
                 <ComplexOrderForm
                    symbol={selectedPair}
                    availableBalance={{ base: 0.5, quote: 10000 }} // e.g. 0.5 BTC, 10000 USDT
                    onSubmitOrder={handleSubmitOrder}
                    currentMarketPrice={selectedPair.startsWith('BTC') ? 40000 : 2200} // Placeholder
                />
            </div>
          </div>
          
          <div className="mt-6">
            <Tabs defaultValue="open-orders">
              <TabsList>
                <TabsTrigger value="open-orders">Open Orders</TabsTrigger>
                <TabsTrigger value="trade-history">Trade History</TabsTrigger>
                {/* Could add Positions tab */}
              </TabsList>
              <TabsContent value="open-orders">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pair</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Side</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Filled</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {placeholderOpenOrders.map(order => (
                          <TableRow key={order.id}>
                            <TableCell>{order.pair}</TableCell>
                            <TableCell>{order.type}</TableCell>
                            <TableCell className={order.side === 'Buy' ? 'text-green-500' : 'text-red-500'}>{order.side}</TableCell>
                            <TableCell>{order.price}</TableCell>
                            <TableCell>{order.amount}</TableCell>
                            <TableCell>{order.filled}</TableCell>
                            <TableCell>{order.total}</TableCell>
                            <TableCell>{order.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="trade-history">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Pair</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Side</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {placeholderTradeHistory.map(trade => (
                          <TableRow key={trade.id}>
                            <TableCell>{trade.date}</TableCell>
                            <TableCell>{trade.pair}</TableCell>
                            <TableCell>{trade.type}</TableCell>
                            <TableCell className={trade.side === 'Buy' ? 'text-green-500' : 'text-red-500'}>{trade.side}</TableCell>
                            <TableCell>{trade.price}</TableCell>
                            <TableCell>{trade.amount}</TableCell>
                            <TableCell>{trade.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default TradePage;