import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { FileText, Type, Hash } from "lucide-react";

const PAGE_FORMATS = [
  { value: "A4", label: "A4 (210x297mm)", description: "Formato padrão internacional" },
  { value: "LETTER", label: "Carta (216x279mm)", description: "Formato americano" },
  { value: "AMAZON", label: "Amazon (215,9x279,4mm)", description: "Ideal para publicação Amazon" },
  { value: "SQUARE", label: "Quadrado (210x210mm)", description: "Formato quadrado único" },
  { value: "A5-V", label: "A5 Vertical (148x210mm)", description: "Formato compacto vertical" },
  { value: "A5-H", label: "A5 Horizontal (210x148mm)", description: "Formato compacto horizontal" },
  { value: "A4-2A5H", label: "A4 - 2x A5H", description: "Duas imagens por página" }
];

const FONTS = [
  "Arial", "Courier", "Helvetica", "Times"
];

export default function FormatSettings({ project, updateProject }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Page Format */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-amber-400" />
          <h3 className="text-white font-semibold text-lg">Formato da Página</h3>
        </div>
        
        <Select value={project.page_format} onValueChange={(value) => updateProject({ page_format: value })}>
          <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
            <SelectValue placeholder="Selecione o formato" />
          </SelectTrigger>
          <SelectContent>
            {PAGE_FORMATS.map((format) => (
              <SelectItem key={format.value} value={format.value}>
                <div>
                  <div className="font-medium">{format.label}</div>
                  <div className="text-xs text-gray-500">{format.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Header Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Type className="w-5 h-5 text-amber-400" />
          <h3 className="text-white font-semibold text-lg">Cabeçalho</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label className="text-gray-300">Texto do Cabeçalho</Label>
            <Input
              value={project.header_text}
              onChange={(e) => updateProject({ header_text: e.target.value })}
              placeholder="Ex: Meu Livro de Colorir"
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-300">Fonte</Label>
            <Select value={project.header_font} onValueChange={(value) => updateProject({ header_font: value })}>
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONTS.map((font) => (
                  <SelectItem key={font} value={font}>{font}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="w-32">
          <Label className="text-gray-300">Tamanho</Label>
          <Input
            type="number"
            value={project.header_size}
            onChange={(e) => updateProject({ header_size: parseInt(e.target.value) })}
            min="8"
            max="24"
            className="bg-gray-800/50 border-gray-600 text-white focus:border-amber-500"
          />
        </div>
      </div>

      {/* Footer Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Hash className="w-5 h-5 text-amber-400" />
          <h3 className="text-white font-semibold text-lg">Rodapé</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label className="text-gray-300">Texto do Rodapé</Label>
            <Input
              value={project.footer_text}
              onChange={(e) => updateProject({ footer_text: e.target.value })}
              placeholder="Ex: © 2024 Minha Editora"
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-300">Fonte</Label>
            <Select value={project.footer_font} onValueChange={(value) => updateProject({ footer_font: value })}>
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONTS.map((font) => (
                  <SelectItem key={font} value={font}>{font}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="w-32">
            <Label className="text-gray-300">Tamanho</Label>
            <Input
              type="number"
              value={project.footer_size}
              onChange={(e) => updateProject({ footer_size: parseInt(e.target.value) })}
              min="6"
              max="18"
              className="bg-gray-800/50 border-gray-600 text-white focus:border-amber-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="page_marker"
              checked={project.include_page_marker}
              onCheckedChange={(checked) => updateProject({ include_page_marker: checked })}
              className="border-gray-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
            />
            <Label htmlFor="page_marker" className="text-gray-300">
              Incluir "Página X de Y"
            </Label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}