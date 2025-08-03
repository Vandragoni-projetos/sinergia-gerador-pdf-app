import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "./FileUpload";
import { Settings, FileText, Zap } from "lucide-react";

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

interface FormTabsProps {
  data: FormData;
  onChange: (data: FormData) => void;
}

export function FormTabs({ data, onChange }: FormTabsProps) {
  const updateData = (field: keyof FormData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const pageFormats = [
    { value: "A4", label: "A4 (210 x 297 mm)" },
    { value: "Carta", label: "Carta (216 x 279 mm)" },
    { value: "Amazon", label: "Amazon (8.5 x 11 in)" },
    { value: "Quadrado", label: "Quadrado (210 x 210 mm)" },
    { value: "A5V", label: "A5 Vertical (148 x 210 mm)" },
    { value: "A5H", label: "A5 Horizontal (210 x 148 mm)" },
    { value: "A4-2A5H", label: "A4 com 2 imagens por página" },
  ];

  const fonts = [
    { value: "Arial", label: "Arial" },
    { value: "Times", label: "Times New Roman" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Courier", label: "Courier New" },
  ];

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="basic" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Básico
        </TabsTrigger>
        <TabsTrigger value="format" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Formato
        </TabsTrigger>
        <TabsTrigger value="advanced" className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Avançado
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Básicas</CardTitle>
            <CardDescription>
              Configure o nome do arquivo e selecione as imagens para o livro de colorir
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filename">Nome do arquivo PDF</Label>
                <Input
                  id="filename"
                  placeholder="Meu livro de colorir"
                  value={data.filename}
                  onChange={(e) => updateData('filename', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outputFolder">Pasta de destino</Label>
                <Input
                  id="outputFolder"
                  placeholder="Downloads"
                  value={data.outputFolder}
                  onChange={(e) => updateData('outputFolder', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Upload de imagens</Label>
              <FileUpload
                files={data.files}
                onFilesChange={(files) => updateData('files', files)}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="format" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Formato e Layout</CardTitle>
            <CardDescription>
              Configure o tamanho da página, cabeçalho e rodapé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Formato da página</Label>
              <Select value={data.pageFormat} onValueChange={(value) => updateData('pageFormat', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  {pageFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Cabeçalho</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="headerText">Texto do cabeçalho</Label>
                    <Input
                      id="headerText"
                      placeholder="Título do livro"
                      value={data.headerText}
                      onChange={(e) => updateData('headerText', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Fonte</Label>
                      <Select value={data.headerFont} onValueChange={(value) => updateData('headerFont', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fonts.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="headerSize">Tamanho</Label>
                      <Input
                        id="headerSize"
                        type="number"
                        placeholder="12"
                        value={data.headerSize}
                        onChange={(e) => updateData('headerSize', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Rodapé</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="footerText">Texto do rodapé</Label>
                    <Input
                      id="footerText"
                      placeholder="© 2024 - Meu livro"
                      value={data.footerText}
                      onChange={(e) => updateData('footerText', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Fonte</Label>
                      <Select value={data.footerFont} onValueChange={(value) => updateData('footerFont', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fonts.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="footerSize">Tamanho</Label>
                      <Input
                        id="footerSize"
                        type="number"
                        placeholder="10"
                        value={data.footerSize}
                        onChange={(e) => updateData('footerSize', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pageMarker"
                checked={data.insertPageMarker}
                onCheckedChange={(checked) => updateData('insertPageMarker', checked)}
              />
              <Label htmlFor="pageMarker">
                Incluir marcador "Página X de Y"
              </Label>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Avançadas</CardTitle>
            <CardDescription>
              QR Code, logomarca e opções especiais de formatação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qrLink">Link para QR Code (contracapa)</Label>
                <Input
                  id="qrLink"
                  type="url"
                  placeholder="https://meusite.com"
                  value={data.qrLink}
                  onChange={(e) => updateData('qrLink', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Logomarca</Label>
                <FileUpload
                  files={data.logoFile ? [data.logoFile] : []}
                  onFilesChange={(files) => updateData('logoFile', files[0] || null)}
                  multiple={false}
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fillFullPage"
                  checked={data.fillFullPage}
                  onCheckedChange={(checked) => updateData('fillFullPage', checked)}
                />
                <Label htmlFor="fillFullPage">
                  Preencher totalmente a página (capa)
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}