// Placeholder policy copy - final text to be supplied and approved by the client's legal advisor.
export const LEGAL: Record<string, { title: string; zh: string; sections: [string, string][] }> = {
  privacy: {
    title: "Privacy Policy",
    zh: "隐私政策",
    sections: [
      ["What we collect", "Contact details, delivery addresses and order history you provide; payment is processed by our gateway and card data never reaches our servers."],
      ["How we use it", "To fulfil orders, send updates on the channel you choose (email, WhatsApp, WeChat, SMS), and — only with consent — letters from the Santalum Circle."],
      ["Cross-border data", "For orders to mainland China we share the minimum data required with our logistics partner and customs broker, in line with PIPL requirements."],
      ["Your rights", "Request access, correction or deletion at any time by writing to atelier@santalummaison.com."],
    ],
  },
  terms: {
    title: "Terms & Conditions",
    zh: "条款与条件",
    sections: [
      ["Natural material", "Each object is made from natural heartwood; colour, grain and weight vary and will change with age. These variations are not defects."],
      ["Pricing", "Prices are set in INR. CNY and USD are shown for convenience at indicative rates; you are charged in the currency displayed at checkout."],
      ["Orders", "An order is accepted once payment is confirmed and you receive an order number."],
    ],
  },
  shipping: {
    title: "Shipping Policy",
    zh: "配送政策",
    sections: [
      ["India", "Complimentary insured delivery above ₹5,000 via Blue Dart / Delhivery, 1–4 business days."],
      ["Mainland China", "DHL Express / SF Express, 7–10 days, duties prepaid (DDP). The cross-border e-commerce tax is collected at checkout."],
      ["Rest of world", "FedEx International Priority, 5–9 days. Import duties are payable by the recipient."],
    ],
  },
  returns: {
    title: "Returns Policy",
    zh: "退换政策",
    sections: [
      ["14 days", "Unworn pieces in original packaging may be returned within 14 days of delivery for a full refund."],
      ["Exceptions", "Engraved, made-to-order and powder products cannot be returned unless faulty."],
      ["Exchanges", "Size exchanges on bangles and rings are complimentary within India."],
    ],
  },
  "material-policy": {
    title: "Material & Sourcing Policy",
    zh: "材料与采购政策",
    sections: [
      ["Legal stock only", "We purchase only registered red sandalwood sold at government auctions, with full documentation."],
      ["Traceability", "Every object carries a batch number linked to its source, processing and certification records."],
      ["CITES", "Pterocarpus santalinus is listed in CITES Appendix II. Exports are made only under valid permits."],
      ["Waste", "Offcuts become powder; nothing is burnt or discarded."],
    ],
  },
};
