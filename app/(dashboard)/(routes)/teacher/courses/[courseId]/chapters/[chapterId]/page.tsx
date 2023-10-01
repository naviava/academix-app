interface ChapterIdPageProps {
  params: { courseId: string; chapterId: string };
}

export default async function ChapterIdPage({ params }: ChapterIdPageProps) {
  return <div>ChapterIdPage</div>;
}
