import { makeSignBytes, type OfflineDirectSigner } from "@cosmjs/proto-signing";
import {
  type AccountData,
  type DirectSignResponse,
} from "@cosmjs/proto-signing";
import { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { publicKeyToAddress } from "./cosmjs";
import { sha256 } from "@cosmjs/crypto";
import { fromHex, toHex } from "@cosmjs/encoding";
import { encodeSecp256k1Pubkey, encodeSecp256k1Signature } from "@cosmjs/amino";

export class SilentWallet implements OfflineDirectSigner {
  public readonly address: string;
  private readonly pubkey: string;
  private readonly pubkeyBytes: Uint8Array;

  constructor(pubkey: string) {
    this.pubkey = pubkey;
    this.pubkeyBytes = new Uint8Array(Buffer.from(pubkey, "hex"));
    this.address = publicKeyToAddress(pubkey);

    console.log("Wallet initialized with:");
    console.log("Public key:", pubkey);
    console.log("Public key length:", this.pubkeyBytes.length);
    console.log("Derived address:", this.address);

    // Verify the public key format is correct (should be 33 bytes for compressed secp256k1)
    if (this.pubkeyBytes.length !== 33) {
      console.warn(
        `Warning: Public key length is ${this.pubkeyBytes.length}, expected 33 bytes for compressed secp256k1`
      );
    }
  }

  async getAccounts(): Promise<readonly AccountData[]> {
    return [
      {
        address: this.address,
        algo: "secp256k1",
        pubkey: this.pubkeyBytes,
      },
    ];
  }

  async signDirect(
    signerAddress: string,
    signDoc: SignDoc
  ): Promise<DirectSignResponse> {
    const signBytes = makeSignBytes(signDoc);
    console.log("Chain ID:", signDoc.chainId);

    if (signerAddress !== this.address) {
      throw new Error(
        `Address ${signerAddress} not found in wallet. Expected: ${this.address}`
      );
    }

    const hashedMessage = toHex(sha256(signBytes));
    console.log("hashedMessage", hashedMessage);

    // Using a static signature for testing
    const signature = fromHex(
      "3182406c03f516cc6e30ed99006f07793dd1770134da25c56d6417fc322f6dbe323507ba9e4670f0b900efb5dbbafdce292c013130b124acda7745fb15a314e4"
    );

    console.log(
      "pubkey base64",
      Buffer.from(this.pubkey, "hex").toString("base64")
    );

    // Double-check the public key format
    const encodedPubkey = encodeSecp256k1Pubkey(this.pubkeyBytes);
    console.log("Encoded pubkey:", encodedPubkey);

    // Create the signature with the public key
    const stdSignature = encodeSecp256k1Signature(this.pubkeyBytes, signature);

    console.log("stdSignature", stdSignature);
    console.log("Signature base64:", stdSignature.signature);

    return {
      signed: signDoc,
      signature: stdSignature,
    };
  }
}
