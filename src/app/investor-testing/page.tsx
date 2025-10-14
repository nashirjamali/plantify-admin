"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { backendService } from "../../lib/backend";
import { AIService } from "../../lib/aiService";
import Layout from "../../components/Layout";
import {
  ProgressSteps,
  InvestorForm,
  NFTPurchaseForm,
  InvestorDataOverview
} from "../../components/investor-testing";
import type { Investor, Startup, NFTInfo } from "../../declarations/plantify_backend/plantify_backend.did";

export default function InvestorTestingPage() {
  const { isAuthenticated, isLoading, principal } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [nfts, setNfts] = useState<NFTInfo[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    investmentExperience: "",
    riskTolerance: "",
    investmentGoals: "",
    availableCapital: "",
    monthlyBudget: "",
    bio: "",
    company: "",
    location: "",
    occupation: "",
    profilePhoto: "",
  });

  const [purchaseFormData, setPurchaseFormData] = useState({
    selectedStartup: "",
    selectedNFT: "",
    purchaseAmount: "",
  });

  const loadData = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const startupsData = await backendService.getAllStartups();
        const nftsData = await backendService.getAllNFTs();
        setStartups(startupsData);
        setNfts(nftsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    loadData();
  }, [isAuthenticated, loadData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePurchaseInputChange = (field: string, value: string) => {
    setPurchaseFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateAIData = async () => {
    setIsGeneratingAI(true);
    try {
      const aiData = await AIService.generateInvestorData();
      setFormData(aiData);
    } catch (error) {
      console.error("Failed to generate AI data:", error);
      alert("Failed to generate AI data. Please check your API configuration.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const registerInvestor = async () => {
    setIsRegistering(true);
    try {
      await backendService.registerInvestor(formData);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        investmentExperience: "",
        riskTolerance: "",
        investmentGoals: "",
        availableCapital: "",
        monthlyBudget: "",
        bio: "",
        company: "",
        location: "",
        occupation: "",
        profilePhoto: "",
      });
      await loadData();
      setCurrentStep(2);
      alert("Testing investor registered successfully!");
    } catch (error) {
      console.error("Failed to register investor:", error);
      alert("Failed to register testing investor. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const purchaseNFT = async () => {
    if (!purchaseFormData.selectedStartup || !purchaseFormData.selectedNFT) {
      alert("Please select a startup and NFT to purchase");
      return;
    }
    
    setIsPurchasing(true);
    try {
      // For now, we'll simulate the NFT purchase
      // In a real implementation, this would call the backend to purchase the NFT
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setPurchaseFormData({
        selectedStartup: "",
        selectedNFT: "",
        purchaseAmount: "",
      });
      await loadData();
      setCurrentStep(1);
      alert("NFT purchased successfully!");
    } catch (error) {
      console.error("Failed to purchase NFT:", error);
      alert("Failed to purchase NFT. Please try again.");
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black">Loading investor testing data...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const steps = [
    { number: 1, title: "Register Investor", description: "Register a testing investor with AI-generated data" },
    { number: 2, title: "Purchase NFT", description: "Purchase NFTs from active startups" },
  ];

  return (
    <Layout title="Investor Testing Data Flow">
      <div className="space-y-6">
        <ProgressSteps currentStep={currentStep} steps={steps} />

        {currentStep === 1 && (
          <InvestorForm
            formData={formData}
            isGeneratingAI={isGeneratingAI}
            isRegistering={isRegistering}
            onInputChange={handleInputChange}
            onGenerateAI={generateAIData}
            onRegister={registerInvestor}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <NFTPurchaseForm
            formData={purchaseFormData}
            startups={startups}
            nfts={nfts}
            isPurchasing={isPurchasing}
            onInputChange={handlePurchaseInputChange}
            onPurchase={purchaseNFT}
            onBack={() => setCurrentStep(1)}
          />
        )}

        <InvestorDataOverview investors={investors} startups={startups} nfts={nfts} />
      </div>
    </Layout>
  );
}
