import { Document } from "langchain/document";
import { CholloDocumentLoader } from "./choll-document.loader";
import fetch from "node-fetch";
import { load } from "cheerio";
import puppeteer from "puppeteer";

type PropertyType = 'string' | 'number';

type PropertySelector = {
  selector: string;
  type?: PropertyType;
}

type PropertySelectorMap = {
  [prop: string]: PropertySelector | string;
}

export type HtmlDocumentOptions = {
  selector?: string;
  js?: boolean;
  map?: PropertySelectorMap[]
}

export class HtmlDocumentLoader extends CholloDocumentLoader<HtmlDocumentOptions> {

  location: string;
  defaultOptions: HtmlDocumentOptions = {
    selector: 'body',
    js: false,
    map: []
  }
  options: HtmlDocumentOptions;

  constructor(location: string, options?: HtmlDocumentOptions) {
    super(location, options);
  }

  private async getBodyText(): Promise<string | never> {
    const res = await fetch(this.location);
    return res.text();
  }

  transformHtmlToDoc(partial: string): any {
    let doc = null;
    if (!partial) return null;
    
    const $ = load(partial);
    // If there's no map, make no assumptions about the content.
    if (!this.options.map) {
      doc = new Document({
        pageContent: $.text(),
        metadata: {
          source: this.location
        }
      });
    }
    // Now we get funky...
    else {
      let content = '';
      let source = '';
      for (const pair of this.options.map) {
        const [key, map] = Object.entries(pair)[0];
        let selector: string, type = 'string';
        if (typeof map === 'string') {
          selector = map;
        }
        else if (typeof map === 'object') {
          ({selector, type} = map as any);
        }
        else {
          console.warn('Skipped map - invalid map type:', typeof map);
          continue;
        }
        if (key === 'source') {
          source = $(selector).attr('href') || this.location;
        }
        $(selector).each((i, el) => {
          if (content) content += '\n';
          content += `${key.toUpperCase()}: ${$(el).text()?.replace(/\s+/, ' ')}`
        });
      }
      if (!content) return doc;

      doc = new Document({
        pageContent: content,
        metadata: {
          source: source || this.location
        }
      });
    }
    return doc;
  }

  private async loadByCheerio(): Promise<any[]> {
    const $ = load(await this.getBodyText());
    const docs = [];
    $(this.options.selector).each((i, el) => {
      const html = $(el).html();
      if (!html?.trim()) return;
      docs.push(
        this.transformHtmlToDoc(html)
      );
    });
    return docs;
  }

  private async loadByPuppeteer(): Promise<any[]> {
    console.log('JS mode enabled: using puppeteer');
    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();
    await page.goto(this.location);
    await page.waitForSelector(this.options.selector); 
    let docs = [];
    const elHandles = await page.$$(this.options.selector);
    for (const elHandle of elHandles) {
      const elHtml = await page.evaluate(el => el.innerHTML, elHandle);
      docs.push(this.transformHtmlToDoc(elHtml));
    }    
    await browser.close();
    return docs;
  }

  async load(): Promise<Document[]> {
    const dataLoad = this.options.js
      ? this.loadByPuppeteer()
      : this.loadByCheerio();
    const docs = await dataLoad;
    return docs.filter(doc => !!doc);
  }
}