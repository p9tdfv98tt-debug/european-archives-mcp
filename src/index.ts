#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import {
  searchCroatiaArchives,
  searchZadarDigitalBooks,
  lookupActaCroatica,
} from "./services/croatia.js";
import {
  searchBulgariaArchives,
  transliterateToBulgarianCyrillic,
} from "./services/bulgaria.js";
import { searchUkArchives, UK_COUNTY_OPCS } from "./services/uk.js";

const server = new Server(
  {
    name: "european-archives-mcp",
    version: "1.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "croatia_archives_search",
        description:
          "Search Croatia (🇭🇷) digitized parish registers and genealogical portals: Interactive Croatian Parish Map (Ex-Yu Genealogy), FamilySearch Croatia Church Books (1516–1994, Collection 2040054), ARHiNET (Matične knjige), Zadar State Archives (Dalmatia/Coast digital books), and Acta Croatica (surname & village origins).",
        inputSchema: {
          type: "object",
          properties: {
            givenName: { type: "string", description: "Ancestor first/given name." },
            surname: { type: "string", description: "Ancestor surname." },
            parishOrTown: { type: "string", description: "Croatian town, village, or parish." },
            regionOrDiocese: { type: "string", description: "Region or Diocese (e.g. 'Dalmatia', 'Zadar', 'Zagreb', 'Split', 'Dubrovnik', 'Istria')." },
            year: { type: "number", description: "Approximate year of event." },
            recordType: {
              type: "string",
              enum: ["births_baptisms", "marriages", "deaths_burials", "status_animarum", "all"],
              description: "Type of parish register.",
            },
          },
        },
      },
      {
        name: "croatia_zadar_digital_books",
        description:
          "Search Zadar State Archives (DAZD - https://www.dazd.hr/hr/knjige/maticne-knjige) for direct high-resolution scans of Dalmatia and Adriatic coast parish books (Matične knjige).",
        inputSchema: {
          type: "object",
          properties: {
            parishOrTown: { type: "string", description: "Dalmatian town, island, or parish name (e.g. 'Zadar', 'Šibenik', 'Pag', 'Silba', 'Ugljan')." },
            year: { type: "number", description: "Optional year filter." },
            recordType: { type: "string", description: "Optional record type (Rođeni/Kršteni, Vjenčani, Umrli)." },
          },
        },
      },
      {
        name: "croatia_acta_croatica_lookup",
        description:
          "Lookup Croatian surname origins, geographic distribution, and ancestral villages on Acta Croatica (https://actacroatica.com/).",
        inputSchema: {
          type: "object",
          properties: {
            surname: { type: "string", description: "Croatian surname to look up." },
            villageOrTown: { type: "string", description: "Optional village or town in Croatia." },
          },
        },
      },
      {
        name: "bulgaria_archives_search",
        description:
          "Search Bulgaria (🇧🇬) national catalogs and specialized portals: ISDA National Archives Search Catalog (FundSearch.aspx with Cyrillic keywords 'Книга за раждания' for births and 'женитби' for weddings), FamilySearch Bulgaria Catalog (Online Catholic & Jewish microfilms), Bulgarian State Archives Digitized Hub (archives.bg, Military/War rolls at archives.bg/wars/, Jewish archives at jews.archives.bg), and Bulgarian Archives State Agency (archives.government.bg).",
        inputSchema: {
          type: "object",
          properties: {
            givenName: { type: "string", description: "Given name (Latin or Cyrillic)." },
            surname: { type: "string", description: "Surname (Latin or Cyrillic)." },
            villageOrTown: { type: "string", description: "Bulgarian village, town, or city (Latin or Cyrillic)." },
            recordType: {
              type: "string",
              enum: ["births", "marriages", "deaths", "military_wars", "jewish", "catholic", "all"],
              description: "Type of Bulgarian record.",
            },
            year: { type: "number", description: "Optional year." },
          },
        },
      },
      {
        name: "bulgaria_cyrillic_transliterate",
        description:
          "Convert Latin names, surnames, and Bulgarian village names into Bulgarian Cyrillic and generate ready-to-paste ISDA (https://isda.archives.government.bg:84/FundSearch.aspx) search strings for births ('Книга за раждания'), weddings ('женитби'), and deaths ('Книга за умирания').",
        inputSchema: {
          type: "object",
          properties: {
            textOrVillage: { type: "string", description: "Latin village name, surname, or phrase to transliterate to Bulgarian Cyrillic." },
            surname: { type: "string", description: "Optional surname to transliterate." },
          },
          required: ["textOrVillage"],
        },
      },
      {
        name: "uk_archives_search",
        description:
          "Search United Kingdom (🇬🇧) free parish transcriptions, civil BMD indexes, and regional archives: FreeREG (55M+ free parish register transcriptions back to 1538), FreeBMD & GRO Official Index (civil births, marriages, deaths 1837–present with free mother's maiden name & age at death), GENUKI (UK & Ireland master parish directory), Online Parish Clerks (Lancashire OPC, Cornwall OPC, Dorset OPC), ScotlandsPeople (Scottish Old Parish Registers 1553–1854 & civil records), and PRONI / IrishGenealogy (100% free Northern Ireland & Ireland civil scans and church transcripts).",
        inputSchema: {
          type: "object",
          properties: {
            givenName: { type: "string", description: "Forename / given name." },
            surname: { type: "string", description: "Surname." },
            parishOrTown: { type: "string", description: "UK town, village, or parish." },
            countyOrNation: { type: "string", description: "County or UK nation (e.g. 'Lancashire', 'Cornwall', 'Dorset', 'England', 'Wales', 'Scotland', 'Northern Ireland')." },
            year: { type: "number", description: "Approximate year of birth, marriage, or death." },
            recordType: {
              type: "string",
              enum: [
                "parish_baptisms_marriages_burials",
                "civil_bmd_post_1837",
                "scotland",
                "northern_ireland",
                "opc_county",
                "all",
              ],
              description: "Focus area of UK research.",
            },
          },
        },
      },
      {
        name: "uk_county_opc_directory",
        description:
          "Lookup free English county Online Parish Clerk (OPC) databases (Lancashire OPC, Cornwall OPC, Dorset OPC, Somerset, Wiltshire, Sussex, Devon) and GENUKI directory links.",
        inputSchema: {
          type: "object",
          properties: {
            county: { type: "string", description: "Optional English county name (e.g. 'Lancashire', 'Cornwall', 'Dorset')." },
          },
        },
      },
      {
        name: "european_archives_federated_search",
        description:
          "Simultaneous federated genealogical search across European archives — Croatia (🇭🇷), Bulgaria (🇧🇬), and the United Kingdom (🇬🇧) — returning direct portal links, Cyrillic queries, free-vs-paywall strategies, and step-by-step workflows.",
        inputSchema: {
          type: "object",
          properties: {
            givenName: { type: "string", description: "Ancestor first/given name." },
            surname: { type: "string", description: "Ancestor surname." },
            placeOrParish: { type: "string", description: "Optional town, village, parish, or region." },
            year: { type: "number", description: "Optional approximate year." },
            countries: {
              type: "array",
              items: {
                type: "string",
                enum: ["croatia", "bulgaria", "uk"],
              },
              description: "Optional filter of countries to include (defaults to all 3: croatia, bulgaria, uk).",
            },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "croatia_archives_search": {
        const schema = z.object({
          givenName: z.string().optional(),
          surname: z.string().optional(),
          parishOrTown: z.string().optional(),
          regionOrDiocese: z.string().optional(),
          year: z.number().optional(),
          recordType: z
            .enum(["births_baptisms", "marriages", "deaths_burials", "status_animarum", "all"])
            .optional(),
        });
        const parsed = schema.parse(args || {});
        const result = searchCroatiaArchives(parsed);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "croatia_zadar_digital_books": {
        const schema = z.object({
          parishOrTown: z.string().optional(),
          year: z.number().optional(),
          recordType: z.string().optional(),
        });
        const parsed = schema.parse(args || {});
        const result = await searchZadarDigitalBooks(parsed);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "croatia_acta_croatica_lookup": {
        const schema = z.object({
          surname: z.string().optional(),
          villageOrTown: z.string().optional(),
        });
        const parsed = schema.parse(args || {});
        const result = await lookupActaCroatica(parsed);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "bulgaria_archives_search": {
        const schema = z.object({
          givenName: z.string().optional(),
          surname: z.string().optional(),
          villageOrTown: z.string().optional(),
          recordType: z
            .enum(["births", "marriages", "deaths", "military_wars", "jewish", "catholic", "all"])
            .optional(),
          year: z.number().optional(),
        });
        const parsed = schema.parse(args || {});
        const result = searchBulgariaArchives(parsed);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "bulgaria_cyrillic_transliterate": {
        const schema = z.object({
          textOrVillage: z.string(),
          surname: z.string().optional(),
        });
        const parsed = schema.parse(args || {});
        const cyrText = transliterateToBulgarianCyrillic(parsed.textOrVillage);
        const cyrSurname = parsed.surname
          ? transliterateToBulgarianCyrillic(parsed.surname)
          : undefined;
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  input: parsed,
                  cyrillicVillageOrText: cyrText,
                  cyrillicSurname: cyrSurname,
                  isdaCatalogUrl: "https://isda.archives.government.bg:84/FundSearch.aspx",
                  readyToPasteIsdaQueries: {
                    births: `Книга за раждания ${cyrText}`,
                    weddings: `женитби ${cyrText}`,
                    deaths: `Книга за умирания ${cyrText}`,
                    villageOnly: cyrText,
                  },
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "uk_archives_search": {
        const schema = z.object({
          givenName: z.string().optional(),
          surname: z.string().optional(),
          parishOrTown: z.string().optional(),
          countyOrNation: z.string().optional(),
          year: z.number().optional(),
          recordType: z
            .enum([
              "parish_baptisms_marriages_burials",
              "civil_bmd_post_1837",
              "scotland",
              "northern_ireland",
              "opc_county",
              "all",
            ])
            .optional(),
        });
        const parsed = schema.parse(args || {});
        const result = searchUkArchives(parsed);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "uk_county_opc_directory": {
        const schema = z.object({
          county: z.string().optional(),
        });
        const parsed = schema.parse(args || {});
        const q = (parsed.county || "").toLowerCase().trim();
        const opcs = q
          ? UK_COUNTY_OPCS.filter((o) => o.county.toLowerCase().includes(q))
          : UK_COUNTY_OPCS;
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  genukiMasterDirectory: "https://www.genuki.org.uk/",
                  countyOpcs: opcs,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "european_archives_federated_search":
      case "federated_archives_search": {
        const schema = z.object({
          givenName: z.string().optional(),
          surname: z.string().optional(),
          placeOrParish: z.string().optional(),
          year: z.number().optional(),
          countries: z
            .array(z.enum(["croatia", "bulgaria", "uk"]))
            .optional(),
        });
        const parsed = schema.parse(args || {});
        const selected = parsed.countries && parsed.countries.length > 0
          ? parsed.countries
          : (["croatia", "bulgaria", "uk"] as const);

        const results: Record<string, unknown> = {};
        if (selected.includes("croatia")) {
          results.croatia = searchCroatiaArchives({
            givenName: parsed.givenName,
            surname: parsed.surname,
            parishOrTown: parsed.placeOrParish,
            year: parsed.year,
          });
        }
        if (selected.includes("bulgaria")) {
          results.bulgaria = searchBulgariaArchives({
            givenName: parsed.givenName,
            surname: parsed.surname,
            villageOrTown: parsed.placeOrParish,
            year: parsed.year,
          });
        }
        if (selected.includes("uk")) {
          results.uk = searchUkArchives({
            givenName: parsed.givenName,
            surname: parsed.surname,
            parishOrTown: parsed.placeOrParish,
            year: parsed.year,
          });
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  mcpServer: "european-archives-mcp",
                  query: parsed,
                  countriesSearched: selected,
                  results,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (err: any) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error executing tool ${name}: ${err.message}` }],
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("European Archives MCP server running on stdio");
}

run().catch((err) => {
  console.error("Fatal error running European Archives MCP server:", err);
  process.exit(1);
});
