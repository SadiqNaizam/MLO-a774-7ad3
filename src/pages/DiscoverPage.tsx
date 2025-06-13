import React, { useState } from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AssetListItem from '@/components/AssetListItem';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Newspaper } from 'lucide-react';

const placeholderDiscoverAssets = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png', price: 70000, priceChange24hPercentage: 2.1, marketCap: 1300000000000, tags: ['PoW', 'Trending'] },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', price: 3500, priceChange24hPercentage: -0.5, marketCap: 420000000000, tags: ['PoS', 'Top Volume'] },
  { id: 'sol', name: 'Solana', symbol: 'SOL', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png', price: 150, priceChange24hPercentage: 5.5, marketCap: 70000000000, tags: ['PoS', 'New Listing'] },
  { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png', price: 0.15, priceChange24hPercentage: 0.2, marketCap: 20000000000, tags: ['Meme', 'Community'] },
  // Add more for scrolling effect
  { id: 'shib', name: 'Shiba Inu', symbol: 'SHIB', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png', price: 0.000025, priceChange24hPercentage: 1.2, marketCap: 15000000000, tags: ['Meme'] },
  { id: 'link', name: 'Chainlink', symbol: 'LINK', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png', price: 18, priceChange24hPercentage: -2.0, marketCap: 10000000000, tags: ['Oracle', 'DeFi'] },
];

const placeholderNews = [
    { id: 'n1', title: "Bitcoin Hits New All-Time High Amidst ETF Optimism", source: "CoinJournal", date: "Oct 26, 2023", summary: "Bitcoin soared past $70,000...",imageUrl: "https://via.placeholder.com/300x150/FFA500/FFFFFF?text=Bitcoin+News" },
    { id: 'n2', title: "Ethereum's Shanghai Upgrade: What You Need to Know", source: "CryptoNews", date: "Oct 25, 2023", summary: "The latest Ethereum upgrade brings staking withdrawals...", imageUrl: "https://via.placeholder.com/300x150/87CEEB/FFFFFF?text=Ethereum+Update"},
    { id: 'n3', title: "The Rise of Decentralized Finance (DeFi) in 2024", source: "DeFi Times", date: "Oct 24, 2023", summary: "An overview of the explosive growth in DeFi protocols...", imageUrl: "https://via.placeholder.com/300x150/90EE90/FFFFFF?text=DeFi+Growth"},
];
const placeholderGuides = [
    { id: 'g1', title: "Beginner's Guide to Cryptocurrency Trading", category: "Trading Basics", imageUrl: "https://via.placeholder.com/300x150/ADD8E6/FFFFFF?Text=Trading+Guide"},
    { id: 'g2', title: "Understanding Blockchain Technology", category: "Fundamentals", imageUrl: "https://via.placeholder.com/300x150/FFB6C1/FFFFFF?Text=Blockchain+Guide"},
    { id: 'g3', title: "How to Secure Your Crypto Assets", category: "Security", imageUrl: "https://via.placeholder.com/300x150/FFFFE0/000000?Text=Security+Guide"},
];


const DiscoverPage = () => {
  console.log('DiscoverPage loaded');
  const [searchTerm, setSearchTerm] = useState('');
  const handleTradeClick = (symbol: string) => console.log(`Trade ${symbol} from Discover`);
  
  const handleToggleMobileNav = () => {
    console.log("Toggle mobile navigation");
  };

  const filteredAssets = placeholderDiscoverAssets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-muted/40">
      <NavigationMenu />
      <div className="flex flex-col flex-1">
        <Header onToggleMobileNav={handleToggleMobileNav} />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold">Discover Assets</h1>
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assets (e.g., Bitcoin, BTC)..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all-assets">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all-assets"><Search className="mr-2 h-4 w-4 inline-block"/>All Assets</TabsTrigger>
              <TabsTrigger value="market-news"><Newspaper className="mr-2 h-4 w-4 inline-block"/>Market News</TabsTrigger>
              <TabsTrigger value="learn"><BookOpen className="mr-2 h-4 w-4 inline-block"/>Learn Crypto</TabsTrigger>
            </TabsList>

            <TabsContent value="all-assets">
              <Card>
                <CardHeader>
                  <CardTitle>Explore Cryptocurrencies</CardTitle>
                  <CardDescription>Find your next investment opportunity.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[60vh]"> {/* Adjust height as needed */}
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {filteredAssets.length > 0 ? filteredAssets.map(asset => (
                        <AssetListItem key={asset.id} {...asset} onTradeClick={handleTradeClick} />
                      )) : <p className="col-span-full text-center text-muted-foreground">No assets found matching your search.</p>}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="market-news">
              <Card>
                <CardHeader>
                    <CardTitle>Latest Market News</CardTitle>
                    <CardDescription>Stay updated with the crypto world.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[60vh]">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {placeholderNews.map(news => (
                                <Card key={news.id} className="flex flex-col">
                                    <img src={news.imageUrl} alt={news.title} className="rounded-t-lg object-cover h-40 w-full"/>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{news.title}</CardTitle>
                                        <CardDescription>{news.source} - {news.date}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-muted-foreground">{news.summary}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" className="w-full">Read Full Article</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="learn">
              <Card>
                <CardHeader>
                    <CardTitle>Educational Resources</CardTitle>
                    <CardDescription>Expand your cryptocurrency knowledge.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[60vh]">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {placeholderGuides.map(guide => (
                                <Card key={guide.id} className="flex flex-col">
                                     <img src={guide.imageUrl} alt={guide.title} className="rounded-t-lg object-cover h-40 w-full"/>
                                    <CardHeader>
                                        <CardTitle className="text-base">{guide.title}</CardTitle>
                                        <CardDescription>{guide.category}</CardDescription>
                                    </CardHeader>
                                    <CardFooter>
                                        <Button variant="secondary" className="w-full">Start Learning</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
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

export default DiscoverPage;