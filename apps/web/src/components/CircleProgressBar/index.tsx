import styled from "styled-components"

const ProgressBar = styled.div<{ percent: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;

  width: 50px;
  min-width: 50px;
  height: 50px;
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
