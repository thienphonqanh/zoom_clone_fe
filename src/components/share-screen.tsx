import { useCallStateHooks } from '@stream-io/video-react-sdk'

export const CustomScreenShareButton = () => {
  const { useScreenShareState } = useCallStateHooks()
  const { screenShare, isMute: isScreenSharing } = useScreenShareState()
  return (
    <button onClick={() => screenShare.toggle()}>
      {isScreenSharing ? (
        <div className="str-video__composite-button">
          <div className="str-video__composite-button__button-group">
            <button
              type="button"
              className="str-video__composite-button__button"
              data-testid="screen-share-start-button"
            >
              <span className="str-video__icon str-video__icon--screen-share-off" />
            </button>
          </div>
        </div>
      ) : (
        <div className="str-video__composite-button">
          <div className="str-video__composite-button__button-group">
            <button
              type="button"
              className="str-video__composite-button__button"
              data-testid="screen-share-start-button"
            >
              <span className="str-video__icon str-video__icon--screen-share-on" />
            </button>
          </div>
        </div>
      )}
    </button>
  )
}
