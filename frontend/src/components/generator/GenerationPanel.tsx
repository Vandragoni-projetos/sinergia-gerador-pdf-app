import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  Download,
  Sparkles,
  Loader2,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Info,
  Wifi,
  WifiOff,
  RefreshCw
} from "lucide-react";

const API_BASE_URL = "https://sinergia-pdf-api.onrender.com";

export default function GenerationPanel({ 
  project, 
  isGenerating, 
  setIsGenerating, 
  onProjectUpdate 
}) {
  
  const [selectedDirectory, setSelectedDirectory] = useState("");
  const [lastGenerated, setLastGenerated] = useState(null);
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [isInIframe, setIsInIframe] = useState(false);
  const [apiStatus, setApiStatus] = useState({ online: true, lastCheck: null, error: null });
  const [retryCount, setRetryCount] = useState(0);

  // Detectar se está rodando em iframe
  React.useEffect(() => {
    try {
      setIsInIframe(window !== window.top);
    } catch (e) {
      setIsInIframe(true);
    }
  }, []);

  // Função para testar conectividade da API
  const testAPIConnection = async () => {
    try {
      setApiStatus(prev => ({ ...prev, checking: true }));
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      const isOnline = response.ok;
      setApiStatus({
        online: isOnline,
        lastCheck: new Date(),
        error: isOnline ? null : `Status: ${response.status}`,
        checking: false
      });
      
      return isOnline;
    } catch (error) {
      console.error('API health check failed:', error);
      setApiStatus({
        online: false,
        lastCheck: new Date(),
        error: error.message,
        checking: false
      });
      return false;
    }
  };

  // Testar API ao carregar componente
  React.useEffect(() => {
    testAPIConnection();
  }, []);

  // Função para tentar selecionar pasta (com fallback)
  const selectDownloadDirectory = async () => {
    try {
      if ('showDirectoryPicker' in window && !isInIframe) {
        const handle = await window.showDirectoryPicker();
        setSelectedDirectory(handle.name);
        localStorage.setItem('sinergia_preferred_dir', handle.name);
        return handle;
      } else {
        const userDir = prompt(
          "Digite o nome da pasta onde deseja organizar seus PDFs:",
          selectedDirectory || "Meus Livros de Colorir"
        );
        
        if (userDir && userDir.trim()) {
          setSelectedDirectory(userDir.trim());
          localStorage.setItem('sinergia_preferred_dir', userDir.trim());
        }
        return null;
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Erro ao selecionar pasta:', error);
      }
      return null;
    }
  };

  // Função para criar FormData com validação
  const createFormData = (type) => {
    const formData = new FormData();
    
    const actionMap = {
      interior: 'generate_pdf',
      cover: 'generate_cover', 
      backcover: 'generate_backcover',
      unified: 'merge_pdfs'
    };

    // Dados básicos (sempre obrigatórios)
    formData.append('filename', project.filename || 'livro');
    formData.append('pageFormat', project.page_format || 'A4');
    formData.append('action', actionMap[type] || 'generate_pdf');
    
    // Cabeçalho e rodapé
    formData.append('headerText', project.header_text || '');
    formData.append('headerFont', project.header_font || 'Arial');
    formData.append('headerSize', (project.header_size || 12).toString());
    formData.append('footerText', project.footer_text || '');
    formData.append('footerFont', project.footer_font || 'Arial');
    formData.append('footerSize', (project.footer_size || 10).toString());
    
    // Opções booleanas
    formData.append('insertPageMarker', project.include_page_marker ? 'true' : 'false');
    formData.append('fillFullPage', project.fill_full_page ? 'true' : 'false');
    formData.append('qrLink', project.qr_link || 'https://sinergiahub.com');
    
    // URLs das imagens (crítico para funcionamento)
    if (project.uploaded_files?.length > 0) {
      project.uploaded_files.forEach((file, index) => {
        formData.append('imageUrls', file.url);
        console.log(`Imagem ${index + 1}: ${file.url}`);
      });
    }
    
    // Logo URL (opcional)
    if (project.logo_url) {
      formData.append('logoUrl', project.logo_url);
    }
    
    return formData;
  };

  // Função para fazer requisição com retry
  const fetchWithRetry = async (url, options, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Tentativa ${attempt}/${maxRetries} para ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
        
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            ...options.headers,
            'Accept': 'application/pdf, application/json',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        return response;
      } catch (error) {
        console.error(`Tentativa ${attempt} falhou:`, error);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Aguardar antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  };

  // Função para download com nome personalizado
  const downloadPDF = (blob, filename) => {
    try {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      return true;
    } catch (error) {
      console.error('Erro no download:', error);
      return false;
    }
  };

  // Função principal para gerar e baixar PDF
  const generateAndDownloadPDF = async (type) => {
    // Validações básicas
    if (!project.project_name || !project.filename) {
      alert("❌ Campos obrigatórios:\n• Nome do projeto\n• Nome do arquivo PDF");
      return;
    }

    if (!project.uploaded_files?.length && type !== "backcover") {
      alert("❌ Por favor, faça upload de pelo menos uma imagem para gerar o PDF.");
      return;
    }

    // Verificar se a API está online
    const isAPIOnline = await testAPIConnection();
    if (!isAPIOnline) {
      const tryAnyway = confirm(
        `⚠️ A API parece estar offline ou inacessível.\n\nErro: ${apiStatus.error}\n\nDeseja tentar mesmo assim?`
      );
      if (!tryAnyway) return;
    }

    setIsGenerating(true);
    setRetryCount(0);
    
    try {
      console.log(`🚀 Iniciando geração de ${type} para projeto: ${project.project_name}`);
      
      const formData = createFormData(type);
      
      // Log dos dados sendo enviados
      console.log('📋 Dados enviados para API:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
      }

      // Fazer requisição com retry
      const response = await fetchWithRetry(`${API_BASE_URL}/gerar-pdf`, {
        method: 'POST',
        body: formData
      }, 3);

      console.log('✅ Resposta recebida da API:', {
        status: response.status,
        contentType: response.headers.get('content-type'),
        size: response.headers.get('content-length')
      });

      // Obter o blob da resposta
      const blob = await response.blob();
      
      // Validação do PDF recebido
      if (blob.size < 100) {
        throw new Error('PDF recebido está muito pequeno (possivelmente vazio)');
      }

      if (!blob.type.includes('pdf') && blob.size < 10000) {
        // Tentar ler como texto para ver se é uma mensagem de erro
        const text = await blob.text();
        throw new Error(`Resposta inválida da API: ${text.substring(0, 200)}...`);
      }

      // Nome do arquivo com timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const filename = `${project.filename}_${type}_${timestamp}.pdf`;
      
      console.log(`📥 Iniciando download: ${filename} (${(blob.size / 1024 / 1024).toFixed(2)} MB)`);
      
      // Fazer download
      const downloadSuccess = downloadPDF(blob, filename);
      
      if (!downloadSuccess) {
        throw new Error('Falha ao iniciar download do arquivo');
      }

      // Sucesso! Atualizar histórico
      const downloadInfo = {
        type,
        filename,
        timestamp: new Date().toISOString(),
        size: blob.size,
        savedLocation: selectedDirectory || "Downloads padrão"
      };

      setDownloadHistory(prev => [downloadInfo, ...prev.slice(0, 9)]);
      setLastGenerated(downloadInfo);

      // Atualizar projeto
      const generatedPdf = {
        type: type,
        filename: filename,
        generated_at: downloadInfo.timestamp,
        downloaded: true,
        size: blob.size
      };

      onProjectUpdate({
        generated_pdfs: [...(project.generated_pdfs || []), generatedPdf],
        status: "completed"
      });

      console.log('🎉 PDF gerado e baixado com sucesso!');

    } catch (error) {
      console.error(`❌ Erro completo ao gerar ${type}:`, error);
      
      let errorMessage = "Erro desconhecido ao gerar PDF";
      let suggestions = [];

      if (error.name === 'AbortError') {
        errorMessage = "Timeout na requisição - A API demorou muito para responder";
        suggestions.push("Verifique sua conexão com a internet");
        suggestions.push("Tente novamente em alguns minutos");
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = "Não foi possível conectar com a API";
        suggestions.push("Verifique se a API está online");
        suggestions.push("Verifique sua conexão com a internet");
        suggestions.push("Tente usar uma rede diferente");
      } else if (error.message.includes('HTTP')) {
        errorMessage = `Erro do servidor: ${error.message}`;
        suggestions.push("Verifique se todos os campos estão preenchidos");
        suggestions.push("Verifique se as imagens foram carregadas corretamente");
      } else {
        errorMessage = error.message;
      }

      const fullMessage = `❌ ${errorMessage}\n\n💡 Sugestões:\n${suggestions.map(s => `• ${s}`).join('\n')}`;
      alert(fullMessage);

      // Atualizar status da API como offline
      setApiStatus(prev => ({ ...prev, online: false, error: error.message }));
    }
    
    setIsGenerating(false);
  };

  // Carregar preferências salvas
  React.useEffect(() => {
    const savedDir = localStorage.getItem('sinergia_preferred_dir');
    if (savedDir) {
      setSelectedDirectory(savedDir);
    }
  }, []);

  const canGenerate = project.project_name && project.filename;
  const hasFileSystemAPI = 'showDirectoryPicker' in window && !isInIframe;

  return (
    <Card className="bg-black/40 border-amber-500/20 backdrop-blur-xl shadow-2xl">
      <CardHeader className="border-b border-amber-500/20">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Gerar PDFs
          </div>
          
          {/* API Status Indicator */}
          <div className="flex items-center gap-2">
            {apiStatus.checking ? (
              <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={testAPIConnection}
                className="w-6 h-6 p-0"
              >
                {apiStatus.online ? (
                  <Wifi className="w-4 h-4 text-green-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-400" />
                )}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        {/* API Status Alert */}
        {!apiStatus.online && (
          <Alert className="border-red-500/30 bg-red-500/10">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <AlertDescription className="text-red-300">
              <div className="flex items-center justify-between">
                <div>
                  <strong>API Offline:</strong> {apiStatus.error}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={testAPIConnection}
                  className="text-red-400 hover:text-red-300"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Testar
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Directory Selection */}
        <div className="space-y-3">
          <Label className="text-gray-300 font-medium flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Organização dos Arquivos
          </Label>
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={selectedDirectory}
                placeholder="Nome da pasta para organização"
                onChange={(e) => setSelectedDirectory(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
              />
              <Button
                variant="outline"
                onClick={selectDownloadDirectory}
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 whitespace-nowrap"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                {hasFileSystemAPI ? 'Escolher' : 'Definir'}
              </Button>
            </div>
            
            {selectedDirectory && (
              <div className="flex items-center gap-2 text-amber-400 text-sm">
                <Info className="w-3 h-3" />
                Pasta sugerida: <strong>{selectedDirectory}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {lastGenerated && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-green-400 font-medium mb-1">
                    ✅ PDF Gerado com Sucesso!
                  </h4>
                  <p className="text-green-300 text-sm">
                    <strong>{lastGenerated.filename}</strong>
                  </p>
                  <p className="text-green-200 text-xs mt-1">
                    Tamanho: {(lastGenerated.size / 1024 / 1024).toFixed(2)} MB • 
                    {new Date(lastGenerated.timestamp).toLocaleString('pt-BR')}
                  </p>
                  {selectedDirectory && (
                    <p className="text-amber-300 text-xs mt-1">
                      💡 Sugestão: Organize o arquivo na pasta "{selectedDirectory}"
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generation Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => generateAndDownloadPDF("interior")}
            disabled={!canGenerate || isGenerating || !project.uploaded_files?.length}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium py-6 text-lg shadow-lg"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <BookOpen className="w-5 h-5 mr-2" />
            )}
            GERAR PDF (Miolo)
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => generateAndDownloadPDF("cover")}
              disabled={!canGenerate || isGenerating || !project.uploaded_files?.length}
              variant="outline"
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 py-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              CAPA
            </Button>

            <Button
              onClick={() => generateAndDownloadPDF("backcover")}
              disabled={!canGenerate || isGenerating}
              variant="outline"
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 py-4"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              CONTRACAPA
            </Button>
          </div>

          <Button
            onClick={() => generateAndDownloadPDF("unified")}
            disabled={!canGenerate || isGenerating || !project.generated_pdfs?.length}
            variant="outline"
            className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10 py-4"
          >
            <FileText className="w-4 h-4 mr-2" />
            UNIFICAR PDFs
          </Button>
        </div>

        {/* Download History */}
        {downloadHistory.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-400" />
              Histórico de Downloads ({downloadHistory.length})
            </h4>
            
            <div className="max-h-48 overflow-y-auto space-y-2">
              {downloadHistory.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-800/30 border border-gray-600 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="text-white text-sm font-medium truncate max-w-48">
                        {item.filename}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs">
                          {item.type}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {(item.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleTimeString('pt-BR')}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* API Status */}
        <div className="p-4 bg-gray-800/30 border border-gray-600 rounded-lg">
          <h5 className="text-white font-medium mb-2 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Status da Conexão
          </h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">API:</span>
              <span className={`${apiStatus.online ? 'text-green-400' : 'text-red-400'}`}>
                {apiStatus.online ? '🟢 Online' : '🔴 Offline'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Última verificação:</span>
              <span className="text-white text-xs">
                {apiStatus.lastCheck ? apiStatus.lastCheck.toLocaleTimeString('pt-BR') : 'Nunca'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Imagens carregadas:</span>
              <span className="text-white">{project.uploaded_files?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Usage Guide */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h5 className="text-blue-400 font-medium mb-2">🛠️ Solução de Problemas</h5>
          <div className="text-blue-300 text-sm space-y-2">
            <p><strong>Se der erro "Failed to fetch":</strong></p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Verifique sua conexão com internet</li>
              <li>Clique no ícone Wi-Fi para testar a API</li>
              <li>Aguarde alguns segundos e tente novamente</li>
              <li>Se persistir, a API pode estar temporariamente offline</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}