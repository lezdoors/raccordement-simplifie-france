import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MultiStepForm } from "@/components/form/MultiStepForm";

const EnedisRaccordement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state?.initialData || {};
  
  return (
    <div className="min-h-screen bg-background mobile-form-container">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Demande de raccordement Enedis
            </h1>
            <p className="text-lg text-muted-foreground">
              Complétez votre demande en quelques étapes simples
            </p>
          </div>
          
          <MultiStepForm initialData={initialData} />
        </div>
      </div>
    </div>
  );
};

export default EnedisRaccordement;