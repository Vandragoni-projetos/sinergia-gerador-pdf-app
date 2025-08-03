import { useState } from "react";
import  Header  from "@/components/Header";
import { FormTabs } from "@/components/FormTabs";
import { ActionButtons } from "@/components/ActionButtons";
import { HelpDialog } from "@/components/HelpDialog";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-image.jpg";

interface FormData {
  filename: string;
  files: File[];
  outputFolder: string;
  pageFormat: string;
  headerText: string;
  headerFont: string;
  headerSize: string;
  footerText: string;
  footerFont: string;
  footerSize: string;
  insertPageMarker: boolean;
  logoFile: File | null;
  qrLink: string;
  fillFullPage: boolean;
}

const Index = () => {
  const { toast } = useToast();
  const [helpOpen, setHelpOpen] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    filename: "",
    files: [],
    outputFolder: "Downloads",
    pageFormat: "A4",
    headerText: "",
    headerFont: "Arial",
    headerSize: "12",
    footerText: "",
    footerFont: "Arial",
    footerSize: "10",
    insertPageMarker: false,
    logoFile: null,
    qrLink: "",
    fillFullPage: false,
  });

  const handleGeneratePDF = async () => {
    try {
      // Aqui seria a integração com o backend
      console.log("Gerando PDF com dados:", formData);
      
      toast({
        title: "PDF Gerado!",
        description: `O arquivo "${formData.filename || 'livro-colorir'}.pdf" foi criado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateCover = async () => {
    try {
      console.log("Gerando capa com dados:", formData);
      
      toast({
        title: "Capa Gerada!",
        description: `A capa do livro "${formData.filename || 'livro-colorir'}" foi criada.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar a capa.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateBackCover = async () => {
    try {
      console.log("Gerando contracapa com dados:", formData);
      
      toast({
        title: "Contracapa Gerada!",
        description: "A contracapa com QR Code foi criada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar a contracapa.",
        variant: "destructive",
      });
    }
  };

  const handleClearFields = () => {
    setFormData({
      filename: "",
      files: [],
      outputFolder: "Downloads",
      pageFormat: "A4",
      headerText: "",
      headerFont: "Arial",
      headerSize: "12",
      footerText: "",
      footerFont: "Arial",
      footerSize: "10",
      insertPageMarker: false,
      logoFile: null,
      qrLink: "",
      fillFullPage: false,
    });
    
    toast({
      title: "Campos Limpos",
      description: "Todos os campos foram resetados.",
    });
  };

  const handleHelp = () => {
    setHelpOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 lg:p-12">
            <div className="absolute inset-0 opacity-10">
              <img 
                src={heroImage} 
                alt="SinergIA - Gerador de PDF" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative text-center space-y-6 text-white">
              <h1 className="text-4xl lg:text-6xl font-bold">
                SinergIA
              </h1>
              <p className="text-xl lg:text-2xl max-w-3xl mx-auto opacity-90">
                Crie livros de colorir profissionais em PDF de forma rápida e intuitiva
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm lg:text-base opacity-80">
                <span>✨ Interface moderna</span>
                <span>🎨 Múltiplos formatos</span>
                <span>📱 Totalmente responsivo</span>
                <span>🌙 Modo dia/noite</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-card rounded-xl shadow-elegant border p-6 lg:p-8 animate-fade-in">
            <FormTabs data={formData} onChange={setFormData} />
          </div>

          {/* Action Buttons */}
          <div className="bg-card rounded-xl shadow-elegant border p-6 animate-slide-up">
            <ActionButtons
              onGeneratePDF={handleGeneratePDF}
              onGenerateCover={handleGenerateCover}
              onGenerateBackCover={handleGenerateBackCover}
              onClearFields={handleClearFields}
              onHelp={handleHelp}
              disabled={formData.files.length === 0}
            />
          </div>

          {/* Status Info */}
          {formData.files.length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              {formData.files.length} arquivo(s) selecionado(s) • 
              Formato: {formData.pageFormat} • 
              Pronto para gerar
            </div>
          )}
        </div>
      </main>

      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
};

export default Index;
