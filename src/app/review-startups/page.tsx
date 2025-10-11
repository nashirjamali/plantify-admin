"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Layout from "../../components/Layout";
import type { Startup } from "../../declarations/plantify_backend/plantify_backend.did";

export default function ReviewStartupsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const loadData = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const startupsData: Startup[] = [];
        setStartups(startupsData);
      } catch (error) {
        console.error("Failed to load startups:", error);
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

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      // This would need to be implemented in the backend
      // await backendService.approveStartup(startupId);
      alert("Startup approved successfully!");
      await loadData();
    } catch (error) {
      console.error("Failed to approve startup:", error);
      alert("Failed to approve startup. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      // This would need to be implemented in the backend
      // await backendService.rejectStartup(startupId);
      alert("Startup rejected successfully!");
      await loadData();
    } catch (error) {
      console.error("Failed to reject startup:", error);
      alert("Failed to reject startup. Please try again.");
    } finally {
      setIsRejecting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-black text-white';
      case 'rejected':
        return 'bg-gray-200 text-black';
      case 'pending':
        return 'bg-gray-100 text-black';
      default:
        return 'bg-gray-100 text-black';
    }
  };

  const filteredStartups = startups.filter(startup => {
    if (filter === 'all') return true;
    return startup.status === filter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black">Loading startups...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout title="Review Startups">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black">Startup Review</h2>
              <p className="text-black">Review and approve startup applications</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-black">
                Total: {startups.length} startups
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-black">Filter by status:</span>
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All', count: startups.length },
                { key: 'pending', label: 'Pending', count: startups.filter(s => s.status === 'pending').length },
                { key: 'approved', label: 'Approved', count: startups.filter(s => s.status === 'approved').length },
                { key: 'rejected', label: 'Rejected', count: startups.filter(s => s.status === 'rejected').length },
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key as 'all' | 'pending' | 'approved' | 'rejected')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    filter === filterOption.key
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label} ({filterOption.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Startups List */}
        <div className="space-y-4">
          {filteredStartups.length === 0 ? (
            <div className="bg-white rounded-xl shadow-soft p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-black">No startups found</h3>
              <p className="mt-1 text-sm text-black">
                {filter === 'all' ? 'No startups have been created yet.' : `No startups with ${filter} status.`}
              </p>
            </div>
          ) : (
            filteredStartups.map((startup, index) => (
              <div key={index} className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <h3 className="text-lg font-semibold text-black">
                        {startup.id || "Unknown Company"}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(startup.status || 'pending')}`}>
                        {startup.status || 'Pending'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-black">Sector</p>
                        <p className="text-sm text-black">{startup.sector || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">Founded Year</p>
                        <p className="text-sm text-black">{startup.foundedYear || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">Status</p>
                        <p className="text-sm text-black">{startup.status || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">Competitive Advantage</p>
                        <p className="text-sm text-black">{startup.competitiveAdvantage || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">Use of Funds</p>
                        <p className="text-sm text-black">{startup.useOfFunds || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">Periodic Profit Sharing</p>
                        <p className="text-sm text-black">{startup.periodicProfitSharing || "Not specified"}</p>
                      </div>
                    </div>

                    {startup.description && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-black mb-1">Description</p>
                        <p className="text-sm text-black line-clamp-3">{startup.description}</p>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-black">
                      {startup.website && (
                        <a
                          href={startup.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-black hover:text-gray-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span>Website</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {(startup.status === 'pending' || !startup.status) && (
                      <>
                        <button
                          onClick={() => handleApprove()}
                          disabled={isApproving}
                          className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                        >
                          {isApproving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Approving...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Approve</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject()}
                          disabled={isRejecting}
                          className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                        >
                          {isRejecting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                              <span>Rejecting...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span>Reject</span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => setSelectedStartup(startup)}
                      className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Startup Details Modal */}
        {selectedStartup && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setSelectedStartup(null)}></div>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-black">
                      {selectedStartup.id || "Unknown Company"}
                    </h3>
                    <button
                      onClick={() => setSelectedStartup(null)}
                      className="text-black hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-black mb-2">Company Information</h4>
                        <div className="space-y-2">
                          <p><span className="font-medium">Sector:</span> {selectedStartup.sector || "Not specified"}</p>
                          <p><span className="font-medium">Founded Year:</span> {selectedStartup.foundedYear || "Not specified"}</p>
                          <p><span className="font-medium">Status:</span> {selectedStartup.status || "Not specified"}</p>
                          <p><span className="font-medium">Competitive Advantage:</span> {selectedStartup.competitiveAdvantage || "Not specified"}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-black mb-2">Additional Information</h4>
                        <div className="space-y-2">
                          <p><span className="font-medium">Use of Funds:</span> {selectedStartup.useOfFunds || "Not specified"}</p>
                          <p><span className="font-medium">Periodic Profit Sharing:</span> {selectedStartup.periodicProfitSharing || "Not specified"}</p>
                          <p><span className="font-medium">Business Plan:</span> {selectedStartup.businessPlan?.[0] || "Not specified"}</p>
                          <p><span className="font-medium">Website:</span> {selectedStartup.website || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                    
                    {selectedStartup.description && (
                      <div>
                        <h4 className="text-sm font-medium text-black mb-2">Description</h4>
                        <p className="text-sm text-black">{selectedStartup.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
