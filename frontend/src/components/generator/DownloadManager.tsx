import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, CheckCircle, AlertCircle, X } from "lucide-react";

export default function DownloadManager() {
  const [downloads, setDownloads] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // Função para adicionar um novo download à lista
  const addDownload = (downloadInfo) => {
    const newDownload = {
      id: Date.now(),
      filename: downloadInfo.filename,
      type: downloadInfo.type,
      status: 'downloading', // downloading, completed, error
      progress: 0,
      startTime: new Date()
    };
    
    setDownloads(prev => [...prev, newDownload]);
    setIsVisible(true);
    
    return newDownload.id;
  };

  // Função para atualizar o progresso do download
  const updateDownloadProgress = (id, progress) => {
    setDownloads(prev => prev.map(download => 
      download.id === id 
        ? { ...download, progress: progress }
        : download
    ));
  };

  // Função para finalizar download
  const completeDownload = (id, success = true) => {
    setDownloads(prev => prev.map(download => 
      download.id === id 
        ? { 
            ...download, 
            status: success ? 'completed' : 'error',
            progress: success ? 100 : download.progress,
            endTime: new Date()
          }
        : download
    ));
    
    // Auto-hide após alguns segundos se todos estiverem completos
    setTimeout(() => {
      setDownloads(prev => {
        const activeDownloads = prev.filter(d => d.status === 'downloading');
        if (activeDownloads.length === 0) {
          setIsVisible(false);
          return prev.filter(d => d.status !== 'completed');
        }
        return prev;
      });
    }, 3000);
  };

  // Função para remover download da lista
  const removeDownload = (id) => {
    setDownloads(prev => prev.filter(download => download.id !== id));
    if (downloads.length <= 1) {
      setIsVisible(false);
    }
  };

  // Função para processar download de PDF
  const processPDFDownload = async (pdfBlob, filename, type) => {
    const downloadId = addDownload({ filename, type });
    
    try {
      // Simular progresso do download
      for (let i = 0; i <= 100; i += 10) {
        updateDownloadProgress(downloadId, i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Criar e executar download
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = `${filename}_${type}.pdf`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      completeDownload(downloadId, true);
      
    } catch (error) {
      console.error('Erro no download:', error);
      completeDownload(downloadId, false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'downloading': return <Download className="w-4 h-4 text-blue-400 animate-bounce" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'downloading': return 'Baixando...';
      case 'completed': return 'Concluído';
      case 'error': return 'Erro';
      default: return 'Aguardando';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'downloading': return 'border-blue-500/30 text-blue-400';
      case 'completed': return 'border-green-500/30 text-green-400';
      case 'error': return 'border-red-500/30 text-red-400';
      default: return 'border-gray-500/30 text-gray-400';
    }
  };

  // Expor função para componentes externos
  useEffect(() => {
    window.downloadManager = {
      processPDFDownload
    };
    
    return () => {
      delete window.downloadManager;
    };
  }, []);

  if (!isVisible || downloads.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: 50 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 50, x: 50 }}
      className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]"
    >
      <Card className="bg-black/90 border-amber-500/20 backdrop-blur-xl shadow-2xl">
        <CardHeader className="pb-3 border-b border-amber-500/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Download className="w-5 h-5 text-amber-400" />
              Downloads
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white w-6 h-6"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {downloads.map((download) => (
              <motion.div
                key={download.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 last:mb-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getStatusIcon(download.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {download.filename}_{download.type}.pdf
                      </p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(download.status)}`}
                      >
                        {getStatusText(download.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  {download.status !== 'downloading' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDownload(download.id)}
                      className="text-gray-400 hover:text-red-400 w-6 h-6 ml-2"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                
                {download.status === 'downloading' && (
                  <div className="space-y-1">
                    <Progress 
                      value={download.progress} 
                      className="h-1 bg-gray-700"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{download.progress}%</span>
                      <span>
                        {download.progress < 100 ? 'Processando...' : 'Finalizando...'}
                      </span>
                    </div>
                  </div>
                )}
                
                {download.status === 'completed' && download.endTime && (
                  <p className="text-xs text-green-400 mt-1">
                    Baixado às {download.endTime.toLocaleTimeString('pt-BR')}
                  </p>
                )}
                
                {download.status === 'error' && (
                  <p className="text-xs text-red-400 mt-1">
                    Falha no download. Tente novamente.
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}