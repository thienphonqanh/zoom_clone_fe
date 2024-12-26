import Image from 'next/image'

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <div className="flex w-full h-full relative">
        <div className="w-[65%] bg-[#000538] text-white relative flex items-center">
          <div className="w-1/2 mx-24">
            <Image className="w-44 h-auto" src="/zoomicon.svg" alt="bg" width={0} height={0} />
            <h1 className="text-5xl font-bold leading-[1.15] mt-6">
              Gắn kết các nhóm thông qua tính năng hội nghị video
            </h1>
            <h2 className="text-xl mt-10">
              Cùng nhau kết nối, cộng tác và hoàn thành nhiều việc hơn với giải pháp cuộc họp video đáng tin cậy.
            </h2>
          </div>
        </div>
        <div className="w-[35%] bg-[#b5d0f8]"></div>
        <Image
          className="absolute right-0 bottom-0 -translate-x-[14%]"
          src="/mainbg.png"
          alt="bg"
          width={700}
          height={700}
          quality={60}
          priority
        />
      </div>
    </div>
  )
}
