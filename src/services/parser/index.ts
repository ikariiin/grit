import { XMLParser } from "fast-xml-parser";
import JSZip from "jszip";

import { IContainer, IRootFile } from "./interfaces";

export type FileOutputType = "blob" | "base64" | "binarystring" | "text" | "uint8array" | "arraybuffer" | "nodebuffer";

export class EPUBParser {
  private zipFile?: JSZip;
  private parsedContainer?: IContainer;
  private parsedRootInfo?: IRootFile;

  constructor(
    private readonly file: File,
    private xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
    })
  ) {}

  public get parsed(): boolean {
    return Boolean(this.zipFile);
  }

  public async parse(): Promise<void> {
    this.zipFile = await JSZip.loadAsync(this.file);
  }

  public async parseContainer() {
    if (!this.zipFile) {
      this.zipFile = await JSZip.loadAsync(this.file);
    }
    if (this.parsedContainer) {
      return this.parsedContainer;
    }

    const containerFile = this.zipFile.file("META-INF/container.xml");
    if (!containerFile) {
      throw new Error("Container file not found");
    }
    const container = await containerFile.async("text");
    const containerJSON = this.xmlParser.parse(container) as IContainer;

    this.parsedContainer = containerJSON;
    return containerJSON;
  }

  public async parseRootInfo() {
    if (!this.zipFile) {
      this.zipFile = await JSZip.loadAsync(this.file);
    }
    if (this.parsedRootInfo) {
      return this.parsedRootInfo;
    }

    const containerJSON = await this.parseContainer();
    const rootFile = this.zipFile.file(containerJSON.container.rootfiles.rootfile["full-path"]);
    if (!rootFile) {
      throw new Error("Root file not found");
    }

    const rootFileContent = await rootFile.async("text");
    const rootFileJSON = this.xmlParser.parse(rootFileContent) as IRootFile;

    this.parsedRootInfo = rootFileJSON;
    return rootFileJSON;
  }

  public async getFile<T extends FileOutputType>(path: string, type: T, prefixOebpsRoot = true) {
    if (!this.zipFile) {
      this.zipFile = await JSZip.loadAsync(this.file);
    }

    if (prefixOebpsRoot) {
      path = `OEBPS/${path.replace(/\.\//, "")}`;
    }

    const file = this.zipFile.file(path);
    if (!file) {
      throw new Error(`File not found: ${path}`);
    }

    return file.async(type);
  }

  public async attemptFileRead<T extends FileOutputType>(path: string, type: T) {
    const cleanPath = path.replace(window.location.origin + "/", "").replace("app/", "");
    try {
      return await this.getFile(cleanPath, type, false);
    } catch (e) {
      return await this.getFile(cleanPath, type, true);
    }
  }
}
