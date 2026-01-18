import CreateCategoryForm from '@/components/categories/CreateCategoryForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/categories/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CreateCategoryForm />
}
