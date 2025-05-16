
import React from 'react';
import Layout from '../components/Layout';
import ImageUpload from '../components/ImageUpload';

const ImageAnalysis = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center text-farm-green-dark mb-8">
          Image Analysis with Gemini AI
        </h1>
        <p className="text-center mb-8 max-w-2xl mx-auto text-gray-600">
          Upload any image and our AI will analyze it for you. 
          Customize the prompt to ask specific questions about your image.
        </p>
        <ImageUpload />
      </div>
    </Layout>
  );
};

export default ImageAnalysis;
