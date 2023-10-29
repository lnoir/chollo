import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { HtmlDocumentLoader } from './lib/document-loaders/html-document.loader';
import { getStaticUrl } from '../test/helpers';
import { DocsService } from './lib/modules/docs/docs.service';
import { DocsModule } from './lib/modules/docs/docs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doc } from './lib/modules/docs/entities/doc.entity';
import { runCoverLetterWriterAgent } from './lib/agents/job.agent';
import { cv0 } from '../test/cvs/cv0';
import { relativeToAbsoluteUrl } from './lib/utils/string.utils';
import { defaultMatchFilterFn } from './lib/modules/tasks/filters';
import { MatchFilterCriteria } from './lib/modules/tasks/types';


// @TODO: serve local versions of the pages we're testing against.

describe('AppService', () => {
  let appService: AppService;
  let docsService: DocsService;
  const staticHost = 'http://127.0.0.1:7878';

  jest.setTimeout(60000);

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Doc],
          synchronize: true,
        }),
        DocsModule
      ],
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
    docsService = app.get<DocsService>(DocsService);
  });

  xdescribe('test run', () => {
    it('should return text', async () => {
      const res = await appService.testRun();
      expect(res).toBeTruthy();
    });

    it('should return docs reed', async () => {
      const res = await appService.embeddy(
        `${staticHost}/reed-list.html`,
        {
          selector: 'article',
          keywords: ['javascript','typescript'],
          map: [
            {'title': 'header h2'},
            {'content': 'header + div'},
            {'meta': 'header > ul > li'},
            {'source': 'h2 a'}
          ]
        }
      );
      expect(res).toBeTruthy();
    });

    it('should return docs indeed', async () => {
      const res = await appService.embeddy(
        `${staticHost}/indeed-list.html`,
        {
          selector: '#mosaic-jobResults ul > li',
          js: true,
          keywords: ['javascript','typescript'],
          map: [
            {'title': 'a.jcs-JobTitle'},
            {'content': '.job-snippet'},
            {'meta': '.metadata'},
            {'source': 'a.jcs-JobTitle'}
          ]
        }
      );
      expect(res).toBeTruthy();
    }); 

    it('runs the basic chain', async () => {
      const job = 
      `TITLE: Scala Developer semi remote
      CONTENT: Contract Role: Senior Scala Developer Location: London/ Remote Join a Cutting-Edge Team with a global investment Bank: Step into the world of modern finance and technology. They are seeking a Senior Developer with a knack for Scala to help drive thei...Go to similar: Scala Developer jobs in london
      META: Competitive salary
      META: London
      META: Permanent, part-time
      SOURCE: Scala Developer semi remote
      `;
      const skills = 'javascript, typescript, node';
      const res = await appService.basicChain({job, skills});
      expect(typeof res).toBe('boolean');
      expect(res).toBe(false);
    });

    it('runs the basic chain', async () => {
      const job = 
      `TITLE: Full Stack Developer Vue/Node
      'CONTENT: Full Stack Developer (Vue.JS / Node.JS) Location: Watford (2 days in the office, 3 days remote) Salary: 65,000 per annum Work for a leading HR business serving Enterprise and Mid-Sized businesses with over 1,000 staff. Responsibilities: Develop scala...Go to similar: Fullstack Developer jobs in london
      'META: £55,000 - £65,000 per annum, inc benefits
      'META: Watford
      'META: Permanent, full-time or part-time
      'SOURCE: Full Stack Developer Vue/Node
      `;
      const skills = 'javascript, typescript, node';
      const res = await appService.basicChain({job, skills});
      expect(typeof res).toBe('boolean');
      expect(res).toBe(true);
    });

    it('runs the sequential chain partial job description', async () => {
      const job = 
      `TITLE: Full Stack Developer Vue/Node
      'CONTENT: Full Stack Developer (Vue.JS / Node.JS) Location: Watford (2 days in the office, 3 days remote) Salary: 65,000 per annum Work for a leading HR business serving Enterprise and Mid-Sized businesses with over 1,000 staff. Responsibilities: Develop scala...Go to similar: Fullstack Developer jobs in london
      'META: £55,000 - £65,000 per annum, inc benefits
      'META: Watford
      'META: Permanent, full-time or part-time
      'SOURCE: Full Stack Developer Vue/Node
      `;
      const skills = 'javascript, typescript, node';
      const res = await appService.sequentialChain({job, skills});
      expect(typeof res).toBe('object');
    });
    
    it('runs the sequential chain on full job description', async () => {
      const job = 
      `TITLE: Node Developer
      CONTENT:  Apply now
      META: £70,000 - £80,000 per annum
      META: Sheffield, South Yorkshire
      META: Permanent, full-time
      Node Developer  Permanent, £70k to £80k  Fully remote, must be UK based The Explore Group have partnered up with a forward thinking scale up business based in Yorkshire that are looking to grow out their development team after receiving £3 million funding to scale their products out on a global platform. We are hiring for a Node backend developer to join an agile team of 6 other engineers.  Skills:  4+ years development experience Node, Javascript/Typescript This role is fully remote however if you wanted to visit an office there is one available for engineers to use.  What's on offer:  £70,000+ salaryHealth insurancePensionsPromotion targetSalary review every 6 months If you are interested or would like to learn more about this opportunity, please apply to this advert or email
      `;
      const skills = 'javascript, typescript, node';
      const res = await appService.sequentialChain({job, skills});
      expect(typeof res).toBe('object');
    });
  });

  xdescribe('Task', () => {
    it('should write a cover letter template for every job which is a match', async () => {
      await runTask(
        getStaticUrl('/reed-list.html'),
        {
          selector: 'article',
          map: [
            {title: 'header h2, header h1'},
            {content: '.card-body,.description,.branded-job--description-container'},
            {source: 'h2 a, h1 a'}
          ]
        },
        appService,
        docsService
      );
    });
  });
});

