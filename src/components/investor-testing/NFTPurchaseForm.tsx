import { Button } from "../ui";
import type { Startup, NFTInfo } from "../../declarations/plantify_backend/plantify_backend.did";

interface NFTPurchaseFormProps {
  formData: {
    selectedStartup: string;
    selectedNFT: string;
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
  const activeStartups = startups.filter(startup => startup.status === "active");
  const availableNFTs = nfts.filter(nft => nft.owner && nft.owner.owner);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Purchase NFT</h2>
        <div className="text-sm text-gray-500">
          {activeStartups.length} active startups, {availableNFTs.length} available NFTs
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
            Select NFT *
          </label>
          <select
            value={formData.selectedNFT}
            onChange={(e) => onInputChange("selectedNFT", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose an NFT</option>
            {availableNFTs.map((nft) => (
              <option key={nft.tokenId} value={nft.tokenId.toString()}>
                NFT #{nft.tokenId} - {nft.metadata.name?.[0] || "Unnamed NFT"}
              </option>
            ))}
          </select>
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

      {formData.selectedNFT && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-medium text-green-900 mb-2">Selected NFT Details</h3>
          {(() => {
            const selectedNFT = availableNFTs.find(n => n.tokenId.toString() === formData.selectedNFT);
            if (!selectedNFT) return null;
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Token ID:</span> #{selectedNFT.tokenId}
                </div>
                <div>
                  <span className="font-medium">Name:</span> {selectedNFT.metadata.name?.[0] || "Unnamed NFT"}
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium">Description:</span> {selectedNFT.metadata.description?.[0] || "No description"}
                </div>
                {selectedNFT.metadata.image && selectedNFT.metadata.image.length > 0 && (
                  <div className="md:col-span-2">
                    <span className="font-medium">Image:</span>
                    <img 
                      src={selectedNFT.metadata.image[0]} 
                      alt="NFT" 
                      className="mt-2 w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            );
          })()}
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
          disabled={isPurchasing || !formData.selectedStartup || !formData.selectedNFT}
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
