import nconf from "nconf";
import { Transaction } from "xrpl";
import { expect } from "chai";

// import * as enums from ".node_modules/ripple-binary-codec/dist/enums/src/enums/definitions.json";
// https://github.com/Transia-RnD/xrpl.js/blob/3b234ec8ec1c677e0f3f534fd2985c985871c87e/packages/ripple-binary-codec/src/enums/definitions.json
import * as xahauEnums from "../../config/xahau_definitions.json";
import { Client, Models, Wallet } from "../../src/index";

describe("Client", () => {
  describe("mainnet", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:mainnet"), { loadBalancing: true, nativeCurrency: "XRP" });
      await Client.connect();
    });

    describe("getTransaction", () => {
      it("works", async function () {
        const result: any = await Client.getTransaction(
          "A34F834AA65C01458FC0AFCDDE7F8F433DAD7B871282E8511ECDEE8E28758DCE"
        );
        delete result.warnings; // can be missed, depending on the server
        delete result.inLedger; // can be missed, depending on the server
        delete result.DeliverMax; // can be missed, depending on the server 2.0.0 and greater
        delete result.ctid; // TODO: CTID is not not fully supported by all nodes
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

        delete result.warnings; // can be missed, depending on the server
        delete result.inLedger; // can be missed, depending on the server
        delete result.DeliverMax; // can be missed, depending on the server 2.0.0 and greater
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
          ctid: "C2732F8600000000",
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
        delete result.warnings; // can be missed, depending on the server
        delete result.inLedger; // can be missed, depending on the server
        delete result.DeliverMax; // can be missed, depending on the server 2.0.0 and greater
        delete result.ctid; // TODO: CTID is not not fully supported by all nodes
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
          fee: "0.00001",
          indexInLedger: 42,
          ledgerVersion: 69773479,
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
          fee: "0.01",
          indexInLedger: 4,
          ledgerVersion: 69754983,
          result: "tesSUCCESS",
          timestamp: "2022-02-17T16:58:50.000Z",
        });
      });

      it("works with formatted", async function () {
        const result: any = await Client.getTransaction(
          "B4ECFC303FDE0331725B546A13EA3ED9BA5FEB7FA08195C953362527455E223C",
          { formatted: true }
        );

        delete result.ctid; // TODO: CTID is not not fully supported by all nodes
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
        delete result.ctid; // TODO: CTID is not not fully supported by all nodes
        expect(result).to.eql({
          address: "rL54wzknUXxqiC8Tzs6mzLi3QJTtX5uVK6",
          id: "B4ECFC303FDE0331725B546A13EA3ED9BA5FEB7FA08195C953362527455E223C",
          outcome: {
            result: "tesSUCCESS",
            timestamp: "2022-02-18T13:13:21.000Z",
            fee: "0.00001",
            balanceChanges: { rL54wzknUXxqiC8Tzs6mzLi3QJTtX5uVK6: [{ currency: "XRP", value: "-0.00001" }] },
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

        delete result.warnings; // can be missed, depending on the server
        delete result.inLedger; // can be missed, depending on the server
        delete result.DeliverMax; // can be missed, depending on the server 2.0.0 and greater
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
          ctid: "C2732F8600000000",
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
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:testnet"), { nativeCurrency: "XRP" });
      await Client.connect();
    });

    describe("submit", () => {
      it("is OK for sign and submit", async function () {
        this.timeout(10000);
        const account = "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz";
        const paymentParams = (await Client.getAccountPaymentParams(account)) as Models.AccountPaymentParamsInterface;

        const tx: Transaction = {
          TransactionType: "Payment",
          Account: account,
          Amount: "100",
          Destination: "rBbfoBCNMpAaj35K5A9UV9LDkRSh6ZU9Ef",
          Fee: paymentParams.fee,
          Sequence: paymentParams.sequence,
          LastLedgerSequence: paymentParams.lastLedgerSequence,
        };

        const wallet = Wallet.walletFromSeed(nconf.get("xrpl:accounts:activation:secret"), { seedAddress: account });
        const signedTransaction = wallet.sign(tx).tx_blob;

        const result: any = await Client.submit(signedTransaction);
        expect(result.meta).to.be.an("object");
        expect(result.meta.TransactionResult).to.eq("tesSUCCESS");
      });

      it("is OK for sign and submit with auto fee", async function () {
        this.timeout(10000);
        const account = "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz";

        const tx: Transaction = {
          TransactionType: "Payment",
          Account: account,
          Amount: "100",
          Destination: "rBbfoBCNMpAaj35K5A9UV9LDkRSh6ZU9Ef",
        };

        const submitParams = (await Client.getTxSubmitParams(account, tx)) as Models.AccountPaymentParamsInterface;
        tx.Fee = submitParams.fee;
        tx.Sequence = submitParams.sequence;
        tx.LastLedgerSequence = submitParams.lastLedgerSequence;

        const wallet = Wallet.walletFromSeed(nconf.get("xrpl:accounts:activation:secret"), { seedAddress: account });
        const signedTransaction = wallet.sign(tx).tx_blob;

        const result: any = await Client.submit(signedTransaction);
        expect(result.meta).to.be.an("object");
        expect(result.meta.TransactionResult).to.eq("tesSUCCESS");
      });

      it("is not OK for passed sequence number", async function () {
        const tx: Transaction = {
          TransactionType: "Payment",
          Account: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          Amount: "1000000000000",
          Destination: "rBbfoBCNMpAaj35K5A9UV9LDkRSh6ZU9Ef",
          Fee: "12",
          Sequence: 1,
        };

        const wallet = Wallet.walletFromSeed(nconf.get("xrpl:accounts:activation:secret"), {
          seedAddress: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
        });
        const tefPAST_SEQ = wallet.sign(tx).tx_blob;
        const result: any = await Client.submit(tefPAST_SEQ);
        expect(result.engine_result).to.eq("tefPAST_SEQ");
      });

      it("is not OK for feature sequence number", async function () {
        const tx: Transaction = {
          TransactionType: "Payment",
          Account: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          Amount: "1000000000000",
          Destination: "rBbfoBCNMpAaj35K5A9UV9LDkRSh6ZU9Ef",
          Fee: "12",
          Sequence: 999999999,
        };

        const wallet = Wallet.walletFromSeed(nconf.get("xrpl:accounts:activation:secret"), {
          seedAddress: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
        });
        const terPRE_SEQ = wallet.sign(tx).tx_blob;
        const result: any = await Client.submit(terPRE_SEQ);
        expect(result.engine_result).to.eq("terPRE_SEQ");
      });
    });

    describe("submitPaymentTransactionV1", () => {
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

        const result: any = await Client.submitPaymentTransactionV1(payment);
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

        const result: any = await Client.submitPaymentTransactionV1(payment);
        expect(result.error).to.eq(undefined);
        expect(result.validated).to.eq(true);
      });

      it.only("is OK with provided sequence and fee", async function () {
        this.timeout(15000);

        const accountData = await Client.getAccountInfoData("rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz");
        const payment = {
          sourceAddress: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          sourceValue: "0.0001",
          sourceCurrency: "XRP",
          destinationAddress: "rBbfoBCNMpAaj35K5A9UV9LDkRSh6ZU9Ef",
          destinationValue: "0.0001",
          destinationCurrency: "XRP",
          memos: [{ type: "memo", format: "plain/text", data: "Bithomp test" }],
          sequence: (accountData as Models.AccountInfoDataResponse).Sequence,
          fee: "0.000123",
          secret: nconf.get("xrpl:accounts:activation:secret"),
        };

        const result: any = await Client.submitPaymentTransactionV1(payment);
        expect(result.error).to.eq(undefined);
        expect(result.validated).to.eq(true);
        expect(result.Sequence).to.eq(payment.sequence);
        expect(result.Fee).to.eq("123");
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

        const result: any = await Client.submitPaymentTransactionV1(payment);
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

        const result: any = await Client.submitPaymentTransactionV1(payment);
        expect(result.meta).to.be.an("object");
        expect(result.meta.TransactionResult).to.eq("tecUNFUNDED_PAYMENT");
      });
    });
  });

  describe("xahau-test", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:beta"), { nativeCurrency: "XAH" });
      await Client.connect();
    });

    describe("submitPaymentTransactionV1", () => {
      it("is OK with manual fee", async function () {
        const xahauDefinitions = new Wallet.XrplDefinitions(xahauEnums);

        this.timeout(15000);
        const payment = {
          sourceAddress: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          sourceValue: "0.0001",
          sourceCurrency: "XAH",
          destinationAddress: "rBbfoBCNMpAaj35K5A9UV9LDkRSh6ZU9Ef",
          destinationValue: "0.0001",
          destinationCurrency: "XAH",
          networkID: 21338,
          memos: [{ type: "memo", format: "plain/text", data: "Bithomp test" }],
          secret: nconf.get("xrpl:accounts:activation:secret"),
          fee: "0.000046", // 10 - fee, 26 - memos, 10 - ???
        };
        const result: any = await Client.submitPaymentTransactionV1(payment, xahauDefinitions);

        expect(result.error).to.eq(undefined);
        expect(result.validated).to.eq(true);
      });

      it("is OK with auto fee", async function () {
        const xahauDefinitions = new Wallet.XrplDefinitions(xahauEnums);

        this.timeout(15000);
        const payment = {
          sourceAddress: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          sourceValue: "0.0001",
          sourceCurrency: "XAH",
          destinationAddress: "rBbfoBCNMpAaj35K5A9UV9LDkRSh6ZU9Ef",
          destinationValue: "0.0001",
          destinationCurrency: "XAH",
          networkID: 21338,
          memos: [{ type: "memo", format: "plain/text", data: "Bithomp test" }],
          secret: nconf.get("xrpl:accounts:activation:secret"),
        };
        const result: any = await Client.submitPaymentTransactionV1(payment, xahauDefinitions);

        expect(result.error).to.eq(undefined);
        expect(result.validated).to.eq(true);
      });
    });

    describe("getTransaction", () => {
      it("works with NFT burn2mint", async function () {
        const xahauDefinitions = new Wallet.XrplDefinitions(xahauEnums);
        const result: any = await Client.getTransaction(
          "BD3338E3799624DF13EA1CA46CD7305A643B99941F3563FAC35FB3D456153622",
          { formatted: true, definitions: xahauDefinitions }
        );

        expect(result).to.eql({
          type: "import",
          address: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
          sequence: 4722674,
          id: "BD3338E3799624DF13EA1CA46CD7305A643B99941F3563FAC35FB3D456153622",
          ctid: "C04810650000535A",
          specification: {
            blob: {
              ledger: {
                acroot: "233540489B36003BB1EF21CAFEB883F69466B74DCD3E5670C3C471FC609A1670",
                close: 742471371,
                coins: "98652171857393117",
                cres: 10,
                flags: 0,
                index: 39419653,
                pclose: 742471370,
                phash: "880A8C2F3E742C512B0DC5FC6C77538A873F1C978DFFF3AE557B55B01CC3ABCC",
                txroot: "B060B646BDB6329B9A93E7477BBCAAF717C409A35741317E330855F70A4BA971",
              },
              validation: {
                data: {
                  n944nVL4GHUBpZWUn2XaQXYT92b42BYHpwAisiCqvL159tEmWY46: {
                    Flags: 2147483649,
                    LedgerSequence: 39419653,
                    SigningTime: 742471371,
                    Cookie: "385F12D6319DDB9A",
                    LedgerHash: "8EBACD67392226AEEAEB82186CEC5E8D8C004A22AF4C14184339798AD489486B",
                    ConsensusHash: "60AA35BF7946A29B8C63C071BFA3A1E06A62E79425647EAFEDCB3BF4A8C4E564",
                    ValidatedHash: "880A8C2F3E742C512B0DC5FC6C77538A873F1C978DFFF3AE557B55B01CC3ABCC",
                    SigningPubKey: "03F71FA3C31F84FC0FC481E307C0DCF3F450EA5F5857EC8E5EBC21C6C08E3906A4",
                    Signature:
                      "3045022100FD4C743A5232F887F3FC8385D7427F40940F04DEF4233D39EC6B046DF20CB596022065DE371ACBBFFCAE0772584B5A66D07D902BB0BFCEB96D5F890921E19ED3F696",
                  },
                  n9K7fyu8uvmCoWvW4ZQVCWgW2zrz7sh33Ao7ceNkL7iQGDYtuwTU: {
                    Flags: 2147483649,
                    LedgerSequence: 39419653,
                    SigningTime: 742471371,
                    Cookie: "124E519EEDA8BF10",
                    LedgerHash: "8EBACD67392226AEEAEB82186CEC5E8D8C004A22AF4C14184339798AD489486B",
                    ConsensusHash: "60AA35BF7946A29B8C63C071BFA3A1E06A62E79425647EAFEDCB3BF4A8C4E564",
                    ValidatedHash: "880A8C2F3E742C512B0DC5FC6C77538A873F1C978DFFF3AE557B55B01CC3ABCC",
                    SigningPubKey: "0279C1B242658DD78514A5A60A206FA30C18A3EE370592A058A80FAA3E5C44F097",
                    Signature:
                      "3045022100D8ED1F285098713DCEE4BC513D326BF884597AA944AF39DF63B86223155A812402207393AB8CB52E9FFD67752BF38B978E197BC1BAE2C230D7B6F0AEE1A8CFFB928D",
                  },
                  n9KWVA64rMeqkAvcQ4DNCa2eDXTzprCtK1HLC8H5PEyUVwSSyL5X: {
                    Flags: 2147483649,
                    LedgerSequence: 39419653,
                    SigningTime: 742471371,
                    Cookie: "0AE7729763F67407",
                    LedgerHash: "8EBACD67392226AEEAEB82186CEC5E8D8C004A22AF4C14184339798AD489486B",
                    ConsensusHash: "60AA35BF7946A29B8C63C071BFA3A1E06A62E79425647EAFEDCB3BF4A8C4E564",
                    ValidatedHash: "880A8C2F3E742C512B0DC5FC6C77538A873F1C978DFFF3AE557B55B01CC3ABCC",
                    SigningPubKey: "027F285B8BB33F0E8B025BF955C29A7CFA8A0995831EE4AD93A9BD572A7C8EEDCD",
                    Signature:
                      "30450221009EA70C3D71AE1303A2E72C828E2FF0FA0B765B049310D606CD91AE83BD65FD650220150579BB4BFF058F14D59018E5E1B0744073AE384C29C2D1CEB2CE2D48A41404",
                  },
                  n9KcRZYHLU9rhGVwB9e4wEMYsxXvUfgFxtmX25pc1QPNgweqzQf5: {
                    Flags: 2147483649,
                    LedgerSequence: 39419653,
                    SigningTime: 742471370,
                    Cookie: "8BC16D1445BD05A1",
                    LedgerHash: "8EBACD67392226AEEAEB82186CEC5E8D8C004A22AF4C14184339798AD489486B",
                    ConsensusHash: "60AA35BF7946A29B8C63C071BFA3A1E06A62E79425647EAFEDCB3BF4A8C4E564",
                    ValidatedHash: "880A8C2F3E742C512B0DC5FC6C77538A873F1C978DFFF3AE557B55B01CC3ABCC",
                    SigningPubKey: "028C9C1DE3789DA22316D789E31099D10F0FE5977DAFD45459B1311FFB65F46FC9",
                    Signature:
                      "304402201610085B7A2F4C6CDDFBC80DB31612BE13C7F02F3C4DFB8A60486B8512D534F202207F1692D1BA47CAAC381895DC8CF876403C756B0FA63CC55BA15BFC9EAF93EA0D",
                  },
                  n9Kv3RbsBNbp1NkV3oP7UjHb3zEAz2KwtK3uQG7UxjQ8Mi3PaXiw: {
                    Flags: 2147483649,
                    LedgerSequence: 39419653,
                    SigningTime: 742471370,
                    Cookie: "33E3CBEBC7F73D20",
                    LedgerHash: "8EBACD67392226AEEAEB82186CEC5E8D8C004A22AF4C14184339798AD489486B",
                    ConsensusHash: "60AA35BF7946A29B8C63C071BFA3A1E06A62E79425647EAFEDCB3BF4A8C4E564",
                    ValidatedHash: "880A8C2F3E742C512B0DC5FC6C77538A873F1C978DFFF3AE557B55B01CC3ABCC",
                    SigningPubKey: "02B4CF65358D43B21C6D720FD5211E4F6AD3C2C27BF2DB5960242E49A5E06A36D0",
                    Signature:
                      "3045022100EB57DAEFE9D3F6D28152940E31320786FC4D0A1D6A250ED842C792995AEEE42B02203026382B36B9790FCAF115404A2C577817CEFC060079C4C45C86434C432D0746",
                  },
                  n9MGR6mE5oQGbNSf2ZbQUnAQmZeN8uim5pcVdfqgdtQscXJutZHW: {
                    Flags: 2147483649,
                    LedgerSequence: 39419653,
                    SigningTime: 742471370,
                    Cookie: "ACF393EBA1E5C8D9",
                    LedgerHash: "8EBACD67392226AEEAEB82186CEC5E8D8C004A22AF4C14184339798AD489486B",
                    ConsensusHash: "60AA35BF7946A29B8C63C071BFA3A1E06A62E79425647EAFEDCB3BF4A8C4E564",
                    ValidatedHash: "880A8C2F3E742C512B0DC5FC6C77538A873F1C978DFFF3AE557B55B01CC3ABCC",
                    SigningPubKey: "0366985A2A58FCDD64004A0A1B0FE5C7550891436775AD50562DA6DFACE13AE62F",
                    Signature:
                      "3044022050BA25FCFF3B9B5E120CDE581A8926778F2F1DCF050D2760A8F834E84120B50302202C95FFFD9AF1EA094AC24079E50700F74415174E956F44AA282440A423E1D654",
                  },
                },
                unl: {
                  version: 1,
                  PublicKey: "ED264807102805220DA0F312E71FC2C69E1552C9C5790F6C25E3729DEB573D5860",
                  manifest:
                    "JAAAAAFxIe0mSAcQKAUiDaDzEucfwsaeFVLJxXkPbCXjcp3rVz1YYHMh7Rt08vn4Maojg0vgNNcPuxVrJhyFy5tnQMSHfgCvuHjWdkCg/oL0GUq0QOgrdHw1Tw3BtA4lrLzDVQrSTFu+tMz+Dkdshs5gtbbfHQ2qFgYzGwaA9o3Z5Wwjv0iqXtxwH18PcBJAWCjvE1dMKgjMWu88GKgYDOaYJrOfOmN9CpxwnOObamY5gL2iENqTuo8bllpK4Hor3ewYwRCHWPTMpirBsDe4Aw==",
                  decodedManifest: {
                    Sequence: 1,
                    PublicKey: "ED264807102805220DA0F312E71FC2C69E1552C9C5790F6C25E3729DEB573D5860",
                    publicKey: "nHBeJBfBkbRDAfyon4idcDcUDspz8WnDWoKE7AE2Dta1y7qfSMu8",
                    address: "rBxZvQBY551DJ21g9AC1Qc9ASQowqcskbF",
                    SigningPubKey: "ED1B74F2F9F831AA23834BE034D70FBB156B261C85CB9B6740C4877E00AFB878D6",
                    signingPubKey: "nHBZXgNrAgmhvCUg9viYbVK3oAmW31Q46hEHikVMnnyBkwKcCLEt",
                    Signature:
                      "A0FE82F4194AB440E82B747C354F0DC1B40E25ACBCC3550AD24C5BBEB4CCFE0E476C86CE60B5B6DF1D0DAA1606331B0680F68DD9E56C23BF48AA5EDC701F5F0F",
                    MasterSignature:
                      "5828EF13574C2A08CC5AEF3C18A8180CE69826B39F3A637D0A9C709CE39B6A663980BDA210DA93BA8F1B965A4AE07A2BDDEC18C1108758F4CCA62AC1B037B803",
                  },
                  signature:
                    "75DE050E6AD07EA5D8CD031C387CF00987389D8DDC0A1E018ABFE368EE881C4A68CFD7856BDBF7B87B53EEECCCB40CC8144E64E2D55FC833764DECD5EFE41E02",
                  blob: {
                    sequence: 55,
                    expiration: 1699401600,
                    validators: [
                      {
                        PublicKey: "ED061ECB51B5BD62665F5D1A5DB1A62AF84464BED77E7728235A7A551D4535E717",
                        manifest:
                          "JAAAAAJxIe0GHstRtb1iZl9dGl2xpir4RGS+1353KCNaelUdRTXnF3MhAnnBskJljdeFFKWmCiBvowwYo+43BZKgWKgPqj5cRPCXdkcwRQIhAKRiLXevJ61ukhZtikvCuKgGRnV8H08eM/PEvJNEdl04AiBi/Bk68VVefR1GtgI4YezRQVsxnEiN/LmWSNmQYKQRIHASQAt8hKfxkqPMeBOTh2x2hjrkAa7leTenBtf9DxuhwlgsB9N/xxTfpzMQkjUYoYiyXkXZyh1NVsNLDKUmOdWZLAM=",
                        decodedManifest: {
                          Sequence: 2,
                          PublicKey: "ED061ECB51B5BD62665F5D1A5DB1A62AF84464BED77E7728235A7A551D4535E717",
                          publicKey: "nHBQ3CT3EWYZ4uzbnL3k6TRf9bBPhWRFVcK1F5NjtwCBksMEt5yy",
                          address: "rna87bupr933hSSKYvAnDvTNhKLyvGiNr5",
                          SigningPubKey: "0279C1B242658DD78514A5A60A206FA30C18A3EE370592A058A80FAA3E5C44F097",
                          signingPubKey: "n9K7fyu8uvmCoWvW4ZQVCWgW2zrz7sh33Ao7ceNkL7iQGDYtuwTU",
                          Signature:
                            "3045022100A4622D77AF27AD6E92166D8A4BC2B8A80646757C1F4F1E33F3C4BC9344765D38022062FC193AF1555E7D1D46B6023861ECD1415B319C488DFCB99648D99060A41120",
                          MasterSignature:
                            "0B7C84A7F192A3CC781393876C76863AE401AEE57937A706D7FD0F1BA1C2582C07D37FC714DFA73310923518A188B25E45D9CA1D4D56C34B0CA52639D5992C03",
                        },
                      },
                      {
                        PublicKey: "EDADB6E6F7229F92909E5A6DBAF81AD1EC723D31B676CD8F5F3E926AD043D187C0",
                        manifest:
                          "JAAAAAJxIe2ttub3Ip+SkJ5abbr4GtHscj0xtnbNj18+kmrQQ9GHwHMhAn8oW4uzPw6LAlv5VcKafPqKCZWDHuStk6m9Vyp8ju3NdkcwRQIhANQlFbiDNfa/LJIr+eaZ2KKc04GldZMrAG4bDWFMLyURAiAlwAfNIuveI0HmhM0I+Fw4ygAsHFWuwVrcWKabZLHtgHASQBBETTRDxCsQo4wIK+z5Cd9Omku0yDxBOMTA70RSqEopV9DHBgVV9g82j1mn0oJXDz0pNXrrCn3DqMbwA0vC+QA=",
                        decodedManifest: {
                          Sequence: 2,
                          PublicKey: "EDADB6E6F7229F92909E5A6DBAF81AD1EC723D31B676CD8F5F3E926AD043D187C0",
                          publicKey: "nHUCAdca6VoWWYVdBH1bwCUQggEX2e5acQSqxM3DwyuhsFknxmh3",
                          address: "rKN1tePqnrWuH6Smequ5inkM76DTCez89P",
                          SigningPubKey: "027F285B8BB33F0E8B025BF955C29A7CFA8A0995831EE4AD93A9BD572A7C8EEDCD",
                          signingPubKey: "n9KWVA64rMeqkAvcQ4DNCa2eDXTzprCtK1HLC8H5PEyUVwSSyL5X",
                          Signature:
                            "3045022100D42515B88335F6BF2C922BF9E699D8A29CD381A575932B006E1B0D614C2F2511022025C007CD22EBDE2341E684CD08F85C38CA002C1C55AEC15ADC58A69B64B1ED80",
                          MasterSignature:
                            "10444D3443C42B10A38C082BECF909DF4E9A4BB4C83C4138C4C0EF4452A84A2957D0C7060555F60F368F59A7D282570F3D29357AEB0A7DC3A8C6F0034BC2F900",
                        },
                      },
                      {
                        PublicKey: "EDF5B661ECC615C5C77D55F1B572FAC6FE6C7B116EB0A0E3F1DCEB9F48932548D0",
                        manifest:
                          "JAAAAAFxIe31tmHsxhXFx31V8bVy+sb+bHsRbrCg4/Hc659IkyVI0HMhA/cfo8MfhPwPxIHjB8Dc8/RQ6l9YV+yOXrwhxsCOOQakdkcwRQIhALUdnluhhq8yfL7ddgz71tUPWA4e2edJ2a69cQkwyNCBAiA6d9FNeKAjLhOjjKR52L4cIfv/AQtgUAlb9H0n2uyo6XASQD7M8LSGLKondz1EOmrAwzD407GvMxFhaEa2bpIPzNlVHE+PmOvJwZnxhLoG+NYVUfmaUreS+7kxv+gyoHtumwY=",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "EDF5B661ECC615C5C77D55F1B572FAC6FE6C7B116EB0A0E3F1DCEB9F48932548D0",
                          publicKey: "nHDDe5uAdiv6RA59MA1oM4JLDtVSYKNShgjEqq1KsdJXZiR47CQT",
                          address: "rw7sRdixSWp3PoPkiq3YmAicHcABRGdacL",
                          SigningPubKey: "03F71FA3C31F84FC0FC481E307C0DCF3F450EA5F5857EC8E5EBC21C6C08E3906A4",
                          signingPubKey: "n944nVL4GHUBpZWUn2XaQXYT92b42BYHpwAisiCqvL159tEmWY46",
                          Signature:
                            "3045022100B51D9E5BA186AF327CBEDD760CFBD6D50F580E1ED9E749D9AEBD710930C8D08102203A77D14D78A0232E13A38CA479D8BE1C21FBFF010B6050095BF47D27DAECA8E9",
                          MasterSignature:
                            "3ECCF0B4862CAA27773D443A6AC0C330F8D3B1AF3311616846B66E920FCCD9551C4F8F98EBC9C199F184BA06F8D61551F99A52B792FBB931BFE832A07B6E9B06",
                        },
                      },
                      {
                        PublicKey: "EDF62907763AAD8ED21F7EAF3F36B5264856A375FBB47CE64383EED74847C8DA6A",
                        manifest:
                          "JAAAAAFxIe32KQd2Oq2O0h9+rz82tSZIVqN1+7R85kOD7tdIR8jaanMhA2aYWipY/N1kAEoKGw/lx1UIkUNnda1QVi2m36zhOuYvdkcwRQIhAMvVQqDV3P+pJpM/4CX7xKWddfXje1dkB7qyPYoTkaxxAiBHCDcDUryX4FrMwlKQnPvrczt1pPUs4s/MAWET5OY8unASQPl+9vwiMxONOdGOUgCZo0IEi9qrfTP6CTQ8LyVTKkI5TOUeDMIYO6iFOrmXjdcsmf0ph55T/TpKUuP7uiA2sw0=",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "EDF62907763AAD8ED21F7EAF3F36B5264856A375FBB47CE64383EED74847C8DA6A",
                          publicKey: "nHDDiwQBqXhEL1CFoRHdMXD33x9K7rpYJfniXxL7kFavpPd21EGe",
                          address: "rwGBNFzk8JGQt8LW6Cj4f92H4VpxrtMo2m",
                          SigningPubKey: "0366985A2A58FCDD64004A0A1B0FE5C7550891436775AD50562DA6DFACE13AE62F",
                          signingPubKey: "n9MGR6mE5oQGbNSf2ZbQUnAQmZeN8uim5pcVdfqgdtQscXJutZHW",
                          Signature:
                            "3045022100CBD542A0D5DCFFA926933FE025FBC4A59D75F5E37B576407BAB23D8A1391AC7102204708370352BC97E05ACCC252909CFBEB733B75A4F52CE2CFCC016113E4E63CBA",
                          MasterSignature:
                            "F97EF6FC2233138D39D18E520099A342048BDAAB7D33FA09343C2F25532A42394CE51E0CC2183BA8853AB9978DD72C99FD29879E53FD3A4A52E3FBBA2036B30D",
                        },
                      },
                      {
                        PublicKey: "EDA9BEAB987DCFFEDCF2067B24CC7B8CF0C210B358A891FE0ED78EC324FBB40ADB",
                        manifest:
                          "JAAAAAJxIe2pvquYfc/+3PIGeyTMe4zwwhCzWKiR/g7XjsMk+7QK23MhAoycHeN4naIjFteJ4xCZ0Q8P5Zd9r9RUWbExH/tl9G/JdkcwRQIhAODAet56y2oa0KUDNyfEU6uIf8lu0QRtZRA45QscyS/NAiB2w6SpRh3uSQwc5QN8xlXEicwQyC5HPNd+byNVoolDKnASQFJdF9zduUEo7R5Sd7DPuK8GjUw3tkWpfRwLzbm55NftxC2/QTGfG4mqbon+Ra4MAoyPFJWmzmJnYf9ecIdC+gg=",
                        decodedManifest: {
                          Sequence: 2,
                          PublicKey: "EDA9BEAB987DCFFEDCF2067B24CC7B8CF0C210B358A891FE0ED78EC324FBB40ADB",
                          publicKey: "nHUeUNSn3zce2xQZWNghQvd9WRH6FWEnCBKYVJu2vAizMxnXegfJ",
                          address: "rfCFANwdNatTPyq3fovKUk3joopCJRZEs7",
                          SigningPubKey: "028C9C1DE3789DA22316D789E31099D10F0FE5977DAFD45459B1311FFB65F46FC9",
                          signingPubKey: "n9KcRZYHLU9rhGVwB9e4wEMYsxXvUfgFxtmX25pc1QPNgweqzQf5",
                          Signature:
                            "3045022100E0C07ADE7ACB6A1AD0A5033727C453AB887FC96ED1046D651038E50B1CC92FCD022076C3A4A9461DEE490C1CE5037CC655C489CC10C82E473CD77E6F2355A289432A",
                          MasterSignature:
                            "525D17DCDDB94128ED1E5277B0CFB8AF068D4C37B645A97D1C0BCDB9B9E4D7EDC42DBF41319F1B89AA6E89FE45AE0C028C8F1495A6CE626761FF5E708742FA08",
                        },
                      },
                      {
                        PublicKey: "ED20BB134D03B54E3D2E6745775BF41FADF3C276399B1F3623081D7B66D0714E33",
                        manifest:
                          "JAAAAAJxIe0guxNNA7VOPS5nRXdb9B+t88J2OZsfNiMIHXtm0HFOM3MhArTPZTWNQ7IcbXIP1SEeT2rTwsJ78ttZYCQuSaXgajbQdkcwRQIhAP82FxVItRg1WPPCvB+yw0pPHl5/bA0xD/KWcSdWGD2SAiAVQ8bXOntcbl8MM2js+mZOYctKkJzFcE9xEf91WRow3nASQGP9x1oxRGd2fIyyJpx6+HCgar2+/Ns/Ord5hUlTXaICzKGfG5/cUlEzcgN2BoRBjxCpi5wMh84hJaL+hIVH5Ac=",
                        decodedManifest: {
                          Sequence: 2,
                          PublicKey: "ED20BB134D03B54E3D2E6745775BF41FADF3C276399B1F3623081D7B66D0714E33",
                          publicKey: "nHBbiP5ua5dUqCTz5i5vd3ia9jg3KJthohDjgKxnc7LxtmnauW7Z",
                          address: "rNCTjcTc5NKxAQgDqiZnRrYkeTpQiUdHQ8",
                          SigningPubKey: "02B4CF65358D43B21C6D720FD5211E4F6AD3C2C27BF2DB5960242E49A5E06A36D0",
                          signingPubKey: "n9Kv3RbsBNbp1NkV3oP7UjHb3zEAz2KwtK3uQG7UxjQ8Mi3PaXiw",
                          Signature:
                            "3045022100FF36171548B5183558F3C2BC1FB2C34A4F1E5E7F6C0D310FF296712756183D9202201543C6D73A7B5C6E5F0C3368ECFA664E61CB4A909CC5704F7111FF75591A30DE",
                          MasterSignature:
                            "63FDC75A314467767C8CB2269C7AF870A06ABDBEFCDB3F3AB7798549535DA202CCA19F1B9FDC5251337203760684418F10A98B9C0C87CE2125A2FE848547E407",
                        },
                      },
                    ],
                  },
                },
              },
              transaction: {
                id: "51875E3B3DD854E6344CDAFB4934673B076405B51F7AE4FEF6301B4D35DDF14C",
                tx: {
                  TransactionType: "NFTokenBurn",
                  Flags: 0,
                  Sequence: 39419543,
                  LastLedgerSequence: 39419671,
                  OperationLimit: 21338,
                  NFTokenID: "0008013AAC8B8F22E7C42AE160DBD7961899DF6AD5FF80880000099B00000000",
                  Fee: "12",
                  SigningPubKey: "EDE17BEBA254D19FCDD66EE8E5C21FF88444D082E181E263EF06E3A2E048AE50C9",
                  TxnSignature:
                    "B10E4A0A78B363052F10080464834FD7166473A68295713D1CA22711277E8A672EB1E6E1E26C581C5B34D87FF5338D25124D55ED4C2A05B686299DFD79017B04",
                  Account: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
                  Owner: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
                },
                meta: {
                  TransactionIndex: 2,
                  AffectedNodes: [
                    {
                      ModifiedNode: {
                        LedgerEntryType: "AccountRoot",
                        PreviousTxnLgrSeq: 39419641,
                        PreviousTxnID: "6DC9814FD34FA93751DEFB7705220EF84ECC779A51AF198D2E7209EA97416BEB",
                        LedgerIndex: "AB28F55952D30905E86AFAFC72064ECEE139FCFA100E747968518DD8A304E5EA",
                        PreviousFields: {
                          Sequence: 39419543,
                          OwnerCount: 1,
                          Balance: "9999999988",
                        },
                        FinalFields: {
                          Flags: 0,
                          Sequence: 39419544,
                          OwnerCount: 0,
                          MintedNFTokens: 1,
                          BurnedNFTokens: 1,
                          Balance: "9999999976",
                          Account: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
                        },
                      },
                    },
                    {
                      DeletedNode: {
                        LedgerEntryType: "NFTokenPage",
                        LedgerIndex: "AC8B8F22E7C42AE160DBD7961899DF6AD5FF8088FFFFFFFFFFFFFFFFFFFFFFFF",
                        FinalFields: {
                          Flags: 0,
                          PreviousTxnLgrSeq: 39419641,
                          PreviousTxnID: "6DC9814FD34FA93751DEFB7705220EF84ECC779A51AF198D2E7209EA97416BEB",
                          NFTokens: [
                            {
                              NFToken: {
                                NFTokenID: "0008013AAC8B8F22E7C42AE160DBD7961899DF6AD5FF80880000099B00000000",
                                URI: "68747470733A2F2F692E6B796D2D63646E2E636F6D2F656E74726965732F69636F6E732F6F726967696E616C2F3030302F3032372F3437352F53637265656E5F53686F745F323031382D31302D32355F61745F31312E30322E31355F414D2E706E67",
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                  TransactionResult: "tesSUCCESS",
                },
                proof: {
                  children: {
                    "4": {
                      children: {},
                      hash: "46C9AC5E9792881E00D470E0B479FA7225545F6F3AAD130F2AB1CDB970CC88D4",
                      key: "49EFBB66B2ACFEBA58C2B0C79A65D36238162A09B9980159AC41BC9686FB9494",
                    },
                    "5": {
                      children: {},
                      hash: "D0E594E8609A2F1ACBA7E7E6946AAB9D51774A650E0DD76F8511EF4B5082A00B",
                      key: "51875E3B3DD854E6344CDAFB4934673B076405B51F7AE4FEF6301B4D35DDF14C",
                    },
                    "9": {
                      children: {},
                      hash: "DBBEF332E0348BFC83EE53FE16F977D8CE5C63D24E8BA288B44D8CA4D4CA3B1D",
                      key: "9C4D879A96F64E58AD865B3A38C2F5150A5A434F730794ED8894607E074EAF3B",
                    },
                  },
                  hash: "B060B646BDB6329B9A93E7477BBCAAF717C409A35741317E330855F70A4BA971",
                  key: "0000000000000000000000000000000000000000000000000000000000000000",
                },
                specification: {
                  account: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
                  nftokenID: "0008013AAC8B8F22E7C42AE160DBD7961899DF6AD5FF80880000099B00000000",
                },
                outcome: {
                  result: "tesSUCCESS",
                  fee: "0.000012",
                  balanceChanges: {
                    rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T: [
                      {
                        currency: "XRP",
                        value: "-0.000012",
                      },
                    ],
                  },
                  nftokenChanges: {
                    rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T: [
                      {
                        status: "removed",
                        nftokenID: "0008013AAC8B8F22E7C42AE160DBD7961899DF6AD5FF80880000099B00000000",
                        uri: "68747470733A2F2F692E6B796D2D63646E2E636F6D2F656E74726965732F69636F6E732F6F726967696E616C2F3030302F3032372F3437352F53637265656E5F53686F745F323031382D31302D32355F61745F31312E30322E31355F414D2E706E67",
                      },
                    ],
                  },
                  affectedObjects: {
                    nftokens: {
                      "0008013AAC8B8F22E7C42AE160DBD7961899DF6AD5FF80880000099B00000000": {
                        nftokenID: "0008013AAC8B8F22E7C42AE160DBD7961899DF6AD5FF80880000099B00000000",
                        flags: {
                          burnable: false,
                          onlyXRP: false,
                          trustLine: false,
                          transferable: true,
                        },
                        transferFee: 314,
                        issuer: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
                        nftokenTaxon: 0,
                        sequence: 0,
                      },
                    },
                  },
                  indexInLedger: 2,
                },
              },
            },
            source: {
              address: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
            },
          },
          outcome: {
            result: "tesSUCCESS",
            timestamp: "2023-07-12T10:09:20.000Z",
            fee: "0.011087",
            balanceChanges: {
              rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T: [
                {
                  currency: "XAH",
                  value: "-0.011075",
                },
              ],
            },
            hooksExecutions: [
              {
                account: "r3Q5KufJdkQyaLvHD22fJFVSZCqq4GczyU",
                emitCount: 1,
                executionIndex: 0,
                hash: "6DAE1BECB44B1B0F7034A642849AECB73B8E3CF31ED7AF9C0BA16DF8363E3DE7",
                instructionCount: "6a0",
                result: 3,
                returnCode: "d3",
                returnString: "",
                stateChangeCount: 0,
              },
            ],
            emittedTxns: [
              {
                id: "9FFF77CEA7B0A61452E0E6560C6AD1DECFA7DE78DDAB6567E10C54B5547371F8",
                specification: {
                  uri: "68747470733A2F2F692E6B796D2D63646E2E636F6D2F656E74726965732F69636F6E732F6F726967696E616C2F3030302F3032372F3437352F53637265656E5F53686F745F323031382D31302D32355F61745F31312E30322E31355F414D2E706E67",
                  flags: {
                    burnable: false,
                  },
                  source: {
                    address: "r3Q5KufJdkQyaLvHD22fJFVSZCqq4GczyU",
                  },
                  destination: {
                    address: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
                  },
                  emittedDetails: {
                    emitBurden: "1",
                    emitGeneration: 1,
                    emitHookHash: "6DAE1BECB44B1B0F7034A642849AECB73B8E3CF31ED7AF9C0BA16DF8363E3DE7",
                    emitNonce: "AE93CC86985824560241B2184DB28EFAE9D36A69A2BE6D07F071BFA3E7380E02",
                    emitParentTxnID: "BD3338E3799624DF13EA1CA46CD7305A643B99941F3563FAC35FB3D456153622",
                  },
                },
                tx: {
                  Account: "r3Q5KufJdkQyaLvHD22fJFVSZCqq4GczyU",
                  Destination: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
                  EmitDetails: {
                    EmitBurden: "1",
                    EmitGeneration: 1,
                    EmitHookHash: "6DAE1BECB44B1B0F7034A642849AECB73B8E3CF31ED7AF9C0BA16DF8363E3DE7",
                    EmitNonce: "AE93CC86985824560241B2184DB28EFAE9D36A69A2BE6D07F071BFA3E7380E02",
                    EmitParentTxnID: "BD3338E3799624DF13EA1CA46CD7305A643B99941F3563FAC35FB3D456153622",
                  },
                  Fee: "10",
                  FirstLedgerSequence: 4722790,
                  Flags: 2147483648,
                  LastLedgerSequence: 4722794,
                  Sequence: 0,
                  SigningPubKey: "",
                  TransactionType: "URITokenMint",
                  URI: "68747470733A2F2F692E6B796D2D63646E2E636F6D2F656E74726965732F69636F6E732F6F726967696E616C2F3030302F3032372F3437352F53637265656E5F53686F745F323031382D31302D32355F61745F31312E30322E31355F414D2E706E67",
                },
              },
            ],
            ledgerVersion: 4722789,
            indexInLedger: 0,
            deliveredAmount: {
              currency: "XAH",
              value: "-0.011075",
            },
          },
        });
      });
    });

    describe("getTxDetails", () => {
      it("Import", function () {
        const tx = require("../examples/responses/Import.json");
        const result: any = Models.getTxDetails(tx, false);

        expect(result).to.eql({
          address: "rwiETSee2wMz3SBnAG8hkMsCgvGy9LWbZ1",
          id: "BF60195960EDE6FB9B017D1BBF404283C388375C3271A42F83A9B8C5420AE297",
          outcome: {
            balanceChanges: { rwiETSee2wMz3SBnAG8hkMsCgvGy9LWbZ1: [{ currency: "XAH", value: "2.001337" }] },
            fee: "0",
            indexInLedger: 0,
            ledgerVersion: 4142,
            deliveredAmount: {
              currency: "XAH",
              value: "2.001337",
            },
            result: "tesSUCCESS",
            timestamp: "2023-10-30T15:49:01.000Z",
          },
          sequence: 0,
          specification: {
            source: { address: "rwiETSee2wMz3SBnAG8hkMsCgvGy9LWbZ1" },
            blob: {
              ledger: {
                index: 83576782,
                coins: "99988315281078445",
                phash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                txroot: "6CB49A135734560AEA6565D2A80A48CA029E7CFB3DA2E52E1EE3F07D7469AB8A",
                acroot: "DF1D6309AFC14A1F42F4FCD51F72BB3AE4E1857B796459292A3447FF136D27A3",
                pclose: 751996122,
                close: 751996130,
                cres: 10,
                flags: 0,
              },
              validation: {
                data: {
                  n943ozDG74swHRmAjzY6A4KVFBhEirF4Sh1ACqvDePE3CZTgkMqn: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996130,
                    Cookie: "F4DE277CA5456C1E",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "03D8FFA541AB3C3625EB725D595B2A6C758305D27D1F9ECD54BE362CEEA02F0A35",
                    Signature:
                      "304402205F0FDF4EF4C2C178E864AD67440C51F263C99851FADC1E000508DBE3C76C4365022035EED6D467998E10B0AD3DF0033913C9C5A0D90ED51D9652AB898435C49482F7",
                  },
                  n94RkpbJYRYQrWUmL8PAVQ1XTVKtfyKkLm8C6SWzWPcKEbuNb6EV: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "DAEA0C3D0C7F8FC9",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "03FF71B7890D04DA6835AE8AC92EF0DEF1B711BB5657E961E193B4246D03E277BB",
                    Signature:
                      "30440220675ACF64F6E0334A4BF85BD05B2C33B77E15A39C3F20C5BBA84A4BA2EF1C51A002202D98106992018AD1BC3CCCE4C9E168852D8114010A829AF2666029BFB5E553D4",
                  },
                  n94a894ARPe5RdcaRgdMBB9gG9ukS5mqsd7q2oNmC1NKqtZqEJnb: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996130,
                    Cookie: "4B53559B0DE7AD0E",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "03D462A07256F0ACFA2239C738E92D6EF6DA1EC66AC096FCA2D82822EFB8E906D6",
                    Signature:
                      "3045022100C2CE34367B88EA31BE02F501CD7F8AD6916AC5E43B30B4F0B7716C393453C43C0220138E59D53148BDD20064CCD6ED327A9E8E0CD805E46602AA4C9933D9D744CC22",
                  },
                  n9J1GJHtua77TBEzir3FvsgWX68xBFeC8os3s5TkCg97E1cwxKfH: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "0EDE0D62B35119BD",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "022A9C45D7B7310674EF97DAE1934DC9169824631D04D9019E7DDB42B2AC7810D0",
                    Signature:
                      "3045022100FB1BF4D01615CCCDC9ECA3D59268C9E3999A8E62A0D4129C26AEFD919AF6B3E2022038EC815F1EBEA9C4D58625E0081115D68CE8F9222E999B6695908EF330AD4596",
                  },
                  n9JgxBLdCHii4xnRNMk7WJhD2qmfJGRvCxmmNNivBZXPRVpeZkH3: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "A4D6B1BA93CD7588",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "021331E19770572D6DC7ED9940B95E2683DEC7A52043339F72AE085EEF89ED1720",
                    Signature:
                      "304402204288CDB2E81AB30A0A6EC06B1FD8886ACE99A6C5F3E0D1429C3DE04EAE5F9CF602207ED6576864C48FC5D536EDC0A6F81B06D542CB3D692E40AD73C430BAE13DD33C",
                  },
                  n9Jk38y9XCznqiLq53UjREJQbZWnz4Pvmph55GP5ofUPg3RG8eVr: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "D3516E683630EBA0",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "021A6C18A866B93660717D557CBC222703BABB7039B08E657695E9C2F6B15370CD",
                    Signature:
                      "3045022100EC5BD43BED2D02E4F6592AD366CAE523D8851218D94F7FAD02786379F67419190220782B0954C0611732CFD584A21ECDC63128A17E8D457DB449B20F104B2B0B29FF",
                  },
                  n9JkSnNqXxEct1t78dwVZDjq7PsznXtukxjyGvGJr4TdwVSbd7DJ: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996130,
                    Cookie: "910609388397713F",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "021B194861ABA5A868C941B570D2EBE927B7964F71157DA8EEBCA79105B434CC12",
                    Signature:
                      "30440220235DB2575192CF3C05343F3B75CA893B9858F675A9C57C3326BD750A95A37E820220599C836B4F164E0790A825214A9DBDD3EF3751E8CA308B2A3E2F694AEF244945",
                  },
                  n9JtY9MqUcwKWenHp8WoRobFRmB2mmBEJd1ruJmhKGKAwtFQkQjb: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "254CF575DD805984",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "022D805C9420A3F26E5B7AFB7FFE82715B06375626223D751A220448706741293C",
                    Signature:
                      "304502210085514C110A8F7D74F499CD13FFA9F2C0DD963D7E902C770AB8787B1E7230DEB302207C1EBB33D5BA09B2D47401C8845834B2ED4EAD144340FB30DE133982162ADC5C",
                  },
                  n9JvsY3yhCdsHe3JsVTwvCtvKnchg2eridHLWdBdWf8VkpZSqqS9: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "3DDD1C49CE8CC6C9",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "0230EC376FC7AA70726B1F63F40F875A9461018C7DC14D5C37EE1761005C7AD4D7",
                    Signature:
                      "304402205DC73E766159324597A05B924B7B5168EECE8D75BA8DE63FD434870C531B9A1802201393BB4714539521FADA0D9F1584AADB2C477EC3F1C14F5EC04D7A5D312D98A2",
                  },
                  n9KQ2DVL7QhgovChk81W8idxm7wDsYzXutDMQzwUBKuxb9WTWBVG: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "CCE883D98F48B201",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "0271B37FB1793EABF42356628A2E1E3A5F7583880CF2817847A91A35B26876A678",
                    Signature:
                      "30440220544CB00B8BF4580583EB2E19CA496F56E269AA33ECCE0C4C6335632B6A3E3EEB0220361A5F027D4D3BC94ED1822EAA21E2C893062CD9567FE616376061F1CB8CEECD",
                  },
                  n9KSXAVPy6ac8aX88fRsJN6eSrJ2gEfGrfskUVJJ7XkopGsKNg9X: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996130,
                    Cookie: "BA8B67F4589220A2",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "0276273FB120E9580D9C4513444DBD77AE23413FE205C59342D36B533C83E8C27E",
                    Signature:
                      "304502210090F7614F552B788E146CB4AC063C4BD86BA74C45E4870A651EDF9FDF29271C2002201BE16CBD3D47CB76B908B5795A686E30D1A28140575C7E94E4E43BBCA11A28D0",
                  },
                  n9KY4JZY11ndNbg55dThnoQdU9dii5q3egzoESVXw4Z7hu3maCba: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "4710CB4A3AD2FDBE",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "028366585D9556A2ED3291D503A7DBA11B3725AD660CC8CC41C2E701DD83F20088",
                    Signature:
                      "304402207790EA26CF011E235C8D7A656C7CAA547E34B7D86D421E7BD3ED7883AC3FEDC702202B5773461DCD76E4C7769E70B7D6061C9FDFEFF438474BF06436566F1AD0C32C",
                  },
                  n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "B3600228A12C51E3",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "0249B5973D1CF105D67C9F5BD6F07BD9D2DA6F0F3060877C32D9E9B071C1102F29",
                    Signature:
                      "304402203014459731E18F53FCCF2C8C1A13E1E8C88D238DBA27F7F63FE9E3E0CBB6290C02205F9E082214DB96C13181A8455C6993AEE48DCB4A5F2887EC5A0FDB8C23781A4F",
                  },
                  n9KeTQ3UyMtaJJD78vT7QiGRMv1GcWHEnhNbwKfdbW2HfRqtvUUt: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "79A4BF662CDB4B67",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "02913917B68EEB924A9127E9E943329C86A4F0C76E6123B3A3A2972EF4048E5070",
                    Signature:
                      "3044022079B92CBF7F1508ACFD8EB1F4C7BB5652E697DADDB682E216CCF018F2DB646B5A022001B76431D62351003618248EBB58C8BE093880F2E1B662D4C8A93BFB3FB82568",
                  },
                  n9Km4Xz53K9kcTaVn3mYAHsXqNuAo7A2HazSr34SFufvNwBxYGLn: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "1CCF53032FCBFF02",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "02A0ED4C2E4120107AEFA8B74D3E7BAFDC98A88FDB68827751AFEDDFC25F088A53",
                    Signature:
                      "3045022100B2478774F5024CDF42C40CCB63C7CD4EFCBFB213063CFEED67A66D2A236A1CFC0220143E9A25B32C029C7E51A360E9C7C500F06DA61EB22ACF46A4C318C0079A3429",
                  },
                  n9L3GcKLGWoz79RPfYq9GjEVyh57vpe1wM45i2tdczJ9u15ajAFB: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "E16C05B6443D79DE",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "02D060C70E143420389752E2512A90613ACFAA7E04D15D2624DEC919088048BFC1",
                    Signature:
                      "3045022100E3D067C3B0BED6EE15B8DA8EFDFEE31DA956A47D1F547E6502478F712E01A0F2022038A0C214B0EA9D94CF02339229DB883C8E2712D0D2BA77DB6D2F808B66C31780",
                  },
                  n9LFSE8fQ6Ljnc97ToHVtv1sYZ3GpzrXKpT94eFDk8jtdbfoBe7N: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "626A85646E1E5DED",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "032B949F3659D67DBF19A4E61359BB1FFBFD6256720C4C076378121D40372022FD",
                    Signature:
                      "3045022100AE22E8DA73096A827570B4B98A711EF83EEAFA29E92A57AD8473AAB3E5BC89200220080377B2EEA632FC8C599FD2E7648240A27BEF4544182E50535ECA3A69C9FA3B",
                  },
                  n9LL7K3Ubnob3ExqmgpigL3AgzKKhTaVvnZiXqsvz85VjbY3KqFp: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "E2368FAD522AC4E2",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "02EC156C63123D804C5AA03BF8EA5E25BFBFE65ECE05701C687E51DC64433D0EB4",
                    Signature:
                      "3045022100B7241232AEEC0F9F93C7A6CBE7C91A9137773CEA0F1C2ED2DDD066349A5543FB022033F03CFDE5D64BC417CF0F6071C6D1173AF223F94FC00A59E18428573EA4DD7F",
                  },
                  n9LMfcjE6dMyshCqiftLFXpB9K3Mnd2r5bG7K8osmrkFpHUoR3c1: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "B177B2A3E79A162B",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "02ED8B480C191109E6FE6ABD2BAB126499392646DC282BFA0BBBD05B60BC467655",
                    Signature:
                      "3045022100990F1356FCB11476EEDC669BD7149464B91E91034E80F8CA971D0EEC144091FE02206B7D23D545CCF333E7B4C3979C7F78B2AE038130051977DF80CCA4EFAC1FC2AB",
                  },
                  n9LPSEVyNTApMuchFeTE1GD9qhsH9Umagnpu3NLC9zb358KNfiZV: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "654BBA850CD51836",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "02F2D097458131ED174A31503DBA945D2891050C1CCA936ED3623759030D8FFF73",
                    Signature:
                      "30450221009EA9538D967E2A3CA1A913BBC4543927A7A51D80C3687875AD2D58D26D3CA3BB02207D8BFE1E7505B8DCBD643DEB28FDE1CE24372A07BF2FCE2BCA6CCA9553838247",
                  },
                  n9LabXG8Vo7SfrUcZudeDCuFvWXW5TXbhUSYwgqmgYMFpUYuMN87: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "059B578037484CA3",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "02CC93C43610606DAB9CE5BBD1E85A22C6CD8277176196710D02C4E7F114F0AC12",
                    Signature:
                      "304402202AC2DC71F565807C4145CB312D6777149E46EDE7F940A2012103B7BE2BA48CB20220690B56EC55FBCDD590864F23127703538CDE45658B214C23EA3937F95825C603",
                  },
                  n9LbDLg9F7ExZCeMw1QZqsd1Ejs9uYpwd8bPUStF5hBJdd6B5aWj: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "78B9674E66CD7E97",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "030D8E8CDEC4DC07D6C78B0037B93EF12747CA957A3CABFF2DD9C2B753A209FF91",
                    Signature:
                      "304402205E1E8C320399745039170DD0E26CEB601B390C128FFFBD2E2A8B89A15B4526CE02202D957421647C55D85A348072EE14F1CA2DA894529DA0A77C6D05DA0303E69350",
                  },
                  n9LbM9S5jeGopF5J1vBDoGxzV6rNS8K1T5DzhNynkFLqR9N2fywX: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "DF7DCF894C5A1092",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "030DDCC935E52EE00366E7B35650DD4697F4CEECDE53A607343CC113417EC579B5",
                    Signature:
                      "3044022049B28F3E76DA8E5A837AA4F9E8912892487A261F7EBC341A1EA1ACB471F1E8CC022066C84E4826262CD42ADF13E4D610330073D0DA1B5983555EAEAC41AB82E3B273",
                  },
                  n9LkAv98aaGupypuLMH5ogjJ3rTEX178s9EnmRvmySL9k3cVuxTu: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "94525D92D941D5BC",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "0323A8C668E7F99A7FF13714D8FFAA24010A466820DB3896F1E3FF06C84ECCCE5C",
                    Signature:
                      "3044022054E680AC1809080F208EC9C2B8AD798571C6B965720D13B2B592F6446BBCA19302207D06C7B84541ED5C18807597415AB35A944542286191EDFA03872031DE0BB9A0",
                  },
                  n9Lqr4YZxk7WYRDTBZjjmoAraikLCjAgAswaPaZ6LaGW6Q4Y2eoo: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "F097AEC3D2DBE28C",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "032CE084DEC33CF6FA0D093E0BC8C3E95C6702DBEB30FDF06F87545AF8A43B26FA",
                    Signature:
                      "3045022100DAB9044DF3B9BEA101D2B1A67A69DCD082A4420D1B1AB42C3587094A8B7471FD02206F5007750E066A88EDB6A01A791DDDCC76B9217BE6C967E54BA7A620A15B48BC",
                  },
                  n9Ls4GcrofTvLvymKh1wCqxw1aLzXUumyBBD9fAtbkk9WtdQ4TUH: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "C8A07383E894AE76",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "02C53F1B6CF5DE3EEFD1BA96AFCEB5401F032F92812A07C78F4FC32C86C858811A",
                    Signature:
                      "3044022049989554545653E9893F70FCC3526CFA5282381B08F9A16C1121AD6D9BD0CEB502202D73D24C3966B4BD74B88372F09844CEB68D7E9162054D8A345F9A13B94B940F",
                  },
                  n9M2UqXLK25h9YEQTskmCXbWPGhQmB1pFVqeXia38UwLaL838VbG: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "9AB3D20D40BD2A65",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "038EF66F1E48E3CA5CD7F4CAC610B717D84043D03EAF997956AE7449FA5E356A18",
                    Signature:
                      "30440220241D9A710941654ED4970A6176B0F3AFECF65306B0E2C265ABF40A57C57BDBC7022059FE739E0A23F22C63D8704383AFA1C7230DDF881F346BCA12B5F41950E61D47",
                  },
                  n9MSTcx1fmfyKpaDTtpXucugcqM7yxpaggmwRxcyA3Nr4pE1pN3x: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "7BCD0CE116723CFB",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "037D605C3078C15174E973D03377D27317D61E4A11139920802FD21305C26121C3",
                    Signature:
                      "3044022075F2685BFBC7CB7ACA4B6F4E0AD82A074603719EFD44F4FC7B95380D47CA9E7C0220472B94401A8F930366C8799BA1B4CA6F9440FD1A17A3831EF6BA41F55884F303",
                  },
                  n9MZ7EVGKypqdyNguP31xSqhFqDBF4V5FESLMmLiGrBJ3khP2AzQ: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "6E4B393067DB22B3",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "038D4BA061B8E1DF5366A4F46DA92BF5DA450AA2FE7E05C220D9806027977F869C",
                    Signature:
                      "3045022100ED08F7FB134E1A06A8824B63764F0429B7FEEA36853C191AF2DCCF607D5A336602200383A317B6335E31999D2BB7D2FD1DCB0CE8D6B045CAAB825A5DB40694C50657",
                  },
                  n9McDrz9tPujrQK3vMXJXzuEJv1B8UG3opfZEsFA8t6QxdZh1H6m: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "333BD58CD2DD2CED",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "039382CCEFCAC1E5960385751A11A9E7BE18AC8DABE75E3E639E99F335510780E8",
                    Signature:
                      "3045022100841A1BFC1FEA7C013C8A09988B77DA2582BAD3D1961CDEA340980D4B75C1332A022046F7E8D37EE0EB31F107B73DCD926178A1605C76601B054747E71453C916B581",
                  },
                  n9MfeCuZK2ra5eJtFDtuCTnvxfsi85k4J3GXJ1TvRVr2o4EQeHMF: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "15050F40AC109AF0",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "0352AACDE31714880E7EA63677E27BAB3AB6E28AEE0130A49A8A4250C189384065",
                    Signature:
                      "30440220783BEC708215535D8213966796EA453EEC392BBFD8910CD46D84635E644FCC8F02204F1B3D42F1676B0AB2E5AFBBEB86D352E0A34AF9C0F104599142DFF2134DF179",
                  },
                  n9MhLZsK7Av6ny2gV5SAGLDsnFXE9p85aYR8diD8xvuvuucqad85: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "129AF66007407D63",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "034B2562011A5A06608454583621331D1234FC597177321E276242124CD1DF111A",
                    Signature:
                      "304402204393E1651739E961AB6FBAB3EFAD2F61E2BEDE72D9FBA6DDE9EE59748BFE020F02202A2F00F46C406F07DD8F3B03EDEACA0217F67977D953E0A45470C33449B181DD",
                  },
                  n9MngHUqEeJXd8cgeEGsjvm9FqQRm4DwhCrTYCtrfnm5FWGFaR6m: {
                    Flags: 2147483649,
                    LedgerSequence: 83576782,
                    SigningTime: 751996131,
                    Cookie: "265835BB5C18ADCC",
                    LedgerHash: "F137D2BF23D8397204974FBEB1EC99C90E7569BF02C7EFCB09A4157EF59D881F",
                    ConsensusHash: "080F898C23A7D1FD38350245D233CEB6E45B1AED8C19ACC4A4E545AB9889F957",
                    ValidatedHash: "84EC888F0F2F0D0F1579964D85D4586FF676CCC70DD2077B02ACB51147A9ECA6",
                    SigningPubKey: "034E305DEEEF38A71F800EB48D80F8FDA50D3948E8BBD60C7D802A7CDD707FC286",
                    Signature:
                      "3045022100D4706A2EA9330B77E1C8C86692C12B0A1734C31B040C0E061AA6357F08B0C2CC02201FD4733BC1475BA348093B34DB82FA799978A4F6DEDA8BDBECB9E3F7F71A4798",
                  },
                },
                unl: {
                  version: 1,
                  PublicKey: "ED45D1840EE724BE327ABE9146503D5848EFD5F38B6D5FEDE71E80ACCE5E6E738B",
                  manifest:
                    "JAAAAAFxIe1F0YQO5yS+Mnq+kUZQPVhI79Xzi21f7ecegKzOXm5zi3Mh7RiCXiUBmFIhZUbZfHHGCftCtcsPeSU01cwAt0hkhs0UdkAQnI9+pUYXskMF1Er1SPrem9zMEOxDx24aS+88WIgXpslXVyRPehFwtnTTb+LwUx7yUXoH3h31Qkruu2RZG70NcBJAy3pkPr9jhqyPvB7T4Nz8j/MjEaNa9ohMLztonxAAZDpcB+zX8QVvQ4GUiAePLCKF/fqTKfhUkSfobozPOi/bCQ==",
                  decodedManifest: {
                    Sequence: 1,
                    PublicKey: "ED45D1840EE724BE327ABE9146503D5848EFD5F38B6D5FEDE71E80ACCE5E6E738B",
                    publicKey: "nHBtBkHGfL4NpB54H1AwBaaSJkSJLUSPvnUNAcuNpuffYB51VjH6",
                    address: "r4BYAeQvWjU9Bh2yod8WgRDmmNH2G1pybo",
                    SigningPubKey: "ED18825E25019852216546D97C71C609FB42B5CB0F792534D5CC00B7486486CD14",
                    signingPubKey: "nHBYNPHW6LJGzHF8AynFg4TdVD9M9wo5YSf7ybgf8Gobu42GHxbd",
                    Signature:
                      "109C8F7EA54617B24305D44AF548FADE9BDCCC10EC43C76E1A4BEF3C588817A6C95757244F7A1170B674D36FE2F0531EF2517A07DE1DF5424AEEBB64591BBD0D",
                    MasterSignature:
                      "CB7A643EBF6386AC8FBC1ED3E0DCFC8FF32311A35AF6884C2F3B689F1000643A5C07ECD7F1056F43819488078F2C2285FDFA9329F8549127E86E8CCF3A2FDB09",
                  },
                  signature:
                    "5B2D6E3738FD83806E6E2AF266714B10FDC00452C4BEDA7321F3D4A1A62FD8AA5F0667831A9DF4EB68D5E9D1D4D6ADBCD1E039654273037AC458BEC1F779880B",
                  blob: {
                    sequence: 2023102101,
                    expiration: 1713398400,
                    validators: [
                      {
                        PublicKey: "ED13AAFCB6A87BCB5D093C2EF37F04431C291126D674293305152D9776C6ABA4D6",
                        manifest:
                          "JAAAAAFxIe0Tqvy2qHvLXQk8LvN/BEMcKREm1nQpMwUVLZd2xquk1nMhA9RioHJW8Kz6IjnHOOktbvbaHsZqwJb8otgoIu+46QbWdkYwRAIgE0pz8HpSKrUsJ8E390K8KCwmvExB00jLvqPv9LZr6roCIAl9zLWeIRSsBRIaOl5alblYMYMXrpbxJZ7t+jtbiT9Ldwd4cnAudmV0cBJADEZOQPQJcWj0zPjulcvH1o8WhQ9jrKzWV/mkXSHGjmzIiekkOzUcEnzmJXwJYWZZnA0jTLE30OYmxCRXfCm9Bg==",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "ED13AAFCB6A87BCB5D093C2EF37F04431C291126D674293305152D9776C6ABA4D6",
                          publicKey: "nHBWa56Vr7csoFcCnEPzCCKVvnDQw3L28mATgHYQMGtbEfUjuYyB",
                          address: "r9Zwxiuv4GMLvEscjjuexTUsb8ttzJmUXV",
                          SigningPubKey: "03D462A07256F0ACFA2239C738E92D6EF6DA1EC66AC096FCA2D82822EFB8E906D6",
                          signingPubKey: "n94a894ARPe5RdcaRgdMBB9gG9ukS5mqsd7q2oNmC1NKqtZqEJnb",
                          Signature:
                            "30440220134A73F07A522AB52C27C137F742BC282C26BC4C41D348CBBEA3EFF4B66BEABA0220097DCCB59E2114AC05121A3A5E5A95B958318317AE96F1259EEDFA3B5B893F4B",
                          Domain: "7872702E766574",
                          domain: "xrp.vet",
                          MasterSignature:
                            "0C464E40F4097168F4CCF8EE95CBC7D68F16850F63ACACD657F9A45D21C68E6CC889E9243B351C127CE6257C096166599C0D234CB137D0E626C424577C29BD06",
                        },
                      },
                      {
                        PublicKey: "ED2C1468B4A11D281F93EF337C95E4A08DF0000FDEFB6D0EA9BC05FBD5D61A1F5A",
                        manifest:
                          "JAAAAAFxIe0sFGi0oR0oH5PvM3yV5KCN8AAP3vttDqm8BfvV1hofWnMhAkMUmCD2aPmgFDDRmimvSicSIScw6YNr42Dw4RAdwrOAdkcwRQIhAJFOHMg6qTG8v60dhrenYYk6cwOaRXq0RNmLjyyCiz5lAiAdU0YkDUJQhnN8Ry8s+6zTJLiNLbtM8oO/cLnurVpRM3ASQGALarHAsJkSZQtGdM2AaR/joFK/jhDU57+l+RSYjri/ydE20DaKanwkMEoVlBTg7lX4hYjEnmkqo73wIthLOAQ=",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "ED2C1468B4A11D281F93EF337C95E4A08DF0000FDEFB6D0EA9BC05FBD5D61A1F5A",
                          publicKey: "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm",
                          address: "radgyvKaXSR2TmZ42bMaA4Lhhh4D9ePHB6",
                          SigningPubKey: "0243149820F668F9A01430D19A29AF4A2712212730E9836BE360F0E1101DC2B380",
                          signingPubKey: "n9KhsMP6jKFQPpjJ9VwqyZSwrL4shdX9YknRwmsAVL1RNVrx4jLm",
                          Signature:
                            "3045022100914E1CC83AA931BCBFAD1D86B7A761893A73039A457AB444D98B8F2C828B3E6502201D5346240D425086737C472F2CFBACD324B88D2DBB4CF283BF70B9EEAD5A5133",
                          MasterSignature:
                            "600B6AB1C0B09912650B4674CD80691FE3A052BF8E10D4E7BFA5F914988EB8BFC9D136D0368A6A7C24304A159414E0EE55F88588C49E692AA3BDF022D84B3804",
                        },
                      },
                      {
                        PublicKey: "ED4246AA3AE9D29863944800CCA91829E4447498A20CD9C3973A6B59346C75AB95",
                        manifest:
                          "JAAAAAFxIe1CRqo66dKYY5RIAMypGCnkRHSYogzZw5c6a1k0bHWrlXMhAkm1lz0c8QXWfJ9b1vB72dLabw8wYId8MtnpsHHBEC8pdkYwRAIgQlb6HJ53hsTAfVid+AOdBVvMF7rahIKNLBHUgn52zBECIGLUqFu8a1AAHRJcVonKYEnmhJwbCXLn+je7na1WD1/ocBJAE4vfvrGSmZC2uAUGmM5dIBtoSgEUey+2VleDYEsce94txYcjR8Z7QLNaliD8w/bD5/hvYQ8meV1Wg1jJFNe0CA==",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "ED4246AA3AE9D29863944800CCA91829E4447498A20CD9C3973A6B59346C75AB95",
                          publicKey: "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
                          address: "rnecUwtMPhRzbEv2LSvoVNFjyNLyKjo4Yy",
                          SigningPubKey: "0249B5973D1CF105D67C9F5BD6F07BD9D2DA6F0F3060877C32D9E9B071C1102F29",
                          signingPubKey: "n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR",
                          Signature:
                            "304402204256FA1C9E7786C4C07D589DF8039D055BCC17BADA84828D2C11D4827E76CC11022062D4A85BBC6B50001D125C5689CA6049E6849C1B0972E7FA37BB9DAD560F5FE8",
                          MasterSignature:
                            "138BDFBEB1929990B6B8050698CE5D201B684A01147B2FB6565783604B1C7BDE2DC5872347C67B40B35A9620FCC3F6C3E7F86F610F26795D568358C914D7B408",
                        },
                      },
                      {
                        PublicKey: "ED5784A43AA84B5BDAFD0AFEF64ADA5583A3129182C6A7464950FD6BF2D9FAE5B0",
                        manifest:
                          "JAAAAAFxIe1XhKQ6qEtb2v0K/vZK2lWDoxKRgsanRklQ/Wvy2frlsHMhArdbSEl/Oha4I5VI0qVxmc1zBWoRb5YnutciOC0l+OYddkcwRQIhAIqluIgtzGJZJG9s7t2558ipnGfgXOZxOBN+VXey4iSmAiAWJzzanXjXImMB/VtHHrqs1V4xnlg8uF+y7Ms+1vMGZnASQCZYnNR3aSlwdYpRkP5v1V9a5BesJUZD6UJ1nMr5b5VoOml+DjVtDUZysrCIx00a+gLz+th86gTey7UnCrqgQgk=",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "ED5784A43AA84B5BDAFD0AFEF64ADA5583A3129182C6A7464950FD6BF2D9FAE5B0",
                          publicKey: "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR",
                          address: "r3Qho2Hv1vtiQzL6QRwKBmNEabiVVqAuus",
                          SigningPubKey: "02B75B48497F3A16B8239548D2A57199CD73056A116F9627BAD722382D25F8E61D",
                          signingPubKey: "n9KAE7DUEB62ZQ3yWzygKWWqsj7ZqchW5rXg63puZA46k7WzGfQu",
                          Signature:
                            "30450221008AA5B8882DCC6259246F6CEEDDB9E7C8A99C67E05CE67138137E5577B2E224A6022016273CDA9D78D7226301FD5B471EBAACD55E319E583CB85FB2ECCB3ED6F30666",
                          MasterSignature:
                            "26589CD477692970758A5190FE6FD55F5AE417AC254643E942759CCAF96F95683A697E0E356D0D4672B2B088C74D1AFA02F3FAD87CEA04DECBB5270ABAA04209",
                        },
                      },
                      {
                        PublicKey: "ED583ECD06C3B7369980E65C78C440A529300F557ED81256283F7DD5AA3513A334",
                        manifest:
                          "JAAAAAFxIe1YPs0Gw7c2mYDmXHjEQKUpMA9VftgSVig/fdWqNROjNHMhAyuUnzZZ1n2/GaTmE1m7H/v9YlZyDEwHY3gSHUA3ICL9dkYwRAIgHx2PHvidoN+5yG9WeAS2k7nwIM8ajxQW6wjvt8kBenACIDNxQPQkDyDJH9seS5C62mAarQmgiN89YS3jhNtnvEIqcBJAj7Jh0Kac+aJdpoepu/+eJKnnFQ7YByZB8eMZ+SS1zLhE+lip/49qqVNcpAxEqfaGtxJzoDDD1/QbuU7NOSPkCg==",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "ED583ECD06C3B7369980E65C78C440A529300F557ED81256283F7DD5AA3513A334",
                          publicKey: "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam",
                          address: "r98vV3hkPiu7AR1H2eivnb7E3GeykdNsA2",
                          SigningPubKey: "032B949F3659D67DBF19A4E61359BB1FFBFD6256720C4C076378121D40372022FD",
                          signingPubKey: "n9LFSE8fQ6Ljnc97ToHVtv1sYZ3GpzrXKpT94eFDk8jtdbfoBe7N",
                          Signature:
                            "304402201F1D8F1EF89DA0DFB9C86F567804B693B9F020CF1A8F1416EB08EFB7C9017A700220337140F4240F20C91FDB1E4B90BADA601AAD09A088DF3D612DE384DB67BC422A",
                          MasterSignature:
                            "8FB261D0A69CF9A25DA687A9BBFF9E24A9E7150ED8072641F1E319F924B5CCB844FA58A9FF8F6AA9535CA40C44A9F686B71273A030C3D7F41BB94ECD3923E40A",
                        },
                      },
                      {
                        PublicKey: "ED5E82276BCC278499E4285399789F5A93196166B552957997A61599D4F8613959",
                        manifest:
                          "JAAAAAFxIe1egidrzCeEmeQoU5l4n1qTGWFmtVKVeZemFZnU+GE5WXMhAw2OjN7E3AfWx4sAN7k+8SdHypV6PKv/LdnCt1OiCf+RdkYwRAIgf5hIqlhCsDXUmJqdrU6CaM+tl34yqRo7QzOYB2JEyo8CIFfMBva7js/PM9yyJo95jxE+VTpWCxXd9o7c7qjyituTcBJA+biCZchkbricoQKMSbtUFRih10Khob4lva+SMz6ldA8c5wXWUnOlqZ7WWyG1y+FaM7CzDAx4iEg3KMQm44nUCQ==",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "ED5E82276BCC278499E4285399789F5A93196166B552957997A61599D4F8613959",
                          publicKey: "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp",
                          address: "rwogkY2h5aPpew6CQfwqeTVYu3ac6ovi8S",
                          SigningPubKey: "030D8E8CDEC4DC07D6C78B0037B93EF12747CA957A3CABFF2DD9C2B753A209FF91",
                          signingPubKey: "n9LbDLg9F7ExZCeMw1QZqsd1Ejs9uYpwd8bPUStF5hBJdd6B5aWj",
                          Signature:
                            "304402207F9848AA5842B035D4989A9DAD4E8268CFAD977E32A91A3B433398076244CA8F022057CC06F6BB8ECFCF33DCB2268F798F113E553A560B15DDF68EDCEEA8F28ADB93",
                          MasterSignature:
                            "F9B88265C8646EB89CA1028C49BB541518A1D742A1A1BE25BDAF92333EA5740F1CE705D65273A5A99ED65B21B5CBE15A33B0B30C0C7888483728C426E389D409",
                        },
                      },
                      {
                        PublicKey: "ED691303992FEC64E6BC4BACD36AE6E5AEDC23F2861B6D8EFB9FD77EE3EADE3435",
                        manifest:
                          "JAAAAAFxIe1pEwOZL+xk5rxLrNNq5uWu3CPyhhttjvuf137j6t40NXMhAi2AXJQgo/JuW3r7f/6CcVsGN1YmIj11GiIESHBnQSk8dkcwRQIhANCDEQymrd6veT3ouacF6fhBr5wLw3GmXg1rMCLVvBzZAiA8uWQ+tqd46WmfBexjSBQ2Jd6UAGdrHvjcCQ2ZgSooCnASQFkHl+D7/U3WByYP384+pcFDf2Gi4WIRHVTo58cqdk5CDiwc1T0rDoLhmo41a3f+dsftfwR4aMmwFcPXLnrjrAI=",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "ED691303992FEC64E6BC4BACD36AE6E5AEDC23F2861B6D8EFB9FD77EE3EADE3435",
                          publicKey: "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT",
                          address: "rhL3TbcmLsbuBTyZAysqC4LZfzydtdwwrj",
                          SigningPubKey: "022D805C9420A3F26E5B7AFB7FFE82715B06375626223D751A220448706741293C",
                          signingPubKey: "n9JtY9MqUcwKWenHp8WoRobFRmB2mmBEJd1ruJmhKGKAwtFQkQjb",
                          Signature:
                            "3045022100D083110CA6ADDEAF793DE8B9A705E9F841AF9C0BC371A65E0D6B3022D5BC1CD902203CB9643EB6A778E9699F05EC6348143625DE9400676B1EF8DC090D99812A280A",
                          MasterSignature:
                            "590797E0FBFD4DD607260FDFCE3EA5C1437F61A2E162111D54E8E7C72A764E420E2C1CD53D2B0E82E19A8E356B77FE76C7ED7F047868C9B015C3D72E7AE3AC02",
                        },
                      },
                      {
                        PublicKey: "ED8252C2F91523126EEF9A21964C7E487A10D6D63D459139700DBC70D9F7BAD542",
                        manifest:
                          "JAAAAAFxIe2CUsL5FSMSbu+aIZZMfkh6ENbWPUWROXANvHDZ97rVQnMhA41LoGG44d9TZqT0bakr9dpFCqL+fgXCINmAYCeXf4acdkYwRAIgdMgcVlVPIffb1ITBaWjSJ+Asy7P98GO9WDmiBm42epsCIADSZmxluN/NPn7nwKZ6G3xfeF8lH5ecItPWNrWWOuW4cBJAtstv8IUUMnTZdUzjm8YQDAGqooWCik5ttjYmk46qq2TsWRTIL73Kp9VLHbGrEvNdkn5YLBmdwfTwhWmBriQvAw==",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "ED8252C2F91523126EEF9A21964C7E487A10D6D63D459139700DBC70D9F7BAD542",
                          publicKey: "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC",
                          address: "rK6zg8EcscQywkPS2kVfaFypwNvhLNp3VW",
                          SigningPubKey: "038D4BA061B8E1DF5366A4F46DA92BF5DA450AA2FE7E05C220D9806027977F869C",
                          signingPubKey: "n9MZ7EVGKypqdyNguP31xSqhFqDBF4V5FESLMmLiGrBJ3khP2AzQ",
                          Signature:
                            "3044022074C81C56554F21F7DBD484C16968D227E02CCBB3FDF063BD5839A2066E367A9B022000D2666C65B8DFCD3E7EE7C0A67A1B7C5F785F251F979C22D3D636B5963AE5B8",
                          MasterSignature:
                            "B6CB6FF085143274D9754CE39BC6100C01AAA285828A4E6DB63626938EAAAB64EC5914C82FBDCAA7D54B1DB1AB12F35D927E582C199DC1F4F0856981AE242F03",
                        },
                      },
                      {
                        PublicKey: "ED95C5172B2AD7D39434EEBC436B65B3BB7E58D5C1CEFC820B6972ACAD776E286A",
                        manifest:
                          "JAAAAAFxIe2VxRcrKtfTlDTuvENrZbO7fljVwc78ggtpcqytd24oanMhAiqcRde3MQZ075fa4ZNNyRaYJGMdBNkBnn3bQrKseBDQdkYwRAIgU+LfcE71DPVrO+KtUBjQ9D2u0k/Pr7lukO1nPRj6hSACIDNLYC/JFgobCsIa0BGw+6bUnOw9meU3FdXgR7Q7SoqJcBJAXQakOoQnPp3pcLL7zdKCPUX4b+/FC9Unhqp+O9xQFnRaCWVGmk5MJOIMs4WOQdpM1j3OgSsABmRuCXYvwo/nDw==",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "ED95C5172B2AD7D39434EEBC436B65B3BB7E58D5C1CEFC820B6972ACAD776E286A",
                          publicKey: "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C",
                          address: "rGVWScKRLJRQx2ZaPhbxFQwCv61TkqhjR7",
                          SigningPubKey: "022A9C45D7B7310674EF97DAE1934DC9169824631D04D9019E7DDB42B2AC7810D0",
                          signingPubKey: "n9J1GJHtua77TBEzir3FvsgWX68xBFeC8os3s5TkCg97E1cwxKfH",
                          Signature:
                            "3044022053E2DF704EF50CF56B3BE2AD5018D0F43DAED24FCFAFB96E90ED673D18FA85200220334B602FC9160A1B0AC21AD011B0FBA6D49CEC3D99E53715D5E047B43B4A8A89",
                          MasterSignature:
                            "5D06A43A84273E9DE970B2FBCDD2823D45F86FEFC50BD52786AA7E3BDC5016745A0965469A4E4C24E20CB3858E41DA4CD63DCE812B0006646E09762FC28FE70F",
                        },
                      },
                      {
                        PublicKey: "EDA4074FD039407BD2464F14C378440D5B02CA8FBA661B286D1C82A3D59E8E6EC0",
                        manifest:
                          "JAAAAAFxIe2kB0/QOUB70kZPFMN4RA1bAsqPumYbKG0cgqPVno5uwHMhAyOoxmjn+Zp/8TcU2P+qJAEKRmgg2ziW8eP/BshOzM5cdkcwRQIhAJxbW/beoMl811igSI+5P3B4Fnd9wVYc9sd0XbKhImFoAiBmTH7knrw3xWifMFClZm09BL0TYul2c+5o8Zp43MExR3ASQNmCwIgkMoqa7iqqI39XTMLFWlrqSQWsMdHcqvxZuVMU+YB2cSsAFkepe/RiskfPC3yJsc2k4US5nCQyqXdZ5QQ=",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "EDA4074FD039407BD2464F14C378440D5B02CA8FBA661B286D1C82A3D59E8E6EC0",
                          publicKey: "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn",
                          address: "rKadQR7RJ8azS4HdmcR2gj9LQ78vkzk5qW",
                          SigningPubKey: "0323A8C668E7F99A7FF13714D8FFAA24010A466820DB3896F1E3FF06C84ECCCE5C",
                          signingPubKey: "n9LkAv98aaGupypuLMH5ogjJ3rTEX178s9EnmRvmySL9k3cVuxTu",
                          Signature:
                            "30450221009C5B5BF6DEA0C97CD758A0488FB93F707816777DC1561CF6C7745DB2A12261680220664C7EE49EBC37C5689F3050A5666D3D04BD1362E97673EE68F19A78DCC13147",
                          MasterSignature:
                            "D982C08824328A9AEE2AAA237F574CC2C55A5AEA4905AC31D1DCAAFC59B95314F98076712B001647A97BF462B247CF0B7C89B1CDA4E144B99C2432A97759E504",
                        },
                      },
                      {
                        PublicKey: "EDA8D29F40CEB28995617641A3BC42692E1DE883214F612FBB62087A148E5F6F9A",
                        manifest:
                          "JAAAAAFxIe2o0p9AzrKJlWF2QaO8QmkuHeiDIU9hL7tiCHoUjl9vmnMhAnYnP7Eg6VgNnEUTRE29d64jQT/iBcWTQtNrUzyD6MJ+dkcwRQIhAOEsV5anTkloSmTZRbimMyBKqHoJYXcBBe8lLiPYC7mUAiAz2aNOpfQ/1LycWloIMvdhxzinq5X7Uas/uOSb9wh8d3ASQLVkfpW/GO6wdT6AuuSJ56TtM343pDNH+iSzxltIfdrPiUxT5rf4k21lQQuPClXm9+SfKrCiUXZK7dj0/GWTYQg=",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "EDA8D29F40CEB28995617641A3BC42692E1DE883214F612FBB62087A148E5F6F9A",
                          publicKey: "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW",
                          address: "rDZj5keWThRDBZgJPCDkSf6R24u4YdL2kT",
                          SigningPubKey: "0276273FB120E9580D9C4513444DBD77AE23413FE205C59342D36B533C83E8C27E",
                          signingPubKey: "n9KSXAVPy6ac8aX88fRsJN6eSrJ2gEfGrfskUVJJ7XkopGsKNg9X",
                          Signature:
                            "3045022100E12C5796A74E49684A64D945B8A633204AA87A0961770105EF252E23D80BB994022033D9A34EA5F43FD4BC9C5A5A0832F761C738A7AB95FB51AB3FB8E49BF7087C77",
                          MasterSignature:
                            "B5647E95BF18EEB0753E80BAE489E7A4ED337E37A43347FA24B3C65B487DDACF894C53E6B7F8936D65410B8F0A55E6F7E49F2AB0A251764AEDD8F4FC65936108",
                        },
                      },
                      {
                        PublicKey: "EDFE65FB385B6BB16951153D2A0F32BD6D8CC4532C87BB3E1900913A7BE34F5EF7",
                        manifest:
                          "JAAAAAFxIe3+Zfs4W2uxaVEVPSoPMr1tjMRTLIe7PhkAkTp7409e93MhA31gXDB4wVF06XPQM3fScxfWHkoRE5kggC/SEwXCYSHDdkcwRQIhAMSEv7ka1d70zTe3ctwBb9d+hx+wZjveZbcVuphfzRg/AiBOjyeTN0fvbjmur+lV/ovG1A9Zfkn7HmO7nbrFiorLwXASQLAHLgKpleHyaSQv0O4dCI0rSuvPR4Svw9FkMCorVZKG7ywAmKN2hRW8UraUfqm2HpQCq4AASgRoR2/YhBQCEgo=",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "EDFE65FB385B6BB16951153D2A0F32BD6D8CC4532C87BB3E1900913A7BE34F5EF7",
                          publicKey: "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj",
                          address: "rhezz7P9A2Mj713UxARVRKnKSVFbNB2XwD",
                          SigningPubKey: "037D605C3078C15174E973D03377D27317D61E4A11139920802FD21305C26121C3",
                          signingPubKey: "n9MSTcx1fmfyKpaDTtpXucugcqM7yxpaggmwRxcyA3Nr4pE1pN3x",
                          Signature:
                            "3045022100C484BFB91AD5DEF4CD37B772DC016FD77E871FB0663BDE65B715BA985FCD183F02204E8F27933747EF6E39AEAFE955FE8BC6D40F597E49FB1E63BB9DBAC58A8ACBC1",
                          MasterSignature:
                            "B0072E02A995E1F269242FD0EE1D088D2B4AEBCF4784AFC3D164302A2B559286EF2C0098A3768515BC52B6947EA9B61E9402AB80004A0468476FD8841402120A",
                        },
                      },
                      {
                        PublicKey: "EDC1897CE83B6DCF58858574EC9FE027D4B1538A0F20823800A5529E121E87A93B",
                        manifest:
                          "JAAAAAFxIe3BiXzoO23PWIWFdOyf4CfUsVOKDyCCOAClUp4SHoepO3MhAyzghN7DPPb6DQk+C8jD6VxnAtvrMP3wb4dUWvikOyb6dkcwRQIhANmpvnJnNABmsVVTgZGG9/gJ2gO10+reIvj1RmCN27kuAiBqG5TMjHKdSHDo2kRX/yIc6ZbzMxCeQNg0p/VQYHB70HASQEEWeQ3EJKifr/rFQRGYTATKtK/KmSyR246DAYGDkMwmqZ9MUhjAalWPdSks+q8E8lmxnkElmJ9IRL80efslCAQ=",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "EDC1897CE83B6DCF58858574EC9FE027D4B1538A0F20823800A5529E121E87A93B",
                          publicKey: "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW",
                          address: "racujcaYgqk6LQ2eW51hW9EvkuX2P77GGS",
                          SigningPubKey: "032CE084DEC33CF6FA0D093E0BC8C3E95C6702DBEB30FDF06F87545AF8A43B26FA",
                          signingPubKey: "n9Lqr4YZxk7WYRDTBZjjmoAraikLCjAgAswaPaZ6LaGW6Q4Y2eoo",
                          Signature:
                            "3045022100D9A9BE7267340066B15553819186F7F809DA03B5D3EADE22F8F546608DDBB92E02206A1B94CC8C729D4870E8DA4457FF221CE996F333109E40D834A7F55060707BD0",
                          MasterSignature:
                            "4116790DC424A89FAFFAC54111984C04CAB4AFCA992C91DB8E8301818390CC26A99F4C5218C06A558F75292CFAAF04F259B19E4125989F4844BF3479FB250804",
                        },
                      },
                      {
                        PublicKey: "EDC2A138B3771C208965596D4D372331C17A5476BD2CE2BC7A6D3CD273DF330D99",
                        manifest:
                          "JAAAAAFxIe3CoTizdxwgiWVZbU03IzHBelR2vSzivHptPNJz3zMNmXMhA9j/pUGrPDYl63JdWVsqbHWDBdJ9H57NVL42LO6gLwo1dkcwRQIhAJeTyxdK1KYpxxI8kLvhzCz5OhGZ42lFCYMSwMmavI4pAiBsWsvxet4JBhZun9ZoZJpCZ/VuNIt10YlnrtcNcEBe53ASQHDJJeC4NJZlvm1WI5y/byOh4hvY8fqsmD0bXZsSN9G3TRALSLeCkdLRGbJZNMODXflcp+tHfU7FX4JOdRVMxQ0=",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "EDC2A138B3771C208965596D4D372331C17A5476BD2CE2BC7A6D3CD273DF330D99",
                          publicKey: "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK",
                          address: "rJGaPD5VyYr4fBQ8JavJA4UgtgP2ARoMWq",
                          SigningPubKey: "03D8FFA541AB3C3625EB725D595B2A6C758305D27D1F9ECD54BE362CEEA02F0A35",
                          signingPubKey: "n943ozDG74swHRmAjzY6A4KVFBhEirF4Sh1ACqvDePE3CZTgkMqn",
                          Signature:
                            "30450221009793CB174AD4A629C7123C90BBE1CC2CF93A1199E36945098312C0C99ABC8E2902206C5ACBF17ADE0906166E9FD668649A4267F56E348B75D18967AED70D70405EE7",
                          MasterSignature:
                            "70C925E0B8349665BE6D56239CBF6F23A1E21BD8F1FAAC983D1B5D9B1237D1B74D100B48B78291D2D119B25934C3835DF95CA7EB477D4EC55F824E75154CC50D",
                        },
                      },
                      {
                        PublicKey: "ED38B0288EA240B4CDEC18A1A6289EB49007E4EBC0DE944803EB7EF141C5664073",
                        manifest:
                          "JAAAAAJxIe04sCiOokC0zewYoaYonrSQB+TrwN6USAPrfvFBxWZAc3MhApE5F7aO65JKkSfp6UMynIak8MduYSOzo6KXLvQEjlBwdkYwRAIgKm2A11A2M4FqzEW+vroUyTbHSpkjd3elQ/N0sQThw0sCIBKlX033kXdaiJ54l7SiBoQnwHnSaQfT4by00YncKWzVdwtiaXRob21wLmNvbXASQAsl/ShkQ4RE7arvTowD84sOPhizCQlH3IzqvaC7/52WL92FzH4s2MRzssIBUCwEh4jNArcxFy/gA+MO24QQ1g8=",
                        decodedManifest: {
                          Sequence: 2,
                          PublicKey: "ED38B0288EA240B4CDEC18A1A6289EB49007E4EBC0DE944803EB7EF141C5664073",
                          publicKey: "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA",
                          address: "rKontEGtDju5MCEJCwtrvTWQQqVAw5juXe",
                          SigningPubKey: "02913917B68EEB924A9127E9E943329C86A4F0C76E6123B3A3A2972EF4048E5070",
                          signingPubKey: "n9KeTQ3UyMtaJJD78vT7QiGRMv1GcWHEnhNbwKfdbW2HfRqtvUUt",
                          Signature:
                            "304402202A6D80D7503633816ACC45BEBEBA14C936C74A99237777A543F374B104E1C34B022012A55F4DF791775A889E7897B4A2068427C079D26907D3E1BCB4D189DC296CD5",
                          Domain: "626974686F6D702E636F6D",
                          domain: "bithomp.com",
                          MasterSignature:
                            "0B25FD2864438444EDAAEF4E8C03F38B0E3E18B3090947DC8CEABDA0BBFF9D962FDD85CC7E2CD8C473B2C201502C048788CD02B731172FE003E30EDB8410D60F",
                        },
                      },
                      {
                        PublicKey: "ED2487C027AEB592211DF56474E841AADA0C1F4F0628E804EE9F12EC4E7C5519B9",
                        manifest:
                          "JAAAAAJxIe0kh8AnrrWSIR31ZHToQaraDB9PBijoBO6fEuxOfFUZuXMhA1KqzeMXFIgOfqY2d+J7qzq24oruATCkmopCUMGJOEBldkYwRAIgCwa3VLJb/Dzkb2vyX/Z+uTQJU3P+KdCjagwKSLEguj4CIF00+9ztyp3KgV7MQmAi+nogs4f8rPbcG3SQAktWmscodxR4cnB2YWxpZGF0b3IuZnRzby5ldXASQJ4IcwxDN69Q4mkjemSlFX+mrNhsITvmeTyEP4f5E6WcE1u/WlDNCdqs/RDTG98eqyJE6MGUB76Qnxqb8Zi71QU=",
                        decodedManifest: {
                          Sequence: 2,
                          PublicKey: "ED2487C027AEB592211DF56474E841AADA0C1F4F0628E804EE9F12EC4E7C5519B9",
                          publicKey: "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr",
                          address: "rD6Rc3cKazuUutMCzDteLV6DPg7PkiyRqy",
                          SigningPubKey: "0352AACDE31714880E7EA63677E27BAB3AB6E28AEE0130A49A8A4250C189384065",
                          signingPubKey: "n9MfeCuZK2ra5eJtFDtuCTnvxfsi85k4J3GXJ1TvRVr2o4EQeHMF",
                          Signature:
                            "304402200B06B754B25BFC3CE46F6BF25FF67EB934095373FE29D0A36A0C0A48B120BA3E02205D34FBDCEDCA9DCA815ECC426022FA7A20B387FCACF6DC1B7490024B569AC728",
                          Domain: "78727076616C696461746F722E6674736F2E6575",
                          domain: "xrpvalidator.ftso.eu",
                          MasterSignature:
                            "9E08730C4337AF50E269237A64A5157FA6ACD86C213BE6793C843F87F913A59C135BBF5A50CD09DAACFD10D31BDF1EAB2244E8C19407BE909F1A9BF198BBD505",
                        },
                      },
                      {
                        PublicKey: "ED6A54975A94EB9715E4F4E3FCD1661FCD40C065E6C22E461FEE87267DD73A2D6A",
                        manifest:
                          "JAAAAAJxIe1qVJdalOuXFeT04/zRZh/NQMBl5sIuRh/uhyZ91zotanMhAsyTxDYQYG2rnOW70ehaIsbNgncXYZZxDQLE5/EU8KwSdkcwRQIhAI5JF+lAq6i2dDD/d/H8jhIOoBNvWmY3gynyky5/lMGBAiAhKuO/2Ye1Nxkf+NFBk6v1Zmiwhz22PeGA7fj01sBFG3cLeHJwZ29hdC5jb21wEkClpzGcOHSXIYa71/MPPUK2T/1bkCF9VxnD/jjFpsyOHQj1tR8oSHixh9rG0fnKM547eOWby3m9cATz3uHB4vEL",
                        decodedManifest: {
                          Sequence: 2,
                          PublicKey: "ED6A54975A94EB9715E4F4E3FCD1661FCD40C065E6C22E461FEE87267DD73A2D6A",
                          publicKey: "nHUwGQrfZfieeLFeGRdGnAmGpHBCZq9wvm5c59wTc2JhJMjoXmd8",
                          address: "rD7dCrPeFuLTx5YmM4RHEUSLWxFSDbTowu",
                          SigningPubKey: "02CC93C43610606DAB9CE5BBD1E85A22C6CD8277176196710D02C4E7F114F0AC12",
                          signingPubKey: "n9LabXG8Vo7SfrUcZudeDCuFvWXW5TXbhUSYwgqmgYMFpUYuMN87",
                          Signature:
                            "30450221008E4917E940ABA8B67430FF77F1FC8E120EA0136F5A66378329F2932E7F94C1810220212AE3BFD987B537191FF8D14193ABF56668B0873DB63DE180EDF8F4D6C0451B",
                          Domain: "787270676F61742E636F6D",
                          domain: "xrpgoat.com",
                          MasterSignature:
                            "A5A7319C3874972186BBD7F30F3D42B64FFD5B90217D5719C3FE38C5A6CC8E1D08F5B51F284878B187DAC6D1F9CA339E3B78E59BCB79BD7004F3DEE1C1E2F10B",
                        },
                      },
                      {
                        PublicKey: "ED9DA743B769045A91AC41CA5C56FBD090168CB771E9558DD9D1C4FE8B3F4C842E",
                        manifest:
                          "JAAAAAJxIe2dp0O3aQRakaxBylxW+9CQFoy3celVjdnRxP6LP0yELnMhA472bx5I48pc1/TKxhC3F9hAQ9A+r5l5Vq50SfpeNWoYdkYwRAIgZbp8CXjwDPQUN4QJRFPNfhNqT0sgkQGjr3DLbwLwVfsCIHuUlKocYtMnDnnmxUHc19ScuyG5OZLZdpK/wFQ2Z7UjdxV2YWxpZGF0b3IuZ2F0ZWh1Yi5uZXRwEkDa8gneKVi0x8xjl6XtZ5gR5JC7ZnmMDttadNsGgE/0G509N8RrG7xXawDPiusf8yAkS6T3RFNZfXJ5zesV+KAF",
                        decodedManifest: {
                          Sequence: 2,
                          PublicKey: "ED9DA743B769045A91AC41CA5C56FBD090168CB771E9558DD9D1C4FE8B3F4C842E",
                          publicKey: "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5",
                          address: "rHEy2dQo4XKRiZaQSAntuHemLesVT3KzYM",
                          SigningPubKey: "038EF66F1E48E3CA5CD7F4CAC610B717D84043D03EAF997956AE7449FA5E356A18",
                          signingPubKey: "n9M2UqXLK25h9YEQTskmCXbWPGhQmB1pFVqeXia38UwLaL838VbG",
                          Signature:
                            "3044022065BA7C0978F00CF4143784094453CD7E136A4F4B209101A3AF70CB6F02F055FB02207B9494AA1C62D3270E79E6C541DCD7D49CBB21B93992D97692BFC0543667B523",
                          Domain: "76616C696461746F722E676174656875622E6E6574",
                          domain: "validator.gatehub.net",
                          MasterSignature:
                            "DAF209DE2958B4C7CC6397A5ED679811E490BB66798C0EDB5A74DB06804FF41B9D3D37C46B1BBC576B00CF8AEB1FF320244BA4F74453597D7279CDEB15F8A005",
                        },
                      },
                      {
                        PublicKey: "EDA1EFC81058EECB48DEB4FEB7FAFACEAEA42C3E00C0BFB31F85EC116F31A13DAD",
                        manifest:
                          "JAAAAAJxIe2h78gQWO7LSN60/rf6+s6upCw+AMC/sx+F7BFvMaE9rXMhA0slYgEaWgZghFRYNiEzHRI0/FlxdzIeJ2JCEkzR3xEadkcwRQIhAM4PcDpU2DqkiDFlU08LXnkr5XbJhja1D6NBECjwuaWrAiAXryUwYKZfrAk2EdDZ3VO8VeTEjVqOrPOKOFQ9bdNnk3cRdmVydW0uZW1pbmVuY2UuaW1wEkCBQFGyYEUTDa9uqPr9V7A+t+gc9zXTyvv/UtMVzUkpuVI1sNw6llH6wLInlEns8iTZwx6jl+UjExi1cUU8c8UJ",
                        decodedManifest: {
                          Sequence: 2,
                          PublicKey: "EDA1EFC81058EECB48DEB4FEB7FAFACEAEA42C3E00C0BFB31F85EC116F31A13DAD",
                          publicKey: "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji",
                          address: "rLAczZkdYhyhGifFBxmwSGoTFGSexaEqak",
                          SigningPubKey: "034B2562011A5A06608454583621331D1234FC597177321E276242124CD1DF111A",
                          signingPubKey: "n9MhLZsK7Av6ny2gV5SAGLDsnFXE9p85aYR8diD8xvuvuucqad85",
                          Signature:
                            "3045022100CE0F703A54D83AA4883165534F0B5E792BE576C98636B50FA3411028F0B9A5AB022017AF253060A65FAC093611D0D9DD53BC55E4C48D5A8EACF38A38543D6DD36793",
                          Domain: "766572756D2E656D696E656E63652E696D",
                          domain: "verum.eminence.im",
                          MasterSignature:
                            "814051B26045130DAF6EA8FAFD57B03EB7E81CF735D3CAFBFF52D315CD4929B95235B0DC3A9651FAC0B2279449ECF224D9C31EA397E5231318B571453C73C509",
                        },
                      },
                      {
                        PublicKey: "EDAF4CBCF4A9BEE306646549301E22770D5E62D8C03DD9FF42B65A83B2BE1C70F3",
                        manifest:
                          "JAAAAAJxIe2vTLz0qb7jBmRlSTAeIncNXmLYwD3Z/0K2WoOyvhxw83MhAuwVbGMSPYBMWqA7+OpeJb+/5l7OBXAcaH5R3GRDPQ60dkcwRQIhANYHtD6CO3widXmeiROncmBpoIrYVNCi0Gc9exL8Pv6AAiAwXn0fQDVmAI36i5mWpkY0BVHsj92AJ688BZEBxte2ZncOa2F0Y3p5bnNraS5uZXRwEkBmaM4C4MkB8goJNA6UodCHfht6qgqDv2sFLwcUSO/WSJv1FNVw+62K0dJJ8rrZJhwKjR8NyO+iPUl6V7U1aggA",
                        decodedManifest: {
                          Sequence: 2,
                          PublicKey: "EDAF4CBCF4A9BEE306646549301E22770D5E62D8C03DD9FF42B65A83B2BE1C70F3",
                          publicKey: "nHUge3GFusbqmfYAJjxfKgm2j4JXGxrRsfYMcEViHrFSzQDdk5Hq",
                          address: "rJ4RhRgsShNGTDBh6zGwyQn7Bp7UhbH75M",
                          SigningPubKey: "02EC156C63123D804C5AA03BF8EA5E25BFBFE65ECE05701C687E51DC64433D0EB4",
                          signingPubKey: "n9LL7K3Ubnob3ExqmgpigL3AgzKKhTaVvnZiXqsvz85VjbY3KqFp",
                          Signature:
                            "3045022100D607B43E823B7C2275799E8913A7726069A08AD854D0A2D0673D7B12FC3EFE800220305E7D1F403566008DFA8B9996A646340551EC8FDD8027AF3C059101C6D7B666",
                          Domain: "6B6174637A796E736B692E6E6574",
                          domain: "katczynski.net",
                          MasterSignature:
                            "6668CE02E0C901F20A09340E94A1D0877E1B7AAA0A83BF6B052F071448EFD6489BF514D570FBAD8AD1D249F2BAD9261C0A8D1F0DC8EFA23D497A57B5356A0800",
                        },
                      },
                      {
                        PublicKey: "EDCAD6E02AAFF5467465CBB9E62E021BF4B8E23F7484A6F0F67387549733865CCA",
                        manifest:
                          "JAAAAAJxIe3K1uAqr/VGdGXLueYuAhv0uOI/dISm8PZzh1SXM4ZcynMhAhsZSGGrpahoyUG1cNLr6Se3lk9xFX2o7rynkQW0NMwSdkYwRAIgQ57Dw5eW6i1q5vUgDdtJ9tUE4tk4Ar+nHSjgQqlq8OwCIAWQnAT5odL5ERpvIeqR09sacKSgs4ZmS+gr3oxfsr37dwx0b3dvbGFicy5jb21wEkDQQPBp4c9Ff/8hJ25Y5ODJabv9V4KWpNdJv1okXECbZbczgU72ElphkGsprCIhd3A1JsohCvllOb/sS0U5Q0ME",
                        decodedManifest: {
                          Sequence: 2,
                          PublicKey: "EDCAD6E02AAFF5467465CBB9E62E021BF4B8E23F7484A6F0F67387549733865CCA",
                          publicKey: "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y",
                          address: "rUauwfmKyZWFSEMdVfAq5LZcRDSL1FzxSR",
                          SigningPubKey: "021B194861ABA5A868C941B570D2EBE927B7964F71157DA8EEBCA79105B434CC12",
                          signingPubKey: "n9JkSnNqXxEct1t78dwVZDjq7PsznXtukxjyGvGJr4TdwVSbd7DJ",
                          Signature:
                            "30440220439EC3C39796EA2D6AE6F5200DDB49F6D504E2D93802BFA71D28E042A96AF0EC022005909C04F9A1D2F9111A6F21EA91D3DB1A70A4A0B386664BE82BDE8C5FB2BDFB",
                          Domain: "746F776F6C6162732E636F6D",
                          domain: "towolabs.com",
                          MasterSignature:
                            "D040F069E1CF457FFF21276E58E4E0C969BBFD578296A4D749BF5A245C409B65B733814EF6125A61906B29AC222177703526CA210AF96539BFEC4B4539434304",
                        },
                      },
                      {
                        PublicKey: "EDCFE65121E39A2955F04D6D784E3B021791E88D1393DA4AFAB89F99A929A72924",
                        manifest:
                          "JAAAAAJxIe3P5lEh45opVfBNbXhOOwIXkeiNE5PaSvq4n5mpKacpJHMhAoNmWF2VVqLtMpHVA6fboRs3Ja1mDMjMQcLnAd2D8gCIdkcwRQIhAL90fW6KKKcQEgnVzc+HVXJGpCVg2LekGP8DVzGcyCQbAiBW7d+tYlhC4cBVb+ZQSaTIJ1D5IcnhtvwU67+t+SMsGXcKZGlnaWZpbi51a3ASQJztPEZG+oES2TsJmHu6EZhxMA0B5jL8aXdo2r2RbSYxn4jL+rUqVAT6B57RoupVZ/NUEVWMUH2FM7KjEbd/+Qc=",
                        decodedManifest: {
                          Sequence: 2,
                          PublicKey: "EDCFE65121E39A2955F04D6D784E3B021791E88D1393DA4AFAB89F99A929A72924",
                          publicKey: "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C",
                          address: "rH9TU4uusJ97VNH5Kb5L5HaeyhiJoWiWXH",
                          SigningPubKey: "028366585D9556A2ED3291D503A7DBA11B3725AD660CC8CC41C2E701DD83F20088",
                          signingPubKey: "n9KY4JZY11ndNbg55dThnoQdU9dii5q3egzoESVXw4Z7hu3maCba",
                          Signature:
                            "3045022100BF747D6E8A28A7101209D5CDCF87557246A42560D8B7A418FF0357319CC8241B022056EDDFAD625842E1C0556FE65049A4C82750F921C9E1B6FC14EBBFADF9232C19",
                          Domain: "6469676966696E2E756B",
                          domain: "digifin.uk",
                          MasterSignature:
                            "9CED3C4646FA8112D93B09987BBA119871300D01E632FC697768DABD916D26319F88CBFAB52A5404FA079ED1A2EA5567F35411558C507D8533B2A311B77FF907",
                        },
                      },
                      {
                        PublicKey: "EDF10074F5FBBB975A8EA8E9C42306854E6A49C71B7D33B0293AB1830FECF2C400",
                        manifest:
                          "JAAAAAJxIe3xAHT1+7uXWo6o6cQjBoVOaknHG30zsCk6sYMP7PLEAHMhAhpsGKhmuTZgcX1VfLwiJwO6u3A5sI5ldpXpwvaxU3DNdkcwRQIhANdi/HzNNzwOp6mcck3W/Fuye2cIvkTEsbp2MgsTOQoVAiAnDA0VnOKEfn3iTb9AyKLwdLREl7q0/V0/89b8IFsvFncLeHJwc2Nhbi5jb21wEkAdkeCyzUQuj1VGVEnacQqf1cISxmaOvojXJgi4QEVbgv6+qbWDFzndDK7Mefa6ioJMLRTfkuwlKDdtwJvocVwH",
                        decodedManifest: {
                          Sequence: 2,
                          PublicKey: "EDF10074F5FBBB975A8EA8E9C42306854E6A49C71B7D33B0293AB1830FECF2C400",
                          publicKey: "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz",
                          address: "raBce5yMLYDhM6odPgTWfQYLZjWNh35fP1",
                          SigningPubKey: "021A6C18A866B93660717D557CBC222703BABB7039B08E657695E9C2F6B15370CD",
                          signingPubKey: "n9Jk38y9XCznqiLq53UjREJQbZWnz4Pvmph55GP5ofUPg3RG8eVr",
                          Signature:
                            "3045022100D762FC7CCD373C0EA7A99C724DD6FC5BB27B6708BE44C4B1BA76320B13390A150220270C0D159CE2847E7DE24DBF40C8A2F074B44497BAB4FD5D3FF3D6FC205B2F16",
                          Domain: "7872707363616E2E636F6D",
                          domain: "xrpscan.com",
                          MasterSignature:
                            "1D91E0B2CD442E8F55465449DA710A9FD5C212C6668EBE88D72608B840455B82FEBEA9B5831739DD0CAECC79F6BA8A824C2D14DF92EC2528376DC09BE8715C07",
                        },
                      },
                      {
                        PublicKey: "ED580C4282950CB3F7E0185F37F2CFB216882C5EDDD3BB1EE49C304A1AA3C5DB92",
                        manifest:
                          "JAAAAANxIe1YDEKClQyz9+AYXzfyz7IWiCxe3dO7HuScMEoao8XbknMhAjDsN2/HqnByax9j9A+HWpRhAYx9wU1cN+4XYQBcetTXdkcwRQIhAIBTxRvFI/ob2t8jU9ULeo1nYe0lG4d7rKtXIfsfZiYvAiANzabfUDlaTWy9PsOS5T8FzLyKDSKUaKZsPCJWjfgTuncVdmFsaWRhdG9yLnBvbGkudXNwLmJycBJAAi24mJu5cPPwKYzlPL7+PrNnqR/i6iRnOl+btTJaEN22fBlo3SwBwPpcp0slixZ2/64Eydl8inMubtn22tpuCA==",
                        decodedManifest: {
                          Sequence: 3,
                          PublicKey: "ED580C4282950CB3F7E0185F37F2CFB216882C5EDDD3BB1EE49C304A1AA3C5DB92",
                          publicKey: "nHUpDPFoCNysckDSHiUBEdDXRu2iYLUgYjTzrj3bde5iDRkNtY8f",
                          address: "rBax5qFHNFDcATSoL3GkhU62ftEfyppeLz",
                          SigningPubKey: "0230EC376FC7AA70726B1F63F40F875A9461018C7DC14D5C37EE1761005C7AD4D7",
                          signingPubKey: "n9JvsY3yhCdsHe3JsVTwvCtvKnchg2eridHLWdBdWf8VkpZSqqS9",
                          Signature:
                            "30450221008053C51BC523FA1BDADF2353D50B7A8D6761ED251B877BACAB5721FB1F66262F02200DCDA6DF50395A4D6CBD3EC392E53F05CCBC8A0D229468A66C3C22568DF813BA",
                          Domain: "76616C696461746F722E706F6C692E7573702E6272",
                          domain: "validator.poli.usp.br",
                          MasterSignature:
                            "022DB8989BB970F3F0298CE53CBEFE3EB367A91FE2EA24673A5F9BB5325A10DDB67C1968DD2C01C0FA5CA74B258B1676FFAE04C9D97C8A732E6ED9F6DADA6E08",
                        },
                      },
                      {
                        PublicKey: "EDA8B1D8A071E85A6E36DCAC7999AB814E4CDC664668385173767C5B89554243C0",
                        manifest:
                          "JAAAAANxIe2osdigcehabjbcrHmZq4FOTNxmRmg4UXN2fFuJVUJDwHMhA/9xt4kNBNpoNa6KyS7w3vG3EbtWV+lh4ZO0JG0D4ne7dkYwRAIgdURK+orOrNDPurUH3IMqizunD3tUHl7+7bsjBOzfeXMCIH8IuOEGe32mHPVHz01s5vZRkTelnf1ZkLc/L08CwB81dyJ2YWxpZGF0b3IueHJwbC5yb2JlcnRzd2FydGhvdXQuY29tcBJAmzRP6XgBZcZZ0+1uwJVgbBIZCQe1IW8v1joK+bkVcDRxVjbxz1yqJ3gpP+di8CuKN4d6U8/hCzaqn6PEVc5+DA==",
                        decodedManifest: {
                          Sequence: 3,
                          PublicKey: "EDA8B1D8A071E85A6E36DCAC7999AB814E4CDC664668385173767C5B89554243C0",
                          publicKey: "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ",
                          address: "rLi9F2bjKHmjRqMFBaDE7vQBU7Q6owW5sB",
                          SigningPubKey: "03FF71B7890D04DA6835AE8AC92EF0DEF1B711BB5657E961E193B4246D03E277BB",
                          signingPubKey: "n94RkpbJYRYQrWUmL8PAVQ1XTVKtfyKkLm8C6SWzWPcKEbuNb6EV",
                          Signature:
                            "3044022075444AFA8ACEACD0CFBAB507DC832A8B3BA70F7B541E5EFEEDBB2304ECDF797302207F08B8E1067B7DA61CF547CF4D6CE6F6519137A59DFD5990B73F2F4F02C01F35",
                          Domain: "76616C696461746F722E7872706C2E726F626572747377617274686F75742E636F6D",
                          domain: "validator.xrpl.robertswarthout.com",
                          MasterSignature:
                            "9B344FE9780165C659D3ED6EC095606C12190907B5216F2FD63A0AF9B9157034715636F1CF5CAA2778293FE762F02B8A37877A53CFE10B36AA9FA3C455CE7E0C",
                        },
                      },
                      {
                        PublicKey: "ED63CF929BE85B266A66584B3FE2EB97FC248203F0271DC9C833563E60418E7818",
                        manifest:
                          "JAAAAARxIe1jz5Kb6FsmamZYSz/i65f8JIID8CcdycgzVj5gQY54GHMhA04wXe7vOKcfgA60jYD4/aUNOUjou9YMfYAqfN1wf8KGdkcwRQIhAIE8gNj/LkzMjcXMzKeSOfLDFiDjQkH+cxWYhc8ObB2IAiAHRP2tAQwfbQSmy7Vz710HTbeUE5NYwqaGMAUPToBHb3cOeHJwLnVuaWMuYWMuY3lwEkATunZzP6mwCevzwgXXxXHogl40vlGTbBfvsCGMurMBjdNJq3sFgszXoJECoqA4nANGj31DwmavfpqjIZvRLxwA",
                        decodedManifest: {
                          Sequence: 4,
                          PublicKey: "ED63CF929BE85B266A66584B3FE2EB97FC248203F0271DC9C833563E60418E7818",
                          publicKey: "nHUfPizyJyhAJZzeq3duRVrZmsTZfcLn7yLF5s2adzHdcHMb9HmQ",
                          address: "rDyFzMUmtRaR9urkv2d4CkjfJqqkrx9Jf5",
                          SigningPubKey: "034E305DEEEF38A71F800EB48D80F8FDA50D3948E8BBD60C7D802A7CDD707FC286",
                          signingPubKey: "n9MngHUqEeJXd8cgeEGsjvm9FqQRm4DwhCrTYCtrfnm5FWGFaR6m",
                          Signature:
                            "3045022100813C80D8FF2E4CCC8DC5CCCCA79239F2C31620E34241FE73159885CF0E6C1D8802200744FDAD010C1F6D04A6CBB573EF5D074DB794139358C2A68630050F4E80476F",
                          Domain: "7872702E756E69632E61632E6379",
                          domain: "xrp.unic.ac.cy",
                          MasterSignature:
                            "13BA76733FA9B009EBF3C205D7C571E8825E34BE51936C17EFB0218CBAB3018DD349AB7B0582CCD7A09102A2A0389C03468F7D43C266AF7E9AA3219BD12F1C00",
                        },
                      },
                      {
                        PublicKey: "EDC090980ECAAB37CBE52E880236EC57F732B7DBB7C7BB9A3768D3A6E7184A795E",
                        manifest:
                          "JAAAAARxIe3AkJgOyqs3y+UuiAI27Ff3Mrfbt8e7mjdo06bnGEp5XnMhAu2LSAwZEQnm/mq9K6sSZJk5JkbcKCv6C7vQW2C8RnZVdkcwRQIhAI9uwQ1p58oyob1E+DaFLwjTdiRbVIKSMPqaaUwnJdN2AiB79DlPXHwztNULraVTkehbDsCAyDdf3VZB3FvkCZNOFHcIYWxsb3kuZWVwEkBf6A9ktcj2H4a61Av8ujQFL2KNcmr/FuEKbwlZEniJvhf0UqNiYc2bAsTJE5wMn00E0JBbw2m9OFwto50DcdkC",
                        decodedManifest: {
                          Sequence: 4,
                          PublicKey: "EDC090980ECAAB37CBE52E880236EC57F732B7DBB7C7BB9A3768D3A6E7184A795E",
                          publicKey: "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
                          address: "rsjzL7orAw7ej5GXboP3YE9YwAixAsFnWW",
                          SigningPubKey: "02ED8B480C191109E6FE6ABD2BAB126499392646DC282BFA0BBBD05B60BC467655",
                          signingPubKey: "n9LMfcjE6dMyshCqiftLFXpB9K3Mnd2r5bG7K8osmrkFpHUoR3c1",
                          Signature:
                            "30450221008F6EC10D69E7CA32A1BD44F836852F08D376245B54829230FA9A694C2725D37602207BF4394F5C7C33B4D50BADA55391E85B0EC080C8375FDD5641DC5BE409934E14",
                          Domain: "616C6C6F792E6565",
                          domain: "alloy.ee",
                          MasterSignature:
                            "5FE80F64B5C8F61F86BAD40BFCBA34052F628D726AFF16E10A6F0959127889BE17F452A36261CD9B02C4C9139C0C9F4D04D0905BC369BD385C2DA39D0371D902",
                        },
                      },
                      {
                        PublicKey: "EDCF08053DFF0F00AC6E78B61F7B7FD187AF74052DEB5074207506D3A2CDCD9E5C",
                        manifest:
                          "JAAAAARxIe3PCAU9/w8ArG54th97f9GHr3QFLetQdCB1BtOizc2eXHMhAnGzf7F5Pqv0I1Ziii4eOl91g4gM8oF4R6kaNbJodqZ4dkYwRAIgFWYktewUoPs1qfUDxhXgmy+aPWpGXGCis76gAyn5BNsCIHfyGz+yKruEoERWqoQAifOreLr9LOF4RWnd+cjlQYjOdw1qb24tbmlsc2VuLm5vcBJA3XDb99B9FOpql7A8NLpej2qvV1u/y8MjVBanAhkeRzYuQz4vzt7gM5fs1/qY8Y1OJk3swz+kx4wgGm1ckkKqAQ==",
                        decodedManifest: {
                          Sequence: 4,
                          PublicKey: "EDCF08053DFF0F00AC6E78B61F7B7FD187AF74052DEB5074207506D3A2CDCD9E5C",
                          publicKey: "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H",
                          address: "rKmBmEE7QsH9mRL3SKhYJYEgmGGFRvN8c5",
                          SigningPubKey: "0271B37FB1793EABF42356628A2E1E3A5F7583880CF2817847A91A35B26876A678",
                          signingPubKey: "n9KQ2DVL7QhgovChk81W8idxm7wDsYzXutDMQzwUBKuxb9WTWBVG",
                          Signature:
                            "30440220156624B5EC14A0FB35A9F503C615E09B2F9A3D6A465C60A2B3BEA00329F904DB022077F21B3FB22ABB84A04456AA840089F3AB78BAFD2CE1784569DDF9C8E54188CE",
                          Domain: "6A6F6E2D6E696C73656E2E6E6F",
                          domain: "jon-nilsen.no",
                          MasterSignature:
                            "DD70DBF7D07D14EA6A97B03C34BA5E8F6AAF575BBFCBC3235416A702191E47362E433E2FCEDEE03397ECD7FA98F18D4E264DECC33FA4C78C201A6D5C9242AA01",
                        },
                      },
                      {
                        PublicKey: "ED580AD4FA5DA989FA999535ECC20197A5B53A1A49A971F6652ED8D5D466CA605D",
                        manifest:
                          "JAAAAAVxIe1YCtT6XamJ+pmVNezCAZeltToaSalx9mUu2NXUZspgXXMhAvLQl0WBMe0XSjFQPbqUXSiRBQwcypNu02I3WQMNj/9zdkYwRAIgSV2kfFs1r1TaHX/SUbx78vIq1nhyAiNS0GGu8nIaNi4CIGbCr/dXKdKjrdwoJYNDgf4tlMT094bhUUnpTzkNHWLPdwx4c3BlY3Rhci5jb21wEkApTowQiZRa8XXIDlEZ2RUqfF6JK1nNzMaAHz4zLBwa+ed17+kqmyOM+haosWBJO6oqwiKl46p7RW753XkrZ8gF",
                        decodedManifest: {
                          Sequence: 5,
                          PublicKey: "ED580AD4FA5DA989FA999535ECC20197A5B53A1A49A971F6652ED8D5D466CA605D",
                          publicKey: "nHUpDEZX5Zy9auiu4yhDmhirNu6PyB1LvzQEL9Mxmqjr818w663q",
                          address: "rs42pzFaLvU8Nwvev8NouCiChGuazqLVfx",
                          SigningPubKey: "02F2D097458131ED174A31503DBA945D2891050C1CCA936ED3623759030D8FFF73",
                          signingPubKey: "n9LPSEVyNTApMuchFeTE1GD9qhsH9Umagnpu3NLC9zb358KNfiZV",
                          Signature:
                            "30440220495DA47C5B35AF54DA1D7FD251BC7BF2F22AD67872022352D061AEF2721A362E022066C2AFF75729D2A3ADDC2825834381FE2D94C4F4F786E15149E94F390D1D62CF",
                          Domain: "78737065637461722E636F6D",
                          domain: "xspectar.com",
                          MasterSignature:
                            "294E8C1089945AF175C80E5119D9152A7C5E892B59CDCCC6801F3E332C1C1AF9E775EFE92A9B238CFA16A8B160493BAA2AC222A5E3AA7B456EF9DD792B67C805",
                        },
                      },
                      {
                        PublicKey: "ED6753539020782A777B8F4BF6931A7DB13F9D259486E337C639B99E0C57CD5FF2",
                        manifest:
                          "JAAAAAZxIe1nU1OQIHgqd3uPS/aTGn2xP50llIbjN8Y5uZ4MV81f8nMhAhMx4ZdwVy1tx+2ZQLleJoPex6UgQzOfcq4IXu+J7RcgdkcwRQIhAPV4b/g3kdK32xMSaGjowLsSTGxz0v5gTBAqppP8EZfsAiAoWKteRCboPti4ghBL75DqFFLY5tfCB6KizRmKmfi6o3cSeHJwbC5hZXN0aGV0ZXMuYXJ0cBJA2iWP3IuB7dhZK4v5BZ4dgDL09ZzF+4BfBgbwP2rq0f33S7Tu+hmQZqWV5HETwxGUaErdwCfv7kj3Ae5SQ2SmDw==",
                        decodedManifest: {
                          Sequence: 6,
                          PublicKey: "ED6753539020782A777B8F4BF6931A7DB13F9D259486E337C639B99E0C57CD5FF2",
                          publicKey: "nHU3AenyRuJ4Yei4YHkh6frZg8y2RwXznkMAomUE1ptV5Spvqsih",
                          address: "rPwYPgHWJWRGmDaS4DUw1aDHNCLQ31jEaa",
                          SigningPubKey: "021331E19770572D6DC7ED9940B95E2683DEC7A52043339F72AE085EEF89ED1720",
                          signingPubKey: "n9JgxBLdCHii4xnRNMk7WJhD2qmfJGRvCxmmNNivBZXPRVpeZkH3",
                          Signature:
                            "3045022100F5786FF83791D2B7DB13126868E8C0BB124C6C73D2FE604C102AA693FC1197EC02202858AB5E4426E83ED8B882104BEF90EA1452D8E6D7C207A2A2CD198A99F8BAA3",
                          Domain: "7872706C2E6165737468657465732E617274",
                          domain: "xrpl.aesthetes.art",
                          MasterSignature:
                            "DA258FDC8B81EDD8592B8BF9059E1D8032F4F59CC5FB805F0606F03F6AEAD1FDF74BB4EEFA199066A595E47113C31194684ADDC027EFEE48F701EE524364A60F",
                        },
                      },
                      {
                        PublicKey: "ED58F6770DB5DD77E59D28CB650EC3816E2FC95021BB56E720C9A12DA79C58A3AB",
                        manifest:
                          "JAAAAAhxIe1Y9ncNtd135Z0oy2UOw4FuL8lQIbtW5yDJoS2nnFijq3MhAsU/G2z13j7v0bqWr861QB8DL5KBKgfHj0/DLIbIWIEadkYwRAIgCj9uzQIYwk2UzxKJL2v0G/0bflh5PQXbQaGidnKQjBECIGIhAU5/qY1b5DIDwA2ZRonwfCOzRVGKMpe9mscOoAyEcBJAQTp5imRSxnUamaA5esXZh8dMX8aaiA3SObS7C5ORWIoK3HUqIpqU8/wFqTd/iumFvVScYF31+H6pvnNKRHvDDg==",
                        decodedManifest: {
                          Sequence: 8,
                          PublicKey: "ED58F6770DB5DD77E59D28CB650EC3816E2FC95021BB56E720C9A12DA79C58A3AB",
                          publicKey: "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz",
                          address: "rnQ1MPzAtDR8j3tFbQhqersjKdzGB74huY",
                          SigningPubKey: "02C53F1B6CF5DE3EEFD1BA96AFCEB5401F032F92812A07C78F4FC32C86C858811A",
                          signingPubKey: "n9Ls4GcrofTvLvymKh1wCqxw1aLzXUumyBBD9fAtbkk9WtdQ4TUH",
                          Signature:
                            "304402200A3F6ECD0218C24D94CF12892F6BF41BFD1B7E58793D05DB41A1A27672908C1102206221014E7FA98D5BE43203C00D994689F07C23B345518A3297BD9AC70EA00C84",
                          MasterSignature:
                            "413A798A6452C6751A99A0397AC5D987C74C5FC69A880DD239B4BB0B9391588A0ADC752A229A94F3FC05A9377F8AE985BD549C605DF5F87EA9BE734A447BC30E",
                        },
                      },
                      {
                        PublicKey: "ED9AE4F5887BA029EB7C0884486D23CF281975F773F44BD213054219882C411CC7",
                        manifest:
                          "JAAAAAxxIe2a5PWIe6Ap63wIhEhtI88oGXX3c/RL0hMFQhmILEEcx3MhA5OCzO/KweWWA4V1GhGp574YrI2r514+Y56Z8zVRB4DodkYwRAIgAhQ4svu1d10j+t39mfIqeGcA1peJIaDWUo86unvxn70CIG+Vd2XjmGm0tdLiinnLwiEeG8sqUsXTgSXuzqSBASeOdxd2YWxpZGF0b3IueHJwbC1sYWJzLmNvbXASQEg0E1zphmKzWSq4nuv/ruEi6c0YF373Xefrxx5+N7v4aWlMSw3Eo+5+Tk++6SbW1dVR4y9Ij/BXYMLNDHEh9Q4=",
                        decodedManifest: {
                          Sequence: 12,
                          PublicKey: "ED9AE4F5887BA029EB7C0884486D23CF281975F773F44BD213054219882C411CC7",
                          publicKey: "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw",
                          address: "rMYL6sN2z5os4RWLuT6HHDhJYpBACujzNa",
                          SigningPubKey: "039382CCEFCAC1E5960385751A11A9E7BE18AC8DABE75E3E639E99F335510780E8",
                          signingPubKey: "n9McDrz9tPujrQK3vMXJXzuEJv1B8UG3opfZEsFA8t6QxdZh1H6m",
                          Signature:
                            "30440220021438B2FBB5775D23FADDFD99F22A786700D6978921A0D6528F3ABA7BF19FBD02206F957765E39869B4B5D2E28A79CBC2211E1BCB2A52C5D38125EECEA48101278E",
                          Domain: "76616C696461746F722E7872706C2D6C6162732E636F6D",
                          domain: "validator.xrpl-labs.com",
                          MasterSignature:
                            "4834135CE98662B3592AB89EEBFFAEE122E9CD18177EF75DE7EBC71E7E37BBF869694C4B0DC4A3EE7E4E4FBEE926D6D5D551E32F488FF05760C2CD0C7121F50E",
                        },
                      },
                      {
                        PublicKey: "ED8651B672BCE2727BD93A62431592447D6637E5D0E768595ECC19E5E4AEACAF3B",
                        manifest:
                          "JAFQdmFxIe2GUbZyvOJye9k6YkMVkkR9Zjfl0OdoWV7MGeXkrqyvO3MhAw3cyTXlLuADZuezVlDdRpf0zuzeU6YHNDzBE0F+xXm1dkYwRAIgbSyoyknrt4VtibmMfxR1oE3bpIsJDcs5nkqbugPFfhsCIAisLTQoiosHhrXjYUlB5cFltI+V6N9CExgmD1ZgCjfbdwpyaXBwbGUuY29tcBJAmACcjSXbBd438YcLrb7/klTuNxn2Hkp0umZuf4WFa1YIZRyZEpGBE1+AhulHVsQ/5/O9yDH6ThKzp12o5YZSDg==",
                        decodedManifest: {
                          Sequence: 22050401,
                          PublicKey: "ED8651B672BCE2727BD93A62431592447D6637E5D0E768595ECC19E5E4AEACAF3B",
                          publicKey: "nHU4bLE3EmSqNwfL4AP1UZeTNPrSPPP6FXLKXo2uqfHuvBQxDVKd",
                          address: "rU6XbyxWV74dwzn7u9AieT4ZNFg68ZAaju",
                          SigningPubKey: "030DDCC935E52EE00366E7B35650DD4697F4CEECDE53A607343CC113417EC579B5",
                          signingPubKey: "n9LbM9S5jeGopF5J1vBDoGxzV6rNS8K1T5DzhNynkFLqR9N2fywX",
                          Signature:
                            "304402206D2CA8CA49EBB7856D89B98C7F1475A04DDBA48B090DCB399E4A9BBA03C57E1B022008AC2D34288A8B0786B5E3614941E5C165B48F95E8DF421318260F56600A37DB",
                          Domain: "726970706C652E636F6D",
                          domain: "ripple.com",
                          MasterSignature:
                            "98009C8D25DB05DE37F1870BADBEFF9254EE3719F61E4A74BA666E7F85856B5608651C99129181135F8086E94756C43FE7F3BDC831FA4E12B3A75DA8E586520E",
                        },
                      },
                      {
                        PublicKey: "EDA54C85F91219FD259134B6B126AD64AE7204B81DD4052510657E1A5697246AD2",
                        manifest:
                          "JH1dE2txIe2lTIX5Ehn9JZE0trEmrWSucgS4HdQFJRBlfhpWlyRq0nMhAtBgxw4UNCA4l1LiUSqQYTrPqn4E0V0mJN7JGQiASL/BdkcwRQIhALDZckPGv4N43s21IdoMEItWYEDtEpOvG+8BIwtrE6bnAiBEzVOtvLcog9LMAX3JbbulsD9/sRFTyFJphl6JATjP0HcLY2FiYml0LnRlY2hwEkBYRWWra2dRPWtMpYV2s2ymzatdVMlO+KZNFAxCYlZM/Yxt6bo6G1MB/nAYT6ntyg0FBEJDgVfMTxliAqzY008H",
                        decodedManifest: {
                          Sequence: 2103251819,
                          PublicKey: "EDA54C85F91219FD259134B6B126AD64AE7204B81DD4052510657E1A5697246AD2",
                          publicKey: "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw",
                          address: "r4PjS37oQ4kUv3gREcNWMdzoFT7Em7QVsU",
                          SigningPubKey: "02D060C70E143420389752E2512A90613ACFAA7E04D15D2624DEC919088048BFC1",
                          signingPubKey: "n9L3GcKLGWoz79RPfYq9GjEVyh57vpe1wM45i2tdczJ9u15ajAFB",
                          Signature:
                            "3045022100B0D97243C6BF8378DECDB521DA0C108B566040ED1293AF1BEF01230B6B13A6E7022044CD53ADBCB72883D2CC017DC96DBBA5B03F7FB11153C85269865E890138CFD0",
                          Domain: "6361626269742E74656368",
                          domain: "cabbit.tech",
                          MasterSignature:
                            "584565AB6B67513D6B4CA58576B36CA6CDAB5D54C94EF8A64D140C4262564CFD8C6DE9BA3A1B5301FE70184FA9EDCA0D050442438157CC4F196202ACD8D34F07",
                        },
                      },
                      {
                        PublicKey: "ED75940EC09130F9C553D8AF0FE354A112CC27251472AF1A90917597489192135F",
                        manifest:
                          "JHhn/jFxIe11lA7AkTD5xVPYrw/jVKESzCclFHKvGpCRdZdIkZITX3MhAqDtTC5BIBB676i3TT57r9yYqI/baIJ3Ua/t38JfCIpTdkYwRAIgYnB7HrEa9rcfMZJh2JmdllVKmYHBszYQHqC499wiuLUCIDCzrG1magSFR+kyJStF94/ylEnxCbBRah6xC4qjG8G5dyVhcnJpbmd0b24teHJwLWNhcGl0YWwuYmxvY2tkYWVtb24uY29tcBJAVBJ2vDSrg3t7zo4OJNsni+JLFtj0DolZXijBJajQnC/bvWJub015gOUaoXkLA/9J7rsjWWky6Bg2ZIF+FU+kBA==",
                        decodedManifest: {
                          Sequence: 2020081201,
                          PublicKey: "ED75940EC09130F9C553D8AF0FE354A112CC27251472AF1A90917597489192135F",
                          publicKey: "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn",
                          address: "rDDezym4qSAWZaQzkQiE25o8faAK1FGFF7",
                          SigningPubKey: "02A0ED4C2E4120107AEFA8B74D3E7BAFDC98A88FDB68827751AFEDDFC25F088A53",
                          signingPubKey: "n9Km4Xz53K9kcTaVn3mYAHsXqNuAo7A2HazSr34SFufvNwBxYGLn",
                          Signature:
                            "3044022062707B1EB11AF6B71F319261D8999D96554A9981C1B336101EA0B8F7DC22B8B5022030B3AC6D666A048547E932252B45F78FF29449F109B0516A1EB10B8AA31BC1B9",
                          Domain: "617272696E67746F6E2D7872702D6361706974616C2E626C6F636B6461656D6F6E2E636F6D",
                          domain: "arrington-xrp-capital.blockdaemon.com",
                          MasterSignature:
                            "541276BC34AB837B7BCE8E0E24DB278BE24B16D8F40E89595E28C125A8D09C2FDBBD626E6F4D7980E51AA1790B03FF49EEBB23596932E8183664817E154FA404",
                        },
                      },
                    ],
                  },
                },
              },
              transaction: {
                id: "6B729AFCEAEE215F5FD10872627A78978755BA8DDB0112C91D755297081037BF",
                tx: {
                  TransactionType: "AccountSet",
                  Sequence: 63841540,
                  LastLedgerSequence: 83576801,
                  OperationLimit: 21337,
                  Fee: "1337",
                  SigningPubKey: "0333C718C9CB716E0575454F4A343D46B284ED51151B9C7383524B82C10B262095",
                  TxnSignature:
                    "3045022100F48B6EE4950E2BA559F304E1E5D24679FC029EECA5BBD34D802ED5D6A7615DE9022045C45CEE22EEFF4E7F18DF647C5C13D4B79A5290AFAE174590578B0B47547A45",
                  Account: "rwiETSee2wMz3SBnAG8hkMsCgvGy9LWbZ1",
                },
                meta: {
                  TransactionIndex: 32,
                  AffectedNodes: [
                    {
                      ModifiedNode: {
                        LedgerEntryType: "AccountRoot",
                        PreviousTxnLgrSeq: 83540125,
                        PreviousTxnID: "F5C5889DB56D0A94909631E74A5F0A4D0B1E4D7089C0573902D6CED628EBCA68",
                        LedgerIndex: "F7BB536A19A61B2D0C8E508D159BEC1C44842C5246E21BB5E21140F8A5EB48CC",
                        PreviousFields: {
                          Sequence: 63841540,
                          Balance: "59997312",
                        },
                        FinalFields: {
                          Flags: 0,
                          Sequence: 63841541,
                          OwnerCount: 0,
                          Balance: "59995975",
                          MessageKey: "020000000000000000000000001F5C86DC8EE4E2CBA7DCD7CAB07C8AF7C6EA668B",
                          Account: "rwiETSee2wMz3SBnAG8hkMsCgvGy9LWbZ1",
                        },
                      },
                    },
                  ],
                  TransactionResult: "tesSUCCESS",
                },
                proof: [
                  "0FFB6195A9969EC7E11E122A307E986C459213C3C817A139812853EB636799F1",
                  "25F14F514D059627E6F6738615291C932245D32D4E944E15A1295932AD432480",
                  "6685B0F101B389D81CD1DF9E29D6ED7A9FEF4B8BF774B23ACD5CCBC9458A5085",
                  "B1DDA99451FAC409C13EDBC92E5B57DE9ACCE49FA3D3709A6CCBDA4EEEA08016",
                  "19F3A07C5D6DF384E1A5984AC03EEC3DB1F0CF61D384BEA08A8F4AF932940DCA",
                  "AE5420AF6B01FF3FDCCDCDD9BE95B0E51BB4DB0C840CFFF0A5C1F19394AEBCD5",
                  [
                    "44E2035C2B46B179860882A7C4EBC0F591DCED0537C075C1B0C94F39591BE239",
                    "A9212872EA48D6CD4DB21F5C828592744DCCA5AEEF84300B08879D2509676A77",
                    "0000000000000000000000000000000000000000000000000000000000000000",
                    "0000000000000000000000000000000000000000000000000000000000000000",
                    "0000000000000000000000000000000000000000000000000000000000000000",
                    "0000000000000000000000000000000000000000000000000000000000000000",
                    "0000000000000000000000000000000000000000000000000000000000000000",
                    "0000000000000000000000000000000000000000000000000000000000000000",
                    "0000000000000000000000000000000000000000000000000000000000000000",
                    "0000000000000000000000000000000000000000000000000000000000000000",
                    "0000000000000000000000000000000000000000000000000000000000000000",
                    [
                      "0000000000000000000000000000000000000000000000000000000000000000",
                      "0000000000000000000000000000000000000000000000000000000000000000",
                      "0000000000000000000000000000000000000000000000000000000000000000",
                      "0000000000000000000000000000000000000000000000000000000000000000",
                      "B33ECE4C138DC018CA6F2A4B3B4835888A122550B1755F8978D11FB8E685D3DF",
                      "0000000000000000000000000000000000000000000000000000000000000000",
                      "0000000000000000000000000000000000000000000000000000000000000000",
                      "A594120422AA3B37D47B8D36E15FAEA0C4782E8FE34C1A1D9B8DB2F05BB9EDC4",
                      "0000000000000000000000000000000000000000000000000000000000000000",
                      "0000000000000000000000000000000000000000000000000000000000000000",
                      "0000000000000000000000000000000000000000000000000000000000000000",
                      "0000000000000000000000000000000000000000000000000000000000000000",
                      "0000000000000000000000000000000000000000000000000000000000000000",
                      "0000000000000000000000000000000000000000000000000000000000000000",
                      "0000000000000000000000000000000000000000000000000000000000000000",
                      "0000000000000000000000000000000000000000000000000000000000000000",
                    ],
                    "183881404C9C4290D552EB8A4BCC5E20D040C288C8C787FB22F3A1906AEEB58F",
                    "0000000000000000000000000000000000000000000000000000000000000000",
                    "92F5794099877668329D47B4DCCAB633F6318ED65E90A12465BDFD2A981E71C0",
                    "0000000000000000000000000000000000000000000000000000000000000000",
                  ],
                  "075B487E5FC8F7BD613F4833FC2190525932B3F9C804262383BB8D0E19FF860B",
                  "4CCCBB916F34841B760276F04BFA009FAA3F7B4D734C680BDB92881A8A56E141",
                  "393FDBA6CB650DDC0FB2D71EA31B28012461288BE27CD096BD2EA38886345483",
                  "B55C7CF496D0C0F6FB7122D7C8DCE953E554DE8F587B0A662DBD16B5A62DFF3D",
                  "808BD699708787C086B4D427328ABB0024387F3CB3D38268C08B3C4FAE8BB2D0",
                  "61E7D1F600CBA0EE3A283ABB0D6232C279A1FCD38E14F97A6E271F6860208BA7",
                  "5C7302CCCADF63F19880AD7B17A381BD2D4F13142BBD9E37BBA73BD26C36410F",
                  "809956DD229FAD8682B7A04D05CC5EC2740575D5637E193E226CA1B30654D23B",
                  "0831D4BC39770DE5660C05CA6F75A478EB25A467F214C24FBC046F907E9F063A",
                ],
                specification: {},
                outcome: {
                  balanceChanges: {
                    rwiETSee2wMz3SBnAG8hkMsCgvGy9LWbZ1: [
                      {
                        currency: "XRP",
                        value: "-0.001337",
                      },
                    ],
                  },
                  fee: "0.001337",
                  indexInLedger: 32,
                  result: "tesSUCCESS",
                },
              },
            },
          },
          type: "import",
        });
      });

      it("Import with NFT", function () {
        const tx = require("../examples/responses/Import2.json");
        const xahauDefinitions = new Wallet.XrplDefinitions(xahauEnums);
        const result: any = Models.getTxDetails(tx, false, undefined, xahauDefinitions);

        expect(result).to.eql({
          type: "import",
          address: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
          sequence: 4722674,
          id: "BD3338E3799624DF13EA1CA46CD7305A643B99941F3563FAC35FB3D456153622",
          ctid: "C04810650000535A",
          specification: {
            blob: {
              ledger: {
                acroot: "233540489B36003BB1EF21CAFEB883F69466B74DCD3E5670C3C471FC609A1670",
                close: 742471371,
                coins: "98652171857393117",
                cres: 10,
                flags: 0,
                index: 39419653,
                pclose: 742471370,
                phash: "880A8C2F3E742C512B0DC5FC6C77538A873F1C978DFFF3AE557B55B01CC3ABCC",
                txroot: "B060B646BDB6329B9A93E7477BBCAAF717C409A35741317E330855F70A4BA971",
              },
              validation: {
                data: {
                  n944nVL4GHUBpZWUn2XaQXYT92b42BYHpwAisiCqvL159tEmWY46: {
                    Flags: 2147483649,
                    LedgerSequence: 39419653,
                    SigningTime: 742471371,
                    Cookie: "385F12D6319DDB9A",
                    LedgerHash: "8EBACD67392226AEEAEB82186CEC5E8D8C004A22AF4C14184339798AD489486B",
                    ConsensusHash: "60AA35BF7946A29B8C63C071BFA3A1E06A62E79425647EAFEDCB3BF4A8C4E564",
                    ValidatedHash: "880A8C2F3E742C512B0DC5FC6C77538A873F1C978DFFF3AE557B55B01CC3ABCC",
                    SigningPubKey: "03F71FA3C31F84FC0FC481E307C0DCF3F450EA5F5857EC8E5EBC21C6C08E3906A4",
                    Signature:
                      "3045022100FD4C743A5232F887F3FC8385D7427F40940F04DEF4233D39EC6B046DF20CB596022065DE371ACBBFFCAE0772584B5A66D07D902BB0BFCEB96D5F890921E19ED3F696",
                  },
                  n9K7fyu8uvmCoWvW4ZQVCWgW2zrz7sh33Ao7ceNkL7iQGDYtuwTU: {
                    Flags: 2147483649,
                    LedgerSequence: 39419653,
                    SigningTime: 742471371,
                    Cookie: "124E519EEDA8BF10",
                    LedgerHash: "8EBACD67392226AEEAEB82186CEC5E8D8C004A22AF4C14184339798AD489486B",
                    ConsensusHash: "60AA35BF7946A29B8C63C071BFA3A1E06A62E79425647EAFEDCB3BF4A8C4E564",
                    ValidatedHash: "880A8C2F3E742C512B0DC5FC6C77538A873F1C978DFFF3AE557B55B01CC3ABCC",
                    SigningPubKey: "0279C1B242658DD78514A5A60A206FA30C18A3EE370592A058A80FAA3E5C44F097",
                    Signature:
                      "3045022100D8ED1F285098713DCEE4BC513D326BF884597AA944AF39DF63B86223155A812402207393AB8CB52E9FFD67752BF38B978E197BC1BAE2C230D7B6F0AEE1A8CFFB928D",
                  },
                  n9KWVA64rMeqkAvcQ4DNCa2eDXTzprCtK1HLC8H5PEyUVwSSyL5X: {
                    Flags: 2147483649,
                    LedgerSequence: 39419653,
                    SigningTime: 742471371,
                    Cookie: "0AE7729763F67407",
                    LedgerHash: "8EBACD67392226AEEAEB82186CEC5E8D8C004A22AF4C14184339798AD489486B",
                    ConsensusHash: "60AA35BF7946A29B8C63C071BFA3A1E06A62E79425647EAFEDCB3BF4A8C4E564",
                    ValidatedHash: "880A8C2F3E742C512B0DC5FC6C77538A873F1C978DFFF3AE557B55B01CC3ABCC",
                    SigningPubKey: "027F285B8BB33F0E8B025BF955C29A7CFA8A0995831EE4AD93A9BD572A7C8EEDCD",
                    Signature:
                      "30450221009EA70C3D71AE1303A2E72C828E2FF0FA0B765B049310D606CD91AE83BD65FD650220150579BB4BFF058F14D59018E5E1B0744073AE384C29C2D1CEB2CE2D48A41404",
                  },
                  n9KcRZYHLU9rhGVwB9e4wEMYsxXvUfgFxtmX25pc1QPNgweqzQf5: {
                    Flags: 2147483649,
                    LedgerSequence: 39419653,
                    SigningTime: 742471370,
                    Cookie: "8BC16D1445BD05A1",
                    LedgerHash: "8EBACD67392226AEEAEB82186CEC5E8D8C004A22AF4C14184339798AD489486B",
                    ConsensusHash: "60AA35BF7946A29B8C63C071BFA3A1E06A62E79425647EAFEDCB3BF4A8C4E564",
                    ValidatedHash: "880A8C2F3E742C512B0DC5FC6C77538A873F1C978DFFF3AE557B55B01CC3ABCC",
                    SigningPubKey: "028C9C1DE3789DA22316D789E31099D10F0FE5977DAFD45459B1311FFB65F46FC9",
                    Signature:
                      "304402201610085B7A2F4C6CDDFBC80DB31612BE13C7F02F3C4DFB8A60486B8512D534F202207F1692D1BA47CAAC381895DC8CF876403C756B0FA63CC55BA15BFC9EAF93EA0D",
                  },
                  n9Kv3RbsBNbp1NkV3oP7UjHb3zEAz2KwtK3uQG7UxjQ8Mi3PaXiw: {
                    Flags: 2147483649,
                    LedgerSequence: 39419653,
                    SigningTime: 742471370,
                    Cookie: "33E3CBEBC7F73D20",
                    LedgerHash: "8EBACD67392226AEEAEB82186CEC5E8D8C004A22AF4C14184339798AD489486B",
                    ConsensusHash: "60AA35BF7946A29B8C63C071BFA3A1E06A62E79425647EAFEDCB3BF4A8C4E564",
                    ValidatedHash: "880A8C2F3E742C512B0DC5FC6C77538A873F1C978DFFF3AE557B55B01CC3ABCC",
                    SigningPubKey: "02B4CF65358D43B21C6D720FD5211E4F6AD3C2C27BF2DB5960242E49A5E06A36D0",
                    Signature:
                      "3045022100EB57DAEFE9D3F6D28152940E31320786FC4D0A1D6A250ED842C792995AEEE42B02203026382B36B9790FCAF115404A2C577817CEFC060079C4C45C86434C432D0746",
                  },
                  n9MGR6mE5oQGbNSf2ZbQUnAQmZeN8uim5pcVdfqgdtQscXJutZHW: {
                    Flags: 2147483649,
                    LedgerSequence: 39419653,
                    SigningTime: 742471370,
                    Cookie: "ACF393EBA1E5C8D9",
                    LedgerHash: "8EBACD67392226AEEAEB82186CEC5E8D8C004A22AF4C14184339798AD489486B",
                    ConsensusHash: "60AA35BF7946A29B8C63C071BFA3A1E06A62E79425647EAFEDCB3BF4A8C4E564",
                    ValidatedHash: "880A8C2F3E742C512B0DC5FC6C77538A873F1C978DFFF3AE557B55B01CC3ABCC",
                    SigningPubKey: "0366985A2A58FCDD64004A0A1B0FE5C7550891436775AD50562DA6DFACE13AE62F",
                    Signature:
                      "3044022050BA25FCFF3B9B5E120CDE581A8926778F2F1DCF050D2760A8F834E84120B50302202C95FFFD9AF1EA094AC24079E50700F74415174E956F44AA282440A423E1D654",
                  },
                },
                unl: {
                  version: 1,
                  PublicKey: "ED264807102805220DA0F312E71FC2C69E1552C9C5790F6C25E3729DEB573D5860",
                  manifest:
                    "JAAAAAFxIe0mSAcQKAUiDaDzEucfwsaeFVLJxXkPbCXjcp3rVz1YYHMh7Rt08vn4Maojg0vgNNcPuxVrJhyFy5tnQMSHfgCvuHjWdkCg/oL0GUq0QOgrdHw1Tw3BtA4lrLzDVQrSTFu+tMz+Dkdshs5gtbbfHQ2qFgYzGwaA9o3Z5Wwjv0iqXtxwH18PcBJAWCjvE1dMKgjMWu88GKgYDOaYJrOfOmN9CpxwnOObamY5gL2iENqTuo8bllpK4Hor3ewYwRCHWPTMpirBsDe4Aw==",
                  decodedManifest: {
                    Sequence: 1,
                    PublicKey: "ED264807102805220DA0F312E71FC2C69E1552C9C5790F6C25E3729DEB573D5860",
                    publicKey: "nHBeJBfBkbRDAfyon4idcDcUDspz8WnDWoKE7AE2Dta1y7qfSMu8",
                    address: "rBxZvQBY551DJ21g9AC1Qc9ASQowqcskbF",
                    SigningPubKey: "ED1B74F2F9F831AA23834BE034D70FBB156B261C85CB9B6740C4877E00AFB878D6",
                    signingPubKey: "nHBZXgNrAgmhvCUg9viYbVK3oAmW31Q46hEHikVMnnyBkwKcCLEt",
                    Signature:
                      "A0FE82F4194AB440E82B747C354F0DC1B40E25ACBCC3550AD24C5BBEB4CCFE0E476C86CE60B5B6DF1D0DAA1606331B0680F68DD9E56C23BF48AA5EDC701F5F0F",
                    MasterSignature:
                      "5828EF13574C2A08CC5AEF3C18A8180CE69826B39F3A637D0A9C709CE39B6A663980BDA210DA93BA8F1B965A4AE07A2BDDEC18C1108758F4CCA62AC1B037B803",
                  },
                  signature:
                    "75DE050E6AD07EA5D8CD031C387CF00987389D8DDC0A1E018ABFE368EE881C4A68CFD7856BDBF7B87B53EEECCCB40CC8144E64E2D55FC833764DECD5EFE41E02",
                  blob: {
                    sequence: 55,
                    expiration: 1699401600,
                    validators: [
                      {
                        PublicKey: "ED061ECB51B5BD62665F5D1A5DB1A62AF84464BED77E7728235A7A551D4535E717",
                        manifest:
                          "JAAAAAJxIe0GHstRtb1iZl9dGl2xpir4RGS+1353KCNaelUdRTXnF3MhAnnBskJljdeFFKWmCiBvowwYo+43BZKgWKgPqj5cRPCXdkcwRQIhAKRiLXevJ61ukhZtikvCuKgGRnV8H08eM/PEvJNEdl04AiBi/Bk68VVefR1GtgI4YezRQVsxnEiN/LmWSNmQYKQRIHASQAt8hKfxkqPMeBOTh2x2hjrkAa7leTenBtf9DxuhwlgsB9N/xxTfpzMQkjUYoYiyXkXZyh1NVsNLDKUmOdWZLAM=",
                        decodedManifest: {
                          Sequence: 2,
                          PublicKey: "ED061ECB51B5BD62665F5D1A5DB1A62AF84464BED77E7728235A7A551D4535E717",
                          publicKey: "nHBQ3CT3EWYZ4uzbnL3k6TRf9bBPhWRFVcK1F5NjtwCBksMEt5yy",
                          address: "rna87bupr933hSSKYvAnDvTNhKLyvGiNr5",
                          SigningPubKey: "0279C1B242658DD78514A5A60A206FA30C18A3EE370592A058A80FAA3E5C44F097",
                          signingPubKey: "n9K7fyu8uvmCoWvW4ZQVCWgW2zrz7sh33Ao7ceNkL7iQGDYtuwTU",
                          Signature:
                            "3045022100A4622D77AF27AD6E92166D8A4BC2B8A80646757C1F4F1E33F3C4BC9344765D38022062FC193AF1555E7D1D46B6023861ECD1415B319C488DFCB99648D99060A41120",
                          MasterSignature:
                            "0B7C84A7F192A3CC781393876C76863AE401AEE57937A706D7FD0F1BA1C2582C07D37FC714DFA73310923518A188B25E45D9CA1D4D56C34B0CA52639D5992C03",
                        },
                      },
                      {
                        PublicKey: "EDADB6E6F7229F92909E5A6DBAF81AD1EC723D31B676CD8F5F3E926AD043D187C0",
                        manifest:
                          "JAAAAAJxIe2ttub3Ip+SkJ5abbr4GtHscj0xtnbNj18+kmrQQ9GHwHMhAn8oW4uzPw6LAlv5VcKafPqKCZWDHuStk6m9Vyp8ju3NdkcwRQIhANQlFbiDNfa/LJIr+eaZ2KKc04GldZMrAG4bDWFMLyURAiAlwAfNIuveI0HmhM0I+Fw4ygAsHFWuwVrcWKabZLHtgHASQBBETTRDxCsQo4wIK+z5Cd9Omku0yDxBOMTA70RSqEopV9DHBgVV9g82j1mn0oJXDz0pNXrrCn3DqMbwA0vC+QA=",
                        decodedManifest: {
                          Sequence: 2,
                          PublicKey: "EDADB6E6F7229F92909E5A6DBAF81AD1EC723D31B676CD8F5F3E926AD043D187C0",
                          publicKey: "nHUCAdca6VoWWYVdBH1bwCUQggEX2e5acQSqxM3DwyuhsFknxmh3",
                          address: "rKN1tePqnrWuH6Smequ5inkM76DTCez89P",
                          SigningPubKey: "027F285B8BB33F0E8B025BF955C29A7CFA8A0995831EE4AD93A9BD572A7C8EEDCD",
                          signingPubKey: "n9KWVA64rMeqkAvcQ4DNCa2eDXTzprCtK1HLC8H5PEyUVwSSyL5X",
                          Signature:
                            "3045022100D42515B88335F6BF2C922BF9E699D8A29CD381A575932B006E1B0D614C2F2511022025C007CD22EBDE2341E684CD08F85C38CA002C1C55AEC15ADC58A69B64B1ED80",
                          MasterSignature:
                            "10444D3443C42B10A38C082BECF909DF4E9A4BB4C83C4138C4C0EF4452A84A2957D0C7060555F60F368F59A7D282570F3D29357AEB0A7DC3A8C6F0034BC2F900",
                        },
                      },
                      {
                        PublicKey: "EDF5B661ECC615C5C77D55F1B572FAC6FE6C7B116EB0A0E3F1DCEB9F48932548D0",
                        manifest:
                          "JAAAAAFxIe31tmHsxhXFx31V8bVy+sb+bHsRbrCg4/Hc659IkyVI0HMhA/cfo8MfhPwPxIHjB8Dc8/RQ6l9YV+yOXrwhxsCOOQakdkcwRQIhALUdnluhhq8yfL7ddgz71tUPWA4e2edJ2a69cQkwyNCBAiA6d9FNeKAjLhOjjKR52L4cIfv/AQtgUAlb9H0n2uyo6XASQD7M8LSGLKondz1EOmrAwzD407GvMxFhaEa2bpIPzNlVHE+PmOvJwZnxhLoG+NYVUfmaUreS+7kxv+gyoHtumwY=",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "EDF5B661ECC615C5C77D55F1B572FAC6FE6C7B116EB0A0E3F1DCEB9F48932548D0",
                          publicKey: "nHDDe5uAdiv6RA59MA1oM4JLDtVSYKNShgjEqq1KsdJXZiR47CQT",
                          address: "rw7sRdixSWp3PoPkiq3YmAicHcABRGdacL",
                          SigningPubKey: "03F71FA3C31F84FC0FC481E307C0DCF3F450EA5F5857EC8E5EBC21C6C08E3906A4",
                          signingPubKey: "n944nVL4GHUBpZWUn2XaQXYT92b42BYHpwAisiCqvL159tEmWY46",
                          Signature:
                            "3045022100B51D9E5BA186AF327CBEDD760CFBD6D50F580E1ED9E749D9AEBD710930C8D08102203A77D14D78A0232E13A38CA479D8BE1C21FBFF010B6050095BF47D27DAECA8E9",
                          MasterSignature:
                            "3ECCF0B4862CAA27773D443A6AC0C330F8D3B1AF3311616846B66E920FCCD9551C4F8F98EBC9C199F184BA06F8D61551F99A52B792FBB931BFE832A07B6E9B06",
                        },
                      },
                      {
                        PublicKey: "EDF62907763AAD8ED21F7EAF3F36B5264856A375FBB47CE64383EED74847C8DA6A",
                        manifest:
                          "JAAAAAFxIe32KQd2Oq2O0h9+rz82tSZIVqN1+7R85kOD7tdIR8jaanMhA2aYWipY/N1kAEoKGw/lx1UIkUNnda1QVi2m36zhOuYvdkcwRQIhAMvVQqDV3P+pJpM/4CX7xKWddfXje1dkB7qyPYoTkaxxAiBHCDcDUryX4FrMwlKQnPvrczt1pPUs4s/MAWET5OY8unASQPl+9vwiMxONOdGOUgCZo0IEi9qrfTP6CTQ8LyVTKkI5TOUeDMIYO6iFOrmXjdcsmf0ph55T/TpKUuP7uiA2sw0=",
                        decodedManifest: {
                          Sequence: 1,
                          PublicKey: "EDF62907763AAD8ED21F7EAF3F36B5264856A375FBB47CE64383EED74847C8DA6A",
                          publicKey: "nHDDiwQBqXhEL1CFoRHdMXD33x9K7rpYJfniXxL7kFavpPd21EGe",
                          address: "rwGBNFzk8JGQt8LW6Cj4f92H4VpxrtMo2m",
                          SigningPubKey: "0366985A2A58FCDD64004A0A1B0FE5C7550891436775AD50562DA6DFACE13AE62F",
                          signingPubKey: "n9MGR6mE5oQGbNSf2ZbQUnAQmZeN8uim5pcVdfqgdtQscXJutZHW",
                          Signature:
                            "3045022100CBD542A0D5DCFFA926933FE025FBC4A59D75F5E37B576407BAB23D8A1391AC7102204708370352BC97E05ACCC252909CFBEB733B75A4F52CE2CFCC016113E4E63CBA",
                          MasterSignature:
                            "F97EF6FC2233138D39D18E520099A342048BDAAB7D33FA09343C2F25532A42394CE51E0CC2183BA8853AB9978DD72C99FD29879E53FD3A4A52E3FBBA2036B30D",
                        },
                      },
                      {
                        PublicKey: "EDA9BEAB987DCFFEDCF2067B24CC7B8CF0C210B358A891FE0ED78EC324FBB40ADB",
                        manifest:
                          "JAAAAAJxIe2pvquYfc/+3PIGeyTMe4zwwhCzWKiR/g7XjsMk+7QK23MhAoycHeN4naIjFteJ4xCZ0Q8P5Zd9r9RUWbExH/tl9G/JdkcwRQIhAODAet56y2oa0KUDNyfEU6uIf8lu0QRtZRA45QscyS/NAiB2w6SpRh3uSQwc5QN8xlXEicwQyC5HPNd+byNVoolDKnASQFJdF9zduUEo7R5Sd7DPuK8GjUw3tkWpfRwLzbm55NftxC2/QTGfG4mqbon+Ra4MAoyPFJWmzmJnYf9ecIdC+gg=",
                        decodedManifest: {
                          Sequence: 2,
                          PublicKey: "EDA9BEAB987DCFFEDCF2067B24CC7B8CF0C210B358A891FE0ED78EC324FBB40ADB",
                          publicKey: "nHUeUNSn3zce2xQZWNghQvd9WRH6FWEnCBKYVJu2vAizMxnXegfJ",
                          address: "rfCFANwdNatTPyq3fovKUk3joopCJRZEs7",
                          SigningPubKey: "028C9C1DE3789DA22316D789E31099D10F0FE5977DAFD45459B1311FFB65F46FC9",
                          signingPubKey: "n9KcRZYHLU9rhGVwB9e4wEMYsxXvUfgFxtmX25pc1QPNgweqzQf5",
                          Signature:
                            "3045022100E0C07ADE7ACB6A1AD0A5033727C453AB887FC96ED1046D651038E50B1CC92FCD022076C3A4A9461DEE490C1CE5037CC655C489CC10C82E473CD77E6F2355A289432A",
                          MasterSignature:
                            "525D17DCDDB94128ED1E5277B0CFB8AF068D4C37B645A97D1C0BCDB9B9E4D7EDC42DBF41319F1B89AA6E89FE45AE0C028C8F1495A6CE626761FF5E708742FA08",
                        },
                      },
                      {
                        PublicKey: "ED20BB134D03B54E3D2E6745775BF41FADF3C276399B1F3623081D7B66D0714E33",
                        manifest:
                          "JAAAAAJxIe0guxNNA7VOPS5nRXdb9B+t88J2OZsfNiMIHXtm0HFOM3MhArTPZTWNQ7IcbXIP1SEeT2rTwsJ78ttZYCQuSaXgajbQdkcwRQIhAP82FxVItRg1WPPCvB+yw0pPHl5/bA0xD/KWcSdWGD2SAiAVQ8bXOntcbl8MM2js+mZOYctKkJzFcE9xEf91WRow3nASQGP9x1oxRGd2fIyyJpx6+HCgar2+/Ns/Ord5hUlTXaICzKGfG5/cUlEzcgN2BoRBjxCpi5wMh84hJaL+hIVH5Ac=",
                        decodedManifest: {
                          Sequence: 2,
                          PublicKey: "ED20BB134D03B54E3D2E6745775BF41FADF3C276399B1F3623081D7B66D0714E33",
                          publicKey: "nHBbiP5ua5dUqCTz5i5vd3ia9jg3KJthohDjgKxnc7LxtmnauW7Z",
                          address: "rNCTjcTc5NKxAQgDqiZnRrYkeTpQiUdHQ8",
                          SigningPubKey: "02B4CF65358D43B21C6D720FD5211E4F6AD3C2C27BF2DB5960242E49A5E06A36D0",
                          signingPubKey: "n9Kv3RbsBNbp1NkV3oP7UjHb3zEAz2KwtK3uQG7UxjQ8Mi3PaXiw",
                          Signature:
                            "3045022100FF36171548B5183558F3C2BC1FB2C34A4F1E5E7F6C0D310FF296712756183D9202201543C6D73A7B5C6E5F0C3368ECFA664E61CB4A909CC5704F7111FF75591A30DE",
                          MasterSignature:
                            "63FDC75A314467767C8CB2269C7AF870A06ABDBEFCDB3F3AB7798549535DA202CCA19F1B9FDC5251337203760684418F10A98B9C0C87CE2125A2FE848547E407",
                        },
                      },
                    ],
                  },
                },
              },
              transaction: {
                id: "51875E3B3DD854E6344CDAFB4934673B076405B51F7AE4FEF6301B4D35DDF14C",
                tx: {
                  TransactionType: "NFTokenBurn",
                  Flags: 0,
                  Sequence: 39419543,
                  LastLedgerSequence: 39419671,
                  OperationLimit: 21338,
                  NFTokenID: "0008013AAC8B8F22E7C42AE160DBD7961899DF6AD5FF80880000099B00000000",
                  Fee: "12",
                  SigningPubKey: "EDE17BEBA254D19FCDD66EE8E5C21FF88444D082E181E263EF06E3A2E048AE50C9",
                  TxnSignature:
                    "B10E4A0A78B363052F10080464834FD7166473A68295713D1CA22711277E8A672EB1E6E1E26C581C5B34D87FF5338D25124D55ED4C2A05B686299DFD79017B04",
                  Account: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
                  Owner: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
                },
                meta: {
                  TransactionIndex: 2,
                  AffectedNodes: [
                    {
                      ModifiedNode: {
                        LedgerEntryType: "AccountRoot",
                        PreviousTxnLgrSeq: 39419641,
                        PreviousTxnID: "6DC9814FD34FA93751DEFB7705220EF84ECC779A51AF198D2E7209EA97416BEB",
                        LedgerIndex: "AB28F55952D30905E86AFAFC72064ECEE139FCFA100E747968518DD8A304E5EA",
                        PreviousFields: {
                          Sequence: 39419543,
                          OwnerCount: 1,
                          Balance: "9999999988",
                        },
                        FinalFields: {
                          Flags: 0,
                          Sequence: 39419544,
                          OwnerCount: 0,
                          MintedNFTokens: 1,
                          BurnedNFTokens: 1,
                          Balance: "9999999976",
                          Account: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
                        },
                      },
                    },
                    {
                      DeletedNode: {
                        LedgerEntryType: "NFTokenPage",
                        LedgerIndex: "AC8B8F22E7C42AE160DBD7961899DF6AD5FF8088FFFFFFFFFFFFFFFFFFFFFFFF",
                        FinalFields: {
                          Flags: 0,
                          PreviousTxnLgrSeq: 39419641,
                          PreviousTxnID: "6DC9814FD34FA93751DEFB7705220EF84ECC779A51AF198D2E7209EA97416BEB",
                          NFTokens: [
                            {
                              NFToken: {
                                NFTokenID: "0008013AAC8B8F22E7C42AE160DBD7961899DF6AD5FF80880000099B00000000",
                                URI: "68747470733A2F2F692E6B796D2D63646E2E636F6D2F656E74726965732F69636F6E732F6F726967696E616C2F3030302F3032372F3437352F53637265656E5F53686F745F323031382D31302D32355F61745F31312E30322E31355F414D2E706E67",
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                  TransactionResult: "tesSUCCESS",
                },
                proof: {
                  children: {
                    "4": {
                      children: {},
                      hash: "46C9AC5E9792881E00D470E0B479FA7225545F6F3AAD130F2AB1CDB970CC88D4",
                      key: "49EFBB66B2ACFEBA58C2B0C79A65D36238162A09B9980159AC41BC9686FB9494",
                    },
                    "5": {
                      children: {},
                      hash: "D0E594E8609A2F1ACBA7E7E6946AAB9D51774A650E0DD76F8511EF4B5082A00B",
                      key: "51875E3B3DD854E6344CDAFB4934673B076405B51F7AE4FEF6301B4D35DDF14C",
                    },
                    "9": {
                      children: {},
                      hash: "DBBEF332E0348BFC83EE53FE16F977D8CE5C63D24E8BA288B44D8CA4D4CA3B1D",
                      key: "9C4D879A96F64E58AD865B3A38C2F5150A5A434F730794ED8894607E074EAF3B",
                    },
                  },
                  hash: "B060B646BDB6329B9A93E7477BBCAAF717C409A35741317E330855F70A4BA971",
                  key: "0000000000000000000000000000000000000000000000000000000000000000",
                },
                specification: {
                  account: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
                  nftokenID: "0008013AAC8B8F22E7C42AE160DBD7961899DF6AD5FF80880000099B00000000",
                },
                outcome: {
                  result: "tesSUCCESS",
                  fee: "0.000012",
                  balanceChanges: {
                    rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T: [
                      {
                        currency: "XRP",
                        value: "-0.000012",
                      },
                    ],
                  },
                  nftokenChanges: {
                    rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T: [
                      {
                        status: "removed",
                        nftokenID: "0008013AAC8B8F22E7C42AE160DBD7961899DF6AD5FF80880000099B00000000",
                        uri: "68747470733A2F2F692E6B796D2D63646E2E636F6D2F656E74726965732F69636F6E732F6F726967696E616C2F3030302F3032372F3437352F53637265656E5F53686F745F323031382D31302D32355F61745F31312E30322E31355F414D2E706E67",
                      },
                    ],
                  },
                  affectedObjects: {
                    nftokens: {
                      "0008013AAC8B8F22E7C42AE160DBD7961899DF6AD5FF80880000099B00000000": {
                        nftokenID: "0008013AAC8B8F22E7C42AE160DBD7961899DF6AD5FF80880000099B00000000",
                        flags: {
                          burnable: false,
                          onlyXRP: false,
                          trustLine: false,
                          transferable: true,
                        },
                        transferFee: 314,
                        issuer: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
                        nftokenTaxon: 0,
                        sequence: 0,
                      },
                    },
                  },
                  indexInLedger: 2,
                },
              },
            },
            source: {
              address: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
            },
          },
          outcome: {
            result: "tesSUCCESS",
            timestamp: "2023-07-12T10:09:20.000Z",
            fee: "0.011087",
            balanceChanges: {
              rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T: [
                {
                  currency: "XAH",
                  value: "-0.011075",
                },
              ],
            },
            hooksExecutions: [
              {
                account: "r3Q5KufJdkQyaLvHD22fJFVSZCqq4GczyU",
                emitCount: 1,
                executionIndex: 0,
                hash: "6DAE1BECB44B1B0F7034A642849AECB73B8E3CF31ED7AF9C0BA16DF8363E3DE7",
                instructionCount: "6a0",
                result: 3,
                returnCode: "d3",
                returnString: "",
                stateChangeCount: 0,
              },
            ],
            emittedTxns: [
              {
                id: "9FFF77CEA7B0A61452E0E6560C6AD1DECFA7DE78DDAB6567E10C54B5547371F8",
                specification: {
                  uri: "68747470733A2F2F692E6B796D2D63646E2E636F6D2F656E74726965732F69636F6E732F6F726967696E616C2F3030302F3032372F3437352F53637265656E5F53686F745F323031382D31302D32355F61745F31312E30322E31355F414D2E706E67",
                  flags: {
                    burnable: false,
                  },
                  source: { address: "r3Q5KufJdkQyaLvHD22fJFVSZCqq4GczyU" },
                  destination: { address: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T" },
                  emittedDetails: {
                    emitBurden: "1",
                    emitGeneration: 1,
                    emitHookHash: "6DAE1BECB44B1B0F7034A642849AECB73B8E3CF31ED7AF9C0BA16DF8363E3DE7",
                    emitNonce: "AE93CC86985824560241B2184DB28EFAE9D36A69A2BE6D07F071BFA3E7380E02",
                    emitParentTxnID: "BD3338E3799624DF13EA1CA46CD7305A643B99941F3563FAC35FB3D456153622",
                  },
                },
                tx: {
                  Account: "r3Q5KufJdkQyaLvHD22fJFVSZCqq4GczyU",
                  Destination: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
                  EmitDetails: {
                    EmitBurden: "1",
                    EmitGeneration: 1,
                    EmitHookHash: "6DAE1BECB44B1B0F7034A642849AECB73B8E3CF31ED7AF9C0BA16DF8363E3DE7",
                    EmitNonce: "AE93CC86985824560241B2184DB28EFAE9D36A69A2BE6D07F071BFA3E7380E02",
                    EmitParentTxnID: "BD3338E3799624DF13EA1CA46CD7305A643B99941F3563FAC35FB3D456153622",
                  },
                  Fee: "10",
                  FirstLedgerSequence: 4722790,
                  Flags: 2147483648,
                  LastLedgerSequence: 4722794,
                  Sequence: 0,
                  SigningPubKey: "",
                  TransactionType: "URITokenMint",
                  URI: "68747470733A2F2F692E6B796D2D63646E2E636F6D2F656E74726965732F69636F6E732F6F726967696E616C2F3030302F3032372F3437352F53637265656E5F53686F745F323031382D31302D32355F61745F31312E30322E31355F414D2E706E67",
                },
              },
            ],
            ledgerVersion: 4722789,
            indexInLedger: 0,
            deliveredAmount: {
              currency: "XAH",
              value: "-0.011075",
            },
          },
        });
      });
    });
  });
});
