import Image from "next/image";

interface LogoProps {}

export default function Logo({}: LogoProps) {
  return <Image height={130} width={130} alt="Logo" src="/logo.svg" />;
}
