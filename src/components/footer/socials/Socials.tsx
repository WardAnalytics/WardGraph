import clsx from "clsx";
import { FC } from "react";

import {
  FaGithub as github,
  FaLinkedin as linkedin,
  FaTelegram as telegram,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";

interface Social {
  name: string;
  Icon: IconType;
  link: string;
}

const SocialList: Social[] = [
  {
    name: "Github",
    Icon: github,
    link: "https://github.com/WardAnalytics/WardGraph",
  },
  {
    name: "Telegram",
    Icon: telegram,
    link: "https://t.me/+BopgfcEYo-I3NTg8",
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
      <Icon
        aria-label={`${name} Icon`}
        className="h-8 w-8 p-1 opacity-50 transition-all duration-200 hover:opacity-70"
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
