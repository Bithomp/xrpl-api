import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("mainnet", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:mainnet"), { loadBalancing: true, nativeCurrency: "XRP" });
      await Client.connect();
    });

    describe("getTransactions", () => {
      it("transactions with ledger version", async function () {
        const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const result: any = await Client.getTransactions(address, {
          limit: 10,
          ledgerIndexMin: 61770679,
          ledgerIndexMax: 61770679,
        });

        delete result.transactions[0].tx.inLedger;
        expect(result.transactions).to.eql([
          {
            meta: {
              AffectedNodes: [
                {
                  ModifiedNode: {
                    FinalFields: {
                      Account: "rMM9c3vc2j8x7wZ7mfBtcKPe1eDmjV464",
                      Balance: "33031616",
                      Flags: 0,
                      OwnerCount: 1,
                      Sequence: 13,
                    },
                    LedgerEntryType: "AccountRoot",
                    LedgerIndex: "410C5509459F6A9E7840D246C4557B81E66BC9531E5E6BBB1A830018C820C0CC",
                    PreviousFields: { Balance: "33032631", Sequence: 12 },
                    PreviousTxnID: "D0495ACF6BCED0CDC4C645F616BD6ED43B49A51C6D0B19E555D6BC409B43C5F7",
                    PreviousTxnLgrSeq: 44276890,
                  },
                },
                {
                  ModifiedNode: {
                    FinalFields: {
                      Account: "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z",
                      Balance: "108371418",
                      Domain: "626974686F6D702E636F6D",
                      EmailHash: "576EDA7E0D04BC218DAA8A501FCA50B6",
                      Flags: 8388608,
                      OwnerCount: 7,
                      Sequence: 329,
                      TransferRate: 1002000000,
                    },
                    LedgerEntryType: "AccountRoot",
                    LedgerIndex: "EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA",
                    PreviousFields: { Balance: "108370418" },
                    PreviousTxnID: "BD66350A0A823F99CADAADEB77D6C74E5363F9A733273079EA15B0A5A28DE9B8",
                    PreviousTxnLgrSeq: 61040599,
                  },
                },
              ],
              TransactionIndex: 106,
              TransactionResult: "tesSUCCESS",
              delivered_amount: "1000",
            },
            tx: {
              Account: "rMM9c3vc2j8x7wZ7mfBtcKPe1eDmjV464",
              Amount: "1000",
              Destination: "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z",
              DestinationTag: 232060612,
              Fee: "15",
              Flags: 2147483648,
              LastLedgerSequence: 61770685,
              Memos: [
                { Memo: { MemoData: "67617465687562", MemoFormat: "746578742F706C61696E", MemoType: "636C69656E74" } },
              ],
              Sequence: 12,
              SigningPubKey: "03A29FCE479813DFF92AA3A01451C291DCAA9BB1CFFB771BC832A4BBE288712E0A",
              TransactionType: "Payment",
              TxnSignature:
                "30450221008A19C1229EE6D41D6C3A6CF6ED554D6F22589A1705FBF114496CD9D416966CA802206EFBA93CF4B53F3BF75F8A846646AA363DF89F6C4CE97A3BC48F7AAE492E5CE1",
              date: 667375232,
              hash: "40FAF3E1AF547F51E866856D292647392FD493A1B16B06D7891027AD107CCA10",
              ledger_index: 61770679,
            },
            validated: true,
          },
        ]);
      });

      it("finds the fist transaction", async function () {
        const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const result: any = await Client.getTransactions(address, {
          limit: 1,
          forward: true,
        });

        delete result.transactions[0].tx.inLedger; // can be missed, depending on the server
        delete result.transactions[0].tx.DeliverMax; // can be missed, depending on the server 2.0.0 and greater
        expect(result.transactions[0].tx.date).to.eq(498983820);
        delete result.transactions[0].tx.date; // can be in different position, depending on the server
        expect(JSON.stringify(result.transactions)).to.eq(
          '[{"meta":{"AffectedNodes":[{"ModifiedNode":{"FinalFields":{"Account":"rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk","Balance":"19897873078","Flags":393216,"OwnerCount":1,"Sequence":98303},"LedgerEntryType":"AccountRoot","LedgerIndex":"A1C341684C7E01E81208A9F59BF6C0DAD245BEA5ED399E52D109AEFFB29B0C69","PreviousFields":{"Balance":"19928893080","Sequence":98302},"PreviousTxnID":"9EFDB125992DB9F12C3389D34045B1D4C87B3D8B5B82F05B8B541EFC4579EA53","PreviousTxnLgrSeq":16658441}},{"CreatedNode":{"LedgerEntryType":"AccountRoot","LedgerIndex":"EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA","NewFields":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Balance":"31000000","Sequence":1}}}],"TransactionIndex":4,"TransactionResult":"tesSUCCESS","delivered_amount":"31000000"},"tx":{"Account":"rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk","Amount":"31000000","Destination":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Fee":"20002","Flags":2147483648,"Sequence":98302,"SigningPubKey":"02F81DBCD76D399BCF49F3812870A1234FF004DC62169915588AF7749A4D57499F","SourceTag":1617004677,"TransactionType":"Payment","TxnSignature":"304502210082B18C90FBDA585C5527C6D2C9D244C6482A2E439FD152F37A2E2AE7F33315C102205CDC77D7909EA8D7FB8E5A51EA674EF514D251EDAE0101FAB0C1BD3F42E01AA7","hash":"2D6894BCCA14919218576E8204E4715301989D98CAEDA304BB465949459972D3","ledger_index":16658556},"validated":true}]'
        );
      });

      it("transactions with balanceChanges", async function () {
        const address = "rKHdxvrzyCQvNzcsjLRX2mz7XiqdQHwyBH";
        const result: any = await Client.getTransactions(address, { limit: 1, balanceChanges: true });

        expect(result.transactions[0].balanceChanges).to.eql([
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
    });

    describe("findTransactions", () => {
      it("transactions with ledger version", async function () {
        this.timeout(20000);
        const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const result: any = await Client.findTransactions(address, {
          limit: 10,
          ledgerIndexMin: 61770679,
          ledgerIndexMax: 61770679,
        });

        delete result[0].tx.inLedger; // can be missed, depending on the server
        delete result[0].tx.DeliverMax; // can be missed, depending on the server 2.0.0 and greater
        expect(result[0].tx.date).to.eq(667375232);
        delete result[0].tx.date; // can be in different position, depending on the server
        expect(JSON.stringify(result)).to.eq(
          '[{"meta":{"AffectedNodes":[{"ModifiedNode":{"FinalFields":{"Account":"rMM9c3vc2j8x7wZ7mfBtcKPe1eDmjV464","Balance":"33031616","Flags":0,"OwnerCount":1,"Sequence":13},"LedgerEntryType":"AccountRoot","LedgerIndex":"410C5509459F6A9E7840D246C4557B81E66BC9531E5E6BBB1A830018C820C0CC","PreviousFields":{"Balance":"33032631","Sequence":12},"PreviousTxnID":"D0495ACF6BCED0CDC4C645F616BD6ED43B49A51C6D0B19E555D6BC409B43C5F7","PreviousTxnLgrSeq":44276890}},{"ModifiedNode":{"FinalFields":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Balance":"108371418","Domain":"626974686F6D702E636F6D","EmailHash":"576EDA7E0D04BC218DAA8A501FCA50B6","Flags":8388608,"OwnerCount":7,"Sequence":329,"TransferRate":1002000000},"LedgerEntryType":"AccountRoot","LedgerIndex":"EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA","PreviousFields":{"Balance":"108370418"},"PreviousTxnID":"BD66350A0A823F99CADAADEB77D6C74E5363F9A733273079EA15B0A5A28DE9B8","PreviousTxnLgrSeq":61040599}}],"TransactionIndex":106,"TransactionResult":"tesSUCCESS","delivered_amount":"1000"},"tx":{"Account":"rMM9c3vc2j8x7wZ7mfBtcKPe1eDmjV464","Amount":"1000","Destination":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","DestinationTag":232060612,"Fee":"15","Flags":2147483648,"LastLedgerSequence":61770685,"Memos":[{"Memo":{"MemoData":"67617465687562","MemoFormat":"746578742F706C61696E","MemoType":"636C69656E74"}}],"Sequence":12,"SigningPubKey":"03A29FCE479813DFF92AA3A01451C291DCAA9BB1CFFB771BC832A4BBE288712E0A","TransactionType":"Payment","TxnSignature":"30450221008A19C1229EE6D41D6C3A6CF6ED554D6F22589A1705FBF114496CD9D416966CA802206EFBA93CF4B53F3BF75F8A846646AA363DF89F6C4CE97A3BC48F7AAE492E5CE1","hash":"40FAF3E1AF547F51E866856D292647392FD493A1B16B06D7891027AD107CCA10","ledger_index":61770679},"validated":true}]'
        );
      });

      it("finds the fist activation transaction", async function () {
        const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const result: any = await Client.findTransactions(address, {
          limit: 1,
          initiated: false,
          forward: true,
          excludeFailures: true,
          types: ["Payment"],
          timeout: 4000,
        });

        delete result[0].tx.inLedger; // can be missed, depending on the server
        delete result[0].tx.DeliverMax; // can be missed, depending on the server 2.0.0 and greater
        expect(result[0].tx.date).to.eq(498983820);
        delete result[0].tx.date; // can be in different position, depending on the server
        expect(JSON.stringify(result)).to.eq(
          '[{"meta":{"AffectedNodes":[{"ModifiedNode":{"FinalFields":{"Account":"rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk","Balance":"19897873078","Flags":393216,"OwnerCount":1,"Sequence":98303},"LedgerEntryType":"AccountRoot","LedgerIndex":"A1C341684C7E01E81208A9F59BF6C0DAD245BEA5ED399E52D109AEFFB29B0C69","PreviousFields":{"Balance":"19928893080","Sequence":98302},"PreviousTxnID":"9EFDB125992DB9F12C3389D34045B1D4C87B3D8B5B82F05B8B541EFC4579EA53","PreviousTxnLgrSeq":16658441}},{"CreatedNode":{"LedgerEntryType":"AccountRoot","LedgerIndex":"EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA","NewFields":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Balance":"31000000","Sequence":1}}}],"TransactionIndex":4,"TransactionResult":"tesSUCCESS","delivered_amount":"31000000"},"tx":{"Account":"rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk","Amount":"31000000","Destination":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Fee":"20002","Flags":2147483648,"Sequence":98302,"SigningPubKey":"02F81DBCD76D399BCF49F3812870A1234FF004DC62169915588AF7749A4D57499F","SourceTag":1617004677,"TransactionType":"Payment","TxnSignature":"304502210082B18C90FBDA585C5527C6D2C9D244C6482A2E439FD152F37A2E2AE7F33315C102205CDC77D7909EA8D7FB8E5A51EA674EF514D251EDAE0101FAB0C1BD3F42E01AA7","hash":"2D6894BCCA14919218576E8204E4715301989D98CAEDA304BB465949459972D3","ledger_index":16658556},"validated":true}]'
        );
      });

      it("finds the fist send transaction", async function () {
        const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const result: any = await Client.findTransactions(address, {
          limit: 1,
          initiated: true,
          forward: true,
          excludeFailures: true,
          types: ["Payment"],
          timeout: 4000,
        });

        delete result[0].tx.inLedger; // can be missed, depending on the server
        delete result[0].tx.DeliverMax; // can be missed, depending on the server 2.0.0 and greater
        expect(result[0].tx.date).to.eq(498985950);
        delete result[0].tx.date; // can be in different position, depending on the server
        expect(JSON.stringify(result)).to.eq(
          '[{"meta":{"AffectedNodes":[{"ModifiedNode":{"FinalFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-1575.776486048158"},"Flags":2228224,"HighLimit":{"currency":"USD","issuer":"rEiH1zXBtkBkv84tY5wBnH7uzYWQWTenV1","value":"6000"},"HighNode":"130","LowLimit":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"0"},"LowNode":"31a"},"LedgerEntryType":"RippleState","LedgerIndex":"31F58021525F88F2B1AE4F3A586DFD74F41A9256CD7193024F015CAE07380222","PreviousFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-1575.637647086995"}},"PreviousTxnID":"125948AC2628DF08CCACCAF518794FCE52CB5136E3C9197248853BE2BCB08132","PreviousTxnLgrSeq":16657925}},{"ModifiedNode":{"FinalFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-0.860883360914644"},"Flags":2228224,"HighLimit":{"currency":"USD","issuer":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","value":"1000000000"},"HighNode":"0","LowLimit":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"0"},"LowNode":"372"},"LedgerEntryType":"RippleState","LedgerIndex":"67F3EB1AC9089489308E69850D09A8E283B029DB89C6480F809CAEF68EBF6A28","PreviousFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-1"}},"PreviousTxnID":"2E7E840304C193726CC0571DAA860ABDDE66B6070775F8CACF2721E4555C7FCF","PreviousTxnLgrSeq":16658947}},{"ModifiedNode":{"FinalFields":{"Account":"rEiH1zXBtkBkv84tY5wBnH7uzYWQWTenV1","BookDirectory":"DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4C10711C28097191","BookNode":"0","Flags":131072,"OwnerNode":"2289","Sequence":649645,"TakerGets":"26038393931","TakerPays":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"120.5047854577931"}},"LedgerEntryType":"Offer","LedgerIndex":"A4D740FFAE28E4C34D1F1FDC0056EBF410B27D3CC70952BC15B3B9E28B30D0FE","PreviousFields":{"TakerGets":"26068393931","TakerPays":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"120.6436244189561"}},"PreviousTxnID":"90DB9249090D8E38964DAFBCDEBDC65F4770429ED715D7150B76BD228B99835C","PreviousTxnLgrSeq":16658935}},{"ModifiedNode":{"FinalFields":{"Account":"rEiH1zXBtkBkv84tY5wBnH7uzYWQWTenV1","Balance":"99318297626","Flags":0,"OwnerCount":247,"Sequence":649655},"LedgerEntryType":"AccountRoot","LedgerIndex":"D6D5EDAC30274DE099B0013732CB253AB16D8A6A563666B82A52F93F2A297A50","PreviousFields":{"Balance":"99348297626"},"PreviousTxnID":"860B85BFE364A3F1D3FCB10003F152620F5CCBA9AE5392D7B4A568CCD80CF2FC","PreviousTxnLgrSeq":16658938}},{"ModifiedNode":{"FinalFields":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Balance":"60964000","Flags":0,"OwnerCount":2,"Sequence":4},"LedgerEntryType":"AccountRoot","LedgerIndex":"EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA","PreviousFields":{"Balance":"30976000","Sequence":3},"PreviousTxnID":"F35F8BD3C0BF97FE20BB4698031D61FA122809498491BEE68C44E8F5464F88B1","PreviousTxnLgrSeq":16658797}}],"TransactionIndex":1,"TransactionResult":"tesSUCCESS","delivered_amount":"30000000"},"tx":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Amount":"30000000","Destination":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Fee":"12000","Flags":0,"LastLedgerSequence":16659002,"Memos":[{"Memo":{"MemoData":"7274312E352E342D35302D6762616536396263","MemoFormat":"746578742F706C61696E","MemoType":"636C69656E74"}}],"Paths":[[{"currency":"XRP","type":16}],[{"account":"rP5ShE8dGBH6hHtNvRESdMceen36XFBQmh","type":1},{"currency":"XRP","type":16}]],"SendMax":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"0.1392557557244418"},"Sequence":3,"SigningPubKey":"036C288D95A4268D268F8CAFC262FC77EB7265535805B760BD8A0E544C1C5740A7","TransactionType":"Payment","TxnSignature":"304402205503A3D932FA519335D4613FA551550C7D886EC1B68E7AD198947BDE8FB3FCA20220262121A1DBE9FB0C56B9ACBA9B383F056C8040E0C043C9505DD23E1150B18B32","hash":"5252FE36681D56CB1218B34BBF7509C4B8008D45C0FE31A4168A83E87478B877","ledger_index":16659000},"validated":true}]'
        );
      });

      it("finds the 10 send transaction after first one", async function () {
        const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const result: any = await Client.findTransactions(address, {
          limit: 10,
          initiated: true,
          forward: true,
          excludeFailures: true,
          types: ["Payment"],
          startTxHash: "5252FE36681D56CB1218B34BBF7509C4B8008D45C0FE31A4168A83E87478B877",
          timeout: 4000,
        });

        expect(result.length).to.eq(10);
        expect(result[0].tx.hash).to.eq("A92198925ABAA11D1EB3F5967D88D5D1F5FF1D1D356BE3B10477F774906262E6");
      });

      it("finds one previous with startTxHash", async function () {
        const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const result: any = await Client.findTransactions(address, {
          limit: 1,
          startTxHash: "262CF9482A2BD8EAF3F1210AD6F5B2D9D4FA710533D75C5E1855C631B337A297",
          timeout: 4000,
        });

        expect(result.length).to.eq(1);
        expect(result[0].tx.hash).to.eq("EB467EEDE37080F926766246A9D1883665B29545685013B3CB502394ECEF2476");
      });

      it("finds 10 previous with startTxHash", async function () {
        const address = "rDCngTUntDFsDKUUuck6iF2C1iQ9fZXiLD";
        const result: any = await Client.findTransactions(address, {
          limit: 10,
          startTxHash: "61B338B97DA9081EBA34FA90D2606D8EA56099ABF1344F29588031744C3BF631",
          timeout: 4000,
        });

        expect(result.length).to.eq(10);
        expect(result[0].tx.hash).to.eq("4366EAD2976FDDE7CA02166181FAE65DE36C5B0705E174D6546D61CF5FEF74A1");
      });

      it("finds the fist trustline set transaction with counterparty", async function () {
        const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const result: any = await Client.findTransactions(address, {
          limit: 1,
          initiated: true,
          forward: true,
          counterparty: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          timeout: 4000,
        });

        delete result[0].tx.inLedger; // can be missed, depending on the server
        delete result[0].tx.DeliverMin; // can be missed, depending on the server 2.0.0 and greater
        expect(result[0].tx.date).to.eq(498984910);
        delete result[0].tx.date; // can be in different position, depending on the server
        expect(JSON.stringify(result)).to.eq(
          '[{"meta":{"AffectedNodes":[{"CreatedNode":{"LedgerEntryType":"RippleState","LedgerIndex":"67F3EB1AC9089489308E69850D09A8E283B029DB89C6480F809CAEF68EBF6A28","NewFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"0"},"Flags":2228224,"HighLimit":{"currency":"USD","issuer":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","value":"1000000000"},"LowLimit":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"0"},"LowNode":"372"}}},{"ModifiedNode":{"FinalFields":{"Flags":0,"Owner":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","RootIndex":"B1A2E369E67CC64DEDB40E27546E6E696398C979A86CF903FFE7CBB3ED0EE971"},"LedgerEntryType":"DirectoryNode","LedgerIndex":"B1A2E369E67CC64DEDB40E27546E6E696398C979A86CF903FFE7CBB3ED0EE971"}},{"ModifiedNode":{"LedgerEntryType":"AccountRoot","LedgerIndex":"B7D526FDDF9E3B3F95C3DC97C353065B0482302500BBB8051A5C090B596C6133","PreviousTxnID":"D0783F35E17597B11C4E06DB952E906F97779864B12068D0EA75394A75FA2670","PreviousTxnLgrSeq":16658259}},{"ModifiedNode":{"FinalFields":{"Flags":0,"IndexPrevious":"371","Owner":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","RootIndex":"7E1247F78EFC74FA9C0AE39F37AF433966615EB9B757D8397C068C2849A8F4A5"},"LedgerEntryType":"DirectoryNode","LedgerIndex":"C6121F9C41DD07BD06D822B46E47C511ED506D6B2F68FB7E7F4BC06B36C77187"}},{"ModifiedNode":{"FinalFields":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Balance":"30976000","Flags":0,"OwnerCount":2,"Sequence":3},"LedgerEntryType":"AccountRoot","LedgerIndex":"EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA","PreviousFields":{"Balance":"30988000","OwnerCount":1,"Sequence":2},"PreviousTxnID":"2188D5FD0B33FF670B6F9CC7256569451F5254892FD80FC8AAF1237946AEBC03","PreviousTxnLgrSeq":16658790}}],"TransactionIndex":6,"TransactionResult":"tesSUCCESS"},"tx":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Fee":"12000","Flags":131072,"LastLedgerSequence":16658799,"LimitAmount":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"1000000000"},"Memos":[{"Memo":{"MemoData":"7274312E352E342D35302D6762616536396263","MemoFormat":"746578742F706C61696E","MemoType":"636C69656E74"}}],"Sequence":2,"SigningPubKey":"036C288D95A4268D268F8CAFC262FC77EB7265535805B760BD8A0E544C1C5740A7","TransactionType":"TrustSet","TxnSignature":"30440220027002AEA4C8ADCEA38E5648CA73F8F8A3D7AF262180AA7350F4FDEAC40F594202202A49C8F1B6EF067808824169B7269EDDC9A3BE83641CAA65E2D6A092CD0DB52B","hash":"F35F8BD3C0BF97FE20BB4698031D61FA122809498491BEE68C44E8F5464F88B1","ledger_index":16658797},"validated":true}]'
        );
      });

      it("finds the fist send transaction with counterparty", async function () {
        const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const result: any = await Client.findTransactions(address, {
          limit: 1,
          initiated: true,
          forward: true,
          counterparty: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          types: ["Payment"],
          timeout: 4000,
        });

        delete result[0].tx.inLedger; // can be missed, depending on the server
        delete result[0].tx.DeliverMax; // can be missed, depending on the server 2.0.0 and greater
        expect(result[0].tx.date).to.eq(498985950);
        delete result[0].tx.date; // can be in different position, depending on the server
        expect(JSON.stringify(result)).to.eq(
          '[{"meta":{"AffectedNodes":[{"ModifiedNode":{"FinalFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-1575.776486048158"},"Flags":2228224,"HighLimit":{"currency":"USD","issuer":"rEiH1zXBtkBkv84tY5wBnH7uzYWQWTenV1","value":"6000"},"HighNode":"130","LowLimit":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"0"},"LowNode":"31a"},"LedgerEntryType":"RippleState","LedgerIndex":"31F58021525F88F2B1AE4F3A586DFD74F41A9256CD7193024F015CAE07380222","PreviousFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-1575.637647086995"}},"PreviousTxnID":"125948AC2628DF08CCACCAF518794FCE52CB5136E3C9197248853BE2BCB08132","PreviousTxnLgrSeq":16657925}},{"ModifiedNode":{"FinalFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-0.860883360914644"},"Flags":2228224,"HighLimit":{"currency":"USD","issuer":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","value":"1000000000"},"HighNode":"0","LowLimit":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"0"},"LowNode":"372"},"LedgerEntryType":"RippleState","LedgerIndex":"67F3EB1AC9089489308E69850D09A8E283B029DB89C6480F809CAEF68EBF6A28","PreviousFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-1"}},"PreviousTxnID":"2E7E840304C193726CC0571DAA860ABDDE66B6070775F8CACF2721E4555C7FCF","PreviousTxnLgrSeq":16658947}},{"ModifiedNode":{"FinalFields":{"Account":"rEiH1zXBtkBkv84tY5wBnH7uzYWQWTenV1","BookDirectory":"DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4C10711C28097191","BookNode":"0","Flags":131072,"OwnerNode":"2289","Sequence":649645,"TakerGets":"26038393931","TakerPays":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"120.5047854577931"}},"LedgerEntryType":"Offer","LedgerIndex":"A4D740FFAE28E4C34D1F1FDC0056EBF410B27D3CC70952BC15B3B9E28B30D0FE","PreviousFields":{"TakerGets":"26068393931","TakerPays":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"120.6436244189561"}},"PreviousTxnID":"90DB9249090D8E38964DAFBCDEBDC65F4770429ED715D7150B76BD228B99835C","PreviousTxnLgrSeq":16658935}},{"ModifiedNode":{"FinalFields":{"Account":"rEiH1zXBtkBkv84tY5wBnH7uzYWQWTenV1","Balance":"99318297626","Flags":0,"OwnerCount":247,"Sequence":649655},"LedgerEntryType":"AccountRoot","LedgerIndex":"D6D5EDAC30274DE099B0013732CB253AB16D8A6A563666B82A52F93F2A297A50","PreviousFields":{"Balance":"99348297626"},"PreviousTxnID":"860B85BFE364A3F1D3FCB10003F152620F5CCBA9AE5392D7B4A568CCD80CF2FC","PreviousTxnLgrSeq":16658938}},{"ModifiedNode":{"FinalFields":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Balance":"60964000","Flags":0,"OwnerCount":2,"Sequence":4},"LedgerEntryType":"AccountRoot","LedgerIndex":"EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA","PreviousFields":{"Balance":"30976000","Sequence":3},"PreviousTxnID":"F35F8BD3C0BF97FE20BB4698031D61FA122809498491BEE68C44E8F5464F88B1","PreviousTxnLgrSeq":16658797}}],"TransactionIndex":1,"TransactionResult":"tesSUCCESS","delivered_amount":"30000000"},"tx":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Amount":"30000000","Destination":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Fee":"12000","Flags":0,"LastLedgerSequence":16659002,"Memos":[{"Memo":{"MemoData":"7274312E352E342D35302D6762616536396263","MemoFormat":"746578742F706C61696E","MemoType":"636C69656E74"}}],"Paths":[[{"currency":"XRP","type":16}],[{"account":"rP5ShE8dGBH6hHtNvRESdMceen36XFBQmh","type":1},{"currency":"XRP","type":16}]],"SendMax":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"0.1392557557244418"},"Sequence":3,"SigningPubKey":"036C288D95A4268D268F8CAFC262FC77EB7265535805B760BD8A0E544C1C5740A7","TransactionType":"Payment","TxnSignature":"304402205503A3D932FA519335D4613FA551550C7D886EC1B68E7AD198947BDE8FB3FCA20220262121A1DBE9FB0C56B9ACBA9B383F056C8040E0C043C9505DD23E1150B18B32","hash":"5252FE36681D56CB1218B34BBF7509C4B8008D45C0FE31A4168A83E87478B877","ledger_index":16659000},"validated":true}]'
        );
      });

      it("finds the fist send transaction with destinationTag", async function () {
        this.timeout(60000);
        const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const result: any = await Client.findTransactions(address, {
          limit: 1,
          destinationTag: 119954610,
          timeout: 55000,
        });

        expect(result.error).to.be.undefined;
        expect(result.length).to.eq(1);
        delete result[0].tx.inLedger; // can be missed, depending on the server
        delete result[0].tx.DeliverMax; // can be missed, depending on the server 2.0.0 and greater
        expect(result[0].tx.date).to.eq(690981391);
        delete result[0].tx.date; // can be in different position, depending on the server
        expect(JSON.stringify(result)).to.eq(
          '[{"meta":{"AffectedNodes":[{"ModifiedNode":{"FinalFields":{"Account":"rnNmQfX7sPJXQvdmp4Yyf8FWyBztRUWSxD","Balance":"376039648","Domain":"726E6E6D7166783773706A787176646D703479796638667779627A74727577737864","EmailHash":"ED4D15C58CE6A3F2B7D588262539F0F7","Flags":131072,"MessageKey":"0200000000000000000000000089720CB142C927967259164AC021E3CF97797C22","OwnerCount":181,"RegularKey":"rHXuEaRYnnJHbDeuBH5w8yPh5uwNVh5zAg","Sequence":63075335},"LedgerEntryType":"AccountRoot","LedgerIndex":"A5F2D2DB2EA20C47D5D467AEF46B08BE6AD286AFB499FC3ECCA4C57EB231E809","PreviousFields":{"Balance":"386039660","Sequence":63075334},"PreviousTxnID":"537D4E39DDB30A9EB3B73E2A9A57C74ED13ACE285DFA6B37B28C99249383E59B","PreviousTxnLgrSeq":67884682}},{"ModifiedNode":{"FinalFields":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Balance":"114998986","Domain":"626974686F6D702E636F6D","EmailHash":"576EDA7E0D04BC218DAA8A501FCA50B6","Flags":8388608,"MessageKey":"02000000000000000000000000800EDED12FE3414978DE62F6B852562E7CA0D8BE","OwnerCount":6,"Sequence":331,"TransferRate":1002000000},"LedgerEntryType":"AccountRoot","LedgerIndex":"EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA","PreviousFields":{"Balance":"104998986"},"PreviousTxnID":"E7246CDAD5FED09E0CFA4315EF0054603F2A6174E3A6EF6728EFF7C56BE6D0EB","PreviousTxnLgrSeq":67884596}}],"TransactionIndex":57,"TransactionResult":"tesSUCCESS","delivered_amount":"10000000"},"tx":{"Account":"rnNmQfX7sPJXQvdmp4Yyf8FWyBztRUWSxD","Amount":"10000000","Destination":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","DestinationTag":119954610,"Fee":"12","Flags":2147483648,"Sequence":63075334,"SigningPubKey":"0332F0084A80559814BA7A667A380D7CE5BFD945257ABEE5E078AC240EBFC0704B","TransactionType":"Payment","TxnSignature":"304402203B5DEE925481EBA0B285DF1B6BD8D3CEBB8800DFAF095CC3DB355E4A01E0A18502200FE0961E2D4CAE8811C1EEF101F8BEBED19D466F6A5B35212BB2D11EB2EA9A15","hash":"2D842E818BD8BD00A8D9B1916132A67C8D90A8D0482E18929EAF6038EAF61227","ledger_index":67885234},"validated":true}]'
        );
      });

      it("returns search timeout and marker", async function () {
        const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const result: any = await Client.findTransactions(address, {
          limit: 10,
          destinationTag: 119954610,
          timeout: 1, // only 1 request will be send
        });

        expect(Object.keys(result)).to.eql(["status", "error", "marker"]);
        expect(Object.keys(result.marker)).to.eql(["ledger", "seq", "bithompHash"]);
        expect(result.error).to.eq("searchTimeout");
        expect(result.marker.ledger).to.be.a("number");
        expect(result.marker.seq).to.be.a("number");
        expect(result.marker.bithompHash).to.be.a("string");
      });

      it("returns transaction with balanceChanges", async function () {
        const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const result: any = await Client.findTransactions(address, {
          limit: 1,
          initiated: false,
          forward: true,
          excludeFailures: true,
          types: ["Payment"],
          timeout: 4000,
          balanceChanges: true,
        });

        expect(result[0].balanceChanges).to.eql([
          { account: "rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk", balances: [{ currency: "XRP", value: "-31.020002" }] },
          { account: "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z", balances: [{ currency: "XRP", value: "31" }] },
        ]);
      });

      it("returns transaction with specification", async function () {
        const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const result: any = await Client.findTransactions(address, {
          limit: 1,
          initiated: false,
          forward: true,
          excludeFailures: true,
          types: ["Payment"],
          timeout: 4000,
          specification: true,
        });

        expect(result[0].specification).to.eql({
          destination: {
            address: "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z",
          },
          source: {
            address: "rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk",
            maxAmount: {
              currency: "XRP",
              value: "31",
            },
            tag: 1617004677,
          },
        });
        expect(result[0].outcome).to.eql({
          balanceChanges: {
            rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk: [{ currency: "XRP", value: "-31.020002" }],
            rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z: [{ currency: "XRP", value: "31" }],
          },
          deliveredAmount: {
            currency: "XRP",
            value: "31",
          },
          fee: "0.020002",
          indexInLedger: 4,
          ledgerVersion: 16658556,
          result: "tesSUCCESS",
          timestamp: "2015-10-24T06:37:00.000Z",
        });
        const decodedTx = JSON.parse(result[0].rawTransaction);
        delete decodedTx.inLedger; // can be missed, depending on the server
        delete decodedTx.DeliverMax; // can be missed, depending on the server 2.0.0 and greater
        expect(decodedTx.date).to.eq(498983820);
        delete decodedTx.date; // can be in different position
        expect(JSON.stringify(decodedTx)).to.eql(
          '{"Account":"rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk","Amount":"31000000","Destination":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Fee":"20002","Flags":2147483648,"Sequence":98302,"SigningPubKey":"02F81DBCD76D399BCF49F3812870A1234FF004DC62169915588AF7749A4D57499F","SourceTag":1617004677,"TransactionType":"Payment","TxnSignature":"304502210082B18C90FBDA585C5527C6D2C9D244C6482A2E439FD152F37A2E2AE7F33315C102205CDC77D7909EA8D7FB8E5A51EA674EF514D251EDAE0101FAB0C1BD3F42E01AA7","hash":"2D6894BCCA14919218576E8204E4715301989D98CAEDA304BB465949459972D3","ledger_index":16658556,"meta":{"AffectedNodes":[{"ModifiedNode":{"FinalFields":{"Account":"rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk","Balance":"19897873078","Flags":393216,"OwnerCount":1,"Sequence":98303},"LedgerEntryType":"AccountRoot","LedgerIndex":"A1C341684C7E01E81208A9F59BF6C0DAD245BEA5ED399E52D109AEFFB29B0C69","PreviousFields":{"Balance":"19928893080","Sequence":98302},"PreviousTxnID":"9EFDB125992DB9F12C3389D34045B1D4C87B3D8B5B82F05B8B541EFC4579EA53","PreviousTxnLgrSeq":16658441}},{"CreatedNode":{"LedgerEntryType":"AccountRoot","LedgerIndex":"EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA","NewFields":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Balance":"31000000","Sequence":1}}}],"TransactionIndex":4,"TransactionResult":"tesSUCCESS","delivered_amount":"31000000"},"validated":true}'
        );
      });

      it("returns transaction with formatted", async function () {
        const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const result: any = await Client.findTransactions(address, {
          limit: 1,
          initiated: false,
          forward: true,
          excludeFailures: true,
          types: ["Payment"],
          timeout: 4000,
          formatted: true,
        });

        expect(result[0]).to.eql({
          type: "payment",
          address: "rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk",
          sequence: 98302,
          id: "2D6894BCCA14919218576E8204E4715301989D98CAEDA304BB465949459972D3",
          specification: {
            source: {
              address: "rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk",
              maxAmount: {
                currency: "XRP",
                value: "31",
              },
              tag: 1617004677,
            },
            destination: {
              address: "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z",
            },
          },
          outcome: {
            result: "tesSUCCESS",
            timestamp: "2015-10-24T06:37:00.000Z",
            fee: "0.020002",
            balanceChanges: {
              rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk: [{ currency: "XRP", value: "-31.020002" }],
              rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z: [{ currency: "XRP", value: "31" }],
            },
            ledgerVersion: 16658556,
            indexInLedger: 4,
            deliveredAmount: {
              currency: "XRP",
              value: "31",
            },
          },
        });
      });

      it("returns transaction with formatted with includeRawTransactions", async function () {
        const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const result: any = await Client.findTransactions(address, {
          limit: 1,
          initiated: false,
          forward: true,
          excludeFailures: true,
          types: ["Payment"],
          timeout: 4000,
          formatted: true,
          includeRawTransactions: true,
        });

        const decodedTx = JSON.parse(result[0].rawTransaction);
        delete decodedTx.inLedger; // can be missed, depending on the server
        delete decodedTx.DeliverMax; // can be missed, depending on the server 2.0.0 and greater
        expect(decodedTx.date).to.eq(498983820);
        delete decodedTx.date; // can be in different position, depending on server version
        result[0].rawTransaction = JSON.stringify(decodedTx);
        expect(result[0]).to.eql({
          type: "payment",
          address: "rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk",
          sequence: 98302,
          id: "2D6894BCCA14919218576E8204E4715301989D98CAEDA304BB465949459972D3",
          specification: {
            source: {
              address: "rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk",
              maxAmount: {
                currency: "XRP",
                value: "31",
              },
              tag: 1617004677,
            },
            destination: {
              address: "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z",
            },
          },
          outcome: {
            result: "tesSUCCESS",
            timestamp: "2015-10-24T06:37:00.000Z",
            fee: "0.020002",
            balanceChanges: {
              rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk: [{ currency: "XRP", value: "-31.020002" }],
              rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z: [{ currency: "XRP", value: "31" }],
            },
            ledgerVersion: 16658556,
            indexInLedger: 4,
            deliveredAmount: {
              currency: "XRP",
              value: "31",
            },
          },
          rawTransaction:
            '{"Account":"rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk","Amount":"31000000","Destination":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Fee":"20002","Flags":2147483648,"Sequence":98302,"SigningPubKey":"02F81DBCD76D399BCF49F3812870A1234FF004DC62169915588AF7749A4D57499F","SourceTag":1617004677,"TransactionType":"Payment","TxnSignature":"304502210082B18C90FBDA585C5527C6D2C9D244C6482A2E439FD152F37A2E2AE7F33315C102205CDC77D7909EA8D7FB8E5A51EA674EF514D251EDAE0101FAB0C1BD3F42E01AA7","hash":"2D6894BCCA14919218576E8204E4715301989D98CAEDA304BB465949459972D3","ledger_index":16658556,"meta":{"AffectedNodes":[{"ModifiedNode":{"FinalFields":{"Account":"rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk","Balance":"19897873078","Flags":393216,"OwnerCount":1,"Sequence":98303},"LedgerEntryType":"AccountRoot","LedgerIndex":"A1C341684C7E01E81208A9F59BF6C0DAD245BEA5ED399E52D109AEFFB29B0C69","PreviousFields":{"Balance":"19928893080","Sequence":98302},"PreviousTxnID":"9EFDB125992DB9F12C3389D34045B1D4C87B3D8B5B82F05B8B541EFC4579EA53","PreviousTxnLgrSeq":16658441}},{"CreatedNode":{"LedgerEntryType":"AccountRoot","LedgerIndex":"EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA","NewFields":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Balance":"31000000","Sequence":1}}}],"TransactionIndex":4,"TransactionResult":"tesSUCCESS","delivered_amount":"31000000"},"validated":true}',
        });
      });
    });
  });
});
