import { NPB_STADIUMS } from "@/lib/stadiums";
import Image from "next/image"
import { notFound } from "next/navigation";


export async function  StadiumHeroImage({ 
    params 
  }: { 
    params: Promise<{ id: string }> 
  }) {
      const { id } = await params;
      const stadium = NPB_STADIUMS.find((s) => s.id === id);
    <s></s>
      if (!stadium) notFound();
    
      const stadiumImageUrl = `/images/stadiums/${stadium.id}.jpg`;
  return (
   <div className="w-full md:w-1/2 mx-auto relative h-[40vh] sm:h-[50vh] md:h-[60vh] bg-slate-900 group">
            <Image
              src={stadiumImageUrl}
              alt={stadium.name}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-slate-950 to-transparent"></div>
            <div className="max-w-4xl mx-auto absolute inset-x-0 bottom-0 px-8 pb-12 z-10">
              <h1 className="text-2xl md:text-5xl ml-20 md:ml-40 font-black italic tracking-tighter text-white flex items-center gap-2">
                <span className="w-1.5 h-8 md:h-12 bg-white block"></span>
                {stadium.name}
              </h1>
              <p className="text-white/70 font-bold mt-4 text-center text-lg uppercase tracking-wider ml-4">
                {stadium.team}
              </p>
            </div>
          </div>
  )
}

