import nconf from "nconf";
import { expect } from "chai";
import { Client, Models, Wallet } from "../../src/index";

describe("Client", () => {
  describe("isActivated", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:testnet"), { nativeCurrency: "XRP" });
      await Client.connect();
    });

    it("is true for activated", async function () {
      const result: any = await Client.isActivated("rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz");
      expect(result).to.eql(true);
    });

    it("is false for not activated", async function () {
      const result: any = await Client.isActivated(Wallet.generateAddress().address);
      expect(result).to.eql(false);
    });
  });

  describe("getAccountInfo", () => {
    describe("testnet", () => {
      before(async function () {
        Client.setup(nconf.get("xrpl:connections:testnet"), { nativeCurrency: "XRP" });
        await Client.connect();
      });

      it("is for activated", async function () {
        const accountInfo: any = await Client.getAccountInfo("rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf");
        expect(accountInfo.account_data).to.eql({
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

      it("is for activated with nft", async function () {
        const accountInfo: any = await Client.getAccountInfo("rN6tv3mZtnvjfDWdyvR47uwP4uEi2HuVKM");
        expect(accountInfo.account_data).to.eql({
          Account: "rN6tv3mZtnvjfDWdyvR47uwP4uEi2HuVKM",
          Balance: "971999712",
          Flags: 0,
          LedgerEntryType: "AccountRoot",
          MintedNFTokens: 1,
          NFTokenMinter: "r4zmMHH32XVDhGo8V2dFPZRJexKZc9YDUh",
          OwnerCount: 2,
          PreviousTxnID: "DED688260C4B14B18ED5FA55923F8BDE8282159C1FEC5DCD48E27EE8DAAE0C31",
          PreviousTxnLgrSeq: 34643391,
          Sequence: 34625359,
          index: "F7660AA3686F858FFD9142AD3C2730CDCB1CF8D11664DB34F27F1A421BD1512B",
        });
      });
    });
  });

  describe("getAccountInfoData", () => {
    describe("testnet", () => {
      before(async function () {
        Client.setup(nconf.get("xrpl:connections:testnet"), { nativeCurrency: "XRP" });
        await Client.connect();
      });

      it("is for activated", async function () {
        const accountInfoData: any = await Client.getAccountInfoData("rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf");
        expect(accountInfoData).to.eql({
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

      it("is for activated with signers", async function () {
        const accountInfoData: any = await Client.getAccountInfoData("rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf", {
          signerLists: true,
        });
        expect(accountInfoData).to.eql({
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
          signer_lists: [],
        });
      });

      it("is for not activated", async function () {
        const account: string = Wallet.generateAddress().address;
        const result: any = await Client.getAccountInfoData(account);

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
        const accountInfoData: any = await Client.getAccountInfoData("rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf");
        const result: any = Models.getSettings(accountInfoData);
        expect(result).to.eql({
          requireAuth: true,
          disallowXRP: true,
          domain: "test.bithomp.com",
        });
      });

      it("parses getSettings with signers", async function () {
        const accountInfoData: any = await Client.getAccountInfoData("rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf", {
          signerLists: true,
        });
        const result: any = Models.getSettings(accountInfoData);
        expect(result).to.eql({
          requireAuth: true,
          disallowXRP: true,
          domain: "test.bithomp.com",
        });
      });

      it("parses getSettings show false", async function () {
        const accountInfoData: any = await Client.getAccountInfoData("rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf", {
          signerLists: true,
        });
        const result: any = Models.getSettings(accountInfoData, false);
        expect(result).to.eql({
          blackholed: false,
          defaultRipple: false,
          depositAuth: false,
          disableMaster: false,
          disallowXRP: true,
          domain: "test.bithomp.com",
          globalFreeze: false,
          noFreeze: false,
          passwordSpent: false,
          requireAuth: true,
          requireDestTag: false,
          disallowIncomingCheck: false,
          disallowIncomingNFTokenOffer: false,
          disallowIncomingPayChan: false,
          disallowIncomingTrustline: false,
        });
      });
    });

    describe("mainnet", () => {
      before(async function () {
        this.timeout(15000);
        Client.setup(nconf.get("xrpl:connections:mainnet"), { loadBalancing: true, nativeCurrency: "XRP" });
        await Client.connect();
      });

      it("parses getSettings for blackholed", async function () {
        const accountInfoData: any = await Client.getAccountInfoData("rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW", {
          signerLists: true,
        });
        const result: any = Models.getSettings(accountInfoData);
        expect(result).to.eql({
          blackholed: true,
          defaultRipple: true,
          disableMaster: true,
          disallowXRP: true,
          domain: "bithomp.com",
          emailHash: "576EDA7E0D04BC218DAA8A501FCA50B6",
          passwordSpent: true,
          regularKey: "rrrrrrrrrrrrrrrrrrrrBZbvji",
        });
      });

      it("parses getSettings for blackholed show false", async function () {
        const accountInfo: any = await Client.getAccountInfo("rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW", {
          signerLists: true,
        });
        const result: any = Models.getSettings(accountInfo.account_data, false);
        expect(result).to.eql({
          blackholed: true,
          defaultRipple: true,
          depositAuth: false,
          disableMaster: true,
          disallowXRP: true,
          domain: "bithomp.com",
          emailHash: "576EDA7E0D04BC218DAA8A501FCA50B6",
          regularKey: "rrrrrrrrrrrrrrrrrrrrBZbvji",
          globalFreeze: false,
          noFreeze: false,
          passwordSpent: true,
          requireAuth: false,
          requireDestTag: false,
          disallowIncomingCheck: false,
          disallowIncomingNFTokenOffer: false,
          disallowIncomingPayChan: false,
          disallowIncomingTrustline: false,
        });
      });

      it("parses getSettings for signers show false", async function () {
        const accountInfoData: any = await Client.getAccountInfoData("rBg2FuZT91C52Nny68houguJ4vt5x1o91m", {
          signerLists: true,
        });

        expect(accountInfoData.signer_lists).to.eql([
          {
            Flags: 65536,
            LedgerEntryType: "SignerList",
            OwnerNode: "0",
            PreviousTxnID: "61BFDE1442D491B58B5976D48F2354DF5E563B2E21A23D649FE1552CE54BF560",
            PreviousTxnLgrSeq: 54051274,
            SignerEntries: [
              {
                SignerEntry: {
                  Account: "re3LGjhrCvthtWWwrfKbVJjXN9PYDeQDJ",
                  SignerWeight: 1,
                },
              },
              {
                SignerEntry: {
                  Account: "rngZ9RUfH6qfpY7M4sb4hgtsPddTtXtLeQ",
                  SignerWeight: 1,
                },
              },
              {
                SignerEntry: {
                  Account: "rfL4znSWfaFkYj8Jrh9184K8EYAN4574Yd",
                  SignerWeight: 1,
                },
              },
              {
                SignerEntry: {
                  Account: "rfkTDtYGVg4N3ru1JoJAZoCpoYYUSHLCiP",
                  SignerWeight: 1,
                },
              },
              {
                SignerEntry: {
                  Account: "rUjBSLwaGxJzBLvt5eVj8VEBzLLgALsx1T",
                  SignerWeight: 1,
                },
              },
              {
                SignerEntry: {
                  Account: "rHH2gS6XikKoEt9i1xAxEBvXLHKFr7oLn8",
                  SignerWeight: 1,
                },
              },
              {
                SignerEntry: {
                  Account: "rLW75SfEdnGVsa3fTFkSaDTzXuFapwNYtf",
                  SignerWeight: 1,
                },
              },
              {
                SignerEntry: {
                  Account: "rMY6Wm2RWQLN4d3Jjz15MKP74GJWVQE2pb",
                  SignerWeight: 1,
                },
              },
            ],
            SignerListID: 0,
            SignerQuorum: 3,
            index: "407C155CFD9D93415764E5F5456D530B727CB674BF91F253C9C617561EFD4C94",
          },
        ]);

        const result: any = Models.getSettings(accountInfoData, false);

        expect(result).to.eql({
          passwordSpent: false,
          requireDestTag: false,
          requireAuth: false,
          depositAuth: false,
          disallowXRP: false,
          disableMaster: true,
          noFreeze: false,
          globalFreeze: false,
          defaultRipple: false,
          blackholed: false,
          disallowIncomingCheck: false,
          disallowIncomingNFTokenOffer: false,
          disallowIncomingPayChan: false,
          disallowIncomingTrustline: false,
        });
      });
    });
  });
});
