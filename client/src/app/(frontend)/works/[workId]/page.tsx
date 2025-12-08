import ProjectGallery from "@/app/components/ProjectGallery";
import { sanityFetch } from "@/sanity/lib/live";
import { FETCH_PROJECT } from "@/sanity/lib/queries";
import React from "react";

const Page = async ({ params }: { params: Promise<{ workId: string }> }) => {
  const { workId } = await params;

  const { data } = await sanityFetch({
    query: FETCH_PROJECT,
    params: {
      projectId: workId,
    },
  });

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-black">
      <ProjectGallery projectId={workId} project={data} />
    </div>
  );
};

export default Page;
