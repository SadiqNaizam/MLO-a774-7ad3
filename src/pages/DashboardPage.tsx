import React from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AssetListItem from '@/components/AssetListItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRight, TrendingUp, DollarSign, BarChartHorizontalBig } from 'lucide-react';

// Shadcn UI Chart components (recharts based)
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

const placeholderPortfolioAssets = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', balance: '0.5', value: '35,000.00 USD', change: '+2.5%' },
  { id: '2', name: 'Ethereum', symbol: 'ETH', balance: '10', value: '22,000.00 USD', change: '-1.1%' },
  { id: '3', name: 'Solana', symbol: 'SOL', balance: '150', value: '15,000.00 USD', change: '+5.0%' },
];

const placeholderWatchlistAssets = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png', price: 70000, priceChange24hPercentage: 2.1, marketCap: 1300000000000, tags: ['PoW', 'Store of Value'] },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', price: 3500, priceChange24hPercentage: -0.5, marketCap: 420000000000, tags: ['PoS', 'Smart Contracts'] },
  { id: 'ada', name: 'Cardano', symbol: 'ADA', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png', price: 0.65, priceChange24hPercentage: 1.8, marketCap: 23000000000, tags: ['PoS', 'Research'] },
];

const chartData = [
  { month: "Jan", portfolioValue: 28000 }, { month: "Feb", portfolioValue: 32000 },
  { month: "Mar", portfolioValue: 30000 }, { month: "Apr", portfolioValue: 35000 },
  { month: "May", portfolioValue: 37000 }, { month: "Jun", portfolioValue: 40000 },
];
const chartConfig = {
  portfolioValue: { label: "Portfolio Value", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const DashboardPage = () => {
  console.log('DashboardPage loaded');

  const handleTradeClick = (symbol: string) => {
    console.log(`Trade ${symbol} clicked`);
    // Navigate to trade page or open trade modal
  };
  
  const handleToggleMobileNav = () => {
    console.log("Toggle mobile navigation");
    // Actual implementation would involve state management
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <NavigationMenu />
      <div className="flex flex-col flex-1">
        <Header onToggleMobileNav={handleToggleMobileNav} />
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$72,350.90</div>
                <p className="text-xs text-muted-foreground">+5.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">24h Profit/Loss</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">+$1,280.45</div>
                <p className="text-xs text-muted-foreground">+1.8% today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                <BarChartHorizontalBig className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button size="sm">Deposit</Button>
                <Button size="sm" variant="outline">Trade</Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Monthly portfolio value trend.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Bar dataKey="portfolioValue" fill="var(--color-portfolioValue)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Key Assets</CardTitle>
                <CardDescription>Your top performing assets.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {placeholderPortfolioAssets.map(asset => (
                      <TableRow key={asset.id}>
                        <TableCell>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                        </TableCell>
                        <TableCell className="text-right">{asset.balance}</TableCell>
                        <TableCell className="text-right">{asset.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My Watchlist</h2>
              <Button variant="outline" size="sm">
                Manage Watchlist <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {placeholderWatchlistAssets.map(asset => (
                <AssetListItem key={asset.id} {...asset} onTradeClick={handleTradeClick} />
              ))}
            </div>
          </section>

          <section className="mt-8">
             <h2 className="text-xl font-semibold mb-4">Market News</h2>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Placeholder for news items - using Card for structure */}
                {[1,2,3].map(i => (
                    <Card key={i}>
                        <CardHeader>
                            <CardTitle className="text-lg">Crypto Market Sees Uptick</CardTitle>
                            <CardDescription>Oct 26, 2023 - CoinDesk</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Major cryptocurrencies rally as institutional interest grows...</p>
                        </CardContent>
                        <CardContent className="pt-0">
                             <Button variant="link" className="p-0 h-auto">Read More</Button>
                        </CardContent>
                    </Card>
                ))}
             </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardPage;