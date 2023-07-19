import { Button } from "react-daisyui";
import { NavLink } from "react-router-dom";

import { FullPage } from "@/components/page/full";
import { Showoff } from "@/features/landing/showoff";

export function Landing() {
  return (
    <FullPage className="p-4">
      <section className="bg-black bg-opacity-80 rounded-md p-12 stripe-bg">
        <h1 className="text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-indigo-500">
          Welcome to your library
        </h1>
        <h3 className="text-3xl font-medium">Read your local books in an easy to use and intuitive interface.</h3>
        <p className="prose mt-8">
          No data is ever sent to our servers. That means, you can just chill around and even use this site if you do
          not have internet access.
        </p>
        <NavLink to="/app">
          <Button color="primary" className="mt-12">
            Launch app
          </Button>
        </NavLink>
      </section>
      <section className="mt-12">
        <Showoff />
      </section>
      <section className="text-gray-500 text-sm mx-12 mt-12">
        Yes, even sharing to another device is done with peer to peer connections and never goes through our servers!
      </section>
    </FullPage>
  );
}
