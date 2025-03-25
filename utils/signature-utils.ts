import { type StdSignature } from "@cosmjs/amino";
import { sha256 } from "@cosmjs/crypto";
import { fromBase64, toHex } from "@cosmjs/encoding";
import { Secp256k1 } from "@cosmjs/crypto";

/**
 * Verifies a StdSignature against a message
 * @param signature The StdSignature to verify
 * @param message The original message that was signed
 * @returns True if the signature is valid, false otherwise
 */
export async function verifyStdSignature(
  signature: StdSignature,
  message: Uint8Array
): Promise<boolean> {
  try {
    // Hash the message with SHA256 (standard for Cosmos)
    const messageHash = sha256(message);

    // Extract the signature and pubkey from the StdSignature
    const signatureBytes = fromBase64(signature.signature);
    const pubkeyBytes = fromBase64(signature.pub_key.value);

    // Verify the signature
    return await Secp256k1.verifySignature(
      signatureBytes,
      messageHash,
      pubkeyBytes
    );
  } catch (error) {
    console.error("Signature verification failed:", error);
    return false;
  }
}

/**
 * Prints details about a StdSignature for debugging
 * @param signature The StdSignature to inspect
 */
export function inspectStdSignature(signature: StdSignature): void {
  console.log("StdSignature Details:");
  console.log("  Public Key Type:", signature.pub_key.type);
  console.log("  Public Key Value (base64):", signature.pub_key.value);
  console.log("  Signature (base64):", signature.signature);

  try {
    // Convert base64 values to hex for easier comparison
    const pubkeyHex = toHex(fromBase64(signature.pub_key.value));
    const signatureHex = toHex(fromBase64(signature.signature));

    console.log("  Public Key (hex):", pubkeyHex);
    console.log("  Signature (hex):", signatureHex);
  } catch (error) {
    console.error("Error converting values:", error);
  }
}
