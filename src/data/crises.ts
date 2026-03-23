export interface OrgEntry {
  name: string;
  description: string;
  url: string;
}

export interface Crisis {
  id: string;
  title: string;
  country: string;
  urgencyScore: number;       // 1-10
  mediaCoverageScore: number; // 1-10, lower = more underreported
  description: string;
  icdCategory: string;
  neededSkills: string[];
  volunteerOrgs: OrgEntry[];
  donateOrgs: OrgEntry[];
}

export const crises: Crisis[] = [
  {
    id: "crisis-001",
    title: "Cholera Outbreak",
    country: "Sudan",
    urgencyScore: 9,
    mediaCoverageScore: 4,
    description:
      "A severe cholera outbreak has swept through displacement camps in Darfur and Khartoum State following the collapse of water and sanitation infrastructure amid ongoing conflict. Case fatality rates exceed WHO emergency thresholds.",
    icdCategory: "A00 - Cholera",
    neededSkills: ["epidemiology", "WASH", "emergency medicine", "logistics"],
    volunteerOrgs: [
      { name: "International Medical Corps", description: "Deploy WASH and cholera response teams", url: "https://internationalmedicalcorps.org" },
      { name: "ALIMA", description: "Emergency medical teams in conflict zones", url: "https://alima.ngo" },
    ],
    donateOrgs: [
      { name: "MSF Cholera Fund", description: "Direct cholera treatment in Darfur camps", url: "https://msf.org" },
      { name: "IRC Sudan", description: "Water purification and sanitation kits", url: "https://rescue.org" },
    ],
  },
  {
    id: "crisis-002",
    title: "Mpox Surge",
    country: "Democratic Republic of Congo",
    urgencyScore: 8,
    mediaCoverageScore: 3,
    description:
      "Clade Ib mpox is spreading rapidly across eastern DRC, with transmission occurring in conflict-affected health zones where vaccination coverage is below 10%. Children under 15 account for a disproportionate share of severe cases.",
    icdCategory: "B04 - Monkeypox",
    neededSkills: ["infectious disease", "vaccination", "contact tracing", "pediatrics"],
    volunteerOrgs: [
      { name: "Africa CDC Volunteer Corps", description: "Contact tracing and vaccination support", url: "https://africacdc.org" },
      { name: "Médecins Sans Frontières", description: "Clinical volunteers for mpox treatment", url: "https://msf.org" },
    ],
    donateOrgs: [
      { name: "GAVI Alliance", description: "Fund mpox vaccines for eastern DRC", url: "https://gavi.org" },
      { name: "Direct Relief DRC", description: "Medical supplies to conflict health zones", url: "https://directrelief.org" },
    ],
  },
  {
    id: "crisis-003",
    title: "Dengue Fever Surge",
    country: "Bangladesh",
    urgencyScore: 7,
    mediaCoverageScore: 6,
    description:
      "Record dengue case counts driven by prolonged monsoon flooding and urban vector proliferation are overwhelming Dhaka and Chittagong hospitals. Severe dengue hemorrhagic fever is straining blood bank and ICU capacity.",
    icdCategory: "A97 - Dengue",
    neededSkills: ["vector control", "emergency medicine", "blood bank management", "public health"],
    volunteerOrgs: [
      { name: "BRAC Health Programme", description: "Community dengue awareness volunteers", url: "https://brac.net" },
      { name: "WHO SEARO Volunteers", description: "Vector control field operations", url: "https://who.int" },
    ],
    donateOrgs: [
      { name: "icddr,b", description: "Dengue research and treatment in Dhaka", url: "https://icddrb.org" },
      { name: "Bangladesh Red Crescent", description: "Blood bank and ICU supply support", url: "https://bdrcs.org" },
    ],
  },
  {
    id: "crisis-004",
    title: "Acute Malnutrition Crisis",
    country: "Yemen",
    urgencyScore: 10,
    mediaCoverageScore: 5,
    description:
      "Severe acute malnutrition (SAM) affects an estimated 2.2 million children under five amid prolonged conflict and economic collapse. Therapeutic feeding programmes face critical supply shortages; wasting rates in Hajjah and Hodeidah governorates are at famine threshold.",
    icdCategory: "E43 - Unspecified severe protein-energy malnutrition",
    neededSkills: ["nutrition", "pediatrics", "supply chain", "community health"],
    volunteerOrgs: [
      { name: "Action Against Hunger", description: "Therapeutic feeding program volunteers", url: "https://actionagainsthunger.org" },
      { name: "UNICEF Yemen", description: "Community health worker support", url: "https://unicef.org" },
    ],
    donateOrgs: [
      { name: "World Food Programme Yemen", description: "Emergency rations for SAM children", url: "https://wfp.org" },
      { name: "Mona Relief", description: "Yemeni-led local nutrition distribution", url: "https://monarelief.org" },
    ],
  },
  {
    id: "crisis-005",
    title: "Flood-Related Disease Outbreak",
    country: "Pakistan",
    urgencyScore: 8,
    mediaCoverageScore: 7,
    description:
      "Catastrophic monsoon flooding across Sindh and Balochistan has triggered simultaneous outbreaks of acute watery diarrhoea, malaria, and cutaneous leishmaniasis. Over 1.5 million people lack access to safe drinking water or functioning primary health facilities.",
    icdCategory: "A09 - Other gastroenteritis and colitis of infectious and unspecified origin",
    neededSkills: ["WASH", "malaria control", "emergency medicine", "epidemiology"],
    volunteerOrgs: [
      { name: "Edhi Foundation", description: "Pakistan's largest local disaster response", url: "https://edhi.org" },
      { name: "IMC Pakistan", description: "Mobile health units in flood zones", url: "https://internationalmedicalcorps.org" },
    ],
    donateOrgs: [
      { name: "Shaukat Khanum Fund", description: "Disease outbreak response in Sindh", url: "https://skmt.org" },
      { name: "HANDS Pakistan", description: "WASH and malaria kits for flood survivors", url: "https://hands.org.pk" },
    ],
  },
];
