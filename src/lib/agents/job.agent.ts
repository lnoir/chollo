import { Ollama } from "langchain/llms/ollama";
import { PromptTemplate } from 'langchain/prompts';
import { HtmlDocumentOptions } from '../document-loaders/html-document.loader';

import { LLMChain, SequentialChain, TransformChain } from 'langchain/chains';
import { StructuredOutputParser } from "langchain/output_parsers";
import { LLMResult } from 'langchain/dist/schema';


const llm = new Ollama({
  model: 'jobby',//'mistral-openorca:latest',
  temperature: 0.7,
});

type DocumentLoaderOptions = HtmlDocumentOptions & {
  keywords?: string[];
}
const controller = new AbortController();

async function abort() {
  controller.abort();
}

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  match: 'string — "true" if it is a solid match, otherwise "false"',
  reasoning: 'string - the reason for the match value, max 80 characters'
});

export const runJobSkillMatchingAgent = ({doc, params}) => {
  // LLM for match result
  const matchPrompt = new PromptTemplate({
    template: //`You're a job filter that evaluates whether or not a job description suits a candidate's skill set. At least one skill must be present in the job description to be considered a match.
    `Compare the candidate's skills to the job below: return whether or not its a match and the reasoning for it. Only output the unformatted JSON, and nothing else.
    This is the job:\n{job}
    This is the candidate's skill set: {skills}.
    `,
    inputVariables: ['skills', 'job']
  });
  const matchChain = new LLMChain({llm, prompt: matchPrompt, outputKey: 'rawMatch', verbose: false});

  const transformChain = new TransformChain({
    inputVariables: ['rawMatch'],
    outputVariables: ['match','confidence','reasoning'],
    transform: inputs => {
      //({match: inputs.rawMatch.trim().toLowerCase().includes('true')})
      const o = typeof inputs.rawMatch === 'string' ? JSON.parse(inputs.rawMatch.trim()) : inputs.rawMatch;
      const { match, reasoning, confidence } = o;
      return { match: match.toString(), reasoning, confidence };
    }
  });

  // LLM for reasoning behind match result
  const reasonPrompt = new PromptTemplate({
    template: `You're a job match rater: you rate the quality of a job against a set of skills. You only output 'low', 'medium', or 'high', and nothing else. Compare the skills to the job and output the appropriate rating.
    This is the job:\n{job}\n
    These are the skills: {skills}.`,
    inputVariables: ['skills', 'job', 'match', 'reasoning']
  });
  const reasonChain = new LLMChain({llm, prompt: reasonPrompt, outputKey: 'confidence', verbose: false});

  const overallChain = new SequentialChain({
    chains: [matchChain, transformChain],
    inputVariables: ['skills', 'job'],
    outputVariables: ['match', 'confidence', 'reasoning'],
    verbose: false
  });

  return overallChain.call({
    skills: params,
    job: doc,
  });
}

export const runCoverLetterWriterAgent = ({doc, params}) => {
  const llm = new Ollama({
    model: 'jobpro',
    temperature: 0.7,
    callbacks: [
      {
        handleLLMEnd: async (output: LLMResult) => {
          //console.log(JSON.stringify(output, null, 2));
        },
      },
    ],
  });

  // LLM for match result
  const letterPrompt = new PromptTemplate({
    template: `Write a cover letter for the candidate's skills and job below:
    This is the job:\n{job}
    This is the candidate's CV:\n{cv}.
    `,
    inputVariables: ['cv', 'job']
  });
  const letterChain = new LLMChain({llm, prompt: letterPrompt, outputKey: 'letter', verbose: false});

  /*
  // LLM for match result
  const proofReadPrompt = new PromptTemplate({
    template: `Write a cover letter for the candidate's skills and job below:
    This is the job:\n{job}
    This is the candidate's CV:\n{cv}.
    `,
    inputVariables: ['cv', 'job', 'letter'],
  });
  const proofReadChain = new LLMChain({llm, prompt: letterPrompt, outputKey: 'rawMatch', verbose: false});
  */

  const overallChain = new SequentialChain({
    chains: [letterChain],
    inputVariables: ['cv', 'job'],
    outputVariables: ['letter'],
    verbose: false
  });

  return overallChain.call({
    cv: params,
    job: doc,
  });
}

export const JobAgent = {
  runJobSkillMatchingAgent,
  runCoverLetterWriterAgent
};