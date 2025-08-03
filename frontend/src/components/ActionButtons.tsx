import { Button } from "@/components/ui/button";
import { FileText, Image, BookOpen, RotateCcw, HelpCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ActionButtonsProps {
  onGeneratePDF: () => void;
  onGenerateCover: () => void;
  onGenerateBackCover: () => void;
  onClearFields: () => void;
  onHelp: () => void;
  disabled?: boolean;
}

export function ActionButtons({
  onGeneratePDF,
  onGenerateCover,
  onGenerateBackCover,
  onClearFields,
  onHelp,
  disabled = false
}: ActionButtonsProps) {
  const { toast } = useToast();

  const handleAction = (action: () => void, message: string) => {
    if (disabled) {
      toast({
        title: "Ação indisponível",
        description: "Adicione pelo menos uma imagem para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    action();
    toast({
      title: "Processando...",
      description: message,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Button
        variant="gradient"
        size="lg"
        onClick={() => handleAction(onGeneratePDF, "Gerando PDF do livro de colorir...")}
        className="w-full"
        disabled={disabled}
      >
        <FileText className="h-5 w-5" />
        GERAR PDF
      </Button>

      <Button
        variant="blue"
        size="lg"
        onClick={() => handleAction(onGenerateCover, "Gerando capa do livro...")}
        className="w-full"
        disabled={disabled}
      >
        <Image className="h-5 w-5" />
        GERAR CAPA
      </Button>

      <Button
        variant="green"
        size="lg"
        onClick={() => handleAction(onGenerateBackCover, "Gerando contracapa...")}
        className="w-full"
        disabled={disabled}
      >
        <BookOpen className="h-5 w-5" />
        GERAR CONTRACAPA
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={onClearFields}
        className="w-full"
      >
        <RotateCcw className="h-5 w-5" />
        LIMPAR CAMPOS
      </Button>

      <Button
        variant="ghost"
        size="lg"
        onClick={onHelp}
        className="w-full"
      >
        <HelpCircle className="h-5 w-5" />
        AJUDA
      </Button>
    </div>
  );
}