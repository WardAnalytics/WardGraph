import { FC } from "react";
import clsx from "clsx";

import discord from "../../assets/discord.svg";
import github from "../../assets/github.svg";
import linkedin from "../../assets/linkedin.svg";

interface Social {
  name: string;
  Icon: string;
  link: string;
}

const SocialList: Social[] = [
  {
    name: "Github",
    Icon: github,
    link: "https://github.com/WardAnalytics/WardGraph",
  },
  {
    name: "Discord",
    Icon: discord,
    link: "https://discord.gg/4ZzgeUwa",
  },
  {
    name: "LinkedIn",
    Icon: linkedin,
    link: "https://www.linkedin.com/company/wardanalytics/",
  },
];

const SocialButton: FC<Social> = ({ name, Icon, link }) => {
  return (
    <a href={link} target="_blank" rel="noreferrer">
      <img
        src={Icon}
        alt={`${name} Icon`}
        className="h-8 w-8 rounded-full p-1 opacity-50 backdrop-blur-sm transition-all duration-200 hover:opacity-70"
      />
    </a>
  );
};

interface SocialsProps {
  className?: string;
}

const Socials: FC<SocialsProps> = ({ className }) => {
  return (
    <div className={clsx("flex flex-row gap-x-2", className)}>
      {SocialList.map((social) => {
        return <SocialButton {...social} key={social.name} />;
      })}
    </div>
  );
};

export default Socials;
