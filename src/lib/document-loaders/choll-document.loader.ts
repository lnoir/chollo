import { BaseDocumentLoader } from "langchain/document_loaders/base";

export abstract class CholloDocumentLoader<OptionsType> extends BaseDocumentLoader {
  
  location: string;
  defaultOptions: object;
  options: OptionsType;

  constructor(location: string, options?:OptionsType) {
    super();
    this.location = location;
    this.options = {
      ...this.defaultOptions,
      ...(options || {})
    } as OptionsType;
  }
}