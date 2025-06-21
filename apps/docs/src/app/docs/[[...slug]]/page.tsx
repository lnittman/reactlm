import type { Metadata } from 'next';
import { DocsPage, DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getPage, getPages } from '@/app/source';

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = getPage(slug);
  if (page == null) {
    notFound();
  }

  const MDX = page.data.exports?.default;

  return (
    <DocsPage toc={page.data.exports?.toc || []} full={page.data.full}>
      <DocsBody>
        <h1>{page.data.title}</h1>
        {MDX ? <MDX /> : <p>{page.data.description}</p>}
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return getPages().map((page) => ({
    slug: page.slugs,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (page == null) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}