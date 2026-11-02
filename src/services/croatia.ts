import https from "https";
import * as cheerio from "cheerio";

const agent = new https.Agent({ rejectUnauthorized: false });

export interface CroatiaSearchOptions {
  givenName?: string;
  surname?: string;
  parishOrTown?: string;
  regionOrDiocese?: string;
  year?: number;
  recordType?: "births_baptisms" | "marriages" | "deaths_burials" | "status_animarum" | "all";
}

export interface CroatiaSearchResult {
  country: "Croatia (🇭🇷)";
  accessModel: string;
  query: CroatiaSearchOptions;
  portals: {
    exYuParishMap: {
      name: string;
      url: string;
      instructions: string;
      whatYouGet: string;
    };
    familySearchCroatiaChurchBooks: {
      name: string;
      collectionId: string;
      collectionUrl: string;
      directRecordSearchUrl: string;
      catalogPlaceSearchUrl: string;
      instructions: string;
      whatYouGet: string;
    };
    arhinet: {
      name: string;
      portalUrl: string;
      googleSiteSearchUrl: string;
      instructions: string;
      croatianRecordTerms: Record<string, string>;
    };
    zadarStateArchives: {
      name: string;
      digitalBooksUrl: string;
      googleSiteSearchUrl: string;
      instructions: string;
      coverage: string;
    };
    actaCroatica: {
      name: string;
      portalUrl: string;
      surnameUrlHr?: string;
      surnameUrlEn?: string;
      locationUrl?: string;
      searchUrl: string;
      whatYouGet: string;
    };
  };
  recommendedWorkflow: string[];
}

