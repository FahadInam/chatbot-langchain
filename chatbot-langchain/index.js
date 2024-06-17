import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// @supabase/supabase-js
try {
  const result = await fetch("scrimba-info.txt");
  const SUPABASE_API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkdnBhdXdmYXVicmJ1d2FrYXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg2Mzc4MDMsImV4cCI6MjAzNDIxMzgwM30.CvSO36Rj6e-LP0EEj5p-yzjgX1BGYAN91YetbKiqZEM";
  const SUPABASE_URL_LC_CHATBOT = "https://tdvpauwfaubrbuwakasp.supabase.co";
  const OPENAI_API_KEY = "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";

  const text = await result.text();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
    separators: ["\n\n", "\n", " ", ""], // default setting
  });

  const output = await splitter.createDocuments([text]);
  console.log(output, "output");
  const sbApiKey = SUPABASE_API_KEY;
  const sbUrl = SUPABASE_URL_LC_CHATBOT;
  const openAIApiKey = OPENAI_API_KEY;
  console.log(sbApiKey, sbUrl, openAIApiKey, "openAIApiKey");
  const client = createClient(sbUrl, sbApiKey);

  await SupabaseVectorStore.fromDocuments(
    output,
    new OpenAIEmbeddings({ openAIApiKey }),
    {
      client,
      tableName: "documents",
    }
  );
} catch (err) {
  console.log(err);
}
