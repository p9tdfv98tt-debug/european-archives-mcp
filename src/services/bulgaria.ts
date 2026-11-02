export interface BulgariaSearchOptions {
  givenName?: string;
  surname?: string;
  villageOrTown?: string;
  recordType?: "births" | "marriages" | "deaths" | "military_wars" | "jewish" | "catholic" | "all";
  year?: number;
}

const BULGARIAN_TOWNS_CYRILLIC: Record<string, string> = {
  sofia: "София",
  plovdiv: "Пловдив",
  varna: "Варна",
  burgas: "Бургас",
  ruse: "Русе",
  rousse: "Русе",
  "stara zagora": "Стара Загора",
  pleven: "Плевен",
  "veliko tarnovo": "Велико Търново",
  tarnovo: "Търново",
  sliven: "Сливен",
  shumen: "Шумен",
  vidin: "Видин",
  vratsa: "Враца",
  gabrovo: "Габрово",
  blagoevgrad: "Благоевград",
  kardzhali: "Кърджали",
  haskovo: "Хасково",
  yambol: "Ямбол",
  pazardzhik: "Пазарджик",
  dobrich: "Добрич",
  silistra: "Силистра",
  lovech: "Ловеч",
  montana: "Монтана",
  kyustendil: "Кюстендил",
  pernik: "Перник",
  razgrad: "Разград",
  smolyan: "Смолян",
  targovishte: "Търговище",
  asenovgrad: "Асеновград",
  kazanlak: "Казанлък",
  karlovo: "Карлово",
  koprivshtitsa: "Копривщица",
  nesebar: "Несебър",
  sozopol: "Созопол",
  melnik: "Мелник",
  bansko: "Банско",
  samokov: "Самоков",
  svishtov: "Свищов",
  lom: "Лом",
  chiprovtsi: "Чипровци",
  rakovski: "Раковски",
  belene: "Белене",
};

/**
 * Transliterates Latin text to Bulgarian Cyrillic according to official Bulgarian phonetic rules,
 * preserving text that is already in Cyrillic.
 */
export function transliterateToBulgarianCyrillic(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();
  // If already contains Cyrillic characters, return as-is
  if (/[\u0400-\u04FF]/.test(trimmed)) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();
  if (BULGARIAN_TOWNS_CYRILLIC[lower]) {
    return BULGARIAN_TOWNS_CYRILLIC[lower];
  }

  const digraphMap: Array<[RegExp, string]> = [
    [/sht/g, "щ"],
    [/Sht/g, "Щ"],
    [/SHT/g, "Щ"],
    [/zh/g, "ж"],
    [/Zh/g, "Ж"],
    [/ZH/g, "Ж"],
    [/ch/g, "ч"],
    [/Ch/g, "Ч"],
    [/CH/g, "Ч"],
    [/sh/g, "ш"],
    [/Sh/g, "Ш"],
    [/SH/g, "Ш"],
    [/ts/g, "ц"],
    [/Ts/g, "Ц"],
    [/TS/g, "Ц"],
    [/tz/g, "ц"],
    [/Tz/g, "Ц"],
    [/yu/g, "ю"],
    [/Yu/g, "Ю"],
    [/YU/g, "Ю"],
    [/ya/g, "я"],
    [/Ya/g, "Я"],
    [/YA/g, "Я"],
    [/yo/g, "йо"],
    [/Yo/g, "Йо"],
  ];

  let result = trimmed;
  for (const [pattern, replacement] of digraphMap) {
    result = result.replace(pattern, replacement);
  }

  const charMap: Record<string, string> = {
    a: "а",
    b: "б",
    v: "в",
    g: "г",
    d: "д",
    e: "е",
    z: "з",
    i: "и",
    y: "й",
    j: "й",
    k: "к",
    l: "л",
    m: "м",
    n: "н",
    o: "о",
    p: "п",
    r: "р",
    s: "с",
    t: "т",
    u: "у",
    f: "ф",
    h: "х",
    c: "ц",
    w: "в",
    A: "А",
    B: "Б",
    V: "В",
    G: "Г",
    D: "Д",
    E: "Е",
    Z: "З",
    I: "И",
    Y: "Й",
    J: "Й",
    K: "К",
    L: "Л",
    M: "М",
    N: "Н",
    O: "О",
    P: "П",
    R: "Р",
    S: "С",
    T: "Т",
    U: "У",
    F: "Ф",
    H: "Х",
    C: "Ц",
    W: "В",
  };

  return result
    .split("")
    .map((ch) => charMap[ch] ?? ch)
    .join("");
}

