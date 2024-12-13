import { Content } from "../Content"

export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <Content type="dashboard">
        {children}
      </Content>
    )
  }