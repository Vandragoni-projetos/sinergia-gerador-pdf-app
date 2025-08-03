import React, { useState } from "react";
import { PDFProject } from "@/entities/PDFProject";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, Download, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import BasicSettings from "../components/generator/BasicSettings";
import FormatSettings from "../components/generator/FormatSettings";
import AdvancedSettings from "../components/generator/AdvancedSettings";
import FileUploader from "../components/generator/FileUploader";
import GenerationPanel from "../components/generator/GenerationPanel";
import DownloadManager from "../components/generator/DownloadManager"; // Added import

export default function Generator() {
  const [currentProject, setCurrentProject] = useState({
    project_name: "",
    filename: "",
    page_format: "A4",
    header_text: "",
    header_font: "Arial",
    header_size: 12,
    footer_text: "",
    footer_font: "Arial",
    footer_size: 10,
    include_page_marker: false,
    logo_url: "",
    qr_link: "https://sinergiahub.com",
    fill_full_page: false,
    uploaded_files: [],
    status: "draft"
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [isGenerating, setIsGenerating] = useState(false);

  const updateProject = (updates) => {
    setCurrentProject(prev => ({ ...prev, ...updates }));
  };

  const saveProject = async () => {
    try {
      if (currentProject.id) {
        await PDFProject.update(currentProject.id, currentProject);
      } else {
        const saved = await PDFProject.create(currentProject);
        setCurrentProject(prev => ({ ...prev, id: saved.id }));
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const clearProject = () => {
    setCurrentProject({
      project_name: "",
      filename: "",
      page_format: "A4",
      header_text: "",
      header_font: "Arial",
      header_size: 12,
      footer_text: "",
      footer_font: "Arial",
      footer_size: 10,
      include_page_marker: false,
      logo_url: "",
      qr_link: "https://sinergiahub.com",
      fill_full_page: false,
      uploaded_files: [],
      status: "draft"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Sparkles className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Gerador de PDF
              </h1>
              <p className="text-gray-400 text-lg">Crie livros de colorir profissionais</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={clearProject}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar
            </Button>
            <Button
              onClick={saveProject}
              className="bg-amber-500 hover:bg-amber-600 text-black font-medium"
            >
              <FileText className="w-4 h-4 mr-2" />
              Salvar Projeto
            </Button>
          </div>
        </motion.div>

        {/* Project Status */}
        {currentProject.project_name && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card className="bg-black/40 border-amber-500/20 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{currentProject.project_name}</h3>
                    <p className="text-gray-400 text-sm">{currentProject.filename || "Sem nome definido"}.pdf</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline"
                      className="border-amber-500/30 text-amber-400"
                    >
                      {currentProject.uploaded_files?.length || 0} arquivos
                    </Badge>
                    <Badge 
                      variant="outline"
                      className="border-green-500/30 text-green-400"
                    >
                      {currentProject.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <Card className="bg-black/40 border-amber-500/20 backdrop-blur-xl shadow-2xl">
              <CardHeader className="border-b border-amber-500/20">
                <CardTitle className="text-white text-xl flex items-center gap-3">
                  <FileText className="w-6 h-6 text-amber-400" />
                  Configurações do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 rounded-none border-b border-amber-500/20">
                    <TabsTrigger 
                      value="basic"
                      className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 text-gray-400"
                    >
                      Básico
                    </TabsTrigger>
                    <TabsTrigger 
                      value="format"
                      className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 text-gray-400"
                    >
                      Formato
                    </TabsTrigger>
                    <TabsTrigger 
                      value="advanced"
                      className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 text-gray-400"
                    >
                      Avançado
                    </TabsTrigger>
                  </TabsList>

                  <div className="p-6">
                    <TabsContent value="basic" className="mt-0">
                      <BasicSettings project={currentProject} updateProject={updateProject} />
                    </TabsContent>

                    <TabsContent value="format" className="mt-0">
                      <FormatSettings project={currentProject} updateProject={updateProject} />
                    </TabsContent>

                    <TabsContent value="advanced" className="mt-0">
                      <AdvancedSettings project={currentProject} updateProject={updateProject} />
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            <FileUploader project={currentProject} updateProject={updateProject} />
            <GenerationPanel 
              project={currentProject} 
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              onProjectUpdate={updateProject}
            />
          </div>
        </div>
      </div>

      {/* Download Manager - Fixed Position */}
      <DownloadManager />
    </div>
  );
}