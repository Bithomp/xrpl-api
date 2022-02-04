import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("getTransactions", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:mainnet"));
      await Client.connect();
    });

    it("transactions with ledger version", async function () {
      const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
      const result: any = await Client.getTransactions(address, {
        limit: 1,
        ledgerIndexMin: 61770679,
        ledgerIndexMax: 61770679,
      });

      expect(JSON.stringify(result.transactions)).to.eq(
        '[{"meta":{"AffectedNodes":[{"ModifiedNode":{"FinalFields":{"Account":"rMM9c3vc2j8x7wZ7mfBtcKPe1eDmjV464","Balance":"33031616","Flags":0,"OwnerCount":1,"Sequence":13},"LedgerEntryType":"AccountRoot","LedgerIndex":"410C5509459F6A9E7840D246C4557B81E66BC9531E5E6BBB1A830018C820C0CC","PreviousFields":{"Balance":"33032631","Sequence":12},"PreviousTxnID":"D0495ACF6BCED0CDC4C645F616BD6ED43B49A51C6D0B19E555D6BC409B43C5F7","PreviousTxnLgrSeq":44276890}},{"ModifiedNode":{"FinalFields":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Balance":"108371418","Domain":"626974686F6D702E636F6D","EmailHash":"576EDA7E0D04BC218DAA8A501FCA50B6","Flags":8388608,"OwnerCount":7,"Sequence":329,"TransferRate":1002000000},"LedgerEntryType":"AccountRoot","LedgerIndex":"EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA","PreviousFields":{"Balance":"108370418"},"PreviousTxnID":"BD66350A0A823F99CADAADEB77D6C74E5363F9A733273079EA15B0A5A28DE9B8","PreviousTxnLgrSeq":61040599}}],"TransactionIndex":106,"TransactionResult":"tesSUCCESS","delivered_amount":"1000"},"tx":{"Account":"rMM9c3vc2j8x7wZ7mfBtcKPe1eDmjV464","Amount":"1000","Destination":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","DestinationTag":232060612,"Fee":"15","Flags":2147483648,"LastLedgerSequence":61770685,"Memos":[{"Memo":{"MemoData":"67617465687562","MemoFormat":"746578742F706C61696E","MemoType":"636C69656E74"}}],"Sequence":12,"SigningPubKey":"03A29FCE479813DFF92AA3A01451C291DCAA9BB1CFFB771BC832A4BBE288712E0A","TransactionType":"Payment","TxnSignature":"30450221008A19C1229EE6D41D6C3A6CF6ED554D6F22589A1705FBF114496CD9D416966CA802206EFBA93CF4B53F3BF75F8A846646AA363DF89F6C4CE97A3BC48F7AAE492E5CE1","date":667375232,"hash":"40FAF3E1AF547F51E866856D292647392FD493A1B16B06D7891027AD107CCA10","inLedger":61770679,"ledger_index":61770679},"validated":true}]'
      );
    });

    it("finds the fist tranaction", async function () {
      const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
      const result: any = await Client.getTransactions(address, {
        limit: 1,
        forward: true,
      });

      expect(JSON.stringify(result.transactions)).to.eq(
        '[{"meta":{"AffectedNodes":[{"ModifiedNode":{"FinalFields":{"Account":"rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk","Balance":"19897873078","Flags":393216,"OwnerCount":1,"Sequence":98303},"LedgerEntryType":"AccountRoot","LedgerIndex":"A1C341684C7E01E81208A9F59BF6C0DAD245BEA5ED399E52D109AEFFB29B0C69","PreviousFields":{"Balance":"19928893080","Sequence":98302},"PreviousTxnID":"9EFDB125992DB9F12C3389D34045B1D4C87B3D8B5B82F05B8B541EFC4579EA53","PreviousTxnLgrSeq":16658441}},{"CreatedNode":{"LedgerEntryType":"AccountRoot","LedgerIndex":"EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA","NewFields":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Balance":"31000000","Sequence":1}}}],"TransactionIndex":4,"TransactionResult":"tesSUCCESS","delivered_amount":"31000000"},"tx":{"Account":"rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk","Amount":"31000000","Destination":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Fee":"20002","Flags":2147483648,"Sequence":98302,"SigningPubKey":"02F81DBCD76D399BCF49F3812870A1234FF004DC62169915588AF7749A4D57499F","SourceTag":1617004677,"TransactionType":"Payment","TxnSignature":"304502210082B18C90FBDA585C5527C6D2C9D244C6482A2E439FD152F37A2E2AE7F33315C102205CDC77D7909EA8D7FB8E5A51EA674EF514D251EDAE0101FAB0C1BD3F42E01AA7","date":498983820,"hash":"2D6894BCCA14919218576E8204E4715301989D98CAEDA304BB465949459972D3","inLedger":16658556,"ledger_index":16658556},"validated":true}]'
      );
    });
  });

  describe("findTransactions", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:mainnet"));
      await Client.connect();
    });

    it("finds the fist activation tranaction", async function () {
      const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
      const result: any = await Client.findTransactions(address, {
        limit: 1,
        initiated: false,
        forward: true,
        excludeFailures: true,
        types: ["Payment"],
        timeout: 4000,
      });

      expect(JSON.stringify(result)).to.eq(
        '[{"meta":{"AffectedNodes":[{"ModifiedNode":{"FinalFields":{"Account":"rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk","Balance":"19897873078","Flags":393216,"OwnerCount":1,"Sequence":98303},"LedgerEntryType":"AccountRoot","LedgerIndex":"A1C341684C7E01E81208A9F59BF6C0DAD245BEA5ED399E52D109AEFFB29B0C69","PreviousFields":{"Balance":"19928893080","Sequence":98302},"PreviousTxnID":"9EFDB125992DB9F12C3389D34045B1D4C87B3D8B5B82F05B8B541EFC4579EA53","PreviousTxnLgrSeq":16658441}},{"CreatedNode":{"LedgerEntryType":"AccountRoot","LedgerIndex":"EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA","NewFields":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Balance":"31000000","Sequence":1}}}],"TransactionIndex":4,"TransactionResult":"tesSUCCESS","delivered_amount":"31000000"},"tx":{"Account":"rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk","Amount":"31000000","Destination":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Fee":"20002","Flags":2147483648,"Sequence":98302,"SigningPubKey":"02F81DBCD76D399BCF49F3812870A1234FF004DC62169915588AF7749A4D57499F","SourceTag":1617004677,"TransactionType":"Payment","TxnSignature":"304502210082B18C90FBDA585C5527C6D2C9D244C6482A2E439FD152F37A2E2AE7F33315C102205CDC77D7909EA8D7FB8E5A51EA674EF514D251EDAE0101FAB0C1BD3F42E01AA7","date":498983820,"hash":"2D6894BCCA14919218576E8204E4715301989D98CAEDA304BB465949459972D3","inLedger":16658556,"ledger_index":16658556},"validated":true}]'
      );
    });

    it("finds the fist send tranaction", async function () {
      const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
      const result: any = await Client.findTransactions(address, {
        limit: 1,
        initiated: true,
        forward: true,
        excludeFailures: true,
        types: ["Payment"],
        timeout: 4000,
      });

      expect(JSON.stringify(result)).to.eq(
        '[{"meta":{"AffectedNodes":[{"ModifiedNode":{"FinalFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-1575.776486048158"},"Flags":2228224,"HighLimit":{"currency":"USD","issuer":"rEiH1zXBtkBkv84tY5wBnH7uzYWQWTenV1","value":"6000"},"HighNode":"130","LowLimit":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"0"},"LowNode":"31a"},"LedgerEntryType":"RippleState","LedgerIndex":"31F58021525F88F2B1AE4F3A586DFD74F41A9256CD7193024F015CAE07380222","PreviousFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-1575.637647086995"}},"PreviousTxnID":"125948AC2628DF08CCACCAF518794FCE52CB5136E3C9197248853BE2BCB08132","PreviousTxnLgrSeq":16657925}},{"ModifiedNode":{"FinalFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-0.860883360914644"},"Flags":2228224,"HighLimit":{"currency":"USD","issuer":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","value":"1000000000"},"HighNode":"0","LowLimit":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"0"},"LowNode":"372"},"LedgerEntryType":"RippleState","LedgerIndex":"67F3EB1AC9089489308E69850D09A8E283B029DB89C6480F809CAEF68EBF6A28","PreviousFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-1"}},"PreviousTxnID":"2E7E840304C193726CC0571DAA860ABDDE66B6070775F8CACF2721E4555C7FCF","PreviousTxnLgrSeq":16658947}},{"ModifiedNode":{"FinalFields":{"Account":"rEiH1zXBtkBkv84tY5wBnH7uzYWQWTenV1","BookDirectory":"DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4C10711C28097191","BookNode":"0","Flags":131072,"OwnerNode":"2289","Sequence":649645,"TakerGets":"26038393931","TakerPays":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"120.5047854577931"}},"LedgerEntryType":"Offer","LedgerIndex":"A4D740FFAE28E4C34D1F1FDC0056EBF410B27D3CC70952BC15B3B9E28B30D0FE","PreviousFields":{"TakerGets":"26068393931","TakerPays":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"120.6436244189561"}},"PreviousTxnID":"90DB9249090D8E38964DAFBCDEBDC65F4770429ED715D7150B76BD228B99835C","PreviousTxnLgrSeq":16658935}},{"ModifiedNode":{"FinalFields":{"Account":"rEiH1zXBtkBkv84tY5wBnH7uzYWQWTenV1","Balance":"99318297626","Flags":0,"OwnerCount":247,"Sequence":649655},"LedgerEntryType":"AccountRoot","LedgerIndex":"D6D5EDAC30274DE099B0013732CB253AB16D8A6A563666B82A52F93F2A297A50","PreviousFields":{"Balance":"99348297626"},"PreviousTxnID":"860B85BFE364A3F1D3FCB10003F152620F5CCBA9AE5392D7B4A568CCD80CF2FC","PreviousTxnLgrSeq":16658938}},{"ModifiedNode":{"FinalFields":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Balance":"60964000","Flags":0,"OwnerCount":2,"Sequence":4},"LedgerEntryType":"AccountRoot","LedgerIndex":"EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA","PreviousFields":{"Balance":"30976000","Sequence":3},"PreviousTxnID":"F35F8BD3C0BF97FE20BB4698031D61FA122809498491BEE68C44E8F5464F88B1","PreviousTxnLgrSeq":16658797}}],"TransactionIndex":1,"TransactionResult":"tesSUCCESS","delivered_amount":"30000000"},"tx":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Amount":"30000000","Destination":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Fee":"12000","Flags":0,"LastLedgerSequence":16659002,"Memos":[{"Memo":{"MemoData":"7274312E352E342D35302D6762616536396263","MemoFormat":"746578742F706C61696E","MemoType":"636C69656E74"}}],"Paths":[[{"currency":"XRP","type":16}],[{"account":"rP5ShE8dGBH6hHtNvRESdMceen36XFBQmh","type":1},{"currency":"XRP","type":16}]],"SendMax":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"0.1392557557244418"},"Sequence":3,"SigningPubKey":"036C288D95A4268D268F8CAFC262FC77EB7265535805B760BD8A0E544C1C5740A7","TransactionType":"Payment","TxnSignature":"304402205503A3D932FA519335D4613FA551550C7D886EC1B68E7AD198947BDE8FB3FCA20220262121A1DBE9FB0C56B9ACBA9B383F056C8040E0C043C9505DD23E1150B18B32","date":498985950,"hash":"5252FE36681D56CB1218B34BBF7509C4B8008D45C0FE31A4168A83E87478B877","inLedger":16659000,"ledger_index":16659000},"validated":true}]'
      );
    });

    it("finds the second send tranaction", async function () {
      const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
      const result: any = await Client.findTransactions(address, {
        limit: 1,
        initiated: true,
        forward: true,
        excludeFailures: true,
        types: ["Payment"],
        startTxHash: "5252FE36681D56CB1218B34BBF7509C4B8008D45C0FE31A4168A83E87478B877",
        timeout: 4000,
      });

      expect(JSON.stringify(result)).to.eq(
        '[{"meta":{"AffectedNodes":[{"ModifiedNode":{"FinalFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-0.500883360914644"},"Flags":2228224,"HighLimit":{"currency":"USD","issuer":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","value":"1000000000"},"HighNode":"0","LowLimit":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"0"},"LowNode":"372"},"LedgerEntryType":"RippleState","LedgerIndex":"67F3EB1AC9089489308E69850D09A8E283B029DB89C6480F809CAEF68EBF6A28","PreviousFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-0.860883360914644"}},"PreviousTxnID":"5252FE36681D56CB1218B34BBF7509C4B8008D45C0FE31A4168A83E87478B877","PreviousTxnLgrSeq":16659000}},{"ModifiedNode":{"FinalFields":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Balance":"60940000","Flags":0,"OwnerCount":3,"Sequence":6},"LedgerEntryType":"AccountRoot","LedgerIndex":"EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA","PreviousFields":{"Balance":"60952000","Sequence":5},"PreviousTxnID":"D5D12F4922F2AD6E893E6F4805FAD4B1CA0F56977D6D904BA2C1724B9B99444D","PreviousTxnLgrSeq":16659038}}],"TransactionIndex":0,"TransactionResult":"tesSUCCESS","delivered_amount":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"0.36"}},"tx":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Amount":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"0.36"},"Destination":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","DestinationTag":96212512,"Fee":"12000","Flags":0,"LastLedgerSequence":16660325,"Memos":[{"Memo":{"MemoData":"7274312E352E342D35302D6762616536396263","MemoFormat":"746578742F706C61696E","MemoType":"636C69656E74"}}],"SendMax":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"0.36036"},"Sequence":5,"SigningPubKey":"036C288D95A4268D268F8CAFC262FC77EB7265535805B760BD8A0E544C1C5740A7","TransactionType":"Payment","TxnSignature":"3045022100E6E58DA4148299A40A9C91E887551924EC9986153B7D11D1A1D13D17831A281A0220511F746337A807E6692D55DF91341743201596D90DD55904D7227414B3024C47","date":498992460,"hash":"A92198925ABAA11D1EB3F5967D88D5D1F5FF1D1D356BE3B10477F774906262E6","inLedger":16660323,"ledger_index":16660323},"validated":true}]'
      );
    });

    it("finds the fist send tranaction with counterparty", async function () {
      const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
      const result: any = await Client.findTransactions(address, {
        limit: 1,
        initiated: true,
        forward: true,
        counterparty: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        timeout: 4000,
      });

      expect(JSON.stringify(result)).to.eq(
        '[{"meta":{"AffectedNodes":[{"ModifiedNode":{"FinalFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-1575.776486048158"},"Flags":2228224,"HighLimit":{"currency":"USD","issuer":"rEiH1zXBtkBkv84tY5wBnH7uzYWQWTenV1","value":"6000"},"HighNode":"130","LowLimit":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"0"},"LowNode":"31a"},"LedgerEntryType":"RippleState","LedgerIndex":"31F58021525F88F2B1AE4F3A586DFD74F41A9256CD7193024F015CAE07380222","PreviousFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-1575.637647086995"}},"PreviousTxnID":"125948AC2628DF08CCACCAF518794FCE52CB5136E3C9197248853BE2BCB08132","PreviousTxnLgrSeq":16657925}},{"ModifiedNode":{"FinalFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-0.860883360914644"},"Flags":2228224,"HighLimit":{"currency":"USD","issuer":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","value":"1000000000"},"HighNode":"0","LowLimit":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"0"},"LowNode":"372"},"LedgerEntryType":"RippleState","LedgerIndex":"67F3EB1AC9089489308E69850D09A8E283B029DB89C6480F809CAEF68EBF6A28","PreviousFields":{"Balance":{"currency":"USD","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-1"}},"PreviousTxnID":"2E7E840304C193726CC0571DAA860ABDDE66B6070775F8CACF2721E4555C7FCF","PreviousTxnLgrSeq":16658947}},{"ModifiedNode":{"FinalFields":{"Account":"rEiH1zXBtkBkv84tY5wBnH7uzYWQWTenV1","BookDirectory":"DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4C10711C28097191","BookNode":"0","Flags":131072,"OwnerNode":"2289","Sequence":649645,"TakerGets":"26038393931","TakerPays":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"120.5047854577931"}},"LedgerEntryType":"Offer","LedgerIndex":"A4D740FFAE28E4C34D1F1FDC0056EBF410B27D3CC70952BC15B3B9E28B30D0FE","PreviousFields":{"TakerGets":"26068393931","TakerPays":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"120.6436244189561"}},"PreviousTxnID":"90DB9249090D8E38964DAFBCDEBDC65F4770429ED715D7150B76BD228B99835C","PreviousTxnLgrSeq":16658935}},{"ModifiedNode":{"FinalFields":{"Account":"rEiH1zXBtkBkv84tY5wBnH7uzYWQWTenV1","Balance":"99318297626","Flags":0,"OwnerCount":247,"Sequence":649655},"LedgerEntryType":"AccountRoot","LedgerIndex":"D6D5EDAC30274DE099B0013732CB253AB16D8A6A563666B82A52F93F2A297A50","PreviousFields":{"Balance":"99348297626"},"PreviousTxnID":"860B85BFE364A3F1D3FCB10003F152620F5CCBA9AE5392D7B4A568CCD80CF2FC","PreviousTxnLgrSeq":16658938}},{"ModifiedNode":{"FinalFields":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Balance":"60964000","Flags":0,"OwnerCount":2,"Sequence":4},"LedgerEntryType":"AccountRoot","LedgerIndex":"EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA","PreviousFields":{"Balance":"30976000","Sequence":3},"PreviousTxnID":"F35F8BD3C0BF97FE20BB4698031D61FA122809498491BEE68C44E8F5464F88B1","PreviousTxnLgrSeq":16658797}}],"TransactionIndex":1,"TransactionResult":"tesSUCCESS","delivered_amount":"30000000"},"tx":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Amount":"30000000","Destination":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Fee":"12000","Flags":0,"LastLedgerSequence":16659002,"Memos":[{"Memo":{"MemoData":"7274312E352E342D35302D6762616536396263","MemoFormat":"746578742F706C61696E","MemoType":"636C69656E74"}}],"Paths":[[{"currency":"XRP","type":16}],[{"account":"rP5ShE8dGBH6hHtNvRESdMceen36XFBQmh","type":1},{"currency":"XRP","type":16}]],"SendMax":{"currency":"USD","issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B","value":"0.1392557557244418"},"Sequence":3,"SigningPubKey":"036C288D95A4268D268F8CAFC262FC77EB7265535805B760BD8A0E544C1C5740A7","TransactionType":"Payment","TxnSignature":"304402205503A3D932FA519335D4613FA551550C7D886EC1B68E7AD198947BDE8FB3FCA20220262121A1DBE9FB0C56B9ACBA9B383F056C8040E0C043C9505DD23E1150B18B32","date":498985950,"hash":"5252FE36681D56CB1218B34BBF7509C4B8008D45C0FE31A4168A83E87478B877","inLedger":16659000,"ledger_index":16659000},"validated":true}]'
      );
    });

    it("finds the fist send tranaction with counterparty", async function () {
      this.timeout(15000);
      const address = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
      const result: any = await Client.findTransactions(address, {
        limit: 10,
        destinationTag: 119954610,
        timeout: 14000,
      });

      expect(JSON.stringify(result)).to.eq(
        '[{"meta":{"AffectedNodes":[{"ModifiedNode":{"FinalFields":{"Account":"rnNmQfX7sPJXQvdmp4Yyf8FWyBztRUWSxD","Balance":"376039648","Domain":"726E6E6D7166783773706A787176646D703479796638667779627A74727577737864","EmailHash":"ED4D15C58CE6A3F2B7D588262539F0F7","Flags":131072,"MessageKey":"0200000000000000000000000089720CB142C927967259164AC021E3CF97797C22","OwnerCount":181,"RegularKey":"rHXuEaRYnnJHbDeuBH5w8yPh5uwNVh5zAg","Sequence":63075335},"LedgerEntryType":"AccountRoot","LedgerIndex":"A5F2D2DB2EA20C47D5D467AEF46B08BE6AD286AFB499FC3ECCA4C57EB231E809","PreviousFields":{"Balance":"386039660","Sequence":63075334},"PreviousTxnID":"537D4E39DDB30A9EB3B73E2A9A57C74ED13ACE285DFA6B37B28C99249383E59B","PreviousTxnLgrSeq":67884682}},{"ModifiedNode":{"FinalFields":{"Account":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","Balance":"114998986","Domain":"626974686F6D702E636F6D","EmailHash":"576EDA7E0D04BC218DAA8A501FCA50B6","Flags":8388608,"MessageKey":"02000000000000000000000000800EDED12FE3414978DE62F6B852562E7CA0D8BE","OwnerCount":6,"Sequence":331,"TransferRate":1002000000},"LedgerEntryType":"AccountRoot","LedgerIndex":"EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA","PreviousFields":{"Balance":"104998986"},"PreviousTxnID":"E7246CDAD5FED09E0CFA4315EF0054603F2A6174E3A6EF6728EFF7C56BE6D0EB","PreviousTxnLgrSeq":67884596}}],"TransactionIndex":57,"TransactionResult":"tesSUCCESS","delivered_amount":"10000000"},"tx":{"Account":"rnNmQfX7sPJXQvdmp4Yyf8FWyBztRUWSxD","Amount":"10000000","Destination":"rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z","DestinationTag":119954610,"Fee":"12","Flags":2147483648,"Sequence":63075334,"SigningPubKey":"0332F0084A80559814BA7A667A380D7CE5BFD945257ABEE5E078AC240EBFC0704B","TransactionType":"Payment","TxnSignature":"304402203B5DEE925481EBA0B285DF1B6BD8D3CEBB8800DFAF095CC3DB355E4A01E0A18502200FE0961E2D4CAE8811C1EEF101F8BEBED19D466F6A5B35212BB2D11EB2EA9A15","date":690981391,"hash":"2D842E818BD8BD00A8D9B1916132A67C8D90A8D0482E18929EAF6038EAF61227","inLedger":67885234,"ledger_index":67885234},"validated":true}]'
      );
    });
  });
});
