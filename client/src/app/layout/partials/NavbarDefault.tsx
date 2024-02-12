"use client";

import { logout } from "app/auth/AuthSlice";
import { Avatar, Badge, Dropdown, Navbar } from "flowbite-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setting } from "utils/func";

export default function NavbarDefault() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const logo = useSelector((state: any) => state.settings?.logo);

  return (
    <Navbar className="bg-white shadow-sm-light sticky top-0 z-10 mb-5 py-5">
      <Navbar.Brand
        className="flex w-full md:w-auto justify-center"
        as={Link}
        to="/dashboard"
      >
        <img
          alt="Flowbite React Logo"
          className="mr-3 h-20 md:h-20"
          src={logo}
        />
      </Navbar.Brand>
      <div className="items-center gap-4 md:order-2 hidden md:flex">
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Link as={Link} to={"/dashboard"}>
            Play Game
          </Navbar.Link>
          <Navbar.Link as={Link} to={"/results"}>
            Results
          </Navbar.Link>
          <Navbar.Link as={Link} to={"/wallet"}>
            Wallet
          </Navbar.Link>
          <Navbar.Link as={Link} to={"/bets"}>
            Bets
          </Navbar.Link>
        </Navbar.Collapse>
        <div className="ml-4">
          <p className="text-xs font-medium text-center text-slate-600">
            Balance
          </p>
          <Badge color={"warning"} className="text-lg">
            {user.balance}
          </Badge>
        </div>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              className="ml-5"
              alt="User settings"
              img="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
              rounded
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">{user.name}</span>
            <span className="block truncate text-sm font-medium">
              User ID: {user.id}
            </span>
          </Dropdown.Header>
          {/* <Dropdown.Item>Dashboard</Dropdown.Item> */}
          <Dropdown.Item as={Link} to={"/profile/edit"}>
            Edit Profile
          </Dropdown.Item>
          <Dropdown.Item as={Link} to={"/change-password"}>
            Change Password
          </Dropdown.Item>
          <Dropdown.Item as={Link} to={"/bank-accounts"}>
            Bank Accounts
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => dispatch(logout())}>
            Sign out
          </Dropdown.Item>
        </Dropdown>
      </div>
    </Navbar>
  );
}
