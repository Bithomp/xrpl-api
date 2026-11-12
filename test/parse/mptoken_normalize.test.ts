import { expect } from "chai";
import { Parse } from "../../src/index";

const { normalizeMPTokensPreviousFields } = Parse;

describe("Parse", () => {
  describe("normalizeMPTokensPreviousFields", () => {
    describe("VaultWithdraw", () => {
      const loadTransaction = () => structuredClone(require("../examples/responses/VaultWithdraw2.json"));
      const recipientToken = (tx: any) =>
        tx.meta.AffectedNodes.find(
          (entry: any) =>
            entry.ModifiedNode?.LedgerEntryType === "MPToken" && entry.ModifiedNode.FinalFields.Account === tx.Account
        ).ModifiedNode;

      for (const omitted of [false, true]) {
        it(`initializes the recipient's previous zero balance with PreviousFields ${omitted ? "omitted" : "empty"}`, () => {
          const tx = loadTransaction();
          const token = recipientToken(tx);
          if (omitted) {
            delete token.PreviousFields;
          }

          normalizeMPTokensPreviousFields(tx.meta, tx);

          expect(token.PreviousFields).to.eql({ MPTAmount: "0" });
        });
      }

      it("leaves unrelated accounts and issuances unchanged", () => {
        const tx = loadTransaction();
        const unrelatedAccount = structuredClone(recipientToken(tx));
        unrelatedAccount.FinalFields.Account = tx.Sponsor;
        const unrelatedIssuance = structuredClone(recipientToken(tx));
        unrelatedIssuance.FinalFields.MPTokenIssuanceID = tx.Amount.mpt_issuance_id;
        tx.meta.AffectedNodes.push({ ModifiedNode: unrelatedAccount }, { ModifiedNode: unrelatedIssuance });

        normalizeMPTokensPreviousFields(tx.meta, tx);

        expect(recipientToken(tx).PreviousFields).to.eql({ MPTAmount: "0" });
        expect(unrelatedAccount.PreviousFields).to.eql({});
        expect(unrelatedIssuance.PreviousFields).to.eql({});
      });

      for (const field of ["MPTAmount", "LockedAmount"]) {
        it(`preserves existing PreviousFields.${field}`, () => {
          const tx = loadTransaction();
          recipientToken(tx).PreviousFields[field] = "100";
          const original = structuredClone(tx.meta);

          normalizeMPTokensPreviousFields(tx.meta, tx);

          expect(tx.meta).to.eql(original);
        });
      }

      for (const variant of ["failed", "unlinked vault", "non-MPT asset", "missing final amount"]) {
        it(`leaves ${variant} metadata unchanged`, () => {
          const tx = loadTransaction();
          const vault = tx.meta.AffectedNodes.find(
            (entry: any) => entry.ModifiedNode?.LedgerEntryType === "Vault"
          ).ModifiedNode;
          if (variant === "failed") {
            tx.meta.TransactionResult = "tecINSUFFICIENT_FUNDS";
          } else if (variant === "unlinked vault") {
            vault.LedgerIndex = "unrelated";
          } else if (variant === "non-MPT asset") {
            vault.FinalFields.Asset = { currency: "XRP" };
          } else {
            delete recipientToken(tx).FinalFields.MPTAmount;
          }
          const original = structuredClone(tx.meta);

          normalizeMPTokensPreviousFields(tx.meta, tx);

          expect(tx.meta).to.eql(original);
        });
      }
    });

    describe("LoanPay", () => {
      const loadTransaction = () => structuredClone(require("../examples/responses/LoanPay2.json"));
      const vaultToken = (tx: any) =>
        tx.meta.AffectedNodes.find(
          (node: any) =>
            node.ModifiedNode?.LedgerEntryType === "MPToken" &&
            node.ModifiedNode.FinalFields.Account === "rG4XxfTAUAUN2dt3yrD12ahx2AichbKQD"
        ).ModifiedNode;

      it("normalizes a recipient when PreviousFields is omitted", () => {
        const tx = loadTransaction();
        const token = vaultToken(tx);
        delete token.PreviousFields;

        normalizeMPTokensPreviousFields(tx.meta, tx);

        expect(token.PreviousFields).to.eql({ MPTAmount: "0" });
      });

      it("leaves failed transactions unchanged", () => {
        const tx = loadTransaction();
        tx.meta.TransactionResult = "tecINSUFFICIENT_FUNDS";
        const original = structuredClone(tx.meta);

        normalizeMPTokensPreviousFields(tx.meta, tx);

        expect(tx.meta).to.eql(original);
      });

      it("leaves unrelated accounts and issuances with omitted amounts unchanged", () => {
        const tx = loadTransaction();
        const unrelatedAccount = structuredClone(vaultToken(tx));
        unrelatedAccount.FinalFields.Account = tx.Account;
        const unrelatedIssuance = structuredClone(vaultToken(tx));
        unrelatedIssuance.FinalFields.MPTokenIssuanceID = "002ED4668AB208E7BC9963BC83F8FF4D4006B884D910E521";
        tx.meta.AffectedNodes.push({ ModifiedNode: unrelatedAccount }, { ModifiedNode: unrelatedIssuance });

        normalizeMPTokensPreviousFields(tx.meta, tx);

        expect(vaultToken(tx).PreviousFields.MPTAmount).to.equal("0");
        expect(unrelatedAccount.PreviousFields).to.eql({});
        expect(unrelatedIssuance.PreviousFields).to.eql({});
      });

      for (const entryType of ["Loan", "LoanBroker", "Vault"]) {
        it(`requires the linked ${entryType} metadata before assuming zero`, () => {
          const tx = loadTransaction();
          const node = tx.meta.AffectedNodes.find((entry: any) => entry.ModifiedNode?.LedgerEntryType === entryType);
          node.ModifiedNode.LedgerIndex = "unrelated";
          const original = structuredClone(tx.meta);

          normalizeMPTokensPreviousFields(tx.meta, tx);

          expect(tx.meta).to.eql(original);
        });
      }

      it("leaves non-MPT vault assets unchanged", () => {
        const tx = loadTransaction();
        const vault = tx.meta.AffectedNodes.find((node: any) => node.ModifiedNode?.LedgerEntryType === "Vault");
        vault.ModifiedNode.FinalFields.Asset = { currency: "XRP" };
        const original = structuredClone(tx.meta);

        normalizeMPTokensPreviousFields(tx.meta, tx);

        expect(tx.meta).to.eql(original);
      });
    });

    it("should add missing PreviousFields.LockedAmount with '0' value for EscrowCreate", () => {
      const tx = require("../examples/responses/EscrowCreateMPT.json");
      const meta = tx.meta;

      normalizeMPTokensPreviousFields(meta, tx);

      const mptIssuanceNode = meta.AffectedNodes.find(
        (node: any) =>
          node.ModifiedNode &&
          node.ModifiedNode.LedgerEntryType === "MPTokenIssuance" &&
          node.ModifiedNode.PreviousFields
      );
      expect(mptIssuanceNode).to.exist;
      expect(mptIssuanceNode.ModifiedNode.PreviousFields).to.have.property("LockedAmount", "0");

      const mptokenNode = meta.AffectedNodes.find(
        (node: any) =>
          node.ModifiedNode && node.ModifiedNode.LedgerEntryType === "MPToken" && node.ModifiedNode.PreviousFields
      );
      expect(mptokenNode).to.exist;
      expect(mptokenNode.ModifiedNode.PreviousFields).to.have.property("LockedAmount", "0");
    });

    it("should add missing data for for EscrowFinish", () => {
      const tx = require("../examples/responses/EscrowFinishMPT.json");
      const meta = tx.meta;

      normalizeMPTokensPreviousFields(meta, tx);

      const address1 = "r3etb2R2JDcQS2gXBJk4M4ShutXJe2zkhs";
      const mptokenNode1 = meta.AffectedNodes.find(
        (node: any) =>
          node.ModifiedNode &&
          node.ModifiedNode.LedgerEntryType === "MPToken" &&
          node.ModifiedNode.FinalFields.Account === address1 &&
          node.ModifiedNode.PreviousFields
      );
      expect(mptokenNode1).to.exist;
      expect(mptokenNode1.ModifiedNode.PreviousFields).to.have.property("MPTAmount", "0");

      const address2 = "rh6iZBNDiDSDmekSJqTZTHRnT2hNQJk5fA";
      const mptokenNode2 = meta.AffectedNodes.find(
        (node: any) =>
          node.ModifiedNode &&
          node.ModifiedNode.LedgerEntryType === "MPToken" &&
          node.ModifiedNode.FinalFields.Account === address2 &&
          node.ModifiedNode.PreviousFields
      );
      expect(mptokenNode2).to.exist;
      expect(mptokenNode2.ModifiedNode.FinalFields).to.have.property("LockedAmount", "0");
      expect(mptokenNode2.ModifiedNode.PreviousFields).to.have.property("LockedAmount", "10000");
    });

    it("should add initial balance PreviousFields.MPTAmount with '0' value for Payment", () => {
      const tx = require("../examples/responses/Payment_MPToken.json");
      const meta = tx.meta;

      normalizeMPTokensPreviousFields(meta, tx);

      const mptokenNode = meta.AffectedNodes.find(
        (node: any) =>
          node.ModifiedNode && node.ModifiedNode.LedgerEntryType === "MPToken" && node.ModifiedNode.PreviousFields
      );
      expect(mptokenNode).to.exist;
      expect(mptokenNode.ModifiedNode.PreviousFields).to.have.property("MPTAmount", "0");
    });

    it("should add initial balance PreviousFields.ConfidentialOutstandingAmount with '0' value for ConfidentialMPTConvert", () => {
      const tx = require("../examples/responses/ConfidentialMPTConvert.json");
      const meta = tx.meta;

      normalizeMPTokensPreviousFields(meta, tx);

      const mptokenNode = meta.AffectedNodes.find(
        (node: any) =>
          node.ModifiedNode &&
          node.ModifiedNode.LedgerEntryType === "MPTokenIssuance" &&
          node.ModifiedNode.PreviousFields
      );
      expect(mptokenNode).to.exist;
      expect(mptokenNode.ModifiedNode.PreviousFields).to.have.property("ConfidentialOutstandingAmount", "0");
    });
  });
});
