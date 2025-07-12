
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Eye, Camera } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageAnalysisResult {
  analysis: string;
  error?: string;
}

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [customPrompt, setCustomPrompt] = useState("Analyze this image and describe what you see in detail. Focus on identifying objects, people, animals, text, colors, and any other notable features.");
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
      
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB.",
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
      console.log("Sending image for OpenAI Vision analysis...");
      
      const { data, error } = await supabase.functions.invoke<ImageAnalysisResult>('analyze-image', {
        body: {
          image: selectedImage,
          prompt: customPrompt || "Analyze this image and describe what you see in detail."
        }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }
      
      if (data?.error) {
        console.error("Analysis error:", data.error);
        throw new Error(data.error);
      }
      
      setAnalysisResult(data?.analysis || "No analysis returned");
      
      toast({
        title: "Analysis complete",
        description: "Image has been successfully analyzed with AI vision.",
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
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-farm-green to-farm-green-dark p-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <Eye className="mr-3 h-6 w-6" />
            AI Vision Analysis
          </h2>
          <p className="text-farm-green-light">
            Upload any image and get detailed AI-powered analysis and insights
          </p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="picture" className="text-sm font-medium text-gray-700 flex items-center">
              <Camera className="mr-2 h-4 w-4" />
              Choose an image to analyze
            </label>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-farm-green transition-colors p-4 rounded-lg"
            />
            <p className="text-xs text-gray-500">
              Supports JPG, PNG, GIF, WebP. Maximum file size: 10MB
            </p>
          </div>

          {selectedImage && (
            <div className="space-y-6">
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <img 
                  src={selectedImage} 
                  alt="Selected preview" 
                  className="w-full max-h-[400px] object-contain"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="prompt" className="text-sm font-medium text-gray-700 block">
                  Analysis prompt (customize what you want to know)
                </label>
                <Textarea
                  id="prompt"
                  placeholder="What would you like to know about this image?"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[100px] border-gray-300 focus:border-farm-green focus:ring-farm-green"
                />
                <p className="text-xs text-gray-500">
                  Be specific about what you want to detect or analyze in the image
                </p>
              </div>

              <Button 
                onClick={analyzeImage} 
                className="w-full bg-farm-green hover:bg-farm-green-dark text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isAnalyzing}
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing with AI Vision...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-5 w-5" />
                    Analyze Image with AI
                  </>
                )}
              </Button>
            </div>
          )}

          {analysisResult && (
            <div className="mt-6 border-2 border-farm-green/20 rounded-lg p-6 bg-farm-green/5">
              <h3 className="font-semibold text-farm-green-dark mb-3 flex items-center text-lg">
                <Eye className="mr-2 h-5 w-5" />
                AI Vision Analysis Results
              </h3>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {analysisResult}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
