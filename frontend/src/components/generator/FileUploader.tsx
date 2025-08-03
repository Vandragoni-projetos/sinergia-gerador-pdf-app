import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileImage, X, FileText, AlertCircle } from "lucide-react";
import { UploadFile } from "@/integrations/Core";

export default function FileUploader({ project, updateProject }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith("image/") || file.type === "application/pdf"
    );

    if (droppedFiles.length > 0) {
      uploadFiles(droppedFiles);
    }
  }, []);

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(
      file => file.type.startsWith("image/") || file.type === "application/pdf"
    );

    if (selectedFiles.length > 0) {
      uploadFiles(selectedFiles);
    }
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedFiles = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(((i + 1) / files.length) * 100);
        
        const { file_url } = await UploadFile({ file });
        
        uploadedFiles.push({
          filename: file.name,
          url: file_url,
          type: file.type
        });
      }

      updateProject({
        uploaded_files: [...(project.uploaded_files || []), ...uploadedFiles]
      });
    } catch (error) {
      console.error("Error uploading files:", error);
    }

    setUploading(false);
    setUploadProgress(0);
  };

  const removeFile = (index) => {
    const newFiles = project.uploaded_files.filter((_, i) => i !== index);
    updateProject({ uploaded_files: newFiles });
  };

  return (
    <Card className="bg-black/40 border-amber-500/20 backdrop-blur-xl shadow-2xl">
      <CardHeader className="border-b border-amber-500/20">
        <CardTitle className="text-white flex items-center gap-3">
          <FileImage className="w-5 h-5 text-amber-400" />
          Arquivos do Projeto
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive 
              ? "border-amber-400 bg-amber-500/10" 
              : "border-gray-600 hover:border-gray-500"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />

          <div className="space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
              dragActive ? "bg-amber-500/20" : "bg-gray-700"
            }`}>
              <Upload className={`w-8 h-8 ${dragActive ? "text-amber-400" : "text-gray-400"}`} />
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-2">
                Arraste arquivos aqui ou clique para selecionar
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Suporta PNG, JPG, JPEG e PDF
              </p>
              
              <Button
                type="button"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={uploading}
                className="bg-amber-500 hover:bg-amber-600 text-black"
              >
                {uploading ? "Enviando..." : "Selecionar Arquivos"}
              </Button>
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Enviando arquivos...</span>
              <span className="text-amber-400 text-sm">{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2 bg-gray-700" />
          </motion.div>
        )}

        {/* Files List */}
        {project.uploaded_files?.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium">
                Arquivos Carregados ({project.uploaded_files.length})
              </h4>
            </div>
            
            <AnimatePresence>
              {project.uploaded_files.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center gap-3">
                    {file.type === "application/pdf" ? (
                      <FileText className="w-5 h-5 text-red-400" />
                    ) : (
                      <FileImage className="w-5 h-5 text-blue-400" />
                    )}
                    <div>
                      <p className="text-white text-sm font-medium">{file.filename}</p>
                      <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                        {file.type.split('/')[1]?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-blue-400 font-medium mb-1">Dicas de Upload</h5>
              <ul className="text-blue-300 text-sm space-y-1">
                <li>• Use imagens com resolução mínima de 300 DPI</li>
                <li>• Nomeie os arquivos como 001.png, 002.png para ordem correta</li>
                <li>• Imagens em preto e branco funcionam melhor para colorir</li>
                <li>• Arquivos PDF serão usados para unificação</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}