import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { useState } from 'react'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  BookOpen,
  FolderTree,
  Tag,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Id } from 'convex/_generated/dataModel'
import { api } from 'convex/_generated/api'

export const Route = createFileRoute('/categories/$categoryId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { categoryId } = Route.useParams()
  const navigate = useNavigate()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [moveToCategory] = useState<string>('')

  const category = useQuery(api.categories.getCategoryById, {
    id: categoryId as Id<'categories'>,
  })

  const deleteCategory = useMutation(api.categories.deleteCategory)
  const toggleActive = useMutation(api.categories.toggleCategoryActive)

  const handleDelete = async () => {
    try {
      await deleteCategory({
        id: categoryId as Id<'categories'>,
        moveBooksTo: moveToCategory ? (moveToCategory as Id<'categories'>) : undefined,
      })
      toast.success('Category deleted successfully')
      navigate({ to: '/categories' })
    } catch (error: any) {
      toast.error('Failed to delete category', {
        description: error.message || 'Please try again',
      })
    }
  }

  const handleToggleActive = async () => {
    try {
      const result = await toggleActive({ id: categoryId as Id<'categories'> })
      toast.success(
        result.isActive ? 'Category activated' : 'Category deactivated'
      )
    } catch (error: any) {
      toast.error('Failed to update status', {
        description: error.message,
      })
    }
  }

  if (category === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 animate-in fade-in duration-300">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading category details...</p>
        </div>
      </div>
    )
  }

  if (category === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
              <div>
                <h2 className="text-2xl font-bold">Category Not Found</h2>
                <p className="text-muted-foreground mt-2">
                  The category you're looking for doesn't exist.
                </p>
              </div>
              <Button onClick={() => navigate({ to: '/categories' })}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/categories' })}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleToggleActive}
            className="gap-2"
          >
            {category.isActive ? (
              <>
                <EyeOff className="h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Activate
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: `/categories/${categoryId}/edit` })}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Category Info */}
        <div className="lg:col-span-1 animate-in fade-in slide-in-from-left-4 duration-500">
          <Card className="sticky top-8">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Category Icon/Color */}
                <div className="animate-in zoom-in-50 duration-700 delay-100">
                  <div
                    className="w-32 h-32 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      backgroundColor: category.color || '#6366f1',
                    }}
                  >
                    {category.icon ? (
                      <span className="text-6xl">{category.icon}</span>
                    ) : (
                      <Tag className="h-16 w-16 text-white" />
                    )}
                  </div>
                </div>

                {/* Category Name */}
                <div className="space-y-2 w-full">
                  <h1 className="text-3xl font-bold tracking-tight wrap-break-word">
                    {category.name}
                  </h1>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <Badge
                      variant={category.isActive ? 'default' : 'secondary'}
                      className="gap-1"
                    >
                      {category.isActive ? (
                        <>
                          <ToggleRight className="h-3 w-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-3 w-3" />
                          Inactive
                        </>
                      )}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs">
                      {category.slug}
                    </Badge>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <BookOpen className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-2xl font-bold">{category.bookCount}</div>
                    <div className="text-xs text-muted-foreground">Books</div>
                  </div>
                  <div className="text-center">
                    <FolderTree className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-2xl font-bold">
                      {category.subcategories?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Subcategories
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
          {/* Description */}
          {category.description && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Subcategories */}
          {category.subcategories && category.subcategories.length > 0 && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderTree className="h-5 w-5" />
                  Subcategories ({category.subcategories.length})
                </CardTitle>
                <CardDescription>
                  Child categories under {category.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub._id}
                      onClick={() =>
                        navigate({ to: `/categories/${sub._id}` })
                      }
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-lg border-2 transition-all hover:shadow-md hover:scale-105',
                        'text-left hover:border-primary/50'
                      )}
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: sub.color || '#6366f1' }}
                      >
                        {sub.icon ? (
                          <span className="text-2xl">{sub.icon}</span>
                        ) : (
                          <Tag className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{sub.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {sub.bookCount} books
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Books Preview */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Books in this Category
              </CardTitle>
              <CardDescription>
                Recent books categorized under {category.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {category.booksPreview && category.booksPreview.length > 0 ? (
                <div className="space-y-3">
                  {category.booksPreview.map((book) => (
                    <div
                      key={book._id}
                      className="flex items-start gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate({ to: `/books/${book._id}` })}
                    >
                      <div className="w-12 h-16 bg-muted rounded shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{book.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {book.isbn}
                        </p>
                        <Badge
                          variant={
                            book.status === 'available'
                              ? 'default'
                              : 'secondary'
                          }
                          className="mt-1"
                        >
                          {book.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {category.bookCount > 10 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        navigate({
                          to: '/books',
                          search: { categoryId: category._id },
                        })
                      }
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View all {category.bookCount} books
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No books in this category yet</p>
                  <Button variant="link" className="mt-2">
                    Add a book
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 hover:bg-muted/50 px-2 rounded-md transition-colors">
                <span className="text-sm font-medium">Slug</span>
                <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                  {category.slug}
                </code>
              </div>

              {category.color && (
                <div className="flex items-center justify-between py-2 hover:bg-muted/50 px-2 rounded-md transition-colors">
                  <span className="text-sm font-medium">Color</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: category.color }}
                    />
                    <code className="text-sm text-muted-foreground">
                      {category.color}
                    </code>
                  </div>
                </div>
              )}

              {category.icon && (
                <div className="flex items-center justify-between py-2 hover:bg-muted/50 px-2 rounded-md transition-colors">
                  <span className="text-sm font-medium">Icon</span>
                  <span className="text-2xl">{category.icon}</span>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between py-2 hover:bg-muted/50 px-2 rounded-md transition-colors">
                <span className="text-sm font-medium">Created</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(category.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 hover:bg-muted/50 px-2 rounded-md transition-colors">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(category.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{category.name}</strong>?
              This action cannot be undone.
              {category.bookCount > 0 && (
                <span className="block mt-3 text-destructive font-medium">
                  Warning: This category has {category.bookCount}{' '}
                  {category.bookCount === 1 ? 'book' : 'books'}. You must
                  either move them to another category or they will be
                  unassigned.
                </span>
              )}
              {category.subcategories && category.subcategories.length > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  This category has {category.subcategories.length}{' '}
                  subcategories. Please remove them first.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={
                (category.subcategories && category.subcategories.length > 0) ||
                false
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}