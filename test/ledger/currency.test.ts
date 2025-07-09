import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";
import { sleep } from "../../src/common/utils";

describe("Client", () => {
  describe("mainnet", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:mainnet"), { loadBalancing: true, nativeCurrency: "XRP" });
      await Client.connect();
    });

    describe("parseCurrencyInformation", () => {
      describe("when invalid", () => {
        it("is null for empty string", async function () {
          expect(await Client.parseCurrencyInformation("")).to.eql(null);
        });

        it("is null for null", async function () {
          expect(await Client.parseCurrencyInformation(null)).to.eql(null);
        });

        it("is null for undefined", async function () {
          expect(await Client.parseCurrencyInformation(undefined)).to.eql(null);
        });

        it("is null for {}", async function () {
          expect(await Client.parseCurrencyInformation({})).to.eql(null);
        });
      });

      describe("when simple", () => {
        it("is OK for USD", async function () {
          expect(await Client.parseCurrencyInformation("USD")).to.eql({
            currencyCode: "USD",
            currency: "USD",
            type: "simple",
          });
        });

        it("is not OK for XRP", async function () {
          expect(await Client.parseCurrencyInformation("XRP")).to.eql(null);
        });

        it("is not OK for XRp", async function () {
          expect(await Client.parseCurrencyInformation("XRp")).to.eql(null);
        });
      });

      describe("when HEX", () => {
        it("is OK for string HADALITE", async function () {
          expect(await Client.parseCurrencyInformation("484144414C495445000000000000000000000000")).to.eql({
            currencyCode: "484144414C495445000000000000000000000000",
            currency: "HADALITE",
            type: "hex",
          });
        });

        it("is OK for emoji $Dboyfriend🔥", async function () {
          expect(await Client.parseCurrencyInformation("2444626F79667269656E64F09F94A50000000000")).to.eql({
            currencyCode: "2444626F79667269656E64F09F94A50000000000",
            currency: "$Dboyfriend🔥",
            type: "hex",
          });
        });

        it("is OK for name with dots D.O.G.E.", async function () {
          expect(await Client.parseCurrencyInformation("442E4F2E472E452E000000000000000000000000")).to.eql({
            currencyCode: "442E4F2E472E452E000000000000000000000000",
            currency: "D.O.G.E.",
            type: "hex",
          });
        });

        it("is OK for (O_o)", async function () {
          expect(await Client.parseCurrencyInformation("02930015040A13E900000000000000284F5F6F29")).to.eql({
            currencyCode: "02930015040A13E900000000000000284F5F6F29",
            currency: "(O_o)",
            type: "hex",
          });
        });

        it("is OK for <%<<<<<<<<<<<<<<<>>>", async function () {
          expect(await Client.parseCurrencyInformation("3C253C3C3C3C3C3C3C3C3C3C3C3C3C3C3C3E3E3E")).to.eql({
            currencyCode: "3C253C3C3C3C3C3C3C3C3C3C3C3C3C3C3C3E3E3E",
            currency: "<%<<<<<<<<<<<<<<<>>>",
            type: "hex",
          });
        });

        it("is null for not hex", async function () {
          expect(await Client.parseCurrencyInformation("E5F5829DB36F0DAB19F03114B7876A6B7FB38990")).to.be.null;
        });
      });

      describe("when LP Token", () => {
        it("is OK", async function () {
          expect(await Client.parseCurrencyInformation("037FEC3ED56671877B6A0EA59C6FFACCA0C88CDF")).to.eql({
            currencyCode: "037FEC3ED56671877B6A0EA59C6FFACCA0C88CDF",
            currency: "LP Token",
            type: "lp_token",
          });
        });
      });

      describe("when NFT", () => {
        it("is OK for Plasticats", async function () {
          this.timeout(15000);
          expect(await Client.parseCurrencyInformation("02C7002303B3C3D2506C61737469636174730000")).to.eql({
            type: "nft",
            currencyCode: "02C7002303B3C3D2506C61737469636174730000",
            currency: "Plasticats",
            cti: 56013670751388626,
            ctiLedger: 62112722,
            ctiTxIndex: 35,
            ctiValid: true,
            ctiVerified: true,
            timestamp: 1615386870,
            ctiTx: {
              hash: "7DFCD417FCEE35F7BB3ABECD05C27BA71F1E845BFD29C19AF3CF5E55B44EA55C",
              type: "payment",
              account: "rBzoA1EXxE2FeGV4Z57pMGRuzd3dfKxVUt",
              destination: "rp9d3gds8bY7hkP8FmNqJZ1meMtYLtyPoz",
              memos: [
                {
                  Memo: {
                    MemoData:
                      "697066733A2F2F62616679626569666C6A667870786F7A6E6A703273357266697270666A756E7876706B71737863727133766C626F6C346536717A376F7972693571",
                    MemoFormat: "746578742F757269",
                    MemoType: "7872706C2F6E6674",
                  },
                },
              ],
            },
          });
        });

        it("is OK for xLogo01", async function () {
          this.timeout(15000);
          expect(await Client.parseCurrencyInformation("023A001F040251790000000000784C6F676F3031")).to.eql({
            type: "nft",
            currencyCode: "023A001F040251790000000000784C6F676F3031",
            currency: "xLogo01",
            cti: 16325681860465016,
            ctiLedger: 67260793,
            ctiTxIndex: 31,
            ctiValid: true,
            ctiVerified: true,
            timestamp: 1635160501,
            ctiTx: {
              hash: "A089A7959F9A41880F4EA593397F9596411F5440262F6CAD3AD185CD5CFD4145",
              type: "payment",
              account: "rNYz5LwCTfVgknuj3C68FTjdCoJfbkPsY9",
              destination: "rMp1zbKWYiSVJ535tLjV9B1PaHyXiS5TxU",
              memos: [
                {
                  Memo: {
                    MemoData:
                      "546865204469676974616C20417274776F726B205C224654534F2E455520784C6F676F30315C2220776173206372656174656420627920436C61756469612043696D61676C696120666F72204654534F2E45552E204E4654206D696E746564206F6E20746865205852504C2062792041657374686574657320532E522E4C2E202D204D696C616E2E20546865206F776E6572206F6620746865204E4654206973737565722061646472657373205C22724E597A354C7743546656676B6E756A3343363846546A64436F4A66626B507359395C2220697320616C736F20746865206F776E6572206F66207468652072656C61746564204469676974616C20417274776F726B205C224654534F2E455520784C6F676F30315C222E",
                    MemoFormat: "746578742F706C61696E",
                    MemoType: "4465736372697074696F6E",
                  },
                },
                {
                  Memo: {
                    MemoData: "436C61756469612043696D61676C6961",
                    MemoFormat: "746578742F706C61696E",
                    MemoType: "417574686F72",
                  },
                },
                {
                  Memo: {
                    MemoData:
                      "686173683A516D61364C3477474E786B5367475A66415A6F546A457339346A514B4C7A31324338486966523541536D43554135",
                    MemoFormat: "746578742F757269",
                    MemoType: "5072696D617279557269",
                  },
                },
              ],
            },
          });
        });

        it("is OK for An XRPL NFT?", async function () {
          this.timeout(15000);
          expect(await Client.parseCurrencyInformation("021D001703B37004416E205852504C204E46543F")).to.eql({
            type: "nft",
            currencyCode: "021D001703B37004416E205852504C204E46543F",
            currency: "An XRPL NFT?",
            cti: 8162873170948100,
            ctiLedger: 62091268,
            ctiTxIndex: 23,
            ctiValid: true,
            ctiVerified: true,
            timestamp: 1615303952,
            ctiTx: {
              hash: "D55976EF95C9B93C99E08F6F1F17252B4C65359143125CA7E791C5C3352FF04D",
              type: "settings",
              account: "richard43NZXStHcjJi2UB8LGDQGFLKNs",
              memos: [
                {
                  Memo: {
                    MemoData:
                      "646174613A696D6167652F706E673B6261736536342C6956424F5277304B47676F414141414E5355684555674141414445414141416D42414D41414143665957344D414141414656424D5645587777447268724471525443504A6A54464658537034657954425A522F75512B38384141414263306C4551565234415758537435496A4D517745554B44577845437864764E6A53524D4C68394B6B61786E4C38754B31382F2B666347774F5A61666C4B4434325A4B6D452F38627A5A475333494F546D3631775377495155706366594857452B7A7A745849544B5546504F2B4470526473626B543349657A656473524B4273682F556B615542704C32672F666A7067326F50634D4B57466D516F514F38727168616171385939776B4C455753365254436F736A3750357530644C6D47764E6F45504439445A6A615A39627576386A6F5A35766D39536A6F58786C316F4D6864574F7735794F636C4F32474D6A725374656A7249523775506E4B44654F565A45317845546A37452B544F4D4F5A68315137527677566D3268385265636D315934536861347768423837785A766251314A5A73696F484535525549426E79696833476155464C704F424E6C5467594963476C7658465458745A4F4E3751744855384D67326D525644716A694E5148376F6668553947424C476F6C71446235316F636D556E652B3351346935784C69344335746D67524956785A46377274767277753841367269726F534E7A73623372646A51525246546764795559565659565967686D77706C7676653958507A66646B334374397535704A5462557A55334F6B5A6F7638384C617151696C344B54302F77486D505268486D75427A6C7341414141415355564F524B35435949493D",
                    MemoFormat: "746578742F757269",
                    MemoType: "6E6674",
                  },
                },
              ],
            },
          });
        });

        it("is OK for not valid but verified", async function () {
          this.timeout(15000);
          expect(await Client.parseCurrencyInformation("02C7002303B3C2D2506C61737469636174730000")).to.eql({
            type: "nft",
            currencyCode: "02C7002303B3C2D2506C61737469636174730000",
            currency: "Plasticats",
            cti: 56013670751388370,
            ctiLedger: 62112466,
            ctiTxIndex: 35,
            ctiValid: false,
            ctiVerified: true,
            timestamp: 1615385880,
            ctiTx: {
              hash: "92F6908D293BC3EBDFFA384286AC6A5DC7CB8740DAFFFD8C18C27E054EC6C0D0",
              type: "order",
              account: "rQ3fNyLjbvcDaPNS4EAJY8aT9zR3uGk17c",
            },
          });
        });

        it("is OK for not valid but verified on not existed ledger", async function () {
          this.timeout(15000);
          expect(await Client.parseCurrencyInformation("023031516D6258454E4654000000000000000000")).to.eql({
            type: "nft",
            currencyCode: "023031516D6258454E4654000000000000000000",
            currency: "NFT",
            cti: 13565024679385156,
            ctiLedger: 1835161669,
            ctiTxIndex: 12625,
            ctiValid: false,
            ctiVerified: true,
            timestamp: undefined,
            ctiTx: {},
          });
        });
      });
    });
  });

  describe("xahau-test", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:test-xahau"), { loadBalancing: true, nativeCurrency: "XAH" });
      await Client.connect();
    });

    describe("parseCurrencyInformation", () => {
      describe("when invalid", () => {
        it("is null for empty string", async function () {
          expect(await Client.parseCurrencyInformation("")).to.eql(null);
        });

        it("is null for null", async function () {
          expect(await Client.parseCurrencyInformation(null)).to.eql(null);
        });

        it("is null for undefined", async function () {
          expect(await Client.parseCurrencyInformation(undefined)).to.eql(null);
        });

        it("is null for {}", async function () {
          expect(await Client.parseCurrencyInformation({})).to.eql(null);
        });
      });

      describe("when simple", () => {
        it("is OK for USD", async function () {
          expect(await Client.parseCurrencyInformation("USD")).to.eql({
            currencyCode: "USD",
            currency: "USD",
            type: "simple",
          });
        });

        it("is not OK for XAH", async function () {
          expect(await Client.parseCurrencyInformation("XAH")).to.eql(null);
        });

        it("is not OK for XAh", async function () {
          expect(await Client.parseCurrencyInformation("XAh")).to.eql(null);
        });
      });

      describe("when HEX", () => {
        it("is OK for HADALITE", async function () {
          expect(await Client.parseCurrencyInformation("484144414C495445000000000000000000000000")).to.eql({
            currencyCode: "484144414C495445000000000000000000000000",
            currency: "HADALITE",
            type: "hex",
          });
        });
      });

      describe("when NFT", () => {
        it("is OK for not valid but verified on not existed ledger", async function () {
          this.timeout(15000);
          expect(await Client.parseCurrencyInformation("023031516D6258454E4654000000000000000000")).to.eql({
            type: "nft",
            currencyCode: "023031516D6258454E4654000000000000000000",
            currency: "NFT",
            cti: 13565024679385156,
            ctiLedger: 1835161669,
            ctiTxIndex: 12625,
            ctiValid: false,
            ctiVerified: true,
            timestamp: undefined,
            ctiTx: {},
          });
        });
      });
    });
  });

  describe("disconnected", () => {
    before(async function () {
      Client.disconnect();
      await sleep(1000);
    });

    it("is OK for not valid but verified on not existed ledger", async function () {
      this.timeout(15000);
      expect(await Client.parseCurrencyInformation("02C7002303B3C2D2506C61737469636174730000")).to.eql({
        type: "nft",
        currencyCode: "02C7002303B3C2D2506C61737469636174730000",
        currency: "Plasticats",
        cti: 56013670751388370,
        ctiLedger: 62112466,
        ctiTxIndex: 35,
        ctiValid: false,
        ctiVerified: false,
        timestamp: undefined,
        ctiTx: {},
      });
    });
  });
});
