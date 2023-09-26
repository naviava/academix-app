interface CourseIdPageProps {
  params: { courseId: string };
}

export default async function CourseIdPage({ params }: CourseIdPageProps) {
  return <div>Course ID: {params.courseId}</div>;
}
