import { FC } from "react";

type HeaderProps = {
  text: string;
};

const Header: FC<HeaderProps> = ({ text }: HeaderProps) => {
  return <h2 className="text-center mt-14 text-4xl font-bold">{text}</h2>;
};

export default Header;
