
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import CustomCard from '@/components/ui/custom-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieChart, BarChart, Settings, Download, Loader, ArrowRight } from 'lucide-react';
import FormGroup from '@/components/ui/form-group';
import Section from '@/components/ui/section';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

import {
  ResponsiveContainer,
  PieChart as RechartPieChart,
  Pie,
  Cell,
  Legend,
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';

const pieData = [
  { name: 'Technology', value: 35, color: '#4ECDC4' },
  { name: 'Healthcare', value: 20, color: '#FF6B6B' },
  { name: 'Finance', value: 15, color: '#5BB4FF' },
  { name: 'Consumer', value: 10, color: '#FFD166' },
  { name: 'Energy', value: 10, color: '#9775FA' },
  { name: 'Others', value: 10, color: '#8CCDFF' },
];

const riskData = [
  { name: 'Current', volatility: 12, sharpe: 1.8, drawdown: 15 },
  { name: 'Optimized', volatility: 9, sharpe: 2.3, drawdown: 11 },
];

const stockSuggestions = [
  { ticker: 'AAPL', action: 'Increase', current: '5%', target: '8%', reason: 'Strong fundamentals, low volatility' },
  { ticker: 'MSFT', action: 'Maintain', current: '7%', target: '7%', reason: 'Well positioned in AI revolution' },
  { ticker: 'GOOGL', action: 'Decrease', current: '6%', target: '4%', reason: 'Regulatory headwinds expected' },
  { ticker: 'AMZN', action: 'Add', current: '0%', target: '5%', reason: 'Undervalued, strong growth prospects' },
  { ticker: 'XOM', action: 'Remove', current: '3%', target: '0%', reason: 'High carbon transition risk' },
];

const Optimizer = () => {
  const [riskLevel, setRiskLevel] = useState('moderate');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [isFullAnalysis, setIsFullAnalysis] = useState(false);
  const { toast } = useToast();

  const handleOptimize = () => {
    setIsOptimizing(true);
    // Simulate optimization
    setTimeout(() => {
      setIsOptimizing(false);
      setIsOptimized(true);
      toast({
        title: "Portfolio Optimized",
        description: "Your portfolio has been optimized based on your risk preferences.",
      });
    }, 2500);
  };

  const handleDownload = () => {
    toast({
      title: "Report Downloaded",
      description: "The optimization report has been downloaded to your device.",
    });
  };

  const handleToggleChange = (checked: boolean) => {
    setIsFullAnalysis(checked);
    toast({
      title: checked ? "Full Analysis Mode" : "Individual Module Mode",
      description: checked 
        ? "Results will be included in the comprehensive analysis" 
        : "Results will be shown for this module only",
      duration: 3000,
    });
  };

  return (
    <AppLayout title="Portfolio Optimizer" description="Optimize your portfolio based on risk, return, and other factors">
      <div className="flex justify-end mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Individual Module</span>
          <Switch checked={isFullAnalysis} onCheckedChange={handleToggleChange} />
          <span className="text-sm text-muted-foreground">Full Analysis</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <CustomCard 
          title="Optimization Settings" 
          className="lg:col-span-1"
        >
          <div className="space-y-4">
            <FormGroup 
              htmlFor="riskLevel" 
              label="Risk Tolerance" 
              tooltip="Choose your preferred level of risk"
            >
              <Select value={riskLevel} onValueChange={setRiskLevel}>
                <SelectTrigger id="riskLevel">
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </FormGroup>
            
            <FormGroup 
              htmlFor="maxPosition" 
              label="Maximum Position Size" 
              hint="Maximum percentage for any single position"
            >
              <Input id="maxPosition" type="number" placeholder="e.g., 10" defaultValue="10" />
            </FormGroup>
            
            <FormGroup 
              htmlFor="sectorConstraints" 
              label="Sector Constraints" 
              optional={true}
            >
              <Select defaultValue="enabled">
                <SelectTrigger id="sectorConstraints">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </FormGroup>
            
            <FormGroup 
              htmlFor="esgFilter" 
              label="ESG Filter" 
              optional={true}
            >
              <Select defaultValue="moderate">
                <SelectTrigger id="esgFilter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strict">Strict</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </FormGroup>
            
            <Button 
              className="w-full mt-4" 
              onClick={handleOptimize}
              disabled={isOptimizing}
            >
              {isOptimizing ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Settings className="mr-2 h-4 w-4" />
                  Optimize Portfolio
                </>
              )}
            </Button>
          </div>
        </CustomCard>
        
        <CustomCard 
          title="Optimal Asset Allocation" 
          className="lg:col-span-2"
          headerAction={
            isOptimized ? (
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            ) : null
          }
        >
          {!isOptimized ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground flex-col">
              <PieChart className="h-12 w-12 mb-4 text-muted-foreground/50" />
              <p>Optimize your portfolio to see the recommended asset allocation</p>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </RechartPieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CustomCard>
      </div>
      
      {isOptimized && (
        <>
          <Section 
            title="Risk and Performance Metrics" 
            description="Comparison of current vs. optimized portfolio"
            columns={1}
          >
            <CustomCard>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBarChart
                    data={riskData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="volatility" name="Volatility (%)" fill="#FF6B6B" />
                    <Bar dataKey="sharpe" name="Sharpe Ratio" fill="#4ECDC4" />
                    <Bar dataKey="drawdown" name="Max Drawdown (%)" fill="#5BB4FF" />
                  </RechartBarChart>
                </ResponsiveContainer>
              </div>
            </CustomCard>
          </Section>
          
          <Section 
            title="AI Recommendations" 
            description="Specific changes suggested for your portfolio"
            columns={1}
          >
            <CustomCard>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ticker</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Weight</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Target Weight</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {stockSuggestions.map((stock, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-4 whitespace-nowrap font-medium">{stock.ticker}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1
                            ${stock.action === 'Increase' ? 'bg-stockup/20 text-stockup' : 
                              stock.action === 'Decrease' ? 'bg-stockdown/20 text-stockdown' :
                              stock.action === 'Add' ? 'bg-teal/20 text-teal' :
                              stock.action === 'Remove' ? 'bg-coral/20 text-coral' :
                              'bg-amber-500/20 text-amber-500'}`
                          }>
                            {stock.action === 'Increase' && <ArrowRight className="h-3 w-3 rotate-45" />}
                            {stock.action === 'Decrease' && <ArrowRight className="h-3 w-3 -rotate-45" />}
                            {stock.action}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">{stock.current}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{stock.target}</td>
                        <td className="px-4 py-4">{stock.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CustomCard>
          </Section>
        </>
      )}
    </AppLayout>
  );
};

export default Optimizer;
