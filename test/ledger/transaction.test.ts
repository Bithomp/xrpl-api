import nconf from "nconf";
import { Transaction } from "xrpl";
import { expect } from "chai";

// import * as enums from ".node_modules/ripple-binary-codec/dist/enums/src/enums/definitions.json";
import * as hooksEnums from "../../config/hooks_definitions.json";
import { Client, Models, Wallet, xrpl } from "../../src/index";

describe("Client", () => {
  describe("mainnet", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:mainnet"));
      await Client.connect();
    });

    describe("getTransaction", () => {
      it("works", async function () {
        const result: any = await Client.getTransaction(
          "A34F834AA65C01458FC0AFCDDE7F8F433DAD7B871282E8511ECDEE8E28758DCE"
        );
        delete result.warnings;
        delete result.inLedger;
        expect(result).to.eql({
          Account: "rhUYLd2aUiUVYkBZYwTc5RYgCAbNHAwkeZ",
          Amount: "20000000",
          Destination: "rKHdxvrzyCQvNzcsjLRX2mz7XiqdQHwyBH",
          Fee: "13",
          Flags: 2147483648,
          LastLedgerSequence: 41103241,
          Memos: [
            {
              Memo: {
                MemoData: "426974686F6D702061637469766174696F6E",
                MemoFormat: "706C61696E2F74657874",
                MemoType: "6D656D6F",
              },
            },
          ],
          Sequence: 7326,
          SigningPubKey: "03AA9130F4BAB351583FDDCE06CEC016C35E7F4B008FAF09DC532406E12D732D9C",
          TransactionType: "Payment",
          TxnSignature:
            "3045022100953DEF1B48EBE17FDBF2E56AB4E58229F7AB3C5EA1583646E704F6A6B546294902205657341FE7A5AB42A7A985526D485CDEEF84352B6FD16E303C3367603BC490D5",
          date: 588708441,
          hash: "A34F834AA65C01458FC0AFCDDE7F8F433DAD7B871282E8511ECDEE8E28758DCE",
          ledger_index: 41103238,
          meta: {
            AffectedNodes: [
              {
                ModifiedNode: {
                  FinalFields: {
                    Account: "rhUYLd2aUiUVYkBZYwTc5RYgCAbNHAwkeZ",
                    Balance: "852574557",
                    Domain: "626974686F6D702E636F6D",
                    EmailHash: "576EDA7E0D04BC218DAA8A501FCA50B6",
                    Flags: 0,
                    OwnerCount: 0,
                    Sequence: 7327,
                  },
                  LedgerEntryType: "AccountRoot",
                  LedgerIndex: "277D9DA04B4B3628C20345DAA5FFC70AD2D494D9DD1C04C629736935D25F0400",
                  PreviousFields: { Balance: "872574570", Sequence: 7326 },
                  PreviousTxnID: "E69279FC09AB293ABF4E8F534A7F07B2106528B9C093D3CD6BB898520D54D919",
                  PreviousTxnLgrSeq: 41070316,
                },
              },
              {
                CreatedNode: {
                  LedgerEntryType: "AccountRoot",
                  LedgerIndex: "F9B818BC83FDD9FE281B482694E733F18FFB9162D82B313C39D3634C35D9101D",
                  NewFields: { Account: "rKHdxvrzyCQvNzcsjLRX2mz7XiqdQHwyBH", Balance: "20000000", Sequence: 1 },
                },
              },
            ],
            TransactionIndex: 0,
            TransactionResult: "tesSUCCESS",
            delivered_amount: "20000000",
          },
          validated: true,
        });
      });

      it("works with ctid", async function () {
        // A34F834AA65C01458FC0AFCDDE7F8F433DAD7B871282E8511ECDEE8E28758DCE

        const ctid = Models.encodeCTID(41103238, 0, 0); // C2732F8600000000
        const result: any = await Client.getTransaction(ctid);

        delete result.warnings;
        delete result.inLedger;
        expect(result).to.eql({
          Account: "rhUYLd2aUiUVYkBZYwTc5RYgCAbNHAwkeZ",
          Amount: "20000000",
          Destination: "rKHdxvrzyCQvNzcsjLRX2mz7XiqdQHwyBH",
          Fee: "13",
          Flags: 2147483648,
          LastLedgerSequence: 41103241,
          Memos: [
            {
              Memo: {
                MemoData: "426974686F6D702061637469766174696F6E",
                MemoFormat: "706C61696E2F74657874",
                MemoType: "6D656D6F",
              },
            },
          ],
          Sequence: 7326,
          SigningPubKey: "03AA9130F4BAB351583FDDCE06CEC016C35E7F4B008FAF09DC532406E12D732D9C",
          TransactionType: "Payment",
          TxnSignature:
            "3045022100953DEF1B48EBE17FDBF2E56AB4E58229F7AB3C5EA1583646E704F6A6B546294902205657341FE7A5AB42A7A985526D485CDEEF84352B6FD16E303C3367603BC490D5",
          date: 588708441,
          hash: "A34F834AA65C01458FC0AFCDDE7F8F433DAD7B871282E8511ECDEE8E28758DCE",
          ledger_index: 41103238,
          meta: {
            AffectedNodes: [
              {
                ModifiedNode: {
                  FinalFields: {
                    Account: "rhUYLd2aUiUVYkBZYwTc5RYgCAbNHAwkeZ",
                    Balance: "852574557",
                    Domain: "626974686F6D702E636F6D",
                    EmailHash: "576EDA7E0D04BC218DAA8A501FCA50B6",
                    Flags: 0,
                    OwnerCount: 0,
                    Sequence: 7327,
                  },
                  LedgerEntryType: "AccountRoot",
                  LedgerIndex: "277D9DA04B4B3628C20345DAA5FFC70AD2D494D9DD1C04C629736935D25F0400",
                  PreviousFields: { Balance: "872574570", Sequence: 7326 },
                  PreviousTxnID: "E69279FC09AB293ABF4E8F534A7F07B2106528B9C093D3CD6BB898520D54D919",
                  PreviousTxnLgrSeq: 41070316,
                },
              },
              {
                CreatedNode: {
                  LedgerEntryType: "AccountRoot",
                  LedgerIndex: "F9B818BC83FDD9FE281B482694E733F18FFB9162D82B313C39D3634C35D9101D",
                  NewFields: { Account: "rKHdxvrzyCQvNzcsjLRX2mz7XiqdQHwyBH", Balance: "20000000", Sequence: 1 },
                },
              },
            ],
            TransactionIndex: 0,
            TransactionResult: "tesSUCCESS",
            delivered_amount: "20000000",
          },
          validated: true,
        });
      });

      it("works with balanceChanges", async function () {
        const result: any = await Client.getTransaction(
          "A34F834AA65C01458FC0AFCDDE7F8F433DAD7B871282E8511ECDEE8E28758DCE",
          { balanceChanges: true }
        );
        expect(result.balanceChanges).to.eql([
          {
            account: "rhUYLd2aUiUVYkBZYwTc5RYgCAbNHAwkeZ",
            balances: [
              {
                currency: "XRP",
                value: "-20.000013",
              },
            ],
          },
          {
            account: "rKHdxvrzyCQvNzcsjLRX2mz7XiqdQHwyBH",
            balances: [
              {
                currency: "XRP",
                value: "20",
              },
            ],
          },
        ]);
      });

      it("works with binary", async function () {
        const result: any = await Client.getTransaction(
          "A34F834AA65C01458FC0AFCDDE7F8F433DAD7B871282E8511ECDEE8E28758DCE",
          { binary: true }
        );
        delete result.warnings;
        delete result.inLedger;
        expect(result).to.eql({
          date: 588708441,
          hash: "A34F834AA65C01458FC0AFCDDE7F8F433DAD7B871282E8511ECDEE8E28758DCE",
          ledger_index: 41103238,
          meta: "201C00000000F8E5110061250272AEEC55E69279FC09AB293ABF4E8F534A7F07B2106528B9C093D3CD6BB898520D54D91956277D9DA04B4B3628C20345DAA5FFC70AD2D494D9DD1C04C629736935D25F0400E62400001C9E624000000034026E6AE1E722000000002400001C9F2D0000000041576EDA7E0D04BC218DAA8A501FCA50B6624000000032D1415D770B626974686F6D702E636F6D811423171CEACD5EFC0F11ED29969BB703CD6F5CA948E1E1E311006156F9B818BC83FDD9FE281B482694E733F18FFB9162D82B313C39D3634C35D9101DE82400000001624000000001312D008114C897C6887AC1CE71A186B585F07B51D3D132E4C0E1E1F1031000",
          tx: "12000022800000002400001C9E201B02732F89614000000001312D0068400000000000000D732103AA9130F4BAB351583FDDCE06CEC016C35E7F4B008FAF09DC532406E12D732D9C74473045022100953DEF1B48EBE17FDBF2E56AB4E58229F7AB3C5EA1583646E704F6A6B546294902205657341FE7A5AB42A7A985526D485CDEEF84352B6FD16E303C3367603BC490D5811423171CEACD5EFC0F11ED29969BB703CD6F5CA9488314C897C6887AC1CE71A186B585F07B51D3D132E4C0F9EA7C046D656D6F7D12426974686F6D702061637469766174696F6E7E0A706C61696E2F74657874E1F1",
          validated: true,
        });
      });

      it("works with not found", async function () {
        const result = await Client.getTransaction("EC47759FE9691B6BFFEABB49FFFF8FCC46D3DF2AE4CBAE4F06A002AF2688EC1E");

        expect(JSON.stringify(result)).to.eq(
          '{"transaction":"EC47759FE9691B6BFFEABB49FFFF8FCC46D3DF2AE4CBAE4F06A002AF2688EC1E","error":"txnNotFound","error_code":29,"error_message":"Transaction not found.","status":"error"}'
        );
      });

      it("works with specification", async function () {
        const result: any = await Client.getTransaction(
          "B4ECFC303FDE0331725B546A13EA3ED9BA5FEB7FA08195C953362527455E223C",
          { specification: true }
        );
        expect(result.specification).to.eql({
          depositAuth: false,
          memos: [
            {
              data: "28ae197d-76a0-42bd-a703-e6f793c25c14",
            },
          ],
        });
        expect(result.outcome).to.eql({
          balanceChanges: { rL54wzknUXxqiC8Tzs6mzLi3QJTtX5uVK6: [{ currency: "XRP", value: "-0.00001" }] },
          lockedBalanceChanges: {},
          fee: "0.00001",
          indexInLedger: 42,
          ledgerVersion: 69773479,
          orderbookChanges: {},
          nftokenChanges: {},
          nftokenOfferChanges: {},
          result: "tesSUCCESS",
          timestamp: "2022-02-18T13:13:21.000Z",
        });
      });

      it("works with specification", async function () {
        const result: any = await Client.getTransaction(
          "52D37283A4AF8D4DAEF745442B534E13E69861A8F4719BEC1211379ED8C42116",
          { specification: true }
        );
        expect(result.specification).to.eql({
          memos: [
            {
              data: '"eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYW5jZWxsZWRfc2FsZV9zZXF1ZW5jZSI6ODQwLCJjdXJyZW5jeSI6IjAyMzAzMTUxNkQ1MjcyMzE0RTQ2NTQwMDAwMDAwMDAwMDAwMDAwMDAiLCJpc3N1ZXIiOiJyVVk1ZHo4VFVWVmdxcktQbWRraHpZNVgyaGJrQjNwYUY1IiwiaWF0IjoxNjQ1MTE3MTA2LCJpc3MiOiJTb2xvZ2VuaWMgRm91bmRhdGlvbiJ9.z46Ccefl9djKats0FkXKJfhb4Krf-98Jqr75nwdMi9NH9z7UcgLSGVLAEpRIEySSu1NylNBgbbSUuJgllWsPJQ"',
            },
            {
              data: "a4e8c13a-1b26-4904-a9fc-faaa64287f2a",
            },
          ],
        });
        expect(result.outcome).to.eql({
          balanceChanges: { rL54wzknUXxqiC8Tzs6mzLi3QJTtX5uVK6: [{ currency: "XRP", value: "-0.01" }] },
          lockedBalanceChanges: {},
          fee: "0.01",
          indexInLedger: 4,
          ledgerVersion: 69754983,
          orderbookChanges: {},
          nftokenChanges: {},
          nftokenOfferChanges: {},
          result: "tesSUCCESS",
          timestamp: "2022-02-17T16:58:50.000Z",
        });
      });

      it("works with formatted", async function () {
        const result: any = await Client.getTransaction(
          "B4ECFC303FDE0331725B546A13EA3ED9BA5FEB7FA08195C953362527455E223C",
          { formatted: true }
        );

        expect(result).to.eql({
          type: "settings",
          address: "rL54wzknUXxqiC8Tzs6mzLi3QJTtX5uVK6",
          sequence: 865,
          id: "B4ECFC303FDE0331725B546A13EA3ED9BA5FEB7FA08195C953362527455E223C",
          specification: {
            depositAuth: false,
            memos: [
              {
                data: "28ae197d-76a0-42bd-a703-e6f793c25c14",
              },
            ],
          },
          outcome: {
            result: "tesSUCCESS",
            timestamp: "2022-02-18T13:13:21.000Z",
            fee: "0.00001",
            balanceChanges: { rL54wzknUXxqiC8Tzs6mzLi3QJTtX5uVK6: [{ currency: "XRP", value: "-0.00001" }] },
            lockedBalanceChanges: {},
            orderbookChanges: {},
            nftokenChanges: {},
            nftokenOfferChanges: {},
            ledgerVersion: 69773479,
            indexInLedger: 42,
          },
        });
      });

      it("works with formatted with includeRawTransaction", async function () {
        const result: any = await Client.getTransaction(
          "B4ECFC303FDE0331725B546A13EA3ED9BA5FEB7FA08195C953362527455E223C",
          { formatted: true, includeRawTransaction: true }
        );

        expect(result.rawTransaction).to.include("B4ECFC303FDE0331725B546A13EA3ED9BA5FEB7FA08195C953362527455E223C");

        delete result.rawTransaction;
        expect(result).to.eql({
          address: "rL54wzknUXxqiC8Tzs6mzLi3QJTtX5uVK6",
          id: "B4ECFC303FDE0331725B546A13EA3ED9BA5FEB7FA08195C953362527455E223C",
          outcome: {
            result: "tesSUCCESS",
            timestamp: "2022-02-18T13:13:21.000Z",
            fee: "0.00001",
            balanceChanges: { rL54wzknUXxqiC8Tzs6mzLi3QJTtX5uVK6: [{ currency: "XRP", value: "-0.00001" }] },
            lockedBalanceChanges: {},
            orderbookChanges: {},
            nftokenChanges: {},
            nftokenOfferChanges: {},
            ledgerVersion: 69773479,
            indexInLedger: 42,
          },
          type: "settings",
          sequence: 865,
          specification: {
            depositAuth: false,
            memos: [
              {
                data: "28ae197d-76a0-42bd-a703-e6f793c25c14",
              },
            ],
          },
        });
      });
    });

    describe("getTransactionByCTID", () => {
      it("works with ctid", async function () {
        // A34F834AA65C01458FC0AFCDDE7F8F433DAD7B871282E8511ECDEE8E28758DCE

        const ctid = Models.encodeCTID(41103238, 0, 0); // C2732F8600000000
        const result: any = await Client.getTransactionByCTID(ctid);

        delete result.warnings;
        delete result.inLedger;
        expect(result).to.eql({
          Account: "rhUYLd2aUiUVYkBZYwTc5RYgCAbNHAwkeZ",
          Amount: "20000000",
          Destination: "rKHdxvrzyCQvNzcsjLRX2mz7XiqdQHwyBH",
          Fee: "13",
          Flags: 2147483648,
          LastLedgerSequence: 41103241,
          Memos: [
            {
              Memo: {
                MemoData: "426974686F6D702061637469766174696F6E",
                MemoFormat: "706C61696E2F74657874",
                MemoType: "6D656D6F",
              },
            },
          ],
          Sequence: 7326,
          SigningPubKey: "03AA9130F4BAB351583FDDCE06CEC016C35E7F4B008FAF09DC532406E12D732D9C",
          TransactionType: "Payment",
          TxnSignature:
            "3045022100953DEF1B48EBE17FDBF2E56AB4E58229F7AB3C5EA1583646E704F6A6B546294902205657341FE7A5AB42A7A985526D485CDEEF84352B6FD16E303C3367603BC490D5",
          date: 588708441,
          hash: "A34F834AA65C01458FC0AFCDDE7F8F433DAD7B871282E8511ECDEE8E28758DCE",
          ledger_index: 41103238,
          meta: {
            AffectedNodes: [
              {
                ModifiedNode: {
                  FinalFields: {
                    Account: "rhUYLd2aUiUVYkBZYwTc5RYgCAbNHAwkeZ",
                    Balance: "852574557",
                    Domain: "626974686F6D702E636F6D",
                    EmailHash: "576EDA7E0D04BC218DAA8A501FCA50B6",
                    Flags: 0,
                    OwnerCount: 0,
                    Sequence: 7327,
                  },
                  LedgerEntryType: "AccountRoot",
                  LedgerIndex: "277D9DA04B4B3628C20345DAA5FFC70AD2D494D9DD1C04C629736935D25F0400",
                  PreviousFields: { Balance: "872574570", Sequence: 7326 },
                  PreviousTxnID: "E69279FC09AB293ABF4E8F534A7F07B2106528B9C093D3CD6BB898520D54D919",
                  PreviousTxnLgrSeq: 41070316,
                },
              },
              {
                CreatedNode: {
                  LedgerEntryType: "AccountRoot",
                  LedgerIndex: "F9B818BC83FDD9FE281B482694E733F18FFB9162D82B313C39D3634C35D9101D",
                  NewFields: { Account: "rKHdxvrzyCQvNzcsjLRX2mz7XiqdQHwyBH", Balance: "20000000", Sequence: 1 },
                },
              },
            ],
            TransactionIndex: 0,
            TransactionResult: "tesSUCCESS",
            delivered_amount: "20000000",
          },
          validated: true,
        });
      });
    });
  });

  describe("testnet", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:testnet"));
      await Client.connect();
    });

    describe("submit", () => {
      it("is OK for sign and submit", async function () {
        this.timeout(10000);
        const account = "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz";
        const paymentParams = (await Client.getAccountPaymentParams(account)) as Models.AccountPaymentParamsInterface;

        const txBlob: Transaction = {
          TransactionType: "Payment",
          Account: account,
          Amount: "100",
          Destination: "rBbfoBCNMpAaj35K5A9UV9LDkRSh6ZU9Ef",
          Fee: paymentParams.fee,
          Sequence: paymentParams.sequence,
          LastLedgerSequence: paymentParams.lastLedgerSequence,
        };

        const wallet = xrpl.Wallet.fromSeed(nconf.get("xrpl:accounts:activation:secret"));
        const signedTransaction = wallet.sign(txBlob).tx_blob;

        const result: any = await Client.submit(signedTransaction);
        expect(result.meta.TransactionResult).to.eq("tesSUCCESS");
      });

      it("is not OK for passed sequence number", async function () {
        const tefPAST_SEQ =
          "120000228000000024000000012E0000007B61400000E8D4A5100068400000000000000C732103A71B44FD71C956C3CC0A540F2FBB577C4A300BC71244D86E4EB57220E58BFA267447304502210087A81EE99913E4C2252EB46CAF7E5A189C24ED09BF00C94359CFDA1805E75CC4022046F6B54F0A3CF7955BD9F774A11B4B0CCF7353BCB3986FE68D9B53CE934C8704811485C536EFA7EAACCC51916E32FF720810A22260088314772044746F04AE1E611266AE3AB402833E2E29ACF9EA7C044D656D6F7D04746573747E0A706C61696E2F74657874E1EA7C06636C69656E747D15426974686F6D7020746F6F6C20762E20302E332E307E0A706C61696E2F74657874E1F1";

        const result: any = await Client.submit(tefPAST_SEQ);
        expect(result.engine_result).to.eq("tefPAST_SEQ");
      });

      it("is not OK for feature sequence number", async function () {
        const terPRE_SEQ =
          "120000228000000024000007D061400000E8D4A5100068400000000000000C732103A71B44FD71C956C3CC0A540F2FBB577C4A300BC71244D86E4EB57220E58BFA267446304402201A58F62ECDD5EEDA7AE72F04B19BE5BCBF9B72B9ADED5C6D426D9B430FC0A2D90220697E755C8CC18CC460986FEEB77C5286C699D6C5C85F1B600733981723EF70D9811485C536EFA7EAACCC51916E32FF720810A22260088314772044746F04AE1E611266AE3AB402833E2E29ACF9EA7C06636C69656E747D15426974686F6D7020746F6F6C20762E20302E332E307E0A706C61696E2F74657874E1F1";

        const result: any = await Client.submit(terPRE_SEQ);
        expect(result.engine_result).to.eq("terPRE_SEQ");
      });
    });

    describe("legacyPayment", () => {
      it("is OK", async function () {
        this.timeout(15000);

        const payment = {
          sourceAddress: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          sourceValue: "0.0001",
          sourceCurrency: "XRP",
          destinationAddress: "rBbfoBCNMpAaj35K5A9UV9LDkRSh6ZU9Ef",
          destinationValue: "0.0001",
          destinationCurrency: "XRP",
          memos: [{ type: "memo", format: "plain/text", data: "Bithomp test" }],
          secret: nconf.get("xrpl:accounts:activation:secret"),
        };

        const result: any = await Client.legacyPayment(payment);
        expect(result.error).to.eq(undefined);
        expect(result.validated).to.eq(true);
      });

      it("is OK with tags", async function () {
        this.timeout(15000);

        const payment = {
          sourceAddress: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          sourceTag: 1234,
          sourceValue: "0.0001",
          sourceCurrency: "XRP",
          destinationAddress: "rBbfoBCNMpAaj35K5A9UV9LDkRSh6ZU9Ef",
          destinationTag: 5678,
          destinationValue: "0.0001",
          destinationCurrency: "XRP",
          memos: [{ type: "memo", format: "plain/text", data: "Bithomp test" }],
          secret: nconf.get("xrpl:accounts:activation:secret"),
        };

        const result: any = await Client.legacyPayment(payment);
        expect(result.error).to.eq(undefined);
        expect(result.validated).to.eq(true);
      });

      it("is failed for not activated", async function () {
        this.timeout(15000);

        const address = Wallet.generateAddress();
        const payment = {
          sourceAddress: address.address,
          sourceValue: "0.0001",
          sourceCurrency: "XRP",
          destinationAddress: "rBbfoBCNMpAaj35K5A9UV9LDkRSh6ZU9Ef",
          destinationValue: "0.0001",
          destinationCurrency: "XRP",
          memos: [{ type: "memo", format: "plain/text", data: "Bithomp test" }],
          secret: address.seed,
        };

        const result: any = await Client.legacyPayment(payment);
        expect(result.error).to.eq("actNotFound");
      });

      it("is failed for not funded", async function () {
        this.timeout(25000);

        const payment = {
          sourceAddress: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          sourceValue: "100000000000.0",
          sourceCurrency: "XRP",
          destinationAddress: "rBbfoBCNMpAaj35K5A9UV9LDkRSh6ZU9Ef",
          destinationValue: "100000000000.0",
          destinationCurrency: "XRP",
          memos: [{ type: "memo", format: "plain/text", data: "Bithomp test" }],
          secret: nconf.get("xrpl:accounts:activation:secret"),
        };

        const result: any = await Client.legacyPayment(payment);
        expect(result.meta.TransactionResult).to.eq("tecUNFUNDED_PAYMENT");
      });
    });
  });

  describe("beta", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:beta"));
      await Client.connect();
    });

    describe("legacyPayment", () => {
      it("is OK", async function () {
        const betaDefinitions = new Wallet.XrplDefinitions(hooksEnums);

        this.timeout(15000);
        const payment = {
          sourceAddress: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          sourceValue: "0.0001",
          sourceCurrency: "XRP",
          destinationAddress: "rBbfoBCNMpAaj35K5A9UV9LDkRSh6ZU9Ef",
          destinationValue: "0.0001",
          destinationCurrency: "XRP",
          networkID: 21338,
          memos: [{ type: "memo", format: "plain/text", data: "Bithomp test" }],
          secret: nconf.get("xrpl:accounts:activation:secret"),
        };
        const result: any = await Client.legacyPayment(payment, betaDefinitions);

        expect(result.error).to.eq(undefined);
        expect(result.validated).to.eq(true);
      });
    });
  });
});
