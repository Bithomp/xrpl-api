import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("mainnet", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:mainnet"));
      await Client.connect();
    });

    describe("getLedger", () => {
      it("current", async function () {
        const result: any = await Client.getLedger();

        delete result.warnings;
        delete result._nodepref;
        expect(Object.keys(result)).to.eql(["ledger", "ledger_hash", "ledger_index", "validated"]);
        expect(Object.keys(result.ledger)).to.eql([
          "accepted",
          "account_hash",
          "close_flags",
          "close_time",
          "close_time_human",
          "close_time_resolution",
          "closed",
          "hash",
          "ledger_hash",
          "ledger_index",
          "parent_close_time",
          "parent_hash",
          "seqNum",
          "totalCoins",
          "total_coins",
          "transaction_hash",
        ]);
      });

      it("current with legacy", async function () {
        const result: any = await Client.getLedger({ legacy: true });

        expect(Object.keys(result)).to.eql([
          "stateHash",
          "closeTime",
          "closeTimeResolution",
          "closeFlags",
          "ledgerHash",
          "ledgerVersion",
          "parentLedgerHash",
          "parentCloseTime",
          "totalDrops",
          "transactionHash",
        ]);
      });

      it("by ledger_index", async function () {
        const result: any = await Client.getLedger({
          ledgerIndex: 66816622,
        });

        expect(result.ledger.ledger_hash).to.eql("E5C1E68EED45C6A72B9BA777AC9BA08F3D34C23D42B52B19276C3E2F5E9E1EFC");
        expect(result.ledger.transactions).to.eql(undefined);
      });

      it("by non existent ledger_index", async function () {
        const result: any = await Client.getLedger({
          ledgerIndex: 1,
        });

        expect(result).to.eql({
          error: "lgrNotFound",
          error_code: 21,
          error_message: "ledgerNotFound",
          status: "error",
          validated: undefined,
        });
      });

      it("with transactions", async function () {
        const result: any = await Client.getLedger({
          ledgerIndex: 66816622,
          transactions: true,
        });

        expect(result.ledger.transactions.sort()).to.eql([
          "05403FE48CCFCB45888FB3FDA0A791B0B3AA29360050412B95FCA436E1A41DCF",
          "06407D0F22834E0F3E0BF4F4C2FEDC4E5AD86EE61B2AA55DC77BB2C62AFE5DEA",
          "06B0E4C65F19EAF06D54CE89C5664D166B01FAA1D5697CF324B730432F3EA179",
          "0B87AFAE8C731DA5EEBD3B43B9D8DCB0D144221B5F3C763310389A458A3DF9E6",
          "1288B70302888CBA7791442F99C5BF79F8AB689CBFB7186C80434BB682BCAA15",
          "1FD5B7FEB1057CC1030881D3554A0B35AB9B36CFC45453E17B4108620A0FE439",
          "22941BDE524CC1C3D1729FD9631146E9C34C4A41CECF48E77837F3336A8D6250",
          "24601EC767D5EF78F38188B00A62FD90DB03C78A21B8304837A0C79D0F283F9D",
          "27610DF2F5AC47B6D997B8F6CBECF8DDEC575CF91582A0B84B4D07D1353BFE45",
          "2A4B0FF29BD7F848C329F762CC8F443C66EA4A8F4E0CF903C27073CC2E52802D",
          "2AB2561960428B2DC7890BDD86A50DA5F98414DDAA299419687A975167F6445B",
          "41770E75903B6D4387AECCA363624190C18EFEF3BA1FC8CF9B8214A45690CF21",
          "47EF277F77E83115FFDFA2552B51A452182B967195BFA6ADF2819FB56F3759AD",
          "480834CEF035226E64C2799B05E4DA00614627882639ACCCD4E3AC89A8E5CE43",
          "48AED6EE02A3985E520E6A07D4D90A13270135940673AA2FD9F134FB8DB563C4",
          "49A0FDDB2A1EF726CC226574010A02694217179FC6FFF5355767E115856E9F07",
          "4DAD10AA7C400994800B4A15DFDEB2AE1FA2C0EFA4E9B3E3D1E45E11E83FF8E6",
          "4F42C9BE3303F70C54860BF77B25F4F34E19CC68FEC20910D6C1EC15ABE3BE83",
          "519E811DF93541AE715E9A183134AC7299F763E55396F37EAB5662D237173AD7",
          "59135DF751D6A2E7600E751324320BBC053A6B2CEEDB707374DC0741BBD04ABD",
          "5CC90E04DCE3F5C03E997681677FC287AA698146736D33C0D11C686F416DB5EB",
          "5F69747617630649BF5CAD66C4345E2903938EBBDCEA7B69394C0E8CD7C520F4",
          "66F80E1F7374AB027BDE499E4F6669B51E3FAE0D8D7A92D70954D1BBD561ECB6",
          "678AC376548A54FAEC39621EB450018A8D14D250FE378F640E725CD986C712B4",
          "6E0DC8C26C409878324CEEF6E707AD948FABAA0C65974E9D49CF82617953A311",
          "76072CC117A7E1E7AAA936EE09E39BF5D3DFFD369895160560AF7A73F0789166",
          "767567A341CE9DF0D1DAA2600B8ABB5AEB4F77C448F5945390DDE4DA68125D87",
          "77E92A0B7D72F5646F69616133E643C3EE57C5A37465F48014EE8003C4469533",
          "7D82FEFCFCFED41E09AF076F37809B4CBF93452E0C2EBB2539EF9EC50D565407",
          "7F0EFB10274A562FB1C6BF39266A297A1BB3A4556668A37332108B23E44AEFCD",
          "808466BD6F61F27A7B5D23A8EAC08B16540C903320CE55F22452B007F6103A2B",
          "890E090D78E5128225FB2691CBA6AA875D39E6D5C58521185008D0A17B2B53D6",
          "8A7DB81721D2A50E55D548A5562E5103002754478207383AA5C8E9219D3DF61B",
          "8DF66ADCA76FE91DB90D7EDD6A6624D03BE856C0887EACEA65BB4FA8BD2B0C4C",
          "95A86D7BB4638EA5BB12BEE1BE4A166311A34ACFB52430A4358BA1857886643C",
          "9713D3803957303380BA008F1F46DB1D1AA9FE2CFC082723ACADA20B4FF7AAFD",
          "97828077A9FC2EB925AB8E046EBE9C731965C80F0A1DB1F0869471BC0D2A92FF",
          "98F232260F2BF605FF850C0A2F3A58899AC59DC0F1F7F1A1B8F0C0536184927C",
          "9CF8FE507A50F07C15A85B31681528C5B0DC99C19674A5048EFABC4AFA56DDCD",
          "9F4CFD6F212B0D48D58EFB917536B910FD676B2BD2A79137916AFB7FD0A9968F",
          "B3F3DD765E8E023E22CADF8A0BF43551C9539B6ACF950E4FE577DE9578F4FBEE",
          "C0F6CE3E02A56A3B29E581F95A5AFC7E1082E8E0F2D6D99B594B471A40E9F8E7",
          "C56C3981978FE186051BFCF3F39759C7A1E4FA7D9DCAE9BA9265DC36F1B234E1",
          "C80EED5CBF96DCAC3DA514D9A6D5AD20BDAD7C95839114D25709A5189025B08B",
          "C960A6FB3B5144C970DC29B2DD6FE234701AEF6CF167D240609B0206C921B03E",
          "CAE18D81BEA5826EA8C92DDD320942E9A52AC677390BD765E9A6F2FEC71D86B8",
          "CD6B6FAEAB9163F3D8D3A2F8883A8E2BE3F76CA5CECCA4BFBEC83EE8A2067EB8",
          "D6AA409EDA98432743AE404ADE9FEEB84C4ABB02A77DC9CA9354B1479F874CF6",
          "D77AA943BDF964096F176E6131B6BBF92006984E5D2E8B999D65CFF6BDC73001",
          "D95C7A76A78AB88F03B4EE679AD1A3D09F36398DE7C59DB614C47F0AB4E12311",
          "DFD4BABBEEC8CDA9E9C9BBFC531AFBFC737F09CF4526B9202B7CDD114A504776",
          "E22545329B809B1158660B70404952287A53B4E93053980F36AB3BDA2F2FCC10",
          "E49A82C7C1A8E5D9003B203BAD8F605C764458673B8090A78B422FB46BA0BA60",
          "E71FF2492D521177245D935AAB25B31E2181A28A33CB0C181CF88259D21B9051",
          "E8C04AF5E13C40D0B1F814289F43E68B0B2907488569470D4AFF117AE5E057F2",
          "EBA6F0AB90CCA69BB96B01AEABDC505DA99695C6A5587B7B13E1ADD986599D29",
        ]);
      });

      it("with expand", async function () {
        const result: any = await Client.getLedger({
          ledgerIndex: 66816622,
          transactions: true,
          expand: true,
        });

        const transactions: any = result.ledger.transactions.sort((a: any, b: any) => a.hash.localeCompare(b.hash));
        expect(transactions[0].hash).to.eql("05403FE48CCFCB45888FB3FDA0A791B0B3AA29360050412B95FCA436E1A41DCF");
      });

      it("with expand and legacy", async function () {
        const result: any = await Client.getLedger({
          ledgerIndex: 66816622,
          transactions: true,
          expand: true,
          legacy: true,
          includeRawTransactions: true,
        });

        const transactions: any = result.transactions.sort((a: any, b: any) => a.id.localeCompare(b.id));
        expect(transactions[0].id).to.eql("05403FE48CCFCB45888FB3FDA0A791B0B3AA29360050412B95FCA436E1A41DCF");
      });
    });
  });
});
