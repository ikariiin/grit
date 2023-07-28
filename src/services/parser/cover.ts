import { generateDefaultCover } from "@/services/parser/default-cover";

import { EPUBParser, FileOutputType } from ".";

export class CoverParser {
  constructor(private epubParser: EPUBParser) {}

  public async getCover<T extends FileOutputType>(outputType: T) {
    const rootInfo = await this.epubParser.parseRootInfo();
    let coverId: string | undefined;
    if (Array.isArray(rootInfo.package.metadata.meta)) {
      for (const meta of rootInfo.package.metadata.meta) {
        if (meta.name === "cover") {
          coverId = meta.content;
          break;
        }
      }
    } else {
      if (rootInfo.package.metadata?.meta?.name === "cover") {
        coverId = rootInfo.package.metadata.meta.content;
      }
    }

    if (!coverId) {
      return generateDefaultCover(
        typeof rootInfo.package.metadata["dc:title"] === "string"
          ? rootInfo.package.metadata["dc:title"]
          : rootInfo.package.metadata["dc:title"]["#text"]
      );
    }

    const coverItem = rootInfo.package.manifest.item.find((item) => item.id === coverId);
    if (!coverItem) {
      // No cover item! Better send them another default cover then
      return generateDefaultCover(
        typeof rootInfo.package.metadata["dc:title"] === "string"
          ? rootInfo.package.metadata["dc:title"]
          : rootInfo.package.metadata["dc:title"]["#text"]
      );
    }

    try {
      const image = await this.epubParser.getFile(coverItem.href, outputType, coverItem.href.startsWith("."));

      if (outputType === "base64") {
        return `data:${coverItem["media-type"]};base64,${image}`;
      }

      return image;
    } catch (e) {
      try {
        // If the above fails, and it does not start with a dot, try with the prefix flag
        // turned on
        const image = await this.epubParser.getFile(coverItem.href, outputType, true);

        if (outputType === "base64") {
          return `data:${coverItem["media-type"]};base64,${image}`;
        }

        return image;
      } catch (_) {
        // If this still fails, throw
        throw e;
      }
    }
  }
}
