import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { getTimestamp, getFormattedNumber } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import { NextPageContext } from "next";

interface PageProps {
  searchParams: any; // Replace 'any' with the appropriate type
  params: any; // Replace 'any' with the appropriate type
}

const page = async ({ searchParams, params }: PageProps) => {
  // params whatever in path
  // searchParams whatever after ? in url

  const { userId } = auth();
  let mongoUser;

  if (userId) {
    mongoUser = await getUserById({ userId });
  } else {
    redirect("/login");
  }

  const result = await getQuestionById({ questionId: params.id });
  if (!result) return null;
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author.picture}
              alt="profile"
              className="rounded-full"
              width={22}
              height={22}
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes></Votes>
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimestamp(result.createdAt)}`}
          title=" Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="Message"
          value={getFormattedNumber(result.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="Eye"
          value={getFormattedNumber(result.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={result.content} />

      <div className="mt-8 flex flex-row items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {result.tags.map((tag: any) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              showCount={false}
            />
          ))}
        </div>

        {/* <EditDeleteAction /> */}
      </div>

      <AllAnswers
        questionId={result._id}
        userId={mongoUser.users._id}
        totalAnswers={result.answers.length}
      ></AllAnswers>

      <Answer
        question={result.content}
        authorId={JSON.stringify(mongoUser.users._id)}
        questionId={JSON.stringify(result._id)}
      ></Answer>
    </>
  );
};

export default page;
