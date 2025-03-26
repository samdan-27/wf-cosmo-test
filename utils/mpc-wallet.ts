import { makeSignBytes, type OfflineDirectSigner } from "@cosmjs/proto-signing";
import {
  type AccountData,
  type DirectSignResponse,
} from "@cosmjs/proto-signing";
import { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { sha256 } from "@cosmjs/crypto";
import { fromHex, toHex } from "@cosmjs/encoding";
import {
  encodeSecp256k1Signature,
  pubkeyToAddress,
  encodeSecp256k1Pubkey,
} from "@cosmjs/amino";

export class SilentWallet implements OfflineDirectSigner {
  public readonly address: string;
  private readonly pubkeyBytes: Uint8Array;

  constructor(pubkey: string) {
    this.pubkeyBytes = fromHex(pubkey);
    const pk = encodeSecp256k1Pubkey(this.pubkeyBytes);
    this.address = pubkeyToAddress(pk, "wf");

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

    if (signerAddress !== this.address) {
      throw new Error(
        `Address ${signerAddress} not found in wallet. Expected: ${this.address}`
      );
    }

    const hashedMessage = toHex(sha256(signBytes));
    console.log("hashedMessage", hashedMessage);

    const signature = fromHex(
      "46502f57e45b72ce85728a40b8583ff66896d563a0480cacd496fbac3df940fb6f688538b147a9b148a7530caff10e19e2ea43d2ee163a7f938cb7a191afda19"
    );

    const stdSignature = encodeSecp256k1Signature(this.pubkeyBytes, signature);

    return {
      signed: signDoc,
      signature: stdSignature,
    };
  }
}
