interface Founder {
  fullName?: string;
  email?: string;
}


import type { StartupSummary } from "../../declarations/plantify_backend/plantify_backend.did";

interface DataOverviewProps {
  founders: Founder[];
  startups: StartupSummary[];
}

export default function DataOverview({ founders, startups }: DataOverviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Registered Founders</h3>
        <div className="space-y-3">
          {founders.length === 0 ? (
            <p className="text-black text-sm">No founders registered yet</p>
          ) : (
            founders.map((founder, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-black">{founder.fullName || "Unknown"}</h4>
                <p className="text-sm text-black">{founder.email || "No email"}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-6">
        <h3 className="text-lg font-semibold text-black mb-4">All Startups ({startups.length})</h3>
        <div className="space-y-3">
          {startups.length === 0 ? (
            <p className="text-black text-sm">No startups found</p>
          ) : (
            startups.map((startup, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-black">{startup.startupName || "Unknown Startup"}</h4>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-black">
                    {startup.companyType || 'Startup'}
                  </span>
                </div>
                <p className="text-sm text-black mb-2">{startup.description || "No description"}</p>
                <div className="flex flex-wrap gap-2 text-xs text-black">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {startup.companyType || "No type"}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Available NFTs: {startup.availableNFTs.toString()}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Total Funding: {startup.totalFunding}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    NFT Price: {startup.nftPrice}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
