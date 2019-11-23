import React from "react";

import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    LivejournalIcon,
    LivejournalShareButton,
    MailruIcon,
    MailruShareButton,
    OKIcon,
    OKShareButton,
    PinterestIcon,
    PinterestShareButton,
    RedditIcon,
    RedditShareButton,
    TelegramIcon,
    TelegramShareButton,
    TumblrIcon,
    TumblrShareButton,
    TwitterIcon,
    TwitterShareButton,
    ViberIcon,
    ViberShareButton,
    VKIcon,
    VKShareButton,
    WhatsappIcon,
    WhatsappShareButton,
} from 'react-share';

const Share = (props) => {
    return (
        <div className="Demo__container">
            <div className="opens3-share">
                <FacebookShareButton
                    url={props.url}
                    quote={props.title}
                    className="opens3-share-button">
                    <FacebookIcon
                        size={props.size}
                        round />
                </FacebookShareButton>
            </div>

            <div className="opens3-share">
                <TwitterShareButton
                    url={props.url}
                    title={props.title}
                    className="opens3-share-button">
                    <TwitterIcon
                        size={props.size}
                        round />
                </TwitterShareButton>

            </div>

            <div className="opens3-share">
                <TelegramShareButton
                    url={props.url}
                    title={props.title}
                    className="opens3-share-button">
                    <TelegramIcon size={props.size} round />
                </TelegramShareButton>

            </div>

            <div className="opens3-share">
                <WhatsappShareButton
                    url={props.url}
                    title={props.title}
                    separator=":: "
                    className="opens3-share-button">
                    <WhatsappIcon size={props.size} round />
                </WhatsappShareButton>

            </div>

            <div className="opens3-share">
                <LinkedinShareButton
                    url={props.url}
                    windowWidth={750}
                    windowHeight={600}
                    className="opens3-share-button">
                    <LinkedinIcon
                        size={props.size}
                        round />
                </LinkedinShareButton>
            </div>

            <div className="opens3-share">
                <PinterestShareButton
                    url={String(window.location)}
                    media={`${String(window.location)}/${props.image}`}
                    windowWidth={1000}
                    windowHeight={730}
                    className="opens3-share-button">
                    <PinterestIcon size={props.size} round />
                </PinterestShareButton>
            </div>

            <div className="opens3-share">
                <VKShareButton
                    url={props.url}
                    image={`${String(window.location)}/${props.image}`}
                    windowWidth={660}
                    windowHeight={460}
                    className="opens3-share-button">
                    <VKIcon
                        size={props.size}
                        round />
                </VKShareButton>
            </div>

            <div className="opens3-share">
                <OKShareButton
                    url={props.url}
                    image={`${String(window.location)}/${props.image}`}
                    className="opens3-share-button">
                    <OKIcon
                        size={props.size}
                        round />
                </OKShareButton>

            </div>

            <div className="opens3-share">
                <RedditShareButton
                    url={props.url}
                    title={props.title}
                    windowWidth={660}
                    windowHeight={460}
                    className="opens3-share-button">
                    <RedditIcon
                        size={props.size}
                        round />
                </RedditShareButton>

            </div>

            <div className="opens3-share">
                <TumblrShareButton
                    url={props.url}
                    title={props.title}
                    windowWidth={660}
                    windowHeight={460}
                    className="opens3-share-button">
                    <TumblrIcon
                        size={props.size}
                        round />
                </TumblrShareButton>

            </div>

            <div className="opens3-share">
                <LivejournalShareButton
                    url={props.url}
                    title={props.title}
                    description={props.url}
                    className="opens3-share-button"
                >
                    <LivejournalIcon size={props.size} round />
                </LivejournalShareButton>
            </div>

            <div className="opens3-share">
                <MailruShareButton
                    url={props.url}
                    title={props.title}
                    className="opens3-share-button">
                    <MailruIcon
                        size={props.size}
                        round />
                </MailruShareButton>
            </div>

            <div className="opens3-share">
                <EmailShareButton
                    url={props.url}
                    subject={props.title}
                    body="body"
                    className="opens3-share-button">
                    <EmailIcon
                        size={props.size}
                        round />
                </EmailShareButton>
            </div>
            <div className="opens3-share">
                <ViberShareButton
                    url={props.url}
                    title={props.title}
                    className="opens3-share-button">
                    <ViberIcon
                        size={props.size}
                        round />
                </ViberShareButton>
            </div>

        </div>
    )
}

export default Share;