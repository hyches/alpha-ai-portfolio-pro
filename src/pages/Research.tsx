
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Search, Star, TrendingUp, TrendingDown, Info, ChevronRight, Loader } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CustomCard from '@/components/ui/custom-card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const stockPriceData = [
  { date: 'Jan', price: 185, avg: 175 },
  { date: 'Feb', price: 190, avg: 178 },
  { date: 'Mar', price: 195, avg: 183 },
  { date: 'Apr', price: 188, avg: 185 },
  { date: 'May', price: 205, avg: 188 },
  { date: 'Jun', price: 215, avg: 192 },
  { date: 'Jul', price: 218, avg: 197 },
  { date: 'Aug', price: 225, avg: 202 },
];

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
  keyInsights: [
    'Service revenue growth accelerated to 18% year-over-year',
    'AI capabilities integrated into next-gen silicon products',
    'Expanding hardware ecosystem with new wearable products',
    'Strong international growth, particularly in India and Southeast Asia',
    'Regulatory pressures in EU and US markets remain a concern',
  ],
  risks: [
    'Slowing iPhone replacement cycles',
    'Increased competition in services segment',
    'Supply chain constraints for new products',
    'Regulatory scrutiny in multiple markets',
  ]
};

const Research = () => {
  const [symbol, setSymbol] = useState('');
  const [report, setReport] = useState(mockReport);
  const [loading, setLoading] = useState(false);
  const [analysisMode, setAnalysisMode] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!symbol) return;
    
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Research Report Generated",
        description: `AI analysis for ${symbol} is now ready to view.`,
      });
      // Report would come from API
    }, 2000);
  };

  const handleDownload = (format: string) => {
    toast({
      title: `Downloading ${format}`,
      description: "Your file will be ready momentarily.",
    });
  };

  const handleToggleChange = (checked: boolean) => {
    setAnalysisMode(checked);
    toast({
      title: checked ? "Full Analysis Mode" : "Individual Research Mode",
      description: checked 
        ? "This report will be included in the comprehensive analysis" 
        : "Running as a standalone research report",
      duration: 3000,
    });
  };

  return (
    <AppLayout title="AI Research Reports" description="Get in-depth AI analysis on any publicly traded company">
      <div className="flex justify-end mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Individual Research</span>
          <Switch checked={analysisMode} onCheckedChange={handleToggleChange} />
          <span className="text-sm text-muted-foreground">Full Analysis</span>
        </div>
      </div>
      
      <CustomCard className="mb-6 p-1">
        <div className="flex gap-4 p-3">
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
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Report'
            )}
          </Button>
        </div>
      </CustomCard>
      
      {report && (
        <div className="space-y-6">
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
                <Button variant="outline" size="sm" onClick={() => handleDownload('PDF')}>
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload('Word')}>
                  <Download className="mr-2 h-4 w-4" />
                  Word
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  <div className="lg:col-span-2">
                    <CustomCard title="AI-Generated Stock Summary">
                      <p className="leading-relaxed">{report.summary}</p>
                      
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold mb-2">Key Insights</h4>
                        <ul className="space-y-2">
                          {report.keyInsights.map((insight, idx) => (
                            <li key={idx} className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-teal mr-2 mt-0.5 shrink-0" />
                              <span className="text-sm">{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold mb-2">Risk Factors</h4>
                        <ul className="space-y-2">
                          {report.risks.map((risk, idx) => (
                            <li key={idx} className="flex items-start">
                              <Info className="h-4 w-4 text-coral mr-2 mt-0.5 shrink-0" />
                              <span className="text-sm">{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CustomCard>
                    
                    <CustomCard title="Historical Performance" className="mt-6">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={stockPriceData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="price" 
                              stroke="#4ECDC4" 
                              activeDot={{ r: 8 }} 
                              name="Stock Price"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="avg" 
                              stroke="#FF6B6B" 
                              name="Moving Average" 
                              strokeDasharray="5 5"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CustomCard>
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
                    
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Market Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
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
              </TabsContent>
              
              <TabsContent value="details">
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  Detailed analysis coming soon
                </div>
              </TabsContent>
              
              <TabsContent value="financials">
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  Financial data coming soon
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Research;