export interface BulgariaSearchResult {
  country: "Bulgaria (🇧🇬)";
  accessModel: string;
  query: BulgariaSearchOptions;
  cyrillicPreparedQueries: {
    villageInCyrillic?: string;
    surnameInCyrillic?: string;
    givenNameInCyrillic?: string;
    birthsQuery: string;
    weddingsQuery: string;
    deathsQuery: string;
    parishRegisterQuery: string;
    civilStatusQuery: string;
  };
  portals: {
    isdaNationalArchivesCatalog: {
      name: string;
      url: string;
      instructions: string;
      cyrillicKeywordsDictionary: Record<string, string>;
    };
    familySearchBulgariaCatalog: {
      name: string;
      catalogUrl: string;
      directOnlineBulgariaCatalogUrl: string;
      directPlaceCatalogUrl: string;
      instructions: string;
      whatYouGet: string;
    };
    bulgarianStateArchivesDigitizedHub: {
      name: string;
      mainHubUrl: string;
      militaryWarRollsUrl: string;
      jewishArchivesUrl: string;
      whatYouGet: string;
    };
    bulgarianArchivesStateAgency: {
      name: string;
      officialAgencyUrl: string;
      whatYouGet: string;
      scanRequestGuidance: string;
    };
  };
  recommendedWorkflow: string[];
}

