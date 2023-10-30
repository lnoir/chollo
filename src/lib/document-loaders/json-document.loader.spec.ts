import { getStaticUrl } from '../../../test/helpers';
import { JsonDocumentLoader } from './json-document.loader';

describe('JsonDocumentLoader', () => {
  it('should be defined', () => {
    expect(new JsonDocumentLoader(getStaticUrl('/data.json'), {})).toBeDefined();
  });
});