export function searchCroatiaArchives(options: CroatiaSearchOptions): CroatiaSearchResult {
  const given = (options.givenName || "").trim();
  const surname = (options.surname || "").trim();
  const place = (options.parishOrTown || options.regionOrDiocese || "").trim();

  // Build FamilySearch Collection 2040054 deep search URL
  const fsParams = new URLSearchParams();
  if (given) fsParams.set("q.givenName", given);
  if (surname) fsParams.set("q.surname", surname);
  const fullPlace = place ? `${place}, Croatia` : "Croatia";
  fsParams.set("q.anyPlace", fullPlace);
  if (options.year) {
    fsParams.set("q.anyDate.from", String(options.year - 5));
    fsParams.set("q.anyDate.to", String(options.year + 5));
  }
  fsParams.set("f.collectionId", "2040054");

  const directRecordSearchUrl = `https://www.familysearch.org/search/record/results?${fsParams.toString()}`;
  const catalogPlaceSearchUrl = `https://www.familysearch.org/search/catalog/results?count=20&place=${encodeURIComponent(
    place ? `${place}, Croatia` : "Croatia"
  )}&availability=Online`;

  const searchKeyword = [surname, given, place].filter(Boolean).join(" ") || "Croatia";

  return {
    country: "Croatia (🇭🇷)",
    accessModel: "Direct Links to Scanned Books (100% Free Digitized Parish Books via FamilySearch & State Archives)",
    query: options,
    portals: {
      exYuParishMap: {
        name: "Interactive Croatian Parish Map (Ex-Yu Genealogy)",
        url: "https://exyugenealogy.net/archives-church-records/archives-church-records-in-croatia/",
        instructions:
          "Scroll down to the embedded Google Map, click any town pin, and it gives you the direct link to that parish's digitized books on FamilySearch.",
        whatYouGet:
          "Visual geographic pin-mapping of Croatian Catholic, Orthodox, and Greek-Catholic parishes directly to their exact FamilySearch microfilm/digital folder links.",
      },
      familySearchCroatiaChurchBooks: {
        name: "FamilySearch – Croatia Church Books (1516–1994) Main Collection",
        collectionId: "2040054",
        collectionUrl: "https://www.familysearch.org/search/collection/2040054",
        directRecordSearchUrl,
        catalogPlaceSearchUrl,
        instructions:
          'Click "Browse through images" to select by Diocese/Locality if you aren\'t using the map, or use directRecordSearchUrl to search indexed names.',
        whatYouGet:
          "100% Free high-resolution scans of original Croatian parish registers (Kršteni/Baptisms, Vjenčani/Marriages, Umrli/Deaths, and Status Animarum/Stanje duša) from 1516 to 1994.",
      },
      arhinet: {
        name: "ARHiNET (Croatian National Archival Network)",
        portalUrl: "https://arhinet.arhiv.hr/",
        googleSiteSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(
          `site:arhinet.arhiv.hr "Matične knjige" ${place || surname}`
        )}`,
        instructions:
          'On the left sidebar, click "Matične knjige" to search parish registers by village name and see surviving year ranges and holding state archives.',
        croatianRecordTerms: {
          maticneKnjige: "Matične knjige (Parish Registers)",
          birthsBaptisms: "Matična knjiga rođenih / krštenih (MKR / MKK) - Liber Baptizatorum",
          marriages: "Matična knjiga vjenčanih (MKV) - Liber Matrimoniorum",
          deathsBurials: "Matična knjiga umrlih (MKU) - Liber Defunctorum",
          statusAnimarum: "Stanje duša (Status Animarum - Household family censuses)",
        },
      },
      zadarStateArchives: {
        name: "Zadar State Archives (DAZD) – Digital Parish Books (Dalmatia/Coast)",
        digitalBooksUrl: "https://www.dazd.hr/hr/knjige/maticne-knjige",
        googleSiteSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(
          `site:dazd.hr "maticne-knjige" ${place || surname}`
        )}`,
        instructions:
          "Type the town/parish in the search box and click the camera icon on the right to open the high-resolution scans directly in the browser.",
        coverage:
          "Dalmatia, Zadar hinterland (Ravni Kotari, Bukovica), Šibenik area, and Adriatic islands (Ugljan, Pašman, Pag, Dugi Otok, Silba, Olib, Ist, Premuda, Iž, Molat, Vir, Murter, etc.).",
      },
      actaCroatica: {
        name: "Acta Croatica (Surname & Village Origins)",
        portalUrl: "https://actacroatica.com/",
        surnameUrlHr: surname
          ? `https://actacroatica.com/hr/surname/${encodeURIComponent(surname)}/`
          : undefined,
        surnameUrlEn: surname
          ? `https://actacroatica.com/en/surname/${encodeURIComponent(surname)}/`
          : undefined,
        locationUrl: place
          ? `https://actacroatica.com/hr/location/${encodeURIComponent(place.toLowerCase())}/`
          : undefined,
        searchUrl: `https://actacroatica.com/en/search/?q=${encodeURIComponent(searchKeyword)}`,
        whatYouGet:
          "Historical census distribution, exact villages where a Croatian surname originates, migration patterns, and etymology.",
      },
    },
    recommendedWorkflow: [
      "1. Use Acta Croatica (actacroatica.com) to pinpoint the exact historic villages and municipalities where the surname is concentrated.",
      "2. Open the Interactive Croatian Parish Map (exyugenealogy.net) and click the town pin to jump straight to that parish's digitized books on FamilySearch.",
      "3. Alternatively, open FamilySearch Croatia Church Books (1516–1994) (collection 2040054) and click 'Browse through images' by Diocese/Locality (for Zagreb: Grad Zagreb -> Zagreb parishes: Sv. Marko, Sv. Marija, Sv. Petar, Sv. Blaž, Sv. Ivan Krstitelj).",
      "4. For coastal Dalmatia and Adriatic islands, search the Zadar State Archives (dazd.hr/hr/knjige/maticne-knjige) and click the camera icon to view full scans.",
      "5. Check ARHiNET (arhinet.arhiv.hr -> 'Matične knjige') to verify complete surviving register inventory across all Croatian regional state archives (such as Državni arhiv u Zagrebu - DAZG).",
    ],
  };
}

export interface ZadarBookEntry {
  parishOrPlace: string;
  bookType: string;
  yearRange: string;
  detailsOrScanLink: string;
}

