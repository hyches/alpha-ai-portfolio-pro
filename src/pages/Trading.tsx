
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart2, Download, TrendingDown, TrendingUp } from 'lucide-react';

const mockSignals = [
  { id: 1, stock: 'NIFTY', strike: '21500 CE', signal: 'Buy', price: '145.2', target: '180.5', sl: '125.0', date: '2025-05-19' },
  { id: 2, stock: 'BANKNIFTY', strike: '48000 PE', signal: 'Sell', price: '320.8', target: '250.0', sl: '350.0', date: '2025-05-19' },
  { id: 3, stock: 'RELIANCE', strike: '3200 CE', signal: 'Buy', price: '89.5', target: '120.0', sl: '75.0', date: '2025-05-18' },
  { id: 4, stock: 'INFY', strike: '1600 PE', signal: 'Buy', price: '45.3', target: '65.0', sl: '35.0', date: '2025-05-18' },
  { id: 5, stock: 'HDFCBANK', strike: '1750 CE', signal: 'Sell', price: '52.1', target: '30.0', sl: '65.0', date: '2025-05-17' },
];

const Trading = () => {
  const [selectedStrategy, setSelectedStrategy] = useState('bullish');

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="card-glass p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">F&O Trading Terminal</h1>
          <p className="text-muted-foreground mb-6">Get AI-powered options trading signals and execute strategies</p>
          
          <Tabs defaultValue="signals" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="signals">Signals</TabsTrigger>
              <TabsTrigger value="strategy">Strategy Builder</TabsTrigger>
              <TabsTrigger value="backtest">Backtest</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signals">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Signals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">23</div>
                    <p className="text-xs text-muted-foreground">+5 from yesterday</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Buy Signals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-stockup flex items-center">
                      15
                      <TrendingUp className="ml-2 h-4 w-4" />
                    </div>
                    <p className="text-xs text-muted-foreground">65% of total</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Sell Signals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-stockdown flex items-center">
                      8
                      <TrendingDown className="ml-2 h-4 w-4" />
                    </div>
                    <p className="text-xs text-muted-foreground">35% of total</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-navy-800 rounded-lg p-4 overflow-x-auto">
                <div className="flex justify-between mb-4">
                  <h2 className="text-lg font-semibold">Latest F&O Signals</h2>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stock/Index</TableHead>
                      <TableHead>Strike</TableHead>
                      <TableHead>Signal</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>SL</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSignals.map(signal => (
                      <TableRow key={signal.id}>
                        <TableCell className="font-medium">{signal.stock}</TableCell>
                        <TableCell>{signal.strike}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            signal.signal === 'Buy' ? 'bg-stockup/20 text-stockup' : 'bg-stockdown/20 text-stockdown'
                          }`}>
                            {signal.signal}
                          </span>
                        </TableCell>
                        <TableCell>{signal.price}</TableCell>
                        <TableCell>{signal.target}</TableCell>
                        <TableCell>{signal.sl}</TableCell>
                        <TableCell>{signal.date}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Trade</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="strategy">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Strategy Builder</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="strategy">Strategy Type</Label>
                        <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                          <SelectTrigger id="strategy">
                            <SelectValue placeholder="Select strategy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bullish">Bullish</SelectItem>
                            <SelectItem value="bearish">Bearish</SelectItem>
                            <SelectItem value="neutral">Neutral</SelectItem>
                            <SelectItem value="volatile">Volatile</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="stock">Underlying</Label>
                        <Select>
                          <SelectTrigger id="stock">
                            <SelectValue placeholder="Select stock/index" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nifty">NIFTY</SelectItem>
                            <SelectItem value="banknifty">BANKNIFTY</SelectItem>
                            <SelectItem value="reliance">RELIANCE</SelectItem>
                            <SelectItem value="infy">INFOSYS</SelectItem>
                            <SelectItem value="tcs">TCS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry</Label>
                        <Select>
                          <SelectTrigger id="expiry">
                            <SelectValue placeholder="Select expiry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly (23-May-2025)</SelectItem>
                            <SelectItem value="monthly">Monthly (29-May-2025)</SelectItem>
                            <SelectItem value="quarterly">Quarterly (26-Jun-2025)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="capital">Capital</Label>
                        <Input id="capital" type="number" placeholder="e.g., 100000" />
                      </div>
                      
                      <Button className="w-full">
                        Generate Strategy
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xl font-semibold">Bull Call Spread</CardTitle>
                      <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        Payoff diagram will appear here
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-navy-700 p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground">Max Profit</div>
                          <div className="text-xl font-semibold text-stockup">₹12,500</div>
                        </div>
                        <div className="bg-navy-700 p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground">Max Loss</div>
                          <div className="text-xl font-semibold text-stockdown">₹7,500</div>
                        </div>
                        <div className="bg-navy-700 p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground">Break-even</div>
                          <div className="text-xl font-semibold">21,375</div>
                        </div>
                        <div className="bg-navy-700 p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground">Probability</div>
                          <div className="text-xl font-semibold">68%</div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Leg</TableHead>
                              <TableHead>Strike</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Action</TableHead>
                              <TableHead>Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>1</TableCell>
                              <TableCell>21300</TableCell>
                              <TableCell>CE</TableCell>
                              <TableCell>Buy</TableCell>
                              <TableCell>150</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>2</TableCell>
                              <TableCell>21500</TableCell>
                              <TableCell>CE</TableCell>
                              <TableCell>Sell</TableCell>
                              <TableCell>75</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div className="mt-6 flex justify-end space-x-2">
                        <Button variant="outline">Modify</Button>
                        <Button>Execute Strategy</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="backtest">
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                Backtest module will be available here
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default Trading;
