import React, { useState, useEffect } from "react";
import { PDFProject } from "@/entities/PDFProject";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  FileText, 
  Calendar, 
  Download, 
  Edit3, 
  Trash2,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await PDFProject.list("-created_date");
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
    setLoading(false);
  };

  const deleteProject = async (id) => {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      try {
        await PDFProject.delete(id);
        setProjects(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const filteredProjects = projects.filter(project =>
    project.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.filename?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "border-green-500/30 text-green-400";
      case "generating": return "border-yellow-500/30 text-yellow-400";
      case "error": return "border-red-500/30 text-red-400";
      default: return "border-gray-500/30 text-gray-400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed": return "Completo";
      case "generating": return "Gerando";
      case "error": return "Erro";
      default: return "Rascunho";
    }
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
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              Meus Projetos
            </h1>
            <p className="text-gray-400 text-lg">
              Gerencie seus livros de colorir
            </p>
          </div>

          <Link to={createPageUrl("Generator")}>
            <Button className="bg-amber-500 hover:bg-amber-600 text-black font-medium">
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </Link>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500"
            />
          </div>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-black/40 border-gray-600 animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">
              {searchTerm ? "Nenhum projeto encontrado" : "Nenhum projeto ainda"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? "Tente ajustar sua busca" 
                : "Comece criando seu primeiro livro de colorir"
              }
            </p>
            {!searchTerm && (
              <Link to={createPageUrl("Generator")}>
                <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Projeto
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-black/40 border-amber-500/20 backdrop-blur-xl hover:border-amber-500/40 transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-white text-lg truncate">
                            {project.project_name}
                          </CardTitle>
                          <p className="text-gray-400 text-sm truncate">
                            {project.filename}.pdf
                          </p>
                        </div>
                        <Badge 
                          variant="outline"
                          className={getStatusColor(project.status)}
                        >
                          {getStatusText(project.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Formato</p>
                          <p className="text-white font-medium">{project.page_format}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Arquivos</p>
                          <p className="text-white font-medium">
                            {project.uploaded_files?.length || 0}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 text-sm">Criado em</p>
                        <p className="text-white text-sm flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(project.created_date), "dd/MM/yyyy 'às' HH:mm")}
                        </p>
                      </div>

                      {project.generated_pdfs?.length > 0 && (
                        <div>
                          <p className="text-gray-500 text-sm mb-2">PDFs Gerados</p>
                          <div className="flex flex-wrap gap-1">
                            {project.generated_pdfs.map((pdf, i) => (
                              <Badge 
                                key={i}
                                variant="outline" 
                                className="border-green-500/30 text-green-400 text-xs"
                              >
                                {pdf.type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Link to={createPageUrl("Generator")} className="flex-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                          >
                            <Edit3 className="w-3 h-3 mr-2" />
                            Editar
                          </Button>
                        </Link>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProject(project.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}