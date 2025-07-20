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


  private async promptDocTemplate(docs: Document[]): Promise<void> {
    this.taggingPrompt = ChatPromptTemplate.fromTemplate(
     `You are an intelligent information extraction assistant.

      Your task is to extract structured information from a resume or CV text provided in the input field.

      ### Rules:
      1. Only extract the properties listed in the 'Classification' function.
      2. If any data is missing, unclear, or not in an extractable format, return \`null\` for that property.
      3. If extraction takes longer than 1 minute, return \`null\` for all properties.
      4. Output must strictly match the format of the 'Classification' function as a JSON object.
      5. Do not infer or guess data — only use what is explicitly mentioned.

      ### Input:
      {input}`   
    );

    const result = await this.taggingPrompt.invoke({
      input: docs.map((doc: Document) => doc.pageContent).join("\n"),
    });

    this.prompt = result.toString();
  }

  private async promptChatTemplate(docs: Document[]): Promise<void> {
    this.taggingPrompt = ChatPromptTemplate.fromTemplate(
     `You are an intelligent information extraction assistant.

      Your task is to read information from a resume or CV text provided in the input field.
      and answer the questions based on the information provided.
      
      ### Input:
      {input}`   
    );

    const result = await this.taggingPrompt.invoke({
      input: docs.map((doc: Document) => doc.pageContent).join("\n"),
    });

    this.prompt = result.toString();
  }

  private async docToText(filePath: string, fileExtension: string) {
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

    await this.promptDocTemplate(docs);

  }

  public async llmPdfUploaderChat(filePath: string, fileExtension: string): Promise<any> {

    await this.docToText(filePath, fileExtension);

    if (!this.prompt) {
      throw new Error("Prompt not generated");
    }

    const messages = [new HumanMessage(this.prompt!)];

    // Add a 60-second timeout logic
    const TIMEOUT_MS = 60000;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("GPT response timeout")), TIMEOUT_MS)
    );

    let parsing = false;
    let result: any = null;
    try {
        result = await Promise.race([
        this.llmWihStructuredOutput.invoke(messages),
        timeoutPromise
      ]);
      parsing = true;
      return {parsing,result,filePath};
    } catch (err) {
      return {parsing,result};
    }finally{
      // this.deleteFile(filePath);
    }

  }

  private async deleteFile(filePath: string) {
    const TEN_MINUTES = 10 * 60 * 1000; // 600000 ms

    setTimeout(async () => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          } else {
            console.log("File deleted successfully:", filePath);
          }
        });
      }, TEN_MINUTES);
  }

  public async callModel(messagesHistory: Array<{ role: string; content: string }>,filePath: string, fileExtension: string) {
    const messageArr: Array<{ role: string; content: string }> = [
      { role: "system", content: "You are a good AI assistant!" },
      ...messagesHistory,
    ];

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

    await this.promptChatTemplate(docs);

    const messages = [new HumanMessage(this.prompt!)];
    messages.push(...messageArr.map(msg => new HumanMessage(msg.content)));

    const result = await this.model.invoke(messageArr);
    return result.content;
  }
}

export default AiChatHelper;
