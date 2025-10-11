import Image from "next/image";
import TeamMembersSection from "./TeamMembersSection";

interface Founder {
  id: string;
  fullName?: string;
}

interface TeamMember {
  name: string;
  role: string;
  background: string;
  linkedin: string;
  email: string;
  isFounder: boolean;
  photo: string; // Supabase URL for team member photo
}

interface StartupFormData {
  founderId: string;
  companyName: string;
  description: string;
  industry: string;
  businessModel: string;
  targetMarket: string;
  fundingGoal: string;
  equityOffering: string;
  timeline: string;
  teamSize: string;
  revenue: string;
  website: string;
  pitchDeck: string;
  // Additional backend fields
  foundedYear: string;
  competitiveAdvantage: string;
  useOfFunds: string;
  revenueModel: string;
  solution: string;
  marketingStrategy: string;
  legalDocuments: string;
  monthlyRevenue: string;
  operationalProcess: string;
  advisors: string;
  nftPrice: string;
  location: string;
  monthlyExpenses: string;
  problemStatement: string;
  founderBackground: string;
}

interface StartupFormProps {
  formData: StartupFormData;
  founders: Founder[];
  teamMembers: TeamMember[];
  aiGeneratedLogo: string;
  aiGeneratedNFTImage: string;
  isGeneratingStartupAI: boolean;
  isCreatingStartup: boolean;
  onInputChange: (field: string, value: string) => void;
  onGenerateAI: () => void;
  onGenerateNFTImage: () => void;
  onCreate: () => void;
  onNext: () => void;
  onBack: () => void;
  onAddTeamMember: () => void;
  onUpdateTeamMember: (index: number, field: string, value: string | boolean) => void;
  onRemoveTeamMember: (index: number) => void;
}

