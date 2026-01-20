import NewAuthorPage from '@/components/authors/CreateNewAuthor'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/authors/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <NewAuthorPage />
}
