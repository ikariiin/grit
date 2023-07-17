import css, { Rule } from "css";
import { useCallback, useContext, useEffect, useState } from "react";

import config from "@/config";
import { PreferenceContext } from "@/services/context";
import { EPUBParser } from "@/services/parser";

export interface RenderProps {
  parser: EPUBParser;
  src: string;
}

export function Render({ parser, src }: RenderProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [parsedHTML, setParsedHTML] = useState<string>("");
  const [styles, setStyles] = useState<Array<string>>([]);

  const { preference } = useContext(PreferenceContext);

  const getStyles = useCallback(
    async (links: NodeListOf<HTMLLinkElement>) => {
      const contents = await Promise.all(
        Array.from(links).map(async (link) => {
          const href = link.href;
          const content = await parser.attemptFileRead(href, "text");

          const parsedCss = css.parse(content);
          if (parsedCss.stylesheet) {
            parsedCss.stylesheet.rules =
              parsedCss.stylesheet?.rules.map((rule: Rule) => {
                const lineHeightDecl = rule.declarations?.find((declaration) => {
                  if (declaration.type === "declaration") {
                    return (declaration as css.Declaration).property === "line-height";
                  } else {
                    return false;
                  }
                });
                if (lineHeightDecl) {
                  (lineHeightDecl as css.Declaration).value = "inherit";
                }
                rule.selectors = rule.selectors?.map((selector) => `#${config.READER_RENDER_CONTAINER_ID} ${selector}`);
                return rule;
              }) ?? [];
          }

          return css.stringify(parsedCss);
        })
      );

      setStyles(contents);
    },
    [parser]
  );

  const loadImages = useCallback(
    async (body: HTMLElement) => {
      const images = Array.from(body.querySelectorAll("img"));
      const src = images.map((image) => image.src);
      const imageDataUris = await Promise.all(
        src.map(async (src) => {
          const base64 = await parser.attemptFileRead(src, "base64");
          return `data:image/${src.split(".").pop()};base64,${base64}`;
        })
      );
      images.forEach((image, idx) => {
        image.src = imageDataUris[idx];
        image.classList.add("mx-auto");
      });
    },
    [parser]
  );

  const parseContent = useCallback(async () => {
    if (content.length === 0) return;

    const parser = new DOMParser();
    const document = parser.parseFromString(content, "text/html");

    const styleLinks = document.head.querySelectorAll("link[rel='stylesheet']") as NodeListOf<HTMLLinkElement>;
    await getStyles(styleLinks);
    await loadImages(document.body);

    setParsedHTML(document.body.innerHTML);
  }, [content, getStyles, loadImages]);

  useEffect(() => {
    parseContent();
  }, [parseContent]);

  const getContent = useCallback(async () => {
    if (!parser || !src || src.length === 0) return;

    const escapedSrc = src.replace(/#(.*)/gm, "");

    setLoading(true);
    try {
      const content = await parser.getFile(escapedSrc, "text", false);
      setContent(content);
    } catch (e) {
      try {
        const content = await parser.getFile(escapedSrc, "text", true);
        setContent(content);
      } catch (e) {
        //TODO: Error handling
      }
    } finally {
      setLoading(false);
    }
  }, [parser, src]);

  useEffect(() => {
    void getContent();
  }, [getContent]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main
      className="font-serif md:w-[500px] w-full my-8 mx-auto"
      style={{ fontSize: `${preference.fontSize}rem`, lineHeight: `${preference.lineHeight}` }}
    >
      {styles.map((style, idx) => (
        <style key={idx}>{style}</style>
      ))}
      <div dangerouslySetInnerHTML={{ __html: parsedHTML }} id={config.READER_RENDER_CONTAINER_ID} />
    </main>
  );
}
