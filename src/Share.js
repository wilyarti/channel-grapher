import React from "react";

import {
    FacebookShareCount,
    PinterestShareCount,
    VKShareCount,
    OKShareCount,
    RedditShareCount,
    TumblrShareCount,

    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    PinterestShareButton,
    VKShareButton,
    OKShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    RedditShareButton,
    EmailShareButton,
    TumblrShareButton,
    LivejournalShareButton,
    MailruShareButton,
    ViberShareButton,
    WorkplaceShareButton,
    LineShareButton,
    WeiboShareButton,
    PocketShareButton,
    InstapaperShareButton,

    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    PinterestIcon,
    VKIcon,
    OKIcon,
    TelegramIcon,
    WhatsappIcon,
    RedditIcon,
    TumblrIcon,
    MailruIcon,
    EmailIcon,
    LivejournalIcon,
    ViberIcon,
    WorkplaceIcon,
    LineIcon,
    PocketIcon,
    InstapaperIcon,
} from 'react-share';

const Share = (props) => {
    return (
        <div className="Demo__container">
            <div className="Demo__some-network">
                <FacebookShareButton
                    url={props.url}
                    quote={props.title}
                    className="Demo__some-network__share-button">
                    <FacebookIcon
                        size={props.size}
                        round />
                </FacebookShareButton>

                <FacebookShareCount
                    url={props.url}
                    className="Demo__some-network__share-count">
                    {count => count}
                </FacebookShareCount>
            </div>

            <div className="Demo__some-network">
                <TwitterShareButton
                    url={props.url}
                    title={props.title}
                    className="Demo__some-network__share-button">
                    <TwitterIcon
                        size={props.size}
                        round />
                </TwitterShareButton>

                <div className="Demo__some-network__share-count">
                    &nbsp;
                </div>
            </div>

            <div className="Demo__some-network">
                <TelegramShareButton
                    url={props.url}
                    title={props.title}
                    className="Demo__some-network__share-button">
                    <TelegramIcon size={props.size} round />
                </TelegramShareButton>

                <div className="Demo__some-network__share-count">
                    &nbsp;
                </div>
            </div>

            <div className="Demo__some-network">
                <WhatsappShareButton
                    url={props.url}
                    title={props.title}
                    separator=":: "
                    className="Demo__some-network__share-button">
                    <WhatsappIcon size={props.size} round />
                </WhatsappShareButton>

                <div className="Demo__some-network__share-count">
                    &nbsp;
                </div>
            </div>

            <div className="Demo__some-network">
                <LinkedinShareButton
                    url={props.url}
                    windowWidth={750}
                    windowHeight={600}
                    className="Demo__some-network__share-button">
                    <LinkedinIcon
                        size={props.size}
                        round />
                </LinkedinShareButton>
            </div>

            <div className="Demo__some-network">
                <PinterestShareButton
                    url={String(window.location)}
                    media={`${String(window.location)}/${props.image}`}
                    windowWidth={1000}
                    windowHeight={730}
                    className="Demo__some-network__share-button">
                    <PinterestIcon size={props.size} round />
                </PinterestShareButton>

                <PinterestShareCount url={props.url}
                                     className="Demo__some-network__share-count" />
            </div>

            <div className="Demo__some-network">
                <VKShareButton
                    url={props.url}
                    image={`${String(window.location)}/${props.image}`}
                    windowWidth={660}
                    windowHeight={460}
                    className="Demo__some-network__share-button">
                    <VKIcon
                        size={props.size}
                        round />
                </VKShareButton>

                <VKShareCount url={props.url}
                              className="Demo__some-network__share-count" />
            </div>

            <div className="Demo__some-network">
                <OKShareButton
                    url={props.url}
                    image={`${String(window.location)}/${props.image}`}
                    className="Demo__some-network__share-button">
                    <OKIcon
                        size={props.size}
                        round />
                </OKShareButton>

                <OKShareCount url={props.url}
                              className="Demo__some-network__share-count" />
            </div>

            <div className="Demo__some-network">
                <RedditShareButton
                    url={props.url}
                    title={props.title}
                    windowWidth={660}
                    windowHeight={460}
                    className="Demo__some-network__share-button">
                    <RedditIcon
                        size={props.size}
                        round />
                </RedditShareButton>

                <RedditShareCount url={props.url}
                                  className="Demo__some-network__share-count" />
            </div>

            <div className="Demo__some-network">
                <TumblrShareButton
                    url={props.url}
                    title={props.title}
                    windowWidth={660}
                    windowHeight={460}
                    className="Demo__some-network__share-button">
                    <TumblrIcon
                        size={props.size}
                        round />
                </TumblrShareButton>

                <TumblrShareCount url={props.url}
                                  className="Demo__some-network__share-count" />
            </div>

            <div className="Demo__some-network">
                <LivejournalShareButton
                    url={props.url}
                    title={props.title}
                    description={props.url}
                    className="Demo__some-network__share-button"
                >
                    <LivejournalIcon size={props.size} round />
                </LivejournalShareButton>
            </div>

            <div className="Demo__some-network">
                <MailruShareButton
                    url={props.url}
                    title={props.title}
                    className="Demo__some-network__share-button">
                    <MailruIcon
                        size={props.size}
                        round />
                </MailruShareButton>
            </div>

            <div className="Demo__some-network">
                <EmailShareButton
                    url={props.url}
                    subject={props.title}
                    body="body"
                    className="Demo__some-network__share-button">
                    <EmailIcon
                        size={props.size}
                        round />
                </EmailShareButton>
            </div>
            <div className="Demo__some-network">
                <ViberShareButton
                    url={props.url}
                    title={props.title}
                    className="Demo__some-network__share-button">
                    <ViberIcon
                        size={props.size}
                        round />
                </ViberShareButton>
            </div>

            <div className="Demo__some-network">
                <WorkplaceShareButton
                    url={props.url}
                    quote={props.title}
                    className="Demo__some-network__share-button">
                    <WorkplaceIcon
                        size={props.size}
                        round />
                </WorkplaceShareButton>
            </div>

            <div className="Demo__some-network">
                <LineShareButton
                    url={props.url}
                    title={props.title}
                    className="Demo__some-network__share-button">
                    <LineIcon
                        size={props.size}
                        round />
                </LineShareButton>
            </div>

            <div className="Demo__some-network">
                <WeiboShareButton
                    url={props.url}
                    title={props.title}
                    image={`${String(window.location)}/${props.image}`}
                    className="Demo__some-network__share-button">
                    <img className="Demo__some-network__custom-icon" src="http://icons.iconarchive.com/icons/martz90/circle-addon2/512/weibo-icon.png" alt="Weibo share button" />
                </WeiboShareButton>
            </div>

            <div className="Demo__some-network">
                <PocketShareButton
                    url={props.url}
                    title={props.title}
                    className="Demo__some-network__share-button">
                    <PocketIcon
                        size={props.size}
                        round />
                </PocketShareButton>
            </div>

            <div className="Demo__some-network">
                <InstapaperShareButton
                    url={props.url}
                    title={props.title}
                    className="Demo__some-network__share-button">
                    <InstapaperIcon
                        size={props.size}
                        round />
                </InstapaperShareButton>
            </div>
        </div>
    )
}

export default Share;