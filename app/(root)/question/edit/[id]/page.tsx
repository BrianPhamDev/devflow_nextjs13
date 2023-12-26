import { auth } from "@clerk/nextjs";

import Question from "@/components/forms/Question";

import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";

import type { ParamsProps, URLProps } from "@/types";
import type { Metadata } from "next";
import { getTagById } from "@/lib/actions/tag.action";

export async function generateMetadata({
  params,
}: Omit<URLProps, "searchParams">): Promise<Metadata> {
  const tag = await getTagById({ tagId: params.id });

  return {
    title: `Posts by tag '${tag.name}' — DevOverflow`,
    description: tag.description || `Questions tagged with ${tag.name}`,
  };
}

const Page = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          type="Edit"
          mongoUserId={JSON.stringify(mongoUser.users._id)}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;
