
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageAnalysisResult {
  analysis: string;
  error?: string;
}

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [customPrompt, setCustomPrompt] = useState("What is in this image?");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive"
        });
        return;
      }
      
      setImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Reset analysis when new image is selected
      setAnalysisResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke<ImageAnalysisResult>('analyze-image', {
        body: {
          image: selectedImage,
          prompt: customPrompt || "What is in this image?"
        }
      });

      if (error) throw error;
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setAnalysisResult(data.analysis || "No analysis returned");
      
      toast({
        title: "Analysis complete",
        description: "Image has been successfully analyzed.",
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze image",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-farm-green-dark mb-4">Image Analysis</h2>
        
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="picture" className="text-sm font-medium text-farm-green-dark">
              Upload an image
            </label>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>

          {selectedImage && (
            <div className="space-y-4">
              <div className="border rounded-md overflow-hidden">
                <img 
                  src={selectedImage} 
                  alt="Selected preview" 
                  className="w-full max-h-[300px] object-contain"
                />
              </div>
              
              <div>
                <label htmlFor="prompt" className="text-sm font-medium text-farm-green-dark block mb-1">
                  Analysis prompt (optional)
                </label>
                <Textarea
                  id="prompt"
                  placeholder="What would you like to know about this image?"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <Button 
                onClick={analyzeImage} 
                className="w-full bg-farm-green hover:bg-farm-green-dark"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Analyze Image
                  </>
                )}
              </Button>
            </div>
          )}

          {analysisResult && (
            <div className="mt-6 border rounded-md p-4 bg-gray-50">
              <h3 className="font-semibold text-farm-green-dark mb-2">Analysis Result:</h3>
              <div className="whitespace-pre-line text-gray-700">{analysisResult}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
