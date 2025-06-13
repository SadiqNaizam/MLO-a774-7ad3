import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast'; // Assuming useToast hook exists
import { Slider } from '@/components/ui/slider'; // For amount percentage

// Define Zod schema for validation
const orderSchema = z.object({
  type: z.enum(['market', 'limit', 'stop-limit']),
  side: z.enum(['buy', 'sell']),
  amount: z.coerce.number().positive("Amount must be positive"),
  price: z.coerce.number().optional(), // Required for limit and stop-limit
  stopPrice: z.coerce.number().optional(), // Required for stop-limit
  // Could add trigger conditions, timeInForce, etc.
}).refine(data => data.type !== 'limit' || (data.price && data.price > 0), {
  message: "Price is required for limit orders",
  path: ["price"],
}).refine(data => data.type !== 'stop-limit' || (data.price && data.price > 0 && data.stopPrice && data.stopPrice > 0), {
  message: "Price and Stop Price are required for stop-limit orders",
  path: ["stopPrice"], // Or both price and stopPrice if more specific needed
});

type OrderFormData = z.infer<typeof orderSchema>;

interface ComplexOrderFormProps {
  symbol: string; // e.g., BTC/USDT
  availableBalance: { base: number; quote: number }; // e.g. { base: 0.5 (BTC), quote: 10000 (USDT) }
  onSubmitOrder: (data: OrderFormData) => Promise<void>;
  currentMarketPrice?: number; // To prefill or suggest prices
}

const ComplexOrderForm: React.FC<ComplexOrderFormProps> = ({
  symbol,
  availableBalance,
  onSubmitOrder,
  currentMarketPrice,
}) => {
  const { toast } = useToast();
  const [activeSide, setActiveSide] = React.useState<'buy' | 'sell'>('buy');
  const [activeOrderType, setActiveOrderType] = React.useState<OrderFormData['type']>('limit');

  const { control, handleSubmit, register, watch, setValue, formState: { errors, isSubmitting } } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      side: activeSide,
      type: activeOrderType,
      amount: 0,
    },
  });

  const selectedOrderType = watch('type');
  const amount = watch('amount');
  const price = watch('price');

  React.useEffect(() => {
    setValue('side', activeSide);
  }, [activeSide, setValue]);

  React.useEffect(() => {
    setValue('type', activeOrderType);
    if (activeOrderType === 'market') {
        setValue('price', undefined); // Market orders don't have a price input
        setValue('stopPrice', undefined);
    } else if (activeOrderType === 'limit' && currentMarketPrice) {
        setValue('price', currentMarketPrice); // Pre-fill limit price
    }
  }, [activeOrderType, setValue, currentMarketPrice]);


  const handleFormSubmit = async (data: OrderFormData) => {
    console.log("Submitting order:", data);
    try {
      await onSubmitOrder(data);
      toast({ title: "Order Placed", description: `${data.side.toUpperCase()} ${data.type} order for ${data.amount} ${symbol.split('/')[0]} submitted.` });
      // Reset form or parts of it
    } catch (error) {
      console.error("Order submission error:", error);
      toast({ title: "Order Failed", description: (error as Error).message || "Could not place order.", variant: "destructive" });
    }
  };

  const handleAmountPercentage = (percentage: number) => {
    const assetToUse = activeSide === 'buy' ? availableBalance.quote / (price || currentMarketPrice || 1) : availableBalance.base;
    const calculatedAmount = (assetToUse * percentage) / 100;
    setValue('amount', parseFloat(calculatedAmount.toFixed(6))); // Adjust precision as needed for crypto
  };
  
  const totalCost = (activeSide === 'buy' && price && amount) ? (price * amount) : (amount); // Simplified, improve for market orders
  const quoteAsset = symbol.split('/')[1];
  const baseAsset = symbol.split('/')[0];

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{symbol}</CardTitle>
            {/* Can show available balance here */}
            <span className="text-xs text-muted-foreground">
                Bal: {activeSide === 'buy' ? `${availableBalance.quote.toFixed(2)} ${quoteAsset}` : `${availableBalance.base.toFixed(4)} ${baseAsset}`}
            </span>
        </div>
        <div className="grid grid-cols-2 gap-1 mt-2">
            <Button variant={activeSide === 'buy' ? 'default' : 'outline'} className={activeSide === 'buy' ? 'bg-green-600 hover:bg-green-700 text-white' : ''} onClick={() => setActiveSide('buy')}>Buy</Button>
            <Button variant={activeSide === 'sell' ? 'default' : 'outline'} className={activeSide === 'sell' ? 'bg-red-600 hover:bg-red-700 text-white' : ''} onClick={() => setActiveSide('sell')}>Sell</Button>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="p-4 space-y-4">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Tabs defaultValue={field.value} onValueChange={(value) => setActiveOrderType(value as OrderFormData['type'])} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="limit">Limit</TabsTrigger>
                  <TabsTrigger value="market">Market</TabsTrigger>
                  <TabsTrigger value="stop-limit">Stop-Limit</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          />
        
          {selectedOrderType === 'limit' || selectedOrderType === 'stop-limit' ? (
            <div>
              <Label htmlFor="price">Price ({quoteAsset})</Label>
              <Input id="price" type="number" step="any" {...register('price')} placeholder={`Price for 1 ${baseAsset}`} />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
          ) : null}

          {selectedOrderType === 'stop-limit' && (
            <div>
              <Label htmlFor="stopPrice">Stop Price ({quoteAsset})</Label>
              <Input id="stopPrice" type="number" step="any" {...register('stopPrice')} placeholder="Trigger price"/>
              {errors.stopPrice && <p className="text-red-500 text-xs mt-1">{errors.stopPrice.message}</p>}
            </div>
          )}

          <div>
            <Label htmlFor="amount">Amount ({baseAsset})</Label>
            <Input id="amount" type="number" step="any" {...register('amount')} />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Use Balance Percentage</Label>
            <div className="flex space-x-2 mt-1">
                {[25, 50, 75, 100].map(p => (
                    <Button key={p} type="button" variant="outline" size="sm" className="flex-1" onClick={() => handleAmountPercentage(p)}>{p}%</Button>
                ))}
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            {/* Display total cost or amount to receive */}
            <div className="flex justify-between">
                <span>Total:</span>
                <span>~ {totalCost.toFixed(2)} {quoteAsset}</span>
            </div>
          </div>

        </CardContent>
        <CardFooter className="p-4">
          <Button type="submit" className={cn("w-full", activeSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700')} disabled={isSubmitting}>
            {isSubmitting ? 'Placing Order...' : `${activeSide === 'buy' ? 'Buy' : 'Sell'} ${baseAsset}`}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ComplexOrderForm;