
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, FileText, BarChart2, Star, Settings, Home, Files, CreditCard, User } from "lucide-react"
import Link from 'next/link'
import { Logo } from "@/components/logo"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
                <Logo className="h-6 w-auto text-primary" />
            </Link>
        </div>
        <nav className="flex flex-col gap-y-1 p-2">
          <Button variant="secondary" className="justify-start">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="justify-start">
            <Files className="mr-2 h-4 w-4" />
            My Designs
          </Button>
          <Button variant="ghost" className="justify-start">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </Button>
          <Button variant="ghost" className="justify-start">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </nav>
        <div className="mt-auto p-4">
             <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User Avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-sm">[User Name]</p>
                    <p className="text-xs text-muted-foreground">Pro Plan</p>
                </div>
              </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col sm:ml-60">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="sm:hidden">
                 <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
                    <Logo className="h-6 w-auto text-primary" />
                </Link>
            </div>
            <div className="ml-auto flex items-center gap-2">
                {/* The "Create New" button was here and has been moved */}
            </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">An overview of your creative journey.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Designs
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscription
                  </CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Pro Plan</div>
                  <p className="text-xs text-muted-foreground">
                    Renews on July 30, 2024
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Designs Remaining</CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">60/75</div>
                   <p className="text-xs text-muted-foreground">
                    in current billing cycle
                  </p>
                </CardContent>
              </Card>
              <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Account
                  </CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Link href="#" className="text-sm font-medium hover:underline">
                        Manage Settings
                    </Link>
                     <p className="text-xs text-muted-foreground">
                        Profile, billing, and more.
                    </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>Recent Designs</CardTitle>
                    <CardDescription>
                      A list of your most recently created designs.
                    </CardDescription>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="/">Create New</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Design Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">My First Masterpiece</TableCell>
                        <TableCell>
                          <Badge variant="outline">Favorites</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-06-23
                        </TableCell>
                        <TableCell>
                           <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Summer Sale Promo</TableCell>
                        <TableCell>
                          <Badge variant="outline">Special Effects</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-06-20
                        </TableCell>
                        <TableCell>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </TableCell>
                      </TableRow>
                       <TableRow>
                        <TableCell className="font-medium">Inspirational Quote</TableCell>
                        <TableCell>
                          <Badge variant="outline">Color Styles</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-06-18
                        </TableCell>
                        <TableCell>
                           <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
         <nav className="fixed inset-x-0 bottom-0 z-10 border-t bg-background sm:hidden">
            <div className="grid grid-cols-5 h-14">
                <Button variant="ghost" size="icon" className="h-full w-full rounded-none flex-col text-xs gap-1">
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-full w-full rounded-none flex-col text-xs gap-1">
                    <Files className="h-5 w-5" />
                     <span>Designs</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-full w-full rounded-none flex-col text-xs gap-1">
                    <CreditCard className="h-5 w-5" />
                     <span>Billing</span>
                </Button>
                 <Button variant="ghost" size="icon" className="h-full w-full rounded-none flex-col text-xs gap-1">
                    <User className="h-5 w-5" />
                     <span>Profile</span>
                </Button>
                 <Button variant="ghost" size="icon" className="h-full w-full rounded-none flex-col text-xs gap-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User Avatar" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                     <span>Me</span>
                </Button>
            </div>
        </nav>
      </div>
    </div>
  )
}

    