import Picture from "@/components/picture";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchImgs } from "@/hooks/hooks";

export default function Pictures() {
  const { imgs, isLoading } = useFetchImgs();
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg">All Pictures</h2>
        <p className="text-sm font-light">
          View a live summary of all pictures. Click on a picture to see how its
          doing
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {isLoading
          ? [1, 2, 3, 4, 5, 6, 7, 8].map((_, idx) => (
              <Skeleton
                className="w-full min-w-[200px] aspect-square mr-4"
                key={idx}
              />
            ))
          : imgs?.map((img, idx) => <Picture key={idx} img={img} admin />)}
      </div>
    </>
  );
}
