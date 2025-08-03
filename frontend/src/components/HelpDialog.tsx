import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText, Image, BookOpen, Settings, Zap } from "lucide-react";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ajuda - SinergIA
          </DialogTitle>
          <DialogDescription>
            Guia completo para usar o gerador de PDF para livros de colorir
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Seção Básico */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <FileText className="h-5 w-5 text-sinergia-purple" />
                Configurações Básicas
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Nome do arquivo PDF:</strong> Define o nome do arquivo que será gerado. 
                  Não é necessário incluir a extensão .pdf.
                </div>
                <div>
                  <strong>Pasta de destino:</strong> Local onde o arquivo será salvo em seu computador.
                </div>
                <div>
                  <strong>Upload de imagens:</strong> Selecione as imagens que farão parte do livro de colorir. 
                  Aceita formatos PNG, JPG, JPEG e PDF. Você pode arrastar e soltar os arquivos ou clicar para selecionar.
                </div>
              </div>
            </div>

            <Separator />

            {/* Seção Formato */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Settings className="h-5 w-5 text-sinergia-blue" />
                Formato e Layout
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Formato da página:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• <strong>A4:</strong> Formato padrão internacional (210 x 297 mm)</li>
                    <li>• <strong>Carta:</strong> Formato americano (216 x 279 mm)</li>
                    <li>• <strong>Amazon:</strong> Formato otimizado para impressão Amazon (8.5 x 11 in)</li>
                    <li>• <strong>Quadrado:</strong> Formato quadrado (210 x 210 mm)</li>
                    <li>• <strong>A5 Vertical/Horizontal:</strong> Formato menor, ideal para livros compactos</li>
                    <li>• <strong>A4 com 2 imagens:</strong> Duas imagens por página no formato A4</li>
                  </ul>
                </div>
                <div>
                  <strong>Cabeçalho e Rodapé:</strong> Adicione texto personalizado no topo e rodapé de cada página. 
                  Escolha a fonte e tamanho adequados para seu projeto.
                </div>
                <div>
                  <strong>Marcador de página:</strong> Quando ativado, adiciona "Página X de Y" em cada página.
                </div>
              </div>
            </div>

            <Separator />

            {/* Seção Avançado */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Zap className="h-5 w-5 text-sinergia-green" />
                Configurações Avançadas
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>QR Code:</strong> Insira um link que será convertido em QR Code na contracapa. 
                  Útil para direcionar para seu site, redes sociais ou loja online.
                </div>
                <div>
                  <strong>Logomarca:</strong> Adicione sua marca nas páginas do livro. 
                  Recomendamos imagens em PNG com fundo transparente.
                </div>
                <div>
                  <strong>Preenchimento total:</strong> Quando ativado, a imagem da capa ocupará toda a página 
                  sem margens de respiro.
                </div>
              </div>
            </div>

            <Separator />

            {/* Seção Botões */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Image className="h-5 w-5 text-sinergia-orange" />
                Botões de Ação
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-sinergia-purple">GERAR PDF:</strong> Cria o livro de colorir completo 
                  com todas as imagens selecionadas e configurações aplicadas.
                </div>
                <div>
                  <strong className="text-sinergia-blue">GERAR CAPA:</strong> Cria apenas a capa do livro 
                  usando a primeira imagem da lista.
                </div>
                <div>
                  <strong className="text-sinergia-green">GERAR CONTRACAPA:</strong> Cria a contracapa 
                  com QR Code e informações adicionais.
                </div>
                <div>
                  <strong>LIMPAR CAMPOS:</strong> Reseta todos os campos para os valores padrão.
                </div>
              </div>
            </div>

            <Separator />

            {/* Dicas */}
            <div>
              <h3 className="text-lg font-semibold mb-3">💡 Dicas Importantes</h3>
              <div className="space-y-2 text-sm">
                <div>• Use imagens de alta qualidade (pelo menos 300 DPI) para melhor resultado na impressão</div>
                <div>• Imagens em formato PNG mantêm melhor qualidade que JPG</div>
                <div>• Para livros comerciais, considere usar o formato Amazon ou A4</div>
                <div>• Teste diferentes configurações de cabeçalho/rodapé antes da versão final</div>
                <div>• O QR Code é especialmente útil para livros digitais ou promocionais</div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}