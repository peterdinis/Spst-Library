import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/authors/$authorId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/authors/$authorId"!</div>
}
