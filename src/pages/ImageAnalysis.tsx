
import React from 'react';
import Layout from '../components/Layout';
import ImageUpload from '../components/ImageUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Zap, Shield, Brain } from 'lucide-react';

const ImageAnalysis = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-farm-green-dark mb-4 flex items-center justify-center">
            <Eye className="mr-3 h-10 w-10 text-farm-green" />
            AI Vision Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Harness the power of artificial intelligence to analyze and understand your images with incredible detail and accuracy
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-farm-green/20 hover:border-farm-green/40 transition-colors">
            <CardHeader className="pb-3">
              <Brain className="h-12 w-12 text-farm-green mx-auto mb-2" />
              <CardTitle className="text-lg text-farm-green-dark">Smart Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Advanced AI identifies objects, people, animals, text, and scenes with high precision
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-farm-green/20 hover:border-farm-green/40 transition-colors">
            <CardHeader className="pb-3">
              <Zap className="h-12 w-12 text-farm-green mx-auto mb-2" />
              <CardTitle className="text-lg text-farm-green-dark">Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Get detailed analysis results in seconds, powered by cutting-edge AI technology
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-farm-green/20 hover:border-farm-green/40 transition-colors">
            <CardHeader className="pb-3">
              <Shield className="h-12 w-12 text-farm-green mx-auto mb-2" />
              <CardTitle className="text-lg text-farm-green-dark">Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Your images are processed securely and never stored permanently on our servers
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-farm-green/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-farm-green/10 to-farm-green-dark/10 border-b border-farm-green/20">
            <CardTitle className="text-2xl font-bold text-farm-green-dark flex items-center">
              <Eye className="mr-3 h-6 w-6" />
              AI-Powered Image Analysis
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Upload any image and get intelligent insights about its contents, objects, people, text, and more
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ImageUpload />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ImageAnalysis;
