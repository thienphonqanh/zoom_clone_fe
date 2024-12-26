import CreateRoom from './create-room'
import HomeCalendar from './home-calendar'
import JoinRoom from './join-room'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="w-screen max-h-[92vh] h-[90vh]">
      <div className="container w-full h-full flex items-center">
        <div className="grid grid-cols-12 w-full h-full items-center">
          <div className="col-span-2"></div>
          <div className="col-span-3 flex flex-wrap w-4/5 ml-auto">
            <div className="flex flex-col items-center w-1/2">
              <CreateRoom />
            </div>
            <div className="flex flex-col items-center w-1/2">
              <JoinRoom />
            </div>
            <div className="w-1/2">
              <Link href="/schedule" className="flex flex-col items-center ">
                <button className="bg-blue-500 p-6 rounded-3xl hover:bg-blue-600 transition duration-150">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF" className="w-10 h-10">
                    <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                    <path
                      fillRule="evenodd"
                      d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <span className="text-sm mt-3 mb-12">Lịch trình</span>
              </Link>
            </div>
            <div className="flex flex-col items-center w-1/2">
              <button className="bg-blue-500 p-6 rounded-3xl hover:bg-blue-600 transition duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF" className="w-10 h-10">
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.03 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v4.94a.75.75 0 0 0 1.5 0v-4.94l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <span className="text-sm mt-3 mb-12">Chia sẻ màn hình</span>
            </div>
          </div>
          <div className="col-span-1"></div>
          <div className="col-span-3 border-2 border-gray-100 rounded-lg h-4/5 bg-[#f9f9f9]">
            <HomeCalendar />
          </div>
        </div>
      </div>
    </div>
  )
}
