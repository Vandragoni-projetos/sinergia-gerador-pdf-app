import React from "react";

class APIService {
  constructor(baseURL = "https://sinergia-pdf-api.onrender.com") {
    this.baseURL = baseURL;
  }

  // Função para testar conectividade da API
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  // Função para gerar PDF via API
  async generatePDF(projectData, action = 'generate_pdf') {
    const formData = new FormData();
    
    // Mapear dados do projeto para FormData
    formData.append('filename', projectData.filename || 'livro');
    formData.append('pageFormat', projectData.page_format || 'A4');
    formData.append('action', action);
    
    // Cabeçalho e rodapé
    formData.append('headerText', projectData.header_text || '');
    formData.append('headerFont', projectData.header_font || 'Arial');
    formData.append('headerSize', (projectData.header_size || 12).toString());
    formData.append('footerText', projectData.footer_text || '');
    formData.append('footerFont', projectData.footer_font || 'Arial');
    formData.append('footerSize', (projectData.footer_size || 10).toString());
    
    // Opções
    formData.append('insertPageMarker', projectData.include_page_marker ? 'true' : 'false');
    formData.append('fillFullPage', projectData.fill_full_page ? 'true' : 'false');
    formData.append('qrLink', projectData.qr_link || '');
    
    // URLs das imagens
    if (projectData.uploaded_files?.length > 0) {
      projectData.uploaded_files.forEach((file) => {
        formData.append('imageUrls', file.url);
      });
    }
    
    // Logo URL
    if (projectData.logo_url) {
      formData.append('logoUrl', projectData.logo_url);
    }

    try {
      const response = await fetch(`${this.baseURL}/gerar-pdf`, {
        method: 'POST',
        body: formData,
        headers: {
          // Não definir Content-Type para FormData - o browser faz isso automaticamente
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      // Verificar se a resposta é realmente um PDF
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('pdf')) {
        throw new Error('Resposta da API não é um PDF válido');
      }

      return await response.blob();
    } catch (error) {
      console.error('Erro na chamada da API:', error);
      throw error;
    }
  }

  // Função específica para gerar capa
  async generateCover(projectData) {
    return this.generatePDF(projectData, 'generate_cover');
  }

  // Função específica para gerar contracapa
  async generateBackcover(projectData) {
    return this.generatePDF(projectData, 'generate_backcover');
  }

  // Função específica para unificar PDFs
  async unifyPDFs(projectData) {
    return this.generatePDF(projectData, 'merge_pdfs');
  }
}

// Instância singleton do serviço
export const apiService = new APIService();

// Hook para usar o serviço de API
export const useAPIService = () => {
  const [isOnline, setIsOnline] = React.useState(true);
  const [lastCheck, setLastCheck] = React.useState(null);

  const checkAPIHealth = React.useCallback(async () => {
    const online = await apiService.testConnection();
    setIsOnline(online);
    setLastCheck(new Date());
    return online;
  }, []);

  React.useEffect(() => {
    checkAPIHealth();
    
    // Verificar saúde da API a cada 5 minutos
    const interval = setInterval(checkAPIHealth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkAPIHealth]);

  return {
    apiService,
    isOnline,
    lastCheck,
    checkHealth: checkAPIHealth
  };
};

export default APIService;