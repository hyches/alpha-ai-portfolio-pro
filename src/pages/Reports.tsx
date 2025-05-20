
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Download, Eye, FileText, Search, Share2 } from 'lucide-react';

const mockReports = [
  { id: 1, name: 'Apple (AAPL) Research Report.pdf', type: 'AI Research', date: '2025-05-19', size: '2.4 MB' },
  { id: 2, name: 'NIFTY Options Strategy - May 2025.xlsx', type: 'F&O Trading', date: '2025-05-18', size: '1.8 MB' },
  { id: 3, name: 'Diversified Portfolio - Q2 2025.pdf', type: 'Portfolio', date: '2025-05-17', size: '3.2 MB' },
  { id: 4, name: 'Renewable Energy Sector Analysis.pdf', type: 'Policy', date: '2025-05-15', size: '4.5 MB' },
  { id: 5, name: 'Tech Stocks Screener - May 2025.xlsx', type: 'Screener', date: '2025-05-14', size: '1.2 MB' },
  { id: 6, name: 'Tesla (TSLA) Research Report.pdf', type: 'AI Research', date: '2025-05-12', size: '2.7 MB' },
  { id: 7, name: 'Monthly Performance Report - April 2025.pdf', type: 'Portfolio', date: '2025-05-05', size: '5.1 MB' },
  { id: 8, name: 'Bank Nifty Options Backtest.xlsx', type: 'F&O Trading', date: '2025-05-03', size: '2.3 MB' },
];

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || report.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="card-glass p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">Reports</h1>
          <p className="text-muted-foreground mb-6">Access and manage all your generated reports</p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search reports..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-[200px]">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="AI Research">AI Research</SelectItem>
                  <SelectItem value="Portfolio">Portfolio</SelectItem>
                  <SelectItem value="F&O Trading">F&O Trading</SelectItem>
                  <SelectItem value="Screener">Screener</SelectItem>
                  <SelectItem value="Policy">Policy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="bg-navy-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Your Reports ({filteredReports.length})</h2>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export All
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map(report => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-teal" />
                            <span className="font-medium">{report.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-secondary rounded-full text-xs">
                            {report.type}
                          </span>
                        </TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>{report.size}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No reports found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reports;
