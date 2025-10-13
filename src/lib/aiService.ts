export interface AIGeneratedFounder {
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
}

export interface NFTImagePrompt {
  object: {
    type: string;
    container: string;
    details: {
      leaves_color: string;
      body_shape: string;
      face_expression: string;
    };
  };
  environment: {
    lighting: string;
    background: {
      type: string;
      colors: string[];
    };
  };
  style: {
    theme: string;
    aesthetic: string[];
    use_case: string;
    render_style: string;
  };
  composition: {
    focus: string;
    mood: string;
  };
  metadata: {
    version: string;
    language: string;
    customizable_fields: string[];
  };
}

export interface GeneratedImage {
  imageUrl: string;
  prompt: string;
  metadata: NFTImagePrompt;
}

export interface StartupFormData {
  founderId: string;
  startupName: string;
  description: string;
  sector: string;
  companyType: string;
  status: string;
  targetMarket: string;
  fundingGoal: string;
  periodicProfitSharing: string;
  website: string;
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
  businessPlan?: string;
  financialProjections?: string;
  companyImages: string[];
  companyLogo?: string;
  nftImage?: string;
  builtByCaffeineAI?: boolean;
  teamMembers: Array<{
    name: string;
    role: string;
    background: string;
    linkedin: string;
    email: string;
    isFounder: boolean;
    photo: string;
  }>;
}

export interface AIGeneratedTeamMember {
  name: string;
  role: string;
  background: string;
  linkedin: string;
  email: string;
  isFounder: boolean;
  photo: string; // Supabase URL for team member photo
}

export interface AIGeneratedStartup {
  startupName: string;
  description: string;
  sector: string;
  companyType: string;
  status: string;
  targetMarket: string;
  fundingGoal: string;
  periodicProfitSharing: string;
  website: string;
  companyLogo: string; // Supabase URL for logo
  nftImage: string; // Supabase URL for NFT image
  companyImages: string[]; // Supabase URLs for company images
  teamMembers: AIGeneratedTeamMember[];
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
  // Optional fields
  businessPlan?: string;
  financialProjections?: string;
  builtByCaffeineAI?: boolean;
}

import { SupabaseService } from "./supabase";

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const IMAGE_MODEL = "google/gemini-2.5-flash-image-preview";

/**
 * Generates a plant character NFT prompt based on startup information
 */
