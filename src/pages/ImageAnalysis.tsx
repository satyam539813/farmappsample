
import React from 'react';
import Layout from '../components/Layout';
import ImageUpload from '../components/ImageUpload';

const ImageAnalysis = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center text-farm-green-dark mb-8">
          Image Analysis
        </h1>
        <ImageUpload />
      </div>
    </Layout>
  );
};

export default ImageAnalysis;
