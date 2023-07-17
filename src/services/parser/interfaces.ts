export interface IContainer {
  container: {
    rootfiles: {
      rootfile: {
        "full-path": string;
        "media-type": string;
      };
    };
  };
}

export interface IRootFile {
  package: {
    metadata: {
      "dc:title": string | { "#text": string; [key: string]: unknown };
      "dc:creator": {
        "#text": string;
        "opf:role": string;
        "opf:file-as": string;
      };
      "dc:language": string;
      "dc:identifier": {
        "#text": string;
        "opf:scheme": string;
        id: string;
      };
      "dc:date"?: string;
      "dc:publisher"?: string;
      "dc:contributor"?: {
        "#text": string;
        "opf:role": string;
        "opf:file-as": string;
      };
      "dc:rights"?: string;
      "dc:subject"?: string;
      meta:
        | {
            name: string;
            content: string;
          }[]
        | {
            name: string;
            content: string;
          };
    };
    manifest: {
      item: Array<{
        id: string;
        href: string;
        "media-type": string;
      }>;
    };
    spine: {
      itemref: Array<{
        idref: string;
      }>;
      toc: string;
    };
    guide: {
      reference: {
        type: string;
        title: string;
        href: string;
      };
    };
    "unique-identifier": string;
    version: string;
    xmlns: string;
  };
}

export interface INcxMeta {
  content: string;
  name: string;
}

export interface INcxNavPoint {
  navLabel: { text: string };
  class?: string;
  id: string;
  content: { src: string };
  playOrder?: string;
  navPoint?: INcxNavPoint | Array<INcxNavPoint>;
}

export interface INcx {
  "?xml": {
    version: string;
    encoding: string;
  };
  ncx: {
    docTitle: { text: string };
    head: { meta: Array<INcxMeta> };
    navMap: { navPoint: Array<INcxNavPoint> };
    version: string;
    "xml:lang": string;
    xmlns: string;
  };
}

export interface ChapterListItem {
  order?: number;
  label: string;
  class?: string;
  src: string;
  id: string;
  children?: Array<ChapterListItem>;
}

export type EPUBMetadata = IRootFile["package"]["metadata"];
export type EPUBManifest = IRootFile["package"]["manifest"];
