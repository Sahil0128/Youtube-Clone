import  { useEffect, useState } from 'react'
import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { API_KEY, value_converter } from '../../data'
import moment from 'moment'
import {useParams} from 'react-router-dom'

const PlayVideo = () => {

    const {videoId} = useParams();
    
    const [apiData,setApiData] = useState(null);
    const [channelData,setChannelData] = useState(null);
    const [commentData,setCommentData] = useState([]);

    const fetchVideoData = async () =>{
        //Fetching videos data
        const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
        await fetch(videoDetails_url).then(res=>res.json()).then(data => setApiData(data.items));
    }
    
    const fetchOtherData = async () =>{
        //Fetching channel data
        const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
        await fetch(channelData_url).then(res=>res.json()).then(data => setChannelData(data.items));

        //fetching comment data
        const comment_url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2CcontentDetails%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
        await fetch(comment_url).then(res=>res.json().then(data => setCommentData(data.items)));


    }

    useEffect(()=>{
        fetchVideoData();
    },[videoId])

    useEffect(()=>{
        fetchOtherData();
    },[apiData])

  return (
    <div className='play-video'>
        {/*<video src={video1} controls autoPlay muted></video>*/}
        <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        <h3>{apiData?.[0]?.snippet?.title ?? "Title Here"}</h3>



        <div className="play-video-info">
            <p>{apiData ? value_converter(apiData[0].statistics.viewCount) : "16K"} views &bull; {apiData ? moment(apiData[0]?.snippet?.publishedAt).fromNow() : ""} </p>
            <div>
                <span><img src={like} alt="" />{apiData?value_converter(apiData[0].statistics.likeCount):155}</span>
                <span><img src={dislike} alt="" /></span>
                <span><img src={share} alt="" />Share</span>
                <span><img src={save} alt="" />Save</span>
            </div>
        </div>
        <hr />
        <div className="publisher">
            <img src={channelData?.snippet?.thumbnails?.default?.url ?? ""} alt="" />   
            <div>
                <p>{apiData?.[0]?.snippet?.channelTitle ?? ""}</p>
                <span>{channelData ? value_converter(channelData[0].statistics.subscriberCount) : "1M"} Subscribers</span>
            </div>
            <button>Subscribe</button>
        </div>
        <div className="vid-description">
            <p>{apiData?.[0]?.snippet?.description.slice(0,250) ?? "Description Here"}</p>
            <hr />
            <h4>{apiData?value_converter(apiData[0].statistics.commentCount):130} Comments</h4>
            {commentData.map((item, index) => {
                    return (
                        <div key={index} className="comment">
                            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                            <div>
                                <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>1 day ago</span></h3>
                                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                                <div className="comment-action">
                                    <img src={like} alt="" />
                                    <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                    <img src={dislike} alt="" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            
        </div>
    </div>
  )
}

export default PlayVideo