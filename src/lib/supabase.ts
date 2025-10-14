import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mjsxomsqxrlhoqtdgkds.storage.supabase.co/storage/v1/s3';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey!);

export interface ImageUploadResult {
  url: string;
  path: string;
}

export class SupabaseService {
  static async uploadBase64Image(
    base64Data: string, 
    fileName: string, 
    folder: string = 'images'
  ): Promise<ImageUploadResult> {
    try {
      // Clean the base64 data
      let cleanBase64 = base64Data.trim();
      
      // Remove data URL prefix if present
      if (cleanBase64.startsWith('data:image/')) {
        const base64Match = cleanBase64.match(/data:image\/[^;]+;base64,(.+)/);
        if (base64Match) {
          cleanBase64 = base64Match[1];
        }
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(cleanBase64, 'base64');
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = 'png'; // Assuming PNG for now
      const uniqueFileName = `${fileName}_${timestamp}.${fileExtension}`;
      const filePath = `${folder}/${uniqueFileName}`;

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('plantify-uploads')
        .upload(filePath, buffer, {
          contentType: 'image/png',
          upsert: false
        });

      if (error) {
        throw new Error(`Supabase upload error: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('plantify-uploads')
        .getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        path: filePath
      };
    } catch (error) {
      console.error('Supabase upload error:', error);
      throw new Error(
        `Failed to upload image to Supabase: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  static async uploadCompanyLogo(
    base64Data: string, 
    companyName: string
  ): Promise<ImageUploadResult> {
    // Handle undefined or null company name
    const safeCompanyName = companyName || 'unknown_company';
    const sanitizedName = safeCompanyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 50);
    
    return this.uploadBase64Image(base64Data, `logo_${sanitizedName}`, 'plantify-uploads');
  }

  static async uploadNFTImage(
    base64Data: string, 
    startupId: string
  ): Promise<ImageUploadResult> {
    return this.uploadBase64Image(base64Data, `nft_${startupId}`, 'nfts');
  }

  static async uploadTeamMemberPhoto(
    base64Data: string, 
    memberName: string
  ): Promise<ImageUploadResult> {
    // Handle undefined or null member name
    const safeMemberName = memberName || 'unknown_member';
    const sanitizedName = safeMemberName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 50);
    
    return this.uploadBase64Image(base64Data, `team_${sanitizedName}`, 'team-photos');
  }

  static async uploadInvestorProfilePhoto(
    base64Data: string, 
    investorName: string
  ): Promise<ImageUploadResult> {
    // Handle undefined or null investor name
    const safeInvestorName = investorName || 'unknown_investor';
    const sanitizedName = safeInvestorName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 50);
    
    return this.uploadBase64Image(base64Data, `investor_${sanitizedName}`, 'investor-photos');
  }

  static async uploadCompanyImage(
    base64Data: string, 
    companyName: string,
    imageIndex: number
  ): Promise<ImageUploadResult> {
    // Handle undefined or null company name
    const safeCompanyName = companyName || 'unknown_company';
    const sanitizedName = safeCompanyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 50);
    
    return this.uploadBase64Image(base64Data, `company_${sanitizedName}_${imageIndex}`, 'company-images');
  }

  static async deleteImage(filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from('plantify-uploads')
        .remove([filePath]);

      if (error) {
        console.error('Supabase delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Supabase delete error:', error);
      return false;
    }
  }
}
