import { DocConfig } from "./entities/doc-config.entity";
import { DocFormat } from "./entities/doc-format.entity";
import { DocSource } from "./entities/doc-source.entity";
import { Doc } from "./entities/doc.entity";

export type DocModuleType = DocSource | DocFormat | DocConfig | Doc;

type PropertyType = 'string' | 'number';

export type PropertySelectorMap = {
  property: string;
  selector: string;
  type: PropertyType;
}