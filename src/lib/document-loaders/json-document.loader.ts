import { CholloDocumentLoader } from "./choll-document.loader";

export class JsonDocumentLoader extends CholloDocumentLoader<object> {

  constructor(location: string, options: object) {
    super(location, options);
  }

  async load() {
    return [];
  }
}
