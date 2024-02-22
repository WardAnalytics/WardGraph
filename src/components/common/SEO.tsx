import { FC } from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
    title: string;
    description: string;
    creator?: string;
    type?: string;
}

const SEO: FC<SEOProps> = ({
    title,
    description,
    creator = "Ward Analytics",
    type = "website",
}) => {
    return (
        <Helmet>
            { /* Standard metadata tags */}
            <title>{`Ward Analytics - ${title}`}</title>
            <meta name='description' content={description} />
            { /* End standard metadata tags */}
            { /* Facebook tags
                For more information, visit https://ogp.me/
            */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            { /* End Facebook tags */}
            { /* Twitter tags 
                For more information, visit https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary
            */}
            <meta name="twitter:creator" content={creator} />
            <meta name="twitter:card" content={type} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            { /* End Twitter tags */}
        </Helmet>
    )
}

export default SEO;