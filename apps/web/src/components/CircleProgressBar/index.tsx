import styled from "styled-components"

const ProgressBar = styled.div<{ percent: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;

  width: 48px;
  min-width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme, percent }) => `radial-gradient(closest-side, ${
    theme.bg1
  } 88%, transparent 90% 100%),
    conic-gradient(${percent >= 100 ? theme.green1 : theme.red1} ${percent}%, ${
    theme.bg2
  } 0)`};
`

const CircleProgressBar = ({
  current,
  total,
}: {
  current: number
  total: number
}) => {
  return (
    <ProgressBar percent={(current / total) * 100}>
      {current}/{total}
    </ProgressBar>
  )
}

export default CircleProgressBar
