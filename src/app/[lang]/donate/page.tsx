import { getDictionary } from "@/app/dictionaries";
import DonateClient from "@/components/DonateClient";

export default async function DonatePage({
  params,
}: {
  params: Promise<{ lang: "en" | "id" }>;
}) {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.lang);

  return <DonateClient dict={dict} lang={resolvedParams.lang} />;
}
