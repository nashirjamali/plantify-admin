import { Button } from "../ui";
import type { Startup, NFTInfo } from "../../declarations/plantify_backend/plantify_backend.did";

interface NFTPurchaseFormProps {
  formData: {
    selectedStartup: string;
    quantity: string;
    purchaseAmount: string;
  };
  startups: Startup[];
  nfts: NFTInfo[];
  isPurchasing: boolean;
  onInputChange: (field: string, value: string) => void;
  onPurchase: () => void;
  onBack: () => void;
}

export default function NFTPurchaseForm({
  formData,
  startups,
  nfts,
  isPurchasing,
  onInputChange,
  onPurchase,
  onBack,
}: NFTPurchaseFormProps) {
  const activeStartups = startups.filter(startup => startup.status === "Active");
  const availableNFTs = nfts.filter(nft => nft.owner && nft.owner.owner);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Purchase NFT</h2>
        <div className="text-sm text-gray-500">
          {activeStartups.length} active startups, {availableNFTs.length} existing NFTs
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                {startup.startupName || `Startup ${startup.id}`} - {startup.sector}
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
                  <span className="font-medium">Sector:</span> {selectedStartup.sector || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {selectedStartup.status || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Funding Goal:</span> {selectedStartup.fundingGoal || "N/A"}
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium">Description:</span> {selectedStartup.description || "N/A"}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {formData.quantity && formData.selectedStartup && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-medium text-green-900 mb-2">Purchase Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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

      <div className="flex justify-between mt-6">
        <Button
          onClick={onBack}
          variant="outline"
        >
          Back to Registration
        </Button>

        <Button
          onClick={onPurchase}
          disabled={isPurchasing || !formData.selectedStartup || !formData.quantity}
          className="flex items-center gap-2"
        >
          {isPurchasing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Purchasing...
            </>
          ) : (
            "Purchase NFT"
          )}
        </Button>
      </div>
    </div>
  );
}
