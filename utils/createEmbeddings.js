const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: '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',
});

const createEmbedding = async (text) => {
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  })
  const [{ embedding }] = embeddingResponse?.data?.data

  console.log('embedding', embedding)

  return embedding
}


module.exports = { createEmbedding }