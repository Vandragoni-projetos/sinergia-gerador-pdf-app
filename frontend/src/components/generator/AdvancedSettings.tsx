import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, QrCode, Maximize } from "lucide-react";
import { UploadFile } from "@/integrations/Core";

export default function AdvancedSettings({ project, updateProject }) {
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const { file_url } = await UploadFile({ file });
      updateProject({ logo_url: file_url });
    } catch (error) {
      console.error("Error uploading logo:", error);
    }
    setUploadingLogo(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Logo Upload */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <ImageIcon className="w-5 h-5 text-amber-400" />
          <h3 className="text-white font-semibold text-lg">Logomarca</h3>
        </div>
        
        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
            id="logo-upload"
          />
          
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('logo-upload')?.click()}
              disabled={uploadingLogo}
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploadingLogo ? "Enviando..." : "Selecionar Logo"}
            </Button>
            
            {project.logo_url && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Logo carregada
              </div>
            )}
          </div>
          
          {project.logo_url && (
            <div className="w-32 h-32 border border-gray-600 rounded-lg overflow-hidden">
              <img
                src={project.logo_url}
                alt="Logo preview"
                className="w-full h-full object-contain bg-gray-800"
              />
            </div>
          )}
        </div>
      </div>

      {/* QR Code Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <QrCode className="w-5 h-5 text-amber-400" />
          <h3 className="text-white font-semibold text-lg">QR Code para Contracapa</h3>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Link para QR Code</Label>
          <Input
            value={project.qr_link}
            onChange={(e) => updateProject({ qr_link: e.target.value })}
            placeholder="https://seusite.com"
            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500"
          />
          <p className="text-xs text-gray-500">
            Este link será convertido em QR Code na contracapa
          </p>
        </div>
      </div>

      {/* Page Fill Option */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Maximize className="w-5 h-5 text-amber-400" />
          <h3 className="text-white font-semibold text-lg">Opções de Layout</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="fill_full_page"
            checked={project.fill_full_page}
            onCheckedChange={(checked) => updateProject({ fill_full_page: checked })}
            className="border-gray-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
          />
          <Label htmlFor="fill_full_page" className="text-gray-300">
            Preencher totalmente a página (sem margens)
          </Label>
        </div>
        
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-400 text-sm">
            <strong>Dica:</strong> Ative esta opção para que as imagens ocupem 100% da página. 
            Desative para manter margens de respiro ao redor das imagens.
          </p>
        </div>
      </div>

      {/* Advanced Tips */}
      <div className="p-4 bg-gray-800/30 border border-gray-600 rounded-lg">
        <h4 className="text-white font-medium mb-3">💡 Dicas Avançadas</h4>
        <ul className="text-gray-300 text-sm space-y-2">
          <li>• A logomarca aparecerá no canto inferior direito de cada página</li>
          <li>• Use imagens PNG para logos com fundo transparente</li>
          <li>• O QR Code será gerado automaticamente na contracapa</li>
          <li>• Recomendamos logos com resolução mínima de 200x200px</li>
        </ul>
      </div>
    </motion.div>
  );
}