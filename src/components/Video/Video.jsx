import React from 'react';

const Video = ({ link }) => {
    let embedUrl;

    if (!link) {
        return null;
    }

    let videoId;
    
    if (link.includes("embed")) {
        embedUrl = link;
    } else if (link.includes("v=")) {
        videoId = link.split("v=")[1]?.split("&")[0];
    } else if (link.includes("youtu.be/")) {
        videoId = link.split("youtu.be/")[1]?.split("?")[0];
    } else if (link.includes("youtube.com/shorts/")) { 
        videoId = link.split("youtube.com/shorts/")[1]?.split("?")[0];
    }

    if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else {
        console.error("Invalid YouTube URL");
        return null;
    }

    return (
        <div className="boxc">
            <iframe 
                width="100%" 
                height="400" 
                src={embedUrl} 
                title="YouTube Video" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default Video;
