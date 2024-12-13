import { Content } from "../Content"

export default function ProfileLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <Content type="client">
        {children}
      </Content>
    )
  }