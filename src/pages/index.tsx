import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { getZapdosAuthSession } from "../server/common/get-server-session";

import { FaCopy, FaSignOutAlt } from "react-icons/fa";
import dynamic from "next/dynamic";

const LazyQuestionsView = dynamic(() => import("../components/my-questions"), {
  ssr: false,
});

const copyUrlToClipboard = (path: string) => () => {
  if (!process.browser) return;
  navigator.clipboard.writeText(`${window.location.origin}${path}`);
};

const NavButtons: React.FC<{ userId: string }> = ({ userId }) => {
  const { data: sesh } = useSession();

  return (
    <div className="flex gap-2">
      <button
        onClick={copyUrlToClipboard(`/embed/${userId}`)}
        className="bg-gray-200 text-gray-800 p-4 rounded hover:bg-gray-100 font-bold flex gap-2"
      >
        Copy embed url <FaCopy size={24} />
      </button>
      <button
        onClick={copyUrlToClipboard(`/ask/${sesh?.user?.name?.toLowerCase()}`)}
        className="bg-gray-200 text-gray-800 p-4 rounded hover:bg-gray-100 font-bold flex gap-2"
      >
        Copy Q&A url <FaCopy size={24} />
      </button>
      <button
        onClick={() => signOut()}
        className="bg-gray-200 text-gray-800 p-4 rounded hover:bg-gray-100 font-bold flex gap-2"
      >
        Logout <FaSignOutAlt size={24} />
      </button>
    </div>
  );
};

const HomeContents = () => {
  const { data } = useSession();

  if (!data)
    return (
      <div>
        <div>Please log in</div>
        <button onClick={() => signIn("twitch")}>Sign in with Twitch</button>
      </div>
    );

  return (
    <div className="flex flex-col p-8">
      <div className="flex justify-between w-full items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {data.user?.image && (
            <img
              src={data.user?.image}
              alt="pro pic"
              className="rounded-full w-16"
            />
          )}
          {data.user?.name}
        </h1>
        <NavButtons userId={data.user?.id!} />
      </div>
      <div className="p-4" />
      <LazyQuestionsView />
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Stream Q&A Tool</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomeContents />
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      session: await getZapdosAuthSession(ctx),
    },
  };
};

export default Home;
