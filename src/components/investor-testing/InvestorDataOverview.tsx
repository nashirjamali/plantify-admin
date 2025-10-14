import type { Investor, Startup, NFTInfo } from "../../declarations/plantify_backend/plantify_backend.did";

interface InvestorDataOverviewProps {
  investors: Investor[];
  startups: Startup[];
  nfts: NFTInfo[];
}

export default function InvestorDataOverview({
  investors,
  startups,
  nfts,
}: InvestorDataOverviewProps) {
  const activeStartups = startups.filter(startup => startup.status === "Active");
  const availableNFTs = nfts.filter(nft => nft.owner && nft.owner.owner);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Registered Investors</p>
              <p className="text-2xl font-semibold text-gray-900">{investors.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🚀</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Startups</p>
              <p className="text-2xl font-semibold text-gray-900">{activeStartups.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🎨</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Available NFTs</p>
              <p className="text-2xl font-semibold text-gray-900">{availableNFTs.length}</p>
            </div>
          </div>
        </div>
      </div>

      {investors.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Registered Investors</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Tolerance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available Capital
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {investors.map((investor, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {investor.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {investor.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        investor.riskTolerance === 'Conservative' ? 'bg-green-100 text-green-800' :
                        investor.riskTolerance === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {investor.riskTolerance}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${parseInt(investor.availableCapital).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {investor.city}, {investor.country}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeStartups.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Startups</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeStartups.map((startup) => (
              <div key={startup.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  {startup.startupName || `Startup ${startup.id}`}
                </h4>
                <p className="text-sm text-gray-600 mb-2">{startup.sector}</p>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  {startup.description || "No description available"}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-600">
                    ${parseInt(startup.fundingGoal || "0").toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {startup.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {availableNFTs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available NFTs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableNFTs.map((nft) => (
              <div key={nft.tokenId} className="border border-gray-200 rounded-lg p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  {nft.metadata.image && nft.metadata.image.length > 0 ? (
                    <img 
                      src={nft.metadata.image[0]} 
                      alt="NFT" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-4xl">🎨</span>
                  )}
                </div>
                <h4 className="font-medium text-gray-900 mb-1">
                  {nft.metadata.name?.[0] || `NFT #${nft.tokenId}`}
                </h4>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                  {nft.metadata.description?.[0] || "No description"}
                </p>
                <div className="text-sm font-medium text-purple-600">
                  Token ID: #{nft.tokenId}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
