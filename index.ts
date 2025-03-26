import {
  fromPrivateKey,
  getAllBalances,
  publicKeyToAddress,
  sendTokens,
} from "./utils/cosmjs";
import { SilentWallet } from "./utils/mpc-wallet";

const faucetPK =
  "28750f677575086718f8731fe50c779d091fe5acc8795408c6c9c2b24bca7975";

const publicKeyHex =
  "02cbffbe256fabe58062f6523c2c93a3da6d9ffac7bb0aba4b340c73a42c095277";

const silentWallet = new SilentWallet(publicKeyHex);
const walletBalances = await getAllBalances(silentWallet.address);
console.log(walletBalances);

const faucetWallet = await fromPrivateKey(faucetPK);
const faucetAddress = (await faucetWallet.getAccounts())[0].address;

console.log("amount", (10 * 10 ** 6).toString());

const fundSilent = async () => {
  const resp = await sendTokens(
    faucetWallet,
    silentWallet.address,
    (10 ** 5).toString()
  );
  console.log(resp.transactionHash);
};

// await fundSilent();

const sendResp = await sendTokens(
  silentWallet,
  faucetAddress,
  (10 ** 4).toString()
);

console.log(sendResp.transactionHash);