export async function searchZadarDigitalBooks(query: {
  parishOrTown?: string;
  year?: number;
  recordType?: string;
}): Promise<{
  portalUrl: string;
  instructions: string;
  query: typeof query;
  liveScrapedEntries: ZadarBookEntry[];
  note: string;
}> {
  const portalUrl = "https://www.dazd.hr/hr/knjige/maticne-knjige";
  const townFilter = (query.parishOrTown || "").toLowerCase().trim();

  return new Promise((resolve) => {
    const req = https.get(
      portalUrl,
      { agent, headers: { "User-Agent": "Mozilla/5.0" }, timeout: 6000 },
      (res) => {
        let html = "";
        res.on("data", (chunk) => (html += chunk));
        res.on("end", () => {
          const entries: ZadarBookEntry[] = [];
          try {
            const $ = cheerio.load(html);
            $("table tr, .book-item, li").each((_, el) => {
              const text = $(el).text().replace(/\s+/g, " ").trim();
              if (!text) return;
              if (townFilter && !text.toLowerCase().includes(townFilter)) return;
              if (query.year && !text.includes(String(query.year))) return;

              const link = $(el).find("a").attr("href");
              if (link || (townFilter && text.toLowerCase().includes(townFilter))) {
                entries.push({
                  parishOrPlace: query.parishOrTown || "Dalmatia Parish",
                  bookType: text.slice(0, 120),
                  yearRange: (text.match(/\b(1[5-9]\d{2}|20\d{2})\s*[-–]\s*(1[5-9]\d{2}|20\d{2})\b/) || [
                    "See portal",
                  ])[0],
                  detailsOrScanLink: link
                    ? link.startsWith("http")
                      ? link
                      : `https://www.dazd.hr${link}`
                    : portalUrl,
                });
              }
            });
          } catch {
            // Fallback to guidance if HTML structure differs
          }

          resolve({
            portalUrl,
            instructions:
              "Open https://www.dazd.hr/hr/knjige/maticne-knjige, type the town/parish in the search box, and click the camera icon on the right to open the digitized parish book scans.",
            query,
            liveScrapedEntries: entries.slice(0, 25),
            note:
              entries.length === 0
                ? "DAZD loads its parish register table interactively; type the parish name in the search filter on the page and click the camera icon on the right to view scans."
                : `Found ${entries.length} matching entries from DAZD page.`,
          });
        });
      }
    );

    req.on("error", () => {
      resolve({
        portalUrl,
        instructions:
          "Open https://www.dazd.hr/hr/knjige/maticne-knjige, type the town/parish in the search box, and click the camera icon on the right to open the digitized parish book scans.",
        query,
        liveScrapedEntries: [],
        note: "Direct link ready. Use the on-page search box at DAZD and click the camera icon on the right.",
      });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({
        portalUrl,
        instructions:
          "Open https://www.dazd.hr/hr/knjige/maticne-knjige, type the town/parish in the search box, and click the camera icon on the right to open the digitized parish book scans.",
        query,
        liveScrapedEntries: [],
        note: "Direct link ready. Use the on-page search box at DAZD and click the camera icon on the right.",
      });
    });
  });
}

export async function lookupActaCroatica(options: {
  surname?: string;
  villageOrTown?: string;
}): Promise<{
  portalUrl: string;
  surnameUrlEn?: string;
  surnameUrlHr?: string;
  searchUrl: string;
  liveSummary?: string;
}> {
  const surname = (options.surname || "").trim();
  const village = (options.villageOrTown || "").trim();
  const q = [surname, village].filter(Boolean).join(" ");
  const surnameUrlEn = surname
    ? `https://actacroatica.com/en/surname/${encodeURIComponent(surname)}/`
    : undefined;
  const surnameUrlHr = surname
    ? `https://actacroatica.com/hr/surname/${encodeURIComponent(surname)}/`
    : undefined;
  const searchUrl = `https://actacroatica.com/en/search/?q=${encodeURIComponent(q)}`;

  if (!surnameUrlEn) {
    return {
      portalUrl: "https://actacroatica.com/",
      searchUrl,
    };
  }

  return new Promise((resolve) => {
    const req = https.get(
      surnameUrlEn,
      { agent, headers: { "User-Agent": "Mozilla/5.0" }, timeout: 5000 },
      (res) => {
        let html = "";
        res.on("data", (chunk) => (html += chunk));
        res.on("end", () => {
          let liveSummary: string | undefined;
          try {
            const $ = cheerio.load(html);
            const desc =
              $('meta[name="description"]').attr("content") ||
              $("p").first().text().replace(/\s+/g, " ").trim();
            if (desc) liveSummary = desc;
          } catch {
            // ignore
          }
          resolve({
            portalUrl: "https://actacroatica.com/",
            surnameUrlEn,
            surnameUrlHr,
            searchUrl,
            liveSummary,
          });
        });
      }
    );
    req.on("error", () =>
      resolve({
        portalUrl: "https://actacroatica.com/",
        surnameUrlEn,
        surnameUrlHr,
        searchUrl,
      })
    );
    req.on("timeout", () => {
      req.destroy();
      resolve({
        portalUrl: "https://actacroatica.com/",
        surnameUrlEn,
        surnameUrlHr,
        searchUrl,
      });
    });
  });
}
