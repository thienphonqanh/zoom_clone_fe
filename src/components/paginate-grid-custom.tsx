import React, { useState } from 'react'
import { ParticipantView, useCallStateHooks } from '@stream-io/video-react-sdk'

export default function CustomPaginateGridLayout() {
  const { useParticipants, useHasOngoingScreenShare } = useCallStateHooks()
  const participants = useParticipants()
  const isSomeoneScreenSharing = useHasOngoingScreenShare()

  const GROUP_SIZE = 9

  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = Math.ceil(participants.length / GROUP_SIZE)

  const currentParticipants = participants.slice(currentPage * GROUP_SIZE, (currentPage + 1) * GROUP_SIZE)

  const groupClassName = (() => {
    if (currentParticipants.length === 1) {
      return 'str-video__paginated-grid-layout__group str-video__paginated-grid-layout--one'
    }
    if (currentParticipants.length >= 2 && currentParticipants.length <= 4) {
      return 'str-video__paginated-grid-layout__group str-video__paginated-grid-layout--two-four'
    }
    if (currentParticipants.length >= 5 && currentParticipants.length <= GROUP_SIZE) {
      return 'str-video__paginated-grid-layout__group str-video__paginated-grid-layout--five-nine'
    }
    return ''
  })()

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="str-video__paginated-grid-layout__wrapper">
      <div className="str-video__paginated-grid-layout">
        <div className={groupClassName}>
          {currentParticipants.map((participant) => {
            if (isSomeoneScreenSharing) {
              return (
                <ParticipantView
                  trackType="screenShareTrack"
                  participant={participant}
                  key={`${participant.sessionId}-screen`}
                />
              )
            }
            return <ParticipantView participant={participant} key={participant.sessionId} />
          })}
        </div>
      </div>
      {totalPages > 1 && (
        <>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className="str-video__call-controls__button absolute top-[43%] left-3"
          >
            <span className="str-video__icon str-video__icon--caret-left"></span>
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="str-video__call-controls__button absolute top-[43%] right-3"
          >
            <span className="str-video__icon str-video__icon--caret-right"></span>
          </button>
        </>
      )}
    </div>
  )
}
