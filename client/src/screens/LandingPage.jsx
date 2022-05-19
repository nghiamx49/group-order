import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
const LandingPage = () => {
  const spanRef1 = useRef();
  const spanRef2 = useRef();

  useEffect(() => {
    gsap.to(spanRef1.current, {
      opacity: 1,
      left: 0,
      duration: 1,
      ease: "bounce",
    });
    gsap.to(spanRef2.current, {
      opacity: 1,
      bottom: 0,
      duration: 1,
      ease: "bounce",
    });
  }, []);

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span
                  className="block xl:inline"
                  ref={spanRef1}
                  style={{ left: -100, opacity: 0, position: "relative" }}
                >
                  Final Year Project
                </span>
                <br />
                <span
                  className="block text-indigo-600 xl:inline"
                  ref={spanRef2}
                  style={{ bottom: -200, opacity: 0, position: "relative" }}
                >
                  Sneaker E-commerce with Group Order
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Welcome to our website, create an Order and invite your friends
                and family to buy together now!
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    to="/product"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get started
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a
                    href="https://github.com/huynbt209/project-react"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                  >
                    Github Repo
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://newtran.vn/img/cms/2019%20xuan/nike-banner.jpg"
          alt=""
          style={{ transform: "scaleX(-1)" }}
        />
      </div>
    </div>
  );
};

export default LandingPage;
