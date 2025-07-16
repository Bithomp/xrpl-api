import nconf from "nconf";
import { expect } from "chai";

import { Client } from "../../src/index";

describe("Client", () => {
  describe("xahau-test", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:test-xahau"), { nativeCurrency: "XAH" });
      await Client.connect();
    });

    describe("getLedgerEntry", () => {
      it("is OK", async function () {
        const result: any = await Client.getLedgerEntry(
          "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4"
        );

        expect(result.error).to.eq(undefined);
        expect(result.node.Amendments).to.be.an("array");
      });
    });

    describe("getLedgerEntryAmendments", () => {
      it("is OK", async function () {
        const result: any = await Client.getLedgerEntryAmendments();

        expect(result.error).to.eq(undefined);
        expect(result.Amendments).to.be.an("array");
      });
    });

    // xahau tests network was reset, so we skip this test
    describe.skip("getLedgerEntryURIToken", () => {
      it("is OK", async function () {
        const result: any = await Client.getLedgerEntryURIToken(
          "DB30404B34D1FEDCA500BD84F8A9AC77F18036A1E8966766BDE33595FC41CE57"
        );

        expect(result.error).to.eq(undefined);
        expect(result).to.be.eql({
          Flags: 0,
          Issuer: "r3Q5KufJdkQyaLvHD22fJFVSZCqq4GczyU",
          Owner: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
          URI: "68747470733A2F2F692E6B796D2D63646E2E636F6D2F656E74726965732F69636F6E732F6F726967696E616C2F3030302F3032372F3437352F53637265656E5F53686F745F323031382D31302D32355F61745F31312E30322E31355F414D2E706E67",
          URITokenID: "DB30404B34D1FEDCA500BD84F8A9AC77F18036A1E8966766BDE33595FC41CE57",
        });
      });

      it("is OK with Digest", async function () {
        const result: any = await Client.getLedgerEntryURIToken(
          "938DAD4FF50CBD38351A84BC03E07084D7CCE04F291298B6F095745F796C3CF4"
        );

        expect(result.error).to.eq(undefined);
        expect(result).to.be.eql({
          Digest: "5C34EA3F31F886765C5035F535E59FCF0BDA522F17B422CC737C142145E36DD0",
          Flags: 0,
          Issuer: "rwoR9uwgBU2zrBfrad5uVRfGmdvtVkMbPS",
          Owner: "rwoR9uwgBU2zrBfrad5uVRfGmdvtVkMbPS",
          URI: "68747470733A2F2F692E6B796D2D63646E2E636F6D2F656E74726965732F69636F6E732F6F726967696E616C2F3030302F3032372F3437352F53637265656E5F53686F745F323031382D31302D32355F61745F31312E30322E31355F414D2E706E67",
          URITokenID: "938DAD4FF50CBD38351A84BC03E07084D7CCE04F291298B6F095745F796C3CF4",
        });
      });

      it("is OK with Destination", async function () {
        const result: any = await Client.getLedgerEntryURIToken(
          "5F32B7CF20606DF5C89DCD18D76E058FBBDF2E5869622468AD0D843288E33ACB"
        );

        expect(result.error).to.eq(undefined);
        expect(result).to.be.eql({
          Flags: 0,
          Issuer: "rwoR9uwgBU2zrBfrad5uVRfGmdvtVkMbPS",
          Owner: "rwoR9uwgBU2zrBfrad5uVRfGmdvtVkMbPS",
          URI: "68747470733A2F2F692E6B796D2D63646E2E636F6D2F656E74726965732F69636F6E732F6F726967696E616C2F3030302F3032372F3437352F53637265656E5F53686F745F323031382D31302D32355F61745F31312E30322E31355F414D2E706E673F61",
          URITokenID: "5F32B7CF20606DF5C89DCD18D76E058FBBDF2E5869622468AD0D843288E33ACB",
          Amount: "0",
          Destination: "raPSFU999HcwpyRojdNh2i96T22gY9fgxL",
        });
      });
    });
  });
});