export function generateNFTPrompt(formData: StartupFormData): NFTImagePrompt {
  const getPlantCharacteristics = (sector: string) => {
    const sectorMap: Record<
      string,
      { color: string; shape: string; expression: string }
    > = {
      Technology: {
        color: 'electric blue',
        shape: 'tall and sleek',
        expression: 'confident with tech-inspired eyes',
      },
      Healthcare: {
        color: 'healing green',
        shape: 'rounded and nurturing',
        expression: 'caring with gentle smile',
      },
      Finance: {
        color: 'golden yellow',
        shape: 'strong and stable',
        expression: 'wise with determined look',
      },
      Education: {
        color: 'bright orange',
        shape: 'curious and growing',
        expression: 'eager with learning sparkle',
      },
      'E-commerce': {
        color: 'vibrant purple',
        shape: 'dynamic and flexible',
        expression: 'energetic with shopping excitement',
      },
      'Food & Beverage': {
        color: 'fresh mint green',
        shape: 'plump and healthy',
        expression: 'satisfied with content smile',
      },
      Energy: {
        color: 'solar yellow',
        shape: 'radiant and powerful',
        expression: 'bright with energy glow',
      },
      Transportation: {
        color: 'speed red',
        shape: 'streamlined and fast',
        expression: 'focused with movement lines',
      },
      'Real Estate': {
        color: 'earth brown',
        shape: 'solid and grounded',
        expression: 'reliable with foundation strength',
      },
      Entertainment: {
        color: 'rainbow spectrum',
        shape: 'playful and varied',
        expression: 'joyful with entertainment sparkle',
      },
    };

    return (
      sectorMap[sector] || {
        color: 'bright green',
        shape: 'small soil mound',
        expression: 'smiling with big round eyes and blushing cheeks',
      }
    );
  };

  const getContainerStyle = (companyType: string) => {
    const containerMap: Record<string, string> = {
      Startup: 'modern transparent glass pot with geometric edges',
      Corporation: 'premium ceramic pot with elegant design',
      'Non-profit': 'eco-friendly biodegradable pot',
      Partnership: 'collaborative dual-section pot',
      LLC: 'professional business-style pot',
      'Sole Proprietorship': 'personal handcrafted pot',
    };

    return containerMap[companyType] || 'round transparent glass pot';
  };

  const getBackgroundColors = (fundingGoal: string) => {
    const goal = Number(fundingGoal) || 0;
    if (goal < 10000) return ['soft pink', 'light blue'];
    if (goal < 100000) return ['warm orange', 'golden yellow'];
    if (goal < 1000000) return ['rich purple', 'deep blue'];
    return ['premium gold', 'platinum silver'];
  };

  const getLightingStyle = (teamSize: number) => {
    if (teamSize === 1) return 'focused spotlight with gentle glow';
    if (teamSize <= 3) return 'warm team lighting with collaborative shadows';
    if (teamSize <= 10) return 'bright group lighting with energy highlights';
    return 'powerful stage lighting with professional highlights';
  };

  const plantChar = getPlantCharacteristics(formData.sector);
  const container = getContainerStyle(formData.companyType);
  const backgroundColors = getBackgroundColors(formData.fundingGoal);
  const teamSize = formData.teamMembers.length + 1;
  const lighting = getLightingStyle(teamSize);

  return {
    object: {
      type: 'plant character',
      container,
      details: {
        leaves_color: plantChar.color,
        body_shape: plantChar.shape,
        face_expression: plantChar.expression,
      },
    },
    environment: {
      lighting,
      background: {
        type: 'gradient',
        colors: backgroundColors,
      },
    },
    style: {
      theme: 'kawaii',
      aesthetic: ['soft', 'minimal', 'colorful', 'adorable'],
      use_case: 'collectible NFT card illustration',
      render_style: '2D soft digital illustration',
    },
    composition: {
      focus: 'centered subject',
      mood: 'happy and cute',
    },
    metadata: {
      version: '1.0',
      language: 'en',
      customizable_fields: [
        'leaves_color',
        'background.colors',
        'face_expression',
        'style.theme',
      ],
    },
  };
}

/**
 * Generates a text prompt for the AI model based on the NFT prompt structure
 */
export function generateTextPrompt(nftPrompt: NFTImagePrompt): string {
  const { object, environment, style, composition } = nftPrompt;

  return `Create a ${style.render_style} of a ${object.type} in a ${object.container}. 
  
  Character details:
  - Leaves: ${object.details.leaves_color}
  - Body shape: ${object.details.body_shape}
  - Face: ${object.details.face_expression}
  
  Environment:
  - Lighting: ${environment.lighting}
  - Background: ${environment.background.type} with colors ${environment.background.colors.join(' and ')}
  
  Style:
  - Theme: ${style.theme}
  - Aesthetic: ${style.aesthetic.join(', ')}
  - Use case: ${style.use_case}
  
  Composition:
  - Focus: ${composition.focus}
  - Mood: ${composition.mood}
  
  Make it perfect for a collectible NFT card - ${style.aesthetic.join(', ')} and ${composition.mood}.`;
}

/**
 * Calls the OpenRouter API to generate an NFT image
 */
