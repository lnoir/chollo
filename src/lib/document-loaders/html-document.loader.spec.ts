import { getStaticUrl } from '../../../test/helpers';
import { HtmlDocumentLoader } from './html-document.loader';

jest.setTimeout(30000);

fdescribe('HtmlDocumentLoader', () => {
  it('transformHtmlToDocs should transform some html to a doc', async () => {
    const options = {
      selector: 'article',
      map: [
        {'title': 'header h2'},
        {'content': 'header + div'}
      ]
    };
    const loader = new HtmlDocumentLoader(getStaticUrl('/reed-list.html'), options);
    const res = await loader.load();
    expect(res.length).toBeGreaterThanOrEqual(1);
  });

  fit('transformHtmlToDocs should transform some html to a doc', async () => {
    const options = {
      selector: 'article',
      map: [
        {'title': 'header h1'},
        //{'salary': '.description-container span[itemprop=baseSalary]'},
        //{'location': '.description-container span[itemprop=jobLocation]'},
        {'content': '.description'}
      ]
    };
    const loader = new HtmlDocumentLoader(getStaticUrl('/reed-job-featured-node.html'), options);
    const res = await loader.load();
    expect(res.length).toBeGreaterThanOrEqual(1);
  });

  it('should use cheerio to return data from the website', async () => {
    const loader = new HtmlDocumentLoader('https://duckduckgo.com');
    const res = await loader.load();
    expect(res.length).toBeGreaterThanOrEqual(1);
  });
  
  xit('should use puppeteer to return data from the website', async () => {
    const loader = new HtmlDocumentLoader('https://duckduckgo.com', {js: true});
    const res = await loader.load();
    expect(res.length).toBeGreaterThanOrEqual(1);
  });
});