import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Download, Home, RefreshCw, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface AppLog {
  id: string;
  level: string;
  message: string;
  details?: any;
  user_id?: string;
  session_id?: string;
  user_agent?: string;
  url?: string;
  timestamp: string;
  source: string;
  stack_trace?: string;
  resolved_at?: string;
  resolved_by?: string;
}

const AdminLogs = () => {
  const { isAdmin, isLoading } = useIsAdmin();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [logs, setLogs] = useState<AppLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    level: '',
    source: '',
    search: '',
    limit: '100'
  });

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchLogs();
    }
  }, [isAdmin, filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('app_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(parseInt(filters.limit));

      if (filters.level) {
        query = query.eq('level', filters.level);
      }

      if (filters.source) {
        query = query.eq('source', filters.source);
      }

      if (filters.search) {
        query = query.or(`message.ilike.%${filters.search}%,url.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = async () => {
    if (!confirm('Are you sure you want to delete all logs? This cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('app_logs')
        .delete()
        .neq('id', ''); // Delete all records

      if (error) throw error;
      setLogs([]);
    } catch (error) {
      console.error('Error clearing logs:', error);
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Source', 'Message', 'URL', 'User ID', 'Session ID'].join(','),
      ...logs.map(log => [
        log.timestamp,
        log.level,
        log.source,
        `"${log.message.replace(/"/g, '""')}"`,
        log.url || '',
        log.user_id || '',
        log.session_id || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-logs-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'error': return 'destructive';
      case 'warn': return 'secondary';
      case 'info': return 'default';
      case 'debug': return 'outline';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="container mx-auto sm:py-8 py-4 sm:px-4 px-2">
      <Card>
        <CardHeader>
          <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Application Logs
              </CardTitle>
              <CardDescription>
                View and manage application error logs and events
              </CardDescription>
            </div>
            <div className="flex sm:flex-row flex-col gap-2 sm:w-auto w-full">
              <Button variant="outline" onClick={() => navigate('/status')} className="sm:w-auto w-full">
                <Home className="h-4 w-4 mr-2" />
                Back to Status
              </Button>
              <Button variant="outline" onClick={exportLogs} disabled={logs.length === 0} className="sm:w-auto w-full">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="destructive" onClick={clearLogs} disabled={logs.length === 0} className="sm:w-auto w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
              <Button onClick={fetchLogs} className="sm:w-auto w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex sm:flex-row flex-col gap-4 mb-6">
            <div className="sm:flex-1 w-full sm:min-w-[200px]">
              <Input
                placeholder="Search messages or URLs..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="sm:text-sm text-base"
              />
            </div>
            
            <Select value={filters.level} onValueChange={(value) => setFilters(prev => ({ ...prev, level: value }))}>
              <SelectTrigger className="sm:w-[150px] w-full">
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.source} onValueChange={(value) => setFilters(prev => ({ ...prev, source: value }))}>
              <SelectTrigger className="sm:w-[180px] w-full">
                <SelectValue placeholder="All sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All sources</SelectItem>
                <SelectItem value="error_boundary">Error Boundary</SelectItem>
                <SelectItem value="global_handler">Global Handler</SelectItem>
                <SelectItem value="api_fetch">API Fetch</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.limit} onValueChange={(value) => setFilters(prev => ({ ...prev, limit: value }))}>
              <SelectTrigger className="sm:w-[100px] w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="500">500</SelectItem>
                <SelectItem value="1000">1000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No logs found matching your criteria.
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Time</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead className="min-w-[100px]">Source</TableHead>
                    <TableHead className="min-w-[200px]">Message</TableHead>
                    <TableHead className="min-w-[150px]">URL</TableHead>
                    <TableHead className="min-w-[100px]">Session</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono sm:text-sm text-xs">
                        {format(new Date(log.timestamp), 'MMM dd HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getLevelBadgeVariant(log.level)}>
                          {log.level.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="sm:text-sm text-xs">{log.source}</TableCell>
                      <TableCell className="sm:max-w-md max-w-[200px]">
                        <div className="truncate" title={log.message}>
                          {log.message}
                        </div>
                        {log.details && (
                          <details className="mt-1">
                            <summary className="text-xs text-muted-foreground cursor-pointer">
                              Details
                            </summary>
                            <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-x-auto whitespace-pre-wrap break-all">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        )}
                        {log.stack_trace && (
                          <details className="mt-1">
                            <summary className="text-xs text-muted-foreground cursor-pointer">
                              Stack Trace
                            </summary>
                            <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-x-auto whitespace-pre-wrap break-all">
                              {log.stack_trace}
                            </pre>
                          </details>
                        )}
                      </TableCell>
                      <TableCell className="sm:max-w-xs max-w-[120px]">
                        <div className="truncate sm:text-sm text-xs" title={log.url}>
                          {log.url}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.session_id?.substring(0, 8)}...
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogs;