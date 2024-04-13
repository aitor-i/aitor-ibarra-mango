import Link from "next/link";
import Image from "next/image";

import mangoImg from '@/../public/mango.svg'

export default function Header() {
  return (
    <nav className="grid grid-cols-4 md:grid-cols-8 px-4 py-4 md:px-8 gap-4">
      <span>
        <Link href={"/"}>
          <Image src={mangoImg} placeholder="empty" alt="Mango" />
        </Link>
      </span>
      <Link className="col-start-6" href={"/exercise1"}>Exercise 1</Link>
      <Link className="col-start-7" href={"/exercise2"}>Exercise 2</Link>
    </nav>
  )
}
