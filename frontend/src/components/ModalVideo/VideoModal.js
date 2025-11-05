
import React, { useState } from 'react'
import ModalVideo from 'react-modal-video'
import '../../../node_modules/react-modal-video/scss/modal-video.scss';


const VideoModal = () => {

  const [isOpen, setOpen] = useState(false)

  return (
    <React.Fragment>
      <ModalVideo channel='youtube' autoplay isOpen={isOpen} videoId="r5sw-6lJmTA" onClose={() => setOpen(false)} />

      <div className="video-btn">
        <button className="btn-wrap" onClick={() => setOpen(true)}><i className="fi flaticon-play-1" aria-hidden="true"></i></button>
      </div>

    </React.Fragment>
  )
}

export default VideoModal;