"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { author, question, content, path } = params;

    const newAnswer = await Answer.create({
      author,
      question,
      content,
    });

    //find the question and push the new answer to question array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });
    //todo: add interaction

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
