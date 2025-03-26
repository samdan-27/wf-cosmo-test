import { fromHex, toBech32 } from "@cosmjs/encoding";
import { sha256 } from "@cosmjs/crypto";
import {
  DirectSecp256k1Wallet,
  type OfflineDirectSigner,
} from "@cosmjs/proto-signing";
import { SigningStargateClient, StargateClient, coins } from "@cosmjs/stargate";
import { RPC_ENDPOINTS } from "../constants";
import { encodeSecp256k1Pubkey, pubkeyToAddress } from "@cosmjs/amino";

export function publicKeyToAddress(pubKeyHex: string, prefix = "wf") {
  const pk = encodeSecp256k1Pubkey(fromHex(pubKeyHex));
  const address = pubkeyToAddress(pk, prefix);
  return address;
}

export const fromPrivateKey = async (privateKey: string) => {
  return await DirectSecp256k1Wallet.fromKey(
    new Uint8Array(Buffer.from(privateKey, "hex")),
    "wf"
  );
};

export const getBalance = async (
  address: string,
  denom: string = "uwf"
): Promise<string> => {
  const client = await StargateClient.connect(RPC_ENDPOINTS.TENDERMINT_RPC);
  const balance = await client.getBalance(address, denom);
  return balance.amount;
};

export const getAllBalances = async (address: string) => {
  const client = await StargateClient.connect(RPC_ENDPOINTS.TENDERMINT_RPC);
  return client.getAllBalances(address);
};

export const sendTokens = async (
  wallet: OfflineDirectSigner,
  recipientAddress: string,
  amount: string,
  denom: string = "uwfUSD"
) => {
  // Get the sender's address
  const [firstAccount] = await wallet.getAccounts();
  const senderAddress = firstAccount.address;

  // Create a signing client
  const client = await SigningStargateClient.connectWithSigner(
    RPC_ENDPOINTS.TENDERMINT_RPC,
    wallet
  );

  // Prepare the amount to send
  const amountToSend = coins(amount, denom);

  // Set gas price and fee
  const fee = {
    amount: coins("5000", denom),
    gas: "200000",
  };

  // Send the tokens
  return client.sendTokens(senderAddress, recipientAddress, amountToSend, fee);
};
