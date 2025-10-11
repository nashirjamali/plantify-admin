"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { backendService } from "../../lib/backend";
import Layout from "../../components/Layout";
import { Card, Icon } from "../../components/ui";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalFounders: 0,
    totalInvestors: 0,
    totalStartups: 0,
    totalNFTs: 0,
    totalCollateral: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const loadStats = async () => {
      if (isAuthenticated) {
        try {
          const [nftStats, collateralInfo] = await Promise.all([
            backendService.getNFTStats(),
            backendService.getAllCollateralInfo(),
          ]);

          setStats({
            totalFounders: 0, // Will be updated when we have founder data
            totalInvestors: 0, // Will be updated when we have investor data
            totalStartups: nftStats.totalStartups,
            totalNFTs: nftStats.totalSupply,
            totalCollateral: collateralInfo.length,
          });
        } catch (error) {
          console.error("Failed to load stats:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadStats();
  }, [isAuthenticated]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const statCards = [
    {
      title: "Total Founders",
      value: stats.totalFounders,
      icon: "loading",
    },
    {
      title: "Active Startups",
      value: stats.totalStartups,
      icon: "loading",
    },
    {
      title: "Total NFTs",
      value: stats.totalNFTs,
      icon: "loading",
    },
    {
      title: "Collateral Pools",
      value: stats.totalCollateral,
      icon: "loading",
    },
  ];

  const actionCards = [
    {
      title: "Create Testing Data",
      description: "Generate founder data, create startups, simulate collateral top-up, and update startup status",
      href: "/testing-data",
      icon: "loading",
    },
    {
      title: "Review Startups",
      description: "Review and approve startup applications for the platform",
      href: "/review-startups",
      icon: "check",
    },
  ];

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <Icon name="loading" size="md" className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">Welcome to Plantify Admin</h2>
              <p className="text-black">Manage your platform and review startup applications</p>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <Card key={index} className="hover:shadow-medium transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-black">{card.title}</p>
                  <p className="text-3xl font-bold text-black mt-2">{card.value}</p>
                </div>
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                  <Icon name={card.icon as any} size="md" className="text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {actionCards.map((card, index) => (
            <Card
              key={index}
              onClick={() => router.push(card.href)}
              className="hover:shadow-medium transition-all duration-200 cursor-pointer group border border-gray-200 hover:border-black"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-black transition-colors duration-200">
                  <Icon name={card.icon as any} size="md" className="text-black group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black group-hover:text-gray-700 transition-colors duration-200">
                    {card.title}
                  </h3>
                  <p className="text-black mt-2">{card.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-black group-hover:text-gray-700">
                    <span>Get started</span>
                    <Icon name="arrow-right" size="sm" className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
