import type { GetStaticProps, NextPage } from "next";
import GuideHub from "../../../components/GuideHub";
import { getAllGuideMeta, type GuideMeta } from "../../../lib/guide";

const LOCALE = "zh" as const;

const Page: NextPage<{ guides: GuideMeta[] }> = ({ guides }) => (
  <GuideHub locale={LOCALE} guides={guides} />
);

export const getStaticProps: GetStaticProps = async () => ({
  props: { guides: getAllGuideMeta(LOCALE) },
});

export default Page;
