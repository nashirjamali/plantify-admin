import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory } from "../declarations/plantify_backend";
import type {
  Founder,
  Investor,
  Startup,
  EnvironmentConfig,
  BalanceResponse,
  TransferAccount,
  TopUpRequest,
  CollateralInfo,
  CollateralProgressResponse,
  MintNFTRequest,
  NFTInfo,
  NFTAccount,
  NFTMetadata,
  FounderRegistrationRequest,
  InvestorRegistrationRequest,
  StartupCreationRequest,
  TransferResponse,
  TopUpResponse,
  MintNFTResponse,
  NFTPurchaseRequest,
  NFTPurchaseResponse,
  PaginatedStartups,
} from "../declarations/plantify_backend/plantify_backend.did";

type NFTStats = {
  nextTokenId: number;
  totalStartups: number;
  totalSupply: number;
};

export interface BackendActor {
  registerFounder: (
    request: FounderRegistrationRequest
  ) => Promise<{ ok: Founder } | { err: string }>;
  registerInvestor: (
    request: InvestorRegistrationRequest
  ) => Promise<{ ok: Investor } | { err: string }>;
  createStartup: (
    request: StartupCreationRequest
  ) => Promise<{ ok: Startup } | { err: string }>;
  createStartupForFounder: (
    founderId: string,
    request: StartupCreationRequest
  ) => Promise<{ ok: Startup } | { err: string }>;
  whoami: () => Promise<Principal>;
  getEnvironmentConfig: () => Promise<EnvironmentConfig>;
  getEnvironment: () => Promise<string>;
  getICPBalance: (account: TransferAccount) => Promise<BalanceResponse>;
  getCkUSDCBalance: (account: TransferAccount) => Promise<BalanceResponse>;
  transferICP: (
    toAccount: TransferAccount,
    amount: number,
    memo?: string
  ) => Promise<TransferResponse>;
  transferCkUSDC: (
    toAccount: TransferAccount,
    amount: number,
    memo?: string
  ) => Promise<TransferResponse>;
  initializeCollateral: (
    startupId: string,
    requiredAmount: number,
    tokenType: string
  ) => Promise<{ ok: string } | { err: string }>;
  topUpCollateral: (
    request: TopUpRequest
  ) => Promise<{ ok: TopUpResponse } | { err: string }>;
  getCollateralStatus: (
    startupId: string
  ) => Promise<{ ok: CollateralInfo } | { err: string }>;
  getCollateralProgress: (
    startupId: string
  ) => Promise<CollateralProgressResponse>;
  getAllCollateralInfo: () => Promise<CollateralInfo[]>;
  mintNFT: (
    request: MintNFTRequest
  ) => Promise<{ ok: MintNFTResponse } | { err: string }>;
  getNFTInfo: (tokenId: number) => Promise<{ ok: NFTInfo } | { err: string }>;
  getNFTsByStartup: (
    startupId: string
  ) => Promise<{ ok: NFTInfo[] } | { err: string }>;
  getAllNFTs: () => Promise<NFTInfo[]>;
  getNFTStats: () => Promise<NFTStats>;
  getFounders: () => Promise<Founder[]>;
  getInvestors: () => Promise<Investor[]>;
  getAllStartups: () => Promise<Startup[]>;
  getStartupsPaginated: (params: { page: bigint; limit: bigint }) => Promise<PaginatedStartups>;
  getStartupDetails: (startupId: string) => Promise<Startup | null>;
  updateStartupStatus: (startupId: string, status: string) => Promise<boolean>;
  completeNFTPurchase: (request: NFTPurchaseRequest, blockIndex: bigint) => Promise<NFTPurchaseResponse>;
  getPlantifyCanisterPrincipal: () => Promise<string>;
  getNFTPrice: (startupId: string) => Promise<{ ok: bigint } | { err: string }>;
}

export class BackendService {
  private actor: BackendActor | null = null;
  private agent: HttpAgent | null = null;

  async initialize(identity: Identity) {
    const canisterId = "oncwy-yqaaa-aaaae-qfzja-cai"; // Mainnet canister ID from dfx.json

    this.agent = new HttpAgent({
      host: "https://ic0.app",
      identity: identity,
    });

    // For mainnet, we don't need to fetch the root key
    if (process.env.NODE_ENV !== "production") {
      await this.agent.fetchRootKey();
    }

    this.actor = Actor.createActor(idlFactory, {
      agent: this.agent,
      canisterId: canisterId,
    }) as BackendActor;
  }

  getActor(): BackendActor | null {
    return this.actor;
  }

