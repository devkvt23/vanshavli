import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService } from '@/services/api';
import { toast } from "sonner";

export function DnaUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check if file is .txt or .csv
      if (selectedFile.type === "text/plain" || selectedFile.type === "text/csv") {
        setFile(selectedFile);
      } else {
        toast.error("Please upload a .txt or .csv file containing DNA data");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('dnaFile', file);

      const result = await apiService.analysis.uploadDnaFile(formData);
      
      toast.success("Your DNA file has been analyzed successfully!");

      // You can handle the result here, maybe update some state or redirect
      console.log(result);
    } catch (error) {
      toast.error("There was an error uploading your DNA file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Your DNA Data</CardTitle>
        <CardDescription>
          Upload your DNA data file to discover your genetic history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <input
            type="file"
            accept=".txt,.csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
          <Button 
            onClick={handleUpload} 
            disabled={!file || isLoading}
            className="w-full"
          >
            {isLoading ? "Analyzing..." : "Upload and Analyze"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 