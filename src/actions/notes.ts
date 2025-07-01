"use server";
import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to create a note");
    await prisma.note.create({
      data: {
        id: noteId,
        authorId: user.id,
        text: "",
      },
    });
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to update a note");
    await prisma.note.update({
      where: { id: noteId },
      data: { text },
    });
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to delete a note");
    await prisma.note.delete({
      where: { id: noteId, authorId: user.id },
    });
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const askAIAboutNotesAction = async (
  newQuestions: string[],
  responses: string[],
) => {
  const user = await getUser();
  if (!user) throw new Error("You must be logged in to ask AI questions");
  
  const notes = await prisma.note.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    select: { text: true, createdAt: true, updatedAt: true },
  });
  
  if (notes.length === 0) {
    return "You don't have any notes yet.";
  }
  
  const formattedNotes = notes
    .map((note) =>
      `
      Text: ${note.text}
      Created at: ${note.createdAt}
      Last updated: ${note.updatedAt}
      `.trim(),
    )
    .join("\n");

  // Build conversation history for Gemini
  let conversationHistory = `
You are a helpful assistant that answers questions about a user's notes. 
Assume all questions are related to the user's notes. 
Make sure that your answers are not too verbose and you speak succinctly. 
Your responses MUST be formatted in clean, valid HTML with proper structure. 
Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate. 
Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph. 
Avoid inline styles, JavaScript, or custom attributes.

Rendered like this in JSX:
<p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />

Here are the user's notes:
${formattedNotes}

`;

  // Add conversation history
  for (let i = 0; i < newQuestions.length; i++) {
    conversationHistory += `\nUser: ${newQuestions[i]}`;
    if (responses.length > i) {
      conversationHistory += `\nAssistant: ${responses[i]}`;
    }
  }

  // Add the latest question
  const latestQuestion = newQuestions[newQuestions.length - 1];
  conversationHistory += `\nUser: ${latestQuestion}\nAssistant: `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    const result = await model.generateContent(conversationHistory);
    const response = await result.response;
    return response.text() || "A problem has occurred";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "A problem has occurred while processing your request";
  }
};