export function searchBulgariaArchives(options: BulgariaSearchOptions): BulgariaSearchResult {
  const villageCyr = options.villageOrTown
    ? transliterateToBulgarianCyrillic(options.villageOrTown)
    : undefined;
  const surnameCyr = options.surname
    ? transliterateToBulgarianCyrillic(options.surname)
    : undefined;
  const givenCyr = options.givenName
    ? transliterateToBulgarianCyrillic(options.givenName)
    : undefined;

  const placeSuffix = villageCyr ? ` ${villageCyr}` : "";
  const placeParam = options.villageOrTown
    ? `${options.villageOrTown}, Bulgaria`
    : "Bulgaria";

  return {
    country: "Bulgaria (🇧🇬)",
    accessModel: "Catalog & Specialized Portals (ISDA Cyrillic Catalog + Specialized Digitized Military/Jewish/Catholic Collections + Official Scan Requests)",
    query: options,
    cyrillicPreparedQueries: {
      villageInCyrillic: villageCyr,
      surnameInCyrillic: surnameCyr,
      givenNameInCyrillic: givenCyr,
      birthsQuery: `Книга за раждания${placeSuffix}`,
      weddingsQuery: `женитби${placeSuffix}`,
      deathsQuery: `Книга за умирания${placeSuffix}`,
      parishRegisterQuery: `църковна книга${placeSuffix}`,
      civilStatusQuery: `регистър за гражданско състояние${placeSuffix}`,
    },
    portals: {
      isdaNationalArchivesCatalog: {
        name: "ISDA – National Archives Search Catalog (Информационна система на държавните архиви - Cyrillic Only)",
        url: "https://isda.archives.government.bg:84/FundSearch.aspx",
        instructions:
          'Select all archives in the top dropdown and search using Cyrillic keywords like "Книга за раждания" for births, "женитби" for weddings, or the village name in Cyrillic.',
        cyrillicKeywordsDictionary: {
          births: "Книга за раждания (Book of Births) / раждания / кръщения (baptisms)",
          weddings: "женитби (Weddings/Marriages) / Книга за женитби / венчания",
          deaths: "Книга за умирания (Book of Deaths) / умирания / смърт",
          familyRegister: "семеен регистър (Family/Household Register)",
          parishChurch: "църковно настоятелство / енорийска книга (Parish Board / Book)",
          municipality: "общинско управление (Municipal Administration - holds post-1893 civil registers)",
        },
      },
      familySearchBulgariaCatalog: {
        name: "FamilySearch – Bulgaria Catalog (Limited Catholic & Jewish Microfilms)",
        catalogUrl: "https://www.familysearch.org/search/catalog",
        directOnlineBulgariaCatalogUrl:
          "https://www.familysearch.org/search/catalog/results?count=20&place=%22Bulgaria%22&availability=Online",
        directPlaceCatalogUrl: `https://www.familysearch.org/search/catalog/results?count=20&place=${encodeURIComponent(
          `"${placeParam}"`
        )}&availability=Online`,
        instructions:
          'Type "Bulgaria" in the Place field and filter by "Online" availability.',
        whatYouGet:
          "Digitized microfilms of Bulgarian Catholic parishes (e.g., Plovdiv/Rakovski, Ruse, Svishtov, Belene, Nikopol dioceses) and Jewish community registers.",
      },
      bulgarianStateArchivesDigitizedHub: {
        name: "Bulgarian State Archives – Digitized Collections Hub",
        mainHubUrl: "https://www.archives.bg/",
        militaryWarRollsUrl: "http://archives.bg/wars/",
        jewishArchivesUrl: "http://jews.archives.bg/",
        whatYouGet:
          "Direct access to thematic digitized national collections, including Bulgarian Military/War rolls (Balkan Wars, WWI, WWII casualty & service lists at http://archives.bg/wars/) and Jewish historical archives (http://jews.archives.bg/).",
      },
      bulgarianArchivesStateAgency: {
        name: "Bulgarian Archives State Agency (Държавна агенция „Архиви“ - Official Contacts for Scan Requests)",
        officialAgencyUrl: "https://www.archives.government.bg/",
        whatYouGet:
          "Official directory of all 28 regional State Archives (Държавен архив) in Bulgaria, reading room contacts, and electronic administrative request forms.",
        scanRequestGuidance:
          "Once you locate the exact Archive, Fond (Фонд), Inventory (Опис), and Archival Unit (Архивна единица / а.е.) in ISDA (FundSearch.aspx), contact the regional State Archive via archives.government.bg to order digital scans of those pages.",
      },
    },
    recommendedWorkflow: [
      "1. Convert your ancestor's village/town name and surname into Bulgarian Cyrillic (automatically prepared in cyrillicPreparedQueries).",
      "2. Open ISDA (https://isda.archives.government.bg:84/FundSearch.aspx), select all archives in the top dropdown, and search with the village name in Cyrillic or 'Книга за раждания' (births) / 'женитби' (weddings).",
      "3. Note the Regional Archive name, Fond (Фонд №), Inventory (Опис №), and Archival Unit (а.е. №).",
      "4. If researching Catholic or Jewish lineages in Bulgaria, check the FamilySearch Bulgaria Catalog filtered by 'Online' availability (https://www.familysearch.org/search/catalog) and Roman Catholic Parish registers (such as Parish 'St. Joseph' in Sofia at sofia.capucini.bg).",
      "5. Check the Digitized Collections Hub (https://www.archives.bg/) for Military/War rolls (http://archives.bg/wars/) and Jewish collections (http://jews.archives.bg/).",
      "6. For institutional, municipal, and civil records in Sofia: consult Central State Archives (ЦДА) for ministry and state enterprise records, State Archive Sofia (ДА - София) Fond 1К for municipal civil status registers (Столична община), and local cemetery administration offices for burial records.",
    ],
  };
}
