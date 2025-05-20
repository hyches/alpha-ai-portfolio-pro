
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Search, Star } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const mockReport = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  date: 'May 19, 2025',
  summary: 'Apple continues to show strong growth in its services segment, offsetting slower hardware sales. The company is well-positioned for the AI revolution with its custom silicon strategy and expanding ecosystem. Recent product launches have been well-received, and the company maintains strong cash reserves.',
  factors: [
    { title: 'Growth Potential', rating: 9 },
    { title: 'Financial Health', rating: 10 },
    { title: 'Competitive Position', rating: 8 },
    { title: 'Management Quality', rating: 9 },
  ],
  worthExploring: true,
  targetPrice: '$215',
  recommendation: 'Buy',
};

const Research = () => {
  const [symbol, setSymbol] = useState('');
  const [report, setReport] = useState(mockReport);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!symbol) return;
    
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      // Report would come from API
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="card-glass p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">AI Research Reports</h1>
          <p className="text-muted-foreground mb-6">Get in-depth AI analysis on any publicly traded company</p>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="symbol" className="sr-only">Stock Symbol</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="symbol" 
                  placeholder="Enter stock symbol (e.g., AAPL)" 
                  className="pl-10"
                  value={symbol}
                  onChange={e => setSymbol(e.target.value.toUpperCase())}
                />
              </div>
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </div>
        
        {report && (
          <div className="card-glass p-6 rounded-lg">
            <div className="flex justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  {report.symbol}: {report.name}
                  {report.worthExploring && (
                    <span className="ml-2 text-amber-400">
                      <Star className="h-5 w-5 fill-amber-400" />
                    </span>
                  )}
                </h2>
                <p className="text-muted-foreground">Report generated on {report.date}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Word
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Executive Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{report.summary}</p>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-secondary p-4 rounded-lg">
                          <div className="text-muted-foreground text-sm">Market Cap</div>
                          <div className="text-xl font-semibold">$2.45T</div>
                        </div>
                        <div className="bg-secondary p-4 rounded-lg">
                          <div className="text-muted-foreground text-sm">P/E Ratio</div>
                          <div className="text-xl font-semibold">28.5</div>
                        </div>
                        <div className="bg-secondary p-4 rounded-lg">
                          <div className="text-muted-foreground text-sm">Dividend</div>
                          <div className="text-xl font-semibold">0.92%</div>
                        </div>
                        <div className="bg-secondary p-4 rounded-lg">
                          <div className="text-muted-foreground text-sm">Beta</div>
                          <div className="text-xl font-semibold">1.21</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>AI Recommendation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <div className={`text-3xl font-bold ${report.recommendation === 'Buy' ? 'text-stockup' : report.recommendation === 'Sell' ? 'text-stockdown' : 'text-amber-400'}`}>
                        {report.recommendation}
                      </div>
                      <div className="text-muted-foreground mt-2">Target Price</div>
                      <div className="text-2xl font-semibold">{report.targetPrice}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Key Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {report.factors.map((factor, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <div className="flex justify-between mb-1">
                          <span>{factor.title}</span>
                          <span className="font-semibold">{factor.rating}/10</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-teal" 
                            style={{ width: `${factor.rating * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Research;
