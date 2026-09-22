import QRCode from "qrcode";

export interface QrOptions {
  color?: {
    dark?: string;
    light?: string;
  };
  width?: number;
  margin?: number;
}

export async function generateQrDataUrl(
  text: string,
  options?: QrOptions
): Promise<string> {
  return QRCode.toDataURL(text, {
    width: options?.width || 500,
    margin: options?.margin ?? 2,
    color: {
      dark: options?.color?.dark || "#000000",
      light: options?.color?.light || "#ffffff",
    },
    errorCorrectionLevel: "H", // High redundancy allows placing logo in center!
  });
}

export async function generateQrSvg(
  text: string,
  options?: QrOptions
): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    width: options?.width || 500,
    margin: options?.margin ?? 2,
    color: {
      dark: options?.color?.dark || "#000000",
      light: options?.color?.light || "#ffffff",
    },
    errorCorrectionLevel: "H",
  });
}
