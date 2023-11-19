import React, { useEffect, useState } from "react"
import styled from "styled-components"
import axios from "axios"
import Image from "next/image"

import Ads from "@/assets/images/ads.png"

const BannerWrapper = styled.div`
  margin-top: 30px;
  position: relative;
  width: 100%;
  max-width: 420px;
  aspect-ratio: 3.333;
  display: flex;
  overflow: hidden;
`

const BannerImageContent = styled.a`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-size: cover;
`

const BannerContact = styled.span<{ open: boolean }>`
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  padding: 8px;
  position: absolute;
  cursor: pointer;
  top: 0;
  right: 0;
  width: ${({ open }) => (open ? "360px" : "40px")};
  white-space: nowrap;
  display: flex;
  align-items: center;
  border-radius: 20px;
  text-decoration: none;
  transition: all 300ms ease-in-out;
  user-select: none;

  & > img {
    width: 24px;
    height: auto;
  }
`

const BannerLink = styled.span`
  font-size: 12px;
  margin-left: 8px;
  color: white;

  & > a {
    font-weight: 700;
    text-decoration: none;
  }
`

const Banner = () => {
  const [bannerData, setBannerData] = useState<any>()
  const [open, setOpen] = useState(false)

  const readDir = async () => {
    try {
      const data = await axios.get("/banner/config.json")
      setBannerData(data.data)
    } catch (err) {
      setBannerData(undefined)
    }
  }
  useEffect(() => {
    readDir()
  }, [])
  return bannerData && bannerData?.link && bannerData?.name ? (
    <BannerWrapper>
      <BannerImageContent
        href={bannerData.link}
        target="_blank"
        rel="noreferrer"
        style={{ backgroundImage: `url('banner/${bannerData.name}')` }}
      ></BannerImageContent>
      <BannerContact open={open} onClick={() => setOpen(!open)}>
        <Image src={Ads.src} width={Ads.width} height={Ads.height} alt="ads" />
        <BannerLink>
          For Advertising Here, Contact <strong>Team@moonsdust.com</strong>
        </BannerLink>
      </BannerContact>
    </BannerWrapper>
  ) : (
    <></>
  )
}

export default Banner
