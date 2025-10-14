import { Button } from "../ui";

interface InvestorFormProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    investmentExperience: string;
    riskTolerance: string;
    investmentGoals: string;
    availableCapital: string;
    monthlyBudget: string;
    bio: string;
    company: string;
    location: string;
    occupation: string;
    profilePhoto: string;
  };
  isGeneratingAI: boolean;
  isRegistering: boolean;
  onInputChange: (field: string, value: string) => void;
  onGenerateAI: () => void;
  onRegister: () => void;
  onNext: () => void;
}

export default function InvestorForm({
  formData,
  isGeneratingAI,
  isRegistering,
  onInputChange,
  onGenerateAI,
  onRegister,
  onNext,
}: InvestorFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Register Testing Investor</h2>
        <Button
          onClick={onGenerateAI}
          disabled={isGeneratingAI}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isGeneratingAI ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              Generating...
            </>
          ) : (
            <>
              <span>🤖</span>
              Generate with AI
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => onInputChange("fullName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => onInputChange("phone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => onInputChange("country", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter country"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => onInputChange("city", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter city"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Experience *
          </label>
          <input
            type="text"
            value={formData.investmentExperience}
            onChange={(e) => onInputChange("investmentExperience", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 5 years"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risk Tolerance *
          </label>
          <select
            value={formData.riskTolerance}
            onChange={(e) => onInputChange("riskTolerance", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select risk tolerance</option>
            <option value="Conservative">Conservative</option>
            <option value="Moderate">Moderate</option>
            <option value="Aggressive">Aggressive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Capital *
          </label>
          <input
            type="text"
            value={formData.availableCapital}
            onChange={(e) => onInputChange("availableCapital", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 100000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Budget *
          </label>
          <input
            type="text"
            value={formData.monthlyBudget}
            onChange={(e) => onInputChange("monthlyBudget", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 5000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => onInputChange("company", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occupation
          </label>
          <input
            type="text"
            value={formData.occupation}
            onChange={(e) => onInputChange("occupation", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter occupation"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Goals *
          </label>
          <textarea
            value={formData.investmentGoals}
            onChange={(e) => onInputChange("investmentGoals", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your investment goals"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => onInputChange("bio", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter bio"
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button
          onClick={onRegister}
          disabled={isRegistering}
          className="flex items-center gap-2"
        >
          {isRegistering ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Registering...
            </>
          ) : (
            "Register Investor"
          )}
        </Button>

        <Button
          onClick={onNext}
          variant="outline"
        >
          Skip to Next Step
        </Button>
      </div>
    </div>
  );
}
