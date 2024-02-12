"use client";

import { Footer } from "flowbite-react";
import { BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function FooterBlock() {
  const site_title = useSelector(({ settings }) => settings?.site_title);

  return (
    <Footer className="flex-col rounded-none">
      <div className="container w-full mx-auto">
        <div className="pl-5 grid w-full grid-cols-1 gap-8 py-8 md:grid-cols-3">
          <div>
            <Footer.Title title="Play Game" />
            <Footer.LinkGroup col>
              <li className="last:mr-0 md:mr-6">
                <Link to="/dashboard" className="hover:underline">
                  Withdraw Money
                </Link>
              </li>
              <li className="last:mr-0 md:mr-6">
                <Link to="/dashboard" className="hover:underline">
                  Easy Play
                </Link>
              </li>
              <li className="last:mr-0 md:mr-6">
                <Link to="/dashboard" className="hover:underline">
                  Color Picker
                </Link>
              </li>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Wallet" />
            <Footer.LinkGroup col>
              <li className="last:mr-0 md:mr-6">
                <Link to="/wallet" className="hover:underline">
                  Transactions
                </Link>
              </li>
              <li className="last:mr-0 md:mr-6">
                <Link to="/wallet/add" className="hover:underline">
                  Add money
                </Link>
              </li>
              <li className="last:mr-0 md:mr-6">
                <Link to="/wallet/withdraw" className="hover:underline">
                  Withdraw Money
                </Link>
              </li>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="legal" />
            <Footer.LinkGroup col>
              <Footer.Link href="/legal/privacy.html">
                Privacy Policy
              </Footer.Link>
              <Footer.Link href="/legal/terms.html">
                Terms & Conditions
              </Footer.Link>
              <Footer.Link href="/legal/refunds.html">
                Refund Policy
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>
      </div>
      <div className="w-full text-center md:text-start bg-slate-700">
        <div className="container mx-auto  space-y-4 sm:flex sm:items-center sm:justify-between py-6">
          <Footer.Copyright
            by={site_title}
            href="#"
            year={new Date().getFullYear()}
          />
          <div className="mt-0 flex space-x-6 md:mt-4 justify-center md:justify-start">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsGithub} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
