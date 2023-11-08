export type ConfidenceValue = 'low' | 'medium' | 'high';
export type MatchValue = 'true' | 'false';

export type DocEvaluationResult = {
  match: MatchValue;
  confidence: ConfidenceValue;
  reasoning: string;
}

export type GenericMatchDoc = {
  initial?: DocEvaluationResult;
  final?: DocEvaluationResult;
  [key: string]: any;
}

export type MatchFilterCriteria = {
  match: MatchValue;
  confidence: ConfidenceValue;
}

export type MatchFilterFnParams = {
  docs: GenericMatchDoc;
  filterCriteria: MatchFilterCriteria[];
}

export interface MatchFilterFn {
  (params: MatchFilterFnParams): GenericMatchDoc[]
}

enum units {
  'minute',
  'minutes',
  'hour',
  'hours',
  'week',
  'weeks',
  'month',
  'months'
};

type ValidUnits = keyof typeof units;

export type Recurrence = {
  unit: ValidUnits;
  value: number;
}