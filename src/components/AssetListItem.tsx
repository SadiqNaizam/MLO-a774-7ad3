import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'; // Icons for price change
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AssetListItemProps {
  id: string;
  name: string;
  symbol: string;
  iconUrl?: string;
  price: number;
  priceChange24hPercentage: number; // e.g., 2.5 for +2.5%, -1.1 for -1.1%
  marketCap?: number; // Optional
  tags?: string[]; // Optional tags like 'DeFi', 'NFT'
  onTradeClick?: (symbol: string) => void;
}

const AssetListItem: React.FC<AssetListItemProps> = ({
  id,
  name,
  symbol,
  iconUrl,
  price,
  priceChange24hPercentage,
  marketCap,
  tags,
  onTradeClick,
}) => {
  console.log("Rendering AssetListItem:", symbol);

  const PriceChangeIcon = priceChange24hPercentage > 0 ? TrendingUp : priceChange24hPercentage < 0 ? TrendingDown : Minus;
  const priceChangeColor = priceChange24hPercentage > 0 ? 'text-green-500' : priceChange24hPercentage < 0 ? 'text-red-500' : 'text-muted-foreground';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <Link to={`/trade/${symbol}`} className="block"> {/* Or to a dedicated asset page */}
        <CardContent className="p-4 flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={iconUrl} alt={name} />
            <AvatarFallback>{symbol.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">{name} ({symbol.toUpperCase()})</p>
                {tags && tags.length > 0 && (
                    <div className="hidden sm:flex gap-1 ml-2">
                        {tags.slice(0, 2).map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                    </div>
                )}
            </div>
            <div className="flex items-baseline space-x-2 text-sm text-muted-foreground">
                <p className="text-lg font-semibold text-foreground">${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div className="flex flex-col items-end text-sm w-24 text-right">
            <div className={cn("flex items-center font-semibold", priceChangeColor)}>
              <PriceChangeIcon className="h-4 w-4 mr-1" />
              {priceChange24hPercentage.toFixed(2)}%
            </div>
            {marketCap && (
              <p className="text-xs text-muted-foreground mt-1">
                MCap: ${(marketCap / 1_000_000_000).toFixed(2)}B
              </p>
            )}
          </div>
          {/* Optional: Add a quick trade button if onTradeClick is provided */}
          {/* {onTradeClick && (
            <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); onTradeClick(symbol); }}>Trade</Button>
          )} */}
        </CardContent>
      </Link>
    </Card>
  );
};

export default AssetListItem;