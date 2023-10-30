import { defaultFilterCriteria, defaultMatchFilterFn } from "./filters";
import { MatchFilterCriteria } from "./tasks.types";

describe('Filters', () => {

  const docs = [
    {
      pageContent: 'test content',
      metadata: {},
      preview: {
        match: 'false',
        confidence: 'low',
        reasoning: 'there is no good reason'
      }
    },
    {
      pageContent: 'test content',
      metadata: {},
      preview: {
        match: 'true',
        confidence: 'medium',
        reasoning: 'there is no good reason'
      }
    },
    {
      pageContent: 'test content',
      metadata: {},
      preview: {
        match: 'true',
        confidence: 'low',
        reasoning: 'there is no good reason'
      }
    }
  ];

  it('should filter out lower quality matches based on the criteria', () => {
    const result = defaultMatchFilterFn({docs, filterCriteria: defaultFilterCriteria})
    expect(result).toHaveLength(1);
    expect(result[0].preview.match).toBe('true');
  });

  it('should include only unmatched items with "low" confidence', () => {
    const filterCriteria: MatchFilterCriteria[] = [
      {match: 'false', confidence: 'low'}
    ];
    const result = defaultMatchFilterFn({docs, filterCriteria})
    expect(result).toHaveLength(1);
    expect(result[0].preview.match).toBe('false');
  });

  it('should include no items', () => {
    const filterCriteria: MatchFilterCriteria[] = [
      {match: 'true', confidence: 'high'}
    ];
    const result = defaultMatchFilterFn({docs, filterCriteria});
    expect(result).toHaveLength(0);
  });
}); 