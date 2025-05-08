import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Sign in to view this page</div>;
  }

  const user = await currentUser();

  return (
    <section>
      <h1 className="text-3xl text-center">Hola</h1>
      <p className="text-center text-zinc-600">{user?.firstName}</p>
    </section>
  );
}
