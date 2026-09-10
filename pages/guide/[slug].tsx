import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import GuideArticle from "../../components/GuideArticle";
import { getGuideDoc, listGuideSlugs, type GuideDoc } from "../../lib/guide";

const LOCALE = "en" as const;

const Page: NextPage<{ doc: GuideDoc }> = ({ doc }) => <GuideArticle locale={LOCALE} doc={doc} />;

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: listGuideSlugs(LOCALE).map((slug) => ({ params: { slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => ({
  props: { doc: getGuideDoc(String(params?.slug), LOCALE) },
});

export default Page;
