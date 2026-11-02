export interface UkSearchOptions {
  givenName?: string;
  surname?: string;
  parishOrTown?: string;
  countyOrNation?: string;
  year?: number;
  recordType?: "parish_baptisms_marriages_burials" | "civil_bmd_post_1837" | "scotland" | "northern_ireland" | "opc_county" | "all";
}

export interface UkCountyOpcInfo {
  county: string;
  portalName: string;
  url: string;
  coverageAndFeatures: string;
}

export const UK_COUNTY_OPCS: UkCountyOpcInfo[] = [
  {
    county: "Lancashire",
    portalName: "Lancashire Online Parish Clerk (Lan-OPC)",
    url: "https://www.lan-opc.org.uk/",
    coverageAndFeatures:
      "100% Free. Millions of transcribed baptisms, marriages, and burials across historic Lancashire (including Manchester, Liverpool, Preston, Lancaster, Blackburn, Bolton, Wigan, etc.).",
  },
  {
    county: "Cornwall",
    portalName: "Cornwall Online Parish Clerks Database",
    url: "https://www.cornwall-opc-database.org/",
    coverageAndFeatures:
      "100% Free. Over 6.5 million searchable records across Cornish parishes (baptisms, marriages, banns, burials, wills, and census transcripts).",
  },
  {
    county: "Dorset",
    portalName: "Dorset Online Parish Clerks (OPC Dorset)",
    url: "https://www.opcdorset.org/",
    coverageAndFeatures:
      "100% Free. Comprehensive parish-by-parish transcripts of Dorset church registers, monumental inscriptions, tithe apportionments, and censuses.",
  },
  {
    county: "Somerset",
    portalName: "Somerset Online Parish Clerks (WSOM / FreeREG)",
    url: "https://www.wsom.org.uk/",
    coverageAndFeatures: "Free West Somerset & county parish register transcripts (also heavily indexed on FreeREG).",
  },
  {
    county: "Wiltshire",
    portalName: "Wiltshire Online Parish Clerks",
    url: "https://www.wiltshire-opc.org.uk/",
    coverageAndFeatures: "Free Wiltshire parish historical transcripts, wills, and register extracts.",
  },
  {
    county: "Sussex",
    portalName: "Sussex Online Parish Clerks",
    url: "https://www.sussex-opc.org/",
    coverageAndFeatures: "Free Sussex parish register transcripts, churches, and local genealogy resources.",
  },
  {
    county: "Devon",
    portalName: "Devon Genuki / OPC Resources",
    url: "https://www.genuki.org.uk/big/eng/DEV",
    coverageAndFeatures: "Directory of free Devon parish transcriptions and links to FreeREG.",
  },
];

export interface UkSearchResult {
  country: "United Kingdom (🇬🇧)";
  accessModel: string;
  commercializationNote: string;
  query: UkSearchOptions;
  portals: {
    freeReg: {
      name: string;
      url: string;
      whatYouGet: string;
      instructions: string;
    };
    freeBmdAndGro: {
      name: string;
      freeBmdUrl: string;
      groOfficialIndexUrl: string;
      whatYouGet: string;
      instructions: string;
    };
    genuki: {
      name: string;
      url: string;
      searchUrl: string;
      whatYouGet: string;
      instructions: string;
    };
    onlineParishClerks: {
      name: string;
      primaryPortals: {
        lancashireOpc: string;
        cornwallOpc: string;
        dorsetOpc: string;
      };
      matchedCountyOpcs: UkCountyOpcInfo[];
      whatYouGet: string;
    };
    scotlandsPeople: {
      name: string;
      url: string;
      whatYouGet: string;
      pricingNote: string;
    };
    proniAndIrishGenealogy: {
      name: string;
      irishGenealogyUrl: string;
      proniDirectUrl: string;
      whatYouGet: string;
    };
  };
  recommendedWorkflow: string[];
}

