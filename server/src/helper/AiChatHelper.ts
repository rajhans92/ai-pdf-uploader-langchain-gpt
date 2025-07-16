import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import fs from "fs";
import mammoth from "mammoth";
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { HumanMessage } from "@langchain/core/messages";

class AiChatHelper {
  private readonly model: ChatOpenAI;
  private readonly embeddings: OpenAIEmbeddings;
  private taggingPrompt: ChatPromptTemplate | null;
  private prompt: string | null;
  private llmWihStructuredOutput: any | null;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-4o-mini", // Correct key is modelName
      temperature: 0,
    });

    this.embeddings = new OpenAIEmbeddings();
    this.taggingPrompt = null;
    this.prompt = null;
    this.llmWihStructuredOutput = null;
    this.classificationFunction();
  }

  private classificationFunction() {
    const classificationSchema = z.object({
      ATS_Rating: z.number().describe("Provide the ATS rating of the resum in scale of 1 to 10"),
      name: z.string().describe("Extract the name of the candidate from the resume"),
      email: z.string().email().describe("Extract the email address of the candidate from the resume"),
      phone: z.string().describe("Extract the phone number of the candidate from the resume"),
      skills: z.array(z.string()).describe("Extract the skills of the candidate from the resume"),
      experience: z.string().describe("Extract the experience of the candidate from the resume"),
      education: z.string().describe("Extract the education of the candidate from the resume"),
      resume_rating: z.string().describe("Provide the overall rating of the resume based on ATS and other factors in scale of 1 to 10"),
      weak_points: z.number().describe("Extract the weak points of the resume"),
      strong_points: z.string().describe("Extract the strong points of the resume"),
      suggestions: z.string().describe("Provide suggestions to improve the resume"),
    });

    this.llmWihStructuredOutput = this.model.withStructuredOutput(
        classificationSchema as any,
        { name: "extractor" }
      ) as any;
  }


  private async promptTemplate(docs: Document[]): Promise<void> {
    this.taggingPrompt = ChatPromptTemplate.fromTemplate(
      `Extract the desired information from the following passage. This is user's resume/cv for job interview.

        Only extract the properties mentioned in the 'Classification' function.

        If data fomate is not available, then return null in all the properties.

        this process should be run for 1 minute, if you are not able to extract the data in 1 minute then return null in all the properties.

        Passage:
        {input}
        `   
    );

    const result = await this.taggingPrompt.invoke({
      input: docs.map((doc: Document) => doc.pageContent).join("\n"),
    });

    this.prompt = result.toString();
  }

  public async llmPdfUploaderChat(filePath: string, fileExtension: string): Promise<any> {
    let docs: Document[] = [];

    if (fileExtension === ".pdf") {
      const loader = new PDFLoader(filePath);
      docs = await loader.load();
    } else if (fileExtension === ".docx") {
      const buffer = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer });
      docs = [new Document({ pageContent: result.value })];
    } else {
      throw new Error("Unsupported file type");
    }

    await this.promptTemplate(docs);

    if (!this.prompt) {
      throw new Error("Prompt not generated");
    }

    const messages = [new HumanMessage(this.prompt!)];
    const result = await this.llmWihStructuredOutput.invoke(messages);

    console.log("Parsed Resume Result =>", result);
    return "test";
  }

  public async callModel(messagesHistory: Array<{ role: string; content: string }>): Promise<string> {
    const messageArr: Array<{ role: string; content: string }> = [
      { role: "system", content: "You are a good AI assistant!" },
      ...messagesHistory,
    ];

    const result = await this.model.invoke(messageArr);
    return "test";
  }
}

export default AiChatHelper;
