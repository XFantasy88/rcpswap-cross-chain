"use client"

import React, { useCallback, useState } from "react"
import { FiHelpCircle as Question } from "react-icons/fi"
import styled from "styled-components"
// import Tooltip from "../Tooltip"
import { Tooltip } from "react-tooltip"
import { transparentize } from "polished"

const QuestionWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  width: fit-content;
  cursor: default;
  border-radius: 36px;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text2};

  &:hover,
  &:focus {
    opacity: 0.7;
  }
`

const StyledTooltip = styled(Tooltip)`
  z-index: 9999;
  background: ${({ theme }) => theme.bg2} !important;
  border: 1px solid ${({ theme }) => theme.bg3} !important;
  box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.9, theme.shadow1)} !important;
  color: ${({ theme }) => theme.text2} !important;
  border-radius: 8px !important;

  width: 240px !important;
  padding: 0.6rem 1rem;
  line-height: 150%;
  font-weight: 400;
  font-size: 16px !important;
  text-align: left !important;
`

export default function QuestionHelper({
  id,
  content,
}: {
  id: string
  content: React.ReactNode
}) {
  return (
    <>
      <QuestionWrapper id={id}>
        <Question size={16} />
      </QuestionWrapper>
      <StyledTooltip anchorSelect={`#${id}`} clickable>
        {content}
      </StyledTooltip>
    </>
  )
}
