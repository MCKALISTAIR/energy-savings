import React, { useState } from 'react';
import { useServiceStatus } from '@/hooks/useServiceStatus';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Database,
  Zap,
  MapPin,
  Car,
  Fuel,
  DollarSign,
  FileText
} from 'lucide-react';

const Status = () => {
  const isMobile = useIsMobile();
  const { 
    services, 
    logs, 
    isChecking, 
    checkAllServices, 
    checkSingleService,
    clearLogs 
  } = useServiceStatus();
  const { isAdmin } = useIsAdmin();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getServiceIcon = (serviceId: string) => {
    switch (serviceId) {
      case 'supabase':
        return <Database className="w-5 h-5" />;
      case 'octopus-energy':
        return <Zap className="w-5 h-5" />;
      case 'address-lookup':
        return <MapPin className="w-5 h-5" />;
      case 'vehicle-pricing':
        return <Car className="w-5 h-5" />;
      case 'fuel-prices':
        return <Fuel className="w-5 h-5" />;
      case 'unirate':
        return <DollarSign className="w-5 h-5" />;
      default:
        return <Database className="w-5 h-5" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'default';
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background sm:p-6 p-4" role="main">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between gap-4">
          <div>
            <h1 className="sm:text-3xl text-2xl font-bold" id="page-title">Service Status</h1>
            <p className="text-muted-foreground">
              Monitor the health of all connected services
            </p>
          </div>
          <div className="flex sm:flex-row flex-col gap-2 sm:w-auto w-full">
            <Button
              onClick={clearLogs}
              variant="outline"
              disabled={isChecking}
              className="sm:w-auto w-full"
              aria-label="Clear all service logs"
            >
              Clear Logs
            </Button>
            <Button
              onClick={checkAllServices}
              disabled={isChecking}
              className="flex items-center gap-2 sm:w-auto w-full"
              aria-label={isChecking ? 'Checking all services...' : 'Check health of all services'}
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Checking...' : 'Check All Services'}
            </Button>
            {isAdmin && (
              <Button asChild variant="secondary" className="sm:w-auto w-full">
                <Link to="/admin/logs">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Logs
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="region" aria-labelledby="services-title">
          <h2 id="services-title" className="sr-only">Connected Services Status</h2>
          {services.map((service) => (
            <Card key={service.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getServiceIcon(service.id)}
                    <CardTitle className="sm:text-lg text-base">{service.name}</CardTitle>
                  </div>
                  <Badge variant={getStatusBadgeVariant(service.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(service.status)}
                      {service.status}
                    </div>
                  </Badge>
                </div>
                <CardDescription className="sm:text-sm text-xs">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between sm:text-sm text-xs">
                    <span className="text-muted-foreground">Last Checked:</span>
                    <span className="text-right">
                      {service.lastChecked 
                        ? new Date(service.lastChecked).toLocaleString()
                        : 'Never'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between sm:text-sm text-xs">
                    <span className="text-muted-foreground">Response Time:</span>
                    <span>
                      {service.responseTime ? `${service.responseTime}ms` : 'N/A'}
                    </span>
                  </div>
                  {service.lastError && (
                    <div className="sm:text-sm text-xs">
                      <span className="text-muted-foreground">Last Error:</span>
                      <p className="text-red-600 text-xs mt-1 break-words" title={service.lastError}>
                        {service.lastError}
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => checkSingleService(service.id)}
                  disabled={isChecking}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  aria-label={`Test ${service.name} service connection`}
                >
                  <RefreshCw className={`w-3 h-3 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
                  Test Service
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Error Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" id="logs-title">
              Service Error Logs
              <Badge variant="outline">{logs.length} entries</Badge>
            </CardTitle>
            <CardDescription>
              Detailed logs of service errors and health check results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="sm:h-96 h-64" role="region" aria-labelledby="logs-title">
              {logs.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No logs available. Run service checks to generate logs.
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {getServiceIcon(log.service)}
                          <span className="font-medium" aria-label={`Service: ${log.service}`}>{log.service}</span>
                          <Badge 
                            variant={log.level === 'error' ? 'destructive' : 
                                   log.level === 'warning' ? 'secondary' : 'default'}
                            aria-label={`Log level: ${log.level}`}
                          >
                            {log.level}
                          </Badge>
                        </div>
                        <time className="sm:text-sm text-xs text-muted-foreground" dateTime={log.timestamp}>
                          {new Date(log.timestamp).toLocaleString()}
                        </time>
                      </div>
                      <p className="sm:text-sm text-xs break-words">{log.message}</p>
                      {log.details && (
                        <details className="text-xs" aria-label="Log details">
                          <summary className="cursor-pointer text-muted-foreground" aria-expanded="false">
                            Show details
                          </summary>
                          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto whitespace-pre-wrap break-all" role="region" aria-label="Detailed log information">
                            {typeof log.details === 'string' 
                              ? log.details 
                              : JSON.stringify(log.details, null, 2)
                            }
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Status;