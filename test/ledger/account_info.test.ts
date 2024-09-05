import nconf from "nconf";
import { expect } from "chai";
import { Client, Models, Wallet } from "../../src/index";

describe("Client", () => {
  describe("isActivated", () => {
    before(async function () {
      this.timeout(15000);
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
        this.timeout(15000);
        Client.setup(nconf.get("xrpl:connections:testnet"), { nativeCurrency: "XRP" });
        await Client.connect();
      });

      it("is for activated", async function () {
        const accountInfo: any = await Client.getAccountInfo("rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8");
        expect(accountInfo.account_data).to.eql({
          Account: "rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8",
          Balance: "99999904",
          Domain: "746573742E626974686F6D702E636F6D",
          Flags: 8388608,
          LedgerEntryType: "AccountRoot",
          OwnerCount: 1,
          PreviousTxnID: "6BB1966741BD7C7276B614C0BADB82A07732554870AD2E1FDA654C0F2A4A81B7",
          PreviousTxnLgrSeq: 6052,
          Sequence: 5012,
          index: "A852DD21A058CBD616BFBE48467EBE560F05EE0A69E70047D52496AF76599B5B",
        });
      });

      it("is for activated with nft", async function () {
        const accountInfo: any = await Client.getAccountInfo("rN6tv3mZtnvjfDWdyvR47uwP4uEi2HuVKM");
        expect(accountInfo.account_data).to.eql({
          Account: "rN6tv3mZtnvjfDWdyvR47uwP4uEi2HuVKM",
          Balance: "95999952",
          FirstNFTokenSequence: 3687,
          Flags: 8388608,
          Domain: "746573742E626974686F6D702E636F6D",
          LedgerEntryType: "AccountRoot",
          MintedNFTokens: 1,
          NFTokenMinter: "r4zmMHH32XVDhGo8V2dFPZRJexKZc9YDUh",
          OwnerCount: 2,
          PreviousTxnID: "FB381CF4A7A9B33C86E80F6EC3B7E85FD970ED272367A290A0CED02F138A6856",
          PreviousTxnLgrSeq: 4945,
          Sequence: 3689,
          index: "F7660AA3686F858FFD9142AD3C2730CDCB1CF8D11664DB34F27F1A421BD1512B",
        });
      });
    });
  });

  describe("getAccountInfoData", () => {
    describe("testnet", () => {
      before(async function () {
        this.timeout(15000);
        Client.setup(nconf.get("xrpl:connections:testnet"), { nativeCurrency: "XRP" });
        await Client.connect();
      });

      it("is for activated", async function () {
        const accountInfoData: any = await Client.getAccountInfoData("rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8");
        expect(accountInfoData).to.eql({
          Account: "rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8",
          Balance: "99999904",
          Domain: "746573742E626974686F6D702E636F6D",
          Flags: 8388608,
          LedgerEntryType: "AccountRoot",
          OwnerCount: 1,
          PreviousTxnID: "6BB1966741BD7C7276B614C0BADB82A07732554870AD2E1FDA654C0F2A4A81B7",
          PreviousTxnLgrSeq: 6052,
          Sequence: 5012,
          index: "A852DD21A058CBD616BFBE48467EBE560F05EE0A69E70047D52496AF76599B5B",
        });
      });

      it("is for activated in old format", async function () {
        const accountInfoData: any = await Client.getAccountInfoData("rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8", {
          formatted: true,
        });

        expect(accountInfoData).to.eql({
          sequence: 5012,
          xrpBalance: "99.999904",
          ownerCount: 1,
          previousAffectingTransactionID: "6BB1966741BD7C7276B614C0BADB82A07732554870AD2E1FDA654C0F2A4A81B7",
          previousAffectingTransactionLedgerVersion: 6052,
        });
      });

      it("is for activated with signers", async function () {
        const accountInfoData: any = await Client.getAccountInfoData("rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8", {
          signerLists: true,
        });
        expect(accountInfoData).to.eql({
          Account: "rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8",
          Balance: "99999904",
          Domain: "746573742E626974686F6D702E636F6D",
          Flags: 8388608,
          LedgerEntryType: "AccountRoot",
          OwnerCount: 1,
          PreviousTxnID: "6BB1966741BD7C7276B614C0BADB82A07732554870AD2E1FDA654C0F2A4A81B7",
          PreviousTxnLgrSeq: 6052,
          Sequence: 5012,
          index: "A852DD21A058CBD616BFBE48467EBE560F05EE0A69E70047D52496AF76599B5B",
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
        const accountInfoData: any = await Client.getAccountInfoData("rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8");
        const result: any = Models.getSettings(accountInfoData);
        expect(result).to.eql({
          defaultRipple: true,
          domain: "test.bithomp.com",
        });
      });

      it("parses getSettings with signers", async function () {
        const accountInfoData: any = await Client.getAccountInfoData("rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8", {
          signerLists: true,
        });
        const result: any = Models.getSettings(accountInfoData);
        expect(result).to.eql({
          defaultRipple: true,
          domain: "test.bithomp.com",
        });
      });

      it("parses getSettings show false", async function () {
        const accountInfoData: any = await Client.getAccountInfoData("rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8", {
          signerLists: true,
        });
        const result: any = Models.getSettings(accountInfoData, false);
        expect(result).to.eql({
          blackholed: false,
          defaultRipple: true,
          depositAuth: false,
          disableMaster: false,
          disallowXRP: false,
          domain: "test.bithomp.com",
          globalFreeze: false,
          noFreeze: false,
          passwordSpent: false,
          requireAuth: false,
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
