import { getProviders, signIn } from "next-auth/react";

function Login({ providers }) {
  return (
    <div className="flex flex-col bg-spotifyBlack// bg-gradient-to-tr from-[#333333] to-[#000000] min-h-screen justify-center items-center">
      {Object.values(providers).map((provider, i) => (
        <div
          className="flex flex-col items-center space-y-1.5"
          key={provider.name}
        >
          <h1 className="text-white text-5xl xxs:text-6xl font-bold">
            TrackTrends{" "}
          </h1>
          <p className="text-white/60 !mb-3.5 text-center text-base xxs:text-lg font-semibold mx-3">
            Personal <span className="text-spotifyGreen">spotify stats</span>,
            discover tracks, play previews, create playlists.
          </p>

          <button
            class="relative inline-flex  group cursor-pointer"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            <div class="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-spotifyGreen/60 rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 "></div>
            <p
              className="relative inline-flex items-center justify-center px-6 py-3.5 text-lg font-semibold text-white/80 transition-all duration-200 bg-spotifyGreen rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              role="button"
            >
              Login with {provider.name}
            </p>
          </button>
          <h3 className="text-white/60 !mt-10 text-xs">
            Created by{" "}
            <a
              href="https://petere-portfolio-2.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline "
            >
              Peter
            </a>
          </h3>
        </div>
      ))}
    </div>
  );
}

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();
  //console.log(providers);
  return {
    props: {
      providers,
    },
  };
}
