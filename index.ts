import { fromPrivateKey, getAllBalances, sendTokens } from "./utils/cosmjs";
import { SilentWallet } from "./utils/mpc-wallet";

const faucetPK =
  "ef368bdbef0e6884abf68d43d113fefb4a1666e966b746df139f1a9b217a6c0f";

const publicKeyHex =
  "02cbffbe256fabe58062f6523c2c93a3da6d9ffac7bb0aba4b340c73a42c095277";

const silentWallet = new SilentWallet(publicKeyHex);

console.log("Wallet address", silentWallet.address);

const walletBalances = await getAllBalances(silentWallet.address);
console.log(walletBalances);

const faucetWallet = await fromPrivateKey(faucetPK);

const balances = await getAllBalances(
  (
    await faucetWallet.getAccounts()
  )[0].address
);
console.log(balances);

console.log("amount", (10 * 10 ** 6).toString());

const sendResp = await sendTokens(
  silentWallet,
  (
    await faucetWallet.getAccounts()
  )[0].address,
  (10 ** 5).toString()
);

// console.log(sendResp);