async function runTask(url, options, appService, docsService) {
  const skills = 'javascript, typescript, node';
  const evald = [];

  // 1. Get and evaluate the list of jobs
  const loader = new HtmlDocumentLoader(url, options);
  const docs = await loader.load();

  let count = 0;

  for (const job of docs) {
    if (count >= 15) break;
    const res = await appService.sequentialChain({job: job.pageContent, skills});
    const enriched = {
      ...job,
      preview: {
        ...res
      }
    };
    const saved = await docsService.insertDoc({
      type: 'job', key: job.metadata.source, data: enriched
    });
    evald.push({...enriched, id: saved[0]});
    count++;
  }

  const filterCriteria: MatchFilterCriteria[] = [
    {match: 'true', confidence: 'medium'},
    //{match: 'false', confidence: 'low'}
  ];

  // 1b. Get rid of the ones with the lowest tolerable confidence
  const screened = defaultMatchFilterFn({docs: evald, filterCriteria});

  // At this point we should have only true-medium/high or false-low
  const finalItems = [];

  // 2. Loop through list of matches
  for (const doc of screened) {
    // 2a. Get the full job description
    const mainUrl = relativeToAbsoluteUrl(url, doc.metadata.source);
    const detailOptions = {
      selector: 'article',
      js: false,
      map: [
        { title: 'h1' },
        {
          content: '.branded-job--description'
        },
      ]
    }
    const loader = new HtmlDocumentLoader(mainUrl, detailOptions);
    const data = await loader.load();
    if (!data?.length) continue;
    
    // 2b. Evaluate the job against the skills
    const evaluation = await appService.sequentialChain({job: data[0].pageContent, skills});
    const enriched = {
      ...data,
      final: {
        ...evaluation
      }
    };
    await docsService.updateBy(
      Doc,
      {data: enriched},
      {id: doc.id}
    );
    finalItems.push(enriched);
  }

  // 3. For the remaining (enriched) jobs... (for now, just write a fresh cover letter template)
  for (const doc of finalItems) {
    //const letter = await runCoverLetterWriterAgent({doc: doc.pageContent, params: cv0});
  }
}