import { expect } from "chai";
import { Models } from "../../src/index";

describe("Models", () => {
  describe("decodeManifest", () => {
    it("returns account lines", function () {
      const result: any = Models.decodeManifest(
        "JAAAAAJxIe04sCiOokC0zewYoaYonrSQB+TrwN6USAPrfvFBxWZAc3MhApE5F7aO65JKkSfp6UMynIak8MduYSOzo6KXLvQEjlBwdkYwRAIgKm2A11A2M4FqzEW+vroUyTbHSpkjd3elQ/N0sQThw0sCIBKlX033kXdaiJ54l7SiBoQnwHnSaQfT4by00YncKWzVdwtiaXRob21wLmNvbXASQAsl/ShkQ4RE7arvTowD84sOPhizCQlH3IzqvaC7/52WL92FzH4s2MRzssIBUCwEh4jNArcxFy/gA+MO24QQ1g8="
      );

      expect(result).to.eql({
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
      });
    });
  });
});
