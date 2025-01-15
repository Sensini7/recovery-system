import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ArrowRight, Battery, Cable, Cpu, CloudSunIcon as SolarPanel } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <img
          src="/placeholder.svg?height=1080&width=1920"
          alt="Solar panel installation"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="z-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Revolutionize Your Solar Energy Recovery</h1>
          <p className="text-xl md:text-2xl mb-8">Harness the power of cutting-edge technology for optimal energy efficiency</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" onClick={() => navigate('/products')}>Browse Products</Button>
          </div>
        </div>
      </section>

      {/* Product Categories Showcase */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Product Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Solar Panels', icon: SolarPanel, description: 'High-efficiency panels for maximum energy capture', priceRange: '$200 - $500' },
              { title: 'Batteries', icon: Battery, description: 'Long-lasting storage solutions for 24/7 power', priceRange: '$500 - $2000' },
              { title: 'Controllers', icon: Cpu, description: 'Smart controllers for optimal system performance', priceRange: '$100 - $300' },
              { title: 'Cables', icon: Cable, description: 'Premium cables for reliable energy transmission', priceRange: '$50 - $150' },
            ].map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <category.icon className="w-10 h-10 mb-2" />
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Starting from</p>
                  <p className="text-lg font-semibold">{category.priceRange}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigate('/products')}>
                    View Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Products?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'High Efficiency',
                description: 'Our solar panels are designed to maximize energy capture in all conditions.',
              },
              {
                title: 'Smart Technology',
                description: 'Advanced controllers and monitoring systems for optimal performance.',
              },
              {
                title: 'Reliable Storage',
                description: 'Long-lasting batteries ensure continuous power supply day and night.',
              },
            ].map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <Tabs defaultValue="testimonial1" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="testimonial1">John D.</TabsTrigger>
              <TabsTrigger value="testimonial2">Sarah M.</TabsTrigger>
              <TabsTrigger value="testimonial3">Mike R.</TabsTrigger>
            </TabsList>
            <TabsContent value="testimonial1">
              <Card>
                <CardHeader>
                  <CardTitle>Exceptional Quality</CardTitle>
                  <CardDescription>
                    "The solar panels I purchased have exceeded my expectations. My energy bills have been significantly reduced!"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Residential Customer</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="testimonial2">
              <Card>
                <CardHeader>
                  <CardTitle>Great Support</CardTitle>
                  <CardDescription>
                    "The team was incredibly helpful in selecting the right products for my needs. Installation was smooth and professional."
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Business Owner</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="testimonial3">
              <Card>
                <CardHeader>
                  <CardTitle>Amazing Results</CardTitle>
                  <CardDescription>
                    "We've seen a 40% reduction in our energy costs since installing these solar panels. Highly recommended!"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Commercial Client</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Want More?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers who have made the switch to solar energy.</p>
          <Button size="lg" onClick={() => navigate('/login')}>Get Started</Button>
        </div>
      </section>
    </main>
  )
}
