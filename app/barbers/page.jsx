import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function BarbersPage() {
  const barbers = [
    {
      id: 1,
      name: "Marcus Johnson",
      specialty: "Classic Cuts & Beard Styling",
      experience: "8 years",
      rating: 4.9,
      reviews: 127,
      location: "Downtown Location",
      image: "/professional-barber-headshot.jpg",
      bio: "Specializes in traditional barbering techniques with a modern twist. Expert in fade cuts and beard sculpting.",
      skills: ["Fade Cuts", "Beard Styling", "Hot Towel Shaves", "Classic Cuts"],
    },
    {
      id: 2,
      name: "David Rodriguez",
      specialty: "Modern Styles & Hair Design",
      experience: "6 years",
      rating: 4.8,
      reviews: 98,
      location: "Uptown Location",
      image: "/young-barber-professional-photo.jpg",
      bio: "Creative stylist known for contemporary cuts and innovative hair designs. Passionate about the latest trends.",
      skills: ["Modern Cuts", "Hair Design", "Color Consultation", "Styling"],
    },
    {
      id: 3,
      name: "Anthony Williams",
      specialty: "Traditional Barbering",
      experience: "12 years",
      rating: 4.9,
      reviews: 203,
      location: "Main Street Location",
      image: "/experienced-barber-portrait.jpg",
      bio: "Master barber with over a decade of experience. Known for precision cuts and exceptional customer service.",
      skills: ["Traditional Cuts", "Straight Razor", "Mustache Styling", "Consultation"],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Meet Our Expert Barbers</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Skilled professionals dedicated to delivering exceptional grooming experiences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {barbers.map((barber) => (
            <Card key={barber.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-64 w-full">
                <Image src={barber.image || "/placeholder.svg"} alt={barber.name} fill className="object-cover" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1">{barber.name}</CardTitle>
                    <CardDescription className="font-medium text-primary">{barber.specialty}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{barber.rating}</span>
                    <span className="text-xs text-muted-foreground">({barber.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{barber.experience}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{barber.location}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{barber.bio}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {barber.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <Link href={`/booking?barber=${barber.id}`}>
                  <Button className="w-full">Book with {barber.name.split(" ")[0]}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/booking">
            <Button size="lg" className="px-8">
              Book Any Available Barber
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
