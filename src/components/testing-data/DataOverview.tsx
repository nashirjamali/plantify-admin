interface Founder {
  fullName?: string;
  email?: string;
}

interface TeamMember {
  name: string;
  role: string;
  email: string;
  isFounder: boolean;
}

interface Startup {
  id: string;
  startupName?: string;
  description?: string;
  status?: string;
  sector?: string;
  foundedYear?: string;
  teamMembers?: TeamMember[];
  fundingGoal?: string;
  website?: string;
}

interface DataOverviewProps {
  founders: Founder[];
  startups: Startup[];
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    startup.status === 'Approved' ? 'bg-black text-white' :
                    startup.status === 'Rejected' ? 'bg-gray-100 text-black' :
                    startup.status === 'Active' ? 'bg-gray-100 text-black' :
                    'bg-gray-200 text-black'
                  }`}>
                    {startup.status || 'pending'}
                  </span>
                </div>
                <p className="text-sm text-black mb-2">{startup.description || "No description"}</p>
                <div className="flex flex-wrap gap-2 text-xs text-black">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {startup.sector || "No sector"}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Founded: {startup.foundedYear || "N/A"}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Team: {startup.teamMembers?.length || 0} members
                  </span>
                  {startup.fundingGoal && (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      Goal: ${startup.fundingGoal}
                    </span>
                  )}
                </div>
                {startup.website && (
                  <div className="mt-2">
                    <a 
                      href={startup.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-black hover:text-gray-700 text-xs"
                    >
                      {startup.website}
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
