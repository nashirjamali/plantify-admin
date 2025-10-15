import type { StartupSummary } from "../../declarations/plantify_backend/plantify_backend.did";

interface StatusUpdateFormProps {
  startups: StartupSummary[];
  selectedStartup: string;
  newStatus: string;
  isUpdatingStatus: boolean;
  onStartupChange: (startupId: string) => void;
  onStatusChange: (status: string) => void;
  onUpdate: () => void;
  onBack: () => void;
  onStartOver: () => void;
}

export default function StatusUpdateForm({
  startups,
  selectedStartup,
  newStatus,
  isUpdatingStatus,
  onStartupChange,
  onStatusChange,
  onUpdate,
  onBack,
  onStartOver
}: StatusUpdateFormProps) {
  const selectedStartupData = startups.find(startup => startup.id === selectedStartup);

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-black">Step 4: Update Startup Status</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black text-black">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Mainnet
          </span>
        </div>
        <button
          onClick={onBack}
          className="text-black hover:text-gray-700 text-sm font-medium flex items-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Collateral</span>
        </button>
      </div>
      
      <div className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Select Startup</label>
          <select
            value={selectedStartup}
            onChange={(e) => onStartupChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
          >
            <option value="">Select a startup</option>
            {startups.map((startup, index) => (
              <option key={index} value={startup.id}>
                {startup.startupName || startup.id || "Unknown Startup"}
              </option>
            ))}
          </select>
        </div>

        {selectedStartupData && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Startup Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{selectedStartupData.startupName || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Company Type:</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-black">
                  {selectedStartupData.companyType || 'Startup'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available NFTs:</span>
                <span className="font-medium">{selectedStartupData.availableNFTs.toString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Funding:</span>
                <span className="font-medium">{selectedStartupData.totalFunding}</span>
              </div>
              {selectedStartupData.description && (
                <div>
                  <span className="text-gray-600">Description:</span>
                  <p className="mt-1 text-gray-900">{selectedStartupData.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-black mb-1">New Status</label>
          <select
            value={newStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            disabled={!selectedStartup}
          >
            <option value="">Select new status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Active">Active</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            {selectedStartup ? 
              "This will update the startup status in the mainnet backend" :
              "Please select a startup first"
            }
          </p>
          {newStatus === 'Active' && (
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-black mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs font-medium text-black">NFT Auto-Minting</p>
                  <p className="text-xs text-black mt-1">
                    When set to active, an NFT will be automatically minted for this startup with metadata including company details and logo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onStartOver}
          className="bg-gray-100 hover:bg-gray-200 text-black px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Start Over</span>
        </button>
        <button
          onClick={onUpdate}
          disabled={isUpdatingStatus || !selectedStartup || !newStatus}
          className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-black px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          {isUpdatingStatus ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Updating...</span>
            </>
          ) : (
            'Update Status'
          )}
        </button>
      </div>
    </div>
  );
}
