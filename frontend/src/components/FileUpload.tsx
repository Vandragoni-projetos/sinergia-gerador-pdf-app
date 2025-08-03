import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  files: File[];
  accept?: Record<string, string[]>;
  multiple?: boolean;
}

export function FileUpload({ 
  onFilesChange, 
  files, 
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg'],
    'application/pdf': ['.pdf']
  },
  multiple = true 
}: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (multiple) {
      onFilesChange([...files, ...acceptedFiles]);
    } else {
      onFilesChange(acceptedFiles.slice(0, 1));
    }
  }, [files, onFilesChange, multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={`
          p-8 border-2 border-dashed cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-sinergia-purple bg-sinergia-purple/5' 
            : 'border-border hover:border-sinergia-purple/50 hover:bg-accent/50'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className={`h-12 w-12 mb-4 transition-colors ${
            isDragActive ? 'text-sinergia-purple' : 'text-muted-foreground'
          }`} />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para selecionar'}
          </p>
          <p className="text-sm text-muted-foreground">
            Suporte para PNG, JPG, JPEG e PDF • Múltiplos arquivos aceitos
          </p>
        </div>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Arquivos selecionados:</h4>
          <div className="grid gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileImage className="h-5 w-5 text-sinergia-blue" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}