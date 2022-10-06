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

    it.only("returns true for valid manifest", function () {
      const result: any = Models.parseManifest(
        "JABjlCtxIe2JErIWsnLqfOICCREJ9Bw9hM88LDG6gyafMyXQYDZpXHMh7TMU3jVHtpEXkGqUh6y9sqm+Ua5ERpAX0QgMQyJu0mqZdkB16VcZm3Ax0G01pFI7+szsXDebc0myzsRVmJRpP7213hiOZux8+PYZ6P/qIeLNOtPy7B8Lr7JV1eDrclaHmeIOcBJA02QFnaovpq9tMai22OBa1nSFYGkx+ygw3Z/bH/TvUAAixiO6Cx5TOKJoK4RC4jBwVWy9V23Qro7N1YtXtScqCg==",
        "ED8912B216B272EA7CE202091109F41C3D84CF3C2C31BA83269F3325D06036695C"
      );

      expect(result).to.eql({
        Sequence: 6525995,
        PublicKey: "ED8912B216B272EA7CE202091109F41C3D84CF3C2C31BA83269F3325D06036695C",
        publicKey: "nHUPog9SxEAjjf3ykM9NmFDgddwgCZaB8qhwuSFBLPoBGggrBiso",
        address: "rGp7LX36Zm276s67f2WH7qtQQPy7BqbytU",
        SigningPubKey: "ED3314DE3547B69117906A9487ACBDB2A9BE51AE44469017D1080C43226ED26A99",
        signingPubKey: "nHBjA3xD1SgcY2A7UGwzVP7XsttGAmshvHYfUiiWjDNkGvLof2ci",
        Signature:
          "75E957199B7031D06D35A4523BFACCEC5C379B7349B2CEC4559894693FBDB5DE188E66EC7CF8F619E8FFEA21E2CD3AD3F2EC1F0BAFB255D5E0EB72568799E20E",
        MasterSignature:
          "D364059DAA2FA6AF6D31A8B6D8E05AD67485606931FB2830DD9FDB1FF4EF500022C623BA0B1E5338A2682B8442E23070556CBD576DD0AE8ECDD58B57B5272A0A",
        verifyFields: Buffer.from([
          77, 65, 78, 0, 36, 0, 99, 148, 43, 113, 33, 237, 137, 18, 178, 22, 178, 114, 234, 124, 226, 2, 9, 17, 9, 244,
          28, 61, 132, 207, 60, 44, 49, 186, 131, 38, 159, 51, 37, 208, 96, 54, 105, 92, 115, 33, 237, 51, 20, 222, 53,
          71, 182, 145, 23, 144, 106, 148, 135, 172, 189, 178, 169, 190, 81, 174, 68, 70, 144, 23, 209, 8, 12, 67, 34,
          110, 210, 106, 153,
        ]),
      });
    });
  });

  describe("generateManifest", function () {
    it("returns a manifest", function () {
      // Validator.generateSecrets();
      const ephimeralSecrets = {
        key_type: "ed25519",
        secret_key: "oXadBhoC44BXFxPWQGbfGKUxzwCnL4ziZpKJKLhANmr",
        public_key: "nHDh8LZnba7g8t2uysTdgoaA7D4Po81aW8pWQ1JXTqYkGqgtM33z",
        PublicKey: "EDE1932E768DCE5BE155E73E2E31541D36437675E1FD6FE48AB5B696B070D2EFD1",
      };

      // Validator.generateSecrets();
      const masterSecrets = {
        key_type: "ed25519",
        secret_key: "N5KQnKH9S8s8nQWX2rBgnCQMeCuhR8hy9m6h94WzWto2",
        public_key: "nHBxyvjbQ78F2PAa4pvKyz2UJbYBJTL7V6qtf7ARCFh3zsfVXusp",
        PublicKey: "ED50B57442C4C29C986E26BBD95CE7BFE33C6A4D5EB1C171FF482E69D83C96768B",
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

    it.only("returns a manifest", function () {
      // Validator.generateSecrets();
      const ephimeralSecrets = {
        key_type: "ed25519",
        secret_key: "oXadBhoC44BXFxPWQGbfGKUxzwCnL4ziZpKJKLhANmr",
        public_key: "nHDh8LZnba7g8t2uysTdgoaA7D4Po81aW8pWQ1JXTqYkGqgtM33z",
        PublicKey: "EDE1932E768DCE5BE155E73E2E31541D36437675E1FD6FE48AB5B696B070D2EFD1",
      };

      // Validator.generateSecrets();
      const masterSecrets = {
        key_type: "ed25519",
        secret_key: "N5KQnKH9S8s8nQWX2rBgnCQMeCuhR8hy9m6h94WzWto2",
        public_key: "nHBxyvjbQ78F2PAa4pvKyz2UJbYBJTL7V6qtf7ARCFh3zsfVXusp",
        PublicKey: "ED50B57442C4C29C986E26BBD95CE7BFE33C6A4D5EB1C171FF482E69D83C96768B",
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
