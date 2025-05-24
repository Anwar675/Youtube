import Image from "next/image"
export default function Home() {
  return (
    <div>
      <Image src='/logo.svg' height={50} width={50} alt="tayube"/>
      <p className="text-xl font-bold tracking-tighter">Tayube</p>
    </div>
  )
}