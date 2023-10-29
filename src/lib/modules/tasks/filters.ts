import { ConfidenceValue, GenericMatchDoc, MatchFilterCriteria, MatchFilterFn } from "./types";

export const confidenceMap = {
  'low': 0,
  'medium': 1,
  'high': 2
};

export const defaultFilterCriteria: MatchFilterCriteria[] = [
  {match: 'true', confidence: 'medium'},
  //{match: 'false', confidence: 'low'}
];

export const defaultMatchFilterFn: MatchFilterFn = ({docs, filterCriteria}) => {
  return docs.filter((d: GenericMatchDoc) => {
    const result = filterCriteria.reduce((prev, f) => {
      if (!prev) return prev;
      const matchConfidence = 
        d.preview.match === f.match && f.match === 'true' && 
        confidenceMap[d.preview.confidence] >= confidenceMap[f.confidence];
      
      const nonMatchConfidence = 
        d.preview.match === f.match && f.match === 'false' &&
        confidenceMap[d.preview.confidence] <= confidenceMap[f.confidence];
    
      return matchConfidence || nonMatchConfidence;
    }, true);
    return result;
  });
}

export const AllFilters = {
  defaultMatchFilterFn
};