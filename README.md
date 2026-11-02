# European Archives & Genealogy MCP Server (`european-archives-mcp`)

A dedicated Model Context Protocol (MCP) server for historical archives and genealogical research across **Croatia (🇭🇷)**, **Bulgaria (🇧🇬)**, and the **United Kingdom (🇬🇧)**. This server operates independently of `portuguese-archives-mcp`.

---

## Connected Countries & Archival Portals

### 🇭🇷 Croatia (Direct Links to Scanned Books)
1. **Interactive Croatian Parish Map (Ex-Yu Genealogy)**: `https://exyugenealogy.net/archives-church-records/archives-church-records-in-croatia/` — Scroll down to the embedded Google Map, click any town pin, and jump directly to that parish's digitized books on FamilySearch.
2. **FamilySearch – Croatia Church Books (1516–1994) Main Collection**: `https://www.familysearch.org/search/collection/2040054` — Browse through images by Diocese/Locality or search indexed records directly.
3. **ARHiNET (Croatian National Archival Network)**: `https://arhinet.arhiv.hr/` — Click *"Matične knjige"* on the left sidebar to search parish registers by village name.
4. **Zadar State Archives (DAZD) – Digital Parish Books (Dalmatia/Coast)**: `https://www.dazd.hr/hr/knjige/maticne-knjige` — Type the town/parish in the search box and click the camera icon on the right to open the scans.
5. **Acta Croatica (Surname & Village Origins)**: `https://actacroatica.com/` — Geographic distribution, village origins, and etymology of Croatian surnames.

### 🇧🇬 Bulgaria (Catalog & Specialized Portals)
1. **ISDA – National Archives Search Catalog (Cyrillic Only)**: `https://isda.archives.government.bg:84/FundSearch.aspx` — Select all archives in the top dropdown and search using Cyrillic keywords like `Книга за раждания` (births), `женитби` (weddings), `Книга за умирания` (deaths), or the village name in Cyrillic.
2. **FamilySearch – Bulgaria Catalog (Limited Catholic & Jewish Microfilms)**: `https://www.familysearch.org/search/catalog` — Search Place `"Bulgaria"` filtered by `"Online"` availability.
3. **Bulgarian State Archives – Digitized Collections Hub**: `https://www.archives.bg/` — Includes digitized Military/War rolls (`http://archives.bg/wars/`) and Jewish archives (`http://jews.archives.bg/`).
4. **Bulgarian Archives State Agency (Official Contacts for Scan Requests)**: `https://www.archives.government.bg/`

### 🇬🇧 United Kingdom (Free Transcriptions & Indexes; Paywalled Scans)
1. **FreeREG (UK Parish Register Transcriptions)**: `https://www.freereg.org.uk/` — **100% Free**, no login required. Over 55 million transcribed Church of England, Welsh, and Scottish parish records (baptisms, marriages, burials) dating back to 1538.
2. **FreeBMD & General Register Office (GRO) — Civil Births, Marriages, Deaths (1837–Present)**:
   - FreeBMD: `https://www.freebmd.org.uk/`
   - GRO Official Index: `https://www.gro.gov.uk/gro/content/certificates/` (free registration; shows mother's maiden surname for births 1837–1923 and exact age at death for deaths 1837–1957 in free search results; £3 for PDF certificate).
3. **GENUKI (UK & Ireland Parish Directory — The Structural Tombo.pt)**: `https://www.genuki.org.uk/` — Master directory for every parish in the UK, surviving register dates, and hosting links.
4. **Online Parish Clerks (OPC) — Free County-Specific Databases**:
   - Lancashire OPC: `https://www.lan-opc.org.uk/`
   - Cornwall OPC: `https://www.cornwall-opc-database.org/`
   - Dorset OPC: `https://www.opcdorset.org/`
5. **ScotlandsPeople (Scotland Official Archive)**: `https://www.scotlandspeople.gov.uk/` — Official government portal for Scottish Old Parish Registers (1553–1854) and civil records (free index search; ~£1.50 pay-per-view scan).
6. **Public Record Office of Northern Ireland (PRONI) & IrishGenealogy**: `https://www.irishgenealogy.ie/` — **100% Free** high-res scans of civil birth, marriage, and death registers alongside free church record transcripts.

---

## Available MCP Tools

- `croatia_archives_search`: Comprehensive search & deep links across Ex-Yu Parish Map, FamilySearch Croatia Church Books (2040054), ARHiNET, DAZD Zadar, and Acta Croatica.
- `croatia_zadar_digital_books`: Search Zadar State Archives (DAZD) digital parish books for Dalmatia and the Adriatic coast.
- `croatia_acta_croatica_lookup`: Surname & village origin lookup on Acta Croatica.
- `bulgaria_archives_search`: Search ISDA (with automatic Cyrillic queries), FamilySearch Bulgaria Online Catalog, `archives.bg` (`wars` & `jews`), and `archives.government.bg`.
- `bulgaria_cyrillic_transliterate`: Convert Latin village/surname strings into Bulgarian Cyrillic and generate ready-to-paste ISDA (`FundSearch.aspx`) search queries.
- `uk_archives_search`: Search FreeREG, FreeBMD, GRO Official Index, GENUKI, County OPCs, ScotlandsPeople, and PRONI / IrishGenealogy.
- `uk_county_opc_directory`: Directory of English county Online Parish Clerk (OPC) portals and GENUKI links.
- `european_archives_federated_search`: Simultaneous federated search across Croatia, Bulgaria, and the UK.
