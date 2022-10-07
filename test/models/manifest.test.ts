import { expect } from "chai";
import { Models } from "../../src/index";

describe("Models", () => {
  describe("decodeManifest", () => {
    it("returns decoded validator manifest", function () {
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

    it("returns decoded vl manifest", function () {
      const result: any = Models.decodeManifest(
        "JAAAAAFxIe1F0YQO5yS+Mnq+kUZQPVhI79Xzi21f7ecegKzOXm5zi3Mh7RiCXiUBmFIhZUbZfHHGCftCtcsPeSU01cwAt0hkhs0UdkAQnI9+pUYXskMF1Er1SPrem9zMEOxDx24aS+88WIgXpslXVyRPehFwtnTTb+LwUx7yUXoH3h31Qkruu2RZG70NcBJAy3pkPr9jhqyPvB7T4Nz8j/MjEaNa9ohMLztonxAAZDpcB+zX8QVvQ4GUiAePLCKF/fqTKfhUkSfobozPOi/bCQ=="
      );

      expect(result).to.eql({
        Sequence: 1,
        PublicKey: "ED45D1840EE724BE327ABE9146503D5848EFD5F38B6D5FEDE71E80ACCE5E6E738B",
        SigningPubKey: "ED18825E25019852216546D97C71C609FB42B5CB0F792534D5CC00B7486486CD14",
        Signature:
          "109C8F7EA54617B24305D44AF548FADE9BDCCC10EC43C76E1A4BEF3C588817A6C95757244F7A1170B674D36FE2F0531EF2517A07DE1DF5424AEEBB64591BBD0D",
        MasterSignature:
          "CB7A643EBF6386AC8FBC1ED3E0DCFC8FF32311A35AF6884C2F3B689F1000643A5C07ECD7F1056F43819488078F2C2285FDFA9329F8549127E86E8CCF3A2FDB09",
        publicKey: "nHBtBkHGfL4NpB54H1AwBaaSJkSJLUSPvnUNAcuNpuffYB51VjH6",
        address: "r4BYAeQvWjU9Bh2yod8WgRDmmNH2G1pybo",
        signingPubKey: "nHBYNPHW6LJGzHF8AynFg4TdVD9M9wo5YSf7ybgf8Gobu42GHxbd",
      });
    });
  });

  describe("parseManifest", () => {
    it("returns decoded validator manifest", function () {
      const result: any = Models.parseManifest(
        "JAAAAAJxIe04sCiOokC0zewYoaYonrSQB+TrwN6USAPrfvFBxWZAc3MhApE5F7aO65JKkSfp6UMynIak8MduYSOzo6KXLvQEjlBwdkYwRAIgKm2A11A2M4FqzEW+vroUyTbHSpkjd3elQ/N0sQThw0sCIBKlX033kXdaiJ54l7SiBoQnwHnSaQfT4by00YncKWzVdwtiaXRob21wLmNvbXASQAsl/ShkQ4RE7arvTowD84sOPhizCQlH3IzqvaC7/52WL92FzH4s2MRzssIBUCwEh4jNArcxFy/gA+MO24QQ1g8=",
        "ED38B0288EA240B4CDEC18A1A6289EB49007E4EBC0DE944803EB7EF141C5664073"
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
        verifyFields: Buffer.from([
          77, 65, 78, 0, 36, 0, 0, 0, 2, 113, 33, 237, 56, 176, 40, 142, 162, 64, 180, 205, 236, 24, 161, 166, 40, 158,
          180, 144, 7, 228, 235, 192, 222, 148, 72, 3, 235, 126, 241, 65, 197, 102, 64, 115, 115, 33, 2, 145, 57, 23,
          182, 142, 235, 146, 74, 145, 39, 233, 233, 67, 50, 156, 134, 164, 240, 199, 110, 97, 35, 179, 163, 162, 151,
          46, 244, 4, 142, 80, 112, 119, 11, 98, 105, 116, 104, 111, 109, 112, 46, 99, 111, 109,
        ]),
      });
    });

    it("returns decoded validator manifest with incorrect publicKey", function () {
      const result: any = Models.parseManifest(
        "JAAAAAJxIe04sCiOokC0zewYoaYonrSQB+TrwN6USAPrfvFBxWZAc3MhApE5F7aO65JKkSfp6UMynIak8MduYSOzo6KXLvQEjlBwdkYwRAIgKm2A11A2M4FqzEW+vroUyTbHSpkjd3elQ/N0sQThw0sCIBKlX033kXdaiJ54l7SiBoQnwHnSaQfT4by00YncKWzVdwtiaXRob21wLmNvbXASQAsl/ShkQ4RE7arvTowD84sOPhizCQlH3IzqvaC7/52WL92FzH4s2MRzssIBUCwEh4jNArcxFy/gA+MO24QQ1g8=",
        "ED45D1840EE724BE327ABE9146503D5848EFD5F38B6D5FEDE71E80ACCE5E6E738B"
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
        verifyFields: Buffer.from([
          77, 65, 78, 0, 36, 0, 0, 0, 2, 113, 33, 237, 56, 176, 40, 142, 162, 64, 180, 205, 236, 24, 161, 166, 40, 158,
          180, 144, 7, 228, 235, 192, 222, 148, 72, 3, 235, 126, 241, 65, 197, 102, 64, 115, 115, 33, 2, 145, 57, 23,
          182, 142, 235, 146, 74, 145, 39, 233, 233, 67, 50, 156, 134, 164, 240, 199, 110, 97, 35, 179, 163, 162, 151,
          46, 244, 4, 142, 80, 112, 119, 11, 98, 105, 116, 104, 111, 109, 112, 46, 99, 111, 109,
        ]),
        error: "Master signature does not match",
      });
    });

    it("returns true for valid manifest", function () {
      const result: any = Models.parseManifest(
        "JAAAAAFxIe1F0YQO5yS+Mnq+kUZQPVhI79Xzi21f7ecegKzOXm5zi3Mh7RiCXiUBmFIhZUbZfHHGCftCtcsPeSU01cwAt0hkhs0UdkAQnI9+pUYXskMF1Er1SPrem9zMEOxDx24aS+88WIgXpslXVyRPehFwtnTTb+LwUx7yUXoH3h31Qkruu2RZG70NcBJAy3pkPr9jhqyPvB7T4Nz8j/MjEaNa9ohMLztonxAAZDpcB+zX8QVvQ4GUiAePLCKF/fqTKfhUkSfobozPOi/bCQ==",
        "ED45D1840EE724BE327ABE9146503D5848EFD5F38B6D5FEDE71E80ACCE5E6E738B"
      );

      expect(result).to.eql({
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
        verifyFields: Buffer.from([
          77, 65, 78, 0, 36, 0, 0, 0, 1, 113, 33, 237, 69, 209, 132, 14, 231, 36, 190, 50, 122, 190, 145, 70, 80, 61,
          88, 72, 239, 213, 243, 139, 109, 95, 237, 231, 30, 128, 172, 206, 94, 110, 115, 139, 115, 33, 237, 24, 130,
          94, 37, 1, 152, 82, 33, 101, 70, 217, 124, 113, 198, 9, 251, 66, 181, 203, 15, 121, 37, 52, 213, 204, 0, 183,
          72, 100, 134, 205, 20,
        ]),
      });
    });
  });

  describe("generateManifest", function () {
    it("returns a manifest", function () {
      // const ephimeralSecrets = Validator.generateSecrets();
      const ephimeralSecrets = {
        key_type: "ed25519",
        secret_key: "pncRK5E6tyFQwTXaUpXKZkSkBwuJ1EEBDcbwMBJyAVTeDZUmR7u",
        public_key: "nHUa1qqv3ih232B26LCEnS9kQ89Ab8A6jwWy5ARGztUfnej3fcBg",
        PublicKey: "ED62A2B6119230C074AD9E3F942316A1B4B0AAF00ADCDB1714609CB964BEA1EED2",
      };

      // const masterSecrets = Validator.generateSecrets();
      const masterSecrets = {
        key_type: "ed25519",
        secret_key: "pncRK5E6tyFQwTXaUpXKZkSkBwuJ1EEBDcbwMBJyAVTeDZUmR7u",
        public_key: "nHUa1qqv3ih232B26LCEnS9kQ89Ab8A6jwWy5ARGztUfnej3fcBg",
        PublicKey: "ED62A2B6119230C074AD9E3F942316A1B4B0AAF00ADCDB1714609CB964BEA1EED2",
      };

      const manifest = Models.generateManifest({
        Sequence: 6525995,
        PublicKey: masterSecrets.PublicKey,
        SigningPubKey: ephimeralSecrets.PublicKey,
        SigningPrivateKey: ephimeralSecrets.secret_key,
        MasterPrivateKey: masterSecrets.secret_key,
      });

      const result: any = Models.parseManifest(manifest, masterSecrets.PublicKey);

      expect(result.Sequence).to.eql(6525995);
      expect(result.publicKey).to.eql(masterSecrets.public_key);
      expect(result.error).to.eql(undefined);
    });

    it("returns a manifest with Domain", function () {
      // const ephimeralSecrets = Validator.generateSecrets();
      const ephimeralSecrets = {
        key_type: "ed25519",
        secret_key: "pncRK5E6tyFQwTXaUpXKZkSkBwuJ1EEBDcbwMBJyAVTeDZUmR7u",
        public_key: "nHUa1qqv3ih232B26LCEnS9kQ89Ab8A6jwWy5ARGztUfnej3fcBg",
        PublicKey: "ED62A2B6119230C074AD9E3F942316A1B4B0AAF00ADCDB1714609CB964BEA1EED2",
      };

      // const masterSecrets = Validator.generateSecrets();
      const masterSecrets = {
        key_type: "ed25519",
        secret_key: "pncRK5E6tyFQwTXaUpXKZkSkBwuJ1EEBDcbwMBJyAVTeDZUmR7u",
        public_key: "nHUa1qqv3ih232B26LCEnS9kQ89Ab8A6jwWy5ARGztUfnej3fcBg",
        PublicKey: "ED62A2B6119230C074AD9E3F942316A1B4B0AAF00ADCDB1714609CB964BEA1EED2",
      };

      const manifest = Models.generateManifest({
        Sequence: 6525995,
        PublicKey: masterSecrets.PublicKey,
        SigningPubKey: ephimeralSecrets.PublicKey,
        Domain: Buffer.from("bithomp.com", "utf8").toString("hex"),
        SigningPrivateKey: ephimeralSecrets.secret_key,
        MasterPrivateKey: masterSecrets.secret_key,
      });

      const result: any = Models.parseManifest(manifest, masterSecrets.PublicKey);

      expect(result.Sequence).to.eql(6525995);
      expect(result.publicKey).to.eql(masterSecrets.public_key);
      expect(result.domain).to.eql("bithomp.com");
      expect(result.error).to.eql(undefined);
    });
  });
});
