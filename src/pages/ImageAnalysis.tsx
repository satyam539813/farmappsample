
import React from 'react';
import Layout from '../components/Layout';
import ImageUpload from '../components/ImageUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ImageAnalysis = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold text-center text-farm-green-dark mb-2">
          FarmAI Tools
        </h1>
        <p className="text-center mb-10 text-gray-600 text-lg">
          Powerful AI tools to help you with your farming needs
        </p>

        <Card className="mb-10 border-farm-green/20">
          <CardHeader className="bg-farm-green/10 pb-2">
            <CardTitle className="text-2xl font-bold text-farm-green-dark">
              Image Analysis with Gemini AI
            </CardTitle>
            <CardDescription className="text-gray-600">
              Upload any image and our AI will analyze it for you
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 mb-6">
              Our powerful image analysis tool uses Google's Gemini AI to provide insights about your farm 
              images. Upload photos of plants, soil, equipment, or any farming-related image, and customize 
              your prompt to ask specific questions about what you see.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-md border border-gray-100">
              <ImageUpload />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ImageAnalysis;
