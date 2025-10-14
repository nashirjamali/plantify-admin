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
import type { Investor, NFTInfo, StartupSummary } from "../../declarations/plantify_backend/plantify_backend.did";

export default function InvestorTestingPage() {
  const { isAuthenticated, isLoading, principal } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [startups, setStartups] = useState<StartupSummary[]>([]);
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
    selectedInvestor: "",
    quantity: "",
    purchaseAmount: "",
  });

  const loadData = useCallback(async () => {
    if (isAuthenticated) {
      try {
        console.log("Loading data for investor testing...");
        const startupsData = await backendService.getStartupsPaginated({ page: 1, limit: 100 });
        const nftsData = await backendService.getAllNFTs();
        const investorsData = await backendService.getInvestors();
        console.log("Loaded startups:", startupsData.startups);
        console.log("Loaded investors:", investorsData);
        console.log("Startup summaries:", startupsData.startups.map(s => ({ id: s.id, name: s.startupName })));
        setStartups(startupsData.startups);
        setNfts(nftsData);
        setInvestors(investorsData);
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

  // Refresh data when currentStep changes to NFT purchase step
  useEffect(() => {
    if (currentStep === 2) {
      loadData();
    }
  }, [currentStep, loadData]);

  // Force refresh data when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
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
    if (!purchaseFormData.selectedStartup || !purchaseFormData.selectedInvestor || !purchaseFormData.quantity) {
      alert("Please select a startup, investor, and enter quantity");
      return;
    }
    
    if (!purchaseFormData.purchaseAmount || parseFloat(purchaseFormData.purchaseAmount) <= 0) {
      alert("Please enter a valid purchase amount");
      return;
    }
    
    const quantity = parseInt(purchaseFormData.quantity);
    if (quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
    
    setIsPurchasing(true);
    try {
      // Use the real backend purchaseNFT function with selected investor
      const result = await backendService.purchaseNFT({
        startupId: purchaseFormData.selectedStartup,
        investorId: purchaseFormData.selectedInvestor,
        quantity: quantity,
        memo: `NFT purchase for startup ${purchaseFormData.selectedStartup} by investor ${purchaseFormData.selectedInvestor}`,
      });
      
      if ('Error' in result) {
        throw new Error(result.Error);
      }
      
      const success = result.Success;
      setPurchaseFormData({
        selectedStartup: "",
        selectedInvestor: "",
        quantity: "",
        purchaseAmount: "",
      });
      await loadData();
      setCurrentStep(1);
      alert(`NFT purchased successfully! Transaction ID: ${success.transactionId}. Token IDs: ${success.tokenIds.join(', ')}`);
    } catch (error) {
      console.error("Failed to purchase NFT:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to purchase NFT: ${errorMessage}`);
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
        {/* Principal ID Display */}
        {principal && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-900">Current Principal ID</h3>
                <p className="text-xs text-blue-700 mt-1">
                  {principal.toString().slice(0, 20)}...
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(principal.toString());
                  alert('Principal ID copied to clipboard!');
                }}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                title="Copy full Principal ID"
              >
                <span>📋</span>
                Copy
              </button>
            </div>
          </div>
        )}

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
            investors={investors}
            nfts={nfts}
            isPurchasing={isPurchasing}
            onInputChange={handlePurchaseInputChange}
            onPurchase={purchaseNFT}
            onBack={() => setCurrentStep(1)}
            onRefresh={loadData}
          />
        )}

        <InvestorDataOverview investors={investors} startups={startups} nfts={nfts} />
      </div>
    </Layout>
  );
}
