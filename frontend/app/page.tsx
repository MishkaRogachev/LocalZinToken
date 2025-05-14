import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main className="">
      <div className="flex flex-col gap-8 items-center sm:items-start w-full px-3 md:px-0">
        <Hero />

        <Separator className="w-full my-14 opacity-15" />

        <section className="flex flex-col items-center md:flex-row gap-10 w-full justify-center max-w-5xl">

          <Card className="relative bg-blue-500 bg-opacity-35 rounded-tr-sm rounded-bl-sm text-white border-none h-full w-full max-w-xl self-start h-[360px]">
            <div className="bg-blue-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute right-0 bottom-0"></div>
            <div className="bg-blue-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute top-0 left-0"></div>
            <CardHeader>
              <CardTitle className="text-2xl">
                Clam tokens now
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-7">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Soon..</h3>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
