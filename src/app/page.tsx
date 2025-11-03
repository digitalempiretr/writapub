
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Check, Menu } from "lucide-react"
import Link from 'next/link'
import { Logo } from "@/components/logo"
import Image from "next/image"
import { designTemplates } from "@/lib/design-templates"

export default function LandingPage() {
  const features = [
    { name: "Intelligent Text Splitting", description: "Writa automatically divides your long texts into perfectly sized, easy-to-read slides." },
    { name: "Beautiful Templates", description: "Choose from a wide range of professionally designed templates to match your style." },
    { name: "Custom Branding", description: "Add your own logo, colors, and fonts to maintain a consistent brand identity." },
    { name: "One-Click Export", description: "Download your entire carousel as high-quality images, ready to post." },
    { name: "AI-Powered Suggestions", description: "Get smart recommendations for layouts and designs to enhance your content." },
    { name: "Multi-Platform Formats", description: "Generate designs optimized for Instagram Posts, Stories, LinkedIn, and more." },
  ]

  const pricingTiers = [
    {
      name: "Basic",
      price: "£2",
      description: "For starters who want to create stunning content.",
      features: ["20 designs per month", "Access to all basic templates", "Standard support"],
      cta: "Choose Basic",
    },
    {
      name: "Pro",
      price: "£5",
      description: "For professionals who need more creative power.",
      features: ["75 designs per month", "Access to all premium templates", "Advanced customization", "Priority support"],
      cta: "Choose Pro",
      popular: true,
    },
    {
      name: "Unlimited",
      price: "£20",
      description: "For creators and agencies with high-volume needs.",
      features: ["Unlimited designs", "All Pro features", "Team collaboration (coming soon)", "Dedicated support"],
      cta: "Choose Unlimited",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Logo className="text-lg text-primary" />
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="#features" className="text-foreground/60 transition-colors hover:text-foreground/80">Features</Link>
              <Link href="#templates" className="text-foreground/60 transition-colors hover:text-foreground/80">Templates</Link>
              <Link href="#pricing" className="text-foreground/60 transition-colors hover:text-foreground/80">Pricing</Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="flex-1 md:flex-grow-0">
               {/* Mobile menu could be added here */}
            </div>
            <nav className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </nav>
            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-serif">
                    Turn Your Words into <span className="text-primary">Stunning</span> Visuals
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Writa is the effortless way to transform your text into beautiful, shareable carousels for social media. No design skills required.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                     <Link href="/signup">Get Started for Free</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#templates">Explore Templates</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://picsum.photos/seed/hero/600/400"
                width="600"
                height="400"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                data-ai-hint="carousel design"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Effortless Content Creation</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Focus on your message. Writa takes care of the design, formatting, and export, saving you hours of work.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col justify-center space-y-4">
                  <Check className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">{feature.name}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Section */}
        <section id="templates" className="w-full py-20 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Find Your Perfect Look</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Browse our library of professionally designed templates. From minimalist to bold, there's a style for every message.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 py-12">
              {designTemplates.slice(0, 8).map((template, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <Image
                      src={template.previewImage || `https://picsum.photos/seed/template${index}/400/500`}
                      width="400"
                      height="500"
                      alt={template.name}
                      className="aspect-[4/5] w-full object-cover transition-transform duration-300 hover:scale-105"
                       data-ai-hint="template design"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-20 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Pricing</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that's right for you. No hidden fees.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              {pricingTiers.map((tier) => (
                <Card key={tier.name} className={tier.popular ? "border-2 border-primary" : ""}>
                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                      {tier.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

         {/* Call to Action Section */}
        <section className="w-full py-20 md:py-24 lg:py-32 bg-primary/10">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Elevate Your Content?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Stop spending hours on design. Start creating beautiful carousels in minutes.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
               <Button size="lg" asChild>
                  <Link href="/signup">Sign Up Now</Link>
                </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full bg-card">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Logo className="text-lg text-primary"/>
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by you. Powered by AI.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Writa Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
