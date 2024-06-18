import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// @supabase/supabase-js
try {
  console.log(import.meta.env, "00");
  const result = await fetch("scrimba-info.txt");

  const text = await result.text();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
    separators: ["\n\n", "\n", " ", ""], // default setting
  });

  const output = await splitter.createDocuments([text]);
  console.log(output, "output");
  const sbApiKey = import.meta.env.VITE_SUPABASE_URL;
  const sbUrl = import.meta.env.VITE_SUPABASE_KEY;
  const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;
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
