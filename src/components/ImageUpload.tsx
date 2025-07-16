
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Loader2, Upload, Eye, Camera, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageAnalysisResult {
  analysis: string;
  error?: string;
}

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
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

  // Progress simulation
  useEffect(() => {
    if (isAnalyzing) {
      setAnalysisProgress(0);
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

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
    setAnalysisProgress(0);
    
    try {
      console.log("Sending image for OpenAI Vision analysis...");
      
      const { data, error } = await supabase.functions.invoke<ImageAnalysisResult>('analyze-image', {
        body: {
          image: selectedImage,
          prompt: "Analyze this agricultural image briefly: 1) Crop type, 2) Health status, 3) Growth stage, 4) Visible issues, 5) Recommendations. Be concise."
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
      
      // Complete progress
      setAnalysisProgress(100);
      
      // Small delay to show completion
      setTimeout(() => {
        setAnalysisResult(data?.analysis || "No analysis returned");
        
        toast({
          title: "Analysis complete",
          description: "Image has been successfully analyzed with AI vision.",
        });
      }, 500);
      
    } catch (error) {
      console.error("Error analyzing image:", error);
      setAnalysisProgress(0);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze image",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 500);
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
              
              {/* Progress Bar */}
              {isAnalyzing && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-farm-green-dark">
                      {analysisProgress < 100 ? 'Analyzing...' : 'Analysis Complete!'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(analysisProgress)}%
                    </span>
                  </div>
                  <Progress 
                    value={analysisProgress} 
                    className="w-full h-3 bg-gray-200 rounded-full overflow-hidden"
                  />
                  {analysisProgress === 100 && (
                    <div className="flex items-center justify-center text-farm-green">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Analyzed Successfully!</span>
                    </div>
                  )}
                </div>
              )}

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
            <div className="mt-8 space-y-6">
              <div className="flex items-center mb-6">
                <Eye className="h-6 w-6 text-farm-green mr-3" />
                <h3 className="text-xl font-bold text-farm-green-dark font-serif">Crop Analysis Results</h3>
              </div>
              
              <div className="bg-gradient-to-br from-farm-green/5 to-farm-green-dark/5 rounded-2xl border-2 border-farm-green/20 p-8 shadow-xl transition-all duration-500 ease-in-out hover:shadow-2xl hover:border-farm-green/30">
                <div className="space-y-6">
                  <div className="font-serif font-bold text-farm-green-dark text-lg leading-relaxed whitespace-pre-wrap transition-all duration-300 ease-in-out">
                    {analysisResult.replace(/\*/g, '').trim().split('\n').map((line, index) => {
                      const trimmedLine = line.trim();
                      if (!trimmedLine) return null;
                      
                      // Check if line starts with a number followed by )
                      const isNumberedPoint = /^\d+\)/.test(trimmedLine);
                      
                      if (isNumberedPoint) {
                        return (
                          <div key={index} className="mb-4 p-4 bg-white/60 rounded-lg border-l-4 border-farm-green transition-all duration-300 ease-in-out hover:bg-white/80 hover:shadow-md">
                            <div className="font-bold text-farm-green-dark mb-2">
                              {trimmedLine}
                            </div>
                          </div>
                        );
                      } else if (trimmedLine.length > 0) {
                        return (
                          <div key={index} className="ml-4 mb-2 text-gray-700 leading-relaxed">
                            {trimmedLine}
                          </div>
                        );
                      }
                      return null;
                    }).filter(Boolean)}
                  </div>
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
