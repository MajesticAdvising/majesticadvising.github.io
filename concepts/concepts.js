/* =====================================================================
   CONCEPT CARDS
   This is the only list the Concepts page reads.
   Add one object to this array to show a new pitch.
   Fields:
     title        card heading
     description  one or two sentences in plain English
     region       "USVI" or "Oklahoma"
     status       "Concept demo"
     href         path under concepts/, for example "usvi-public-funds-transparency/"
   ===================================================================== */
var CONCEPTS = [
  {
    title: "Public Funds Transparency (USVI)",
    description: "Shows how the University of the Virgin Islands Research and Technology Park could publish its public funds in USDC on Solana. Payments on the page are sample data, and any real funds would move through a bank.",
    region: "USVI",
    status: "Concept demo",
    href: "usvi-public-funds-transparency/"
  },
  {
    title: "Employee USDC Income (USVI)",
    description: "Shows how Government of the Virgin Islands employees could choose to receive part of their pay in USDC, with a bank authorizing every payment and GotSOL.app only showing what the bank already approved. Public DoP and OpenGov figures are cited, nothing on the page moves money, and this is a later phase concept, not the first pilot.",
    region: "USVI",
    status: "Concept demo",
    href: "usvi-employee-usdc-income/"
  },
  {
    title: "First City USDC Payments (Oklahoma)",
    description: "Shows how an Oklahoma city could accept USDC payments for utility bills, permits and fees, while the city's bank converts them to dollars. The payments on the page are sample data, and the name is held in confidence.",
    region: "Oklahoma",
    status: "Concept demo",
    href: "first-city-usdc-payments/"
  }
];
