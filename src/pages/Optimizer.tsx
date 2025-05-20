
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Download, PieChart, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockStocks = [
  { id: 1, name: 'Apple Inc (AAPL)', sector: 'Technology' },
  { id: 2, name: 'Microsoft Corp (MSFT)', sector: 'Technology' },
  { id: 3, name: 'Amazon.com Inc (AMZN)', sector: 'Consumer Cyclical' },
  { id: 4, name: 'Tesla Inc (TSLA)', sector: 'Automotive' },
  { id: 5, name: 'JP Morgan Chase (JPM)', sector: 'Financial' },
  { id: 6, name: 'Johnson & Johnson (JNJ)', sector: 'Healthcare' },
  { id: 7, name: 'Procter & Gamble (PG)', sector: 'Consumer Defensive' },
  { id: 8, name: 'Visa Inc (V)', sector: 'Financial' },
];

const Optimizer = () => {
  const [riskTolerance, setRiskTolerance] = useState([5]);
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);

  const handleAddStock = (stock: string) => {
    if (!selectedStocks.includes(stock)) {
      setSelectedStocks([...selectedStocks, stock]);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="card-glass p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">Portfolio Optimizer</h1>
          <p className="text-muted-foreground mb-6">Optimize your portfolio allocation for maximum returns and minimal risk</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="space-y-3">
                <Label>Risk Tolerance</Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Conservative</span>
                  <Slider
                    value={riskTolerance}
                    onValueChange={setRiskTolerance}
                    max={10}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground">Aggressive</span>
                </div>
                <div className="text-center text-sm font-medium">
                  {riskTolerance[0]}/10
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Select Assets</Label>
                <Select onValueChange={handleAddStock}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add stock to portfolio" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStocks.map(stock => (
                      <SelectItem key={stock.id} value={stock.name}>{stock.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="bg-secondary p-3 rounded-lg max-h-60 overflow-y-auto">
                  {selectedStocks.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedStocks.map((stock, index) => (
                        <li key={index} className="flex justify-between items-center bg-navy-700 p-2 rounded">
                          <span>{stock}</span>
                          <Button
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedStocks(selectedStocks.filter(s => s !== stock))}
                          >
                            ✕
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No assets selected
                    </div>
                  )}
                </div>
              </div>
              
              <Button className="w-full" disabled={selectedStocks.length < 2}>
                Optimize Portfolio
              </Button>
            </div>
            
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="mr-2 h-5 w-5" />
                      Optimized Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      {selectedStocks.length < 2 ? (
                        "Select at least 2 assets to optimize"
                      ) : (
                        "Pie chart will appear here"
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-navy-700 p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground">Expected Return</div>
                          <div className="text-xl font-semibold text-stockup">+12.5%</div>
                        </div>
                        <div className="bg-navy-700 p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground">Volatility</div>
                          <div className="text-xl font-semibold">18.3%</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-navy-700 p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                          <div className="text-xl font-semibold">1.28</div>
                        </div>
                        <div className="bg-navy-700 p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground">Max Drawdown</div>
                          <div className="text-xl font-semibold text-stockdown">-22.4%</div>
                        </div>
                      </div>
                      
                      <div className="bg-navy-700 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">VS. NIFTY 50</div>
                        <div className="text-xl font-semibold text-stockup">+3.8%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Results
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Optimizer;