export async function generateNFTImage(
  formData: StartupFormData
): Promise<GeneratedImage> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured');
  }

  try {
    const nftPrompt = generateNFTPrompt(formData);

    const textPrompt = generateTextPrompt(nftPrompt);

    console.log('Generating NFT image with prompt:', textPrompt);

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        messages: [
          {
            role: 'user',
            content: textPrompt,
          },
        ],
        modalities: ['image', 'text'],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    if (result.choices && result.choices.length > 0) {
      const message = result.choices[0].message;
      if (message.images && message.images.length > 0) {
        const imageUrl = message.images[0].image_url.url;

        return {
          imageUrl,
          prompt: textPrompt,
          metadata: nftPrompt,
        };
      }
    }

    throw new Error('No image generated in the response');
  } catch (error) {
    console.error('Error generating NFT image:', error);
    throw new Error(
      `Failed to generate NFT image: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export class AIService {
  private static readonly OPENROUTER_API_URL =
    "https://openrouter.ai/api/v1/chat/completions";
  private static readonly API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  private static readonly SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://plantify-admin.vercel.app";

  private static cleanupBase64Data(data: string): string {
    let cleaned = data.trim();

    // Remove any markdown code blocks
    if (cleaned.includes("```")) {
      const codeBlockMatch = cleaned.match(
        /```(?:[a-z]*\n)?(data:image\/png;base64,[A-Za-z0-9+/=]+)/i
      );
      if (codeBlockMatch) {
        cleaned = codeBlockMatch[1];
      }
    }

    // Look for the base64 pattern
    const base64Match = cleaned.match(
      /data:image\/png;base64,([A-Za-z0-9+/=]+)/i
    );
    if (base64Match) {
      cleaned = `data:image/png;base64,${base64Match[1]}`;
    } else if (cleaned.startsWith("data:image/png;base64,")) {
      // Already in correct format
    } else {
      // If no proper format found, try to extract just the base64 part
      const justBase64 = cleaned.match(/([A-Za-z0-9+/=]+)/);
      if (justBase64) {
        cleaned = `data:image/png;base64,${justBase64[1]}`;
      } else {
        // Fallback to default 1x1 pixel PNG
        cleaned =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
      }
    }

    return cleaned;
  }

  static async generateFounderData(): Promise<AIGeneratedFounder> {
    if (!this.API_KEY) {
      throw new Error("OpenRouter API key not configured");
    }

    const prompt = `Generate realistic founder registration data for testing a startup platform. Return ONLY a valid JSON object with these exact fields:
{
  "fullName": "string",
  "email": "string", 
  "phone": "string",
  "address": "string",
  "experience": "string (number of years)",
  "previousBusinesses": "string",
  "expertise": "string",
  "linkedIn": "string (LinkedIn profile URL)",
  "idNumber": "string (realistic ID number)",
  "taxNumber": "string (realistic tax number)"
}

Make the data realistic and diverse. Use different industries, experience levels, and backgrounds.`;

    try {
      const response = await fetch(this.OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          "HTTP-Referer": this.SITE_URL,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.8,
          max_tokens: 1000,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        throw new Error(
          `AI API request failed: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();

      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("No content received from AI API");
      }

      let jsonContent = content.trim();

      const jsonMatch = jsonContent.match(
        /```(?:json)?\s*(\{[\s\S]*?\})\s*```/
      );
      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      } else {
        if (jsonContent.startsWith("```json")) {
          jsonContent = jsonContent
            .replace(/^```json\s*/, "")
            .replace(/\s*```$/, "");
        } else if (jsonContent.startsWith("```")) {
          jsonContent = jsonContent
            .replace(/^```\s*/, "")
            .replace(/\s*```$/, "");
        }
      }

      console.log("Cleaned JSON:", jsonContent);

      const founderData = JSON.parse(jsonContent);

      const requiredFields = [
        "fullName",
        "email",
        "phone",
        "address",
        "experience",
        "previousBusinesses",
        "expertise",
        "linkedIn",
        "idNumber",
        "taxNumber",
      ];

      for (const field of requiredFields) {
        if (!founderData[field] || typeof founderData[field] !== "string") {
          throw new Error(`Invalid or missing field: ${field}`);
        }
      }

      return founderData as AIGeneratedFounder;
    } catch (error) {
      console.error("AI generation error:", error);
      throw new Error(
        `Failed to generate founder data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  static async generateStartupData(): Promise<AIGeneratedStartup> {
    if (!this.API_KEY) {
      throw new Error("OpenRouter API key not configured");
    }

    const prompt = `Generate realistic startup data for testing a startup platform. Return ONLY a valid JSON object with these exact fields:
{
  "startupName": "string",
  "description": "string",
  "sector": "string",
  "companyType": "string (one of: Startup, Corporation, Non-profit, Partnership, LLC, Sole Proprietorship)",
  "status": "string (one of: pending, approved, rejected, active)",
  "targetMarket": "string",
  "fundingGoal": "string (number as string)",
  "periodicProfitSharing": "string (percentage as string)",
  "website": "string (URL)",
  "foundedYear": "string (year as string)",
  "competitiveAdvantage": "string",
  "useOfFunds": "string",
  "revenueModel": "string",
  "solution": "string",
  "marketingStrategy": "string",
  "legalDocuments": "string",
  "monthlyRevenue": "string (number as string)",
  "operationalProcess": "string",
  "advisors": "string",
  "nftPrice": "string (number as string)",
  "location": "string",
  "monthlyExpenses": "string (number as string)",
  "problemStatement": "string",
  "founderBackground": "string",
  "businessPlan": "string (optional)",
  "financialProjections": "string (optional)",
  "builtByCaffeineAI": false,
  "teamMembers": [
    {
      "name": "string",
      "role": "string",
      "background": "string",
      "linkedin": "string (LinkedIn URL)",
      "email": "string",
      "isFounder": true
    }
  ]
}

Make the data realistic and diverse. Use different sectors like fintech, healthtech, edtech, e-commerce, SaaS, etc. Generate 2-4 team members including at least one founder (isFounder: true) and other roles like CTO, CMO, COO, etc.`;

    try {
      const response = await fetch(this.OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          "HTTP-Referer": this.SITE_URL,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.8,
          max_tokens: 1500,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        throw new Error(
          `AI API request failed: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();

      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("No content received from AI API");
      }

      let jsonContent = content.trim();

      const jsonMatch = jsonContent.match(
        /```(?:json)?\s*(\{[\s\S]*?\})\s*```/
      );
      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      } else {
        if (jsonContent.startsWith("```json")) {
          jsonContent = jsonContent
            .replace(/^```json\s*/, "")
            .replace(/\s*```$/, "");
        } else if (jsonContent.startsWith("```")) {
          jsonContent = jsonContent
            .replace(/^```\s*/, "")
            .replace(/\s*```$/, "");
        }
      }

      console.log("Cleaned JSON:", jsonContent);

      const startupData = JSON.parse(jsonContent);

      // Generate company logo using Gemini
      const companyLogo = await this.generateCompanyLogo(
        startupData.startupName,
        startupData.sector
      );
      startupData.companyLogo = companyLogo;

      // Generate NFT image using the new function
      const formData: StartupFormData = {
        founderId: "temp",
        startupName: startupData.startupName,
        description: startupData.description,
        sector: startupData.sector,
        companyType: startupData.companyType,
        status: startupData.status,
        targetMarket: startupData.targetMarket,
        fundingGoal: startupData.fundingGoal,
        periodicProfitSharing: startupData.periodicProfitSharing,
        website: startupData.website,
        foundedYear: startupData.foundedYear,
        competitiveAdvantage: startupData.competitiveAdvantage,
        useOfFunds: startupData.useOfFunds,
        revenueModel: startupData.revenueModel,
        solution: startupData.solution,
        marketingStrategy: startupData.marketingStrategy,
        legalDocuments: startupData.legalDocuments,
        monthlyRevenue: startupData.monthlyRevenue,
        operationalProcess: startupData.operationalProcess,
        advisors: startupData.advisors,
        nftPrice: startupData.nftPrice,
        location: startupData.location,
        monthlyExpenses: startupData.monthlyExpenses,
        problemStatement: startupData.problemStatement,
        founderBackground: startupData.founderBackground,
        businessPlan: startupData.businessPlan,
        financialProjections: startupData.financialProjections,
        companyImages: [],
        companyLogo: "",
        nftImage: "",
        builtByCaffeineAI: startupData.builtByCaffeineAI,
        teamMembers: startupData.teamMembers.map((member: AIGeneratedTeamMember) => ({
          name: member.name,
          role: member.role,
          background: member.background,
          linkedin: member.linkedin,
          email: member.email,
          isFounder: member.isFounder,
          photo: ""
        }))
      };

      const nftResult = await generateNFTImage(formData);
      startupData.nftImage = nftResult.imageUrl;

      // Generate team member photos
      for (let i = 0; i < startupData.teamMembers.length; i++) {
        const member = startupData.teamMembers[i];
        const photo = await this.generateTeamMemberPhoto(
          member.name,
          member.role,
          member.background
        );
        startupData.teamMembers[i].photo = photo;
      }

      // Generate company images (2-4 images)
      const companyImages = await this.generateCompanyImages(
        startupData.startupName,
        startupData.sector,
        3 // Generate 3 company images
      );
      startupData.companyImages = companyImages;

      const requiredFields = [
        "startupName",
        "description",
        "sector",
        "companyType",
        "status",
        "targetMarket",
        "fundingGoal",
        "periodicProfitSharing",
        "website",
        "companyLogo",
        "nftImage",
        "companyImages",
        "teamMembers",
        "foundedYear",
        "competitiveAdvantage",
        "useOfFunds",
        "revenueModel",
        "solution",
        "marketingStrategy",
        "legalDocuments",
        "monthlyRevenue",
        "operationalProcess",
        "advisors",
        "nftPrice",
        "location",
        "monthlyExpenses",
        "problemStatement",
        "founderBackground",
      ];

      for (const field of requiredFields) {
        if (field === "teamMembers" || field === "companyImages") {
          if (
            !startupData[field] ||
            !Array.isArray(startupData[field]) ||
            startupData[field].length === 0
          ) {
            throw new Error(`Invalid or missing field: ${field}`);
          }
        } else {
          if (!startupData[field] || typeof startupData[field] !== "string") {
            throw new Error(`Invalid or missing field: ${field}`);
          }
        }
      }

      return startupData as AIGeneratedStartup;
    } catch (error) {
      console.error("AI generation error:", error);
      throw new Error(
        `Failed to generate startup data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  static async generateCompanyLogo(
    companyName: string,
    industry: string
  ): Promise<string> {
    if (!this.API_KEY) {
      throw new Error("OpenRouter API key not configured");
    }

    const prompt = `Generate a professional company logo for a startup.
Company Details:
- Company Name: ${companyName}
- Industry: ${industry}

Create a clean, modern logo that represents the company's brand and industry.`;

    try {
      const response = await fetch(this.OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          "HTTP-Referer": this.SITE_URL,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          modalities: ["image", "text"],
        }),
      });

      if (!response.ok) {
        throw new Error(
          `AI API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Check for images in the new response format
      const images = data.choices?.[0]?.message?.images;
      if (images && images.length > 0 && images[0]?.image_url?.url) {
        const base64Image = images[0].image_url.url;
        const cleanedBase64 = this.cleanupBase64Data(base64Image);

        // Upload to Supabase and return URL
        const uploadResult = await SupabaseService.uploadCompanyLogo(
          cleanedBase64,
          companyName
        );
        return uploadResult.url;
      }

      // Fallback to old format parsing
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("No content received from AI API");
      }

      // Parse the AI response to get color scheme
      let colorScheme;
      try {
        colorScheme = JSON.parse(content);
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        // Fallback to default colors
        colorScheme = {
          primaryColor: "#3B82F6",
          secondaryColor: "#10B981",
          theme: "professional",
          symbols: ["logo", "brand", "company"],
        };
      }

      // Generate a 1x1 pixel PNG with the AI-suggested colors and upload to Supabase
      const fallbackBase64 = this.generateColoredPixel(
        colorScheme.primaryColor
      );
      const uploadResult = await SupabaseService.uploadCompanyLogo(
        fallbackBase64,
        companyName
      );
      return uploadResult.url;
    } catch (error) {
      console.error("Company logo generation error:", error);
      // Return a fallback 1x1 pixel PNG uploaded to Supabase
      const fallbackBase64 = this.generateColoredPixel("#3B82F6");
      const uploadResult = await SupabaseService.uploadCompanyLogo(
        fallbackBase64,
        companyName
      );
      return uploadResult.url;
    }
  }


  static async generateTeamMemberPhoto(
    name: string,
    role: string,
    background: string
  ): Promise<string> {
    if (!this.API_KEY) {
      throw new Error("OpenRouter API key not configured");
    }

    const prompt = `Generate a professional headshot photo for a team member.
Team Member Details:
- Name: ${name}
- Role: ${role}
- Background: ${background}

Create a professional, business-appropriate headshot that represents this team member's role and background.`;

    try {
      const response = await fetch(this.OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          "HTTP-Referer": this.SITE_URL,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          modalities: ["image", "text"],
        }),
      });

      if (!response.ok) {
        throw new Error(
          `AI API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Check for images in the new response format
      const images = data.choices?.[0]?.message?.images;
      if (images && images.length > 0 && images[0]?.image_url?.url) {
        const base64Image = images[0].image_url.url;
        const cleanedBase64 = this.cleanupBase64Data(base64Image);

        // Upload to Supabase and return URL
        const uploadResult = await SupabaseService.uploadTeamMemberPhoto(
          cleanedBase64,
          name
        );
        return uploadResult.url;
      }

      // Fallback to default professional photo
      const fallbackBase64 = this.generateColoredPixel("#3B82F6");
      const uploadResult = await SupabaseService.uploadTeamMemberPhoto(
        fallbackBase64,
        name
      );
      return uploadResult.url;
    } catch (error) {
      console.error("Team member photo generation error:", error);
      // Return a fallback professional photo uploaded to Supabase
      const fallbackBase64 = this.generateColoredPixel("#3B82F6");
      const uploadResult = await SupabaseService.uploadTeamMemberPhoto(
        fallbackBase64,
        name
      );
      return uploadResult.url;
    }
  }

  static async generateCompanyImages(
    companyName: string,
    sector: string,
    count: number = 3
  ): Promise<string[]> {
    if (!this.API_KEY) {
      throw new Error("OpenRouter API key not configured");
    }

    const images: string[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const prompt = `Generate a professional company image for a startup.
Company Details:
- Company Name: ${companyName}
- Sector: ${sector}
- Image Type: ${i === 0 ? 'Office/Workspace' : i === 1 ? 'Product/Service' : 'Team/Culture'}

Create a professional, modern image that represents the company's brand and sector.`;

        const response = await fetch(this.OPENROUTER_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.API_KEY}`,
            "HTTP-Referer": this.SITE_URL,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            modalities: ["image", "text"],
          }),
        });

        if (!response.ok) {
          throw new Error(
            `AI API request failed: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        // Check for images in the response
        const responseImages = data.choices?.[0]?.message?.images;
        if (responseImages && responseImages.length > 0 && responseImages[0]?.image_url?.url) {
          const base64Image = responseImages[0].image_url.url;
          const cleanedBase64 = this.cleanupBase64Data(base64Image);

          // Upload to Supabase and get URL
          const uploadResult = await SupabaseService.uploadCompanyImage(
            cleanedBase64,
            companyName,
            i
          );
          images.push(uploadResult.url);
        } else {
          // Fallback to default image
          const fallbackBase64 = this.generateColoredPixel("#3B82F6");
          const uploadResult = await SupabaseService.uploadCompanyImage(
            fallbackBase64,
            companyName,
            i
          );
          images.push(uploadResult.url);
        }
      } catch (error) {
        console.error(`Company image ${i} generation error:`, error);
        // Add fallback image
        const fallbackBase64 = this.generateColoredPixel("#3B82F6");
        const uploadResult = await SupabaseService.uploadCompanyImage(
          fallbackBase64,
          companyName,
          i
        );
        images.push(uploadResult.url);
      }
    }

    return images;
  }

  private static generateColoredPixel(primaryColor: string): string {
    // Map colors to different 1x1 pixel PNGs
    // Each color gets a unique but simple 1x1 pixel PNG
    const colorMap: { [key: string]: string } = {
      // Blue tones (Fintech, Trust, Technology)
      "3B82F6":
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "1E40AF":
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "1E3A8A":
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",

      // Green tones (Health, Growth, Environment)
      "10B981":
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "059669":
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "047857":
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",

      // Purple tones (Creativity, Innovation, EdTech)
      "8B5CF6":
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "7C3AED":
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "6D28D9":
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",

      // Red tones (Energy, Commerce, Urgency)
      EF4444:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      DC2626:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      B91C1C:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",

      // Orange tones (Warmth, Creativity, Learning)
      F97316:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      EA580C:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      C2410C:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",

      // Yellow/Gold tones (Wealth, Success, Innovation)
      F59E0B:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      D97706:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      B45309:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    };

    // Extract color without # and normalize
    const color = primaryColor.replace("#", "").toUpperCase();

    // Return a color-specific 1x1 pixel PNG, or default blue if color not found
    return colorMap[color] || colorMap["3B82F6"];
  }
}
