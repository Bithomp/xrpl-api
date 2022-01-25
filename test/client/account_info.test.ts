import nconf from "nconf";
import { expect } from "chai";
import { Client, Wallet } from "../../src/index";

describe("Client", () => {
  describe("isActivatedAsync", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:testnet"));
      await Client.connect();
    });

    it("is true for activated", async function () {
      const result: any = await Client.isActivatedAsync("rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz");
      expect(result).to.eql(true);
    });

    it("is false for not activated", async function () {
      const result: any = await Client.isActivatedAsync(Wallet.generateAddress().address);
      expect(result).to.eql(false);
    });
  });

  describe("getAccountInfoAsync", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:testnet"));
      await Client.connect();
    });

    it("is for activated", async function () {
      const result: any = await Client.getAccountInfoAsync("rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf");
      expect(result).to.eql({
        Account: "rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf",
        Balance: "999999976",
        Domain: "746573742E626974686F6D702E636F6D",
        Flags: 786432,
        LedgerEntryType: "AccountRoot",
        OwnerCount: 1,
        PreviousTxnID: "3F369023F112D844619805ED2C5F8D9CB0BCE7DB18CAE681A92785164A61A8B5",
        PreviousTxnLgrSeq: 22442907,
        Sequence: 22442870,
        index: "D88BB94773475A04F50EA227E03A67D0FBC5D70DC17CFDB256BCC9F1FA8C1A6E",
      });
    });

    it("is for not activated", async function () {
      const account: string = Wallet.generateAddress().address;
      const result: any = await Client.getAccountInfoAsync(account);

      expect(result).to.eql({
        account: account,
        error: "actNotFound",
        error_code: 19,
        error_message: "Account not found.",
        status: "error",
        validated: true,
      });
    });

    it("parses getSettings", async function () {
      const accountInfo: any = await Client.getAccountInfoAsync("rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf");
      const result: any = Client.getSettings(accountInfo);
      expect(result).to.eql({
        requireAuthorization: true,
        disallowIncomingXRP: true,
        domain: "test.bithomp.com",
      });
    });
  });
});
