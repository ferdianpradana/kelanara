"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from 'jwt-decode'


export default function Login() {
  const [email, setEmail] = useState("");   
  const [password, setPassword] = useState("");
    const router = useRouter(); 

interface TokenPayload {
  id: number
  email: string
  role: string
  iat: number
  exp: number
}
 const handleLogin = async () => {
  try {
    const response = await axios.post("http://localhost:3000/auth/login", {
      email,
      password,
    });

    const token = response.data.token;
    localStorage.setItem("token", token);

    // Decode token untuk dapatkan role
    const decoded = jwtDecode<TokenPayload>(token);

    console.log("Login as:", decoded.role);

    // Redirect berdasarkan role
    if (decoded.role === "admin") {
      router.push("/admin/home");
    } else {
      router.push("/home");
    }

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Login error:", error.response?.data || error.message);
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
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl md:w-1/2">
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
                    onClick={handleLogin}
                    className="btn btn-neutral mt-4 w-full md:w-1/2 md:mt-0"
                  >
                    Login
                  </button>
                  <Link href="/register" className="w-full md:w-1/2">
                    <button className="btn btn-neutral mt-4 w-full md:mt-0">
                      Register
                    </button>
                  </Link>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
