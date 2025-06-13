import React from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AssetListItem from '@/components/AssetListItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const placeholderWalletAssets = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png', price: 70000, priceChange24hPercentage: 0, // Not relevant here, use balance
    balance: 0.5, valueUSD: 35000 },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', price: 3500, priceChange24hPercentage: 0,
    balance: 10, valueUSD: 35000 },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png', price: 1, priceChange24hPercentage: 0,
    balance: 10000, valueUSD: 10000 },
];

const placeholderTransactions = [
  { id: 't1', date: '2023-10-26 10:30', type: 'Deposit', asset: 'BTC', amount: '+0.1 BTC', status: 'Completed', details: 'External Wallet' },
  { id: 't2', date: '2023-10-25 15:00', type: 'Withdrawal', asset: 'ETH', amount: '-2 ETH', status: 'Completed', details: 'To Binance' },
  { id: 't3', date: '2023-10-24 09:15', type: 'Trade', asset: 'BTC/USDT', amount: '+0.05 BTC', status: 'Filled', details: 'Bought BTC with USDT' },
  { id: 't4', date: '2023-10-23 12:00', type: 'Fee', asset: 'USDT', amount: '-1.5 USDT', status: 'Paid', details: 'Trading Fee for ETH/USDT' },
];

const WalletPage = () => {
  console.log('WalletPage loaded');
  
  const handleDeposit = (symbol: string) => console.log(`Deposit ${symbol}`);
  const handleWithdraw = (symbol: string) => console.log(`Withdraw ${symbol}`);
  
  const handleToggleMobileNav = () => {
    console.log("Toggle mobile navigation");
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <NavigationMenu />
      <div className="flex flex-col flex-1">
        <Header onToggleMobileNav={handleToggleMobileNav}/>
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">My Wallet</h1>
            <div className="flex gap-2">
              <Button onClick={() => console.log("Open master deposit modal")}>
                <PlusCircle className="mr-2 h-4 w-4" /> Deposit
              </Button>
              <Button variant="outline" onClick={() => console.log("Open master withdraw modal")}>
                 Withdraw
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Total Balance</CardTitle>
              <CardDescription>Estimated value of all your assets.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$80,000.00 USD</p>
              <p className="text-sm text-muted-foreground">+ $1,200.50 (1.5%) in last 24h</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="assets">
            <TabsList className="grid w-full grid-cols-2 md:w-1/2 lg:w-1/3">
              <TabsTrigger value="assets">Asset Balances</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
            </TabsList>
            <TabsContent value="assets">
              <Card>
                <CardHeader>
                  <CardTitle>Your Assets</CardTitle>
                  <CardDescription>Detailed view of your cryptocurrency holdings.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Asset</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                          <TableHead className="text-right">Value (USD)</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {placeholderWalletAssets.map(asset => (
                          <TableRow key={asset.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img src={asset.iconUrl} alt={asset.name} className="h-8 w-8 rounded-full" />
                                <div>
                                  <div className="font-medium">{asset.name}</div>
                                  <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono">{asset.balance.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-mono">${asset.valueUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                            <TableCell className="text-center">
                              <Button variant="ghost" size="sm" onClick={() => handleDeposit(asset.symbol)}><ArrowDownCircle className="h-4 w-4 mr-1 text-green-500" />Deposit</Button>
                              <Button variant="ghost" size="sm" onClick={() => handleWithdraw(asset.symbol)}><ArrowUpCircle className="h-4 w-4 mr-1 text-red-500" />Withdraw</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>All your past deposits, withdrawals, and trades.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Asset</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {placeholderTransactions.map(tx => (
                          <TableRow key={tx.id}>
                            <TableCell className="text-xs">{tx.date}</TableCell>
                            <TableCell>{tx.type}</TableCell>
                            <TableCell>{tx.asset}</TableCell>
                            <TableCell className={`font-mono ${tx.amount.startsWith('+') ? 'text-green-500' : tx.amount.startsWith('-') ? 'text-red-500' : ''}`}>{tx.amount}</TableCell>
                            <TableCell>{tx.status}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{tx.details}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default WalletPage;