import Bg from "../../public/bg.jpg";
import Link from "next/link";

export default function Zero() {
  return (
    <>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: `url(${Bg.src})`,
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">KELANARA</h1>
            <p className="mb-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita enim architecto debitis, suscipit sint, soluta pariatur nesciunt aliquam error adipisci ipsam. Quis hic fuga debitis! Odio sint provident omnis nihil?
            </p>
            <Link href="/login">
            <button className="btn btn-primary">Get Started</button>
            </Link> 
          </div>
        </div>
      </div>
    </>
  );
}