export function searchUkArchives(options: UkSearchOptions): UkSearchResult {
  const countyFilter = (options.countyOrNation || options.parishOrTown || "").toLowerCase().trim();
  const matchedOpcs = countyFilter
    ? UK_COUNTY_OPCS.filter((o) => o.county.toLowerCase().includes(countyFilter))
    : UK_COUNTY_OPCS.slice(0, 3);

  const genukiQuery = [options.parishOrTown, options.countyOrNation].filter(Boolean).join(" ") || "England";

  return {
    country: "United Kingdom (🇬🇧)",
    accessModel: "Free Transcriptions & Civil Indexes; Paywalled Parish Scans (with 100% Free OPCs & Northern Ireland / IrishGenealogy Scans)",
    commercializationNote:
      "Because individual County Record Offices in England and Wales licensed their digital parish scans to Ancestry and Findmypast, there is no single free UK site to flip through original handwriting unless you visit a local UK library (where Ancestry Library Edition is free). However, you can get the exact dates, parents' names, and full register details 100% for free via the portals below.",
    query: options,
    portals: {
      freeReg: {
        name: "FreeREG (UK Parish Register Transcriptions) — Closest Free Parish Equivalent",
        url: "https://www.freereg.org.uk/",
        whatYouGet:
          "100% Free, no login required. Over 55 million transcribed Church of England, Welsh, and Scottish parish records (baptisms, marriages, burials) dating back to 1538. You don't see the photo of the book, but volunteers have typed out the full entry (child, parents, father's occupation, abode, and burial notes).",
        instructions:
          "Go to https://www.freereg.org.uk/, enter the Surname, Forename, County, Parish/Place, and Record Type (Baptism, Marriage, Burial), and click Search.",
      },
      freeBmdAndGro: {
        name: "FreeBMD & General Register Office (GRO) — Civil Births, Marriages, Deaths (1837–Present)",
        freeBmdUrl: "https://www.freebmd.org.uk/",
        groOfficialIndexUrl: "https://www.gro.gov.uk/gro/content/certificates/",
        whatYouGet:
          "100% Free index search. Civil registration started in England & Wales in July 1837. FreeBMD lets you search the quarterly indexes for births, marriages, and deaths. Even better, the official GRO site (free registration) lets you search births (1837–1923) and deaths (1837–1957) and immediately shows the mother's maiden surname and exact age at death in the free search results, though viewing an instant PDF image of the certificate costs £3.",
        instructions:
          "Use FreeBMD (https://www.freebmd.org.uk/) for Marriages and post-1923 records, and use the GRO Online Index (https://www.gro.gov.uk/gro/content/certificates/) for Births (1837–1923) to reveal the mother's maiden surname for free.",
      },
      genuki: {
        name: "GENUKI (UK & Ireland Parish Directory — The Structural Tombo.pt)",
        url: "https://www.genuki.org.uk/",
        searchUrl: `https://www.genuki.org.uk/search?q=${encodeURIComponent(genukiQuery)}`,
        whatYouGet:
          "Works as the master directory for every parish in the UK. Search any town or village, and it tells you which churches existed, what years their registers survive, and gives direct links to wherever those specific books are hosted online.",
        instructions:
          "Search your ancestral village or parish on GENUKI first to see all denominations, surviving register years, and which free or commercial portal holds that parish's books.",
      },
      onlineParishClerks: {
        name: "Online Parish Clerks (OPC) — Free County-Specific Databases",
        primaryPortals: {
          lancashireOpc: "https://www.lan-opc.org.uk/",
          cornwallOpc: "https://www.cornwall-opc-database.org/",
          dorsetOpc: "https://www.opcdorset.org/",
        },
        matchedCountyOpcs: matchedOpcs.length > 0 ? matchedOpcs : UK_COUNTY_OPCS.slice(0, 3),
        whatYouGet:
          "Certain English counties run independent, 100% free portals with complete parish transcripts and sometimes images (most notably Lancashire OPC, Cornwall OPC, and Dorset OPC).",
      },
      scotlandsPeople: {
        name: "ScotlandsPeople (Scotland Official Archive)",
        url: "https://www.scotlandspeople.gov.uk/",
        whatYouGet:
          "The official government portal for all Scottish Old Parish Registers (1553–1854), Catholic Parish Registers, and Statutory Civil Records (1855–present).",
        pricingNote:
          "Searching the index is 100% free (and reveals names, dates, parents' names on many indexes, and parishes), while opening the actual high-res page scan costs a small pay-per-view credit (~£1.50).",
      },
      proniAndIrishGenealogy: {
        name: "Public Record Office of Northern Ireland (PRONI) & IrishGenealogy",
        irishGenealogyUrl: "https://www.irishgenealogy.ie/",
        proniDirectUrl: "https://www.nidirect.gov.uk/proni",
        whatYouGet:
          "100% Free. If your UK search crosses into Northern Ireland (or Ireland), IrishGenealogy.ie provides completely free high-res scans of civil birth, marriage, and death registers alongside free church record transcripts.",
      },
    },
    recommendedWorkflow: [
      "1. Look up the town or village on GENUKI (https://www.genuki.org.uk/) to identify all parishes, surviving register dates, and hosting platforms.",
      "2. For events from July 1837 onwards in England & Wales, search FreeBMD (https://www.freebmd.org.uk/) for marriages and the official GRO Index (https://www.gro.gov.uk/gro/content/certificates/) for births (reveals mother's maiden surname for free) and deaths (reveals exact age).",
      "3. For pre-1837 (and 19th-century) parish records back to 1538, search FreeREG (https://www.freereg.org.uk/) for full volunteer transcriptions.",
      "4. If your ancestors are from Lancashire (lan-opc.org.uk), Cornwall (cornwall-opc-database.org), or Dorset (opcdorset.org), search their dedicated 100% free Online Parish Clerk (OPC) portals.",
      "5. For Scotland, use the free index on ScotlandsPeople (https://www.scotlandspeople.gov.uk/); for Northern Ireland/Ireland, open the 100% free civil register scans on IrishGenealogy (https://www.irishgenealogy.ie/).",
    ],
  };
}
