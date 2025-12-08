import WorkList from "@/app/components/WorkList";
import { sanityFetch } from "@/sanity/lib/live";
import { FETCH_CATEGORY_PROJECTS } from "@/sanity/lib/queries";
import React from "react";

const Page = async ({ params }: { params: Promise<{ category: string }> }) => {
  const { category } = await params;

  const { data } = await sanityFetch({
    query: FETCH_CATEGORY_PROJECTS,
    params: {
      category: category,
    },
  });

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <WorkList data={data} />
    </div>
  );
};

export default Page;
