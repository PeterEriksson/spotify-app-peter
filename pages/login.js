import { getProviders, signIn } from "next-auth/react";

function Login({ providers }) {
  return (
    <div className="flex flex-col bg-spotifyBlack min-h-screen justify-center items-center">
      {Object.values(providers).map((provider, i) => (
        <div className="flex flex-col items-center" key={provider.name}>
          <h1 className="text-white text-4xl underline">TrackTrends </h1>
          <p className="text-white/70 my-2 text-center text-sm  mx-3">
            See your <span className="text-spotifyGreen">spotify stats</span>,
            discover new tracks, play previews, create playlists.
          </p>
          <h3 className="text-white/60 mb-3 text-xs">By Peter</h3>

          <button
            class="relative inline-flex  group  cursor-pointer"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            <div class="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-spotifyGreen/70 rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
            <p
              className="relative inline-flex items-center justify-center px-6 py-3.5 text-lg font-bold text-white/80 transition-all duration-200 bg-spotifyGreen font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              role="button"
            >
              Login with {provider.name}
            </p>
          </button>
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
