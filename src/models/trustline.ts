// https://github.com/XRPLF/xrpl.js/blob/2b424276344b2aa8b8b76d621500f4d9e1436663/packages/xrpl/src/models/methods/accountLines.ts#L5

export interface Trustline {
  /** The unique Address of the counterparty to this trust line. */
  account: string;
  /**
   * Representation of the numeric balance currently held against this line. A
   * positive balance means that the perspective account holds value; a negative
   * Balance means that the perspective account owes value.
   */
  balance: string;
  /** A Currency Code identifying what currency this trust line can hold. */
  currency: string;
  /**
   * The maximum amount of the given currency that this account is willing to
   * owe the peer account.
   */
  limit: string;
  /**
   * The maximum amount of currency that the issuer account is willing to owe
   * the perspective account.
   */
  limit_peer: string;
  /**
   * Rate at which the account values incoming balances on this trust line, as
   * a ratio of this value per 1 billion units. (For example, a value of 500
   * million represents a 0.5:1 ratio.) As a special case, 0 is treated as a
   * 1:1 ratio.
   */
  quality_in: number;
  /**
   * Rate at which the account values outgoing balances on this trust line, as
   * a ratio of this value per 1 billion units. (For example, a value of 500
   * million represents a 0.5:1 ratio.) As a special case, 0 is treated as a 1:1
   * ratio.
   */
  quality_out: number;
  /**
   * If true, this account has enabled the No Ripple flag for this trust line.
   * If present and false, this account has disabled the No Ripple flag, but,
   * because the account also has the Default Ripple flag enabled, that is not
   * considered the default state. If omitted, the account has the No Ripple
   * flag disabled for this trust line and Default Ripple disabled.
   */
  no_ripple?: boolean;
  /**
   * If true, the peer account has enabled the No Ripple flag for this trust
   * line. If present and false, this account has disabled the No Ripple flag,
   * but, because the account also has the Default Ripple flag enabled, that is
   * not considered the default state. If omitted, the account has the No Ripple
   * flag disabled for this trust line and Default Ripple disabled.
   */
  no_ripple_peer?: boolean;
  /** If true, this account has authorized this trust line. The default is false. */
  authorized?: boolean;
  /** If true, the peer account has authorized this trust line. The default is false. */
  peer_authorized?: boolean;
  /** If true, this account has frozen this trust line. The default is false. */
  freeze?: boolean;
  /**
   * If true, the peer account has frozen this trust line. The default is
   * false.
   */
  freeze_peer?: boolean;
}
