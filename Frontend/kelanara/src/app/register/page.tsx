"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        email,
        password,
        role: "user",
      });

      console.log("Register response:", response.data);
      // lanjutkan seperti simpan token atau redirect
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Register error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <>
      <div className="hero bg-base-200 min-h-screen ">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left md:w-1/2">
            <h1 className="text-5xl font-bold">Register now!</h1>
            <p className="py-6">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad id
              aspernatur illo ullam dicta recusandae. Pariatur inventore nam
              amet accusamus omnis eligendi magni exercitationem similique
              maiores. Officiis, illo provident. Architecto! Lorem ipsum dolor
              sit amet consectetur adipisicing elit. Explicabo, incidunt
              veritatis aperiam consequuntur odit perspiciatis assumenda vitae
              alias, fugit hic odio facere nobis illum? Ab numquam ex modi quis
              distinctio.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl md:w-1/2">
            <div className="card-body">
              <div className="card-body">
                <fieldset className="fieldset">
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label className="label">Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div>
                    <a className="link link-hover">Forgot password?</a>
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-around md:gap-4">
                    <button
                      onClick={handleRegister}
                      className="btn btn-neutral mt-4 w-full md:w-1/2 md:mt-0"
                    >
                      Register
                    </button>
                    <Link href="/login" className="w-full md:w-1/2">
                      <button className="btn btn-neutral mt-4 w-full md:mt-0">
                        login
                      </button>
                    </Link>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
