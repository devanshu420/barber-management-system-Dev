"use client";

import ChatbotIcon from '../components/chatbot/ChatbotIcon';
import { Navbar } from "@/components/navbar"
import Home from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import  BussinessRelation from "@/components/BussinessRelation"
import  Quality from "@/components/Quality"
import AboutService from "@/components/AboutService";

import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <main>
        <Home />
        <ServicesSection />
        <BussinessRelation />
        <Quality />
        <AboutService />
        <Footer />
      </main>

      
      <ChatbotIcon />
    </div>
  );
}


// "use client";

// import { Navbar } from "@/components/navbar"
// import Home from "@/components/hero-section"
// import { ServicesSection } from "@/components/services-section"
// import  BussinessRelation from "@/components/BussinessRelation"
// import  Quality from "@/components/Quality"
// import AboutService from "@/components/AboutService";
// import FeautureInclude from "@/components/FeautureInclude";
// import Footer from "@/components/Footer";


// // import  Footer from "@/components/Footer"


// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <main>
//         <Home />
//         <ServicesSection />
//         <BussinessRelation />
//         <Quality />
//         <AboutService />
//         <Footer />
//       </main>
//     </div>
//   )
// }
