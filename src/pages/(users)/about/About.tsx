import { socket } from "@/hooks/socket";
import { UserContext } from "@/utils/userContext";
import { useContext, useEffect } from "react";

export default function About() {
  const user = useContext(UserContext)?.user;
  const sessionId = useContext(UserContext)?.sessionId;
  useEffect(() => {
    socket.emit("visitAboutPage", {
      userId: user?.id,
      sessionId,
    });
  }, [sessionId, user]);
  return (
    <>
      <div className="w-full h-[400px] flex flex-col gap-10 items-center justify-center px-4 mb-10 rounded-2xl overflow-hidden bg-gray-100 bg-[url(https://images.unsplash.com/photo-1503423571797-2d2bb372094a?q=80&w=1440&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)]">
        <h1 className="text-3xl font-light text-white text-center text-balance">
          About Page
        </h1>
      </div>

      <h3 className="text-lg text-gray-600 lg:pt-10 mb-2">About App</h3>
      <p className="text-sm text-gray-500">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae sed
        quis beatae, recusandae blanditiis saepe perferendis! Quis minima eius
        cum?
      </p>
      <p className="text-sm text-gray-500 my-2">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo asperiores
        similique necessitatibus molestias vel nam totam, dolores praesentium,
        dolorem dolor distinctio, in voluptates quia tempore recusandae libero
        animi neque! Tenetur explicabo quisquam dolorem perferendis vero debitis
        rem ratione eius similique dolor cum porro vel sit eligendi consequuntur
        adipisci, fuga magnam.
      </p>

      <p className="text-sm text-gray-500">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus,
        voluptas?
      </p>

      <p className="text-sm text-gray-500 my-2">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo asperiores
        similique necessitatibus molestias vel nam totam, dolores praesentium,
        dolorem dolor distinctio, in voluptates quia tempore recusandae libero
        animi neque! Tenetur explicabo quisquam dolorem perferendis vero debitis
        rem ratione eius similique dolor cum porro vel sit eligendi consequuntur
        adipisci, fuga magnam.
      </p>
      <p className="text-sm text-gray-500">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae sed
        quis beatae, recusandae blanditiis saepe perferendis! Quis minima eius
        cum?
      </p>
    </>
  );
}
