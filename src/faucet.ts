import axios from "axios";
import AddressCodec = require("ripple-address-codec");

interface FaucetNetworkInterface {
  url: string;
  format: string;
}

interface AxiosFaucetOptionsDataInterface {
  destination: string;
}

interface AxiosFaucetOptionsInterface {
  method: string;
  url: string;
  data?: AxiosFaucetOptionsDataInterface;
}

interface XrplLabsSuccessResponseInterface {
  address: string;
  secret: string;
  xrp: number;
  hash: string;
  code: string;
}

interface XrplSuccessResponseAccountInterface {
  xAddress: string;
  secret?: string;
  classicAddress: string;
  address: string;
}

interface XrplSuccessResponseInterface {
  account: XrplSuccessResponseAccountInterface;
  amount: number;
  balance: number;
}

// List of facuet networks
export const FaucetNetworks = {
  test: {
    url: "https://faucet.altnet.rippletest.net/accounts",
    format: "xrpl",
  },
  dev: {
    url: "https://faucet.devnet.rippletest.net/accounts",
    format: "xrpl",
  },
  xls20: {
    url: "https://faucet-nft.ripple.com/accounts",
    format: "xrpl",
  },
  hooks: {
    url: "https://hooks-testnet.xrpl-labs.com/newcreds",
    format: "xrpl-labs",
  },
  beta: {
    url: "https://hooks-testnet-v2.xrpl-labs.com/newcreds",
    format: "xrpl-labs",
  },
};

export function getFaucetNetwork(network: string): FaucetNetworkInterface | undefined {
  if (network in FaucetNetworks) {
    return FaucetNetworks[network];
  }

  return undefined;
}

export async function foundWallet(network: string | FaucetNetworkInterface, account?: string): Promise<any> {
  if (typeof network === "string") {
    network = getFaucetNetwork(network) as FaucetNetworkInterface;
  }

  if (!network) {
    throw new Error("Invalid network");
  }

  const options: AxiosFaucetOptionsInterface = {
    method: "post",
    url: network.url,
  };

  if (account) {
    if (network.format === "xrpl") {
      options.data = { destination: account };
    } else if (network.format === "xrpl-labs") {
      options.url += `?account=${account}`;
    }
  }

  const data = (await axios(options)).data;

  // return xrpl-labs SUCCESS response in xrpl format
  if (network.format === "xrpl-labs" && data.code === "tesSUCCESS") {
    // {
    //   address: 'rh19DztENXTjC2xPpjFXULmDzWdkS479Zx',
    //   secret: 's____________________________',
    //   xrp: 10000,
    //   hash: '74BCB80645EA4F194EB2AF0CB97671B9E85F6A03CA037EB37A16D467D45DF0D2',
    //   code: 'tesSUCCESS'
    // }

    return xrplLabsToXrplResponse(data);
  }

  // {
  //   account: {
  //     xAddress: 'TVaRHtuHAZAPhfy7gBqnP1uEWvgqnrae4h7MZzpuxs9mapV',
  //     secret: 's____________________________',
  //     classicAddress: 'rDgvtnmeAY3o1pjcBwN2RZhqwLg6tV7r4w',
  //     address: 'rDgvtnmeAY3o1pjcBwN2RZhqwLg6tV7r4w'
  //   },
  //   amount: 1000,
  //   balance: 1000
  // }
  return data;
}

export function xrplLabsToXrplResponse(data: XrplLabsSuccessResponseInterface): XrplSuccessResponseInterface {
  const secret: string | undefined = data.secret === "" ? undefined : data.secret;
  const balance: number | undefined = secret ? data.xrp : undefined;
  const response: any = {
    account: {
      xAddress: AddressCodec.classicAddressToXAddress(data.address, false, true),
      classicAddress: data.address,
      address: data.address,
    },
    amount: data.xrp,
  };

  if (secret) {
    response.account.secret = secret;
  }

  if (balance) {
    response.balance = balance;
  }

  return response;
}
