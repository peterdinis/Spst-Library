import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  BookOpen,
  Search,
  Star,
  Library,
  Users
} from 'lucide-react'
import { getBooks, getAuthors, getCategories } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Home () {
  const { items: books } = await getBooks({ limit: 4 })
  const authors = await getAuthors()
  const categories = await getCategories()

  const topBooks = books
  const topAuthors = authors.slice(0, 3)
  const topCategories = categories.slice(0, 4)

  return (
    <div className='flex flex-col min-h-screen'>
      {/* Hero Section */}
      <section className='relative overflow-hidden rounded-[3rem] bg-linear-to-br from-slate-900 via-primary/90 to-slate-900 text-white dark:from-background dark:via-primary/20 dark:to-background border border-slate-800/50 shadow-2xl py-24 px-6 sm:px-12 text-center mb-24'>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className='absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent to-black/20 z-0'></div>

        <div className='relative z-10 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000'>
          <div className='inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-4 backdrop-blur-md shadow-inner border border-white/20'>
            <BookOpen className='h-10 w-10 text-primary-foreground' />
          </div>
          <h1 className='text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight'>
            Vaša Brána K <br />
            <span className='text-transparent bg-clip-text bg-linear-to-r from-emerald-300 to-cyan-300'>
              Nekonečným Príbehom
            </span>
          </h1>
          <p className='text-lg sm:text-2xl text-slate-200 font-light max-w-2xl mx-auto'>
            Najmodernejší knižničný systém SPŠT. Požičiavajte si knihy
            elektronicky, bleskovo a bez čakania.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-8'>
            <Link href='/books'>
              <Button
                size='lg'
                className='rounded-full shadow-xl bg-white text-primary hover:bg-slate-100 h-14 px-8 text-lg font-bold group'
              >
                <Search className='mr-2 h-5 w-5 group-hover:scale-110 transition-transform' />
                Prezerať Katalóg
              </Button>
            </Link>
            <Link href='/categories'>
              <Button
                size='lg'
                className='rounded-full shadow-xl bg-white text-primary hover:bg-slate-100 h-14 px-8 text-lg font-bold group'
              >
                Objavovať Kategórie
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trendy Knihy */}
      <section className='mb-24'>
        <div className='flex w-full justify-between items-end mb-10'>
          <div>
            <div className='flex items-center gap-2 mb-2 text-primary'>
              <Star className='h-5 w-5 fill-primary' />
              <span className='uppercase tracking-widest font-bold text-sm'>
                Novinky
              </span>
            </div>
            <h2 className='text-4xl font-extrabold tracking-tight'>
              Najnovšie prírastky
            </h2>
          </div>
          <Link href='/books'>
            <Button
              variant='ghost'
              className='hidden sm:flex rounded-full group'
            >
              Zobraziť všetky{' '}
              <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
            </Button>
          </Link>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
          {topBooks.map(book => (
            <Link href={`/books/${book.id}`} key={book.id} className='group'>
              <Card className='h-full bg-card/50 backdrop-blur-sm border-slate-200/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 rounded-3xl overflow-hidden'>
                <div className='aspect-3/4 relative overflow-hidden bg-slate-100 dark:bg-slate-900'>
                  {book.coverUrl ? (
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      fill
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      className='object-cover group-hover:scale-105 transition-transform duration-500'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <BookOpen className='h-12 w-12 text-slate-300' />
                    </div>
                  )}
                  <div className='absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200/20 shadow-sm'>
                    <span className='text-xs font-bold uppercase tracking-wider text-primary'>
                      {book.category?.name || 'Kniha'}
                    </span>
                  </div>
                </div>
                <CardContent className='p-6'>
                  <h3 className='font-bold text-xl mb-1 group-hover:text-primary transition-colors line-clamp-1'>
                    {book.title}
                  </h3>
                  <p className='text-slate-500 text-sm font-medium'>
                    {(book as any).author?.name || 'Neznámy autor'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-12 mb-24'>
        {/* Populárne Kategórie */}
        <section>
          <div className='flex items-center gap-2 mb-2 text-primary'>
            <Library className='h-5 w-5' />
            <span className='uppercase tracking-widest font-bold text-sm'>
              Žánre
            </span>
          </div>
          <div className='flex w-full justify-between items-end mb-8'>
            <h2 className='text-3xl font-extrabold tracking-tight'>
              Populárne Kategórie
            </h2>
            <Link href='/categories'>
              <Button variant='link' className='text-primary p-0'>
                Všetky
              </Button>
            </Link>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {topCategories.map(cat => (
              <Link href={`/categories/${cat.id}`} key={cat.id}>
                <Card className='bg-linear-to-br from-card to-secondary/30 hover:shadow-lg transition-all duration-300 border-slate-200/50 hover:border-primary/40 rounded-2xl group'>
                  <CardHeader className='p-6'>
                    <CardTitle className='text-lg group-hover:text-primary flex items-center justify-between'>
                      {cat.name}
                      <ArrowRight className='h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary' />
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Top Autori */}
        <section>
          <div className='flex items-center gap-2 mb-2 text-primary'>
            <Users className='h-5 w-5' />
            <span className='uppercase tracking-widest font-bold text-sm'>
              Spisovatelia
            </span>
          </div>
          <div className='flex w-full justify-between items-end mb-8'>
            <h2 className='text-3xl font-extrabold tracking-tight'>
              Obľúbení Autori
            </h2>
            <Link href='/authors'>
              <Button variant='link' className='text-primary p-0'>
                Všetci
              </Button>
            </Link>
          </div>
          <div className='flex flex-col gap-4'>
            {topAuthors.map(author => (
              <Link href={`/authors/${author.id}`} key={author.id}>
                <Card className='bg-card/50 backdrop-blur-sm hover:bg-card transition-colors border-slate-200/50 hover:border-primary/30 rounded-2xl group hover:shadow-md'>
                  <CardHeader className='p-5 flex flex-row items-center gap-4'>
                    <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
                      <Users className='h-6 w-6 text-primary' />
                    </div>
                    <div>
                      <CardTitle className='text-lg group-hover:text-primary transition-colors'>
                        {author.name}
                      </CardTitle>
                      <p className='text-sm text-slate-500 line-clamp-1'>
                        {author.bio}
                      </p>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
