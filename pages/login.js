import { getProviders, signIn } from "next-auth/react";

function Login({ providers }) {
  return (
    <div className="flex flex-col bg-black min-h-screen justify-center items-center">
      <img className="w-52 mb-3" src="https://links.papareact.com/9xl" alt="" />
      {Object.values(providers).map((provider, i) => (
        <div className="" key={provider.name}>
          <h1 className="text-white text-2xl text-center">Spotify stats</h1>
          <h3 className="text-white text-center mb-3">By Pete</h3>
          <button
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            className="bg-[#18D860] text-white p-5 rounded-3xl transition duration-150 hover:opacity-75"
          >
            Login with {provider.name}
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
