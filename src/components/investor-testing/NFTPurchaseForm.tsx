import { useState } from "react";
import { Button } from "../ui";
import type { StartupSummary, NFTInfo, Investor } from "../../declarations/plantify_backend/plantify_backend.did";
import { backendService } from "../../lib/backend";
import { icrcService } from "../../lib/icrcService";
import { Principal } from "@dfinity/principal";

interface NFTPurchaseFormProps {
  formData: {
    selectedStartup: string;
    selectedInvestor: string;
    quantity: string;
    purchaseAmount: string;
  };
  startups: StartupSummary[];
  investors: Investor[];
  nfts: NFTInfo[];
  onInputChange: (field: string, value: string) => void;
  onPurchase: () => void;
  onBack: () => void;
  onRefresh?: () => void;
}

interface PurchaseState {
  step: 'idle' | 'getting-info' | 'transferring' | 'completing' | 'success' | 'error';
  plantifyAccount?: string;
  nftPrice?: bigint;
  transferResult?: { blockIndex: bigint };
  error?: string;
}

export default function NFTPurchaseForm({
  formData,
  startups,
  investors,
  nfts,
  onInputChange,
  onPurchase,
  onBack,
  onRefresh,
}: NFTPurchaseFormProps) {
  const [purchaseState, setPurchaseState] = useState<PurchaseState>({ step: 'idle' });
  
  const activeStartups = startups;
  const availableNFTs = nfts;

  // Debug logging
  console.log("NFTPurchaseForm - All startups:", startups);
  console.log("NFTPurchaseForm - Active startups:", activeStartups);
  console.log("NFTPurchaseForm - Startup summaries:", startups.map(s => ({ id: s.id, name: s.startupName })));

  const handleNewPurchase = async () => {
    if (!formData.selectedStartup || !formData.selectedInvestor || !formData.quantity) {
      alert("Please select a startup, investor, and enter quantity");
      return;
    }

    const quantity = parseInt(formData.quantity);
    if (quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    try {
      setPurchaseState({ step: 'getting-info' });

      // Step 1: Get purchase information
      const purchaseRequest = {
        startupId: formData.selectedStartup,
        investorId: formData.selectedInvestor,
        quantity: quantity,
        memo: `NFT purchase for startup ${formData.selectedStartup} by investor ${formData.selectedInvestor}`,
      };

      const purchaseInfo = await backendService.purchaseNFT(purchaseRequest);
      
      if ('Error' in purchaseInfo) {
        throw new Error(purchaseInfo.Error);
      }

      // Get Plantify account and NFT price
      const [plantifyAccount, nftPriceResult] = await Promise.all([
        backendService.getPlantifyCanisterPrincipal(),
        backendService.getNFTPrice(formData.selectedStartup)
      ]);

      if ('err' in nftPriceResult) {
        throw new Error(nftPriceResult.err);
      }

      const nftPrice = nftPriceResult.ok;
      const totalAmount = nftPrice * BigInt(quantity);

      setPurchaseState({
        step: 'transferring',
        plantifyAccount,
        nftPrice,
      });

      // Step 2: Transfer tokens using ICRC
      const transferResult = await icrcService.transfer({
        to: Principal.fromText(plantifyAccount),
        amount: totalAmount,
        memo: new TextEncoder().encode(`NFT Purchase: ${formData.selectedStartup}`),
      });

      if (transferResult.Err) {
        throw new Error(`Transfer failed: ${transferResult.Err}`);
      }

      setPurchaseState({
        step: 'completing',
        plantifyAccount,
        nftPrice,
        transferResult: { blockIndex: transferResult.Ok!.blockIndex },
      });

      // Step 3: Complete NFT purchase
      const completeResult = await backendService.completeNFTPurchase(
        purchaseRequest,
        Number(transferResult.Ok!.blockIndex)
      );

      if ('Error' in completeResult) {
        throw new Error(completeResult.Error);
      }

      setPurchaseState({
        step: 'success',
        plantifyAccount,
        nftPrice,
        transferResult: { blockIndex: transferResult.Ok!.blockIndex },
      });

      // Call the original onPurchase to handle success
      onPurchase();

    } catch (error) {
      console.error("Purchase failed:", error);
      setPurchaseState({
        step: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Purchase NFT</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {activeStartups.length} active startups, {availableNFTs.length} existing NFTs
          </div>
          {onRefresh && (
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <span>🔄</span>
              Refresh
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Investor *
          </label>
          <select
            value={formData.selectedInvestor}
            onChange={(e) => onInputChange("selectedInvestor", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose an investor</option>
            {investors.map((investor) => (
              <option key={investor.id} value={investor.id}>
                {investor.fullName} - {investor.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Startup *
          </label>
          <select
            value={formData.selectedStartup}
            onChange={(e) => onInputChange("selectedStartup", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a startup</option>
            {activeStartups.map((startup) => (
              <option key={startup.id} value={startup.id}>
                {startup.startupName || `Startup ${startup.id}`} - {startup.companyType}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity *
          </label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => onInputChange("quantity", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter quantity"
            min="1"
            step="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purchase Amount (ICP)
          </label>
          <input
            type="number"
            value={formData.purchaseAmount}
            onChange={(e) => onInputChange("purchaseAmount", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount in ICP"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {formData.selectedStartup && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Selected Startup Details</h3>
          {(() => {
            const selectedStartup = activeStartups.find(s => s.id === formData.selectedStartup);
            if (!selectedStartup) return null;
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {selectedStartup.startupName || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Company Type:</span> {selectedStartup.companyType || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Available NFTs:</span> {selectedStartup.availableNFTs.toString() || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Total Funding:</span> {selectedStartup.totalFunding || "N/A"}
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium">Description:</span> {selectedStartup.description || "N/A"}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {formData.quantity && formData.selectedStartup && formData.selectedInvestor && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-medium text-green-900 mb-2">Purchase Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Investor:</span> {investors.find(i => i.id === formData.selectedInvestor)?.fullName || "N/A"}
            </div>
            <div>
              <span className="font-medium">Startup:</span> {activeStartups.find(s => s.id === formData.selectedStartup)?.startupName || "N/A"}
            </div>
            <div>
              <span className="font-medium">Quantity:</span> {formData.quantity} NFT(s)
            </div>
            <div>
              <span className="font-medium">Amount:</span> {formData.purchaseAmount || "0"} ICP
            </div>
            <div>
              <span className="font-medium">Total:</span> {formData.purchaseAmount && formData.quantity ? 
                (parseFloat(formData.purchaseAmount) * parseInt(formData.quantity)).toFixed(2) : "0"} ICP
            </div>
          </div>
        </div>
      )}

      {/* Purchase Status Display */}
      {purchaseState.step !== 'idle' && (
        <div className="mt-6 p-4 rounded-lg border">
          {purchaseState.step === 'getting-info' && (
            <div className="bg-blue-50 border-blue-200 text-blue-900">
              <h3 className="font-medium">Getting Purchase Information</h3>
              <p className="text-sm mt-1">Retrieving Plantify account and NFT price...</p>
            </div>
          )}
          
          {purchaseState.step === 'transferring' && (
            <div className="bg-yellow-50 border-yellow-200 text-yellow-900">
              <h3 className="font-medium">Transferring Tokens</h3>
              <p className="text-sm mt-1">
                Transferring {purchaseState.nftPrice ? (Number(purchaseState.nftPrice) * parseInt(formData.quantity)).toLocaleString() : '0'} ckUSDC to Plantify...
              </p>
              {purchaseState.plantifyAccount && (
                <p className="text-xs mt-1 font-mono">Account: {purchaseState.plantifyAccount}</p>
              )}
            </div>
          )}
          
          {purchaseState.step === 'completing' && (
            <div className="bg-purple-50 border-purple-200 text-purple-900">
              <h3 className="font-medium">Completing Purchase</h3>
              <p className="text-sm mt-1">Verifying transfer and transferring NFTs...</p>
              {purchaseState.transferResult && (
                <p className="text-xs mt-1">Transaction ID: {purchaseState.transferResult.blockIndex.toString()}</p>
              )}
            </div>
          )}
          
          {purchaseState.step === 'success' && (
            <div className="bg-green-50 border-green-200 text-green-900">
              <h3 className="font-medium">Purchase Successful!</h3>
              <p className="text-sm mt-1">NFTs have been transferred to your account.</p>
              {purchaseState.transferResult && (
                <p className="text-xs mt-1">Transaction ID: {purchaseState.transferResult.blockIndex.toString()}</p>
              )}
            </div>
          )}
          
          {purchaseState.step === 'error' && (
            <div className="bg-red-50 border-red-200 text-red-900">
              <h3 className="font-medium">Purchase Failed</h3>
              <p className="text-sm mt-1">{purchaseState.error}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button
          onClick={onBack}
          variant="outline"
        >
          Back to Registration
        </Button>

        <Button
          onClick={handleNewPurchase}
          disabled={purchaseState.step !== 'idle' && purchaseState.step !== 'error' || !formData.selectedStartup || !formData.selectedInvestor || !formData.quantity}
          className="flex items-center gap-2"
        >
          {purchaseState.step === 'getting-info' && (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Getting purchase info...
            </>
          )}
          {purchaseState.step === 'transferring' && (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Transferring tokens...
            </>
          )}
          {purchaseState.step === 'completing' && (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Completing purchase...
            </>
          )}
          {purchaseState.step === 'success' && (
            <>
              <span>✅</span>
              Purchase Complete!
            </>
          )}
          {purchaseState.step === 'error' && (
            <>
              <span>❌</span>
              Retry Purchase
            </>
          )}
          {purchaseState.step === 'idle' && "Purchase NFT"}
        </Button>
      </div>
    </div>
  );
}
