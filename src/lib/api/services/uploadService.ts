import axios from "axios";
import { SignatureResponseData } from "@/lib/api/apiTypes";
import { getPigeonEndpoints } from "../config";

export class UploadService {
  constructor(private pigeonEndpoints: ReturnType<typeof getPigeonEndpoints>) {}

  private async generateSignature(): Promise<
    [SignatureResponseData | null, string | null]
  > {
    try {
      const response = await fetch(
        this.pigeonEndpoints.PREFERENCES.PROFILE_SIGNATURE,
        {
          credentials: "include",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const data = (await response.json()) as { data: SignatureResponseData };
      return [data.data, null];
    } catch (error) {
      console.error("Signature generation error:", error);
      return [null, (error as Error).message];
    }
  }

  async uploadImage(fileOrHtmlString: string | File): Promise<string | null> {
    let file: File;

    // Convert string to File if needed
    if (typeof fileOrHtmlString === "string") {
      const blob = new Blob([fileOrHtmlString], {
        type: "image/svg+xml;charset=utf-8",
      });
      file = new File([blob], `${Math.random().toString(36)}.svg`, {
        type: blob.type,
      });
    } else {
      file = fileOrHtmlString;
    }

    const [signatureData, error] = await this.generateSignature();
    if (!signatureData || error) {
      console.error("Failed to generate signature:", error);
      return null;
    }

    const { signature, timestamp } = signatureData;
    const fileType = file.type.startsWith("video") ? "video" : "image";

    const apiKey = process.env.NEXT_PUBLIC_MEDIA_CLOUD_API_KEY;
    const uploadUrl = process.env.NEXT_PUBLIC_MEDIA_CLOUD_URL;

    if (!apiKey || !uploadUrl) {
      console.error("Missing environment variables for media upload");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp.toString());
    formData.append("folder", "pigeon-messanger");
    formData.append("resource_type", fileType);

    try {
      const url =
        fileType === "video" ? uploadUrl.replace("image", "video") : uploadUrl;

      const response = await axios.post(url, formData);
      return response.data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  }

  async uploadMultipleParallel(files: (File | string)[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    const results = await Promise.all(uploadPromises);
    return results.filter(Boolean) as string[];
  }
}
