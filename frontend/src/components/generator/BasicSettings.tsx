import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export default function BasicSettings({ project, updateProject }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="project_name" className="text-gray-300 font-medium">
            Nome do Projeto *
          </Label>
          <Input
            id="project_name"
            value={project.project_name}
            onChange={(e) => updateProject({ project_name: e.target.value })}
            placeholder="Ex: Livro de Animais"
            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:ring-amber-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="filename" className="text-gray-300 font-medium">
            Nome do Arquivo PDF *
          </Label>
          <Input
            id="filename"
            value={project.filename}
            onChange={(e) => updateProject({ filename: e.target.value })}
            placeholder="Ex: livro-animais"
            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:ring-amber-500"
          />
          <p className="text-xs text-gray-500">Será salvo como {project.filename || "nome"}.pdf</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300 font-medium">Descrição do Projeto</Label>
        <Textarea
          value={project.description || ""}
          onChange={(e) => updateProject({ description: e.target.value })}
          placeholder="Descreva brevemente o seu projeto..."
          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:ring-amber-500 min-h-[100px]"
        />
      </div>

      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <h4 className="text-amber-400 font-medium mb-2">📋 Próximos Passos</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Configure o formato das páginas na aba "Formato"</li>
          <li>• Adicione logomarca e QR code na aba "Avançado"</li>
          <li>• Faça upload das imagens no painel lateral</li>
          <li>• Clique em "Gerar PDF" para criar o livro</li>
        </ul>
      </div>
    </motion.div>
  );
}