export default function StartupForm({
  formData,
  founders,
  teamMembers,
  aiGeneratedLogo,
  aiGeneratedNFTImage,
  isGeneratingStartupAI,
  isCreatingStartup,
  onInputChange,
  onGenerateAI,
  onGenerateNFTImage,
  onCreate,
  onNext,
  onBack,
  onAddTeamMember,
  onUpdateTeamMember,
  onRemoveTeamMember
}: StartupFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Step 2: Create Testing Startup</h3>
          <button
            onClick={onBack}
            className="text-black hover:text-gray-700 text-sm font-medium flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Founder Creation</span>
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onGenerateAI}
            disabled={isGeneratingStartupAI}
            className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            {isGeneratingStartupAI ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate All</span>
              </>
            )}
          </button>
          <button
            onClick={onGenerateNFTImage}
            disabled={!formData.description || !formData.industry}
            className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
            title={!formData.description || !formData.industry ? "Please fill in description and industry first" : "Generate NFT image based on startup description and industry"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Generate NFT Image</span>
          </button>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-black mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-black">Admin Mode: Founder Selection Enabled</h4>
            <p className="text-sm text-black mt-1">
              You can create startups for any founder by selecting them from the dropdown below. 
              If no founder is selected, the startup will be created for the currently logged-in user.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-black mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-black">Image Generation</h4>
            <p className="text-sm text-black mt-1">
              <strong>Company Logo:</strong> Used for startup branding and display. 
              <strong> NFT Image:</strong> Used specifically for the NFT representing ownership/investment in the startup. 
              Generate both to have distinct images for different purposes.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Select Founder (Optional)</label>
            <select
              value={formData.founderId}
              onChange={(e) => onInputChange('founderId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
            >
              <option value="">Select a founder (or leave empty for current user)</option>
              {founders.length === 0 ? (
                <option value="" disabled>No founders available - Create one first</option>
              ) : (
                founders.map((founder, index) => (
                  <option key={index} value={founder.id}>
                    {founder.fullName || "Unknown Founder"}
                  </option>
                ))
              )}
            </select>
            {founders.length === 0 && (
              <p className="mt-2 text-sm text-amber-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                No founders available. You can still create a startup for the current user, or click &quot;Back to Founder Creation&quot; to create founders first.
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Company Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => onInputChange('companyName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Industry</label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => onInputChange('industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Enter industry"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Business Model</label>
            <input
              type="text"
              value={formData.businessModel}
              onChange={(e) => onInputChange('businessModel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Enter business model"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Target Market</label>
            <input
              type="text"
              value={formData.targetMarket}
              onChange={(e) => onInputChange('targetMarket', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Enter target market"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Funding Goal</label>
            <input
              type="number"
              value={formData.fundingGoal}
              onChange={(e) => onInputChange('fundingGoal', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Enter funding goal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Equity Offering (%)</label>
            <input
              type="number"
              value={formData.equityOffering}
              onChange={(e) => onInputChange('equityOffering', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Enter equity offering percentage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Timeline</label>
            <input
              type="text"
              value={formData.timeline}
              onChange={(e) => onInputChange('timeline', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Enter timeline"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-black mb-1">Description</label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
          placeholder="Enter startup description"
        />
      </div>

      {/* Additional Backend Fields */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Founded Year</label>
            <input
              type="number"
              value={formData.foundedYear}
              onChange={(e) => onInputChange('foundedYear', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Enter founded year"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Competitive Advantage</label>
            <textarea
              rows={3}
              value={formData.competitiveAdvantage}
              onChange={(e) => onInputChange('competitiveAdvantage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Describe your competitive advantage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Use of Funds</label>
            <textarea
              rows={3}
              value={formData.useOfFunds}
              onChange={(e) => onInputChange('useOfFunds', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Describe how you will use the funds"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Revenue Model</label>
            <input
              type="text"
              value={formData.revenueModel}
              onChange={(e) => onInputChange('revenueModel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Describe your revenue model"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Solution</label>
            <textarea
              rows={3}
              value={formData.solution}
              onChange={(e) => onInputChange('solution', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Describe your solution"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Marketing Strategy</label>
            <textarea
              rows={3}
              value={formData.marketingStrategy}
              onChange={(e) => onInputChange('marketingStrategy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Describe your marketing strategy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Legal Documents</label>
            <input
              type="text"
              value={formData.legalDocuments}
              onChange={(e) => onInputChange('legalDocuments', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="List legal documents"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Monthly Revenue</label>
            <input
              type="number"
              value={formData.monthlyRevenue}
              onChange={(e) => onInputChange('monthlyRevenue', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Enter monthly revenue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Operational Process</label>
            <textarea
              rows={3}
              value={formData.operationalProcess}
              onChange={(e) => onInputChange('operationalProcess', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Describe your operational process"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Advisors</label>
            <input
              type="text"
              value={formData.advisors}
              onChange={(e) => onInputChange('advisors', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="List your advisors"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">NFT Price</label>
            <input
              type="number"
              value={formData.nftPrice}
              onChange={(e) => onInputChange('nftPrice', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Enter NFT price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => onInputChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Enter company location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Monthly Expenses</label>
            <input
              type="number"
              value={formData.monthlyExpenses}
              onChange={(e) => onInputChange('monthlyExpenses', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Enter monthly expenses"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Problem Statement</label>
            <textarea
              rows={3}
              value={formData.problemStatement}
              onChange={(e) => onInputChange('problemStatement', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Describe the problem you're solving"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1 form-label">Founder Background</label>
            <textarea
              rows={3}
              value={formData.founderBackground}
              onChange={(e) => onInputChange('founderBackground', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black form-input"
              placeholder="Describe founder background"
            />
          </div>
        </div>
      </div>

      <TeamMembersSection
        teamMembers={teamMembers}
        onAddMember={onAddTeamMember}
        onUpdateMember={onUpdateTeamMember}
        onRemoveMember={onRemoveTeamMember}
      />

      {aiGeneratedLogo && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Image 
                src={aiGeneratedLogo} 
                alt="Generated Company Logo" 
                width={48}
                height={48}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-black">AI Generated Company Logo</p>
              <p className="text-xs text-black">This logo will be used for the startup</p>
            </div>
          </div>
        </div>
      )}

      {aiGeneratedNFTImage && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Image 
                src={aiGeneratedNFTImage} 
                alt="Generated NFT Image" 
                width={48}
                height={48}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-black">AI Generated NFT Image</p>
              <p className="text-xs text-black">This image will be used for the NFT representing ownership in the startup</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button
          onClick={onNext}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <span>Skip to Collateral</span>
        </button>
        <button
          onClick={onCreate}
          disabled={isCreatingStartup}
          className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          {isCreatingStartup ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Creating...</span>
            </>
          ) : (
            'Create Startup'
          )}
        </button>
      </div>
    </div>
  );
}