  async registerFounder(request: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    experience: string;
    previousBusinesses: string;
    expertise: string;
    linkedIn: string;
    idNumber: string;
    taxNumber: string;
  }) {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.registerFounder(request);
  }

  async registerInvestor(request: {
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
    bio?: string;
    company?: string;
    location?: string;
    occupation?: string;
    profilePhoto?: string;
  }) {
    if (!this.actor) throw new Error("Backend not initialized");
    
    // Convert optional string fields to the expected format
    const formattedRequest = {
      ...request,
      bio: request.bio ? [request.bio] as [] | [string] : [] as [] | [string],
      company: request.company ? [request.company] as [] | [string] : [] as [] | [string],
      location: request.location ? [request.location] as [] | [string] : [] as [] | [string],
      occupation: request.occupation ? [request.occupation] as [] | [string] : [] as [] | [string],
      profilePhoto: request.profilePhoto ? [request.profilePhoto] as [] | [string] : [] as [] | [string],
    };
    
    return await this.actor.registerInvestor(formattedRequest);
  }

  async createStartup(request: StartupCreationRequest) {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.createStartup(request);
  }

  async createStartupForFounder(
    founderId: string,
    request: StartupCreationRequest
  ) {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.createStartupForFounder(founderId, request);
  }

  async whoami() {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.whoami();
  }

  async getEnvironmentConfig() {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.getEnvironmentConfig();
  }

  async getICPBalance(account: TransferAccount) {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.getICPBalance(account);
  }

  async getCkUSDCBalance(account: TransferAccount) {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.getCkUSDCBalance(account);
  }

  async initializeCollateral(
    startupId: string,
    requiredAmount: number,
    tokenType: string
  ) {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.initializeCollateral(
      startupId,
      requiredAmount,
      tokenType
    );
  }

  async topUpCollateral(request: TopUpRequest) {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.topUpCollateral(request);
  }

  async getCollateralStatus(startupId: string) {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.getCollateralStatus(startupId);
  }

  async getCollateralProgress(startupId: string) {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.getCollateralProgress(startupId);
  }

  async getAllCollateralInfo() {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.getAllCollateralInfo();
  }

  async mintNFT(request: MintNFTRequest) {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.mintNFT(request);
  }

  async getNFTInfo(tokenId: number) {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.getNFTInfo(tokenId);
  }

  async getNFTsByStartup(startupId: string) {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.getNFTsByStartup(startupId);
  }

  async getAllNFTs() {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.getAllNFTs();
  }

  async getNFTStats() {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.getNFTStats();
  }

  async getFounders() {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.getFounders();
  }

  async getInvestors() {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.getInvestors();
  }

  async getAllStartups() {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.getAllStartups();
  }

  async getStartupsPaginated(params: { page: number; limit: number }) {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.getStartupsPaginated({
      page: BigInt(params.page),
      limit: BigInt(params.limit)
    });
  }

  async getStartupDetails(startupId: string) {
    if (!this.actor) throw new Error("Backend not initialized");
    const result = await this.actor.getStartupDetails(startupId);
    return result;
  }

  async updateStartupStatus(startupId: string, status: string) {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.updateStartupStatus(startupId, status);
  }

  async completeNFTPurchase(request: {
    startupId: string;
    investorId: string;
    quantity: number;
    memo?: string;
  }, blockIndex: number) {
    if (!this.actor) throw new Error("Backend not initialized");
    
    const purchaseRequest: NFTPurchaseRequest = {
      startupId: request.startupId,
      investorId: request.investorId,
      quantity: BigInt(request.quantity),
      memo: request.memo ? [request.memo] as [] | [string] : [] as [] | [string],
    };
    
    return await this.actor.completeNFTPurchase(purchaseRequest, BigInt(blockIndex));
  }

  async getPlantifyCanisterPrincipal() {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.getPlantifyCanisterPrincipal();
  }

  async getNFTPrice(startupId: string) {
    if (!this.actor) throw new Error("Backend not initialized");
    return await this.actor.getNFTPrice(startupId);
  }

  async mintNFTForStartup(
    startupId: string,
    startup: Startup,
    toPrincipal: Principal
  ) {
    if (!this.actor) throw new Error("Backend not initialized");

    // Create NFT account for the recipient
    const nftAccount: NFTAccount = {
      owner: toPrincipal,
      subaccount: [],
    };

    // Create NFT metadata
    const metadata: NFTMetadata = {
      tokenUri: `https://plantify.ic0.app/startup/${startupId}`,
      name: [startup.startupName || `Startup ${startupId}`],
      description: [startup.description || 'Plantify active startup NFT'],
      attributes: [[
        ['startup_id', startupId],
        ['status', startup.status || 'approved'],
        ['sector', startup.sector || 'Unknown'],
        ['founded_year', startup.foundedYear || 'Unknown'],
        ['funding_goal', startup.fundingGoal || '0'],
        ['company_type', startup.companyType || 'Startup']
      ]],
      image: startup.nftImage && startup.nftImage.length > 0 ? startup.nftImage : 
             (startup.companyLogo && startup.companyLogo.length > 0 ? startup.companyLogo : [])
    };

    // Create mint request
    const mintRequest: MintNFTRequest = {
      startupId: startupId,
      metadata: metadata,
      memo: [`Minted for active startup: ${startup.startupName || startupId}`],
      toAccount: nftAccount,
    };

    return await this.actor.mintNFT(mintRequest);
  }
}

export const backendService = new BackendService();
