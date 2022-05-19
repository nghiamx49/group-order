import React from "react";

const Footer = () => {
  return (
    <footer className="footer bg-gray-900 text-white relative pt-1 border-b-2 border-blue-700">
      <div className="container mx-auto px-6">
        <div className="sm:flex sm:mt-8">
          <div className="mt-8 sm:mt-0 sm:w-full sm:px-8 flex flex-col md:flex-row justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-white-700 uppercase mb-2">
                Category
              </span>
              <span className="my-2">
                <a
                  href="https://github.com/huynbt209/project-react"
                  className="text-white-700  text-md hover:text-white-500"
                >
                  Men
                </a>
              </span>
              <span className="my-2">
                <a
                  href="https://github.com/huynbt209/project-react"
                  className="text-white-700  text-md hover:text-white-500"
                >
                  Women
                </a>
              </span>
              <span className="my-2">
                <a
                  href="https://github.com/huynbt209/project-react"
                  className="text-white-700  text-md hover:text-white-500"
                >
                  Children
                </a>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white-700 uppercase mt-4 md:mt-0 mb-2">
                Trademark
              </span>
              <span className="my-2">
                <a
                  href="https://github.com/huynbt209/project-react"
                  className="text-white-700 text-md hover:text-white-500"
                >
                  Adidas
                </a>
              </span>
              <span className="my-2">
                <a
                  href="https://github.com/huynbt209/project-react"
                  className="text-white-700  text-md hover:text-white-500"
                >
                  Nike
                </a>
              </span>
              <span className="my-2">
                <a
                  href="https://github.com/huynbt209/project-react"
                  className="text-white-700 text-md hover:text-white-500"
                >
                  Van
                </a>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white-700 uppercase mt-4 md:mt-0 mb-2">
                Information
              </span>
              <span className="my-2">
                <a
                  href="https://github.com/huynbt209/project-react"
                  className="text-white-700  text-md hover:text-white-500"
                >
                  Github Repo
                </a>
              </span>
              <span className="my-2">
                <a
                  href="https://www.facebook.com/huy.nbt99/"
                  className="text-white-700  text-md hover:text-white-500"
                >
                  Facebook
                </a>
              </span>
              <span className="my-2">
                <a
                  href="https://github.com/huynbt209/project-react"
                  className="text-white-700  text-md hover:text-white-500"
                >
                  Instagram
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6">
        <div className="mt-16 border-t-2 border-gray-300 flex flex-col items-center">
          <div className="sm:w-2/3 text-center py-6">
            <p className="text-sm text-white-700 font-bold mb-2">
              © 2021 Worlds of Sneaker
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
