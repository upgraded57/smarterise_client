import { ImgType } from "@/types/types";
import { Link } from "react-router";

export default function Picture({
  img,
  admin,
}: {
  img: ImgType;
  admin?: boolean;
}) {
  return (
    <Link
      to={admin ? `/admin/pictures/${img.id}` : `/picture/${img.id}`}
      className="w-full min-h-[160px] p-2 bg-gray-100 hover:bg-gray-200 rounded-xl"
    >
      <div className="w-full bg-gray-200 aspect-square overflow-hidden rounded-t-md">
        <img
          src={img?.download_url}
          alt="Image"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-1 mt-4 mb-2">
        <p className="text-sm">{img?.name}</p>
        <p className="font-light text-xs">Author - {img?.author}</p>
        {admin && <p className="text-xs">Views - {img?.views}</p>}
      </div>
    </Link>
  );
}
