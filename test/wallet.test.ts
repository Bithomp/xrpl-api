import nconf from "nconf";
import { Transaction } from "xrpl";
import { expect } from "chai";
import { Wallet } from "../src/index";

// import * as enums from ".node_modules/ripple-binary-codec/dist/enums/src/enums/definitions.json";
// https://github.com/Transia-RnD/xrpl.js/blob/3b234ec8ec1c677e0f3f534fd2985c985871c87e/packages/ripple-binary-codec/src/enums/definitions.json
import * as xahauEnums from "../config/xahau_definitions.json";

describe("Wallet", () => {
  describe("isValidClassicAddress", () => {
    it("works for valid", async function () {
      expect(Wallet.isValidClassicAddress("rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8")).to.eql(true);
    });

    it("does not work for invalid", async function () {
      expect(Wallet.isValidClassicAddress("qwert")).to.eql(false);
    });
  });

  describe("verifySignature", () => {
    it("works for valid", async function () {
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
      const signedTransaction = wallet.sign(tx).tx_blob;
      const result = Wallet.verifySignature(signedTransaction);
      expect(result).to.be.eql({
        signedBy: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
        signatureValid: true,
        signatureMultiSign: false,
      });
    });

    it("works for multisign", async function () {
      const data = {
        blob: "1200002400000003201B00503A406140000000000000016840000000000000677300811461D46A8DE4DAE4F72196C87995D9390BA82BA9F18314F84E8A80D08854F3621F9214D58F04D41A07EE10F3E01073210217241703CBC4D52C04D59269DE634B388E57C1E72F9462EEF4B435E041ED88367446304402204789F8AA9625D65FD65F43A7AC9FBFAEF64026A4BD1421B0F87ADE24B15F477302207241FDC7B31E15FDB121CA64623B6AC84475A30992E092F56656A731743B9FF781146B07151AAEC3405E3D83CEE654456B621EBF0007E1F1F9EA7C08536F6D65547970657D08536F6D6544617461E1EA7C09446576656C6F7065727D0B4057696574736557696E64E1F1",
        account: "rwku8daRWt6m4taDdoUtc51QhT361aJkn5",
        pubkey: "0217241703CBC4D52C04D59269DE634B388E57C1E72F9462EEF4B435E041ED8836",
      };

      expect(Wallet.verifySignature(data.blob)).to.be.eql({
        signedBy: data.account,
        signatureValid: true,
        signatureMultiSign: true,
      });

      expect(Wallet.verifySignature(data.blob, data.pubkey)).to.be.eql({
        signedBy: data.account,
        signatureValid: true,
        signatureMultiSign: true,
      });
    });

    it("works for valid xahau", async function () {
      const xahauDefinitions = new Wallet.XrplDefinitions(xahauEnums);

      const signedTransaction =
        "12000321000053592200000000242EA2D7E6201B0096C73B68400000000000000073210380AA600ECCE48424CD6036BF103E8E598C546534D508C68539F6D3C8C2A9D76C7446304402202575F1711905D14D7183E7FD68FF0DEC87AFB5D4A736EA6BA070BF1223F3DC1B0220596DEEC2A4BF87381509AD7F3D4C3039F622077F225BA468EC39653E80045F6E811494E1ECAE0A6ECE58DE0A500EB5B30FA1FB26E429F9EA7C046A736F6E7D327B22616374696F6E223A2261646441646472657373222C22656D61696C223A22696E666F40626974686F6D702E636F6D227DE1F1";

      const result = Wallet.verifySignature(signedTransaction, null, xahauDefinitions);
      expect(result).to.be.eql({
        signedBy: "rN2DeuLywSibJ1kH5VtkbN2MYEV3qrXgM1",
        signatureValid: true,
        signatureMultiSign: false,
      });
    });
  });
});
