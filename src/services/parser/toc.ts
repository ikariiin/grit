import { XMLParser } from "fast-xml-parser";

import { EPUBParser } from "@/services/parser";
import { ChapterListItem, type EPUBManifest, INcx, INcxNavPoint } from "@/services/parser/interfaces";

export class TOCParser {
  private xmlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });
  public parsed = false;
  private parsedXML?: INcx;

  constructor(private readonly parser: EPUBParser, private manifest?: EPUBManifest) {}

  private async getFile(ncx: string) {
    try {
      const withoutOEBPS = await this.parser.getFile(ncx, "text", false);
      return withoutOEBPS;
    } catch (e) {
      // If not present inside root, try looking inside OEBPS
      const withOEBPS = await this.parser.getFile(ncx, "text", true);
      return withOEBPS;
    }
  }

  public async parse() {
    if (!this.manifest) {
      if (!this.parser.parsed) {
        await this.parser.parse();
      }
      const rootInfo = await this.parser.parseRootInfo();
      this.manifest = rootInfo.package.manifest;
    }

    const ncxDetails = this.manifest.item.find((item) => item.id.toLowerCase() === "ncx");
    if (!ncxDetails) return null;

    const ncxFile = await this.getFile(ncxDetails.href);
    this.parsedXML = this.xmlParser.parse(ncxFile);
    this.parsed = true;
  }

  public async getList() {
    if (!this.parsed || !this.parsedXML) {
      await this.parse();
    }
    // If it is still not parsed, just throw everything out
    if (!this.parsed || !this.parsedXML) {
      throw new Error("Error working on parsed TOC document");
    }

    const ncxPointToListItem = (point: INcxNavPoint) => {
      const item: ChapterListItem = {
        id: point.id,
        label: point.navLabel.text,
        src: point.content.src,
      };
      if (point.class) item.class = point.class;
      if (point.playOrder) item.order = parseInt(point.playOrder, 10);
      if (point.navPoint) {
        if (Array.isArray(point.navPoint)) {
          item.children = point.navPoint.map(ncxPointToListItem);
        } else {
          item.children = [point.navPoint].map(ncxPointToListItem);
        }
      }

      return item;
    };

    const navPoint = this.parsedXML?.ncx.navMap.navPoint;
    if (navPoint) {
      if (Array.isArray(navPoint)) {
        return navPoint.map(ncxPointToListItem);
      } else {
        return [navPoint].map(ncxPointToListItem);
      }
    } else {
      return [];
    }
  }

  public static flattenChapterList(chapterList: ChapterListItem[], store: ChapterListItem[] = []): ChapterListItem[] {
    chapterList.forEach((chapter) => {
      const children = chapter.children;
      store.push({
        ...chapter,
        children: undefined,
      });
      if (children && Array.isArray(children)) {
        TOCParser.flattenChapterList(children, store);
      }
    });

    return store;
  }
}
