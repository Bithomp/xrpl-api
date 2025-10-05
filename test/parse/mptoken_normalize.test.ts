import { expect } from "chai";
import { Parse } from "../../src/index";

const { normalizeMPTokensPreviousFields } = Parse;

describe("Parse", () => {
  describe("normalizeMPTokensPreviousFields", () => {
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
  });
});
